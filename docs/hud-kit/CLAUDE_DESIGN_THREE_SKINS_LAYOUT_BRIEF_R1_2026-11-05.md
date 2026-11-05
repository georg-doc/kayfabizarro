# Claude Design · KFB HUD · drei vorgegebene Skins sauber umsetzen

## Auftrag und Ergebnis

Du erhältst Georgs Ordner „KFB HUB Skins + UI“. Die Gestaltungskonzepte für **Reactor Blue, Slime Green und Hazard Yellow** sind vorgegeben. Entwickle daraus ein konsistentes, sauber gesetztes und modular nutzbares Interface. Erfinde keinen weiteren Skin und interpretiere die Vorlagen nicht neu. Erhalte ihren plastischen, handmodellierten Charakter.

Georgs Auftrag: vorhandene Teile richtig verstehen, mit sinnvollen Abständen und Hierarchien layouten, Ornamente integrieren und die dynamischen Auswahlleisten sowie vergrößerten Panels belastbar konstruieren. Liefere eine zusammenhängende Umsetzung für alle drei vorhandenen Konzepte; keine neue Runde isolierter Farbflächen.

Dieser Auftrag setzt **Retro R16 nicht fort**. Georg hat R16 ausdrücklich abgelehnt. Ein älterer Webchat-Vermerk über einen offenen R16-Prozess ist keine nachträgliche Designfreigabe und soll diese drei bereitgestellten Konzepte nicht blockieren. Keine automatische Game-Integration, kein Merge, kein Deployment.

## Dateien zuerst tatsächlich ansehen

Der Originalordner liegt bei Georg hier:
`/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Claymation Reference/KFB HUB Skins + UI/`

Die wichtigsten neuen Konstruktionen:

| Skin | Action-Bars, Einzelknopf, Panel und aufgeteilte Rahmenteile | Leiste zu/offen, Radio, Zahnrad und Details |
|---|---|---|
| Reactor Blue | `ChatGPT-Bild 5. Nov. 2026, 14_57_02-1.png` | `ChatGPT-Bild 5. Nov. 2026, 14_58_19-1.png` |
| Slime Green | `ChatGPT-Bild 5. Nov. 2026, 14_57_03-2.png` | `ChatGPT-Bild 5. Nov. 2026, 14_58_22-2.png` |
| Hazard Yellow | `ChatGPT-Bild 5. Nov. 2026, 14_57_04-3.png` | `ChatGPT-Bild 5. Nov. 2026, 14_58_23-3.png` |

Zusätzlich: `KFB_HUD_Skin_Ornaments_R1/` mit 33 Blue-, 39 Slime- und 35 Hazard-Ornamenten, Manifest und Einzel-PNGs. Die Dateien mit Uhrzeit 15_01 sind weitere Vorlagen; gleiche Inhalte anhand der tatsächlichen Bilder/Hashes erkennen, nicht als zusätzliche Designs behandeln. `*_SHEET_RGBA.png` sind ältere Kandidaten, deren ursprünglicher Bericht Hazard noch ohne native Sechserleiste führte. In den oben genannten NEUEN Vorlagen gibt es eine Sechserleiste. Diese Versionen nicht verwechseln.

Die beigefügten `originals/` und die Quellenübersicht zeigen die tatsächlichen Eingaben unverändert. Fehlgeschlagene Zusammensetzungen stehen ausschließlich unter `failed-evidence/`. Sie sind Fehlerbeispiele, keine gestalterischen Eltern und keine Assets zum Import.

## Was an der Gestaltung verbindlich ist

- Blue: körperliche blaue Einfassungen, Metallverbindungen, gezielt eingesetzte Cyan-Module.
- Slime: unregelmäßige organische Überzüge und Tropfen auf einer nachvollziehbaren Rahmenkonstruktion.
- Hazard: kräftige gelbe Konstruktion, Metallverbindungen und begrenzte Warnplatten/-streifen. Kein Warnband hinter oder unter einer Reiterreihe.
- Übernimm Proportionen, Materialtiefe, Kanten und die unterschiedliche Verteilung der Details. Ein generischer Rahmen in drei Farben ist keine Umsetzung dieser Vorlagen.
- Alle Teile einer Familie gehören zusammen, müssen aber funktional unterscheidbar bleiben. Button, Reiter, Slider, Panel und Radio dürfen nicht dieselbe Grundform mit anderen Beschriftungen sein.
- Ornamente sind bewusst gesetzter Schmuck. Verwende nicht jedes Ornament überall. Halterungen gehören an konstruktive Verbindungen; große Signaturteile bekommen eine klare Hierarchie. Radio-Lautsprecher, Antennen und Sirenen werden nicht automatisch zum Standardaufsatz aller Bedienelemente.
- Ein dekoratives Licht ist keine behauptete Spielzustandsanzeige. Kopple es nur an einen Zustand, wenn dieser tatsächlich vom Spiel geliefert wird.
- Kein zusätzliches Weiß, Grau, Sockel oder Ring unter freigestellten Icons. Bereits gemalte Lippen der neuen Originalleiste gehören zur Vorlage; keinen zweiten Rahmen daraufsetzen. Eine notwendige Abweichung von älteren „randlos“-Formulierungen offen mit Kartenkante abgleichen, statt Georgs neue Vorlage heimlich umzubauen.

## Interface und Ebenen

Führe ein nachvollziehbares Abstands- und Ausrichtungssystem. Nutze gemeinsame Grundlinien, optisch zentrierte Icons und ruhige Inhaltsflächen. Plane das X, Titel, Reiter, Scrollbereich und Footer mit echten Innenabständen. Nutze freien Raum bewusst; fülle ihn nicht mit beliebigen Ornamenten.

Die Rollen bleiben getrennt:
1. Gehäuse/Rahmen.
2. Skin-Knopffläche und ihre Zustände.
3. Freigestelltes gemeinsames Inhaltsbild.
4. Laufzeit-Beschriftung und Tastenhinweis.
5. Bewegungs-/Zustandssteuerung im bestehenden Code.

Waffen, Props, Gear und Fahrzeuge sind gemeinsame 3D-Hero-Shots. Keine Skin-Neumalerei für Hunderte Gegenstände, keine Ersatzicons. Zeige die tatsächlichen Spielinhalte. Fredoka in Groß- und Kleinschreibung, sinnvoller Zeilenabstand und lesbare Schrift; keine gedrängten Versalien. Tasten I/Space nie in Bitmaps malen. Das Schließen-X bleibt ein freistehendes eigenes Teil; Klickfläche unabhängig von seiner sichtbaren Größe.

## Hauptleiste und dynamische Auswahl

Die Hauptleiste hat vier feste Rollen: **Primär, Sekundär, Bewegung, Kontext**. Kontext bleibt ortsfest und ohne Aktion leer. Reise ist ein eigener Platz daneben. Die 4–6-Varianten dieses Auftrags prüfen dynamische Auswahlfächer; daraus entstehen keine sechs neuen Hauptrollen.

Lege EIN Zellmaß und EINE Zellperiode fest. Beim Wechsel 4 → 5 → 6 bleiben Knopfgröße, sichtbare Bodenfläche, Abstände und Rahmenstärke gleich. Verlängert wird die Leiste. Enden bleiben geometrisch passend; Signaturornamente sitzen einmalig an ihren definierten Ankern. Kein vervielfachtes Mittel-Emblem, keine Stufen an den Schultern, keine abrupt abgeschnittenen Rundungen. Eine ganze gemalte Viererleiste lässt sich nicht einfach in der Breite verzerren.

Die vorhandenen Dreiervarianten sind Gestaltungsvorlagen, noch keine bewiesenen modularen Raster. In der lokalen Rekonstruktion aus der Viererleiste wurden Zellperioden von 87/79/80 Quellpixeln für Blue/Slime/Hazard verwendet. Das sind Zellperioden, NICHT 176px-Bodenflächen. Diese Zahlen nicht ungeprüft als Runtime-Vertrag übernehmen.

## Vergrößerte Panels und Retina

Zeige Panels in mindestens drei deutlich unterschiedlichen Größen und Seitenverhältnissen. Die Hauptmotive, Bolzen, Cyan-Module, Tropfen und Schrägstreifen dürfen sich dabei weder dehnen noch vervielfachen. Schlichte Randstücke dürfen verlängert werden, müssen aber ohne sichtbare Verdickungen, rechteckige Absätze oder wechselnde Querschnitte an die geschützten Teile anschließen. Die Innenfläche darf keinen geflickten Teppich bilden.

Ein einzelnes grobes 9-Slice-Raster reicht möglicherweise nicht: top-/bottom-/side-Signaturen können zusätzliche feste Anker brauchen. Benenne eine solche Konstruktion korrekt und liefere ihre tatsächlichen Segmente und Mindestmaße. Keine Ecken-Pixelprüfung als Beweis für saubere Gesamtnähte verkaufen.

Die drei neuen Konstruktionstafeln sind nativ **1254×1254**. Die daraus isolierten Gesamtpanels messen Blue **593×429**, Slime **609×403**, Hazard **583×473**. Bei unverändertem Gesamtbild und DPR2 sind das nur etwa 297/305/292 CSS-px Breite. Größere Panels brauchen eine funktionierende modulare Konstruktion. Die kleinen gemalten Slot-Innenflächen lassen sich nicht verlustfrei zu 176×176-Dateien hochskalieren. Weise den tatsächlichen Pixelbedarf nach; verwende geeignete größere Originalquellen oder erstelle fehlende Produktionsvorlagen gezielt und vorlagengetreu. Kein Schärfefilter und kein vergrößerter Export ersetzt native Auflösung.

Prüfe Breiten 320, 390, 768, 1440 und 1920 sowie DPR1/2. Auto/Kompakt/Normal/Groß müssen die Pixelgrenzen berücksichtigen. Keine Bildschirmüberläufe oder verkleinerten unlesbaren Beschriftungen, nur damit alles formal hineinpasst. Auf schmalen Ansichten sollen Inhalte sinnvoll umbrechen oder innerhalb des Panels scrollen, ohne dessen Kontur zu verzerren.

## Bestehender Einbauvertrag

Vor technischen Änderungen aktuell lesen:
- `georg-doc/KFB-Stunt-Car-Race`, Zweig `module/hud-clay-r1`:
  `docs/hud-kit/HUD_CONTRACT_R1.md`, `HUD_LAYOUT_R2.md`, `HUD_SKIN_SPEC.md`, `SLOT_FACE_CONTRACT_R1.md`.
- Autorenstand: `georg-doc/kayfabizarro`, Zweig `design/kfb-clay-hud-skin-kit-r1-2026-11-04`, Draft PR468.
- Kandidatenbericht: `docs/hud-kit/ACTION_OVERLAY_SKIN_CANDIDATES_R1_2026-11-05.md`.

Keine HUD-Zonen verschieben. Leistenhöhe L2: 70,8 Bezugs-px. Der aktuelle Empfänger erwartet je Skin fünf verlustfreie RGBA-WebP-Flächen `sk_<skin>_slot_face{,_hover,_click,_active,_disabled}.webp`, je176×176, gleicher Anker/gleiche Alphaform; außen Alpha0/RGB0. Runtime-Namen: Reactor Blue → `blue`, Slime Green → `slime`, Hazard Yellow → `hazard`. Keine zusätzliche Mulde/Rahmen in der Face-Datei. Die Gehäusefassung bleibt eine eigene Ebene.

Der bisherige R7-Ablagenvertrag hat Höhe288 und Periode224. Neue gemalte Leisten passen nicht allein durch Umbenennen dazu. Liefere entweder passende neue Produktionssegmente oder einen klar gemessenen Adaptervorschlag für Kartenkante. Zustandsbilder müssen der vereinbarten Skin-Fläche entsprechen; eine CSS-Helligkeitsprobe ist keine fertige Lieferung der fünf Dateien. Bewegung macht der bestehende Deformer. Master-Kit-Bedienelemente wie Regler und Reiter nach Bedarf aus den vorhandenen Quellen mitführen; Slider nicht als Standardbutton zweckentfremden. Almanach, Zielhinweis, Zahnrad und Radio-/Settings-Overlays bei der Vollständigkeitsprüfung berücksichtigen. Kein neuer Minimap-/Tacho-Auftrag.

## Geforderte Lieferung und Abnahme

Liefere ein vollständiges Layout je Skin mit Hauptleiste/Reise, Radio, Header und geöffnetem Panel, dazu 4-/5-/6-Auswahl, leeren Kontext sowie Zustände. Verwende das gemeinsame Layoutsystem für alle drei, ohne ihre Formensprache einzuebnen. Ergänze eine kompakte responsive Vergleichsansicht und einen vollständigen Teile-/Quellenplan.

Jede Prüfung erhält ein ehrliches Ergebnis:
- Quellen-/Stiltreue, konstruktive Übergänge und Ornament-Hierarchie.
- Gleiche Zellmaße bei allen Anzahlen; keine versehentlichen zusätzlichen Rahmen.
- Titel, Reiter, X, Beschriftungen und Inhalt ohne Kollisionen; Warnstreifen nicht unter Reitern.
- Lesbarkeit, Pixelbedarf und Verhalten bei kleinen/großen Ansichten.
- Vollständige Teile/States/Anker/Innenabstände/Stretchbereiche/Mindestgrößen im Manifest.
- Vollständiger HUD-Abgleich mit den bestehenden Rollen und Overlays; fehlende Teile klar benennen.

Erst source-faithful Gesamtansichten zur Bildabnahme, dann Produktionssegmente und Integration durch Kartenkante. Keine Selbstfreigabe durch technische Testzähler. Ein unabhängiger kurzer Sichtcheck soll gerade die Nähte und das Verhältnis der neuen Teile zu den Originalen prüfen. Georg entscheidet die Gestaltung. Das Spiel bleibt beim bestehenden Runtime-Owner; kein zweiter HUD-Renderer, kein Auto-Import, Merge oder Deployment.

Arbeite bis zu einer zusammenhängenden Lieferung für diese drei Skins. Bitte Georg nicht um Abnahme jedes einzelnen Details und erfinde keine weitere Konzeptphase.
