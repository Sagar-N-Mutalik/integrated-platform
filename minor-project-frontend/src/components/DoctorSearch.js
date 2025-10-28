<<<<<<< HEAD
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, MapPin, Star, Building, Stethoscope, Info, Phone, Mail, ArrowLeft, X, Filter, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import './DoctorSearch.css';
import { useToast } from './ToastContext';

const DoctorSearch = ({ user, onBack }) => {
    // State Management
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [allResults, setAllResults] = useState([]);
    const [searchType, setSearchType] = useState('doctor');
    const [loading, setLoading] = useState(false);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailFormData, setEmailFormData] = useState({
        patientName: user?.fullName || '',
        patientEmail: user?.email || '',
        patientPhone: '',
        message: ''
    });
    const [sendingEmail, setSendingEmail] = useState(false);
    const { showToast } = useToast();

    // Constants
    const districts = [
        "Mysuru", "Bengaluru", "Udupi", "Raichur", "Davangere", "Hubli", "Shivamogga"
    ];

    const specializations = [
       "Cardiology", "Neurology", "Nephrology", "Gastroenterology", "Pulmonology",
        "Endocrinology", "Oncology", "Urology", "Orthopedics", "General Surgery", "Plastic Surgery",
        "Pediatric Surgery", "Neurosurgery", "Cardiothoracic Surgery", "ENT",
        "Ophthalmology", "Dermatology", "Psychiatry", "Psychology", "Pediatrics", "Obstetrics and Gynecology",
        "General Medicine", "Critical Care", "Emergency Medicine", "Radiology", "Pathology",
        "Dentistry", "Anesthesiology", "Physiotherapy", "Diabetology", "Rheumatology"
    ];

    // Fetch all data once on component mount or type change
    const fetchAllData = useCallback(async (type) => {
        setLoading(true);
        const endpoint = type === 'doctor' ? '/api/v1/search/doctors' : '/api/v1/search/hospitals';
        
        try {
            const response = await fetch(endpoint);

            if (response.ok) {
                const data = await response.json();
                setAllResults(data);
                setInitialLoadComplete(true);
                console.log(`✅ Loaded ${data.length} ${type}s from API`);
            } else {
                showToast(`Failed to load ${type}s`, 'error');
                setAllResults([]);
            }
        } catch (error) {
            console.error('API Error:', error);
            showToast('Could not connect to server. Please ensure backend is running on port 8080.', 'error');
            setAllResults([]);
=======
import React, { useState, useEffect, useCallback } from 'react';
// Correct icons are imported (Info icon is already included)
import { Search, MapPin, Star, Building, Stethoscope, Info } from 'lucide-react';
import './DoctorSearch.css';
import { useToast } from './ToastContext';

const DoctorSearch = ({ user }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [results, setResults] = useState([]);
    const [searchType, setSearchType] = useState('doctor'); // 'doctor' or 'hospital'
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Districts list matching your data and requirement
    const districts = [
        "Mysuru",
        "Bengaluru",
        "Udupi",
        "Raichur",
        "Davangere",
        "Hubli",
        "Shivamogga"
    ];

    // Specialization list
    const specializations = [
       "Cardiology", "Neurology", "Nephrology", "Gastroenterology", "Pulmonology (Respiratory Medicine)",
        "Endocrinology", "Oncology (Cancer Care)", "Urology", "Orthopedics", "General Surgery", "Plastic Surgery",
        "Pediatric Surgery", "Neurosurgery", "Cardiothoracic Surgery", "Vascular Surgery", "ENT (Otorhinolaryngology)",
        "Ophthalmology", "Dermatology", "Psychiatry", "Psychology", "Pediatrics", "Obstetrics and Gynecology",
        "General Medicine", "Critical Care / Intensive Care", "Emergency Medicine", "Radiology", "Pathology",
        "Dentistry", "Anesthesiology", "Physiotherapy", "Diabetology", "Rheumatology", "Hematology", "Nuclear Medicine",
        "Transplant Medicine", "Infectious Diseases", "Pain Management", "Family Medicine", "Geriatrics",
        "Occupational Therapy", "Speech Therapy", "Nutrition and Dietetics"
    ];

    // Fetch initial data
    const fetchInitialData = useCallback(async (type = 'doctor') => {
        setLoading(true);
        const endpoint = type === 'doctor' ? '/api/v1/search/doctors' : '/api/v1/search/hospitals';
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(endpoint, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data);
            } else if (response.status === 401 || response.status === 403) {
                 showToast('Session expired. Please log in again.', 'error');
                 setResults([]);
            } else {
                 showToast(`Failed to load ${type}s: Server error ${response.status}`, 'error');
            }
        } catch (error) {
            showToast(`Failed to load ${type}s. Could not connect or parse response.`, 'error');
            setResults([]);
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
        } finally {
            setLoading(false);
        }
    }, [showToast]);

<<<<<<< HEAD
    // Initial data load
    useEffect(() => {
        fetchAllData(searchType);
    }, [searchType, fetchAllData]);

    // Client-side filtering with memoization for performance
    const filteredResults = useMemo(() => {
        if (!initialLoadComplete) return [];

        let results = [...allResults];

        // Apply search term filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            results = results.filter(item => {
                if (searchType === 'doctor') {
                    return (item.fullName || '').toLowerCase().includes(searchLower);
                } else {
                    return (item.hospitalName || '').toLowerCase().includes(searchLower);
                }
            });
        }

        // Apply district filter
        if (selectedDistrict) {
            results = results.filter(item => {
                return (item.district || '').toLowerCase() === selectedDistrict.toLowerCase();
            });
        }

        // Apply specialization filter
        if (selectedSpecialization) {
            results = results.filter(item => {
                if (searchType === 'doctor') {
                    return (item.specialization || '').toLowerCase() === selectedSpecialization.toLowerCase();
                } else {
                    // For hospitals, check if specialization exists in specialties array
                    if (Array.isArray(item.specialties)) {
                        return item.specialties.some(spec => 
                            spec.toLowerCase().includes(selectedSpecialization.toLowerCase())
                        );
                    }
                    return false;
                }
            });
        }

        console.log(`🔍 Filters applied: Search="${searchTerm}", District="${selectedDistrict}", Spec="${selectedSpecialization}"`);
        console.log(`📊 Results: ${results.length} of ${allResults.length}`);

        return results;
    }, [allResults, searchTerm, selectedDistrict, selectedSpecialization, searchType, initialLoadComplete]);

    // Handle tab change
=======
    useEffect(() => {
        fetchInitialData('doctor');
    }, [fetchInitialData]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResults([]);

        const token = localStorage.getItem('token');
        let query = new URLSearchParams();

        if (selectedDistrict) query.append('district', selectedDistrict);

        let urlBase = '';
        if (searchType === 'doctor') {
            if (selectedSpecialization) query.append('specialization', selectedSpecialization);
            if (searchTerm) query.append('fullName', searchTerm);
            urlBase = '/api/v1/search/doctors';
        } else {
            if (selectedSpecialization) query.append('specialty', selectedSpecialization);
            if (searchTerm) query.append('name', searchTerm);
            urlBase = '/api/v1/search/hospitals';
        }
        const url = `${urlBase}?${query.toString()}`;

        try {
            const response = await fetch(url, {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data);
                if (data.length === 0) {
                    showToast('No results found for your search criteria.', 'info');
                }
            } else if (response.status === 401 || response.status === 403) {
                 showToast('Session expired. Please log in again.', 'error');
            } else {
                 showToast(`Search failed: Server error ${response.status}`, 'error');
            }
        } catch (error) {
            showToast('Search failed. Could not connect to the server.', 'error');
        } finally {
            setLoading(false);
        }
    };

>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
    const handleTabChange = (type) => {
        setSearchType(type);
        setSearchTerm('');
        setSelectedDistrict('');
        setSelectedSpecialization('');
<<<<<<< HEAD
        setInitialLoadComplete(false);
        setCurrentPage(1);
        setSelectedItem(null);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setSearchTerm('');
        setSelectedDistrict('');
        setSelectedSpecialization('');
        setCurrentPage(1);
    };

    // Check if any filters are active
    const hasActiveFilters = searchTerm || selectedDistrict || selectedSpecialization;

    // Pagination logic
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentResults = filteredResults.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedDistrict, selectedSpecialization]);

    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Result Card Component - Memoized to prevent re-renders
    const ResultCard = React.memo(({ item, type }) => {
        const handleCardClick = useCallback(() => {
            setSelectedItem(item);
        }, [item]);

        return (
            <div className="result-card" onClick={handleCardClick}>
                <div className="result-card-header">
                    <div className="result-avatar">
                        {type === 'doctor' ? <Stethoscope size={32} /> : <Building size={32} />}
                    </div>
                    <div className="result-title">
                        <h3>{type === 'doctor' ? item.fullName : (item.hospitalName || 'Hospital')}</h3>
                        <p className="result-specialty">
                            {type === 'doctor' ? item.specialization : (item.hospitalType || 'Healthcare Facility')}
                        </p>
                    </div>
                </div>

                <div className="result-details">
                    {type === 'doctor' ? (
                        <>
                            <div className="detail-row">
                                <Building size={18} />
                                <span>{item.hospitalName || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                                <MapPin size={18} />
                                <span>{item.district || 'N/A'}</span>
                            </div>
                            {item.rating && (
                                <div className="detail-row rating">
                                    <Star size={18} fill="currentColor" />
                                    <span>{item.rating} ({item.totalReviews || 0} reviews)</span>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="detail-row">
                                <MapPin size={18} />
                                <span>{item.location || 'N/A'}, {item.district || 'N/A'}</span>
                            </div>
                            {(item.phone || item.altPhone) && (
                                <div className="detail-row">
                                    <Phone size={18} />
                                    <span>{item.phone || item.altPhone}</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <button className="view-details-btn">View Details</button>
            </div>
        );
    });

    // Handle sending inquiry email - Memoized to prevent re-renders
    const handleSendInquiry = useCallback(async (e) => {
        e.preventDefault();
        
        if (!selectedItem) return;
        
        // Validation
        if (!emailFormData.patientName || !emailFormData.patientEmail || !emailFormData.patientPhone || !emailFormData.message) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        setSendingEmail(true);

        try {
            const recipientEmail = searchType === 'hospital' ? selectedItem.contact : selectedItem.hospitalName + '@hospital.com';
            const recipientName = searchType === 'hospital' ? selectedItem.hospitalName : selectedItem.fullName;

            const response = await fetch('/api/v1/email/send-inquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipientEmail: recipientEmail,
                    recipientName: recipientName,
                    patientName: emailFormData.patientName,
                    patientEmail: emailFormData.patientEmail,
                    patientPhone: emailFormData.patientPhone,
                    message: emailFormData.message,
                    recipientType: searchType
                })
            });

            const data = await response.json();

            if (data.success) {
                showToast('Inquiry sent successfully! You will receive a confirmation email.', 'success');
                setShowEmailModal(false);
                setEmailFormData({
                    patientName: user?.fullName || '',
                    patientEmail: user?.email || '',
                    patientPhone: '',
                    message: ''
                });
            } else {
                showToast(data.message || 'Failed to send inquiry', 'error');
            }
        } catch (error) {
            console.error('Error sending inquiry:', error);
            showToast('Failed to send inquiry. Please try again.', 'error');
        } finally {
            setSendingEmail(false);
        }
    }, [selectedItem, emailFormData, searchType, showToast, user]);

    // Optimized input handlers to prevent re-renders
    const handlePatientNameChange = useCallback((e) => {
        setEmailFormData(prev => ({ ...prev, patientName: e.target.value }));
    }, []);

    const handlePatientEmailChange = useCallback((e) => {
        setEmailFormData(prev => ({ ...prev, patientEmail: e.target.value }));
    }, []);

    const handlePatientPhoneChange = useCallback((e) => {
        setEmailFormData(prev => ({ ...prev, patientPhone: e.target.value }));
    }, []);

    const handleMessageChange = useCallback((e) => {
        setEmailFormData(prev => ({ ...prev, message: e.target.value }));
    }, []);

    const handleCloseEmailModal = useCallback(() => {
        setShowEmailModal(false);
    }, []);

    // Email Modal Component - Memoized to prevent unnecessary re-renders
    const EmailModal = useMemo(() => {
        if (!showEmailModal || !selectedItem) return null;

        const recipientName = searchType === 'hospital' ? selectedItem.hospitalName : selectedItem.fullName;

        return (
            <div className="modal-overlay" onClick={handleCloseEmailModal}>
                <div className="modal-content email-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={handleCloseEmailModal}>
                        <X size={24} />
                    </button>

                    <div className="modal-header">
                        <div className="modal-icon">
                            <Mail size={48} />
                        </div>
                        <div>
                            <h2>Send Inquiry</h2>
                            <p className="modal-subtitle">
                                To: {recipientName}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSendInquiry} className="email-form">
                        <div className="form-group">
                            <label>Your Name *</label>
                            <input
                                type="text"
                                value={emailFormData.patientName}
                                onChange={handlePatientNameChange}
                                placeholder="Enter your full name"
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label>Your Email *</label>
                            <input
                                type="email"
                                value={emailFormData.patientEmail}
                                onChange={handlePatientEmailChange}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Your Phone *</label>
                            <input
                                type="tel"
                                value={emailFormData.patientPhone}
                                onChange={handlePatientPhoneChange}
                                placeholder="Enter your phone number"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Message *</label>
                            <textarea
                                value={emailFormData.message}
                                onChange={handleMessageChange}
                                placeholder="Describe your inquiry or health concern..."
                                rows="5"
                                required
                            />
                        </div>

                        <div className="email-form-actions">
                            <button 
                                type="button" 
                                className="btn-secondary" 
                                onClick={handleCloseEmailModal}
                                disabled={sendingEmail}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn-primary"
                                disabled={sendingEmail}
                            >
                                {sendingEmail ? 'Sending...' : 'Send Inquiry'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }, [showEmailModal, selectedItem, searchType, emailFormData, sendingEmail, handleSendInquiry, handleCloseEmailModal, handlePatientNameChange, handlePatientEmailChange, handlePatientPhoneChange, handleMessageChange]);

    // Detailed Modal Component
    const DetailModal = ({ item, type, onClose }) => {
        if (!item) return null;

        const handleEmailClick = (email) => {
            setShowEmailModal(true);
        };

        const handlePhoneClick = (phone) => {
            window.location.href = `tel:${phone}`;
        };

        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>

                    <div className="modal-header">
                        <div className="modal-icon">
                            {type === 'doctor' ? <Stethoscope size={48} /> : <Building size={48} />}
                        </div>
                        <div>
                            <h2>{type === 'doctor' ? item.fullName : item.hospitalName}</h2>
                            <p className="modal-subtitle">
                                {type === 'doctor' ? item.specialization : item.hospitalType}
                            </p>
                        </div>
                    </div>

                    <div className="modal-body">
                        {type === 'doctor' ? (
                            <>
                                <div className="modal-section">
                                    <h3>Professional Information</h3>
                                    <div className="modal-detail-grid">
                                        <div className="modal-detail-item">
                                            <Stethoscope size={20} />
                                            <div>
                                                <span className="modal-label">Specialization</span>
                                                <span className="modal-value">{item.specialization || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="modal-detail-item">
                                            <Building size={20} />
                                            <div>
                                                <span className="modal-label">Hospital</span>
                                                <span className="modal-value">{item.hospitalName || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="modal-detail-item">
                                            <MapPin size={20} />
                                            <div>
                                                <span className="modal-label">Location</span>
                                                <span className="modal-value">{item.district || 'N/A'}</span>
                                            </div>
                                        </div>
                                        {item.rating && (
                                            <div className="modal-detail-item">
                                                <Star size={20} />
                                                <div>
                                                    <span className="modal-label">Rating</span>
                                                    <span className="modal-value">{item.rating} ⭐ ({item.totalReviews || 0} reviews)</span>
                                                </div>
                                            </div>
                                        )}
                                        {item.consultationFee && (
                                            <div className="modal-detail-item">
                                                <Info size={20} />
                                                <div>
                                                    <span className="modal-label">Consultation Fee</span>
                                                    <span className="modal-value">₹{item.consultationFee}</span>
                                                </div>
                                            </div>
                                        )}
                                        {item.isAvailable !== undefined && (
                                            <div className="modal-detail-item">
                                                <Info size={20} />
                                                <div>
                                                    <span className="modal-label">Availability</span>
                                                    <span className={`modal-value ${item.isAvailable ? 'available' : 'unavailable'}`}>
                                                        {item.isAvailable ? 'Available' : 'Not Available'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="modal-section">
                                    <h3>Hospital Information</h3>
                                    <div className="modal-detail-grid">
                                        <div className="modal-detail-item">
                                            <Building size={20} />
                                            <div>
                                                <span className="modal-label">Type</span>
                                                <span className="modal-value">{item.hospitalType || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="modal-detail-item">
                                            <MapPin size={20} />
                                            <div>
                                                <span className="modal-label">Address</span>
                                                <span className="modal-value">{item.location || 'N/A'}, {item.district || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-section">
                                    <h3>Contact Information</h3>
                                    <div className="modal-detail-grid">
                                        {item.phone && (
                                            <div className="modal-detail-item clickable" onClick={() => handlePhoneClick(item.phone)}>
                                                <Phone size={20} />
                                                <div>
                                                    <span className="modal-label">Primary Phone</span>
                                                    <span className="modal-value link">{item.phone} <ExternalLink size={14} /></span>
                                                </div>
                                            </div>
                                        )}
                                        {item.altPhone && item.altPhone !== 'N/A' && (
                                            <div className="modal-detail-item clickable" onClick={() => handlePhoneClick(item.altPhone)}>
                                                <Phone size={20} />
                                                <div>
                                                    <span className="modal-label">Alternate Phone</span>
                                                    <span className="modal-value link">{item.altPhone} <ExternalLink size={14} /></span>
                                                </div>
                                            </div>
                                        )}
                                        {item.contact && item.contact !== 'N/A' && (
                                            <div className="modal-detail-item clickable" onClick={() => handleEmailClick(item.contact)}>
                                                <Mail size={20} />
                                                <div>
                                                    <span className="modal-label">Email</span>
                                                    <span className="modal-value link">{item.contact} <ExternalLink size={14} /></span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {item.specialties && item.specialties.length > 0 && (
                                    <div className="modal-section">
                                        <h3>Specialties & Services</h3>
                                        <div className="specialties-tags">
                                            {(Array.isArray(item.specialties) ? item.specialties : [item.specialties]).map((spec, idx) => (
                                                <span key={idx} className="specialty-tag">{spec}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {item.description && (
                                    <div className="modal-section">
                                        <h3>Description</h3>
                                        <p className="modal-description">{item.description}</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Send Inquiry Button */}
                        <div className="modal-actions">
                            <button 
                                className="send-inquiry-btn"
                                onClick={() => {
                                    setShowEmailModal(true);
                                }}
                            >
                                <Mail size={20} />
                                Send Inquiry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="doctor-search-container">
            <div className="search-page-header">
                {onBack && (
                    <button className="back-button" onClick={onBack}>
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </button>
                )}
                <h1>Find Healthcare Providers</h1>
                <p>Search for doctors and hospitals in your area</p>
            </div>

            <div className="search-tabs-container">
                <button
                    className={`search-tab ${searchType === 'doctor' ? 'active' : ''}`}
                    onClick={() => handleTabChange('doctor')}
                >
                    <Stethoscope size={20} />
                    Doctors
                </button>
                <button
                    className={`search-tab ${searchType === 'hospital' ? 'active' : ''}`}
                    onClick={() => handleTabChange('hospital')}
                >
                    <Building size={20} />
=======
        fetchInitialData(type);
    };

    const ResultCard = ({ item, type }) => (
        <div className="doctor-card">
            <div className="doctor-avatar">
                <div className="avatar-placeholder">
                    {type === 'doctor' ? <Stethoscope size={40} /> : <Building size={40} />}
                </div>
            </div>
            {type === 'doctor' ? (
                <div className="doctor-info">
                    <h3>{item.fullName || 'N/A'}</h3>
                    <p className="specialization">{item.specialization || 'N/A'}</p>
                    <div className="doctor-location"><MapPin size={16} /> <span>{item.hospitalName || 'N/A'}, {item.district || 'N/A'}</span></div>
                    {item.rating != null && <div className="doctor-rating"><Star size={16} fill="currentColor" /> <span>{item.rating} ({item.totalReviews || 0} reviews)</span></div>}
                    {item.consultationFee && <p className="consultation-fee">{item.consultationFee}</p>}
                </div>
            ) : (
                 <div className="doctor-info">
                    <h3>{item.name || 'N/A'}</h3>
                    <p className="hospital-type"><Info size={16} /> Type: {item.c || 'N/A'}</p>
                    <p className="specialization">
                      Specialties: {
                        Array.isArray(item.specialties)
                          ? item.specialties.join(', ')
                          : (item.specialties || 'N/A')
                      }
                    </p>
                    <div className="doctor-location"><MapPin size={16} /> <span>{item.address || 'N/A'}, {item.district || 'N/A'}</span></div>
                    {(item.phone1 || item.phone2) && <p className="phone">Phone: {item.phone1}{item.phone2 && item.phone2 !== 'N/A' ? ` / ${item.phone2}` : ''}</p>}
                    {item.email && item.email !== 'N/A' && <p className="email">Email: {item.email}</p>}
                </div>
            )}
        </div>
    );

    return (
         <div className="doctor-search">
            <div className="search-header">
                <h1>Find Doctors & Hospitals</h1>
            </div>

            <div className="search-tabs">
                 <button
                    className={`tab-btn ${searchType === 'doctor' ? 'active' : ''}`}
                    onClick={() => handleTabChange('doctor')}
                >
                    Doctors
                </button>
                <button
                    className={`tab-btn ${searchType === 'hospital' ? 'active' : ''}`}
                    onClick={() => handleTabChange('hospital')}
                >
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
                    Hospitals
                </button>
            </div>

<<<<<<< HEAD
            <div className="search-filters-container">
                <div className="search-input-wrapper">
                    <Search size={20} />
=======
            <form className="search-filters" onSubmit={handleSearch}>
                <div className="search-box">
                    <Search />
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
                    <input
                        type="text"
                        placeholder={searchType === 'doctor' ? "Search by doctor name..." : "Search by hospital name..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
<<<<<<< HEAD
                        className="search-input"
                    />
                    {searchTerm && (
                        <button 
                            className="clear-input-btn"
                            onClick={() => setSearchTerm('')}
                            title="Clear search"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="search-select"
=======
                    />
                </div>
                <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="filter-select"
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
                >
                    <option value="">All Districts</option>
                    {districts.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
<<<<<<< HEAD

                <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="search-select"
=======
                <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="filter-select"
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
                >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                    ))}
                </select>
<<<<<<< HEAD

                {hasActiveFilters && (
                    <button 
                        className="clear-filters-btn"
                        onClick={clearAllFilters}
                        title="Clear all filters"
                    >
                        <X size={18} />
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Results Summary */}
            <div className="results-summary">
                <div className="results-info">
                    <Filter size={18} />
                    <span>
                        Showing <strong>{startIndex + 1}-{Math.min(endIndex, filteredResults.length)}</strong> of <strong>{filteredResults.length}</strong> {searchType}s
                    </span>
                </div>
                {hasActiveFilters && (
                    <div className="active-filters">
                        {searchTerm && (
                            <span className="filter-tag">
                                Search: "{searchTerm}"
                                <button onClick={() => setSearchTerm('')}><X size={14} /></button>
                            </span>
                        )}
                        {selectedDistrict && (
                            <span className="filter-tag">
                                District: {selectedDistrict}
                                <button onClick={() => setSelectedDistrict('')}><X size={14} /></button>
                            </span>
                        )}
                        {selectedSpecialization && (
                            <span className="filter-tag">
                                Specialization: {selectedSpecialization}
                                <button onClick={() => setSelectedSpecialization('')}><X size={14} /></button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="results-container">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading {searchType}s...</p>
                    </div>
                ) : filteredResults.length > 0 ? (
                    <>
                        <div className="results-grid">
                            {currentResults.map((item, index) => (
                                <ResultCard 
                                    key={item.id || `${searchType}-${index}`} 
                                    item={item} 
                                    type={searchType} 
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <button 
                                    className="pagination-btn"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={20} />
                                    Previous
                                </button>

                                <div className="pagination-numbers">
                                    {[...Array(totalPages)].map((_, idx) => {
                                        const pageNum = idx + 1;
                                        // Show first page, last page, current page, and pages around current
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                                                    onClick={() => goToPage(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                            return <span key={pageNum} className="pagination-ellipsis">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <button 
                                    className="pagination-btn"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                ) : initialLoadComplete ? (
                    <div className="empty-state">
                        {searchType === 'doctor' ? <Stethoscope size={64} /> : <Building size={64} />}
                        <h3>No {searchType}s found</h3>
                        {hasActiveFilters ? (
                            <>
                                <p>No results match your current filters</p>
                                <button className="search-button" onClick={clearAllFilters}>
                                    Clear All Filters
                                </button>
                            </>
                        ) : (
                            <p>No {searchType}s available in the database</p>
                        )}
                    </div>
                ) : null}
            </div>

            {/* Detail Modal */}
            {selectedItem && (
                <DetailModal 
                    item={selectedItem} 
                    type={searchType} 
                    onClose={() => setSelectedItem(null)} 
                />
            )}

            {/* Email Modal */}
            {EmailModal}
=======
                <button type="submit" className="btn btn-primary search-submit-btn" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            <div className="doctors-grid">
                {loading ? (
                    <div className="loading">Loading results...</div>
                ) : results.length > 0 ? (
                    results.map((item, index) => (
                        <ResultCard key={item.id || `${searchType}-${index}-${item.name || item.fullName || item.district}`} item={item} type={searchType} />
                    ))
                ) : (
                    <p>No {searchType === 'doctor' ? 'doctors' : 'hospitals'} found matching your criteria.</p>
                )}
            </div>
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
        </div>
    );
};

<<<<<<< HEAD
export default DoctorSearch;
=======
export default DoctorSearch;
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
