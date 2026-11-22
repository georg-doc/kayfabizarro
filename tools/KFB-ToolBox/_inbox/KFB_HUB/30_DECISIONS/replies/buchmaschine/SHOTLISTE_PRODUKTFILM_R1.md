# Buchmaschine: Intro als Produkt-Hero-Film des Buchs, Shotliste R1 (23.11.)

Grundlage: Georgs Absicht über WS0. Das Buch wird im 3D-Raum präsentiert, während die Maschine es analysiert. Es dreht sich, wird gescannt, zeigt Cover und Rückseite, faltet sich zum extrem breiten Umschlag aus, die Kamera fährt am Panorama entlang und zoomt auf Illustrationen, dann umkreist sie das Buch in der Analyse und leitet in den Befund über. Die Maschine ist nur die Bühne.

Modell: WSB-Buch r3b mit echten Scans. Scan-Effekt: „Basic Hologram“ (CC0 Shaders, Daniel Ilett, über patch.gg), auf WebGL übertragen. Schärfentiefe: three BokehPass.

## Licht, ein Aufbau für alle Einstellungen
- **Hauptlicht:** warm und weich, schräg von vorn oben links, auf dem Buch.
- **Zwei kalte Kantenlichter** von hinten links und hinten rechts zeichnen die Buchkontur (Lichtkante).
- **Schwache Aufhellung** von unten.
- **Raum:** dunkel, die HyperNorm-Wände nur als Glimmen im Hintergrund.
- **Maschine:** unscharf im Hintergrund, Rost mit Kantenlicht.

## Bewegung
- Ease-in und Ease-out auf jeder Fahrt und Drehung, nie linear.
- Auf jeden Hero-Moment folgt ein Halt von mindestens 0,8 s.
- Drehungen holen kurz aus und federn beim Stopp leicht nach.
- Geschnitten wird nur zwischen den Einstellungen.

## Einstellungen
| Nr | Einstellung | Kamera | Brennweite (Bildwinkel) | Dauer | Licht und Effekt |
|---|---|---|---|---|---|
| 1 | **Hero auf dem Drehteller.** Das Buch schwebt aufrecht über dem Teller, leicht nach hinten geneigt; das Cover ist voll lesbar. | Halbnah, leicht von unten, schräg von vorn; langsames Push-in | etwa 85 mm (24°) | 3,5 s, davon 1,0 s Halt | Lichtkante beidseitig, Schärfe auf dem Cover, Maschine unscharf |
| 2 | **Langsame Drehung.** Der Teller dreht das Buch einmal ganz: Rücken, dann Rückseite mit Halt, dann wieder das Cover. | Fest, frontal, Buch mittig | etwa 70 mm (28°) | 4,5 s | Die Lichtkante wandert über den Rücken |
| 3 | **Scan-Lichtband über das Cover.** Eine Hologramm-Hülle legt sich um das Buch, ein helles Band fährt von oben nach unten über das Cover. Die Planeten der Maschine glimmen auf. | Frontal, etwas erhöht, minimales Push-in | etwa 70 mm (28°) | 2,5 s | Scanlinien und Fresnel-Rand, kaltes Licht des Bandes auf dem Cover |
| 4 | **Makro mit Schärfeverlagerung.** Die Schärfe wandert vom Titel „Hilfe!!! Ich bin ein Mensch“ zur Figur (Gesicht, Bär); dazu eine leichte Seitwärtsfahrt. | Makro, nah am Cover | etwa 100 mm (20°) | 3,0 s | Geringe Schärfentiefe, Hauptlicht streift |
| 5 | **Ausfalten.** Das Buch kippt in die Waagerechte und schlägt auf. Beide Klappen falten sich aus, dann dreht sich das offene Buch um: Der ganze Umschlag liegt als ein extrem breites Motiv vor der Kamera (Klappe Autoren, Rückseite, Rücken, Vorderseite, Klappe Klappentext). | Fährt zurück in die Weite, leicht erhöht | etwa 50 mm (34°) | 4,0 s, davon 1,0 s Halt aufs ganze Motiv | Hauptlicht flächig, Kanten bleiben |
| 6 | **Seitliche Fahrt über das Panorama.** Die Kamera fährt am Umschlag entlang, von der Autoren-Klappe bis zur Klappentext-Klappe, mit zwei Zoom-ins samt Halt (schreiende Frau, Comic-Tiere). | Parallel zum Umschlag, nah | etwa 70 mm (28°), bei den Zoom-ins 100 mm (20°) | 4,5 s | Die Schärfe folgt dem Motiv |
| 7 | **Orbit während der Analyse.** Das Buch dreht sich wieder mit den Innenseiten nach oben. Die Hologramm-Scanlinien laufen über die Seiten, zwei Seiten blättern um (Mammut-Doppelseite), die Kamera umkreist das Buch. | Orbit um etwa 120°, halbnah | etwa 60 mm (30°) | 4,0 s | Scan-Effekt, die Planeten tasten mit dünnen Bögen ab |
| 8 | **Übergang in den Befund.** Der Scan stockt auf einer Seite und das Hologramm kippt auf Warnfarbe. Das Buch sinkt auf den Teller, die Kamera zieht zurück auf die ganze Maschine. Damit beginnt der Befund (Umbau zum Sternbild). | Vom Halbnah zurück in die Totale | 50 auf 35 mm (34° auf 45°) | 2,5 s | Warnlicht, die Maschine wird hell |

Länge des Intros: etwa 28,5 s. Danach folgt der Ablauf aus dem Regiebuch (Befund, Sezierung, Entscheidung, Entsorgung).
