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
import { createCardBuilder } from '../cardbuilder/kfb-card-builder.js?v=20';

export const SPEC = {
  card: { w: 9.0, aspect: 88 / 63, thickness: 0.06 },   // Querformat: Breite 9, Tiefe 9/1,397 = 6,44
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
      this.cb = createCardBuilder({ THREE: this.THREE, params: { pdfRes: 3000 } });
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
  async _loadBackside() {
    const img = new Image(); img.crossOrigin = 'anonymous';
    await new Promise((ok, no) => { img.onload = ok; img.onerror = () => no(new Error('backside png')); img.src = new URL('./' + SPEC.backside, document.baseURI).href; }).catch((e) => { this.backImg = null; this.log('backside not loaded — paper only'); });
    if (img.width) this.backImg = img;
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
  newCard(level) {
    if (this.motiv !== 'karte') return this._feldSeiten(level);
    const T = this.THREE, seed = 7 + level * 13;
    const w = this.breite;
    /* Schärfe folgt der Fläche: ein Kartenschnitt ist halb so breit wie die Seite, also braucht ein
       größeres Feld eine größere Seite. 4096 px ist die WebGL-Grenze und damit das Dach. */
    /* Bau-Nummer: `onArt` kommt asynchron zurück, auch für eine Karte, die es nicht mehr gibt.
       Gemessen 06.09.: nach dem Wechsel 9 u → 18 u schrieb das späte `onArt` der verworfenen
       9-u-Karte seinen Schnitt (1530 px) auf das neue Feld — 85 px/u statt 113,8. Ein Messwert von
       gestern ist schlimmer als keiner, also zählt nur, wer noch der aktuelle Bau ist. */
    const bau = (this._bau = (this._bau || 0) + 1);
    if (this.cb) this.cb.setParams({ pdfRes: Math.min(4096, Math.round(w * 2 * 170)) });
    let sheet, d, title = null, rec = null;
    const c0 = this.useDeck && this.pool && this.pool.length ? this.pool[level % this.pool.length] : null;
    if (c0) {
      rec = this.cb.make(c0, { width: w, seed: [7, 23, 41, 59][level % 4], onArt: () => {
        if (bau !== this._bau) return;   // Karte von gestern — ihre Zahl gehört nicht hierher
        const cr = this.cb.lastCrop;
        if (cr && cr.cw) this.pxPerU = +(cr.cw / w).toFixed(1);
        this.log('artwork arrived: ' + c0.title + (this.pxPerU ? ' · ' + this.pxPerU + ' px/u' : ''));
      } });
      d = rec.height; sheet = rec.group; title = c0.title + ' · ' + (c0.deck || c0.packId || '');
      sheet.traverse((m) => { if (m.isMesh) m.receiveShadow = true; });
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
    /* Unterseite = KFB-Rückseite (Georg 06.09.), Seiten Tusche. BoxGeometry-Reihenfolge: +x −x +y −y +z −z → Index 3 ist unten. */
    const inkMat = new T.MeshStandardMaterial({ color: 0x1f1a14, roughness: 0.92, metalness: 0 });
    const backMat = this._backMat || (this._backMat = (() => { const m = new T.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, metalness: 0 }); const tl = new T.TextureLoader(); tl.setCrossOrigin('anonymous'); tl.load(this.assets.RAW.replace('3D_Assets/', 'kfb/') + 'KayfaBizarro_Card_Backside_01_lowrez.png', (t) => { t.colorSpace = T.SRGBColorSpace; t.center.set(0.5, 0.5); t.rotation = Math.PI / 2; t.anisotropy = 4; m.map = t; m.needsUpdate = true; this.log('backside texture loaded'); }, undefined, () => { m.color.setHex(0x1f1a14); this.log('backside texture unreachable — ink underside'); }); return m; })());
    /* KORREKTUR 06.09. (Georg: »bei der Ink-Outline ist eine Lücke/Blitzer zwischen Ink und
       Kartenrand«): der Körper war 0,975 × groß, das Blatt 1,0 — gemessen 17,55 × 10,09 gegen
       18,00 × 10,35. Am äußeren Rand lag damit KEIN dunkler Körper unter dem Papier, und die
       beleuchtete Papierkante blitzte an der Tusche vorbei. Der Körper geht jetzt auf 1,0 und liegt
       0,05 u tiefer — tief genug gegen z-fight (das war der Grund für die 0,975), breit genug, dass
       hinter jeder Tuschzacke Tusche steht. */
    const body = new T.Mesh(new T.BoxGeometry(w, SPEC.card.thickness, d), [inkMat, inkMat, inkMat, backMat, inkMat, inkMat]);
    body.position.y = -SPEC.card.thickness / 2 - 0.05; body.castShadow = true;
    sheet.traverse((m) => { if (m.isMesh && m.material) { m.material.polygonOffset = true; m.material.polygonOffsetFactor = -1; m.material.polygonOffsetUnits = -1; } });
    const card = new T.Group(); card.add(body, sheet);
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
  /** Bodenhöhe der aktuellen Etage (Welt). */
  floorY() { return this.current ? this.current.position.y + this._bob : 0; }

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
    const inkMat = new T.MeshStandardMaterial({ color: 0x1f1a14, roughness: 0.92, metalness: 0 });
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
  dispose() { this.cards.forEach((c) => { if (c.userData.rec) c.userData.rec.dispose(); }); if (this.group && this.group.parent) this.group.parent.remove(this.group); this.cards = []; }
}
