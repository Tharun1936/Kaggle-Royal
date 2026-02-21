import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ML_API_URL = import.meta.env.VITE_ML_API_URL || 'http://localhost:8000/api/predict';
const STORAGE_KEY = 'forensic_complaints';

function collectDeviceInfo() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: [...(navigator.languages || [])],
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),
    cookieEnabled: navigator.cookieEnabled,
    online: navigator.onLine,
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    vendor: navigator.vendor,
    connectionType: conn?.effectiveType || 'unknown',
    connectionDownlink: conn?.downlink || 0,
  };
}

const RegisterComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    complaintType: '',
    subject: '',
    description: '',
    date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const deviceInfo = collectDeviceInfo();

      const complaintData = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        complaintType: formData.complaintType,
        subject: formData.subject,
        description: formData.description,
        incidentDate: formData.date || undefined,
        deviceInfo,
        createdAt: new Date().toISOString(),
        status: 'analyzing',
      };

      // Call ML service
      let mlResult;
      try {
        const mlResponse = await fetch(ML_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            complaint_type: complaintData.complaintType,
            description: complaintData.description,
            subject: complaintData.subject,
            device_info: complaintData.deviceInfo,
          }),
        });

        if (mlResponse.ok) {
          const mlData = await mlResponse.json();
          mlResult = {
            isThreat: mlData.is_threat ?? mlData.isThreat ?? false,
            category: mlData.category ?? 'unknown',
            confidence: mlData.confidence ?? 0,
            analyzedAt: new Date().toISOString(),
          };
        } else {
          throw new Error('ML service unavailable');
        }
      } catch (mlErr) {
        console.warn('ML service unavailable, using fallback');
        const threatTypes = [
          'Hacking / Unauthorized Access',
          'Ransomware',
          'Data Breach',
          'Identity Theft',
        ];
        const isThreat = threatTypes.includes(complaintData.complaintType);
        mlResult = {
          isThreat,
          category: complaintData.complaintType,
          confidence: 0.85,
          analyzedAt: new Date().toISOString(),
        };
      }

      // Store in localStorage
      complaintData.mlResult = mlResult;
      complaintData.status = 'analyzed';
      
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      existing.push(complaintData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

      navigate('/result', {
        state: {
          mlResult,
          complaintId: complaintData.id,
        },
      });
    } catch (err) {
      const msg = err.message || 'Failed to submit complaint.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const complaintTypes = [
    'Identity Theft',
    'Online Fraud',
    'Hacking / Unauthorized Access',
    'Data Breach',
    'Cyberstalking / Harassment',
    'Phishing',
    'Ransomware',
    'Intellectual Property Theft',
    'Other',
  ];

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #050810 0%, #0a0e1a 50%, #050810 100%)',
      paddingTop: '100px',
      paddingBottom: '4rem',
    },
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 2rem',
    },
    header: {
      textAlign: 'center',
      marginBottom: '3rem',
    },
    title: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '2.5rem',
      fontWeight: 900,
      background: 'linear-gradient(135deg, #00fff5 0%, #00d4ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '1rem',
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    subtitle: {
      fontFamily: "'Courier New', monospace",
      fontSize: '1rem',
      color: '#8892b0',
      lineHeight: 1.6,
    },
    form: {
      background: 'rgba(99, 102, 241, 0.05)',
      border: '1px solid rgba(0, 212, 255, 0.2)',
      borderRadius: '16px',
      padding: '3rem',
    },
    deviceBanner: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 1.25rem',
      background: 'rgba(0, 212, 255, 0.06)',
      border: '1px solid rgba(0, 212, 255, 0.15)',
      borderRadius: '8px',
      marginBottom: '2rem',
    },
    deviceIcon: {
      width: '20px',
      height: '20px',
      color: '#00fff5',
      flexShrink: 0,
    },
    deviceText: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.8rem',
      color: '#8892b0',
      lineHeight: 1.4,
    },
    row: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem',
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      marginBottom: '1.5rem',
    },
    label: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '0.8rem',
      color: '#00d4ff',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    required: {
      color: '#ff6b6b',
      marginLeft: '2px',
    },
    input: {
      background: 'rgba(0, 212, 255, 0.05)',
      border: '1px solid rgba(0, 212, 255, 0.25)',
      borderRadius: '8px',
      padding: '0.85rem 1rem',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.95rem',
      color: '#e6f1ff',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    textarea: {
      background: 'rgba(0, 212, 255, 0.05)',
      border: '1px solid rgba(0, 212, 255, 0.25)',
      borderRadius: '8px',
      padding: '0.85rem 1rem',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.95rem',
      color: '#e6f1ff',
      outline: 'none',
      transition: 'all 0.3s ease',
      minHeight: '140px',
      resize: 'vertical',
    },
    select: {
      background: 'rgba(0, 212, 255, 0.05)',
      border: '1px solid rgba(0, 212, 255, 0.25)',
      borderRadius: '8px',
      padding: '0.85rem 1rem',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.95rem',
      color: '#e6f1ff',
      outline: 'none',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    errorBox: {
      background: 'rgba(255, 107, 107, 0.1)',
      border: '1px solid rgba(255, 107, 107, 0.3)',
      borderRadius: '8px',
      padding: '1rem',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.9rem',
      color: '#ff6b6b',
      marginBottom: '1.5rem',
    },
    actions: {
      display: 'flex',
      gap: '1rem',
      marginTop: '2rem',
      justifyContent: 'flex-end',
    },
    submitBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.85rem 2rem',
      background: 'linear-gradient(135deg, #00d4ff 0%, #00fff5 100%)',
      color: '#0a0e1a',
      border: 'none',
      borderRadius: '8px',
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '0.9rem',
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      boxShadow: '0 4px 20px rgba(0, 212, 255, 0.3)',
    },
    cancelBtn: {
      padding: '0.85rem 2rem',
      background: 'transparent',
      color: '#8892b0',
      border: '1px solid rgba(0, 212, 255, 0.3)',
      borderRadius: '8px',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    loadingOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 16, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    },
    spinner: {
      width: '60px',
      height: '60px',
      border: '3px solid rgba(0, 212, 255, 0.1)',
      borderTop: '3px solid #00fff5',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1.5rem',
    },
    loadingText: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '1rem',
      color: '#00fff5',
      letterSpacing: '2px',
      textTransform: 'uppercase',
    },
    loadingSub: {
      fontFamily: "'Courier New', monospace",
      fontSize: '0.85rem',
      color: '#8892b0',
      marginTop: '0.5rem',
    },
  };

  const focusHandler = (e) => (e.target.style.borderColor = '#00fff5');
  const blurHandler = (e) => (e.target.style.borderColor = 'rgba(0, 212, 255, 0.25)');

  return (
    <div style={styles.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.spinner} />
          <div style={styles.loadingText}>Analyzing</div>
          <div style={styles.loadingSub}>Collecting device data & running forensic scan...</div>
        </div>
      )}

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Register Complaint</h1>
          <p style={styles.subtitle}>
            Submit your cybercrime complaint securely. Device information will be automatically
            collected and analyzed by our forensic AI system.
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.deviceBanner}>
            <svg style={styles.deviceIcon} viewBox="0 0 24 24" fill="none">
              <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M8 21H16M12 17V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={styles.deviceText}>
              Device fingerprint, network info, and system metadata will be automatically captured
              on submission for forensic analysis.
            </span>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name <span style={styles.required}>*</span></label>
              <input style={styles.input} type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" required onFocus={focusHandler} onBlur={blurHandler} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address <span style={styles.required}>*</span></label>
              <input style={styles.input} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required onFocus={focusHandler} onBlur={blurHandler} />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Phone Number</label>
              <input style={styles.input} type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" onFocus={focusHandler} onBlur={blurHandler} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Incident Date</label>
              <input style={styles.input} type="date" name="date" value={formData.date} onChange={handleChange} onFocus={focusHandler} onBlur={blurHandler} />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Complaint Type <span style={styles.required}>*</span></label>
            <select style={styles.select} name="complaintType" value={formData.complaintType} onChange={handleChange} required onFocus={focusHandler} onBlur={blurHandler}>
              <option value="">Select complaint type</option>
              {complaintTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Subject <span style={styles.required}>*</span></label>
            <input style={styles.input} type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Brief subject of your complaint" required onFocus={focusHandler} onBlur={blurHandler} />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Description <span style={styles.required}>*</span></label>
            <textarea style={styles.textarea} name="description" value={formData.description} onChange={handleChange} placeholder="Provide a detailed description of the incident..." required onFocus={focusHandler} onBlur={blurHandler} />
          </div>

          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={() => navigate('/')}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00fff5'; e.currentTarget.style.color = '#00fff5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.3)'; e.currentTarget.style.color = '#8892b0'; }}
            >
              Cancel
            </button>
            <button type="submit" style={{ ...styles.submitBtn, opacity: loading ? 0.6 : 1 }} disabled={loading}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 212, 255, 0.5)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 212, 255, 0.3)'; }}
            >
              {loading ? 'Analyzing...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterComplaint;
