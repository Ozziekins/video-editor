import './App.css';
import VideoEdit from './pages/VideoEdit';
import React, { useState, useRef } from 'react';
import {Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleVideoChange = (event) => {
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);

    setLoading(true);
    setVideoUrl(url);
    // Reset the file input value
    event.target.value = null;
    // Programmatically click the file input element to close the file menu
    fileInputRef.current.click();
    verifyVideoFile(file);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleLinkUploadClick = () => {
    setShowLinkInput(true);
  };

  const handleLinkSubmit = (event) => {
    event.preventDefault();
    const link = event.target.elements.link.value.trim();
    if (link) {
      verifyVideoLink(link);
    }
  };

  const verifyVideoFile = (file) => {
    if (file.type.startsWith('video/')) {
      setLoading(false);
      navigate('/video-edit');
    } else {
      setLoading(false);
      alert('The selected file is not a valid video.');
    }
  };

  const verifyVideoLink = (link) => {
    setLoading(true);
    const video = document.createElement('video');
    video.src = link;

    video.addEventListener('loadedmetadata', () => {
      setVideoUrl(link);
      setLoading(false);
      navigate('/video-edit'); 
    });

    video.addEventListener('error', () => {
      setVideoUrl('');
      setLoading(false);
      alert('The provided link is not a valid video URL.');
    });
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home handleBrowseClick={handleBrowseClick} handleLinkUploadClick={handleLinkUploadClick} showLinkInput={showLinkInput} handleLinkSubmit={handleLinkSubmit} loading={loading} />} />
        <Route path="/video-edit" element={<VideoEdit videoUrl={videoUrl} />} />
      </Routes>
      <input type="file" accept="video/*" onChange={handleVideoChange} ref={fileInputRef} style={{ display: 'none' }} />
    </>
  );
}

function Home({ handleBrowseClick, handleLinkUploadClick, showLinkInput, handleLinkSubmit, loading }) {
  return (
    <>
      <div className="container">
      <h1 className="heading">Upload a video</h1>
      <div className="upload-section">
        <div className="upload-icon">
          <span className="upload-icon-inner"></span>
        </div>
        <h2 className="upload-text">Drag &amp; drop the file you want to upload</h2>
        <div className="button-container">
          <button className="purple-button" onClick={handleBrowseClick}>
            Browse
          </button>
          <button className="purple-button" onClick={handleLinkUploadClick}>
            Upload from link
          </button>
        </div>
        {showLinkInput && (
          <form className="link-upload-form" onSubmit={handleLinkSubmit}>
            <input className="link-input" type="text" name="link" placeholder="Enter video URL" />
            <button type="submit" className="purple-button">Upload</button>
          </form>
        )}
      </div>
      {loading && <div className="loading">Uploading...</div>}
      </div>
    </>
  );
}

export default App;
