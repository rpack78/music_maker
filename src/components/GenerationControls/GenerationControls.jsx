import React from 'react';
import './GenerationControls.css';

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const MODES = ['major', 'minor'];
const GENRES = ['rock', 'blues', 'jazz', 'pop', 'country', 'metal', 'folk'];
const INSTRUMENTS = [
  { id: 'leadGuitar', name: 'Lead Guitar', icon: '🎸' },
  { id: 'rhythmGuitar', name: 'Rhythm Guitar', icon: '🎵' },
  { id: 'bass', name: 'Bass', icon: '🎻' },
  { id: 'drums', name: 'Drums', icon: '🥁' },
  { id: 'keyboard', name: 'Keyboard', icon: '🎹' },
];

const GenerationControls = ({
  settings,
  onSettingsChange,
  onGenerate,
  isGenerating,
}) => {
  const handleChange = (field, value) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  const handleInstrumentToggle = (instrumentId) => {
    const newInstruments = {
      ...settings.instruments,
      [instrumentId]: !settings.instruments[instrumentId],
    };
    onSettingsChange({ ...settings, instruments: newInstruments });
  };

  return (
    <div className="generation-controls">
      <div className="controls-header">
        <h2>🎼 Music Generator</h2>
        <p>Create original compositions for guitar practice</p>
      </div>

      <div className="controls-grid">
        <div className="control-group">
          <label htmlFor="key-select">Key</label>
          <select
            id="key-select"
            value={settings.key}
            onChange={(e) => handleChange('key', e.target.value)}
          >
            {KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="mode-select">Mode</label>
          <select
            id="mode-select"
            value={settings.mode}
            onChange={(e) => handleChange('mode', e.target.value)}
          >
            {MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="genre-select">Genre</label>
          <select
            id="genre-select"
            value={settings.genre}
            onChange={(e) => handleChange('genre', e.target.value)}
          >
            {GENRES.map((genre) => (
              <option key={genre} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="tempo-input">Tempo: {settings.tempo} BPM</label>
          <input
            id="tempo-input"
            type="range"
            min="60"
            max="200"
            value={settings.tempo}
            onChange={(e) => handleChange('tempo', parseInt(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label htmlFor="measures-input">Measures: {settings.measures}</label>
          <input
            id="measures-input"
            type="range"
            min="4"
            max="32"
            step="4"
            value={settings.measures}
            onChange={(e) => handleChange('measures', parseInt(e.target.value))}
          />
        </div>
      </div>

      <div className="instruments-section">
        <label>Instruments</label>
        <div className="instruments-grid">
          {INSTRUMENTS.map((instrument) => (
            <button
              key={instrument.id}
              className={`instrument-toggle ${
                settings.instruments[instrument.id] ? 'active' : ''
              }`}
              onClick={() => handleInstrumentToggle(instrument.id)}
              title={instrument.name}
            >
              <span className="instrument-icon">{instrument.icon}</span>
              <span className="instrument-name">{instrument.name}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="generate-button"
        onClick={onGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <span className="spinner"></span>
            Generating...
          </>
        ) : (
          <>
            ✨ Generate Music
          </>
        )}
      </button>
    </div>
  );
};

export default GenerationControls;
