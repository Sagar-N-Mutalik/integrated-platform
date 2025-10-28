import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./components/ThemeContext";
import { ToastProvider } from "./components/ToastContext";
<<<<<<< HEAD
import ThemeToggle from "./components/ThemeToggle";
=======
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import DoctorSearch from "./components/DoctorSearch";
import HospitalDirectory from "./components/HospitalDirectory";
import "./App.css";

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
<<<<<<< HEAD
  
  // Initialize currentView from localStorage or default to "landing"
  const [currentView, setCurrentView] = useState(() => {
    const savedView = localStorage.getItem("currentView");
    const token = localStorage.getItem("token");
    
    // If user is logged in and has a saved view, use it
    if (token && savedView) {
      return savedView;
    }
    // If user is logged in but no saved view, go to dashboard
    if (token) {
      return "dashboard";
    }
    // Otherwise, show landing page
    return savedView || "landing";
  });

  // Load user data and restore navigation state
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // If user is logged in but on landing/login/signup, redirect to dashboard
        const savedView = localStorage.getItem("currentView");
        if (!savedView || savedView === "landing" || savedView === "login" || savedView === "signup") {
          setCurrentView("dashboard");
          localStorage.setItem("currentView", "dashboard");
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("currentView");
        setCurrentView("landing");
      }
    } else {
      // No token, ensure we're on a public page
      const savedView = localStorage.getItem("currentView");
      if (savedView && !["landing", "login", "signup"].includes(savedView)) {
        setCurrentView("landing");
        localStorage.setItem("currentView", "landing");
      }
    }
    
    setLoading(false);
  }, []);

  // Save currentView to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentView", currentView);
  }, [currentView]);

=======
  const [currentView, setCurrentView] = useState("landing");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
  const apiCall = async (endpoint, data) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        console.error("Server returned non-JSON:", text);
        return { error: "Invalid server response" };
      }
    } catch (err) {
      console.error("Network error:", err);
      return { error: "Network error" };
    }
  };

  const handleAuth = async (action, formData) => {
    setAuthError("");
    let data = {};

<<<<<<< HEAD
    try {
      switch (action) {
        case "login":
          data = await apiCall("login", {
            email: formData.email,
            password: formData.password,
          });
          break;
        case "register":
          data = await apiCall("register", {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
          });
          break;
        case "sendOtp":
          data = await apiCall("send-otp", { email: formData });
          break;
        case "verifyOtp":
          data = await apiCall("verify-otp", {
            email: formData.email,
            otp: formData.otp,
            fullName: formData.fullName,
            password: formData.password,
          });
          break;
        default:
          break;
      }

      if (data.token) {
        const userData = {
          id: data.userId,
          email: data.email,
          fullName: data.fullName,
        };
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setCurrentView("dashboard");
        return { success: true };
      } else if (data.message || data.error) {
        setAuthError(data.message || data.error);
        return { success: false, error: data.message || data.error };
      }
    } catch (error) {
      setAuthError("An unexpected error occurred. Please try again.");
      return { success: false, error: "An unexpected error occurred" };
=======
    switch (action) {
      case "login":
        data = await apiCall("login", {
          email: formData.email,
          password: formData.password,
        });
        break;
      case "register":
        data = await apiCall("register", {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
        break;
      case "sendOtp":
        data = await apiCall("send-otp", { email: formData });
        break;
      case "verifyOtp":
        data = await apiCall("verify-otp", {
          email: formData.email,
          otp: formData.otp,
          fullName: formData.fullName,
          password: formData.password,
        });
        break;
      default:
        break;
    }

    if (data.token) {
      const userData = {
        id: data.userId,
        email: data.email,
        fullName: data.fullName,
      };
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setCurrentView("dashboard");
    } else if (data.message || data.error) {
      setAuthError(data.message || data.error);
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
    }
  };

  const handleLogin = (formData) => handleAuth("login", formData);
  const handleRegister = (formData) => handleAuth("register", formData);
  const handleSendOtp = (email) => handleAuth("sendOtp", email);
  const handleVerifyOtp = (formData) => handleAuth("verifyOtp", formData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
<<<<<<< HEAD
    localStorage.setItem("currentView", "landing");
    setUser(null);
    setCurrentView("landing");
  };

  const handleAccountDeleted = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem("currentView", "landing");
=======
    setUser(null);
    setCurrentView("login");
  };

  const handleAccountDeleted = () => {
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
    setUser(null);
    setCurrentView("landing");
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
<<<<<<< HEAD
      <ThemeToggle />
      
=======
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
      {currentView === "landing" && (
        <LandingPage
          onLogin={() => setCurrentView("login")}
          onSignup={() => setCurrentView("signup")}
        />
      )}

      {currentView === "login" && (
        <Login
          onLogin={handleLogin}
          onBackToHome={() => setCurrentView("landing")}
          onSwitchToSignup={() => setCurrentView("signup")}
          authError={authError}
        />
      )}

      {currentView === "signup" && (
        <Signup
          onSignup={handleRegister}
          onBackToHome={() => setCurrentView("landing")}
          onSwitchToLogin={() => setCurrentView("login")}
          authError={authError}
          onSendOtp={handleSendOtp}
          onVerifyOtp={handleVerifyOtp}
        />
      )}

      {currentView === "dashboard" && (
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onSearchDoctors={() => setCurrentView("doctors")}
          onViewHospitals={() => setCurrentView("hospitals")}
          onAccountDeleted={handleAccountDeleted}
<<<<<<< HEAD
          onBackToHome={() => setCurrentView("landing")}
=======
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
        />
      )}

      {currentView === "doctors" && (
        <DoctorSearch
          user={user}
          onBack={() => setCurrentView("dashboard")}
        />
      )}

      {currentView === "hospitals" && (
<<<<<<< HEAD
        <HospitalDirectory onBack={() => setCurrentView("dashboard")} />
=======
        <HospitalDirectory />
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
      )}
    </div>
  );
};

const App = () => (
  <ToastProvider>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </ToastProvider>
);

export default App;