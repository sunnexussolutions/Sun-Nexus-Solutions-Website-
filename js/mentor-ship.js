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
        <img src="${mentee.img}" alt="${mentee.name}">
        <div class="mentee-info">
          <h3 class="name">${mentee.name}</h3>
          <p class="role">${mentee.role}</p>
        </div>
      </div>
    `;
  });
});
