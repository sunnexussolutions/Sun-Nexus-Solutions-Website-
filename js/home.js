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

        // Cycle every 5 seconds
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

    document.querySelectorAll('.why-card, .log-book-card, .about-container').forEach(el => {
        observer.observe(el);
    });
});