/**
 * combat-arena-v2/mobs.v2.js — M3 MOB-BRAIN (MASTERPLAN §2, Slice S2).
 *
 * Gegner auf der Karte. Drei Dinge, und keins davon ist neu erfunden:
 *
 *   Körper   `modules/kfb-monster-roster.js` — 21 MonsterCuteCubes, Höhen/Clips/Blickachse
 *            GEMESSEN (04.09., `qa/monstercubes-inventur.html`). Kein zweiter Roster.
 *   Tempo    M9 (`locomotion.v2.js`) liefert Schrittmaß oder Takt. Die Cube-Monster haben KEINE
 *            Beine — ihr »Walk« ist ein Wippen. Sie laufen deshalb mit gemessenem TAKT und werden
 *            als solche geführt, nicht als kalibrierte Schrittkörper.
 *   Rand     `field.contain()` wie beim Spieler, aber OHNE Bounce: ein Mob, der über die Kante
 *            geschoben wird, fällt (MASTERPLAN §4 — Rand gehört dem Feld, Reaktion dem Körper).
 *
 * ── BODEN C2 (BLOCK) ───────────────────────────────────────────────────────────
 * »3 Mobs gespawnt, alle ≥ 2,2 u von FB und untereinander.« Der Spawn ist deshalb kein Zufall mit
 * Daumen, sondern Verwerfungs-Auswahl: Punkt aus dem Feld ziehen, Abstände prüfen, sonst neu ziehen.
 * Der Bericht nennt den KLEINSTEN gemessenen Abstand — nicht »hat geklappt«.
 *
 * ── WAS HIER (NOCH) NICHT PASSIERT ─────────────────────────────────────────────
 * Verhalten in einem Satz: weiter als Bissweite → hingehen, ab 2,4 u halten (Position geklemmt, nicht
 * nur Tempo genullt — sonst parkt er bei 2,16 u, gemessen). Kein Schuss, kein Schaden, kein Sterben:
 * der Mob-Schuss kommt in S3 aus `enemyShot()` der Werkbank v13 (Mündung am Maul, Projektil ab 2,4 u,
 * Biss darunter). Ein Modul, das zu früh schießt, verdeckt, ob das Laufen stimmt.
 *
 * KEIN Math.random (Boden C10): jeder Zufall kommt aus `rng` des Wirts.
 */

const CDN = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/';
const _mod = async (rel, cdn) => { try { return await import(rel); } catch (e) { return await import(cdn); } };
export const SPEC = {
  abstand: { spawn: 2.2, biss: 2.4, halteband: 0.15, luft: 0.12 },   // C2 · Angriffsweite (S3) · Ruhezone · Luft zwischen zwei Körpern
  /* GRÖSSE: zweiter Anlauf. Georg 06.09. erst »ungefähr ein Viertel kleiner« — ich habe daraus
     0,52–0,82 gemacht (×0,75 der Ausgangswerte), und am Bild war das zu viel: »vom Gefühl her sind
     die jetzt ein bisschen zu klein geworden«. Gemeint war »ein bisschen kleiner als vorher«.
     Jetzt 0,62–0,95 (×0,88 der Ausgangswerte 0,7–1,1) — bei FB 1,2 u also 0,74–1,14 u Höhe. */
  /* GRÖSSE ÜBER DIE BREITE: `faktor` ist nur noch Bezug für Radius und Tempo, `breite` ist das Maß,
     das normiert wird (Anteil der FB-Höhe). 0,72 × 1,2 u = 0,86 u Rumpfbreite. */
  hoehe: { faktor: 0.85, breite: 0.72 },
  /* Luft zwischen zwei Körpern, GROßZÜGIG: die Radien kommen jetzt aus der gemessenen Rumpfbreite
     (0,5–0,6 u), also stehen zwei Gegner bei 0,45 u Luft rund 1,6 u auseinander — sichtbar getrennt. */
  mobLuft: 0.45,
  /* SOZIALER ABSTAND, unabhängig von den Radien. Die Radiensumme (≈ 0,5 u) ist die Grenze, an der
     sich Modelle DURCHDRINGEN — sie ist keine Aufstellung. Georg 06.09.: »zumindest bei der
     Startaufstellung (und im Kampf) auch gucken, dass die enemies nicht zu nah beieinander stehen«.
     1,6 u ist gemessen an der Kartenbreite: auf 18 u stehen drei Gegner damit sichtbar getrennt,
     ohne dass der 2,4-u-Kreis um FB unmöglich wird (Umfang 15 u, drei Plätze à 5 u Bogen). */
  mobAbstand: 1.6,
  rateZiel: 1.4,                           // Clip-Rate, die wir höchstens fahren (wie M2, etwas ruhiger)
  taktTempo: 0.55,                         // u/s je Takt-Einheit für beinlose Körper — ENTSCHEIDUNG, nicht Messung
  /* Look: die Werte, mit denen die Atlas-Textur behandelt wird (`modules/kfb-monster-look.js`).
     Gemessen an `q_tree`: Roh 0,172 Helligkeit / 0,342 Sättigung → mit diesen Werten 0,299 / 0,547. */
  look: { sat: 1.5, val: 2.1, rough: 0.72, env: 0.35 },
  versuche: 400                            // Verwerfungs-Auswahl: so viele Züge, dann ehrlich aufgeben
};

export default class MobBrain {
  /* ZUSTAND ALS KLASSENFELDER, nicht am Ende von `init()`. `zeile()` und `probe()` laufen bei jedem
     Rendern — auch während `init()` noch auf den Roster-Import wartet. Dritter Fall derselben Sorte
     an einem Tag (M9: `koerper`, M5: `zaehler`, hier: `mobs`), alle mit demselben Muster:
     »Cannot read properties of undefined«. Jetzt steht der Zustand VOR jedem `await`. */
  mobs = [];
  gruppe = null;
  spawnBericht = null;
  loco = null;
  ziel = null;

  static describe() {
    return { name: 'MobBrain', capabilities: ['three@0.160', 'assets', 'field', 'rng', 'time'], view: '3d', determinism: 'seeded', spec: SPEC };
  }

  async init(ctx) {
    this.THREE = ctx.three; this.field = ctx.field; this.rng = ctx.rng; this.time = ctx.time;
    this.assets = ctx.assets; this.loader = ctx.gltfLoader; this.prepare = ctx.prepare;
    this.log = (s) => (ctx.log || console.info)('[mobs] ' + s);
    const R = await _mod('../modules/kfb-monster-roster.js', CDN + 'modules/kfb-monster-roster.js');
    this.R = R;
    /* LOOK-SCHICHT, importiert statt nachgebaut: `modules/kfb-monster-look.js` (Pet Studio v12,
       06.09.) behandelt die EINE Atlas-Textur je Monster auf einer Leinwand — Sättigung und Wert
       gemessen, Rauheit als Uniform. Georg 06.09.: »die enemies wirken noch sehr dunkel … weniger
       grau/verwaschen«. Das ist genau der Auftrag dieses Moduls; kein zweiter Farbweg hier. */
    this.L = await _mod('../modules/kfb-monster-look.js', CDN + 'modules/kfb-monster-look.js').catch(() => null);
    this.log(R.MONSTERS.length + ' Monster im Roster · ' + R.FLYERS.length + ' Flieger');
  }

  mount(parent) {
    this.gruppe = new this.THREE.Group();
    this.gruppe.name = 'mobs';
    parent.add(this.gruppe);
    return this.gruppe;
  }

  /** M9 anschließen (optional): dann kommen Tempo und Clip-Rate aus der Messung. */
  setLoco(loco) { this.loco = loco; return this; }
  /** Wen jagen sie. */
  setZiel(obj) { this.ziel = obj; return this; }

  _url(e) { return this.assets.RAW + this.assets.enc(e.file.replace('media/3D_Assets/', '')); }

  /**
   * Ein Platz, der die Spawn-Regel erfüllt. Verwerfungs-Auswahl: der Rand des Feldes und die
   * Abstände sind harte Bedingungen, keine Wünsche — deshalb wird gezogen, geprüft, verworfen.
   */
  _platz(radius) {
    const b = this.field.bounds();
    const zx = this.ziel ? this.ziel.position.x : 0, zz = this.ziel ? this.ziel.position.z : 0;
    for (let i = 0; i < SPEC.versuche; i++) {
      const x = b.x0 + this.rng() * b.w, z = b.z0 + this.rng() * b.h;
      if (!this.field.inside(x, z)) continue;
      if (this.field.edgeNormal(x, z).dist < radius * 1.2) continue;              // nicht auf die Kante setzen
      if (Math.hypot(x - zx, z - zz) < SPEC.abstand.spawn) continue;              // Abstand zu FB
      let frei = true;
      for (const m of this.mobs) if (Math.hypot(x - m.pos.x, z - m.pos.z) < SPEC.abstand.spawn) { frei = false; break; }
      if (frei) return { x, z, zuege: i + 1 };
    }
    return null;
  }

  /** `n` Mobs laden und setzen. Gibt den Spawn-Bericht zurück (Boden C2). */
  async spawn(n, fbHoehe) {
    const T = this.THREE, anz = n || 3, H = fbHoehe || 1.2;
    const pool = this.R.MONSTERS.filter((e) => !e.air && e.ready);
    const bericht = { gewuenscht: anz, gesetzt: 0, min: null, koerper: [], grund: null };
    for (let i = 0; i < anz; i++) {
      const e = pool[Math.floor(this.rng() * pool.length)];
      /* EINE GRÖSSE, GEMESSEN AM KÖRPER — nicht an Hörnern. Georg 06.09.: »das liegt vermutlich an
         Hörnern etc., die eine unterschiedliche Skalierung ergeben, wenn wir nicht Body oder Augen
         für die Skalierung nutzen«. Genau so: die Gesamtbox enthält Hörner, Ohren, Schwänze und
         Flügel — normiert man DIE auf eine Höhe, wird der RUMPF je Modell anders groß (gemessen:
         Rumpfbreiten 1,02 / 1,14 / 1,07 bei angeblich gleicher Höhe). Also `Body` vermessen, und die
         Streuung fällt weg: EIN Faktor für alle. */
      const zielH = +(H * SPEC.hoehe.faktor).toFixed(3);
      const zielB = +(H * SPEC.hoehe.breite).toFixed(3);
      const radius = zielH * 0.3;
      const p = this._platz(radius);
      if (!p) { bericht.grund = 'kein Platz nach ' + SPEC.versuche + ' Zügen (Feld zu klein für ' + anz + ' Mobs bei ' + SPEC.abstand.spawn + ' u Abstand)'; break; }
      let gltf = null;
      try { gltf = await this.loader.loadAsync(this._url(e)); }
      catch (err) { this.log('Modell nicht ladbar: ' + e.name + ' — ' + ((err && err.message) || err)); continue; }
      const wurzel = gltf.scene;
      /* Höhe MESSEN, dann skalieren — die Rohhöhe im Roster ist die Modellhöhe, nicht die Welthöhe. */
      wurzel.updateMatrixWorld(true);
      const ganz = new T.Box3().setFromObject(wurzel);
      /* ÜBER DIE BREITE NORMIEREN, NICHT ÜBER DIE HÖHE. Zweiter Anlauf an Georgs Diagnose: `Body` ist
         bei den Cube-Monstern ein KNOCHEN, kein Mesh (steht so in `kfb-stride-measure.js`) — mein
         Namensfilter fand also nichts und fiel auf die Gesamtbox zurück, und die Unterschiede blieben.
         Hörner, Ohren und Fühler wachsen nach OBEN; die Breite des Rumpfes ist bei allen 21 Modellen
         das stabile Maß (gemessen 1,02 / 1,14 / 1,07 u bei sehr unterschiedlichen Höhen). Also wird
         die BREITE auf einen Zielwert gebracht — dann sehen die Körper gleich groß aus, auch wenn
         einer Zacken trägt und der andere nicht. */
      const brRoh = Math.max(ganz.max.x - ganz.min.x, ganz.max.z - ganz.min.z) || 1;
      const s = zielB / brRoh;
      const halter = new T.Group();
      halter.name = 'mob-' + e.id + '-' + i;
      wurzel.scale.setScalar(s);
      wurzel.position.y -= ganz.min.y * s;                 // Füße auf den Boden: dafür zählt die GESAMTbox
      halter.add(wurzel);
      halter.position.set(p.x, this.field.floorY(), p.z);
      if (this.prepare) this.prepare(wurzel);
      /* ZWEI URSACHEN, EIN AUFTRAG (Georg 06.09.: »die enemies wirken noch sehr dunkel … weniger
         grau/verwaschen«). Gemessen an `q_tree`:
           (1) das Material kommt als **MeshBasicMaterial** — unbeleuchtet. Kein Key, kein Fill, kein
               Umgebungslicht erreicht es; die Figur bleibt so dunkel wie ihre Textur.
           (2) die Atlas-Textur selbst ist dunkel: mittlere Helligkeit **0,172**, Sättigung 0,342.
         Also erst auf ein Material umstellen, das Licht annimmt (`MeshStandard`, Map und Farbe
         übernommen), dann die Look-Schicht rechnen lassen: mit Sättigung ×1,5 und Wert ×1,8 steht
         die Textur bei 0,299 Helligkeit und 0,547 Sättigung — gemessen, nicht geschätzt. */
      wurzel.traverse((o) => {
        if (!o.isMesh && !o.isSkinnedMesh) return;
        const alt = o.material;
        if (!alt || alt.isMeshStandardMaterial) return;
        const neu = new T.MeshStandardMaterial({
          map: alt.map || null, color: alt.color ? alt.color.clone() : new T.Color(0xffffff),
          roughness: 0.72, metalness: 0,
          transparent: !!alt.transparent, alphaTest: alt.alphaTest || 0, side: alt.side
        });
        /* KEIN `skinning` im Konstruktor: der Parameter ist seit three r151 weg (Skinning läuft von
           selbst über den SkinnedMesh), und three warnt je Material einmal in die Konsole — drei
           Mobs, drei Zeilen Rauschen, gemessen 06.09. Belegt bleibt es: die Bones animieren. */
        neu.envMapIntensity = 0.35;
        neu.name = (alt.name || 'monster') + '-lit';
        o.material = neu;
        if (alt.dispose) alt.dispose();
      });
      if (this.L && this.L.skin) {
        try {
          const rep = this.L.skin(T, wurzel, e.id, this.lookParams || SPEC.look);
          if (!this._lookGemeldet) { this.log(this.L.zeile ? this.L.zeile(rep) : 'Look behandelt'); this._lookGemeldet = true; }
        } catch (err) { this.log('Look-Schicht AUSFALL: ' + ((err && err.message) || err)); }
      }
      wurzel.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      this.gruppe.add(halter);

      const mixer = new T.AnimationMixer(wurzel);
      /* RADIUS AUS DER GEMESSENEN BREITE. `0,3 × Höhe` war geraten und zu klein: die Rumpfbreiten
         liegen bei 1,02–1,23 u, der halbe Körper also bei 0,5–0,6 u — mit 0,3 steckten die Modelle
         ineinander, während die Rechnung »Abstand gewahrt« sagte. */
      wurzel.updateMatrixWorld(true);
      const skaliert = new T.Box3().setFromObject(wurzel);
      const rGemessen = Math.max(0.12, Math.max(skaliert.max.x - skaliert.min.x, skaliert.max.z - skaliert.min.z) * 0.5);
      const clips = {};
      for (const c of gltf.animations || []) clips[c.name] = c;
      const walkName = this.R.roleClip(e, 'walk');
      const idleName = this.R.roleClip(e, 'idle');
      const mob = {
        e, root: halter, mixer, clips, radius: rGemessen, hoehe: +(skaliert.max.y - skaliert.min.y).toFixed(3), skala: +s.toFixed(4),
        pos: halter.position.clone(), vel: new T.Vector3(), blick: 0,
        aktion: null, rolle: null, tempo: 0, gefallen: 0,
        takt: this.loco ? this.loco.hub(e.id) : null,
        refWalk: this.loco ? this.loco.ref(e.id, 'walk') : null,
        walkName, idleName
      };
      /* Tempo: Schrittmaß, wenn es eines gibt. Sonst aus dem gemessenen TAKT abgeleitet — und das
         ist eine Entscheidung, keine Messung (steht so in `schrittmass.json`). */
      mob.maxTempo = mob.refWalk ? +(mob.refWalk * SPEC.rateZiel).toFixed(3)
        : +((mob.takt ? mob.takt.takt : 1.8) * SPEC.taktTempo).toFixed(3);
      this.mobs.push(mob);
      this._spiele(mob, 'idle');
      bericht.gesetzt++;
      bericht.koerper.push({ id: e.id, name: e.name, hoehe: zielH, tempo: mob.maxTempo, zuege: p.zuege, takt: !!mob.takt, schritt: !!mob.refWalk });
      if (this.loco) this.loco.anmelden(e.name, {
        refWalk: mob.refWalk, takt: mob.takt ? mob.takt.takt : null, tempo: 0, rolle: 'walk',
        quelle: mob.refWalk ? 'schrittmass.json' : 'Takt (ohne Beine)'
      });
    }
    bericht.min = this._minAbstand();
    this.log(bericht.gesetzt + '/' + anz + ' gesetzt · kleinster Abstand ' + (bericht.min != null ? bericht.min.toFixed(2) + ' u' : '–')
      + ' · ' + bericht.koerper.map((k) => k.name + ' ' + k.hoehe + ' u').join(' · ') + (bericht.grund ? ' · ' + bericht.grund : ''));
    return (this.spawnBericht = bericht);
  }

  /**
   * DIE LEBENDEN — die einzige Liste, aus der ein Messwert kommen darf.
   *
   * `_kill()` in M5 hält einen Körper absichtlich ~0,9 s im Array, damit der Todes-Clip spielen kann.
   * In diesem Fenster hieß es aber »3 Mobs am Leben · Laufzeit-Reserve 3,41 u« — gemessen an drei
   * Leichen mit hp −13/−3/−13 (Kritiker 06.09.). Ein BLOCK-Boden, der eine Dreiviertelsekunde lang
   * die Unwahrheit sagt, ist genauso falsch wie einer, der es dauerhaft tut.
   * Geschoben (`_trennen`) werden weiter ALLE Körper — eine Leiche soll nicht in FB stecken — aber
   * GEMESSEN wird nur, was lebt.
   */
  lebende() { return (this.mobs || []).filter((m) => !m.tot && !m.weg); }

  /** Kleinster Abstand zwischen allen Paaren UND zum Spieler — die Zahl für C2. */
  _minAbstand() {
    const alle = this.lebende().map((m) => m.pos);
    if (this.ziel) alle.push(this.ziel.position);
    let min = null;
    for (let i = 0; i < alle.length; i++) for (let j = i + 1; j < alle.length; j++) {
      const d = Math.hypot(alle[i].x - alle[j].x, alle[i].z - alle[j].z);
      if (min == null || d < min) min = d;
    }
    return min;
  }

  _spiele(mob, rolle) {
    if (mob.rolle === rolle) return;
    const name = rolle === 'walk' ? mob.walkName : mob.idleName;
    const clip = name && mob.clips[name];
    if (!clip) return;
    const next = mob.mixer.clipAction(clip);
    next.setLoop(this.THREE.LoopRepeat, Infinity);
    if (mob.aktion && mob.aktion !== next) mob.aktion.fadeOut(0.2);
    next.reset().fadeIn(0.18).play();
    mob.aktion = next; mob.rolle = rolle;
  }

  update(dt) {
    if (!this.mobs.length) return;
    if (this.time && this.time.state.phase !== 'play') { for (const m of this.mobs) m.mixer.update(dt); return; }
    const zx = this.ziel ? this.ziel.position.x : 0, zz = this.ziel ? this.ziel.position.z : 0;
    for (const m of this.mobs) {
      const dx = zx - m.pos.x, dz = zz - m.pos.z, d = Math.hypot(dx, dz) || 1e-6;
      /* Verhalten in einem Satz: näher als Bissweite → stehen bleiben und ansehen, sonst hingehen.
         MIT HALTEBAND, und das ist keine Feinheit: die erste Fassung setzte nur das SOLL-Tempo auf 0
         und ließ den Körper auslaufen — er fuhr über die Linie und parkte bei 2,16 u, während hier
         2,4 u stand (gemessen 06.09., alle drei Mobs auf demselben Wert). Ein Mob, der dauerhaft
         INNERHALB der Bissweite steht, lässt den Projektil-Zweig von S3 nie zum Zug kommen — die
         Schwelle, auf der der nächste Slice aufsetzt, wäre von Anfang an unerreichbar.
         Also: Position wird an der Linie geklemmt, nicht nur das Tempo genullt. */
      const halt = SPEC.abstand.biss + SPEC.abstand.halteband;
      const gehen = d > halt;
      const soll = gehen ? m.maxTempo : 0;
      m.tempo += (soll - m.tempo) * Math.min(1, dt * 4);
      if (m.tempo > 0.02) {
        m.pos.x += (dx / d) * m.tempo * dt;
        m.pos.z += (dz / d) * m.tempo * dt;
      }
      /* Und danach die Linie durchsetzen: wer zu nah steht — durch Nachlauf oder weil FB auf ihn
         zugelaufen ist — wird nach außen gesetzt. Der Abstand ist eine Regel, kein Ergebnis. */
      const nd = Math.hypot(zx - m.pos.x, zz - m.pos.z) || 1e-6;
      if (nd < SPEC.abstand.biss) {
        const k = (SPEC.abstand.biss - nd) / nd;
        m.pos.x -= (zx - m.pos.x) * k;
        m.pos.z -= (zz - m.pos.z) * k;
        m.tempo = 0;
      }
      /* Rand: derselbe Aufruf wie beim Spieler, andere Reaktion — kein Abprallen, nur Versatz. */
      const c = this.field.contain(m.pos, m.radius);
      if (c.push.x || c.push.z) { m.pos.x += c.push.x; m.pos.z += c.push.z; }
      if (c.gefallen) { m.gefallen++; const p = this._platz(m.radius); if (p) m.pos.set(p.x, this.field.floorY(), p.z); }
      m.pos.y = this.field.floorY();
      m.root.position.copy(m.pos);
      /* Blick: Vorne ist +Z (für alle 21 gemessen, `forwardZ: 1`) — die Achse kommt aus dem Roster. */
      const ziel = Math.atan2(dx * m.e.forwardZ, dz * m.e.forwardZ);
      let w = ziel - m.blick;
      while (w > Math.PI) w -= Math.PI * 2;
      while (w < -Math.PI) w += Math.PI * 2;
      m.blick += Math.max(-6 * dt, Math.min(6 * dt, w));
      m.root.rotation.y = m.blick;
      this._spiele(m, m.tempo > 0.05 ? 'walk' : 'idle');
      if (m.aktion && m.rolle === 'walk') {
        const bezug = m.refWalk || m.maxTempo;
        m.aktion.timeScale = Math.max(0.4, Math.min(SPEC.rateZiel, m.tempo / bezug));
      }
      m.mixer.update(dt);
      if (this.loco) this.loco.anmelden(m.e.name, { tempo: m.tempo, rolle: 'walk' });
    }
    this._trennen();
  }

  /**
   * TRENNSCHRITT über alle Paare — nach der FB-Klemme, vor dem nächsten Bild.
   *
   * Warum das nötig ist (gemessen 06.09., Kritiker): das Halteband klemmt jeden Mob EINZELN auf den
   * 2,4-u-Kreis um FB. Steht FB in der Ecke, ist der Teil dieses Kreises, der noch auf dem Feld liegt,
   * ein schmaler Keil — alle drei landen auf demselben Punkt. Gemessen: Paarabstände 0,11 / 0,15 /
   * 0,26 u bei Radiensummen von 0,58–0,71 u, also drei Monster als ein Geometrie-Klumpen. Und weil
   * ein Spieler im Kampf an den Rand gedrängt wird, ist das der Normalfall, nicht der Eckfall.
   *
   * Die Spawn-Regel (2,2 u) galt nur beim Setzen; zur Laufzeit galt gar nichts. Jetzt gilt: kein
   * Paar näher als Radiensumme plus Luft. Der Schub geht auf beide, quer zur Verbindungslinie — so
   * bleibt die FB-Distanz erhalten, statt gegen sie zu arbeiten. Danach fragt jeder wieder das Feld.
   */
  _trennen() {
    const luft = SPEC.mobLuft;
    for (let runde = 0; runde < 6; runde++) {
      let bewegt = false;
      for (let i = 0; i < this.mobs.length; i++) for (let j = i + 1; j < this.mobs.length; j++) {
        const a = this.mobs[i], b = this.mobs[j];
        const soll = a.radius + b.radius + luft;
        let dx = b.pos.x - a.pos.x, dz = b.pos.z - a.pos.z;
        let d = Math.hypot(dx, dz);
        if (d >= soll) continue;
        if (d < 1e-4) {                       // deckungsgleich: aus dem Seed eine Richtung, nicht aus Math.random
          const w = this.rng() * Math.PI * 2; dx = Math.cos(w); dz = Math.sin(w); d = 1;
        }
        const k = ((soll - d) / d) * 0.5;
        a.pos.x -= dx * k; a.pos.z -= dz * k;
        b.pos.x += dx * k; b.pos.z += dz * k;
        bewegt = true;
      }
      if (!bewegt) break;
    }
    for (const m of this.mobs) {
      const c = this.field.contain(m.pos, m.radius);
      if (c.push.x || c.push.z) { m.pos.x += c.push.x; m.pos.z += c.push.z; }
      m.pos.y = this.field.floorY();
      m.root.position.copy(m.pos);
    }
  }

  /**
   * EINEN KÖRPER AUS DEM SPIEL NEHMEN — vollständig, nicht nur unsichtbar.
   *
   * Vorher setzte M5 nur `tot`/`weg` und entfernte den Knoten aus der Szene; der Eintrag blieb aber
   * in `this.mobs`. Folge, gemessen 06.09. (Kritiker): die Leichen liefen weiter (Tempo 1,01 u/s,
   * Positionen wanderten über 300 Bilder), wurden weiter getrennt und geklemmt, meldeten sich weiter
   * bei M9 an (`loco.koerper` führte vier Körper) — und **C2, ein BLOCK-Boden, mass Geisterdaten**:
   * »3 Mobs · Laufzeit-Reserve 0,00 u«, während kein Gegner mehr lebte.
   * Wer stirbt, verlässt die Liste. Alles andere ist Buchhaltung mit Toten.
   */
  entfernen(m) {
    const i = this.mobs.indexOf(m);
    if (i >= 0) this.mobs.splice(i, 1);
    if (m.mixer) m.mixer.stopAllAction();
    if (m.root && m.root.parent) m.root.parent.remove(m.root);
    if (this.loco && this.loco.abmelden) this.loco.abmelden(m.e.name);
    if (this.onWeg) this.onWeg(m, this.mobs.length);   // der Wirt muss wissen, dass ein Körper das Spiel verlässt (C12-Nenner)
    m.weg = true;
    return this.mobs.length;
  }

  /** Boden C2 und die Halteregel: der Bericht, mit dem kleinsten gemessenen Abstand. */
  probe() {
    if (!this.spawnBericht) return null;
    const leben = this.lebende();
    const zx = this.ziel ? this.ziel.position.x : 0, zz = this.ziel ? this.ziel.position.z : 0;
    const zuFb = leben.map((m) => +Math.hypot(zx - m.pos.x, zz - m.pos.z).toFixed(3));
    /* LAUFZEIT-ABSTAND, nicht nur Spawn: je Paar der Abstand GEGEN seine Radiensumme. Der Wert, der
       zählt, ist die kleinste Reserve — negativ heißt: die Modelle stecken ineinander. */
    let reserve = null, paarMin = null;
    const luftReserve = SPEC.mobLuft * 0.5;   // Reserve wird gegen die halbe Sollluft gemessen: Berührung ist noch kein Stecken
    for (let i = 0; i < leben.length; i++) for (let j = i + 1; j < leben.length; j++) {
      const a = leben[i], b = leben[j];
      const d = Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z);
      const r = d - (a.radius + b.radius + luftReserve);   // Reserve gegen die gemessenen Rumpfradien plus Luft
      if (paarMin == null || d < paarMin) paarMin = d;
      if (reserve == null || r < reserve) reserve = r;
    }
    return Object.assign({}, this.spawnBericht, {
      /* `min` GEHÖRT DEM SPAWN und wird hier nicht überschrieben: die Spawn-Regel (2,2 u) und der
         Laufzeit-Abstand sind zwei Fragen. Die erste Fassung legte den Laufzeitwert auf `min`, und
         C2 meldete daraufhin den Spawn als gefallen (0,77 u gegen Regel 2,2 u) — obwohl der Spawn
         2,91 u ergeben hatte. Eine Zahl, die zwei Fragen beantworten soll, beantwortet keine. */
      jetzt: leben.length, zuFb,
      liveMin: this._minAbstand(),
      halteMin: zuFb.length ? Math.min.apply(null, zuFb) : null,
      paarMin: paarMin != null ? +paarMin.toFixed(3) : null,
      reserve: reserve != null ? +reserve.toFixed(3) : null
    });
  }

  raeumen() {
    for (const m of this.mobs.slice()) this.entfernen(m);
    this.mobs = []; this.spawnBericht = null;
  }

  tor() { return { bestanden: this.mobs.length ? 1 : 0, von: 1 }; }

  zeile() {
    const leben = this.lebende();
    if (!leben.length) return '[mobs] ' + (this.mobs.length ? this.mobs.length + ' Körper im Todes-Clip, keiner am Leben' : 'keine Mobs gesetzt');
    const min = this._minAbstand();
    const t = leben.map((m) => m.e.name.split(' ')[0] + ' ' + m.tempo.toFixed(1)).join(' · ');
    return '[mobs] ' + leben.length + ' am Leben' + (this.mobs.length > leben.length ? ' (+' + (this.mobs.length - leben.length) + ' im Todes-Clip)' : '')
      + ' · kleinster Abstand ' + (min != null ? min.toFixed(2) + ' u' : '–')
      + ' · ' + t + (leben.some((m) => m.gefallen) ? ' · Stürze ' + leben.reduce((a, m) => a + m.gefallen, 0) : '');
  }
}
