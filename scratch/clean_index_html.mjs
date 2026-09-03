import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

// Replace everything from line 400 down with the clean footer and scripts
const targetIndex = html.indexOf('<!-- Ready to Forge the Future CTA Section');
if (targetIndex !== -1) {
  const cleanEnd = `  <!-- ════════════════════════════════════════════════════
       FOOTER SECTION — Nexus Design System 3.0
       ════════════════════════════════════════════════════ -->
  <footer class="footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="footer-logo">
          <div class="footer-logo-wrap">
            <img
              src="https://res.cloudinary.com/dseg9nty3/image/upload/v1784890597/7975077779d60f44fd5ccc4a43a38b32c8a7693eb2b3aeb58b2e475a8cf2279b_d1te0e.png"
              alt="Sun Nexus Logo" class="footer-logo-img" />
          </div>
          <span class="footer-logo-name">Sun Nexus Solutions</span>
        </a>
        <p class="footer-tagline">Empowering students with real-world tech skills, projects, and mentorship at Sandip University, Nashik.</p>
        <div class="footer-socials">
          <a href="https://www.linkedin.com/company/sunnexussolutions/" class="footer-social-btn" target="_blank" rel="noopener noreferrer">
            <svg class="footer-social-svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
            <span>LinkedIn</span>
          </a>
          <a href="https://www.instagram.com/sun_nexus_solutions/" class="footer-social-btn" target="_blank" rel="noopener noreferrer">
            <svg class="footer-social-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            <span>Instagram</span>
          </a>
          <a href="https://github.com/sunnexussolutions" class="footer-social-btn" target="_blank" rel="noopener noreferrer">
            <svg class="footer-social-svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">Platform</div>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about-us.html">About Us</a></li>
          <li><a href="alumni.html">Our Alumni</a></li>
          <li><a href="project.html">Projects</a></li>
          <li><a href="events.html">Events</a></li>
          <li><a href="mentor-ship.html">Mentorship</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">Resources</div>
        <ul>
          <li><a href="https://sun-nexus-solutions-website-urs3.vercel.app/">Dashboard</a></li>
          <li><a href="Nexus Dashboard Anti/courses.html">Courses</a></li>
          <li><a href="Nexus Dashboard Anti/leaderboard.html">Leaderboard</a></li>
          <li><a href="Nexus Dashboard Anti/quiz.html">Quizzes</a></li>
          <li><a href="Nexus Dashboard Anti/certificate.html">Certificates</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <div class="footer-col-title">Contact</div>
        <div class="footer-contact-item">
          <div class="footer-contact-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
          <div class="footer-contact-text"><a href="mailto:sunnexussolutions@gmail.com">sunnexussolutions@gmail.com</a></div>
        </div>
        <div class="footer-contact-item">
          <div class="footer-contact-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
          <div class="footer-contact-text">School of Computer Science &amp; Engineering,<br>Sandip University, Nashik</div>
        </div>
        <div class="footer-contact-item">
          <div class="footer-contact-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="footer-contact-text">Mon – Sat, 9 AM – 6 PM IST</div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="footer-bottom-inner">
        <p class="footer-bottom-copy">© 2025 <span>Sun Nexus Solutions</span>. All Rights Reserved.</p>
        <div class="footer-badge"><span class="badge-dot">●</span> Active Platform</div>
        <div class="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script>
    document.addEventListener("DOMContentLoaded", () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate__animated", "animate__fadeInUp");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll(".val-card, .leader-card, .logbook-featured-card, .why-icon-box, .stat-grid-card").forEach(el => observer.observe(el));
    });
  </script>

  <script src="js/stat-cards.js"></script>
  <script src="js/nav-active.js"></script>
  <script src="js/home.js"></script>
</body>

</html>
`;
  html = html.substring(0, targetIndex) + cleanEnd;
  fs.writeFileSync('index.html', html, 'utf8');
  console.log('✓ Cleaned up index.html footer and removed ghost hiring modal duplicate');
} else {
  console.log('Target comment not found in index.html');
}
