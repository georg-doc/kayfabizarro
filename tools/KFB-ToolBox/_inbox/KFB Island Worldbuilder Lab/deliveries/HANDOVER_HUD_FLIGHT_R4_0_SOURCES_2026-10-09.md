# Übergabe an die HUD/Flug-Session · Quellen für R4-0 · 2026-10-09

Für den Blocker R4-0 im `SPRINT_R4_PLAN.md` (`KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1`). Die vier Quellen fehlen auf GitHub, weil sie bisher nur im lokalen KFB Island Worldbuilder Lab lagen.

| Gesucht | Wo | Status |
| --- | --- | --- |
| `docs/MVP_DRIVE_LOOP_R1_PLAN.md` | abgelöst durch **`KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md`** (liegt dieser Übergabe bei); relevant sind §3, §3b (Kamera), §3c (Reisemodi + HUD), §4 (Besitzer) | lokal im Lab |
| `ENV_ROLES` (`src/palettes.ts`) | unten vollständig eingefügt: Farbrollen je Insel-Palette (ground, grass, stone, bark, leaf, bloom, water, accent), je 3 Töne hell → dunkel | lokal im Lab |
| `kfbBlend` | GitHub `georg-doc/kayfabizarro`: `tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/road-markings.m1.js` (Export `KFB_BLEND_GLSL`, Pin `927a1b4`). Die Drei-Größen-Fassung `kfbLayer` steht in der R2D-Bauanleitung §4 | auf GitHub |
| Mauerwerk-Familie A | v1 gebaut (RKIT): Branch `sync/lab-rkit-2026-10-09`, Pfad `tools/KFB-ToolBox/_inbox/KFB Racetrack Blender Kit/RKIT-R3/masonry_a/` (31 GLB, `manifest.json`, README) | auf GitHub |

**Hinweise für R4-7:**
- `createHud({ palette })` liest die Rollen `accent` (Akzent, Zeiger, Fluff), `ground`/`stone` (Plakettenkörper) und `water` (Höhe bzw. Flug).
- Für die Biome, die es in `ENV_ROLES` noch nicht gibt (Burg, Schnee, Dystopia, Utopia, Protopia), gelten bis zur Erweiterung die Werte aus `hex-archipel.r2c.js`.
- Für Übergänge gilt **QA §01:** keine Verläufe, keine harten Schnitte, organisch und knetig.

## ENV_ROLES (Stand Lab 2026-10-09, `src/palettes.ts`)

```ts
export interface EnvRoles {
  /** where it comes from, per role (shown on the colour-grammar sheet) */
  why: Record<string, string>;
  ground: [string, string, string];
  /** grass tufts: always the ground family, lighter and a little greener, never the leaf colour */
  grass: [string, string, string];
  /** stone / rock: from the island's own earth (underside, hills), never a tower colour */
  stone: [string, string, string];
  bark: [string, string, string];
  leaf: [string, string, string];
  bloom: [string, string, string];
  water: [string, string, string];
  /** props and the one accent family that leads to the landmark */
  accent: [string, string, string];
}

export const ENV_ROLES: Record<string, EnvRoles> = {
  wueste: {
    why: {
      ground: 'Sand der Insel (top, top2)', grass: 'Trockengras: Sand + Ocker, leicht oliv', stone: 'Sandstein-Ocker aus Dünen und Pyramide (hill, rock)',
      bark: 'Palmstamm: warmes Braun (trunk)', leaf: 'Palmen-Oliv bis Grün (leaf 0/1)', bloom: 'Kaktusblüte Koralle (leaf 2)',
      water: 'Oasentürkis (water)', accent: 'Pyramidenspitze hell + Koralle für Requisiten',
    },
    ground: ['#f1d08c', '#eac47c', '#d6a455'], grass: ['#e3cf86', '#c9b46a', '#a99550'], stone: ['#f0c98a', '#e2aa62', '#c48a4a'],
    bark: ['#c08a55', '#a8713f', '#7d5230'], leaf: ['#7cc05a', '#5fb04a', '#3f9142'], bloom: ['#f59a74', '#ef7a4f', '#c95a35'],
    water: ['#5fd0db', '#34bccb', '#1f95a6'], accent: ['#f8dc98', '#ef7a4f', '#c95a35'],
  },
  canyon: {
    why: {
      ground: 'Violetter Tisch (top, hill)', grass: 'Laubgrün entsättigt, Richtung Tisch-Violett verschoben (liest als Gras, fügt sich in den Boden)', stone: 'Orange Canyonfels aus Unterseite und Tafeltürmen (under 1–2, tower), wie Claybound',
      bark: 'Rinde Braun (trunk)', leaf: 'Kugelkronen Waldgrün (leaf 0/1)', bloom: 'Lime-Gelb (leaf 2)',
      water: 'Teich Schieferblau (water)', accent: 'Strang-Orange: Mühlrad, Requisiten',
    },
    ground: ['#a582d9', '#8b68c7', '#7b5bb8'], grass: ['#8aa486', '#6e8a6a', '#566e58'], stone: ['#f0955a', '#e8743a', '#c45a2c'],
    bark: ['#a6704a', '#8a5a3a', '#64402a'], leaf: ['#3a9a55', '#2f8a45', '#1f7a3e'], bloom: ['#e0da80', '#cdc666', '#a8a048'],
    water: ['#7aa0c4', '#5983ac', '#3f6690'], accent: ['#f2b632', '#ef5a22', '#c4441a'],
  },
  bucht: {
    why: {
      ground: 'Sand (top, sand)', grass: 'Dünengras: Sand + Aqua-Hauch', stone: 'Strandstein: warmer Ocker aus der Unterseite (under 1–2)',
      bark: 'Stamm Sandbraun (trunk)', leaf: 'Lime-Grün (leaf 0/1)', bloom: 'Tangblüten Rosa (leaf 2)',
      water: 'Lagune Aqua (water)', accent: 'Korallen-Violett (rock, tower): nur Akzent und Requisit, nicht Fels',
    },
    ground: ['#fbe8b4', '#f0cf7e', '#e3bc66'], grass: ['#dfe0a0', '#c4cf86', '#9fb46a'], stone: ['#e0b080', '#c9895a', '#a06a45'],
    bark: ['#dca070', '#c9895a', '#a06a45'], leaf: ['#a8dc60', '#8fcf45', '#5fb84a'], bloom: ['#fbc0d8', '#f7a1c4', '#e07aa6'],
    water: ['#6fd8e4', '#3fc4d4', '#2aa0b2'], accent: ['#b08ae0', '#9a6fd0', '#7a52b0'],
  },
  otown: {
    why: {
      ground: 'Petrol (top, hill)', grass: 'Petrol heller, Richtung Mint', stone: 'Schiefer: Lila-Grau aus der Unterseite (under 2–3), entsättigt',
      bark: 'Lila Stämme (trunk = Unterseiten-Lila)', leaf: 'Herbstkronen Orange (leaf 0/1)', bloom: 'Magenta (leaf 2)',
      water: 'Taubenblau (water)', accent: 'Magenta der Wackeltürme (tower, rock): nur Akzent und Requisit',
    },
    ground: ['#45b2a2', '#3aa596', '#2f8f83'], grass: ['#6cc6ae', '#4fb39e', '#3a9a88'], stone: ['#8e80a6', '#74688e', '#584e72'],
    bark: ['#83619f', '#6b4a8a', '#4f3568'], leaf: ['#f5b041', '#f08a2c', '#d06a1c'], bloom: ['#e07ab0', '#c9508f', '#a03a72'],
    water: ['#7f9fba', '#5f7f9a', '#46627c'], accent: ['#f08ab8', '#e0679f', '#c9508f'],
  },
};
```
