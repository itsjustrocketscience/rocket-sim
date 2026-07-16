// src/components/Meteor.jsx
import React, { useState, useEffect } from 'react';

export default function Meteor() {
  const [vector, setVector] = useState(null);

  useEffect(() => {
    const fireMeteor = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // 50% chance for a massive cross-sky streak, 50% chance for a short burn
      const isLongStreak = Math.random() > 0.5;
      
      let startX, startY, distance, angle, duration;

      if (isLongStreak) {
        // LONG STREAK: Target a point on screen, but start and end far off-screen
        const targetX = Math.random() * w;
        const targetY = Math.random() * h;
        const angleRad = Math.random() * Math.PI * 2;
        
        distance = Math.max(w, h) * (1.5 + Math.random()); // 1.5x to 2.5x screen size
        startX = targetX - Math.cos(angleRad) * (distance / 2);
        startY = targetY - Math.sin(angleRad) * (distance / 2);
        angle = angleRad * (180 / Math.PI);
        
        duration = 0.6; // Slightly longer duration to account for massive distance
      } else {
        // SHORT STREAK: Our original logic
        startX = Math.random() * w;
        startY = Math.random() * h;
        const endX = Math.random() * w;
        const endY = Math.random() * h;
        
        distance = Math.hypot(endX - startX, endY - startY);
        angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
        
        duration = 0.3; // Your super-fast 0.3s timing
      }

      setVector({ startX, startY, distance, angle, duration, key: Date.now() });
    };

    // Fire one immediately, then loop every 10 seconds
    fireMeteor();
    const interval = setInterval(fireMeteor, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!vector) return null;

  return (
    <div 
      key={vector.key} 
      style={{
        position: 'fixed',
        top: `${vector.startY}px`,
        left: `${vector.startX}px`,
        width: `${vector.distance}px`,
        height: '2px',
        transform: `rotate(${vector.angle}deg)`,
        transformOrigin: 'left center',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <div 
        style={{
          width: '150px',
          height: '2px',
          background: 'linear-gradient(to right, transparent, rgba(77, 168, 218, 0.8), #fff)',
          boxShadow: '0 0 10px #4da8da, 0 0 20px #4da8da',
          borderRadius: '50%',
          // Uses the dynamic duration we calculated in the math above!
          animation: `traverseVector ${vector.duration}s ease-in-out forwards`
        }}
      />
      
      <style>{`
        @keyframes traverseVector {
          0% { transform: translateX(0) scaleX(0); opacity: 0; }
          15% { opacity: 1; transform: translateX(${vector.distance * 0.15}px) scaleX(1); }
          85% { opacity: 1; transform: translateX(${vector.distance * 0.85}px) scaleX(1); }
          100% { transform: translateX(${vector.distance}px) scaleX(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}