# Briefing WSA-Work · Begrenzter Modellier-Test R1 (ein Element, externer Kritiker)

Stand: 2026-10-10 · von der Steuer-Sitzung · Auftraggeber Georg · **ein Lauf, fest begrenzt** (max. 1 Arbeitsblock bzw. 3 Korrekturrunden)

## Ziel

Herausfinden, ob WSA (Codex bzw. Work mit eigener Werkzeugkette, z. B. Blender-Python, three.js) ein KFB-Bauteil **nach vorhandenen Vorlagen** besser modelliert als unsere bisherigen Versuche. Ergebnis ist ein Urteil, kein Produktionsauftrag.

## Element

**Die Ton-Treppe zur Burg in KFB Town:** eine Steintreppe, die in einen Hang bzw. eine Terrasse eingesetzt ist, mit Wangenmauern links und rechts und einem Podest oben. Breite ≈ 3 H, Steigung bequem für eine kleine Spielfigur (1 H = 3,64 Einheiten).

## Vorlagen (Pflicht: zuerst ansehen, Form daraus ableiten, nicht frei erfinden)

- Kenney Castle Kit `stairs-stone.glb`, `wall-narrow-stairs.glb` (`media/3D_Assets/kenney_castle-kit/`);
- KayKit Dungeon Pack `stairs_walled.gltf`, `stairs_wide.gltf` (`media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/`);
- Mauerwerk-Töne bzw. Familie A: `#e6d4b5 / #d1ba99 / #b29c7d / #9e856b`;
- falls bis dahin vorhanden: Golden-Referenzbild „Treppe“ aus den Webchat-Kandidaten (`tools/KFB-ToolBox/_inbox/MVP1_RETURNS/G_asset_candidates/refs/stairs/`).

## Stil

Handgebautes Stop-Motion-Diorama: Knete plus erlaubter Materialmix (Balsaholz, Pappe, Moos). Dicke, weiche, leicht unregelmäßige Formen. **Nie konstruiert bzw. CAD-artig, nie repetitiv** (keine identischen Stufen im Raster). Keine harten Schnittkanten (§01).

## Lieferung

1. GLB (≤ 20 k Dreiecke), island-local, y oben, Einheiten Lab (1 H = 3,64).
2. Renders 1600 × 1000 aus festen Kameras: frontal, 3/4 von oben, seitlich, Augenhöhe 1 H am Fuß der Treppe, Nahsicht Anschluss Treppe ↔ Hang.
3. `qcheck.json` nach `docs/QA_CRITIC_PROTOCOL_R1.md` §1b (Q1–Q9; nicht anwendbare Punkte mit Grund).
4. `TEST_REPORT.md`: Werkzeugkette, Runden, Zeit, ehrliches Urteil.

**Ablage:** Branch `wsa/kfb-modelling-test-stairs-2026-10-10`, Ordner `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/WSA_modelling_test/`. PR nicht nötig.

## Prüfung

Den **blinden Kritiker** startet die Steuer-Sitzung (Claude Code) auf den Renders, mit den Vorlagen als Referenz. Bestanden: Mittel ≥ 8, kein Wert < 6. WSA bewertet sich nicht selbst als bestanden.

## Regeln

Keine gekauften bzw. lizenzierten Assets ins Repo. Georg nie um Git-Bedienung bitten. Nach 3 Korrekturrunden Schluss, auch ohne Bestehen.
