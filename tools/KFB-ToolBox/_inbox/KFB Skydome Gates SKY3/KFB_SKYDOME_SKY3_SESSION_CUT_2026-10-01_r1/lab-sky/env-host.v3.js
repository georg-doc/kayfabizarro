/* KFB · SKY1 · EnvironmentHost v3 (01.10.) — wie v2, Schale 3 = spindle-sky.v3 (auslaufende Trichter, austauschbare End-Shader/Paletten): setSpindleEnds({unten, oben, palUnten, palOben, seed}).
 * KFB · SKY1 · EnvironmentHost v2 (01.10.) — wie v1, dazu: Schale 3 = spindle-sky.v2 (Polkappen), Planeten-Schicht (planets.v1, gehört dem Host, folgt der Kamera, kein eigenes Licht/Uhr).
 * KFB · SKY1 · EnvironmentHost v1 (01.10.)
 * EIN Host: eine Scene, eine Kamera, ein Renderer, EINE Uhr (der Aufrufer ruft update(dt) aus seiner einen Schleife), EIN Fog-State (scene.fog, einziger Schreiber = day-night.js),
 * EIN Licht-Rig (buildLightRig ODER das Rig des Wirts als Adapter), EINE Tageszeit (day-night.js), EIN Wetter, EINE aktive Himmelsschale.
 * Quellen unverändert (KFB-Travel-Globe@8614282aab2c, travel/globe-v13/): sky-presets · day-night · sky-atmosphere · lens-flare · rain-overlay · starfield · weltstimmungen.
 * Schale 2: travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js (blob 919ed27bb4ab). Schale 3: spindle-sky.v1.js (Combat-Donoren).
 * Zwei Anpassungen am Host-Maßstab, beide benannt: (a) Starfield/Aurora/God-Rays-Gruppen werden mit k skaliert (Quellen rechnen in Globus-Einheiten, Radius 5);
 *   (b) die Punktgröße des Starfield-Shaders ist `aSize·300/Entfernung` — die Konstante 300 wird mit demselben k multipliziert, sonst wären die Sterne unter einem Pixel. */
import * as THREE_NS from 'three';
import { getSkyPreset, buildLightRig } from '../travel/globe-v13/sky-presets.js';
import { createDayNight } from '../travel/globe-v13/day-night.js';
import { createStarfield } from '../travel/globe-v13/starfield.js';
import { createAurora, createGodRays } from '../travel/globe-v13/sky-atmosphere.js';
import { createLensFlare } from '../travel/globe-v13/lens-flare.js';
import { createRainOverlay } from '../travel/globe-v13/rain-overlay.js';
import { STIMMUNGEN, stimmungNach } from '../travel/globe-v13/weltstimmungen.js';
import { createSpindleSky, loadCards } from './spindle-sky.v5.js';
import { createPlanetLayer } from './planets.v1.js';

const SKYDOME = new URL(encodeURI('../travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js'), import.meta.url).href;
export const SHELLS = ['tiny', 'travel', 'spindle'];
export const SHELL_LABEL = { tiny: 'TinySkies Gradient', travel: 'Travel Skydome', spindle: 'Card-Spindle' };
export const MOODS = STIMMUNGEN.map(s => ({ id: s.id, name: s.name }));
const PHASE = { day: 0.18, evening: 0.46, night: 0.70 };

export async function createEnvironmentHost({ THREE = THREE_NS, renderer, scene, camera, lights = null, radius = 1400, fogScale = 1, minutes = 6, travelVariant = 'S', travelMode = 3, cards = null, onNote = () => {}, getClayU = null, planetDistance = null }) {
  const rig = lights || buildLightRig(THREE, scene, getSkyPreset('day')), sun = rig.sun;
  if (!scene.fog) scene.fog = new THREE.Fog(0x60ccde, 15, 40);
  const kAtm = 0.35 * radius / 11.4, kStar = 0.9 * radius / 80, st = { time: 'day', weather: 'clear', shell: null, mood: 'verdant', rain: 0, t: 0, frames: 0 };
  const stars = createStarfield(THREE); stars.group.scale.setScalar(kStar); scene.add(stars.group);
  stars.group.traverse(o => { if (o.material && o.material.vertexShader) { o.material.vertexShader = o.material.vertexShader.replace('300.0 /', (300 * kStar).toFixed(1) + ' /'); o.material.needsUpdate = true; } });
  const aurora = createAurora(THREE); aurora.group.scale.setScalar(kAtm); scene.add(aurora.group);
  const rays = createGodRays(THREE); rays.group.scale.setScalar(kAtm); scene.add(rays.group);
  const flareSun = { position: new THREE.Vector3() }, flare = createLensFlare({ THREE, sonne: flareSun }), rain = createRainOverlay({ THREE });
  const dn = createDayNight({ THREE, scene, lights: rig, stars, start: 'day', params: { minutes } }); dn.setFogScale(fogScale);
  const sunDir = new THREE.Vector3(), cen = new THREE.Vector3(), sunLocal = new THREE.Vector3(), cloudColor = new THREE.Color('#f3ead8'), tmpC = new THREE.Color();
  const planets = createPlanetLayer({ THREE, scene, camera, distance: planetDistance || radius * 0.21, getClayU });
  let shell = null, busy = Promise.resolve(), cardsP = cards ? Promise.resolve(cards) : null;
  const getCards = () => cardsP || (cardsP = loadCards({ onNote }));

  async function mountShell(id) {
    if (id === 'tiny') return { id, update() {}, dispose() {}, probe: () => ({ opaque: false, note: 'scene.background = radialer Verlauf (day-night.js paintRadialSky), keine Geometrie' }) };
    if (id === 'travel') {
      const { createSkydome } = await import(SKYDOME), dome = createSkydome({ THREE, radius, variant: travelVariant, mode: travelMode }); dome.group.name = 'skydome-shader'; scene.add(dome.group);
      const pal = () => { const m = dn.preset; const z = tmpC.set(m.hemiSkyColor).multiplyScalar(0.55).toArray(), mid = new THREE.Color(m.hemiSkyColor).toArray(), h = new THREE.Color(m.fogColor).lerp(new THREE.Color(m.sunColor), 0.4).multiplyScalar(1.1).toArray(); dome.setPalette([z, mid, h]); };
      let tp = 0;
      return { id, dome, variant: v => dome.setVariant(v), update(dt) { dome.follow(camera); dome.update(dt, { energy: 0.4 }); if ((tp -= dt) <= 0) { tp = 0.25; pal(); } }, dispose() { dome.dispose(scene); },
        probe: () => ({ opaque: true, variant: dome.getVariant(), radius, followsCamera: dome.group.position.distanceTo(camera.position) < 1e-3 }) };
    }
    if (id === 'spindle') {
      const sp = createSpindleSky({ THREE }), c = await getCards(); await sp.mount(scene, { cards: c, scale: radius * 0.8 / 110, ends: st.ends || {} });
      return { id, sp, update(dt) { sp.follow(camera); const night = dn.nachtGewicht; sp.update(dt, { brightness: 1 - 0.62 * night }); }, dispose() { sp.dispose(); }, probe: () => ({ opaque: true, ...sp.probe() }) };
    }
    throw new Error('Schale unbekannt: ' + id);
  }
  const host = {
    THREE, scene, camera, renderer, rig, sun, dn, stars, aurora, rays, flare, rain, planets, state: st, cloudColor, radius, kAtm, kStar,
    get shell() { return shell; },
    setShell(id) { return busy = busy.then(async () => { if (id === st.shell) return host; if (shell) { shell.dispose(); shell = null; st.shell = null; } shell = await mountShell(id); st.shell = id; dn.repaint(); return host; }); },
    setTime(t) { st.time = t; if (t === 'auto') dn.setEnabled(true); else { dn.setEnabled(false); dn.setPhase(PHASE[t] ?? 0.18); } },
    setAutoMinutes(m) { dn.setMinutes(m); },
    setPlanets(mode, set) { return planets.set(mode, set); },
    setSpindleEnds(p) { st.ends = { ...(st.ends || {}), ...p }; if (shell && shell.sp) shell.sp.setEnds(st.ends); },
    setWeather(w) { st.weather = w === 'rain' ? 'rain' : 'clear'; },
    setMood(id) { st.mood = id; const s = stimmungNach(id); dn.setHimmelTon(s.himmel); },
    update(dt) {
      st.t += dt; st.frames++;
      dn.update(dt); const night = dn.nachtGewicht, day = dn.tagGewicht;
      st.rain += ((st.weather === 'rain' ? 1 : 0) - st.rain) * Math.min(1, dt * 0.9); if (st.rain < 0.002 && st.weather === 'clear') st.rain = 0;
      sunDir.copy(sun.position); if (sun.target) sunDir.sub(sun.target.position); sunDir.normalize();
      stars.group.position.copy(camera.position);
      cen.copy(camera.position).multiplyScalar(1 / kAtm); sunLocal.copy(cen).addScaledVector(sunDir, 100);
      aurora.setGewicht(night * (1 - 0.8 * st.rain)); aurora.update(dt, camera, cen, new THREE.Vector3(0, 1, 0));
      rays.setGewicht(day * (1 - 0.85 * st.rain)); rays.update(st.t, sunLocal, cen, dn.preset.sunColor.getHex ? dn.preset.sunColor.getHex() : dn.preset.sunColor, dn.preset.sunIntensity);
      flareSun.position.copy(camera.position).addScaledVector(sunDir, camera.far * 0.8);
      flare.setColorScale(dn.preset.flareColorScale); flare.setGain(day * (1 - st.rain)); flare.update(camera);
      rain.update(dt, st.rain, 0);
      cloudColor.set('#f3ead8').lerp(tmpC.set(dn.preset.sunColor), 0.28).lerp(tmpC.set('#8f9bc4'), night * 0.8).multiplyScalar(1 - 0.18 * st.rain);
      planets.update(dt, { night });
      if (shell) shell.update(dt);
    },
    /* nach dem Hauptbild, ohne zu löschen */
    after() { flare.render(renderer); rain.render(renderer); },
    opaqueShells() { let n = 0; scene.children.forEach(o => { if ((o.isGroup || o.isMesh) && o.visible && /^(skydome-shader|spindle-sky)$/.test(o.name)) n++; }); return n; },
    footprint() {
      const mats = new Set(), geos = new Set(); let objs = 0, lightsN = 0; scene.traverse(o => { objs++; if (o.isLight) lightsN++; if (o.material) [].concat(o.material).forEach(m => mats.add(m)); if (o.geometry) geos.add(o.geometry); });
      const mem = renderer.info.memory; return { objects: objs, materials: mats.size, geometries: geos.size, lights: lightsN, gpuGeoms: mem.geometries, gpuTextures: mem.textures, programs: renderer.info.programs ? renderer.info.programs.length : null };
    },
    async leakTest(n = 10, order = ['tiny', 'travel', 'spindle', 'tiny']) {
      await host.setShell('tiny'); await new Promise(r => setTimeout(r, 50)); const a = host.footprint(), per = [];
      for (let i = 0; i < n; i++) { for (const s of order) { await host.setShell(s); host.update(1 / 60); renderer.render(scene, camera); } per.push(host.footprint()); }
      const b = host.footprint(), d = Object.fromEntries(Object.keys(a).map(k => [k, (b[k] ?? 0) - (a[k] ?? 0)]));
      return { cycles: n, order: order.join(' → '), before: a, after: b, delta: d, perCycle: per, ok: d.objects === 0 && d.materials === 0 && d.geometries === 0 && d.gpuTextures === 0 && d.gpuGeoms === 0 };
    },
    probe() {
      const p = dn.preset, fog = scene.fog, ng = dn.nachtGewicht;
      return { time: st.time, clock: dn.label, phase: +dn.phase.toFixed(3), night: +ng.toFixed(2), day: +dn.tagGewicht.toFixed(2), weather: st.weather, rain: +st.rain.toFixed(2), shell: st.shell, opaqueShells: host.opaqueShells(), shellProbe: shell ? shell.probe() : null,
        fog: fog ? { near: +fog.near.toFixed(1), far: +fog.far.toFixed(1), color: '#' + fog.color.getHexString() } : null, sun: { intensity: +sun.intensity.toFixed(2), color: '#' + sun.color.getHexString(), dir: sunDir.toArray().map(v => +v.toFixed(2)) },
        aurora: +aurora.gewicht.toFixed(2), godrays: +rays.gewicht.toFixed(2), godraysPeak: rays.spitze(), flare: flare.tor(), starsOpacity: +ng.toFixed(2), rainStreaks: rain.streaks, mood: st.mood, himmelTon: dn.himmelTon, planets: planets.probe(), preset: { sun: +p.sunIntensity.toFixed(2), hemi: +p.hemiIntensity.toFixed(2) } };
    },
    dispose() {
      if (shell) { shell.dispose(); shell = null; } planets.dispose(); for (const o of [stars, aurora, rays]) { o.dispose && o.dispose(); o.group.removeFromParent(); }
      flare.dispose(); rain.dispose(); if (!lights) Object.values(rig).forEach(l => l.removeFromParent());
    }
  };
  dn.setEnabled(false); dn.setPhase(PHASE.day);
  return host;
}
