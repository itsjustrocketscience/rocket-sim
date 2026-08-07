// src/components/ResearchAndDevelopment.jsx
import React from 'react';

export default function ResearchAndDevelopment({ unlockedMissionIndex }) {
  // Every 2 missions unlocks a new tier! (Tier 1 is always unlocked)
  const currentTier = Math.floor(unlockedMissionIndex / 2) + 1;

  const tiers = [
    {
      level: 1,
      title: "TIER 1: SUBORBITAL BASICS",
      nodes: [
        { name: 'Sparrow Solid Motor', type: 'PROPULSION', color: '#ff4d4d', desc: 'Basic solid rocket motor. Reliable but low efficiency (Isp).' },
        { name: 'Mk1 Sounding Tube', type: 'FUSELAGE', color: '#4da8da', desc: 'Standard lightweight aluminum airframe. Holds 40kg of propellant.' },
        { name: 'Aero Cone (Light)', type: 'AERODYNAMICS', color: '#28a745', desc: 'Low drag, low mass nose cone. Ideal for small payloads.' }
      ]
    },
    {
      level: 2,
      title: "TIER 2: ATMOSPHERIC MASTERY",
      nodes: [
        { name: 'Hawk Hybrid Motor', type: 'PROPULSION', color: '#ff4d4d', desc: 'Advanced hybrid motor. Higher thrust-to-weight ratio.' },
        { name: 'Mk2 Extended Tube', type: 'FUSELAGE', color: '#4da8da', desc: 'Double fuel capacity (80kg). Heavier structural mass.' },
        { name: 'Heavy Nose (Stable)', type: 'AERODYNAMICS', color: '#28a745', desc: 'Moves Center of Mass forward to prevent aerodynamic tumbling.' }
      ]
    },
    {
      level: 3,
      title: "TIER 3: KARMAN LINE (PROTOTYPING)",
      nodes: [
        { name: 'Peregrine Liquid Engine', type: 'PROPULSION', color: '#ff4d4d', desc: 'Advanced turbopump engine. Extremely high Delta-V output.' },
        { name: 'Carbon Composite Fins', type: 'AERODYNAMICS', color: '#28a745', desc: 'Ultralight control surfaces with high heat tolerance.' }
      ]
    }
  ];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease', paddingBottom: '40px' }}>
      <div style={{ backgroundColor: '#111', padding: '30px', borderRadius: '8px', border: '1px solid #9c27b0', borderLeft: '4px solid #9c27b0', marginBottom: '30px' }}>
        <h2 style={{ color: '#9c27b0', margin: '0 0 10px 0', letterSpacing: '2px' }}>RESEARCH & DEVELOPMENT</h2>
        <p style={{ color: '#aaa', margin: 0 }}>
          Agency Tech Level: <strong style={{ color: '#fff' }}>TIER {currentTier}</strong>. Complete more campaign missions to secure funding and unlock new aerospace components.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {tiers.map((tier) => {
          const isUnlocked = currentTier >= tier.level;
          
          return (
            <div key={tier.level} style={{ opacity: isUnlocked ? 1 : 0.4, transition: 'opacity 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: isUnlocked ? '#9c27b0' : '#333', color: isUnlocked ? '#fff' : '#666', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {isUnlocked ? tier.level : '🔒'}
                </div>
                <h3 style={{ margin: 0, color: isUnlocked ? '#fff' : '#666', letterSpacing: '1px' }}>
                  {tier.title}
                </h3>
                <div style={{ flex: 1, height: '1px', backgroundColor: isUnlocked ? '#9c27b0' : '#333' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', paddingLeft: '55px' }}>
                {tier.nodes.map((node, index) => (
                  <div key={index} style={{ backgroundColor: '#1a1a20', border: `1px solid ${isUnlocked ? node.color : '#333'}`, borderRadius: '8px', padding: '20px', boxShadow: isUnlocked ? `0 0 15px ${node.color}20` : 'none', position: 'relative', overflow: 'hidden' }}>
                    
                    {/* The Background Type Label (FUSELAGE, PROPULSION, etc) */}
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '3rem', fontWeight: '900', color: '#fff', opacity: 0.03, pointerEvents: 'none' }}>
                      {node.type}
                    </div>

                    <div style={{ fontSize: '0.75rem', color: isUnlocked ? node.color : '#555', fontWeight: 'bold', marginBottom: '5px', letterSpacing: '1px' }}>
                      {node.type}
                    </div>
                    <h4 style={{ margin: '0 0 10px 0', color: isUnlocked ? '#fff' : '#666', fontSize: '1.1rem' }}>
                      {node.name}
                    </h4>
                    <p style={{ margin: 0, color: isUnlocked ? '#aaa' : '#444', fontSize: '0.9rem', lineHeight: '1.4' }}>
                      {node.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}