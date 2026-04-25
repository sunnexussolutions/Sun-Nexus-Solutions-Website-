document.addEventListener("DOMContentLoaded", () => {
 
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const isExpanded = navLinks.classList.contains("active");
      menuToggle.setAttribute("aria-expanded", isExpanded);
      menuToggle.textContent = isExpanded ? "✕" : "☰"; 
    });

   
    $('.dropdown-toggle').dropdown();
  } else {
    console.error("Menu toggle or nav links not found in the DOM.");
  }

  
  const heroSection = document.querySelector(".hero");
  const animatableSections = document.querySelectorAll(".who-we-are-section, .team-section, .join-section");


  function isHeroInViewport() {
    if (!heroSection) return false;
    const rect = heroSection.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  }

  
  function applyAnimations() {
    if (!isHeroInViewport()) {
      animatableSections.forEach(section => {
        if (section && !section.classList.contains("animate__animated")) {
          if (section.classList.contains("who-we-are-section")) {
            section.classList.add("animate__animated", "animate__slideInLeft");
          } else if (section.classList.contains("team-section")) {
            section.classList.add("animate__animated", "animate__slideInRight");
          } else if (section.classList.contains("join-section")) {
            section.classList.add("animate__animated", "animate__fadeInUp");
          }
        }
      });
    }
  }

  window.addEventListener("scroll", () => {
    applyAnimations();
  });


  applyAnimations();

  
  if (heroSection && isHeroInViewport()) {
    heroSection.classList.add("animate__animated", "animate__fadeIn");
  }
});