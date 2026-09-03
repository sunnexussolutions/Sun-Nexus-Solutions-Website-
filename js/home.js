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
                      <a href="${m.linkedin && m.linkedin !== '#' ? m.linkedin : 'https://www.linkedin.com/company/sunnexussolutions/'}" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><svg class="social-icon-svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg></a>
                      <a href="${m.github && m.github !== '#' ? m.github : 'https://github.com/sunnexussolutions'}" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><svg class="social-icon-svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg></a>
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

        // Hiring Modal — fully driven by admin panel
        if (content.hiringModal) {
            const m = content.hiringModal;

            // Badge text — find the text node (last child) safely
            const badgeEl = document.querySelector('#hiringModal .hero-kicker');
            if (badgeEl && m.badgeText) {
                // Walk child nodes to find text node and update it
                let updated = false;
                badgeEl.childNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                        node.textContent = ' ' + m.badgeText;
                        updated = true;
                    }
                });
                // Fallback: append text node if none found
                if (!updated) {
                    badgeEl.appendChild(document.createTextNode(' ' + m.badgeText));
                }
            }

            // Title lines
            const titleTop = document.querySelector('#hiringModal .hiring-title .title-top');
            if (titleTop && m.titleLine1) titleTop.textContent = m.titleLine1;

            const titleGrad = document.querySelector('#hiringModal .hiring-title .gradient-text');
            if (titleGrad && m.titleLine2) titleGrad.textContent = m.titleLine2;

            // Description
            const descEl = document.querySelector('#hiringModal .hiring-text');
            if (descEl && m.description) descEl.textContent = m.description;

            // Role tags
            const rolesEl = document.querySelector('#hiringModal .hiring-roles');
            if (rolesEl && Array.isArray(m.roleTags) && m.roleTags.length) {
                rolesEl.innerHTML = m.roleTags.map(tag =>
                    `<div class="role-tag"><span class="role-dot">●</span> ${tag}</div>`
                ).join('');
            }

            // CTA button
            const ctaBtn = document.querySelector('#hiringModal .join-nexus-btn');
            if (ctaBtn) {
                if (m.ctaBtnText) {
                    const ctaSpan = ctaBtn.querySelector('span');
                    if (ctaSpan) ctaSpan.textContent = m.ctaBtnText;
                }
                if (m.ctaBtnLink) ctaBtn.setAttribute('href', m.ctaBtnLink);
            }

            // Team image
            const teamImg = document.querySelector('#hiringModal .modal-hero-image');
            if (teamImg && m.teamImage) {
                teamImg.src = m.teamImage;
            }

            // Store config for the auto-show timer (handled on load)
            window._nexusHiringConfig = m;
        }

        // Re-apply stat cards manager overrides to prevent overwriting
        if (window.NexusStatCards && typeof window.NexusStatCards.load === 'function') {
            window.NexusStatCards.load();
        }
    };

    const loadHomeContent = async () => {
        // 1. Instant check from localStorage (checking multiple possible keys)
        const localData = localStorage.getItem('nexus_home_content') || localStorage.getItem('nexus_home_data');
        if (localData) {
            try {
                applyHomeContent(JSON.parse(localData));
            } catch (e) {
                console.warn('Error parsing local home content:', e);
            }
        }

        // 2. Fetch from Backend API (if running)
        try {
            const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:';
            const apiHost = isLocal ? 'http://localhost:3000' : '';
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

    // Listen for live updates across browser tabs & same tab
    const handleSyncEvent = (e) => {
        if (!e || e.key === 'nexus_home_content' || e.key === 'nexus_home_data' || !e.key) {
            const raw = localStorage.getItem('nexus_home_content') || localStorage.getItem('nexus_home_data');
            if (raw) {
                try {
                    applyHomeContent(JSON.parse(raw));
                } catch (err) {}
            }
        }
    };

    window.addEventListener('storage', handleSyncEvent);
    window.addEventListener('nexus-data-updated', handleSyncEvent);
});