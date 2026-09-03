import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const modalHtmlAndScript = `  <!-- Nexus Hiring Modal -->
  <div id="hiringModal" class="nexus-modal">
    <div class="nexus-modal-content animate__animated animate__zoomIn">
      <button class="modal-close-btn" id="closeHiring" aria-label="Close modal" title="Close">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin: auto; pointer-events: none;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      
      <div class="modal-body-hiring">
        <div class="hero-kicker" style="margin-bottom: 14px;">
          <span class="kicker-dot"></span>
          JOIN THE CORE TEAM
        </div>
        
        <h2 class="hiring-title">
          <span class="title-top">NEXUS IS</span>
          <span class="gradient-text">HIRING!</span>
        </h2>
        
        <div class="hiring-divider">
          <span class="line"></span>
          <span class="dot"></span>
        </div>
        
        <p class="hiring-text">
          We're seeking the next generation of pioneers to forge the future of technology. Are you ready to build, innovate, and lead?
        </p>
        
        <div class="hiring-roles">
          <div class="role-tag"><span class="role-dot">●</span> AI & ML</div>
          <div class="role-tag"><span class="role-dot">●</span> Full Stack Dev</div>
        </div>
        
        <div class="modal-actions">
          <a href="contact.html" class="join-nexus-btn">
            <svg class="btn-sparkle-icon" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="min-width: 20px; width: 20px; height: 20px; flex-shrink: 0;"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"></path></svg>
            <span>JOIN NEXUS NOW</span>
            <svg class="btn-arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="min-width: 20px; width: 20px; height: 20px; flex-shrink: 0;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </a>
        </div>
      </div>

      <div class="modal-illustration-col">
        <div class="modal-hero-image-wrap">
          <img 
            src="https://res.cloudinary.com/dseg9nty3/image/upload/v1785057138/IMG-20251111-WA0041_rfg6od.jpg" 
            alt="Sun Nexus Team" 
            class="modal-hero-image" 
          />
          <div class="modal-hero-image-overlay"></div>
        </div>
      </div>

      <div class="modal-footer-decoration">
        <div class="scanner-line"></div>
      </div>
    </div>
  </div>

  <script>
    // Hiring Modal
    window.addEventListener('load', () => {
      const modal = document.getElementById('hiringModal');
      const closeBtn = document.getElementById('closeHiring');
      if (!modal) return;

      setTimeout(() => {
        modal.classList.add('active');
        document.body.classList.add('modal-active');
        document.body.style.overflow = 'hidden';
      }, 1000);

      const closeModal = () => {
        modal.classList.remove('active');
        document.body.classList.remove('modal-active');
        document.body.style.overflow = '';
      };

      if (closeBtn) closeBtn.addEventListener('click', closeModal);

      window.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
          closeModal();
        }
      });
    });
  </script>`;

// Insert before the scripts
const target = '<script src="js/stat-cards.js">';
if (html.includes(target) && !html.includes('id="hiringModal"')) {
  html = html.replace(target, modalHtmlAndScript + '\n\n  ' + target);
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('✓ Restored hiring modal with high-opacity backdrop and keyboard/click dismiss handlers');
} else {
  console.log('Target script tag not found or modal already present');
}
