/* ════════════════════════════════════════════════════
   SUN NEXUS SOLUTIONS — GLOBAL NAVIGATION LOGIC
   Handles: Active states, Dropdown menus, Mobile Toggle
   Version 3.1 — Unified & Dropdown-Enabled Protocol
   ════════════════════════════════════════════════════ */

function initNexusNavigation() {
    // ── 1. Active Page & Dropdown Protocol ─────────────────────────────────
    const navItems = document.querySelectorAll('.nav-links > li');
    if (navItems.length > 0) {
        const path = window.location.pathname;
        const currentPage = path.split('/').pop() || 'index.html';
        
        navItems.forEach(li => {
            if (li.classList.contains('nav-theme-toggle')) return;
            
            const links = li.querySelectorAll('a');
            let isItemActive = false;
            
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href === currentPage || 
                    (currentPage === '' && href === 'index.html') ||
                    (currentPage === 'index.html' && href === 'index.html') ||
                    (href && currentPage !== '' && href.includes(currentPage))) {
                    isItemActive = true;
                    link.classList.add('sub-active');
                } else {
                    link.classList.remove('sub-active');
                }
            });

            if (isItemActive) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });
    }

    // ── 2. Dropdown Hover & Touch Protocol with Graceful Delay ───────────────
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        let closeTimer = null;

        dropdown.addEventListener('mouseenter', () => {
            if (closeTimer) clearTimeout(closeTimer);
            dropdown.classList.add('open');
        });

        dropdown.addEventListener('mouseleave', () => {
            if (closeTimer) clearTimeout(closeTimer);
            closeTimer = setTimeout(() => {
                dropdown.classList.remove('open');
            }, 150); // 220ms smooth & responsive delay time before closing dropdown
        });

        if (toggle) {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    // On mobile, click toggles sub-menu
                    dropdown.classList.toggle('open');
                }
            });
        }
    });

    // ── 3. Mobile Menu Toggle Protocol (Authoritative Engine) ───────────────
    const oldToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (oldToggle && navLinks) {
        // Clone and replace menuToggle to strip any duplicate/conflicting click listeners
        const menuToggle = oldToggle.cloneNode(true);
        oldToggle.parentNode.replaceChild(menuToggle, oldToggle);

        function toggleMenu(forceClose = false) {
            const isOpening = forceClose ? false : !navLinks.classList.contains('active');
            
            if (isOpening) {
                navLinks.classList.add('active');
                menuToggle.textContent = '✕';
                menuToggle.style.transform = 'rotate(90deg)';
                menuToggle.setAttribute('aria-expanded', 'true');
            } else {
                navLinks.classList.remove('active');
                menuToggle.textContent = '☰';
                menuToggle.style.transform = 'rotate(0deg)';
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }

        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking navigation links (except dropdown triggers)
        navLinks.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(true);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                    toggleMenu(true);
                }
            }
        });

        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu(true);
            }
        });

        // Close menu automatically if window resized above mobile breakpoint (992px)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && navLinks.classList.contains('active')) {
                toggleMenu(true);
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNexusNavigation);
} else {
    initNexusNavigation();
}
