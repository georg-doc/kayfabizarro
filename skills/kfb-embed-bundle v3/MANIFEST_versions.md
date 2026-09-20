# MANIFEST — KFB Embed-Bundle (Versionen & Push)

**Bundle-Version v2.1 · 2026-08-22.** Ziel-Ablage auf GitHub: `skills/kfb-embed-bundle/`.
Prinzip: **Index + Primer + Zeiger**, kein zweiter Modul-Speicher. Wahrheit über Fähigkeiten:
`kfb-embed-index.json`. Korrektur-Historie: `RESPONSE_to-review_v1.md`.

## Was drin ist (5 Dateien)
| Datei | Rolle |
|---|---|
| `kfb-embed-index.json` | **die Quelle** — 12 Fähigkeiten, kanonische URL, strukturierter Fähigkeitstest, Spielkanon |
| `00_INDEX.md` | daraus **generiert** (ein Index, ein Render) |
| `KICKOFF_ext-LLM.md` | paste-ready Primer: 7 Lade-Regeln + Kernstücke + Spielkanon + Ehrlichkeitszeile |
| `MANIFEST_versions.md` | dieses Blatt |
| `RESPONSE_to-review_v1.md` | Antwort auf die claude_web-Review + Befund-Tabelle |

## Schon kanonisch auf GitHub (nur verlinken)
- **Ink-Kanon (Modul):** `cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/skills/kfb-ink-canon.js` — **jsdelivr, nicht pages.dev** (eine Herkunft, Regel 7).
- **CardBuilder + Card-Format:** `skills/kfb-card-builder.js` + `skills/kfb-card-format.js` (via jsdelivr, **derselbe Herkunfts-Stack** wie Ink).
- **CardBuilder-Doku:** `skills/EMBED_KFB_CardBuilder_Ink_FULL_v1.md` (**mit `_v1`**).
- **Ink-Doku (SSOT):** `skills/SSOT_Card_Ink_Outline_v2.md`.
- **Cube-Pet:** `skills/EMBED_CUBE_PET_FULL_v2.2.md` + Modul `media/3D_Assets/kfb-pets.js` (jsdelivr).
- **Cartoon-Motion:** `skills/cartoon-motion_v1.md`.
- **Asset-Repo:** `media/2D_Assets` + `media/3D_Assets` (Tree-API).
- **Session-Skills:** `session-export_v1.md`, `session-cut`, `vault` (skills/).
- **Narrator (teils):** `frizzlebob-kayfabizarro` (skill).

> **Nicht kanonisch (Review B6):** `ui-sfx.json` und `sfx.json` sind am Repo-Root **404** → Push-Kandidat.

## Push-Kandidaten (lokal → GitHub, `GitHub > lokal`-Schleife)
Beim Push je Datei: `version` hoch, `updated`=heute, `canonical`-URL setzen, dann im Index `status: on-github`.
**Herkunfts-Regel (7):** liegt eine Datei, die relativ importiert wird, neben ihren Geschwistern —
alle über **dieselbe** Herkunft ausliefern.

1. **Tiny-Swords-Baukasten:** `KFB Baukasten v1/onboarding-tinyswords_2026-08-14/` → `skills/kfb-tiny-swords-baukasten/` (inkl. `ui-kit-ts.js`, `asset-source.js`, `ui-slices.json`, `06_FALLEN` mit 29).
2. **Cartoon-Deformer:** aus `KFB Voxel + … + Cartoon Deformer + Zone Registry v3` → Modul benennen + kanonische URL.
3. **Sprechblasen:** `HANDOVER_Sprechblasen-System_ausPetStudioV4_fuerWS1.md` → `skills/`.
4. **Voice-Engine:** `KFB_ChatGPT_VoiceEngine_NIE+FrizzleBob.md` → `skills/`.
5. **Audio (Welt/Voice) + UI + Jukebox:** `sfx.json` UND `ui-sfx.json` kanonisch ablegen (beide aktuell 404); Jukebox-Komponente benennen + Pfad.

## Abnahme (wenn gepusht)
Je Fähigkeit: kanonische URL öffnen → **echtes JS/JSON** (nicht die 200-HTML-Fallback-Seite, F7b) →
Fähigkeitstest grün. Erst dann `status: on-github`. Sind alle Kandidaten oben, ist v2.1 → v3 (nur
noch Zeiger, keine `pending-push`-Einträge mehr).
