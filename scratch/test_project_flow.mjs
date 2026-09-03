import fs from 'fs';

const NEON_DB_URL = 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const NEON_SQL_ENDPOINT = 'https://ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/sql';

// Helper: Safe JSON Array Parser
const safeJsonParseArray = (val, fallback = []) => {
  if (!val) return fallback;
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return fallback;
    if (trimmed.startsWith('[')) {
      try {
        let parsed = JSON.parse(trimmed);
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return trimmed.split(',').map(s => s.trim()).filter(Boolean);
  }
  return fallback;
};

// Helper: Team Member Parser
const parseTeamMembers = (rawTeam) => {
  if (!rawTeam) return [];
  if (Array.isArray(rawTeam)) {
    return rawTeam.map(m => {
      if (typeof m === 'string') return { name: m.trim(), image: '', role: 'Contributor' };
      if (typeof m === 'object' && m !== null) {
        return {
          name: m.name || m.fullName || m.memberName || 'Member',
          image: m.image || m.avatar || m.profile_image || '',
          role: m.role || m.leadership_role || 'Contributor'
        };
      }
      return { name: 'Member', image: '', role: 'Contributor' };
    });
  }
  if (typeof rawTeam === 'string') {
    const trimmed = rawTeam.trim();
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parseTeamMembers(parsed);
      } catch (e) {}
    }
    return trimmed.split(',').map(n => ({ name: n.trim(), image: '', role: 'Contributor' })).filter(m => m.name);
  }
  return [];
};

async function testProjectFetch() {
  const res = await fetch(NEON_SQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': NEON_DB_URL
    },
    body: JSON.stringify({
      query: 'SELECT * FROM projects WHERE deleted_at IS NULL ORDER BY display_order ASC, created_at DESC'
    })
  });
  const data = await res.json();
  const apiProjects = data.rows;
  console.log('Fetched rows from Neon:', apiProjects.length);

  const loadedItems = [];
  apiProjects.forEach(p => {
    const vis = (p.visibility || 'public').toLowerCase().trim();
    const status = (p.status || 'in_progress').toLowerCase().trim();

    // Strict Filter: Exclude private, draft, pending_review, or rejected projects
    if (vis === 'private' || vis === 'hidden') return;
    if (['draft', 'pending_review', 'rejected'].includes(status)) return;

    const name = p.title || 'Untitled Project';
    const catRaw = (p.category || 'Advanced').toLowerCase().trim();
    const parsedTeam = parseTeamMembers(p.team_members || p.teamMembers || p.team);

    const isOngoing = catRaw.includes('ongoing') || !['completed', 'done', 'finished'].includes(status);

    let diffCat = 'ADVANCED';
    if (catRaw.includes('beginner')) diffCat = 'BEGINNER';
    else if (catRaw.includes('intermediate')) diffCat = 'INTERMEDIATE';
    else if (catRaw.includes('ongoing')) diffCat = 'ADVANCED';

    const item = {
      id: p.id,
      title: name,
      summary: p.summary || p.card_summary || p.cardSummary || p.description || p.desc || '',
      details: p.description || p.desc || p.details || p.summary || '',
      category: p.category || diffCat,
      difficulty: diffCat,
      status: status,
      isOngoing: isOngoing,
      techStack: safeJsonParseArray(p.tech_stack || p.techStack || p.tech),
      team: parsedTeam
    };
    loadedItems.push(item);
  });

  console.log('Processed loaded items count:', loadedItems.length);
  loadedItems.forEach(item => {
    console.log(`- Title: "${item.title}" | Difficulty: ${item.difficulty} | Status: ${item.status}`);
  });
}

testProjectFetch();
