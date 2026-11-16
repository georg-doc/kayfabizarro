# RETURN · WS0 Gaussian Splats · 2D Props, Slops, Scenelets + begehbare Dungeon-Geometrie
**Datum:** 2026-11-16  
**Status:** VORBEREITET / NO BUILD / NO STAGE / NO LIVE
**Owner:** WS0 Asset Authoring / Source Intake (georg-doc/kayfabizarro) · **Receiving:** vorhandene Race WS0/WS1-Integration (georg-doc/KFB-Stunt-Car-Race/game/integration-r2).
**Branch:** docs/ws0-splat-assets-slops-scenelets-r0-2026-11-16, Review-/Dokumentationsbranch, nicht gemergt. Genaue HEAD nach letzter Write-Verifikation und PR vermerken; keine vorab erfundene HEAD SHA.
**Stage:** kein Stage-Test beauftragt oder durchgeführt; keine `https://kayfabizarro.pages.dev/…`-Route eingerichtet.

## Geliefert

1. `skills/chat/WS0_GAUSSIAN_SPLAT_2D_SLOPS_SCENELETS_R0_2026-11-16.md`: drei sequentielle source-backed Piloten, je eine echte 2D-Prop-Quelle, ein vorhandener Actor aus dem 72er Slop-/InkBlob-Atlas, ein echtes Diorama-/Scenelet-GLB. Konverter- und Quellenrisiken, Performance, Render-/Gameplay-Ownership, Identitäts-/Alpha-Proof und Stop-Regel dokumentiert. **PatchWorld/patch.gg auf Georgs Wunsch später.**
2. `skills/chat/WS0_SDF_SPLAT_DUNGEON_CAVES_ROOMS_WALLS_ENTRIES_R0_2026-11-16.md`: vierte **Folgeklasse** nach 1–3. Drei konkrete Bauteile: R3-Eingang/Luke, kurzer kollisionsfähiger Wand-/Gangabschnitt mit Durchbruch, echter Raumabschnitt. 2×2-A/B/C/D-Plan trennt Geometrie (Original versus SDF) von Rendering (Mesh versus Splats); physische Öffnung und Kollisions-/Nav-Wahrheit separat. Reale InfiniteRooms-R3-Quellgrenze eingebunden, kein neuer Dungeon/World Owner.
3. Dieser Return und der lokale additive Changelog (R0, keine Implementierung).

## Quellenbefund / Evidence

- KFB-Race-Branch bei Quellenprüfung: `game/integration-r2` @ `648f932e52eadaa019e141ce8e34508bd372e5e5`. WS1-Übergabe `docs/UEBERGABE_WS1_INTEGRATION_R2.md`, `docs/MODULE.md`, `src/data/mobs2d/{inkblobs.r1.json,slop-loops.r1.json}`, `src/world/dioramen/README.md`, `src/world/szenen/README.md`, `src/modules/infiniteRooms/{ACCEPTANCE.md,HOST_CONTRACT.md,RETURN.md,level.mjs}`, `src/world/{InfiniteRooms.jsx,infiniteRoomsHost.js}` und Issue #127 gelesen.
- `src/modules/infiniteRooms/ACCEPTANCE.md` vom 16.11. belegt **16/16 Node/Rapier-Tests PASS** im bestehenden R3-Kandidaten, G2/G3/G5/G6 begrenzt PASS, G4 WARN, echter Environment-Gate FAIL. Nicht zu Splat-Tests oder Game-Look-Freigabe umdeuten.
- WS0 Asset Registry/Librarian und `WS0_BLACK_INK_BLOB_SERIES/{README.md,LIBRARIAN_GAME_HANDOFF.md,RETURN.md}` gelesen; Source-18-Sheets noch nicht eingepflegt, 72er vorhandener Privat-Atlas ist **separate** Quelle. Kein eingegliederter neuer 108er Actor behauptet.
- Externe Source-Donor-Kandidaten aus vorherigem Webchat überprüft: `siliconjungle/shapeshift-labs-ink-studio`, `cobanov/pixelart-gaussiansplat`, `iamvillain/SyntaxSplat`. Keine Runtime-Adoption, kein isolierter Donor-Render in diesem Dokumentationsschritt.

## Tatsächliche Tests und Grenzen

- 2/2 Briefingdateien als GitHub-Text neu erstellt und per exaktem Branch-HEAD/Datei-Readback verifiziert (vor diesem Return-Write).
- **0** neue Source-Asset-Bytes importiert; **0** SDF-/Gaussian-Splat-Konverter ausgeführt; **0** neue PNG-/GLB-Renderings; **0** neue Rapier-/Collider-/Browser-/GPU-Benchmarks; **0** neue Stage-/Site-/Hub-Browser-Tests.
- Doku-Absicht ist kein Beweis der technischen oder visuellen Überlegenheit; Performance-Budgets in Briefings sind Vorschlagswerte, keine gemessenen Kosten.

## Grenzen und offene Punkte

- Drei echte Original-Dateien/Hashes und ein R3-Source-Objekt sind für Umsetzung noch in Isolation nachzuweisen; Original/2D/GLB-Screenshots sind heute nicht erstellt worden.
- 2D-Sprites sind nicht automatisch rekonstruktionsfähige 3D-Modelle; Gaussian Splats besitzen nicht selbst authoritative Kollision.
- R3 bleibt NO-GO für aktuelle Spiel-/Site-Aktivierung; Umgebungs-/Kartengeometrie-/HyperNorm-/Look-Gates offen.
- Der aktuelle `kfb-hub/current-board.json`-Eintrag auf dieser **Review-Branch** ist, sofern ergänzt, nur ein Kandidaten-Pointer und nicht live. Bestehende Runtime-/Asset-/World-/Portal-Besitzer bleiben unverändert.
- Kein Merge nach main, keine automatische Stage-/Live-Promotion, keine neue Gameplay-Freigabe.

## Genau ein nächster produktiver Gate

**WS0/Asset Librarian: Quelle zuerst isolieren.** Wähle **einen echten 2D-Prop, einen bestehenden 72er-Slop und ein kleines vorhandenes Diorama-/Scenelet-GLB**, zeige Originale mit tatsächlicher Quellidentität und Hash einzeln, markiere fehlende Originale offen. Erst dann den 3er A/B-Viewer bauen; **anschließend** den R3-Höhlen-/Dungeon-Raum-/Wand-/Eingangskorridor mit derselben geprüften Splat-Pipeline als viertes Modul untersuchen. Patch-Styles bleiben ausgenommen.

**Georg muss derzeit nichts tun.** Sichtbare Ergebnisse entstehen erst mit Original-Isolation und den darauf folgenden tatsächlichen Viewer-Renders.
