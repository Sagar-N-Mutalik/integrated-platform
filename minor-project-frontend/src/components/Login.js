import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Phone } from 'lucide-react';
import './Auth.css';

const Login = ({ onLogin, onBackToHome, onSwitchToSignup, authError }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpStep, setOtpStep] = useState('phone'); // 'phone' or 'verify'
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    otp: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showOtpForm) {
      onLogin({ email: formData.email, otp: formData.otp });
    } else {
      onLogin({ email: formData.email, password: formData.password });
    }
  };

  const handleOtpRequest = (e) => {
    e.preventDefault();
    setShowOtpForm(true);
    setOtpStep('phone');
    setOtpSent(false);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
    if (!formData.phone) {
      alert('Please enter your phone number');
      return;
    }

    setSendingOtp(true);
    
    try {
      // TODO: Replace with actual API call to send OTP
      // const response = await fetch('/api/v1/auth/send-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone: formData.phone })
      // });
      
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOtpSent(true);
      setOtpStep('verify');
      alert(`OTP sent to ${formData.phone} (Demo: Use 123456)`);
    } catch (error) {
      alert('Failed to send OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <button onClick={() => onBackToHome()} className="back-btn">
            <ArrowLeft /> Back to Home
          </button>
        </div>
        
        <div className="form-section">
          <div className="form-card">
            <div className="form-header">
              <h2>{showOtpForm ? 'Verify OTP' : 'Welcome Back'}</h2>
              <p>{showOtpForm ? 'Enter the OTP sent to your email' : 'Sign in to access your health records'}</p>
            </div>

            {authError && <div className="error-message">{authError}</div>}

            <form onSubmit={handleSubmit}>
              {!showOtpForm ? (
                <>
                  <div className="form-group">
                    <div className="input-group">
                      <Mail className="input-icon" />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input-group">
                      <Lock className="input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="submit-btn">
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  <div className="form-group">
                    <div className="input-group">
                      <Mail className="input-icon" />
                      <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        value={formData.otp}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                        maxLength="6"
                      />
                    </div>
                  </div>

                  <button type="submit" className="submit-btn">
                    Verify OTP
                  </button>
                </>
              )}
            </form>

            <div className="form-footer">
              {!showOtpForm ? (
                <>
                  <button onClick={handleOtpRequest} className="link-btn">
                    Sign in with OTP
                  </button>
                  <p>
                    Don't have an account?{' '}
                    <button onClick={() => onSwitchToSignup()} className="link-btn">
                      Sign Up
                    </button>
                  </p>
                </>
              ) : (
                <button onClick={() => setShowOtpForm(false)} className="link-btn">
                  Back to Password Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
