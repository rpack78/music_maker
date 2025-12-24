import React, { useState, useCallback, useEffect, useRef } from 'react';
import GenerationControls from './components/GenerationControls';
import PianoRoll from './components/PianoRoll';
import ChordProgressionEditor from './components/ChordProgressionEditor';
import TransportControls from './components/TransportControls';
import TrackMixer from './components/TrackMixer';
import ExportPanel from './components/ExportPanel';
import { generateComposition, regenerateTrack } from './utils/musicGenerator';
import audioEngine from './utils/audioEngine';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const DEFAULT_SETTINGS = {
  key: 'C',
  mode: 'major',
  genre: 'rock',
  tempo: 120,
  measures: 8,
  instruments: {
    leadGuitar: true,
    rhythmGuitar: true,
    bass: true,
    drums: true,
    keyboard: false,
  },
};

function App() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [composition, setComposition] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [soloTrack, setSoloTrack] = useState(null);
  const [activeView, setActiveView] = useState('pianoRoll');
  
  const isInitializedRef = useRef(false);

  // Initialize audio engine on first user interaction
  const initializeAudio = useCallback(async () => {
    if (!isInitializedRef.current) {
      await audioEngine.initialize();
      isInitializedRef.current = true;
    }
  }, []);

  // Generate new composition
  const handleGenerate = useCallback(async () => {
    await initializeAudio();
    setIsGenerating(true);
    
    // Small delay for UX feedback
    setTimeout(() => {
      const newComposition = generateComposition(settings);
      setComposition(newComposition);
      setIsGenerating(false);
      setCurrentBeat(0);
      audioEngine.stop();
    }, 300);
  }, [settings, initializeAudio]);

  // Playback controls
  const handlePlay = useCallback(async () => {
    if (!composition) return;
    
    await initializeAudio();
    
    // Schedule composition
    audioEngine.scheduleComposition(composition, composition.tracks, (beat) => {
      setCurrentBeat(beat);
    });
    
    audioEngine.play();
    setIsPlaying(true);
  }, [composition, initializeAudio]);

  const handlePause = useCallback(() => {
    audioEngine.pause();
    setIsPlaying(false);
  }, []);

  const handleStop = useCallback(() => {
    audioEngine.stop();
    setIsPlaying(false);
    setCurrentBeat(0);
  }, []);

  const handleSeek = useCallback((beat) => {
    audioEngine.seek(beat);
    setCurrentBeat(beat);
  }, []);

  const handleTempoChange = useCallback((tempo) => {
    setSettings((prev) => ({ ...prev, tempo }));
    if (composition) {
      setComposition((prev) => ({
        ...prev,
        settings: { ...prev.settings, tempo },
      }));
    }
    audioEngine.setTempo(tempo);
  }, [composition]);

  // Track controls
  const handleTrackMute = useCallback((trackId) => {
    setComposition((prev) => {
      if (!prev?.tracks[trackId]) return prev;
      const newMuted = !prev.tracks[trackId].muted;
      audioEngine.setTrackMuted(trackId, newMuted);
      return {
        ...prev,
        tracks: {
          ...prev.tracks,
          [trackId]: { ...prev.tracks[trackId], muted: newMuted },
        },
      };
    });
  }, []);

  const handleTrackVolume = useCallback((trackId, volume) => {
    setComposition((prev) => {
      if (!prev?.tracks[trackId]) return prev;
      audioEngine.setTrackVolume(trackId, volume);
      return {
        ...prev,
        tracks: {
          ...prev.tracks,
          [trackId]: { ...prev.tracks[trackId], volume },
        },
      };
    });
  }, []);

  const handleTrackSolo = useCallback((trackId) => {
    setSoloTrack((prev) => {
      const newSolo = prev === trackId ? null : trackId;
      
      // Mute/unmute tracks based on solo
      if (composition) {
        Object.keys(composition.tracks).forEach((id) => {
          const shouldMute = newSolo && id !== newSolo;
          audioEngine.setTrackMuted(id, shouldMute);
        });
      }
      
      return newSolo;
    });
  }, [composition]);

  const handleRegenerateTrack = useCallback((trackId) => {
    if (!composition) return;
    
    const newNotes = regenerateTrack(composition, trackId);
    setComposition((prev) => ({
      ...prev,
      tracks: {
        ...prev.tracks,
        [trackId]: { ...prev.tracks[trackId], notes: newNotes },
      },
    }));
  }, [composition]);

  // Note editing
  const handleNoteChange = useCallback((noteId, newNote) => {
    setComposition((prev) => {
      const trackId = 'leadGuitar';
      if (!prev?.tracks[trackId]) return prev;
      
      return {
        ...prev,
        tracks: {
          ...prev.tracks,
          [trackId]: {
            ...prev.tracks[trackId],
            notes: prev.tracks[trackId].notes.map((n) =>
              n.id === noteId ? { ...n, ...newNote } : n
            ),
          },
        },
      };
    });
  }, []);

  const handleNoteAdd = useCallback((noteData) => {
    setComposition((prev) => {
      const trackId = 'leadGuitar';
      if (!prev?.tracks[trackId]) return prev;
      
      return {
        ...prev,
        tracks: {
          ...prev.tracks,
          [trackId]: {
            ...prev.tracks[trackId],
            notes: [...prev.tracks[trackId].notes, { ...noteData, id: uuidv4() }],
          },
        },
      };
    });
  }, []);

  const handleNoteDelete = useCallback((noteId) => {
    setComposition((prev) => {
      const trackId = 'leadGuitar';
      if (!prev?.tracks[trackId]) return prev;
      
      return {
        ...prev,
        tracks: {
          ...prev.tracks,
          [trackId]: {
            ...prev.tracks[trackId],
            notes: prev.tracks[trackId].notes.filter((n) => n.id !== noteId),
          },
        },
      };
    });
  }, []);

  // Chord editing
  const handleChordChange = useCallback((chordId, newChord) => {
    setComposition((prev) => {
      if (!prev) return prev;
      
      const updatedChords = prev.chords.map((c) =>
        c.id === chordId ? { ...c, ...newChord } : c
      );
      
      // Regenerate rhythm guitar track since it depends on chords
      const rhythmGuitarNotes = prev.tracks.rhythmGuitar 
        ? regenerateTrack({ ...prev, chords: updatedChords }, 'rhythmGuitar')
        : prev.tracks.rhythmGuitar?.notes || [];
      
      const updatedComposition = {
        ...prev,
        chords: updatedChords,
        tracks: {
          ...prev.tracks,
          rhythmGuitar: prev.tracks.rhythmGuitar ? {
            ...prev.tracks.rhythmGuitar,
            notes: rhythmGuitarNotes,
          } : prev.tracks.rhythmGuitar,
        },
      };
      
      // If playing, stop, reschedule, and restart with updated composition
      if (isPlaying) {
        const currentPosition = currentBeat;
        audioEngine.stop();
        audioEngine.scheduleComposition(updatedComposition, updatedComposition.tracks, (beat) => {
          setCurrentBeat(beat);
        });
        // Seek to current position and restart
        audioEngine.seek(currentPosition);
        audioEngine.play();
      }
      
      return updatedComposition;
    });
  }, [isPlaying, currentBeat]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioEngine.dispose();
    };
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">🎸</span>
          <h1>Music Maker</h1>
        </div>
        <p className="tagline">Create original compositions for guitar learning</p>
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <GenerationControls
            settings={settings}
            onSettingsChange={setSettings}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
          
          <TrackMixer
            tracks={composition?.tracks}
            onTrackMute={handleTrackMute}
            onTrackVolume={handleTrackVolume}
            onTrackSolo={handleTrackSolo}
            onRegenerateTrack={handleRegenerateTrack}
            soloTrack={soloTrack}
          />
          
          <ExportPanel composition={composition} />
        </aside>

        <section className="main-content">
          {composition && (
            <TransportControls
              isPlaying={isPlaying}
              currentBeat={currentBeat}
              tempo={composition.settings.tempo}
              measures={composition.settings.measures}
              onPlay={handlePlay}
              onPause={handlePause}
              onStop={handleStop}
              onTempoChange={handleTempoChange}
              onSeek={handleSeek}
            />
          )}

          <div className="view-tabs">
            <button
              className={`view-tab ${activeView === 'pianoRoll' ? 'active' : ''}`}
              onClick={() => setActiveView('pianoRoll')}
            >
              🎹 Piano Roll
            </button>
            <button
              className={`view-tab ${activeView === 'chords' ? 'active' : ''}`}
              onClick={() => setActiveView('chords')}
            >
              🎸 Chord Chart
            </button>
          </div>

          {!composition ? (
            <div className="empty-state">
              <div className="empty-state-content">
                <span className="empty-icon">🎼</span>
                <h2>Ready to Create Music</h2>
                <p>Select your key, genre, and instruments, then click Generate to create an original composition.</p>
                <button className="get-started-btn" onClick={handleGenerate}>
                  ✨ Generate Your First Song
                </button>
              </div>
            </div>
          ) : (
            <div className="editor-area">
              {activeView === 'pianoRoll' && (
                <PianoRoll
                  notes={composition.tracks.leadGuitar?.notes || []}
                  measures={composition.settings.measures}
                  currentBeat={currentBeat}
                  isPlaying={isPlaying}
                  onNoteChange={handleNoteChange}
                  onNoteAdd={handleNoteAdd}
                  onNoteDelete={handleNoteDelete}
                  musicKey={composition.settings.key}
                  mode={composition.settings.mode}
                />
              )}
              
              {activeView === 'chords' && (
                <ChordProgressionEditor
                  chords={composition.chords}
                  musicKey={composition.settings.key}
                  mode={composition.settings.mode}
                  onChordChange={handleChordChange}
                  currentMeasure={Math.floor(currentBeat / 4)}
                  isPlaying={isPlaying}
                />
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>🎵 Music Maker • No AI API needed - runs entirely in your browser</p>
      </footer>
    </div>
  );
}

export default App;
