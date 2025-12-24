import React from 'react';
import './TrackMixer.css';

const TRACK_ICONS = {
  leadGuitar: '🎸',
  rhythmGuitar: '🎵',
  bass: '🎻',
  drums: '🥁',
  keyboard: '🎹',
};

const TrackMixer = ({
  tracks = {},
  onTrackMute,
  onTrackVolume,
  onTrackSolo,
  onRegenerateTrack,
  soloTrack,
}) => {
  const trackEntries = Object.entries(tracks);

  if (trackEntries.length === 0) {
    return (
      <div className="track-mixer empty">
        <p>No tracks generated yet</p>
      </div>
    );
  }

  return (
    <div className="track-mixer">
      <div className="mixer-header">
        <h3>🎚️ Track Mixer</h3>
      </div>
      
      <div className="tracks-list">
        {trackEntries.map(([id, track]) => (
          <div 
            key={id} 
            className={`track-row ${track.muted ? 'muted' : ''} ${soloTrack === id ? 'solo' : ''}`}
          >
            <div className="track-info">
              <span className="track-icon">{TRACK_ICONS[track.instrument] || '🎼'}</span>
              <span className="track-name">{track.name}</span>
            </div>
            
            <div className="track-controls">
              <button
                className={`track-btn mute-btn ${track.muted ? 'active' : ''}`}
                onClick={() => onTrackMute(id)}
                title="Mute"
              >
                M
              </button>
              
              <button
                className={`track-btn solo-btn ${soloTrack === id ? 'active' : ''}`}
                onClick={() => onTrackSolo(id)}
                title="Solo"
              >
                S
              </button>
              
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={track.volume}
                  onChange={(e) => onTrackVolume(id, parseFloat(e.target.value))}
                  className="volume-slider"
                />
                <span className="volume-value">{Math.round(track.volume * 100)}%</span>
              </div>
              
              <button
                className="track-btn regenerate-btn"
                onClick={() => onRegenerateTrack(id)}
                title="Regenerate this track"
              >
                🔄
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackMixer;
