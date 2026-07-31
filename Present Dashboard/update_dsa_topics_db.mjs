import { neon } from '@neondatabase/serverless';

const DATABASE_URL = 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(DATABASE_URL);

async function alterTable() {
  try {
    console.log("Adding roadmap fields to dsa_topics table...");
    await sql.query(`
      ALTER TABLE dsa_topics
      ADD COLUMN IF NOT EXISTS roadmap_url TEXT,
      ADD COLUMN IF NOT EXISTS roadmap_content TEXT;
    `);
    console.log("✅ dsa_topics updated with roadmap_url and roadmap_content!");
  } catch (err) {
    console.error("❌ Error altering table:", err.message);
  }
}

alterTable();
