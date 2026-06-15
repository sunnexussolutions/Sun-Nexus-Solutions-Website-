/* ════════════════════════════════════════════════════
   SUN NEXUS SOLUTIONS — GLOBAL NAVIGATION LOGIC
   Handles: Active states, Mobile Toggle
   Version 2.1 — Authoritative Protocol
   ════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Nexus Navigation Engine: Activated');

    // ── 1. Active Page Protocol ─────────────────────────────────────────────
    const navItems = document.querySelectorAll('.nav-links li');
    if (navItems.length > 0) {
        const path = window.location.pathname;
        const currentPage = path.split('/').pop() || 'index.html';
        
        navItems.forEach(li => {
            if (li.classList.contains('nav-theme-toggle')) return;
            
            const link = li.querySelector('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            li.classList.remove('active');
            
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html') ||
                (href.includes(currentPage) && currentPage !== '')) {
                li.classList.add('active');
            }
        });
    }

    // ── 2. Mobile Menu Toggle Protocol ──────────────────────────────────────
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        // Robust state management
        function toggleMenu(forceClose = false) {
            const isOpening = forceClose ? false : !navLinks.classList.contains('active');
            
            if (isOpening) {
                navLinks.classList.add('active');
                menuToggle.textContent = '✕';
                menuToggle.style.transform = 'rotate(90deg)';
                menuToggle.setAttribute('aria-expanded', 'true');
                document.body.style.overflow = 'hidden'; // Prevent scroll when menu open
            } else {
                navLinks.classList.remove('active');
                menuToggle.textContent = '☰';
                menuToggle.style.transform = 'rotate(0deg)';
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = 'auto';
            }
        }

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking links (important for anchors/UX)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => toggleMenu(true));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                    toggleMenu(true);
                }
            }
        });

        // ESC key support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu(true);
            }
        });
    }
});
