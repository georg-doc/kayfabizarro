# HANDOVER → WSA · S1 Knet-Straße · FAILED · Re-Briefing nötig · 2026-09-28

**Status:** `FAILED` · **Von:** Claude Design · **An:** WSA-Lead · **Kopie:** Claude Coworker (Track Core)
Georg: »Eindellungen sind okay. Der Rest ist ein Fail« · »Schatten-/Clipping-Bug ist auch zurück«. Sample: `ref/georg_sample_clay_street.png`.

## Bitte an WSA

Ein Brief für die Straße in der Knetwelt, der **Vorgaben statt Verweise** enthält:
1. **Bildvorlage je Bauteil**: Fahrbahn (Pflaster / Asphalt / Rennbelag je Welt), Bordstein, Gehweg, Rinne (ja/nein), Markierung (Zebra, Haltelinie, Leitlinie, Parkbucht), Laterne, Ampel, Schild. Das Sample deckt Altstadt-Kopfstein ab; für Asphalt, Rennstrecke und Fahrschule (FS01) fehlen Vorlagen.
2. **Palette als Werteleiter** je Welt (dunkel → hell → warm → Himmel), nicht abgeleitet.
3. **Straßenraum**: Welche Ränder gehören zu jeder Straßenart (Fassaden, Bäume, Laternentakt, Abstände)?
4. **Markierungsregel für die Rennstrecke** (Looping, Magnet), getrennt von der Stadt; die Knetwurst-Regel ist für die Stadt abgelehnt, für die Rennstrecke nicht einzeln beurteilt.
5. **Abnahme**: je Shot ein Referenzbild (Platz, Zebra, Bordstein nah, Fahrersicht).

## Was Claude Design mitbringt

- `POSTMORTEM_S1_KNET_STRASSE.md`: neun Befunde mit Beleg und Ursache, fünf Wurzelursachen.
- Technik, die trägt: Schichten einzeln schalten und belegen · Vertex-Atlas-Farbe für KayKit · Markierung in (s, u) über Stream-Rahmen · `fillet()` · Eindellungen (`clay-relief.v5`, Werkzeug `dent`).
- **Schattenregel als Vorschlag für das How-to**: Kastengröße an die Kamera binden oder Kaskaden, `normalBias` ≤ 0,03 bei Details < 0,2 m, Kontaktschatten für flache Teile, Pflichtaufnahmen am Fuß eines Pfahls und an einer Markierungskante.

## Grenzen

Track Core besitzt Geometrie, WSA/Race Physik, Kamera, OSM, Licht-Rig. Claude Design besitzt den Look, S1 erst nach dem Re-Briefing. K2 (Material v10) und T3 v2 bleiben wie abgegeben; T3 v3 (Markierungen) ist mit S1 zurückgestellt.
