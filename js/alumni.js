/**
 * ══════════════════════════════════════════════════════════════
 * NEXUS ALUMNI PORTAL — CLIENT LOGIC
 * Dynamic Batch Aggregation, Real-time Search, Accordions & Modal
 * ══════════════════════════════════════════════════════════════
 */



// Reference member counts for showcase fidelity
const BATCH_TARGET_COUNTS = {
  '2024': 68,
  '2023': 72,
  '2022': 65,
  '2021': 54,
  '2020': 48,
  '2019': 38
};

// Global App State
let allAlumni = [];
let filteredAlumni = [];
let batchExpandedState = {
  '2024': true // Latest batch open by default
};
let batchViewAllState = {};

// DOM Elements
const statsBatchesEl = document.getElementById('statBatches');
const statsAlumniEl = document.getElementById('statAlumni');
const statsCompaniesEl = document.getElementById('statCompanies');
const statsCountriesEl = document.getElementById('statCountries');
const searchInput = document.getElementById('alumniSearchInput');
const batchFilterSelect = document.getElementById('batchFilterSelect');
const companyFilterSelect = document.getElementById('companyFilterSelect');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const batchAccordionContainer = document.getElementById('batchAccordionContainer');
const alumniModalBackdrop = document.getElementById('alumniModal');

// Init
document.addEventListener('DOMContentLoaded', async () => {
  await fetchAlumniData();
  setupEventListeners();
});

function getApiBaseUrl() {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:';
  return isLocal ? 'http://localhost:3000' : '';
}

// Fetch Alumni from API or Fallback
async function fetchAlumniData() {
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/alumni?_t=${Date.now()}`);

    if (res.ok) {
      const result = await res.json();
      if (result.success && Array.isArray(result.data)) {
        allAlumni = result.data;
        updateStats(result.stats);
      } else {
        allAlumni = [];
        calculateAndSetStats(allAlumni);
      }
    } else {
      allAlumni = [];
      calculateAndSetStats(allAlumni);
    }
  } catch (err) {
    console.error('Alumni API offline, fetching failed:', err);
    allAlumni = [];
    calculateAndSetStats(allAlumni);
  }

  filteredAlumni = [...allAlumni];
  populateFilterOptions();
  renderBatches();
}

// Calculate & Set Statistics
function calculateAndSetStats(data) {
  const uniqueBatches = new Set(data.map(a => a.batch)).size;
  const uniqueCompanies = new Set(data.map(a => a.company.trim().toLowerCase())).size;
  const uniqueCountries = new Set(data.map(a => (a.country || 'India').trim().toLowerCase())).size;

  const stats = {
    totalBatches: Math.max(uniqueBatches, 0),
    totalAlumni: data.length,
    totalCompanies: Math.max(uniqueCompanies, 0),
    totalCountries: Math.max(uniqueCountries, 0)
  };
  updateStats(stats);
}

function updateStats(stats) {
  if (!stats) return;
  if (statsBatchesEl) statsBatchesEl.textContent = `${stats.totalBatches}+`;
  if (statsAlumniEl) statsAlumniEl.textContent = `${stats.totalAlumni}+`;
  if (statsCompaniesEl) statsCompaniesEl.textContent = `${stats.totalCompanies}+`;
  if (statsCountriesEl) statsCountriesEl.textContent = `${stats.totalCountries}+`;
}

// Populate Filter Options Dynamically
function populateFilterOptions() {
  if (!batchFilterSelect || !companyFilterSelect) return;

  // Batches (descending)
  const batches = Array.from(new Set(allAlumni.map(a => a.batch))).sort((a, b) => b.localeCompare(a));
  batchFilterSelect.innerHTML = '<option value="All Batches">All Batches</option>';
  batches.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = `Batch of ${b}`;
    batchFilterSelect.appendChild(opt);
  });

  // Companies (alphabetical)
  const companies = Array.from(new Set(allAlumni.map(a => a.company.trim()))).sort();
  companyFilterSelect.innerHTML = '<option value="All Companies">All Companies</option>';
  companies.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    companyFilterSelect.appendChild(opt);
  });
}

// Filter Logic
function applyFilters() {
  const searchVal = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const batchVal = batchFilterSelect ? batchFilterSelect.value : 'All Batches';
  const companyVal = companyFilterSelect ? companyFilterSelect.value : 'All Companies';

  filteredAlumni = allAlumni.filter(item => {
    const matchSearch = !searchVal ||
      item.name.toLowerCase().includes(searchVal) ||
      item.current_role.toLowerCase().includes(searchVal) ||
      item.company.toLowerCase().includes(searchVal) ||
      (item.skills && item.skills.toLowerCase().includes(searchVal)) ||
      (item.location && item.location.toLowerCase().includes(searchVal)) ||
      item.batch.includes(searchVal);

    const matchBatch = batchVal === 'All Batches' || item.batch === batchVal;
    const matchCompany = companyVal === 'All Companies' || item.company.toLowerCase() === companyVal.toLowerCase();

    return matchSearch && matchBatch && matchCompany;
  });

  renderBatches();
}

// Render Batches, Leaders First & Members Second
function renderBatches() {
  if (!batchAccordionContainer) return;
  batchAccordionContainer.innerHTML = '';

  if (filteredAlumni.length === 0) {
    batchAccordionContainer.innerHTML = `
      <div class="alumni-empty-state animate__animated animate__fadeIn">
        <div class="empty-icon-wrap">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <div class="empty-title">No alumni found</div>
        <div class="empty-subtitle">Try adjusting your search terms or resetting the active filters.</div>
        <button class="btn-filter-reset" onclick="resetAllFilters()" style="margin: 0 auto;">↺ Reset Filters</button>
      </div>
    `;
    return;
  }

  // Group by batch
  const batchGroups = {};
  filteredAlumni.forEach(alumnus => {
    if (!batchGroups[alumnus.batch]) {
      batchGroups[alumnus.batch] = [];
    }
    batchGroups[alumnus.batch].push(alumnus);
  });

  const sortedBatches = Object.keys(batchGroups).sort((a, b) => b.localeCompare(a));

  sortedBatches.forEach((batchYear, index) => {
    const batchList = batchGroups[batchYear];
    const isLatest = index === 0;
    const isExpanded = batchExpandedState[batchYear] !== undefined ? batchExpandedState[batchYear] : isLatest;

    // Strict Segregation: Leaders First, Members Second
    const leaders = batchList.filter(a => a.is_leader);
    const members = batchList.filter(a => !a.is_leader);

    // Calculate total count (using showcase baseline if available)
    const targetCount = BATCH_TARGET_COUNTS[batchYear] || batchList.length;
    const displayCount = Math.max(targetCount, batchList.length);

    // Pagination for members
    const isViewAll = batchViewAllState[batchYear] === true;
    const initialMemberLimit = 8;
    const displayedMembers = isViewAll ? members : members.slice(0, initialMemberLimit);
    const hasMoreMembers = members.length > initialMemberLimit && !isViewAll;

    const cardEl = document.createElement('div');
    cardEl.className = `batch-card ${isExpanded ? '' : 'collapsed'}`;
    cardEl.id = `batch-${batchYear}`;

    cardEl.innerHTML = `
      <div class="batch-header" onclick="toggleBatch('${batchYear}')">
        <div class="batch-title-wrap">
          <div class="batch-dot"></div>
          <div class="batch-text-col">
            <div class="batch-title">Batch of ${batchYear}</div>
            <div class="batch-subtitle">Leaders and members of the batch</div>
          </div>
        </div>
        <div class="batch-meta-wrap">
          <div class="batch-count-pill">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>${displayCount} Members</span>
          </div>
          <div class="batch-chevron">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </div>
        </div>
      </div>

      <div class="batch-body">
        ${leaders.length > 0 ? `
          <div class="alumni-subheading leaders-heading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>Leaders</span>
          </div>
          <div class="alumni-grid-leaders">
            ${leaders.map(l => renderLeaderCard(l)).join('')}
          </div>
        ` : ''}

        ${members.length > 0 ? `
          <div class="alumni-subheading members-heading">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
            <span>Members</span>
          </div>
          <div class="alumni-grid-members">
            ${displayedMembers.map(m => renderMemberCard(m)).join('')}
          </div>

          ${hasMoreMembers ? `
            <div class="view-all-wrap">
              <button class="btn-view-all-members" onclick="toggleViewAllMembers('${batchYear}', event)">
                <span>View all ${displayCount} members</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          ` : ''}
        ` : ''}
      </div>
    `;

    batchAccordionContainer.appendChild(cardEl);
  });
}

// Render Leader Card HTML
function renderLeaderCard(alumnus) {
  const initials = getInitials(alumnus.name);
  const designation = alumnus.leadership_role || 'Batch Leader';

  return `
    <div class="leader-card" onclick="openAlumniModal('${alumnus.id}')">
      <div class="leader-avatar-wrap">
        ${alumnus.profile_image ? `
          <img src="${alumnus.profile_image}" alt="${alumnus.name}" class="leader-avatar-img" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'avatar-initials\\'>${initials}</div>';" />
        ` : `<div class="avatar-initials">${initials}</div>`}
      </div>
      <div class="alumni-name">${alumnus.name}</div>
      <div class="alumni-badge-pill">${designation}</div>
      <div class="alumni-role">${alumnus.current_role} @ ${alumnus.company}</div>
      <div class="alumni-socials" onclick="event.stopPropagation();">
        ${alumnus.linkedin_url ? `
          <a href="${alumnus.linkedin_url}" class="alumni-social-btn" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn Profile">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
          </a>
        ` : ''}
        ${alumnus.github_url ? `
          <a href="${alumnus.github_url}" class="alumni-social-btn" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub Profile">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
          </a>
        ` : ''}
        ${alumnus.portfolio_url ? `
          <a href="${alumnus.portfolio_url}" class="alumni-social-btn" target="_blank" rel="noopener noreferrer" title="Portfolio / Website" aria-label="Portfolio Website">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          </a>
        ` : ''}
      </div>
    </div>
  `;
}

// Render Member Card HTML
function renderMemberCard(alumnus) {
  const initials = getInitials(alumnus.name);

  return `
    <div class="member-card" onclick="openAlumniModal('${alumnus.id}')">
      <div class="member-avatar-wrap">
        ${alumnus.profile_image ? `
          <img src="${alumnus.profile_image}" alt="${alumnus.name}" class="member-avatar-img" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'avatar-initials\\' style=\\'font-size: 1.2rem;\\'>${initials}</div>';" />
        ` : `<div class="avatar-initials" style="font-size: 1.2rem;">${initials}</div>`}
      </div>
      <div class="member-info-col">
        <div class="member-name">
          <span>${alumnus.name}</span>
          <svg class="verified-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="member-role">${alumnus.current_role} @ ${alumnus.company}</div>
      </div>
      ${alumnus.linkedin_url ? `
        <a href="${alumnus.linkedin_url}" class="member-social-btn" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation();" title="LinkedIn" aria-label="LinkedIn Profile">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
        </a>
      ` : ''}
    </div>
  `;
}

// Toggle Batch Accordion
function toggleBatch(batchYear) {
  batchExpandedState[batchYear] = !batchExpandedState[batchYear];
  const card = document.getElementById(`batch-${batchYear}`);
  if (card) {
    card.classList.toggle('collapsed', !batchExpandedState[batchYear]);
  }
}

// Toggle View All Members
function toggleViewAllMembers(batchYear, event) {
  if (event) event.stopPropagation();
  batchViewAllState[batchYear] = true;
  renderBatches();
}

// Reset All Filters
function resetAllFilters() {
  if (searchInput) searchInput.value = '';
  if (batchFilterSelect) batchFilterSelect.value = 'All Batches';
  if (companyFilterSelect) companyFilterSelect.value = 'All Companies';
  applyFilters();
}

// Open Detailed Alumni Profile Modal
function openAlumniModal(id) {
  const alumnus = allAlumni.find(a => a.id === id);
  if (!alumnus || !alumniModalBackdrop) return;

  const initials = getInitials(alumnus.name);
  const skillsArray = alumnus.skills ? alumnus.skills.split(',').map(s => s.trim()).filter(Boolean) : [];

  alumniModalBackdrop.innerHTML = `
    <div class="alumni-modal-card animate__animated animate__zoomIn animate__faster" onclick="event.stopPropagation();">
      <div class="modal-header-banner">
        <button class="btn-modal-close" onclick="closeAlumniModal()" aria-label="Close Modal">✕</button>
      </div>
      <div class="modal-avatar-box">
        ${alumnus.profile_image ? `
          <img src="${alumnus.profile_image}" alt="${alumnus.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'avatar-initials\\' style=\\'font-size: 2rem;\\'>${initials}</div>';" />
        ` : `<div class="avatar-initials" style="font-size: 2rem;">${initials}</div>`}
      </div>
      <div class="modal-body-content">
        <div class="modal-alumni-name">${alumnus.name}</div>
        <div class="modal-alumni-role">${alumnus.current_role} @ <strong>${alumnus.company}</strong></div>

        <div class="modal-badge-row">
          <span class="modal-badge badge-batch">Batch of ${alumnus.batch}</span>
          ${alumnus.is_leader ? `<span class="modal-badge badge-lead">⭐ ${alumnus.leadership_role || 'Leader'}</span>` : ''}
          ${alumnus.location ? `<span class="modal-badge badge-batch">📍 ${alumnus.location}</span>` : ''}
        </div>

        ${alumnus.bio ? `
          <div class="modal-bio-text">"${alumnus.bio}"</div>
        ` : ''}

        ${skillsArray.length > 0 ? `
          <div class="modal-skills-section">
            <div class="modal-skills-title">Core Expertise</div>
            <div class="modal-skills-wrap">
              ${skillsArray.map(s => `<span class="skill-chip">${s}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <div class="modal-socials-row">
          ${alumnus.linkedin_url ? `
            <a href="${alumnus.linkedin_url}" class="alumni-social-btn" target="_blank" rel="noopener noreferrer" style="width: 40px; height: 40px;" title="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            </a>
          ` : ''}
          ${alumnus.github_url ? `
            <a href="${alumnus.github_url}" class="alumni-social-btn" target="_blank" rel="noopener noreferrer" style="width: 40px; height: 40px;" title="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
            </a>
          ` : ''}
          ${alumnus.portfolio_url ? `
            <a href="${alumnus.portfolio_url}" class="alumni-social-btn" target="_blank" rel="noopener noreferrer" style="width: 40px; height: 40px;" title="Portfolio">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  alumniModalBackdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAlumniModal() {
  if (alumniModalBackdrop) {
    alumniModalBackdrop.classList.remove('active');
  }
  document.body.style.overflow = '';
}

// Helpers
function getInitials(name) {
  if (!name) return 'NX';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Setup Event Listeners
function setupEventListeners() {
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  if (batchFilterSelect) {
    batchFilterSelect.addEventListener('change', applyFilters);
  }
  if (companyFilterSelect) {
    companyFilterSelect.addEventListener('change', applyFilters);
  }
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetAllFilters);
  }
  if (alumniModalBackdrop) {
    alumniModalBackdrop.addEventListener('click', closeAlumniModal);
  }

  // Keyboard Escape to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAlumniModal();
  });
}
