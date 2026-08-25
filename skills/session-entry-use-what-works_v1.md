---
name: use-what-works
version: 1.0
date: 2026-08-26
canonical: https://raw.githubusercontent.com/georg-doc/kayfabizarro/refs/heads/main/skills/use-what-works_v1.md
compatible_with:
  - https://raw.githubusercontent.com/georg-doc/kayfabizarro/refs/heads/main/skills/session-export_v1.md
  - https://raw.githubusercontent.com/georg-doc/kayfabizarro/refs/heads/main/skills/design-chat-working-pattern_v1.md
purpose: Anti-Regressions-Skill für Design-Chats. Verhindert das Muster „raten, nachrechnen, lazy nachbauen statt Module übernehmen und Q&A-Loops mit Screenshots und Changelog belegen." Destillat aus dem WS0-SpinballCast-Sprint-Fail vom 26.08.2026.
scope: Sprint-intern — was während des Bauens gilt. Sprint-Ende geht an session-export.
---

# Use What Works — Anti-Regressions-Skill

## Kern in einem Satz

**Wenn eine Vorlage funktioniert, wird sie kopiert — nicht nachgebaut, nicht nachgerechnet, nicht gegen den Vertrag verteidigt.**

---

## Die fünf Regeln

Diese fünf Regeln sind nicht verhandelbar. Jede wurde in einer einzigen Nacht durch einen konkreten Fehler bezahlt.

### Regel 1 — Eine Theorie schlägt keine Vorlage, die funktioniert

Wenn die Dokumentation (Vertrag, README, Kommentar-Kopf) und der laufende Build auseinandergehen, **gewinnt der Build**. Die Abweichung wird **gemeldet**, nicht **behoben**. Ist der Vertrag falsch, wird der Vertrag korrigiert — nicht der Build.

*Trigger von Georg: „vertrag oder build?" — bedeutet: du stellst gerade Theorie über funktionierende Vorlage. Stop.*

### Regel 2 — Ein nachgerechnetes Verfahren ist ein NEUES Verfahren

Auch wenn dieselben Formeln drin stehen. **Übernehmen heißt kopieren, mit Zeilennummern, plus einer Naht.** Nicht: „ich verstehe was v3 macht und schreibe es neu." Das ist Erfinden mit Sicherheitsanstrich.

*Trigger von Georg: „kopieren oder nachrechnen?" — bedeutet: du hast gerade eigene Hauptachsen/Loch-Suche/Messung geschrieben, statt Block aus der Quelle zu ziehen. Stop, wegwerfen, kopieren.*

### Regel 3 — Erst sehen, dann melden

**Kein „behoben" ohne Bild.** Kein „fixed", „done", „ready" ohne Screenshot als Beleg im Chat, VOR der Erfolgsmeldung. Nicht: Code geändert → „behoben" schreiben → Georg macht Screenshot → Fehler noch da. Das ist die Reihenfolge, die drei Sprint-Runden kostet.

**Screenshot-Marker-Format (Pflicht vor jedem „behoben"):**
```
[SCREENSHOT] <datei>#<zeile>  →  <was auf dem Bild zu sehen ist>
```
Ohne diesen Marker im vorherigen Turn ist „behoben" nicht sagbar.

### Regel 4 — An der eigenen Fassung nicht weiterflicken

Wenn v1 falsch war, ist v2 nicht die Reparatur von v1. **v2 ist der Wegwurf von v1 und die Kopie aus der Quelle, die funktioniert.** Weiterflicken zieht weiteres Weiterflicken an, jede Reparatur braucht eine eigene Messung, jede Messung ist eine Messung an der falschen Sache.

*Test vor v2: „was forke ich?" Wenn die Antwort „meine v1" ist, statt eine externe Datei mit Zeilennummern — Alarm. Wegwerfen.*

### Regel 5 — Wer aus einer Messung seine Lage bekommt, darf nicht IN der Messung stehen

Der Regelkreis-Fehler. Zwei Ebenen, dieselbe Struktur: Pet-Stapel im `cardLocal`, Scheren im `cardLocal`. Wenn die Position aus einer Messung kommt, und die Messung im selben Koordinatensystem sitzt, das positioniert wird — instabil.

*Attribut wird gelesen, nicht adressiert. Zugriffsfunktionen kennen Offset, Schrittweite und Normalisierung. Der Rohpuffer kennt nichts davon.*

---

## Enforcement Gates — was VOR jeder Runde ausgegeben wird

Am Anfang jeder Bau-Runde, bevor Code angefasst wird:

```
[GATE] Sprint-Kontext: <ein Satz zum aktuellen Stand + wo im Big Picture>
[GATE] Georg-Auftrag: <verbatim, was er gesagt hat>
[GATE] Vorlagen die kopiert werden: <datei#zeilen>
[GATE] Wo wird geforkt, nicht neu gebaut: <datei>
[GATE] Was fehlt an Info bevor ich anfange: <keine Frage stellen wenn nichts fehlt>
```

Am Ende jeder Bau-Runde, bevor „fertig" gesagt wird:

```
[SCREENSHOT] <datei>#<zeile>  →  <was zu sehen>
[CHANGELOG] additiv, nicht ersetzend — was NEU dazu kam, was UNVERÄNDERT blieb, was ENTFERNT wurde
[NAHT] wo endet Original-Kopie, wo beginnt die Anpassung — eine Zeile
```

Kein „behoben" ohne Screenshot-Zeile davor. Kein Sprint-Ende ohne Changelog-Zeile.

---

## Q&A-Loop — die Definition

Q&A-Loop heißt NICHT: „ich habe was gebaut und frage Georg ob es passt."

Q&A-Loop heißt: **Bevor ich baue, stelle ich mir selbst die Rückfragen, die Georg sonst stellen müsste — schriftlich, im Chat, sichtbar für ihn.**

Format:
```
[Q] <konkrete Frage die sich aus dem Auftrag ergibt>
[A] <meine Antwort aus Quelle: datei#zeile>
```

Beispiele für Q&A-Loop-Fragen bei einem Übernahme-Auftrag „nimm Pets aus v5, Scheren aus v3, bau zusammen":

- [Q] Welche Datei enthält die Pets-Skalierung in v5? [A] `podcast-v5/stage.seat()` + `PET_FILL = { bunny: 0.351 }`
- [Q] Steht das im Widerspruch zum globalen Vertrag `pet-metrics.v1.js`? [A] Ja — Vertrag sagt cubeH, v5 nutzt Hüllkiste plus Bunny-Ausnahme
- [Q] Was ist die Regel bei Widerspruch? [A] Build gewinnt. Vertrag wird zurückgestellt oder korrigiert. Übernahme = v5.
- [Q] Welche Datei enthält die Scheren-Implementation in v3? [A] `spinballpop/sbp-v3.js` — Klingen, Lochsuche, Augenweiß, Wackelpupille, Schrauben, Texturen, 5 Klingenstufen
- [Q] Was wird davon übernommen? [A] Alles, mit Zeilennummern, plus Halter (`rotation.x = +90°`, `k = Kartenbreite/17.4`)

**Wenn diese Fragen NICHT geschrieben werden bevor gebaut wird, ist Regel 4 verletzt bevor der erste Charakter Code entsteht.**

---

## Anti-Patterns namentlich (damit sie erkennbar sind)

| Anti-Pattern | Diagnose | Gegen-Regel |
|---|---|---|
| **Theorie schlägt Vorlage** | Dokumentation über funktionierenden Build gestellt („v5 ist falsch, ich korrigiere") | R1 |
| **Nachrechnen statt Kopieren** | Eigene Hauptachsen/Messung/Formel geschrieben statt Block aus Quelle | R2 |
| **Melden vor Sehen** | „behoben" ohne Screenshot als Beleg-Zeile im Chat davor | R3 |
| **Weiterflicken am Eigenen** | v2 als Reparatur von v1 statt Wegwurf + Kopie aus Quelle | R4 |
| **Verfahren durch Zahlen ersetzen** | „fitHole ist besser, aber nicht prüfbar" — geprüft heißt: läuft am Bild | R2 |
| **Regelkreis** | Position aus Messung im System, das positioniert wird | R5 |
| **Rohpuffer adressieren** | Attribut mit eigenem Offset/Stride gelesen statt Zugriffsfunktion | R5 |
| **Aus-Dokumentation-urteilen-statt-Ist-Stand-sehen** | Dach-Muster über R1+R3 — Dokumentation für wichtiger halten als laufenden Build | R1 + R3 |

---

## Trigger-Phrasen von Georg — was sie bedeuten

| Georg sagt | Bedeutet | Reaktion |
|---|---|---|
| „vertrag oder build?" | Du stellst Theorie über funktionierende Vorlage | R1 — Build gewinnt, Screenshot, Vertrag melden |
| „kopieren oder nachrechnen?" | Du baust neu statt zu forken | R2 — wegwerfen, kopieren mit Zeilennummern |
| „hast du gesehen?" / „ist das ein Screenshot?" | Du hast „behoben" ohne Bild gesagt | R3 — Screenshot liefern, zurücknehmen bis Bild da |
| „ausbauen, nicht neu bauen" | Du baust parallele Fassung statt bestehende zu erweitern | R4 — Fork zeigen, Naht zeigen |
| „NIMM VERFICKT NOCHMAL X" | Regel wurde schon zweimal gemahnt | Stop. Kopieren. Nicht antworten mit Erklärung. |
| „warum nicht einfach übernehmen?" | Auftrag war eindeutig, du hast interpretiert | R1+R2 — Kopie liefern, ohne Rechtfertigung |

---

## Was NICHT ersetzt wird durch diesen Skill

- Nicht Georgs Personalisierung (siehe `georg` skill)
- Nicht `design-chat-working-pattern_v1.md` — dieser Skill schärft, ergänzt aber nicht
- Nicht `session-export_v1.md` — der greift am Sprint-ENDE, dieser greift WÄHREND
- Nicht die 5-Zeilen-Vertrag (Faktenschalter-Rolle) — die ist Cowork-intern

---

## Kompatibilität mit /session-export

Bei Sprint-Ende (Georg triggert `session-export` oder mahnt Post Mortem an):

- Alle `[SCREENSHOT]`-, `[CHANGELOG]`-, `[Q]/[A]`-Zeilen der Session werden gesammelt
- Struktur nach §6 des WS0-Post-Mortem-Musters: „Die fünf Regeln — welche wurden verletzt, wo, mit Beleg (datei#zeile), was war die Kosten in Runden"
- Was richtig war kommt in einen §5-Block („damit die Liste ehrlich bleibt")
- Studio-Aufgaben (aus Widersprüchen die nicht in der Sendung lösbar sind) werden als solche flagged, nicht in der Sendung geflickt

---

## Standardform am Rundenende (nach jeder Sub-Runde)

1. **Was gebaut wurde** — datei#zeilen, verbatim
2. **Screenshot-Beleg** — `[SCREENSHOT]`-Zeile im vorherigen Turn
3. **Naht** — wo endet Kopie, wo beginnt eigene Anpassung
4. **Ein Satz für Georg** — was er sehen soll, kein Prozess-Bericht

Nicht an Georg: Feldnamen-Debatten, Zahlenwerte-Listen, Optionslisten die er entscheiden müsste, Selbst-Kritik-Vorführungen. Details ins Dokument, nie in Georgs Nachricht.

---

*v1.0 · 2026-08-26 · Destillat WS0-SpinballCast-Sprint-Fail. Bei Wiederholung eines der acht Anti-Patterns: Skill neu laden, Regel-Nummer benennen, zurücksetzen.*
