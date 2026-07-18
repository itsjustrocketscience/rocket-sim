// src/components/MissionBriefing.jsx
import React from 'react';

export default function MissionBriefing({ activeMission }) {
  if (!activeMission) return null;

  return (
    <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)', height: '100%' }}>
      <h2 style={{ color: '#4da8da', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '10px' }}>{activeMission.title}</h2>
      <p style={{ lineHeight: '1.6', fontSize: '1.05rem', color: '#ccc' }}>{activeMission.brief}</p>
      
      <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#0a0a0a', borderLeft: '4px solid #4da8da', fontSize: '0.95rem' }}>
        <strong style={{ color: '#4da8da' }}>[ FLIGHT TELEMETRY TARGETS ]</strong><br/><br/>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div><span style={{ color: '#888' }}>TARGET APOGEE:</span> {activeMission.targetApogee} m {activeMission.maxApogee && `(Max: ${activeMission.maxApogee}m)`}</div>
          <div><span style={{ color: '#888' }}>CROSSWINDS:</span> {activeMission.crosswind === 0 ? 'NONE' : `${activeMission.crosswind} m/s`}</div>
          <div><span style={{ color: '#888' }}>PAYLOAD MASS:</span> {activeMission.payloadMass === 0 ? 'NONE' : `${activeMission.payloadMass} kg`}</div>
          <div><span style={{ color: '#888' }}>AVIONICS:</span> {activeMission.avionicsMass === 0 ? 'OFFLINE' : `+${activeMission.avionicsMass} kg`}</div>
          {activeMission.maxG && <div><span style={{ color: '#888' }}>G-FORCE LIMIT:</span> <span style={{ color: '#ff4d4d' }}>{activeMission.maxG} G</span></div>}
        </div>
      </div>

      {/* THE BONUS HUD */}
      {activeMission.targetDeltaV && (
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: 'rgba(255, 193, 7, 0.1)', border: '1px solid rgba(255, 193, 7, 0.5)', borderRadius: '4px' }}>
          <strong style={{ color: '#ffc107', display: 'block', marginBottom: '5px' }}>⭐ OPTIONAL: EFFICIENCY BONUS</strong>
          <span style={{ color: '#ccc', fontSize: '0.9rem' }}>
            Complete the mission utilizing a Delta-V budget of <strong style={{ color: '#fff' }}>{activeMission.targetDeltaV} m/s</strong> or less.
          </span>
        </div>
      )}
    </div>
  );
}