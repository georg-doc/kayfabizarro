import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] ?? 'media/3D_Assets/KayKit_HalloweenBits/Assets';
const gltfDir = path.join(root, 'gltf');
const glbDir = path.join(root, 'glb');
const failures = [];

const names = (directory, extension) => fs.readdirSync(directory)
  .filter((name) => name.endsWith(extension))
  .map((name) => path.basename(name, extension))
  .sort();

const gltfNames = names(gltfDir, '.gltf');
const binNames = names(gltfDir, '.bin');
const glbNames = names(glbDir, '.glb');

const compareRoster = (label, actual) => {
  const missing = gltfNames.filter((name) => !actual.includes(name));
  const extra = actual.filter((name) => !gltfNames.includes(name));
  if (missing.length || extra.length) failures.push(`${label}: missing=${missing.join(',')} extra=${extra.join(',')}`);
};

compareRoster('BIN roster', binNames);
compareRoster('GLB roster', glbNames);

for (const name of gltfNames) {
  const filename = path.join(gltfDir, `${name}.gltf`);
  let document;
  try {
    document = JSON.parse(fs.readFileSync(filename, 'utf8'));
  } catch (error) {
    failures.push(`${name}.gltf: invalid JSON (${error.message})`);
    continue;
  }
  if (!document.meshes?.length) failures.push(`${name}.gltf: no meshes`);
  const uris = [
    ...(document.buffers ?? []).map((entry) => entry.uri),
    ...(document.images ?? []).map((entry) => entry.uri),
  ].filter(Boolean).filter((uri) => !uri.startsWith('data:'));
  for (const uri of uris) {
    if (!fs.existsSync(path.join(gltfDir, decodeURIComponent(uri)))) {
      failures.push(`${name}.gltf: missing dependency ${uri}`);
    }
  }
}

for (const name of glbNames) {
  const filename = path.join(glbDir, `${name}.glb`);
  const bytes = fs.readFileSync(filename);
  if (bytes.length < 1024) {
    failures.push(`${name}.glb: implausibly small (${bytes.length} bytes)`);
    continue;
  }
  if (bytes.readUInt32LE(0) !== 0x46546c67) failures.push(`${name}.glb: missing glTF magic`);
  if (bytes.readUInt32LE(4) !== 2) failures.push(`${name}.glb: not GLB v2`);
  if (bytes.readUInt32LE(8) !== bytes.length) failures.push(`${name}.glb: declared length mismatch`);
  if (bytes.readUInt32LE(16) !== 0x4e4f534a) failures.push(`${name}.glb: first chunk is not JSON`);
  try {
    const jsonLength = bytes.readUInt32LE(12);
    const document = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString('utf8').trim());
    if (!document.meshes?.length) failures.push(`${name}.glb: no meshes`);
    const externalUris = [
      ...(document.buffers ?? []).map((entry) => entry.uri),
      ...(document.images ?? []).map((entry) => entry.uri),
    ].filter(Boolean);
    if (externalUris.length) failures.push(`${name}.glb: contains external dependencies`);
  } catch (error) {
    failures.push(`${name}.glb: invalid JSON chunk (${error.message})`);
  }
}

const result = {
  expectedModels: 63,
  gltf: gltfNames.length,
  bin: binNames.length,
  glb: glbNames.length,
  failures,
};

if (gltfNames.length !== result.expectedModels) failures.push(`GLTF count: expected 63, got ${gltfNames.length}`);
if (binNames.length !== result.expectedModels) failures.push(`BIN count: expected 63, got ${binNames.length}`);
if (glbNames.length !== result.expectedModels) failures.push(`GLB count: expected 63, got ${glbNames.length}`);

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
