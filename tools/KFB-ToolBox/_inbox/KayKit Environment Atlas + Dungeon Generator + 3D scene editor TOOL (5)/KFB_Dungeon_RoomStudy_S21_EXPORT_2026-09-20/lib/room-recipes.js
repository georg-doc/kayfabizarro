/* KFB · S21.2 · Raumrezept R02 — 1:1 nach dem Promobild, nicht heuristisch gestreut
   ---------------------------------------------------------------------------------
   Vertrag: docs/MENTAL_MODEL_DIORAMA.md. Die sieben Punkte dort sind die Bauregeln, und jede
   Abweichung von der Vorlage steht unten in ABWEICHUNGEN — nicht stillschweigend im Code.

   Was gegenüber der ersten Fassung ANDERS ist, und warum:
   · Zwei Wandzüge à ZWEI VOLLE Module, Ecke `wall_corner_small`. Mit `wall_corner` (Schenkel 2,0)
     wäre jedes anschliessende Modul ein `wall_half` — im Vorbild ist kein halbes Teil.
   · Keine Wandfackel. In S02 ist keine, und eine Fackel über einem Holzbalken ist Unsinn.
   · Das TÜRBLATT bleibt. `wall_doorway` bringt es mit; im Generator wird es entfernt, weil man
     durch die Fuge laufen muss — hier ist die Tür ein geschlossenes Blatt mit Ring, wie im Bild.
     Auf/Zu ist eine Gruppe, kein Bauentscheid.
   · Requisiten stehen in WELTKOORDINATEN (`pos`), nicht als Zellversatz. Ein Nachbau ist eine
     Abmessung, keine Streuregel.

   In dieser Datei steht weiterhin KEINE Zahl, die ein BAUTEIL beschreibt (Modul, Wandhöhe,
   Plattenmitte, Eckgelenk, Bodenkontakt kommen gemessen aus `kit`). Die Zahlen hier sind
   Positionen auf dem Boden — das ist die Komposition, und die ist der Zweck des Nachbaus. */

import { DIR, DIRLIST, wallRot, cornerRot, dirRot } from './dungeon-grid.js';

export const ROOMS = [
  {
    id: 'R02', titel: 'Schatz- und Esskammer', quelle: 's02',
    /* Kanonische RAW-URL statt relativem Pfad: im Standalone-Export gibt es kein ref/ daneben,
       und das Promobild liegt ohnehin im Asset-Repo (Pfad-Hygiene, session-export Schritt 6). */
    vorlage: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE%202/Samples/Dungeon_sample2.png',
    vorlageLokal: 'ref/samples/s02_gold_dining.png',
    untertitel: '1:1 nach Promobild 2 · zwei Wandzüge à zwei Module, Ecke hinten, offene Seite zur Kamera',
    /* DREI Module je Wandzug, Platte 3 × 3 = 12 × 12. Georgs Befund in der Deckungssicht:
       unser Raum steht HÖHER im Bild, weil die Grundfläche zu klein ist — bei kleinerer Platte
       muss die Kamera näher heran, also wachsen die Wände im Bild. Zwei Folgen, beide im Vorbild
       sichtbar: das Modul AN DER ECKE ist eine glatte Wand (kein Holzbalken in der Ecke), und
       die Truhe bekommt Platz für den aufgeklappten Deckel. */
    w: 3, h: 3,
    /* Kamera auf der Winkelhalbierenden, lange Brennweite — so steht die Vorlage. */
    /* Die Kamera ist aus der VORLAGE gemessen, nicht gewählt: das Motiv füllt dort 0,72 der Breite
       und 0,57 der Höhe seines 16:9-Bildes, Mitte 0,00 / −0,04. Die Kamerahöhe wird daraus
       gelöst (flacher Winkel → flachere Silhouette), nicht getippt. */
    kamera: { dir: [1, 0.46, 1], fov: 19, zielBreite: 0.72, zielHoehe: 0.57, zielVersatz: [0, -0.04] },
    ecke: 'wall_corner_small',
    boden: { standard: 'floor_tile_large', sonder: [] },
    /* Wand A (N, Bildschirm links): Durchgang · Regal — Wand B (W, rechts): Banner · Wappen.
       Ein Ereignis je Modul, keins doppelt, keins leer. */
    /* SEITEN GETAUSCHT (S21.2): im Vorbild liegt der Durchgang auf der BILDLINKEN Wand.
       Bei Kamera aus +x/+z zeigt +z nach rechts — also ist die W-Wand die linke.
       Die erste Fassung hatte beide Züge vertauscht; alle Requisiten sind mitgespiegelt
       (Diagonale x↔z, Drehung θ → 90−θ). */
    waende: [
      /* Kein Regal als Ersatz: die Vorlage zeigt eine WANDNISCHE mit Holzrahmen, in der die
         Münzstapel stehen — das ist ein eigenes Bauteil (wall_window_closed_scaffold). Zwei
         übereinandergesetzte `shelves` waren das Bastelteil-Antipattern, und die Streben landeten
         dabei in der Ecke. Die Tür trägt in der Vorlage denselben Holzrahmen. */
      /* `drehen: 180` — das Teil ist einseitig: Bretterrücken auf der einen, EINSCHUB mit Bank
         auf der anderen Seite. Ohne Drehung zeigt die Bank nach draussen und die Münzen schweben
         vor einer Bretterwand. Die Seite folgt nicht aus dem Überstand, also steht sie im Rezept. */
      { at: [0, 0], dir: 'W', part: 'wall', rolle: 'Eckmodul · glatt, kein Balken in der Ecke' },
      { at: [0, 1], dir: 'W', part: 'wall_window_closed_scaffold', rolle: 'Nische mit Beute', drehen: 180 },
      { at: [0, 2], dir: 'W', part: 'wall_doorway_scaffold', rolle: 'Durchgang' },
      { at: [0, 0], dir: 'N', part: 'wall', rolle: 'Eckmodul · glatt' },
      { at: [1, 0], dir: 'N', part: 'wall', rolle: 'Bannerwand' },
      { at: [2, 0], dir: 'N', part: 'wall', rolle: 'Wappenwand' }
    ],
    props: [
      /* ---------- ZONE ECKE · das Ziel ----------
         Die Sehachse dieser Kamera läuft entlang x = z: zwei Dinge mit gleichem x−z liegen auf
         DEMSELBEN Strahl. Truhe (0,0) und Tisch (0,1) taten genau das — der Blickfang der
         ganzen Komposition stand hinter dem Gedeck und war unsichtbar.
         Jetzt getrennt: Truhe x−z = +1,6 (bildrechts, hinten), Tisch x−z = −1,2 (bildlinks,
         vorn) — dieselbe Staffelung wie in der Vorlage. */
      { id: 'truhe_zu', part: 'chest', pos: [1.8, 0.2], rot: 60, g: 'schatz', s: 'zu' },
      /* Der Deckel ist ein EIGENES MESH im Bauteil (`chest_gold_lid`, Scharnier bei y 0,50 /
         z −0,56) — dieselbe Bauart wie das Türblatt in `wall_doorway`. „Offen" ist also kein
         zweites Modell und keine Eigengeometrie, sondern eine Drehung am Teil des Packs.
         Gegenprobe im Körper: chest_gold reicht bis y 1,04, chest nur bis 0,60 — die Differenz
         IST das Gold in der Truhe. */
      { id: 'truhe_auf', part: 'chest_gold', pos: [1.8, 0.2], rot: 60, g: 'schatz', s: 'auf', funke: 1, deckel: -105 },
      { part: 'coin_stack_large', pos: [5.2, -0.7], g: 'schatz', s: 'auf' },
      { part: 'coin_stack_medium', pos: [0.3, 2.3], g: 'schatz', s: 'auf' },
      /* Der AUFGEKLAPPTE Deckel gehört zur Truhe: er schwenkt rund 1,3 nach hinten und braucht
         seinen Platz. Ein dritter Stapel stand genau dort — er ist entfallen statt verschoben,
         weil die Ecke schon zwei Stapel und den Haufen trägt. */
      { part: 'coin', pos: [0.9, 3.5], g: 'schatz', s: 'auf' },

      /* ---------- ZONE MITTE · das Leben ---------- */
      { id: 'tisch', part: 'table_medium_tablecloth', pos: [4.0, 5.2], rot: 90, g: 'tafel', s: 'gedeckt' },
      { part: 'chair', pos: [4.2, 7.0], rot: 0, g: 'tafel', s: 'gedeckt' },
      { part: 'chair', pos: [2.5, 6.8], rot: 270, g: 'tafel', s: 'gedeckt' },
      /* Tischfläche 2,00 × 2,00 um (2,8 / 2,7). Fünf Auflagen, Abstände gegen die gemessenen
         Radien gerechnet — Teller 0,50, Essteller 0,51, Krug 0,19, Kerze 0,17, Tellerchen 0,25. */
      { part: 'plate_stack', pos: [3.45, 4.75], auf: 'tisch', g: 'tafel', s: 'gedeckt' },
      { part: 'bottle_A_green', pos: [3.50, 5.70], auf: 'tisch', g: 'tafel', s: 'gedeckt' },
      { part: 'candle_lit', pos: [3.98, 5.45], auf: 'tisch', g: 'tafel', s: 'gedeckt', flamme: 1 },
      { part: 'plate_food_A', pos: [4.48, 4.80], auf: 'tisch', g: 'tafel', s: 'gedeckt' },
      { part: 'plate_small', pos: [4.50, 5.75], auf: 'tisch', g: 'tafel', s: 'gedeckt' },
      { id: 'tisch_leer', part: 'table_medium', pos: [4.0, 5.2], rot: 90, g: 'tafel', s: 'abgeraeumt' },
      { part: 'chair', pos: [4.2, 7.0], rot: 0, g: 'tafel', s: 'abgeraeumt' },
      { part: 'chair', pos: [2.5, 6.8], rot: 270, g: 'tafel', s: 'abgeraeumt' },

      /* ---------- ZONE RAND · das Echo ----------
         Wandfuss rechts (Wand B): graue Kiste mit Fässchen, dann Truhe mit Beute, dann Stapel. */
      { id: 'kiste_grau', part: 'trunk_medium_A', pos: [8.8, -0.9], rot: 0, g: 'rand' },
      /* Fass auf den BODEN neben die Kiste: ein Fass auf einer Truhe ist kein Bild, sondern ein
         Stapelunfall. */
      /* Links der Truhe an der N-Wand: zwischen Goldhaufen (x 4,0, halb 0,72) und Kiste
         (x 5,4, halb 0,48) ist für ein Fass mit Radius 0,50 kein Platz — dort hineingesetzt
         steckte es in der offenen Truhe. */
      { part: 'barrel_small', pos: [-0.8, 1.2], g: 'rand' },
      { part: 'coin_stack_small', pos: [8.6, 0.9], g: 'rand' },
      /* Der Türweg bleibt FREI. Niemand stapelt Gold in den eigenen Eingang, und der Raum muss
         begehbar gedacht sein — die Tür liegt bei z ≈ 4, davor bleibt eine Gasse. */
      { part: 'coin_stack_medium', pos: [-0.9, 2.2], g: 'rand' },
      /* Offener Vordergrund: Kerzengruppe mit Russflecken — im Bild der einzige helle Punkt
         auf freiem Boden. */
      { part: 'candle_triple', pos: [7.8, 6.0], g: 'licht' },
      { part: 'candle_lit', pos: [7.5, 6.5], g: 'licht', flamme: 1 },

      /* ---------- WANDZIER · ein Ereignis je Modul ---------- */
      /* Auf der GEMESSENEN Fensterbank, nicht auf einer geschätzten Höhe. */
      /* EIN Stapel, vorn auf der Bank. Zwei hintereinander verdeckten sich gegenseitig
         (Sichtprobe: 20 % und 0 %), und auf der Mittelebene der 1,0 dicken Wand steckt der
         hintere im Rahmen. `tiefe: 0.75` = vorderes Viertel der gemessenen Bankspanne. */
      { part: 'coin_stack_small', bank: { at: [0, 1], dir: 'W' }, seitlich: 0, tiefe: 0.75, g: 'regal' },
      { part: 'banner_yellow', wand: { at: [1, 0], dir: 'N' }, frac: 0.55, g: 'banner' },
      /* Die Vorlage zeigt dort KEIN Tuchbanner, sondern eine flache Wappen-Applikation:
         Schild mit gekreuzten Schwertern. Das Pack hat sie als `sword_shield_gold` — ein
         Tuchbanner an dieser Stelle ist ein sichtbarer Griff daneben. */
      { part: 'sword_shield_gold', wand: { at: [2, 0], dir: 'N' }, frac: 0.58, g: 'banner' }
    ],
    fackeln: [],
    /* Der Entzerrer ist Prüfung, kein Werkzeug: er MELDET Überlappungen, verschiebt aber nichts.
       Sonst überschreibt die Automatik genau die Abmessung, die der Nachbau sein soll. */
    entzerren: false,
    gruppen: [
      { id: 'schatz', titel: 'Truhe', zustaende: [['zu', 'verschlossen'], ['auf', 'offen + Beute']], start: 'auf',
        sfx: { auf: 'truhe', zu: 'deckel' }, vfx: { auf: 'funken' } },
      { id: 'tafel', titel: 'Tafel', zustaende: [['gedeckt', 'gedeckt'], ['abgeraeumt', 'abgeräumt']], start: 'gedeckt',
        sfx: { abgeraeumt: 'geschirr' } },
      { id: 'tuer', titel: 'Tür', zustaende: [['zu', 'zu'], ['auf', 'offen']], start: 'zu',
        sfx: { auf: 'truhe', zu: 'deckel' } },
      { id: 'rand', titel: 'Randstücke', schalter: true, start: true },
      { id: 'licht', titel: 'Kerzen', schalter: true, start: true },
      { id: 'regal', titel: 'Nische', schalter: true, start: true },
      { id: 'banner', titel: 'Wandzier', schalter: true, start: true }
    ],
    abweichungen: [
      'Grauer Keil rechts der offenen Truhe (Strebepfeiler oder Treppenwange) — im Pack nicht zugeordnet, deshalb NICHT durch ein ähnliches Teil ersetzt.',
      'Die Sockelplatte der Vorlage (floor_foundation_*) fehlt: der Nachbau steht auf den Bodenkacheln, damit das Raster sichtbar bleibt. Messbare Folge: die Silhouette ist ~0,02 NDC flacher als die Vorlage.',
      'Die offene Truhe steht auf dem Boden, in der Vorlage auf einem grauen Block — trunk_medium_A misst 0,95 × 0,88 und ist kleiner als die Truhe (1,70 × 1,45), also trüge er sie nicht.',
      'Die zweite Truhe an der rechten Wand ist entfallen: an dieser Stelle hätte sie die graue Kiste und den Münzstapel überlappt. Im Vorbild steht sie weiter hinten in der Nische.'
    ]
  }
];

/* ---------- Rezept → Platzierungen ---------- */
export function buildRoom(rec, kit) {
  const { MOD, box, frame } = kit;
  const out = [], notes = [];
  const have = (n) => !!box[n];
  const rotA = ([x, z], deg) => {
    const a = ((deg || 0) * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    return [x * c + z * s, -x * s + z * c];
  };
  const put = (name, anchor, target, deg, y, extra) => {
    if (!have(name)) { notes.push(`fehlt im Pack: ${name}`); return null; }
    const a = rotA(anchor, deg || 0);
    const it = { a: 'dungeon:' + name, p: [target[0] - a[0], y, target[1] - a[1]], r: deg || 0, ...extra };
    out.push(it);
    return it;
  };
  const boxMid = (n) => { const b = box[n]; return [(b.min[0] + b.max[0]) / 2, (b.min[2] + b.max[2]) / 2]; };
  const faceOf = (nm) => {
    const f = nm ? frame[nm] : null;
    return f && f.faceFront != null ? Math.max(f.faceFront, f.faceBack) : kit.WALL_THICK / 2;
  };

  /* ---------- Boden ---------- */
  const sonderOf = new Map();
  for (const s of (rec.boden.sonder || [])) for (const [c, r] of s.cells) sonderOf.set(`${c},${r}`, s.part);
  for (let r = 0; r < rec.h; r++) for (let c = 0; c < rec.w; c++) {
    const part = sonderOf.get(`${c},${r}`) || rec.boden.standard;
    const nm = have(part) ? part : rec.boden.standard;
    put(nm, boxMid(nm), [c * MOD, r * MOD], (c * 7 + r * 13) % 4 * 90, -box[nm].max[1],
      { layer: 'floor', cell: [c, r] });
  }

  /* ---------- Fugen · Ecken · Länge ----------
     Die Länge folgt dem gemessenen ECKSCHENKEL, nicht einer Regel aus dem Kopf: deckt der
     Schenkel eine halbe Fuge (wall_corner: 2,0), bleibt nur `wall_half`; ist die Ecke schmal
     (wall_corner_small), bleibt das Modul ganz. Genau darum steht im Promobild kein halbes Teil. */
  const eckTeil = have(rec.ecke) ? rec.ecke : 'wall_corner';
  const cf = frame[eckTeil];
  const eb = box[eckTeil];
  const eckSchenkel = (cf && eb)
    ? Math.max(Math.abs(cf.joint[0] - eb.min[0]), Math.abs(eb.max[0] - cf.joint[0]),
      Math.abs(cf.joint[1] - eb.min[2]), Math.abs(eb.max[2] - cf.joint[1]))
    : MOD / 2;
  const frisstHalbe = eckSchenkel > MOD / 4 + 0.05;
  notes.push(`Ecke ${eckTeil}: Schenkel ${eckSchenkel.toFixed(2)} → ${frisstHalbe ? 'Nachbarfuge halbiert' : 'Nachbarmodule bleiben ganz'}`);

  const armsAt = new Map();
  const seams = [];
  for (const w of rec.waende) {
    const [dx, dz] = DIR[w.dir];
    const c = w.at[0], r = w.at[1], nc = c + dx, nr = r + dz;
    const gc = Math.max(c, nc), gr = Math.max(r, nr);
    const run = dx ? 'z' : 'x';
    const pts = dx ? [`${gc},${gr}`, `${gc},${gr + 1}`] : [`${gc},${gr}`, `${gc + 1},${gr}`];
    const s = { ...w, run, pts, mid: [c + dx / 2, r + dz / 2], into: [-dx, -dz] };
    seams.push(s);
    const add = (k, d) => { if (!armsAt.has(k)) armsAt.set(k, new Set()); armsAt.get(k).add(d); };
    if (run === 'z') { add(pts[0], 'S'); add(pts[1], 'N'); } else { add(pts[0], 'E'); add(pts[1], 'W'); }
  }
  const cornerAt = new Set(), corners = [], freeEnds = [];
  for (const [k, set] of armsAt) {
    const a = [...set];
    if (a.length === 1) { freeEnds.push({ pt: k, dir: a[0] }); continue; }
    if (a.length === 2 && !((a.includes('N') && a.includes('S')) || (a.includes('E') && a.includes('W')))) {
      const [i, j] = k.split(',').map(Number);
      corners.push({ i, j, dirs: a, arms: a.map((d) => DIR[d]) });
      cornerAt.add(k);
    }
  }
  for (const s of seams) {
    const eckenAmEnde = s.pts.filter((k) => cornerAt.has(k)).length;
    let part = s.part, shift = 0;
    if (frisstHalbe && eckenAmEnde === 2) { notes.push(`Fuge ${s.at} ${s.dir}: beidseitig gedeckt`); continue; }
    if (frisstHalbe && eckenAmEnde === 1 && !/doorway|gated/.test(part)) {
      part = have('wall_half') ? 'wall_half' : part;
      shift = cornerAt.has(s.pts[0]) ? 1 : -1;
    }
    const f = frame[part], b = box[part];
    if (!f || !b) { notes.push(`kein Rahmen für ${part}`); continue; }
    const sh = shift * (MOD / 4);
    const target = s.run === 'z' ? [s.mid[0] * MOD, s.mid[1] * MOD + sh] : [s.mid[0] * MOD + sh, s.mid[1] * MOD];
    put(part, f.anchor, target, (wallRot(f, s.run, s.into) + (s.drehen || 0)) % 360, -b.min[1], {
      layer: 'wall', seam: `${s.at}|${s.dir}`, seamPart: part, rolle: s.rolle,
      /* Das Türblatt BLEIBT — auf/zu ist eine Gruppe, kein Bauentscheid. Der Blattname folgt
         dem TEIL, nicht einem festen String: mit dem Wechsel auf `wall_doorway_scaffold` war das
         Blatt sonst wieder weg (derselbe Fehler wie in Post mortem pm2, einen Umbau später). */
      tuerblatt: /doorway/.test(part) ? part + '_door' : null
    });
  }
  if (cf) for (const co of corners) {
    const deg = cornerRot(cf, co.arms);
    if (deg === null) { notes.push(`Ecke ${co.i},${co.j}: keine Drehung gefunden`); continue; }
    put(eckTeil, cf.joint, [(co.i - 0.5) * MOD, (co.j - 0.5) * MOD], deg, -eb.min[1], { layer: 'corner' });
  }

  /* ---------- Fackeln (in R02 keine) ---------- */
  const tb = box.torch_mounted;
  if (tb) for (const t of (rec.fackeln || [])) {
    const [dx, dz] = DIR[t.dir];
    const into = [-dx, -dz];
    const asym = (i) => Math.abs(tb.min[i] + tb.max[i]) / Math.max(1e-6, tb.size[i]);
    const pi = asym(2) >= asym(0) ? 2 : 0;
    const sgn = Math.sign(tb.min[pi] + tb.max[pi]) || 1;
    const nat = pi === 0 ? [sgn, 0] : [0, sgn];
    const backLocal = sgn > 0 ? tb.min[pi] : tb.max[pi];
    const latLocal = pi === 0 ? (tb.min[2] + tb.max[2]) / 2 : (tb.min[0] + tb.max[0]) / 2;
    const anchor = pi === 0 ? [backLocal, latLocal] : [latLocal, backLocal];
    const seam = seams.find((s) => s.at[0] === t.at[0] && s.at[1] === t.at[1] && s.dir === t.dir);
    const off = faceOf(seam && seam.part) + 0.02;
    const mid = [t.at[0] + dx / 2, t.at[1] + dz / 2];
    put('torch_mounted', anchor, [mid[0] * MOD + into[0] * off, mid[1] * MOD + into[1] * off],
      dirRot(nat, into), kit.WALL_H * 0.55 - (tb.min[1] + tb.max[1]) / 2,
      { layer: 'torch', flamme: 1, g: 'licht' });
  }

  /* ---------- Requisiten ----------
     Zwei Durchgänge nach dem Setzen der Weltposition:
       1. Klemmen gegen die GEMESSENE Wandfläche der Nachbarfugen (nicht gegen die Nenndicke),
       2. Auseinanderschieben, wo sich zwei Requisiten überlappen.
     Beides war in der ersten Fassung nicht da — neun Teile steckten in der Wand, sieben
     ineinander, und die Prüfzeile sah es nicht. */
  const byId = new Map();
  const fl = [];
  for (const p of rec.props) {
    if (!have(p.part)) { notes.push(`fehlt im Pack: ${p.part}`); continue; }
    const b = box[p.part];
    if (p.bank) {
      /* Auf der gemessenen Fensterbank: Höhe aus `kit.sill`, Tiefe aus der Wandfläche,
         seitlich in Modulanteilen entlang der Fuge. Ohne Messung wird nichts gesetzt. */
      const [dx, dz] = DIR[p.bank.dir];
      const into = [-dx, -dz];
      const seam = seams.find((s) => s.at[0] === p.bank.at[0] && s.at[1] === p.bank.at[1] && s.dir === p.bank.dir);
      const bankY = seam && kit.sill ? kit.sill[seam.part] : null;
      if (bankY == null) { notes.push('keine gemessene Fensterbank an ' + (seam ? seam.part : '?') + ' — ' + p.part + ' nicht gesetzt'); continue; }
      const mid = [p.bank.at[0] + dx / 2, p.bank.at[1] + dz / 2];
      const laengs = dx ? [0, 1] : [1, 0];
      /* Tiefe aus der GEMESSENEN Bankfläche, nicht aus der Wandfläche: die Bank liegt IM
         Einschub, also hinter der Plattenfläche. Mit der Wandrequisiten-Rechnung
         (faceOf + halbe Eigentiefe) stand der Stapel davor in der Luft — genau der Befund. */
      const tiefe = kit.sillTiefe && kit.sillTiefe[seam.part];
      /* `p.tiefe` 0 = hinten an der Nischenrückwand, 1 = vorn an der Raumkante. */
      const anteil = p.tiefe ?? 0.5;
      const lokalMitte = tiefe ? tiefe.von + (tiefe.bis - tiefe.von) * anteil : 0;
      /* Das Teil ist gedreht gesetzt; die lokale Tiefenachse zeigt dann entgegen `into`. */
      const vz = (seam.drehen === 180 ? -1 : 1);
      const off = tiefe ? -vz * lokalMitte : faceOf(seam.part) + 0.02 + Math.max(b.size[0], b.size[2]) / 2;
      put(p.part, boxMid(p.part), [
        mid[0] * MOD + into[0] * off + laengs[0] * (p.seitlich || 0) * MOD,
        mid[1] * MOD + into[1] * off + laengs[1] * (p.seitlich || 0) * MOD
      ], 0, bankY - b.min[1], { layer: 'prop', propKind: 'bank', g: p.g, zs: p.s, propId: p.id });
      continue;
    }
    if (p.wand) {
      const [dx, dz] = DIR[p.wand.dir];
      const into = [-dx, -dz];
      const seam = seams.find((s) => s.at[0] === p.wand.at[0] && s.at[1] === p.wand.at[1] && s.dir === p.wand.dir);
      const asym = (i) => Math.abs(b.min[i] + b.max[i]) / Math.max(1e-6, b.size[i]);
      const pi = asym(2) >= asym(0) ? 2 : 0;
      const sgn = Math.sign(b.min[pi] + b.max[pi]) || 1;
      const nat = pi === 0 ? [sgn, 0] : [0, sgn];
      const centred = asym(pi) < 0.4;
      const back = centred ? (b.min[pi] + b.max[pi]) / 2 : (sgn > 0 ? b.min[pi] : b.max[pi]);
      const lat = pi === 0 ? (b.min[2] + b.max[2]) / 2 : (b.min[0] + b.max[0]) / 2;
      const anchor = pi === 0 ? [back, lat] : [lat, back];
      const off = faceOf(seam && seam.part) + 0.02 + (centred ? b.size[pi] / 2 : 0);
      const mid = [p.wand.at[0] + dx / 2, p.wand.at[1] + dz / 2];
      const y = kit.WALL_H * (p.frac ?? 0.6) - (b.min[1] + b.max[1]) / 2;
      put(p.part, anchor, [mid[0] * MOD + into[0] * off, mid[1] * MOD + into[1] * off],
        dirRot(nat, into), y, { layer: 'prop', propKind: 'wall', g: p.g, zs: p.s, propId: p.id });
      if (p.id) byId.set(p.id, { top: y + b.max[1], item: null });
      continue;
    }
    const target = p.pos ? [p.pos[0], p.pos[1]]
      : [(p.cell[0] + (p.off?.[0] ?? 0)) * MOD, (p.cell[1] + (p.off?.[1] ?? 0)) * MOD];
    const base = p.auf ? byId.get(p.auf) : (typeof p.y === 'string' ? byId.get(p.y) : null);
    const y = base ? base.top - b.min[1] : -b.min[1];
    /* Halbe Ausdehnung der GEDREHTEN Box, nicht der umschriebene Kreis: eine 1,70 × 1,45 grosse
       Truhe auf 60° misst quer 2,10 — mit max/2 = 0,85 gerechnet steckte der Goldhaufen 0,37 in
       ihr, und die Prüfung meldete es. Formel für die achsparallele Hülle einer gedrehten Box. */
    const deg = ((p.rot || 0) % 360 + 360) % 360;
    const rad = (deg * Math.PI) / 180;
    const ca = Math.abs(Math.cos(rad)), sa = Math.abs(Math.sin(rad));
    const hx = (b.size[0] * ca + b.size[2] * sa) / 2;
    const hz = (b.size[0] * sa + b.size[2] * ca) / 2;
    const item = { p, b, target, y, hx, hz, auf: p.auf || (typeof p.y === 'string' ? p.y : null) };
    item.deckel = p.deckel;
    fl.push(item);
    if (p.id) byId.set(p.id, { top: y + b.max[1], item });
  }

  let geklemmt = 0;
  const klemme = (it) => {
    if (it.auf) return;
    const c = Math.round(it.target[0] / MOD), r = Math.round(it.target[1] / MOD);
    for (const [d, [dx, dz]] of DIRLIST) {
      const s = seams.find((s2) => (s2.at[0] === c && s2.at[1] === r && s2.dir === d)
        || (s2.at[0] === c + dx && s2.at[1] === r + dz && DIR[s2.dir][0] === -dx && DIR[s2.dir][1] === -dz));
      if (!s) continue;
      const vz = dx || dz;
      const grenze = (dx ? c : r) * MOD + vz * (MOD / 2 - faceOf(s.part) - 0.06);
      const i = dx ? 0 : 1, h = dx ? it.hx : it.hz;
      const rand = it.target[i] + vz * h;
      if (vz > 0 ? rand > grenze : rand < grenze) { it.target[i] += grenze - rand; geklemmt++; }
    }
  };
  for (const it of fl) klemme(it);

  const kollision = (a, b2) => {
    /* Zwei Auflagen auf DERSELBEN Unterlage liegen auf einer Ebene und müssen sich vertragen;
       eine Auflage gegen ein Bodenteil nicht — die liegt darüber. */
    if ((a.auf || b2.auf) && a.auf !== b2.auf) return null;
    if (a.p.g && a.p.g === b2.p.g && a.p.s && b2.p.s && a.p.s !== b2.p.s) return null;
    const ox = a.hx + b2.hx - Math.abs(a.target[0] - b2.target[0]);
    const oz = a.hz + b2.hz - Math.abs(a.target[1] - b2.target[1]);
    if (ox <= 0.02 || oz <= 0.02) return null;
    return ox < oz ? { i: 0, d: ox } : { i: 1, d: oz };
  };
  let geschoben = 0;
  if (rec.entzerren !== false) {
    for (let pass = 0; pass < 8; pass++) {
      let hits = 0;
      for (let i = 0; i < fl.length; i++) for (let j = i + 1; j < fl.length; j++) {
        const k = kollision(fl[i], fl[j]);
        if (!k) continue;
        hits++;
        const sgn = Math.sign(fl[j].target[k.i] - fl[i].target[k.i]) || 1;
        fl[j].target[k.i] += sgn * (k.d + 0.03);
        klemme(fl[j]);
      }
      geschoben += hits;
      if (!hits) break;
    }
  }
  let rest = 0;
  for (let i = 0; i < fl.length; i++) for (let j = i + 1; j < fl.length; j++) if (kollision(fl[i], fl[j])) rest++;
  notes.push(`Requisiten: ${geklemmt}× an der Wandfläche geklemmt · Entzerrer ${rec.entzerren === false ? 'aus (Positionen sind die Abmessung)' : geschoben + '× geschoben'} · ${rest} Überlappung${rest === 1 ? '' : 'en'}`);

  for (const it of fl) {
    /* Was auf etwas steht, folgt dem Versatz seiner Unterlage. */
    if (it.auf) {
      const base = byId.get(it.auf);
      if (base && base.item) {
        const orig = base.item.p.pos || [(base.item.p.cell[0]) * MOD, (base.item.p.cell[1]) * MOD];
        it.target[0] += base.item.target[0] - orig[0];
        it.target[1] += base.item.target[1] - orig[1];
      }
    }
    put(it.p.part, boxMid(it.p.part), it.target, it.p.rot || 0, it.y,
      { layer: 'prop', propKind: 'floor', g: it.p.g, zs: it.p.s, propId: it.p.id,
        funke: it.p.funke, flamme: it.p.flamme, deckel: it.p.deckel });
  }

  return { placements: out, corners, freeEnds, notes, seams, eckTeil, eckSchenkel };
}
