import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    profession: currentUser?.profession || "",
  });
  const [profileImage, setProfileImage] = useState(currentUser?.profileImage || null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Update form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser?.firstName || "",
        lastName: currentUser?.lastName || "",
        email: currentUser?.email || "",
        phone: currentUser?.phone || "",
        profession: currentUser?.profession || "",
      });
      
      // Set profile image from current user
      setProfileImage(currentUser.profileImage || null);
      
      // If user signed in with Google but we don't have their profile image yet
      if (currentUser.googleId && !currentUser.profileImage) {
        generateProfileImage();
      }
    }
  }, [currentUser]);

  // Generate a profile image if none exists
  const generateProfileImage = async () => {
    try {
      if (currentUser) {
        // Instead of using external services, generate a colored background with initials
        const firstName = currentUser.firstName || '';
        const lastName = currentUser.lastName || '';
        
        // Simple but unique color based on user email or name
        let hash = 0;
        const str = currentUser.email || `${firstName}${lastName}`;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Generate a bright color (HSL helps ensure good contrast with white text)
        const hue = hash % 360;
        const color = `hsl(${hue}, 65%, 55%)`;
        
        // Create SVG data URI with colored background and initials
        const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'U';
        const svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="${color}" />
            <text x="50" y="50" 
              font-family="Arial, sans-serif" 
              font-size="42" 
              fill="white" 
              text-anchor="middle" 
              dominant-baseline="middle"
              font-weight="bold">${initials}</text>
          </svg>
        `;
        
        const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent.trim())}`;
        
        // Update the user profile with the generated image
        const updatedProfile = await updateUserProfile({
          ...currentUser,
          profileImage: dataUri
        });
        
        if (updatedProfile) {
          setProfileImage(dataUri);
          
          setNotification({
            type: "success",
            message: "Profile image generated successfully!",
          });
        }
      }
    } catch (error) {
      console.error("Failed to generate profile image:", error);
    }
  };

  // Handle manual profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setNotification({
        type: "error",
        message: "Image is too large. Maximum size is 5MB.",
      });
      return;
    }
    
    // Check file type
    if (!file.type.match('image.*')) {
      setNotification({
        type: "error",
        message: "Please select an image file.",
      });
      return;
    }
    
    setIsUploadingImage(true);
    
    try {
      // In a real app, you would upload the file to your server
      // For this demo, we'll use a FileReader to convert to base64
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const imageUrl = event.target.result;
        
        // Update the user profile with the image URL
        const updatedProfile = await updateUserProfile({
          ...currentUser,
          profileImage: imageUrl
        });
        
        if (updatedProfile) {
          setProfileImage(imageUrl);
          setShowImageUpload(false);
          
          setNotification({
            type: "success",
            message: "Profile picture updated successfully!",
          });
        }
        
        setIsUploadingImage(false);
      };
      
      reader.onerror = () => {
        setNotification({
          type: "error",
          message: "Failed to read the image file.",
        });
        setIsUploadingImage(false);
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error("Failed to upload profile image:", error);
      setNotification({
        type: "error",
        message: "Failed to upload profile image. Please try again.",
      });
      setIsUploadingImage(false);
    }
  };

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ type: "", message: "" });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Convert form data to backend expected format
      const profileUpdateData = {
        full_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        // Add additional fields as custom properties
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        profession: formData.profession,
      };
      
      await updateUserProfile(profileUpdateData);
      
      setNotification({
        type: "success",
        message: "Profile updated successfully!",
      });
      
      setEditMode(false);
    } catch (error) {
      console.error("Profile update failed:", error);
      setNotification({
        type: "error",
        message: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Notification component */}
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          {notification.type === "success" ? (
            <i className="bi bi-check-circle"></i>
          ) : (
            <i className="bi bi-exclamation-circle"></i>
          )}
          <span>{notification.message}</span>
          <button
            className="close-notification"
            onClick={() => setNotification({ type: "", message: "" })}
          >
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}
      
      <div className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {profileImage ? (
              <img src={profileImage} alt={`${currentUser.firstName}'s avatar`} />
            ) : currentUser.googleId ? (
              <div className="avatar-placeholder">
                <i className="bi bi-google"></i>
              </div>
            ) : (
              <div className="avatar-placeholder">
                {currentUser.firstName ? currentUser.firstName.charAt(0).toUpperCase() : "U"}
                {currentUser.lastName ? currentUser.lastName.charAt(0).toUpperCase() : ""}
              </div>
            )}
          </div>
          
          <button 
            className="change-avatar-button"
            onClick={() => setShowImageUpload(!showImageUpload)}
            title="Change profile picture"
          >
            <i className="bi bi-camera"></i>
          </button>
          
          {showImageUpload && (
            <div className="image-upload-overlay">
              <div className="image-upload-container">
                <h3>Update Profile Picture</h3>
                
                <div className="upload-options">
                  <label className="upload-option">
                    <i className="bi bi-upload"></i>
                    <span>Upload Photo</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                    />
                  </label>
                  
                  {currentUser.googleId && !profileImage && (
                    <button 
                      className="upload-option"
                      onClick={generateProfileImage}
                      disabled={isUploadingImage}
                    >
                      <i className="bi bi-google"></i>
                      <span>Generate Avatar</span>
                    </button>
                  )}
                  
                  {profileImage && (
                    <button 
                      className="upload-option remove"
                      onClick={async () => {
                        await updateUserProfile({
                          ...currentUser,
                          profileImage: null
                        });
                        setProfileImage(null);
                        setShowImageUpload(false);
                      }}
                      disabled={isUploadingImage}
                    >
                      <i className="bi bi-trash"></i>
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>
                
                <div className="upload-actions">
                  <button 
                    className="cancel-upload"
                    onClick={() => setShowImageUpload(false)}
                    disabled={isUploadingImage}
                  >
                    Cancel
                  </button>
                </div>
                
                {isUploadingImage && (
                  <div className="upload-loading">
                    <i className="bi bi-arrow-repeat spin"></i>
                    <span>Uploading...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="profile-title">
          <h1>{currentUser.firstName} {currentUser.lastName}</h1>
          <p>Member since {new Date(currentUser.createdAt || Date.now()).toLocaleDateString()}</p>
          {currentUser.googleId && (
            <span className="google-badge">
              <i className="bi bi-google"></i> Google Account
            </span>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <i className="bi bi-person-badge"></i> Profile
        </button>
        <button 
          className={`tab ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <i className="bi bi-shield-lock"></i> Security
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "profile" && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Personal Information</h2>
              <button 
                className="edit-button"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? (
                  <><i className="bi bi-x-lg"></i> Cancel</>
                ) : (
                  <><i className="bi bi-pencil"></i> Edit Profile</>
                )}
              </button>
            </div>
            
            {editMode ? (
              <form onSubmit={handleSaveProfile} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="profession">Profession</label>
                  <input
                    type="text"
                    id="profession"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="save-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <><i className="bi bi-arrow-repeat spin"></i> Saving...</>
                    ) : (
                      <><i className="bi bi-check-lg"></i> Save Changes</>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setEditMode(false)}
                    disabled={isSubmitting}
                  >
                    <i className="bi bi-x"></i> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-row">
                  <div className="info-label"><i className="bi bi-person"></i> Name</div>
                  <div className="info-value">{currentUser.firstName} {currentUser.lastName}</div>
                </div>
                <div className="info-row">
                  <div className="info-label"><i className="bi bi-envelope"></i> Email</div>
                  <div className="info-value">{currentUser.email}</div>
                </div>
                <div className="info-row">
                  <div className="info-label"><i className="bi bi-telephone"></i> Phone</div>
                  <div className="info-value">{currentUser.phone || "Not provided"}</div>
                </div>
                <div className="info-row">
                  <div className="info-label"><i className="bi bi-briefcase"></i> Profession</div>
                  <div className="info-value">{currentUser.profession || "Not specified"}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "security" && (
          <div className="profile-section">
            <div className="section-header">
              <h2>Security Settings</h2>
            </div>
            <div className="security-content">
              <div className="security-item">
                <div className="security-info">
                  <h3>Change Password</h3>
                  <p>Update your password regularly to maintain account security</p>
                </div>
                <button className="security-button">
                  <i className="bi bi-key"></i> Change Password
                </button>
              </div>
              
              <div className="security-item">
                <div className="security-info">
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <button className="security-button">
                  <i className="bi bi-shield-check"></i> Enable 2FA
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="profile-footer">
        <button
          className="logout-button"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <><i className="bi bi-arrow-repeat spin"></i> Logging out...</>
          ) : (
            <><i className="bi bi-box-arrow-right"></i> Log Out</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
