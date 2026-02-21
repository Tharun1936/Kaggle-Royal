import React from 'react';

const Features = () => {
  const styles = {
    featuresSection: {
      background: 'linear-gradient(180deg, #050810 0%, #0a0e1a 50%, #050810 100%)',
      padding: '6rem 2rem',
      position: 'relative',
      overflow: 'hidden',
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '4rem',
    },
    title: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '3rem',
      fontWeight: 900,
      background: 'linear-gradient(135deg, #00fff5 0%, #00d4ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '1rem',
      textTransform: 'uppercase',
      letterSpacing: '3px',
    },
    subtitle: {
      fontFamily: "'Courier New', monospace",
      fontSize: '1.1rem',
      color: '#8892b0',
      maxWidth: '700px',
      margin: '0 auto',
      lineHeight: '1.8',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2.5rem',
      marginBottom: '4rem',
    },
    featureCard: {
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(0, 212, 255, 0.05) 100%)',
      border: '1px solid rgba(0, 212, 255, 0.2)',
      borderRadius: '16px',
      padding: '2.5rem',
      position: 'relative',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      overflow: 'hidden',
    },
    featureCardGlow: {
      position: 'absolute',
      top: '-50%',
      right: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(0, 255, 245, 0.1) 0%, transparent 70%)',
      opacity: 0,
      transition: 'opacity 0.4s ease',
    },
    featureIconWrapper: {
      width: '70px',
      height: '70px',
      background: 'rgba(0, 212, 255, 0.1)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1.5rem',
      border: '1px solid rgba(0, 212, 255, 0.3)',
      transition: 'all 0.3s ease',
    },
    featureIcon: {
      width: '36px',
      height: '36px',
      color: '#00fff5',
      filter: 'drop-shadow(0 0 8px rgba(0, 255, 245, 0.4))',
    },
    featureTitle: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '1.4rem',
      fontWeight: 700,
      color: '#00d4ff',
      marginBottom: '1rem',
      letterSpacing: '0.5px',
    },
    featureDescription: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.95rem',
      lineHeight: '1.7',
      color: '#8892b0',
      marginBottom: '1.5rem',
    },
    featureTags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
    },
    tag: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.75rem',
      padding: '0.4rem 0.8rem',
      background: 'rgba(0, 212, 255, 0.1)',
      border: '1px solid rgba(0, 212, 255, 0.3)',
      borderRadius: '6px',
      color: '#00fff5',
      letterSpacing: '0.5px',
    },
    statsSection: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      marginTop: '4rem',
      padding: '3rem',
      background: 'rgba(99, 102, 241, 0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(0, 212, 255, 0.15)',
    },
    statItem: {
      textAlign: 'center',
    },
    statNumber: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '2.5rem',
      fontWeight: 900,
      background: 'linear-gradient(135deg, #00fff5 0%, #00d4ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '0.5rem',
    },
    statLabel: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.9rem',
      color: '#8892b0',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
  };

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7V12C2 16.97 5.84 21.5 12 23C18.16 21.5 22 16.97 22 12V7L12 2Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Blockchain Evidence Chain',
      description: 'Immutable evidence logging using distributed ledger technology. Every piece of digital evidence is cryptographically signed and timestamped, ensuring tamper-proof documentation.',
      tags: ['Blockchain', 'Immutable', 'Verified'],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze patterns, detect anomalies, and identify suspicious activities across massive datasets in minutes instead of months.',
      tags: ['AI/ML', 'Pattern Recognition', 'Automated'],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 9H15M9 13H15M9 17H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Digital Evidence Vault',
      description: 'Military-grade encrypted storage for all digital evidence including files, screenshots, logs, and communications. Multi-factor authentication and role-based access control.',
      tags: ['Encrypted', 'Secure Storage', 'Compliant'],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 16V8C21 6.895 20.105 6 19 6H5C3.895 6 3 6.895 3 8V16C3 17.105 3.895 18 5 18H19C20.105 18 21 17.105 21 16Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
          <circle cx="7" cy="14" r="1" fill="currentColor"/>
        </svg>
      ),
      title: 'Network Forensics',
      description: 'Deep packet inspection and network traffic analysis. Track IP addresses, monitor data flows, and reconstruct network events with millisecond precision.',
      tags: ['Network Analysis', 'Packet Capture', 'Traffic Monitor'],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2C16.75 2 21 6.25 21 11.5Z" stroke="currentColor" strokeWidth="2"/>
          <path d="M22 22L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Malware Detection',
      description: 'Advanced sandbox environment for analyzing suspicious files. Behavioral analysis, signature matching, and heuristic detection identify known and zero-day threats.',
      tags: ['Sandbox', 'Threat Intel', 'Zero-Day'],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2"/>
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          <path d="M23 21V19C23 17.1362 21.7252 15.5701 20 15.126M16 3.12988C17.7252 3.57397 19 5.13988 19 7C19 8.86012 17.7252 10.426 16 10.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Multi-Agency Collaboration',
      description: 'Secure portal for inter-agency case sharing and coordination. Real-time collaboration tools, encrypted messaging, and unified case management across jurisdictions.',
      tags: ['Collaboration', 'Inter-Agency', 'Unified'],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4V20C4 21.1046 4.89543 22 6 22H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M18 9L13 13.5L10 10.5L6 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Real-Time Analytics',
      description: 'Comprehensive dashboards with live metrics, case statistics, and investigation progress. Customizable reports and automated notifications keep all stakeholders informed.',
      tags: ['Dashboard', 'Metrics', 'Reporting'],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      title: 'Rapid Response System',
      description: 'Instant alert mechanism for critical incidents. Automated workflows trigger immediate notifications and deploy response protocols within seconds of threat detection.',
      tags: ['Instant Alert', 'Automation', 'Priority'],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 10H22M7 14H7.01M12 14H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Mobile Forensics Suite',
      description: 'Extract and analyze data from smartphones, tablets, and IoT devices. Support for 500+ device types with deleted data recovery and app-specific analysis.',
      tags: ['Mobile', 'Data Recovery', 'iOS/Android'],
    },
  ];

  const stats = [
    { number: '99.9%', label: 'Uptime Guarantee' },
    { number: '< 2s', label: 'Average Response Time' },
    { number: '256-bit', label: 'AES Encryption' },
    { number: '24/7', label: 'Expert Support' },
  ];

  return (
    <section id="features" style={styles.featuresSection}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Advanced Features</h2>
          <p style={styles.subtitle}>
            Cutting-edge technology and forensic tools designed for modern digital investigations. 
            Trusted by law enforcement agencies worldwide.
          </p>
        </div>

        {/* Features Grid */}
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div
              key={index}
              style={styles.featureCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.borderColor = '#00fff5';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 212, 255, 0.3)';
                const glow = e.currentTarget.querySelector('.glow');
                if (glow) glow.style.opacity = '1';
                const iconWrapper = e.currentTarget.querySelector('.icon-wrapper');
                if (iconWrapper) {
                  iconWrapper.style.transform = 'scale(1.1) rotate(5deg)';
                  iconWrapper.style.background = 'rgba(0, 212, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
                const glow = e.currentTarget.querySelector('.glow');
                if (glow) glow.style.opacity = '0';
                const iconWrapper = e.currentTarget.querySelector('.icon-wrapper');
                if (iconWrapper) {
                  iconWrapper.style.transform = 'scale(1) rotate(0deg)';
                  iconWrapper.style.background = 'rgba(0, 212, 255, 0.1)';
                }
              }}
            >
              <div className="glow" style={styles.featureCardGlow}></div>
              <div className="icon-wrapper" style={styles.featureIconWrapper}>
                <div style={styles.featureIcon}>{feature.icon}</div>
              </div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureDescription}>{feature.description}</p>
              <div style={styles.featureTags}>
                {feature.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} style={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div style={styles.statsSection}>
          {stats.map((stat, index) => (
            <div key={index} style={styles.statItem}>
              <div style={styles.statNumber}>{stat.number}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
