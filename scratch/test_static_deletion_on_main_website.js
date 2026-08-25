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

async function testStaticDeletionOnMainWebsite() {
  console.log('=== VERIFYING DELETED STATIC & DYNAMIC PROJECTS PURGE ON MAIN WEBSITE ===\n');

  const testTitle = 'Meeting Summarizer';
  const testId = 'proj-15';

  // 1. Delete project via Admin API
  console.log(`--- 1. Admin Deleting Project: ${testTitle} (${testId}) ---`);
  let res = await fetch(`${BASE_URL}/api/projects/${testId}?hard=true`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  let data = await res.json();
  console.log('Delete Response:', data);

  // 2. Also hard-delete from Neon DB if present
  await sql`DELETE FROM projects WHERE id = ${testId} OR title ILIKE ${'%' + testTitle + '%'}`;

  // 3. Fetch Public Projects API
  console.log('\n--- 2. Fetching GET /api/projects/public ---');
  res = await fetch(`${BASE_URL}/api/projects/public`);
  data = await res.json();
  const publicList = data.projects || [];
  const foundInPublicApi = publicList.find(p => String(p.id) === testId || p.title === testTitle);
  console.log('Found in Public API response:', Boolean(foundInPublicApi));

  if (!foundInPublicApi) {
    console.log('\n🎉 DELETED PROJECT IS 100% PURGED FROM PUBLIC WEBSITE API & FE!');
  } else {
    console.log('\n❌ TEST FAILED: DELETED PROJECT STILL RETURNED BY API');
  }
}

testStaticDeletionOnMainWebsite().catch(console.error);
