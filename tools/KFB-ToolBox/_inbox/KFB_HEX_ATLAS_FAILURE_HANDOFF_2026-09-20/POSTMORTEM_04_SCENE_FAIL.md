# Post Mortem 04 · Die Szene, die keine war

**Datum** 20.09.2026 · **Artefakt** `KFB_Hex_Edge_Atlas_S1`, Bildschirm »Bauvorgaben«
**Urteil Georg** Totaler Fail. Abbruch des Slices.
**Vorgänger** `POSTMORTEM_GOLDEN_SAMPLES_2026-09-20.md` (Vokabelsuche · Serviervorschlag-Irrtum)

---

## Was Georg gesehen hat

Wörtlich, als Befundliste:

| # | Befund | Klasse |
|---|---|---|
| 1 | Das Haus steckt im Felsen drin | **Geometrie** — Durchdringung |
| 2 | Die Bäume stehen in der Luft | **Geometrie** — kein Bodenkontakt |
| 3 | Es sind die falschen Gebäude da | **Teilewahl** |
| 4 | Die Steinstufe und die Steinbasis sind nicht eingesetzt | **Teilewahl** — Vorlage ignoriert |
| 5 | Das Zwischenteil fehlt, das zur Vorgartensituation mit der Steintreppe führt | **Komposition** — der zentrale Punkt der Bauanleitung |
| 6 | Die Brücke endet in nichts | **Komposition** — Relation fehlt |
| 7 | Die Windmühle steht einfach auf dem Kornfeld, ohne die Situation klar zu machen | **Komposition** — kein Anlass |
| 8 | Die Gebäude stehen lieblos da, ohne sozialen Zusammenhang | **Komposition** — kein Micro-Storytelling |

Und die Diagnose, die alles zusammenfasst:

> **»Du betreibst da kein Storytelling, sondern würfelst einfach Gebäude, die ähnlich heißen,
> und hoffst dann, dass da eine Szene draus kommt.«**

---

## Was ich behauptet hatte

Im selben Bildschirm, grün, direkt unter den Bildern:

- ✓ »54 Fugen geprüft, 0 Fehlstellen«
- ✓ »Brücke `bridge` (2 lang = eine Kachelbreite) überspannt die Kreuzungszelle [1,4] und
  verbindet [1,3] mit [1,5]«
- ✓ »8 Gebäude mit Dachfarbe blue«
- ✓ »6 Ausgleichsteile an den Absätzen gesetzt«

**Jede dieser Zahlen ist richtig. Die Szene ist trotzdem kaputt.** Das ist der eigentliche
Befund dieses Post Mortems: ich habe ein Prüfsystem gebaut, das exakt die Eigenschaften misst,
die ich ohnehin beherrsche, und keine einzige, an der die Arbeit tatsächlich scheitert.

Die Brücke *überspannt* die Kreuzungszelle — geometrisch korrekt. Sie *verbindet* trotzdem
nichts, weil auf der einen Seite eine Sackgasse endet und auf der anderen zwei Wiesenzellen
ohne Ziel liegen. »Verbindet A mit B« war eine Aussage über Koordinaten, nicht über die Szene.

---

## Die drei Fehlerklassen, getrennt

### Klasse A · Geometrie — mechanisch prüfbar, nie geprüft

Durchdringung (Haus im Felsen) und fehlender Bodenkontakt (Bäume in der Luft) sind **in zehn
Zeilen Code nachweisbar**: paarweiser `Box3`-Schnitt über alle gesetzten Objekte, und ein
Strahl nach unten von jedem Objektfuß.

Ich habe stattdessen Fugen gezählt. Nicht weil die Kollisionsprüfung schwer wäre — sondern
weil ich **nicht hingesehen habe** und deshalb nicht wusste, dass es das Problem gibt. Regel 7
des Projekts (»Hinsehen, nicht nur messen«) war der Anlass für den Drei-Winkel-Umschalter im
selben Bildschirm. Ich habe ihn gebaut und dann nicht benutzt.

*Konkret beim Rocky-Fall: `place(grass, 0, top*0.72, 0)` und `place(tower, 0, top*0.72, 0)` —
zwei Objekte an derselben Koordinate, ohne dass irgendetwas prüft, ob der Turmfuß über der
Kachelfläche liegt. Bei den Padding-Clustern: `detail_forest` auf `lvl * step`, wobei `lvl`
aus der Terrasse kommt, in der die Zelle *aufgelistet* ist — nicht aus der Höhe, auf der die
Kachel tatsächlich liegt.*

### Klasse B · Teilewahl — die Vorlage wurde nicht zerlegt

»Steinstufe und Steinbasis nicht eingesetzt« heißt: die Vorlage zeigt Teile, die ich nicht
identifiziert habe, obwohl der Bilderbogen (G1) sie enthält. Ich habe G1 gebaut, drei Familien
angesehen — `tiles/base`, `objects`, `decoration/nature`, `buildings/red` — und dann **aufgehört
zu suchen, sobald ich etwas Passendes gefunden hatte.**

Das ist die Vokabelsuche in ihrer nächsten Form: nicht mehr »ich rate den Namen«, sondern »ich
nehme das erste, was hinkommt«. `building(stock, 'home')` liefert das erste Haus mit blauem
Dach. Welches Haus die Vorlage zeigt, habe ich nie gefragt.

### Klasse C · Komposition — der eigentliche Fail

Die Punkte 5 bis 8 sind keine Fehler im Detail. Sie sagen, dass **keine Szene entworfen wurde**.

Eine Szene besteht aus **Relationen**: die Treppe führt vom Weg zum Haus, deshalb liegt
zwischen Weg und Haus eine Zwischenstufe — die Vorgartensituation, die Georg als den zentralen
Punkt der Bauanleitung benennt. Die Windmühle steht am Feldrand, wo der Weg hinführt, weil
Korn zur Mühle gebracht wird. Die Brücke verbindet zwei Orte, zwischen denen jemand geht.

Meine Fälle enthalten **Objekte an Koordinaten**. `await put(windmill, 3, 1, 200)` — Zelle
(3,1), 200 Grad. Warum dort? Weil im Vorlagenbild oben rechts eine Mühle steht. Das ist
Abpausen der Position ohne den Grund, und deshalb bricht es zusammen, sobald irgendetwas
danebenliegt: die Mühle steht dann mitten im Kornfeld statt an seinem Rand, und niemand merkt
es, weil keine Prüfung nach Gründen fragt.

---

## Die Wurzel, in einem Satz

> **Ich habe ein Verfahren gebaut, wo ein Entwurf gefordert war — und es mit Zahlen geprüft,
> wo ein Blick gefordert war.**

Beides steht seit dem 19.09. wörtlich im Projekt. `FAIL_ISLANDS.md`, Georgs Urteil über
`diorama.js`:

> *»eine Layout-Formel, keine Komposition — kein Objekt steht dort, weil es dort stehen soll.«*

`cases.js` ist dieselbe Datei unter anderem Namen, drei Tage später. `buildVillage()` ist eine
parametrisierte Funktion mit Schleifen über Zelllisten. Für einen **1:1-Nachbau** wäre eine
Stückliste richtig gewesen: eine Zeile je Objekt, mit Teil, Position, Winkel und **Begründung**.
Dreißig Zeilen, die man lesen und gegen das Bild halten kann.

Ich habe die Funktion geschrieben, weil Funktionen sich nach Können anfühlen. Die Stückliste
hätte gezeigt, wo ich rate — bei jeder Zeile ohne Begründung.

---

## Warum die Guardrails aus Post Mortem 03 nicht gegriffen haben

Sie haben teilweise gegriffen: G1 hat `building_home_*` gefunden, `hill_single_*`,
`hex_grass_sloped_*`. Fehlerklasse B wurde dadurch **kleiner**, nicht beseitigt.

Gegen Klasse A und C sind sie **blind**, und das ist ein Konstruktionsfehler des Post Mortems:
alle sieben Guardrails behandeln die Frage **»ist es das richtige Teil?«**. Keine behandelt
**»steht es richtig?«** oder **»warum steht es dort?«**.

G5 (»drei Kamerawinkel«) hätte Klasse A fangen können — aber G5 sagt nur, dass die Winkel
verfügbar sein müssen. Ich habe den Umschalter gebaut und in der Abnahme die Dreiviertelsicht
angesehen, in der ein Haus im Felsen wie ein Haus vor einem Felsen aussieht.

**Eine Guardrail, die ein Werkzeug fordert, ist keine. Sie muss eine Ausgabe fordern.**

---

## Maßnahmen

Diese vier gehen in die Meta-Analyse als M1–M4 und sind dort ausgeführt:

- **M1 · Geometrie-Gate** — Durchdringung und Bodenkontakt werden mechanisch geprüft, mit Zahl
  im Bericht. Kein »fertig« bei einem einzigen Treffer.
- **M2 · Stückliste statt Generator** — ein 1:1-Nachbau ist eine Liste, kein Verfahren.
- **M3 · Begründungspflicht** — jedes Objekt trägt seinen Grund; ohne Grund kommt es nicht rein.
- **M4 · Sample-Zerlegung vor dem Bau** — Objektliste mit Rolle *und Relation*, nicht nur mit
  Maß.

---

## Was in diesem Slice trotzdem trägt

Damit die Liste ehrlich bleibt — das ist nicht Schadensbegrenzung, sondern die Abgrenzung
dessen, was nicht neu gebaut werden muss:

- Die **Kantenmessung** (BT1) ist geeicht und belegt: 32 Kacheln gegen `TILE_EDGES`, 99,5 %
  Kanten, 96,9 % Kacheln, eine offengelegte Abweichung. Das Verfahren wurde durch drei
  Fassungen getragen und gegen eine bekannte Wahrheit geprüft.
- Die **abgeleitete Kantentabelle** für 144 vorher ungedeckte Kacheln, pack-qualifiziert, mit
  ausgewiesener Abdeckung (126 vollständig / 17 teilweise / 1 gar nicht).
- Der **Teile-Bilderbogen** über alle 447 Teile — das Werkzeug, das Klasse B kleiner gemacht
  hat und die Grundlage jeder künftigen Teilewahl ist.
- Die Nutzung von `hex-grid.js` **ohne Nachbau** (`buildNetwork`, `solveHexTile`,
  `auditTileFit`, `rotDeg`).

Der Bildschirm »Bauvorgaben« ist davon **nicht** gedeckt und ist zu verwerfen, nicht zu
reparieren (Regel 4 aus `use-what-works`: v2 ist der Wegwurf von v1, nicht seine Reparatur).
