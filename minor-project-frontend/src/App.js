import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./components/ThemeContext";
import { ToastProvider } from "./components/ToastContext";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import DoctorSearch from "./components/DoctorSearch";
import "./App.css";

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
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

  // ✅ Fixed: Added full backend URL
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

      // Handle non-JSON responses gracefully
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
    }
  };

  const handleLogin = (formData) => handleAuth("login", formData);
  const handleRegister = (formData) => handleAuth("register", formData);
  const handleSendOtp = (email) => handleAuth("sendOtp", email);
  const handleVerifyOtp = (formData) => handleAuth("verifyOtp", formData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCurrentView("login");
  };

  const handleNavigation = (view) => setCurrentView(view);
  const handleAccountDeleted = () => {
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
          onFileUpload={() => window.location.reload()}
          onFileShare={() => {}}
          onAccountDeleted={handleAccountDeleted}
        />
      )}

      {currentView === "doctors" && (
        <DoctorSearch
          user={user}
          onBack={() => setCurrentView("dashboard")}
        />
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
