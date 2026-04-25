document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  // Demo credentials (replace with actual authentication)
  const users = {
    admin: {
      email: 'admin@sunnexus.com',
      password: 'admin123',
      role: 'admin',
      redirectUrl: 'admin-dashboard.html'
    },
    member: {
      email: 'member@sunnexus.com',
      password: 'member123',
      role: 'member',
      redirectUrl: 'member-dashboard.html'
    }
  };

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Remove previous error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    // Validate inputs
    if (!email || !password || !role) {
      showError('Please fill in all fields');
      return;
    }

    // Check credentials
    const user = Object.values(users).find(
      u => u.email === email && u.password === password && u.role === role
    );

    if (user) {
      // Store user session
      sessionStorage.setItem('userRole', user.role);
      sessionStorage.setItem('userEmail', user.email);
      sessionStorage.setItem('isLoggedIn', 'true');

      // Show success and redirect
      showSuccess('Login successful! Redirecting...');
      
      setTimeout(() => {
        window.location.href = user.redirectUrl;
      }, 1000);
    } else {
      showError('Invalid email, password, or role');
    }
  });

  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    loginForm.insertBefore(errorDiv, loginForm.firstChild);

    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }

  function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'error-message';
    successDiv.style.background = 'rgba(0, 255, 0, 0.2)';
    successDiv.style.borderColor = 'rgba(0, 255, 0, 0.4)';
    successDiv.style.color = '#4ade80';
    successDiv.textContent = message;
    loginForm.insertBefore(successDiv, loginForm.firstChild);
  }
});
