const fs = require('fs');

const centers = Array.from({ length: 15 }, (_, i) => `CIS-${String(i + 1).padStart(2, '0')}`);
const periods = ["2025-08", "2025-09", "2025-10", "2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07"];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

const kpis_info = {
    1: { target: 58, type: "score", base: 65, noise: 5, email: "evaluacion@nexus.com" },
    2: { target: 10, type: "percent", base: 18, noise: 4, email: "coordinador.cis@nexus.com" },
    3: { target: 5, type: "percent", base: 12, noise: 3, email: "coordinador.cis@nexus.com" },
    4: { target: 80, type: "score", base: 65, noise: 7, email: "evaluacion@nexus.com" },
    5: { target: 14, type: "count", base: 22, noise: 5, email: "coordinador.cis@nexus.com" },
    6: { target: 75, type: "score", base: 50, noise: 8, email: "evaluacion@nexus.com" },
    7: { target: 85, type: "percent", base: 60, noise: 6, email: "coordinador.cis@nexus.com" },
    8: { target: 65, type: "percent", base: 40, noise: 8, email: "bienestar@nexus.com" },
    9: { target: 80, type: "percent", base: 65, noise: 5, email: "coordinador.cis@nexus.com" },
    10: { target: 75, type: "score", base: 55, noise: 6, email: "bienestar@nexus.com" },
    11: { target: 65, type: "score", base: 45, noise: 5, email: "bienestar@nexus.com" },
    12: { target: 70, type: "score", base: 50, noise: 5, email: "bienestar@nexus.com" },
};

const areas = [
    "1,Inclusion Social,Implementacion territorial de programas en CIS",
    "2,Desarrollo Humano,Programas de bienestar y desarrollo personal",
    "3,Salud,Apoyo psicoemocional y bienestar integral",
    "4,Educacion Formacion,Capacitacion y aprendizaje continuo",
    "5,Gestion Innovacion,Medicion impacto y mejora continua",
    "6,Administracion,Gestion contable y financiera",
    "7,Logistica y Operaciones,Gestion de infraestructura de CIS"
];

const roles = [
    "1,Administrador General,full_access",
    "2,Coordinador Territorial,manage_centers",
    "3,Facilitador Bienestar,manage_programs",
    "4,Analista Impacto,view_reports",
    "5,Instructor Corporal,deliver_sessions",
    "6,Usuario Prueba,basic_access",
    "7,Director de Sede,manage_local"
];

const users = [
    "1,victoria@nexus.com,Victoria Admin,1,5,active",
    "2,coordinador.cis@nexus.com,Coordinador CIS,2,1,active",
    "3,bienestar@nexus.com,Facilitador Bienestar,3,2,active",
    "4,evaluacion@nexus.com,Analista Impacto,4,5,active",
    "5,instructor@nexus.com,Instructor Corporal,5,2,active",
    "6,usuario.prueba1@nexus.com,Usuario Test 1,6,1,active",
    "7,usuario.prueba2@nexus.com,Usuario Test 2,6,2,active",
    "8,usuario.prueba3@nexus.com,Usuario Test 3,6,3,active",
    "9,usuario.prueba4@nexus.com,Usuario Test 4,6,4,active",
    "10,usuario.prueba5@nexus.com,Usuario Test 5,6,5,active",
    "11,director.norte@nexus.com,Director Zona Norte,7,1,active",
    "12,logistica@nexus.com,Encargado Mantenimiento,6,7,active",
    "13,medico.jefe@nexus.com,Responsable Salud,3,3,active"
];

const kpis_csv = [
    "1,BURNOUT_IDX,Indice de desgaste del staff,Staff,score_0_100,lower_is_better,Nivel de desgaste percibido por el staff,Promedio encuesta corta 0-100,Encuesta anonima,monthly,5",
    "2,ABSENT_RATE,Tasa de ausentismo,Staff,percent_0_100,lower_is_better,Ausencias sobre dias programados,(Dias ausentes / Dias programados)*100,Registro de asistencia,monthly,5",
    "3,TURNOVER_RATE,Rotacion de personal,Staff,percent_0_100,lower_is_better,Cambios de dotacion en el periodo,(Bajas / Dotacion promedio)*100,RRHH/Registro,quarterly,5",
    "4,STAFF_SELF_EFF,Autoeficacia del staff,Staff,score_0_100,higher_is_better,Percepcion de capacidad para intervenir efectivamente,Promedio encuesta 0-100,Encuesta anonima,monthly,5",
    "5,INCIDENTS_CNT,Incidentes y conflictos registrados,Dispositivo,count,lower_is_better,Conflictos/episodios registrados en el CIS,Conteo de incidentes por periodo,Registro operativo,monthly,1",
    "6,SAFETY_CLIMATE,Clima de convivencia y seguridad,Dispositivo,score_0_100,higher_is_better,Percepcion de convivencia respetuosa y seguridad,Promedio encuesta corta 0-100,Encuesta breve,monthly,1",
    "7,ACTIVITY_CONT,Continuidad de actividades,Dispositivo,percent_0_100,higher_is_better,Actividades realizadas vs planificadas,(Realizadas / Planificadas)*100,Planilla de actividades,monthly,1",
    "8,PARTICIP_RATE,Participacion en espacios del ser,Comunidad,percent_0_100,higher_is_better,Participacion efectiva de residentes en actividades,(Asistencias / Cupos)*100,Registro de asistencia,monthly,2",
    "9,RETENTION_RATE,Permanencia en el dispositivo,Comunidad,percent_0_100,higher_is_better,Permanencia de residentes durante el periodo,(Permanecen / Total inicio)*100,Registro CIS,monthly,1",
    "10,ROUTINE_ADH,Adherencia a rutina y habitos,Autonomia,score_0_100,higher_is_better,Capacidad de sostener rutinas (horarios y autocuidado),Checklist observacional 0-100,Observacion estructurada,monthly,2",
    "11,LANG_SHIFT,Cambio en narrativa y lenguaje,Autonomia,score_0_100,higher_is_better,Evolucion del lenguaje de victima a protagonista,Rubrica 0-100 por muestra,Rubrica facilitador,monthly,2",
    "12,PROSOCIAL_IDX,Indice de vinculo prosocial,Autonomia,score_0_100,higher_is_better,Conductas de cooperacion y convivencia,Rubrica 0-100,Rubrica equipo,monthly,2"
];

let all_lines = [];
all_lines.push("area_id,area_name,description\n" + areas.join("\n"));
all_lines.push("role_id,role_name,permissions\n" + roles.join("\n"));
all_lines.push("user_id,email,name,role_id,area_id,status\n" + users.join("\n"));
all_lines.push("kpi_id,kpi_code,kpi_name,domain,unit,polarity,description,calculation_method,collection_method,frequency,owner_area_id\n" + kpis_csv.join("\n"));

let targets_csv = ["target_id,center_id,kpi_id,period,baseline_value,target_value"];
let target_id = 1;
for (let c of centers) {
    for (let k = 1; k <= 12; k++) {
        let info = kpis_info[k];
        let base = info.base;
        let t = info.target;
        let offset = randomInt(-5, 5);
        let c_base = Math.max(0, base + offset);
        let c_t = Math.max(0, Math.round(t + offset / 2));
        targets_csv.push(`${target_id},${c},${k},2026-07,${c_base},${c_t}`);
        target_id++;
    }
}
all_lines.push(targets_csv.join("\n"));

let data_csv = ["data_id,center_id,kpi_id,period,value,source,user_email"];
let data_id = 1;

for (let c of centers) {
    let center_improvement = randomFloat(0.5, 1.5);

    for (let k = 1; k <= 12; k++) {
        let info = kpis_info[k];
        let current_val = info.base + randomInt(-info.noise, info.noise);

        for (let p_idx = 0; p_idx < periods.length; p_idx++) {
            let target = info.target;
            let diff_to_target = target - current_val;

            let step = (diff_to_target / Math.max(1, periods.length - p_idx)) * center_improvement;
            current_val += step + randomFloat(-info.noise / 2, info.noise / 2);

            if (info.type === "score" || info.type === "percent") {
                current_val = Math.max(0, Math.min(100, current_val));
            } else if (info.type === "count") {
                current_val = Math.max(0, current_val);
            }

            let val_out = Math.round(current_val);
            let email = info.email;

            data_csv.push(`${data_id},${c},${k},${periods[p_idx]},${val_out},System,${email}`);
            data_id++;
        }
    }
}
all_lines.push(data_csv.join("\n"));

let final_csv = all_lines.join("\n\n");
fs.writeFileSync('supabase/demo_data.csv', "\ufeff" + final_csv, 'utf16le');
console.log("demo_data.csv written via Node in utf16le.");
