# Konzept · Die Strecke als Knetstrang · Entwurf zur Freigabe · 2026-09-27

Anlass: Georg 27.09. zu T2: Design, Farben, Cartoon- und Knet-Look »totaler Fail«, Palette schlecht, wirkt wie Drahtgitter, schlampig, Banden-Schildchen »AI-Slop«. Das einzig Gute: die Fahrbahn-Texturen.
Ursache: Ich habe Einzelteile nachgebessert (Kerb, Wand, Kappe, Tafeln, Streifen) statt ein Prinzip zu setzen. Dieses Blatt setzt das Prinzip; gebaut wird erst nach Freigabe.

## Leitidee

**Die Strecke ist ein Strang aus Knete, auf einen Diorama-Tisch gelegt.** Wie bei Claybound besteht die Welt aus wenigen großen Massen, jede in einer Farbe, überall mit Handspuren im gleichen Maß. Es gibt nichts Aufgeklebtes: keine Schilder, keine dünnen Linien, keine Kappen in anderer Farbe. Was etwas bedeuten soll, ist **in die Knete geformt**.

## Sieben Regeln

1. **Drei Massen, drei Farben, ein Akzent.** Fahrbahn (dunkel), Strang (Körper, Rand, Stützen, eine Farbe), Gelände. Ein Akzent nur für Spielzustände (Magnet, Boost). Werte gemessen: `PALETTES.claybound` in `clay-material.v8.js`.
2. **Dick statt dünn.** Der Rand ist ein runder Wulst, so dick wie die Wand hoch ist. Stützen sind Knetsäulen mit Fuß, keine Stäbe. Kein Teil ist schmaler als ein Daumen (Handmaß 1,5 m).
3. **Bedeutung durch Form, nicht durch Farbe oder Aufkleber.**
   - Kurve innen: Die Hohlkehle bekommt eingedrückte Querrippen (Rumble), gleiche Farbe wie der Strang.
   - Enge Kurve außen: Der Wulst wird höher und dicker (Prallwulst).
   - Fahrtrichtung, wo nötig: Pfeilkerben in die Fahrbahn gedrückt, wie das Spielzeugraster.
4. **Eine Handgröße für alles.** Fahrbahn behält ihre Spuren (Georg: »das einzig Gute«). Wulst und Stützen bekommen dieselben Handspuren, keine Krater, keine Beulen. Verformung nur als sanfte Welle am Wulst.
5. **Welt statt leerer Tisch.** Gelände als Knetfläche mit Hügeln. Streuung nach Rule of Three: Baum (Kugel-in-Kugel), zwei Büsche, ein Fels. Wolken als Kugel-in-Kugel.
6. **Stützen mit Cartoon-Anatomie, nicht als Stab.** Die Stütze *trägt* sichtbar Last:
   - Proportion gedrungen: Dicke ≥ ⅓ der Höhe bei kurzen Stützen, nie dünner als ¼. Hohe Stützen werden doppelt (zwei Beine mit Brücke) statt dünn.
   - Fuß breit und gequetscht wie ein Elefantenfuß (1,6 × Schaft), sitzt satt auf dem Gelände, mit Wulst.
   - Schaft mit leichter Taille unten und Bauch oben (Squash unter Last), nicht zylindrisch.
   - Kopf als Kapitell-Kissen, breiter als der Schaft, das Deck liegt darauf auf. Keine Lücke, kein Durchstoßen.
   - Farbe = Strang, gleiche Handspuren. Leichte Neigung je Stütze (≤ 3°), Takt nach Last (enger unter Kurven und Kehren), nicht stur alle 16 m.
7. **Übergänge als Flecken.** Skin- und Biom-Wechsel als eingedrückte Knetflecken, gemalte Elemente beginnen und enden sauber.

## Was wegfällt

- Tafeln und Schildchen (heute aus dem Satz genommen).
- Rot-weiße Farbstreifen in Kerb und Wand; ersetzt durch Rippen und Prallwulst.
- Helle Kappe, Randlinien als dünne Bänder, Bauch an der Außenwand.
- Stützen als Stab mit Tellerfuß (Georg 27.09.: »Cartoon-Anatomie stimmt nicht«).

## Offen, braucht Georgs Wort

1. Farbe des Strangs je Welt: Claybound-Orange für die Bahn, Creme für die Straße, Violett für den Magnet, oder eine Strangfarbe für alle Welten?
2. Darf der Prallwulst in engen Kurven die Wandhöhe überschreiten? Das wäre ein Core-Parameter (`barrierH` je Zone).
3. Rampe und Kicker: Die bauchige Form wird über die Track-Core-Geometrie gelöst (Georg 27.09.), nicht im Look.

## Stand im Projekt

- `KFB Knet-Strecke T2.dc.html`, Richtung CB (Claybound-Palette), Tafeln entfernt, Streuung (Bäume, Büsche, Felsen, Wolken) eingebaut. Das ist ein Zwischenstand, nicht das Konzept oben.
- T3 gebaut (27.09. nachts): `KFB Knet-Strecke T3.dc.html` → `lab-track/track-look.v3.js`, drei Welten. Georg 27.09.: »Top! endlich ein Design«, Basis zum Ausbauen.
