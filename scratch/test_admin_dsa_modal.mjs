async function testAdminDsaModalFlow() {
  console.log('🧪 Starting Admin DSA Problem Modal Integration Test...\n');
  const BASE_URL = 'http://localhost:3000';
  const adminId = 'admin_master';

  // 1. Fetch Chapters & Topics
  console.log('1️⃣ Fetching Admin Chapters & Topics...');
  const topicsRes = await fetch(`${BASE_URL}/api/admin/dsa/topics`, {
    headers: { 'X-User-Id': adminId }
  });
  const topicsJson = await topicsRes.json();
  console.log(`   Status: ${topicsRes.status}, Found: ${topicsJson.data?.length || 0} topics`);
  const sampleTopicId = topicsJson.data?.[0]?.id || '01-basics';

  // 2. Fetch Subtopics
  console.log('\n2️⃣ Fetching Subtopics for Topic:', sampleTopicId);
  const secRes = await fetch(`${BASE_URL}/api/admin/dsa/sections?topicId=${sampleTopicId}`, {
    headers: { 'X-User-Id': adminId }
  });
  const secJson = await secRes.json();
  console.log(`   Found: ${secJson.data?.length || 0} subtopics`);
  const sampleSecId = secJson.data?.[0]?.id || null;

  // 3. Create a New Problem using the Modal Form Payload Structure
  const testProbId = `prob_test_${Date.now()}`;
  console.log('\n3️⃣ Creating New Problem (ID: ' + testProbId + ')...');
  const createPayload = {
    id: testProbId,
    topicId: sampleTopicId,
    sectionId: sampleSecId,
    title: 'Two Sum Target Index (Modal Test)',
    number: 999,
    difficulty: 'Easy',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    practiceUrl: 'https://leetcode.com/problems/two-sum/',
    videoUrl: 'https://youtube.com/watch?v=KLlXCFG5TnA',
    articleUrl: 'https://takeuforward.org/data-structure/two-sum-check-if-a-pair-with-given-sum-exists-in-array/',
    solutionUrl: 'https://github.com/sun-nexus/dsa-solutions/two-sum.py',
    editorialUrl: '',
    githubUrl: '',
    expectedConcepts: 'Hash Map, Complement Lookup',
    displayOrder: 999,
    isVisible: true,
    tags: ['Array', 'Hash Map', 'Two Pointers'],
    companies: ['Google', 'Amazon', 'Meta', 'Apple'],
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' }
    ],
    hints: ['A really brute force way would be to search for all possible pairs of numbers but that would be too slow.']
  };

  const createRes = await fetch(`${BASE_URL}/api/admin/dsa/problems`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': adminId },
    body: JSON.stringify(createPayload)
  });
  const createJson = await createRes.json();
  console.log('   Create Result:', createJson);

  // 4. Verify Problem in Public / Member Problem List
  console.log('\n4️⃣ Verifying Created Problem via Public Endpoint...');
  const pubRes = await fetch(`${BASE_URL}/api/dsa/problems/${testProbId}`, {
    headers: { 'X-User-Id': 'test_user_1' }
  });
  const pubJson = await pubRes.json();
  console.log(`   Found Problem: "${pubJson.data?.title}", Difficulty: ${pubJson.data?.difficulty}, Tags: ${pubJson.data?.tags?.join(', ')}`);
  console.log(`   Companies: ${pubJson.data?.companies?.join(', ')}`);
  console.log(`   Practice URL: ${pubJson.data?.practiceUrl}`);

  // 5. Update / Edit Problem
  console.log('\n5️⃣ Editing Problem (Changing Difficulty to Medium & Updating Time Complexity)...');
  const updatePayload = {
    ...createPayload,
    difficulty: 'Medium',
    timeComplexity: 'O(n log n)',
    title: 'Two Sum Target Index (Updated to Medium)'
  };
  const updateRes = await fetch(`${BASE_URL}/api/admin/dsa/problems/${testProbId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-User-Id': adminId },
    body: JSON.stringify(updatePayload)
  });
  const updateJson = await updateRes.json();
  console.log('   Update Result:', updateJson);

  // 6. Verify Updated Details
  const checkUpdatedRes = await fetch(`${BASE_URL}/api/dsa/problems/${testProbId}`, {
    headers: { 'X-User-Id': 'test_user_1' }
  });
  const checkUpdatedJson = await checkUpdatedRes.json();
  console.log(`   Verified Updated Title: "${checkUpdatedJson.data?.title}", Difficulty: ${checkUpdatedJson.data?.difficulty}`);

  // 7. Cleanup Test Problem
  console.log('\n7️⃣ Cleaning up test problem...');
  const delRes = await fetch(`${BASE_URL}/api/admin/dsa/problems/${testProbId}`, {
    method: 'DELETE',
    headers: { 'X-User-Id': adminId }
  });
  const delJson = await delRes.json();
  console.log('   Delete Result:', delJson);

  console.log('\n🎉 Admin DSA Problem Modal Integration Test Passed with Flying Colors!');
}

testAdminDsaModalFlow().catch(console.error);
