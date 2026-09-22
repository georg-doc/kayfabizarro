<!-- Kopie von CLAUDE.md, Projektwurzel, 22.09.2026. Umbenannt, weil CLAUDE.md ein reservierter Dateiname ist. -->

# KFB — Projektkontext für neue Chats

Dieses Projekt ist der **Claude-Design-Arm von Kayfabizarro (KFB)**. Georg entscheidet, der
Chat baut und legt vor. Was hier steht, gilt, bis Georg es ändert.

## Die Quelle

Repo `georg-doc/kayfabizarro`, Branch `main`. **Alles** — Modelle, Animationen, Verträge,
Briefings — liegt dort. Der Projektstand gegenüber dem Repo steht in `github.md` (lesen,
bevor etwas gebaut wird; `## Screen map` sagt, welcher Bildschirm aus welchen Repo-Dateien
gebaut wurde).

Stand-Dokumente im Projekt: `github.md` (Repo-Abgleich) · `PROJECT_LOG.md` (Hex-Historie,
FROZEN) · `HOUSEKEEPING.md` (Artefakt-Status).

**Arbeitsweise: `WORKFLOW.md` im Projektwurzelverzeichnis lesen, bevor gebaut wird.**
Live/Stage/Work-Trennung, ein abgegrenzter Slice je Lauf, Ehrlichkeitsformat, und die Regel
gegen Whack-a-Mole.

## Sieben Regeln, die jede Session gelten

1. **Keine Asset-Kopien.** Modelle bleiben GitHub-SourceRefs mit Commit-Pin (raw-URL). Ein
   Export enthält Quellcode und Daten, nie Modelle, Animationsbibliotheken, Fonts, Audio.
2. **Module über jsDelivr, Daten über raw.** raw liefert JS als `text/plain`; als Modul
   geladen ergibt das einen schwarzen Bildschirm.
3. **Messen statt glauben.** Maße, Bone-Zahlen, Clip-Bindungen, Zellkanten werden zur Laufzeit
   gemessen und im UI ausgewiesen. Eine plausibel aussehende Pose ist kein Beweis.
4. **Keine zweite Wahrheit.** FrizzleBob kommt aus `tools/KFB-ToolBox/kfb-rigs-embed-v3/`
   (`mountGraft()`), CapsuleCarl aus `lab-v6/carlrig-mount.v1.js` (`mountCarl()`). Niemals
   eigene Augen, Gesichter, Rigs oder Insel-Zerlegungen nachbauen (EMBED_KFB_RIGS_v3 §0/§7).
5. **Ein Besitzer je Sache.** Ein Renderer, ein Animations-Mixer, ein Bewegungs-Besitzer, ein
   Asset-Registry (das vorhandene unter `registry/assets/v1` — nie ein neues).
6. **Ehrlich berichten.** Nicht Gelaufenes heißt `NOT_TESTED`. Behauptungen werden getrennt
   als `SOURCE | DECISION | IMPLEMENTATION | TESTED RESULT | EXPORT | PUBLIC DEPLOYMENT |
   GEORG ACCEPTANCE | OPEN`. Claude Design pusht nicht nach GitHub — Lieferung ist ein ZIP
   plus Preview, Integration macht der Web Lead.
7. **Hinsehen, nicht nur messen.** Zahlen sagen, ob etwas an der richtigen Stelle steht —
   ob es dort stehen soll, sagt nur ein Entwurf. Vor jeder Szenen- oder Teilekonstruktion ein
   Screenshot in Arbeitsgröße, isoliert, plus Seitenansicht. Stimmt das Bild nicht, wird die
   Grundlage geprüft, nicht das Pixel korrigiert. Zwei FAILs am 19.09.2026 belegen das:
   `KFB_Free_Roam_Platformer_POC_v0/docs/CONNECTORS.md` (Treppe) und
   `KFB_Free_Roam_Platformer_v1/docs/FAIL_ISLANDS.md` (Inselkomposition).
8. **Vorhandenes nicht überschreiben.** Veröffentlichte POCs (z. B. Free Roam Drive
   `fr-s04-01`) bleiben unberührt; Neues kommt als eigener Kandidat daneben.

## Wichtige Pins (gemessen, nicht geraten)

| Zweck | Commit |
|---|---|
| Platformer Game Kit - Dec 2021 · Registry-Shard | `eb48f50489b9e4903ec1e3d2fb1837605ce7d792` |
| Resident-/Mystery-Series-Figuren (Handoff) | `891eadf01e218f5fc21387e64cea1fec8332c5b6` |
| KayKit_Character_Animations_1.1 | `aa16a777a970f23d3f11fb3c23dc40718b04fa88` |
| KayKit Legacy | `10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0` |
| Skeletons-Pack | `main` |

Rig-Familien: `Rig_Medium` (Standard, 23 Bones) · `Rig_Large` (Black Knight, Demon Lord,
Orc Brute) · `Rig_Legacy` (6 Bones, 30 Clips in EINER Datei; die Legacy-FIGUREN sind unrigged
und müssen zusammengesetzt werden — `legacyAssemble()` im Resident Atlas).

`github_get_tree` listet **keine** `.glb`/`.gltf` (Binär/nicht-importierbar). „0 gefunden"
heißt nicht „nicht da": Registry-Shard lesen oder direkt laden.

## Was im Projekt liegt

| Artefakt | Was |
|---|---|
| `KFB_Free_Roam_Platformer_POC_v0/` | **Platformer Hub POC** (18.09.2026) — Chill & Fun + KFB Game Mode auf der KFB Project Island. Export-Kandidat, kein Push. |
| `hexrealm/KFB_Hex_Hub.html` | Projekt-Hub als Hex-Insel, Stationen aus `hub-tiles.json` |
| `hexrealm/KayKit_Hex_Realm_S11.html` | Hex-Realm-Bank |
| `KFB 3D Asset Repo.dc.html` · `registry-packs.json` | Registry-Spiegel, 107 Packs |
| `KFB Mech Combat Slice v10.dc.html` u. a. | ältere Slices, siehe HOUSEKEEPING |

## Free Roam · Platformer Hub POC (laufender Faden)

Brief: `skills/chat/workflows/FREE_ROAM_PLATFORMER_POC_2026-09-18/CLAUDE_DESIGN_BRIEF.md`
@ `a12e3316dd56f2bcda1bf0d7c1b743f40fec849e`.

Kernidee: **zwei Modi auf einer Welt.** Chill & Fun hebt das nächste plausible Ziel hervor und
fliegt einen gerechneten Bogen (Anticipation → Absprung → Bogen → Landung → Recovery); KFB
Game Mode nutzt dieselbe Geometrie ohne garantierte Landung. Plattformen sind gleichzeitig
**Projektportale** (Travel, Free Roam, Stunt Race, Resident Atlas, World Atlas, ToolBox,
Combat Arena, OSM). Das Roster ist manifest-getrieben und lazy — **kein dauerhaftes
4-Figuren-Demo-Roster**; die vier Nachweis-Adapter sind nur der erste Beleg.

Offene Punkte stehen in `KFB_Free_Roam_Platformer_POC_v0/docs/KNOWN_ISSUES.md`.

## Sprache

Doku und Code-Kommentare Deutsch, Spieler-/Nutzer-UI Englisch (so steht es im Brief).
