import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_NEON_URL || process.env.DATABASE_URL;
const sql = neon(dbUrl);
const BASE_URL = 'http://localhost:3000';

const adminHeaders = {
  'Content-Type': 'application/json',
  'x-user-id': 'admin_master',
  'x-user-email': 'admin@nexus.com',
  'x-user-name': 'nexus admin',
  'x-user-role': 'admin'
};

async function testNeonDbHardDeletion() {
  console.log('=== VERIFYING DIRECT HARD DELETION IN NEON POSTGRESQL ===\n');

  const testId = `proj_hard_delete_${Date.now()}`;
  const testTitle = `Hard Delete Test ${Date.now()}`;

  // 1. Create project row in DB
  console.log(`--- 1. Creating project [${testId}] in Neon DB ---`);
  let res = await fetch(`${BASE_URL}/api/projects/${testId}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      title: testTitle,
      description: 'Temporary row to test hard deletion in Neon DB',
      category: 'Advanced',
      status: 'in_progress',
      completion: 100
    })
  });
  let data = await res.json();
  console.log('Creation Status:', res.status, data.message);

  // Verify row exists in Neon DB
  let dbRows = await sql`SELECT * FROM projects WHERE id = ${testId}`;
  console.log('Row exists in Neon DB projects table before deletion:', dbRows.length === 1);

  // 2. Delete project via Admin Panel API
  console.log(`\n--- 2. Deleting project [${testId}] via DELETE /api/projects/${testId} ---`);
  res = await fetch(`${BASE_URL}/api/projects/${testId}?title=${encodeURIComponent(testTitle)}`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  data = await res.json();
  console.log('Delete Response:', res.status, data.message);

  // 3. Query PostgreSQL directly to confirm row was HARD-DELETED
  dbRows = await sql`SELECT * FROM projects WHERE id = ${testId}`;
  console.log('Row exists in Neon DB projects table after deletion:', dbRows.length > 0);

  // Check deleted_projects registry
  const regRows = await sql`SELECT * FROM deleted_projects WHERE id = ${testId}`;
  console.log('Recorded in deleted_projects registry in Neon DB:', regRows.length === 1);

  // Clean up test registry record
  await sql`DELETE FROM deleted_projects WHERE id = ${testId}`;

  if (dbRows.length === 0 && regRows.length === 1) {
    console.log('\n🎉 ALL DELETED PROJECTS ARE DIRECTLY HARD-DELETED FROM NEON POSTGRESQL DB!');
  } else {
    console.log('\n❌ HARD DELETION TEST FAILED');
  }
}

testNeonDbHardDeletion().catch(console.error);
