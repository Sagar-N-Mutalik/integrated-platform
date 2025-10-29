import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Edit2, Save, X, FileText, Clock, Settings } from 'lucide-react';
import './Profile.css';
import { useToast } from './ToastContext';

const Profile = ({ user, onEditProfile, onSettings }) => {
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ totalFiles: 0, totalAppointments: 0 });
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editedProfile, setEditedProfile] = useState({});
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        console.log('Profile component mounted, user:', user);
        console.log('Token:', localStorage.getItem('token'));
        fetchProfile();
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await fetch('/api/v1/users/me', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
                setEditedProfile(data);
            } else {
                console.error('Failed to fetch profile:', response.status);
                // Fallback to user prop if API fails
                const fallbackProfile = {
                    fullName: user.fullName,
                    email: user.email,
                    age: null,
                    gender: null,
                    phone: null,
                    createdAt: null
                };
                setProfile(fallbackProfile);
                setEditedProfile(fallbackProfile);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            // Fallback to user prop if API fails
            const fallbackProfile = {
                fullName: user.fullName,
                email: user.email,
                age: null,
                gender: null,
                phone: null,
                createdAt: null
            };
            setProfile(fallbackProfile);
            setEditedProfile(fallbackProfile);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            // Fetch file stats
            const filesResponse = await fetch(`/api/v1/files/stats/${user.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (filesResponse.ok) {
                const filesData = await filesResponse.json();
                setStats(prev => ({ ...prev, totalFiles: filesData.totalFiles || 0 }));
            }

            // Fetch appointment stats
            const appointmentsResponse = await fetch('/api/v1/appointments/my-appointments', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (appointmentsResponse.ok) {
                const appointmentsData = await appointmentsResponse.json();
                setStats(prev => ({ ...prev, totalAppointments: appointmentsData.length || 0 }));
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Prepare data: convert empty strings to null and age to number
            const dataToSend = {
                fullName: editedProfile.fullName || null,
                phone: editedProfile.phone || null,
                age: editedProfile.age ? parseInt(editedProfile.age) : null,
                gender: editedProfile.gender || null,
                notificationsEnabled: editedProfile.notificationsEnabled
            };

            console.log('Sending profile update:', dataToSend);

            const response = await fetch('/api/v1/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(dataToSend)
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const updatedData = await response.json();
                console.log('Updated profile:', updatedData);
                setProfile(updatedData);
                setEditMode(false);
                showToast('Profile updated successfully', 'success');
                // Refresh profile to get latest data
                fetchProfile();
            } else {
                const errorText = await response.text();
                console.error('Update failed:', errorText);
                showToast('Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast('Error updating profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setEditMode(false);
    };

    if (loading) {
        return (
            <div className="profile-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="profile-container">
                <div className="empty-state">
                    <User size={64} />
                    <h3>Profile not found</h3>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Profile</h1>
                <p>View and manage your personal information</p>
            </div>

            {!editMode ? (
                <div className="profile-content">
                    <div className="profile-sidebar">
                        <div className="profile-avatar-card">
                            <div className="profile-avatar-large">
                                <User />
                            </div>
                            <div className="profile-name">{profile.fullName}</div>
                            <div className="profile-email">{profile.email}</div>
                            
                            <div className="profile-stats">
                                <div className="profile-stat">
                                    <span className="profile-stat-value">{stats.totalFiles}</span>
                                    <span className="profile-stat-label">Files</span>
                                </div>
                                <div className="profile-stat">
                                    <span className="profile-stat-value">{stats.totalAppointments}</span>
                                    <span className="profile-stat-label">Appointments</span>
                                </div>
                            </div>
                        </div>

                        <div className="profile-actions-card">
                            <h3>Quick Actions</h3>
                            <button className="profile-action-btn primary" onClick={() => setEditMode(true)}>
                                <Edit2 size={18} />
                                Edit Profile
                            </button>
                            {onSettings && (
                                <button className="profile-action-btn secondary" onClick={onSettings}>
                                    <Settings size={18} />
                                    Settings
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="profile-main">
                        <div className="profile-info-card">
                            <h2>
                                <User size={24} />
                                Personal Information
                            </h2>
                            <div className="profile-info-grid">
                                <div className="profile-info-item">
                                    <span className="profile-info-label">Full Name</span>
                                    <span className="profile-info-value">{profile.fullName}</span>
                                </div>
                                <div className="profile-info-item">
                                    <span className="profile-info-label">Email</span>
                                    <span className="profile-info-value">{profile.email}</span>
                                </div>
                                <div className="profile-info-item">
                                    <span className="profile-info-label">Phone</span>
                                    <span className={`profile-info-value ${!profile.phone ? 'empty' : ''}`}>
                                        {profile.phone || 'Not provided'}
                                    </span>
                                </div>
                                <div className="profile-info-item">
                                    <span className="profile-info-label">Age</span>
                                    <span className={`profile-info-value ${!profile.age ? 'empty' : ''}`}>
                                        {profile.age || 'Not provided'}
                                    </span>
                                </div>
                                <div className="profile-info-item">
                                    <span className="profile-info-label">Gender</span>
                                    <span className={`profile-info-value ${!profile.gender ? 'empty' : ''}`}>
                                        {profile.gender || 'Not provided'}
                                    </span>
                                </div>
                                <div className="profile-info-item">
                                    <span className="profile-info-label">Member Since</span>
                                    <span className="profile-info-value">
                                        {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="profile-edit-mode">
                    <h2>Edit Profile</h2>
                    <div className="profile-form-grid">
                        <div className="profile-form-group full-width">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                value={editedProfile.fullName || ''}
                                onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="profile-form-group full-width">
                            <label>Email</label>
                            <input
                                type="email"
                                value={editedProfile.email || ''}
                                readOnly
                                placeholder="Email cannot be changed"
                            />
                        </div>
                        <div className="profile-form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                value={editedProfile.phone || ''}
                                onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div className="profile-form-group">
                            <label>Age</label>
                            <input
                                type="number"
                                value={editedProfile.age || ''}
                                onChange={(e) => setEditedProfile({ ...editedProfile, age: e.target.value })}
                                placeholder="Enter your age"
                                min="1"
                                max="150"
                            />
                        </div>
                        <div className="profile-form-group">
                            <label>Gender</label>
                            <select
                                value={editedProfile.gender || ''}
                                onChange={(e) => setEditedProfile({ ...editedProfile, gender: e.target.value })}
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                    <div className="profile-form-actions">
                        <button className="btn-cancel" onClick={handleCancel} disabled={saving}>
                            <X size={18} />
                            Cancel
                        </button>
                        <button className="btn-save" onClick={handleSave} disabled={saving}>
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
