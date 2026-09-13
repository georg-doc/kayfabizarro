# WIRT_v13.md — Der Host-Vertrag des KFB Travel Globe

**Stand:** 3.9.2026 · abgelesen an `globe-v13/globe-poc.js` (3.100+ Zeilen) und den 88 Modulen
daneben. **Status: NEU GESCHRIEBEN, NICHT NACHGESCHLAGEN.**

> ⚠ **Erste Zeile, weil sie zum Vertrag gehört.** Diese Datei wurde im README des v13-Exports
> referenziert, bevor sie existierte. Der Kollege hat sie gesucht und nicht gefunden — richtig
> gesucht, die Datei war nicht da. Ein Verweis auf ein Dokument ist eine Zusage; eine Zusage ohne
> Datei ist derselbe Fehlertyp, den `vertragTor()` unten bei Fahrzeugen abfängt (Zusage vs. Ist).
> Was hier steht, ist am Code abgelesen — nicht aus der Erinnerung an den Code.

---

## §0 Die Antwort auf die Frage des Kollegen

*„Falls die den Host-Vertrag allgemeiner fasst als nur Fahrzeuge, ist das der eigentliche
Startpunkt."*

**Ja.** `fahrzeug-vertrag.js` ist **ein Sonderfall** des Host-Vertrags, nicht sein Kern. Der
Fahrzeug-Vertrag beantwortet eine Frage: *was darf ein Fahrzeug über sich behaupten?* Der
Host-Vertrag beantwortet die allgemeinere: *was muss ein Modul erfüllen, damit der Wirt es lädt,
und was darf es vom Wirt erwarten?* Das Fahrzeug ist die **härteste Instanz** dieses Vertrags
(weil es an der Physik klebt) und deshalb zuerst geschrieben worden — nicht weil es der Anfang
ist.

Für den Mech-Einbau v10 ist **diese** Datei der Startpunkt. `fahrzeug-vertrag.js` wird erst
relevant, wenn der Mech aufhört, eine Station zu sein, und ein Fahrzeug wird.

---

## §1 Die Bauform: was ein Modul IST

Jedes der 88 Module ist eine Datei mit **einer Fabrikfunktion** und keinem Nebeneffekt beim
Import. Signatur, wie im Wirt aufgerufen:

```js
const x = createX({
  THREE,                    // immer · nie ein eigener three-Import im Modul
  radius: GLOBE_RADIUS,     // Weltmaß, wenn das Modul auf der Kugel sitzt
  seed, terrainType,        // Weltidentität — dasselbe Paar für alle
  bodenRadius,              // FUNKTION (up) → Radius · siehe §3
  camera,                   // nur wenn das Modul zur Kamera schauen muss
  params: { … },            // die Regler dieses Moduls · siehe §5
  frei: (n, r) => belegung.frei(n, r),   // Belegung · siehe §4
});
scene.add(x.group);         // ⚠ DER WIRT hängt an, nicht das Modul
```

**Der Rückgabewert** ist ein Objekt mit bis zu sieben Feldern. Die ersten drei sind Pflicht:

| Feld | Pflicht | Bedeutung |
|---|---|---|
| `name` | ✔ | Kennung für Berichte und Zähler (`'leuchttuerme'`, `'mech-station'`) |
| `group` / `object` / `mesh` | ✔ | **EIN** Szenenknoten. Der Wirt hängt ihn an, das Modul nie selbst. |
| `params` | ✔ | Das offene Reglerobjekt · §5 |
| `update(dt)` | wenn bewegt | Bekommt `dt` **herein**, liest keine Uhr · §6 |
| `tor()` | wenn messbar | Abnahme als Text + Zeilen · §7 |
| `set…(…)` | nach Bedarf | Eingänge für Werte, die einen anderen Eigentümer haben · §3 |
| `orte` / `sites()` | wenn im Raum | Was das Modul belegt — für `belegung` · §4 |

**Was ein Modul NICHT tut:** `scene.add` auf sich selbst · `document.getElementById` (§8) ·
`performance.now()` in `update` (§6) · eine zweite Wahrheit über Boden, Nacht, Kamera, Spielerort
oder Physik führen (§3).

---

## §2 Die eine Regel, aus der alle anderen folgen

> **Jede Zahl hat genau EINEN Eigentümer. Wer sie braucht, bekommt sie hereingereicht.**

Das ist nicht Stil, das ist bezahlt. Die Fehlerklasse heißt in unseren Post Mortems
*„zweite Wahrheit"* und hat konkrete Rechnungen:

- **Zwei Quellen für „wo ist der Spieler"** — `sky-enemies.js` nimmt `setPlayer(weltPos, altitude)`
  als **eine** Eingabe je Bild, ausdrücklich kommentiert: zwei Quellen wären Fehlerklasse 1.
- **Zwei Nachtbegriffe** — `avatar-lamp.setNacht` und `natur-marken.setNacht` lesen beide
  `zyklus.nachtGewicht`. Drei Nachrechnungen wären drei Nächte.
- **Zwei Bodenlesungen** — `natur-marken.js` platzierte selbst und stellte drei Leuchttürme
  **unter** das Gelände (−8,19 / −1,13 / +0,46 mm), weil `surfaceAltitudeAt` bis ±8 mm von den
  gebackenen Dreiecken abweicht. Jetzt gibt der Wirt `bodenRadius(up)` herein.
- **Zwei Flugphysiken** — verhindert durch `VERBOTENE_FELDER` in `fahrzeug-vertrag.js`: 13 Namen
  (`tempo`, `maxSpeed`, `turnRate`, `hoverHeight`, …), die ein Fahrzeug **nie** mitbringen darf.

**Die Bauform dagegen ist immer dieselbe:** ein `set…`-Eingang, der einen fremden Wert annimmt,
und ein Kommentar, der den Eigentümer nennt.

---

## §3 Was der Wirt besitzt und hereinreicht

| Der Wirt besitzt | Eigentümer-Datei | Modul bekommt es als |
|---|---|---|
| Weltmaß, Saat, Geländeart | `globe-poc.js` | `radius`, `seed`, `terrainType` (Konstruktor) |
| **Boden** (gebackene Dreiecke) | `boden-lesung.js` | `bodenRadius(up)` — Funktion, nicht Zahl |
| Höhenfunktion (Rückfall) | `globe-field.js` | `surfaceAltitudeAt` — **nur** als Rückfall, sichtbar |
| Das gebackene Netz | `globe.mesh` | `bodenMesh` (für Raycast-Fußlesung) |
| **Kamera** | `globe-poc.js` | `setCamera(c)` — nie im Konstruktor gehalten |
| **Nacht 0…1** | `zyklus.nachtGewicht` | `setNacht(w)` |
| **Spielerort** | `carpet.worldPos()` | `setPlayer(pos, alt)` — eine Eingabe je Bild |
| Flugphysik | `carpet.js` **ausschließlich** | gar nicht · §2 |
| Licht, Tint, envMap | `pet-lighting` / `to-phong` | `lighting.register(obj)` **nach** dem `add` |
| Belegung der Oberfläche | `verteilung.js` (`belegung`) | `frei(n, r)` herein · §4 |
| Ereignisse | `fx-bus.js` | `fx.fire(name, ctx)` · §7 |
| Bühne / DOM-Wurzel | `buehne() \|\| stage` | `mount` (Konstruktor) · §8 |
| Sperrzonen (Vulkane) | Wirt kennt sie | `setSperrzonen([…])` |

**Warum `bodenRadius` eine Funktion ist und keine Zahl:** eine Zahl wäre zum Zeitpunkt des
Konstruktors falsch (das Netz ist noch nicht gebacken) und danach eine Kopie. Dasselbe Muster
gilt für alles, was **später** entsteht: `popAnker: () => hud.popAnker()` und
`onCollect: (p) => …` in `muenzen` sind **Funktionen**, weil das HUD erst 170 Zeilen weiter unten
gebaut wird. Ein Wert an dieser Stelle wäre `undefined` — dieselbe Reihenfolge-Falle, kommentiert
an `globe-poc.js:940`.

### Die Reihenfolge ist Teil des Vertrags

1. Gelände bauen und **backen**
2. Alles, was den Boden liest (Marken, Flora, Mech, Münzen) — **danach**
3. Wer Platz **belegt**, vor dem, der Platz **sucht**: Vulkane und Leuchttürme vor den Karten
   (`globe-poc.js:875`, ausdrücklich kommentiert)
4. HUD und Panel zuletzt — wer sie früher braucht, bekommt eine Funktion, keinen Wert

---

## §4 Belegung: wie Module sich nicht im Weg stehen

`createBelegung({ R })` ist ein Register, kein Verhandler. Zwei Methoden:

```js
belegung.merkeAlle(orte, radius, 'name');   // ich belege das hier
belegung.frei(n, r);                        // ist hier Platz? (herein als `frei`)
```

Eingetragen sind in v13: `landmarks` · `signposts` · `volcanoes` · `lighthouses` · `cards`
(56 Karten, halbe Breite 0,22) · `portals` · `rocks`. Wer sich einträgt, **nennt seinen Namen** —
weil das *Family distance gate* (`globe-poc.js:3081`) die Familien gegeneinander misst und ein
unbenannter Eintrag dort als anonyme Kollision auftaucht.

**Für ein fremdes Modul heißt das:** es bekommt `frei` herein und trägt sich über den Wirt ein.
Ein Modul, das die Belegung selbst hält, ist eine zweite Wahrheit über die Weltoberfläche.

---

## §5 Parameter: deklarieren, nicht bauen

Aus `HANDOVER_Torus_Welt_Design.md:255`, und seit Slice D durchgezogen:

> **Regler deklarieren statt bauen.** Wenn ein Modul seine Parameter erklärt, kann der Wirt die
> Leiste zeichnen.

Jedes Modul hat vier Dinge:

- `params` — flaches Objekt, **offen** (der Wirt schreibt direkt hinein: `rauch.params.driftTor = v`)
- `quelle` — der gemessene Vorbildwert je Feld
- `abweichungen()` — welche Felder von der Quelle abweichen
- `zeile()` — eine Zeile Bericht

**Die Abnahme von Slice D ist EINE Zahl:** wie viele Werte von der Quelle abweichen. 0 heißt,
das Freilegen hat nichts verändert (`globe-poc.js:2840`). Ein Modul ohne `abweichungen()`
erscheint dort als `⚠ no report:` — Fehlen ist sichtbar, nicht still.

**Panel-Zeilen sind Daten:** `{ kind: 'slider'|'toggle'|'seg'|'info'|'button'|'note', label, get, set, … }`.
Kein Modul zeichnet UI. `kind: 'note'` trägt die **Begründung** — dort stehen die Befunde, nicht
im Changelog allein.

**Und die Leiste verschiebt die Bühne nicht.** Wandert der Standpunkt beim Öffnen der Regler, ist
jede Messung danach wertlos.

---

## §6 Die Uhr: `dt` kommt herein

```js
update(dt) { if (mixer && !fahren) mixer.update(dt); }   // mech-station.js:184
```

**Kein `performance.now()` in `update`.** Der Grund ist dreimal gemessen (PM-50): in einem
verdeckten Tab wird `requestAnimationFrame` gedrosselt oder gestoppt. Ein Modul mit eigener Uhr
misst dann die Aufmerksamkeit des Zuschauers mit. Der `fx-bus`-Abspieler hat deshalb ausdrücklich
eine eigene Uhr, die das `dt` nimmt, *das ihm gegeben wird, und nicht nachfragt* — damit er auch
am `step(dt)`-Antrieb des Prüfstands läuft.

**Eigene Takte sind erlaubt, wenn sie begründet sind:** `sky-atmosphere` rechnet mit 14 Hz auf
eine 512²-Leinwand (alle 71 ms), weil die Bildzeit-Basislinie 12,3 ms ist. Die Minimap der
Overworld läuft mit 8 Takten je Sekunde. Beide Zahlen stehen im Code mit ihrer Messung daneben.

**Ein Fehler im Tick tötet den Tick.** Deshalb: ein unbekannter Wirker im `fx-bus` **zählt** und
läuft weiter, er wirft nicht. Dasselbe gilt für jedes Modul, das im Frame-Loop hängt.

---

## §7 Tore und Ereignisse

### Tore (`tor()`)

Ein Tor ist **kein Selbstbericht**. Aus PM-41, wortwörtlich der Ton dieses Projekts:

> Ein Prüfwerkzeug ohne Kontrollprobe ist eine Meinung.

Also **vergleicht** ein Tor Zusagen mit **live gelesenen** Werten aus den Modulen, die sie
besitzen. Rückgabe:

```js
{ ok, bestanden, von, nichtMessbar, zeilen: ['✓ …', '✗ …', '– … (nicht messbar)'], text }
```

Drei Urteile, nicht zwei. **`nicht messbar` ist ein zulässiges Urteil** — „falsch" wäre an der
Stelle keines. Und: **ein Modul, das nicht gelesen wurde, wird nicht beurteilt** (E-30) — die
Entwürfe in `fahrzeug-vertrag.js` werden gezählt, nicht geprüft.

Ein `✗` nennt **beide Zahlen**: `'22.5° vs physics 45.0°'`. Eine Gate-Zeile, die nur eine Absicht
nennt, ist keine.

### Ereignisse (`fx.fire`)

EIN Eingang. Der Befund dahinter (D-08 §1, gemessen): beim Kartendurchflug feuerten **sechs**
Ereignisse bei `t = 0` und keins danach — während die Ankunft der Karte bei `t = 1,05 s` stumm
war. Das ist ein Akkord, keine Kaskade.

```js
fx.fire('card.collect', { pos: carpet.worldPos(), dir: kaskadeRichtung(), strength: 1 });
```

Die fünf Bauregeln (E-28/E-29, im Kopf von `fx-bus.js`):

1. Eine Kaskade ist ein **Array** in `fx-script.js`, kein `if`-Baum. Ein neuer Effekt = eine Zeile.
2. Jeder Beat hat ein `t`. **Höchstens drei** Beats auf `t = 0` — mehr ist per Definition ein Akkord.
3. Jeder Wirker hat **einen** Eigentümer und wird **einmal** registriert.
4. Jede Kaskade hat eine Höchstdauer. Ein verworfener Beat wird **gezählt**, nie geschluckt.
5. Gewichte stehen in einer Tabelle mit Begründung (`trauma.js` · `GEWICHTE`), nicht am Aufrufort.

Kaskadennamen in v13: `card.collect` · `card.land` · `dice.collect` · `signpost.hit` ·
`world.respawn` · `water.enter` · `ground.touch` · `intro.handover` · 24 Impact-Zellen aus
`mech-impact.js`. Ein Modul, das eine Kaskade verspricht, die niemand definiert hat, fällt im
Fahrzeug-Tor auf (`⚠ unknown:`).

---

## §8 Der Wirt ist eine Design-Component — und das hat Kanten

Drei Fallen, alle bezahlt:

**1 · Die Bühne muss IMMER WIEDER gefunden werden.** Die DC-Runtime baut ihr Template neu, wenn
sie will. Dann ist der alte `#tv-stage` abgehängt und der neue liegt **im Shadow Root** —
`document.getElementById` sieht dort nicht hinein und liefert `null`
(`terrain-v23/travel-poc.js:172`). Deshalb `buehne()` als **Funktion**.

**2 · Anhängen darf nicht am Bild hängen.** `keepAttached` läuft als **erster** Schritt der
Frame-Schleife — und genau die pausiert, wenn der Browser die Seite für verborgen hält. Baut die
Runtime in dieser Zeit neu, hängt das Canvas an einem abgehängten Knoten, und die Schleife, die es
reparieren würde, läuft nicht: **schwarzes Bild, kein Fehler, kein Ausweg.** Gemessen am 26.7.:
Bildzähler friert bei 41–47, alle Schritte melden „ok".

**3 · An der Schattengrenze hört `target` auf.** Von außen nennt `e.target` den **Wirt**, nicht das
getroffene Kind — ein Vergleich `e.target === wirt` traf deshalb auch bei Klicks **ins** Fenster zu
(`overworld-v14/input-truth.js:68`). Richtig ist `e.composedPath()[0]`. Ebenso: `document.activeElement`
sieht das Feld im Shadow Root nicht — »R« öffnete das Roster beim Namenstippen (Befund 74).

**Dazu:** ein **sichtbarer Fehlerfänger** vor dem Modul, sonst scheitert ein Ladefehler still.
Das ist schon einmal passiert. Der Renderpfad bleibt **WebGL**.

---

## §9 Schalter und Kennungen

URL-Parameter schalten Module ab, ohne Code zu ändern: `?mech=0` · `?flora=0` · `?tsflora=0` ·
`?muenzen=0` · `?portale=n` · `?gegner=n`. Tasten im Wirt: `T` Klang-Tor · `U` Motor · `J` Track ·
`N` Erzähler · `R` Startansicht · `K` Würfel · `V` Mech-Modus · `M` Maus-Modus · `F` Abnahme-Blatt.

**`?x=0` ist Teil des Vertrags,** nicht Komfort: ein Modul, das man nicht abschalten kann, kann man
bei einem Befund nicht ausschließen.

---

## §10 Für den Mech-Einbau v10: die Prüfliste

Was das anliefernde Modul erfüllen muss, in der Reihenfolge, in der es auffällt:

1. **Eine Fabrik, kein Import-Nebeneffekt.** `createMechCombat({ THREE, … })`.
2. **Ein Szenenknoten.** `.group`. Der Wirt hängt an.
3. **`update(dt)`** — `dt` herein, keine eigene Uhr ohne Begründung.
4. **Kein `THREE`-Import im Modul.** Der Wirt reicht es herein (eine three-Instanz).
5. **Boden über `bodenRadius(up)` bzw. `bodenMesh`** — nie `surfaceAltitudeAt` als Erstwahl (±8 mm).
6. **Kein Bewegungsfeld.** Prüfen gegen die 13 `VERBOTENE_FELDER`. Bewegung gehört `carpet.js` (E-43).
7. **`params` + `quelle` + `abweichungen()` + `zeile()`** — sonst steht das Modul als
   `⚠ no report` im Slice-D-Zähler.
8. **`tor()`** mit drei Urteilen und beiden Zahlen bei `✗`.
9. **Effekte über `fx.fire`,** Kaskaden als Daten in `fx-script.js`, ≤ 3 Beats auf `t = 0`.
10. **Belegung über `frei` herein,** Eintrag über den Wirt, mit Namen.
11. **`?mech=0` muss es ausschalten.**
12. **Maßstab abgeleitet, nicht gesetzt.** Der v8-Mech stand auf 4,27 Kartenbreiten — ein Turm
    neben einer Spielkarte. Jetzt: `bezug` (gezeichnete Kartenbreite, vom Wirt) × `faktor` (Regler),
    Voreinstellung 1,3×. Der Regler steht in der Einheit, die man **im Bild sieht**: „mal Karte".

**Der erste Wirt-Beweis ist der Ladepfad, nicht das Verhalten** — so lief es bei
`mech-station.js` in v8/v9: EIN Mech steht neben dem Start, Recon-Fallen gekapselt, Bewegung
ausdrücklich nicht. Erst danach wird aus einem Entwurf ein gemessenes Fahrzeug.

---

## §11 Was in dieser Datei NICHT belegt ist

Nach eigener Regel (§7: nicht Gelesenes wird nicht beurteilt) — hier stehen die Grenzen dieses
Dokuments:

- **Ich habe `globe-poc.js` nicht Zeile für Zeile gelesen**, sondern die Modul-Anmeldungen, die
  Frame-Loop-Eingänge, die Panel-Deklarationen und die kommentierten Befunde. Eine
  Anmelde-Eigenheit in einem der 88 Module kann hier fehlen.
- **`verteilung.js`, `boden-lesung.js`, `fx-script.js` habe ich nicht vollständig gelesen** — ihre
  Schnittstellen stehen hier so, wie der Wirt sie benutzt, nicht so, wie sie sie anbieten.
- **Es gibt kein `wirtTor()`.** Die Prüfliste in §10 ist eine Liste, kein Instrument. Nach der
  eigenen Logik dieses Projekts (PM-41) ist eine Liste ohne Kontrollprobe eine Meinung — ein
  `wirtTor(modul)`, das die zwölf Punkte an einem angemeldeten Modul **messen** würde, wäre der
  nächste Schritt und steht im Backlog, nicht im Code.
- **Die Zeilennummern** stimmen für `globe-v13` zum 3.9.2026. Sie wandern.

---

## Anhang · Die genannten Regelnummern

`E-28` Kaskade ist eine Datentabelle · `E-29` ≤ 3 Beats auf t=0 · `E-30` ungelesenes Modul wird
nicht beurteilt · `E-31` der Wegweiser kennt „das nächste", nicht „das Portal" · `E-32`
Durchflug springt auf die Gegenseite derselben Kugel · `E-35` der `glow`-Wirker braucht das
getroffene Schild · `E-43` Bewegung gehört nicht ins Fahrzeugmodul · `PM-41` Prüfwerkzeug ohne
Kontrollprobe ist eine Meinung · `PM-50` rAF steht im verdeckten Tab · `D-08` Befundsammlung
Slice B (Akkord statt Kaskade).
