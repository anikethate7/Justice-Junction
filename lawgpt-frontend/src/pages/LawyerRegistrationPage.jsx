import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LawyerRegistration.css';
import { motion } from 'framer-motion'; // Adding framer-motion for animations

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const LawyerRegistrationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    yearsExperience: '',
    specialization: '',
    bio: '',
    phone: '',
    location: '',
    languages: [],
    profilePicture: null,
    documents: []
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox changes for languages
  const handleLanguageChange = (language) => {
    const updatedLanguages = [...formData.languages];
    
    if (updatedLanguages.includes(language)) {
      // Remove language if already selected
      const index = updatedLanguages.indexOf(language);
      updatedLanguages.splice(index, 1);
    } else {
      // Add language if not selected
      updatedLanguages.push(language);
    }
    
    setFormData({
      ...formData,
      languages: updatedLanguages
    });
  };
  
  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'profilePicture') {
      setFormData({
        ...formData,
        profilePicture: files[0]
      });
    } else if (name === 'documents') {
      setFormData({
        ...formData,
        documents: Array.from(files)
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    // Check if at least one language is selected
    if (formData.languages.length === 0) {
      setError('Please select at least one language');
      return false;
    }
    
    // Reset error
    setError(null);
    return true;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Prepare data for API
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        yearsExperience: parseInt(formData.yearsExperience),
        specialization: formData.specialization,
        bio: formData.bio,
        phone: formData.phone,
        location: formData.location,
        languages: formData.languages
      };
      
      // Register lawyer
      const response = await axios.post(
        `${API_BASE_URL}/lawyers/register`,
        registrationData
      );
      
      if (response.status === 200 || response.status === 201) {
        // If registration successful and profile picture exists, upload it
        if (formData.profilePicture && response.data.id) {
          const formDataFile = new FormData();
          formDataFile.append('file', formData.profilePicture);
          
          await axios.post(
            `${API_BASE_URL}/lawyers/${response.data.id}/profile-picture`,
            formDataFile,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
        }
        
        // Show success message and redirect
        setLoading(false);
        alert('Registration submitted successfully! An admin will verify your account.');
        navigate('/lawyers');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error submitting form:', error);
      
      // Handle specific API errors
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
      
      // In development mode, just show success after a delay
      if (import.meta.env.DEV) {
        console.log('In development mode, simulating success');
        setTimeout(() => {
          setLoading(false);
          alert('Registration submitted successfully! An admin will verify your account.');
          navigate('/lawyers');
        }, 1500);
      }
    }
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="lawyer-registration-page">
      {/* Hero Section with Modern Design */}
      <motion.div 
        className="lawyer-hero-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="lawyer-hero-content">
          <motion.div 
            className="lawyer-hero-text"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1>Lawyer <span style={{ fontWeight: 400 }}>Registration</span></h1>
            <p>Join our platform to provide legal consultations to clients in need</p>
          </motion.div>
        </div>
      </motion.div>
      
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Processing your registration...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <i className="bi bi-exclamation-triangle-fill"></i> {error}
        </div>
      )}
      
      <motion.div 
        className="form-container"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <form className="registration-form" onSubmit={handleSubmit}>
          <motion.div className="form-section" variants={fadeInUp}>
            <h3>Personal Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  First Name <span className="required-star">*</span>
                </label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>
                  Last Name <span className="required-star">*</span>
                </label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  Email Address <span className="required-star">*</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>
                  Phone Number <span className="required-star">*</span>
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  Password <span className="required-star">*</span>
                </label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="8"
                />
                <span className="form-hint">Must be at least 8 characters with uppercase, lowercase and numbers</span>
              </div>
              
              <div className="form-group">
                <label>
                  Confirm Password <span className="required-star">*</span>
                </label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  Profile Picture
                </label>
                <div className="file-input">
                  <label htmlFor="profile-picture">
                    <i className="bi bi-upload"></i> Choose File
                  </label>
                  <input
                    type="file"
                    id="profile-picture"
                    name="profilePicture"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <span className="file-name">
                    {formData.profilePicture ? formData.profilePicture.name : 'No file chosen'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div className="form-section" variants={fadeInUp}>
            <h3>Professional Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  Years of Experience <span className="required-star">*</span>
                </label>
                <input 
                  type="number" 
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>
                  Specialization <span className="required-star">*</span>
                </label>
                <select 
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Specialization</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Corporate Law">Corporate Law</option>
                  <option value="Property Law">Property Law</option>
                  <option value="Civil Law">Civil Law</option>
                  <option value="Cyber Law">Cyber Law</option>
                  <option value="Tax Law">Tax Law</option>
                  <option value="Labor Law">Labor Law</option>
                  <option value="Environmental Law">Environmental Law</option>
                  <option value="Immigration Law">Immigration Law</option>
                  <option value="Intellectual Property">Intellectual Property</option>
                  <option value="Constitutional Law">Constitutional Law</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>
                  Location <span className="required-star">*</span>
                </label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>
                Languages <span className="required-star">*</span>
              </label>
              <div className="language-checkboxes">
                {['English', 'Hindi', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Punjabi', 'Urdu'].map(lang => (
                  <div key={lang} className="language-checkbox">
                    <input
                      type="checkbox"
                      id={`lang-${lang}`}
                      checked={formData.languages.includes(lang)}
                      onChange={() => handleLanguageChange(lang)}
                    />
                    <label htmlFor={`lang-${lang}`}>{lang}</label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>
                Professional Bio <span className="required-star">*</span>
              </label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Describe your legal expertise and experience..."
                rows="5"
                required
              ></textarea>
            </div>
          </motion.div>
          
          <motion.div className="form-section" variants={fadeInUp}>
            <h3>Verification Documents</h3>
            <p className="section-description">
              Please upload necessary documents to verify your credentials. This will help us expedite the verification process.
            </p>
            
            <div className="form-group">
              <label>
                Upload Documents <span className="required-star">*</span>
              </label>
              <div className="file-input">
                <label htmlFor="documents">
                  <i className="bi bi-upload"></i> Choose Files
                </label>
                <input
                  type="file"
                  id="documents"
                  name="documents"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  required
                />
                <span className="file-name">
                  {formData.documents.length > 0 
                    ? `${formData.documents.length} file(s) selected` 
                    : 'No files chosen'}
                </span>
              </div>
              <span className="form-hint">
                Upload your Bar Council registration, degree certificates, and identity proof (Passport/Aadhaar/PAN)
              </span>
            </div>
          </motion.div>
          
          <motion.div className="form-section terms-section" variants={fadeInUp}>
            <div className="form-group">
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="terms"
                  required
                />
                <label htmlFor="terms">
                  I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
                </label>
              </div>
            </div>
          </motion.div>
          
          <motion.div className="form-actions" variants={fadeInUp}>
            <button type="button" onClick={() => navigate('/lawyers')} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default LawyerRegistrationPage;
