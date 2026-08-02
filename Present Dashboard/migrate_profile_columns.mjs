import { neon } from '@neondatabase/serverless';

const DB_URL = process.env.VITE_NEON_URL || process.env.DATABASE_URL || '';
const sql = neon(DB_URL);

console.log('🚀 Running profile columns migration for CGPA & Graduation Year...');

const columns = [
  { name: 'graduation_year', type: 'TEXT' },
  { name: 'cgpa',            type: 'TEXT' },
];

for (const col of columns) {
  try {
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ${sql.unsafe(col.name)} ${sql.unsafe(col.type)}`;
    console.log(`  ✅ Column '${col.name}' ensured (${col.type})`);
  } catch (e) {
    console.warn(`  ⚠️ Column '${col.name}' error: ${e.message}`);
  }
}

console.log('✅ Migration complete!');
