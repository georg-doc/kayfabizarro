# CHANGELOG — KFB Pet Studio

**Additiv geführt.** Neuer Eintrag oben, alte bleiben unverändert. Ein falscher Befund wird durch
einen **neuen** Eintrag korrigiert, nicht überschrieben — der teuerste Fehler der v5.1-Nacht war ein
Changelog, der dreimal etwas behauptete, was der Code nicht tat.

---

## V9-S2 · 2026-08-29 (WS1) — Re-Home nach WS0: eine Datei, zwei Texturen, eine neue Hausregel

**Kein Bau, eine Prüfung.** Das Paket `pet-studio-v9_2026-08-28_ws0-rehome` (67 Dateien, 11,46 MB)
ist bei WS0 angekommen und liegt im Repo unter
`skills/KFB PetStudio/KFB Pet Studio v9/pet-studio-v9_2026-08-28_ws0-rehome/`. WS0 meldete drei
Dinge: eine fehlende Vertragsdatei, eine fleckige Oberfläche, und eine Zähldifferenz 66 gegen 67.
Alle drei sind jetzt gemessen — und die Zuschreibung des ersten Punktes war falsch.

### Die Zähldifferenz: eine Datei liegt nur im Zip

Repo-Listing: **66 von 66**. Zip: **67**. Die fehlende ist `KFB Pet Studio v9 - standalone.html`
(5,1 MB) — repoweite Suche nach »standalone« findet nur das SESSION_LIVING-Standalone
(310.763 B). WS0s Ersatzvermutung (»das Zip zählt seinen Beipackzettel mit«) trifft nicht:
`MANIFEST_v9_rehome.md` (4.429 B) liegt im Repo. Vermutlich am Upload-Gewicht gescheitert.
Folge ist klein: das Studio-Standalone ist die Ansehen-Datei, nicht die Arbeitsdatei.

### Die Vertragsdatei fehlte nicht — der Abruf war zu flach

`studio-v3/PET_EDITOR/pet-LIBRARY.json` liegt im Paket **und** im Repo: **20.922 Bytes**,
`@26b659d3220d`, namentlich gelistet in `MANIFEST_v9_rehome.md`. Was gefehlt hat, ist nicht die
Datei, sondern ihre **Adresse in einer Verzeichnisabfrage mit Tiefe 1**: die sieht `studio-v3/`
und nicht `studio-v3/PET_EDITOR/`. Damit ist der Befund »eine Datei fehlte, das Paket war nicht
1:1« zurückzunehmen: **das Paket war 1:1, der Abruf war es nicht.**

### Was ohne die Datei ausfällt — jetzt mit Adresse statt Vermutung

WS0s Beleg ist methodisch richtig (eine **Differenz**: zwei Texturanfragen, die vorher nie
kamen), und die zwei Anfragen haben eine Herkunft. In `pet-LIBRARY.json` stehen genau zwei
Bildquellen:

| Feld | Wert | wofür |
|---|---|---|
| `skinBase` | `…/media/3D_Assets/pets/skins/` | die Papier-/Skin-Basis (Tint) |
| `material.presets.clay.detail` → `detailMaps.fingerprint.base` | `…/media/3D_Assets/Textures/fingerprints_01/`, default `fp002` | der Fingerprint als Bump |

Dazu aus derselben Datei: `material.presets.clay` (`projection: triplanar`,
`detailStrength 0.2`, `roughness 0.85`, `ao`, `jitter`), der Block `eyeRig`
(`anchorDefault`, `pupilSize`, `inset`, `lidFit`, `eyelidColor`, `pupilStyles`, `gloss`, `blink`)
und `ground` (`textured-3d-tile`, `material: match-pet`). Ohne die Datei greift ein Material
**ohne Bildquelle** — triplanar mit `jitter`, und das ist die fleckige Oberfläche. Ohren und Augen
liefen im selben Bild auf Rückfallwerten. *Ein Rückfallwert im Bericht ist ein Befund, keine Zahl*
(R14, hier zum zweiten Mal).

**Offen bei WS0:** eine Zahl widerspricht dem glatten Bild noch. Prüfvorschlag, nicht Urteil:
`detailStrength 0.2` + `jitter: true` bedeuten, dass der Bump **absichtlich** moduliert — ein
Streuungsmaß darf hier hoch stehen. Also gegen `detailStrength 0` gegenmessen, Differenz desselben
Pixels mit und ohne, kein Absolutwert (R5).

### WS0s Vermerk zur falschen Prüfstelle: bestätigt

v9 hält `const LIB_URL = './studio-v3/PET_EDITOR/pet-LIBRARY.json'` — **seitenrelativ**, nicht
modulrelativ. Eine Prüfung, die modulrelativ auflöst, meldet »fehlt« für eine Datei, die da ist.

### R16 · Anwesenheit im Repo ist keine Anwesenheit im Arbeitsplatz

Die Schwesterregel zu **R1** (»ein Import-Check prüft Gleichheit, nie Anwesenheit«), diesmal von
der anderen Seite. R1 hat den Absender belehrt, R16 den Empfänger:

> Eine Ordneransicht mit Tiefenbegrenzung ist keine Vollständigkeitsprüfung. Vollständig ist ein
> Ladeweg erst, wenn **jede relative Adresse aus jeder Quelldatei aufgelöst** wurde — und die
> Prüfung löst **seitenrelativ** auf, weil die Seite lädt, nicht das Modul.

Gebaut statt notiert: **`tools/check-loadpath.mjs`** liegt ab jetzt in jedem Sitzungsschnitt.
Es liest jede `.js`/`.mjs`/`.html`/`.json` des Ordners, löst jede relative Adresse gegen das
Dateisystem auf, vergleicht gegen den mitgelieferten Sollstand `LADEWEG.tsv` (Pfad · Bytes ·
sha256-16) und nennt zusätzlich die Dateien, die **von niemandem adressiert** werden. Exit-Code 0
oder 1, damit es als Haken taugt. Gemessen im Paket: **48 Referenzen aus 20 Quelldateien, 0
fehlend** — dieselbe Zahl, die ich vor dem Packen von Hand erhoben hatte, jetzt in einer Zeile
wiederholbar. *Eine notierte Regel ist keine gezogene* (R14) — deshalb ein Skript und keine
Fußnote.

**Nummernhygiene:** R14 und R15 sind in V9-S1 belegt, R1–R13 in
`docs/spinballcast-v3/POST_MORTEM_*`. Die neue Regel ist **R16**. Zwei Register in einem Projekt
sind eine Kollisionsquelle; wer die nächste Regel schreibt, zählt in beiden nach.

### Geändert

| Datei | was |
|---|---|
| `tools/check-loadpath.mjs` | **NEU** · Ladewegprüfung, keine Abhängigkeiten, Node ≥ 18 |
| `LADEWEG.tsv` | **NEU** · Sollstand des Pakets: Pfad · Bytes · sha256-16 |
| `README_REHOME_WS0.md` | Nachtrag: die drei Befunde, die Zählung, R16, der Aufruf des Skripts |
| `KFB Pet Studio v9 SESSION_LIVING.dc.html` | R16 im Hausregel-Abschnitt, Nachtrag 29.08. |
| `docs/CHANGELOG_studio.md` | dieser Eintrag |

Kein Byte in `studio-v3/`, `studio-v7/`, `studio-v8/`, `studio-v9/` — die Runde hat **nichts**
am Code des Studios geändert, und das ist die Pointe: der Fehler lag im Verfahren.

---

## V9-S1 · 2026-08-27 (WS1) — Das Pad als Bauteil · Ansatz und Spitze als eigenes Ding

**Auftrag (Georg, Audio-Transkript 27.8., verbatim in Auszügen):** »Pet Studio Version 8 … als
Version 9 … die fehlenden Funktionen verdrahten«, »die ganzen Cube Pads mit den entsprechenden
Emotes … persistent … importieren und exportieren, einzeln oder als Batch«, »jedes Pad hat eine
graue Base, dass diese graue Base den Schatten hält, dass diese graue Base dann auch Empfänger von
AO … ist«, »die ganzen Audio Reactions wenn man das Pad anklickt«, »eine große Baustelle sind noch
die Sprechblasen … die habe ich jetzt aus Verlegenheit mit einer dead outline gemacht«, »siehst du
wie das hier springt und wie die quasi dann jedes Mal neu gerechnet wird«.

**Geforkt:** `KFB Pet Studio v8.dc.html` → `KFB Pet Studio v9.dc.html` (byteidentische Kopie als
Ausgangspunkt, 4086 Z). **v8 bleibt eingefroren** als Vergleichsmaßstab; kein Modul unter
`studio-v7/` oder `studio-v8/` wurde angefasst.

### Die Begriffe, weil zwei Runden an ihnen verloren gingen

Georg hat den Fehler selbst gefunden: **»Pads« war ein Audio-Bug für »Pets«** — und dann hat er den
Begriff neu und breiter besetzt. Was jetzt gilt:

| Wort | Bedeutung |
|---|---|
| **Pad** | alles mit einer Bodenfläche: Pet, Requisite, Klo-Rolli. Das ganze Bauteil. |
| **Base** | die graue Fläche darunter, die den Schatten fängt. |
| **Anker** | Punkte am Pad für Gear: Hüfte, Hand-Entsprechungen, Kopf, Fuß, Mund, Bubble. |
| **Bubble** | Sammelbegriff. Vier Arten: Speech · Thought · Whisper · Scream. |
| **Ansatz** | die zwei Punkte, wo der Pfeil aus der Bubble-Kante wächst. |
| **Spitze** | das dünne Ende, das man zieht. |

Dazu eine Lehre über das Reden, nicht über den Code: **mein Kürzel »S1« war für Georg unlesbar**
(»was ist S1?«). Bauabschnitte heißen im Chat ab jetzt »erster Bauabschnitt«; Kürzel leben im
Changelog, nicht im Gespräch. Und »Füße« war mein Wort für den Bubble-Ansatz — ausgerechnet in der
Runde, in der das Pet echte Füße als Anker bekommt. Ein Wort, zwei Dinge, sofort umbenannt.

### Georgs Festlegungen dieser Runde (Formular + Chat)

| Frage | Entscheidung |
|---|---|
| Was ist ein Pad | das ganze Bauteil als EIN Modul, einhängbar in SpinballCast |
| Ein Pad pro Pet? | **ja, eines**, mit Ankern für Props (»pets haben keine hände«) |
| Wo wohnt die Konfiguration | **im Vertrag** als Block — daraus wurde `pad`, nicht `pet.pad` |
| Bühnen-Blase | Kanon-Feder als Standard, glatte Fassung bleibt als Rückfall |
| Zipfelform | zwei gerade Schenkel, dünn zulaufend (Vorlage 4 von 4) |
| Ansatz beim Ziehen | **bleibt stehen** — nur die Spitze wandert |
| Thought | Lappen rundum, Grundform bleibt klar lesbar |
| Klang | vorhandene Pinball-Bank, Zuordnung je Pad |
| Abnahme-Blatt | nein, im Studio abnehmen |
| Bubble-Verhalten | Ruhezone · träge (»Luftballon an unsichtbarer Schnur«) · Spitze zeigt auf die Modellmitte, ragt nicht hinein · beim Katapult bleibt sie stehen und verpufft |

### Gebaut · `studio-v9/pad-contract.v1.js` (pad-v1.0)

Der Pad-Block, additiv, mit 1-%-Toleranz wie `pet-metrics.writeBody` — sonst ist jedes Laden eine
Änderung und die Entwurfsmarkierung wertlos.

**Sieben Anker, alle gemessen, keiner getippt.** Gemessen wird in **Höhenbändern** (28), nicht an der
Hüllkiste: *eine Kiste ist keine Form* (Lehre aus SpinballCast v1). Hüfte = breiteste Stelle in der
unteren Hälfte, Schulter = breiteste Stelle in der oberen; bei einem Cube-Pet landet die Hüfte damit
an der Würfel-Unterkante und die Schulter an der Oberkante — das ist keine Schwäche der Messung,
das ist die richtige Antwort. Hände liegen **6 % außerhalb** der Silhouette, sonst steckt das Gear
im Körper. Einheit: **Grundform-Höhen (cubeH), Ursprung Fußmitte, +z = Blickrichtung.**

Gemessen am Hasen, erste Fahrt: **7 von 7 Ankern geschrieben**, `[PAD]`-Zeile in der Konsole,
Vertragsfelder in der Sitzung angekommen (der Wächter meldet »30 Felder nur im Entwurf«, davon 15
Pad-Felder — genau der Beleg, dass die Persistenz greift).

**Die cubeH-Gegenprobe ist eingebaut, nicht behauptet.** Das Modul liest `body.cubeH` und **misst**
die Bauhöhe; weichen sie um mehr als 2 % ab, sagt es das im Panel und in der Konsole. Die offene
v9-Frage aus dem Projektkopf (»`byCube` misst, `cubeH` wird gelesen«) ist damit nicht gelöst, aber
sie ist ab jetzt **sichtbar statt still**.

### Gebaut · `studio-v9/pad-base.v1.js` (pbase-v1.0)

Die Base **schmückt** `ground-plane.v1.js`, sie ersetzt sie nicht: kein zweiter Boden, keine zweite
Schattenrechnung, keine zweite Kippzahl. Vier Schichten in einer Ordnung — Platte (0) · Boden-FX (1)
· Kachelkante und Kontaktsaum (1) · Schattenstempel (2).

**Der Saum ist kein Schatten.** Der Stempel sagt, welche *Form* auf dem Boden liegt; der Saum sagt,
wo etwas ihn *berührt*. Zwei Aussagen, zwei Ebenen — deshalb hängt der Saum am gemessenen
Fußradius (`pet.ground.foot`, in v8 gemessen: **0,2599 bei Deckung 41,7 %, 224 Punkte aus 5 Netzen**)
und nicht an der Silhouette.

**Die Kachelkante ist Tusche, keine CAD-Linie:** ein Band zwischen zwei Offsetkurven, Licht oben
links, also unten und rechts satter — dieselbe Bauart wie `paintBubble`. Eckenradius als **Anteil**
der Kante, nie als Pixelzahl. Klick-Ring und Landestaub laufen über `gnd.addFx`, damit alle Ringe im
Haus dieselbe Bauart haben.

### Gebaut · `studio-v9/bubble-tail.v1.js` (tail-v1.0) — die Ursache von Georgs Sprung

**Der Befund, mit Adresse:** in `bubble-shaper.v3.js` ist der Zipfel kein Ding, sondern ein
**Befund**. `shapeForBox` sucht in der Silhouette eine Punktgruppe, die »tief unten und in der
Minderheit« liegt, **ernennt** sie zum Zipfel und verschiebt sie — bei jeder Bewegung neu. Zwei
Rückfallwerte und drei Sonderregeln im Code (»die Minderheiten-Regel lag nur auf der SUCHE, nicht
auf ihrem Rückfall«) sind der Beleg, dass **die Suche selbst der Fehler ist**. Eine Suche kann man
nicht stabilisieren, nur ersetzen.

**Die Ersetzung:** drei eigene Punkte, die im Entwurf stehen. Ansatz A · Ansatz B · Spitze, alle
drei als **Ecke** (`c: true`), in die Kontur **eingehängt** statt daneben gemalt. Damit gilt:

- Ziehen der Spitze ist **eine Zuweisung an zwei Zahlen**. Nichts wird gesucht, nichts kann kippen.
- Die **dünn zulaufende Feinspitze kostet keine Zeile**: `paintBubble` erkennt scharfe Knicke und
  nimmt die Feder dort auf 30 % zurück. Ein zweiter Zeichner wäre eine sichtbare Naht.
- **Ein Pfad, eine Füllung, ein Band** — Papier, Saum, Kantenfase und geschnittene Lücken gelten für
  den Zipfel wie für die Kante.
- `report()` liefert einen **Stempel**, der sich genau dann ändert, wenn sich die Zipfelgeometrie
  ändert. Wer nichts anfasst und den Zähler steigen sieht, hat eine versteckte Neuberechnung
  gefunden — dieselbe Beweisführung wie beim Neuzeichnungs-Zähler der Blasenschicht in v7.

Gemessen an der ersten Fahrt (Speech, »Bingo!«, Entwurfsgröße): Ansatz-Spanne **14,4 px**, Länge
**92,39 px**, Verhältnis **6,416**, Winkel **90,0°**, Kante 11, Spitze `[0.5, 2.9247]`.
`aim()` setzt die Spitze aus einer **Rechnung**: Richtung zur Modellmitte, Länge = Abstand minus
Silhouettenradius minus 8 % Luft. Eine getippte Länge steckt im kleinen Maßstab im Kopf.

### Verdrahtet in v9

- **Neuer Tab »Pad«** mit drei Abschnitten: Anker (messen, schreiben, als Kreuze auf der Bühne
  zeigen) · Base (Saum, Tuschekante, Klick-Ring, Probeschuss) · Audio (vier Ereignisse, je vier
  echte Ids). Die Kreuze tragen **`noMeasure`** — ein unmarkiertes Hilfsobjekt wird mitgemessen, und
  genau das hat in SpinballCast v1 eine Ratsche von +1,018 pro Kartenwechsel erzeugt.
- **Klang** aus `kfb-pinball-sfx.json` (37 Ereignisse, gezählt). Standard: Klick `pop` · Landen
  `banner.land` · Emote `fluff` · Auswahl `ui.select`. **Keine erfundenen Ids** — ein unbekanntes
  Ereignis meldet das Audio-Modul als Fehler und spielt nichts. Geweckt wird im ersten Klick, nicht
  beim Laden: ohne Nutzergeste bleibt jeder AudioContext stumm, und stumm sieht wie kaputt aus.
- **Bild und Klang aus DERSELBEN Aufrufstelle** (`_padFire`): Klick macht Ton und Bodenring, Landen
  macht Ton und Staub. Zwei Aufrufstellen laufen auseinander (Lehre aus `juice.v2.js`).
- **Klick trifft das Modell, nicht die Leinwand** — Strahl aus der Kamera. Ein Klick daneben ist
  keine Reaktion.
- **Zipfel-Werkbank** im Bubbles-Tab, über dem Shaper: Art · Grundform · Wortlaut · Ansatz A/B als
  Regler · Spitze am Zeiger · Aim an/aus. Der Besitzer ist ein **gestrichelter Kreis** — er behauptet
  kein Pet, er behauptet einen Radius, und genau der wird gerechnet.

### Zwei Fallen, in dieser Nacht bezahlt

**R14 · Eine fremde Uhr hat eine fremde Lebensdauer — und eine notierte Regel ist keine gezogene.**
Der Anstoß der Werkbank hing erst an einer eigenen rAF-Schleife (tickte **einmal**, dann Stille),
dann an der Bildschleife des Studios — und die läuft in der Vorschau nicht durchgehend: `_gndTick`
stand nach einer Sekunde noch auf **0**. Die Abnahme hat danach den Rest gefunden, und er war die
eigentliche Lehre: der Ersatz-Takt saß **hinter dem Riegel `_tWired`**, wurde also genau einmal
bewaffnet und war nach einem `componentWillUnmount` für immer fort; dazu sind Zeitgeber in diesem
Rahmen gedrosselt (gemessen: **1 Tick in 800 ms** statt ~6). Ergebnis: 0 gezeichnete Pixel auf allen
fünf Leinwänden bei frischem Laden, während der Zeichner selbst korrekt war.

Die Regel steht jetzt als **drei** Wege, nicht als einer: ein **idempotenter** Takt (`_armBeat`, nie
hinter einem Riegel, 120 ms, zeichnet nur bei Änderung) · ein **direkter Anstoß** bei jeder
Zustandsänderung (`setTimeout 0`) · und ein **Termin aus dem Render**, solange noch nichts gezeichnet
ist — sichtbar heißt gerendert, und der Render ist das eine, was sicher passiert. Kein Zeichnen im
Render, nur ein Termin dafür. Abnahme nach dem Fix, frisches Laden ohne Klick: **Zeichnungen 1 ·
Geometrie-Änderungen 1**, Spanne 14,4 px · Länge 48,47 px · Verhältnis 3,366 · Winkel 90,0°.

Dieselbe Ursache traf die Base: ohne laufende Bildschleife stand die Kachelkante auf Skalierung
**1 statt 2,5** und der Fußradius auf dem **Rückfallwert 0,25 statt 0,2599** — die Zahl aus dem
Vertrag kam nie an. `_padBeat()` läuft jetzt aus der Bildschleife *und* dem eigenen Takt *und* direkt
nach jedem Anlass (Erzeugen, Messen, Regler, Pet-Wechsel, Tab-Wechsel). Gemessen danach:
Saum-Skalierung **1,306**, Tuschekante **2,500**, Fußradius **0,4213** (= 0,2599 × Bühnenmaßstab).
**Ein Rückfallwert im Bericht ist ein Befund, keine Zahl.**

**R15 · Eine Vorschau, die nicht neu geladen hat, beweist nichts.** Drei Messrunden liefen gegen
eine **alte Fassung** des Codes: `typeof _tailBeat` war `undefined`, obwohl die Methode in der Datei
stand. Der Beweis dafür kostet eine Zeile (`String(this.animate).indexOf('_tailBeat')`), das
Nichtwissen kostete drei Runden. **Vor jeder Messung prüfen, ob der gemessene Code der geschriebene
ist** — die Schwesterregel zu R1 (»Anwesenheit ist keine Gleichheit«).

### Drei Befunde der Abnahme, behoben

**Ein Regler, der sich bewegt und nichts tut.** Der Art-Schalter (speech/whisper/scream/thought)
wirkte nach dem ersten Zug an der Spitze nicht mehr: `ensureTail` spreizt
`{ ...Vorgabe, ...gespeichert }`, und sobald ein gezogener Zipfel in `v9tail.tail` lag, überschrieb er
die Art-Vorgaben **für immer** — die Fußzeile meldete für alle drei Arten dieselbe Spanne 14,4 px.
Jetzt gilt: **Art wechseln heißt Grundstellung** (der gespeicherte Zipfel wird verworfen),
**Grundform wechseln nicht** (die Kante ändert sich, nicht die Absicht des Zipfels). Gemessen nach
dem Fix: Zug → Länge 93,88 px bei 54,9°; danach `scream` → **Spanne 9,81 · Länge 64,78 ·
Verhältnis 6,803**, Ansätze 0,458/0,542. Die Vorgaben kommen an.

**Thought bot einen Zipfel an, den es laut eigener Festlegung nicht hat.** `TAIL_KIND.thought` ist
absichtlich `null` — Thought trägt eine **Spur**, nicht Ansatz und Spitze. Der Chip zeichnete
trotzdem eine vollständige Speech-Silhouette mit beiden Anfassern und meldete Spanne, Länge und
Winkel. Jetzt wird für Thought nichts eingehängt, nichts angefasst, und die Werkbank sagt es:
»kein Zipfel — Thought trägt eine Spur, und die ist noch nicht gebaut«. Foot- und Aim-Bedienelemente
verschwinden. **Ein Bedienelement, das ein wissentlich falsches Bild erzeugt, ist schlimmer als ein
fehlendes.**

**Ein Rand ohne Fläche ist eine Behauptung.** Die Tuschekante wurde gezeichnet, während ihre Platte
auf `invisible` stand (Studio-Standard seit v5) — ein herrenloser schwarzer Rahmen auf dem Nichts,
**2,98 × des Fußdurchmessers**, quer über die Bühne. Georg hat eine *graue Base* bestellt, die den
Schatten hält; gerendert wurde eine unsichtbare Base mit schwarzem Rahmen. Die Kante hängt jetzt an
der Sichtbarkeit der Platte, und der Schalter dafür steht dort, wo die Base bedient wird (Pad-Tab,
»Show the base plate«). Der Kontaktsaum saß richtig — er hängt am Fuß, nicht an der Kachel.

### Ein vierter Befund, und er traf die Zusage des Moduls selbst

**Der Ansatz lag auf einem Segment statt auf der Silhouette.** `edgeIndex()` wählte *eine* Kante (die
mit der größten mittleren Höhe) und `onEdge()` parametrisierte **beide** Ansätze darauf. Auf einem
Rechteck stimmt das; auf dem 16-Punkt-Oval spannt das unterste Segment nur ~45,5…61,7 px der 90 px
Breite — also fielen alle Anteile in dieses Fenster. Gemessen in der Abnahme:

| `a`/`b` | rect · Spanne | round · Spanne (alt) |
|---|---|---|
| 0,10 / 0,90 | 70,16 | **16,28** |
| 0,30 / 0,70 | 36,00 | **16,28** ← identisch zur Zeile darüber |
| 0,42 / 0,58 | 14,40 | **6,72** |

Der halbe Reglerweg war damit tot, `B.x` klebte über den ganzen Weg auf 45,5, und der Art-Standard
`speech span 0.16` lieferte auf `round` weniger als die Hälfte der beabsichtigten Spanne. Die Zusage
im Modulkopf — »`a`, `b` = Anteil der Kantenlänge« — war für gekrümmte Formen **still unwahr**: genau
die Sorte Falschaussage, die dieser Umbau abschaffen sollte. *Ein Regler, der sich über die Hälfte
seines Wegs nicht auswirkt, ist kein Regler.*

**Eine Änderung, an der Ursache:** der Ansatz wird an der **unteren Silhouette** aufgelöst statt auf
einem Segment. Für eine gewünschte x-Lage läuft `crossLowest()` die ganze Kontur ab und nimmt die
**tiefste** Kreuzung mit der Senkrechten; die beiden Ansätze dürfen auf **verschiedenen** Segmenten
liegen. `splice()` ersetzt dann den **Bogen zwischen ihnen** durch die Spitze, statt drei Punkte in
ein Segment zu schieben — welcher der zwei möglichen Bögen der untere ist, wird an der Tiefe seiner
Zwischenpunkte **gemessen** (`arcDepth`), nicht aus der Reihenfolge der Namen geraten. Ein leerer
Bogen ist der Rechteck-Fall und braucht keine Sonderregel.

Abnahme nach dem Fix, dieselbe Blase (90 × 48 px), nur Form gewechselt — beide Spalten sind jetzt
**gleich**, symmetrisch um 45, und auf `round` liegen die Füße erwartungsgemäß auf verschiedenen
Segmenten:

| `a`/`b` | rect · A/B · Spanne | round · A/B · Spanne | round · Segmente |
|---|---|---|---|
| 0,10 / 0,90 | 9,0 / 81,0 · **72,0** | 9,0 / 81,0 · **72,0** | 5 → 10 |
| 0,30 / 0,70 | 27,0 / 63,0 · **36,0** | 27,0 / 63,0 · **36,0** | 6 → 9 |
| 0,42 / 0,58 | 37,8 / 52,2 · **14,4** | 37,8 / 52,2 · **14,4** | 7 → 8 |
| 0,46 / 0,54 | — | 41,4 / 48,6 · **7,2** | 7 → 8 |

### Offen, in dieser Reihenfolge

1. **Zacken für Scream.** `edge-treatment.v1.js` baut sie längst (Zacken + langer schmaler Zipfel,
   »lang heißt schmal«) — sie hängen nur nicht am Bild. Verkabelung, kein Neubau.
2. **Thought:** Lappen rundum bei lesbarer Grundform, plus **Spur** aus 2–3 kleiner werdenden
   Kreisen. Ansatz und Spitze gelten hier nicht — Thought hat keine.
3. **Verpuffen** ohne Fade: die geschnittenen Lücken wachsen auf Bogenlänge, bis die Linie aufgehört
   hat zu sein; das Papier fällt kippend nach; die Spitze zieht sich **vorher** ein (sie hat kein
   Ziel mehr). Drei Zahlen, kein neuer Mechanismus.
4. **Bühnen-Blase auf den Kanon-Zeichner** umhängen, glatte Fassung als Umschalter behalten
   (Georgs Entscheidung). Heute malt die Bühne noch ihre eigene Outline mit `dead: 44`.
5. **Der Zipfel auf der Bühne** — dieselbe Ersetzung wie in der Werkbank, dort sitzt Georgs Sprung
   im echten Bild.
6. **Import/Export einzeln + Batch** gegen den neuen Block nachprüfen (der Wächter meldet die
   Pad-Felder korrekt; der Weg über Datei ist noch nicht gemessen).
7. **Blickachse auf die Anker drehen** (`body.faceDir` wird gemessen, aber nicht angewendet). Eine
   Achse drehen, ohne sie abzunehmen, ist die Falle aus dem Travel-Cut.
8. **Rückläufer ins Repo** — unverändert offen aus V8-A, und die drei v9-Module kommen dazu.



**Auftrag (verbatim, Georg):** »KFB Pet Studio v7 → v8 — Verträge geradeziehen. danach ausbau und
optimierung. ziel: verwendung in KFB Pet SpinballCast v1 → v2 → v3.«

**Geforkt:** `KFB Pet Studio v7.dc.html` → `KFB Pet Studio v8.dc.html` (3979 Z, byteidentische
Kopie als Ausgangspunkt). v7 bleibt als Vergleichsmaßstab liegen.

### Zuerst gezählt, dann gebaut (S1)

Die Backlog-Frage war »welche Fassung liegt im Repo, und welche Felder hat sie gegenüber v1.2.7
weniger?«. Antwort, Feld für Feld und nicht nach Versionsnummer:

| | lokal `studio-v3/kfb-pets.json` | Repo `media/3D_Assets/kfb-pets.json` |
|---|---|---|
| Version | 1.2.7 | **1.2.8** |
| Pets | 24 | 24 |
| Blattfelder, die dem Repo fehlen | — | **0** |
| neue Blattfelder je Pet | — | 22 (gemessene `body`-Blöcke bei `bunny`/`penguin`) |
| neue globale Felder | — | ~40 (`face.eyeShell`, `eyeRig.*`, `material.presets.clay`) |
| `pig` · `beaver` · `bee` | 40 · 40 · 37 | **40 · 40 · 37** |
| Bytes | 36 418 | 44 218 |

**Das Repo ist der reichere Stand.** Die Sorge »im Repo liegt 1.2.6, Repo-zuerst wäre ein Downgrade«
ist damit von gestern. Genau **drei** Werte weichen ab, alle `penguin`:
`eye.anchor.ring` 0,300 → **0,245** · `mouth.size` 0,80 → **0,78** · `mouth.sx` 1,00 → **1,10**.
Das ist Georgs Feinarbeit im Repo.

**S2 und S3 waren nicht offen.** `studio-v7/pet-session.v1.js` (`ses-v1.0`) trägt sie seit dem 25.8.
als Code: `union()` mit Bericht, `leafCount()`, `buildExport()` mit `meta.petVersions`/`leafCounts`,
`planImport()`/`applyImport()` mit Entscheidung je Pet, `selfTest()` mit fünf Prüfungen. Der Backlog
war Theorie, der Build war weiter — Regel 1. Nicht angefasst.

### Was wirklich krumm war (die Naht dieser Runde)

**1 · Der Spiegel gewann.** v7 lud Repo **und** lokale Datei und vereinigte sie in der Reihenfolge
alt → neu; also gewann die *lokale* Kopie auf jedem Feld, das sie definiert, und drehte die drei
Pinguin-Werte bei jedem Start zurück. Richtig, solange im Repo 1.2.6 lag; heute falsch.
**Jetzt:** kanonisch ist die Quelle, die lokale Datei ist Rückweg bei fehlendem Netz — keine
Mischlage. Sichtbar im Panel: *»Contract source this session: repo (kanonisch)«*.

**2 · Der Vertrag sagte das Gegenteil von Georgs Modell.** Das Vertragsblatt in v7 schloss mit
»was der ZONE gehört: die Platte« — Georgs Satz 1 heißt »jedes pet hat eine ground plane«. Beides
ist richtig, weil es **zwei Dinge** sind, die einen Namen teilten:

- **Fußboden** — einer je Zone, sagt wo unten ist (Physik). `studio-v7/ground-plane.v1.js`.
- **Messfläche** — eine je Pet, trägt Maßstab, Blasengröße, Schattenempfang und Kippung. Das ist
  derselbe Gegenstand, den v5 `token` nannte, nur ohne seine vier Aufgaben.

**Neu: `studio-v8/ground-contract.v1.js` (`gc-v1.0`, 213 Z)** — die Messfläche als Vertragsblock
`pet.ground` (`edge` · `fill` · `foot` · `coverage` · `letterShare` · `refTile` · `receives` ·
`tilt` · `hover`), additiv geschrieben mit 1-%-Toleranz. **Keine Zahl ist neu gewählt:** Kachel 2,0
und Füllung 0,60 kommen aus `pet-metrics.TILE_DEF` (v5), `letterShare` 0,061 und Bezugskachel 557 px
aus `HANDOVER_WS0_v7` §5. Neu **gemessen** wird genau eine Zahl — der **Fuß**: Aufstandsradius aus
der *ruhenden* Geometrie (Vertex-Puffer, gelesen über `getX/getY/getZ` — Regel 7), unterste 6 % der
Figurenhöhe. Gemessen `penguin`: Fuß 0,1892 · Deckung 41,9 % · 112 Punkte aus 5 Netzen.

`body.cubeH` behält sein Feld, seine **Rolle** ist korrigiert: es ist die Höhe, die die Fläche füllt,
nicht »der Maßstab«. Damit ist Georgs Satz 7 eine Rechnung und keine Bitte — Ohren und Flügel stehen
über die Fläche hinaus, ohne sie zu vergrößern, weil sie in `cubeH` nicht vorkommen.
`PET_FILL = { bunny: 0.351 }` und die Hüllkiste sind Altlast, nicht Vertrag.

**3 · Ein alter Entwurf überstimmte das Repo, still.** Nach dem Umbau kam der Pinguin *trotzdem* mit
0,300/0,80/1,00 — nicht die lokale Kopie, sondern ein Entwurf aus einer früheren Sitzung im
Browserspeicher (`kfb-pet-studio-v5`). Dass Entwürfe zuletzt stehen, ist richtig: sie sind
unexportierte Arbeit. Dass es niemand erfährt, ist der Fehler.
**Neu: `studio-v8/contract-guard.v1.js` (`guard-v1.0`, 86 Z)** — er entscheidet nichts, er benennt:
Feldname, Repo-Wert, Entwurfs-Wert; Entscheidung je Pet im Panel (»take repo«, verwirft *diesen*
Entwurf, protokolliert). Gemessen am laufenden Stand: 1 Entwurf, 3 überstimmte Felder, 7 Felder nur
im Entwurf — exakt die drei Felder aus der statischen Zählung.

### Beweis (Regel 6) und Gegenprobe

- **Laute Zeile der neuen Module**, damit eine Zone belegen kann, dass sie importiert und nicht
  nachgebaut hat:
  `[GC] penguin · Ebene 2.000 × Fuellung 0.600 / Grundform 0.5421 → Massstab 2.2136 · Fuss 0.1892 (Deckung 41.9 %, 112 Punkte aus 5 Netzen) · Ruhe 0.00 · kippt: inherit`
  und `[GUARD] 1 Entwurf/Entwuerfe ueberstimmen das Repo: penguin (3 Feld(er) + 7 nur im Entwurf)`.
- **Am Bild hat sich nichts verschoben, und das ist nachweisbar:** alte Kachelformel gegen neue
  Fläche, `bunny` 1,60535 gegen 1,6054 — identisch bis auf die Rundung im Vertrag. Knopf dafür im
  Panel (»Old formula vs. surface — same number?«). Eine Vertragsänderung ohne Bildänderung ist
  beweisbar, sonst ist sie eine Behauptung.

### Nähte, ausgeschrieben

- `componentDidMount`: hier endet v7s Zwei-Quellen-Ladeweg, hier beginnt die eine Quelle plus
  Rückweg (`this._contractSrc`).
- `_measureNow()`: nach `writeBody` ruft **v8** `ground-contract.apply()` — dieselbe Stelle, eine
  Messung mehr.
- `_applyStage()`: `k` kommt aus `groundScale(pet, tile)`; `pet-metrics.stageScale` bleibt als
  Rückweg für Pets ohne `ground`-Block stehen.
- Panel: neuer Abschnitt **»Ground plane · the pet's own surface (v8)«** im Body-Tab, vor den
  Reglern des Fußbodens; der alte Abschnitt heißt jetzt »Ground floor of the zone«.

### Offen (unverändert, in Reihenfolge)

Rückläufer ins Repo — jetzt **sechs**: `podcast-v1/stage.v1.js` (y-Naht additiv) ·
`studio-v7/ground-plane.v1.js` (mit `screenTile`) · `bubble-shaper.v3.js` + `bubble-kiss.v1.js` ·
`studio-v3/pet-library.v6.js` (Skalierungs-Fix) · **neu** `studio-v8/ground-contract.v1.js` +
`contract-guard.v1.js`. Dazu: eine Fassung von `pet-mouth.v1.js` · die 16 Schriftschnitte · die
Blasenschicht auf `ground.letterShare` umstellen (liest heute noch `REF` im eigenen Modul).

---

## V7-E · 2026-08-25 (WS1) — Sitzungsschnitt und Abgleich mit WS0

Kein Code, ein Schnitt. **`export/pet-studio-v7_2026-08-25/`** (28 Dateien, läuft ohne den Rest des
Projekts, Einstieg `HANDOVER_WS0_v7.md`) plus der Abgleich gegen den WS0-Export vom Morgen.

**Der Befund: die Fahrtrichtung hat sich gedreht.** Der Boden kam von WS0 und ist hier unverändert
eingebaut; drei Dateien sind hier weitergewachsen und müssen zurück. Datei gegen Datei gemessen
(Zeilen mit Inhalt, Reihenfolge ignoriert), nicht nach Augenmaß:

| Modul | WS0-Export | v7 | Befund |
|---|---|---|---|
| `ground-plane.v1.js` | 303 Z | 330 Z | Superset: **`screenTile()`** ist dazugekommen (23 Z), sonst identisch |
| `pet-metrics.v1.js` | 442 Z | 442 Z | **null** abweichende Zeilen — nichts zu tun |
| `bubble-shaper` | v2, 858 Z | v3, 887 Z | zwei Fehler in der Zipfelerkennung behoben |
| `bubble-kiss.v1.js` · `edge-treatment.v1.js` · `pet-session.v1.js` | — | vorhanden | WS0 unbekannt |

**`INTEGRATION.md` §2 aus dem WS0-Export ist überholt** und muss dort ersetzt werden: der Absatz
misst die Schriftgröße je Bild aus der projizierten Pet-Höhe (`h * 0.085`). Das ist genau der
v6-Fehler in zwei Stufen — *jedes Bild neu messen heißt jedes Bild neu zeichnen* (21 Kameraschritte,
Kachel 325 → 150 px: 3 Größen, größter Sprung 25,0 %), und *die Figur ist die falsche Referenz* (der
Hüllkasten enthält Ohren und Schopf, also bekäme der Hase eine andere Blase als der Pinguin auf
derselben Kachel). Ersatz: `SPEC_bubble_kiss_v7.md` §3, Bezug ist die **Kachel** (0,061), nicht die
Figur.

**Neu im Export, weil es sonst nirgends steht:**
- **`ABGLEICH_ws0-groundplane_v7.md`** — die Tabelle oben ausgeschrieben, §4 die vier Rückläufer in
  Reihenfolge, §5 **drei Feldfragen an WS0** (Stempel in einer Zone mit eigenem Untergrund ·
  `screenTile` gegen die Zonenkachel · `letterShare` im Spielmaßstab). Jede mit einer Zahl
  beantwortbar.
- **`SPEC_bubble_kiss_v7.md`** — die Blasenschicht als Vertrag: `REF` als Tabelle, Einbau in vier
  Zeilen, die vier Arten, Abnahmeblatt, und §6 *was absichtlich fehlt* (Regler für Feder, Schrift und
  Zipfellänge gehören der Entwurfsgröße; mehrzeiliger Umbruch wartet auf die Antwort zu §5.3).
- **`HANDOVER_WS0_v7.md`** — die eine Regel (*was sich nicht bewegt, wird einmal gezeichnet; was sich
  bewegt, bekommt eine eigene Lage*), fünf Fallen, das Offene in Reihenfolge, die Vertragsfelder als
  Codeblock, und die Herleitung der 557.

**Standardblase festgeschrieben** (Georgs Abnahme 25.8.: »ich denke, das passt so«): bei `k = 1`
153 × 105 px, `letterShare` 0,061, Schrift 34, Feder 3,4, Schatten [5, 6] hart. Das ist ab jetzt der
Maßstab, gegen den Änderungen gemessen werden.

---

## V7 · 2026-08-25 (WS1) — einmal zeichnen, dann nur skalieren

Fork von v6 → **`KFB Pet Studio v7.dc.html`** + `studio-v7/`. **v6 ist als KAPUTT eingefroren**
(die Blase springt, die Skalierung ist nicht verlässlich) — Begründung und die vier Denkfehler in
**`docs/studio-v7/POST_MORTEM_bubbles.md`**. Abnahmeblatt: **`KFB Bubble Proof v7.dc.html`**
(vier Arten, Zoom-Regler, Zähler für Neuzeichnungen). Messgriff: `window.__STUDIO7`.

### Das Prinzip

```
1. Die Blase wird EINMAL gezeichnet, in einer festen Entwurfsgroesse (REF.font 34).
2. Auf die Buehne kommt sie nur als transform: scale(k) — k stetig aus der Kachel.
3. Neu gezeichnet wird nur bei neuem TEXT, neuer ART oder neuer ZIPFELRICHTUNG.
```

Damit ist die Fehlerklasse »die Größe springt« nicht behoben, sondern **abgeschafft**: es gibt keinen
Neubau mehr, der springen könnte.

**Gegenprobe, gemessen über einen Kameraweg von 21 Schritten** (Kachel 325 → 150 px):

| | v6 | v7 |
|---|---|---|
| verschiedene Größen | **3** (Schrift 15 · 12 · 9) | 15 (stetig) |
| größter Sprung in einem Schritt | **25,0 %** | 8,6 % (= die Kamerabewegung selbst) |
| Bildbreite der Blase | in drei Stufen | 226 → 105 px, monoton |

### Was neu ist

- **`studio-v7/bubble-kiss.v1.js`** (`kss-v1.0`) — vier Arten: `speech` · `thought` · `whisper` ·
  `scream`. Gleichmäßige Linie plus harter Schatten unten rechts (dieselbe Lichtrichtung wie Karte
  und Bodenschatten). Die Kanon-Tusche ist für Blasen **ausgesetzt** (Georgs Freigabe: »von mir aus
  auch deadlines mit shadow«) und gilt für Karten, Figuren, Bodenschatten und Tipp-Punkte weiter.
- **Eine Fläche, eine umlaufende Linie** (Georgs Befund): der Zipfel steckt **im Pfad** der Blase, er
  ist kein zweites Dreieck daneben. Im Fuß gibt es deshalb keine Linie — dort ist keine Kante. Die
  Leinwand reserviert die Zipfellänge ringsum, also bleibt der Kasten gleich groß, wenn der Zipfel die
  Kante wechselt: die Richtung darf sich ändern, ohne dass die Größe es tut.
- **Wolke und Stern kommen aus der Randbehandlung** (`edge-treatment.v1.js`, aus v6 übernommen):
  Grundform + überlappende Kreise bzw. Zacken, wechselnde Größen in einem stetigen Bereich, alle zum
  Zentrum orientiert, Grundform bleibt lesbar. **Der Schrei hat keinen Zipfel mehr** (`tailAng: null`)
  — ein Schrei hat Zacken, keine Pfeilspitze.
- **Flüstern ist eine gepunktete Linie** — Muster in Anteilen der Entwurfsschrift, also in jeder
  Skalierung derselbe Rhythmus.
- **Die drei Kreise der Denkblase liegen in einer eigenen Lage** über der Bühne. Sie atmen und folgen
  dem Kopf jedes Bild; die Blase selbst wird dabei nicht angefasst. *Was sich nicht bewegt, wird
  einmal gezeichnet; was sich bewegt, bekommt eine eigene Lage.*
- **Die Skalierung liest die Bodenplatte** (`ground-plane.v1.js` → `screenTile()`): die Kachel am
  Fußpunkt des Pets, genommen wird die weiter erscheinende der beiden Kanten. Dazu der Regler
  `Balloon scale`, weil im Spiel meist kleiner dargestellt wird.
- Der Voice-Tab hat jetzt **vier** Knöpfe statt sieben Stimmen; die Regler für Linienbreite,
  Schriftgröße und Zipfellänge sind weg — sie gehören der Entwurfsgröße.

**Nachgereicht (Abnahme):** der Ruhezustand war noch nicht still — die Kachel wurde am **Schwerpunkt
der animierten Hülle** gemessen (`box.getCenter()`), und der wandert mit dem Wiegen des Ruhe-Clips
(gemessen 0,058 Einheiten in x über 60 Bilder). Unter Perspektive ändert eine seitliche Verschiebung
die projizierte Kachelbreite: 322,9 … 325,9 px in 53 Werten, Blasenbreite 224 · 225 · 226 · 227.
Die **Wurzel** des Pets steht dagegen still (Spanne 0). *Die Kachel ist ein Ding der Spielfläche: ihr
Ort ist der Standpunkt der Figur, nicht der Schwerpunkt ihrer gerade eingefrorenen Pose.*
Gegengeprüft über 90 Bilder Ruhe: Kachel **ein** Wert (322), `k` **ein** Wert, Bildbreite **ein** Wert
(224), Position ein Wert in x und y, **0** Neuzeichnungen. Der Zoom bleibt stetig: 24 verschiedene
Breiten über 30 Kameraschritte, 224 → 104 px, größter Schritt 4,9 % (= die Kamerabewegung selbst).

**Nachgereicht (Abnahme, zweite Runde):** die **Ruhezone der Zipfelrichtung** war beim Umbau auf die
v7-Schicht ersatzlos entfallen — ein Rückschritt gegen Georgs ausdrückliches Briefing (»die Pfeilspitze
folgt nicht dem Idle-Wackeln, nur echter Bewegung«). Gemessen vorher: `_kdy` nahm im Ruhezustand zwei
Werte an, die Zipfelspitze wanderte ~1 px etwa fünfmal je Sekunde, 10 Neuzeichnungen in 120 Bildern.
Ursache dieselbe wie beim Kachel-Messort, nur eine Ebene weiter: der Gesichtsanker hängt an der
animierten Hülle. Ein feineres Raster hätte den Sprung nur verschoben, also ist die v6-Regel zurück —
und zwar am Ort, der wackelt: die Richtung steht, bis der Anker mehr als `max(16 px, Schrift × 1,1 × k)`
gewandert ist, dann zieht sie träge nach.
Gegengeprüft, 120 Bilder Ruhe: `_kdx` **ein** Wert, `_kdy` **ein** Wert, Breite ein Wert,
**0** Neuzeichnungen. Beim Umkreisen der Kamera folgt der Zipfel (4 bzw. 9 Richtungswerte über 24
Schritte), und **nach** der Bewegung kommt er wieder zur Ruhe (nach 1,2 s wieder je ein Wert,
`awake false`).
*Korrektur zum Eintrag oben: die dort behauptete »0 Neuzeichnungen im Ruhezustand« galt für die Größe,
nicht für die Zipfelrichtung — sie waren 10 in 120 Bildern. Jetzt sind sie 0.*

### V7-S1b · Der Zipfel ist ein Konzept, kein Rechenergebnis

Georgs Rückfrage zum Bild: **»konzept?«** — der Zipfel saß auf der **Seitenkante** und las sich als
Lappen. Vorher entschied die Geometrie (die Kante, die zum Gesicht schaut); bei einer Blase seitlich
über dem Kopf ist das die Seite, und ein waagerechter Zipfel ist kein Zipfel.
**Die Konvention ist einfacher und immer richtig:** der Fuß sitzt auf der **Unterkante**, die Spitze
zeigt nach unten und **lehnt** zum Sprecher. Damit gibt es nur zwei Fälle — unten, oder oben, wenn die
Blase unter dem Gesicht sitzt. Kein Kantenwechsel, also kein Umklappen.

### V7-S1c · Ein Anker, der atmet, ist kein Anker

Danach pendelte die Blase endlos zwischen zwei Ausweichplätzen. Ursache dieselbe Klasse, zwei Ebenen
weiter: `_headPt()`/`_petRect()` messen jedes Bild eine Box3 der **laufenden Pose**. Die schwankt
seitlich um 0,058 Einheiten — und das Ausweichen entscheidet zwischen weit auseinander liegenden
Plätzen: **zwei Pixel Atmen kippen die Wahl um zweihundert Pixel.**

Zwei Änderungen, beide an der Ursache:
- **`_kAnchor()`** projiziert die **stillstehende Wurzel** des Pets; die Körperausdehnung wird
  **einmal** je Pet und Skalierung gemessen und danach nur noch gerechnet. Kopf, Gesicht und
  Augenfeld lesen alle diese eine Quelle.
- **Die Platzwahl klebt** (Hysterese): der zuletzt gewählte Platz bleibt, bis ein anderer um mehr als
  15 % der Augenfeldfläche besser ist. Eine diskrete Entscheidung braucht eine Schwelle, sonst kippt
  sie bei minimaler Änderung der Eingabe.

**Abnahme, 150 Bilder Ruhe ohne Eingriff:** Kachel **ein** Wert (322) · Skalierung ein Wert ·
Bildbreite ein Wert (224) · Position ein Wert in x und y · Zipfelrichtung ein Wert (0,975 / 0,225) ·
Platz ein Wert · **0 Neuzeichnungen**.
**Und er folgt trotzdem:** beim Umkreisen der Kamera (24 Schritte) nimmt die Richtung 10 Werte an, der
Platz bleibt derselbe; 1,5 s nach der Bewegung steht sie wieder auf **einem** Wert.

### V7-S1e · Eine Kalibrierung für alle vier Arten

Georgs Ansage: *»die Skalierung für die reale Screen-Größe der Pets muss sitzen — einmal für alle
Arten, der Rest skaliert mit der ground plane«.* Vorher stand die Bezugsgröße als nackte Pixelzahl im
Modul (`tile: 380`) — eine Zahl ohne Begründung. Jetzt ist sie **abgeleitet** und steht als Anteil der
Kachel da:

```
Letteringhoehe  ≈ 8,5 % der FIGURENhoehe        Comic-Konvention
Figurenhoehe    ≈ 0,71 × Kachel                 GEMESSEN: Pinguin 228 px bei Kachel 322 px
                                                (die Buehne fuellt die Kachel mit der GRUNDFORM,
                                                 Kopfschopf und Ohren stehen darueber)
→ letterShare    = 0,085 × 0,71 = 0,061 der Kachel
→ REF.tile       = 34 / 0,061   = 557 px        Kachelbreite, bei der k = 1 gilt
```

Bezug ist die **Kachel**, nicht die gemessene Figur — sonst bekäme der Hase eine andere Blase als der
Pinguin, obwohl beide auf derselben Kachel gleich groß stehen. Eine Zahl (`letterShare`) regelt alle
vier Arten, weil alle vier ihre Größe aus derselben Entwurfsschrift ziehen; »Balloon scale«
multipliziert nur noch darauf.

**Abnahme:** Letteringhöhe **8,6 % der Pet-Höhe** in allen vier Arten (19,7 px bei Pet 228 px) —
Blasen 153×105 (speech) · 123×86 (thought) · 149×104 (whisper) · 124×75 (scream).
**Zwei Pets, eine Kachel:** Pinguin und Hase bei Kachel 322 px beide `k` 0,5788 und Blase **153×105**.

### V7-S1d · Ein Regler, der sich bewegt und nichts tut, ist eine Lüge mit Schieber

Befund an der Abnahme: das Voice-Panel bot **»Padding«, »Dead zone« und »Lag«** an, die die v7-Schicht
nicht mehr liest (`_anchorTick` wird nicht mehr gerufen, den Innenabstand besitzt die Entwurfsgröße) —
und eine Notiz erklärte zwei Schalter (**»Edge build«**, **»Base form«**), die ausgebaut waren, plus
eine dritte, die noch die v4-Ankerlogik beschrieb. Ursache: einer der Ersetzungsschritte hat still
nicht gegriffen (die Quelle trägt `\u2014`-Escapes literal, das Suchmuster nicht) und wurde nicht
geprüft. **Ein Skript, das ersetzt, prüft jeden Treffer — sonst behauptet der Changelog etwas, was der
Code nicht tut.**

Behoben in einem Zug: die Reihe zeigt jetzt genau, was die Schicht liest — `kind` · `open` · `text` ·
Freitext · `scale` · `gap` · `tint` · `dead` · `lazy`. **`pad` ist weg**, und **`dead`/`lazy` sind
angeschlossen**: `dead` ist der Radius der Ruhezone in Entwurfspixeln (skaliert mit) und gilt für
Blase **und** Zipfel (0,6 × davon), `lazy` ist die Federkraft des Nachlaufs.
Gegengeprüft im DOM: fünf Regler (Balloon scale · Gap above the head · Paper tint · Rest zone · Lag),
kein »Padding«, die drei alten Notizen weg, die drei neuen da. Ruhezonen-Radius reagiert:
`dead 0 → 4 px`, `60 → 50,9 px`, `120 → 101,8 px`.

**Offen:** Pet-eigene Bodenplatten (kippbar, frei platzierbar, Träger für Schatten und AOE) — das
Briefing dazu liegt vor und ist der nächste Slice · **die Regler im Bubbles-Tab sind falsch verdrahtet**
(»air«, »pen«) und die Tusche-Optionen müssen für v8+ nachgezogen werden (Georgs Notiz 25.8.) ·
Satz-Reveal beim Sprechen gegen die neue Schicht prüfen · `voice.bubble` im Vertrag auf die v7-Felder
umstellen.

**Offen:** Pet-eigene Bodenplatten (kippbar, frei platzierbar, Träger für Schatten und AOE) — das
Briefing dazu liegt vor und ist der nächste Slice · Satz-Reveal beim Sprechen gegen die neue Schicht
prüfen · `voice.bubble` im Vertrag auf die v7-Felder umstellen.

*(Die vollständige offene Liste steht unter V7-S1c.)*

---

## V6 · 2026-08-25 (WS1) — KAPUTT EINGEFROREN (Blase springt)

**Status: nicht weiterverwenden.** Lauffähig, aber die Blasengröße springt beim Zoomen in Stufen von
bis zu 25 %, und die Kette Silhouette → Lage → Zipfel → Silhouette kommt nicht zur Ruhe. Post-mortem:
`docs/studio-v7/POST_MORTEM_bubbles.md`. Was aus v6 weiterlebt: die **Randbehandlung**
(`edge-treatment.v1.js`) — Grundform plus Kreise oder Zacken auf ihrer Kante. Der Eintrag unten
bleibt unverändert stehen, samt der Befunde, die er dokumentiert.

---

## V6 · 2026-08-25 (WS1) — die Randbehandlung ist ein eigenes Ding

Fork von `KFB Pet Studio v5.dc.html` → **`KFB Pet Studio v6.dc.html`** + `studio-v6/`
(`pet-session.v1.js` · `pet-metrics.v1.js` · `ground-plane.v1.js` · `bubble-shaper.v3.js` ·
**`edge-treatment.v1.js`** neu). **v5 ist eingefroren.** Messgriff: `window.__STUDIO6`
(`__STUDIO5` bleibt gültig, damit die v5-Abnahmeskripte laufen). Abnahmeblatt:
**`KFB Bubble Proof v6.dc.html`** — acht Zellen in Abnahmegröße, Grundform einblendbar.

### V6-S1 · Der Befund: nicht die Bewegung verschob etwas, sondern das Neuzeichnen

Georgs Meldung: *»bubble-outline und text alignment verschieben sich bei kleinsten Änderungen«*.
Gemessen im **Stillstand**, ohne Eingriff:

| | vorher | nachher |
|---|---|---|
| Tuschungen je Sekunde | **121** | **0** |
| Schrift · Breite · Zipfel über 20 Bilder | — | Spanne **0 · 0 · 0** |

**Drei Ursachen, eine Klasse.**

1. **Ein geschlossener Regelkreis aus Lage, Form und Zipfel.** `_bubbleShape` schrieb `_bfw/_bfh`
   (die gezeichnete Form) → `_bubbleTick` klemmte damit die Lage und rechnete daraus `bcx` → daraus
   `tail` → das verschob die Zipfelgruppe → neue Form. Gemessen: `tailR 0,92` bei mittig stehendem
   Kopf. **Aufgeschnitten:** der TICK besitzt alles, was aus der Lage folgt (`_tailStep`, `_flipY`),
   der Zeichner liest es nur; normiert wird auf die **Grundform** (`_bInnerW`/`_bInnerCx`), und die
   hängt allein an Satz und Schrift.
2. **Der `seed` hing an Breite und Höhe** — also war jede Größenstufe eine *andere gezeichnete Hand*.
   Jetzt hängt er am **Wortlaut** (Georgs Entscheidung: die Linie gehört dem Satz). Wachsen, Zoomen
   und Zipfelwandern skalieren dieselbe Hand.
3. **Getuscht wurde jedes Bild.** Jetzt gibt es einen **Schlüssel** über alles, was die Zeichnung
   bestimmt (Stimme · Bauart · Grundform · Satz · Reveal · Schrift · Zipfelstufe · Spiegelung ·
   Papierton · die drei Shaper-Werte). Gleich = nichts tun, die Blase wird nur **bewegt**.

**Bezahlt:** `safe` in der Randklemmung addierte den **Leinwand-Zuschlag** (`_bubPad`). Seit die
Denkblase Platz für ihre Spur bekommt (PAD bis 76 px), drückte er die Blase 76 px nach innen — sie
landete im Gesicht. *Ein Zuschlag am Zeichenziel ist keine Ausdehnung des Gezeichneten.*

### V6-S1b · Die Randbehandlung (`studio-v6/edge-treatment.v1.js`, `edg-v1.0`)

Georgs Konzept, zweimal formuliert und jetzt **einmal** gebaut: *»denkblasen werden aus rect (oder
oval) base form gebaut; die Ränder durch leicht unregelmäßig verteilte, überlappende (halb)kreise
wechselnder Größe; ink outline nur außen«* — und *»die gleiche Konstruktions-Logik brauchen wir 1:1
für scream, nur mit Zacken statt Kreisen«*.

```
DIE GRUNDFORM traegt Groesse, Innenraum und Satz.   rect · oval
DIE BEHANDLUNG traegt den Rand.                     circles · spikes · plain
DIE FEDER traegt die Linie.                          paintBubble, Kanon
```

Damit ist die Wolke **keine Form**, sondern ein **Rand** — und der Innenraum ist die Grundform
selbst (keine Suche, also auch nicht *zwei Maße für dieselbe Fläche*). Warum das vorher nie sauber
wurde: jeder Anlauf hat die Wolke als **einen Punktzug** gezeichnet (Girlande auf einer Ellipse),
deshalb stand in `bubble-shapes.json` *»cloud: VERWORFEN als eine Kontur«*.

- **Kreise:** die Kontur ist das **Ergebnis**. Gemessen als weitester Kreisaustritt je Winkel —
  exakt, ohne Pfad-Verschneidung, ohne Naht; die inneren Bögen fallen von selbst weg, deshalb sieht
  man keine Überlappung. Kerben zwischen zwei Lappen sind **Ecken** (Fenster ±5 Proben,
  Mindesttiefe 0,4 %, sonst fast die Kantenfase die Wolke zu Tode).
- **Zacken:** hier gibt es nichts zu vereinigen. Zwei Füße auf der Grundform, eine Spitze nach
  außen, dazwischen eine **Schulter** — ohne sie lesen zwei Täler nebeneinander als Falte statt als
  Explosion. **Lang heißt schmal** ((Mittel/Länge)^1,1); der Zipfel ist die längste Zacke und
  bekommt zusätzlich 0,72, er darf nicht so breit sein wie die Zacken.
- **Die Variation** ist ein Wechsel mit stetigem Bereich, nicht zwei Größen (Georgs Präzisierung):
  Vorzeichen springt · Betrag läuft frei durch 0,20…1,00 · dazu eine langsame Drift über den Ring,
  damit auch die Abfolge nicht mechanisch ist.
- **Alle sind zum Zentrum orientiert**, und der Einzug ist ein Anteil des **eigenen** Radius
  (`inset · rᵢ`) — deshalb bulgen große und kleine Lappen gleich weit über die Grundform hinaus und
  das Rechteck bzw. Oval **bleibt lesbar**. Mit einem gemeinsamen Einzug trägt jeder große Lappen
  seinen ganzen Überschuss nach außen, und nach zwei Lappen erkennt man die Grundform nicht mehr.

Gemessen auf dem Abnahmeblatt (Grundform 128×84, Satz 292 px bzw. 93 px, passt in allen acht Zellen):
Wolke fein 347×135 · Standard 359×158 · groß 374×185 · Blumenkohl 383×200 (7 · 7 · 4 · 5 Kerben) —
Stern fein 175×120 · Standard 197×133 · lang/schmal 208×159 · grob 189×149.

**Zweite Bauart, umschaltbar** (Georgs Wahl »beides bauen«): `Generator v4` nimmt die Silhouetten
aus `podcast-v2/bubbles.v4.js` (`cloud` = Girlande, `burst` = Strahlen — die Formen aus Georgs
Bildern 3 und 4). Sie liefern **nur die Silhouette**; gemessen wird immer in der Bühne, sonst hätte
sie wieder zwei Maße für dieselbe Fläche.

### V6-S1c · Denkblase, Zeiger, Reveal, sieben Stimmen

- **Die Denkblase geht durch denselben Zeichner.** Sie war der letzte SVG-Weg (`_blobPath` mit
  `stroke-width`, zwei SVG-Kreisen als Spur) — also gleiche Breite ringsum, kein Saum. Jetzt:
  Papier, Saum unten rechts, moduliertes Band, Kantenfase aus `paintBubble`.
- **Der Zeiger ist eine Spur, keine Pfeilspitze:** drei abnehmende Kreise auf der Linie zum Kopf,
  mit `inkBlob` getuscht. Er **atmet** (Georgs Wahl »ruhig schwebend, fest auf der Linie«) und liegt
  in einer **eigenen Lage** — läge er in der getuschten, müsste die ganze Blase je Atemzug neu
  gezeichnet werden und der Schlüssel oben wäre wertlos. *Was sich bewegt, bekommt seine eigene Lage.*
- **Der Reveal war wirkungslos.** `_patchReveal` schrieb weiter in den versteckten HTML-Kasten,
  während die Leinwand den vollen Satz malte — beim Sprechen stand der Satz sofort ganz da. Jetzt
  wächst er auf der Leinwand mit der Stimme, und zwar **nach rechts**: bei zentriertem Satz wandert
  sonst jeder Buchstabe bei jedem Wort.
- **Sieben Stimmen auf der Bühne** statt drei (`scream · loud · mid · soft · whisper · thought ·
  free`). Der Shaper kannte fünf, die Bühne bot drei — die Hälfte der Grammatik war unerreichbar.
- **Kein Eingabefeld in der Blase** (Georgs Entscheidung): der Satz wird hineingestreamt wie in der
  Sprechblase, getippt wird im Panel. Damit bleibt es bei **einem** Zeichner für Form und Satz.
- Die **Tipp-Punkte** brauchten nichts: `_inkDisc` ist schon die Kanon-Feder für Kleinformate
  (LX 0,62 · LY 0,78 · ORIENT 0,34, Band direkt gerechnet).

**Offen** (in Reihenfolge): Flüster-Schutzzone um Zipfel und Ecken · Shaper live gegen die Bühne
stellen · Zackenzahl/-länge als Regler in den Bubbles-Tab · `voice.bubble` im Vertrag um `treat`,
`base` und `edge` erweitern, damit die Zone die Behandlung erbt statt sie zu erfinden.

### V6-S1d · Nachgereicht: fünf Befunde aus Georgs Durchgang

1. **`free` ergab 78 × 1922 px** auf einer 540 px hohen Bühne. Die Zipfel-Erkennung in `shapeForBox`
   nahm die erste y-Lücke über 0,12 als Zipfelbasis; `free` (Erzählerkasten, **vier** Punkte, kein
   Zipfel) hat sortiert `[1 · 0,944 · −0,958 · −1]`, die Lücke ist 1,90 — also galten die zwei
   *oberen* Punkte als ganzer Körper, Körperhöhe 0,042, `ky ≈ 1013`.
   **Regel:** eine Lücke ist nur ein Zipfel, wenn sie eine **Minderheit** abtrennt (höchstens ein
   Drittel der Punkte) **und unten** liegt. Gegengeprüft: `free` 83 × 43 · `rect` 83 × 57 (unverändert)
   · `round` 87 × 58 (unverändert) · `rect` mit Zipfel rechts 83 × 57 (unverändert).
2. **`scream` war ein schwarzer Keil.** Zwei Fehler übereinander: der Zipfelwinkel kam aus
   `atan2(±1, tail)` — *aus einer Zipfellage einen Winkel zu machen ist Unsinn*, jetzt wird die
   Richtung dort gemessen, wo der Kopf bekannt ist (im Tick, `_tailAng`). Und die Zipfelzacke bekommt
   0,72 auf die Breite; damit war ihr Fuß **schmaler als ihr eigenes Band**, und die Tusche von links
   und rechts floss zusammen. **Regel:** Fuß ≥ 3,2 × Federbreite, Zipfellänge 1,42 → 1,24.
3. **Die Pfeilspitze folgte dem Ruhe-Wackeln.** Die Totzone saß auf dem *normierten* Wert: bei einem
   Innenraum von 73 px sind 5 px Kopfwackeln schon 0,14 — mehr als die Zone. Jetzt liegt die Ruhezone
   an der Größe, die wackelt: dem **Kopfort in Pixeln** (Radius `max(16; Schrift × 1,1)`). Gemessen
   über 40 Bilder im Idle: `tailStep` **ein einziger Wert**.
4. **Die Spur lag in einer abgehängten Leinwand.** `_drawBubble` setzt `el.innerHTML` neu und wirft
   alle Kinder heraus; die Haupt-Leinwand wurde danach wieder eingesetzt, die Spur-Leinwand nicht.
   Gemessen: **2443 gesetzte Pixel in einem Rechteck 0 × 0** — sie malte korrekt und war unsichtbar.
   *Ein Element, das nicht im Baum hängt, hat kein Layout.* Dazu: Lappen-Untergrenze **9** (sechs
   Lappen an einer kleinen Blase sind ein Klumpen, keine Wolke) und Spur-Radius 0,30 → 0,42 der Schrift.
5. **Die Bezugsgröße ist die Bodenplatte** (Georg: »Referenz ist die ground plane des Pet«). Gemessen
   wurde vorher auf **Brusthöhe** und entlang der **Kamera**-Achse — zwei Fehler: die Kachel liegt am
   Boden, und ihre Kanten sind die Achsen der Fläche, nicht die des Betrachters. Das Maß gehört jetzt
   dem Boden (`ground-plane.v1.js` → `screenTile()`, genommen wird die weiter erscheinende der beiden
   Kanten, damit es beim Umkreisen nicht schrumpft, und der Punkt wird entlang der Normale auf die
   Platte gelegt — gilt auch für den gekippten Flippertisch). Der Faktor 0,05 ist zusätzlich ein
   **Regler** (`Balloon scale`, 0,5 … 2,0), weil im Spiel meist kleiner dargestellt wird; er landet
   als `voice.bubble.scale` im Vertrag, zusammen mit `voice`, `edge` und `base`.
   Gemessen: Kachel 325 px am Fußpunkt, sieben Stimmen 61–79 × 33–61 px bei Schrift 15.
6. **`free` saß danach 10,5 px rechts** — dieselbe Heuristik, eine Ebene tiefer: die
   Minderheiten-Bedingung lag nur auf der **Suche**, nicht auf ihrem **Rückfallwert**. Qualifizierte
   keine Lücke, blieb `bodyY` auf dem *kleinsten* y-Wert stehen — also »alles ist Zipfel«, und bei
   `free` wurden drei von vier Punkten seitlich geschoben: Ring x von −10,7 bis 53,8 statt 0 bis 64,6,
   während `inner` beim ungeschobenen Mittelpunkt zurückblieb; das Ausrufezeichen kreuzte die Kontur.
   *Ein Rückfallwert ist eine Entscheidung, keine Restmenge.*
   Gegengeprüft (Satzluft links/rechts an der eigenen Tusche): `free` **8,8 / 9,3** wie `mid` 8,8 / 10,0
   · `loud` 8,8 / 9,9 · `soft` 8,5 / 9,7 · `whisper` 8,6 / 9,8 · `thought` 18,1 / 14,7 · `scream`
   19,8 / 18,8. Und `rect` gleitet weiter: `tail 0` → 47 %, `−1` → 12 %, `+1` → 82 %, Maße 83 × 57
   unverändert, `round` 87 × 58 unverändert.

---

## V5 · 2026-08-25 (WS1) — Datenverlust geschlossen, ein Blasen-Zeichner, Boden als Ort

Fork von `KFB Pet Studio v4.dc.html`; **v4 ist eingefroren** als Vergleichsmaßstab.
Einstieg: `docs/studio-v5/SESSION_CUT_v5.md` → `SLICE_v5_2026-08-25.md` → `SOP_kfb_ink_v1.md`.

### V5-S1 · Der Datenverlust (Handover §6.1/§6.2)

**Befund:** `studio-v3/kfb-pets.json` v1.2.6 hatte Georgs Arbeit gelöscht, mit *höherer*
Versionsnummer. Gemessen gegen 1.2.5: `pig`/`beaver`/`bee` ohne Mund-Block (**40 → 14** bzw.
**37 → 14** Blattfelder), `penguin`/`monkey`/`hog` mit zurückgesetztem Augen-Anker,
`voice.speech.category` mit einem Pet-Archetyp im globalen Block.

**Ursache im v4-Code:** `_buildContract(bump, useTouches)` baute aus `this.contract` plus nur den in
dieser Sitzung **berührten** Pets, und der Haken `mark()` feuerte nur auf den Tabs *Körper* und
*Gesicht*. Wer nicht angefasst wurde, fiel heraus; danach gewann die ausgedünnte Datei den
Versionsvergleich.

**Behoben:** v1.2.7 = 1.2.6 mit 1.2.5 darüber gemischt, Felder werden nie entfernt. Die beschädigte
Fassung liegt als `kfb-pets.v1.2.6-verlust.json` daneben (Beweisstück, nie Quelle).

**Neu:** `studio-v5/pet-session.v1.js` (`ses-v1.0`) — Entwürfe je Pet (Wechsel = speichern, Reload
holt sie zurück), Vereinigung nach *der reichere Stand gewinnt, Feld für Feld*, Export 1 · n von 24 ·
alle mit `meta.petVersions` und `leafCounts`, Import-Blatt mit Entscheidung je Pet, fünf Prüffragen
als Code. **Die v4-Exportschicht ist entfernt** (`_loadExportContract`, `_buildContract`,
`_exportContract`, `_roundtrip`, `_importLibrary`, `_importOnePet`, `_adoptContract`).

**Abnahme (echter Bedienweg):** Bunny `mouth.size 0,44 → 0,61`, `lashes.length → 0,33`, Wechsel auf
Tiger, zurück → Live-Objekt, Oberfläche und Entwurf feldweise identisch. Alle fünf Prüffragen grün,
`pig` behält 40 Felder.

### V5-S2 · Die Blasen (Perform ist tot)

`studio-v5/bubble-shaper.v2.js` (`shp-v2.0`) — der 80-%-Stand aus `bubble-shaper.js`, ohne DOM-IDs.
Der Tab *Bubbles* ersetzt *Perform*; `bubbles.v3.js` wird nicht mehr geladen.

**Mindestabstands-Regel** gegen Georgs Eck-Glitch: `rect` trug an jeder Ecke **zwei** Punkte im
Abstand von **0,0296** der halben Breite (die Fase), und `bevelCorners()` faste dort noch einmal.
Zwei Anfasser näher als die Schwelle werden zu **einem**, und der neue Punkt ist eine **Ecke**.
Gemessen: `rect` **11 → 7** Punkte (4 zusammengelegt), `round` unverändert 11.

**Später korrigiert (V5-S5):** die Schwelle war in Bildschirmpixeln (`mergePx 14`) — auf der kleinen
Bühnen-Blase fraß sie den Zipfel. Jetzt im **normierten** Raum (0,06), zusammengelegt wird einmal vor
dem Skalieren.

### V5-S3 · Vertragsfelder (Podcast-Übergabe §1/§5)

`studio-v5/pet-metrics.v1.js` (`met-v1.0`). Gemessen bei **jedem Laden**, geschrieben mit **1 %
Toleranz** (ohne sie wäre jedes Laden eine Änderung: 0,7482 gegen 0,7461 beim zweiten Mal).

| Feld | Aufgabe |
|---|---|
| `body.cubeH` | **Maßstab** — Grundform, ohne Ohren und Flügel |
| `body.radius` | **Trefferfläche** — Silhouette |
| `body.facePitch` / `faceTrim` | **Blickachse** — gemessen / am Bild entschieden |

Bunny: `cubeH 0,746 · totalH 0,821 · radius 0,300 · facePitch 0,0°`. **facePitch 0,0 bei allen
Modellen** bestätigt den Podcast-Befund: die Modelle tragen keine Mund-Neigung.

Dazu: **Würfel des Spiels** (halbe `cubeH`-Kante, abgerundet, GLB-Export; Bunny Kante 0,373),
PottyMouth-Glyphen statt Dellen auf den sechs Flächen, `behavior`-Block je Pet (Felder, kein Motor),
und **`EMBED_CUBE_PET_FULL_v2.3.md`**, das das Studio aus dem laufenden Stand selbst schreibt.

**Die Kachel ist die Maßeinheit** (Georgs Gedanke): `scale = tile.edge × fill / cubeH`, Standard
Kante 2,0 · Füllung 60 %. Hase 1,604 gegen die alten festen 1,6 — am Bild ändert sich nichts, aber
zwei Pets auf derselben Kachel sind jetzt gleich groß. Der **Boden** gehört der Zone, das **Podest**
(`token`) dem Pet.

### V5-S4 · Boden und Schatten (nach Georgs WS0-Befund)

`studio-v5/ground-plane.v1.js` (`gnd-v1.0`). **Befund am WS0-Bild:** die Schatten hingen in Hüfthöhe
hinter den Figuren — sie wurden auf eine **Rückwand** projiziert statt auf den Boden.

**Lösung:** der Schatten ist ein **Stempel der echten 3D-Form**. Eine Kamera schaut entlang der
Plattennormale, nimmt die Silhouette ab, das Bild liegt als Decal auf dem Boden — nach vorne rechts
versetzt wie der Saum der Karten-Tusche, mit der Höhe weicher und größer.

- Hüpfen braucht **keine Maske**, es gibt keine zweite Projektionsfläche.
- Platte **kippbar** (Flipper): projiziert wird entlang der Normale, Höhe ist der Abstand *zur Platte*.
- Farbe **Tusche** (`#1f1a14`, Deckung 0,34); Rosa bleibt als Wahl (es war Georgs Denkmodell für WS0).
- Boden-FX (AOE) als Decals **unter** dem Schatten.

**Der Fußanker läuft jedes Bild**, als letzter Schreiber vor dem Rendern. WS0 hatte gemessen, dass er
nur einen Frame hält (Fehler 7,0 px beim Hasen, 3,4 beim Pinguin). Abnahme: während der Laufanimation
Korrekturen bis **0,0092** Einheiten je Bild, Sohle konstant **0,00400**, Spanne **0,000** über acht
Messungen.

**Flug-Pets:** `body.limits.hover.h` ist der neue Nullpunkt — ohne ihn rechnet der Boden jede
Schwebehöhe als Sprung, und die Biene hätte für immer einen blassen, aufgeblasenen Schatten.

**Ein bezahlter Fehler:** `alphaMap` liest den **Grünkanal**. Die Maske war schwarz, also Alpha 0 —
der Stempel unsichtbar, obwohl alles stimmte.

**WS0-Prüffragen als Knöpfe:** »Sieht die Kamera den Boden?« (`seesPlane`, gemessen 8,95°),
»Platte der Kamera entgegen« (`autoTilt`), »Blick-Sonde«. Letztere beantwortet die offene Frage des
Handovers: **im Podcast 0,0026 rad, im Studio 0,699 rad** — dasselbe Rig, das 269-fache. Das EyeRig
kann es; im Podcast schreibt etwas danach.

### V5-S5 · Die Blasen-Grammatik am Bild (Abend)

**Fünf Stimmen, eine Feder:** `scream` Bangers 36 ALLCAPS · `loud` Fonteys PRO 900 in
**Standardgröße** 22 ALLCAPS · `mid` Shantell 600/22 · `soft` kursiv 17 · `whisper` kursiv 15 mit
unterbrochener Linie. ALLCAPS ist Teil der **Stimme**, nicht des Textes.

**Autogrow — die Blase wächst am Satz.** Vorher füllte die Form die Bühne und der Satz wurde
hineingesetzt. Jetzt:

> `Rahmen = (Satzblock + 2 × Innenabstand) / q`, mit `q = Innenraum/Rahmen` je Form

Zwei Fehler auf dem Weg: **doppeltes Padding** (Kanon-Zuschlag *auf* den Innenabstand, den der
Zeichner schon abzieht — Faktor ~1,6 zu viel) und **zwei Maße für dieselbe Fläche** (Innenraum im
Rahmen-Verhältnis gemessen, im Satz-Verhältnis gezeichnet).

**Später ersetzt:** `innerBox` konnte den Fit nicht leisten (eine Suche mit festem Seitenverhältnis
liefert rechnerisch denselben Faktor für Breite und Höhe und rutscht durch den konkaven Zipfel —
Innenraum 190 px in einer 187 px breiten Form). Jetzt eine **Schablone mit Division**: der Körper der
Form trägt den Satz, `kx = wantW / (Körperbreite × nutzbar)`, `ky` analog; `nutzbar` liest die Form
selbst (Rechteck 0,94, Oval 0,89). Gemessen trifft der Innenraum exakt: 60×34, 190×34, 70×70.

**Die unterbrochene Linie — drei Anläufe.** (1) `destination-out` in die Leinwand: das **Papier** war
mit weg. (2) Feder an den Lücken ausdünnen — Georgs Korrektur: *»die Linie ist durchgehend, die Feder
wird NICHT abgesetzt vom Profi-Zeichner, man löscht die Lücken.«* (3) Richtig: Tusche in eine
**eigene Lage**, dort auf **Bogenlänge** schneiden, Muster in **em** (0,46/0,40).

**Tipp-Punkte:** eine Wurfparabel, Quetschen aus ihrer **Ableitung** (vorher fünf Zeitfenster mit
Knick an jeder Grenze). Gemessen über 60 Bilder: Steigen 1,20/0,88 · Gipfel 1,00/1,00 · Aufprall
0,82/1,18 — Volumen konstant. Farbe: Papier plus 10 % Pet-Grundfarbe, keine Vollfarben.

### V5-S6 · Ein Zeichner für alles

Georgs Hinweis: *»die Blase ist ja auch im Body-Tab zu sehen«* — die Bühnen-Blase ist ein **Overlay**
und damit in **allen** Tabs sichtbar. Sie war der *sichtbarere* Zeichner und malte als SVG-Pfad mit
`stroke-width`, also mit gleicher Breite ringsum.

`paintBubble()` in `bubble-shaper.v2.js` ist jetzt **der** Zeichner: Papier, Saum unten rechts,
moduliertes Band (`LX 0,62 · LY 0,78 · ORIENT 0,34`), Kantenfase, geschnittene Lücken — für
Shaper-Tab **und** Bühne. Die Parameter liegen in `BUBBLE_DEF`; die Bühne liest **live** mit, was im
Tab eingestellt wird. Relative Federstärke: **14,4 im Tab gegen 15,6 auf der Bühne** (8,7 %).

**Der Satz wird mitgezeichnet**, nicht als HTML-Kasten daneben gesetzt — er kann nicht verrutschen,
weil er in derselben Transformation sitzt wie die Linie, die ihn umschließt.

**Die Blase mißt sich am Pet:** Letteringhöhe ≈ 8,5 % der projizierten Figurenhöhe (11–46 px),
viermal je Sekunde nachgemessen. Belegt in zwei Zoomstufen: Schrift 46/19 px, Blase 313/129 px —
Verhältnis 2,42 auf beiden.

**Position:** `_headPt()` projiziert den Kopf **einmal** in Bühnen-Koordinaten; Zipfelrichtung,
Ausweichen und Schutzfeld lesen ihn. Gesprochen wird bei **38 %** der Pet-Höhe unter dem Scheitel (am
Bild abgezählt). Geschützt wird die **Augenregion** (16 % der Höhe, flach) — ein Schutzfeld über dem
halben Körper findet nie einen freien Platz und setzt die Blase mitten ins Gesicht.

**Offener Edge Case (F48, dokumentiert statt gefixt):** steht der Kopf größer als zwei Drittel der
Bühne, gibt es keinen freien Ort — die Blase deckt ein Auge ab. Die Zahl steht als `_bubTight` im
Code, damit die Regie sie abfragen kann; ein solcher Zoom ist eine Detailansicht, dort spricht
niemand.

### V5-S7 · Oberfläche strikt EN

79 deutsche Anzeige-Texte übersetzt (Menü, Panel-Zeilen, Import-Blatt, Meldungen, Prüffragen).
Kommentare und Dokumente bleiben deutsch. Eigennamen ausgenommen.

### Was diese Sitzung an Regeln hinterlässt

`docs/studio-v5/SOP_kfb_ink_v1.md` — **48 Fallen, 10 Regeln, 4 Abnahmeblätter.**
`docs/studio-v5/POST_MORTEM_v5.md` — die fünf Muster, die Runden gekostet haben, mit Zahlen.

**Die eine Regel:** eine Zahl hat einen Eigentümer, alle anderen addieren. Sie erklärt vier Fehler
dieser Nacht — Kopfneigung (Schlaf-Animation schrieb absolut), Pupillen im Podcast, Fußanker gegen
Ruhe-Clip, und das Autogrow, das in der *Hülle* von `loadPreset` saß statt darin.
