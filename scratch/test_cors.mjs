async function testCors() {
  const neonUrl = 'https://ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/sql';
  const dbUrl = 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

  // Test OPTIONS preflight
  const optRes = await fetch(neonUrl, {
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://sun-nexus-solutions-website.vercel.app',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type,neon-connection-string'
    }
  });

  console.log('OPTIONS status:', optRes.status);
  console.log('OPTIONS CORS headers:', {
    allowOrigin: optRes.headers.get('access-control-allow-origin'),
    allowHeaders: optRes.headers.get('access-control-allow-headers'),
    allowMethods: optRes.headers.get('access-control-allow-methods')
  });

  // Test POST with Origin header
  const postRes = await fetch(neonUrl, {
    method: 'POST',
    headers: {
      'Origin': 'https://sun-nexus-solutions-website.vercel.app',
      'Content-Type': 'application/json',
      'Neon-Connection-String': dbUrl
    },
    body: JSON.stringify({
      query: 'SELECT count(*) FROM projects'
    })
  });
  console.log('POST status:', postRes.status);
  console.log('POST allowOrigin:', postRes.headers.get('access-control-allow-origin'));
  const data = await postRes.json();
  console.log('POST response data:', data);
}
testCors();
