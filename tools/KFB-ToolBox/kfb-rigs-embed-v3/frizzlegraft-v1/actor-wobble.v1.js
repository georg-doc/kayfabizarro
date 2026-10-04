/**
 * actor-wobble.v1 · »Jedes Rig ist ein Schauspieler« (Georg, 13.09. spät) — ein wiederverwendbarer
 * Federausschlag für angehängte Teile, die der Bewegung des Wirts NACHLAUFEN sollen: Carls Nase,
 * FrizzleBobs Ohren, später weitere gegraftete Teile.
 *
 * Das Verfahren ist unverändert aus `frizzlegraft-v1/ears.v2.js` übernommen — dort ist es geprüft
 * und bleibt UNANGETASTET (R10-Geist: ein bestehendes, funktionierendes Modul wird nicht angefaßt,
 * nur weil dieselbe Idee jetzt auch anderswo gebraucht wird). Hier steht sie einmal, für neue
 * Verbraucher:
 *
 *   1. Die WELT-Position eines Ankers wird jedes Bild gemessen.
 *   2. Ihre Geschwindigkeit, ins Lokale des Wirts gedreht, ist das Ausschlag-Ziel.
 *   3. Eine gedämpfte Feder läuft diesem Ziel nach (stiffness/damping), geklemmt auf `limit`.
 *   4. Das Ergebnis ist eine Drehung — sie gehört auf einen eigenen Drehpunkt AUF DEM TEIL, nicht
 *      auf den Wirt-Ursprung, sonst kreist das Teil um den falschen Punkt statt an seinem eigenen
 *      Ansatz zu wackeln, und auch nicht auf den gemessenen Knoten selbst, sonst mißt das nächste
 *      Bild die eigene Ausschlag-Bewegung mit (Rückkopplung).
 *
 * Kopf still = Teil still (Prime Directive, keine Leerlauf-Zappelei): ohne Bewegung ist das Ziel 0,
 * die Feder legt sich auf 0.
 *
 *   const wobble = new Wobble({ THREE });
 *   // je Bild, NACH dem Setzen der Ruhe-Rotation des Drehpunkts:
 *   pivot.quaternion.multiply(wobble.tick(dt, anchorNode));
 */
export class Wobble {
  constructor({ THREE, gainX = 0.10, gainZ = 0.10, stiffness = 42, damping = 8, limit = 0.45 }) {
    this.T = THREE;
    this.gainX = gainX; this.gainZ = gainZ;
    this.stiffness = stiffness; this.damping = damping; this.limit = limit;
    this.angX = 0; this.angZ = 0; this.velX = 0; this.velZ = 0;
    this.prev = new THREE.Vector3(); this.inited = false;
    this._q = new THREE.Quaternion(); this._e = new THREE.Euler();
    this._tmp = new THREE.Vector3(); this._tmp2 = new THREE.Vector3();
  }
  /* `anchor` liefert die WELT-Bewegung; ihr Lokal-Raum (anchor.parent, oder anchor selbst ohne
     Eltern) bestimmt die Achsen des Ausschlags — dieselbe Wahl wie in `ears.v2.js`. */
  tick(dt, anchor) {
    if (!dt || dt > 0.1) dt = 1 / 60;
    if (!anchor) return this._q.identity();
    const host = anchor.parent || anchor;
    anchor.getWorldPosition(this._tmp);
    if (!this.inited) { this.prev.copy(this._tmp); this.inited = true; return this._q.identity(); }
    this._tmp2.copy(this._tmp).sub(this.prev).multiplyScalar(1 / dt);
    this.prev.copy(this._tmp);
    const local = host.worldToLocal(this._tmp2.clone().add(this._tmp)).sub(host.worldToLocal(this._tmp.clone()));
    const targetX = -local.z * this.gainX, targetZ = local.x * this.gainZ;
    this.velX += ((targetX - this.angX) * this.stiffness - this.velX * this.damping) * dt;
    this.velZ += ((targetZ - this.angZ) * this.stiffness - this.velZ * this.damping) * dt;
    this.angX += this.velX * dt; this.angZ += this.velZ * dt;
    this.angX = Math.max(-this.limit, Math.min(this.limit, this.angX));
    this.angZ = Math.max(-this.limit, Math.min(this.limit, this.angZ));
    this._e.set(this.angX, 0, this.angZ);
    return this._q.setFromEuler(this._e);
  }
  reset() { this.angX = this.angZ = this.velX = this.velZ = 0; this.inited = false; }
}
