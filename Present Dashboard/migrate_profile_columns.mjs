import { neon } from '@neondatabase/serverless';

const DB_URL = 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(DB_URL);

console.log('🚀 Running profile columns migration...');

const columns = [
  { name: 'phone',            type: 'TEXT' },
  { name: 'dob',              type: 'TEXT' },
  { name: 'gender',           type: 'TEXT' },
  { name: 'university',       type: 'TEXT' },
  { name: 'branch',           type: 'TEXT' },
  { name: 'specialization',   type: 'TEXT' },
  { name: 'year',             type: 'TEXT' },
  { name: 'division',         type: 'TEXT' },
  { name: 'prn_number',       type: 'TEXT' },
  { name: 'selected_domain',  type: 'TEXT' },
  { name: 'experience_level', type: 'TEXT' },
  { name: 'bio',              type: 'TEXT' },
  { name: 'github_url',       type: 'TEXT' },
  { name: 'linkedin_url',     type: 'TEXT' },
  { name: 'portfolio_url',    type: 'TEXT' },
  { name: 'username',         type: 'TEXT' },
  { name: 'location',         type: 'TEXT' },
  { name: 'headline',         type: 'TEXT' },
  { name: 'banner',           type: 'TEXT' },
];

let added = 0;
let skipped = 0;

for (const col of columns) {
  try {
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ${sql.unsafe(col.name)} ${sql.unsafe(col.type)}`;
    console.log(`  ✅ Column '${col.name}' ensured (${col.type})`);
    added++;
  } catch (e) {
    console.warn(`  ⚠️  Column '${col.name}' skipped: ${e.message}`);
    skipped++;
  }
}

console.log(`\n✅ Migration complete! ${added} columns added/ensured, ${skipped} skipped.`);
