// src/components/Scratchpad.jsx
import React, { useState } from 'react';

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
    { id: 'e1', name: 'Sparrow Solid Motor', mass: 2, isp: 180, burnRate: 0.8 },
    { id: 'e2', name: 'Hawk Hybrid Motor', mass: 5, isp: 240, burnRate: 1.5 }
  ]
};

export function Rocket2D({ tube, nose, engine, finOffset, finCount, flightState }) {
  const isHeavyNose = nose.id === 'n2';
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.6))', zIndex: 10 }}>
      {/* NOSE CONE */}
      <div style={{ 
        width: '40px', height: isHeavyNose ? '40px' : '65px', 
        background: 'linear-gradient(to right, #999, #eee, #999)',
        clipPath: isHeavyNose ? 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)' : 'polygon(50% 0%, 0% 100%, 100% 100%)',
        marginBottom: '-1px'
      }} />

      {/* FUSELAGE TUBE */}
      <div style={{ 
        width: '40px', height: `${tube.height}px`, 
        background: 'linear-gradient(to right, #333, #666, #333)',
        position: 'relative', zIndex: 5
      }}>
        {finCount >= 6 && (
          <>
            <div style={{ position: 'absolute', bottom: `${finOffset + 5}px`, left: '-12px', width: '15px', height: '32px', background: 'linear-gradient(to right, #12405c, #1a5b82)', clipPath: 'polygon(0 60%, 100% 0, 100% 100%, 0 100%)', zIndex: -1, transition: 'bottom 0.1s linear' }} />
            <div style={{ position: 'absolute', bottom: `${finOffset + 5}px`, right: '-12px', width: '15px', height: '32px', background: 'linear-gradient(to left, #12405c, #1a5b82)', clipPath: 'polygon(0 0, 100% 60%, 100% 100%, 0 100%)', zIndex: -1, transition: 'bottom 0.1s linear' }} />
          </>
        )}
        <div style={{ position: 'absolute', bottom: `${finOffset}px`, left: '-20px', width: '20px', height: '40px', background: 'linear-gradient(to right, #2b7aab, #4da8da)', clipPath: 'polygon(0 60%, 100% 0, 100% 100%, 0 100%)', transition: 'bottom 0.1s linear', zIndex: 1 }} />
        <div style={{ position: 'absolute', bottom: `${finOffset}px`, right: '-20px', width: '20px', height: '40px', background: 'linear-gradient(to left, #2b7aab, #4da8da)', clipPath: 'polygon(0 0, 100% 60%, 100% 100%, 0 100%)', transition: 'bottom 0.1s linear', zIndex: 1 }} />
        {finCount >= 3 && (
           <div style={{ position: 'absolute', bottom: `${finOffset}px`, left: '50%', transform: 'translateX(-50%)', width: '4px', height: '40px', background: 'linear-gradient(to right, #1a5b82, #2b7aab)', clipPath: 'polygon(50% 0, 100% 100%, 0 100%)', transition: 'bottom 0.1s linear', zIndex: 6 }} />
        )}
      </div>

      {/* ENGINE NOZZLE & PLUME WRAPPER */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', marginTop: '-1px', zIndex: 4 }}>
        
        {/* THE NOZZLE */}
        <div style={{ width: '24px', height: engine.id === 'e1' ? '15px' : '25px', background: '#111', clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0 100%)' }} />
        
        {/* EXHAUST FLAMES & SMOKE (Escaped from the clip-path!) */}
        {flightState === 'POWERED' && (
          <div style={{ position: 'absolute', top: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: -1 }}>
            <div style={{ width: '18px', height: '70px', background: 'linear-gradient(to bottom, #ffffff, #ffea00, #ff4d4d, transparent)', clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 50% 80%, 0 100%)', animation: 'flicker 0.05s infinite alternate' }} />
            <div style={{ position: 'absolute', top: '40px', width: '30px', height: '30px', background: 'rgba(150, 150, 150, 0.4)', borderRadius: '50%', animation: 'smoke 0.4s infinite linear' }} />
            <div style={{ position: 'absolute', top: '50px', width: '40px', height: '40px', background: 'rgba(100, 100, 100, 0.2)', borderRadius: '50%', animation: 'smoke 0.4s infinite linear 0.2s' }} />
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes flicker { 0% { transform: scaleY(1); opacity: 0.9; } 100% { transform: scaleY(1.2); opacity: 1; } }
        @keyframes smoke { 0% { transform: scale(0.5) translateY(0); opacity: 1; } 100% { transform: scale(2.5) translateY(30px); opacity: 0; } }
      `}</style>
    </div>
  );
}

export default function Scratchpad({ activeMission, nose, setNose, tube, setTube, engine, setEngine, fuelLoad, setFuelLoad, finCount, setFinCount, finOffset, setFinOffset }) {
  const [activeVar, setActiveVar] = useState(null);

  const g0 = 9.81; 
  const payload = activeMission?.payloadMass || 0;
  const avionics = activeMission?.avionicsMass || 0;
  
  const finTotalMass = finCount * 0.375; 
  const structureMass = nose.mass + tube.mass + engine.mass + finTotalMass;
  const m0 = payload + avionics + structureMass + fuelLoad; 
  const mf = payload + avionics + structureMass;            
  
  const exhaustVelocity = engine.isp * g0;
  const deltaV = (m0 === 0 || mf === 0) ? 0 : Number((exhaustVelocity * Math.log(m0 / mf)).toFixed(0));
  
  const efficiency = 0.45; 
  const predictedApogee = deltaV > 0 ? ((Math.pow(deltaV, 2) / (2 * g0)) * efficiency).toFixed(0) : 0;

  const budget = activeMission?.targetDeltaV || Infinity;
  const earnedBonus = budget !== Infinity && deltaV <= budget;

  const isM0Active = activeVar === 'fuel' || activeVar === 'structure' || activeVar === 'engine';
  const isMfActive = activeVar === 'structure' || activeVar === 'engine';

  return (
    <div style={{ width: '450px', backgroundColor: 'rgba(17, 17, 17, 0.95)', border: '1px solid #4da8da', borderRadius: '8px', padding: '20px', backdropFilter: 'blur(10px)', boxShadow: '0 0 20px rgba(77, 168, 218, 0.2)' }}>
      <style>{`
        .math-var { padding: 4px 6px; border-radius: 4px; border: 1px solid transparent; transition: all 0.2s; display: inline-block; } 
        .math-var.active { border-color: yellow; color: yellow !important; text-shadow: 0 0 8px rgba(255, 255, 0, 0.8); } 
      `}</style>
      
      <h3 style={{ margin: '0 0 15px 0', color: '#fff', borderBottom: '1px solid #333', paddingBottom: '10px', fontSize: '1.1rem' }}>🛠️ VEHICLE ASSEMBLY</h3>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={{ flex: 1, backgroundColor: '#0a0a0a', padding: '15px 10px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', fontFamily: '"Cambria Math", "Times New Roman", serif', color: '#ccc', border: '1px solid #333' }}>
          <span style={{ fontStyle: 'italic' }}>Δv</span> &nbsp;=&nbsp; 
          <span className={`math-var ${activeVar === 'engine' ? 'active' : ''}`} style={{ fontStyle: 'italic' }}>I<sub>sp</sub></span> &nbsp;&middot;&nbsp; 
          <span style={{ fontStyle: 'italic' }}>g<sub>0</sub></span> &nbsp;ln
          <span style={{ fontSize: '2rem', fontWeight: '300', margin: '0 2px' }}>(</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className={`math-var ${isM0Active ? 'active' : ''}`} style={{ fontStyle: 'italic', fontSize: '1rem', padding: '0 4px' }}>m<sub>0</sub></span>
            <div style={{ width: '100%', height: '1.5px', backgroundColor: '#ccc', margin: '2px 0' }}></div>
            <span className={`math-var ${isMfActive ? 'active' : ''}`} style={{ fontStyle: 'italic', fontSize: '1rem', padding: '0 4px' }}>m<sub>f</sub></span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: '300', margin: '0 2px' }}>)</span>
        </div>
        
        <div style={{ flex: 1, backgroundColor: '#0a0a0a', padding: '15px 5px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem', fontFamily: '"Cambria Math", "Times New Roman", serif', color: '#ccc', border: '1px solid #333' }}>
          <span style={{ fontStyle: 'italic', color: '#ffc107' }}>h<sub>max</sub></span> &nbsp;≈&nbsp;
          <span style={{ fontStyle: 'italic', color: '#28a745' }}>η</span> &nbsp;&middot;&nbsp;
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 5px' }}>
            <span style={{ fontStyle: 'italic' }}>v<sup>2</sup></span>
            <div style={{ width: '100%', height: '1.5px', backgroundColor: '#ccc', margin: '2px 0' }}></div>
            <span style={{ fontStyle: 'italic' }}>2g</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ width: '150px', minHeight: '320px', backgroundColor: '#0a0f18', borderRadius: '4px', border: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '180px', backgroundColor: '#444', borderLeft: '1px solid #666', zIndex: 1 }} />
          
          {/* Because this flex container justifies to flex-end, Rocket2D natively stacks on top of the pad! */}
          <Rocket2D tube={tube} nose={nose} engine={engine} finOffset={finOffset} finCount={finCount} />
          
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 12 }}>
            <div style={{ width: '60px', height: '20px', border: '2px solid #555', borderBottom: 'none', backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #444 5px, #444 7px)' }} />
            <div style={{ width: '100%', height: '20px', background: '#333', borderTop: '2px solid #555' }} />
          </div>
        </div>

        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div onMouseEnter={() => setActiveVar('structure')} onMouseLeave={() => setActiveVar(null)}>
            <label style={{ fontSize: '0.75rem', color: '#888', display: 'flex', justifyContent: 'space-between' }}><span>FIN COUNT (Physics)</span> <span>{finCount}</span></label>
            <input type="range" min="3" max="8" step="1" value={finCount} onChange={(e) => setFinCount(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
          </div>

          <div onMouseEnter={() => setActiveVar('structure')} onMouseLeave={() => setActiveVar(null)}>
            <label style={{ fontSize: '0.75rem', color: '#888' }}>FIN PLACEMENT OFFSET</label>
            <input type="range" min="0" max={tube.height - 40} step="5" value={finOffset} onChange={(e) => setFinOffset(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
          </div>

          <div onMouseEnter={() => setActiveVar('structure')} onMouseLeave={() => setActiveVar(null)}>
            <label style={{ fontSize: '0.75rem', color: '#888' }}>NOSE CONE</label>
            <select value={nose.id} onChange={(e) => setNose(CATALOG.nose.find(n => n.id === e.target.value))} style={{ width: '100%', padding: '4px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', fontFamily: '"Space Mono"' }}>{CATALOG.nose.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}</select>
          </div>
          
          <div onMouseEnter={() => setActiveVar('structure')} onMouseLeave={() => setActiveVar(null)}>
            <label style={{ fontSize: '0.75rem', color: '#888' }}>FUSELAGE TUBE</label>
            <select value={tube.id} onChange={(e) => setTube(CATALOG.tube.find(t => t.id === e.target.value))} style={{ width: '100%', padding: '4px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', fontFamily: '"Space Mono"' }}>{CATALOG.tube.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
          </div>

          <div onMouseEnter={() => setActiveVar('engine')} onMouseLeave={() => setActiveVar(null)}>
            <label style={{ fontSize: '0.75rem', color: '#888' }}>ROCKET MOTOR</label>
            <select value={engine.id} onChange={(e) => setEngine(CATALOG.engine.find(eng => eng.id === e.target.value))} style={{ width: '100%', padding: '4px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', fontFamily: '"Space Mono"' }}>
              {CATALOG.engine.map(eng => <option key={eng.id} value={eng.id}>{eng.name} (Isp: {eng.isp})</option>)}
            </select>
          </div>
          
          <div style={{ marginTop: '5px' }} onMouseEnter={() => setActiveVar('fuel')} onMouseLeave={() => setActiveVar(null)}>
            <label style={{ fontSize: '0.75rem', color: '#ff4d4d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>PROPELLANT (kg)</span>
              <input type="number" min="0" max={tube.maxFuel} value={fuelLoad} onChange={(e) => setFuelLoad(Math.max(0, Math.min(tube.maxFuel, Number(e.target.value))))} style={{ width: '60px', padding: '2px', backgroundColor: '#000', color: '#ff4d4d', border: '1px solid #ff4d4d', fontFamily: '"Space Mono"', textAlign: 'center' }} />
            </label>
            <input type="range" min="0" max={tube.maxFuel} step="1" value={fuelLoad} onChange={(e) => setFuelLoad(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer', marginTop: '5px' }} />
          </div>

          <div style={{ backgroundColor: '#000', padding: '10px', borderRadius: '4px', borderLeft: '4px solid #28a745', marginTop: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: '#888' }}>WET MASS (m0):</span> <span style={{ color: isM0Active ? 'yellow' : '#fff' }}>{m0} kg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
              <span style={{ color: '#888' }}>DRY MASS (mf):</span> <span style={{ color: isMfActive ? 'yellow' : '#fff' }}>{mf} kg</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #333', paddingTop: '5px' }}>
              <strong style={{ color: '#4da8da' }}>EST. DELTA-V:</strong> <strong style={{ color: '#4da8da' }}>{deltaV} m/s</strong>
            </div>
            
            {budget !== Infinity && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '5px' }}>
                <span style={{ color: '#888' }}>ΔV BUDGET:</span>
                <span style={{ color: earnedBonus ? '#28a745' : '#ff4d4d', fontWeight: 'bold' }}>{deltaV} / {budget}</span>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #333', paddingTop: '5px', marginTop: '5px' }}>
              <strong style={{ color: '#ffc107', fontSize: '0.75rem' }}>EST. APOGEE (Atmo):</strong> 
              <strong style={{ color: '#ffc107', fontSize: '0.85rem' }}>{predictedApogee} m</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}