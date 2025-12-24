import React, { useState } from 'react';
import { getDiatonicChord, getChordNotes, NOTES } from '../../utils/musicTheory';
import './ChordProgressionEditor.css';

const CHORD_TYPES = [
  { id: 'major', name: 'Major', suffix: '' },
  { id: 'minor', name: 'Minor', suffix: 'm' },
  { id: 'major7', name: 'Major 7', suffix: 'maj7' },
  { id: 'minor7', name: 'Minor 7', suffix: 'm7' },
  { id: 'dominant7', name: 'Dom 7', suffix: '7' },
  { id: 'sus2', name: 'Sus2', suffix: 'sus2' },
  { id: 'sus4', name: 'Sus4', suffix: 'sus4' },
  { id: 'diminished', name: 'Dim', suffix: 'dim' },
];

// Simple chord diagram data (fret positions for common chords)
const CHORD_DIAGRAMS = {
  C: { frets: [0, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
  D: { frets: [-1, 0, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
  E: { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
  F: { frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], barre: 1 },
  G: { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
  A: { frets: [0, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
  B: { frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], barre: 2 },
  Am: { frets: [0, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
  Em: { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
  Dm: { frets: [-1, 0, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
};

const ChordDiagram = ({ chord }) => {
  const diagram = CHORD_DIAGRAMS[chord.name] || CHORD_DIAGRAMS[chord.root] || null;
  
  if (!diagram) {
    return (
      <div className="chord-diagram-placeholder">
        <span>{chord.name}</span>
      </div>
    );
  }

  return (
    <div className="chord-diagram">
      <div className="chord-name">{chord.name}</div>
      <svg viewBox="0 0 50 60" className="chord-svg">
        {/* Nut */}
        <rect x="5" y="8" width="40" height="3" fill="#333" />
        
        {/* Strings */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line
            key={`string-${i}`}
            x1={5 + i * 8}
            y1="10"
            x2={5 + i * 8}
            y2="55"
            stroke="#666"
            strokeWidth="1"
          />
        ))}
        
        {/* Frets */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`fret-${i}`}
            x1="5"
            y1={10 + i * 11}
            x2="45"
            y2={10 + i * 11}
            stroke="#444"
            strokeWidth="1"
          />
        ))}
        
        {/* Finger positions */}
        {diagram.frets.map((fret, string) => {
          if (fret === -1) {
            return (
              <text
                key={`x-${string}`}
                x={5 + string * 8}
                y="6"
                textAnchor="middle"
                fontSize="8"
                fill="#e74c3c"
              >
                ×
              </text>
            );
          }
          if (fret === 0) {
            return (
              <circle
                key={`open-${string}`}
                cx={5 + string * 8}
                cy="5"
                r="2.5"
                fill="none"
                stroke="#8b8fa3"
                strokeWidth="1"
              />
            );
          }
          return (
            <circle
              key={`finger-${string}`}
              cx={5 + string * 8}
              cy={10 + (fret - 0.5) * 11}
              r="4"
              fill="#667eea"
            />
          );
        })}
      </svg>
    </div>
  );
};

const ChordProgressionEditor = ({
  chords = [],
  musicKey,
  mode,
  onChordChange,
  onChordAdd,
  onChordDelete,
  currentMeasure = 0,
  isPlaying = false,
}) => {
  const [selectedChord, setSelectedChord] = useState(null);
  const [showChordPicker, setShowChordPicker] = useState(false);

  const handleChordClick = (chord) => {
    setSelectedChord(chord);
    setShowChordPicker(true);
  };

  const handleChordSelect = (root, type) => {
    if (selectedChord && onChordChange) {
      const suffix = CHORD_TYPES.find((t) => t.id === type)?.suffix || '';
      const chordNotes = getChordNotes(root, type);
      onChordChange(selectedChord.id, {
        ...selectedChord,
        root,
        type,
        name: `${root}${suffix}`,
        notes: chordNotes,
      });
    }
    setShowChordPicker(false);
    setSelectedChord(null);
  };

  const getSuggestedChords = () => {
    // Get diatonic chords for the current key
    const suggestions = [];
    for (let degree = 1; degree <= 7; degree++) {
      suggestions.push(getDiatonicChord(musicKey, degree, mode));
    }
    return suggestions;
  };

  return (
    <div className="chord-progression-editor">
      <div className="chord-editor-header">
        <h3>🎸 Chord Progression</h3>
        <div className="chord-key-info">
          Key: {musicKey} {mode}
        </div>
      </div>

      <div className="chord-timeline">
        {chords.map((chord, index) => (
          <div
            key={chord.id}
            className={`chord-block ${
              selectedChord?.id === chord.id ? 'selected' : ''
            } ${isPlaying && currentMeasure === chord.measure ? 'playing' : ''}`}
            onClick={() => handleChordClick(chord)}
          >
            <div className="chord-measure">M{chord.measure + 1}</div>
            <ChordDiagram chord={chord} />
            <div className="chord-notes">{chord.notes?.join(' - ')}</div>
          </div>
        ))}
      </div>

      {showChordPicker && (
        <div className="chord-picker-overlay" onClick={() => setShowChordPicker(false)}>
          <div className="chord-picker" onClick={(e) => e.stopPropagation()}>
            <h4>Select Chord</h4>
            
            <div className="chord-picker-section">
              <h5>Suggested (Diatonic)</h5>
              <div className="chord-suggestions">
                {getSuggestedChords().map((suggestion, index) => (
                  <button
                    key={index}
                    className="chord-suggestion"
                    onClick={() => handleChordSelect(suggestion.root, suggestion.type)}
                  >
                    {suggestion.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="chord-picker-section">
              <h5>All Roots</h5>
              <div className="chord-roots">
                {NOTES.map((note) => (
                  <div key={note} className="chord-root-group">
                    <span className="root-label">{note}</span>
                    <div className="chord-type-buttons">
                      {CHORD_TYPES.slice(0, 4).map((type) => (
                        <button
                          key={type.id}
                          className="chord-type-btn"
                          onClick={() => handleChordSelect(note, type.id)}
                        >
                          {type.suffix || 'M'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="close-picker" onClick={() => setShowChordPicker(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChordProgressionEditor;
