# Nexus Hub — System Architecture & Engineering Blueprint

## 1. Executive Summary

**Nexus Hub / Sun Nexus Solutions** is a unified, enterprise-grade learning, assessment, and talent acceleration platform. The codebase has undergone a complete, non-breaking architectural refactor transitioning from monolithic scripting to a decoupled, testable, and maintainable layered architecture.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXUS HUB UI / PRESENTATION                      │
│   (AppLayout, Topbar, Sidebar, Responsive Drawers, Theme Engine)      │
├────────────────────────────────────────────────────────────────────────┤
│                           FEATURE MODULES                              │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────────┐   │
│   │     DSA     │ │  Aptitude   │ │  Projects   │ │   Admin Hub    │   │
│   │  Roadmap &  │ │ Assessments │ │  Showcase & │ │  (11 Modular   │   │
│   │   Problems  │ │  & Quizzes  │ │   Hiring    │ │     Tabs)      │   │
│   └─────────────┘ └─────────────┘ └─────────────┘ └────────────────┘   │
├────────────────────────────────────────────────────────────────────────┤
│                    REUSABLE HOOKS & ENGINES                            │
│   • useAssessment (State Machine)      • useAssessmentTimer (Tick & GC)│
│   • scoringEngine (Pure Scoring)       • dateUtils (ISO & Streaks)     │
│   • questionValidation (Validation)    • useTheme / useAuth (Context)  │
├────────────────────────────────────────────────────────────────────────┤
│                       DOMAIN STORAGE STORES                            │
│   ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌────────────┐ │
│   │assessmentStore│ │  resultStore  │ │   userStore   │ │projectStore│ │
│   ├───────────────┤ ├───────────────┤ ├───────────────┤ ├────────────┤ │
│   │discussionStore│ │notificationSt │ │  alumniStore  │ │inquiryStore│ │
│   ├───────────────┤ ├───────────────┤ ├───────────────┤ ├────────────┤ │
│   │ contentStore  │ │   dsaStore    │ │  storage/core │ │ storageKeys│ │
│   └───────────────┘ └───────────────┘ └───────────────┘ └────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│                     SERVICE & CLIENT LAYER (HTTP)                      │
│   • api.js (Standardized client with token injection & error mapping)  │
│   • dsaService.js (Roadmap chapters, filters, notes, and progress sync)│
├────────────────────────────────────────────────────────────────────────┤
│                     BACKEND & PERSISTENCE (SERVER)                     │
│   • Express API Server (Clean REST endpoints, CORS, JSON security)     │
│   • Neon Serverless PostgreSQL / Cloud Storage                         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Layers

### 2.1. Presentation & Layout Layer (`src/app/AppLayout.jsx`)
- **Responsibility**: Manages viewport layout, responsive breakpoints (`isDesktop`), drawer visibility, top header navigation, and persistent sidebar state.
- **Decoupling**: `App.jsx` serves as a clean composition root. It no longer contains hundreds of lines of viewport-tracking or navigation state logic.

### 2.2. Generic Assessment Engine (`src/utils/scoringEngine.js`, `src/hooks/useAssessment.js`)
- **Scoring Engine**: A pure, stateless utility calculating:
  - Total, attempted, correct, incorrect, and skipped question counts.
  - Percentage and accuracy metrics.
  - Duration and time spent formatted.
  - Performance status badges (`Outstanding`, `Proficient`, `Average`, `Needs Practice`).
  - Question-by-question review records with user answers vs. correct answers and explanations.
- **Timer Hook (`useAssessmentTimer`)**: Manages countdown ticks with automatic submission on expiration and complete garbage collection/clear on unmount.
- **Container Pattern (`AssessmentContainer.jsx`)**: Orchestrates the assessment cycle (Intro $\rightarrow$ Active Question $\rightarrow$ Completion Review) without polluting parent view components.

### 2.3. Modular Admin Architecture (`src/pages/admin/`)
The monolithic `Admin.jsx` (previously over 5,200 lines) has been decomposed into single-responsibility tab modules:
- `AdminOverviewTab.jsx`: Platform telemetry, quick stats, and live metric indicators.
- `AdminAssessmentsTab.jsx`: Assessment manager, question builder modal, live/draft toggle, and time limits.
- `AdminUsersTab.jsx`: Student management, status filters, promotion, and activation controls.
- `AdminSubmissionsTab.jsx`: Score review, performance rankings, and exportable assessment records.
- `AdminProjectsTab.jsx`: Project showcase moderation and status changes.
- `AdminDiscussionsTab.jsx`: Community forum thread monitoring and deletion.
- `AdminInquiriesTab.jsx`: Client work requests and freelancing proposals.
- `AdminAlumniTab.jsx`: Alumni records, companies, batches, and placement badges.
- `AdminHomePageTab.jsx` & `AdminStatCardsTab.jsx`: CMS control over home banners, headlines, and counters.
- `AdminDomainsTab.jsx`: Track and syllabus category management.
- `AdminDSATab.jsx`: Comprehensive DSA roadmap, topic, section, problem, and test case administration.

### 2.4. Centralized Storage Layer (`src/store/storage/`)
- `storageKeys.js`: Single source of truth for all storage keys.
- `storageAdapter.js`: Safe `get`/`set`/`remove`/`clearAll` methods with:
  - Automatic JSON serialization and deserialization.
  - Graceful corrupted JSON recovery returning safe fallbacks.
  - Reactive `nexus-data-updated` CustomEvent dispatching for cross-component re-renders.
- **Domain Store Separation**: 10 focused domain stores (`assessmentStore`, `resultStore`, `userStore`, `projectStore`, etc.) eliminate sprawling monolithic data files while maintaining backward-compatible re-exports via `src/store/index.js` and `src/store/dataStore.js`.

---

## 3. Security Hardening

1. **Elimination of Master Hardcoded Bypasses**:
   - Removed all hardcoded master admin credentials (`admin@nexus.com` / `admin123`, `admin@sunnexus.824`) from `server.js` and `AuthContext.jsx`.
   - Admin access is now strictly verified through database role records (`role: 'admin'`) and authenticated sessions.
2. **Environment Variable Configurations**:
   - Standardized `.env.example` templates created for root, frontend (`Present Dashboard`), and backend (`server`).
   - Database connection strings, API URLs, and secret keys are externalized.

---

## 4. Performance & Reliability

- **Vite Production Bundler**: Zero build errors or unresolved imports across 3,240+ modules.
- **Automated Test Suite**: 21 native Node.js unit tests covering date math, streak progression, scoring thresholds, storage fallbacks, question builders, and analytics aggregation.
- **Garbage Collection & Leak Prevention**: All timers and event listeners in hooks cleanly unregister when components unmount.
- **Theme Integrity**: Full Imperial Blue (`#2872A1`) and Solar Cyan (`#4A90C2`) color palette consistency preserved across both Light and Dark modes.

---

## 5. Future Extension Points

- **DSA Compiler & Online Judge**: The clean separation in `dsaService.js` and `dsaStore.js` provides straightforward plug-in points for WebAssembly or Docker-based remote code execution engines.
- **Mock Test Scheduling Engine**: The `scoringEngine` and `useAssessmentTimer` hooks are designed to ingest any standardized question payload (including multi-section, negative marking, and timed sections).
- **Machine Learning Talent Matching**: Domain stores provide clean data extraction hooks to feed real ML recommendation models for personalized student track recommendations.
