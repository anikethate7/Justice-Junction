import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section brand">
            <div className="footer-logo">
              <i className="bi bi-briefcase-fill"></i>
              <h3>Justice Junction</h3>
            </div>
            <p className="footer-tagline">
              Your AI-powered legal assistant for Indian law
            </p>
            <div className="social-icons">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
            </div>
          </div>

          <div className="footer-section links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/category/criminal-law">Criminal Law</Link></li>
              <li><Link to="/category/civil-law">Civil Law</Link></li>
              <li><Link to="/category/family-law">Family Law</Link></li>
              <li><Link to="/category/property-law">Property Law</Link></li>
            </ul>
          </div>

          <div className="footer-section links">
            <h4>Resources</h4>
            <ul>
              <li><Link to="/dictionary">Legal Dictionary</Link></li>
              <li><Link to="/documents">Document Analysis</Link></li>
              <li><Link to="/lawyers">Find Lawyers</Link></li>
              <li><a href="#blog">Legal Blog</a></li>
              <li><a href="#faqs">FAQs</a></li>
            </ul>
          </div>

          <div className="footer-section contact">
            <h4>Contact Us</h4>
            <ul className="contact-details">
              <li>
                <i className="bi bi-envelope-fill"></i>
                <a href="mailto:anikethate2003@gmail.com">anikethate2003@gmail.com</a>
              </li>
              <li>
                <i className="bi bi-telephone-fill"></i>
                <a href="tel:+919022542773">+91 90225 42773</a>
              </li>
              <li>
                <i className="bi bi-geo-alt-fill"></i>
                <address>Pune, Maharashtra, India</address>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            <p>&copy; {currentYear} Justice Junction. All Rights Reserved.</p>
          </div>
          <div className="legal-links">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/disclaimer">Legal Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 