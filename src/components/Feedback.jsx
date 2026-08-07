import React, { useState } from 'react';

export default function Feedback() {
  const [status, setStatus] = useState('IDLE');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('TRANSMITTING');
    // Simulates a network request delay
    setTimeout(() => setStatus('SENT'), 1500);
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', animation: 'fadeIn 0.5s ease' }}>
      <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '8px', border: '1px solid #ff4d4d', borderLeft: '4px solid #ff4d4d', marginBottom: '25px' }}>
        <h2 style={{ color: '#ff4d4d', margin: '0 0 10px 0', letterSpacing: '2px' }}>ENGINEERING COMMS</h2>
        <p style={{ color: '#aaa', margin: 0 }}>Report simulation anomalies, suggest new vehicle parts, or file a bug report directly to Mission Control.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#1a1a20', padding: '30px', border: '1px solid #333', borderRadius: '8px' }}>
        
        <label style={{ color: '#888', fontSize: '0.9rem', fontWeight: 'bold' }}>
          TRANSMISSION TYPE
          <select style={{ display: 'block', width: '100%', padding: '12px', marginTop: '8px', backgroundColor: '#0a0a0a', color: '#fff', border: '1px solid #444', fontFamily: '"Space Mono", monospace', fontSize: '1rem' }}>
            <option>Bug Report (Anomaly)</option>
            <option>Feature Request (R&D)</option>
            <option>General Comms</option>
          </select>
        </label>

        <label style={{ color: '#888', fontSize: '0.9rem', fontWeight: 'bold' }}>
          MESSAGE LOG
          <textarea required rows="6" placeholder="Describe the anomaly in detail..." style={{ display: 'block', width: '100%', padding: '12px', marginTop: '8px', backgroundColor: '#0a0a0a', color: '#fff', border: '1px solid #444', fontFamily: '"Space Mono", monospace', resize: 'vertical', fontSize: '1rem' }} />
        </label>

        <button 
          type="submit" 
          disabled={status !== 'IDLE'} 
          style={{ padding: '15px', backgroundColor: status === 'SENT' ? '#28a745' : '#2b2b36', color: status === 'SENT' ? '#000' : '#fff', border: '1px solid #555', borderRadius: '4px', cursor: status === 'IDLE' ? 'pointer' : 'default', fontFamily: '"Space Mono", monospace', fontSize: '1.1rem', fontWeight: 'bold', marginTop: '10px', transition: 'all 0.2s ease' }}
        >
          {status === 'IDLE' && 'TRANSMIT LOG >>'}
          {status === 'TRANSMITTING' && 'UPLOADING TELEMETRY...'}
          {status === 'SENT' && 'TRANSMISSION RECEIVED'}
        </button>
      </form>
    </div>
  );
}