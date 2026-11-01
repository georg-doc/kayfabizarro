# Konzept Planeten: Auf- und Untergang, Puls, Tönung, Story-Stimmung (V-1186) · R1 · 01.11.2026

Von WS-Himmel an WS0. Probe gebaut hinter `skymove=1`, Standard unverändert. Nichts in den Stamm.
Videos und Bilder: `aufgang_puls.webm`, `planet_toenungen.jpg`.

**Das Modell.** Ein Planet ist Bühnenbild: Er steht nicht fest, sondern hat eine Phase. Die Phase läuft mit der Uhr und mit dem Fahrweg, und daraus folgen Höhe und Richtung. Wie auch beim Wetter gibt es keine zweite Quelle: Uhr, Rig und Stimmungsdaten bleiben die einzigen Schreiber.

## 1 · Bahn
- **So läuft es:** Phase = Saat des Körpers + Stunde ÷ `hours` + Fahrweg ÷ `road_m`. Höhe geht von knapp unter dem Horizont bis zur Oberkante unter der Bildkante, Richtung wandert um `arc_deg`.
- **Auf- und Untergang:** Der Körper taucht hinter Gelände und Horizont auf. Er braucht kein Überblenden.
- **Rückwärts:** Der Fahrweg zählt mit Vorzeichen entlang der Fahrzeugrichtung, rückwärts verstärkt (`gain_back`), damit man es im Bild sieht. In der Probe sinkt der Planet beim Zurücksetzen sichtbar.
- **Bild bleibt fest:** Keine Rotation, gemaltes Licht bleibt richtig (`orientationPolicy` im Register: Rotation aus). Orientierungsdaten brauche ich dafür nicht.
- **Daten:** `bodies.motion` in `kfb-sky-r1.json`. Neue Planetentypen kommen nur über `planets.atlas` und `planets.kinds`, der Datenweg ändert sich nicht.
- **Offen:** Zur Uhr gekoppelt ist es gebaut, aber nicht zu sehen, weil die Uhr noch steht (WS1). Weil die Phase auch vom Fahrweg abhängt, ist der Himmel nicht mehr allein aus Saat und Ort bestimmt; Prüfungen brauchen darum einen festen Fahrweg (`setRoad`).

## 2 · Puls
- **Heute:** `musicPulse()` hört nur die Jukebox. Die Sky-Card hat dafür einen eigenen Abgriff am Musik-Bus (`cascade/r4/sky-pulse.js`). Zwei Wege für dasselbe.
- **Vorschlag, eine Quelle:** `worldPulse()` in `kfbAudio`: ein Analyser am `master` vor dem Limiter, ausgewertet vom vorhandenen `createPulseTracker`. Kein zweiter AudioContext, kein zweiter Mixer. Die Sky-Card und alles Weitere lesen dann nur noch das. So hört die Welt alles, was wummert: Musik, Bett, Motor.
- **Zu prüfen:** Der Motor brummt dauernd und könnte den Takt überdecken. Darum am Anfang Schläge nur aus dem Bass-Flussmaß, nicht aus dem Pegel. Das muss jemand hören; im Video ist kein Ton.
- **Wirkung:** Hüllkurve wie die Sky-Dice (`max(env·exp(−5,5·dt), Schlag)`). Sky-Dice zeigt auch die Grenze: Dort wurde der Wert von 0,22 auf 0,07 gesenkt, weil es wie ein Fehler aussah. Probe: Größe 2,5 %, Squash 3 % am Planeten, 2,5 % an den Wolken-Karten. Nur Uniforms im vorhandenen Aufruf.
- **Die Probe hört keine Musik:** Der Puls kommt aus `pulsetest=110`, einem festen Takt, weil das Prüfbild stumm läuft. `worldPulse()` ist nicht gebaut; `skyPulse.js` liest heute `musicPulse()`.
- **Später die ganze Welt:** Gras, Fluff, Lampen hängen sich an dieselbe Zahl.

## 3 · Tönung
- **So läuft es:** Das Bild wird zur Palettenrolle des Bioms gemischt, seine Helligkeit bleibt (`bodies.tint`, Rolle `bloom`, Anteil 0,3). Das Motiv bleibt lesbar.
- **Vergleich:** `planet_toenungen.jpg`: ohne, warm, kühl, derselbe Planet an derselben Stelle. Im Bild steht Anteil 0,35.
- **Geltung:** Nur gemalte Planeten, Nacht-Mond nicht. Shader-Körper bleiben wie sie sind.

## 4 · Story-Stimmung (nur Konzept)
- **Vorhanden:** `driveAtmos` mischt schon heute eine Tönung in alle Farben des Rigs und des Himmels (`overlay.tint`, von den Presets genutzt).
- **Vorschlag:** Story-Stimmung wird ein einziger Eintrag in `kfb-drive-moods` (Fluff-Farbe, Anteil), abgeleitet von der Tagesstimmung wie beim KayKit-Creator. Licht, Horizont, Kuppel, Karten und Planeten ziehen automatisch mit, die Planeten-Tönung nimmt dann diese Farbe statt der Biom-Rolle. Kein zweites Licht (V-385).
- **Nacht:** Fackeln, Kristalle, Scheinwerfer, Diskokugeln sind Emission plus der vorhandene Lampenpool, keine neuen Lichter im Rig. Eigener Auftrag, passt nach WS1s Laternen-Verdrahtung.
- **Abhängigkeit:** Erst nach der laufenden Uhr, sonst entstehen zwei Quellen.

## Kosten (Schätzung, nicht gemessen)
| Teil | Rechnung | Zeichnen |
|---|---|---|
| Bahn | wenige Rechenschritte je Körper und Bild | 0 neue Aufrufe, 0 neue Programme |
| Puls | ein Analyser mehr, 1024 Punkte, einmal je Bild | 2 Uniforms im vorhandenen Aufruf |
| Tönung | keine | 3 Rechenschritte je Planetenpixel |
| Story-Stimmung | ein Eintrag mehr im vorhandenen Mix | keine |

## Was ich zuerst bauen würde
1. Bahn und Tönung: laufen schon hinter dem Schalter, brauchen nur Georgs Ja zum Tempo.
2. `worldPulse()`, zusammen mit WS1 oder wer `kfbAudio` gerade hält, und Hörprobe.
3. Story-Stimmung nach der Uhr.

## Was Georg entscheiden muss, in einfachen Worten
1. **Tempo:** Soll ein Planet schon nach wenigen hundert Metern aufgehen wie im Video, oder viel langsamer?
2. **Puls:** Soll der Himmel so sichtbar mitwippen oder nur ganz leicht? Video ansehen.
3. **Tönung:** Sollen Planeten sich dem Land anpassen oder eher ihre eigene Farbe behalten?
