/**
 * arena-ring.v1.js — die Karte als Kampfring.
 *
 * @kfb name        Arena-Ring, KFB-Karte mit Kanon-Tusche als Kampffläche
 * @kfb category    stage
 * @kfb capability  three@0.160
 * @kfb capability  assets
 * @kfb capability  clock
 * @kfb capability  rng
 * @kfb view        3d
 * @kfb determinism seeded
 * @kfb since       combat-arena v1 (CA-2)
 *
 * Herkunft: `podcast-v1/stage.v1.js` inkedSheet Z. 52–83 (Papier auf Silhouette geclippt, Kanon-
 * Feder darüber) — importiert, nicht nachgebaut; die Feder ist `cardbuilder/kfb-ink-canon.js`.
 * Naht: die Karte liegt FLACH (Querformat, Kamera 40–50° darüber, wie Boxel Blitz), schwebt mit
 * langsamer Atmung, wirft Schatten auf nichts (sie ist der Boden) und empfängt die der Kämpfer.
 * Ebenen: jede geclearte Karte bleibt als Etage darunter stehen (Level = Stapel nach oben).
 */
import { inkedSheet } from '../podcast-v1/stage.v1.js';
/* `?v=` am Import: der Browser lieferte den Builder aus dem Cache, während die Datei schon den
   Puffer-Fix trug (gemessen 06.09.: Seite lief weiter in die 25-s-Frist). Bei Änderungen erhöhen. */
import { createCardBuilder } from '../cardbuilder/kfb-card-builder.js?v=21-wellen';

/* ⚠ DIE TUSCHE IST EINE ZAHL, UND ZWAR GENAU EINE (Kanon ' + #1f1a14 + '). Sie stand an drei Stellen im
   Modul: der Beschnittrahmen führte den Kanon, der Kartenkörper und das Feld führten reines
   0x000000. Gemessen quer über die linke Kante (924 × 540, dpr 2, y 297):
       31,26,20 (Rahmen, 4 px) → **0,0,0 (Körper, 5,5 px)** → 31,26,20 (Kartentusche, 7,5 px)
   Also genau das Muster, das §45 für beseitigt erklärt hatte — nur eine Schicht tiefer. Der A/B
   beweist es: blendet man den Körper aus, verschwindet das schwarze Band und der Gutter scheint
   durch (40,84,106 an derselben Stelle).
   Merksatz: eine Farbe, die dreimal getippt wird, ist drei Farben. */
export const INK = 0x000000;
/* ⚠ NACHTRAG 06.09., Georgs Bild: »farbverschiebung / kein schwarz zwischen outline und card«.
   Der Kanon-Ton #1f1a14 ist ein sehr dunkles BRAUN (31,26,20). Auf Papier liest er als Tusche —
   am Kartenrand, gegen den blauen Halbton und über die ganze Kantenlänge, liest er als brauner
   Balken. Georg hat das jetzt zum dritten Mal gemeldet, und beide Male, die ich es auf den Kanon
   gestellt habe, kam derselbe Befund zurück.
   Also: die AUSSENKANTE ist reines Schwarz. Das widerspricht dem Kanon nicht — es ist derselbe
   Unterschied wie zwischen einer gedruckten Fläche und einer Kante gegen Licht.
   Und weil es jetzt wieder EINE Farbe an EINEM Ort ist (Rahmen, Kartenkörper, Feldkörper), kann
   der Saum aus §45/§48 nicht zurückkommen: ein Saum braucht zwei Töne.
   RÜCKWEG auf den Kanon: eine Zahl hier. */

export const SPEC = {
  card: { w: 9.0, aspect: 88 / 63, thickness: 0.06 },   // zurück auf 0,06: gemeint war die Kante, nicht das Blatt   // Querformat: Breite 9, Tiefe 9/1,397 = 6,44
  float: { amp: 0.035, period: 5.2 },
  storey: 3.2,                                            // eine Etage höher
  backside: 'media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png',   // lokal im Projekt
  page: { w: 1408, h: 1008 },
  /* ZWEI ACHSEN, nicht eine (Georg 06.09.: »wenn ich auf 18 × 10 gehe und als Karte ein Viertel
     eingestellt habe, wird die komplette Page angezeigt« — mein Fehler, ich hatte Fläche und Motiv
     in EINEN Knopf gepackt):
       `breite`  wie groß das Spielfeld in Welt-Einheiten ist — 9, 18 oder 36 u
       `motiv`   was darauf liegt — 'karte' (ein Viertel), 'seite' (2×2 Karten), 'seiten' (4 Seiten)
     Beides ist frei kombinierbar: eine EINZELNE Karte auf 18 u ist ein doppelt so großes Feld mit
     demselben Bild, nicht mehr Bild. Was das kostet, sagt die Schärfe: der PDF-Schnitt gibt bei
     4096 px Höchstmaß (WebGL-Grenze) 2048 px für eine Karte — auf 9 u sind das 167 px/u, auf 18 u
     nur 114. Genau diese Zahl steht im Prüfblatt. */
  feld: { viertel: 9, seite: 18, vier: 36 },
  pageRes: 3000,
  /* Seitenverhältnis EINER PDF-Seite, gemessen 06.09. an `SONIC_WARFARE_Music_History_01`:
     745 × 416 pt = 1,791. Nicht der Kartenkanon (1,397) — das ist das Verhältnis EINER Zelle nach
     Beschnitt. Das Feld startet mit diesem Wert und wird an der geladenen Seite nachgemessen. */
  pageAR: 745 / 416,
};

export default class ArenaRing {
  /* Wie lange auf ein Artwork gewartet wird, bevor die Bühne weitergeht. 7 s ist am Bild gewählt:
     die Decks, die antworten, lieferten in dieser Sitzung nach 2–4 s. */
  KUNSTFRIST = 7000;
  static describe() { return { name: 'ArenaRing', capabilities: ['three@0.160', 'assets', 'clock', 'rng'], view: '3d', determinism: 'seeded', spec: SPEC }; }
  async init(ctx) { this.THREE = ctx.three; this.assets = ctx.assets; this.rng = ctx.rng; this.log = (s) => (ctx.log || console.info)('[ring] ' + s); this.level = 0; this.cards = []; this.t = 0; this._bob = 0; this.useDeck = true; this.modus = 'viertel'; this.breite = SPEC.card.w; this.motiv = 'karte'; this.pxPerU = null; }   // _bob = 0: floorY() vor dem ersten update() war NaN → Kamera und Spieler-Wurzel NaN (gemessen bei gedrosseltem rAF)

  /* Echte Karte: `createCardBuilder` ist der Einstiegspunkt (Gründungsdokument §3.1, Embed-Bundle v3).
     Text-Blatt sofort, Artwork aus dem Deck-PDF schiebt sich nach — die Regel des Builders. Der Pool
     wird EINMAL gemischt (rng des Wirts, nicht Math.random), je Level die nächste Karte. */
  async _deck() {
    if (this.pool) return this.pool;
    try {
      /* `params:` ist Pflicht, nicht Geschmack: der Builder mischt nur `opts.params` in seine
         Parameter (Zeile ~108). Ein `pdfRes` direkt am Wurzel-Objekt landete NIRGENDS — der Schnitt
         blieb bei 1500 px Seitenbreite, also 83,3 px/u gegen 166,7 der Seite (Kritiker 06.09.).
         3000 px ist Gleichstand: eine Karte ist ein Viertel der Seite, ihr Schnitt halb so breit. */
      this.cb = createCardBuilder({ THREE: this.THREE, params: { pdfRes: 3000,
        /* ⚠ DER WARTEZUSTAND GEHÖRT DEM BUILDER (Georg 07.09.: »die KFB backside zeigt noch eine
           vollständige outline — das zeigt auch, dass die outline falsch gebaut ist«). Richtig:
           unser eigener Deckel war ein RECHTECK über einer unregelmäßigen Karte. Der Builder kennt
           die Rückseite als Wartezustand (`backUrl` → `backSheetTexture`) und stanzt sie in
           DIESELBE Kontur wie das Blatt — ein Bauteil weniger und die richtige Silhouette.
           Merksatz: wer einen Wartezustand selbst baut, baut ihn in der falschen Form. */
        backUrl: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/' + SPEC.backside
      } });
      const pool = await this.cb.pool();
      const a = pool.filter((c) => !c.front && !c.blank); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(this.rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      this.pool = a; this.log('deck pool ' + a.length + ' cards, shuffled with host rng');
    } catch (e) { this.pool = []; this.log('card builder unavailable: ' + e.message + ' — backside sheet instead'); }
    return this.pool;
  }

  mount(parent) {
    this.parent = parent;
    this.group = new this.THREE.Group(); this.group.name = 'arena-ring';
    parent.add(this.group);
    this.ready = Promise.all([this._loadBackside(), this._deck()]).then(() => this.newCard(0));
    return this.group;
  }
  /* ⚠ DIE RÜCKSEITE IST DER WARTEZUSTAND, ALSO DARF SIE NICHT FEHLEN. Gemessen 06.09.:
     »[ring] backside not loaded — paper only« — die Datei liegt NICHT im Projekt
     (`media/kfb/…` gibt es hier nicht), also lief jede Karte ohne sie. Jetzt zwei Wege:
     erst lokal, dann über RAW aus dem Repo (dieselbe Kette, die die Module benutzen).
     Georg 06.09.: »es sollen niemals karten-texte oder platzhalter angezeigt werden, sondern immer
     die KFB card backside, falls die karte noch nicht (vor!)geladen wurde.« */
  async _loadBackside() {
    const quellen = [new URL('./' + SPEC.backside, document.baseURI).href,
                     'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/' + SPEC.backside];
    for (const src of quellen) {
      const img2 = new Image(); img2.crossOrigin = 'anonymous';
      const ok = await new Promise((j) => { img2.onload = () => j(true); img2.onerror = () => j(false); img2.src = src; });
      if (ok && img2.width) { this.backImg = img2; this.log('backside ' + img2.width + '×' + img2.height + ' from ' + (src.indexOf('raw.') > 0 ? 'repo' : 'project')); return this.backImg; }
    }
    this.log('backside not loaded from either source');
    const img = new Image(); img.crossOrigin = 'anonymous';
    await new Promise((ok, no) => { img.onload = ok; img.onerror = () => no(new Error('backside png')); img.src = new URL('./' + SPEC.backside, document.baseURI).href; }).catch((e) => { this.backImg = null; this.log('backside not loaded — paper only'); });
    if (img.width) this.backImg = img;
  }
  /* Deckel mit der Rückseite. Unbeleuchtet wie das Kartenblatt (`toneMapped:false`) — sonst wäre er
     das dritte Material mit eigener Helligkeit auf derselben Fläche (§24a). */
  _deckelAuf(sheet, w, d) {
    const T = this.THREE;
    if (!sheet || sheet.userData.deckel) return null;
    const c = document.createElement('canvas');
    c.width = 1024; c.height = Math.max(64, Math.round(1024 * d / w));
    const g = c.getContext('2d');
    g.fillStyle = '#f2e9d2'; g.fillRect(0, 0, c.width, c.height);
    if (this.backImg) {
      const s = Math.max(c.width / this.backImg.width, c.height / this.backImg.height);
      const bw = this.backImg.width * s, bh = this.backImg.height * s;
      g.drawImage(this.backImg, (c.width - bw) / 2, (c.height - bh) / 2, bw, bh);
    }
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    const m = new T.Mesh(new T.PlaneGeometry(w, d), new T.MeshBasicMaterial({ map: tex, toneMapped: false }));
    m.position.z = 0.004; m.renderOrder = 3; m.name = 'karten-deckel';
    sheet.add(m);
    sheet.userData.deckel = m;
    return m;
  }

  /* Vier Streifen statt einer Ringgeometrie: ein Rahmen aus Rechtecken hat keine Naht in der Mitte
     und kostet vier Zeichenaufrufe im Pool des Blattes. `einzug` ist ein ANTEIL, nicht eine Zahl in
     Welteinheiten — sonst wäre er auf 9 u doppelt so breit wie auf 18 u. */
  _schnittRahmen(sheet, w, d, einzug) {
    const T = this.THREE;
    if (!sheet || sheet.userData.schnitt) return null;
    /* Georg 06.09.: »outline ist (in der summe) zu dick«. Der Rahmen ist nur noch die halbe Zahl —
       der Körper darunter trägt die andere Hälfte. Regler `beschnitt` in den Tweaks. */
    /* Drei Befunde von Georg, einer nach dem anderen: 2 % »zu dick« · 0,3 % »zu dünn« · 0,9 % wieder
       »zu dick« (an der KFB-Rückseite gesehen). Das Fenster ist also 0,3–0,9; 0,6 % = 0,108 u auf
       18 u. Weiter feinstellen tue ich nicht am Zahlenstrahl — der Regler `beschnitt` liegt in den
       Tweaks, und die Entscheidung gehört ans Bild. */
    /* Vier Befunde von Georg: 2 % zu dick · 0,3 % zu dünn · 0,9 % zu dick · 0,6 % »ca 1/3 zu dick«.
       Der letzte ist der einzige mit einer ZAHL darin, also wird sie genommen: 0,6 × 2/3 = **0,4 %**
       = 0,072 u auf 18 u. Der zweite Träger geht denselben Weg (0,030 → 0,020 u), sonst schrumpft
       nur die Hälfte der Kante. */
    const e = Math.max(0.001, einzug || 0.004);
    const bx = w * e, bz = d * e;
    /* ⚠ SCHWARZ, NICHT KANON-TUSCHE (Georg 06.09., zweimal: »ink outline ist nicht schwarz«).
       Der Kanon-Ton #1f1a14 ist ein sehr dunkles BRAUN (31,26,20) — auf dem Papier liest er als
       Tusche, aber am Kartenrand gegen den hellen Halbton liest er grau-braun. Hier gilt sein Auge:
       reines Schwarz. RÜCKWEG auf den Kanon: 0x000000 → 0x1f1a14. */
    /* ⚠ HIER SASS GEORGS »GRAUE LINIE ZWISCHEN KARTE UND INK OUTLINE« — und sie war kein Spalt,
       sondern ein FARBUNTERSCHIED ZWISCHEN ZWEI SCHWARZ. Gemessen 06.09. quer über die Kante
       (Bildpuffer, y 335):
           x 113–120   0,0,0        ← dieser Rahmen, reines Schwarz
           x 121–132   31,26,20     ← die Tuschekante DER KARTE selbst = #1f1a14 (KFB-Kanon)
           x 133–153   1,1,1        ← die dunkelste Linie des Artworks
           x 154+      Artwork
       Ein 11 Bildpunkte breites #1f1a14 zwischen zwei fast reinen Schwarz liest als grauer Saum —
       genau der Streifen im Screenshot. Georgs Verdacht »evtl. liegt das an der Karte« war richtig:
       die Karte bringt ihre eigene Tusche mit, und die ist Kanon-Tusche, nicht Schwarz.
       Also bekommt der Rahmen DIESELBE Tusche. Georgs Auftrag »dazu schwarze ink« ist damit erfüllt:
       #1f1a14 IST die schwarze Tusche des Kanons — reines 0x000000 war der Ausreißer, der den Saum
       überhaupt erst erzeugt hat.
       Merksatz: zwei Schwarz nebeneinander ergeben eine graue Linie. */
    const mat = new T.MeshBasicMaterial({ color: INK, toneMapped: false });
    const grp = new T.Group(); grp.name = 'schnitt-rahmen';
    const teil = (bw, bh, px, py) => { const m = new T.Mesh(new T.PlaneGeometry(bw, bh), mat); m.position.set(px, py, 0.005); grp.add(m); };
    teil(w, bz, 0, d / 2 - bz / 2);          // oben
    teil(w, bz, 0, -d / 2 + bz / 2);         // unten
    teil(bx, d, -w / 2 + bx / 2, 0);         // links
    teil(bx, d, w / 2 - bx / 2, 0);          // rechts
    grp.renderOrder = 5;                      // ÜBER dem Rückseiten-Deckel (z 0,004): der Beschnitt
                                              // gilt auch im Wartezustand — sonst blitzt die Kante
                                              // genau so lange, wie das Artwork braucht
    sheet.add(grp);
    sheet.userData.schnitt = grp;
    this.log('crop inset ' + (e * 100).toFixed(0) + ' % in ink · ' + bx.toFixed(3) + ' × ' + bz.toFixed(3) + ' u');
    return grp;
  }

  /* Alle Texturen eines Kartenknotens auf die Abtastrate der Grafikkarte stellen — EIN Ort, zwei
     Aufrufer: beim Bauen (Textblatt, Rückseiten-Deckel) und in `onArt` (das echte Artwork und die
     Tuscheschicht darüber). Wer nur beim Bauen stellt, stellt die Hälfte.
     Merksatz: was später ausgetauscht wird, muss später nochmal gestellt werden. */
  _scharf(knoten) {
    const a = this.maxAniso || 8;
    let n = 0;
    (knoten || this.current || this.group).traverse((m) => {
      const mats = m.material ? [].concat(m.material) : [];
      for (const mm of mats) {
        if (!mm) continue;
        for (const k of ['map', 'alphaMap', 'emissiveMap', 'roughnessMap', 'normalMap']) {
          const t = mm[k];
          if (t && t.anisotropy !== a) { t.anisotropy = a; t.needsUpdate = true; n++; }
        }
      }
    });
    return n;
  }

  _deckelWeg(sheet) {
    const m = sheet && sheet.userData && sheet.userData.deckel;
    if (!m) return false;
    if (m.material) { if (m.material.map) m.material.map.dispose(); m.material.dispose(); }
    if (m.geometry) m.geometry.dispose();
    (m.parent || sheet).remove(m);
    sheet.userData.deckel = null;
    return true;
  }

  /* ── DIE KANTE NACH KANON ──────────────────────────────────────────────────────────────────
     Zwei Methoden, eine Kontur. Beide lesen die Kontur, die die KARTE benutzt hat (Preset + Seed
     + Blattformat) — nicht eine zweite, die daneben gerechnet wird.

     `_kanteVerstaerken` — die Tusche der Karte mit dickerer Feder auf DERSELBEN Kontur neu
     zeichnen (`drawInk(..., gain)`). Der Vorgänger dieser Zeile war ein Rechteck-Rahmen über den
     äußeren 0,4 %: er sollte die helle Papierkante zudecken, die der PDF-Schnitt außerhalb der
     Kartentusche stehen lässt. Eine dickere Feder auf der richtigen Kurve tut dasselbe, ohne eine
     zweite Form zu erfinden. Regler `inkGain` (1 = die Karte, wie der Builder sie zeichnet).

     `_traeger` — zwei Blätter in der Silhouette der Karte statt eines Kastens: Tusche als Träger
     (damit hinter jeder Zacke Tusche steht und keine beleuchtete Papierkante durchblitzt) und die
     KFB-Rückseite darunter, nur von unten sichtbar (`BackSide`). Beide tragen die `alphaMap` DER
     KARTE — die Maske des Builders, nicht eine nachgebaute. */
  _kanteVerstaerken(rec) {
    const T = this.THREE, cb = this.cb;
    if (!rec || !rec.dmat || !cb || !cb.ink || !cb.params) return null;
    const gain = this.inkGain != null ? this.inkGain : 1.3;
    if (!(gain > 1.001)) return null;                       // 1 = Kanon pur, nichts zu tun
    const preset = cb.params.preset || 'card';
    const W = cb.params.decalRes || 1536, ar = cb.params.aspect || 1.794;
    const H = Math.round(W / ar);
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    cb.ink.drawInk(preset, c.getContext('2d'), cb.ink.contour(preset, rec.seed, W, H), W, H, rec.seed, gain);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = this.maxAniso || 8;
    /* NICHT `dispose()` auf die alte Textur: die Decal-Textur ist im Builder je Seed GETEILT (vier
       Seeds für beliebig viele Karten). Wer sie hier entsorgt, löscht die Kante der Nachbarkarte.
       Also nur die Referenz tauschen. */
    rec.dmat.map = tex; rec.dmat.needsUpdate = true;
    this.log('ink outline · Kanon-Kontur, Feder ×' + gain.toFixed(2) + ' · ' + W + ' × ' + H + ' px');
    return tex;
  }

  _traeger(rec, w, d) {
    const T = this.THREE;
    if (!rec || !rec.group || !rec.mat) return null;
    const maske = rec.mat.alphaMap || null;
    const grp = new T.Group(); grp.name = 'karten-traeger';
    const tr = new T.Mesh(new T.PlaneGeometry(w, d), new T.MeshBasicMaterial({
      color: INK, alphaMap: maske, alphaTest: 0.5, toneMapped: false, side: T.DoubleSide
    }));
    tr.position.z = -0.014; tr.castShadow = true;
    grp.add(tr);
    const rueck = new T.Mesh(new T.PlaneGeometry(w, d), new T.MeshBasicMaterial({
      map: this._backTex(), alphaMap: maske, alphaTest: 0.5, toneMapped: false, side: T.BackSide
    }));
    rueck.position.z = -0.030;
    grp.add(rueck);
    rec.group.add(grp);
    return grp;
  }

  /** Die KFB-Rückseite als Textur, EINMAL geladen und geteilt (über RAW, wie alle Assets). */
  _backTex() {
    if (this._backT !== undefined) return this._backT;
    const T = this.THREE;
    const tl = new T.TextureLoader(); tl.setCrossOrigin('anonymous');
    this._backT = tl.load('https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/' + SPEC.backside,
      (t) => { t.colorSpace = T.SRGBColorSpace; t.center.set(0.5, 0.5); t.rotation = Math.PI / 2; t.anisotropy = 4; this.log('backside texture loaded'); },
      undefined, () => this.log('backside texture unreachable'));
    return this._backT;
  }

  /* Eine Seite im Querformat: Papier, Rückseiten-Grafik gedreht, Level-Stempel. Danach die Feder. */
  _page(level, seed) {
    const c = document.createElement('canvas'); c.width = SPEC.page.w; c.height = SPEC.page.h;
    const g = c.getContext('2d');
    g.fillStyle = '#f2e9d2'; g.fillRect(0, 0, c.width, c.height);
    if (this.backImg) {
      g.save(); g.translate(c.width / 2, c.height / 2); g.rotate(Math.PI / 2);
      const s = Math.min(c.height / this.backImg.width, c.width / this.backImg.height) * 0.94;
      g.globalAlpha = 0.92; g.drawImage(this.backImg, -this.backImg.width * s / 2, -this.backImg.height * s / 2, this.backImg.width * s, this.backImg.height * s);
      g.restore();
    }
    g.fillStyle = 'rgba(31,26,20,0.85)'; g.font = '700 54px "Bangers", "Space Grotesk", sans-serif'; g.textAlign = 'left';
    g.fillText('LEVEL ' + (level + 1), 70, 100);
    g.font = '600 26px "Space Grotesk", sans-serif'; g.fillText('seed ' + seed, 72, 138);
    return c;
  }
  /** Neue Karte auf Etage `level`; die alte bleibt als Stockwerk darunter. */
  /* `versuch` ist das Budget — als ARGUMENT, nicht als Feld. Als Feld war es zweimal falsch: erst
     ringweit (nach drei Fehlschlägen gab jede weitere Karte sofort auf), dann je Karte am Anfang
     genullt — und weil der Wiederholungsversuch `newCard` RUFT, löschte jeder Versuch den Zähler,
     den er gerade erhöht hatte: unendliche Schleife alle 7 s, und der Aufgabe-Zweig war toter Code.
     Ein Wert, der eine Rekursion überleben muss, gehört in den Aufruf. Das Feld bleibt nur als
     Anzeige für das Prüfblatt.
     Merksatz: wer einen Zähler dort zurücksetzt, wo die Wiederholung eintritt, zählt nie. */
  newCard(level, versuch = 0) {
    if (this.motiv !== 'karte') return this._feldSeiten(level);
    const T = this.THREE, seed = 7 + level * 13;
    const w = this.breite;
    /* Schärfe folgt der Fläche: ein Kartenschnitt ist halb so breit wie die Seite, also braucht ein
       größeres Feld eine größere Seite. 4096 px ist die WebGL-Grenze und damit das Dach. */
    /* Bau-Nummer: `onArt` kommt asynchron zurück, auch für eine Karte, die es nicht mehr gibt.
       Gemessen 06.09.: nach dem Wechsel 9 u → 18 u schrieb das späte `onArt` der verworfenen
       9-u-Karte seinen Schnitt (1530 px) auf das neue Feld — 85 px/u statt 113,8. Ein Messwert von
       gestern ist schlimmer als keiner, also zählt nur, wer noch der aktuelle Bau ist. */
    /* ⚠ EIN BUDGET, DAS NIE ZURÜCKGESETZT WIRD, IST EINE EINMALIGE ERLAUBNIS. `_versuche` zählte
       ringweit hoch und wurde nur bei Erfolg genullt: nach drei Fehlschlägen an EINER Karte stand
       der Zähler auf 4, und **jede weitere Karte** fiel sofort in die Aufgabe, ohne einen einzigen
       Versuch (gemessen: `ring._versuche === 4`, festgefahren).
       Merksatz: ein Zähler pro Vorgang gehört an den Anfang des Vorgangs. */
    this._versuche = versuch;
    const bau = (this._bau = (this._bau || 0) + 1);
    if (this.cb) this.cb.setParams({ pdfRes: Math.min(4096, Math.round(w * 2 * 170)) });
    let sheet, d, title = null, rec = null;
    /* STARTKARTE ZUM TESTEN (Georg 06.09.: »jetzt schon bei jedem start eine zufällige karte laden
       zum testen«). Der Pool wird weiter mit dem Wirt-RNG gemischt, also ist die REIHENFOLGE
       deterministisch; nur der Einstiegspunkt wandert. `startIndex` setzt der Integrator und
       schreibt ihn ins Protokoll — damit ist ein Lauf reproduzierbar, obwohl er zufällig anfängt. */
    const off = (this.startIndex || 0);
    const c0 = this.useDeck && this.pool && this.pool.length ? this.pool[(level + off) % this.pool.length] : null;
    if (c0) {
      /* Die gespielte Karte merken: der Zylinder-Himmel (S13) braucht ihr Deck und ihre Zellnummer,
         um die NACHBARN derselben Seite an den Horizont zu hängen — und die Seite steht dann schon
         im Cache des Builders. Ohne diese Zeile müsste er im Pool danach suchen. */
      this.karte = c0;
      rec = this.cb.make(c0, { width: w, seed: [7, 23, 41, 59][level % 4], onArt: () => {
        if (bau !== this._bau) return;   // Karte von gestern — ihre Zahl gehört nicht hierher
        clearTimeout(this._frist);
        this._versuche = 0;                       // Erfolg: das Budget der nächsten Karte beginnt wieder bei 0
        const cr = this.cb.lastCrop;
        if (cr && cr.cw) this.pxPerU = +(cr.cw / w).toFixed(1);
        this._deckelWeg(sheet);
        /* Jetzt sind die echten Texturen da — also jetzt nachstellen (siehe `_scharf`). */
        const n = this._scharf(this.current);
        this.log('artwork arrived: ' + (n ? n + ' Texturen auf Aniso ' + (this.maxAniso || 8) + ' · ' : '') + c0.title + (this.pxPerU ? ' · ' + this.pxPerU + ' px/u' : ''));
      } });
      /* ⚠ DAS WARTEN BRAUCHT EINE FRIST. `_deckelWeg` hing an EINEM Rückruf: kommt das Artwork nie,
         liegt die Rückseite für immer oben — gemessen 06.09. (Kritiker) **90+ Sekunden**
         `artState "lädt"`, Deckel drauf, und die Arena spielte auf der Kaffeefleck-Rückseite. Kein
         Konsolenfehler, kein Protokolleintrag: ein Wartezustand, der nie endet, sieht aus wie ein
         Wartezustand.
         Der zufällige Einstiegspunkt (§45) hat das erst sichtbar gemacht — er landet irgendwo in
         6109 Karten, und nicht jedes Deck-PDF antwortet.
         Zwei Stufen, beide protokolliert: erst die NÄCHSTE Karte versuchen (bis zu drei Mal, der
         Stapel ist groß genug), dann den Deckel abnehmen und das Textblatt des Builders stehen
         lassen — es ist die Karte, nur ohne Bild. Nie stillstehen.
         Merksatz: ein Rückruf ohne Frist ist ein Versprechen ohne Termin. */
      clearTimeout(this._frist);
      this._frist = setTimeout(() => {
        if (bau !== this._bau) return;
        /* ⚠ DIE FRIST FRAGT JETZT DEN BUILDER, NICHT UNSEREN DECKEL. Solange der Deckel unser
           Bauteil war, hing die Wiederholung an `sheet.userData.deckel`; ohne ihn wäre die
           Bedingung für immer falsch und die Frist toter Code (dieselbe Klasse wie der
           Versuchszähler, der sich selbst zurücksetzte). `artState` ist die Auskunft des Builders. */
        if (!rec || rec.artState === 'artwork' || rec.artState === 'extern') return;   // Artwork war schneller
        const n = versuch + 1;
        this._versuche = n;
        if (n <= 3) {
          this.log('artwork timeout (' + this.KUNSTFRIST / 1000 + ' s) · ' + c0.title + ' → nächste Karte, Versuch ' + n);
          const alt = this.cards.pop();
          if (alt) { if (alt.userData.rec) alt.userData.rec.dispose(); this.group.remove(alt); }
          this.startIndex = (this.startIndex || 0) + 1;
          this.newCard(level, n);
        } else {
          /* ⚠ NICHT DEN DECKEL ABNEHMEN. Darunter liegt das WARTEBLATT des Builders — leeres
             Papier mit Tuschekante, kein Text, kein Bild (gemessen: `artState "lädt"`, Grundkarte
             1024×589 + Tusche 1536×883, sonst nichts). Genau das steht drei Zeilen weiter oben als
             das, was niemand sehen darf, und §50 hat behauptet, es sei »die Karte, nur ohne Bild«.
             War es nie.
             Die KFB-Rückseite ist dagegen ein GESTALTETER Wartezustand: sie sagt »hier liegt eine
             Karte, sie ist noch verdeckt«. Also bleibt sie liegen, und das Protokoll sagt es.
             Merksatz: wenn beide Ausgänge schlecht sind, nimm den, der gestaltet ist. */
          this.log('artwork timeout · nach 3 Versuchen bleibt die Rückseite liegen (' + c0.title + ')');
        }
      }, this.KUNSTFRIST);
      d = rec.height; sheet = rec.group; title = c0.title + ' · ' + (c0.deck || c0.packId || '');
      /* DIE KANTE IST DIE KANTE DER KARTE — EINE KONTUR, EINE TUSCHE (Kanon, `kfb-card-builder.js`:
         »Fläche und Tusche teilen EINE Kontur. Zwei getrennt gerechnete Konturen ergeben zwei
         Kanten mit einer Lücke dazwischen«).
         Weg ist damit: unser Rechteck-Rahmen (`_schnittRahmen`), unser Rechteck-Deckel
         (`_deckelAuf`) und der Rechteck-Körper (BoxGeometry). Statt dessen wird die Tusche der
         Karte VERSTÄRKT (dieselbe Kontur, dickere Feder) und darunter liegen zwei Blätter in
         derselben Silhouette. Vier Anläufe an dieser Kante (LIVING §45/§47/§48/§49) waren Politur
         an der falschen Geometrie — ein Rahmen um ein Rechteck kann eine gezeichnete Karte nicht
         treffen. */
      this._kanteVerstaerken(rec);
      this._traeger(rec, w, d);
      /* Wartezustand und Kante gehören jetzt der Karte selbst (siehe `_kanteVerstaerken`/`_traeger`
         oben und `backUrl` in `_deck`). Was hier stand — Rechteck-Deckel und Rechteck-Rahmen —
         war das eigentliche Kantenproblem, nicht seine Lösung. */
      sheet.traverse((m) => { if (m.isMesh) m.receiveShadow = true; });
      /* ⚠ DIE »NICHT-SCHWARZE LINIE« IST EINE FILTERKANTE, KEINE GEOMETRIE (Georg 06.09., vierter
         Anlauf an derselben Kante — und die ersten drei haben Geometrie und Farbe geprüft, weil
         das die naheliegenden Verdächtigen waren).
         Was im Bild zu sehen ist: ein WEICHER Verlauf von Creme über Grau nach Schwarz, nur an der
         Kante, nur bei flachem Blick. Geometrie macht harte Kanten, Farbe macht Sprünge — ein
         Verlauf über mehrere Pixel kommt von der Textur-Abtastung. Bei streifendem Blick greift
         three auf eine gröbere Mip-Stufe zurück, und in der ist der äußerste Bildpunkt der Karte
         bereits ein Mittelwert aus cremefarbenem Papier und schwarzer Tusche: Grau.
         Anisotrope Filterung ist genau das Gegenmittel — sie tastet in Blickrichtung länglich ab,
         statt quadratisch zu mitteln. Der Wert kommt von der GRAFIKKARTE (`getMaxAnisotropy`,
         typisch 16), nicht aus einer geratenen Konstante.
         Merksatz: ein weicher Übergang ist kein Bauteil, sondern eine Abtastung. */
      this._scharf(sheet);
      /* Das Textblatt ist unbeleuchtet (MeshBasicMaterial, toneMapped:false, wie der Builder es baut) — die
         Kämpfer werfen also keinen Schatten AUF die Karte. Dafür ein Schattenfänger knapp darüber. */
      const sc = new T.Mesh(new T.PlaneGeometry(w * 0.97, d * 0.97), new T.ShadowMaterial({ opacity: 0.3, transparent: true, depthWrite: false }));
      sc.position.z = 0.012; sc.receiveShadow = true; sc.renderOrder = 2; sheet.add(sc);
    } else {
      d = w / SPEC.card.aspect;
      const tex = inkedSheet(T, this._page(level, seed), { seed });
      sheet = new T.Mesh(new T.PlaneGeometry(w, d), new T.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.02, roughness: 0.95, metalness: 0, side: T.DoubleSide }));
      sheet.receiveShadow = true;
    }
    sheet.rotation.x = -Math.PI / 2;
    /* Georg 06.09.: Seiten SCHWARZ wie die Tusche (Kanon #1f1a14), nicht Creme — und die cremefarbene Kante war auch die
       »weiße Blitzer« außen an der Kontur. Körper 0,975 statt 0,985 (Tusche liegt drüber) und 0,02 tiefer: bei −0,002 fochten
       Blatt (y 0) und Deckel um dieselbe Tiefe — das war das Flackern bei Entfernung (z-fight, kein Shader). */
    /* ⚠ TUSCHE IST UNBELEUCHTET (Georg 06.09.: »KFB ink outline wird teilweise grau statt schwarz
       gerendert (licht?)« — ja, Licht). GEMESSEN am geladenen Feld: der Tuschekörper lief als
       `MeshStandardMaterial` mit `toneMapped: true`, das Papier daneben als `MeshBasic` mit
       `toneMapped: false`. Key, Fill und Umgebungslicht (0,35) heben #1f1a14 also an — beleuchtetes
       Schwarz kann nur grauer werden, nie schwärzer. Gedruckte Tusche ist kein Material, das Licht
       fängt; genau das steht 50 Zeilen weiter unten schon für das Papier.
       Schatten WIRFT der Körper weiter (`castShadow` hängt am Mesh, nicht am Material).
       RÜCKWEG: die zwei `MeshBasicMaterial`-Zeilen zurück auf `MeshStandardMaterial`.
       Unterseite = KFB-Rückseite (Georg 06.09.), Seiten Tusche. BoxGeometry-Reihenfolge: +x −x +y −y +z −z → Index 3 ist unten. */
    /* ⚠ HIER STAND EIN RECHTECK UNTER EINER GEZEICHNETEN KARTE: `BoxGeometry(w, thickness, d)`,
       Seiten in Tusche, Unterseite = KFB-Rückseite. Das ist die "vollständige outline", die Georg
       am 07.09. gesehen hat — der Kasten ragt an jeder Konturzacke über die Tusche hinaus, und von
       unten rahmt er die Rückseite als sauberes Viereck. Der Kanon (`kfb-card-builder.js`) hat
       KEINEN Körper: eine Karte ist zwei Quads auf einer Kontur.
       Die Tiefe trägt jetzt `_traeger()`: zwei Blätter in DERSELBEN Silhouette (Tusche als Träger,
       Rückseite darunter). `SPEC.card.thickness` ist damit nur noch die Blattdistanz.
       Merksatz: ein Kasten unter einer Kontur ist eine zweite Form — und die gewinnt immer am Rand. */
    const card = new T.Group(); card.add(sheet);
    this._scharf(card);            // jetzt ist auch der Körper (Rückseitenkarte) dabei
    card.position.y = level * SPEC.storey;
    card.userData = { level, seed, w, d, title, rec, modus: 'karte', breite: w, motiv: 'karte' };
    this.group.add(card);
    this.cards.push(card); this.level = level; this.current = card;
    /* Schärfe der Karte in derselben Einheit wie beim Feld: Pixel je Welt-Einheit, aus dem
       Schnitt gelesen (`lastCrop.cw` = Breite des Zuschnitts in Seitenpixeln). */
    const cr = this.cb && this.cb.lastCrop;
    this.pxPerU = cr && cr.cw ? +(cr.cw / w).toFixed(1) : null;   // Vorgriff; der echte Wert kommt in `onArt`
    this.log('card level ' + (level + 1) + ' · ' + w + ' × ' + d.toFixed(2) + ' · ' + (this.pxPerU ? this.pxPerU + ' px/u · ' : '') + (title || 'backside seed ' + seed) + ' · storey y ' + card.position.y.toFixed(2));
    return card;
  }
  /** Bodenhöhe der aktuellen Etage (Welt).
      ⚠ KEIN `+ this._bob`. `update()` schreibt den Hub SCHON in `position.y` — die alte Fassung
      zählte ihn doppelt und gab eine Höhe zurück, die die Karte nie hatte (±0,035 u statt 0).
      Jeder Leser dieser Zahl hing damit auf der halben Periode UNTER dem Papier: der gelbe
      Startring (Georg 06.09.), die Start-Zone und die Zensur-Schicht (Georg 07.09.: »das Schwarz
      verschwindet zwischendurch immer wieder«). Ein Fehler, drei Symptome, eine Zeile.
      Merksatz: wer den Hub zweimal addiert, baut eine zweite Karte, die es nicht gibt. */
  floorY() { return this.current ? this.current.position.y : 0; }

  /* ---------------------------------------------------------------- Feld-Modus (v2)
     Eine oder vier PDF-Seiten als Spielfeld. Papier steht SOFORT (Builder-Regel 1), die
     gerenderte Seite schiebt sich nach — dieselbe Regel wie beim Kartenblatt, nur größer. */
  /** Fläche und Motiv setzen — beide unabhängig, Neubau nur wenn sich etwas ändert. */
  async setFeld({ breite, motiv }) {
    const b = Number(breite != null ? breite : this.breite), m = motiv || this.motiv;   // Zahl erzwingen: Enum-Props kommen als String (Kritiker 06.09.)
    if (b === this.breite && m === this.motiv && this.current) return this.current;
    this.breite = b; this.motiv = m; this.modus = m;
    for (const c of this.cards) { if (c.userData.rec) c.userData.rec.dispose(); this.group.remove(c); }
    this.cards = []; this.current = null; this.pxPerU = null;
    await this._deck();
    return this.newCard(this.level);
  }

  /** Alt (v1-Aufrufer): Modus-Name setzt beide Achsen zusammen. */
  async setModus(m) {
    if (!SPEC.feld[m]) throw new Error('unbekannter Feld-Modus: ' + m);
    return this.setFeld({ breite: SPEC.feld[m], motiv: m === 'viertel' ? 'karte' : (m === 'vier' ? 'seiten' : 'seite') });
  }

  _feldSeiten(level) {
    const T = this.THREE, w = this.breite, n = this.motiv === 'seiten' ? 2 : 1;
    const kw = w / n; let kd = kw / SPEC.pageAR, d = kd * n;
    const seed = 7 + level * 13;
    const feld = new T.Group(); feld.name = 'feld-' + this.modus;
    /* UNBELEUCHTET wie das Kartenblatt. Das Feld hatte MeshStandard — damit clippte das Papier bei
       Exposure 1,10 zu reinem Weiß (gemessen 06.09.: Bildpuffer 255,255,255; Georgs »weißer Kreis«
       und die weiße Fläche im Seitenmodus). Der Builder baut Kartenblätter aus genau diesem Grund
       als MeshBasic mit `toneMapped: false`: gedruckte Tusche ist kein Material, das Licht fängt.
       Schatten der Kämpfer kommen — wie auf der Karte — vom Schattenfänger knapp darüber. */
    const paper = new T.MeshBasicMaterial({ color: 0xe4dcc4, toneMapped: false });
    const tiles = [];
    for (let iy = 0; iy < n; iy++) for (let ix = 0; ix < n; ix++) {
      const mat = paper.clone();
      const tile = new T.Mesh(new T.PlaneGeometry(kw, kd), mat);
      tile.rotation.x = -Math.PI / 2;
      const sc = new T.Mesh(new T.PlaneGeometry(kw, kd), new T.ShadowMaterial({ opacity: 0.3, transparent: true, depthWrite: false }));
      sc.rotation.x = -Math.PI / 2; sc.position.y = 0.012; sc.receiveShadow = true; sc.renderOrder = 2;
      feld.add(sc);
      feld.add(tile); tiles.push({ tile, mat, sc, i: iy * n + ix, ix, iy });
    }
    const inkMat = new T.MeshBasicMaterial({ color: INK, toneMapped: false });
    const body = new T.Mesh(new T.BoxGeometry(w * 0.995, SPEC.card.thickness, d * 0.995), inkMat);
    body.position.y = -SPEC.card.thickness / 2 - 0.02; body.castShadow = true;
    feld.add(body);
    feld.position.y = level * SPEC.storey;
    feld.userData = { level, seed, w, d, title: 'Feld ' + this.motiv, rec: null, modus: this.motiv, breite: w, motiv: this.motiv };
    this.group.add(feld);
    this.cards.push(feld); this.level = level; this.current = feld;

    /* DAS FELD IST DAS BLATT. Die Tiefe kommt aus dem gemessenen Seitenverhältnis der PDF-Seite,
       nicht aus dem Kartenkanon: gemessen 06.09. ist eine Deck-Seite 745 × 416 pt = 1,791, während
       SPEC.card.aspect 1,397 trägt — mit dem falschen Wert stand der Spielrand neben dem Papier.
       Bis die erste Seite da ist, gilt der Kanon als Papier-Platzhalter; danach wird nachgemessen. */
    const legen = () => {
      for (const t of tiles) {
        const x = -w / 2 + kw / 2 + t.ix * kw, z = -d / 2 + kd / 2 + t.iy * kd;
        t.tile.position.set(x, 0, z); t.sc.position.set(x, 0.012, z);
      }
    };
    const nachmessen = (ar) => {
      const nkd = kw / ar;
      if (Math.abs(nkd - kd) < 1e-4) return;
      kd = nkd; d = kd * n;
      for (const t of tiles) {
        t.tile.geometry.dispose(); t.tile.geometry = new T.PlaneGeometry(kw, kd);
        t.sc.geometry.dispose(); t.sc.geometry = new T.PlaneGeometry(kw, kd);
      }
      body.geometry.dispose(); body.geometry = new T.BoxGeometry(w * 0.995, SPEC.card.thickness, d * 0.995);
      feld.userData.d = d;
      legen();
      this.log('Feld nachgemessen: ' + w + ' × ' + d.toFixed(2) + ' u · Seitenverhältnis ' + ar.toFixed(3));
      if (this.onFeld) this.onFeld(feld);
    };
    legen();
    this.log('feld ' + this.motiv + ' · ' + w + ' × ' + d.toFixed(2) + ' u · ' + (n * n) + ' Seite(n) · Papier steht, Seiten laden');
    /* Die Seiten selbst: eine je Kachel, aus dem gemischten Pool. `pageOf` ist die Lesefunktion
       des Builders (ganze Seite, kein Schnitt) — kein zweiter Renderpfad. */
    (async () => {
      const pool = this.pool || [];
      if (!pool.length || !this.cb) return this.log('kein Deck erreichbar — Feld bleibt Papier');
      for (const t of tiles) {
        /* Bis zu fünf Anläufe, dann bleibt diese Kachel Papier. Manche Seiten rendern in dieser
           Umgebung nie (Befund 06.09.) — das darf das Spielfeld nicht kosten, also nächste Karte. */
        let ok = false;
        for (let versuch = 0; versuch < 5 && !ok; versuch++) {
          const karte = pool[(level * n * n + t.i + versuch * 37) % pool.length];
          try {
            const p = await this.cb.pageOf(karte, Math.min(4096, Math.round(kw * 170)));
            if (!p) { this.log('Seite ohne PDF: ' + (karte.packId || '?')); continue; }
            const tex = new T.CanvasTexture(p.canvas);
            tex.colorSpace = T.SRGBColorSpace; tex.anisotropy = 8;
            t.mat.map = tex; t.mat.color.setHex(0xffffff); t.mat.needsUpdate = true;
            nachmessen(p.ar);
            this.pxPerU = +(p.w / kw).toFixed(1);
            feld.userData.title = 'Seite ' + p.seite + ' · ' + p.deck;
            this.log('Seite ' + p.seite + ' · ' + p.deck + ' · ' + p.w + ' × ' + p.h + ' px · ' + this.pxPerU + ' px/u');
            ok = true;
          } catch (e) { this.log('Versuch ' + (versuch + 1) + ' (' + (karte.packId || '?') + '): ' + ((e && e.message) || e)); }
        }
        if (!ok) this.log('Kachel ' + t.i + ' bleibt Papier — fünf Seiten ohne Bild');
      }
    })();
    return feld;
  }

  /** Eine Zeile für das Prüfblatt: was das Feld IST, in Zahlen. */
  zeile() {
    const u = this.current && this.current.userData;
    if (!u) return '[ring] kein Feld';
    return '[ring] ' + (u.motiv || 'karte') + ' auf ' + u.w + ' × ' + (+u.d.toFixed(2)) + ' u · '
      + (this.pxPerU ? this.pxPerU + ' px/u' : 'Papier (lädt)') + ' · Verhältnis '
      + (u.w / u.d).toFixed(3) + ' · ' + (u.title || 'Karte');
  }
  bounds() { const u = this.current.userData; return { x: [-u.w / 2 + 0.6, u.w / 2 - 0.6], z: [-u.d / 2 + 0.5, u.d / 2 - 0.5] }; }
  update(dt) {
    this.t += dt;
    this._bob = Math.sin(this.t * 2 * Math.PI / SPEC.float.period) * SPEC.float.amp;
    this.cards.forEach((c, i) => { c.position.y = c.userData.level * SPEC.storey + this._bob * (i === this.cards.length - 1 ? 1 : 0.4); });
  }
  dispose() { clearTimeout(this._frist); this.cards.forEach((c) => { if (c.userData.rec) c.userData.rec.dispose(); }); if (this.group && this.group.parent) this.group.parent.remove(this.group); this.cards = []; }
}
