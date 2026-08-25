import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:3000';

async function testSummaryDescCrud() {
  console.log("=== TESTING REAL-TIME SUMMARY & DESCRIPTION CRUD ON SERVER ===\n");

  const testId = `test_crud_${Date.now()}`;
  const testPayload = {
    id: testId,
    title: "Test Dual Description Project",
    summary: "THIS IS THE SHORT CARD SUMMARY (Card Face Only)",
    description: "THIS IS THE COMPREHENSIVE MODAL DETAILED DESCRIPTION (Modal Only)",
    category: "Advanced",
    status: "in_progress",
    priority: "High",
    domain: "Engineering"
  };

  console.log("1. Creating test project via POST /api/projects...");
  const createRes = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testPayload)
  });
  const createData = await createRes.json();
  console.log("Create response:", createData);

  console.log("\n2. Fetching public projects via GET /api/projects/public...");
  const pubRes = await fetch(`${BASE_URL}/api/projects/public?_t=${Date.now()}`);
  const pubData = await pubRes.json();
  const found = (pubData.projects || []).find(p => p.id === testId);

  if (!found) {
    console.error("❌ Test project not found in public projects list!");
    return;
  }

  console.log("Fetched Project From Server:");
  console.log(`   ID:          ${found.id}`);
  console.log(`   Title:       "${found.title}"`);
  console.log(`   Summary:     "${found.summary}"`);
  console.log(`   Description: "${found.description}"`);

  if (found.summary === testPayload.summary && found.description === testPayload.description) {
    console.log("\n✅ SUCCESS: SERVER PROPERLY SAVED AND RETURNED SEPARATE SUMMARY & DESCRIPTION!");
  } else {
    console.error("\n❌ MISMATCH DETECTED!");
  }

  console.log("\n3. Cleaning up test project from database...");
  await fetch(`${BASE_URL}/api/projects/${testId}`, { method: 'DELETE' });
  console.log("Cleaned up.");
}

testSummaryDescCrud().catch(console.error);
