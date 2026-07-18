import React from 'react';

export default function VabDoors({ isClosed }) {
  const doorEasing = 'cubic-bezier(0.7, 0, 0.2, 1)';
  const transitionTime = '0.7s';
  const segments = [0, 1, 2, 3, 4];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {segments.map((i) => {
        const isBottomEdge = i === 4;
        const panelHeight = (i + 1) * 20;

        return (
          <div key={`door-${i}`} style={{
            position: 'absolute', top: 0, width: '100%', height: `${panelHeight}vh`, 
            backgroundColor: '#868c99', borderBottom: '4px solid #3a3d45', boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 5 - i, transform: isClosed ? 'translateY(0)' : 'translateY(-100%)', transition: `transform ${transitionTime} ${doorEasing} ${(4 - i) * 0.1}s`,
            display: 'flex', alignItems: 'flex-end', backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,0.06) 20px, rgba(0,0,0,0.06) 40px)'
          }}>
            {isBottomEdge && (
              <div style={{ width: '100%', height: '25px', backgroundImage: 'repeating-linear-gradient(45deg, #e5a910, #e5a910 20px, #222 20px, #222 40px)', borderTop: '3px solid #222' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}