/* FrizzleGraft v1 · eyeoval.v1 — OVALE AUGEN UND IHRE NEIGUNG.  13.09.2026
 *
 * WOFÜR (Georg 13.09.): »die Augen, die jetzt runde Sphären sind, in den entsprechenden Achsen
 * skalieren beziehungsweise leicht verzerren — und die Kippung, sodass die beiden Ovale leicht nach
 * innen geneigt sind. Das ist ja die klassische Cartoon-Augenstellung.«
 *
 * WARUM EIN EIGENES MODUL UND KEIN FORK DES RIGS: `pet-eye-rig.v6.js` ist geteilt (Studio, Combat
 * Arena, SpinballCast). Eine sechste Fassung wäre ab morgen die zweite Wahrheit. Hier wird nichts
 * umbenannt und nichts Privates veröffentlicht — die AUGENGRUPPE bekommt eine Skalierung und eine
 * Drehung um die Blickachse, beides Felder, die das Rig selbst nie schreibt.
 *
 * GEMESSEN AM RIG, bevor eine Zeile entstand: die Bildschleife des Rigs (`update`) schreibt je Bild
 * `e._pivot.rotation` (Pupille), `e._lids.rotation.z` (Schrägstellung der Lider), `e._up/_lo
 * .rotation.x` (Lidschluss) — **`e.scale` und `e.rotation.z` rührt sie nicht an**. Deshalb bleiben
 * beide stehen, ohne dass etwas je Bild nachgezogen werden müsste.
 * `build()` baut die Augen NEU (jeder Farbwechsel, jeder Pupillenstil ruft sie) — deshalb hängt
 * `attach()` sich EINMAL an `build` und legt die Verzerrung danach wieder auf.
 *
 * ⚠ WAS DIE VERZERRUNG NICHT MITNIMMT: Braue, Nase und Schnurrbart hängen am öffentlichen Anker
 * `rig.eyeFrame()` — der liefert Lage und RADIUS der runden Schale. Ein sehr flaches Auge lässt die
 * Braue also auf ihrer alten Höhe stehen; das ist gewollt (die Braue ist ein eigenes Bauteil mit
 * eigenen Reglern) und steht im Bericht, statt still zu passieren.
 */

export const SCHEMA = 'kfb.eyeoval/0.1';
export const DEFAULTS = { w: 1, h: 1, d: 1, tilt: 0 };
export const FIELDS = [
  { k: 'w',    label: 'Auge · Breite',            min: 0.55, max: 1.6, step: 0.01 },
  { k: 'h',    label: 'Auge · Höhe',              min: 0.55, max: 1.6, step: 0.01 },
  { k: 'd',    label: 'Auge · Tiefe',             min: 0.55, max: 1.6, step: 0.01 },
  { k: 'tilt', label: 'Neigung · nach innen (°)', min: -30,  max: 30,  step: 0.5 },
];

const DEG = Math.PI / 180;
const num = (v, d) => (typeof v === 'number' && isFinite(v) ? v : d);

/** Legt Verzerrung und Neigung auf ein gebautes Rig. Rückgabe ist ein Bericht, keine Behauptung. */
export function applyOval(rig, p) {
  if (!rig || !Array.isArray(rig.eyes) || !rig.eyes.length) return { status: 'KEIN_RIG' };
  const q = { ...DEFAULTS, ...(p || {}) };
  const w = num(q.w, 1), h = num(q.h, 1), d = num(q.d, 1), t = num(q.tilt, 0);
  const rows = [];
  rig.eyes.forEach((e, i) => {
    const sx = e._sx != null ? e._sx : (i === 0 ? -1 : 1);   // Rig-Vertrag: Index 0 ist links
    e.scale.set(w, h, d);
    /* Die Neigung ist SPIEGELGLEICH: ein positiver Regler kippt beide Ovale mit der Oberkante nach
       innen. Ohne die Spiegelung stünden beide Augen parallel schräg — das ist »müde«, nicht
       »Cartoon«. Der Splay des Rigs sitzt auf `rotation.y` und bleibt unberührt. */
    e.rotation.z = -sx * t * DEG;
    rows.push((sx < 0 ? 'links' : 'rechts') + ' ' + w.toFixed(2) + '×' + h.toFixed(2) + '×' + d.toFixed(2)
      + ' · ' + (e.rotation.z / DEG).toFixed(1) + '°');
  });
  return { status: 'OK', w, h, d, tilt: t, rows, round: w === 1 && h === 1 && d === 1 && t === 0 };
}

/**
 * Einmal ans Rig hängen. `get()` liefert die aktuellen Werte — so gilt auch nach einem `build()`
 * (Farbwechsel, Pupillenstil, Anker) wieder der eingestellte Stand, ohne dass der Aufrufer davon
 * wissen muss.
 */
export function attach(rig, get) {
  if (!rig) return { status: 'KEIN_RIG' };
  rig.__kfbOvalGet = get;
  if (!rig.__kfbOvalPatched) {
    const base = rig.build.bind(rig);
    rig.build = function (...a) {
      const r = base(...a);
      try { applyOval(rig, rig.__kfbOvalGet ? rig.__kfbOvalGet() : null); } catch (e) { console.warn('[eyeoval]', e && e.message); }
      return r;
    };
    rig.__kfbOvalPatched = true;
  }
  return applyOval(rig, get ? get() : null);
}

export function detach(rig) {
  if (!rig) return;
  rig.__kfbOvalGet = () => DEFAULTS;
  applyOval(rig, DEFAULTS);
}

export default { SCHEMA, DEFAULTS, FIELDS, applyOval, attach, detach };
