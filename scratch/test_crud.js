const BASE_URL = 'http://localhost:3000';
const adminHeaders = {
  'Content-Type': 'application/json',
  'x-user-id': 'admin_master',
  'x-user-email': 'admin@nexus.com',
  'x-user-name': 'nexus admin',
  'x-user-role': 'admin'
};

async function testCrud() {
  console.log('--- 1. Testing GET /api/projects ---');
  let res = await fetch(`${BASE_URL}/api/projects`, { headers: adminHeaders });
  let data = await res.json();
  console.log('GET /api/projects response success:', data.success, 'count:', data.projects?.length);

  const testId = `test_proj_${Date.now()}`;
  console.log('\n--- 2. Testing CREATE (POST /api/projects) ---');
  res = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify({
      id: testId,
      title: 'Test Automated Project',
      description: 'Testing Admin CRUD Operations',
      category: 'Advanced',
      domain: 'Engineering',
      status: 'in_progress',
      completion: 75,
      techStack: ['Node.js', 'React'],
      teamMembers: [{ name: 'Test User', role: 'Lead' }]
    })
  });
  data = await res.json();
  console.log('POST /api/projects response:', data);

  console.log('\n--- 3. Testing UPDATE (PATCH /api/projects/:id) ---');
  res = await fetch(`${BASE_URL}/api/projects/${testId}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      title: 'Test Automated Project (EDITED)',
      completion: 100,
      status: 'completed'
    })
  });
  data = await res.json();
  console.log('PATCH /api/projects/:id response:', data);

  console.log('\n--- 4. Testing GET single project ---');
  res = await fetch(`${BASE_URL}/api/projects/${testId}`, { headers: adminHeaders });
  data = await res.json();
  console.log('GET /api/projects/:id project title:', data.project?.title, 'status:', data.project?.status);

  console.log('\n--- 5. Testing DELETE (DELETE /api/projects/:id?hard=true) ---');
  res = await fetch(`${BASE_URL}/api/projects/${testId}?hard=true`, {
    method: 'DELETE',
    headers: adminHeaders
  });
  data = await res.json();
  console.log('DELETE response:', data);
}

testCrud().catch(console.error);
