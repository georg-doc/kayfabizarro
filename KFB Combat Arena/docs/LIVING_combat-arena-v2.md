# LIVING · KFB Combat Arena v2 · Slice S0 (Wirt + Prüfwerkzeug)

**Stand 06.09.2026 · gebaut nach `docs/MASTERPLAN_combat-arena-v2.md` §9.2 · Fixture-Seed 20260906.**
Nur Gemessenes. Adjektive stehen hier nur, wenn eine Zahl daneben steht.

---

## 1 · Was S0 liefert

| Datei | Rolle |
|---|---|
| `KFB Combat Arena v2.dc.html` | Integrator + **Prüfblatt** (Bodenkatalog als DOM, weil der Kritiker nur die Seite liest) |
| `combat-arena-v2/host.v2.js` | Wirt v2: erbt `combat-arena-v1/host.v1.js`, legt `input · field · fx · time · save` dazu, plus Schulter-Kamera, `lint()`, `karteImBild()`, Frame-Median |
| `combat-arena-v2/floors.v2.js` | Bodenkatalog C1–C12 + S0-Zeile, jede mit eigener Messung und vier Zuständen (`✓ ✗ ○ ~`) |
| `docs/combat-arena-v2/captures/S0-seed20260906.png` | Beleg-Bild des Slice (Q&A-Schleife, MASTERPLAN §7.4) |

**Kein Feature.** Kein Kartenbau, kein Spieler, keine Mobs, keine Waffe. `field` steht auf der
Wirt-Vorgabe (Rechteck 9 × 6,44 u); M1 hängt in S1 die Tusche-Kontur über `field.attach(poly)` ein.

## 2 · Messwerte S0 (Seed 20260906, Fenster 924 × 540, Seitenverhältnis 1,19)

| Boden | Wert | Register |
|---|---|---|
| S0 Kalibrierung | Linear · exposure 1,10 · Kugel 244,201,71 gegen 242,201,60 · **ΔE 3,97** · kein Kanal ≥ 250 — gemessen aus der **festen Kalibrierpose** (−1,1 / 1,25 / 2,9), nicht aus der Spielkamera | ✓ BLOCK |
| C4 FX-Pool | 24 emittiert · lebend 24 → **0** nach `aufraeumen + 180 ms` | ✓ BLOCK |
| C5 Save-Roundtrip | **Diff 0** über 10 Felder · leer bis M7: level, score, kills, karten, gesicht | ~ (teilweise, BLOCK) |
| C6 Konsole | **0 error** (Boot + 10 s) | ✓ BLOCK |
| C7 Budget | **6 calls** · Frame-Median **0–0,4 ms** (Budget 110 / 8) | ✓ warn |
| C8 Karte im Bild | **86–89 %** bei Standard 7,6 u (13 × 13-Raster) | ✓ warn |
| C10 Linter | **0 Math.random-Aufrufe** in `combat-arena-v2/` | ✓ warn |
| C1 C2 C3 C9 C11 C12 | ○ warten auf M2 (S1) · M3 (S2) · M5+M6 (S3) · S3 · blinder Leser (S5) · M9 (S1½) | — |

Boot 1,5 s bei warmem Cache (Budget 5 s). **S0-Tor: 7/7 gemessen bestanden, 0 BLOCK gefallen, 6 warten auf ihr Modul.**

## 3 · Sieben stille Fehler, in S0 bezahlt (das ist der Ertrag des Slice)

1. **Rekursiver Takt.** `frameTick` des Wirts v2 rief `h.frameTick` — nach `Object.assign` war das
   dieselbe Funktion. Bild stand, Prüfblatt zeigte `calls 0 · Frame —` bei sichtbarem Hintergrund.
   Fix: `const v1Tick = h.frameTick` VOR dem Assign. *Ein Wirt, der erbt, muss den Vorfahren festhalten.*
2. **Linter zählte seine eigene Erklärung.** `C10` meldete 3 Treffer — alle drei in Kommentaren, die
   den Boden beschreiben. Fix: Kommentare abziehen, `(` verlangen. *Ein Instrument, das sich selbst anzeigt, ist kaputt.*
3. **Toter Wirt nach Hot-Reload.** Ein Canvas trägt genau einen WebGL-Kontext. Entsorgen beim Unmount
   + Wiederaufnahme beim nächsten Mount ergab: `modules 0 · calls 0 · Kamera auf Startposition ·
   Kalibrierung ΔE 21,5 statt 4,0` — und **nichts davon war ein Fehler in der Konsole**. Fix: nicht
   entsorgen, `host.tot` markieren, nur bei totem Wirt neu bauen.
4. **Browser-Cache am Prüfstand.** `fov` stand im Bild auf 34, in der Datei auf 50. Fix: `?v=`-Marke
   an den Modul-Import, Zahl bei jeder Wirt-Änderung erhöhen. *Ein Prüfstand, der eine alte Datei misst, misst nichts.*
5. **Fehlalarm statt Fehlbefund** (Kritiker-Fund). Bei verdecktem Vorschaufenster (rAF gedrosselt,
   `calls 0 · sim 0`) steht die Kamera auf der Startpose von host.v1 — und C8 meldete **62 % als
   gefallenen Boden**, Bilanz »✗ 1«. Fix: C7 und C8 messen nur, wenn ein Bild gelaufen ist, sonst
   `○ Takt steht`. Dazu ein Bild von Hand im Boot (`cam.step` + `render`), damit der Canvas nicht mit
   dem Standbild der letzten Kalibrierung (Referenzkugel groß, Karte nicht zu sehen) startet.
   *Ein Instrument, das bei stehender Uhr ein Urteil fällt, ist so kaputt wie eines, das schweigt.*
6. **Kopfzeile unter dem Blatt** (Kritiker-Fund, gemessen bei 924 px): Status »kalibriert · ΔE 4,06«
   lag bei x 817–910, die Blattkante bei x 486 — vollständig verdeckt. Fix: `padding-right` = Blattbreite
   + 28 px im breiten Modus. **Griff zu kurz** (zweiter Kritiker-Fund): der Rahmen zählte zur Breite
   dazu (424 statt 420), Status lag noch 22 px hinter der Spalte. Fix: `box-sizing:border-box` auf das
   Blatt, Kopf-`padding-right` = Blattbreite + 42 px, `min-width:0` + Ellipse auf den Status.
7. **B1 hing an der Spielkamera** (Kritiker-Fund, der Kopf-Boden des Slice). Nach dem Umzug der Kamera
   auf den Spielstandard (yaw 90°, 7,6 u) las die 7×7-Probe die **Schattenseite** der Referenzkugel —
   der Key sitzt bei (−1,9 / 7,2 / 3,0): `ΔE 10,84 · exposure 1,50 (Decke der Reihe) · 220,185,66 ✗`,
   während dieselbe Szene aus der v1-Startpose ΔE 4,42 las. Damit waren B1 und C8 gekoppelt — verboten.
   Fix: eigene **Kalibrierkamera** im Wirt (feste Pose auf der Lichtseite, Seitenverhältnis des
   Bildpuffers), `host.kalibrierPose()`. Neu gemessen: **ΔE 3,97 · exposure 1,10 · 244,201,71 ✓**,
   unabhängig von yaw und Abstand.
   *Merksatz für den nächsten Slice: eine Messung, die sich mit dem Gegenstand mitbewegt, ist keine.*

## 4 · Zwei Befunde, die den Plan berühren

**a) Spielkamera ≠ Studiokamera.** host.v1 trägt 34° (Porträtobjektiv). Gemessen: bei 34° liegen
~46 % der Karte im Bild, selbst am Abstands-Anschlag 9 u reicht es nicht — C8 (≥ 85 %) wäre mit
Georgs Schulter-Kamera **nie** erfüllbar gewesen. Wirt v2 steht auf **50° vertikal** (≈ 77° horizontal
bei 16:9). Abstands-Reihe bei 50°, Seitenverhältnis 1,19: 6,4 u → 87 % · 7,2 u → 89 % · 8,0 u → 97 %.
**Standard 7,6 u.**

**b) OFFEN für S1 (Georg entscheidet am Bild):** bei 7,6 u ist FB (1,05 u) sieben Körperhöhen entfernt.
»Schulter-Kamera hinter FB« und »Karte ≥ 85 % im Bild« ziehen gegeneinander. Drei Wege, alle messbar:
FB größer (1,4–1,6 u) · C8 gilt nur für die Großansicht in `cleared` statt für `play` · Kamera-Standard
näher (6,4 u) und C8 auf 80 %. **Nicht still entscheiden — das ist eine Anforderungsfrage, keine Zahl.**

## 5 · Umgebung, für den nächsten Slice wichtig

- **rAF ist im Vorschaufenster gedrosselt, wenn `visibilityState hidden`** (ENVIRONMENT CA-4, hier
  wieder gemessen: `sim 0,0` nach 3 s, `calls 0`). Für jede Messung den Takt **synthetisch treiben**:
  `let t = performance.now(); for (let i=0;i<120;i++){ t+=16.7; __CA2.host.frameTick(t); }`
- **Diagnosegriff:** `window.__CA2 = { host, comp, canvas, raf }`. Der Kritiker kann damit Zahlen holen,
  ohne den Bauauftrag zu kennen; kein Zustand hängt daran.
- Konsole nach Boot: nur die bekannte PMREM-Warnung (`sigmaRadians 0.06`, harmlos, RoomEnvironment).

## 5½ · Der PDF-Befund (06.09., gilt für JEDE Szene, die Karten zeigt — auch v1)

Der Card-Builder holte in dieser Umgebung **nie** ein Deck-Artwork; es sah aus wie Langsamkeit, war
aber ein Stillstand. Vier Ursachen, alle einzeln gemessen, alle im Builder behoben:

1. **`isEvalSupported`** — die Vorschau läuft unter einer CSP ohne `unsafe-eval`. pdf.js verschluckt
   den Verstoß und wartet endlos. Mit `isEvalSupported: false` rendert dieselbe Seite in **60 ms**.
2. **Worker von fremdem Ursprung** — ein Modul-Worker vom CDN wird im iframe blockiert, `getDocument`
   hängt ohne Fehler. Worker-Quelle wird jetzt geholt und als **Blob** (same-origin) gesetzt.
3. **`getDocument({url})`** — hängt (Range-Requests ohne `accept-ranges`); `{ data: ArrayBuffer }`
   mit selbst geholtem Puffer läuft. Puffer wird je PDF einmal geholt und geteilt.
4. **`disableFontFace: true`** — eingebettete Schriften über `document.fonts` lösen im verdeckten
   Fenster nicht auf. Pfad-Rendering statt CSS-Schriften: gleiches Bild, keine Naht.

Dazu zwei Regeln, die aus Fehlversuchen stammen: **Auflösung gehört in den Cache-Schlüssel**
(sonst bekommt der Zweite die Pixel des Ersten), und **keine Warteschlange** — der erste Hänger nahm
sonst alle Folgeaufträge mit. Stattdessen **8-s-Frist je Seite**, Eintrag wird verworfen, Aufrufer
nimmt die nächste Karte (bis fünf Anläufe).

**Korrektur einer eigenen Behauptung** (Georg hat sie zu Recht bestritten): Ich hatte notiert, es sei
*seitenabhängig* — Seite 14 des einen Decks rendere in 61 ms, Seite 10 des nächsten nie. Der
Kontrollversuch widerlegt das: zehn Seiten desselben Decks der Reihe nach 94–279 ms, dieselbe Seite
dreimal 2/0/0 ms, **drei Kaltstarts mit frischer Builder-Instanz und drei verschiedenen Decks
888/709/868 ms** inklusive PDF-Abruf. Kein Defekt an bestimmten Seiten. Beide Hänger fielen in
dieselbe Lage: ein noch offener Auftrag lief, und in der Fassung *mit* Warteschlange startete der
neue nicht, sondern reihte sich dahinter ein. Die Frist bleibt als Versicherung, nicht als Diagnose.
*Merksatz: eine einzelne Beobachtung, zweimal gesehen, ist noch keine Ursache.*

## 5¾ · Zwei Achsen: Fläche und Motiv (S1, am Bild entschieden)

**Das Missverständnis, das den Umschalter neu gebaut hat** (Georg 06.09.): »wenn ich auf 18 × 10 gehe
und als Karte ein Viertel eingestellt habe, wird die komplette Page angezeigt«. Ein Knopf trug zwei
Entscheidungen — Feldgröße UND Bildinhalt. Jetzt getrennt:

- **FLÄCHE** — wie groß das Spielfeld in Welt-Einheiten ist: 9 u · 18 u · 36 u breit (Tiefe gemessen).
- **MOTIV** — was darauf liegt: 1 Karte · 1 Seite (4 Karten) · 4 Seiten (16 Karten).

Frei kombinierbar. Eine einzelne Karte auf 18 u ist ein doppelt so großes Feld mit demselben Bild —
nicht mehr Bild. Gemessen (Kartenverhältnis bleibt 1,740, Seitenverhältnis 1,793):

| Fläche × Motiv | Feld | Schärfe |
|---|---|---|
| 9 u · 1 Karte | 9 × 5,17 u | 170 px/u |
| 18 u · 1 Karte | 18 × 10,34 u | 113,8 px/u |
| 18 u · 1 Seite | 18 × 10,04 u | 166,7 px/u |
| 36 u · 4 Seiten | 36 × 20,1 u | ~167 px/u je Seite |

- **Schärfe folgt der Fläche, mit Dach:** angefordert wird `Breite × 170 px/u`, gedeckelt auf 4096 px
  (WebGL-Grenze). Für eine Karte ist der Schnitt halb so breit wie die Seite — auf 18 u reicht das
  Dach nur für 114 px/u. Das ist der ehrliche Preis einer großen Einzelkarte und steht im Prüfblatt.
- **`pdfRes` gehört in die Cache-Leerung des Builders.** Ohne das blieb die Karte bei 85 px/u stehen,
  obwohl 4096 px angefordert waren: der `artCache` gab den Schnitt der alten Auflösung zurück.
- **Entscheidung 06.09. (am Bild, nicht an Zahlen): Fläche 18 u · Motiv 1 Karte · FB 1,2 u**
  (Props-Standard). Georgs Begründung: leicht pixelig, aber das großflächige Motiv lässt FB und
  Gegner deutlich besser erkennen — Lesbarkeit der Figuren schlägt Kantenschärfe des Papiers.
  Nebenbefund gegen die Erwartung: eine einzelne Karte ist nicht »zu pixelig«, der LORE-Text bleibt
  lesbar (`captures/S1-karte-vs-seite`).

### Der Builder ist NICHT neu — und die Fixes gehören zurück ins Repo

`cardbuilder/kfb-card-builder.js` ist die Projektkopie aus **kfb-embed-bundle v3**
(`github.com/georg-doc/kayfabizarro/tree/main/skills/kfb-embed-bundle v3`). Der Feldmodus nutzt nur
einen zweiten Ausgang derselben Lesefunktion (`pageOf` = ganze Seite statt Viertel) — kein zweiter
Renderpfad, keine Parallelentwicklung. **Aber:** die sechs Änderungen dieser Sitzung stecken in der
KOPIE und fehlen in der Skill-Quelle. Ohne sie kommt in Claude-Vorschauen nirgends Artwork an:
`isEvalSupported: false` · Blob-Worker · `{ data: ArrayBuffer }` statt `{ url }` · `disableFontFace`
· Auflösung im Seiten- UND Artwork-Cache-Schlüssel · `pdfRes` in der Cache-Leerung von `setParams`.
- **Verhältnis wird gemessen, nicht gesetzt:** Kartenkanon 1,397 gilt für die Zelle *nach* Beschnitt.
  Das Feld startet mit dem gemessenen Seitenwert (745 × 416 pt = 1,791) und wird an der geladenen
  Seite nachgemessen; Kachel, Tuschekörper und Spielrand werden dann neu gelegt (`onFeld`).
- **Feldpapier ist unbeleuchtet** (`MeshBasic`, `toneMapped: false`) wie das Kartenblatt des Builders.
  Als `MeshStandard` clippte es bei Exposure 1,10 zu 255,255,255 — die weiße Fläche im Seitenmodus.
  Schatten kommen vom Schattenfänger 0,012 u darüber, genau wie auf der Karte.
- **`host.ground` ist im Feldmodus aus.** Die cremefarbene Scheibe (2,2 u) lag bei y −0,004, das Feld
  bei y 0 — das war der »weiße Kreis, der immer wieder aufblinkt«. Wo ein Feld liegt, ist das Feld
  der Grund.
- **Schulterkamera hängt an FB, nicht am Feld** (Abstand ≈ 7 × Figurhöhe). Feldskaliert war die Figur
  auf 18 u ein Fleck auf viel Papier — »bei 18 × 12,9 u wird mir immer nur die page angezeigt«.
- **Knopf-Beschriftungen sind gemessen, nicht getippt** und werden nach jeder Nachmessung erneuert.
- **`pdfRes` muss durch `params:`** (`createCardBuilder({ THREE, params: { pdfRes } })`) — der Builder
  mischt nur `opts.params`. Am Wurzel-Objekt landete es nirgends, und die Karte blieb bei 83,3 px/u,
  während Chat und dieses Dokument »167 für beide« behaupteten. Vom Kritiker gefunden.
  *Merksatz: einen Parameter setzen ist nicht dasselbe wie ihn ankommen sehen.*

- **Enum-Props kommen als STRING.** `breite` war als Enum `[9, 18, 36]` deklariert und traf als `'18'`
  ein: `s.breite === w` verglich Text gegen Zahl, **kein FLÄCHE-Knopf leuchtete**, und die Breite lag
  als Text im `userData` (jede Rechnung `w + …` wäre stille Textverkettung geworden). `Number(...)`
  an jeder Prop-/State-Grenze. Zweiter Fund derselben Klasse wie »leuchtender Knopf ≠ Feld«.
- **Spätes `onArt` schrieb die Zahl der verworfenen Karte** und der Cache lieferte deren Schnitt.
  Nach 9 u → 18 u setzte das alte Artwork seinen Wert (1530 px) auf das neue Feld: 85 px/u statt
  113,8. Drei Ursachen, drei Fixes: **Bau-Nummer** (nur der aktuelle Bau darf messen), **Auflösung im
  `artCache`-Schlüssel** (zeitliches Leeren reicht nicht — ein noch fliegender Auftrag der alten
  Größe füllt den Cache danach WIEDER, und der neue Bau konsumiert den zu kleinen Schnitt), und
  **ein Bau statt zwei am Boot** (`mount()` baut sofort mit dem Vorgabewert; Zielgröße wird jetzt
  davor gesetzt). Gemessen im Startbild ohne Klick: **113,8 px/u, Schnitt 2048 px, `_bau` 1**.
  *Merksatz: einen Cache zeitlich leeren heißt, sich auf Reihenfolge zu verlassen — was den Wert
  unterscheidet, gehört in den Schlüssel.*
- **Der Builder pumpt seine Artwork-Warteschlange nicht, wenn `document.hidden`** (`pump()`:
  `if (busy || !queue.length || document.hidden) return`). Im verdeckten Vorschaufenster bleibt die
  Karte deshalb bei Text ohne Bild — kein Defekt, sondern dieselbe Familie wie CA-4. **Karten-Artwork
  nur in der sichtbaren Ansicht messen**, nie im Hintergrundfenster.

## 6 · Slice S1 — GELIEFERT (Feld + Spieler)

**M1 = `combat-arena-v1/arena-ring.v1.js`, importiert statt nachgebaut.** Georg 06.09.: »wieso bauen
wir etwas, das in v1 schon vorhanden ist«. Der Ring bringt Blatt, Rückseite, Stockwerke und den
Builder-Anschluss mit; v2 hat ihn um die zweite Achse (Fläche × Motiv) erweitert und meldet den Rand
über `field.attach(poly, floorY, 'arena-ring · <motiv>')` an den Wirt. Kein `card-field.v2.js` —
eine Datei weniger ist eine Naht weniger.

**M2 = `combat-arena-v2/player.v2.js`** (neu, 4 Zuständigkeiten): Tempo · Rand · Blick · Clips.
Die Figur kommt per `bind(fb, hoehe)` aus `frizzlebob.v1.js`; das Modul baut keine Figur.

| Sache | Wert (gemessen) |
|---|---|
| Tempo | gehen 1,9 · laufen 3,4 u/s · Beschleunigung 16 u/s² · Reibung 9 u/s² |
| Körperradius | 0,34 u (28 % der Figurhöhe 1,2 u) |
| Sprung | Kraft 4,4 · Schwere 16 u/s² — gemessen: y 0,50 u nach 10 Bildern, `amBoden false` |
| Rand | `field.contain()` → Versatz + Spiegelung an der Normalen, Restitution 0,25 |
| Bewegung | 1,37 u in 30 Bildern bei Diagonaleingabe (≈ 2,7 u/s im Anlauf) |
| Clips | Run ×1,00 bei 3,4 u/s · Walk beim Zielen (1,9 u/s) · Idle im Stand — Namen gesucht, nicht angenommen |

**Boden C1 (BLOCK) ✓ — `0 Verstöße in 60 s · 3601 Schritte · 293 Rand-Kontakte`** (Feld 18 × 10,34 u,
Radius 0,34 u, `maxRaus` 0,0000). Die Probe läuft mit **festem Schritt aus dem Seed-RNG**, nicht mit
echter Zeit: die Uhr ist im verdeckten Fenster gedrosselt (CA-4), ein Beweis darf nicht daran hängen.
Sie fährt denselben `schritt()` wie das Spiel (ein Beweis mit zweitem Rechenweg beweist den zweiten
Rechenweg) und legt den Zustand danach zurück — ein Beweis, der die Welt verändert, ist ein Eingriff.

**Und der Messwert trägt seine Geometrie mit.** C1 meldete nach einem Maßstab-Wechsel grün für eine
Fläche, die es nicht mehr gab (Kritiker 06.09.: angezeigt »0 Verstöße«, gemessen auf 18 × 10,34 u,
live war 9 × 5,17 u; Radius hängt zusätzlich an der FB-Höhe). Zwei Änderungen: `walkProbe` wird bei
jedem Feld- und Figurwechsel verworfen und sofort neu gefahren, und die C1-Zeile nennt Feld und
Radius. Nachgemessen über vier Wechsel: `18 × 10,34 u · r 0,34` → `9 × 5,17 u · r 0,34` →
`r 0,29` (FB 1,05) → `18 × 10,05 u · r 0,29` — jede Zahl deckt sich mit dem lebenden Feld.
*Merksatz, drittes Mal in diesem Dokument: ein Messwert ohne seinen Gegenstand ist eine Behauptung.*

### Offener Punkt: C8 gegen Georgs Maßstab-Entscheidung (Befund 4b, jetzt entscheidbar)

Gemessen mit FB im Bild, Schulterkamera, Feld 18 u · 1 Karte: **C8 = 69 % (69/100 Punkte)**, Soll ≥ 85 %.
Register `warn`, hält also nicht an. Der Boden ist nicht falsch gemessen — er ist für eine andere
Absicht geschrieben: er entstand, als das Spielfeld **die Karte** war (9 u). Jetzt ist das Feld eine
Bühne von doppelter Kartengröße, und Georg hat sie am Bild genau dafür gewählt (Figuren besser
erkennbar). Zwei Ziele ziehen gegeneinander; die Zahl kann das nicht entscheiden.

Drei Wege, keiner still zu wählen:
1. **C8 umschreiben** auf »Kampfzone im Bild« — ein Radius um FB (z. B. 6 u) statt der ganzen Fläche.
2. **Schwelle an die Fläche binden:** ≥ 85 % bei 9 u, ≥ 60 % bei 18 u, ≥ 40 % bei 36 u.
3. **C8 fallen lassen** und durch »FB-Höhe in Bildpixeln ≥ N« ersetzen — das war Georgs eigentliches
   Kriterium (»die Figur besser erkennen«).

## 7 · Drei Etiketten, die etwas anderes sagten als die Messung (06.09., Kritiker)

1. **Slice-Etikett stand auf S0**, ausgeliefert war S1 — und `tor()` schrieb »S0-Tor«, während es S1
   bewertete. Wer nur die Seite liest (ENVIRONMENT.md, Rollenkanal), hielt den Stand für S0. Jetzt
   EIN Ort: `SLICE = 'S1'` im Integrator, `tor(rows, slice)` nimmt ihn als Parameter.
2. **`host.bootMs` war von außen dauerhaft `null`**, intern standen 505 ms. Ursache: der Getter lag
   im Objekt-Literal von `Object.assign` — **`Object.assign` wertet Getter beim Kopieren aus** und
   schreibt das Ergebnis (damals `null`) als feste Eigenschaft. `zeile()` las die Closure und zeigte
   die richtige Zahl; jeder externe Leser bekam die falsche. Jetzt `Object.defineProperty` NACH dem
   Assign. *Merksatz: `Object.assign` kopiert Werte, nicht Zugriffe.*
3. **Und dann war die Zahl selbst falsch:** 40 382 ms bei einem Budget von 5000 — die Wanduhr hatte
   40 s Hintergrund-Pause mitgezählt (rAF gedrosselt, CA-4). Bootzeit gilt jetzt nur, wenn zwischen
   erstem und drittem Bild unter 2 s liegen; sonst bleibt sie leer und nennt den Grund
   (`bootHinweis`). Gemessen bei laufender Uhr: **Boot 414 ms**.

### C8 umgeschrieben — und warum das keine Geschmacksfrage war

Georg 06.09., wörtlich: »ich kann mit den Zahlen ABSOLUT NICHTS ANFANGEN! WIE SOLL ICH DAS
ENTSCHEIDEN?!?« — berechtigt. Eine Prozentzahl über Kartenfläche ist keine Entscheidungsgrundlage,
und die Frage war überhaupt nur nötig, weil der Boden das falsche Ding misst.

**Fassung 1:** »≥ 85 % der Karte im Bild«. Entstand, als das Spielfeld DIE KARTE war (9 × 5,2 u).
**Das Problem:** die Quote fällt zwangsläufig, je größer die Bühne wird — sie bestraft genau die
Entscheidung, die Georg am Bild getroffen hat, und sie misst nie das, was diese Entscheidung trägt.
Seine Begründung war: »durch die großflächigeren Motive erkennt man die Figur/FB besser«.

**Fassung 2 misst die Figur:** FB-Höhe in Prozent der Bildhöhe, Schwelle **≥ 10 %**. Die Zahl kommt
aus der von ihm FREIGEGEBENEN Ansicht (18 u · 1 Karte · FB 1,2 u · Schulterkamera 8,4 u): dort ist
FB **142 px bei 1182 px Bildpuffer = 12 %**. Die Schwelle liegt bewusst darunter — sie soll den
Rückschritt fangen (FB wird zum Fleck), nicht den Normalfall. Der Kartenanteil steht weiter in der
Zeile, aber **ohne Schwelle**: `✓ FB 12 % der Bildhöhe (142 px) · Karte 69 % im Bild`.

Eine Zwischenfassung stand auf 12 % und meldete damit die freigegebene Ansicht als gefallen — eine
Schwelle, die den eigenen Auftrag nicht besteht. *Merksatz: ein Boden, der genau auf dem
freigegebenen Bild sitzt, ist kein Boden, sondern eine Zufallsschranke.*

**S1-Tor: 6/6 gemessen bestanden, 0 BLOCK gefallen, 6 warten auf ihr Modul.**

## 8 · Slice S1½ + S2 — GELIEFERT (Schrittmaß und Gegner)

### M9 `locomotion.v2.js` — die Füße rutschen nicht mehr

Das Verfahren war schon da: `modules/kfb-stride-measure.js` (Standfuß-Drift, 05.09.) und
`schrittmass.json` (41 Cube-Körper, davon 23 mit Beinen). M9 ist der **Anschluss**, kein Nachbau.

- **FB steht NICHT in der Tabelle** (anderes Pack: Rohhöhe 3,57 gegen 2,01 beim Cube-Hasen), also
  wird er live vermessen — vier benannte Füße (`FootR/L`, `LowerLegR/L`), Verfahren identisch.
  Gemessen bei Figurhöhe 1,2 u: **Walk 0,63 u/s · Run 1,71 u/s · Run_Gun 1,53 u/s**.
- **Damit war mein angenommenes Tempo falsch:** 1,9 / 3,4 u/s hätten den Walk-Clip dreifach laufen
  lassen, die Rate wäre in ihre Klemme gefahren und die Füße wären sichtbar gerutscht (Faktor 1,16).
  **Das Tempo folgt jetzt dem Schrittmaß:** `Tempo = Schrittmaß × 1,6` → gehen 1,01 · laufen 2,73 u/s.
  Gemessen: **Rutschfaktor 1,00** in beiden Rollen, keine Klemme. Boden C12 ✓.
- **TAKT statt SCHRITT für die beinlosen Körper.** Die 21 Cube-Monster haben keine Füße (Armature:
  `Body Mouth Head …`), ihr »Walk« ist ein Wippen des Rumpfes. Es gibt dort keine Strecke, also
  keinen Rutschfaktor. Sie werden ausdrücklich als `takt` geführt — nicht als kalibriert, nicht als
  Fehler. *Ein Faktor über etwas, das nicht gemessen ist, sieht aus wie eine Messung.*

### M3 `mobs.v2.js` — drei Gegner, dieselbe Naht

- Körper aus `modules/kfb-monster-roster.js` (21 MonsterCuteCubes, Höhen/Clips/Blickachse gemessen
  04.09.), Höhe 0,7–1,1 × FB, **gemessen und dann skaliert**, Füße auf den Boden statt auf den Ursprung.
- **Spawn ist Verwerfungs-Auswahl, kein Zufall mit Daumen:** Punkt ziehen, Feld prüfen, Kantenabstand
  prüfen, 2,2 u zu FB und untereinander prüfen, sonst neu ziehen. Boden C2 ✓ — **kleinster gemessener
  Abstand 2,91 u**, drei von drei gesetzt (1–2 Züge je Mob).
- **Rand: derselbe Aufruf, andere Reaktion.** `field.contain()` wie beim Spieler, aber ohne Bounce —
  ein Mob, der über die Kante geschoben wird, fällt und wird neu gesetzt (MASTERPLAN §4).
- Verhalten in einem Satz: weiter als Bissweite (2,4 u) → hingehen, ab dort **halten — gemessen
  2,40 u bei allen drei** (stehender FB, 1200 Bilder). Erste Fassung nullte nur das Soll-Tempo und
  ließ den Körper auslaufen: er fuhr über die Linie und parkte bei **2,16 u**, während im Modul und
  in diesem Dokument 2,4 u stand. Das ist mehr als Kosmetik — ein Mob, der dauerhaft INNERHALB der
  Bissweite steht, lässt den Projektil-Zweig von S3 nie zum Zug kommen, und `enemyShot()` wäre
  importiert, ohne je zu feuern. Jetzt wird die Position an der Linie geklemmt, nicht nur das Tempo
  genullt. *Ein Abstand ist eine Regel, kein Ergebnis.*
  Kein Schuss, kein Schaden — der Mob-Schuss kommt in S3. *Ein Modul, das zu früh schießt, verdeckt,
  ob das Laufen stimmt.*

**S2-Tor: 8/8 gemessen bestanden, 0 BLOCK gefallen, 4 warten auf ihr Modul.**
Kosten: 33 Draw-Calls · 0,5 ms Median · 21 918 Dreiecke (Budget 110 / 8 ms).

### Zwei stille Fehler, in diesem Slice bezahlt

1. **C12 fragte den falschen Zeitpunkt.** Im Stand rutscht nichts — die Zeile stand dauerhaft auf
   »alle stehen«. Der Boden gehört zum gemessenen LAUF: er liest jetzt einen **eingefrorenen Beweis**
   aus dem Lauftest (wie C1) und wird bei jeder Änderung neu gefahren. Die `[loco]`-Zeile zeigt
   weiter den lebenden Zustand. Zwei Fragen, zwei Zahlen — nicht eine, die beides sein soll.
2. **Doppelte Szene nach Hot-Reload.** Der Wirt wird wiederaufgenommen (er lebt, sein Canvas ist
   derselbe), aber Karte, Figur und Gegner wurden neu gebaut: die Szene trug zwei Sätze
   (`arena-ring`, `frizzlebob`, `mobs` doppelt) — doppelte Draw-Calls, zwei Figuren auf demselben
   Platz. *Wer neu baut, räumt zuerst.*
3. **Der Lauftest ließ sein Tempo liegen.** `probe()` sicherte Position, Geschwindigkeit, Sprünge und
   Blick — aber nicht `tempo`. Danach stand dort das letzte simulierte Lauftempo (2,55 u/s), während
   die Figur ruhte, und M9 las es als lebendes Tempo: Walk-Referenz gepaart mit Run-Tempo, Rate in
   der Klemme, gemeldete 0,54 — direkt neben einem C12, das 1,00 sagte. Dazu ein zweiter Teil: die
   Anmeldung lief nur `wenn Tempo > 0,15`, also aktualisierte ein STEHENDER Körper seinen Eintrag
   nie und die alte Registrierung blieb für immer stehen. *Wenn eine Probe verspricht, die Welt nicht
   zu verändern, gilt das für jedes Feld, das sie anfasst — und »steht« ist ein Zustand, der ankommen
   muss.*
4. **Die Bootzeit maß die falsche Pause.** Der Riegel prüfte die Spanne zwischen erstem und drittem
   Bild; die Hintergrund-Pause liegt aber zwischen Wirt-Erzeugung und ERSTEM Bild. Kamen die drei
   Bilder als Block, meldete er 14 723 ms als gültige Zahl bei Budget 5000 — genau das, was §7.3
   als behoben ausgab. Jetzt werden BEIDE Spannen geprüft; im gedrosselten Fenster bleibt die Zahl
   leer und nennt den Grund.

5. **Die Mobs steckten ineinander, sobald FB am Rand stand.** Das Halteband klemmt jeden Mob EINZELN
   auf den 2,4-u-Kreis um FB — in der Ecke ist der noch im Feld liegende Teil dieses Kreises ein
   schmaler Keil, also konvergierten alle drei auf denselben Punkt: gemessene Paarabstände
   **0,11 / 0,15 / 0,26 u** bei Radiensummen um 0,65 u, drei Monster als ein Geometrie-Klumpen. Die
   Spawn-Regel (2,2 u) galt nur beim SETZEN; zur Laufzeit galt gar nichts. Jetzt gilt ein Trennschritt
   über alle Paare (Radiensumme + 0,12 u Luft, Schub auf beide, danach fragt jeder wieder das Feld) —
   gemessen in der Ecke: **Reserve 0,12 u, FB-Abstand 2,40 u, alle inside**. Und C2 prüft es: der
   Boden hatte nur den Spawn im Text, während der Laufzeitwert sichtbar im Blatt stand, ohne dass ihn
   jemand fängt. *Ein Wert, den kein Boden fängt, wird nicht geprüft — auch wenn er im Blatt steht.*
   Weil ein Spieler im Kampf an den Rand gedrängt wird, war das der Normalfall, nicht der Eckfall.
6. **Und beim Reparieren gleich zwei eigene Fehler:** die Laufzeit-Probe legte ihren Wert auf `min` —
   dasselbe Feld, das die Spawn-Zahl trägt — worauf C2 den Spawn als gefallen meldete (0,77 gegen
   2,2 u), obwohl er 2,91 u ergeben hatte. *Eine Zahl, die zwei Fragen beantworten soll, beantwortet
   keine.* Dazu stand in M9 `this.koerper = new Map()` HINTER dem `await` des Modul-Imports; in
   diesem Fenster fragen Wirt und Prüfblatt schon `tor()` und `zeile()` → »this.koerper is not
   iterable«, ein Konsolenfehler, der C6 kippte. *Erst die Felder, dann das Warten — ein Objekt, das
   noch lädt, muss trotzdem antworten können.*

## 9 · Vier Änderungen aus Georgs Durchsicht (06.09., nach S2)

### Steuerung: A/D drehen, Q/E seitlich

Vorher lagen A/D auf dem Seitschritt und Drehen ging nur mit der Maus — auf einem Trackpad eine Hand
zu viel. Jetzt: **W/S vor und zurück · A/D drehen (2,4 rad/s) · Q/E Seitschritt · Space Sprung**,
Maus dreht weiter. Gemessen: A hält 0,5 s → 66,5° gedreht; E hält 0,5 s → 1,14 u seitlich.
Die Pfeiltasten behalten die alte Belegung.

### Gegner waren zu dunkel — zwei Ursachen, nicht eine

Georg: »die enemies wirken noch sehr dunkel … weniger grau/verwaschen«. Gemessen an `q_tree`:

1. **Das Material kam als `MeshBasicMaterial` — unbeleuchtet.** Kein Key, kein Fill, kein
   Umgebungslicht erreichte es; die Figur konnte nie heller sein als ihre Textur. Jetzt
   `MeshStandardMaterial` (Map und Farbe übernommen, Rauheit 0,72, Umgebungslicht 0,35).
2. **Die Atlas-Textur selbst ist dunkel:** mittlere Helligkeit **0,172**, Sättigung 0,342. Behandelt
   wird sie von `modules/kfb-monster-look.js` (Pet Studio v12) — importiert, nicht nachgebaut. Mit
   Sättigung ×1,5 und Wert ×2,1 steht sie bei **0,337 / 0,513**.

Am Bildschirm gemessen (Leuchtdichte am Körper): Tree **81 → 101**, GreenDemon **98 → 117**.
Weiter aufhellen würde die Figuren flach machen — die Grenze ist der Kontrast, nicht der Regler.

### Werkzeug ist zugeklappt

»Die ganzen Paletten und Button-Blöcke stören.« Maßstab-Reihen, Prüfgriffe, Bilanzstreifen und
Prüfblatt hängen jetzt an EINEM Knopf im Kopf (`Werkzeug`), Standard **zu**. Sichtbar bleibt eine
Zeile: Titel, Slice, Status. Das Bild ist die Arbeit, das Werkzeug ist Beiwerk.

### Der gelbe Kreis — die Ursache gilt für AOE und VFX

Der Ring flackerte »ohne Interaktion«, und das ist kein Shader- und kein Alpha-Problem:
**er lag auf einer festen Höhe über einem bewegten Grund.** `arena-ring.v1.js` lässt das Blatt atmen
(`float.amp` 0,035 u, Periode 5,2 s) — der Boden wandert also um ±3,5 cm auf und ab, während der Ring
auf seiner Starthöhe (`floorY() + 0,03` beim Bauen) stehen blieb: die halbe Periode liegt er unter dem
Papier und ist verdeckt, die andere darüber.

**Regel für S3 und später:** alles, was flach auf der Karte liegt — AOE-Ringe, Trefferdecals,
Zielmarker, Schattenflecken — wird **Kind des Kartenknotens** (`ring.current`), nicht Kind der Szene.
Dann atmet es mit. Wer es in der Szene lässt, muss seine Höhe **jedes Bild** aus `floorY()` nachziehen.
Beides ist richtig; ein fester Wert ist es nie. Der Ring selbst ist gestrichen (Georgs Entscheidung).

## 10 · Drei Nachträge aus Georgs zweiter Durchsicht (06.09.)

**Gegner ein Viertel kleiner.** »Wenn wir die Eyeballs als Größenmaßstab nehmen, müssten die ungefähr
ein Viertel kleiner sein.« Vorher 0,7–1,1 × FB-Höhe, jetzt 0,52–0,82 — gemessen stehen die drei bei
0,65 / 0,74 / 0,96 u gegen FB 1,20 u. Die Streuung bleibt: die Größenunterschiede des Packs sind Teil
seiner Identität (Roster-Kanon), ein Gleichmachen hätte sie weggerechnet.

**Der Sprung ist eine Kette, kein Zustand.** Die erste Fassung kannte nur Idle · Walk · Run — Georgs
Befund war richtig. FB bringt `Jump`, `Jump_Idle` und `Jump_Land` mit, und sie gehören in dieser
Reihenfolge gespielt: Abdruck einmal (nicht wiederholend), Flug solange er in der Luft ist, Aufsetzer
einmal, dann zurück in die Bodenkette. Gemessen: `Jump` (y 0,25) → `Jump_Idle` (y 0,56) →
`Jump_Land` → `Idle`. Die Zeitraffung gilt weiter NUR für Walk und Run: ein Sprung hat kein
Bodentempo, er hat eine Wurfhöhe — sein Clip mit dem Lauftempo zu strecken wäre eine Zahl an der
falschen Stelle.

**Rennen gehört auf Shift.** Vorher rannte FB, sobald er sich bewegte — damit war der Walk-Clip tot
und die Unterscheidung, nach der Georg gefragt hat, gab es tatsächlich nicht. Jetzt: gehen ist der
Normalfall (**0,99 u/s, Walk**), Shift ist die Entscheidung (**2,70 u/s, Run**), rechte Maustaste
(Zielen) hält ihn im Gehen. Beide Tempi kommen weiter aus dem gemessenen Schrittmaß, nicht aus einem
Regler.

## 11 · Zwei Korrekturen und Slice S3 — GELIEFERT

### Größe: zweiter Anlauf, weil ich den ersten falsch gelesen habe

Georg 06.09. erst »ungefähr ein Viertel kleiner« — ich habe daraus ×0,75 der Ausgangswerte gemacht
(0,52–0,82 × FB), und am Bild war das zu viel: »vom Gefühl her sind die jetzt ein bisschen zu klein
geworden«. Gemeint war *ein bisschen* kleiner als vorher. Jetzt **0,62–0,95 × FB** → gemessen
0,77 / 0,88 / 1,12 u gegen FB 1,20 u.

### Abstand: die Radiensumme ist keine Aufstellung

»Zumindest bei der Startaufstellung (und im Kampf) auch gucken, dass die enemies nicht zu nah
beieinander stehen.« Der Trennschritt zielte auf **Radiensumme + Luft** (≈ 0,5 u) — das ist die
Grenze, an der sich Modelle *durchdringen*, und sie war als Aufstellung viel zu eng. Jetzt gilt ein
**sozialer Abstand von 1,6 u**, unabhängig von den Radien (auf dem 2,4-u-Kreis um FB bleibt Platz:
Umfang 15 u, drei Plätze à 5 u Bogen). Gemessen im Kampf: Laufzeit-Reserve **2,92 u**.
*Zwei Grenzen, zwei Zahlen — die eine verhindert Durchdringung, die andere macht eine Aufstellung.*

### S3: `gunfight.v2.js` (M5 + M6)

Drei der vier Teile sind importiert: **Munition** `modules/kfb-weapon-dice.js` (Würfel mit Augen,
Ersatzwürfel bei 404), **Gegenfeuer** `enemyShot()` aus `modules/kfb-combat-def.js` (die Werkbank v13
hat die Cube-Monster schon als Schützen), **Treffer** `host.fx.impact()` — Semantik vor Darstellung.
Eigen ist nur die Kette und ihre Zählung.

| Sache | Wie es läuft |
|---|---|
| Spielerschuss | Maustaste · Würfel mit leichtem Bogen, 11 u/s, Takt 0,28 s, Schaden 14 |
| Gegenfeuer | **Projektil ab 2,4 u**, darunter **Biss** — genau die Schwelle, für die die Halteweite geklemmt wurde |
| Kill | Todes-Clip falls der Satz ihn hat (Cube9 hat keinen — kein Ersatz, der etwas vorspielt) |
| Würfel | einer je Kill, taumelt, wird ab 1,1 u eingesogen, liegt 14 s |

**Boden C3 (BLOCK) ✓ — `3 Kills = 3 Würfel = 3 Pops`** bei 11 Schüssen / 10 Treffern (Schießprobe,
14 Anläufe, ohne Maus: der Beweis darf nicht am Zeigefinger hängen).
**Boden C9 (warn) ✓ — kleinster Abstand zur Schutzzone +0,43 u** (Zone 0,50 u = 0,42 × Figurhöhe).
Emissionen im Gesicht werden **nach außen geschoben**, nicht unterdrückt: der Treffer bleibt sichtbar,
die Augen bleiben frei. Bei FB ist das Gesicht die halbe Figur.

**S3-Tor: 10/10 gemessen bestanden, 0 BLOCK gefallen.** Offen: C4 (FX-Pool im Gebrauch), C5 (S4),
C11 (Blindvergleich, Mensch).

### Drei Fehler in S3, alle aus derselben Familie

1. **Tote Mobs blieben vollwertige Körper.** `_kill` setzte nur `tot`/`weg` und nahm den Knoten aus
   der Szene — der Eintrag blieb in `mobs`. Gemessen (Kritiker 06.09.): die Leichen liefen weiter
   (1,01 u/s, Positionen wanderten über 300 Bilder), wurden weiter getrennt und geklemmt, meldeten
   sich weiter bei M9 an — und **C2, ein BLOCK-Boden, bestand auf Geisterdaten**: »3 Mobs · Reserve
   0,00 u«, während kein Gegner mehr lebte. Und im LIVING stand als Zusage genau das Gegenteil.
   Jetzt: `mb.entfernen(m)` nimmt Szene, Array und M9-Anmeldung in einem Schritt; C2 sagt bei leerem
   Feld »kein Gegner mehr am Leben — kein Laufzeit-Abstand prüfbar« (~) statt ein ✓ über Leichen.
   *Wer stirbt, verlässt die Liste. Alles andere ist Buchhaltung mit Toten.*
2. **Der Würfel war so groß wie ein Monster — und danach 5× zu klein.** Erste Fassung skalierte blind
   (×0,5 → Kante **1,27 u**). Zweite Fassung teilte durch `stats().mass` (2,70) — das sind die
   Rohmaße der GLB-DATEI *vor* der Normierung, die das Modul selbst vornimmt: Ergebnis **0,042 u**,
   ein 4-cm-Würfel, im Bild unsichtbar. Und meine Prüfung bestätigte die eigene Rechnung
   (`scale × Teiler = 0,18`) statt die Geometrie. Jetzt wird EINMAL ein Muster gebaut, mit `Box3`
   gemessen (0,52 u = Modulkanon) und daraus normiert; **am Objekt nachgemessen: Geschoss 0,216 u,
   Beutewürfel 0,209 u**. *Am Objekt messen, nicht am eigenen Rechenweg — sonst bestätigt die
   Prüfung die Annahme.*
3. **C12 nannte Körper, die es nicht mehr gab:** »1/4 Körper«, während nur noch FB angemeldet war.
   Der eingefrorene Beweis stammte vom Boot-Lauftest mit vier Körpern; verworfen wurde er bei Feld-
   und FB-Wechsel, aber nicht, wenn Körper STERBEN. Jetzt meldet `mb.entfernen()` das dem Wirt
   (`onWeg`), der Beweis fällt auf ○ — mit Grund: »Körper haben sich geändert — Lauftest neu fahren«.
   *Ein Nenner ist auch eine Messung.*
4. **Ein anonymer Konsolenfehler.** Eine Zeile »Cannot read properties of undefined (reading
   'length')« ohne Spur, nicht reproduzierbar, keinem Modul zuzuordnen. Die Ursache ist damit nicht
   bewiesen — also wurde die Diagnose verbessert statt eine Vermutung eingebaut: FX-Anker und
   `impact()` laufen jetzt durch einen Mantel, der jeden Ausfall **mit Ankernamen** ins Log schreibt.
   Nach dem Umbau: 0 Fehler über Boot, Schießprobe und 240 Bilder. Sollte er wiederkommen, hat er
   ab jetzt einen Namen.

## 12 · Georgs Frage nach der Werkbank — und die ehrliche Antwort

»Für die Munition bzw. das Schießen, Treffer und die ganzen VFX/SFX hast du jetzt aber irgendwas
selber gebaut oder …? Das sind zumindest nicht das Paket aus KFB VFX Werkbank v13?«

**Die Aufrufe waren richtig verdrahtet — aber die Foundation war nie gebootet.** Gemessen:
`fx.bereit false`, `fx.state 'nicht gebootet'`. M5 ruft `fx.impact()` und `fx.cue()`, und beide geben
bei nicht gebooteter Foundation still `null` zurück. Es lief also **kein einziger Effekt** aus der
Werkbank: kein Sprite, kein Treffer-Blitz, kein Mündungsfeuer, kein Ton. Was zu sehen war, waren
meine zwei Meshes (Würfel aus `kfb-weapon-dice`, Mob-Kugel selbst gebaut). Georgs Verdacht war
berechtigt.

Drei Änderungen:

1. **Foundation bootet beim Start** (700 ms nach dem Wirt). Gemessen danach: `VFX bereit · Atlas 4×5
   · Pool 220`, nach einem Schuss 4 lebende Sprites. Ton bleibt an der ersten Geste hängen — das ist
   Browser-Regel, kein Fehler (Knopf »Ton an« oder ein Klick ins Bild).
2. **Das Mob-Geschoss kommt jetzt aus dem Rezept, nicht aus meinem Kopf.** `enemyShot()` liefert
   Tempo (**12 u/s**, nicht meine 7), Farbe, Blitzfarbe, Mündungszelle (`charge`), Mündungsgröße,
   Heft und Energieart (`electric`) — je Roster-Eintrag. Auch der Treffer läuft mit der Energieart
   in `fx.impact()`, statt pauschal »fur« zu melden.
3. **Mündungsfeuer** wird als Atlas-Zelle emittiert (`charge`), nicht gemalt: Größe und Farbe aus
   dem Rezept beim Gegner, aus der Figurhöhe beim Spieler.

## 13 · FB schoss seitlich — und hat jetzt eine Waffenhaltung

»FB schießt seitlich oder nach hinten …?« — richtig, und die Ursache ist einfach: die **Richtung** kam
aus der Kamera, die **Figur** drehte sich aber nach ihrer Laufrichtung. Wer zielt, schaut hin. Jetzt
dreht `blickAuf()` FB weich in die Schussachse (doppelte Drehgeschwindigkeit) und hält ihn dort
0,75 s. Gemessen: Kamera auf −90°, FB vorher 0° → nach dem Schuss **−90°**, exakt die Schussachse.

»FB hat (noch) keine Gun — die sollten wir für Muzzle und Zielrichtung nehmen, falls nicht zu
komplex?« Ein Waffenmodell gibt es im Repo nicht, aber **das Rig hat, was man dafür braucht**:
Knochen `FistR`/`FistL` und die Haltungen `Idle_Gun · Walk_Gun · Run_Gun · Idle_Shoot · Run_Shoot`
(gemessen an der geladenen Figur). Also:

- **Mündung = rechte Faust** (Weltposition des Knochens, 0,12 u in Blickrichtung davor) statt einer
  gerechneten Kopfhöhe. Sobald ein Waffenmodell dazukommt, hängt es an derselben Faust — der
  Ursprung ist schon jetzt der richtige.
- **Waffenhaltung**, solange gezielt wird: `Idle_Gun` / `Walk_Gun` / `Run_Gun` statt der Laufreihe.
  Gemessen nach dem Schuss: Clip `Idle_Gun`, Mündung `FistR (Knochen)`.

Offen und klein: ein Waffenmodell (Blaster o. ä.) an `FistR` hängen — dann kommt die Mündung aus der
Waffenspitze statt aus der Faust. Das ist ein Asset-Thema, keine Mechanik.

## 13 · Zwei stille Fehler IN der Werkbank-Anbindung (Kritiker 06.09.)

Die Foundation lief — aber sie zeigte das Falsche, und beides war unsichtbar, weil `SpriteFx`
großzügig ist:

1. **Jedes Sprite war weiß.** Der Farbschlüssel heißt `color`; das ganze Projekt übergab `col`.
   Gemessen: `{col: 0xff0000}` → **ffffff**, `{color: 0x00ff00}` → **00ff00**. Damit kam die gesamte
   Farbsemantik der Werkbank nie an: Bolzenfarbe je Roster-Eintrag, Blitzfarbe, Tint je Oberfläche
   (`bone f3ead3 · fur bfae86 · metal fff3cf`) — während §12 dieses Dokuments sie als »aus dem
   Rezept« auswies. Übersetzt wird jetzt **an einer Stelle** (`fx.opt()`), nicht an vier Aufrufern.
2. **Die Mündungszelle `charge` gibt es im Atlas nicht.** `enemyShot()` spricht Rezept-Vokabel, der
   Atlas hat `muzzle`. `SpriteFx` mappt Unbekanntes über `Math.max(0, indexOf)` auf Index 0 —
   **jedes Mündungsfeuer zeigte den Explosions-Glyph**, und ein Tippfehler in einem Zellnamen wäre
   nie aufgefallen. Jetzt: kleine Tabelle (`charge→muzzle`, `orb→plasma`, `flash→muzzle`, `hit→star`)
   und für alles Unbekannte **eine Log-Zeile mit der Atlas-Liste**. Gemessen: `zelle('charge')` →
   `muzzle`, `zelle('gibtsnicht')` → `burst` + Zeile im Log.

*Merksatz: eine Schnittstelle, die Unbekanntes stillschweigend auf den ersten Eintrag abbildet,
verwandelt jeden Vokabelfehler in eine Designentscheidung.*

## 14 · Die Mündung, dritter Anlauf — und warum die Zielzahl nicht stimmte

Erste Fassung: gerechnete Kopfhöhe (`0,62 × Figurhöhe` = 0,74 u) — optisch brauchbar, aber ohne
Bezug zum Körper. Zweite Fassung: `FistR`-Knochen — und damit **y 0,30 u bei 1,20 u Figurhöhe**, also
Schienbeinhöhe, weil die Faust im Kenney-Rig auch in der Gun-Pose neben dem Bein hängt (kurze Arme).
Der Kritiker hat das gemessen und ~0,6–0,78 u gefordert (0,5–0,65 × Höhe).

**Diese Zielzahl unterstellt menschliche Proportionen — FB hat sie nicht.** Gemessen an der geladenen
Figur (Anteil der Gesamthöhe 1,186 u): `Hips 11 % · FistR 16 % · Torso 28 % · **ShoulderR 32 %** ·
Neck 44 % · Head 48 %`. Kopf und Ohren sind die **halbe** Figur; 0,6 u wären mitten im Kopf, nicht in
der Brust. Die Brustlinie dieser Figur liegt bei 0,38 u.

Dritte Fassung, und sie nimmt von jedem Knochen die Achse, in der er stimmt:
**X/Z aus der Faust** (sie zeigt, wo die Waffe sitzt, plus 0,12 u nach vorn), **Y aus `ShoulderR`**
(0,391 u), Rückfall `0,58 × Figurhöhe`, wenn ein Rig keine Schulter hat. Gemessen: Geschoss startet
bei **y 0,405 u** — Brusthöhe dieser Figur, doppelt so hoch wie die Faust.
*Ein Knochen ist nicht automatisch ein Mündungspunkt — nachmessen, in welcher Achse er stimmt.
Und eine Zielzahl aus menschlichen Proportionen taugt nicht für eine Figur, deren Kopf die halbe
Körperhöhe ist.*

**Dazu die Diagnose für den anonymen Fehler:** `fx.step()` kapselt jetzt Sprites, Trails und Cues
**einzeln** — ein Ausfall nennt seinen Teil (`cues.update fällt aus: …`), schaltet nur diesen Teil ab
und lässt den Takt laufen. Nach dem Umbau: 0 Fehler, `fx.ausfaelle` leer, Tonbank geladen
(59 Cues, 0 nicht gefunden). Der Fehler war nicht reproduzierbar — kommt er wieder, hat er ab jetzt
einen Namen und kostet keinen Frame.

## 15 · Der anonyme Fehler war dreimal dasselbe Muster

Die Zeile »Cannot read properties of undefined« verfolgte diesen Slice, war nicht reproduzierbar und
ließ sich keinem Modul zuordnen. Statt zu raten, wurde die **Diagnose** verbessert (`fx.step()` in
drei einzeln gekapselte Teile, jeder Ausfall mit Namen) — und daraufhin nannte der Fehler sich selbst,
dreimal hintereinander, immer als dieselbe Ursache:

| Modul | Feld hinter dem `await` | Fehlertext |
|---|---|---|
| M9 `locomotion` | `koerper = new Map()` | `… (reading 'length')` |
| M5 `gunfight` | `zaehler = {…}` | `… (reading 'kills')` |
| M3 `mobs` | `mobs = []` | `… (reading 'filter')` |

**Der Bauplan des Fehlers:** `init()` ist `async` und wartet auf Modul-Importe (Roster, Look-Schicht,
Messwerkzeug, Würfel-GLB). Das Prüfblatt rendert in dieser Zeit weiter und ruft `zeile()` und
`probe()` — Methoden, die auf Zustand zugreifen, der erst NACH dem `await` gesetzt wurde. Es ist kein
Ladefehler, sondern ein Zeitfenster, das man nur sieht, wenn jemand hineinschaut.

Behoben in allen drei Modulen als **Klassenfelder**: der Zustand steht vor jedem `await`.
Gemessen danach: **0 Fehler, S3-Tor 11/11 gemessen bestanden**, `fx.ausfaelle` leer.
*Merksatz: ein `async init()` teilt ein Objekt in zwei Objekte — eines, das antworten kann, und eines,
das noch lädt. Wer nur das zweite baut, bekommt Fehler ohne Absender.*

Dazu der Kritiker-Fund, der die Kette ausgelöst hat: **C2 zählte im 0,9-s-Fenster des Todes-Clips
Leichen als Lebende** (»3 Mobs am Leben« bei hp −13/−3/−13). M5 hält den Körper absichtlich so lange
im Array, damit der Clip spielen kann — aber gemessen werden darf nur, was lebt. `lebende()` ist jetzt
die einzige Liste, aus der ein Messwert kommt; geschoben (`_trennen`) werden weiter alle Körper, damit
keine Leiche in FB steckt. Die Prüfblatt-Zeile sagt es wörtlich: »3 Körper im Todes-Clip, keiner am
Leben«.

## 16 · Georgs Durchsicht am Kampf (06.09.) — was stimmte und was ich gebaut hatte

### Die ehrliche Antwort auf »hast du da was selber gebaut?«

**Ja, das Gegnergeschoss.** Die Werkbank v13 liefert dafür **kein Modell**: `enemyShot()` gibt Tempo,
Farbe, Blitzfarbe, Mündungsgröße und Energieart — `kfb-vfx-recipes.js` sagt über sich selbst
»eine Tabelle: Daten, kein Zeichner«. Munitions-**Modelle** gibt es genau zwei im Repo: Würfel
(`kfb-weapon-dice`) und Augapfel (`kfb-weapon-eyeball`). Der grüne Ball war meine Kugel in der
Rezeptfarbe. Offen für den nächsten Slice: den Bolzen aus `kfb-fx-trails` (Ribbon) bauen statt als
Kugel, oder die Augapfel-Munition für Gegner nehmen.

### Die Sterne waren nicht anders — sie waren größer gerastert

Die frühen Effekte kamen als `burst`-Zelle in Gold aus der C4-Probe (Größe 0,45). Die Treffer wählen
ihre Zelle nach Oberfläche (`star` bei Metall, `puff` bei Organischem) — der sichtbare Unterschied
war aber **Auflösung**: der Atlas wurde mit **256 px** gebaut, bei 4×5 Zellen also **64 px je
Effekt**. Daher Georgs »Strichlerei«. Jetzt **1024 px** → 256 px je Zelle.

### Sechs Korrekturen, alle aus seiner Liste

| Befund | Ursache | Behoben |
|---|---|---|
| »Impacts außerhalb der Figur, wie ein Schutzschild« | Schutzzone 0,42 × Höhe = **0,50 u** Kugel um den Kopf, dazu Trefferradien mit Zuschlag (`+0,18/0,22 × Höhe`) | Zone **0,18 × Höhe = 0,22 u** (das Gesicht, nicht der Oberkörper); Trefferprüfung = Körperradius + Geschossradius, **ohne Zuschlag** |
| »SFX für FB fehlen« | Cue-Name `launch.dice` **existiert nicht** in der Bank (59 Cues); `launch.enemy` schon — deshalb klangen nur die Gegner | Würfelwurf spricht `launch.scrap` (kinetischer Wurf); Roster-Oberflächen (`fur`, `plant`, `slime`) werden auf die Bank-Vokabel abgebildet, sonst bleibt der Treffer stumm |
| »Enemies feuern ohne Sound, erst nach FB-Schuss« | Ton startet nach der **ersten Geste** (Browser-Regel) — FBs erster Klick war diese Geste | bleibt so, ist keine Wahl; der Knopf »Ton an« macht es vorher |
| »Auto-Target als Setting=on« | fehlte | Kegel 0,6 rad, Reichweite 9 u, nächstes lebendes Ziel; **Standard an** |
| »Würfel größer und farbcodiert« | Kante 0,21 u, immer Papierweiß | Kante **0,30 u**, Farbe = Bolzenfarbe des Gegners, der ihn fällt |
| »Enemies unterschiedlich groß« | Streuung 0,62–0,95 × FB | **0,80–0,90 × FB** → gemessen 0,97 / 1,00 / 1,07 u |

### Der Ladeprozess: ein Vorhang statt einer Vorstellung

»Erst kommt die große Karte mit großem FrizzleBob, dann irgendwelche Sternchen, dann schrumpft das
… teilweise 30 Sekunden und sehr unsauber.« Jeder Schritt ist für sich richtig — Papier sofort, Seite
später, Figur nach der Messung skaliert, Gegner einzeln geladen — **nur darf man beim Bauen nicht
zusehen.** Karte, Figur und Gegner sind jetzt unsichtbar, bis alles gemessen und gesetzt ist; davor
liegt ein Vorhang, der den Schritt nennt (»Karte …«, »FrizzleBob …«, »Gegner …«).

### Die Lider: an drei Stellen daneben, bis die Pflege saß

Drei Anläufe, und jeder ist eine eigene Lehre: (1) `material.color.multiplyScalar()` auf die fertigen
Schalen — vom nächsten Gesichtsbau überschrieben. (2) `lidSampler` **ersetzt** — FrizzleBob setzt beim
Gesichtsbau seinen eigenen. (3) Sampler **gewickelt** (er liefert die Stelle, wir dämpfen) — half
auch nicht, weil die Tint-Schicht danach ALLE Materialien auf den Kanon-Ton einfärbt.
Jetzt: Zielfarbe **absolut** gesetzt (multiplikativ hätte sich gestapelt) und in `messen()`
**dauerhaft nachgezogen** — zweimal je Sekunde, kostenlos. Gemessen: Ist = Soll = `a48826` gegen
Körper `f2c93c`.
*Merksatz: gegen eine Schicht, die immer wieder streicht, hilft kein Zeitfenster — nur Pflege.*

### Offen, benannt statt vergessen

- **Kein Waffenmodell.** FB hat nur die Gun-**Haltung** (`Idle_Gun` …) und die Mündung an der Faust —
  »die Gun kann ich gar nicht sehen« ist richtig: es gibt keine. Ein Blaster an `FistR` ist ein
  Asset-Thema, keine Mechanik.
- **Bolzen als Ribbon** statt Kugel (`kfb-fx-trails`), und Trefferpartikel, die zur Munition passen.
- **FB auf 0 HP** hat weiter keine Folge — S4.

## 17 · Korrektur meiner eigenen Erklärung: drei Fehler in der Effekt-Anbindung

Der Abschnitt oben (»mit 256 px … also 64 px je Effekt«) war **falsch**, und der Kritiker hat es
gemessen. Was wirklich los war:

1. **`buildAtlas(THREE, ink, size)` — `size` ist die Kante EINER KACHEL, nicht die Atlasgröße.**
   Der Modulkopf sagt das wörtlich (»v8 nutzt 256 — nicht ohne Grund ändern«). 256 gibt also bereits
   256 px je Zelle bei einem Blatt von 1024 × 1280; mein 1024 machte daraus **4096 × 5120 px**
   (~84 MB je Upload) und kaufte keine einzige Linie. Zurück auf den Kanon.
2. **Der Atlas läuft ohne Tusche — und sagt das jetzt.** `ink` war `null`, `window.KFBInk` existiert
   hier nicht, `modules/kfb-ink.js` gibt es nicht. Die Zeichnung im Atlas ist trotzdem die
   kanonische (wörtlich aus Mech Slice v8); `ink` liefert nur den geseedeten Zufall für den
   Zacken-Jitter. Jetzt wird `cardbuilder/kfb-ink-canon.js` übergeben (dort ist `mulberry`), und die
   FX-Zeile nennt den Zustand: `Tusche ja|nein (Kanon-Zeichnung)`. Kein stilles »sieht halt so aus«.
3. **Und der eigentliche Grund für Georgs Befund:** `resolveImpact(energy, surface, heavy)` erwartet
   einen **Energie-NAMEN** (`kinetic · hot · wet · electric`) — ich habe eine **Zahl** übergeben
   (0,4 / 0,5 / 1). `ENERGY[0.5]` ist undefiniert, also griff jedes Mal der Rückfall `kinetic` mit
   seiner Zelle `star` (»nur Zacken, kein Kern: schnelle, harte Waffen«). Damit war die Oberfläche
   für das Bild wirkungslos und jeder Treffer sah gleich aus — genau Georgs »ein Kreis mit ein paar
   Zacken«. *Ein Parameter, der jeden Wert annimmt, nimmt auch jeden falschen an.*

**Und die Zellwahl selbst ist jetzt eine Entscheidung, keine Nebenwirkung:** ein geworfener Würfel
ist weder schnell noch hart, sondern Interpunktion — dafür ist `burst` gemacht (»Kern plus
unregelmäßige Zacken«, so steht es im Atlas). Das IST der Stern, den Georg am Anfang gesehen und
vermisst hat. Der Energiebolzen der Gegner behält `star`, weil er genau das ist: schnell und hart.
Sekundärsignale (`shard`, `puff`, `smoke`) kommen weiter aus dem Rezept.

Nebenbei: die `[fx]`-Zeile endete auf »calls undefined« — `SpriteFx.stats()` liefert kein
`calls`-Feld. Die Zahl kommt jetzt aus `renderer.info.render.calls` (gemessen 33).
*Ein Feld, das nie einen Wert hat, ist ein leeres Versprechen.*

## 18 · Vier Nachträge (Georg, 06.09. abends)

**Die Gun ist ein ASSET, keine Haltung.** »Es wird immer noch nicht character_gun beim Schießen
gezeigt« — richtig: ich hatte nur die `*_Gun`-CLIPS geschaltet. Die Figur hat eine eigene Datei mit
Gewehr (`SPEC.files.gun` → `Character_Gun.gltf`, lokal `FrizzleBob_Yellow_Gun.gltf`), und
`setVariant('gun')` lädt sie. FB trägt das Gewehr jetzt dauerhaft (ein Variantenwechsel je Schuss
würde die Figur neu laden). Gemessen: `variant: 'gun'`, die vier plain Meshes des Gewehrs hängen am
Handknochen — und `frizzlebob.v1.js` rechnet sie schon aus dem Bodenmaß heraus (der Kommentar dort
beschreibt genau diesen Fall).

**Die Würfel tragen jetzt ihre Farbe.** Der Waffenmodul-Standard `tonung: 0.55` mischt den Körper nur
zur Hälfte in Richtung Zielfarbe — daher Georgs »nur ein leichter Schimmer«. Mit `tonung: 1` ist die
Basisfarbe die Farbe; die Augen bleiben dunkel (dafür hat das Modul seine `dunkel`-Schwelle).
Farbtrio aus dem Kanon: **Tuschrot `b8361f` · Gift-Grün `5fbf3a` · Kanon-Gelb `e9c14a`** — gemessen
am Objekt: `5fbf3a+212121`, `e9c14a+212121`, `b8361f+212121`, Kante 0,30 u.

**Der Gegner-Bolzen ist kein Ball mehr.** Das Rezept sagt `glow: true` und nennt eine Blitzfarbe —
also zwei Schalen: weißheißer Kern (`f4fbff`) und größere **additive** Hülle in der Bolzenfarbe
(`9ad63f`), mit leichtem Puls über die Lebenszeit. Tempo 12 u/s kommt aus `enemyShot()`. Ein Modell
für den Bolzen gibt es in der Werkbank nicht (`kfb-vfx-recipes` ist ausdrücklich eine Tabelle) — die
Form folgt hier den Zahlen des Rezepts, statt eine Murmel zu sein.

**Ton: Pegel von 0,9 auf 0,55.** »Die SFX sind nicht gut ausgesteuert und passen nicht zu den Waffen.«
Der Pegel ist gesenkt; die Zuordnung bleibt ein offener Punkt, denn die Bank kennt zehn Waffennamen
und keinen für einen Würfelwurf — `launch.scrap` (kinetischer Wurf) ist die nächste Wahrheit, nicht
die richtige. Ein eigener Cue `launch.dice` gehört in die Bank, nicht in einen Näherungsnamen hier.

## 19 · Zwei Nachträge (Georg, 06.09. spät)

**Der Würfel prallt jetzt auf, statt in der Karte zu stecken.** Die alte Bedingung nahm jedes
Geschoss weg, sobald es den Boden ODER den Kartenrand berührte — »verschwinden in der Karte
steckend«. Ein Würfel ist aber ein Körper: Restitution 0,42, Fahrt −28 % je Aufprall, unter 0,5 u/s
bleibt er liegen (1,4 s sichtbar), und über die Kante fällt er frei. Gemessen (ohne Auto-Ziel):
`y 0,36 → 0,19 → 0,17 (Aufprall) → −0,22 → −1,42 → −2,32 → weg`. Energiekugeln der Gegner verpuffen
weiter am Rand — die fallen nicht, die sind Licht.

**Der Blitzer am Kartenrand war eine Größendifferenz.** Gemessen: Blatt 18,00 × 10,35, Tuschekörper
darunter nur **17,55 × 10,09** (Faktor 0,975). Am äußeren Rand lag also kein dunkler Körper unter dem
Papier, und die beleuchtete Papierkante blitzte an der Tusche vorbei. Der Faktor 0,975 stammte aus
einem früheren z-fight-Fix; jetzt geht der Körper auf 1,0 und liegt stattdessen 0,05 u tiefer —
gemessen 18,00 × 10,34 für Blatt UND Körper. *Zwei Flächen, die eine Kante teilen sollen, müssen
dieselbe Größe haben; Abstand gehört in die Tiefe, nicht in die Breite.*

**Und eine Robustheitslehre:** der Vorhang hing am Laden der Gun-Variante. Im verdeckten Prüffenster
blieb die Bühne dauerhaft schwarz (»FrizzleBob …«). Optionale Assets bekommen jetzt eine Frist
(6 s) — danach geht es ohne Gewehr weiter, und das Log sagt, warum. *Was den Vorhang hebt, darf nicht
an etwas hängen, das auch fehlen darf.*

## 20 · Waffen aus dem Kanon (Georg, 06.09. spät) — und was ich vorher nicht gelesen hatte

»Es gibt grundsätzlich schon Würfel-Wurf und SFX in der Werkbank!« — stimmt, und ich hatte es nicht
gelesen. Beide Waffen stehen als Rezept im Projekt:

| | FB | Gegner |
|---|---|---|
| Rezept | `WEAPONS.railgun` = **Bamboo Rail** (`kfb-combat-def.js`) | `WEAPONS.dice` = **Würfelwurf** (`kfb-weapon-dice.js`) |
| Munition | `slug` — »schmaler Zylinder mit heißer Spitze« = die Bleistift-Form | kleiner **weißer** Würfel (Beute ist groß und farbig) |
| Zahlen | 165 u/s · 54 Schaden · durchschlagend · Ausholen 0,09 s | 22 u/s · Bogen 1,0 · taumelnd |
| Ton | `launch.railgun` | `launch.enemy` |
| Oberfläche beim Treffer | Ziel = **slime** | Ziel (FB) = **flesh** |

Nur der **Maßstab** wird umgerechnet (`ammoSkala = 1,2 / 2,6`): die Werkbank misst auf einer
Mech-Bühne, wir spielen auf einer Karte. Die Zahlen der Rezepte bleiben.

**Timing, in der richtigen Reihenfolge.** »Schuss, Mündung und Animation sind noch falsch getimed,
Munition startet von Gun in Position.« Das Rezept hat dafür eine Zahl: `ant` (Ausholen, 0,09 s).
Jetzt (1) sofort der Schussclip — `Idle_Shoot` / `Run_Shoot`, die Figur holt aus, (2) nach `ant`
Mündungsfeuer **an der Waffenspitze**, (3) im selben Bild die Munition, von genau diesem Punkt.
Die Spitze wird gemessen: die plain Meshes am Handknochen SIND das Gewehr (v1 rechnet sie schon aus
dem Bodenmaß heraus), ihre Vorderkante ist die Mündung.

**Deformer.** »FB zeigt keinen (Deformer) Impact« und »enemies ebenso, in Schussrichtung, zudem
leichter Push-Back«. `modules/kfb-hit-response.js` liegt seit dem 04.09. im Projekt und macht vier
Schichten auf einen Treffer: Clip, Materialblitz, Ring, Deformer (Squash, Hitstop, Knockback). Es ist
jetzt angeschlossen — für FB und für die Gegner. Die **Trefferachse gibt der Wirt mit** (`dir` =
Schütze → Ziel), nicht die Flächennormale: auf einem runden Körper zeigt die irgendwohin, und genau
dieser Fehler steht als Befund im Kopf des Moduls. Push-Back 0,22 u — klein, weil ein Gegner, der
wegfliegt, seine Halteweite verlässt.

**Und die geworfenen Würfel prallen auf beiden Seiten auf** (Restitution 0,42 bzw. 0,38), statt am
Rand zu verschwinden.

Offen und benannt: die **Tonmischung**. Der Pegel steht auf 0,55, die Cue-Namen sind jetzt kanonisch
(`launch.railgun`, `launch.enemy`) — aber ob Anschlag, Körper und Nachklang je Waffe passen, ist eine
Sache für die Bank, nicht für diesen Wirt.

### Der Waffen-Umbau hat den Beweispfad zerschossen — und zwar mit NaN

`schiessProbe()` baute sich ihr eigenes Geschoss aus `SPEC.spieler`. Als der Umbau dort `tempo` und
`schaden` entfernte (die Zahlen kommen jetzt aus dem Rezept), flog die Probe mit `undefined`:
**NaN-Position** (das Treffer-Sprite entstand im Nichts), **NaN-Leben** — und weil `NaN <= 0` falsch
ist, war der getroffene Gegner **unsterblich**. C3, ein BLOCK-Boden, meldete nach neun Treffern »noch
kein Kill«, während der Spielpfad einwandfrei tötete. Dazu blieb `gesichtMin` für den Rest der
Sitzung NaN, weil `Math.min(NaN, x)` NaN bleibt: C9 zeigte »NaN u tief getroffen«.

Drei Änderungen: die Probe fährt jetzt **denselben Weg wie das Spiel** (`_abgang()` statt eigenem
Geschoss), `gesichtMin` nimmt nur endliche Werte, und ein Treffer ohne Schadenszahl wird verworfen
statt ins Leben gerechnet. Gemessen: 8 Schüsse → **1 Kill = 1 Würfel = 1 Pop**, C9 `+0,01 u`,
Lebenswerte `[−5, 39, 39]`, 0 Fehler.

*Merksatz, zum zweiten Mal an einem Tag: ein Beweis mit zweitem Rechenweg beweist den zweiten
Rechenweg. Und: ein einziger NaN vergiftet jede Messung, die ein Minimum bildet.*

### Die Rail tunnelte durch die Gegner

Ein schnelles Geschoss auf einem festen Bild ist eine **Strecke**, kein Ort. Gemessen (Kritiker
06.09.): 121,8 u/s bei 1/60 s sind **2,03 u je Bild**, das Trefferfenster ist **0,41 u** — Verhältnis
4,94. Der Test auf die Endposition sprang also von vor dem Gegner nach hinter ihn: **12 Schüsse → 0
Treffer**, und der eine Kill in C3 war Zufall. Der Gegnerwurf (16,2 u/s, Schritt 0,27 u gegen Fenster
0,43 u) tunnelte nicht — es hing allein am Tempo der Rail.

Behoben mit **Teilschritten**: die Bewegung je Bild wird in Stücke zerlegt, die kleiner sind als das
halbe Trefferfenster, und nach jedem Stück geprüft (Deckel 12 Stücke). Der Gegnerwurf braucht davon
genau eines. Gemessen danach, zwei Läufe mit frischer Aufstellung: **3 Schüsse → 3 Treffer → 3 Kills**
und wieder **3/3/3**, C3 ✓ `6 Kills = 6 Würfel = 6 Pops`, alle Lebenswerte endlich, 0 Fehler.
*Ein Boden, dessen Beweis vom Zufall abhängt, ist kein Boden.*

### Die Gun-Variante hat FB heimlich geschrumpft

`fbGroesse()` maß die **ganze Wurzel-Box**. Mit dem Gewehr stand dort 4,29 statt 3,57 — also
skalierte ich FB auf **0,98 u** statt 1,20 (18 % zu klein), und alle abgeleiteten Maße rechneten
weiter mit 1,2: Körperradius, Schutzzone, Kameradistanz und vor allem die **Mob-Höhen** (0,8–0,9 ×
`fbU`). Ergebnis: Gegner 0,97–1,07 u gegen FB 0,98 u — Georgs zweimal korrigierte Gegnergröße war
durch die Waffe wieder verstellt.

Die Regel stand wörtlich in der Datei, die ich schon gelesen hatte (`frizzlebob.v1.js`): »zum Boden
zählt nur GESKINNTES; ein plain Mesh ist Zubehör (Gewehr, Face-Host)«. Jetzt wird genau das gemessen
(11 geskinnte Meshes) und die Figur so gesetzt, dass die Unterkante des **Körpers** auf dem Boden
liegt, nicht die der Gesamtbox. Gemessen: Körper **1,200 u**, Unterkante **0,000**, Gegner
1,07 / 1,00 / 0,97 u, 0 Fehler.

*Merksatz: eine Box um alles ist kein Maß für einen Körper — Zubehör hat andere Grenzen als Anatomie.*

### Impact unsichtbar — der Tint war die Farbe des Ziels

»FB trifft enemy, aber kein Impact sichtbar.« Gemessen: die Sprites **entstanden** (Pool 10 → 20),
nur sah man sie nicht — `resolveImpact` gibt den Tint der getroffenen **Oberfläche**, bei `slime` ein
Grün (`9fd45c`), und das lag auf einem grünen Cube-Monster. Jetzt zwei Schichten: **weißer Kern
zuerst** (Weißglut liest auf jedem Untergrund — so steht es auch in der Zeitachse der Rezepte:
»Kontakt: Burst, pop, Weißglut → Waffenfarbe«), darauf die getinte, größere Wolke, dazu die
Sekundärteile. Größe von 0,85 × auf 1,5 × und Lebenszeit von 0,34 s auf 0,42 s.

### Der Schussclip wurde im nächsten Bild weggeschaltet

»Timing Sound/Schuss/Animation ist noch nicht sauber getimed.« `_clip()` läuft in jedem Bild und
wählte nach Tempo — der gerade gestartete `Idle_Shoot` war im nächsten Bild wieder `Idle_Gun`.
Sichtbar war ein Zucken, kein Schuss. Jetzt besitzt der Schussclip die Figur für **seine eigene
Länge** (85 % davon), erst danach entscheidet das Tempo wieder. Gemessen: `Idle_Shoot` über alle
22 Bilder, Mündung nach `ant`, Treffer registriert, 0 Fehler.
*Merksatz: wer einen Einmalclip startet, muss ihm auch die Zeit geben — sonst gewinnt die Schleife.*

### Georgs Diagnose war richtig: die Hörner haben skaliert

»Das liegt vermutlich an Hörnern etc., die eine unterschiedliche Skalierung ergeben, wenn wir nicht
Body oder Augen für die Skalierung nutzen.« Genau so. Die Skalierung normierte die **Gesamtbox** auf
eine Zielhöhe — und die enthält Hörner, Ohren, Schwänze und Flügel. Wer sie auf gleiche Höhe bringt,
macht den RUMPF je Modell anders groß: gemessen Rumpfbreiten 1,02 / 1,14 / 1,07 bei angeblich
gleicher Höhe. Drei Runden Größenkorrektur (0,7–1,1 → 0,52–0,82 → 0,62–0,95) haben nie das Problem
berührt: **die Streuung war nie die Ursache, die Bezugsgröße war es.**

Jetzt wird `Body` vermessen (Roster-Kanon, alle Cube-Monster tragen ihn), EIN Faktor für alle (0,85 ×
FB), und die Füße stehen weiter über die Gesamtbox auf dem Boden. Gemessen: alle drei **h 1,02 u**.

Dazu der zweite Punkt: **der Radius war geraten.** `0,3 × Höhe` = 0,30 u bei Rumpfbreiten von
1,02–1,23 u — der halbe Körper ist 0,5–0,6 u. Deshalb steckten die Modelle ineinander, obwohl die
Rechnung »Abstand gewahrt« sagte. Jetzt kommt der Radius aus der **gemessenen Breite** des skalierten
Modells, und der Sollabstand ist Radiensumme + 0,45 u Luft. Gemessen: Radien 0,50 / 0,50 / 0,52,
Paarabstände 4,11 / 5,19 / 9,25 u bei Soll 1,45–1,48, Reserve 2,86 u.
*Merksatz: eine Zahl, die »× Höhe« heißt, ist eine Annahme über die Form.*

### Offen: FBs Füße auf dem atmenden Blatt (±5 cm)

Der Fußversatz aus `fbGroesse()` war **toter Code**: `player.update()` schreibt die Wurzel in jedem
Bild aus `pos`, also war der einmalig gemessene Wert nach einem Bild weg — FB stand 4,9 cm in der
Karte (Kritiker 06.09.). Die Wurzel folgt jetzt `pos.y + fussOffset`, und der Versatz wird als
Regelkreis nachgezogen (viermal je Sekunde, Totzone 5 mm).

**Noch nicht erledigt:** gemessen bleibt eine Restschwankung von **−0,07 bis +0,07 u**, und
`fussOffset` steht dabei auf 0,0000 — der Regelkreis greift also nicht. Zwei Kandidaten, beide nicht
geprüft: `frizzlebob.v1._groundKeep()` zieht die FIGUR im selben Bild in die andere Richtung (zwei
Regelungen auf einem Körper), oder mein Zweig läuft nicht, weil die geskinnte Box zum Messzeitpunkt
leer ist. Das ist eine eigene Runde: **zwei Regler auf derselben Achse sind ein Entwurfsfehler, kein
Zahlenproblem** — wer hier weitermacht, entscheidet zuerst, WER den Boden hält (v1 oder M2), und
schaltet den anderen ab.

Sichtbar ist es kaum (FB steht auf einem Blatt, das selbst ±3,5 cm atmet), aber es gehört benannt.

### Größe, dritter Anlauf: über die BREITE normieren

Mein zweiter Versuch (Rumpf-Mesh `Body` messen) griff nicht — `Body` ist bei den Cube-Monstern ein
**KNOCHEN**, kein Mesh (steht wörtlich in `kfb-stride-measure.js`, und ich hatte es dort gelesen).
Der Namensfilter fand also nichts und fiel auf die Gesamtbox zurück: Georgs Befund blieb, sogar
deutlicher. Jetzt wird die **Breite** normiert (0,72 × FB-Höhe = 0,86 u): Hörner, Ohren und Fühler
wachsen nach oben, die Rumpfbreite ist bei allen 21 Modellen das stabile Maß. Gemessen nach dem
Umbau: Breiten **1,01 / 1,07 / 1,04**, Höhen **0,88 / 0,89 / 0,84**, Radien 0,43 — gleich groß.
*Merksatz: wer eine Form normieren will, muss die Achse wählen, die die Form nicht schmückt.*

## 21 · OFFEN UND WICHTIG: Gegnergrößen — drei Fehlversuche, Stand schlechter als am Anfang

Georg 06.09., zuletzt: »Größen werden immer unterschiedlicher, war zu Beginn besser als nach deinen
Fehlversuchen.« Das ist die ehrliche Bilanz. **Bitte im frischen Chat sauber messen und fixen — und
KEIN Meta-Werkzeug dafür bauen.**

### Was versucht wurde, und warum jeder Versuch daneben lag

| # | Ansatz | Ergebnis |
|---|---|---|
| 0 | Gesamtbox auf Zielhöhe, Streuung 0,7–1,1 × FB | Ausgangszustand — laut Georg **besser als alles danach** |
| 1 | Streuung auf 0,52–0,82 (»ein Viertel kleiner«) | zu klein; ich hatte »ein Viertel« auf die Ausgangswerte gerechnet |
| 2 | Streuung 0,62–0,95 | Größenunterschiede blieben — die Streuung war nie die Ursache |
| 3 | Rumpf-Mesh `Body` messen, EIN Faktor 0,85 | **griff nicht**: `Body` ist bei den Cube-Monstern ein KNOCHEN, kein Mesh (steht in `kfb-stride-measure.js`) → Filter fand nichts → Rückfall auf Gesamtbox |
| 4 | Breite normieren (0,72 × FB), Radius aus gemessener Breite | im Prüffenster gleichmäßig (br 1,01/1,07/1,04 · h 0,88/0,89/0,84), **am Bild laut Georg weiter unterschiedlich** |

### Warum das eine eigene Runde braucht

Ich habe vier Mal an einer Zahl gedreht, ohne die Frage zu beantworten, **was »gleich groß« bei diesen
Modellen überhaupt heißt**. Die Modelle unterscheiden sich in Rumpfform (Kugel, Ei, Zylinder), in
Aufbauten (Hörner, Ohren, Fühler, Pilzhut) und im Verhältnis Kopf zu Körper. Jede einzelne Achse
(Höhe, Breite, Volumen) normiert etwas anderes — und Georgs Auge liest keine Achse, sondern die
**Silhouette**.

### Was der frische Chat messen soll (ohne Werkzeugbau)

1. **Alle 21 Modelle einzeln laden und drei Zahlen ablesen:** Gesamthöhe, Rumpfbreite, und die
   **Augenhöhe über dem Boden** (Georg hat sie zweimal als Maßstab genannt: »wenn wir die Eyeballs
   als Größenmaßstab nehmen«). Die Augen sind bei allen Cube-Monstern vorhanden und liegen im Kopf —
   sie sind das einzige Merkmal, das bei jedem Modell dieselbe ANATOMISCHE Bedeutung hat.
2. **Kandidat prüfen:** Skala so setzen, dass die AUGENHÖHE bei allen gleich ist. Dann Höhen und
   Breiten der Ergebnisse notieren — und **am Bild** entscheiden, nicht an der Tabelle.
3. **Ein Bild pro Kandidat**, alle drei Gegner nebeneinander, gleiche Kamera. Georg zeigt auf eines.
4. **Kein Messwerkzeug, kein Prüfstand, keine neue Datei** — die Zahlen einmal ablesen, eintragen,
   fertig. `schrittmass.json` zeigt, wie so eine Messung aussieht, wenn sie einmal gemacht und
   aufgeschrieben ist.

*Merksatz aus diesen vier Runden: wer viermal an derselben Zahl dreht, hat die falsche Frage gestellt.
»Gleich groß« ist keine Zahl, sondern eine Entscheidung darüber, WAS gleich sein soll.*

## 22 · Nächster Slice — S4 (Runden-Fluss, Save, Level-Aufstieg)

Offen und ausdrücklich notiert (Kritiker-Nebenbefund): **FB stand nach der Schießprobe auf 0 HP ohne
jede Folge** — kein Phasenwechsel, keine Anzeige. Das gehört zu S4 (`time.set('cleared')` bzw. eine
Niederlage-Phase) und darf nicht in Vergessenheit geraten.

- **S1½ / M9:** Clip-Zeitraffung steht vorläufig linear am Tempo (`clipTempo` walk 1,9 · run 3,4).
  C12 (Rutschfaktor 0,9–1,1) verlangt die gemessene Schrittweite je Clip → `schrittmass.json`.
  Die Annahme ist im Modul als Annahme markiert, nicht als Messung.
- **S2 / M3:** Mobs auf dieselbe Naht setzen (`field.contain`, aber ohne Bounce — Mobs fallen),
  Spawn-Regel ≥ 2,2 u (C2), Mob-Schuss ab 2,4 u aus `enemyShot()` der Werkbank v13.
