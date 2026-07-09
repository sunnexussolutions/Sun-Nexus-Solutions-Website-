document.addEventListener('DOMContentLoaded', () => {
    // ── Background Carousel Engine ──────────────────────────────────────────
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;

    if (slides.length > 0) {
        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }
        setInterval(nextSlide, 5000);
    }

    // ── Intersection Observer for Scroll Animations ────────────────────────
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.why-card, .log-book-card, .about-container, .stat-grid-card, .val-card, .leader-card').forEach(el => {
        observer.observe(el);
    });

    // ── Hero Card Carousel Engine ──────────────────────────────────────────
    let heroCarouselInterval = null;
    function initHeroCarousel() {
        const track = document.querySelector('.hero-carousel-track');
        if (!track) return;
        const slides = track.querySelectorAll('.hero-carousel-slide');
        const dots = document.querySelectorAll('.hero-carousel-dots .carousel-dot');
        const prevBtn = document.querySelector('.hero-carousel-prev');
        const nextBtn = document.querySelector('.hero-carousel-next');
        let currentSlide = 0;

        if (heroCarouselInterval) clearInterval(heroCarouselInterval);

        function showSlide(index) {
            if (index >= slides.length) currentSlide = 0;
            else if (index < 0) currentSlide = slides.length - 1;
            else currentSlide = index;

            slides.forEach((slide, idx) => {
                slide.classList.toggle('active', idx === currentSlide);
            });
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentSlide);
            });
        }

        function nextSlide() { showSlide(currentSlide + 1); }
        function prevSlide() { showSlide(currentSlide - 1); }

        function startTimer() {
            if (heroCarouselInterval) clearInterval(heroCarouselInterval);
            if (slides.length > 1) {
                heroCarouselInterval = setInterval(nextSlide, 4500);
            }
        }

        if (nextBtn) {
            nextBtn.onclick = (e) => { e.preventDefault(); nextSlide(); startTimer(); };
        }
        if (prevBtn) {
            prevBtn.onclick = (e) => { e.preventDefault(); prevSlide(); startTimer(); };
        }

        dots.forEach((dot, idx) => {
            dot.onclick = (e) => {
                e.preventDefault();
                showSlide(idx);
                startTimer();
            };
        });

        const card = document.querySelector('.hero-image-card');
        if (card) {
            card.onmouseenter = () => { if (heroCarouselInterval) clearInterval(heroCarouselInterval); };
            card.onmouseleave = () => startTimer();
        }

        startTimer();
    }

    // ── Admin Panel Content Engine (Live CMS Sync) ─────────────────────────
    const applyHomeContent = (content) => {
        if (!content) return;

        // Hero Section
        if (content.hero) {
            const titleMain = document.querySelector('.title-main');
            if (titleMain && content.hero.titleMain) titleMain.textContent = content.hero.titleMain;

            const titleGradient = document.querySelector('.title-gradient');
            if (titleGradient && content.hero.titleGradient) titleGradient.textContent = content.hero.titleGradient;

            const subtitle = document.querySelector('.hero-subtitle');
            if (subtitle && content.hero.subtitle) subtitle.innerHTML = content.hero.subtitle;

            const desc = document.querySelector('.hero-desc');
            if (desc && content.hero.description) desc.textContent = content.hero.description;

            const exploreBtn = document.querySelector('.btn-explore');
            if (exploreBtn) {
                if (content.hero.exploreBtnText) exploreBtn.textContent = content.hero.exploreBtnText;
                if (content.hero.exploreBtnLink) exploreBtn.setAttribute('href', content.hero.exploreBtnLink);
            }

            const joinBtn = document.querySelector('.btn-join');
            if (joinBtn) {
                if (content.hero.joinBtnText) joinBtn.textContent = content.hero.joinBtnText;
                if (content.hero.joinBtnLink) joinBtn.setAttribute('href', content.hero.joinBtnLink);
            }

            const badges = document.querySelectorAll('.hero-badge-card');
            if (badges.length >= 2) {
                if (content.hero.badge1Number) badges[0].querySelector('.badge-number').textContent = content.hero.badge1Number;
                if (content.hero.badge1Label) badges[0].querySelector('.badge-label').textContent = content.hero.badge1Label;
                if (content.hero.badge2Number) badges[1].querySelector('.badge-number').textContent = content.hero.badge2Number;
                if (content.hero.badge2Label) badges[1].querySelector('.badge-label').textContent = content.hero.badge2Label;
            }

            const heroCard = document.querySelector('.hero-image-card');
            if (heroCard) {
                const images = Array.isArray(content.hero.carouselImages) && content.hero.carouselImages.length > 0 
                    ? content.hero.carouselImages 
                    : [
                        content.hero.image || "https://res.cloudinary.com/dseg9nty3/image/upload/v1772689390/IMG20260214121123_01.jpg_rvmrw2.jpg",
                        "https://res.cloudinary.com/dseg9nty3/image/upload/v1772689359/IMG20260214104936.jpg_qq8apz.jpg",
                        "https://res.cloudinary.com/dseg9nty3/image/upload/v1772689999/WhatsApp_Image_2026-03-05_at_11.17.39_AM_ghi5gj.jpg",
                        "https://res.cloudinary.com/dseg9nty3/image/upload/v1772689415/20260214_102511.jpg_vtdmdr.jpg"
                      ];
                
                heroCard.innerHTML = `
                  <div class="hero-carousel-track">
                    ${images.map((imgUrl, idx) => `
                      <div class="hero-carousel-slide ${idx === 0 ? 'active' : ''}">
                        <img src="${imgUrl}" alt="Sun Nexus Club Team ${idx + 1}">
                      </div>
                    `).join('')}
                  </div>
                  ${images.length > 1 ? `
                    <button class="hero-carousel-prev" aria-label="Previous slide">&#10094;</button>
                    <button class="hero-carousel-next" aria-label="Next slide">&#10095;</button>
                    <div class="hero-carousel-dots">
                      ${images.map((_, idx) => `<span class="carousel-dot ${idx === 0 ? 'active' : ''}" data-slide="${idx}"></span>`).join('')}
                    </div>
                  ` : ''}
                `;
                initHeroCarousel();
            }
        }

        // Stats Row
        if (Array.isArray(content.stats)) {
            const statCards = document.querySelectorAll('.hero-stats-row .stat-grid-card');
            content.stats.forEach((stat, idx) => {
                if (statCards[idx]) {
                    const valEl = statCards[idx].querySelector('.stat-val');
                    const lblEl = statCards[idx].querySelector('.stat-lbl');
                    if (valEl && stat.value) valEl.textContent = stat.value;
                    if (lblEl && stat.label) lblEl.textContent = stat.label;
                }
            });
        }

        // Core Values
        if (content.values) {
            const valTitle = document.querySelector('.values-leadership-section .section-title');
            if (valTitle && content.values.title) valTitle.textContent = content.values.title;

            const valSub = document.querySelector('.values-leadership-section .section-subtitle');
            if (valSub && content.values.subtitle) valSub.textContent = content.values.subtitle;

            if (Array.isArray(content.values.items)) {
                const valCards = document.querySelectorAll('.values-grid .val-card');
                content.values.items.forEach((item, idx) => {
                    if (valCards[idx]) {
                        const heading = valCards[idx].querySelector('.val-heading');
                        const body = valCards[idx].querySelector('.val-body');
                        if (heading && item.title) heading.textContent = item.title;
                        if (body && item.desc) body.textContent = item.desc;
                    }
                });
            }
        }

        // Leadership Team
        if (content.leadership && Array.isArray(content.leadership.members)) {
            const lTitle = document.querySelector('.leadership-heading');
            if (lTitle && content.leadership.title) lTitle.textContent = content.leadership.title;

            const grid = document.querySelector('.leadership-grid');
            if (grid) {
                grid.innerHTML = content.leadership.members.map(m => `
                  <div class="leader-card animate__animated animate__fadeInUp">
                    <div class="leader-img-box">
                      <img src="${m.image || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'}" alt="${m.name || 'Leader'}">
                    </div>
                    <h4 class="leader-name">${m.name || ''}</h4>
                    <span class="leader-role">${m.role || ''}</span>
                    <div class="leader-socials">
                      ${m.linkedin && m.linkedin !== '#' ? `<a href="${m.linkedin}" aria-label="LinkedIn" target="_blank"><svg class="social-icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2v-8.37H6.46M7.83 6.67a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z"/></svg></a>` : `<a href="#" aria-label="LinkedIn"><svg class="social-icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2v-8.37H6.46M7.83 6.67a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z"/></svg></a>`}
                      ${m.twitter && m.twitter !== '#' ? `<a href="${m.twitter}" aria-label="Twitter" target="_blank"><svg class="social-icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>` : `<a href="#" aria-label="Twitter"><svg class="social-icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>`}
                      ${m.facebook && m.facebook !== '#' ? `<a href="${m.facebook}" aria-label="Facebook" target="_blank"><svg class="social-icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg></a>` : `<a href="#" aria-label="Facebook"><svg class="social-icon-svg" viewBox="0 0 24 24"><path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg></a>`}
                    </div>
                  </div>
                `).join('');
            }
        }

        // Log Book
        if (content.logbook) {
            const lHead = document.querySelector('.logbook-heading');
            if (lHead && content.logbook.title) lHead.textContent = content.logbook.title;

            const lDesc = document.querySelector('.logbook-description');
            if (lDesc && content.logbook.description) lDesc.textContent = content.logbook.description;

            const lBtn = document.querySelector('.logbook-action-btn');
            if (lBtn) {
                if (content.logbook.btnText) lBtn.textContent = content.logbook.btnText;
                if (content.logbook.btnLink) lBtn.setAttribute('href', content.logbook.btnLink);
            }
        }

        // Why Nexus
        if (content.whyNexus) {
            const wHead = document.querySelector('.why-heading');
            if (wHead && content.whyNexus.title) wHead.textContent = content.whyNexus.title;

            const wSub = document.querySelector('.why-subtext');
            if (wSub && content.whyNexus.subtext) wSub.textContent = content.whyNexus.subtext;
        }
    };

    const loadHomeContent = async () => {
        // 1. Instant check from localStorage
        const localData = localStorage.getItem('nexus_home_content');
        if (localData) {
            try {
                applyHomeContent(JSON.parse(localData));
            } catch (e) {
                console.warn('Error parsing local home content:', e);
            }
        }

        // 2. Fetch from Backend API (if running)
        try {
            const apiHost = window.location.port === '8080' || window.location.port === '' ? 'http://localhost:3000' : '';
            const res = await fetch(`${apiHost}/api/home-content`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.success && data.content) {
                    localStorage.setItem('nexus_home_content', JSON.stringify(data.content));
                    applyHomeContent(data.content);
                }
            }
        } catch (err) {
            console.log('Using local/cached home content.');
        }
    };

    loadHomeContent();
    initHeroCarousel();

    // Listen for live updates across browser tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'nexus_home_content' && e.newValue) {
            try {
                applyHomeContent(JSON.parse(e.newValue));
            } catch (err) {}
        }
    });
});