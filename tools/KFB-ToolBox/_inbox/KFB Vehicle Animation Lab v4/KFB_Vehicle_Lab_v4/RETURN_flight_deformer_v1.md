# RETURN · KFB Flight Deformer v1 · Travel/TinySkies Consumer Proof

*19.09.2026. Oberfläche: `KFB Vehicle Lab v4.dc.html`. v3 bleibt unverändert liegen.*

## SOURCE

| gelesen | Stand |
|---|---|
| `georg-doc/kayfabizarro` · `skills/chat/workflows/VEHICLE_DEFORMER_V3_TINYSKIES_2026-09-19/START_HERE.md` | main, 19.09. |
| `georg-doc/KFB-Travel-Globe` · `WSA_START.md`, `AGENTS.md`, `travel/CONTRACT.md` | main |
| `…/travel/globe-v13/carpet.js`, `flight-controls.js` | main — **kopiert, nicht nachgebaut** |
| `…/travel/terrain-planets-v1/card-carrier.js` | main — die Naht, die es schon gibt |
| `…/travel/globe-v13/globe-poc.js` (Zeilen um 423 und 4018) | main — wer `carrierState` füllt |
| Vehicle-Deformer v2/v3-Quellen dieses Projekts (`lab-v7/`, `PLAN_flight_deformer.md`) | lokal |

Aufgelöster Ref des Travel-Repos beim Lesen: `8614282aab2c` (so vom Lesewerkzeug gemeldet; ob
Commit oder Tree ist daraus nicht entscheidbar, darum steht hier keine Commit-Behauptung).

## DECISION

**Der Flug-Tab betreibt keinen nachgebauten Flugzustand, sondern den echten.** `carpet.js`,
`flight-controls.js` und ihre fünf Abhängigkeiten liegen byteweise unverändert unter
`lab-v8/vendor-travel/` und laufen in der Werkbank. Ein zweiter Flight-Controller wäre genau das
gewesen, was das Briefing verbietet — und er wäre zugleich die einzige Art, den Beweis wertlos zu
machen: eine Nachbildung, die sich richtig anfühlt, beweist nichts über die Quelle.

Kein Globus, kein Geländenetz, keine Travel-Kamera: für die Naht zählt der ZUSTAND, und den
rechnet `carpet.js` aus Saat und Geländeart ohne jede Darstellung. Travel Movement und Camera
bleiben damit nicht nur unverändert, sie sind gar nicht beteiligt.

**Die Naht ist eine Erweiterung der bestehenden, keine zweite daneben.** Travel füllt für den
Kartenträger schon `{position, quaternion, speed, bank, pitchTilt, boosting, climbIn}`
(`globe-poc.js` → `card-carrier.js`). Diese Namen wurden nicht umbenannt. Georgs Entwurfsfelder
kommen dazu, jedes mit ausdrücklicher Herkunft.

**Die Rad-Paar-Regel läuft im Flug-Tab nicht als Voraussetzung.** Sie läuft überhaupt nicht:
gemessen werden Spannweite, Rumpflänge, Flügelebene, Hüllenmitte und Schubachse. Dass
`airplane-a`, `airplane-b` und `spaceship-a` seit der Achsenregel zwei Räder MELDEN, ändert daran
nichts — ein Fahrwerk ist ein Bodenkontakt, kein Fluganker.

## IMPLEMENTATION

| Datei | was sie besitzt |
|---|---|
| `lab-v8/vendor-travel/*` (7 Dateien) | NICHTS Eigenes. Travel-Quelle, unverändert. |
| `lab-v8/travel-flight-seam.v1.js` | die EINE Naht, `SEAM_FIELDS` (Herkunft je Feld), der laufende Travel-Flug, die Tastenspur |
| `lab-v8/flight-frame.v1.js` | S1 · die fünf gemessenen Größen |
| `lab-v8/flight-deformer.v1.js` | S1 + S3 · Lage um die gemessenen Drehpunkte, Ereignis-Impulse |
| `lab-v8/spring.v1.js` | der Spring aus v2, wörtlich gehoben statt nachgeschrieben |
| `lab-v8/flight-profiles.json` | FLIGHT_LIGHT, PAPER_FEATHER, SHIP_RIGID (je mit Shell-Profil) |
| `lab-v8/FLIGHT_SEQUENCES.json` | 15 Motion-Sequenzen als TASTENSPUREN, nicht als Posen |
| `KFB Vehicle Lab v4.dc.html` | Oberfläche |

### Der Seam-Block, Feld für Feld

| Feld | Herkunft | woraus |
|---|---|---|
| speed | TRAVEL | `carpet.state.speed` |
| speedNorm | TRAVEL | `carpet.tempoAnzeige` (Travels eigener Anzeige-Getter, nicht `speedRatio`) |
| bank | TRAVEL | `state.bankAngle / maxBank` |
| pitch | TRAVEL | `state.pitch / climbPitchMax` |
| drifting | TRAVEL | `state.drifting` · `driftIntensity` |
| climbIn | TRAVEL | `controls.elevate ? 1 : 0` — die Zeile aus `globe-poc.js` |
| boosting | TRAVEL | `controls.elevate` — dieselbe Zeile |
| dt | TRAVEL | Wirt-Uhr |
| longAccel | DERIVED, einmal | `d(speed)/dt`, normiert auf `accel`/`brakeDecel`, Glättung 12/s |
| yawRate | DERIVED, einmal | `wrapPi(d heading)/dt` |
| turnRate | DERIVED, dieselbe Messung | `yawRate / (1,2 · 1,45)` |
| touchdown | DERIVED, einmal | `agl` fällt unter `hoverHeight · 1,05`; Travels `fx.fire('ground.touch')` gewinnt, wenn er anliegt |
| gust | **UNAVAILABLE** | kein Eigentümer in Travel. Bleibt 0, im Labor von Hand gefeuert. |
| impact | **UNAVAILABLE** | gehört Travels fx-Bus. Die Naht nimmt ihn per `inject()` entgegen, erfindet ihn nicht. |

### Warum zwei Drehpunkte

Ein Flugkörper nickt und giert um den Hüllenschwerpunkt, rollt aber um die Längsachse IN DER
FLÜGELEBENE. Ob die beiden auseinanderliegen, entscheidet der Bau des Modells — und genau das ist
der Grund für zwei Drehpunkte: der Abstand wird gemessen, nicht angenommen. An sechs Flug-Fixtures
gemessen (Flügelebene y minus Hüllenmitte y, daneben derselbe Abstand als Anteil der Halbspanne):

| Fixture | Flügelebene y | Hüllenmitte y | Abstand | Anteil Halbspanne |
|---|---|---|---|---|
| `spaceship-a` | 3,163 | 1,143 | **+2,021 u** | 55,1 % |
| `fighter-lowpoly` | 0,045 | 0,237 | **−0,192 u** | −19,2 % |
| `airplane-b` | 84,701 | 72,482 | +12,219 u | 11,0 % |
| `paper-plane` | 0,020 | 0,017 | +0,003 u | 5,5 % |
| `airplane-a` | 0,767 | 0,686 | +0,082 u | 4,3 % |
| `spaceship-rae` | 1,053 | 0,976 | +0,078 u | 1,6 % |

Die Spanne ist der Punkt. Am Referenzfall `airplane-a` sind es 4,3 % der Halbspanne — dort wäre
ein gemeinsamer Drehpunkt kaum zu sehen. An `spaceship-a` sind es 55 %, und an `fighter-lowpoly`
kehrt das Vorzeichen um: ein Tiefdecker, dessen Flügelebene UNTER dem Schwerpunkt liegt. Ein fest
verdrahteter Drehpunkt müsste einen dieser Fälle falsch machen; ein gemessener macht keinen.

*(Frühere Fassung dieses Abschnitts nannte 0,60 u für `airplane-a`. Das war der z-Wert der
Hüllenmitte, als y ausgegeben — Faktor 7,3 daneben. Die Zahl trug genau die Entscheidung, die sie
begründen sollte; sie ist durch die Messreihe ersetzt.)*

### Arbeitsteilung

Die Lage gehört dem neuen Modul, die FORM weiterhin `lab-v7/vehicle-cartoon-deformer.v2.js`
(unverändert). Damit die Bank nicht doppelt erscheint, steht in allen drei Flugprofilen
`bankFollow: 0` und `rollResponse` klein.

## TESTED RESULT

Browser, echte Pixelaufnahmen, feste Kamera (`screenshots/v4-*.png`).

- **Kurve links, airplane-a.** Travel meldet Bank −12,0°, die Naht −0,27, der Deformer rollt
  −12,2°, giert −4,0°, twistet 3,2°. `turnRate` 1,00 bei `yawRate` 1,74 rad/s — das ist genau
  `1,2 · 1,45`, die Normierung stimmt also an der Quelle.
- **Kurve rechts** kehrt alle Vorzeichen um (Bank +8,5° → +0,19, `turnRate` −1,00).
- **Driftkurve.** `state.drifting` wird wahr, `driftIntensity` 1,00; der Read springt auf
  `drift`, die Pose liest anders als die normale Kurve.
- **Böe (LABOR).** Energie 0,31, Nickspitze −13,2°, Ereignis `gust 0,90` im Protokoll.
- **Aufsetzen, ABGELEITET.** Steigflug, loslassen, Travel sinkt mit `altFallLerp` 0,38/s; bei
  agl 0,076 feuert `touchdown 0,35` (nach rund 8,5 s). Das Labor setzt es nicht — es liest
  Travels Höhe.
- **Vier Fixtures über den Maßstabssprung.** `airplane-a` (Spannweite 3,777 u), `paper-plane`
  (0,121 u), `spaceship-a` (7,337 u), `spaceship-rae` (9,949 u) — Faktor 82 zwischen dem
  kleinsten und dem größten. Der eigentliche Ausreißer ist `airplane-b` mit **221,577 u**
  Spannweite, also Faktor 1834 gegen den Papierflieger; auch dort greift der Rahmen ohne
  Sonderfall, weil der Deformer in Anteilen rechnet. Alle mit automatisch gewähltem Profil,
  Kamera aus der gemessenen Größe. Orient- und Gier-Schalter lösen eine NEUMESSUNG aus, nicht
  eine Korrektur am alten Rahmen.
- **Flügeltwist.** `airplane-a`, `spaceship-rae`: zwei getrennte Flügelnetze gefunden,
  Differenztwist läuft. `paper-plane`: EIN Blatt — gemeldet, kein Twist erfunden.

### Vier Fehler gefunden und behoben, alle vier gemessen

1. Die Tastenspur lief ins Leere, weil `controls.enabled` am Knopf »Tastatur« hing: 150 Bilder mit
   W und A, Kurs unverändert 176°, Bank 0,0°. Während einer Spur hört Travels Tastenleser jetzt
   immer; danach fällt er auf die Wahl des Knopfes zurück.
2. Die Ereignis-Impulse waren um Faktor zwei zu leise (0,4° Rollen bei einer Böe der Stärke 0,9).
   Ein Geschwindigkeitsstoß erreicht den Scheitel bei v/ω; bei 2,6 Hz ist ω ≈ 16,3, die Faktoren
   stehen jetzt bei 15…18 statt 7…11.
3. Der Anzeigeblock hielt eine REFERENZ auf das lebende Naht-Objekt — Bank −12,2° stand neben
   normiert −0,11 statt −0,27. Ein Beweisbild mit zwei Zeitpunkten ist kein Beweis.
4. Dieses Dokument nannte den Drehpunktabstand an `airplane-a` mit 0,60 u. Das war die z-Achse der
   Hüllenmitte, als y gelesen; gemessen sind es 0,082 u. Ersetzt durch die Messreihe über sechs
   Fixtures oben — sie sagt dasselbe über die Konstruktion, nur richtig, und sie sagt zusätzlich,
   dass ausgerechnet der Referenzfall der schwächste Beleg war.

## PUBLIC/STAGE PROOF

**Steht aus.** Diese Runde ist die Werkbank, nicht die Stage. Was ein Stage-Beweis zusätzlich
braucht: den Flug-Deformer in `globe-poc.js` anhängen (er ersetzt nichts, er hängt an
`carrierState`), Travels fx-Bus auf `impact` legen, dann die URL für den Browsergate.

## GEORG ACCEPTANCE

Offen. Die eine Prüffrage — »liest sich das weiterhin wie TinySkies Flight, nur mit stärkerer
KFB-Cartoon-Kinetik?« — ist am Bild zu beantworten, nicht an dieser Datei. Die Werkbank ist so
gebaut, dass die Antwort umkehrbar ist: `rollDeg`, `pitchDeg`, `slipDeg` und die Impulsfaktoren
sind die einzigen Stellen, an denen überzeichnet wird, und Travels Zahlen stehen im Bild daneben.

## OPEN

- **Kein VFX.** Kondensstreifen und Speedlines liegen als Vorlage im Repo
  (`travel/travel-v16/terrain-v16/speed-lines.js`, `globe-v13/contrails.js`). Skill §15: erst die
  Choreografie. Der Flug liest darum noch flach — ohne Streifen fehlt der Fahrtwind.
- **Die sechs Raumschiffe sind im Gier nicht beurteilt** und stehen auf 0. Für `spaceship-rae`
  ist die Streckung 0,89 (Spannweite 9,949 gegen Rumpf 11,166) — der Hinweis auf einen möglichen
  falschen Gier-Schalter steht im Panel, entschieden wird er am Bild.
- **`impact` und `gust` bleiben UNAVAILABLE**, bis Travel einen Eigentümer nennt. Die
  Einhängepunkte stehen: `seam.inject('landmark.hit')`, `seam.inject('gust')`.
- **Brücke Fahren → Fliegen** (Klapprad über `steer/susp/spin`, Kandidaten Spacetrucks) ist
  geplant und NICHT gebaut. Sie war in diesem Slice ausdrücklich nicht bestellt.
- **Kein Cockpit, kein FrizzleBob-Graft, kein Passagier/Pet** — wie vorgegeben.
