// src/components/MissionBriefing.jsx
import React from 'react';

export default function MissionBriefing({ activeMission }) {
  if (!activeMission) return null;

  return (
    <div style={{ 
      backgroundColor: '#111', 
      border: '1px solid #333', 
      borderRadius: '8px', 
      padding: '25px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
      height: '100%' // Ensures it fills the column nicely
    }}>
      <h2 style={{ color: '#4da8da', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        {activeMission.title}
      </h2>
      <p style={{ lineHeight: '1.6', fontSize: '1.05rem', color: '#ccc' }}>
        {activeMission.brief}
      </p>
      
      <div style={{ 
        marginTop: '25px', 
        padding: '15px', 
        backgroundColor: '#0a0a0a', 
        borderLeft: '4px solid #4da8da',
        fontSize: '0.95rem'
      }}>
        <strong style={{ color: '#4da8da' }}>[ FLIGHT TELEMETRY TARGETS ]</strong><br/><br/>
        <span style={{ color: '#888' }}>TARGET APOGEE:</span> {activeMission.targetApogee} km<br/>
        <span style={{ color: '#888' }}>CROSSWINDS:</span> {activeMission.crosswind === 0 ? 'NONE (STATIC)' : `${activeMission.crosswind} m/s`}<br/>
        <span style={{ color: '#888' }}>PAYLOAD MASS:</span> {activeMission.payloadMass === 0 ? 'NONE' : `${activeMission.payloadMass} kg`}<br/>
        <span style={{ color: '#888' }}>AVIONICS:</span> {activeMission.avionicsMass === 0 ? 'OFFLINE' : `ACTIVE (+${activeMission.avionicsMass} kg)`}
      </div>
    </div>
  );
}