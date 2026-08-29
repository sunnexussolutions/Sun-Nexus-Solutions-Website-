/**
 * ══════════════════════════════════════════════════════════════
 * SUN NEXUS SOLUTIONS — PROJECTS PAGE ENGINE
 * Single Source of Truth API Consumption, Dynamic Filtering,
 * Category Accordions, Project Card Grid & Analytics Modal
 * ══════════════════════════════════════════════════════════════
 */

document.addEventListener("DOMContentLoaded", () => {
  
  // ── Global Master State ──
  let allProjects = [];
  let masterProjectsMap = {};
  let activeFilter = 'all';
  let searchQuery = '';
  let accordionOpenState = {
    'beginner': true,
    'intermediate': true,
    'advanced': true,
    'ongoing': true,
    'completed': true
  };

  // ── DOM References ──
  const searchInput = document.getElementById("projectSearchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const filterPillsContainer = document.getElementById("filterPillsContainer");
  const accordionsContainer = document.getElementById("accordionsContainer");
  const loadingSkeleton = document.getElementById("projectsLoadingSkeleton");
  const errorState = document.getElementById("projectsErrorState");
  const emptyState = document.getElementById("projectsEmptyState");
  const retryFetchBtn = document.getElementById("retryFetchBtn");
  const resetFiltersBtn = document.getElementById("resetFiltersBtn");

  // Stat Elements
  const statTotalProjects = document.getElementById("statTotalProjects");
  const statTotalMembers = document.getElementById("statTotalMembers");
  const statOngoingProjects = document.getElementById("statOngoingProjects");
  const statCompletedProjects = document.getElementById("statCompletedProjects");

  // Modal References
  const modal = document.getElementById("projectModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalDetails = document.getElementById("modalDetails");
  const teamList = document.getElementById("teamList");
  const closeBtn = document.getElementById("closeModal");
  const closeSpan = document.querySelector(".modal .close");

  // API Base URL Resolver
  const getApiBaseUrl = () => {
    const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:';
    return isLocal ? 'http://localhost:3000' : '';
  };

  // Helper: Safe JSON Array Parser
  const safeJsonParseArray = (val, fallback = []) => {
    if (!val) return fallback;
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return fallback;
      if (trimmed.startsWith('[')) {
        try {
          let parsed = JSON.parse(trimmed);
          if (typeof parsed === 'string') parsed = JSON.parse(parsed);
          if (Array.isArray(parsed)) return parsed;
        } catch (e) {}
      }
      return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }
    return fallback;
  };

  // Helper: Team Member Parser
  const parseTeamMembers = (rawTeam) => {
    if (!rawTeam) return [];
    if (Array.isArray(rawTeam)) {
      return rawTeam.map(m => {
        if (typeof m === 'string') return { name: m.trim(), image: '', role: 'Contributor' };
        if (typeof m === 'object' && m !== null) {
          return {
            name: m.name || m.fullName || m.memberName || 'Member',
            image: m.image || m.avatar || m.profile_image || '',
            role: m.role || m.leadership_role || 'Contributor'
          };
        }
        return { name: 'Member', image: '', role: 'Contributor' };
      });
    }
    if (typeof rawTeam === 'string') {
      const trimmed = rawTeam.trim();
      if (trimmed.startsWith('[')) {
        try {
          const parsed = JSON.parse(trimmed);
          return parseTeamMembers(parsed);
        } catch (e) {}
      }
      return trimmed.split(',').map(n => ({ name: n.trim(), image: '', role: 'Contributor' })).filter(m => m.name);
    }
    return [];
  };

  // Helper: Title String Normalizer
  const normalizeTitleStr = (t) => {
    if (!t) return '';
    return String(t).toLowerCase().replace(/[^a-z0-9]/g, '').trim();
  };

  // ── Fetch Projects from Central Database API ──
  const fetchProjects = async () => {
    // Show Loading Skeleton on Initial Fetch
    if (allProjects.length === 0 && loadingSkeleton) {
      loadingSkeleton.style.display = "grid";
      if (errorState) errorState.style.display = "none";
      if (emptyState) emptyState.style.display = "none";
    }

    const deletedSet = (() => {
      try {
        return new Set(JSON.parse(localStorage.getItem('nexus_deleted_project_ids') || '[]'));
      } catch {
        return new Set();
      }
    })();

    const isProjectDeleted = (pId, pTitle) => {
      const idStr = String(pId || '').toLowerCase().trim();
      const rawTitle = String(pTitle || '').toLowerCase().trim();
      const normTitle = normalizeTitleStr(pTitle);

      if (idStr && deletedSet.has(idStr)) return true;
      if (rawTitle && deletedSet.has(rawTitle)) return true;
      if (normTitle && deletedSet.has(normTitle)) return true;
      return false;
    };

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/projects/public?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store' }
      });

      if (response.ok) {
        const result = await response.json();
        const apiProjects = result?.projects || result?.data;

        if (Array.isArray(apiProjects)) {
          const loadedItems = [];
          const tempMap = {};

          apiProjects.forEach(p => {
            if (p.deleted_at || p.deletedAt) return;
            if (isProjectDeleted(p.id, p.title)) return;

            const vis = (p.visibility || 'public').toLowerCase().trim();
            const status = (p.status || 'in_progress').toLowerCase().trim();

            // Strict Filter: Exclude private, draft, pending_review, or rejected projects
            if (vis === 'private' || vis === 'hidden') return;
            if (['draft', 'pending_review', 'rejected'].includes(status)) return;

            const name = p.title || 'Untitled Project';
            const catRaw = (p.category || 'Advanced').toLowerCase().trim();
            const parsedTeam = parseTeamMembers(p.team_members || p.teamMembers || p.team);

            // Ongoing flag: project is ongoing if category says 'ongoing' OR status is not completed
            const isOngoing = catRaw.includes('ongoing') || !['completed', 'done', 'finished'].includes(status);

            // Difficulty category mapping (exclude 'ongoing' from being treated as ADVANCED)
            let diffCat = 'ADVANCED';
            if (catRaw.includes('beginner')) diffCat = 'BEGINNER';
            else if (catRaw.includes('intermediate')) diffCat = 'INTERMEDIATE';
            else if (catRaw.includes('ongoing')) diffCat = 'ADVANCED'; // ongoing projects use their own section

            const item = {
              id: p.id,
              title: name,
              summary: p.summary || p.card_summary || p.cardSummary || p.description || p.desc || '',
              details: p.description || p.desc || p.details || p.summary || '',
              challenges: p.challenges || '',
              futureImprovements: p.future_improvements || p.futureImprovements || '',
              architecture: p.architecture || '',
              features: safeJsonParseArray(p.features),
              techStack: safeJsonParseArray(p.tech_stack || p.techStack || p.tech),
              completion: Number(p.completion || p.completion_percentage || (status === 'completed' ? 100 : 50)),
              visit: p.live_demo_url || p.live_demo || p.live || '',
              github: p.github_url || p.github || '',
              apk: p.apk_url || p.apk || p.apkUrl || '',
              team: parsedTeam,
              category: p.category || diffCat,
              difficulty: diffCat,
              status: status,
              isOngoing: isOngoing,
              domain: p.domain || 'Engineering',
              thumbnail: p.thumbnail || '',
              views: p.views || 0,
              likes: p.likes || 0
            };

            loadedItems.push(item);
            tempMap[name] = item;
            if (p.id) tempMap[p.id] = item;
          });

          allProjects = loadedItems;
          masterProjectsMap = tempMap;

          // Hide Loading / Error
          if (loadingSkeleton) loadingSkeleton.style.display = "none";
          if (errorState) errorState.style.display = "none";

          // Update Stats & Render Categories
          updateStatistics();
          renderFilteredProjects();
          return;
        }
      }
      throw new Error("Failed to parse projects payload");
    } catch (err) {
      console.warn("API load notice:", err.message);
      if (allProjects.length === 0) {
        if (loadingSkeleton) loadingSkeleton.style.display = "none";
        if (errorState) errorState.style.display = "block";
      }
    }
  };

  // ── Calculate & Update Statistics ──
  const updateStatistics = () => {
    const totalProjects = allProjects.length;
    let ongoingCount = 0;
    let completedCount = 0;
    const uniqueMembers = new Set();

    allProjects.forEach(p => {
      const st = (p.status || '').toLowerCase();
      if (st === 'completed') {
        completedCount++;
      } else {
        ongoingCount++;
      }

      if (Array.isArray(p.team)) {
        p.team.forEach(m => {
          if (m.name && m.name.trim()) uniqueMembers.add(m.name.trim().toLowerCase());
        });
      }
    });

    if (statTotalProjects) statTotalProjects.textContent = `${totalProjects}+`;
    if (statTotalMembers) statTotalMembers.textContent = `${Math.max(uniqueMembers.size, 15)}+`;
    if (statOngoingProjects) statOngoingProjects.textContent = `${ongoingCount}`;
    if (statCompletedProjects) statCompletedProjects.textContent = `${completedCount}`;
  };

  // ── Filter & Search Logic ──
  const getFilteredProjects = () => {
    const q = searchQuery.toLowerCase().trim();

    return allProjects.filter(p => {
      // 1. Filter Tab Matching
      if (activeFilter === 'beginner' && p.difficulty !== 'BEGINNER') return false;
      if (activeFilter === 'intermediate' && p.difficulty !== 'INTERMEDIATE') return false;
      if (activeFilter === 'advanced' && p.difficulty !== 'ADVANCED') return false;
      if (activeFilter === 'ongoing' && (p.status === 'completed')) return false;
      if (activeFilter === 'completed' && (p.status !== 'completed')) return false;

      // 2. Search Query Matching
      if (q) {
        const titleMatch = p.title.toLowerCase().includes(q);
        const summaryMatch = p.summary.toLowerCase().includes(q);
        const detailsMatch = p.details.toLowerCase().includes(q);
        const domainMatch = p.domain.toLowerCase().includes(q);
        const catMatch = (p.category || '').toLowerCase().includes(q);
        const techMatch = (p.techStack || []).some(t => String(t).toLowerCase().includes(q));
        const teamMatch = (p.team || []).some(m => (m.name || '').toLowerCase().includes(q));

        if (!titleMatch && !summaryMatch && !detailsMatch && !domainMatch && !catMatch && !techMatch && !teamMatch) {
          return false;
        }
      }

      return true;
    });
  };

  // ── Create Individual Project Card Node ──
  const createProjectCard = (project) => {
    const card = document.createElement("div");
    card.className = "project-card";

    const title = project.title || 'Untitled Project';
    const summary = project.summary || project.details || 'No summary available for this project.';
    const thumbnail = project.thumbnail || '';
    
    // Status Badge Configuration
    const st = (project.status || 'in_progress').toLowerCase();
    let statusLabel = 'ONGOING';
    let statusClass = 'status-ongoing';
    if (st === 'completed') {
      statusLabel = 'COMPLETED';
      statusClass = 'status-completed';
    } else if (st === 'planning' || st === 'upcoming') {
      statusLabel = 'UPCOMING';
      statusClass = 'status-upcoming';
    } else if (st === 'on_hold') {
      statusLabel = 'ON HOLD';
      statusClass = 'status-onhold';
    }

    // Difficulty Badge Configuration
    const diff = (project.difficulty || 'ADVANCED').toUpperCase();
    let diffClass = 'diff-advanced';
    if (diff === 'BEGINNER') diffClass = 'diff-beginner';
    else if (diff === 'INTERMEDIATE') diffClass = 'diff-intermediate';

    // Tech Tags
    const techList = Array.isArray(project.techStack) ? project.techStack : [];
    const techPillsHtml = techList.slice(0, 4).map(t => {
      const name = typeof t === 'string' ? t : (t.name || t);
      return `<span class="card-tech-tag">${name}</span>`;
    }).join('');

    // Team Avatars Stack & Label
    const teamList = Array.isArray(project.team) ? project.team : [];
    let teamHtml = '';
    if (teamList.length > 0) {
      const avatarItems = teamList.slice(0, 3).map(m => {
        const initial = ((m.name || 'M')[0] || 'M').toUpperCase();
        if (m.image) {
          return `<img src="${m.image}" alt="${m.name}" class="team-mini-avatar" onerror="this.onerror=null; this.outerHTML='<span class=\\'team-mini-fallback\\'>${initial}</span>';">`;
        }
        return `<span class="team-mini-fallback">${initial}</span>`;
      }).join('');
      
      const extraCount = teamList.length > 3 ? `<span class="team-extra-count">+${teamList.length - 3}</span>` : '';
      const firstMemberName = teamList[0]?.name || 'Team Nexus';
      const teamText = teamList.length === 1 ? firstMemberName : `${firstMemberName} & ${teamList.length - 1} more`;

      teamHtml = `
        <div class="card-team-info">
          <div class="team-avatar-stack">
            ${avatarItems}
            ${extraCount}
          </div>
          <span class="team-label" title="${teamText}">${teamText}</span>
        </div>
      `;
    } else {
      teamHtml = `
        <div class="card-team-info">
          <span class="team-label">👤 Team Nexus</span>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="card-media-wrap">
        ${thumbnail ? 
          `<img src="${thumbnail}" alt="${title}" class="card-img" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">` : ''}
        <div class="card-img-placeholder" style="${thumbnail ? 'display:none;' : 'display:flex;'}">
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          <span>Sun Nexus Project</span>
        </div>
        <div class="card-badge-overlay">
          <span class="card-status-badge ${statusClass}">${statusLabel}</span>
          <span class="card-diff-badge ${diffClass}">${diff}</span>
        </div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${title}</h3>
        <p class="card-summary">${summary}</p>
        ${techList.length > 0 ? `<div class="card-tech-list">${techPillsHtml}</div>` : ''}
        <div class="card-footer-row">
          ${teamHtml}
          <button type="button" class="view-details-btn" data-project="${title}">
            <span>View Project</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      </div>
    `;

    return card;
  };

  // ── Render Category Accordions & Cards ──
  const renderFilteredProjects = () => {
    if (!accordionsContainer) return;
    accordionsContainer.innerHTML = "";

    const filtered = getFilteredProjects();

    if (filtered.length === 0) {
      if (emptyState) emptyState.style.display = "block";
      return;
    }
    if (emptyState) emptyState.style.display = "none";

    let renderedCount = 0;

    // 1. Advanced Level Projects — Displayed DIRECTLY at Top (No Accordion Dropdown)
    // Exclude projects whose category is 'Ongoing' (they belong in the Ongoing accordion)
    const advancedProjects = filtered.filter(p => p.difficulty === 'ADVANCED' && !(p.category || '').toLowerCase().includes('ongoing'));
    if (advancedProjects.length > 0 && (activeFilter === 'all' || activeFilter === 'advanced')) {
      renderedCount++;
      const advWrap = document.createElement("div");
      advWrap.className = "direct-projects-section";
      advWrap.style.marginBottom = "36px";

      advWrap.innerHTML = `
        <div class="direct-section-header">
          <div class="direct-section-title-wrap">
            <div class="category-icon-box">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71 1.26-1.5 1.5-2.5h-4.5z"></path><path d="M12 15l-3-3 7.5-7.5c.78-.78 2.05-.78 2.83 0l.17.17c.78.78.78 2.05 0 2.83L12 15z"></path></svg>
            </div>
            <div class="category-title-wrap">
              <div class="category-title-row">
                <h2 class="category-name">Advanced Level Projects</h2>
                <span class="category-count-pill">${advancedProjects.length} ${advancedProjects.length === 1 ? 'Project' : 'Projects'}</span>
              </div>
              <p class="category-desc">High-impact enterprise & AI engineering projects built for real-world scaling.</p>
            </div>
          </div>
        </div>
      `;

      const grid = document.createElement("div");
      grid.className = "cards-grid";
      grid.style.marginTop = "20px";

      advancedProjects.forEach(proj => {
        grid.appendChild(createProjectCard(proj));
      });

      advWrap.appendChild(grid);
      accordionsContainer.appendChild(advWrap);
    }

    // 2. Accordion Definitions for Remaining Categories (Beginner, Intermediate, Ongoing)
    const accordionCategories = [
      {
        id: 'beginner',
        title: 'Beginner Level',
        desc: 'Projects designed to help members build practical technology foundations.',
        iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',
        filterFn: (p) => p.difficulty === 'BEGINNER'
      },
      {
        id: 'intermediate',
        title: 'Intermediate Level',
        desc: 'Core application projects expanding architectural and full-stack capabilities.',
        iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
        filterFn: (p) => p.difficulty === 'INTERMEDIATE'
      },
      {
        id: 'ongoing',
        title: 'Ongoing Projects',
        desc: 'Active projects currently under development by the Nexus community.',
        iconSvg: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
        // Match by category 'ongoing' OR by status not being completed
        filterFn: (p) => (p.category || '').toLowerCase().includes('ongoing') || p.isOngoing
      }
    ];

    accordionCategories.forEach(cat => {
      // Filter tab checks
      if (activeFilter === 'beginner' && cat.id !== 'beginner') return;
      if (activeFilter === 'intermediate' && cat.id !== 'intermediate') return;
      if (activeFilter === 'ongoing' && cat.id !== 'ongoing') return;
      if (activeFilter === 'advanced') return;

      const catProjects = filtered.filter(cat.filterFn);
      if (catProjects.length === 0) return;

      renderedCount++;
      const isOpen = accordionOpenState[cat.id] !== false;

      // Accordion Wrapper
      const accordion = document.createElement("div");
      accordion.className = `project-category-accordion ${isOpen ? 'open' : ''}`;
      accordion.id = `cat-accordion-${cat.id}`;

      // Accordion Header
      const header = document.createElement("div");
      header.className = "category-accordion-header";
      header.setAttribute("role", "button");
      header.setAttribute("tabindex", "0");
      header.setAttribute("aria-expanded", isOpen ? "true" : "false");

      header.innerHTML = `
        <div class="category-header-left">
          <div class="category-icon-box">${cat.iconSvg}</div>
          <div class="category-title-wrap">
            <div class="category-title-row">
              <h2 class="category-name">${cat.title}</h2>
              <span class="category-count-pill">${catProjects.length} ${catProjects.length === 1 ? 'Project' : 'Projects'}</span>
            </div>
            <p class="category-desc">${cat.desc}</p>
          </div>
        </div>
        <div class="category-chevron-wrap">
          <svg class="chevron-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      `;

      // Accordion Content Body (Card Grid)
      const content = document.createElement("div");
      content.className = "category-accordion-content";
      
      const grid = document.createElement("div");
      grid.className = "cards-grid";

      catProjects.forEach(proj => {
        grid.appendChild(createProjectCard(proj));
      });

      content.appendChild(grid);
      accordion.appendChild(header);
      accordion.appendChild(content);

      // Accordion Click & Keyboard Event Handlers
      const toggleFunc = () => {
        const nextState = !accordion.classList.contains('open');
        accordion.classList.toggle('open');
        header.setAttribute("aria-expanded", nextState ? "true" : "false");
        accordionOpenState[cat.id] = nextState;
      };

      header.addEventListener("click", toggleFunc);
      header.addEventListener("keydown", (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleFunc();
        }
      });

      accordionsContainer.appendChild(accordion);
    });

    if (renderedCount === 0 && emptyState) {
      emptyState.style.display = "block";
    }
  };

  // ── Event Handlers: Search Input ──
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchQuery ? "block" : "none";
      }
      renderFilteredProjects();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener("click", () => {
      searchQuery = "";
      if (searchInput) searchInput.value = "";
      clearSearchBtn.style.display = "none";
      renderFilteredProjects();
    });
  }

  // ── Event Handlers: Filter Pills ──
  if (filterPillsContainer) {
    filterPillsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (btn) {
        filterPillsContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.getAttribute("data-filter") || 'all';
        renderFilteredProjects();
      }
    });
  }

  // ── Event Handlers: Reset & Retry ──
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
      searchQuery = "";
      activeFilter = "all";
      if (searchInput) searchInput.value = "";
      if (clearSearchBtn) clearSearchBtn.style.display = "none";
      if (filterPillsContainer) {
        filterPillsContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        const allBtn = filterPillsContainer.querySelector('[data-filter="all"]');
        if (allBtn) allBtn.classList.add("active");
      }
      renderFilteredProjects();
    });
  }

  if (retryFetchBtn) {
    retryFetchBtn.addEventListener("click", () => {
      fetchProjects();
    });
  }

  // ── Modal Details Handler ──
  function showProjectModal(projectName) {
    let data = masterProjectsMap[projectName];
    if (!data) return;

    // Log View Analytics to Backend API
    if (data.id) {
      fetch(`${getApiBaseUrl()}/api/projects/${data.id}/view`, { method: 'POST' }).catch(() => {});
    }

    if (modalTitle) modalTitle.textContent = data.title || projectName;
    
    let detailsHtml = '';

    if (data.thumbnail) {
      detailsHtml += `<div style="margin-bottom: 24px; border-radius: 16px; overflow: hidden; border: 1.5px solid rgba(203, 221, 233, 0.2); background: rgba(0, 0, 0, 0.35); display: flex; justify-content: center; align-items: center; box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3); padding: 8px;"><img src="${data.thumbnail}" alt="${data.title}" style="width: 100%; max-height: 440px; height: auto; object-fit: contain; border-radius: 12px; display: block;"></div>`;
    }

    // Category, Status & Progress Bar Header
    const st = (data.status || 'in_progress').toLowerCase();
    const statusLabel = st === 'completed' ? 'COMPLETED' : (st === 'planning' ? 'PLANNING' : 'IN PROGRESS');
    const compVal = Number(data.completion || (st === 'completed' ? 100 : 50));

    detailsHtml += `
      <div class="modal-badge-row" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 22px;">
        <span class="modal-cat-badge">${(data.category || 'ADVANCED').toUpperCase()}</span>
        <span class="modal-status-badge status-${st.replace(/_/g, '-')}">
          <span class="status-dot"></span>
          STATUS: ${statusLabel}
        </span>
        <div class="modal-progress-bar-wrap" style="display: inline-flex; align-items: center; gap: 10px; margin-left: auto; background: rgba(203,221,233,0.08); padding: 6px 16px; border-radius: 999px; border: 1px solid rgba(203,221,233,0.15);">
          <span style="font-size: 11.5px; font-weight: 700; color: var(--text-muted, #8ea6bc); letter-spacing: 0.05em;">PROGRESS</span>
          <div style="width: 75px; height: 6px; background: rgba(203, 221, 233, 0.2); border-radius: 999px; overflow: hidden;">
            <div style="width: ${compVal}%; height: 100%; background: linear-gradient(90deg, #2872A1 0%, #22c55e 100%); border-radius: 999px;"></div>
          </div>
          <span style="font-size: 12px; font-weight: 700; color: var(--text-primary);">${compVal}%</span>
        </div>
      </div>
    `;

    // Project Description
    detailsHtml += `
      <div class="modal-description-box" style="margin-bottom: 24px;">
        <p style="font-size: 14.5px; line-height: 1.7; color: var(--text-secondary); margin: 0; font-weight: 400;">
          ${data.details || data.description || data.summary || ''}
        </p>
      </div>
    `;
    
    // Key Challenges & Technical Solutions
    if (data.challenges) {
      detailsHtml += `
        <div class="modal-challenges-box" style="margin-bottom: 24px; padding: 18px 22px; border-radius: 14px; border: 1px solid rgba(74, 144, 194, 0.25); background: rgba(40, 114, 161, 0.05);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 16px;">⚡</span>
            <strong style="color: var(--nexus-secondary, #4A90C2); font-size: 13px; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase;">Key Challenges & Solutions</strong>
          </div>
          <p style="margin: 0; font-size: 13.5px; line-height: 1.6; color: var(--text-secondary);">${data.challenges}</p>
        </div>
      `;
    }

    // Tech Stack
    if (Array.isArray(data.techStack) && data.techStack.length > 0) {
      detailsHtml += `
        <div class="modal-tech-section" style="margin-bottom: 26px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
            <span style="font-size: 14px;">🛠️</span>
            <strong style="color: var(--text-primary); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700;">TECHNOLOGY STACK</strong>
          </div>
          <div class="modal-tech-pills" style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${data.techStack.map(t => {
              const name = typeof t === 'string' ? t : (t.name || t);
              return `<span class="modal-tech-tag">${name}</span>`;
            }).join('')}
          </div>
        </div>
      `;
    }

    // Action Buttons
    const apkLink = data.apk || data.apk_url || data.apkUrl || '';
    if (data.visit || data.github || apkLink) {
      detailsHtml += `<div class="modal-action-buttons" style="margin-top: 24px; margin-bottom: 28px; display: flex; gap: 14px; flex-wrap: wrap;">`;
      if (data.visit) {
        detailsHtml += `<a href="${data.visit}" target="_blank" class="modal-btn-live">🌐 Live Demo ↗</a>`;
      }
      if (apkLink) {
        detailsHtml += `<a href="${apkLink}" target="_blank" class="modal-btn-apk">📱 Download APK ↗</a>`;
      }
      if (data.github) {
        detailsHtml += `<a href="${data.github}" target="_blank" class="modal-btn-github">💻 GitHub Repository ↗</a>`;
      }
      detailsHtml += `</div>`;
    }

    if (modalDetails) modalDetails.innerHTML = detailsHtml;

    // Project Team Roster
    const teamSection = document.getElementById("modalTeamSection");
    const teamCountBadge = document.getElementById("teamCountBadge");
    if (teamList) teamList.innerHTML = "";

    if (Array.isArray(data.team) && data.team.length > 0) {
      if (teamSection) teamSection.style.display = "block";
      if (teamCountBadge) teamCountBadge.textContent = `${data.team.length} ${data.team.length === 1 ? 'Member' : 'Members'}`;

      data.team.forEach(member => {
        const mName = member.name || member.fullName || 'Member';
        const mImage = member.image || member.avatar || '';
        const mRole = member.role || 'Contributor';
        const initial = ((mName[0] || 'M')[0] || 'M').toUpperCase();

        const div = document.createElement("div");
        div.className = "team-member";
        
        const imgHtml = mImage 
          ? `<img src="${mImage}" alt="${mName}" class="member-avatar-img" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'member-avatar-fallback\\'>${initial}</div>';">` 
          : `<div class="member-avatar-fallback">${initial}</div>`;

        div.innerHTML = `
          <div class="member-avatar-wrap">
            ${imgHtml}
          </div>
          <div class="member-info">
            <h5 class="member-name" title="${mName}">${mName}</h5>
            <span class="member-role-badge">
              <span class="member-role-dot"></span>
              ${mRole}
            </span>
          </div>
        `;
        if (teamList) teamList.appendChild(div);
      });
    } else {
      if (teamSection) teamSection.style.display = "none";
    }

    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }

  // Global Delegated Click Handler for "View Project" buttons
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".view-details-btn");
    if (btn) {
      e.preventDefault();
      const projectName = btn.getAttribute("data-project");
      if (projectName) showProjectModal(projectName);
    }
  });

  const closeModalFunc = () => {
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModalFunc);
  if (closeSpan) closeSpan.addEventListener("click", closeModalFunc);
  window.addEventListener("click", (e) => { if (e.target === modal) closeModalFunc(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModalFunc(); });

  // ── Initial Fetch & Real-time Listeners ──
  fetchProjects();
  setInterval(fetchProjects, 8000);
  window.addEventListener('focus', fetchProjects);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') fetchProjects();
  });
  window.addEventListener('storage', (e) => {
    if (['nexus_projects_updated', 'nexus_system_projects', 'nexus_data_updated', 'nexus_deleted_project_ids'].includes(e.key)) {
      fetchProjects();
    }
  });
  window.addEventListener('nexus-projects-updated', fetchProjects);
  window.addEventListener('nexus-data-updated', fetchProjects);
});