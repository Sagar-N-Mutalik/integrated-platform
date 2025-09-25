import React, { useState, useEffect } from 'react';
import { 
  Upload, Folder, File, Download, Share2, Trash2, 
  Plus, Search, Filter, AlertCircle, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ToastContext';
import './FileManager.css';

// Utility function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const FileManager = ({ user }) => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const { showToast } = useToast();

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileUpload({ target: { files } });
    }
  };

  useEffect(() => {
    fetchUserFiles();
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


  const validateFile = (file) => {
    // Allow all file types as per requirement (png, jpg, pdf, doc, docx, etc.)
    return true;
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = files.length;
      let uploadedCount = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!validateFile(file)) {
          throw new Error(`Invalid file type: ${file.name}`);
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.id);

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
          uploadedCount++;
          setUploadProgress((uploadedCount / totalFiles) * 100);
        } else {
          throw new Error(`Failed to upload ${file.name}`);
        }
      }

      // Refresh the file list after all uploads are complete
      fetchUserFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      showToast(error.message || 'Error uploading file', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
        showToast('File deleted', 'success');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      showToast('Error deleting file', 'error');
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
        showToast('Share link copied to clipboard', 'success');
      }
    } catch (error) {
      console.error('Error sharing file:', error);
      showToast('Error sharing file', 'error');
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  return (
    <div className="file-manager"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="file-manager-header">
        <h2>My Files</h2>
        
        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="upload-btn" onClick={() => document.getElementById('file-upload').click()}>
            <Upload size={20} />
            Upload Files
          </button>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            accept="*/*"
          />
        </div>
      </div>

      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-content">
            <Upload size={48} />
            <h3>Drop your files here</h3>
            <p>All file types are supported</p>
          </div>
        </div>
      )}

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

      <div className="file-grid">
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

      {filteredFiles.length === 0 && (
        <div className="empty-state">
          <File size={64} />
          <h3>No files found</h3>
          <p>Upload your first file to get started</p>
        </div>
      )}
    </div>
  );
};

export default FileManager;
