/* KFB WhackMan v1 · Wandkollision
   Ergänzt den MazeMotor, ersetzt ihn nicht. Der Motor hält die KANONISCHE Position schon immer
   auf einer legalen Kante (siehe TEST_REPORT: 4000 Schritte, 0 Durchbrüche) — das ist Bewegung,
   keine Kollision. Was fehlte: eine Prüfung auf der DARSTELLUNG. Root-Motion aus einzelnen
   Legacy-Clips (Dash*, Roll, AttackSpinning …) verschiebt Bein-/Hüftknochen und damit die
   sichtbare Silhouette seitlich, unabhängig vom Motor — das kann in eine Wand hineinreichen,
   auch wenn der Knoten darunter korrekt ist.

   Diese Datei baut die begehbare Fläche als Rechtecke (eine Zelle = ein Modul) und klemmt jede
   WELT-Position (Spieler, Verfolger) auf die Vereinigung der Zelle, in der der Akteur steht,
   plus ihrer legalen Nachbarn — großzügig genug für jede echte Bewegung auf dem Graphen, eng
   genug, um seitliches Herausrutschen aus dem Gang zu stoppen. */

function cellRect(node, MOD) {
  const h = MOD / 2;
  return { x0: node.x * MOD - h, x1: node.x * MOD + h, z0: node.y * MOD - h, z1: node.y * MOD + h };
}

/* Vereinigung der Zelle `nodeKey` und all ihrer legalen Nachbarn (inkl. Tunnel/Pferchtür).
   Nicht nur die eine Zelle: an einer Kreuzung oder mitten auf einer Kante muss auch die
   Nachbarzelle offen sein, sonst klemmt der Akteur beim ganz normalen Durchqueren. */
export function safeFootprint(graph, nodeKey, MOD) {
  const n = graph.nodes.get(nodeKey);
  if (!n) return null;
  let r = cellRect(n, MOD);
  for (const k of Object.values(n.nbr)) {
    const nb = graph.nodes.get(k);
    if (!nb) continue;
    const rr = cellRect(nb, MOD);
    r = { x0: Math.min(r.x0, rr.x0), x1: Math.max(r.x1, rr.x1), z0: Math.min(r.z0, rr.z0), z1: Math.max(r.z1, rr.z1) };
  }
  return r;
}

/* Klemmt (x, z) mit `margin` (Körperradius) auf die begehbare Fläche um `occupiedKey` UND
   `secondKey` (z. B. from/to derselben Kante, während man sie überquert). Gibt {x, z, hit}
   zurück — `hit` ist wahr, wenn tatsächlich geklemmt wurde, für Kontakt-Feedback später. */
export function clampToMaze(x, z, graph, occupiedKey, MOD, margin = 0, secondKey = null) {
  let r = safeFootprint(graph, occupiedKey, MOD);
  if (!r) return { x, z, hit: false };
  if (secondKey && secondKey !== occupiedKey) {
    const r2 = safeFootprint(graph, secondKey, MOD);
    if (r2) r = { x0: Math.min(r.x0, r2.x0), x1: Math.max(r.x1, r2.x1), z0: Math.min(r.z0, r2.z0), z1: Math.max(r.z1, r2.z1) };
  }
  const cx = Math.min(Math.max(x, r.x0 + margin), r.x1 - margin);
  const cz = Math.min(Math.max(z, r.z0 + margin), r.z1 - margin);
  return { x: cx, z: cz, hit: cx !== x || cz !== z };
}

/* ---------- Bounce · additive Cartoon-Feder ----------
   kfb-cartoon-animation_v2 §8.3: "finalPosition = physicsPosition + visualBounceOffset" — eine
   VFX-Feder darf die kanonische Position nie ÜBERSCHREIBEN, nur einen Versatz drauflegen. Diese
   Klasse hält NUR den Versatz plus Stauchung/Spin und federt selbständig zurück auf 0 — die
   "magnetische" Rückkehr zur wahren Position, mit sichtbarer Übergangsbewegung statt Sprung.
   XZ ist immer eine Heim-Feder (spring-to-zero); Y ist entweder dieselbe Feder (Akteure, die
   seitlich abprallen) oder — mit `gravity` — ein echter Fall-und-Aufprall-Bogen (Spieler-Treffer:
   hochgewirbelt, fällt, landet, staucht). */
export class Bounce {
  constructor() { this.x = 0; this.y = 0; this.z = 0; this.vx = 0; this.vy = 0; this.vz = 0; this.sq = 0; this.sqv = 0; this.spin = 0; this.rot = 0; }
  kick(ix, iy, iz) { this.vx += ix; this.vy += iy; this.vz += iz; }
  update(dt, { k = 130, damp = 14, gravity = 0 } = {}) {
    const d = Math.max(0, 1 - damp * dt);
    this.vx += -this.x * k * dt; this.vx *= d; this.x += this.vx * dt;
    this.vz += -this.z * k * dt; this.vz *= d; this.z += this.vz * dt;
    if (gravity) {
      this.vy -= gravity * dt;
      this.y += this.vy * dt;
      if (this.y <= 0 && this.vy < 0) {
        this.y = 0;
        this.sq = Math.min(1, -this.vy / (gravity * 0.35));
        this.vy *= -0.4;
        if (Math.abs(this.vy) < gravity * 0.05) this.vy = 0;
      }
    } else {
      this.vy += -this.y * k * dt; this.vy *= d; this.y += this.vy * dt;
    }
    this.sqv += (-this.sq * 190 - this.sqv * 13) * dt; this.sq += this.sqv * dt;
    /* `rot` ist ein Federpaar wie x/z, kein reiner Drehimpuls: ohne Rückstellkraft bleibt nach
       jedem Kick ein permanenter Dreh-Rest stehen (`spin` klingt ab, aber `rot` selbst wandert
       nie zurück auf 0) — genau der Bug, bei dem eine Figur nach einem Treffer seitlich verdreht
       weiterläuft statt in ihre alte Blickrichtung zurückzufedern. */
    this.spin += -this.rot * k * dt; this.spin *= d; this.rot += this.spin * dt;
  }
}

/* Generische, weiche Trennung zweier Kreise, die niemals ineinanderstecken dürfen: statt eines
   harten Positions-Snaps wird der Ausschlag als IMPULS in die Bounce-Feder(n) gegeben — Ursache
   → Ausschlag → Rückkehr, keine Teleportation. `weightA/B` teilt den Ausschlag auf (0 = bleibt
   stehen, 1 = gibt voll nach); ein Prop gibt typischerweise voll nach, zwei gleichrangige
   Akteure teilen sich ihn. */
export function pushApart(ax, az, bx, bz, minDist, bounceA, bounceB, weightA = 0.5, weightB = 0.5) {
  const dx = bx - ax, dz = bz - az;
  const d = Math.hypot(dx, dz);
  if (d >= minDist) return false;
  const overlap = minDist - d;
  const nx = d > 1e-4 ? dx / d : 1, nz = d > 1e-4 ? dz / d : 0, speed = overlap * 30;
  if (bounceA && weightA > 0) bounceA.kick(-nx * speed * weightA, 0, -nz * speed * weightA);
  if (bounceB && weightB > 0) bounceB.kick(nx * speed * weightB, 0, nz * speed * weightB);
  return true;
}
