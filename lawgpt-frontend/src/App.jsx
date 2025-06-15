import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./styles/App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/layout/Footer";
import ChatLayout from "./components/ChatLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LegalDictionary from "./pages/LegalDictionary";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import LawyersPage from "./pages/LawyersPage";
import LawyerProfilePage from "./pages/LawyerProfilePage";
import LawyerRegistrationPage from "./pages/LawyerRegistrationPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import NotFound from "./pages/NotFound";
import TermsPage from "./pages/static/TermsPage";
import PrivacyPage from "./pages/static/PrivacyPage";
import DisclaimerPage from "./pages/static/DisclaimerPage";
import { SessionProvider } from "./context/SessionContext";
import { AuthProvider, AuthConsumer, useAuth } from "./context/AuthContext";
import FaviconLoader from "./components/shared/Loaders";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="app-loading">
        <FaviconLoader size="md" fullScreen={true} />
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Public route - redirects to home if already authenticated
const PublicRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="app-loading">
        <FaviconLoader size="md" fullScreen={true} />
      </div>
    );
  }
  
  if (currentUser) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Admin route - only accessible to admin users
const AdminRoute = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="app-loading">
        <FaviconLoader size="md" fullScreen={true} />
      </div>
    );
  }

  // Check if user is admin
  if (!currentUser || !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// PageTransition component to handle loading between route changes
const PageTransition = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loader on route change
    setIsLoading(true);
    
    // Simulate loading delay (1 second instead of 3)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="page-transition-loader">
        <FaviconLoader 
          size="md" 
          fullScreen={true} 
        />
      </div>
    );
  }

  return children;
};

// App Layout Component
const AppLayout = () => {
  const { loading: authLoading } = useAuth();
  const location = useLocation();
  
  // Check if we're on an auth page (login, signup, or forgot password)
  const isAuthPage = 
    location.pathname === '/login' || 
    location.pathname === '/signup' || 
    location.pathname === '/forgot-password';
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  
  // Check if we're on the chat page
  const isChatPage = 
    location.pathname === '/chat' || 
    location.pathname.startsWith('/category/') ||
    location.pathname.startsWith('/chat/lawyer/');
    
  // Check if we're on the document analysis page
  const isDocumentPage = location.pathname === '/documents';
  
  // Check if we're on a static page (terms, privacy, disclaimer)
  const isStaticPage = 
    location.pathname === '/terms' ||
    location.pathname === '/privacy' ||
    location.pathname === '/disclaimer';
  
  if (authLoading) {
    return (
      <div className="app-loading">
        <FaviconLoader size="md" fullScreen={true} />
      </div>
    );
  }
  
  // For chat page, we don't want to show the navbar or regular container
  if (isChatPage) {
    return (
      <div className="App full-page">
        <PageTransition>
          <Routes>
            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatLayout />
              </ProtectedRoute>
            } />
            <Route path="/category/:category" element={
              <ProtectedRoute>
                <ChatLayout />
              </ProtectedRoute>
            } />
            <Route path="/chat/lawyer/:lawyerId" element={
              <ProtectedRoute>
                <ChatLayout chatType="lawyer" />
              </ProtectedRoute>
            } />
          </Routes>
        </PageTransition>
      </div>
    );
  }
  
  return (
    <div className="App">
      {/* Show Navbar on all pages except auth pages */}
      {!isAuthPage && <Navbar />}
      
      <main className={isAuthPage ? "" : isDocumentPage ? "app-main document-page-main" : "app-main"}>
        <PageTransition>
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/dictionary" element={
              <ProtectedRoute>
                <LegalDictionary />
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute>
                <DocumentAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            } />
            <Route path="/lawyers" element={
              <ProtectedRoute>
                <LawyersPage />
              </ProtectedRoute>
            } />
            <Route path="/lawyers/:id" element={
              <ProtectedRoute>
                <LawyerProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/lawyer-registration" element={
              <ProtectedRoute>
                <LawyerRegistrationPage />
              </ProtectedRoute>
            } />
            {/* Static pages - accessible to all */}
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </main>
      
      {/* Only show footer when not on auth pages or chat pages or document pages */}
      {!isAuthPage && !isChatPage && !isDocumentPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SessionProvider>
          <AuthConsumer>
            <AppLayout />
          </AuthConsumer>
        </SessionProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
