import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_NEON_URL || process.env.DATABASE_URL;
const sql = neon(dbUrl);

async function testAdminVisibility() {
  console.log('=== CHECKING PROJECT VISIBILITY IN ADMIN DASHBOARD ===\n');

  const rows = await sql`SELECT id, title, category, status, owner_name, owner_id FROM projects WHERE deleted_at IS NULL ORDER BY title ASC`;
  console.log(`Total Active Projects in PostgreSQL Database: ${rows.length}\n`);

  const meetingSummarizer = rows.find(r => r.title.toLowerCase().includes('meeting summarizer'));
  const aiEvaluator = rows.find(r => r.title.toLowerCase().includes('ai assignment evaluator'));

  console.log('1. Meeting Summarizer in DB:', meetingSummarizer ? `FOUND (ID: ${meetingSummarizer.id}, Owner: ${meetingSummarizer.owner_name})` : 'NOT FOUND');
  console.log('2. AI assignment evaluator in DB:', aiEvaluator ? `FOUND (ID: ${aiEvaluator.id}, Owner: ${aiEvaluator.owner_name})` : 'NOT FOUND');

  console.log('\n--- HOW TO VIEW THEM IN ADMIN DASHBOARD ---');
  console.log('1. Log into the Admin Dashboard as ADMIN (e.g. admin@nexus.com or Admin Role).');
  console.log('2. Navigate to "Projects" Tab in the Left Sidebar.');
  console.log('3. Ensure Category is set to "ALL" or "Advanced".');
  console.log('4. Search "Meeting Summarizer" or "AI assignment evaluator" in the top search bar.');
  console.log('5. If logged in as a non-admin Member, only projects owned by or assigned to that member are listed.');
}

testAdminVisibility().catch(console.error);
