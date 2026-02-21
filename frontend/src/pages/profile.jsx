import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    occupation: '',
    organization: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [savedProfile, setSavedProfile] = useState(null);

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
      const payload = { ...formData };
      if (payload.age) payload.age = Number(payload.age);
      Object.keys(payload).forEach((k) => {
        if (payload[k] === '') delete payload[k];
      });

      const res = await axios.post(`${API_URL}/api/profiles`, payload);
      setSavedProfile(res.data.profile);
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create profile. Make sure the backend server is running.';
      if (err.response?.status === 409) {
        setSavedProfile(err.response.data.profile);
        setSuccess(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

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
    sectionLabel: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '0.9rem',
      color: '#00fff5',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '1.5rem',
      paddingBottom: '0.5rem',
      borderBottom: '1px solid rgba(0, 212, 255, 0.15)',
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
      fontSize: '0.75rem',
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
      opacity: 1,
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
    successCard: {
      background: 'rgba(0, 212, 255, 0.05)',
      border: '1px solid rgba(0, 212, 255, 0.3)',
      borderRadius: '16px',
      padding: '4rem 3rem',
      textAlign: 'center',
    },
    successIcon: {
      width: '80px',
      height: '80px',
      color: '#00fff5',
      margin: '0 auto 2rem',
      filter: 'drop-shadow(0 0 20px rgba(0, 255, 245, 0.4))',
    },
    successTitle: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '1.8rem',
      fontWeight: 900,
      color: '#00fff5',
      marginBottom: '1rem',
    },
    successText: {
      fontFamily: "'Courier New', monospace",
      fontSize: '1rem',
      color: '#8892b0',
      lineHeight: 1.6,
      marginBottom: '0.5rem',
    },
    profileId: {
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '0.85rem',
      color: '#00d4ff',
      background: 'rgba(0, 212, 255, 0.1)',
      padding: '0.5rem 1rem',
      borderRadius: '6px',
      display: 'inline-block',
      marginBottom: '2rem',
      letterSpacing: '1px',
    },
    actionBtns: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    primaryBtn: {
      padding: '0.85rem 2rem',
      background: 'linear-gradient(135deg, #00d4ff 0%, #00fff5 100%)',
      color: '#0a0e1a',
      border: 'none',
      borderRadius: '8px',
      fontFamily: "'Orbitron', 'Arial Black', sans-serif",
      fontSize: '0.85rem',
      fontWeight: 700,
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    secondaryBtn: {
      padding: '0.85rem 2rem',
      background: 'transparent',
      color: '#00fff5',
      border: '1px solid rgba(0, 212, 255, 0.4)',
      borderRadius: '8px',
      fontFamily: "'Courier New', monospace",
      fontSize: '0.85rem',
      cursor: 'pointer',
    },
  };

  const focusHandler = (e) => (e.target.style.borderColor = '#00fff5');
  const blurHandler = (e) => (e.target.style.borderColor = 'rgba(0, 212, 255, 0.25)');

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.successCard}>
            <svg style={styles.successIcon} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M6 21C6 17.134 8.686 14 12 14C15.314 14 18 17.134 18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M16 6L18 8L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h2 style={styles.successTitle}>Profile Created</h2>
            <p style={styles.successText}>
              Your profile has been securely stored in our system.
            </p>
            {savedProfile && (
              <div style={styles.profileId}>ID: {savedProfile._id}</div>
            )}
            <div style={styles.actionBtns}>
              <button style={styles.primaryBtn} onClick={() => navigate('/register-complaint')}>
                File a Complaint
              </button>
              <button style={styles.secondaryBtn} onClick={() => navigate('/')}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create Profile</h1>
          <p style={styles.subtitle}>
            Register your profile to file complaints and track investigations. Your data is encrypted end-to-end.
          </p>
        </div>

        <form style={styles.form} onSubmit={handleSubmit}>
          {error && <div style={styles.errorBox}>{error}</div>}

          <div style={styles.sectionLabel}>Personal Information</div>

          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name <span style={styles.required}>*</span></label>
              <input style={styles.input} type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" required onFocus={focusHandler} onBlur={blurHandler} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email <span style={styles.required}>*</span></label>
              <input style={styles.input} type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required onFocus={focusHandler} onBlur={blurHandler} />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Phone <span style={styles.required}>*</span></label>
              <input style={styles.input} type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" required onFocus={focusHandler} onBlur={blurHandler} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Age</label>
              <input style={styles.input} type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Your age" min="1" max="150" onFocus={focusHandler} onBlur={blurHandler} />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Gender</label>
              <select style={styles.select} name="gender" value={formData.gender} onChange={handleChange} onFocus={focusHandler} onBlur={blurHandler}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Occupation</label>
              <input style={styles.input} type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Your occupation" onFocus={focusHandler} onBlur={blurHandler} />
            </div>
          </div>

          <div style={styles.sectionLabel}>Address Details</div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Address</label>
            <input style={styles.input} type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street address" onFocus={focusHandler} onBlur={blurHandler} />
          </div>

          <div style={styles.row}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>City</label>
              <input style={styles.input} type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" onFocus={focusHandler} onBlur={blurHandler} />
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>State</label>
              <input style={styles.input} type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" onFocus={focusHandler} onBlur={blurHandler} />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Organization</label>
            <input style={styles.input} type="text" name="organization" value={formData.organization} onChange={handleChange} placeholder="Company / Organization (optional)" onFocus={focusHandler} onBlur={blurHandler} />
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
              {loading ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
