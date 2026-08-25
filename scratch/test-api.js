async function testEndpoints() {
  console.log('Testing Stat Cards API Server...');
  try {
    const getRes = await fetch('http://localhost:3000/api/stat-cards');
    console.log('GET /api/stat-cards Status:', getRes.status);
    if (getRes.ok) {
      const data = await getRes.json();
      console.log('GET Stat Cards Response Keys:', Object.keys(data.cards || {}));
    }
  } catch (err) {
    console.error('Server offline or error:', err.message);
  }
}

testEndpoints();
