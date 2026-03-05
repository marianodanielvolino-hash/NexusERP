import csv
import re

sections = []
current_section = []
with open('supabase/demo_data.csv', 'r') as f:
    for line in f:
        line = line.strip()
        if not line:
            if current_section:
                sections.append(current_section)
                current_section = []
        else:
            current_section.append(line)
if current_section:
    sections.append(current_section)

table_names = ['area', 'role', 'users', 'kpi', 'target', 'data']

with open('supabase/demo_real_nexus.sql', 'w') as out:
    out.write("-- ESTE SCRIPT CREA LAS TABLAS Y LOS DATOS PARA LA DEMO REAL\n\n")
    
    for i, section in enumerate(sections):
        if i >= len(table_names): break
        
        table_name = "demo_" + table_names[i]
        header = section[0].split(',')
        columns = [h.strip() for h in header]
        
        if table_name == 'demo_users':
           out.write(f"CREATE TABLE IF NOT EXISTS {{table_name}} (\n")
        else:
           out.write(f"CREATE TABLE IF NOT EXISTS {{table_name}} (\n")
           
        # Just use reasonable types
        # Very simple schema inference
        cols_sql = []
        for col in columns:
           if 'id' in col and not col == 'center_id':
              cols_sql.append(f"  {{col}} INTEGER")
           elif 'value' in col:
              cols_sql.append(f"  {{col}} DECIMAL(10,2)")
           else:
              cols_sql.append(f"  {{col}} VARCHAR(255)")
              
        cols_sql[0] += " PRIMARY KEY" if not table_name == 'demo_data' else ""
        out.write(",\n".join(cols_sql))
        out.write("\n);\n")
        
        out.write(f"TRUNCATE TABLE {{table_name}} CASCADE;\n\n")
        
        out.write(f"INSERT INTO {{table_name}} ({{', '.join(columns)}}) VALUES\n")
        
        values_lines = []
        for row in section[1:]:
            parts = [p.strip() for p in row.split(',')]
            val_parts = []
            for j, p in enumerate(parts):
                if 'id' in columns[j] and columns[j] != 'center_id':
                   val_parts.append(p)
                elif 'value' in columns[j]:
                   val_parts.append(p)
                else:
                   safe_p = p.replace("'", "''")
                   val_parts.append(f"'{safe_p}'")
            values_lines.append("(" + ", ".join(val_parts) + ")")
            
        out.write(",\n".join(values_lines))
        out.write(";\n\n")

print("SQL file generated successfully.")
