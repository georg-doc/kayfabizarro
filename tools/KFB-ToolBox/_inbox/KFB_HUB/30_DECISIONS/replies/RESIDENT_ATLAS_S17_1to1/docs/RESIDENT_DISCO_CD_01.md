# RES-DISCO-CD-01 · Session Cut · Resident Disco (Claude Design)

**Datum:** 2026-09-25 · **Status:** candidate-only · Review offen · nichts publiziert
**Brief:** `skills/chat/workflows/KFB_PRODUCTION_ARCHITECTURE_V3_2026-09-24/CLAUDE_DESIGN_RESIDENT_DISCO_01_2026-09-24.md` (PR #204, Head `a0daf05c`)
**Review-Artefakt:** `KFB_Resident_Atlas_S9.html#__disco` (öffnet direkt den Disco-Resident)
**Ausgangslage:** Resident Atlas S8 / Orc-Band-Strang. Gleiche Editor-Schicht, gleiches Studio, gleiche Puppe, gleiches IK, gleiche Songuhr-Semantik.

## Was entstanden ist

Drei Modi auf einer Seite, umschaltbar in der Kopfzeile:

1. **Source Cast**: sieben Figuren in Bind-Pose aus ihren eigenen Quelldateien, dazu Radio, Lautsprecher und die Kugel. Neutrales Tageslicht, die Kugel ist aus. Über jeder Figur steht ein Etikett mit Slot, Rig und Revision, der volle Pfad steht in der Leiste.
2. **Motion Audition**: Alle Figuren tanzen nebeneinander, jede auf ihrem gewählten Clip. Die Auswahl pro Figur listet nur Clips, die es schon gibt. ★ markiert die Paarungen aus dem Brief, Reise-Clips sind gekennzeichnet. Es läuft eine Uhr, die Tempo-Regel lässt sich umschalten.
3. **Ensemble**: eine 16-Takt-Phrase auf dem Außenplatz mit versetzten Grooves, Wechseln im Takt, zwei gemeinsamen Hits, Requisiten und der eingehängten Kugel. Standardmäßig ist Abendlicht an. Das Abendlicht gehört dem Host, die Kugel färbt die Szene nicht um.

Transport: Play/Pause, Takt 1, Sprung zu Phrase 9 und 15, Phase ±10 ms, Scrub über die Zeitleiste. Figuren lassen sich einzeln ein- und ausblenden.

## Dateien

| Datei | Rolle |
|---|---|
| `KFB_Resident_Atlas_S9.html` | S8 plus Disco-Resident `#__disco`. Alle S8-Residents und die Band laufen unverändert weiter |
| `lib/disco-ensemble.js` | Modul-Laufzeit: Cast laden, Clips je Bild auf die Songzeit setzen, Legacy-Bounce, Cue-Auflösung, Layout |
| `lib/disco-workshop.js` | Host-Seite: Transport, Modi, Außenfläche, Tag/Abend, Platzierungs-Sammelstelle, Etiketten, Export |
| `lib/disco-ball-core.js` | **DISCO-BALL-CORE-01**, das wiederverwendbare Welt-Objekt |
| `lib/song-transport.js` | Songuhr mit derselben Semantik wie S8/MUSIC-PERF. Liest den `song`-Block aus `data/resident-band-module-01.json` |
| `data/resident-disco-01.json` | Rezept-Kandidat: Cast, Paarungen, Requisiten, Phrase, Cues |
| `data/disco-ball-core-01.json` | Kugel-Definition: Modi, Parameter, Lichtgrenze, EyeRig-Naht |

## Quellen · Pfad und Revision

| Slot | Figur | Rig | Pfad | Revision | Herkunft |
|---|---|---|---|---|---|
| D1 | Skeleton Minion | Rig_Legacy | `media/3D_Assets/KayKit Legacy/KayKit Legacy Character Pack - Skeletons 1.0/Models/characters/gltf/character_skeleton_minion.gltf` | `e0037d79` | Georgs Pfad und Revision, unverändert übernommen. Das Rig ist `KayKit Character Animations 1.2 - legacy/…/KayKit_AnimatedCharacter_v1.2.glb` @ `10a7fdce` (zwei Pins, wie seit S36c) |
| D2 | Avian Swordsman | Rig_Medium | `KayKit_Mystery_Series6/9 - March 2026 - Avian Swordsman/AvianSwordsman.glb` | `891eadf0` | Atlas-Cast, im Browser belegt seit S10 |
| D3 | Protagonist_A · Teenager | Rig_Medium | `KayKit_Mystery_Series6/10 - April 2025 - Protagonists/characters/Protagonist_A.glb` | `891eadf0` | Atlas-Cast, belegt seit S36 |
| D4 | Toy Soldier | Rig_Medium | `KayKit_Mystery_Series6/6 - December 2025 - Toy Soldier/ToySoldier.glb` | `891eadf0` | Atlas-Cast, belegt seit S6 |
| D5 | Witch | Rig_Medium | `KayKit_Mystery_Series6/5 - November 2024 - Witch/characters/Witch.glb` | `891eadf0` | Atlas-Cast, belegt seit S9 |
| D6 | Black Knight | Rig_Large | `KayKit_Mystery_Series6/3 - September 2024 - Black Knight/characters/BlackKnight.glb` | `891eadf0` | Atlas-Cast, Rig_Large belegt seit S10 |
| D7 | Demon Lord | Rig_Large | `KayKit_Mystery_Series6/DemonLord/characters/DemonLord.glb` | `891eadf0` | Atlas-Cast, Rig_Large belegt seit S22 |
| — | Radio | Requisite | `Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/radio.gltf` | `032c9d50` | Pfad aus dem Brief. Auf 1,0 Höhe skaliert (s 1,23), das ist eine Entscheidung |
| — | Lautsprecher ×2 | Requisite | `KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Speaker.gltf` | `891eadf0` | Pfad aus dem Brief. Auf 1,5 Höhe skaliert, ebenfalls eine Entscheidung |
| — | Motion Library | Clips | `Animations/KFB_Motion_Library/KFB_Motion_Library_Rig_{Medium,Large}.glb` + Katalog | `032c9d50` | Revision aus dem Parent-Brief. 33 Clips je Rig |
| — | Songuhr | Beweis | `Sounds/KFB RoadTrip JukeBox v2/Rubbish Groove 2min A extend 01.mp3` | `c19e291e` | Git-Blob wird im Browser nachgerechnet und geprüft (`368eb5ae` ✓) |

Die Series-6-Figuren laden am Atlas-Pin `891eadf0`, der im Browser belegt ist. Dass Georgs Rohlinks für Avian und Protagonist bei `e0037d79` nicht aufgelöst wurden, meldet der Parent-Brief. Deshalb wurde **keine** Figur ersetzt: Es sind dieselben Dateien, geladen an der Revision, an der der Atlas sie schon zeigt.

## Figur × Bewegung

Die Paarungen stammen aus dem Brief. Die Zahlen oben werden beim Laden gemessen. Tempo „Takt-Raster“ gilt nur, wenn die Rate um höchstens 6 % abweicht.

| Figur | A | B | Bindung | Takt-Raster bei 100 BPM |
|---|---|---|---|---|
| Skeleton Minion | `bounce` (Orc-Band-Prinzip, prozedural) | — (Legacy-Clips vorsprechbar) | 4 Legacy-Bones | 8 Schläge |
| Avian Swordsman | `wave_hip_hop_a` 16,87 s | `hip_hop_a` 13,67 s | 69/69 | ×1,004 → 7 Takte · ×0,949 → 6 Takte |
| Protagonist_A | `house_a` 19,83 s | `slide_hip_hop_a` 17,33 s | 69/69 | ×1,033 → 8 · ×1,032 → 7 |
| Toy Soldier | `chicken_a` 4,8 s | `house_a` | 69/69 | ×1,000 → 2 · ×1,033 → 8 |
| Witch | `samba_a` 23,9 s | `house_a` | 69/69 | ×0,996 → 10 · ×1,033 → 8 |
| Black Knight | `house_a` | `slide_hip_hop_a` | Rig_Large | wie oben |
| Demon Lord | `hip_hop_a` | `wave_hip_hop_a` | Rig_Large | wie oben |

Thriller Part 3 sowie Locking und Step Hip-Hop sind reine **Vorsprech-Clips**. Ihre Wurzelbewegung läuft mit und wird nicht genullt. Im Ensemble kommen sie nicht vor, weil ihre Reise in diesem Durchgang keine begrenzte Tanzzone bekommt.

## Ensemble · 16 Takte

- Takte 1–4: Jede Figur tanzt ihren eigenen Groove, versetzt um 0 bis 2 Schläge.
- Takte 5–8: Die Wechsel laufen versetzt wie Ruf und Antwort (Avian, Soldier und Knight wechseln auf Takt 5, Teen, Witch und Demon auf Takt 7).
- **Takte 9–10 · HIT 1:** Alle tanzen gleichphasig den Chicken Dance. Die Kugel bekommt einen Impuls, der Minion springt hoch und reißt die Arme hoch.
- Takte 11–14: Die zweite Groove-Schicht mit neuen Versätzen.
- **Takte 15–16 · HIT 2:** Alle stehen gleichphasig in Happy Idle. Das ist ein **Platzhalter**, weil ein Cheer-, Clap- oder Victory-Clip in der Library fehlt.
- Überblendung: 1 Schlag, auf Hits ½ Schlag. Nur Anfang und Ende eines Hits laufen synchron, die normalen Grooves bleiben absichtlich versetzt.

## DISCO-BALL-CORE-01

- **Naht:** `mountDiscoBall(def, { parent, anchor, renderer, budget })` → `{ root, frame, spinner, faceHost, update(beatState), setMode, setSpin, setIntensity, setPalette, impulse, reset, place, state, dispose }`.
- **Modi:** `OFF · AMBIENT · DISCO · BEAT_PULSE · SPOT_SWEEP`. Dazu kommt `reset()` als Aktion.
- **Lichtgrenze:** 1 Projektor mit Schatten, der ein Punktmuster auf Boden und Figuren wirft. Dazu kommen 3 schattenlose Spots, die nur in SPOT_SWEEP leuchten, sowie additive Strahlkegel und Glanzpunkte auf den Kacheln. Insgesamt sind das höchstens 4 Lichter. Die Kugel hat keinen Post-Prozess, färbt die Szene nicht um und verändert weder Hintergrund noch Nebel.
- **Uhr:** `update({ time, beatPos, level })` bekommt die Szenenuhr des Hosts. Beim Scrubben dreht sich die Kugel mit. In BEAT_PULSE gibt es auf jedem Takt einen Dreh-Impuls, in allen Modi einen auf den Ensemble-Hits.
- **Platzierung:** Die Kugel lässt sich frei verschieben, drehen und skalieren. Im Ensemble werden diese Änderungen gesammelt.
- **EyeRig-Naht:** `ball.faceHost` sitzt vorn auf der Oberfläche und hängt am nicht drehenden `frame`. Die Naht ist heute leer und nirgends ist ein Auge eingebacken.
- **Rückfall:** Ohne Renderer sind die Kacheln matt. Ohne Schattenlicht im Budget fällt die Punktmaske weg. Beides meldet `state().fallback`.
- **Geometrie:** Sie ist atlas-eigen (`atlas://generated/disco-ball-core-01`). Ein WorldDesign/Birthday-Spender wurde **nicht** gefunden: Die Codesuche im Repo war begrenzt, 400 von 13 614 Dateien, also ist das kein Beweis, dass es keinen gibt. Diese Kugel behauptet deshalb nicht, jener Spender zu sein.

## Nachtrag S40b · Georgs Blick (2026-09-25)

- Es gibt **keine Grundplatte, auch nicht vom Host**. Der Platz ist nur ein Vergleichsschalter. Die Kugel legt ihre Lichtflecken selbst auf die Bodenhöhe (`floorCatch`).
- Die Boxen stehen am Rand: eine rechts (x 6,2), wo der Black Knight nicht mehr hineintanzt, die andere außen links. Das Radio steht weiter links außen.
- Die Kugel **schwebt wie in Sirup**: langsame Drift und Neigung, dazu eine schwere Feder für Impulse. Sie **pulsiert cartoonhaft** auf dem Schlag, indem sie sich aufbläht, überschwingt und staucht.
- Die **Boxen** hüpfen im Takt, stauchen sich, und ihre Front wölbt sich aus (Vertex-Deformer). Angetrieben wird das vom Bass-Band des Songs.
- Flecken und Strahlen sind jetzt weicher gezeichnet.

## Nachtrag S40c · Strahlen und Atlas-Umgebung

- Die Strahlen sind jetzt die Hauptsache: Sie enden auf dem Boden und hinterlassen dort einen Lichtfleck. Drei echte Spots fahren auf drei Strahlen mit und beleuchten Figuren, Boxen und Radio. Die Projektorpunkte sind zurückgenommen.
- **Konvention Resident-Host-Umgebung** (`lib/host-env.js`, Schema `kfb.resident-host-env/1`):
  1. Der Host montiert Boden, Himmel und Tageszeit einmal. Residents und Events gehören nicht dazu.
  2. Ein Resident oder Event wird auf floorY = 0 eingesetzt, **ändert die Fläche nicht** und bringt keine Grundplatte mit.
  3. Die Tageszeit ist die einzige Stimmungsschraube. Sie stellt Himmel, Nebel und die Viewer-Lichter gemeinsam, damit später auch Stimmung und Tageszeit darüber laufen können.
  4. Der Boden ist prozedural und hat keine Kante. Er ist ein Platzhalter für den WorldBuilder-Boden, der Tausch berührt keinen Resident.
- Offen: Der WorldBuilder-Boden selbst ist in diesem Projekt nicht als Quelle vorhanden, die Bridge soll ihn einsetzen. Die Band-Werkstatt bringt aus S8 noch eigene Host-Kästen mit, die über dieser Umgebung liegen.

## Grenzen, eingehalten

- Es gibt eine Songuhr und keinen Player pro Resident. Die Uhr ist nur ein Beweis, Rubbish Groove ist **nicht** als Disco-Song festgelegt.
- Kein neuer Motion-Besitzer: Die Clips kommen aus der Library, die Zeit wird pro Bild gesetzt. Neue Mixamo-Clips gibt es nicht.
- Keine Grundplatte: Platz und Wiese gehören dem Host.
- Kein Proxy: Jede Figur und jede Requisite kommt aus ihrer eigenen Datei.
- `data/cast.js`, `lib/atlas.js` und `lib/band-*.js` sind unverändert.

## Offen

1. Es gibt keinen Cheer, Clap oder Victory. HIT 2 nutzt Happy Idle als Platzhalter. Das ist der erste Kandidat für die Mixamo-Aufnahme (Phase B).
2. Die Reise-Clips (Thriller, Locking, Step) haben weder eine begrenzte Tanzzone noch eine in-place-Ableitung.
3. Der Disco-Kugel-Spender ist nicht isoliert. Falls es ihn gibt, muss er vor der Integration als eigene Quelle gezeigt werden.
4. Das 6-%-Takt-Raster ist eine Einstellung und kein gemessenes Fenster (AN-PROFILE-01: „unknown stays unknown“).
5. Der Band-Resident hat im S9 noch seinen eigenen S8-Transport. Beide auf `lib/song-transport.js` zusammenzulegen ist Aufgabe der Bridge.
6. Bone-Griffe am Disco-Cast werden gesammelt (`disco-01.<figur>`), aber nicht über die laufenden Clips zurückgespielt. Patch-Semantik gibt es bisher nur in der Band-Werkstatt.
7. Legacy-Clips am Minion schalten hart um, ohne Überblendung zum Bounce.
8. Maßstab von Radio und Lautsprecher ist entschieden, nicht aus einer Referenz abgeleitet.
9. Das Band-Feld rechts (x 6,2–12) ist reserviert, aber nicht belegt.

## Return

RES-DISCO-CD-01 liefert eine Atlas-Seite (`S9#__disco`) mit Source Cast, Motion Audition und einem 16-Takt-Ensemble. Darin stehen sieben echte Quellfiguren aus drei Rig-Klassen auf einer Songuhr, dazu Radio, zwei Lautsprecher und DISCO-BALL-CORE-01 als eigenständiges, einhängbares Welt-Objekt mit begrenztem Licht und einer reservierten EyeRig-Naht. Figuren wurden weder ersetzt noch durch Proxys vertreten, es gibt keine zweite Musik- oder Resident-Laufzeit, und nichts ist publiziert. Nächstes Gate: Georgs Blick auf die vier Fragen unten, danach übernimmt die Bridge.

## Fragen an Georg

1. Welche der sieben Figur-Bewegungs-Paarungen bleiben?
2. Liest sich der Bounce des Skeleton Minion als absichtliche Party-Bewegung?
3. Fühlt sich die Discokugel wie ein wiederverwendbares KFB-Welt-Objekt an und nicht wie Deko?
4. Sind Strahlen und Lichtpunkte lebendig, ohne die Figuren zu verschlucken?
