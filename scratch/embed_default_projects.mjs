import fs from 'fs';

const exported = JSON.parse(fs.readFileSync('scratch/exported_projects.json', 'utf8'));
let projectJs = fs.readFileSync('js/project.js', 'utf8');

// Embed DEFAULT_STATIC_PROJECTS near the top
const staticArrayCode = `  // ── Default Fallback Projects (0ms Instant Render) ──\n  const DEFAULT_STATIC_PROJECTS = ${JSON.stringify(exported, null, 2)};\n`;

// Find where master state is declared
const targetState = `  // ── Global Master State ──\n  let allProjects = [];`;
const newState = `${staticArrayCode}\n  // ── Global Master State ──\n  let allProjects = [];`;

if (!projectJs.includes('DEFAULT_STATIC_PROJECTS')) {
  projectJs = projectJs.replace(targetState, newState);
}

// Now let's update fetchProjects to do an instant initial render from localStorage / DEFAULT_STATIC_PROJECTS, and then fetch from Neon DB with fast timeout
const fetchProjectsTarget = `  const fetchProjects = async () => {`;
const fetchProjectsReplacement = `  const fetchProjects = async (isBackground = false) => {
    // 0ms Instant Initial Load if empty
    if (allProjects.length === 0) {
      const cached = localStorage.getItem('nexus_cached_public_projects');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            processRawProjects(parsed);
          }
        } catch (e) {}
      }
      if (allProjects.length === 0 && Array.isArray(DEFAULT_STATIC_PROJECTS) && DEFAULT_STATIC_PROJECTS.length > 0) {
        processRawProjects(DEFAULT_STATIC_PROJECTS);
      }
    }

    if (allProjects.length === 0 && loadingSkeleton) {
      loadingSkeleton.style.display = "grid";
      if (errorState) errorState.style.display = "none";
      if (emptyState) emptyState.style.display = "none";
    }`;

// Replace in projectJs
projectJs = projectJs.replace(/const fetchProjects = async \(\) => {[\s\S]*?if \(allProjects\.length === 0 && loadingSkeleton\) {[\s\S]*?if \(emptyState\) emptyState\.style\.display = "none";[\s\S]*?}/, fetchProjectsReplacement);

fs.writeFileSync('js/project.js', projectJs, 'utf8');
console.log('Successfully updated js/project.js with instant 0ms render & fallback');
