// src/components/ActiveMission.jsx
import React, { useState } from 'react';

export default function ActiveMission({ activeMission, exitMission }) {
  // State to control the top-right dropdown briefing
  const [showBriefing, setShowBriefing] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* The background inherits the starry CSS from index.css.
        Later, the physical rocket and launch pad visuals will be rendered right here in the center.
      */}
      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' 
      }}>
        <h2 style={{ color: '#4da8da', letterSpacing: '2px' }}>FLIGHT SIMULATOR OFFLINE</h2>
        <p style={{ color: '#888' }}>[ Rocket visualizer and scratchpad will be installed here ]</p>
      </div>

      {/* TOP LEFT: Abort Button */}
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        <button 
          onClick={exitMission}
          style={{
            padding: '10px 20px', backgroundColor: 'transparent', color: '#ff4d4d',
            border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer',
            fontFamily: '"Space Mono", monospace', fontWeight: 'bold'
          }}
        >
          &lt; ABORT TO COMMAND
        </button>
      </div>

      {/* TOP RIGHT: The Drop-down Briefing UI */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', width: '350px', zIndex: 10 }}>
        <button 
          onClick={() => setShowBriefing(!showBriefing)}
          style={{
            width: '100%', padding: '10px', backgroundColor: showBriefing ? '#4da8da' : '#111', 
            color: showBriefing ? '#000' : '#4da8da', border: '1px solid #4da8da',
            borderRadius: showBriefing ? '4px 4px 0 0' : '4px', cursor: 'pointer',
            fontFamily: '"Space Mono", monospace', fontWeight: 'bold', textAlign: 'right'
          }}
        >
          {showBriefing ? '▲ CLOSE TELEMETRY' : '▼ VIEW MISSION BRIEF'}
        </button>

        {/* The Drop-down Panel */}
        <div style={{
          maxHeight: showBriefing ? '500px' : '0', overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out',
          backgroundColor: '#111', border: showBriefing ? '1px solid #4da8da' : 'none', 
          borderTop: 'none', borderRadius: '0 0 4px 4px',
          padding: showBriefing ? '20px' : '0 20px',
        }}>
          <h3 style={{ color: '#fff', marginTop: 0 }}>{activeMission.title}</h3>
          <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.4' }}>{activeMission.brief}</p>
          
          <hr style={{ borderColor: '#333', margin: '15px 0' }} />
          
          <div style={{ fontSize: '0.85rem' }}>
            <strong style={{ color: '#4da8da' }}>TARGET:</strong> {activeMission.targetApogee} km <br/>
            <strong style={{ color: '#4da8da' }}>WIND:</strong> {activeMission.crosswind === 0 ? 'STATIC' : `${activeMission.crosswind} m/s`} <br/>
            <strong style={{ color: '#4da8da' }}>PAYLOAD:</strong> {activeMission.payloadMass} kg <br/>
            <strong style={{ color: '#4da8da' }}>AVIONICS:</strong> {activeMission.avionicsMass > 0 ? `+${activeMission.avionicsMass}kg` : 'OFFLINE'}
          </div>
        </div>
      </div>

    </div>
  );
}