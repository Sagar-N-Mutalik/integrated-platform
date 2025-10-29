import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Building, FileText, Bell, ArrowLeft, X } from 'lucide-react';
import './Appointments.css';
import { useToast } from './ToastContext';

const Appointments = ({ user, onBack }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const { showToast } = useToast();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/v1/appointments/my-appointments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            } else {
                showToast('Failed to load appointments', 'error');
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
            showToast('Failed to load appointments', 'error');
        } finally {
            setLoading(false);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        if (!window.confirm('Are you sure you want to cancel this appointment?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/v1/appointments/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                showToast('Appointment cancelled successfully', 'success');
                fetchAppointments();
            } else {
                showToast('Failed to cancel appointment', 'error');
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            showToast('Failed to cancel appointment', 'error');
        }
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return {
            date: date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            time: date.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };
    };

    const isUpcoming = (dateTimeString) => {
        const appointmentDate = new Date(dateTimeString);
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);
        
        return appointmentDate > now && appointmentDate <= tomorrow;
    };

    const filterAppointments = () => {
        switch (activeTab) {
            case 'upcoming':
                return appointments.filter(apt => 
                    apt.status === 'ACCEPTED' && new Date(apt.appointmentDateTime) > new Date()
                );
            case 'pending':
                return appointments.filter(apt => apt.status === 'PENDING');
            case 'past':
                return appointments.filter(apt => 
                    apt.status === 'COMPLETED' || 
                    (apt.status === 'ACCEPTED' && new Date(apt.appointmentDateTime) < new Date())
                );
            default:
                return appointments;
        }
    };

    const filteredAppointments = filterAppointments();

    const AppointmentCard = ({ appointment }) => {
        const { date, time } = formatDateTime(appointment.appointmentDateTime);
        const showReminder = isUpcoming(appointment.appointmentDateTime) && appointment.status === 'ACCEPTED';

        return (
            <div className={`appointment-card ${appointment.status.toLowerCase()}`}>
                <div className="appointment-card-header">
                    <div className="appointment-doctor">
                        <h3>Dr. {appointment.doctorName}</h3>
                        <p>{appointment.hospitalName}</p>
                    </div>
                    <span className={`appointment-status ${appointment.status.toLowerCase()}`}>
                        {appointment.status}
                    </span>
                </div>

                <div className="appointment-details">
                    <div className="appointment-detail-row">
                        <Calendar size={18} />
                        <span>{date}</span>
                    </div>
                    <div className="appointment-detail-row">
                        <Clock size={18} />
                        <span>{time}</span>
                    </div>
                    {appointment.hospitalName && (
                        <div className="appointment-detail-row">
                            <Building size={18} />
                            <span>{appointment.hospitalName}</span>
                        </div>
                    )}
                </div>

                {appointment.reason && (
                    <div className="appointment-reason">
                        <h4>Reason for Visit</h4>
                        <p>{appointment.reason}</p>
                    </div>
                )}

                {showReminder && (
                    <div className="appointment-reminder-badge">
                        <Bell size={16} />
                        Appointment Tomorrow!
                    </div>
                )}

                {appointment.status === 'PENDING' && (
                    <div className="appointment-actions">
                        <button 
                            className="btn-cancel"
                            onClick={() => cancelAppointment(appointment.id)}
                        >
                            Cancel Request
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="appointments-container">
            <div className="appointments-header">
                {onBack && (
                    <button className="back-button" onClick={onBack} style={{ marginBottom: '16px' }}>
                        <ArrowLeft size={20} />
                        Back to Dashboard
                    </button>
                )}
                <h1>My Appointments</h1>
                <p>View and manage your medical appointments</p>
            </div>

            <div className="appointments-tabs">
                <button 
                    className={`appointments-tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Appointments
                </button>
                <button 
                    className={`appointments-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    Upcoming
                </button>
                <button 
                    className={`appointments-tab ${activeTab === 'pending' ? 'active' : ''}`}
                    onClick={() => setActiveTab('pending')}
                >
                    Pending
                </button>
                <button 
                    className={`appointments-tab ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                    Past
                </button>
            </div>

            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading appointments...</p>
                </div>
            ) : filteredAppointments.length > 0 ? (
                <div className="appointments-grid">
                    {filteredAppointments.map((appointment) => (
                        <AppointmentCard key={appointment.id} appointment={appointment} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <Calendar size={64} />
                    <h3>No appointments found</h3>
                    <p>
                        {activeTab === 'all' 
                            ? "You haven't booked any appointments yet"
                            : `No ${activeTab} appointments`}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Appointments;
