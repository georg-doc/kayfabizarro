# 00 · KFB Embed-Bundle — Index (plug&play für externe LLMs)

**v1** · 2026-08-14 · 11 Fähigkeiten · Quelle `kfb-embed-index.json` (JSON = Maschine, dieses MD = Mensch).

Dieses Bundle **indiziert und kommentiert** den KFB-Kanon und **zeigt auf die kanonischen Quellen** — es kopiert die Module nicht (eine lokale Kopie ist Cache, nie Wahrheit).

## Die 6 Regeln (immer)
- Module via jsdelivr (cdn.jsdelivr.net/gh/...), NIE raw (raw=text/plain → Modul verweigert).
- Bytes (json/glb/png) via pages.dev oder raw. Listen via GitHub-Tree-API (cachen, 60/h).
- Verifizieren per FÄHIGKEIT, nicht per Version im Dateinamen (z.B. drawInk.length>=8).
- F7b: HTTP 200 ≠ JavaScript — Cloudflares Fallback liefert text/html; nach Deploy Import-Pfad öffnen, echtes JS erwarten.
- three GENAU 0.160, ein Build. crossOrigin='anonymous' an Canvas-Bildern. scale=1 für Pixel-Sprites.
- Keine zweite Wahrheit: lokale Kopie = Cache/Fallback, kanonische URL gewinnt, darf sie nicht überleben.

## Fähigkeiten

| Fähigkeit | Gibt dir | Kanonische Quelle | Art | Fähigkeitstest | Voll-Doku | Heimat |
|---|---|---|---|---|---|---|
| **KFB Ink Outline (Kanon K5)** | die KFB-Tuschekante für Karten UND Interfaces (BAND-Familie, §10 Licht, ein Strich, taper) | `https://kayfabizarro.pages.dev/skills/kfb-ink-canon.js` | module (pages.dev) | `typeof drawInk==='function' && drawInk.length>=8` | EMBED_KFB_CardBuilder_Ink_FULL.md · 03_INK_OUTLINE_KANON_v2.md (Baukasten) | on-github (Modul) · doc lokal |
| **CardBuilder + Card-Format** | eine ganze KFB-Karte: Registry→PDF→Crop→Blatt→Ink→Decal→THREE.Group; CARD_AR=1.74 | `cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/… (kfb-card-builder.js, kfb-card-format.js)` | module (jsdelivr) | `CARD_AR===1.74 && typeof buildCard==='function'` | EMBED_KFB_CardBuilder_Ink_FULL.md | doc lokal (push-Kandidat) |
| **Cube-Pet (Rig)** | fertiger KFB-Cube-Pet: Kugelaugen, Lider, Mienenspiel, Viseme-Mund, Bewegung, Sprechblase, Puppet-Drive | `cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/kfb-pets.js` | module (jsdelivr) · Vertrag kfb-pets.json via fetch | `typeof makePet==='function' && typeof loadPets==='function'` | EMBED_CUBE_PET_FULL_v2.2.md | on-github (skills/) |
| **Cartoon Motion (Grammatik)** | Bewegungs-Juice: Volumen 1/√Sy, Kaskade Augen→Körper, Anticipation, Bézier/SLERP, Feder-Dämpfer | `https://raw.githubusercontent.com/georg-doc/kayfabizarro/refs/heads/main/skills/cartoon-motion_v1.md` | doc (raw ok — lesen, kein Import) | `—` | cartoon-motion_v1.md | on-github (skills/) |
| **Cartoon Deformer** | Voxel-/Karten-Deformer (Squash/Bend an Geometrie) | `TBD — lokal: KFB Voxel + Assets Worldbuilding + Cartoon Deformer + Zone Registry v3` | module (local) | `—` | (im Ordner v3) | lokal (push-Kandidat) |
| **Asset-Repo 2D/3D** | alle Assets: TreasureHunters, Pirate_Bomb, Tiny Swords, GLB-Pet-Kits, Texturen | `https://github.com/georg-doc/kayfabizarro/tree/main/media` | data (Tree-API = Wahrheit) | `Tree-API listet den Ordner (kein gebackener Katalog)` | 01_ASSETS_UND_URLS.md (Baukasten) · A1_INDEX_tiny-swords-assets.md | on-github |
| **Audio / SFX + Jukebox** | Sound: Welt/Voice-Manifest getrennt vom UI-Manifest; Jukebox-Komponente | `sfx.json (audio-2d.js, Welt/Voice) · ui-sfx.json (hud-v7.js, UI)` | data (zwei Manifeste, by design) | `zwei getrennte Manifeste — nie zusammenlegen` | (KFB UI embed v1.md · WS0_coworker/sfx.json) | ui-sfx.json on-github · sfx.json Kanon · Jukebox lokal |
| **Tiny Swords Baukasten (UI + Tiles)** | UI-Baukasten (9/3-Slice, Bars) + Sprite/Tile-Laden; misst Blätter selbst; 29 Fallen | `lokal: KFB Baukasten v1/onboarding-tinyswords_2026-08-14` | bundle (local) | `ui-kit misst Slices per Alpha-Scan (rastet auf 64)` | 02_UI_BAUKASTEN_TS.md · 06_FALLEN (29) · ui-kit-ts.js · asset-source.js · ui-slices.json | lokal (push-Kandidat) |
| **Narrator / Voice / Chatter** | Erzähler-Stimmen + Chatter: FrizzleBob-Masken, NIE-Werkzeuge, Prompt-Stufen | `narrator-prompts.js · frizzlebob-voice.js + Doc` | module + doc | `—` | KFB_ChatGPT_VoiceEngine_NIE+FrizzleBob.md · frizzlebob-kayfabizarro (skill) | teils on-github (skill) |
| **Sprechblasen-System** | Blasen-Grammatik (Luftballon-an-Schnur): KFB-Ink, keine runden Ecken, getaperter Pfeil, Trägheit | `lokal: HANDOVER_Sprechblasen-System_ausPetStudioV4` | doc (local) | `—` | HANDOVER_Sprechblasen-System_ausPetStudioV4_fuerWS1.md | lokal (push-Kandidat) |
| **Session-Skills (Housekeeping/Cut/Vault)** | Übergaben + schlanker Export + Dossiers | `https://github.com/georg-doc/kayfabizarro/tree/main/skills` | skills | `—` | session-export_v1.md · session-cut · vault | on-github (skills/) |

## Push-Kandidaten (noch nicht kanonisch auf GitHub)
- **KFB Ink Outline (Kanon K5)** — mods (bend/torn) als spätere benannte Styles. Nie 'bent'/'torn' raten.  ·  Heimat: on-github (Modul) · doc lokal
- **CardBuilder + Card-Format** — Text-zuerst, ein PDF-Render zur Zeit, RAW/pages.dev-first→lokaler Fallback→Textkarte.  ·  Heimat: doc lokal (push-Kandidat)
- **Cartoon Deformer** — Modul-Name + kanonische URL beim Push festlegen.  ·  Heimat: lokal (push-Kandidat)
- **Audio / SFX + Jukebox** — Sounds per URL laden, 2-MB-Budget, nie einbetten.  ·  Heimat: ui-sfx.json on-github · sfx.json Kanon · Jukebox lokal
- **Tiny Swords Baukasten (UI + Tiles)** — scale=1 (Originalgröße), nie Vorschaubild dehnen, ein UI-Set nicht mischen.  ·  Heimat: lokal (push-Kandidat)
- **Sprechblasen-System** — DOM/SVG-Overlay, eigener Ink, nicht Card-Feather.  ·  Heimat: lokal (push-Kandidat)