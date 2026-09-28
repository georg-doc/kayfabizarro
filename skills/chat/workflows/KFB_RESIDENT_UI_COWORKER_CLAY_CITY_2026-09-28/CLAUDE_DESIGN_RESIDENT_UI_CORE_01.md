# Claude Design · RESIDENT-UI-CORE-01


## Auftrag

Entwirf für einen frischen Claude-Design-Chat genau eine integrierbare Neufassung des **Resident Atlas UI** im aktuellen, freigegebenen **KFB ToolBox Design**.

Dies ist ein UI-/Interaction-Design-Job. Keine neue Runtime, kein neuer Atlas, kein neues ToolBox-Shell-Design und kein GitHub-Job.

## Eingabepaket

Lies zuerst aus dem öffentlichen GitHub-Stand:

1. `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-09-28_r1/START_HERE.md`
2. dort `RETURN.md`, `TEST_REPORT.md`, `SOURCE.json`
3. `KFB_Resident_Atlas_S11.html#__graveyard`
4. `lib/edit-layer.js`
5. `data/graveyard-01.json` und `lib/graveyard.js`
6. den aktuellen KFB ToolBox Production-05 Session Cut und die Animation-Library-UI als Designreferenz, nicht als zu kopierende Funktionsliste

GitHub main ist beim Briefing `51f9bc22596a0d0165f4da9e8e2ea14118466210`. Vor Beginn erneut prüfen.

Der S11-Export ist Content- und Funktionsdonor. Seine UI ist keine akzeptierte Gestaltungsvorlage.

## Negativreferenz · verbindlich

Im Graveyard-Edit-Modus konkurrieren derzeit drei Oberflächen für dieselbe Aufgabe:

1. ein großes dunkles Objektfenster links oben;
2. das schwebende Inline-Mini-Menü am ausgewählten Objekt;
3. der komplette rechte Bereich `STUDIO · ANFASSER` mit denselben Transform-Funktionen und langen Messlisten.

Zusätzlich steht dort `GOTH GIRL`, obwohl der aktive Kontext Graveyard/Dancing Skeletons ist. Das ist ein Kontext-Leak.

Dieses Muster ist ein **UI FAIL**. Es darf nicht verfeinert oder dekoriert, sondern muss auf eine klare Zuständigkeit reduziert werden.

## Zielbild

### Ein Edit-Owner

Das kleine Inline-Menü am selektierten 3D-Objekt ist der primäre Edit-Owner.

Es enthält konsistent und vollständig:

- Verschieben;
- Drehen;
- Skalieren;
- Welt/Lokal;
- Raster an/aus;
- Absetzen/Boden;
- Fokus;
- Rückgängig/Wiederholen;
- Auswahl schließen.

Icons brauchen Tooltip und zugänglichen Namen. Keine tool-spezifische Schwundform; dieselbe vollständige Komponente wird in Resident Atlas, ToolBox Studio, Animation Library und später WorldBuilder wiederverwendet.

### Ein optionaler Inspektor

Ausführliche Zahlen, Pfad, Quelle, Bounds, Transformwerte, Bone-Referenz und Korrekturliste liegen in **einem einklappbaren Inspektor** hinter `i` oder `Details`.

Der Inspektor ist standardmäßig geschlossen und verdeckt den 3D-View nicht. Im offenen Zustand ersetzt er keinen Inline-Control und dupliziert keine primären Buttons.

### Kontext statt Leaks

- Graveyard zeigt `Friedhof`, `Dancing Skeletons`, Actor oder Requisite.
- Ghostville, Goth Girl oder andere Szenennamen erscheinen nur, wenn genau dieser Kontext aktiv ist.
- Die rechte Kontextpalette zeigt nur die Einstellungen des aktiven Modus.
- Moduswechsel Actor/Requisite/View/Edit bleibt sichtbar, aber kompakt.

### Sichtfeld vor Metadaten

- mindestens 70 % der nutzbaren Breite gehören auf Desktop dem 3D-View;
- keine große Statusplakette wie `PROVEN` im Sichtfeld; ein kleines grünes Häkchen reicht;
- keine Messdaten-Daueranzeige;
- keine doppelte Kopfzeile oder zweite Navigation;
- Narrow View: Inspektor als Sheet/Drawer, Inline-Menü bleibt am Objekt erreichbar.

## ToolBox-Design

Nutze das freigegebene aktuelle ToolBox-Design: helle, ruhige Arbeitsfläche, abgerundete Panels, kompakte Segmente, KFB-Farben und klare Hierarchie. Keine Rückkehr zum schwarzen/gelben Legacy-Graveyard-Chrome. Inhalt kann Halloween-Farbe tragen; das Werkzeug bleibt ToolBox.

## Inhaltsschutz

Unverändert erhalten:

- vier Dancing Skeletons;
- acht Takte Tanz, Takt 9 Zerfall, Takt 10 Zusammensetzen;
- fliegende Knochen und Kollisionen als schaltbare Szeneoptionen;
- Gate- und Audio-Funktionen;
- aktuelles Resident-/Motion-/Scene-Ownership;
- vollständiger 3D-Inline-Editor-Vertrag.

Keine neue Tanzlogik, kein neues Rigging, keine neuen Halloween-Assets und keine Reparatur des Content-Packs in diesem Job.

Hinweis: Die Aussage des S11-Snapshots `PR #279 defekt` ist überholt. Für vollständige Halloween-GLBs gilt aktuell PR #279 @ `10a2c5e29bf752215dadb60b23f07253f63e9d34`; GitHub erneut prüfen.

## Abgabe

Liefere ein vollständiges, herunterladbares Session-Paket mit:

- interaktivem HTML-Artefakt im aktuellen ToolBox-Design;
- Desktop- und Narrow-Ansicht;
- den vier Zuständen View, Actor, Requisite, Edit;
- sichtbarem kompletten Inline-Menü;
- offenem und geschlossenem Inspektor;
- `RETURN.md` problems first;
- `SOURCE.json` mit exakten Pins;
- `TEST_REPORT.md`;
- editierbarem Quellstand und Checksummen;
- genau einem nächsten Gate.

Claude Design soll **nicht** committen, pushen, einen PR eröffnen oder den Hub pflegen. Das Paket wird über den KFB Production Inbox Upload oder als vollständiger Download an einen GitHub-fähigen Empfänger zurückgegeben.

Bevorzugte Ausführung: Claude Design Desktop, damit das vollständige Session-Paket lokal geladen, getestet und geschlossen exportiert werden kann. Desktop-Nutzung ändert nichts an der GitHub-Grenze: ohne verifizierten Connector keine Push-/PR-Aufträge.

## Prüfung

PASS, wenn Georg in Graveyard Edit sofort erkennt:

1. welches Objekt ausgewählt ist;
2. wie es verschoben, gedreht, skaliert und abgesetzt wird;
3. wie Detaildaten ein- und ausgeblendet werden;
4. dass kein zweites oder drittes Panel dieselbe Aufgabe beansprucht;
5. dass der 3D-View die Hauptfläche bleibt.

Budget-Stopp: ein Designpass plus ein klar begrenzter UI-TUNE-Pass. Keine dritte Neugestaltung.
