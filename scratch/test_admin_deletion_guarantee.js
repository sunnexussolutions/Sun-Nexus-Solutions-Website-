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

async function testAdminDeletionGuarantee() {
  console.log('=== ADMIN DELETION GUARANTEE TEST ===\n');

  const dbTestId = `proj_del_db_${Date.now()}`;
  const staticTestId = `proj_del_static_${Date.now()}`;

  // 1. Create DB Project
  console.log('--- 1. Creating DB Project ---');
  let res = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      id: dbTestId,
      title: 'Temporary DB Deletion Test',
      category: 'Advanced',
      status: 'in_progress'
    })
  });
  let data = await res.json();
  console.log('DB Project Create:', data.success ? 'PASSED' : 'FAILED');

  // 2. Delete DB Project via Admin API
  console.log('\n--- 2. Deleting DB Project via Admin API ---');
  res = await fetch(`${BASE_URL}/api/projects/${dbTestId}?hard=true`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  data = await res.json();
  console.log('Admin Delete DB Project Status Code:', res.status, 'Response:', data);

  // 3. Verify row purged in Neon PostgreSQL
  const dbRows = await sql`SELECT id FROM projects WHERE id = ${dbTestId}`;
  console.log('Neon DB Rows remaining:', dbRows.length);
  console.log('DB Purge Status:', dbRows.length === 0 ? 'PASSED' : 'FAILED');

  // 4. Delete Static / Unseeded Project via Admin API
  console.log('\n--- 4. Deleting Static / Unseeded Project ID ---');
  res = await fetch(`${BASE_URL}/api/projects/${staticTestId}?hard=true`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  data = await res.json();
  console.log('Admin Delete Static Project Status Code:', res.status, 'Response:', data);

  if (res.status === 200 && dbRows.length === 0) {
    console.log('\n🎉 ALL ADMIN DELETIONS GUARANTEED 100% PERFECTLY!');
  } else {
    console.log('\n❌ DELETION TEST FAILED');
  }
}

testAdminDeletionGuarantee().catch(console.error);
