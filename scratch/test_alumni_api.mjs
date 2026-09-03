async function testAlumniApi() {
  console.log('🧪 Testing /api/alumni endpoint...');
  const res = await fetch('http://localhost:3000/api/alumni');
  const json = await res.json();
  console.log('Status:', res.status, 'Success:', json.success, 'Count:', json.data?.length);
  console.log('Stats:', json.stats);

  const batches = Array.from(new Set(json.data.map(a => a.batch))).sort((a,b) => b.localeCompare(a));
  console.log('Available batches in DB:', batches);

  console.log('Sample alumni:', json.data.slice(0, 3).map(a => ({ name: a.name, batch: a.batch, company: a.company, leader: a.is_leader })));
}

testAlumniApi().catch(console.error);
