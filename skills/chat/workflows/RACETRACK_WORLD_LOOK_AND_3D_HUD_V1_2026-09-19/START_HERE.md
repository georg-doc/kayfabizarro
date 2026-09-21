# Racetrack World Look + 3D HUD v1

Status: **P0 · BRIEFING CURRENT · IMPLEMENTATION NOT STARTED**  
Datum: 2026-09-19  
Implementation SSOT: `georg-doc/KFB-Stunt-Car-Race`  
Arbeitsweg: ChatGPT Web + GitHub + KFB Stage

## Ziel

Die erste große Fahrprobe bekommt eine gemeinsame Bildsprache: echte OSM-Stadt und längere Track-Abschnitte, die räumliche Logik von Tiny Skies/Travel, KayKit als Gebäude- und Bewohnerfamilie, Kenney als gezielte Spiel-/Effektquelle sowie ein **eigenes 3D-Tacho-/Radio-/Minimap-Design**. Es geht nicht um das Nachbauen einer Tiny-Skies-Welt und auch nicht um eine neue generische HUD-Schicht.

Der Spieler soll Stadt, Küste/Keys, Canyon und seltsam-fraktale Zone als dieselbe KFB-Welt lesen — trotz unterschiedlicher Ausgangspacks.

## Aktueller Befund

- Race `main` enthält bereits die frische Spur **Grotesque World Style v1** und einen neuen Drive-Mechanics-Input. Das ist aktuelles Eingangsmaterial, kein fertiger Look-Standard.
- Die alte HUD-v1-Architektur ist abgelehnte Geschichte. Sie wird **nicht** gepatcht oder als Layout-Vorlage benutzt.
- Der laufende neue Racetrack und das laufende eigene 3D-HUD sind Kandidaten. Vor jeder Integration muss ihr tatsächlicher Race-Commit, ihre Dateien und ihre sichtbare Stage-Probe geprüft werden.
- Tiny Treats darf für die Welt-/Scenery-Ebene eingesetzt werden, ist aber **nicht** der Standard-Donor für das neue Tacho/Radio/HUD.

## Nicht verhandelbare Grenzen

- Race besitzt Fahrbasis, Track, Fahrzeug, Eingabe, Audio-Ownership und Runtime.
- OSM/City-Lab besitzt Karten-/Stadtgeometrie; kein zweites City-System.
- Travel/Tiny Skies ist **Gestaltungs-Donor** für Terrain, Horizont, Wasser, Lichtantwort und Wetterstimmung — nicht ein zu kopierender Runtime-Owner.
- KayKit liefert die Hauptfamilie für bewohnbare Gebäude, Residents und erkennbare Landmarken.
- Kenney ist eine gezielte Ergänzung für Funktion, VFX oder fehlende Props; seine blassere Ausgangsfarbe wird nicht pro Asset handbemalt, sondern über die gemeinsame Material-/Lichtantwort geprüft.
- Das neue 3D-HUD erhält keine Platzhalter-Gauges, schwarzen Kästen oder nachgebauten Branding-Text. Jede sichtbare Form braucht eine reale Quelle oder eine explizite, eigene 3D-Designentscheidung.

## Vier kleine Gates

### W0 · Tatsächlichen Kandidaten sichern

1. Race-`main`, laufende Branches/PRs und die jüngsten Racetrack-/HUD-Dateien lesen.
2. Einen Commit als Ausgangspunkt pinnen; unklare oder nur im Chat beschriebene Arbeit bleibt **UNKNOWN**.
3. Bestehende World-Style-, Track- und HUD-Donoren mit Besitzer und Rolle notieren.
4. Drei Screenshots/Beweise anlegen: aktuelle Straße/Stadt, ein Track-Abschnitt, aktuelles HUD.

Kein Umbau, bevor W0 abgeschlossen ist.

### W1 · Ein kleiner Look-Vertrag statt Asset-Puzzle

Schreibe `WORLD_LOOK_CONTRACT.md` mit genau diesen Entscheidungen:

- Farbrollen: Himmel/Fernraum, Terrain, Asphalt/Track, Gebäude, Hinweisfarbe, VFX-Akzent
- Lichtrollen: Tageszeit, Nebel/Depth, Schattenweichheit, Wasser-/Nässeantwort
- Formrollen: Road-Ribbon/Trackbreiten, Gebäude-Silhouette, Landmarke, Resident-Scenery
- Packrollen: Tiny Skies/Travel, KayKit, Kenney, Tiny Treats
- drei getestete Stimmungen: **Küste/Keys**, **Stadt/Industrie**, **seltsam-fraktal/Canyon**
- ein klarer Anti-Drift-Satz pro Rolle: was dieses Pack ausdrücklich *nicht* übernimmt

Erst globale Tokens/Preset-Parameter ändern, dann drei Vergleichsbilder erzeugen. Keine massenhafte Einzelrecolorierung.

### W2 · Befahrbare Weltprobe

Auf bestehender Fahrbasis eine kurze zusammenhängende Rundstrecke bauen oder erweitern:

- OSM-Stadtabschnitt mit klarer Straßen-/Bürgersteig-/Geländekollision
- mindestens drei sichtbare Trackbreiten: Stadtpassage, freie Strecke, Rampen-/Stuntstück
- eine Landmarke und eine Resident-Scenery aus belegten Modulen
- eine sichtbare Wasser- oder Canyon-/Fernraumprobe
- kein „perfekter Nullkreis“: Lesbarkeit durch Biegung, Höhe, Blickwechsel und Rückkehrpunkt
- jede Fläche außerhalb der grauen Straße bleibt tragfähig, solange sie keine bewusst gesetzte Fall-/Portalfläche ist

Spätere Fassadenfahrt/Two-Wheel-Cartoon-Physik bleibt ein eigener Vehicle-Deformer-Gate; sie wird hier nicht simuliert.

### W3 · Eigenes 3D-Fahr-HUD

Das neue Tacho, Radio, Starttypografie und die spätere Minimap werden als eine **eigene** 3D-Familie gezeigt:

- zuerst isolierter Sichtbeweis jeder Form, dann genau eine Integrationsnaht zur Race-Runtime
- HUD bleibt am Rand/Fahrzeugraum; Fahrkorridor und mobile Touchfläche bleiben frei
- Startsequenz kann 3D-Zahlen/Buchstaben nutzen, aber keine neue Wortmarke erfinden
- Radio/Jukebox bleibt Audio-Consumer; sie übernimmt keine globale Audio-Ownership
- Minimap ist zunächst eine echte, reduzierte Strecken-/Zonenansicht; kein dekorativer Dummy

### W4 · Menschlicher Fahrtest

Test auf Desktop, Split-Screen und mobilem Touch:

- Strecke ohne Durchfallen abseits des Asphalts
- Orientierung bei drei Stimmungen
- Trackbreite und Rampen lesbar
- Tacho/HUD verdeckt weder Straße noch Touch-Steuerung
- keine generische UI, keine Platzhalter-Architektur, kein Brand-Rebuild
- Ergebnis nur als **PROPOSED / IMPLEMENTED / TESTED / ACCEPTED** markieren, nie zusammenschieben

## Lieferpaket

- eigener Branch, kleine additive Commits, PR ohne Auto-Merge
- `WORLD_LOOK_CONTRACT.md`
- `SOURCE.json`, `RETURN.md`, `TEST_REPORT.md`, additiver `CHANGELOG.md`
- drei Vergleichsbilder der Stimmungen plus Desktop/Mobile-Fahrbeweis
- feste KFB-Stage-URL im Hub, erst nach echter Browser-Prüfung als testbar markieren

## Starttext für einen frischen Web-Chat

```
Work only from current georg-doc/KFB-Stunt-Car-Race main. Read WSA_START.md, RECOVERY.md, the current Race World Style / track handoff, the latest Race commits, and this brief completely.

Take one bounded P0 slice: make the existing OSM/Race driving basis and its current track candidate visually coherent through a small World Look Contract. Use Tiny Skies/Travel as terrain/light/water grammar, KayKit as the main building/resident family, and Kenney only as a targeted functional/VFX supplement. Do not replace the current Race owner, make a second city runtime, recolor assets one by one, or build a generic dashboard.

The active new 3D tachometer/radio/minimap work is its own candidate: prove each real 3D form in isolation before one narrow Race integration seam. HUD v1 is rejected history; do not patch or copy it. Tiny Treats is not the default HUD donor.

Return a branch, PR, fixed KFB Stage URL, WORLD_LOOK_CONTRACT.md, source list, screenshots, actual tests, changelog, risks and exactly one human gate. No auto-merge.
```
