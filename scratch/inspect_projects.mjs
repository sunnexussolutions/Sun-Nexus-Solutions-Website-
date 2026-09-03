const dbUrl = 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const neonUrl = 'https://ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/sql';

async function checkProjects() {
  const res = await fetch(neonUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': dbUrl
    },
    body: JSON.stringify({
      query: 'SELECT id, title, category, status, visibility, deleted_at FROM projects'
    })
  });
  const data = await res.json();
  console.log('Total in table:', data.rows.length);
  data.rows.forEach((r, i) => {
    console.log(`${i+1}: ID=${r.id} | Title=${r.title} | Cat=${r.category} | Status=${r.status} | Vis=${r.visibility} | Del=${r.deleted_at}`);
  });
}
checkProjects();
