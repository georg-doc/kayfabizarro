# MANIFEST — KFB Embed-Bundle (Versionen & Push)

**Bundle-Version v1 · 2026-08-14.** Ziel-Ablage auf GitHub: `skills/kfb-embed-bundle/`.
Prinzip: das Bundle ist **Index + Primer + Zeiger**, kein zweiter Modul-Speicher.

## Was drin ist
| Datei | Rolle |
|---|---|
| `00_INDEX.md` | Fähigkeits-Index (Mensch): 11 Fähigkeiten, kanonische URL, Fähigkeitstest, Voll-Doku |
| `kfb-embed-index.json` | derselbe Index (Maschine) — für Tools/LLMs konsumierbar |
| `KICKOFF_ext-LLM.md` | paste-ready Primer: die 6 Lade-Regeln + „Fähigkeit holen"-Muster |
| `MANIFEST_versions.md` | dieses Blatt |

## Schon kanonisch auf GitHub (nur verlinken)
- **Cube-Pet:** `EMBED_CUBE_PET_FULL_v2.2.md` (skills/) · Modul `media/3D_Assets/kfb-pets.js` via jsdelivr.
- **Cartoon-Motion:** `skills/cartoon-motion_v1.md`.
- **Ink-Kanon (Modul):** `kayfabizarro.pages.dev/skills/kfb-ink-canon.js`.
- **Asset-Repo:** `media/2D_Assets` + `media/3D_Assets` (Tree-API).
- **Session-Skills:** `session-export_v1.md`, `session-cut`, `vault` (skills/).
- **Audio (UI):** `ui-sfx.json` (github).
- **Narrator/Voice (teils):** `frizzlebob-kayfabizarro` (skill).

## Push-Kandidaten (lokal → GitHub, damit das Bundle vollständig kanonisch wird)
Reihenfolge deiner „GitHub > lokal"-Schleife. Beim Push je Datei: `version` hoch, `updated`=heute,
`canonical`-URL setzen, dann im Index die `home`-Spalte auf `on-github` stellen.

1. **CardBuilder + Ink (Doku):** `EMBED_KFB_CardBuilder_Ink_FULL.md` → `skills/`. (Module `kfb-card-format.js` / `kfb-card-builder.js` → Deploy-Pfad + jsdelivr bestätigen.)
2. **Tiny-Swords-Baukasten:** `KFB Baukasten v1/onboarding-tinyswords_2026-08-14/` → `skills/kfb-tiny-swords-baukasten/` (inkl. `ui-kit-ts.js`, `asset-source.js`, `ui-slices.json`, `06_FALLEN` mit 29).
3. **Cartoon-Deformer:** aus `KFB Voxel + … + Cartoon Deformer + Zone Registry v3` → Modul benennen + kanonische URL festlegen.
4. **Sprechblasen:** `HANDOVER_Sprechblasen-System_ausPetStudioV4_fuerWS1.md` → `skills/`.
5. **Voice-Engine:** `KFB_ChatGPT_VoiceEngine_NIE+FrizzleBob.md` → `skills/`.
6. **Audio (Welt/Voice) + Jukebox:** `sfx.json` kanonisch ablegen; Jukebox-Komponente benennen + Pfad festlegen.

## Abnahme (wenn gepusht)
Für jede Fähigkeit im Index: kanonische URL öffnen → **echtes JS/JSON** (nicht die 200-HTML-Fallback-
Seite, F7b) → Fähigkeitstest grün. Erst dann `home = on-github`. Dann ist das Bundle **plug&play
vollständig** und der `KICKOFF` reicht einem fremden LLM ohne Nachreichen.

*Bundle bleibt Index+Primer; sobald alle Push-Kandidaten oben liegen, ist v1 → v1.1 (nur noch Zeiger, keine „lokal"-Heimaten mehr).*
