# Ablage, Dateigröße und Quellenrechte

## Kanonische kleine Ablage auf GitHub

GitHub enthält:

- `SOURCE.md` mit Original-URLs, Versionen und geprüftem Umfang;
- `VIDEO_FINDINGS.md` mit verständlichen Ergebnissen;
- `video-evidence.json` nach dem gemeinsamen Schema;
- höchstens einen komprimierten Kontaktbogen pro Thema;
- optional eigene Diagramme oder Zustandskarten;
- `RETURN.md` mit dem nächsten Executor.

Zielgröße des gesamten Returns: unter 10 MB. Keine ZIP-Datei, wenn dieselben Dateien direkt im Ordner lesbar abgelegt werden können.

## Umgang mit Video-Screenshots

Die Videos bleiben Eigentum ihrer jeweiligen Urheber. Screenshots dienen ausschließlich als kleine, kommentierte Recherchebelege.

- keine vollständigen Videos oder Audiotracks speichern;
- keine langen oder hochfrequenten Bildfolgen;
- nur die zur Analyse notwendigen Einzelbilder;
- Bilder verkleinern und als WebP oder JPEG speichern;
- Creator, Videotitel, URL und Zeitmarke direkt zuordnen;
- `REFERENCE_ONLY · NOT A RUNTIME ASSET` deutlich vermerken;
- Screenshots niemals in das Spiel, eine Marketingfläche oder einen Asset-Pool übernehmen.

Wenn öffentliche GitHub-Ablage für eine Quelle ungeeignet ist, enthält GitHub nur Zeitmarken und Beobachtungen. Der kleine Bildbeleg kann dann als privates Production-Control-Artefakt gespeichert werden. Die GitHub-Dokumentation bleibt trotzdem vollständig genug, um Quelle und Befund wiederzufinden.

## Production Control

Production Control ist optionaler Spiegel für Status und private Bildbelege. Es ist nicht die einzige Quelle. Scheitert der Connector, endet der Job nicht in einer Push-/Timeout-Schleife: GitHub-Return fertigstellen, Connector als `UNKNOWN` markieren und stoppen.

## Übergabe an Blender und Claude

Blender MCP und Claude Design bekommen einen direkten GitHub-Link zum Return. Es gibt keinen manuellen Dropbox-Zwang. Falls Blender lokale Bilder benötigt und sie nicht öffentlich abgelegt werden dürfen, wird genau ein kleines Evidence-Paket aus dem privaten Artefakt geladen; keine Session-Cuts und keine 50-MB-Exports.
