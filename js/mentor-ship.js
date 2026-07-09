const mentorData = {
  mentees: [
    { name: "Amrutha Varshini", role: "Web Development Track", img: "https://res.cloudinary.com/dseg9nty3/image/upload/v1772639381/amrutha_varshini_mgyn9n.jpg" }
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  // Menu toggle logic moved to global nav-active.js

  // Populate Mentees
  const menteesGrid = document.getElementById("mentees-grid");
  mentorData.mentees.forEach(mentee => {
    menteesGrid.innerHTML += `
      <div class="mentee-card">
        <div class="mentee-left">
          <img src="${mentee.img}" alt="${mentee.name}">
          <div class="mentee-info">
            <h3 class="name">${mentee.name}</h3>
            <p class="role">${mentee.role}</p>
          </div>
        </div>
        <div class="mentee-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    `;
  });
});
