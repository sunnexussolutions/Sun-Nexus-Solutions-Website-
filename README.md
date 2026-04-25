# Sun Nexus Solutions Platform

A comprehensive student-driven innovation platform featuring a static landing site and a modern React-based Administrative & Performance Dashboard.

## 🏗️ Project Structure

- **Root**: Static HTML/CSS/JS landing pages (`home.html`, `about-us.html`, `login.html`, etc.).
- **api/**: PHP backend for authentication, database configuration, and progress tracking.
- **Present Dashboard/**: Core React (Vite) application for Members, Analysts, and Administrators.
- **resources/**: Static learning resources and course materials.
- **resources2/**: Legacy student dashboard and resource portal.
- **Nexus Dashboard Anti/**: Bridge/Launcher page for the integrated platform.

## 🚀 Getting Started

### Static Landing Site
The primary entrance is `home.html`. For local development, use a PHP server (like XAMPP or `php -S localhost:8000`) to ensure the `api/` endpoints work correctly.

### Admin & Performance Dashboard
1. Navigate to the `Present Dashboard` directory:
   ```bash
   cd "Present Dashboard"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the dashboard at `http://localhost:5173`.

## 🛠️ Technology Stack
- **Frontend**: React, Framer Motion, Lucide Icons, Recharts (for Analytics).
- **Styling**: Vanilla CSS with "Imperial Glass" design system.
- **Backend**: PHP (PDO) & MySQL.
- **Build Tool**: Vite.

## 🔒 Security
Ensure `api/db_config.php` is updated with your production database credentials before deployment. Do not commit sensitive `.env` files to the repository.

---
© 2026 Sun Nexus Solutions - Where Innovation Meets Heart.
