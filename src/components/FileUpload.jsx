// components/FileUpload.jsx
import React, { forwardRef } from 'react';
import './FileUpload.css';

const FileUpload = forwardRef(({ onFileChange, acceptedFileTypes }, ref) => {
  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div 
      className="file-upload-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="upload-area">
        <i className="upload-icon">📄</i>
        <h3>Drag & Drop Your Document Here</h3>
        <p>or</p>
        <label className="file-input-label">
          Browse Files
          <input
            type="file"
            onChange={handleFileSelection}
            accept={acceptedFileTypes}
            ref={ref}
            className="file-input"
          />
        </label>
        <p className="file-type-info">Supported formats: PDF, DOC, DOCX, ODT</p>
      </div>
    </div>
  );
});

export default FileUpload;