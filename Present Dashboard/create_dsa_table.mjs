import { neon } from '@neondatabase/serverless';

const sql = neon('postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');

try {
  await sql`
    CREATE TABLE IF NOT EXISTS dsa_solutions (
      id TEXT PRIMARY KEY,
      member_id TEXT,
      member_name TEXT,
      member_email TEXT,
      problem_id TEXT,
      problem_title TEXT,
      difficulty TEXT DEFAULT 'Easy',
      topic_name TEXT,
      image_data TEXT,
      notes TEXT,
      description TEXT,
      status TEXT DEFAULT 'pending',
      admin_note TEXT DEFAULT '',
      submitted_at TIMESTAMPTZ DEFAULT NOW(),
      reviewed_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ
    )
  `;
  console.log('✅ dsa_solutions table created successfully');
} catch (e) {
  console.error('❌ Error:', e.message);
}
