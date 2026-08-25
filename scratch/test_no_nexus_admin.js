import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:3000';

async function testNoNexusAdmin() {
  console.log('=== VERIFYING NEXUS ADMIN EXCLUSION FROM ALL PROJECTS ===\n');

  const res = await fetch(`${BASE_URL}/api/projects/public?_t=${Date.now()}`);
  const data = await res.json();
  const projects = data.projects || [];

  let foundAdminInTeam = 0;

  projects.forEach(p => {
    let team = [];
    try {
      team = typeof p.team_members === 'string' ? JSON.parse(p.team_members) : (p.team_members || []);
    } catch {
      team = [];
    }

    team.forEach(m => {
      const name = typeof m === 'string' ? m : (m.name || m.fullName || '');
      const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (norm.includes('nexusadmin') || norm === 'admin') {
        foundAdminInTeam++;
        console.error(`❌ Found Nexus Admin in project [${p.id}] "${p.title}" team!`);
      }
    });
  });

  console.log(`Total projects checked: ${projects.length}`);
  console.log(`Nexus Admin entries found in team members: ${foundAdminInTeam}`);

  if (foundAdminInTeam === 0) {
    console.log('\n🎉 VERIFIED: NEXUS ADMIN IS EXCLUDED FROM ALL PROJECTS AND TEAM MEMBER LISTS!');
  } else {
    console.log('\n❌ EXCLUSION TEST FAILED');
  }
}

testNoNexusAdmin().catch(console.error);
