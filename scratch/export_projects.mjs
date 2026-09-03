const dbUrl = 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const neonUrl = 'https://ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/sql';
import fs from 'fs';

async function exportProjects() {
  const res = await fetch(neonUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': dbUrl
    },
    body: JSON.stringify({
      query: 'SELECT * FROM projects WHERE deleted_at IS NULL ORDER BY display_order ASC, created_at DESC'
    })
  });
  const data = await res.json();
  fs.writeFileSync('scratch/exported_projects.json', JSON.stringify(data.rows, null, 2), 'utf8');
  console.log('Exported', data.rows.length, 'projects to scratch/exported_projects.json');
}
exportProjects();
