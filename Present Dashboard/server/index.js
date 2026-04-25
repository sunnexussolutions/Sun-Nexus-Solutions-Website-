require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || 'nexus_secret';

app.use(cors());
app.use(express.json());

// ── DB Pool ───────────────────────────────────────────────────────────────────
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

// Test connection on startup
pool.getConnection()
  .then(conn => { console.log('✅ MySQL connected'); conn.release(); })
  .catch(err => console.error('❌ MySQL connection failed:', err.message));

// ── Auth middleware ───────────────────────────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (!req.user.isAdmin) return res.status(403).json({ error: 'Admin only' });
    next();
  });
};

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: 'Nexus API running' }));

// ══════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields required' });
  try {
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );
    const token = jwt.sign({ id: result.insertId, email, name, isAdmin: false }, SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: result.insertId, name, email, isAdmin: false, level: 'Beginner', xp: 0, streak: 0 } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin }, SECRET, { expiresIn: '7d' });
    const { password: _, ...safeUser } = user;
    res.json({ success: true, token, user: safeUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id,name,email,avatar,level,isAdmin,xp,streak,joinedAt FROM users WHERE id = ?', [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// USERS ROUTES (admin)
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/users', adminAuth, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id,name,email,avatar,level,isAdmin,xp,streak,joinedAt FROM users');
    // attach result count per user
    const [results] = await pool.query('SELECT userEmail, COUNT(*) as count FROM results GROUP BY userEmail');
    const countMap = Object.fromEntries(results.map(r => [r.userEmail, r.count]));
    const enriched = users.map(u => ({ ...u, resultsCount: countMap[u.email] || 0 }));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id,name,email,avatar,level,isAdmin,xp,streak,joinedAt FROM users WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    const user = rows[0];
    const [results] = await pool.query('SELECT * FROM results WHERE userEmail = ? ORDER BY submittedAt DESC', [user.email]);
    res.json({ ...user, results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// ASSESSMENTS ROUTES
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/assessments', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM assessments ORDER BY createdAt DESC');
    res.json(rows.map(r => ({ ...r, questions: JSON.parse(r.questions || '[]') })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/assessments', adminAuth, async (req, res) => {
  const { id, category, topic, week, timeLimit, questions } = req.body;
  try {
    await pool.query(
      'INSERT INTO assessments (id, category, topic, week, timeLimit, questions) VALUES (?, ?, ?, ?, ?, ?)',
      [id || `custom-${Date.now()}`, category, topic, week, timeLimit, JSON.stringify(questions)]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/assessments/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM assessments WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// RESULTS ROUTES
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/results', adminAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM results ORDER BY submittedAt DESC');
    res.json(rows.map(r => ({ ...r, answers: JSON.parse(r.answers || '[]') })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/results/me', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM results WHERE userEmail = ? ORDER BY submittedAt DESC', [req.user.email]);
    res.json(rows.map(r => ({ ...r, answers: JSON.parse(r.answers || '[]') })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/results', auth, async (req, res) => {
  const { assessmentId, score, total, timeTaken, answers } = req.body;
  try {
    await pool.query(
      'INSERT INTO results (userEmail, assessmentId, score, total, timeTaken, answers) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.email, assessmentId, score, total, timeTaken, JSON.stringify(answers)]
    );
    // Update XP
    const xpGain = Math.round((score / total) * 20);
    await pool.query('UPDATE users SET xp = xp + ? WHERE email = ?', [xpGain, req.user.email]);
    res.json({ success: true, xpGain });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// DISCUSSIONS ROUTES
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/discussions', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM discussions ORDER BY createdAt DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/discussions', adminAuth, async (req, res) => {
  const { title, body, tag, author } = req.body;
  try {
    await pool.query('INSERT INTO discussions (title, body, tag, author) VALUES (?, ?, ?, ?)', [title, body, tag, author || 'Admin']);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/discussions/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM discussions WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS ROUTES
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/notifications', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notifications ORDER BY createdAt DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/notifications', adminAuth, async (req, res) => {
  const { title, message, type, author } = req.body;
  try {
    await pool.query('INSERT INTO notifications (title, message, type, author) VALUES (?, ?, ?, ?)', [title, message, type || 'info', author || 'Admin']);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/notifications/:id/read', auth, async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET isRead = TRUE WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/notifications/:id', adminAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM notifications WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
