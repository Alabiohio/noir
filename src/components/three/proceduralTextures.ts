import * as THREE from 'three';

export interface ProceduralMaterialTextures {
  albedo: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
}

function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  return [canvas, ctx];
}

function configureTexture(
  canvas: HTMLCanvasElement,
  isColor: boolean,
  repeatX: number,
  repeatY: number
): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.colorSpace = isColor ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

export function createBoardFormedConcreteTextures(): ProceduralMaterialTextures {
  const size = 512;
  const [albedoCanvas, aCtx] = createCanvas(size, size);
  const [bumpCanvas, bCtx] = createCanvas(size, size);

  aCtx.fillStyle = '#3a3b3e';
  aCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  const plankHeight = 32;
  for (let y = 0; y < size; y += plankHeight) {
    const shadeDelta = ((Math.sin(y * 1.7) + 1) * 0.5) * 14 - 7;
    const base = Math.round(58 + shadeDelta);
    aCtx.fillStyle = `rgb(${base}, ${base + 1}, ${base + 3})`;
    aCtx.fillRect(0, y, size, plankHeight - 1);

    // Formwork seam line
    aCtx.fillStyle = 'rgba(18, 18, 20, 0.72)';
    aCtx.fillRect(0, y + plankHeight - 2, size, 2);
    bCtx.fillStyle = '#2a2a2a';
    bCtx.fillRect(0, y + plankHeight - 2, size, 2);

    // Subtle wood grain impressions in cast concrete
    for (let g = 0; g < 18; g++) {
      const gy = y + ((g * 7 + y) % (plankHeight - 3));
      const alpha = 0.04 + ((g % 5) * 0.015);
      aCtx.fillStyle = g % 2 === 0 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha * 1.4})`;
      aCtx.fillRect(0, gy, size, 1);
      bCtx.fillStyle = g % 2 === 0 ? '#909090' : '#6c6c6c';
      bCtx.fillRect(0, gy, size, 1);
    }
  }

  // Tie-rod architectural form holes
  const tiePositions = [
    [128, 64],
    [384, 64],
    [128, 192],
    [384, 192],
    [128, 320],
    [384, 320],
    [128, 448],
    [384, 448],
  ];
  for (const [tx, ty] of tiePositions) {
    aCtx.fillStyle = '#1b1c1e';
    aCtx.beginPath();
    aCtx.arc(tx, ty, 4, 0, Math.PI * 2);
    aCtx.fill();

    bCtx.fillStyle = '#101010';
    bCtx.beginPath();
    bCtx.arc(tx, ty, 4.5, 0, Math.PI * 2);
    bCtx.fill();
  }

  return {
    albedo: configureTexture(albedoCanvas, true, 2, 2),
    bump: configureTexture(bumpCanvas, false, 2, 2),
  };
}

export function createTravertineTextures(): ProceduralMaterialTextures {
  const size = 512;
  const [albedoCanvas, aCtx] = createCanvas(size, size);
  const [bumpCanvas, bCtx] = createCanvas(size, size);

  aCtx.fillStyle = '#a8a093';
  aCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#888888';
  bCtx.fillRect(0, 0, size, size);

  // Sedimentary strata bands
  for (let y = 0; y < size; y += 3) {
    const wave = Math.sin(y * 0.07) * 10 + Math.cos(y * 0.19) * 6;
    const r = Math.min(220, Math.max(120, Math.round(166 + wave)));
    const g = Math.min(212, Math.max(115, Math.round(158 + wave * 0.95)));
    const b = Math.min(200, Math.max(105, Math.round(145 + wave * 0.85)));
    aCtx.fillStyle = `rgb(${r},${g},${b})`;
    aCtx.fillRect(0, y, size, 3);

    const bVal = Math.round(132 + wave * 1.4);
    bCtx.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
    bCtx.fillRect(0, y, size, 3);
  }

  // Travertine pores
  for (let i = 0; i < 420; i++) {
    const px = (i * 97) % size;
    const py = (i * 53) % size;
    const pw = 4 + (i % 14);
    aCtx.fillStyle = 'rgba(72, 66, 58, 0.25)';
    aCtx.fillRect(px, py, pw, 1.5);
    bCtx.fillStyle = '#484848';
    bCtx.fillRect(px, py, pw, 1.5);
  }

  // Honed ashlar block joints
  for (let y = 0; y < size; y += 128) {
    aCtx.fillStyle = 'rgba(40, 36, 30, 0.38)';
    aCtx.fillRect(0, y, size, 1.5);
    bCtx.fillStyle = '#303030';
    bCtx.fillRect(0, y, size, 2);
  }

  return {
    albedo: configureTexture(albedoCanvas, true, 2, 2),
    bump: configureTexture(bumpCanvas, false, 2, 2),
  };
}

export function createBrushedBronzeTextures(): ProceduralMaterialTextures {
  const size = 512;
  const [albedoCanvas, aCtx] = createCanvas(size, size);
  const [bumpCanvas, bCtx] = createCanvas(size, size);

  aCtx.fillStyle = '#737c87';
  aCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  // Anisotropic horizontal brushed titanium streaks
  for (let y = 0; y < size; y++) {
    const n = (Math.sin(y * 1.37) + Math.cos(y * 0.43)) * 0.5;
    const delta = Math.round(n * 14);
    aCtx.fillStyle = `rgb(${115 + delta}, ${124 + delta}, ${135 + delta})`;
    aCtx.fillRect(0, y, size, 1);

    const bVal = 128 + delta * 2;
    bCtx.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
    bCtx.fillRect(0, y, size, 1);
  }

  // Architectural panel seams
  for (let x = 0; x < size; x += 128) {
    aCtx.fillStyle = 'rgba(15, 18, 22, 0.52)';
    aCtx.fillRect(x, 0, 2, size);
    bCtx.fillStyle = '#222222';
    bCtx.fillRect(x, 0, 2, size);
  }

  return {
    albedo: configureTexture(albedoCanvas, true, 2, 2),
    bump: configureTexture(bumpCanvas, false, 2, 2),
  };
}

export function createCharredTimberTextures(): ProceduralMaterialTextures {
  const size = 512;
  const [albedoCanvas, aCtx] = createCanvas(size, size);
  const [bumpCanvas, bCtx] = createCanvas(size, size);

  aCtx.fillStyle = '#1d1b19';
  aCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#707070';
  bCtx.fillRect(0, 0, size, size);

  const battenWidth = 16;
  for (let x = 0; x < size; x += battenWidth) {
    const tone = 24 + ((x * 3) % 10);
    aCtx.fillStyle = `rgb(${tone + 2}, ${tone}, ${tone - 2})`;
    aCtx.fillRect(x, 0, battenWidth - 2, size);

    aCtx.fillStyle = '#090909';
    aCtx.fillRect(x + battenWidth - 2, 0, 2, size);

    bCtx.fillStyle = '#9a9a9a';
    bCtx.fillRect(x, 0, battenWidth - 2, size);
    bCtx.fillStyle = '#222222';
    bCtx.fillRect(x + battenWidth - 2, 0, 2, size);

    // Fine vertical charcoal grain
    for (let v = 2; v < battenWidth - 3; v += 3) {
      aCtx.fillStyle = 'rgba(255, 245, 235, 0.04)';
      aCtx.fillRect(x + v, 0, 1, size);
    }
  }

  return {
    albedo: configureTexture(albedoCanvas, true, 3, 2),
    bump: configureTexture(bumpCanvas, false, 3, 2),
  };
}

export function createArchitecturalGridTexture(): THREE.CanvasTexture {
  const size = 512;
  const [canvas, ctx] = createCanvas(size, size);
  ctx.clearRect(0, 0, size, size);

  ctx.strokeStyle = 'rgba(244, 240, 234, 0.08)';
  ctx.lineWidth = 1;

  const step = 64;
  for (let i = 0; i <= size; i += step) {
    ctx.beginPath();
    ctx.moveTo(i + 0.5, 0);
    ctx.lineTo(i + 0.5, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i + 0.5);
    ctx.lineTo(size, i + 0.5);
    ctx.stroke();
  }

  // Subtle cross-datum ticks
  ctx.strokeStyle = 'rgba(148, 170, 191, 0.26)';
  ctx.beginPath();
  ctx.moveTo(size / 2 - 8, size / 2 + 0.5);
  ctx.lineTo(size / 2 + 8, size / 2 + 0.5);
  ctx.moveTo(size / 2 + 0.5, size / 2 - 8);
  ctx.lineTo(size / 2 + 0.5, size / 2 + 8);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}
