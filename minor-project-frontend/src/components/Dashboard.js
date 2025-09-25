import React, { useState, useEffect } from 'react';
import { 
  User, FileText, Calendar, Settings, Upload, Users, Home
} from 'lucide-react';
import FileManager from './FileManager';
import './Dashboard.css';
import { useToast } from './ToastContext';

const Dashboard = ({ user, onLogout, onSearchDoctors, onAccountDeleted }) => {
  const [currentView, setCurrentView] = useState('overview');
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    recentUploads: 0
  });
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ fullName: user.fullName, email: user.email, age: '', gender: '', phone: '', notificationsEnabled: true });
  const [savingProfile, setSavingProfile] = useState(false);
  const { showToast } = useToast();

  const navigationItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'files', icon: FileText, label: 'My Files' },
    { id: 'doctors', icon: Users, label: 'Find Doctors' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  useEffect(() => {
    fetchUserStats();
    fetchProfile();
  }, [user]);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`/api/v1/files/stats/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/v1/users/me', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile({
          fullName: data.fullName || user.fullName,
          email: data.email || user.email,
          age: data.age || '',
          gender: data.gender || '',
          phone: data.phone || '',
          notificationsEnabled: data.notificationsEnabled !== undefined ? data.notificationsEnabled : true,
        });
      }
    } catch (e) {
      console.error('Error fetching profile', e);
    }
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const response = await fetch('/api/v1/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      });
      if (response.ok) {
        showToast('Profile updated successfully', 'success');
      } else {
        showToast('Failed to update profile', 'error');
      }
    } catch (e) {
      showToast('Error updating profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const confirmLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) return;
    try {
      const response = await fetch('/api/v1/users/me', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        // Clear local storage and navigate to landing via parent callback
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        showToast('Account deleted successfully', 'success');
        if (onAccountDeleted) onAccountDeleted();
      } else {
        showToast('Failed to delete account', 'error');
      }
    } catch (e) {
      showToast('Error deleting account', 'error');
    }
  };

  const renderOverview = () => (
    <div className="overview-section">
      <div className="welcome-header">
        <h1>Welcome back, {user.fullName}!</h1>
        <p>Manage your health records securely</p>
      </div>

      <div className="dashboard-layout">
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon">
              <FileText />
            </div>
            <div className="stat-info">
              <h3>{stats.totalFiles}</h3>
              <p>Total Files</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Upload />
            </div>
            <div className="stat-info">
              <h3>{(stats.totalSize / 1024 / 1024).toFixed(1)} MB</h3>
              <p>Storage Used</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Calendar />
            </div>
            <div className="stat-info">
              <h3>{stats.recentUploads}</h3>
              <p>Recent Uploads</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <button 
              className="action-card"
              onClick={() => setCurrentView('files')}
            >
              <FileText size={32} />
              <h3>Manage Files</h3>
              <p>Upload, organize and share your medical records</p>
            </button>
            <button 
              className="action-card"
              onClick={() => onSearchDoctors()}
            >
              <Users size={32} />
              <h3>Find Doctors</h3>
              <p>Search for doctors and book appointments</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return renderOverview();
      case 'files':
        return <FileManager user={user} />;
      case 'doctors':
        onSearchDoctors();
        return null;
      case 'profile':
        return (
          <div className="settings-section">
            <h2>My Profile</h2>
            <div className="settings-card">
              <div className="setting-item">
                <label>Full Name</label>
                <input type="text" value={profile.fullName} onChange={(e)=> setProfile({...profile, fullName: e.target.value})} />
              </div>
              <div className="setting-item">
                <label>Email</label>
                <input type="email" value={profile.email} readOnly />
              </div>
              <div className="setting-grid">
                <div className="setting-item">
                  <label>Age</label>
                  <input type="number" value={profile.age} onChange={(e)=> setProfile({...profile, age: e.target.value})} />
                </div>
                <div className="setting-item">
                  <label>Gender</label>
                  <input type="text" value={profile.gender} onChange={(e)=> setProfile({...profile, gender: e.target.value})} />
                </div>
                <div className="setting-item">
                  <label>Phone</label>
                  <input type="tel" value={profile.phone} onChange={(e)=> setProfile({...profile, phone: e.target.value})} />
                </div>
              </div>
              <div className="setting-actions">
                <button className="action-btn" onClick={saveProfile} disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="settings-section">
            <h2>Settings</h2>
            <div className="settings-card">
              <h3>Preferences</h3>
              <div className="setting-item">
                <label>Notifications</label>
                <div className="toggle-switch">
                  <input 
                    type="checkbox" 
                    id="notifications" 
                    checked={!!profile.notificationsEnabled} 
                    onChange={(e)=> setProfile({...profile, notificationsEnabled: e.target.checked})} 
                  />
                  <label htmlFor="notifications" className="toggle-label">
                    <span className="toggle-slider"></span>
                  </label>
                  <span className="toggle-text">{profile.notificationsEnabled ? 'On' : 'Off'}</span>
                </div>
              </div>
              <div className="setting-actions">
                <button className="action-btn primary" onClick={()=> setCurrentView('profile')}>
                  Edit Profile
                </button>
                <button className="action-btn primary" onClick={saveProfile} disabled={savingProfile}>
                  {savingProfile ? 'Saving...' : 'Save Preferences'}
                </button>
                <button className="action-btn danger" onClick={deleteAccount}>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-info" onClick={() => setCurrentView('profile')} style={{cursor: 'pointer'}}>
            <div className="user-avatar">
              <User size={24} />
            </div>
            <div className="user-details">
              <h3>{user.fullName}</h3>
              <p>{user.email}</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
              onClick={() => setCurrentView(item.id)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading-screen">
            <div className="loading"></div>
            <p>Loading...</p>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default Dashboard;
