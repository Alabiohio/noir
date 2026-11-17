import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { StudioEnvironment } from './StudioEnvironment';
import { BrutalistLuxuryResidence } from './hero/BrutalistLuxuryResidence';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useWebGLCapability } from '../../hooks/useWebGLCapability';

interface PointerRef {
  x: number;
  y: number;
}

export function HeroBrutalistScene() {
  const prefersReduced = useReducedMotion();
  const capability = useWebGLCapability();
  const pointerRef = useRef<PointerRef>({ x: 0, y: 0 });
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      pointerRef.current.x = THREE.MathUtils.clamp(nx, -1, 1);
      pointerRef.current.y = THREE.MathUtils.clamp(ny, -1, 1);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  if (!capability.supported || contextLost) {
    return (
      <div
        aria-hidden="true"
        className="w-full h-full bg-gradient-to-br from-[#121417] via-[#0b0c0e] to-[#171c22]"
      />
    );
  }

  return (
    <div className="w-full h-full relative" aria-hidden="true">
      <Canvas
        dpr={capability.maxDpr}
        shadows={!capability.isSoftwareGl}
        camera={{
          position: capability.isMobile ? [12.4, 5.2, 18.4] : [13.8, 5.0, 15.6],
          fov: capability.isMobile ? 40 : 35,
          near: 0.2,
          far: 110,
        }}
        gl={{
          antialias: !capability.isSoftwareGl,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.08,
        }}
        onCreated={({ gl }) => {
          const canvas = gl.domElement;
          canvas.addEventListener('webglcontextlost', (event) => {
            event.preventDefault();
            setContextLost(true);
          });
          canvas.addEventListener('webglcontextrestored', () => {
            setContextLost(false);
          });
        }}
      >
        <color attach="background" args={['#0b0c0e']} />
        <fog attach="fog" args={['#0b0c0e', 18, 48]} />

        {/* Subtle Studio Environmental Reflections */}
        <StudioEnvironment />

        {/* Soft Ambient Sky/Ground Hemisphere Fill */}
        <hemisphereLight args={['#94acc4', '#16191e', 0.62]} />

        {/* Cinematic Key Directional Sun Light casting Dramatic Architectural Shadows */}
        <directionalLight
          position={[15, 21, 13]}
          intensity={2.15}
          color="#eef3f8"
          castShadow={!capability.isSoftwareGl}
          shadow-mapSize={capability.isMobile ? [1024, 1024] : [2048, 2048]}
          shadow-camera-near={1}
          shadow-camera-far={55}
          shadow-camera-left={-14}
          shadow-camera-right={14}
          shadow-camera-top={14}
          shadow-camera-bottom={-14}
          shadow-bias={-0.0004}
          shadow-normalBias={0.02}
        />

        {/* Cool Architectural Rim Light separating concrete volumes from obsidian sky */}
        <directionalLight position={[-14, 10, -12]} intensity={0.78} color="#7690b2" />

        {/* Realistic Ground Contact Shadows on Hardware GPUs */}
        {!capability.isSoftwareGl && !capability.isMobile && (
          <ContactShadows
            position={[3.15, -1.13, 0]}
            opacity={0.55}
            scale={28}
            blur={2.2}
            far={8}
            resolution={512}
            frames={1}
          />
        )}

        <BrutalistLuxuryResidence
          pointerRef={pointerRef}
          prefersReduced={prefersReduced}
          isMobile={capability.isMobile}
        />
      </Canvas>
    </div>
  );
}
