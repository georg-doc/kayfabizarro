Genau — das neutrale Foundation-Dokument braucht einen **Referenz- und Code-Anhang**, sonst bleibt Claude wieder in der Situation: Es kennt Prinzipien, erfindet aber die konkrete Umsetzung schlampig neu.

Die richtige Konsequenz ist:

> Claude darf neue Combat- oder Cube-VFX nicht frei gestalten, bevor es eine passende, funktionierende Referenz-Fixture kopiert, ausführt und nachweislich verstanden hat.

## Referenzstrategie

Nicht ein riesiges Repo suchen, das alles perfekt kann. Stattdessen baut ihr eine kleine **Reference Stack** aus funktionierenden Bausteinen:

```text
Physics / collisions
+ particle system
+ trail system
+ dissolve shader
+ match-3 board logic
+ audio event routing
+ debug fixtures
```

Dann wird daraus euer eigenes `game-vfx-foundation`-Repo.

# A. Combat VFX: Referenzen

## 1. Three.quarks — Partikelbasis

[Alchemist0823/three.quarks](https://github.com/Alchemist0823/three.quarks)

Das ist die wichtigste praktische Basis für:

- Muzzle flashes;
- Smoke;
- Sparks;
- Fire;
- Explosionen;
- Trails;
- Emitter-Lifetime;
- Particle-Pooling;
- Modifier wie Velocity, Color-over-Life und Size-over-Life;
- Editor-/Preset-Workflow. [github](https://github.com/study-game-engines/three.js-particles)

### Was Claude konkret übernehmen soll

```text
Emitter lifecycle
→ emitter start
→ particles evolve by lifetime
→ emitter stop
→ particles finish naturally
→ object released / reused
```

Nicht:

```text
new random mesh every frame
```

### Pflicht-Fixtures daraus

```text
muzzle-flash.fixture
spark-burst.fixture
smoke-trail.fixture
fireball.fixture
explosion.fixture
```

## 2. wawa-vfx — einfache Three.js-API

[wass08/wawa-vfx](https://github.com/wass08/wawa-vfx)

Wawa-VFX ist sinnvoll, wenn Three.quarks zu umfangreich wird. Es positioniert sich als leichtgewichtige VFX-Engine für Vanilla Three.js und React Three Fiber, inklusive Beispielen. [github](https://github.com/wass08/wawa-vfx)

### Verwendung

```text
KFB braucht:
- kleine, gut lesbare Effekte
- wenige Emitter
- reproduzierbare Presets
- kein riesiges Editor-System

Dann:
wawa-vfx zuerst testen
```

### Pflicht-Fixtures

```text
single-impact.fixture
small-spark.fixture
short-trail.fixture
small-explosion.fixture
```

## 3. Three-VFX — spätere GPU-/Trail-Schicht

[mustache-dev/Three-VFX](https://github.com/mustache-dev/Three-VFX)

Three-VFX ist interessant für WebGPU, GPU-Partikel und Meshline-Trails. Es unterstützt aktuell unter anderem Meshline-Konfiguration mit Segmenten, Breite, Opazität und History-Länge. [github](https://github.com/mustache-dev/Three-VFX)

### Nicht als Startpunkt

```text
Nicht für:
ersten Prototyp
erste Projektilwaffe
erste Cube-Cascade
erste VFX-Academy
```

### Später sinnvoll für

```text
Luftkampf
lange Raketen-Trails
viele gleichzeitig sichtbare Projektile
massive Explosionen
größere 3D-Szenen
```

## 4. Dusterheim — komplette FPS-Ereigniskette

[Bodycam FPS Shooter Prototype](https://discourse.threejs.org/t/bodycam-inspired-fps-shooter-prototype-with-physics-three-js-tech-demo/93170)

Das ist eine wichtige Referenz, weil es nicht nur Partikel zeigt, sondern eine gesamte Weapon-Event-Pipeline:

```text
hitscan
→ tracer
→ muzzle flash
→ impact particles
→ decals
→ recoil
→ audio
→ debug UI
```

Die Ästhetik ist nicht KFB-kompatibel. Der technische Ablauf ist aber genau die Pipeline, die Claude Design übernehmen sollte. [discourse.threejs](https://discourse.threejs.org/t/bodycam-inspired-fps-shooter-prototype-with-physics-three-js-tech-demo/93170)

### Pflicht-Lektion

Claude soll daraus nicht Formen übernehmen, sondern diese Frage beantworten:

```text
Wo wird Input in einen ShotEvent übersetzt?
Wo wird der Raycast durchgeführt?
Wo wird ein Treffer als HitEvent gespeichert?
Wo werden VFX, SFX und Decal getrennt ausgelöst?
Wo läuft Cleanup?
```

## 5. cannon-es FPS — Physics-/Controller-Basis

[cannon-es threejs_fps.html](https://github.com/pmndrs/cannon-es/blob/master/examples/threejs_fps.html)

Nicht für die VFX selbst, aber hilfreich als belastbare Referenz für:

- Three.js + Physics;
- Collider;
- Controller;
- Ray-/Collision-Kontext;
- feste Simulationsschleife. [github](https://github.com/pmndrs/cannon-es/blob/master/examples/threejs_fps.html)

# B. Boxel Blitz: Cube-/Cascade-Referenzen

Es gibt weniger perfekte Three.js-Match-3-Referenzen als Combat-Referenzen. Deshalb würde ich die Referenzbasis aufteilen:

```text
Board logic
+ 3D cube physics
+ dissolve
+ particles
+ sound progression
```

## 1. Element Crush — Board-Logik

[theharrychen/Element-Crush](https://github.com/theharrychen/Element-Crush)

Das ist ein simples Match-3-Spiel mit Pygame. Es ist nicht Three.js, aber gut für:

- Grid-Repräsentation;
- Match-Erkennung;
- Clear-Reihenfolge;
- Fall-/Refill-Logik;
- Cascade-Loop. [github](https://github.com/theharrychen/Element-Crush)

Claude soll daraus nur die Spielregelstruktur übernehmen:

```text
Board state
→ detect matches
→ mark matched cells
→ remove matched cells
→ collapse board
→ refill
→ detect next matches
```

Nicht die Rendering-Logik.

## 2. Dissolve Shader — Three.js

[JatinChopra/emissive-dissolve-effect](https://github.com/JatinChopra/emissive-dissolve-effect)

Das ist eine direkte Three.js-Referenz für Dissolve-Effekte über Shader und Partikel. [github](https://github.com/JatinChopra/emissive-dissolve-effect)

Relevant für Boxel Blitz:

```text
Cube marked for clear
→ dissolve uniform increases
→ edge glow optional
→ particles emit from cube volume
→ mesh removed after animation
```

Wichtig: Das ist eine technische Dissolve-Basis. Für den neutralen Standard zunächst:

```text
kein KFB-Ink
keine Kartenpartikel
keine Papierformen
```

## 3. ThanosEffect — Disintegration

[Aghajari/ThanosEffect](https://github.com/Aghajari/ThanosEffect)

Canvas- und OpenGL-Implementierung einer Partikel-Disintegration. Relevant für:

- Raster-/Fragment-Disintegration;
- gestaffelte Auflösung;
- Alpha-Fade;
- Partikelrichtung;
- Performance-Überlegungen. [github](https://github.com/Aghajari/ThanosEffect)

Für Cube Clears kann daraus entstehen:

```text
Cube
→ 8–27 kleine Voxel-Fragmente
→ kleine Auswärtsbewegung
→ Gravity / Fade
→ Pool release
```

## 4. Three.quarks Showcase

[study-game-engines/three.js-particles-showcase1](https://github.com/study-game-engines/three.js-particles-showcase1)

Die Fire-/Smoke-/Sparkle-Beispiele sind auch für Boxel Blitz direkt nützlich:

```text
Cube pop
→ short sparkle

Cube collision
→ short spark burst

Combo
→ controlled confetti/sparkle accent
```



## 5. Three.js Physics: Box3 und Rigid Bodies

Für den ersten Cube-Flick-Prototyp braucht ihr nicht sofort komplexe Physik. Für einfache Box-Kollisionen kann `Box3.intersectsBox()` als Start dienen; später kann Rapier oder cannon-es kommen. [github](https://github.com/pmndrs/cannon-es/blob/master/examples/threejs_fps.html)

Die Basisschicht:

```text
Flick Cube:
velocity + direction

Target Cube:
AABB / Box3 collision

Contact:
resolve hit direction

Board:
decides legal move and cascade
```

Nicht:

```text
freie Rigid-Body-Simulation entscheidet, ob ein Match entsteht
```

# C. Copy/Paste-Blueprint: Reference Manifest

Lege diese Datei in euer neues Neutral-Foundation-Repo:

```ts
export type ReferenceModule = {
  id: string
  source: string
  purpose: string
  useFor: string[]
  doNotCopy: string[]
  requiredFixture: string
}

export const REFERENCE_MODULES: ReferenceModule[] = [
  {
    id: 'three-quarks',
    source: 'https://github.com/Alchemist0823/three.quarks',
    purpose: 'Particle emitter lifecycle, trails, smoke, sparks, explosions',
    useFor: [
      'muzzle flashes',
      'impact bursts',
      'smoke trails',
      'spark particles',
      'emitter cleanup'
    ],
    doNotCopy: [
      'visual style',
      'random effect choices',
      'large particle counts by default'
    ],
    requiredFixture: 'particle-lifecycle.fixture'
  },
  {
    id: 'wawa-vfx',
    source: 'https://github.com/wass08/wawa-vfx',
    purpose: 'Lightweight Three.js VFX API and examples',
    useFor: [
      'small local effects',
      'single impacts',
      'short trails',
      'simple preset system'
    ],
    doNotCopy: [
      'project-specific scene assumptions',
      'unreviewed visual presets'
    ],
    requiredFixture: 'single-impact.fixture'
  },
  {
    id: 'dusterheim-reference',
    source: 'https://discourse.threejs.org/t/bodycam-inspired-fps-shooter-prototype-with-physics-three-js-tech-demo/93170',
    purpose: 'Weapon event pipeline: hitscan, tracer, recoil, impact, decal, debug',
    useFor: [
      'ShotEvent lifecycle',
      'HitEvent separation',
      'tracer timing',
      'decal cleanup',
      'debug tooling'
    ],
    doNotCopy: [
      'realistic military art direction',
      'photorealistic postprocessing',
      'weapon-specific visuals'
    ],
    requiredFixture: 'hitscan-impact.fixture'
  },
  {
    id: 'element-crush',
    source: 'https://github.com/theharrychen/Element-Crush',
    purpose: 'Match-3 board state, clear, gravity, refill, cascade logic',
    useFor: [
      'board state',
      'match detection',
      'clear order',
      'gravity',
      'cascade loop'
    ],
    doNotCopy: [
      'Pygame rendering',
      'its visual styling',
      'its UI'
    ],
    requiredFixture: 'three-cube-clear.fixture'
  },
  {
    id: 'dissolve-effect',
    source: 'https://github.com/JatinChopra/emissive-dissolve-effect',
    purpose: 'Three.js shader dissolve and particle disintegration',
    useFor: [
      'cube clear dissolve',
      'temporary shader material',
      'particle emission on clear'
    ],
    doNotCopy: [
      'emissive glow as default',
      'project-specific color palette'
    ],
    requiredFixture: 'cube-dissolve.fixture'
  },
  {
    id: 'thanos-effect',
    source: 'https://github.com/Aghajari/ThanosEffect',
    purpose: 'Particle disintegration in Canvas/OpenGL',
    useFor: [
      'fragment timing',
      'disintegration order',
      'alpha fade',
      'fragment pooling'
    ],
    doNotCopy: [
      'cinematic visual language',
      'effect intensity without gameplay context'
    ],
    requiredFixture: 'fragment-clear.fixture'
  }
]
```

# D. Pflicht: Claude muss Referenzen erst reproduzieren

Der zentrale Arbeitsauftrag sollte lauten:

```text
Before designing a new VFX:
1. Choose one referenced fixture.
2. Run the original reference.
3. Identify its lifecycle and its data model.
4. Reproduce the fixture in the neutral foundation repo.
5. Capture side-by-side screenshots/video.
6. Explain:
   - state trigger
   - start condition
   - active phase
   - end condition
   - pool/cleanup behavior
   - visual hierarchy
7. Only then create a controlled variant.
```

Nicht:

```text
Read a README
→ invent an effect from memory
```

# E. Combat VFX Academy: konkrete Pflicht-Fixtures

```text
01_muzzle_flash
02_hitscan_tracer
03_projectile_travel
04_organic_impact
05_metal_impact
06_water_impact
07_beam_impact
08_temporary_decal
09_recoil_recovery
10_full_shot_event
```

Jede Fixture erhält:

```ts
export type CombatFixture = {
  id: string
  referenceModule: string
  trigger: string
  weaponMode: 'hitscan' | 'projectile' | 'beam'
  targetMaterial: SurfaceMaterial
  expectedPrimaryRead: string
  expectedSecondaryRead: string[]
  expectedCleanupMs: number
  screenshotFrames: number[]
}
```

# F. Boxel Blitz Academy: konkrete Pflicht-Fixtures

```text
01_cube_flick
02_cube_contact
03_neighbor_activation
04_three_cube_clear
05_voxel_fragment_dissolve
06_gravity_fall
07_landing_bounce
08_second_cascade
09_combo_accent
10_board_settle
```

## Wichtiges Board-Referenzmuster

```ts
function resolveBoard(board: BoardState) {
  const matches = findMatches(board)

  if (!matches.length) {
    return { type: 'settled', board }
  }

  const afterClear = clearMatches(board, matches)
  const afterGravity = applyGravity(afterClear)
  const afterSpawn = refill(afterGravity)

  return {
    type: 'cascade',
    matches,
    board: afterSpawn
  }
}
```

Die Visualisierung bekommt nur das Ergebnis:

```ts
const plan = buildCascadePlan(beforeBoard, afterBoard, matches)
playCascadePlan(plan)
```

Das ist der Kern, den Claude nicht „künstlerisch“ gestalten darf.

# G. Ein konkreter Claude-Design-Block

```text
You are not allowed to invent a new VFX implementation from scratch.

Use the reference manifest in `reference-modules.ts`.

For Combat VFX:
- use Three.quarks or wawa-vfx as the particle lifecycle reference;
- use Dusterheim as the weapon event pipeline reference;
- use cannon-es FPS only for physics/controller concepts;
- reproduce the selected fixture before modifying it.

For Boxel Blitz:
- use Element-Crush for board/cascade logic;
- use the Three.js dissolve reference for cube clear;
- use ThanosEffect for fragment timing;
- use Three.quarks for particle lifecycle;
- keep board logic separate from render/VFX.

Required workflow:
1. Select reference module.
2. Select one fixture.
3. State exactly what is copied:
   data flow, lifecycle, cleanup, timing, not visual style.
4. Implement neutral reproduction.
5. Add debug overlay.
6. Capture fixed-camera proof.
7. Compare result to expected primary/secondary/tertiary reads.
8. Only after approval, add one controlled visual variation.

Forbidden:
- random unreferenced geometry
- new VFX shapes without a fixture
- generic rings for impacts
- unbounded particle creation
- sound chosen only by weapon, not target material
- KFB style adapters before neutral fixture approval
- adding unrelated systems
```

# Mein Fazit

Du hast recht: Die bisherigen Dokumente erklären Claude, **wie es denken sollte**. Was ihm zusätzlich fehlt, ist eine **kleine Sammlung funktionierender Referenzbausteine**, die es ausführen, kopieren, debuggen und kontrolliert variieren kann.

Die beste Kombination wäre:

```text
Combat:
Three.quarks
+ wawa-vfx
+ Dusterheim event pipeline
+ cannon-es controller reference

Boxel Blitz:
Element-Crush board logic
+ Three.js dissolve effect
+ ThanosEffect fragment logic
+ Three.quarks particles
+ Box3 / simple physics
```

Danach kann Claude nicht mehr behaupten, es müsse Sterne, Ringe oder willkürliche „Staubflächen“ frei erfinden. Es bekommt ein klares Referenzmodul, eine Fixture, ein Datenmodell und ein Screenshot-Gate.