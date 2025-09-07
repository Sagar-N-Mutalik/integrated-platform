import React, { useState, useEffect } from 'react';
import { Upload, Folder, File, Download, Share2, Trash2, Plus, Search, Filter } from 'lucide-react';
import './FileManager.css';

const FileManager = ({ user }) => {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    fetchUserFiles();
    fetchUserFolders();
  }, [user]);

  const fetchUserFiles = async () => {
    try {
      const response = await fetch(`/api/v1/files/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const fetchUserFolders = async () => {
    try {
      const response = await fetch(`/api/v1/folders/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);
    if (currentFolder) {
      formData.append('folderId', currentFolder.id);
    }

    try {
      const response = await fetch('/api/v1/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const uploadedFile = await response.json();
        setFiles(prev => [...prev, uploadedFile]);
        setUploadProgress(100);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
        }, 1000);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const response = await fetch('/api/v1/folders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newFolderName,
          userId: user.id,
          parentFolderId: currentFolder?.id
        })
      });

      if (response.ok) {
        const newFolder = await response.json();
        setFolders(prev => [...prev, newFolder]);
        setNewFolderName('');
        setShowCreateFolder(false);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      const response = await fetch(`/api/v1/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setFiles(prev => prev.filter(file => file.id !== fileId));
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const shareFile = async (fileId) => {
    try {
      const response = await fetch(`/api/v1/files/${fileId}/share`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const shareData = await response.json();
        navigator.clipboard.writeText(shareData.shareUrl);
        alert('Share link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing file:', error);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || file.type.includes(filterType);
    const matchesFolder = !currentFolder || file.folderId === currentFolder.id;
    return matchesSearch && matchesFilter && matchesFolder;
  });

  const currentFolders = folders.filter(folder => 
    (!currentFolder && !folder.parentFolderId) || 
    (currentFolder && folder.parentFolderId === currentFolder.id)
  );

  return (
    <div className="file-manager">
      <div className="file-manager-header">
        <div className="breadcrumb">
          <button 
            onClick={() => setCurrentFolder(null)}
            className={!currentFolder ? 'active' : ''}
          >
            My Files
          </button>
          {currentFolder && (
            <>
              <span>/</span>
              <span className="active">{currentFolder.name}</span>
            </>
          )}
        </div>

        <div className="file-actions">
          <div className="search-filter">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="pdf">PDF</option>
              <option value="document">Documents</option>
            </select>
          </div>

          <button 
            onClick={() => setShowCreateFolder(true)}
            className="btn btn-secondary"
          >
            <Plus size={20} /> New Folder
          </button>

          <label className="btn btn-primary upload-btn">
            <Upload size={20} /> Upload File
            <input
              type="file"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              accept="*/*"
            />
          </label>
        </div>
      </div>

      {isUploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <span>Uploading... {uploadProgress}%</span>
        </div>
      )}

      {showCreateFolder && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="form-input"
            />
            <div className="modal-actions">
              <button onClick={() => setShowCreateFolder(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={createFolder} className="btn btn-primary">
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="file-grid">
        {currentFolders.map(folder => (
          <div 
            key={folder.id} 
            className="file-item folder-item"
            onClick={() => setCurrentFolder(folder)}
          >
            <div className="file-icon">
              <Folder size={48} />
            </div>
            <div className="file-info">
              <span className="file-name">{folder.name}</span>
              <span className="file-meta">{folder.fileCount || 0} files</span>
            </div>
          </div>
        ))}

        {filteredFiles.map(file => (
          <div key={file.id} className="file-item">
            <div className="file-icon">
              {file.type.includes('image') ? (
                <img src={file.thumbnailUrl || file.url} alt={file.name} />
              ) : (
                <File size={48} />
              )}
            </div>
            <div className="file-info">
              <span className="file-name">{file.name}</span>
              <span className="file-meta">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </div>
            <div className="file-actions">
              <button 
                onClick={() => window.open(file.url, '_blank')}
                className="action-btn"
                title="Download"
              >
                <Download size={16} />
              </button>
              <button 
                onClick={() => shareFile(file.id)}
                className="action-btn"
                title="Share"
              >
                <Share2 size={16} />
              </button>
              <button 
                onClick={() => deleteFile(file.id)}
                className="action-btn delete-btn"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredFiles.length === 0 && currentFolders.length === 0 && (
        <div className="empty-state">
          <File size={64} />
          <h3>No files found</h3>
          <p>Upload your first file or create a folder to get started</p>
        </div>
      )}
    </div>
  );
};

export default FileManager;
