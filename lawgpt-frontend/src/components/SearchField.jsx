import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/SearchField.css';

const SearchField = ({ 
  placeholder = 'Search...',
  value,
  onChange,
  onSubmit,
  theme = 'dark', // 'dark' or 'light'
  autoFocus = false,
  animationDelay = 0,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };
  
  const handleClear = () => {
    if (onChange) onChange({ target: { value: '' } });
  };
  
  return (
    <motion.form 
      className={`search-container ${theme === 'light' ? 'light-theme' : ''} ${className}`}
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        delay: animationDelay, 
        duration: 0.8, 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }}
      onSubmit={handleSubmit}
    >
      <div 
        className={`search-input-wrapper ${isFocused ? 'focused' : ''}`}
      >
        <motion.i 
          className="bi bi-search"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        ></motion.i>
        
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus={autoFocus}
          autoComplete="off"
        />
        
        <AnimatePresence>
          {value && (
            <motion.button 
              type="button"
              className="clear-search-btn" 
              onClick={handleClear}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(99, 102, 241, 0.15)" }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <i className="bi bi-x"></i>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
};

export default SearchField; 