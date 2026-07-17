// src/components/Scratchpad.jsx
import React, { useState } from 'react';

// --- THE PARTS CATALOG (Exported so ActiveMission can see it!) ---
export const CATALOG = {
  nose: [
    { id: 'n1', name: 'Aero Cone (Light)', mass: 1 },
    { id: 'n2', name: 'Heavy Nose (Stable)', mass: 3 }
  ],
  tube: [
    { id: 't1', name: 'Mk1 Sounding Tube', mass: 4, maxFuel: 40, height: 120 },
    { id: 't2', name: 'Mk2 Extended Tube', mass: 7, maxFuel: 80, height: 180 }
  ],
  engine: [
    // Added burnRate (kg of fuel consumed per second)
    { id: 'e1', name: 'Sparrow Solid Motor', mass: 2, isp: 180, burnRate: 5 },
    { id: 'e2', name: 'Hawk Hybrid Motor', mass: 5, isp: 240, burnRate: 8 }
  ]
};

// Notice we are now receiving the states as props!
export default function Scratchpad({ activeMission, nose, setNose, tube, setTube, engine, setEngine, fuelLoad, setFuelLoad }) {
  const [activeVar, setActiveVar] = useState(null);

  const g0 = 9.81; 
  const payload = activeMission?.payloadMass || 0;
  const avionics = activeMission?.avionicsMass || 0;
  const finMass = 1.5;

  const structureMass = nose.mass + tube.mass + engine.mass + finMass;
  const m0 = payload + avionics + structureMass + fuelLoad; 
  const mf = payload + avionics + structureMass;            
  
  const exhaustVelocity = engine.isp * g0;
  const deltaV = (m0 === 0 || mf === 0) ? 0 : (exhaustVelocity * Math.log(m0 / mf)).toFixed(0);

  const isM0Active = activeVar === 'fuel' || activeVar === 'structure';
  const isMfActive = activeVar === 'structure';

  if (fuelLoad > tube.maxFuel) setFuelLoad(tube.maxFuel);

  return (
    <div style={{ width: '450px', backgroundColor: 'rgba(17, 17, 17, 0.9)', border: '1px solid #4da8da', borderRadius: '8px', padding: '20px', backdropFilter: 'blur(10px)', boxShadow: '0 0 20px rgba(77, 168, 218, 0.2)' }}>
      
      <style>{`
        .math-var { padding: 2px 4px; border-radius: 3px; border: 1px solid transparent; transition: all 0.2s; }
        .math-var.active { border-color: yellow; color: yellow; animation: blinkVar 0.8s infinite alternate; }
        @keyframes blinkVar { 0% { opacity: 1; box-shadow: 0 0 8px rgba(255, 255, 0, 0.6); } 100% { opacity: 0.3; box-shadow: none; } }
      `}</style>

      <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '1.1rem' }}>
        🛠️ VEHICLE ASSEMBLY & TELEMETRY
      </h3>

      <div style={{ backgroundColor: '#0a0a0a', padding: '15px', borderRadius: '4px', marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.4rem', fontFamily: '"Cambria Math", "Times New Roman", serif', color: '#ccc', border: '1px solid #333' }}>
        <span style={{ fontStyle: 'italic' }}>Δv</span> &nbsp;=&nbsp; 
        <span style={{ fontStyle: 'italic' }}>I<sub>sp</sub></span> &nbsp;&middot;&nbsp; 
        <span style={{ fontStyle: 'italic' }}>g<sub>0</sub></span> &nbsp;&middot;&nbsp; ln
        <span style={{ fontSize: '2rem', fontWeight: '300', margin: '0 5px' }}>(</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span className={`math-var ${isM0Active ? 'active' : ''}`} style={{ fontStyle: 'italic', fontSize: '1.1rem' }}>m<sub>0</sub></span>
          <div style={{ width: '100%', height: '1.5px', backgroundColor: '#ccc', margin: '2px 0' }}></div>
          <span className={`math-var ${isMfActive ? 'active' : ''}`} style={{ fontStyle: 'italic', fontSize: '1.1rem' }}>m<sub>f</sub></span>
        </div>
        <span style={{ fontSize: '2rem', fontWeight: '300', margin: '0 5px' }}>)</span>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        
        {/* LEFT COLUMN: VISUALIZER */}
        <div style={{ width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: '10px' }}>
          <div style={{ width: '50px', height: '60px', background: 'linear-gradient(to right, #444, #ddd 40%, #888 70%, #222)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', marginBottom: '-1px' }}></div>
          <div style={{ width: '50px', height: `${tube.height}px`, background: 'linear-gradient(to right, #555, #eee 40%, #aaa 70%, #333)', position: 'relative', transition: 'height 0.3s ease' }}>
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${(fuelLoad / tube.maxFuel) * 100}%`, background: 'linear-gradient(to right, rgba(200, 50, 50, 0.6), rgba(255, 100, 100, 0.8) 40%, rgba(150, 20, 20, 0.6))', transition: 'height 0.2s ease', borderTop: fuelLoad > 0 ? '2px solid rgba(255,255,255,0.5)' : 'none' }}></div>
            <div style={{ position: 'absolute', bottom: '10px', left: '-25px', width: '100px', display: 'flex', justifyContent: 'space-between', zIndex: -1 }}>
              <div style={{ width: '25px', height: '40px', background: 'linear-gradient(to right, #2a6a8c, #4da8da)', clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
              <div style={{ width: '25px', height: '40px', background: 'linear-gradient(to left, #2a6a8c, #4da8da)', clipPath: 'polygon(0 100%, 100% 100%, 0 0)' }}></div>
            </div>
          </div>
          <div style={{ width: '34px', height: '20px', background: 'linear-gradient(to right, #111, #555 40%, #333 70%, #000)', clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0 100%)', marginTop: '-1px' }}></div>
        </div>

        {/* RIGHT COLUMN: CONTROLS */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div onMouseEnter={() => setActiveVar('structure')} onMouseLeave={() => setActiveVar(null)}>
            <label style={{ fontSize: '0.75rem', color: '#888' }}>NOSE CONE</label>
            <select value={nose.id} onChange={(e) => setNose(CATALOG.nose.find(n => n.id === e.target.value))} style={{ width: '100%', padding: '4px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', fontFamily: '"Space Mono"' }}>
              {CATALOG.nose.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
          </div>
          <div onMouseEnter={() => setActiveVar('structure')} onMouseLeave={() => setActiveVar(null)}>
            <label style={{ fontSize: '0.75rem', color: '#888' }}>FUSELAGE TUBE</label>
            <select value={tube.id} onChange={(e) => setTube(CATALOG.tube.find(t => t.id === e.target.value))} style={{ width: '100%', padding: '4px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', fontFamily: '"Space Mono"' }}>
              {CATALOG.tube.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div onMouseEnter={() => setActiveVar('structure')} onMouseLeave={() => setActiveVar(null)}>
            <label style={{ fontSize: '0.75rem', color: '#888' }}>ROCKET MOTOR</label>
            <select value={engine.id} onChange={(e) => setEngine(CATALOG.engine.find(eng => eng.id === e.target.value))} style={{ width: '100%', padding: '4px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', fontFamily: '"Space Mono"' }}>
              {CATALOG.engine.map(eng => <option key={eng.id} value={eng.id}>{eng.name} (Isp: {eng.isp})</option>)}
            </select>
          </div>
          <div style={{ marginTop: '10px' }} onMouseEnter={() => setActiveVar('fuel')} onMouseLeave={() => setActiveVar(null)}>
            <label style={{ fontSize: '0.8rem', color: '#ff4d4d' }}>PROPELLANT LOAD: {fuelLoad} kg</label>
            <input type="range" min="0" max={tube.maxFuel} step="1" value={fuelLoad} onChange={(e) => setFuelLoad(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
          </div>

          <div style={{ backgroundColor: '#000', padding: '10px', borderRadius: '4px', borderLeft: '4px solid #28a745', marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#888' }}>WET MASS (m0):</span> <span style={{ color: isM0Active ? 'yellow' : '#fff' }}>{m0} kg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
              <span style={{ color: '#888' }}>DRY MASS (mf):</span> <span style={{ color: isMfActive ? 'yellow' : '#fff' }}>{mf} kg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '5px' }}>
              <strong style={{ color: '#4da8da' }}>EST. DELTA-V:</strong> <strong style={{ color: '#4da8da' }}>{deltaV} m/s</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}