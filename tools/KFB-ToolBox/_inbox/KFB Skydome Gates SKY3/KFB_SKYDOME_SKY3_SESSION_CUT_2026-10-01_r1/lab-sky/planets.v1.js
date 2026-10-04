/* KFB · SKY1 · Planeten-Schicht v1 (01.10., Georg: »die planeten aus dem quaternius sci-fi pack … optional im skydome anzeigen«)
 * Quelle: media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Environment/GLTF/Planet_1 … Planet_11.gltf (CC0, Quaternius). Registry: registry/assets/v1/packs/scifi-ultimate-space-kit-quaternius.json.
 * Befund (gelesen an Planet_1.gltf): 1 Node, 1 Mesh »Icosphere.001«, 1 Material »Atlas« (Basisfarbe aus eingebettetem PNG-Atlas, metallic 0, roughness 0,5, doubleSided), Puffer als data:-URI eingebettet.
 * Die Ordneransicht zeigt die .gltf nicht (CLAUDE.md) — Vorhandensein wird über die Bytes geprüft: Projektkopie, sonst RAW @main; Git-Blob-SHA wird je Datei protokolliert.
 * Besitz: die Schicht gehört dem EnvironmentHost (eine Gruppe »sky-planets«, folgt der Kamera wie die Schale). Kein eigenes Licht, keine eigene Uhr: Sonne/Nacht kommen vom Host.
 * Modi: off · original (Quaternius-Material unverändert) · clay (K1-Vorstufe softenGeometry + K2-Material, Profil nature, Atlasfarben bleiben). */
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { softenGeometry } from '../lab-clay/clay-soften.v1.js';
import * as C from '../lab-clay/clay-material.v10.js';
import { gitBlobSha, mulberry } from './cloud-family.v1.js';

export const PACK = 'media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius';
export const PLANETS = Array.from({ length: 11 }, (_, i) => ({ id: 'Planet_' + (i + 1), path: PACK + '/Environment/GLTF/Planet_' + (i + 1) + '.gltf' }));
export const PLANET_VERSION = 'kfb.sky.planets/1';
const enc = p => p.split('/').map(encodeURIComponent).join('/');
const RAW = p => 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/' + enc(p);
const LOCAL = p => new URL('../' + enc(p), import.meta.url).href;
/* Himmelsplätze: Azimut/Höhe in Grad, Größe = Winkeldurchmesser in Grad. Feste Setzung, nicht gemessen — Georg wählt. */
export const SLOTS = [{ az: -32, el: 26, deg: 11 }, { az: 34, el: 40, deg: 6.5 }, { az: 150, el: 20, deg: 15 }, { az: 96, el: 55, deg: 5 }, { az: -118, el: 33, deg: 8.5 }, { az: -170, el: 48, deg: 4.5 }];
export const SETS = { 3: ['Planet_1', 'Planet_6', 'Planet_9'], 6: ['Planet_1', 'Planet_6', 'Planet_9', 'Planet_3', 'Planet_11', 'Planet_4'] };

const cache = new Map();
export async function loadPlanet(THREE, id) {
  if (cache.has(id)) return cache.get(id);
  const p = PLANETS.find(x => x.id === id); if (!p) throw new Error('Planet unbekannt: ' + id);
  const pr = (async () => {
    let text = null, from = null, bytes = 0, sha = null; const tried = [];
    for (const [src, url] of [['Projektkopie', LOCAL(p.path)], ['RAW @main', RAW(p.path)]]) {
      try { const r = await fetch(url); if (!r.ok) { tried.push(src + ' HTTP ' + r.status); continue; } const u8 = new Uint8Array(await r.arrayBuffer()); if (u8.length < 1000) { tried.push(src + ' ' + u8.length + ' B'); continue; }
        bytes = u8.length; sha = await gitBlobSha(u8); text = new TextDecoder().decode(u8); from = src; break; } catch (e) { tried.push(src + ' ' + e.message); }
    }
    if (!text) throw new Error('SOURCE_REQUIRED: ' + p.path + ' (' + tried.join('; ') + ')');
    const gltf = await new Promise((res, rej) => new GLTFLoader().parse(text, '', res, rej));
    let mesh = null; gltf.scene.traverse(o => { if (o.isMesh && !mesh) mesh = o; });
    const g = mesh.geometry; g.computeBoundingBox(); g.computeBoundingSphere();
    const sz = g.boundingBox.getSize(new THREE.Vector3());
    const inv = { id, path: p.path, from, bytes, sha, mesh: mesh.name, material: mesh.material.name + ' · ' + mesh.material.type + (mesh.material.map ? ' · Atlas ' + mesh.material.map.image.width + '²' : ''), verts: g.attributes.position.count, tris: (g.index ? g.index.count : g.attributes.position.count) / 3, size: sz.toArray().map(v => +v.toFixed(2)), r: +g.boundingSphere.radius.toFixed(2) };
    return { id, gltf, mesh, geometry: g, material: mesh.material, inv, clayGeo: null };
  })();
  cache.set(id, pr); pr.catch(() => cache.delete(id)); return pr;
}
export function clayGeometry(THREE, P) {
  if (!P.clayGeo) { const t0 = performance.now(), r = softenGeometry(THREE, P.geometry, { maxEdge: 0.12, maxLevels: 2, iters: 6, lump: 0.014, lumpFreq: 1.4, seed: +P.id.split('_')[1] * 13, maxTris: 60000 }); P.clayGeo = r.geometry; P.clayInfo = 'soften ' + r.levels + ' Stufen · ' + Math.round(r.tris) + ' △ · ' + Math.round(performance.now() - t0) + ' ms'; }
  return P.clayGeo;
}

export function createPlanetLayer({ THREE, scene, camera, distance = 300, getClayU = null }) {
  const group = new THREE.Group(); group.name = 'sky-planets'; group.visible = false; scene.add(group);
  let mode = 'off', ids = [], items = [], mats = [], spin = 0, token = 0, lastErr = null, clayU = null;
  const clear = () => { for (const it of items) group.remove(it.obj); for (const m of mats) m.dispose(); items = []; mats = []; };
  const self = {
    group, get mode() { return mode; }, get ids() { return ids.slice(); },
    async set(m = 'off', set = 3) {
      const my = ++token; mode = m; ids = m === 'off' ? [] : (Array.isArray(set) ? set : SETS[set] || SETS[3]).slice(0, SLOTS.length);
      clear(); group.visible = mode !== 'off'; if (mode === 'off') return self;
      try {
        const loaded = await Promise.all(ids.map(id => loadPlanet(THREE, id))); if (my !== token) return self;
        if (mode === 'clay' && !clayU) clayU = getClayU ? await getClayU() : null; if (my !== token) return self;
        const r = mulberry(17);
        loaded.forEach((P, i) => {
          const s = SLOTS[i], az = s.az * Math.PI / 180, el = s.el * Math.PI / 180, size = 2 * distance * Math.tan(s.deg * Math.PI / 360) / (2 * P.inv.r);
          let mat, geo = P.geometry;
          if (mode === 'clay' && clayU) { geo = clayGeometry(THREE, P); const U = { ...clayU, uClayHand: { value: 0.55 }, uClayTile: { value: 1.75 }, uClayPrintTile: { value: 4.9 } };
            mat = C.makeClayMaterial(THREE, U, { src: P.material, profile: 'nature' }); mat.name = 'planet-clay-' + P.id; }
          else { mat = P.material.clone(); mat.name = 'planet-' + P.id; mat.side = THREE.FrontSide; }
          mat.fog = false; mat.emissive = mat.emissive || new THREE.Color(); mats.push(mat);
          const o = new THREE.Mesh(geo, mat); o.name = 'planet-' + P.id; o.frustumCulled = false; o.castShadow = o.receiveShadow = false;
          o.position.set(Math.sin(az) * Math.cos(el) * distance, Math.sin(el) * distance, -Math.cos(az) * Math.cos(el) * distance); o.scale.setScalar(size);
          o.rotation.set((r() - 0.5) * 0.6, r() * 6.28, (r() - 0.5) * 0.5); group.add(o);
          items.push({ obj: o, P, slot: s, w: 0.02 + r() * 0.05 });
        });
        lastErr = null;
      } catch (e) { lastErr = e.message; console.warn(e); }
      return self;
    },
    update(dt, { night = 0, map = null } = {}) {
      if (mode === 'off') return; group.position.copy(camera.position); spin += dt;
      for (const it of items) { it.obj.rotation.y += it.w * dt; if (it.obj.material.emissive) it.obj.material.emissive.setScalar(0.18 * night); if (it.obj.material.emissiveMap !== it.obj.material.map && it.obj.material.map) { it.obj.material.emissiveMap = it.obj.material.map; it.obj.material.needsUpdate = true; } }
    },
    probe() { return { version: PLANET_VERSION, mode, ids, distance, error: lastErr, items: items.map(it => ({ id: it.P.id, az: it.slot.az, el: it.slot.el, deg: it.slot.deg, tris: (it.obj.geometry.index ? it.obj.geometry.index.count : it.obj.geometry.attributes.position.count) / 3, from: it.P.inv.from, sha: it.P.inv.sha.slice(0, 12), clay: it.P.clayInfo || null })) }; },
    dispose() { token++; clear(); group.removeFromParent(); }
  };
  return self;
}
