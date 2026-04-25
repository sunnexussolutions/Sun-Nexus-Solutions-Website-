const mentorData = {
  mentees: [
    { name: "Purna Reddy", role: "Data Analytics Track", img: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772599133/purna_reddy_mszkgg.jpg" },
    { name: "Vaishnavi", role: "AI/ML Track", img: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772639378/vaishnavi_iwaurb.jpg" },
    { name: "Amrutha Varshini", role: "Web Development Track", img: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772639381/amrutha_varshini_mgyn9n.jpg" },
    { name: "Vanaja", role: "Web Development Track", img: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772518151/vanaja_izfe76.jpg" },
    { name: "Rishitha", role: "Web Development Track", img: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772518152/rishitha_zgdfij.jpg" },
    { name: "Sai Geethanjali", role: "Web Development Track", img: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772518151/geetanjali_ffvarc.jpg" }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", navLinks.classList.contains("active"));
      menuToggle.textContent = navLinks.classList.contains("active") ? "✕" : "☰";
    });
  }

  // Populate Mentees
  const menteesGrid = document.getElementById("mentees-grid");
  mentorData.mentees.forEach(mentee => {
    menteesGrid.innerHTML += `
      <div class="mentee-card">
        <img src="${mentee.img}" alt="${mentee.name}">
        <div class="mentee-info">
          <h3 class="name">${mentee.name}</h3>
          <p class="role">${mentee.role}</p>
        </div>
      </div>
    `;
  });
});
