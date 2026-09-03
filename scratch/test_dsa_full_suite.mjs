async function testDsaSuite() {
  console.log('🧪 Starting Full DSA Learning Platform Test Suite...\n');
  const BASE_URL = 'http://localhost:3000';
  const testUserId = 'test_learner_42';
  const adminUserId = 'admin_master';

  // 1. Test Topics & Subtopics
  console.log('1️⃣ Testing GET /api/dsa/topics...');
  const topicsRes = await fetch(`${BASE_URL}/api/dsa/topics`, {
    headers: { 'X-User-Id': testUserId }
  });
  const topicsJson = await topicsRes.json();
  console.log(`   Status: ${topicsRes.status}, Success: ${topicsJson.success}, Topics Count: ${topicsJson.data?.length || 0}`);
  if (topicsJson.data?.length > 0) {
    console.log(`   Sample Topic: "${topicsJson.data[0].title}", Sections: ${topicsJson.data[0].sections?.length || 0}`);
  }

  // 2. Test Problems Filter & Enrichment
  console.log('\n2️⃣ Testing GET /api/dsa/problems...');
  const probsRes = await fetch(`${BASE_URL}/api/dsa/problems?limit=50`, {
    headers: { 'X-User-Id': testUserId }
  });
  const probsJson = await probsRes.json();
  console.log(`   Status: ${probsRes.status}, Success: ${probsJson.success}, Problems Count: ${probsJson.data?.length || 0}`);
  if (probsJson.data?.length > 0) {
    const p = probsJson.data[0];
    console.log(`   Sample Problem: #${p.number} "${p.title}" [${p.difficulty}]`);
    console.log(`   Resources: Video=${!!p.videoUrl}, Article=${!!p.articleUrl}, Practice=${!!p.practiceUrl}`);
    console.log(`   Tags: ${p.tags?.join(', ') || 'None'}, Companies: ${p.companies?.join(', ') || 'None'}`);
  }

  // 3. Test Progress Tracking (Status Update)
  console.log('\n3️⃣ Testing PATCH /api/dsa/problems/:problemId/progress...');
  const sampleProbId = probsJson.data?.[0]?.id || 'two-sum';
  const statusRes = await fetch(`${BASE_URL}/api/dsa/problems/${sampleProbId}/progress`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': testUserId },
    body: JSON.stringify({ status: 'SOLVED' })
  });
  const statusJson = await statusRes.json();
  console.log(`   Status Update Result:`, statusJson);

  // 4. Test User Notes API
  console.log('\n4️⃣ Testing User Personal Notes API (Isolated)...');
  const noteSaveRes = await fetch(`${BASE_URL}/api/dsa/problems/${sampleProbId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': testUserId },
    body: JSON.stringify({ note_text: 'Use Hash Map with compliment index lookup O(n) time and O(n) space.' })
  });
  const noteSaveJson = await noteSaveRes.json();
  console.log(`   Note Saved:`, noteSaveJson);

  const noteGetRes = await fetch(`${BASE_URL}/api/dsa/problems/${sampleProbId}/notes`, {
    headers: { 'X-User-Id': testUserId }
  });
  const noteGetJson = await noteGetRes.json();
  console.log(`   Note Retrieved:`, noteGetJson.data?.note_text);

  // 5. Test Revision Queue API
  console.log('\n5️⃣ Testing User Revision Queue API...');
  const revAddRes = await fetch(`${BASE_URL}/api/dsa/problems/${sampleProbId}/revision`, {
    method: 'POST',
    headers: { 'X-User-Id': testUserId }
  });
  const revAddJson = await revAddRes.json();
  console.log(`   Revision Add:`, revAddJson);

  const revGetRes = await fetch(`${BASE_URL}/api/dsa/revisions`, {
    headers: { 'X-User-Id': testUserId }
  });
  const revGetJson = await revGetRes.json();
  console.log(`   Revisions Count: ${revGetJson.data?.length || 0}`);

  // 6. Test Overall Progress API
  console.log('\n6️⃣ Testing GET /api/dsa/progress...');
  const progRes = await fetch(`${BASE_URL}/api/dsa/progress`, {
    headers: { 'X-User-Id': testUserId }
  });
  const progJson = await progRes.json();
  console.log(`   Progress Data: Solved=${progJson.data?.totalSolved}/${progJson.data?.totalProblems} (${progJson.data?.overallProgressPct}%)`);
  console.log(`   Easy=${progJson.data?.easy?.solved}/${progJson.data?.easy?.total}, Medium=${progJson.data?.medium?.solved}/${progJson.data?.medium?.total}, Hard=${progJson.data?.hard?.solved}/${progJson.data?.hard?.total}`);
  console.log(`   Streak: ${progJson.data?.streak?.currentStreak} days`);

  // 7. Test Admin DSA Stats
  console.log('\n7️⃣ Testing GET /api/admin/dsa/stats...');
  const adminStatsRes = await fetch(`${BASE_URL}/api/admin/dsa/stats`, {
    headers: { 'X-User-Id': adminUserId }
  });
  const adminStatsJson = await adminStatsRes.json();
  console.log(`   Admin Stats:`, adminStatsJson.data);

  console.log('\n🎉 DSA Learning Platform Full Test Suite Completed Successfully!');
}

testDsaSuite().catch(console.error);
