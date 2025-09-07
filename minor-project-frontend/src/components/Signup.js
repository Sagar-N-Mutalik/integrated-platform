import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, Calendar, ArrowLeft } from 'lucide-react';
import './Auth.css';

const Signup = ({ onSignup, onSendOtp, onVerifyOtp, onBackToHome, onSwitchToLogin, authError }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: 'male',
    password: '',
    confirmPassword: '',
    otp: '',
    agreedToTerms: false
  });

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    return { hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, isLongEnough };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    const newErrors = {};
    
    if (!data.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!data.email.trim()) newErrors.email = 'Email is required';
    if (!data.dob) newErrors.dob = 'Date of birth is required';
    if (!data.gender) newErrors.gender = 'Gender is required';
    if (!data.termsAccepted) newErrors.termsAccepted = 'You must agree to the terms';
    
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isLongEnough || !passwordValidation.hasUpperCase || 
        !passwordValidation.hasNumbers || !passwordValidation.hasSpecialChar) {
      newErrors.password = 'Password must have 8 characters, a capital letter, a special character and a number';
    }
    
    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSignup(data);
    }
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    const validation = validatePassword(password);
    
    if (password.length > 0 && (!validation.isLongEnough || !validation.hasUpperCase || 
        !validation.hasNumbers || !validation.hasSpecialChar)) {
      setErrors(prev => ({ ...prev, password: 'Password must have 8 characters, a capital letter, a special character and a number' }));
    } else {
      setErrors(prev => ({ ...prev, password: '' }));
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
              <h2>{showOtpForm ? 'Verify Your Email' : 'Create Account'}</h2>
              <p>{showOtpForm ? 'Enter the OTP sent to your email' : 'Join us to secure your medical records'}</p>
            </div>

            {authError && <div className="error-message">{authError}</div>}

            <form onSubmit={handleSubmit} className="auth-form signup-form">
              <div className="input-group">
                <User className="input-icon" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  required
                />
                {errors.fullName && <span className="field-error">{errors.fullName}</span>}
              </div>

              <div className="input-group">
                <Mail className="input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="input-group">
                <Calendar className="input-icon" />
                <input
                  type="date"
                  name="dob"
                  required
                />
                {errors.dob && <span className="field-error">{errors.dob}</span>}
              </div>

              <div className="input-group">
                <label className="radio-label">Gender</label>
                <div className="radio-row">
                  <label>
                    <input type="radio" name="gender" value="male" />
                    <span>Male</span>
                  </label>
                  <label>
                    <input type="radio" name="gender" value="female" />
                    <span>Female</span>
                  </label>
                  <label>
                    <input type="radio" name="gender" value="other" />
                    <span>Other</span>
                  </label>
                </div>
                {errors.gender && <span className="field-error">{errors.gender}</span>}
              </div>

              <div className="input-group">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  onChange={handlePasswordChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="input-group">
                <Lock className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>

              {showOtpForm && (
                <div className="input-group">
                  <input
                    type="text"
                    name="otp"
                    placeholder="OTP"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                    required
                  />
                  {errors.otp && <span className="field-error">{errors.otp}</span>}
                </div>
              )}

              <div className="input-group">
                <label className="terms-row">
                  <input type="checkbox" name="termsAccepted" checked={formData.agreedToTerms} onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })} required />
                  <span>I agree to the terms of services and privacy policy</span>
                </label>
                {errors.termsAccepted && <span className="field-error">{errors.termsAccepted}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <div className="loading"></div> : 'Create Account'}
              </button>
            </form>

            <div className="form-footer">
              {!showOtpForm ? (
                <p>
                  Already have an account?{' '}
                  <button onClick={() => onSwitchToLogin()} className="link-btn">
                    Sign In
                  </button>
                </p>
              ) : (
                <button onClick={() => setShowOtpForm(false)} className="link-btn">
                  Back to Registration
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
