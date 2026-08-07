import React from 'react';
import { missions } from '../data/missions';

export default function SpaceCenter({ user, isGuest, unlockedMissionIndex }) {
  const nextMission = missions[unlockedMissionIndex] || missions[missions.length - 1];
  const isCompleted = unlockedMissionIndex >= missions.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeIn 0.5s ease' }}>
      {/* WELCOME BANNER */}
      <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '8px', border: '1px solid #4da8da', borderLeft: '4px solid #4da8da', boxShadow: '0 0 15px rgba(77, 168, 218, 0.1)' }}>
        <h2 style={{ color: '#fff', margin: '0 0 10px 0', letterSpacing: '2px' }}>AGENCY HEADQUARTERS</h2>
        <p style={{ color: '#aaa', margin: 0, fontSize: '1.1rem' }}>
          Welcome back, <strong style={{ color: '#4da8da' }}>{isGuest ? 'Guest Director' : `Director ${user?.email}`}</strong>. The vehicle assembly building is prepped for your next design.
        </p>
      </div>

      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
         <div style={{ backgroundColor: '#1a1a20', padding: '25px', border: '1px solid #333', borderRadius: '8px' }}>
           <h3 style={{ color: '#888', marginTop: 0, letterSpacing: '1px' }}>CURRENT OBJECTIVE</h3>
           <h2 style={{ color: isCompleted ? '#28a745' : '#fff', fontSize: '1.8rem', margin: '10px 0' }}>
             {isCompleted ? "CAMPAIGN COMPLETE" : nextMission.name}
           </h2>
           <p style={{ color: '#ccc', margin: 0 }}>Target Altitude: <strong style={{ color: '#ffc107' }}>{isCompleted ? "N/A" : `${nextMission.targetApogee} m`}</strong></p>
         </div>

         <div style={{ backgroundColor: '#1a1a20', padding: '25px', border: '1px solid #333', borderRadius: '8px' }}>
           <h3 style={{ color: '#888', marginTop: 0, letterSpacing: '1px' }}>AGENCY STATUS</h3>
           <p style={{ color: '#ccc', margin: '10px 0', fontSize: '1.1rem' }}>
             Missions Cleared: <strong style={{ color: '#28a745', marginLeft: '10px' }}>{Math.min(unlockedMissionIndex, missions.length)} / {missions.length}</strong>
           </p>
           <p style={{ color: '#ccc', margin: '10px 0', fontSize: '1.1rem' }}>
             Clearance Level: <strong style={{ color: '#4da8da', marginLeft: '10px' }}>Tier {Math.floor(unlockedMissionIndex / 2) + 1}</strong>
           </p>
         </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}