import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mlResult, complaintId } = location.state || {};
  const [glitch, setGlitch] = useState(false);

  const isThreat = mlResult?.isThreat ?? false;
  const category = mlResult?.category ?? 'Unknown';
  const confidence = mlResult?.confidence ?? 0;

  useEffect(() => {
    if (!mlResult) {
      navigate('/');
      return;
    }

    if (isThreat) {
      const interval = setInterval(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 200);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [mlResult, isThreat, navigate]);

  const keyframes = `
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes flicker {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.8; }
    }
    @keyframes pulse-red {
      0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.3); }
      50% { box-shadow: 0 0 60px rgba(255, 0, 0, 0.6); }
    }
    @keyframes pulse-green {
      0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 100, 0.2); }
      50% { box-shadow: 0 0 40px rgba(0, 255, 100, 0.4); }
    }
    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }
    @keyframes blink-caret {
      from, to { border-color: transparent; }
      50% { border-color: currentColor; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `;

  if (isThreat) {
    return <ThreatDetected category={category} confidence={confidence} complaintId={complaintId} navigate={navigate} glitch={glitch} keyframes={keyframes} />;
  }

  return <DeviceSafe category={category} confidence={confidence} navigate={navigate} keyframes={keyframes} />;
};

const ThreatDetected = ({ category, confidence, complaintId, navigate, glitch, keyframes }) => {
  const styles = {
    page: {
      minHeight: '100vh',
      background: '#0a0000',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    },
    scanline: {
      position: 'absolute',
      inset: 0,
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.03) 2px, rgba(255, 0, 0, 0.03) 4px)',
      pointerEvents: 'none',
      zIndex: 1,
    },
    scanBeam: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, transparent, rgba(255, 0, 0, 0.6), transparent)',
      animation: 'scanline 3s linear infinite',
      zIndex: 2,
    },
    content: {
      position: 'relative',
      zIndex: 10,
      maxWidth: '700px',
      width: '100%',
      textAlign: 'center',
    },
    warningIcon: {
      width: '120px',
      height: '120px',
      margin: '0 auto 2rem',
      color: '#ff0033',
      filter: 'drop-shadow(0 0 30px rgba(255, 0, 51, 0.6))',
      animation: 'flicker 1.5s ease-in-out infinite',
    },
    alertBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1.5rem',
      background: 'rgba(255, 0, 51, 0.15)',
      border: '1px solid rgba(255, 0, 51, 0.4)',
      borderRadius: '50px',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.8rem',
      color: '#ff3355',
      letterSpacing: '3px',
      textTransform: 'uppercase',
      marginBottom: '2rem',
    },
    alertDot: {
      width: '8px',
      height: '8px',
      background: '#ff0033',
      borderRadius: '50%',
      boxShadow: '0 0 10px #ff0033',
      animation: 'flicker 0.8s ease-in-out infinite',
    },
    title: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 900,
      color: '#ff0033',
      textTransform: 'uppercase',
      letterSpacing: '4px',
      marginBottom: '1rem',
      textShadow: glitch
        ? '3px 0 #00fff5, -3px 0 #ff0033'
        : '0 0 20px rgba(255, 0, 51, 0.5)',
      transition: 'text-shadow 0.1s ease',
    },
    subtitle: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '1.2rem',
      color: '#ff6b6b',
      marginBottom: '2rem',
      letterSpacing: '2px',
    },
    terminalBox: {
      background: 'rgba(255, 0, 0, 0.05)',
      border: '1px solid rgba(255, 0, 51, 0.3)',
      borderRadius: '12px',
      padding: '2rem',
      textAlign: 'left',
      marginBottom: '2rem',
      animation: 'pulse-red 3s ease-in-out infinite',
    },
    terminalHeader: {
      display: 'flex',
      gap: '6px',
      marginBottom: '1rem',
    },
    terminalDot: (color) => ({
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: color,
    }),
    terminalLine: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.85rem',
      color: '#ff6b6b',
      lineHeight: 2,
      margin: 0,
    },
    terminalLabel: {
      color: '#ff3355',
      fontWeight: 700,
    },
    terminalValue: {
      color: '#ff9999',
    },
    message: {
      fontFamily: "'Courier New', monospace",
      fontSize: '1rem',
      color: '#ff9999',
      lineHeight: 1.8,
      marginBottom: '2.5rem',
      padding: '1.5rem',
      background: 'rgba(255, 0, 0, 0.05)',
      borderLeft: '3px solid #ff0033',
      borderRadius: '0 8px 8px 0',
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    emergencyBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem 2.5rem',
      background: 'linear-gradient(135deg, #ff0033 0%, #cc0029 100%)',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '0.9rem',
      fontWeight: 700,
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: '0 4px 25px rgba(255, 0, 51, 0.4)',
      transition: 'all 0.3s ease',
    },
    homeBtn: {
      padding: '1rem 2.5rem',
      background: 'transparent',
      color: '#ff6b6b',
      border: '1px solid rgba(255, 0, 51, 0.4)',
      borderRadius: '10px',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <div style={styles.page}>
      <style>{keyframes}</style>
      <div style={styles.scanline} />
      <div style={styles.scanBeam} />

      <div style={styles.content}>
        <svg style={styles.warningIcon} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7V12C2 16.97 5.84 21.5 12 23C18.16 21.5 22 16.97 22 12V7L12 2Z" stroke="currentColor" strokeWidth="2" />
          <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>

        <div style={styles.alertBadge}>
          <div style={styles.alertDot} />
          <span>Threat Detected</span>
        </div>

        <h1 style={styles.title}>System Compromised</h1>
        <h2 style={styles.subtitle}>Immediate Action Required</h2>

        <div style={styles.terminalBox}>
          <div style={styles.terminalHeader}>
            <div style={styles.terminalDot('#ff5f57')} />
            <div style={styles.terminalDot('#ffbd2e')} />
            <div style={styles.terminalDot('#28c840')} />
          </div>
          <p style={styles.terminalLine}>
            <span style={styles.terminalLabel}>STATUS: </span>
            <span style={styles.terminalValue}>THREAT CONFIRMED</span>
          </p>
          <p style={styles.terminalLine}>
            <span style={styles.terminalLabel}>CATEGORY: </span>
            <span style={styles.terminalValue}>{category.toUpperCase()}</span>
          </p>
          <p style={styles.terminalLine}>
            <span style={styles.terminalLabel}>CONFIDENCE: </span>
            <span style={styles.terminalValue}>{(confidence * 100).toFixed(1)}%</span>
          </p>
          <p style={styles.terminalLine}>
            <span style={styles.terminalLabel}>CASE ID: </span>
            <span style={styles.terminalValue}>{complaintId || 'PENDING'}</span>
          </p>
          <p style={styles.terminalLine}>
            <span style={styles.terminalLabel}>TIMESTAMP: </span>
            <span style={styles.terminalValue}>{new Date().toISOString()}</span>
          </p>
        </div>

        <div style={styles.message}>
          Your device has been flagged for potential compromise. Our forensic team has been
          automatically notified and will begin a manual investigation. <strong>Do not share
          sensitive information</strong> on this device until the investigation is complete.
          A forensic analyst will contact you within 24 hours.
        </div>

        <div style={styles.actions}>
          <button
            style={styles.emergencyBtn}
            onClick={() => navigate('/register-complaint')}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(255, 0, 51, 0.6)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 25px rgba(255, 0, 51, 0.4)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7V12C2 16.97 5.84 21.5 12 23C18.16 21.5 22 16.97 22 12V7L12 2Z" stroke="currentColor" strokeWidth="2" />
            </svg>
            Request Manual Assistance
          </button>
          <button
            style={styles.homeBtn}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ff0033'; e.currentTarget.style.color = '#ff0033'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255, 0, 51, 0.4)'; e.currentTarget.style.color = '#ff6b6b'; }}
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

const DeviceSafe = ({ category, confidence, navigate, keyframes }) => {
  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #020d05 0%, #051a0a 50%, #020d05 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    },
    gridOverlay: {
      position: 'absolute',
      inset: 0,
      backgroundImage: 'linear-gradient(rgba(0, 255, 100, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 100, 0.02) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
      pointerEvents: 'none',
    },
    content: {
      position: 'relative',
      zIndex: 10,
      maxWidth: '650px',
      width: '100%',
      textAlign: 'center',
    },
    shieldIcon: {
      width: '120px',
      height: '120px',
      margin: '0 auto 2rem',
      color: '#00ff64',
      filter: 'drop-shadow(0 0 30px rgba(0, 255, 100, 0.4))',
      animation: 'float 4s ease-in-out infinite',
    },
    safeBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1.5rem',
      background: 'rgba(0, 255, 100, 0.1)',
      border: '1px solid rgba(0, 255, 100, 0.3)',
      borderRadius: '50px',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.8rem',
      color: '#00ff64',
      letterSpacing: '3px',
      textTransform: 'uppercase',
      marginBottom: '2rem',
    },
    safeDot: {
      width: '8px',
      height: '8px',
      background: '#00ff64',
      borderRadius: '50%',
      boxShadow: '0 0 10px #00ff64',
    },
    title: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 900,
      color: '#00ff64',
      textTransform: 'uppercase',
      letterSpacing: '4px',
      marginBottom: '1rem',
      textShadow: '0 0 20px rgba(0, 255, 100, 0.3)',
    },
    subtitle: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '1.2rem',
      color: '#66ffaa',
      marginBottom: '2rem',
      letterSpacing: '2px',
    },
    statusBox: {
      background: 'rgba(0, 255, 100, 0.05)',
      border: '1px solid rgba(0, 255, 100, 0.2)',
      borderRadius: '12px',
      padding: '2rem',
      textAlign: 'left',
      marginBottom: '2rem',
      animation: 'pulse-green 4s ease-in-out infinite',
    },
    statusHeader: {
      display: 'flex',
      gap: '6px',
      marginBottom: '1rem',
    },
    statusDot: (color) => ({
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: color,
    }),
    statusLine: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.85rem',
      color: '#66ffaa',
      lineHeight: 2,
      margin: 0,
    },
    statusLabel: {
      color: '#00ff64',
      fontWeight: 700,
    },
    statusValue: {
      color: '#99ffcc',
    },
    message: {
      fontFamily: "'Courier New', monospace",
      fontSize: '1rem',
      color: '#99ffcc',
      lineHeight: 1.8,
      marginBottom: '2.5rem',
      padding: '1.5rem',
      background: 'rgba(0, 255, 100, 0.05)',
      borderLeft: '3px solid #00ff64',
      borderRadius: '0 8px 8px 0',
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    primaryBtn: {
      padding: '1rem 2.5rem',
      background: 'linear-gradient(135deg, #00cc55 0%, #00ff64 100%)',
      color: '#020d05',
      border: 'none',
      borderRadius: '10px',
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '0.9rem',
      fontWeight: 700,
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      boxShadow: '0 4px 25px rgba(0, 255, 100, 0.3)',
      transition: 'all 0.3s ease',
    },
    secondaryBtn: {
      padding: '1rem 2.5rem',
      background: 'transparent',
      color: '#00ff64',
      border: '1px solid rgba(0, 255, 100, 0.3)',
      borderRadius: '10px',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <div style={styles.page}>
      <style>{keyframes}</style>
      <div style={styles.gridOverlay} />

      <div style={styles.content}>
        <svg style={styles.shieldIcon} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7V12C2 16.97 5.84 21.5 12 23C18.16 21.5 22 16.97 22 12V7L12 2Z" stroke="currentColor" strokeWidth="2" />
          <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div style={styles.safeBadge}>
          <div style={styles.safeDot} />
          <span>All Clear</span>
        </div>

        <h1 style={styles.title}>Device Secure</h1>
        <h2 style={styles.subtitle}>No Threats Detected</h2>

        <div style={styles.statusBox}>
          <div style={styles.statusHeader}>
            <div style={styles.statusDot('#28c840')} />
            <div style={styles.statusDot('#28c840')} />
            <div style={styles.statusDot('#28c840')} />
          </div>
          <p style={styles.statusLine}>
            <span style={styles.statusLabel}>STATUS: </span>
            <span style={styles.statusValue}>SECURE</span>
          </p>
          <p style={styles.statusLine}>
            <span style={styles.statusLabel}>SCAN TYPE: </span>
            <span style={styles.statusValue}>{category.toUpperCase()}</span>
          </p>
          <p style={styles.statusLine}>
            <span style={styles.statusLabel}>CONFIDENCE: </span>
            <span style={styles.statusValue}>{(confidence * 100).toFixed(1)}%</span>
          </p>
          <p style={styles.statusLine}>
            <span style={styles.statusLabel}>TIMESTAMP: </span>
            <span style={styles.statusValue}>{new Date().toISOString()}</span>
          </p>
        </div>

        <div style={styles.message}>
          Our forensic analysis found no evidence of compromise on your device. Your system
          appears to be operating normally. We recommend keeping your software up-to-date
          and running periodic scans for continued protection.
        </div>

        <div style={styles.actions}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate('/')}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(0, 255, 100, 0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 25px rgba(0, 255, 100, 0.3)'; }}
          >
            Return Home
          </button>
          <button
            style={styles.secondaryBtn}
            onClick={() => navigate('/register-complaint')}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00ff64'; e.currentTarget.style.background = 'rgba(0, 255, 100, 0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 255, 100, 0.3)'; e.currentTarget.style.background = 'transparent'; }}
          >
            File Another Complaint
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
