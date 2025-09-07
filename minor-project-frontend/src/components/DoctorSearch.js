import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Calendar, Send, ArrowLeft } from 'lucide-react';
import './DoctorSearch.css';

const DoctorSearch = ({ onBack, user }) => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showSendRecordsModal, setShowSendRecordsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'];
  const specializations = ['Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist', 'Orthopedic', 'Gynecologist', 'ENT', 'General Medicine'];

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [doctors, searchTerm, selectedCity, selectedSpecialization]);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('/api/v1/doctors');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      // Set sample data if API fails
      setSampleDoctors();
    } finally {
      setLoading(false);
    }
  };

  const setSampleDoctors = () => {
    const sampleDoctors = [
      {
        id: '1',
        fullName: 'Dr. Sarah Johnson',
        specialization: 'Cardiologist',
        qualification: 'MD, DM Cardiology',
        experience: '10+ years',
        city: 'Mumbai',
        hospitalName: 'Apollo Hospital',
        rating: 4.8,
        totalReviews: 156,
        consultationFee: '₹800',
        bio: 'Experienced cardiologist specializing in interventional cardiology and heart disease prevention.',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
        isAvailable: true
      },
      {
        id: '2',
        fullName: 'Dr. Raj Patel',
        specialization: 'Neurologist',
        qualification: 'MD, DM Neurology',
        experience: '8+ years',
        city: 'Delhi',
        hospitalName: 'AIIMS Delhi',
        rating: 4.7,
        totalReviews: 89,
        consultationFee: '₹1000',
        bio: 'Neurologist with expertise in stroke management and neurodegenerative diseases.',
        availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
        isAvailable: true
      },
      {
        id: '3',
        fullName: 'Dr. Priya Sharma',
        specialization: 'Pediatrician',
        qualification: 'MD Pediatrics',
        experience: '12+ years',
        city: 'Bangalore',
        hospitalName: 'Manipal Hospital',
        rating: 4.9,
        totalReviews: 203,
        consultationFee: '₹600',
        bio: 'Pediatrician dedicated to child health and development with special interest in neonatology.',
        availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        isAvailable: true
      }
    ];
    setDoctors(sampleDoctors);
  };

  const filterDoctors = () => {
    let filtered = doctors;

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(doctor => doctor.city === selectedCity);
    }

    if (selectedSpecialization) {
      filtered = filtered.filter(doctor => doctor.specialization === selectedSpecialization);
    }

    setFilteredDoctors(filtered);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleBookAppointment = () => {
    setShowAppointmentModal(true);
  };

  const handleSendRecords = () => {
    setShowSendRecordsModal(true);
  };

  if (loading) {
    return (
      <div className="doctor-search">
        <div className="loading">Loading doctors...</div>
      </div>
    );
  }

  return (
    <div className="doctor-search">
      <div className="search-header">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft /> Back
        </button>
        <h1>Find Doctors</h1>
      </div>

      <div className="search-filters">
        <div className="search-box">
          <Search />
          <input
            type="text"
            placeholder="Search doctors or specializations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="filter-select"
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <select
          value={selectedSpecialization}
          onChange={(e) => setSelectedSpecialization(e.target.value)}
          className="filter-select"
        >
          <option value="">All Specializations</option>
          {specializations.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
      </div>

      <div className="doctors-container">
        <div className="doctors-list">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map(doctor => (
              <div
                key={doctor.id}
                className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                onClick={() => handleDoctorSelect(doctor)}
              >
                <div className="doctor-avatar">
                  <div className="avatar-placeholder">
                    {doctor.fullName.charAt(0)}
                  </div>
                </div>
                <div className="doctor-info">
                  <h3>{doctor.fullName}</h3>
                  <p className="specialization">{doctor.specialization}</p>
                  <p className="qualification">{doctor.qualification}</p>
                  <div className="doctor-meta">
                    <div className="location">
                      <MapPin size={16} />
                      <span>{doctor.city}</span>
                    </div>
                    <div className="rating">
                      <Star size={16} />
                      <span>{doctor.rating} ({doctor.totalReviews} reviews)</span>
                    </div>
                  </div>
                  <p className="experience">{doctor.experience} experience</p>
                  <p className="fee">Consultation: {doctor.consultationFee}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="no-doctors">
              <h3>No doctors found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </div>

        {selectedDoctor && (
          <div className="doctor-details">
            <div className="doctor-profile">
              <div className="profile-header">
                <div className="doctor-avatar large">
                  <div className="avatar-placeholder">
                    {selectedDoctor.fullName.charAt(0)}
                  </div>
                </div>
                <div className="profile-info">
                  <h2>{selectedDoctor.fullName}</h2>
                  <p className="specialization">{selectedDoctor.specialization}</p>
                  <p className="qualification">{selectedDoctor.qualification}</p>
                  <div className="rating">
                    <Star size={20} />
                    <span>{selectedDoctor.rating} ({selectedDoctor.totalReviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-section">
                  <h4>About</h4>
                  <p>{selectedDoctor.bio}</p>
                </div>

                <div className="detail-section">
                  <h4>Hospital</h4>
                  <p>{selectedDoctor.hospitalName}, {selectedDoctor.city}</p>
                </div>

                <div className="detail-section">
                  <h4>Experience</h4>
                  <p>{selectedDoctor.experience}</p>
                </div>

                <div className="detail-section">
                  <h4>Available Days</h4>
                  <div className="available-days">
                    {selectedDoctor.availableDays?.map(day => (
                      <span key={day} className="day-tag">{day}</span>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Consultation Fee</h4>
                  <p className="fee">{selectedDoctor.consultationFee}</p>
                </div>
              </div>

              <div className="action-buttons">
                <button onClick={handleBookAppointment} className="btn-primary">
                  <Calendar /> Book Appointment
                </button>
                <button onClick={handleSendRecords} className="btn-outline">
                  <Send /> Send Records
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAppointmentModal && (
        <AppointmentModal
          doctor={selectedDoctor}
          user={user}
          onClose={() => setShowAppointmentModal(false)}
        />
      )}

      {showSendRecordsModal && (
        <SendRecordsModal
          doctor={selectedDoctor}
          user={user}
          onClose={() => setShowSendRecordsModal(false)}
        />
      )}
    </div>
  );
};

const AppointmentModal = ({ doctor, user, onClose }) => {
  const [appointmentData, setAppointmentData] = useState({
    appointmentDateTime: '',
    appointmentType: 'CONSULTATION',
    symptoms: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...appointmentData,
          doctorId: doctor.id,
          doctorName: doctor.fullName,
          hospitalName: doctor.hospitalName,
          patientName: user.fullName,
          patientEmail: user.email,
          consultationFee: doctor.consultationFee
        })
      });

      if (response.ok) {
        alert('Appointment booked successfully!');
        onClose();
      } else {
        alert('Failed to book appointment');
      }
    } catch (error) {
      alert('Error booking appointment');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Book Appointment with {doctor.fullName}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Appointment Date & Time</label>
            <input
              type="datetime-local"
              value={appointmentData.appointmentDateTime}
              onChange={(e) => setAppointmentData({...appointmentData, appointmentDateTime: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Appointment Type</label>
            <select
              value={appointmentData.appointmentType}
              onChange={(e) => setAppointmentData({...appointmentData, appointmentType: e.target.value})}
            >
              <option value="CONSULTATION">Consultation</option>
              <option value="FOLLOW_UP">Follow-up</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
          </div>
          <div className="form-group">
            <label>Symptoms</label>
            <textarea
              value={appointmentData.symptoms}
              onChange={(e) => setAppointmentData({...appointmentData, symptoms: e.target.value})}
              placeholder="Describe your symptoms..."
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Additional Notes</label>
            <textarea
              value={appointmentData.notes}
              onChange={(e) => setAppointmentData({...appointmentData, notes: e.target.value})}
              placeholder="Any additional information..."
              rows="2"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary">Book Appointment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SendRecordsModal = ({ doctor, user, onClose }) => {
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [message, setMessage] = useState('');
  const [userFiles, setUserFiles] = useState([]);

  useEffect(() => {
    fetchUserFiles();
  }, []);

  const fetchUserFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/nodes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const files = await response.json();
        setUserFiles(files.filter(file => file.type === 'FILE'));
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientEmail: doctor.email,
          nodeIds: selectedRecords,
          accessDuration: 30, // 30 days
          message: `Medical records from ${user.fullName}. ${message}`
        })
      });

      if (response.ok) {
        alert('Records sent successfully!');
        onClose();
      } else {
        alert('Failed to send records');
      }
    } catch (error) {
      alert('Error sending records');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Send Records to {doctor.fullName}</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Select Records to Send</label>
            <div className="records-list">
              {userFiles.map(file => (
                <label key={file.id} className="record-item">
                  <input
                    type="checkbox"
                    checked={selectedRecords.includes(file.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRecords([...selectedRecords, file.id]);
                      } else {
                        setSelectedRecords(selectedRecords.filter(id => id !== file.id));
                      }
                    }}
                  />
                  <span>{file.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Message to Doctor</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message for the doctor..."
              rows="3"
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button type="submit" className="btn-primary" disabled={selectedRecords.length === 0}>
              Send Records
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorSearch;
