import fs from 'fs';

// ── 1. Update css/nexus-theme.css ──
let nexusThemeCss = fs.readFileSync('css/nexus-theme.css', 'utf8');

const universalBadgeCss = `
/* ════════════════════════════════════════════════════
   UNIVERSAL NEXUS BADGE PILL (Pill + Dot)
   ════════════════════════════════════════════════════ */
.hero-kicker,
.nexus-badge-pill,
.events-badge-pill,
.about-badge,
.alumni-hero-badge {
  display: inline-flex !important;
  align-items: center !important;
  gap: 8px !important;
  padding: 5px 16px !important;
  border-radius: 9999px !important;
  background: rgba(40, 114, 161, 0.12) !important;
  border: 1px solid rgba(74, 144, 194, 0.28) !important;
  color: #4A90C2 !important;
  font-family: 'Poppins', sans-serif !important;
  font-size: 1.15rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.08em !important;
  text-transform: uppercase !important;
  margin-bottom: 16px !important;
  box-shadow: 0 2px 8px rgba(13, 27, 42, 0.04) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  transition: all 0.25s ease !important;
}

[data-theme="light"] .hero-kicker,
[data-theme="light"] .nexus-badge-pill,
[data-theme="light"] .events-badge-pill,
[data-theme="light"] .about-badge,
[data-theme="light"] .alumni-hero-badge,
body.light-mode .hero-kicker,
body.light-mode .nexus-badge-pill,
body.light-mode .events-badge-pill,
body.light-mode .about-badge,
body.light-mode .alumni-hero-badge {
  background: #EFF6FB !important;
  border: 1.5px solid #CBDDE9 !important;
  color: #2872A1 !important;
  box-shadow: 0 2px 8px rgba(13, 27, 42, 0.04) !important;
}

.kicker-dot,
.about-badge-dot,
.events-badge-dot,
.alumni-badge-dot,
.badge-pill-dot {
  width: 7px !important;
  height: 7px !important;
  border-radius: 50% !important;
  background: #4A90C2 !important;
  box-shadow: 0 0 8px #4A90C2 !important;
  display: inline-block !important;
  flex-shrink: 0 !important;
}

[data-theme="light"] .kicker-dot,
[data-theme="light"] .about-badge-dot,
[data-theme="light"] .events-badge-dot,
[data-theme="light"] .alumni-badge-dot,
[data-theme="light"] .badge-pill-dot,
body.light-mode .kicker-dot,
body.light-mode .about-badge-dot,
body.light-mode .events-badge-dot,
body.light-mode .alumni-badge-dot,
body.light-mode .badge-pill-dot {
  background: #2872A1 !important;
  box-shadow: 0 0 8px #2872A1 !important;
}
`;

if (!nexusThemeCss.includes('UNIVERSAL NEXUS BADGE PILL')) {
  nexusThemeCss += universalBadgeCss;
  fs.writeFileSync('css/nexus-theme.css', nexusThemeCss, 'utf8');
  console.log('✓ css/nexus-theme.css updated with universal badge styles');
}

// ── 2. Update events.html ──
let eventsHtml = fs.readFileSync('events.html', 'utf8');
eventsHtml = eventsHtml.replace(
  /<div class="events-badge-pill">[\s\S]*?<\/div>\s*(?=<h1>)/,
  `<div class="hero-kicker">
            <span class="kicker-dot"></span>
            EVENTS SHOWCASE
        </div>
        `
);
fs.writeFileSync('events.html', eventsHtml, 'utf8');
console.log('✓ events.html updated');

// ── 3. Update about-us.html ──
let aboutHtml = fs.readFileSync('about-us.html', 'utf8');
aboutHtml = aboutHtml.replace(
  /<div class="about-badge">[\s\S]*?<\/div>/,
  `<div class="hero-kicker">
              <span class="kicker-dot"></span>
              ABOUT US
            </div>`
);
fs.writeFileSync('about-us.html', aboutHtml, 'utf8');
console.log('✓ about-us.html updated');

// ── 4. Update index.html ──
let indexHtml = fs.readFileSync('index.html', 'utf8');
indexHtml = indexHtml.replace(
  /<div class="hero-badge-pill">[\s\S]*?<\/div>/,
  `<div class="hero-kicker">
            <span class="kicker-dot"></span>
            LIVE INNOVATION HUB
          </div>`
);
fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('✓ index.html updated');

// ── 5. Update mentor-ship.html ──
let mentorHtml = fs.readFileSync('mentor-ship.html', 'utf8');
if (!mentorHtml.includes('MENTORSHIP PROGRAM')) {
  mentorHtml = mentorHtml.replace(
    /<div class="quiz-badge-icon">[\s\S]*?<\/div>/,
    `<div class="hero-kicker" style="margin-bottom: 20px;">
            <span class="kicker-dot"></span>
            MENTORSHIP PROGRAM
          </div>`
  );
  fs.writeFileSync('mentor-ship.html', mentorHtml, 'utf8');
  console.log('✓ mentor-ship.html updated');
}

// ── 6. Update alumni.html ──
let alumniHtml = fs.readFileSync('alumni.html', 'utf8');
alumniHtml = alumniHtml.replace(
  /<div class="alumni-hero-badge">[\s\S]*?<\/div>/,
  `<div class="hero-kicker">
              <span class="kicker-dot"></span>
              OUR ALUMNI
            </div>`
);
fs.writeFileSync('alumni.html', alumniHtml, 'utf8');
console.log('✓ alumni.html updated');

// ── 7. Update contact.html ──
let contactHtml = fs.readFileSync('contact.html', 'utf8');
if (!contactHtml.includes('GET IN TOUCH')) {
  contactHtml = contactHtml.replace(
    /<section class="contact-hero">\s*(<div class="hero-float-badge badge-left">[\s\S]*?<\/div>\s*<div class="hero-float-badge badge-right">[\s\S]*?<\/div>)/,
    `<section class="contact-hero">
      $1
      <div class="hero-kicker">
        <span class="kicker-dot"></span>
        GET IN TOUCH
      </div>`
  );
  fs.writeFileSync('contact.html', contactHtml, 'utf8');
  console.log('✓ contact.html updated');
}

// ── 8. Update joining.html ──
let joiningHtml = fs.readFileSync('joining.html', 'utf8');
if (!joiningHtml.includes('MEMBERSHIP APPLICATION')) {
  joiningHtml = joiningHtml.replace(
    /<section class="contact-hero">\s*(<div class="hero-float-badge badge-left">[\s\S]*?<\/div>\s*<div class="hero-float-badge badge-right">[\s\S]*?<\/div>)/,
    `<section class="contact-hero">
      $1
      <div class="hero-kicker">
        <span class="kicker-dot"></span>
        MEMBERSHIP APPLICATION
      </div>`
  );
  fs.writeFileSync('joining.html', joiningHtml, 'utf8');
  console.log('✓ joining.html updated');
}

// ── 9. Update requirements.html ──
let reqHtml = fs.readFileSync('requirements.html', 'utf8');
if (!reqHtml.includes('PROJECT REQUIREMENTS')) {
  reqHtml = reqHtml.replace(
    /<section class="req-hero">\s*(<div class="hero-float-badge badge-left">[\s\S]*?<\/div>\s*<div class="hero-float-badge badge-right">[\s\S]*?<\/div>)/,
    `<section class="req-hero">
      $1
      <div class="hero-kicker">
        <span class="kicker-dot"></span>
        PROJECT REQUIREMENTS
      </div>`
  );
  fs.writeFileSync('requirements.html', reqHtml, 'utf8');
  console.log('✓ requirements.html updated');
}

console.log('All pages badges updated successfully!');
