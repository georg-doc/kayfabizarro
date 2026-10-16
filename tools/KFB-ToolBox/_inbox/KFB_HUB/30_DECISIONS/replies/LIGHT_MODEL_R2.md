# Licht-Modell R2 · ein Licht für alle Stimmungen (V-382) · 17.10.2026

Georg 17.10.: V-346 Licht auf der Staging-Seite = **FAIL bzw. großes TUNE, auch konzeptionell**. WS0 hat die Vorschau selbst geprüft (Tag, Gold, Nacht).

## Befund (warum es konzeptionell scheitert)
| Beobachtung | Ursache |
|---|---|
| FrizzleBob hat einen hellen Saum um die Silhouette | Randlicht (Fresnel) wirkt auf das flauschige Knet wie ein Heiligenschein; Randlicht ist ein globaler Effekt statt einer gerichteten Lichtquelle |
| Nachts verschwindet der Billboard-Rahmen | Rahmen bekommt nur Sonne/Mond; nachts gibt es kein Licht am Ort, nur Absenkung der Helligkeit |
| Karte leuchtet nachts so hell wie am Tag | Karte ist unbeleuchtet bzw. `toneMapped:false`, folgt keiner Stimmung |
| „Gold“ sieht fast aus wie „Tag“ | Stimmungen ändern nur Sonnenwinkel/Schattenlänge, nicht Farbe, Kontrast, Umgebungslicht |
| Figuren wirken aufgeklebt | Figuren haben eigene Gesichtsaufhellung und Randlicht, die Bühne nicht – zwei Lichtwelten |

Kernfehler: **Jede Schicht hat ihren eigenen Trick** (Boden ohne Tonemapping, Karte unbeleuchtet, Figuren mit Selbstleuchten und Randlicht). Dadurch passt in keiner Stimmung alles zusammen.

## Grundsatz R2
**Eine Szene, ein Licht-Rig, alle Schichten werden davon beleuchtet.** Stimmungen sind Einstellungen dieses einen Rigs, keine Sonderwege je Objekt.

### Das Rig (für jede Stimmung dieselben fünf Bausteine)
1. **Hauptlicht** (Sonne bzw. Mond): Richtung, Farbe, Stärke je Stimmung; wirft den Schatten.
2. **Himmel-/Boden-Füllung** (Hemisphere aus Himmels- und Bodenfarbe der Palette V-305): hebt alle Schatten gleichmäßig, damit nachts nichts absäuft.
3. **Praktische Lichter am Ort** (diegetisch, mit Geschichte): Der Billboard hat eigene Lampen, die Rahmen und Karte beleuchten (nachts die Hauptquelle der Bühne, tags kaum sichtbar). Später Laternen, Fenster, Jukebox. Höchstens 2 echte Lichter im Bild, der Rest über Licht-Texturen/Emissive (Budget V-370).
4. **Kartenbild als beleuchtete Fläche**: Die Karte wird vom Rig beleuchtet (kein Selbstleuchten), plus ein **begrenztes** Eigenleuchten nur nachts (Leuchtkasten-Gefühl), gedeckelt relativ zum Rahmen.
5. **Silhouetten-Hilfe nur gerichtet**: statt Fresnel-Randlicht ein schwaches Gegenlicht von hinten oben, das nur in Nacht/Gold zugeschaltet wird; kein Saum breiter als 2 px bei 1080p.

Nicht mehr: Gesichts-Selbstleuchten, globales Randlicht, Boden ohne Tonemapping, unbeleuchtete Karte. Tonemapping einheitlich (ACES für alles); Farbtreue der Karten über Belichtung und Rig, nicht über Ausnahmen.

### Stimmungen = Rig-Einstellungen
| Stimmung | Hauptlicht | Füllung | Praktische | Gegenlicht | Belichtung |
|---|---|---|---|---|---|
| Tag | warmweiß, hoch | hell, Himmel kühl | aus | aus | Referenz |
| Gold | tief, deutlich orange, lange Schatten | wärmer, etwas dunkler | schwach an | an, warm | leicht dunkler |
| Nacht | Mond, kühl, schwach | dunkelblau, aber Schatten lesbar | **Hauptquelle** (warmes Billboard-Licht) | an, kühl | angehoben, damit die Bühne lesbar bleibt |
| Story-Modes (später) | Farbe der sechs Modi nur als Tönung von Füllung und Praktischen (V-292), nie neue Lichtwelt | | | | |

Spender: J17 bleibt Goldstandard für den Gesamtlook (Memory kfb-joyride-gold-standard) – sein Licht-Setup ist die Ausgangsbasis von „Tag“; Krazy-Kat-Warmlicht (Intake 16.10.) und Farbmodell V-305 liefern Gold/Nacht-Farben; PlayCanvas-Idee (V-381): Umgebungslicht weich mit der Tageszeit nachführen.

## Abnahme-Raster (gemessen, nicht geschätzt)
| ID | Prüfung | Schwelle |
|---|---|---|
| L-1 | Billboard-Rahmen in jeder Stimmung lesbar | mittlere Helligkeit Rahmen ≥ 25 % der Karte, Rahmenkante sichtbar |
| L-2 | Karte nie heller als Lichtquelle | Kartenhelligkeit nachts ≤ 1,5 × Rahmen, tags im Bereich der Bühne |
| L-3 | kein Heiligenschein | Saum an Figuren-Silhouetten ≤ 2 px (1080p), in allen Stimmungen |
| L-4 | Stimmungen unterscheidbar | Bildmittelwert Farbe Tag↔Gold ΔE ≥ 8, Gold↔Nacht ≥ 12 |
| L-5 | Figuren gehören zur Bühne | Gesichtshelligkeit ↔ Boden daneben Verhältnis 0,8–1,6 in jeder Stimmung |
| L-6 | Schatten lesbar | Schattenkontrast tags ≥ 25 %, nachts Schattenbereiche nicht schwarz (L ≥ 8) |
| L-7 | Budget | ≤ 2 echte Lichter, p95 ≥ 30 fps Zielgerät |
Beweis: Raster 3 Stimmungen × (Totale, Nah FB, Nah Karte) = 9 Bilder mit Clay, ohne Bedien-Overlays (V-383).
