const mentorData = {
  mentees: [
    { name: "Amrutha Varshini", role: "Web Development Track", img: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772639381/amrutha_varshini_mgyn9n.jpg" }
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
