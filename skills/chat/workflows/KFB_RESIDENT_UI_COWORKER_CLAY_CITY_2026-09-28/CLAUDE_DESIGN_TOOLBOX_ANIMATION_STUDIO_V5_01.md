# Claude Design · TOOLBOX-ANIMATION-STUDIO-V5-01

## Execution Card · eigenständiges Designprojekt

- **Projekt:** bestehendes Claude-Design-Projekt **KFB ToolBox Production-05**.
- **Nicht das Resident-Atlas-Projekt.**
- **Owner/Tool:** bestehender Claude Design Desktop Chat des ToolBox-Projekts.
- **Model:** Opus 5.5 High beziehungsweise stärkstes verfügbares Claude-Design-Modell.
- **Reasoning:** High für zusammenhängenden UI-/Interaction-Pass.
- **Outcome:** neue ToolBox-/Animation-Studio-Fassung mit Motion Library v5, vollständigem Standard-Inline-Editor und Claymation-Diorama-Prüfansicht.
- **Kein GitHub-Auftrag:** Claude Design liefert einen vollständigen Session Cut/Download zurück.
- **Stop rule:** Nur echter Source-/Runtime-Blocker oder zwei fehlgeschlagene Reparaturversuche. Dann vollständiges Recovery-Paket statt Rückfragenkette.

## Klare Projektgrenze

Dieser Auftrag läuft ausschließlich im bestehenden **KFB ToolBox Production-05**-Projekt.

Das parallel laufende **KayKit Resident Atlas S12**-Projekt bleibt getrennt. Es erhält später nur exportierte Verträge und Donors:

- gemeinsamer 3D-Editor-Vertrag;
- Motion-Katalog-/LocomotionSet-Vertrag;
- ChoreographyRecipe;
- Clay-VFX-Eventvertrag;
- Grounding-/Shadow-Vertrag.

Nicht in diesem Job bauen:

- Graveyard-Szene oder Dancing-Skeleton-Content;
- Resident-Atlas-Navigation;
- Friedhof-PathBand;
- neue Resident-Szenen als Atlas-Seiten;
- zweites ToolBox-Shell-Design.

## Verbindliche Quellen

### UI-/Funktionsdonor

Bestehendes Claude-Design-Projekt **KFB ToolBox Production-05**. Bestehende Studio-, Anim-, Rigging- und Library-Funktionen erhalten; kein Neustart und kein neues Shell-Design.

### Motion Library v5 · exakter Source Lock

Branch und Head:

`georg-doc-patch-3@95a8197c76c2bae4d12bfc867d54debe15ffc1f2`

Relevante Quellen:

- `media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json`
- `media/3D_Assets/Animations/KFB_Motion_Library/RETURN_INTAKE_05.md`
- `media/3D_Assets/Animations/KFB_Motion_Library/libs/`
- `media/3D_Assets/Animations/KFB_Motion_Library/sheets/`
- `skills/chat/workflows/KFB_CHOREO_LAB_01_2026-09-29/`

Verbindlicher Stand:

- Katalogversion `2026-09-29b`;
- 345 eindeutige Clips;
- Rig_Medium und Rig_Large;
- 79 neue Clips aus Intake 05;
- 27 Dubletten bewusst ausgelassen;
- sieben kataloggetriebene `locomotionSets`:
  - `male_basic`
  - `female_basic`
  - `magic_caster`
  - `drunk`
  - `carry_box`
  - `carry_holding`
  - `wheelbarrow`

### Claymation-Donors · nicht neu interpretieren

1. **H0 Hirnwelt** besitzt Art Direction, Clay-Diorama-Grammatik und Fassaden-/Formensprache:
   `tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/`
2. **K2 Knet-Werkzeuge** besitzt Material- und Werkzeugbaukasten:
   `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 v2/KFB_CLAYMATION_K2_KNET_WERKZEUGE_2026-09-28/`
3. **T3/T4** liefern World-/Track-Komposition und Clay-Partikel:
   `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 - TUNE/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/`
   und T4 auf `coworker/clay-city-mvp-01-2026-09-28@939224c051afb464c553ff6f9b59609503eb1b49`.
4. **Skydome-Donor:** `travel/travel-v16/terrain-v16/skydome-shader.js`.

H0 bestimmt den Look, K2 Material/Werkzeuge, T3/T4 Welt/VFX und Production-05 die UI-Shell. Keine ähnliche Eigenimplementierung.

## Auftrag A · Animation Library v5

Die Library ist kataloggetrieben. Keine zweite handgepflegte Clip-Liste.

Pflicht:

- alle 345 Clips auffindbar;
- Suche und Live-Filter für Set, Rolle, Gruppe, Tags, Rig, Geschwindigkeit, Loop/One-shot, Kurvenbewegung, Props, Varianten, Resident-Ideen, Combat und Reaction;
- kompakte animierte Preview-Karten;
- großer 3D-Preview;
- Character-/Rig-Auswahl;
- redaktionelle Namen, Tags, Kommentare, Resident-Zuordnung und Signature Moves;
- additive JSON-Import-/Exportdaten, ohne den kanonischen Katalog still im Browser zu überschreiben;
- Drop-Zone für lokale FBX/GLB-Vorschau als Intake, nicht als automatische Aufnahme in die kanonische Library.

Bekannte Intake-05-Mängel sichtbar erhalten:

- `female_left_turn_b` und `female_right_turn_b` drehen nicht; nie als Default wählen, stattdessen `_a`;
- `kfb_locomotion_standing_walk_forward_a` ist Caster/Magic, kein Waffen-Walk;
- nicht saubere Loops, Kurven und One-shots markieren;
- Drunk-Idles brauchen Loop-Übergang;
- Box, Schubkarre, Handy, Gießkanne, Pflanze, Setzling und Tür fehlen in Motion-GLBs und benötigen echte Asset-/Socket-Zuordnung;
- Farming-Kniekontakte besitzen noch kein Ground IK;
- Survivalist und Skinning-Test sind keine Clips.

## Auftrag B · Locomotion-Set- und State-View

Neben Einzelclips gibt es eine Set-Ansicht, direkt aus `locomotionSets`.

Zeige pro Set:

- vorhandene Rollen wie Idle, Start, Walk, Run, Strafe, Turn, Stop und Jump;
- fehlende Rollen;
- gemessene Geschwindigkeit pro Rig;
- Prop-Anforderungen;
- Loop-/Kurvenstatus.

Abspielbare Zustandsfolge:

`idle → start → walk/run → turn → stop`

Root Speed, sichtbare Schrittlänge und Playback Rate gemeinsam beurteilen. Kein Foot Sliding durch beliebiges Beschleunigen. Richtungswechsel, Übergänge und Motion States müssen als zusammenhängendes Spielgefühl prüfbar sein.

Resident-Profile können später ein komplettes Locomotion Set plus Overrides für Signature Walk, Idle, Talk, Reaction und Special Move speichern. Das Studio exportiert diesen Vertrag; es wird nicht selbst zur World-Runtime.

## Auftrag C · ein vollständiger Standard-Inline-Editor

Der bereits begonnene 3D-Editor wird zu einer wiederverwendbaren Standardkomponente, nicht zu einer Studio-Sonderlösung.

Primärer Edit-Owner ist ein kompaktes Mini-Menü am ausgewählten Objekt mit:

- Verschieben;
- Drehen;
- Skalieren;
- Welt/Lokal;
- Raster;
- Absetzen/Boden;
- Fokus;
- Rückgängig/Wiederholen;
- Auswahl schließen.

Zusätzlich genau ein einklappbarer Inspektor für Details. Keine doppelten Paletten, keine langen Statuslabels im Sichtfeld, kein redundantes Button-System.

Drei unabhängige Snap-Modi:

- **Grid**
- **Connector**
- **Mount**

Mount nutzt gemessene Rig-Anker und zeigt Rig-Kompatibilität, Achse und Outside-Fist-Offset. Abgelehnte Snaps erklären kurz den Grund.

Das Ergebnis exportiert den Editor-Vertrag so, dass Resident Atlas ihn später konsumieren kann. Das Resident-Projekt wird hier nicht nachgebaut.

## Auftrag D · Claymation Studio und Diorama

Zwei Ansichten derselben Auswahl/Animation:

1. **Studio:** ruhige technische Prüfung von Rig, Kontakt, Clipping und Events.
2. **Clay-Diorama:** visuelle Produktionsprüfung in der echten KFB-Clay-Welt.

Clay-Diorama-Pflicht:

- H0/K2/T4-Look tatsächlich rendern;
- kolorierter Character/Resident, kein weißes Prüfmodell;
- Clay-Terrain, mindestens ein weiterer Resident und reale Props;
- Skydome mit `day / evening / night-space / basic`;
- Qualitätsstufen `off / basic / full`;
- T4-Clay-Partikel optional bei Footstep, Jump, Land, Impact und Prop-Kontakt;
- keine graue Rasterfläche als einzige Produktionsansicht.

Grounding-/Shadow-Gate:

- sichtbare Oberfläche, Fuß-/Snap-Kontakt und Shadow Receiver verwenden dieselbe finale Oberflächenhöhe;
- genau ein Schattenvertrag pro Objekt;
- keine abgelösten Schattenflecken, dunklen Streifen, Doppelschatten, schwebenden Füße, Z-Fighting- oder Terrain-Clipping-Artefakte;
- Prüfung auf flachem Terrain, Hang und Naht;
- Prüfung während Walk, Turn, Jump und Land;
- Beauty-, Shadow-off- und Receiver-/Kontakt-Diagnose.

Motion v5 gilt erst als im Studio integriert, wenn `female_basic`, `magic_caster`, `drunk` und ein Carry-Set in dieser Ansicht korrekt laufen.

## Auftrag E · Choreography View und Clay VFX

Ein Mehr-Actor-Modus derselben ToolBox-Arbeitsfläche mit:

- Body-, Face/Emotion-, Prop-, Event- und VFX-Tracks;
- Eyes, Eyebrows, Clay-Eyelids und Mouth/Face getrennt vom Body-Clip;
- Play, Pause, Scrub, Loop und Marker;
- Rig_Medium-/Rig_Large-Fitstatus;
- JSON Import/Export für `ChoreographyRecipe`;
- Attack/Reaction-Synchronisation;
- Prop- und Socket-Zuordnung;
- Geschenk, Debatte und Rauferei als abspielbare Beispiele, nicht als Standbildstreifen;
- Speaker Corner, Kartenerklärung und `Show it / Spin it / Sell it` als kurze Rezeptbeispiele.

Gemeinsame VFX-Events:

- `footstep`, `jump`, `land`;
- `brickfish_throw`, `brickfish_hit`, `melee_hit`, `wrestling_impact`;
- `gift_open`, `gift_burst`, `prop_break`, `reassemble`;
- `vehicle_contact`, `collision`, `explosion`.

Basis sind kleine Knetkügelchen/-flocken. Comic-Starburst, Ring/Flash und Rauch bleiben optionale additive Layer. VFX besitzen kein Gameplay-Timing und bestimmen weder Hit noch Damage.

## UI-Leitplanken

- bestehende Production-05-Shell behalten;
- ruhige helle ToolBox-Arbeitsfläche und abgerundete Panels;
- 3D-View bleibt Hauptfläche;
- kleine Statusicons statt `PROVEN`-Plaketten;
- keine grauen Seitenstreifen oder flackernde Nachbarframes in Preview-Karten;
- keine Metadaten-Dauerwand;
- keine neue Navigation und kein zweites ToolBox-Design;
- Narrow View: Inspektor als Sheet/Drawer.

## Abgabe

Vollständiger Session Cut mit:

- editierbarem ToolBox-Artefakt;
- 345-Clip-Library und sieben Set-Ansichten;
- vollständigem Inline-Editor;
- Studio- und Clay-Diorama-Ansicht;
- funktionierendem State-/Locomotion-Preview;
- Choreography View;
- JSON-Verträgen;
- Intake-Drop-Zone;
- Screenshots/Beweisbildern;
- `START_HERE.md`;
- `RETURN.md` problems first;
- `SOURCE.json` mit exakten Pins;
- `TEST_REPORT.md`;
- Checksummen;
- genau einem nächsten Gate.

PASS nur, wenn:

1. die 345 Clips und sieben Sets wirklich kataloggetrieben geladen werden;
2. der Editor vollständig und nicht doppelt ist;
3. Clay-Diorama, Skydome, Props und mindestens zwei Residents sichtbar sind;
4. die vier Pflichtsets korrekt gegroundet laufen;
5. bekannte Intake-Mängel nicht kaschiert werden;
6. Geschenk, Debatte und Rauferei abspielbar sind;
7. das Resultat klar das ToolBox-Projekt bleibt und nicht den Resident Atlas ersetzt.

Budget: ein Designpass plus ein begrenzter TUNE-Pass. Keine dritte Neugestaltung.
