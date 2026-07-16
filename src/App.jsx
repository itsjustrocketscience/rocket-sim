// src/App.jsx
import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Auth from './components/Auth';
// 1. IMPORT THE MISSION DATA MATRIX HERE:
import { missions } from './data/missions';

function App() {
  // Existing authentication states
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. INSERT YOUR NEW GAME ENGINE STATES HERE:
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [showBrief, setShowBrief] = useState(true);
  const [showScratchpad, setShowScratchpad] = useState(false);

  // This dynamically looks up the active mission based on the index state above
  const activeMission = missions[currentMissionIndex];

  // Listener waiting for Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <div style={{ color: '#fff', fontFamily: 'monospace', textAlign: 'center', marginTop: '50px' }}>Initializing Telemetry...</div>;
  }

  return (
    <div style={{ fontFamily: '"Space Mono", monospace', padding: '40px', backgroundColor: '#1e1e24', color: '#fff', minHeight: '100vh' }}>
      
      <header style={{ borderBottom: '2px solid #333', paddingBottom: '20px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, color: '#4da8da' }}>🚀 Mission Control Subsystem</h1>
        
        {user && (
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: '"Space Mono", monospace' }}>
            Abort (Logout)
          </button>
        )}
      </header>

      <main>
        {!user ? (
          <Auth />
        ) : (
          <div style={{ padding: '20px', backgroundColor: '#2b2b36', borderRadius: '8px', maxWidth: '600px' }}>
            <h2>Welcome to Mission Control, {user.email}</h2>
            <p style={{ color: '#aaa' }}>Your pilot profile ID is secured: {user.uid}</p>
            
            <hr style={{ borderColor: '#444', margin: '20px 0' }} />
            
            {/* Temporary debug window to prove the states work */}
            <h3 style={{ color: '#4da8da' }}>Current Tracking Status:</h3>
            <p><strong>Active Project:</strong> {activeMission.title}</p>
            <p><strong>Target Altitude:</strong> {activeMission.targetApogee} km</p>
            <p><strong>Payload Target Weight:</strong> {activeMission.payloadMass} kg</p>
          </div>
        )}
      </main>

    </div>
  );
}

export default App;