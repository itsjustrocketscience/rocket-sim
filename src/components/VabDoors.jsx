// src/components/VabDoors.jsx
import React from 'react';

export default function VabDoors({ isClosed }) {
  const doorEasing = 'cubic-bezier(0.7, 0, 0.2, 1)';
  const transitionTime = '0.7s';
  const segments = [0, 1, 2, 3, 4];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      pointerEvents: 'none', zIndex: 9999, overflow: 'hidden'
    }}>
      
      {segments.map((i) => {
        const isBottomEdge = i === 4;
        
        // Instead of 20% strips, we make them progressively taller: 20%, 40%, 60%, 80%, 100%
        const panelHeight = (i + 1) * 20;

        return (
          <div key={`door-${i}`} style={{
            position: 'absolute',
            top: 0, // ALL panels anchor to the absolute top of the screen
            width: '100%',
            height: `${panelHeight}vh`, 
            
            backgroundColor: '#868c99',
            borderBottom: '4px solid #3a3d45', // Thicker, heavier bottom edge for the metal panels
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            
            // The shortest panel (top) has the highest z-index so it sits in front
            zIndex: 5 - i,
            
            // translateY(-100%) moves each panel up by its exact height, tucking them perfectly flush into the ceiling
            transform: isClosed ? 'translateY(0)' : 'translateY(-100%)',
            transition: `transform ${transitionTime} ${doorEasing} ${(4 - i) * 0.1}s`,
            
            display: 'flex',
            alignItems: 'flex-end', // Pushes the caution tape to the very bottom
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.06) 20px, rgba(0,0,0,0.06) 40px)'
          }}>
            
            {/* Caution tape strictly on the massive 100% bottom panel */}
            {isBottomEdge && (
              <div style={{ 
                width: '100%', 
                height: '25px', 
                backgroundImage: 'repeating-linear-gradient(45deg, #e5a910, #e5a910 20px, #222 20px, #222 40px)',
                borderTop: '3px solid #222'
              }} />
            )}
          </div>
        );
      })}

    </div>
  );
}