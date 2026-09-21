---
name: living-document
version: 1.0
date: 2026-08-27
purpose: >
  Themen-agnostischer Skill für ein LIVING DOCUMENT als einzige Übergabe zwischen Chats und
  Workspaces. Briefing beim Start, Pflicht zur Mitführung während der Arbeit, Struktur als
  Vertrag. Ersetzt Handover-Chats, Onboarding-Erklärungen und Nachfragen zum Projektstand.
triggered_by:
  - "living document"
  - "brief mich auf den stand"
  - "wo stehen wir"
  - "neuer chat, gleiches projekt"
  - "leg ein living document an"
---

# Living Document

**Ein Dokument, das ein neuer Chat liest und danach weiß, wo das Projekt steht, warum es so
steht, und was als Nächstes ansteht. Alles andere liegt extern.**

Themen-agnostisch: funktioniert für Software, Design, Redaktion, Forschung, Produktion.

---

## 0 · Session-Start — was du zuerst tust

Ohne Ausnahme, vor der ersten Antwort auf die inhaltliche Frage:

1. **Living Document öffnen.** Pfad steht in der ersten Nachricht, im Projektordner oder in
   `CLAUDE.md`. Gibt es keins: erste Runde ist die Anlage aus Abschnitt 2, nicht der Bau.
2. **Abschnitt „Übergabe" lesen** — zuletzt passiert, als Nächstes, wie weitergearbeitet wird.
3. **Entscheidungsprotokoll scannen** — was schon festgelegt ist, wird nicht neu verhandelt.
4. **Post Mortems scannen** — jeder Eintrag ist ein Fehler, der schon bezahlt wurde.
5. **Dokumentenregister scannen** — welche Dateien existieren und welche zusammengehören.
6. **Erst danach** antworten.

Ein Satz zurück an den Auftraggeber, keine Zusammenfassung des Dokuments: *„Ich bin im Bild —
zuletzt X, als Nächstes steht Y an."*

---

## 1 · Die Regeln des Dokuments

**Additiv.** Nichts wird überschrieben, nichts gelöscht. Überholte Einträge bekommen den Status
`NACHTRAG` und bleiben stehen. Wer nur den aktuellen Stand sieht, kann nicht erkennen, welche
Wege schon verworfen wurden — und geht sie wieder.

**Nach jeder inhaltlichen Änderung mitführen.** Nicht am Sitzungsende, nicht auf Zuruf. Eine
Änderung ohne Eintrag ist eine Änderung, die beim nächsten Chat als Rätsel auftaucht.

**Jede Festlegung ist eine Entscheidung mit Nummer und Begründung.** Ohne Begründung wird sie
beim ersten Gegenwind wieder aufgerollt.

**Jeder echte Fehler wird ein Post Mortem mit Regel.** Der Wert liegt in der Regel, nicht im
Fehler. Wiederholt sich derselbe Fehler trotz Regel, gehört das in den Eintrag — offen.

**Selbstständig lesbar.** Ein fremder Mensch oder ein fremdes Modell versteht es ohne
Vorgeschichte, ohne Chatverlauf, ohne Rückfrage.

**Kennungen tragen Namen.** Vorhaben heißen nach ihrem Inhalt („Stimme", „Badezimmer"), nicht
nach ihrer Nummer. Wer im Chat eine Nummer nennt, nennt den Inhalt daneben.

---

## 2 · Struktur — die elf Abschnitte

Reihenfolge ist Absicht: Übergabe zuerst, Register zuletzt.

| # | Abschnitt | Inhalt | Pflicht |
|---|---|---|---|
| 00 | **Übergabe** | Zuletzt passiert (mit Datum) · Als Nächstes (mit Namen) · So wird weitergearbeitet | ja |
| 01 | **North Star** | Wofür das Ganze gut ist, in vier Sätzen. Nicht Vision-Prosa, sondern Prüfstein | ja |
| 02 | **Konzepte** | Die tragenden Ideen, mit Status: aktiv, geparkt, verworfen | ja |
| 03 | **Architektur** | Wie es gebaut ist, Schichten oder Bausteine, plus die nicht verhandelbaren Bauregeln | wenn technisch |
| 04 | **Entscheidungsprotokoll** | Jede Festlegung: Kennung, Titel, Begründung, Status | ja |
| 05 | **Backlog** | Was ansteht, gruppiert nach Vorhaben. Erledigtes bleibt sichtbar | ja |
| 06 | **Recherche & Quellen** | Jede genutzte Datei, Referenz, Fundstelle — mit der Notiz, was daran wichtig war | ja |
| 07 | **Post Mortems** | Ursache und die Regel, die daraus folgt | ja |
| 08 | **Offene Fragen** | Was ungeklärt ist, auch wenn es gerade nicht blockiert | ja |
| 09 | **Betriebsregeln** | Arbeitsdisziplin, Kommunikationsregeln, externe Vorgaben und was davon hier gilt | empfohlen |
| 10 | **Dokumentenregister** | Jedes Dokument mit Version, Status, Zweck, verlinktem Namen, allen zugehörigen Dateien | ja |

**Kein Abschnitt ohne Inhalt.** Ein leerer Abschnitt wird weggelassen, nicht mit Platzhaltern
gefüllt.

---

## 3 · Die Einträge im Detail

### Übergabe

```
Zuletzt passiert   <datum> · <was fertig wurde, ein Satz, laientauglich>
Als Nächstes       <vorhaben-name> · <was ansteht und warum jetzt>
So wird gearbeitet <die vier bis fünf Sätze, die ein neuer Chat braucht>
```

Beide Listen führen, nicht nur eine. „Als Nächstes" ohne „Zuletzt" ist ein Wunschzettel;
„Zuletzt" ohne „Als Nächstes" ist ein Grabstein.

### Entscheidung

```
<Kennung> · <Titel als Aussage, nicht als Thema>
Status: Fest | Nachtrag | Verworfen
<Begründung: warum so und nicht anders — der Satz, der die Diskussion beendet>
```

Titel als Aussage: „Papier weiß, nicht beige" schlägt „Farbe des Papiers". Wer den Titel liest,
kennt die Entscheidung.

Wird eine Entscheidung überholt: neue Entscheidung anlegen, alte auf `Nachtrag` setzen und im
Text sagen, was daran falsch war. Nie überschreiben.

### Post Mortem

```
<Titel: was gebrochen war>
Ursache: <die eine Ursache, nicht die Symptomkette>
Regel:   <was daraus folgt, in Befehlsform>
```

Eine Ursache pro Eintrag. Fünf Symptome mit einer Ursache sind ein Post Mortem, nicht fünf.

### Registereintrag

```
<Kennung> · <verlinkter Name> · <Version> · Status: aktuell | aktiv | archiv | geparkt
<Zweck in einem Satz>
Dateien: <alle, die dazugehören — Dokument plus Engine plus Daten>
```

**Ein Dokument ohne Registereintrag existiert nicht.** Der Name ist ein Link, kein Pfad zum
Suchen.

---

## 4 · Benennung und Versionierung

| Muster | Gilt für |
|---|---|
| `<Name> v<N>.<ext>` | Dokumente und Prototypen. Alte Fassung bleibt lauffähig stehen |
| `<slug>-v<N>.<ext>` | Beigefügte Module parallel zur Dokumentversion, kein Modul über Versionsgrenzen |
| Index je Materialsatz | Zu jedem eingebundenen Asset- oder Datensatz ein eigenes Index-Dokument, verlinkt aus dem Register |

Größere Umbauten werden eine neue Version, keine Reparatur der alten. Die alte bleibt stehen und
im Register — sie ist der Beweis, dass die neue besser ist.

---

## 5 · Extern statt eingebettet

Das Dokument ist die Übergabe, nicht das Archiv.

- Module, Bibliotheken, Binärdaten und Material liegen extern und werden zur Laufzeit geladen.
- Im Dokument steht die Adresse und was daran wichtig war, nicht der Inhalt.
- Was geladen wurde, muss am Ergebnis ablesbar sein. Ein Fallback wird als Fallback gekennzeichnet.
- Keine relativen Pfade auf Material: sie funktionieren in der Vorschau und brechen im Export.

Ziel: das Dokument bleibt in Kilobytes, das Projekt in Megabytes, und man kann das eine ohne das
andere weitergeben.

---

## 6 · Was in den Chat geht, und was ins Dokument

Die Trennung ist Teil des Skills.

**Ins Dokument:** Messwerte, Feldnamen, Kennungen, Pfade, Begründungsketten, Prozessberichte.

**In den Chat:** was jetzt anders ist, ein prüfbarer Satz. Was der Auftraggeber entscheiden
muss. Die nächsten zwei bis drei Schritte zur Auswahl. Dateien als Karte, nicht als Pfad.

**Nie in den Chat:** Kennungen ohne Inhalt („Slice 2 ist fertig"), Messwerte als Antwort auf eine
Geschmacksfrage, Selbstkritik-Vorführungen, Optionslisten, die eine Entscheidung zurückgeben,
die selbst zu treffen war.

---

## 7 · Nachfragen statt raten

Messen beweist Mathematik, nicht Richtigkeit. Ein Wert kann stimmen und die Sache falsch sein.

- Bei Geschmack, Priorität oder Zielbild: **vorher fragen**, lieber einmal zu viel.
- Fragen tragen Kontext, keine Paragraphennummern und keine Pixel.
- Nichts gilt als fertig, was nicht angesehen wurde. Und was anders ist, wird ausgeschrieben —
  ein Satz, der falsch sein kann.
- Grundlagen werden nicht über mehrere Sitzungen iteriert. Sie sitzen beim ersten Mal.

Das Anti-Pattern, das dieser Abschnitt verhindert: raten, dann messen, dann vermuten, und erst am
Ende hinsehen — wenn überhaupt.

---

## 8 · Rundenende — jede Antwort

1. Ein Satz: was jetzt anders ist.
2. Beleg: das Bild oder die Datei als Karte.
3. Zwei bis drei nächste Schritte zur Auswahl.
4. Living Document nachgezogen — Übergabe, plus Entscheidung oder Post Mortem, falls angefallen.

Kein Preamble, kein Prozessbericht, kein Wall of Text.

---

## 9 · Anti-Patterns

| Anti-Pattern | Diagnose |
|---|---|
| **Dokument als Protokoll** | jede Runde eine Zeile, aber keine Entscheidung mit Begründung — unlesbar nach zwei Wochen |
| **Überschreiben statt Nachtrag** | der aktuelle Stand steht da, die verworfenen Wege fehlen, sie werden wiederholt |
| **Kennung ohne Inhalt** | „E-14 ist umgesetzt" — für jeden ohne offenes Dokument bedeutungslos |
| **Nummern statt Namen** | Vorhaben heißen Slice 1 bis 6, niemand weiß welches was ist |
| **Archiv statt Übergabe** | Material im Dokument eingebettet, Datei wird schwer, Weitergabe unmöglich |
| **Register fehlt** | Dateien existieren, aber niemand weiß, welche zusammengehören |
| **Regel notiert, nicht angewandt** | dieselbe Regel steht dreimal im Dokument und wird beim Schreiben wieder gebrochen |
| **Nachträglich mitführen** | Dokument am Sitzungsende aus dem Gedächtnis gefüllt, Begründungen fehlen |

---

## 10 · Anlage eines neuen Dokuments

Gibt es noch keins, ist die erste Runde die Anlage — nicht der Bau. Minimalfassung:

1. **Übergabe** mit dem, was aus der ersten Nachricht hervorgeht.
2. **North Star** aus dem Auftrag, in vier Sätzen. Bei Unklarheit fragen, nicht dichten.
3. **Entscheidungsprotokoll** mit den Festlegungen, die schon in der ersten Nachricht stecken.
4. **Register** mit den Dateien, die es gibt.

Die übrigen Abschnitte entstehen, sobald sie Inhalt haben. Ein Dokument mit vier gefüllten
Abschnitten ist brauchbar; eins mit elf leeren ist Ballast.

---

*Prinzip: ein Dokument, das man weitergeben kann statt es zu erklären. Additiv, selbstständig
lesbar, mit Namen statt Nummern — und mit den Fehlern drin, damit sie nicht zweimal bezahlt
werden.*
