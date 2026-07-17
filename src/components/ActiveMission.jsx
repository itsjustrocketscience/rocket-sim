// src/components/ActiveMission.jsx
import React, { useState, useEffect, useRef } from 'react';
import Scratchpad, { CATALOG } from './Scratchpad';

export default function ActiveMission({ activeMission, exitMission }) {
  const [flightState, setFlightState] = useState('PRE-FLIGHT'); 
  const [telemetry, setTelemetry] = useState({ altitude: 0, velocity: 0, fuel: 0, maxAltitude: 0 });

  // Lifted States from Scratchpad
  const [nose, setNose] = useState(CATALOG.nose[0]);
  const [tube, setTube] = useState(CATALOG.tube[0]);
  const [engine, setEngine] = useState(CATALOG.engine[0]);
  const [fuelLoad, setFuelLoad] = useState(20);

  const physics = useRef({
    altitude: 0, velocity: 0, fuel: 0, dryMass: 0, burnRate: 0, isp: 0, 
    dragFactor: 0.005, g0: 9.81, lastTime: null, animationFrameId: null
  });

  const flightLoop = (time) => {
    if (!physics.current.lastTime) physics.current.lastTime = time;
    const dt = (time - physics.current.lastTime) / 1000; 
    physics.current.lastTime = time;

    let { altitude, velocity, fuel, dryMass, burnRate, isp, dragFactor, g0 } = physics.current;

    const currentMass = dryMass + fuel;
    const gravityForce = currentMass * g0;
    const dragForce = dragFactor * velocity * velocity * Math.sign(velocity);
    
    let thrustForce = 0;
    if (fuel > 0) {
      const fuelBurned = burnRate * dt;
      physics.current.fuel = Math.max(0, fuel - fuelBurned);
      thrustForce = burnRate * isp * g0;
    }

    const netForce = thrustForce - gravityForce - dragForce;
    const acceleration = netForce / currentMass;

    velocity += acceleration * dt;
    altitude += velocity * dt;

    physics.current.velocity = velocity;
    physics.current.altitude = altitude;

    setTelemetry({
      altitude: Math.max(0, altitude),
      velocity: velocity,
      fuel: physics.current.fuel,
      maxAltitude: Math.max(physics.current.altitude, telemetry.maxAltitude || 0)
    });

    if (altitude < 0 && velocity < 0) {
      setFlightState('APOGEE'); 
      return; 
    }

    if (velocity < 0 && physics.current.fuel === 0 && flightState !== 'APOGEE') {
      setFlightState('APOGEE');
      return; 
    } else if (physics.current.fuel === 0 && flightState !== 'COASTING') {
      setFlightState('COASTING');
    }

    physics.current.animationFrameId = requestAnimationFrame(flightLoop);
  };

  const initiateIgnition = () => {
    setFlightState('POWERED');
    physics.current.lastTime = null; 
    
    // Inject dynamic VAB states into the physics engine!
    const payload = activeMission?.payloadMass || 0;
    const avionics = activeMission?.avionicsMass || 0;
    const finMass = 1.5;
    const structureMass = nose.mass + tube.mass + engine.mass + finMass;

    physics.current.dryMass = payload + avionics + structureMass;
    physics.current.fuel = fuelLoad;
    physics.current.isp = engine.isp;
    physics.current.burnRate = engine.burnRate; 

    physics.current.animationFrameId = requestAnimationFrame(flightLoop);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(physics.current.animationFrameId);
  }, []);

  const visualAltitude = Math.min(telemetry.altitude * 2, 400); 
  // Determine which fuel amount to show in the 2.5D visualizer
  const currentDisplayedFuel = flightState === 'PRE-FLIGHT' ? fuelLoad : telemetry.fuel;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {flightState === 'PRE-FLIGHT' && (
        <div style={{ position: 'absolute', top: '80px', left: '20px', zIndex: 10 }}>
          <Scratchpad 
            activeMission={activeMission}
            nose={nose} setNose={setNose}
            tube={tube} setTube={setTube}
            engine={engine} setEngine={setEngine}
            fuelLoad={fuelLoad} setFuelLoad={setFuelLoad}
          />
        </div>
      )}

      {/* CENTER: THE 2.5D ROCKET VISUALIZER */}
      <div style={{ 
        position: 'absolute', bottom: '15%', left: '50%', 
        transform: `translate(-50%, -${visualAltitude}px)`, 
        transition: 'transform 0.1s linear',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        
        {/* Volumetric Nose Cone */}
        <div style={{ width: '50px', height: '60px', background: 'linear-gradient(to right, #444, #ddd 40%, #888 70%, #222)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', marginBottom: '-1px' }}></div>
        
        {/* Volumetric Fuselage Tube */}
        <div style={{ width: '50px', height: `${tube.height}px`, background: 'linear-gradient(to right, #555, #eee 40%, #aaa 70%, #333)', position: 'relative' }}>
          {/* Dynamic Liquid Fuel Indicator (Drains during flight!) */}
          <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${(currentDisplayedFuel / tube.maxFuel) * 100}%`, background: 'linear-gradient(to right, rgba(200, 50, 50, 0.6), rgba(255, 100, 100, 0.8) 40%, rgba(150, 20, 20, 0.6))', transition: 'height 0.1s linear', borderTop: currentDisplayedFuel > 0 ? '2px solid rgba(255,255,255,0.5)' : 'none' }}></div>
          {/* Fins */}
          <div style={{ position: 'absolute', bottom: '10px', left: '-25px', width: '100px', display: 'flex', justifyContent: 'space-between', zIndex: -1 }}>
            <div style={{ width: '25px', height: '40px', background: 'linear-gradient(to right, #2a6a8c, #4da8da)', clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
            <div style={{ width: '25px', height: '40px', background: 'linear-gradient(to left, #2a6a8c, #4da8da)', clipPath: 'polygon(0 100%, 100% 100%, 0 0)' }}></div>
          </div>
        </div>

        {/* Volumetric Engine Nozzle */}
        <div style={{ width: '34px', height: '20px', background: 'linear-gradient(to right, #111, #555 40%, #333 70%, #000)', clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0 100%)', marginTop: '-1px' }}></div>

        {/* Engine Flame (Only visible during powered flight) */}
        {flightState === 'POWERED' && (
          <div style={{ position: 'absolute', bottom: '-45px', width: '30px', height: '60px', background: 'linear-gradient(to bottom, #fff, #ffea00, #ff4d4d, transparent)', borderRadius: '50%', animation: 'twinkle 0.1s infinite alternate' }} />
        )}
      </div>

      {/* LAUNCH PAD */}
      <div style={{ position: 'absolute', bottom: '10%', left: '40%', width: '20%', borderTop: '4px solid #333', transform: `translateY(${telemetry.altitude > 10 ? 100 : 0}px)`, opacity: telemetry.altitude > 10 ? 0 : 1, transition: 'all 1s ease' }} />

      {/* ALTIMETER HUD */}
      <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid #4da8da', borderRadius: '8px', padding: '15px 30px', display: 'flex', gap: '40px', fontFamily: '"Space Mono", monospace', textAlign: 'center' }}>
        <div><div style={{ color: '#888', fontSize: '0.8rem' }}>ALTITUDE</div><div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{telemetry.altitude.toFixed(0)} <span style={{ fontSize: '1rem' }}>m</span></div></div>
        <div><div style={{ color: '#888', fontSize: '0.8rem' }}>VELOCITY</div><div style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 'bold' }}>{telemetry.velocity.toFixed(0)} <span style={{ fontSize: '1rem' }}>m/s</span></div></div>
        <div><div style={{ color: '#888', fontSize: '0.8rem' }}>PROPELLANT</div><div style={{ color: '#ff4d4d', fontSize: '1.5rem', fontWeight: 'bold' }}>{telemetry.fuel.toFixed(1)} <span style={{ fontSize: '1rem' }}>kg</span></div></div>
      </div>

      {/* IGNITION BUTTON */}
      {flightState === 'PRE-FLIGHT' && (
        <button onClick={initiateIgnition} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: '20px 40px', backgroundColor: '#28a745', color: '#000', fontSize: '1.5rem', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 0 20px rgba(40,167,69,0.5)' }}>[ IGNITION ]</button>
      )}

      {/* APOGEE POPUP */}
      {flightState === 'APOGEE' && (
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(17,17,17,0.95)', border: '2px solid #4da8da', padding: '40px', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ color: '#4da8da', margin: '0 0 10px 0' }}>APOGEE REACHED</h2>
          <p style={{ fontSize: '1.2rem', margin: '0 0 20px 0' }}>MAX ALTITUDE: <strong style={{ color: '#28a745' }}>{telemetry.maxAltitude.toFixed(0)} m</strong></p>
          <button onClick={exitMission} style={{ padding: '10px 20px', backgroundColor: '#2b2b36', color: '#fff', border: '1px solid #444', cursor: 'pointer', fontFamily: '"Space Mono"' }}>RETURN TO COMMAND</button>
        </div>
      )}

      {/* ABORT BUTTON */}
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        <button onClick={exitMission} style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontFamily: '"Space Mono"' }}>&lt; ABORT TO COMMAND</button>
      </div>
    </div>
  );
}