import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const styles = {
    hero: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #050810 0%, #0a0e1a 60%, #050810 100%)',
    },
    gridOverlay: {
      position: 'absolute',
      inset: 0,
      backgroundImage:
        'linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)',
      backgroundSize: '60px 60px',
      pointerEvents: 'none',
    },
    glowOrb1: {
      position: 'absolute',
      top: '20%',
      left: '15%',
      width: '400px',
      height: '400px',
      background: 'radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(60px)',
      pointerEvents: 'none',
      transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`,
      transition: 'transform 0.3s ease-out',
    },
    glowOrb2: {
      position: 'absolute',
      bottom: '10%',
      right: '10%',
      width: '500px',
      height: '500px',
      background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)',
      borderRadius: '50%',
      filter: 'blur(80px)',
      pointerEvents: 'none',
      transform: `translate(${mousePos.x * -0.015}px, ${mousePos.y * -0.015}px)`,
      transition: 'transform 0.3s ease-out',
    },
    content: {
      position: 'relative',
      zIndex: 1,
      textAlign: 'center',
      maxWidth: '900px',
      padding: '0 2rem',
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1.2rem',
      background: 'rgba(0, 212, 255, 0.08)',
      border: '1px solid rgba(0, 212, 255, 0.25)',
      borderRadius: '50px',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.8rem',
      color: '#00fff5',
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      marginBottom: '2rem',
    },
    badgeDot: {
      width: '6px',
      height: '6px',
      background: '#00fff5',
      borderRadius: '50%',
      boxShadow: '0 0 10px #00fff5',
      animation: 'pulse 2s infinite',
    },
    title: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
      fontWeight: 900,
      lineHeight: 1.1,
      marginBottom: '1.5rem',
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    titleWhite: {
      color: '#e6f1ff',
      display: 'block',
    },
    titleGradient: {
      background: 'linear-gradient(135deg, #00fff5 0%, #00d4ff 50%, #6366f1 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      display: 'block',
    },
    description: {
      fontFamily: "'Courier New', monospace",
      fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
      color: '#8892b0',
      lineHeight: 1.8,
      maxWidth: '700px',
      margin: '0 auto 3rem',
    },
    actions: {
      display: 'flex',
      gap: '1.5rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '4rem',
    },
    primaryBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.6rem',
      padding: '1rem 2.5rem',
      background: 'linear-gradient(135deg, #00d4ff 0%, #00fff5 100%)',
      color: '#0a0e1a',
      border: 'none',
      borderRadius: '10px',
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '0.95rem',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      boxShadow: '0 4px 25px rgba(0, 212, 255, 0.35)',
    },
    secondaryBtn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.6rem',
      padding: '1rem 2.5rem',
      background: 'transparent',
      color: '#00fff5',
      border: '1px solid rgba(0, 212, 255, 0.4)',
      borderRadius: '10px',
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '0.95rem',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    btnIcon: {
      width: '20px',
      height: '20px',
    },
    metrics: {
      display: 'flex',
      justifyContent: 'center',
      gap: '3rem',
      flexWrap: 'wrap',
    },
    metricItem: {
      textAlign: 'center',
    },
    metricNumber: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '2rem',
      fontWeight: 900,
      background: 'linear-gradient(135deg, #00fff5 0%, #00d4ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    metricLabel: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.8rem',
      color: '#8892b0',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginTop: '0.3rem',
    },
    metricDivider: {
      width: '1px',
      background: 'rgba(0, 212, 255, 0.2)',
      alignSelf: 'stretch',
    },
    scrollIndicator: {
      position: 'absolute',
      bottom: '2rem',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#8892b0',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.7rem',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      opacity: 0.6,
    },
    scrollLine: {
      width: '1px',
      height: '40px',
      background: 'linear-gradient(180deg, rgba(0, 212, 255, 0.5), transparent)',
    },
  };

  const keyframesStyle = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `;

  const metrics = [
    { number: '100K+', label: 'Cases Processed' },
    { number: '500+', label: 'Agencies' },
    { number: '95%', label: 'Resolution Rate' },
    { number: '150+', label: 'Countries' },
  ];

  return (
    <section style={styles.hero}>
      <style>{keyframesStyle}</style>
      <div style={styles.gridOverlay} />
      <div style={styles.glowOrb1} />
      <div style={styles.glowOrb2} />

      <div style={styles.content}>
        <div style={styles.badge}>
          <div style={styles.badgeDot} />
          <span>Next-Gen Digital Forensics</span>
        </div>

        <h1 style={styles.title}>
          <span style={styles.titleWhite}>Investigate.</span>
          <span style={styles.titleGradient}>Analyze. Resolve.</span>
        </h1>

        <p style={styles.description}>
          MailGuardX is a military-grade digital investigation platform powered by AI
          and blockchain technology. Report cybercrimes, track investigations in real-time,
          and bring digital criminals to justice.
        </p>

        <div style={styles.actions}>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate('/register-complaint')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 8px 40px rgba(0, 212, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 25px rgba(0, 212, 255, 0.35)';
            }}
          >
            <svg style={styles.btnIcon} viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            File a Complaint
          </button>
          <button
            style={styles.secondaryBtn}
            onClick={() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
              e.currentTarget.style.borderColor = '#00fff5';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg style={styles.btnIcon} viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2C16.75 2 21 6.25 21 11.5Z" stroke="currentColor" strokeWidth="2" />
              <path d="M22 22L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Explore Features
          </button>
        </div>

        <div style={styles.metrics}>
          {metrics.map((metric, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div style={styles.metricDivider} />}
              <div style={styles.metricItem}>
                <div style={styles.metricNumber}>{metric.number}</div>
                <div style={styles.metricLabel}>{metric.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={styles.scrollIndicator}>
        <span>Scroll</span>
        <div style={styles.scrollLine} />
      </div>
    </section>
  );
};

export default Hero;
