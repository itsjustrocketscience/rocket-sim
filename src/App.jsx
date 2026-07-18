import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Auth from './components/Auth';
import MissionBriefing from './components/MissionBriefing';
import { missions } from './data/missions';
import ActiveMission from './components/ActiveMission';
import Meteor from './components/Meteor';
import VabDoors from './components/VabDoors';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [unlockedMissionIndex, setUnlockedMissionIndex] = useState(0);
  const [isMissionActive, setIsMissionActive] = useState(false);
  
  const [activeTab, setActiveTab] = useState('space-center');
  const [isDoorsClosed, setIsDoorsClosed] = useState(false);

  const activeMission = missions[currentMissionIndex];

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

  const handleTabChange = (newTabId) => {
    if (newTabId === activeTab || isDoorsClosed) return;
    setIsDoorsClosed(true);
    setTimeout(() => {
      setActiveTab(newTabId);
      setTimeout(() => {
        setIsDoorsClosed(false);
      }, 100);
    }, 1000); 
  };

  const TABS = [
    { id: 'space-center', label: '1. Space Center' },
    { id: 'mission-control', label: '2. Mission Control' },
    { id: 'vab', label: '3. Vehicle Assembly' },
    { id: 'rnd', label: '4. R&D' },
    { id: 'flight-manual', label: '5. Flight Manual' },
    { id: 'feedback', label: '6. Feedback' }
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'space-center':
        return (
          <div>
            <h2>Space Center Hub</h2>
            <p style={{ color: '#aaa' }}>Welcome back, Director {user?.email}. Agency overview coming soon.</p>
          </div>
        );
      case 'mission-control':
        return (
          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <MissionBriefing activeMission={activeMission} />
              <button onClick={() => setIsMissionActive(true)} style={{ padding: '15px', backgroundColor: '#28a745', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: '"Space Mono", monospace', fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 0 15px rgba(40, 167, 69, 0.4)', transition: 'all 0.2s ease' }}>
                INITIATE FLIGHT SEQUENCE &gt;&gt;
              </button>
            </div>
            <div style={{ flex: '1', backgroundColor: '#111', padding: '25px', borderRadius: '8px', border: '1px solid #333' }}>
              <h3 style={{ marginTop: 0, color: '#888', letterSpacing: '2px' }}>PROGRAM TYPE:</h3>
              <h2 style={{ color: '#fff', marginTop: '5px', marginBottom: '25px' }}>SOUNDING ROCKETS</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '15px' }}>
                {missions.map((mission, index) => {
                  const isLocked = index > unlockedMissionIndex;
                  const isSelected = index === currentMissionIndex;
                  return (
                    <button key={mission.id} onClick={() => !isLocked && setCurrentMissionIndex(index)} disabled={isLocked} style={{ aspectRatio: '1/1', backgroundColor: isLocked ? '#222' : isSelected ? '#4da8da' : '#2b2b36', color: isLocked ? '#555' : isSelected ? '#000' : '#fff', border: isSelected ? '2px solid #fff' : '1px solid #444', borderRadius: '6px', cursor: isLocked ? 'not-allowed' : 'pointer', fontFamily: '"Space Mono", monospace', fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', opacity: isLocked ? 0.6 : 1 }}>
                      {isLocked ? '🔒' : mission.id}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      case 'vab': return <h2>Vehicle Assembly Building (Sandbox Mode Offline)</h2>;
      case 'rnd': return <h2>Research & Development (Tech Tree Offline)</h2>;
      case 'flight-manual': return <h2>Flight Manual (Training Archives Offline)</h2>;
      case 'feedback': return <h2>Engineering Feedback Channel</h2>;
      default: return <h2>404 - Sector Not Found</h2>;
    }
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Initializing Telemetry...</div>;

  if (isMissionActive) {
    return (
      <div style={{ fontFamily: '"Space Mono", monospace', backgroundColor: 'transparent', color: '#fff' }}>
        <Meteor />
        <ActiveMission 
          activeMission={activeMission} 
          exitMission={() => setIsMissionActive(false)} 
          onMissionSuccess={() => {
            if (currentMissionIndex === unlockedMissionIndex) {
              setUnlockedMissionIndex(prev => prev + 1);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '"Space Mono", monospace', backgroundColor: 'transparent', color: '#fff', minHeight: '100vh' }}>
      <Meteor />
      <VabDoors isClosed={isDoorsClosed} />
      
      <header style={{ backgroundColor: '#111', padding: '15px 30px', borderBottom: '2px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, color: '#4da8da', fontSize: '1.5rem' }}>🚀 Command Subsystem</h1>
        {user && (
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: '"Space Mono", monospace' }}>
            Abort (Logout)
          </button>
        )}
      </header>

      {!user ? (
        <main style={{ padding: '40px' }}><Auth /></main>
      ) : (
        <div>
          <nav style={{ display: 'flex', backgroundColor: '#1a1a20', borderBottom: '1px solid #444', overflowX: 'auto' }}>
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => handleTabChange(tab.id)} style={{ flex: '1', padding: '15px 20px', backgroundColor: activeTab === tab.id ? '#2b2b36' : 'transparent', color: activeTab === tab.id ? '#4da8da' : '#888', border: 'none', borderBottom: activeTab === tab.id ? '3px solid #4da8da' : '3px solid transparent', cursor: 'pointer', fontFamily: '"Space Mono", monospace', fontWeight: 'bold', whiteSpace: 'nowrap', transition: 'all 0.2s ease' }}>
                {tab.label}
              </button>
            ))}
          </nav>
          <main style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            {renderActiveView()}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;