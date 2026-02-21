import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      background: 'linear-gradient(180deg, #0a0e1a 0%, #050810 100%)',
      color: '#8892b0',
      paddingTop: '4rem',
      paddingBottom: '2rem',
      borderTop: '1px solid rgba(0, 212, 255, 0.15)',
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 2rem',
    },
    cardsSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '4rem',
    },
    card: {
      background: 'rgba(99, 102, 241, 0.05)',
      border: '1px solid rgba(0, 212, 255, 0.2)',
      borderRadius: '12px',
      padding: '2rem',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
    },
    cardIcon: {
      width: '48px',
      height: '48px',
      marginBottom: '1.5rem',
      color: '#00fff5',
      filter: 'drop-shadow(0 0 10px rgba(0, 255, 245, 0.3))',
    },
    cardTitle: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '1.3rem',
      fontWeight: 700,
      color: '#00d4ff',
      marginBottom: '1rem',
      letterSpacing: '0.5px',
    },
    cardDescription: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.95rem',
      lineHeight: '1.6',
      color: '#8892b0',
    },
    aboutSection: {
      borderTop: '1px solid rgba(0, 212, 255, 0.1)',
      paddingTop: '3rem',
      marginBottom: '3rem',
    },
    aboutTitle: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '2rem',
      fontWeight: 900,
      background: 'linear-gradient(135deg, #00fff5 0%, #00d4ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '1.5rem',
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    aboutContent: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem',
    },
    aboutColumn: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.95rem',
      lineHeight: '1.8',
      color: '#8892b0',
    },
    aboutHighlight: {
      color: '#00fff5',
      fontWeight: 600,
    },
    bottomSection: {
      borderTop: '1px solid rgba(0, 212, 255, 0.1)',
      paddingTop: '2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    copyright: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.85rem',
      color: '#8892b0',
    },
    links: {
      display: 'flex',
      gap: '2rem',
      flexWrap: 'wrap',
    },
    link: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.85rem',
      color: '#00d4ff',
      textDecoration: 'none',
      transition: 'color 0.3s ease',
      cursor: 'pointer',
    },
    socialIcons: {
      display: 'flex',
      gap: '1rem',
    },
    socialIcon: {
      width: '24px',
      height: '24px',
      color: '#8892b0',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
  };

  const cards = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7V12C2 16.97 5.84 21.5 12 23C18.16 21.5 22 16.97 22 12V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Secure & Confidential',
      description: 'End-to-end encryption ensures your complaints and evidence remain protected. Advanced security protocols safeguard sensitive investigation data.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: '24/7 Case Tracking',
      description: 'Real-time monitoring of your case status with instant notifications. Track every step of the investigation process from filing to resolution.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M23 21V19C23 17.1362 21.7252 15.5701 20 15.126" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 3.12988C17.7252 3.57397 19 5.13988 19 7C19 8.86012 17.7252 10.426 16 10.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Expert Support Team',
      description: 'Certified forensic analysts and support specialists available around the clock. Get professional guidance throughout your investigation journey.',
    },
  ];

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Cards Section */}
        <div style={styles.cardsSection}>
          {cards.map((card, index) => (
            <div 
              key={index} 
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = '#00fff5';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.3)';
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
              }}
            >
              <div style={styles.cardIcon}>{card.icon}</div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDescription}>{card.description}</p>
            </div>
          ))}
        </div>

        {/* About Section */}
        <div style={styles.aboutSection}>
          <h2 style={styles.aboutTitle}>About MailGuardX</h2>
          <div style={styles.aboutContent}>
            <div style={styles.aboutColumn}>
              <p>
                <span style={styles.aboutHighlight}>MailGuardX</span> is a cutting-edge digital 
                forensic investigation platform designed to streamline the process of reporting, 
                tracking, and resolving cybercrime incidents. Our system leverages advanced 
                technologies to ensure swift and accurate investigations.
              </p>
            </div>
            <div style={styles.aboutColumn}>
              <p>
                With state-of-the-art <span style={styles.aboutHighlight}>encryption protocols</span>, 
                blockchain-verified evidence chains, and AI-powered analysis tools, we provide law 
                enforcement agencies and citizens with a robust platform for digital justice. 
                Our mission is to make digital forensics accessible, transparent, and efficient.
              </p>
            </div>
            <div style={styles.aboutColumn}>
              <p>
                Trusted by <span style={styles.aboutHighlight}>500+ agencies</span> worldwide, 
                MailGuardX has successfully processed over 100,000 cases with a 95% resolution 
                rate. Join our network of professionals dedicated to combating cybercrime and 
                protecting digital rights across the globe.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={styles.bottomSection}>
          <div style={styles.copyright}>
            © 2024 MailGuardX. All rights reserved. | Built for Digital Justice
          </div>
          
          <div style={styles.links}>
            <a 
              href="#privacy" 
              style={styles.link}
              onMouseEnter={(e) => e.target.style.color = '#00fff5'}
              onMouseLeave={(e) => e.target.style.color = '#00d4ff'}
            >
              Privacy Policy
            </a>
            <a 
              href="#terms" 
              style={styles.link}
              onMouseEnter={(e) => e.target.style.color = '#00fff5'}
              onMouseLeave={(e) => e.target.style.color = '#00d4ff'}
            >
              Terms of Service
            </a>
            <a 
              href="#contact" 
              style={styles.link}
              onMouseEnter={(e) => e.target.style.color = '#00fff5'}
              onMouseLeave={(e) => e.target.style.color = '#00d4ff'}
            >
              Contact Us
            </a>
          </div>

          <div style={styles.socialIcons}>
            <svg 
              style={styles.socialIcon} 
              viewBox="0 0 24 24" 
              fill="currentColor"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00fff5';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8892b0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <svg 
              style={styles.socialIcon} 
              viewBox="0 0 24 24" 
              fill="currentColor"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00fff5';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8892b0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
            <svg 
              style={styles.socialIcon} 
              viewBox="0 0 24 24" 
              fill="currentColor"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00fff5';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8892b0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
