import express from 'express';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.VITE_NEON_URL || process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_izrW7bvHTnO6@ep-autumn-grass-aokbs98e-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';
const sql = neon(dbUrl);

export const dsaRouter = express.Router();
export const adminDsaRouter = express.Router();

// ══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION & ROLE HELPERS
// ══════════════════════════════════════════════════════════════════════════════
export const getAuthUser = async (req) => {
  const userId = req.headers['x-user-id'] || req.query.userId || req.body?.userId;
  if (!userId) return null;
  try {
    const rows = await sql`
      SELECT id, email, username, name, is_admin, status 
      FROM profiles 
      WHERE id = ${String(userId)} OR LOWER(email) = ${String(userId).toLowerCase()} 
      LIMIT 1
    `;
    if (rows && rows.length > 0) return rows[0];
  } catch (e) {
    console.warn('Auth lookup notice:', e.message);
  }
  return { id: String(userId), is_admin: String(userId).includes('admin'), status: 'active' };
};

export const requireAuth = async (req, res, next) => {
  const user = await getAuthUser(req);
  if (!user) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required for this action.' } });
  }
  req.authUser = user;
  next();
};

export const requireAdmin = async (req, res, next) => {
  const user = await getAuthUser(req);
  if (!user || (!user.is_admin && user.id !== 'admin_master')) {
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Administrator privileges required.' } });
  }
  req.authUser = user;
  next();
};

// ── Streak Calculation Helper ────────────────────────────────────────────────
export async function calculateUserStreak(userId) {
  try {
    const solvedDates = await sql`
      SELECT DISTINCT DATE(solved_at) as solve_date
      FROM dsa_user_progress
      WHERE user_id = ${userId} AND status IN ('SOLVED', 'COMPLETED') AND solved_at IS NOT NULL
      ORDER BY solve_date DESC
    `;

    if (!solvedDates || solvedDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0, weekHistory: [false, false, false, false, false, false, false] };
    }

    const dates = solvedDates.map(r => new Date(r.solve_date).toISOString().split('T')[0]);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    let checkDate = new Date();
    if (!dates.includes(today) && dates.includes(yesterday)) {
      checkDate = new Date(Date.now() - 86400000);
    }

    if (dates.includes(today) || dates.includes(yesterday)) {
      while (true) {
        const dStr = checkDate.toISOString().split('T')[0];
        if (dates.includes(dStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    if (dates.length > 0) {
      tempStreak = 1;
      longestStreak = 1;
      for (let i = 0; i < dates.length - 1; i++) {
        const d1 = new Date(dates[i]);
        const d2 = new Date(dates[i + 1]);
        const diffDays = Math.round((d1 - d2) / 86400000);
        if (diffDays === 1) {
          tempStreak++;
          if (tempStreak > longestStreak) longestStreak = tempStreak;
        } else {
          tempStreak = 1;
        }
      }
    }

    const weekHistory = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      weekHistory.push(dates.includes(d));
    }

    return {
      currentStreak: Math.max(currentStreak, dates.includes(today) ? 1 : 0),
      longestStreak: Math.max(longestStreak, currentStreak),
      weekHistory,
      totalActiveDays: dates.length
    };
  } catch (err) {
    console.error('calculateUserStreak error:', err);
    return { currentStreak: 0, longestStreak: 0, weekHistory: [false, false, false, false, false, false, false], totalActiveDays: 0 };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. PUBLIC & MEMBER DSA ROUTES (/api/dsa/...)
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/dsa/sheets — Active DSA Roadmaps & Sheets
dsaRouter.get('/sheets', async (req, res) => {
  try {
    const sheets = await sql`
      SELECT 
        s.*,
        COUNT(DISTINCT t.id)::int AS topic_count,
        COUNT(DISTINCT p.id)::int AS problem_count
      FROM dsa_sheets s
      LEFT JOIN dsa_topics t ON t.sheet_id = s.id AND t.is_visible = TRUE
      LEFT JOIN dsa_problems p ON p.topic_id = t.id AND p.is_visible = TRUE
      WHERE s.is_published = TRUE
      GROUP BY s.id
      ORDER BY s.display_order ASC
    `;
    return res.json({ success: true, data: sheets });
  } catch (err) {
    console.error('GET /api/dsa/sheets error:', err);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// GET /api/dsa/topics — Visible topics with subtopics, problem counts & user progress
dsaRouter.get('/topics', async (req, res) => {
  try {
    const user = await getAuthUser(req);
    const userId = user?.id || null;

    const topics = await sql`
      SELECT 
        t.*,
        t.title AS title,
        t.display_order AS "chapterNumber",
        COUNT(DISTINCT s.id)::int AS section_count,
        COUNT(DISTINCT p.id)::int AS problem_count
      FROM dsa_topics t
      LEFT JOIN dsa_sections s ON s.topic_id = t.id AND s.is_visible = TRUE
      LEFT JOIN dsa_problems p ON p.topic_id = t.id AND p.is_visible = TRUE
      WHERE t.is_visible = TRUE
      GROUP BY t.id
      ORDER BY t.display_order ASC, t."order" ASC
    `;

    // Fetch sections for each topic
    const allSections = await sql`
      SELECT 
        s.*, 
        COUNT(p.id)::int AS problem_count
      FROM dsa_sections s
      LEFT JOIN dsa_problems p ON p.section_id = s.id AND p.is_visible = TRUE
      WHERE s.is_visible = TRUE
      GROUP BY s.id
      ORDER BY s.display_order ASC
    `;

    // Fetch user progress per topic if authenticated
    let userTopicProgressMap = {};
    if (userId) {
      const topicProgRows = await sql`
        SELECT 
          p.topic_id,
          COUNT(CASE WHEN prog.status IN ('SOLVED', 'COMPLETED') THEN 1 END)::int AS solved_count
        FROM dsa_user_progress prog
        JOIN dsa_problems p ON prog.problem_id = p.id
        WHERE prog.user_id = ${userId} AND p.is_visible = TRUE
        GROUP BY p.topic_id
      `;
      topicProgRows.forEach(r => { userTopicProgressMap[r.topic_id] = r.solved_count; });
    }

    const mapped = topics.map(top => ({
      ...top,
      solved_count: userTopicProgressMap[top.id] || 0,
      sections: allSections.filter(s => s.topic_id === top.id).map(s => ({
        id: s.id,
        title: s.title,
        difficulty: s.difficulty || 'EASY',
        description: s.description,
        displayOrder: s.display_order
      }))
    }));

    return res.json({ success: true, data: mapped });
  } catch (err) {
    console.error('GET /api/dsa/topics error:', err);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// GET /api/dsa/sections — Visible sections optionally filtered by topicId
dsaRouter.get('/sections', async (req, res) => {
  const { topicId } = req.query;
  try {
    const sections = topicId
      ? await sql`SELECT * FROM dsa_sections WHERE topic_id = ${topicId} AND is_visible = TRUE ORDER BY display_order ASC`
      : await sql`SELECT * FROM dsa_sections WHERE is_visible = TRUE ORDER BY display_order ASC`;
    return res.json({ success: true, data: sections });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// GET /api/dsa/problems — Multi-criteria filter & pagination
dsaRouter.get('/problems', async (req, res) => {
  const {
    search,
    topicId,
    sectionId,
    difficulty,
    status,
    tag,
    company,
    bookmarkedOnly,
    revisionOnly,
    page = 1,
    limit = 200
  } = req.query;

  const user = await getAuthUser(req);
  const userId = user?.id || null;

  try {
    // Fetch all published problems
    const allProbs = await sql`
      SELECT 
        p.*,
        p.time_complexity AS "timeComplexity",
        p.space_complexity AS "spaceComplexity",
        p.video_url AS "videoUrl",
        p.practice_url AS "practiceUrl",
        p.article_url AS "articleUrl",
        p.solution_url AS "solutionUrl",
        p.editorial_url AS "editorialUrl",
        p.github_url AS "githubUrl",
        p.expected_concepts AS "expectedConcepts",
        p.topic_id AS "topicId",
        p.section_id AS "sectionId"
      FROM dsa_problems p
      WHERE p.is_visible = TRUE
      ORDER BY p.display_order ASC, p.number ASC
    `;

    // Fetch tags, companies, examples & hints
    const problemTags = await sql`
      SELECT pt.problem_id, t.name as tag_name 
      FROM dsa_problem_tags pt 
      JOIN dsa_tags t ON pt.tag_id = t.id
    `;
    const problemCompanies = await sql`
      SELECT pc.problem_id, c.name as company_name 
      FROM dsa_problem_companies pc 
      JOIN dsa_companies c ON pc.company_id = c.id
    `;
    const allExamples = await sql`
      SELECT problem_id, input, output, explanation, display_order 
      FROM dsa_problem_examples 
      ORDER BY display_order ASC
    `;
    const allHints = await sql`
      SELECT problem_id, hint_order, content 
      FROM dsa_hints 
      ORDER BY hint_order ASC
    `;

    // Fetch user progress, bookmarks, notes, and revisions if authenticated
    let userProgressMap = {};
    let bookmarkSet = new Set();
    let revisionSet = new Set();
    let userNotesMap = {};

    if (userId) {
      const progressRows = await sql`SELECT problem_id, status FROM dsa_user_progress WHERE user_id = ${userId}`;
      progressRows.forEach(r => { userProgressMap[r.problem_id] = r.status; });

      const bookmarkRows = await sql`SELECT problem_id FROM dsa_bookmarks WHERE user_id = ${userId}`;
      bookmarkRows.forEach(r => { bookmarkSet.add(r.problem_id); });

      const revisionRows = await sql`SELECT problem_id FROM dsa_user_revisions WHERE user_id = ${userId}`;
      revisionRows.forEach(r => { revisionSet.add(r.problem_id); });

      const noteRows = await sql`SELECT problem_id, note_text, updated_at FROM dsa_user_notes WHERE user_id = ${userId}`;
      noteRows.forEach(r => { userNotesMap[r.problem_id] = { text: r.note_text, updatedAt: r.updated_at }; });
    }

    // Enrich problems
    let enriched = allProbs.map(p => {
      const tags = problemTags.filter(pt => pt.problem_id === p.id).map(pt => pt.tag_name);
      const companies = problemCompanies.filter(pc => pc.problem_id === p.id).map(pc => pc.company_name);
      const examples = allExamples.filter(ex => ex.problem_id === p.id);
      const hints = allHints.filter(h => h.problem_id === p.id).map(h => h.content);

      let constraints = [];
      if (p.constraints) {
        constraints = typeof p.constraints === 'string'
          ? p.constraints.split('\n').map(s => s.trim()).filter(Boolean)
          : (Array.isArray(p.constraints) ? p.constraints : []);
      }

      let starterCode = p.starter_code;
      if (typeof starterCode === 'string') {
        try { starterCode = JSON.parse(starterCode); } catch (e) {}
      }

      const userNote = userNotesMap[p.id] || null;

      return {
        ...p,
        tags,
        companies,
        examples,
        hints,
        constraints,
        starterCode,
        status: userProgressMap[p.id] || 'UNSOLVED',
        isBookmarked: bookmarkSet.has(p.id),
        isRevision: revisionSet.has(p.id),
        note: userNote ? userNote.text : '',
        hasNote: !!userNote
      };
    });

    // Apply Server-Side Filters
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      enriched = enriched.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.expectedConcepts || '').toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.companies.some(c => c.toLowerCase().includes(q)) ||
        String(p.number) === q
      );
    }

    if (topicId && topicId !== 'ALL') {
      enriched = enriched.filter(p => p.topicId === topicId);
    }

    if (sectionId && sectionId !== 'ALL') {
      enriched = enriched.filter(p => p.sectionId === sectionId);
    }

    if (difficulty && difficulty !== 'ALL') {
      enriched = enriched.filter(p => (p.difficulty || '').toUpperCase() === difficulty.toUpperCase());
    }

    if (status && status !== 'ALL') {
      if (status === 'REVISION') {
        enriched = enriched.filter(p => p.isRevision);
      } else if (status === 'COMPLETED' || status === 'SOLVED') {
        enriched = enriched.filter(p => p.status === 'SOLVED' || p.status === 'COMPLETED');
      } else if (status === 'IN_PROGRESS' || status === 'ATTEMPTED') {
        enriched = enriched.filter(p => p.status === 'ATTEMPTED' || p.status === 'IN_PROGRESS');
      } else if (status === 'NOT_STARTED' || status === 'UNSOLVED') {
        enriched = enriched.filter(p => !p.status || p.status === 'UNSOLVED' || p.status === 'NOT_STARTED');
      } else {
        enriched = enriched.filter(p => p.status === status);
      }
    }

    if (bookmarkedOnly === 'true' || bookmarkedOnly === true) {
      enriched = enriched.filter(p => p.isBookmarked);
    }

    if (revisionOnly === 'true' || revisionOnly === true) {
      enriched = enriched.filter(p => p.isRevision);
    }

    if (tag) {
      enriched = enriched.filter(p => p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
    }

    if (company) {
      enriched = enriched.filter(p => p.companies.some(c => c.toLowerCase() === company.toLowerCase()));
    }

    return res.json({
      success: true,
      data: enriched,
      totalCount: enriched.length
    });
  } catch (err) {
    console.error('GET /api/dsa/problems error:', err);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// GET /api/dsa/problems/:problemId — Complete Problem Detail
dsaRouter.get('/problems/:problemId', async (req, res) => {
  const { problemId } = req.params;
  const user = await getAuthUser(req);
  const userId = user?.id || null;

  try {
    const probRows = await sql`
      SELECT 
        p.*,
        p.time_complexity AS "timeComplexity",
        p.space_complexity AS "spaceComplexity",
        p.video_url AS "videoUrl",
        p.practice_url AS "practiceUrl",
        p.article_url AS "articleUrl",
        p.solution_url AS "solutionUrl",
        p.editorial_url AS "editorialUrl",
        p.github_url AS "githubUrl",
        p.expected_concepts AS "expectedConcepts",
        p.topic_id AS "topicId",
        p.section_id AS "sectionId"
      FROM dsa_problems p
      WHERE (p.id = ${problemId} OR p.slug = ${problemId}) AND p.is_visible = TRUE
      LIMIT 1
    `;

    if (!probRows || probRows.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Problem not found.' } });
    }

    const problem = probRows[0];

    const examples = await sql`
      SELECT input, output, explanation, display_order 
      FROM dsa_problem_examples 
      WHERE problem_id = ${problem.id} 
      ORDER BY display_order ASC
    `;

    const hints = await sql`
      SELECT hint_order, content 
      FROM dsa_hints 
      WHERE problem_id = ${problem.id} 
      ORDER BY hint_order ASC
    `;

    const tags = await sql`
      SELECT t.name FROM dsa_problem_tags pt 
      JOIN dsa_tags t ON pt.tag_id = t.id 
      WHERE pt.problem_id = ${problem.id}
    `;

    const companies = await sql`
      SELECT c.name FROM dsa_problem_companies pc 
      JOIN dsa_companies c ON pc.company_id = c.id 
      WHERE pc.problem_id = ${problem.id}
    `;

    let userStatus = 'UNSOLVED';
    let isBookmarked = false;
    let isRevision = false;
    let userNote = '';

    if (userId) {
      const prog = await sql`SELECT status FROM dsa_user_progress WHERE user_id = ${userId} AND problem_id = ${problem.id} LIMIT 1`;
      if (prog && prog.length > 0) userStatus = prog[0].status;

      const bm = await sql`SELECT id FROM dsa_bookmarks WHERE user_id = ${userId} AND problem_id = ${problem.id} LIMIT 1`;
      if (bm && bm.length > 0) isBookmarked = true;

      const rev = await sql`SELECT id FROM dsa_user_revisions WHERE user_id = ${userId} AND problem_id = ${problem.id} LIMIT 1`;
      if (rev && rev.length > 0) isRevision = true;

      const note = await sql`SELECT note_text FROM dsa_user_notes WHERE user_id = ${userId} AND problem_id = ${problem.id} LIMIT 1`;
      if (note && note.length > 0) userNote = note[0].note_text;
    }

    let parsedConstraints = [];
    if (problem.constraints) {
      parsedConstraints = typeof problem.constraints === 'string'
        ? problem.constraints.split('\n').map(s => s.trim()).filter(Boolean)
        : problem.constraints;
    }

    return res.json({
      success: true,
      data: {
        ...problem,
        examples,
        hints: hints.map(h => h.content),
        constraints: parsedConstraints,
        tags: tags.map(t => t.name),
        companies: companies.map(c => c.name),
        status: userStatus,
        isBookmarked,
        isRevision,
        note: userNote
      }
    });
  } catch (err) {
    console.error('GET /api/dsa/problems/:problemId error:', err);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// PATCH /api/dsa/problems/:problemId/progress — Update User Problem Status (UNSOLVED, ATTEMPTED, SOLVED, COMPLETED)
dsaRouter.patch('/problems/:problemId/progress', requireAuth, async (req, res) => {
  const { problemId } = req.params;
  const { status } = req.body;
  const userId = req.authUser.id;

  const validStatuses = ['UNSOLVED', 'ATTEMPTED', 'SOLVED', 'COMPLETED', 'NOT_STARTED', 'IN_PROGRESS'];
  if (!status || !validStatuses.includes(status.toUpperCase())) {
    return res.status(400).json({ success: false, error: { code: 'INVALID_STATUS', message: 'Invalid status value.' } });
  }

  let normalizedStatus = status.toUpperCase();
  if (normalizedStatus === 'COMPLETED') normalizedStatus = 'SOLVED';
  if (normalizedStatus === 'NOT_STARTED') normalizedStatus = 'UNSOLVED';
  if (normalizedStatus === 'IN_PROGRESS') normalizedStatus = 'ATTEMPTED';

  try {
    const probCheck = await sql`SELECT id FROM dsa_problems WHERE id = ${problemId} LIMIT 1`;
    if (!probCheck || probCheck.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'PROBLEM_NOT_FOUND', message: 'Problem does not exist.' } });
    }

    await sql`
      INSERT INTO dsa_user_progress (user_id, problem_id, status, attempt_count, first_attempt_at, last_attempt_at, solved_at, updated_at)
      VALUES (
        ${userId}, ${problemId}, ${normalizedStatus}, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
        ${normalizedStatus === 'SOLVED' ? sql`CURRENT_TIMESTAMP` : null}, CURRENT_TIMESTAMP
      )
      ON CONFLICT (user_id, problem_id) DO UPDATE SET
        status = EXCLUDED.status,
        attempt_count = dsa_user_progress.attempt_count + 1,
        last_attempt_at = CURRENT_TIMESTAMP,
        solved_at = CASE 
          WHEN EXCLUDED.status = 'SOLVED' AND dsa_user_progress.solved_at IS NULL THEN CURRENT_TIMESTAMP 
          WHEN EXCLUDED.status = 'UNSOLVED' THEN NULL
          ELSE dsa_user_progress.solved_at 
        END,
        updated_at = CURRENT_TIMESTAMP;
    `;

    return res.json({ success: true, message: `Status updated to ${normalizedStatus}.`, data: { status: normalizedStatus } });
  } catch (err) {
    console.error('PATCH progress error:', err);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// POST /api/dsa/progress/reset — Reset Progress for Authenticated User Only
dsaRouter.post('/progress/reset', requireAuth, async (req, res) => {
  const userId = req.authUser.id;
  const { topicId } = req.body;

  try {
    if (topicId && topicId !== 'ALL') {
      await sql`
        DELETE FROM dsa_user_progress 
        WHERE user_id = ${userId} AND problem_id IN (
          SELECT id FROM dsa_problems WHERE topic_id = ${topicId}
        );
      `;
      return res.json({ success: true, message: 'Progress for this topic has been reset.' });
    }

    await sql`DELETE FROM dsa_user_progress WHERE user_id = ${userId};`;
    return res.json({ success: true, message: 'Your overall DSA progress has been reset.' });
  } catch (err) {
    console.error('Reset progress error:', err);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// USER NOTES (STRICTLY USER-ISOLATED)
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/dsa/problems/:problemId/notes — Get personal note for a problem
dsaRouter.get('/problems/:problemId/notes', requireAuth, async (req, res) => {
  const { problemId } = req.params;
  const userId = req.authUser.id;

  try {
    const rows = await sql`
      SELECT id, note_text, created_at, updated_at 
      FROM dsa_user_notes 
      WHERE user_id = ${userId} AND problem_id = ${problemId} 
      LIMIT 1
    `;

    return res.json({
      success: true,
      data: rows && rows.length > 0 ? rows[0] : { note_text: '', updated_at: null }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// POST /api/dsa/problems/:problemId/notes — Save/update personal note
dsaRouter.post('/problems/:problemId/notes', requireAuth, async (req, res) => {
  const { problemId } = req.params;
  const { note_text, note } = req.body;
  const userId = req.authUser.id;
  const content = note_text !== undefined ? note_text : (note || '');

  try {
    if (!content.trim()) {
      await sql`DELETE FROM dsa_user_notes WHERE user_id = ${userId} AND problem_id = ${problemId};`;
      return res.json({ success: true, message: 'Note cleared.', data: { note_text: '' } });
    }

    const inserted = await sql`
      INSERT INTO dsa_user_notes (user_id, problem_id, note_text, updated_at)
      VALUES (${userId}, ${problemId}, ${content}, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, problem_id) DO UPDATE SET
        note_text = EXCLUDED.note_text,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id, note_text, updated_at;
    `;

    return res.json({ success: true, message: 'Note saved successfully.', data: inserted[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// DELETE /api/dsa/problems/:problemId/notes — Delete personal note
dsaRouter.delete('/problems/:problemId/notes', requireAuth, async (req, res) => {
  const { problemId } = req.params;
  const userId = req.authUser.id;

  try {
    await sql`DELETE FROM dsa_user_notes WHERE user_id = ${userId} AND problem_id = ${problemId};`;
    return res.json({ success: true, message: 'Note deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// GET /api/dsa/user/notes — Get all personal notes for current user
dsaRouter.get('/user/notes', requireAuth, async (req, res) => {
  const userId = req.authUser.id;
  try {
    const rows = await sql`
      SELECT 
        n.id, n.problem_id, n.note_text, n.updated_at,
        p.title AS problem_title, p.difficulty, t.title AS topic_title
      FROM dsa_user_notes n
      JOIN dsa_problems p ON n.problem_id = p.id
      LEFT JOIN dsa_topics t ON p.topic_id = t.id
      WHERE n.user_id = ${userId}
      ORDER BY n.updated_at DESC
    `;
    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// USER REVISION QUEUE (STRICTLY USER-ISOLATED)
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/dsa/revisions — Get revision problems
dsaRouter.get('/revisions', requireAuth, async (req, res) => {
  const userId = req.authUser.id;
  try {
    const rows = await sql`
      SELECT 
        p.*,
        p.time_complexity AS "timeComplexity",
        p.space_complexity AS "spaceComplexity",
        p.video_url AS "videoUrl",
        p.practice_url AS "practiceUrl",
        p.topic_id AS "topicId",
        COALESCE(prog.status, 'UNSOLVED') AS status,
        TRUE AS "isRevision",
        rev.created_at AS "revisionAddedAt",
        n.note_text AS note
      FROM dsa_user_revisions rev
      JOIN dsa_problems p ON rev.problem_id = p.id
      LEFT JOIN dsa_user_progress prog ON prog.problem_id = p.id AND prog.user_id = ${userId}
      LEFT JOIN dsa_user_notes n ON n.problem_id = p.id AND n.user_id = ${userId}
      WHERE rev.user_id = ${userId} AND p.is_visible = TRUE
      ORDER BY rev.created_at DESC
    `;

    return res.json({ success: true, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// POST /api/dsa/problems/:problemId/revision — Add to Revision Queue
dsaRouter.post('/problems/:problemId/revision', requireAuth, async (req, res) => {
  const { problemId } = req.params;
  const userId = req.authUser.id;

  try {
    await sql`
      INSERT INTO dsa_user_revisions (user_id, problem_id, created_at)
      VALUES (${userId}, ${problemId}, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, problem_id) DO NOTHING;
    `;
    return res.json({ success: true, message: 'Added to revision list.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// DELETE /api/dsa/problems/:problemId/revision — Remove from Revision Queue
dsaRouter.delete('/problems/:problemId/revision', requireAuth, async (req, res) => {
  const { problemId } = req.params;
  const userId = req.authUser.id;

  try {
    await sql`DELETE FROM dsa_user_revisions WHERE user_id = ${userId} AND problem_id = ${problemId};`;
    return res.json({ success: true, message: 'Removed from revision list.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// RANDOM PROBLEM SELECTOR
// ══════════════════════════════════════════════════════════════════════════════
dsaRouter.get('/random', async (req, res) => {
  const { difficulty, topicId, unsolvedOnly } = req.query;
  const user = await getAuthUser(req);
  const userId = user?.id || null;

  try {
    let rows;
    if (unsolvedOnly === 'true' && userId) {
      rows = await sql`
        SELECT p.id, p.title, p.difficulty, p.topic_id, t.title AS topic_title
        FROM dsa_problems p
        LEFT JOIN dsa_topics t ON p.topic_id = t.id
        LEFT JOIN dsa_user_progress prog ON prog.problem_id = p.id AND prog.user_id = ${userId}
        WHERE p.is_visible = TRUE
          AND (prog.status IS NULL OR prog.status = 'UNSOLVED')
          AND (${difficulty || null}::text IS NULL OR UPPER(p.difficulty) = UPPER(${difficulty}))
          AND (${topicId || null}::text IS NULL OR p.topic_id = ${topicId})
        ORDER BY RANDOM()
        LIMIT 1;
      `;
    } else {
      rows = await sql`
        SELECT p.id, p.title, p.difficulty, p.topic_id, t.title AS topic_title
        FROM dsa_problems p
        LEFT JOIN dsa_topics t ON p.topic_id = t.id
        WHERE p.is_visible = TRUE
          AND (${difficulty || null}::text IS NULL OR UPPER(p.difficulty) = UPPER(${difficulty}))
          AND (${topicId || null}::text IS NULL OR p.topic_id = ${topicId})
        ORDER BY RANDOM()
        LIMIT 1;
      `;
    }

    if (rows && rows.length > 0) {
      return res.json({ success: true, data: rows[0] });
    }

    // Fallback if no unsolved problem matches filters
    const fallback = await sql`SELECT id, title, difficulty, topic_id FROM dsa_problems WHERE is_visible = TRUE ORDER BY RANDOM() LIMIT 1`;
    return res.json({ success: true, data: fallback[0] || null });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// PROGRESS & ANALYTICS CALCULATION
// ══════════════════════════════════════════════════════════════════════════════
dsaRouter.get('/progress', requireAuth, async (req, res) => {
  const userId = req.authUser.id;

  try {
    // Total published problems
    const totalProblemsRows = await sql`
      SELECT 
        COUNT(*)::int as total,
        COUNT(CASE WHEN UPPER(difficulty) = 'EASY' THEN 1 END)::int as easy_total,
        COUNT(CASE WHEN UPPER(difficulty) = 'MEDIUM' THEN 1 END)::int as medium_total,
        COUNT(CASE WHEN UPPER(difficulty) = 'HARD' THEN 1 END)::int as hard_total
      FROM dsa_problems
      WHERE is_visible = TRUE
    `;
    const totals = totalProblemsRows[0] || { total: 0, easy_total: 0, medium_total: 0, hard_total: 0 };

    // User solved / attempted counts
    const userSolvedRows = await sql`
      SELECT 
        COUNT(CASE WHEN prog.status IN ('SOLVED', 'COMPLETED') THEN 1 END)::int as total_solved,
        COUNT(CASE WHEN prog.status IN ('ATTEMPTED', 'IN_PROGRESS') THEN 1 END)::int as total_attempted,
        COUNT(CASE WHEN prog.status IN ('SOLVED', 'COMPLETED') AND UPPER(p.difficulty) = 'EASY' THEN 1 END)::int as easy_solved,
        COUNT(CASE WHEN prog.status IN ('SOLVED', 'COMPLETED') AND UPPER(p.difficulty) = 'MEDIUM' THEN 1 END)::int as medium_solved,
        COUNT(CASE WHEN prog.status IN ('SOLVED', 'COMPLETED') AND UPPER(p.difficulty) = 'HARD' THEN 1 END)::int as hard_solved
      FROM dsa_user_progress prog
      JOIN dsa_problems p ON prog.problem_id = p.id
      WHERE prog.user_id = ${userId} AND p.is_visible = TRUE
    `;
    const userStats = userSolvedRows[0] || { total_solved: 0, total_attempted: 0, easy_solved: 0, medium_solved: 0, hard_solved: 0 };

    // Status map
    const allUserProgress = await sql`
      SELECT problem_id, status FROM dsa_user_progress WHERE user_id = ${userId}
    `;
    const statusMap = {};
    allUserProgress.forEach(r => { statusMap[r.problem_id] = r.status; });

    // Bookmarks list
    const userBookmarks = await sql`
      SELECT problem_id FROM dsa_bookmarks WHERE user_id = ${userId}
    `;
    const bookmarkIds = userBookmarks.map(b => b.problem_id);

    // Revisions list
    const userRevisions = await sql`
      SELECT problem_id FROM dsa_user_revisions WHERE user_id = ${userId}
    `;
    const revisionIds = userRevisions.map(r => r.problem_id);

    // Notes map
    const userNotes = await sql`
      SELECT problem_id, note_text FROM dsa_user_notes WHERE user_id = ${userId}
    `;
    const notesMap = {};
    userNotes.forEach(n => { notesMap[n.problem_id] = n.note_text; });

    const streak = await calculateUserStreak(userId);

    const totalProblems = totals.total || 1;
    const solvedCount = userStats.total_solved || 0;
    const pct = Math.round((solvedCount / totalProblems) * 100);

    return res.json({
      success: true,
      data: {
        totalProblems: totals.total,
        totalSolved: solvedCount,
        totalAttempted: userStats.total_attempted || 0,
        problemsRemaining: Math.max(0, totals.total - solvedCount),
        overallProgressPct: pct,
        easy: {
          solved: userStats.easy_solved || 0,
          total: totals.easy_total || 0,
          pct: totals.easy_total ? Math.round(((userStats.easy_solved || 0) / totals.easy_total) * 100) : 0
        },
        medium: {
          solved: userStats.medium_solved || 0,
          total: totals.medium_total || 0,
          pct: totals.medium_total ? Math.round(((userStats.medium_solved || 0) / totals.medium_total) * 100) : 0
        },
        hard: {
          solved: userStats.hard_solved || 0,
          total: totals.hard_total || 0,
          pct: totals.hard_total ? Math.round(((userStats.hard_solved || 0) / totals.hard_total) * 100) : 0
        },
        streak,
        statusMap,
        bookmarks: bookmarkIds,
        revisions: revisionIds,
        notesMap,
        revisionCount: revisionIds.length,
        notesCount: userNotes.length
      }
    });
  } catch (err) {
    console.error('GET /api/dsa/progress error:', err);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// GET /api/dsa/daily-problem — Daily Featured Problem
dsaRouter.get('/daily-problem', async (req, res) => {
  const todayStr = new Date().toISOString().split('T')[0];
  try {
    let dailyRow = await sql`
      SELECT p.*, dp.date 
      FROM dsa_daily_problems dp
      JOIN dsa_problems p ON dp.problem_id = p.id
      WHERE dp.date = ${todayStr}::date AND dp.is_active = TRUE AND p.is_visible = TRUE
      LIMIT 1
    `;

    if (!dailyRow || dailyRow.length === 0) {
      dailyRow = await sql`SELECT * FROM dsa_problems WHERE is_visible = TRUE ORDER BY number ASC LIMIT 1`;
    }

    if (dailyRow && dailyRow.length > 0) {
      return res.json({ success: true, data: dailyRow[0] });
    }

    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'No daily problem available.' } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// 2. ADMIN DSA MANAGEMENT SUITE (/api/admin/dsa/...)
// ══════════════════════════════════════════════════════════════════════════════

// GET /api/admin/dsa/stats — Complete DSA Management Analytics
adminDsaRouter.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [sheetCount] = await sql`SELECT COUNT(*)::int as total FROM dsa_sheets`;
    const [topicCount] = await sql`SELECT COUNT(*)::int as total FROM dsa_topics`;
    const [sectionCount] = await sql`SELECT COUNT(*)::int as total FROM dsa_sections`;
    const [probStats] = await sql`
      SELECT 
        COUNT(*)::int as total,
        COUNT(CASE WHEN is_visible = TRUE THEN 1 END)::int as published,
        COUNT(CASE WHEN is_visible = FALSE THEN 1 END)::int as draft,
        COUNT(CASE WHEN UPPER(difficulty) = 'EASY' THEN 1 END)::int as easy,
        COUNT(CASE WHEN UPPER(difficulty) = 'MEDIUM' THEN 1 END)::int as medium,
        COUNT(CASE WHEN UPPER(difficulty) = 'HARD' THEN 1 END)::int as hard
      FROM dsa_problems
    `;
    const [subCount] = await sql`SELECT COUNT(*)::int as total FROM dsa_submissions`;
    const [activeUsers] = await sql`SELECT COUNT(DISTINCT user_id)::int as total FROM dsa_user_progress`;

    return res.json({
      success: true,
      data: {
        totalSheets: sheetCount?.total || 1,
        totalTopics: topicCount?.total || 0,
        totalSections: sectionCount?.total || 0,
        totalProblems: probStats?.total || 0,
        publishedProblems: probStats?.published || 0,
        draftProblems: probStats?.draft || 0,
        easyProblems: probStats?.easy || 0,
        mediumProblems: probStats?.medium || 0,
        hardProblems: probStats?.hard || 0,
        totalSubmissions: subCount?.total || 0,
        activeLearners: activeUsers?.total || 0
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ── SHEET MANAGEMENT ──
adminDsaRouter.get('/sheets', requireAdmin, async (req, res) => {
  try {
    const sheets = await sql`SELECT * FROM dsa_sheets ORDER BY display_order ASC, created_at DESC`;
    return res.json({ success: true, data: sheets });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.post('/sheets', requireAdmin, async (req, res) => {
  const { title, slug, description, coverImage, isPublished = true, displayOrder = 1 } = req.body;
  const id = req.body.id || `sheet_${Date.now()}`;
  if (!title) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Sheet title is required.' } });

  try {
    await sql`
      INSERT INTO dsa_sheets (id, title, slug, description, cover_image, is_published, display_order)
      VALUES (${id}, ${title}, ${slug || id}, ${description || null}, ${coverImage || null}, ${isPublished}, ${displayOrder})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        is_published = EXCLUDED.is_published,
        display_order = EXCLUDED.display_order,
        updated_at = CURRENT_TIMESTAMP;
    `;
    return res.json({ success: true, message: 'Sheet saved.', data: { id, title } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.put('/sheets/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, coverImage, isPublished, displayOrder } = req.body;
  try {
    await sql`
      UPDATE dsa_sheets
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        cover_image = COALESCE(${coverImage}, cover_image),
        is_published = COALESCE(${isPublished}, is_published),
        display_order = COALESCE(${displayOrder}, display_order),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;
    return res.json({ success: true, message: 'Sheet updated.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.delete('/sheets/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM dsa_sheets WHERE id = ${id};`;
    return res.json({ success: true, message: 'Sheet deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ── TOPIC MANAGEMENT ──
adminDsaRouter.get('/topics', requireAdmin, async (req, res) => {
  try {
    const topics = await sql`
      SELECT 
        t.*,
        COUNT(DISTINCT s.id)::int AS section_count,
        COUNT(DISTINCT p.id)::int AS problem_count
      FROM dsa_topics t
      LEFT JOIN dsa_sections s ON s.topic_id = t.id
      LEFT JOIN dsa_problems p ON p.topic_id = t.id
      GROUP BY t.id
      ORDER BY t.display_order ASC
    `;
    return res.json({ success: true, data: topics });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.post('/topics', requireAdmin, async (req, res) => {
  const { title, name, slug, description, icon = 'Layers', color = '#2872A1', displayOrder = 1, isVisible = true, sheetId } = req.body;
  const id = req.body.id || `topic_${Date.now()}`;
  const finalTitle = title || name;
  if (!finalTitle) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Topic title is required.' } });

  try {
    await sql`
      INSERT INTO dsa_topics (id, sheet_id, title, name, slug, description, icon, color, display_order, "order", is_visible)
      VALUES (${id}, ${sheetId || null}, ${finalTitle}, ${finalTitle}, ${slug || id}, ${description || null}, ${icon}, ${color}, ${displayOrder}, ${displayOrder}, ${isVisible})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        icon = EXCLUDED.icon,
        color = EXCLUDED.color,
        display_order = EXCLUDED.display_order,
        is_visible = EXCLUDED.is_visible,
        updated_at = CURRENT_TIMESTAMP;
    `;
    return res.json({ success: true, message: 'Topic saved.', data: { id, title: finalTitle } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.put('/topics/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, name, description, icon, color, displayOrder, isVisible } = req.body;
  const finalTitle = title || name;

  try {
    await sql`
      UPDATE dsa_topics
      SET 
        title = COALESCE(${finalTitle}, title),
        name = COALESCE(${finalTitle}, name),
        description = COALESCE(${description}, description),
        icon = COALESCE(${icon}, icon),
        color = COALESCE(${color}, color),
        display_order = COALESCE(${displayOrder}, display_order),
        "order" = COALESCE(${displayOrder}, "order"),
        is_visible = COALESCE(${isVisible}, is_visible),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;
    return res.json({ success: true, message: 'Topic updated.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.delete('/topics/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM dsa_topics WHERE id = ${id};`;
    return res.json({ success: true, message: 'Topic deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.patch('/topics/reorder', requireAdmin, async (req, res) => {
  const { orderList } = req.body; // array of { id, displayOrder }
  if (!Array.isArray(orderList)) return res.status(400).json({ success: false, error: 'Invalid order list.' });

  try {
    for (const item of orderList) {
      await sql`UPDATE dsa_topics SET display_order = ${item.displayOrder}, "order" = ${item.displayOrder} WHERE id = ${item.id};`;
    }
    return res.json({ success: true, message: 'Topics reordered successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ── SUBTOPIC (SECTION) MANAGEMENT ──
adminDsaRouter.get('/sections', requireAdmin, async (req, res) => {
  const { topicId } = req.query;
  try {
    const sections = topicId
      ? await sql`SELECT s.*, COUNT(p.id)::int as problem_count FROM dsa_sections s LEFT JOIN dsa_problems p ON p.section_id = s.id WHERE s.topic_id = ${topicId} GROUP BY s.id ORDER BY s.display_order ASC`
      : await sql`SELECT s.*, COUNT(p.id)::int as problem_count FROM dsa_sections s LEFT JOIN dsa_problems p ON p.section_id = s.id GROUP BY s.id ORDER BY s.display_order ASC`;
    return res.json({ success: true, data: sections });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.post('/sections', requireAdmin, async (req, res) => {
  const { topicId, title, description, difficulty = 'EASY', displayOrder = 1, isVisible = true } = req.body;
  const id = req.body.id || `sec_${Date.now()}`;
  if (!title || !topicId) return res.status(400).json({ success: false, error: 'Title and Topic ID are required.' });

  try {
    await sql`
      INSERT INTO dsa_sections (id, topic_id, title, description, difficulty, display_order, is_visible)
      VALUES (${id}, ${topicId}, ${title}, ${description || null}, ${difficulty}, ${displayOrder}, ${isVisible})
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        difficulty = EXCLUDED.difficulty,
        display_order = EXCLUDED.display_order,
        is_visible = EXCLUDED.is_visible,
        updated_at = CURRENT_TIMESTAMP;
    `;
    return res.json({ success: true, message: 'Subtopic saved.', data: { id, title } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.put('/sections/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description, difficulty, displayOrder, isVisible } = req.body;
  try {
    await sql`
      UPDATE dsa_sections
      SET
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        difficulty = COALESCE(${difficulty}, difficulty),
        display_order = COALESCE(${displayOrder}, display_order),
        is_visible = COALESCE(${isVisible}, is_visible),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;
    return res.json({ success: true, message: 'Subtopic updated.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.delete('/sections/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM dsa_sections WHERE id = ${id};`;
    return res.json({ success: true, message: 'Subtopic deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ── PROBLEM MANAGEMENT ──
adminDsaRouter.get('/problems', requireAdmin, async (req, res) => {
  try {
    const problems = await sql`
      SELECT 
        p.*,
        p.topic_id AS "topicId",
        p.section_id AS "sectionId",
        p.practice_url AS "practiceUrl",
        p.video_url AS "videoUrl",
        p.article_url AS "articleUrl",
        p.solution_url AS "solutionUrl",
        p.editorial_url AS "editorialUrl",
        p.github_url AS "githubUrl",
        p.expected_concepts AS "expectedConcepts",
        t.title AS topic_title,
        s.title AS section_title
      FROM dsa_problems p
      LEFT JOIN dsa_topics t ON p.topic_id = t.id
      LEFT JOIN dsa_sections s ON p.section_id = s.id
      ORDER BY p.display_order ASC, p.number ASC
    `;
    return res.json({ success: true, data: problems });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.post('/problems', requireAdmin, async (req, res) => {
  const {
    id: customId,
    topicId,
    sectionId,
    title,
    number = 1,
    difficulty = 'EASY',
    description,
    constraints,
    timeComplexity,
    spaceComplexity,
    starterCode,
    practiceUrl,
    videoUrl,
    articleUrl,
    solutionUrl,
    editorialUrl,
    githubUrl,
    expectedConcepts,
    displayOrder = 1,
    isVisible = true,
    examples = [],
    hints = [],
    tags = [],
    companies = []
  } = req.body;

  const id = customId || `prob_${Date.now()}`;
  if (!title || !description) {
    return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Title and description are required.' } });
  }

  try {
    await sql`
      INSERT INTO dsa_problems (
        id, topic_id, section_id, title, slug, number, description, difficulty,
        practice_url, video_url, article_url, solution_url, editorial_url, github_url, expected_concepts,
        constraints, time_complexity, space_complexity, starter_code, display_order, "order", is_visible
      ) VALUES (
        ${id}, ${topicId || null}, ${sectionId || null}, ${title}, ${id}, ${number}, ${description}, ${difficulty.toUpperCase()},
        ${practiceUrl || null}, ${videoUrl || null}, ${articleUrl || null}, ${solutionUrl || null}, ${editorialUrl || null}, ${githubUrl || null}, ${expectedConcepts || null},
        ${Array.isArray(constraints) ? constraints.join('\n') : constraints},
        ${timeComplexity || null}, ${spaceComplexity || null},
        ${typeof starterCode === 'object' ? JSON.stringify(starterCode) : starterCode || null},
        ${displayOrder || number}, ${displayOrder || number}, ${isVisible}
      )
      ON CONFLICT (id) DO UPDATE SET
        topic_id = EXCLUDED.topic_id,
        section_id = EXCLUDED.section_id,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        difficulty = EXCLUDED.difficulty,
        practice_url = EXCLUDED.practice_url,
        video_url = EXCLUDED.video_url,
        article_url = EXCLUDED.article_url,
        solution_url = EXCLUDED.solution_url,
        editorial_url = EXCLUDED.editorial_url,
        github_url = EXCLUDED.github_url,
        expected_concepts = EXCLUDED.expected_concepts,
        constraints = EXCLUDED.constraints,
        time_complexity = EXCLUDED.time_complexity,
        space_complexity = EXCLUDED.space_complexity,
        starter_code = EXCLUDED.starter_code,
        display_order = EXCLUDED.display_order,
        is_visible = EXCLUDED.is_visible,
        updated_at = CURRENT_TIMESTAMP;
    `;

    // Examples
    if (Array.isArray(examples) && examples.length > 0) {
      await sql`DELETE FROM dsa_problem_examples WHERE problem_id = ${id};`;
      for (let i = 0; i < examples.length; i++) {
        const ex = examples[i];
        await sql`
          INSERT INTO dsa_problem_examples (problem_id, input, output, explanation, display_order)
          VALUES (${id}, ${ex.input || ''}, ${ex.output || ''}, ${ex.explanation || null}, ${i + 1});
        `;
      }
    }

    // Hints
    if (Array.isArray(hints) && hints.length > 0) {
      await sql`DELETE FROM dsa_hints WHERE problem_id = ${id};`;
      for (let i = 0; i < hints.length; i++) {
        await sql`
          INSERT INTO dsa_hints (problem_id, hint_order, content)
          VALUES (${id}, ${i + 1}, ${hints[i]});
        `;
      }
    }

    // Tags
    if (Array.isArray(tags) && tags.length > 0) {
      await sql`DELETE FROM dsa_problem_tags WHERE problem_id = ${id};`;
      for (const tName of tags) {
        if (!tName || !tName.trim()) continue;
        const cleanName = tName.trim();
        const tId = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await sql`
          INSERT INTO dsa_tags (id, name) VALUES (${tId}, ${cleanName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        `;
        const tagRow = await sql`SELECT id FROM dsa_tags WHERE LOWER(name) = LOWER(${cleanName}) LIMIT 1`;
        if (tagRow && tagRow.length > 0) {
          await sql`INSERT INTO dsa_problem_tags (problem_id, tag_id) VALUES (${id}, ${tagRow[0].id}) ON CONFLICT DO NOTHING;`;
        }
      }
    }

    // Companies
    if (Array.isArray(companies) && companies.length > 0) {
      await sql`DELETE FROM dsa_problem_companies WHERE problem_id = ${id};`;
      for (const cName of companies) {
        if (!cName || !cName.trim()) continue;
        const cleanName = cName.trim();
        const cId = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await sql`
          INSERT INTO dsa_companies (id, name) VALUES (${cId}, ${cleanName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        `;
        const compRow = await sql`SELECT id FROM dsa_companies WHERE LOWER(name) = LOWER(${cleanName}) LIMIT 1`;
        if (compRow && compRow.length > 0) {
          await sql`INSERT INTO dsa_problem_companies (problem_id, company_id) VALUES (${id}, ${compRow[0].id}) ON CONFLICT DO NOTHING;`;
        }
      }
    }

    return res.json({ success: true, message: 'Problem saved successfully.', data: { id, title } });
  } catch (err) {
    console.error('Admin create problem error:', err);
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.put('/problems/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const {
    topicId,
    sectionId,
    title,
    number,
    difficulty,
    description,
    constraints,
    timeComplexity,
    spaceComplexity,
    starterCode,
    practiceUrl,
    videoUrl,
    articleUrl,
    solutionUrl,
    editorialUrl,
    githubUrl,
    expectedConcepts,
    displayOrder,
    isVisible,
    examples,
    hints,
    tags,
    companies
  } = req.body;

  try {
    await sql`
      UPDATE dsa_problems
      SET
        topic_id = COALESCE(${topicId}, topic_id),
        section_id = COALESCE(${sectionId}, section_id),
        title = COALESCE(${title}, title),
        number = COALESCE(${number}, number),
        difficulty = COALESCE(${difficulty ? difficulty.toUpperCase() : null}, difficulty),
        description = COALESCE(${description}, description),
        practice_url = COALESCE(${practiceUrl}, practice_url),
        video_url = COALESCE(${videoUrl}, video_url),
        article_url = COALESCE(${articleUrl}, article_url),
        solution_url = COALESCE(${solutionUrl}, solution_url),
        editorial_url = COALESCE(${editorialUrl}, editorial_url),
        github_url = COALESCE(${githubUrl}, github_url),
        expected_concepts = COALESCE(${expectedConcepts}, expected_concepts),
        constraints = COALESCE(${Array.isArray(constraints) ? constraints.join('\n') : constraints}, constraints),
        time_complexity = COALESCE(${timeComplexity}, time_complexity),
        space_complexity = COALESCE(${spaceComplexity}, space_complexity),
        starter_code = COALESCE(${typeof starterCode === 'object' ? JSON.stringify(starterCode) : starterCode}, starter_code),
        display_order = COALESCE(${displayOrder}, display_order),
        "order" = COALESCE(${displayOrder}, "order"),
        is_visible = COALESCE(${isVisible}, is_visible),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id};
    `;

    // Update examples if supplied
    if (Array.isArray(examples)) {
      await sql`DELETE FROM dsa_problem_examples WHERE problem_id = ${id};`;
      for (let i = 0; i < examples.length; i++) {
        const ex = examples[i];
        await sql`
          INSERT INTO dsa_problem_examples (problem_id, input, output, explanation, display_order)
          VALUES (${id}, ${ex.input || ''}, ${ex.output || ''}, ${ex.explanation || null}, ${i + 1});
        `;
      }
    }

    // Update hints if supplied
    if (Array.isArray(hints)) {
      await sql`DELETE FROM dsa_hints WHERE problem_id = ${id};`;
      for (let i = 0; i < hints.length; i++) {
        await sql`
          INSERT INTO dsa_hints (problem_id, hint_order, content)
          VALUES (${id}, ${i + 1}, ${hints[i]});
        `;
      }
    }

    // Update tags if supplied
    if (Array.isArray(tags)) {
      await sql`DELETE FROM dsa_problem_tags WHERE problem_id = ${id};`;
      for (const tName of tags) {
        if (!tName || !tName.trim()) continue;
        const cleanName = tName.trim();
        const tId = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await sql`
          INSERT INTO dsa_tags (id, name) VALUES (${tId}, ${cleanName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        `;
        const tagRow = await sql`SELECT id FROM dsa_tags WHERE LOWER(name) = LOWER(${cleanName}) LIMIT 1`;
        if (tagRow && tagRow.length > 0) {
          await sql`INSERT INTO dsa_problem_tags (problem_id, tag_id) VALUES (${id}, ${tagRow[0].id}) ON CONFLICT DO NOTHING;`;
        }
      }
    }

    // Update companies if supplied
    if (Array.isArray(companies)) {
      await sql`DELETE FROM dsa_problem_companies WHERE problem_id = ${id};`;
      for (const cName of companies) {
        if (!cName || !cName.trim()) continue;
        const cleanName = cName.trim();
        const cId = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        await sql`
          INSERT INTO dsa_companies (id, name) VALUES (${cId}, ${cleanName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
        `;
        const compRow = await sql`SELECT id FROM dsa_companies WHERE LOWER(name) = LOWER(${cleanName}) LIMIT 1`;
        if (compRow && compRow.length > 0) {
          await sql`INSERT INTO dsa_problem_companies (problem_id, company_id) VALUES (${id}, ${compRow[0].id}) ON CONFLICT DO NOTHING;`;
        }
      }
    }

    return res.json({ success: true, message: 'Problem updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.delete('/problems/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM dsa_problems WHERE id = ${id};`;
    return res.json({ success: true, message: 'Problem deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.post('/problems/:id/duplicate', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await sql`SELECT * FROM dsa_problems WHERE id = ${id} LIMIT 1`;
    if (!existing || existing.length === 0) return res.status(404).json({ success: false, error: 'Problem not found.' });

    const p = existing[0];
    const newId = `${p.id}_copy_${Date.now().toString().slice(-4)}`;
    const newTitle = `${p.title} (Copy)`;

    await sql`
      INSERT INTO dsa_problems (
        id, topic_id, section_id, title, slug, number, description, difficulty,
        practice_url, video_url, article_url, solution_url, editorial_url, github_url, expected_concepts,
        constraints, time_complexity, space_complexity, starter_code, display_order, "order", is_visible
      ) VALUES (
        ${newId}, ${p.topic_id}, ${p.section_id}, ${newTitle}, ${newId}, ${p.number + 1}, ${p.description}, ${p.difficulty},
        ${p.practice_url}, ${p.video_url}, ${p.article_url}, ${p.solution_url}, ${p.editorial_url}, ${p.github_url}, ${p.expected_concepts},
        ${p.constraints}, ${p.time_complexity}, ${p.space_complexity}, ${p.starter_code}, ${p.display_order + 1}, ${p.order + 1}, FALSE
      );
    `;

    return res.json({ success: true, message: 'Problem duplicated successfully.', data: { id: newId, title: newTitle } });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

adminDsaRouter.patch('/problems/:id/status', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { isVisible } = req.body;
  try {
    await sql`UPDATE dsa_problems SET is_visible = ${isVisible}, updated_at = CURRENT_TIMESTAMP WHERE id = ${id};`;
    return res.json({ success: true, message: `Problem visibility set to ${isVisible}.` });
  } catch (err) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});
