import React, { useState, useEffect } from 'react';
import { 
  Upload, Folder, File, Download, Share2, Trash2, 
<<<<<<< HEAD
  Plus, Search, Filter, AlertCircle, CheckCircle, Edit2, RefreshCw 
=======
  Plus, Search, Filter, AlertCircle, CheckCircle 
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ToastContext';
import './FileManager.css';

// Utility function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
<<<<<<< HEAD
  const k = 1024;
=======
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
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
<<<<<<< HEAD
  const [renamingFileId, setRenamingFileId] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [updatingFileId, setUpdatingFileId] = useState(null);
=======
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
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
<<<<<<< HEAD
    console.log('📤 handleFileUpload called');
    const files = event.target.files;
    console.log('Files selected:', files.length);
    
    if (!files.length) {
      console.log('No files selected');
      return;
    }

    console.log('User:', user);
    if (!user || !user.id) {
      console.error('User not authenticated:', user);
      showToast('User not authenticated. Please login again.', 'error');
      return;
    }

    console.log('Starting upload for user:', user.id);
=======
    const files = event.target.files;
    if (!files.length) return;

>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = files.length;
      let uploadedCount = 0;
<<<<<<< HEAD
      let failedCount = 0;
=======
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!validateFile(file)) {
<<<<<<< HEAD
          showToast(`Invalid file type: ${file.name}`, 'error');
          failedCount++;
          continue;
=======
          throw new Error(`Invalid file type: ${file.name}`);
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.id);

<<<<<<< HEAD
        console.log('Uploading file:', file.name, 'for user:', user.id);

=======
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
        const response = await fetch('/api/v1/files/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

<<<<<<< HEAD
        console.log('Upload response status:', response.status);

        if (response.ok) {
          const uploadedFile = await response.json();
          console.log('File uploaded successfully:', uploadedFile);
          setFiles(prev => [...prev, uploadedFile]);
          uploadedCount++;
          setUploadProgress((uploadedCount / totalFiles) * 100);
          showToast(`${file.name} uploaded successfully`, 'success');
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Upload failed:', errorData);
          showToast(`Failed to upload ${file.name}: ${errorData.error || 'Unknown error'}`, 'error');
          failedCount++;
=======
        if (response.ok) {
          const uploadedFile = await response.json();
          setFiles(prev => [...prev, uploadedFile]);
          uploadedCount++;
          setUploadProgress((uploadedCount / totalFiles) * 100);
        } else {
          throw new Error(`Failed to upload ${file.name}`);
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
        }
      }

      // Refresh the file list after all uploads are complete
<<<<<<< HEAD
      if (uploadedCount > 0) {
        await fetchUserFiles();
        showToast(`Successfully uploaded ${uploadedCount} file(s)`, 'success');
      }
      
      if (failedCount > 0) {
        showToast(`${failedCount} file(s) failed to upload`, 'error');
      }
=======
      fetchUserFiles();
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
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
<<<<<<< HEAD
        const shareUrl = `${window.location.origin}/share/view/${shareData.shareUrl}`;
        navigator.clipboard.writeText(shareUrl);
=======
        navigator.clipboard.writeText(shareData.shareUrl);
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
        showToast('Share link copied to clipboard', 'success');
      }
    } catch (error) {
      console.error('Error sharing file:', error);
      showToast('Error sharing file', 'error');
    }
  };

<<<<<<< HEAD
  const startRename = (file) => {
    setRenamingFileId(file.id);
    setNewFileName(file.fileName || file.name);
  };

  const cancelRename = () => {
    setRenamingFileId(null);
    setNewFileName('');
  };

  const renameFile = async (fileId) => {
    if (!newFileName.trim()) {
      showToast('File name cannot be empty', 'error');
      return;
    }

    try {
      const response = await fetch(`/api/v1/files/${fileId}/rename`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newFileName: newFileName.trim() })
      });

      if (response.ok) {
        const updatedFile = await response.json();
        setFiles(prev => prev.map(f => f.id === fileId ? updatedFile : f));
        showToast('File renamed successfully', 'success');
        cancelRename();
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to rename file', 'error');
      }
    } catch (error) {
      console.error('Error renaming file:', error);
      showToast('Error renaming file', 'error');
    }
  };

  const updateFile = async (fileId, event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUpdatingFileId(fileId);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/v1/files/${fileId}/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const updatedFile = await response.json();
        setFiles(prev => prev.map(f => f.id === fileId ? updatedFile : f));
        showToast('File updated successfully', 'success');
      } else {
        const error = await response.json();
        showToast(error.error || 'Failed to update file', 'error');
      }
    } catch (error) {
      console.error('Error updating file:', error);
      showToast('Error updating file', 'error');
    } finally {
      setUpdatingFileId(null);
    }
  };

  const filteredFiles = files.filter(file => {
    const fileName = file.fileName || file.name || '';
    const matchesSearch = fileName.toLowerCase().includes(searchTerm.toLowerCase());
=======
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
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
<<<<<<< HEAD
              {file.mimeType?.includes('image') ? (
                <img src={file.url} alt={file.fileName || file.name} />
=======
              {file.type.includes('image') ? (
                <img src={file.thumbnailUrl || file.url} alt={file.name} />
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
              ) : (
                <File size={48} />
              )}
            </div>
            <div className="file-info">
<<<<<<< HEAD
              {renamingFileId === file.id ? (
                <div className="rename-input-container">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') renameFile(file.id);
                      if (e.key === 'Escape') cancelRename();
                    }}
                    autoFocus
                    className="rename-input"
                  />
                  <div className="rename-actions">
                    <button onClick={() => renameFile(file.id)} className="btn-save">✓</button>
                    <button onClick={cancelRename} className="btn-cancel">✕</button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="file-name">{file.fileName || file.name}</span>
                  <span className="file-meta">
                    {formatFileSize(file.size)}
                  </span>
                </>
              )}
=======
              <span className="file-name">{file.name}</span>
              <span className="file-meta">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
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
<<<<<<< HEAD
                onClick={() => startRename(file)}
                className="action-btn"
                title="Rename"
                disabled={renamingFileId !== null}
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => document.getElementById(`update-file-${file.id}`).click()}
                className="action-btn"
                title="Replace File"
                disabled={updatingFileId === file.id}
              >
                {updatingFileId === file.id ? <RefreshCw size={16} className="spinning" /> : <RefreshCw size={16} />}
              </button>
              <input
                id={`update-file-${file.id}`}
                type="file"
                onChange={(e) => updateFile(file.id, e)}
                style={{ display: 'none' }}
                accept="*/*"
              />
              <button 
=======
>>>>>>> d10f94631a71022b5f3fa56f6f7cbcb904a0828b
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
