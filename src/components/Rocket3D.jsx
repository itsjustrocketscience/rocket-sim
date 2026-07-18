// src/components/Rocket3D.jsx
import React, { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { STLLoader } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei'; // 👈 The 3D Camera Controller!

// 1. IMPORT YOUR FUSION 360 ASSETS
import nose1_stl from '../assets/Nose_Cone_Light.stl?url';
import nose2_stl from '../assets/Nose_Cone_Heavy.stl?url';
import tube1_stl from '../assets/Fuselage_MkI.stl?url';
import tube2_stl from '../assets/Fuselage_MkII.stl?url';
import engine1_stl from '../assets/Engine_Sparrow.stl?url';
import engine2_stl from '../assets/Engine_Hawk.stl?url';
import fin_single_stl from '../assets/Fin_Master.stl?url';

export default function Rocket3D({ nose, tube, engine, finOffset, finCount, flightState, isScratchpad }) {
  const meshRef = useRef();
  
  // Only auto-rotate if the user isn't actively dragging the camera
  useFrame(() => {
    if (isScratchpad && meshRef.current) {
      meshRef.current.rotation.y += 0.005; 
    }
  });

  // 2. LOAD GEOMETRIES
  const geoNose1 = useLoader(STLLoader, nose1_stl);
  const geoNose2 = useLoader(STLLoader, nose2_stl);
  const geoTube1 = useLoader(STLLoader, tube1_stl);
  const geoTube2 = useLoader(STLLoader, tube2_stl);
  const geoEngine1 = useLoader(STLLoader, engine1_stl);
  const geoEngine2 = useLoader(STLLoader, engine2_stl);
  const geoFin = useLoader(STLLoader, fin_single_stl);

  const activeNose = nose.id === 'n1' ? geoNose1 : geoNose2;
  const activeTube = tube.id === 't1' ? geoTube1 : geoTube2;
  const activeEngine = engine.id === 'e1' ? geoEngine1 : geoEngine2;

  // --- THE SCALE & STACKING FIX ---
  // If the rocket is tiny, change this to 0.1 or 1.0! 
  const SCALE = 0.1; 
  
  // CRITICAL: Ensure the `height` numbers in your CATALOG exactly match your Fusion 360 millimeters!
  const engineHeight = engine.id === 'e1' ? 40 * SCALE : 70 * SCALE; 
  const tubeHeight = tube.height * SCALE; 
  
  const engineY = 0; 
  const tubeY = engineY + engineHeight; 
  const noseY = tubeY + tubeHeight;     
  const finY = tubeY + (finOffset * SCALE); 

  const finsArray = Array.from({ length: finCount || 4 });

  return (
    <>
      {/* 3D CAMERA CONTROLS: Lets the user click, drag, and zoom! */}
      <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

      {/* STUDIO LIGHTING: Bumping this up so black parts don't vanish */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 10]} intensity={2} />
      <directionalLight position={[-10, -10, -10]} intensity={0.5} />

      {/* THE MASTER ORIENTATION FIX: 
        rotation={[-Math.PI / 2, 0, 0]} tilts the entire Z-Up CAD model backward 90 degrees 
        so it perfectly matches the Y-Up WebGL world!
      */}
      <group ref={meshRef} position={[0, -2, 0]} scale={[SCALE, SCALE, SCALE]} rotation={[-Math.PI / 2, 0, 0]}> 
        
        {/* ENGINE */}
        <mesh geometry={activeEngine} position={[0, 0, engineY]}>
          <meshStandardMaterial color="#333333" roughness={0.7} metalness={0.5} />
        </mesh>
        
        {/* FUSELAGE */}
        <mesh geometry={activeTube} position={[0, 0, tubeY]}>
          <meshStandardMaterial color="#666666" roughness={0.4} metalness={0.3} />
        </mesh>
        
        {/* NOSE CONE */}
        <mesh geometry={activeNose} position={[0, 0, noseY]}>
          <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* DYNAMIC FINS */}
        {finsArray.map((_, index) => {
          const angleInRadians = (index * (360 / finCount) * Math.PI) / 180;
          return (
            <mesh 
              key={index} 
              geometry={geoFin} 
              position={[0, 0, finY]} 
              // Math.PI flips the clipped delta fins right-side up!
              rotation={[Math.PI, angleInRadians, 0]} 
            >
              <meshStandardMaterial color="#4da8da" roughness={0.3} />
            </mesh>
          );
        })}

        {/* ENGINE THRUST PLUME */}
        {flightState === 'POWERED' && (
          <mesh position={[0, 0, -20]}>
            <coneGeometry args={[15, 60, 16]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.8} />
          </mesh>
        )}
      </group>
    </>
  );
}