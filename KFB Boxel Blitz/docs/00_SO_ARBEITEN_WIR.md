# So arbeiten wir hier

**Gilt für jede Baustelle in diesem Projekt — Reise, Comic, Pet-Studio, Podcast, SpinballCast — und
für jeden frischen Chat. Wer hier anfängt, liest diese Seite zuerst. Sie ist kurz.**

Verbindliche Fassung: `skills/session-design-briefing.md`
(im Repo `georg-doc/kayfabizarro`, Fassung 1.1 vom 27.08.2026). Diese Seite ist die Kurzform davon.
Bei Widerspruch gilt die Vorlage im Repo.

---

## 1 · Die Reihenfolge

Fünf Schritte. Keiner wird übersprungen, auch nicht bei Zeitdruck.

0. **Vorbild suchen** — wer hat das schon gelöst, und wie? Vor dem Messen, nicht danach. Eine Messung
   findet nur Abweichungen vom vorhandenen Modell, nie ein anderes Modell (Beleg: 27.08.2026, das
   ganze Kamera-Modell kam von außen, nicht aus 16 Messungen).
1. **Messen** — das Vorhandene am laufenden Ding abnehmen. Diese Runde ändert nichts; ihr Ergebnis
   ist eine Tabelle oder ein Bild.
2. **Verstehen** — das Modell auf einer halben Seite aufschreiben: was ist Eingang, was wird daraus
   errechnet, wer besitzt welche Größe.
3. **Grenzfälle prüfen** — das Modell gegen die Extreme halten: schmalstes und breitestes Format,
   beide Ansichten, leerer und voller Zustand, erster und letzter Schritt. Wer keinen Grenzfall
   benennen kann, hat das Modell nicht verstanden.
4. **Bauen** — eine Scheibe je Runde, mit Abnahmekriterium und Rückweg.

**Die Referenz schlägt die Beschreibung.** Gibt es ein Mockup, eine Skizze, ein Bild — dann gilt das,
nicht die Prosa darüber, auch nicht die eigene. Das war in diesem Projekt viermal die Ursache.

**Und ein Zuruf von Georg ist nie eine Störung** — auch nicht mitten in einer Messung. Er überstimmt
Plan und Prosa; nach der Messung ist er zusätzlich prüfbar.

## 2 · Wie berichtet wird

Georg ist kein Techniker und hat den Kontext nicht vor sich. Also:

* **Ein Satz, ein Beleg, drei Schritte.** Kein Vorwort, kein Prozessbericht, keine Wall of Text.
* **Klare Frage mit zwei bis drei benannten Optionen**, Empfehlung markiert. Nicht „ich könnte X
  oder Y, was meinst du?".
* **Keine Verweise auf Abschnitte, Dateinamen oder Feldnamen als Begriffe.** Nichts als Beleg, was
  er nicht vor sich hat.
* **Keine Zahlenketten** im Chat, außer er fragt danach. Zahlen gehören ins Änderungsprotokoll.
* **Kein Denglisch, kein Jargon.** Deutsche Wörter; englische nur, wenn es kein deutsches gibt.
* **Dateien kommen als anklickbare Karte** — Titel, ein Satz Zweck, Download. Ein Pfad im Fließtext
  heißt: er sucht im Ordner-Chaos.
* Sichtbares in Programmen und Seiten: **Englisch**. Chat: **Deutsch**.

## 3 · Wo der Stand liegt

Jede Baustelle führt ein Stand-Dokument (`SESSION_LIVING.html`): ein Satz oben — wo steht das Ding,
darunter Verlauf, offene Punkte, Entscheidungen, Dateien, Nachbetrachtungen. **Nach jeder Runde
ergänzen, nie überschreiben, neueste Zeile oben.**

Wird eine pausierte Baustelle wieder aufgenommen, ist die erste Handlung: diese Seite lesen, dann das
Stand-Dokument der Baustelle. Kein neues Parallel-Briefing anlegen.

## 4 · Drei Regeln, die Runden gekostet haben

* **Ein Eigentümer je Größe.** Zwei Stellen, die dieselbe Zahl schreiben, waren hier viermal die
  Ursache eines Fehlers.
* **Eine Zahl, die nicht durchfallen kann, ist keine Messung.** Prüffrage vor jedem Beweis: unter
  welchen Umständen fiele sie anders aus? Dreimal an einem Tag gestolpert — ein Wert, der sein
  eigenes Suchziel abliest; eine Null, die eine algebraische Identität war; ein Test, der prüft, ob
  etwas in der Menge liegt, auf die er selbst gerechnet wurde.
* **Ein Abnahmekriterium muss enger sein als der kleinste Fehler, den es fangen soll** — sonst
  meldet es grün, während es falsch ist. Und keine Scheibe heißt „fertig" ohne fremde Abnahme.

---

## 5 · Nachtrag 30.08.2026 — dreizehn Regeln, die eine Nacht gekostet haben

**Verbindliche Fassung dieses Briefings liegt im Repo:** `skills/session-design-briefing.md`
(github.com/georg-doc/kayfabizarro). Dieser Abschnitt ist der Nachtrag aus der SpinballCast-v6-Nacht
und gilt hier, bis die Vorlage nachzieht. **Jeder neue Chat bekommt ihn mit** (Onboarding,
Housekeeping, Living Document).

1. **Vorbild zuerst — Schritt 0 ist keine Höflichkeitsfloskel.** Der Pet-Boden stand im Pet Studio
   seit Monaten in **vier Zeilen** richtig (waagerechte Weltfläche, Kind der Szene, auf Sohlenhöhe).
   Fünf Runden Reparatur an der Wirkung, weil niemand zuerst dort nachgesehen hat. Genau dafür ist
   das Studio gebaut.
2. **Eine Abnahmezahl gehört in das System, in dem der Fehler sichtbar ist.** Das Modul meldete
   »höchster Punkt exakt auf der Standlinie« (im Wirtssystem gerechnet), die Welt sagte +0,23.
   Grünes Protokoll, rotes Bild.
3. **Wer eine Zahl nicht besitzt, bittet den Eigentümer.** Drei Umwege (Deckkraft, Materialtausch,
   Abschalten) haben nicht gegriffen oder Schaden angerichtet; ein additiver `handOver`-Parameter im
   Eigentümer war die Lösung.
4. **Ein Tor, das nicht aufgehen kann, ist keine Absicherung.** Die Klingenschrift wartete auf eine
   Stauchung im direkten Elternteil — die steckt in diesem Bau in der Silhouette. Ergebnis: leere
   Klingen, monatelang unbemerkt.
5. **Eine Uhr ist kein Kriterium für eine Lage.** `t > 0.5` entschied, ob die Kachel am gekippten
   Panel hängt; in diesem Bau steht die Uhr in der Sendung auf 1, während das Panel bei −80° kippt.
   Kriterium ist die **gemessene Normale**.
6. **»Gespiegelt« und »auf dem Kopf« sind zwei verschiedene Befunde.** Fünf Anläufe lang für dasselbe
   gehalten — der eine ist ein Fehler, der andere eine Blickrichtung.
7. **Wer eine Fläche ergänzt, aber nicht besitzt, trägt `noMeasure`.** Ein messbarer Kartenkörper mit
   Tiefe hat den Pet-Boden verschoben (Georgs Cube-Bug).
8. **Im Vorschaufenster steht die Bildschleife** (`document.hidden`). Ein von Hand getickter Zustand
   ändert das Bild **nicht** — wer im Standbild messen will, ruft `renderer.render(scene, camera)`
   selbst. Drei pixelgleiche Aufnahmen sahen wie »nichts passiert« aus.
9. **Zwei unwirksame Notbehelfe sind schlimmer als ein sichtbarer Fehler** — sie verstecken ihn.
   Beide wurden gelöscht, der Fehler blieb im Bild, bis die Ursache benannt war.
10. **Nach zwei gescheiterten Erklärungen ist die dritte ein Modellfehler.** Dann wird nicht der
    nächste Kandidat geraten, sondern gemessen, **welches Objekt an dem Pixel liegt, den man SIEHT**
    (Strahl durch genau diesen Bildpunkt, Trefferliste mit Namen).
11. **Prüfe den MECHANISMUS, bevor du seine Zahlen reparierst** (Nachtrag 30.08.2026). Fünf Runden
    gingen an Höhe, Kippung und Eigentum einer Schatten-Fläche — in einem Bau, in dem *Schatten
    empfangen* überhaupt nicht funktioniert (die Schattenkarte trägt keine Geometrie; eine weiße
    Testfläche blieb hell, egal wie hell die Sonne oder wer wirft). Die Prüffrage kostet eine
    Messung: **funktioniert das Verfahren hier im Kleinen?** Ein Empfänger ohne Werfer wird nicht
    »etwas heller«, er wird **ganz dunkel** — und sieht dann wie ein Schatten aus, der falsch liegt.
12. **Ein Ausdruck ohne Reifezeugnis ist eine Behauptung.** »Sohle 0,000« war für seinen Augenblick
    richtig (1,8 s nach dem Start, Pets noch ohne Sitz) und als Befund falsch. Wer eine Zahl
    protokolliert, protokolliert mit, ob ihre Quelle schon geliefert hat.
13. **»Getroffen« ist nicht »gesehen«** (Nachtrag V7-S0). Ein Strahlentest beantwortet die
    Geometrie, nicht die Sichtbarkeit: unter der Hauptkarte liegt eine unsichtbare Spielfläche VOR
    dem unteren Blatt, und der Trefferzähler meldete darum »Band sichtbar«. Sichtbarkeit ist
    **derselbe Bildpunkt MIT und OHNE das Bauteil** — dieselbe Regel wie beim Schatten, nur andere
    Baustelle. **Und: eine übernommene Fehlerspur ist eine Vermutung, keine Messung.** Die Übergabe
    nannte eine Zeichenreihenfolge; gemessen war das Bauteil, dem sie zugeschrieben wurde,
    abgeschaltet.

---

*Angelegt 27.08.2026. Kurzform der Sitzungs-Vorlage 1.1. Änderungen dort, nicht hier.*
*Nachtrag §5 vom 30.08.2026 aus der SpinballCast-v6-Nacht; Regeln 11 und 12 aus der Pet-Boden-Runde
desselben Tages (ein Empfänger ohne Werfer wird ganz dunkel, und ein Ausdruck von 1,8 s ist kein Befund).*
