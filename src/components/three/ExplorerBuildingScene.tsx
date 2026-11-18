import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { StudioEnvironment } from './StudioEnvironment';
import {
  createArchitecturalGridTexture,
  createBoardFormedConcreteTextures,
  createBrushedBronzeTextures,
  createCharredTimberTextures,
  createTravertineTextures,
} from './proceduralTextures';
import type { ArchitecturalMaterialId, CameraPreset } from '../../data/studioData';
import { EXPLORER_MATERIALS } from '../../data/studioData';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useWebGLCapability } from '../../hooks/useWebGLCapability';

interface ExplorerBuildingSceneProps {
  lightingMode: 'day' | 'night';
  materialId: ArchitecturalMaterialId;
  cameraPreset: CameraPreset;
  exploded: boolean;
  active: boolean;
}

const DAY_BG = new THREE.Color('#c8cdd3');
const NIGHT_BG = new THREE.Color('#0b0c0e');
const DAY_SUN = new THREE.Color('#eef2f6');
const NIGHT_MOON = new THREE.Color('#7c93b8');
const _lerpColor = new THREE.Color();
const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();

function createOculusRoofGeometry(): THREE.ExtrudeGeometry {
  const outer = new THREE.Shape();
  const w = 5.4;
  const d = 2.6;
  outer.moveTo(-w, -d);
  outer.lineTo(w, -d);
  outer.lineTo(w, d);
  outer.lineTo(-w, d);
  outer.closePath();

  // Rectangular architectural oculus courtyard void
  const hole = new THREE.Path();
  hole.moveTo(-1.7, -1.1);
  hole.lineTo(1.1, -1.1);
  hole.lineTo(1.1, 1.1);
  hole.lineTo(-1.7, 1.1);
  hole.closePath();
  outer.holes.push(hole);

  const geom = new THREE.ExtrudeGeometry(outer, {
    depth: 0.42,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 2,
  });
  geom.rotateX(Math.PI / 2);
  return geom;
}

function ModernExplorerBuilding({
  lightingMode,
  materialId,
  cameraPreset,
  exploded,
  active,
  isSoftwareGl,
  prefersReduced,
}: ExplorerBuildingSceneProps & { isSoftwareGl: boolean; prefersReduced: boolean }) {
  const { scene, camera, invalidate } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const presetTransitionActiveRef = useRef(true);
  const nightFactorRef = useRef(lightingMode === 'night' ? 1 : 0);
  const explodeFactorRef = useRef(exploded ? 1 : 0);

  const dirLightRef = useRef<THREE.DirectionalLight>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight>(null);
  const interiorLightARef = useRef<THREE.PointLight>(null);
  const interiorLightBRef = useRef<THREE.PointLight>(null);
  const soffitLightRef = useRef<THREE.PointLight>(null);

  const roofGroupRef = useRef<THREE.Group>(null);
  const upperWingRef = useRef<THREE.Group>(null);
  const louverGroupRef = useRef<THREE.Group>(null);
  const louverInstancedRef = useRef<THREE.InstancedMesh>(null);
  const interiorGlowMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const soffitGlowMatRef = useRef<THREE.MeshStandardMaterial>(null);

  const texturesMap = useMemo(() => {
    return {
      concrete: createBoardFormedConcreteTextures(),
      travertine: createTravertineTextures(),
      titanium: createBrushedBronzeTextures(),
      charred: createCharredTimberTextures(),
      grid: createArchitecturalGridTexture(),
    };
  }, []);

  const oculusRoofGeometry = useMemo(() => createOculusRoofGeometry(), []);

  useEffect(() => {
    return () => {
      texturesMap.concrete.albedo.dispose();
      texturesMap.concrete.bump.dispose();
      texturesMap.travertine.albedo.dispose();
      texturesMap.travertine.bump.dispose();
      texturesMap.titanium.albedo.dispose();
      texturesMap.titanium.bump.dispose();
      texturesMap.charred.albedo.dispose();
      texturesMap.charred.bump.dispose();
      texturesMap.grid.dispose();
      oculusRoofGeometry.dispose();
    };
  }, [texturesMap, oculusRoofGeometry]);

  useEffect(() => {
    presetTransitionActiveRef.current = true;
    _targetPos.set(...cameraPreset.position);
    _targetLook.set(...cameraPreset.target);
    invalidate();
  }, [cameraPreset, invalidate]);

  useEffect(() => {
    invalidate();
  }, [lightingMode, exploded, invalidate]);

  useEffect(() => {
    invalidate();
  }, [active, invalidate]);

  const activeMatConfig = useMemo(
    () => EXPLORER_MATERIALS.find((m) => m.id === materialId) || EXPLORER_MATERIALS[0],
    [materialId]
  );

  const activeTextures = texturesMap[materialId];

  const primaryMaterialProps = useMemo(
    () => ({
      color: materialId === 'travertine' ? '#ced3d9' : materialId === 'titanium' ? '#858f9c' : materialId === 'charred' ? '#2c2f34' : '#7a7f86',
      map: activeTextures.albedo,
      bumpMap: activeTextures.bump,
      bumpScale: materialId === 'titanium' ? 0.018 : 0.04,
      roughness: activeMatConfig.roughness,
      metalness: activeMatConfig.metalness,
    }),
    [materialId, activeTextures, activeMatConfig]
  );

  const louverCount = 20;
  useLayoutEffect(() => {
    if (!louverInstancedRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < louverCount; i++) {
      dummy.position.set(-3.8 + i * 0.38, 3.15, 2.48);
      dummy.rotation.set(0, 0.22, 0);
      dummy.updateMatrix();
      louverInstancedRef.current.setMatrixAt(i, dummy.matrix);
    }
    louverInstancedRef.current.instanceMatrix.needsUpdate = true;
    louverInstancedRef.current.computeBoundingSphere();
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const speed = prefersReduced ? 30 : 4.2;

    // Smooth Day <-> Night interpolation
    const targetNight = lightingMode === 'night' ? 1 : 0;
    nightFactorRef.current = THREE.MathUtils.damp(nightFactorRef.current, targetNight, speed, dt);
    const nf = nightFactorRef.current;

    _lerpColor.copy(DAY_BG).lerp(NIGHT_BG, nf);
    if (scene.background instanceof THREE.Color) {
      scene.background.copy(_lerpColor);
    } else {
      scene.background = _lerpColor.clone();
    }
    if (scene.fog) {
      scene.fog.color.copy(_lerpColor);
    }

    if (dirLightRef.current) {
      dirLightRef.current.intensity = THREE.MathUtils.lerp(2.45, 0.65, nf);
      dirLightRef.current.color.copy(DAY_SUN).lerp(NIGHT_MOON, nf);
      dirLightRef.current.position.set(
        THREE.MathUtils.lerp(14, -10, nf),
        THREE.MathUtils.lerp(19, 14, nf),
        THREE.MathUtils.lerp(13, -8, nf)
      );
    }

    if (hemiLightRef.current) {
      hemiLightRef.current.intensity = THREE.MathUtils.lerp(0.88, 0.3, nf);
    }

    const warmGlow = THREE.MathUtils.lerp(0.18, 6.2, nf);
    if (interiorLightARef.current) interiorLightARef.current.intensity = warmGlow;
    if (interiorLightBRef.current) interiorLightBRef.current.intensity = warmGlow * 0.85;
    if (soffitLightRef.current) soffitLightRef.current.intensity = THREE.MathUtils.lerp(0.1, 4.4, nf);

    if (interiorGlowMatRef.current) {
      interiorGlowMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(0.12, 1.9, nf);
    }
    if (soffitGlowMatRef.current) {
      soffitGlowMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(0.25, 2.5, nf);
    }

    // Smooth Tectonic Exploded View interpolation
    const targetExplode = exploded ? 1 : 0;
    explodeFactorRef.current = THREE.MathUtils.damp(explodeFactorRef.current, targetExplode, 5.0, dt);
    const ef = explodeFactorRef.current;

    if (upperWingRef.current) {
      upperWingRef.current.position.y = ef * 1.35;
    }
    if (louverGroupRef.current) {
      louverGroupRef.current.position.z = ef * 1.45;
      louverGroupRef.current.position.y = ef * 1.35;
    }
    if (roofGroupRef.current) {
      roofGroupRef.current.position.y = ef * 3.1;
    }

    // Smooth Camera Preset Transitions (cancels immediately on OrbitControls start)
    if (presetTransitionActiveRef.current && controlsRef.current) {
      if (prefersReduced) {
        camera.position.copy(_targetPos);
        controlsRef.current.target.copy(_targetLook);
        controlsRef.current.update();
        presetTransitionActiveRef.current = false;
      } else {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetPos.x, 4.5, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetPos.y, 4.5, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetPos.z, 4.5, dt);

        controlsRef.current.target.x = THREE.MathUtils.damp(controlsRef.current.target.x, _targetLook.x, 4.5, dt);
        controlsRef.current.target.y = THREE.MathUtils.damp(controlsRef.current.target.y, _targetLook.y, 4.5, dt);
        controlsRef.current.target.z = THREE.MathUtils.damp(controlsRef.current.target.z, _targetLook.z, 4.5, dt);
        controlsRef.current.update();

        if (
          camera.position.distanceTo(_targetPos) < 0.05 &&
          controlsRef.current.target.distanceTo(_targetLook) < 0.05
        ) {
          presetTransitionActiveRef.current = false;
        }
      }
    }

    const lightingInTransition = Math.abs(nf - targetNight) > 0.001;
    const explosionInTransition = Math.abs(ef - targetExplode) > 0.001;
    if (
      lightingInTransition ||
      explosionInTransition ||
      presetTransitionActiveRef.current
    ) {
      invalidate();
    }
  });

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        enableDamping={!isSoftwareGl && !prefersReduced}
        dampingFactor={0.06}
        rotateSpeed={0.65}
        minPolarAngle={0.22}
        maxPolarAngle={Math.PI / 2 - 0.04}
        onStart={() => {
          presetTransitionActiveRef.current = false;
        }}
      />

      <hemisphereLight ref={hemiLightRef} args={['#d9e2ec', '#1d2026', 0.88]} />
      <directionalLight
        ref={dirLightRef}
        position={[14, 19, 13]}
        intensity={2.45}
        color="#eef2f6"
        castShadow={!isSoftwareGl}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={48}
        shadow-camera-left={-11}
        shadow-camera-right={11}
        shadow-camera-top={11}
        shadow-camera-bottom={-11}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-12, 7, -10]} intensity={0.55} color="#8ba1be" />

      <group position={[0, -0.4, 0]}>
        {/* Architectural Datum Grid */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
          <planeGeometry args={[48, 48]} />
          <meshStandardMaterial
            map={texturesMap.grid}
            transparent
            opacity={0.6}
            roughness={0.95}
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>

        {/* Ground Plinth & Stepped Retaining Walls */}
        <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
          <boxGeometry args={[13.6, 0.36, 9.8]} />
          <meshStandardMaterial color="#1d1e21" roughness={0.9} metalness={0.05} />
        </mesh>

        {/* Reflection Pool Basin */}
        <mesh position={[-2.1, 0.37, 2.3]} receiveShadow>
          <boxGeometry args={[7.8, 0.06, 4.2]} />
          <meshPhysicalMaterial
            color="#0b1015"
            roughness={0.05}
            metalness={0.28}
            clearcoat={1}
            clearcoatRoughness={0.06}
          />
        </mesh>

        {/* Stepped Terrace & Honed Floor Plate */}
        <mesh position={[1.1, 0.44, -0.8]} receiveShadow castShadow>
          <boxGeometry args={[10.4, 0.18, 7.2]} />
          <meshStandardMaterial color="#2a2a2d" roughness={0.78} metalness={0.08} />
        </mesh>

        {/* Ground Floor Structural Core & Feature Shear Wall */}
        <mesh position={[2.6, 1.45, -1.6]} castShadow receiveShadow>
          <boxGeometry args={[4.4, 1.9, 3.8]} />
          <meshStandardMaterial {...primaryMaterialProps} />
        </mesh>

        <mesh position={[-3.3, 1.45, -2.3]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 1.9, 2.8]} />
          <meshStandardMaterial {...primaryMaterialProps} />
        </mesh>

        {/* Ground Floor Glazed Gallery Box */}
        <mesh position={[0.1, 1.44, 0.55]}>
          <boxGeometry args={[5.8, 1.82, 0.08]} />
          <meshPhysicalMaterial
            color="#a2b6c2"
            roughness={0.06}
            metalness={0.1}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>

        {/* Blackened Steel Structural Mullions */}
        {[-2.75, -0.9, 0.95, 2.85].map((mx, i) => (
          <mesh key={i} position={[mx, 1.44, 0.56]} castShadow>
            <boxGeometry args={[0.07, 1.84, 0.12]} />
            <meshStandardMaterial color="#141416" roughness={0.32} metalness={0.82} />
          </mesh>
        ))}

        {/* Interior Illuminated Living/Exhibition Gallery Backdrop */}
        <mesh position={[0.1, 1.38, -0.6]}>
          <boxGeometry args={[4.8, 1.5, 1.6]} />
          <meshStandardMaterial
            ref={interiorGlowMatRef}
            color="#262b33"
            emissive="#a8bed4"
            emissiveIntensity={0.2}
            roughness={0.72}
          />
        </mesh>

        {/* Exterior Sculptural Cantilever Staircase */}
        {Array.from({ length: 8 }).map((_, idx) => (
          <mesh
            key={idx}
            position={[-4.5 + idx * 0.34, 0.68 + idx * 0.22, -1.7]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.42, 0.1, 1.15]} />
            <meshStandardMaterial color="#2f3238" roughness={0.76} metalness={0.12} />
          </mesh>
        ))}

        {/* UPPER CANTILEVERED PAVILION WING (Explodable Layer 1) */}
        <group ref={upperWingRef}>
          {/* Primary Cantilevered Floor Slab */}
          <mesh position={[-0.6, 2.52, 0.2]} castShadow receiveShadow>
            <boxGeometry args={[10.8, 0.32, 4.9]} />
            <meshStandardMaterial {...primaryMaterialProps} />
          </mesh>

          {/* Cantilevered North & West Solid Shear Facade */}
          <mesh position={[-0.6, 3.48, -2.0]} castShadow receiveShadow>
            <boxGeometry args={[10.8, 1.65, 0.42]} />
            <meshStandardMaterial {...primaryMaterialProps} />
          </mesh>

          <mesh position={[-5.78, 3.48, 0.2]} castShadow receiveShadow>
            <boxGeometry args={[0.44, 1.65, 4.9]} />
            <meshStandardMaterial {...primaryMaterialProps} />
          </mesh>

          <mesh position={[4.58, 3.48, 0.2]} castShadow receiveShadow>
            <boxGeometry args={[0.44, 1.65, 4.9]} />
            <meshStandardMaterial {...primaryMaterialProps} />
          </mesh>

          {/* Cantilevered Mezzanine Interior Floor Plate & Titanium Balustrade */}
          <mesh position={[1.4, 2.7, 0.2]} receiveShadow>
            <boxGeometry args={[5.8, 0.08, 3.8]} />
            <meshStandardMaterial color="#878d96" roughness={0.55} metalness={0.08} />
          </mesh>

          <mesh position={[-1.4, 3.12, 0.2]}>
            <boxGeometry args={[0.05, 0.78, 3.8]} />
            <meshStandardMaterial color="#94aabf" roughness={0.28} metalness={0.88} />
          </mesh>

          {/* Upper Panoramic Glazed Curtain Wall */}
          <mesh position={[-0.6, 3.45, 2.38]}>
            <boxGeometry args={[9.9, 1.54, 0.08]} />
            <meshPhysicalMaterial
              color="#9eb4c2"
              roughness={0.06}
              metalness={0.14}
              transparent
              opacity={0.38}
              depthWrite={false}
            />
          </mesh>

          {/* Concealed Architectural Soffit Light Trough */}
          <mesh position={[-2.9, 2.34, 0.2]}>
            <boxGeometry args={[5.6, 0.04, 0.14]} />
            <meshStandardMaterial
              ref={soffitGlowMatRef}
              color="#dce6f0"
              emissive="#b6c9db"
              emissiveIntensity={0.4}
              roughness={0.25}
              metalness={0.6}
            />
          </mesh>
        </group>

        {/* ANODIZED TITANIUM FACADE LOUVER SCREEN (Explodable Layer 2) */}
        <group ref={louverGroupRef}>
          <instancedMesh
            ref={louverInstancedRef}
            args={[undefined, undefined, louverCount]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.055, 1.56, 0.24]} />
            <meshStandardMaterial
              color="#8e9aa6"
              map={texturesMap.titanium.albedo}
              roughness={0.26}
              metalness={0.88}
            />
          </instancedMesh>
        </group>

        {/* EXTRUDED OCULUS ROOF CANOPY (Explodable Layer 3) */}
        <group ref={roofGroupRef}>
          <mesh
            geometry={oculusRoofGeometry}
            position={[-0.6, 4.65, 0.2]}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial {...primaryMaterialProps} />
          </mesh>

          {/* Titanium Oculus Skylight Perimeter Collar */}
          <mesh position={[-0.9, 4.5, 0.2]}>
            <boxGeometry args={[2.86, 0.12, 2.26]} />
            <meshStandardMaterial
              color="#94aabf"
              roughness={0.28}
              metalness={0.88}
              wireframe={false}
              transparent
              opacity={0.22}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* Nocturnal Crisp Gallery Interior Point Lights */}
        <pointLight
          ref={interiorLightARef}
          position={[-0.8, 3.45, 0.9]}
          color="#d2e0ed"
          intensity={0.2}
          distance={10}
          decay={2}
        />
        <pointLight
          ref={interiorLightBRef}
          position={[0.4, 1.5, 0.2]}
          color="#c5d6e6"
          intensity={0.2}
          distance={9}
          decay={2}
        />
        <pointLight
          ref={soffitLightRef}
          position={[-3.2, 2.1, 1.6]}
          color="#b9cde0"
          intensity={0.1}
          distance={8}
          decay={2}
        />
      </group>
    </>
  );
}

export function ExplorerBuildingScene(props: ExplorerBuildingSceneProps) {
  const capability = useWebGLCapability();
  const prefersReduced = useReducedMotion();
  const [contextLost, setContextLost] = useState(false);

  if (!capability.supported || contextLost) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#141416] text-concrete text-sm font-mono">
        Interactive 3D Viewport Unavailable — WebGL Context Suspended
      </div>
    );
  }

  return (
    <Canvas
      frameloop={props.active ? 'demand' : 'never'}
      dpr={capability.maxDpr}
      shadows={!capability.isSoftwareGl}
      camera={{ position: props.cameraPreset.position, fov: 37, near: 0.2, far: 100 }}
      gl={{
        antialias: !capability.isSoftwareGl,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      onCreated={({ gl }) => {
        const canvas = gl.domElement;
        canvas.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          setContextLost(true);
        });
        canvas.addEventListener('webglcontextrestored', () => {
          setContextLost(false);
        });
      }}
    >
      <color attach="background" args={[props.lightingMode === 'day' ? '#c8cdd3' : '#0b0c0e']} />
      <fog attach="fog" args={[props.lightingMode === 'day' ? '#c8cdd3' : '#0b0c0e', 18, 48]} />

      <StudioEnvironment />

      <ModernExplorerBuilding
        {...props}
        isSoftwareGl={capability.isSoftwareGl}
        prefersReduced={prefersReduced}
      />
    </Canvas>
  );
}
