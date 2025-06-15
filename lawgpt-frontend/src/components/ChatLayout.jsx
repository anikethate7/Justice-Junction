import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/ChatLayout.css';

// Import the modern chat interface
import ModernChatInterface from './ModernChatInterface';

const ChatLayout = () => {
  const { category: urlCategory } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('query');
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'General');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  
  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Handle category change
  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
  };
  
  // Handle language change
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
  };
  
  useEffect(() => {
    // Close sidebar on smaller screens when clicking outside
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.sidebar');
      const toggleButton = document.querySelector('.sidebar-toggle');
      
      if (sidebar && !sidebar.contains(event.target) && 
          toggleButton && !toggleButton.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="chat-layout">
      {/* Minimal Sidebar */}
      <aside className={`sidebar minimal ${isSidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h3>Settings</h3>
          <button 
            className="sidebar-collapse-btn" 
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <i className={`bi ${isSidebarOpen ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
          </button>
        </div>
        
        <div className="sidebar-content">
          {/* Category Selection */}
          <div className="sidebar-section">
            <h4>Category</h4>
            <select 
              className="select-control"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="General">General</option>
              <option value="Criminal Law">Criminal Law</option>
              <option value="Civil Law">Civil Law</option>
              <option value="Family Law">Family Law</option>
              <option value="Corporate Law">Corporate Law</option>
              <option value="Property Law">Property Law</option>
            </select>
          </div>
          
          {/* Language Selection */}
          <div className="sidebar-section">
            <h4>Language</h4>
            <select 
              className="select-control"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Bengali">Bengali</option>
              <option value="Tamil">Tamil</option>
            </select>
          </div>
        </div>
      </aside>
      
      {/* Main Chat Area */}
      <main className={`chat-main ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
        <ModernChatInterface 
          initialQuery={searchQuery} 
          initialCategory={selectedCategory}
          initialLanguage={selectedLanguage}
          sidebarOpen={isSidebarOpen}
        />
      </main>
    </div>
  );
};

export default ChatLayout; 