/* KFB WhackMan v1 · Leerlauf-Nummern
   Die ganze Enchilada: alle Clips, die das Legacy-Rig mitbringt (30 in EINER Datei), werden
   benutzt — nicht nur Idle/Walk/Run. Wer steht, fängt irgendwann an, etwas zu tun.

   Ehrlich benannt: ANGELN und AMBOSS-HÄMMERN gibt es im Legacy-Satz nicht. Was es gibt, ist
   nah genug, um mit einer Requisite genau das zu werden:

     Shoot(2h)Bow   → die Angel-Pose. Zweihändig, vorgeneigt, langer Halt. Mit einer Rute in der
                      Hand ist das Angeln; ohne Rute ist es ein Bogen. Requisite fehlt noch.
     HeavyAttack    → der Amboss-Schlag. Ausholen, runter, Nachschwingen.
     Interact       → Kurbeln, Hebel, Truhe.
     PickUp         → Aufheben.
     Climbing       → an nichts hochklettern, was da ist. Absurd, deshalb drin.
     LayingDownIdle → Nickerchen mitten im Dungeon.

   Die Auswahl steht in einer Tabelle, nicht in einer Namensregel: ein Clip kommt nur vor, wenn
   das Rig ihn wirklich liefert, und was fehlt, wird gemeldet statt ersetzt. */

/* Gewichte: wie oft eine Nummer drankommt. Dance und Wave sind billig und lesbar, der
   Amboss-Schlag ist teurer und darf seltener kommen. */
export const NUMMERN = [
  ['Idle', 0, 1.6, 'Stehen'],
  ['Wave', 2.2, 2.2, 'Winken'],
  ['Cheer', 1.8, 2.6, 'Jubel'],
  ['Dance', 1.6, 4.5, 'Tanz'],
  ['Interact', 1.7, 2.2, 'Hebel/Kurbel'],
  ['PickUp', 1.5, 1.6, 'Aufheben'],
  ['HeavyAttack', 1.2, 2.0, 'Amboss-Schlag'],
  ['Attack(1h)', 1.0, 1.4, 'Hieb'],
  ['AttackSpinning', 0.8, 1.8, 'Drehschlag'],
  ['Block', 1.0, 1.6, 'Deckung'],
  ['Throw', 1.0, 1.5, 'Wurf'],
  ['Shoot(2h)Bow', 1.4, 3.2, 'Angeln (Bogen-Pose)'],
  ['Shooting(1h)', 0.7, 2.0, 'Zielen'],
  ['Climbing', 0.9, 2.6, 'Klettern an nichts'],
  ['LayingDownIdle', 0.9, 3.4, 'Nickerchen'],
  ['Roll', 0.8, 1.2, 'Rolle'],
  ['Hop', 1.1, 1.0, 'Hüpfer'],
  ['Jump', 0.9, 1.2, 'Sprung'],
  ['Defeat', 0.5, 2.4, 'Zusammenklappen'],
  ['BasePose', 0.3, 1.2, 'T-Pose (Rig-Beleg)'],
  ['AttackCombo', 0.9, 2.2, 'Kombo'],
  ['Shoot(1h)', 0.7, 1.4, 'Schuss einhändig'],
  ['Shoot(2h)', 0.7, 1.6, 'Schuss zweihändig'],
  ['Shooting(2h)', 0.6, 2.0, 'Anlegen zweihändig'],
  /* Die Dashes sind eigentlich Fortbewegung — im Stand gespielt werden sie zum Zucken, und das
     ist genau die Art absurder Moment, die Georg wollte. Deshalb selten, aber drin. */
  ['DashBack', 0.5, 0.9, 'Rückzucker'],
  ['DashFront', 0.5, 0.9, 'Vorzucker'],
  ['DashLeft', 0.4, 0.9, 'Seitzucker links'],
  ['DashRight', 0.4, 0.9, 'Seitzucker rechts']
];

export class LullShow {
  /* mixer/clips vom Akteur; `nachSekunden` = wie lange gestanden werden muss, bis etwas kommt. */
  constructor({ mixer, clips, nachSekunden = 2.6 }) {
    this.mixer = mixer;
    this.wait = nachSekunden;
    this.idleT = 0;
    this.active = null;
    this.actions = new Map();
    this.report = { vorhanden: [], fehlend: [], gesamtClipsImRig: clips.length };
    const byName = new Map(clips.map((c) => [c.name, c]));
    this.pool = [];
    for (const [name, weight, dauer, titel] of NUMMERN) {
      const clip = byName.get(name);
      if (!clip) { this.report.fehlend.push(name); continue; }
      const a = mixer.clipAction(clip);
      a.setLoop(2201, 1);              // LoopOnce
      a.clampWhenFinished = true;
      this.actions.set(name, a);
      this.report.vorhanden.push(name + ' · ' + titel);
      if (weight > 0) this.pool.push({ name, weight, dauer, titel });
    }
    /* Was das Rig NOCH mitbringt, aber die Tabelle nicht nennt — damit sichtbar ist, dass
       nichts stillschweigend unter den Tisch fällt. */
    const genannt = new Set(NUMMERN.map((n) => n[0]));
    this.report.imRigNichtGenutzt = clips.map((c) => c.name).filter((n) => !genannt.has(n));
    this.totalWeight = this.pool.reduce((s, e) => s + e.weight, 0);
  }

  pick() {
    let r = Math.random() * this.totalWeight;
    for (const e of this.pool) { r -= e.weight; if (r <= 0) return e; }
    return this.pool[this.pool.length - 1];
  }

  /* Zufällige Nummern sind ABGESCHALTET (Brief-Nachtrag): die Kür-Clips (Dash*, Roll,
     AttackSpinning …) tragen Root-Motion und schieben die Figur seitlich, ohne dass der Motor
     davon weiss — genau das erzeugte das Wand-Clipping. `actions` bleibt gefüllt, weil Gate C
     gezielt einzelne Clips daraus abruft (Jump/Hop beim Sprung); nur das ZUFÄLLIGE Auslösen
     hier ist deaktiviert. */
  update(dt, moving) {
    if (this.active) this.stop();
    this.idleT = 0;
    return null;
  }

  stop() {
    if (!this.active) return;
    this.active.action.fadeOut(0.22);
    setTimeout(() => { try { this.active && this.active.action.stop(); } catch (e) {} }, 240);
    this.active = null;
  }

  get titel() { return this.active ? this.active.titel : null; }
}
