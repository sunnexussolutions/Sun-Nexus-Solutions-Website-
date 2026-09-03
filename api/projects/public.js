import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const dbUrl = process.env.DATABASE_URL || process.env.VITE_NEON_URL || 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
  const sql = neon(dbUrl);

  try {
    const { search, category, domain, status } = req.query || {};

    let projects = await sql`
      SELECT * FROM projects 
      WHERE deleted_at IS NULL 
      ORDER BY display_order ASC, created_at DESC
    `;

    let deletedRows = [];
    try {
      deletedRows = await sql`SELECT id, title FROM deleted_projects`;
    } catch (e) {}

    const deletedSet = new Set(deletedRows.map(d => String(d.id).toLowerCase()));
    deletedRows.forEach(d => {
      if (d.title) deletedSet.add(String(d.title).toLowerCase().trim());
    });

    // Public Security Filter: Exclude draft, private, or hidden projects
    projects = projects.filter(p => {
      const pId = String(p.id).toLowerCase();
      const pTitle = (p.title || '').toLowerCase().trim();
      if (deletedSet.has(pId) || (pTitle && deletedSet.has(pTitle))) return false;

      const vis = (p.visibility || 'public').toLowerCase().trim();
      const st = (p.status || '').toLowerCase().trim();
      if (vis === 'private' || vis === 'hidden') return false;
      if (['draft', 'pending_review', 'rejected'].includes(st)) return false;
      return true;
    });

    // Apply Query Filters
    if (search) {
      const s = String(search).toLowerCase().trim();
      projects = projects.filter(p =>
        (p.title && p.title.toLowerCase().includes(s)) ||
        (p.description && p.description.toLowerCase().includes(s)) ||
        (p.owner_name && p.owner_name.toLowerCase().includes(s)) ||
        (typeof p.tech_stack === 'string' && p.tech_stack.toLowerCase().includes(s)) ||
        (typeof p.team_members === 'string' && p.team_members.toLowerCase().includes(s))
      );
    }

    if (category && category !== 'ALL') {
      const cat = String(category).toLowerCase().trim();
      projects = projects.filter(p => String(p.category || '').toLowerCase().trim() === cat);
    }

    if (domain && domain !== 'ALL') {
      const dom = String(domain).toLowerCase().trim();
      projects = projects.filter(p => String(p.domain || '').toLowerCase().trim() === dom);
    }

    if (status && status !== 'ALL') {
      const st = String(status).toLowerCase().trim();
      projects = projects.filter(p => String(p.status || '').toLowerCase().trim() === st);
    }

    return res.status(200).json({ success: true, count: projects.length, projects });
  } catch (error) {
    console.error('Vercel API public projects error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
