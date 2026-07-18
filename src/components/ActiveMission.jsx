// src/components/ActiveMission.jsx
import React, { useState, useEffect, useRef } from 'react';
import Scratchpad, { CATALOG, Rocket2D } from './Scratchpad';

export default function ActiveMission({ activeMission, exitMission, onMissionSuccess }) {
  const [flightState, setFlightState] = useState('PRE-FLIGHT'); 
  const [telemetry, setTelemetry] = useState({ altitude: 0, velocity: 0, fuel: 0, maxAltitude: 0, rotation: 0, currentQ: 0, currentG: 1 });
  const [crashReason, setCrashReason] = useState(null); 
  const [tod, setTod] = useState('DAY'); 

  const [nose, setNose] = useState(CATALOG.nose[0]);
  const [tube, setTube] = useState(CATALOG.tube[0]);
  const [engine, setEngine] = useState(CATALOG.engine[0]);
  const [fuelLoad, setFuelLoad] = useState(20);
  const [finCount, setFinCount] = useState(4);
  const [finOffset, setFinOffset] = useState(0);

  const MAX_Q_TOLERANCE = 85; 

  const physics = useRef({
    altitude: 0, velocity: 0, fuel: 0, dryMass: 0, burnRate: 0, isp: 0, 
    g0: 9.81, rotation: 0, lastTime: null, animationFrameId: null, hasReachedApogee: false 
  });

  const flightLoop = (time) => {
    if (!physics.current.lastTime) physics.current.lastTime = time;
    const dt = (time - physics.current.lastTime) / 1000; 
    physics.current.lastTime = time;

    let { altitude, velocity, fuel, dryMass, burnRate, isp, g0, rotation } = physics.current;

    const tubeH = tube.height; 
    const noseY = tubeH + 25; 
    const tubeY = tubeH / 2;
    const engineY = 0;
    const finY = finOffset;

    const currentMass = dryMass + fuel;
    const currentCmY = ((nose.mass * noseY) + (tube.mass * tubeY) + (engine.mass * engineY) + ((finCount * 0.375) * finY) + (fuel * tubeY)) / currentMass;
    const noseArea = 20;
    const finArea = finCount * 15;
    const cpY = ((noseArea * noseY) + (finArea * finY)) / (noseArea + finArea);

    const stabilityMargin = currentCmY - cpY; 
    const baseDragCoefficient = 0.002 + (finCount * 0.0005);
    const airDensity = 1.225 * Math.exp(-Math.max(0, altitude) / 8500);
    const dynamicPressurePa = 0.5 * airDensity * Math.pow(velocity, 2);
    const dynamicPressureKPa = dynamicPressurePa / 1000; 
    
    let dragMultiplier = 1;
    let isTumbling = false;

    if (velocity > 5 && stabilityMargin < 0) {
      isTumbling = true;
      rotation += 360 * dt * (dynamicPressureKPa + 0.1); 
      dragMultiplier = 8; 
    } else {
      let targetRotation = 0;
      if (velocity < -5 && flightState !== 'APOGEE') targetRotation = 180; 
      const alignmentSpeed = Math.max(0.5, dynamicPressureKPa * Math.max(0, stabilityMargin) * 5);
      rotation += (targetRotation - rotation) * (alignmentSpeed * dt);
    }

    const dragForce = (baseDragCoefficient * dragMultiplier * airDensity) * velocity * velocity * Math.sign(velocity);
    const gravityForce = currentMass * g0;
    
    let thrustForce = 0;
    if (fuel > 0 && flightState !== 'CRASHED') { 
      const fuelBurned = burnRate * dt;
      physics.current.fuel = Math.max(0, fuel - fuelBurned);
      thrustForce = burnRate * isp * g0;
    }

    const netForce = thrustForce - gravityForce - dragForce;
    const acceleration = netForce / currentMass;
    const currentG = Math.abs(thrustForce - dragForce) / currentMass / g0;

    velocity += acceleration * dt;
    altitude += velocity * dt;
    physics.current.rotation = rotation;

    let fatalError = null;
    if (altitude <= 0 && flightState !== 'PRE-FLIGHT') {
      fatalError = 'IMPACT VELOCITY EXCEEDED';
      physics.current.rotation = 180; 
    } else if (dynamicPressureKPa > MAX_Q_TOLERANCE) {
      fatalError = `MAX Q EXCEEDED (${dynamicPressureKPa.toFixed(1)} kPa). VEHICLE SHREDDED.`;
    } else if (activeMission?.maxG && currentG > activeMission.maxG) {
      fatalError = `G-FORCE LIMIT EXCEEDED (${currentG.toFixed(1)}G). PAYLOAD CRUSHED.`;
    } else if (isTumbling && dynamicPressureKPa > 20) {
      fatalError = `AERODYNAMIC TUMBLE AT HIGH Q. VEHICLE DISINTEGRATED.`;
    }

    if (fatalError) {
      physics.current.altitude = Math.max(0, altitude);
      physics.current.velocity = 0;
      setCrashReason(fatalError);
      setTelemetry(prev => ({ ...prev, altitude: physics.current.altitude, velocity: 0, currentQ: 0, currentG: 0 }));
      setFlightState('CRASHED');
      return; 
    }

    physics.current.velocity = velocity;
    physics.current.altitude = altitude;

    setTelemetry({
      altitude: Math.max(0, altitude), velocity, fuel: physics.current.fuel, maxAltitude: Math.max(physics.current.altitude, telemetry.maxAltitude || 0), rotation, currentQ: dynamicPressureKPa, currentG
    });

    if (velocity < 0 && physics.current.fuel === 0 && !physics.current.hasReachedApogee) {
      physics.current.hasReachedApogee = true;
      setFlightState('APOGEE');
      return; 
    } else if (physics.current.fuel === 0 && flightState === 'POWERED') {
      setFlightState('COASTING');
    }

    physics.current.animationFrameId = requestAnimationFrame(flightLoop);
  };

  const initiateIgnition = () => {
    setFlightState('POWERED');
    setCrashReason(null);
    physics.current.lastTime = null; 
    
    const payload = activeMission?.payloadMass || 0;
    const avionics = activeMission?.avionicsMass || 0;
    const structureMass = nose.mass + tube.mass + engine.mass + (finCount * 0.375);

    physics.current.dryMass = payload + avionics + structureMass;
    physics.current.fuel = fuelLoad;
    physics.current.isp = engine.isp;
    physics.current.burnRate = engine.burnRate; 
    physics.current.rotation = 0;
    physics.current.hasReachedApogee = false;

    physics.current.animationFrameId = requestAnimationFrame(flightLoop);
  };

  const resumeDescent = () => {
    setFlightState('DESCENT');
    physics.current.lastTime = null; 
    physics.current.animationFrameId = requestAnimationFrame(flightLoop); 
  };

  // FIXED SYNC TRIGGER
  const triggerSuccessSequence = () => {
    if (onMissionSuccess) {
      onMissionSuccess(); 
    }
    if (exitMission) {
      exitMission();
    }
  };

  useEffect(() => {
    const roll = Math.random();
    if (roll < 0.33) setTod('DAY');
    else if (roll < 0.66) setTod('EVENING');
    else setTod('NIGHT');
    return () => cancelAnimationFrame(physics.current.animationFrameId);
  }, []);

  const visualAltitude = Math.min(telemetry.altitude * 2, 400); 
  const targetApogee = activeMission?.targetApogee || 0;
  const maxApogee = activeMission?.maxApogee || Infinity; 
  let isMissionSuccess = telemetry.maxAltitude >= targetApogee && telemetry.maxAltitude <= maxApogee;
  let debriefWarning = "";
  if (telemetry.maxAltitude < targetApogee) debriefWarning = "FELL SHORT OF TARGET ALTITUDE.";
  else if (telemetry.maxAltitude > maxApogee) debriefWarning = "OVERSHOT PRECISION TARGET ALTITUDE.";

  const efficiency = 0.45;
  const predictedIdealApogee = flightState !== 'PRE-FLIGHT' && flightState !== 'CRASHED' 
    ? (telemetry.altitude + (Math.pow(Math.max(0, telemetry.velocity), 2) / (2 * 9.81)) * efficiency) : 0;

  const getAtmosphereGradient = (alt, timeOfDay) => {
    if (alt < 2000) {
      if (timeOfDay === 'DAY') return 'linear-gradient(to bottom, #4da8da, #add8e6)';
      if (timeOfDay === 'EVENING') return 'linear-gradient(to bottom, #ff7e5f, #feb47b)';
      if (timeOfDay === 'NIGHT') return 'linear-gradient(to bottom, #111424, #191970)';
    } else if (alt < 6000) {
      if (timeOfDay === 'DAY') return 'linear-gradient(to bottom, #0B3D91, #4da8da)';
      if (timeOfDay === 'EVENING') return 'linear-gradient(to bottom, #2c3e50, #7b4397)';
      if (timeOfDay === 'NIGHT') return 'linear-gradient(to bottom, #000000, #0a0a2a)';
    } else return 'transparent'; 
  };

  const payload = activeMission?.payloadMass || 0;
  const avionics = activeMission?.avionicsMass || 0;
  const finalStructureMass = nose.mass + tube.mass + engine.mass + (finCount * 0.375);
  const m0 = payload + avionics + finalStructureMass + fuelLoad; 
  const mf = payload + avionics + finalStructureMass;            
  const builtDeltaV = (m0 === 0 || mf === 0) ? 0 : Number((engine.isp * 9.81 * Math.log(m0 / mf)).toFixed(0));
  const earnedBonus = isMissionSuccess && activeMission?.targetDeltaV && builtDeltaV <= activeMission.targetDeltaV;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: getAtmosphereGradient(telemetry.altitude, tod), transition: 'background 3s ease' }}>
      <style>{`
        @keyframes disintegrate { 0% { transform: scale(0.1); opacity: 1; } 25% { transform: scale(1.6); opacity: 1; filter: brightness(2.5) blur(1px); } 60% { transform: scale(2.8); opacity: 0.7; filter: brightness(1.2); } 100% { transform: scale(4.2); opacity: 0; filter: blur(4px); } }
      `}</style>

      {flightState === 'PRE-FLIGHT' && (
        <div style={{ position: 'absolute', top: '80px', left: '20px', zIndex: 10 }}>
          <Scratchpad activeMission={activeMission} nose={nose} setNose={setNose} tube={tube} setTube={setTube} engine={engine} setEngine={setEngine} fuelLoad={fuelLoad} setFuelLoad={setFuelLoad} finCount={finCount} setFinCount={setFinCount} finOffset={finOffset} setFinOffset={setFinOffset} />
        </div>
      )}

      {/* TOP LEFT HUD */}
      {(flightState === 'POWERED' || flightState === 'COASTING' || flightState === 'DESCENT') && (
        <div style={{ position: 'absolute', top: '80px', left: '20px', backgroundColor: 'rgba(17,17,17,0.85)', border: '1px solid #4da8da', borderRadius: '8px', padding: '15px', backdropFilter: 'blur(5px)', zIndex: 10, width: '320px' }}>
          <div style={{ color: '#4da8da', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #555', paddingBottom: '5px' }}>ACTIVE MISSION OBJECTIVES</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
            <span style={{ color: '#888' }}>TARGET APOGEE:</span><span style={{ color: '#fff' }}>{targetApogee} m</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '10px' }}>
            <span style={{ color: '#888' }}>CURRENT MAX:</span>
            <span style={{ color: telemetry.maxAltitude >= targetApogee ? '#28a745' : '#fff', fontWeight: 'bold' }}>{telemetry.maxAltitude.toFixed(0)} m</span>
          </div>
        </div>
      )}

      {/* TOP RIGHT HUD */}
      {(flightState === 'POWERED' || flightState === 'COASTING' || flightState === 'DESCENT') && (
        <div style={{ position: 'absolute', top: '20px', right: '20px', backgroundColor: 'rgba(17,17,17,0.85)', border: '1px solid #ffc107', borderRadius: '8px', padding: '15px', backdropFilter: 'blur(5px)', zIndex: 10, width: '320px' }}>
          <div style={{ color: '#ffc107', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #555', paddingBottom: '5px' }}>KINETIC PREDICTION</div>
          <div style={{ backgroundColor: '#0a0a0a', padding: '10px', borderRadius: '4px', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1rem', fontFamily: '"Cambria Math", "Times New Roman", serif', color: '#ccc', border: '1px solid #333' }}>
            <span style={{ fontStyle: 'italic', color: '#ffc107' }}>h<sub>max</sub></span> &nbsp;≈&nbsp;
            <span style={{ fontStyle: 'italic', color: '#28a745' }}>η</span> &nbsp;&middot;&nbsp;
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0 5px' }}>
              <span style={{ fontStyle: 'italic' }}>v<sup>2</sup></span>
              <div style={{ width: '100%', height: '1.5px', backgroundColor: '#ccc', margin: '2px 0' }}></div>
              <span style={{ fontStyle: 'italic' }}>2g</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '15px' }}>
            <span style={{ color: '#888' }}>EST. APOGEE:</span>
            <span style={{ color: '#ffc107', fontWeight: 'bold' }}>{predictedIdealApogee.toFixed(0)} m</span>
          </div>
        </div>
      )}

      {/* THE MASTER ROCKET CONTAINER - Lifted cleanly off the ground! */}
      <div style={{ position: 'absolute', bottom: 'calc(10% + 40px)', left: '50%', transform: `translate(-50%, -${visualAltitude}px)`, transition: flightState === 'CRASHED' ? 'none' : 'transform 0.1s linear', zIndex: 5 }}>
        
        {/* ROTATION WRAPPER */}
        <div style={{ transform: `rotate(${telemetry.rotation}deg)`, transformOrigin: 'center center', transition: 'transform 0.1s linear', width: '200px', height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', zIndex: 10 }}>
          {flightState !== 'CRASHED' && (
            <Rocket2D tube={tube} nose={nose} engine={engine} finOffset={finOffset} finCount={finCount} flightState={flightState} />
          )}
          
          {/* CRASH EXPLOSION */}
          {flightState === 'CRASHED' && (
             <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translate(-50%, -50%)', width: '200px', height: '200px', background: 'radial-gradient(circle, #ffffff 5%, #ffea00 25%, #ff4d4d 55%, transparent 75%)', borderRadius: '50%', animation: 'disintegrate 1.5s ease-out forwards', zIndex: 20 }} />
          )}
        </div>
      </div>

      {/* GROUND TERRAIN & LAUNCHPAD ATTACHMENT */}
      <div style={{ position: 'absolute', bottom: '0', width: '100%', height: '10%', transform: `translateY(${telemetry.altitude > 20 ? 500 : 0}px)`, backgroundColor: tod === 'DAY' ? '#d9c6a3' : '#333', borderTop: `2px solid ${tod === 'DAY' ? '#a68c6a' : '#111'}`, transition: 'transform 3s ease-in', zIndex: 1 }}>
        
        {/* LAUNCH TOWER FIXED TO THE GROUND */}
        <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 4 }}>
          <div style={{ position: 'absolute', bottom: '20px', width: '4px', height: '180px', backgroundColor: '#444', borderLeft: '1px solid #666', zIndex: 1 }} />
          <div style={{ width: '60px', height: '20px', border: '2px solid #555', borderBottom: 'none', backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #444 5px, #444 7px)', zIndex: 6 }} />
          <div style={{ width: '250px', height: '20px', background: '#333', borderTop: '2px solid #555', zIndex: 6 }} />
        </div>

      </div>
      
      <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #4da8da', borderRadius: '8px', padding: '15px 30px', display: 'flex', gap: '40px', fontFamily: '"Space Mono", monospace', textAlign: 'center', zIndex: 10 }}>
        <div><div style={{ color: '#888', fontSize: '0.8rem' }}>ALTITUDE</div><div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{telemetry.altitude.toFixed(0)} <span style={{ fontSize: '1rem' }}>m</span></div></div>
        <div><div style={{ color: '#888', fontSize: '0.8rem' }}>VELOCITY</div><div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{telemetry.velocity.toFixed(0)} <span style={{ fontSize: '1rem' }}>m/s</span></div></div>
        <div><div style={{ color: '#888', fontSize: '0.8rem' }}>PROPELLANT</div><div style={{ color: '#ff4d4d', fontSize: '1.5rem', fontWeight: 'bold' }}>{telemetry.fuel.toFixed(1)} <span style={{ fontSize: '1rem' }}>kg</span></div></div>
      </div>

      {flightState === 'PRE-FLIGHT' && (
        <button onClick={initiateIgnition} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px 40px', backgroundColor: '#28a745', color: '#000', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', zIndex: 10 }}>[ IGNITION ]</button>
      )}

      {flightState === 'APOGEE' && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(17,17,17,0.95)', border: `2px solid ${isMissionSuccess ? '#28a745' : '#ff4d4d'}`, padding: '40px', borderRadius: '8px', textAlign: 'center', minWidth: '450px', zIndex: 20 }}>
          <h2 style={{ color: isMissionSuccess ? '#28a745' : '#ff4d4d', margin: '0 0 15px 0' }}>{isMissionSuccess ? 'MISSION SUCCESS' : 'MISSION FAILED'}</h2>
          {!isMissionSuccess && <p style={{ color: '#ff4d4d', fontWeight: 'bold' }}>{debriefWarning}</p>}
          <div style={{ backgroundColor: '#000', padding: '20px', borderRadius: '4px', marginBottom: '25px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888' }}>
              <span>ACTUAL APOGEE:</span> <span style={{ color: isMissionSuccess ? '#28a745' : '#ff4d4d', fontWeight: 'bold' }}>{telemetry.maxAltitude.toFixed(0)} m</span>
            </div>
          </div>
          
          {/* THE DELTA-V SUCCESS MODAL */}
          {earnedBonus && (
            <div style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffc107', padding: '15px', borderRadius: '4px', marginBottom: '20px', color: '#ffc107', fontWeight: 'bold', fontSize: '1.1rem' }}>
              ⭐ DELTA-V BONUS ACHIEVED
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {isMissionSuccess ? (
              <button onClick={triggerSuccessSequence} style={{ padding: '15px', backgroundColor: '#28a745', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>PROCEED TO NEXT MISSION &gt;&gt;</button>
            ) : (
              <button onClick={exitMission} style={{ padding: '15px', backgroundColor: '#2b2b36', color: '#fff', border: '1px solid #ff4d4d', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>RETURN TO VAB & RETRY</button>
            )}
            
            <button onClick={resumeDescent} style={{ padding: '10px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid #555', borderRadius: '4px', fontSize: '0.9rem', cursor: 'pointer' }}>
              [ OR WATCH FREEFALL DESCENT ]
            </button>
          </div>
        </div>
      )}

      {flightState === 'CRASHED' && (
        <div style={{ position: 'absolute', top: '25%', left: '20px', backgroundColor: 'rgba(17,17,17,0.7)', border: '2px solid #ff4d4d', padding: '30px', borderRadius: '8px', textAlign: 'center', minWidth: '400px', zIndex: 30, backdropFilter: 'blur(5px)' }}>
          <h2 style={{ color: '#ff4d4d', margin: '0 0 10px 0' }}>VEHICLE DESTROYED</h2>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #333', padding: '15px', color: '#fff', marginBottom: '20px' }}>
            <span style={{ color: '#ff4d4d', fontWeight: 'bold' }}>FATAL ANOMALY:</span><br/>{crashReason}
          </div>
          <button onClick={exitMission} style={{ padding: '10px 20px', backgroundColor: '#2b2b36', color: '#fff', border: '1px solid #ff4d4d', cursor: 'pointer' }}>RETURN TO FACILITY</button>
        </div>
      )}

      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
        <button onClick={exitMission} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>&lt; ABORT</button>
      </div>
    </div>
  );
}