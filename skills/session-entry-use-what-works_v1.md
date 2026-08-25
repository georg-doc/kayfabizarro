---
name: use-what-works
version: 1.1
date: 2026-08-26
canonical: https://raw.githubusercontent.com/georg-doc/kayfabizarro/refs/heads/main/skills/use-what-works_v1.md
filename: use-what-works_v1.md
compatible_with:
  - https://raw.githubusercontent.com/georg-doc/kayfabizarro/refs/heads/main/skills/session-export_v1.md
  - https://raw.githubusercontent.com/georg-doc/kayfabizarro/refs/heads/main/skills/design-chat-working-pattern_v1.md
purpose: Anti-Regressions-Skill für Design-Chats. Verhindert das Muster „raten, nachrechnen, lazy nachbauen statt Module übernehmen und Q&A-Loops mit Screenshots und Changelog belegen." Destillat aus dem WS0-SpinballCast-Sprint-Fail vom 26.08.2026.
scope: Sprint-intern — was während des Bauens gilt. Sprint-Ende geht an session-export.
changes_in_v1_1: >
  Regel 6 neu (Beweis durch die Ausgabe der Quelle) · Regel 5 in zwei Regeln getrennt (Regelkreis /
  Rohpuffer) · Regel 3 auf einen prüfbaren Satz umgestellt statt auf einen Marker · Regel 2 mit den
  zwei Fällen versehen, die sich NICHT kopieren lassen (Naht, in der Quelle abgeschaltet) · Gates aus
  Georgs Nachricht ins Dokument verlegt (löst den Widerspruch zum Schluss-Absatz) · Adressen im Kopf
  gerade gezogen.
---

# Use What Works — Anti-Regressions-Skill

## Kern in einem Satz

**Wenn eine Vorlage funktioniert, wird sie kopiert — nicht nachgebaut, nicht nachgerechnet, nicht
gegen den Vertrag verteidigt.**

---

## Die sieben Regeln

Nicht verhandelbar. Jede wurde in einer einzigen Nacht durch einen konkreten Fehler bezahlt.

### Regel 1 — Eine Theorie schlägt keine Vorlage, die funktioniert

Wenn die Dokumentation (Vertrag, README, Kommentar-Kopf) und der laufende Build auseinandergehen,
**gewinnt der Build**. Die Abweichung wird **gemeldet**, nicht **behoben**. Ist der Vertrag falsch,
wird der Vertrag korrigiert — nicht der Build.

*Beleg: `pet-metrics.v1.js` sagt »cubeH ist der Maßstab«, `Podcast v5` nimmt die Hüllkiste plus
`PET_FILL = { bunny: 0.351 }`. Drei eigene Fassungen dagegen, fünf Runden, fünfmal derselbe Satz von
Georg: »BUNNY ZU KLEIN«.*

*Trigger: „vertrag oder build?" — du stellst Theorie über funktionierende Vorlage. Stop.*

### Regel 2 — Ein nachgerechnetes Verfahren ist ein NEUES Verfahren

Auch mit denselben Formeln darin. **Übernehmen heißt kopieren, mit Zeilennummern, plus einer Naht.**
Nicht: »ich verstehe, was v3 macht, und schreibe es neu.« Das ist Erfinden mit Sicherheitsanstrich.

**Zwei Fälle, die sich NICHT kopieren lassen — beide werden benannt, nicht verschwiegen:**

- **Die Naht.** Sie ist immer eigene Arbeit: wo das Kopiat an die neue Bühne stößt. Sie wird auf eine
  Zeile eingegrenzt und ausgeschrieben (»hier endet v3, hier beginnt der Halter«).
- **Was in der Quelle ABGESCHALTET war.** Steht der Code da, war aber nie im Bild, ist die Kopie
  **unbewiesen**. Das wird gesagt, bevor sie als übernommen gilt.
  *Beleg: v3s Klingenschrift (`armWords` war aus). Kopiert, im Bild falsch — und damit meine
  Erfindung, obwohl ich nichts erfunden hatte.*

*Trigger: „kopieren oder nachrechnen?" — du hast eigene Hauptachsen, Lochsuche oder Messung
geschrieben, statt den Block aus der Quelle zu ziehen. Stop, wegwerfen, kopieren.*

### Regel 3 — Erst sehen, dann melden

**Kein »behoben« ohne den Satz, was auf dem Bild jetzt anders ist als vorher.**

Nicht ein Marker, nicht ein Wort: ein Satz, der falsch sein kann. »Die Klingen sind dunkler als das
Papier der Karte« ist prüfbar, »behoben« nicht. Ein Marker lässt sich hinschreiben, ohne hingesehen
zu haben — ein Unterschied nicht.

Diese Regel trägt alle anderen: alles andere prüft sich am Bild oder gar nicht.

*Kosten der Verletzung, gemessen: drei Runden, in denen die Abnahme dieselben Punkte zurückgab.*

*Trigger: „hast du gesehen?" — nimm die Meldung zurück, bis das Bild da ist.*

### Regel 4 — An der eigenen Fassung nicht weiterflicken

War v1 falsch, ist v2 **nicht** die Reparatur von v1. v2 ist der **Wegwurf** von v1 und die Kopie aus
der Quelle. Weiterflicken zieht Weiterflicken an: jede Reparatur braucht eine eigene Messung, und
jede Messung ist eine Messung an der falschen Sache.

*Test vor v2: »was forke ich?« Lautet die Antwort »meine v1« statt einer fremden Datei mit
Zeilennummern — Alarm.*

*Beleg: `scissors.v1.js` (Verfahren durch Zahlen ersetzt) → `scissors.v2.js` (nachgerechnet, fünf
neue Fehler) → `scissors.v3.js` (Kopie). Zwei Fassungen toter Code.*

### Regel 5 — Wer aus einer Messung seine Lage bekommt, darf nicht IN der Messung stehen

Der Regelkreis. Kommt die Position aus einer Messung, und das Objekt sitzt in derselben Messung, ist
die Lage instabil — sie wandert mit jedem Bild.

*Beleg, zweimal in einer Nacht auf zwei Ebenen: die Scheren wurden in `cardLocal` mitgemessen, das
sie positioniert. Danach derselbe Fehler mit dem Kartenstapel: `cardLocal.h` wuchs um 0,81, die Figur
rutschte mit, bis sie auf der Klinge stand. Gegenmittel: `noMeasure`.*

### Regel 6 — Eine Kopie ist bewiesen, wenn die Ausgabe der Quelle wieder erscheint

Zeilennummern kann man abschreiben. Die **Messmeldungen** der Quelle nicht.

Läuft nach der Übernahme v3s eigene Zeile wieder — Wort für Wort, Zahl für Zahl —, dann ist es v3.
Bleibt sie aus, ist es ein Nachbau, egal was in den Kommentaren steht.

*Beleg: `[SBP] Haelfte 0 · Silhouette 4.81 → gestreckt auf 4.60 (Faktor 0.957) · Loch 1.04×0.41`.
Das ist v3s Text. Bei `scissors.v1` und `v2` war er nicht da — das allein hätte beide Fassungen
in einer Minute entlarvt.*

*Praktisch: nach jeder Übernahme wird nach der lautesten Ausgabe der Quelle gesucht und geprüft, ob
sie identisch wiederkommt. Wenn die Quelle stumm ist, wird eine ihrer Zahlen einmal ausgegeben und
mit der Quelle verglichen.*

### Regel 7 — Ein Attribut wird gelesen, nicht adressiert

Zugriffsfunktionen kennen Offset, Schrittweite und Normalisierung. Der Rohpuffer kennt nichts davon.

*Beleg: `position` und `normal` lagen im selben Puffer (interleaved). Selbst adressiert kamen
zweimal dieselben Zahlen und 11 von 45 Werten als `undefined` — die Geometrie hatte NaN, die Schere
war unsichtbar. Über `getX/getY/getZ` war es in zehn Minuten weg.*

*Dieselbe Regel eine Ebene höher: ein Winkel ohne Vorzeichen ist keine Richtung.*

---

## Was zu Georg geht, und was ins Dokument

Die Trennung ist Teil des Skills, nicht Höflichkeit. **In Georgs Nachricht steht nie ein
Prozess-Bericht.**

**Ins Dokument** (Changelog, Übernahme-Papier, Post Mortem) — vor der Runde:

```
[GATE] Stand: <ein Satz, wo wir sind>
[GATE] Auftrag: <verbatim, was Georg gesagt hat>
[GATE] Vorlagen, die kopiert werden: <datei#zeilen>
[GATE] Wo geforkt wird, nicht neu gebaut: <datei>
[GATE] Was fehlt an Information: <nur wenn wirklich etwas fehlt>
```

**Ins Dokument** — nach der Runde:

```
[CHANGELOG] additiv: was NEU dazukam, was UNVERÄNDERT blieb, was ENTFERNT wurde
[NAHT]      wo endet die Kopie, wo beginnt die Anpassung — eine Zeile
[BEWEIS]    welche Ausgabe der Quelle wieder erscheint (Regel 6)
```

**Zu Georg** — vier Zeilen, mehr nicht:

1. das Bild
2. was darauf anders ist als vorher (Regel 3 — ein prüfbarer Satz)
3. woher es kommt (»v3, Zeile 412–470« oder »meine Naht«)
4. was ER entscheiden muss, falls etwas offen ist — als Frage, nicht als Optionsliste

**Nicht zu Georg:** Feldnamen-Debatten · Zahlenlisten · Selbstkritik-Vorführungen ·
Entscheidungen, die ich selbst treffen kann · Gates.

---

## Q&A-Loop — die Definition

Q&A-Loop heißt **nicht** »ich habe was gebaut und frage, ob es passt«.

Q&A-Loop heißt: **bevor ich baue, stelle ich mir selbst die Rückfragen, die Georg sonst stellen
müsste — schriftlich, mit Quelle.** Ins Dokument, nicht in seine Nachricht.

```
[Q] <konkrete Frage aus dem Auftrag>
[A] <Antwort aus der Quelle: datei#zeile>
```

Beispiel, Auftrag »nimm Pets aus v5, Scheren aus v3, bau zusammen«:

- **[Q]** Welche Datei enthält die Pet-Skalierung in v5?
  **[A]** `podcast-v5/stage.seat()` + `PET_FILL = { bunny: 0.351 }`
- **[Q]** Widerspricht das dem Vertrag `pet-metrics.v1.js`?
  **[A]** Ja — Vertrag sagt cubeH, v5 nimmt die Hüllkiste plus Hasen-Ausnahme
- **[Q]** Was gilt bei Widerspruch?
  **[A]** Regel 1: der Build gewinnt. Übernahme = v5. Der Vertrag wird gemeldet.
- **[Q]** Welche Datei enthält die Scheren in v3?
  **[A]** `spinballpop/sbp-v3.js` — Klingen, Lochsuche, Augenweiß, Wackelpupille, Schrauben,
  Texturen, fünf Klingenstufen
- **[Q]** Was davon war in v3 im Bild zu sehen?
  **[A]** Alles außer der Klingenschrift (`armWords` aus) → Regel 2, unbewiesen, wird benannt
- **[Q]** Woran erkenne ich, dass die Kopie echt ist?
  **[A]** Regel 6: v3s Meldung `[SBP] Haelfte … Silhouette … Loch …` erscheint identisch

**Stehen diese Fragen nicht, bevor gebaut wird, ist Regel 4 verletzt, bevor das erste Zeichen Code
entsteht.**

---

## Anti-Patterns namentlich

| Anti-Pattern | Diagnose | Regel |
|---|---|---|
| **Theorie schlägt Vorlage** | Dokumentation über laufenden Build gestellt (»v5 ist falsch, ich korrigiere«) | 1 |
| **Nachrechnen statt Kopieren** | eigene Achsen, Messung, Formel statt Block aus der Quelle | 2 |
| **Verfahren durch Zahlen ersetzen** | »das Verfahren ist besser, aber nicht prüfbar« — geprüft heißt: läuft am Bild | 2 |
| **Stille Kopie ohne Beweis** | übernommen, aber die Quelle sagt nichts mehr | 6 |
| **Kopie von etwas, das aus war** | Code übernommen, der in der Quelle nie im Bild war | 2 |
| **Melden vor Sehen** | »behoben« ohne einen Satz, was anders ist | 3 |
| **Weiterflicken am Eigenen** | v2 als Reparatur von v1 statt Wegwurf plus Kopie | 4 |
| **Regelkreis** | Lage aus einer Messung, in der das Objekt selbst steht | 5 |
| **Rohpuffer adressieren** | Attribut mit eigenem Offset gelesen statt über die Zugriffsfunktion | 7 |
| **Am falschen Ort dämpfen** | die Vorlage geändert, weil der eigene Zuzug auffiel | 1 |
| **Ausnahme mit Verfallsdatum** | »nur bis zum nächsten Export« im Code — hat kein Verfallsdatum | 1 |

---

## Trigger-Phrasen von Georg

| Georg sagt | Bedeutet | Reaktion |
|---|---|---|
| „vertrag oder build?" | Theorie über Vorlage gestellt | R1 — Build gewinnt, Vertrag melden |
| „kopieren oder nachrechnen?" | neu gebaut statt geforkt | R2 — wegwerfen, kopieren mit Zeilennummern |
| „hast du gesehen?" | »behoben« ohne Bild | R3 — Meldung zurücknehmen, bis das Bild da ist |
| „ausbauen, nicht neu bauen" | parallele Fassung statt Erweiterung | R4 — Fork zeigen, Naht zeigen |
| „läuft die Quelle noch?" | Kopie ohne Beweis | R6 — Ausgabe der Quelle vorzeigen |
| „NIMM VERFICKT NOCHMAL X" | zweimal gemahnt | **Stop. Keine Erklärung.** Datei holen, Zeile für Zeile vergleichen, Unterschiede melden. Nicht argumentieren. |
| „warum nicht einfach übernehmen?" | Auftrag war eindeutig, ich habe interpretiert | R1 + R2 — Kopie liefern, ohne Rechtfertigung |
| „das ist nicht v5!" | die Vorlage wurde angefasst | R1 — jede Änderung an der Vorlage zurücknehmen, dann prüfen |

**Nach der zweiten Mahnung ist Bauen verboten.** Erlaubt sind nur: Datei holen · Zeile für Zeile
vergleichen · Unterschiede melden. Ein dritter Anlauf mit eigener Lösung ist keine Arbeit, sondern
Widerstand.

---

## Was dieser Skill NICHT ersetzt

- nicht Georgs Personalisierung (`georg`-Skill)
- nicht `design-chat-working-pattern_v1.md` — dieser schärft, ergänzt nicht
- nicht `session-export_v1.md` — der greift am Sprint-ENDE, dieser WÄHREND
- nicht den Fünf-Zeilen-Vertrag (Faktenschalter) — Cowork-intern

---

## Zusammenspiel mit /session-export

Bei Sprint-Ende (Trigger `session-export`, oder Georg mahnt ein Post Mortem an):

- alle `[Q]/[A]`-, `[CHANGELOG]`-, `[NAHT]`- und `[BEWEIS]`-Zeilen der Sitzung werden gesammelt
- Struktur nach dem WS0-Muster: **welche Regel wurde verletzt, wo (datei#zeile), was hat es in
  Runden gekostet**
- ein Block »was richtig war, damit die Liste ehrlich bleibt«
- Widersprüche, die in der Sendung nicht lösbar sind (Modell-, Vertrags- oder Studio-Fragen), werden
  als solche markiert — **nicht in der Sendung geflickt**

---

## Die Grenze dieses Skills

Kein Skill zwingt zum Hinsehen. Von den sieben Regeln ist **Regel 3** die einzige, die die anderen
sechs prüfbar macht — und die einzige, die Georg mit einem Blick kontrollieren kann. Wird sie
weich, sind alle anderen Dekoration.

Deshalb die kürzeste Fassung des ganzen Skills, für den Fall, dass nur ein Satz hängen bleibt:

> **Nimm, was läuft. Zeig das Bild. Sag, was anders ist.**

---

*v1.1 · 2026-08-26 · Destillat des WS0-SpinballCast-Sprint-Fails. Bei Wiederholung eines der elf
Anti-Patterns: Skill neu laden, Regelnummer benennen, zurücksetzen.*
