import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { ProjectProvider } from './contexts/ProjectContext'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import { StatusBar, Style } from '@capacitor/status-bar'

// Initialize Capacitor Native Mobile Status Bar behavior at runtime
if (typeof window !== 'undefined' && window.Capacitor) {
  try {
    StatusBar.setOverlaysWebView({ overlay: false }).catch(() => {});
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    StatusBar.setBackgroundColor({ color: '#0f172a' }).catch(() => {});
  } catch (e) {
    console.warn("Capacitor StatusBar init:", e);
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ProjectProvider>
            <App />
          </ProjectProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
)

