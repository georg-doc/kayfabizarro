repo: georg-doc/kayfabizarro
branch: main
path: tools/KFB-ToolBox

## Last sync
date: 2026-09-26T03:39:20Z
commit: 8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e (runtime pin, unverändert) · main gelesen @6e41ca0b (Kurz-SHA aus dem Connector) · Spender FrizzleBob_Yellow.gltf @eabc8725 · Mund-Decals 38/38 HTTP 200 geprüft — kein eigener Commit, Schreibweg 403

### Updated in this project
- Rigging › Mouth: Lip-sync über alle 13 Decals aus getipptem Text (`kfb-lib/lipsync-text.v1.js`, DE/EN), »▶ All 13«. Talk bleibt der billige Shuffle.
- Gemalte Teile (partrig): Depth bis −0,6, Height/Spacing/Size weiter. Rig-Mund-Offset darf −0,06.
- Rigging › Eyes: Lid-Schalen des EyeRig (oben runter, unten hoch, Slant, Δ links). Rigging › Hair: FrizzleBobs drei Zacken aus FrizzleBob_Yellow.gltf am Kopfknochen, eigenes Material (`kfb-lib/hair-tufts.v1.js`).
- Blender-Briefing Kapsel-Lider, Klappen, Zacken: `handover/BLENDER_BRIEF_EYELIDS_HAIR.md`. main seit b64d7edc: 15 Commits, nur Inbox/Hub/MVP-Planung, keine Owner-Module geändert.

## Sync history
date: 2026-09-26T02:12:29Z
commit: 8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e (pet-mouth.v1 gelesen) · Studio v18 aus der Projektkopie `_inbox/V18_BIRTHDAY_7_2026-09-16/…/src/` — kein eigener Commit, Schreibweg 403

### Updated in this project
- Augen drehen: `eye.splay` −1…2 (innen · 45° außen · 90° seitlich/Frosch), auf die Kopffläche abgetastet; `eye.inset` als Regler.
- Cube Pets (Hund u. a.) bekommen den sprechenden Mund aus Studio v18 (Talk · 5 Viseme · Sets).
- Mund-Parität v18: Bend, Always on top, Visem→Form-Zuordnung, 5 durchspielen, Default look, Grin/Pout, Ruhe-Mund.

## Sync history
date: 2026-09-26T01:00:05Z
commit: 8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e (Face-Owner facehost.v1 · brow-rig.v2 · pet-nose.v2 · pet-moustache.v1 · eyeoval.v1 · headzones.v1 · partrig.v1 · graft-mount.v1 gelesen) · ear rig 19088b142c6a7e7626f27fba8e80caf6ab2437c1 (FB_TEMPLATE_LOOK_v5.glb vermessen) — kein eigener Commit, Schreibweg 403

### Updated in this project
- **Production-02** mit drittem Reiter **Rigging**: Augen · Brauen · Nase · Mund · Bart mit allen Studio-v18-Reglern, Quelle je Teil (Rig · gemalt · aus), Punkte am Kopf zum Ziehen (gemessene Jacobi-Matrix), Export/Import im Graft-v4-Feldschema. Selbsttest 23/23 PASS.
- Neu `kfb-lib/face-mount.v1.js`: graft-mount.v1 Schritte 3–4 auf facehost.v1 für Figuren ohne Graft (FB Ear Rig v5); gemalte Teile über partrig.v1; Rig-Augen/-Mund beim ersten Laden auf die gemalten Teile gemessen.
- Paritätsinventar Studio v18 → ToolBox: `handover/PARITY_STUDIO_V18_TOOLBOX.md`.

## Sync history
date: 2026-09-25T19:06:00Z
commit: 9d1f25c3a30144e9409e1140db5d7081f89fdc65 (PR #204 architecture head, brief read) · ear rig 19088b142c6a7e7626f27fba8e80caf6ab2437c1 (PR #214) · main b64d7edca3ec0d184d97f1b3a5db0103332e3e54 (S39 band, wd-sky) · runtime pin 8922d4b1 unchanged — kein eigener Commit, Schreibweg 403

### Updated in this project
- Production-01 fortgesetzt (r2): Pose-Owner-Fix einmal in `kfb-lib/pose-rig.v1.js` (Handgelenk-Ketten, öffentliche IK) + Patch für den Repo-Pfad; lokales Nachmessen entfernt.
- KayKit-Locomotion als semantische Profile (`kfb-lib/locomotion-profiles.v1.js`, 14 Rollen gemessen) · Lab › State mit Vorschau · EAR-DANGLE-01 mit `ear-dangle.v1.js` auf FrizzleBob Ear Rig v5 · S39-Band ohne Grundplatte mit wd-sky.
- Studio › Fit (CARD_SURF-Naht), Solver-Gate A/B/C, Owner-Roadmap. Selbsttest 19/19 PASS.
- Session Cut r2: `export/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r2/` (22 Dateien).

## Sync history
date: 2026-09-25T15:40:52Z
commit: 8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e (runtime pin, unverändert) · skills/session_ZIP_v1.md @ main gelesen — kein eigener Commit, Schreibweg 403

### Updated in this project
- Production-01: Header überlappt nicht mehr (schrumpfende Actor/Stage-Knöpfe, kompakte Labels < 1000/900 px), Inspektor ein-/ausblendbar (▥) für Split-Screen, Orbit flüssig (16-ms-Watchdog statt stockendem rAF, Doppelklick = Orbit-Pivot, Pan/Zoom-Grenzen).
- Session-Cut ZIP nach `skills/session_ZIP_v1.md`: `export/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/` (25 Dateien, 617 KB).

## Sync history
date: 2026-09-25T15:20:00Z
commit: 8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e (runtime pin) · branch chatgpt-web/toolbox-source-lock-2026-09-23 (PR #185) gelesen · Motion Library @032c9d50cd5de6764fa37fec65cb203ed35fcb11 — kein eigener Commit, Schreibweg weiterhin 403

### Updated in this project
- **TOOLBOX-PRODUCTION-01** gebaut: `KFB ToolBox Production-01.dc.html` — zwei Hauptbereiche Studio · Animation Lab auf EINER Runtime (Tab-Wechsel ohne Rebuild), Inspektor Body/Face/Pose/Scene, IK-Punkte direkt auf der Bühne über den geteilten Edit-Layer-Anfasser.
- Motion Library 01 (33 Clips, AN-PROFILE-01) direkt eingebunden: Clip-Audition, Scrub mit gemessenen Fußkontakten, Rollen, Root-Motion-Kalibrierung, Kontaktkorrektur per IK → Motion Profile.
- Legacy Character Builder (Warband Orc A/B Teile + Held item) auf Rig_Legacy, Orc Brute als Rig_Large-Fixture. Selbsttest 13/13 PASS.
- Befund: `pose-rig.v1` misst die Unterarmlänge falsch, wenn ein Handgelenk-Knochen dazwischen liegt (Return §Befund).

## Sync history
date: 2026-09-24T16:12:00Z
commit: 8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e (runtime pin for edit-layer + Driver-Graft chain + profile + Resident scene) — kein eigener Commit, Schreibweg weiterhin ungeprüft/403

### Updated in this project
- **TOOLBOX-COHERENT-INTEGRATION-01** gebaut: `KFB ToolBox Stage-First Coherent-01.dc.html` — ein zusammenhängender Ablauf Actor ▾ → FrizzleBob Driver Graft (graft-mount.v1, Georg-Profil 15.09) → Stage ▾ Resident Caveman · Cave Camp → Auswahl → Move/Rotate/freies Scale/Drop auf Stütze → Save → Reload → weiter editieren.
- Keine eigene Editor-/Persistenz-Logik: geteiltes `lib/edit-layer.js` @8922d4b1 direkt importiert; Speicherform = WB2/R2-Szenendokument `kfb-worldbuilder-scene` v1 (Objekt-Records identisch), Key `kfb-toolbox-coherent-01`.
- Eingebauter 12-Schritt-Selbsttest (unter „…") gegen die echten Quellen: 12/12 PASS in der Vorschau; stellt Georgs Speicherstand danach wieder her.
- Architecture-v3-`START_HERE.md` weder auf main noch in Dropbox gefunden → SOURCE_REQUIRED, gearbeitet nach `TOOLBOX_STAGE_FIRST_DEFAULT_V1_2026-09-23`.

## Sync history
date: 2026-09-24T00:07:29Z
commit: dca52479dad9 (kayfabizarro, main tree read) — kein eigener Commit, Schreibweg weiterhin ungeprüft/403

### Updated in this project
- Georgs Vollständigkeits-Anweisung ("bis in die letzte Pfad-Ebene, ALLE VFX, welche fehlen noch?") beantwortet: `media/3D_Assets/FX_Visual/brackeys_vfx_bundle/particles/opague/` hatte 6 komplett fehlende Familien (spark 7, spotlight 8, star 9, trace 7, twirl 4, window 4) und `smoke` war mit 3 statt echten 10 Dateien massiv unterzählt. GitHub's Verzeichnis-Tool cappt Flach-Listungen hart bei 40 Einträgen — Vollständigkeit wurde durch gezielte `regex_filter`-Teilabfragen + lokalem `list_files` erzwungen.
- Alle 6 neuen Familien visuell geprüft (nicht aus Dateinamen vermutet) und als kompakte statische Varianten-Grids ergänzt — jede stellte sich als Varianten-Set heraus, keine Zeit-Frames.
- Ehrliche Restlücke dokumentiert: von 92 gemeldeten Dateien in `opague/` sind 90 namentlich bestätigt; 2 ließen sich trotz mehrfacher gezielter Suche nicht isolieren — im Diagnostics-Feld offen vermerkt, nicht verschwiegen.

## Sync history
date: 2026-09-24T00:01:15Z
commit: dca52479dad9 (kayfabizarro, main tree read) — kein eigener Commit, Schreibweg weiterhin ungeprüft/403

### Updated in this project
- Georgs Einwand behoben: `explosions_smoke` war unvollständig (nur 3 von 14 Effekten gezeigt). Jetzt alle 11 fehlenden `.gif` nachgezogen und ergänzt — komplette 14/14 Familie animiert: collision + 3 Spark-Farben, 5 Explosion-Varianten, 2 Whitehot-Größen, fireimpact, impact_verticalring, teleport.

## Sync history
date: 2026-09-23T23:16:00Z
commit: dca52479dad9 (kayfabizarro, main tree read) — kein eigener Commit, Schreibweg weiterhin ungeprüft/403

### Updated in this project
- flame-Split korrigiert: visuell verglichen (alle 6 Frames einzeln angesehen) — flame_04 gehört zur runden Blob-Silhouette (01–04), nicht zur schlanken Flammenzunge (05–06). Split ist 4+2, nicht 3+3 wie zuerst angenommen.

## Sync history
date: 2026-09-23T23:14:00Z
commit: dca52479dad9 (kayfabizarro, main tree read) — kein eigener Commit, Schreibweg weiterhin ungeprüft/403

### Updated in this project
- Georgs Semantik-Korrekturen zu Brackeys übernommen: `flame` sind 2 getrennte 3-Frame-Loops (01–03 / 04–06) statt ein 6er; `slash` sind 4 gerichtete Strike-Varianten, jetzt nebeneinander statt als Animation; `muzzle` bleibt als 5er-Zyklus = Dauerfeuer, zusätzlich `muzzle_03` einzeln als Einzelschuss-Kandidat für Player/FrizzleBob-Waffen; `smoke`/`dirt` liefen falsch als Zeit-Frames — jetzt nebeneinander als Varianten gezeigt. Diagnostics vermerkt offen: `fire/effect/scorch/light/magic/circle` tragen dieselbe ungeklärte Frage (Varianten vs. echte Animationsframes), noch nicht bestätigt.

## Sync history
date: 2026-09-23T23:10:28Z
commit: dca52479dad9 (kayfabizarro, main tree read) — kein eigener Commit, Schreibweg weiterhin ungeprüft/403

### Updated in this project
- Georgs Anweisung "ALLE Brackeys VFX Bundle animiert zeigen, bis in den letzten Pfadtiefen" umgesetzt: alle 13 benannten Effekt-Familien aus `particles/opague/` jetzt einzeln als eigene Mini-Flipbooks im Brackeys-Donor (muzzle, slash, flame, fire, smoke, dirt, scorch, light, effect, magic, circle animiert über ihre echten Nummern-Varianten; flare/scratch als Einzeldatei statisch, da nichts zu zyklen ist). 36 zusätzliche reale PNGs gezielt aus `georg-doc/kayfabizarro` nachgezogen.

## Sync history
date: 2026-09-23T23:05:00Z
commit: dca52479dad9 (kayfabizarro, main tree read) — kein eigener Commit, Schreibweg weiterhin ungeprüft/403

### Updated in this project
- Georgs Inline-Kommentar aufgenommen: die "VFX + KEYS + ASSETS - kfb-asset-handoff-animation-lab (9).json" komplett gelesen (nicht nur den abgeschnittenen Anfang) — enthält den `fx-visual`-packId-Abschnitt, der `particles/opague`+`particles/alpha` im Brackeys-Bundle einzeln benennt: genau die von Georg erinnerten Mündungsfeuer-Masken (`muzzle_01`–`05`, opak + separate Alpha-Maske), plus Melee-`slash_01`–`04`, `flame_*`, `scorch_*`, `smoke_*`, `magic_*` u.a. Fünf reale `muzzle_0X.png` nachgezogen, als eigene Mini-Flipbook-Kachel im Brackeys-Donor ergänzt.
- Tiny Swords Particle FX korrigiert: statt einem 8-Frame-Mischmasch jetzt 3 getrennte Typ-Zyklen (Dust 01→02, Explosion 01→02, Fire 01→02→03) in Dateireihenfolge + Water Splash einzeln/statisch — Georgs Punkt: das sind unterschiedlich angelegte Einzeltypen, kein gemeinsamer Frame-Satz.
- FreeHitVfx (Godot): statt der reinen statischen Textur jetzt eine echte CSS-Burst-Animation (Pop → Weißglut → Farbe/Dissolve) auf der realen Textur, die exakt die in `kfb-fx-sprites.js` portierte Kurve nachstellt — beantwortet Georgs Frage direkt: es ist eine einzelne statische Textur, deren Bewegung aus einem Shader kommt, nicht aus einer Frame-Sequenz.

## Sync history
date: 2026-09-23T22:58:45Z
commit: dca52479dad9 (kayfabizarro, main tree read) — kein eigener Commit, Schreibweg weiterhin ungeprüft/403

### Updated in this project
- **Root Cause gefunden und behoben**: `ref`-Attribute auf einem rohen `<canvas>` werden von diesem DC-Template-System NICHT durchgereicht (weder `React.createRef()` noch Callback-Ref) — Fix: literales `id`-Attribut + `document.getElementById()`-Lookup, ausgelöst direkt aus dem Klick-Handler. Zweiter Fund: `requestAnimationFrame` feuert in diesem Preview-Sandbox-Kontext nicht zuverlässig — auf `setTimeout(fn,0)` umgestellt. Ink-Atlas-Canvas zeichnet jetzt nachweislich (Pixel-Readback 384×288, echte Inhalte statt Default 300×150).
- Tiny Swords · Particle FX: alle 8 echten Dateien (statt 4) geholt, zeigt jetzt eine echte Cycling-Reel-Animation aller 8 Varianten (ehrlich beschriftet als "8 Varianten", nicht als ein Effekt mit 8 Frames).
- FreeHitVfx-Kartentext präzisiert auf Georgs Frage: es ist EINE statische Godot-Textur, Bewegung kommt aus einem Shader (bereits nach `kfb-fx-sprites.js` portiert) — deshalb semantisch stark für Melee/Hit-Zonen, nicht animierbar als Frame-Sequenz.

## Sync history
date: 2026-09-23T22:50:02Z
commit: dca52479dad9 (kayfabizarro, main tree read) — kein eigener Commit, Schreibweg weiterhin ungeprüft/403

### Updated in this project
- Alle Bild-Familien im Review animiert statt statisch (Georgs Wunsch "alles animiert zeigen"): Brackeys-Sheets laufen als echte CSS-Sprite-Animation über die reale 6×5-Textur (Reihe 1, 6 Frames); Kenney Smoke Particles und Free Cartoon Smoke laufen als reine CSS-Stack-Flipbooks über je 5 real gesampelte, echte Frames pro Unter-Effekt/Familie (kein JS-Timer, keine `src`-Holes — reines `@keyframes`/`animation-delay`, da `src` in diesem DC-System keine Holes auflöst).
- Dafür 20 zusätzliche Kenney-Frames + 25 zusätzliche Free-Cartoon-Smoke-Frames gezielt aus `georg-doc/kayfabizarro` nachgezogen (echte Dateinamen, keine Rekonstruktion).

## Sync history
date: 2026-09-23T22:44:43Z
commit: dca52479dad9 (kayfabizarro, main tree read) — kein eigener Commit, Schreibweg weiterhin ungeprüft/403

### Updated in this project
- `kenney_smoke-particles`: PNG/-Unterordner bis zum Ende verfolgt (77 Dateien real enumeriert: Black smoke 00–24, Explosion 00–08, Fart 00–08, Flash 00–08, White puff 00–24) statt "nicht enumeriert" — je 1 echtes Frame pro Unter-Effekt jetzt im Review.
- `explosions_smoke`: Kacheln zeigen jetzt die echten animierten `.gif` (explosionbig/whitehotbig/teleport) statt der statischen `.png`-Vorschau.

## Sync history
date: 2026-09-23T22:42:47Z
commit: dca52479dad9 (kayfabizarro, main tree read) — kein eigener Commit, Schreibweg weiterhin ungeprüft/403

### Updated in this project
- Zwei Donor-Familien nachgezogen, die Georg auf GitHub sah und im Review vermisste: `media/3D_Assets/FX_Visual/explosions_smoke/` (29 Dateien, gepaarte GIF+PNG-Bursts/Teleport, **kein Lizenz-File beiliegend → SOURCE_REQUIRED für Provenienz**) und `media/3D_Assets/FX_Visual/kenney_smoke-particles/` (CC0 Kenney, 77 Frames in 5 Unterordnern, hier nur die 2 Overview-Sheets gezeigt). Beide vorher nur im "spotted, not inspected"-Fußnoten-Block, jetzt volle Family-Cards mit echten Bildern.

## Sync history
date: 2026-09-23T22:38:28Z
commit: dca52479dad9 (kayfabizarro, main tree read) · f6a59ad15b9f (KFB-Combat-Arena, main tree read) — kein eigener Commit, Schreibweg weiterhin ungeprüft/403 in diesem Projekt

### Updated in this project
- **VFX-01 · Donor Census + Interactive VFX Review Bank** gebaut: `KFB_VFX_01_REVIEW.dc.html` (Projektwurzel). Kein neuer globaler VFX-Engine-Baustein — reine Bestandsaufnahme + interaktive Review-Bank über bestehende Donor-Systeme, ohne Gameplay-Abhängigkeit.
- Sechs Donor-Familien real inspiziert und mit echten Texturen/Frames gezeigt: Brackeys VFX Bundle (CC0, predrawn-Flipbooks), FreeHitVfx (Godot-SOP, bereits von `kfb-fx-sprites.js` als Shader-Vorlage portiert), free-cartoon-smoke-effects-asset-pack (2D, 5 Familien/56 Frames), Tiny Swords Particle FX (CC0 Pixel Frog), das echte gemeinsame Combat-FX/SFX-Modul (`KFB-Combat-Arena/modules/kfb-vfx-recipes.js` v1.0.0 + `kfb-combat-atlas.js` v2.2.0 + `kfb-fx-sprites.js` — Ink-Atlas live im Review aus dem echten Quellcode nachgezeichnet), und die Boxel-Blitz-Audio-Feedback-POC.
- 16 echte Bild-Assets gezielt aus `georg-doc/kayfabizarro` in dieses Projekt kopiert (kein Bulk-Copy), exakte Pfade siehe Screen-Map.
- `SOURCE_REQUIRED` markiert statt rekonstruiert: `skills/chat/workflows/KFB_HYBRID_PRODUCTION_HANDOFF_2026-09-23/VFX_SFX_CONSOLIDATION_01.md`, `REVIEW_SCENE_BASE_V1.md` (beide auf `main` nicht gefunden), ein eigenständiges „KFB VFX v10.1"-Modul/Design-Doc (nur Versions-Spurenelemente „v10/v11" in Code-Kommentaren), sowie vier von `kfb-vfx-recipes.js` selbst zitierte Design-Docs (VFX_Guide_NO_KFB_DRIFT_v1.md, VFX_Basics+Repos+SOP_v1.md, PLAN_vfx-werkbank-v13.md, KFB_COMBAT_FX_MENTAL_MODELS) — repo-weite Suche, 0 Treffer.
- Human Gate offen (an Georg): welche Donor-Familien fühlen sich KFB an, welche raus, welche ersten 3–5 gemeinsamen Recipes (aus `kfb-vfx-recipes.js`: 5 Muzzle-Klassen, 4 Travel-Formen, Cascade) sollen befördert werden. SFX-Implementierung ist der nächste Slice.

## Sync history
date: 2026-09-23T05:17:14Z
commit: eabc87255ee3da6283f9d438390454d70e9d2e55 (unverändert; kein eigener Commit — Schreibweg weiterhin 403)

### Updated in this project
- **Round-1 Stage-First Shell gebaut**: `KFB ToolBox Stage-First Round1.dc.html` (Projektwurzel). Vorlage = `KFB ToolBox Stage-First Concept.dc.html` (Chrome/Farben/Layout 1a), kein neuer UI-Entwurf. Vier Flows echt verdrahtet: Actor ▾ (echte 24er-Roster-Liste aus `pet-library.v6.js#SETS.animals.chars`) → Face-Palette liest/schreibt EyeRig v6 (Pupil-Style + Base-Color, live auf der Bühne) → Move/Rotate-Toolbar hängt drei.js `TransformControls` direkt an `ch.group` (S21-artige In-Place-Edit) → Save/Load persistiert `{actorId, eye, transform}` pro Actor in `localStorage`.
- Owner-Module NICHT neu gebaut, nur importiert (Kopie 1:1 aus `stage-first/src/petstudio-v9/`): `kfb-lib/pet-library.v6.js` (Character/SETS.animals), `kfb-lib/pet-eye-rig.v6.js` (EyeRig v6). GLBs laden weiterhin über die kanonische raw-URL aus `pet-library.v6.js#PET_BASE`. three r160 über `unpkg`-Importmap (gleiches Pinning-Muster wie `stage-first/src/KFB ToolBox Stage-First v1.dc.html`).
- Bewusst NICHT angefasst (Prohibited-Liste Brief `CLAUDE_DESIGN_BRIEF.md`): kein neues EyeRig, kein neuer Motion-Owner, keine neue Resource Registry, kein zweiter Szeneneditor, keine Extra-Nav-Zeile, kein Cloudflare/WorldBuilder. Motion/Voice/Messen-Tabs bleiben sichtbar, aber inert ("Round 2") — keine Fake-Funktionalität vorgetäuscht.
- Offen (Round 2, laut Brief-Priorität): Material-Zonen im Body-Tab, Legacy-17-Profile-Review, Voice/Messen, neutrales Stage-Preset, Vehicle/Weapon-Fixtures.

## Sync history
date: 2026-09-23T03:20:00Z
commit: eabc87255ee3da6283f9d438390454d70e9d2e55 (unverändert seit 18.09.; kein eigener Commit — Schreibweg weiterhin 403)

### Updated in this project
- **Freigabe 23.09. (Georg): YES.** `stage-first/src/petstudio-v9/assets/models/FrizzleBob_Yellow.gltf` (608 KB, toter Löschkandidat seit dem Asset-Schluß) gelöscht. `headgraft.v1.js`/`ears.v2.js` liefen bereits vor der Löschung ausschließlich über `FB_URL` (gepinnt, Blob e0a757ec…) — keine Codeänderung nötig.
- Bug behoben (Georg 23.09., am Prüfstand gemessen): die Cube-Pet-Zustandsknöpfe (Focus/Select/Rest/Dance) im Casting-Prüfstand riefen `setState()`, das für den Hihi-Slot sofort zurückkehrte, ohne je `Character.play()` zu rufen — nur der Auto-Idle beim Laden lief. Fix: Hihi bekommt eine eigene Abbildung auf die Trigger-API aus `pet-library.v6.js` (`play('idle'|'react-positive'|'celebrate')`), keine neue Animation, derselbe Vertrag.
- **Casting-Prüfstand auf `main` verlegt**: `stage-first/qa/casting-probe.html` (Nachfolger von `_handover/BIRTHDAY_STARTSCREEN_2026-09-15/qa/casting-probe.html`, das FROZEN/ARCHIVED bleibt). Quelle jetzt der promovierte Baum `stage-first/src/` statt des alten WS0-Quellstands.
- **Neuer Actor: KayKit Car · Driver** (`KayKit_Mystery_Series6/2 - August 2023 - Driver/assets/gltf/car.glb`, Pin `fd52a9c4`). Vehicle-EyeRig CANDIDATE (eigenständig, nicht `pet-eye-rig.v6.js` — das ist an die Character-Klasse gebunden): Iris/Sklera + ein aus der erkannten Karosseriefarbe abgedunkelter Lidring (×0.72, derselbe Faktor wie `pet-eye-rig.v6.js#_lidColor`), montiert auf den zwei symmetrischsten hellen Linsen im vorderen Drittel der Bounding-Box (Namenserkennung `headlight|scheinwerfer` zuerst, Heuristik als Rückfall). Eingebettete Vehicle-Clips aus `car.glb` laufen über eine eigene Knopfleiste, zusätzlich zu — nicht statt — den Charakter-Zuständen.

## Sync history
date: 2026-09-18T00:12:00Z
commit: eabc87255ee3da6283f9d438390454d70e9d2e55 (Upload-Commit des Exportpakets `_inbox/KFB ToolBox v1-1.zip` laut Intake-Brief; an diesem Commit die drei Assets gelesen und die Laufzeit-URLs darauf gepinnt. Kein eigener Commit — Schreibweg weiterhin 403)

### Updated in this project
- Intake-Brief `_handover/STAGE_FIRST_V1_INTAKE_2026-09-18/START_HERE.md` gelesen und umgesetzt: die zwei veralteten Export-Behauptungen berichtigt. `FrizzleBob_Yellow.gltf` existiert im Owner-Repo (`tools/KFB-ToolBox/kfb-rigs-embed-v3/petstudio-v9/assets/models/`, Blob e0a757ec…) — meine Suche lief über einen Filter, der den Treffer verdeckte; `FB_URL` in `headgraft.v1.js` und `ears.v2.js` zeigt jetzt dorthin. `kfb-pinball-sfx.json` (Blob 5f7b52e2666a…) wird über die gepinnte GitHub-Quelle geladen, nicht rekonstruiert.
- 34 `@font-face`-URLs (Stage-First v1 + Studio v18) von `main` auf den festen Commit gepinnt. Im Browser geprüft: Boot ohne Fehler, `eyePolicy.ok`, Fonteys PRO geladen, Graft-Driver und FrizzleBob (18 Clips) ohne `loadErr`.
- Vollexport gebaut und übergeben: `_handover/EXPORT_STAGE_FIRST_V1_2026-09-17/` (132 Dateien, 4,32 MB, 15 Pflichtdokumente, echte SHA-256). Entfernt auf Freigabe: Studio v17, `ears.v1.js`, Doc-Reconciliation. Nicht entfernt trotz Vorschlag: `inkform.v1.js` (wird importiert).
- Augenquellen-Regel §4 geschlossen: `SETS.animals.mods` ohne googly, Wächter im Quellbaum (`studio-v3/eye-source-guard.v1.js`), Halt in allen vier Ladewegen, vier Bewohner im Studio belegt (`qa/19–22-studio-*.jpg`).
- **Birthday = FAIL / OUTDATED / ARCHIVED HISTORY** (Georg, 18.09.): Stempel als `_handover/BIRTHDAY_STARTSCREEN_2026-09-15/ARCHIVED_HISTORY.md`. Aktiv bleibt allein die Augenquellen-Regel.
- Für den frischen Chat: `_handover/STAGE_FIRST_V1_PROMOTION_2026-09-18/{ONBOARDING_FRESH_CHAT.md, SPRINT_01_PROMOTION.md, PROMOTION_MANIFEST.json}`.

## Sync history
date: 2026-09-16T01:22:00Z
commit: 79c5799afd185693f245755f19de2abb44d42452 (Upload-Commit des Pins `(7).zip` laut _inbox/README.md; Tree beim Lesen c495206ba150 — kein eigener Commit, Schreibweg weiterhin 403)

### Updated in this project
- Briefing »v18 Promotion + Stage-First Integration« ausgeführt bis Stop-Bedingung P0: neue Arbeitslinie `tools/KFB-ToolBox/stage-first/` = WS0-Quellbaum + drei v18-Module + Stage-First-Blatt `src/KFB ToolBox Stage-First v1.dc.html` (Studio-v18-Logik, neue Shell: eine Kopfzeile · Bühne · eine Palette · Actor-Popover Browse→Preview→Accept/Revert).
- `(7).zip` vom Rohpfad geholt (4 994 864 B, sha256 06bc8afe…), entpackt nach `_inbox/V18_BIRTHDAY_7_2026-09-16/`; WS0↔v18 gemessen: 80 gleich, 3 neue Module, v17-Blatt +2 KB (Befund). Stage First v3 aus Georgs lokalem Ordner nach `_inbox/STAGE_FIRST_V3_2026-09-16/`.
- Prüfstand `stage-first/qa/Stage-First QA.dc.html`: 13/13 PASS (GothGirl/Hihi-Profile, Face-Regler, Simulation-Pflicht, 27/27 Bindungen, Roundtrips ohne Verlust an Autorenfeldern, Hihi-Export count 1, ein Mixer, keine Material-Kontamination, Sitzung nach dem Lauf byte-gleich). Verifier-Befund behoben: Prüf-Entwürfe aus dem ersten Lauf entfernt, Prüfstand sichert/restauriert localStorage. Return: `stage-first/RETURN_STAGE_FIRST_P0_2026-09-16.md` · GEORG ACCEPTANCE PENDING.
- GEORG ACCEPTANCE 16.09.: ACCEPTED FOR WORKING BASELINE. QA zusätzlich 13/13 gegen die Repo-Eingangsprofile `_inbox/KFB Elisa B-Day Reference+Mockups/kfb-pet-{gothgirl,hihi}.json` (nicht byte-gleich mit den (7).zip-Profilen — Return §10). Push weiterhin 403 (`git/trees`) → Checkpoint-ZIP + `stage-first/PUSH.md` + `DOC_RECONCILIATION_PROPOSAL.md`; Commit-SHA offen.

## Sync history
date: 2026-09-15T14:40:00Z

- UI-Reset gelesen: `_handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/START_HERE.md` @ main. Shell v2 (`UI_CRITIQUE_REWORK_WS0_2026-09-15/design/`) gilt als abgelehnter Prototyp / Anti-Pattern, nicht weiterentwickelt.
- Konzept-Lieferung §20 gebaut: `_handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/design/KFB ToolBox Stage-First Concept.dc.html` — 1a 1440×900 (Body), 1b 832×1000 (Motion, Drawer), 1c Interaktionskarte (Actor · Body/Material · Motion · Voice/Talk/Bubble · Export). Keine Implementierung; wartet auf Georgs Freigabe.
- Handover-Paket geschnürt: `RETURN_CONCEPT.md`, `screenshots/1a·1b·1c`, `rejected_v2/` (Shell-v2-Bilder als abgelehnter Stand). Kopie der Konzeptdatei am Projektwurzel (`KFB ToolBox Stage-First Concept.dc.html`) für die Dateiauswahl. Push weiterhin nicht möglich (nur Leserechte) → ZIP.

date: 2026-09-15T06:55:00Z
commit: b15931f4803938d6ebe1bbd33fd25f2eec071a0d (main HEAD beim Lesen; kein eigener Commit — Schreibweg weiterhin 403)
- Birthday-Consumer-Handoff (Board P0.1) ausgeführt: `_handover/BIRTHDAY_STARTSCREEN_2026-09-15/RETURN_BIRTHDAY_CONSUMER.md`. Casting am echten Rig gemessen (`qa/casting-probe.html`, three r160, Quellstand relativ): FrizzleBob über `mountGraft` (Fixture v1.2.9 + Georgs Profil 15.09.) und GothGirl.glb (23 Knochen) — Idle_A · Waving · Cheering · Rest je 69/69 Tracks; Dance P1 (kein Tanzclip, Kandidat `Skeletons_Taunt_Longer`); Hihi = Slot auf `kfb.pet-library/1` pet `cat`; EyeRig Speaker P1 (Prop `GothGirl_Speaker.gltf`).
- Repo-Stand gelesen: Georg hat den WS0-Jobordner-Kern (5 Dokumente, LIES_MICH, B-Pilot) und `_inbox/KFB ToolBox.zip` (d3c16e3a) nach `main` gebracht; `FIELD_COVERAGE.md` dort bytegleich (Blob 52519a1b46e2). `qa-wsa/`, `PUSH.md`, `original/`, entpackter A-Baum nur im ZIP.
- Befund: Georgs Studio-Export 15.09. ohne `anim`-Block (Fixture hat ihn) → Rundlauf-Zeile, Owner WS0. Georgs Notizen (Surf-Sektion, Rotation nicht rücksetzbar, flatternde Surf-Karte) im Return §5.
- Startseite: nur Nav-Link »Birthday-Casting«. Ergebnis B unangetastet.
- Git-Sicherung erneut verweigert (`POST /git/refs` 403). Weg in `_handover/BIRTHDAY_STARTSCREEN_2026-09-15/PUSH.md`; Ordner als ZIP zum Download gestellt.

## Sync history
date: 2026-09-15T03:34:00Z
tree: a3adb84692fd (tools/KFB-ToolBox, vom Connector aufgelöst — Tree-Hash, kein Commit)
- WS0-Quelllieferung aufgenommen, 101/101 Prüfsummen, 7/7 Kaltstarts, FIELD_COVERAGE (48 Zeilen), Startseite auf Quellstand, Git-Sicherung 403 (PUSH.md).

### Updated in this project
- WS0-Quelllieferung aufgenommen: `_inbox/KFB FrankenStein ToolBox (WS0).zip` (1 846 232 B, sha256 948d1950…3c5b) über den Repo-Rohpfad geholt, unverändert unter `_inbox/WS0_2026-09-15/original/` gesichert, nach `unpacked/` entpackt (113 Einträge mit sha256 je Datei).
- Unabhängig nachgerechnet: 101/101 Paket-Prüfsummen PASS · Modulschluß 87 Dateien / 7 Einstiege / 0 unauflösbare lokale Modulreferenzen · 30 von 31 Embed-Dateien bytegleich zum Pin (einzige Abweichung = v3.1-Datei carlrig-mount.v1.js) · 6/6 Blattfeldzahlen reproduziert.
- Kaltstart 7/7 Blätter aus dem frisch entpackten Ordner über HTTP; die vier von WS0 als NICHT GEPRÜFT geführten Blätter sind jetzt geprüft. Belege in `_inbox/WS0_2026-09-15/qa-wsa/`.
- Status T1_PARTIAL_BLOCKED_SOURCE_EXPORT → T1_SOURCE_CLOSURE_DELIVERED. Kein Mischbaum, keine Kopie nach site/, Ergebnis B unangetastet.
- Feldabdeckung nachgeliefert: `_inbox/WS0_2026-09-15/FIELD_COVERAGE.md`, 48 Zeilen positiv über beide Leser. Die zwei bekannten Unterschiede eingeordnet: 24/0 gegen 25/1 Pets = Dateistand plus Sitzungsentwurf; eye.dy 0,308 ist der **gespeicherte** Vertragswert und wird angewandt, 0,312 ist der Sitzungsentwurf. Drei neue Befunde (Berichtslücke in mountGraft, ungefilterter Mund-Spread, Bart-Feldname form/style) — keiner ein Source- oder Contract-Blocker.
- Startseite `site/KFB ToolBox.dc.html` + `index.html` auf den Quellstand-Startweg umgestellt: sieben Kacheln mit Kaltstartbefund und Modulschluß-Zahl, Abschnitt »Herkunft und Prüfungen«, Bundles vom 13.09. als abgelöste Ausgaben weiterhin sichtbar und verlinkt. Ersetzte Fassung unter `_archive/site-v1_2026-09-14/`.
- **Git-Sicherung des Jobordners NICHT ausgeführt — Ursache jetzt gemessen.** Der Schreibweg ist vorhanden, die App-Installation auf diesem Repo lehnt ihn ab: `POST /git/refs`, `POST /git/trees` und `PUT /contents/…` antworten alle `403 Resource not accessible by integration`. Fehlendes Recht ist `Contents: Read and write`; Leserechte bestehen. Zwei Wege in `_inbox/WS0_2026-09-15/PUSH.md`: Recht nachziehen (dann läuft der Push von hier) oder von Georgs Rechner pushen (braucht nichts von hier). Dort neu: Prüftabelle mit Git-Blob-SHA1 und Bytes je Jobdokument, plus `qa-wsa/QA_EVIDENCE.md`, das die sieben Kaltstart-PNG über sha256 pinnt (der Schreibweg überträgt nur Text). Nach dem Commit nachzutragen: `archive.commit`, `commit:` hier, `site.workBranch`.

## Sync history
date: 2026-09-14T16:52:04Z
- Review-Eingang 2 (KFB Rig Embed v3) gesichert; R1 (PartRig-Call-Contract-Mismatch) am Commit f6e1a57d2580 unabhängig im Quelltext nachgelesen und bestätigt, zwei Ergänzungen dokumentiert.
- Donor-Paket tools/KFB-ToolBox/kfb-rigs-embed-v3/ (30 Module, 2 Contracts) gegen docs/MISSING_MODULES.md abgeglichen: 4 der 9 zuvor nicht auffindbaren Dateien lokalisiert. docs/EMBED_V3_COVERAGE.json neu.
- Kein Mischbaum, kein Statuswechsel.

date: 2026-09-13T22:45:55Z
commit: 6ea5d439382ff1f4fce2c56161c523dbcf2a4e2c
- ToolBox-Onboarding gelesen, Handover TOOLBOX_V1_2026-09-14 ausgeführt soweit ohne Git-Zugriff möglich.
- Drei Standalone-Bundles + 6 Config-JSONs nach site/ übernommen, byte-identisch zu den Pins geprüft.
- Kaltstart-Befund: alle drei Tools FAIL wegen fehlender Module (docs/MISSING_MODULES.md).
- Site-Einstieg, RETURN.md, CHANGELOG, FONT_INVENTORY, MANIFEST, Claude-Code-Handoff angelegt.

## Screen map
| Screen | Repo files |
|---|---|
| KFB ToolBox Production-02.dc.html (Projektwurzel) | = Production-01 r2 + Reiter Rigging · kfb-lib/face-mount.v1.js (Reihenfolge aus frizzlegraft-v1/graft-mount.v1.js Schritte 3–4) · Owner @8922d4b1: frizzlegraft-v1/{facehost,eyeoval,headzones}.v1.js, petstudio-v9/studio-v12/{pet-eye-rig.v6,brow-rig.v2,pet-nose.v2,pet-moustache.v1}.js, studio-v3/pet-mouth.v1.js, lab-v6/partrig.v1.js · Figur ear-rig/glb/FB_TEMPLATE_LOOK_v5.glb @19088b14 · Regler-Labels/-Spannen: stage-first/src/KFB FrankenStein Studio v18.dc.html (V2CFG.gesicht, _browRows, _noseRows, _moustRows) |
| KFB ToolBox Production-01.dc.html (Projektwurzel) | r2: Pose owner fix kfb-lib/pose-rig.v1.js ← petstudio-v9/studio-v13/pose-rig.v1.js @8922d4b1 · kfb-lib/locomotion-profiles.v1.js on KayKit_Character_Animations_1.1 Rig_Medium General/MovementBasic/MovementAdvanced @b97b5ac5 · tools/KFB-ToolBox/ear-rig/{ear-dangle.v1.js,rigs/fb-default.ear-rig.json,glb/FB_TEMPLATE_LOOK_v5.glb} @19088b14 · _inbox/KFB Resident Atlas v3/S39-band-module-01/{lib/band-module.js,data/resident-band-module-01.json} + WORLD_INTEGRATION_01 cut wd-sky.js @b64d7edc · r1 sources: Shell: KFB ToolBox Stage-First Coherent-01.dc.html · Owner @8922d4b1: lib/edit-layer.js, frizzlegraft-v1/graft-mount.v1.js (+Kette), petstudio-v9/studio-v13/pose-rig.v1.js, studio-v3/pet-mouth.v1.js, studio-v12/pet-eye-rig.v6.js · Motion: media/3D_Assets/Animations/KFB_Motion_Library/{catalog,profile-catalog.v1,motion-profile-reader.v1,*.glb} @032c9d50 (Pins wie stage-first/src/lab/motion-library.v1.js @PR #185) · Stock: KayKit_Character_Animations_1.1/.../Rig_Large_MovementBasic.glb @b97b5ac5 · Legacy: KayKit Legacy/{Orc Warband - legacy/characters+props, Character Animations 1.2/KayKit_AnimatedCharacter_v1.2.glb} @10a7fdce (Assembly-Regel aus KFB-Travel-Globe TMB1E Capacity Review @603f2a9e) · Brute: KayKit_Mystery_Series6/2 - August 2025 - Orc Brute @891eadf0 |
| KFB ToolBox Stage-First Coherent-01.dc.html (Projektwurzel) | Shell: KFB ToolBox Stage-First Round1.dc.html · Editor: tools/KFB-ToolBox/lib/edit-layer.js @8922d4b1 · Graft: tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js (+ Kette) @8922d4b1 · Profil: _handover/BIRTHDAY_STARTSCREEN_2026-09-15/profiles/kfb-pet-graft-driver.georg-2026-09-15.json @8922d4b1 · Szene: tools/resident_atlas/scenes/{index,caveman-cave-camp}.json @8922d4b1 (Assets @891eadf0, Pose @aa16a777) · Persistenz-Form: worldbuilder/wb2-terrain-sculpt-01/WB2_TERRAIN_SCULPT_01_SOURCE.html @8922d4b1 · Cube Pets: kfb-lib/pet-library.v6.js (Blob 8a13b171) |
| KFB_VFX_01_REVIEW.dc.html (Projektwurzel) | Donor census: `media/3D_Assets/FX_Visual/{brackeys_vfx_bundle/predrawn,FreeHitVfx}` · `media/2D_Assets/free-cartoon-smoke-effects-asset-pack/**` · `media/2D_Assets/Tiny Swords (Free Pack)/Particle FX/**` · `KFB Boxel Blitz/{audio-feedback-poc,captures}` (alle @ kayfabizarro main) · `KFB-Combat-Arena/modules/{kfb-vfx-recipes.js,kfb-combat-atlas.js,kfb-fx-sprites.js}` @ f6a59ad15b9f (Ink-Atlas-Canvas im Review ist eine direkte Portierung von `kfb-combat-atlas.js`'s Zeichenroutine) |
| KFB ToolBox Stage-First Round1.dc.html (Projektwurzel) | Shell-Vorlage: KFB ToolBox Stage-First Concept.dc.html (Projektwurzel) · Logik-Owner: tools/KFB-ToolBox/stage-first/src/petstudio-v9/studio-v3/pet-library.v6.js + studio-v12/pet-eye-rig.v6.js @ eabc8725 (1:1 kopiert nach kfb-lib/) |
| tools/KFB-ToolBox/_handover/STAGE_FIRST_V1_PROMOTION_2026-09-18/** | Intake `_handover/STAGE_FIRST_V1_INTAKE_2026-09-18/START_HERE.md` @ main · Assets gelesen @ eabc8725 (FrizzleBob_Yellow e0a757ec, kfb-pinball-sfx 5f7b52e2, fonts 0641514242e8 u. a.) |
| tools/KFB-ToolBox/_handover/EXPORT_STAGE_FIRST_V1_2026-09-17/** | Quelle: Projektbaum `stage-first/` · Exportbriefing `_handover/KFB_TOOLBOX_STAGE_FIRST_V1_EXPORT_2026-09-17.md` @ 33491afb |
| tools/KFB-ToolBox/stage-first/src/KFB ToolBox Stage-First v1.dc.html | Logik: _inbox/KFB FrankenStein Studio (7).zip @ 79c5799a → export/WSA_2026-09-16_SESSION/src/KFB FrankenStein Studio v18.dc.html · Module: _inbox/KFB FrankenStein ToolBox (WS0).zip A_QUELLSTAND/src + v18 goth-biped.v1/browfit.v1/inkform.v2 · Shell nach _handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/{START_HERE,ASSET_LIBRARIAN_INTEGRATION}.md @ main + Stage First v3 Konzept |
| tools/KFB-ToolBox/stage-first/qa/Stage-First QA.dc.html | eigener Prüfstand; Profile aus (7).zip export/WSA_2026-09-16_SESSION/profiles/* |
| tools/KFB-ToolBox/_handover/UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/design/KFB ToolBox Stage-First Concept.dc.html | UI_RESET_MINIMAL_STAGE_FIRST_2026-09-15/START_HERE.md @ main · Tokens/Roster aus STUDIO_V17_INVENTORY.md, COVERAGE_MATRIX.md, design/kaykit-catalog.json (Projektkopie) |
| tools/KFB-ToolBox/_handover/BIRTHDAY_STARTSCREEN_2026-09-15/{RETURN_BIRTHDAY_CONSUMER.md,qa/*,profiles/*} | START_HERE.md @ 1139a94f · GothGirl.glb + Animations @ 5b94e3e1 · KayKit_Character_Animations_1.1 @ 11d7df97 · graft-mount.v1.js aus _inbox/WS0_2026-09-15/unpacked (ZIP d3c16e3a) · animal-cat.glb @ b601e553 |
| tools/KFB-ToolBox/site/KFB ToolBox.dc.html (+ index.html, identisch) | neu 15.09. aus _inbox/WS0_2026-09-15/{RETURN_WSA.md,DELTA_WSA.md,FIELD_COVERAGE.md,qa-wsa/*}; ersetzte Fassung _archive/site-v1_2026-09-14/ |
| tools/KFB-ToolBox/site/*-standalone-.html · site/configs/*.json | WSA_2026-09-13/* @ f4171ad2 (unverändert; ab 15.09. nicht mehr der Startweg) |
| tools/KFB-ToolBox/_inbox/WS0_2026-09-15/** | tools/KFB-ToolBox/_inbox/KFB FrankenStein ToolBox (WS0).zip @ main (Tree a3adb84692fd), vollständig entpackt |
| Startweg der sieben Werkzeuge | _inbox/WS0_2026-09-15/unpacked/A_QUELLSTAND/src/*.dc.html (7 Einstiege, über HTTP) |
| tools/KFB-ToolBox/docs/MISSING_MODULES.md · CHANGELOG.md · TOOLBOX_MANIFEST.json | fortgeschrieben aus den Prüfungen in _inbox/WS0_2026-09-15/qa-wsa/ |
| tools/KFB-ToolBox/docs/EMBED_V3_COVERAGE.json | tools/KFB-ToolBox/kfb-rigs-embed-v3/** @ f6e1a57d2580 (unverändert) |
