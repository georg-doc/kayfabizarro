/* FrizzleGraft v1 · graft-biped.v1 — DER GRAFT ALS BEWOHNER DES STUDIOS.
 *
 * Georgs Entscheidung (11.09.): nicht die Tabs ins Lab nachbauen, sondern den Graft ins Studio
 * setzen. Dann greifen Face, Motion, Voice, Bubbles und Pad **ohne eine Zeile neue Oberfläche**,
 * und was am Mund oder an den Sprechblasen geändert wird, gilt für beide Figuren — nicht per
 * Absprache, sondern weil es derselbe Code ist.
 *
 * WARUM DAS BILLIG IST (gemessen, bevor eine Zeile entstand): `_buildBiped` im Studio fragt sein
 * Modul nach genau sechs Dingen — `variant` · `mount(root)` · `ready` · `figure` · `faceBox` ·
 * `faceCtx()` — und baut das Gesicht dann SELBST (»Rolli-Regel«, Blatt Z. 1547–1550). Und
 * **FrizzleBobs eigenes Modul spielt bereits das KayKit-Animationsset** (`SPEC.anims.dir =
 * KayKit_Character_Animations_1.1/…/Rig_Medium/`) — dasselbe Skelett, das der Wirt mitbringt.
 * Also wird hier nichts nachgebaut: die Klasse ERBT von FrizzleBob und tauscht eine einzige
 * Sache aus — **welcher Körper geladen wird**.
 *
 * DER UNTERSCHIED IN EINEM SATZ: FrizzleBob lädt seinen Körper und mißt seinen Kopf; der Graft
 * lädt einen KayKit-Körper, mißt DESSEN Kopf (`facehost.v1`) und setzt FrizzleBobs Kopf darauf
 * (`headgraft.v1`). Alles danach — Clips, Mixer, Boden, Gesichtsrahmen, Bericht — ist geerbt.
 *
 * DREI VERTRÄGE, DIE HIER EINGEHALTEN WERDEN:
 *   · `faceBox.name === 'body'` — EyeRig und PetMouth suchen genau ihn. Der Graft liefert seine
 *     eigene Box (die SCHÄDELBOX), nicht die des Wirtskopfs. Das ist die Naht.
 *   · `SPEC` wird weitergereicht, nicht kopiert. Das Studio liest `SPEC.eyes` für die Startwerte;
 *     Georgs Abnahme vom 05.09. gilt, weil die Gesichtsbox dieselbe Schädelbox ist.
 *   · Nichts wird ins Wirtsmodell geschrieben. `dispose()` stellt den Zustand davor her.
 *
 * EIGENTUM: dieses Modul besitzt die Wahl des Wirts und die Naht zwischen Wirt und Kopf ·
 * `facehost`/`headgraft` besitzen Messung und Kopfnetz · das Studio besitzt das Gesicht.
 */
import FrizzleBob, { SPEC as FB_SPEC } from '../petstudio-v9/studio-v12/frizzlebob.v4a.js';
import { buildFaceHost } from './facehost.v1.js';
import { buildHeadGraft } from './headgraft.v1.js';

export const SPEC = FB_SPEC;   // ⚠ WEITERGEREICHT, nicht kopiert: eine Kopie wäre ab morgen eine zweite Wahrheit

/* Die Wirtskörper. Pfade aus dem Prüfstand übernommen, wo sie GEMESSEN wurden (FrizzleDummy Lab,
   `EXACT`) — nicht aus dem Verzeichnisbaum geraten, der `.glb` ohnehin nicht anzeigt. */
export const HOSTS = {
  driver:   { label: 'Driver',        path: 'KayKit_Mystery_Series6/2 - August 2023 - Driver/character/gltf/Driver.glb' },
  medium:   { label: 'Mannequin M',   path: 'KayKit_Character_Animations_1.1/Mannequin Character/characters/Mannequin_Medium.glb' },
  ninja:    { label: 'Ninja',         path: 'KayKit_Mystery_Series6/8 - February 2024 - Ninja/character/Ninja.glb' },
  clown:    { label: 'Clown',         path: 'KayKit_Mystery_Series6/11 - May 2024 - Clown/characters/Clown.glb' },
  /* v15 (Georg 12.09.): der Orc Raider kommt dazu. Pfad aus dem Prüfstand (`EXACT`) — er liegt flach
     in `character/`, ohne `gltf/`, und seine Bildtafel liegt eine Stufe höher in `textures/`.
     Ohne die Nachlieferung unten ist er WEISS: `orc_texture_A` hat gemessen `map` = keine. */
  orcRaider:{ label: 'Orc Raider',    path: 'KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/character/OrcRaider.glb' },
};

/* ═══ v15 · ROLLEN STATT MATERIALNAMEN ═════════════════════════════════════════════════════
   GEMESSEN 12.09. an drei Wirten, und das Ergebnis widerlegt den naheliegenden Plan:
     Driver    → EIN Material `driver_texture`
     Clown     → EIN Material `clown`
     Orc Raider→ EIN Material `orc_texture_A` (ohne Bildtafel)
   Eine Rollentabelle über MATERIALNAMEN kann diese Figuren also gar nicht trennen — es gibt nichts
   zu trennen. Was sie alle drei tragen, sind gleich gebaute MESH-NAMEN:
   `<Name>_ArmLeft/ArmRight/Body/LegLeft/LegRight/Head` plus je ein Extra (Sunglasses · Hat · Warpack).
   Deshalb ist die Reihenfolge: Rollen (dieses Muster) als Vorgabe — Materialnamen als Rückfall
   (FrizzleBobs eigener Spender trägt sechs Flachfarben, dort greift `applyZones`).
   Die Haut wird NICHT über den Namen entschieden: dafür gibt es den gemessenen Schnitt aus
   Knochenregel + Texturprobe weiter unten — der Mesh-Name würde die Manschette zur Hand machen. */
export const ROLE_LABELS = { skin: 'Haut', cloth: 'Kleidung', accent: 'Akzent', eyes: 'Augen' };
export const roleOfMesh = (n) => (/head|skull|hair/i.test(n) ? null
  : /(arm|hand|wrist|body|torso|leg|foot|boot|pelvis|hip|skirt)/i.test(n) ? 'cloth' : 'accent');
/* Freie Paletten (Georg 12.09.: »Blau/Rot statt Amber«). Vier Rollen je Palette, `null` = Original. */
export const PALETTES = {
  fb:    { label: 'FrizzleBob', skin: null,      cloth: 0xf2c93c, accent: 0xb8361f, eyes: 0xf2c93c },
  blau:  { label: 'Blau',       skin: null,      cloth: 0x2f6f8f, accent: 0xe6a13c, eyes: 0x2f6f8f },
  rot:   { label: 'Rot',        skin: null,      cloth: 0xb8361f, accent: 0xf6efd9, eyes: 0xb8361f },
  gruen: { label: 'Grün',       skin: null,      cloth: 0x4f6029, accent: 0xe6a13c, eyes: 0x4f6029 },
  orig:  { label: 'Original',   skin: null,      cloth: null,     accent: null,     eyes: null },
};

/* v15 · SIND DIE HÄNDE HAUT ODER STOFF? Georg 12.09. am Clown: »die Manschetten sind hier die
   Handschuhe; auf der Haut sind gelbe Zacken« — und genau so ist es gemessen: am Clown hängt am
   Handknochen ein HANDSCHUH (Zackenkante inbegriffen, Ton #e5e9eb), kein Handrücken. Ein Hautton
   darauf färbt Stoff und schickt die Zacken über den weißen Unterarm.
   Keine Farbregel kann das entscheiden: beim Clown sind Handschuh UND Unterarm weiß. Also ist es
   eine Angabe je Wirt — mit Schalter, weil eine Tabelle ohne Regler eine Behauptung bleibt. */
export const HOST_HANDS = { driver: 'skin', medium: 'gloves', ninja: 'gloves', clown: 'gloves', orcRaider: 'skin' };
/* ⚠ `medium` (Mannequin) stand auf `skin` und war falsch — Georg 12.09.: gelbe Zacken auf dem
   Unterarm. GEMESSEN: der häufigste Ton unter den Hand-Kandidaten ist **#ea5229**, ein kräftiges
   Orange. Das ist der HANDSCHUH des Mannequins, kein Hautton — er kam durch die Plausibilitätsprobe
   (warm, R≥G≥B) und landete danach auch noch als Gesichtston auf FrizzleBobs Schnauze. Ein Mannequin
   hat keine Haut; drei von fünf Wirten tragen Handschuhe. */

/* Georgs Wahl »eine Figur, eine Farbe«: der Wirtskörper bekommt dieselbe Formel wie FrizzleBobs
   Flachfarben (`SPEC.tint`) — gesättigte Farben werden zum Kanon-Gelb, neutrale (Weiß, Schwarz,
   Grau) bleiben, sonst verliert die Figur ihre Zeichnung. Der Kopf ist schon gelb: er kommt aus
   der gepatchten Datei. */
const TINT = { target: 0xf2c93c, satMin: 22, lumGain: 1.15, lumLift: 0.18 };

export default class GraftBiped extends FrizzleBob {
  static describe() { return { name: 'FrizzleGraft', capabilities: ['three@0.160', 'assets', 'clock', 'rng'], view: '3d', determinism: 'seeded', spec: SPEC }; }

  async init(ctx) {
    await super.init(ctx);
    this.log = (s) => { this.provenance.push(s); (ctx.log || console.info)('[graft-biped] ' + s); };
    this.hostKey = 'driver';
    this.neck = 0;        // Anteil der Wirts-Kopfhöhe, um den der Kopf höher sitzt (Georgs Regler)
    this.headScale = 1;   // Anteil der gemessenen Wirts-Kopfbox
    this.skinMode = 'skin';   // 'skin' · nur Haut · 'all' · ganze Figur · 'off' · Original
    /* v15 · die vier Rollen. `null` = Original, also nichts angefaßt. Die Haut hat ihren eigenen
       Weg (`skinColor`, gemessener Kopfton als Vorgabe); `eyes` gehört dem Augen-Rig und wird vom
       Studio gesetzt — hier steht sie nur, damit eine Palette vollständig ist. */
    this.roles = { skin: null, cloth: null, accent: null, eyes: null };
    this.skinColor = null;    // null = Ton vom KOPF nehmen, gemessen statt gewählt
    this._tintUndo = [];
    this.tintOn = true;
  }

  /* ⚠ GEMESSEN: `MovementBasic` enthält für dieses Rig KEIN Idle — nur Jump, Running, Walking und
     T-Pose. Der geerbte Aufbau griff deshalb zu `Jump_Idle`, und die Figur stand mit waagerecht
     ausgestreckten Armen da: **kein Fehler im Bau, ein Griff ins falsche Paket.** FrizzleBob fällt
     das nicht auf, weil er 19 EIGENE Clips mitbringt, darunter ein Idle; ein KayKit-Wirt bringt
     keine mit. Also wird hier zusätzlich `General` geladen, wo die Idles liegen. */
  async _build() {
    await this._loadVariant(this.variant);
    for (const cat of ['General', 'MovementBasic']) {
      if (!this.categories[cat]) await this.loadCategory(cat).catch((e) => this.log(cat + ' nicht erreichbar: ' + e.message));
    }
    const idle = this.findClip(/^Idle/i) || this.findClip(/^Sit/i) || this.findClip(/idle/i);
    if (idle) { this.play(idle.name, { loop: true }); this.log('Ruhehaltung: ' + idle.name + ' (' + idle.source + ')'); }
    else this.log('⚠ keine Ruhehaltung gefunden — die Figur steht in der Bindepose');
    this.built = true;
    return this.report();
  }

  /* Nur DIESE Methode ist anders als beim Spender: welcher Körper geladen wird und was danach
     auf seinen Kopf kommt. `_build()` (Clips, Idle, Bericht) bleibt geerbt. */
  async _loadVariant(variant) {
    const T = this.THREE;
    const key = HOSTS[variant] ? variant : this.hostKey;
    this.hostKey = key;
    const path = HOSTS[key].path;
    const t0 = performance.now();
    /* Nicht zwischenspeichern: ein zweiter Aufbau würde sich dieselbe Szene teilen, und der erste
       hätte sie beim Abräumen schon entsorgt. Ein Netzabruf ist billiger als dieser Fehler. */
    const gltf = await this.loader.loadAsync(this.assets.raw(path));
    const ms = Math.round(performance.now() - t0);
    console.info('[repo-fs] ' + path.split('/').pop() + ' ' + ms + ' ms');

    this._disposeGraft();
    this._disposeFigure();
    const fig = this.figure = gltf.scene;
    fig.name = 'figure';
    this.root.add(fig);
    fig.updateMatrixWorld(true);

    const m = this.m = this._measure(gltf, path, ms);   // geerbt und allgemein: Knochen, Netze, Kopfbox, Materialien
    await this._repairTextures(path);   // v15: fehlende Bildtafel unter dem Materialnamen nachreichen (Orc Raider)
    m.degrayed = this.prepare(fig);
    fig.position.y -= m.box.min.y;
    fig.updateMatrixWorld(true);
    { const ly = this._lowestY(); if (ly != null) { const ry = this.root.getWorldPosition(new T.Vector3()).y; fig.position.y -= (ly - ry); fig.updateMatrixWorld(true); } }

    this.ownClips = (gltf.animations || []).map((c) => ({ name: c.name, dur: +c.duration.toFixed(2), clip: c, source: 'own', matched: c.tracks.length, total: c.tracks.length }));
    this.mixer = new T.AnimationMixer(fig);
    this.action = null;

    /* Der Rahmen am WIRTSKOPF — gemessen, mit Blickrichtung aus den Zehen. */
    const fh = this._fh = buildFaceHost({ THREE: T, figure: fig, log: (t) => this.log(t) });
    if (fh.status !== 'OK') { this.log('Kopf-Host gescheitert: ' + fh.reason); return; }
    /* FrizzleBobs Kopf darauf — Schädel auf Wirtsmaß, Ohren darüber hinaus, Wirtskopf ausgeblendet. */
    const gr = this._graft = await buildHeadGraft({
      THREE: T, loader: this.loader, figure: fig, host: fh,
      place: { size: this.headScale, dy: this.neck }, log: (t) => this.log(t),
    });
    if (gr.status !== 'OK') { this.log('Kopf gescheitert: ' + gr.reason); return; }

    /* ⚠ DIE NAHT. Ab hier zeigt alles, was das Studio »Gesicht« nennt, auf den NEUEN Kopf.
       Ein Rahmen, der auf dem alten Kopf bliebe, würde Augen in einen unsichtbaren Schädel setzen. */
    this.faceInner = gr.inner;
    this.faceBox = gr.box;

    /* Erst JETZT die Färbung: sie nimmt ihren Ton vom KOPF, und den gibt es vorher nicht. */
    this._tintHost(this.skinMode);

    this._buildFace();   // geerbt: tut nichts, solange das Studio die Rigs selbst baut (Rolli-Regel)
    this.log(HOSTS[key].label + ' · ' + path.split('/').pop() + ' · ' + ms + ' ms · Höhe ' + m.height.toFixed(3)
      + ' · Knochen ' + m.bones + ' · Wirtskopf ' + (m.head || 'FEHLT')
      + ' · Kopf v13 Maßstab ' + gr.report.scale + ' → ' + gr.report.graftSize.join('×')
      + ' · Hals ' + this.neck.toFixed(2));
  }

  /* ═══ DIE FÄRBUNG · drei Stände, EIN Eigentümer ═══════════════════════════════════════════════
   *
   * Georgs Befund 11.09.: »das ganze Modell gelb war vielleicht doch nicht so die gute Idee — den
   * Hautton vom KOPF nehmen, bei den Händen ist es ja schon so; Jacke, Kragen, Ärmel, Hose und das
   * aufgemalte Logo NICHT gelb.«
   *
   * ⚠ WARUM DIE ERSTE FASSUNG DAS NICHT KONNTE, gemessen statt vermutet: die Textur des Drivers
   * hat **626 Farbgruppen**, und die größten sind Brauntöne — #9c5a45 (4,2 %), #b37052 (2,7 %),
   * #a4634a, #7d3d2c … das ist die **Lederjacke**. Haut ist ebenfalls ein warmes Braun.
   * **Farbe kann Haut und Lederjacke nicht trennen.** Eine Formel über die Sättigung färbt beide.
   *
   * DIE TRENNLINIE IST DER KNOCHEN, NICHT DIE FARBE. Gemessen: der Driver besteht aus **sieben
   * Netzen an EINEM Material** (Arm links/rechts · Körper · Kopf · Bein links/rechts · Brille) —
   * und in `Driver_ArmLeft` stecken Ärmel UND Hand zusammen (103 von 278 Punkten hängen an
   * `handl`/`wristl`). Also entscheidet je DREIECK, welcher Knochen der stärkste ist: Kopf, Hals,
   * Hand und Handgelenk sind Haut, alles andere ist Kleidung. Genau die Insel-Regel, die schon die
   * Ohren und den Wirtskopf sauber herausgeschnitten hat.
   *
   * GEBAUT WIRD MIT ZEICHENGRUPPEN, nicht mit einer zweiten Textur: das Netz wird in Kleidung und
   * Haut geteilt, die Hautgruppe bekommt ein Material OHNE Textur in Kopffarbe. Damit bleibt die
   * Textur unangetastet — Jacke, Hose und die aufgemalten Logos behalten Bild für Bild ihr
   * Original, und `dispose()` gibt alles zurück.
   *
   * `'all'` bleibt als Stand erhalten (Textur umfärben nach Kanon-Formel) — Georgs erste Wahl,
   * damit der Rückweg nicht erst wieder gebaut werden muß.
   */
  _skinColorHex() {
    if (this.skinColor != null) return this.skinColor;
    /* Ton vom KOPF nehmen, nicht wählen: die Farbe steht im Material des aufgesetzten Kopfes. */
    if (this._graft && this._graft.group) {
      let hex = null;
      this._graft.group.traverse((o) => { if (!hex && o.isMesh && o.material && o.material.color) hex = o.material.color.getHex(); });
      if (hex != null) return hex;
    }
    return TINT.target;
  }

  _tintHost(mode) {
    if (!this.figure) return;
    this.skinMode = mode = (mode === true ? 'all' : mode === false ? 'off' : mode) || 'skin';
    this._undoTint();
    const hex = this._skinColorHex();
    if (mode === 'off') {
      this.tintReport = { mode, target: '#' + hex.toString(16).padStart(6, '0'), skinTris: 0, clothTris: 0, mapPx: 0 };
      this.log('Wirtsfarbe: Original');
      return;
    }
    if (mode === 'all') { this._tintWholeBody(hex); return; }

    /* v15 · Handschuh-Wirte bekommen keinen Hautanteil: nichts zu färben, also auch keine Zacken.
       Der Kopf ist FrizzleBobs und wird davon nicht berührt. */
    const handsAre = this.handsAre || HOST_HANDS[this.hostKey] || 'skin';
    if (handsAre === 'gloves') {
      this._paintRoles();
      this.tintReport = { mode, target: '#' + hex.toString(16).padStart(6, '0'), skinTris: 0, clothTris: 0, meshes: 0, rejected: 0, mapPx: 0, hands: 'gloves' };
      this.log('Wirtsfarbe · Hände sind Handschuh — kein Hautanteil am Wirt (Angabe je Wirt, umschaltbar)');
      return;
    }

    const T = this.THREE;
    const SKIN = /^(head|neck|hand|wrist|fist|skull)/i;
    const skinMat = this._skinMat = new T.MeshStandardMaterial({ color: new T.Color(hex), roughness: 0.85, metalness: 0 });
    skinMat.name = 'kfb-skin';
    let skinTris = 0, clothTris = 0, meshes = 0, rejected = 0, noTex = 0;
    this.figure.traverse((mesh) => {
      if (!mesh.isSkinnedMesh || !mesh.geometry || !mesh.geometry.index || !mesh.skeleton) return;
      if (mesh.userData.noMeasure) return;                 // Brille, Host-Box, alles Aufgesetzte
      /* ⚠ EIN EIGENTÜMER JE NETZ: `headgraft` hat dieses Netz schon geteilt, um den Wirtskopf
         auszublenden. Ein zweiter Schnitt hängt den unsichtbaren Anteil aus, und der Wirtskopf
         steht wieder im Bild — nur von FrizzleBobs größerem Kopf verdeckt. Gemessen genau so
         passiert (`Driver_Head` zeichnete mit `kfb-skin` statt unsichtbar). Haut brauchen wir dort
         ohnehin nicht: der Kopf ist FrizzleBobs. */
      if (mesh.userData.kfbHostHeadSplit) return;
      const g = mesh.geometry, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, bones = mesh.skeleton.bones;
      if (!si || !sw) return;
      const isSkin = new Uint8Array(g.attributes.position.count);
      for (let i = 0; i < isSkin.length; i++) {
        let bi = 0, bw = -1;
        for (let j = 0; j < 4; j++) { const w = sw.getComponent(i, j); if (w > bw) { bw = w; bi = si.getComponent(i, j); } }
        const bn = bones[bi];
        if (bn && SKIN.test(bn.name)) isSkin[i] = 1;
      }
      const ix = g.index.array, cloth = [], skin = [];
      for (let t = 0; t < ix.length; t += 3) {
        const c = isSkin[ix[t]] + isSkin[ix[t + 1]] + isSkin[ix[t + 2]];
        /* Zwei von drei: ein Dreieck am Handgelenk gehört der Hand, nicht dem Ärmel — und der Saum
           bleibt beim Ärmel. »Eines genügt« hätte den halben Ärmel mitgenommen. */
        (c >= 2 ? skin : cloth).push(ix[t], ix[t + 1], ix[t + 2]);
      }
      if (!skin.length) { clothTris += cloth.length / 3; return; }
      /* ⚠ ZWEITE HÄLFTE DER FRAGE: DER KNOCHEN ALLEIN LÜGT AM HANDGELENK.
         GEMESSEN am Driver: von 164 »Haut«-Dreiecken in `Driver_ArmLeft` liegen 136 auf dem
         Hautton der Textur (255,190,160) und 28 auf Ärmel-Orange (224,96,0) — das sind die
         Manschetten-Zacken, die Georg als gelbe Flecken gesehen hat. Sie hängen am `handl`-
         Knochen, weil sie sich mit der Hand mitbewegen, gehören aber zur Jacke.
         Also fragen wir die Textur: welchen Ton trägt das Dreieck WIRKLICH? Der häufigste Ton
         unter den Knochen-Kandidaten ist die Haut (sie ist die Mehrheit); alles, was weiter als
         die Schwelle davon entfernt liegt, geht zurück an die Kleidung. Kein Netz ohne Textur
         wird bestraft — dort bleibt die Knochenregel allein stehen. */
      const smp = this._texSampler(mesh);
      /* ⚠ GEORG 12.09. AM MANNEQUIN-GRAFT: gelbe Zacken auf dem Unterarm. Gemessen ist die Ursache
         eine FEHLENDE Bildtafel: ohne Textur gibt es keine zweite Probe, die Knochenregel steht
         allein — und die trennt am Handgelenk nicht sauber, sie zackt. Ein grauer Dummy hat gar
         keinen Hautton, den man treffen könnte. Also: **kein Texturbeleg, kein Hautschnitt**.
         Das ist keine Ausnahme für das Mannequin, sondern die Regel für jeden untexturierten Wirt. */
      if (!smp) {
        clothTris += (cloth.length + skin.length) / 3;
        noTex++;
        return;
      }
      if (smp && g.attributes.uv) {
        const uv = g.attributes.uv, rgb = [], hist = new Map();
        for (let t = 0; t < skin.length; t += 3) {
          const a = skin[t], b2 = skin[t + 1], c2 = skin[t + 2];
          const p = smp((uv.getX(a) + uv.getX(b2) + uv.getX(c2)) / 3, (uv.getY(a) + uv.getY(b2) + uv.getY(c2)) / 3);
          rgb.push(p);
          const k = ((p[0] >> 5) << 10) | ((p[1] >> 5) << 5) | (p[2] >> 5);
          const e = hist.get(k) || [0, 0, 0, 0]; e[0]++; e[1] += p[0]; e[2] += p[1]; e[3] += p[2]; hist.set(k, e);
        }
        let best = null;
        hist.forEach((e) => { if (!best || e[0] > best[0]) best = e; });
        /* ⚠ GEMESSEN 12.09. AM ORC RAIDER (Georg: »die Manschetten-Zacken sind wieder da«):
           die alte Regel hatte ZWEI Fehler, und beide zeigten sich erst an einer Figur, deren Haut
           nicht die Mehrheit ist.
           1 · Die Schwelle war zu weit. Orc-Haut #4fb070 gegen Panzer-Grau #899499 liegt bei
               Abstand² 5829 — unter den alten 96² = 9216. Also wurde der Panzer als Haut bestätigt
               und kein einziges Dreieck zurückgewiesen (`rejected: 0`). Bei 64² = 4096 fällt er
               heraus. Am Driver ändert die engere Schwelle NICHTS (0,83 vor und nach), beim Clown
               1,00 → 0,95.
           2 · Die absolute Mehrheit als Bedingung. Beim Orc sind die Kandidaten 194 Dreiecke, davon
               nur 22 % in der größten Farbgruppe — Arme aus Panzer und Bandagen. Die Bedingung ist
               jetzt: die GRUPPE um den Startton muß mindestens ein Fünftel tragen (gemessen:
               Orc 0,28 / 0,52 · Driver 0,83 / 0,86 · Clown 0,95). Sonst bleibt die Knochenregel
               allein stehen, wie bisher. */
        const LIM = 64 * 64;
        let share = 0;
        if (best) {
          const br = best[1] / best[0], bg = best[2] / best[0], bb = best[3] / best[0];
          share = rgb.filter((p) => { const dr = p[0] - br, dg = p[1] - bg, db = p[2] - bb; return dr * dr + dg * dg + db * db <= LIM; }).length / rgb.length;
        }
        if (best && share >= 0.2) {
          const tr = best[1] / best[0], tg = best[2] / best[0], tb = best[3] / best[0];
          /* Der häufigste Ton unter den Hand-Kandidaten IST der Handton — gemessen (255,190,160).
             Georg 12.09.: das Gesicht soll denselben Ton tragen. Also hier merken, statt später zu
             raten; die erste Messung gewinnt (die Arme sind die Quelle, nicht der Kopf). */
          /* ⚠ v15, BEZAHLT: die engere Schwelle liefert jetzt AUCH beim Orc einen Handton — und der
             ist #4fb070, Orc-Grün. `zones.face:'hand'` hat den prompt auf FrizzleBobs Schnauze
             gelegt: eine grüne Schnauze, die niemand bestellt hat, während die Arme gelb blieben.
             Der Handton darf also nur übernommen werden, wenn er als HAUTton durchgeht — gemessen
             an den drei Wirten: Driver #f6c19d (warm, R≥G≥B), Clown #e5e9eb (neutral),
             Orc #4fb070 (Grün dominiert). Die Probe ist genau das: warme Ordnung oder nahezu
             neutral. Was durchfällt, wird GEMELDET, nicht stillschweigend genommen. */
          if (/arm/i.test(mesh.name) && this.handTone == null && this.handToneRejected == null) {
            const hx = (Math.round(tr) << 16) | (Math.round(tg) << 8) | Math.round(tb);
            const mx = Math.max(tr, tg, tb), mn = Math.min(tr, tg, tb);
            const plausible = (tr >= tg && tg >= tb) || (mx - mn) < 24;
            if (plausible) this.handTone = hx;
            else {
              this.handToneRejected = hx;
              this.handToneNote = 'Handton #' + hx.toString(16).padStart(6, '0') + ' zurückgewiesen: kein Hautton (Grün/Blau dominiert) — das Gesicht behält den Spenderton';
              this.log(this.handToneNote);
            }
          }
          const keep = [];
          for (let t = 0, q = 0; t < skin.length; t += 3, q++) {
            const p = rgb[q], dr = p[0] - tr, dg = p[1] - tg, db = p[2] - tb;
            if (dr * dr + dg * dg + db * db <= LIM) keep.push(skin[t], skin[t + 1], skin[t + 2]);
            else { cloth.push(skin[t], skin[t + 1], skin[t + 2]); rejected++; }
          }
          skin.length = 0; Array.prototype.push.apply(skin, keep);
        }
      }
      if (!skin.length) { clothTris += cloth.length / 3; return; }
      const oldIndex = g.index, oldGroups = g.groups.map((x) => Object.assign({}, x)), oldMat = mesh.material;
      const list = Array.isArray(oldMat) ? oldMat.slice() : [oldMat];
      const skinIx = list.length; list.push(skinMat);
      g.setIndex(cloth.concat(skin));
      g.clearGroups();
      g.addGroup(0, cloth.length, 0);
      g.addGroup(cloth.length, skin.length, skinIx);
      mesh.material = list;
      skinTris += skin.length / 3; clothTris += cloth.length / 3; meshes++;
      this._tintUndo.push(() => {
        g.setIndex(oldIndex); g.clearGroups();
        oldGroups.forEach((x) => g.addGroup(x.start, x.count, x.materialIndex));
        mesh.material = oldMat;
      });
    });
    this._tintUndo.push(() => { skinMat.dispose(); });
    this._paintRoles();   // v15: Kleidung und Akzent NACH dem Hautschnitt, damit `kfb-skin` stehenbleibt
    this.tintReport = { mode, target: '#' + hex.toString(16).padStart(6, '0'), skinTris, clothTris, meshes, rejected, noTex, mapPx: 0 };
    this.log('Wirtsfarbe · nur Haut in Kopffarbe #' + hex.toString(16).padStart(6, '0') + ': '
      + skinTris + ' Dreiecke Haut in ' + meshes + ' Netzen · ' + clothTris + ' Dreiecke Kleidung unberührt'
      + ' · ' + rejected + ' Dreiecke von der Textur zurückgewiesen (Manschette am Handknochen)'
      + (noTex ? ' · ' + noTex + ' Netze ohne Bildtafel übersprungen (kein Hautschnitt ohne Beleg)' : ''));
  }

  /* Liest die Grundtextur eines Netzes EINMAL in eine Leinwand und gibt eine Punktprobe zurück.
     `flipY` GEMESSEN: bei GLTF ist es `false` — mit der falschen Annahme landete die Probe auf
     dem Handschuh statt auf der Hand und die Mehrheit war grün statt hautfarben. */
  _texSampler(mesh) {
    const mat = [].concat(mesh.material)[0];
    if (!mat || !mat.map || !mat.map.image) return null;
    this._texCache = this._texCache || new Map();
    const key = mat.map.uuid;
    if (this._texCache.has(key)) return this._texCache.get(key);
    let fn = null;
    try {
      const img = mat.map.image, w = img.width, h = img.height;
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      const cx = cv.getContext('2d', { willReadFrequently: true });
      cx.drawImage(img, 0, 0);
      const d = cx.getImageData(0, 0, w, h).data, flip = !!mat.map.flipY;
      fn = (u, v) => {
        const px = Math.min(w - 1, Math.max(0, Math.round(u * w)));
        const py = Math.min(h - 1, Math.max(0, Math.round((flip ? 1 - v : v) * h)));
        const o = (py * w + px) * 4;
        return [d[o], d[o + 1], d[o + 2]];
      };
    } catch (e) { fn = null; }
    this._texCache.set(key, fn);
    return fn;
  }

  /* Stand »ganze Figur«: die Textur wird nach der Kanon-Formel umgefärbt (`pet-library.v6._recolorMap`).
     Das Original bleibt liegen, die gelbe Fassung entsteht einmal und wird danach nur umgehängt. */
  _tintWholeBody(hex) {
    const T = this.THREE, S = TINT;
    const tr = (hex >> 16) & 255, tg = (hex >> 8) & 255, tb = hex & 255;
    const seen = new Set(); let maps = 0, mapPx = 0;
    this.figure.traverse((mesh) => {
      if (!mesh.isMesh && !mesh.isSkinnedMesh) return;
      if (mesh.userData.noMeasure) return;
      [].concat(mesh.material).forEach((mat) => {
        if (!mat || seen.has(mat.uuid) || !mat.map || !mat.map.image) return;
        seen.add(mat.uuid);
        if (!mat.userData._origMap) mat.userData._origMap = mat.map;
        const orig = mat.userData._origMap;
        this._tintUndo.push(() => { mat.map = orig; mat.needsUpdate = true; });
        if (mat.userData._yellowMap) { mat.map = mat.userData._yellowMap; mat.needsUpdate = true; maps++; mapPx += mat.userData._yellowPx || 0; return; }
        const img = orig.image, w = img.width, h = img.height;
        if (!w || !h) return;
        const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
        const cx = cv.getContext('2d', { willReadFrequently: true });
        cx.drawImage(img, 0, 0);
        let d; try { d = cx.getImageData(0, 0, w, h); } catch (e) { this.log('Textur nicht lesbar: ' + e.message); return; }
        const a = d.data; let px = 0;
        for (let i = 0; i < a.length; i += 4) {
          const r = a[i], g2 = a[i + 1], b = a[i + 2];
          if (Math.max(r, g2, b) - Math.min(r, g2, b) < S.satMin) continue;   // neutral bleibt, sonst geht die Zeichnung verloren
          const l2 = Math.min(1, ((0.299 * r + 0.587 * g2 + 0.114 * b) / 255) * S.lumGain + S.lumLift);
          a[i] = Math.round(tr * l2); a[i + 1] = Math.round(tg * l2); a[i + 2] = Math.round(tb * l2);
          px++;
        }
        cx.putImageData(d, 0, 0);
        const tex = new T.CanvasTexture(cv);
        tex.flipY = orig.flipY; tex.colorSpace = orig.colorSpace; tex.wrapS = orig.wrapS; tex.wrapT = orig.wrapT;
        tex.magFilter = orig.magFilter; tex.minFilter = orig.minFilter; tex.needsUpdate = true;
        mat.userData._yellowMap = tex; mat.userData._yellowPx = px;
        mat.map = tex; mat.needsUpdate = true;
        maps++; mapPx += px;
      });
    });
    this.tintReport = { mode: 'all', target: '#' + hex.toString(16).padStart(6, '0'), skinTris: 0, clothTris: 0, maps, mapPx };
    this.log('Wirtsfarbe · ganze Figur: ' + maps + ' Texturen, ' + mapPx + ' Bildpunkte umgefärbt');
  }

  _undoTint() { (this._tintUndo || []).slice().reverse().forEach((f) => { try { f(); } catch (e) {} }); this._tintUndo = []; }

  /* ══ v15 · ROLLEN FÄRBEN ═══════════════════════════════════════════════════════════════════
     Läuft NACH dem Hautschnitt: die Haut hat dann ihr eigenes Material (`kfb-skin`), alles andere
     trägt noch das Original. Gefärbt wird eine KOPIE des Materials je Netz — die Bildtafel bleibt
     dran, `color` tönt sie. Ein einziges gemeinsames Material zu ändern hätte die ganze Figur
     gefärbt (alle drei gemessenen Wirte haben genau EIN Material) — genau das ist der Grund für
     Kopien je Netz. `null` läßt ein Netz unberührt. */
  /* Wer gehört dem WIRT? GEMESSEN, nicht geraten: die geskinnten, benannten Netze sind der Körper,
     und aus ihnen fällt die Liste der Wirts-Materialien. Aufgesetztes wie `Driver_Sunglasses` oder
     `Clown_Hat` ist NICHT geskinnt (gemessen — die erste positive Regel hat beide verloren), teilt
     aber die Bildtafel des Wirts; genau daran wird es erkannt. Unser eigenes Zeug trägt `kfb-` oder
     hängt unter dem Kopf-Knoten. */
  _hostParts() {
    const head = (this._graft && this._graft.group) || null;
    const underHead = (o) => { for (let q = o; q; q = q.parent) if (q === head) return true; return false; };
    const mats = new Set();
    this.figure.traverse((m) => {
      if (!m.isSkinnedMesh || !m.name || /^kfb/i.test(m.name) || underHead(m)) return;
      [].concat(m.material).forEach((x) => { if (x && x.name && !/^kfb-/.test(x.name)) mats.add(x.name); });
    });
    const is = (m) => {
      if (!(m.isMesh || m.isSkinnedMesh) || m.userData.noMeasure) return false;
      if (!m.name || /^kfb/i.test(m.name) || underHead(m)) return false;
      if (m.isSkinnedMesh) return true;
      return [].concat(m.material).some((x) => x && x.name && mats.has(x.name));
    };
    return { is, mats: [...mats] };
  }

  _paintRoles() {
    const R = this.roles || {};
    const tally = { cloth: 0, accent: 0, skipped: 0, meshes: 0 };
    if (R.cloth == null && R.accent == null) { this.roleReport = { ...tally, painted: false }; return; }
    /* ⚠ GEMESSEN, BEIM ERSTEN VERSUCH BEZAHLT: unter `figure` hängt auch UNSER Kopf (Schädel, Ohren,
       Braue, Nase, Augen). Die Braue trägt ein ShaderMaterial ohne `color` — ein Rollenanstrich lief
       dort in einen Fehler, und hätte er nicht, wäre FrizzleBobs Gesicht als »Akzent« übermalt worden.
       Also: alles unter dem Kopf-Knoten überspringen, und nur Materialien anfassen, die eine Farbe
       haben. */
    const head = (this._graft && this._graft.group) || null;
    const underHead = (o) => { for (let q = o; q; q = q.parent) if (q === head) return true; return false; };
    /* ⚠ ZWEITER BEZAHLTER FEHLER, GEMESSEN: die erste Fassung nahm JEDES Netz, das nicht Kopf heißt.
       Ergebnis am Driver: 15 Netze angemalt statt 6, 13834 »Akzent«-Dreiecke statt der 390 der Brille
       — mitgenommen wurden NAMENLOSE Netze (Mund-Abziehbild, Augen, Bühnenteile). Die Regel ist
       jetzt POSITIV (`_hostParts`) — und die zweite Fassung hat dafür Brille und Hut verloren, weil
       die nicht geskinnt sind. Beides steht dort jetzt beisammen. */
    const hostPart = this._hostParts().is;
    this.figure.traverse((mesh) => {
      if (!(mesh.isMesh || mesh.isSkinnedMesh) || mesh.userData.noMeasure) return;
      if (mesh.userData.kfbHostHeadSplit) { tally.skipped++; return; }
      if (head && underHead(mesh)) { tally.skipped++; return; }
      if (!hostPart(mesh)) { tally.skipped++; return; }
      const role = roleOfMesh(mesh.name || '');
      if (!role) { tally.skipped++; return; }
      const hex = role === 'cloth' ? R.cloth : R.accent;
      if (hex == null) return;
      const old = mesh.material, list = [].concat(old);
      if (!list.some((m) => m && m.color)) { tally.skipped++; return; }
      const next = list.map((m) => {
        if (!m || !m.color || m.name === 'kfb-skin') return m;   // die Haut behält ihren gemessenen Ton
        const c = m.clone(); c.name = 'kfb-' + role;
        c.color.setHex(hex); c.needsUpdate = true;
        this._tintUndo.push(() => c.dispose());
        return c;
      });
      mesh.material = Array.isArray(old) ? next : next[0];
      this._tintUndo.push(() => { mesh.material = old; });
      const g = mesh.geometry;
      const tris = g && g.index ? g.index.count / 3 : (g ? g.attributes.position.count / 3 : 0);
      tally[role] += tris; tally.meshes++;
    });
    this.roleReport = { ...tally, painted: true,
      cloth: Math.round(tally.cloth), accent: Math.round(tally.accent),
      hex: { cloth: R.cloth == null ? null : '#' + R.cloth.toString(16).padStart(6, '0'),
             accent: R.accent == null ? null : '#' + R.accent.toString(16).padStart(6, '0') } };
    this.log('Rollen · Kleidung ' + this.roleReport.cloth + ' Dreiecke, Akzent ' + this.roleReport.accent
      + ' Dreiecke in ' + tally.meshes + ' Netzen (' + tally.skipped + ' übersprungen: Kopf und Aufgesetztes)');
  }
  /** Rollenfarben setzen. `null` je Rolle = Original. Die Haut geht über `skinColor` (Kopfton als Vorgabe). */
  setRoles(patch) {
    this.roles = { ...(this.roles || {}), ...(patch || {}) };
    if (patch && 'skin' in patch) this.skinColor = patch.skin == null ? null : patch.skin;
    this._tintHost(this.skinMode === 'off' ? 'skin' : this.skinMode);
    return this.roleReport;
  }
  /** Was die Rollen im aktuellen Wirt FINDEN — gemessen, ohne zu färben. Der Beleg für die Leiste. */
  roleScan() {
    const out = { cloth: [], accent: [], head: [], mats: new Set() };
    if (!this.figure) return out;
    const hp = this._hostParts();
    this.figure.traverse((mesh) => {
      if (!hp.is(mesh)) return;
      [].concat(mesh.material).forEach((m) => { if (m && m.name) out.mats.add(m.name); });
      const role = roleOfMesh(mesh.name || '');
      (role === 'cloth' ? out.cloth : role === 'accent' ? out.accent : out.head).push(mesh.name);
    });
    out.mats = [...out.mats];
    return out;
  }

  /* ══ v15 · FEHLENDE BILDTAFEL NACHREICHEN ═════════════════════════════════════════════════
     GEMESSEN (Prüfstand 11.09., hier nachgemessen 12.09.): `orc_texture_A` hat keine `map` — die
     .glb zeigt ins Leere, während das Bild eine Ordnerstufe höher in `textures/` liegt. KayKit
     benennt Material und Bild gleich, daraus wird die Suche. Kein Raten: was nicht gefunden wird,
     bleibt weiß, und jeder Fehlversuch steht in der Konsole. */
  async _repairTextures(modelPath) {
    const T = this.THREE, seg = modelPath.split('/');
    const bases = [seg.slice(0, -1), seg.slice(0, -2), seg.slice(0, -3)].filter((a) => a.length).map((a) => a.join('/') + '/');
    const need = new Map();
    this.figure.traverse((m) => {
      if (!m.isMesh && !m.isSkinnedMesh) return;
      [].concat(m.material).forEach((mat) => {
        if (mat && !mat.map && mat.name && /texture|_A$|_B$/i.test(mat.name)) {
          if (!need.has(mat.name)) need.set(mat.name, []);
          need.get(mat.name).push(mat);
        }
      });
    });
    if (!need.size) return;
    this._tex = this._tex || new T.TextureLoader();
    const grab = (url) => new Promise((res) => this._tex.load(url, res, undefined, () => res(null)));
    for (const [name, mats] of need) {
      let tex = null;
      outer: for (const pack of bases) {
        for (const d of ['textures/', '', 'texture/', 'gltf/']) {
          tex = await grab(this.assets.raw(pack + d + name + '.png'));
          if (tex) { this.log('Textur nachgereicht: ' + pack + d + name + '.png'); break outer; }
        }
      }
      if (!tex) { this.log('keine Textur für Material ' + name); continue; }
      tex.colorSpace = T.SRGBColorSpace; tex.flipY = false;
      tex.magFilter = T.NearestFilter; tex.minFilter = T.LinearMipmapLinearFilter;
      for (const mat of mats) { mat.map = tex; mat.needsUpdate = true; }
    }
  }
  setSkinMode(m) { this._tintHost(m); return this.skinMode; }
  /** Hände: `'skin'` — der Handknochen trägt Haut · `'gloves'` — er trägt Stoff, also kein Hautanteil. */
  setHands(k) { this.handsAre = k === 'gloves' ? 'gloves' : 'skin'; this._tintHost(this.skinMode === 'off' ? 'skin' : this.skinMode); return this.handsAre; }
  setSkinColor(hex) { this.skinColor = hex == null ? null : hex; this._tintHost(this.skinMode); return this._skinColorHex(); }
  setTint(on, hex) { if (hex != null) this.tintTarget = hex; this._tintHost(on ? this.skinMode === 'off' ? 'skin' : this.skinMode : 'off'); if (this.rig && hex != null) this.rig.setBaseColor(hex); }

  /* Georgs Halsregler. GEMESSEN: FrizzleBobs Schädel ist unten offen (478 Randkanten) — der Hals
     des Wirts steckt also im Loch, statt gegen eine Wand zu stoßen. Die Zahl ist ein ANTEIL der
     gemessenen Wirts-Kopfhöhe, kein Maß in Einheiten. */
  setNeck(v) { this.neck = +v || 0; if (this._graft) this._graft.setPlace({ dy: this.neck }); return this.neck; }
  setHeadScale(v) { this.headScale = +v || 1; if (this._graft) this._graft.setPlace({ size: this.headScale }); return this.headScale; }
  graftReport() { return this._graft ? this._graft.report : null; }

  _disposeGraft() {
    this._undoTint();
    if (this._graft) { try { this._graft.dispose(); } catch (e) {} this._graft = null; }
    if (this._fh) { try { this._fh.dispose(); } catch (e) {} this._fh = null; }
    this.faceInner = null; this.faceBox = null;
  }
  dispose() { this._disposeGraft(); super.dispose(); }
}
