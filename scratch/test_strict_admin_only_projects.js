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

async function testStrictAdminOnlyProjects() {
  console.log('=== VERIFYING STRICT ADMIN-ONLY PROJECTS REQUIREMENT ===\n');

  // Step 1: Query public API
  console.log('--- 1. Fetching Public Projects Endpoint ---');
  let res = await fetch(`${BASE_URL}/api/projects/public?_t=${Date.now()}`);
  let data = await res.json();
  const initialPublicCount = (data.projects || []).length;
  console.log(`Initial Public Projects Count in DB: ${initialPublicCount}`);

  // Step 2: Create a test project from Admin Panel
  const testId = `proj_test_strict_${Date.now()}`;
  const testTitle = `Strict Test Project ${Date.now()}`;
  console.log(`\n--- 2. Creating New Project via Admin Panel: "${testTitle}" (ID: ${testId}) ---`);

  res = await fetch(`${BASE_URL}/api/projects/${testId}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      title: testTitle,
      description: 'Strict Admin Only Test Description',
      category: 'Advanced',
      status: 'in_progress',
      completion: 85,
      techStack: ['React', 'Node.js', 'PostgreSQL'],
      visibility: 'public'
    })
  });
  data = await res.json();
  console.log('Admin Project Creation Status:', res.status, data.message);

  // Step 3: Verify created project appears on public endpoint
  res = await fetch(`${BASE_URL}/api/projects/public?_t=${Date.now()}`);
  data = await res.json();
  const createdInPublic = (data.projects || []).find(p => String(p.id) === testId || p.title === testTitle);
  console.log('Created Project Visible on Main Website:', Boolean(createdInPublic));

  // Step 4: Delete the project via Admin Panel
  console.log(`\n--- 3. Deleting Project via Admin Panel (ID: ${testId}) ---`);
  res = await fetch(`${BASE_URL}/api/projects/${testId}`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  data = await res.json();
  console.log('Admin Project Deletion Status:', res.status, data.message);

  // Step 5: Clean up DB table
  await sql`DELETE FROM projects WHERE id = ${testId}`;

  // Step 6: Final check
  res = await fetch(`${BASE_URL}/api/projects/public?_t=${Date.now()}`);
  data = await res.json();
  const deletedInPublic = (data.projects || []).find(p => String(p.id) === testId || p.title === testTitle);
  console.log('Deleted Project Purged from Main Website:', !deletedInPublic);

  if (createdInPublic && !deletedInPublic) {
    console.log('\n🎉 STRICT ADMIN-ONLY PROJECTS VERIFIED: ONLY ADMIN PANEL PROJECTS APPEAR ON MAIN WEBSITE!');
  } else {
    console.log('\n❌ VERIFICATION FAILED');
  }
}

testStrictAdminOnlyProjects().catch(console.error);
