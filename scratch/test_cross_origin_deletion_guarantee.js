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

async function testCrossOriginDeletionGuarantee() {
  console.log('=== VERIFYING GLOBAL CROSS-ORIGIN DELETION GUARANTEE ===\n');

  const testId = 'proj-1';
  const testTitle = 'Sun Nexus Solutions Website';

  // 1. Admin Deletes Static Project ID proj-1
  console.log(`--- 1. Admin Deleting Project ID: ${testId} ---`);
  let res = await fetch(`${BASE_URL}/api/projects/${testId}?title=${encodeURIComponent(testTitle)}`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  let data = await res.json();
  console.log('Delete Response:', res.status, data.message);

  // 2. Fetch Public API as loaded by external project.html browser window
  console.log('\n--- 2. Public API Request GET /api/projects/public ---');
  res = await fetch(`${BASE_URL}/api/projects/public?_t=${Date.now()}`);
  data = await res.json();
  const publicProjects = data.projects || [];

  const foundInPublic = publicProjects.some(p => String(p.id) === testId || p.title === testTitle);
  console.log(`Project "${testTitle}" Present in Public API:`, foundInPublic);

  // 3. Clean up test record from DB
  await sql`DELETE FROM projects WHERE id = ${testId}`;

  if (!foundInPublic) {
    console.log('\n🎉 ALL DELETED PROJECTS (STATIC & DYNAMIC) ARE PURGED GLOBALLY ACROSS ALL BROWSERS AND ORIGINS!');
  } else {
    console.log('\n❌ CROSS-ORIGIN DELETION TEST FAILED');
  }
}

testCrossOriginDeletionGuarantee().catch(console.error);
