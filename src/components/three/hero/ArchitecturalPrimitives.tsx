import { useMemo } from 'react';
import type { ResidenceMaterials } from './residenceMaterials';

interface RecessedGlazingBayProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width: number;
  height: number;
  depth?: number;
  mullionCount?: number;
  materials: ResidenceMaterials;
  warmInterior?: boolean;
}

/**
 * Reusable floor-to-ceiling recessed glazing unit with concrete/metal reveal,
 * blackened steel perimeter frames, vertical structural mullions, reflective glass,
 * and warm illuminated interior architectural depth.
 */
export function RecessedGlazingBay({
  position,
  rotation = [0, 0, 0],
  width,
  height,
  depth = 1.4,
  mullionCount = 4,
  materials,
  warmInterior = true,
}: RecessedGlazingBayProps) {
  const frameThickness = 0.06;
  const recessOffset = 0.24;

  const mullionPositions = useMemo(() => {
    if (mullionCount <= 0) return [];
    const innerWidth = width - frameThickness * 2;
    const step = innerWidth / (mullionCount + 1);
    return Array.from({ length: mullionCount }, (_, i) => -innerWidth / 2 + step * (i + 1));
  }, [width, mullionCount]);

  return (
    <group position={position} rotation={rotation}>
      {/* Dark Metal Perimeter Window Frame */}
      <mesh position={[0, height / 2 - frameThickness / 2, -recessOffset]} material={materials.darkMetal}>
        <boxGeometry args={[width, frameThickness, 0.14]} />
      </mesh>
      <mesh position={[0, -height / 2 + frameThickness / 2, -recessOffset]} material={materials.darkMetal}>
        <boxGeometry args={[width, frameThickness, 0.14]} />
      </mesh>
      <mesh position={[-width / 2 + frameThickness / 2, 0, -recessOffset]} material={materials.darkMetal}>
        <boxGeometry args={[frameThickness, height, 0.14]} />
      </mesh>
      <mesh position={[width / 2 - frameThickness / 2, 0, -recessOffset]} material={materials.darkMetal}>
        <boxGeometry args={[frameThickness, height, 0.14]} />
      </mesh>

      {/* Vertical Structural Steel Mullions */}
      {mullionPositions.map((mx, i) => (
        <mesh key={i} position={[mx, 0, -recessOffset]} material={materials.darkMetal} castShadow>
          <boxGeometry args={[0.045, height - frameThickness * 2, 0.16]} />
        </mesh>
      ))}

      {/* Reflective Low-Iron Glass Curtain */}
      <mesh position={[0, 0, -recessOffset]} material={materials.architecturalGlass}>
        <boxGeometry args={[width - frameThickness * 2, height - frameThickness * 2, 0.03]} />
      </mesh>

      {/* Recessed Interior Room Depth (Warm Ceiling Soffit + Back Wall + Floor) */}
      {warmInterior && (
        <group>
          <mesh
            position={[0, 0, -recessOffset - depth]}
            material={materials.interiorWall}
            receiveShadow
          >
            <boxGeometry args={[width - 0.1, height - 0.1, 0.12]} />
          </mesh>
          <mesh
            position={[0, height / 2 - 0.06, -recessOffset - depth / 2]}
            material={materials.walnutSoffit}
          >
            <boxGeometry args={[width - 0.1, 0.08, depth]} />
          </mesh>
          <mesh
            position={[0, height / 2 - 0.12, -recessOffset - 0.28]}
            material={materials.recessedLightStrip}
          >
            <boxGeometry args={[width * 0.72, 0.025, 0.06]} />
          </mesh>
        </group>
      )}
    </group>
  );
}

interface CantileveredBalconyProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width: number;
  depth: number;
  materials: ResidenceMaterials;
}

/**
 * Post-tensioned cantilevered balcony slab with dark steel fascia edge,
 * recessed base shoe channel, and low-iron glass balustrade.
 */
export function CantileveredBalcony({
  position,
  rotation = [0, 0, 0],
  width,
  depth,
  materials,
}: CantileveredBalconyProps) {
  const slabThickness = 0.22;
  const railHeight = 0.88;

  return (
    <group position={position} rotation={rotation}>
      {/* Cantilevered Concrete Balcony Deck */}
      <mesh position={[0, 0, 0]} material={materials.concreteMain} castShadow receiveShadow>
        <boxGeometry args={[width, slabThickness, depth]} />
      </mesh>

      {/* Dark Metal Perimeter Drip Edge & Fascia */}
      <mesh position={[0, 0.01, depth / 2 + 0.02]} material={materials.darkMetal} castShadow>
        <boxGeometry args={[width + 0.06, slabThickness * 0.9, 0.05]} />
      </mesh>
      <mesh position={[-width / 2 - 0.02, 0.01, 0]} material={materials.darkMetal} castShadow>
        <boxGeometry args={[0.05, slabThickness * 0.9, depth]} />
      </mesh>
      <mesh position={[width / 2 + 0.02, 0.01, 0]} material={materials.darkMetal} castShadow>
        <boxGeometry args={[0.05, slabThickness * 0.9, depth]} />
      </mesh>

      {/* Recessed Anodized Base Shoe */}
      <mesh position={[0, slabThickness / 2 + 0.04, depth / 2 - 0.08]} material={materials.darkMetal}>
        <boxGeometry args={[width - 0.06, 0.08, 0.07]} />
      </mesh>

      {/* Front & Side Frameless Glass Balustrades */}
      <mesh
        position={[0, slabThickness / 2 + railHeight / 2 + 0.05, depth / 2 - 0.08]}
        material={materials.balustradeGlass}
      >
        <boxGeometry args={[width - 0.14, railHeight, 0.03]} />
      </mesh>
      <mesh
        position={[-width / 2 + 0.08, slabThickness / 2 + railHeight / 2 + 0.05, 0]}
        material={materials.balustradeGlass}
      >
        <boxGeometry args={[0.03, railHeight, depth - 0.14]} />
      </mesh>
      <mesh
        position={[width / 2 - 0.08, slabThickness / 2 + railHeight / 2 + 0.05, 0]}
        material={materials.balustradeGlass}
      >
        <boxGeometry args={[0.03, railHeight, depth - 0.14]} />
      </mesh>

      {/* Slender Bronze Top Cap Rail */}
      <mesh
        position={[0, slabThickness / 2 + railHeight + 0.06, depth / 2 - 0.08]}
        material={materials.anodizedBronze}
      >
        <boxGeometry args={[width - 0.1, 0.025, 0.045]} />
      </mesh>
    </group>
  );
}
