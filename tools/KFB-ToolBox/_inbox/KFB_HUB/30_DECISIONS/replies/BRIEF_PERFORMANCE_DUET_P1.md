# Briefing · Performance-Pilot P1 · Mumien-Duett zu „Pharaoh Piledriver“ (Spiel + Musikvideo)

WS0 · 16.10.2026 · V-359. Eine Datenquelle, zwei Ausgaben: WS1 im Spiel (diegetisch, Karte auf dem Billboard), WSV im Musikvideo (Remotion, Karte vollflächig).

## Idee (Georg)
Der neue Pharaoh-Song (118 BPM, Refrain, tanzbar) ist zweistimmig: tiefe Männerstimme (Strophen) und Frauen-Gang-Vocals (Refrain). Zwei Mumien performen ihn als Duett links und rechts vom Billboard: **Männerstimme = Mumie mit heller Haut und eher männlich lesbarem Haaransatz, Frauenstimme = Mumie mit dunklem Gesicht und hellen, weißen Augen** (KayKit Mummy `Mummy_A` / `Mummy_B`, Rig_Medium, main `media/3D_Assets/KayKit_Mystery_Series6/KayKit Mummy/characters/` – WS0 ordnet A/B nach dem Bild zu). Jede Mumie bewegt den Mund nur zu ihrer Stimme, tanzt im Takt, Arme und Gesten auf den Beat, Augen und Brauen mit Emotionen.

## Gesicht
**KFB_NATIVE, nicht Wireface:** je Figur genau ein Gesichtstreiber (Architektur §4). EyeRig v6 (später mit Lidhaut E2) plus KFB-Mund-Sätze per Viseme aus der Wort-Zeitleiste. Wireface bleibt lokales SDK und wäre ein zweiter Weg.

## Gemeinsame Datenquelle (WS0 liefert)
`kfb.performance/1` je Song, aus der Audio-Pipeline (40_AUDIO):
- `beats` (Takt, Downbeats, Takte), `sections` (Intro, Strophe, Refrain, Break, Outro);
- je Stimme `words` mit Zeit und Viseme (male / female / both), Zuordnung über Lead- und Backing-Stem;
- je Darsteller `cues`: Tanz-Clips aus der Motion Library (3–4 Moves je Deck, V-298), auf Taktgrenzen geschnitten, Arm-Akzente auf Schlägen, Emotes (Augen/Brauen) an Pointen; Karten-Wechsel aus cues.csv.

## WS1 (Spiel) – eigener Job nach den laufenden Schritten
Bühne mit Billboard, zwei Mumien links und rechts, ein Abspieler liest `kfb.performance/1` (Uhr = Audio-Zeit, kein eigener Takt), Mund je Stimme, Clips auf den Beat, Karte auf dem Billboard wechselt mit der Zeile. Knet-Material, Schatten/Kontakt wie L1/L2.

## WSV (Musikvideo, Stufe 2)
Karten vollflächig im Bild, die Mumien kleiner am Rand bzw. wechselnd positioniert, als 3D mit Schatten auf der 2D-Fläche (`@remotion/three`), gleiche `kfb.performance/1`-Daten, Schnitt auf den Beat.

## Abnahme
30-s-Probe (Intro + erste Strophe + Refrain): Münder treffen ihre Stimme (Wort ±80 ms), keine Mundbewegung bei der stummen Figur, Clip-Wechsel auf Taktgrenzen (±1 Frame), Karte immer vollständig; dann ganzer Song.
