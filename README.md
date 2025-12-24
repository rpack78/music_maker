# 🎸 Music Maker - A Random Music Generator

An interactive web-based music generation and editing tool that creates original musical compositions for guitar players to learn and re-record. Built with React and Tone.js, this tool runs entirely in your browser—no AI API needed! It uses music theory rules and intelligent randomization to generate authentic-sounding compositions across multiple genres.

## ✨ What Makes This Special

- **🎵 100% Browser-Based**: No server required, no API calls, completely offline-capable
- **🎼 Music Theory Driven**: Uses real music theory rules (chord progressions, scale degrees, voice leading)
- **🎸 Guitar-Friendly**: Generates guitar-friendly voicings and fretboard positions
- **🎨 Fully Editable**: Complete control over every note, chord, and rhythm
- **🎹 Multi-Instrument**: Create full arrangements with guitar, bass, drums, and keys

## 🎯 Core Features

### Music Generation Parameters

- **🎼 Key Selection**: Choose from any musical key (C, D, E, F, G, A, B) with major/minor modes
- **🎸 Genre/Style Selection**: Rock, Blues, Jazz, Pop, Country, Metal, Folk, and more
- **🎹 Instrument Selection**: Multi-select and toggle between:
  - Lead Guitar
  - Rhythm Guitar
  - Bass
  - Drums
  - Keyboard/Piano

### Interactive Music Visualization

- **📊 Piano Roll/MIDI Editor**: Visual representation of notes over time with click-and-drag editing
- **🎵 Chord Chart View**: Display chord progressions with chord diagrams
- **📝 Tab View**: Guitar tablature for guitar parts
- **🎼 Staff Notation** (optional): Traditional sheet music view

### Advanced Editing Tools

- **🎹 Chord Progression Editor**:

  - Click to select/change chords
  - Drag to reorder chord sequences
  - Add/remove measures
  - Smart chord substitution suggestions based on music theory

- **🎶 Melody Editor**:

  - Click and drag notes to change pitch
  - Adjust note duration
  - Add/delete notes
  - Quantize options (snap to grid)

- **🥁 Pattern Editor**:
  - Edit drum patterns
  - Modify bass lines
  - Adjust strumming patterns

### Transport & Playback Controls

- ▶️ Play, pause, stop controls
- 🔄 Loop sections for practice
- ⏱️ Tempo adjustment
- 🎚️ Real-time audio feedback

### Track Mixer

- 🎚️ Individual track volume control
- 🔊 Panning controls
- 🎛️ Effects and processing
- 🔇 Toggle instruments on/off

### Export Options

- **🎵 Audio Export**: WAV/MP3 of the full arrangement
- **💾 MIDI Export**: Standard MIDI files for use in DAWs
- **🎸 Guitar Tab Export**: Text-based or PDF guitar tablature
- **📄 Chord Sheet**: Printable chord charts with lyrics section

### Project Management

- 💾 Save/load projects
- 📁 Name and organize compositions
- 🕐 Version history (save multiple iterations)

## 🛠️ Technologies

- **⚛️ React 19**: Modern UI framework with responsive design
- **🎵 Tone.js**: Web Audio framework for synthesis, effects, and playback
- **🎨 Web Audio API**: Browser-based audio synthesis
- **📦 React Scripts**: Build tooling and development server
- **🎼 Custom Music Theory Engine**: Algorithmic composition based on real music theory rules

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd music_maker
```

2. Install dependencies:

```bash
npm install
```

## 🚀 Usage

### Development Mode

Start the development server:

```bash
npm start
```

The application will open in your browser at [http://localhost:3000](http://localhost:3000).

### Building for Production

Create an optimized production build:

```bash
npm build
```

The build files will be output to the `build/` directory.

### Running Tests

Run the test suite:

```bash
npm test
```

## 📂 Project Structure

```
music_maker/
├── public/           # Static files
│   └── index.html
├── src/
│   ├── App.jsx       # Main application component
│   ├── index.js      # Application entry point
│   ├── components/   # React components
│   │   ├── ChordProgressionEditor/
│   │   ├── ExportPanel/
│   │   ├── GenerationControls/
│   │   ├── PianoRoll/
│   │   ├── TrackMixer/
│   │   └── TransportControls/
│   └── utils/        # Utility modules
│       ├── audioEngine.js      # Audio playback and synthesis
│       ├── exportUtils.js      # Audio export functionality
│       ├── musicGenerator.js   # Algorithmic composition
│       └── musicTheory.js      # Music theory utilities
└── package.json
```

## 🎼 How It Works

This app uses **algorithmic composition** based on real music theory—no AI APIs required!

### The Generation Engine

1. **🎵 Chord Progressions**: Each genre has predefined chord progression rules

   - Rock often uses I-IV-V-vi progressions
   - Blues follows 12-bar blues patterns
   - Jazz uses ii-V-I and extended harmonies

2. **🎶 Melody Generation**: Creates melodies using scale degrees that fit the underlying chords

   - Respects the key signature
   - Uses appropriate scales for each genre
   - Follows voice leading principles

3. **🥁 Rhythm Patterns**: Built from predefined templates matched to each style

   - Genre-specific drum patterns
   - Strumming patterns for guitars
   - Walking bass lines for jazz

4. **🎹 Audio Synthesis**: Tone.js brings it all to life with real-time playback

### Workflow

1. 🎯 **Select** key, style, and instruments
2. ⚡ **Generate** initial composition with one click
3. 🎧 **Listen** to the playback
4. ✏️ **Edit** chords by clicking on the progression timeline
5. 🎹 **Modify** melody by dragging notes in the piano roll
6. 🔊 **Toggle** instruments on/off to focus on specific parts
7. 🔄 **Regenerate** specific sections if desired
8. 💾 **Export** when satisfied with your composition

## 💻 Development

The application uses Create React App for development and build tooling. Key modules:

- **🎵 audioEngine.js**: Manages Tone.js audio context, synthesis, and playback
- **🎼 musicGenerator.js**: Implements algorithmic composition algorithms
  - Chord progression rules by genre
  - Melody generation using scale degrees
  - Rhythm pattern libraries
- **📚 musicTheory.js**: Provides music theory utilities
  - Scales, chords, and progressions
  - Voice leading rules
  - Guitar-friendly voicings
- **💾 exportUtils.js**: Handles audio rendering and export to various formats

### 🎨 UI/UX Features

- ✨ Clean, uncluttered interface
- 🎧 Real-time audio feedback when editing
- 👁️ Visual feedback for what's currently playing
- ↩️ Undo/redo functionality
- ⌨️ Keyboard shortcuts for common actions
- 📱 Mobile-responsive (playback and basic editing)

## 🌐 Browser Compatibility

Works in all modern browsers with Web Audio API support:

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🎸 For Guitar Players

This tool is specifically designed with guitarists in mind:

- 🎸 **Guitar-friendly chord voicings** that are actually playable
- 📝 **Tab export** for easy learning
- 🎵 **Chord diagrams** showing finger positions
- 🔄 **Loop sections** for practice
- ⏱️ **Adjustable tempo** to learn at your own pace
- 💪 **Difficulty ratings** for generated pieces (coming soon)

## 🚀 Future Enhancements

- 🤖 AI-suggested variations on generated sections
- 🤝 Collaboration and sharing capabilities
- 🎚️ Integration with guitar tuning tools
- 🎯 Practice mode with enhanced looping
- 🎨 Style mixing (blend multiple genres)
- 📊 Advanced analytics for compositions

## 📄 License

MIT

---

**🎵 Made with music theory and ❤️ for guitarists**
