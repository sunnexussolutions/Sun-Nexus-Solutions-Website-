import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const htmlFiles = [
  'index.html',
  'about-us.html',
  'alumni.html',
  'aptitude.html',
  'contact.html',
  'events.html',
  'joining.html',
  'login.html',
  'signup.html',
  'mentor-ship.html',
  'project.html',
  'requirements.html'
];

let errors = 0;

console.log('--- Checking HTML Viewport & Global Scripts ---');
for (const file of htmlFiles) {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`[ERROR] Missing file: ${file}`);
    errors++;
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check viewport
  if (!content.includes('name="viewport"') && !content.includes("name='viewport'")) {
    console.error(`[ERROR] ${file} is missing viewport meta tag!`);
    errors++;
  } else {
    console.log(`✓ ${file}: Viewport tag verified`);
  }

  // If page uses standard navbar, verify nav-active.js
  if (content.includes('class="navbar"') && !content.includes('nav-active.js')) {
    console.warn(`[WARN] ${file} has navbar but does not link nav-active.js`);
  }
}

console.log('\n--- Checking CSS Responsive Breakpoint Coverage ---');
const cssFiles = [
  'css/nexus-theme.css',
  'css/home.css',
  'css/events.css',
  'css/project.css',
  'css/requirements.css',
  'css/about-us.css',
  'css/alumni.css',
  'css/mentor-ship.css',
  'css/login.css'
];

for (const cssRel of cssFiles) {
  const cssPath = path.join(rootDir, cssRel);
  if (!fs.existsSync(cssPath)) {
    console.error(`[ERROR] Missing CSS: ${cssRel}`);
    errors++;
    continue;
  }
  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  const has1024 = cssContent.includes('1024px') || cssContent.includes('992px');
  const has768 = cssContent.includes('768px') || cssContent.includes('640px') || cssContent.includes('576px');
  const hasSmallMobile = cssContent.includes('480px') || cssContent.includes('374px');

  console.log(`✓ ${cssRel}: Tablet(${has1024}), Mobile(${has768}), SmallMobile(${hasSmallMobile})`);
}

if (errors === 0) {
  console.log('\nAll Responsive Audit Pre-flight Checks Passed Perfectly!');
} else {
  console.error(`\nFound ${errors} errors during pre-flight audit.`);
  process.exit(1);
}
