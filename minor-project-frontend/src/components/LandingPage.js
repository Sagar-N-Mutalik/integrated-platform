import React, { useState, useEffect, useRef } from 'react';
import {
  Heart, Shield, Users, Calendar, FileText,
  ArrowRight, Star, MapPin, ChevronRight, Check,
  Zap, Lock, Share2, Activity, Award, Clock, MessageSquare, Phone, Mail, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './LandingPage.css';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const slideIn = (direction = 'left') => ({
  hidden: {
    opacity: 0,
    x: direction === 'left' ? -50 : 50,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: 0.2
    }
  }
});

const FeatureCard = ({ icon: Icon, title, description, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px'
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      transition={{ delay: index * 0.1 }}
      className="feature-card"
    >
      <div className="feature-icon">
        <Icon size={32} />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </motion.div>
  );
};

const StatItem = ({ value, label, icon: Icon, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      transition={{ delay: 0.1 + (index * 0.1) }}
      className="stat-item"
    >
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </motion.div>
  );
};

// Removed duplicate animation variants and FeatureCard definition

const LandingPage = ({ onLogin, onSignup }) => {
  const [healthTips, setHealthTips] = useState([]);
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialsRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    // Fetch data on component mount
    const fetchData = async () => {
      try {
        // These functions are defined below in your component
        await fetchHealthTips();
        await fetchFeaturedDoctors();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Add scroll event listener for header styling
    const handleScroll = () => {
      // setScrolled is a state updater from useState
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the scroll listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // <-- The empty dependency array ensures this runs only once.

  const fetchHealthTips = async () => {
    try {
      const response = await fetch('/api/v1/health-tips');
      if (response.ok) {
        const tips = await response.json();
        setHealthTips(tips.slice(0, 3)); // Show only 3 tips
      }
    } catch (error) {
      console.error('Failed to fetch health tips:', error);
    }
  };

  const fetchFeaturedDoctors = async () => {
    try {
      const response = await fetch('/api/v1/doctors');
      if (response.ok) {
        const doctors = await response.json();
        setFeaturedDoctors(doctors.slice(0, 3)); // Show only 3 doctors
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const features = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Your health data is protected with end-to-end encryption and blockchain technology, ensuring maximum security and privacy."
    },
    {
      icon: Users,
      title: "Find Top Specialists",
      description: "Connect with board-certified doctors and healthcare providers in your area with just a few clicks."
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Book, reschedule, or cancel appointments 24/7 with our intelligent scheduling system."
    },
    {
      icon: Share2,
      title: "Seamless Sharing",
      description: "Securely share your medical records with healthcare providers, anytime, anywhere."
    },
    {
      icon: Activity,
      title: "Health Insights",
      description: "Get personalized health insights and recommendations powered by AI analysis of your medical history."
    },
    {
      icon: Zap,
      title: "Instant Access",
      description: "Access your complete medical history, test results, and prescriptions from any device, anytime."
    }
  ];

  const stats = [
    { value: "10,000+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9/5", label: "User Rating" },
    { value: "24/7", label: "Support" }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      content: "This platform has revolutionized how I manage patient records. The security features are unmatched.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Patient",
      content: "I can access all my medical history in one place and share it with any doctor. It's a game-changer!",
      rating: 5
    },
    {
      name: "Dr. Robert Taylor",
      role: "General Practitioner",
      content: "The appointment scheduling system saves me hours every week. Highly recommended for any practice.",
      rating: 4
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Create Your Profile",
      description: "Sign up and complete your health profile in minutes.",
      icon: <Users size={24} />
    },
    {
      number: 2,
      title: "Upload Your Records",
      description: "Securely upload your medical history, test results, and prescriptions.",
      icon: <Upload size={24} />
    },
    {
      number: 3,
      title: "Connect with Doctors",
      description: "Find and book appointments with healthcare providers in your network.",
      icon: <MessageSquare size={24} />
    },
    {
      number: 4,
      title: "Manage Your Health",
      description: "Access your complete health profile and get personalized insights.",
      icon: <Activity size={24} />
    }
  ];

  // Scroll to section handler
  const scrollTo = (ref) => {
    if (ref && ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 80,
        behavior: 'smooth'
      });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="landing-page">
      <header className={`landing-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <button className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Heart className="logo-icon" />
            <span className="logo-text">HealthVault</span>
          </button>

          <button
            className={`mobile-menu-button ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <a href="#features" onClick={() => scrollTo(featuresRef)}>Features</a>
            <a href="#how-it-works" onClick={() => scrollTo(howItWorksRef)}>How It Works</a>
            <a href="#testimonials" onClick={() => scrollTo(testimonialsRef)}>Testimonials</a>
            <a href="#contact" onClick={() => scrollTo(contactRef)}>Contact</a>
            <div className="auth-buttons">
              <button onClick={onLogin} className="btn btn-outline">Log In</button>
              <button onClick={onSignup} className="btn btn-primary">Get Started</button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="hero" ref={heroRef} id="home">
        <div className="container">
          <div className="hero-content">
            <motion.div
              className="hero-text"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.span
                className="section-subtitle"
                variants={fadeInUp}
              >
                Welcome to HealthVault
              </motion.span>

              <motion.h1
                className="hero-title"
                variants={fadeInUp}
              >
                Your Health, <span className="gradient-text">Your Control</span>
              </motion.h1>

              <motion.p
                className="hero-subtitle"
                variants={fadeInUp}
              >
                Securely store, manage, and share your medical records with healthcare providers.
                Get personalized health insights and connect with top doctors—all in one place.
              </motion.p>

              <motion.div
                className="hero-buttons"
                variants={fadeInUp}
              >
                <button
                  onClick={onSignup}
                  className="btn btn-primary btn-large"
                >
                  Get Started Free
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={onLogin}
                  className="btn btn-outline btn-large"
                >
                  Login to Dashboard
                </button>
              </motion.div>

              <motion.div
                className="trust-badges"
                variants={fadeInUp}
              >
                <div className="badge">
                  <Lock size={16} />
                  <span>End-to-End Encryption</span>
                </div>
                <div className="badge">
                  <Users size={16} />
                  <span>Trusted by 10,000+ Users</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-image"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="hero-card">
                <div className="card-icon">
                  <Shield size={48} />
                </div>
                <h3>Your Health, Secured</h3>
                <p>End-to-End encryption keeps your medical data safe and private</p>
                <div className="card-stats">
                  <div className="stat">
                    <span className="stat-value">99.9%</span>
                    <span className="stat-label">Uptime</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">256-bit</span>
                    <span className="stat-label">Encryption</span>
                  </div>
                </div>
              </div>

              <div className="floating-elements">
                <div className="element element-1"></div>
                <div className="element element-2"></div>
                <div className="element element-3"></div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section features" ref={featuresRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-subtitle">Features</span>
            <h2 className="section-title">Everything You Need in One Place</h2>
            <p className="section-description">
              Our platform combines cutting-edge technology with user-friendly design to give you
              complete control over your healthcare journey.
            </p>
          </motion.div>

          <motion.div
            className="features-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </motion.div>

          <div className="stats-container">
            {stats.map((stat, index) => (
              <StatItem
                key={index}
                value={stat.value}
                label={stat.label}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className="features-cta">
          <div className="container">
            <motion.div
              className="cta-content"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h3>Ready to take control of your health records?</h3>
              <p>Join thousands of users who trust HealthVault for their healthcare needs.</p>
              <button
                onClick={onSignup}
                className="btn btn-primary btn-large"
              >
                Get Started for Free
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section how-it-works" ref={howItWorksRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-subtitle">Process</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">
              Getting started with HealthVault is quick and easy. Follow these simple steps to take
              control of your health records today.
            </p>
          </motion.div>

          <div className="steps-container">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="step-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="step-number">{step.number}</div>
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section testimonials" ref={testimonialsRef}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-subtitle">Testimonials</span>
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-description">
              Don't just take our word for it. Here's what our community has to say about their experience.
            </p>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < testimonial.rating ? "#F59E0B" : "none"}
                      color={i < testimonial.rating ? "#F59E0B" : "#D1D5DB"}
                    />
                  ))}
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section
      <section className="section cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Take Control of Your Health Records?</h2>
            <p>Join thousands of users who trust HealthVault for secure, accessible, and comprehensive health record management.</p>
            <div className="cta-buttons">
              <button 
                onClick={onSignup} 
                className="btn btn-primary btn-large"
              >
                Get Started for Free
              </button>
              <button 
                onClick={onLogin} 
                className="btn btn-outline btn-large"
              >
                Schedule a Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* Contact Section */}
      <section id="contact" className="section contact" ref={contactRef}>
        <div className="container">
          <div className="contact-grid">
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="section-title">Get In Touch</h2>
              <p className="section-description">
                Have questions or need assistance? Our team is here to help you with any inquiries
                about our platform and services.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="contact-icon">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4>Email Us</h4>
                    <a href="mailto:support@healthvault.com">support@healthvault.com</a>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="contact-icon">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4>Call Us</h4>
                    <a href="tel:+18005551234">+1 (800) 555-1234</a>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="contact-icon">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4>Working Hours</h4>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.form
              className="contact-form"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Tell us more about your inquiry..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary">
                Send Message
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Health Tips Section */}
      <section className="health-tips">
        <div className="container">
          <h2>Daily Health Tips</h2>
          <div className="tips-grid">
            {healthTips.length > 0 ? (
              healthTips.map((tip) => (
                <div key={tip.id} className="tip-card">
                  <div className="tip-category">{tip.category}</div>
                  <h3>{tip.title}</h3>
                  <p>{tip.content}</p>
                  {tip.author && <div className="tip-author">- {tip.author}</div>}
                </div>
              ))
            ) : (
              // Default tips if none from API
              [
                {
                  id: 1,
                  category: "NUTRITION",
                  title: "Stay Hydrated",
                  content: "Drink at least 8 glasses of water daily to maintain optimal health and energy levels."
                },
                {
                  id: 2,
                  category: "EXERCISE",
                  title: "Daily Movement",
                  content: "Incorporate 30 minutes of physical activity into your daily routine for better cardiovascular health."
                },
                {
                  id: 3,
                  category: "MENTAL_HEALTH",
                  title: "Mindful Moments",
                  content: "Take 5-10 minutes daily for meditation or deep breathing to reduce stress and improve focus."
                }
              ].map((tip, index) => (
                <div key={tip.id} className={`tip-card hover-lift animate-fade-in-up animate-delay-${(index + 1) * 100}`}>
                  <div className="tip-category">{tip.category}</div>
                  <h3>{tip.title}</h3>
                  <p>{tip.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-text"
          >
            <h1 className="hero-title">
              Take Control of Your <span className="gradient-text">Health Data</span>
            </h1>
            <p className="hero-subtitle">
              Securely store, manage, and share your medical records with healthcare providers.
              Powered by blockchain and AI for ultimate security and convenience.
            </p>
            <div className="hero-buttons">
              <a href="#signup" className="hero-button primary-button" onClick={onSignup}>
                Get Started Free
                <ChevronRight size={20} />
              </a>
              <a href="#features" className="hero-button secondary-button">
                Learn More
              </a>
            </div>

            <div className="trust-badges">
              <div className="badge">
                <Shield size={18} />
                <span>End-to-End Encryption</span>
              </div>
              <div className="badge">
                <Users size={18} />
                <span>Trusted by 10,000+ Patients</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-image"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="floating-elements">
              <div className="floating-element el1"></div>
              <div className="floating-element el2"></div>
              <div className="floating-element el3"></div>
            </div>
            <div className="dashboard-preview">
              {/* This would be your dashboard screenshot or illustration */}
            </div>
          </motion.div>
        </div>

        <div className="scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
        </div>
      </section>

      {/* Floating particles background */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 5 + 1}px`,
            height: `${Math.random() * 5 + 1}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 10}s`
          }} />
        ))}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-brand">
                <Heart className="logo-icon" />
                <span className="logo-text">HealthVault</span>
              </div>
              <p className="footer-description">
                Empowering individuals to take control of their health data with secure,
                accessible, and comprehensive health record management.
              </p>
              <div className="social-links">
                <button aria-label="Facebook" onClick={() => console.log('Facebook link clicked')}>
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button aria-label="Twitter" onClick={() => console.log('Twitter link clicked')}>
                  <i className="fab fa-twitter"></i>
                </button>
                <button aria-label="LinkedIn" onClick={() => console.log('LinkedIn link clicked')}>
                  <i className="fab fa-linkedin-in"></i>
                </button>
                <button aria-label="Instagram" onClick={() => console.log('Instagram link clicked')}>
                  <i className="fab fa-instagram"></i>
                </button>
              </div>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><button onClick={() => console.log('Pricing clicked')}>Pricing</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Resources</h3>
              <ul className="footer-links">
                <li><button onClick={() => console.log('Blog clicked')}>Blog</button></li>
                <li><button onClick={() => console.log('Help Center clicked')}>Help Center</button></li>
                <li><button onClick={() => console.log('Tutorials clicked')}>Tutorials</button></li>
                <li><button onClick={() => console.log('API Documentation clicked')}>API Documentation</button></li>
                <li><button onClick={() => console.log('Status clicked')}>Status</button></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Company</h3>
              <ul className="footer-links">
                <li><button onClick={() => console.log('About Us clicked')}>About Us</button></li>
                <li><button onClick={() => console.log('Careers clicked')}>Careers</button></li>
                <li><button onClick={() => console.log('Press clicked')}>Press</button></li>
                <li><button onClick={() => console.log('Partners clicked')}>Partners</button></li>
                <li><button onClick={() => console.log('Contact clicked')}>Contact</button></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="copyright">
              &copy; {new Date().getFullYear()} HealthVault. All rights reserved.
            </p>
            <div className="footer-legal">
              <button onClick={() => console.log('Privacy Policy clicked')}>Privacy Policy</button>
              <button onClick={() => console.log('Terms of Service clicked')}>Terms of Service</button>
              <button onClick={() => console.log('Cookie Policy clicked')}>Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;