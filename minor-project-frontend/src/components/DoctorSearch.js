import React, { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Star, Calendar, Send, ArrowLeft } from 'lucide-react';
import './DoctorSearch.css';
import { useToast } from './ToastContext';

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
  const { showToast } = useToast();

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad','Karnataka','Kerala'];
  const specializations = ['Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist', 'Orthopedic', 'Gynecologist', 'ENT', 'General Medicine'];

<<<<<<< HEAD
  const setSampleDoctors = useCallback(() => {
    const sampleDoctors = [
      {
        id: '1',
        fullName: 'Dr. Sarah Johnson',
        specialization: 'Cardiologist',
        qualification: 'MBBS, MD Cardiology',
        experience: '15 years',
        city: 'Mumbai',
        rating: 4.8,
        consultationFee: '₹800',
        hospital: 'Apollo Hospital',
        availableSlots: ['10:00 AM', '2:00 PM', '4:00 PM']
      },
      {
        id: '2',
        fullName: 'Dr. Rajesh Kumar',
        specialization: 'Neurologist',
        qualification: 'MBBS, DM Neurology',
        experience: '12 years',
        city: 'Delhi',
        rating: 4.7,
        consultationFee: '₹1000',
        hospital: 'AIIMS Delhi',
        availableSlots: ['9:00 AM', '11:00 AM', '3:00 PM']
      },
      {
        id: '3',
        fullName: 'Dr. Priya Sharma',
        specialization: 'Pediatrician',
        qualification: 'MBBS, MD Pediatrics',
        experience: '10 years',
        city: 'Bangalore',
        rating: 4.9,
        consultationFee: '₹600',
        hospital: 'Manipal Hospital',
        availableSlots: ['8:00 AM', '12:00 PM', '5:00 PM']
      }
    ];
    setDoctors(sampleDoctors);
  }, []);

=======
>>>>>>> a435646 (chatbot)
  const fetchDoctors = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/doctors');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      showToast('Failed to fetch doctors, loading sample data.', 'warning');
      setSampleDoctors();
    } finally {
      setLoading(false);
    }
<<<<<<< HEAD
  }, [showToast, setSampleDoctors]);

=======
  }, []);

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

>>>>>>> a435646 (chatbot)
  const filterDoctors = useCallback(() => {
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
  }, [doctors, searchTerm, selectedCity, selectedSpecialization]);

  useEffect(() => {
    fetchDoctors();
<<<<<<< HEAD
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctors, searchTerm, selectedCity, selectedSpecialization]);
=======
  }, [fetchDoctors]);

  useEffect(() => {
    filterDoctors();
  }, [filterDoctors]);
>>>>>>> a435646 (chatbot)

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

      <div className="doctors-grid">
        {filteredDoctors.map(doctor => (
          <div
            key={doctor.id}
            className={`doctor-card ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
            onClick={() => handleDoctorSelect(doctor)}
          >
            <div className="doctor-avatar">
              <div className="avatar-placeholder">
                {doctor.fullName.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
            <div className="doctor-info">
              <h3>{doctor.fullName}</h3>
              <p className="specialization">{doctor.specialization}</p>
              <p className="qualification">{doctor.qualification}</p>
              <div className="doctor-location">
                <MapPin size={16} />
                <span>{doctor.hospital}, {doctor.city}</span>
              </div>
              <div className="doctor-rating">
                <Star size={16} fill="currentColor" />
                <span>{doctor.rating}</span>
              </div>
              <p className="consultation-fee">{doctor.consultationFee}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div className="selected-doctor-actions">
          <h3>Selected: {selectedDoctor.fullName}</h3>
          <div className="action-buttons">
            <button onClick={handleBookAppointment} className="btn btn-primary">
              <Calendar size={16} />
              Book Appointment
            </button>
            <button onClick={handleSendRecords} className="btn btn-secondary">
              <Send size={16} />
              Send Records
            </button>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Book Appointment with {selectedDoctor?.fullName}</h3>
            <div className="available-slots">
              <h4>Available Slots:</h4>
              {selectedDoctor?.availableSlots?.map(slot => (
                <button key={slot} className="slot-btn">
                  {slot}
                </button>
              ))}
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowAppointmentModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={() => {
                showToast('Appointment booked successfully!', 'success');
                setShowAppointmentModal(false);
              }} className="btn btn-primary">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Records Modal */}
      {showSendRecordsModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Send Records to {selectedDoctor?.fullName}</h3>
            <p>Select the medical records you want to share:</p>
            <div className="records-list">
              <label>
                <input type="checkbox" />
                Blood Test Results (Jan 2024)
              </label>
              <label>
                <input type="checkbox" />
                X-Ray Report (Dec 2023)
              </label>
              <label>
                <input type="checkbox" />
                Prescription History
              </label>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowSendRecordsModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={() => {
                showToast('Records sent successfully!', 'success');
                setShowSendRecordsModal(false);
              }} className="btn btn-primary">
                Send Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSearch;
