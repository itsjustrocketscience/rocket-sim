import apogeeLogo from './assets/apogee_logo.png';
import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import Auth from './components/Auth';
import MissionBriefing from './components/MissionBriefing';
import { missions } from './data/missions';
import ActiveMission from './components/ActiveMission';
import Meteor from './components/Meteor';
import VabDoors from './components/VabDoors';
import ResearchAndDevelopment from './components/ResearchAndDevelopment';
import Sandbox from './components/Sandbox';

// NEW COMPONENTS
import SpaceCenter from './components/SpaceCenter';
import FlightManual from './components/FlightManual';
import Feedback from './components/Feedback';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [unlockedMissionIndex, setUnlockedMissionIndex] = useState(0);
  const [isMissionActive, setIsMissionActive] = useState(false);
  
  const [activeTab, setActiveTab] = useState('space-center');
  const [isDoorsClosed, setIsDoorsClosed] = useState(false);

  const activeMission = missions[currentMissionIndex];

  // 1. MASTER AUTH & SYNC LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        let cloudProgress = 0;
        if (userDoc.exists()) {
          cloudProgress = userDoc.data().unlockedMissionIndex || 0;
        }

        const guestProgress = parseInt(localStorage.getItem('apogee_guest_progress')) || 0;
        const highestProgress = Math.max(cloudProgress, guestProgress);
        setUnlockedMissionIndex(highestProgress);

        if (highestProgress > cloudProgress || !userDoc.exists()) {
          await setDoc(userDocRef, { unlockedMissionIndex: highestProgress }, { merge: true });
        }

        localStorage.removeItem('apogee_guest_progress');
        setIsGuest(false);
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  // 2. GUEST MODE STARTUP
  useEffect(() => {
    if (isGuest && !user) {
      const savedProgress = parseInt(localStorage.getItem('apogee_guest_progress')) || 0;
      setUnlockedMissionIndex(savedProgress);
    }
  }, [isGuest, user]);

  // 3. MASTER SAVE FUNCTION 
  const handleMissionSuccess = async () => {
    if (currentMissionIndex === unlockedMissionIndex) {
      const newIndex = unlockedMissionIndex + 1;
      setUnlockedMissionIndex(newIndex); 

      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { unlockedMissionIndex: newIndex }, { merge: true });
      } else if (isGuest) {
        localStorage.setItem('apogee_guest_progress', newIndex.toString());
      }
    }
  };

  const handleLogout = async () => {
    if (isGuest) {
      setIsGuest(false);
      setCurrentMissionIndex(0);
      setActiveTab('space-center');
    } else {
      await signOut(auth);
      setCurrentMissionIndex(0);
      setActiveTab('space-center');
    }
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
    { id: 'sandbox', label: '3. Sandbox Mode' },
    { id: 'rnd', label: '4. R&D' },
    { id: 'flight-manual', label: '5. Flight Manual' },
    { id: 'feedback', label: '6. Feedback' }
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'space-center':
        return <SpaceCenter user={user} isGuest={isGuest} unlockedMissionIndex={unlockedMissionIndex} />;
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
      case 'sandbox': 
        return <Sandbox exitSandbox={() => setActiveTab('space-center')} />;
      case 'rnd': 
        return <ResearchAndDevelopment unlockedMissionIndex={unlockedMissionIndex} />;
      case 'flight-manual': return <FlightManual />;
      case 'feedback': return <Feedback />;
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
          onMissionSuccess={handleMissionSuccess} 
        />
      </div>
    );
  }

  const isAuthorized = user || isGuest;

  return (
    <div style={{ fontFamily: '"Space Mono", monospace', backgroundColor: 'transparent', color: '#fff', minHeight: '100vh' }}>
      <Meteor />
      <VabDoors isClosed={isDoorsClosed} />
      
      <header style={{ backgroundColor: '#111', padding: '15px 30px', borderBottom: '2px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src={apogeeLogo} alt="Apogee Logo" style={{ height: '35px' }} />
          <h1 style={{ margin: 0, color: '#4da8da', fontSize: '1.5rem', letterSpacing: '3px' }}>CONTROL CENTER</h1>
        </div>
        {isAuthorized && (
          <button onClick={handleLogout} style={{ padding: '8px 16px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: '"Space Mono", monospace' }}>
            Abort ({isGuest ? 'Guest Mode' : 'Logout'})
          </button>
        )}
      </header>

      {!isAuthorized ? (
        <main style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '8vh', gap: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
            <img src={apogeeLogo} alt="Apogee Logo" style={{ height: '160px', filter: 'drop-shadow(0 0 25px rgba(77, 168, 218, 0.6))' }} />
          </div>
          
          <Auth />
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>--------- OR ---------</span>
            <button 
              onClick={() => setIsGuest(true)} 
              style={{ padding: '12px 30px', backgroundColor: 'transparent', color: '#4da8da', border: '2px solid #4da8da', borderRadius: '4px', cursor: 'pointer', fontFamily: '"Space Mono", monospace', fontSize: '1.1rem', fontWeight: 'bold', transition: 'all 0.2s ease', boxShadow: '0 0 10px rgba(77, 168, 218, 0.2)' }}
              onMouseOver={(e) => { e.target.style.backgroundColor = 'rgba(77, 168, 218, 0.1)'; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; }}
            >
              🚀 INITIATE GUEST SEQUENCE
            </button>
          </div>
        </main>
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