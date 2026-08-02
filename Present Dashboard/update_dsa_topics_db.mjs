import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.VITE_NEON_URL || process.env.DATABASE_URL || '';
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
