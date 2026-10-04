# KFB Graveyard — Zonen-Modul v1.0.0

Eine begehbare 3D-Zone als **einbettbares Modul**: Nacht-Friedhof, Grabsteine aus Daten,
Hover-Tuschblasen, FrizzleBob als Guide, Grablicht-States. Klassisches WebGL (three 0.160,
ein Build, kein WebGPU, läuft in Firefox und Chrome).

Gedacht als **Minigame-Baustein**: das Modul liefert die Welt und die Ereignisse, der Host
liefert die Spielregel.

```
export/kfb-graveyard-module/
├── kfb-graveyard.js          ← das Modul (createGraveyard)
├── kfb-assets.js             ← Pfad-SSOT: jede Asset-URL, kein relativer Pfad
├── pet-library.v6.js         ← Pet-Stack (Spiegel; Kanon im Repo)
├── pet-eye-rig.v4.js         ← EyeRig v4 (Spiegel)
├── pet-LIBRARY.json          ← Aussehen-Contract (Spiegel, unverändert)
├── postmortems.json          ← Beispiel-Daten: 12 Gräber (Schema unten)
├── Graveyard_Minigame.html   ← Host-Beispiel: Zone + Auftrags-Leiste
├── KFB_Graveyard_Standalone.html  ← ein File, alles inline (Build, kein Original)
└── docs/
    ├── HANDOVER_graveyard-module_2026-08-04.md
    └── ASSET_PATHS.md         ← was im Repo liegt und was nicht
```

Die Standalone-Datei trägt Modul, Pet-Stack und die 12 Gräber inline; Assets kommen weiter per
RAW. Sie ist ein **Build** aus den Dateien darüber — Änderungen gehören ins Modul, danach neu bauen.

---

## 1 Einbauen (3 Schritte)

**1. Code kopieren** — die sechs Dateien oben in das Zielprojekt. Keine Assets kopieren,
nie einen GLB, keine Textur, kein Skydome.

**2. three.js bereitstellen** — das Modul erwartet eine Importmap im Host-Dokument:

```html
<script type="importmap">
{ "imports": {
  "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
  "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
} }
</script>
```

(`THREE_IMPORTMAP` in `kfb-assets.js` trägt dieselben Werte als Datenobjekt, falls der Host
sie programmatisch schreibt.)

**3. Mounten:**

```html
<div id="zone" style="position:fixed; inset:0"></div>
<script type="module">
import { createGraveyard } from './kfb-graveyard.js';

const gy = await createGraveyard({
  mount: '#zone',
  gravesUrl: './postmortems.json',
  onVisit: (i, grave, p) => console.log(p.visited + '/' + p.total, grave.lesson),
});
</script>
```

Das Modul rendert **in sein Mount-Element**, nicht in den Viewport. Ein Panel, eine Kachel,
ein Vollbild — alles derselbe Aufruf; `ResizeObserver` hält Kamera und Composer synchron.

### In einer Design Component

Das Modul ist ein Web-taugliches ES-Modul ohne Build-Schritt. In einer `.dc.html`:
Importmap + `<script type="module">`-Bootstrap in den `<helmet>`, `<div>` als Mount in den
Body, `createGraveyard` in `componentDidMount` aufrufen und die Instanz in `dispose()`
abräumen (`componentWillUnmount`).

---

## 2 Daten: das ist die Welt

Ein Grab = ein Datensatz. Kein Stein wird von Hand gesetzt. Schema
`kfb-postmortem-graveyard/v1`:

| Feld | Pflicht | Wirkung in der Zone |
|---|---|---|
| `id` | ja | Identität für Fortschritt/Score (`visited()`) |
| `stone` | ja | Grabinschrift (Kurzform, für Listen/Host-UI) |
| `who` | ja | `process` · `coworker` · `design` → Lichtfarbe, Akzent, Label |
| `size` | ja | `monument` · `large` · `medium` · `small` → GLB-Pool + Höhe |
| `hover` | ja | Text der Hover-Tuschblase |
| `lesson` | – | Was FrizzleBob vorliest, wenn man das Grab anklickt |
| `trigger` | – | „Reißleine“ unter der Lehre (Trigger-Phrase) |
| `date` | – | im Blasen-Tag |

`size` ist die einzige Größenquelle: Höhe **und** Grundfläche werden gedeckelt
(`SIZE_H` / `SIZE_MAXW`) — Höhen-Fit allein bläht breite Modelle auf (Playbook §1).

Quelle wählt das Modul in dieser Reihenfolge: `gravesUrl` → inline `graves` → Repo-Kanon
(`DATA.postmortems`, sobald gepusht). Nichts davon da → sprechender Fehler, kein leerer Screen.

---

## 3 API

### `createGraveyard(options) → Promise<GraveyardInstance>`

| Option | Default | Bedeutung |
|---|---|---|
| `mount` | — | Element oder Selektor (Pflicht) |
| `graves` / `gravesUrl` | `null` | Daten (eines von beiden Pflicht) |
| `hud` | `true` | Titel, Zähler, Tastenhilfe des Moduls |
| `veil` | `true` | Klick-zum-Betreten-Schleier (Pointer-Lock braucht eine Nutzeraktion) |
| `bubbles` | `true` | Tuschblasen (Hover + Guide) |
| `guide` | `true` | FrizzleBob (Cube-Pet-Stack + EyeRig) |
| `fence` · `scenery` · `bloom` | `true` | Zaun/Tor · Bäume+Steine · Bloom-Pass |
| `lightMode` | `'candle'` | `'candle'` ruhiges Flackern · `'disco'` Welle durch die Reihen |
| `layout` | `{cols:3, gapX:6.2, gapZ:6.4, z0:-6}` | Reihen-Raster |
| `spawn` | `{x:0, z:20, yaw:0}` | Startposition am Tor |
| `eyeHeight` · `walkSpeed` · `sprint` | `1.7` · `4.2` · `2.2` | Ego-Walker |
| `pointerLock` | `true` | aus für Embeds; Drag-Look funktioniert immer |
| `keyboardWhenHovered` | `true` | Tasten wirken nur, wenn der Zeiger über der Zone ist |
| `petArchetype` | `'bunny'` | Contract-Pet (`pet-LIBRARY.json`) |
| `petLibraryUrl` · `eyeRigUrl` · `petContractUrl` | RAW-Kanon | Overrides |
| `debugGlobal` | `false` | legt die Instanz auf `window.__kfbGraveyard` |

**Callbacks:** `onReady(api)` · `onHover(i, grave)` · `onSelect(i, grave)` ·
`onVisit(i, grave, progress)` · `onTick(dt, api)` · `onError(err)`.

### Instanz

| Aufruf | Zweck |
|---|---|
| `enter()` | Schleier weg, Zone startet (Minigame-Start aus dem Host) |
| `pause()` · `resume()` · `isRunning()` | Loop kontrollieren (Tab-Wechsel, Menü, Dialog) |
| `setLightMode(m)` · `toggleLight()` · `lightMode()` | Licht-State (Belohnung, Alarm, Nacht/Fest) |
| `guideTo(i)` | FrizzleBob geht hin und liest die Lehre (wie ein Klick) |
| `focusGrave(i, dist)` · `teleport(x, z, y)` | Kamera setzen (Respawn, Kamerafahrt) |
| `visited()` · `progress()` · `resetProgress()` | Score: `{visited, total, ratio, done}` |
| `graveAt(i)` · `indexOf(id)` · `graves` | Daten-Zugriff |
| `hideBubbles()` · `resize()` | UI-Feinsteuerung |
| `dispose()` | Listener, Geometrien, Materialien, Renderer, DOM — alles weg |
| `scene` · `camera` · `renderer` · `THREE` · `root` | Escape-Hatches für den Host |

### Minigame-Muster, die damit gehen

- **Sammeln** — `onVisit` zählt; bei `progress().done` Licht auf `disco` (so im Host-Beispiel).
- **Jagd** — `guideTo(random)` schickt FrizzleBob vor, der Spieler muss folgen.
- **Quiz** — `onSelect` fängt den Klick ab, Host zeigt die `trigger`-Frage, erst bei richtiger
  Antwort `guideTo(i)` für die Lehre.
- **Zeitdruck** — `onTick` als Timer, `pause()` beim Ablauf, `resetProgress()` für Runde zwei.

---

## 4 Steuerung (Lauf-Zone, kein Flug)

`W`/`S` vor-zurück · `A`/`D` seitlich · `Q`/`E` drehen · Ziehen oder Finger schauen ·
Rad näher/weiter · `Shift`+Rad schieben · `Space` springen · `Shift` schneller ·
`L` Licht-State · Gamepad (Sticks, `A` springt). Touch: linke Hälfte Joystick, rechte schauen,
Tap wählt. Auswahl ist zeigerbasiert, kein Fadenkreuz.

---

## 5 Grenzen, ehrlich

- **Netz ist Pflicht.** GLBs, Pet-Contract und three.js kommen per URL. Offline zeigt die Zone
  Platzhalter-Steine und einen Platzhalter-Guide — sie bootet, aber sie ist nicht sie selbst.
- **Ein Modul pro Seite** ist getestet. Mehrere Instanzen laufen (eigener Renderer je Instanz),
  kosten aber je einen WebGL-Kontext.
- **Bloom ist global**, nicht selektiv: nur Lichter liegen über der Schwelle, weil ihre Farbe
  `toneMapped:false` und > 1 ist. Steine dunkel halten, sonst glüht der Friedhof.
- **`postmortems.json` liegt noch nicht im Repo** — bis zum Push sind die Daten Host-Sache.

## 6 Clean-Run-Checkliste

1. `Graveyard_Minigame.html` in **Chrome und Firefox** öffnen — keine Konsolenfehler.
2. Steine sind **texturiert** (nicht weiß), Größen lesbar unterschiedlich.
3. Hover über einen Stein → Tuschblase mit Pergament-Rand, Zähler springt auf `n / 12`.
4. Klick auf einen Stein → FrizzleBob läuft hin, dreht sich zum Stein, liest die Lehre;
   Auftrags-Leiste zählt hoch.
5. Guide lädt als Clay-Hase mit echtem EyeRig (nicht googly) — sonst Platzhalter, aber Boot heil.
6. `L` schaltet Kerzen ↔ Disco. Fenster verkleinern → Zone skaliert ohne Verzerrung.
7. `KFB_Graveyard_Standalone.html` einzeln (ohne Nachbardateien) öffnen → identisches Bild.
