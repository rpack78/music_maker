// Audio Engine using Tone.js for synthesis and playback
import * as Tone from "tone";

class AudioEngine {
  constructor() {
    this.isInitialized = false;
    this.isPlaying = false;
    this.currentBeat = 0;
    this.tempo = 120;
    this.scheduledEvents = [];
    this.onBeatCallback = null;

    // Instruments
    this.instruments = {};
    this.masterVolume = null;
  }

  async initialize() {
    if (this.isInitialized) return;

    await Tone.start();

    // Master volume
    this.masterVolume = new Tone.Volume(-6).toDestination();

    // Lead Guitar - using synth with guitar-like envelope
    this.instruments.leadGuitar = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle8" },
      envelope: {
        attack: 0.02,
        decay: 0.3,
        sustain: 0.4,
        release: 0.8,
      },
    }).connect(this.masterVolume);
    this.instruments.leadGuitar.volume.value = -6;

    // Rhythm Guitar - slightly distorted sound
    this.instruments.rhythmGuitar = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.3,
        release: 0.5,
      },
    }).connect(this.masterVolume);
    this.instruments.rhythmGuitar.volume.value = -10;

    // Bass
    this.instruments.bass = new Tone.MonoSynth({
      oscillator: { type: "triangle" },
      envelope: {
        attack: 0.02,
        decay: 0.3,
        sustain: 0.6,
        release: 0.5,
      },
      filterEnvelope: {
        attack: 0.02,
        decay: 0.2,
        sustain: 0.5,
        release: 0.5,
        baseFrequency: 200,
        octaves: 2,
      },
    }).connect(this.masterVolume);
    this.instruments.bass.volume.value = -4;

    // Drums
    this.instruments.drums = {
      kick: new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 6,
        oscillator: { type: "sine" },
        envelope: {
          attack: 0.001,
          decay: 0.4,
          sustain: 0.01,
          release: 0.4,
        },
      }).connect(this.masterVolume),

      snare: new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: {
          attack: 0.001,
          decay: 0.2,
          sustain: 0,
          release: 0.2,
        },
      }).connect(this.masterVolume),

      hihat: new Tone.MetalSynth({
        frequency: 250,
        envelope: {
          attack: 0.001,
          decay: 0.1,
          release: 0.01,
        },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5,
      }).connect(this.masterVolume),
    };
    this.instruments.drums.kick.volume.value = -8;
    this.instruments.drums.snare.volume.value = -12;
    this.instruments.drums.hihat.volume.value = -20;

    // Keyboard
    this.instruments.keyboard = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: {
        attack: 0.05,
        decay: 0.3,
        sustain: 0.5,
        release: 0.8,
      },
    }).connect(this.masterVolume);
    this.instruments.keyboard.volume.value = -10;

    this.isInitialized = true;
  }

  setTempo(tempo) {
    this.tempo = tempo;
    Tone.Transport.bpm.value = tempo;
  }

  setTrackVolume(trackId, volume) {
    const instrument = this.instruments[trackId];
    if (instrument) {
      const dbValue = volume > 0 ? 20 * Math.log10(volume) : -Infinity;
      if (trackId === "drums") {
        Object.values(instrument).forEach((drum) => {
          drum.volume.value = dbValue - 8;
        });
      } else {
        instrument.volume.value = dbValue;
      }
    }
  }

  setTrackMuted(trackId, muted) {
    const instrument = this.instruments[trackId];
    if (instrument) {
      if (trackId === "drums") {
        Object.values(instrument).forEach((drum) => {
          drum.volume.mute = muted;
        });
      } else {
        instrument.volume.mute = muted;
      }
    }
  }

  scheduleComposition(composition, tracks, onBeat) {
    this.clearSchedule();
    this.onBeatCallback = onBeat;

    const { tempo, measures } = composition.settings;
    this.setTempo(tempo);

    const totalBeats = measures * 4;
    const beatDuration = 60 / tempo; // seconds per beat

    // Schedule beat callback
    const beatLoop = new Tone.Loop((time) => {
      const beat = Tone.Transport.position;
      const parts = beat.split(":");
      const bars = parseInt(parts[0], 10);
      const beats = parseInt(parts[1], 10);
      const currentBeat = bars * 4 + beats;

      Tone.Draw.schedule(() => {
        if (this.onBeatCallback) {
          this.onBeatCallback(currentBeat);
        }
      }, time);
    }, "4n");
    beatLoop.start(0);
    this.scheduledEvents.push(beatLoop);

    // Schedule each track
    Object.entries(tracks).forEach(([trackId, track]) => {
      if (track.muted) return;

      track.notes.forEach((note) => {
        const startTime = note.startBeat * beatDuration;
        const duration = note.duration * beatDuration;
        const velocity = (note.velocity || 80) / 127;

        if (trackId === "drums") {
          // Schedule drum hits
          const eventId = Tone.Transport.schedule((time) => {
            if (!track.muted) {
              const drum = this.instruments.drums[note.drum];
              if (drum) {
                if (note.drum === "kick") {
                  drum.triggerAttackRelease("C1", "8n", time, velocity);
                } else if (note.drum === "snare") {
                  drum.triggerAttackRelease("8n", time, velocity);
                } else if (note.drum === "hihat") {
                  drum.triggerAttackRelease("C6", "32n", time, velocity * 0.5);
                }
              }
            }
          }, startTime);
          this.scheduledEvents.push(eventId);
        } else if (trackId === "leadGuitar" || trackId === "keyboard") {
          // Schedule melodic notes
          const eventId = Tone.Transport.schedule((time) => {
            if (!track.muted) {
              const instrument = this.instruments[trackId];
              if (instrument) {
                const noteString = `${note.note}${note.octave}`;
                instrument.triggerAttackRelease(
                  noteString,
                  duration,
                  time,
                  velocity
                );
              }
            }
          }, startTime);
          this.scheduledEvents.push(eventId);
        } else if (trackId === "rhythmGuitar") {
          // Schedule rhythm guitar strums
          const eventId = Tone.Transport.schedule((time) => {
            if (!track.muted) {
              const instrument = this.instruments.rhythmGuitar;
              if (instrument && note.chordNotes) {
                const notes = note.chordNotes.map((n) => `${n}3`);
                instrument.triggerAttackRelease(
                  notes,
                  "8n",
                  time,
                  velocity * 0.7
                );
              }
            }
          }, startTime);
          this.scheduledEvents.push(eventId);
        } else if (trackId === "bass") {
          // Schedule bass notes
          const eventId = Tone.Transport.schedule((time) => {
            if (!track.muted) {
              const instrument = this.instruments.bass;
              if (instrument) {
                const noteString = `${note.note}${note.octave}`;
                instrument.triggerAttackRelease(
                  noteString,
                  duration,
                  time,
                  velocity
                );
              }
            }
          }, startTime);
          this.scheduledEvents.push(eventId);
        }
      });
    });

    // Schedule end of composition
    Tone.Transport.schedule(() => {
      this.stop();
    }, totalBeats * beatDuration);
  }

  clearSchedule() {
    this.scheduledEvents.forEach((event) => {
      if (typeof event === "number") {
        Tone.Transport.clear(event);
      } else if (event.dispose) {
        event.dispose();
      }
    });
    this.scheduledEvents = [];
  }

  async play() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    Tone.Transport.start();
    this.isPlaying = true;
  }

  pause() {
    Tone.Transport.pause();
    this.isPlaying = false;
  }

  stop() {
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    this.isPlaying = false;
    this.currentBeat = 0;

    if (this.onBeatCallback) {
      this.onBeatCallback(0);
    }
  }

  seek(beat) {
    const beatDuration = 60 / this.tempo;
    Tone.Transport.position = beat * beatDuration;
    this.currentBeat = beat;
  }

  // Preview a single note
  previewNote(note, octave, instrument = "leadGuitar") {
    if (!this.isInitialized) return;

    const inst = this.instruments[instrument];
    if (inst && inst.triggerAttackRelease) {
      inst.triggerAttackRelease(`${note}${octave}`, "8n");
    }
  }

  // Preview a chord
  previewChord(notes, instrument = "rhythmGuitar") {
    if (!this.isInitialized) return;

    const inst = this.instruments[instrument];
    if (inst && inst.triggerAttackRelease) {
      const noteStrings = notes.map((n) => `${n}3`);
      inst.triggerAttackRelease(noteStrings, "4n");
    }
  }

  dispose() {
    this.clearSchedule();

    Object.values(this.instruments).forEach((inst) => {
      if (inst.dispose) {
        inst.dispose();
      } else if (typeof inst === "object") {
        Object.values(inst).forEach((subInst) => {
          if (subInst.dispose) subInst.dispose();
        });
      }
    });

    if (this.masterVolume) {
      this.masterVolume.dispose();
    }

    this.isInitialized = false;
  }
}

// Singleton instance
const audioEngine = new AudioEngine();
export default audioEngine;
