import React, { useState, useRef, useEffect, useCallback } from 'react';
import './VideoEdit.css';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';

function VideoEdit({ videoUrl }) {
  const [text, setText] = useState('');
  const [showControls, setShowControls] = useState(false);
  const [fontSize, setFontSize] = useState(30);
  const [textPosition, setTextPosition] = useState({ x: 32, y: 20 });
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontStyle, setFontStyle] = useState('normal');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleAddText = useCallback(() => {
    setShowControls(true);
  }, []);

  const handleFontSizeChange = (event) => {
    const size = parseInt(event.target.value);
    setFontSize(isNaN(size) ? 0 : size);
  };

  const handleTextPositionChange = (event, axis) => {
    setTextPosition((prevPosition) => ({
      ...prevPosition,
      [axis]: parseInt(event.target.value),
    }));
  };

  const handleFontFamilyChange = (event) => {
    setFontFamily(event.target.value);
  };

  const handleFontStyleChange = (event) => {
    setFontStyle(event.target.value);
  };

  const handleApplyChanges = useCallback(() => {
    setShowControls(false);
    setText('');
  }, []);

  useEffect(() => {
    if (!videoUrl) {
      navigate('/');
    }

    const handleKeyDown = (event) => {
      if (event.keyCode === 13) {
        event.preventDefault();
        if (!showControls) {
          handleAddText();
        } else {
          handleApplyChanges();
        }
      }
    };
  
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);
  
      return () => {
        inputElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [videoUrl, navigate, showControls, handleAddText, handleApplyChanges]);

  const navigateToHome = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <div className="upload-video-page">
        <button className="back-button" onClick={navigateToHome}>
          <IoIosArrowRoundBack className="back-icon" />
        </button>
        <video controls className="uploaded-video">
          <source src={videoUrl} type="video/mp4" />
        </video>
        {showControls && (
          <div
            className="text-overlay"
            style={{
              fontSize: `${fontSize}px`,
              top: `${textPosition.y}%`,
              left: `${textPosition.x}%`,
              fontFamily,
              fontStyle,
            }}
          >
            {text}
          </div>
        )}
        {!showControls ? (
          <div className="text-input-container">
            <input
              type="text"
              className="text-input"
              placeholder="Enter text"
              value={text}
              onChange={handleTextChange}
              ref={inputRef}
            />
            <button className="purple-button" onClick={handleAddText}>
              Add Text
            </button>
          </div>
        ) : (
          <div className="text-controls">
            <div className="control-group">
              <label>Font Size:</label>
              <input
                type="number"
                className="control-input"
                value={fontSize}
                onChange={handleFontSizeChange}
              />
            </div>
            <div className="control-group">
              <label>Position (X):</label>
              <input
                type="number"
                className="control-input"
                value={textPosition.x}
                onChange={(event) => handleTextPositionChange(event, 'x')}
              />
            </div>
            <div className="control-group">
              <label>Position (Y):</label>
              <input
                type="number"
                className="control-input"
                value={textPosition.y}
                onChange={(event) => handleTextPositionChange(event, 'y')}
              />
            </div>
            <div className="control-group">
              <label>Font Family:</label>
              <select
                className="control-input"
                value={fontFamily}
                onChange={handleFontFamilyChange}
              >
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
              </select>
            </div>
            <div className="control-group">
              <label>Font Style:</label>
              <select
                className="control-input"
                value={fontStyle}
                onChange={handleFontStyleChange}
              >
                <option value="normal">Normal</option>
                <option value="italic">Italic</option>
                <option value="oblique">Oblique</option>
              </select>
            </div>
            <button className="purple-button" onClick={handleApplyChanges}>
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoEdit;
