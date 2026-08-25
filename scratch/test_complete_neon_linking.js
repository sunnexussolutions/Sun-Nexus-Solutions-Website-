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

async function testCompleteNeonLinking() {
  console.log('=== VERIFYING END-TO-END NEON DB LINKING (ADMIN PANEL, MAIN WEBSITE, MEMBERS PROFILES) ===\n');

  // 1. Test Admin Panel Project Linking to Neon DB
  console.log('--- 1. Testing Admin Panel Project Upsert & Neon DB ---');
  const projId = `proj_link_${Date.now()}`;
  const projTitle = `Linked Neon Project ${Date.now()}`;

  let res = await fetch(`${BASE_URL}/api/projects/${projId}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      title: projTitle,
      description: 'Project saved directly in Neon DB',
      category: 'Advanced',
      status: 'in_progress',
      completion: 95
    })
  });
  let data = await res.json();
  console.log('Admin Project Upsert Response:', res.status, data.message);

  let projRows = await sql`SELECT * FROM projects WHERE id = ${projId}`;
  console.log('Project Row Present in Neon DB:', projRows.length === 1);

  // 2. Test Main Website Projects Page Fetch from Neon DB
  console.log('\n--- 2. Testing Main Website Projects Page (GET /api/projects/public) ---');
  res = await fetch(`${BASE_URL}/api/projects/public?_t=${Date.now()}`);
  data = await res.json();
  const publicList = data.projects || [];
  const foundOnWebsite = publicList.some(p => String(p.id) === projId);
  console.log('Project Rendered on Main Website:', foundOnWebsite);

  // 3. Test Member Profile Linking to Neon DB
  console.log('\n--- 3. Testing Member Profile Upsert in Neon DB ---');
  const memberId = `member_${Date.now()}`;
  res = await fetch(`${BASE_URL}/api/users/${memberId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'K.Bhargava Sriram',
      email: 'sriram@nexus.com',
      headline: 'Full-Stack Lead Developer',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Tailwind'],
      bio: 'Building future-ready AI and web platforms.',
      githubUrl: 'https://github.com/sunnexussolutions'
    })
  });
  data = await res.json();
  console.log('Member Profile Upsert Response:', res.status, data.message);

  let memberRows = await sql`SELECT * FROM profiles WHERE id = ${memberId}`;
  console.log('Member Profile Present in Neon DB:', memberRows.length === 1);
  if (memberRows.length > 0) {
    console.log('Member Name in Neon DB:', memberRows[0].name);
    console.log('Member Headline in Neon DB:', memberRows[0].headline);
  }

  // 4. Test Hard Deletion in Neon DB
  console.log('\n--- 4. Testing Admin Panel Project Hard Delete in Neon DB ---');
  res = await fetch(`${BASE_URL}/api/projects/${projId}`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  data = await res.json();
  console.log('Admin Delete Response:', res.status, data.message);

  projRows = await sql`SELECT * FROM projects WHERE id = ${projId}`;
  console.log('Project Row Hard-Deleted from Neon DB:', projRows.length === 0);

  // Clean up test member profile & registry
  await sql`DELETE FROM profiles WHERE id = ${memberId}`;
  await sql`DELETE FROM deleted_projects WHERE id = ${projId}`;

  const allPassed = foundOnWebsite && memberRows.length === 1 && projRows.length === 0;

  if (allPassed) {
    console.log('\n🎉 ALL 3-WAY NEON DB LINKING TESTS PASSED (ADMIN PANEL, MAIN WEBSITE & MEMBERS PROFILES)!');
  } else {
    console.log('\n❌ LINKING TEST FAILED');
  }
}

testCompleteNeonLinking().catch(console.error);
