// Export utilities for MIDI, Tab, and Chord Sheets

// Generate MIDI file data (simplified implementation)
export const exportToMidi = (composition) => {
  // MIDI file header
  const header = new Uint8Array([
    0x4D, 0x54, 0x68, 0x64, // MThd
    0x00, 0x00, 0x00, 0x06, // Header length
    0x00, 0x01, // Format type 1
    0x00, 0x02, // Number of tracks
    0x00, 0x60, // Ticks per quarter note (96)
  ]);

  // Create a simple tempo track
  const tempoTrack = createTempoTrack(composition.settings.tempo);
  
  // Create note track from lead guitar
  const noteTrack = createNoteTrack(composition.tracks.leadGuitar?.notes || []);

  // Combine all tracks
  const midiData = new Uint8Array(header.length + tempoTrack.length + noteTrack.length);
  midiData.set(header, 0);
  midiData.set(tempoTrack, header.length);
  midiData.set(noteTrack, header.length + tempoTrack.length);

  return new Blob([midiData], { type: 'audio/midi' });
};

const createTempoTrack = (tempo) => {
  const microsPerBeat = Math.round(60000000 / tempo);
  const tempoBytes = [
    (microsPerBeat >> 16) & 0xFF,
    (microsPerBeat >> 8) & 0xFF,
    microsPerBeat & 0xFF,
  ];

  const events = new Uint8Array([
    0x00, 0xFF, 0x51, 0x03, ...tempoBytes, // Tempo
    0x00, 0xFF, 0x2F, 0x00, // End of track
  ]);

  const trackHeader = new Uint8Array([
    0x4D, 0x54, 0x72, 0x6B, // MTrk
    0x00, 0x00, 0x00, events.length,
  ]);

  const track = new Uint8Array(trackHeader.length + events.length);
  track.set(trackHeader, 0);
  track.set(events, trackHeader.length);

  return track;
};

const createNoteTrack = (notes) => {
  const events = [];
  const ticksPerBeat = 96;

  const noteToMidi = (note, octave) => {
    const noteMap = { 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11 };
    return 12 + (octave * 12) + (noteMap[note] || 0);
  };

  let lastTick = 0;
  
  // Sort notes by start beat
  const sortedNotes = [...notes].sort((a, b) => a.startBeat - b.startBeat);

  sortedNotes.forEach((note) => {
    const startTick = Math.round(note.startBeat * ticksPerBeat);
    const duration = Math.round(note.duration * ticksPerBeat);
    const midiNote = noteToMidi(note.note, note.octave);
    const velocity = note.velocity || 80;

    // Delta time for note on
    const deltaOn = startTick - lastTick;
    events.push(...encodeVariableLength(deltaOn));
    events.push(0x90, midiNote, velocity); // Note on

    // Delta time for note off
    events.push(...encodeVariableLength(duration));
    events.push(0x80, midiNote, 0); // Note off

    lastTick = startTick + duration;
  });

  // End of track
  events.push(0x00, 0xFF, 0x2F, 0x00);

  const eventData = new Uint8Array(events);
  const trackLength = eventData.length;

  const trackHeader = new Uint8Array([
    0x4D, 0x54, 0x72, 0x6B, // MTrk
    (trackLength >> 24) & 0xFF,
    (trackLength >> 16) & 0xFF,
    (trackLength >> 8) & 0xFF,
    trackLength & 0xFF,
  ]);

  const track = new Uint8Array(trackHeader.length + eventData.length);
  track.set(trackHeader, 0);
  track.set(eventData, trackHeader.length);

  return track;
};

const encodeVariableLength = (value) => {
  const bytes = [];
  bytes.unshift(value & 0x7F);
  value >>= 7;
  while (value > 0) {
    bytes.unshift((value & 0x7F) | 0x80);
    value >>= 7;
  }
  return bytes;
};

// Generate guitar tablature as text
export const exportToTab = (composition) => {
  const { chords, tracks, settings } = composition;
  const leadNotes = tracks.leadGuitar?.notes || [];
  
  let tab = '';
  tab += `Title: ${composition.name}\n`;
  tab += `Key: ${settings.key} ${settings.mode}\n`;
  tab += `Tempo: ${settings.tempo} BPM\n`;
  tab += `Style: ${settings.genre}\n`;
  tab += `\n${'='.repeat(60)}\n\n`;

  // Chord progression
  tab += `CHORD PROGRESSION:\n`;
  tab += `-`.repeat(40) + '\n';
  
  let chordsPerLine = 0;
  chords.forEach((chord, index) => {
    tab += `| ${chord.name.padEnd(6)} `;
    chordsPerLine++;
    if (chordsPerLine >= 4) {
      tab += '|\n';
      chordsPerLine = 0;
    }
  });
  if (chordsPerLine > 0) tab += '|\n';
  
  tab += `\n${'='.repeat(60)}\n\n`;

  // Guitar tab representation
  tab += `LEAD GUITAR TAB:\n`;
  tab += `-`.repeat(40) + '\n';

  // Create tab lines (6 strings)
  const strings = ['e', 'B', 'G', 'D', 'A', 'E'];
  const beatsPerMeasure = 4;
  const totalBeats = settings.measures * beatsPerMeasure;
  
  // Group notes by measures
  for (let measure = 0; measure < settings.measures; measure++) {
    const measureStart = measure * beatsPerMeasure;
    const measureEnd = measureStart + beatsPerMeasure;
    
    const measureNotes = leadNotes.filter(
      (n) => n.startBeat >= measureStart && n.startBeat < measureEnd
    );

    tab += `\nMeasure ${measure + 1}:\n`;
    
    // Create tab grid for this measure
    const tabGrid = strings.map((s) => `${s}|`);
    const positions = 16; // 16 positions per measure (16th notes)
    
    for (let i = 0; i < positions; i++) {
      const beatPos = measureStart + (i / 4);
      const note = measureNotes.find(
        (n) => Math.abs(n.startBeat - beatPos) < 0.1
      );
      
      if (note && note.tabPosition) {
        tabGrid.forEach((line, stringIndex) => {
          if (6 - stringIndex === note.tabPosition.string) {
            tabGrid[stringIndex] += note.tabPosition.fret.toString().padEnd(2, '-');
          } else {
            tabGrid[stringIndex] += '--';
          }
        });
      } else {
        tabGrid.forEach((line, stringIndex) => {
          tabGrid[stringIndex] += '--';
        });
      }
    }
    
    tabGrid.forEach((line) => {
      tab += line + '|\n';
    });
  }

  return tab;
};

// Generate chord sheet
export const exportToChordSheet = (composition) => {
  const { chords, settings } = composition;
  
  let sheet = '';
  sheet += `╔${'═'.repeat(50)}╗\n`;
  sheet += `║ ${composition.name.padEnd(48)} ║\n`;
  sheet += `╠${'═'.repeat(50)}╣\n`;
  sheet += `║ Key: ${settings.key} ${settings.mode}`.padEnd(52) + `║\n`;
  sheet += `║ Tempo: ${settings.tempo} BPM`.padEnd(52) + `║\n`;
  sheet += `║ Style: ${settings.genre}`.padEnd(52) + `║\n`;
  sheet += `╚${'═'.repeat(50)}╝\n\n`;

  sheet += `CHORD PROGRESSION\n`;
  sheet += `${'─'.repeat(50)}\n\n`;

  // Display chords in a nice grid
  let row = '';
  chords.forEach((chord, index) => {
    row += `│ ${chord.name.padEnd(8)} `;
    if ((index + 1) % 4 === 0) {
      row += '│\n';
      sheet += row;
      row = '';
    }
  });
  if (row) {
    while (row.split('│').length <= 5) {
      row += '│          ';
    }
    row += '│\n';
    sheet += row;
  }

  sheet += `\n${'─'.repeat(50)}\n\n`;

  // Chord diagrams section
  sheet += `CHORD DIAGRAMS\n`;
  sheet += `${'─'.repeat(50)}\n\n`;

  const uniqueChords = [...new Set(chords.map((c) => c.name))];
  uniqueChords.forEach((chordName) => {
    sheet += `${chordName}:\n`;
    sheet += `  E A D G B e\n`;
    sheet += `  ┌─┬─┬─┬─┬─┐\n`;
    sheet += `  │ │ │ │ │ │  (see diagram)\n`;
    sheet += `  └─┴─┴─┴─┴─┘\n\n`;
  });

  // Lyrics section placeholder
  sheet += `${'─'.repeat(50)}\n`;
  sheet += `LYRICS / NOTES\n`;
  sheet += `${'─'.repeat(50)}\n\n`;
  sheet += `(Add your lyrics here)\n\n`;
  sheet += `Verse 1:\n`;
  sheet += `_________________________________\n`;
  sheet += `_________________________________\n\n`;
  sheet += `Chorus:\n`;
  sheet += `_________________________________\n`;
  sheet += `_________________________________\n\n`;

  return sheet;
};

// Download helper
export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  let blob;
  if (content instanceof Blob) {
    blob = content;
  } else {
    blob = new Blob([content], { type: mimeType });
  }
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export composition as JSON (for saving/loading)
export const exportToJSON = (composition) => {
  return JSON.stringify(composition, null, 2);
};

// Import composition from JSON
export const importFromJSON = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Failed to parse composition JSON:', e);
    return null;
  }
};
