import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_NEON_URL || process.env.DATABASE_URL;
const sql = neon(dbUrl);

async function checkAlumni() {
  const count = await sql`SELECT count(*)::int as total FROM alumni`;
  console.log('Total alumni in DB:', count[0].total);

  const rows = await sql`SELECT id, name, batch, is_leader, company, is_active FROM alumni LIMIT 10`;
  console.log('Sample rows:', rows);
}

checkAlumni().catch(console.error);
