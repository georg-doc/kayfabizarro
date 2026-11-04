# WS0 · Clay-HUD: Vollständigkeits- und Baukastenprüfung R1
Stand: 04.11.2026. Auftrag Georg an WSA; Empfänger WS0 / Kartenkante. **Gesamtskin NICHT vollständig.** Retro1a/1b ist nur eine Teillieferung. Dieses Dokument enthält verbindliche neue Georg-Regeln, verifizierten Iststand und ausdrücklich offene Entscheidungen; keine behauptete neue Laufzeitimplementierung.

## Ziel und Zuständigkeit
Ein zusammenhängendes modulares HUD-System für Retro, Steam, Teal, Reactor Blue, Slime Green und Hazard v2, über alle tatsächlich vorhandenen Spielzustände. Nicht nur sechs dekorierte Fluff-Leisten. Jede sichtbare Komponente muss entweder ein eigenes Skin-Signaturteil, ein im Skin konsistent angewandtes Master-Bauteil oder eine ausdrücklich beschlossene skin-neutrale Ausnahme sein. Bestehendes Master-Kit und Runtime weiterverwenden; generische Panels/Schalter nicht sechsmal neu malen. WSA liefert Kunst, modulare Einzelteile/Manifest und QA; Kartenkante verantwortet Schnitt/Integration im bestehenden HUD; WS0 schließt offene Produktentscheidungen. Kein zweiter Runtime-Owner und kein eigenmächtiges Verschieben der L2-Zonen.

## Quellen und Grenzen
Privates Spiel-Repo georg-doc/KFB-Stunt-Car-Race, Branch module/hud-clay-r1, gelesener Head 6b72ba39323aa1f264bc2a70b5010963d2b64565.
- HUD_SKIN_SPEC.md: Blob e78a6a8556b4875436c0a1a924283bfd69b807d1, aktueller §2a =1536x1024 Paar1a/1b.
- HUD_COVERAGE_R1.json: Blob c8aba605c447833d460d86623438da1e1d714326,34Elemente ×9Modi ×6Skins; Bestandsaufnahme, keine Abnahme der neuen Lieferung.
- HUD_LAYOUT_R2.md: Blob23102a19bdb826124cc6e6bc06935640e403dae4.
- src/hud/hudV6.js: Blob 750571ae1908fba731a8963ef0e55eea1a8bb5c0; src/hud/layoutR2.js: Blob 6a8414215faa69e4a2c52dd656e37b4aa42eb1e7; src/hud/statesR2.js: Blob 6c3843463ca00cab415dfa0b3f2f8587d2a3eed9.
- src/hud/clayKit.js: Blob 0b8ad1401de9d9b50785c71b484c9a70750aa13c; src/data/hud/hud-skins.r2.json: Blob 57a4164f4fec053e74497f1b652e1a026a83c14b.
Die Codeprüfung ist statisch. Keine neue Browser-/Spielabnahme, kein neuer unabhängiger Art-Test. Gemeldete Hazard-/Typografie-/Doppelrahmen-Defekte sind Georgs Produktbefunde; hier nicht als neue eigene Bildschirmmessung ausgegeben.

## 1. Verifizierter Aktionsleisten-Iststand: Dokumente sind nicht deckungsgleich
hudV6.js L242–266: N_ITEM=3. Hauptleiste = Primary + Secondary +0..3gefüllte Item-Slots +eigener Context/Interact-Slot, also aktuell3..6Plätze. Zusätzlich separate1er-Leisten für Travel und Backpack; maximal8sichtbare Plätze insgesamt in dieser Gruppe. Interact bleibt eine eigene Rolle, wird bei Entfernung deaktiviert; sein Index rückt mit den gefüllten Items. Primary öffnet eine Waffenwahl; WEAPON_ICON enthält Faust und generische Gun-Varianten für pistol/blaster/gun. Secondary nutzt aktuell Granate. Travel/Backpack sind zusätzliche Bedienelemente und dürfen nicht vergessen werden.
Im Gespräch baut hudV6 eine eigene2er-Leiste: Weapon +Play a card. Waffen- und Reise-Popovers verwenden ebenfalls bar_n.
Demgegenüber beschreibt HUD_LAYOUT_R2 noch3+2Plätze. statesR2 deklariert Walk=primary/secondary/jump/context, Drive=primary/secondary/boost/exit, Fly=primary/secondary/boost/land. Diese Rollendaten allein beweisen nicht, dass buildBar sie vollständig rendert. Kommentare zu festen Plätzen widersprechen drawItems(), das leere Items entfernt und Interact verschiebt.
**Folge:** Sechs neu gemalte Icons ergeben noch keinen vollständigen dynamischen Aktionsbaukasten. Slot-Container, Rolle, wechselnder Inhalt, Eingabehinweis, Zustands-Overlay und Animation sind getrennte Ebenen.

## 2. Verbindliche Georg-Regeln aus diesem Chat
### Funktion vor Ornament
- Klares, sparsames Interface mit liebevollen skin-typischen Details; Dekoration bleibt der Bedienhierarchie untergeordnet.
- Ein sichtbarer Rahmen pro Funktion. Nicht erst ein gerahmtes Panel, darin ein Blanko-Slot und darin ein nochmals gerahmtes Primary-/Secondary-Icon.
- Eine echte Mulde darf der einzige Slot-Container sein. Darin liegt eine freigestellte Glyphe ohne weiteren Sockel/Rahmen. Ein Icon-Button kann einen eigenen Container haben, wenn keine bestehende Mulde ihn bereits trägt.
- Button, Slider-Track, Slider-Fill, Knopf, Tab und Panel sind unterschiedliche Rollen. Kein abgeschnittenes/halbfertiges Slider-Teil als Standard-Button umdeuten.
- Schließen: ein eigenständig freigestelltes, kanonisches X mit eigenem Hit-Bereich; keine pro Skin neu erfundene X-Form oder zweite Plakette. Anpassung über vereinbarte Material-/Farbregeln, nicht neue Geometrie.
### Panels, Tabs und Hazard
- Wiederverwendbare3-/9-Slice-Geometrie mit festen Ecken, variablen geraden Kanten und eigenständiger Innenfläche. Breiten-/Höhenänderung darf weder Eckform noch Funktionselemente verzerren.
- Signaturmotive als getrennte feste Overlays mit Ausschlusszonen, nie zufällig im dehnbaren Mittelstück.
- Hazard/Maintenance: schwarz-gelbe Streifen dürfen NICHT unter den Tabs durchlaufen und Tab-Konturen/Zuordnung auflösen. Eigene Musterzone, klare Tab-Ablage und ungestörte Kontur des aktiven Reiters. Ein geometrisch geschützter Streifen allein löst dieses semantische Layoutproblem noch nicht.
- Active-Tab muss eindeutig zum zugehörigen Panel gehören; inaktive Reiter unterscheidbar. Konventionen und Lesbarkeit gelten in allen Skins, auch ohne Schmuck/Leuchten.
### Typografie und Padding
- Kein Buttontext ohne Innenabstand; Rahmen, Label und Icon erhalten separate Inhalts-/Sicherheitszonen.
- Bangers ist NICHT die einzige Headline-Schrift und keine allgemeine All-caps-Vorgabe. Keine schlecht lesbaren Versalien als Standard.
- Bestehende R2-Basis ist Fredoka, Titel in Groß-/Kleinschreibung; finale skin-spezifische Typofamilien sind OFFEN, nicht still entschieden.
- Ein Typokonzept pro Skin darf den Charakter variieren, muss aber gemeinsame Rollen/Hierarchie bewahren: Display/Headline, UI-Label, Fließ-/Hilfstext, Zahlen.
- Schrift, Labels, Hotkeys, Zahlen/Werte bleiben grundsätzlich Laufzeittext. Langtext/Übersetzungen dürfen Padding oder Mindestgröße nicht aufheben. Passende Fall-back-Fonts, Schnitte, Lizenzen und gemessene Textbreiten gehören zur Freigabe.
- Bestehende Untergrenze14Bezugs-px, Body18, Kontrast>=4,5:1 sind Ausgangswerte; tatsächliche Lesbarkeit im Spiel zusätzlich prüfen.
### Responsivität, States und Cartoon-Motion
- Alle Header/Bedienelemente responsiv: erlaubte Mindest-/Maximalgröße, Umbruch-/Kompaktregel, Textbereich, Anchor und feste vs. dehnbare Zonen ausdrücklich festhalten.
- NORMAL/HOVER/PRESSED/ACTIVE/DISABLED/LOCKED/COOLDOWN/HIDDEN je Rolle abdecken; CLICK ist das Ereignis, PRESSED die sichtbare Phase. Toggle/Tab kann gleichzeitig active+hover sein.
- Cartooniges Einsinken/Federn darf Layout, Hitbox und Gruppenausrichtung nicht springen lassen. Container-Geometrie bleibt stabil; nur vereinbarte Darstellung transformieren.
- State kann aus gemeinsamem Basisbild plus Code-/Overlay-Behandlung bestehen. Kein Zwang, acht beinahe gleiche Bitmaps zu malen. Jede Auflösung im Manifest trotzdem explizit.
- Bild-alpha und Ingame-Effekt getrennt testen: saubere PNGs können durch Drop-Shadows, Skalierung oder Bewegung in der Runtime wieder weich erscheinen.
### Freistellung und Schärfe
- Jedes Teil lossless einzeln nutzbar, echtes Alpha0 außerhalb der Kontur, keine Schatten-/Glow-Wolken oder rot-gelben Krümel.
- Weiche Außenkante<=3px nach aktueller Sheet1-Regel; keine pauschale Weichzeichnung/Übergangsblende, kein Hochskalieren als Auflösungsersatz.
- Druck-/Fingerabdruckdetails dürfen Material modellieren, aber keine zufälligen Rahmen, verwaschene Funktion oder Schmuck ohne Rolle erzeugen.
- QA auf Hell/Dunkel und bei100%Originalpixeln sowie tatsächlicher Spielgröße. Vorschauskalierung ist keine Schärfeabnahme.

## 3. Vollständigkeitsliste der34Bestandselemente
Die Statusspalte zeigt die gelesene Coverage für Retro, NICHT die Erledigung dieses Produktionsauftrags. 'umgefärbt' ist ein vorhandener Donor, keine Integrationsabnahme. Bedarfe sind Quellpixel laut Matrix; bei Slice-Teilen ist die maßgebliche Rand-/Höhendimension gemeint.

|ID|Bauteil|Bestandsstatus Retro|Retina / großes Retina (px)|
|---|---|---|---|
|fluff_bar_closed|Fluff-Leiste zu|eigen|1422 / 2275|
|fluff_bar_open|Fluff-Leiste offen (Schublade)|eigen|1422 / 2275|
|fluff_cells|Mulden (6) und Total-Feld|eigen|1422 / 2275|
|fluff_counter|Zähler-Marke und Total-Zahl|code|56 / 90|
|fluff_sprites|Fluff-Kugeln (6 Sorten × 6 Formen)|neutral|114 / 182|
|radio_column|Radio-Säule|umgefärbt|532 / 851|
|radio_panel|Radio-Panel und Songliste|umgefärbt|36 / 58|
|almanac|Almanach-Rahmen mit Plakette|umgefärbt|116 / 186|
|waypoint|Wegweiser (Plakette, Mulde, Pfeil)|umgefärbt|116 / 186|
|gear|Zahnrad (Einstellungen)|umgefärbt|112 / 179|
|close_x|Schließen-X|umgefärbt|42 / 67|
|action_trays|Slot-Leisten (bar_1…bar_8)|umgefärbt|142 / 227|
|glyph_primary|Glyphe Faust/Waffe|generisch|104 / 166|
|glyph_secondary|Glyphe Granate|generisch|104 / 166|
|glyph_jump|Glyphe Springen (Stiefel)|fehlt|104 / 166|
|glyph_boost|Glyphe Boost (Blitz)|fehlt|104 / 166|
|glyph_exit_land|Glyphen Aussteigen / Landen|generisch|104 / 166|
|interact_field|Interact-Feld („Interact · I“)|generisch|104 / 166|
|glyph_play_card|Glyphe Karte ausspielen (Gespräch)|generisch|104 / 166|
|tempo_strip|Tempo-Streifen (Tacho)|fehlt|532 / 851|
|height_fuel|Höhe und Treibstoff (Jetpack/Flug)|fehlt|532 / 851|
|minimap|Karte / Minimap (Kompass-Deckel)|fehlt|400 / 640|
|target_reticle|Fadenkreuz, Lock-on, Aufladen|generisch|240 / 384|
|settings_window|Einstellungen (Tafel, Reiter, Pillen, Schalter, Regler)|umgefärbt|44 / 70|
|backpack|Rucksack-Raster 5 × 4|umgefärbt|36 / 58|
|deck_viewer|Deck-Viewer (Kopfleiste)|umgefärbt|60 / 96|
|card_album|Karten-Album (Raster, Zähler, Zonen)|fehlt|2240 / 3584|
|dialog_choice|Dialog-Auswahl 2 × 2 und Antwort-Blasen|neutral|600 / 960|
|speech_bubble|Sprechblase|neutral|600 / 960|
|card_hero|Karten-Hero-Shot und Kartenflug|neutral|1280 / 2048|
|loading_curtain|Ladevorhang mit Erzählzeile und Ladebalken|neutral|1800 / 2880|
|loading_chip|Lade-Chip (Nachladen im Spiel)|generisch|400 / 640|
|pause_screen|Pause-Bildschirm|entschieden|1800 / 2880|
|portal_transition|Portal-Übergang|entschieden|1800 / 2880|

### Liefergruppen und tatsächlicher Arbeitsstand
|Gruppe|Lieferung|Stand / fehlender Nachweis|
|---|---|---|
|A · Signatur|1a/1b je sechs Skins: Fluff zu/auf, Radio, Gear-Zustände, Pfeil, Details|Nur Retro-Paar R3 geliefert; Schnitt hält an falscher Zell-Auswahl. Andere5Paare fehlen.|
|B · Action-Glyphen|Sheet2 pro Skin; Faust/Waffe, Secondary, Jump, Interact/I, Backpack, Carrot/Item, Play-card, Boost, Exit, Land plus definierte weitere Rollen/Pressed-Bilder|Alle6Skin-Sätze fehlen. Generische v6-Icons sind kein Ersatz für skin-fertige Glyphen. Waffen-/Item-/Fahrzeugvarianten und fehlendes Drive-Car im geplanten Raster ausdrücklich klären.|
|C · Container und Standard-Controls|Master-Slot-Leisten1..8, Einzelmulde, Standard-Buttons, Panels, Tabs, Pills, Close-X, Sliders, Toggles, Plaques; pro Skin angewandte Palette|Donoren existieren; hochauflösende Slots, feste Maße, Einzelteile und State-/Layer-Vertrag noch nicht vollständig geliefert/geprüft.|
|D · Reise und Navigation|Sheet3: Tempo-Enden/Mitte, Höhen-/Fuel-Röhren; Minimap-Rahmen offen/zu|Fehlt; Sheet3-Raster/Andockpunkte und Minimap-Zone noch nicht produktiv bestätigt.|
|E · übrige HUD-Module|Settings/Pause, Radio-Panel, Almanach, Wegweiser, Alchemy, Inventar5x4, Deck/Album, Targeting, Lade-Chip|Aus bestehenden Ownern/Masterteilen vollständig im Skin vorführen; nicht aus Bildern allein ableiten. Offene generische Ausnahmen benennen.|
|F · absichtliche Ausnahmen|Fluff-Farben, Dialog-/Sprechblasen, Karten-Hero/Flug, Ladevorhang; Portal HUD-hidden|Bestehende Neutralität/Owner erhalten, außer WS0 beschließt konkrete Änderung. Pause nutzt Settings, kein neues Pause-Bild.|

## 4. Maße: Bekanntes und offene Vertragsfelder
- Bezug1440x900, A=59, Safe-Zone28, Gruppenabstand12; L2: trayH=1,2A (=70,8), radioH=4,5A, Fluff max711, kompakt unter1080Bezugsbreite. Diese Zonen nicht neu positionieren.
- Aktuelle Slots im Code:88px vor BAR_K=0,67 =>58,96u; Leistenhöhe115 =>77,05u. Das weicht vom nominellen70,8u ab. Slot-Quelle/Padding/Hitbox nicht daraus frei erfinden.
- Slot-X vor Gruppen-Skalierung: (68,5+112i)*0,8-44; barW(n) = round((n=1?137:250+(n-2)*112)*0,8). Manifeste müssen tatsächliche Muldenmitten mit diesem Vertrag abgleichen.
- Master-Slot-Ziel bisher288Quellpixel Höhe (statt144), Minimap2Zellen à1024; endgültige Quellbreiten und Muldenmitten für bar_1..bar_8 fehlen im vollständigen Produktionsvertrag.
- Glyph-Sheet2 bisher2048x2048,4x4 à512,>=32Padding. Wie die native1536x1024-Beschränkung für diese feineren Einzelteile aufgelöst wird, ist OFFEN; nicht einfach hochskalieren oder die Sheet1-Regel wortlos auf Sheet2 übertragen.
- Slice-Kanten/Insets, Inhalts-Padding, Glyph-BBox, Klickbereich und Overlay-Anchor pro Rolle messen. Keine universellen geratenen Schnittkoordinaten.
- Quellenbedarf aus tatsächlicher Maximaldarstellung ×u×DPR berechnen. Neue1472px-Leiste deckt1422px Standard-Retina-Bedarf ab, NICHT2275px großes Retina. Zudem exportiert der aktuelle Cutter BAR_W=1046. Ein ausreichend breiter Quellbogen allein beweist daher keine scharfe Laufzeit.
- Tabelle je Asset verpflichtend: canvas/bbox/sourceScale, Insets, cellCenters, contentBox/padding, iconBox, hitBox, anchor/transformOrigin, stretchable/protected zones, min/max render size, DPR-Budget, Status. Unbekannte Werte als MEASURE_REQUIRED.

## 5. Manifest und Ebenenlogik (zu bestätigender Schema-Vertrag)
Bestehendes kfb.hud-skin/1 erweitern, keinen zweiten Asset-Owner/Index erfinden. Pro Asset feste id/role/sourceHash/bbox/nativeSize sowie owner und measured geometry. Ebenen:
1. Container: genau ein Frame/Slot/Tab/Standard-Button; fixe Kontur + erlaubte Slice-Zonen.
2. Inhalt: freigestellte Glyphen ODER Laufzeittext/Weapon-/Item-Inhalt; kein zweiter Sockel.
3. Status: Auswahl,Disabled,Lock,Cooldown,Key-Hint; kein neues dauerndes Frame.
4. Skin-Detail: geschütztes Overlay nur in zugewiesener Dekozone.
5. Interaction: Hitbox/Focus/Motion als Daten, nicht ins Bild gebacken.
Pro State: resolution=asset|derived|hidden, sourceRole oder baseAsset, Overlay-Liste, tint/brightness/opacity-Regeln, Animation/Timing/transformOrigin, Hitbox-Policy. Kein fehlender State durch schweigenden Fallback auf ungefärbte Icons. State-Kombinationen und empty/unavailable/loading zusätzlich definieren; don't repaint8Bitmaps ohne Bedarf.
Rahmen ownership und Ebenenzahl pro Rolle maschinenprüfbar; Slider track/fill/thumb nicht als button deklariert; X eigenständig. Typo-Tokens pro Skin/Role mit Familie/Fallback/Gewicht/Case/Mindestgröße/Zeilenhöhe/Tracking/Padding und Kontrasttest. Vorschlag, noch kein implementiertes Schema.

## 6. Konkrete Fragen an WS0 / Kartenkante
1. **Slot-Vertrag:** Bedeutet bis6Plätze die Hauptleiste inklusive eigenem Interact (aktueller Code), PLUS Travel/Backpack? Oder soll Interact visuell separat stehen? Welche Regeln gelten bei0..3Items, leerem Inventar, Waffenwahl und Popovers? Bleibt Interact ortsfest oder rückt es mit? Widerspruch3+2/fix/dynamisch bitte auflösen.
2. **Aktionsrollen:** Welche Walk/Drive/Fly-/Talk-/Target-Aktionen sind tatsächlich sichtbar und bedienbar? Wie werden Jump/Boost/Exit/Land gegenüber Items/Travel eingeblendet? Brauchen Gun-Varianten, Car/Jetpack, Item-Fallback und Popover-Icons eigene Skin-Glyphen? Eine Faust +Granate allein deckt Primary/Secondary nicht ab.
3. **Interaktion:** I ist festgelegt; erscheint I als Laufzeit-Key-Hint über freier Hand-Glyphe (bevorzugter modularer Vorschlag) oder ausdrücklich im Bitmap? Definition der Disabled-/Near-/Talk-Near-Zustände.
4. **Maßvertrag:** Welche Quelle ist bei70,8 vs77,05Leistenhöhe maßgeblich? Bitte bar_1..8-Quellmaße/Muldenmitten, Button-Contentbox/Padding, eigenständiges X/Hitbox und Header-min/max-Sizes verbindlich bestätigen.
5. **Schärfe:** Standard-Retina allein oder auch2560x1440DPR2? Wie bleibt1472Quellbreite im Export erhalten statt1046? Wie werden größere Auflösungen ohne Upscaling gelöst? Ein visueller Material-PASS ersetzt diesen Pixelpfad nicht.
6. **Panel-/Tab-System:** Hazard-Streifen außerhalb Tab-Ablage verbindlich in bestehendem Panel-Modul umsetzen; Inhaltsfläche, aktiver Tab/Panel-Anschluss und geschützte Musterzonen freigeben. Die reported Doppelrahmen und Slider-als-Button-Fehlverwendung rollenweise ausschließen.
7. **Typografie/Motion:** Gemeinsame UI-Basis plus skin-eigene Display-Typo oder auch unterschiedliche UI-Schriften? Fredoka ist aktueller Ausgangspunkt, Bangers nicht pauschaler Default. Welche Lizenzen/Fallbacks? Gemeinsame States/Motion-Tokens/Focus und stabile Hitbox freigeben, Variation nur im vereinbarten Rahmen.
8. **Vollständigkeit/Owner:**34er-Coverage auf tatsächliche Runtime erweitern (State-Overlays, Slot-Varianten, Standard-Buttons, Header, X und Typo sind bisher keine eigenen ausreichend granularen Zeilen). Welche verbleibenden generischen Elemente (Targeting/Lade-Chip) werden skinned, welche bleiben absichtlich neutral? Wer bestätigt jede Integrationszeile?
9. **Cutter-Gate:** Zell-Auswahl aus gleichförmiger6er-Reihe statt first-six-bright; neue Paarregeln prüfen. Die gemeldete Retro-Diagnose ist erhalten; kein vollständiger Skin-PASS solange die tatsächliche Pipeline nicht durchläuft.

## 7. Definition 'vollständiger modularer Skin'
Nicht nach Anzahl schöner Bögen schließen. Erst erfüllt, wenn:
- Alle bestätigten HUD-Rollen und State-Kombinationen einer Coverage-Zeile zugeordnet sind; keine unbeabsichtigten neutralen/generischen Fallbacks.
- Alle Slot-Anzahlen1..6 und bestehende benötigte1..8Container/Popovers als Bauteile unterstützt sind; tatsächliche Spielgruppen inklusive Primary/Secondary/Interact nach Vertrag funktionieren.
- Alle Assets einzeln verlustfrei, exakte Geometrie/Slices/Anchors/Layer-/State-Einträge vorhanden und reproduzierbar geschnitten.
- Source→Cut→Runtime Pixelbedarf tatsächlich erfüllt; keine Blur-Filter/Feathers zum Kaschieren von Nähten, keine unlesbaren All-caps/fehlenden Paddings, keine Doppelrahmen.
- Settings,Radio,Almanach,Wegweiser,Inventory,Deck/Album,Targeting,Travel und Minimap entsprechend bestätigtem Scope in allen6Skins und allen relevanten Modi getestet sind; Pause/Portal wie beschlossen.
- Header in schmal/breit/kompakt und Textlängen getestet; Hover/Pressed/Active/Disabled/Locked/Cooldown/Hidden ohne Geometriesprung; Hazard-Tab-Hierarchie bleibt intakt.
- Technische QA, unabhängige Gestaltungskritik, Georg-Designentscheidung und Spielintegration getrennt dokumentiert.
Erforderliche Belege: Licht/Dunkel,100%-Quellcrop, tatsächliche Spielgröße, source/render-Pixelrechnung, sechsSkin-Ansichten, Slot1..6, Mode-Wechsel und kritischeState-Kombinationen. Keine Behauptung, diese Tests seien in diesem Dokument bereits ausgeführt.

## Nächster Schritt
WS0/Kartenkante schließen die Fragen1–9 in den bestehenden Runtime-SSOTs, benennen pro bestätigter Zeile Owner/Maße und einen prüfbaren Integrationsbeleg. Parallel bleibt die bestehende Kunstproduktion nutzbar; unklare Button-/Tab-/Typo-Varianten nicht durch spontane neue Rahmen oder Schriftwahl erfinden. Dann einen **vollständigen Retro-Baukasten im echten HUD** prüfen, bevor die Umsetzung nur dekorativer Teile als Serie 'fertiger Skins' gilt. Kein neuer Runtime-/Stage-/Hub-Owner; kein Auto-Merge.
