import React from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 REACT_RUNTIME_CRASH_DETECTED:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleResetAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      console.log("🧹 Local storage cleared for clean recovery.");
    } catch (e) {
      console.error("Failed to clear storage:", e);
    }
    window.location.href = '/';
  };

  handleReloadOnly = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          width: '100vw',
          backgroundColor: '#050a18',
          color: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Outfit', 'Inter', sans-serif",
          padding: '2rem',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            background: 'rgba(16, 20, 36, 0.85)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(0, 242, 254, 0.1)',
            backdropFilter: 'blur(20px)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#ef4444'
            }}>
              <AlertTriangle size={32} />
            </div>

            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              marginBottom: '0.75rem',
              color: '#ffffff',
              letterSpacing: '-0.02em'
            }}>
              System Display Interrupted
            </h1>

            <p style={{
              color: '#94a3b8',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              marginBottom: '1.5rem'
            }}>
              A runtime exception prevented the dashboard from rendering. This is often caused by outdated local storage tokens or temporary network disconnects.
            </p>

            {this.state.error && (
              <div style={{
                background: '#0a0e1c',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'left',
                marginBottom: '2rem',
                maxHeight: '120px',
                overflowY: 'auto',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#f87171'
              }}>
                <strong>Error: </strong> {this.state.error.toString()}
              </div>
            )}

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <button
                onClick={this.handleResetAndReload}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(0, 242, 254, 0.4)',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
                }}
              >
                <Trash2 size={18} /> Clear Data & Restart App
              </button>

              <button
                onClick={this.handleReloadOnly}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#cbd5e1',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <RefreshCw size={18} /> Try Reloading Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
