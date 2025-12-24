// Music Generation Engine
import { v4 as uuidv4 } from 'uuid';
import {
  NOTES,
  GENRE_PROGRESSIONS,
  RHYTHM_PATTERNS,
  DRUM_PATTERNS,
  getScaleNotes,
  getDiatonicChord,
  randomChoice,
  randomInt,
  getNoteTabPosition,
} from './musicTheory';

// Generate a chord progression based on genre and key
export const generateChordProgression = (key, mode, genre, measures = 8) => {
  const progressions = GENRE_PROGRESSIONS[genre] || GENRE_PROGRESSIONS.rock;
  const pattern = randomChoice(progressions);
  const chords = [];
  
  // Repeat pattern to fill measures
  let currentMeasure = 0;
  while (currentMeasure < measures) {
    for (let i = 0; i < pattern.length && currentMeasure < measures; i++) {
      const degree = pattern[i];
      const chord = getDiatonicChord(key, degree, mode);
      chords.push({
        id: uuidv4(),
        ...chord,
        measure: currentMeasure,
        duration: 4, // 4 beats per measure
      });
      currentMeasure++;
    }
  }
  
  return chords;
};

// Generate melody notes that fit the chord progression
export const generateMelody = (chords, key, mode, genre, density = 'medium') => {
  const notes = [];
  const scaleNotes = getScaleNotes(key, mode);
  const rhythmPatterns = RHYTHM_PATTERNS[genre]?.lead || RHYTHM_PATTERNS.rock.lead;
  
  const densityMultiplier = density === 'sparse' ? 0.5 : density === 'dense' ? 1.5 : 1;
  
  chords.forEach((chord) => {
    const pattern = randomChoice(rhythmPatterns);
    let beatPosition = 0;
    
    pattern.forEach((duration) => {
      if (beatPosition >= 4) return; // Don't exceed measure
      
      // Decide whether to add a note (based on density)
      if (Math.random() < 0.7 * densityMultiplier) {
        // Prefer chord tones and scale notes
        const useChordTone = Math.random() < 0.6;
        let noteOptions;
        
        if (useChordTone) {
          noteOptions = chord.notes;
        } else {
          noteOptions = scaleNotes;
        }
        
        const noteName = randomChoice(noteOptions);
        const octave = randomInt(3, 5);
        const tabPositions = getNoteTabPosition(noteName, octave);
        
        notes.push({
          id: uuidv4(),
          note: noteName,
          octave,
          duration: Math.min(duration, 4 - beatPosition),
          startBeat: chord.measure * 4 + beatPosition,
          velocity: randomInt(70, 100),
          tabPosition: tabPositions.length > 0 ? tabPositions[0] : null,
        });
      }
      
      beatPosition += duration;
    });
  });
  
  return notes;
};

// Generate bass line following the chord roots
export const generateBassLine = (chords, genre) => {
  const notes = [];
  const rhythmPatterns = RHYTHM_PATTERNS[genre]?.bass || RHYTHM_PATTERNS.rock.bass;
  
  chords.forEach((chord) => {
    const pattern = randomChoice(rhythmPatterns);
    let beatPosition = 0;
    const chordNotes = [chord.root, ...chord.notes];
    
    pattern.forEach((duration, index) => {
      if (beatPosition >= 4) return;
      
      // Bass mainly plays root, occasionally fifth
      const noteName = index === 0 ? chord.root : 
                       Math.random() < 0.7 ? chord.root : 
                       chordNotes[Math.min(2, chordNotes.length - 1)];
      
      notes.push({
        id: uuidv4(),
        note: noteName,
        octave: 2,
        duration: Math.min(duration, 4 - beatPosition),
        startBeat: chord.measure * 4 + beatPosition,
        velocity: randomInt(80, 100),
      });
      
      beatPosition += duration;
    });
  });
  
  return notes;
};

// Generate rhythm guitar strumming pattern
export const generateRhythmGuitar = (chords, genre) => {
  const strums = [];
  
  const strumPatterns = {
    rock: ['D', 'D', 'U', 'D', 'U', 'D', 'U', 'D'],
    blues: ['D', '', 'U', 'D', '', 'U', 'D', 'U'],
    jazz: ['D', '', '', 'D', '', '', 'U', ''],
    pop: ['D', 'D', 'U', 'U', 'D', 'U', 'D', 'U'],
    country: ['D', '', 'U', 'D', '', 'U', 'D', 'U'],
    metal: ['D', 'D', 'D', 'D', 'D', 'D', 'D', 'D'],
    folk: ['D', '', 'D', 'U', '', 'U', 'D', 'U'],
  };
  
  const pattern = strumPatterns[genre] || strumPatterns.rock;
  
  chords.forEach((chord) => {
    pattern.forEach((strum, index) => {
      if (strum) {
        strums.push({
          id: uuidv4(),
          chord: chord.name,
          chordNotes: chord.notes,
          direction: strum,
          startBeat: chord.measure * 4 + (index * 0.5),
          duration: 0.5,
          velocity: strum === 'D' ? randomInt(80, 100) : randomInt(60, 80),
        });
      }
    });
  });
  
  return strums;
};

// Generate drum pattern
export const generateDrums = (measures, genre, tempo) => {
  const hits = [];
  const pattern = DRUM_PATTERNS[genre] || DRUM_PATTERNS.rock;
  
  for (let measure = 0; measure < measures; measure++) {
    // Kick drum
    pattern.kick.forEach((beat) => {
      hits.push({
        id: uuidv4(),
        drum: 'kick',
        startBeat: measure * 4 + beat,
        velocity: randomInt(90, 100),
      });
    });
    
    // Snare drum
    pattern.snare.forEach((beat) => {
      hits.push({
        id: uuidv4(),
        drum: 'snare',
        startBeat: measure * 4 + beat,
        velocity: randomInt(85, 100),
      });
    });
    
    // Hi-hat
    pattern.hihat.forEach((beat) => {
      hits.push({
        id: uuidv4(),
        drum: 'hihat',
        startBeat: measure * 4 + beat,
        velocity: randomInt(50, 70),
      });
    });
  }
  
  return hits;
};

// Generate keyboard/piano part
export const generateKeyboard = (chords, genre) => {
  const notes = [];
  
  chords.forEach((chord) => {
    const startBeat = chord.measure * 4;
    
    // Different styles for different genres
    if (genre === 'jazz') {
      // Jazz: spread voicings
      chord.notes.forEach((note, index) => {
        notes.push({
          id: uuidv4(),
          note,
          octave: 3 + Math.floor(index / 2),
          duration: 4,
          startBeat,
          velocity: randomInt(60, 80),
        });
      });
    } else if (genre === 'pop' || genre === 'rock') {
      // Pop/Rock: block chords on beats
      [0, 2].forEach((beat) => {
        chord.notes.forEach((note, index) => {
          notes.push({
            id: uuidv4(),
            note,
            octave: 4,
            duration: 2,
            startBeat: startBeat + beat,
            velocity: randomInt(70, 90),
          });
        });
      });
    } else {
      // Default: sustained chords
      chord.notes.forEach((note) => {
        notes.push({
          id: uuidv4(),
          note,
          octave: 4,
          duration: 4,
          startBeat,
          velocity: randomInt(60, 80),
        });
      });
    }
  });
  
  return notes;
};

// Main composition generator
export const generateComposition = (options) => {
  const {
    key = 'C',
    mode = 'major',
    genre = 'rock',
    tempo = 120,
    measures = 8,
    instruments = {
      leadGuitar: true,
      rhythmGuitar: true,
      bass: true,
      drums: true,
      keyboard: false,
    },
  } = options;
  
  const chords = generateChordProgression(key, mode, genre, measures);
  
  const composition = {
    id: uuidv4(),
    name: `New ${genre.charAt(0).toUpperCase() + genre.slice(1)} Composition`,
    createdAt: new Date().toISOString(),
    settings: {
      key,
      mode,
      genre,
      tempo,
      measures,
      timeSignature: '4/4',
    },
    chords,
    tracks: {},
  };
  
  if (instruments.leadGuitar) {
    composition.tracks.leadGuitar = {
      name: 'Lead Guitar',
      instrument: 'leadGuitar',
      muted: false,
      volume: 0.8,
      notes: generateMelody(chords, key, mode, genre),
    };
  }
  
  if (instruments.rhythmGuitar) {
    composition.tracks.rhythmGuitar = {
      name: 'Rhythm Guitar',
      instrument: 'rhythmGuitar',
      muted: false,
      volume: 0.7,
      notes: generateRhythmGuitar(chords, genre),
    };
  }
  
  if (instruments.bass) {
    composition.tracks.bass = {
      name: 'Bass',
      instrument: 'bass',
      muted: false,
      volume: 0.75,
      notes: generateBassLine(chords, genre),
    };
  }
  
  if (instruments.drums) {
    composition.tracks.drums = {
      name: 'Drums',
      instrument: 'drums',
      muted: false,
      volume: 0.7,
      notes: generateDrums(measures, genre, tempo),
    };
  }
  
  if (instruments.keyboard) {
    composition.tracks.keyboard = {
      name: 'Keyboard',
      instrument: 'keyboard',
      muted: false,
      volume: 0.6,
      notes: generateKeyboard(chords, genre),
    };
  }
  
  return composition;
};

// Regenerate a specific track
export const regenerateTrack = (composition, trackName) => {
  const { key, mode, genre, measures } = composition.settings;
  
  switch (trackName) {
    case 'leadGuitar':
      return generateMelody(composition.chords, key, mode, genre);
    case 'rhythmGuitar':
      return generateRhythmGuitar(composition.chords, genre);
    case 'bass':
      return generateBassLine(composition.chords, genre);
    case 'drums':
      return generateDrums(measures, genre, composition.settings.tempo);
    case 'keyboard':
      return generateKeyboard(composition.chords, genre);
    default:
      return [];
  }
};
