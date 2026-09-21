# KFB Cube-Pets einbauen — Standard-Briefing fuer frische Artefakt-Chats

**Zweck:** dieser Text macht einen frischen three.js-Artefakt-Chat sofort faehig, die KFB Cube-Pets
(niedliche Wuerfel-Tiere), ihre Augen-Rigs, Motion-Cycles und Texturen einzubauen und ueber klare
Trigger zu steuern. Assets liegen auf GitHub, die drei JS-Module bringt Georg mit.

Wiederverwendbar: derselbe Text dient jedem Projekt, das die Cube-Pets einbetten will.

---

## 1 Was du bekommst

Ein **Character**-Stack, komplett klassisches three.js (WebGLRenderer, KEIN WebGPU noetig):

- **24 Wuerfel-Tiere** (Kenney-Cube-Pets), einfarbig-cel, rund gerendert.
- **6 benannte Archetypen** (FrizzleBob und Freunde).
- **Augen-Rig** („googly"): zwei cel-flache Augen mit Ink-Ring, Sclera, Pupille, die dem Blickziel
  folgen und auf der Kopf-Oberflaeche sitzen (kein Clipping, kein Schweben).
- **Motion-Cycles** ueber Trigger: idle, walk, run, eat, dance, gesten. Squash und Stretch liegen
  automatisch obendrauf.
- **Emotes** (Sprechblasen-artige Reaktionen).
- **Texturen:** Fell, Skyboxes.

Ein Pet ist EIN Objekt (`character.group`), das du in deine Szene haengst. Alles andere laeuft ueber
Methoden auf der Instanz.

---

## 2 Assets auf GitHub (RAW-URLs, direkt ladbar)

Basis: `https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/`

| Was | Pfad ab Basis |
|---|---|
| Pet-GLBs | `media/3D_Assets/GLB_cube-pets/animal-{id}.glb` |
| Pet-Contract (Augen, Face-Daten) | `media/3D_Assets/pet-LIBRARY.json` |
| Wuerfel (D6, 21 Pips) | `media/3D_Assets/dice_ugur_lowpoly.glb` |
| Skyboxes | `media/3D_Assets/Textures/Skyboxes/` |
| Fell-Textur | `media/3D_Assets/Textures/fur/fluffy_fur_01.jpg` |
| Sounds | `media/3D_Assets/Sounds/` |

**Immer ueber die RAW-URL laden, nie relativ (`./assets/`).** Ein Standalone-Artefakt hat kein
lokales Asset-Verzeichnis, ein relativer Pfad ist dort tot.

## 3 Die drei JS-Module (bringt Georg mit)

Diese Dateien gibt Georg dem Chat direkt (aus `KFB RollerCoasterComic Ride v6-session/`):

- `pet-library.v6.js` — der `Character`-Stack (Kern, alles haengt hier dran).
- `pet-motion.v1.js` — die Motion-Cycles.
- `pet-eye-rig.v3.js` — das Augen-Rig (vom Character ueber den Mod `googly` genutzt).

Sie importieren `THREE` und `GLTFLoader`. Im Artefakt ueber Importmap oder CDN bereitstellen
(three r160+).

---

## 4 Minimal-Rezept

```js
import { Character } from './pet-library.v6.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();
const loadGltf = (url) => loader.loadAsync(url);

// Ein Pet bauen
const pet = new Character({ THREE, loadGltf });
await pet.load('animals', 'bunny', { mods: ['googly', 'emotes'], size: 0.82 });
scene.add(pet.group);              // das ist das Objekt in der Szene

// Steuern (Trigger, siehe Tabelle)
pet.play('idle');                  // Dauer-Loop
pet.lookAt(cursorWorldPos);        // Pupillen folgen
pet.celebrate();                   // Tanz + Emote
pet.react('positive');             // Zustimmungs-Geste

// Im Render-Loop
pet.update(dt);                    // Mixer + Squash + Augen
```

Ein Avatar-Wechsel ist ein erneutes `pet.load('animals', 'fox', ...)` auf derselben Instanz. Der
Koerper wird getauscht, die Mods bleiben.

## 5 Die 6 Archetypen

| id | Tier | Notiz |
|---|---|---|
| `frizzlebob` | bunny | Canon-Hase, selektiv gelb eingefaerbt (`recolor 0xf2c93c`) |
| `ailiza` | cat | A.I.Liza |
| `stefain` | tiger | Stef.A.I.n |
| `dochainer` | penguin | Doc H.A.I.ner |
| `kaifabster` | fox | KA.I.Fabster |
| `nadaia` | koala | Nad.A.I.a |

`pet.setArchetype('frizzlebob')` setzt Tier plus Einfaerbung in einem.

## 6 Die 24 Tiere (Set `animals`)

bunny, cat, fox, tiger, lion, penguin, panda, koala, deer, monkey, pig, hog, cow, polar, beaver,
giraffe, chick, fish, parrot, bee, crab, caterpillar, elephant, dog.

URL je Tier: `.../GLB_cube-pets/animal-{id}.glb`. Skalierung Default 0.82. Reskin ueber Colormap, das
Material kommt vom Host (Toon fuer den Cel-Look, Standard fuer PBR).

## 7 Trigger (Motion-Cycles)

| Trigger | Clip | Loop |
|---|---|---|
| `idle` | idle | ja |
| `enter` | walk | ja |
| `hop` / `run` | run | ja |
| `speak` | idle + bob | ja |
| `eat` | eat | nein |
| `celebrate` | dance | ja, haelt 2.6 s |
| `react-positive` | gesture-positive | nein |
| `react-negative` | gesture-negative | nein |
| `deflate` | gesture-negative + squash | nein |

Bequeme Methoden: `pet.speak()`, `pet.celebrate()`, `pet.react('positive'|'negative')`,
`pet.deflate()`, `pet.squash(amount)`, `pet.bob(h)`, `pet.blink()`, `pet.gazeIdle()`.

## 8 Mods

- `googly` — das Augen-Rig. Augen sitzen per Surface-Raycast auf dem Kopf, folgen `pet.lookAt(ziel)`,
  blinzeln ueber `pet.blink()`. Braucht `pet-eye-rig.v3.js`.
- `emotes` — kurze Reaktions-Symbole ueber `pet.emote('celebrate'|'deflate'|...)`.

## 9 Texturen

- **Fell:** `Textures/fur/fluffy_fur_01.jpg`, 1024x1024. Als Colormap auf `mesh.material.map` legen,
  `map.repeat` steuert, ob es Fell (echtes Unwrap) oder Farbflecken (Atlas) wird. Ausprobieren.
- **Skyboxes:** `Textures/Skyboxes/` als Umgebung.

## 10 Anforderungen und Kanon

- three r160+, `GLTFLoader`, `WebGLRenderer` reicht (kein WebGPU).
- **Cel-Look ist Kanon:** einfarbige Wuerfel-Tiere, runder Render, `MeshToonMaterial` oder flaches
  `MeshBasicMaterial`. Kein Fotorealismus am Pet.
- **Layer Zero (falls Text generiert wird):** keine Bindestriche als Satzzeichen, keine Emojis, echte
  Umlaute, Kausalitaet ueber „also/aber".

---

## 11 Diese App: Lisas immersive Blender-Lern-Welt

**Idee:** die 3D-Lerngeschichte als Spiel, in dem Lisa Blender- und 3D-Konzepte lernt, getragen von den
niedlichen Cube-Pets, ihren Texturen, Motion-Cycles und einer dichten 3D-Welt, in der das Blender-Lernen
stattfindet.

Wie der Stack das traegt:

- **Ein Pet als Lehrer/Begleiter.** Ein Archetyp (z. B. FrizzleBob als Hase) fuehrt durch die Lektionen,
  `speak()` fuer Erklaerungen, `react('positive')` bei Erfolg, `deflate()` bei Fehlversuch, `celebrate()`
  beim Meilenstein. Der Blick folgt Lisas Cursor (`lookAt`), das macht ihn lebendig.
- **Konzepte als Motion.** Blender-Grundbegriffe lassen sich am Pet zeigen, weil der Stack genau die
  Operationen kann, die Blender lehrt: `scale`/`squash` = Skalieren, `bob`/`hop` = Transform entlang
  einer Achse, der Colormap-Wechsel = Material und Textur, der Avatar-Swap = Objekt ersetzen, das
  Augen-Rig = Parenting und Constraints (Auge folgt Kopf folgt Ziel). Jede Lektion hat ein sichtbares
  Pendant am Pet.
- **Die Welt.** Skyboxes als Umgebung, der D6-Wuerfel als Auswahl- oder Zufalls-Element, mehrere Tiere
  als Cast. Die 24 Tiere geben genug Vielfalt fuer eine ganze Lernreise.
- **Spielschleife.** Aufgabe stellen (Pet spricht), Lisa manipuliert das Objekt (Blender-Konzept),
  Pet reagiert. Erfolg = `celebrate`, Fehler = `deflate` plus neuer Versuch. Nie strafen, immer
  weiterspielen (Kanon: durch Spiel zum Verstehen, nicht durch Belehrung).

**Erster Schritt fuer den Chat:** ein Pet laden, `play('idle')`, `lookAt(cursor)`, in einer einfachen
Szene mit einer Skybox. Wenn das lebt, die erste Lektion dranhaengen. Ein Schritt, dann ansehen.

---

*Assets: georg-doc/kayfabizarro auf GitHub. Module: aus dem v6-session-Ordner. Fragen zu Zahlen,
Triggern oder Contract gehen an Georgs Cowork-Coworker, der liest den Code direkt.*
