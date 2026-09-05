# KFB Prompt Lab · Living Document

**Gegenstand:** Aufbau für Agenten-Läufe. Wie die Arbeit organisiert wird und wie sie sich selbst
prüft, nicht was gebaut wird.
**Art:** Living Document, additiv. Setzt keinen Vorkontext voraus.
**Konvention (hart):** keine Bindestriche als Satzzeichen, echte Umlaute, Kausalität über also und aber.

---

## 00 · Übergabe

| | |
|---|---|
| **Zuletzt passiert** | Ein fremder Lauf hat mit **einem** Prompt und rund vierzehn parallelen Agenten in etwa einer Stunde einen spielbaren Städtebauer erzeugt. Das Verfahren ist hier ausgewertet und auf KFB gedreht. Nachgetragen: die benannten Muster, zwei Korrekturen an eigenen Aussagen, und **die Trennung von Rollen und Umfang** (Abschnitt 01a). |
| **Als Nächstes** | **Wenige Rollen, voller Umfang.** Zwei Rollen genügen, also Builder und getrennter Kritiker. Aber der **Vertrag steht vor dem Code**, und **zwei Module** beweisen ihn, eines nicht. Davor nur Umgebungstest, Prüfwerkzeug und Kalibrierszene. |
| **So wird gearbeitet** | Additiv, nichts überschreiben. Zurückgenommenes bleibt stehen und wird begründet. Jede Setzung bekommt eine Kennung, jeder Fehler ein Post Mortem mit Regel in Befehlsform. |

---

## 01 · North Star

> **Sag dem Modell, wie es die Arbeit ordnet und wie es sein Ergebnis prüft, nicht nur was es bauen
> soll.**

Das ist der Satz des Urhebers, und er ist der Kern. Alles Weitere sind Folgerungen daraus.

**Der zweite Satz, der ihn tragfähig macht:** kein Agent darf „funktioniert" sagen, ohne etwas
**Beobachtbares** zu erzeugen.

---

## 01a · Zwei Achsen, die nicht verwechselt werden dürfen

> **Fang mit zwei Rollen an: einem Builder und einem getrennten Kritiker mit Bewertungsraster. Das
> allein bringt dich fast überall hin. Der Rest ist Verrohrung.**

**Das ist der Satz des Urhebers, und er gilt für die Rollen. Er gilt nicht für den Umfang.**

**Diese Unterscheidung war in einer früheren Fassung dieses Dokuments verwischt**, und sie ist der
teuerste Fehler des Projekts. Über zwölf saubere Einzelbeweise liegen vor, und keiner lässt sich mit
einem anderen zusammenbauen, **weil jedes Stück klein und ohne Vertrag gebaut wurde**.

| Achse | Klein anfangen? | Warum |
|---|---|---|
| **Rollen und Verrohrung** | **Ja.** Zwei Rollen genügen | Wellen, Integrator und Ordnerbesitz sind Verrohrung. Wer sie zuerst baut, verrohrt, bevor er weiß, ob das Verfahren greift |
| **Umfang und Vertrag** | **Nein.** Vertrag zuerst, zwei Module | **Ein Vertrag, der nur ein Modul trägt, ist ungeprüft.** Kleiner Umfang ohne Vertrag erzeugt Bruchstücke, keine Bausteine |

**Der fremde Lauf belegt es von der anderen Seite:** er war viel größer angelegt und komponierte
trotzdem, **weil der Vertrag vor dem Code stand**. Nicht weil er klein anfing.

**Also die Reihenfolge:**

| Stufe | Aufbau |
|---|---|
| **0** | **Umgebungstest, Prüfwerkzeug, Kalibrierszene.** Ohne die urteilt niemand |
| **1** | **Vertrag und Wirt.** Was ein Modul anmelden kann und was der Wirt liefert. Noch ohne Inhalt |
| **2** | **Builder plus getrennter Kritiker**, und **zwei Module gleichzeitig**, damit der Vertrag unter Last steht |
| 3 | Statusdatei, damit die Schleife von selbst weiterläuft |
| 4 | Ordnerbesitz, sobald mehrere Builder parallel arbeiten |
| 5 | Wellen und Integrator, erst bei vielen Modulen |

## 01b · Die Muster haben Namen

Der Urheber verweist auf Anthropics Aufsatz **Building effective agents**, der die Muster benennt.
**Nützlich, weil man sie danach gezielt nachlesen kann statt sie zu erfinden.**

| Muster | Was es tut |
|---|---|
| **Prompt Chaining** | Aufgabe in aufeinanderfolgende Schritte zerlegen |
| **Routing** | Eingang je Art an einen passenden Bearbeiter geben |
| **Parallelization**, also fan-out und fan-in | viele arbeiten gleichzeitig, einer führt zusammen |
| **Orchestrator-Workers** | einer plant und teilt auf, viele erledigen je ein Stück |
| **Evaluator-Optimizer** | einer baut, ein **anderer** benotet gegen ein Raster, der Builder bekommt die Liste und geht erneut |

**Und der Satz zum Evaluator-Optimizer ist der schärfste des ganzen Austauschs:**

> **Ein Modell, das seine eigene Arbeit benotet, ist viel zu freundlich zu sich selbst.**

**Das ist die dritte unabhängige Bestätigung derselben Regel.** Erst der blinde Leser bei
`anyCreature`, dann der Kritiker ohne Codezugriff, jetzt dieser Satz. **Trennung von Bauen und Urteilen
ist keine Ordnungsfrage, sondern die Bedingung, dass ein Urteil etwas wert ist.**

## 01c · Kontext schlägt Formulierung

> **Was du dem Modell vorlegst, also Dokumente, Verträge, Beispiele und die Mängelliste des Kritikers,
> zählt mehr als die Wortwahl der Frage.**

**Das rechtfertigt die ganze Living-Document-Praxis.** Der Hebel liegt nicht im geschickten Prompt,
sondern in dem, was daneben liegt. Ein Entscheidungsprotokoll, ein Vertrag und eine Mängelliste sind
also keine Verwaltung, sondern **das Werkzeug selbst**.

## 02 · Was am fremden Aufbau trägt

| Teil | Warum |
|---|---|
| **Architektur vor Feature-Code** | Ein Ordner je Subsystem, öffentliche Schnittstelle, Ereignisse, Einheiten, Determinismus, Leistungsbudget, Asset-Politik. Fast eins zu eins der eigene Modulvertrag, also unabhängige Konvergenz |
| **Prüfschleife vor dem Gegenstand** | Screenshot-Werkzeug mit JSON-Protokoll über Konsolenfehler, Bildrate und Draw Calls, **bevor** ein Feature existiert |
| **Showcase je Modul** | Eine Ansicht, die nur dieses Modul zeigt. Ohne sie ist nichts einzeln beurteilbar |
| **Kritiker ohne Codezugriff** | Urteil getrennt von Absicht. Derselbe Zug wie der blinde Leser bei `anyCreature` |
| **Integrator als einziger mit Kernrechten** | Löst das Zusammenführen, ohne dass Builder sich gegenseitig überschreiben |
| **Statusdatei zum Wiederaufnehmen** | Die nächste Runde beginnt beim schwächsten Modul, nicht von vorn. Das Living Document als Maschinenzustand |
| **Blinder Paarvergleich am Ende** | Zwei Bilder, nur A und B, Reihenfolge gemischt. **Erzwungene Wahl statt Skala** |
| **Wellen nach Abhängigkeit** | Erst Fundament, dann Aufbau, dann Demo. Verhindert, dass zwölf Agenten auf dasselbe warten |

---

## 03 · Was gedreht werden muss

**Die vier Vorgaben des Vorbilds sind für KFB falsch, das Verfahren nicht.**

| Vorbild | Bei KFB |
|---|---|
| **Referenz: Cities Skylines II** | **Referenz: die Kartenbilder selbst.** Die Frage lautet nicht „sieht es teuer aus", sondern **„gehört diese Welt in dasselbe Universum wie ihr Deck"**. Fotorealistisches PBR wäre ein Kanon-Verstoß |
| **Note 8,5 von 10** | **Messbare Böden, wo messbar. Verankertes Raster, wo nicht.** Farbanzahl unter 40, weicher Saum 0,0 %, Rasterkonstanz, Fußpunkt, Blindlese-Test bei 24 Pixeln. **Korrektur an einer früheren Aussage:** eine Zehnerskala driftet nur, wenn sie **unverankert** ist. Der Urheber verankert sie ausdrücklich, etwa „8,5 gleich AAA mit kleinen Mängeln, 5 gleich Programmierkunst". Ein verankertes Raster ist brauchbar. Der Endvergleich bleibt trotzdem blind und ohne Beschriftung |
| **50 fps bei 1080p, 1500 Draw Calls** | **Mobil zuerst**, das ist der Qualitätsboden. Und Draw Calls in **Dutzenden**: eine ganze Kartenlandschaft sind fünfzehn |
| **three latest plus Vite** | **Umgebungstest zuerst.** Nur cdnjs erreichbar, Module gehen, Addons nicht. Ein Prompt, der das nicht weiß, verbrennt die erste Welle |

---

## 04 · Entscheidungsprotokoll

| Kennung | Entscheidung | Begründung |
|---|---|---|
| **P-01** | **Umgebungstest steht vor der Architektur** | Nur cdnjs ist erreichbar, `three.module.min.js` ja, `examples/jsm` nein, GitHub raw und eigene Domain gesperrt. Wer das nicht prüft, baut die erste Welle gegen eine Wand |
| **P-02** | **Prüfwerkzeug vor dem Gegenstand** | In der Vorsitzung entstand der Umgebungstest **nach** dem gescheiterten POC. Zwei Runden wären weggefallen |
| **P-03** | **Werkzeugfassung festschreiben** | Playwright mit **Chromium 141**. Ein kopfloser Browser ohne GPU rendert weich und liefert falsche Bildraten, dann urteilt der Kritiker über ein Bild, das es auf keinem Gerät gibt |
| **P-04** | **Kalibrierszene vor der ersten Messung** | Eine Szene, bei der bekannt ist, wie sie aussehen muss. Weicht sie ab, ist das Werkzeug falsch und nicht das Ergebnis |
| **P-05** | **Reproduzierbare Vorführung je Modul, Form folgt der Behauptung** | Bild für Sichtbares, Protokoll und Zustand für Ton, **beides** für Geometrie, Zusicherungen für Logik, Blindlese-Test für Lesbarkeit |
| **P-06** | **Bild und Zahl zusammen, nicht statt** | Belegt in beide Richtungen: eine falsche Normierung war im Bild unsichtbar, ein leerer Bildschirm in den Zahlen |
| **P-07** | **Messbare Böden, wo messbar. Verankertes Raster, wo nicht** | Böden driften nicht. Eine Skala driftet nur **unverankert**. Also Raster mit Ankerbeschreibungen je Stufe, und der Endvergleich blind und unbeschriftet |
| **P-16** | **Bauen und Urteilen sind getrennte Rollen** | Ein Modell, das seine eigene Arbeit benotet, ist viel zu freundlich zu sich selbst. **Drei unabhängige Quellen sagen dasselbe** |
| **P-17** | **Erst zwei Rollen, dann die Verrohrung** | Builder plus getrennter Kritiker mit Raster bringt fast alles. Wellen, Integrator und Ordnerbesitz kommen erst, wenn mehrere Builder parallel arbeiten |
| **P-19** | **Rollen klein, Umfang nicht** | Zwei verschiedene Achsen. **Der Vertrag steht vor dem Code, und zwei Module beweisen ihn, eines nicht.** Kleiner Umfang ohne Vertrag erzeugt Bruchstücke statt Bausteine, belegt an über zwölf Artefakten |
| **P-20** | **Zwei Tore: Modul allein und Modul im Spiel geladen** | Eine Showcase-Ansicht beweist die Funktion, nicht die Verträglichkeit. **Genau das zweite Tor wurde bisher übersprungen** |
| **P-18** | **Kontext schlägt Formulierung** | Dokumente, Verträge, Beispiele und Mängellisten wirken stärker als die Wortwahl. Damit ist das Entscheidungsprotokoll kein Beiwerk, sondern das Werkzeug |
| **P-08** | **Referenz sind die eigenen Kartenbilder** | Nicht ein fremdes Spiel. Das Material liegt vor, und die Frage ist Stimmigkeit, nicht Aufwand |
| **P-09** | **Lizenzprüfung ist ein harter Boden, kein Hinweis** | Kein Asset ohne bestätigte Lizenz im Bestand. Register `BLOCK`, nicht `warn` |
| **P-10** | **Asset-Prüfung wird automatisiert, nicht von Hand gemacht** | Siehe Abschnitt 05. Der größte Zeitfresser der Vorsitzung |
| **P-11** | **Ergebnis der Asset-Prüfung ist ein Manifest** | Nicht ein Bericht. Ein Bericht wird gelesen, ein Manifest wird benutzt |
| **P-12** | **Kosten und Abbruch vorher festlegen** | `/loop bis alle Kritiker bestehen` bei unerreichbarer Latte ist eine Endlosschleife mit Rechnung |
| **P-13** | **Register `BLOCK`, `warn`, `info`** | Böden sind keine Stilmeinungen, sondern die Fehler, die eine Prüfung überleben und kaputt ausgeliefert werden |
| **P-14** | **Determinismus wird erzwungen, nicht verlangt** | Ein Linter, der `Math.random` und Uhrzeit verbietet. Verlangen allein wirkt nicht, das ist belegt |
| **P-15** | **Nutzen, was läuft, statt neu bauen** | Vorhandene Module, Registry, Ink-Kanon, Cube-Pets werden importiert. Ein zweiter Nachbau ist ein Fehler und keine Variante |

---

## 05 · Asset-Doktrin

**Der größte Zeitfresser der Vorsitzung, und er ist vollständig mechanisierbar.**

### Was von Hand gemacht wurde

| Tätigkeit | Umfang |
|---|---|
| Asset-Ordner abtasten | Ein Paket **dreimal**, weil es zwischendurch wuchs. Vier Pakete im Detail, rund 26 insgesamt |
| Eigenschaften messen | Farbanzahl, Anteil halbtransparenter Pixel, Leinwandgrösse, Bildzahl, je Paket einzeln |
| Lizenzen prüfen | Sieben Repos einzeln. Ergebnis: **zwei ohne Lizenz**, also Vollschutz, eines GPL, eines CC BY-NC, drei brauchbar |
| Namenskonventionen entdecken | **Drei verschiedene** in drei Paketen, jede erst beim Scheitern erkannt |
| Rastermasse | Bei einem Paket **alle zwanzig Dateinamen falsch**, echtes Raster erst über Leerspaltenanalyse gefunden |

**Jede dieser Tätigkeiten ist ein Skript.** Ein Agent mit einem Prüfwerkzeug hätte das in einem Durchlauf
erledigt und ein Manifest ausgegeben.

### Was das Werkzeug leisten muss

```
asset-audit <pfad>
  -> je Datei: Groesse, Farbanzahl, Anteil halbtransparenter Pixel, Bildzahl
  -> je Ordner: Leinwandkonstanz, Rasterteilbarkeit, Namensmuster
  -> je Paket: Lizenzdatei vorhanden? SPDX? Quelle?
  -> Ausgabe: manifest.json + Verstoßliste als BLOCK oder warn
```

**Vier Böden als `BLOCK`:**

1. **Keine Lizenzdatei oder keine erkennbare Lizenz** heißt Vollschutz, also nicht verwendbar.
2. **Lizenz verbietet kommerzielle Nutzung**, etwa CC BY-NC. Pay What You Want ist kommerziell.
3. **Copyleft**, etwa GPL, würde auf alles Abgeleitete durchschlagen.
4. **Rastermass nicht restlos teilbar** oder Leinwand je Figur uneinheitlich.

**Und eine Regel, die aus einem Fehler kommt:** **Größen werden nie aus dem Dateinamen gelesen.** Bei
einem Paket trugen alle zwanzig Dialogbox-Dateien eine falsche Bildgrösse im Namen, und ein Lader, der
sie liest, schneidet Bruchstücke **ohne dass irgendwo ein Fehler auftaucht**.

### Drei Sorten Quelle, im Manifest unterschieden

| Art | Erlaubt |
|---|---|
| **Assetquelle** | im Produkt verwenden und ausliefern. CC0, MIT |
| **Bedingte Assetquelle** | im Produkt verwenden, **nicht** als Asset weitergeben |
| **Referenzquelle** | ansehen, messen, daraus lernen. **Niemals ausliefern.** Eigener Ordner, vom Build ausgeschlossen |

**Das Risiko ist nicht die Absicht, sondern die Drift.** Eine Datei wandert in sechs Monaten von
Referenz nach Assets, wenn niemand mehr weiß, warum sie dort lag.

### Der positive Teil des fremden Laufs

Dort hat der Agent **selbst recherchiert**, wo es lizenzfreie PBR-Texturen und HDRIs gibt, sich einen
kleinen Herunterlader für zwei CC0-Quellen geschrieben und den Rest **prozedural** erzeugt: Wasser,
Himmel, Wolken, Partikel und fast der gesamte Ton entstanden im Code.

**Das ist bei KFB die richtige Richtung**, denn prozedural erzeugte Dinge haben keine Lizenzfrage,
kein Gewicht im Repo und keine Namenskonvention. Die eigene Regel dazu gibt es schon: prozedural,
außer wo Synthese hörbar oder sichtbar scheitert.

---

## 06 · Wellen und Rollen

**Rollen strikt getrennt, denn die Trennung ist der Wert.**

| Rolle | Darf | Darf nicht |
|---|---|---|
| **Builder** | nur den eigenen Ordner | fremde Ordner, Kern |
| **Integrator** | Kern, Nahtstellen | Modulinhalte erfinden |
| **Kritiker** | messen, Bilder aufnehmen, benoten | **Code schreiben** |
| **Auditor** | Assets prüfen, Manifest schreiben | Assets beschaffen |

**Wellen nach Abhängigkeit:**

```
Welle 0   Umgebungstest, Pruefwerkzeug, Kalibrierszene
Welle 1   Wirt und Modulvertrag, Registry-Zugang, Ink-Import, Asset-Audit
Welle 2   Gelaende, Pfad, Kartenzuschnitt, Palette
Welle 3   Figuren, Blasen, Ton
Welle 4   Demo-Welt
```

**Zwischen den Wellen genau ein Integrator-Durchgang.** Sonst laufen die Nähte auseinander.

---

## 07 · Post Mortems

| Was gebrochen war | Ursache | Regel |
|---|---|---|
| **Prüfschleife nach dem Gegenstand gebaut** | Der POC lief nicht, wurde per Bildschirmfoto geprüft, **und erst danach** entstand der Umgebungstest | **Die Prüfschleife wird vor dem Gegenstand gebaut**, und die Fassung des Messgeräts wird festgeschrieben |
| **Nichts selbst angesehen** | Fünf lauffähige Artefakte, keines vom Erbauer gerendert gesehen. Geprüft wurden nur Syntax, Kennungen, Mathematik, Pfade | **Wer etwas Sichtbares baut, muss es sichtbar prüfen.** Rechnen ersetzt Ansehen nicht |
| **Herkunft mit Technik verwechselt** | Ein Ladeweg scheiterte, daraus wurde geschlossen, das Verfahren gehe nicht. Gesperrt war nur die Herkunft | **Scheitert ein Ladeweg, zuerst trennen: Herkunft gesperrt oder Verfahren untauglich?** |
| **Konstante behauptet statt gemessen** | Eine Normierung wurde plausibel gesetzt und im Kommentar als „etwa minus eins bis eins" beschrieben. Gemessen waren ±0,25 | **Jede Konstante, die einen Wertebereich behauptet, über mehrere Seeds messen.** Ein Kommentar ist kein Beleg |
| **Regel allgemein gesetzt, ohne die Alternative zu prüfen** | „Nicht blind vierteln" galt für alles, obwohl es nur für den Betrachter stimmt | **Vor einer allgemeinen Regel den Zweck benennen, für den sie gilt** |
| **Asset-Prüfung von Hand** | Ein Paket dreimal abgetastet, Eigenschaften einzeln gemessen, Lizenzen einzeln geprüft | **Was mehr als zweimal gleich gemacht wird, ist ein Skript** |
| **Vollversion statt Anfang beschrieben** | Dieses Dokument setzte zuerst mit vier Rollen und fünf Wellen ein, obwohl zwei Rollen fast alles bringen | Es wurde die reifste Fassung der **Verrohrung** übernommen statt der kleinsten, die schon etwas beweist | **Bei der Verrohrung zuerst fragen, was die kleinste Fassung ist, die etwas beweist** |
| **Rollen und Umfang verwechselt** | Aus „zwei Rollen genügen" wurde „kleinste Fassung", und das las sich als **kleiner Umfang** | Zwei verschiedene Achsen wurden in einen Satz gepresst. **Genau diese Verwechslung hat über zwölf Artefakte erzeugt, die sich nicht zusammenbauen lassen** | **Rollen klein, Umfang nicht.** Der Vertrag steht vor dem Code, und zwei Module beweisen ihn, eines nicht |
| **Skala pauschal verworfen** | Die Zehnerskala des Vorbilds wurde als driftend abgelehnt | Übersehen, dass sie **verankert** war, also mit Beschreibungen je Stufe. Kritisiert wurde eine unverankerte Skala, die dort nicht stand | **Vor der Ablehnung eines Messmittels prüfen, ob es verankert ist.** Anker sind der Unterschied zwischen Raster und Gefühl |

---

## 20 · Der Prompt

**Zum Einsetzen. Ersetzt die Referenz, die Böden und die Reihenfolge des Vorbilds.**

```
# Ziel

Baue in diesem Ordner eine KFB-Welt-Erkundung: Torus-Weltkoerper, prozedurales
Gelaende, Karten aus echten Deck-PDFs im Gelaende, Spiralpfad als Flugstrecke,
FrizzleBob als Figur. Der Maßstab ist NICHT fotorealistisch. Der Maßstab ist:
gehoert diese Welt in dasselbe Universum wie die Kartenbilder des Decks.

# Reihenfolge, verbindlich

0. Umgebung messen, BEVOR irgendetwas anderes passiert.
   Pruefe im Ziel-Browser: erreichbare Herkuenfte, ES-Module, Addons, WebGL2,
   PDF-Bibliothek, lokale Dateiauswahl. Schreibe das Ergebnis nach
   docs/ENVIRONMENT.md. Ein blockierter Ladeweg ist ein Befund, keine Meinung.

1. Pruefwerkzeug bauen, BEVOR ein Feature existiert.
   Playwright mit Chromium 141. Es laedt die Anwendung, wartet auf Bereitschaft,
   setzt Kamera und Tageszeit, schreibt PNG plus JSON mit Konsolenfehlern,
   Bildrate, Draw Calls UND der Browserfassung.
   Dann eine Kalibrierszene, bei der bekannt ist, wie sie aussehen muss.
   Weicht sie ab, ist das Werkzeug falsch und nicht das Ergebnis.

2. Architektur schreiben: docs/ARCHITECTURE.md.
   Ein Ordner je Subsystem. Jedes Modul erklaert seine Faehigkeiten und
   Parameter, der Wirt liefert genau das. Was nicht erklaert wurde, ist nicht da.
   Einheiten in Metern, +Y oben. Determinismus: nur geseedeter Zufall, kein
   Math.random, keine Uhrzeit. Ein Linter erzwingt das.
   Leistungsbudget: mobil zuerst, Draw Calls in Dutzenden.

3. Asset-Audit bauen und laufen lassen, BEVOR ein Asset benutzt wird.
   Je Datei Groesse, Farbanzahl, Anteil halbtransparenter Pixel, Bildzahl.
   Je Ordner Leinwandkonstanz und Rasterteilbarkeit.
   Je Paket Lizenzdatei und Quelle.
   Ausgabe: manifest.json plus Verstoßliste.
   BLOCK bei: keine Lizenz, nicht kommerziell nutzbar, Copyleft, Raster nicht
   restlos teilbar, Leinwand uneinheitlich.
   Groessen NIE aus Dateinamen lesen, immer zur Laufzeit messen.
   Was prozedural erzeugt werden kann, wird nicht beschafft.

4. Wellen, je Welle ein Integrator-Durchgang danach:
   W1 Wirt, Registry-Zugang, Ink-Import  |  W2 Gelaende, Pfad, Zuschnitt,
   Palette  |  W3 Figuren, Blasen, Ton  |  W4 Demo-Welt.

5. Jedes Modul hat eine Showcase-Ansicht, die nur dieses Modul zeigt.

# Pruefung

Kein Agent sagt "funktioniert", ohne etwas Beobachtbares zu erzeugen.
Die Form folgt der Behauptung:
  sichtbar    -> Bildschirmfoto an festgelegter Kamera plus Protokoll
  Ton         -> Showcase loest aus, Nachweis ueber Protokoll und Zustand
  Geometrie   -> BEIDES, Bild und Messwerte
  Logik       -> Zusicherungen und Zahlen
  Lesbarkeit  -> Blindlese-Test bei 24 Pixeln durch eine Instanz ohne
                 Auftragskenntnis

Böden als BLOCK, messbar und nicht benotet:
  Farbanzahl unter 40 je Sprite
  weicher Saum 0,0 Prozent
  Raster restlos teilbar, Leinwand je Figur konstant
  Fußpunkt an genau einem Ort definiert
  keine Konsolenfehler
  gleicher Seed ergibt gleiche Welt

Wo nichts messbar ist: blinder Paarvergleich. Zwei Bilder, nur A und B,
Reihenfolge gemischt, ein Bild aus dem Deck als Referenz. Keine Zehnerskala.

# Regeln

- Nutzen, was laeuft. Vorhandene Registry, Ink-Kanon und Module werden
  importiert, nicht nachgebaut. Ein zweiter Nachbau ist ein Fehler.
- Keine Zahlenwerte im Bild. Karten sind Beweißtuecke, keine Powers.
- Zustand wird verkoerpert, nicht angezeigt.
- Zwei Transformationen: die logische rastet, die sichtbare federt. Die
  sichtbare schreibt NIE zurueck.
- Eine Schicht setzt oder transformiert, nie beides.
- Keine Konstante ohne Herleitung. Wer eine Zahl setzt, schreibt daneben,
  woraus sie folgt.
- Nie eine Note schoenen. Echte Zahlen, gescheiterte Runden und was fehlt.
- Fremde Ordner nicht anfassen. Kernaenderungen ueber den Integrator.
- Entwicklungsserver laeuft immer, die Anwendung ist immer ladbar.
- Nicht fragen. Routineentscheidungen selbst treffen, Annahmen benennen,
  weitermachen.
- Stand nach docs/STATUS.json schreiben. Die naechste Runde beginnt beim
  schwaechsten Modul.

# Abbruch

Nach drei Runden ohne messbare Verbesserung an einem Modul: anhalten, den Stand
schreiben, den naechsten Punkt benennen. Kein Weiterlaufen ins Leere.

Fang an.
```

---

## 21 · Kosten und Abbruch

**Der fremde Lauf, gemessen:** 297,7k Eingabe, 1,9M Ausgabe, 118,2M Cache-Lesevorgänge, 6,0M
Cache-Schreibvorgänge, rund vierzehn Agenten, etwa eine Stunde bis zum bewussten Anhalten.

**Zwei Lehren daraus:**

- **Der Cache trägt die Last.** 118M Lesevorgänge gegen 1,9M Ausgabe heißt, dass die gemeinsame Grundlage einmal aufgebaut und dann geteilt wird. Also: **Architektur und Doktrin früh und stabil**, denn genau die werden zwischengespeichert.
- **Es wurde bewusst angehalten, nicht bis zum Bestehen gelaufen.** Die unerreichbare Latte wirkt als **Gefälle**, nicht als Tor. Ein Mensch schaut hin und hält an. Das gehört in den Aufbau, nicht in die Hoffnung.

**Feste Abbruchkriterien:**

1. **Drei Runden ohne messbare Verbesserung** an einem Modul: anhalten.
2. **Umgebungstest schlägt fehl:** nicht weiterbauen, sondern den Ladeweg klären.
3. **Kalibrierszene weicht ab:** nicht messen, sondern das Werkzeug reparieren.
4. **Asset-Audit meldet `BLOCK`:** das Asset fliegt raus, es wird nicht diskutiert.

---

## 30 · Offene Entscheidungen

1. **Welcher Gegenstand für den Testlauf?** Torus-Welt ist der Kandidat, denn Handover und POC liegen vor.
1a. **Mit welcher Stufe anfangen?** Empfehlung: Stufe 0 bis 2 aus Abschnitt 01a. Also Umgebungstest und Prüfwerkzeug, dann Vertrag und Wirt, dann **zwei Module gleichzeitig** mit zwei Rollen. **Nicht ein Modul**, denn ein Vertrag mit einem Modul ist ungeprüft.
2. **Wieviele Agenten?** Vierzehn war der fremde Wert bei dreizehn Subsystemen. Bei KFB sind es weniger Module.
3. **Wo läuft der Lauf?** Braucht einen Ort mit Playwright und Chromium 141.
4. **Wird der Produktions-Skill daraus gebaut**, plus ein zweiter für Design-Briefings? Der zweite hängt vom ersten ab.
5. **Wie wird der Blindlese-Test technisch gelöst?** Er braucht eine Instanz ohne Auftragskenntnis.
6. **Kostenrahmen je Lauf**, damit Abbruch nicht nur qualitativ definiert ist.

---

## 40 · Herkunft und Herleitung

**Quelle:** ein öffentlich geteilter Prompt samt Ergebnis aus der Claude-Code-Gemeinschaft. Ein
Städtebauer in three.js, ein Prompt, rund vierzehn parallele Agenten, Kritiker mit
Referenz-Bildschirmfotos, etwa eine Stunde bis zum Anhalten. Ergänzt durch zwei Kommentare des
Urhebers zu Assets und zur Prüfmethode.

**Anlass:** die Beobachtung, dass ein Lauf mit **einem** Prompt weiter kam als eine lange Sitzung mit
vielen Handrunden.

**Herleitung:** Zuerst wurde der Prompt an seinem erklärten Ziel gemessen und für unerreichbar
gehalten, weil eine Note von 8,5 gegen ein Studio-Spiel mit CC0-Assets nicht zu holen ist. **Das war
buchstabengläubig.** Der Urheber hat nach einer Stunde bewusst angehalten, also wirkt die Latte als
Gefälle und nicht als Tor. Daraus folgte, das Verfahren zu übernehmen und nur die Vorgaben zu drehen.
Der zweite Kommentar des Urhebers schärfte die Prüfregel: nicht Bildschirmfoto, sondern
**reproduzierbare Vorführung**, und Bild **zusammen** mit Protokoll und Messwerten. Der dritte
Kommentar zeigte, dass die Asset-Frage selbst automatisierbar ist, und das ist genau der Teil, der in
der Vorsitzung von Hand erledigt wurde.

**Ergänzt aus zwei weiteren Kommentaren des Urhebers:** die Musternamen und der Verweis auf Anthropics
Aufsatz **Building effective agents**, die Verankerung des Bewertungsrasters, der Satz zur
Selbstbenotung, der Vorrang von Kontext über Formulierung, und **der Hinweis, mit nur zwei Rollen
anzufangen**. Der letzte hat dieses Dokument an seiner wichtigsten Stelle korrigiert.

**Verworfen:**

| Verworfen | Warum |
|---|---|
| **Referenz auf ein fremdes Spiel** | Fotorealismus widerspricht dem eigenen Kanon. Die Kartenbilder sind die richtige Referenz |
| <s>Zehnerskala als Gate</s> | **Zurückgenommen.** Kritisiert wurde eine unverankerte Skala. Der Urheber verankert sie mit Beschreibungen je Stufe, und das ist brauchbar. Messbare Böden bleiben vorzuziehen, wo gemessen werden kann |
| **1500 Draw Calls, 1080p** | Mobil ist der Qualitätsboden, und eine Kartenlandschaft braucht fünfzehn Draw Calls |
| **„three latest plus Vite"** | Überlebt die Zielumgebung nicht. Nur cdnjs, Module ja, Addons nein |
| **`/loop` ohne Abbruch** | Endlosschleife mit Rechnung. Drei Runden ohne Verbesserung heißt anhalten |
| **„Do not ask me questions" pauschal** | Bei begrenzten Aufgaben richtig, bei unbegrenzten der Weg zu einer selbstsicher falschen Architektur. Deshalb ist die Reihenfolge in Abschnitt 20 verbindlich statt offen |

---

*Ende. Der Wert liegt in der Ordnung und in der Prüfung, nicht im Ziel.*
