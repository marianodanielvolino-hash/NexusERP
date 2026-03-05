const fs = require('fs');

const raw = fs.readFileSync('supabase/demo_data.csv', 'utf16le');
const chunks = raw.split(/\r?\n\r?\n/).map(c => c.trim()).filter(c => c);

const tables = ['demo_area', 'demo_role', 'demo_user', 'demo_kpi', 'demo_target', 'demo_data'];
let sql = '-- SCRIPT PARA SUBIR TABLAS A LA DEMO REAL\n\n';

for (let i = 0; i < tables.length; i++) {
    const tName = tables[i];
    if (!chunks[i]) break;
    const lines = chunks[i].split(/\r?\n/).map(l => l.trim()).filter(l => l);
    const header = lines[0].split(',').map(h => h.trim());

    sql += 'CREATE TABLE IF NOT EXISTS ' + tName + ' (\n';
    const defs = header.map((col, idx) => {
        let type = 'VARCHAR(255)';
        if (col.includes('id') && col !== 'center_id') type = 'INTEGER';
        else if (col.includes('value')) type = 'DECIMAL(10,2)';
        else if (col.includes('description') || col.includes('method') || col.includes('permissions')) type = 'TEXT';

        return '    ' + col + ' ' + type + (idx === 0 ? ' PRIMARY KEY' : '');
    });
    sql += defs.join(',\n') + '\n);\n';
    sql += 'TRUNCATE TABLE ' + tName + ' CASCADE;\n\n';

    if (lines.length > 1) {
        sql += 'INSERT INTO ' + tName + ' (' + header.join(', ') + ') VALUES\n';
        const values = lines.slice(1).map(l => {
            let parts = l.split(',');
            // If a row has commas inside values, this simple split would break, 
            // but the data provided by user has no commas within values.
            return '(' + parts.map((p, j) => {
                p = p.trim().replace(/'/g, "''");
                const col = header[j];
                if ((col.includes('id') && col !== 'center_id') || col.includes('value')) {
                    return p; // numeric
                }
                return "'" + p + "'"; // string
            }).join(', ') + ')';
        });
        sql += values.join(',\n') + ';\n\n';
    }
}

fs.writeFileSync('supabase/demo_real_nexus.sql', sql, 'utf8');
console.log('Done generating supabase/demo_real_nexus.sql');
