# KFB 3D Mini-Game Hub · Baukasten- und POC-Briefing

## CURRENT CORRECTION · 2026-09-19 · Visible briefs, C0 recovery, Raid order

The Hub now exposes a dedicated **Briefings** filter. “Today” remains intentionally compact; it is not the full briefing catalogue.

- C0 is retained as a documented **GEORG VISUAL REVIEW FAIL** recovery record, not a default execution brief. The Asset Librarian is the only shared discovery surface.
- Combat CA2 actor/enemy proof precedes the productive KayKit Dungeon Raid; Dungeon owns rooms/spawns only, Arena owns combat.
- Tiny Treats Bakery/Kitchen generation is separate from Dungeon.
- EyeRig Batch is a named ToolBox slice with its own current entry and public candidate.
- KFB Ink/cartoon mechanics consume the existing Ink canon and TE-01 candidate rather than introducing a new outline system.

Status: **BRIEFING CURRENT · UMSETZUNG NOCH NICHT GESTARTET**  
Datum: 2026-09-19  
Auftraggeber: Georg / KFB  
Arbeitsweg: ChatGPT Web + GitHub-Sync  
Koordination: `skills/chat/START_HERE.md` und `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`

## CURRENT OVERRIDE · 2026-09-19 · Welt zuerst, Generatoren vorbereitet

Die verbindliche Reihenfolge ist jetzt:

1. [Racetrack World Look + 3D HUD v1](../RACETRACK_WORLD_LOOK_AND_3D_HUD_V1_2026-09-19/START_HERE.md) — **P0**. Aktuelle OSM-Fahrprobe, Track, Tiny-Skies-/Travel-Gestaltungsgrammatik, KayKit/Kenney-Rollen und das neue eigene 3D-HUD in einem kleinen messbaren Look-Vertrag bündeln.
2. [Asset Librarian × Tiny Treats · Discoverability Recon](../ASSET_LIBRARIAN_TINY_TREATS_RECON_V1_2026-09-19/START_HERE.md) — **P0-Gate für C0**. Charming Kitchen ist im Register, muss aber ohne Slug-Wissen gefunden werden. Librarian bleibt die eine Bibliothek; ToolBox/C0 sind Konsumenten.
3. **C0 Baukasten** — erst danach den verständlichen, gemessenen Rollen-Katalog aus Registry/Librarian aufbauen; keine Parallelbibliothek.
4. [Babel Tower S2b → Hex Platform Generator](./BABEL_HEX_PLATFORM_GENERATOR_V1_BRIEF.md) — **P1**. S2b-Quelle sichern, drei echte Hex-Verbindungen beweisen, dann einen kleinen Turm-Recipe-Generator.
5. [Combat Arena Integration v2](./COMBAT_ARENA_INTEGRATION_V2_BRIEF.md) — vorbereitet, aber nicht vor Welt/Race/C0 starten.
6. [Dungeon Generator v2](./DUNGEON_GENERATOR_V2_BRIEF.md) — Side Quest; vorhandenen stabilen Generator weiterbauen, nicht neu erfinden.

Der allgemeine [Hex Terrain Generator v1](./HEX_TERRAIN_GENERATOR_V1_BRIEF.md) bleibt als Modulbibliotheks-Grundlage erhalten. Der neue Babel-Brief ist sein konkreter Plattform-/Turm-Consumer.

Alle Mini-Game-Portalideen bleiben späterer Integrationsvertrag. Sie koppeln jetzt weder Race/Travel noch Spiel-Runtimes direkt.

## 1. Ziel in einem Satz

Wir bauen keinen neuen Universal-Editor, sondern eine verständliche, messbare Bauteil-Bibliothek und daraus drei kleine, getrennt testbare Spielproben für den späteren begehbaren KFB Hub:

1. Dungeon mit ausgebauten Räumen und Requisiten,
2. Hex-Plattformwelt aus den beiden KayKit-Hex-Baukästen,
3. Combat Arena als begehbares Plattform-Level mit der vorhandenen Kampflogik.

Jede Probe bleibt einzeln startbar, bekommt eine eigene Stage-Adresse und kann später über ein In-Game-Objekt oder Portal aus dem KFB Hub geladen werden.

## 2. Zwei verschiedene Dinge, die nicht vermischt werden dürfen

- **KFB Production Hub**: die Webseite mit To-dos, Briefings, Stage-Links und Projektübersicht.
- **KFB 3D Mini-Game Hub**: die spätere begehbare Spielwelt, aus der Dungeon, Hex-Welt und Combat Arena als eigene Spiele/Level geöffnet werden.

Die Webseite koordiniert. Die Spielwelt spielt. Die Webseite wird nicht zum neuen Game-Runtime-Owner.

## 3. Verbindliche Reihenfolge

### C0 · Katalog und gemeinsame Sprache

Zuerst wird ein kleiner, visueller Katalog gebaut. Er erklärt die vorhandenen Packs so, dass ein neuer Web-Chat nicht wieder aus Dateinamen, Vorschaubildern und Größen raten muss.

Danach dürfen die drei Spielproben unabhängig und bei Bedarf parallel laufen:

- D01 · Dungeon-Zimmer
- H01 · Hex-Plattform
- C01 · Combat-Plattform-Level

Parallel bedeutet: getrennte Branches, getrennte Stage-Adressen, getrennte Rückgaben. Es bedeutet nicht, dass drei Chats dieselben Dateien überschreiben dürfen.

## 4. Das einfache Baukastenmodell

Die Rollen sind wichtiger als die Pack-Namen:

| Rolle | Erste Quelle | Bedeutung |
|---|---|---|
| **trägt** | Kenney Platformer Kit; KayKit Dungeon; KayKit Medieval Hexagon/Builder | Boden, Wände, Treppen, Plattformen, Kollision, erreichbare Wege |
| **erzählt** | Tiny Treats | Kleine Szenen, Innenräume, Läden, Pflanzen, Park, Picknick, Bad; zunächst ohne Kollision |
| **bewohnt** | KayKit Mystery Series 6 + Resident Scene Modules | Bewohner, Aktivitäten, kleine Szenen; keine eigene Weltphysik |
| **handelt** | FrizzleBob Driver Graft + Combat Arena | Spielerfigur, Animation, Waffe und bestehende Kampflogik |
| **verbindet** | Hub-Portale, Karten, Props und Stage-Links | Wechsel zwischen Hub und eigenständigen Minigames |

### Tiny Treats ist ausdrücklich Teil von C0

Die C0-Lane umfasst jetzt acht Tiny-Treats-Pakete. Sechs sind bereits im bisherigen Register; Baked Goods ist auf GitHub und Charming Kitchen 1.1 wurde am 19.09.2026 als vollständiger CC0-Bestand auf `main` aufgenommen:

- Pretty Park — 28 GLTF-Modelle
- Pleasant Picnic — 41 GLTF-Modelle
- Homely House — 27 GLTF-Modelle
- Bakery Interior — 114 GLTF-Modelle
- House Plants — 113 GLTF-Modelle
- Bubbly Bathroom — 84 GLTF-Modelle
- Baked Goods — 32 GLTF-Modelle; kleine Backwaren-/Auslagenfamilien
- Charming Kitchen 1.1 — 118 GLTF-Modelle; modulare Küchenwände, Schränke, Arbeitsflächen, Geräte, Tische, Stühle und Utensilien

Wichtig: Bakery, Bathroom, House Plants und Charming Kitchen enthalten auch zusammengehörige Wand-/Boden-/Innenraumteile. Sie dürfen nicht automatisch wie lose Dekoration verstreut werden. Pretty Park besitzt ebenfalls eigene Bodenteile. Erst katalogisieren und messen, dann entscheiden, ob ein Teil nur erzählt oder auch tragen darf.

Der Recovery-Export enthält für Tiny Treats einen **Kandidatenwert**: `door_modular` wurde von 2,80 auf ca. 2,05 Einheiten skaliert, also etwa Faktor 0,73. Das ist ein guter Startwert, aber noch keine globale Regel. Der aktuelle, gepinnte Asset-Stand muss neu gemessen werden.

### Plant Prop Lab als Scenery-Donor

Der aktuelle Donor liegt unter `tools/KFB-ToolBox/_inbox/KFB_Plant_Prop_Lab_v1/` (aktueller Export: Plant Prop Lab v2). C0 katalogisiert daraus belegte Pflanzenfamilien, Maßstab, Palette, Licht, Streuung und kleine Resident-Szenerien. Das Lab besitzt weder Weltgenerator noch Resident-Identität und kopiert keine Assets in eine zweite Library.

## 5. Was der Katalog pro Pack und Bauteil zeigen muss

Der Katalog ist ein Werkzeug, keine zweite Asset Library. Dateien werden nicht kopiert. Er liest das zentrale Register und verweist auf die vorhandenen Quellen.

### Pack-Ebene

- genauer Pack-Name und Version
- Quelle, Lizenz/Provenienz und aktueller GitHub-Pfad
- gepinnter Commit oder Digest
- Zahl und Format der Modelle
- Familien: Boden, Wand, Tür, Treppe, Prop, Bewohner, Gegner, Effekt usw.
- wofür das Pack geeignet ist: Dungeon, Hex, Combat, Hub-Szene
- bekannte Unsicherheiten und fehlende Abhängigkeiten

### Bauteil-Ebene

- exakter Pfad und Dateiname
- Vorschaubild und drehbare Einzelansicht
- Maße, Bounding Box, Pivot, Unterkante und sinnvoller Größenanker
- Rolle: trägt / erzählt / bewohnt / handelt / verbindet
- Kollision: ja / nein / nur nach Prüfung
- Anschlusskanten oder Rastermaß
- Material- und Texturzuordnung
- Animation/Rig-Familie, falls vorhanden
- bewährte Nachbarn und ungeeignete Kombinationen
- Belegstatus: nur gefunden / gemessen / im Browser gesehen / im Spiel getestet / von Georg akzeptiert

### Bedienung

Der kürzeste Weg soll sein:

`Pack → Familie → Bauteil → Messbeleg → verwendbar in Dungeon / Hex / Combat`

Der Katalog soll außerdem zwei kleine Dateien exportieren können:

- eine **Scene Recipe** mit bewusst gesetzten Teilen,
- ein **Module Manifest** mit Quellen, Maßen, Rollen und Status.

Unbekanntes bleibt sichtbar unbekannt. Es wird nicht durch Schätzwerte kaschiert.

## 6. Was aus dem Failure-Recovery-Export übernommen wird

Der komplette lokale Export wurde als Recovery-Beleg geprüft; seine gelisteten SHA-256-Prüfsummen stimmen. Details stehen in `FAILURE_EXPORT_INTAKE.md`.

### Behalten und als Donor nutzen

- Inventar einsammeln, Duplikate erkennen und Familien bilden
- Loader-Warmup und Texture-Folding
- Maße, Bounding Box, Basis und Dreieckszahl ermitteln
- Raster-, Kanten- und Verbindungslogik aus `hex-grid.js`
- kleine Kontakt-/Proof-Sheets
- sechs Kameramodi als Bedien-Donor
- bestehender FrizzleBob-Graft und Host-Animation
- Sprungreichweite, Landekontakt und Turmhöhen messbar machen
- Teile zuerst nach Pack-Familie ordnen, danach messen

### Nicht übernehmen

- den großen automatisch erzeugten Insel-Entwurf
- `planPlatform()` / `buildPlatform()` als Ganzes
- Blob-, Ring-, Spine- und Star-Regeln des fehlgeschlagenen Generators
- die monotone Höhen-/Padding-Logik
- die automatische Diorama-Komposition aus `diorama.js`
- ungeprüfte Namensfilter für Steine und Pfade
- die Annahme, ein Kommentar oder Tag sei bereits sichtbares Storytelling

### Neue Arbeitsregel

**Erst ein einziges, kleines, bewiesenes Bauteil; erst danach ein Generator.**

Wenn dasselbe Prüfkriterium nach zwei Reparaturen nicht grün ist: stoppen, exportieren, Rückgabe schreiben. Kein dritter Blindflug im selben Chat.

## 7. Gemeinsame Modulgrenzen

### Welt/Level besitzt

- Boden, Wände, Kollision und begehbare Wege
- Kamera- und Startpunkt
- Portale/Ein- und Ausgang
- Speichern des Levelzustands

### Resident Scene Module besitzt

- seinen Bewohner und seine kleine Aktivität
- `mount`, `update`, `dispose`
- sichtbare Support-/Activity-Hinweise

Es besitzt nicht Boden, Spielerbewegung, Kamera, Fortschritt oder globale Speicherung. Der Level-Consumer baut die Trägerfläche und setzt das Resident-Modul oben mittig darauf.

### FrizzleBob besitzt

- Actor-/Graft-Aufbau über `mountGraft()`
- Driver-Graft-Vertrag `contracts/kfb-pet-graft-driver.v4.json`
- genau einen Animationsmixer beim Host

### Combat Arena besitzt

- Treffer, Schaden, Gegnerzustand, Belohnung und vorhandene Kampfregeln

Der neue Plattform-Level darf diese Logik verwenden, aber keine zweite Kampflogik erfinden.

## 8. D01 · Dungeon mit zwei ausgebauten Räumen

### Bestehender Owner und Donor

- Werkzeug-/Autorenlogik: `tools/world_atlas/`
- Startdonor: `tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html`
- Rasterdonor: `tools/world_atlas/source/lib/dungeon-grid.js`
- Asset-Quelle: `kaykit-dungeon-pack-1-1-free-2`

Der aktuelle Register-Snapshot nennt 207 3D-Modelle und 20 PNG-Dateien. Vor Ausführung auf dem aktuellen Commit erneut prüfen.

### Erste spielbare Probe

Eingang → kurzer Flur → Raum A → Raum B → Ausgang.

- Raum A: klar lesbarer Aufenthalts-/Bewohnerraum
- Raum B: klar lesbarer Zweck, z. B. Schatz, Archiv oder Werkstatt
- 6–12 bewusst gesetzte Requisiten, davon einige Tiny Treats
- ein Resident Scene Module
- Türen und Flur bleiben frei
- begehbarer Boden und saubere Wandkanten
- Scene Recipe kann exportiert und wieder geladen werden
- kein Kampf in D01

### Prüfkriterien

- keine Wandlücken oder doppelten Wandstücke
- alle tragenden Teile haben Bodenkontakt
- Türöffnung bleibt mit aktuellem Actor passierbar
- Requisiten blockieren den Weg nicht
- Start, beide Räume und Ausgang sind erreichbar
- Desktop und Mobil-Browser laden über die feste Stage-Adresse
- Screenshot von oben, aus Spielerhöhe und aus einer Ecke pro Raum

### Vorgeschlagener Branch und Stage-Ort

- Branch: `chatgpt-web/dungeon-d01-2026-09-19`
- Stage: `/kfb-hub/stage/minigames/dungeon-d01/`

## 9. H01 · Hex-Plattform und Babel-Mikroturm

### Quellen

- `kaykit-medieval-hexagon-pack-1-0-free` — Register-Snapshot: 221 GLTF-Modelle
- `kaykit-medieval-builder-pack-1-0` — Register-Snapshot: 226 GLB-Modelle
- Raster-/Kanten-Donor aus dem Recovery-Export und vorhandenen ToolBox-Inbox-Quellen

### Gate H01a · exakt drei Teile

Noch kein Generator. Baue nur:

- zwei benachbarte Teile auf Höhe 0,
- ein direkt angrenzendes Teil auf Höhe 1.

Messvorgabe aus dem Recovery-Export, erneut gegen den aktuellen Packstand prüfen:

- Spaltenabstand 2,0
- Reihenabstand 1,732
- Reihenversatz 1,0
- Toleranz 0,02

Bestehen muss:

- exakter Rasterkontakt,
- keine Überschneidung außer erlaubtem Grasüberhang,
- kein schwebendes Trägerteil,
- Belegbilder von oben, Seite und schräg oben.

Wenn H01a scheitert: stoppen und Rückgabe schreiben. Nicht im selben Lauf eine Insel bauen.

### Gate H01b · bewusst gebauter Babel-Mikroturm

Erst nach H01a:

- 8–14 bewusst gesetzte Stufen/Plattformen
- normale Sprünge klar von Doppelsprüngen unterscheiden
- jede Landefläche mit Kontaktbeleg
- ein Start, ein Ziel, ein Rettungspunkt
- Sprungbögen sichtbar zuschaltbar
- Tiny Treats nur als gezielte Szenenpunkte, zunächst ohne Kollision

Der Screenshot des früheren Babel-Turms zeigt brauchbare Messideen (direkte Stufen, Doppelsprünge, unerreichbare Stufen, Kontaktzahl). Seine konkreten Reichweitenwerte sind Donor-Beleg, keine aktuelle Physikregel. Mit dem aktuellen Actor neu messen.

### Gate H01c · kleiner Generator

Erst nach Georgs Sichtprüfung von H01b darf ein kleiner Generator aus **bewiesenen Modulen** entstehen. Er variiert Reihenfolge und Höhe, aber nicht die gemessenen Anschluss- und Sprungregeln.

### Vorgeschlagener Branch und Stage-Ort

- Branch: `chatgpt-web/hex-h01-2026-09-19`
- Stage: `/kfb-hub/stage/minigames/hex-h01/`

## 10. C01 · Combat Arena als Plattform-Level

### Owner

Implementierung ausschließlich in `georg-doc/KFB-Combat-Arena`.

Die aktuelle 5A/A1-Arena bleibt die Quelle für Kampfregeln. A2-Karten und Driver Graft sind dort laut aktuellem Recovery-Stand noch nicht integriert. Diese Arbeit darf das nicht stillschweigend als erledigt markieren.

### Erste spielbare Probe

Hub-Portal → Combat-Level betreten → über wenige Plattformen bewegen → einen KayKit-Gegner treffen und besiegen → Belohnung/Ergebnis sehen → durch Ausgang zum Hub zurück.

### FrizzleBob-Integration

- Driver Actor nur an der vorhandenen Actor-Montagestelle einsetzen
- Player/Host/Gunfight/Rewards bleiben ihre Besitzer
- genau ein Animationsmixer und ein Gesichtssystem
- die doppelte Boden-Korrektur zwischen Actor und Player ausdrücklich auflösen
- bestehende Mündung, Schuss und Release-Verträge erhalten
- Zielen/weitere Aim-Animation erst nach der ersten grünen Lauf-/Schussprobe

### KayKit-Gegner

Zuerst nur ein visueller Adapter auf einen vorhandenen Gegnertyp. Trefferpunkte, Schaden, Tod und Belohnung bleiben bei der Combat Arena. Das KayKit-Modell bringt nicht ungeprüft eine zweite Gegnerlogik mit.

### Prüfkriterien

- Einstieg, Laufen/Springen, Schuss, Treffer, Niederlage des Gegners und Ausgang funktionieren
- vorhandene Combat-Tests bleiben grün
- kein zweiter Boden-Writer, kein zweiter Mixer
- Actor, Waffe und Augen bleiben nach Respawn korrekt verbunden
- eine feste Stage-Adresse und Browser-Beleg
- A2-Karten bleiben außerhalb dieses Slices

### Vorgeschlagener Branch und Stage-Ort

- Branch: `chatgpt-web/combat-c01-platformer-2026-09-19`
- Stage im Combat-Projekt: `/slices/combat-platform-c01/`
- der KFB Production Hub verlinkt nur auf diese Stage; er kopiert den Combat-Code nicht

## 11. GitHub- und Rückgabe-Regel für jeden Web-Chat

1. aktuellen `main`-Stand und vollen Commit-SHA festhalten
2. die Projekt-/Tool-`START_HERE`-Datei lesen
3. genau einen der vier Aufträge C0, D01, H01 oder C01 übernehmen
4. eigenen Branch verwenden; keine direkten Änderungen auf `main`
5. eine feste Stage-Adresse bereitstellen
6. nur tatsächlich ausgeführte Tests als PASS nennen
7. folgende Rückgabe additiv ablegen:
   - `RETURN.md`
   - `SOURCE.json`
   - `TEST_REPORT.md`
   - 3–6 aussagekräftige Screenshots
   - additive `CHANGELOG.md`-Notiz
8. Pull Request öffnen, aber nicht automatisch mergen
9. offene Sichtprüfung und nächste sichere Grenze benennen

## 12. Starttexte für frische ChatGPT-Web-Chats

### C0 · Katalog

```text
Arbeite aus dem aktuellen GitHub-main von georg-doc/kayfabizarro. Lies zuerst skills/chat/START_HERE.md, skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md, skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md und skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/START_HERE.md vollständig.

Übernimm nur C0: einen kleinen visuellen Baukasten-Katalog für Kenney Platformer, KayKit Dungeon, KayKit Medieval Hexagon + Builder, alle acht Tiny-Treats-Pakete, KayKit Mystery Series 6, Resident Scene Modules und den FrizzleBob-Driver-Graft. Nutze das zentrale Asset-Register; kopiere keine Assets und erfinde keine zweite Asset Library.

Beweise zuerst je eine Familie für trägt, erzählt, bewohnt und handelt. Zeige Pfad, Quelle, Maße, Pivot/Unterkante, Größenanker, Kollisionsrolle, Vorschau und Belegstatus. Tiny Treats muss zwischen modularen Innenraumteilen und loser Szenendekoration unterscheiden. Nimm Baked Goods und Charming Kitchen 1.1 ausdrücklich auf; erfasse zusätzlich den Plant-Prop-Lab-Donor für Environment- und Resident-Szenerien. Unbekanntes bleibt sichtbar unbekannt.

Arbeite in einem eigenen Branch, stelle eine feste Stage-Adresse bereit und liefere RETURN.md, SOURCE.json, TEST_REPORT.md, Screenshots und additive Changelog-Notiz. Öffne einen PR, aber merge nicht automatisch.
```

### D01 · Dungeon

```text
Arbeite aus dem aktuellen GitHub-main von georg-doc/kayfabizarro. Lies skills/chat/START_HERE.md, skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md und das vollständige Briefing skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/START_HERE.md.

Übernimm ausschließlich D01. Verwende den bestehenden World-Atlas-Dungeon S13.2 und dungeon-grid.js als Donor. Baue eine kleine spielbare Folge Eingang → Flur → zwei bewusst eingerichtete Räume → Ausgang. Nutze 6–12 kuratierte Requisiten einschließlich passender Tiny-Treats-Teile und genau ein bestehendes Resident Scene Module. Kein Kampf und kein neuer Universal-Generator.

Beweise Wandanschlüsse, Bodenkontakt, freie Türen, erreichbaren Weg, Scene-Recipe-Roundtrip und Desktop/Mobil-Browser an einer festen Stage-Adresse. Arbeite in einem eigenen Branch und liefere RETURN.md, SOURCE.json, TEST_REPORT.md, Screenshots, additive Changelog-Notiz und PR ohne Auto-Merge.
```

### H01 · Hex

```text
Arbeite aus dem aktuellen GitHub-main von georg-doc/kayfabizarro. Lies skills/chat/START_HERE.md, skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md und das vollständige Briefing skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/START_HERE.md. Der lokale Failure-Export ist Beleg und Donor, keine Ausführungsanweisung.

Übernimm ausschließlich H01a: zwei benachbarte Hex-Teile auf Höhe 0 und ein angrenzendes Teil auf Höhe 1 aus den beiden KayKit-Hex/Builder-Packs. Nutze vorhandene Raster-, Mess- und Loader-Donors. Kein Generator, keine große Insel und keine automatische Diorama-Komposition.

Prüfe Rasterkontakt, Überlappung, Trägerkontakt und liefere Top-/Seiten-/Schrägansicht. Wenn dieses Dreier-Gate scheitert, stoppe nach maximal zwei Reparaturpässen und schreibe die Rückgabe; baue nicht weiter. Wenn es grün ist, bereite H01b nur als nächsten separaten Gate-Vorschlag vor. Eigener Branch, feste Stage, RETURN.md, SOURCE.json, TEST_REPORT.md, Screenshots, Changelog und PR ohne Auto-Merge.
```

### C01 · Combat

```text
Arbeite im aktuellen GitHub-main von georg-doc/KFB-Combat-Arena. Lies dort ChatGPT_web/START_HERE.md und _handover/C0_REENTRY/START_HERE.md sowie im Repo georg-doc/kayfabizarro das Briefing skills/chat/workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/START_HERE.md.

Übernimm ausschließlich C01: die vorhandene 5A/A1-Kampflogik in eine kleine begehbare Plattform-Level-Probe einbetten. Ziel: Einstieg → wenige Plattformen → einen vorhandenen Gegner mit KayKit-Visual besiegen → Ergebnis/Belohnung → Ausgang. Player, Host, Gunfight und Rewards behalten ihre Zuständigkeit. A2-Karten bleiben draußen.

Setze den FrizzleBob Driver Actor nur an der vorhandenen Montage-Naht ein, löse den doppelten Boden-Writer ausdrücklich und erzeuge keinen zweiten Mixer oder zweite Kampflogik. Nutze einen eigenen Branch, eine feste Combat-Stage-Adresse und liefere RETURN.md, SOURCE.json, TEST_REPORT.md, Screenshots, Changelog und PR ohne Auto-Merge.
```

## 13. Empfehlung für Georg

Am günstigsten ist diese Reihenfolge:

1. C0-Katalog als kurzer Web-Chat, damit alle weiteren Chats dieselben Teile verstehen.
2. H01a als sehr kleiner Vergleichstest gegen den gescheiterten Claude-Lauf.
3. D01, weil dort World Atlas und Dungeon-Grammatik schon am weitesten sind.
4. C01 zuletzt, weil Actor-, Boden- und Kampflogik dort mehr bestehende Besitzer berühren.

D01 und die Vorbereitung von C01 können parallel laufen, sobald C0 einen gepinnten Stand hat. H01 bleibt absichtlich klein, bis das Dreier-Gate und danach der bewusst gebaute Mikroturm sichtbar überzeugen.



## Verbindlicher Lieferweg

Alle C0-/Dungeon-/Hex-/Combat-Slices folgen `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`: kleine verifizierte GitHub-Checkpoints, direkte Cloudflare-Stage-Adresse, Hub-Link im selben Publikationsschritt und `UNKNOWN` statt Erfolgsbehauptung nach einem Timeout.
