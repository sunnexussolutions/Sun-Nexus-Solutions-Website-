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

async function testAdminToMainWebsiteSync() {
  console.log('=== VERIFYING ADMIN PANEL TO MAIN WEBSITE REALTIME SYNC ===\n');

  const testId = `proj_main_web_sync_${Date.now()}`;

  // 1. Admin creates a project with planning status
  console.log('--- 1. Admin Creating Project (Status: planning) ---');
  let res = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      id: testId,
      title: 'Initial Admin Title',
      description: 'Initial Admin Description',
      category: 'Advanced',
      status: 'planning',
      completion: 20,
      techStack: ['React', 'Node.js'],
      teamMembers: [{ name: 'B.Prasad', role: 'Lead' }]
    })
  });
  let data = await res.json();
  console.log('Creation Status:', data.success ? 'PASSED' : 'FAILED');

  // 2. Admin edits the project details
  console.log('\n--- 2. Admin Editing Project Details ---');
  const editedPayload = {
    title: 'Updated Quantum Nexus Website',
    description: 'Edited description for main website presentation.',
    category: 'Ongoing',
    status: 'in_progress',
    completion: 95,
    githubUrl: 'https://github.com/nexus/updated-quantum-website',
    liveDemoUrl: 'https://quantum-website.nexus.com',
    techStack: ['React', 'TypeScript', 'Tailwind', 'Neon DB', 'Express'],
    teamMembers: [
      { name: 'B.Prasad', role: 'Lead Architect' },
      { name: 'M.Swapna', role: 'Frontend Lead' }
    ]
  };

  res = await fetch(`${BASE_URL}/api/projects/${testId}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify(editedPayload)
  });
  data = await res.json();
  console.log('Admin Edit Status:', data.success ? 'PASSED' : 'FAILED');

  // 3. Main Website fetches public projects endpoint
  console.log('\n--- 3. Main Website Fetching GET /api/projects/public ---');
  res = await fetch(`${BASE_URL}/api/projects/public`);
  data = await res.json();
  const publicList = data.projects || [];
  const matchedProject = publicList.find(p => String(p.id) === testId);

  console.log('Found on Main Website:', Boolean(matchedProject));
  if (matchedProject) {
    console.log('Title on Main Website:', matchedProject.title);
    console.log('Description on Main Website:', matchedProject.description);
    console.log('Completion on Main Website:', matchedProject.completion);
    console.log('GitHub Link on Main Website:', matchedProject.github_url);
    console.log('Live Link on Main Website:', matchedProject.live_demo_url);
  }

  // 4. Cleanup test project
  console.log('\n--- 4. Cleanup Test Project ---');
  await sql`DELETE FROM projects WHERE id = ${testId}`;

  const isSuccess = matchedProject && 
                    matchedProject.title === 'Updated Quantum Nexus Website' &&
                    matchedProject.description === 'Edited description for main website presentation.' &&
                    Number(matchedProject.completion) === 95 &&
                    matchedProject.github_url === 'https://github.com/nexus/updated-quantum-website' &&
                    matchedProject.live_demo_url === 'https://quantum-website.nexus.com';

  if (isSuccess) {
    console.log('\n🎉 ALL ADMIN PANEL EDITS PROPAGATE TO MAIN WEBSITE PROJECTS PAGE INSTANTLY & PERFECTLY!');
  } else {
    console.log('\n❌ SYNC TEST FAILED');
  }
}

testAdminToMainWebsiteSync().catch(console.error);
