/* kfb-weapon-dice.js · der Wuerfelwurf als Waffe (v1, 04.09.2026)
 *
 * AUFTRAG (Georg, 04.09.): „als weitere waffe nutzen wir den ugur 3D dice, der in
 * ballistischer kurve das ziel trifft (nur falls kein performance-problem, sonst
 * einfache farbige, rotierende cubes)".
 *
 * ═══ DIE PERFORMANCE-FRAGE, GERECHNET ════════════════════════════════════════
 * `dice_ugur_lowpoly.glb` ist gemessen (v5, `github.md`): 2 Meshes, 4 882 Dreiecke,
 * zwei benannte Materialien (`white` Koerper, `black` Augen), keine Textur. Ein
 * geworfener Wuerfel je Schuss sind 4,9 k Dreiecke — der Mech daneben hat 6,8 k,
 * das Gelaende mehr. Die Grenze aus v5 war eine ANDERE Lage: dort standen ohne
 * Deckel 1 387 gleichzeitige Wuerfel im Bild (1 770 Draw-Calls, 7,9 ms). Im
 * Schussstand fliegt genau EIN Schuss, und `cap` deckelt trotzdem — das Modell ist
 * hier also klar bezahlbar. Der farbige Wuerfel bleibt als RUECKFALL, aber nicht
 * aus Sparsamkeit: er greift, wenn die Datei nicht laedt.
 *
 * ═══ DIE AUGEN SIND DER WUERFEL ══════════════════════════════════════════════
 * v5-Befund, hier woertlich uebernommen: wer beide Materialien toent, bekommt einen
 * Klotz. Gemessen war der Kontrast danach 1,78:1 statt 8,15:1 — die Augen
 * verschwanden im Koerper, und ein Wuerfel ohne Augen ist eine Kiste. Getoent wird
 * deshalb NUR der Koerper; dunkle Materialien (Name `black|pip|dot` oder Helligkeit
 * unter 0,3) bleiben unangetastet. `tor()` misst diesen Kontrast, statt ihn zu
 * behaupten.
 *
 * ═══ WARUM NICHT IN `kfb-combat-def.js` ══════════════════════════════════════
 * Das Datenmodul ist geteiltes Gut (v8 liest es). Eine neue Waffe dort erscheint in
 * v8s Waffenraum, ohne dass sie in v8 je im Bild war — unbewiesen (R2). Die Waffe
 * liegt deshalb bei ihrem Geschoss, und der Wirt MISCHT die Raeume.
 *
 * VERTRAG
 *   WEAPONS · AMMO                     · Daten in der Form von kfb-combat-def.js
 *   const D = createDiceAmmo({ THREE, loadGLTF, params });
 *   await D.prepare()                  · laedt das GLB (zwei Pfadkandidaten), misst
 *   D.mesh(w)                          · Group in Waffenfarbe (Augen unangetastet)
 *   D.zeile() · D.tor() · D.stats()
 */

const GOLD = 0xe9c14a, PAPER = 0xf3ead3;

export const WEAPONS = {
  dice: {
    name: 'Würfelwurf', kind: 'SPEZIAL', note: 'Ballistischer Bogen · ein Würfel',
    /* Bogen 1,0 = dieselbe Klasse wie Bog Lob (`arc`), aber langsamer und schwerer:
       ein Wuerfel ist eine MASSE, kein Klumpen. Die Flugzeit macht den Bogen
       lesbar — bei 22 u/s auf 12 u sind das 0,55 s, also gut ein halbes
       Schieberfenster fuer Steigen und Fallen. */
    rate: 0.75, dmg: 26, speed: 22, clip: 'Shoot_Big',
    /* Streuung KLEIN (0,004 statt 0,01): gemessen streift ein Wurf auf ein
       fliegendes Ziel ohnehin nur knapp am Rand der Trefferkapsel vorbei (minimaler
       Abstand 0,97 u bei 0,78 u Radius). Mit der groesseren Streuung entschied der
       Schuss-Seed ueber Treffer oder Fehlschuss, und ein Stand, der bei gleicher
       Einstellung mal trifft und mal nicht, taugt nicht als Vergleich. */
    arc: 1.0, spreadA: 0.004, kick: 0.06, heft: 0.9,
    energy: 'kinetic', muz: 'blast', muzMs: 70, muzSize: 1.1,
    /* FEUER AM EINSCHLAG, auf Georgs Wunsch („flammen & rauch beim dice impact sehe
       ich GAR nicht"). Physikalisch traegt ein Wuerfel kein Feuer — in dieser Welt
       schlaegt er Funken und zuendet den Staub, und das ist eine Entscheidung, keine
       Nachlaessigkeit. Die Zahl ist der GROESSENANTEIL der Flamme: 0,8 statt 1,0,
       damit sie kleiner bleibt als bei Rakete und Moerser (dort brennt Treibstoff). */
    fire: 0.8,
    color: GOLD, flash: PAPER, ammo: 'die', sfx: 'thump',
    /* Kein `taper`, kein `trail`: ein geworfener Wuerfel hat kein Triebwerk und
       keine Spur. Was er hat, ist Drehung — und die traegt das Geschoss selbst. */
    ant: 0.14, tumble: true
  }
};

export const AMMO = {
  die: { form: 'Würfel: sechs Flächen, Augen sichtbar, taumelt um eine feste Achse', len: 0.52, wid: 0.52, px: 18, layers: 1 }
};

export function createDiceAmmo(o) {
  const THREE = o && o.THREE;
  const loadGLTF = o && o.loadGLTF;

  const QUELLE = {
    /* Zwei Kandidaten, beide belegt: der Asset-Index fuehrt `Dice/`, Georgs Link
       vom 04.09. zeigt auf die Wurzel. Wer 404 gibt, verliert — gemessen statt
       geraten. */
    pfade: ['media/3D_Assets/Dice/dice_ugur_lowpoly.glb', 'media/3D_Assets/dice_ugur_lowpoly.glb'],
    /* 0,52 u: aus v5 gerechnet, nicht geschaetzt — bei 0,38 u projiziert ein Wuerfel
       auf Kampfdistanz nur 9 px, und Taumeln unter 10 px ist keine Aussage. */
    kante: 0.52,
    tonung: 0.55,          // wie weit der Koerper Richtung Waffenfarbe wandert
    dunkel: 0.30           // darunter gilt ein Material als Auge und bleibt
  };
  const P = Object.assign({}, QUELLE, (o && o.params) || {});

  let geos = null;          // [{ geo, dunkel, name }]
  let kind = 'ungeladen';   // ungeladen · glb · ersatz
  let mass = null;
  let fehler = null;
  const zaehler = { gebaut: 0, glb: 0, ersatz: 0 };

  const lum = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
  const kontrast = (a, b) => {
    const l1 = Math.max(lum(a), lum(b)) + 0.05, l2 = Math.min(lum(a), lum(b)) + 0.05;
    return l1 / l2;
  };

  return {
    id: 'kfb-weapon-dice',
    version: '1.0.0',
    group: null,
    besitzt: 'zwei Geometrien (Koerper und Augen) — die Meshes gehoeren dem Wirt',
    schreibt: [],
    quelle: QUELLE,
    params: P,
    WEAPONS: WEAPONS,
    AMMO: AMMO,

    async prepare() {
      if (kind !== 'ungeladen') return kind;
      if (!loadGLTF || !THREE) { kind = 'ersatz'; fehler = 'kein Lader'; return kind; }
      for (const p of P.pfade) {
        try {
          const g = await loadGLTF(p);
          g.scene.updateMatrixWorld(true);
          const box = new THREE.Box3().setFromObject(g.scene);
          const sz = box.getSize(new THREE.Vector3());
          const cen = box.getCenter(new THREE.Vector3());
          /* ACHSENWEISE normieren: die Box ist gemessen NICHT wuerfelig
             (2,544 × 2,701 × 2,550 — Befund Chaturaji). Ein einziger Faktor
             haette den Wuerfel schief gemacht. */
          const s = new THREE.Vector3(P.kante / Math.max(0.001, sz.x), P.kante / Math.max(0.001, sz.y), P.kante / Math.max(0.001, sz.z));
          const list = [];
          g.scene.traverse((n) => {
            if (!n.isMesh || !n.geometry) return;
            const geo = n.geometry.clone();
            geo.applyMatrix4(n.matrixWorld);
            geo.translate(-cen.x, -cen.y, -cen.z);
            geo.scale(s.x, s.y, s.z);
            const m = Array.isArray(n.material) ? n.material[0] : n.material;
            const nm = String((m && m.name) || n.name || '');
            const dark = /black|pip|dot|auge/i.test(nm) || (m && m.color && lum(m.color) < P.dunkel);
            list.push({ geo: geo, dunkel: !!dark, name: nm || '(ohne Namen)', farbe: m && m.color ? m.color.clone() : null,
                        tris: (geo.index ? geo.index.count : geo.attributes.position.count) / 3 });
          });
          if (!list.length) throw new Error('GLB ohne Mesh');
          geos = list; kind = 'glb'; mass = { x: +sz.x.toFixed(3), y: +sz.y.toFixed(3), z: +sz.z.toFixed(3), pfad: p };
          return kind;
        } catch (e) { fehler = String((e && e.message) || e); }
      }
      /* Georgs Rueckfall, und er ist ein ECHTER Wuerfel: gleiche Kante, gleiche
         Silhouette, nur ohne Augen. Er greift bei 404, nicht bei Sparsamkeit. */
      geos = [{ geo: new THREE.BoxGeometry(P.kante, P.kante, P.kante), dunkel: false, name: '(Ersatzwuerfel)', farbe: null, tris: 12 }];
      kind = 'ersatz';
      return kind;
    },

    /** Ein Wuerfel in der Waffenfarbe. Material JE Wuerfel (v5: ein geteiltes
        Material laesst alle liegenden gleichzeitig verblassen). */
    mesh(w) {
      if (!geos) return null;
      const grp = new THREE.Group();
      const ziel = new THREE.Color((w && w.color) || GOLD);
      for (const g of geos) {
        const col = g.dunkel
          ? (g.farbe ? g.farbe.clone() : new THREE.Color(0x212121))     // Augen: unangetastet
          : (g.farbe ? g.farbe.clone().lerp(ziel, P.tonung) : ziel.clone());
        const mat = new THREE.MeshStandardMaterial({ color: col, roughness: g.dunkel ? 0.5 : 0.42, metalness: 0.12, flatShading: false });
        const m = new THREE.Mesh(g.geo, mat);
        m.castShadow = true;
        grp.add(m);
      }
      zaehler.gebaut++;
      if (kind === 'glb') zaehler.glb++; else zaehler.ersatz++;
      return grp;
    },

    kind() { return kind; },
    stats() { return Object.assign({ kind: kind, mass: mass, fehler: fehler, tris: geos ? Math.round(geos.reduce((a, g) => a + g.tris, 0)) : 0 }, zaehler); },
    zeile() {
      const s = this.stats();
      return 'weapon-dice · ' + kind + (mass ? ' · ' + mass.pfad : '') + ' · ' + s.tris + ' Dreiecke je Wuerfel · '
        + (geos ? geos.length + ' Teil(e), ' + geos.filter((g) => g.dunkel).length + ' als Augen erkannt' : 'nicht geladen');
    },
    tor() {
      const z = []; let ok = 0, von = 0, nm = 0;
      const pruef = (b, gut, schlecht) => { von++; if (b) { ok++; z.push('\u2713 ' + gut); } else z.push('\u2717 ' + schlecht); };
      const info = (s) => { z.push('\u00b7 ' + s); };
      const offen = (s) => { nm++; z.push('\u2013 ' + s + ' (nicht messbar)'); };

      if (kind === 'ungeladen') { offen('prepare() noch nicht gelaufen'); return { ok: false, bestanden: 0, von: 0, nichtMessbar: 1, zeilen: z, text: 'weapon-dice: ungeladen' }; }

      pruef(!!geos && geos.length > 0, kind === 'glb' ? 'GLB geladen: ' + mass.pfad : 'Ersatzwuerfel steht (' + fehler + ')',
        'weder GLB noch Ersatz — es gibt kein Geschoss');

      /* DIE ZEILE, DIE DEN v5-FEHLER FANGEN WUERDE. Gemessen wird der Kontrast
         zwischen getoentem Koerper und Augen, an einem GEBAUTEN Wuerfel. */
      if (kind !== 'glb' || !geos.some((g) => g.dunkel)) offen('keine Augen im Modell — Kontrast nicht messbar');
      else {
        const probe = this.mesh(WEAPONS.dice);
        const koerper = probe.children.find((m, i) => !geos[i].dunkel);
        const augen = probe.children.find((m, i) => geos[i].dunkel);
        const k = (koerper && augen) ? kontrast(koerper.material.color, augen.material.color) : 0;
        pruef(k >= 4.5, 'Augen bleiben lesbar: Kontrast ' + k.toFixed(2) + ':1 (Grenze 4,5)',
          'Augen verschwinden im Koerper: Kontrast ' + k.toFixed(2) + ':1 — das ist der v5-Fehler');
      }

      const tris = geos.reduce((a, g) => a + g.tris, 0);
      pruef(tris < 8000, Math.round(tris) + ' Dreiecke je Wuerfel (Budget 8 000 fuer EIN Geschoss)',
        Math.round(tris) + ' Dreiecke je Wuerfel — ueber Budget, Rueckfall auf Cubes waere ehrlicher');
      info('gebaut: ' + zaehler.gebaut + ' (glb ' + zaehler.glb + ', ersatz ' + zaehler.ersatz + ')');

      return { ok: ok === von, bestanden: ok, von: von, nichtMessbar: nm, zeilen: z,
               text: 'weapon-dice: ' + ok + '/' + von + ' bestanden' + (nm ? ', ' + nm + ' nicht messbar' : '') };
    }
  };
}
