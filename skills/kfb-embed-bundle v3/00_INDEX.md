# 00 · KFB Embed-Bundle — Index (plug&play, v2.1)

2026-08-22 · 12 Fähigkeiten · **aus `kfb-embed-index.json` generiert** (ein Index, ein Render).

> v2: Tests am echten Export korrigiert (ink 7 Params + measureInk; createCardBuilder). Pfade skills/ statt media/, Doku _v1. Regel 7 (eine Herkunft je Modul-Stack). Prosa aus URL-Feldern raus → status pending-push. Spielkanon ergänzt. Dank an die claude_web-Review 2026-08-20. · v2.1 (2026-08-22): asset-repo.fullDoc→null (letzte Prosa raus, B7-Rest); MANIFEST durchgezogen, sonst hätte der Push B5 (_v1) und B3 (pages.dev-Ink) wieder eingeführt.

## Die 7 Regeln (immer)
- Module via jsdelivr (cdn.jsdelivr.net/gh/…), NIE raw (raw=text/plain → Modul verweigert).
- Bytes (json/glb/png) via pages.dev oder raw. Listen via GitHub-Tree-API (cachen, 60/h).
- Verifizieren per FÄHIGKEIT, nicht per Version im Dateinamen (drawInk.length===7, nicht 'heißt es v2?').
- F7b: HTTP 200 ≠ JavaScript — Cloudflares Fallback liefert text/html; nach Deploy Import-Pfad öffnen, echtes JS erwarten.
- three GENAU 0.160, ein Build. crossOrigin='anonymous'. scale=1 für Pixel-Sprites.
- Keine zweite Wahrheit: lokale Kopie = Cache, kanonische URL gewinnt.
- EINE Herkunft je Modul-Stack: ein Modul, das Geschwister relativ importiert (z.B. kfb-card-builder → kfb-ink-canon + kfb-card-format), MUSS mit ihnen aus derselben Herkunft geladen werden — sonst zwei Instanzen, zwei Zustände (die zweite Wahrheit aus Regel 6).

## Fähigkeiten (Tests am echten Export verifiziert)

| Fähigkeit | Gibt dir | Kanonische Quelle | Fähigkeitstest | Voll-Doku | Status |
|---|---|---|---|---|---|
| **KFB Ink Outline (Kanon-Version 2)** | die KFB-Kartenkante (BAND=Karten, STRICH=Chips); ein fill(), taper, §10 | `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/skills/kfb-ink-canon.js` | `drawInk.length===7 && INK_CANON_VERSION>=2 && typeof measureInk==='function'` | https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/skills/SSOT_Card_Ink_Outline_v2.md | on-github |
| **CardBuilder (three.js-Karte)** | ganze Cut&Play-Karte: Registry→PDF→Crop→Blatt→Silhouette→Ink-Decal→THREE.Group | `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/skills/kfb-card-builder.js` | `typeof createCardBuilder==='function' && CARD_AR===1.74` | https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/skills/EMBED_KFB_CardBuilder_Ink_FULL_v1.md | on-github |
| **Card-Format (Sollformat)** | CARD_AR=1.74, fitCell, coverLoss, CARD_AR_FROM (Anker) | `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/skills/kfb-card-format.js` | `CARD_AR===1.74 && typeof fitCell==='function'` | https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/skills/EMBED_KFB_CardBuilder_Ink_FULL_v1.md | on-github |
| **Cube-Pet (Rig)** | fertiger KFB-Cube-Pet: Augen, Mienen, Viseme-Mund, Bewegung, Puppet-Drive | `https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/kfb-pets.js` | `typeof makePet==='function' && typeof loadPets==='function'` | https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/skills/EMBED_CUBE_PET_FULL_v2.2.md | on-github |
| **Cartoon Motion (Grammatik)** | Bewegungs-Juice: 1/√Sy, Kaskade, Anticipation, Bézier/SLERP, Feder-Dämpfer | `https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/skills/cartoon-motion_v1.md` | `—` | https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/skills/cartoon-motion_v1.md | on-github |
| **Asset-Repo 2D/3D** | TreasureHunters, Pirate_Bomb, Tiny Swords, GLB-Pet-Kits, Texturen, Audio | `https://github.com/georg-doc/kayfabizarro/tree/main/media` | `Tree-API listet den Ordner` | — | on-github |
| **Session-Skills (Housekeeping/Cut/Vault)** | Übergaben + schlanker Export + Dossiers | `https://github.com/georg-doc/kayfabizarro/tree/main/skills` | `—` | https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/skills/session-export_v1.md | on-github |
| **Cartoon Deformer** | Voxel-/Karten-Deformer (Squash/Bend an Geometrie) | `—` | `—` | — | pending-push |
| **Audio / SFX + Jukebox** | Welt/Voice-Manifest getrennt vom UI-Manifest + Jukebox | `—` | `—` | — | pending-push |
| **Tiny Swords Baukasten** | UI-Baukasten (9/3-Slice, Bars) + Sprite/Tile-Laden; 29 Fallen | `—` | `ui-kit misst Slices per Alpha-Scan` | — | pending-push |
| **Narrator / Voice / Chatter** | Erzähler-Stimmen + Chatter: FrizzleBob-Masken, NIE-Werkzeuge | `—` | `—` | — | pending-push |
| **Sprechblasen-System** | Blasen-Grammatik (Luftballon-an-Schnur): KFB-Ink, keine runden Ecken, Pfeil | `—` | `—` | — | pending-push |

## Spielkanon (die Ebene, mit der man kanonkonform ENTWIRFT)
**SSOT:** https://github.com/georg-doc/kayfabizarro/blob/main/Kayfabizarro_Freestyle_Rules_v18-4.md (+ RULES & HUB) — DIESE gewinnen.

- Nichts auf einer Karte ist eine Regel. Eine Power ist ein STICHWORT, kein Wert (K1). KayfaBONGO = Foul, wenn jemand eine Power als Mechanik erzählt.
- Karten sind ROLLENLOS. Jede Karte kann Actor, Scene ODER Quest sein — nicht in der JSON typisieren.
- Quest-Die-Beats + die Urteilsskala des Kings tragen den Zug.
- Die vier Social Calls mit ihren Wirkungen.
- Konflikt ist König; Kayfabe als Ernst, Blödsinn als Methode.
- Lizenz: CC BY-NC-SA 4.0 + Namensnennung.

*Ein LLM kann mit den Technik-Fähigkeiten kanonkonform RENDERN, aber nur mit diesem Block kanonkonform ENTWERFEN.*

## Pending-Push (noch nicht kanonisch — Empfänger NICHT drauf schicken)
- **Cartoon Deformer** — lokal: KFB Voxel + … + Cartoon Deformer + Zone Registry v3.
- **Audio / SFX + Jukebox** — sfx.json UND ui-sfx.json sind am Repo-Root aktuell 404 — noch NICHT kanonisch. Push nötig.
- **Tiny Swords Baukasten** — lokal: KFB Baukasten v1/onboarding-tinyswords → skills/kfb-tiny-swords-baukasten/.
- **Narrator / Voice / Chatter** — KFB_ChatGPT_VoiceEngine…md → skills/.
- **Sprechblasen-System** — HANDOVER_Sprechblasen-System_ausPetStudioV4 → skills/.