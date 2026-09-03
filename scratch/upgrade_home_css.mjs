import fs from 'fs';

let homeCss = fs.readFileSync('css/home.css', 'utf8');

// Replace Hero Section & Stats CSS
const heroSectionRegex = /\/\* ════════════════════════════════════════════════════\s*1\. HERO SECTION & STAT CARDS[\s\S]*?\/\* Bottom Stats Row \*\/\s*\.hero-stats-row \{[\s\S]*?\.stat-lbl \{[\s\S]*?font-weight: 500;\s*color: var\(--text-secondary\);\s*\}/;

const newHeroSectionCss = `/* ════════════════════════════════════════════════════
   1. HERO SECTION & STAT CARDS (CLEAN RESPONSIVE ARCHITECTURE)
   ════════════════════════════════════════════════════ */
.hero-section {
  min-height: auto;
  padding: 120px 24px 60px;
  position: relative;
  overflow: hidden;
  background: var(--bg-primary);
  width: 100%;
}

/* Subtle Glowing Background Gradients */
.hero-section::before {
  content: '';
  position: absolute;
  top: -10%;
  left: 10%;
  width: 50vw;
  height: 50vw;
  max-width: 600px;
  max-height: 600px;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.hero-section::after {
  content: '';
  position: absolute;
  bottom: 0%;
  right: -5%;
  width: 45vw;
  height: 45vw;
  max-width: 550px;
  max-height: 550px;
  background: radial-gradient(circle, rgba(0, 242, 254, 0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.hero-container {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 48px;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  z-index: 2;
  position: relative;
}

/* Hero Left Column */
.hero-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  z-index: 2;
}

.hero-title {
  font-size: clamp(3.2rem, 4.8vw, 5.2rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.025em;
  margin-bottom: 18px;
  font-family: 'Poppins', sans-serif;
  word-wrap: break-word;
}

.title-main {
  color: var(--text-primary, #0D1B2A);
  display: inline;
  transition: color var(--transition-base);
}

[data-theme="light"] .title-main,
body.light-mode .title-main {
  color: #0D1B2A;
}

.title-gradient {
  background: linear-gradient(135deg, #2872A1 0%, #4A90C2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline;
}

.hero-subtitle {
  font-size: clamp(1.6rem, 2.2vw, 2.0rem);
  font-weight: 600;
  color: var(--text-primary, #0D1B2A);
  margin-bottom: 16px;
  line-height: 1.4;
  letter-spacing: -0.01em;
  font-family: 'Poppins', sans-serif;
}

[data-theme="light"] .hero-subtitle,
body.light-mode .hero-subtitle {
  color: #0D1B2A;
}

.hero-subtitle .text-cyan,
.hero-subtitle .text-magenta {
  color: var(--color-primary, #2872A1);
  font-weight: 700;
}

.hero-desc {
  font-size: clamp(1.4rem, 1.6vw, 1.55rem);
  font-weight: 400;
  color: var(--text-secondary, #64748B);
  line-height: 1.65;
  max-width: 540px;
  margin-bottom: 28px;
  font-family: 'Poppins', sans-serif;
}

.hero-btn-group {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.btn-explore {
  background: var(--color-primary, #2872A1) !important;
  color: #ffffff !important;
  font-weight: 600;
  font-size: 1.45rem;
  padding: 12px 28px;
  border-radius: 8px;
  border: none;
  box-shadow: 0 4px 14px rgba(40, 114, 161, 0.25);
  text-decoration: none !important;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
}

.btn-explore:hover {
  background: var(--nexus-primary-hover, #205E86) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 114, 161, 0.35);
  color: #ffffff !important;
}

.btn-join {
  background: var(--bg-card, #FFFFFF) !important;
  border: 1.5px solid var(--color-primary, #2872A1) !important;
  color: var(--color-primary, #2872A1) !important;
  font-weight: 600;
  font-size: 1.45rem;
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none !important;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
}

.btn-join:hover {
  background: var(--nexus-background, #F3F7FB) !important;
  color: var(--color-primary, #2872A1) !important;
  transform: translateY(-2px);
  border-color: var(--color-primary, #2872A1) !important;
}

/* Hero Right Column */
.hero-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  width: 100%;
  z-index: 2;
}

.hero-badges-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
}

.hero-badge-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-badge-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  background: var(--bg-card-hover);
}

.badge-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.hero-badge-card:hover .badge-icon-wrap {
  transform: scale(1.1);
}

.badge-icon-wrap.cyan {
  background: rgba(0, 242, 254, 0.15);
  color: #00f2fe;
}

.badge-icon-wrap.purple {
  background: rgba(79, 172, 254, 0.15);
  color: #4facfe;
}

[data-theme="light"] .hero-badge-card {
  background: #ffffff;
  border: 1px solid rgba(14, 165, 233, 0.25);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
}
[data-theme="light"] .hero-badge-card:hover {
  border-color: #0284c7;
  box-shadow: 0 12px 30px rgba(2, 132, 199, 0.12);
  transform: translateY(-3px);
}
[data-theme="light"] .badge-icon-wrap.cyan {
  background: rgba(2, 132, 199, 0.15);
  color: #0284c7;
}
[data-theme="light"] .badge-icon-wrap.purple {
  background: rgba(3, 105, 161, 0.15);
  color: #0369a1;
}

.hero-card-details {
  display: flex;
  flex-direction: column;
  text-align: left;
  min-width: 0;
}

.badge-number {
  font-size: 2.0rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.15;
}

.badge-label {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-image-card {
  width: 100%;
  border-radius: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  padding: 10px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 35px rgba(56, 189, 248, 0.12);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.hero-image-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 45px rgba(56, 189, 248, 0.2);
}

.hero-image-card img {
  width: 100%;
  height: 100%;
  max-height: 340px;
  object-fit: cover;
  border-radius: 14px;
  display: block;
}

/* Hero Carousel Styling */
.hero-carousel-track {
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: 14px;
  overflow: hidden;
}

.hero-carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(1.02);
  pointer-events: none;
}

.hero-carousel-slide.active {
  opacity: 1;
  transform: scale(1);
  pointer-events: auto;
  z-index: 1;
}

.hero-carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
  display: block;
}

.hero-carousel-prev,
.hero-carousel-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: rgba(15, 23, 42, 0.7);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);
  user-select: none;
}

.hero-carousel-prev { left: 16px; }
.hero-carousel-next { right: 16px; }

.hero-carousel-prev:hover,
.hero-carousel-next:hover {
  background: var(--color-primary);
  color: #ffffff;
  transform: translateY(-50%) scale(1.08);
  box-shadow: 0 0 12px var(--color-primary-glow);
}

.hero-carousel-dots {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  gap: 8px;
  background: rgba(15, 23, 42, 0.65);
  padding: 5px 10px;
  border-radius: 20px;
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-dot.active {
  background: var(--color-primary);
  width: 20px;
  border-radius: 6px;
  box-shadow: 0 0 8px var(--color-primary-glow);
}

/* Bottom Stats Row */
.hero-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-width: 1280px;
  width: 100%;
  margin: 48px auto 0;
  z-index: 2;
  position: relative;
}

.stat-grid-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 18px;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.stat-grid-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  background: var(--bg-card-hover);
}

.stat-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  margin-bottom: 14px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-grid-card:hover .stat-icon-wrap {
  transform: scale(1.1);
}

.stat-icon-wrap.blue {
  background: rgba(79, 172, 254, 0.15);
  color: #4facfe;
  border: 1px solid rgba(79, 172, 254, 0.3);
}

.stat-icon-wrap.cyan {
  background: rgba(0, 242, 254, 0.15);
  color: #00f2fe;
  border: 1px solid rgba(0, 242, 254, 0.3);
}

.stat-icon-wrap.purple {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.stat-val {
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 4px;
  line-height: 1.1;
}

.stat-lbl {
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--text-secondary);
}`;

homeCss = homeCss.replace(heroSectionRegex, newHeroSectionCss);

// Replace Responsive Breakpoints
const responsiveRegex = /\/\* ════════════════════════════════════════════════════\s*5\. RESPONSIVE BREAKPOINTS \(ALL SCREENS\)[\s\S]*?@media \(max-width: 640px\) \{[\s\S]*?\.section-subtitle,\s*\.why-subtext \{ font-size: 1\.55rem; margin-bottom: 36px; \}\s*\}/;

const newResponsiveCss = `/* ════════════════════════════════════════════════════
   5. RESPONSIVE BREAKPOINTS (ALL SCREENS - ROBUST FLOW)
   ════════════════════════════════════════════════════ */
@media (max-width: 1200px) {
  .hero-container {
    gap: 36px;
  }
  .logbook-featured-card { padding: 44px 36px; gap: 30px; }
}

@media (max-width: 1024px) {
  .hero-section {
    padding: 110px 24px 50px;
  }
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }
  .hero-left {
    align-items: center;
    text-align: center;
    width: 100%;
  }
  .hero-desc {
    margin-left: auto;
    margin-right: auto;
  }
  .hero-btn-group {
    justify-content: center;
  }
  .hero-right {
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }
  .hero-stats-row,
  .values-grid,
  .leadership-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  .why-icons-row {
    grid-template-columns: 1fr;
    max-width: 550px;
  }
  .logbook-featured-card {
    flex-direction: column;
    text-align: center;
    padding: 30px 20px;
    gap: 10px;
  }
  .logbook-text-area {
    text-align: center;
    flex: 1 1 auto;
  }
  .logbook-description {
    margin: 0 auto 20px;
  }
  .logbook-visual-area {
    width: 100%;
    order: -1;
    min-height: 200px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 100px 18px 40px;
  }
  .hero-title {
    font-size: clamp(2.8rem, 7vw, 4.0rem);
  }
  .hero-badges-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .hero-carousel-track {
    height: 260px;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding: 95px 16px 36px;
  }
  .hero-title {
    font-size: 3.2rem;
  }
  .hero-subtitle {
    font-size: 1.55rem;
  }
  .hero-desc {
    font-size: 1.35rem;
    margin-bottom: 24px;
  }
  .hero-btn-group {
    flex-direction: column;
    width: 100%;
  }
  .btn-explore,
  .btn-join {
    width: 100%;
    text-align: center;
  }
  .hero-stats-row {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 36px;
  }
  .stat-grid-card {
    padding: 18px 12px;
  }
  .stat-val {
    font-size: 2.2rem;
  }
  .stat-lbl {
    font-size: 1.2rem;
  }
  .values-grid,
  .leadership-grid,
  .why-icons-row {
    grid-template-columns: 1fr;
  }
  .section-title,
  .logbook-heading,
  .why-heading { font-size: 2.8rem; }
  .section-subtitle,
  .why-subtext { font-size: 1.45rem; margin-bottom: 30px; }
}`;

homeCss = homeCss.replace(responsiveRegex, newResponsiveCss);

// Modal Solid Backdrop Fix
const modalRegex = /\.nexus-modal \{[\s\S]*?padding: 20px;\s*\}/;
const newModalCss = `.nexus-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(7, 19, 30, 0.94);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 100000 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s ease, visibility 0.35s ease;
  padding: 20px;
}`;
homeCss = homeCss.replace(modalRegex, newModalCss);

fs.writeFileSync('css/home.css', homeCss, 'utf8');
console.log('✓ Successfully upgraded css/home.css with clean responsive layout & solid modal backdrop');
