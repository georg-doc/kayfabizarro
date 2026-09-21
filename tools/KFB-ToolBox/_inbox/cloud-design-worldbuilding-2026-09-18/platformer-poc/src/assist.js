/* Chill-Assist: plausible Ziele finden, den Bogen RECHNEN, nicht teleportieren.

   Zwei Sätze, die den Unterschied zum Game Mode ausmachen:
   · Das Ziel wird nur gewählt, wenn es beim Absprung gültig ist — danach fliegt die Figur
     eine echte ballistische Bahn. Wer mitten im Flug die Welt ändert, landet nicht.
   · Der Bogen wird über die APEXHÖHE parametrisiert, nicht über die Zeit. Eine flache Bahn
     sieht nach Teleport aus; eine zu hohe nach Kanone. Die Höhe folgt aus Abstand und
     Höhendifferenz. */
import * as THREE from 'three';
import { edgeGap } from './world.js';

export function candidates(player, world, opts = {}) {
  const c = world.cell;
  const from = player.ground || player.lastSafe;
  if (!from) return [];
  const facing = new THREE.Vector3(Math.sin(player.yaw), 0, Math.cos(player.yaw));
  const moving = player.speed > 0.4 * c;
  const dir = moving ? new THREE.Vector3(player.vel.x, 0, player.vel.z).normalize() : facing;

  const out = [];
  for (const n of from.neighbours) {
    const to = n.to;
    const aim = aimPoint(player, to, c);
    const flat = new THREE.Vector3(aim.x - player.pos.x, 0, aim.z - player.pos.z);
    const dist = flat.length();
    if (dist < 0.8 * c) continue;
    const align = flat.clone().normalize().dot(dir);            // -1 … 1
    const drop = aim.y - player.pos.y;
    const plan = solveArc(player, aim, world);
    if (!plan) continue;

    /* Bewertung, offengelegt im LAB: Ausrichtung dominiert, dann Nähe, dann Höhenstrafe.
       Kein verstecktes „bestes Ziel" — die Zahlen stehen im Drawer. */
    const sAlign = (align + 1) / 2;
    const sDist = 1 - Math.min(1, dist / (10 * c));
    const sDrop = 1 - Math.min(1, Math.abs(drop) / (6 * c));
    const score = sAlign * 0.58 + sDist * 0.27 + sDrop * 0.15;
    if (align < -0.25 && !opts.all) continue;
    out.push({ platform: to, aim, dist, drop, align, score, plan,
      parts: { align: +sAlign.toFixed(2), dist: +sDist.toFixed(2), drop: +sDrop.toFixed(2) } });
  }
  out.sort((a, b) => b.score - a.score);
  return out;
}

/* Zielpunkt: nicht die Mitte (dann fliegt man über halbe Plattformen hinweg), sondern der
   nächstgelegene Punkt der Landefläche, 0,7 Zellen nach innen gerückt. */
export function aimPoint(player, plat, cell) {
  const inset = Math.min(0.7 * cell, plat.half.x * 0.8, plat.half.y * 0.8);
  const x = THREE.MathUtils.clamp(player.pos.x, plat.center.x - plat.half.x + inset, plat.center.x + plat.half.x - inset);
  const z = THREE.MathUtils.clamp(player.pos.z, plat.center.z - plat.half.y + inset, plat.center.z + plat.half.y - inset);
  return new THREE.Vector3(x, plat.top, z);
}

/* Ballistik mit Apex-Vorgabe. Wenn die nötige Horizontalgeschwindigkeit über dem liegt, was
   die Figur laufen kann, wird der Bogen HÖHER — nicht schneller. Damit bleibt die Bahn
   lesbar und die Landung trotzdem sicher.

   Und es gibt eine Obergrenze: ein Bogen, der 15 Einheiten über den Köpfen steht und zwei
   Sekunden dauert, ist kein „plausibles nächstes Ziel", sondern ein Mondsprung (gemessen an
   Atlas → Arena: apex 29, T 2,33). Solche Ziele werden ABGELEHNT — die Arena erreicht man
   über den Bouncer, nicht über einen Assist, der alles kann. */
export function solveArc(player, aim, world) {
  const g = player.t.gravity;
  const c = world.cell;
  const y0 = player.pos.y;
  const flat = Math.hypot(aim.x - player.pos.x, aim.z - player.pos.z);
  const maxH = player.t.run * 1.5;
  const maxClearance = 4.5 * c;
  const maxTime = 1.9;
  let clearance = 0.7 * c + flat * 0.13;
  for (let i = 0; i < 6; i++) {
    if (clearance > maxClearance) return null;
    const apexY = Math.max(y0, aim.y) + clearance;
    const vy = Math.sqrt(Math.max(0.01, 2 * g * (apexY - y0)));
    const tUp = vy / g;
    const tDown = Math.sqrt(Math.max(0.0001, 2 * (apexY - aim.y) / g));
    const T = tUp + tDown;
    const vh = flat / T;
    if (vh <= maxH || i === 5) {
      if (T > maxTime || vh > maxH) return null;
      const v0 = new THREE.Vector3((aim.x - player.pos.x) / T, vy, (aim.z - player.pos.z) / T);
      return { v0, time: T, apex: apexY, vh, clearance };
    }
    clearance *= 1.45;
  }
  return null;
}

/* Sichtbare Bahn: dieselbe Rechnung wie der Flug, als Linie. Was man sieht, ist was passiert. */
export function arcPoints(player, plan, steps = 26) {
  const pts = [];
  const g = player.t.gravity;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * plan.time;
    pts.push(new THREE.Vector3(
      player.pos.x + plan.v0.x * t,
      player.pos.y + plan.v0.y * t - 0.5 * g * t * t,
      player.pos.z + plan.v0.z * t));
  }
  return pts;
}
