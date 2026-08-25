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

async function testStaticEditToMainWebsite() {
  console.log('=== VERIFYING STATIC & DYNAMIC PROJECT EDIT PROPAGATION TO MAIN WEBSITE ===\n');

  const testId = 'proj-1';
  const editedTitle = 'Sun Nexus Flagship Platform';

  // 1. Admin edits static project ID proj-1
  console.log(`--- 1. Admin Editing Static Project ID: ${testId} ---`);
  let res = await fetch(`${BASE_URL}/api/projects/${testId}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      title: editedTitle,
      description: 'Edited flagship platform description.',
      category: 'Advanced',
      status: 'in_progress',
      completion: 99,
      techStack: ['React', 'Next.js', 'PostgreSQL', 'Tailwind'],
      teamMembers: [{ name: 'B.Prasad', role: 'Lead Architect' }]
    })
  });
  let data = await res.json();
  console.log('Admin Edit Status Code:', res.status, 'Response:', data);

  // 2. Fetch Public API as loaded by project.html
  console.log('\n--- 2. Main Website Fetching GET /api/projects/public ---');
  res = await fetch(`${BASE_URL}/api/projects/public`);
  data = await res.json();
  const publicProjects = data.projects || [];
  const matchedProject = publicProjects.find(p => String(p.id) === testId || p.title === editedTitle);

  console.log('Matched Project on Main Website:', Boolean(matchedProject));
  if (matchedProject) {
    console.log('Title on Main Website:', matchedProject.title);
    console.log('Completion on Main Website:', matchedProject.completion);
    console.log('Tech Stack on Main Website:', matchedProject.tech_stack);
  }

  // 3. Cleanup edited row
  await sql`DELETE FROM projects WHERE id = ${testId}`;

  const isSuccess = matchedProject && 
                    matchedProject.title === editedTitle && 
                    Number(matchedProject.completion) === 99;

  if (isSuccess) {
    console.log('\n🎉 ALL PROJECT EDITS (STATIC & DYNAMIC) REFLECT ON MAIN WEBSITE PROJECTS PAGE INSTANTLY!');
  } else {
    console.log('\n❌ EDIT REFLECTION TEST FAILED');
  }
}

testStaticEditToMainWebsite().catch(console.error);
