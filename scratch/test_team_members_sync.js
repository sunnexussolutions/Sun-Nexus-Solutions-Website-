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

async function testTeamMembersSync() {
  console.log('--- 1. Testing Team Members Update via Backend API ---');

  const testProject = 'proj_sun_nexus_website';
  const updatedTeam = [
    { name: 'B.Prasad', role: 'Team Lead', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2012.03.03%20PM.jpeg?updatedAt=1760078322514' },
    { name: 'C.Mallikarjuna Rao', role: 'Full Stack Dev', image: 'https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572' },
    { name: 'K.Raghu', role: 'Frontend Dev', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-08%20at%2010.27.23%20AM.jpeg?updatedAt=1760072973601' },
    { name: 'S.Poojitha', role: 'UI/UX Designer', image: 'https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.24.52%20AM.jpeg?updatedAt=1760072972748' },
    { name: 'New Test Contributor', role: 'QA Lead', image: '' }
  ];

  let res = await fetch(`${BASE_URL}/api/projects/${testProject}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      teamMembers: updatedTeam,
      team: updatedTeam
    })
  });
  let data = await res.json();
  console.log('PATCH Team Members response success:', data.success);

  console.log('\n--- 2. Fetching Public Projects API for Main Website ---');
  res = await fetch(`${BASE_URL}/api/projects/public`);
  data = await res.json();

  const websiteProject = (data.projects || []).find(p => p.id === testProject);
  console.log('Project title on Main Website API:', websiteProject?.title);
  console.log('Team members stored in Neon DB column team_members:', websiteProject?.team_members);

  const parsed = JSON.parse(websiteProject?.team_members || '[]');
  console.log(`Parsed ${parsed.length} team members:`);
  parsed.forEach((m, idx) => console.log(`  ${idx+1}. ${m.name} (${m.role})`));

  console.log('\n--- 3. Verifying Neon DB direct SQL query ---');
  const dbRows = await sql`SELECT team_members FROM projects WHERE id = ${testProject}`;
  console.log('Direct SQL query team_members:', dbRows[0]?.team_members);
}

testTeamMembersSync().catch(console.error);
