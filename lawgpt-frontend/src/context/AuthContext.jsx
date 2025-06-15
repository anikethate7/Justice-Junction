import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is authenticated
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          // Validate token with backend
          const userData = await api.validateToken();
          
          // Ensure we got valid user data back
          if (userData && userData.username) {
            console.log("Token validation successful:", userData);
            setCurrentUser(userData);
            
            // Check if user is admin
            if (userData.isAdmin) {
              console.log("Admin user authenticated");
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          } else {
            console.error("Auth validation returned invalid user data");
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            setCurrentUser(null);
            setIsAdmin(false);
          }
        } catch (err) {
          console.error("Auth validation error:", err);
          // Don't try to validate again if token is invalid
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          setCurrentUser(null);
          setIsAdmin(false);
        }
      } else {
        // Make sure we explicitly set loading to false when no token exists
        setCurrentUser(null);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Auth check error:", err);
      // Ensure we clean up auth data on any error
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setCurrentUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication on initial load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Listen for localStorage changes to keep auth state in sync
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Login function
  const login = async (email, password, googleData = null) => {
    setLoading(true);
    setError(null);

    // Create a timeout to prevent the loading state from getting stuck
    let loginTimeoutId = setTimeout(() => {
      console.error("AuthContext: Login timeout reached");
      setLoading(false);
      setError("Login request timed out. Please try again later.");
    }, 20000); // 20 seconds timeout as a last resort

    try {
      let response;
      
      // If we have googleData, use that instead of email/password
      if (googleData) {
        console.log("AuthContext: Using Google login data");
        response = googleData;
      } else {
        console.log("AuthContext: Attempting login for", email);
        response = await api.login(email, password);
      }
      
      // Clear the timeout when we get a response
      clearTimeout(loginTimeoutId);
      
      // Store token and user data in localStorage
      localStorage.setItem("authToken", response.token || response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));
      
      // Update state with user data
      setCurrentUser(response.user);

      // Check if user is admin and update state
      if (response.user && response.user.isAdmin) {
        console.log("Admin user logged in");
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      console.log("AuthContext: Login successful");
      return response.user;
    } catch (err) {
      // Clear the timeout when we get an error
      clearTimeout(loginTimeoutId);
      
      console.error("AuthContext: Login error:", err);
      
      // Set a user-friendly error message
      const errorMessage = err.message || 
        (err.response?.data?.detail ? err.response.data.detail : "Login failed. Please try again.");
      
      setError(errorMessage);
      
      // Ensure we don't have any lingering auth data on error
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData, googleData = null) => {
    setLoading(true);
    setError(null);

    try {
      if (googleData) {
        // If we have googleData, use that directly
        const { user, access_token } = googleData.data;
        localStorage.setItem("authToken", access_token);
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
        
        // Check if user is admin
        if (user && user.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        
        return user;
      } else {
        // Normal signup flow
        const { user, token } = await api.register(userData);
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
        setCurrentUser(user);
        
        // Check if user is admin
        if (user && user.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        
        return user;
      }
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setCurrentUser(null);
      setIsAdmin(false);
    }
  };

  // Update user profile function
  const updateUserProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await api.updateUserProfile(profileData);
      
      // Update the stored user data
      if (updatedUser) {
        // Get the current stored user data
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        
        // Update with the new data, preserving any fields not included in the update
        const mergedUser = { ...storedUser, ...updatedUser };
        
        // Save to localStorage
        localStorage.setItem("user", JSON.stringify(mergedUser));
        
        // Update state
        setCurrentUser(mergedUser);
        
        // Check if user is admin
        if (mergedUser && mergedUser.isAdmin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
      
      return updatedUser;
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    isAdmin,
    login,
    signup,
    logout,
    updateUserProfile,
    checkAuthStatus,
    setCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// This is a separate context consumer component that handles
// admin redirections to admin dashboard
export const AuthConsumer = ({ children }) => {
  const { currentUser, loading, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is authenticated, loaded, and is admin, redirect to admin dashboard
    if (currentUser && !loading && isAdmin) {
      console.log("Redirecting admin user to admin dashboard");
      navigate('/admin');
    }
  }, [currentUser, loading, isAdmin, navigate]);
  
  return children;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
