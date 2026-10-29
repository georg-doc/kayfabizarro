# Spec · Gutter, Bordstein, Bürgersteig: ein prozedurales Einfass-Modul statt Bastelei (V-1000) · R1 · 29.10.2026

**Warum:** Georg 29.10.: Für den Bürgersteig wurde wieder gebastelt, Steine ohne Sinn als Bordstein, ohne Bezug zur Topografie. Das ist dasselbe Muster wie Erdzungen, Dünen und Kieselsäume vorher. Jede Sitzung erfindet Übergänge neu, statt den Kanon anzuwenden. Die Regeln stehen längst im Kanon:
- CANON_3D Gebiet 2 „Komposition, Platzierung, Erdung“ mit `CANON_3D/sources/ETHERINGTON_REGELN_IN_ZAHLEN_R1.md` und `replies/SPEC_PLACEMENT_GRAMMAR_R2.md`,
- Gebiet 15 „Einpassung ins Terrain = ein Gesamtbild“,
- V-570: dunkler, nie schwarzer Kontaktton an jedem Requisit; keine Zungen bzw. Hälse; Farbflächen als geschlossene gerundete Blobs.

Diese Spec macht daraus **ein Modul mit festem Vertrag und mechanischer Prüfung**. Ein weiteres Regelpapier wäre wirkungslos (V-393: Schutz im Code zuerst; V-411: eine Spec je Gebiet).

## 1 · Das Modell in einem Satz
Zwischen den Blöcken liegt der **Gutter**, also die Straße bzw. der Labyrinth-Gang: dieselbe `terrain3`-Bandfläche wie das offene Gelände. Jeder Block steht auf einem **Sockel**, den ein **Bürgersteig-Ring mit modelliertem Bordstein** einfasst. Der Ring ist der Übergang, es gibt keinen anderen.

## 2 · Modul `kfb-curb` (Gizmo-Wand-Prinzip als Bürgersteig)
- **Eingang:**
  - Block-Grundrisse als Polygone, egal woher: Maze-Zellen rund oder eckig, OSM-Grundrisse, Hand-Layout;
  - die Gelände-Höhe `surfaceAt(x, z)`;
  - die Palette.
- **Geometrie:** Der Grundriss wird um die Bürgersteig-Breite nach außen versetzt (Polygon-Offset, Ecken mit festem Radius gerundet). Ein Bordstein-Profil wird entlang der Außenkante extrudiert, wie die Ziegel-Mauern der Prison-Maze-Greybox: UV entlang der Kante (u = Meter längs, v = Höhe). So gibt es auf geraden, gebogenen und schrägen Kanten keine Verzerrung. Ecken, Rundungen und Kurven entstehen aus dem Offset, sie werden nicht modelliert.
- **Profil:**
  - eine weiche Knete-Fase oben,
  - eine Stufe zur Straße mit fester Höhe je Ebene,
  - der Fuß sinkt leicht ins Gelände (keine Lücke, keine Schwebe).
- **Oberfläche:**
  - Bürgersteig: Pflastermuster aus dem Shader (Fugen über die Längs-UV), darunter die `terrain3`-Bänder **aufgehellt** wie die Krater-Lippe. So bleibt die Fläche Teil des Gesamtbilds.
  - Bordstein: eine Stufe heller bzw. dunkler nach Farbrolle.
- **Topografie:** Ring und Sockel folgen `surfaceAt`. Das Gefälle wird über die Länge verteilt, Höhensprünge werden zu Stufen bzw. Rampen.
- **Ausgang:**
  - Meshes (ein Material je Ring-Satz),
  - eine **Lauf- und Kollisionsfläche aus derselben Geometrie** (eine Quelle für Bild und Höhe, Lehre aus dem Krater V-997),
  - Kanten-Linien für die Kugel-Physik (später Bouncen auf Stufen, Herunterkullern).
- **Parameter je Thema:** Breite, Bordsteinhöhe, Eckenradius, Pflastermaß, Stufenhöhe. Keine Zufalls-Steine, keine Kiesel, keine Dünen am Bordstein.

## 3 · Blöcke im Ring
- Gebäude aus Assets (KayKit, Kenney-City) oder einfache Blöcke mit Dachformen und Höhenmustern. Material über den Materialadapter: HyperNorm, Bänder, Knete, Stoff (V-995, V-999).
- **Kontaktlinie** an jedem Blockfuß: dunkler, nie schwarzer Kontaktton (V-570) als Teil des Sockel-Materials, kein extra Objekt.
- Sockel bündig unter dem Block. Der Block steht nie direkt auf dem Gelände.

## 4 · Zwei Übergangs-Familien, nicht mehr
1. **Stadt bzw. Labyrinth:** Bürgersteig-Ring nach §2.
2. **Natur bzw. Einschlag:** Erdlippe wie beim Krater, eine Fläche für Bild und Laufhöhe, Breite mindestens zwei Gelände-Gitterzellen (V-997). Dazu die Etherington-Steinregeln nur dort, wo Steine eine Ursache haben (Einschlag, Hang).

Alles andere (Dünen am Bordstein, Erdzungen, Kieselsäume als Übergang) ist verboten.

## 5 · Mechanische Prüfung (Pflicht vor jeder Abgabe)
Ein Testskript, Muster `test/terrain-seams.mjs`, prüft im Spiel-Look:
- kein Spalt und kein Schweben: Ring-Fuß gegen `surfaceAt` an n Punkten;
- Laufhöhe gleich sichtbarer Fläche auf Bürgersteig und Bordstein (Sohle ±5 cm);
- keine Zacken bzw. Treppen an Kanten (wie terrain-seams);
- Ecken gerundet mit dem gesetzten Radius;
- keine Instanzen außer Ring, Sockel und Block (Zählprüfung gegen Bastel-Steine).

Erst grün, dann Bild an Georg (V-740, V-561).

## 6 · Später
Mehrere Höhenstufen (Treppen, Terrassen), Kugeln kullern Stufen hinunter bzw. bouncen auf Kanten (Kanten-Linien aus §2), Bordstein-Varianten je Thema (Gizmo-Wand-Skin), Rinnstein als Fluff-Kanal.
