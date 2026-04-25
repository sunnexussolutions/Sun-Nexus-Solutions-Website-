/* ════════════════════════════════════════════════════
   SUN NEXUS SOLUTIONS — GLOBAL NAVIGATION LOGIC
   Handles: Active states, Mobile Toggle
════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Nav-Active.js initialized');

    // 1. Active Page Highlighting
    const navItems = document.querySelectorAll('.nav-links li');
    if (navItems.length > 0) {
        const path = window.location.pathname;
        const currentPage = path.split('/').pop() || 'home.html';
        
        navItems.forEach(li => {
            if (li.classList.contains('nav-theme-toggle')) return;
            
            const link = li.querySelector('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            // Remove active from all first
            li.classList.remove('active');
            
            if (href === currentPage || 
                (currentPage === '' && href === 'home.html') ||
                (currentPage === 'home.html' && href === 'home.html') ||
                (href.includes(currentPage) && currentPage !== '')) {
                li.classList.add('active');
            }
        });
    }

    // 2. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        console.log('Menu Toggle and Nav Links found');
        
        // Remove any existing listeners by cloning (to be safe if script runs twice)
        const newToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newToggle, menuToggle);
        
        newToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Menu Toggle clicked');
            navLinks.classList.toggle('active');
            
            const isActive = navLinks.classList.contains('active');
            newToggle.textContent = isActive ? '✕' : '☰';
            newToggle.style.transform = isActive ? 'rotate(90deg)' : 'rotate(0deg)';
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active')) {
                if (!navLinks.contains(e.target) && !newToggle.contains(e.target)) {
                    navLinks.classList.remove('active');
                    newToggle.textContent = '☰';
                    newToggle.style.transform = 'rotate(0deg)';
                }
            }
        });

        // Prevent clicks inside navLinks from closing the menu
        navLinks.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    } else {
        console.warn('Navbar elements not found:', { menuToggle, navLinks });
    }
});

