// Central data store — persists to localStorage
const KEYS = {
  ASSESSMENTS: 'nexus-assessments',
  USERS: 'nexus-users-db',
  DISCUSSIONS: 'nexus-discussions',
  NOTIFICATIONS: 'nexus-notifications',
  RESULTS: 'nexus-results',
  SESSION: 'nexus-session',
};

const DEFAULT_ASSESSMENTS = [
  {
    id: 'qa-fractions',
    category: 'Quantitative',
    topic: 'Fractions and Decimals',
    week: 'Week 1',
    timeLimit: 20,
    unlockTime: "2024-01-01T00:00:00.000Z",
    questions: [
      { id: 1, text: 'What is 3/4 + 1/8?', options: ['7/8', '4/12', '1/2', '5/8'], answer: 0, explanation: '3/4 = 6/8. So 6/8 + 1/8 = 7/8.' },
      { id: 2, text: 'Convert 0.625 to a fraction in simplest form.', options: ['5/8', '6/10', '3/5', '7/11'], answer: 0, explanation: '0.625 = 625/1000. Divide both by 125 → 5/8.' },
      { id: 3, text: 'What is 2/3 × 9/4?', options: ['3/2', '18/12', '2/1', '3/1'], answer: 0, explanation: '(2×9)/(3×4) = 18/12 = 3/2. Simplify by dividing by 6.' },
      { id: 4, text: 'Which is greater: 5/6 or 7/9?', options: ['5/6', '7/9', 'They are equal', 'Cannot determine'], answer: 0, explanation: 'LCM of 6 and 9 is 18. 5/6 = 15/18, 7/9 = 14/18. So 5/6 > 7/9.' },
      { id: 5, text: 'What is 1.75 as a fraction?', options: ['7/4', '3/2', '5/3', '9/5'], answer: 0, explanation: '1.75 = 175/100 = 7/4 after dividing numerator and denominator by 25.' },
    ],
  },
  {
    id: 'qa-simplification',
    category: 'Quantitative',
    topic: 'Simplification',
    week: 'Week 2',
    timeLimit: 20,
    unlockTime: "2024-01-01T00:00:00.000Z",
    questions: [
      { id: 1, text: 'Simplify: 144 ÷ 12 × 3 + 5', options: ['41', '36', '39', '44'], answer: 0, explanation: 'BODMAS: 144÷12=12, 12×3=36, 36+5=41.' },
      { id: 2, text: 'What is 25% of 480?', options: ['120', '100', '140', '110'], answer: 0, explanation: '25% = 1/4. 480 ÷ 4 = 120.' },
      { id: 3, text: 'Simplify: (18 + 6) ÷ 4 × 2', options: ['12', '6', '24', '8'], answer: 0, explanation: 'Brackets first: 18+6=24. Then 24÷4=6, 6×2=12.' },
      { id: 4, text: 'Find the value of √196', options: ['14', '13', '15', '16'], answer: 0, explanation: '14 × 14 = 196. So √196 = 14.' },
      { id: 5, text: '3³ + 4² = ?', options: ['43', '37', '49', '27'], answer: 0, explanation: '3³ = 27, 4² = 16. 27 + 16 = 43.' },
    ],
  },
  {
    id: 'lr-syllogisms',
    category: 'Logical Reasoning',
    topic: 'Syllogisms',
    week: 'Week 1',
    timeLimit: 20,
    unlockTime: "2024-01-01T00:00:00.000Z",
    questions: [
      { id: 1, text: 'All cats are animals. All animals have life. Conclusion: All cats have life?', options: ['True', 'False', 'Uncertain', 'Partially true'], answer: 0, explanation: 'Universal affirmative chain: All cats → animals → have life. Conclusion follows definitively.' },
      { id: 2, text: 'No pen is a book. Some books are copies. Conclusion: Some copies are not pens?', options: ['True', 'False', 'Uncertain', 'Cannot say'], answer: 0, explanation: 'Since no pen is a book, and some books are copies, those copies cannot be pens.' },
      { id: 3, text: 'All roses are flowers. Some flowers fade quickly. Conclusion: Some roses fade quickly?', options: ['Uncertain', 'True', 'False', 'Always true'], answer: 0, explanation: 'We only know some flowers fade — those may or may not be roses. Conclusion is uncertain.' },
      { id: 4, text: 'All birds can fly. Penguins are birds. Conclusion: Penguins can fly?', options: ['True by logic', 'False in reality', 'Uncertain', 'True'], answer: 0, explanation: 'In formal logic, if the premise says all birds fly and penguins are birds, the conclusion is logically true — even if false in reality.' },
      { id: 5, text: 'Some A are B. All B are C. Conclusion: Some A are C?', options: ['True', 'False', 'Uncertain', 'Partially'], answer: 0, explanation: 'The A that are B must also be C (since all B are C). So some A are definitely C.' },
    ],
  },
  {
    id: 'va-synonyms',
    category: 'Verbal Ability',
    topic: 'Synonyms & Antonyms',
    week: 'Week 1',
    timeLimit: 20,
    unlockTime: "2024-01-01T00:00:00.000Z",
    questions: [
      { id: 1, text: 'Synonym of BENEVOLENT:', options: ['Kind', 'Cruel', 'Angry', 'Lazy'], answer: 0, explanation: 'Benevolent means well-meaning and kindly. "Kind" is the closest synonym.' },
      { id: 2, text: 'Antonym of VERBOSE:', options: ['Concise', 'Wordy', 'Lengthy', 'Detailed'], answer: 0, explanation: 'Verbose means using more words than needed. Its antonym is "Concise" — brief and to the point.' },
      { id: 3, text: 'Synonym of EPHEMERAL:', options: ['Transient', 'Permanent', 'Eternal', 'Lasting'], answer: 0, explanation: 'Ephemeral means lasting for a very short time. "Transient" shares the same meaning.' },
      { id: 4, text: 'Antonym of DILIGENT:', options: ['Lazy', 'Hardworking', 'Careful', 'Sincere'], answer: 0, explanation: 'Diligent means hardworking and careful. Its antonym is "Lazy".' },
      { id: 5, text: 'Synonym of CANDID:', options: ['Frank', 'Deceptive', 'Shy', 'Reserved'], answer: 0, explanation: 'Candid means truthful and straightforward. "Frank" is its synonym.' },
    ],
  },
];

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
