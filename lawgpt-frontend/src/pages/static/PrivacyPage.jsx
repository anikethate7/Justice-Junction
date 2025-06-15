import React from 'react';
import '../../styles/StaticPages.css';

const PrivacyPage = () => {
  return (
    <div className="static-page privacy-page">
      <div className="static-page-container">
        <h1>Privacy Policy</h1>
        <div className="last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        
        <section className="privacy-section">
          <h2>1. Introduction</h2>
          <p>
            At Justice Junction, we are committed to protecting your privacy and personal information. This Privacy Policy 
            explains how we collect, use, disclose, and safeguard your information when you use our website, 
            mobile application, or any of our services.
          </p>
          <p>
            Please read this Privacy Policy carefully. By accessing or using our service, you acknowledge that 
            you have read, understood, and agree to be bound by all the terms of this Privacy Policy.
          </p>
        </section>
        
        <section className="privacy-section">
          <h2>2. Information We Collect</h2>
          <h3>2.1 Personal Information</h3>
          <p>
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul>
            <li>Register for an account</li>
            <li>Use our chat services</li>
            <li>Submit legal questions</li>
            <li>Upload documents for analysis</li>
            <li>Contact our customer support</li>
          </ul>
          <p>
            This information may include your name, email address, phone number, and any other information 
            you choose to provide.
          </p>
          
          <h3>2.2 Usage Data</h3>
          <p>
            We may automatically collect certain information about your device and how you interact with our 
            services, including:
          </p>
          <ul>
            <li>IP address and browser type</li>
            <li>Pages you visit and features you use</li>
            <li>Time spent on the platform</li>
            <li>Referring website or source</li>
            <li>Device information (type, model, operating system)</li>
          </ul>
        </section>
        
        <section className="privacy-section">
          <h2>3. How We Use Your Information</h2>
          <p>
            We use the information we collect for various purposes, including to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process and respond to your legal queries</li>
            <li>Personalize your experience</li>
            <li>Communicate with you about our services</li>
            <li>Monitor and analyze usage patterns and trends</li>
            <li>Detect, prevent, and address technical issues</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>
        
        <section className="privacy-section">
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. However, no method of 
            transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee 
            absolute security.
          </p>
        </section>
        
        <section className="privacy-section">
          <h2>5. Data Retention</h2>
          <p>
            We will retain your personal information only for as long as is necessary for the purposes set out 
            in this Privacy Policy. We will retain and use your information to the extent necessary to comply 
            with our legal obligations, resolve disputes, and enforce our policies.
          </p>
        </section>
        
        <section className="privacy-section">
          <h2>6. Your Privacy Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, which 
            may include:
          </p>
          <ul>
            <li>The right to access your personal information</li>
            <li>The right to rectify inaccurate or incomplete information</li>
            <li>The right to erasure of your personal information</li>
            <li>The right to restrict or object to processing</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us using the information provided in the "Contact Us" 
            section below.
          </p>
        </section>
        
        <section className="privacy-section">
          <h2>7. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
            the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review 
            this Privacy Policy periodically for any changes.
          </p>
        </section>
        
        <section className="privacy-section">
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p className="contact-info">
            Email: <a href="mailto:privacy@justicejunction.com">privacy@justicejunction.com</a><br />
            Address: Mumbai, Maharashtra, India
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage; 