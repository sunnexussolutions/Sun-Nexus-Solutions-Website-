import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_NEON_URL || process.env.DATABASE_URL;
const sql = neon(dbUrl);

async function verify() {
  const rows = await sql`SELECT id, title, category, status, owner_name FROM projects ORDER BY created_at DESC`;
  console.log(`Total projects in Neon DB: ${rows.length}`);
  rows.forEach((r, i) => console.log(`${i+1}. [${r.category}] ${r.title} (Status: ${r.status}, Owner: ${r.owner_name})`));
}

verify();
