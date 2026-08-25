import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:3000';

const isNexusAdmin = (name) => {
  if (!name) return false;
  const n = String(name).toLowerCase().replace(/[^a-z0-9]/g, '').trim();
  return n === 'nexusadmin' || n === 'admin' || n === 'sunnexus' || n === 'adminmaster' || n === 'useradmin' || n === 'nexus' || n === 'systemadmin' || n === 'administrator' || n.includes('admin');
};

async function testFutureAdminUpload() {
  console.log("=== TESTING FUTURE ADMIN UPLOAD & EXCLUSION ===\n");

  const testId = `proj_future_admin_${Date.now()}`;
  const testPayload = {
    id: testId,
    title: "Future Admin Test Project",
    summary: "Testing zero admin inclusion for future uploads.",
    description: "Detailed description for future admin upload test.",
    ownerName: "Nexus admin",
    owner_name: "Nexus admin",
    teamMembers: [
      { name: "Nexus admin", role: "Project Owner" },
      { name: "K.Bhargava Sriram", role: "Lead Developer" }
    ],
    category: "Advanced",
    status: "in_progress"
  };

  console.log("1. Simulating Admin project creation (passing Nexus admin as owner and team member)...");
  const createRes = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-role': 'admin',
      'x-user-name': 'Nexus admin'
    },
    body: JSON.stringify(testPayload)
  });
  const createData = await createRes.json();
  console.log("Create API Response:", createData);

  console.log("\n2. Fetching public project from server...");
  const pubRes = await fetch(`${BASE_URL}/api/projects/public?_t=${Date.now()}`);
  const pubData = await pubRes.json();
  const found = (pubData.projects || []).find(p => p.id === testId);

  if (!found) {
    console.error("❌ Test project not found!");
    return;
  }

  console.log("Fetched Project Properties:");
  console.log(`   ID:          ${found.id}`);
  console.log(`   Owner Name:  "${found.owner_name}"`);
  
  let team = [];
  try {
    team = typeof found.team_members === 'string' ? JSON.parse(found.team_members) : (found.team_members || []);
  } catch {
    team = [];
  }
  console.log(`   Team Members:`, team);

  const hasAdminOwner = isNexusAdmin(found.owner_name);
  const hasAdminTeam = team.some(m => isNexusAdmin(typeof m === 'string' ? m : (m.name || m.fullName)));

  if (!hasAdminOwner && !hasAdminTeam) {
    console.log("\n✅ SUCCESS: NEXUS ADMIN WAS STRICTLY EXCLUDED FROM OWNER AND TEAM MEMBERS!");
  } else {
    console.error("\n❌ FAILED: ADMIN WAS INCLUDED IN PROJECT!");
  }

  console.log("\n3. Cleaning up test project...");
  await fetch(`${BASE_URL}/api/projects/${testId}`, { method: 'DELETE' });
  console.log("Cleaned up.");
}

testFutureAdminUpload().catch(console.error);
