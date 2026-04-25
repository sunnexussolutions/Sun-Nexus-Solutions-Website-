// Authentication check
function checkAuth() {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  const currentPage = window.location.pathname.split('/').pop();
  
  if (!isLoggedIn && currentPage !== 'login.html' && currentPage !== '') {
    window.location.href = 'login.html';
  }
}

// Logout function
function logout() {
  sessionStorage.clear();
  window.location.href = 'login.html';
}

checkAuth();
