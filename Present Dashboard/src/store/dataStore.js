// Central data store — persists to localStorage
const KEYS = {
  ASSESSMENTS: 'nexus-assessments',
  USERS: 'nexus-users-db',
  DISCUSSIONS: 'nexus-discussions',
  NOTIFICATIONS: 'nexus-notifications',
  RESULTS: 'nexus-results',
  SESSION: 'nexus-session',
  DOMAINS: 'nexus-domains-db',
};

// Initial default domains
const DEFAULT_DOMAINS = [
  {
    id: 'full-stack',
    title: 'Full Stack Development',
    icon: 'Code2',
    color: '#6366f1',
    desc: 'Master frontend & backend engineering. Build complete, scalable web ecosystems from scratch.',
    stats: '150+ Enrolled',
    trending: true,
    topics: ['HTTP & HTTPS', 'Browser Internals', 'Internet Protocols', 'OSI Model'],
    subDomains: [
      { 
        id: 'fs-frontend', 
        title: 'Frontend Development', 
        icon: 'Palette', 
        color: '#ec4899', 
        desc: 'Craft beautiful, responsive user interfaces using React, Vue, and modern CSS architectures.', 
        stats: '85+ Enrolled',
        topics: ['HTTP/HTTPS', 'Browser Engines', 'DOM API', 'Rendering Pipeline']
      },
      { 
        id: 'fs-backend', 
        title: 'Backend Development', 
        icon: 'Server', 
        color: '#10b981', 
        desc: 'Architect scalable server-side logic, APIs, and microservices using Node.js, Go, or Python.', 
        stats: '70+ Enrolled',
        topics: ['REST/GraphQL', 'Auth Flow', 'Event Loop', 'Server Architecture']
      },
      { 
        id: 'fs-database', 
        title: 'Database', 
        icon: 'Database', 
        color: '#f59e0b', 
        desc: 'Design and optimize complex relational and NoSQL data structures for high-performance apps.', 
        stats: '65+ Enrolled',
        topics: ['ACID Properties', 'Indexing', 'Query Optimization', 'Internet Protocols']
      }
    ]
  },
  {
    id: 'ai-ml',
    title: 'Artificial Intelligence',
    icon: 'BrainCircuit',
    color: '#06b6d4',
    desc: 'Neural networks, machine learning models, and predictive analytics driving the future.',
    stats: '95+ Enrolled'
  },
  {
    id: 'cybersecurity',
    title: 'Cyber Security',
    icon: 'ShieldCheck',
    color: '#ef4444',
    desc: 'Deep-dive into ethical hacking, infrastructure protection, and digital forensic defense.',
    stats: '60+ Enrolled'
  },
  {
    id: 'data-science',
    title: 'Data Science',
    icon: 'Database',
    color: '#f59e0b',
    desc: 'Transform raw data into strategic intelligence using advanced statistical modeling.',
    stats: '85+ Enrolled'
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    icon: 'Palette',
    color: '#ec4899',
    desc: 'Design pixel-perfect, user-centric interfaces that blend aesthetics with functionality.',
    stats: '70+ Enrolled'
  },
  {
    id: 'cloud',
    title: 'Cloud Computing',
    icon: 'Cloud',
    color: '#3b82f6',
    desc: 'Architecting resilient, distributed systems on AWS, Azure, and Google Cloud Platform.',
    stats: '45+ Enrolled'
  }
];

const DEFAULT_ASSESSMENTS = [];

// ── Assessments ───────────────────────────────────────────────────────────────
export const getAssessments = () => {
  const stored = localStorage.getItem(KEYS.ASSESSMENTS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(DEFAULT_ASSESSMENTS));
  return DEFAULT_ASSESSMENTS;
};
export const saveAssessments = (data) => localStorage.setItem(KEYS.ASSESSMENTS, JSON.stringify(data));
export const addAssessment = (a) => { const all = getAssessments(); all.push({ ...a, id: `custom-${Date.now()}` }); saveAssessments(all); };
export const updateAssessment = (updated) => {
  const all = getAssessments();
  const idx = all.findIndex(a => a.id === updated.id);
  if (idx !== -1) {
    all[idx] = updated;
    saveAssessments(all);
  }
};

export const getResults = () => {
  const results = JSON.parse(localStorage.getItem(KEYS.RESULTS) || '[]');
  const assessments = getAssessments();
  const validIds = new Set(assessments.map(a => a.id));
  const validTopics = new Set(assessments.map(a => a.topic));

  // Auto-clean orphaned results that don't belong to any active assessment
  const filtered = results.filter(r => validIds.has(r.assessmentId) || validTopics.has(r.topic));
  if (filtered.length !== results.length) {
    localStorage.setItem(KEYS.RESULTS, JSON.stringify(filtered));
  }
  return filtered;
};

export const saveResult = (result) => {
  const all = getResults();
  const entry = { ...result, id: Date.now(), submittedAt: new Date().toISOString() };
  all.push(entry);
  localStorage.setItem(KEYS.RESULTS, JSON.stringify(all));
  updateUserResult(result.userEmail, entry);
  // Dispatch event for UI synchronization
  window.dispatchEvent(new Event('nexus-data-updated'));
};

export const deleteAssessment = (id) => {
  const allAssessments = getAssessments();
  const targetAssessment = allAssessments.find(a => a.id === id);
  const targetTopic = targetAssessment?.topic;

  // 1. Purge from Global Assessments
  const assessments = allAssessments.filter(a => a.id !== id);
  saveAssessments(assessments);

  // Re-fetch valid IDs/Topics after assessment deletion for consistent cleaning
  const validIds = new Set(assessments.map(a => a.id));
  const validTopics = new Set(assessments.map(a => a.topic));

  // 2. Cascade Purge from Global Results
  const allResults = getResults(); // Already cleans orphans based on the NEW assessment list
  const filteredResults = allResults.filter(r => 
    r.assessmentId !== id && (!targetTopic || r.topic !== targetTopic)
  );
  localStorage.setItem(KEYS.RESULTS, JSON.stringify(filteredResults));

  // 3. Deep Cleanse User Database
  const allUsers = getUsers();
  const updatedUsers = allUsers.map(u => ({
    ...u,
    results: (u.results || []).filter(r => 
      (validIds.has(r.assessmentId) || validTopics.has(r.topic)) && 
      r.assessmentId !== id && 
      (!targetTopic || r.topic !== targetTopic)
    )
  }));
  localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));

  // 4. Force Session Sync
  const session = localStorage.getItem(KEYS.SESSION);
  if (session) {
    try {
      const parsed = JSON.parse(session);
      const found = updatedUsers.find(u => u.email === parsed.email);
      if (found) {
        localStorage.setItem(KEYS.SESSION, JSON.stringify(found));
      }
    } catch (e) {
      console.error("Session sync failed", e);
    }
  }
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers = () => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
export const registerUser = (user) => {
  const users = getUsers();
  if (!users.find(u => u.email === user.email)) {
    users.push({ ...user, joinedAt: new Date().toISOString(), results: [] });
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }
};
export const updateUserResult = (email, result) => {
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx !== -1) { 
    users[idx].results = [...(users[idx].results || []), result]; 
    localStorage.setItem(KEYS.USERS, JSON.stringify(users)); 
  }
};

export const updateUserProfile = (email, updates) => {
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return users[idx];
  }
  return null;
};

export const deleteUser = (email) => {
  const users = getUsers().filter(u => u.email !== email);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const updateUserStatus = (email, status) => {
  const users = getUsers();
  const idx = users.findIndex(u => u.email === email);
  if (idx !== -1) {
    users[idx].status = status;
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }
};

// ── Discussions ───────────────────────────────────────────────────────────────
export const getDiscussions = () => JSON.parse(localStorage.getItem(KEYS.DISCUSSIONS) || '[]');
export const addDiscussion = (post) => {
  const all = getDiscussions();
  all.unshift({ ...post, id: Date.now(), createdAt: new Date().toISOString() });
  localStorage.setItem(KEYS.DISCUSSIONS, JSON.stringify(all));
};
export const deleteDiscussion = (id) => localStorage.setItem(KEYS.DISCUSSIONS, JSON.stringify(getDiscussions().filter(d => d.id !== id)));

// ── Notifications ─────────────────────────────────────────────────────────────
export const getNotifications = () => JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
export const addNotification = (notif) => {
  const all = getNotifications();
  all.unshift({ ...notif, id: Date.now(), createdAt: new Date().toISOString(), read: false });
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(all));
};
export const deleteNotification = (id) => localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(getNotifications().filter(n => n.id !== id)));
export const markNotificationRead = (id) => localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(getNotifications().map(n => n.id === id ? { ...n, read: true } : n)));

// ── Domains ───────────────────────────────────────────────────────────────────
export const getDomains = () => {
  const stored = localStorage.getItem(KEYS.DOMAINS);
  if (stored) {
    const parsed = JSON.parse(stored);
    // Simple migration: if the first domain is missing topics, it's probably stale.
    // We merge the default sub-domains topics into the existing ones.
    const merged = parsed.map(d => {
      const defaultMatch = DEFAULT_DOMAINS.find(def => def.id === d.id);
      if (defaultMatch) {
        let updatedDom = { ...d };
        if (defaultMatch.topics && (!d.topics || d.topics.length === 0)) {
          updatedDom.topics = defaultMatch.topics;
        }
        if (defaultMatch.subDomains && d.subDomains) {
          updatedDom.subDomains = d.subDomains.map(s => {
            const defSub = defaultMatch.subDomains.find(ds => ds.id === s.id);
            if (defSub && defSub.topics && (!s.topics || s.topics.length === 0)) {
              return { ...s, topics: defSub.topics };
            }
            return s;
          });
        }
        return updatedDom;
      }
      return d;
    });
    return merged;
    return merged;
  }
  localStorage.setItem(KEYS.DOMAINS, JSON.stringify(DEFAULT_DOMAINS));
  return DEFAULT_DOMAINS;
};
export const saveDomains = (data) => localStorage.setItem(KEYS.DOMAINS, JSON.stringify(data));
export const addDomain = (d) => {
  const all = getDomains();
  all.push({ ...d, id: `domain-${Date.now()}` });
  saveDomains(all);
};
export const updateDomain = (updated) => {
  const all = getDomains();
  const idx = all.findIndex(d => d.id === updated.id);
  if (idx !== -1) {
    all[idx] = updated;
    saveDomains(all);
  }
};
export const deleteDomain = (id) => saveDomains(getDomains().filter(d => d.id !== id));
