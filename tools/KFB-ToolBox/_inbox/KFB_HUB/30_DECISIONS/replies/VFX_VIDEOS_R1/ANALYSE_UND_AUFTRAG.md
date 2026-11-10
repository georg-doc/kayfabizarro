# VFX-Videos R1 · was die drei Videos wirklich zeigen, und was daraus folgt (WS0, 11.11.2026)

Anlass: q585 FAIL (Kontakt-Ring = Eigenbau-Shader, AI-Slop). Georgs drei Videos lagen nur im ungemergten PR #113 (Intake #114). Die Notizen dort beruhen auf YouTube-Kurzbeschreibungen (0 Bildauswertungen). WS0 hat die Videos am 11.11. selbst angesehen: Kapitel, Untertitel und je 4–6 Standbilder an den Arbeitsstellen.

## Was die Videos zeigen

**1 · Riot (Ethan Du Toit bei Abe Leal 3D, 54 min)** https://www.youtube.com/watch?v=XJP3Lm9HlyY
Ein Angriffs-Hieb um eine Figur, Schritt für Schritt:
1. Pfadkurve um die Figur in Blender (12:04).
2. Volumen-Netz entlang der Kurve, ein gebogenes Band (14:17).
3. UVs der Länge nach abgewickelt, Export (19:31).
4. Textur in Krita von Hand gemalt (21:42–30:00): kachelbare Streifen mit Flammenzungen in Schwarz, Grau und Weiß, die Form entsteht auf Hilfslinien.
5. Material in Unreal: Textur läuft entlang des Bandes, Farbe über Verlauf (34:21), Noise und Masken fressen die Ränder aus (36:56), World Position Offset bewegt das Netz (41:30).
6. Feinschliff im Spiel an der Figur (45:18): „die Kanten fühlen sich noch nicht richtig an“, Hauptvolumen schneller.
Kern: **Form = gemaltes Netz plus gemalte Textur. Shader bewegt und frisst nur.**

**2 · Smeaf (5 min)** https://www.youtube.com/watch?v=yNZ1j1hehMw
Schwert-Hieb in Blender:
- Bandnetz in Hiebform.
- Transparenz-Verlauf und Voronoi-Muster im Material.
- Ein Schwellwert wird über die Bilder hochgefahren, bis der Hieb von hinten nach vorn ausfrisst und verschwindet.
- Farbe kommt über eine Farbrampe.
Kern: **Auflösen über Schwellwert auf einer vorhandenen Form**, nicht eine neue Form aus Code.

**3 · Le Lu (29 min)** https://www.youtube.com/watch?v=dMthnzpR-eU
Texturen für Spiel-VFX:
- Zuerst nachsehen, was es schon gibt: eine Datenbank freier Textur-Generatoren und -Quellen (5:00).
- Dann in Krita malen, mit Pinseln für Wind-, Wellen- und Bewegungstexturen (10:00) und mit Radialsymmetrie für Muster (15:00).
- Knotenbasierter Generator (20:00).
- Rauch und Explosion als Blender-Simulation, als Flipbook gebacken (25:00).
Kern: **erst vorhandene Quellen, dann malen, dann generieren. Simulationen werden gebacken, nicht live nachgebaut.**

## Warum der Ring Slop war

Er hatte keine dieser Zutaten:
- keine gemalte Form, kein Netz entlang der Bewegung, keine gemalte Textur;
- keine Quelle aus einem Spiel oder Paket, kein Vergleich in Spielgeschwindigkeit;
- nur ein runder Shader-Ring mit Saum.

Das Briefing in PR #113 verlangte sogar ausdrücklich „einfache Test-Geometrie“ und „muss keinen KFB-Effekt nachbilden“. Genau so ist er entstanden.

## Auftrag für den nächsten Kampf-VFX-Versuch (Faust-Kontakt zuerst)

1. **Form aus der Bewegung:** Bandnetz entlang des echten Faust- bzw. Uppercut-Bogens aus dem Clip (Handknochen-Spur, test/uppercut-measure.mjs), nach Riot und Smeaf.
2. **Textur gemalt oder aus Quelle:** zuerst freie Profi-Texturen und -Flipbooks suchen (Le Lu); sonst eine gemalte Strähnen-Textur (Krita oder Blender-Malen), kein Code-Noise als Form.
3. **Shader nur für Lauf und Auflösen:** Textur läuft entlang des Bandes, Schwellwert frisst von hinten aus; Noise nur am Rand.
4. **Kontaktmoment:** fertiges Flipbook (Aufprall-Stern, Staub) aus freier Quelle, Lichtblitz und Kamerastoß als Stützebene.
5. **Prüfung vor jeder Bildfrage:**
   - nebeneinander mit einem echten Spiel-Vorbild (gleiche Ereignisart) in Spielgeschwindigkeit;
   - von vorn oder von der Seite;
   - gegen PROMPT_PYRO §9 und gegen die Frage aus Video 1: „Fühlen sich die Kanten richtig an?“.
   - Sieht es selbstgebaut aus, geht es nicht in den Hub.
6. Georg bekommt nur fertige Kandidaten (2–3) als Bildfrage. Die Recherche macht das Team.

## Nachtrag · 2D-Cartoon-Ebene über den Blender-Effekten (Georg 11.11.)

Vorbild: https://www.youtube.com/watch?v=Ac06QlbcAyM (Absolum, gezeichneter Beat-'em-up). WS0 hat die Treffermomente über Blitzbild-Suche gezielt angehalten:

| Moment | Was man sieht |
|---|---|
| 1:59 | **Wisch-Bogen (Smear):** breite weiße Sichel entlang des Schlags, harte Kante, dunkler Rand, verjüngt sich zu den Enden |
| 2:05 | **Treffer-Stern:** gezackter weiß-gelber Stern am Kontaktpunkt, 3–4 lange Zacken in Schlagrichtung |
| 2:23 | **Schlag-Explosion beim schweren Treffer:** große gelbe Blitzzacken radial vom Boden, mit Tusche-Umriss |
| 2:29 | **Blitz-Scheibe:** flache gelbe Scheibe mit hellem Rand, nur 1–2 Bilder lang |

Gemeinsam:
- flache Farben (2–3 Töne), keine Verläufe, kein Glühen;
- harte, gezeichnete Kanten;
- große Formen, sehr kurz (2–6 Bilder), Bildfolgen auf Zweiern;
- liegen über dem Geschehen und zeigen den Moment, nicht das Volumen.

Aufteilung für KFB:
- **3D-/Blender-Ebene:** Volumen im Raum, also Hieb-Band entlang der Bewegung, Staub, Rauch, Trümmer (siehe oben).
- **2D-Ebene obendrauf:** die Satzzeichen des Treffers.
  - Wisch-Bogen am Schlag.
  - Treffer-Stern im Kontaktbild.
  - Zacken-Explosion bei Uppercut, Landung und schweren Treffern.
  - Blitz-Scheibe 1–2 Bilder.
  - Dazu Tempolinien.

Technik:
- Gezeichnete Bildfolgen als Sprite zur Kamera gedreht, über das gemeinsame 2D-Modul (q495).
- Abspielen auf Zweiern; vor den 3D-Effekten sortiert.
- Lebensdauer 2–6 Bilder, Größe aus der Schlagrichtung.
- Umriss wie im Vorbild nur dort, wo er zum Effekt gehört.

Quellen in dieser Reihenfolge:
1. Freie, gezeichnete 2D-Effekt-Pakete (Anime- bzw. Cartoon-Hit-FX als Spritesheets).
2. Sonst Einzelbilder per Bild-Briefing, je Familie ein Blatt.

Keine Formen aus Code. Prüfung wie oben: neben dem Vorbild-Clip in Spielgeschwindigkeit.

## Nachtrag 2 · Absolum-Produktion (Web-Chat-Recherche, GitHub #115; WS0-Abgleich 11.11.)

Belegt durch Art Director Maxime Mary (Vortrag Forum des images, Dailymotion xa0sgv6, ab 01:02:00):
- Effekte entstehen zusammen mit Animation und Kampfdesign, nicht als Dekoration hinterher.
- Wenige, starke Schlüsselposen statt flüssiger Zwischenbilder, damit Angriffe sofort reagieren.
- Wisch-Spuren und überzeichnete Silhouetten machen schnelle Aktionen lesbar.
- Erst grob im Spiel testen, dann ausarbeiten.
- Zeichnungen laufen mit etwa 25 Bildern pro Sekunde, das Spiel mit 60; Zeichnungen werden mehrfach gezeigt.

Trefferfolge als Prüfraster (aus Quellen rekonstruiert, keine veröffentlichten Bildzahlen): Ankündigung → Wisch/Smear → Kontakt-Blitz → Hitstop → Nachlauf (Funken, Teilchen) → Erholung (Hauptform weg, bevor der nächste Angriff kommt).

WS0-Abgleich mit dem Stamm: Hitstop ist **aktiv**, anders als der Web-Chat vermutet. Belege:
- `combatPlayer.r2.js` hat eine `createHitStop`-Instanz (V-567) und löst sie bei Nahkampf und Treffern aus.
- `core/uhr.js` hält dafür die Gruppen an.
- Die Dauer kommt je Waffe aus den Reference-JSONs.

Folge für den Neustart: zuerst die vorhandenen Bausteine (Kontaktposition, Hitstop, shotBurst/combatCascade) auf einer Zeitachse abstimmen, die 2D-Satzzeichen genau ins Kontaktbild legen. Der Kontakt-Blitz bleibt 1–2 Bilder bei 60 Hz; das ist Testannahme, Prüfung im Spieltempo.
