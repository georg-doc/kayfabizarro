# InfiniteRooms · Endlos-Dungeon und Raumdarstellung · Roadmap R1

17.11.2026 · von Georg zur Umsetzung freigegeben · WSA Patch → Status für WS0.
Privater Prüfstand, kein Merge. Ausgangspunkt der aktuellen Arbeit: `49ee3c84db867c1084fa9a2b38bd81605fc89f5e` der InfiniteRooms-Site. Game-Integration bleibt bei WS0 nach Georgs PASS.

## Ziel

Ein fortlaufend begehbarer, reproduzierbarer Dungeon durch den KFB-Deckkatalog (Zielvorstellung: etwa 130 Decks), mit Erkundung und Guide auf denselben Verbindungen, freiem Rückweg, optionaler Zerstörung und variierender Architektur. Nur ein begrenzter Ausschnitt ist geladen. Pro Raum sind eine Karte, vier Karten oder eine Page mit Marginalien möglich. Die tatsächliche Katalogvollständigkeit ist vor einer breiten Aktivierung zu prüfen.

Karten, HyperNorm und Farbbänder sind Darstellungszustände desselben Raums. Je Übergang werden genau zwei Zustände verwendet. Ein räumlich stabiler Dissolve lässt sich in beide Richtungen steuern. Die Darstellung entscheidet nicht über Treffer, Loot oder Sieg/Niederlage.

## Verifizierter Ausgangsstand

- Seed-basierter nativer Dungeon-Generator mit Raum-/Wegprüfung; noch kein fortlaufendes Deck-Streaming.
- Fester Fünf-Raum-Rundweg mit Karte, freiem Rückweg, Guide, optionalem Zerstörungsabzweig und Zylindervariante.
- Karten, HyperNorm und Farbbänder sowie ein erster gegnerfortschrittsabhängiger Reveal sind vorhanden, aber nicht als allgemeiner Oberflächenübergang im zerstörbaren Kartenraum vereinheitlicht.
- Im Kartenraum: ein CombatTarget-Anschluss, nativer Bruchgraph, gleiche Solid/Air-Daten für Geometrie/Kollision, begrenzte Rapier-Trümmer und verbundene Kartenkörper. Reset ist gegen Wiederaufbau durch die Figur geschützt.
- Lokale Verankerung am Kartenrahmen ist kein räumlicher Last-/Gebäudegraph. Folgeschäden und erneutes Zerstören gelöster Schollen sind offen.
- Der kontrollierte Performance-Nachtest unter geringer Rechnerlast ist weiterhin offen. Funktionsaufnahmen sind keine Performance-Abnahme.

## Reihenfolge und Abnahme

### 1 · Gemeinsamer Raumzustand und Oberflächenübergänge — IM PRIVATEN PRÜFSTAND UMGESETZT

- [x] Versioniertes Raumzustandsformat: stabile Identität, Inhaltszuordnung, Entdeckung/Fortschritt, getrennte Oberfläche und Verweis auf den bestehenden Zerstörungsbesitzer.
- [x] Paarweise Übergänge Karten ↔ HyperNorm, Karten ↔ Farbbänder, HyperNorm ↔ Farbbänder.
- [x] Fester Muster-Seed; Fortschritt 0..1, weiche Kante und Mustermaßstab; Rücklauf verwendet dieselbe Maske.
- [x] Wand, Boden, Decke und neue/liegende Bruchstücke verwenden den gleichen Zustand; Musterkoordinaten bleiben beim Lösen erhalten.
- [x] Exakte Endpunkte, kein Alpha-Loch und keine Änderung der Collider durch Darstellung.
- [x] Geschützter vollständiger Prüfstand-Reset; keine späten Worker-Reste.
- [x] Kanonische Shader weiterverwenden; ein HyperNorm-Kern, vorhandenes Licht, ein Host-Takt und vorhandener Audio-Besitzer.
- [x] Alle Paare in beide Richtungen, unterbrochener Rücklauf, Bruch während Übergang und Reset live prüfen; Code-/Funktionsbelege bereitstellen.

Eine zustandsseitige Serialisierung ist noch keine vollständige Wiederherstellung zerstörter Geometrie. Letztere gehört zu Schritt 2 und braucht bestätigte Delta-/Snapshot-Daten des vorhandenen Geometriebesitzers.

### 2 · Kleiner gestreamter Dungeon mit zwei Decks — IN ARBEIT

- [ ] Stabile Raumadressen aus Welt-Seed, Deck-/Karten-IDs und Generator-Version. Layout hängt nicht von Besuchsreihenfolge ab.
- [ ] Inhalts-, Layout- und Dekorationszufall getrennt halten.
- [ ] Aktuellen Raum und erreichbare Nachbarn laden; Look-ahead nach Reisegeschwindigkeit, Rückweg und Sichtbarkeit; Entfernungshysterese gegen Ladeflattern.
- [ ] Entfernte Collider, GPU-Texturen und Geometrien gezielt freigeben; gemeinsamer LRU-/Speicherhaushalt.
- [ ] Raumzustand nach Entladen/Wiederladen identisch: Entdeckung, Loot-IDs, Abschluss, Oberflächenmaske und bestätigte Zerstörungs-Deltas.
- [ ] Begrenzte jüngste Zerstörungszustände vorhalten; Rekonstruktion entfernter Räume nur nach expliziter Regel, nie sichtbar durch den Spieler hindurch.
- [ ] Rückreise, Reset, Versionswechsel und längere Fahrt prüfen; Speicher erreicht ein Plateau statt weiter zu wachsen.

#### Zwischenstand 2a · Wiederkehr zerstörter Räume

- [x] Versionierter Checkpoint mit tatsächlichem Solid-/Air-Feld, bestätigter nativer Trefferhistorie, Ablösungen und bekannten Bruchflächen; Oberflächenzustand, Entdeckung und Audio-Rezept bleiben erhalten.
- [x] Wiederaufbau über denselben nativen Bruch-Besitzer; Shader-Maske und Rapier-Kollision geprüft. Folge-Treffer erzeugen bereits abgefallene Teile nicht erneut.
- [x] Begrenzter, injizierter Residency-Besitzer: Laden/Entladen/Wiederkehr im Fünf-Adress-Funktionstest, echte Collider/Bodies werden freigegeben. Budgetüberschreitung hält den geladenen Raum statt gespeicherte Zerstörung still zu verwerfen.
- [x] Privater Kartenraum: „Raumstand merken“ und „Zum Eingang & Wiederherstellen“. Speicherung nur in der laufenden Sitzung, nicht über einen Seiten-Neustart hinweg.
- [ ] Den Residency-Besitzer in einen tatsächlich durchlaufbaren Mehrraum-Plan integrieren. Die fünf Testadressen sind keine fünf bereits verbundenen Spielräume.
- [ ] Zweiten realen Deck-Kartensatz samt Quellenmanifest aufnehmen; im Site-Paket liegt derzeit nur `forget_utopia`. Keine Umbenennung desselben Decks als Ersatz.
- [ ] Karten-/GPU-Ressourcenhaushalt, Sicht-/Geschwindigkeits-Vorladen, freie Rückwege und durchgehenden Guide live abnehmen. Der bestandene Headless-Physiktest ersetzt diese Prüfung nicht.

Kurzlebige Trümmer werden beim Wiederladen nicht erneut ausgespielt. Abgelöste Bereiche bleiben als fehlendes Material erhalten. Native Felder werden ohne Waffen-VFX aus bestätigter Historie reproduziert; der native Algorithmus ist über die Checkpoint-Revision gebunden. Ein Versionswechsel braucht eine explizite Migration oder Ablehnung.

### 2b · Räumliche Audio-Rezepte — GEPLANT, Datenanschluss in Schritt 1

Georgs Ergänzung vom 17.11.: Räume erhalten Zuordnungen zu Charakter-/Deck-Musik, Instrumentals, Biom-Stimmung und Ambient-Betten. Nur Katalogreferenzen in Raumrezepten, keine kopierten Audiodateien und keine neuen Stream-Besitzer. Die vorhandene Radio-/Musik-Auswahl bleibt über Laufen, Jetpack und Fahrzeug erhalten; eigene Musik läuft über diesen vorhandenen Pfad.

- [x] Gemeinsamer Zustand führt ein versioniertes, host-eigenes Audiorezept als Daten. Räumliche Wiedergabe und Synth bleiben geplant.
- [ ] Aktuelle WS0-Kataloge und Besitzverträge für Musik, Charakter-Zuordnung, Atmo und Radio prüfen; fehlende Zuordnungen explizit lassen.
- [ ] Hörbare Nachbarschaft aus dem Raum-Verbindungsgraphen bestimmen, auch bei Escher-Verbindungen und gedrehten Räumen. Luftlinie durch beliebige Wände ist keine akustische Verbindung.
- [ ] Durchgänge als begrenzte Klangöffnungen: Abstand, Richtung, Öffnungsgrad, Dämpfung/Tiefpass und Übergangsbreite. Neue Breschen aktualisieren denselben Wegzustand.
- [ ] Nachbarraum beim Annähern vorladen. Quell-/Hörerposition und lokale Schwerkraftrichtung gemeinsam transformieren; optional vorhandene binaurale Ausgabe verwenden, ohne erzwungenes Rollen des Hörers bei Kamerabewegung.
- [ ] Musikwechsel/Überblendung, räumliche Vorschau und Atmo-Betten gemeinsam beim vorhandenen Mixer planen. Nicht denselben Track zugleich im Radio, im Raum und durch mehrere Türen mehrfach starten.
- [ ] Benutzerwahl im Radio respektieren; Musik- und Atmo-Busse getrennt regeln, Sprache/Kampf nach vorhandener Ducking-Regel. Reverb-/Dämpfungsübergänge und Nachhall-Tails beim Raumwechsel/Entladen erhalten.
- [ ] Hin-/Rückweg, gedrehter Raum, Zylinder, zerstörter Durchgang, Pause/Stille, Mute und Wechsel der Reiseart prüfen. Stimmen und vorgeladene Daten begrenzen.
- [ ] Der Visualizer liest weiterhin nur Musik-/Ambient-Pulse des vorhandenen Mixers. Kein zweiter AudioContext, Analyser oder Musik-Takt.

### 3 · Raumrezepte und Deckkatalog — GEPLANT

- [ ] Geprüftes Manifest aller verfügbaren Decks/Pages/Karten und ihrer Quellen.
- [ ] Datenrezepte für eine/vier Karten, Pages, Beleuchtung, Form, Anschlüsse, Fahrbreiten, Begegnungen und Guide-Pfade.
- [ ] Deckwechsel und Gewichtung: Zusammenhang bewahren, zugleich Abwechslung; keine zufällige Verdopplung derselben Motive links/rechts.
- [ ] Übersichtskarte und stabile Sprungziele für Kapitel/Decks; optionale Zerstörungsabkürzungen verändern denselben Verbindungsplan.
- [ ] Gute Raumfolgen kuratieren; Zufall allein ist keine Dramaturgie.

### 4 · Sechs Richtungen und ausgewählte Escher-Verbindungen — GEPLANT

- [ ] Geometrisches Grid plus expliziter Raum-Verbindungsgraph. Bei innen größeren Räumen bedeutet physische Nähe nicht automatisch Nachbarschaft.
- [ ] Anschlussrahmen inklusive Orientierung, Schwerkraftfeld, Öffnungsgröße und sicherem Vor-/Rückweg.
- [ ] Gezeigte Geometrie, Kollisionskörper und Fahrwege stimmen überein; reine Shader-Biegung ersetzt keine Kollision.
- [ ] Geführte und freie Bewegung verwenden dieselben Übergänge. Starke Illusionen als geprüfte Rezepte; subjektiv kontinuierliche Übergänge brauchen kein sichtbar inszeniertes Portal.
- [ ] Beim Nachladen auch durch Übergänge sichtbare Räume berücksichtigen; Ursprung bei langen Reisen kontrolliert nachführen.

## Gemeinsamer Zustandsvertrag

Pro Raum: `schema`, `roomId`, `seed`, Generator-Version, Deck-/Karten-IDs, Entdeckung/Abschluss, Oberflächenpaar mit Fortschritt/Ziel/Seed/Maßstab/Kantenbreite und Zerstörungsbesitzer/-Revision. Ein Renderer, ein Physikbesitzer und ein Host-Takt. Renderer und Shader lesen; Spielregeln liefern Parameter. Materialwechsel erzeugt keine Treffer.

Entdeckung und zeitweilige Sichtbarkeit getrennt halten: Eine gefundene Karte kann wieder verdeckt werden, ohne automatisch aus der Sammlung zu verschwinden. Der Prüfstand-Reset darf auf den Anfang zurücksetzen; spätere Spiel-Rekonstruktion darf bereits verdiente Funde nicht stillschweigend löschen.

## Gameplay-Anschlüsse für WS0 — NOCH NICHT VERDRAHTET

- Treffer/Zeitdruck können HyperNorm-Verdeckung erhöhen; Heilung, Raumabschluss und eingesammelte Fluff-Kuben können Karten wieder freilegen. Werte, Schwellen und Verlustbedingungen bleiben Game-Entscheidungen.
- Vorhandene Signale für besiegt/geheilt/Raumabschluss zuerst nutzen. Fluff-Kuben- und Boss-Verträge am aktuellen Game-Stamm prüfen, keine Ereignisnamen erfinden.
- Vorhandener CombatPlayer entscheidet Treffer/Explosion einmal; Raum setzt Geometrie um. Effekte und Ton bleiben bei ihren Besitzern.
- Audio-Pulse nur lesen (`kfb.audio-presentation-pulse/1`), kein weiterer AudioContext/Analyser/Takt. Audio darf Präsentation beeinflussen, aber nicht heimlich den Spielfortschritt verändern.
- Erst nach Georgs PASS durch WS0 in den Stamm integrieren. Diese Roadmap ist Status/Arbeitsliste, keine Merge-Freigabe.

## Bewusst später

Gerichtetes Zufließen als zusätzliche Maske; Richtung aus örtlicher Schwerkraft statt Kamera. Drei Oberflächen gleichzeitig, Video-/YouTube-Einbettung, interaktive Lernakademie und weitere Medien bleiben außerhalb dieser Umsetzung. Ebenso noch keine unbegrenzte Persistenz aller dynamischen Schuttkörper.

## Verfolgung

Aktuelle private Site: https://kfb-infiniterooms.frizzlebob.chatgpt.site/blaster-lab/
Lokale Übergabe dieser Runde: `docs/handoffs/room-surface-state-r1/RETURN.md` in der Site-Quelle. Nach Abschluss folgt eine additive GitHub-Statusdatei mit Quell-Head, Belegen, Prüfergebnis und offenen Game-Anschlüssen; diese initiale Roadmap behauptet keine fertige Umsetzung.

Audio-Ergänzung mit Shepard-/Drone-Einschätzung: `WSA_AUDIO_SLICE_INFINITEROOMS_R1_2026-11-17.md` im selben GitHub-Hub-Ordner. Abschließender Status dieser Stufe: `WSA_STATUS_ROOM_SURFACE_STATE_R1_2026-11-17.md`.
