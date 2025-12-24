import React from 'react';
import './TransportControls.css';

const TransportControls = ({
  isPlaying,
  currentBeat,
  tempo,
  measures,
  onPlay,
  onPause,
  onStop,
  onTempoChange,
  onSeek,
}) => {
  const totalBeats = measures * 4;
  const currentMeasure = Math.floor(currentBeat / 4) + 1;
  const beatInMeasure = (currentBeat % 4) + 1;

  const formatTime = (beat) => {
    const seconds = (beat / tempo) * 60;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="transport-controls">
      <div className="transport-main">
        <button
          className="transport-btn stop-btn"
          onClick={onStop}
          title="Stop"
        >
          ⏹
        </button>
        
        <button
          className="transport-btn play-btn"
          onClick={isPlaying ? onPause : onPlay}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>

      <div className="transport-time">
        <div className="time-display">
          <span className="time-value">{formatTime(currentBeat)}</span>
          <span className="time-label">Time</span>
        </div>
        <div className="measure-display">
          <span className="measure-value">{currentMeasure}.{beatInMeasure}</span>
          <span className="measure-label">Measure</span>
        </div>
      </div>

      <div className="transport-progress">
        <input
          type="range"
          min="0"
          max={totalBeats}
          step="0.25"
          value={currentBeat}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="progress-slider"
        />
        <div 
          className="progress-fill"
          style={{ width: `${(currentBeat / totalBeats) * 100}%` }}
        />
      </div>

      <div className="transport-tempo">
        <label>
          <span className="tempo-icon">♩</span>
          <span className="tempo-value">{tempo}</span>
          <span className="tempo-label">BPM</span>
        </label>
        <input
          type="range"
          min="60"
          max="200"
          value={tempo}
          onChange={(e) => onTempoChange(parseInt(e.target.value))}
          className="tempo-slider"
        />
      </div>
    </div>
  );
};

export default TransportControls;
