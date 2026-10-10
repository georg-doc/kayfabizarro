# Protokoll blinder Kritiker R1 · für alle KFB-Slices

Stand: 2026-10-09. Fertige Vorlage, damit die Abnahme ab Stufe 1 sofort mitläuft. Gilt für das Lab (Gelände, Natur, Gebäude), RKIT (Übergänge, Bauteile) und spätere Slices. Die Kriterien selbst stehen in den Regelwerken; dieses Protokoll regelt **wie** geprüft wird.

## 1 · Grundsätze

- **Blind:** Der Kritiker sieht nur Bilder aus festen Kameras, das passende Regelwerk und die Referenzbilder. Er sieht keinen Code, keine Erklärungen und keine Absichten der Bauenden.
- **Eigene Instanz:** Er läuft als frischer Subagent ohne Gesprächsverlauf, nie als dieselbe Sitzung, die gebaut hat.
- **Erst harte Regeln:** Ist eine harte Regel oder eine Bauqualitäts-Prüfung (§1b) verletzt, gibt es keinen Kritiker-Lauf und kein Bild an Georg; zuerst reparieren.
- **Ehrlich berichten:** Georg sieht Punkte, Befunde und Bilder ungeschönt; „bestanden“ nur nach Schwelle.
- **Stopp:** Nach 2 erfolglosen Reparaturrunden wird gestoppt und Georg gefragt. Ein Kriterium unter 4 heißt zurück zum Konzept, nicht weiter reparieren.

## 1b · Stufe 0: Bauqualität vor jedem Bild (hart, automatisch; Georg 10.10.)

Anlass: Die Steinbogen-Renders im Bauweise-Blatt v7 (schwebende Steine, Lücken im Mauerwerk, verschmierte Bogensteine, nackter Fahrbahn-Kasten, lila Platzhalter-Kugeln) sind durch die Abnahme gerutscht, auch durch die Steuer-Sitzung. **Nichts geht mehr an Georg oder an einen Kritiker, bevor diese Prüfungen als Messung bestanden sind.** Sie laufen als Skript über die Szene, nicht per Auge.

| Nr. | Prüfung | Grenze |
| --- | --- | --- |
| Q1 | **Nichts schwebt:** jedes Bauteil, jeder Rubbel und jede Pflanze berührt einen Träger (Boden, Nachbarstein, Fels) | Abstand ≤ 0,02 H; 0 Ausnahmen |
| Q2 | **Keine Lücken im Verband:** Mauer-, Pflaster- und Bogenreihen sind geschlossen; Fläche = Steine + Fugen | Lücke ≤ Fuge × 1,5; 0 fehlende Steine |
| Q3 | **Keine Durchdringung** sichtbarer Körper (außer bewusst eingelassen: Fels im Gelände, Fundamente) | ≤ 0,05 H |
| Q4 | **Geometrie je Bauteil:** Bogensteine radial und gleich lang (keine gestreckten Platten), Platten im Raster, Kantensteine einzeln | Abweichung ≤ 10 % |
| Q5 | **Keine nackten Kästen bzw. harten Kanten (§01):** jede sichtbare Kante gerundet oder mit Rubbel bzw. Knetfleck eingebettet | 0 scharfe Kanten über 0,2 H Länge |
|  | *Q5 für Gelände-Körper (Scholle, Fels; Entscheidung 2026-10-10):* Übergangszonen (Oberseite, Kantenrundung, Lippe, Anschlüsse) **0** Kanten; gestaltete Formkanten (Zapfenspitzen und -flanken, Körperfacetten) zählen nicht, solange der Flächenwinkel ≤ 75° ist. Gewollte Bevels mit mehreren Segmenten zählen nie. In `qcheck.json` getrennt: `q5_transition`, `q5_designed` | `q5_transition` = 0; `q5_designed` max ≤ 75° |
| Q6 | **Anschluss:** Fahrbahn, Gehweg und Brückendeck schließen an Gelände bzw. Nachbarstück an | Höhensprung ≤ 0,02 H, Spalt ≤ 0,02 H |
| Q7 | **Keine Platzhalter im Abnahmebild** (Primitive, Kugeln, Testfarben), außer klar beschriftet als „Platzhalter“ | 0 unbeschriftete |
| Q8 | **Kein Anschnitt durch Gelände** (ergänzt nach Steinbogen Lauf 01): Mauer- und Pflastersteine sind zu ≥ 90 % sichtbar oder als Passstein auf die Geländelinie zugeschnitten; keine Felsfläche schneidet eine Mauerlage gerade ab | 0 angeschnittene Steine |

Dazu ein Pflicht-Kamerasatz **„Nah“**: Unterseite des Bauteils, Auflager bzw. Widerlager, beide Enden, Anschluss an Gelände, je auf Laufhöhe 0,9 H und schräg von unten. Der Bericht an Georg zeigt die Q-Messwerte vor den Kritiker-Punkten.

## 2 · Ablage

```
docs/critic/<slice>/<YYYY-MM-DD>_<lauf>/
  shots/            Bilder der festen Kameras (Dateiname = Kamera-ID)
  refs/             Referenzbilder (Kopie oder Verweis)
  input.md          was der Kritiker bekam (Liste der Dateien, Regelwerk-Abschnitte)
  verdict.json      Ergebnis nach Schema §5
  report.md         Kurzbericht für Georg (Punkte, 3 stärkste Befunde, Bilder)
```

## 3 · Kamerasätze

| Satz | Kameras | Quelle |
| --- | --- | --- |
| **Insel (Lab, Stufe 1)** | I1 Übersicht schräg · I2 Augenhöhe 1 H vom Hauptweg auf die Landmarke · I3 Seitenansicht Rand (Kante + Scholle) · I4 Untersicht Scholle · I5 Nahaufnahme Übergang (Bankett bzw. Wegrand, Laufhöhe 0,9 H) | Regelwerk Environment §4, ergänzt um Kante, Scholle, Sprenkel |
| **Natur (Environment)** | Regelwerk Environment §4 (4 Kameras) | – |
| **Übergang (RKIT)** | Regelwerk Übergänge §4 (3 Kameras): schräg oben · Augenhöhe 1 H · bodennah quer zur Naht | – |
| **Fahrt (Stufe 2+)** | Video: eine Runde aus der Spielkamera, dazu 6 Standbilder an festen Stationen | Masterplan §3b |

Die Kameras liegen als Presets im Lab bzw. in den Shoot-Werkzeugen (`tools/shoot.mjs`, `tools/render-speckle.mjs`, RKIT-Renderskripte); gleiche Auflösung (1600 × 1000), gleiches Licht.

## 4 · Kriterien je Satz

- **Natur:** K1–K9 aus `QA_RULEBOOK_ENVIRONMENT_R1.md` §3; Pflicht K9 ≥ 7.
- **Übergang:** U1–U8 aus `QA_RULEBOOK_TRANSITIONS_R1.md` §3; Pflicht U8 ≥ 7.
- **Insel, Stufe 1** (neu; Gelände ohne Natur-Platzierung):

| Nr. | Kriterium | 10 = | 0 = |
| --- | --- | --- | --- |
| G1 | **Kante** | Oberseite rundet sich als Viertelkreis in den Fels, Gras läuft über die Rundung aus; keine Stufe, kein Ring | Abgeschnittener Rand, heller Ring, Wulst |
| G2 | **Scholle** | Ein Körper mit zentraler Spitze und senkrechten Ausläufern, schwer und cartoonig; wie die Benchmarks | Drehkörper, Fächer, Säulen, Lücken |
| G3 | **Übergänge (§01)** | Sprenkel bzw. Knetkleckse in allen Distanzen, in beide Richtungen, nichts abgeschnitten | Verlauf, Linie, Rausch-Fläche, Geisterlinien |
| G4 | **Knet-Look** | Clay-Relief, Farben aus der Farb-Grammatik, eine Welt mit Figuren und Kits | Plastik, Stilbruch, Farben ohne Rolle |
| G5 | **Maßstab** | Figur, Tür, Straße und Insel lesen sich im K2-Maß stimmig | Puppenhaus oder Riesen |
| G6 | **Referenz-Nähe** | Hält den Vergleich mit R2D v0 bzw. R2B aus (Qualitätsmaßstab) | Rückschritt gegenüber R2D |
| G7 | **Weltlogik (§00)** | Man versteht, warum das Gelände so ist: Hügel, Bach, Bankett, Plätze haben Grund | Willkürliche Form |

**Bestanden (Insel):** harte Regeln (Bauplan Stufe 1 §6) erfüllt, Mittel ≥ 8, kein Wert < 6, **G3 ≥ 7 und G7 ≥ 7**.

## 5 · Ergebnis-Schema (`verdict.json`)

```json
{
  "slice": "lab-stage1",
  "run": "2026-10-09_1",
  "set": "Insel",
  "scores": { "G1": 0, "G2": 0, "G3": 0, "G4": 0, "G5": 0, "G6": 0, "G7": 0 },
  "mean": 0,
  "passed": false,
  "findings": [
    { "criterion": "G3", "camera": "I5", "where": "Bankett links vorn", "what": "Übergang endet an einer Linie", "rule": "§01", "severity": "hoch" }
  ],
  "hard_cut_seen": false,
  "summary": "max. 3 Sätze"
}
```

`hard_cut_seen = true` (eine harte Schnittkante bzw. helle Kante ohne Übergang aus irgendeiner Kamera) heißt: Das betroffene Kriterium wird höchstens 5 (§01).

## 6 · Auftrag an den Kritiker (Vorlage)

> Du bist ein strenger Art Director für ein Claymation-Cartoon-Spiel (KFB). Du siehst Screenshots aus festen Kameras, das Regelwerk und Referenzbilder. Du kennst weder den Code noch die Absicht der Bauenden.
>
> 1. Lies die Abschnitte §00 (Weltlogik), §01 (keine harten Schnitte) und die Kriterien-Tabelle des Regelwerks.
> 2. Sieh dir jede Kamera an. Notiere je Kriterium Befunde mit Kamera und Stelle im Bild.
> 3. Vergib je Kriterium 0–10 nach der Tabelle; begründe jeden Wert unter 8 mit einem konkreten Befund.
> 4. Prüfe ausdrücklich: Gibt es aus irgendeiner Kamera eine harte Schnittkante, einen Farbverlauf, eine helle Kante ohne Übergang, Geisterlinien oder dunkle Ringe unter Objekten?
> 5. Gib nur JSON nach dem Schema zurück. Sei nicht höflich; ein Lob ohne Befund zählt nicht.

**Umsetzung in Claude Code:** Subagent (`Agent`, Typ general-purpose) mit diesem Auftrag, den Bildpfaden aus `shots/` und `refs/` und den Regelwerk-Pfaden. Keine weiteren Hinweise. Bei strittigen Läufen einen zweiten Kritiker unabhängig laufen lassen; bei mehr als 2 Punkten Abweichung je Kriterium den Mittelwert nehmen und das im Bericht nennen.

## 7 · Bericht an Georg

- Kurz: bestanden ja oder nein, Mittelwert, schwächstes Kriterium.
- Die 3 wichtigsten Befunde mit je einem Bild.
- Was als Nächstes repariert wird, oder Stopp-Bericht.
- Keine Selbstbewertung der Bauenden, kein „sieht gut aus“ ohne Kritiker.
