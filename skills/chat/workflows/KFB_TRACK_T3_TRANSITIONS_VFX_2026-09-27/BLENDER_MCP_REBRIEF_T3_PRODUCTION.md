# Re-Briefing · Blender MCP · T3 Knetstrang Produktionskit B0

## Auftrag

Baue **keinen neuen Racetrack**. Überführe das akzeptierte T3-Design „Knetstrang“ in einen wiederverwendbaren, gemessenen Blender-Baukasten. Der erste Beweis ist genau ein mehrschichtiger **Track→City-Übergang**; danach dieselbe Anatomie für Pit Lane und Nature.

Arbeite ausschließlich aus GitHub. Lies zuerst `START_HERE.md` dieses Pakets und anschließend die dort verlinkten T3-, H0- und Blender-Quellen. Frühere Chats sind kein Input.

## Source Lock

- Repo: `georg-doc/kayfabizarro`
- Referenz-Commit: `692240b5b8c7b26369b4e4043a7df6d2939c6cbf`
- visuelle Basis: `KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27`
- technischer Anschlussdonor: `KFB Racetrack Blender Kit`
- T1/T2: nur Postmortem/technische Evidenz, **nicht** Look-Basis

Vor dem Bauen:

1. Öffne die tatsächliche T3-Bühne und zeige Fahrbahn, Knetstrang, Wulst und Stütze isoliert.
2. Öffne die bisherigen Blender-Trackmodule und miss Achsen, Breiten, Querschnitte und Anschlussnamen.
3. Schreibe eine kurze Source-Tabelle mit Dateipfad, Revision, gemessenem Maß und Rolle.

## B0 Ergebnis

Ein Blender-Paket `KFB_TRACK_T3_TRANSITION_KIT_B0` mit:

- einem 60–100-m-Track→City-Beispiel;
- modularen Layern für Fahrbahn, Markierung, Knetstrang/Bande, Bordstein, Bürgersteig und Naturkante;
- einer Nature-Kante mit Böschung/Graben und austauschbarem Zaun-Socket;
- reservierten, dokumentierten `pit_in`/`pit_out`-Sockets ohne ausmodellierte Boxengasse;
- Anschluss-Empties gemäß `TRANSITION_GRAMMAR_T3_V1.md`;
- sauber getrennten visuellen und optionalen einfachen Kollisionsflächen;
- Originalmaß, lokalem Ursprung, Achsen und Maßeinheit dokumentiert.

## Form

- T3 bleibt ein **zusammenhängender Knetstrang**: Kehle, Wulst, Bauch und tragende Cartoon-Stützen.
- Bandenübergang: hoher Prallwulst → niedriger, breiter Wulst → Bordstein/Böschung/Graben; nie ein senkrechter Schnitt.
- Bürgersteig: helle, leicht unregelmäßige Knetstein-Reihe mit klaren Fugen; die befahrbare Fläche bleibt plan.
- Markierungen: reale Kneteinlagen/Segmente, die räumlich gestaffelt auslaufen und neu beginnen; kein Textur-Fade.
- Pit Lane: echte Verzweigung mit eigener Lippe und Breite, keine aufgemalte Linie.
- Zaun/Natur: zunächst tatsächliche KayKit-/Tiny-Treats-Quelle isoliert, danach nur kontrolliert skalieren, biegen, umfärben oder weich in einen Knet-Sockel setzen.
- Stützen: Elefantenfuß, Taille, Bauch, Kapitell; hohe Bereiche doppelt oder mit Querträger, niemals dünne Stäbe.

## Performance- und Exportregel

Erst messen, dann optimieren. Der erste Return nennt für jedes Modul Dreiecke, Objekte, Materialien, Texturen und geschätzte Instanzzahl in einer 1-km-Strecke.

Zielkorridor für den ersten Versuch:

- wiederholbares 20–25-m-Grundmodul: höchstens ca. 12k Dreiecke;
- komplexes Abzweig-/Übergangsmodul: höchstens ca. 25k Dreiecke;
- LOD1 etwa 40 %, LOD2 etwa 10 % der Ausgangsgeometrie;
- wiederholte Bordsteine, Zaunpfosten, Pflanzen und Knetkügelchen als Instanzen;
- gemeinsame Materialfamilien statt eigener Textur pro Teil;
- keine eingebetteten 4K-Texturen, keine OBJ/FBX-Doppelpakete im Runtime-Export.

Wenn die echte T3-Quelle bereits teurer ist, dokumentiere die Abweichung und optimiere nicht blind unter Verlust der Form.

Export:

- editierbare `.blend`-Quelle;
- ein `.glb` je Modulgruppe;
- `transition-kit.v1.json` mit Maßen, Sockets, Materialrollen und LODs;
- Kontaktbogen/Render: Totale, Fahrperspektive, Fußperspektive, Unterseite/Anschlüsse, Graustufe;
- `SOURCE.json`, `RETURN.md`, additiver `CHANGELOG.md`.

## Nicht tun

- Keine neue Route, Physik, Kamera oder Runtime.
- Keine freihändige Fantasiearchitektur.
- Keine generischen rot-weißen Kerbs, Sticker, Pfeiltafeln oder schwarzen Metallgeländer.
- Keine große Geometrieverformung der Fahrfläche.
- Keine Neuinterpretation vorhandener KayKit/Tiny-Treats-Props ohne Source-Beweis.
- Keine Veröffentlichung/Promotion; der Output ist ein Produktionsdonor für die spätere Integration.

## Prüfung

1. Alle Sockets schließen positions- und tangentenstetig.
2. Fahr-/Kollisionsfläche hat keine Lücke, Doppelung oder Stufe.
3. Übergang ist über mehrere Layer versetzt und nicht an einer Querlinie sichtbar.
4. T3-Formensprache bleibt aus drei Kamerahöhen lesbar.
5. Source-Props sind vor und nach Anpassung nachvollziehbar.
6. Ein Export lässt sich in einer leeren Blender-Datei und in einem GLB-Viewer laden.

STOP nach B0 und Return. Keine Boxengasse, keine Auf-/Abfahrt, keine zweite Strecke und kein Runtime-Einbau in demselben Chat. Diese Formen folgen als eigener Design-/Blender-Job nach T4.
