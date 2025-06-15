import React, { useEffect, useState } from "react";

/**
 * A custom loader based on the app's favicon (scales of justice)
 * @param {Object} props
 * @param {string} props.message - Optional message to display
 * @param {boolean} props.fullScreen - Whether the loader should take full screen
 * @param {string} props.size - Size of the loader (sm, md, lg)
 */
const FaviconLoader = ({
  message = "",
  fullScreen = false,
  size = "md"
}) => {
  const [dots, setDots] = useState(".");
  
  // Animation for dots (...) when message is shown
  useEffect(() => {
    if (!message) return;
    
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);
    
    return () => clearInterval(interval);
  }, [message]);

  // Size mapping
  const sizeMap = {
    sm: { width: "80px", height: "80px" },
    md: { width: "120px", height: "120px" },
    lg: { width: "180px", height: "180px" },
  };
  
  const selectedSize = sizeMap[size] || sizeMap.md;
  
  // Container styles
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    ...(fullScreen ? {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(255, 255, 255, 0.95)",
      zIndex: 9999,
    } : {}),
  };
  
  return (
    <div style={containerStyle} className="favicon-loader-container">
      <style>
        {`
          @keyframes scaleLeftAnim {
            0% { transform: translateY(0); }
            50% { transform: translateY(10px); }
            100% { transform: translateY(0); }
          }
          
          @keyframes scaleRightAnim {
            0% { transform: translateY(10px); }
            50% { transform: translateY(0); }
            100% { transform: translateY(10px); }
          }

          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulseFill {
            0%, 100% { fill-opacity: 0.2; }
            50% { fill-opacity: 0.7; }
          }

          @keyframes scalePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes shimmer {
            0% { stroke-dashoffset: 100; }
            100% { stroke-dashoffset: -100; }
          }

          .favicon-svg {
            width: ${selectedSize.width};
            height: ${selectedSize.height};
            animation: scalePulse 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            filter: drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.1));
          }

          .scale-circle {
            transform-origin: center;
            animation: rotate 12s linear infinite;
          }

          .left-scale-line {
            animation: scaleLeftAnim 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            transform-origin: 50px 35px;
          }

          .right-scale-line {
            animation: scaleRightAnim 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            transform-origin: 50px 35px;
          }

          .left-scale-circle {
            animation: scaleLeftAnim 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .right-scale-circle {
            animation: scaleRightAnim 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }

          .book-rect {
            animation: pulseFill 3s ease-in-out infinite;
          }

          .book-line {
            animation: scalePulse 3s ease-in-out infinite;
          }
          
          .animated-stroke {
            stroke-dasharray: 100;
            animation: shimmer 3s linear infinite;
          }

          .loader-message {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin-top: 20px;
            color: #4b5563;
            font-size: 16px;
            font-weight: 500;
            text-align: center;
            letter-spacing: 0.2px;
          }
        `}
      </style>
      
      <svg className="favicon-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4361EE" />
            <stop offset="100%" stopColor="#3A0CA3" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" rx="20" fill="white"/>
        <g fill="none" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          {/* Main Stand */}
          <line x1="50" y1="20" x2="50" y2="80" className="animated-stroke" />
          <circle className="scale-circle" cx="50" cy="20" r="6" fill="url(#gradient)"/>
          <circle cx="50" cy="80" r="6" fill="url(#gradient)"/>
          
          {/* Left Scale */}
          <line className="left-scale-line animated-stroke" x1="50" y1="35" x2="25" y2="50" />
          <circle className="left-scale-circle" cx="25" cy="50" r="4" fill="url(#gradient)"/>
          
          {/* Right Scale */}
          <line className="right-scale-line animated-stroke" x1="50" y1="35" x2="75" y2="50" />
          <circle className="right-scale-circle" cx="75" cy="50" r="4" fill="url(#gradient)"/>
          
          {/* Book */}
          <rect className="book-rect" x="35" y="58" width="30" height="15" rx="2" fill="url(#gradient)" fillOpacity="0.2"/>
          <line className="book-line" x1="40" y1="64" x2="60" y2="64" stroke="url(#gradient)" />
          <line className="book-line" x1="40" y1="68" x2="60" y2="68" stroke="url(#gradient)" />
        </g>
      </svg>
      
      {message && (
        <div className="loader-message">
          {message}{dots}
        </div>
      )}
    </div>
  );
};

export default FaviconLoader; 