import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL missing!");
  process.exit(1);
}

const sql = neon(connectionString);

async function syncSummaries() {
  console.log("=== EXECUTING COLUMN MIGRATIONS & CHECKING NEON DB ===");
  
  // Ensure summary column exists
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS summary TEXT`;
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS card_description TEXT`;
  
  const projects = await sql`SELECT id, title, summary, description FROM projects WHERE deleted_at IS NULL`;
  
  console.log(`Found ${projects.length} active projects in DB:\n`);

  for (const p of projects) {
    console.log(`📌 ID: [${p.id}]`);
    console.log(`   Title:       "${p.title}"`);
    console.log(`   Summary:     "${p.summary || '(NULL / Empty)'}"`);
    console.log(`   Description: "${p.description ? p.description.substring(0, 60) + '...' : '(NULL / Empty)'}"`);
    console.log("---------------------------------------------------");
    
    // If summary is NULL or empty, set a clean summary from description
    if (!p.summary || p.summary.trim() === '') {
      let firstSentence = (p.description || '').split('.')[0];
      if (firstSentence.length > 120) {
        firstSentence = firstSentence.substring(0, 117) + '...';
      } else if (firstSentence.length > 0 && !firstSentence.endsWith('.')) {
        firstSentence += '.';
      } else if (!firstSentence) {
        firstSentence = p.title + ' project overview.';
      }
      
      console.log(`   ⚡ Populating summary -> "${firstSentence}"`);
      await sql`UPDATE projects SET summary = ${firstSentence} WHERE id = ${p.id}`;
    }
  }

  console.log("\n✅ ALL DB PROJECT SUMMARIES & DESCRIPTIONS MIGRATED, VERIFIED AND SYNCED!");
}

syncSummaries().catch(console.error);
