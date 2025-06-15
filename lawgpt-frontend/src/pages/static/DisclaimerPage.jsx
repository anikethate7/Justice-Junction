import React from 'react';
import '../../styles/StaticPages.css';

const DisclaimerPage = () => {
  return (
    <div className="static-page disclaimer-page">
      <div className="static-page-container">
        <h1>Legal Disclaimer</h1>
        <div className="last-updated">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
        
        <section className="disclaimer-section">
          <h2>1. No Attorney-Client Relationship</h2>
          <p>
            <strong>IMPORTANT NOTICE:</strong> Justice Junction is not a law firm and does not provide legal advice, 
            legal services, or legal representation. Using our platform does not create an attorney-client 
            relationship between you and Justice Junction, its developers, or any affiliated parties.
          </p>
          <p>
            The information provided through our platform is for general informational purposes only. It is not 
            intended to be a substitute for professional legal advice, and should not be relied upon as such.
          </p>
        </section>
        
        <section className="disclaimer-section">
          <h2>2. Not a Substitute for Legal Counsel</h2>
          <p>
            For specific legal issues or concerns, you should always consult with a qualified legal professional 
            who can provide advice tailored to your particular situation. Our AI-powered responses are generated 
            based on general legal information and may not account for the specific facts and circumstances of your 
            individual case.
          </p>
          <p>
            The laws and regulations vary by jurisdiction and are subject to change. Legal principles that apply 
            in one jurisdiction may not apply in another, and the application of laws can vary based on specific 
            circumstances.
          </p>
        </section>
        
        <section className="disclaimer-section">
          <h2>3. Accuracy and Completeness</h2>
          <p>
            While we strive to provide accurate and up-to-date information, we make no warranties or representations 
            about the accuracy, completeness, reliability, or suitability of the information provided. Any reliance 
            you place on such information is strictly at your own risk.
          </p>
          <p>
            Our AI system is trained on legal resources and information, but it may not reflect the most recent 
            legal developments, changes in the law, or specific precedents that might apply to your situation.
          </p>
        </section>
        
        <section className="disclaimer-section">
          <h2>4. Time-Sensitive Matters</h2>
          <p>
            Legal matters often involve strict deadlines and time limitations. Delay in seeking proper legal advice 
            could result in the loss of legal rights or remedies. We strongly encourage you to promptly consult with 
            a qualified legal professional regarding time-sensitive matters.
          </p>
        </section>
        
        <section className="disclaimer-section">
          <h2>5. No Guarantees</h2>
          <p>
            Justice Junction does not guarantee any specific outcome or result from using the information provided through 
            our platform. Legal proceedings and outcomes depend on numerous factors, including the specific facts 
            of your case, applicable laws, the judge or officials assigned to your case, and various procedural factors.
          </p>
        </section>
        
        <section className="disclaimer-section">
          <h2>6. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Justice Junction and its affiliates, employees, contractors, 
            agents, and licensors shall not be liable for any direct, indirect, incidental, special, consequential, 
            or exemplary damages resulting from your use of the service or any information contained therein.
          </p>
          <p>
            This includes, but is not limited to, damages for loss of profits, goodwill, use, data, or other intangible 
            losses, even if we have been advised of the possibility of such damages.
          </p>
        </section>
        
        <section className="disclaimer-section">
          <h2>7. Legal Professional Connections</h2>
          <p>
            If you are connected with a legal professional through our platform, please note that Justice Junction does not 
            endorse or guarantee the quality of services provided by these professionals. Any arrangement, agreement, 
            or relationship established between you and a legal professional is solely between you and that professional.
          </p>
        </section>
        
        <section className="disclaimer-section">
          <h2>8. Acknowledgment</h2>
          <p>
            By using Justice Junction, you acknowledge that you have read, understood, and agree to this legal disclaimer. 
            You understand that you use the service at your own risk and that you should consult with a qualified 
            legal professional before taking any action based on information obtained through our platform.
          </p>
        </section>
      </div>
    </div>
  );
};

export default DisclaimerPage; 