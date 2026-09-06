/**
 * combat-arena-v2/gunfight.v2.js — M5 GUNFIGHT + M6 WÜRFEL (MASTERPLAN §2, Slice S3).
 *
 * Der Kampf. Vier Sachen, und drei davon sind importiert:
 *
 *   Munition   `modules/kfb-weapon-dice.js` — der Würfel als Geschoss (GLB mit Augen, Ersatzwürfel
 *              bei 404). Kein zweiter Würfel in diesem Projekt.
 *   Gegenfeuer `enemyShot()` aus `modules/kfb-combat-def.js` — die Werkbank v13 hat die Cube-Monster
 *              schon als Schützen; Mündung am Maul, Bolzenfarbe je Roster-Eintrag.
 *   Treffer    `host.fx.impact(energie, oberfläche, ort)` — Semantik VOR Darstellung: erst auflösen,
 *              was für ein Treffer das ist, dann zeichnen (EINBAU §3 Schritt 4).
 *   Eigen      die Kette Schuss → Treffer → Kill → EIN Würfel → EIN Pop, und die Zähler dazu.
 *
 * ── DIE DREI BÖDEN DIESES SLICE ────────────────────────────────────────────────
 * C3 (BLOCK)  Kill → genau 1 Würfel, genau 1 Pop. Deshalb zählt dieses Modul beides selbst und
 *             gibt die Zahlen nebeneinander aus — nicht »hat funktioniert«, sondern 4 = 4 = 4.
 * C9 (warn)   Gesicht frei: kein FX-Sprite über Augen/Maul von FB. Jede Emission in FB-Nähe wird
 *             gegen die Schutzzone geprüft und der kleinste Abstand gemeldet.
 * C2 bleibt   Wer stirbt, verlässt die Liste: `_kill` ruft `mb.entfernen(m)` (Szene, `mobs`-Array und
 *             M9-Anmeldung in einem Schritt). Ohne das rechnete C2 mit Leichen weiter — gemessen.
 *
 * ── WAS HIER BEWUSST EINFACH IST ───────────────────────────────────────────────
 * Keine Ballistik mit Wind, keine Deckung, kein Nachladen. Das Geschoss fliegt gerade (der Würfel
 * mit leichtem Bogen), trifft eine Kugel um den Körper, und das war es. Ein Kampf, dessen Kette
 * nicht zählbar ist, lässt sich nicht abnehmen — Zählbarkeit vor Tiefe.
 *
 * KEIN Math.random (Boden C10): jeder Zufall kommt aus `rng` des Wirts.
 */

const CDN = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/';
const _mod = async (rel, cdn) => { try { return await import(rel); } catch (e) { return await import(cdn); } };

export const SPEC = {
  /* WAFFEN AUS DEM KANON, nicht aus meinem Kopf (Georg 06.09.: »es gibt grundsätzlich schon
     Würfel-Wurf und SFX in der Werkbank« — stimmt, ich hatte es nicht gelesen):
       FB       `WEAPONS.railgun` = **Bamboo Rail** aus `kfb-combat-def.js` — Einzelschuss,
                durchschlagend, Munition `slug` (»schmaler Zylinder mit heißer Spitze« = die
                Bleistift-Form, die Georg meint), Ton `launch.railgun`.
       Gegner   `WEAPONS.dice` = **Würfelwurf** aus `kfb-weapon-dice.js` — ballistischer Bogen,
                22 u/s, taumelnd. Sie verschießen kleine WEISSE Würfel und lassen große farbige
                fallen. Ton `launch.enemy` (die Bank hat keinen Würfel-Cue).
     Die Zahlen der Rezepte gelten; nur der MASSSTAB wird umgerechnet, weil die Werkbank auf einer
     Mech-Bühne misst (Figur ~2,6 u) und wir auf einer Karte spielen (FB 1,2 u). */
  ammoSkala: 1.2 / 2.6,
  spieler: { takt: 0.55, radius: 0.16 },      // Takt bewusst schneller als der Kanon-Wert 1,15 s — eine Kartenbühne ist kein Schützenstand
  mob: { takt: 1.6, schaden: 6, radius: 0.14, ab: 2.4 },
  biss: { takt: 1.1, schaden: 4 },
  wuerfel: { hoehe: 0.55, dreh: 2.4, leben: 14, sog: 1.2, kante: 0.3 },        // Beutewürfel
  /* SCHUTZZONE 0,18 statt 0,42. Bei 1,2 u Figurhöhe waren 0,42 eine Kugel von einem halben Meter
     Radius um FBs Kopf — jeder Treffer wurde daran nach außen geschoben, und Georg sah genau das:
     »die Impact-Effekte finden deutlich außerhalb der Figur statt … als hätte die so eine Art
     Schutzschild«. 0,18 × 1,2 u = 0,22 u ist das Gesicht, nicht der halbe Oberkörper. */
  schutzzone: 0.18,
  ziel: { kegel: 0.6, weite: 9 },
  /* OBERFLÄCHEN (Georg 06.09.): Gegner sind `slime`, FB ist `flesh`. Beide stehen in `SURFACES`
     des Kanons — slime mit `splat`/`squelch` und Tint 9fd45c, flesh mit `slap`/`flesh` und d98a7a. */
  flaeche: { gegner: 'slime', fb: 'flesh' },
  beute: [0xb8361f, 0x5fbf3a, 0xe9c14a],
  wurfSchwere: 14,                            // u/s² für geworfene Munition (Würfel) — Bogen sichtbar, nicht mächtig
  leben: { fb: 100, mobFaktor: 1 }
};

/* Die TONBANK kennt nur acht Oberflächennamen (earth metal bone air water shield wood stone) —
   `flesh`, `slime` und `glass` leihen sich dort Samples, und `kfb-combat-def.js` schreibt das in
   seiner eigenen offenen Lücke hin: flesh → hitbone, slime → splash. Also: Bild-Vokabel `flesh`,
   Ton-Vokabel `bone`; Bild `slime`, Ton `water`. Zwei Vokabeln, eine Absicht. */
const BANK = { flesh: 'bone', slime: 'water', bone: 'bone', metal: 'metal', wood: 'wood', stone: 'stone', water: 'water', earth: 'earth', glass: 'metal', air: 'air' };
const bankSurface = (s) => BANK[s] || 'bone';

export default class Gunfight {
  /* FELDER VOR DEM WARTEN — als Klassenfelder, nicht am Ende von `init()`.
     `zeile()` läuft bei JEDEM Rendern, also auch während `init()` noch auf Modul-Import und
     Würfel-GLB wartet. Vorher lag `zaehler` hinter diesen `await`s: »Cannot read properties of
     undefined (reading 'kills')« — gemessen 06.09., zweiter Fall derselben Sorte (M9 hatte ihn mit
     `koerper`). Ein Objekt, das noch lädt, muss trotzdem antworten können. */
  zaehler = { schuesse: 0, treffer: 0, kills: 0, wuerfel: 0, pops: 0, mobSchuesse: 0, bisse: 0, fbSchaden: 0 };
  schuesse = [];
  pickups = [];
  gesichtMin = null;
  hp = SPEC.leben.fb;
  fbHoehe = 1.2;
  wuerfelRoh = 0.52;
  aktiv = false;
  autoziel = true;   // Georgs Wunsch 06.09.: Auto-Ziel als Standard AN
  zielMob = null;
  _kalt = 0;

  static describe() {
    return { name: 'Gunfight', capabilities: ['three@0.160', 'assets', 'field', 'input', 'fx', 'time', 'rng'], view: '3d', determinism: 'seeded', spec: SPEC };
  }

  async init(ctx) {
    this.THREE = ctx.three; this.field = ctx.field; this.input = ctx.input; this.fx = ctx.fx;
    this.time = ctx.time; this.rng = ctx.rng; this.cam = ctx.cam; this.assets = ctx.assets; this.loader = ctx.gltfLoader;
    this.log = (s) => (ctx.log || console.info)('[gun] ' + s);
    const T = this.THREE;

    const [D, W] = await Promise.all([
      _mod('../modules/kfb-combat-def.js', CDN + 'modules/kfb-combat-def.js').catch(() => null),
      _mod('../modules/kfb-weapon-dice.js', CDN + 'modules/kfb-weapon-dice.js').catch(() => null)
    ]);
    this.D = D; this.W = W;
    /* WAFFEN AUS DEM KANON GREIFEN, nicht nachbilden: FB führt `WEAPONS.railgun` (Bamboo Rail),
       die Gegner `WEAPONS.dice` (Würfelwurf). Fehlt ein Modul, trägt der Rückfall die Nötigsten. */
    this.wRail = (D && D.WEAPONS && D.WEAPONS.railgun) || { name: 'Bamboo Rail', speed: 165, dmg: 54, color: 0x8fe6ff, flash: 0xffffff, energy: 'electric', muz: 'rail', muzMs: 50, muzSize: 1, ammo: 'slug', ant: 0.09, pierce: true };
    this.wDice = (W && W.WEAPONS && W.WEAPONS.dice) || { name: 'Würfelwurf', speed: 22, dmg: 26, arc: 1, energy: 'kinetic', muz: 'blast', muzMs: 70, muzSize: 1.1, flash: 0xf3ead3 };
    /* Trefferreaktion: Squash, Hitstop, Knockback — `modules/kfb-hit-response.js`, importiert. */
    const HRmod = await _mod('../modules/kfb-hit-response.js', CDN + 'modules/kfb-hit-response.js').catch(() => null);
    this.HR = HRmod && HRmod.createHitResponse
      ? HRmod.createHitResponse({ THREE: T, emit: (zelle, pos, opt) => this.fx.emit(zelle, pos, opt), rng: this.rng })
      : null;
    this.log('Waffen: ' + this.wRail.name + ' (FB) · ' + this.wDice.name + ' (Gegner) · Deformer ' + (this.HR ? 'an' : 'fehlt'));
    if (W) {
      this.dice = W.createDiceAmmo({
        THREE: T,
        /* `tonung: 1` — die Basisfarbe SOLL die Farbe sein. Der Modulstandard 0,55 mischt den Körper
           nur zur Hälfte in Richtung Waffenfarbe, und Georg sah genau das: »die Würfel sollten nicht
           nur einen leichten Schimmer haben, sondern die Basisfarbe sollte entsprechend rot grün und
           gelb sein« (06.09.). Die Augen bleiben dunkel — dafür ist die `dunkel`-Schwelle da. */
        params: { tonung: 1 },
        loadGLTF: this.loader ? (pfad) => this.loader.loadAsync(this.assets.RAW + this.assets.enc(pfad.replace('media/3D_Assets/', ''))) : null
      });
      const art = await this.dice.prepare();
      /* DIE GEBAUTE GEOMETRIE MESSEN, NICHT DIE DATEI. Erste Fassung skalierte blind (×0,5 → Kante
         1,27 u, größer als ein Mob), zweite Fassung teilte durch `stats().mass` (2,70) — das sind
         die Rohmaße der GLB-Datei VOR der Normierung, die das Modul selbst vornimmt. Ergebnis:
         0,52 × (0,216/2,701) = **0,042 u**, ein 4-cm-Würfel, im Bild unsichtbar (Kritiker 06.09.).
         Also EINMAL ein Muster bauen, mit `Box3` messen, Maß merken, Muster wegwerfen.
         *Am Objekt messen, nicht am eigenen Rechenweg — sonst bestätigt die Prüfung die Annahme.* */
      let kante = (this.dice.params && this.dice.params.kante) || 0.52;
      try {
        const muster = this.dice.mesh({ color: 0xffffff });
        if (muster) {
          muster.updateMatrixWorld(true);
          const bx = new T.Box3().setFromObject(muster);
          const gr = Math.max(bx.max.x - bx.min.x, bx.max.y - bx.min.y, bx.max.z - bx.min.z);
          if (gr > 1e-4) kante = gr;
          muster.traverse((o) => { if (o.isMesh && o.material && o.material.dispose) o.material.dispose(); });
        }
      } catch (e) { this.log('Würfelmaß nicht messbar, Kanon ' + kante + ' u: ' + ((e && e.message) || e)); }
      this.wuerfelRoh = kante;
      this.log((this.dice.zeile ? this.dice.zeile() : 'Würfel ' + art) + ' · gemessene Kante ' + kante.toFixed(3) + ' u');
    }
    this.schuesse = [];      // { grp, dir, tempo, vy, von, schaden, radius, leben }
    this.pickups = [];       // { grp, pos, leben, dreh }
    this.gesichtMin = null;  // kleinster gemessener Abstand einer Emission zur Schutzzone (C9)
    this._kalt = 0; this.hp = SPEC.leben.fb;
    this.aktiv = false;
  }
  mount(parent) {
    this.gruppe = new this.THREE.Group();
    this.gruppe.name = 'gunfight';
    parent.add(this.gruppe);
    return this.gruppe;
  }

  /** Wer schießt, auf wen, und wie groß ist FB (für Mündung und Schutzzone). */
  setKampf(o) {
    this.pc = o.pc; this.mb = o.mb; this.fb = o.fb;
    this.fbHoehe = o.hoehe || 1.2;
    /* MÜNDUNG AM KÖRPER, NICHT AUS EINER ZAHL. Georg 06.09.: »FB hat (noch) keine Gun — die sollten
       wir für Muzzle und Zielrichtung nehmen«. Eine Waffe als Modell gibt es hier nicht, aber das Rig
       hat `FistR`/`FistL`, und FB bringt die Haltungen `Idle_Gun · Walk_Gun · Run_Gun · Idle_Shoot ·
       Run_Shoot` mit (gemessen). Also: Haltung aus dem Clip, Mündung aus der rechten Faust — das ist
       die Hand, die die Waffe hält, sobald es eine gibt. Bis dahin ist der Ursprung schon richtig. */
    this.faust = null; this.schulter = null;
    if (this.fb && this.fb.figure) this.fb.figure.traverse((b) => {
      if (!b.isBone) return;
      if (!this.faust && /^FistR$/i.test(b.name)) this.faust = b;
      if (!this.schulter && /^ShoulderR$/i.test(b.name)) this.schulter = b;
    });
    this.aktiv = !!(this.pc && this.mb);
    if (this.mb) for (const m of this.mb.mobs) this._leben(m);
    this.log('Kampf bereit · FB ' + this.fbHoehe.toFixed(2) + ' u · ' + (this.mb ? this.mb.mobs.length : 0) + ' Gegner · Schutzzone '
      + (this.fbHoehe * SPEC.schutzzone).toFixed(2) + ' u · Mündung ' + (this.faust ? 'FistR (Seite) ' : 'gerechnet ')
      + (this.schulter ? '+ ShoulderR (Höhe)' : '+ Höhe aus Figurmaß'));
    return this;
  }

  /**
   * Mündung: RICHTUNG UND SEITE aus der Faust, HÖHE aus der Schulter.
   *
   * Die Faust allein war falsch, und zwar messbar (Kritiker 06.09.): `FistR` hängt im Kenney-Rig
   * auch in der Gun-Pose bei **y 0,30 u** — bei 1,20 u Figurhöhe also auf Schienbeinhöhe, kurze Arme,
   * Faust neben dem Bein. Der Schuss verließ FB an den Knöcheln, während hier »aus der Hand« stand.
   * Die vorige Fassung (Kopfhöhenrechnung 0,62 × Höhe = 0,74 u) lag optisch richtig, aber ohne Bezug
   * zum Körper. Jetzt beides: X/Z folgen der Hand (sie zeigt, wo die Waffe sitzt), Y kommt vom
   * Schulterknochen — und wenn das Rig keinen hat, aus der Figurhöhe.
   * *Ein Knochen ist nicht automatisch ein Mündungspunkt — nachmessen, in welcher Achse er stimmt.*
   */
  _fbMuendung(blick) {
    const T = this.THREE;
    const p = new T.Vector3();
    if (this.faust) {
      this.faust.getWorldPosition(p);
      p.x += blick.x * 0.12; p.z += blick.z * 0.12;
    } else {
      p.set(this.pc.pos.x + blick.x * 0.22, 0, this.pc.pos.z + blick.z * 0.22);
    }
    if (this.schulter) {
      const s = this.schulter.getWorldPosition(new T.Vector3());
      p.y = s.y;
    } else {
      p.y = this.pc.pos.y + this.fbHoehe * 0.58;
    }
    return p;
  }

  _leben(m) {
    if (m.hp != null) return m;
    m.hpMax = Math.round((m.e.hp || 40) * SPEC.leben.mobFaktor);
    m.hp = m.hpMax;
    m.tot = false;
    m.kalt = 0.6 + this.rng() * 1.2;   // erster Schuss nicht alle gleichzeitig
    return m;
  }

  /** Ein Würfel in Zielgröße (Welt-u je Kante) — Skala aus der GEMESSENEN Kante des Musters. */
  _wuerfel(farbe, kante) {
    const T = this.THREE;
    const grp = (this.dice && this.dice.mesh) ? this.dice.mesh({ color: farbe }) : new T.Mesh(new T.BoxGeometry(1, 1, 1), new T.MeshStandardMaterial({ color: farbe }));
    grp.scale.setScalar(kante / (this.wuerfelRoh || 0.52));
    return grp;
  }

  /* ── Sichere Rückmeldung an die FX-Foundation ────────────────────────────────
     Ein Ton- oder Sprite-Anker, der in der Bank fehlt, darf keinen anonymen Konsolenfehler werfen —
     gemessen 06.09.: eine Zeile »Cannot read properties of undefined (reading 'length')« ohne Spur,
     die niemand einem Modul zuordnen konnte. Jetzt trägt jeder Ausfall den Anker im Text. */
  _cue(anker, o) {
    try { return this.fx.cue(anker, o); }
    catch (e) { if (!this._cueStumm) { this._cueStumm = anker; this.log('Anker »' + anker + '« fällt aus: ' + ((e && e.message) || e)); } return null; }
  }
  /** Mündungspunkt: Kopfhöhe der Figur, ein Stück in Blickrichtung — nicht der Fußpunkt. */
  _muendung(pos, blick, hoehe, faktor) {
    const T = this.THREE;
    return new T.Vector3(pos.x + blick.x * 0.22, pos.y + hoehe * (faktor || 0.62), pos.z + blick.z * 0.22);
  }

  /* ── Spielerschuss ───────────────────────────────────────────────────────── */
  /** NÄCHSTES ZIEL im Blickkegel — Auto-Ziel, standardmäßig an (Georg 06.09.: »wir sollten doch eine
      Art Auto-Target als Setting=on einführen«). Es RICHTET, es zielt nicht für dich: nur Körper im
      Kegel um die Blickachse zählen, und nur bis zur Reichweite. */
  _zielen(blick) {
    if (!this.autoziel || !this.mb) return blick;
    let best = null, bestD = 1e9;
    for (const m of this.mb.lebende()) {
      const dx = m.pos.x - this.pc.pos.x, dz = m.pos.z - this.pc.pos.z;
      const d = Math.hypot(dx, dz);
      if (d > SPEC.ziel.weite || d < 1e-4) continue;
      const winkel = Math.acos(Math.max(-1, Math.min(1, (dx / d) * blick.x + (dz / d) * blick.z)));
      if (winkel > SPEC.ziel.kegel) continue;
      if (d < bestD) { bestD = d; best = { x: dx / d, z: dz / d, mob: m, dist: d }; }
    }
    this.zielMob = best ? best.mob : null;
    return best || blick;
  }

  feuern() {
    if (!this.aktiv || this._kalt > 0) return null;
    const roh = this.cam ? this.cam.blick() : { x: 0, z: -1 };
    const b = this._zielen(roh);
    if (this.pc.blickAuf) this.pc.blickAuf(b, 0.75);
    /* DREI DINGE IN DER RICHTIGEN REIHENFOLGE (Georg 06.09.: »Schuss, Mündung und Animation sind noch
       falsch getimed, Munition startet von Gun in Position«). Das Rezept hat dafür eine Zahl:
       `ant` = Ausholen (Bamboo Rail 0,09 s). Also: (1) SOFORT der Schussclip — die Figur holt aus,
       (2) nach `ant` das Mündungsfeuer AN DER WAFFENSPITZE, (3) im selben Bild die Munition, von
       genau diesem Punkt. Vorher entstand alles gleichzeitig und die Munition kam aus der Faust,
       während die Animation noch nicht angesetzt hatte. */
    const W = this.wRail;
    if (this.pc.schuss) this.pc.schuss(W.ant || 0.09);
    this._offen = { dir: { x: b.x, z: b.z }, t: W.ant || 0.09 };
    this._kalt = SPEC.spieler.takt;
    return this._offen;
  }

  /** Der Abgang: Mündung und Munition entstehen zusammen, an der Spitze der Waffe. */
  _abgang(b) {
    const T = this.THREE, W = this.wRail;
    const von = this._gunSpitze(b);
    const A = (this.D && this.D.AMMO && this.D.AMMO[W.ammo]) || { len: 1.3, wid: 0.22 };
    const s = SPEC.ammoSkala;
    /* MUNITION AUS DEM REZEPT: `slug` = »schmaler Zylinder mit heißer Spitze, hart« — das ist die
       Bleistift-Form, die Georg an der Bamboo Rail meint. Länge und Breite kommen aus `AMMO`, nur
       der Maßstab ist umgerechnet (Werkbank-Bühne → Karte). */
    const grp = new T.Group();
    const lang = A.len * s, dick = A.wid * s;
    const schaft = new T.Mesh(new T.CylinderGeometry(dick * 0.5, dick * 0.5, lang * 0.78, 10), new T.MeshBasicMaterial({ color: W.color, toneMapped: false }));
    schaft.rotation.x = Math.PI / 2;
    const spitze = new T.Mesh(new T.ConeGeometry(dick * 0.52, lang * 0.32, 10), new T.MeshBasicMaterial({ color: W.flash || 0xffffff, toneMapped: false }));
    spitze.rotation.x = Math.PI / 2; spitze.position.z = lang * 0.52;
    grp.add(schaft, spitze);
    grp.position.copy(von);
    grp.lookAt(von.x + b.x, von.y, von.z + b.z);
    this.gruppe.add(grp);
    this.schuesse.push({
      grp, dir: { x: b.x, z: b.z }, tempo: W.speed * s * 1.6, vy: null,
      von: 'spieler', schaden: W.dmg, radius: dick * 0.6 + 0.05, leben: 1.2,
      energie: W.energy || 'electric', pierce: !!W.pierce
    });
    this.zaehler.schuesse++;
    if (this.fx.bereit) this.fx.emit(W.muz || 'rail', von, { size: (W.muzSize || 1) * s * 1.2, color: W.flash || 0xffffff, life: (W.muzMs || 50) / 1000 });
    this._cue('abzug', { weapon: 'railgun', sfx: 'launch.railgun', at: von });
    return grp;
  }

  /** Spitze der Waffe: die plain Meshes am Handknochen sind das Gewehr (v1 rechnet sie schon aus dem
      Bodenmaß heraus). Ihre Vorderkante ist die Mündung — gemessen, nicht geraten. */
  _gunSpitze(b) {
    const T = this.THREE;
    if (!this._gunTeile && this.fb && this.fb.figure) {
      this._gunTeile = [];
      this.fb.figure.traverse((o) => { if (o.isMesh && !o.isSkinnedMesh && !o.userData.petOverlay) this._gunTeile.push(o); });
    }
    if (this._gunTeile && this._gunTeile.length) {
      const box = new T.Box3();
      for (const o of this._gunTeile) box.expandByObject(o);
      if (!box.isEmpty()) {
        const mitte = box.getCenter(new T.Vector3());
        const halb = box.getSize(new T.Vector3()).length() * 0.42;
        return new T.Vector3(mitte.x + b.x * halb, mitte.y, mitte.z + b.z * halb);
      }
    }
    return this._fbMuendung(b);
  }

  /* ── Gegenfeuer: WÜRFELWURF aus dem Kanon ─────────────────────────────────────
     Georg 06.09.: »enemies können Würfel-Wurf nutzen → sie verschießen kleine weiße Würfel und
     spawnen größere farbige Würfel.« Genau das: Geschoss = kleiner Papier-weißer Würfel aus dem
     Waffenmodul, Zahlen aus `WEAPONS.dice` (22 u/s, Bogen 1,0, taumelnd, Mündung `blast`). */
  _mobFeuern(m) {
    const T = this.THREE, W = this.wDice;
    const zx = this.pc.pos.x - m.pos.x, zz = this.pc.pos.z - m.pos.z;
    const d = Math.hypot(zx, zz) || 1e-6;
    const b = { x: zx / d, z: zz / d };
    const von = this._muendung(m.pos, b, m.hoehe, 0.72);
    const s = SPEC.ammoSkala;
    const kante = Math.max(0.1, m.hoehe * 0.14);
    const grp = this._wuerfel(0xf3ead3, kante);            // klein und WEISS — die Beute ist groß und farbig
    grp.position.copy(von);
    this.gruppe.add(grp);
    const tempo = (W ? W.speed : 22) * s * 1.6;
    /* Bogen: `arc` des Rezepts, umgerechnet auf die Flugzeit bis zum Ziel — ein Wurf, der flach
       geht, ist kein Wurf. Steigt so weit, dass er auf halber Strecke oben ist. */
    const flug = d / Math.max(0.001, tempo);
    const vy = 0.5 * SPEC.wurfSchwere * flug * (W ? W.arc : 1);
    this.schuesse.push({
      grp, dir: b, tempo, vy, von: 'mob', quelle: m, schaden: SPEC.mob.schaden,
      radius: kante * 0.7, leben: 3, energie: (W ? W.energy : 'kinetic') || 'kinetic',
      dreh: new T.Vector3(this.rng() * 2 - 1, this.rng() * 2 - 1, this.rng() * 2 - 1).normalize()
    });
    this.zaehler.mobSchuesse++;
    if (this.fx.bereit && W) this.fx.emit(W.muz || 'blast', von, { size: (W.muzSize || 1) * s, color: W.flash || 0xf3ead3, life: (W.muzMs || 70) / 1000 });
    this._cue('mündung', { at: von, weapon: 'enemy', sfx: 'launch.enemy' });
    return grp;
  }

  /* ── Emission mit Schutzzone (Boden C9) ──────────────────────────────────── */
  /* DIE ENERGIE IST EIN NAME, KEINE ZAHL. `resolveImpact(energy, surface, heavy)` liest
     `ENERGY[energy]` — ich habe 0,4 / 0,5 / 1 übergeben, also griff jedes Mal der Rückfall
     `ENERGY.kinetic` mit seiner Zelle `star`. Damit war die Oberfläche für das BILD wirkungslos, und
     Georg sah bei jedem Treffer denselben Fünfzack: »ein Kreis mit ein paar Zacken« statt des
     unregelmäßigen `burst`. Vier gültige Namen: kinetic · hot · wet · electric.
     *Ein Parameter, der jeden Wert annimmt, nimmt auch jeden falschen an.* */
  _emit(energie, oberflaeche, at, schwer, zelle) {
    const kopf = this.pc ? { x: this.pc.pos.x, y: this.pc.pos.y + this.fbHoehe * 0.78, z: this.pc.pos.z } : null;
    if (kopf && isFinite(at.x) && isFinite(at.y) && isFinite(at.z)) {
      const d = Math.hypot(at.x - kopf.x, at.y - kopf.y, at.z - kopf.z);
      const zone = this.fbHoehe * SPEC.schutzzone;
      /* NUR ENDLICHE WERTE. Ein einziger NaN-Treffer machte diese Messung dauerhaft unlesbar
         (`Math.min(NaN, x)` bleibt NaN) — C9 zeigte »NaN u tief getroffen«, bis zum Neuladen. */
      if (isFinite(d)) this.gesichtMin = this.gesichtMin == null ? d - zone : Math.min(this.gesichtMin, d - zone);
      /* Im Gesicht wird NICHT gezeichnet, sondern verschoben: der Treffer bleibt sichtbar, aber die
         Augen bleiben frei (EINBAU Gate 12). Ein Effekt, der die Augen verdeckt, nimmt der Figur ihr
         Spiel — und das Gesicht ist bei FB die halbe Figur. */
      if (d < zone) {
        const s = zone / Math.max(0.001, d);
        at = { x: kopf.x + (at.x - kopf.x) * s, y: kopf.y + (at.y - kopf.y) * s, z: kopf.z + (at.z - kopf.z) * s };
      }
    }
    /* Auch der Treffer geht durch einen Schutzmantel: `impact` löst Semantik auf UND zeichnet, und
       ein fehlendes Rezept in der Bank darf nicht als anonymer Konsolenfehler auftauchen.
       `zelle` überschreibt die Rezeptzelle, wenn der Waffencharakter sie besser kennt als die
       Energieklasse: `kinetic` gibt kanonisch `star` (»nur Zacken, kein Kern: schnelle, harte
       Waffen«) — ein geworfener Würfel ist aber weder schnell noch hart, sondern Interpunktion, und
       dafür ist `burst` gemacht (»Kern plus unregelmäßige Zacken«, so steht es im Atlas). Genau das
       ist der Stern, den Georg am Anfang gesehen und vermisst hat. */
    try {
      if (zelle && this.fx.bereit && this.D) {
        const z = this.D.resolveImpact(energie, oberflaeche, !!schwer);
        const gr = (z.size || 0.8) * (schwer ? 1.9 : 1.5);
        /* ZWEI SCHICHTEN, WEISS ZUERST. Der Rezept-Tint ist die Farbe der getroffenen OBERFLÄCHE —
           bei `slime` ein Grün, und auf einem grünen Cube-Monster sieht man davon nichts (Georg
           06.09.: »FB trifft enemy, aber kein Impact sichtbar«; gemessen: Sprites entstanden, Tint
           9fd45c auf grünem Körper). Also erst ein WEISSER Kern — Weißglut liest auf jedem Untergrund,
           so steht es auch in der Zeitachse der Rezepte (»Kontakt: Burst, pop, Weißglut → Waffenfarbe«)
           — und darauf die getinte, größere Wolke plus die Sekundärteile. */
        const P = new this.THREE.Vector3(at.x, at.y, at.z);
        this.fx.emit(zelle, P, { size: gr * 0.7, color: 0xffffff, life: 0.16 });
        this.fx.emit(zelle, P, { size: gr, color: z.tint, life: 0.42 });
        if (z.sec) for (const [n, k] of z.sec) for (let i = 0; i < Math.min(4, k); i++) {
          this.fx.emit(n, new this.THREE.Vector3(at.x + (this.rng() - 0.5) * 0.3, at.y + (this.rng() - 0.5) * 0.3, at.z + (this.rng() - 0.5) * 0.3), { size: gr * 0.5, color: z.tint, life: 0.34 });
        }
      } else {
        this.fx.impact(energie, oberflaeche, new this.THREE.Vector3(at.x, at.y, at.z), !!schwer);
      }
    }
    catch (e) { if (!this._impactStumm) { this._impactStumm = true; this.log('impact(' + oberflaeche + ') fällt aus: ' + ((e && e.message) || e)); } }
    return at;
  }

  /**
   * DEFORMER — Squash, Hitstop und Knockback aus `modules/kfb-hit-response.js`.
   *
   * Georg 06.09.: »FB zeigt keinen (Deformer) Impact« und »enemies ebenso bitte mit Deformer bei
   * Impact in Schussrichtung, zudem leichter Push-Back«. Das Modul liegt seit dem 04.09. im Projekt
   * und macht genau vier Schichten auf EINEN Treffer: Clip, Materialblitz, Ring, Deformer. Die
   * TREFFERACHSE gibt der Wirt mit (`dir` = Schütze → Ziel) — aus der Flächennormale würde auf einem
   * runden Körper quer zur Bahn gestaucht, und genau das steht als Befund in seinem Kopf.
   */
  _deformer(vis, dir, punkt, hoehe, flaeche, energie, mob) {
    if (!this.HR || !vis || !dir) return null;
    const T = this.THREE;
    const z = this.D ? this.D.resolveImpact(energie || 'kinetic', flaeche || 'flesh', false) : null;
    try {
      return this.HR.hit({
        vis,
        mix: mob ? mob.mixer : (this.fb && this.fb.mixer),
        anims: mob ? Object.values(mob.clips || {}) : (this.fb && this.fb.allClips ? this.fb.allClips().map((c) => c.clip).filter(Boolean) : null),
        point: new T.Vector3(punkt.x, punkt.y, punkt.z),
        dir: new T.Vector3(dir.x, 0, dir.z).normalize(),
        normal: new T.Vector3(-dir.x, 0, -dir.z).normalize(),
        tint: z ? z.tint : 0xffffff,
        size: (z ? z.size : 0.8) * (hoehe || 1) * 0.6,
        energy: energie || 'kinetic',
        surface: flaeche || 'flesh',
        stop: z ? z.stop : 0.03,
        knock: z ? z.knock : 0.2
      });
    } catch (e) {
      if (!this._hrStumm) { this._hrStumm = true; this.log('Deformer fällt aus: ' + ((e && e.message) || e)); }
      return null;
    }
  }

  /* ── Kill-Kette: genau ein Würfel, genau ein Pop (Boden C3) ──────────────── */
  _kill(m) {
    if (m.tot) return;
    m.tot = true;
    this.zaehler.kills++;
    /* SOFORT ABMELDEN, nicht erst wenn der Todes-Clip fertig ist. Der Körper bleibt ~0,9 s im Array,
       damit der Clip spielen kann — aber er LÄUFT nicht mehr, also darf er auch nicht mehr im Nenner
       von C12 stehen. Gemessen 06.09. (Kritiker): »1/4 Körper in Bewegung ✓« mit drei Leichen im
       Nenner. `entfernen()` wiederholt das später idempotent.
       *Ein BLOCK-Boden, der eine Dreiviertelsekunde lang die Unwahrheit sagt, ist genauso falsch wie
       einer, der es dauerhaft tut* — der Satz steht seit heute in M3 und gilt hier genauso. */
    if (this.mb.loco && this.mb.loco.abmelden) this.mb.loco.abmelden(m.e.name);
    if (this.mb.onWeg) this.mb.onWeg(m, this.mb.lebende().length);
    /* Der Todes-Clip, wenn der Satz ihn hat — `roleClip` sagt es, und bei den Cube9-Sätzen fehlt er
       (Roster-Kanon). Ohne Clip fällt der Körper einfach weg; kein Ersatz, der etwas vorspielt. */
    const tod = this.mb.R.roleClip(m.e, 'death');
    if (tod && m.clips[tod]) {
      const a = m.mixer.clipAction(m.clips[tod]);
      a.setLoop(this.THREE.LoopOnce, 1); a.clampWhenFinished = true;
      if (m.aktion) m.aktion.fadeOut(0.15);
      a.reset().fadeIn(0.1).play(); m.aktion = a; m.rolle = 'tot';
    }
    this._emit('kinetic', SPEC.flaeche.gegner, { x: m.pos.x, y: m.pos.y + m.hoehe * 0.5, z: m.pos.z }, true, 'burst');
    this._cue('treffer', { energy: 'kinetic', surface: bankSurface(SPEC.flaeche.gegner), heavy: true, at: m.pos });
    this.zaehler.pops++;                                  // EIN Pop je Kill — hier gezählt, nicht gehofft
    this._wuerfelLegen(m.pos, m.hoehe, SPEC.beute[this.zaehler.kills % SPEC.beute.length]);   // EIN Würfel je Kill, Farbe aus dem Kanon-Trio
    setTimeout(() => { if (this.mb && this.mb.entfernen) this.mb.entfernen(m); }, tod && m.clips[tod] ? 900 : 120);
  }

  /* Beutewürfel: größer und FARBCODIERT (Georg 06.09.). Die Farbe ist die Bolzenfarbe des Gegners,
     der ihn fällt — damit sagt der Würfel, von wem er kommt, statt nur »Beute« zu sein. */
  _wuerfelLegen(pos, hoehe, farbe) {
    const grp = this._wuerfel(farbe || 0xf3ead3, SPEC.wuerfel.kante);
    grp.position.set(pos.x, this.field.floorY() + SPEC.wuerfel.kante * 0.6, pos.z);
    this.gruppe.add(grp);
    this.pickups.push({ grp, leben: SPEC.wuerfel.leben, t: 0 });
    this.zaehler.wuerfel++;
    return grp;
  }

  update(dt) {
    if (!this.aktiv) return;
    if (this.time && this.time.state.phase !== 'play') return;
    const T = this.THREE;
    if (this._kalt > 0) this._kalt -= dt;
    if (this.HR && this.HR.step) this.HR.step(dt);
    /* Der offene Schuss: nach `ant` kommen Mündung und Munition — in EINEM Bild, an EINEM Punkt. */
    if (this._offen) {
      this._offen.t -= dt;
      if (this._offen.t <= 0) { const b = this._offen.dir; this._offen = null; this._abgang(b); }
    }

    const s = this.input.state;
    if (s.firePressed || s.fire) this.feuern();

    /* Gegenfeuer und Biss: die Entfernung entscheidet, welcher Zweig läuft (MASTERPLAN: Projektil
       ab 2,4 u, Biss darunter). Weil die Mobs bei genau 2,4 u halten, liegen beide Zweige an der
       Grenze — deshalb schießt der Mob ab 2,4 u und beißt darunter, mit eigenem Takt je Körper. */
    const lebende = [];
    for (const m of this.mb.mobs) {
      if (m.tot || m.weg) continue;
      this._leben(m);
      lebende.push(m);
      m.kalt -= dt;
      if (m.kalt > 0) continue;
      const d = Math.hypot(this.pc.pos.x - m.pos.x, this.pc.pos.z - m.pos.z);
      if (d >= SPEC.mob.ab) { this._mobFeuern(m); m.kalt = SPEC.mob.takt * (0.8 + this.rng() * 0.5); }
      else {
        const biss = this.mb.R.roleClip(m.e, 'attack');
        if (biss && m.clips[biss]) {
          const a = m.mixer.clipAction(m.clips[biss]);
          a.setLoop(T.LoopOnce, 1); a.clampWhenFinished = false;
          a.reset().play();
        }
        this.hp = Math.max(0, this.hp - SPEC.biss.schaden);
        this.zaehler.bisse++; this.zaehler.fbSchaden += SPEC.biss.schaden;
        this._emit('kinetic', SPEC.flaeche.fb, { x: this.pc.pos.x, y: this.pc.pos.y + this.fbHoehe * 0.45, z: this.pc.pos.z });
        this._cue('treffer', { energy: 'kinetic', surface: bankSurface(SPEC.flaeche.fb), heavy: false, at: this.pc.pos });
        this._deformer(this.fb && this.fb.figure, { x: -(this.pc.pos.x - m.pos.x), z: -(this.pc.pos.z - m.pos.z) }, this.pc.pos, this.fbHoehe, SPEC.flaeche.fb, 'kinetic', null);
        m.kalt = SPEC.biss.takt;
      }
    }

    /* Geschosse: fliegen, treffen, verschwinden. Ein Geschoss, das nichts trifft, stirbt an seiner
       Lebenszeit oder am Feldrand — nie an einer Zufallszahl. */
    for (let i = this.schuesse.length - 1; i >= 0; i--) {
      const p = this.schuesse[i];
      p.leben -= dt;
      /* DIE STRECKE PRÜFEN, NICHT DEN PUNKT. Die Bamboo Rail fliegt 121,8 u/s, das sind **2,03 u je
         Bild** — ihr Trefferfenster ist 0,41 u. Ein Test auf die Endposition springt also von VOR
         dem Gegner nach HINTER ihn: gemessen 12 Schüsse → 0 Treffer, und der eine Kill in C3 war
         Zufall (Kritiker 06.09.). Deshalb wird die Bewegung in TEILSCHRITTE zerlegt, die kleiner
         sind als das halbe Fenster; der Gegnerwurf (16,2 u/s, Schritt 0,27 u) braucht davon einen.
         *Ein schnelles Geschoss auf einem festen Bild ist eine Strecke, kein Ort.* */
      const fenster = Math.max(0.12, p.radius + 0.28);
      const teile = Math.max(1, Math.min(12, Math.ceil((p.tempo * dt) / (fenster * 0.5))));
      p.merkTeile = teile;
      let treffer = null;
      for (let s = 0; s < teile && !treffer; s++) {
        const ds = dt / teile;
        p.grp.position.x += p.dir.x * p.tempo * ds;
        p.grp.position.z += p.dir.z * p.tempo * ds;
        if (p.vy != null) { p.grp.position.y += p.vy * ds; p.vy -= SPEC.wurfSchwere * ds; }
        if (p.von === 'spieler') {
          for (const m of lebende) {
            const ax = p.grp.position.x - m.pos.x, ay = p.grp.position.y - (m.pos.y + m.hoehe * 0.5), az = p.grp.position.z - m.pos.z;
            if (Math.hypot(ax, ay, az) <= m.radius + p.radius) { treffer = m; break; }
          }
        } else if (p.von === 'mob') {
          const ax = p.grp.position.x - this.pc.pos.x, ay = p.grp.position.y - (this.pc.pos.y + this.fbHoehe * 0.5), az = p.grp.position.z - this.pc.pos.z;
          if (Math.hypot(ax, ay, az) <= this.pc.radius + p.radius) treffer = 'fb';
        }
      }
      p.treffer = treffer;
      if (p.dreh) { p.grp.rotation.x += p.dreh.x * SPEC.wuerfel.dreh * dt; p.grp.rotation.y += p.dreh.y * SPEC.wuerfel.dreh * dt; p.grp.rotation.z += p.dreh.z * SPEC.wuerfel.dreh * dt; }
      /* Der Bolzen atmet — ein Energiegeschoss, das starr fliegt, ist ein Ball. Kleiner Puls auf der
         Hülle, geseedet über die Lebenszeit, kein Zufall je Bild. */
      if (p.puls) { const s = 1 + Math.sin(p.leben * 26) * 0.16; p.puls.scale.setScalar(s); }
      let weg = p.leben <= 0 || p.grp.position.y < this.field.floorY() - 3;
      /* AUFPRALLEN, NICHT VERSCHWINDEN. Georg 06.09.: »FBs Würfel-Schüsse verschwinden in der Karte
         steckend, statt aufprallen/bouncend von der Karte zu fallen« — richtig: die Bedingung nahm
         jedes Geschoss weg, sobald es den Boden oder den Kartenrand erreichte. Ein Würfel ist aber
         ein KÖRPER: er springt (Restitution 0,42), verliert Fahrt, rollt über die Kante und fällt
         dann — und ERST unter der Karte ist er weg. Der Fehlschuss bleibt sichtbar, und das ist bei
         einem Wurfgeschütz die halbe Lesbarkeit. */
      if (!weg && p.von === 'spieler' && p.vy != null) {
        const boden = this.field.floorY() + p.radius * 0.6;
        const drauf = this.field.inside(p.grp.position.x, p.grp.position.z);
        if (drauf && p.grp.position.y <= boden && p.vy < 0) {
          p.grp.position.y = boden;
          p.vy = -p.vy * 0.42;
          p.tempo *= 0.72;
          if (Math.abs(p.vy) < 0.5) { p.vy = 0; p.tempo *= 0.5; }
          p.leben = Math.max(p.leben, 1.4);          // liegen lassen, damit man den Fehlschuss sieht
          if (p.dreh) { p.dreh.multiplyScalar(0.6); }
          this._cue('aufsetzer', { at: p.grp.position });
        }
      }
      if (!weg && p.von === 'mob' && p.vy != null) {
        /* Auch der geworfene Würfel des Gegners prallt auf und fällt — dieselbe Physik wie bei FB,
           damit ein Fehlschuss auf beiden Seiten sichtbar bleibt. */
        const boden = this.field.floorY() + p.radius * 0.6;
        if (this.field.inside(p.grp.position.x, p.grp.position.z) && p.grp.position.y <= boden && p.vy < 0) {
          p.grp.position.y = boden; p.vy = -p.vy * 0.38; p.tempo *= 0.7;
          if (Math.abs(p.vy) < 0.5) { p.vy = 0; p.tempo *= 0.5; }
          p.leben = Math.max(p.leben, 1.2);
        }
      }
      if (!weg && p.von === 'spieler' && p.treffer) {
        const m = p.treffer;
        /* KEIN NaN INS LEBEN. Ein Schaden ohne Zahl machte einen Körper dauerhaft unsterblich
           (`NaN <= 0` ist falsch) — gemessen 06.09. Wer ohne Zahl trifft, trifft nicht. */
        if (!isFinite(p.schaden)) { this.log('Treffer ohne Schadenszahl verworfen (' + p.von + ')'); weg = true; }
        else {
          if (!isFinite(m.hp)) m.hp = m.hpMax;
          m.hp -= p.schaden;
          this.zaehler.treffer++;
          this._emit(p.energie || 'electric', SPEC.flaeche.gegner, { x: p.grp.position.x, y: p.grp.position.y, z: p.grp.position.z }, false, 'burst');
          this._cue('treffer', { energy: p.energie || 'electric', surface: bankSurface(SPEC.flaeche.gegner), heavy: false, at: p.grp.position });
          /* DEFORMER + PUSH-BACK IN SCHUSSRICHTUNG (Georg 06.09.): `kfb-hit-response` macht Squash,
             Hitstop und Knockback aus einer Trefferachse — die Achse gibt der Wirt mit (`dir`), weil
             eine Flächennormale auf einem runden Körper irgendwohin zeigt. Schub klein (0,22 u): ein
             Gegner, der wegfliegt, verlässt seine Halteweite. */
          this._deformer(m.root, p.dir, p.grp.position, m.hoehe, SPEC.flaeche.gegner, p.energie || 'electric', m);
          m.pos.x += p.dir.x * 0.22; m.pos.z += p.dir.z * 0.22;
          if (m.hp <= 0) this._kill(m);
          weg = true;
        }
      } else if (!weg && p.von === 'mob' && p.treffer === 'fb') {
        if (isFinite(p.schaden)) {
          this.hp = Math.max(0, this.hp - p.schaden);
          this.zaehler.fbSchaden += p.schaden;
          this._emit('kinetic', SPEC.flaeche.fb, { x: p.grp.position.x, y: p.grp.position.y, z: p.grp.position.z }, false, 'burst');
          this._cue('treffer', { energy: 'kinetic', surface: bankSurface(SPEC.flaeche.fb), heavy: false, at: p.grp.position });
          this._deformer(this.fb && this.fb.figure, p.dir, p.grp.position, this.fbHoehe, SPEC.flaeche.fb, 'kinetic', null);
        }
        weg = true;
      }
      if (weg) { this.gruppe.remove(p.grp); this.schuesse.splice(i, 1); }
    }

    /* Würfel liegen, taumeln und werden eingesogen — ein Aufsammeln, das man nicht sieht, ist keins. */
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const w = this.pickups[i];
      w.t += dt; w.leben -= dt;
      w.grp.rotation.y += dt * 1.6;
      w.grp.position.y = this.field.floorY() + SPEC.wuerfel.hoehe * 0.4 + Math.sin(w.t * 2.4) * 0.04;
      const d = Math.hypot(w.grp.position.x - this.pc.pos.x, w.grp.position.z - this.pc.pos.z);
      if (d < SPEC.wuerfel.sog) {
        const k = Math.min(1, dt * 6);
        w.grp.position.x += (this.pc.pos.x - w.grp.position.x) * k;
        w.grp.position.z += (this.pc.pos.z - w.grp.position.z) * k;
        if (d < 0.35) { this.gruppe.remove(w.grp); this.pickups.splice(i, 1); this.gesammelt = (this.gesammelt || 0) + 1; this._cue('aufsetzer', { at: w.grp.position }); continue; }
      }
      if (w.leben <= 0) { this.gruppe.remove(w.grp); this.pickups.splice(i, 1); }
    }
  }

  /**
   * BODEN C3: die Kette als drei Zahlen nebeneinander. Und C9: der kleinste Abstand einer Emission
   * zur Schutzzone — negativ hieße, ein Sprite wäre im Gesicht entstanden (er wird dann verschoben,
   * die Zahl zeigt, wie oft es knapp war).
   */
  probe() {
    const z = this.zaehler;
    return {
      kills: z.kills, wuerfel: z.wuerfel, pops: z.pops,
      schuesse: z.schuesse, treffer: z.treffer, mobSchuesse: z.mobSchuesse, bisse: z.bisse,
      gesammelt: this.gesammelt || 0, liegend: this.pickups.length, fliegend: this.schuesse.length,
      hp: this.hp, gesichtMin: this.gesichtMin != null ? +this.gesichtMin.toFixed(3) : null,
      zone: +(this.fbHoehe * SPEC.schutzzone).toFixed(3)
    };
  }

  /** Selbsttest: N Schüsse auf den nächsten Mob, ohne Maus — der Beweis darf nicht am Zeigefinger hängen. */
  schiessProbe(n) {
    if (!this.aktiv || !this.mb.mobs.length) return null;
    const vor = Object.assign({}, this.zaehler);
    let bilder = 0;
    for (let k = 0; k < (n || 12); k++) {
      const ziel = this.mb.lebende()[0];
      if (!ziel) break;
      /* DENSELBEN WEG WIE DAS SPIEL. Die Probe baute sich ihr eigenes Geschoss aus `SPEC.spieler` —
         und als der Waffen-Umbau `tempo` und `schaden` dort entfernte, flog sie mit `undefined`:
         NaN-Position, NaN-Leben, ein unsterblicher Gegner und ein BLOCK-Boden, der »noch kein Kill«
         meldete, während der Spielpfad einwandfrei tötete (Kritiker 06.09.). Jetzt richtet die Probe
         nur noch und ruft `_abgang()` — dieselbe Munition, dasselbe Rezept, dasselbe Ergebnis.
         *Ein Beweis mit zweitem Rechenweg beweist den zweiten Rechenweg* — der Satz stand schon in
         `player.v2.js probe()`, und hier war er verletzt. */
      const dx = ziel.pos.x - this.pc.pos.x, dz = ziel.pos.z - this.pc.pos.z;
      const d = Math.hypot(dx, dz) || 1e-6;
      const b = { x: dx / d, z: dz / d };
      if (this.pc.blickAuf) this.pc.blickAuf(b, 0.4);
      this._kalt = 0;
      this._abgang(b);
      for (let i = 0; i < 30 && this.schuesse.length; i++) { this.update(1 / 60); bilder++; }
    }
    const p = this.probe();
    this.log('Schießprobe · ' + (this.zaehler.schuesse - vor.schuesse) + ' Schüsse · ' + (this.zaehler.treffer - vor.treffer) + ' Treffer · '
      + (this.zaehler.kills - vor.kills) + ' Kills = ' + (this.zaehler.wuerfel - vor.wuerfel) + ' Würfel = ' + (this.zaehler.pops - vor.pops) + ' Pops · ' + bilder + ' Bilder');
    return p;
  }

  tor() { return { bestanden: (this.dice ? 1 : 0) + (this.D ? 1 : 0), von: 2 }; }

  zeile() {
    if (!this.zaehler) return '[gun] lädt';
    const p = this.probe();
    return '[gun] ' + p.schuesse + ' Schüsse · ' + p.treffer + ' Treffer · ' + p.kills + ' Kills = ' + p.wuerfel + ' Würfel = ' + p.pops + ' Pops · '
      + p.gesammelt + ' aufgesammelt (' + p.liegend + ' liegen) · Gegenfeuer ' + p.mobSchuesse + '/' + p.bisse + ' Biss · FB ' + p.hp + ' HP'
      + (p.gesichtMin != null ? ' · Gesicht ' + (p.gesichtMin >= 0 ? '+' : '') + p.gesichtMin.toFixed(2) + ' u' : '');
  }
}
