# WORLD-M2A-R1 · Playability + Performance

Status: **READY · WORK SOL HIGH · BOUNDED CORE REPAIR**  
Datum: 2026-09-27  
Owner: bestehende World-M2A-Runtime · kein neuer World-, Movement-, Camera- oder Drive-Owner  
Source: PR #253 · `work/world-drive-interact-m2a-2026-09-27@b34d9566450cbc72cb0eb556cab09126c8587503`  
Feste Evidence-Route: <https://kayfabizarro.pages.dev/kfb-hub/stage/world/world-drive-interact-m2a/>

## Menschliches Urteil

`HUMAN_TUNE · NOT_PLAYABLE`

Der automatische 34/34-Browserlauf belegt nur Packaging, Ladepfade und formale Moduswechsel. Er ist keine Spielbarkeitsabnahme.

## Ziel

Exakt dieselbe Szene muss ohne neue Features als kleiner World-MVP begeh- und befahrbar werden:

1. Straße, Grünflächen und sichtbare Wege besitzen eine lückenlose befahr-/begehbare Kontaktfläche.
2. Das Fahrzeug steht mit plausibler Rad-/Bodenlage auf dem Terrain.
3. Zu-Fuß- und Fahrzeugbewegung reagieren flüssig und mit brauchbarer Geschwindigkeit.
4. Die sichtbaren Grundzustände passen: Idle, Walk/Run, Enter, Drive, Exit.
5. Ladezeit und Frametiming werden vor/nach dem Eingriff mit derselben Szene messbar dokumentiert.

## Fester Messlauf vor jeder Änderung

Gleicher Browser, Rechner, Viewport, Seed/Route, Qualitätsmodus und Kamerastart:

- kalter Start bis zur ersten steuerbaren Bewegung: `time_to_first_control_ms`;
- 60 Sekunden Zu-Fuß auf Straße und Grün;
- `E` ins Auto, 60 Sekunden Straße, dann 60 Sekunden Grün/Wege;
- Aussteigen und kurzer Flugwechsel;
- Framezeit Median und p95 in Millisekunden;
- Long Frames über 50 ms;
- sichtbare Eingabereaktion, tatsächliche Wegstrecke pro 10 Sekunden;
- Ground-Clearance von Rädern/Fahrzeugkörper sowie Anzahl Terrain-Durchfälle.

Primärmetrik: **p95 Framezeit**, kleiner ist besser, Ziel **≤ 33,3 ms** im festen Desktop-Lauf.  
Sekundär: **0 Terrain-Durchfälle**, **korrekter Fahrzeugkontakt**, kalter `time_to_first_control` **≤ 15 s** und keine sichtbare Dauer-Ruckelbewegung.

Wenn die Messumgebung zwischen Baseline und Kandidat nicht vergleichbar ist: `INCOMPARABLE` und STOP, keine erfundene Verbesserung.

## Maximal zwei kleine Kandidaten

### Kandidat 1 · Kontakt und Zustände

- sichtbare Terrain-/Straßen-/Weg-Geometrie auf eine lückenlose World-Kontaktfläche abbilden;
- echte Abgründe nur als bewusst markierte Geometrie zulassen;
- Fahrzeug-Radkontakt und visuellen Fahrzeug-Offset aus der vorhandenen Drive-Ownership korrigieren;
- offensichtliche falsche Movement-State-Übergänge beheben, ohne neue Animation Engine.

### Kandidat 2 · größter gemessener Laufzeitblocker

Nur den nach der Baseline größten belegten Verursacher bearbeiten, zum Beispiel:

- nicht kritische Residents/Props/Materialvarianten später laden;
- identische Clay-Materialien und Texturen wiederverwenden statt pro Objekt zu duplizieren;
- unnötige Shadow-Caster oder zu teure Schattenqualität reduzieren, falls die Messung sie als Ursache zeigt;
- Delta-Time-/Update-Takt normalisieren, falls damit die Ruckler belegt sind.

Kein ungemessener Rundumschlag. Pro Kandidat exakt dieselbe Messsequenz wiederholen.

## Nicht in R1

- kein neuer Track, HUD, Billboard, Water, Combat oder Inventar;
- keine neuen Fahrzeuge oder Assets;
- kein visueller Clay-Redesign;
- keine zweite Physics-/Movement-/Camera-Architektur;
- der Boulder-/Prop-Schatten-Hellkantenfehler bleibt dokumentiert und wird nur mitgenommen, wenn derselbe belegte Schatten-Fix zugleich die Hauptperformance verbessert.

## Stop-Regel

STOP nach zwei Kandidaten, beim ersten nicht vergleichbaren Messlauf oder wenn der Fix einen zweiten Owner erfordern würde. Kandidat und Evidence erhalten; keine dritte Patchrunde.

## Abnahme

Genau ein Human Gate: Georg kann auf derselben festen Route

**zu Fuß → Grünfläche → Auto → Straße → Grün/Wege → Aussteigen → Flug**

ohne Durchfallen und ohne unspielbares Ruckeln ausführen. Rückgabe: `PASS` oder `TUNE`, plus gemessene Vorher-/Nachher-Werte.
