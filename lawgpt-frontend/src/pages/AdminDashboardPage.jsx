import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const AdminDashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [pendingLawyers, setPendingLawyers] = useState([]);
  const [verifiedLawyers, setVerifiedLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('verification');
  const [welcomeVisible, setWelcomeVisible] = useState(true);

  useEffect(() => {
    // Fetch lawyers data
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        // Make a real API call to fetch lawyers
        const response = await axios.get(`${API_BASE_URL}/lawyers`);
        
        if (response.status === 200) {
          const lawyers = response.data;
          
          // Separate lawyers into pending and verified
          const pending = lawyers.filter(lawyer => !lawyer.verified);
          const verified = lawyers.filter(lawyer => lawyer.verified);
          
          setPendingLawyers(pending);
          setVerifiedLawyers(verified);
        } else {
          console.error('Error fetching lawyers: Unexpected response', response);
          // Fallback to mock data for demo purposes
          setPendingLawyers(mockPendingLawyers);
          setVerifiedLawyers(mockVerifiedLawyers);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching lawyers:', error);
        // Fallback to mock data for demo purposes
        setPendingLawyers(mockPendingLawyers);
        setVerifiedLawyers(mockVerifiedLawyers);
        setLoading(false);
      }
    };

    fetchLawyers();
    
    // Hide welcome message after 5 seconds
    const timer = setTimeout(() => {
      setWelcomeVisible(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle lawyer verification
  const handleVerifyLawyer = async (lawyerId) => {
    try {
      // Make API call to verify the lawyer
      const response = await axios.post(`${API_BASE_URL}/lawyers/${lawyerId}/verify`);
      
      if (response.status === 200) {
        // Get the updated lawyer data
        const verifiedLawyer = response.data;
        
        // Update local state
        setPendingLawyers(pendingLawyers.filter(lawyer => lawyer.id !== lawyerId));
        setVerifiedLawyers([...verifiedLawyers, verifiedLawyer]);
        
        alert(`${verifiedLawyer.name} has been verified successfully!`);
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      console.error('Error verifying lawyer:', error);
      alert('There was an error verifying the lawyer. Please try again.');
      
      // For demo purposes, still update UI if we're in development mode
      if (import.meta.env.DEV) {
        const lawyerToVerify = pendingLawyers.find(lawyer => lawyer.id === lawyerId);
        if (lawyerToVerify) {
          setPendingLawyers(pendingLawyers.filter(lawyer => lawyer.id !== lawyerId));
          setVerifiedLawyers([...verifiedLawyers, {...lawyerToVerify, verified: true}]);
          alert(`DEV MODE: ${lawyerToVerify.name} has been verified successfully!`);
        }
      }
    }
  };

  // Handle lawyer rejection
  const handleRejectLawyer = async (lawyerId) => {
    try {
      // In a real app, we would have a dedicated rejection endpoint
      // For now, just delete the lawyer
      const response = await axios.delete(`${API_BASE_URL}/lawyers/${lawyerId}`);
      
      if (response.status === 204) {
        // Update local state
        const lawyerToReject = pendingLawyers.find(lawyer => lawyer.id === lawyerId);
        setPendingLawyers(pendingLawyers.filter(lawyer => lawyer.id !== lawyerId));
        
        if (lawyerToReject) {
          alert(`${lawyerToReject.name}'s application has been rejected.`);
        } else {
          alert('Lawyer application has been rejected.');
        }
      } else {
        throw new Error('Rejection failed');
      }
    } catch (error) {
      console.error('Error rejecting lawyer:', error);
      alert('There was an error rejecting the lawyer. Please try again.');
      
      // For demo purposes, still update UI if we're in development mode
      if (import.meta.env.DEV) {
        const lawyerToReject = pendingLawyers.find(lawyer => lawyer.id === lawyerId);
        if (lawyerToReject) {
          setPendingLawyers(pendingLawyers.filter(lawyer => lawyer.id !== lawyerId));
          alert(`DEV MODE: ${lawyerToReject.name}'s application has been rejected.`);
        }
      }
    }
  };
  
  // Handle closing welcome message
  const handleCloseWelcome = () => {
    setWelcomeVisible(false);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {welcomeVisible && (
        <div className="admin-welcome">
          <div className="welcome-content">
            <button className="close-btn" onClick={handleCloseWelcome}>×</button>
            <i className="bi bi-person-check-fill welcome-icon"></i>
            <h3>Welcome to the Admin Dashboard{currentUser ? `, ${currentUser.username}` : ''}!</h3>
            <p>You've been automatically redirected here because you have admin privileges.</p>
          </div>
        </div>
      )}
      
      <h1>Admin Dashboard</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card pending">
          <div className="stat-icon">
            <i className="bi bi-hourglass-split"></i>
          </div>
          <div className="stat-value">{pendingLawyers.length}</div>
          <div className="stat-label">Pending Verifications</div>
        </div>
        
        <div className="stat-card verified">
          <div className="stat-icon">
            <i className="bi bi-check-circle"></i>
          </div>
          <div className="stat-value">{verifiedLawyers.length}</div>
          <div className="stat-label">Verified Lawyers</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <i className="bi bi-people"></i>
          </div>
          <div className="stat-value">{pendingLawyers.length + verifiedLawyers.length}</div>
          <div className="stat-label">Total Lawyers</div>
        </div>
      </div>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'verification' ? 'active' : ''}`}
          onClick={() => setActiveTab('verification')}
        >
          <i className="bi bi-shield-check"></i> Lawyer Verification
        </button>
        <button 
          className={`tab ${activeTab === 'management' ? 'active' : ''}`}
          onClick={() => setActiveTab('management')}
        >
          <i className="bi bi-gear"></i> Lawyer Management
        </button>
      </div>
      
      {activeTab === 'verification' && (
        <>
          <h3>Pending Verification ({pendingLawyers.length})</h3>
          {pendingLawyers.length === 0 ? (
            <p>No lawyers pending verification</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingLawyers.map(lawyer => (
                  <tr key={lawyer.id}>
                    <td>{lawyer.name}</td>
                    <td>{lawyer.email}</td>
                    <td>{lawyer.specialization}</td>
                    <td>{lawyer.experience} years</td>
                    <td>
                      <button 
                        className="verify-button"
                        onClick={() => handleVerifyLawyer(lawyer.id)}
                      >
                        <i className="bi bi-check-circle"></i> Verify
                      </button>
                      <button 
                        className="reject-button"
                        onClick={() => handleRejectLawyer(lawyer.id)}
                      >
                        <i className="bi bi-x-circle"></i> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
      
      {activeTab === 'management' && (
        <>
          <h3>Verified Lawyers ({verifiedLawyers.length})</h3>
          {verifiedLawyers.length === 0 ? (
            <p>No verified lawyers</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {verifiedLawyers.map(lawyer => (
                  <tr key={lawyer.id}>
                    <td>{lawyer.name}</td>
                    <td>{lawyer.email}</td>
                    <td>{lawyer.specialization}</td>
                    <td>{lawyer.experience} years</td>
                    <td>
                      <span className="verified-badge">Verified</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
      
      <div className="admin-instructions">
        <h4><i className="bi bi-info-circle"></i> How to Access This Dashboard</h4>
        <p>Navigate directly to the <code>/admin</code> route in your browser after logging in.</p>
        <p>For example: <code>http://localhost:3000/admin</code></p>
      </div>
    </div>
  );
};

// Mock data for fallback
const mockPendingLawyers = [
  {
    id: 101,
    name: 'Rakesh Kumar',
    email: 'rakesh@example.com',
    specialization: 'Criminal Law',
    experience: 7
  },
  {
    id: 102,
    name: 'Anjali Singh',
    email: 'anjali@example.com',
    specialization: 'Family Law',
    experience: 5
  },
  {
    id: 103,
    name: 'Deepak Sharma',
    email: 'deepak@example.com',
    specialization: 'Corporate Law',
    experience: 10
  }
];

const mockVerifiedLawyers = [
  {
    id: 201,
    name: 'Priya Patel',
    email: 'priya@example.com',
    specialization: 'Corporate Law',
    experience: 12,
    verified: true
  },
  {
    id: 202,
    name: 'Amit Verma',
    email: 'amit@example.com',
    specialization: 'Criminal Law',
    experience: 8,
    verified: true
  }
];

export default AdminDashboardPage; 