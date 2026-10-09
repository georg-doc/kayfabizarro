# Onboarding · frischer Chat · KFB HUD + Flug-VFX

Für den nächsten Chat in diesem Claude-Design-Projekt. Erst lesen, dann bauen.

## Wer und wie

- Georg entscheidet. Der Chat baut, legt vor und fragt bei echten Weichen.
- Sprache Deutsch, sachlich, kurz. Keine Em-Dash-Ketten, keine Emoji.
- Georgs Feedback kommt oft als Sprachnachricht mit Inline-Kommentaren auf der Tafel. Punkte als Todo-Liste aufnehmen und einzeln abhaken.
- Kleine Wünsche: nur das ändern. Größere Richtungswechsel: neue Runde im Changelog.

## Leseordnung

1. `hud-flight/docs/LIVING_HUD_FLIGHT.md` (Stand, Entscheidungen, Offen)
2. `hud-flight/docs/SPRINT_R4_PLAN.md` (nächster Sprint)
3. `hud-flight/docs/CHANGELOG.md` (nur oberste Runde)
4. `uploads/BRIEF_CLAUDE_DESIGN_HUD_FLIGHT_R1-*.md` (ursprüngliches Briefing)
5. `github.md` (Repo-Bezug, gelesene Quellen)
6. Clay SSOT auf GitHub, PR #301, Branch `work/clay-style-ssot-2026-10-01`:
   `tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md`, `KFB_CLAY_GOLDEN_SAMPLE_MATRIX.md`
7. Clay-Kanon auf main: `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`
8. K2-Stand: `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/docs/LIVING_CLAY.md`

## Die Tafel

`KFB HUD Flight Board.dc.html`. Sektionen:
- A · HUD je Reisemodus (+ Mobil, Radio-Zustände)
- B · Moduswechsel als Einzelbilder
- C · Flug-VFX (Speedlines, Manöver, Schub, Schweben, Überflug, Puff)
- F · Rucksack und Biom-Radio
- D · Live (Tasten 1/2/3, Doppel-Leertaste, R, B)
- E · Bauteile und Herkunft

Tweaks: Palette (Lila/Burg/Dystopia/Utopia/Protopia), HUD folgt Biom, Figurzone.

## Regeln aus dem Clay-Kanon, die hier gelten

- »KayKit style« ist keine Materialangabe. Quelle besitzt Form und Identität, Clay SSOT besitzt die Oberfläche.
- K1/H0 v8 = visuelle Golden-Linie. K2/v10 = technische Basis für neue Bühnen, aber erst nach Golden-A/B.
- Golden-A/B zeigt immer: unverändertes Original | Golden | Kandidat, gleiche Kamera und gleiches Licht. Urteil `MATCH / TUNE / FAIL / NOT_TESTED`.
- Kleine Props: Profil `prop`, keine Gelände-Fingerabdrücke.
- Skinned Figuren: kein statisches Softening.
- Fehlende Quelle = `SOURCE_REQUIRED`, nicht improvisieren.
- Performance nur im fokussierten Fenster auf der Ziel-GPU, sonst `UNKNOWN`.

## Was es schon gibt (nicht neu erfinden)

- K7 Knet-HUD (`lab-clay/clay-hud.v1.js`) mit Rucksack + 20 Plätzen. Vor jeder HUD-Textur-Arbeit lesen (R4-1).
- `song-transport.js` als Audio-Weg. Das Radio meldet nur Ereignisse.
- `transition-atlas.v1.js` für Paletten-Übergänge.
- `clay-vfx.v1.js` (Joyride J14) für Knet-Partikel.

## Nicht gefunden (Stand 2026-10-09)

`MVP_DRIVE_LOOP_R1_PLAN.md`, `ENV_ROLES` (`src/palettes.ts`), `kfbBlend`, Mauerwerk-Familie A. Gesucht in `main` und `blender-mcp/motion-forge-poc-01-2026-10-08`, ebenso im lokalen Ordner. Georg nach Branch fragen, bevor diese Pakete starten.

## Erster Schritt im neuen Chat

1. LIVING lesen und Georg den Stand in drei Sätzen bestätigen.
2. R4-0: fehlende Quellen bei Georg anfragen (ein Formular, Branch/Pfad je Quelle).
3. R4-1: K7 lesen, Vergleichstafel R3 | K7 bauen, Georg entscheidet den Owner.
