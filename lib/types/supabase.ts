export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            clients: {
                Row: {
                    accent: string | null
                    color: string | null
                    country: string | null
                    created_at: string | null
                    full_name: string | null
                    id: string
                    logo: string | null
                    name: string
                    plan: string | null
                    since: string | null
                    slug: string
                    status: string | null
                }
                Insert: {
                    accent?: string | null
                    color?: string | null
                    country?: string | null
                    created_at?: string | null
                    full_name?: string | null
                    id?: string
                    logo?: string | null
                    name: string
                    plan?: string | null
                    since?: string | null
                    slug: string
                    status?: string | null
                }
                Update: {
                    accent?: string | null
                    color?: string | null
                    country?: string | null
                    created_at?: string | null
                    full_name?: string | null
                    id?: string
                    logo?: string | null
                    name?: string
                    plan?: string | null
                    since?: string | null
                    slug?: string
                    status?: string | null
                }
            }
            kpi_data: {
                Row: {
                    created_at: string | null
                    id: string
                    kpi_id: string
                    loaded_by: string | null
                    notes: string | null
                    period: string
                    source: string | null
                    validated: boolean | null
                    validated_by: string | null
                    value: number
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    kpi_id: string
                    loaded_by?: string | null
                    notes?: string | null
                    period: string
                    source?: string | null
                    validated?: boolean | null
                    validated_by?: string | null
                    value: number
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    kpi_id?: string
                    loaded_by?: string | null
                    notes?: string | null
                    period?: string
                    source?: string | null
                    validated?: boolean | null
                    validated_by?: string | null
                    value?: number
                }
            }
            kpi_targets: {
                Row: {
                    baseline: number | null
                    created_at: string | null
                    id: string
                    kpi_id: string
                    period: string
                    target: number
                }
                Insert: {
                    baseline?: number | null
                    created_at?: string | null
                    id?: string
                    kpi_id: string
                    period: string
                    target: number
                }
                Update: {
                    baseline?: number | null
                    created_at?: string | null
                    id?: string
                    kpi_id?: string
                    period?: string
                    target?: number
                }
            }
            kpis: {
                Row: {
                    active: boolean | null
                    area: string
                    calculation_method: string | null
                    code: string
                    created_at: string | null
                    description: string | null
                    display_order: number | null
                    frequency: string | null
                    id: string
                    name: string
                    polarity: string | null
                    project_id: string
                    unit: string | null
                }
                Insert: {
                    active?: boolean | null
                    area: string
                    calculation_method?: string | null
                    code: string
                    created_at?: string | null
                    description?: string | null
                    display_order?: number | null
                    frequency?: string | null
                    id?: string
                    name: string
                    polarity?: string | null
                    project_id: string
                    unit?: string | null
                }
                Update: {
                    active?: boolean | null
                    area?: string
                    calculation_method?: string | null
                    code?: string
                    created_at?: string | null
                    description?: string | null
                    display_order?: number | null
                    frequency?: string | null
                    id?: string
                    name?: string
                    polarity?: string | null
                    project_id?: string
                    unit?: string | null
                }
            }
            projects: {
                Row: {
                    areas: string[] | null
                    client_id: string
                    created_at: string | null
                    description: string | null
                    icon: string | null
                    id: string
                    name: string
                    slug: string
                    status: string | null
                }
                Insert: {
                    areas?: string[] | null
                    client_id: string
                    created_at?: string | null
                    description?: string | null
                    icon?: string | null
                    id?: string
                    name: string
                    slug: string
                    status?: string | null
                }
                Update: {
                    areas?: string[] | null
                    client_id?: string
                    created_at?: string | null
                    description?: string | null
                    icon?: string | null
                    id?: string
                    name?: string
                    slug?: string
                    status?: string | null
                }
            }
            user_profiles: {
                Row: {
                    active: boolean | null
                    avatar_url: string | null
                    client_id: string | null
                    created_at: string | null
                    email: string | null
                    full_name: string | null
                    id: string
                    last_login: string | null
                    role: string | null
                }
                Insert: {
                    active?: boolean | null
                    avatar_url?: string | null
                    client_id?: string | null
                    created_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    id: string
                    last_login?: string | null
                    role?: string | null
                }
                Update: {
                    active?: boolean | null
                    avatar_url?: string | null
                    client_id?: string | null
                    created_at?: string | null
                    email?: string | null
                    full_name?: string | null
                    id?: string
                    last_login?: string | null
                    role?: string | null
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            is_super_admin: {
                Args: Record<PropertyKey, never>
                Returns: boolean
            }
            my_client_id: {
                Args: Record<PropertyKey, never>
                Returns: string
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
