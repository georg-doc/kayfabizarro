# Recherche Gedankenblase R2 · Letterer-Handwerk · 15.11. (WS0, nach Georg q710, V-1822)

[S] = Quelle sagt es, [M] = an den Schrittbildern gemessen, [I] = abgeleitet. Hauptquelle mit echten Bauschritten: Comicraft (John Roshell), „Creating Thought Balloons“, https://balloontales.com/?p=384. Dazu Blambot „Comic Book Grammar & Tradition“ (https://blambot.com/pages/comic-book-grammar-tradition), Comicraft-Glossar (https://balloontales.com/the-comicraft-glossary-of-lettering-terms/), Todd Klein (kleinletters.com).

## Wolke
- Text in einen eher runden Block setzen, ovale Hilfslinie so eng wie möglich ohne Berührung [S].
- Punkte um das Oval mit Abständen lang–kurz–lang–kurz, ab und zu kurz–kurz [S]. Nie alle gleich [S].
- Kleine Blase = weniger Beulen; nie eine große Blase verkleinern [S].
- Maß [M]: 5 Zeilen ≈ 20–24 Beulen, 2 Zeilen ≈ 9–10.
- Bauch: große Blase flache Bögen (Tiefe ≈ 20–30 % der Breite), kleine fast Halbkreise; kleine brauchen mehr Bauch [S+M].
- Kerben spitz [M].

## Schweif
- 3–4 Kreise, kleiner zum Kopf hin [S].
- Erstes Stück ein Oval (≈ 1,6 : 1, lange Achse entlang des Rands), direkt auf der kleinen Beule, die dem Kopf am nächsten ist, überlappt den Rand [S+M].
- Folgende Kreise runder, je ≈ 0,6–0,65 des vorigen [M]; Lücke ≈ halber Durchmesser des nächsten [M].
- Fast gerade Linie, höchstens sanfter Bogen [M/I]. Ziel: oberer Kopf, nicht der Mund [S]; nie berühren [I].
- Erstes Oval ≈ 13 % der Wolkenbreite [M].

## Typische Fehler
Gleich große Beulen · große Blase verkleinert · runde Täler oder lose Wolke · Schweif frei schwebend oder auf großer Beule · gleich große Schweifkreise, auf den Mund gezielt oder bis an den Kopf.

## Umsetzung (bubbleForm.r2.js @8cb53a25)
Wolke umarmt die Zeilen (jede Zeile mit eigener Breite), Beulenzahl 2 Zeilen ≈ 10 / 5 Zeilen ≈ 22 (darüber gedämpft weiter), klein : groß 0,75 → 0,45, Bauch 0,4 → 0,26; Schweif Oval 1,6 : 1 (13 % der Wolkenhalbachse ×2, 1,1–1,8 Zeilenhöhen) auf der kopfnächsten kleinen Beule, dann bis drei Kreise je 0,6 mit halber Lücke, gerade zum Kopf, letzter ≥ 0,9 Zeilenhöhen vor dem Kopf. Abweichung von SPEC §2.4 (7–12 Lobes) offen benannt, Hub q713.
