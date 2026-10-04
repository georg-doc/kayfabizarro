# HANDOVER · Pet Studio v12 → WS-A (Animation Lab, Combat Arena, neue Spiele)

**Stand:** 2026-09-09 · **Quelle:** `petstudio-v9/KFB Pet Studio v12.dc.html` + `petstudio-v9/studio-v12/` ·
**SSOT des Verlaufs:** `docs/petstudio-v12/LIVING_petstudio_v12.md` (additiv, neueste Zeile oben) ·
**Regeln:** `docs/00_SO_ARBEITEN_WIR.md` (13 Hausregeln) · **Konvention:** eine Kurve, eine Maske, ein Anker.

Dieses Dokument reicht, um den v12-Hasen samt Gesicht in einen fremden three-Wirt zu setzen. Es ist der
erste Schnitt von Georgs Ziel 5 (»Export + Bauanleitung für den kompletten Hasen«) und zugleich der
Nachtrag zu `skills/EMBED_CUBE_PET_FULL_v2.2.md` (siehe `EMBED_CUBE_PET_FULL_v2.3_NACHTRAG.md` daneben).

---

## 1 · Was v12 ist, in vier Sätzen

Pet Studio v12 ist der Fork von v11, in dem der Arena-FrizzleBob (Astras 4A-Modul) **Bewohner** ist —
ein Roster-Eintrag `kind: 'biped'`, zwei Varianten (plain/gun), dieselben Tabs wie die Cube-Pets. Das
Studio baut Augen, Mund, **Braue** und **Nase** über seine eigenen Bauwege; das Modul bringt Körper,
Clips und den Kopf-Host (Ellipsoid). Alle Gesichtsteile hängen am **öffentlichen Augen-Anker
`rig.eyeFrame()`** und binden sich nach jedem Rig-Neubau selbst neu. Werte leben im Pet-Eintrag
(`pet.eye · pet.mouth · pet.brow · pet.nose · pet.gun`), plain und gun teilen EIN Objekt je Teil.

## 2 · Der Ladeweg (was WS-A kopiert, nicht nachbaut)

| Datei (relativ zu `petstudio-v9/`) | Rolle | Herkunft / Stand |
|---|---|---|
| `studio-v12/frizzlebob.v4a.js` | Körper, Kopf-Host, 18 Clips, Boden-Messung ohne Waffe | Astras 4A (06.09.), zwei Pfadzeilen geändert |
| `studio-v12/gun-look.v4a.js` | `GUN_PALETTES` (nur `dice` implementiert), `applyGunPalette`, `matchBellyZone` | Astras 4A, unverändert |
| `assets/models/FrizzleBob_Yellow.gltf` · `_Gun.gltf` | gepatchte Modelle (Körper `#f2c83c`, Gesicht/Hand/Fuß/Bauch `#e6b671`), Puffer eingebettet | 608 / 676 kB. **Pfad im Modul: `../assets/models/` relativ zu `import.meta.url`** |
| `studio-v12/pet-eye-rig.v6.js` | EyeRig v5 + `splay` (abgetastet, v6a) + **`eyeFrame()`** + `gen` | Fork von `studio-v3/pet-eye-rig.v5.js`; v5 bleibt Ladeweg aller anderen |
| `studio-v12/brow-rig.v1.js` | eine Kurve + Maske, Kanon-Feder, 7 Presets, `validate()`, `sync()` | Port von Astras `Studies/Acting-Lab-v0.2/brow-rig.js`; importiert `../kfb-ink-canon.js` |
| `studio-v12/pet-nose.v1.js` | abgerundetes Rechteck, KFB-Rot, Glanzregler, Haut per Strahl abgetastet | neu (S6) |
| `studio-v3/pet-mouth.v1.js` | Talk-Münder, 5 Viseme, Anschmiegen | unverändert (byteidentisch zur Arena) |
| `studio-v12/ground-plane.v2.js` | Studio-Boden (STEMPEL-Schatten, `noMeasure`-Filter) | Fork von `studio-v7/ground-plane.v1.js` |
| `kfb-ink-canon.js` | die Feder (`inkHalfWidth`, `INK_PRESETS.figure`) | Kanon — importieren, nie nachbauen |

three **0.160.0** (Importkarte im Wirt). ⚠ Boxel Blitz v2+ fährt 0.185 — v12 nicht; ein Sprung ist eine
eigene Baustelle (Belichtung wandert mit, siehe `docs/boxelblitz-v2/`).

## 3 · Einbau-Anleitung — der Hase in einem fremden Wirt

```js
import FrizzleBob, { SPEC } from './studio-v12/frizzlebob.v4a.js';
import { EyeRig }  from './studio-v12/pet-eye-rig.v6.js';
import { PetMouth } from './studio-v3/pet-mouth.v1.js';
import { BrowRig, pointsFor } from './studio-v12/brow-rig.v1.js';
import { NoseRig } from './studio-v12/pet-nose.v1.js';

// 1 · Körper vom Modul. KEIN eyeRigModule/mouthModule mitgeben — der Wirt baut das Gesicht.
const fb = new FrizzleBob();
await fb.init({ three: THREE, rng, clock: { now: () => performance.now() / 1000 }, gltfLoader,
  assets: { raw: (p) => RAW + encodeURI(p) }, camera, log: console.info });
fb.variant = 'plain';                 // oder 'gun'
const root = new THREE.Group(); scene.add(root); fb.mount(root);
const report = await fb.ready;        // report.height 3.600 (plain) · Gun-Variante 4.294 INKL. Waffe

// 2 · Größe: EIN Maß. Körperhöhe OHNE den Knoten `Gun` messen (Grenze eines Zubehörs ist sein Knoten,
//     nicht sein Materialname — gemessen: 4 Netze, nur eins heißt Gun_Grey). Ziel = 1,35 × Cube-Pet-Höhe.
root.scale.setScalar(TARGET_H / bodyHeightWithoutGun);
root.position.y = groundY;            // der Wirt pflanzt; fb._groundKeep = () => null

// 3 · Gesicht über den Kopf-Host (Ellipsoid, opacity 0):
const fctx = fb.faceCtx();            // { THREE, inner, o:{}, _squash:null, getFaceShells:()=>[] }
const rig = new EyeRig(fctx, { ...SPEC.eyes, ...pet.eye, splay: pet.eye?.splay ?? 0, baseColor: 0xf2c93c });
rig.build();
const mouth = new PetMouth(fctx, { params: { ...SPEC.mouth, ...pet.mouth } });
const brow = new BrowRig({ THREE, getEyeFrame: () => rig.eyeFrame(), baseColor: 0xf2c93c,
  params: { ...pet.brow, points: pet.brow?.points ?? pointsFor('neutral') } });
const nose = new NoseRig({ THREE, getEyeFrame: () => rig.eyeFrame(), params: { enabled: true, ...pet.nose } });

// 4 · Kenneys aufgemalte Augen (drei Netze am Head: EyeColor · White · Black) ausblenden + noMeasure.
// 5 · Tick, in dieser Reihenfolge:
fb.mixer.update(dt); rig.update(dt); brow.sync(); nose.sync(); mouth.update(dt, camera);
```

**Vertragsfelder, die WS-A speichern soll (Mindest-Export der Wunschliste):** `actorId`, Schema-Version,
`eye` (anchor · inset · splay · pupilStyle · …), `mouth` (SPEC.mouth-Schlüssel), `brow` (**Punktfolge +
mask**, nie zwei Brauen; `expr` nur Etikett), `nose` (size · radius · height · depth · x · gloss · color),
`gun` (palette · shell), echte Clipnamen (18, `fb.ownClips`), Root-Motion (Modul), Attachments (Knoten `Gun`).

**Was das Studio besitzt, was der Wirt besitzt (ein Besitzer je Kanal):** Körper/Clips = Mixer (Modul) ·
Gesicht = Face-Adapter des Wirts (Rig, Mund, Braue, Nase) · Root = Arena/Wirt · Boden = Wirt.

## 4 · Fünf Dinge, die jeder beim Einbau falsch macht (alle bezahlt)

1. **Der Studio-Schatten ist ein STEMPEL** (Kamera von oben auf `target`), kein Lichtschatten —
   `castShadow` tut nichts, `setTarget(root)` ist der Weg.
2. **Waffe ist Zubehör**: wer die Hüllkiste inkl. `Gun` misst, stellt den Hasen auf den Lauf.
3. **Im verborgenen Fenster stehen die Lider GESCHLOSSEN** (Bildschleife parkt) — vor jedem Standbild
   30× von Hand ticken. Ein Hase ohne Augen im Screenshot ist meist keiner.
4. **Messen über Regler-Handler ist Schreiben** — Probewerte landen im Entwurf (`kfb-pet-studio-v5`).
   Am Modul messen (`rig.setEye`, `brow.set`) oder danach zurückdrehen.
5. **Braue hängt am Auge, nicht an der Fläche** — bei ~35° Gier schweben die Spitzen. Tiefenpolitik
   (grafisches Overlay vs. Flächenanpassung) ist **offen, Georgs Entscheidung** (Astras Handover §5).

## 5 · Sprintplan für den frischen Chat (Vorschlag, Georgs Reihenfolge a→c→b ist erledigt)

| # | Scheibe | Woher | Abnahme |
|---|---|---|---|
| S7 | **Oberfläche**: Zwei-Drittel-Bildschirm, Paletten ein/aus, Tab-Leiste prüfen | Georg Auftrag §0.3 | Bild bei 1280 und 900 px, Kamerarahmen schneidet keine Ohrspitzen |
| S8 | **Actions-Tab Minimum**: semantische Aktion → echter Clip, Play/Scrub/Slow, Mündungsanker, versioniertes Mapping als JSON-Export | WSA-Wunschliste A | Export lädt in Combat Arena 4A ohne Nachfrage |
| S9 | **Export + Bauanleitung Hase** (Ziel 5): `kfb-biped.json`-Vertrag + dieses Dokument als Skill ins Repo | Georg §0.5 | Round-Trip leer, ein fremder Wirt zeigt den Hasen |
| S10 | Face-Director: Blick-Ziel, Schussausdruck mit Peak am Release, Hit/Stun getrennt, Talk-Cycles | WSA-Wunschliste A | Prioritäten je Kanal, kein Doppelschreiber |
| B | Backlog: Brauen-Tiefenpolitik · Lesbarkeit 96/48 px (D06) · »brows only«-Isolation · splay oben/unten · Kenney-Augen aus der GEOMETRIE schneiden (jetzt: ausgeblendet) · Waffenfarben Schwarz/Grau/Hell · Arena-Licht wärmer als Studio | S2/S3/S4-Backlog | — |

## 6 · Offene Fragen an Georg (mit Empfehlung)

1. **Brauen-Tiefe:** Overlay lassen (a, Empfehlung für Studio/Podcast) oder Flächenanpassung (b, für die Arena mit Drehungen)?
2. **Nasen-Vorgabe:** Höhe 0,55 R / Größe 0,9 aus meiner Messung, oder deine Zahl vom Regler?
3. **Repo-Ablage der v12-Module:** `media/3D_Assets/build/` (neben `pet-eye-rig.v5.js`, Empfehlung) oder `skills/`? Bis dahin laden `../assets/models/…` relativ — bricht im Standalone (Pfad-Hygiene §6 session-export).
4. **`pet.brow` vs `face.brow`:** v12 hat `pet.brow` gewählt (wie `eye`/`mouth`). Astras Handover verlangt EINE Entscheidung — bestätigen?
5. **Bunny-Entwurf `eye.anchor.dx` 0,40 gegen Repo 0,34** (Guard-Meldung seit Sitzungsstart, nicht von mir): behalten oder verwerfen?
6. **Standalone-HTML:** gebaut, **1,3 MB, läuft** (Bunny + Braue, Hase gelb + Braue + Nase, Münder aus dem Repo). Zwei Eingriffe: lokale Schriften raus (Georg), und ein **Modul-Anker `window.__KFB_MODBASE`** — die 13 Bausteine laden zur Laufzeit von einer Basis-URL statt relativ zur Seite. Heute zeigt der Anker auf die Projekt-Serve-Adresse; **nach dem Upload der Bausteine ins Repo eine Zeile auf jsdelivr umstellen** (Frage 3). Erst dann ist die Datei unabhängig vom Projekt.

## 7 · Verweise ins Repo — mit Prüfstand vom 09.09.2026

| URL | Befund | Caveat |
|---|---|---|
| [`skills/EMBED_CUBE_PET_FULL_v2.2.md`](https://github.com/georg-doc/kayfabizarro/blob/main/skills/EMBED_CUBE_PET_FULL_v2.2.md) | vorhanden, 46,6 kB, Stand 04.08. **Dreimal im Repo** (auch `media/3D_Assets/GLB_cube-pets/` und `skills/KFB PetStudio/docs/…_v2.md`, byteidentisch) | Kennt weder Zweibeiner noch `eyeFrame`, Braue, Nase, `splay`. Nachtrag: `EMBED_CUBE_PET_FULL_v2.3_NACHTRAG.md`. **Zwei `kfb-pets.js`** (`media/3D_Assets/` 17 kB, `build/` 12 kB) — der TL;DR importiert die obere |
| [`skills/KFB Setup Game Design/kfb-asset-library (5).json`](https://github.com/georg-doc/kayfabizarro/blob/main/skills/KFB%20Setup%20Game%20Design/kfb-asset-library%20(5).json) | **NICHT in `main`** (Baum gemessen: 4 Dateien im Ordner, repo-weit 0 Treffer für `asset-library`) | Das Gründungsdokument §3.2 beschreibt sie (10 466 Einträge, 03.09.) — Upload steht aus; »(5)« ist ein Download-Duplikat-Name |
| [`skills/`](https://github.com/georg-doc/kayfabizarro/tree/main/skills) | 148 Dateien; zwei Embed-Bundles (`kfb-embed-bundle` und `… v3`) | v3 ist laut Gründungsdokument die gültige; das alte ist ein Aufräum-Kandidat |
| [`KFB_Frankensteining_Lab (1).html`](https://github.com/georg-doc/kayfabizarro/blob/main/skills/KFB%20Setup%20Game%20Design/KFB_Frankensteining_Lab%20(1).html) | vorhanden, 156 kB | Dateiname mit »(1)« = Download-Duplikat; Gründungsdokument nennt es Vertragsbestandteil (>70 Setzungen). Hier nicht gelesen |
| [`GRUENDUNGSDOKUMENT_KFB_Design_Projekt.md`](https://github.com/georg-doc/kayfabizarro/blob/main/skills/KFB%20Setup%20Game%20Design/GRUENDUNGSDOKUMENT_KFB_Design_Projekt.md) | gelesen | §3.1 nennt EMBED v2.2 »aktuell« — nach v12 nicht mehr (§9.1 »Coworker aktualisiert die Pets« ist genau dieser Nachtrag). §4 Wirt-Vertrag: v12-Module tragen noch keine Kopffelder `view/determinism/since`; EyeRig blinzelt mit `Math.random` (Astras Handover Punkt 14) → **nicht vertragskonform, benannt** |
| [`living-document_v1.md`](https://github.com/georg-doc/kayfabizarro/blob/main/skills/living-document_v1.md) | gelesen | v12-LIVING ist additiv/neu-oben, folgt aber NICHT den elf Abschnitten (kein nummeriertes Entscheidungsprotokoll über E-1…E-3, kein Register). Format `.md`, während `session-design-briefing` `SESSION_LIVING.html` verlangt — zwei Formate im Haus |
| [`workspace-sync_v1.md`](https://github.com/georg-doc/kayfabizarro/blob/main/skills/workspace-sync_v1.md) | gelesen | verlangt Living-**HTMLs** mit Skeleton-Blöcken; für v12 (.md) per eigener Regel §1 **kein Sync möglich** ohne Konvertierung |

*Ende. Kopieren, nicht nachbauen; ein Anker, drei Bauteile; der Wirt tickt, das Modul meldet an.*
