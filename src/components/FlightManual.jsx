import React from 'react';

export default function FlightManual() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.5s ease' }}>
      <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '8px', border: '1px solid #ffc107', borderLeft: '4px solid #ffc107' }}>
        <h2 style={{ color: '#ffc107', margin: '0 0 10px 0', letterSpacing: '2px' }}>TRAINING ARCHIVES</h2>
        <p style={{ color: '#aaa', margin: 0 }}>Review these engineering principles before initiating launch sequences.</p>
      </div>

      <div style={{ backgroundColor: '#1a1a20', padding: '30px', border: '1px solid #333', borderRadius: '8px' }}>
        <h3 style={{ color: '#4da8da', marginTop: 0, fontSize: '1.4rem' }}>1. The Rocket Equation</h3>
        <p style={{ color: '#ccc', lineHeight: '1.6' }}>
          Delta-V (<span style={{ fontStyle: 'italic' }}>Δv</span>) is the total "budget" of speed your rocket can generate. It is determined by the Tsiolkovsky equation. Adding more fuel increases Delta-V, but adding too much mass will cause the rocket to become too heavy to lift itself.
        </p>
        <div style={{ padding: '20px', backgroundColor: '#0a0a0a', textAlign: 'center', borderRadius: '4px', margin: '20px 0', border: '1px solid #222', fontSize: '1.5rem', fontFamily: '"Cambria Math", serif' }}>
          <span style={{ fontStyle: 'italic' }}>Δv</span> &nbsp;=&nbsp; 
          <span style={{ fontStyle: 'italic' }}>I<sub>sp</sub></span> &nbsp;&middot;&nbsp; 
          <span style={{ fontStyle: 'italic' }}>g<sub>0</sub></span> &nbsp;ln(
          <span style={{ fontStyle: 'italic' }}>m<sub>0</sub></span> / <span style={{ fontStyle: 'italic' }}>m<sub>f</sub></span>
          )
        </div>
      </div>

      <div style={{ backgroundColor: '#1a1a20', padding: '30px', border: '1px solid #333', borderRadius: '8px' }}>
        <h3 style={{ color: '#4da8da', marginTop: 0, fontSize: '1.4rem' }}>2. Aerodynamic Stability</h3>
        <p style={{ color: '#ccc', lineHeight: '1.6' }}>
          A rocket must fly straight to reach its target. This requires the <strong>Center of Pressure (CoP)</strong> to be located <em>below</em> the <strong>Center of Mass (CoM)</strong>.
        </p>
        <ul style={{ color: '#aaa', lineHeight: '1.8', marginTop: '15px' }}>
          <li>Adding heavy payloads or nose cones moves the CoM <strong>UP</strong> (More stable).</li>
          <li>Adding larger fins near the engine moves the CoP <strong>DOWN</strong> (More stable).</li>
          <li>If the CoP moves above the CoM, the rocket will flip out of control and disintegrate under Max-Q.</li>
        </ul>
      </div>
    </div>
  );
}