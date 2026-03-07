'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * Generar URL firmada para SUBIR una evidencia (Signed PUT)
 */
export async function getUploadSignedUrl(entryId: string, fileName: string, contentType: string) {
    const supabase = await createClient()

    // 1. Validar Usuario y Permisos
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    // Validar si el KPI pertenece a su área y está en Draft/Submitted (las policy Insert/Update de supabase también lo atajan, pero verificamos acá para omitir fallos opacos)
    const { data: entryData, error: entryError } = await supabase
        .from('kpi_data')
        .select('tenant_id, estado_flujo')
        .eq('entry_id', entryId)
        .single()

    if (entryError || !entryData) throw new Error('KPI data is missing or inaccessible')

    if (entryData.estado_flujo !== 'Draft' && entryData.estado_flujo !== 'Submitted') {
        throw new Error('Solo se pueden adjuntar evidencias a KPIs en estado Draft o Submitted')
    }

    // 2. Definir Patrón de Ruteo interno: tenant_id/entry_id/filename
    const storagePath = `${entryData.tenant_id}/${entryId}/${Date.now()}_${fileName}`

    // 3. Generar Signed Upload URL (válida por 60 seg)
    const { data: signedData, error: signedError } = await supabase
        .storage
        .from('evidence_files')
        .createSignedUploadUrl(storagePath)

    if (signedError) throw new Error(`Error generando URL de subida: ${signedError.message}`)

    return { signedUrl: signedData.signedUrl, token: signedData.token, path: signedData.path }
}

/**
 * Registra formalmente la evidencia subida en la BD
 */
export async function registerEvidence(entryId: string, storagePath: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    const { data, error } = await supabase
        .from('evidence_store')
        .insert({
            entry_id: entryId,
            url_storage: storagePath,
            uploaded_by: user.id
        })
        .select()
        .single()

    if (error) throw new Error(`Error registrando la evidencia: ${error.message}`)

    // Audit
    await supabase.from('audit_logs').insert({
        user_id: user.id,
        tenant_id: data.tenant_id,
        entidad: 'evidence_store',
        entidad_id: data.file_id,
        accion: 'upload',
        detalles: { path: storagePath }
    })

    revalidatePath('/dashboard')
    return data
}

/**
 * Generar URL firmada para DESCARGAR una evidencia (Signed GET)
 */
export async function getDownloadSignedUrl(fileId: string) {
    const supabase = await createClient()

    // 1. Recuperar el path verificando que RLS permite a este rol/tenant consultarlo
    const { data: fileData, error: fileError } = await supabase
        .from('evidence_store')
        .select('url_storage, kpi_data(tenant_id)')
        .eq('file_id', fileId)
        .single()

    if (fileError || !fileData) throw new Error('Evidencia inaccesible o inexistente')

    // 2. Generar GET firmado
    const { data, error } = await supabase
        .storage
        .from('evidence_store')
        .createSignedUrl(fileData.url_storage, 60) // Expira en 60 segundos

    if (error) throw new Error(`Error generando URL de descarga: ${error.message}`)

    // Audit
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        await supabase.from('audit_logs').insert({
            user_id: user.id,
            tenant_id: (fileData.kpi_data as any).tenant_id,
            entidad: 'evidence_store',
            entidad_id: fileId,
            accion: 'download'
        })
    }

    return { signedUrl: data.signedUrl }
}

/**
 * Soft Delete / Revocar evidencia
 */
export async function revokeEvidence(fileId: string, comentario: string) {
    if (!comentario) throw new Error('Especifique un motivo para la revocación')

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    const { data, error } = await supabase
        .from('evidence_store')
        .update({ estado: 'revocada' })
        .eq('file_id', fileId)
        .select()
        .single()

    if (error) throw new Error(`Error revocando evidencia: ${error.message}`)

    await supabase.from('audit_logs').insert({
        user_id: user.id,
        tenant_id: data.tenant_id,
        entidad: 'evidence_store',
        entidad_id: fileId,
        accion: 'revoke',
        comentario: comentario
    })

    revalidatePath('/dashboard')
    return data
}

export async function getEvidences() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('evidence_store')
            .select(`
                file_id,
                url_storage,
                estado,
                uploaded_at,
                kpi_data (
                    period_id,
                    kpi_definitions (nombre)
                )
            `)

        if (error) {
            console.error("Error fetching evidences:", error)
            return []
        }

        return data.map((d: any) => ({
            id: d.file_id || String(Math.random()),
            filename: d.url_storage ? d.url_storage.split('/').pop() : "documento.pdf",
            kpi: d.kpi_data?.kpi_definitions?.nombre || "Desconocido",
            date: d.uploaded_at ? new Date(d.uploaded_at).toLocaleDateString() : "-",
            uploadedBy: "Sistema",
            size: "-"
        }))
    } catch (err) {
        console.error("Exception evidences:", err)
        return []
    }
}
