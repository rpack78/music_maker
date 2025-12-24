import React, { useRef, useEffect, useState, useCallback } from 'react';
import { NOTES } from '../../utils/musicTheory';
import './PianoRoll.css';

const NOTE_HEIGHT = 16;
const BEAT_WIDTH = 60;
const OCTAVE_RANGE = { min: 2, max: 6 };
const ALL_NOTES = [];

// Generate all notes in range
for (let octave = OCTAVE_RANGE.max; octave >= OCTAVE_RANGE.min; octave--) {
  for (let i = NOTES.length - 1; i >= 0; i--) {
    ALL_NOTES.push({ note: NOTES[i], octave });
  }
}

const PianoRoll = ({
  notes = [],
  measures = 8,
  currentBeat = 0,
  isPlaying = false,
  onNoteChange,
  onNoteAdd,
  onNoteDelete,
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);

  const totalBeats = measures * 4;
  const canvasWidth = totalBeats * BEAT_WIDTH + 80;
  const canvasHeight = ALL_NOTES.length * NOTE_HEIGHT;

  // Get Y position for a note
  const getNoteY = useCallback((noteName, octave) => {
    const index = ALL_NOTES.findIndex(
      (n) => n.note === noteName && n.octave === octave
    );
    return index * NOTE_HEIGHT;
  }, []);

  // Get note at Y position
  const getNoteAtY = useCallback((y) => {
    const index = Math.floor(y / NOTE_HEIGHT);
    if (index >= 0 && index < ALL_NOTES.length) {
      return ALL_NOTES[index];
    }
    return null;
  }, []);

  // Draw piano roll
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw piano keys (left side)
    const keyWidth = 80;
    ALL_NOTES.forEach((noteData, index) => {
      const y = index * NOTE_HEIGHT;
      const isBlackKey = noteData.note.includes('#');

      ctx.fillStyle = isBlackKey ? '#2a2a4a' : '#3a3a5a';
      ctx.fillRect(0, y, keyWidth, NOTE_HEIGHT - 1);

      // Note label
      ctx.fillStyle = '#8b8fa3';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(
        `${noteData.note}${noteData.octave}`,
        5,
        y + NOTE_HEIGHT - 4
      );
    });

    // Draw grid
    for (let beat = 0; beat < totalBeats; beat++) {
      const x = keyWidth + beat * BEAT_WIDTH;
      const isMeasureStart = beat % 4 === 0;

      ctx.strokeStyle = isMeasureStart ? '#4a4a6a' : '#2a2a4a';
      ctx.lineWidth = isMeasureStart ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();

      // Measure number
      if (isMeasureStart) {
        ctx.fillStyle = '#8b8fa3';
        ctx.font = '11px Inter, sans-serif';
        ctx.fillText(`${beat / 4 + 1}`, x + 4, 12);
      }
    }

    // Draw horizontal lines
    ALL_NOTES.forEach((noteData, index) => {
      const y = index * NOTE_HEIGHT;
      const isBlackKey = noteData.note.includes('#');

      ctx.fillStyle = isBlackKey ? '#1f1f35' : '#252540';
      ctx.fillRect(keyWidth, y, canvasWidth - keyWidth, NOTE_HEIGHT - 1);
    });

    // Draw notes
    notes.forEach((note) => {
      const x = keyWidth + note.startBeat * BEAT_WIDTH;
      const y = getNoteY(note.note, note.octave);
      const width = note.duration * BEAT_WIDTH - 2;

      if (y >= 0) {
        const isSelected = selectedNote?.id === note.id;
        const gradient = ctx.createLinearGradient(x, y, x + width, y);
        gradient.addColorStop(0, isSelected ? '#9b59b6' : '#667eea');
        gradient.addColorStop(1, isSelected ? '#8e44ad' : '#764ba2');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + 1, y + 1, width, NOTE_HEIGHT - 3, 4);
        ctx.fill();

        // Note label
        if (width > 30) {
          ctx.fillStyle = 'white';
          ctx.font = 'bold 10px Inter, sans-serif';
          ctx.fillText(note.note, x + 6, y + NOTE_HEIGHT - 5);
        }
      }
    });

    // Draw playhead
    if (isPlaying || currentBeat > 0) {
      const playheadX = keyWidth + currentBeat * BEAT_WIDTH;
      ctx.strokeStyle = '#e74c3c';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, canvasHeight);
      ctx.stroke();

      // Playhead triangle
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.moveTo(playheadX - 6, 0);
      ctx.lineTo(playheadX + 6, 0);
      ctx.lineTo(playheadX, 10);
      ctx.closePath();
      ctx.fill();
    }
  }, [notes, currentBeat, isPlaying, selectedNote, canvasWidth, canvasHeight, totalBeats, getNoteY]);

  // Handle mouse events
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a note
    const keyWidth = 80;
    if (x > keyWidth) {
      const beat = (x - keyWidth) / BEAT_WIDTH;

      const clickedNote = notes.find((note) => {
        const noteY = getNoteY(note.note, note.octave);
        return (
          beat >= note.startBeat &&
          beat <= note.startBeat + note.duration &&
          y >= noteY &&
          y <= noteY + NOTE_HEIGHT
        );
      });

      if (clickedNote) {
        setSelectedNote(clickedNote);
        setIsDragging(true);
        setDragStart({ x, y, note: { ...clickedNote } });
      } else {
        // Add new note on double-click
        if (e.detail === 2 && onNoteAdd) {
          const noteData = getNoteAtY(y);
          if (noteData) {
            onNoteAdd({
              note: noteData.note,
              octave: noteData.octave,
              startBeat: Math.floor(beat),
              duration: 1,
              velocity: 80,
            });
          }
        }
        setSelectedNote(null);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart || !selectedNote) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const keyWidth = 80;
    const newBeat = Math.max(0, Math.round((x - keyWidth) / BEAT_WIDTH * 2) / 2);
    const noteData = getNoteAtY(y);

    if (noteData && onNoteChange) {
      onNoteChange(selectedNote.id, {
        ...selectedNote,
        note: noteData.note,
        octave: noteData.octave,
        startBeat: newBeat,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (selectedNote && onNoteDelete) {
        onNoteDelete(selectedNote.id);
        setSelectedNote(null);
      }
    }
  };

  return (
    <div className="piano-roll">
      <div className="piano-roll-header">
        <h3>🎹 Piano Roll</h3>
        <p>Click notes to select, double-click to add, Delete to remove</p>
      </div>
      <div
        className="piano-roll-container"
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <canvas
          ref={canvasRef}
          style={{ width: canvasWidth, height: canvasHeight }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </div>
  );
};

export default PianoRoll;
