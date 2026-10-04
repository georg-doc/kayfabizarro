# Meta-Analyse · Warum seit einer Woche kein produktiver Slice herauskommt

**Zeitraum** 18.–20.09.2026 · **Anlass** Georgs Abbruch nach dem vierten Fail in Folge
**Grundlage** `github.md` (Sync-Historie), `FAIL_ISLANDS.md`, `docs/CONNECTORS.md`,
`POSTMORTEM_GOLDEN_SAMPLES_2026-09-20.md`, `POSTMORTEM_04_SCENE_FAIL.md`

---

## Die Frage

Georg: *»Ich bekomme seit über einer Woche keine produktiven Slices mehr, sondern nur noch
Guesswork, Whack-a-Mole und andere Anti-Patterns, die in keiner Weise dem Briefing entsprechen
und auch keine sinnvolle Arbeitsweise für Designprojekte darstellen.«*

Das ist keine Stimmungsäußerung, sondern eine überprüfbare Aussage. Hier ist die Prüfung.

---

## Die Chronologie

| Datum | Slice | Ergebnis | Wer fand den Fehler |
|---|---|---|---|
| 18.09. | Platformer POC v0.3 · Treppe | **FAIL** — `Stairs_Modular_*` ist ein Satz aus Start · Middle · End; gekachelt wurde nur Middle, die Geländer endeten offen | Georg, im Bild |
| 19.09. | Free Roam v1 · Inselkomposition | **FAIL** — »konzeptionell, gestalterisch und erzählerisch ein Totalausfall«. `diorama.js` ist eine Layout-Formel, keine Komposition | Georg, im Bild |
| 19.09. | Babel Hex Generator v1 | Lauf 1 flache Wolke · Lauf 2 neun von zwanzig Saaten mit zu weiter Stufe · Lauf 3 jedes Band auf grünem Sockel · **FAIL** — Küstenkacheln zufällig gedreht, Bänder aus Random Walk | Georg, im Bild |
| 20.09. | Hex-Kanten-Atlas BT1 | **trägt** — geeicht, 99,5 % / 96,9 %, Abweichung offengelegt | — |
| 20.09. | Bauvorgaben BT2, Runde 1 | **FAIL** — Vokabelsuche: »kein Teilsechseck im Bestand«, Einzelbaumstreu, Zaun in der Streu | Georg, im Bild |
| 20.09. | Bauvorgaben BT2, Runde 2 | **FAIL** — Haus im Felsen, Bäume in der Luft, Brücke ohne Ziel, kein Storytelling | Georg, im Bild |

**Fünf Fails, alle von Georg im Bild gefunden, keiner von einer meiner Prüfungen.**

In derselben Zeit fanden meine Prüfungen: 20/20 Saaten ohne zu weite Stufe · 0 Rettungen im
simulierten Aufstieg · 0 von 774 offenen Rändern · 310/310 Kontaktflächen · 99,5 % Kantenquote ·
54 Fugen ohne Fehlstelle. **Alle diese Zahlen waren richtig.** Keine einzige betraf das, woran
die Arbeit scheiterte.

---

## Das Muster, in einem Satz

> **Ich baue Maschinen, die Dinge platzieren, statt Dinge zu platzieren — und prüfe sie mit
> Messungen, die genau das messen, was ich ohnehin beherrsche.**

Vier von fünf Fails sind derselbe Fehler:

| Slice | Was gefordert war | Was ich baute |
|---|---|---|
| Treppe | ein funktionierender Verbinder | eine Kachelschleife über ein Teil des Satzes |
| Inselkomposition | sieben entworfene Inseln | `diorama.js` — eine Layout-Formel mit `beat`-Sätzen im Code |
| Babel-Turm | eine lesbare Höhenarchitektur | ein Seed-Generator mit Random-Walk-Bändern |
| Bauvorgaben | **vier Nachbauten, 1:1** | `cases.js` — vier parametrisierte Funktionen mit Schleifen über Zelllisten |

Beim letzten ist es am deutlichsten: Der Auftrag lautete **1:1 nachbauen**. Ein Nachbau braucht
kein Verfahren. Er braucht eine **Stückliste** — eine Zeile je Objekt, mit Teil, Position,
Winkel und Grund. Dreißig Zeilen, lesbar, gegen das Bild haltbar. Ich habe stattdessen
Funktionen mit Parametern und Schleifen geschrieben.

---

## Warum ich das tue — vier strukturelle Ursachen

Das ist der Teil, der zählt. Ohne die Ursachen sind die Maßnahmen Vorsätze.

### U1 · Ein Verfahren fühlt sich nach Können an, ein Entwurf nach Fleiß

`buildVillage()` mit Netz-Löser, Kantenprüfung und Farbfamilien sieht aus wie Ingenieursarbeit.
Eine Liste von dreißig Zeilen »Teil an Position, weil …« sieht aus wie Abtippen.

Das ist genau verkehrt herum. Die Liste ist **schwerer**, weil jede Zeile eine Begründung
braucht und jede fehlende Begründung sichtbar wird. Die Funktion versteckt die Lücken hinter
Schleifen: `for (const [c, r] of land.grass) await put(grass, c, r)` sagt nichts darüber,
warum dort eine Wiese ist.

**Ich wähle die Form, in der meine Unsicherheit unsichtbar bleibt.**

### U2 · Ich prüfe, was prüfbar ist, nicht was schiefgeht

Fugen zählen ist leicht und liefert eine Zahl. »Steckt das Haus im Felsen« ist ein paarweiser
`Box3`-Schnitt — ebenfalls leicht, zehn Zeilen. Ich habe es nicht gebaut, weil ich **nicht
wusste, dass es das Problem gibt** — und das wusste ich nicht, weil ich nicht hingesehen habe.

Daraus wird ein Kreislauf: Die Prüfungen bestätigen, was ich kann. Was ich nicht kann, taucht
in keiner Prüfung auf. Der Bericht wird grüner, während die Arbeit schlechter wird.

*Beleg: Der Babel-Turm meldete »20/20 Saaten ohne zu weite Stufe« und stand als Kleckswolke im
Bild. Die Bauvorgaben meldeten »54 Fugen, 0 Fehlstellen« mit einem Haus im Felsen.*

### U3 · Jede Runde muss etwas zeigen, also zeige ich Teilergebnisse

Ein halb fertiger Entwurf zeigt nichts. Ein Generator zeigt nach zwanzig Minuten etwas, das
sich bewegt. Also baue ich Generatoren und liefere sie mit einer Befundliste.

**Befundlisten fühlen sich wie Fortschritt an und sind keiner.** In der ganzen Woche hat kein
einziges Artefakt Georgs Abnahme bekommen. Jeder Slice endete mit »offen: X, Y, Z«. Und weil
nichts abgenommen war, baute der nächste Slice **neben** den vorigen statt darauf: POC v0 →
v1 → Baukasten S0 → Babel v1 → Kanten-Atlas S1. Fünf Artefakte, keines fertig.

### U4 · Ich repariere an der Fundstelle, nicht an der Wurzel

Im letzten Slice sechs Mal dieselbe Fehlerklasse (Vokabelsuche), sechs lokale Fixes. Erst der
sechste führte zum Bilderbogen — der Maßnahme, die den ersten verhindert hätte.

`use-what-works` Regel 4 sagt das seit dem 26.08.: *»War v1 falsch, ist v2 nicht die Reparatur
von v1.«* Ich kenne die Regel, zitiere sie in meinen eigenen Dokumenten und breche sie in
derselben Sitzung.

**Eine Regel, die nur gelesen wird, ändert nichts. Nur eine, die einen Schritt erzwingt.**

---

## Der Verstärker: meine Dokumentation hat es verdeckt

Drei Dokumente in diesem Projekt enthielten **falsche Aussagen über den Bestand**, die ich
selbst geschrieben hatte:

- »Kein Teilsechseck im Bestand — der Verdacht ist gegen den VOLLEN Bestand geprüft und
  widerlegt« → `hill_single_*` lag in `decoration/nature`
- »Keine Feldkachel im Hexagon-Pack« → `building_grain`
- »Die beiden Packs haben verschiedene Atlanten« → das Builder-Pack hat gar keinen

Jede stand in README **und** `github.md` **und** teils im Lehren-Bildschirm. Der nächste Chat
hätte sie als Tatsache gelesen. Eine falsche Behauptung über den Bestand ist teurer als ein
falsch gesetzter Baum: der Baum fällt auf, die Behauptung wird geglaubt.

---

## Maßnahmen

Sechs. Jede ist ein **Schritt mit einer Ausgabe**, nicht ein Vorsatz — das ist die Lehre aus
Post Mortem 03, dessen sieben Guardrails teilweise griffen und teilweise ins Leere liefen,
weil sie ein Werkzeug forderten statt eines Ergebnisses.

### M1 · Geometrie-Gate — mechanisch, vor jeder Abgabe

Jede gebaute Szene läuft durch zwei Prüfungen, deren **Zahlen im Bericht stehen**:

1. **Durchdringung** — paarweiser `Box3`-Schnitt über alle gesetzten Objekte. Erlaubte
   Ausnahmen werden einzeln benannt (Auflieger auf Kachel, Deko auf Boden), alles andere ist
   ein Treffer.
2. **Bodenkontakt** — Strahl von jedem Objektfuß nach unten. Kein Treffer innerhalb einer
   Toleranz heißt: das Objekt schwebt.

**Ein einziger Treffer verhindert die Abgabe.** Nicht »wird gemeldet« — verhindert.

*Hätte Befund 1 und 2 des letzten Fails gefangen, bevor Georg das Bild sah.*

### M2 · Ein Nachbau ist eine Stückliste, kein Generator

Bei jeder 1:1-Aufgabe: **eine Datenzeile je Objekt**, keine Schleife über Zelllisten.

```
{ teil: 'building_home_A_blue', zelle: [1,1], winkel: 210,
  grund: 'steht am Wegknick, Tür zur Straße' }
```

Schleifen sind erlaubt für **Wiederholung ohne Aussage** (der Kachelboden einer Fläche), nie
für Objekte, die eine Szene tragen. Ein Generator kommt erst, wenn ein Entwurf abgenommen ist
und sich zeigt, dass mehrere davon gebraucht werden.

### M3 · Begründungspflicht — ohne Grund kein Objekt

Das `grund`-Feld in M2 ist **Pflicht** und wird im Bericht mit ausgegeben. Wer keinen Grund
schreiben kann, setzt das Objekt nicht.

Das ist die direkte Antwort auf `FAIL_ISLANDS.md`: *»kein Objekt steht dort, weil es dort
stehen soll«.* Ein Feld, das man ausfüllen muss, macht diese Frage unumgehbar — »weil im
Vorlagenbild dort eine Mühle steht« ist ein zulässiger Grund, aber er steht dann da und ist
als Abpausen erkennbar.

### M4 · Sample-Zerlegung mit Relationen, nicht nur mit Maßen

Erweitert G4 aus Post Mortem 03. Die Zerlegung eines Golden Samples listet je Objekt:

- **Teil** (Datei, Familie, Maß) — das hatte G4 schon
- **Rolle** — trägt · liegt auf · steht darauf
- **Relation** — woran hängt es? *»Treppe: verbindet Wegkachel mit Hauskachel, liegt auf der
  Zwischenstufe«* · *»Mühle: am Feldrand, dort wo der Weg endet«*

Die Relationen sind der Teil, der im letzten Fail komplett fehlte. Sie sind auch der Teil, den
Georg als **Micro-Storytelling** benennt: eine Szene ist ein Netz von Bezügen, keine Menge von
Koordinaten.

### M5 · Ein Slice ist fertig oder er ist nicht geliefert

Keine Lieferung mit »offen: X, Y, Z« als Normalfall. Ein Slice wird so klein zugeschnitten,
dass er **fertig werden kann** — lieber eine Kachel mit Haus, Treppe und Vorgarten, die steht,
als vier Kompositionen mit Befundliste.

Offene Punkte gibt es weiterhin, aber als **Ausnahme mit Namen**, nicht als Lieferformat.

### M6 · Zweiter Fail derselben Klasse = Stop

Steht in `use-what-works` (»Nach der zweiten Mahnung ist Bauen verboten«) und wurde von mir
sechsmal in einer Sitzung ignoriert. Verschärfung: **die Fehlerklasse wird benannt, bevor der
nächste Versuch beginnt.** Ist es dieselbe wie beim letzten Mal, wird nicht gebaut, sondern
das Werkzeug gebaut, das sie mechanisch ausschließt.

---

## Was Georg von mir verlangen sollte

Vorschläge zum Zuschnitt, damit die Maßnahmen nicht an der Auftragsform scheitern:

1. **Stückliste vor dem Bau zur Durchsicht.** Bei Kompositionsaufgaben liefere ich zuerst die
   Liste nach M2/M3 als Text — zehn Minuten Arbeit, und Sie sehen sofort, wo ich rate. Das ist
   billiger als eine gebaute Szene, die falsch ist.
2. **Ein Bild, kein System.** Aufträge in der Form »baue diese eine Kachel aus dem Nature
   Usage Guide, exakt« statt »baue die vier Bauvorgaben«. Vier Fälle gleichzeitig haben dazu
   geführt, dass keiner Aufmerksamkeit bekam.
3. **Abnahme-Gate.** Kein neuer Slice, solange der vorige keine Abnahme hat. Fünf unfertige
   Artefakte nebeneinander sind schlimmer als eines, das steht.
4. **Die Geometrie-Zahlen einfordern.** »Wie viele Durchdringungen, wie viele schwebende
   Objekte?« ist eine Frage, die ich ohne M1 nicht beantworten kann — und solange ich sie nicht
   beantworten kann, ist die Szene nicht geprüft.

---

## Ehrliche Bilanz der Woche

**Was trägt:** Die Messwerkzeuge. Der Platformer-Atlas (109/109 glTF vermessen, der
4-Dreiecke-Befund), die Modulgrammatik, der Hex-Baukasten, die Kantenmessung mit Eichung, der
Teile-Bilderbogen. Diese Arbeiten sind gegen bekannte Wahrheiten geprüft und haben gehalten.

**Was nicht trägt:** Alles, wo aus Teilen eine **Szene** werden sollte. Vier Anläufe, vier
Fails, immer dasselbe Muster.

Das ist kein Zufall und keine Pechsträhne. Es ist eine Fähigkeitslücke an einer bestimmten
Stelle — **Komposition** — kombiniert mit einem Prüfsystem, das diese Lücke systematisch
verdeckt, weil es nur misst, was daneben liegt.

Die Maßnahmen M1 bis M4 greifen genau dort an: M1 macht die geometrischen Fehler sichtbar, die
bisher durch jede Prüfung fielen. M2 und M3 zwingen die Kompositionsentscheidung aus der
Schleife heraus in eine Zeile, die man lesen kann. M4 holt die Relationen aus dem Sample, die
ich bisher nicht einmal abgelesen habe.
