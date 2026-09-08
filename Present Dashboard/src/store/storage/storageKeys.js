/**
 * ── Nexus Hub Storage Keys ──────────────────────────────────────────
 * Centralized registry of all localStorage keys used across the platform.
 */

export const STORAGE_KEYS = {
  // Authentication & Session
  AUTH_TOKEN: 'nexus-token',
  SESSION: 'nexus_user',
  LEGACY_USER: 'user',
  USERS: 'nexus_users',

  // Appearance & Preferences
  THEME: 'nexus-theme',
  SIDEBAR_COLLAPSED: 'nexus-sidebar-collapsed',

  // Learning & Assessments
  ASSESSMENTS: 'nexus_assessments',
  RESULTS: 'nexus_results',
  REFERENCE_NOTES: 'nexus_reference_notes',
  DSA_BOOKMARKS: 'nexus_dsa_bookmarks',
  DSA_NOTES: 'nexus_dsa_notes',
  DSA_PROGRESS: 'nexus_dsa_progress',

  // Projects & Portfolio
  PROJECTS: 'nexus_system_projects',
  COMMUNITY_POSTS: 'nexus-community-posts',

  // Admin & Management
  DISCUSSIONS: 'nexus_discussions',
  NOTIFICATIONS: 'nexus_notifications',
  ALUMNI: 'nexus_alumni',
  HIRING_SUBMISSIONS: 'nexus_hiring_submissions',
  PROJECT_REQUIREMENTS: 'nexus_project_requirements',
  HOME_CONTENT: 'nexus_home_content',
  STAT_CARDS: 'nexus_stat_cards',
  DOMAINS: 'nexus_domains',

  // User Stats & Gamification
  GAMIFICATION_STATS: 'nexus_gamification_stats',
  STREAK_SHIELD: 'nexus_streak_shield',
};
