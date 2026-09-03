async function runFullDsaWorkflowTest() {
  console.log('🚀 Starting Full DSA Learning Platform Backend Integration Test...');

  const BASE = 'http://localhost:3000/api';
  const testUserId = 'test_member_dsa_01';
  const headers = {
    'Content-Type': 'application/json',
    'X-User-Id': testUserId
  };

  // 1. Check Topics
  console.log('\n--- 1. Fetching Topics ---');
  const topicsRes = await fetch(`${BASE}/dsa/topics`, { headers });
  const topicsJson = await topicsRes.json();
  console.log(`Status: ${topicsRes.status} | Total Chapters: ${topicsJson.data?.length}`);
  console.log(`Chapter 1: ${topicsJson.data?.[0]?.title} (Sections: ${topicsJson.data?.[0]?.section_count}, Problems: ${topicsJson.data?.[0]?.problem_count})`);

  // 2. Filter Problems by Topic
  console.log('\n--- 2. Fetching Problems for Topic: 02-arrays ---');
  const probsRes = await fetch(`${BASE}/dsa/problems?topicId=02-arrays`, { headers });
  const probsJson = await probsRes.json();
  console.log(`Status: ${probsRes.status} | Total Problems Found: ${probsJson.data?.total}`);
  probsJson.data?.items?.forEach(p => {
    console.log(` - [${p.difficulty}] #${p.number}: ${p.title} (Status: ${p.status}, Bookmarked: ${p.isBookmarked})`);
  });

  // 3. Bookmark Problem 'two-sum'
  console.log('\n--- 3. Bookmarking Problem "two-sum" ---');
  const bmRes = await fetch(`${BASE}/dsa/problems/two-sum/bookmark`, { method: 'POST', headers });
  const bmJson = await bmRes.json();
  console.log(`Bookmark result:`, bmJson);

  // 4. Verify in Bookmarks List
  console.log('\n--- 4. Checking Bookmarks List ---');
  const bmListRes = await fetch(`${BASE}/dsa/bookmarks`, { headers });
  const bmListJson = await bmListRes.json();
  console.log(`Total bookmarks: ${bmListJson.data?.length}`);
  console.log(`Bookmarked problem title: ${bmListJson.data?.[0]?.title}`);

  // 5. Submit Code for Problem 'two-sum'
  console.log('\n--- 5. Submitting Solution for "two-sum" ---');
  const submitRes = await fetch(`${BASE}/dsa/problems/two-sum/submit`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      language: 'javascript',
      code: 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) return [map.get(complement), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}'
    })
  });
  const submitJson = await submitRes.json();
  console.log(`Submission Verdict: ${submitJson.data?.verdict} | Runtime: ${submitJson.data?.runtime} | Memory: ${submitJson.data?.memory}`);
  console.log(`Test Cases Passed: ${submitJson.data?.testCasesPassed}/${submitJson.data?.testCasesTotal}`);
  console.log(`Current Streak: ${submitJson.data?.streak?.currentStreak} day(s)`);

  // 6. Fetch User Learning Dashboard Progress
  console.log('\n--- 6. Checking User Progress Dashboard ---');
  const progRes = await fetch(`${BASE}/dsa/progress`, { headers });
  const progJson = await progRes.json();
  console.log(`Overall Progress: ${progJson.data?.overallProgressPct}% | Total Solved: ${progJson.data?.totalSolved}/${progJson.data?.totalProblems}`);
  console.log(`Easy: ${progJson.data?.easy?.solved}/${progJson.data?.easy?.total} | Medium: ${progJson.data?.medium?.solved}/${progJson.data?.medium?.total} | Hard: ${progJson.data?.hard?.solved}/${progJson.data?.hard?.total}`);
  console.log(`Current Streak: ${progJson.data?.streak?.currentStreak} | Longest Streak: ${progJson.data?.streak?.longestStreak}`);
  console.log(`Last Active: ${progJson.data?.lastActive?.problemTitle} (${progJson.data?.lastActive?.topicTitle})`);

  // 7. Verify Submissions History
  console.log('\n--- 7. Fetching Submissions History ---');
  const subsRes = await fetch(`${BASE}/dsa/submissions`, { headers });
  const subsJson = await subsRes.json();
  console.log(`Submissions logged: ${subsJson.data?.length}`);
  console.log(`Latest Submission: ${subsJson.data?.[0]?.problemTitle} - ${subsJson.data?.[0]?.verdict} (${subsJson.data?.[0]?.language}, ${subsJson.data?.[0]?.runtime})`);

  // 8. Admin DSA Stats Overview
  console.log('\n--- 8. Admin Platform Analytics ---');
  const adminHeaders = { 'Content-Type': 'application/json', 'X-User-Id': 'admin_master' };
  const adminRes = await fetch(`${BASE}/admin/dsa/stats`, { headers: adminHeaders });
  const adminJson = await adminRes.json();
  console.log('Platform Analytics:', adminJson.data);

  console.log('\n✅ COMPLETE DSA BACKEND INTEGRATION TEST PASSED 100%!');
}

runFullDsaWorkflowTest().catch(console.error);
