import React, { useState, useEffect } from 'react';
import { 
  Upload, Folder, File, Download, Share2, Trash2, 
  Plus, Search, Filter, AlertCircle, CheckCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isDragging, setIsDragging] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchUserFiles();
    fetchUserFolders();
  }, [user]);

  const validateFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/heic',
      'application/dicom'
    ];
    return allowedTypes.includes(file.type);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
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
        if (currentFolder) {
          formData.append('folderId', currentFolder.id);
        }

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

      showNotification('Files uploaded successfully');
      fetchUserFiles();

    } catch (error) {
      console.error('Error uploading file:', error);
      showNotification(error.message, 'error');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

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
      showNotification('Error fetching files', 'error');
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
      showNotification('Error fetching folders', 'error');
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
        showNotification('Folder created successfully');
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      showNotification('Error creating folder', 'error');
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
        showNotification('File deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      showNotification('Error deleting file', 'error');
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
        await navigator.clipboard.writeText(shareData.shareUrl);
        showNotification('Share link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing file:', error);
      showNotification('Error generating share link', 'error');
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
    <div 
      className="file-manager"
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <AnimatePresence>
        {notification && (
          <motion.div
            className={`notification ${notification.type}`}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
          >
            {notification.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

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

        <div className="header-actions">
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
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.heic,.dicom"
            />
          </label>
        </div>
      </div>

      {isDragging && (
        <div className="upload-zone active">
          <Upload size={48} />
          <h3>Drop your files here</h3>
          <p>Supported formats: PDF, Word, Images, DICOM</p>
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
          <span>Uploading... {uploadProgress.toFixed(0)}%</span>
        </div>
      )}

      {showCreateFolder && (
        <div className="modal-overlay">
          <motion.div 
            className="modal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
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
          </motion.div>
        </div>
      )}

      <div className="files-container">
        <motion.div 
          className="files-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {currentFolders.map(folder => (
            <motion.div 
              key={folder.id} 
              className="file-item folder-item"
              onClick={() => setCurrentFolder(folder)}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <div className="file-icon">
                <Folder size={48} />
              </div>
              <div className="file-info">
                <span className="file-name">{folder.name}</span>
                <span className="file-meta">{folder.fileCount || 0} files</span>
              </div>
            </motion.div>
          ))}

          {filteredFiles.map(file => (
            <motion.div 
              key={file.id} 
              className="file-item"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
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
            </motion.div>
          ))}
        </motion.div>

        {filteredFiles.length === 0 && currentFolders.length === 0 && (
          <div className="empty-state">
            <File size={64} />
            <h3>No files found</h3>
            <p>Upload your first file or create a folder to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;