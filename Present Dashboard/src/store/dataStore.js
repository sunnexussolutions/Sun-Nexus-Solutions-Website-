import { query } from '../lib/neon';

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

const setLocal = (key, data) => {
  localStorage.setItem(`nexus_${key}`, JSON.stringify(data));
  window.dispatchEvent(new Event('nexus-data-updated'));
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
      setLocal('system_projects', mapped);
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
export const getAssessments = async () => {
  const local = getLocal('assessments');
  try {
    const cloud = await fetchApi('/api/assessments');
    if (cloud) {
      const mapped = cloud.map(a => ({
        ...a,
        timeLimit: a.time_limit,
        videoUrl: a.video_url,
        unlockTime: a.unlock_time,
        createdAt: a.created_at
      }));
      setLocal('assessments', mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("Using local assessments fallback", err);
  }
  return local;
};

export const addAssessment = async (a) => {
  const id = crypto.randomUUID();
  const newA = { ...a, id, created_at: new Date().toISOString() };
  
  // Optimistic Update
  setLocal('assessments', [...getLocal('assessments'), newA]);

  // Clean data for Neon
  const unlockTime = a.unlockTime && a.unlockTime.trim() !== "" ? a.unlockTime : null;
  const videoUrl = a.videoUrl && a.videoUrl.trim() !== "" ? a.videoUrl : null;

  await query(`
    INSERT INTO assessments (id, category, topic, week, time_limit, questions, video_url, unlock_time)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `, [id, a.category, a.topic, a.week, a.timeLimit, JSON.stringify(a.questions), videoUrl, unlockTime]);
  
  return newA;
};

export const updateAssessment = async (a) => {
  setLocal('assessments', getLocal('assessments').map(item => item.id === a.id ? { ...item, ...a } : item));
  
  const unlockTime = a.unlockTime && a.unlockTime.trim() !== "" ? a.unlockTime : null;
  const videoUrl = a.videoUrl && a.videoUrl.trim() !== "" ? a.videoUrl : null;

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
    const cloud = await fetchApi('/api/results');
    if (cloud) {
      const filtered = userId ? cloud.filter(r => r.user_id === userId) : cloud;
      const mapped = filtered.map(r => ({
        ...r,
        userId: r.user_id,
        userEmail: r.user_email,
        assessmentId: r.assessment_id,
        submittedAt: r.submitted_at
      }));
      setLocal('results', mapped);
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

  await query(`
    INSERT INTO results (id, user_id, assessment_id, topic, score, total, percentage, category, user_name, user_email)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
  `, [id, res.userId, res.assessmentId, res.topic, res.score, res.total, res.percentage, res.category, res.userName || 'Anonymous', res.userEmail]);
  return newRes;
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers = async () => {
  try {
    const cloud = await fetchApi('/api/users');
    if (cloud) {
      const mapped = cloud.map(u => ({
        ...u,
        name: u.name || `${u.first_name} ${u.last_name}`.trim() || u.username,
        firstName: u.first_name,
        lastName: u.last_name,
        isAdmin: u.is_admin,
        joinedAt: u.joined_at
      }));
      setLocal('users', mapped);
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
  setLocal('users', getLocal('users').map(u => u.id === id ? { ...u, status } : u));
  await query('UPDATE profiles SET status = $1 WHERE id = $2', [status, id]);
};

export const getDomains = async () => {
  const local = getLocal('domains');
  try {
    const cloud = await fetchApi('/api/domains');
    if (cloud) {
      const mapped = cloud.map(d => ({
        ...d,
        desc: d.description,
        subDomains: d.sub_domains,
        createdAt: d.created_at
      }));
      setLocal('domains', mapped);
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
      setLocal('notifications', cloud);
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
      setLocal('hiring_submissions', mapped);
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
      "https://res.cloudinary.com/dseg9nty3/image/upload/v1772689359/IMG20260214104936.jpg_qq8apz.jpg",
      "https://res.cloudinary.com/dseg9nty3/image/upload/v1772689999/WhatsApp_Image_2026-03-05_at_11.17.39_AM_ghi5gj.jpg",
      "https://res.cloudinary.com/dseg9nty3/image/upload/v1772689415/20260214_102511.jpg_vtdmdr.jpg"
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
      { id: "1", name: "Arjun Sharma", role: "Founder & CEO", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80", linkedin: "https://www.linkedin.com/company/sunnexussolutions/", twitter: "#", facebook: "#" },
      { id: "2", name: "Priya Patel", role: "CTO", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80", linkedin: "https://www.linkedin.com/company/sunnexussolutions/", twitter: "#", facebook: "#" },
      { id: "3", name: "Rohit Verma", role: "Head of Academics", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", linkedin: "https://www.linkedin.com/company/sunnexussolutions/", twitter: "#", facebook: "#" },
      { id: "4", name: "Sneha Iyer", role: "Community Lead", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80", linkedin: "https://www.linkedin.com/company/sunnexussolutions/", twitter: "#", facebook: "#" }
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
      setLocal('home_content', parsed);
      return parsed;
    }
  } catch (err) {
    console.warn("Using local home content fallback");
  }
  return local || DEFAULT_HOME_CONTENT;
};

export const saveHomeContent = async (content) => {
  setLocal('home_content', content);
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
