
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
  }

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate__animated", "animate__fadeInUp");
        observer.unobserve(entry.target); 
      }
    });
  }, observerOptions);


  document.querySelectorAll(".why-card").forEach(card => {
    observer.observe(card);
  });

 
  document.querySelectorAll(".opportunity-card").forEach(card => {
    observer.observe(card);
  });
});