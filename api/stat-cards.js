import { neon } from '@neondatabase/serverless';

const DEFAULT_STAT_CARDS = {
  'home_hero_active_students': { card_key: 'home_hero_active_students', value: '10K+', label: 'Active Students', page: 'Home', category: 'Hero Badges', order_index: 1 },
  'home_hero_expert_mentors': { card_key: 'home_hero_expert_mentors', value: '200+', label: 'Expert Mentors', page: 'Home', category: 'Hero Badges', order_index: 2 },
  'home_row_domains': { card_key: 'home_row_domains', value: '50+', label: 'Domains', page: 'Home', category: 'Hero Stats Row', order_index: 3 },
  'home_row_projects': { card_key: 'home_row_projects', value: '1K+', label: 'Projects Published', page: 'Home', category: 'Hero Stats Row', order_index: 4 },
  'home_row_events': { card_key: 'home_row_events', value: '100+', label: 'Events Organized', page: 'Home', category: 'Hero Stats Row', order_index: 5 },
  'home_row_possibilities': { card_key: 'home_row_possibilities', value: '5K+', label: 'Community Members', page: 'Home', category: 'Hero Stats Row', order_index: 6 },

  'mentor_batch_title': { card_key: 'mentor_batch_title', value: 'Batch: 1', label: 'Batch Title', page: 'Mentorship', category: 'Batch Info', order_index: 1 },
  'mentor_batch_dates': { card_key: 'mentor_batch_dates', value: 'November 2025 - January 2026', label: 'Batch Dates', page: 'Mentorship', category: 'Batch Info', order_index: 2 },
  'mentor_stat_events_registered': { card_key: 'mentor_stat_events_registered', value: '150+', label: 'Members Registered for Events', page: 'Mentorship', category: 'Membership Stats', order_index: 3 },
  'mentor_stat_spot_registrations': { card_key: 'mentor_stat_spot_registrations', value: '80+', label: 'Spot Registrations', page: 'Mentorship', category: 'Membership Stats', order_index: 4 },
  'mentor_stat_events_attended': { card_key: 'mentor_stat_events_attended', value: '200+', label: 'Members Attended Events', page: 'Mentorship', category: 'Membership Stats', order_index: 5 },
  'mentor_stat_mentorship_registered': { card_key: 'mentor_stat_mentorship_registered', value: '80+', label: 'Members Registered for Mentorship', page: 'Mentorship', category: 'Membership Stats', order_index: 6 },

  'event_karmasiddhi_registered': { card_key: 'event_karmasiddhi_registered', value: '120 Members', label: 'REGISTERED', page: 'Events', category: 'Karmasiddhi Event', order_index: 1 },
  'event_karmasiddhi_attended': { card_key: 'event_karmasiddhi_attended', value: '100 Members', label: 'ATTENDED', page: 'Events', category: 'Karmasiddhi Event', order_index: 2 },
  'event_karmasiddhi_duration': { card_key: 'event_karmasiddhi_duration', value: '10:00 AM - 12:00 PM', label: 'DURATION', page: 'Events', category: 'Karmasiddhi Event', order_index: 3 },
  'event_ainexus_registered': { card_key: 'event_ainexus_registered', value: '110 Members', label: 'REGISTERED', page: 'Events', category: 'AI Nexus Event', order_index: 4 },
  'event_ainexus_attended': { card_key: 'event_ainexus_attended', value: '100 Members', label: 'ATTENDED', page: 'Events', category: 'AI Nexus Event', order_index: 5 },
  'event_ainexus_duration': { card_key: 'event_ainexus_duration', value: 'Full Day Event', label: 'DURATION', page: 'Events', category: 'AI Nexus Event', order_index: 6 },

  'dash_active_members': { card_key: 'dash_active_members', value: '100+', label: 'Active Members', page: 'Dashboard', category: 'Hub Metrics', order_index: 1 },
  'dash_projects_done': { card_key: 'dash_projects_done', value: '50+', label: 'Projects Done', page: 'Dashboard', category: 'Hub Metrics', order_index: 2 },
  'dash_tech_domains': { card_key: 'dash_tech_domains', value: '10+', label: 'Tech Domains', page: 'Dashboard', category: 'Hub Metrics', order_index: 3 }
};

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
      CREATE TABLE IF NOT EXISTS site_stat_cards (
        card_key TEXT PRIMARY KEY,
        page TEXT NOT NULL,
        category TEXT,
        label TEXT NOT NULL,
        value TEXT NOT NULL,
        subtext TEXT,
        icon TEXT,
        order_index INT DEFAULT 0,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    if (req.method === 'GET') {
      const rows = await sql`SELECT card_key, page, category, label, value, subtext, icon, order_index FROM site_stat_cards ORDER BY order_index ASC`;
      const cardsMap = { ...DEFAULT_STAT_CARDS };
      if (rows && rows.length > 0) {
        rows.forEach(r => {
          cardsMap[r.card_key] = {
            card_key: r.card_key,
            page: r.page,
            category: r.category,
            label: r.label,
            value: r.value,
            subtext: r.subtext || '',
            icon: r.icon || '',
            order_index: r.order_index || 0
          };
        });
      }
      return res.status(200).json({ success: true, cards: cardsMap });
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { cards } = body || {};
      if (!cards || typeof cards !== 'object') {
        return res.status(400).json({ success: false, message: 'Invalid cards payload' });
      }

      for (const [key, card] of Object.entries(cards)) {
        await sql`
          INSERT INTO site_stat_cards (card_key, page, category, label, value, subtext, icon, order_index, updated_at)
          VALUES (${key}, ${card.page || 'General'}, ${card.category || ''}, ${card.label || ''}, ${card.value || ''}, ${card.subtext || ''}, ${card.icon || ''}, ${card.order_index || 0}, CURRENT_TIMESTAMP)
          ON CONFLICT (card_key) DO UPDATE SET
            label = EXCLUDED.label,
            value = EXCLUDED.value,
            subtext = EXCLUDED.subtext,
            page = EXCLUDED.page,
            category = EXCLUDED.category,
            icon = EXCLUDED.icon,
            order_index = EXCLUDED.order_index,
            updated_at = CURRENT_TIMESTAMP
        `;
      }

      return res.status(200).json({ success: true, message: 'Stat cards updated successfully', cards });
    }

    res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error('Vercel API stat-cards error:', error);
    res.status(200).json({ success: true, cards: DEFAULT_STAT_CARDS, note: error.message });
  }
}
