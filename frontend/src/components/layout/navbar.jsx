import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegisterComplaint = () => {
    navigate('/register-complaint');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const styles = {
    navbar: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      background: scrolled 
        ? 'rgba(10, 14, 26, 0.98)' 
        : 'linear-gradient(180deg, rgba(10, 14, 26, 0.95) 0%, rgba(10, 14, 26, 0.85) 100%)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled 
        ? '1px solid rgba(0, 212, 255, 0.3)' 
        : '1px solid rgba(0, 212, 255, 0.15)',
      boxShadow: scrolled ? '0 8px 32px rgba(0, 212, 255, 0.1)' : 'none',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    logoWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    logoIcon: {
      width: '42px',
      height: '42px',
      color: '#00fff5',
      filter: 'drop-shadow(0 0 10px rgba(0, 255, 245, 0.4))',
    },
    brandText: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.1rem',
    },
    brandName: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '1.4rem',
      fontWeight: 900,
      background: 'linear-gradient(135deg, #00fff5 0%, #00d4ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    brandSubtitle: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.7rem',
      color: '#8892b0',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      fontWeight: 500,
    },
    actions: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    btnBase: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '8px',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.9rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      letterSpacing: '0.5px',
    },
    registerBtn: {
      background: 'linear-gradient(135deg, #00d4ff 0%, #00fff5 100%)',
      color: '#0a0e1a',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
    },
    profileBtn: {
      background: 'rgba(99, 102, 241, 0.1)',
      color: '#00fff5',
      border: '1px solid rgba(0, 212, 255, 0.3)',
    },
    btnIcon: {
      width: '20px',
      height: '20px',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={{...styles.brand, cursor: 'pointer'}} onClick={() => navigate('/')}>
          <div style={styles.logoWrapper}>
            <svg style={styles.logoIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7V12C2 16.97 5.84 21.5 12 23C18.16 21.5 22 16.97 22 12V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
              <path d="M12 9V12L14 14" stroke="#0a0e1a" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <div style={styles.brandText}>
              <span style={styles.brandName}>MailGuardX</span>
              <span style={styles.brandSubtitle}>Digital Investigation System</span>
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button 
            style={{...styles.btnBase, ...styles.registerBtn}}
            onClick={handleRegisterComplaint}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.3)';
            }}
          >
            <svg style={styles.btnIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Register Complaint</span>
          </button>

          <button 
            style={{...styles.btnBase, ...styles.profileBtn}}
            onClick={handleProfile}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.3)';
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
              e.currentTarget.style.borderColor = '#00fff5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)';
            }}
          >
            <svg style={styles.btnIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Profile</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
