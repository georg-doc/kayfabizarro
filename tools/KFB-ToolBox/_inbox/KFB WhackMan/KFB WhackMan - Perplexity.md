<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# hi! ich suche public domain repos und passende ressourcen, die uns diesen POC erleichtern und das deisgn \& ganmeplay verbessern können:

@GitHub @Dropbox @Game Development Studio super, danke! ich habe hier noch ein POC für KFB/doccheck als modulres mini game: hi! ich würde gerne eine spielbaren pacman-MVP als KFB 3D cartoon-variante (freie orbit kamera) mit kaykit und tiny treats assets, characters \& props als primäre wahl, kenney und quaternius als zweite wahl umsetzen:https://github.com/georg-doc/kayfabizarro/tree/main/skills/chatnutze unsere aktuellen github sourcen, erfinde nicht neu und baue ein soielbares pacman level mit geistern, pickups (donuts etc) und dem bekannten gameplay[https://github.com/georg-doc/kayfabizarro/blob/main/skills/session-entry-use-what-works_v1.md-](https://github.com/georg-doc/kayfabizarro/blob/main/skills/session-entry-use-what-works_v1.md-) nutze kfb-frankensteining_v1.md um fehlende assets sauber zu bauen:- https://github.com/georg-doc/kayfabizarro/tree/main/media/3D_Assets/KayKit%20Legacy- kaykit legacy characters als gegner ("ghosts") und spielbare characters ("pacman)- baue den POC modular, um ihn später weiterzuentwickeln als KFB mini game- nutze das KFB batch eye-rigging, um alle kaykit legacy characters mit passend skalierten und ausgerichteten cartoon augen im spiel zu zeigen: mit eye tracking und eye(\&lid) controls, wimpern etc- nutze kaykit \& tiny treats assets, um das spielfeld/labyrithne zu bauen (game map generator-logik später mit skins \& color themes etc)- absurde, passende, cute-offbeat-appealing, storytelling pick ups items im maze und power ups aus den kaykit "Bits" \& tiny treats sets → lebendig animiert wie alles im game→ das ist eine explorative slice - du hast kreative freiheit im global intent und im rahmen unseres pecs/guardrails → überrasche uns mit 3 features \& gimmicks \& game mechanics, an die wir noch nicht gedacht haben und die spieler nachher ihren freudnen erzählen..... ->

Hi! Das lässt sich als modularer **KFB-Pacman-MVP** sehr gut zuschneiden. Die wichtigste Leitentscheidung: Wir sollten **nicht bei null anfangen**, sondern eure vorhandene `kayfabizarro`-Struktur, die Session-Entry-Regeln und `kfb-frankensteining_v1.md` als verbindliche Grundlage behandeln. Die GitHub-Dateien waren über den Webzugriff allerdings nicht auslesbar; ich kann daher keine konkreten bestehenden Modulnamen oder APIs behaupten. Die folgenden Vorschläge bleiben deshalb bewusst kompatibel mit eurem vorhandenen Repository, statt eine neue Architektur zu erfinden.

## Geeignete Ressourcen

| Ressource | Rolle im POC | Lizenz-/Nutzungshinweis |
| :-- | :-- | :-- |
| KayKit Legacy | Primäre Characters, Gegner, Tiles und Props | Die KayKit-Legacy-Inhalte werden als CC0/Public Domain angeboten; Originaldateien und Lizenznachweise sollten trotzdem im Repository dokumentiert werden. [^1_1][^1_2] |
| Tiny Treats | Donuts, Snacks, absurde Pickups, Deko und Power-ups | Die Baked-Goods-Assets sind als CC0 gekennzeichnet und für private sowie kommerzielle Nutzung freigegeben. [^1_3] |
| Kenney | Zweite Wahl für fehlende Props, UI, einfache Partikel und Ersatzgeometrie | Nur Assets verwenden, deren konkrete Lizenz im jeweiligen Paket dokumentiert ist. |
| Quaternius | Zweite Wahl für Characters, Tiere, Props und ergänzende 3D-Assets | Lizenz pro Paket prüfen und im Asset-Manifest festhalten. |
| `butchler/Pacman-3D` | Referenz für grundlegende Three.js-Pacman-Struktur und Bewegungslogik | Als technische Inspiration beziehungsweise Referenz verwenden, nicht ungeprüft Code übernehmen. [^1_4] |
| `threex.pacman` | Referenz für Pacman-ähnliche Character-Modelle | Für euren Stil wahrscheinlich nur als Gameplay-/Modellierungsreferenz sinnvoll. [^1_5] |
| Three.js-WebXR-Pacman | Referenz für dreidimensionale Pacman-Interpretationen | Interessant für spätere Kamera- oder XR-Experimente, nicht als MVP-Abhängigkeit. [^1_6] |

## MVP-Schnitt

Der erste spielbare Slice sollte nur ein einzelnes, stark lesbares Maze enthalten:

```text
KFBPacmanGame
├── GameBootstrap
├── GameState
├── Maze
│   ├── MazeDefinition
│   ├── MazeGenerator
│   ├── MazeRenderer
│   └── MazeCollision
├── Actors
│   ├── PlayerController
│   ├── GhostController
│   ├── GhostBrain
│   └── ActorAnimator
├── Collectibles
│   ├── Pellet
│   ├── TreatPickup
│   ├── PowerUp
│   └── PickupDirector
├── Camera
│   └── OrbitFollowCamera
├── CharacterRigging
│   ├── EyeRigAdapter
│   ├── EyeLookAt
│   ├── LidController
│   └── LashAttachment
├── Presentation
│   ├── ScoreUI
│   ├── FloatingFeedback
│   ├── VFX
│   └── Audio
└── Content
    ├── asset-manifest
    ├── character-profiles
    ├── maze-themes
    └── pickup-definitions
```

Der MVP sollte zunächst diese Kernschleife garantieren:

1. Der Spieler bewegt sich rasterbasiert durch das Maze.
2. Pellets beziehungsweise kleine Snacks werden eingesammelt.
3. Geister verfolgen den Spieler mit unterschiedlichen Verhaltensprofilen.
4. Ein Power-up verändert für kurze Zeit die Rollenverteilung.
5. Das Level endet nach vollständigem Einsammeln aller regulären Pickups.
6. Kamera, Animation, Augen und Feedback funktionieren bereits im ersten Slice.

## Maze und Gameplay

Für das Maze würde ich keine vollständig zufällige Geometrie verwenden. Besser ist eine **symbolische 2D-Maze-Definition**, die später beliebig geskinnt und als 3D-Level gerendert werden kann:

```ts
export type MazeCell =
  | "wall"
  | "floor"
  | "spawn"
  | "ghostHouse"
  | "tunnel"
  | "pickup";

export interface MazeDefinition {
  id: string;
  width: number;
  height: number;
  cells: MazeCell[][];
  playerSpawn: GridPosition;
  ghostSpawns: GridPosition[];
  tunnelRows: number[];
  themeId: string;
}
```

Die erste Karte könnte inhaltlich wie ein **„KFB-Klinik-Kiosk nach Ladenschluss“** funktionieren:

- Wände: KayKit-Builder- oder Dungeon-Elemente.
- Boden: kontrastierende, farblich ruhige Kachelfläche.
- Maze-Markierungen: Donutglasuren, Tabletts, Verpackungen oder kleine Bits.
- Ghost House: eine überdimensionierte Snackbox oder ein „Quarantäne“-Bereich.
- Tunnel: Kühlschrank, Mikrowelle oder absurd kleiner Versorgungsschacht.
- Pellets: Mini-Snacks, Bits oder leuchtende Zuckerperlen.
- Power-ups: große Tiny-Treats mit eindeutigem Silhouettenprofil.

Die eigentliche Navigation sollte auf einem Raster bleiben, während die 3D-Darstellung frei gestaltet wird. Dadurch könnt ihr später dieselbe Spielmechanik mit mehreren Skins verwenden:

```ts
export interface MazeTheme {
  wallPrefab: string;
  floorPrefab: string;
  trimPrefab?: string;
  pelletPrefab: string;
  powerUpPrefab: string;
  accentColor: string;
  fogColor?: string;
}
```


## Ghosts und Gegnerlogik

Die KayKit-Legacy-Characters sollten nicht bloß unterschiedlich eingefärbt werden. Jeder Gegner erhält ein kleines Gameplay-Profil:


| Ghost | Verhalten | Visuelles Gimmick |
| :-- | :-- | :-- |
| „Der Planer“ | Zielt auf das Feld vor dem Spieler | Augen schauen permanent voraus |
| „Der Paniker“ | Wechselt zwischen Verfolgung und Flucht | Augen und Lider reagieren hektisch |
| „Der Sammler“ | Sucht unberührte Pickup-Gruppen | Blick springt zwischen Pickups |
| „Der Improvisator“ | Nimmt gelegentlich riskante Abkürzungen | Augen driften leicht auseinander |

Technisch reicht für den ersten Slice eine Kombination aus:

- kürzestem Weg auf dem Grid,
- einfachem Zielpunkt pro Ghost,
- Zuständen `CHASE`, `SCATTER`, `FRIGHTENED`, `EATEN`,
- optionalem Zufallsanteil, damit die Gegner nicht vollständig deterministisch wirken.

```ts
export type GhostMode =
  | "chase"
  | "scatter"
  | "frightened"
  | "eaten";

export interface GhostProfile {
  id: string;
  modeSchedule: Array<{
    mode: GhostMode;
    duration: number;
  }>;
  targetStrategy: "player" | "ahead" | "pickupCluster" | "random";
  speedMultiplier: number;
  visualProfile: string;
}
```


## Eye-Rigging

Das Eye-Rigging sollte als **Adapter-Schicht** umgesetzt werden, damit nicht jeder KayKit-Character manuell in Gameplay-Code integriert werden muss.

```ts
export interface EyeRigAdapter {
  attach(root: Object3D, profile: EyeRigProfile): void;
  setLookTarget(target: Vector3): void;
  setBlink(value: number): void;
  setLidEmotion(value: number): void;
  setGazeOffset(value: Vector2): void;
}
```


### Praktischer Ablauf

1. KayKit-Legacy-Character laden.
2. Kopf-Bounding-Box und lokale Blickrichtung bestimmen.
3. Augenpositionen relativ zu Kopfgröße berechnen.
4. Augen als eigene kleine Meshes oder Instanzen einsetzen.
5. Pupillen auf ein begrenztes lokales Blickziel ausrichten.
6. Lider als einfache halbtransparente oder deformierbare Formen ergänzen.
7. Wimpern als kleine Kurven, Plane-Elemente oder instanzierte Strips anbringen.
8. Per-Character-Profil für Skalierung, Abstand, Lidwinkel und Blickrichtung speichern.

Wichtig ist, die Augen nicht an die Weltposition des Zielobjekts zu koppeln. Verwendet stattdessen einen lokalen, begrenzten Look-at-Vektor:

```ts
const localDirection = headWorld
  .clone()
  .sub(targetWorld)
  .normalize();

const clampedYaw = THREE.MathUtils.clamp(
  Math.atan2(localDirection.x, localDirection.z),
  -maxYaw,
  maxYaw
);
```

Dadurch bleiben die Augen cartoonhaft und drehen sich nicht unnatürlich um 180 Grad.

## Drei erzählbare Gimmicks

### 1. „Donut-Witness-System“

Bestimmte Pickups haben kleine Gesichter und reagieren auf den Spieler. Wenn ein Ghost in der Nähe ist, schauen sie nicht zum Spieler, sondern verraten durch ihre Blickrichtung indirekt den Ghost.

Gameplay-Funktion:

- Ein Donut „warnt“ den Spieler wenige Sekunden vor einer nahenden Gefahr.
- Das Signal bleibt bewusst unzuverlässig.
- Spieler können erzählen, dass sie „von den Donuts verraten wurden“.


### 2. „Frankenstein-Power-up“

Beim Einsammeln eines speziellen KayKit-Bits wird der Spieler für kurze Zeit aus zufällig kombinierten Character-Fragmenten dargestellt:

- anderer Kopf,
- übergroße Hände,
- schiefe Augen,
- wechselnde Accessoires,
- kurze, übertriebene Laufanimation.

Mechanisch bleibt der Spieler unangreifbar und kann Geister „erschrecken“. Visuell greift das direkt eure `kfb-frankensteining_v1.md`-Idee auf, ohne die reguläre Player-Pipeline zu verändern.

### 3. „Ghost-Reputation“

Geister merken sich, wie der Spieler sie behandelt:

- Häufiges Fressen eines bestimmten Ghosts macht ihn aggressiver.
- Wiederholtes Ausweichen lässt ihn vorsichtiger werden.
- Ein Ghost kann kurzzeitig den Spieler imitieren und dessen letzte Bewegungsroute ablaufen.

Das erzeugt kleine emergente Geschichten, ohne eine große Dialog- oder Queststruktur zu benötigen.

## Sinnvolle Repository-Erweiterung

Ich würde eure bestehenden Dateien nicht ersetzen, sondern lediglich einen klar abgegrenzten Feature-Bereich ergänzen:

```text
apps/
  kfb-pacman/
    src/
      game/
      maze/
      actors/
      pickups/
      camera/
      rigging/
      presentation/
    content/
      assets/
      characters/
      themes/
      mazes/
    docs/
      asset-credits.md
      gameplay-contract.md
      eye-rigging-notes.md
```

Das Asset-Manifest sollte jeden verwendeten Inhalt eindeutig dokumentieren:

```ts
export interface AssetRecord {
  id: string;
  source: "kaykit-legacy" | "tiny-treats" | "kenney" | "quaternius" | "custom";
  sourcePath: string;
  license: "CC0" | "custom" | "unknown";
  author?: string;
  usage: string;
  modified: boolean;
}
```

Ein Asset mit `license: "unknown"` sollte im Build zwar sichtbar markiert, aber nicht in den finalen POC übernommen werden. So verhindert ihr, dass beim Frankensteining versehentlich nicht freigegebene Inhalte in die Demo gelangen.

## Empfohlene Implementierungsreihenfolge

1. Bestehende `kayfabizarro`-Skills und vorhandene Loader-/Scene-Patterns wiederverwenden.
2. Ein statisches Maze als Grid-Definition anlegen.
3. Player-Bewegung und Wandkollision implementieren.
4. Pellets und ein vollständiges Level-Ende ergänzen.
5. Einen Ghost mit `CHASE` und `FRIGHTENED` bauen.
6. Weitere Ghost-Profile datengetrieben ergänzen.
7. KayKit- und Tiny-Treats-Assets über Theme-/Prefab-Konfiguration einhängen.
8. Orbit-Follow-Kamera mit sanfter Orientierung und Kollision hinzufügen.
9. Eye-Rigging zunächst nur für Player und einen Ghost validieren.
10. Batch-Rigging auf alle verwendeten Legacy-Characters anwenden.
11. VFX, Audio, Floating Score Feedback und die drei Gimmicks ergänzen.
12. Erst danach prozedurale Maze-Generierung und zusätzliche Skins bauen.

Die zentrale Qualitätsregel für den POC lautet: **Ein vollständiges, gut lesbares Level mit einem einzigen funktionierenden Ghost ist wertvoller als zehn halb integrierte Characters.** Die vorhandenen KayKit- und Tiny-Treats-Ressourcen eignen sich sehr gut für den visuellen Stil; die Gameplay-Identität sollte aber aus dem Maze, den Blicken, den Reaktionen und den kleinen absurden Systemen kommen.[^1_1][^1_3]

<span style="display:none">[^1_10][^1_11][^1_12][^1_13][^1_14][^1_15][^1_7][^1_8][^1_9]</span>

<div align="center">⁂</div>

[^1_1]: https://kaylousberg.itch.io/kaykit-dungeon

[^1_2]: https://kaylousberg.itch.io/kaykit-complete

[^1_3]: https://tinytreats.itch.io/baked-goods

[^1_4]: https://github.com/butchler/Pacman-3D

[^1_5]: https://github.com/jeromeetienne/threex.pacman

[^1_6]: https://threejs3d.com/threejs-projects/projects/charliegerard-webxr-pacman

[^1_7]: https://github.com/liorgonnen/pacman3d

[^1_8]: https://github.com/pmm248/3DPacMan

[^1_9]: https://github.com/SamFu1113/3D-pac-man

[^1_10]: https://github.com/kubikulek231/MPC-MPG-PacMan

[^1_11]: https://tinytreats.itch.io/house-plants

[^1_12]: http://igorceridorio.github.io/pacman/

[^1_13]: https://kaylousberg.itch.io/kaykit-medieval-builder-pack

[^1_14]: https://tinytreats.itch.io/charming-kitchen

[^1_15]: https://threejsassets.com/assets


---

# Wie lässt sich die Steuerung aus butchler Pacman 3D in ein bestehendes Projekt integrieren

Die Steuerung von `butchler/Pacman-3D` lässt sich am besten **nicht als vollständiges Modul kopieren**, sondern als kleines Input-/Movement-Konzept in euer bestehendes KFB-Projekt übertragen:

- `W/S`: vorwärts/rückwärts.
- `A/D`: links/rechts drehen.
- Bewegung ist damit **charakterrelativ**, nicht kamera- oder rasterrelativ. Das beschreibt auch die veröffentlichte Demo explizit.[^2_1]

Für euren freien Orbit-Kamera-POC würde ich diese Steuerung in drei Schichten aufteilen:

```text
InputAdapter
    ↓
PlayerIntent
    ↓
PlayerController
    ↓
MazeCollision / ActorMotor
```

So bleibt die Steuerung später austauschbar, ohne Player-, Kamera- oder Ghost-Code umzubauen.

## 1. Eingabe abstrahieren

Nicht direkt im Render-Loop auf `W`, `A`, `S` und `D` reagieren. Erzeugt zunächst einen neutralen Bewegungsintent:

```ts
export interface PlayerIntent {
  forward: number; // -1 bis 1
  turn: number;    // -1 bis 1
  sprint?: boolean;
}

export class KeyboardInput {
  private pressed = new Set<string>();

  constructor(target: Window = window) {
    target.addEventListener("keydown", event => {
      this.pressed.add(event.code);
    });

    target.addEventListener("keyup", event => {
      this.pressed.delete(event.code);
    });
  }

  read(): PlayerIntent {
    return {
      forward:
        Number(this.pressed.has("KeyW")) -
        Number(this.pressed.has("KeyS")),

      turn:
        Number(this.pressed.has("KeyD")) -
        Number(this.pressed.has("KeyA")),
    };
  }
}
```

Das Verhalten entspricht dem ursprünglichen `butchler`-Prinzip, ist aber sauber von eurem restlichen Spiel entkoppelt.

Für den KFB-MVP würde ich zusätzlich Pfeiltasten und Controller-Input auf denselben Intent abbilden:

```ts
const forward =
  Number(keys.has("KeyW") || keys.has("ArrowUp")) -
  Number(keys.has("KeyS") || keys.has("ArrowDown"));

const turn =
  Number(keys.has("KeyD") || keys.has("ArrowRight")) -
  Number(keys.has("KeyA") || keys.has("ArrowLeft"));
```


## 2. Player-Motor implementieren

Ein einfacher charakterrelativer Motor sieht so aus:

```ts
export interface PlayerMotorConfig {
  moveSpeed: number;
  turnSpeed: number;
  radius: number;
}

export class PlayerMotor {
  constructor(
    private readonly object: THREE.Object3D,
    private readonly config: PlayerMotorConfig,
  ) {}

  update(intent: PlayerIntent, delta: number): void {
    const turn = intent.turn * this.config.turnSpeed * delta;

    this.object.rotation.y -= turn;

    const forward = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(this.object.quaternion)
      .normalize();

    const distance =
      intent.forward * this.config.moveSpeed * delta;

    this.object.position.addScaledVector(forward, distance);
  }
}
```

Damit bewegt sich der Character immer in seine Blickrichtung. Das ist die direkte Übertragung der `W/S`-Vorwärtsbewegung und `A/D`-Drehung aus `butchler/Pacman-3D`.[^2_2]

## 3. Kollision dazwischenschalten

Im tatsächlichen Projekt sollte der Motor nicht direkt die Position verändern. Berechnet zunächst eine Wunschposition:

```ts
const desiredPosition = this.object.position
  .clone()
  .addScaledVector(forward, distance);

if (!mazeCollision.canOccupy(desiredPosition, config.radius)) {
  return;
}

this.object.position.copy(desiredPosition);
```

Für euren Maze-Prototypen reicht zunächst:

```ts
export interface MazeCollision {
  canOccupy(position: THREE.Vector3, radius: number): boolean;
}
```

Die Kollision sollte auf eurer logischen Grid-Repräsentation basieren, nicht auf den sichtbaren 3D-Meshes. So könnt ihr KayKit-Wände, Tiny-Treats-Deko und spätere Skins austauschen, ohne die Bewegungslogik zu verändern.

## 4. Pacman-typische Kurvenbewegung

Die ursprüngliche `butchler`-Steuerung dreht den Spieler frei. Für ein Pacman-artiges Maze würde ich sie leicht erweitern:

- W/S bleibt Vorwärts-/Rückwärtsbewegung.
- A/D dreht den Character.
- Der Spieler richtet sich an Kreuzungen automatisch an der nächsten verfügbaren Passage aus.
- Bei blockierter Vorwärtsbewegung wird nicht durch die Wand geschoben.
- Drehung nahe einer Kreuzung wird auf die logische Maze-Richtung quantisiert.

Eine gute Zwischenlösung ist:

```ts
const quarterTurn = Math.PI / 2;
const snappedYaw =
  Math.round(object.rotation.y / quarterTurn) * quarterTurn;
```

Wichtig: Diese Quantisierung nur beim Eintritt in eine Kreuzung verwenden, nicht jeden Frame. Sonst wirkt die Bewegung ruckelig.

## 5. Integration mit freier Orbit-Kamera

Die Kamera sollte nicht die Bewegungsrichtung bestimmen, wenn ihr das ursprüngliche `butchler`-Gefühl erhalten wollt. Sie folgt dem Player lediglich:

```ts
export class OrbitFollowCamera {
  update(
    camera: THREE.Camera,
    target: THREE.Object3D,
    delta: number,
  ): void {
    const desired = target.position.clone().add(
      new THREE.Vector3(0, 8, 10),
    );

    camera.position.lerp(desired, 1 - Math.pow(0.001, delta));
    camera.lookAt(target.position);
  }
}
```

Damit bleiben die Rollen klar:

- Player-Rotation bestimmt, wohin `W` führt.
- Orbit-Kamera bestimmt nur den Blickwinkel.
- Die Kamera darf den Character umkreisen, ohne die Steuerung umzudefinieren.

Wenn ihr lieber eine kamera-relative Steuerung wollt, wäre das **eine bewusste Erweiterung** gegenüber `butchler`, nicht mehr die direkte Übernahme.

## 6. React Three Fiber

In React Three Fiber sollte die Eingabe nicht in React-State geschrieben werden. Verwendet ein mutierbares Input-Objekt oder eine Store-Referenz:

```tsx
function PlayerController({
  player,
  mazeCollision,
}: Props) {
  const input = useKeyboardInput();

  useFrame((_, delta) => {
    const intent = input.read();

    playerMotor.update(intent, delta);
    collectPickups(player);
    updateGhosts(delta);
  });

  return null;
}
```

Das vermeidet unnötige React-Renders während der Bewegung. Für ein schnelles bestehendes R3F-Projekt ist diese Trennung besonders wichtig:

```text
React:
  Szene, Konfiguration, UI, Asset-Auswahl

useFrame:
  Bewegung, Kollision, Animation, Gameplay

Store:
  Score, Leben, Game-Phase, Events
```


## 7. Geeignete KFB-Schnittstelle

Ich würde euren Player-Controller ungefähr so anbinden:

```ts
export interface PlayerController {
  update(delta: number): void;
  getPosition(): THREE.Vector3;
  getForward(): THREE.Vector3;
  reset(spawn: THREE.Vector3, yaw: number): void;
  setInputEnabled(enabled: boolean): void;
}
```

Die konkrete Steuerungsquelle bleibt austauschbar:

```ts
const controller = new PlayerControllerImpl({
  input: keyboardInput,
  motor: playerMotor,
  collision: mazeCollision,
  animation: playerAnimation,
  eyeRig: playerEyeRig,
});
```

Dadurch könnt ihr später ohne Umbau hinzufügen:

- Touch-Steuerung.
- Gamepad.
- Click-to-move.
- Kamera-relative Steuerung.
- Accessibility-Remapping.
- KI-gesteuerte Demo- oder Replay-Steuerung.


## Empfohlene erste Umsetzung

Für euren POC würde ich in dieser Reihenfolge vorgehen:

1. `KeyboardInput` mit WASD und Pfeiltasten einbauen.
2. `PlayerIntent` als internes Datenformat definieren.
3. Freie Charakterbewegung nach dem `butchler`-Modell testen.
4. Maze-Kollision auf Basis eurer Grid-Definition ergänzen.
5. Bewegung an Kreuzungen quantisieren.
6. Orbit-Follow-Kamera unabhängig davon anschließen.
7. Animation anhand von Geschwindigkeit und Drehrichtung aktualisieren.
8. Eye-Tracking auf den aktuellen Bewegungsvektor und nahe Ghost-Ziele reagieren lassen.
9. Erst danach Ghost-Navigation und Power-ups anbinden.

Der entscheidende Unterschied lautet: **Übernehmt die Steuerungsidee, nicht die gesamte Spielarchitektur.** `butchler/Pacman-3D` liefert ein sehr kleines WASD-Modell; in eurem KFB-Projekt sollte dieses Modell als austauschbarer `InputAdapter` und `PlayerMotor` neben Maze-Kollision, Eye-Rigging, Orbit-Kamera und datengetriebenen Characters leben.[^2_3][^2_1]

<span style="display:none">[^2_10][^2_11][^2_12][^2_13][^2_14][^2_15][^2_4][^2_5][^2_6][^2_7][^2_8][^2_9]</span>

<div align="center">⁂</div>

[^2_1]: https://github.com/butchler/Pacman-3D/blob/gh-pages/README.markdown

[^2_2]: http://butchler.github.io/Pacman-3D/

[^2_3]: https://github.com/butchler/Pacman-3D

[^2_4]: https://github.com/n0nb1narydev/Pacman-3d

[^2_5]: https://github.com/MertOzzencir/3D-Pacman-Movement

[^2_6]: https://github.com/andypang1010/Pac-Man_3D

[^2_7]: https://github.com/mujtaba-faizi/PacMan

[^2_8]: https://github.com/mangobanaani/pacman3D

[^2_9]: https://github.com/andypang1010/Pac-man_3D

[^2_10]: https://github.com/erl67/Pacman

[^2_11]: https://github.com/diogofferreira/pacman-3d

[^2_12]: https://github.com/MichalDanielDobrzanski/Pacman3D

[^2_13]: https://github.com/pmm248/3DPacMan

[^2_14]: https://github.com/SamFu1113/3D-pac-man

[^2_15]: https://github.com/liorgonnen/pacman3d


---

# Wie trenne ich die Orbit-Kamera vom PlayerMotor in Three.js

Trenne Kamera und `PlayerMotor`, indem der `PlayerMotor` **nur den Player transformiert** und die Kamera ausschließlich den Player beobachtet. `OrbitControls.target` ist dabei der separate Orbit-Mittelpunkt; die Kamera kann um diesen Punkt kreisen, ohne die Player-Rotation zu verändern.[^3_1][^3_2]

## Zielarchitektur

```text
KeyboardInput
    ↓
PlayerMotor ───────> player.position / player.rotation
    ↓
PlayerTransform ───> CameraRig ───> OrbitControls ───> camera
```

Der Player darf nie `camera.lookAt()` oder `controls.rotateLeft()` aufrufen. Umgekehrt sollte die Kamera niemals die Bewegungsrichtung des Players setzen.

## Vanilla Three.js

```ts
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const player = new THREE.Group();
scene.add(player);

const controls = new OrbitControls(
  camera,
  renderer.domElement,
);

controls.enableDamping = true;
controls.enablePan = true;
controls.minDistance = 4;
controls.maxDistance = 18;
controls.minPolarAngle = 0.35;
controls.maxPolarAngle = 1.35;

const cameraTarget = new THREE.Vector3();
const smoothedTarget = new THREE.Vector3();
```

Der `PlayerMotor` verändert ausschließlich den Player:

```ts
class PlayerMotor {
  constructor(
    private readonly player: THREE.Object3D,
    private readonly collision: MazeCollision,
  ) {}

  update(intent: PlayerIntent, delta: number): void {
    const turnSpeed = 2.8;
    const moveSpeed = 4.0;

    this.player.rotation.y -= intent.turn * turnSpeed * delta;

    const forward = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(this.player.quaternion)
      .normalize();

    const desired = this.player.position
      .clone()
      .addScaledVector(
        forward,
        intent.forward * moveSpeed * delta,
      );

    if (this.collision.canOccupy(desired, 0.35)) {
      this.player.position.copy(desired);
    }
  }
}
```

Die Kamera folgt danach unabhängig:

```ts
function updateCamera(
  player: THREE.Object3D,
  controls: OrbitControls,
  delta: number,
): void {
  cameraTarget
    .copy(player.position)
    .add(new THREE.Vector3(0, 0.8, 0));

  smoothedTarget.lerp(
    cameraTarget,
    1 - Math.pow(0.001, delta),
  );

  controls.target.copy(smoothedTarget);
  controls.update();
}
```

Im Render-Loop:

```ts
const clock = new THREE.Clock();

function animate(): void {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.05);

  playerMotor.update(input.read(), delta);
  updateCamera(player, controls, delta);

  renderer.render(scene, camera);
}
```

`controls.target` sollte gemeinsam mit dem Player verschoben werden, da dieser Punkt das Zentrum der Orbit-Bewegung bestimmt. Nur die Kamera zu verschieben, während das Target an der alten Position bleibt, führt zu unerwartetem Verhalten.[^3_3][^3_1]

## React Three Fiber

Mit `@react-three/drei` bleibt die gleiche Trennung erhalten:

```tsx
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function CameraController({
  playerRef,
}: {
  playerRef: React.RefObject<THREE.Object3D>;
}) {
  const controlsRef = useRef<any>(null);
  const target = useRef(new THREE.Vector3());
  const smoothTarget = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const player = playerRef.current;
    const controls = controlsRef.current;

    if (!player || !controls) return;

    player.getWorldPosition(target.current);
    target.current.y += 0.8;

    smoothTarget.current.lerp(
      target.current,
      1 - Math.pow(0.001, delta),
    );

    controls.target.copy(smoothTarget.current);
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      enablePan
      minDistance={4}
      maxDistance={18}
      minPolarAngle={0.35}
      maxPolarAngle={1.35}
    />
  );
}
```

Drei verwendet standardmäßig die aktive Kamera. Wenn ihr eine bestimmte Kamera kontrollieren wollt, könnt ihr sie explizit über die `camera`-Prop übergeben.[^3_4]

Ein minimalistisches Setup:

```tsx
function GameScene() {
  const playerRef = useRef<THREE.Group>(null);

  return (
    <>
      <Player ref={playerRef} />
      <PlayerMotorSystem playerRef={playerRef} />
      <CameraController playerRef={playerRef} />
    </>
  );
}
```


## PlayerMotor-System

Der Bewegungs-Controller sollte nur Daten aus dem Input lesen und den Player aktualisieren:

```tsx
function PlayerMotorSystem({
  playerRef,
}: {
  playerRef: React.RefObject<THREE.Object3D>;
}) {
  const input = useKeyboardInput();
  const collision = useMazeCollision();

  useFrame((_, delta) => {
    const player = playerRef.current;
    if (!player) return;

    const intent = input.read();

    player.rotation.y -= intent.turn * 2.8 * delta;

    const forward = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(player.quaternion)
      .normalize();

    const desired = player.position
      .clone()
      .addScaledVector(
        forward,
        intent.forward * 4 * delta,
      );

    if (collision.canOccupy(desired, 0.35)) {
      player.position.copy(desired);
    }
  });

  return null;
}
```


## Was getrennt bleiben sollte

| PlayerMotor | Orbit-Kamera |
| :-- | :-- |
| Input interpretieren | Maus-/Touch-Orbit interpretieren |
| Player-Rotation ändern | Kamera-Azimuth und Polarwinkel ändern |
| Vorwärtsbewegung berechnen | Distanz und Blickpunkt verwalten |
| Maze-Kollision prüfen | Kamera-Damping anwenden |
| Animation informieren | `controls.target` aktualisieren |
| Pickups auslösen | Player weich verfolgen |

Vermeide insbesondere diese Kopplungen:

```ts
// Nicht im PlayerMotor:
camera.lookAt(player.position);

// Nicht im PlayerMotor:
controls.target = player.position;

// Nicht in der Kamera:
player.rotation.y = camera.rotation.y;

// Nicht als Bewegungsrichtung:
const direction = camera.getWorldDirection(...);
```

`controls.target` sollte nicht direkt als Objekt-Referenz verwendet werden, sondern über eine eigene Zielposition aktualisiert werden:

```ts
controls.target.copy(smoothedTarget);
```


## Für euren Pacman-POC

Für eure freie Orbit-Kamera empfehle ich drei Referenzpunkte:

```ts
const cameraAnchor = new THREE.Object3D();
const lookTarget = new THREE.Object3D();
const player = new THREE.Group();

player.add(cameraAnchor);
player.add(lookTarget);
```

Praktisch ist aber meist nur ein separater `lookTarget` nötig:

```ts
lookTarget.position.set(0, 0.8, 0);
player.add(lookTarget);
```

Dann folgt die Kamera dem `lookTarget`, während der Player unabhängig seine eigene Richtung behält. Das erlaubt:

- Orbit um den Player.
- Freie Mausrotation.
- Rückwärtslaufen ohne Kamera-Drehung.
- Kamera-relative Sichtkontrolle.
- Eye-Tracking zum tatsächlichen Bewegungs- oder Ghost-Ziel.
- spätere Lock-on- oder Cinematic-Kamera.

Für ein klassisches Pacman-Gefühl würde ich standardmäßig `enablePan = false` setzen und die Kamera nur um einen geglätteten Player-Fokuspunkt kreisen lassen. Für euren explorativen KFB-Slice kann Pan optional bleiben, sollte aber nicht die logische Maze-Bewegung beeinflussen.

<span style="display:none">[^3_10][^3_11][^3_12][^3_13][^3_14][^3_15][^3_5][^3_6][^3_7][^3_8][^3_9]</span>

<div align="center">⁂</div>

[^3_1]: https://threejs.org/docs/pages/OrbitControls.html

[^3_2]: https://threejs.org/docs/examples/en/controls/OrbitControls.html

[^3_3]: https://sites.google.com/view/7faucauerza

[^3_4]: https://drei.docs.pmnd.rs/controls/introduction

[^3_5]: https://pub.dev/documentation/three_js/latest/three_js/OrbitControls-class.html

[^3_6]: https://github.com/pmndrs/react-three-fiber/discussions/505

[^3_7]: https://stackoverflow.com/questions/70212234/use-react-spring-with-orbit-controls-in-react-three-fiber

[^3_8]: https://discourse.threejs.org/t/how-to-make-camera-follow-a-react-three-rapier-object/44405

[^3_9]: https://docs.tresjs.org/cookbook/orbit-controls

[^3_10]: https://deepwiki.com/pmndrs/drei/3.1-camera-controls

[^3_11]: https://sbcode.net/threejs/orbit-controls/

[^3_12]: https://mam-mam.net/en/javascript/three_js_orbitcontrols.html

[^3_13]: https://discourse.threejs.org/t/fiber-orbitcontrols/67383

[^3_14]: https://sudeeptobose.medium.com/basic-3d-camera-movement-with-react-three-fiber-and-maath-library-4b060bfe7c5c

[^3_15]: https://deepwiki.com/pmndrs/drei/3.1.1-orbitcontrols


---

# Wie passe ich die Bewegung an die Kameraausrichtung an

Für kamera-relative Bewegung projizierst du die Blickrichtung der Kamera auf die horizontale XZ-Ebene und leitest daraus Vorwärts- und Rechtsvektor ab. Die Kamera steuert dann nur die Richtung des Inputs; der `PlayerMotor` bleibt weiterhin für Position, Rotation und Kollision zuständig. Three.js stellt dafür `camera.getWorldDirection()` bereit; alternativ kann die lokale Vorwärtsachse `(0, 0, -1)` mit dem Kamera-Quaternion transformiert werden.[^4_1][^4_2][^4_3]

## Bewegungsbasis berechnen

```ts
const cameraForward = new THREE.Vector3();
const cameraRight = new THREE.Vector3();
const worldUp = new THREE.Vector3(0, 1, 0);

function getCameraBasis(camera: THREE.Camera) {
  camera.getWorldDirection(cameraForward);

  // Keine Bewegung nach oben oder unten
  cameraForward.y = 0;

  if (cameraForward.lengthSq() < 0.0001) {
    cameraForward.set(0, 0, -1);
  } else {
    cameraForward.normalize();
  }

  // Für Three.js: right = forward × up
  cameraRight.crossVectors(cameraForward, worldUp).normalize();

  return {
    forward: cameraForward,
    right: cameraRight,
  };
}
```

Die Projektion auf XZ ist für euer Maze entscheidend: Wenn die Kamera nach unten geneigt ist, soll `W` den Player nicht in die Luft bewegen, sondern weiterhin horizontal über das Spielfeld führen. Die Richtung sollte daher normalisiert werden, nachdem `y` entfernt wurde.[^4_4]

## WASD in Bewegungsrichtung übersetzen

```ts
export interface MoveInput {
  forward: number;
  strafe: number;
}

function readMoveInput(keys: Set<string>): MoveInput {
  return {
    forward:
      Number(keys.has("KeyW") || keys.has("ArrowUp")) -
      Number(keys.has("KeyS") || keys.has("ArrowDown")),

    strafe:
      Number(keys.has("KeyD") || keys.has("ArrowRight")) -
      Number(keys.has("KeyA") || keys.has("ArrowLeft")),
  };
}
```

Daraus wird die Weltbewegung:

```ts
const moveDirection = new THREE.Vector3();

function getCameraRelativeMove(
  camera: THREE.Camera,
  input: MoveInput,
): THREE.Vector3 {
  const { forward, right } = getCameraBasis(camera);

  moveDirection
    .set(0, 0, 0)
    .addScaledVector(forward, input.forward)
    .addScaledVector(right, input.strafe);

  if (moveDirection.lengthSq() > 1) {
    moveDirection.normalize();
  }

  return moveDirection;
}
```

Die Normalisierung verhindert, dass diagonale Eingaben schneller sind als reine Vorwärts- oder Seitwärtsbewegung.

## In den PlayerMotor integrieren

Der `PlayerMotor` erhält die Kamera oder besser nur eine abstrakte Bewegungsbasis:

```ts
class PlayerMotor {
  private readonly desiredPosition = new THREE.Vector3();

  constructor(
    private readonly player: THREE.Object3D,
    private readonly collision: MazeCollision,
    private readonly camera: THREE.Camera,
  ) {}

  update(input: MoveInput, delta: number): void {
    const direction = getCameraRelativeMove(
      this.camera,
      input,
    );

    if (direction.lengthSq() === 0) {
      return;
    }

    const speed = 4;
    const distance = speed * delta;

    this.desiredPosition
      .copy(this.player.position)
      .addScaledVector(direction, distance);

    if (this.collision.canOccupy(this.desiredPosition, 0.35)) {
      this.player.position.copy(this.desiredPosition);
    }

    this.rotatePlayerToward(direction, delta);
  }

  private rotatePlayerToward(
    direction: THREE.Vector3,
    delta: number,
  ): void {
    const targetYaw = Math.atan2(
      direction.x,
      direction.z,
    );

    const currentYaw = this.player.rotation.y;
    const shortestDelta = THREE.MathUtils.euclideanModulo(
      targetYaw - currentYaw + Math.PI,
      Math.PI * 2,
    ) - Math.PI;

    this.player.rotation.y +=
      shortestDelta * Math.min(1, delta * 12);
  }
}
```

Da die meisten Three.js-Characters mit ihrer Vorderseite entlang `-Z` modelliert sind, kann bei KayKit-Characters ein Offset nötig sein:

```ts
const modelYawOffset = Math.PI;

this.player.rotation.y =
  targetYaw + modelYawOffset;
```

Welcher Offset korrekt ist, hängt von der tatsächlichen Ausrichtung des GLB-Modells ab. Das sollte pro Character-Profil konfigurierbar sein, nicht fest im Motor stehen.

## Besser: Kamera entkoppeln

Wenn der `PlayerMotor` nicht direkt von einer Three.js-Kamera abhängen soll, verschiebst du die Berechnung in einen `CameraRelativeInputAdapter`:

```ts
export interface MovementIntent {
  direction: THREE.Vector3;
  magnitude: number;
}

class CameraRelativeInputAdapter {
  private readonly direction = new THREE.Vector3();

  constructor(
    private readonly camera: THREE.Camera,
  ) {}

  read(input: MoveInput): MovementIntent {
    this.direction.copy(
      getCameraRelativeMove(this.camera, input),
    );

    return {
      direction: this.direction,
      magnitude: Math.min(
        1,
        Math.hypot(input.forward, input.strafe),
      ),
    };
  }
}
```

Dann bleibt der Motor kameraunabhängig:

```ts
class PlayerMotor {
  update(
    intent: MovementIntent,
    delta: number,
  ): void {
    const speed = 4 * intent.magnitude;

    const desired = this.player.position
      .clone()
      .addScaledVector(
        intent.direction,
        speed * delta,
      );

    if (this.collision.canOccupy(desired, 0.35)) {
      this.player.position.copy(desired);
    }

    this.rotateToward(intent.direction, delta);
  }
}
```

Die Abhängigkeiten sind dann sauber:

```text
KeyboardInput
    ↓
CameraRelativeInputAdapter(camera)
    ↓
MovementIntent
    ↓
PlayerMotor
    ↓
MazeCollision
```

Das ist für euren modularen POC die robustere Variante, weil ihr später problemlos zwischen folgenden Modi umschalten könnt:

```ts
type MovementMode =
  | "camera-relative"
  | "character-relative"
  | "grid-relative"
  | "click-to-move";
```


## React Three Fiber

In R3F sollte die Kamera-relative Berechnung in `useFrame` oder in einem Controller-System stattfinden, ohne die Eingaben in React-State zu schreiben:

```tsx
function PlayerMotorSystem({
  playerRef,
}: {
  playerRef: React.RefObject<THREE.Object3D>;
}) {
  const { camera } = useThree();
  const input = useKeyboardInput();
  const collision = useMazeCollision();

  const direction = useMemo(
    () => new THREE.Vector3(),
    [],
  );

  useFrame((_, delta) => {
    const player = playerRef.current;
    if (!player) return;

    const move = input.read();
    direction.copy(
      getCameraRelativeMove(camera, move),
    );

    if (direction.lengthSq() === 0) return;

    const desired = player.position
      .clone()
      .addScaledVector(direction, 4 * delta);

    if (collision.canOccupy(desired, 0.35)) {
      player.position.copy(desired);
    }

    const targetYaw = Math.atan2(
      direction.x,
      direction.z,
    );

    player.rotation.y = THREE.MathUtils.damp(
      player.rotation.y,
      targetYaw,
      12,
      delta,
    );
  });

  return null;
}
```


## OrbitControls beachten

Wenn `OrbitControls` aktiv ist, sollte die Reihenfolge ungefähr so aussehen:

```ts
useFrame(() => {
  controls.update();
  readCameraRelativeInput();
  updatePlayer();
  updateCameraTarget();
});
```

Noch robuster ist es, `controls.update()` zuerst auszuführen und anschließend die Kameraausrichtung für die nächste Player-Bewegung zu lesen. Das verhindert, dass die Bewegung um einen Frame hinter der aktuellen Orbit-Rotation zurückbleibt. In Drei laufen Controls früh im Frame; die genaue Reihenfolge sollte aber bei komplexeren R3F-Szenen explizit kontrolliert werden.[^4_5]

## Pacman-Maze: Richtung quantisieren

Für euer Maze sollte die freie kamera-relative Richtung an Kreuzungen optional auf die vier Hauptachsen gerundet werden:

```ts
function quantizeToMazeDirection(
  direction: THREE.Vector3,
): THREE.Vector3 {
  if (Math.abs(direction.x) > Math.abs(direction.z)) {
    return new THREE.Vector3(
      Math.sign(direction.x),
      0,
      0,
    );
  }

  return new THREE.Vector3(
    0,
    0,
    Math.sign(direction.z),
  );
}
```

Diese Funktion nicht permanent verwenden, sonst fühlt sich die Bewegung ruckelig an. Nutze sie nur:

- beim Eintritt in eine neue Grid-Zelle,
- an einer Kreuzung,
- wenn eine Wand die freie Richtung blockiert,
- oder bei einer bewusst arcadeartigen Steuerungsvariante.

Damit könnt ihr zwei Modi anbieten:

```ts
const movementMode =
  mazeMode === "arcade"
    ? quantizeToMazeDirection(direction)
    : direction;
```


## Häufiger Vorzeichenfehler

Wenn `W` rückwärts läuft oder `A/D` vertauscht sind, prüfe zuerst:

```ts
camera.getWorldDirection(forward);
```

Die Three.js-Kamera blickt entlang ihrer lokalen negativen Z-Achse. Verwende daher `getWorldDirection()` oder `(0, 0, -1).applyQuaternion(camera.quaternion)`, nicht `(0, 0, 1)` ohne weitere Anpassung.[^4_3][^4_6]

Für euren KFB-Pacman-MVP würde ich standardmäßig **kamera-relative Bewegung mit horizontaler XZ-Projektion** verwenden, den Player weich in Bewegungsrichtung drehen und an Maze-Kreuzungen optional quantisieren. So bleibt die freie Orbit-Kamera erhalten, während sich WASD für Spieler intuitiv an der aktuellen Ansicht orientiert.

<span style="display:none">[^4_10][^4_11][^4_12][^4_13][^4_14][^4_15][^4_16][^4_7][^4_8][^4_9]</span>

<div align="center">⁂</div>

[^4_1]: https://threejs.org/docs/pages/Vector3.html

[^4_2]: https://threejs.org/docs/api/en/math/Quaternion.html

[^4_3]: https://stackoverflow.com/questions/14813902/three-js-get-the-direction-in-which-the-camera-is-looking

[^4_4]: https://mcpmarket.com/tools/skills/three-js-scene-builder-1

[^4_5]: https://drei.docs.pmnd.rs/controls/introduction

[^4_6]: https://discourse.threejs.org/t/how-to-calculate-a-cameras-lookat-direction/47780

[^4_7]: https://discourse.threejs.org/t/move-camera-with-quaternions-and-tween-js/30392

[^4_8]: https://discourse.threejs.org/t/how-to-rotate-camera-from-worlddirection-to-another-vector-without-lookat-method/46206

[^4_9]: https://stackoverflow.com/a/32447626

[^4_10]: https://discourse.threejs.org/t/rotate-camera-and-update-orbitcontrol-with-the-new-camera-rotation/33476

[^4_11]: https://discourse.threejs.org/t/set-object-rotation-using-a-lookat-vector/4617

[^4_12]: https://discourse.threejs.org/t/what-transformation-on-a-quaternion-in-order-for-the-camera-to-look-in-the-opposite-direction/54395

[^4_13]: https://stackoverflow.com/questions/15696963/three-js-set-and-read-camera-look-vector

[^4_14]: https://discourse.threejs.org/t/cant-position-camera-behind-ship-lookat-ship-at-the-same-time-using-quaternions/57873

[^4_15]: https://maxrohde.com/2019/10/25/camera-movement-with-three-js/

[^4_16]: https://discourse.threejs.org/t/camera-animation-with-quaternion-travels-undesired-path/41147

