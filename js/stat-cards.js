/**
 * Sun Nexus Solutions - Dynamic Stat Cards Engine
 * Synchronizes stat cards across all pages with Admin Panel settings.
 */

(function () {
  const DEFAULT_CARDS = {
    // Home Page
    'home_hero_active_students': { value: '100+', label: 'Active Students', page: 'Home', category: 'Hero Badges', order_index: 1 },
    'home_hero_expert_mentors': { value: '20+', label: 'Expert Mentors', page: 'Home', category: 'Hero Badges', order_index: 2 },
    'home_row_domains': { value: '10+', label: 'Domains', page: 'Home', category: 'Hero Stats Row', order_index: 3 },
    'home_row_projects': { value: '20+', label: 'Projects Published', page: 'Home', category: 'Hero Stats Row', order_index: 4 },
    'home_row_events': { value: '3+', label: 'Events Organized', page: 'Home', category: 'Hero Stats Row', order_index: 5 },
    // 'home_row_possibilities': { value: '∞', label: 'Possibilities', page: 'Home', category: 'Hero Stats Row', order_index: 6 },

    // Mentorship Page
    'mentor_batch_title': { value: 'Batch: 1', label: '', page: 'Mentorship' },
    'mentor_batch_dates': { value: 'November 2025 - January 2026', label: '', page: 'Mentorship' },
    'mentor_stat_events_registered': { value: '150+', label: 'Members Registered for Events', page: 'Mentorship' },
    'mentor_stat_spot_registrations': { value: '80+', label: 'Spot Registrations', page: 'Mentorship' },
    'mentor_stat_events_attended': { value: '200+', label: 'Members Attended Events', page: 'Mentorship' },
    'mentor_stat_mentorship_registered': { value: '80+', label: 'Members Registered for Mentorship', page: 'Mentorship' },

    // Events Page
    'event_karmasiddhi_registered': { value: '120 Members', label: 'REGISTERED', page: 'Events' },
    'event_karmasiddhi_attended': { value: '100 Members', label: 'ATTENDED', page: 'Events' },
    'event_karmasiddhi_duration': { value: '10:00 AM - 12:00 PM', label: 'DURATION', page: 'Events' },
    'event_ainexus_registered': { value: '110 Members', label: 'REGISTERED', page: 'Events' },
    'event_ainexus_attended': { value: '100 Members', label: 'ATTENDED', page: 'Events' },
    'event_ainexus_duration': { value: 'Full Day Event', label: 'DURATION', page: 'Events' },

    // Dashboard Page
    'dash_active_members': { value: '100+', label: 'Active Members', page: 'Dashboard' },
    'dash_projects_done': { value: '50+', label: 'Projects Done', page: 'Dashboard' },
    'dash_tech_domains': { value: '10+', label: 'Tech Domains', page: 'Dashboard' }
  };

  const getApiUrl = () => {
    const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:';
    return isLocal ? 'http://localhost:3000/api/stat-cards' : '/api/stat-cards';
  };

  function getCombinedCards() {
    let cardsMap = { ...DEFAULT_CARDS };

    // 1. Try nexus_home_content as baseline fallback for Home page cards
    try {
      const localHome = localStorage.getItem('nexus_home_content') || localStorage.getItem('nexus_home_data');
      if (localHome) {
        const homeObj = JSON.parse(localHome);
        if (homeObj && homeObj.hero) {
          if (homeObj.hero.badge1Number) cardsMap['home_hero_active_students'] = { ...cardsMap['home_hero_active_students'], value: homeObj.hero.badge1Number };
          if (homeObj.hero.badge1Label) cardsMap['home_hero_active_students'] = { ...cardsMap['home_hero_active_students'], label: homeObj.hero.badge1Label };
          if (homeObj.hero.badge2Number) cardsMap['home_hero_expert_mentors'] = { ...cardsMap['home_hero_expert_mentors'], value: homeObj.hero.badge2Number };
          if (homeObj.hero.badge2Label) cardsMap['home_hero_expert_mentors'] = { ...cardsMap['home_hero_expert_mentors'], label: homeObj.hero.badge2Label };
        }
        if (homeObj && Array.isArray(homeObj.stats)) {
          const keys = ['home_row_domains', 'home_row_projects', 'home_row_events', 'home_row_possibilities'];
          homeObj.stats.forEach((st, idx) => {
            if (keys[idx]) {
              cardsMap[keys[idx]] = {
                ...cardsMap[keys[idx]],
                value: st.value || cardsMap[keys[idx]].value,
                label: st.label || cardsMap[keys[idx]].label
              };
            }
          });
        }
      }
    } catch (e) {}

    // 2. OVERWRITE WITH MASTER nexus_stat_cards (takes absolute priority)
    try {
      const localStat = localStorage.getItem('nexus_stat_cards');
      if (localStat) {
        const parsed = JSON.parse(localStat);
        cardsMap = { ...cardsMap, ...parsed };
      }
    } catch (e) {}

    return cardsMap;
  }

  function applyStatCards(cardsMap) {
    if (!cardsMap) return;

    document.querySelectorAll('[data-stat-key]').forEach(el => {
      const key = el.getAttribute('data-stat-key');
      const card = cardsMap[key];
      if (card && card.value !== undefined && card.value !== null) {
        el.textContent = card.value;
      }
    });

    document.querySelectorAll('[data-stat-label-key]').forEach(el => {
      const key = el.getAttribute('data-stat-label-key');
      const card = cardsMap[key];
      if (card && card.label !== undefined && card.label !== null && card.label !== '') {
        el.textContent = card.label;
      }
    });
  }

  async function fetchFromNeonDirect() {
    const dbUrl = 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
    const neonUrl = 'https://ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/sql';
    try {
      const res = await fetch(neonUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Neon-Connection-String': dbUrl
        },
        body: JSON.stringify({
          query: 'SELECT card_key, page, category, label, value, subtext, icon, order_index FROM site_stat_cards ORDER BY order_index ASC'
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.rows) && data.rows.length > 0) {
          const cardsMap = {};
          data.rows.forEach(r => {
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
          return cardsMap;
        }
      }
    } catch (e) {}
    return null;
  }

  async function loadStatCards() {
    // 1. Fetch fresh live values directly from API server or Neon HTTPS DB
    try {
      const res = await fetch(getApiUrl());
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.cards && Object.keys(data.cards).length > 0) {
          localStorage.setItem('nexus_stat_cards', JSON.stringify(data.cards));
          applyStatCards(data.cards);
          return;
        }
      }
    } catch (err) {}

    // 2. Direct Neon Cloud DB fetch over HTTPS if local server is offline
    const cloudCards = await fetchFromNeonDirect();
    if (cloudCards && Object.keys(cloudCards).length > 0) {
      localStorage.setItem('nexus_stat_cards', JSON.stringify(cloudCards));
      applyStatCards(cloudCards);
      return;
    }

    // 3. Render local storage cache if network is unavailable
    applyStatCards(getCombinedCards());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadStatCards);
  } else {
    loadStatCards();
  }

  window.addEventListener('storage', (e) => {
    if (!e.key || ['nexus_stat_cards', 'nexus_home_content', 'nexus_home_data'].includes(e.key)) {
      applyStatCards(getCombinedCards());
    }
  });

  window.addEventListener('nexus-stat-cards-updated', () => {
    loadStatCards();
  });

  window.addEventListener('nexus-data-updated', () => {
    loadStatCards();
  });

  window.NexusStatCards = {
    load: loadStatCards,
    apply: applyStatCards,
    getCombined: getCombinedCards,
    defaults: DEFAULT_CARDS
  };
})();
