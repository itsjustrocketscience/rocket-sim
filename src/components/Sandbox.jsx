// src/components/Sandbox.jsx
import React, { useState, useEffect, useRef } from 'react';
import Scratchpad, { CATALOG, Rocket2D } from './Scratchpad';

export default function Sandbox({ exitSandbox }) {
  const [phase, setPhase] = useState('BUILD'); // 'BUILD', 'FLYING', 'CRASHED'
  
  const [nose, setNose] = useState(CATALOG.nose[0]);
  const [tube, setTube] = useState(CATALOG.tube[0]);
  const [engine, setEngine] = useState(CATALOG.engine[0]);
  const [fuelLoad, setFuelLoad] = useState(20);
  const [finCount, setFinCount] = useState(4);
  const [finOffset, setFinOffset] = useState(0);

  const [telemetry, setTelemetry] = useState({ alt: 0, velX: 0, velY: 0, angle: 0, fuel: 0 });
  const [crashReason, setCrashReason] = useState(null);

  // The Visual Scale Multiplier! (Makes 1 meter of physics = 2.5 pixels of screen movement)
  const ZOOM = 2.5; 

  const physics = useRef({
    x: 0, y: 0, vx: 0, vy: 0, angle: 0, fuel: 0,
    dryMass: 0, burnRate: 0, isp: 0, lastTime: null, animationId: null
  });

  const keys = useRef({ left: false, right: false });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.current.left = true;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.current.right = true;
    };
    const handleKeyUp = (e) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.current.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(physics.current.animationId);
    };
  }, []);

  const flightLoop = (time) => {
    if (!physics.current.lastTime) physics.current.lastTime = time;
    const dt = (time - physics.current.lastTime) / 1000;
    physics.current.lastTime = time;

    let { x, y, vx, vy, angle, fuel, dryMass, burnRate, isp } = physics.current;
    const g = 9.81;

    // Steering
    if (keys.current.left) angle -= 130 * dt;
    if (keys.current.right) angle += 130 * dt;
    
    // Normalize Angle (-180 to 180)
    angle = (angle + 180) % 360;
    if (angle < 0) angle += 360;
    angle -= 180;

    // Engine Thrust
    let thrustForce = 0;
    if (fuel > 0) {
      const fuelBurned = burnRate * dt;
      physics.current.fuel = Math.max(0, fuel - fuelBurned);
      thrustForce = isp * g * burnRate;
    }

    const currentMass = dryMass + physics.current.fuel;
    
    // Convert angle to heading vectors
    const rad = angle * (Math.PI / 180);
    const headingX = Math.sin(rad);
    const headingY = Math.cos(rad);

    const thrustX = thrustForce * headingX;
    const thrustY = thrustForce * headingY;

    // --- NEW: AERODYNAMIC GLIDE & DRAG VECTORS ---
    const velMag = Math.sqrt(vx * vx + vy * vy);
    let dragX = 0, dragY = 0, liftX = 0, liftY = 0;

    if (velMag > 0) {
      // 1. Profile Drag (Increases drastically when flying sideways)
      const dot = (vx * headingX + vy * headingY) / velMag; 
      const crossSection = 1 - Math.abs(dot); 
      const totalDragCoeff = 0.002 + (finCount * 0.005 * crossSection);
      const dragForce = totalDragCoeff * velMag * velMag;
      
      dragX = dragForce * (vx / velMag);
      dragY = dragForce * (vy / velMag);

      // 2. Aerodynamic Lift / Gliding! (Fins catch air and push perpendicular to velocity)
      const cross = (headingX * vy - headingY * vx) / velMag; 
      const liftForce = finCount * 0.015 * velMag * velMag * cross;
      
      liftX = liftForce * (vy / velMag);
      liftY = liftForce * (-vx / velMag);
    }

    // Integrate Accelerations
    const ax = (thrustX - dragX - liftX) / currentMass;
    const ay = (thrustY - dragY - liftY - (currentMass * g)) / currentMass;

    vx += ax * dt;
    vy += ay * dt;
    x += vx * dt;
    y += vy * dt;

    // Ground Collision (Slam impact)
    if (y <= 0 && (vy < -2 || Math.abs(vx) > 5 || Math.abs(angle) > 25)) {
      setCrashReason(`IMPACT AT ${Math.abs(vy).toFixed(1)} m/s (${angle.toFixed(0)}° ANGLE). VEHICLE DESTROYED.`);
      setPhase('CRASHED');
      physics.current.y = 0;
      return; 
    } else if (y <= 0) {
      y = 0; 
      vy = 0;
      vx = 0;
      angle = 0;
    }

    physics.current.x = x;
    physics.current.y = y;
    physics.current.vx = vx;
    physics.current.vy = vy;
    physics.current.angle = angle;

    setTelemetry({ alt: y, velX: vx, velY: vy, angle, fuel: physics.current.fuel });

    physics.current.animationId = requestAnimationFrame(flightLoop);
  };

  const launch = () => {
    const finTotalMass = finCount * 0.375;
    const structureMass = nose.mass + tube.mass + engine.mass + finTotalMass;

    physics.current = {
      x: 0, y: 0, vx: 0, vy: 0, angle: 0, 
      fuel: fuelLoad, dryMass: structureMass, 
      burnRate: engine.burnRate, isp: engine.isp,
      lastTime: null, animationId: null
    };
    
    setPhase('FLYING');
    setCrashReason(null);
    physics.current.animationId = requestAnimationFrame(flightLoop);
  };

  const reset = () => {
    cancelAnimationFrame(physics.current.animationId);
    setPhase('BUILD');
  };

  const handleLeftDown = (e) => { e.preventDefault(); keys.current.left = true; };
  const handleLeftUp = (e) => { e.preventDefault(); keys.current.left = false; };
  const handleRightDown = (e) => { e.preventDefault(); keys.current.right = true; };
  const handleRightUp = (e) => { e.preventDefault(); keys.current.right = false; };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#000', zIndex: 1000, overflow: 'hidden', fontFamily: '"Space Mono", monospace' }}>

      {/* --- NEW SMOOTH ATMOSPHERE LAYERS --- */}
      {/* Deep Space Base */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#050505', zIndex: 1 }} />
      {/* Mesosphere (Fades out gracefully above 15,000m) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, #000000, #0B3D91)', opacity: Math.max(0, 1 - telemetry.alt / 15000), zIndex: 2 }} />
      {/* Troposphere (Fades out gracefully above 5,000m) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, #0B3D91, #4da8da)', opacity: Math.max(0, 1 - telemetry.alt / 5000), zIndex: 3 }} />


      {/* --- PHASE 1: ASSEMBLY --- */}
      {phase === 'BUILD' && (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
          
          <button onClick={exitSandbox} style={{ position: 'absolute', top: '30px', left: '30px', padding: '12px 24px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#4da8da', border: '1px solid #4da8da', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', backdropFilter: 'blur(5px)' }}>
            &lt; COMMAND CENTER
          </button>

          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0,0,0,0.85)', padding: '30px', borderRadius: '12px', border: '1px solid #4da8da' }}>
            <Scratchpad nose={nose} setNose={setNose} tube={tube} setTube={setTube} engine={engine} setEngine={setEngine} fuelLoad={fuelLoad} setFuelLoad={setFuelLoad} finCount={finCount} setFinCount={setFinCount} finOffset={finOffset} setFinOffset={setFinOffset} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '220px' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ color: '#4da8da', margin: '0 0 5px 0' }}>PROVING GROUNDS</h3>
                <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>Unrestricted flight testing sandbox.</p>
              </div>

              <button onClick={launch} style={{ width: '100%', padding: '20px', backgroundColor: '#28a745', color: '#000', border: 'none', borderRadius: '8px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 0 20px rgba(40, 167, 69, 0.5)', transition: 'all 0.2s ease' }}>
                🚀 IGNITION
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PHASE 2 & 3: ACTIVE FLIGHT / CRASH --- */}
      {(phase === 'FLYING' || phase === 'CRASHED') && (
        <>
          {/* TERRAIN & WORLD CONTAINER (Scaled by ZOOM for massive speed feel!) */}
          <div style={{ 
            position: 'absolute', 
            top: '75%', 
            left: '50%', 
            transform: `translate(calc(-50% - ${physics.current.x * ZOOM}px), ${physics.current.y * ZOOM}px)`, 
            zIndex: 5 
          }}>
            
            {/* THIN, SPARSE CLOUDS (Visually safe parallax layers anchored into the world) */}
            <div style={{ position: 'absolute', top: '-1500px', left: '-800px', opacity: 0.45, filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' }}>
              <svg width="250" height="40" viewBox="0 0 250 40"><path d="M 10 30 Q 50 10 90 25 Q 130 5 180 20 Q 230 15 240 30 Z" fill="rgba(255, 255, 255, 0.7)" /></svg>
            </div>
            <div style={{ position: 'absolute', top: '-3500px', left: '600px', opacity: 0.35, filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))' }}>
              <svg width="320" height="45" viewBox="0 0 320 45"><path d="M 10 35 Q 70 10 120 25 Q 180 5 240 20 Q 300 15 310 35 Z" fill="rgba(255, 255, 255, 0.6)" /></svg>
            </div>
            <div style={{ position: 'absolute', top: '-7500px', left: '-400px', opacity: 0.25 }}>
              <svg width="200" height="35" viewBox="0 0 200 35"><path d="M 10 25 Q 40 5 90 20 Q 130 0 180 15 Q 190 20 195 25 Z" fill="rgba(255, 255, 255, 0.5)" /></svg>
            </div>

            {/* TERRAIN PLANE */}
            <div style={{ position: 'absolute', top: 0, left: '-15000px', width: '30000px', height: '2000px', backgroundColor: '#1b261b', borderTop: '4px solid #28a745' }} />

            {/* LAUNCHPAD ASSEMBLY (Anchored perfectly to top: 0 of the terrain) */}
            <div style={{ position: 'absolute', top: 0, left: 0, transform: 'translate(-50%, -100%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '4px', height: '180px', backgroundColor: '#444', borderLeft: '1px solid #666' }} />
              <div style={{ width: '60px', height: '20px', border: '2px solid #555', borderBottom: 'none', backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #444 5px, #444 7px)' }} />
              <div style={{ width: '250px', height: '20px', background: '#333', borderTop: '2px solid #555' }} />
            </div>
          </div>

          {/* THE ROCKET (Permanently locked to top: 75% for camera tracking) */}
          <div style={{ 
            position: 'absolute', 
            top: '75%', 
            left: '50%', 
            transform: `translate(-50%, -50%) rotate(${telemetry.angle}deg)`, 
            transformOrigin: 'center center',
            zIndex: 10 
          }}>
            {phase === 'FLYING' && (
              <Rocket2D tube={tube} nose={nose} engine={engine} finOffset={finOffset} finCount={finCount} flightState={telemetry.fuel > 0 ? 'POWERED' : 'COASTING'} />
            )}
            
            {phase === 'CRASHED' && (
              <div style={{ width: '250px', height: '250px', background: 'radial-gradient(circle, #ffffff 10%, #ffea00 30%, #ff4d4d 60%, transparent 80%)', borderRadius: '50%', transform: 'translate(-50%, -50%)', filter: 'blur(3px)' }} />
            )}
          </div>

          {/* NEW UPGRADED TELEMETRY HUD */}
          <div style={{ position: 'absolute', top: '30px', left: '30px', backgroundColor: 'rgba(0,0,0,0.85)', padding: '20px', border: '1px solid #4da8da', borderRadius: '8px', zIndex: 20 }}>
            <div style={{ display: 'flex', gap: '25px', textAlign: 'center' }}>
              <div><div style={{ color: '#888', fontSize: '0.75rem' }}>ALTITUDE</div><div style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold' }}>{telemetry.alt.toFixed(0)} m</div></div>
              <div><div style={{ color: '#888', fontSize: '0.75rem' }}>VERT VEL</div><div style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold' }}>{telemetry.velY.toFixed(0)} m/s</div></div>
              {/* NEW HORIZONTAL VELOCITY METER */}
              <div><div style={{ color: '#888', fontSize: '0.75rem' }}>HORIZ VEL</div><div style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 'bold' }}>{Math.abs(telemetry.velX).toFixed(0)} m/s</div></div>
              
              <div><div style={{ color: '#888', fontSize: '0.75rem' }}>HEADING</div><div style={{ color: '#ffc107', fontSize: '1.3rem', fontWeight: 'bold' }}>{telemetry.angle.toFixed(0)}°</div></div>
              <div><div style={{ color: '#888', fontSize: '0.75rem' }}>PROPELLANT</div><div style={{ color: '#ff4d4d', fontSize: '1.3rem', fontWeight: 'bold' }}>{telemetry.fuel.toFixed(1)} kg</div></div>
            </div>
          </div>

          <button onClick={reset} style={{ position: 'absolute', top: '30px', right: '30px', padding: '12px 24px', backgroundColor: 'transparent', color: '#ff4d4d', border: '2px solid #ff4d4d', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', zIndex: 20 }}>
            &lt; REBUILD VEHICLE
          </button>

          {/* TOUCH STEERING CONTROLS */}
          {phase === 'FLYING' && (
            <div style={{ position: 'absolute', bottom: '40px', width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0 50px', boxSizing: 'border-box', zIndex: 20, pointerEvents: 'none' }}>
              <button onPointerDown={handleLeftDown} onPointerUp={handleLeftUp} onPointerLeave={handleLeftUp} style={{ width: '90px', height: '90px', backgroundColor: 'rgba(77, 168, 218, 0.25)', border: '2px solid #4da8da', borderRadius: '50%', color: '#4da8da', fontSize: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'auto', userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none', backdropFilter: 'blur(4px)' }}>&larr;</button>
              <button onPointerDown={handleRightDown} onPointerUp={handleRightUp} onPointerLeave={handleRightUp} style={{ width: '90px', height: '90px', backgroundColor: 'rgba(77, 168, 218, 0.25)', border: '2px solid #4da8da', borderRadius: '50%', color: '#4da8da', fontSize: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', pointerEvents: 'auto', userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none', backdropFilter: 'blur(4px)' }}>&rarr;</button>
            </div>
          )}

          {phase === 'CRASHED' && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(17,17,17,0.95)', padding: '30px 50px', border: '2px solid #ff4d4d', borderRadius: '8px', textAlign: 'center', zIndex: 30, backdropFilter: 'blur(10px)' }}>
              <h2 style={{ color: '#ff4d4d', marginTop: 0 }}>VEHICLE CRASHED</h2>
              <p style={{ color: '#fff', marginBottom: '25px', maxWidth: '350px' }}>{crashReason}</p>
              <button onClick={reset} style={{ padding: '12px 30px', backgroundColor: '#333', color: '#fff', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>REBUILD VEHICLE</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}