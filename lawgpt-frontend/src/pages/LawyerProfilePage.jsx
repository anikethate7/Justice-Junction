import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LawyerProfile.css';
import { formatDistanceToNow } from 'date-fns';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

const LawyerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  
  // Mock reviews for development
  const mockReviews = [
    {
      id: 1,
      name: "Amit Sharma",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      date: new Date(2023, 6, 15),
      comment: "Very knowledgeable lawyer who helped me with my property dispute. Explained everything in simple terms and got results quickly."
    },
    {
      id: 2,
      name: "Priya Patel",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
      date: new Date(2023, 5, 22),
      comment: "Good experience overall. Professional approach and always responsive to queries. The case took longer than expected but ended with a positive outcome."
    },
    {
      id: 3,
      name: "Rajesh Kumar",
      avatar: "https://randomuser.me/api/portraits/men/62.jpg",
      rating: 5,
      date: new Date(2023, 4, 10),
      comment: "Excellent service and expertise. Handled my divorce case with sensitivity and professionalism. Would definitely recommend."
    }
  ];

  useEffect(() => {
    const fetchLawyerDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/lawyers/${id}`);
        setLawyer(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching lawyer details:", err);
        setError("Failed to load lawyer details. Please try again later.");
        
        // For development: use mock data if API fails
        if (process.env.NODE_ENV === 'development') {
          setLawyer({
            id: id,
            name: "Adv. Vikram Malhotra",
            avatar: "https://randomuser.me/api/portraits/men/75.jpg",
            specialization: "Criminal Law",
            experience: 12,
            rating: 4.8,
            reviewCount: 124,
            cases: 280,
            successRate: 92,
            online: true,
            phone: "+91 98765 43210",
            email: "vikram.malhotra@legaladvisor.com",
            location: "Mumbai, Maharashtra",
            languages: ["English", "Hindi", "Marathi"],
            feesRange: "₹2,000 - ₹5,000",
            bio: "Senior advocate with 12+ years of experience in criminal law. I've successfully handled over 280 cases ranging from petty offenses to serious crimes. My approach focuses on thorough investigation, strong courtroom representation, and client-centered service.",
            education: [
              { degree: "LLB", institution: "National Law School, Bangalore", year: "2011" },
              { degree: "LLM in Criminal Law", institution: "Delhi University", year: "2013" }
            ],
            experience_details: [
              { position: "Senior Associate", firm: "Sharma & Associates", period: "2013-2018", description: "Handled criminal cases including bail applications, trials, and appeals." },
              { position: "Partner", firm: "Legal Defenders LLP", period: "2018-Present", description: "Lead a team of 5 associates focusing on criminal defense and constitutional matters." }
            ],
            achievements: [
              "Successfully defended clients in 15 high-profile murder cases",
              "Recognized by Bar Association for pro bono services (2019)",
              "Published author in Indian Law Journal"
            ]
          });
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerDetails();
  }, [id]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleChatClick = () => {
    navigate(`/chat/${id}`);
  };

  const renderStars = (rating) => {
    return (
      <div className="stars-basic">
        <span className="rating-value-basic">★ {rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Loading lawyer profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-error">
        <i className="fas fa-exclamation-circle"></i>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button className="retry-button" onClick={() => window.location.reload()}>
          <i className="fas fa-sync-alt"></i> Try Again
        </button>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="profile-error">
        <i className="fas fa-user-slash"></i>
        <h3>Lawyer Not Found</h3>
        <p>The lawyer profile you're looking for doesn't exist or has been removed.</p>
        <button className="back-button" onClick={handleBackClick}>
          <i className="fas fa-arrow-left"></i> Back to Lawyers
        </button>
      </div>
    );
  }

  return (
    <div className="lawyer-profile-page-basic">
      <div className="profile-header-basic">
        <button 
          className="back-button-basic" 
          onClick={handleBackClick}
        >
          <i className="fas fa-arrow-left"></i> Back
        </button>
        
        <div className="profile-hero-basic">
          <div className="avatar-container-basic">
            {lawyer.avatar ? (
              <img src={lawyer.avatar} alt={lawyer.name} />
            ) : (
              <div className="avatar-placeholder-basic">
                {lawyer.name.charAt(0)}
              </div>
            )}
            {lawyer.online && (
              <div className="status-badge-basic">
                Online
              </div>
            )}
          </div>
          
          <div className="profile-info-basic">
            <h1>{lawyer.name}</h1>
            <div className="profile-specialization-basic">
              {lawyer.specialization}
            </div>
            
            <div className="profile-stats-basic">
              <div className="stat-item-basic">
                <div className="stat-value-basic">{lawyer.experience}+</div>
                <div className="stat-label-basic">Years</div>
              </div>
              <div className="stat-item-basic">
                <div className="stat-value-basic">{lawyer.cases || '200'}+</div>
                <div className="stat-label-basic">Cases</div>
              </div>
              <div className="stat-item-basic">
                <div className="stat-value-basic">{lawyer.successRate || '90'}%</div>
                <div className="stat-label-basic">Success</div>
              </div>
              <div className="stat-item-basic rating-basic">
                <div className="rating-stars-basic">
                  {renderStars(lawyer.rating)}
                </div>
                <div className="stat-label-basic">{lawyer.reviewCount || '50'} Reviews</div>
              </div>
            </div>
            
            <button 
              className="chat-button-basic" 
              onClick={handleChatClick}
            >
              <i className="fas fa-comment-alt"></i> Chat Now
            </button>
          </div>
        </div>
      </div>
      
      <div className="profile-content-basic">
        <div className="profile-tabs-basic">
          <button 
            className={`tab-button-basic ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button 
            className={`tab-button-basic ${activeTab === 'experience' ? 'active' : ''}`}
            onClick={() => setActiveTab('experience')}
          >
            Experience
          </button>
          <button 
            className={`tab-button-basic ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            Education
          </button>
          <button 
            className={`tab-button-basic ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews
          </button>
        </div>
        
        <div className="profile-tab-content-basic">
          {activeTab === 'about' && (
            <div className="about-section-basic">
              <div className="profile-section-basic">
                <h3>Bio</h3>
                <p>{lawyer.bio}</p>
              </div>
              
              <div className="profile-section-basic">
                <h3>Contact Information</h3>
                <div className="lawyer-info-grid-basic">
                  <div className="info-item-basic">
                    <i className="fas fa-phone"></i>
                    <div>
                      <strong>Phone</strong>
                      <p>{lawyer.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="info-item-basic">
                    <i className="fas fa-envelope"></i>
                    <div>
                      <strong>Email</strong>
                      <p>{lawyer.email || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="info-item-basic">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                      <strong>Location</strong>
                      <p>{lawyer.location || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="info-item-basic">
                    <i className="fas fa-language"></i>
                    <div>
                      <strong>Languages</strong>
                      <p>{lawyer.languages ? lawyer.languages.join(', ') : 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="info-item-basic">
                    <i className="fas fa-rupee-sign"></i>
                    <div>
                      <strong>Consultation Fees</strong>
                      <p>{lawyer.feesRange || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {lawyer.achievements && lawyer.achievements.length > 0 && (
                <div className="profile-section-basic">
                  <h3>Achievements</h3>
                  <ul className="achievements-list-basic">
                    {lawyer.achievements.map((achievement, index) => (
                      <li key={index}>
                        <i className="fas fa-trophy"></i>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'experience' && (
            <div className="experience-section-basic">
              {lawyer.experience_details && lawyer.experience_details.length > 0 ? (
                <div className="experience-timeline-basic">
                  {lawyer.experience_details.map((exp, index) => (
                    <div key={index} className="timeline-item-basic">
                      <div className="timeline-marker-basic"></div>
                      <div className="timeline-content-basic">
                        <h4>{exp.position}</h4>
                        <div className="timeline-meta-basic">
                          <span className="timeline-company-basic">{exp.firm}</span>
                          <span className="timeline-period-basic">{exp.period}</span>
                        </div>
                        <p>{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-basic">
                  <p>No experience details available</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'education' && (
            <div className="education-section-basic">
              {lawyer.education && lawyer.education.length > 0 ? (
                <div className="education-list-basic">
                  {lawyer.education.map((edu, index) => (
                    <div key={index} className="education-item-basic">
                      <div className="education-icon-basic">
                        <i className="fas fa-graduation-cap"></i>
                      </div>
                      <div className="education-details-basic">
                        <h4>{edu.degree}</h4>
                        <p>{edu.institution}</p>
                        <span className="education-year-basic">{edu.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state-basic">
                  <p>No education details available</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div className="reviews-section-basic">
              <div className="reviews-header-basic">
                <h3>Client Reviews</h3>
                <div className="reviews-summary-basic">
                  <div className="reviews-rating-basic">
                    <span className="rating-value-basic">{lawyer.rating}</span>
                    <div className="rating-stars-large-basic">
                      {renderStars(lawyer.rating)}
                    </div>
                  </div>
                  <span className="reviews-count-basic">Based on {lawyer.reviewCount || mockReviews.length} reviews</span>
                </div>
              </div>
              
              <div className="reviews-list-basic">
                {mockReviews.map((review) => (
                  <div key={review.id} className="review-item-basic">
                    <div className="review-header-basic">
                      <div className="reviewer-info-basic">
                        <div className="reviewer-avatar-basic">
                          {review.avatar ? (
                            <img src={review.avatar} alt={`${review.name} avatar`} />
                          ) : (
                            <div className="avatar-placeholder-small-basic">
                              {review.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4>{review.name}</h4>
                          <div className="review-date-basic">
                            {formatDistanceToNow(review.date, { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <div className="review-rating-basic">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <div className="review-content-basic">
                      <p>{review.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LawyerProfilePage; 