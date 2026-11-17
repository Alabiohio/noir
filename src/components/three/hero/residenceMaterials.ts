import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import {
  createArchitecturalGridTexture,
  createBoardFormedConcreteTextures,
  createBrushedBronzeTextures,
} from '../proceduralTextures';

function createWalnutSoffitTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#473323';
  ctx.fillRect(0, 0, size, size);

  const slatW = 16;
  for (let x = 0; x < size; x += slatW) {
    const tone = (Math.sin(x * 0.7) + 1) * 6;
    ctx.fillStyle = `rgb(${68 + Math.round(tone)}, ${48 + Math.round(tone * 0.7)}, ${32 + Math.round(tone * 0.5)})`;
    ctx.fillRect(x, 0, slatW - 2, size);
    ctx.fillStyle = '#1b120b';
    ctx.fillRect(x + slatW - 2, 0, 2, size);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 2);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function createWaterRippleBump(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      const wave =
        Math.sin(x * 0.08 + y * 0.04) * 14 +
        Math.cos(y * 0.14 - x * 0.05) * 10;
      const v = Math.min(255, Math.max(0, Math.round(128 + wave)));
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(x, y, 2, 2);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

function createTerrainTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#121316';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 2400; i++) {
    const x = (i * 173) % size;
    const y = (i * 251) % size;
    const shade = 14 + (i % 14);
    ctx.fillStyle = `rgba(${shade}, ${shade + 1}, ${shade + 3}, 0.55)`;
    ctx.fillRect(x, y, 3, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(12, 12);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(size / 2, size / 2, 16, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
  grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.34)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export interface ResidenceMaterials {
  concreteMain: THREE.MeshStandardMaterial;
  concreteDark: THREE.MeshStandardMaterial;
  basaltStone: THREE.MeshStandardMaterial;
  darkMetal: THREE.MeshStandardMaterial;
  anodizedBronze: THREE.MeshStandardMaterial;
  architecturalGlass: THREE.MeshPhysicalMaterial;
  balustradeGlass: THREE.MeshPhysicalMaterial;
  walnutSoffit: THREE.MeshStandardMaterial;
  interiorWall: THREE.MeshStandardMaterial;
  recessedLightStrip: THREE.MeshStandardMaterial;
  reflectionWater: THREE.MeshPhysicalMaterial;
  terrainGround: THREE.MeshStandardMaterial;
  datumGrid: THREE.MeshStandardMaterial;
  contactShadow: THREE.MeshBasicMaterial;
}

export function useResidenceMaterials(): ResidenceMaterials {
  const bundle = useMemo(() => {
    const concrete = createBoardFormedConcreteTextures();
    const bronze = createBrushedBronzeTextures();
    const grid = createArchitecturalGridTexture();
    const walnut = createWalnutSoffitTexture();
    const waterBump = createWaterRippleBump();
    const terrainTex = createTerrainTexture();
    const shadowTex = createContactShadowTexture();

    const materials: ResidenceMaterials = {
      concreteMain: new THREE.MeshStandardMaterial({
        color: '#5c5e63',
        map: concrete.albedo,
        bumpMap: concrete.bump,
        bumpScale: 0.045,
        roughness: 0.87,
        metalness: 0.04,
      }),
      concreteDark: new THREE.MeshStandardMaterial({
        color: '#34363b',
        map: concrete.albedo,
        bumpMap: concrete.bump,
        bumpScale: 0.04,
        roughness: 0.9,
        metalness: 0.05,
      }),
      basaltStone: new THREE.MeshStandardMaterial({
        color: '#212226',
        bumpMap: concrete.bump,
        bumpScale: 0.025,
        roughness: 0.8,
        metalness: 0.08,
      }),
      darkMetal: new THREE.MeshStandardMaterial({
        color: '#17181b',
        roughness: 0.34,
        metalness: 0.86,
      }),
      anodizedBronze: new THREE.MeshStandardMaterial({
        color: '#8e9aa6',
        map: bronze.albedo,
        bumpMap: bronze.bump,
        bumpScale: 0.015,
        roughness: 0.28,
        metalness: 0.9,
      }),
      architecturalGlass: new THREE.MeshPhysicalMaterial({
        color: '#9db4c0',
        roughness: 0.05,
        metalness: 0.14,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        reflectivity: 0.95,
        ior: 1.52,
        transparent: true,
        opacity: 0.34,
        depthWrite: false,
      }),
      balustradeGlass: new THREE.MeshPhysicalMaterial({
        color: '#aac0cc',
        roughness: 0.08,
        metalness: 0.1,
        clearcoat: 0.9,
        transparent: true,
        opacity: 0.26,
        depthWrite: false,
      }),
      walnutSoffit: new THREE.MeshStandardMaterial({
        color: '#34383e',
        map: walnut,
        roughness: 0.68,
        metalness: 0.08,
      }),
      interiorWall: new THREE.MeshStandardMaterial({
        color: '#252930',
        emissive: '#9fb4c8',
        emissiveIntensity: 0.78,
        roughness: 0.78,
        metalness: 0.04,
      }),
      recessedLightStrip: new THREE.MeshStandardMaterial({
        color: '#dce6f0',
        emissive: '#b6c9db',
        emissiveIntensity: 2.1,
        roughness: 0.25,
        metalness: 0.4,
      }),
      reflectionWater: new THREE.MeshPhysicalMaterial({
        color: '#080b0f',
        bumpMap: waterBump,
        bumpScale: 0.008,
        roughness: 0.05,
        metalness: 0.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 0.95,
      }),
      terrainGround: new THREE.MeshStandardMaterial({
        color: '#16171a',
        map: terrainTex,
        roughness: 0.94,
        metalness: 0.04,
      }),
      datumGrid: new THREE.MeshStandardMaterial({
        map: grid,
        transparent: true,
        opacity: 0.52,
        roughness: 0.95,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1,
      }),
      contactShadow: new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      }),
    };

    return {
      materials,
      textures: [
        concrete.albedo,
        concrete.bump,
        bronze.albedo,
        bronze.bump,
        grid,
        walnut,
        waterBump,
        terrainTex,
        shadowTex,
      ],
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(bundle.materials).forEach((m) => m.dispose());
      bundle.textures.forEach((t) => t.dispose());
    };
  }, [bundle]);

  return bundle.materials;
}
