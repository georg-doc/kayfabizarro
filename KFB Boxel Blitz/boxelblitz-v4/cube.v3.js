/* boxelblitz-v4/cube.v3.js — FORK VON `cube.v2.js`. EINE ÄNDERUNG DRIN: DAS MATERIALMODELL.

   ⚠ DER DEFEKT, DEN DAS BEHEBT — Georgs Wort war »nasser Sack«, und es war die richtige
   Beschreibung. Gemessen (06.09.): Fall aus 4 Zellen auf das blanke Blatt → EIN Abpraller von
   0,21 Zellen. Das Blatt ist im Design-Dokument ein TRAMPOLIN (0,62). Ursache, eine Zeile:
   `world.defaultContactMaterial.restitution = 0.3` war die EINZIGE Restitution im Aufbau — die
   Zahl des Vorbilds, das genau EINE Oberfläche hat (einen unendlichen Tisch). Unser Spiel hat
   SECHS, und sie waren auf einen Wert zusammengefallen:

     Blatt 0,62 · Boxel-Deck 0,30 · Boxel-Flanke 0,38 · Bumper 0,92 · Bande 0,42 · Decke 0,55

   In cannon heißt das: je Oberfläche ein `Material`, je Paar (Würfel × Oberfläche) ein
   `ContactMaterial`. Kein Regler, ein fehlender BAUTEIL — er steht in `./surfaces.v1.js`, das
   nichts anderes kann als diese zwei Zahlen je Paar zu besitzen.
   Die Zahlen kommen aus `boxelball-v1/dice.v1.js` Z. 62–66 und dem Design-Dokument §2, die
   Reibung 0,72 aus der SSOT §2.1 für ALLE Paare — damit der Unterschied im Bild allein von der
   Restitution kommt und nicht von einer zweiten, ungemessenen Größe.

   ⚠ EINE ZELLE HAT ZWEI OBERFLÄCHEN, UND DAS GEHT IN EINEM KÖRPER. Ein Klotz wird oben getroffen
   (Deck, stumpf) und seitlich (Flanke, mittel). cannon löst die Paarung in dieser Reihenfolge auf:
   Material am SHAPE, dann am BODY, dann Vorgabewert (`Narrowphase.ts` Z. 377–380). GEMESSEN, nicht
   geglaubt: ein Körper, dessen BODY-Paar auf 0 steht und dessen SHAPE-Paar auf 0,92, prallt mit
   gemessenem 0,912 ab — das Shape gewinnt. Also trägt jede Zelle ZWEI Kästen: den Rumpf mit der
   Flanke und eine dünne Deckplatte obendrauf. Der Rumpf endet knapp unter der Oberkante, damit die
   Deckfläche eindeutig der Platte gehört und nicht zwei Materialien am selben Punkt streiten.

   UNVERÄNDERT: Schnittstelle, Schwere, Zeitschritt, glatter Kollisionskasten, `sleepTimeLimit`,
   die Kanten-Regel des Vorbilds, die Keil-Regel aus V4-S7b, der Wurf als Impuls an einem
   versetzten Punkt. Bumper-Kick und Umlenker bleiben dem SPIEL (`dice.v4.js` Z. 466 gibt den Kick
   als Impuls zurück) — dieses Modul entscheidet nichts über Spielregeln.

   RÜCKWEG: in `dice.v4.js` die Importzeile auf `./cube.v2.js`.

   ── DAS GERÜST DARUNTER IST UNVERÄNDERT cube.v2 ────────────────────────────────────────────────
   VORBILD, von Georg geliefert (06.09.): `github.com/uuuulala/Threejs-rolling-dice-tutorial`
   (MIT, Codrops/Ksenia Kondrashova). Wörtlich übernommen sind die Entscheidungen, die dort das
   Verhalten machen — nicht nachgebaut, sondern übernommen:
     · eine ECHTE Physik-Engine: `cannon-es`, als ES-Modul über die Importkarte, ohne Bauwerkzeug
     · Schwere −50 bei Würfelkante 1,0  → hier maßstäblich umgerechnet (siehe unten)
     · `world.defaultContactMaterial.restitution = 0.3`
     · `allowSleep: true` und `sleepTimeLimit: 0.1` am Körper
     · Kollisionskörper ist ein GLATTER `Box`, obwohl das Netz abgerundete Kanten hat
     · der Wurf ist `applyImpulse(kraft, versatz)` — ein Impuls an einem VERSETZTEN Punkt
     · UND DIE ANTWORT AUF »ER LIEGT AUF DER KANTE«: beim `sleep`-Ereignis wird geprüft, ob er auf
       einer Fläche liegt; wenn nicht, wird `allowSleep` wieder eingeschaltet und gewartet, bis er
       umfällt. Keine Korrektur der Lage, kein Einrasten, kein Anstoß von außen.

   ⚠ WAS DAMIT WIDERLEGT IST — MEINE EIGENE ENTSCHEIDUNG. `docs/boxelblitz-v4/MODELL_wuerfel_v1.md`
   §3 begründet einen EIGENEN Löser mit drei Argumenten (Wiederholbarkeit, das Raster ist einfach,
   eine Engine ist eine Fassungs-Baustelle). Das Vorbild zeigt alle drei als hinfällig: es läuft
   ohne Bauwerkzeug, es ist deterministisch bei festem Schritt, und es ist genau der Fall, den wir
   haben. Mein Löser hat in fünf Runden fünf falsch gebaute Abnahmezahlen produziert und kam auf
   8 von 10 flachen Landungen. Ein Vorbild schlägt eine Begründung.

   SCHNITTSTELLE UNVERÄNDERT zu `cube.v1.js` — `dice.v4.js` merkt vom Wechsel nur die Importzeile.
   RÜCKWEG: in `dice.v4.js` die Zeile auf `./cube.v1.js`.

   MASSSTAB: Einheit ist die ZELLBREITE, Höhe ist `z` (kartenlokal, die Karte kippt mit).
   Das Vorbild hat Kante 1,0 und Schwere 50; unsere Kante ist 0,68 → `g = 50 · 0,68 = 34`
   (gleiche Kennzeit `√(s/g)`, also dasselbe Tempo-Gefühl). Das ist eine Umrechnung, keine Wahl.
   ──────────────────────────────────────────────────────────────────────────────────────────────── */

import * as CANNON from 'cannon-es';
import { createSurfaces } from './surfaces.v1.js?b1';

const V = (x = 0, y = 0, z = 0) => ({ x, y, z });

/* ============================ Welten (Schnittstelle wie cube.v1) ============================ */
export function makeFlatWorld(z0 = 0, ext = 40, ceil = 1e6) {
  return { cell: 1, name: 'flach', surfaceAt: () => z0,
           bounds: { x0: -ext, x1: ext, y0: -ext, y1: ext }, ceil,
           cellAt: () => null, cellBox: () => null,
           /** Statische Kästen der Welt. Leer = nur Boden und Banden. */
           cellList: () => [], version: () => 'flach:' + z0 };
}
export function makeStepWorld(h = 0.78, xs = 2, ext = 40, ceil = 1e6) {
  return { cell: 1, name: 'stufe', surfaceAt: (x) => (x >= xs ? h : 0),
           bounds: { x0: -ext, x1: ext, y0: -ext, y1: ext }, ceil,
           cellAt: () => null,
           cellBox: (x) => (x >= xs ? { x0: xs, x1: ext, y0: -ext, y1: ext } : null),
           cellList: () => [{ key: 'stufe', x: (xs + ext) / 2, y: 0, w: ext - xs, h: 2 * ext, top: h }],
           version: () => 'stufe:' + h + ':' + xs };
}
/** Das Spielfeld: jede sitzende Zelle ist ein statischer Kasten. */
export function makeGridWorld(boxel, stage) {
  const g = boxel.geometry();
  const cl = stage.metrics().cardLocal;
  const inv = 1 / g.cell;
  const api = {
    cell: g.cell, name: 'feld', ceil: 1e6,
    surfaceAt: (x, y) => boxel.surfaceAt(x * g.cell, y * g.cell) * inv,
    cellAt: (x, y) => boxel.cellOf(x * g.cell, y * g.cell),
    bounds: { x0: (cl.cx - cl.w / 2) * inv, x1: (cl.cx + cl.w / 2) * inv,
              y0: (cl.cy - cl.h / 2) * inv, y1: (cl.cy + cl.h / 2) * inv },
    cellBox: (x, y) => {
      const k = boxel.cellOf(x * g.cell, y * g.cell); if (!k) return null;
      const c = boxel.center(k.c, k.r);
      return { x0: (c.x - g.cell / 2) * inv, x1: (c.x + g.cell / 2) * inv,
               y0: (c.y - g.rowH / 2) * inv, y1: (c.y + g.rowH / 2) * inv };
    },
    cellList() {
      const out = [];
      for (let c = 0; c < g.cols; c++) for (let r = 0; r < g.rows; r++) {
        const cell = boxel.at(c, r);
        if (!cell || !cell.alive || cell.state !== 'seated') continue;
        const p = boxel.center(c, r);
        out.push({ key: c + ':' + r, c, r, x: p.x * inv, y: p.y * inv,
                   w: 1, h: (g.rowH / g.cell), top: (g.hgt * cell.lvl) * inv,
                   /* NEU in v3: das GESICHT reist mit — ein Bumper ist eine andere Oberfläche als
                      ein gewöhnlicher Klotz, und die Physik muss das wissen. */
                   face: cell.face || null });
      }
      return out;
    },
    version() { return 'feld:' + boxel.stats().seated + ':' + boxel.stats().alive; },
  };
  return api;
}

/* ============================ die gemeinsame Physikwelt ============================ */
/* EINE Welt je Spielwelt — die Würfel teilen sie, sonst sehen sie sich nicht (das Vorbild hat
   genau eine `physicsWorld`). Sie wird beim ersten Körper gebaut und hält ihre statischen
   Kästen mit dem Feld synchron. */
const welten = new WeakMap();

function holeWelt(world, P) {
  let W = welten.get(world);
  if (W) return W;
  const w = new CANNON.World({ allowSleep: true, gravity: new CANNON.Vec3(0, 0, -P.gravity) });
  /* ⚠ HIER STAND DIE EINE GLOBALE RESTITUTION (0,3, die Zahl des Vorbilds) — der »nasse Sack«.
     Jetzt besitzt `surfaces` sechs Paare, und der VORGABEWERT der Welt steht auf 0: ein
     vergessenes Paar klebt dann sofort auffällig, statt still »irgendwie« zu prallen. */
  const surf = createSurfaces({ world: w });
  /* Boden: das Blatt — im Vorbild eine unendliche `Plane`, hier mit dem Trampolin-Material. */
  const boden = new CANNON.Body({ type: CANNON.Body.STATIC, shape: new CANNON.Plane(),
                                  material: surf.materialFor('paper') });
  w.addBody(boden);
  /* Banden: vier senkrechte Flächen am Kartenrand (das Vorbild braucht keine, dieses Spiel schon —
     Design-Dokument §2). Als `Plane` mit Drehung, damit sie unendlich hoch sind.
     ⚠ EINE `Plane` ZEIGT IN CANNON LOKAL NACH +Z. Eine Drehung um y mit θ schickt sie nach
     (sinθ, 0, cosθ), um x nach (0, −sinθ, cosθ). Die Bande muss INS FELD zeigen, sonst steht der
     Würfel auf der falschen Seite einer unendlichen Wand und wird nach außen gedrückt — meine
     erste Fassung hatte alle vier verkehrt. (Das Vorbild `getting-started.md` dreht seinen Boden
     um −π/2, weil dort y oben ist; hier ist z oben, der Boden braucht KEINE Drehung.) */
  const bd = world.bounds;
  const wand = (px, py, achse, winkel) => {
    const b = new CANNON.Body({ type: CANNON.Body.STATIC, shape: new CANNON.Plane(),
                                material: surf.materialFor('band') });
    b.position.set(px, py, 0);
    b.quaternion.setFromAxisAngle(new CANNON.Vec3(achse.x, achse.y, achse.z), winkel);
    w.addBody(b); return b;
  };
  wand(bd.x0, 0, V(0, 1, 0), Math.PI / 2);
  wand(bd.x1, 0, V(0, 1, 0), -Math.PI / 2);
  wand(0, bd.y0, V(1, 0, 0), -Math.PI / 2);
  wand(0, bd.y1, V(1, 0, 0), Math.PI / 2);
  W = { w, surf, boden, kaesten: new Map(), stand: '', body2cell: new WeakMap() };
  welten.set(world, W);
  return W;
}

/** Statische Kästen mit dem Feld abgleichen — nur bei Änderung, nicht je Bild. */
function syncKaesten(W, world) {
  const stand = world.version();
  if (stand === W.stand) return;
  W.stand = stand;
  const liste = world.cellList();
  const gesehen = new Set();
  for (const z of liste) {
    gesehen.add(z.key);
    let b = W.kaesten.get(z.key);
    const hz = z.top / 2;
    if (!b) {
      /* ⚠ ZWEI KÄSTEN JE ZELLE, EIN KÖRPER. Der Rumpf trägt die FLANKE, die dünne Platte obendrauf
         die DECKFLÄCHE — zwei Oberflächen mit zwei Restitutionen (0,38 gegen 0,30), wie es das
         Design-Dokument verlangt. Der Rumpf endet unter der Oberkante, damit die Deckfläche
         eindeutig der Platte gehört; lägen beide gleich hoch, stründen zwei Materialien am selben
         Punkt und welches gewinnt, wäre Zufall.
         Ein BUMPER ist rundum Bumper (0,92) — sein Zweck ist das Katapult, nicht die Kante. */
      const bump = z.face === 'bumper';
      const deck = Math.min(0.06, Math.max(1e-3, z.top * 0.25));
      const rumpfH = Math.max(1e-4, (z.top - deck) / 2);
      const sRumpf = new CANNON.Box(new CANNON.Vec3(z.w / 2, z.h / 2, rumpfH));
      const sDeck = new CANNON.Box(new CANNON.Vec3(z.w / 2, z.h / 2, deck / 2));
      sRumpf.material = W.surf.materialFor(bump ? 'bumper' : 'flank');
      sDeck.material = W.surf.materialFor(bump ? 'bumper' : 'deck');
      b = new CANNON.Body({ type: CANNON.Body.STATIC,
                            material: W.surf.materialFor(bump ? 'bumper' : 'flank') });
      b.addShape(sRumpf, new CANNON.Vec3(0, 0, rumpfH));
      b.addShape(sDeck, new CANNON.Vec3(0, 0, z.top - deck / 2));
      b.position.set(z.x, z.y, 0);
      W.w.addBody(b);
      W.kaesten.set(z.key, b);
      W.body2cell.set(b, { c: z.c, r: z.r, key: z.key });
    }
  }
  for (const [key, b] of W.kaesten) {
    if (!gesehen.has(key)) { W.w.removeBody(b); W.kaesten.delete(key); }
  }
}

/* ============================ der Körper ============================ */
export const CUBE_DEFAULTS = {
  s: 0.68,
  mass: 1,
  /* Vorbild: Schwere 50 bei Kante 1,0 → maßstäblich 50·s (siehe Kopf). */
  gravity: 34,
  restitution: 0.3,      // Vorbild: defaultContactMaterial.restitution = .3
  friction: 0.3,         // cannon-Vorgabe, die das Vorbild unangetastet lässt
  linDamp: 0.01,
  angDamp: 0.01,
  hz: 480,
  maxFrame: 0.25,
  sleepTimeLimit: 0.1,   // Vorbild
  sleepSpeedLimit: 0.15,
  flach: 6,              // »liegt auf einer Fläche«, in Grad — die Prüfung des Vorbilds
  /* V4-S29 · Georgs Regel: ruht er so lange schief, wird er flach gedreht und fällt.
     0,30 s ist lang genug, dass ein echtes Ausrollen nicht angefasst wird (der Würfel schläft
     erst nach `sleepTimeLimit` 0,1 s Ruhe ein), und kurz genug, dass es nicht als Hänger liest. */
  aufrichtZeit: 0.30,
  weckGrenze: 12,        // nicht mehr benutzt — das Budget ist in V4-S29 ersatzlos entfallen
  kippStaerke: 0.42,     // Bruchteil des vollen Kipp-Impulses — GEMESSEN, siehe V4-S13
};

export function createBody(params = {}) {
  const P = Object.assign({}, CUBE_DEFAULTS, params);
  const h = P.s / 2;
  let world = makeFlatWorld(0);
  let W = null, koerper = null, deckel = null;
  let eDecke = 0.55;                       // wird beim Bau vom Eigentümer der Flächen gelesen
  let acc = 0;

  const B = {
    pos: V(0, 0, h), vel: V(), ang: V(), quat: [0, 0, 0, 1],
    state: 'sleeping', grounded: false, sleeping: true,
    weg: 0, drehung: 0, rutsch: 0, rutschZeit: 0, kontakte: 0, kantenLuecke: 0,
    zeit: 0, schritte: 0, maxV: 0, wandTreffer: 0, wandVxVor: 0, wandVxNach: 0, wandKontakte: 0,
    deckeTreffer: 0,
    kippHilfe: 0, kippVersuch: 0, kippHoehe: 0, kanteWartet: 0, keilRuhe: 0, schiefGeschlafen: 0,
    notlandung: 0, schiefRuht: 0, aufgerichtet: 0, kontakteListe: [],
  };

  function baue() {
    W = holeWelt(world, P);
    const dk = W.surf.values().find((v) => v.id === 'ceiling');
    if (dk) eDecke = dk.soll;
    syncKaesten(W, world);
    if (koerper) return;
    /* ⚠ DAS MATERIAL SITZT AM SHAPE **UND** AM BODY. cannon nimmt die Shape-Paarung nur, wenn
       BEIDE beteiligten Shapes ein Material tragen (`Narrowphase.ts` Z. 377) — ohne das Material
       am Würfel-Shape fällt die Zelle stillschweigend auf ihr Body-Material zurück, und Deck und
       Flanke wären wieder EINE Oberfläche. Das Material am Body deckt die Plane-Fälle (Blatt,
       Banden), die keine Shape-Materialien tragen. */
    const sWuerfel = new CANNON.Box(new CANNON.Vec3(h, h, h));   // GLATTER Kasten, wie im Vorbild
    sWuerfel.material = W.surf.cubeMaterial;
    koerper = new CANNON.Body({ mass: P.mass,
      shape: sWuerfel,
      material: W.surf.cubeMaterial,
      sleepTimeLimit: P.sleepTimeLimit, sleepSpeedLimit: P.sleepSpeedLimit,
      linearDamping: P.linDamp, angularDamping: P.angDamp, allowSleep: true });
    koerper.position.set(0, 0, h);
    W.w.addBody(koerper);
    /* DIE ANTWORT DES VORBILDS AUF »LIEGT AUF DER KANTE«: beim Einschlafen prüfen, ob eine Fläche
       nach oben zeigt. Wenn nicht — Schlaf wieder erlauben und WARTEN, bis er umfällt. Keine
       Lagekorrektur. Genau das, was mein eigener Löser mit einem Anstoß erzwingen wollte. */
    koerper.addEventListener('sleep', () => {
      koerper.allowSleep = false;
      /* ⚠⚠ V4-S29 · DER HÜPFER IST WEG. GEORGS LÖSUNG IST EINFACHER UND SAUBERER.
         Sein Befund zum Hüpfer: »der Würfel dreht sich dann ein bisschen, in der Hoffnung, dass er
         eine Position findet, wo er zurückfallen kann — aber das sieht komisch aus, weil er dann oft
         noch mal stehen bleibt, sich noch ein kleines bisschen bewegt und dann etwas unglücklich
         animiert runterfällt.« Genau so war es gebaut: Versuch, Stillstand, Versuch — und weil jeder
         Versuch eine neue Ruhelage erzeugen konnte, war die Bewegung eine Kette von Zuckungen.
         Seine Vorgabe: »ob man nicht automatisch messen kann, wenn er für eine gewisse Zeit ruht
         und nicht auf dem Boden ist, dass man dann halt einfach so dreht, dass er auf die darunter
         liegende Fläche fällt — das wäre die sauberste Lösung.«
         Also: **keine Versuche, keine Eskalation, keine Notlandung.** Eine Bedingung (ruht schief),
         eine Frist, eine Handlung (flach drehen), und den Rest macht die Schwere — EIN Fall statt
         einer Kette von Hüpfern. Die Frist steht in `P.aufrichtZeit`, gemessen wird in `schritt`. */
    });
    koerper.addEventListener('collide', (e) => {
      const zelle = W.body2cell.get(e.body) || null;
      const n = e.contact.ni;
      B.kontakteListe.push({
        art: zelle ? (Math.abs(n.z) > 0.5 ? 'oben' : 'seite') : (e.body === W.boden ? 'oben' : 'wand'),
        zelle: zelle ? { c: zelle.c, r: zelle.r } : null,
        n: V(n.x, n.y, n.z), d: 0,
        p: V(koerper.position.x, koerper.position.y, koerper.position.z),
        wand: !zelle && e.body !== W.boden, decke: false,
        wucht: Math.abs(e.contact.getImpactVelocityAlongNormal()),
      });
    });
  }

  function lese() {
    B.pos = V(koerper.position.x, koerper.position.y, koerper.position.z);
    B.vel = V(koerper.velocity.x, koerper.velocity.y, koerper.velocity.z);
    B.ang = V(koerper.angularVelocity.x, koerper.angularVelocity.y, koerper.angularVelocity.z);
    B.quat = [koerper.quaternion.x, koerper.quaternion.y, koerper.quaternion.z, koerper.quaternion.w];
    B.sleeping = koerper.sleepState === CANNON.Body.SLEEPING;
    const kp = api.contactPoint();
    B.grounded = (kp.z - world.surfaceAt(kp.x, kp.y)) < P.s * 0.06 || B.kontakteListe.length > 0;
    B.kontakte = B.kontakteListe.length;
    B.state = B.sleeping ? 'sleeping' : (!B.grounded ? 'airborne'
             : (Math.hypot(B.vel.x, B.vel.y) > 0.2 ? 'rolling' : 'settling'));
  }

  const ECKEN = [];
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) ECKEN.push(new CANNON.Vec3(sx * h, sy * h, sz * h));

  /** DER ANSTOSS. ⚠ ZWEITE FASSUNG — die erste hat in Georgs Fall ZWÖLFMAL vergeblich gefeuert.
      Gemessen (06.09. 07:14, sein laufendes Fenster): `schiefe 39,58°` · `schlaeft true` ·
      `sohle 0,311` · `kontakte 0` · **`kippHilfe 12`** · `schiefGeschlafen 1`. Nachbarschaft: eine
      **eine Zelle breite Rinne** (zwei tote Zellen, alle übrigen 0,78 hoch).
      DIE RECHNUNG SAGT, WARUM ER STECKT: ein Kasten der Kante 0,66, um 39,6° gekippt, spannt quer
      **0,66·(cos39,6+sin39,6) = 0,93** — die Rinne ist **1,00** breit. Er ist diagonal verkeilt wie
      ein Buch im Schlitz, mit 0,07 Spiel. Ein Drehimpuls IN dieser Ebene treibt seine Ecken gegen
      die Wände; die Reibung hält ihn, und er schläft wieder ein. Mehr Drehmoment hätte daran nichts
      geändert — die Richtung war falsch, nicht die Stärke.
      ALSO MUSS ER DEN SCHLITZ VERLASSEN: die Höhe ist abgeleitet aus der **gemessenen Wandhöhe um
      ihn herum** (er muss oben herauskommen, nicht ein bisschen wackeln): `vz = √(2·g·Δh)` mit
      Δh = Wandhöhe − Sohle + eine halbe Kante Luft. Dazu die Drehung Richtung flach. Das ist ein
      sichtbarer Hüpfer, den die Physik danach selbst auflöst — und er kann nicht an Reibung
      scheitern, weil der Würfel den Schlitz ganz verlässt. */
  /** V4-S29 · Flach drehen und fallen lassen — die einzige Handlung für einen schief ruhenden
      Würfel. Sie setzt die LAGE nicht: Ort bleibt, Tempo null, Schwere macht den Rest. Damit ist es
      keine Lagekorrektur im Sinne der drei gescheiterten Fassungen (die haben ihn gedreht, WÄHREND
      er lag, und ihn dabei tiefer verkeilt) — sondern das Auflösen einer Klemmlage in einen Fall. */
  function aufrichten() {
    const q = koerper.quaternion;
    const gier = Math.atan2(2 * (q.w * q.z + q.x * q.y), 1 - 2 * (q.y * q.y + q.z * q.z));
    koerper.quaternion.set(0, 0, Math.sin(gier / 2), Math.cos(gier / 2));
    koerper.velocity.setZero();
    koerper.angularVelocity.setZero();
    koerper.allowSleep = true;
    koerper.wakeUp();
    B.aufgerichtet++;
    lese();
    return true;
  }

  function kippAnstoss() {
    /* ⚠ DRITTE FASSUNG — die zweite hat in der gebauten Rinne SECHSMAL gefeuert und ihn dabei
       SCHLIMMER verkeilt: von 39,6° auf 42,7°, Sohle 0,31 → 0,34. Der Grund ist die Drehung: in
       einem Schlitz wächst die Querspanne mit dem Kippwinkel (0,66·(cosα+sinα)), und meine Drehung
       »Richtung flach« hat ihn beim Steigen höher hinein gedreht. **Eine Lagekorrektur war schon
       zweimal die falsche Antwort.** Also: KEINE Drehung mehr. Ein reiner HüPFER aus dem Schlitz
       heraus, mit Drift in die Richtung, in der die Wand am NIEDRIGSTEN ist — danach entscheidet
       die Physik allein, wie er landet (genau die Haltung des Vorbilds: keine Pose von Hand). */
    const px = koerper.position.x, py = koerper.position.y;
    let wand = 0, offen = null, tiefste = Infinity;
    for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const s = world.surfaceAt(px + ox * P.s, py + oy * P.s);
      if (s > wand) wand = s;
      if (s < tiefste) { tiefste = s; offen = [ox, oy]; }
    }
    const kp = api.contactPoint();
    /* ⚠ ESKALATION statt Budget: jeder weitere Versuch hüpft höher. In Georgs Grube hat die
       gleichbleibende Höhe sechsmal nicht gereicht — eine Zahl, die sechsmal dasselbe tut, ist
       keine zweite Chance. */
    const stufe = Math.min(4, B.kippVersuch);
    const dh = Math.max(P.s * 0.6, wand - kp.z + P.s * 0.6) * (1 + 0.4 * stufe);
    /* ⚠ DIE NOTLANDUNG — und sie ist ausdrücklich eine Lüge über die Physik.
       Ab dem fünften Versuch wird der Würfel flach auf die Fläche unter seiner MITTE gesetzt,
       Gierung bleibt (damit er nicht sichtbar herumspringt), Tempo null. Begründung: ein Würfel,
       der nicht freikommt, beendet die Runde nie — und ein Spiel, das hängt, ist teurer als ein
       Bild, das für ein Bild unphysikalisch ist. Sie wird GEZÄHLT (`notlandung`), damit sie nicht
       still zur Regel wird: taucht die Zahl regelmäßig auf, ist der Hüpfer falsch gebaut. */
    if (B.kippVersuch >= 5) {
      const grund = world.surfaceAt(px, py);
      const q = koerper.quaternion;
      /* Gierung aus der aktuellen Lage behalten, Kippung und Rollen auf null. */
      const gier = Math.atan2(2 * (q.w * q.z + q.x * q.y), 1 - 2 * (q.y * q.y + q.z * q.z));
      koerper.quaternion.set(0, 0, Math.sin(gier / 2), Math.cos(gier / 2));
      koerper.position.set(px, py, grund + h);
      koerper.velocity.setZero();
      koerper.angularVelocity.setZero();
      B.notlandung++;
      B.kippVersuch = 0;
      lese();
      return true;
    }
    const vz = Math.sqrt(2 * P.gravity * dh);
    const tFlug = 2 * vz / P.gravity;
    const vh = offen ? 1 / Math.max(0.05, tFlug) : 0;    // eine Zellbreite während des Flugs
    koerper.angularVelocity.set(0, 0, 0);
    koerper.velocity.set(offen ? offen[0] * vh : 0, offen ? offen[1] * vh : 0, vz);
    B.kippHilfe++;
    B.kippVersuch++;
    B.kippHoehe = +dh.toFixed(3);
    return true;
  }
  const api = {
    P, get body() { return B; },
    /** Griff auf den Eigentümer der Restitutionen — eine Abnahme muss sie drehen können, ohne im
        Modul zu graben (und ohne eine zweite Stelle zu bauen, die sie schreibt). */
    surfaces() { baue(); return W.surf; },
    setWorld(w) { world = w; if (koerper && W) { W.w.removeBody(koerper); koerper = null; } baue(); return api; },
    world() { return world; },
    setCeil(z) { deckel = z; return api; },
    /** Drehlage setzen — die Engine besitzt sie, also geht es nur hier durch. */
    setQuat(x, y, z, w) { baue(); koerper.quaternion.set(x, y, z, w); lese(); return api; },
    setPose(x, y, zUnten) {
      baue();
      B.kippVersuch = 0;                 // neue Lage, neues Budget für das Freikommen
      koerper.wakeUp(); koerper.allowSleep = true;
      koerper.velocity.setZero(); koerper.angularVelocity.setZero();
      koerper.position.set(x, y, zUnten + h);
      koerper.quaternion.set(0, 0, 0, 1);
      B.weg = 0; B.drehung = 0; B.wandTreffer = 0; B.kanteWartet = 0; B.keilRuhe = 0;
      B.kontakteListe = [];
      lese(); return api;
    },
    place(x, y) { baue(); return api.setPose(x, y, world.surfaceAt(x, y)); },
    /** Wurf = Impuls an einem VERSETZTEN Punkt (Vorbild `applyImpulse(kraft, versatz)`).
        `hoch` ist der Versatz nach oben in halben Kanten — das Vorbild wirft mit (0,0,0.2)
        bei Kante 1,0, also 0,4 halbe Kanten. */
    flick(dir, strength, hoch = 0.4) {
      baue();
      const l = Math.hypot(dir.x, dir.y, dir.z || 0) || 1;
      koerper.wakeUp(); koerper.allowSleep = true;
      koerper.applyImpulse(
        new CANNON.Vec3(dir.x / l * strength * P.mass, dir.y / l * strength * P.mass, 0),
        new CANNON.Vec3(0, 0, hoch * h));
      lese(); return api;
    },
    push(v) { baue(); koerper.wakeUp();
      koerper.velocity.set(koerper.velocity.x + v.x, koerper.velocity.y + v.y, koerper.velocity.z + v.z);
      return api; },
    addSpin(v) { baue(); koerper.wakeUp();
      koerper.angularVelocity.set(koerper.angularVelocity.x + v.x, koerper.angularVelocity.y + v.y,
                                  koerper.angularVelocity.z + v.z);
      return api; },
    step(dt) {
      baue(); syncKaesten(W, world);
      B.kontakteListe = [];
      const vor = { x: koerper.position.x, y: koerper.position.y };
      /* ⚠ `step(dt)`, NICHT `fixedStep()`. Das Vorbild ruft `fixedStep()` je Bild — die Methode
         führt aber eine EIGENE Uhr (`performance.now`) und ist damit für eine von Hand getriebene,
         wiederholbare Messung unbrauchbar (Hausregel: eine Uhr ist kein Lagekriterium, und ein
         Messwerkzeug darf nicht seine eigene Zeit erfinden). `getting-started.md` nennt `step(dt)`
         ausdrücklich als den Griff für selbst gerechnete Zeit. */
      W.w.step(dt);
      /* ⚠ DIE DECKE WAR IM FORK VERLOREN. Die v1 hielt sie als REGEL
         (`if (d.z > F.ceil) { d.z = F.ceil; d.vz = -|d.vz|·eCeil; }`, dice.v1.js Z. 661) — in
         cannon gibt es keinen Körper dafür, und der Wirt hat sie nur für den EINWURF mitgegeben.
         Gemessen (Audit, 12 gesäte Würfe): **594 Bilder über der Decke**. Das ist Georgs »der
         Würfel springt ohne Kontakt weiter«: nach einem Bumper-Kick (11 Zellbreiten/s, Gipfel
         2,5 Zellen) verlässt er das Spielfeld nach OBEN und kommt irgendwo wieder herunter.
         Also dieselbe Regel wie in der v1, hier am Körper, mit der Restitution der Decke (0,55)
         aus dem Eigentümer der Zahlen. RÜCKWEG: `setCeil(null)`. */
      if (deckel != null && (koerper.position.z - h) > deckel) {
        koerper.position.z = deckel + h;
        if (koerper.velocity.z > 0) koerper.velocity.z = -koerper.velocity.z * eDecke;
        B.deckeTreffer++;
        B.kontakteListe.push({ art: 'decke', zelle: null, n: V(0, 0, -1), d: 0,
          p: V(koerper.position.x, koerper.position.y, koerper.position.z),
          wand: false, decke: true, wucht: Math.abs(koerper.velocity.z) });
      }
      /* ── V4-S29 · RUHT ER SCHIEF, WIRD ER FLACH GEDREHT UND FÄLLT ───────────────────────────
         Georgs Regel, wörtlich umgesetzt. Kein Budget, kein Aufgeben — solange er schief ruht,
         läuft die Frist wieder an. Die Gierung bleibt erhalten, damit er sich nicht sichtbar
         herumdreht; Kippung und Rollen gehen auf null, und dann fällt er von selbst. */
      /* ⚠ »RUHT« IST GEMESSENE STILLE, NICHT DIE SCHLAF-FAHNE DER ENGINE. Erste Fassung fragte
         `B.sleeping` — gemessen ist die Regel damit in **0 von 4** Fällen gefeuert, und der eine
         schiefe Fall blieb bei 39,9° liegen: cannon legt einen Körper, der mit kleinen Stößen
         zwischen zwei Wänden zittert, NIE schlafen (sein Tempo bleibt über `sleepSpeedLimit`).
         Genau die Lage, um die es geht, ist also die, in der die Fahne nie kommt.
         Georgs Wort war »ruht« — und das heißt praktisch bewegungslos, nicht »die Engine hat es
         beschlossen«. Also Tempo und Drehtempo selbst prüfen. */
      const spv = Math.hypot(koerper.velocity.x, koerper.velocity.y, koerper.velocity.z);
      const spa = Math.hypot(koerper.angularVelocity.x, koerper.angularVelocity.y,
                             koerper.angularVelocity.z);
      const still = B.sleeping || (spv < P.sleepSpeedLimit * 2 && spa < 0.8);
      /* ⚠ ZWEITE STUFE, weil »still« allein nicht reicht: gemessen blieb einer von sechs Fällen bei
         35,1° liegen und ZITTERTE dabei so stark, dass die Stille-Schwelle nie erreicht wurde. Ein
         Würfel, der sich zwischen zwei Wänden reibt, ist nicht still — steckt aber genauso fest.
         Also zählt auch LANGSAM, nur dreimal so lange: echtes Rollen ist schneller als 1,5
         Zellbreiten/s, ein Klemmen nicht. Ein Zähler, zwei Geschwindigkeiten — und kein Tor, das
         zugeht. */
      const langsam = spv < 1.5 && spa < 3;
      if (langsam && api.schiefe() > P.flach) {
        B.schiefRuht += dt * (still ? 1.8 : 1);
        if (B.schiefRuht >= P.aufrichtZeit * 1.8) { B.schiefRuht = 0; aufrichten(); }
      } else B.schiefRuht = 0;
      B.schritte++; B.zeit += dt;
      B.weg += Math.hypot(koerper.position.x - vor.x, koerper.position.y - vor.y);
      B.drehung += Math.hypot(koerper.angularVelocity.x, koerper.angularVelocity.y,
                              koerper.angularVelocity.z) * dt;
      lese();
      if (B.kontakteListe.some((k) => k.wand)) { B.wandTreffer++; B.wandKontakte = B.kontakteListe.length; }
      return api;
    },
    update(dt) {
      const d = Math.min(P.maxFrame, Math.max(0, dt));
      acc += d; const fix = 1 / P.hz; let n = 0;
      while (acc >= fix && n < P.hz * P.maxFrame + 2) { api.step(fix); acc -= fix; n++; }
      return n;
    },
    contacts() { return B.kontakteListe; },
    /** Schiefe: Winkel der am ehesten nach oben zeigenden Flächennormale zur Hochachse, in GRAD.
        NUR die Hochachse — eine Drehung um die Hochachse ist keine Schieflage (der Fehler, der
        `cube.v1` das Einschlafen verboten hat). */
    schiefe() {
      if (!koerper) return 0;
      let best = 0;
      for (const a of [new CANNON.Vec3(1, 0, 0), new CANNON.Vec3(0, 1, 0), new CANNON.Vec3(0, 0, 1)]) {
        const w = koerper.quaternion.vmult(a);
        best = Math.max(best, Math.abs(w.z));
      }
      return Math.acos(Math.min(1, best)) * 180 / Math.PI;
    },
    contactPoint() {
      if (!koerper) return V(0, 0, 0);
      let tief = null;
      for (const e of ECKEN) {
        const p = koerper.quaternion.vmult(e);
        const q = V(koerper.position.x + p.x, koerper.position.y + p.y, koerper.position.z + p.z);
        if (!tief || q.z < tief.z) tief = q;
      }
      return tief;
    },
    hoehe() { const p = api.contactPoint(); return p.z - world.surfaceAt(p.x, p.y); },
    stats() {
      const sp = Math.hypot(B.vel.x, B.vel.y, B.vel.z);
      const wl = Math.hypot(B.ang.x, B.ang.y, B.ang.z);
      return { version: 'cube-v3.0-cannon-material', welt: world.name, zustand: B.state,
               lage: [+B.pos.x.toFixed(4), +B.pos.y.toFixed(4), +B.pos.z.toFixed(4)],
               tempo: +sp.toFixed(4), winkeltempo: +wl.toFixed(4),
               boden: B.grounded, schlaeft: B.sleeping, kontakte: B.kontakte,
               hoeheUeberFlaeche: +api.hoehe().toFixed(5),
               schiefeGrad: +api.schiefe().toFixed(2),
               kanteWartet: B.kanteWartet, keilRuhe: B.keilRuhe, deckeTreffer: B.deckeTreffer,
               kippHilfe: B.kippHilfe, kippVersuch: B.kippVersuch, kippHoehe: B.kippHoehe,
               notlandung: B.notlandung, aufgerichtet: B.aufgerichtet,
               schiefRuht: +B.schiefRuht.toFixed(3),
               schiefGeschlafen: B.schiefGeschlafen,
               decke: deckel,
               /** Liegt er still, aber schief? Die Frage, die das SPIEL beantworten muss. */
               ruhtSchief: (Math.hypot(B.vel.x, B.vel.y, B.vel.z) < 0.05
                            && Math.hypot(B.ang.x, B.ang.y, B.ang.z) < 0.1
                            && +api.schiefe().toFixed(2) >= P.flach),
               weg: +B.weg.toFixed(3), drehung: +B.drehung.toFixed(3),
               rollverhaeltnis: B.weg > 1e-6 ? +(B.drehung * h / B.weg).toFixed(3) : null,
               kantenLuecke: B.kantenLuecke, kante: +P.s.toFixed(3),
               /* Die sechs Paare, damit eine Abnahme sie sehen kann, ohne im Modul zu graben. */
               flaechen: W ? W.surf.values() : null,
               paare: W ? W.surf.pruefePaare() : null,
               statischeKaesten: W ? W.kaesten.size : 0,
               zeit: +B.zeit.toFixed(3), schritte: B.schritte };
    },
  };
  return api;
}

/* ============================ Vorrichtungen ============================ */
export function runFixtures() {
  const R = [];
  const lauf = (b, sek) => { const n = Math.round(sek * b.P.hz); for (let i = 0; i < n; i++) b.step(1 / b.P.hz); };

  { const b = createBody(); b.setWorld(makeFlatWorld(0)); b.place(0, 0);
    const soll = b.P.s / 2; lauf(b, 1.5); const s = b.stats();
    R.push({ nr: '01 ruhender Würfel', soll: 'z = Träger + s/2, schläft, flach',
      mess: { zAbweichung: +(s.lage[2] - soll).toFixed(6), schiefe: s.schiefeGrad,
              schlaeft: s.schlaeft, versatz: +Math.hypot(s.lage[0], s.lage[1]).toFixed(6) },
      ok: Math.abs(s.lage[2] - soll) < 2e-3 && s.schiefeGrad < 1 && s.schlaeft }); }

  { const b = createBody(); b.setWorld(makeFlatWorld(0)); b.place(0, 0);
    b.flick(V(1, 0, 0), 6); lauf(b, 6); const s = b.stats();
    R.push({ nr: '02 gerader Rollstoß', soll: 'dreht sich (Verhältnis > 0,3), kommt flach zur Ruhe',
      mess: { weg: s.weg, drehung: s.drehung, rollverhaeltnis: s.rollverhaeltnis,
              schiefe: s.schiefeGrad, schlaeft: s.schlaeft },
      ok: s.schlaeft && s.schiefeGrad < 2 && s.rollverhaeltnis > 0.3 }); }

  { const b = createBody(); b.setWorld(makeFlatWorld(0)); b.place(0, 0);
    b.body.vel = V(); b.push(V(0, 0, 10));
    const gipfel = []; let steig = false, letzte = b.hoehe();
    for (let i = 0; i < b.P.hz * 4; i++) { b.step(1 / b.P.hz); const hh = b.hoehe();
      if (hh > letzte + 1e-5) steig = true;
      else if (steig && hh < letzte - 1e-5) { if (letzte > 0.002) gipfel.push(+letzte.toFixed(4)); steig = false; }
      letzte = hh; }
    /* Gipfel unter 0,002 Zellbreiten (= 0,08 Bildpunkte) sind Rauschen, kein Abprall — ohne diese
       Schranke meldete die Reihe 0 → 0,0001 als »nicht fallend« und die Probe rot bei gesundem
       Körper. Sechster Fall derselben Fehlerklasse; hier gefangen, bevor er etwas gekostet hat. */
    const fallend = gipfel.every((v, i) => i === 0 || v <= gipfel[i - 1] + 1e-6);
    R.push({ nr: '04 senkrechter Sprung', soll: 'Gipfel fallen, Ende flach und in Ruhe',
      mess: { gipfel: gipfel.slice(0, 5), schiefe: b.stats().schiefeGrad, schlaeft: b.stats().schlaeft },
      ok: gipfel.length >= 1 && fallend && b.stats().schlaeft && b.stats().schiefeGrad < 2 }); }

  { const b = createBody(); b.setWorld(makeFlatWorld(0, 3)); b.place(0, 0);
    b.flick(V(1, 0, 0), 14);
    for (let i = 0; i < b.P.hz * 3 && !b.body.wandTreffer; i++) b.step(1 / b.P.hz);
    const treffer = b.body.wandTreffer; lauf(b, 3); const s = b.stats();
    R.push({ nr: '05 Bande', soll: 'er trifft die Bande und bleibt im Feld',
      mess: { treffer, endX: s.lage[0], grenze: 3, schlaeft: s.schlaeft, schiefe: s.schiefeGrad },
      ok: treffer > 0 && Math.abs(s.lage[0]) <= 3 + b.P.s }); }

  { const b = createBody(); b.setWorld(makeStepWorld(0.78, 2)); b.place(0, 0);
    b.flick(V(1, 0, 0), 9); lauf(b, 5); const s = b.stats();
    R.push({ nr: '09 Stufe', soll: 'hinauf oder abprallen, am Ende flach in Ruhe',
      mess: { endX: s.lage[0], oben: s.lage[0] >= 2, hoehe: s.hoeheUeberFlaeche,
              schiefe: s.schiefeGrad, schlaeft: s.schlaeft },
      ok: s.schlaeft && s.schiefeGrad < 2 }); }

  { /* Die Probe, an der `cube.v1` gescheitert ist: aus Schieflage MUSS er flach fallen. */
    const werte = [];
    for (const grad of [20, 35, 40, 45, 50, 60, 70]) {
      const b = createBody(); b.setWorld(makeFlatWorld(0));
      const a = grad * Math.PI / 180;
      b.setPose(0, 0, 0.36 * (Math.abs(Math.cos(a)) + Math.abs(Math.sin(a))) - b.P.s / 2);
      b.setQuat(Math.sin(a / 2), 0, 0, Math.cos(a / 2));
      lauf(b, 4);
      werte.push({ start: grad, ende: b.stats().schiefeGrad, schlaeft: b.stats().schlaeft,
                   wartet: b.body.kanteWartet });
    }
    R.push({ nr: '10 aus Schieflage', soll: 'jede Startlage endet flach (< 2°) — außer genau 45°',
      /* 45,000° ist die KIPPKANTE eines Würfels: der Schwerpunkt steht exakt über der Unterkante,
         das Drehmoment ist null, er bleibt stehen. Das Vorbild behandelt genau diesen Fall
         ausdrücklich (»landed on edge ⇒ wait to fall on side«) und korrigiert die Lage NICHT.
         In einem Wurf ist er unerreichbar — er verlangt 45,000° bei Winkeltempo null. */
      mess: { werte, knifeEdge: '45° ausgenommen, mit Begründung' },
      ok: werte.filter((w) => w.start !== 45).every((w) => w.ende < 2 && w.schlaeft) }); }

  return { bestanden: R.filter((r) => r.ok).length, von: R.length,
           offen: ['06 Würfel gegen Würfel — cannon löst es mit, ist aber nicht abgenommen'],
           tabelle: R };
}
