# InfiniteRooms · Audio-Slice R1 · räumliche Rezepte und synthetische Spannung

17.11.2026 · Georgs Ergänzungen · Konzept/Anschlussplanung, noch keine Synth-/Mixer-Implementierung. Gemeinsamer Raumzustand enthält zunächst Datenreferenzen und Parameter. Privat, kein Merge. WS0 bleibt Besitzer von AudioContext, Mixer, Radio, Transport, Stimmen und Ducking.

## Räume hören

Charakter-/Deck-Thema, Instrumental, Biom-Stimmung und Ambient-Bett werden über bestehende Katalog-IDs zugeordnet. Keine neuen Track-Namen oder Zuordnungen erfinden. Ein eigenes Radio-/Musikprogramm bleibt beim Wechsel zwischen Laufen, Jetpack und Auto bestehen. Benutzerwahl und Lautstärkeregler haben Vorrang.

Nachbarräume werden durch ihre tatsächlichen Verbindungen hörbar: Entfernung entlang des Raumgraphen, Durchgangsöffnung, Orientierung und Materialdämpfung bestimmen die Vorschau. Auch Escher-Räume, gedrehte Räume und der Zylinder verwenden die transformierten Anschluss-/Hörerrahmen. Ein neuer Durchbruch ändert denselben Verbindungszustand. Klang kann zum Ausgang führen, ohne dass derselbe Track aus mehreren Türen mehrfach abgespielt wird.

## Spannung als eigene leise Schicht

Georgs Vorschlag: Synth-/Drone-Soundbett und eine Shepard-artige Tonhöhenillusion für Bedrohung, Horror und die Dramaturgie einzelner Deck-Präsentationen. Das passt zum visuellen Eindringen von HyperNorm und ist kontinuierlich parametrisiert steuerbar. Es soll keine dauerhaft maximale Alarmfläche werden.

Einschätzung: Gute Ergänzung für langsame Eskalation und schwer lokalisierbare Spannung. Ein mathematisch kontrollierter Verlauf garantiert aber keine bestimmte emotionale Wirkung; Mischung, Register, Pausen und musikalischer Kontext brauchen Hörproben. Nicht jeden Raum mit demselben Aufwärtsgestus belegen. Ruhe, fallende Bewegung und ein klares Abklingen nach Wiederherstellung sind gleichwertige Rezepte.

Die Tonhöhen-Zirkularität ist durch Roger N. Shepards ursprüngliche Untersuchung belegt: [Circularity in Judgments of Relative Pitch, JASA 36, 2346–2353 (1964)](https://doi.org/10.1121/1.1919362). Sie beschreibt eine Tonhöhenillusion, keinen Nachweis einer bestimmten Horrorwirkung. Eine kontinuierliche Synth-Variante wäre unser eigener nachfolgend zu prüfender Implementierungsentwurf.

## Vorgeschlagene, noch abzustimmende Steuerung

- `hypernorm01`: abgeleiteter Präsentationsparameter. Karten → HN: `p`; HN → Farbbänder: `1-p`; Karten ↔ Farbbänder: `0`. Das ist kein gemessener Flächenanteil und keine automatische Niederlage.
- `tension01`: davon getrennte Spiel-/Dramaturgieentscheidung, 0..1. Kann später aus Verdeckung, Gefahr, Raumrolle und Kapitelverlauf gebildet werden.
- Katalogreferenz `tensionProfileRef`: je Raum/Deck ein geprüftes Rezept, zunächst ungesetzt. Der Raum startet keinen Ton.
- Weitere Synth-Rezeptparameter: Grundregister, Auf-/Abwärtsrate, spektrale Breite, Drone-Dichte, Filteröffnung, leichte Rauigkeit, Raumanteil, Attack/Release und maximaler Pegel. Keine festen Werte als bereits musikalisch abgenommen ausgeben.

Ein mögliches Rezept würde zunächst das Atmo-Bett verdichten, dann eine leise Tonhöhenbewegung hinzufügen und erst nahe hoher Verdeckung mehr spektralen Druck zulassen. Bei fallender Spannung weiche Rücknahme mit Ruhephasen. Werte sollen geglättet werden, mit Hysterese gegen hektisches Umschalten bei einzelnen Treffern.

## Technischer Entwurf für einen späteren Synth-Proof

Eine kleine, feste Zahl oktavversetzter Sinusanteile wird unter einer spektralen Hüllkurve überblendet. Die Stimmen werden am Rand der Hüllkurve leise neu eingesetzt; Frequenz-/Phasenwechsel dürfen nicht klicken. Lautheits-/Energienormalisierung vermeidet ein bloßes Lauterwerden bei steigender Dichte. Die genaue Stimmenzahl und Registergrenzen sind erst nach Hör-/CPU-Prüfung festzulegen.

Für einen ersten Anschluss eher eine begrenzte vorberechnete Loop-Familie oder eine begrenzte Synth-Stimme im vorhandenen Mixer vergleichen. Keine neue AudioContext-/Analyser-Instanz und keine Audio-Taktung per Renderbild. Bei Laufzeitsynthese plant der vorhandene Audio-Besitzer die Parameter auf seiner Audio-Uhr; Frame-Updates liefern nur geglättete Zielwerte. Deterministische Seeds sind für Muster möglich, der Musik-/Radio-Transport bleibt derselbe.

## Mischung statt unkontrollierter Überladung

Bei fast vollständiger HyperNorm-Verdeckung darf die Musik dramaturgisch verdrängt/verfärbt werden: kontrollierte Filterung, Ducking, begrenzte zusätzliche Spannungsschicht oder ein Raum-Rezept. Kein hartes Clipping und kein unbegrenztes Addieren von Tracks. Bass, Stimmenzahl und Gesamtpegel begrenzen; Sprache und wichtige Kampfsignale nach vorhandener Priorität lesbar halten.

Radio-/Benutzerwahl respektieren. Subtilen Horror-/Präsentationsmodus separat aktivierbar machen; kein ungefragtes permanentes Übersteuern eigener Musik. Musik, Ambient und Spannung bekommen geeignete Regler über den vorhandenen Mixer. Pause, Mute, Stille, Entladen und Nachhall-Tails brauchen definierte Zustände. Die rückwärts laufende visuelle Maske verlangt keinen rückwärts abgespielten Musiktrack: Die Spannung kann kontrolliert sinken, während der Transport kontinuierlich bleibt.

## Schritte / Abnahme

- [x] Konzept und Grenzen dokumentieren.
- [x] Datenanschluss im gemeinsamen Raumzustand: Referenzen, `tension01`, abgeleitetes `visual.hypernorm01`; geprüft. Keine räumliche Wiedergabe oder Synth-Stimme gestartet.
- [ ] Mit WS0 Kataloge, Mixereinstieg, Bus-/Stimmenbudget und Benutzerwahl abstimmen.
- [ ] Kleine Shepard-/Drone-Hörprobe gegen neutrales Soundbett vergleichen, zuerst ohne Gameplay-Zwang.
- [ ] Zwei Räume: Hin-/Rückweg, gedrehte Orientierung und hörbare Nachbarschaft; kein Doppelton.
- [ ] Parameterfahrten 0 → 1 → 0, Pause/Mute, Radio-Wechsel, stille Passage und Raum-Entladen prüfen.
- [ ] Optional Raum-Reveal/Fluff-Kuben und Gefahr an bestehende Game-Ereignisse anbinden; keine erfundenen Ereignisnamen.
- [ ] Vor Aktivierung Hörabnahme durch Georg und begrenzten CPU-/Stimmen-Test durchführen.

Embeddings, YouTube und Lernakademie bleiben außerhalb dieser Stufe. Der aktuelle Dissolve-Auftrag baut keine zweite Audio-Engine und keinen fertigen Horror-Modus.
