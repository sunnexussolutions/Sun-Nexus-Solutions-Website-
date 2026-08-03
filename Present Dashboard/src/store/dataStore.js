import { query } from '../lib/neon';
import { getYearWeek, getWeekDiff } from '../contexts/AuthContext';

// Helper for local management
const getLocal = (key, fallback = []) => {
  const data = localStorage.getItem(`nexus_${key}`);
  if (!data || data === 'undefined' || data === 'null') return fallback;
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error(`Failed to parse nexus_${key} from localStorage:`, err);
    localStorage.removeItem(`nexus_${key}`);
    return fallback;
  }
};

const setLocal = (key, data, silent = false) => {
  localStorage.setItem(`nexus_${key}`, JSON.stringify(data));
  if (!silent) {
    window.dispatchEvent(new Event('nexus-data-updated'));
  }
};

const getBaseUrl = () => {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:';
  return isLocal ? 'http://localhost:3000' : '';
};

const fetchApi = async (endpoint, method = 'GET', body = null) => {
  const url = `${getBaseUrl()}${endpoint}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`API_ERROR: ${response.status}`);
  return await response.json();
};

// ── Projects (System-wide) ───────────────────────────────────────────────────
export const getProjects = async (userId) => {
  const local = getLocal('system_projects');
  try {
    const sql = userId ? 'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC' : 'SELECT * FROM projects ORDER BY created_at DESC';
    const params = userId ? [userId] : [];
    const cloud = await query(sql, params);
    if (cloud) {
      const mapped = cloud.map(p => ({
        ...p,
        desc: p.description,
        tech: typeof p.tech === 'string' ? JSON.parse(p.tech) : (p.tech || []),
        team: typeof p.team === 'string' ? JSON.parse(p.team) : (p.team || []),
        createdAt: p.created_at
      }));
      setLocal('system_projects', mapped, true);
      return mapped;
    }
  } catch (err) {
    console.warn("Using local projects fallback");
  }
  return local;
};

export const addProject = async (p) => {
  const id = crypto.randomUUID();
  const newP = { ...p, id, created_at: new Date().toISOString() };
  setLocal('system_projects', [...getLocal('system_projects'), newP]);

  await query(`
    INSERT INTO projects (id, title, description, status, tech, github, live, team, color, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `, [id, p.title, p.desc, p.status, JSON.stringify(p.tech || []), p.github, p.live, JSON.stringify(p.team || []), p.color, p.userId || null]);
  
  return newP;
};

export const updateProject = async (p) => {
  setLocal('system_projects', getLocal('system_projects').map(item => item.id === p.id ? { ...item, ...p } : item));
  await query(`
    UPDATE projects 
    SET title = $1, description = $2, status = $3, tech = $4, github = $5, live = $6, team = $7, color = $8, user_id = $9
    WHERE id = $10
  `, [p.title, p.desc, p.status, JSON.stringify(p.tech || []), p.github, p.live, JSON.stringify(p.team || []), p.color, p.userId || null, p.id]);
};

export const deleteProject = async (id) => {
  setLocal('system_projects', getLocal('system_projects').filter(p => p.id !== id));
  await query('DELETE FROM projects WHERE id = $1', [id]);
};

// ── Assessments ───────────────────────────────────────────────────────────────
export const DEFAULT_ASSESSMENTS = [
  {
    id: 'qa-1',
    category: 'Quantitative',
    topic: 'Fractions and Decimals',
    week: 'Week 1',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/watch?v=tnc9ojITRg4',
    questions: [
      { id: 1, question: 'What is 3/4 converted to a decimal?', options: ['0.5', '0.75', '0.8', '0.65'], answer: 1 },
      { id: 2, question: 'Which fraction is equivalent to 0.4?', options: ['2/5', '1/4', '3/8', '4/9'], answer: 0 },
      { id: 3, question: 'What is 0.125 as a simplified fraction?', options: ['1/6', '1/8', '1/4', '3/8'], answer: 1 },
      { id: 4, question: 'Calculate: 1.25 + 2.75', options: ['3.8', '4.0', '4.25', '3.95'], answer: 1 }
    ]
  },
  {
    id: 'qa-2',
    category: 'Quantitative',
    topic: 'Simplification',
    week: 'Week 1',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/watch?v=ZuMJFleXmiw',
    questions: [
      { id: 1, question: 'Evaluate: (12 + 18) ÷ 6 × 2', options: ['5', '10', '15', '20'], answer: 1 },
      { id: 2, question: 'What is 25% of 160?', options: ['30', '40', '50', '60'], answer: 1 },
      { id: 3, question: 'Simplify: 15 × 8 - 40 ÷ 5', options: ['112', '120', '116', '108'], answer: 0 }
    ]
  },
  {
    id: 'qa-3',
    category: 'Quantitative',
    topic: 'Surds and Indices',
    week: 'Week 2',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/watch?v=jAbpPTpz2bQ',
    questions: [
      { id: 1, question: 'What is 2^5 equal to?', options: ['16', '32', '64', '25'], answer: 1 },
      { id: 2, question: 'Simplify: √50', options: ['5√2', '2√5', '10√5', '5√10'], answer: 0 }
    ]
  },
  {
    id: 'qa-4',
    category: 'Quantitative',
    topic: 'Permutation & Combination',
    week: 'Week 2',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/watch?v=ETiRE7N7pEI',
    questions: [
      { id: 1, question: 'In how many ways can 4 people sit around a circular table?', options: ['24', '6', '12', '18'], answer: 1 },
      { id: 2, question: 'What is 5P2 (Permutations of 5 items taken 2 at a time)?', options: ['10', '20', '60', '120'], answer: 1 }
    ]
  },
  {
    id: 'lr-1',
    category: 'Logical Reasoning',
    topic: 'Puzzles (Mixed Logic)',
    week: 'Week 1',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/results?search_query=seating+arrangement+reasoning',
    questions: [
      { id: 1, question: 'Five people A, B, C, D, and E are sitting in a row facing North. A is to the immediate right of B, and E is to the immediate left of B. C is sitting at the right end. Who is sitting in the middle?', options: ['Person A', 'Person B', 'Person C', 'Person D'], answer: 1 },
      { id: 2, question: 'If RED is coded as 18-5-4, how is GREEN coded?', options: ['7-18-5-5-14', '7-17-4-4-13', '8-19-6-6-15', '7-18-6-6-14'], answer: 0 }
    ]
  },
  {
    id: 'lr-2',
    category: 'Logical Reasoning',
    topic: 'Syllogisms',
    week: 'Week 1',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/results?search_query=syllogisms+logical+reasoning',
    questions: [
      { id: 1, question: 'Statements: All cats are animals. All animals are mammals. Conclusion: All cats are mammals.', options: ['True', 'False', 'Cannot be determined', 'None of these'], answer: 0 },
      { id: 2, question: 'Statements: Some apples are red. All red things are sweet. Conclusion: Some apples are sweet.', options: ['Follows', 'Does not follow', 'Either follows or not', 'None of these'], answer: 0 }
    ]
  },
  {
    id: 'lr-3',
    category: 'Logical Reasoning',
    topic: 'Blood Relations',
    week: 'Week 2',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/results?search_query=blood+relations+logical+reasoning',
    questions: [
      { id: 1, question: 'Pointing to a man, a woman said, "His mother is the only daughter of my mother." How is the woman related to the man?', options: ['Sister', 'Mother', 'Aunt', 'Daughter'], answer: 1 }
    ]
  },
  {
    id: 'va-1',
    category: 'Verbal Ability',
    topic: 'Synonyms & Antonyms',
    week: 'Week 1',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/results?search_query=synonyms+antonyms+verbal+ability',
    questions: [
      { id: 1, question: 'Choose the synonym for "CANDID":', options: ['Frank', 'Secretive', 'Dishonest', 'Shy'], answer: 0 },
      { id: 2, question: 'Choose the antonym for "BENEVOLENT":', options: ['Kind', 'Malevolent', 'Generous', 'Friendly'], answer: 1 }
    ]
  },
  {
    id: 'va-2',
    category: 'Verbal Ability',
    topic: 'Sentence Correction',
    week: 'Week 1',
    timeLimit: 20,
    videoUrl: 'https://www.youtube.com/results?search_query=sentence+correction+verbal+ability',
    questions: [
      { id: 1, question: 'Identify the error: "Neither of the options were suitable."', options: ['Neither of', 'the options', 'were suitable', 'No error'], answer: 2 }
    ]
  }
];

export const getAssessments = async () => {
  const local = getLocal('assessments');
  try {
    const cloud = await query('SELECT * FROM assessments ORDER BY created_at DESC');
    if (cloud && cloud.length > 0) {
      const mapped = cloud.map(a => ({
        ...a,
        questions: typeof a.questions === 'string' ? JSON.parse(a.questions) : (a.questions || []),
        timeLimit: a.time_limit,
        videoUrl: a.video_url,
        unlockTime: a.unlock_time,
        createdAt: a.created_at
      }));
      setLocal('assessments', mapped, true);
      return mapped;
    }
  } catch (err) {
    console.warn("Using local assessments fallback", err);
  }
  return local || [];
};

export const addAssessment = async (a) => {
  const id = crypto.randomUUID();
  const unlockTime = a.unlockTime 
    ? (typeof a.unlockTime === 'string' ? (a.unlockTime.trim() || null) : new Date(a.unlockTime).toISOString()) 
    : null;
  const videoUrl = a.videoUrl && typeof a.videoUrl === 'string' ? (a.videoUrl.trim() || null) : null;

  const newA = { 
    ...a, 
    id, 
    unlockTime, 
    videoUrl, 
    created_at: new Date().toISOString() 
  };
  
  // Optimistic Update
  setLocal('assessments', [...getLocal('assessments'), newA]);

  await query(`
    INSERT INTO assessments (id, category, topic, week, time_limit, questions, video_url, unlock_time)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [id, a.category, a.topic, a.week, a.timeLimit, JSON.stringify(a.questions), videoUrl, unlockTime]);
  
  return newA;
};

export const updateAssessment = async (a) => {
  const unlockTime = a.unlockTime 
    ? (typeof a.unlockTime === 'string' ? (a.unlockTime.trim() || null) : new Date(a.unlockTime).toISOString()) 
    : null;
  const videoUrl = a.videoUrl && typeof a.videoUrl === 'string' ? (a.videoUrl.trim() || null) : null;

  const updatedA = { ...a, unlockTime, videoUrl };

  setLocal('assessments', getLocal('assessments').map(item => item.id === a.id ? { ...item, ...updatedA } : item));

  await query(`
    UPDATE assessments 
    SET category = $1, topic = $2, week = $3, time_limit = $4, questions = $5, video_url = $6, unlock_time = $7 
    WHERE id = $8
  `, [a.category, a.topic, a.week, a.timeLimit, JSON.stringify(a.questions), videoUrl, unlockTime, a.id]);
};

export const deleteAssessment = async (id) => {
  setLocal('assessments', getLocal('assessments').filter(a => a.id !== id));
  await query('DELETE FROM assessments WHERE id = $1', [id]);
};

// ── Results ───────────────────────────────────────────────────────────────────
export const getResults = async (userId) => {
  const local = getLocal('results');
  try {
    const sql = userId ? 'SELECT * FROM results WHERE user_id = $1 ORDER BY submitted_at DESC' : 'SELECT * FROM results ORDER BY submitted_at DESC';
    const params = userId ? [userId] : [];
    const cloud = await query(sql, params);
    if (cloud) {
      const mapped = cloud.map(r => ({
        ...r,
        userId: r.user_id,
        userEmail: r.user_email,
        assessmentId: r.assessment_id,
        submittedAt: r.submitted_at,
        proctorVideo: r.proctor_video || r.proctorVideo || null,
        answers: typeof r.answers === 'string' ? JSON.parse(r.answers) : (r.answers || {})
      }));
      setLocal('results', mapped, true);
      return mapped;
    }
  } catch (err) {
    console.warn("Using local results fallback", err);
  }
  return local;
};

export const saveResult = async (res) => {
  const id = crypto.randomUUID();
  const newRes = { ...res, id, submittedAt: new Date().toISOString() };
  setLocal('results', [...getLocal('results'), newRes]);

  try {
    await query(`
      INSERT INTO results (id, user_id, assessment_id, topic, score, total, percentage, category, user_name, user_email, answers, proctor_video)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `, [id, res.userId, res.assessmentId, res.topic, res.score, res.total, res.percentage, res.category, res.userName || 'Anonymous', res.userEmail, JSON.stringify(res.answers || {}), res.proctorVideo || null]);
  } catch (err) {
    console.warn("Cloud save result fallback:", err.message);
  }

  // Weekly streak update when taking an aptitude test: +1 per week, -1 per missed week
  try {
    const rawUser = localStorage.getItem('nexus_user');
    if (rawUser) {
      const u = JSON.parse(rawUser);
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const currentWeek = getYearWeek(now);
      const lastActiveWeek = u.lastActiveWeek || u.last_active_week || (u.lastActiveDate ? getYearWeek(new Date(u.lastActiveDate)) : null);

      let currentStreak = Number(u.streak) || 0;
      let newStreak = currentStreak;

      if (!lastActiveWeek) {
        newStreak = 1;
      } else {
        const diff = getWeekDiff(lastActiveWeek, currentWeek);
        if (diff === 0) {
          newStreak = currentStreak > 0 ? currentStreak : 1;
        } else if (diff === 1) {
          newStreak = (currentStreak > 0 ? currentStreak : 0) + 1;
        } else if (diff > 1) {
          const missedWeeks = diff - 1;
          const streakAfterLoss = Math.max(0, currentStreak - missedWeeks);
          newStreak = streakAfterLoss + 1;
        }
      }

      const updatedUser = {
        ...u,
        streak: newStreak,
        lastActiveDate: todayStr,
        last_active_date: todayStr,
        lastActiveWeek: currentWeek,
        last_active_week: currentWeek
      };

      localStorage.setItem('nexus_user', JSON.stringify(updatedUser));

      // Update in local users array
      const localUsers = getLocal('users');
      const updatedLocalUsers = localUsers.map(usr => 
        (usr.id === u.id || usr.email === u.email) 
          ? { ...usr, streak: newStreak, lastActiveDate: todayStr, lastActiveWeek: currentWeek } 
          : usr
      );
      setLocal('users', updatedLocalUsers, true);

      // Async cloud sync
      if (u.id || u.email) {
        query(`
          UPDATE profiles 
          SET streak = $1, last_active_date = $2, last_active_week = $3
          WHERE id = $4 OR LOWER(email) = $5
        `, [newStreak, todayStr, currentWeek, u.id || '', (u.email || '').toLowerCase()]).catch(e => console.warn("Cloud streak update fallback:", e.message));
      }

      window.dispatchEvent(new Event('nexus-data-updated'));
    }
  } catch (err) {
    console.warn("Weekly streak update on test submission error:", err);
  }

  return newRes;
};

export const deleteResult = async (id) => {
  setLocal('results', getLocal('results').filter(r => r.id !== id));
  await query('DELETE FROM results WHERE id = $1', [id]);
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers = async () => {
  try {
    const cloud = await query('SELECT * FROM profiles ORDER BY joined_at DESC');
    if (cloud) {
      const mapped = cloud.map(u => ({
        ...u,
        name: u.name || `${u.first_name} ${u.last_name}`.trim() || u.username,
        firstName: u.first_name,
        lastName: u.last_name,
        isAdmin: u.is_admin,
        joinedAt: u.joined_at
      }));
      setLocal('users', mapped, true);
      return mapped;
    }
  } catch (err) {
    console.warn("Using local users fallback", err);
  }
  return getLocal('users');
};

export const deleteUser = async (id) => {
  setLocal('users', getLocal('users').filter(u => u.id !== id));
  await query('DELETE FROM profiles WHERE id = $1', [id]);
};

export const updateUserStatus = async (id, status) => {
  // Update nexus_users (admin list)
  setLocal('users', getLocal('users').map(u => u.id === id ? { ...u, status } : u));

  // Update nexus_users fallback list used by PendingApproval
  try {
    const localUsers = JSON.parse(localStorage.getItem('nexus_users') || '[]');
    localStorage.setItem('nexus_users', JSON.stringify(localUsers.map(u => u.id === id ? { ...u, status } : u)));
  } catch (e) {}

  // Update active session so App.jsx re-renders immediately
  try {
    const sessionRaw = localStorage.getItem('nexus_user');
    if (sessionRaw) {
      const session = JSON.parse(sessionRaw);
      if (session && session.id === id) {
        localStorage.setItem('nexus_user', JSON.stringify({ ...session, status }));
      }
    }
  } catch (e) {}

  window.dispatchEvent(new Event('nexus-data-updated'));

  try {
    await query('UPDATE profiles SET status = $1 WHERE id = $2', [status, id]);
    if (status === 'active') {
      await addNotification({
        user_id: id,
        title: 'Account Approved',
        message: 'Admin approved member. Welcome to Nexus hub',
        type: 'success'
      });
    }
  } catch (e) {
    console.warn('Cloud status sync failed, saved locally:', e.message);
  }
};

export const getDomains = async () => {
  const local = getLocal('domains');
  try {
    const cloud = await query('SELECT * FROM domains ORDER BY created_at DESC');
    if (cloud) {
      const mapped = cloud.map(d => ({
        ...d,
        desc: d.description,
        subDomains: typeof d.sub_domains === 'string' ? JSON.parse(d.sub_domains) : (d.sub_domains || []),
        topics: typeof d.topics === 'string' ? JSON.parse(d.topics) : (d.topics || []),
        createdAt: d.created_at
      }));
      setLocal('domains', mapped, true);
      return mapped;
    }
  } catch (err) {
    console.warn("Using local domains fallback", err);
  }
  return local;
};

export const addDomain = async (d) => {
  if (!d.title.trim()) return alert("Domain Title is required.");
  if (!d.desc.trim()) return alert("Domain Description is required.");
  const id = crypto.randomUUID();
  const newD = { ...d, id, created_at: new Date().toISOString() };
  setLocal('domains', [...getLocal('domains'), newD]);

  await query(`
    INSERT INTO domains (id, title, icon, color, description, stats, trending, sub_domains, topics)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
  `, [id, d.title, d.icon, d.color, d.desc, d.stats, d.trending, JSON.stringify(d.subDomains || []), JSON.stringify(d.topics || [])]);
  
  return newD;
};

export const updateDomain = async (d) => {
  setLocal('domains', getLocal('domains').map(item => item.id === d.id ? { ...item, ...d } : item));
  
  await query(`
    UPDATE domains 
    SET title = $1, icon = $2, color = $3, description = $4, stats = $5, trending = $6, sub_domains = $7, topics = $8 
    WHERE id = $9
  `, [d.title, d.icon, d.color, d.desc, d.stats, d.trending, JSON.stringify(d.subDomains || []), JSON.stringify(d.topics || []), d.id]);
};

export const deleteDomain = async (id) => {
  setLocal('domains', getLocal('domains').filter(d => d.id !== id));
  await query('DELETE FROM domains WHERE id = $1', [id]);
};

// ── Notifications ──────────────────────────────────────────────────────────────
export const getNotifications = async (userId) => {
  const local = getLocal('notifications');
  try {
    // Fetch both personal AND global broadcasts
    const sql = userId 
      ? 'SELECT * FROM notifications WHERE user_id = $1 OR user_id IS NULL ORDER BY created_at DESC'
      : 'SELECT * FROM notifications WHERE user_id IS NULL ORDER BY created_at DESC';
    const params = userId ? [userId] : [];
    
    const cloud = await query(sql, params);
    if (cloud) {
      setLocal('notifications', cloud, true);
      return cloud;
    }
  } catch (err) {
    console.warn("Using local notifications fallback");
  }
  return local;
};

export const addNotification = async (n) => {
  const id = crypto.randomUUID();
  const newN = { ...n, id, created_at: new Date().toISOString() };
  setLocal('notifications', [...getLocal('notifications'), newN]);
  
  await query(`
    INSERT INTO notifications (id, user_id, title, message, type)
    VALUES ($1, $2, $3, $4, $5)
  `, [id, n.user_id || null, n.title, n.message, n.type]);
  return newN;
};

export const markNotificationRead = async (id) => {
  setLocal('notifications', getLocal('notifications').map(n => n.id === id ? { ...n, read: true } : n));
  await query('UPDATE notifications SET read = TRUE WHERE id = $1', [id]);
};

export const deleteNotification = async (id) => {
  setLocal('notifications', getLocal('notifications').filter(n => n.id !== id));
  await query('DELETE FROM notifications WHERE id = $1', [id]);
};

// ── Discussions ────────────────────────────────────────────────────────────────
export const getDiscussions = async () => getLocal('discussions');
export const addDiscussion = async (d) => {
  const newD = { ...d, id: crypto.randomUUID(), created_at: new Date().toISOString() };
  setLocal('discussions', [...getLocal('discussions'), newD]);
  return newD;
};
export const deleteDiscussion = async (id) => {
  setLocal('discussions', getLocal('discussions').filter(d => d.id !== id));
};

// ── Hiring Submissions (Registration) ────────────────────────────────────────
export const getHiringSubmissions = async () => {
  console.log("📂 INITIATING_DIRECT_SYNC: Hiring Submissions...");
  try {
    const cloud = await query('SELECT * FROM contact_inquiries ORDER BY created_at DESC');
    console.log("📊 RAW_CLOUD_SYNC_RESULT:", cloud);
    
    if (cloud && Array.isArray(cloud)) {
      const mapped = cloud.map(s => ({
        ...s,
        mobile: s.mobile || s.mobile_number || s.phone || 'N/A',
        prn: s.prn || s.prn_number || 'N/A',
        division: s.division || s.div || 'N/A',
        academicYear: s.academic_year || s.academicYear || 'N/A',
        graduationYear: s.graduation_year || s.graduationYear || 'N/A',
        createdAt: s.created_at || s.createdAt || new Date().toISOString()
      }));
      console.log("✅ SYNC_COMPLETE:", mapped.length, "candidates mapped.");
      setLocal('hiring_submissions', mapped, true);
      return mapped;
    }
    console.warn("⚠️ SYNC_WARNING: Cloud response was empty or invalid structure.");
  } catch (err) {
    console.error("❌ SYNC_CRITICAL_FAILURE:", err.message);
  }
  return getLocal('hiring_submissions');
};

export const deleteHiringSubmission = async (id) => {
  setLocal('hiring_submissions', getLocal('hiring_submissions').filter(s => s.id !== id));
  await query('DELETE FROM contact_inquiries WHERE id = $1', [id]);
};

export const updateHiringSubmission = async (id, updates) => {
  const current = getLocal('hiring_submissions');
  const updated = current.map(s => s.id === id ? { ...s, ...updates } : s);
  setLocal('hiring_submissions', updated);
  try {
    if (updates.status) {
      await query('UPDATE contact_inquiries SET status = $1 WHERE id = $2', [updates.status, id]);
    }
  } catch (err) {
    console.warn("⚠️ Cloud status update fallback to local:", err.message);
  }
};

// ── Home Page Content Management ──────────────────────────────────────────────
export const DEFAULT_HOME_CONTENT = {
  hero: {
    titleMain: "Sun Nexus",
    titleGradient: "Solutions",
    subtitle: "Sun Nexus Solutions Club — Where innovation meets heart",
    description: "Empowering students with real-world tech skills, projects, and mentorship at Sandip University, Nashik.",
    exploreBtnText: "Explore More",
    exploreBtnLink: "project.html",
    joinBtnText: "Join Our Community",
    joinBtnLink: "contact.html",
    badge1Number: "10K+",
    badge1Label: "Active Students",
    badge2Number: "200+",
    badge2Label: "Expert Mentors",
    image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772689390/IMG20260214121123_01.jpg_rvmrw2.jpg",
    carouselImages: [
      "https://res.cloudinary.com/dseg9nty3/image/upload/v1772689390/IMG20260214121123_01.jpg_rvmrw2.jpg",
      "https://res.cloudinary.com/dseg9nty3/image/upload/v1772858446/IMG_20250917_161033_rkvech.jpg"
    ]
  },
  stats: [
    { icon: "fa-globe", value: "50+", label: "Domains", color: "blue" },
    { icon: "fa-code", value: "1K+", label: "Projects Published", color: "cyan" },
    { icon: "fa-calendar-check", value: "100+", label: "Events Organized", color: "blue" },
    { icon: "fa-infinity", value: "∞", label: "Possibilities", color: "purple" }
  ],
  values: {
    title: "Driving Innovation. Building Futures.",
    subtitle: "We are a community of innovators, problem-solvers, and creators.",
    items: [
      { icon: "fa-regular fa-lightbulb", title: "Innovation", desc: "We embrace creativity and new ideas.", color: "cyan" },
      { icon: "fa-solid fa-shield-halved", title: "Integrity", desc: "We do all work through transparency.", color: "purple" },
      { icon: "fa-solid fa-award", title: "Excellence", desc: "We strive for the highest standards.", color: "blue" },
      { icon: "fa-solid fa-hand-holding-heart", title: "Empathy", desc: "We care for our community and grow together.", color: "pink" }
    ]
  },
  leadership: {
    title: "Leadership Team",
    members: [
      { id: "1", name: "B.Murali Krishna", role: "Founder & CEO", image: "https://ik.imagekit.io/kofq4cdghu/WhatsApp%20Image%202025-10-10%20at%2010.37.00%20AM.jpeg?updatedAt=1760072973049", linkedin: "https://www.linkedin.com/company/sunnexussolutions/", twitter: "#", facebook: "#" },
      { id: "2", name: "B.Charitha Reddy", role: "President", image: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772469092/charitha_akka_grzcgc.jpg", linkedin: "https://www.linkedin.com/company/sunnexussolutions/", twitter: "#", facebook: "#" },
      { id: "3", name: "C.Mallikarjuna Rao", role: "Vice President", image: "https://ik.imagekit.io/kofq4cdghu/IMG_20241008_135227_1_.jpg?updatedAt=1759896755572", linkedin: "https://www.linkedin.com/company/sunnexussolutions/", twitter: "#", facebook: "#" }
    ]
  },
  logbook: {
    title: "Log Book",
    description: "Track your startup journey with our comprehensive Log Book system. Manage projects, monitor progress, and collaborate with your team in real-time.",
    btnText: "Access Log Book",
    btnLink: "https://startup-management-system-backend-u.vercel.app/"
  },
  whyNexus: {
    title: "Why Nexus Solutions?",
    subtext: "At Nexus Solutions, we are more than just a tech club — we are a driven community of innovators, problem-solvers, and creators."
  }
};

export const getHomeContent = async () => {
  const local = getLocal('home_content', null);
  try {
    const cloud = await query("SELECT data FROM site_content WHERE key = 'home_content' LIMIT 1");
    if (cloud && cloud.length > 0) {
      const parsed = JSON.parse(cloud[0].data);
      setLocal('home_content', parsed, true);
      localStorage.setItem('nexus_home_content', JSON.stringify(parsed));
      return parsed;
    }
  } catch (err) {
    console.warn("Using local home content fallback");
  }
  return local || DEFAULT_HOME_CONTENT;
};

export const saveHomeContent = async (content) => {
  setLocal('home_content', content);
  localStorage.setItem('nexus_home_content', JSON.stringify(content));
  window.dispatchEvent(new Event('nexus-data-updated'));
  window.dispatchEvent(new StorageEvent('storage', { key: 'nexus_home_content', newValue: JSON.stringify(content) }));
  try {
    await query(`
      INSERT INTO site_content (key, data, updated_at)
      VALUES ('home_content', $1, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at
    `, [JSON.stringify(content)]);
  } catch (err) {
    console.error("Failed to save home content to cloud:", err);
  }
};

export const DEFAULT_DSA_TOPICS = [
  {
    id: 'arrays-hashing',
    name: 'Arrays & Hashing',
    color: '#7b5cff',
    icon: 'Hash',
    order: 1
  }
];

export const DEFAULT_DSA_PROBLEMS = [
  {
    id: 'two-sum',
    topicId: 'arrays-hashing',
    title: 'Two Sum',
    number: 1,
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].' }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    hints: [
      'A really brute force way would be to search for all possible pairs of numbers but that would be too slow.',
      'So, if we fix one of the numbers, say x, we have to scan the entire array to find target - x. Can we change an array search to a constant time lookup?',
      'Use a hash map to store the value and its index as we iterate.'
    ],
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    tutorial: '### Approach: Hash Map (One-pass)\n\nWhile we iterate and insert elements into the hash map, we also look back to check if the current element complement (target - nums[i]) already exists in the hash map.\n\n```python\ndef twoSum(nums, target):\n    prevMap = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in prevMap:\n            return [prevMap[diff], i]\n        prevMap[n] = i\n```',
    videoUrl: 'https://www.youtube.com/watch?v=KLlXCFG5TnA',
    order: 1
  }
];


export const getDSATopics = async () => {
  const local = getLocal('dsa_topics', null);
  try {
    const cloud = await query('SELECT * FROM dsa_topics ORDER BY "order" ASC');
    if (cloud && cloud.length > 0) {
      const mapped = cloud.map(t => ({
        ...t,
        roadmapUrl: t.roadmap_url,
        roadmapContent: t.roadmap_content,
        createdAt: t.created_at
      }));
      setLocal('dsa_topics', mapped, true);
      return mapped;
    }
  } catch (err) { console.warn('Using local DSA topics fallback'); }
  return local || DEFAULT_DSA_TOPICS;
};

export const addDSATopic = async (t) => {
  const id = t.id || crypto.randomUUID();
  const existing = getLocal('dsa_topics', []);
  const maxOrder = existing.length > 0 ? Math.max(...existing.map(x => x.order || 0)) : 0;
  const newT = { ...t, id, order: t.order || maxOrder + 1 };
  setLocal('dsa_topics', [...existing, newT]);
  try {
    await query(
      'INSERT INTO dsa_topics (id, name, color, icon, "order", roadmap_url, roadmap_content) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO UPDATE SET name=$2,color=$3,icon=$4,"order"=$5,roadmap_url=$6,roadmap_content=$7',
      [id, t.name, t.color, t.icon, newT.order, t.roadmapUrl || null, t.roadmapContent || null]
    );
  } catch (err) { console.warn('Cloud DSA topic add fallback:', err.message); }
  return newT;
};

export const updateDSATopic = async (t) => {
  setLocal('dsa_topics', getLocal('dsa_topics', []).map(item => item.id === t.id ? { ...item, ...t } : item));
  try {
    await query('UPDATE dsa_topics SET name=$1,color=$2,icon=$3,"order"=$4,roadmap_url=$5,roadmap_content=$6 WHERE id=$7', [t.name, t.color, t.icon, t.order, t.roadmapUrl || null, t.roadmapContent || null, t.id]);
  } catch (err) { console.warn('Cloud DSA topic update fallback:', err.message); }
};

export const deleteDSATopic = async (id) => {
  setLocal('dsa_topics', getLocal('dsa_topics', []).filter(t => t.id !== id));
  setLocal('dsa_problems', getLocal('dsa_problems', []).filter(p => p.topicId !== id));
  try {
    await query('DELETE FROM dsa_problems WHERE topic_id=$1', [id]);
    await query('DELETE FROM dsa_topics WHERE id=$1', [id]);
  } catch (err) { console.warn('Cloud DSA topic delete fallback:', err.message); }
};

export const getDSAProblems = async (topicId) => {
  const local = getLocal('dsa_problems', null);
  try {
    const sql = topicId
      ? 'SELECT * FROM dsa_problems WHERE topic_id=$1 ORDER BY "order" ASC'
      : 'SELECT * FROM dsa_problems ORDER BY "order" ASC';
    const cloud = await query(sql, topicId ? [topicId] : []);
    if (cloud && cloud.length > 0) {
      const mapped = cloud.map(p => ({
        ...p,
        topicId:       p.topic_id,
        examples:      typeof p.examples    === 'string' ? JSON.parse(p.examples)    : (p.examples    || []),
        constraints:   typeof p.constraints === 'string' ? JSON.parse(p.constraints) : (p.constraints || []),
        hints:         typeof p.hints       === 'string' ? JSON.parse(p.hints)       : (p.hints       || []),
        tags:          typeof p.tags        === 'string' ? JSON.parse(p.tags)        : (p.tags        || []),
        timeComplexity:  p.time_complexity,
        spaceComplexity: p.space_complexity,
        videoUrl:        p.video_url,
        createdAt:       p.created_at,
      }));
      if (!topicId) setLocal('dsa_problems', mapped, true);
      return mapped;
    }
  } catch (err) { console.warn('Using local DSA problems fallback'); }
  const all = local || DEFAULT_DSA_PROBLEMS;
  return topicId ? all.filter(p => p.topicId === topicId) : all;
};

export const addDSAProblem = async (p) => {
  const id = crypto.randomUUID();
  const existing = getLocal('dsa_problems', []);
  const topicProbs = existing.filter(x => x.topicId === p.topicId);
  const maxOrder = topicProbs.length > 0 ? Math.max(...topicProbs.map(x => x.order || 0)) : 0;
  const newP = { ...p, id, order: p.order || maxOrder + 1 };
  setLocal('dsa_problems', [...existing, newP]);
  try {
    await query(
      `INSERT INTO dsa_problems (id,topic_id,title,number,difficulty,tags,description,examples,constraints,hints,time_complexity,space_complexity,tutorial,video_url,"order")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [id, p.topicId, p.title, p.number, p.difficulty,
       JSON.stringify(p.tags||[]), p.description,
       JSON.stringify(p.examples||[]), JSON.stringify(p.constraints||[]),
       JSON.stringify(p.hints||[]), p.timeComplexity, p.spaceComplexity,
       p.tutorial, p.videoUrl||null, newP.order]
    );
  } catch (err) { console.warn('Cloud DSA problem add fallback:', err.message); }
  return newP;
};

export const updateDSAProblem = async (p) => {
  setLocal('dsa_problems', getLocal('dsa_problems', []).map(item => item.id === p.id ? { ...item, ...p } : item));
  try {
    await query(
      `UPDATE dsa_problems SET topic_id=$1,title=$2,number=$3,difficulty=$4,tags=$5,description=$6,examples=$7,constraints=$8,hints=$9,time_complexity=$10,space_complexity=$11,tutorial=$12,video_url=$13,"order"=$14 WHERE id=$15`,
      [p.topicId, p.title, p.number, p.difficulty,
       JSON.stringify(p.tags||[]), p.description,
       JSON.stringify(p.examples||[]), JSON.stringify(p.constraints||[]),
       JSON.stringify(p.hints||[]), p.timeComplexity, p.spaceComplexity,
       p.tutorial, p.videoUrl||null, p.order, p.id]
    );
  } catch (err) { console.warn('Cloud DSA problem update fallback:', err.message); }
};

export const deleteDSAProblem = async (id) => {
  setLocal('dsa_problems', getLocal('dsa_problems', []).filter(p => p.id !== id));
  try { await query('DELETE FROM dsa_problems WHERE id=$1', [id]); }
  catch (err) { console.warn('Cloud DSA problem delete fallback:', err.message); }
};

// ── DSA Solution Submissions (Member → Admin) — DB-backed ────────────────────

export const getDSASolutions = async () => {
  try {
    const cloud = await query('SELECT * FROM dsa_solutions ORDER BY submitted_at DESC');
    if (cloud && cloud.length >= 0) {
      const mapped = cloud.map(s => ({
        id:           s.id,
        memberId:     s.member_id,
        memberName:   s.member_name,
        memberEmail:  s.member_email,
        problemId:    s.problem_id,
        problemTitle: s.problem_title,
        difficulty:   s.difficulty,
        topicName:    s.topic_name,
        imageData:    s.image_data,
        notes:        s.notes,
        description:  s.description,
        status:       s.status,
        adminNote:    s.admin_note,
        submittedAt:  s.submitted_at,
        reviewedAt:   s.reviewed_at,
        updatedAt:    s.updated_at,
      }));
      setLocal('dsa_solutions', mapped, true);
      return mapped;
    }
  } catch (err) { console.warn('DSA solutions DB fallback:', err.message); }
  return getLocal('dsa_solutions', []);
};

export const addDSASolution = async (submission) => {
  const id = crypto.randomUUID();
  const newEntry = {
    id,
    ...submission,
    status: 'pending',
    adminNote: '',
    submittedAt: new Date().toISOString(),
  };
  // Optimistic local update
  const existing = getLocal('dsa_solutions', []);
  setLocal('dsa_solutions', [newEntry, ...existing]);
  try {
    await query(
      `INSERT INTO dsa_solutions
        (id, member_id, member_name, member_email, problem_id, problem_title, difficulty, topic_name, image_data, notes, description, status, admin_note)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending','')`,
      [id, submission.memberId, submission.memberName, submission.memberEmail,
       submission.problemId, submission.problemTitle, submission.difficulty,
       submission.topicName, submission.imageData || null,
       submission.notes || null, submission.description || submission.notes || null]
    );
  } catch (err) { console.warn('DSA solution add DB fallback:', err.message); }
  return newEntry;
};

export const updateDSASolutionStatus = async (id, status, adminNote = '') => {
  // Optimistic local update
  const updated = getLocal('dsa_solutions', []).map(s =>
    s.id === id ? { ...s, status, adminNote, reviewedAt: new Date().toISOString() } : s
  );
  setLocal('dsa_solutions', updated);
  try {
    await query(
      `UPDATE dsa_solutions SET status=$1, admin_note=$2, reviewed_at=NOW() WHERE id=$3`,
      [status, adminNote, id]
    );
  } catch (err) { console.warn('DSA solution status update DB fallback:', err.message); }
};

export const updateDSASolution = async (id, updates) => {
  // Optimistic local update
  const updated = getLocal('dsa_solutions', []).map(s =>
    s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s
  );
  setLocal('dsa_solutions', updated);
  const result = updated.find(s => s.id === id);
  try {
    await query(
      `UPDATE dsa_solutions SET image_data=$1, notes=$2, description=$3, status=$4, updated_at=NOW() WHERE id=$5`,
      [updates.imageData ?? result?.imageData, updates.notes ?? result?.notes,
       updates.description ?? updates.notes ?? result?.description,
       updates.status ?? result?.status, id]
    );
  } catch (err) { console.warn('DSA solution update DB fallback:', err.message); }
  return result;
};

export const deleteDSASolution = async (id) => {
  const all = getLocal('dsa_solutions', []);
  const target = all.find(s => s.id === id);
  // Record penalty for streak calculation
  if (target) {
    const keys = [target.memberId, target.memberEmail].filter(Boolean);
    keys.forEach(k => {
      try {
        const penKey = `nexus_dsa_deleted_penalty_${k}`;
        const currentPen = Number(localStorage.getItem(penKey) || 0);
        localStorage.setItem(penKey, String(currentPen + 1));
      } catch (e) {}
    });
  }
  setLocal('dsa_solutions', all.filter(s => s.id !== id));
  try {
    await query('DELETE FROM dsa_solutions WHERE id=$1', [id]);
  } catch (err) { console.warn('DSA solution delete DB fallback:', err.message); }
};


