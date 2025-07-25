import axios from "axios";
import { adminUsers } from "../data/admins";

// Use the environment variable for API URL with a fallback
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
console.log("Using API URL:", API_URL);

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // Increase to 30 seconds for all requests
  withCredentials: true, // Important: Include credentials for CORS
});

// Add a request interceptor to add auth token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }

    // Only clear token for specific 401 errors from authentication endpoints
    if (
      error.response &&
      error.response.status === 401 &&
      (error.config.url.includes("/auth/token") ||
        error.config.url.includes("/auth/me") ||
        error.config.url.includes("/auth/refresh"))
    ) {
      console.log("Authentication failed, clearing tokens");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      // The redirect will be handled by React Router in the AuthContext
    }
    return Promise.reject(error);
  }
);

const api = {
  // Auth endpoints
  register: async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      console.log("Attempting login with:", { email });

      // Check if the user is in the admin list (for development only)
      const adminUser = adminUsers.find(
        (admin) => admin.email === email && admin.password === password
      );

      if (adminUser) {
        console.log("Admin user detected, using mock login");
        // Return a mock successful login response for admin users
        return {
          token: "admin_mock_token_" + Date.now(),
          user: {
            username: adminUser.username,
            email: adminUser.email,
            isAdmin: true,
            full_name: adminUser.full_name,
          },
        };
      }

      // Regular login for non-admin users - Updated to use fetch with credentials
      try {
        const response = await fetch(`${API_URL}/auth/token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          credentials: "include", // Important for CORS!
          body: new URLSearchParams({
            username: email,
            password: password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 401) {
            throw new Error("Invalid username or password. Please try again.");
          } else if (response.status === 429) {
            throw new Error("Too many login attempts. Please try again later.");
          } else if (errorData.detail) {
            throw new Error(errorData.detail);
          } else if (response.status >= 500) {
            throw new Error("Server error. Please try again later.");
          }
          throw new Error(`Login failed with status ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.access_token) {
          throw new Error(
            "Invalid response from server. Missing access token."
          );
        }

        // Log successful login
        console.log("Login successful, token received");

        // The backend only returns access_token and token_type
        // Create a user object from the email as username
        return {
          token: data.access_token,
          user: { username: email.split("@")[0], email: email, isAdmin: false },
        };
      } catch (fetchError) {
        console.error("Fetch login error:", fetchError);

        // Network error
        if (
          fetchError.name === "TypeError" &&
          fetchError.message.includes("fetch")
        ) {
          throw new Error(
            "Cannot connect to server. Please check your internet connection."
          );
        }

        // Re-throw if it's already a custom error
        if (
          fetchError.message.includes("Invalid username") ||
          fetchError.message.includes("Too many login") ||
          fetchError.message.includes("Server error")
        ) {
          throw fetchError;
        }

        // Generic error message as fallback
        throw new Error(
          "Login failed. Please check your connection and try again."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: async () => {
    // Since there might not be a server-side logout endpoint,
    // we can implement a client-side logout
    // This function is intentionally left as a stub to allow for future server-side logout
    // The actual token removal happens in the AuthContext
    return true;
  },

  validateToken: async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Token validation error:", error);
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      const response = await axiosInstance.post("/auth/refresh");
      return response.data;
    } catch (error) {
      console.error("Token refresh error:", error);
      throw error;
    }
  },

  getUserProfile: async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    } catch (error) {
      console.error("Profile fetch error:", error);
      throw error;
    }
  },

  updateUserProfile: async (userData) => {
    try {
      const response = await axiosInstance.put("/auth/profile", userData);
      return response.data;
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  },

  googleLogin: async (token) => {
    try {
      console.log("Attempting Google login with token");

      // Use fetch with credentials for Google login too
      const response = await fetch(`${API_URL}/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for CORS!
        body: JSON.stringify({
          token: token,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error("Google authentication failed. Please try again.");
        } else if (response.status === 429) {
          throw new Error("Too many login attempts. Please try again later.");
        } else if (errorData.detail) {
          throw new Error(errorData.detail);
        } else if (response.status >= 500) {
          throw new Error("Server error. Please try again later.");
        }
        throw new Error(`Google login failed with status ${response.status}`);
      }

      const data = await response.json();

      if (!data || !data.access_token) {
        throw new Error("Invalid response from server. Missing access token.");
      }

      console.log("Google login successful, token received");

      return {
        token: data.access_token,
        user: data.user,
      };
    } catch (error) {
      console.error("Google login error:", error);

      // Network error
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Cannot connect to server. Please check your internet connection."
        );
      }

      // Re-throw if it's already a custom error
      if (
        error.message.includes("Google authentication") ||
        error.message.includes("Too many login") ||
        error.message.includes("Server error")
      ) {
        throw error;
      }

      // Generic error message as fallback
      throw new Error(
        "Google login failed. Please check your connection and try again."
      );
    }
  },

  // Chat endpoints
  createSession: async () => {
    try {
      const response = await axiosInstance.post(`/chat/session`);
      return response.data;
    } catch (error) {
      console.error("Create session error:", error);
      throw error;
    }
  },

  // Fetch all available legal categories
  fetchCategories: async () => {
    try {
      const response = await axiosInstance.get(`/categories/`);
      return response.data;
    } catch (error) {
      console.error("Fetch categories error:", error);
      throw error;
    }
  },

  // Fetch all supported languages
  fetchLanguages: async () => {
    try {
      const response = await axiosInstance.get(`/categories/languages`);
      return response.data;
    } catch (error) {
      console.error("Fetch languages error:", error);
      throw error;
    }
  },

  // Document Analysis endpoints
  uploadDocument: async (formData) => {
    try {
      const response = await axiosInstance.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // The Authorization header will be added by the interceptor
        },
        timeout: 30000, // Longer timeout for document upload and analysis
      });
      return response.data;
    } catch (error) {
      console.error("Document upload error:", error);
      throw error;
    }
  },

  // Send a chat message
  sendMessage: async (
    query,
    category,
    language,
    sessionId,
    messageHistory = []
  ) => {
    try {
      console.log("Sending message:", { query, category, language, sessionId });

      if (!query || !category || !sessionId) {
        throw new Error(
          "Missing required parameters: query, category, and sessionId are required"
        );
      }

      // Convert category to kebab-case for URL - replace spaces with hyphens and lowercase
      const categoryForUrl = category.toLowerCase().replace(/\s+/g, "-");

      // Always use the public endpoint as it works with or without authentication
      const endpoint = `/chat/public/${encodeURIComponent(categoryForUrl)}`;

      console.log(`Using public chat endpoint: ${endpoint}`);

      // Enhanced request with timeout and retry logic
      const makeRequest = async (retryCount = 0) => {
        try {
          return await axiosInstance.post(
            endpoint,
            {
              query,
              category, // Send original category string in the body
              language: language || "English",
              session_id: sessionId,
              messages: messageHistory, // Include the message history
            },
            {
              timeout: 60000, // 60 second timeout for chat requests
            }
          );
        } catch (error) {
          console.error(`Request attempt ${retryCount + 1} failed:`, error);

          // Only retry network errors and certain server errors
          if (
            (error.message === "Network Error" ||
              (error.response && error.response.status >= 500)) &&
            retryCount < 2
          ) {
            console.log(
              `Retrying request (${retryCount + 1}/2) after ${
                (retryCount + 1) * 2000
              }ms...`
            );
            // Wait for increasing amount of time before retrying
            await new Promise((resolve) =>
              setTimeout(resolve, (retryCount + 1) * 2000)
            );
            return makeRequest(retryCount + 1);
          }
          throw error;
        }
      };

      const response = await makeRequest();

      console.log("Message response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Send message error:", error);

      // Provide user-friendly error messages
      if (error.response) {
        // Server responded with error
        if (error.response.status === 400) {
          if (error.response.data.detail?.includes("Invalid category")) {
            throw new Error(
              `Category not found. Please select a valid category from the dropdown.`
            );
          } else {
            throw new Error(
              error.response.data.detail || "Invalid request parameters"
            );
          }
        } else if (error.response.status === 401) {
          throw new Error("You need to be logged in to use this feature");
        } else if (error.response.status === 429) {
          throw new Error(
            "You've reached the rate limit. Please wait a moment before sending more messages"
          );
        } else if (error.response.status >= 500) {
          throw new Error(
            "The server encountered an error. Our team has been notified"
          );
        }
      }

      // Network or timeout errors
      if (error.code === "ECONNABORTED") {
        throw new Error(
          "Request timed out. The AI might be taking too long to respond"
        );
      }

      if (error.message === "Network Error") {
        throw new Error(
          "Cannot connect to the server. Please check your internet connection"
        );
      }

      // Use the original error message if available, or a generic message
      throw new Error(
        error.message ||
          "There was a problem sending your message. Please try again"
      );
    }
  },
};

export default api;
