import React, { useState, useEffect } from 'react';
import { 
  User, FileText, Calendar, Settings, LogOut, Upload, Users, Home
} from 'lucide-react';
import FileManager from './FileManager';
import './Dashboard.css';

const Dashboard = ({ user, onLogout, onSearchDoctors }) => {
  const [currentView, setCurrentView] = useState('overview');
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSize: 0,
    recentUploads: 0
  });
  const [loading, setLoading] = useState(true);

  const navigationItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'files', icon: FileText, label: 'My Files' },
    { id: 'doctors', icon: Users, label: 'Find Doctors' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  useEffect(() => {
    fetchUserStats();
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

  const renderOverview = () => (
    <div className="overview-section">
      <div className="welcome-header">
        <h1>Welcome back, {user.fullName}!</h1>
        <p>Manage your health records securely</p>
      </div>

      <div className="stats-grid">
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
      case 'settings':
        return (
          <div className="settings-section">
            <h2>Settings</h2>
            <div className="settings-card">
              <h3>Account Information</h3>
              <div className="setting-item">
                <label>Full Name</label>
                <input type="text" value={user.fullName} readOnly />
              </div>
              <div className="setting-item">
                <label>Email</label>
                <input type="email" value={user.email} readOnly />
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
          <div className="user-info">
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

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
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
