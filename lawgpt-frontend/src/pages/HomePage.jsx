import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/HomePage.css';
import { motion, AnimatePresence } from 'framer-motion';
import SearchField from '../components/SearchField';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Section refs for scroll navigation
  const featuresRef = useRef(null);
  const categoriesRef = useRef(null);
  const benefitsRef = useRef(null);
  const heroRef = useRef(null);
  
  // Active indicators
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  
  // Auto-scroll state
  const [autoScrollFeatures, setAutoScrollFeatures] = useState(true);
  const [autoScrollCategories, setAutoScrollCategories] = useState(true);
  
  // Animation states
  const [heroAnimPlayed, setHeroAnimPlayed] = useState(false);
  
  // Debounce timeout refs
  const scrollTimeoutRef = useRef(null);
  
  // Feature cards configuration
  const featureCards = [
    { 
      id: "chat", 
      title: "Legal Chat", 
      icon: "bi-chat-dots-fill",
      description: "Get instant answers to your legal questions with our advanced AI assistant. Available 24/7.",
      buttonText: "Start Chat",
      route: "/chat",
      highlight: true,
      color: "#6c63ff"
    },
    { 
      id: "documents", 
      title: "Document Analysis", 
      icon: "bi-file-text-fill",
      description: "Upload and analyze legal documents with AI-powered insights and recommendations.",
      buttonText: "Analyze Documents",
      route: "/documents",
      color: "#5a52d5"
    },
    { 
      id: "lawyers", 
      title: "Lawyer Support", 
      icon: "bi-person-badge-fill",
      description: "Connect with verified lawyers for professional legal consultation and representation.",
      buttonText: "Find Lawyers",
      route: "/lawyers",
      color: "#4CC9F0"
    },
    { 
      id: "dictionary", 
      title: "Legal Dictionary", 
      icon: "bi-book-fill",
      description: "Access a comprehensive dictionary of legal terms and concepts with detailed explanations.",
      buttonText: "Browse Dictionary",
      route: "/dictionary",
      color: "#F72585"
    }
  ];
  
  // Popular legal categories
  const popularCategories = [
    { name: 'Criminal Law', path: '/chat', icon: 'bi-shield-fill', color: '#e63946' },
    { name: 'Property Law', path: '/chat', icon: 'bi-house-fill', color: '#457b9d' },
    { name: 'Family Law', path: '/chat', icon: 'bi-people-fill', color: '#2a9d8f' },
    { name: 'Cyber Law', path: '/chat', icon: 'bi-laptop-fill', color: '#4895ef' },
    { name: 'Corporate Law', path: '/chat', icon: 'bi-building-fill', color: '#6a4c93' },
    { name: 'Civil Law', path: '/chat', icon: 'bi-bank2', color: '#f77f00' },
    { name: 'Tax Law', path: '/chat', icon: 'bi-cash-stack', color: '#006400' },
    { name: 'Labor Law', path: '/chat', icon: 'bi-briefcase-fill', color: '#9c6644' },
    { name: 'Environmental Law', path: '/chat', icon: 'bi-tree-fill', color: '#38b000' },
    { name: 'Immigration Law', path: '/chat', icon: 'bi-globe', color: '#0077b6' },
    { name: 'Intellectual Property', path: '/chat', icon: 'bi-lightbulb-fill', color: '#ffba08' },
    { name: 'Constitutional Law', path: '/chat', icon: 'bi-journal-text', color: '#6c757d' }
  ];

  // Benefits data
  const benefits = [
    {
      icon: 'bi-shield-check',
      title: 'Secure & Confidential',
      description: 'Your legal queries and documents are protected with enterprise-grade security.'
    },
    {
      icon: 'bi-lightning-charge',
      title: 'Instant Responses',
      description: 'Get immediate answers to your legal questions, available 24/7.'
    },
    {
      icon: 'bi-translate',
      title: 'Multilingual Support',
      description: 'Access legal information in English, Hindi, and Marathi.'
    },
    {
      icon: 'bi-person-check',
      title: 'Expert Verified',
      description: 'All legal information is verified by qualified legal professionals.'
    }
  ];

  // Debounced scroll handler
  const handleScroll = useCallback((ref, setActiveIndex, itemCount, cardWidth) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (ref.current) {
        const scrollLeft = ref.current.scrollLeft;
        const index = Math.round(scrollLeft / cardWidth);
        setActiveIndex(Math.min(index, itemCount - 1));
      }
    }, 100);
  }, []);

  // Handle scroll events to update active indicators
  useEffect(() => {
    const featuresElement = featuresRef.current;
    const categoriesElement = categoriesRef.current;
    
    const handleFeatureScroll = () => handleScroll(featuresRef, setActiveFeatureIndex, featureCards.length, 344);
    const handleCategoryScroll = () => handleScroll(categoriesRef, setActiveCategoryIndex, popularCategories.length, 204);
    
    if (featuresElement) {
      featuresElement.addEventListener('scroll', handleFeatureScroll, { passive: true });
    }
    
    if (categoriesElement) {
      categoriesElement.addEventListener('scroll', handleCategoryScroll, { passive: true });
    }
    
    return () => {
      if (featuresElement) {
        featuresElement.removeEventListener('scroll', handleFeatureScroll);
      }
      if (categoriesElement) {
        categoriesElement.removeEventListener('scroll', handleCategoryScroll);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, featureCards.length, popularCategories.length]);

  // Optimized auto-scroll functionality with RAF
  useEffect(() => {
    let featuresRAF;
    let categoriesRAF;
    let lastFeatureTime = 0;
    let lastCategoryTime = 0;
    
    const animate = (timestamp) => {
      if (autoScrollFeatures && timestamp - lastFeatureTime > 4000) {
        const nextIndex = (activeFeatureIndex + 1) % featureCards.length;
        scrollToIndex(featuresRef, nextIndex, 'feature');
        lastFeatureTime = timestamp;
      }
      
      if (autoScrollCategories && timestamp - lastCategoryTime > 3500) {
        const nextIndex = (activeCategoryIndex + 1) % popularCategories.length;
        scrollToIndex(categoriesRef, nextIndex, 'category');
        lastCategoryTime = timestamp;
      }
      
      featuresRAF = requestAnimationFrame(animate);
    };
    
    featuresRAF = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(featuresRAF);
      cancelAnimationFrame(categoriesRAF);
    };
  }, [activeFeatureIndex, activeCategoryIndex, autoScrollFeatures, autoScrollCategories, featureCards.length, popularCategories.length]);

  const handleFeatureClick = useCallback((card) => {
    if (card.comingSoon) {
      alert(`${card.title} feature is coming soon!`);
    } else {
      navigate(card.route);
    }
  }, [navigate]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/chat?query=${encodeURIComponent(searchQuery)}`);
    }
  }, [searchQuery, navigate]);
  
  // Optimized scroll handlers
  const scrollToIndex = useCallback((ref, index, itemType) => {
    if (ref.current) {
      const cardWidth = itemType === 'feature' ? 344 : 204;
      ref.current.scrollTo({ 
        left: index * cardWidth, 
        behavior: 'smooth' 
      });
    }
  }, []);

  // Optimized mouse handlers
  const handleMouseEnter = useCallback((section) => {
    if (section === 'features') {
      setAutoScrollFeatures(false);
    } else {
      setAutoScrollCategories(false);
    }
  }, []);

  const handleMouseLeave = useCallback((section) => {
    if (section === 'features') {
      setAutoScrollFeatures(true);
    } else {
      setAutoScrollCategories(true);
    }
  }, []);

  // Handle scroll navigation based on URL hash
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const sectionId = hash.substring(1); // Remove the # symbol
      scrollToSection(sectionId);
    }
  }, [location]);

  // Scroll to section function
  const scrollToSection = useCallback((sectionId) => {
    const sectionRefs = {
      'features': featuresRef,
      'categories': categoriesRef,
      'benefits': benefitsRef,
      'hero': heroRef
    };

    const section = sectionRefs[sectionId];
    if (section?.current) {
      section.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  // Trigger hero animation after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroAnimPlayed(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Animations
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section" ref={heroRef} id="hero">
        <div className="hero-particles">
          {Array.from({ length: 20 }).map((_, index) => (
            <motion.div 
              key={index}
              className="particle"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * 500,
                opacity: Math.random() * 0.5 + 0.3
              }}
              animate={{ 
                y: [null, Math.random() * -100 - 50, null],
                opacity: [null, Math.random() * 0.7 + 0.3, null]
              }}
              transition={{
                duration: Math.random() * 15 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                backgroundColor: index % 2 === 0 ? 'rgba(108, 99, 255, 0.2)' : 'rgba(247, 37, 133, 0.15)'
              }}
            />
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-left">
            <motion.div
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="hero-badge" variants={fadeInUp}>
                <span className="badge-text">AI-Powered</span>
                <span className="badge-dot"></span>
                <span className="badge-text">Legal Assistance</span>
              </motion.div>
              
              <motion.h1 variants={fadeInUp}>
                JusticeJunction
              </motion.h1>
              
              <motion.h2 variants={fadeInUp}>
                Your AI Legal Assistant
              </motion.h2>
              
              <motion.p variants={fadeInUp}>
                Get instant answers to your legal questions, analyze documents, and connect with verified lawyers - all in one place.
              </motion.p>
              
              <motion.div variants={fadeInUp}>
                <SearchField
                  placeholder="Ask a legal question..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onSubmit={handleSearch}
                  theme="dark"
                  animationDelay={0.2}
                  className="hero-search"
                />
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <div className="hero-illustration-container">
              <div className="glow-effect"></div>
              
              {/* Modern AI Legal SVG Illustration */}
              <svg 
                className="hero-illustration" 
                viewBox="0 0 800 600" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Justice Scales */}
                <g className="justice-scales">
                  <motion.g
                    animate={{ y: [0, -5, 0], rotate: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  >
                    {/* Center Pillar */}
                    <rect x="390" y="240" width="20" height="160" rx="5" fill="#6c63ff" />
                    
                    {/* Base */}
                    <rect x="330" y="380" width="140" height="30" rx="10" fill="#5a52d5" />
                    
                    {/* Top Bar */}
                    <rect x="300" y="220" width="200" height="20" rx="5" fill="#6c63ff" />
                    
                    {/* Left Scale */}
                    <motion.g
                      animate={{ rotate: [-3, 3, -3] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      style={{ transformOrigin: '300px 240px' }}
                    >
                      <line x1="300" y1="240" x2="300" y2="290" stroke="#6c63ff" strokeWidth="5" />
                      <circle cx="300" cy="300" r="32" fill="#f0eeff" stroke="#6c63ff" strokeWidth="4" />
                      <path d="M282 296 L318 296 L312 284 L288 284 Z" fill="#6c63ff" />
                      <circle cx="300" cy="290" r="4" fill="#6c63ff" />
                    </motion.g>
                    
                    {/* Right Scale */}
                    <motion.g
                      animate={{ rotate: [3, -3, 3] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      style={{ transformOrigin: '500px 240px' }}
                    >
                      <line x1="500" y1="240" x2="500" y2="290" stroke="#6c63ff" strokeWidth="5" />
                      <circle cx="500" cy="300" r="32" fill="#f0eeff" stroke="#6c63ff" strokeWidth="4" />
                      <path d="M482 296 L518 296 L512 284 L488 284 Z" fill="#6c63ff" />
                      <circle cx="500" cy="290" r="4" fill="#6c63ff" />
                    </motion.g>
                  </motion.g>
                </g>
                
                {/* Digital Elements */}
                <g className="digital-elements">
                  {/* Circuit Lines */}
                  <motion.path 
                    d="M250 450 Q270 430 300 430 L500 430 Q530 430 550 450 L580 480"
                    stroke="#4CC9F0"
                    strokeWidth="4"
                    strokeDasharray="10 5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2, delay: 1 }}
                  />
                  <motion.path 
                    d="M200 400 Q230 390 250 410 L280 450"
                    stroke="#4CC9F0"
                    strokeWidth="4"
                    strokeDasharray="8 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 1.5 }}
                  />
                  <motion.path 
                    d="M600 400 Q570 390 550 410 L520 450"
                    stroke="#4CC9F0"
                    strokeWidth="4"
                    strokeDasharray="8 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: 1.5 }}
                  />
                  
                  {/* Circuit Nodes */}
                  <motion.circle 
                    cx="300" 
                    cy="430" 
                    r="10" 
                    fill="#4CC9F0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 2 }}
                  />
                  <motion.circle 
                    cx="400" 
                    cy="430" 
                    r="10" 
                    fill="#4CC9F0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 2.2 }}
                  />
                  <motion.circle 
                    cx="500" 
                    cy="430" 
                    r="10" 
                    fill="#4CC9F0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 2.4 }}
                  />
                </g>
                
                {/* Document Stack */}
                <g className="document-stack">
                  <motion.g
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                  >
                    {/* Document 1 */}
                    <rect x="150" y="450" width="120" height="150" rx="10" fill="#f0eeff" stroke="#6c63ff" strokeWidth="2" />
                    <rect x="170" y="470" width="80" height="10" rx="5" fill="#6c63ff" opacity="0.7" />
                    <rect x="170" y="490" width="60" height="10" rx="5" fill="#6c63ff" opacity="0.7" />
                    <rect x="170" y="510" width="70" height="10" rx="5" fill="#6c63ff" opacity="0.7" />
                    <rect x="170" y="530" width="50" height="10" rx="5" fill="#6c63ff" opacity="0.7" />
                    <rect x="170" y="550" width="40" height="10" rx="5" fill="#6c63ff" opacity="0.7" />
                    
                    {/* Document 2 */}
                    <rect x="530" y="450" width="120" height="150" rx="10" fill="#f0eeff" stroke="#6c63ff" strokeWidth="2" />
                    <rect x="550" y="470" width="80" height="10" rx="5" fill="#6c63ff" opacity="0.7" />
                    <rect x="550" y="490" width="60" height="10" rx="5" fill="#6c63ff" opacity="0.7" />
                    <rect x="550" y="510" width="70" height="10" rx="5" fill="#6c63ff" opacity="0.7" />
                    <rect x="550" y="530" width="50" height="10" rx="5" fill="#6c63ff" opacity="0.7" />
                    <rect x="550" y="550" width="40" height="10" rx="5" fill="#6c63ff" opacity="0.7" />
                  </motion.g>
                </g>
                
                {/* AI Brain */}
                <g className="ai-brain">
                  <motion.g
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    <ellipse cx="400" cy="140" rx="85" ry="75" fill="#f0eeff" stroke="#6c63ff" strokeWidth="2" />
                    
                    {/* Brain Connections */}
                    <motion.path 
                      d="M370 120 Q380 100 400 110 Q420 120 430 110"
                      stroke="#6c63ff"
                      strokeWidth="4"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1 }}
                    />
                    <motion.path 
                      d="M350 140 Q370 160 390 150 Q410 140 430 160"
                      stroke="#6c63ff"
                      strokeWidth="4"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.2 }}
                    />
                    <motion.path 
                      d="M360 170 Q380 150 400 160 Q420 170 440 150"
                      stroke="#6c63ff"
                      strokeWidth="4"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.4 }}
                    />
                    
                    {/* Brain Nodes */}
                    <motion.circle 
                      cx="370" 
                      cy="120" 
                      r="6" 
                      fill="#F72585"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 1.6 }}
                    />
                    <motion.circle 
                      cx="400" 
                      cy="110" 
                      r="6" 
                      fill="#F72585"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 1.7 }}
                    />
                    <motion.circle 
                      cx="430" 
                      cy="110" 
                      r="6" 
                      fill="#F72585"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 1.8 }}
                    />
                    <motion.circle 
                      cx="350" 
                      cy="140" 
                      r="6" 
                      fill="#F72585"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 1.9 }}
                    />
                    <motion.circle 
                      cx="390" 
                      cy="150" 
                      r="6" 
                      fill="#F72585"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 2 }}
                    />
                    <motion.circle 
                      cx="430" 
                      cy="160" 
                      r="6" 
                      fill="#F72585"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 2.1 }}
                    />
                    <motion.circle 
                      cx="360" 
                      cy="170" 
                      r="6" 
                      fill="#F72585"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 2.2 }}
                    />
                    <motion.circle 
                      cx="400" 
                      cy="160" 
                      r="6" 
                      fill="#F72585"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 2.3 }}
                    />
                    <motion.circle 
                      cx="440" 
                      cy="150" 
                      r="6" 
                      fill="#F72585"
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 2.4 }}
                    />
                  </motion.g>
                </g>
                
                {/* Connection from Brain to Scales */}
                <motion.path 
                  d="M400 210 L400 220"
                  stroke="#6c63ff"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 2.5 }}
                />
              </svg>
              
              <motion.div 
                className="floating-element element-1"
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <i className="bi bi-shield-check"></i>
              </motion.div>
              
              <motion.div 
                className="floating-element element-2"
                animate={{ 
                  y: [0, 15, 0],
                  rotate: [0, -3, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <i className="bi bi-file-earmark-text"></i>
              </motion.div>
              
              <motion.div 
                className="floating-element element-3"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <i className="bi bi-chat-text"></i>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="scroll-indicator-arrow"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            onClick={() => scrollToSection('features')}
          >
            <i className="bi bi-chevron-down"></i>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section" ref={featuresRef} id="features">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="section-header">
            <div className="section-title-container">
              <h3>Explore Our Features</h3>
              <div className="title-underline"></div>
            </div>
            <p className="section-subtitle">Discover tools designed to simplify your legal journey</p>
          </div>
        </motion.div>
        
        <div
          className="scroll-container"
          onMouseEnter={() => handleMouseEnter('features')}
          onMouseLeave={() => handleMouseLeave('features')}
        >
          <div className="feature-cards">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.id}
                className={`feature-card ${card.highlight ? 'highlight' : ''}`}
                onClick={() => handleFeatureClick(card)}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -10,
                  boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="card-icon" style={{ background: `linear-gradient(135deg, ${card.color} 0%, ${card.color}40 100%)` }}>
                  <i className={`bi ${card.icon}`} style={{ color: 'white' }}></i>
                </div>
                <h4>{card.title}</h4>
                <p>{card.description}</p>
                <button className={`card-button ${card.highlight ? 'highlight-btn' : ''}`}>
                  {card.buttonText}
                </button>
                {card.comingSoon && <span className="soon-badge">Coming Soon</span>}
              </motion.div>
            ))}
          </div>
          <button
            className="scroll-button left"
            onClick={() => scrollToIndex(featuresRef, activeFeatureIndex - 1, 'feature')}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button
            className="scroll-button right"
            onClick={() => scrollToIndex(featuresRef, activeFeatureIndex + 1, 'feature')}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
        <div className="scroll-indicator">
          {featureCards.map((_, index) => (
            <div
              key={index}
              className={`indicator-dot ${index === activeFeatureIndex ? 'active' : ''}`}
              onClick={() => scrollToIndex(featuresRef, index, 'feature')}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section" ref={categoriesRef} id="categories">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="section-header">
            <div className="section-title-container">
              <h3>Popular Legal Categories</h3>
              <div className="title-underline"></div>
            </div>
            <p className="section-subtitle">Find specialized information for your specific legal needs</p>
          </div>
        </motion.div>
        
        <div
          className="scroll-container"
          onMouseEnter={() => handleMouseEnter('categories')}
          onMouseLeave={() => handleMouseLeave('categories')}
        >
          <div className="category-cards">
            {popularCategories.map((category, index) => (
              <motion.div
                key={category.name}
                className="category-card"
                onClick={() => navigate(category.path)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  y: -8,
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
                }}
              >
                <i className={`bi ${category.icon}`} style={{ color: category.color }}></i>
                <span>{category.name}</span>
              </motion.div>
            ))}
          </div>
          <button
            className="scroll-button left"
            onClick={() => scrollToIndex(categoriesRef, activeCategoryIndex - 1, 'category')}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button
            className="scroll-button right"
            onClick={() => scrollToIndex(categoriesRef, activeCategoryIndex + 1, 'category')}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
        <div className="scroll-indicator">
          {popularCategories.map((_, index) => (
            <div
              key={index}
              className={`indicator-dot ${index === activeCategoryIndex ? 'active' : ''}`}
              onClick={() => scrollToIndex(categoriesRef, index, 'category')}
            />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section" ref={benefitsRef} id="benefits">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="section-header">
            <div className="section-title-container">
              <h3>Why Choose JusticeJunction?</h3>
              <div className="title-underline"></div>
            </div>
            <p className="section-subtitle">Experience the advantages that set us apart</p>
          </div>
        </motion.div>
        
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="benefit-item"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true, margin: "-70px" }}
              whileHover={{ 
                y: -10,
                boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)'
              }}
            >
              <i className={`bi ${benefit.icon}`}></i>
              <h4>{benefit.title}</h4>
              <p>{benefit.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="cta-container"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h3>Ready to Get Started?</h3>
          <p>Join thousands of users who trust JusticeJunction for their legal needs</p>
          <button className="cta-button" onClick={() => navigate('/signup')}>
            Create Free Account
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage; 