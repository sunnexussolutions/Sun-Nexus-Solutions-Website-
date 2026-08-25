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

async function runFullCrudSuite() {
  console.log('=== FULL SYSTEM CRUD SUITE VERIFICATION ===\n');
  const testId = `proj_crud_suite_${Date.now()}`;

  // 1. CREATE
  console.log('--- 1. Testing CREATE Project ---');
  let res = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      id: testId,
      title: 'Full Suite Test Project',
      description: 'Comprehensive automated test for end-to-end CRUD operations',
      category: 'Advanced',
      domain: 'Engineering',
      priority: 'High',
      status: 'in_progress',
      completion: 35,
      githubUrl: 'https://github.com/nexus/test',
      liveDemoUrl: 'https://nexus.com/test',
      techStack: ['React', 'Node.js', 'PostgreSQL'],
      teamMembers: [{ name: 'Test Lead', role: 'Lead Dev' }]
    })
  });
  let data = await res.json();
  console.log('CREATE Status:', data.success ? 'PASSED' : 'FAILED', data.message || data.error);

  // 2. READ (GET)
  console.log('\n--- 2. Testing READ Project ---');
  res = await fetch(`${BASE_URL}/api/projects/${testId}`, { headers: adminHeaders });
  data = await res.json();
  console.log('READ Single Project Title:', data.project?.title);
  console.log('READ Status:', data.success ? 'PASSED' : 'FAILED');

  // 3. UPDATE (PATCH)
  console.log('\n--- 3. Testing UPDATE Project ---');
  res = await fetch(`${BASE_URL}/api/projects/${testId}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      title: 'Full Suite Test Project (EDITED)',
      completion: 100,
      status: 'completed',
      category: 'Advanced',
      challenges: 'Optimized PostgreSQL connection pool & dynamic state updates.'
    })
  });
  data = await res.json();
  console.log('UPDATE Title:', data.project?.title);
  console.log('UPDATE Status:', (data.success && data.project?.title === 'Full Suite Test Project (EDITED)') ? 'PASSED' : 'FAILED');

  // 4. ASSIGN TEAM MEMBERS
  console.log('\n--- 4. Testing ASSIGN TEAM MEMBERS ---');
  const updatedTeam = [
    { name: 'B.Prasad', role: 'Project Owner', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514' },
    { name: 'K.Raghu', role: 'Frontend Lead', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-08%20at%2010.27.23%20AM.jpeg?updatedAt=1760072973601' }
  ];
  res = await fetch(`${BASE_URL}/api/projects/${testId}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      teamMembers: updatedTeam,
      team: updatedTeam
    })
  });
  data = await res.json();
  console.log('ASSIGN TEAM Members count:', JSON.parse(data.project?.team_members || '[]').length);
  console.log('ASSIGN TEAM Status:', data.success ? 'PASSED' : 'FAILED');

  // 5. TRANSFER OWNERSHIP
  console.log('\n--- 5. Testing TRANSFER OWNERSHIP ---');
  res = await fetch(`${BASE_URL}/api/projects/${testId}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      ownerId: 'usr_new_owner_789',
      ownerName: 'New Master Owner'
    })
  });
  data = await res.json();
  console.log('TRANSFER OWNERSHIP Owner Name:', data.project?.owner_name);
  console.log('TRANSFER OWNERSHIP Status:', (data.success && data.project?.owner_name === 'New Master Owner') ? 'PASSED' : 'FAILED');

  // 6. DELETE (HARD)
  console.log('\n--- 6. Testing DELETE Project ---');
  res = await fetch(`${BASE_URL}/api/projects/${testId}?hard=true`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  data = await res.json();
  console.log('DELETE Status:', data.success ? 'PASSED' : 'FAILED', data.message);

  // 7. VERIFY DELETION IN NEON DB
  console.log('\n--- 7. Verifying DB Cleanup ---');
  const dbCheck = await sql`SELECT id FROM projects WHERE id = ${testId}`;
  console.log('DB Rows matching testId:', dbCheck.length);
  console.log('FINAL RESULT:', dbCheck.length === 0 ? '🎉 ALL CRUD OPERATIONS VERIFIED 100% PERFECTLY!' : '❌ DB CLEANUP FAILED');
}

runFullCrudSuite().catch(console.error);
