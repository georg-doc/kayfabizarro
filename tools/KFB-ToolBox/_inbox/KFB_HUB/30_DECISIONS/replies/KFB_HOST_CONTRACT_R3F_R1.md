# KFB Host-Vertrag R1.2 · R3F als Spielrahmen (14.10.2026)

Ein Autor: Web-Chat (Planung). WS1 übernimmt ihn 1:1. Änderungen nur additiv, mit V-Nummer (R1.1 = V-211). Es gelten V-209, V-206 und `KFB_WORKING_RULES_R1.md`.

## 1 · Rahmen
- **Ein Spielrahmen: React Three Fiber.** Kein zweiter Renderer, kein zweites `<canvas>`, kein Vanilla-Parallelweg.
- **Versionen, festgepinnt:**

  | Paket | Version |
  |---|---|
  | three | 0.186.1 |
  | @react-three/fiber | 9.8.1 |
  | @react-three/drei | 10.7.9 |
  | @react-three/rapier | 2.2.0 (React-Hülle) |
  | @dimforge/rapier3d-compat | 0.19.2 (Physik-Kern) |
  | ecctrl | 2.0.2 |
  | zustand | 5.0.15 |
  | react / react-dom | 19.3.0 |
  | pdf.js | 4.7.76 (ESM, ein Worker) |

  `npm ls three` zeigt genau eine Instanz, sonst FAIL.
- **Festgepinnt heißt:** `package.json` ohne `^`/`~`, `overrides` für three und rapier3d-compat, `package-lock.json` im Repo. Installiert wird **nur mit `npm ci`**, nie mit `npm install`. Ein Versionswechsel ist eine Vertragsänderung.
- **Ein Besitzer je globalem Zustand:**

  | Gehört dem Host | Gehört dem Controller | Gehört dem Modul |
  |---|---|---|
  | Hintergrund, Nebel, Himmel, Licht, Schatten | Kamera | nur sein eigenes `object3d` |
  | Physik-Welt und Schwerkraft | | |
  | Tastatur-Map | | |

  Ein Modul setzt nie `scene.fog`, `scene.background`, `renderer.*` oder die Kamera.

## 2 · Modulvertrag
```js
create(options) -> { object3d, update(dt, ctx), dispose() }
// ctx = { camera, player: Vector3, game: store.getState() }   // nur lesen
```
- **Einhängen nur über `ModuleHost`** (`src/ModuleHost.jsx`):
  - `useMemo(create)` erzeugt das Modul,
  - `<primitive>` hängt `object3d` ein,
  - `useFrame` ruft `update` (dt gedeckelt auf 0,1 s),
  - beim Aushängen läuft `dispose`.
- **`options` muss stabil sein** (Konstante oder `useMemo`). Sonst entsteht das Modul bei jedem Render neu.
- **Module importieren kein React und keinen Store.** Sie lesen nur `ctx`. Änderungen am Spielzustand melden sie über Callbacks aus `options` (z. B. `onChoice(id)`), der Host schreibt sie in den Store.
- **`dispose()` gibt alles frei:** Geometrie, Material, Textur, Listener, Timer. Nach `dispose` kommt kein `update` mehr.
- **Daten-Module** sind reine Funktionen ohne three-Objekte, zum Beispiel:
  - Kartenbestand,
  - Regel-Logik,
  - Triplet-Pool-Abfrage.

## 3 · React-Fallen (Pflicht)
1. Props, die Arrays oder Objekte sind (`position`, `args`, `options`), werden memoisiert. Eine neue Array-Instanz pro Render setzt Physik-Körper zurück.
2. In `useFrame` kein `setState`. Was sich pro Frame ändert, gehört in Refs oder Modul-Felder, der Store wird nur bei Ereignissen geändert.
3. **ecctrl 2 liest die Tastatur nicht selbst.** Der Host ruft pro Frame `setMovement({...})` mit den Werten aus `useKeyboardControls`.
4. Physik mit festem Zeitschritt `1/60`. `"vary"` lässt die Figur durch Böden fallen.
5. Ist ein Dialog offen, ist der Controller aus (`enable={false}`). Die Tasten gehören dann dem Dialog.

## 4 · Eingabe und UI
- Der Host legt **eine** Tastatur-Map fest. Module hängen keine eigenen Listener an `window`, sie bekommen Eingaben über `options` bzw. Callbacks.
- **Wireface-Gesicht und Billboards** sind 3D-Objekte im Modul.
- **Sprechblasen sind DOM im Host-Slot `#ui-bubbles`** (seit R1.2). Die fertige Blase aus `chatterbox-core` (V-204 plain, Flip-Reveal 520 ms) wird 1:1 übernommen und nicht als 3D-Blase nachgebaut (V-206).
  - Das Modul liefert nur Ankerpunkte: optionales Feld `bubbleAnchors: [{ id, object3d, offset: [x, y, z] }]` im Rückgabeobjekt von `create`.
  - Der Host projiziert die Anker pro Frame auf den Bildschirm (`Vector3.project(camera)`) und setzt die Position der Blase direkt per `style.transform`, ohne React-State (Falle 2).
  - Liegt ein Anker hinter der Kamera oder außerhalb des Bildes, wird die Blase ausgeblendet.
  - Den Text der Blase setzt der Host aus dem Store, nach §5 (nur Pool oder Karte, sonst „…“).
- **Die Spielerwahl** („choice“ 2 × 2, Zifferntasten, optional bis 8 eigene Wörter) ist ein DOM-Overlay im festen Host-Slot `#ui-choice`.

## 5 · Inhalt
- **Text nur aus dem KEEP-Pool oder der Kartenquelle** (PR #379). Das Spiel erzeugt keine Triplets und keine Brücken. Fehlt eine Zeile, steht „…“.
- **Kartenbilder** kommen über `cardImage(deckId, n)` auf dem Registry-Vertrag (`cardMapping`), als Viertelseite ohne Beschnitt, `fit`.
- **Keine MED-Decks und keine Blank-Karten** im Spielpool.

## 6 · Prüfen
- **Jedes Modul hat einen Vertragstest** nach dem Muster `test/host.mjs`. Bestanden ist er, wenn:
  - `create` genau 1-mal läuft, auch nach Re-Renders;
  - `update` den `ctx` bekommt;
  - `dispose` beim Aushängen genau 1-mal läuft und danach kein `update` mehr kommt;
  - keine Seitenfehler auftreten.
- **Jede abgenommene Eigenschaft bekommt einen deterministischen Test** (festes dt, Replay). Headless läuft mit rund 4 fps, Physik-Tests dort sind nicht aussagekräftig.
- **Endabnahme im Browser auf Georgs Rechner**, mit Bildpaar gegen die Referenz.
- **Debug-Zugang** nur über `window.__kfb*` und einen URL-Schalter (`#debug`, `#hosttest`).

## Lokal ausführen (Mac)
```bash
npm ci
npx playwright install chromium   # einmalig
npm run build
npm run test:host                  # erwartet: PASS host contract
```
Der Test nimmt Playwrights eigenen Chromium. `PW_CHROMIUM=<pfad>` überschreibt das.

## Beleg
`ModuleHost` + `test/host.mjs` im Spike (`kfb-planet-spike-src.zip`, Stand 14.10.2026), Ergebnis: **PASS**.

| Prüfpunkt | Ergebnis |
|---|---|
| `create` | 1, auch nach 5 Re-Renders |
| `ctx` | Kamera, Spieler und Store vorhanden |
| `dispose` | 1 |
| `update` nach `dispose` | 0 |
| Fehler | 0 |

## Änderungen (additiv)
- **R1.1 (14.10.2026)**, Anlass: Prüfung durch WS0. V-Nummer vergibt WS0 beim Eintrag ins Register.
  1. `test/host.mjs` hatte einen festen Browserpfad aus der Web-Chat-Umgebung. Er läuft jetzt auch auf dem Mac.
  2. Versionen wirklich gepinnt: `package.json` exakt, `overrides`, nur `npm ci`. Rapier in zwei Zeilen aufgeteilt (Hülle 2.2.0 und Kern 0.19.2). Das war kein Widerspruch, aber ungenau.
  3. Zeilenzahl von `ModuleHost` aus dem Vertrag entfernt.
  4. Abschnitt „Lokal ausführen (Mac)“ ergänzt.
  - Erneut geprüft: `npm ls` zeigt eine Instanz three 0.186.1 und eine rapier3d-compat 0.19.2. `test/host.mjs` liefert PASS.
- **R1.2 (14.10.2026)**, Anlass: Prüfung durch WS0 nach V-211. V-Nummer vergibt WS0.
  1. `@react-three/fiber` exakt auf 9.8.1 (stand als „9.8“; `package.json` hatte bereits 9.8.1).
  2. Sprechblasen von „3D im Modul“ auf den Host-DOM-Slot `#ui-bubbles` mit projizierten Ankerpunkten umgestellt, damit `chatterbox-core` 1:1 übernommen wird (V-206). Gesicht und Billboards bleiben 3D.
