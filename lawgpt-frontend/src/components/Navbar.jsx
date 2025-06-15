import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navigate = useNavigate();
  const location = useLocation();
  
  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        window.scrollTo({
          top: section.offsetTop - 80, // Adjust for navbar height
          behavior: 'smooth'
        });
        setActiveSection(sectionId);
      }
    }
    setIsMenuOpen(false);
  };
  
  useEffect(() => {
    // Check if we navigated from another page with scroll instruction
    if (location.state && location.state.scrollTo) {
      setTimeout(() => {
        const section = document.getElementById(location.state.scrollTo);
        if (section) {
          window.scrollTo({
            top: section.offsetTop - 80,
            behavior: 'smooth'
          });
          setActiveSection(location.state.scrollTo);
        }
      }, 100); // Small delay to ensure DOM is ready
    }
  }, [location]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Determine active section based on scroll position
      const heroSection = document.getElementById('hero');
      const servicesSection = document.getElementById('features');
      const categoriesSection = document.getElementById('categories');
      const benefitsSection = document.getElementById('benefits');
      
      const scrollPosition = window.scrollY + 100; // Add offset for better detection
      
      if (heroSection && scrollPosition < heroSection.offsetTop + heroSection.offsetHeight) {
        setActiveSection('hero');
      } else if (servicesSection && scrollPosition < servicesSection.offsetTop + servicesSection.offsetHeight) {
        setActiveSection('features');
      } else if (categoriesSection && scrollPosition < categoriesSection.offsetTop + categoriesSection.offsetHeight) {
        setActiveSection('categories');
      } else if (benefitsSection) {
        setActiveSection('benefits');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const linkVariants = {
    hover: { 
      scale: 1.05, 
      color: '#4361EE',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      backgroundColor: 'rgba(67, 97, 238, 0.1)',
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActiveSection = (sectionId) => {
    return activeSection === sectionId;
  };

  return (
    <motion.nav 
      className={`app-navbar ${scrolled ? 'scrolled' : ''} ${location.pathname === '/' ? 'homepage-nav' : ''}`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="navbar-container">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link to="/" className="navbar-brand">
            <div className="logo-container">
              <svg className="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4361EE" />
                    <stop offset="100%" stopColor="#3A0CA3" />
                  </linearGradient>
                </defs>
                <rect width="100" height="100" rx="20" fill="white"/>
                <g fill="none" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  {/* Scale of Justice */}
                  <line x1="50" y1="20" x2="50" y2="80" />
                  <circle cx="50" cy="20" r="6" fill="url(#gradient)"/>
                  <circle cx="50" cy="80" r="6" fill="url(#gradient)"/>
                  
                  {/* Left Scale */}
                  <line x1="50" y1="35" x2="25" y2="50" />
                  <circle cx="25" cy="50" r="4" fill="url(#gradient)"/>
                  
                  {/* Right Scale */}
                  <line x1="50" y1="35" x2="75" y2="50" />
                  <circle cx="75" cy="50" r="4" fill="url(#gradient)"/>
                  
                  {/* Book */}
                  <rect x="35" y="58" width="30" height="15" rx="2" fill="url(#gradient)" fillOpacity="0.2"/>
                  <line x1="40" y1="64" x2="60" y2="64" />
                  <line x1="40" y1="68" x2="60" y2="68" />
                </g>
              </svg>
            </div>
            <div className="brand-text">
              <h1><span className="brand-justice">Justice</span><span className="brand-junction">Junction</span></h1>
              <p className="tagline">AI-Powered Legal Assistant</p>
            </div>
          </Link>
        </motion.div>
        
        <motion.div 
          className="mobile-toggle" 
          onClick={toggleMenu} 
          aria-label="Toggle menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <i className={`bi ${isMenuOpen ? 'bi-x' : 'bi-list'}`}></i>
        </motion.div>
        
        <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
          <motion.div
            whileHover="hover"
            whileTap="tap"
            variants={linkVariants}
          >
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' && isActiveSection('hero') ? 'active' : ''}`}
              onClick={() => scrollToSection('hero')}
            >
              <i className="bi bi-house-fill"></i> Home
            </Link>
          </motion.div>
          
          <motion.button 
            onClick={() => scrollToSection('features')} 
            className={`nav-link-btn ${isActiveSection('features') ? 'active' : ''}`}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <i className="bi bi-gear-fill"></i> Services
          </motion.button>
          
          <motion.button 
            onClick={() => scrollToSection('categories')} 
            className={`nav-link-btn ${isActiveSection('categories') ? 'active' : ''}`}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <i className="bi bi-grid-fill"></i> Categories
          </motion.button>
          
          <motion.button 
            onClick={() => scrollToSection('benefits')} 
            className={`nav-link-btn ${isActiveSection('benefits') ? 'active' : ''}`}
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            <i className="bi bi-award-fill"></i> Why Us
          </motion.button>
          
          {currentUser && (
            <div className="nav-auth-section">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Link to="/profile" className="profile-icon-link" title="Profile">
                  <div className="profile-icon">
                    <i className="bi bi-person-fill"></i>
                  </div>
                </Link>
              </motion.div>
            </div>
          )}
          
          {!currentUser && (
            <div className="nav-auth-section">
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={linkVariants}
              >
                <Link to="/login" className="nav-link login-btn">
                  Login
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/signup" className="nav-link signup">
                  Sign Up
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 