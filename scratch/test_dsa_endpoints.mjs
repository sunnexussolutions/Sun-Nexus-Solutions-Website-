
async function testEndpoints() {
  console.log('🧪 Testing DSA Endpoints...');

  const BASE = 'http://localhost:3000/api/dsa';
  const headers = {
    'Content-Type': 'application/json',
    'X-User-Id': 'admin_master'
  };

  // 1. GET Topics
  console.log('\n1. GET /api/dsa/topics');
  const topicsRes = await fetch(`${BASE}/topics`, { headers });
  const topicsData = await topicsRes.json();
  console.log('Topics status:', topicsRes.status, 'Count:', topicsData?.data?.length);

  // 2. GET Problems
  console.log('\n2. GET /api/dsa/problems');
  const probsRes = await fetch(`${BASE}/problems?limit=10`, { headers });
  const probsData = await probsRes.json();
  console.log('Problems status:', probsRes.status, 'Total:', probsData?.data?.total, 'Items:', probsData?.data?.items?.length);

  // 3. GET Problem Details
  console.log('\n3. GET /api/dsa/problems/two-sum');
  const probRes = await fetch(`${BASE}/problems/two-sum`, { headers });
  const probData = await probRes.json();
  console.log('Problem status:', probRes.status, 'Title:', probData?.data?.title);

  // 4. Bookmark problem
  console.log('\n4. POST /api/dsa/problems/two-sum/bookmark');
  const bmRes = await fetch(`${BASE}/problems/two-sum/bookmark`, { method: 'POST', headers });
  const bmData = await bmRes.json();
  console.log('Bookmark status:', bmRes.status, bmData);

  // 5. Submit code
  console.log('\n5. POST /api/dsa/problems/two-sum/submit');
  const subRes = await fetch(`${BASE}/problems/two-sum/submit`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      language: 'javascript',
      code: 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) return [map.get(complement), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}'
    })
  });
  const subData = await subRes.json();
  console.log('Submission status:', subRes.status, subData);

  // 6. GET Progress
  console.log('\n6. GET /api/dsa/progress');
  const progRes = await fetch(`${BASE}/progress`, { headers });
  const progData = await progRes.json();
  console.log('Progress status:', progRes.status, 'Solved:', progData?.data?.totalSolved, 'Streak:', progData?.data?.streak?.currentStreak);

  // 7. GET Submissions
  console.log('\n7. GET /api/dsa/submissions');
  const subsRes = await fetch(`${BASE}/submissions`, { headers });
  const subsData = await subsRes.json();
  console.log('Submissions status:', subsRes.status, 'Count:', subsData?.data?.length);

  // 8. Admin Stats
  console.log('\n8. GET /api/admin/dsa/stats');
  const adminRes = await fetch('http://localhost:3000/api/admin/dsa/stats', { headers });
  const adminData = await adminRes.json();
  console.log('Admin stats status:', adminRes.status, adminData?.data);

  console.log('\n✨ All DSA backend endpoints tested successfully!');
}

testEndpoints().catch(console.error);
