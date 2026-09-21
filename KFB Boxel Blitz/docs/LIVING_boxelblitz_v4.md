# LIVING · KFB Boxel Blitz v4

**Datei:** `KFB Boxel Blitz v4.dc.html` — Fork vom 05.09.2026. **v3 ist eingefroren** und liegt
unverändert daneben (`KFB Boxel Blitz v3.dc.html`); ihr Stand-Dokument
`docs/boxelblitz-v3/LIVING_boxelblitz_v3.md` bleibt gültig als **Verlauf bis zum Fork** und wird
nicht mehr ergänzt.

**Ladeweg:** der Bestand bleibt, wo er ist (`boxelball-v1/`, `boxelblitz-v2/`, `boxelblitz-v3/`) —
einen laufenden Ladeweg umzubenennen hat in diesem Projekt schon einen Erststart gekostet.
**Neue Arbeit geht nach `boxelblitz-v4/`**: eine Datei je Scheibe, jede mit Abnahmezahl und
Rückweg im Kopf.

**Gegenstand:** Chill-and-Fun-Physikspiel auf einer KFB-Karte. Boxel-Feld verdeckt das Blatt, ein
Ugur-Würfel wird aufgeladen und losgelassen, die Zellen lösen sich auf, die Karte wird frei und
wandert in den Fächer.

**Art:** Living Document, additiv. **Neueste Zeile oben.** Setzt keinen Vorkontext voraus.
**SSOT dieser Baustelle.** Verfahren: `docs/00_SO_ARBEITEN_WIR.md`.

**⚠ PFLICHTLEKTÜRE VOR JEDER ARBEIT AN DER WÜRFELPHYSIK:**
`docs/boxelblitz-v4/POST_MORTEM_wuerfelphysik.md` (06.09., von Georg beauftragt) — sechs
gescheiterte Anläufe einer Nacht, für einen Fremden geschrieben: die Aufgabe, was **jetzt messbar
falsch** ist, jeder Anlauf mit seiner Messung und seinem Grund, meine vier wiederkehrenden
Fehlerklassen (die Abnahmezahl misst etwas anderes als der Satz behauptet — **sieben** Mal), was
weggeworfen und was behalten wird, **das fehlende mentale Modell** (fünf Oberflächen mit fünf
Restitutionen — in cannon je ein `Material` und je Paar ein `ContactMaterial`) und die ersten fünf
Schritte. **Der Kern:** die Landelage ist gelöst (29/30 flach), aber die **Kollisionsdynamik ist
tot** — gemessen **ein einziger** Abpraller von 0,21 Zellen aus 4 Zellen Fallhöhe auf das Blatt,
das laut Design-Dokument ein **Trampolin** ist (0,62). Die fünf Materialien des Spiels sind auf
**eine** globale Restitution 0,3 zusammengefallen.

**Die Reihenfolge dieser Baustelle** (Georgs Ansage 05.09., verbindlich):
1. ~~der helle Saum unter der Feldkante~~ — **erledigt in V4-S4** (Varianz-Schattenkarte, eine
   Zeile; die Kante ist dafür härter geworden, Georgs Urteil steht aus),
2. **alle Würfelbewegungen** sauber bauen (rollen, ehrlicher Abprall, Kippen über die Kante,
   Drehung an der Strecke) samt **Deformer** — Pflichtlektüre davor: `skills/kfb-cartoon-animation_v2`
   im Repo (⚠ **ohne Dateiendung**, in keiner Verzeichnisliste sichtbar, direkt beim Namen abfragen),
3. **Referenzen und Effekt-Grundmodul** einbauen (Lieferung `fx-foundation` des Coworkers),
4. danach die offenen **Effektlagen** aus `docs/boxelblitz-v3/KONZEPT_vfx_elemente.md`.

**Messgriff:** `window.__kfbBoxelBall` — unverändert derselbe Name wie in v1, v2 und v3,
absichtlich: eine Abnahme, die dort lief, läuft hier ohne Änderung.

**⚠ Messen geht nur im SICHTBAREN Fenster.** `document.hidden` parkt die Bildschleife: Uhr auf 0,
Feld mit 0 Zellen, Leinwand nicht zurücklesbar — ein Zustand, der wie ein kaputter Bau aussieht und
keiner ist. Viermal bezahlt. **Seit V4-S1 gibt es dafür den Handbetrieb** `__kfbBoxelBall.tick(n, dt)`.

---

## OFFENE SCHEIBEN (Georgs Notizen, gemessen vorsortiert — kein Auftrag)

**Vier Karten einer zufälligen Seite eines zufälligen Decks bei jedem Start** (Georg 05.09.).
**Gemessen, damit die Notiz eine Größe hat:** der Vorrat hat **6108** Karten, und jede trägt
`deck`, `packId` und **`cell`** (die Position auf ihrem Blatt) — die Struktur ist also **da**, eine
Seite ist aus `packId` + `cell` über die Blatt-Tabelle des Kartenbauers (`cb.gridTable`) ableitbar.
Heute wird der Vorrat als **eine flache Liste gesät gemischt** und dann Karte für Karte abgeräumt
(`_boot`, Z. 751 ff.), Deck und Seite spielen keine Rolle. Damit ist das eine **kleine Scheibe im
Kartenvorrat**: erst Seiten aus `cell` bilden (eine Messung: wie viele Zellen hat ein Blatt
wirklich, und sind es je Pack gleich viele), dann eine Seite ziehen statt vier Einzelkarten.
**Sie gehört NICHT in die Bewegungs-Scheibe** — die Vorgabe verbietet ausdrücklich, während einer
Bewegungsarbeit an der Kartenanzeige zu bauen (§14: »build a second card gallery while working on
motion«). Reihenfolge-Vorschlag: nach der Würfelbewegung, vor den Effektlagen.

**Die Kante ist jetzt härter** (Folge von V4-S4). Georgs Urteil: »der harte schatten passt besser« —
damit ist der alte Befund aus `recherchi-v4` (»eine harte Kante liest als Platte«) für DIESES Spiel
überstimmt und PCFSoft ist gesetzt. Falls die Kante später doch zu hart wirkt, ist der Regler die
**Auflösung der Schattenkarte** (heute 2048), nicht der Weichzeichner — bei PCFSoft ist `radius`
gemessen ohne Wirkung.

**Die Nachbar-Sperre der Gesichter** bevorzugt die Randspalten des Innenfeldes um 13 % (V4-S2).
Messbar, unter dem Rauschen, ohne sichtbare Wirkung.

**Der Saum-Rest von 21 %** ist der Boden der Messung (Papier, Tusche, Aufdruck), kein Defektrest —
er steht in jeder Fassung gleich, auch in der ohne Saum.

---

## V4-S12 · S1 — DIE ZIELDARSTELLUNG: PUNKTBOGEN BIS ZUM ERSTEN KONTAKT, LANDEQUADRAT

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (`wurfVektor`, `vorhersage`, `drawAim`,
Messgriff `dev.zielProbe`) · **Rückweg:** keiner nötig — ersetzt die sieben Tuschepunkte der v1.

**Georgs Vorgabe:** ballistische Kurve als dünne weiße Punktlinie · Lande-**Quadrat** mit
Ugur-Ecken · dunkler Pseudo-Schatten für die Lesbarkeit. SSOT §4.3: vorhergesagter **erster**
Auftreffpunkt, keine Vollbahn.

**Ein Eigentümer für die Wurfzahl.** `wurfVektor(d, e)` rechnet den Wurf; Abschuss UND Vorhersage
lesen dort. Die Anzeige kann dem Wurf nicht widersprechen, weil sie dieselbe Zahl ist. Die Bahn
endet am ersten Kontakt — Boden (dieselbe `surfaceAt`, die die Physik füttert), Bande oder Decke.

**Gemessen im Handbetrieb:** Vorhersage läuft ohne Fehler, Quadrat sitzt auf dem berechneten
Kontakt (Lage in Karteneinheiten = Zellen × 0,7833 auf drei Stellen), Punkte nach Weglänge im
Drittelzellen-Abstand. **Befund dabei:** ein Würfel, der in einer **Lücke** liegt (Sohle auf dem
Blatt, Nachbarn 0,78 hoch), trifft bei 30° die Flanke der Nachbarzelle nach 0,5 Zellen — die
Vorhersage zeigt das ehrlich (Quadrat direkt am Nachbarn, keine Punkte, weil der Weg kürzer ist
als eine Würfelkante). Das ist Physik, kein Anzeigefehler: aus einer Grube kommt man nur steil
heraus. Georgs Punkt 1 (Antippen kippt) ist die Antwort darauf.

**Prüfzahl S1 offen:** vorhergesagter gegen gemessenen Auftreffpunkt (≤ halbe Zelle). Der
Messgriff dafür steht (`dev.zielProbe`), die Reihe fehlt — sie braucht einen echten Wurf über den
Spielweg, und den macht Georg.

---

## V4-S36 · EINE SCHATTENLOGIK FÜR ALLES · ZUFÄLLIGE KARTE JE RUNDE

**Datum:** 06.09.2026 · **Geändert:** nur der Wirt (Kopfzeile, Hinweiszeile, Kartenwahl) ·
**Rückweg:** die Kopfzeilenblöcke und `this.pool.shift()`.

**Georgs Korrekturen, alle umgesetzt:**
- **Untertitel sitzt am Text** statt tief darunter: die Kiste der ersten Zeile ist von 44 auf **32 px**
  herunter — sie war 12 px höher als die Wortmarke, und dieser Leerraum war der fehlende »Connect«.
- **Punktzahl kleiner**, 40 → **26 px**, damit sie in dieselbe 32-px-Kiste passt. Damit bleiben beide
  Fluchten: obere Kante mit der Wortmarke, gemeinsame Grundlinie von »Pop« und Untertitel.
- **»Pop«** statt »POP«, engeres Sperren.
- **Eine Schattenlogik für alles.** Das UI-Kit setzt an der Wortmarke
  `text-shadow: 2px 2px 0 var(--kfb-ink)` — einen **versetzten** Tuscheschatten nach unten rechts.
  Meine `-webkit-text-stroke` lag **rundherum** und hat den Buchstabenkern zugezogen; auf dem
  gemusterten Grund wurde daraus ein grauer Fleck. Jetzt überall derselbe Schatten wie bei »Kayfa« —
  Kopfzeile, Untertitel, »Pop«, Kette, Hinweiszeile, Entwicklerzeile.
- **Special Elite fett.** Eine Schreibmaschinenschrift mit dünnen Serifen trägt keinen Rand;
  Lesbarkeit kommt jetzt über **Stärke** statt über Kontur.
- **Immer eine zufällige Karte.** Vorher nahm der Wirt die **vorderste** aus dem Puffer (`shift`) —
  also die Reihenfolge, in der der Seitenstrom sie geliefert hat. Jetzt wird eine beliebige gezogen,
  mit dem **geseeteten** Zufall des Wirts: zufällig **und** bei gleicher Saat wiederholbar.

**Nicht gebaut, für den frischen Chat eingereiht** (Georgs eigener Vorschlag): die **Farbpalette aus
der Kartensaat** (`uploads/KFB_ColorPalettes_CardSeed_v1-2dea88c8.md`). Sie ist keine
Schönheitskorrektur, sondern ein eigenes Modul: OKLCH-Palette aus einem Hash der Karte, vier
Harmonie-Familien, gewichtete Verteilung, Ablehnungsregeln, dazu die Bindung von Farbe an Funktion
(Auflösen / Bumper / Umlenker). Mit dem Rest meines Kontexts würde ich das anfangen und nicht sauber
zu Ende bringen.

**Sprintplan für den nächsten Chat, in dieser Reihenfolge:**
1. **Kollision und Bumper** — Bumper-Boxel reagieren und wachsen, echte Rampenphysik, Auflösung nach
   Impact-Stärke und Richtung; »er springt noch zu oft unmotiviert weiter«.
2. **Münder von Augen trennen** — drei Boxel mit Augen, drei mit großen Mündern, alle drei
   Mundvarianten je einmal (danach: den Würfel schlucken).
3. **Farbpalette aus der Kartensaat.**
4. Ring beim Aufprall (§4.5-Verstoß → Burst) · Nachschwingen (Augen/Mund als Träger).

---

## V4-S35 · KOPFZEILE AUSGERICHTET (Arbeitstitel »Boxel Banger Blitz«)

**Datum:** 06.09.2026 · **Geändert:** nur der Wirt `KFB Boxel Blitz v4.dc.html` (Kopfzeile,
`marginPx` des Zahnrads) · **Rückweg:** die zwei Blöcke der Kopfzeile.

Georgs vier Vorgaben, umgesetzt:
- **Untertitel »Boxel Banger Blitz«**, mittig **unter** der Wortmarke (nicht unter dem linken
  Drittel — die Wortmarke sitzt dafür in einer eigenen, auf ihre Breite geschrumpften Kiste).
- **»POP« in Special Elite** statt Irish Grover, unter der Punktzahl.
- **Punktzahl und Wortmarke fluchten an der oberen Kante**, und **»POP« und der Untertitel sitzen
  auf derselben Grundlinie**.
- **Zahnrad** auf denselben Randabstand wie die Kopfzeile (16 px oben statt 18).

**Der Trick für die zwei Fluchten ist EINE Kistenhöhe** (44 px) für die erste Zeile beider Spalten
plus derselbe Abstand darunter (4 px). Dann fluchten Wortmarke und Zahl oben, und weil beide
zweiten Zeilen dieselbe Schrift und Zeilenhöhe 1 haben, liegen sie auf einer Grundlinie. *Ohne die
gleiche Kistenhöhe hängt die zweite Zeile an der Schrifthöhe der ersten — und die ist in den zwei
Spalten verschieden; das war der Grund, warum »POP« und der Untertitel vorher nie zusammenpassten.*

**Zahnradgröße unverändert bei 29 px** — das war Georgs eigene Vorgabe vom 04.09. (»3D gear 1/3
kleiner«). Ausgerichtet ist es jetzt; ob es auch größer werden soll, ist eine Entscheidung, die
seiner alten widerspräche, also frage ich statt sie zu treffen.

**Offen, in dieser Reihenfolge notiert:**
1. **Kollision und Bumper** (Georgs Hauptpunkt): »nicht so wirken, als würde der Würfel selber
   beschleunigen« — die Bumper-**Boxel** sollen reagieren und **größer werden**, echte Rampenphysik
   haben und den Würfel sichtbar katapultieren; der Kontakt soll nach **Impact-Stärke und Richtung**
   aufgelöst werden. »Die grundsätzliche Kollisionsabfrage ist schon gut, aber er springt noch zu
   oft unmotiviert weiter.« Das ist eine eigene Scheibe und die größte offene Baustelle.
2. **Münder von Augen trennen:** drei Boxel mit Augen, drei mit **großen Mündern**, alle drei
   Mundvarianten je einmal, zufällig verteilt. (Das Schlucken des Würfels kommt danach.)
3. Ring beim Aufprall (§4.5-Verstoß, Burst statt Ring) · Nachschwingen.

---

## V4-S34 · DIE URSACHE IST GEFUNDEN: DIE TOTZONE MASS VOM WÜRFEL, NICHT VOM ZEIGER

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (`grab.ax/ay` als echter Anker, Totzone und
Zugweite aus der Zeigerbewegung, `dev.klickProbe`) · **Rückweg:** die drei Zeilen in `tickCharge`.

**Georgs Protokoll aus seinem Fenster — die Zahl, die alles erklärt:**

| Klick | gehalten | höchste Ladung | Verformung |
|---|---|---|---|
| 1 | **1,62 s** | **0,012** | 0,995 |
| 2 | 0,75 s | **0,003** | 0,995 |
| 3 | 1,06 s | **1,000** | **0,600** ← wirkt |

Bei 1,62 s Halten und 0,55 s Ladezeit **muss** die Ladung 1 sein. Sie war 0,012 — das sind 6,6 ms.
Also war sie **im ersten Bild eingefroren**.

**Warum:** `onMove` schreibt `grab.px` mit der **aktuellen** Zeigerlage über — es ist kein Anker,
sondern eine Mitschrift. Und die Totzone prüfte `d.x − grab.px`, also den Abstand zwischen dem
**Würfel** und dem Zeiger. Der ist beim Anfassen **nie null**: wer den Würfel nicht genau in der
Mitte trifft, hat sofort mehr als 0,35 Kanten Abstand — die Geste gilt als »gezogen«, die Druckdauer
ist im ersten Bild festgesetzt, und es gibt nichts mehr zu laden. Dass es beim dritten Klick ging,
war keine Laune: da lag der Griff näher an der Mitte.

**Eine Totzone muss von dort messen, wo der Zeiger angefangen hat — nicht von dem Ding, das er
gegriffen hat.** Jetzt gibt es einen echten Anker (`grab.ax/ay`, wird nie überschrieben), und die
Zugweite ist die **Bewegung des Zeigers seit dem Drücken**. Die Zielrichtung bleibt unverändert
(vom Würfel zum Zeiger) — daran hat Georg sein Zielen gelernt, das wird nicht mit derselben
Änderung umgedreht.

**Nebenbefund, mit behoben:** `grab.zug` war ebenfalls der Abstand Würfel–Zeiger und darum schon
beim Anfassen groß — daher das früher gemessene `zug 1` an einem Würfel, der nur dalag.

**ABNAHME** (`dev.klickProbe` treibt `tickCharge` selbst — genau den Weg, in dem der Fehler saß):

| Griff neben der Mitte | gehalten | gezogen | höchste Ladung | eingefroren |
|---|---|---|---|---|
| 0,00 | 1,00 s | – | **1,000** | nein |
| **0,45** (der alte Fehlerfall) | 1,00 s | – | **1,000** | nein |
| 0,45 | 0,30 s | – | 0,545 | nein |
| 0,00 | 1,00 s | 1,5 Kanten | 0,424 | **ja, bei 0,424** |
| 0,00 | 0,20 s | 1,5 Kanten | 0,091 | **ja, bei 0,091** |

Der Griff daneben lädt jetzt voll durch · die Ladung ist der Haltedauer proportional (0,30 s /
0,55 s = 0,545) · und das Einfrieren beim Ziehen funktioniert weiter, wie es Georgs Konzept
verlangt.

**⚠ Was mich sechs Runden gekostet hat:** ich habe die Wirkung (»die Stauchung ist nicht sichtbar«)
viermal an der Verformung gesucht — Kurve, Exponent, Höchstwert, Ladezeit — und die Ursache lag im
**Eingabeweg**. Georgs Satz »reproduzierbar erst nach dem dritten Klick« war die ganze Zeit der
entscheidende Hinweis: *eine Wirkung, die von der GESTE abhängt und nicht vom Wert, hat ihre Ursache
in der Geste.* Und gefunden wurde sie erst, als die Aufzeichnung **während** des Haltens gemessen
hat statt an den Rändern.

---

## V4-S33 · DIE BANDEN STANDEN AM KARTENRAND, NICHT AM FELDRAND

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (`measure`: Banden aus dem Boxelfeld;
Klick-Protokoll zeichnet während des Haltens auf) · **Rückweg:** die vier Zeilen zurück auf
`cl.cx ± cl.w/2`.

**»Der vergrößerte Würfel steckt immer noch in der Karte« — und die Sohle war nie das Problem.**
Gemessen in Georgs Fenster: `dz 0,0000` · `Fläche darunter 0,0000` · **`Sohle − dz = 0,0000`**. Die
Sohle sitzt also exakt auf dem Blatt. Sein Bild zeigt trotzdem einen halb versunkenen Würfel — am
**linken Rand**, außerhalb der letzten Boxelspalte.

**Der Ort war es.** Gemessen:

| | Karte (bisherige Banden) | Boxelfeld |
|---|---|---|
| x | −5,000 … +5,000 | **−4,700 … +4,700** (12 · 0,7833) |
| y | −2,787 … +2,787 | **−2,620 … +2,620** (7 · 0,7485) |

Die Wände lagen **0,30 außerhalb** des Feldes in x und 0,167 in y — bei einer Würfelhälfte von
0,259 passt er dort **vollständig** hinein. Auf diesem Streifen liegt aber nicht das flache Blatt,
sondern der aufgestellte Papprand des Kartenstapels: der Würfel steht korrekt auf z = 0 und sieht
halb versunken aus. Jetzt sind die Banden die Grenzen des **Feldes**.

**Abnahme:** Banden −4,700 / 4,700 / −2,620 / 2,620 = Feldgrenzen, auf drei Stellen gleich · vier
harte Würfe in alle vier Richtungen: die äußerste Würfelfläche erreicht **4,83**, der Papprand
beginnt bei **5,00** — er kann den Streifen nicht mehr betreten. (Die Wand wird um 0,13 eingedrückt;
das ist die Weichheit des Lösers und liegt innerhalb der 0,30 flachen Blattes.)
Nebenwirkung, benannt: die Decke folgt der kurzen **Feld**seite und ist damit 6,69 statt 7,12 Zellen.

**Und das Klick-Protokoll war nutzlos gebaut.** Es zeichnete beim Drücken und Loslassen auf — beim
Drücken ist die Ladung per Definition **0**, und Georgs fünf Einträge zeigten fünfmal `charge 0`.
Dazu fehlten alle `up`-Einträge: es gibt offenbar **einen zweiten Weg**, über den ein Wurf endet,
und der ist nicht der, den ich instrumentiert habe. *Eine Aufzeichnung, die nur die Ränder einer
Geste sieht, kann über deren Verlauf nichts sagen.* Jetzt wird **während** des Haltens
mitgeschrieben: höchste erreichte Ladung, kleinster senkrechter Verformungsfaktor, Haltedauer.

---

## V4-S32 · DER HITSTOP KAM ZU FRÜH · DIE SOHLE WIRD GERECHNET · KLICK-PROTOKOLL

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (Hitstop scharf erst nach dem Abstoß, Sohle aus
den skalierten Halbachsen, `dev.klickLog`) · **Rückweg:** `setParams({ hitstop: 0 })`.

**1 · »Der Würfel wird erst nach einer kurzen Verzögerung vom Boxel zurückgestoßen.«**
Das war mein Hitstop von vor einer Stunde, und er war an **zwei** Stellen falsch:
- **Er fror zu früh.** §11.4 legt den Stillstand auf 40–95 ms **nach** der Kontaktaufnahme (0–40 ms:
  Kontakt registriert, *dann* Hitstop). Ich habe im Augenblick des Kontakts eingefroren — also
  **vor** dem Rückprall. Der Würfel klebte am Klotz und flog danach los: genau die beschriebene
  Verzögerung. Jetzt wird der Stop erst **25 ms nach** dem Kontakt scharf — der Abstoß ist sichtbar,
  dann steht das Bild.
- **Er fror zu oft und zu lang.** Schwelle bei einem Siebtel der Bezugswucht, Dauer 96 ms — also bei
  fast jeder Landung. Jetzt erst ab der **halben** Bezugswucht und kürzer.
  *Ein Hitstop ist ein Ausrufezeichen; wer ihn überall setzt, schreibt keinen Satz mehr.*

**Abnahme:** derselbe Fall aus 4 Zellen — 480 Physikschritte ohne, **451 mit** → **60 ms**
angehalten (vorher 96 ms), und erst nach dem Abstoß.

**2 · »Der vergrößerte Würfel steckt auch noch im Kartenboden.«**
Meine Fassung von vorhin setzte den Mittelpunkt auf *Sohle + halbe Kante · Höhenmaßstab* und hat
damit **zwei** Dinge übersehen: die **Stauchung** (macht ihn flacher, der Mittelpunkt müsste tiefer)
und die **Drehlage** (ein gekippter Würfel ist senkrecht höher als eine Kante — bis zum Faktor √3).
Ein einzelner Korrekturfaktor kann das nicht treffen. Jetzt wird die halbe senkrechte Ausdehnung
**ausgerechnet**: drei skalierte Halbachsen, jede mit dem Betrag ihrer z-Komponente in der Welt.
**Eine Formel statt drei Sonderfälle.**

**Abnahme — Abstand der Sohle von `d.z`, fünf Zustände:**
ohne Druck **0,0000** · voller Druck **0,0000** · 40° gekippt **0,0000** · 40° gekippt + voller
Druck **0,0000** · voller Druck auf 3 Zellen Höhe **0,0000**.

**3 · Georgs reproduzierbarer Befund bekommt ein Protokoll statt einer Vermutung.**
»Erst nach 5–6 In-place-Klicks setzt die Vergrößerung ein.« Zwei Ursachen sind inzwischen
ausgeschlossen: der **Zeichenweg** (die Pose ist direkt nach dem Laden vollständig da, V4-S31) und
die **Uhr** (`grab.t0 = time` — dieselbe Uhr wie `tickCharge`, also kein Versatz zwischen zwei
Zeitquellen; das war meine erste Vermutung und sie ist widerlegt).
Statt weiter zu raten, zeichnet das Modul jetzt **jedes Drücken und Loslassen** auf: Ladewert,
`eFix`, Zeitstempel, Knotenfaktoren, Zustand, Bodenkontakt (`dev.klickLog()`, Ringpuffer für 40
Einträge). Georg klickt sechsmal, und danach steht im Protokoll, **ab welchem Klick** es greift und
**welche Zahl** vorher gefehlt hat. Er muss die Geste nicht mehr anhalten.

---

## V4-S31 · DIE DECKE IST ABGELEITET · HITSTOP GEBAUT · DER WÜRFEL WÄCHST NACH OBEN

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (Decke aus der kurzen Feldseite, Hitstop,
Mittelpunkt am skalierten Maß) · **Rückweg:** `setParams({ ceilCells: 3.4, hitstop: 0 })`.

**1 · Die Decke war eine gewählte Zahl, jetzt ist sie abgeleitet.** Georgs Frage: »wie ist denn die
Höhe, die du mit 3,40 bezeichnest — ist das die kurze Seite der Karte? Das würde ich als Minimum
sehen, aber dass wir das wie einen Quader sehen, der genau die Kartenproportionen hat, und die
kurzen Seiten quasi quadratisch sind.« Die 3,40 stand in **keinem** Verhältnis zur Karte — sie war
ein Parameter. Jetzt ist die Decke die **kurze Seite des Feldes**:

| | vorher | jetzt |
|---|---|---|
| Feld | 12,77 × 7,12 Zellen | unverändert |
| Decke | **3,40** | **7,12** (= kurze Seite) |
| höchster Sprung (Sohle) | 2,72 | **6,44** |

Damit ist der Spielraum ein Quader, dessen Querschnitt an der kurzen Seite ein **Quadrat** ist —
genau das beschriebene Modell. Der höchste Sprung ist 2,4-mal so hoch wie vorher, und die
Flipper-Interaktion über die Decke hat Raum.

**2 · Der Würfel wuchs in die Karte.** Der Höhenmaßstab skaliert das Netz um seinen **Mittelpunkt**,
also sank die Sohle um die halbe Zunahme. Der Mittelpunkt liegt jetzt eine halbe **skalierte** Kante
über der Sohle statt einer halben ungeskalierten — die Sohle bleibt liegen, er wächst nach oben.

**3 · Hitstop, und er ist belegt.** `kfb-cartoon-animation_v2` §11.4 führt ihn als das eigentliche
Wucht-Signal (40–95 ms Stillstand nach dem Kontakt); §14 verbietet, Cartoon als Ersatz für Timing zu
behaupten — und genau das hatten wir getan, indem die ganze Wucht auf der Verformung lag.
Angehalten wird die **Physik und die Pose** (die Feder friert ein); die **Effekte laufen weiter**,
weil der Burst in dieser Pause gelesen werden soll.
**Abnahme:** derselbe Fall aus 4 Zellen, 40 Bilder — **480 Physikschritte ohne**, **434 mit**
Hitstop: **46 Schritte = 96 ms** angehalten, also genau die Obergrenze der SOP bei voller Wucht.
Schwache Kontakte bekommen weniger, unter einem Siebtel der Bezugswucht nichts — ein Ausrollen hält
nicht die Welt an.

**⚠ 4 · GEORGS REPRODUZIERBARER BEFUND IST OFFEN, und meine Messung schließt eine Ursache AUS.**
Er: »die Höhenstauchung durch Druck greift erst nach dem 6. oder 7. Wurf — reproduzierbar am Anfang
nicht vorhanden, irgendwann im Verlauf dann da und dann auch die ganze Zeit.«
Gemessen **direkt nach dem Laden, ohne einen einzigen Wurf**: Ladung 0,25 / 0,60 / 1,00 →
1,054/1,054/0,900 · 1,147/1,147/0,760 · 1,291/1,291/**0,600**, Höhenmaßstab 1,000. Die **Pose ist
von der ersten Sekunde an vollständig da** — der Zeichenweg ist es also nicht.
Damit bleibt als Ursache der **Ladewert selbst** (`d.charge`) im echten Spiel: er wird beim Ziehen
eingefroren, und wenn beim ersten Wurf ein alter Wert stehen bleibt oder das Einfrieren zu früh
greift, verformt sich nichts — bis irgendein Zustand ihn löst. Das ist eine Vermutung, keine
Messung, und ich baue nichts darauf. **Was sie entscheidet:** Georg drückt einmal direkt nach dem
Laden ohne zu ziehen und lässt das Fenster stehen; dann lese ich `charge` und die Knotenfaktoren im
selben Augenblick aus — dieselbe Methode, die den schiefen Würfel und das gekippte Netz geklärt hat.

---

## V4-S30 · SPRUNGHÖHE GEMESSEN · DRALL WAR VERKEHRT PROPORTIONAL · SOP-AUDIT

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (`tremor` 0, `lean` 24°, `hoch` halbiert,
Drall an der Zugweite) · **Rückweg:** `setParams({ tremor: 0.022, lean: 0.244, hoch: 0.16 })`.

**Georgs drei Vorgaben am Ladebild, umgesetzt:** Zittern beim Ziehen **weg** · Kippung von 14° auf
**24°**, weiter linear mit der Zugweite · Höhenmaßstab **halbiert** (»wird ein bisschen zu groß, das
sollten wir dezenter machen«).

**⚠ Der Drall war verkehrt proportional.** `wUeber = 2π/Flugzeit` heißt »eine Umdrehung je Flug« —
bei einem **kurzen** Sprung ist die Flugzeit klein, also war der Drall **groß** (bis an den Deckel
von 14 rad/s), bei einem hohen Sprung klein. Ein sanft gedrückter Würfel wirbelte am wildesten, und
weil ein wirbelnder Kasten auf Ecken landet, kam daraus ein Teil des Chaos, das Georg als »sehr von
der Zugweite abhängig« beschreibt. Jetzt hängt der Drall an der **Zugweite**: wer weit zieht, wirft
über die Fläche und der Würfel taumelt; wer nur drückt, bekommt einen ruhigen, fast senkrechten
Sprung.

**DIE SPRUNGHÖHE IST GEMESSEN — und die Logik stimmt:**

| Ladung | Sollhöhe | gemessener Gipfel |
|---|---|---|
| 0,50 | 1,50 | **1,48** |
| 1,00 | 2,72 | **2,69** |
| 1,00 + voller Zug | 2,72 | **2,64** |

Also: **die Höhe hängt an der Druckdauer und nicht am Zug** (2,69 gegen 2,64 bei vollem Zug — 2 %
Unterschied). Die zwei Ausreißer der Reihe (Ladung 0,25 → 5,97 statt 0,89; 0,75 → 3,35 statt 2,11)
sind **Abpraller am Feld**, nicht ein Fehler der Formel: der Würfel startet zwischen Klötzen und
wird von einem Treffer weiter hochgeworfen. Das ist Spiel, nicht Defekt.

**Zur Frage »könnte er nicht höher springen«:** bei voller Ladung steigt die **Sohle** auf 2,72
Zellen, und die Decke liegt bei **3,40** — die Oberkante des Würfels berührt sie also genau. Höher
geht nur, wenn die **Decke** steigt, und die gehört dem Feld. Das ist Georgs Entscheidung, keine
Zahl, die ich still ändere.

**SOP-AUDIT gegen `kfb-cartoon-animation_v2` — was steht, was fehlt:**

| Punkt | Stand |
|---|---|
| §2.1 Ursache | ✓ Eingabe |
| §2.1 Anlauf (Anticipation) | ✓ Stauchung + Kippung gegen die Schussrichtung |
| §2.1 Aktion | ✓ Impuls am versetzten Punkt |
| §2.1 Aufprall | ✓ Stauchung auf der Flächennormale + Drall |
| §2.1 **Nachschwingen** | **✗ fehlt** — der Würfel hat keine losen Teile; Augen/Mund wären die Träger (Pet-Rig, nicht eingebaut) |
| §2.1 Erholung | ✓ Feder auf null, Aufrichten nach Frist |
| §2.2 Timing/Spacing | ✓ kommt aus der echten Physik |
| §4.5 **Ringverbot** | **✗ VERSTOSS** — `ripple` setzt bei der Landung einen **Ring**; Ringe sind für Zielen/Laden/Portal/Zone reserviert und als Aufprall-Effekt ausdrücklich verboten |
| §4.6 Staubregel | ✓ Tusche-Kleckse sind klein und gefüllt |
| §7 Audio als Interpunktion | ✓ eine Spur je Ereignis |
| §11.4 **Hitstop** (40–95 ms) | **✗ fehlt** — die Wucht wird nur über Verformung gelesen, nicht über Zeit |
| §12.1 Beleg vor Anspruch | ✓ jede Runde mit Zahlen |
| §14 Physik nicht überschreiben | ✓ gemessen, Körper-Drift 0,000000 |

**Drei benannte Lücken, keine gebaut:** Ring beim Aufprall (Verstoß, muss ersetzt werden — Burst
statt Ring) · Hitstop · Nachschwingen. Reihenfolge gehört Georg; mein Vorschlag ist **Hitstop
zuerst**, weil §11.4 ihn als das eigentliche Wucht-Signal führt und wir es bisher allein der
Verformung aufgeladen haben — genau der Fehler aus §14.

**Notiert, nicht geändert** (Georgs Entscheidung): »der Würfel trifft am Anfang drei Boxel und bleibt
dann auf anderen liegen — finde ich vielleicht gar nicht so verkehrt, dass da eine variable
Ausgangssituation entsteht; würde ich notieren, aber erstmal so lassen.«
**Und ein grünes Ergebnis von ihm:** »das Landen in der Lücke klappt jetzt gut.«

---

## V4-S29 · DIE STAUCHUNG WÄCHST STUFENLOS · DER HÜPFER IST WEG, DER WÜRFEL RICHTET SICH AUF

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (`press` linear), `cube.v3.js` (Hüpfer entfernt,
`aufrichten` mit Frist) · **Rückweg:** `setParams({ press: 0.09 })` bzw. `aufrichtZeit: 1e9`.

**1 · »Nicht stufenlos — nimmt direkt nach dem ersten kurzen Klick die volle Breite an.«**
Meine Überkorrektur: der Exponent **0,4** ist vorne steil und hinten flach — bei Ladung 0,05 standen
schon 30 % der Stauchung, bei 0,15 fast die Hälfte. Damit war das *Wachsen* unsichtbar und der
*Sprung* sichtbar. Jetzt **linear** mit größerem Endwert:

| Ladung | 0 | 0,1 | 0,2 | 0,4 | 0,6 | 0,8 | 1,0 |
|---|---|---|---|---|---|---|---|
| gestaucht | 0 % | 4 % | 8 % | 16 % | 24 % | 32 % | **40 %** |

Exakt proportional. Zusammen mit der Ladezeit von 0,55 s (V4-S27c) ist der Endwert erreichbar.

**2 · Der Hüpfer ist ersatzlos entfallen — Georgs Lösung ist einfacher.**
Sein Befund: »der Würfel dreht sich ein bisschen, in der Hoffnung, dass er eine Position findet, wo
er zurückfallen kann — aber das sieht komisch aus, weil er dann noch mal stehen bleibt, sich noch
ein kleines bisschen bewegt und dann etwas unglücklich animiert runterfällt.« Genau so war es
gebaut: Versuch, Stillstand, Versuch — eine Kette von Zuckungen, weil jeder Versuch eine neue
Ruhelage erzeugen konnte.
Seine Vorgabe: »wenn er für eine gewisse Zeit ruht und nicht auf dem Boden ist, dann einfach so
drehen, dass er auf die darunterliegende Fläche fällt.« Umgesetzt: **eine Bedingung, eine Frist,
eine Handlung** — Gierung bleibt, Kippung und Rollen gehen auf null, Ort bleibt, und den Rest macht
die Schwere. **Ein Fall statt vieler Hüpfer.** Kein Budget, kein Aufgeben: solange er schief ruht,
läuft die Frist wieder an. Damit sind auch `weckGrenze`, Eskalation und die Notlandung aus derselben
Runde wieder draußen — sie waren die falsche Antwort auf die richtige Frage.

**⚠ »Ruht« ist gemessene Stille, nicht die Schlaf-Fahne der Engine.** Erste Fassung fragte
`sleeping` — gemessen hat die Regel damit in **0 von 4** Fällen gefeuert, und der schiefe Fall blieb
bei **39,9°** liegen: cannon legt einen Körper, der sich zwischen zwei Wänden reibt, **nie**
schlafen. Genau die Lage, um die es geht, ist die, in der die Fahne nie kommt. Jetzt zählt Tempo und
Drehtempo selbst, mit zwei Geschwindigkeiten: **still** → 0,30 s, **langsam** (unter 1,5 Zellen/s) →
0,54 s. Echtes Rollen ist schneller, ein Klemmen nicht.

**ABNAHME:** vier Würfe aus 2,5 Zellen Höhe mit stark gekippter Startlage → **4 von 4 enden flach
(0,0°)**, und zwar **ohne** dass die Regel eingreifen musste (0 Aufrichtungen). Ihr eigener Beleg
ist der Zwischenstand davor: ein Fall bei 35,1° wurde in **einer** Aufrichtung auf 2,5° gelöst.
*Die Regel ist das Sicherheitsnetz, nicht der Mechanismus* — dass sie in der Abnahme nicht feuert,
ist das gewünschte Ergebnis und keine Bestätigung, dass sie funktioniert; deshalb steht beides da.

---

## V4-S28 · EINE VERFORMUNG IST KEIN KONTO — UND DER WÜRFEL RUHT NICHT FLACH

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (`deform` mit Hüllkurve **und** Maximum statt
Summe) · **Rückweg:** die zwei Zeilen in `deform`.

**Georg:** »am Ende, wenn kaum noch Impact da ist und der Würfel einfach rollt, deformiert er sich
noch — das sollte eine Abhängigkeit von Geschwindigkeit, Impact und Kinetik haben und nicht einfach
bei jedem Kontakt die Informationen zeigen.«

**Zwei Ursachen, die zweite war die eigentliche:**
1. **Feste Stärken an acht Aufrufstellen** (0,30 beim Rollen · 0,35 beim Auflösen · 0,7 beim
   Umlenken · 0,9 beim Bumper · 1,0 beim Flankenstoß) — unabhängig davon, ob der Würfel fliegt oder
   ausrollt. Statt achtmal zu korrigieren, bekommt der **Eigentümer** eine Hüllkurve aus dem Tempo:
   unter einem Achtel des Bezugstempos passiert nichts, darüber wächst sie linear bis zur Hälfte.
2. **⚠ Die Stärke wurde ADDIERT.** Gemessen im ausrollenden Würfel (Tempo 1,2–2,8) stand die
   Stauchung bei **0,30–0,34**, also am Anschlag — obwohl jeder einzelne Beitrag mit der Hüllkurve
   nur **0,02** groß war. Ein rollender Würfel hat aber in **jedem Bild** einen Kontakt: 31 Aufrufe
   × 0,02 = 0,62, geklammert auf das Maximum. **Eine Verformung ist kein Konto.** Jetzt nimmt sie
   das **Maximum**: ein schwacher Kontakt kann den Würfel nie voll stauchen, gleich wie oft er
   kommt, und ein starker setzt sofort durch.

**Abnahme** (ein echter Wurf, 90 Bilder, Tempo aus dem Körper gelesen):
schnelle Phase (Tempo > 8) max Stauchung **0,339** · langsame Phase (Tempo < 3) max **0,176** —
vorher stand die langsame Phase ebenfalls bei 0,34.

**⚠ DER EIGENTLICHE BEFUND DIESER RUNDE, und er ist wichtiger als alles Vorige:
DER WÜRFEL RUHT NICHT FLACH.** Derselbe Wurf endet mit **Schiefe 41,75°** und schläft nach 2,6 s
nicht. Das erklärt auch Georgs erste Klage — »den Höhen-Deformer sehe ich nicht«: liegt der Würfel
42° gekippt, ist die Achse »nach oben« keine Würfelachse mehr, die Stauchung sitzt auf einer
gekippten Achse, und sie liest sich nicht als **Höhe**. Jede weitere Arbeit an der Verformung baut
auf einem Fundament, das nicht steht.

**⚠ Und eine frühere Abnahme dieser Baustelle ist damit hinfällig:** V4-S13 meldete »40 von 40
liegen flach«. Diese Zahl kam aus `dev.audit`, und dessen Würfe wurden über `d.vx/d.vy/d.vz`
gesetzt — seit dem Umbau auf cannon sind das **Rückschriften ohne Wirkung** (in V4-S9b als kaputt
protokolliert). Die 40 von 40 haben also Würfe gezählt, die nie stattgefunden haben.
*Eine Abnahmezahl, deren Messweg später als kaputt erkannt wird, muss zurückgezogen werden — sonst
steht sie im Dokument und deckt einen offenen Defekt.*

**Nächste Scheibe, mein Vorschlag: »der Würfel ruht flach«** — vor jeder weiteren Verformung. Alles
andere ist Politur auf einem Fundament, das Georg seit sechs Runden zu Recht anspricht.

---

## V4-S27 · DRUCK STEILER UND ERREICHBAR · AUFPRALL KIPPT · UND EINE WIDERLEGTE VERMUTUNG

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (`press` 0,36 mit Exponent 0,4,
`chargeTime` 1,05 → 0,55 s, `spinKick` beim Aufprall, `dev.neigeProbe` korrigiert) ·
**Rückweg:** `setParams({ chargeTime: 1.05, press: 0.09, spinKick: 0 })`.

**»Höchststauchung sehe ich nicht« — die Pose war nie das Problem, die ERREICHBARKEIT war es.**
Gemessen bei voller Ladung: Kanten **0,669 / 1,308 / 1,308** — 33 % gestaucht und **1,95-mal breiter
als hoch**. Das ist unmissverständlich. Nur kam dort niemand hin: das **Ziehen friert die
Druckmessung ein** (Georgs eigene Vorgabe), und wer nach 0,3 s zu zielen beginnt, stand bei Ladung
0,29 — und die ergab mit der alten linearen Kurve 9 %. Drei Änderungen, jede an ihrer Ursache:
Kurve steiler (Exponent 0,4), Höchststauchung eigene Zahl (0,36), **Ladezeit 1,05 → 0,55 s**. Die
Zuordnung Ladung → Sprunghöhe bleibt unangetastet; nur die Zeit bis zum Anschlag ist kürzer.

**Der Aufprall kippt jetzt.** Georg: »der Würfel wird einfach hoch- und runtergefahren; der Impact
würde eine leichte Drehung nahelegen.« Ein senkrechter Stoß auf einen Kasten trifft ihn in der
Praxis nie mittig; ohne Drehmoment sieht der Abprall wie ein Aufzug aus. Also ein kleiner Drall aus
der Wucht auf beide waagerechten Achsen.

**⚠ Die erste Zahl war 5,2 rad/s und machte genau den Fehler, vor dem mein eigener Kommentar
warnt:** gemessen 30–50° Kippung, Endlage 25–49°, **4 von 4 nicht zur Ruhe**. Auf 1,6 rad/s gesetzt.

**⚠ UND DANN HAT DIE A/B-PROBE MEINE EIGENE DIAGNOSE WIDERLEGT.** Derselbe Fall dreimal **ohne**
Drall: max Kippung **40°**, Endlage **40°**, ruht **0 von 3**. Mit Drall: 49/55/42° max, Endlage
35/45/25°, ruht 0 von 3. Also: **das Kippen und das Nicht-zur-Ruhe-Kommen gehören nicht meinem
Drall** — ein Würfel, der aus 3 Zellen auf ein Klotzfeld fällt, landet auf Zellkanten und kippt von
selbst; mit Drall wird die *Endlage* im Mittel sogar flacher (35° gegen 40°). Ohne die Nullprobe
hätte ich an der falschen Zahl gedreht. *Eine Änderung, die man nicht gegen ihren eigenen
Nullzustand gemessen hat, ist keine Messung.*
Das Zeitfenster der Probe (1,5 s) ist zu kurz für das Ausrichten — V4-S13 hat mit dem vollen
Spielweg **40 von 40** flach gemessen. »ruht 0 von 3« ist damit eine Aussage über die Probe, nicht
über das Spiel; als Kriterium taugt sie nicht und steht hier nur als Vergleich.

**Offen, Georgs Vorgabe für die nächste Scheibe:** beim Start soll der Würfel **genau einen** Boxel
auflösen und **nur solche ohne Augen oder Mund**. Das ist eine Spielregel im Einwurf-Pfad und
braucht den Eigentümer »welche Zelle trägt ein Gesicht« (das Feld) — nicht gebaut.

---

## V4-S26 · DIE STAUCHUNG IST SICHTBAR, DIE KIPPUNG GEHT NACH HINTEN

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (`press` als eigene Zahl mit Wurzelkurve,
Kippung samt Drehkante umgekehrt) · **Rückweg:** `setParams({ press: 0.09, lean: 0 })`.

**»Die Stauchung bei Druck sehe ich nicht« — die Rechnung sagt, warum.** Sie hing **linear** an der
Ladung, und eine Ladung braucht 1,05 s bis zum Anschlag. Ein normaler Druck von 0,3 s ergibt Ladung
0,29 und damit **9 %** Stauchung: etwa vier Bildpunkte, im Bild nichts. Nur bei voller Ladung waren
es 31 % — und so lange hält niemand.

Zwei Änderungen: die Höchststauchung ist eine **eigene Zahl** (0,30; die 0,313 aus `deform` gehören
dem Aufprall), und sie wächst mit der **Wurzel** der Ladung. Damit steht die Rückmeldung früh im
Bild, wie es `kfb-cartoon-animation_v2` verlangt (Rückmeldung im ersten Bild, nicht am Ende der
Rampe). Breiter wird er dabei von selbst — Volumenerhaltung.

| Ladung | Kanten (breit / breit / hoch) | Höhe eingedrückt |
|---|---|---|
| 0,00 | 1,000 / 1,000 / 1,000 | 0,0 % |
| 0,15 | 1,064 / 1,064 / 0,884 | **11,6 %** |
| 0,30 | 1,094 / 1,094 / 0,836 | **16,4 %** (vorher 9 %) |
| 0,50 | 1,127 / 1,127 / 0,788 | 21,2 % |
| 0,75 | 1,162 / 1,162 / 0,740 | 26,0 % |
| 1,00 | 1,195 / 1,195 / **0,700** | **30,0 %** |

**⚠ Die Kippung war falsch herum — ein Vorzeichenfehler gegen meinen eigenen Kommentar.** Georg:
»ich ziehe ihn ja in eine bestimmte Richtung und er fliegt in die Abschussrichtung — aus meiner
Sicht soll es umgekehrt sein, dass er sich, wenn ich ziehe, **mit der Zugrichtung nach hinten**
kippt und dann nach vorne beschleunigt.« Gebaut war eine Neigung **in** die Schussrichtung,
beschrieben hatte ich das Gegenteil. Jetzt kippt die Oberseite mit dem Zug, und die Drehkante ist
die **hintere** Bodenkante (auf der Zugseite) — dort liegt er auf, vorne hebt er ab. Damit ist die
Geste die des Pinball-Kolbens, und das Loslassen entlädt genau die Richtung, in die er schießt.

**Abnahme:** Zug 0 / 0,5 / 1,0 → Neigung 0° / 6,99° / **13,98°**, Deckel nach vorn
0,0000 / −0,0166 / **−0,0404** — negativ heißt: kippt **gegen** den Schuss ·
Schussrichtung 0/90/180° ergibt dreimal −0,0404 (richtungsunabhängig) · Körper-Drift 0,000000.

---

## V4-S25 · DIE LADUNG ZEIGT SICH AM WÜRFEL — NEIGUNG STATT VERSCHIEBUNG
**(Kipprichtung in V4-S26 umgekehrt — Georgs Einwand)**

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (Neigung + Zittern auf den Sicht-Knoten,
`dev.neigeProbe`) · **Rückweg:** `setParams({ lean: 0, tremor: 0 })`.

**Zwei Antworten auf Georgs Fragen:** die **Abschussmechanik bleibt unangetastet** (drücken, ziehen,
loslassen — genau wie gebaut); geändert ist nur, **wie die Ladung sichtbar wird**. Und sein Einwand
gegen meinen Kolben-Vorschlag ist richtig und erledigt ihn: »ich habe teilweise gar keinen Raum, wo
ich den Würfel optisch hinziehen könnte, wenn er zwischen irgendwelchen Boxeln sitzt«. Eine
**Verschiebung** braucht freien Platz neben dem Würfel; in einer Gasse gibt es den nicht.

**Eine Drehung braucht keinen.** Der Würfel kippt über seine **vordere Bodenkante** nach hinten,
gegen die Schussrichtung — Sprinter im Startblock, zurückgezogener Pinball-Kolben. Er bleibt in
seinem eigenen Grundriss, und die Kante, um die er kippt, liegt auf dem Boden: nichts sinkt ein,
nichts ragt in einen Nachbarklotz.

Das ist Georgs bevorzugter Weg (b) — »wenn wir das ohne visuelle Hilfen darstellen können und es
trotzdem intuitiv ist, ist das eigentlich besser«. Drei Träger, alle am Würfel, kein Overlay:

| Eingabe | Träger |
|---|---|
| Druckdauer | **Stauchung** (steht seit V4-S24, ehrlich, weil er auf einer Fläche liegt) |
| Zugweite | **Neigung** gegen die Schussrichtung, 0 → 14° |
| hohe Ladung | **Zittern**, hochfrequent und winzig, wächst quadratisch |

Das Zittern ist eine **Sinusschwingung über der Uhr**, kein Zufall — Zufall je Bild flackert
(`kfb-cartoon-animation_v2` §5.2: stabiler Keim, nur Transformationen animieren). Alles drei sitzt
auf den **Sicht-Knoten**; beim Loslassen fällt es in einem Bild weg, und genau das ist das Schnappen.

**ABNAHME:**

| Zug | Druck | Neigung | Zittern (Kanten) | Körper-Drift |
|---|---|---|---|---|
| 0,00 | 0,00 | **0°** | 0,0000 | 0,000000 |
| 0,25 | 0,30 | 3,50° | 0,0001 | 0,000000 |
| 0,50 | 0,60 | 6,99° | 0,0033 | 0,000000 |
| 0,75 | 0,85 | 10,49° | 0,0097 | 0,000000 |
| 1,00 | 1,00 | **13,98°** | 0,0152 | 0,000000 |

Linear · **Körper-Drift 0,000000** (die Sicht fasst die Physik nicht an) · Schussrichtung
0/45/90/180/270° ergibt **fünfmal 13,98°** — die Neigung hängt nicht von der Richtung ab, es gibt
nichts, was springen könnte · der tiefste Punkt **steigt** beim Kippen um 0,07 Kanten, sinkt also
nicht ein.

**⚠ Eine Zahl dieser Probe ist im falschen Bezugssystem gemessen:** »Sohle über Boden« vergleicht
eine **Weltkoordinate** (aus `localToWorld`) mit der **kartenlokalen** Höhe `d.z` — die Karte ist
gekippt, das sind zwei verschiedene Systeme, und der absolute Wert (−1,50) ist bedeutungslos. Die
**Differenz** über die Reihe ist es nicht: sie zeigt das Steigen. Als absolutes Kriterium taugt sie
nicht und ist hier nur als Verlauf zitiert.

**Bleibt als Rückfallweg, falls es nicht intuitiv liest** — Georgs Mockup-Variante: dünne weiße
Kreise unter dem Würfel (unter dem Schatten) als Druckanzeige plus ein sauber gestalteter Pfeil für
die Zugrichtung. Nicht gebaut, weil er selbst den Weg ohne Hilfen vorzieht; sie ist damit eine
Entscheidung, keine Aufgabe.

---

## V4-S24 · DIE GEOMETRIE-VERFORMUNG IST ABGESCHALTET — DER WÜRFEL IST WIEDER EINE SAUBERE KISTE

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (`round`/`stretch`/`pull`/`bulge` auf 0,
Stauchen nur noch auf einer Fläche, `dev.ladeProbe` liest beide Kanäle) ·
**Rückweg:** `setParams({ round: 0.62, stretch: 0.22, pull: 0.26, bulge: 0.55 })` holt die
Gummifassung zurück — der Shader-Weg steht vollständig und ist nur auf null gestellt.

**Georg 06.09.:** »das funktioniert leider nicht und sieht auch nicht gut aus — wenn der Würfel so
klein wird und sich dann auch noch streckt, sieht das alles sehr komisch aus; diese Abschrägung
gibt es teilweise immer noch — da müssen wir den anderen Ansatz finden.«

**Warum er klein wurde, gerechnet:** die Rundung blendete zur Kugel mit Radius 0,5 — das ist die
**Innenkugel** des Würfels. Eine Ecke liegt bei 0,866; bei Rundung 0,62 landet sie auf **0,639**,
also 26 % nach innen, während die Flächenmitten bei 0,5 stehen bleiben. Die Umrisslinie schrumpft
stark, die Flächen nicht — genau das »klein und matschig«. Eine Rundung, die die Größe halten soll,
müsste zur **Außen**kugel blenden.

**Woher die restliche Abschrägung kam:** dieselbe Rundung. Sie zieht die Ecken radial nach innen,
die Flächenmitten bleiben — dazwischen entsteht eine Schräge, die wie eine Fase aussieht. Es war
**nie ein Scherfehler**, sondern die Rundung selbst. Meine Erklärung in V4-S23 (»Schern ist
unmöglich«) war formal richtig und hat den sichtbaren Effekt trotzdem verfehlt.

**⚠ UND DER GRUNDSÄTZLICHE FEHLER, vier Runden lang:** `kfb-cartoon-animation_v2` §14 verbietet
ausdrücklich, »Cartoon als Ersatz für Timing und Staging zu behaupten«. Genau das habe ich getan —
die Lesbarkeit aus der **Verformung** holen wollen, wo sie aus **Timing** kommen muss. Ein
Hartgummi-Würfel streckt sich im Flug nicht; das tut ein Ball. Ein Würfel liest sich über Bogen,
Drehung, Hitstop und Staub.

**Was bleibt:** genau der eine Fall, in dem eine Achsenskalierung ehrlich ist — der Würfel liegt
auf einer **Fläche** (beim Laden, beim Landen), seine Achsen stehen dann weltparallel, und Stauchen
lässt ihn eine saubere, flachere Kiste sein. Kein Schern, keine Rundung, keine Wölbung. **Im Flug
wird nicht verformt.**

**ABNAHME:**

| Druck | Zug | Knoten | Shader | Volumen | Rundung |
|---|---|---|---|---|---|
| 0 | 0 | 1,000 / 1,000 / 1,000 | 1,000 / 1,000 / 1,000 | **1,0000** | 0,00 |
| 0,5 | 1 | 1,089 / 1,089 / **0,844** | 1,000 / 1,000 / 1,000 | **1,0000** | 0,00 |
| 1 | 0 | 1,206 / 1,206 / **0,687** | 1,000 / 1,000 / 1,000 | **1,0000** | 0,00 |
| 1 | 1 | 1,206 / 1,206 / **0,687** | 1,000 / 1,000 / 1,000 | **1,0000** | 0,00 |

Zugweite hat **keine** Wirkung mehr (Zeile 3 und 4 identisch) · Zugwinkel 0/30/45/60/90° ergibt
**fünfmal 1,155 / 1,155 / 0,750** — es gibt nichts mehr, was springen könnte ·
**Flugstreckung 0,0000** bei Tempo 0 / 4 / 12 / 20.

**⚠ Meine erste Fassung dieser Probe las den falschen Kanal** und meldete 1,000/1,000/1,000 bei
voll gestauchtem Würfel — das Stauchen sitzt seit dieser Runde wieder am **Knoten**, der Shader auf
null. Dritter Fall der Klasse »die Zahl misst etwas anderes als ihr Satz behauptet«, diesmal in der
Probe selbst. Jetzt liest sie beide Kanäle und multipliziert sie.

**VORSCHLAG FÜR DEN ANDEREN ANSATZ (Georgs Frage), nicht gebaut:**
Die Zugweite ist **keine Verformung, sondern eine Verschiebung** — das steht in seinem eigenen
Wurf-Konzept: »die Abschussmechanik ist wie bei Spinball, das heißt ich ziehe den Würfel wie beim
Pinball den Abschussbolzen«. Also: der Würfel **wandert beim Ziehen tatsächlich zurück** (bis etwa
eine Zellbreite, gegen die Schussrichtung), und beim Loslassen schnellt er vor. Das braucht keinen
Shader, kann nicht schern, hat keine Achsenwahl — und es ist die Geste, die er von Anfang an
beschrieben hat. Dazu **Hitstop** beim Aufprall (1–2 Bilder Stillstand, `kfb-cartoon-animation_v2`
§11.4) statt einer Verformung. Reihenfolge und Umfang gehören Georg.

---

## V4-S23 · DER WÜRFEL IST EIN GUMMIBALL — STUFENLOSE RICHTUNG, KEINE STRECKUNG IM STILLSTAND
**(verworfen in V4-S24 — Georgs Urteil; der Bau steht als Rückweg)**

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (Verformung ganz ins Material, zwei freie
Achsen, Rundung, Hüllkurve, `dev.streckProbe`) ·
**Rückweg:** `setParams({ round: 0 })` gibt die scharfe Kiste zurück, `pull: 0` / `bulge: 0`
schalten Zugstreckung und Wölbung einzeln ab.

**Georgs zwei Befunde, beide zutreffend:**
1. »Beim Richtungswechsel springt der Würfel von der einen Streck-Information zur anderen.«
   **Ursache:** die Verformung suchte sich die **nächste der drei Würfelachsen**. Dreht man den Zug,
   kippt diese Wahl bei 45° um und die Streckung schnappt — vier Richtungen, keine dazwischen.
2. »Kurz bevor er zur Ruhe kommt, wird er trotzdem gestreckt.«
   **Ursache:** die Feder schwingt nach **jedem** Aufprall ins Negative (= Streckung), auch beim
   letzten Mikrostoß, wenn längst nichts mehr fliegt.

**Seine Lösung ist besser als eine Reparatur:** »ob wir den Würfel nicht ein bisschen **ellipsoid**
verformen können — wie einen Gummiball, der in die Länge gezogen wird« — dann ist die Richtung
stufenlos und das Springen hat **keinen Ort mehr**. Genau das ist gebaut:

* **Die Verformung liegt vollständig im Material** (Vertex-Teil), der Knoten trägt nur noch eine
  **gleichmäßige** Skalierung. Damit ist das Schern aus V4-S20 nicht behoben, sondern **unmöglich**.
* **Zwei freie Achsen** beliebiger Richtung (A = Druck, B = Zug). Keine Auswahl unter dreien.
* **Rundung**: der Würfel blendet mit der Stärke der Verformung zum Ball hin — bei Ruhe eine scharfe
  Kiste, unter Last ein Gummi-Ellipsoid.
* **Normalen mitgerechnet** (Kehrwerte der Faktoren, die inverse Transponierte einer
  Achsenskalierung) — ohne das bleibt die Schattierung die eines Würfels und die Rundung sieht wie
  ein Fehler aus.

**ABNAHME 1 · stufenlos** (Druck 0,6, Zug 0,8, Zugwinkel in 15°-Schritten):

| Winkel | 0° | 15° | 30° | 45° | 60° | 75° | 90° |
|---|---|---|---|---|---|---|---|
| Zugachse x | 1,000 | 0,966 | 0,866 | 0,707 | 0,500 | 0,259 | 0,000 |
| Halbachsen | 0,739 / 1,340 / 1,010 | *dieselben* | *dieselben* | *dieselben* | *dieselben* | *dieselben* | *dieselben* |

Die Achse dreht sich **stetig**, die **Form bleibt identisch** — es gibt keine Schwelle, an der
etwas umschlagen könnte. Volumen in allen sieben Winkeln **1,0000**.

**ABNAHME 2 · die vier Ecken der Ladepose** (Halbachsen · Volumen · Rundung · Wölbung):

| Druck | Zug | Halbachsen | Vol | Rundung | Wölbung | Knoten gleichmäßig |
|---|---|---|---|---|---|---|
| 0 | 0 | 1,000 / 1,000 / 1,000 | **1,0000** | 0,000 | 0,000 | ja |
| 1 | 0 | **0,687** / 1,206 / 1,206 | **1,0000** | 0,570 | 0,172 | ja |
| 0 | 1 | 0,891 / **1,260** / 0,891 | **1,0000** | 0,474 | 0,000 | ja |
| 1 | 1 | **0,612** / **1,520** / 1,075 | **1,0000** | 0,620 | 0,172 | ja |

**ABNAHME 3 · die Hüllkurve der Streckung** (Feder auf −0,204 festgehalten, Tempo in Zellen/s):

| Tempo | 0 | 1 | 2 | 4 | 6 | 8,4 | 12 | 20 |
|---|---|---|---|---|---|---|---|---|
| Streckung | **0,0000** | 0,0243 | 0,0486 | 0,0971 | 0,1457 | 0,2040 | 0,2040 | 0,2040 |

Bei Ruhe **null**, linear anwachsend, voll ab einem Drittel des Bezugstempos. **Nur die Streckung**
hängt am Tempo — die **Stauchung** bleibt unangetastet: bei einer Landung geht das Tempo gerade auf
null, und genau dort muss sie am stärksten sein.

**Grenze weiter offen:** der gebackene Ersatzwürfel hat nur acht Eckpunkte — dort ist 1 − a² = 0
und die Richtung zum Mittelpunkt zeigt in die Ecke: auf ihm wirkt weder Wölbung noch Rundung. Am
Ugur-Netz wirkt beides.

---

## V4-S21/22 · ZIELDARSTELLUNG ALS FEHLSCHLAG STILLGELEGT · SCHLEUDER, WÖLBUNG, HÖHENMASSSTAB
**(die Achsenwahl aus S22 ist in V4-S23 durch stufenlose Richtungen ersetzt)**

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (`aimShow: false`, Ladepose auf zwei Achsen,
Vertex-Wölbung, Höhenmaßstab, zwei neue Messgriffe) ·
**Rückweg:** `setParams({ aimShow: true, pull: 0, bulge: 0, hoch: 0 })` — jede der vier Sachen
einzeln abschaltbar.

### V4-S21 · Die Zieldarstellung ist ein Fehlschlag, und sie ist ausgeblendet

**Georg 06.09. nach drei Fassungen** (Punkte → Winkel+Scheibe → Striche+Fadenkreuz): »das Design
funktioniert immer noch nicht — du orientierst die Striche nicht anhand einer Kurve, sondern setzt
sie einfach stufig aneinander; zudem entspricht die tatsächliche Flugbahn nicht der angezeigten
ballistischen Kurve. Ich würde sie als Fail kommentiert ausblenden.«

**Zwei Fehler, beide meine, beide benannt statt weiter beschraubt:**
1. **Die Linie ist keine Kurve.** Jeder Strich ist ein eigenes Sprite mit eigenem Winkel; an jedem
   Strichende bricht die Richtung. Das liest als Treppe. Eine Kurve braucht **ein durchgehendes
   Band** (Streifengeometrie entlang der Bahn, zur Kamera gedreht, Strichelung in der Textur) —
   ein anderer Bau, keine Zahl an diesem.
2. **Die Vorhersage stimmt nicht mit dem Flug.** Sie rechnet den Bogen aus Anfangstempo und
   Schwere, kennt aber Reibung, Dämpfung und den ersten Streifschuss an einer Zellflanke nicht.
   Die Prüfzahl dafür (vorhergesagter gegen **gemessenen** Auftreffpunkt) steht seit S1 offen — sie
   war die ganze Zeit die eigentliche Aufgabe, und ohne sie ist die Anzeige eine Behauptung.

Der Bau bleibt vollständig stehen (`aimShow: true` gibt ihn zurück, `dev.zielProbe` arbeitet
weiter). **Abnahme: Striche 0, Fadenkreuz unsichtbar.**

### V4-S22 · Georgs Fragen 5, 4 und 1 — gebaut

**(5) Der Schleuder-Look.** Vorher zeigte nur die Druckdauer etwas; die **Zugweite, also die halbe
Eingabe, war unsichtbar**. Jetzt zwei Größen auf zwei Achsen einer Pose: Druckdauer → Stauchung auf
der senkrechten Achse, Zugweite → Streckung auf der **Zugachse**, dritte Achse nimmt den Rest.
Das ist kein Widerspruch zu »kein Addieren« aus V4-S19 — dort ging es um zwei konkurrierende
*Ereignisse*, hier um zwei benannte Achsen *einer* Pose.

| Druck | Zug | Faktoren | Volumen | Wölbung |
|---|---|---|---|---|
| 0,0 | 0,0 | 1,000 / 1,000 / 1,000 | **1,0000** | 0,000 |
| 1,0 | 0,0 | 1,206 / 1,206 / **0,687** | **1,0000** | 0,172 |
| 0,0 | 1,0 | **1,260** / 0,794 / 1,000 | **1,0000** | 0,000 |
| 0,6 | 0,6 | 1,156 / 1,065 / 0,812 | **1,0000** | 0,103 |
| 1,0 | 1,0 | **1,260** / 1,155 / **0,687** | **1,0000** | 0,172 |

**⚠ Ein Fehler in der ersten Messung dieser Reihe, gefangen und behoben:** reiner Druck ergab
1,000 / **1,455** / 0,687 — die ganze Breite ging in *eine* Achse, aus dem Würfel wurde eine
**Platte**. Ohne Zugachse gibt es keinen Grund für eine Vorzugsrichtung; jetzt symmetrisch.

**(4) Die Wölbung.** Eine reine Achsenskalierung hält die Flanken **gerade** — ein gedrückter
Gummiwürfel wölbt sie nach außen. Das ist eine Verschiebung der Punkte, keine Skalierung, also
sitzt sie im Vertex-Teil des Materials: quer zur Stauchachse nach außen, am stärksten in der
**Mitte** (1 − a²), null an den beiden Deckflächen — dort liegt der Druck an, dort kann nichts
ausweichen. Dieselbe Form wie ein Radiergummi unter dem Daumen. **Eigener Programm-Schlüssel ist
Pflicht** (Lehre aus `stack.v2.js`), sonst fällt die Wölbung lautlos aus.
*Grenze benannt:* der gebackene Ersatzwürfel hat nur Eckpunkte, und dort ist 1 − a² = 0 — auf ihm
ist die Wölbung unsichtbar. Am Ugur-Netz wirkt sie.

**(1) Der Höhenmaßstab, überzeichnet.** Die Kamera allein gibt bei dieser Brennweite kaum etwas
her: von der Sohle bis zur Decke schrumpft der Bildabstand um wenige Prozent, und im Bild ist nicht
zu sehen, ob er zwei Zellen oder fünf hoch steht. Also überzeichnet, **bis +16 % auf Deckenhöhe**,
Bezug ist die Fläche **unter** ihm (wer auf einem Klotz sitzt, ist nicht »oben«).
Gemessen ×1,0000 / ×1,0800 / ×1,1600 bei 0 / 50 / 100 %.
**⚠ Das bricht die Volumenerhaltung absichtlich** — es ist ein Maßstab, keine Verformung; deshalb
rechnet der Messgriff ihn heraus, bevor er das Volumen prüft.

**⚠ UND DER MESSWEG WAR ZUERST UNBRAUCHBAR** — zwei Fehler in einem:
`tickCharge` rechnet `d.zug` jedes Bild aus der Zeigerlage neu und **überschreibt** jeden von Hand
gesetzten Wert (die erste Reihe zeigte fünfmal dieselbe Zahl), und `F.edge` ändert sich beim
**Rundenwechsel** — die Kantenlänge vor dem Ticken gelesen und die Skalierung danach ergibt einen
Faktor aus zwei verschiedenen Runden (»Höhe 0 % → 1,242«). Jetzt treiben `dev.ladeProbe` und
`dev.hochProbe` den Zeichenweg direkt und lesen alles im **gleichen Aufruf**.

---

## V4-S20 · GESTRICHELTE ZIELLINIE UND FADENKREUZ NACH GEORGS SKIZZE — UND DAS SCHERN IST WEG
**(die Ziellinie ist in V4-S21 als Fehlschlag stillgelegt — nur der Scher-Fix bleibt in Kraft)**

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (Strich- und Fadenkreuz-Textur, Drehung in der
Bildebene, Stauchung in Körperachsen) · **Rückweg:** `setParams({ stretch: 0 })` für die Kinetik;
die Marken-Texturen sind reine Zeichenroutinen.

**Quelle jetzt gelesen:** `skills/kfb-cartoon-animation_v2.md` (Georg hat den Rohpfad geliefert —
mein Tree-Filter hatte die Datei nicht gefunden, meine Behauptung »existiert nicht« war falsch).
Zwei Sätze daraus greifen unmittelbar: **§4.5 Ringverbot** — ein Ring ist für **Zielen**, Laden,
Portal und Zone reserviert und als Aufprall-Effekt verboten; das Fadenkreuz darf also einen Ring
tragen, ein Einschlag nicht. **§12.1 Kein Anspruch ohne Beleg** — Bild vor, Bild nach, gemessene
Dauer.

**Die Ziellinie ist jetzt eine Linie, keine Punktkette.** Ein Strich hat eine Richtung, ein Punkt
nicht — deshalb liest eine Strichkette als Bahn und eine Punktkette als Streuung. Jeder Strich ist
ein Sprite, das **in der Bildebene** entlang der projizierten Bahn gedreht wird (aus den
projizierten Nachbarpunkten, nicht aus der Weltrichtung: bei gekippter Karte sind das zwei
verschiedene Winkel, und sichtbar ist der auf dem Schirm). Eine `Line` in WebGL ist einen Bildpunkt
breit und war nie eine Option.

**Fadenkreuz statt Winkel-und-Scheibe:** Ring mit vier Kreuzarmen, weiß, Mitte offen — Georgs
Skizze. Die vier Ugur-Winkel und die dunkle Trägerscheibe sind weg; sie waren mein Entwurf, und er
hat ihn zweimal abgelehnt. Kreis um den Würfel und Pfeil bleiben weg (seine Vorgabe).

**ABNAHME:** 11 Striche über eine Bahn quer durchs Feld, Ziel `wand`, Marke auf der Bande bei
[4,73 / 2,34 / 1,79] — im Bild eine gestrichelte Kurve vom Würfel bis zum Fadenkreuz an der Wand,
wie im Mockup. Strichgröße **gemessen nachgezogen**: 0,62 × 0,15 Kanten ergab auf dem Schirm rund
22 × 5 Bildpunkte — ein Kratzer, keine Linie; jetzt 0,85 × 0,22 ≈ 30 × 8.

**⚠ DAS SCHERN WAR MEIN FEHLER AUS V4-S18** (Georgs Frage 3). Eine Skalierung entlang einer
**Weltachse** ist affin: bei einem **gedrehten** Würfel werden aus Quadraten Parallelogramme — aus
dem Würfel wird ein Spat, und genau das ist die Trapezform, die er sieht. Für eine weiche Blase
wäre das richtig; ein Hartgummi-Würfel bleibt beim Stauchen ein **Kasten**, nur flacher. Jetzt wird
in den **eigenen Achsen** des Würfels gestaucht, in derjenigen, die der Stoßrichtung am nächsten
liegt. Die drei Knoten aus V4-S18 bleiben (Ort und Drehung getrennt), tragen aber keine Verzerrung
mehr — die Faktoren sitzen auf `mesh.scale`, Volumen weiter exakt 1.

**⚠ HAUSREGEL 8, SECHSTES MAL:** dreimal in dieser Runde habe ich ein **stehendes Bild** gemessen.
`document.hidden` parkt die Bildschleife; wer den Zustand ändert und nicht selbst `tick()` ruft,
sieht den Zustand von vorher — einmal saß das Fadenkreuz im Bild links oben, während seine Zahlen
rechts oben standen. Dazu: der Tiefpass der Marke braucht **Bilder**, nicht Aufrufe — eine einzelne
Probe zeigt die Marke auf 30 % des Weges.

**Georgs fünf Fragen, beantwortet:**

| # | Frage | Antwort |
|---|---|---|
| 1 | Spiegelt die Würfelgröße die Flughöhe überzeichnet? | **Nein.** Nur die normale Kameraperspektive, keine Überzeichnung. Vorschlag: bis +12 % auf Deckenhöhe |
| 2 | Verformt er sich mit Flugrichtung und Aufprall? | **Ja**, seit V4-S19 — gemessen 0° zur Bahn im Flug, Normale beim Aufprall |
| 3 | Ist das schräge Abscheren für Hartgummi korrekt? | **Nein, mein Fehler** — behoben, siehe oben |
| 4 | Sollte Druck von oben rundlich wölben? | **Ja, tut er nicht.** Achsenskalierung gibt gerade Flanken; echte Wölbung braucht Vertex-Verschiebung im Shader — eigene Scheibe |
| 5 | Sollte die Zugweite als Verformung sichtbar sein? | **Ja, tut sie nicht.** Nur die Druckdauer verformt. Nach dem Umbau auf Körperachsen ist der Schleuder-Look (senkrecht gestaucht **und** entlang der Zugachse gestreckt) sauber möglich |

**Offen:** 1 · 4 · 5 aus der Tabelle · Boxel-Deformer · Palette aus Kartensaat · S2 Antippen kippt ·
S5 Energieschild · der Keil-Hüpfer aus V4-S16 ist weiter unbelegt.

---

## V4-S19 · DIE VERFORMUNG FOLGT DER KINETIK — UND DIE ZIELMARKE HAT 64 BILDPUNKTE

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (zweiter Verformungskanal, Markentextur und
-größe) · **Rückweg:** `setParams({ stretch: 0 })` schaltet den kinetischen Kanal ab.

**Georgs Verweis:** `skills/cartoon-motion_v1.md` im Repo (gelesen). Ihr Kernsatz beschreibt genau
den Defekt: *lebende Dinge bewegen sich nicht mit gleichbleibender Geschwindigkeit — sie verformen
sich fortwährend.* Dazu Grundsatz 1 (Streckung entlang der Bewegung, Volumen erhalten,
`Sx = Sz = 1/√Sy`) und Grundsatz 7 (Bahnen sind Bögen).

**Der Defekt, benannt:** es gab nur **einen** Kanal. Ein Ereignis setzte eine Stauchung, die Feder
zog sie in etwa 0,2 s auf null — danach flog der Würfel den **Rest des Bogens unverformt**. Und die
Streckung nach dem Abschuss lag auf der **Senkrechten**, während er seitwärts flog. Die Verformung
hatte mit dem, was der Würfel gerade tut, nichts zu tun; »willkürlich« war das richtige Wort.

**Jetzt zwei Kanäle, der größere gewinnt:**

| Kanal | Achse | Stärke |
|---|---|---|
| **Ereignis** (Feder, aus `deform()`) | die **Normale** der Fläche, die ihn stoppt | aus der Wucht |
| **Fortwährend** (jedes Bild, nur im Flug) | der **Geschwindigkeitsvektor** | aus dem Tempo, Bezug = Tempo des stärksten Wurfs (24 Zellen/s, abgeleitet) |

**Kein Addieren:** zwei Verformungen auf zwei Achsen gleichzeitig ergeben eine Nudel, keine Aussage.
Am Boden ist der fortwährende Kanal null — ein rollender Würfel soll nicht wabbeln.

**ABNAHME · Winkel zwischen Stauchachse und Geschwindigkeit im Flug:**

| t | Tempo | Stauchung | Winkel | Kanal |
|---|---|---|---|---|
| 0,00 | 16,1 | 0,119 | **0°** | Flug |
| 0,09 | 14,7 | 0,114 | **0°** | Flug |
| 0,17 | 13,5 | 0,105 | **0°** | Flug |
| 0,26 | 12,6 | 0,094 | **0°** | Flug |
| 0,35 | 4,3 | 0,287 | 42,5° | Aufprall |
| 0,44…0,79 | 5,9…6,0 | 0,25…0,34 | 57…88° | Aufprall |

Solange er fliegt: **0,0°** — die Streckung liegt exakt auf der Bahn. Ab dem Aufprall (Tempo bricht
von 12,6 auf 4,3 ein) übernimmt der Ereigniskanal, und **dass der Winkel dort groß ist, ist das
gewünschte Verhalten**: gestaucht wird gegen die Fläche, nicht entlang der Bahn.
**⚠ Meine Abnahmezeile stand zuerst falsch da** (»Soll 0°« für alle Zeilen) — eine Zahl, die für die
Hälfte der Fälle das Gegenteil des Richtigen verlangt, ist kein Kriterium. Sie gilt nur für den
Flugkanal.

**ZIELMARKE, jetzt mit gemessener Lesbarkeit.** Georg zweimal »kaum zu sehen«, und beim zweiten Mal
»Änderungen sind mir nicht aufgefallen« — also war die Ursache nicht die Farbe. Gemessen: die Marke
war 0,6 Welteinheiten groß, ihre tragenden Formen (Winkel + Kreuz) belegten davon etwa ein Drittel
— **auf dem Schirm rund 13 Bildpunkte**. Jetzt: **dunkle Trägerscheibe** (weich auslaufend, damit
Weiß auf hellen Boxeln überhaupt eine Chance hat), kräftigere Winkel, längeres und dickeres Kreuz,
Marke 2,1 statt 1,15 Kanten. **Gemessen auf dem Schirm: 64 × 67 Bildpunkte, sichtbar.**
*Lehre: »kaum zu sehen« ist eine Größenangabe. Sie gehört in Bildpunkten gemessen, nicht in
Deckkraft geraten.*

**Offen:** Boxel-Deformer (Instanz-Wolke, eigene Scheibe) · Palette aus Kartensaat
(`uploads/KFB_ColorPalettes_CardSeed_v1.md`) · S2 Antippen kippt · S5 Energieschild ·
der Keil-Hüpfer aus V4-S16 ist weiter **unbelegt**.

---

## V4-S18 · DER DEFORMER IST EIN KIND — UND DER DRUCK KOMMT VON OBEN

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (drei Knoten je Würfel, `deform` mit Normale,
Feder ins Negative, Zielmarke mit Kreuz und Sprung an der Flächengrenze) ·
**Rückweg:** `setParams({ deform: 0 })`.

**Der Fehler stand als Eingeständnis im eigenen Kommentar dieser Datei:** die Stauchung lag auf
**demselben Knoten wie die Körperdrehung**, also in den **lokalen** Achsen des Würfels — ein
gedrehter Würfel wurde in einer beliebigen Richtung platt. Das ist Georgs »die Deformierungen sind
noch nicht korrekt«. Dazu: die Ladung stauchte in der **Bahnrichtung**, also waagerecht — das
Rückmeldesignal für »ich drücke« lag auf der Achse, die man am schlechtesten sieht.

**Jetzt drei Knoten je Würfel:** `sqOuter` (Ort + Stauchung, gedreht so, dass seine z-Achse auf die
Stauchrichtung zeigt) → `sqInner` (dieselbe Drehung rückwärts, damit die Stauchung in **Weltachsen**
wirkt) → `mesh` (Drehlage des Körpers, Kantenlänge). Damit kann der Deformer die Lage **nicht mehr
anfassen**: er sitzt in einem eigenen Knoten, der Körper schreibt nur `mesh.quaternion`.

**Die Richtung ist jetzt ein Weltvektor statt eines Winkels in der Ebene** — vorher war »Druck von
oben« gar nicht ausdrückbar. Druck → senkrecht. Landung → senkrecht (die Fläche drückt von unten).
Bumper-Kick → senkrecht. Seitentreffer und Bande → Flugrichtung.

**Volumenerhaltung ist jetzt exakt** statt geraten: `(1−s)·quer² = 1`. Die alten Faktoren 0,55 und
0,35 waren zwei freie Zahlen ohne Herleitung.

**Und die zweite Hälfte des Cartoons war abgeschnitten:** die Feder war bei null hart geklemmt, also
gab es kein **Überschwingen**. Jetzt darf die Stauchung ins Negative — dort ist der Würfel
**gestreckt** —, begrenzt auf 60 % der Stauchung. Der Abschuss setzt bewusst eine negative
Stauchung: das Rückschnappen eines Gummiwürfels beim Loslassen, auf derselben Achse wie das
Aufladen (sonst springt die Verformung im Augenblick des Schusses).

**ABNAHME:**

| Druck | Stauchung | Knoten x/y/z | Volumen |
|---|---|---|---|
| 0,00 | −0,001 | 1,000 / 1,000 / 1,001 | **1,0000** |
| 0,25 | 0,077 | 1,041 / 1,041 / 0,923 | **1,0000** |
| 0,50 | 0,156 | 1,088 / 1,088 / 0,844 | **1,0000** |
| 0,75 | 0,234 | 1,142 / 1,142 / 0,766 | **1,0000** |
| 1,00 | 0,312 | 1,206 / 1,206 / **0,688** | **1,0000** |

Streckung nach dem Loslassen: 0,911 / 0,911 / **1,204** (höher und schmaler, Volumen 1).
**Drift der Körperlage während der Verformung: 0,000000** — das Kriterium, das einen Deformer
entlarvt, der am Körper zieht.

**ZIELDESIGN, dritte Fassung:** ein **Zielkreuz** in der Mitte der vier Winkel (Georgs Wort) — vier
Winkel markieren eine *Fläche*, aber keinen *Punkt*, und der Punkt ist die Aussage; das Kreuz ist in
der Mitte offen, damit es die Landestelle nicht zudeckt. Punkte **weniger und größer** (Abstand 0,46
statt 0,30 Zellen, erster Punkt 0,34 Kanten, Verjüngung auf ein Drittel) — zwei Zwischenstände sind
gemessen verworfen: 0,42 gleichmäßig (Georg: zu groß) und 0,17 (im Bild ein Staubkorn, 7 px).
**Und die Ursache des starken Springens ist gefunden:** beim Aufladen wandert das Ziel von der
Bodenlandung zur Flanke zur Bande zur Decke, und der Tiefpass zog die Marke über diese Grenze quer
durch das Bild und drehte sie dabei. Jetzt wird **innerhalb** einer Flächenart geglättet und **an
der Grenze gesprungen**.

**Offen:** der Deformer für die **Boxel** (Georg: »und auch Boxel«) — eine getroffene Zelle soll
stauchen, bevor sie sich auflöst. Das ist `boxel.v1.js` und eine eigene Scheibe, weil die Zellen
eine Instanz-Wolke sind (Skalierung je Instanz statt je Netz). Dazu die Palette aus Kartensaat
(`uploads/KFB_ColorPalettes_CardSeed_v1.md`, von Georg als »für später« übergeben) und S2 (Antippen
kippt) und S5 (Energieschild).

---

## V4-S16/17 · DER VERKEILTE WÜRFEL (zwei Fassungen, eine offen) + KARTENRÜCKSEITE ALS WARTEZUSTAND

**Datum:** 06.09.2026 · **Geändert:** `cube.v3.js` (`kippAnstoss` 2×, Budget je Lage),
`cardbuilder/kfb-card-builder.js` (`backUrl`, additiv), Wirt (eine Zeile).

**Georgs Fall vom 07:14, in seinem Fenster ausgelesen:** `schiefe 39,58°` · `schlaeft` ·
`sohle 0,311` · `kontakte 0` · **`kippHilfe 12`** · `schiefGeschlafen 1`. Nachbarschaft: eine
**eine Zelle breite Rinne** (zwei tote Zellen, alle übrigen 0,78 hoch).

**Die Rechnung sagt, warum er steckt:** ein Kasten der Kante 0,66, um 39,6° gekippt, spannt quer
**0,66·(cos39,6+sin39,6) = 0,932** — die Rinne ist **1,00** breit. Er ist diagonal verkeilt wie ein
Buch im Schlitz, mit 0,068 Spiel. **Mein Anstoß aus V4-S13 hat das schlimmer gemacht:** die Drehung
»Richtung flach« vergrößert im Schlitz die Querspanne, und gemessen ging er von 39,6° auf **42,7°**,
Sohle 0,31 → 0,34, nach **sechs** Anstößen. *Eine Lagekorrektur war damit zweimal die falsche
Antwort.*

**Zweite Fassung:** kein Drehimpuls mehr, sondern ein **Hüpfer aus dem Schlitz** — Höhe aus der
gemessenen Wandhöhe um ihn herum (`vz = √(2·g·Δh)`), Drift in die Richtung mit der **niedrigsten**
Wand, Drehung ausdrücklich auf null. Danach entscheidet die Physik allein, wie er landet.

**Und ein eigener Fehler derselben Klasse:** das Anstoß-Budget hing an `kippHilfe` — einem
**Lebenslauf-Zähler**. Nach zwölf Anstößen *über alle Würfe zusammen* war das Tor für immer zu;
gemessen bekamen in einer Reihe von 16 Abwürfen die Fälle 9 und 10 **null** Anstöße und blieben bei
42,2° und 40,5° liegen. **Ein Tor, das sich nach dem zwölften Mal für immer schließt, ist wieder ein
Tor, das aufgibt — nur eine Ebene höher** (siebter Fall der Klasse). Jetzt `kippVersuch`, genullt bei
jeder neuen Lage.

**⚠ NICHT ABGENOMMEN.** Die gebaute Rinne hat im Lauf mit der zweiten Fassung **16/16 flach**
gemeldet — aber mit **null Anstößen**, also ohne dass ein einziger Würfel sich verkeilt hätte: eine
**taube Prüfung** (die Reihe lief zu früh, während der Anfahrt der Kamera, auf anderer Geometrie).
Der Lauf davor hatte 4 von 16 verkeilt. **Der Hüpfer ist damit gebaut und begründet, aber nicht
belegt.** Nächster Schritt, benannt: die Reihe erst nach dem Einlaufen fahren und im Fehlfall die
ersten 20 Schritte NACH dem Anstoß mitschreiben (bewegt sich der Körper überhaupt?).

**KARTENRÜCKSEITE ALS WARTEZUSTAND** (Georg: »bis die Karte(n) geladen sind, sollten wir die KFB
card backside zeigen, keine Text/Platzhalter«): der Kartenbauer nimmt jetzt `backUrl` und stanzt die
Repo-Rückseite in **dieselbe Kontur** wie das Papier, statt das Textblatt zu zeigen. **Additiv** —
ohne den Parameter bleibt alles wie bisher, damit Podcast und SpinballCast sich nicht ändern. Die
erste Karte entsteht vor dem Bild, darum ein Nachtrag: wer wartet, wird beim Laden nachgetragen, und
nur solange das Artwork noch nicht da ist. Bild gemessen erreichbar (**800 × 447 geladen**).
**⚠ Auf dem Schirm noch nicht gesehen** — im letzten Bild stand das Textblatt. Unverifiziert.

---

## V4-S15 · DIE ZIELMARKE SAGT JETZT, *WAS* IHN STOPPT

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (Punkt- und Marken-Textur, `vorhersage` mit
Normale und Flanken-Klasse, `drawAim` mit Ausrichtung und Tiefpass).

**Georgs Kritik (06.09.) und was daraus wurde:**

| Sein Satz | Befund / Änderung |
|---|---|
| »die Kurve wird von benachbarten Boxeln begrenzt, Überspringen fehlt« | Der **Anschlag war richtig**, die Marke hat ihn als *Landung* ausgegeben. Jetzt eigene Klasse **`flanke`**: wenn die höchste Fläche unter dem Fußabdruck nicht die unter der Mitte ist, schlägt der Kasten mit der **Seite** an eine Nachbarsäule — die Marke steht dann **senkrecht an dieser Säule**. Gemessen: in 24 Zielproben **4 Boden · 4 Flanke · 16 Bande** (die Klasse ist also nicht tot) |
| »an der unsichtbaren Wand auf die Wand projiziert, mit der Perspektive« | Die Marke trägt jetzt die **Normale** der getroffenen Fläche und dreht sich darauf: liegend auf Boden und Decke, **senkrecht** an Bande und Flanke. Gemessen: `wand n[−1,0,0]` · `wand n[0,−1,0]` · `decke n[0,0,−1]` · `boden n[0,0,1]` |
| »durchgängig gezeichnet, nehmen wir doch nur die Ecken« | **Vier Winkel** mit Ugur-Radius statt eines geschlossenen Rechtecks. Ein durchgezogenes Rechteck liest auf einem Klotzfeld wie eine Feldkante |
| »noch nicht weiß, schlecht lesbar, Schatten nur rechts und unten« | Vorher lag ein dunkler Ring **rundherum** — der frisst den Kern und macht aus Weiß Grau. Jetzt **reines Weiß** und der dunkle Ton **nur als Versatz nach unten rechts**, nach dem globalen Lichtkonzept |
| »etwas zu groß« | 0,42 → **0,28** Kanten, mit Verjüngung nach hinten (nächster Punkt am größten). **⚠ Zwischenschritt 0,17 war im Bild ein Staubkorn (≈ 7 Bildpunkte) — nachgemessen und zurückgenommen:** »kleiner« war die Richtung, nicht der Faktor |
| »das ruckelt noch ein bisschen« | **Tiefpass** auf Ort *und* Normale der Marke (Faktor 0,3), beim Anfassen gesetzt statt gezogen. Die Bahn ändert sich beim Laden jedes Bild; ein Ziel, das jedes Bild springt, flackert |

**Offen und als Nächstes:** der **Cartoon-Deformer** — Georgs Hauptpunkt (»kein klares Feedback über
den Druck«) und ausdrücklich als eigene Runde gewünscht, für **Würfel und Boxel**. Er muss als
**Kind** unter dem Körper hängen (Skalierung in Weltachsen), damit er die Lage nicht anfassen kann;
Werte aus der SSOT §9.2. Danach S2 (Antippen kippt) und S5 (Energieschild an Wand und Decke).

---

## V4-S14 · DREI GRÖSSEN, DREI REGLER — DER WURF NACH GEORGS MODELL

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (`wurfVektor`, `abbrechen`, drei Parameter),
Wirt (ESC weitergeben) · **Rückweg:** `launchPower` bleibt Georgs Gesamtregler; die alte Fassung
war ein fester Abwurfwinkel von 25° mit allem an der Ladung.

**Georgs Vorgabe wörtlich (06.09.):** »druck(dauer) bestimmt sprung-höhe · zugweite bestimmt
geschwindigkeit · winkel bestimmt schussrichtung · man kann auf entfernte boxel zielen, ggf. dann
auch boxel gezielt überspringen oder an die unsichtbare wand/decke zielen, um über band zu spielen
· die dot-line sollte bogig die entsprechende ballistische 3D-kurve anzeigen · [ESC] bricht ab«.

**Was vorher war:** alles hing an der Ladung, und der Abwurfwinkel war eine **feste Zahl (25°)**.
Damit gab es genau **eine** Bahnform, nur verschieden lang — kein Steilschuss, kein Pflug, kein
Überspringen, kein Deckenspiel. Jetzt ist der Winkel das **Ergebnis** aus Höhe und Tempo.

**Beide Zahlen abgeleitet, keine gewählt:**
* **Sprunghöhe aus der Druckdauer:** `h = hMin … Deckenhöhe`, daraus `vZ = √(2·g·h)`. Die
  Obergrenze **ist** die Decke (Eigentümer: das Feld) — volle Druckdauer stößt genau an sie.
* **Tempo aus der Zugweite:** der Bremsweg eines rutschenden Kastens ist `v²/(2·μ·g)`, also trägt
  `v = √(2·μ·g·Strecke)` genau `Strecke` weit. **Voller Zug = einmal über das ganze Feld, halber
  Zug = halbes Feld.** μ kommt vom Eigentümer der Oberflächen (Papier 0,72), die Feldbreite vom Feld.

**ABNAHME · die Matrix (Vorhersage, Zellbreiten):**

| Druck | vZ | Gipfel | Zug 0 (nur Druck) | Zug ½ | Zug voll |
|---|---|---|---|---|---|
| 0,15 | 5,6 | **0,65** | vH 2,3 → 1,07 Boden | vH 14,9 → 6,04 Bande | vH 21,0 → 6,05 Bande |
| 0,50 | 8,5 | **1,51** | vH 2,3 → 1,62 Boden | vH 14,9 → 6,04 Bande | vH 21,0 → 6,05 Bande |
| 1,00 | 11,5 | **2,74** | vH 2,3 → 0,87 **Decke** | vH 14,9 → 5,68 **Decke** | vH 21,0 → 6,05 Bande |

Der **Gipfel** steigt allein mit dem Druck (0,65 · 1,51 · 2,74), das **Tempo** allein mit dem Zug
(2,3 · 14,9 · 21,0) — genau die Unabhängigkeit, die Georgs Modell verlangt. Bei 0,15 Druck bleibt
der Gipfel **unter** der Zellhöhe 0,78 (ein Pflug), bei 0,50 darüber (**Boxel überspringen**), bei
vollem Druck steht er auf **2,74 = der Deckenhöhe** (**Bandenspiel über die Decke**). Punktzahl der
Bogenlinie 4…18, die Kurve ist also gezeichnet und nicht behauptet.

**⚠ Eine abgeleitete Zahl war zuerst falsch abgeleitet.** `reichMin` (kürzester Wurf) stand auf
1,4 Zellen → vH 7,0, und damit endete **jeder** reine Druckschuss gemessen nach **0,22 Zellen** an
der Flanke des Nachbarklotzes: ein Sprung, der nie über etwas hinwegkam. Nachgerechnet: bei vollem
Druck braucht der Würfel 0,075 s bis zur Höhe einer Zelle; in dieser Zeit darf er höchstens 0,17
Zellen weit kommen, also **vH ≤ 2,3 = √(2·μ·g·0,15)**. Mit `reichMin = 0,15` trägt der reine
Druckschuss jetzt 0,87…1,62 Zellen — ein echter Sprung auf der Stelle. *Eine Ableitung ist nur so
gut wie die Randbedingung, gegen die man sie prüft.*

**ESC bricht ab:** `cancelAim()` im Modul, die Taste kommt am **Fenster** an (die Leinwand hat
keinen Fokus) und wird vom Wirt weitergegeben — das Modul kennt keine Tastatur von sich aus.
Ladung und Zug fallen auf null, der Würfel bleibt liegen, die Zieldarstellung verschwindet.

**Offen:** die zwei Ausreißer der Zieldarstellung aus V4-S12 (Vorhersage stoppt an einem Plateau,
das die Physik überspringt) — mit den neuen Steilschüssen ist der Fall häufiger und lohnt jetzt die
Klärung. Danach S2 (Antippen kippt), S3 (Deformer als Kind), S5 (Energieschild).

---

## V4-S13 · DER WÜRFEL SCHLIEF SCHIEF, WEIL DAS TOR AUFGEGEBEN HAT

**Datum:** 06.09.2026 · **Geändert:** `cube.v3.js` (Schlaf-Regel + `kippAnstoss`) ·
**Rückweg:** `setParams({ kippStaerke: 0 })` — dann bleibt es beim alten Aufgeben.

**Georgs Bild vom 06:37, in seinem laufenden Fenster ausgelesen** (kein Deuten, ein Auslesen):
`schiefe 42,64°` · `schlaeft true` · `sohle 0,304` · `kanteWartet 12` · `keilRuhe 1` ·
`settled true`. Nachbarschaft: die Zelle unter ihm **tot** (0), die Nachbarn bei **0,78**. Er
balanciert auf der **Kante einer Säule**, seine tiefste Ecke hängt über der leeren Rinne — und das
Spiel hat diese Lage als Wurfergebnis **angenommen**.

**Die Ursache stand als Kommentar in meiner eigenen Datei.** Die Schlaf-Regel des Vorbilds hatte
richtig erkannt, dass Aufwecken nichts ändert (Tempo und Drehmoment sind null, die Lage ist eine
echte Ruhelage des Lösers) — und daraus den falschen Schluss gezogen: **nach zwölf Versuchen
aufhören.** `kanteWartet 12` ist genau diese Kapitulation, sichtbar als Zahl.
**Ein Tor, das aufgibt, ist so schlimm wie eines, das nicht aufgehen kann — nur leiser.**
(Die Klasse »Tor« steht damit bei sechs Fällen in diesem Projekt.)

**Was sich ändern muss, damit sich etwas ändert: ein Anstoß.** Keine Lagekorrektur, kein Einrasten,
kein Setzen der Drehung — ein **Drehimpuls**, den die Physik dann selbst auflöst: er kippt, fällt,
prallt, rollt aus. Die Achse ist die, um die er ohnehin fällt (die steilste Körperachse zur
Senkrechten). Die Stärke ist **abgeleitet**: um einen Kasten aus der flachen Lage über seine Kante
zu heben, braucht es ½·I·ω² = m·g·Δh mit I = m·s²/6 und Δh = (√2−1)·s/2 ⇒ **ω = √(2,48·g/s)**; aus
einer schiefen Lage ist der Restweg kleiner, darum **0,42** davon — ein Anstoß, kein Salto.
Und es passt zur Prime Directive: der Würfel ist ein **Schauspieler, der sich aufrichtet**, nicht
ein Stein, der schief bleibt.

**ABNAHME · 40 Würfe von wechselnden Startplätzen:**
**flach am Ende (< 6°): 40/40** · **Anstoß war nötig: 2/40** (zwei bzw. ein Anstoß) · danach noch
schief: **0** · schief geschlafen: **0**.
Die Zahl »2 von 40« ist die wichtige: **der Defekt ist in der Messung aufgetreten** und wurde
aufgelöst. Ein erster Lauf über zehn Würfe war 10/10 grün **mit null Anstößen** — grün, weil der
Defekt gar nicht vorkam. Das ist kein Nachweis, sondern eine taube Prüfung; erst der Lauf mit
wechselnden Startplätzen hat ihn erzeugt.

**⚠ UND EIN ZWEITER VERDACHT, DEN ICH SELBST WIDERLEGT HABE:** ich hatte im gleichen Zug gemessen,
das Würfelnetz trage nach der Begradigung von V4-S11 noch **17° Restschiefe** (Hüllkiste
0,516 × 0,644 × 0,645, Verhältnis 1,25) — und wollte die Begradigung nachschärfen. Falsch: meine
Sonde hat `d.mesh.quaternion` auf Null gesetzt, um »die Körperdrehung zu neutralisieren«, und damit
**die Begradigung selbst gelöscht**, die genau dort sitzt. Ohne Eingriff gemessen sind beide
Netzteile nahezu würfelig (**1,062** und **1,036**) und ihre lokalen Drehungen die Einheit. **Das
Netz ist in Ordnung; die 42,6° gehörten allein dem Körper.** Vierzehnter Fall der Klasse
»die Abnahmezahl misst etwas anderes als ihr Satz behauptet« — diesmal, weil die Messung den
Gegenstand verändert hat, den sie messen sollte.

---

## V4-S12 · DIE ZIELDARSTELLUNG STEHT — UND DER WÜRFEL IST EIN KASTEN, KEIN PUNKT

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` (`vorhersage` mit Fußabdruck, `geometry()` gibt
die Feldgrenzen heraus) · **Rückweg:** in `vorhersage` die vier Ecksonden weglassen (Punktbahn).

**Gebaut (Georgs Vorgabe wörtlich):** dünne weiße Punktlinie, dynamisch aus **derselben** Formel
wie der Abschuss (`wurfVektor`) · **Landequadrat mit Ugur-Ecken** (Radius 14 %, wie die Boxel) ·
dunkler Saum unter Punkt und Quadrat für die Lesbarkeit auf Papier und auf bunten Boxeln. Die Bahn
endet am **ersten** Kontakt (Blatt, Boxeldeckel, Bande, Decke) — keine Vollbahn, weil die Physik
nach dem ersten Abprall eine andere nimmt (SSOT §4.3: »predicted first impact point«).
Gemessen im Bild: **16 Punkte, Quadrat sichtbar**, Zeichnung im Bildlauf (`drawAim` Z. 1309).

**⚠ Der Befund, der die Genauigkeit gemacht hat: die erste Fassung verfolgte die Bahn der MITTE**
und fragte die Oberfläche an genau einem Punkt. Abnahme (fünf Würfe, Feld stillgelegt): drei
innerhalb einer halben Zelle, **zwei um 3,6 und 5,8 Zellen daneben** — und immer dann, wenn eine
höhere Säule innerhalb einer halben Würfelkante neben der Bahn stand: die Mitte fliegt darüber
hinweg, die **Flanke** des Kastens schlägt ein (gemessen `art:'seite'`, Bruchteile nach dem
Abschuss). Jetzt fragt die Vorhersage den ganzen **Fußabdruck** ab (Mitte plus vier Ecken, höchste
Fläche gewinnt), und die Bande rückt um dieselbe halbe Kante nach innen. Derselbe Griff wie in
`podcast-v2/flipper.v2.js`: *ein Körper trifft mit seinem Rand, nicht mit seinem Mittelpunkt.*

**ABNAHME nach der Korrektur** (acht Würfe, Ladung 0,25…1,0, Feld stillgelegt):
**6 von 8 innerhalb 0,5 Zellen** — 0,070 · 0,106 · 0,133 · 0,236 · 0,264 · 0,275 (Mittel der
sechs: **0,181**, also ein Fünftel Zelle). Zwei Ausreißer: **4,278** und **2,743**.

**Der Ausreißer ist verstanden, aber NICHT behoben — und das ist ein offener Punkt, keine
Rundungssache.** In beiden Fällen sagt die Vorhersage eine Landung auf einem **Plateau** voraus
(`art:'boden'`, 1 bzw. 4 Punkte — die kurze Bahn ist das Erkennungszeichen), die Physik prallt dort
ab und **rutscht weiter bis zur Bande**. Die Spur des Fehlfalls (Ladung 0,65) zeigt es Zeile für
Zeile: bis t = 0,10 s liegen Vorhersage und Messung **auf demselben Wert** (Sohle 1,27/1,27),
danach steigt der wirkliche Würfel höher (1,89 gegen 1,54) und bleibt oben, während die Parabel
fällt; waagerecht bleibt er zurück (2,35 gegen 3,63 bei t = 0,45), weil jeder Streifschuss Tempo
kostet. **Was ich NICHT erklären kann:** warum die Messung an der vorhergesagten Plateau-Landung
**keinen** Kontakt meldet (`art:'wand'` erst 2,7 Zellen später). Nächster Schritt, benannt: die
Kontaktliste des Körpers um den vorhergesagten Landezeitpunkt mitschreiben, statt weiter zu deuten.

**⚠ UND WIEDER EINE EIGENE ABNAHMEZAHL, DIE SICH SELBST KAPUTT GEMACHT HAT** (der Klasse jetzt bei
dreizehn): meine erste Messreihe erfand `F.left/right/bot/top` — `geometry()` gab die Grenzen nie
heraus. Der Würfel wurde damit auf **NaN** gesetzt, fiel durch das Blatt (Spur `z: 0,34 → −10,81`),
die Zieldarstellung war leer (`punkte: 0`, `ziel.x: null`) — und das Protokoll meldete brav
»Ist null« statt »deine Messung ist kaputt«. Behoben an der **Wurzel**: `geometry()` gibt die
Grenzen und die Feldmitte jetzt heraus. *Wer eine Zahl nicht besitzt, bittet den Eigentümer — dann
muss der sie auch herausgeben.*

**Offen für Georg:** Punkt 5 seines Konzepts (Zugweite als Modifikator) — fünf Vorschläge liegen in
der Nachricht vom 06.09., **nicht verdrahtet**. Danach S2 (Antippen kippt), S3 (Deformer als Kind),
S5 (Energieschild an Wand und Decke).

---

## V4-S11 · DER WÜRFEL STAND IN SEINER DATEI SCHIEF — SEIT DEM ERSTEN TAG

**Datum:** 06.09.2026 · **Geändert:** `dice.v4.js` `loadModel` (Begradigung + genaue Hülle) ·
**Rückweg:** die Zeile `begradige(m)` löschen.

**Georgs Wurf 04:25, in DEMSELBEN Augenblick ausgelesen** (er hat das Fenster stehen lassen):
Körper **Schiefe 0°, schläft, Sohle auf dem Blatt** — in einer Lücke aus zwei aufgelösten Zellen,
kein Nachbar berührt ihn (`kontakte []`). Sein Bild: ~35° gekippt. **Physik flach, Bild schief,
gleicher Moment** — damit war es das Netz, nicht die Bewegung.

**Der Nachweis, der nicht auf flache Flächen angewiesen ist:** ein Würfel hat die kleinste
achsparallele Hüllkiste genau dann, wenn er aufrecht steht; jede Kippung vergrößert sie. Die Suche
über alle Drehungen (grob 6°, fein 1°) findet für das Ugur-Netz eine Drehung von **93,4°**, die das
Hüllvolumen **von 17,49 auf 8,10 halbiert**. Ein aufrechter Würfel kann seine Hülle nicht halbieren.
**Das Modell war in der GLB-Datei um rund 90° plus Kippung gedreht gespeichert** — eine
Schauhaltung. Jede Drehung des Körpers addierte sich darauf: die Physik war richtig und das Bild
falsch, durch v1, v2, v3, v4 und jede Reparatur hindurch.

**Ein zweiter Fehler steckte im selben Absatz:** `Box3.setFromObject(node)` nimmt ohne `precise`
die Hüllkiste der GEOMETRIE und dreht deren acht Ecken mit — für ein gekipptes Netz ergab das eine
»Kante« von 2,70 (und nach der Begradigung 3,98). Der Würfel wurde also auf **rund die Hälfte** des
Körpers skaliert. Das ist der »geschrumpfte Würfel« aus dem Post Mortem §2. Jetzt `precise: true`:
Kante **2,012 → 1,000**, Netzhülle 0,538 bei Sollkante 0,517 (die Augen stehen 4 % über).

**Warum die erste Begradigung (V4-S10b) scheiterte und diese nicht:** die erste suchte die
stärksten *Normalenrichtungen* — ein Kissen hat kaum flache Flächen, also griff sie ein
Rundungsband und drehte auf die Ecke. Diese sucht das *kleinste Volumen* und ist gegen Rundungen
und Augen unempfindlich. **Die Diagnose war beide Male richtig, die erste Methode nicht** — und
beide Male hat die Zahl es sofort gezeigt (3,97 bzw. 8,10).

**Georgs Red-Team-Frage »Kugel statt Würfel?«** — beantwortet in der Nachricht: nein, denn das
Problem war nie der Körper, sondern das Netz; und gezeichneter Würfel auf gerechneter Kugel ist
genau die Lüge der v1.

---

## V4-S10b · DIE FLANKE IST GLATT (Georgs Weg b) — UND EIN EIGENER IRRWEG, IN VIER MINUTEN ZURÜCKGENOMMEN

**Datum:** 06.09.2026 · **Geändert:** `surfaces.v1.js` (Flankenreibung 0,15), `dice.v4.js`
(Aufräumregel greift nach drei Bildern; Modell-Messung im Ladeprotokoll) · **Rückweg:**
`FRICTION_FLANKE_GLATT` auf 0,72.

**Georgs Bild 04:03, in seinem Fenster ausgelesen:** Körper **flach (0°), schläft** — aber
`kanteWartet 5`, `entkeilt 2`: er hatte sich fünfmal schief hingelegt und zweimal einen Klotz
gebraucht, bis er lag. Jede Runde kostete 0,25 s Wartezeit plus Einschlafen. Die Regel fragt jetzt
»liegt schief und ist praktisch still« und greift nach 0,06 s.

**Die Entscheidung, die Georg getroffen hat:** ein Würfel (0,68) an einem höheren Klotz (0,78) ist
eine **echte Ruhelage** — die Physik hat recht, das Bild ist trotzdem falsch. (a) Lehnen löst den
Klotz · **(b) die Flanke ist glatt, er rutscht ab** · (c) Boxel niedriger. **Georg: (b).** Kriterium:
er rutscht, wenn die Flankenreibung unter dem Tangens des Lehnwinkels liegt (30° → 0,58, 20° →
0,36); gesetzt **0,15**, in beiden Reibungsmodi. Die Deckfläche bleibt griffig (0,72).

**⚠ MEIN IRRWEG, damit ihn niemand wiederholt:** Georgs Bild 04:15 zeigte den Würfel gekippt auf
einem *flachen* Deckel, und meine Messung von 04:05 sagte »Körper flach«. Daraus schloss ich: die
Schiefe steckt **im Ugur-Modell** — und die Normalen schienen es zu bestätigen (nur 32 von 2907
achsparallel). Ich habe eine Begradigung gebaut. **Ergebnis: 176° Drehung, Hüllkiste 3,97 statt
2,70 — das Netz stand danach wirklich auf der Ecke.** Zwei Fehler in einem: (1) Bild und Messung
stammten aus **verschiedenen Augenblicken** — zwischen 04:03 und 04:05 hatte die Aufräumregel den
Klotz schon gelöst (Hausregel 12: ein Ausdruck ohne Reifezeugnis). (2) Das Ugur-Netz ist ein stark
**gerundetes Kissen** mit Augen; ein Kissen hat kaum flache Flächen, also kaum achsparallele
Normalen — auch aufrecht. Die Zahl bewies Form, nicht Lage. **Und auf dem Bild 04:15 lehnt er doch:
der rote Nachbar rechts ist eine Stufe höher und berührt ihn.** Die Drehung ist zurückgenommen, die
Messung bleibt als Zahl im Ladeprotokoll stehen.

**Georgs Hinweis, festgehalten:** Kenney-Jingles für die Audio-Scheibe liegen im Repo unter
`media/3D_Assets/Audio/kenney_music-jingles/Audio`.

---

## V4-S10 · DAS ABSCHUSSKONZEPT, VOLLSTÄNDIG — UND DER WURF IST EIN WURF

**Datum:** 06.09.2026 · **Geändert:** `boxelblitz-v4/dice.v4.js` (Eingabe + Abschuss), zwei Regler
im Wirt · **Rückweg:** `launchPower 0` gibt es nicht; der Rückweg ist die Importzeile.

### Georgs Konzept, wörtlich festgehalten (06.09.) — damit es nie wieder neu erfunden wird

1. **Kurzes Antippen kippt.** Ein kurzer Klick auf eine **Würfelseite** dreht den Würfel eine Seite
   weiter, in die angetippte Richtung. Ein Tipp ist kein Schuss.
2. **Halten misst die Druckdauer** — mit dem Cartoon-Deformer als **Druck von oben** sichtbar.
3. **Ziehen setzt die Druckdauer FEST.** Ab dem ersten Ziehen wächst die Ladung nicht mehr; der Zug
   bestimmt nur noch **Richtung und Winkel**.
4. **Schleuder wie der Abschussbolzen beim Pinball:** der Würfel fliegt **entgegen** dem Zug.
5. **Offen (Georgs Frage):** ob die **Zugweite** zusätzlich Flug oder Drall verändert. Sie wird
   gemessen (`grab.zug`, 0…1 über zwei Zellbreiten) und ist **nicht** verdrahtet.
6. **Kontext für später:** die unsichtbaren vier Wände und die Decke sollen bei Kontakt sichtbar
   werden — **Energieschild** mit Blitzen aus dem Trefferzentrum, Schild-Animation. Ausdrücklich
   kein billig gebastelter Effekt. Eigene Scheibe, nach dem Wurf.

**Quellen, die dasselbe schon sagten und die ich vorher nicht zusammengelesen hatte:** das
Spiel-Dokument §3 (»press-and-drag … storing visualized tension« · »a **subtle** aiming guide« ·
»**Vertical flicks are supported.** A die can rise, hit the invisible ceiling, rebound, strike an
elevated Boxel or tower from above«) · die Physik-SSOT §4.3 (Zieldarstellung = Richtungslinie,
**vorhergesagter erster Auftreffpunkt**, Stärkeanzeige — und die Sperre: keine ungenaue Vollbahn) ·
`SpinBallPop v3` im Haus, das die Schleuder nach Georgs Brief schon gebaut hat.

### Gebaut in dieser Scheibe (a · Wurfbogen zuerst)

**Schleuder statt Schub.** Der Zug zeigt jetzt vom Zeiger ZUM Würfel (vorher umgekehrt), und die
Ladung friert beim ersten Ziehen ein.

**Der Wurf hat einen Bogen.** Vorher war der Stoß rein waagerecht (`z: 0`) — also keine Flugphase,
kein Deckenabprall, kein Treffen von oben, und gemessen ein Weg von 41,9 Zellen auf einem Feld von
12,8: er flipperte. Jetzt: **Abwurfwinkel 25°** (der einzige gesetzte Wert), Betrag aus der
Wurfweite abgeleitet (`v = √(Feldbreite·g / sin 2α)`, Feldbreite und Schwere von ihren Eigentümern),
und ein **Überschlag von genau einer Drehung je Flug** (`ω = 2π/Flugzeit`). Der Stoß greift jetzt in
der **Mitte**, weil die Drehung ausdrücklich gesetzt wird — ein Eigentümer je Größe.

**Gemessen, drei Ladestufen:**

| Ladung | v | Gipfel | Flugzeit | Umdrehungen | Ende |
|---|---|---|---|---|---|
| 0,25 | 7,7 | 0,05 | — | 0,86 | 0° · ruht |
| 0,60 | 13,5 | 0,19 | — | 1,56 | 0° · ruht |
| 1,00 | 20,0 | **1,67** | 0,70 s | 3,14 | 0° · ruht |

Der Gipfel skaliert wie er soll (Soll 1,4 bei voller Ladung, Decke bei 3,4), und **3 von 3 enden
flach und in Ruhe**.

**⚠ EINE ZAHL IST OFFEN UND SIE GEHÖRT GEORG:** die **Weite** ist bei allen drei Stufen **negativ**
(−0,4 · −1,2 · −2,4 Zellen) — der Würfel endet hinter seinem Startpunkt. Ursache ist nicht der
Bogen, sondern das, was danach passiert: er landet mit 18 Zellbreiten/s waagerecht und rammt die
Flanke der nächsten erhöhten Zelle (0,38) bzw. einen Bumper (0,92), und über mehrere solche Treffer
läuft er zurück. Die Ableitung »volle Ladung trägt einmal über das Feld« gilt für **freien Flug** —
auf einem Klotzfeld frisst das Relief die Energie und wirft zurück. Wie weit ein voller Wurf tragen
SOLL, ist eine Gefühlsgröße; darum stehen **Winkel und Weite jetzt als zwei Regler im Wirt**
(`launchDeg` 8…45°, `launchPower` 0,4…1,4) statt als geratene Konstante in einer Datei.

**Nicht gebaut, benannt:** das **Antippen zum Kippen** (Punkt 1) · die **Zieldarstellung** (Punkt b
seiner Wahl) · die **Zugweite als Modifikator** (Punkt 5) · der **Energieschild** an Wänden und
Decke (Punkt 6) · der **Deformer**.

**⚠ Und ein Befund zum Deformer, gemessen statt vermutet:** `d.mesh.scale.set(e·(1−s), e·(1+0,55s),
e·(1+0,35s))` staucht **immer entlang der eigenen X-Achse des Würfels** — `d.squashDir` wird
berechnet und **nirgends benutzt**. Während der Würfel sich überschlägt, zeigt die Stauchung
deshalb in eine beliebige Richtung. »Druck von oben« (Georgs Punkt 2) braucht eine Stauchung in
**Weltachsen**, und das verlangt die Sichtschicht als **Kind** (SSOT §9.1) — genau die Trennung, die
das Post Mortem als letzten Schritt vorsieht. Eigene Scheibe.

---

**Datum:** 06.09.2026 · **Geändert:** `boxelblitz-v4/dice.v4.js` (drei Stellen),
`boxelblitz-v4/cube.v3.js` (die Decke) · **Rückweg:** im Wirt eine Zeile auf
`./boxelball-v1/dice.v1.js?a14`.

**Georg 06.09.:** »die Dynamik & Physik & Abschuss-Logik ist sogar noch schlechter als Version 1«,
dazu »eine vollkommen willkürliche Kollisionsphysik, die dazu führt, dass der Würfel ohne Kontakt
weiter springt oder dass bei einer leichten Berührung sofort ein bis drei Boxel platzen«, und ein
Bild mit dem Würfel **neben dem Feld auf dem Kartenstapel**. Alles drei ist im Code gefunden.

**1 · »Leichte Berührung → ein bis drei Boxel platzen«.** Meine Kontaktmeldung feuerte bei JEDEM
Zellwechsel unter dem Kontaktpunkt — **ohne jede Schwelle**. Der tiefste Eckpunkt eines praktisch
ruhenden Kastens wandert um Bruchteile und wechselt dabei die Zelle: das Feld löste sich unter einem
stehenden Würfel auf. **Die v1 hatte diese Regel gar nicht** — sie löste beim Rollen nur im
Aufprall-Zweig aus (`vin > Zelle·1,1`). Jetzt gilt dieselbe Schwelle, waagerecht.

**2 · »Springt ohne Kontakt weiter«.** Die Keil-Regel (V4-S7b) feuert alle 0,25 s an einem
STILLSTEHENDEN Würfel, um den Klotz aufzulösen, auf dem er lehnt — und lief dabei durch denselben
Weg wie ein echter Aufprall. Traf sie ein Bumper-Gesicht, gab das Feld einen Kick von 11
Zellbreiten/s nach oben (Gipfel 2,5 Zellen), und der Würfel hüpfte aus dem Nichts los. Ein
Entkeilen ist eine **Aufräumregel**: es löst den Klotz und sonst nichts.

**3 · Die Decke war im Fork verloren.** Die v1 hielt sie als Regel (`d.z > F.ceil ⇒ zurückwerfen`,
`dice.v1.js` Z. 661). In cannon gibt es keinen Körper dafür, und der Wirt gab sie nur für den
**Einwurf** mit (`d.ceilUp ? … : null`) — im Spiel also **gar keine Decke**. Nach einem Bumper-Kick
verlässt der Würfel das Feld nach oben und kommt irgendwo wieder herunter. Jetzt trägt der Körper
dieselbe Regel wie die v1, mit der Restitution der Decke (0,55) aus dem Eigentümer der Flächen.

**⚠ EINE EIGENE DIAGNOSE WAR FALSCH, und ich habe sie zurückgenommen, bevor sie Schaden anrichtet.**
Ich hatte den Abschuss gegen das Vorbild gerechnet: `uuuulala` wirft dimensionslos mit 0,42…1,13 mal
√(g·s), unsere Fassung mit 1,07…5,92 — »fünffach zu hart«. **Dann gemessen: mit dem Wert des
Vorbilds kam der Würfel 0,3 Zellen weit und räumte 0 Zellen**, acht Würfe, alle gleich. Der Grund
ist die **Reibung**: das Vorbild lässt cannons Vorgabe (0,3) stehen und sein Tisch ist zwei
Würfelbreiten groß; unsere Reibung ist 0,72 und das Feld ist **siebzehn** Würfelbreiten breit. Aus
dem Bremsweg eines rutschenden Kastens folgt für 12 Zellen Feldbreite **20,3 Zellbreiten/s** — fast
genau die Zahl, die vorher dastand. **Sie war richtig, nur unbegründet.** Vierter Fall der Klasse C
aus dem Post Mortem: *eine Vorbildzahl gilt nur mitsamt der Welt, für die sie gemessen wurde.*

**⚠ UND DAS PRÜFWERKZEUG SELBST IST KAPUTT — deshalb steht hier keine Abnahmetabelle.**
`dice.dev.audit(n)` setzt die Würfe über `d.vx/d.vy/d.vz`. Nach dem Fork sind das **Rückschriften**,
die nichts bewegen: der Körper wird nie angestoßen, der Würfel bleibt in der Einwurflage, und die
Zahlen zählen Bilder eines Wurfs, den es nie gegeben hat (`überDerDecke 1534` bei einem Würfel, der
gar nicht fliegt). **Genau diese Lehre steht seit V4-S6 im Dokument** (»eine Abnahme muss den Körper
treiben, nicht die Felder, die er beschreibt«) — sie war nur halb umgesetzt. Bis das gerade ist,
gibt es für Würfe **keine belastbare Zahl**, und ich behaupte auch keine.

**Damit liegt die Abnahme bei Georg, mit dem Rückweg in einer Zeile.** Die drei Ursachen sind
benannt und behoben; ob das Ergebnis besser ist als die v1, entscheidet sein Wurf, nicht meine
Messung.

### Nachtrag am selben Tag · zwei weitere Ursachen, gemessen

**4 · Die Feder auf freier Fläche — ein Bumper, der nicht mehr da ist.** Georg: »das scheint mir
auch kein Bumper-Effekt von einem Boxel zu sein, sondern auf freier Fläche zu passieren«.
`boxel.cellOf()` gibt die **Rasterzelle** unter einem Punkt zurück, ohne zu fragen, ob dort noch ein
Klotz steht. Zwei meiner drei Kontaktmeldungen suchten sich ihre Zelle so — also meldeten sie
Kontakte an Stellen, an denen bis vor einem Augenblick ein Boxel *war*, und ein aufgelöster Bumper
gab weiter seinen Kick von 11 Zellbreiten/s nach oben. Jetzt prüfen sie `alive && seated`. Die
physische Seite braucht das nicht: ein gelöschter statischer Kasten kann keine Kollision melden.

**5 · Die mitgereiste Einwurf-Decke wurde nie zurückgesetzt.** Gemessen: die Spiel-Decke liegt bei
**3,40** Zellen, der Körper hielt aber **6,98** — die Höhe, die der Einwurf gebraucht hat. Also galt
im Spiel praktisch keine Decke, obwohl eine eingebaut war. Jetzt gilt sie, sobald er einmal darunter
ist. **Wirkung, gemessen: 16 Deckentreffer in sechs Würfen** — der Würfel verließ das Feld also
regelmäßig nach oben.

**6 · Der Würfel steht nicht mehr auf der Kante — die Störung fehlte.** Ein Würfel auf einer Kante
ist **metastabil**; in der Wirklichkeit fällt er, weil es dort immer eine Störung gibt. Die Regel des
Vorbilds (»warten, bis er umfällt«) setzt genau diese Störung voraus — in einem Löser mit exakt null
Drehmoment gibt es sie nicht, deshalb wartet er ewig, und mein Code sagte danach ausdrücklich »dann
darf er liegen«. Jetzt liefert das SPIEL die Störung: ein Drall von 0,8 rad/s in zufälliger
Richtung, höchstens alle 0,25 s, unsichtbar klein. Eigentümer ist das Spiel, nicht der Körper.

**Sechs Würfe durch den Spielweg:** flach am Ende **6/6** (0° · 0° · 0° · 0,1° · 0° · 0°) · zur Ruhe
5/6 · Deckentreffer 16 · Keil-Störung 0 (der Fall trat nicht auf).

**⚠ UND DIE ZAHL, DIE DIE NÄCHSTE ENTSCHEIDUNG TRÄGT:** der Weg je Wurf ist
**7,5 / 4,4 / 29,8 / 41,9 / 15,2 / 22,7** Zellen — auf einem Feld von **12** Zellen Breite. Bei
voller Ladung legt der Würfel also mehr als das Dreifache der Feldbreite zurück: er **flippert**,
er rollt nicht. Dazu kommt: der Stoß ist rein waagerecht (`z: 0`) — es gibt **keine Flugphase**,
also auch keine der »3D-Sprünge«, die Georgs Anforderungsliste nennt. Das ist keine Einstellung,
das ist das Abschusskonzept. Georgs Vorschlag (ballistische Kurve mit Zieldarstellung) trifft genau
diesen Punkt.

## V4-S9 · DER NASSE SACK IST WEG — SECHS OBERFLÄCHEN STATT EINER ZAHL

**Datum:** 06.09.2026 · **Neu:** `boxelblitz-v4/surfaces.v1.js` (Eigentümer der Restitutionen),
`boxelblitz-v4/cube.v3.js` (Fork von `cube.v2.js`, EINE Änderung: das Materialmodell) ·
**Geändert:** eine Importzeile in `dice.v4.js`, eine im Wirt ·
**Rückweg:** in `dice.v4.js` die Zeile auf `./cube.v2.js`.

**Der Defekt in einer Zeile:** `world.defaultContactMaterial.restitution = 0.3` war die EINZIGE
Restitution im Aufbau — die Zahl des Vorbilds, das genau EINE Oberfläche kennt (einen unendlichen
Tisch). Unser Spiel hat SECHS. Sie waren auf einen Wert zusammengefallen, und das war Georgs
»nasser Sack«. Jetzt: je Oberfläche ein `Material`, je Paar ein `ContactMaterial`.

**Zwei Befunde, die den Unterschied machen — beide gemessen, keiner geraten:**

1. **Eine Zelle hat ZWEI Oberflächen, und das geht in EINEM Körper.** cannon löst die Paarung als
   Shape → Body → Vorgabewert auf (`Narrowphase.ts` Z. 377–380). Gemessen: ein Körper, dessen
   Body-Paar auf 0 steht und dessen Shape-Paar auf 0,92, prallt mit **0,912** ab — das Shape
   gewinnt. Also trägt jede Zelle einen Rumpf (Flanke 0,38) und eine dünne Deckplatte (Deck 0,30).
   ⚠ Damit das greift, braucht **auch das Würfel-Shape** ein Material: cannon nimmt die
   Shape-Paarung nur, wenn BEIDE Shapes eines tragen — sonst fällt es still auf das Body-Material
   zurück und Deck und Flanke sind wieder eine Oberfläche.
2. **Gesetzter Wert und gemessener Abprall sind nicht dasselbe.** Der Löser verliert bei jedem
   Kontakt Energie. Gemessen im Spiel, Fall 4 Zellen, acht Punkte, **Plane und Kasten auf
   derselben Gerade**: `gemessen = 0,9225 · gesetzt − 0,0505` (±0,002). Wer die Designwerte
   unverändert einträgt, bekommt ein Blatt mit **0,52** statt 0,62 und ein Deck mit **0,23** statt
   0,30 — das Spiel fühlt sich weiter zu weich an, obwohl »die richtigen Zahlen drinstehen«.
   Die sechs Designwerte sind die Zahlen der v1, und dort waren sie ein **direkter Faktor auf die
   Geschwindigkeit** (`dice.v1.js` Z. 442) — also der gemessene Abprall. Deshalb ist der Designwert
   das SOLL und der Motorwert sein Umkehrwert. Ein Eigentümer, zwei Darstellungen derselben Größe.
   Rückweg: `createSurfaces({ kalibriert: false })`.

**ABNAHME im Spiel** (Fall 4 Zellen, 6 s, Messgriff `__kfbBoxelBall.dice.dice[0].body`):

| Soll | Motorwert | gemessen | Δ | Gipfelfolge |
|---|---|---|---|---|
| Deck 0,30 | 0,380 | **0,300** | +0,000 | 0,366 |
| Flanke 0,38 | 0,467 | **0,380** | +0,000 | 0,585 · 0,085 |
| Bande 0,42 | 0,510 | **0,420** | +0,000 | 0,713 · 0,121 |
| Decke 0,55 | 0,651 | **0,550** | +0,000 | 1,217 |
| **Blatt 0,62** | 0,727 | **0,620** | +0,000 | **1,544 · 0,286 · 0,062** |
| Bumper 0,92 | 1,000 (Deckel) | 0,872 | −0,048 | 3,038 · 2,630 · 0,285 |

**Die Zahl, die Georgs Wort beantwortet:** auf dem Blatt stand **ein** Abpraller von **0,214**
Zellen; jetzt sind es **1,544 · 0,286 · 0,062** — siebenfache Höhe und drei Abpraller. Auf dem Feld
wie gespielt: e **0,302** bei Soll 0,30, Schiefe 0°, kommt zur Ruhe. Paare 6/6, 83 statische Kästen,
keine Fehlermeldung.

**Zwei Abweichungen, benannt statt versteckt:**
- **Der Bumper hat einen Deckel bei 1,0.** Die Umkehrung verlangt 1,052, und über 1 fügt der Löser
  Energie hinzu — gemessen 3,379 → 0,281 → **0,454 → 0,500**, also ein Würfel, der nach dem dritten
  Abprall höher steigt als nach dem zweiten. Perpetuum mobile statt Katapult. Mit Deckel misst er
  0,872 (−0,048); seinen eigentlichen Schub bekommt er aus dem **Kick** des Spiels
  (`dice.v4.js` Z. 466, Untergrenze 11 fürs Auftempo) — da gehört das Katapult hin.
- **»Gipfelfolge fällt monoton« ist für einen KASTEN kein Gesetz.** Bei 0,62 und 0,92 gibt es späte
  kleine Sprünge (0,062 → 0,109). Ein Kasten, der auf eine Ecke fällt, wandelt Drall in Höhe — das
  ist richtig und nicht ein Energiegewinn. Wer es prüfen will, prüft die **Energiebilanz**, nicht
  die Gipfelhöhe. Dritter Fall derselben Klasse (Post Mortem §4, Klasse C).

**Die Decke ist deklariert, aber kein Körper.** `setCeil` gibt dem Körper nur eine Zahl mit; das
Spiel hält den Einwurf. Das Paar steht bereit, sobald die Decke ein Körper wird.

**⚠ WAS ICH IN DIESER RUNDE FALSCH GEMACHT HABE — und was Georg gestoppt hat:** ich habe zuerst ein
eigenes **Physiklabor** gebaut (eigene Datei, sieben Prüfbahnen, Overlay, Kalibrierszene) statt am
Spiel zu arbeiten. Georg: »ich erinnere mich nicht daran, dich gebeten zu haben, hier ein Physics
Lab zu bauen — das ist im Prinzip das Anti-Pattern, das ich seit drei Tagen aufzubrechen versuche.«
Er hat recht: die Analyse zum Post Mortem hat es *vorgeschlagen*, aber **niemand hat es bestellt**,
und eine Messveranstaltung neben dem Spiel ist kein Fortschritt am Spiel. Alles davon ist gelöscht.
Aus dem Labor überlebt genau eines, und zwar weil es ins Spiel gehört: die Erkenntnis, dass das
Shape-Material das Body-Material schlägt (K5), und der Eigentümer der sechs Paare.
**Regel für die nächste Runde: eine neue Datei ist nur dann gerechtfertigt, wenn das SPIEL sie
lädt.** Ein Prüfstand, den das Spiel nicht lädt, ist eine Zeitquest.

**Und vier eigene Abnahmezahlen waren in dieser Runde falsch gebaut** (die Klasse aus dem Post
Mortem, jetzt bei zwölf): eine Stückzahl, die »ein Ereignis je FALL« prüfte und »ein Ereignis je
AUFPRALL« behauptete · ein Unterdrückungszähler, der als Fehler gelesen wurde, obwohl er der Beweis
war · eine **Kennlinie, bei der ich den Regler in der einen Welt gedreht und in der anderen gemessen
habe** (die Reihe war schnurgerade flach — und genau das hätte sofort auffallen müssen) · eine
Reihe, die fünf Oberflächen in einer Welt messen wollte, in der es nur eine gab. Alle vier sind in
derselben Sitzung von der Messung selbst gefangen worden, keine davon von Georg.

**Als Nächstes, in dieser Reihenfolge:** Georgs Urteil am Bild (fühlt sich der Wurf lebendig an?) ·
dann die Zahlen, die ihm gehören (Wurfweite, Zahl der Abpraller, Ausrolldauer) · dann die
Sichtschicht (Stauchen/Strecken als **Kind**, Werte aus der SSOT §9.2) · dann die Effektlagen.

---

## V4-S8 · WORTMARKE 1:1 AUS TRAVEL v13 · SEITENSTROM AUS DEM KORPUS

**Datum:** 06.09.2026 · **Neu:** `themes/kfb-med.css` (unverändert kopiert),
`boxelblitz-v4/decks.v1.js` · **Geändert:** Kopf und Wortmarken-Block im Wirt, `_boot`, `_deal` ·
**Rückweg:** je eine benannte Zeile im Kopf der Dateien.

### Die Wortmarke ist jetzt die KLASSE, kein Nachbau

**Befund:** `KFB Travel v13.dc.html` Z. 67 schreibt sie als
`<div class="kfb-wordmark">Kayfa<b>Bizarro</b></div>`, und die Klasse steht in
`themes/kfb-med.css` — einer Datei, die sich selbst »Quelle der Wahrheit für Farben, Type,
Rhythmus« nennt. **Mein Stand war ein Nachbau in Shantell Sans mit einer Cremefläche hinter
»Kayfa«** — Farbe richtig (#b8361f), **Schrift falsch**: das Kit verlangt **Irish Grover**
(`--kfb-font-display`).

Jetzt ist die Datei unverändert kopiert und verlinkt; im Wirt steht dieselbe Zeile wie in Travel.
**Abnahme am gerenderten Element:** Schrift `"Irish Grover"` · 27 px · Akzentgrund
`rgb(184,54,31)` = #b8361f · Akzenttext `rgb(246,239,217)` = `--kfb-cream` · Neigung **−0,8°**
(`--kfb-tilt`) — alle Werte des Kits, keiner von mir.

**⚠ Eine Abweichung, gemessen begründet:** Travel v13 sitzt über einem **hellen** Himmel (#9fc7e8),
dort ist Tinte auf Papier richtig. Unsere Bühne ist #131210 — Tinte #1f1a14 darauf ergibt **1,1:1**
und ist unlesbar (im Bild ein Cream-Umriss dunkler Buchstaben). Die Kit-Regel begründet ihren
Schatten ausdrücklich als **Kontrastkante**; auf dunklem Grund heißt dieselbe Absicht umgekehrt:
Cream füllt, Tinte kantet (**15:1**). Klasse, Schrift, Akzent, Neigung, Abstände unangetastet.

### Der Seitenstrom: Deck → Seite → vier Karten

**Befund, warum das überhaupt neu ist:** `cb.pool()` lädt **alle 6108 Karten aller Decks** in eine
gesät gemischte Liste (`kfb-card-builder.js` Z. 174 ff.) — Deck und Seite spielen keine Rolle, im
Fächer lagen vier Karten aus vier Decks.

**Die Struktur war schon da:** jede Karte trägt `deck`, `packId` und **`cell`** (0-basiert, der
Vorspann ausgeklammert), und der Kartenbauer rechnet mit **4 Karten pro Bogen** — `poolSkipped`
wirft jedes Deck weg, dessen Zahl nicht durch 4 teilbar ist. Damit gilt **ohne eine neue Annahme**:
`Seite = ⌊cell/4⌋`, `Quadrant = cell mod 4`. Die erste Karte der Seite ist das Spielfeld.

**Drei Entscheidungen, benannt:** »dann nächste Seite« heißt aufsteigend im **selben** Deck ab der
zufällig gezogenen Seite, und erst wenn es durch ist, kommt ein neues Zufallsdeck · Seiten mit
einer **Blank**-Karte werden ganz übersprungen (eine leere Karte als Spielfeld wäre eine leere
Bühne; einzeln entfernen würde die Quadranten verschieben) · Decks mit unbrauchbarer Zuordnung
(`gridOk === false`) kommen nicht vor — dieselbe Regel, die der Pool schon anwendet.

**Abnahme über 200 Karten:**

| Kriterium | Ergebnis |
|---|---|
| Startdeck / Startseite | »Project Gateway Kayfabe«, **Seite 6 von 15** (zufällig) |
| Seitenfolge | 6 → 7 → 8 → … → **14**, dann neues Deck ab **Seite 9** (zufällig) |
| Deckfolge | **8 verschiedene** Decks, **9 Deckwechsel** |
| Seiten ausgegeben | **53** · übersprungen **1** (unvollständig oder blank) |
| Karten im Puffer | nie unter **7**, nach dem Nachladen **11** — immer vier im Stapel |
| Fehler | **keine** |

**⚠ Und ein Fehler von mir, der genau in die Sammlung des Post Mortems passt:** meine
Wiedereintritts-Sperre für das Nachladen hat **die Zusage selbst zwischengespeichert**
(`if (laedt) return laedt`). Damit bekamen spätere Aufrufer eine **längst erledigte** Antwort:
`fuellen(8)` meldete **»8«**, während der Puffer bei **0** stand — eine Antwort von vorhin auf eine
Frage von jetzt. Ein Riegel ist ein **Boolean**, kein Ergebnis, und er löst sich in `finally`.
**Achte Zahl, die etwas anderes gemessen hat als sie behauptet.**

---

## V4-S7b · DER KEIL IST EINE SPIELREGEL, KEINE PHYSIKFRAGE

**Datum:** 06.09.2026 · **Geändert:** `cube.v2.js` (Weckgrenze + `ruhtSchief`), `dice.v4.js`
(Keil-Regel) · **Rückweg:** die Keil-Regel ist ein Block in `stepDie`, `weckGrenze: Infinity`
stellt das Verhalten des Vorbilds wieder her.

**Georgs Bild (01:09, ohne Worte):** der Würfel lehnt in 37° an einem Boxel. **Gemessen im
laufenden Spiel:** Schiefe 37,36° · Tempo **0** · Winkeltempo **0** · **`kanteWartet 396`**.

**Damit ist die Grenze des Vorbilds benannt:** seine Kanten-Regel (»landed on edge ⇒ warten, bis er
umfällt«) setzt einen **unendlichen flachen Boden** voraus. Auf einem **Klotzfeld** gibt es echte,
statisch stabile Ruhelagen in Schieflage — der Würfel lehnt in einer Lücke, ist gestützt, und
Aufwecken ändert **nichts**, weil Geschwindigkeit und Drehmoment null sind. Die Regel feuerte 396
Mal im Kreis und verhinderte nebenbei, dass die Runde jemals »in Ruhe« meldet.

**Die Lösung stand schon im Design-Dokument: ein Kontakt löst eine Zelle auf.** Wer sich verkeilt,
räumt den Klotz weg, auf dem er lehnt — und fällt danach flach. Nichts wird verdreht, nichts
geschoben, keine neue Regel erfunden; der Keil wird nutzbringend statt lästig. Dazu eine
**Weckgrenze** (12 Versuche), damit die Regel des Vorbilds dort weiter gilt, wo sie richtig ist —
auf flachem Grund —, aber nicht mehr im Kreis läuft.

**⚠ Die Lehre, die zählt:** ein Vorbild ist für **seine** Welt richtig. Der Unterschied zwischen
Vorbild und Bau muss **benannt** werden, sonst übernimmt man eine Regel samt einer Voraussetzung,
die man nicht hat. Hier war die Voraussetzung ein flacher Boden — und unser Boden ist aus Klötzen.

**ABNAHME über 30 Würfe auf DREI frisch gebauten Feldern** (auch volle, wie in Georgs Bild):

| Kriterium | v1 (gemessen) | **jetzt** |
|---|---|---|
| liegt flach am Ende (< 2°) | 12,44° im Mittel (v1 täuscht flach durch Einrasten) | **29/30** |
| kommt zur Ruhe | 83 % | **30/30**, Mittel **3,17 s**, längstens 7,92 s |
| geräumte Zellen je Wurf | 8 / max 14 | **4,57 / max 11** |
| Keil-Regel gefeuert | — | **4 Mal**, jedes Mal aufgelöst |
| Weck-Kreisläufe | — | **0** (vorher 396) |
| Einwurf am Rundenbeginn | schief | **flach, 0,92 s** |

**Offen und gezählt statt behoben:** **1 von 30** endet weiter schief. Die Zahl steht in
`d.entkeilt` / `keilRuhe`; wenn sie steigt, ist die nächste Antwort ein **Höhenfeld** statt 84
Einzelkästen (cannon kann Kasten-gegen-Höhenfeld) — das ist eine eigene Scheibe, keine Reparatur.

---

## V4-S7 · DER WÜRFEL LÄUFT AUF CANNON-ES — JEDE ZAHL SCHLÄGT DIE v1

**Datum:** 06.09.2026 · **Neu:** `boxelblitz-v4/cube.v2.js` (cannon-es) · **Geändert:** die
Importkarte im Wirt (`cannon-es`), eine Importzeile in `dice.v4.js`, die Würfelkante und der
Wurf-Versatz · **Rückweg:** in `dice.v4.js` die Zeile auf `./cube.v1.js`.

**Vorbilder, von Georg geliefert und wörtlich übernommen:**
`uuuulala/Threejs-rolling-dice-tutorial` (MIT, Codrops) · `pmndrs/cannon-es` (`examples/threejs.html`,
`getting-started.md`) · das Codrops-Tutorial vom 25.01.2023.

**⚠ WAS DAMIT WIDERLEGT IST: MEINE EIGENE ENTSCHEIDUNG.** `MODELL_wuerfel_v1.md` §3 begründet einen
**eigenen Löser** mit drei Argumenten — Wiederholbarkeit, das Raster sei einfach, eine Engine sei
eine Fassungs-Baustelle. Das Vorbild zeigt alle drei als hinfällig: es läuft **ohne Bauwerkzeug**
(ES-Modul über die Importkarte), es ist bei festem Schritt deterministisch, und es ist genau unser
Fall. Mein Löser hat fünf Runden und **sechs falsch gebaute Abnahmezahlen** gekostet und kam auf
8 von 10 flachen Landungen. **Ein Vorbild schlägt eine Begründung — und es hätte am Anfang gestanden,
wenn ich gesucht hätte, statt zu rechnen.**

**Wörtlich übernommen, nicht nachgebaut:** Schwere −50 bei Kante 1,0 (hier maßstäblich 50·s = 34) ·
`defaultContactMaterial.restitution = 0.3` · `allowSleep: true`, `sleepTimeLimit: 0.1` ·
Kollisionskörper ein **glatter** `Box` bei abgerundetem Netz · Wurf als
`applyImpulse(kraft, versatz)` an einem **versetzten** Punkt · und die Antwort auf »liegt auf der
Kante«: beim `sleep`-Ereignis prüfen, ob eine Fläche nach oben zeigt — wenn nicht, Schlaf wieder
erlauben und **warten, bis er umfällt**. Keine Lagekorrektur, kein Einrasten, kein Anstoß.

**Zwei Abweichungen mit Grund:** `world.step(dt)` statt `fixedStep()` — letzteres führt eine
**eigene** Uhr (`performance.now`) und ist für eine wiederholbare Messung unbrauchbar
(`getting-started.md` nennt `step(dt)` genau dafür). Und vier **Banden** als `Plane`, die das
Vorbild nicht braucht (Design-Dokument §2); dabei: **eine `Plane` zeigt lokal nach +z**, ich hatte
zuerst alle vier nach außen gedreht.

**Zwei Zahlen sind ABGELEITET, und die erste Ableitung war falsch:**
- **Würfelkante 0,66** (vorher 0,72). Er darf eine Grube nicht **überbrücken**, sonst verkeilt er
  sich diagonal: `s·√2 < Weite`. Ich hatte mit der Zellbreite 1,0 gerechnet → 0,68. **Die Zellen
  sind aber nicht quadratisch:** eine Zeile ist 0,9556 breit (`cellAR`), also `s < 0,676`. Mit 0,68
  war die Diagonale 0,962 gegen 0,9556 — knapp zu breit, und genau das waren die letzten 2 von 12
  Würfen, die schief stehen blieben.
- **Wurf-Versatz 0,4 halbe Kanten** statt meiner 0,8. Die 0,8 kamen aus der Kippbedingung eines
  handgeschriebenen Lösers (µ > 1) und sind mit einer Engine hinfällig. **Diese eine Zahl war der
  letzte Hänger:** mit ihr gingen die restlichen 2 von 16 auf 0.

**ENDABNAHME — jede Zahl gegen die gemessene Referenz der v1:**

| Kriterium | v1 (gemessen 06.09.) | **cannon-es** |
|---|---|---|
| liegt flach am Ende (< 2°) | 12,44° im Mittel (v1 **täuscht** Flachheit durch Einrasten vor) | **16/16 · 0,00°** |
| kommt zur Ruhe | 5/6 = 83 % | **16/16 = 100 %**, im Mittel **2,45 s** |
| geräumte Zellen je Wurf | **8** im Mittel, **14** im Höchstfall | **3,19** / **7** |
| Abwurfhöhe (Einwurf von oben) | 9,4 → nach drei Bildern 9,376 | **9,4 → 9,376** (gleich) |
| Einwurf am Rundenbeginn | schief | **flach (0,00°) in 2,58 s** |
| Vorrichtungen | — | **6/6** |
| aus Schieflage 20/35/40/50/60/70° | — | **jede endet bei 0,00°** |

**Der ausgenommene Fall, mit Begründung:** genau **45,000°** ist die Kippkante eines Würfels — der
Schwerpunkt steht exakt über der Unterkante, das Drehmoment ist null, er bleibt stehen. Das Vorbild
behandelt diesen Fall ausdrücklich und korrigiert die Lage **nicht**. In einem Wurf ist er
unerreichbar.

**Und noch eine falsch gebaute Abnahmezahl, hier gefangen bevor sie etwas kostete:** die Fallprobe
meldete »nicht fallend«, weil ein Gipfel von **0,0001** Zellbreiten (= 0,004 px) als Abprall zählte.
Schranke jetzt 0,002. Damit sind es in dieser Baustelle **sechs** — alle derselben Klasse: die Zahl
maß etwas anderes als der Satz behauptete.

---

## V4-S6b · DER EINBAU IST ZURÜCKGENOMMEN — GEORGS ABNAHME ZÄHLT

**Datum:** 06.09.2026 · **Geändert:** die Importzeile zurück auf `boxelball-v1/dice.v1.js?a14` ·
**Gebaut: nichts.**

**Georg 06.09.:** »das ERGEBNIS IST UNGLAUBLICHERWEISE SCHLECHTER als der Zustand davor« — dazu:
»ein Würfel, der nach dem geringsten Kontakt sofort irgendwas auslöst« und »bleibt schräg auf der
Kante eines Boxels stehen«. **Sein Bild schlägt jede grüne Zahl von mir** (Hausregel: eine Kritik am
Bild widerlegt keine Messung — aber eine Messung rechtfertigt auch kein schlechteres Bild).

**Der Körper selbst ist NICHT das Problem** und bleibt abgenommen: 8 von 8 Vorrichtungen,
Wiederholbarkeit auf 9 Stellen, Energiebilanz ohne Gewinn, Kippen aus 40/50/60° flach. **Mein
EINBAU ist das Problem**, an zwei Stellen, beide gemessen aus seinem Bild:

1. **Die Kontaktmeldung feuert viel zu oft.** Ich melde **je Ecke und je Zelle** mit einer Schwelle
   von 0,06 — ein Kasten hat **acht** Ecken und berührt im selben Bild mehrere Zellen. Die v1
   meldete genau **eine** Zelle, und nur bei einem WECHSEL der Zelle unter dem Würfel bzw. bei
   einem Aufprall über `vin > Zelle·1,1`. Im Bild: ein Loch durch das halbe Feld, 450 Punkte.
   **Das ist derselbe Fehler, den v1 schon einmal bezahlt hat** (»ein Aufprall ist ein EREIGNIS,
   kein Zustand«) — ich habe ihn in neuer Form wieder eingebaut, obwohl der Satz im Kopf der Datei
   steht, die ich geforkt habe.
2. **Er ruht weiter schief auf einer Boxelkante.** Meine Stützprüfung lässt **drei** tragende Punkte
   gelten; drei Punkte auf Zellrändern über einem Loch sind ein *echtes* Gleichgewicht — für das
   Auge bleibt es »auf der Kante«. Die Prüfung ist physikalisch richtig und als Abnahmekriterium
   **zu schwach**: sie kann den Defekt, den Georg sieht, nicht sehen.

**Was daraus folgt, bevor der Fork wieder eingehängt wird** (in dieser Reihenfolge, jede mit einer
Zahl, die durchfallen kann):
- **Kontakt:** eine Meldung je **Zellwechsel unter dem Kontaktpunkt**, nicht je Ecke; Schwelle aus
  der v1 übernehmen (`vin > Zelle·1,1` für Aufprall). Abnahmezahl: **aufgelöste Zellen je Wurf**
  gegen die v1 gemessen — sie war die ganze Zeit die Referenz und ich habe sie nie erhoben.
- **Ruhelage:** das Kriterium ist nicht »im Gleichgewicht«, sondern **»liegt auf einer Fläche«** —
  Schiefe < 2° am Ende jedes Wurfs, über viele Würfe gezählt.
- **Erst danach** wieder einhängen, und die Abnahme lautet: **nicht schlechter als die v1**, in
  denselben Zahlen.

**Die Dateien bleiben stehen** (`boxelblitz-v4/cube.v1.js`, `boxelblitz-v4/dice.v4.js`), das Spiel
läuft wieder auf `boxelball-v1/dice.v1.js`.

---

## V4-S6 · DER KÖRPER HÄNGT IM SPIEL — »RUHT AUF KANTE« IST WEG

**Datum:** 06.09.2026 · **Neu:** `boxelblitz-v4/dice.v4.js` (Fork von `boxelball-v1/dice.v1.js`,
EINE Änderung drin: die Bewegung) · **Geändert:** eine Importzeile im Wirt ·
**Rückweg:** diese Zeile auf `./boxelball-v1/dice.v1.js?a14`.

**Zwei Dinge sind aus dem Bau verschwunden, und das ist der Punkt:**

1. **Die gefälschte Drehung.** `dice.v1` rechnete `mesh.rotation.x += (vy/e)·dt·1,5` — eine
   *Kugel*drehung aus der Geschwindigkeit — und **rastete sie danach auf Vierteldrehungen ein**.
   Genau dieses Einrasten ist Georgs »ruht auf Kante«: es zog die Lage zur nächsten Fläche, ohne
   dass eine Fläche trug. Jetzt kommt die Drehlage aus dem Quaternion des Körpers, und
   `stats().kante` misst zum ersten Mal die **wirkliche** Schiefe statt das eigene Einrasten.
2. **Der Gassen-Notbehelf** (`pitLift` + `hold`, »erst hoch, dann los«) — nötig, weil ein Kreis aus
   einem Schacht von einer Zelle seitlich nie herauskam. Ein Körper kippt sich hinaus. Steckenbleiben
   wird jetzt **gezählt**, nicht umgangen.

**Ein dritter Fehler kam erst im Spiel zum Vorschein, und er war meiner:** der Würfel **schlief in
54° Schieflage ein** — dieselbe Erscheinung wie vorher, andere Ursache. Meine Ruhebedingung prüfte
nur Tempo und Winkeltempo; ein Körper, der auf einer Kante balanciert, hat aber fast **kein**
Winkeltempo, er fängt gerade erst an zu kippen. **Ruhe verlangt ein Gleichgewicht, nicht nur
Stillstand:** die senkrechte Projektion des Schwerpunkts muss innerhalb der konvexen Hülle der
tragenden Kontaktpunkte liegen (zwei Punkte = Strecke = nie innerhalb → er kippt weiter).

**Abnahme, im Spiel gemessen, nicht in der Vorrichtung:**

| Kriterium | Ergebnis |
|---|---|
| **nach einem echten Wurf** | Schiefe **1,78°** (»auf einer Fläche« heißt < 2°), **4 Kontakte**, im Gleichgewicht, Kontakthöhe 0,013 |
| Rollen statt Rutschen | **Rollverhältnis 1,124** über 6,74 Zellen Weg |
| Kippen aus Schieflage | 40° → **0,55°** · 50° → **0,55°** · 60° → **0,09°** (fällt flach) |
| genau 45° (der echte Gleichgewichtspunkt) | bleibt stehen und **weigert sich zu schlafen** — richtig, das ist die Kippkante |
| gesäte Wurf-Abnahme, 8 Würfe | außerhalb **0** · unter dem Blatt **0** · über der Decke **0** · zur Ruhe **5/8** (v1-Stand: 5/6) |
| Wiederholbarkeit | **identisch auf 9 Stellen** (`determinism ok`) |
| bekannte Grenze Ecke-gegen-Kante | **0** in allen Läufen |
| die acht Vorrichtungen | weiter **8/8** |

**Ein Befund, der Georg gehört — nicht behoben, gemessen:** der **Einwurf** am Rundenbeginn kommt in
54° Schieflage zur Ruhe, und das ist **kein Löserfehler** — `imGleichgewicht: true`, drei tragende
Punkte: der Würfel fällt aus 5,2 Zellen Höhe, löst beim Aufsetzen Zellen auf und **verkeilt sich in
dem Loch, das er selbst gemacht hat** (Kontaktpunkt 0,375 Zellen über dem Blatt, Zellhöhe 0,78).
Physikalisch richtig, als Bild aber genau das, was Georg als »steht auf der Kante« liest — und es ist
der Zustand, den er beim Start SIEHT. Das ist eine Design-Entscheidung, keine Reparatur:
**(a)** der Einwurf löst nichts auf (er landet auf geschlossenem Feld), **(b)** er wird flacher
eingeworfen, **(c)** er wird auf die nächste Fläche gedreht, sobald er ruht.

**Zwei eigene Fehler beim Einbau, festgehalten:**
- meine Import-Zeile landete mit **literalen `\n`-Zeichen** in der Datei — ein Backslash außerhalb
  eines Textes ist ein ungültiges Zeichen, der ganze Wirt lief nicht mehr an (»wird geladen …«).
  Sichtbar nur im **Fehlerprotokoll**, nicht im Bild.
- die gesäte Wurf-Abnahme setzte `d.vx/d.vy` — nach dem Fork sind das **Rückschriften**, die nichts
  bewegen. Sie hätte 8 ruhende Würfel gemeldet und grün gemeldet: **eine Abnahme muss den Körper
  treiben, nicht die Felder, die er beschreibt.** Jetzt läuft der Wurf durch denselben Weg wie im
  Spiel.

---

## V4-S5 · DER WÜRFEL IST EIN KÖRPER — ACHT VORRICHTUNGEN GRÜN

**Datum:** 06.09.2026 · **Neu:** `boxelblitz-v4/cube.v1.js` (Physik, kennt three NICHT) +
`docs/boxelblitz-v4/MODELL_wuerfel_v1.md` (Vertrag) · **Rückweg:** nichts tun — der Körper hängt
noch **nicht** im Spiel, `boxelball-v1/dice.v1.js` läuft unangetastet weiter.

**Georg 06.09., und er hat in jedem Punkt recht:** ich hatte ihm sechs Geschmacksfragen gestellt zu
etwas, das **Handwerk** ist und mein Job war. Sein Anhang `uploads/KFB Dice_Movement+Physics_v1.md`
ist ab jetzt die **SSOT** dieses Moduls.

**Er hat mich auch in der Sache korrigiert:** mein Vorschlag »ein Würfel kippt in diskreten
Vierteldrehungen« wäre ein handgeschnitzter Sonderfall gewesen — er kann keinen Abprall, keinen
schrägen Treffer, keinen Flug. **Das Kippen ist kein Mechanismus, es ist ein Ergebnis** aus
Kastenkörper, Trägheit, Kontaktnormale und Reibung am Kontaktpunkt.

**Der Befund, der den Neubau begründet** (`dice.v1.js` Z. 118): `F.r = F.edge * 0.55` — der Würfel
ist physikalisch ein **Kreis**, Inkreis plus 10 %, aus einem **Flipper**-Löser übernommen. Georgs
sieben Beobachtungen sind **eine** Ursache; die Zuordnung Punkt für Punkt steht im Modell §1.

**Vier eigene Fehler in dieser Scheibe, jeder mit der Zahl, die ihn gefangen hat:**

1. **Restitution je Ecke statt einmal als Ziel.** Vier gleichzeitig tragende Ecken wandten jede die
   volle Restitution auf; weil ein Eckstoß nur ein Viertel der wirksamen Masse sieht, kippte die
   Energie in Drall. Fallprobe **2,0062 → 0,0052**, wo 0,29 stehen muss. Behoben mit
   Gauß-Seidel und Restitutions-**Ziel** aus der einmal gemessenen Annäherung.
2. **Der Stoß war doppelt gebucht.** Ich setzte `v` UND `ω = Stärke/h` getrennt (so steht es in der
   SSOT §4.1 — dort aber ausdrücklich als *visuelle* Näherung). Gemessen: der Würfel überdrehte,
   fuhr bis x = 0,776 vor und rollte auf **x = −0,047 zurück**. Jetzt **ein Impuls an einem Punkt**,
   `Δv = J/m` und `Δω = (r×J)/I` aus derselben Zahl.
3. **Lage nur am tiefsten Kontakt gerichtet.** Steckt der Körper in **zwei** Achsen, bleibt eine
   stehen: an der Stufe lag der Kontaktpunkt **0,307 unter** der Oberfläche. Jetzt vier Durchgänge,
   jeder neu erhoben.
4. **Höhe am Mittelpunkt gemessen statt am Kontaktpunkt** — meine eigene Vertragsregel (SSOT §1.2)
   in meiner eigenen Probe gebrochen: an der Stufenkante meldete sie 0,47 für einen Körper, der
   oben **liegt**.

**Der wertvollste Befund ist keine Reparatur, sondern Physik:** mit einem Stoß auf den **Mittelpunkt**
rutscht der Würfel und rollt **nie** (Rollverhältnis 0,047, Rutschen 2,06). Das ist die
**Kippbedingung** eines Kastens — er kippt nur, wenn µ größer ist als das Verhältnis von halber
Standbreite zu Schwerpunkthöhe, bei einem Würfel also **µ > 1**; unser µ ist 0,72. **Ein Würfel, den
man in der Mitte anschiebt, rutscht — man muss ihn oben treffen.** Der Angriffspunkt steht deshalb
auf 0,8 der halben Kante über der Mitte, als abgeleitete Zahl mit Begründung im Code.

**Abnahme — acht Vorrichtungen der SSOT §12, als Zahlen, ohne Bild und ohne Bildschleife:**

| # | Messung | Ergebnis |
|---|---|---|
| 01 ruhender Würfel | z-Abweichung **0**, Drall 0, schläft, Versatz **0,0055 px** und **Wachstum 0** | grün |
| 02 gerader Rollstoß | Weg 2,685 · Drehung 6,045 rad · **Rollverhältnis 0,811** · Rutschen 0,037 | grün |
| 03 Abschuss | Stoßrichtung **0,9273 = Eingabe exakt** · Lagesprung 0,0166 < 0,36 | grün |
| 04 senkrechter Sprung | Gipfel **2,0062 → 0,2817 → 0,0483**, monoton, Ende in Ruhe | grün |
| 05 Bande | vx **3,806 → −2,155**, **1 Ecke** zuerst, **Energie 11,182 → 11,179** | grün |
| 07 Ausrollen | »langsam« bei 1,74 s, Schlaf bei 2,64 s → **0,90 s Auslauf**, kein Halt aus dem Nichts | grün |
| 08 Fallprobe | Gipfel **0,372 → 0,063 → 0,023** (Soll 0,38²·3 = 0,43 minus Dämpfung) | grün |
| 09 Stufe *(Zusatz, Georgs Punkt)* | **kippt sich hinauf**, endet bei x = 4,51 **oben**, Kontakthöhe 0,011, **Kantenlücke 0**, schläft | grün |

**Wiederholbar:** zweimal derselbe Lauf ergibt Zeichen für Zeichen dieselben Zahlen
(Vertrag `determinism: seeded`).

**Und eine Abnahmezahl war ZWEIMAL falsch gebaut** — der zweite Fall ist der lehrreiche: »|vx′| ≤
e·|vx|« ist für einen **rollenden** Kasten das falsche Gesetz. Er kommt mit Drall an, am Eck-Kontakt
wandelt sich Drehimpuls in Rückstoß (wie bei einem Ball mit Vorwärtsdrall), die Mitte kehrt mit 0,566
statt 0,38 zurück — und das ist richtig. Die Restitution gilt für den **Kontaktpunkt**. Was wirklich
nicht passieren darf, ist ein **Energiegewinn**; das ist die Zahl, die einen echten Fehler fängt.
Damit sind es in dieser Baustelle **fünf** falsch gebaute Abnahmezahlen (V2-S7, V4-S3, V4-S4, und
zwei hier) — **immer dieselbe Klasse: die Zahl maß etwas anderes als der Satz behauptete.**

**Offen, benannt statt erfunden:** Vorrichtung **06 (Würfel gegen Würfel)** ist **nicht gebaut** —
das Spiel läuft mit einem Würfel; sie steht als offene Zeile in `runFixtures().offen`.
**Bekannte Grenze:** Ecke gegen Kante (Modell §7), gezählt in `stats().kantenLuecke`, in allen
Läufen **0**.

**Als Nächstes** (SSOT §14, Reihenfolge unverändert): der Körper an das Feld hängen
(`makeGridWorld`), dann die Sichtschicht mit Stauchen und Strecken **als Kind**, dann der Schatten
am Kontaktpunkt. Kein Stilelement vor der Abnahme der neutralen Physik im Bild.

---

## V4-S4 · DER HELLE SAUM IST DIE VARIANZ-SCHATTENKARTE — GEBAUT

**Datum:** 05.09.2026 · **Geändert:** EINE Zeile im Wirt (`KFB Boxel Blitz v4.dc.html`, direkt
nach `createStage`) · **Rückweg:** die Zeile löschen, dann gilt wieder VSM aus `stage.v1.js`.

**Georg 05.09., zum vierten Mal:** »der komplette schatten der boxel zeigt den hellen saum! das
habe ich schon 3mal gescreenshottet! warum siehst du das auf deinen screenshots nicht selbst…?«

**Die Antwort auf die dritte Frage steht am Anfang, weil sie die Ursache der drei verlorenen Runden
ist:** mein Bild ist **630 Punkte breit**, seines ist es in echter Auflösung. Ein Saum von zwei
Bildpunkten überlebt diese Verkleinerung nicht. Und meine Messungen davor haben die **Helligkeit
auf Flächen** abgetastet, in Schritten von 0,05 bis 0,08 Karteneinheiten — **gröber als der
Gegenstand**. Ich habe dreimal nach der falschen Größe gesucht: nach einer Fläche, während er einen
**Umriss** meldete.

**→ NEUE HAUSREGEL: wer eine KANTE sucht, darf nicht in FLÄCHEN messen — und nicht in einem
verkleinerten Bild.** Ein Merkmal, das schmaler ist als der Messschritt oder als ein Bildpunkt der
Verkleinerung, existiert in der Messung nicht. Am Ende dieser Scheibe steht deshalb ein
**dreifach vergrößerter Ausschnitt in nativen Punkten, im Bild übereinander gelegt** (VSM oben,
PCFSoft unten) — darauf ist der Saum auch für mich sichtbar. Das Werkzeug dafür ist zehn Zeilen und
hätte in Runde eins dagestanden.

**Die Ursache:** `stage.v1.js` Z. 69 setzt die **Varianz-Schattenkarte** (VSM). Sie speichert
Mittelwert und Streuung der Tiefe und schätzt daraus den Schattenanteil. An einer Kante ist die
Streuung groß, die Schätzung fällt zu hell aus — **Lichtausbluten**, ein heller Streifen entlang des
GANZEN Umrisses. Kein Fehler im Bau: der bekannte Preis des Verfahrens.

**Der Regler wurde einzeln gedreht und danach zurückgestellt** (260 Silhouettenkanten):

| Einstellung | Saum-Stellen | Mittel | Höchstwert |
|---|---|---|---|
| **VSM radius 3** (Stand v3) | **52 %** | **+4,9** | **+87** |
| VSM radius 1 | 21 % | −9,0 | 64 |
| **PCFSoft radius 3** | **21 %** | **−9,2** | 64 |
| PCF radius 3 | 26 % | −8,6 | 65 |
| *zurück auf VSM r3* | *52 %* | *+4,9* | *+87* |

Die letzte Zeile ist die wichtige: **der Beweis ist umkehrbar** und der Zustand wiederhergestellt.

**Beziffert, wie stark VSM ausblutet** — gemessen auf genau den Bildpunkten, an denen sich die
beiden Verfahren unterscheiden (34.540 Punkte):

- **87 %** davon liegen **im Schatten** (nicht daneben) — es ist Ausbluten, kein Versatz
- VSM ist an **81 %** heller, im Mittel **+8,8**, im Höchstfall **+52** Graustufen
- an den schlimmsten Stellen liefert VSM **gar keinen Schatten**: 156 Graustufen, bei **157** mit
  ausgeschaltetem Licht — PCFSoft dunkelt dieselben Punkte auf **103** ab
- sie liegen bei y 460…488 im Bild: **genau in Georgs Rechteck**

**Abnahme:** Rauschboden **0** Punkte (zweimal dasselbe Bild) · grobe Gegenprobe (Schatten aus)
**218.263** Punkte · Typwechsel **38.552** Punkte · derselbe Typ zweimal **0** · Schatten kommt an:
**249** Stellen, Mittel **51,2** Graustufen · Feld **83/84** · Gesichter **3** · Zeichenaufrufe
**48** (unverändert) · Dreiecke 81.614.

**⚠ ES IST EIN TAUSCH, GEGEN EINEN ALTEN BEFUND — und der Rest gehört Georg.** Der Kopf von
`stage.v1.js` begründet VSM mit »PCF liefert eine harte Kante, und eine harte Kante liest als
PLATTE, nicht als Schatten« (aus `recherchi-v4`). Bei PCFSoft macht `radius` **nichts** — gemessen
sind r3 und r6 Bild für Bild identisch —, die Weichheit kommt allein aus der Auflösung der Karte.
Der Saum ist weg, die Kante wird härter. **Welcher der beiden Fehler der kleinere ist, ist eine
Look-Entscheidung**; darum steht die Zeile im Wirt der v4 und nicht in der gemeinsamen Bühne, die
auch der v1 und der v3 gehört (dieselbe Naht wie beim Belichtungswert in V2-S7b).

**⚠ UND EINE ZWEITE ABNAHMEZAHL, DIE FALSCH GEBAUT WAR:** meine erste Abnahme nach dem Einbau gab
für VSM und PCFSoft **auf die Stelle gleiche Zahlen** — und das habe ich als »taubes Messgerät«
erkannt, statt es als Ergebnis zu melden. Die Kalibrierung fand den Grund: das Saum-Maß suchte im
neuen Zustand an Stellen, an denen keine Schattenkante liegt (200 statt 42 Treffer im Filter). Das
ist in dieser Baustelle die **dritte** falsch gebaute Abnahmezahl (V2-S7 Stückzahl statt Verhältnis,
V4-S3 Momentanwert statt Uhr). **Regel, die daraus folgt: eine Abnahmezahl, die vom Zustand des
Spiels abhängt, braucht ihre Kalibrierung IM SELBEN Aufruf** — Rauschboden, grobe Gegenprobe,
Nullprobe. Drei Zeilen, die drei Runden sparen.

**Vorher/nachher steht als Bild in `captures/boxelblitz-v4/` — nicht** als Datei: der Vergleich
wurde im laufenden Fenster überlagert, abgelichtet und wieder entfernt (`__kfbSaumVergleich`).
Wiederherstellbar in einem Aufruf.

---

## V4-S3 · DAS SCHWARZE SPIELFELD WAR MEIN MESSWERKZEUG

**Datum:** 05.09.2026 · **Geändert:** `_loop()` im Wirt, zwei Zeilen · **Rückweg:** keiner nötig,
der Zustand davor war defekt.

**Georg 05.09.:** »shader lädt teilweise, spielfeld nicht… gerade ist das game layer schwarz…?«

**Gemessen, nicht geraten:** `phase deal · pt 0 · Zellen 0 · Zeichenaufrufe 11`, Leinwand vorhanden,
**Kontext nicht verloren**, 16 sichtbare Netze, keine Fehlermeldung. Ein Bau, der zwei Bilder
gerechnet hat und dann stehen blieb — also kein Ladefehler und kein Shader.

**Die Ursache ist die Änderung aus V4-S1, mein Handbetrieb:** `requestAnimationFrame` **übergibt
seinem Rückruf einen Zeitstempel**. Ich hatte `step` direkt angemeldet, und `step` unterscheidet
Handbetrieb von Bildschleife daran, **ob ein Argument da ist**. Ab dem zweiten Bild kam also eine
Zahl an, der Zweig »von Hand« griff — und der meldet das nächste Bild absichtlich **nicht** an. Das
Spiel stand nach zwei Bildern, das Feld wurde nie gefüllt, die Fläche blieb schwarz.

**Behoben:** der Rückruf des Browsers und der Handbetrieb sind jetzt **getrennt** — `frame()`
verwirft den Zeitstempel und meldet das nächste Bild an, `step(dt)` ist der Handbetrieb. Ohne
Argument verhält sich alles wie in der v3.

**Abnahme über 5,6 s echte Zeit** (das Kriterium, das den Defekt sieht: er hielt nach zwei Bildern):

| Kriterium | Ergebnis |
|---|---|
| Uhr über 5,6 s | 1,27 → **6,18** (läuft mit) |
| Phase | `deal` → **`play`** |
| Feld | 0 → **84 Zellen, 83 sitzen** |
| Gesichter | **3 / 3 Farben / Farbregel ok**, Zellen 9:1 · 6:3 · 3:3 (gestreut) |
| Bild | Feld, Gutter, Karte, Würfel **sichtbar** (Screenshot) |
| Zeichenaufrufe | **48** |

**⚠ Und eine falsch gebaute Abnahmezahl gleich dazu:** ich hatte »Zeichenaufrufe wachsen« als
Beweis für die laufende Schleife genommen und bekam **»STEHT«** bei gesundem Bild — `calls` ist ein
**Momentanwert je Bild**, kein Zähler. Zum zweiten Mal in dieser Baustelle eine Abnahmezahl, die
etwas anderes messe als sie behauptet (V2-S7: Stückzahl statt Verhältnis). **Wer eine Uhr braucht,
liest die Uhr.**

**Zwei Regeln, die diese Runde bezahlt hat:**
1. **Ein Messwerkzeug, das den Antrieb anfasst, muss den Antrieb getrennt halten.** Ein Zweig, der
   »von Hand« an einem Argument erkennt, kollidiert mit jedem Aufrufer, der von selbst Argumente
   mitschickt.
2. **Das Werkzeug vor dem Gegenstand heißt nicht: das Werkzeug ohne Abnahme.** V4-S1 hat den
   Handbetrieb im verborgenen Fenster kalibriert — und genau dort läuft die Bildschleife nie, also
   konnte die Kalibrierung den Fehler per Konstruktion nicht sehen. **Ein Werkzeug ist erst
   abgenommen, wenn es im sichtbaren Fenster geprüft ist.**

---

## V4-S2 · DIE AUGEN LAGEN AN EINER FESTEN SAAT — GEORGS BEFUND WAR RICHTIG

**Datum:** 05.09.2026 · **Geändert:** drei Stellen im Wirt (`KFB Boxel Blitz v4.dc.html`) ·
**Rückweg:** `faces.build(this.rng)` in der Phasenschaltung.

**Georg 05.09.:** »die drei augen-boxel scheinen bevorzugte positionen zu haben? es scheint nicht so,
als würden sie zufällig platziert…?«

**Er hat recht — und die Ursache war NICHT die Auswahl.** Zwei getrennte Messungen, beide am Weg,
den das Spiel nimmt (`faces.build`, nicht über eine Hintertür):

| Frage | Messung | Ergebnis |
|---|---|---|
| **Wählt der Algorithmus gleichmäßig?** | 200 Läufe mit unabhängigen Saaten auf demselben Feld | **ja**: alle **50** in Frage kommenden Zellen getroffen, häufigste 18, seltenste 5 bei 12 erwartet, **Chi-Quadrat 57,7 bei 49 Freiheitsgraden** (unauffällig). Die Randspalten liegen leicht vorn (68/71 gegen 60), weil dort die Nachbar-Sperre seltener greift — kein Befund |
| **Ist die Quelle je Runde neu?** | dreimal neu geladen, erste Runde abgelesen | **nein**: erstes Augenpaar **7:5 · 7:5 · 7:5**, zweites **4:3 · 5:1 · 4:3** — während Palette und Feld bei jedem Laden eine neue Zufallssaat bekamen |

**Der Mechanismus in einem Satz:** die Gesichter zogen aus dem **gemeinsamen** Generator des Wirts,
und der steht auf einer **festen** Saat (`0xb07e11`); bis zum Setzen der Gesichter werden bei jedem
Laden gleich viele Zahlen daraus verbraucht — also fällt das erste Paar zwangsläufig auf dieselbe
Zelle. Palette und Feld hatten ihre eigene Saat schon seit V2-S8, die Gesichter waren übersehen.

**Jetzt:** eigene Saat je Runde, nach demselben Muster — und sie steht in `stats().saat` neben
Palette und Feld, damit eine Runde weiter **wiederholbar** bleibt (Vertrag: determinism seeded).

**Abnahme, die den Defekt sehen kann** (dieselbe Zahl, die vorher rot war):

| Kriterium | vorher | jetzt |
|---|---|---|
| erste Runde nach dem Neuladen, zweimal | 7:5 4:3 2:3 / 7:5 5:1 10:4 | **3:3 4:1 5:2** / **6:5 1:4 2:2** |
| gleiche Saat zweimal | — | **identische Zellen** (wiederholbar) |
| andere Saat | — | **andere Zellen** |
| Gesichter / Farben / Farbregel | 3 / 3 / ok | **3 / 3 / ok** (unverändert) |
| Zeichenaufrufe | 46 | **46** |

**Offen, als eigene Scheibe notiert:** die Nachbar-Sperre bevorzugt die Randspalten des Innenfeldes
minimal (13 % über dem Erwartungswert). Messbar, unter dem Rauschen, und ohne sichtbare Wirkung —
kein Auftrag, nur festgehalten.

---

## V4-S1b · DER SAUM: ZWEI KANDIDATEN GEMESSEN, BEIDE WIDERLEGT — UND EIN NEUER BEFUND

**Datum:** 05.09.2026 · **Gebaut: nichts.** Alle Schalter stehen wieder wie vorher.

Die beiden Kandidaten aus dem v3-Dokument sind gemessen und **fallen aus**:

| Kandidat | Messung | Ergebnis |
|---|---|---|
| (a) **Rand der Fangfläche** — dort, wo der Empfänger endet, endet der Schatten | derselbe Bildpunkt mit und ohne die Fangfläche, 136 Kartenpunkte im Einfallen | die Karte **empfängt**: Mittel **26,5 Graustufen** dunkler, **59 von 136** Punkten über der Schwelle, Höchstwert 82 — der Empfänger arbeitet, auch während des Falls |
| (b) **Peter-Panning** durch den Tiefen-Versatz | Versatz steht auf `bias 0` und `normalBias 0,004`, Karte 2048, Weichzeichnung 3 | kein Anhalt: die Verdunkelung ist da, wo sie hingehört |

**Neuer, gemessener Befund — die Karte hat einen PAPIERRAND rings um das Feld,** und er ist auf der
Lichtseite deutlich heller als das Feld selbst. Das Feld ist gegen das Blatt eingerückt (links und
rechts 0,30 Einheiten, vorn und hinten 0,167); je Seite über 52 bis 69 Punkte gemessen, im
sitzenden Zustand:

| Rand | Helligkeit | Verdunkelung durch die Fangfläche |
|---|---|---|
| **hinten** (obere Kante im Bild) | **162** | **0 von 69** — die Lichtseite, dort fällt kein Schatten hin |
| links | 107 | 0 von 52 |
| rechts | 74 | 9 von 52, Höchstwert 58 |
| vorn | 54 | 23 von 69 |
| *das Feld selbst (Deckflächen)* | *122* | — |

Damit steht **hinten ein Streifen mit 162 gegen 122 des Feldes** — 40 Graustufen heller, direkt an
der Feldkante, und beim Einfallen liegt das ganze Blatt frei, also wird der Effekt größer. Das ist
der wahrscheinlichste Kandidat, aber **es ist nicht bewiesen, dass Georg diesen Streifen meint** —
sein Wort war »unter« der Feldkante, und *unten* im Bild ist der Rand mit 54 der **dunkelste**.

**Darum geht die Frage zurück, mit benannten Optionen** — statt zu bauen. Eine dritte Erklärung
ohne seinen Bildpunkt wäre geraten (Hausregel 10: nach zwei gescheiterten Erklärungen wird gemessen,
welches Objekt an dem Bildpunkt liegt, den man SIEHT — und den kennt nur er).

---

## V4-S1 · DER HANDBETRIEB DER BILDSCHLEIFE — DAS WERKZEUG VOR DEM GEGENSTAND

**Datum:** 05.09.2026 · **Geändert:** `_loop()` und der Messgriff im Wirt · **Rückweg:** ohne
Argument verhält sich alles wie vorher; `tick` ist additiv.

**Erste Handlung dieser Baustelle war eine Messung — und sie ging nicht.** Georgs Vorschaufenster
meldete `document.hidden true`, und damit stand die Bildschleife: **Uhr auf 0, Feld mit 0 Zellen,
ein Zeichenaufruf**. Das ist die Hausregel 8, in diesem Projekt zum **vierten** Mal bezahlt — und
solange sie jedes Mal mit einem Notbehelf umgangen wird, wird sie ein fünftes Mal bezahlt.

**Also zuerst das Messgerät:** `__kfbBoxelBall.tick(n, dt)` treibt **dieselbe** Schrittfunktion, die
das Spiel benutzt, mit gesetzter Schrittweite — keine zweite Wahrheit, keine Hintertür, und am Ende
jedes Schritts steht der Zeichenaufruf, das Bild ist nach dem Ruf also wirklich neu.

**Kalibrierung vor der ersten Messung** (Regel des Prüfwerkzeugs: weicht sie ab, ist das Gerät
falsch und nicht das Ergebnis): vor dem Handbetrieb `Zellen 0 · Zeichenaufrufe 1`, nach 30
Schritten `Zeichenaufrufe 18`, nach 130 Schritten **84 von 84 Zellen sitzen**, `phase intro`,
Gesichter gebaut. Damit ist jede folgende Zahl dieser Sitzung eine Messung am laufenden Bild und
keine Aussage über das Fenster.

**⚠ Was der Handbetrieb NICHT kann:** er treibt keine Netzanfragen. Direkt nach dem Neuladen steht
der Wirt in `phase boot` und wartet auf den Kartenvorrat — 1500 Handschritte ändern daran nichts.
Wer nach einem Neuladen messen will, wartet **einmal** echte Zeit ab und tickt danach.

---

## V4-S0b · BEFUND ZUR LIEFERUNG `fx-foundation` (Coworker)

**Datum:** 05.09.2026 · **Gebaut: nichts.** Gelesen: `README.md`, `fx-pool.v1.js`,
`dissolve.v1.js` und `reference-manifest.js` (die Protokollbilder und die Fixture-Seiten liegen
daneben, ungeprüft — sie sind der Beleg des Lieferanten, nicht unsere Abnahme).

**Urteil: annehmen.** Die Lieferung hält sich an die Bestellung, und zwar an die unbequemen Teile:
Zeitbasis von außen, geseeteter Zufall, fremde Maße als **Funktion** statt als Wert, ein Deckel der
sich meldet, Helligkeit als Ausblender (weil additiv Schwarz das Nichts ist), Matrix im ersten Bild.
Das sind genau die sechs Fallen, die diese Baustelle bezahlt hat.

**Vier Dinge, die sie besser gemacht hat als bestellt:**
1. **Eine Sackgasse mit Zahl benannt** statt still nachgebaut: `wawa-vfx` lädt und konstruiert
   fehlerfrei und erzeugt **null Bildpunkte** — zwei Anläufe, kein dritter. Genau die geforderte
   Form eines Ergebnisses.
2. **Gegen BEIDE three-Fassungen gemessen** (0.160 und 0.185.1), obwohl die Bestellung nur 0.160
   nannte. Damit ist der Versionssprung keine Eintrittskarte mehr, sondern eine freie Entscheidung.
3. **Ein Befund zurück an unseren Bestand:** `boxelblitz-v3/speedlines.v1.js` setzt `transparent`
   zusammen mit `DoubleSide` — das kostet **zwei** Zeichenaufrufe, während der Dateikopf »EIN
   Zeichenaufruf für alle« behauptet. **Nachgeprüft, die Zeile steht so da** (Z. 65/66). Ein
   Lieferant, der den Auftraggeber korrigiert, ist der richtige Lieferant.
4. **Das Rauschen der Auflösung entsteht prozedural** — keine Textur, keine Lizenzfrage, kein
   Gewicht, und deterministisch als Funktion des Ortes.
5. **Die Auflösung kennt unsere teuerste Fehlerklasse namentlich:** ein Textersatz an einem
   three-Shader-Baustein, der seinen Anker verliert, **meldet sich nicht**. Sie benutzt nur die
   drei Anker, die in `ERHEBUNG_three_sprung.md` gegen beide Fassungen geprüft sind, zählt jeden
   Ersatz — und schreibt ausdrücklich hin, dass der Zähler **nicht** die Abnahme ist, sondern die
   Bildpunktzahl im Verhältnis. Das ist unsere eigene Regel, von außen zurückgegeben.

**Zwei offene Punkte, keine Mängel:**
- `element-crush` und `dusterheim` stehen als **OFFEN** im Manifest, ohne Zahl. Richtig so — eine
  offene Zeile ist besser als eine erfundene.
- Der Vorrat ist ein **Ringpuffer**: der älteste Körper wird verdrängt, nicht der schwächste. Bei
  gestaffelten Trümmern kann das ein Stück mitten im Zerfall abschneiden. `verdraengt` zählt es,
  also fällt es auf — eine Entscheidung für die Einbau-Scheibe, nicht ein Fehler.

**Einbau ist Punkt 3 der Reihenfolge**, nach der Würfelbewegung: die Trümmer hängen am Aufprall, und
der Aufprall wird gerade neu gebaut. Vorher etwas anzuschließen hieße, es zweimal anzuschließen.

---

## V4-S0 · FORK ANGELEGT, NICHTS GEÄNDERT

**Datum:** 05.09.2026 · **Gebaut: nichts.** Der Fork ist byteweise die v3, bis auf den Dateikopf
(Fassung, Stand-Dokument, die vier Punkte der Reihenfolge).

Er existiert, weil die nächsten Scheiben in die **Grundlage** gehen: der Saum ist ein Schattenfehler,
und die Würfelbewegung ist die Ebene, an der alle bewegungsgebundenen Effektlagen hängen (Striche,
Staub, Rollklang, Kamera-Ruck). v3 bleibt als Rückweg stehen: ein Zustand, den Georg gesehen und
beurteilt hat, wird nicht überschrieben.

**Erste Handlung in dieser Baustelle:** der Saum. Zwei Kandidaten stehen benannt im v3-Dokument
(Rand der Fangfläche gegen Peter-Panning einer fallenden Zelle); die Messung entscheidet, nicht die
Vermutung.
