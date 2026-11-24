# Aqua 1.0 · Backlog (23.11.2026, Stand Artefakt v73)

**Kurz:** Was noch offen ist, was Georg entscheiden muss und was das Spiel attraktiver machen könnte. Sortiert nach Wirkung. Die Reihenfolge der Bauaufträge legt WS0 fest, nach den Zielbildern.
**Stand:** Diese Nacht erledigt: Tür auf panel_wide ohne Glanz, Felder mittig im Glas; Fisch-Karte und Radio-Menü (Mixer, Playlist) auf Kit-Tafeln in Originalgröße. Die Handwerks-Prüfung ist in allen getesteten Größen grün. Die Erfassung aller sechs Läufe läuft auf v73.
**Zu prüfen:** Die Fragen in Teil B gehen an Georg. Teil C sind Vorschläge, nichts davon ist gebaut.

## A · Offen (bekannt, noch nicht gelöst)

| # | Punkt | Warum es zählt | Wer |
|---|---|---|---|
| A1 | **Hinweisleiste und Prompt-Leiste fehlen im Kit.** Bis dahin stehen dort reiner Text und die Taste daneben. | Der Hinweis unten ist auf jedem Bildschirm zu sehen. | WS0 über den Webchat, HUD-Blatt Familie F (FEHLT_IM_KIT.md) |
| A2 | **Glanz in den Tafeln:** panel_wide und panel_tall laufen im Kit-Bild hart aus. Ich nutze Fassungen ohne Glanz. | Im Kit-Blatt sollte der Glanz weich auslaufen, dann kann er zurück. | WS0, Familie F |
| A3 | **Figurenblatt (Character sheet)** ist noch ein flaches CSS-Panel. | Dritter Teil von Kritikpunkt 11, letzter flacher Kasten im Menü. | Aqua, nach Zielbild |
| A4 | **Pausenmenü fehlt** (Kritik 10). Zahnrad und Tab-Wechsel frieren das Spiel ein, ein eigenes Menü mit Weiter, Neustart und Hideout gibt es nicht. | Kollegen spielen zwischen zwei Terminen, Pause ist Pflicht. | Aqua |
| A5 | **Welt-Monitore im Kamerabild** (Kritik 19). Im Meer steht der Monitor im Weg, der eigene Fisch verdeckt den Monitortext. | Text unleserlich, auch im Becken (der Fisch sitzt beim Start vor dem Monitor). | Aqua |
| A6 | **Startbild unruhig** (Kritik 24). Bunter Hintergrund gegen Becken, Spruch klein. | Erster Eindruck. | Zielbild |
| A7 | **Handy: Treffflächen unter 40 px, kleine Schrift** (Kritik 25). Mixer und Fisch-Karte im flachen Querformat sind eng. | Viele Kollegen öffnen den Link am Handy. | Aqua, nach Zielbild |
| A8 | **Story-Seite fehlt:** Wer ist Falkenstein, was ist das Experiment, was verspricht ECHO, warum 4711. Dazu der GTA-Text-Durchgang über alle rund 500 Zeilen. | Die Kritiker lesen die Story nicht (Kritik 13). Texte sollen auf der Story aufbauen. | Georg + WS0, dann Aqua |
| A9 | **ECHO ohne Ton:** Seit die Untertitel-Plakette weg ist, sieht man ECHOs dringende Sätze im Meer nur mit Ton. | Kollegen spielen oft stumm im Büro. | Story-Schritt |
| A10 | **Falkenstein ist Platzhalter.** Rahmen, Timing und Einbindung stehen, der Inhalt wird ersetzt. | Bösewicht trägt die Story. | Georg (neues Skript/Video) |
| A11 | **Geteilte Hall of Fame** live im Artefakt mit Anmeldung testen. Im Prüflauf ist es immer „This browser only“. | Wettbewerb unter Kollegen lebt davon. | Georg testet |
| A12 | **Artefakt an der Größengrenze:** 250 von 256 MB, davon 190 MB Musik. Freigegeben: beim nächsten großen Zuwachs Playlist 128 kbps, Mixer 96 kbps, vorher A/B-Hörprobe. | Neue Assets (Wirbel, Videos) passen sonst nicht. | Aqua, wenn es so weit ist |
| A13 | **Retina:** Die Kit-Teile sind nur so groß, dass sie auf normalen Bildschirmen 1:1 sind. Auf Retina-Macs sind sie hochgerechnet. | Schärfe auf Georgs Mac und den meisten Kollegen-Laptops. | Familie F in 2× liefern |
| A14 | **Weitere Luken 2–6** und die Falkenstein-Videos (alte Liste). | Mehr Ziele im Becken. | später |
| – | F01/F02 Figurenblatt = A3, läuft nach Georgs Zielbild (Rahmen aus Zielbild geschnitten). F04 Glasbruch Luke und F07 Hai-Treffer werden gemalt (Codex, später). F10 entfällt (Flexa aus). | | |
| A20 | **Eine Welt ab Start** (Georg 24.11.): Konzept konzept_eine_welt/KONZEPT_EINE_WELT_R1.md. **Georgs Wahl:** Becken = B, weit weg, frei im Wasser schwebend, dahinter die Backdrops. Startbild-Hintergrund = A, Diashow ganz hinten, davor Tanggarten und Nebel, dort die HyperNorm-Engine. Nach „Get fishy“ zeigt der HyperNorm-Shader statt der Backdrops das Kippen des Wassers, ohne Erzählung. Die ersten ECHO-Botschaften laufen im HyperNorm-Kontext, der Monitor im Aquarium fällt weg. Probeaufbau r66 (v98, Schalter #welteins): Becken schwebt 5 m vor dem Tanggarten, Weltkamera folgt der Beckenkamera, Diashow hinten, nach Get fishy HyperNorm-Wand. Bild: konzept_eine_welt/probe_r1.png. Messung (bei hoher Rechnerlast, unsicher): Startbild etwa 13 → 20 ms pro Bild, Auswahl etwa +2 ms. Offen: Georgs Urteil, dann Schritt 2. Pipe-Teil mit WS0 (Ride R4). | Immersion, ein Lade- und Lichtweg | Aqua + WS0 |
| A21 | **ECHO auf schwarzen 3D-Flächen** (Georg via WS0, q865): Im ganzen Spiel keine 2D-Monitore mehr für ECHO, stattdessen schlichte schwarze, abgerundete, flache Blöcke. Text und Glitch weiter über die Sender-Ebene. Den R4-Host-Patch mit monitor_karte_03 nicht einbauen. Gilt sofort. | 2D-Monitore passen nicht | Aqua |
| A22 | **Fisch-Mimik für den Ride** (Georg via WS0, q865): wechselnde Ausdrücke auf dem Augen-Rig (Lider, Pupillen, Blick) in frontalen Ride-Momenten. Stimmungen: glücklich, ängstlich, skeptisch, verwirrt, begeistert, erleichtert. Stärke 0…1, Stufen fein/cartoon/extrem (V-1780, Tex Avery, Augen-Pop nur extrem). Erst das Modell, dann die Werte. Anschluss an die R5-Spur `fisch: { lage, stimmung, staerke, blick, frontal }` (RETURN_R5 von WS0), bis dahin eigene Test-Spur. Lidhaut-Takt beachten. | Rollercoaster-Gefühl | Aqua |
| A23 | **HUD-Reparaturplan R1** (Georg 24.11.): 14 Stellen aus Prüfagent und Georgs Bildern, Reparatur mit dem neuen Kit. Plan: hud_r2/REPARATURPLAN_R1.md. Darin auch die Auswahl-Punkte als Kit-Lampen (M6) und die Erweiterung des Prüfskripts (W1). | Lesbarkeit, Überlappungen | Aqua |
| A24 | **Textbuch** (Georg 24.11.): alle Texte als Seite mit Markdown-Export für den Abgleich im Webchat: https://claude.ai/artifact/BGpNuC4QZnbYJFhBRLNhcp (Datei texte_r2/aqua_textbuch.html, Skript texte_katalog.mjs). Startbild-Sublines = Goldstandard. Georg prüft im Webchat und gibt die Spalte „Neu“ zurück. | Ton und Konsistenz | Georg + Aqua |

## Entschieden (nicht mehr offen)

| # | Punkt | Entscheid |
|---|---|---|
| K22 | **Echte Videogesichter im Bullauge** (Flexa, Falkenstein) | Georg q855: bleiben fotorealistisch, der Kontrast zum Cartoon-Becken ist gewollt. Kein Cartoon- oder Monitor-Filter. In Kritikläufen als „gewollt“ markieren. |
| B1/B2 | **Wirbel** | Georg 23.11.: Vorbild patch.gg „Elements“, Spruch Cyclone, in Wasser- und Tangfarben, Warnfarbe bei Nähe; eingesaugt = ein Leben weniger. Gebaut r57 (Artefakt v80): Level 2 ein langsamer, Level 4 zwei (der zweite nur Trouble/Gangster). Später: Sog führt in ein Lungen-Level (analog Blutbahn). |
| – | **Tür ohne Ton** | Georg 23.11.: Klicks an der Tür starteten das Radio. Seit r57 Musik erst nach dem richtigen Wort. |
| – | **Arbeitsweise** | Georg 24.11.: Aqua-Wünsche bespricht und nimmt Georg direkt im Aqua-Chat ab. An WS0 geht nur Stamm-Bedarf (Module, Flipbooks, Ride) oder eine Regelkollision. Videos nur auf Wunsch oder zu Meilensteinen. |
| – | **Flexa** | Georg 23.11./24.11.: Reaktionen, Falkenstein und zuletzt auch das Intro sind aus, bis die HeyGen-Videos passen. Kein Ersatz. |
| – | **ECHO = Hinweisleiter** | Georg 24.11.: Im Becken eskaliert ECHO je Rätselschritt (achtung → bedienfeld → code → hinweis bis 4711), aus Georgs Zeilen und dem Bestand. Die nächste Zeile kommt nur nach 6 s Stille, ein geschaffter Schritt beendet die Stufe. Text und Stimme laufen synchron, eine Zeile je Einblendung (r62–r64). |
| – | **Kein Login** | Georg 24.11.: Nur die Login-Tür fällt weg, die Anmeldung läuft automatisch. Das Startbild (Escape Now) mit Beta-Badge bleibt (r64e). Die Ente ist ohne Login immer sichtbar, der Auswahl-Knopf heißt „Get fishy!“. |
| – | **Keine Tastennamen** | Georg 24.11.: Hinweise und Startbildschirm nennen keine Tasten, Hinweise sind rein räumlich bzw. erzählerisch (r64). |
| – | **Innenfelder** | Georg 24.11.: Inhalt bleibt im Glasfeld jeder Kit-Tafel plus Luft. Das Prüfskript pruef-panel.mjs (mit panelfeld.js) läuft für Desktop, Handy hoch und Handy quer (r64 grün). |
| – | **Becken aus Fischsicht** | Georg 24.11.: Die Außenansicht war null immersiv. Die Kamera steht im Becken hinter dem Fisch, „Open hatch“ erscheint erst vor der Luke (r63b). |
| – | **Performance** | Georg 24.11.: Das Profil zeigte den Lidhaut-Umbau aller Fischaugen bei 45–50 % CPU. Seit r63 gibt es einen Takt nach Sichtbarkeit und Bildgröße, die Tang-Raten sind halbiert. Offen: Tang im Meer weiter teuer, Messung auf dem Mac unter Last unzuverlässig. |
| A15 | **F03 Radio-Titel** | Georg 24.11.: erledigt r65b (v93). Der Sendername steht still, so groß wie das Fenster erlaubt (22 bis 15 px), gekürzt an Wortgrenzen. |
| A16 | **F05 Kapern** | Georg 24.11.: erledigt r65f (v93). Ablauf: Ausholen (zurückziehen, stauchen, Ziel fixieren), Stoß (gestreckt im Bogen), Kontakt-Bild (Tausch, Blitz, Ruck, Blasen, Zeitlupe), kurzes Nachfedern. Die Kamera schwenkt in die Dreiviertelsicht. |
| A17 | **F06 Ringe** | Georg 24.11.: erledigt r65d (v93). Die Ringe im Meer sind 35 % größer, der Zielring leuchtet heller. Der Zähler zählt richtig, „Rings 0“ kam aus Testsprüngen. |
| A18 | **F08 Monitor Blutbahn** | Georg 24.11.: erledigt r65e (v93). Der erste Monitor steht jetzt 6 m voraus auf Fischhöhe, die HUD-Ecke ist frei. |
| A19 | **F09 Game-Over-Ursache** | Georg 24.11.: erledigt r65c (v93). Die Lebensanzeige fällt auf 0, der Haken bleibt sichtbar im Fisch, das HUD blendet erst danach aus. |
| – | **Performance Start** | Georg 24.11.: r65g (v93). Layout-Maße werden nicht mehr in jedem Bild gelesen (vorher 13 % CPU), Shader werden parallel vorübersetzt, die Hintergrundwelt erscheint erst danach, die Auflösung passt sich der Bildrate an. Messung im Test: Startbild 16–19 → 27 Bilder/s, Auswahl 19–20 → 25. Offen: Shader-Hänger beim Laden (bis 2 s), Backdrop als teuerste Schicht, Tang-Physik. |
| – | **Knopf-Luft** | Georg 24.11. (zweimal „viel zu eng“): Die Beschriftung nimmt höchstens 52 % der Knopfbreite ein und steht mittig, mit klarer Luft zu den Nieten. Ursache: Die Anpassung lief, während der Knopf hinter der Ladeanzeige versteckt war, und danach nie wieder. Seit r65h (v94) läuft sie bei jedem Sichtbarwerden. Prüfung pruef-panel verlangt bei Knöpfen jetzt 8 % Luft. |
| – | **Spiel-Knöpfe einheitlich** | Georg 24.11.: Alle Spiel-Knöpfe (Escape Now, Get fishy!, Play again, Retry, Exit Now, Hideout, Free swim) haben dieselbe Größe und sitzen unten mittig an derselben Stelle. Die Breite folgt aus dem längsten Text (52 %-Regel) und liegt nie über der Bildgröße des Kit-Knopfs. DE-Texte gekürzt (Ausbrechen!, Neues Spiel). r65j (v96). |
| – | **Hero-Shot in der Auswahlkarte** | Georg 24.11.: Statt Polizeifoto mit Titel ein großer Hero-Shot des Fischs ohne Text. Augen offen (Foto am Lid-Takt vorbei, einmal blinzeln, dann warten). Am Handy bekommt die offene Karte eine Tafel aus dem neuen Kit (hoch quadratisch, quer etwas höher). Das Polizeifoto bleibt im Character Sheet. r65k (v97). |
| – | **Kit-Quellen** | Georg 24.11.: Blanko-Tafeln in sechs Formaten: Dropbox KFB Claymation Reference/KFB HUD Skins + UI/KFB Aqua HUD. Knöpfe, Rahmen, Schalter und Ornamente als Baukasten für später: …/KFB Aqua Buttons + Ornamente. Genutzt bisher: panel_square, panel_wide2. |
| – | **ECHO-Stimme** | Georg 24.11.: weniger englischer Gentleman, mehr HAL-9000 aus dem nassen Grab. Neu: Kokoro am_onyx, zwei Halbtöne tiefer, dumpf (Tiefpass 4 kHz), Bass, langer Hall. Grundton 152 → 78 Hz. Alle 37 Zeilen neu, v99. |
| – | **Augen und Lid-Takt** | Georg 24.11.: einige Fische hatten dauerhaft geschlossene Augen. Ursache war die Obergrenze des Lid-Takts (immer dieselben 4 Augen). Jetzt gerecht, Fotos sind ausgenommen. v99. |
| – | **Ride** | WS0 baut den Ride im Stamm neu (HyperNorm-Röhre, ECHO-Kommentare). Aqua fasst ihn nicht an und übernimmt den neuen Stand. |

## B · Fragen an Georg

1. **Wirbel-Level:** Soll der Strudel ein eigenes Level sein (nach der Schlucht, vor dem Hai) oder eine Gefahr, die in mehreren Stationen auftaucht? Und führt der Sog in den Strudel-Modus mit Rückkehr an dieselbe Stelle oder als Abkürzung zur nächsten Station?
2. **Strudel-Modus:** Eher Ride-artig (die Röhre ist schon da, Exit-Knopf im Takt) oder frei steuerbar gegen die Strömung? Ersteres ist schneller gebaut und nutzt Bestehendes.
3. **Ziel des Spiels für Kollegen:** Geht es mehr um Wettbewerb (Most Wanted, Bestzeit) oder um das Erlebnis (Story, Lacher)? Davon hängt ab, ob wir zuerst Bestenliste und Teilen ausbauen oder Story und Figuren.
4. **DocCheck-Bezug:** Sollen echte DocCheck-Fakten oder Produkte ins Spiel (Kritiker-Idee „Onboarding-Ziel“), oder bleibt es reine Satire?
5. **Sprache:** Bleibt die Seite rein englisch, oder soll es eine deutsche Fassung für die Kollegen geben? Die Texttabelle hat beide Sprachen angelegt.
6. **Character sheet:** Soll das Figurenblatt eine eigene große Tafel bekommen (dafür fehlt im Kit ein hohes, breites Panel), oder reicht die Fisch-Karte mit „Story & skills“?

## C · Vorschläge (attraktiver für Kollegen und später für alle)

### Spielbarkeit
- **Wirbel als Gefahr erster Klasse:** angeschnittene Wasserhosen von oben, Bewegungslogik wie die Suchscheinwerfer, Nähe mit derselben Gefahrenzone wie bei den Minen markiert. Der Sog führt in eine kurze Strudel-Passage im Ride-Stil statt ein Leben zu kosten. Effekte von patch.gg oder Tiny Skies. Vorher Zielbild.
- **Kurze Läufe:** Ein Lauf sollte in 3–5 Minuten zu schaffen sein, mit Checkpoint je Station. Dann passt er zwischen zwei Termine.
- **Klare Ziele je Station** im Kit-Hinweis statt Fließtext: ein Satz, ein Symbol.
- **Schwierigkeit nach Fisch:** Die Stärken (Tempo, Wendigkeit, Charme) spürbar machen, damit die Fischwahl eine echte Entscheidung ist.

### Wiederspielwert und Wettbewerb
- **Code-Wort des Tages:** Jede Woche ein neues Wort mit eigener Most-Wanted-Liste. Das gibt einen Grund, wiederzukommen, und passt zum Bouncer.
- **Teilbare Rap-Sheet-Karte:** Am Ende ein Bild „Wanted: Pixel Pete · 52 shells · 3:41“ zum Teilen im Team-Chat.
- **Abzeichen im Rap Sheet:** „Never spotted“, „Went through the mines“, „Shark survivor“. Kostet wenig, motiviert viel.
- **Geister-Lauf:** Den eigenen besten Lauf als durchsichtigen Fisch mitschwimmen lassen.

### Schönheit und Immersion
- **Radio als Regie** (Kritiker-Idee): Tiefpass beim Hai, Aussetzer in der Blutbahn, fremder Sender bei Falkenstein. Die Ton-Regie ist schon angelegt.
- **Stille vor dem Biss:** 2–3 s ohne HUD und Musik vor dem Hai-Angriff, ist teilweise da und sollte konsequent werden.
- **4711 als roter Faden** bis ins Finale: Flasche im Becken, Code an der Luke, Auflösung bei Falkenstein.
- **Ein Look für alle Tafeln:** Nach Familie F alle Tafeln, Leisten und Knöpfe aus einem Guss, ohne CSS-Kästen.

### Zugang für eine größere Audience
- **Hochformat am Handy** als eigenes Layout statt gequetscht.
- **Barrierefreiheit:** reduzierte Bewegung, größere Untertitel, Steuerung nur mit Pfeiltasten.
- **Ladezeit:** three.js lokal statt vom CDN mitliefern. Im Test hing das CDN mehrmals, das passiert auch Spielern.
- **Erster Eindruck in 10 Sekunden:** Tür, Logo, ein Satz, los. Die Tür ist jetzt schlank, der Rest des Einstiegs sollte genauso werden.
