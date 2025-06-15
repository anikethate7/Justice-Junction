import React from 'react';
import '../../styles/StaticPages.css';

const TermsPage = () => {
  return (
    <div className="static-page terms-page">
      <div className="static-page-container">
        <h1>Terms of Service</h1>
        <div className="last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        
        <section className="terms-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Justice Junction ("we," "our," or "us"). By accessing or using our website, mobile application, 
            or any of our services, you agree to be bound by these Terms of Service. Please read these terms 
            carefully before using our platform.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>2. Acceptance of Terms</h2>
          <p>
            By accessing or using the Justice Junction platform, you acknowledge that you have read, understood, and 
            agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use 
            our services.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>3. Description of Services</h2>
          <p>
            Justice Junction provides an AI-powered legal assistant designed to offer general legal information and 
            guidance. Our services include but are not limited to:
          </p>
          <ul>
            <li>Answering general legal questions based on Indian law</li>
            <li>Providing information about legal procedures and requirements</li>
            <li>Connecting users with legal professionals when necessary</li>
            <li>Analyzing legal documents for informational purposes</li>
          </ul>
        </section>
        
        <section className="terms-section">
          <h2>4. Legal Disclaimer</h2>
          <p>
            Justice Junction is not a law firm and does not provide legal advice. The information provided through 
            our platform is for informational purposes only and should not be considered as professional legal 
            advice. You should always consult with a qualified legal professional for specific legal matters.
          </p>
          <p>
            We do not guarantee the accuracy, completeness, or timeliness of any information provided through 
            our service. Laws and regulations change frequently, and their application can vary widely based 
            on specific facts and circumstances.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>5. User Accounts</h2>
          <p>
            To access certain features of our service, you may need to create an account. You agree to provide 
            accurate, current, and complete information during the registration process and to update such 
            information to keep it accurate, current, and complete.
          </p>
          <p>
            You are solely responsible for safeguarding your password and for all activity that occurs under 
            your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>6. User Conduct</h2>
          <p>
            When using our services, you agree not to:
          </p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe on the rights of others</li>
            <li>Use the service to engage in illegal activities</li>
            <li>Attempt to gain unauthorized access to any part of the service</li>
            <li>Use the service to transmit harmful code or malware</li>
            <li>Interfere with or disrupt the service</li>
          </ul>
        </section>
        
        <section className="terms-section">
          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. We will provide notice of 
            significant changes by posting the updated terms on our platform. Your continued use of the service 
            after such changes constitutes your acceptance of the new terms.
          </p>
        </section>
        
        <section className="terms-section">
          <h2>8. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="contact-info">
            Email: <a href="mailto:info@justicejunction.com">info@justicejunction.com</a><br />
            Address: Mumbai, Maharashtra, India
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage; 