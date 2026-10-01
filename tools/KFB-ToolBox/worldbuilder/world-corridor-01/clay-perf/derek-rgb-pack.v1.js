/* KFB Derek RGB Tile · exact WorldDesign Lab donor concept, bounded comparator.
 * One shared 512² RGB tile, triplanar world-space projection.
 * The tile selects three tones derived from each source material colour.
 * This module loads/prepares the pinned donor texture only; shader semantics live in the diagnostic material.
 */
export const DEREK_RGB_SOURCE = Object.freeze({
  label: 'WorldDesign Lab v1 · Derek RGB reference tile',
  ref: '9248211a831d20f5d6cc665af90a2b38759a4609',
  path: 'tools/KFB-ToolBox/_inbox/KFB World Design Setup (1)/WORLDDESIGN_LAB_2026-09-23/deliverables/textures/derek-rgb-ref.png',
  blob: '9548595806461ede898c3c9de09a6905c20cc2ff',
  url: 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@9248211a831d20f5d6cc665af90a2b38759a4609/tools/KFB-ToolBox/_inbox/KFB%20World%20Design%20Setup%20(1)/WORLDDESIGN_LAB_2026-09-23/deliverables/textures/derek-rgb-ref.png'
});

const loadImage = (url) => new Promise((resolve, reject) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error('Derek RGB tile failed: ' + url));
  img.src = url;
});

export async function makeDerekRgbTexture(THREE, { size = 512 } = {}) {
  const img = await loadImage(DEREK_RGB_SOURCE.url);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  tex.name = 'KFB_DerekRGB_512';
  const baseBytes = size * size * 4;
  const meta = {
    size,
    source: DEREK_RGB_SOURCE,
    baseBytes,
    estimatedMipBytes: Math.round(baseBytes * 4 / 3),
    semantics: 'RGB weights select source-colour-derived base/dark/light tones; triplanar; no extra grain/bump/cel/ink in this comparator.'
  };
  tex.userData.kfbDerekRgb = meta;
  return { texture: tex, meta };
}
