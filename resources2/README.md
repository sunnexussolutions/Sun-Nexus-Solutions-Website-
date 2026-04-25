# RESOURCES PAGE - WORKING FILES

## Active Files (DO NOT DELETE)
- `d:\websites using Q\resources\index.html` - Main resources page (WORKING)
- `d:\websites using Q\resources\app.js` - All dynamic data and functionality (WORKING)

## Features
✅ 20 Courses with full data
✅ 100+ YouTube video links
✅ 100 Quiz questions (5 per course)
✅ Progress tracking with localStorage
✅ Leaderboard system
✅ Certificate downloads
✅ Stats dashboard
✅ PDF notes view/download
✅ Fully dynamic - all data in app.js

## How to Access
1. Login at: `d:\websites using Q\nexus membership test\login.html`
   - Username: admin
   - Password: admin123
2. Click "Resources" in navigation OR
3. Go directly to: `d:\websites using Q\resources\index.html`

## Old Files (Backed Up)
All old resources files in `nexus membership test` folder have been renamed with `_OLD_` prefix and `.bak` extension.
These can be deleted if no longer needed.

## Structure
```
websites using Q/
├── resources/                    ← WORKING RESOURCES PAGE
│   ├── index.html               ← Main page
│   └── app.js                   ← All data & logic
└── nexus membership test/
    ├── login.html               ← Login page
    ├── home.html                ← Home page
    ├── resources.html           ← Redirect to ../resources/index.html
    └── _OLD_*.html.bak          ← Old backup files (can delete)
```

## To Add New Course
Edit `app.js` and add to:
1. `coursesData` array - course info
2. `videosData` object - video links
3. `quizzesData` object - quiz questions

Last Updated: 2026-03-07
