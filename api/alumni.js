import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-user-id, x-user-role');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const dbUrl = process.env.DATABASE_URL || process.env.VITE_NEON_URL || 'postgresql://neondb_owner:REDACTED_SECRET@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
  const sql = neon(dbUrl);

  try {
    if (req.method === 'GET') {
      const { batch, company, search, include_inactive } = req.query || {};

      let rows = await sql`
        SELECT * FROM alumni 
        ORDER BY batch DESC, is_leader DESC, display_order ASC, name ASC
      `;

      if (include_inactive !== 'true') {
        rows = rows.filter(a => a.is_active !== false);
      }
      if (batch && batch !== 'All Batches') {
        rows = rows.filter(a => String(a.batch) === String(batch));
      }
      if (company && company !== 'All Companies') {
        const comp = String(company).toLowerCase().trim();
        rows = rows.filter(a => String(a.company || '').toLowerCase().trim() === comp);
      }
      if (search) {
        const s = String(search).toLowerCase().trim();
        rows = rows.filter(a =>
          (a.name && a.name.toLowerCase().includes(s)) ||
          (a.current_role && a.current_role.toLowerCase().includes(s)) ||
          (a.company && a.company.toLowerCase().includes(s)) ||
          (a.skills && a.skills.toLowerCase().includes(s)) ||
          (a.location && a.location.toLowerCase().includes(s))
        );
      }

      const allActive = await sql`SELECT batch, company, country FROM alumni WHERE is_active = true`;
      const uniqueBatches = new Set(allActive.map(a => a.batch)).size;
      const uniqueCompanies = new Set(allActive.map(a => String(a.company || '').trim().toLowerCase())).size;
      const uniqueCountries = new Set(allActive.map(a => (a.country || 'India').trim().toLowerCase())).size;
      const totalAlumni = allActive.length;

      const stats = {
        totalBatches: Math.max(uniqueBatches, 15),
        totalAlumni: Math.max(totalAlumni, 850),
        totalCompanies: Math.max(uniqueCompanies, 250),
        totalCountries: Math.max(uniqueCountries, 12),
        exactBatchCount: uniqueBatches,
        exactAlumniCount: totalAlumni,
        exactCompanyCount: uniqueCompanies,
        exactCountryCount: uniqueCountries
      };

      return res.status(200).json({ success: true, data: rows, stats });
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      const rows = await sql`
        INSERT INTO alumni (
          name, profile_image, batch, is_leader, leadership_role, "current_role",
          company, location, country, skills, linkedin_url, github_url,
          portfolio_url, bio, is_active, display_order
        ) VALUES (
          ${b.name}, ${b.profile_image || b.imageUrl || null}, ${b.batch || '2024'},
          ${b.is_leader === true || b.isLeader === true}, ${b.leadership_role || b.leadershipRole || null},
          ${b.current_role || b.role || 'Alumnus'}, ${b.company}, ${b.location || null},
          ${b.country || 'India'}, ${b.skills || null}, ${b.linkedin_url || b.linkedinUrl || null},
          ${b.github_url || b.githubUrl || null}, ${b.portfolio_url || b.portfolioUrl || null},
          ${b.bio || null}, true, ${parseInt(b.display_order || b.displayOrder) || 0}
        )
        RETURNING *
      `;
      return res.status(201).json({ success: true, data: rows[0] });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('Vercel API alumni error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
