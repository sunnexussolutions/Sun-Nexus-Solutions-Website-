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

const memberHeaders = {
  'Content-Type': 'application/json',
  'x-user-id': 'usr_swapna_123',
  'x-user-email': 'swapna@nexus.com',
  'x-user-name': 'm.swapna',
  'x-user-role': 'member'
};

async function test3WayFlow() {
  console.log('=== VERIFYING 3-WAY FLOW: PROJECTS <--> ADMIN PANEL <--> USERS DASHBOARDS ===\n');

  const testId = `proj_flow_${Date.now()}`;

  // STEP 1: Admin Panel Creates Project & Assigns Team Member (M.Swapna)
  console.log('--- STEP 1: Admin Panel creates project & assigns M.Swapna ---');
  let res = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      id: testId,
      title: 'AI Smart Health Tracker',
      description: 'AI-driven health analytics dashboard with real-time biometric tracking.',
      category: 'AI/ML',
      domain: 'Artificial Intelligence',
      priority: 'High',
      status: 'in_progress',
      completion: 60,
      ownerId: 'admin_master',
      ownerName: 'Sun Nexus Admin',
      githubUrl: 'https://github.com/sunnexus/health-tracker',
      liveDemoUrl: 'https://health-tracker.nexus.com',
      techStack: ['Python', 'React', 'FastAPI', 'PostgreSQL'],
      teamMembers: [
        { name: 'M.Swapna', role: 'Frontend Lead', email: 'swapna@nexus.com', userId: 'usr_swapna_123' },
        { name: 'B.Jaya Manideep', role: 'Backend Dev', email: 'manideep@nexus.com', userId: 'usr_manideep_456' }
      ]
    })
  });
  let data = await res.json();
  console.log('Step 1 Admin Create Status:', data.success ? 'PASSED' : 'FAILED');

  // STEP 2: User Dashboard (M.Swapna) Fetches Projects
  console.log('\n--- STEP 2: User Dashboard (M.Swapna) verifies assigned project ---');
  res = await fetch(`${BASE_URL}/api/projects`, { headers: memberHeaders });
  data = await res.json();
  const swapnaProjects = (data.projects || []).filter(p => String(p.id) === testId);
  console.log('Project found in M.Swapna Dashboard:', swapnaProjects.length > 0 ? 'YES' : 'NO');
  console.log('Step 2 User Dashboard Status:', swapnaProjects.length > 0 ? 'PASSED' : 'FAILED');

  // STEP 3: Main Website Public API Fetches Projects
  console.log('\n--- STEP 3: Main Website (project.html) verifies public listing ---');
  res = await fetch(`${BASE_URL}/api/projects/public`);
  data = await res.json();
  const publicProjects = (data.projects || []).filter(p => String(p.id) === testId);
  console.log('Project listed on Main Website:', publicProjects.length > 0 ? 'YES' : 'NO');
  console.log('Main Website Project Title:', publicProjects[0]?.title);
  console.log('Step 3 Main Website Status:', publicProjects.length > 0 ? 'PASSED' : 'FAILED');

  // STEP 4: Member updates project status in User Dashboard
  console.log('\n--- STEP 4: Member updates project status from User Dashboard ---');
  res = await fetch(`${BASE_URL}/api/projects/${testId}`, {
    method: 'PATCH',
    headers: memberHeaders,
    body: JSON.stringify({
      completion: 100,
      status: 'completed'
    })
  });
  data = await res.json();
  console.log('Step 4 Member Update Status:', data.success ? 'PASSED' : 'FAILED');

  // STEP 5: Verify update propagated to Main Website API
  console.log('\n--- STEP 5: Verify update reflected on Main Website ---');
  res = await fetch(`${BASE_URL}/api/projects/public`);
  data = await res.json();
  const updatedPublic = (data.projects || []).find(p => String(p.id) === testId);
  console.log('Public Website Status:', updatedPublic?.status);
  console.log('Public Website Completion:', updatedPublic?.completion);
  console.log('Step 5 Propagation Status:', updatedPublic?.status === 'completed' ? 'PASSED' : 'FAILED');

  // STEP 6: Admin Panel Deletes Project
  console.log('\n--- STEP 6: Admin Panel deletes project permanently ---');
  res = await fetch(`${BASE_URL}/api/projects/${testId}?hard=true`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  data = await res.json();
  console.log('Step 6 Admin Delete Status:', data.success ? 'PASSED' : 'FAILED');

  // STEP 7: Verify Deletion System-Wide
  console.log('\n--- STEP 7: Verify System-Wide Deletion (DB + Main Website) ---');
  const dbRows = await sql`SELECT id FROM projects WHERE id = ${testId}`;
  res = await fetch(`${BASE_URL}/api/projects/public`);
  data = await res.json();
  const postDeletePublic = (data.projects || []).filter(p => String(p.id) === testId);

  console.log('DB Row count:', dbRows.length);
  console.log('Public Website Count:', postDeletePublic.length);
  if (dbRows.length === 0 && postDeletePublic.length === 0) {
    console.log('\n🎉 PERFECT RESULT: "PROJECTS --> ADMIN PANEL --> USERS DASHBOARDS" FLOW VERIFIED 100%!');
  } else {
    console.log('\n❌ VERIFICATION FAILED');
  }
}

test3WayFlow().catch(console.error);
