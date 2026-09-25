/* KFB WorldBuilder v1 · Himmel, Wetter, Licht — TinySkies-Module aus globe-v13, gewickelt
   Genommen (und nur das): sky-presets · sky-atmosphere · day-night · weltstimmungen ·
   rain-overlay · starfield · sun-shadow · light-budget. NICHT: Travel-Gelände, flat shading,
   to-phong, Flugsteuerung, Teppich.
   Falle aus dem Brief: die Dateien sind keine Standalone-Module. Sie bekommen THREE als Argument
   (EINE Instanz, die der Import-Map), und day-night/light-budget importieren `./sky-presets.js`
   relativ. Deshalb werden alle acht über DIESELBE Basis-URL ohne Anhängsel importiert — der
   relative Import löst auf genau das Modul auf, das auch der Host hält (eine Instanz, gemessen
   über Objektgleichheit von getSkyPreset('day')).
   Regel: eine Stimmung dreht nur den FARBTON (Himmel über day-night.setHimmelTon, Boden über
   planet.setMood) — nie Sättigung oder Helligkeit, nie die Lichter. */

import * as THREE from 'three';
import { ownerImport } from './wd-donors.js';

export const TS_REF = 'main';
export const TS = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@' + TS_REF + '/travel/wip/travel_globe_wsa/globe-v13/';
export const FILES = ['sky-presets.js', 'sky-atmosphere.js', 'day-night.js', 'weltstimmungen.js', 'rain-overlay.js', 'starfield.js', 'sun-shadow.js', 'light-budget.js'];
const START = { day: 0.18, evening: 0.46, night: 0.70 };

async function imp(f) {
  try { return await import(TS + f); }
  catch (e) { return ownerImport(TS + f); }
}

export async function makeSky({ scene, renderer, planet, log = () => {} }) {
  const M = {};
  for (const f of FILES) { M[f] = await imp(f); log('TinySkies ' + f + ' @' + TS_REF + ' loaded'); }
  const P = M['sky-presets.js'], DN = M['day-night.js'], WS = M['weltstimmungen.js'], RN = M['rain-overlay.js'];
  const ST = M['starfield.js'], SS = M['sun-shadow.js'], LB = M['light-budget.js'], AT = M['sky-atmosphere.js'];
  const day = P.getSkyPreset('day');
  /* EIN Umrechnungsfaktor für alle Weltlängen der Quelle (GLOBE_RADIUS 5 → planet.R). Farben,
     Intensitäten, Verläufe und Shader bleiben unberührt. */
  const K = planet.R / 5;
  scene.fog = new THREE.Fog(day.fogColor, day.fogNear * K, day.fogFar * K);
  const rig = P.buildLightRig(THREE, scene, day);
  for (const k of ['sun', 'sun2', 'fill', 'fill2', 'back']) rig[k].position.multiplyScalar(K);
  const stars = ST.createStarfield(THREE);
  scene.add(stars.group);
  const aurora = AT.createAurora(THREE);
  aurora.group.scale.setScalar(K);
  scene.add(aurora.group);
  const rays = AT.createGodRays(THREE, { params: { faktor: 0.025, abstand: 13.15 * K } });
  rays.group.scale.setScalar(K);
  scene.add(rays.group);
  const globe = {
    setAtmosphereGlow: (h) => planet.setAtmosphereGlow(h),
    setCloudOpacity: (v) => planet.setCloudOpacity(v)
    /* setOceanColors fehlt absichtlich: v1 hat kein Meer — day-night prüft auf Existenz */
  };
  const zyklus = DN.createDayNight({ THREE, scene, lights: rig, stars, globe, lighting: null, start: 'day' });
  zyklus.setFogScale(K);
  zyklus.repaint();
  const rain = RN.createRainOverlay({ THREE });
  /* Schattenbox: Quelle ±5 bei R 5 folgt dem Spieler; hier ±40 m um den Fokus (Figur ~33 Texel) */
  const shadow = SS.createSunShadow({ THREE, renderer, sun: rig.sun, empfaenger: [planet.mesh], params: { spanne: 40, tiefe: planet.R * 1.6 } });
  scene.add(shadow.ziel);
  const budget = LB.createLightBudget({ THREE, scene, renderer });
  log('TinySkies · sky-presets resolved once (day-night + light-budget import the same URL) · 8 lights from buildLightRig · world lengths ×' + K + ' (R ' + planet.R + ' / 5) · shadow VSM ±' + shadow.params.spanne);

  const S = { time: 'day', rain: false, cycle: false, mood: 'verdant', t: 0 };
  const origin = new THREE.Vector3(), cK = new THREE.Vector3();
  const api = {
    S, rig, zyklus, stars, aurora, rays, rain, shadow, budget, K, STIMMUNGEN: WS.STIMMUNGEN,
    excluded: [stars.group, aurora.group, rays.group],
    setTime(name) {
      S.time = name;
      S.cycle = false;
      zyklus.setEnabled(false);
      zyklus.setPhase(START[name] ?? START.day);
    },
    setRain(on) { S.rain = !!on; },
    setCycle(on) { S.cycle = !!on; zyklus.setMinutes(3); zyklus.setEnabled(S.cycle); },
    setMood(id) {
      const m = WS.stimmungNach(id);
      S.mood = m.id;
      planet.setMood(m);
      zyklus.setHimmelTon(m.himmel);
      return m;
    },
    get label() { return zyklus.label; },
    update(dt, camera, focus, up) {
      S.t += dt;
      zyklus.update(dt);
      zyklus.setSpaceByCamera(camera.position.length(), planet.R);
      const nw = zyklus.nachtGewicht;
      aurora.setGewicht(nw);
      aurora.update(dt, camera, cK.copy(focus).divideScalar(K), up);
      /* Sterne: Quelle Radius 80 um den Ursprung; hier mit der Kamera, auf 85 % der Sichtweite */
      stars.group.position.copy(camera.position);
      stars.group.scale.setScalar(camera.far * 0.85 / 80);
      const mix = zyklus.preset;
      rays.setGewicht(1 - nw);
      rays.update(S.t, rig.sun.position, origin, mix.sunColor, mix.sunIntensity);
      shadow.folgen(focus);
      rain.update(dt, S.rain ? 1 : 0, 0);
      if (S.cycle) {
        const l = zyklus.label.split('· ')[1];
        if (l) S.time = l.trim();
      }
    },
    overlay(r) { rain.render(r); },
    report() { return budget.zeile(planet.mesh); }
  };
  api.setTime('day');
  api.setMood('verdant');
  return api;
}
