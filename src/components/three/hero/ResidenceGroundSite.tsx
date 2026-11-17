import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import type { ResidenceMaterials } from './residenceMaterials';

interface ResidenceGroundSiteProps {
  materials: ResidenceMaterials;
}

export function ResidenceGroundSite({ materials }: ResidenceGroundSiteProps) {
  const paversRef = useRef<THREE.InstancedMesh>(null);
  const paverRows = 5;
  const paverCols = 6;
  const paverCount = paverRows * paverCols;

  useLayoutEffect(() => {
    if (!paversRef.current) return;
    const dummy = new THREE.Object3D();
    let idx = 0;
    for (let r = 0; r < paverRows; r++) {
      for (let c = 0; c < paverCols; c++) {
        dummy.position.set(2.35 + c * 0.92, 0.39, 1.25 + r * 0.88);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        paversRef.current.setMatrixAt(idx, dummy.matrix);
        idx++;
      }
    }
    paversRef.current.instanceMatrix.needsUpdate = true;
    paversRef.current.computeBoundingSphere();
  }, []);

  return (
    <group>
      {/* Expansive Realistic Mineral Ground Plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        material={materials.terrainGround}
        receiveShadow
      >
        <planeGeometry args={[96, 96]} />
      </mesh>

      {/* Architectural Datum Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} material={materials.datumGrid}>
        <planeGeometry args={[56, 56]} />
      </mesh>

      {/* Soft Grounded Contact Shadow Plane beneath Residence Plinth */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-0.2, 0.016, 0.1]}
        material={materials.contactShadow}
      >
        <planeGeometry args={[23, 18]} />
      </mesh>

      {/* Stepped Site Retaining Foundation Terrace */}
      <mesh position={[0, 0.17, -0.2]} material={materials.basaltStone} receiveShadow castShadow>
        <boxGeometry args={[16.8, 0.34, 12.2]} />
      </mesh>

      {/* Elevated Main Courtyard Podium */}
      <mesh position={[1.1, 0.36, -0.7]} material={materials.concreteDark} receiveShadow castShadow>
        <boxGeometry args={[13.8, 0.24, 10.2]} />
      </mesh>

      {/* Sculpted Basalt Garden Stepping Pavers (InstancedMesh) */}
      <instancedMesh
        ref={paversRef}
        args={[undefined, undefined, paverCount]}
        material={materials.basaltStone}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[0.82, 0.06, 0.78]} />
      </instancedMesh>

      {/* Mirror Infinity Reflection Pool Basin */}
      <mesh position={[-2.65, 0.33, 2.55]} material={materials.reflectionWater} receiveShadow>
        <boxGeometry args={[8.8, 0.08, 4.9]} />
      </mesh>

      {/* Pool Perimeter Retaining Lip & Bronze Weir Edge */}
      <mesh position={[-2.65, 0.36, 5.04]} material={materials.anodizedBronze} castShadow>
        <boxGeometry args={[8.9, 0.08, 0.09]} />
      </mesh>
      <mesh position={[-7.08, 0.36, 2.55]} material={materials.basaltStone} castShadow receiveShadow>
        <boxGeometry args={[0.14, 0.14, 5.05]} />
      </mesh>

      {/* Floating Basalt Stepping Pads across Water Basin */}
      {[-4.8, -3.55, -2.3].map((x, i) => (
        <mesh
          key={i}
          position={[x, 0.38, 3.65]}
          material={materials.basaltStone}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.92, 0.07, 1.05]} />
        </mesh>
      ))}

      {/* Low Architectural Landscape Retaining Wall (North Border) */}
      <mesh position={[-2.4, 0.75, -5.8]} material={materials.concreteDark} castShadow receiveShadow>
        <boxGeometry args={[11.6, 1.15, 0.42]} />
      </mesh>
      <mesh position={[-2.4, 1.34, -5.8]} material={materials.darkMetal}>
        <boxGeometry args={[11.66, 0.05, 0.48]} />
      </mesh>
    </group>
  );
}
