# POSTMORTEM · Markierung M1 → M2 · 2026-09-28

## 1 · M1 hat eine eigene Grammatik erfunden
**Was passiert ist:** M1 baute alles aus einer Kunsteinheit (b = 25 cm, Takt 1,5 m), mit runden Enden, zwei festen Fugen und einer Tropfenregel für Übergänge. Intern stimmig, aber Georg sah „keine echte Straße": Proportionen, Rhythmus und Stöße wirkten erfunden. Querlinien standen mit Fuge neben Längslinien, wo reale Linien stoßen.
**Ursache:** Die Vorlage war eine visuelle Grammatik (Bedeutung → Form), keine Maßvorschrift. Wir haben die Grammatik wörtlich in Geometrie übersetzt und das echte Regelwerk nur als Stimmung benutzt.
**Korrektur:** M2 nimmt Geometrie und Rhythmus aus RMS/StVO und rechnet mit genau zwei Faktoren um. Der Knetlook kommt nur aus Querschnitt, Material, Farbe.
**Lehre:** Wo es ein reales Regelwerk gibt, zuerst das Regelwerk. Stilisierung nur über wenige, benannte Faktoren. Kein Element darf eine eigene Form haben.

## 2 · Tropfenregel las als Zufall
**Was passiert ist:** Linien, die im Übergang enden, wurden kürzer, dann Tropfen, dann seltener, mit Seed-Schwellwerten. Aus Kartsicht las das wie Abnutzung oder Rauschen.
**Korrektur:** Takt-Auslauf. Die Linie zerfällt deterministisch in ihren 3-m-Takt, Stücke bleiben mittig, werden linear kürzer, letztes = Quadrat in Strichbreite. Kein Zufall.
**Lehre:** Übergänge brauchen eine Regel, die man nach einmal Sehen vorhersagen kann.

## 3 · Einmündung: drei Runden am selben Plan
**Runde 1:** Randlinie brach an der Öffnung ab, Wartelinie hing frei. **Runde 2:** Randlinie folgt dem Bordradius, Rand-Leitlinie im Knoten über die Öffnung, Wartelinie aber direkt unter den Strichen (sah wie eine Überlagerung aus) und zu kurz (endete 0,3 m vor dem Bogen). **Runde 3 (jetzt):** Wartelinie eine Lücke hinter dem Rand, über den ganzen Fahrstreifen, rechts entlang des Bogens bündig, Lücken gestreckt. Fahrstreifenbegrenzung beginnt an der Wartelinie.
**Ursache:** Wir haben Elemente einzeln korrekt gesetzt, aber ihre Nachbarschaft nicht geprüft (wer stößt an wen, wer hält Abstand).
**Lehre:** Bei Knoten zuerst die Stoß-Tabelle schreiben (Element × Nachbar → Stoß / Lücke / bündig), dann zeichnen.

## 4 · Farbe im US-Modus
**Was passiert ist:** Beim US-Schalter wurde nur die Mittellinie gelb. Die Sperrfläche am Linksabbieger blieb weiß, obwohl sie Gegenrichtungen trennt. Die Wartelinie war richtig weiß, wirkte aber falsch, weil die Regel nirgends stand.
**Korrektur:** Rolle `centre` gilt für alles, was Gegenrichtungen trennt (Mittellinie, Sperrfläche mit Rand und Schraffur). Quer- und Gleichrichtungslinien bleiben hell. Regel steht jetzt im Vertrag (`colors.roles.centreRule`).
**Lehre:** Farbregeln als Funktion formulieren (wen trennt die Linie), nicht als Liste von Elementen.

## 5 · Parken und Parkdeck sahen erfunden aus
**Parkstreifen:** Asphaltband mit geradem Bord und Strichen im Takt über die ganze Länge, abgeschnitten an beiden Planrändern. Jetzt echte Parkbucht mit 45°-Bordnasen.
**Parkdeck:** Gegenläufige Pfeile dicht an den Ständen ohne Mittellinie, ein Bild, das Georg nicht kannte. Jetzt Einbahn-Fahrgasse, Pfeile mittig.
**Lehre:** Jede Situation gegen „habe ich das so schon mal gesehen" prüfen, bevor sie ins Blatt geht.

## 6 · Umgebung
- WebGL-Aufnahmen gelangen diesmal nach vollständigem Laden (≈ 60 s in der verdeckten Vorschau). Direkt nach dem Öffnen liefert die Aufnahme einen leeren Canvas. Erst warten, dann aufnehmen.
- `td03.stream.json` (3,78 MB) passt nicht unter die 2-MB-Grenze des Exports. Gepackt beigelegt statt Code zu ändern.
