/* KFB Plant Prop Lab · Transform-Proprig (L0/L1, ohne Knochen)
   Die Quellen sind starre Netze. Ein Knochen-Rig vor dem Beweis wäre Arbeit an der falschen
   Stelle — also bewegen sich PIVOTS, nicht Vertices:

     PlantPropRoot
       PotRoot                  (starr, trägt die Komposition)
       SquashWrap               (Stauchen/Strecken, wirkt auf Pflanzen)
         PlantRoot[i]
           PlantPivot           (Neigung am Fuss: Wiegen, Wind, Nähe, Rückstoss)
             CrownPivot         (Nachlauf des Schopfes, halber Winkel, verzögert)
       LivingOverlay            (EyeRig, optional)

   Das Rig besitzt KEINE Weltbewegung und keine Kollision. Es bewegt nur, was innerhalb der
   Requisite liegt; der Konsument stellt die Requisite. */
import * as THREE from 'three';

export const LEVELS = ['STATIC', 'AMBIENT', 'AWARE'];
export const LEVEL_NOTE = {
  STATIC: 'kein Rig · Pivots auf Null',
  AMBIENT: 'Wiegen, Puls, Wind, Rückstoss',
  AWARE: 'AMBIENT + bestehender KFB EyeRig v6 (Blick/Blinzeln)'
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* Deterministische Phasen: gleicher Seed → gleiches Wiegen. Kein Math.random im Rig. */
function phases(seed, n) {
  let s = (seed | 0) || 1;
  const out = [];
  for (let i = 0; i < n; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    out.push((s / 4294967296) * Math.PI * 2);
  }
  return out;
}

export function makePropRig(prop, opts = {}) {
  const plants = prop.plants || [];
  /* Eine Mischgruppe hat einen Squash-Wrap JE TOPF — ein einzelner Wrap würde die ganze
     Gruppe atmen lassen statt jeder Pflanze ihren eigenen Puls zu geben. */
  const squashes = prop.squashes || (prop.squash ? [prop.squash] : []);
  const ph = phases(opts.seed ?? 1, plants.length * 3 + 3);
  const st = {
    level: opts.level || 'AMBIENT',
    sway: opts.sway ?? 0.5,          // Ruhewiegen
    wind: new THREE.Vector2(opts.windX ?? 0.25, opts.windZ ?? 0),
    gust: opts.gust ?? 0.35,
    pulse: opts.pulse ?? 0.25,       // Atmen über den Squash-Wrap
    proximity: opts.proximity ?? 0.6,
    t: 0
  };
  /* Rückstoss als FEDER, nicht als Animation: Impuls setzt Geschwindigkeit, Dämpfung holt
     zurück. Dadurch ist „settle" kein eigener Zustand, sondern das Ende derselben Rechnung. */
  const spring = plants.map(() => ({ vx: 0, vz: 0, x: 0, z: 0 }));
  let prox = { x: 0, z: 0, d: 1 };

  const api = {
    get level() { return st.level; },
    setLevel(l) {
      st.level = LEVELS.includes(l) ? l : 'AMBIENT';
      if (st.level === 'STATIC') api.reset();
      return st.level;
    },
    set(patch) { Object.assign(st, patch || {}); return api.report(); },
    setWind(x, z) { st.wind.set(x, z); },
    /* Nähe: normierte Richtung vom Prop zum Beobachter + Abstand 0…1 (1 = weit). */
    setProximityVector(x, z, d) { prox = { x, z, d: clamp(d, 0, 1) }; },
    impact(dirX = 1, dirZ = 0, strength = 1) {
      for (let i = 0; i < spring.length; i++) {
        const s = spring[i];
        s.vx += dirX * strength * 3.4;
        s.vz += dirZ * strength * 3.4;
      }
      return { strength, plants: spring.length };
    },
    pulseOnce(k = 1) { st._pulseK = (st._pulseK || 0) + k; },
    reset() {
      for (const p of plants) {
        p.pivot.rotation.set(0, p.pivot.userData.yaw || 0, 0);
        if (p.crown) p.crown.rotation.set(0, 0, 0);
      }
      for (const q of squashes) q.scale.set(1, 1, 1);
      for (const s of spring) { s.vx = s.vz = s.x = s.z = 0; }
    },
    update(dt) {
      if (st.level === 'STATIC') return;
      const d = Math.min(dt, 0.05);
      st.t += d;
      const t = st.t;
      /* Federn zuerst: Rückstoss und Abklingen gelten auch, wenn Wind und Wiegen 0 sind. */
      for (let i = 0; i < plants.length; i++) {
        const s = spring[i];
        s.vx += (-s.x * 46 - s.vx * 6.2) * d;
        s.vz += (-s.z * 46 - s.vz * 6.2) * d;
        s.x += s.vx * d; s.z += s.vz * d;
      }
      const pk = st._pulseK || 0;
      if (pk > 0) st._pulseK = Math.max(0, pk - d * 1.6);
      /* Puls über den Wrap: Volumen bleibt (y hoch → x/z runter), sonst „atmet" die
         Komposition sich in den Topf hinein. */
      for (let q = 0; q < squashes.length; q++) {
        const br = Math.sin(t * 1.35 + ph[0] + q * 1.7) * 0.011 * st.pulse + (st._pulseK || 0) * 0.05;
        const sy = 1 + br, sxz = 1 / Math.sqrt(Math.max(0.2, sy));
        squashes[q].scale.set(sxz, sy, sxz);
      }
      const gust = 0.72 + 0.28 * Math.sin(t * 0.83 + ph[1]) * st.gust;
      const wx = st.wind.x * gust, wz = st.wind.y * gust;
      const near = st.proximity * (1 - prox.d);
      for (let i = 0; i < plants.length; i++) {
        const p = plants[i], s = spring[i];
        const a = ph[2 + i * 3], b = ph[3 + i * 3];
        const swayX = (Math.sin(t * 0.62 + a) * 0.6 + Math.sin(t * 1.27 + a * 1.9) * 0.4) * 0.035 * st.sway;
        const swayZ = (Math.sin(t * 0.55 + b) * 0.6 + Math.sin(t * 1.11 + b * 2.3) * 0.4) * 0.035 * st.sway;
        /* Neigung um x kippt nach ±z, Neigung um z kippt nach ∓x — Vorzeichen entsprechend. */
        const bendX = clamp(swayZ + wz * 0.28 + s.z * 0.5 + prox.z * near * 0.18, -0.45, 0.45);
        const bendZ = clamp(-(swayX + wx * 0.28 + s.x * 0.5 + prox.x * near * 0.18), -0.45, 0.45);
        p.pivot.rotation.x = bendX;
        p.pivot.rotation.z = bendZ;
        p.pivot.rotation.y = (p.pivot.userData.yaw || 0) + Math.sin(t * 0.4 + a) * 0.02 * st.sway;
        if (p.crown) {
          /* Nachlauf: der Schopf folgt dem Fuss mit halbem Winkel und Verzögerung. */
          p.crown.rotation.x += (bendX * 0.55 - p.crown.rotation.x) * Math.min(1, d * 4.2);
          p.crown.rotation.z += (bendZ * 0.55 - p.crown.rotation.z) * Math.min(1, d * 4.2);
        }
      }
    },
    report: () => ({
      level: st.level, note: LEVEL_NOTE[st.level],
      plants: plants.length, crowns: plants.filter((p) => !!p.crown).length, squashWraps: squashes.length,
      sway: st.sway, wind: [+st.wind.x.toFixed(2), +st.wind.y.toFixed(2)],
      pulse: st.pulse, proximity: st.proximity,
      ownsWorldTransform: false
    })
  };
  return api;
}
