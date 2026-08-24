# KFB Pet Studio v4 — Full Export / Handover

**Für einen Claude-Design-Kollegen, der Cube-Pets mit Sprechblase und KFB-Ink-Outline benutzen will —
fehlerfrei, beim ersten Anlauf.**
Stand 2026-08-24 · Quelle: Projekt „Pet Studio + 3D Table/Diorama KFB" · Kanon-Repo `georg-doc/kayfabizarro`

---

## 0 · In 60 Sekunden

```
export_petstudio_v4/
├── KFB Pet Studio v4.dc.html      ← die lauffähige Bench (Referenz-Verdrahtung)
├── support.js                     ← DC-Runtime, NICHT anfassen
├── studio-v3/
│   ├── pet-library.v6.js          Körper, GLB, Material, Squash-Feder   (Character)
│   ├── pet-eye-rig.v5.js          Augen, Lider, Blick, Blinzeln          (EyeRig)
│   ├── pet-mouth.v1.js            Mund: 13 Decals, 5 Viseme, Shrinkwrap  (PetMouth)
│   ├── pet-puppet.v1.js           Treiber-Vertrag: speak/expression/camera (Puppet)
│   ├── pet-motion.v2.js           Bewegungen (in v4 NICHT eingehängt, siehe §7)
│   ├── kfb-pets.json              Export-Contract (ein Eintrag je Pet)
│   ├── motion-LIBRARY.v2.json     Bewegungs-Contract
│   └── PET_EDITOR/pet-LIBRARY.json   Aussehen-Contract (Farbe, Augen, Material, face)
├── bubble/
│   ├── bubble.v1.js               DIE Sprechblase (portiert aus Pet Studio v4 §Blase)
│   └── mirror.v1.js               Asset-Umschrift raw → kayfabizarro.pages.dev (PFLICHT, §3)
├── ink/
│   ├── kfb-ink-canon.js           Tusche-Kanon: band · stroke · tube · figure
│   └── KFB_INK_OUTLINE_STYLE_v2.md  Die Spec dahinter
└── docs/
    ├── PET_STUDIO_v4.md           Ist-Stand der Bench, §7 = Backlog
    └── EMBED_CUBE_PET_FULL_v2.md  Volle Einbau-Doku (v2.2), §16 = Puppeting
```

**Alles Schwere fehlt absichtlich** — GLBs, Mund-PNGs, Texturen, Skydome werden zur Laufzeit per
URL geholt. Keine Datei hier ist größer als ~120 kB. Wer sie ins Projekt kopiert, bricht §3.

---

## 1 · Das Minimal-Rezept (kopierfertig)

```html
<helmet>
<script type="importmap">
{ "imports": {
  "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
  "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
} }
</script>
<script type="module">
  import * as THREE from 'three';
  import { installMirror } from './bubble/mirror.v1.js';
  installMirror(THREE);                 // MUSS vor dem ersten Laden stehen (§3)
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
  import { createBubble } from './bubble/bubble.v1.js';
  window.__KIT = { THREE, GLTFLoader, RoomEnvironment, createBubble };
  window.dispatchEvent(new Event('kitready'));
</script>
</helmet>
```

```js
// Im Logik-Teil, NACH dem kitready-Event:
const { THREE, GLTFLoader, RoomEnvironment, createBubble } = window.__KIT;

// Relative Specifier scheitern im blob/eval-Kontext → immer absolut auflösen (§3):
const abs = (rel) => new URL(rel, location.href).href;
const CharMod  = await import(abs('./studio-v3/pet-library.v6.js'));
const RigMod   = await import(abs('./studio-v3/pet-eye-rig.v5.js'));
const MouthMod = await import(abs('./studio-v3/pet-mouth.v1.js'));

const lib = await (await fetch(abs('./studio-v3/PET_EDITOR/pet-LIBRARY.json'))).json();
const pet = lib.pets.find((p) => p.id === 'bunny');

const ch = new CharMod.Character({
  THREE,
  loadGltf: (u) => new Promise((res, rej) => new GLTFLoader().load(u, res, null, rej)),
  makeMat: (o) => myMaterial(o),          // siehe §4: Colormap NICHT übertönen
  mods: ['emotes'],
});
await ch.load(pet);                        // baut ch.group
scene.add(ch.group);

const rig = new RigMod.EyeRig({ THREE, host: ch.group, cfg: lib.face.eye, pet });
rig.build(ch);

const mouth = new MouthMod.PetMouth({ THREE, params: pet.mouth || {} });
mouth.build(ch);                           // NACH ch.load
mouth.refit();                             // NACH jedem Pet-Wechsel

// Blase: sie braucht Kamera + Canvas, weil sie 3D→Bildschirm projiziert.
const bub = createBubble({
  THREE, camera, canvas, host: overlayDiv,
  target: ch.group,                        // der Körper
  home: () => ({ x: 0, y: 0, z: 0, top: 1.2 }),   // die RUHELAGE (§5!)
  params: { tintHex: pet.color, label: pet.name },
});
bub.set({ text: 'BINGO!', type: 'speech', open: true });
```

### Die Frame-Reihenfolge, die alles entscheidet

```js
function frame(dt) {
  ch.update(dt);        // 1 Körper zuerst (Squash-Feder schreibt die Skala)
  mouth.update(dt);     // 2 Mund NACH dem Körper
  rig.update(dt);       // 3 Augen ZULETZT (sie lesen die Körperlage)
  bub.tick();           // 4 Blase (projiziert, dämpft, zeichnet den Zug neu)
  renderer.render(scene, camera);
}
```
Wer `rig.update` vor `ch.update` ruft, bekommt Augen, die einen Frame nachhängen und bei jeder
Bewegung „schwimmen". Wer die Skala an zwei Stellen schreibt, bekommt Flackern — **EIN Eigentümer
je Zahl** ist hier keine Stilfrage, das war der Fehler in PetMotion v1.

---

## 2 · Die Sprechblase — was an ihr gemessen ist

`bubble/bubble.v1.js`, portiert aus Pet Studio v4 §Blase (2026-07-30). Die Zahlen sind Abnahmewerte,
keine Vorschläge:

| Sache | Wert | Warum |
|---|---|---|
| Anker | geglättetes Pet-**ZENTRUM** | Die Bbox-Oberkante liegt bei naher Kamera außerhalb des Bildes → der Zipfel zeigt in den Header. |
| Totzone | `dead` 44 px | Innerhalb steht der Anker STILL → Idle-Drift **0,00 px**. Ohne sie pendelt die Blase ewig. |
| Tempo-Deckel | 18 px/Frame | 286 px Weg in 0,22 s, kein Sprung (vorher 54,7 px/Frame = Zucken). |
| Zipfel | Fuß 18 px, Schultern bei 55 %, Länge 14…`arrow` | Getaperter Pfeil, kein gedrehtes Quadrat. Fuß bleibt im Band 32…68 % der Kante. |
| Standplatz | `pinned: true` + `home()` | Die Blase STEHT, nur der Pfeil zielt. Fliegender Text wird nicht gelesen. |
| Größe | hängt am VOLLEN Text | Sonst wächst sie beim Enthüllen und der Leser springt. |

**Zwei Fallen:**
1. `home()` ist Pflicht, wenn das Modell noch nicht da ist — sonst bleibt die Blase `display:none`
   und eine gedrosselte Sendung ist unsichtbar. `home()` gibt `{x,y,z,top}` der Ruhelage.
2. `set({text})` darf **nie** neu anpinnen. Text tauschen ≠ Platz wechseln (`open` separat setzen).

**Reine Form ohne 3D:** `bubbleRectPath(M, w, h, seed, {hx, hy, arrow})` und
`bubbleBlobPath(M, w, h, seed)` sind exportiert — wer nur den Zug braucht (2D-Szene, Canvas,
Poster), nimmt die zwei Funktionen und schreibt keine zweite Jitter-Schleife.

---

## 3 · Asset-Wege — der stille Killer

**Das Repo ist privat, darum spiegelt kein CDN.** Gemessen am 17.8.:

| Adresse | Ergebnis |
|---|---|
| `raw.githubusercontent.com/.../animal-bunny.glb` | **429** in 3154 ms (199 B Fehlerseite) |
| `cdn.jsdelivr.net/gh/...@main/...` | **404** „Failed to fetch … from GitHub" |
| `rawcdn.githack.com/...` | 429 (proxyt raw, reicht sie weiter) |
| `kayfabizarro.pages.dev/media/3D_Assets/...` | **200** in 271 ms, 131 568 B, `model/gltf-binary` |

Deshalb: `installMirror(THREE)` **als erste Zeile**, vor jedem Laden. Sie schreibt nur die Adresse
um (gleicher Pfad, anderer Wirt) und fällt pro Anfrage auf raw zurück. Ein Treffer gilt nur, wenn
der `content-type` nicht nach HTML riecht — die Cloudflare-Seite ist eine SPA und liefert für
falsche Pfade 200 + `text/html` (333 kB), ein stiller HTML-Treffer wäre schlimmer als ein 429.

Rückweg: `installMirror(THREE, { off: true })` oder `window.__kfbMirror.off()`.

**Nie** `./assets/...` für GLBs, PNGs, Skydomes. Ein relativer Pfad läuft in der Chat-Vorschau und
ist im Standalone-Export leer.

---

## 4 · Die fünf Fehler, die jeder zuerst macht

1. **`alpha: true` fehlt am Renderer.** Dann liefert „transparenter Hintergrund" **schwarz**.
   Gemessene Behebung im Studio: `new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })`;
   die Schatten-Ebene bleibt als `ShadowMaterial` stehen (Alpha-Differenz 32,2 % bei 0,32 ·
   60,0 % bei 0,60 über ~7 140 Pixel) → freigestelltes Pet **plus** halbtransparenter 3D-Schatten.
2. **`makeMat` übertönt die Colormap.** Die Cube-Pet-GLBs haben ihre Farbe **eingebettet**. Wer
   `color` hart setzt, bekommt lauter gelbe Pets. Regel: ohne `pet.color` die native Colormap
   stehen lassen (`kenneyBase`), mit `pet.color` umfärben. (Das Graveyard-Kit ist der andere Fall:
   dort liegt `Textures/colormap.png` daneben und MUSS mitgeladen werden.)
3. **Relative Modul-Specifier im blob/eval-Kontext.** `import('./x.js')` scheitert. Immer
   `new URL(rel, location.href).href`. Bei Hot-Reload zusätzlich `?v=Date.now()` anhängen.
4. **Zombie-Renderer nach vielen Hot-Reloads:** das Pet verschwindet, obwohl der Szenengraph
   gesund ist. Kein Code-Fehler — **harter Reload**.
5. **Frame-Schritte scheitern still.** `window.__bootErrors` sieht einen `ReferenceError` in einem
   Frame-Schritt NICHT, die Szene rendert weiter. Wer an einem Frame-Schritt etwas ändert, prüft
   `window.__loopErr === null`.

---

## 5 · Mund (PetMouth) — Kurzreferenz

- **Drei Sets:** `male` (13 PNG), `female` (13), `red` (12 — **ohne `smile`**). Alle 274×169, gleiche
  Leinwand, darum tragen `size/dy/sx/lift/wrap` unverändert durch. Ein fehlender Schlüssel fällt über
  `_fileFor()` auf `neutral` zurück — es entsteht **nie** ein Ladeversuch auf `base + "undefined"`.
  Das Lächeln trägt bei `red` der Mundwinkel (`bend +0.35`), kein Ersatz-Mapping auf `ee` (wäre ein Grinsen).
- **Fünf Viseme:** `closed · open · wide · round · smile` → Standard-Zuordnung
  `{closed:'m', open:'ah', wide:'ee', round:'oh', smile:'smile'}`, pro Pet in `mouth.visemeMap`
  überschreibbar. `setViseme(id)` ist ein Textur-Tausch **im selben Frame** — kein Rebuild, keine
  Geometrie-Änderung, `_pop` bleibt 1,000 (kein Skalen-Plopp), 52 Vertices konstant.
- **Shrinkwrap:** `refit()` tastet alle 52 Eckpunkte per Raycast auf die Körperfläche
  (Wölbungstiefe 0,284 U), `depthTest` AN, `polygonOffset −2/−2`. Rückweg: `onTop: true`.
- **Knick-Bremse `slope`** (Default 0,05): begrenzt die Tiefen-Wanderung je Spalte. Ohne sie sprang
  bei großen Lippen (`size 0.71 · sx 1.54`) ein Eckpunkt um die Wangenkante → harte Stufe in der
  Oberlippe. Gemessen: größter Nachbar-Sprung 0,1352 → **0,0500 U (−63 %)** bei nur −1 % Wölbungstiefe.
  `slope <= 0` schaltet sie aus.
- **Ruhemund folgt dem Emote:** `restMap`-Einträge dürfen eine FORM sein (`{tex,bend,rot}`) —
  happy +0,35 · sad −0,55 · angry −0,45 · thinking −0,15/−3°. Beim Sprechen tragen die Viseme die Form.

## 6 · Augen (EyeRig v5) — Kurzreferenz

- `stripEyes` (Default an) **löscht** die zwei gemalten Augen-Schalen aus dem Body-Mesh (Z konstant
  0,635 ± 0,002 · ≥ 25 Tris · X spannt nicht über Null). Nur verstecken reicht nicht: die flachen
  Schalen zeigen sich über die Schattierung. Original-Geometrie wird gemerkt → reversibel ohne GLB-Reload.
- Lid-Farbe kommt aus der Body-Colormap **an der Augen-Stelle** (`hit.uv` aus dem Fit-Raycast),
  abgedunkelt — nicht aus `pet.color`. **V-Achse-Falle:** GLTF `flipY=false` → `y = v*H`, nicht `1−v`.
- `U`/`lc` werden aus der **geometrie-lokalen** BBox gerechnet (pose-invariant). Sonst skalieren die
  Augen beim Rebuild während einer Animation.
- `setEye()` ohne Rebuild für `converge`/`gloss` — kein Blick-/Blink-Reset.

## 7 · Was hier NICHT verdrahtet ist

- **PetMotion v2** liegt bei, ist in v4 aber **nicht** eingehängt (`pet-puppet.v1.js` meldet
  `onEmphasis`, niemand hört zu). Sprunghöhe, Dauer, Squash und Glättung wohnen in
  `motion-LIBRARY.v2.json`, nicht im Aussehen-Motor.
- **Audio / Lip-Sync-Alignment / Video-Export** — separates Vorhaben („Cube Puppet Studio").
- **Ganzkörper-Sprechen** (§2c des Auftrags) — bewusst offen.

## 8 · Tusche (ink/) — vier Familien, nicht mischbar

| Familie | Für | Generator |
|---|---|---|
| `band` (Preset `card`) | Karten, Comic-Panels | `brushLoop` + `inkRibbon2D` |
| `stroke` (Preset `chip`) | Buttons, HUD-Chips, Post-its | `chipLoop` + `chipStroke` |
| `tube` (Preset `tube`) | Arme, Beine, Ohren, Stängel, Rauch | Generator beim Aufrufer (2D/SVG) |
| `figure` (Preset `figure`) | Figuren-Silhouetten, bold + Schatten unten/rechts | `band`-Rendering, eigene Zahlen |

**Die zwei Fallen:**
1. `bow` ist eine Kennzahl, kein Nebenwert: die Aufrufstelle nutzt **0,196**, nicht 1,4. Wer die
   alte Signatur liest, baucht die Kante 3,9-fach — das ist der „Bend statt ink"-Effekt.
2. `inkHalfWidth` rechnet die Licht-Logik (`edge`, unten/rechts satter) über `pts[i][0]/W` und
   erwartet Punkte im Rahmen 0…W. **Zentrierte** Punktlisten (Köpfe, Kreise) liefern −0,5…+0,5,
   der Gradient rutscht ins Negative und wird auf `minHalf` geklemmt → die Kontur ist links/oben
   willkürlich dünn statt lichtlogisch. Punktliste vorher in ihren gemessenen Rahmen schieben.

Prüfen statt behaupten: `measureInk(pts, W, H, preset, seed)` gibt `{featherPct, bowPct, kind, ok, why}`.

## 9 · Contract-Hygiene

Wer eine der JSON-Dateien schreibt: `version` **Patch hoch** (nie zurück), `updated` = heute,
`canonical` nie verlieren, alle lokalen Kopien synchron zur kanonischen Fassung.

- `pet-LIBRARY.json` — Aussehen (`kfb.pet-library/1`), Pet-Editor schreibt.
- `kfb-pets.json` — Export-Contract, ein Eintrag je Pet, inklusive `mouth.visemeMap`.
- `motion-LIBRARY.v2.json` — Bewegung (`kfb.motion-library/1`), Motion-Editor schreibt.

Kanonische Adressen liegen unter
`https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/` — über den Spiegel
aus §3 abrufen.

---

*Mess-Handle in der laufenden Bench: `window.__petStudio`. Wer eine Zahl ändert, nennt die Messung.*
