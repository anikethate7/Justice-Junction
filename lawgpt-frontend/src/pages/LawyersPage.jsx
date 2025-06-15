import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/LawyersPage.css';
import FaviconLoader from '../components/shared/Loaders';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const LawyersPage = () => {
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [specialization, setSpecialization] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [minExperience, setMinExperience] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Specializations array
  const specializations = [
    'Criminal Law', 'Family Law', 'Property Law', 'Corporate Law',
    'Civil Law', 'Cyber Law', 'Tax Law', 'Labor Law',
    'Environmental Law', 'Immigration Law', 'Intellectual Property', 'Constitutional Law'
  ];

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    },
    exit: { opacity: 0 }
  };
  
  // Card animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.02)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10
      }
    }
  };
  
  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  useEffect(() => {
    const fetchLawyers = async () => {
      // Only show loader after a small delay to prevent flashing
      const loaderTimeout = setTimeout(() => {
        if (initialLoad) setLoading(true);
      }, 100);
      
      setError(null);
      
      try {
        const params = new URLSearchParams();
        if (specialization) params.append('specialization', specialization);
        if (minExperience > 0) params.append('min_experience', minExperience);
        if (searchQuery) params.append('search', searchQuery);
        params.append('sort_by', sortBy);

        const response = await axios.get(`${API_BASE_URL}/lawyers/?${params.toString()}`);
        
        if (response.status === 200) {
          setLawyers(response.data);
          setLoading(false);
          setInitialLoad(false);
        } else {
          throw new Error('Failed to fetch lawyers');
        }
      } catch (err) {
        console.error('Error fetching lawyers:', err);
        
        if (import.meta.env.DEV) {
          console.log('Falling back to mock data in development mode');
          setLawyers(mockLawyers);
          setLoading(false);
          setInitialLoad(false);
          setError(null); // Clear error when using mock data
        } else {
          setError('Failed to load lawyers. Please try again later.');
          setLoading(false);
          setInitialLoad(false);
        }
      }
      
      // Clear the timeout in case the request finishes quickly
      clearTimeout(loaderTimeout);
    };
    
    fetchLawyers();
    
    // Cleanup function to clear any pending timeouts
    return () => {
      // Any cleanup needed
    };
  }, [specialization, minExperience, sortBy, searchQuery]);

  const handleViewProfile = (lawyerId) => {
    navigate(`/lawyers/${lawyerId}`);
  };

  const handleStartChat = (lawyerId) => {
    navigate(`/chat/lawyer/${lawyerId}`);
  };

  if (loading) {
    return (
      <div className="lawyer-loading-container">
        <FaviconLoader size="lg" fullScreen={false} />
      </div>
    );
  }

  if (error && !loading) {
    return (
      <motion.div 
        className="lawyer-error"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <i className="bi bi-exclamation-triangle"></i>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <motion.button 
          onClick={() => {
            setLoading(true);
            setError(null);
            // Trigger refetch by updating a dependency
            setSortBy(prev => prev === 'rating' ? 'name' : 'rating');
            setTimeout(() => setSortBy('rating'), 100);
          }} 
          className="retry-btn"
          whileHover={{ scale: 1.05, backgroundColor: "#3730a3" }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="lawyer-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header Section */}
      <motion.header 
        className="lawyer-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="lawyer-header-content">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          >
            Find <span style={{ fontWeight: 400 }}>Legal</span> Expertise
          </motion.h1>
          <motion.p
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
          >
            Connect with top-rated lawyers specializing in various legal fields
          </motion.p>
          
          <motion.form 
            className="search-container"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8, type: "spring", stiffness: 100, damping: 15 }}
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="search-input-wrapper">
              <motion.i 
                className="bi bi-search"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.i>
              <input
                type="text"
                placeholder="Search by name, specialization or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
              />
              {searchQuery && (
                <motion.button 
                  className="clear-search-btn" 
                  onClick={() => setSearchQuery('')}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(99, 102, 241, 0.15)" }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                >
                  <i className="bi bi-x"></i>
                </motion.button>
              )}
            </div>
          </motion.form>
        </div>
      </motion.header>
      
      {/* Main Content */}
      <main className="lawyer-main">
        <div className="lawyer-container">
          {/* Sidebar Filters */}
          <motion.aside 
            className="lawyer-sidebar"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, type: "spring" }}
          >
            <motion.div 
              className="filter-section"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <h3>Filters</h3>
              
              <motion.div 
                className="filter-group"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.7 }}
              >
                <label htmlFor="specialization">Specialization</label>
                <select 
                  id="specialization"
                  value={specialization} 
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  <option value="">All Specializations</option>
                  {specializations.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </motion.div>
              
              <motion.div 
                className="filter-group"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.8 }}
              >
                <label htmlFor="experience">Minimum Experience</label>
                <select 
                  id="experience"
                  value={minExperience} 
                  onChange={(e) => setMinExperience(Number(e.target.value))}
                >
                  <option value="0">Any Experience</option>
                  <option value="2">2+ Years</option>
                  <option value="5">5+ Years</option>
                  <option value="10">10+ Years</option>
                  <option value="15">15+ Years</option>
                </select>
              </motion.div>
              
              <motion.div 
                className="filter-group"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.9 }}
              >
                <label htmlFor="sortBy">Sort By</label>
                <select 
                  id="sortBy"
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating">Highest Rating</option>
                  <option value="experience">Most Experienced</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </motion.div>
              
              <motion.button 
                className="reset-btn"
                onClick={() => {
                  setSpecialization('');
                  setSortBy('rating');
                  setMinExperience(0);
                  setSearchQuery('');
                }}
                whileHover={{ y: -3, backgroundColor: "#4361ee", color: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
              >
                Reset Filters
              </motion.button>
            </motion.div>
            
            <motion.div 
              className="view-toggle"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              whileHover={{ y: -3 }}
            >
              <motion.button 
                className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                whileHover={{ scale: viewMode !== 'grid' ? 1.1 : 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="bi bi-grid"></i>
              </motion.button>
              <motion.button 
                className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                whileHover={{ scale: viewMode !== 'list' ? 1.1 : 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="bi bi-list-ul"></i>
              </motion.button>
            </motion.div>
          </motion.aside>
          
          {/* Lawyer List */}
          <motion.section 
            className="lawyer-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div 
              className="results-header"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <h2>
                {lawyers.length > 0 
                  ? `Found ${lawyers.length} lawyers${specialization ? ` in ${specialization}` : ''}`
                  : 'No lawyers found'
                }
              </h2>
            </motion.div>
            
            {lawyers.length === 0 ? (
              <motion.div 
                className="no-results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              >
                <i className="bi bi-search"></i>
                <h3>No lawyers match your criteria</h3>
                <p>Try adjusting your filters or search terms</p>
              </motion.div>
            ) : (
              <motion.div 
                className={`lawyer-${viewMode}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <AnimatePresence>
                  {lawyers.map((lawyer, index) => (
                    <motion.div 
                      key={lawyer.id} 
                      className="lawyer-card"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: 20 }}
                      whileHover="hover"
                      custom={index}
                    >
                      <div className="lawyer-card-top">
                        <motion.div 
                          className="lawyer-avatar"
                          whileHover={{ scale: 1.05 }}
                        >
                          {lawyer.avatar ? (
                            <motion.img 
                              src={lawyer.avatar} 
                              alt={`${lawyer.name} avatar`}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            />
                          ) : (
                            <motion.div 
                              className="lawyer-avatar-placeholder"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              {lawyer.name.charAt(0)}
                            </motion.div>
                          )}
                          {lawyer.online && <span className="online-indicator"></span>}
                        </motion.div>
                        
                        <div className="lawyer-name-area">
                          <h3>{lawyer.name}</h3>
                          <div className="lawyer-specialty">{lawyer.specialization}</div>
                          
                          <div className="lawyer-rating">
                            <span className="stars">{lawyer.rating.toFixed(1)}</span>
                            <span className="review-count">({lawyer.reviewCount || 0})</span>
                            {lawyer.verified && (
                              <motion.span 
                                className="verified-badge" 
                                title="Verified Lawyer"
                                whileHover={{ scale: 1.3 }}
                                animate={{ 
                                  rotateY: [0, 360],
                                }}
                                transition={{ 
                                  rotateY: { repeat: Infinity, duration: 3, ease: "linear" },
                                  scale: { duration: 0.2 }
                                }}
                              >
                                <i className="bi bi-patch-check-fill"></i>
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="lawyer-card-details">
                        <motion.div 
                          className="lawyer-detail"
                          whileHover={{ x: 5 }}
                        >
                          <i className="bi bi-briefcase"></i>
                          <span>{lawyer.experience}+ years experience</span>
                        </motion.div>
                        
                        <motion.div 
                          className="lawyer-detail"
                          whileHover={{ x: 5 }}
                        >
                          <i className="bi bi-geo-alt"></i>
                          <span>{lawyer.location || 'Location not specified'}</span>
                        </motion.div>
                        
                        {lawyer.feesRange && (
                          <motion.div 
                            className="lawyer-detail"
                            whileHover={{ x: 5 }}
                          >
                            <i className="bi bi-currency-rupee"></i>
                            <span>{lawyer.feesRange}</span>
                          </motion.div>
                        )}
                        
                        {viewMode === 'list' && lawyer.bio && (
                          <motion.div 
                            className="lawyer-bio"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            <p>{lawyer.bio.substring(0, 150)}...</p>
                          </motion.div>
                        )}
                      </div>
                      
                      <div className="lawyer-card-actions">
                        <motion.button 
                          className="profile-btn"
                          onClick={() => handleViewProfile(lawyer.id)}
                          whileHover={{ y: -3, backgroundColor: "#4361ee", color: "#ffffff" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <i className="bi bi-person me-2"></i>
                          View Profile
                        </motion.button>
                        
                        <motion.button 
                          className={`chat-btn ${!lawyer.online ? 'disabled' : ''}`}
                          onClick={() => lawyer.online && handleStartChat(lawyer.id)}
                          disabled={!lawyer.online}
                          whileHover={lawyer.online ? { 
                            y: -3,
                            boxShadow: "0 10px 20px rgba(67, 97, 238, 0.3)"
                          } : {}}
                          whileTap={lawyer.online ? { scale: 0.95 } : {}}
                        >
                          <i className={`bi ${lawyer.online ? 'bi-chat-dots' : 'bi-clock'} me-2`}></i>
                          {lawyer.online ? 'Chat Now' : 'Offline'}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.section>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <motion.button 
            type="button"
            className="footer-register-btn"
            onClick={() => navigate('/lawyer-registration')}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.97 }}
          >
            <i className="bi bi-person-plus me-2"></i>
            Register as a Lawyer
          </motion.button>
        </motion.div>
      </main>
    </motion.div>
  );
};

// Mock data for development and fallback
const mockLawyers = [
  {
    id: 1,
    name: 'Adv. Rahul Sharma',
    specialization: 'Criminal Law',
    experience: 12,
    rating: 4.8,
    reviewCount: 52,
    languages: ['English', 'Hindi', 'Marathi'],
    location: 'Mumbai, Maharashtra',
    online: true,
    verified: true,
    bio: 'Experienced criminal lawyer with expertise in handling serious criminal cases, bail applications, and appeals. Former public prosecutor with excellent track record.',
    profilePicture: null,
    allowOfflineMessages: true
  },
  {
    id: 2,
    name: 'Adv. Priya Patel',
    specialization: 'Family Law',
    experience: 8,
    rating: 4.9,
    reviewCount: 47,
    languages: ['English', 'Gujarati', 'Hindi'],
    location: 'Ahmedabad, Gujarat',
    online: false,
    verified: true,
    bio: 'Dedicated family lawyer specializing in divorce, child custody, maintenance, and domestic violence cases with compassionate approach to sensitive family matters.',
    profilePicture: null,
    allowOfflineMessages: true
  },
  {
    id: 3,
    name: 'Adv. Vikram Singh',
    specialization: 'Corporate Law',
    experience: 15,
    rating: 4.7,
    reviewCount: 38,
    languages: ['English', 'Hindi', 'Punjabi'],
    location: 'Delhi, NCR',
    online: true,
    verified: true,
    bio: 'Corporate lawyer with extensive experience in mergers & acquisitions, company formation, corporate governance, and commercial contracts for businesses of all sizes.',
    profilePicture: null,
    allowOfflineMessages: true
  },
  {
    id: 4,
    name: 'Adv. Sanjay Mehta',
    specialization: 'Property Law',
    experience: 10,
    rating: 4.5,
    reviewCount: 31,
    languages: ['English', 'Hindi'],
    location: 'Bangalore, Karnataka',
    online: true,
    verified: true,
    bio: 'Property law specialist with expertise in real estate transactions, property disputes, tenant-landlord issues, and documentation review.',
    profilePicture: null,
    allowOfflineMessages: true
  },
  {
    id: 5,
    name: 'Adv. Deepa Joshi',
    specialization: 'Family Law',
    experience: 6,
    rating: 4.6,
    reviewCount: 28,
    languages: ['English', 'Hindi', 'Kannada'],
    location: 'Pune, Maharashtra',
    online: false,
    verified: true,
    bio: 'Family law practitioner focused on providing supportive legal counsel for divorce proceedings, child custody matters, and domestic issues.',
    profilePicture: null,
    allowOfflineMessages: true
  },
  {
    id: 6,
    name: 'Adv. Arjun Kapoor',
    specialization: 'Criminal Law',
    experience: 9,
    rating: 4.4,
    reviewCount: 22,
    languages: ['English', 'Hindi', 'Bengali'],
    location: 'Kolkata, West Bengal',
    online: true,
    verified: true,
    bio: 'Criminal defense attorney handling all types of criminal cases from petty offenses to serious crimes with focus on client rights and fair representation.',
    profilePicture: null,
    allowOfflineMessages: false
  }
];

export default LawyersPage; 