import { neon } from '@neondatabase/serverless';

const DB_URL = 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
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
