/* KFB Global Clay Lite · one shared packed texture.
 * Diagnostic/production candidate under the existing WorldBuilder material owner.
 * Source colour remains authoritative; donor texture supplies only relief/value/roughness character.
 */
export const GLOBAL_CLAY_DONORS = Object.freeze({
  Clay002: {
    label: 'Clay002',
    diffuse: 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@1360c73944cd56c4f1980c5ac6552ba320c04a59/media/3D_Assets/Textures/Clay002/Clay002_diffuse.jpg',
    roughness: 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@1360c73944cd56c4f1980c5ac6552ba320c04a59/media/3D_Assets/Textures/Clay002/Clay002_roughness.jpg',
    blobs: {
      diffuse: '8e7dc121cbf97154b6c67674998bb3d7c5abcd89',
      roughness: '7c879ace8ef221531e9fa715063997364b5d13b3'
    }
  },
  clay_floor_001: {
    label: 'clay_floor_001',
    diffuse: 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@1360c73944cd56c4f1980c5ac6552ba320c04a59/media/3D_Assets/Textures/clay_floor_001/clay_floor_001_diffuse.jpg',
    roughness: 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@1360c73944cd56c4f1980c5ac6552ba320c04a59/media/3D_Assets/Textures/clay_floor_001/clay_floor_001_roughness.jpg',
    blobs: {
      diffuse: 'd889ddd32d38ef9fac55ea802e47da73cbd77deb',
      roughness: '4d5b3e7634e532111c7608156f4a49b6b18d2ffb'
    }
  }
});

const loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error('Global Clay Lite texture failed: ' + url));
  img.src = url;
});

function drawImageData(img, size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.imageSmoothingEnabled = true;
  x.imageSmoothingQuality = 'high';
  x.drawImage(img, 0, 0, size, size);
  return x.getImageData(0, 0, size, size).data;
}

const clampByte = (v) => Math.max(0, Math.min(255, Math.round(v)));
const lum = (p, i) => (p[i] * 0.2126 + p[i + 1] * 0.7152 + p[i + 2] * 0.0722) / 255;

export async function makeGlobalClayPack(THREE, {
  donor = 'Clay002',
  size = 512,
  gradientGain = 2.2,
  valueGain = 0.20,
} = {}) {
  const spec = GLOBAL_CLAY_DONORS[donor];
  if (!spec) throw new Error('Unknown Global Clay donor: ' + donor);
  const [diffImg, roughImg] = await Promise.all([loadImage(spec.diffuse), loadImage(spec.roughness)]);
  const d = drawImageData(diffImg, size);
  const r = drawImageData(roughImg, size);
  const n = size * size;
  const L = new Float32Array(n);
  let mean = 0;
  for (let i = 0; i < n; i++) {
    const l = lum(d, i * 4);
    L[i] = l;
    mean += l;
  }
  mean /= n || 1;
  let variance = 0;
  for (let i = 0; i < n; i++) {
    const z = L[i] - mean;
    variance += z * z;
  }
  const std = Math.sqrt(variance / (n || 1)) || 0.1;
  const out = new Uint8Array(n * 4);
  const at = (x, y) => L[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const i = y * size + x;
    const dx = (at(x + 1, y) - at(x - 1, y)) * 0.5;
    const dy = (at(x, y + 1) - at(x, y - 1)) * 0.5;
    const q = i * 4;
    out[q] = clampByte(128 + (dx / std) * 26 * gradientGain);
    out[q + 1] = clampByte(128 + (dy / std) * 26 * gradientGain);
    // roughness texture is read as grayscale; keep the original donor response.
    out[q + 2] = clampByte(lum(r, q) * 255);
    // A is centred value variation only. Donor colour never replaces the source asset colour.
    out[q + 3] = clampByte(128 + ((L[i] - mean) / std) * 48 * valueGain / 0.20);
  }
  const tex = new THREE.DataTexture(out, size, size, THREE.RGBAFormat, THREE.UnsignedByteType);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  tex.name = 'KFB_GlobalClayLite_' + donor + '_' + size;
  const baseBytes = size * size * 4;
  const meta = {
    donor,
    size,
    packedChannels: 'RG relief-gradient · B roughness · A centred value variation',
    baseBytes,
    estimatedMipBytes: Math.round(baseBytes * 4 / 3),
    source: spec
  };
  tex.userData.kfbGlobalClay = meta;
  return { texture: tex, meta };
}
