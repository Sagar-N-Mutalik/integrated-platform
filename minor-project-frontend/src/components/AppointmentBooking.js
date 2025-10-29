import React, { useState } from 'react';
import { Calendar, Clock, FileText, X } from 'lucide-react';
import './AppointmentBooking.css';
import { useToast } from './ToastContext';

const AppointmentBooking = ({ doctor, user, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        appointmentDate: '',
        appointmentTime: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.appointmentDate || !formData.appointmentTime || !formData.reason) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        setLoading(true);

        try {
            // Combine date and time
            const appointmentDateTime = `${formData.appointmentDate}T${formData.appointmentTime}:00`;

            // Generate doctor email if not available
            const doctorEmail = doctor.email || 
                               `${doctor.fullName.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '')}@${doctor.hospitalName.toLowerCase().replace(/\s+/g, '').replace(/[^a-z]/g, '')}.com`;

            const appointmentData = {
                patientName: user.fullName,
                patientEmail: user.email,
                patientPhone: user.phone || '',
                doctorId: doctor.id,
                doctorName: doctor.fullName,
                doctorEmail: doctorEmail,
                hospitalName: doctor.hospitalName,
                appointmentDateTime: appointmentDateTime,
                reason: formData.reason,
                status: 'PENDING'
            };

            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/v1/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(appointmentData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showToast('Appointment request sent successfully! The doctor will be notified.', 'success');
                onSuccess && onSuccess();
                onClose();
            } else {
                showToast(data.message || 'Failed to book appointment', 'error');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            showToast('Failed to book appointment. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Get minimum date (today)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Get maximum date (3 months from now)
    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        return maxDate.toISOString().split('T')[0];
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content appointment-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-header">
                    <div className="modal-icon">
                        <Calendar size={48} />
                    </div>
                    <div>
                        <h2>Book Appointment</h2>
                        <p className="modal-subtitle">
                            With Dr. {doctor.fullName}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="appointment-form">
                    <div className="form-group">
                        <label>
                            <Calendar size={18} />
                            Appointment Date *
                        </label>
                        <input
                            type="date"
                            value={formData.appointmentDate}
                            onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                            min={getMinDate()}
                            max={getMaxDate()}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            <Clock size={18} />
                            Appointment Time *
                        </label>
                        <input
                            type="time"
                            value={formData.appointmentTime}
                            onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                            min="09:00"
                            max="18:00"
                            required
                        />
                        <small>Available hours: 9:00 AM - 6:00 PM</small>
                    </div>

                    <div className="form-group">
                        <label>
                            <FileText size={18} />
                            Reason for Appointment *
                        </label>
                        <textarea
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            placeholder="Please describe your symptoms or reason for consultation..."
                            rows="5"
                            required
                        />
                    </div>

                    <div className="appointment-info-box">
                        <h4>📋 Important Information</h4>
                        <ul>
                            <li>Your appointment request will be sent to the doctor for approval</li>
                            <li>You will receive an email notification once the doctor responds</li>
                            <li>A reminder will be sent 24 hours before your appointment</li>
                        </ul>
                    </div>

                    <div className="appointment-form-actions">
                        <button 
                            type="button" 
                            className="btn-secondary" 
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Booking...' : 'Book Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AppointmentBooking;
