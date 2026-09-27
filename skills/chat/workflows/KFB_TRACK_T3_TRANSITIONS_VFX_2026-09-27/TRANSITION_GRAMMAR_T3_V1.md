# T3 Übergangsgrammatik v1

## Leitbild

Eine KFB-Strecke wechselt nicht an einer Schnittkante von „Rennstrecke“ zu „Stadt“ oder „Natur“. Mehrere sichtbare Systeme lösen sich **zeitlich und räumlich versetzt** ab. Beim Fahren wirkt das wie ein gekneteter Zusammenhang, nicht wie zwei aneinandergelegte Baukästen.

## Normalisierte Übergangsachse

Jedes Modul besitzt `u = 0…1` entlang der Fahrtrichtung. Die reale Länge wird vom Track Core bzw. der konkreten Strecke bestimmt; als erster Produktionskorridor gelten 60–100 m. Kein Layer darf alle anderen an derselben `u`-Position umschalten.

| Layer | typisches Fenster | sichtbarer Vorgang |
|---|---:|---|
| Fahrbahnmasse | 0.05–0.72 | Racing-Oberfläche wird abschnittsweise ruhiger, dann Stadtstraße oder Naturweg; Kontaktfläche bleibt geschlossen und fahrbar. |
| Markierungen | 0.10–0.82 | Streifen werden kürzer, versetzen sich, tauchen als Knetsegmente ab und setzen sich in Zielrhythmik neu zusammen. Kein Alpha-Fade. |
| Knetstrang / Bande | 0.00–0.55 | Prallwulst wird niedriger, öffnet Sichtfenster und geht in Bordstein, Böschung, Graben oder Zaun-Sockel über. |
| Boxengasse / Nebenarm | 0.15–0.88 | Zweigt als echte Spur ab; Ein- und Ausfahrt haben eigene sanfte Knetlippen, niemals eine aufgemalte Abzweigung. |
| Bordstein / Bürgersteig | 0.28–1.00 | Helle Knetsteine beginnen vereinzelt, verdichten sich und werden zum durchgehenden Stadt-Rand. |
| Naturband | 0.35–1.00 | Grasfladen, niedrige Böschung, Graben und Zaun treten in gestaffelten Dreiergruppen hinzu. |
| Props / Landmark-Rhythmus | 0.45–1.00 | Erst nachdem die Großform lesbar ist; echte KayKit/Tiny-Treats-Teile, nicht zufälliger Scatter. |

Die Fenster sind Startwerte, keine universellen Meterangaben. Entscheidend ist die Staffelung.

## Aktuelle Pflichtfamilien

### A · Track → City

- Fahrbahn bleibt dunkel und breit; sie wird zur Stadtstraße, nicht abrupt ersetzt.
- Außenmarkierung wird zuerst unterbrochen; Mittelmarkierung setzt später in Stadt-Rhythmik neu an.
- Prallwulst wird zu hellem Bordstein aus gequetschten Knetsteinen.
- Dahinter entsteht ein etwas hellerer, ruhiger Gehweg; anschließend Hauseingänge, Bäume und Stadtmöbel.
- Gebäudehöhen und Fassadenrhythmus kommen aus WorldBuilder/H0, nicht aus frei erfundenen Boxen.

### B · Track → Nature

- Prallwulst wird zuerst breiter und niedriger, dann Böschung oder Graben.
- Zaun steht nicht direkt an der Asphaltkante; Sockel/Graben bilden einen lesbaren Sicherheitsraum.
- KayKit/Tiny-Treats-Zaun- oder Pflanzenmodule werden source-identisch isoliert gezeigt, bevor sie deformiert/skaliert werden.
- Pflanzen, Felsen und Zaunpfosten folgen Dreiergruppen und Sichtachsen, keinem Zufallsregen.

### C · Nature/City → Track

- Umkehrung ist nicht bloß rückwärts abgespielt: Richtung, Blickführung und Beschleunigungsraum bestimmen, welche Layer zuerst lesbar werden.
- Der Track-Knetstrang sammelt die Randmassen sichtbar ein; Markierungen erscheinen zuletzt vollständig.

## Reservierte spätere Familie · Pit Lane und Auf-/Abfahrten

Die Anschlussnamen und Layer bleiben im Vertrag, der Design-/Geometriepass folgt jedoch erst nach T4:

- Boxengasse als geometrischer Nebenarm mit eigener Breite und Anschlusskurve;
- Track-Strang bleibt Hauptmasse, Pit-Lippe niedriger und ruhiger;
- Markierungen führen über mehrere Segmente in die Box statt an einem Pfeil umzuschalten;
- Auf-/Abfahrten verwenden dieselbe Staffelung für Fahrbahn, Rand, Markierung, City und Nature.

Brief: `CLAUDE_DESIGN_LATER_JOBS_PIT_RAMPS_BILLBOARDS.md`.

## Anschlussvertrag

Jedes exportierte Modul benennt mindestens:

- `centerline_in`, `centerline_out`
- `surface_left`, `surface_right`
- `barrier_left`, `barrier_right`
- `curb_left`, `curb_right`
- `sidewalk_left`, `sidewalk_right`
- `nature_left`, `nature_right`
- optionale `pit_in`, `pit_out`
- Boden- und Unterseitenkontakt sowie lokale `forward/up/right`-Achsen

Andockpunkte sind leere Objekte/Nodes mit stabilen Namen. Visuelle Teile dürfen überlappen; Fahr- und Kollisionsflächen dürfen weder Lücke noch Doppelbelegung erzeugen.

## Deformation

- Skalieren, biegen und umfärben ist erlaubt, wenn die Quellidentität lesbar bleibt.
- Fahrfläche und Kontakt bleiben glatt genug für die bestehende Physik.
- Handspuren sind reliefartig und maßstabil; keine großen Krater oder verformte Reifenebene.
- Knetstrang, Rand und Stützen reagieren weich; sie ersetzen nicht die Kollisionslogik.

## K2 Materialvertrag

- Basis ist `clay-material.v10` mit `clay-relief.v4` und `clay-toolmix.v1`, nicht v8.
- Häuser/Türme, Strang/Stützen, Gelände, Kronen/Büsche, Stämme, Fels, Wolken und Karts behalten ihre bewiesenen Klassenmischungen.
- Fahrbahn bleibt vorerst `legacy = 1`, weil ihr Straßenprofil ausdrücklich erhalten werden soll.
- Facetten laufen an Zellgrenzen aus; harte dunkle Polygon-Scherben dürfen nicht zurückkehren.
- Spachtel-Querraster und Macro-Maserung sind bekannte Fehlerquellen. Sie werden nicht als Stilmittel wieder eingeschaltet.
- Übergänge variieren Profilgewichte räumlich gestaffelt. Sie schalten nicht alle Werkzeuge an derselben `u`-Position um.

## Biom-/Seed-Vertrag

Ein Zonen-Seed bestimmt gemeinsam, aber über getrennte Rollen:

- Track-/Randpalette;
- Terrain-/Vegetationspalette;
- K2-Klassenprofil;
- Licht-/Mood-Preset;
- VFX-Profil;
- optionale WFC-Füllung außerhalb der gesperrten Route.

Der Seed ist reproduzierbar und exportierbar. WFC oder andere Generatoren dürfen Track Core, Fahrkorridor, Landmark-Anker und Ground-/Camera-Clearance nicht verändern.

## Erfolg

Ein Übergang ist gelungen, wenn er aus Fahr-, Mitfahr- und Fußperspektive als ein zusammenhängender Ort wirkt, bei schneller Fahrt früh lesbar bleibt und an keiner einzelnen Querlinie „umschaltet“.
