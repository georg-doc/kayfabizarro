# HANDOVER · WSA · Resident Atlas S9 · Sprint S40 (Disco) · 2026-09-25

Für den nächsten Chat (WSA). Stand nach S40–S40f. Additiv zu `CHANGELOG.md` (Einträge S40 … S40f),
`docs/RESIDENT_DISCO_CD_01.md` (Session Cut RES-DISCO-CD-01) und `docs/DISCO_BEAT_MEASURE_01.md`.

## 1 · Was läuft

`KFB_Resident_Atlas_S9.html#__disco`: Die Resident Disco ist eine Außen-Party ohne Grundplatte. Sie hat drei Prüfmodi: Source Cast, Motion Audition und Ensemble.

- **Cast** (9, einer davon als Alternative):
  - D1 Skeleton Minion (Legacy, springt umher)
  - D2 Avian
  - D3 Protagonist_A
  - D4 Toy Soldier
  - D5 Witch
  - D6 Black Knight **oder** D6b Monstrosity
  - D7 Demon Lord
  - D8 FrizzleBob DJ/MC (KayKit-Driver + FB-Kopf über `graft-mount.v1`, Carl-Nase, GothGirl-Mikro links)
- **Requisiten:** Radio, 2 Boxen (Beat-Deformer), Drum Machine. Die Drum Machine ist nach Georgs Studio-Export vom 25.09. in den Boden gesenkt.
- **Uhr:** eine Rotation mit 8 Titeln, am Audio gemessen, mit Tempokarte für die driftenden Titel. Rubbish Groove bleibt Beweis-Uhr.
- **Choreografie:** 16-Takt-Phrase. Jede Figur hat ein eigenes Vokabular. HIT 1 ist gemeinsam, HIT 2 als Call and Response.
- **Im Ensemble wird die Hüftwanderung herausgerechnet:** am Wurzelknoten `root`, gleitendes 2-s-Mittel.
- **Kollision:** RESIDENT-COLLIDE-01 (Tänzer schubsen sich, Requisiten sind fest).
- **Licht:** DISCO-BALL-CORE-01 (Kugel, Strahlen, Lichtflecken) und die Atlas-Umgebung `host-env` (Boden, Himmel, Tageszeit).

## 2 · Codebasis (Export-Set, läuft so)

| Datei | Rolle |
|---|---|
| `KFB_Resident_Atlas_S9.html` | Host · Split-Screen, Panel, Studio/Puppe/IK, Band- und Disco-Resident |
| `lib/disco-ensemble.js` | Modul-Laufzeit · Cast (KayKit, Legacy, **Graft**), Requisiten, Cues, Hits, Wanderung, Roam, Kollision, Kugel |
| `lib/disco-workshop.js` | Host-Werkstatt · Modi, Rotation, Alternativen, Platzierung, Snapshot, Modul-JSON |
| `lib/song-transport.js` | EINE Uhr · `load(song)`, `tempoMap`, `nudgePhase`/`nudgeBeat`, Analyser (level/bass) |
| `lib/resident-collide.js` | three.js-frei · `makeCrowd` (eingebaut), `makeWalker` (bereit, nicht eingebaut) |
| `lib/disco-ball-core.js` | Welt-Objekt Discokugel |
| `lib/host-env.js` | Atlas-Umgebung |
| `lib/atlas.js`, `props.js`, `studio.js`, `rigwork.js`, `edit-layer.js`, `ik-rig.js` | geteilte Atlas-Schicht (unverändert in S40e/f bis auf nichts) |
| `lib/band-module.js`, `band-workshop.js` | Band-Resident (eigener Transport, nicht in der Rotation) |
| `data/resident-disco-01.json` | Rezept · `cast[]`, `props[]`, `cues`, `phrase`, `collision`, `wander`, `alternates`, `clock.playlist` |
| `data/disco-playlist-01.json` | 8 Titel · Blob, BPM, erster Schlag, `tempoMap`, Messprotokoll |
| `data/disco-ball-core-01.json`, `data/resident-band-module-01.json`, `data/cast.js` | Kugel, Band (+ `song`), Atlas-Cast |

**Fremd geladen:**
- three@0.184 von unpkg.
- Assets über raw.githubusercontent, an gepinnten Commits.
- Der Graft-Leser über jsDelivr @ `5f268e80`. ⚠ Er holt seine eigenen Assets von raw@**main**.

**Neue Rezeptfelder aus S40e/f** (kein Schema-Bump, additiv):
- Cast: `graft{module,contract,contractCommit,pet}`, `matchHeight{of,k}`, `hold[]{id,bone,asset,p,r,s}`, `mc.talkBars`, `roam{min,max,everyBeats,jump,turn}`, `altOf`
- Props: `targetWidth`, `center`, `rowHidden`, `ensemble.rx`
- Modul: `alternates`, `wander{mode,windowSec}`, `clock.playlist`
- Playlist: `schema kfb.disco-playlist/1`

## 3 · FBX-Intake (Georg konvertiert gerade neue Clips) — so kommen sie an

Die Disco und alle Residents lesen Clips **nach ID aus der KFB Motion Library**:
- Rig_Medium- und Rig_Large-GLB plus `KFB_Motion_Library.catalog.json`, gepinnt in `data/resident-disco-01.json → motionLibrary.commit`.
- Heute ist der Pin `032c9d50`.

Damit ein neuer Clip ohne Codeänderung nutzbar ist:

1. **In beide Rig-GLBs** mit derselben ID (`kfb_<gruppe>_<name>_<variante>`). Die Gruppe ist `dance`, `idle`, `music`, `locomotion`, `action` oder neu `react`/`cheer`.
2. **Katalogeintrag** mit den Feldern, die schon gelesen werden: `id, loop, rootMotion (in-place|travel), durationSec, travelMetersPerCycle, bestVariant, sourceFbx`.
3. **Die Wurzelbewegung auf `root.position`**, wie bei den 33 bestehenden Clips. Die Wanderungs-Korrektur sucht von der Hüfte aufwärts den ersten bewegten Positionsknoten. Ein anderer Aufbau funktioniert auch, wird aber im Panel sichtbar („Wanderung x m raus“).
4. **Neuer Pin** in `motionLibrary.commit`. Danach im Motion-Audition-Modus je Figur vorsprechen. Die Bindung (`x/y Tracks`) steht im Panel.
5. **Wunschliste**, von der Disco her begründet:
   - ein **Cheer/Clap/Victory** für HIT 2 (heute Platzhalter `kfb_idle_happy_a`)
   - ein **MC-Gestus mit Mikro** (Arm oben, Hand am Mund)
   - kurze **Übergangs-Clips** (1–2 Takte) für Cue-Wechsel

## 4 · Offen (priorisiert)

1. **Taktanfang je Titel ist gesetzt, nicht gemessen.** Heute gilt: erster verfolgter Schlag. Korrektur im Panel mit „Takt ±1 Schlag“, gespeichert je Titel nur im Browser.
2. **Mikro in der linken Hand:** Die Slot-Identität ist vom Goth Girl rechts übernommen, gespiegelt ungeprüft.
3. **Graft-Leser lädt Driver, Kopf und Texturen von raw@main**, nicht gepinnt.
4. **HIT 2 = Happy Idle als Platzhalter.** Wird durch den FBX-Intake gelöst.
5. **Die Band in S9 hat ihren eigenen Transport** und ist nicht in der Rotation.
6. **Roam-Zone des Skeletons und Wanderungsfenster 2 s** sind Setzungen.
7. **`makeWalker` (Mobs) ist ohne Szene.**
8. **Motion Library:** Die Disco pinnt `032c9d50`, die Band liest PR #209 `f91c4e0f`. Nach dem Merge beide auf einen Pin ziehen.
9. **BraveNewWorldNews** driftet und endet abrupt. Er steht als letzter Titel der Rotation.

## 5 · Die nächsten fünf Schritte (Resident Atlas, nicht nur Disco)

1. **MOTION-INTAKE-02 + Clip-Rollen.** Die neuen FBX-Clips kommen in die Library, samt Katalog und gemessenem Profil: Schleife, Reise, Wanderung, Kontakte.
   Residents fordern Clips künftig nach **Rolle** an (`dance`, `idle`, `react.cheer`, `music.drums` …) statt nach Name. Die Disco-Cues werden damit portabel.
   Abnahme: HIT 2 mit echtem Cheer, MC mit Mikro-Gestus.
2. **EINE Performance-Uhr für alle Residents.** `song-transport` wird zum geteilten Transport, auch für die Band, damit Band und Disco auf derselben Rotation laufen.
   Dazu **Taktanfang und Abschnitte je Titel**: gemessen (Sektionswechsel über Energie und Harmonie) oder per Tap-Marker im Panel, gespeichert in `disco-playlist`.
   Die Cues hängen dann an Abschnitten (Intro/Drop/Break) statt nur an der 16-Takt-Schleife.
3. **Graft-Residents als eigene Spur.** Der FB-MC wird Vorlage für jede „KayKit-Körper + FB-Kopf“-Figur.
   Dafür nötig: gepinnte Assets im Leser (Pfad-Hygiene), Hand-Requisiten mit Slot-Achsen-Prüfung (S31) für links/rechts und ein Mund, der am `T.level()` des Songs hängt statt am Zufalls-Shuffle.
4. **Mobs und NPC-Leben.** `makeWalker` kommt in die erste Szene (Friedhof/Straße) mit Kollision an Grabsteinen und untereinander. Die Anbindung erfolgt an den Encounter-Bus NPC-LIFE-01 (PR #210).
   Die Disco ist der erste Empfänger: Passanten bleiben stehen und tanzen mit.
5. **Atlas-Konsolidierung und ToolBox.** S9 wird der eine Atlas. S5–S7 werden nach Georgs Freigabe stillgelegt.
   Geteilte Module wandern in die ToolBox: `edit-layer` (dritter Einbau), `disco-ball-core`, `resident-collide`, `song-transport`.
   Der `host-env`-Terrain-Look wird als WorldBuilder-Variante übergeben. Pflegt die ToolBox eine Resident-Registry, liest der Atlas seine Residents daraus statt aus `data/cast.js`.

## 6 · Clean-Run S9 · Disco

1. Seite ohne Konsolenfehler laden. Zwei three.js-Deprecation-Warnungen sind erwartet.
2. `#__disco` lädt 9 Figuren und 4 Requisiten. Der MC-Eintrag zeigt „Graft-Driver · Nase carl-original · GothGirl Microphone an handslotl“.
3. Ensemble, dann Play: Die Titelwahl zeigt 8 Titel, der Blob wird mit ✓ bestätigt, bei driftenden Titeln steht „Tempokarte an“.
4. Figuren-Panel, Paare: Step, Locking und House zeigen „Wanderung x m raus“ größer als 0.
5. Knight/Monstrosity umschalten: Im Ensemble steht nur eine Figur auf dem Platz.
6. Das Skeleton springt alle 4 Schläge und landet auf der Eins.
7. Nach dem Prüflauf die Studio-Ablage leeren (`ST.clear(id)`), damit keine Testdaten in den nächsten Export wandern.
