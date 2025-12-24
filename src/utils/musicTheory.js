// Music Theory Constants and Utilities

// All 12 chromatic notes
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Scale intervals (semitones from root)
export const SCALES = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  pentatonicMajor: [0, 2, 4, 7, 9],
  pentatonicMinor: [0, 3, 5, 7, 10],
  blues: [0, 3, 5, 6, 7, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
};

// Chord types with intervals
export const CHORD_TYPES = {
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  major7: [0, 4, 7, 11],
  minor7: [0, 3, 7, 10],
  dominant7: [0, 4, 7, 10],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  add9: [0, 4, 7, 14],
};

// Roman numeral chord qualities for each scale degree
export const DIATONIC_CHORDS = {
  major: ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'],
  minor: ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'],
};

// Genre-specific chord progression patterns (using scale degrees 1-7)
export const GENRE_PROGRESSIONS = {
  rock: [
    [1, 4, 5, 5],
    [1, 5, 6, 4],
    [1, 4, 6, 5],
    [1, 6, 4, 5],
    [1, 4, 1, 5],
  ],
  blues: [
    [1, 1, 1, 1, 4, 4, 1, 1, 5, 4, 1, 5], // 12-bar blues
    [1, 4, 1, 5],
    [1, 1, 4, 4, 1, 5, 4, 1],
  ],
  jazz: [
    [2, 5, 1, 1],
    [1, 6, 2, 5],
    [3, 6, 2, 5],
    [1, 4, 3, 6, 2, 5, 1, 1],
  ],
  pop: [
    [1, 5, 6, 4],
    [1, 4, 5, 4],
    [6, 4, 1, 5],
    [1, 6, 4, 5],
    [4, 1, 5, 6],
  ],
  country: [
    [1, 4, 5, 1],
    [1, 1, 4, 4, 1, 5, 1, 1],
    [1, 4, 1, 5],
    [1, 6, 4, 5],
  ],
  metal: [
    [1, 7, 6, 7],
    [1, 2, 1, 7],
    [1, 3, 4, 5],
    [1, 5, 1, 4],
    [1, 6, 7, 1],
  ],
  folk: [
    [1, 4, 5, 1],
    [1, 5, 4, 1],
    [1, 4, 1, 5],
    [1, 6, 4, 5],
    [1, 2, 4, 5],
  ],
};

// Rhythm patterns per genre (note durations in beats)
export const RHYTHM_PATTERNS = {
  rock: {
    lead: [
      [0.5, 0.5, 1, 0.5, 0.5, 1],
      [1, 0.5, 0.5, 1, 1],
      [0.25, 0.25, 0.5, 0.5, 0.5, 1, 1],
    ],
    bass: [
      [1, 1, 1, 1],
      [0.5, 0.5, 1, 0.5, 0.5, 1],
      [1, 0.5, 0.5, 1, 1],
    ],
  },
  blues: {
    lead: [
      [1.5, 0.5, 1, 1],
      [0.75, 0.25, 0.75, 0.25, 1, 1],
      [1, 1, 0.5, 0.5, 1],
    ],
    bass: [
      [1, 1, 1, 1],
      [0.5, 0.5, 0.5, 0.5, 1, 1],
    ],
  },
  jazz: {
    lead: [
      [1.5, 0.5, 1.5, 0.5],
      [0.5, 1, 0.5, 1, 1],
      [0.75, 0.75, 0.5, 1, 1],
    ],
    bass: [
      [1, 1, 1, 1],
      [2, 2],
    ],
  },
  pop: {
    lead: [
      [1, 1, 1, 1],
      [0.5, 0.5, 1, 0.5, 0.5, 1],
      [0.5, 0.5, 0.5, 0.5, 1, 1],
    ],
    bass: [
      [1, 1, 1, 1],
      [0.5, 0.5, 1, 0.5, 0.5, 1],
    ],
  },
  country: {
    lead: [
      [1, 1, 1, 1],
      [0.5, 0.5, 1, 0.5, 0.5, 1],
      [1, 0.5, 0.5, 1, 1],
    ],
    bass: [
      [1, 1, 1, 1],
      [2, 2],
    ],
  },
  metal: {
    lead: [
      [0.25, 0.25, 0.25, 0.25, 0.5, 0.5, 1, 1],
      [0.5, 0.5, 0.5, 0.5, 1, 1],
      [1, 0.5, 0.5, 0.5, 0.5, 1],
    ],
    bass: [
      [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
      [1, 1, 1, 1],
    ],
  },
  folk: {
    lead: [
      [1, 1, 1, 1],
      [0.5, 0.5, 1, 1, 1],
      [1, 0.5, 0.5, 1, 1],
    ],
    bass: [
      [2, 2],
      [1, 1, 1, 1],
    ],
  },
};

// Drum patterns (beat positions in a 4-beat measure)
export const DRUM_PATTERNS = {
  rock: {
    kick: [0, 2],
    snare: [1, 3],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
  },
  blues: {
    kick: [0, 1.5, 2],
    snare: [1, 3],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
  },
  jazz: {
    kick: [0, 2.5],
    snare: [1, 2, 3],
    hihat: [0, 0.75, 1.5, 2.25, 3],
  },
  pop: {
    kick: [0, 2],
    snare: [1, 3],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
  },
  country: {
    kick: [0, 2],
    snare: [1, 3],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
  },
  metal: {
    kick: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
    snare: [1, 3],
    hihat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75],
  },
  folk: {
    kick: [0, 2],
    snare: [1, 3],
    hihat: [0, 1, 2, 3],
  },
};

// Guitar fret positions for each note (standard tuning EADGBE)
export const GUITAR_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];
export const GUITAR_TUNING_OCTAVES = [2, 2, 3, 3, 3, 4];

// Helper function: get note index
export const getNoteIndex = (note) => {
  const cleanNote = note.replace(/[0-9]/g, '');
  return NOTES.indexOf(cleanNote);
};

// Helper function: transpose note by semitones
export const transposeNote = (note, semitones) => {
  const noteIndex = getNoteIndex(note);
  const newIndex = (noteIndex + semitones + 12) % 12;
  return NOTES[newIndex];
};

// Helper function: get scale notes for a key
export const getScaleNotes = (key, scaleType = 'major') => {
  const keyIndex = getNoteIndex(key);
  const intervals = SCALES[scaleType];
  return intervals.map(interval => NOTES[(keyIndex + interval) % 12]);
};

// Helper function: get chord notes
export const getChordNotes = (root, chordType = 'major') => {
  const rootIndex = getNoteIndex(root);
  const intervals = CHORD_TYPES[chordType];
  return intervals.map(interval => NOTES[(rootIndex + interval) % 12]);
};

// Helper function: get diatonic chord at scale degree
export const getDiatonicChord = (key, degree, mode = 'major') => {
  const scaleNotes = getScaleNotes(key, mode);
  const chordRoot = scaleNotes[degree - 1];
  const chordType = DIATONIC_CHORDS[mode][degree - 1];
  return {
    root: chordRoot,
    type: chordType,
    name: `${chordRoot}${chordType === 'major' ? '' : chordType === 'minor' ? 'm' : 'dim'}`,
    notes: getChordNotes(chordRoot, chordType),
  };
};

// Get random element from array
export const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Get random integer between min and max (inclusive)
export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Generate guitar tab position for a note
export const getNoteTabPosition = (note, octave) => {
  const noteIndex = getNoteIndex(note);
  const positions = [];
  
  for (let string = 0; string < 6; string++) {
    const openNoteIndex = getNoteIndex(GUITAR_TUNING[string]);
    const openOctave = GUITAR_TUNING_OCTAVES[string];
    
    for (let fret = 0; fret <= 24; fret++) {
      const fretNoteIndex = (openNoteIndex + fret) % 12;
      const fretOctave = openOctave + Math.floor((openNoteIndex + fret) / 12);
      
      if (fretNoteIndex === noteIndex && fretOctave === octave) {
        positions.push({ string: 6 - string, fret });
      }
    }
  }
  
  return positions;
};
