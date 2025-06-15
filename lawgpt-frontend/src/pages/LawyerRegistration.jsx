import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/LawyerRegistration.css';

const LawyerRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Professional Information
    specialization: '',
    yearsOfExperience: '',
    barCouncilNumber: '',
    barCouncilState: '',
    practiceAreas: [],
    languages: [],
    consultationFee: '',
    bio: '',
    
    // Verification Documents
    barCouncilCertificate: null,
    identityProof: null,
    addressProof: null,
    profilePicture: null
  });

  const steps = [
    {
      title: 'Personal Information',
      description: 'Please provide your personal details'
    },
    {
      title: 'Professional Information',
      description: 'Tell us about your professional background'
    },
    {
      title: 'Verification Documents',
      description: 'Upload required documents for verification'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  const handleMultiSelect = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    
    setFormData(prev => ({
      ...prev,
      [name]: selectedValues
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Handle form submission
      console.log('Form submitted:', formData);
      navigate('/lawyers');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h3>Professional Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Specialization</label>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Specialization</option>
                  <option value="Criminal Law">Criminal Law</option>
                  <option value="Family Law">Family Law</option>
                  <option value="Property Law">Property Law</option>
                  <option value="Corporate Law">Corporate Law</option>
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
              <div className="form-group">
                <label>Years of Experience</label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Bar Council Number</label>
                <input
                  type="text"
                  name="barCouncilNumber"
                  value={formData.barCouncilNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Bar Council State</label>
                <input
                  type="text"
                  name="barCouncilState"
                  value={formData.barCouncilState}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Practice Areas</label>
                <select
                  name="practiceAreas"
                  multiple
                  value={formData.practiceAreas}
                  onChange={handleMultiSelect}
                  required
                >
                  <option value="Criminal Cases">Criminal Cases</option>
                  <option value="Divorce">Divorce</option>
                  <option value="Property Disputes">Property Disputes</option>
                  <option value="Corporate Matters">Corporate Matters</option>
                  <option value="Civil Litigation">Civil Litigation</option>
                  <option value="Cyber Crime">Cyber Crime</option>
                  <option value="Taxation">Taxation</option>
                  <option value="Labor Disputes">Labor Disputes</option>
                  <option value="Environmental Issues">Environmental Issues</option>
                  <option value="Immigration">Immigration</option>
                  <option value="IPR">IPR</option>
                  <option value="Constitutional Matters">Constitutional Matters</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Languages</label>
                <select
                  name="languages"
                  multiple
                  value={formData.languages}
                  onChange={handleMultiSelect}
                  required
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Gujarati">Gujarati</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Punjabi">Punjabi</option>
                </select>
              </div>
              <div className="form-group">
                <label>Consultation Fee (₹)</label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Professional Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h3>Verification Documents</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Bar Council Certificate</label>
                <input
                  type="file"
                  name="barCouncilCertificate"
                  onChange={handleInputChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
                <p className="file-hint">Upload PDF, JPG, or PNG file</p>
              </div>
              <div className="form-group full-width">
                <label>Identity Proof (Aadhar/PAN/Passport)</label>
                <input
                  type="file"
                  name="identityProof"
                  onChange={handleInputChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
                <p className="file-hint">Upload PDF, JPG, or PNG file</p>
              </div>
              <div className="form-group full-width">
                <label>Address Proof</label>
                <input
                  type="file"
                  name="addressProof"
                  onChange={handleInputChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
                <p className="file-hint">Upload PDF, JPG, or PNG file</p>
              </div>
              <div className="form-group full-width">
                <label>Profile Picture</label>
                <input
                  type="file"
                  name="profilePicture"
                  onChange={handleInputChange}
                  accept=".jpg,.jpeg,.png"
                  required
                />
                <p className="file-hint">Upload JPG or PNG file</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-container">
        <div className="steps-indicator">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step ${currentStep === index + 1 ? 'active' : ''} ${
                currentStep > index + 1 ? 'completed' : ''
              }`}
            >
              <div className="step-number">{index + 1}</div>
              <div className="step-info">
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        <div className="form-actions">
          {currentStep > 1 && (
            <button className="back-button" onClick={handleBack}>
              Back
            </button>
          )}
          <button className="next-button" onClick={handleNext}>
            {currentStep === 3 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LawyerRegistration; 