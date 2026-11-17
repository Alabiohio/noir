import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useResidenceMaterials } from './residenceMaterials';
import { CantileveredBalcony, RecessedGlazingBay } from './ArchitecturalPrimitives';
import { ResidenceGroundSite } from './ResidenceGroundSite';

interface PointerRef {
  x: number;
  y: number;
}

const _camTargetPos = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();

function createOculusRoofSlab(): THREE.ExtrudeGeometry {
  const outer = new THREE.Shape();
  const hw = 2.75;
  const hd = 3.9;
  outer.moveTo(-hw, -hd);
  outer.lineTo(hw, -hd);
  outer.lineTo(hw, hd);
  outer.lineTo(-hw, hd);
  outer.closePath();

  const hole = new THREE.Path();
  hole.moveTo(-0.95, -0.95);
  hole.lineTo(0.95, -0.95);
  hole.lineTo(0.95, 0.95);
  hole.lineTo(-0.95, 0.95);
  hole.closePath();
  outer.holes.push(hole);

  const geom = new THREE.ExtrudeGeometry(outer, {
    depth: 0.28,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
  });
  geom.rotateX(Math.PI / 2);
  return geom;
}

export function BrutalistLuxuryResidence({
  pointerRef,
  prefersReduced,
  isMobile,
}: {
  pointerRef: React.MutableRefObject<PointerRef>;
  prefersReduced: boolean;
  isMobile: boolean;
}) {
  const materials = useResidenceMaterials();
  const residenceGroupRef = useRef<THREE.Group>(null);
  const louverMeshRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();

  const oculusRoofGeometry = useMemo(() => createOculusRoofSlab(), []);
  useEffect(() => {
    return () => {
      oculusRoofGeometry.dispose();
    };
  }, [oculusRoofGeometry]);

  const louverCount = 22;
  useLayoutEffect(() => {
    if (!louverMeshRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < louverCount; i++) {
      dummy.position.set(-5.7 + i * 0.26, 4.35, 2.55);
      dummy.rotation.set(0, 0.2, 0);
      dummy.updateMatrix();
      louverMeshRef.current.setMatrixAt(i, dummy.matrix);
    }
    louverMeshRef.current.instanceMatrix.needsUpdate = true;
    louverMeshRef.current.computeBoundingSphere();
  }, []);

  const baseCameraPos = useMemo(
    () => (isMobile ? new THREE.Vector3(12.4, 5.2, 18.4) : new THREE.Vector3(13.8, 5.0, 15.6)),
    [isMobile]
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);

    // Smooth mouse-responsive rotation clamped to tasteful architectural bounds
    if (residenceGroupRef.current) {
      const targetYaw = prefersReduced ? -0.44 : -0.44 + pointerRef.current.x * 0.17;
      const targetPitch = prefersReduced ? 0.02 : 0.02 - pointerRef.current.y * 0.05;

      residenceGroupRef.current.rotation.y = THREE.MathUtils.damp(
        residenceGroupRef.current.rotation.y,
        targetYaw,
        3.0,
        dt
      );
      residenceGroupRef.current.rotation.x = THREE.MathUtils.damp(
        residenceGroupRef.current.rotation.x,
        targetPitch,
        3.0,
        dt
      );
    }

    // Subtle floating camera breathing & pointer parallax
    if (!prefersReduced) {
      const t = state.clock.getElapsedTime();
      const pointerParallaxX = pointerRef.current.x * 0.42;
      const pointerParallaxY = -pointerRef.current.y * 0.2;

      _camTargetPos.set(
        baseCameraPos.x + Math.sin(t * 0.32) * 0.32 + pointerParallaxX,
        baseCameraPos.y + Math.cos(t * 0.41) * 0.15 + pointerParallaxY,
        baseCameraPos.z + Math.sin(t * 0.24) * 0.26
      );
      camera.position.lerp(_camTargetPos, 1 - Math.exp(-2.2 * dt));
    } else {
      camera.position.copy(baseCameraPos);
    }

    _lookTarget.set(isMobile ? 0 : 0.65, isMobile ? 0.65 : 2.3, 0);
    camera.lookAt(_lookTarget);
  });

  const groupX = isMobile ? 0 : 3.15;

  return (
    <group ref={residenceGroupRef} position={[groupX, -1.15, 0]} rotation={[0.02, -0.44, 0]}>
      {/* Realistic Site, Ground Plane & Infinity Reflection Pool */}
      <ResidenceGroundSite materials={materials} />

      {/* ================================================================= */}
      {/* LEVEL 0: GROUND GARDEN LIVING SALON & MONOLITHIC SHEAR CORE       */}
      {/* ================================================================= */}
      <group>
        {/* Ground Floor Structural East Shear Wall Core */}
        <mesh position={[3.35, 1.72, -1.45]} material={materials.concreteDark} castShadow receiveShadow>
          <boxGeometry args={[4.8, 2.52, 4.4]} />
        </mesh>

        {/* Sculptural Angled Blade Pier supporting Main Cantilever */}
        <mesh position={[-1.9, 1.72, -2.05]} material={materials.concreteMain} castShadow receiveShadow>
          <boxGeometry args={[0.62, 2.52, 3.1]} />
        </mesh>

        {/* Ground Floor Deep Concrete Canopy Overhang */}
        <mesh position={[0.1, 2.92, -0.15]} material={materials.concreteDark} castShadow receiveShadow>
          <boxGeometry args={[7.8, 0.26, 4.1]} />
        </mesh>

        {/* Ground Floor Recessed Floor-to-Ceiling Glazing Bay */}
        <RecessedGlazingBay
          position={[0.1, 1.66, 0.92]}
          width={5.6}
          height={2.28}
          depth={1.85}
          mullionCount={4}
          materials={materials}
          warmInterior
        />

        {/* Ground Floor West Return Glazing */}
        <RecessedGlazingBay
          position={[-2.62, 1.66, -0.5]}
          rotation={[0, -Math.PI / 2, 0]}
          width={2.5}
          height={2.28}
          depth={1.2}
          mullionCount={2}
          materials={materials}
          warmInterior={false}
        />

        {/* Ground Terrace Dark Steel Columns */}
        {[-2.5, 0.9].map((cx, idx) => (
          <mesh key={idx} position={[cx, 1.66, 1.68]} material={materials.darkMetal} castShadow>
            <boxGeometry args={[0.11, 2.38, 0.11]} />
          </mesh>
        ))}

        {/* Floating Exterior Basalt & Steel Staircase */}
        <mesh
          position={[-3.9, 1.72, -3.1]}
          rotation={[0, 0, 0.56]}
          material={materials.darkMetal}
          castShadow
        >
          <boxGeometry args={[4.4, 0.12, 0.24]} />
        </mesh>
        {Array.from({ length: 8 }).map((_, idx) => (
          <mesh
            key={idx}
            position={[-5.35 + idx * 0.42, 0.65 + idx * 0.28, -3.1]}
            material={materials.basaltStone}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.46, 0.09, 1.32]} />
          </mesh>
        ))}
      </group>

      {/* ================================================================= */}
      {/* LEVEL 1: PRIMARY CANTILEVERED LIVING WING & BALCONY               */}
      {/* ================================================================= */}
      <group>
        {/* Main Post-Tensioned Cantilevered Floor Slab */}
        <mesh position={[-0.75, 3.16, 0.2]} material={materials.concreteMain} castShadow receiveShadow>
          <boxGeometry args={[12.8, 0.34, 5.1]} />
        </mesh>

        {/* Warm Walnut Timber Cantilever Soffit Underside */}
        <mesh position={[-3.35, 2.98, 0.2]} material={materials.walnutSoffit}>
          <boxGeometry args={[7.2, 0.04, 4.7]} />
        </mesh>

        {/* Concealed Linear Architectural Soffit Light Strip */}
        <mesh position={[-3.4, 2.95, 0.2]} material={materials.recessedLightStrip}>
          <boxGeometry args={[6.4, 0.025, 0.1]} />
        </mesh>

        {/* Dark Metal Cantilever Perimeter Drip Fascia */}
        <mesh position={[-0.75, 3.18, 2.77]} material={materials.darkMetal}>
          <boxGeometry args={[12.88, 0.16, 0.06]} />
        </mesh>

        {/* Rear & End Concrete Structural Framing Walls (Creating Recessed Window Reveals) */}
        <mesh position={[-0.75, 4.35, -2.14]} material={materials.concreteMain} castShadow receiveShadow>
          <boxGeometry args={[12.8, 2.08, 0.42]} />
        </mesh>
        <mesh position={[-6.93, 4.35, 0.2]} material={materials.concreteMain} castShadow receiveShadow>
          <boxGeometry args={[0.44, 2.08, 5.1]} />
        </mesh>
        <mesh position={[5.43, 4.35, 0.2]} material={materials.concreteMain} castShadow receiveShadow>
          <boxGeometry args={[0.44, 2.08, 5.1]} />
        </mesh>

        {/* Main Cantilever Overhang Roof Slab */}
        <mesh position={[-0.75, 5.56, 0.35]} material={materials.concreteMain} castShadow receiveShadow>
          <boxGeometry args={[13.2, 0.34, 5.5]} />
        </mesh>
        <mesh position={[-0.75, 5.74, 0.35]} material={materials.darkMetal}>
          <boxGeometry args={[13.26, 0.06, 5.56]} />
        </mesh>

        {/* Deeply Recessed Panoramic Lounge Glazing (Front East/South) */}
        <RecessedGlazingBay
          position={[0.45, 4.35, 2.55]}
          width={8.4}
          height={2.05}
          depth={1.85}
          mullionCount={6}
          materials={materials}
          warmInterior
        />

        {/* Sculptural Interior Architectural Partition & Hearth visible through glass */}
        <mesh position={[1.4, 4.35, 0.9]} material={materials.basaltStone} castShadow>
          <boxGeometry args={[1.6, 2.0, 0.55]} />
        </mesh>

        {/* West Wing Solid Cheek Pier & Anodized Bronze Louver Screen */}
        <mesh position={[-6.2, 4.35, 2.48]} material={materials.concreteDark} castShadow receiveShadow>
          <boxGeometry args={[1.1, 2.05, 0.45]} />
        </mesh>
        <instancedMesh
          ref={louverMeshRef}
          args={[undefined, undefined, louverCount]}
          material={materials.anodizedBronze}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.055, 2.04, 0.26]} />
        </instancedMesh>

        {/* Projecting Cantilevered Balcony overlooking Reflection Pool */}
        <CantileveredBalcony
          position={[-2.1, 3.18, 3.65]}
          width={5.4}
          depth={1.95}
          materials={materials}
        />
      </group>

      {/* ================================================================= */}
      {/* LEVEL 2: UPPER MASTER OBSERVATORY & OCULUS ROOF TERRACE           */}
      {/* ================================================================= */}
      <group>
        {/* Upper Perpendicular Master Volume */}
        <mesh position={[2.65, 6.72, -0.55]} material={materials.concreteDark} castShadow receiveShadow>
          <boxGeometry args={[4.9, 2.0, 6.8]} />
        </mesh>

        {/* Deep Recessed Master Suite Corner Window */}
        <RecessedGlazingBay
          position={[2.65, 6.72, 2.84]}
          width={4.1}
          height={1.68}
          depth={1.4}
          mullionCount={3}
          materials={materials}
          warmInterior
        />

        {/* Upper Master West Glazing Facing Roof Terrace */}
        <RecessedGlazingBay
          position={[0.18, 6.72, -0.55]}
          rotation={[0, -Math.PI / 2, 0]}
          width={4.6}
          height={1.68}
          depth={1.3}
          mullionCount={3}
          materials={materials}
          warmInterior
        />

        {/* Extruded Oculus Architectural Roof Canopy Overhang */}
        <mesh
          geometry={oculusRoofGeometry}
          position={[2.65, 7.98, -0.35]}
          material={materials.concreteMain}
          castShadow
          receiveShadow
        />

        {/* Roof Canopy Dark Metal Edge Trim & Bronze Oculus Skylight Frame */}
        <mesh position={[2.65, 7.86, 3.55]} material={materials.darkMetal}>
          <boxGeometry args={[5.54, 0.14, 0.06]} />
        </mesh>
        <mesh position={[2.65, 7.88, -0.35]} material={materials.anodizedBronze}>
          <boxGeometry args={[1.98, 0.08, 1.98]} />
        </mesh>

        {/* Sheltered Rooftop Garden Terrace Balustrade (West Deck) */}
        <CantileveredBalcony
          position={[-3.35, 5.66, 0.35]}
          width={5.8}
          depth={4.6}
          materials={materials}
        />
      </group>

      {/* Crisp Gallery Interior & Soffit Architectural Lighting */}
      <pointLight position={[-3.3, 2.65, 1.4]} color="#cbdbe8" intensity={4.6} distance={9} decay={2} />
      <pointLight position={[0.4, 4.35, 1.2]} color="#d7e3ee" intensity={4.4} distance={9} decay={2} />
      <pointLight position={[0.1, 1.75, 0.1]} color="#c4d6e6" intensity={3.9} distance={8} decay={2} />
      <pointLight position={[2.5, 6.7, 1.8]} color="#d4e1ed" intensity={3.0} distance={7} decay={2} />
    </group>
  );
}
