import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, MapPin, Phone, Building2, Mail, ArrowLeft, X, Filter, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import './HospitalDirectory.css';
import { useToast } from './ToastContext';

const HospitalDirectory = ({ onBack }) => {
  // State Management
  const [allHospitals, setAllHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailFormData, setEmailFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    message: ''
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const { showToast } = useToast();

  const districts = [
    "Mysuru", "Bengaluru", "Udupi", "Raichur", "Davangere", "Hubli", "Shivamogga"
  ];

  // Fetch all hospitals once on component mount
  const fetchAllHospitals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/search/hospitals');

      if (response.ok) {
        const data = await response.json();
        setAllHospitals(data);
        setInitialLoadComplete(true);
        console.log(`✅ Loaded ${data.length} hospitals from API`);
      } else {
        showToast('Failed to fetch hospitals', 'error');
        setAllHospitals([]);
      }
    } catch (error) {
      console.error('Network error:', error);
      showToast('Could not connect to server. Please ensure backend is running on port 8080.', 'error');
      setAllHospitals([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAllHospitals();
  }, [fetchAllHospitals]);

  // Client-side filtering with memoization
  const filteredHospitals = useMemo(() => {
    if (!initialLoadComplete) return [];

    let results = [...allHospitals];

    // Apply search term filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      results = results.filter(hospital => 
        (hospital.hospitalName || '').toLowerCase().includes(searchLower)
      );
    }

    // Apply district filter
    if (districtFilter) {
      results = results.filter(hospital => 
        (hospital.district || '').toLowerCase() === districtFilter.toLowerCase()
      );
    }

    console.log(`🔍 Filters applied: Search="${searchTerm}", District="${districtFilter}"`);
    console.log(`📊 Results: ${results.length} of ${allHospitals.length}`);

    return results;
  }, [allHospitals, searchTerm, districtFilter, initialLoadComplete]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setDistrictFilter('');
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || districtFilter;

  // Pagination logic
  const totalPages = Math.ceil(filteredHospitals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHospitals = filteredHospitals.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, districtFilter]);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const HospitalCard = React.memo(({ hospital }) => {
    const handleCardClick = useCallback(() => {
      setSelectedHospital(hospital);
    }, [hospital]);

    return (
      <div className="hospital-card-modern" onClick={handleCardClick}>
        <div className="hospital-card-header">
          <div className="hospital-icon-wrapper">
            <Building2 size={32} />
          </div>
          <div className="hospital-title">
            <h3>{hospital.hospitalName || 'Hospital'}</h3>
            <p className="hospital-type">{hospital.hospitalType || 'Healthcare Facility'}</p>
          </div>
        </div>

        <div className="hospital-details-grid">
          <div className="hospital-detail-item">
            <MapPin size={18} />
            <div>
              <span className="detail-label">Location</span>
              <span className="detail-value">{hospital.location || 'N/A'}, {hospital.district || 'N/A'}</span>
            </div>
          </div>

          {(hospital.phone || hospital.altPhone) && (
            <div className="hospital-detail-item">
              <Phone size={18} />
              <div>
                <span className="detail-label">Phone</span>
                <span className="detail-value">{hospital.phone || hospital.altPhone}</span>
              </div>
            </div>
          )}
        </div>
        <button className="view-details-btn">View Details</button>
      </div>
    );
  });

  // Handle sending inquiry email - Memoized to prevent re-renders
  const handleSendInquiry = useCallback(async (e) => {
    e.preventDefault();
    
    if (!selectedHospital) return;
    
    // Validation
    if (!emailFormData.patientName || !emailFormData.patientEmail || !emailFormData.patientPhone || !emailFormData.message) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setSendingEmail(true);

    try {
      const response = await fetch('/api/v1/email/send-inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: selectedHospital.contact || 'hospital@example.com',
          recipientName: selectedHospital.hospitalName,
          patientName: emailFormData.patientName,
          patientEmail: emailFormData.patientEmail,
          patientPhone: emailFormData.patientPhone,
          message: emailFormData.message,
          recipientType: 'hospital'
        })
      });

      const data = await response.json();

      if (data.success) {
        showToast('Inquiry sent successfully! You will receive a confirmation email.', 'success');
        setShowEmailModal(false);
        setEmailFormData({
          patientName: '',
          patientEmail: '',
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
  }, [selectedHospital, emailFormData, showToast]);

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
    if (!showEmailModal || !selectedHospital) return null;

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
              <p className="modal-subtitle">To: {selectedHospital.hospitalName}</p>
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
  }, [showEmailModal, selectedHospital, emailFormData, sendingEmail, handleSendInquiry, handleCloseEmailModal, handlePatientNameChange, handlePatientEmailChange, handlePatientPhoneChange, handleMessageChange]);

  // Detailed Modal Component
  const HospitalDetailModal = ({ hospital, onClose }) => {
    if (!hospital) return null;

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
              <Building2 size={48} />
            </div>
            <div>
              <h2>{hospital.hospitalName}</h2>
              <p className="modal-subtitle">{hospital.hospitalType}</p>
            </div>
          </div>

          <div className="modal-body">
            <div className="modal-section">
              <h3>Hospital Information</h3>
              <div className="modal-detail-grid">
                <div className="modal-detail-item">
                  <Building2 size={20} />
                  <div>
                    <span className="modal-label">Type</span>
                    <span className="modal-value">{hospital.hospitalType || 'N/A'}</span>
                  </div>
                </div>
                <div className="modal-detail-item">
                  <MapPin size={20} />
                  <div>
                    <span className="modal-label">Address</span>
                    <span className="modal-value">{hospital.location || 'N/A'}, {hospital.district || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-section">
              <h3>Contact Information</h3>
              <div className="modal-detail-grid">
                {hospital.phone && (
                  <div className="modal-detail-item clickable" onClick={() => handlePhoneClick(hospital.phone)}>
                    <Phone size={20} />
                    <div>
                      <span className="modal-label">Primary Phone</span>
                      <span className="modal-value link">{hospital.phone} <ExternalLink size={14} /></span>
                    </div>
                  </div>
                )}
                {hospital.altPhone && hospital.altPhone !== 'N/A' && (
                  <div className="modal-detail-item clickable" onClick={() => handlePhoneClick(hospital.altPhone)}>
                    <Phone size={20} />
                    <div>
                      <span className="modal-label">Alternate Phone</span>
                      <span className="modal-value link">{hospital.altPhone} <ExternalLink size={14} /></span>
                    </div>
                  </div>
                )}
                {hospital.contact && hospital.contact !== 'N/A' && (
                  <div className="modal-detail-item clickable" onClick={() => handleEmailClick(hospital.contact)}>
                    <Mail size={20} />
                    <div>
                      <span className="modal-label">Email</span>
                      <span className="modal-value link">{hospital.contact} <ExternalLink size={14} /></span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {hospital.specialties && hospital.specialties.length > 0 && (
              <div className="modal-section">
                <h3>Specialties & Services</h3>
                <div className="specialties-tags">
                  {(Array.isArray(hospital.specialties) ? hospital.specialties : [hospital.specialties]).map((spec, idx) => (
                    <span key={idx} className="specialty-tag">{spec}</span>
                  ))}
                </div>
              </div>
            )}

            {hospital.description && (
              <div className="modal-section">
                <h3>Description</h3>
                <p className="modal-description">{hospital.description}</p>
              </div>
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
    <div className="hospital-directory-container">
      <div className="directory-page-header">
        {onBack && (
          <button className="back-button" onClick={onBack}>
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        )}
        <h1>Hospital Directory</h1>
        <p>Find hospitals and healthcare facilities in your area</p>
      </div>

      <div className="directory-filters-container">
        <div className="search-input-wrapper">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by hospital name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="search-select"
        >
          <option value="">All Districts</option>
          {districts.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

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
            Showing <strong>{startIndex + 1}-{Math.min(endIndex, filteredHospitals.length)}</strong> of <strong>{filteredHospitals.length}</strong> hospitals
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
            {districtFilter && (
              <span className="filter-tag">
                District: {districtFilter}
                <button onClick={() => setDistrictFilter('')}><X size={14} /></button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="hospitals-results">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading hospitals...</p>
          </div>
        ) : filteredHospitals.length > 0 ? (
          <>
            <div className="hospitals-grid-modern">
              {currentHospitals.map((hospital, index) => (
                <HospitalCard key={hospital.id || `hospital-${index}`} hospital={hospital} />
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
            <Building2 size={64} />
            <h3>No hospitals found</h3>
            {hasActiveFilters ? (
              <>
                <p>No results match your current filters</p>
                <button className="search-button" onClick={clearAllFilters}>
                  Clear All Filters
                </button>
              </>
            ) : (
              <p>No hospitals available in the database</p>
            )}
          </div>
        ) : null}
      </div>

      {/* Detail Modal */}
      {selectedHospital && (
        <HospitalDetailModal 
          hospital={selectedHospital} 
          onClose={() => setSelectedHospital(null)} 
        />
      )}

      {/* Email Modal */}
      {EmailModal}
    </div>
  );
};

export default HospitalDirectory;
