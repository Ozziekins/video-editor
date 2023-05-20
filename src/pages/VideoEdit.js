import React, { useEffect, useState, useRef, useCallback } from 'react';
import './VideoEdit.css';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from 'react-icons/io';

function VideoEdit({ videoUrl }) {
  const [text, setText] = useState('');
  const [showControls, setShowControls] = useState(false);
  const [fontSize, setFontSize] = useState(30);
  const [textPosition, setTextPosition] = useState({ x: 20, y: 50 });
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontStyle, setFontStyle] = useState('normal');
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const inputRef = useRef(null);

  const drawTextOnCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = document.querySelector('.uploaded-video');
    console.log(text);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0);

    ctx.font = `${fontStyle} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = 'black';
    ctx.fillText(text, textPosition.x, textPosition.y);
  }, [text, fontSize, textPosition, fontFamily, fontStyle]);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleAddText = useCallback(() => {
    drawTextOnCanvas();
    setShowControls(true);
    setText('');
  }, [drawTextOnCanvas]);

  const handleFontSizeChange = (event) => {
    setFontSize(parseInt(event.target.value));
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
    drawTextOnCanvas();
    setShowControls(false);
  }, [drawTextOnCanvas]);

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
  

  return (
    <div className="container">
      <div className="upload-video-page">
        <button className="back-button" onClick={() => navigate('/')}>
          <IoIosArrowRoundBack className="back-icon" />
        </button>
        <video controls className="uploaded-video">
          <source src={videoUrl} type="video/mp4" />
        </video>
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
              Apply
            </button>
          </div>
        )}
        <canvas ref={canvasRef} className="canvas" />
      </div>
    </div>
  );
}

export default VideoEdit;
