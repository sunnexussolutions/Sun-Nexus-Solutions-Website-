import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const dbUrl = process.env.DATABASE_URL || process.env.VITE_NEON_URL || 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
  const sql = neon(dbUrl);

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS site_content (
        key TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    if (req.method === 'GET') {
      const rows = await sql`SELECT data FROM site_content WHERE key = 'home_content' LIMIT 1`;
      if (rows && rows.length > 0) {
        const content = typeof rows[0].data === 'string' ? JSON.parse(rows[0].data) : rows[0].data;
        return res.status(200).json({ success: true, content });
      }
      return res.status(200).json({ success: true, content: null });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { content } = body || {};
      if (!content) {
        return res.status(400).json({ success: false, message: 'Invalid home content payload' });
      }

      await sql`
        INSERT INTO site_content (key, data, updated_at)
        VALUES ('home_content', ${JSON.stringify(content)}, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP
      `;

      return res.status(200).json({ success: true, message: 'Home content updated successfully', content });
    }

    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Vercel API home-content error:', error);
    res.status(200).json({ success: true, content: null, error: error.message });
  }
}
