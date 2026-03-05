import csv
import random
from datetime import datetime
from dateutil.relativedelta import relativedelta

centers = [f"CIS-{str(i).zfill(2)}" for i in range(1, 11)]
periods = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07"]

kpis_info = {
    1: {"target": 58, "polarity": "lower", "type": "score", "base": 65, "noise": 5, "email": "evaluacion@nexus.com"},
    2: {"target": 10, "polarity": "lower", "type": "percent", "base": 15, "noise": 3, "email": "coordinador.cis@nexus.com"},
    3: {"target": 5, "polarity": "lower", "type": "percent", "base": 8, "noise": 2, "email": "coordinador.cis@nexus.com"},
    4: {"target": 80, "polarity": "higher", "type": "score", "base": 70, "noise": 5, "email": "evaluacion@nexus.com"},
    5: {"target": 14, "polarity": "lower", "type": "count", "base": 20, "noise": 4, "email": "coordinador.cis@nexus.com"},
    6: {"target": 75, "polarity": "higher", "type": "score", "base": 60, "noise": 6, "email": "evaluacion@nexus.com"},
    7: {"target": 85, "polarity": "higher", "type": "percent", "base": 75, "noise": 5, "email": "coordinador.cis@nexus.com"},
    8: {"target": 65, "polarity": "higher", "type": "percent", "base": 50, "noise": 8, "email": "bienestar@nexus.com"},
    9: {"target": 80, "polarity": "higher", "type": "percent", "base": 70, "noise": 5, "email": "coordinador.cis@nexus.com"},
    10: {"target": 75, "polarity": "higher", "type": "score", "base": 65, "noise": 6, "email": "bienestar@nexus.com"},
    11: {"target": 65, "polarity": "higher", "type": "score", "base": 55, "noise": 5, "email": "bienestar@nexus.com"},
    12: {"target": 70, "polarity": "higher", "type": "score", "base": 60, "noise": 5, "email": "bienestar@nexus.com"}
}

areas = [
    "1,Inclusion Social,Implementacion territorial de programas en CIS",
    "2,Desarrollo Humano,Programas de bienestar y desarrollo personal",
    "3,Salud,Apoyo psicoemocional y bienestar integral",
    "4,Educacion Formacion,Capacitacion y aprendizaje continuo",
    "5,Gestion Innovacion,Medicion impacto y mejora continua",
    "6,Administracion,Gestion contable y financiera",
    "7,Logistica,Distribucion y mantenimiento"
]

roles = [
    "1,Administrador General,full_access",
    "2,Coordinador Territorial,manage_centers",
    "3,Facilitador Bienestar,manage_programs",
    "4,Analista Impacto,view_reports",
    "5,Instructor Corporal,deliver_sessions",
    "6,Usuario Prueba,basic_access",
    "7,Director de Sede,manage_local",
    "8,Auditor Externo,read_only"
]

users = [
    f"1,victoria@nexus.com,Victoria Admin,1,5,active",
    f"2,coordinador.cis@nexus.com,Coordinador CIS,2,1,active",
    f"3,bienestar@nexus.com,Facilitador Bienestar,3,2,active",
    f"4,evaluacion@nexus.com,Analista Impacto,4,5,active",
    f"5,instructor@nexus.com,Instructor Corporal,5,2,active",
    f"6,usuario.prueba1@nexus.com,Usuario Test 1,6,1,active",
    f"7,usuario.prueba2@nexus.com,Usuario Test 2,6,2,active",
    f"8,usuario.prueba3@nexus.com,Usuario Test 3,6,3,active",
    f"9,usuario.prueba4@nexus.com,Usuario Test 4,6,4,active",
    f"10,usuario.prueba5@nexus.com,Usuario Test 5,6,5,active",
    f"11,director.norte@nexus.com,Director Norte,7,1,active",
    f"12,director.sur@nexus.com,Director Sur,7,1,active",
    f"13,auditor.calidad@nexus.com,Auditor General,8,6,active",
    f"14,medico.jefe@nexus.com,Jefe Medico,3,3,active",
    f"15,formador.it@nexus.com,Formador IT,5,4,active"
]

kpis_csv = [
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
]

all_lines = []
all_lines.append("area_id,area_name,description\n" + "\n".join(areas))
all_lines.append("role_id,role_name,permissions\n" + "\n".join(roles))
all_lines.append("user_id,email,name,role_id,area_id,status\n" + "\n".join(users))
all_lines.append("kpi_id,kpi_code,kpi_name,domain,unit,polarity,description,calculation_method,collection_method,frequency,owner_area_id\n" + "\n".join(kpis_csv))

targets_csv = ["target_id,center_id,kpi_id,period,baseline_value,target_value"]
target_id = 1
for center in centers:
    for kpi in range(1, 13):
        # We will set targets for the latest period for simplicity
        base = kpis_info[kpi]["base"]
        t = kpis_info[kpi]["target"]
        center_offset = random.randint(-5, 5) # Slight variation per center
        c_base = max(0, base + center_offset)
        c_t = max(0, t + center_offset // 2)
        targets_csv.append(f"{target_id},{center},{kpi},2026-07,{c_base},{c_t}")
        target_id += 1
all_lines.append("\n".join(targets_csv))


data_csv = ["data_id,center_id,kpi_id,period,value,source,user_email"]
data_id = 1

for center in centers:
    # Give some personality to centers (some improve faster, some slower)
    center_improvement = random.uniform(0.5, 1.5)
    
    for kpi in range(1, 13):
        info = kpis_info[kpi]
        base = info["base"]
        
        # Start somewhere near base
        current_val = base + random.randint(-info["noise"], info["noise"])
        
        for p_idx, period in enumerate(periods):
            # Calculate a trending value towards target
            # if polarity is higher, it should generally go up
            # if polarity is lower, it should generally go down
            # adding some noise
            
            target = info["target"]
            diff_to_target = target - current_val
            
            step = diff_to_target / max(1, (len(periods) - p_idx)) * center_improvement
            current_val += step + random.uniform(-info["noise"]/2, info["noise"]/2)
            
            if info["type"] in ["score", "percent"]:
                current_val = max(0, min(100, current_val))
            elif info["type"] == "count":
                current_val = max(0, current_val)
                
            val_out = round(current_val)
            if val_out < 0:
                val_out = 0
                
            source = "Survey" if "Encuesta" in "Survey" else "System" # Simplify, we dont need precise source, maybe 'OpsLog' or 'Registro'
            email = info["email"]
            data_csv.append(f"{data_id},{center},{kpi},{period},{val_out},AutoGen,{email}")
            data_id += 1

all_lines.append("\n".join(data_csv))

full_content = "\n\n".join(all_lines)
with open("supabase/demo_data.csv", "w", encoding="utf16") as f:
    f.write(full_content)

print("Demo data generated successfully.")
