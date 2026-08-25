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

async function testEditedChangesSync() {
  console.log('=== VERIFYING EDITED PROJECT CHANGES ACROSS ALL SYSTEM PLACES ===\n');

  const testId = `proj_edit_sync_${Date.now()}`;

  // Step 1: Create Initial Project
  console.log('--- Step 1: Creating initial project ---');
  let res = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      id: testId,
      title: 'Initial Project Title',
      description: 'Initial project description',
      category: 'Advanced',
      status: 'planning',
      completion: 10,
      techStack: ['JavaScript'],
      teamMembers: [{ name: 'Initial Owner' }]
    })
  });
  let data = await res.json();
  console.log('Creation Status:', data.success ? 'PASSED' : 'FAILED');

  // Step 2: Edit Project Fields
  console.log('\n--- Step 2: Editing project with rich new data ---');
  const editedPayload = {
    title: 'Next-Gen Quantum AI Platform',
    description: 'Updated high-throughput quantum simulation engine.',
    desc: 'Updated high-throughput quantum simulation engine.',
    category: 'Ongoing',
    domain: 'Artificial Intelligence',
    priority: 'High',
    status: 'in_progress',
    completion: 88,
    githubUrl: 'https://github.com/nexus/quantum-ai',
    liveDemoUrl: 'https://quantum.nexus.com',
    techStack: ['Python', 'Qiskit', 'React', 'Node.js', 'PostgreSQL'],
    teamMembers: [
      { name: 'M.Swapna', role: 'Team Lead', email: 'swapna@nexus.com' },
      { name: 'B.Prasad', role: 'Core Contributor', email: 'prasad@nexus.com' }
    ],
    features: ['Quantum Circuit Builder', 'Realtime Wavefunction Visualizer'],
    challenges: 'Ensuring zero noise in quantum circuit simulations.',
    futureImprovements: 'Integrating fault-tolerant quantum error correction.'
  };

  res = await fetch(`${BASE_URL}/api/projects/${testId}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify(editedPayload)
  });
  data = await res.json();
  console.log('Edit Request Status:', data.success ? 'PASSED' : 'FAILED');

  // Step 3: Fetch & Verify Admin / Dashboard Endpoint
  console.log('\n--- Step 3: Verifying Admin / User Dashboard Endpoint GET /api/projects/:id ---');
  res = await fetch(`${BASE_URL}/api/projects/${testId}`, { headers: adminHeaders });
  data = await res.json();
  const dbProj = data.project;

  const parsedTechDB = typeof dbProj.tech_stack === 'string' ? JSON.parse(dbProj.tech_stack) : dbProj.tech_stack;
  const parsedTeamDB = typeof dbProj.team_members === 'string' ? JSON.parse(dbProj.team_members) : dbProj.team_members;
  const parsedFeatDB = typeof dbProj.features === 'string' ? JSON.parse(dbProj.features) : dbProj.features;

  console.log('Title in DB:', dbProj.title);
  console.log('Completion in DB:', dbProj.completion);
  console.log('Tech Stack in DB (Is Array):', Array.isArray(parsedTechDB), parsedTechDB);
  console.log('Team Members count in DB:', parsedTeamDB.length);
  console.log('Features count in DB:', parsedFeatDB.length);
  console.log('GitHub Link in DB:', dbProj.github_url);
  console.log('Live Link in DB:', dbProj.live_demo_url);

  // Step 4: Fetch & Verify Main Website Public Endpoint GET /api/projects/public
  console.log('\n--- Step 4: Verifying Main Website Public Endpoint GET /api/projects/public ---');
  res = await fetch(`${BASE_URL}/api/projects/public`);
  data = await res.json();
  const pubProj = (data.projects || []).find(p => String(p.id) === testId);

  const parsedTechPub = typeof pubProj.tech_stack === 'string' ? JSON.parse(pubProj.tech_stack) : pubProj.tech_stack;
  const parsedTeamPub = typeof pubProj.team_members === 'string' ? JSON.parse(pubProj.team_members) : pubProj.team_members;

  console.log('Title on Public Website:', pubProj?.title);
  console.log('Completion on Public Website:', pubProj?.completion);
  console.log('Tech Stack on Public Website (Is Array):', Array.isArray(parsedTechPub), parsedTechPub);
  console.log('Team Members on Public Website count:', parsedTeamPub?.length);

  // Step 5: Clean Up Test Row
  console.log('\n--- Step 5: Cleaning up test row ---');
  await sql`DELETE FROM projects WHERE id = ${testId}`;

  const allPassed = 
    dbProj.title === 'Next-Gen Quantum AI Platform' &&
    Number(dbProj.completion) === 88 &&
    Array.isArray(parsedTechDB) && parsedTechDB.length === 5 &&
    parsedTeamDB.length === 2 &&
    pubProj?.title === 'Next-Gen Quantum AI Platform' &&
    Array.isArray(parsedTechPub) && parsedTechPub.length === 5;

  if (allPassed) {
    console.log('\n🎉 ALL EDITED CHANGES APPEAR PROPERLY ACROSS ALL PLACES (ADMIN, DASHBOARDS, PUBLIC WEBSITE)!');
  } else {
    console.log('\n❌ VERIFICATION FAILED');
  }
}

testEditedChangesSync().catch(console.error);
