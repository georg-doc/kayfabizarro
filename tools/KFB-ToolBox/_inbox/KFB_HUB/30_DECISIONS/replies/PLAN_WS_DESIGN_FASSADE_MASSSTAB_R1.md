# PLAN · WS-Design · HyperNorm-Fassade: Maßstab, Nahtlosigkeit, Collage, Slops · R1 · 04.11. · an WS0

Georgs Punkte vom 04.11.: Das Bild ist zu groß und kaum lesbar, die Fassade nicht nahtlos, offen ist, was aus Collage und Planeten wird, und Slops sollen als Ebene hinein.
Gebaut wird im nächsten Slot, hinter dem Schalter `fassade=r2`.

## 1 · Fester Weltmaßstab
- Die Bildbreite ist ein fester Datenwert, `FASSADE.BILD_M`, Vorschlag 7 m. Die Bildhöhe ergibt sich mit 2:1, also 3,5 m.
- Er gilt für alle Häuser gleich, auch für Kit-Häuser. Schrift und Motive haben damit überall dieselbe Größe; große H15-Schrift wird etwa 1–1,5 m hoch.
- Schärfe: 1024 px auf 7 m sind rund 146 px/m, mit `h15res=2` rund 290 px/m. Das wird im Slot gemessen.

## 2 · Wie das Bild auf die Wände kommt (Möglichkeiten und Kosten)

| | Weg | Nähte und Spiegel | Kosten |
|---|---|---|---|
| (a) | **Abwicklung um das Haus:** u = Weg entlang des Hausumfangs in Metern, v = Höhe; als Box-Projektion in Weltmetern | keine Naht an den Ecken; das Bild läuft weiter, Leserichtung von außen überall gleich, nie gespiegelt | nur Shader-Rechnung, etwa 0 ms |
| (b) | UV je Wand mit fester Texel-Dichte, Kacheln versetzt | an jeder Ecke ein Schnitt im Bild | etwa 0 ms |
| (c) | Bildschirm-Fenster in eine HyperNorm-Welt hinter allen Häusern | nahtlos | etwa 0 ms; aber das Bild klebt nicht an der Wand und schwimmt beim Fahren; Treffer und Löcher passen nicht mehr dazu |

Echte Dreifach-Projektion (triplanar, nach der Normalen überblendet) verdoppelt Schrift an den gerundeten Ecken. Darum nehme ich sie nicht.

**Empfehlung: (a), die Abwicklung um das Haus.**
- Damit die Naht beim Rundumlauf nicht auffällt, wird der Maßstab je Haus leicht angepasst (±10 %), sodass der Umfang ein ganzes Vielfaches der Bildbreite ist.
- Etagen: Die Reihen laufen je um das Haus. Der Übergang zwischen zwei Reihen ist ein weicher Verlauf über 0,4 m, wie die Naht in der Engine; keine harte Kante, kein Spiegel.
- Jede Reihe ist seitlich versetzt (Saat je Haus), damit Nachbarhäuser nicht gleich aussehen.
- Dach: Draufsicht in denselben Weltmetern.

## 3 · Collage und Planeten als Aufkleber
- H15 hat keine Planeten; die stammen aus unserem Himmels-Atlas (wie im Bodenblatt).
- H15 malt jedes Bild in einem Zug aus Grund, Mitte und Schrift. Einzelne Ebenen ließen sich zwar über eigene Malgänge erzeugen (die Methoden der Engine sind von außen erreichbar), das kostet aber je Ebene etwa 2–4 ms Hauptfaden. Nicht empfohlen.
- **Empfehlung: Aufkleber aus unseren eigenen Quellen, über dem laufenden Bild.**
  - Die Quellen sind Planeten-Zellen aus dem Himmels-Atlas, Kartenmotive des Decks und Slop-Zellen (§4).
  - Je Haus 3–5 Stück in lesbarer Größe (1–2,5 m), im Weltmaßstab, nicht auf Fenstern (Kit) und nicht über Ecken.
  - Technik: ein InstancedMesh aus flachen Quads je Viertel, 2 cm vor der Wand. Darauf das Modul Einfügen (kfbInsert), Tuschekante wie bei den Karten.
  - Bricht die Wand auf, liest der Aufkleber das Wandfeld (Loch) und reißt mit; er schwebt nie vor einem Loch.
  - Kosten: ein Zeichenaufruf je Viertel, etwa 0,1–0,3 ms.

## 4 · Slops als HyperNorm-Ebene
- H15 nimmt eigene Bildquellen: Die Bildliste (`all`, `imgs`, `pool`) lädt neben der Library of Congress auch KFB-Kartenmotive.
- Datenweg ohne Kopien: Slop-Atlas-Zellen per id werden zur Laufzeit ausgeschnitten (Canvas) und mit der id `slop:<zelle>` in die H15-Liste gelegt.
- H15 färbt sie selbst in seine Palette (POSTER-Graduierung); daraus wird die Propaganda-Optik.
- Zusätzlich als Aufkleber (§3) im Stil eines Propaganda-Plakats: ein Slop-Motiv mit einem geschwärzten Balken (Zensur-Motiv) und einer Zeile aus dem Triplet-Bestand. Kein eigener Text; die Zeilen liefert der Writer's Room.
- Kosten: einmal beim Laden ausschneiden, danach 0 ms je Bild.

## Beleg im Slot
1. Dasselbe Viertel, vorher und nachher, von vorn.
2. Ein Haus nah, mit einer Ecke im Bild (keine Naht), Schrift lesbar.
3. Kosten bei `h15res` 1 und 2.

Ein Kritiker am Ende.

## Offen für WS0
- Bildbreite 7 m: so übernehmen oder lieber 6 m bzw. 8 m?
- Slop-Plakate: welche Atlas-Zellen? Vorschlag: die Standposen je Familie.
