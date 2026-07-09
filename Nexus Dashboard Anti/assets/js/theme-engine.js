/* ── Theme Engine ── */
(function () {
  // Apply saved theme immediately (before paint) to avoid flash
  const saved = localStorage.getItem('nexus-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    // Sync button state to current theme
    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('nexus-theme', theme);
    }

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light');
    });

    // Navbar dynamic scroll scaling and glassmorphism styling
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      function handleNavbarScroll() {
        if (window.scrollY > 30) {
          navbar.classList.add('navbar-scrolled');
        } else {
          navbar.classList.remove('navbar-scrolled');
        }
      }
      window.addEventListener('scroll', handleNavbarScroll, { passive: true });
      handleNavbarScroll(); // Initial check on page load
    }
  });
})();
