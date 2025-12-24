import React from 'react';
import { exportToMidi, exportToTab, exportToChordSheet, exportToJSON, downloadFile } from '../../utils/exportUtils';
import './ExportPanel.css';

const ExportPanel = ({ composition }) => {
  if (!composition) {
    return (
      <div className="export-panel disabled">
        <h3>📤 Export</h3>
        <p>Generate a composition first to enable exports</p>
      </div>
    );
  }

  const handleExportMidi = () => {
    const midiBlob = exportToMidi(composition);
    const filename = `${composition.name.replace(/\s+/g, '_')}.mid`;
    downloadFile(midiBlob, filename, 'audio/midi');
  };

  const handleExportTab = () => {
    const tab = exportToTab(composition);
    const filename = `${composition.name.replace(/\s+/g, '_')}_tab.txt`;
    downloadFile(tab, filename, 'text/plain');
  };

  const handleExportChordSheet = () => {
    const sheet = exportToChordSheet(composition);
    const filename = `${composition.name.replace(/\s+/g, '_')}_chords.txt`;
    downloadFile(sheet, filename, 'text/plain');
  };

  const handleExportJSON = () => {
    const json = exportToJSON(composition);
    const filename = `${composition.name.replace(/\s+/g, '_')}.json`;
    downloadFile(json, filename, 'application/json');
  };

  return (
    <div className="export-panel">
      <h3>📤 Export</h3>
      
      <div className="export-buttons">
        <button className="export-btn midi" onClick={handleExportMidi}>
          <span className="export-icon">🎹</span>
          <span className="export-label">MIDI File</span>
          <span className="export-desc">For DAWs</span>
        </button>

        <button className="export-btn tab" onClick={handleExportTab}>
          <span className="export-icon">🎸</span>
          <span className="export-label">Guitar Tab</span>
          <span className="export-desc">Text format</span>
        </button>

        <button className="export-btn chords" onClick={handleExportChordSheet}>
          <span className="export-icon">📄</span>
          <span className="export-label">Chord Sheet</span>
          <span className="export-desc">Printable</span>
        </button>

        <button className="export-btn json" onClick={handleExportJSON}>
          <span className="export-icon">💾</span>
          <span className="export-label">Save Project</span>
          <span className="export-desc">JSON format</span>
        </button>
      </div>
    </div>
  );
};

export default ExportPanel;
