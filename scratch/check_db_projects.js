import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_NEON_URL || process.env.DATABASE_URL;
const sql = neon(dbUrl);

async function checkProjects() {
  const rows = await sql`SELECT id, title, category, status, deleted_at FROM projects ORDER BY title ASC`;
  console.log(`Total projects in PostgreSQL: ${rows.length}\n`);
  rows.forEach((r, i) => {
    console.log(`${i+1}. [${r.id}] "${r.title}" (Cat: ${r.category}, Status: ${r.status}, Deleted: ${Boolean(r.deleted_at)})`);
  });
}

checkProjects().catch(console.error);
