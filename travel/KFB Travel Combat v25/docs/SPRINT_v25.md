# Sprint · KFB Travel Combat v25 — Einbau des v11-Slice

## Offen am Boden (Georg, 06.09. · „okay-ish für jetzt")

· ~~**Kollision** und **Sprung** im Bodenmodus sind buggy.~~ **Erledigt in v25.2q** (Naht 178).
  Der Verdacht war halb richtig: die Einzelpunkt-Probe war Fehler 1, aber der eigentliche war das
  Fehlen einer Regel für „Mitte steht schon in der Säule" — dort ist jede Richtung unbegehbar,
  auch nach hinten, und ein Zustand ohne Ausweg ist kein Kollisionsfehler mehr. Der Sprung war ein
  Zahlenfehler: Gipfel 3,5 u gegen `autoJumpMax` 4,2 u, die Taste also schwächer als Nichtstun.
· ~~**Rennen ist Hüpfen.**~~ **Erledigt in v25.2r** (Naht 179) — und der Satz hier war falsch. Der
  Bob war nicht auf Gehen getunt, sondern auf Rennen, und genau das war der Fehler: die Kadenz ist
  bei beiden Gangarten dieselbe (2,00 gegen 2,01 Zyklen/s, maßstabsunabhängig — 4,70/2,70 ist
  `sprintMul`), beim Sprint stieg also nur die Höhe, um 50 %. Gleiche Frequenz, mehr Ausschlag =
  Pogo-Stick. Jetzt Flugphase (`hang` 0,62) und Amplitude **runter** auf 0,055, Energie in die
  Stauchung (0,075). **Georgs Urteil steht aus** — vier Zahlen, `petKin.setBob(k, v)`.


## Erledigt in v25.2d

**Schrittmaß-Entscheidung** — die Größe war die Ursache, nicht das Tempo: Pet am Boden auf 3,2 u
(Mech-Höhe), Schrittlänge kennt jetzt den Gruppen-Maßstab, gemessene Schrittlänge ist Vorgabe.
Offen bleibt nur das Nachfühlen: Kadenz und Rutsch stehen live in den Einstellungen.

## Vorgemerkt (Georg, 05.09. · v25.2c)

**Der Slot-Würfel zeigt Reichweite.** Über `speed × leben` (Rakete: 34 u/s × 3,2 s = 109 u)
kann ein Geschoss das Ziel nicht erreichen — die Flugzeit ist gelöst und liegt vor (`zaehler.zuWeit`,
`letzterVorhalt`). Georgs Wunsch: der Würfel des Slots sagt, ob das AKTUELLE Ziel in Reichweite
ist. Naheliegend, weil der Würfel dafür schon ein Vokabular hat (Deckkraft = Uhr): eine zweite
Lesart wäre die Augenzahl nicht, sondern eine Kante oder ein Farbstich. Zu entscheiden, wenn es
dran ist — nicht drei Signale auf 44 px stapeln.


Fork aus `KFB Travel Combat v24.dc.html` + `terrain-v24/` (2026-09-05, abends). Fahrplan war
`docs/travel-v25/PLAN_einbau-v11-in-travel-combat-v24.md` (mitgeliefert im v11-Export). Reihenfolge
dort war verbindlich und wurde eingehalten — mit **einer Abweichung**, die unten steht und begründet ist.

---

## 0 · Was v25 ist

| Artefakt | Rolle |
|---|---|
| `KFB Travel Combat v25.dc.html` + `terrain-v25/` (66 Dateien) | **der Arbeitsstand**, 1:1-Kopie von v24 + die Änderungen dieser Sitzung |
| `KFB Travel Combat v24.dc.html` + `terrain-v24/` | **FROZEN** — Vergleichsmaßstab, nicht weiterbauen |
| `modules/kfb-hit-response.js` · `kfb-combat-cues.js` | **aktualisiert** aus dem v11-Slice (API additiv) — geteilt, v24 liest sie mit |
| `modules/kfb-weapon-eyeball.js` · `studio-v3/pet-eye-rig.v5.js` | **neu** — die Augapfel-Waffe und ihr Rezept (harte Abhängigkeit) |
| `schrittmass.json` (Wurzel) | **neu** — 41 Messungen, 23 Pets mit Schrittmaß |
| `modules/kfb-stride-measure.js` | **neu** — das Messwerkzeug, das die Datei erzeugt hat |

Nicht eingezogen, ausdrücklich (PLAN §4): `kfb-fx-sprites.js` · `kfb-mob-locomotion.js` ·
`kfb-fx-flame.js` · die Schussbahn-UI. Ebenfalls nicht: `kfb-weapon-dice.js` — **die Datei ist im
v11-Export nicht enthalten.** Der Plan nennt sie unter §3 („nach dem Augapfel trivial"); sie kann
nachgezogen werden, sobald sie im Ordner liegt.

---

## 1 · Die Reihenfolge, abgearbeitet

**S1 · Push → hier: Einzug.** Die drei geteilten Module liegen jetzt im Projekt. `combat-host.js`
importierte `kfb-hit-response` und `kfb-combat-cues` schon in v24 — der Port war also in Teilen ein
Update. Was damit sichtbar anders ist: Stauchachse in **Körperkoordinaten**, HOLD ≥ 0,07 s getrennt
vom Hitstop, ein Überschwinger statt 1,2 Perioden, `knockScale` 0,55 → **0,9**.
→ **Die Nachprüfung ist Georgs**: einmal feuern, einen Treffer ansehen. Wenn es schlechter aussieht
als in v24, gehört ein `params`-Wert in den Wirt, keine zweite Fassung ins Modul.

**S2 · Mündungsversatz.** `mech-avatar.muendung(out, dir)` nimmt jetzt eine Richtung. Mit `dir`
wandert der Knoten um `rad × 0,9 + 0,18` vor die Silhouette, wobei `rad` der **gemessene**
Körperradius ist (halbe größere Grundfläche × Einpass-Maßstab), nicht ein Bruchteil der Höhe.
Ohne `dir` bleibt es der Brust-Bone — richtig für den Burnout-Rauch, der aus dem Körper kommen soll.
Gemessen an Fernando/Flamingo: Radius **1,23 u** → Versatz **+1,29 u**. Der Wirt addiert ihn dort,
wo `dir` vorliegt (nach Vorhalt und ballistischer Lösung), nicht davor.

**S3 · Der Maßstab (Georgs Frage: „player avatar/mech wirkt zu klein…?").**
Er hatte recht, und zwar in Zahlen. `sky-mobs` skaliert jeden Gegner auf `K.h × scale` (scale 1,6):

| Körper | Höhe |
|---|---|
| Flieger (`Enemy_Flying`) | 1,70 × 1,6 = **2,72 u** |
| 17 Monster-Flieger | 1,60 × 1,6 = **2,56 u** |
| Kleiner / Winzling | 1,84 u / 1,31 u |
| **Mech in v24** | **2,00 u** |

Der Spieler war 26 % kleiner als der größte Flieger — die kleinste ernstzunehmende Figur im Bild.
**Neu: 3,20 u**, also ×1,18 über dem größten geladenen Gegner und auf der Höhe der 3,0-u-Karte, die
der Mech ersetzt. Mitgezogen: der Trefferradius des Spielers (`combat-shots.spielerR` 1,3 → **1,66**
= 0,52 × Höhe, Brust und Rumpf, nicht die dünnen Beine).
**Und die Zahl steht nicht allein da:** `combat.groessen()` liefert sie, das Panel zeigt sie unter
„Größenverhältnis", und `combat.tor()` fällt unter ×1,05 durch. Wer den Gegner-Regler hochdreht,
erfährt es an dieser Zeile statt im Bild.

**S4 · Kapselprobe.** `combat.kapselprobe(10)` wirft zehnmal auf ein lebendes Ziel — **mit Schaden
null**, sonst fällt der Mob nach dem dritten Wurf und die restlichen sieben messen seinen Tod statt
der Hitbox. Sie feuert im **Takt der Waffe** und nennt **Distanz und Reichweite mit**. Warum das
zweite so wichtig ist, steht in §2.

**S5 · Augapfel.** Als **Sekundärwaffe** (Rechtsklick, umstellbar im Panel: Rakete | Augapfel).
Kein neuer Tastenbelegung — `P.secondary` gab es schon. Der Wirt liefert Emitter, Vektorfabriken
(`vec`/`vecv` — die Falle, an der die erste Fassung mit „not a function" starb) und die
**Untergrundfarbe** aus dem mittleren Paletten-Stop. `combat-shots` bekam dafür drei optionale
Felder in `fire()`: `mesh` (fertiger Körper vom Waffenmodul), `spur` (Puff je Strecke, mit Deckel)
und `huepfer` (Aufsetzer statt Verschwinden, dann Verblassen). Die Sprite-Zellen der Kit-Module
(`smoke`, `shard`, `splat`, `star` …) werden auf die zwei Texturen dieses Pools **abgebildet**, nicht
nachgebaut — und `add` gehört jetzt zur Zelle: Rauch und Scherben mischen normal, nicht additiv.

**S6 · Würfel.** Eingebaut (Georg hat `kfb-weapon-dice.js` am 05.09. nachgeliefert). Dieselbe Naht,
weniger Last. GLB lädt, Ersatzwürfel bleibt der Rezept-Rand. Tempo als Wirt-Wert 22 → 30 u/s, gleiche
Rechnung wie beim Augapfel.

**S7 · Schrittmaß.** `pet-kinetics` liest `schrittmass.json` beim Start und **ändert damit nichts**.
Warum, steht in §3.

---

## 1b · Wo man die Änderungen SIEHT (und wo man sie nicht sieht)

Die meisten Nummern dieses Sprints sind Instrumente, keine Bilder. Was im Bild anders ist:

| Modell | woran man es erkennt |
|---|---|
| **Mech größer** (2,00 → 3,20 u) | der Mech füllt sichtbar mehr Bild und ist größer als jeder Flieger |
| **Mündung** | beim Dauerfeuer keine weißen Kreise mehr auf der Rückseite des Mechs |
| **Trefferreaktion** | ein getroffener Mob staucht entlang der Schussachse und hält die Pose länger; Knockback fast doppelt (0,55 → 0,9) |
| **Augapfel** | Panel → Kampf → *Sekundär* auf Augapfel, dann Rechtsklick auf ein Aggro-Ziel |
| **Würfel** | dieselbe Auswahl, dritter Eintrag |
| **Palmen, Gras, Felsstufen** | §5 |

**Nicht** im Bild: Kapselprobe, Größen-Tor, Schrittmaß, Pool-Messung — die stehen in der Konsole
und im Panel.

**Und die häufigste Verwechslung:** die Adresszeile muß `?file=KFB+Travel+Combat+v25.dc.html`
zeigen. v24 lebt weiter und sieht bis auf die geteilten Module (`kfb-hit-response`,
`kfb-combat-cues`) genau wie vorher aus.

---

## 2 · Der Befund, der die Waffe gerettet hat (und wie er beinahe falsch gelesen wurde)

Erste Kapselprobe: **0 von 10.** Genau die Zahl, die auf der Schussbahn vor der Reparatur stand —
und deshalb die naheliegende Lesart: die Kugel-Hitbox greift bei einer Bogenbahn nicht.

Sie war falsch. Ein Bogenwurf trägt höchstens `v²/g` weit. Bei 24 u/s und g = 22 sind das
**26,2 u** — und `sky-mobs` setzt seine Mobs bei **110–190 u** in die Szene (v24-Entscheidung:
„am Horizont auftauchen statt um mich herum schweben"). Alle zehn Würfe fielen zu Boden, hüpften
dreimal und verblassten, weit vor dem Ziel. Die Null war eine Aussage über die **Reichweite**.

Deshalb nennt die Probe jetzt beide Zahlen und sagt selbst, welcher Fall vorliegt. Danach:

| Lauf | Tempo | Distanz | Treffer |
|---|---|---|---|
| 1 | 24 u/s (Modulwert) | 148 u | **0/10** — außer Reichweite, keine Aussage |
| 2 | 24 u/s | 24 u | **1/10** — Hitbox greift, aber der Wurf steht an seiner Grenze |
| 3 | **34 u/s** (Wirt-Wert) | 22,9 u | **5/10** |

Der 45°-Scheitelwurf an der Reichweitengrenze ist extrem empfindlich gegen jede Bewegung des Ziels;
das war die 1/10. **34 u/s** ergeben 52,5 u Reichweite und decken damit die Feuergrenze von 30 u mit
Luft. Der Wert steht als **Wirt-Wert in `combat-host.js`**, nicht im Modul: die Schussbahn hat mit
ihren 22 u recht, dieser Wirt auch — dieselbe Waffe, zwei Entfernungen, zwei richtige Zahlen.

**Die zweite Messung ist der Sprite-Pool**, und die Drosselung aus dem Plan (0,35 u) reichte nicht:

| Kreisabstand | Leben | Spurpuffe / 10 Würfe | Pool voll | Spitze |
|---|---|---|---|---|
| 0,35 u (Plan) | 0,36 s | 1718 | **905×** | 64/64 |
| 0,90 u | 0,36 s | 472 | 0 (bei 24 u/s) · 1 (bei 34 u/s) | 53 → 64 |
| 0,90 u | **0,28 s** | — | **noch zu messen** | — |

Der Plan hatte mit der Schussbahn gerechnet (12 u Bahn, 0,62 s Flugzeit). Hier lebt ein Geschoss
3,2 s und die Spur läuft über Aufsetzer und Ausrollen weiter. Die Zahl, die zählt, ist nicht die
Summe, sondern wie viele Kreise **gleichzeitig** leben: `Leben × Tempo / Abstand`. Der Hebel für den
letzten Schritt ist deshalb die **Lebensdauer** und nicht der Abstand — größerer Abstand reißt die
Spur in Punkte auseinander (das Geschoss ist 0,42 u dick), kürzeres Leben macht sie nur kürzer.
Dazu ein **Deckel von 48 Kreisen je Wurf** als Sicherung.
**Der Pool wurde nicht vergrößert.** Er wird es erst, wenn diese Zahl es verlangt.

---

## 3 · Warum das Schrittmaß gelesen und nicht angewandt wird

`schrittmass.json` hält die Standfuß-Drift **im Clip**: `strecke` (Weltunits je Zyklus) und `skala`
(der Maßstab, mit dem gemessen wurde). Der Quotient ist maßstabsfrei — Modelleinheiten je Zyklus —
und für alle 23 Pets mit Beinen auf vier Stellen identisch (**ein** Walk-Clip für alle).
In Weltunits dieses Wirts, normiert auf die Referenz `REF_K = 0,40795`:

* gemessen **0,3731 u** je Gehzyklus · **0,7488 u** je Rennzyklus (aus 23 Pets)
* eingebaut **2,70 u** · **4,70 u**
* **Faktor ×7,24**

Eine der beiden Zahlen beschreibt nicht die Wirklichkeit, und die Messung sagt nur, welche: bei 2,70
rutschen die Füße um Faktor 7; bei 0,3731 strampeln sie siebenmal schneller, weil das Lauftempo
(5,4 u/s für einen 0,82 u hohen Körper = **6,6 Körperhöhen je Sekunde**, ein Mensch sprintet bei 4)
für diesen Clip zu hoch ist. Das ist eine Entscheidung über das **Laufgefühl**, und sie gehört Georg.

Also: `petKin.ladeSchrittmass()` beim Start, die Zahlen in die Bootzeile (`[schrittmass] …`), ein
Schalter im Panel („Gemessene Schrittlänge benutzen") und `?stride=gemessen`. **Voreinstellung
bleibt der eingebaute Wert** — PLAN §6.7: zuletzt, weil es die Bewegung anfasst und damit das Bild,
an dem man alles andere beurteilt.

---

## 4 · Clean-Run v25

DC öffnen. Die Konsole muß zeigen:

```
[props] Index: 10509 Assets
[avatar] Fernando · Flamingo · N Clips · roh X u → 3.2 u (sc …) · Mündung an Chest
         · Radius 1.23 u → Versatz +1.29 u vor die Silhouette
[mobs] Pool vollständig: 20 Arten
[combat-v25] 20 Gegnerarten · Avatar … · N Ton-Namen · Augapfel bereit (Spur je 0.9 u) · Seed …
[schrittmass] gemessen 0.3731 u/Zyklus gehen · 0.7488 u rennen (aus 23 Pets, 2026-09-05)
              · eingebaut 2.7 · Faktor ×7.24 · AKTIV: gekoppelt
```

und **keine** `[boot-error]`. Dann:

| Prüfung | Erwartung |
|---|---|
| `window.__travelPOC.budget.tor()` | 4/4 |
| `combat.tor()` | **19/19**, sobald die Kapselprobe gelaufen ist (vorher 18/19 + 1 nicht messbar) |
| `combat.groessen()` | `{ mech: 3.2, gegner: 2.72, wer: 'Flieger', faktor: 1.18 }` |
| `combat.kapselprobe(10)` **auf ein Aggro-Ziel** | ≥ 3/10, Befund „die Kapselprüfung greift" |
| `combat.shots.zaehler.poolVoll` nach der Probe | **0** — sonst greift die Drosselung nicht |
| `props.report().drawCalls` | 45 |
| einmal feuern, Treffer ansehen | S1-Nachprüfung (Stauchachse, längerer Halt) |

**Wichtig für die Kapselprobe:** ein Ziel am Horizont (110–190 u) liegt außerhalb jeder Wurfbahn.
Erst Aggro auslösen (einmal treffen) — dann steht der Mob im 26-u-Slot und die Probe misst die Hitbox.

---

## 5 · Asset-Maße: ein Fehler, zwei Symptome

Georgs Befunde vom 05.09. — „Palme ist zu klein", „Blatt ist zu groß", „Felsstufen teilweise zu
klein" — waren **derselbe** Fehler: `prop-scatter` paßte jedes Modell nur über seine GRUNDFLÄCHE
ein. Das funktioniert, solange ein Modell etwa so breit ist wie hoch, und es geht garantiert schief
bei allem anderen. Gemessen:

| Modell | Höhe vorher | Ursache | jetzt |
|---|---|---|---|
| `Grass_2_A_Color1` | **3,44 u** | Halm, Grundfläche 0,23 u → riesiger Faktor | 0,95 u |
| `Grass_1_A_Color1` | 1,57 u | dasselbe | 0,95 u |
| `tree_palmDetailedTall` | 3,10 u | breite Krone → kleiner Faktor | **5,50 u** (eigene Höhe) |
| `tree_palmBend` | 3,07 u | dasselbe | 5,00 u |
| `RockPlatforms_Medium` | 1,15 u | breit und niedrig | 1,40 u |
| `Tree_1_A` / `Tree_3_B` (KayKit) | 2,88 / 2,37 u | rund und breit | 3,40 u |

Die Reparatur ist **eine Regel**: nach der Grundflächen-Einpassung wird die entstehende Höhe gegen
ein Band je `kind` geprüft, und nur Ausreißer werden nachkorrigiert. Wer im Band liegt, bleibt —
deshalb stehen die hohen Kiefern (8,78 u) unverändert. **11 von 38 Modellen** wurden korrigiert,
jede Korrektur steht mit beiden Zahlen in der Bootzeile und in `props.report().masse`.

Dazu: das Set wächst von 26 auf **38 Modelle** (Draw-Calls 45 → **57**) — sieben weitere
KayKit-Silhouetten, die zwei Felsstufen mit Grasplateau (die vorher gar nicht im Set waren), und
drei Gras-Geschwister, damit das Blatt eine GRUPPE bilden kann statt allein zu stehen.

---

## 6 · Offen für v26

1. **Nachprüfung Trefferreaktion** (S1) — sichtbare Änderung, nur Georg kann sie abnehmen.
2. **Schrittmaß-Entscheidung** (§3) — rutschen oder strampeln, oder das Lauftempo senken.
3. **Nachprüfung Renn-Bob** (Naht 179) — Flugphase statt höherem Hüpfer. `petKin.bobReport()`
   zeigt die Zahlen, `petKin.setBob('run', v)` / `setBob('hang', v)` stellt sie. Sichtbar nur im
   Bild, also Georgs Urteil.
4. **Pool-Messung** — jetzt eine Probe statt einer Rechnung: `combat.poolprobe(6)` **im Flug**.
   Erwartung 10,6 Kreise je Wurf (0,28 × 34 / 0,9), Spitze deutlich unter 64. Der Wert ist noch
   nicht abgelesen: die Probe braucht ein sichtbares, fokussiertes Fenster (siehe §7).
5. **fps @1080p bei 57 Draw-Calls** — `__travelPOC.fpsprobe(5)`. Erzwingt 1920×1080, setzt
   danach zurück, nennt Median/Mittel/p95 mit Draw-Calls. Ebenfalls noch nicht abgelesen.
6. Weiter aus v24 offen: Terrain wirft nicht auf sich selbst · **Sky-Karten aus einem Zufallsdeck
   — Georg hat es am 08.09. vorgemerkt** (siehe §8) · Terrain-Karten neu denken · Waffen-Balancing
   Hornet/Bog · Tanz-Abgriff mit Audio · Library abspecken.

## 7 · Warum zwei Zahlen weiter offen sind (und wessen Fehler das nicht ist)

Punkt 4 und 5 sind gebaut, aber nicht abgelesen. Der Grund ist eine Eigenschaft des Browsers, und
er ist es wert, hier zu stehen, damit ihn niemand zum zweiten Mal findet: **ein Fenster ohne Fokus
bekommt keine Bilder.** `requestAnimationFrame` wird angehalten, und ein angehaltenes Bild ist von
einem eingefrorenen Zustand nicht zu unterscheiden. Beim ersten Versuch am 08.09. zählte der
Sampler über sechs Sekunden **0 Bilder** — und die Zahlen, die dabei herauskamen (`verfallen` 0,
`anzahl` konstant, 64/64 Sprites belegt), sahen genau wie ein Speicherleck aus.

Der Bodenmodus-Fund (Naht 179) bleibt davon unberührt, weil er **nicht aus dieser Messung** kommt,
sondern aus dem Code: der `return` steht vor `shots.update`, das ist unabhängig von jedem Bild
wahr. Was die Messung nicht konnte, war ihn bestätigen. Der Unterschied zwischen „abgeleitet" und
„gemessen" steht deshalb auch im Kommentar an der Naht.

Beide Proben zählen ihre Bilder mit und geben `befund: 'KEINE AUSSAGE'` zurück, wenn es zu wenige
waren. Abgelesen werden sie in **Georgs Fenster**, mit der Seite vorn:

```js
await __travelPOC.fpsprobe(5)      // → Median/Mittel/p95 + drawCalls
__travelPOC.setMode('fly')          // die Poolprobe verweigert am Boden
combat.poolprobe(6)                 // Ergebnis nach ~8 s in combat.poolErgebnis
```

## 8 · Vorgemerkt (Georg, 08.09.) · Sky-Karten aus einem Zufallsdeck

Heute ist die Ziehung streng sequenziell: `deck[i % deck.length]` beim Bauen, `deck[nextIdx++ %
deck.length]` beim Respawn (`sky-cards.js`). Man sieht also immer dieselben sieben Titel in
derselben Reihenfolge.

Der Einbau ist klein, die Entscheidung dahinter nicht: **ein Zufallsdeck ist kein `Math.random()`
auf die Liste.** Damit kommt „The Doomsday Clock" dreimal hintereinander, und der Himmel wirkt
kaputt statt zufällig — dieselbe Falle wie bei jeder Musik-Zufallswiedergabe. Richtig ist ein
**gemischter Stapel, der abgetragen und neu gemischt wird** (Fisher-Yates, und beim Neumischen die
letzten *n* nicht wieder nach vorn), weil dann jede Karte garantiert vorkommt und keine sich
doppelt.

Zu entscheiden, bevor gebaut wird: gilt **ein Deck pro Zone** (Hopium · Doom · Protopia als
Regionen — dann trägt der Himmel die Erzählung mit) oder mischen alle drei durch? Das ist keine
Implementierungsfrage, sondern eine über die Welt.

