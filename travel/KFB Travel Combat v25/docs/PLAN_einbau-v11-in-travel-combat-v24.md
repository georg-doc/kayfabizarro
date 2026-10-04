# Plan · Einbau v11-Slice in KFB Travel Combat v24

Gelesen aus `KFB Travel Combat v24/travel-combat-v24_2026-09-05/` (Session-Export vom 05.09.).
Kein Wunschzettel — nur was aus dem tatsächlichen Stand von v24 folgt.

---

## 1 · Was v24 schon hat (und warum „alles portieren" die falsche Frage war)

| v24 hat | Modul dort |
|---|---|
| Mech-Avatar, 4 Mechs mit Signaturwaffe | `mech-avatar.js` |
| Zielauswahl, Lock-Kegel 34°, Dauerfeuer/Rakete | `combat-host.js` |
| **20 Gegnerarten, darunter alle 17 Monsters-Bundle-Flieger** | `sky-mobs.js` |
| Geschosse, Hitboxen, eigener kleiner Sprite-Pool (64) | `combat-shots.js` |
| HUD, HP, Pop-Score | `combat-hud.js` |
| Pets als Bewohner, eigene Kinetik | `kfb-pets.js`, `pet-kinetics.js`, `pet-facing.js` |
| Flug- und Laufsteuerung | `flight-controller.js`, `walk-controller.js` |
| Lichtbudget mit Tor (4/4) | `light-budget.js` |
| Schatten inkl. Prop-Tiefenmaterial | im Terrain-Shader |

**Und der wichtigste Fund:** `combat-host.js` importiert bereits

```js
import { createHitResponse } from '../modules/kfb-hit-response.js';
import { createCombatCues } from '../modules/kfb-combat-cues.js';
```

Damit sind **zwei der Module, die ich heute geändert habe, dort schon verdrahtet.** Der Port ist
also kein Neubau, sondern in Teilen ein Update — und in anderen Teilen ausdrücklich nichts.

Nebenbefund, der eine offene Frage beantwortet: die **17 Monsters-Bundle-Flieger laufen in v24
längst** („Clip-Rollen zur Laufzeit gemessen"). Nur der def-Roster der Schussbahn führt sie als
`ready: false`. Die LADEPROBE in Academy 02 schließt diese Lücke auf der Schussbahn-Seite; für v24
ist sie erledigt.

---

## 2 · Kommt automatisch mit dem Push — mit EINER Nachprüfung

Sobald `modules/kfb-hit-response.js` und `modules/kfb-combat-cues.js` im Repo liegen, zieht v24 sie
beim nächsten Laden. Was sich dort dann ändert:

**`kfb-hit-response` (API additiv, kein Aufrufer muss sich ändern)**
- Die Stauchachse liegt jetzt in **Körperkoordinaten** statt in Weltkoordinaten. In der Schussbahn
  war das eine Reparatur (beide Körper sind um −90° gedreht, es stauchte quer zur Bahn). In v24
  fliegen die Mobs in beliebige Richtungen — dort ist die Umrechnung **generisch richtig**, aber
  sie verändert sichtbar, wie ein Treffer aussieht.
- **HOLD getrennt vom HITSTOP:** die gestauchte Pose steht mindestens 0,07 s, unabhängig vom
  Bildbudget des Zellprofils. Trefferreaktionen werden dadurch etwas länger und deutlicher.
- **Ein Überschwinger statt 1,2 Perioden** — weniger Gummi.
- Neu: `gate(vis)` → 0…1, wie stark die Bewegung des Getroffenen gebremst werden soll. v24 muss das
  nicht benutzen; ungenutzt kostet es nichts. Wenn doch, ist es die Naht, an der ein getroffener Mob
  kurz aus seiner Flugbahn fällt.
- `knockScale` 0,55 → **0,9**. In v24 wirkt das direkt auf den Knockback der Mobs.

**`kfb-combat-cues` (API additiv)**
- Neuer Anker `hop` (`hop.{surface}`) für aufsetzende Geschosse, am Ort, ohne Bestätigung am Ohr.
- `feuer()` nimmt einen eigenen Debounce-Schlüssel für FOLGEN — drei Aufsetzer sind drei Ereignisse,
  nicht ein Doppelschlag.

**Die Nachprüfung, und sie ist Pflicht:** einmal in v24 feuern und einen Treffer ansehen. Die
Stauchachse und die längere Haltezeit sind eine **sichtbare** Änderung an einem laufenden Spiel.
Wenn es dort schlechter aussieht als vorher, ist das ein Befund über v24s Körperachsen, kein Grund
zurückzubauen — dann gehört ein `params`-Wert in den Wirt, nicht eine zweite Fassung ins Modul.

---

## 3 · Echter Zugewinn, klein einzubauen

### `kfb-weapon-eyeball.js` — die Augapfel-Waffe

Braucht drei Dinge, die v24 alle hat oder billig hat:

| braucht | in v24 |
|---|---|
| Sprite-Emitter `(zelle, pos, opts)` | `combat-shots.emit` — vorhanden |
| Vektorfabriken `vec`/`vecv` | zwei Zeilen im Wirt |
| Untergrundfarbe (für das Tor) | aus `world-context`/`light-budget` ableitbar |
| `studio-v3/pet-eye-rig.v5.js` | **muss mitgepusht werden** — harte Abhängigkeit |

**Der Engpass ist der Sprite-Pool:** v24 hält 64 Plätze, ausdrücklich klein und ausdrücklich *kein*
Nachbau von `kfb-fx-sprites`. Die Augapfel-Spur stößt je 0,2 u Strecke einen Kreis aus (rund 14 auf
12 u), der Platzer 21 weitere. Ein Schuss belegt also gut die Hälfte des Pools. **Empfehlung:** die
Waffe zuerst mit `kreisAbstand` auf 0,35 u und `popRegen` auf 5 einbauen und den Pool messen
(`combat-shots.anzahl`), nicht den Pool vergrößern.

### `kfb-weapon-dice.js` — der Würfelwurf

Gleiche Naht, weniger Last (ein Geschoss, kein Spurenwerk). Nach dem Augapfel trivial.

### `schrittmass.json` — für die Pet-Kinetik

v24 hat `pet-kinetics.js` und eigene Controller. Was die Datei ihm gibt: **walk 1,0284 u/s · run
4,1279 u/s · Umschaltpunkt 2,06 u/s** (geometrisches Mittel). Damit kann `pet-kinetics` seine
Clip-Rate rechnen statt zu koppeln — dieselbe Reparatur, die heute in der Schussbahn den
Rutschfaktor auf 1,00 gebracht hat. **Nicht** `kfb-mob-locomotion` einbauen: v24 hat seine eigene
Bewegung, und zwei Bewegungsquellen auf einem Körper haben keine.

---

## 4 · Was ausdrücklich NICHT hineingehört

- **`kfb-fx-sprites.js`.** v24 hat sich bewusst dagegen entschieden und schreibt das in
  `combat-shots.js` hin. Diese Entscheidung ist zu respektieren, bis v24 selbst an eine Grenze
  stößt — und dann ist es eine Messung („Pool voll, N Ereignisse fielen aus"), keine Vorliebe.
- **`kfb-mob-locomotion.js`.** Siehe oben: Flight- und Walk-Controller sind dort der Besitzer.
- **`kfb-fx-flame.js`.** Erst wenn v24 etwas brennen lassen will. Es braucht die Vektorfabriken und
  eine Rauchfarbe vom Wirt; ohne diese Werte macht es beigen Rauch auf beigem Boden — der Fehler
  steht in `github.md` unter v10.
- **Die Schussbahn-UI.** Sie ist ein Messstand. v24 hat ein Spiel-HUD.

---

## 5 · Der Befund, der in v24 noch offen ist

**Der Mündungsblitz ragt hinten aus dem Körper.** Gemessen in `mech-avatar.js`:

```js
muendung(out) {
  if (chest) chest.getWorldPosition(out);        // ← Brust-Bone, KEIN Versatz nach vorn
  else { object3D.getWorldPosition(out); out.y += P.hoehe * 0.6; }
}
```

Der Knoten liegt **im** Körper. Additive Sprites mit `depthWrite: false` sind von hinten sichtbar,
also sieht man die hintere Hälfte des Blitzes durch das Modell — genau Georgs „weiße Kreise auf der
Rückseite beim Abschuss". `github.md` hält die Lösung fest, sie ist eine Zeile:

> Knoten um den halben **gemessenen** Körperradius plus eine Handbreit vor die Silhouette legen
> (`rad × 0,9 + 0,18`), nicht auf einen Bruchteil der Höhe.

Der Mech kennt seine Richtung nicht (`muendung` nimmt sie nicht an) — die Richtung kommt vom Wirt.
Also entweder `muendung(out, dir)` erweitern oder den Versatz in `combat-host.js` addieren, wo `dir`
schon vorliegt (Zeile 154/179). **Das ist der kleinste Eingriff mit dem sichtbarsten Ergebnis** und
sollte vor allem anderen passieren.

Zweiter Befund aus `github.md`, in v24 wahrscheinlich schon erledigt: die Kapselprüfung gegen
langsame Geschosse. `combat-shots.js` führt „Kugel-Hitboxen" — vor dem Einbau einer Bogenwaffe
(Würfel, Augapfel) einmal gegenmessen: **10 Würfe auf einen Mob, wie viele treffen.** Bei der
Schussbahn waren es vor der Reparatur 0 von 10.

---

## 6 · Reihenfolge

1. **Push** (`docs/HANDOVER_push-und-port.md`) — ohne ihn passiert in v24 nichts.
2. **Mündungsversatz** in v24. Eine Zeile, sichtbares Ergebnis, unabhängig von allem anderen.
3. **Nachprüfung Trefferreaktion:** einmal feuern, Treffer ansehen. Die neue Stauchachse und der
   längere Halt sind sichtbar.
4. **Kapselprobe:** 10 Würfe, zählen.
5. **Augapfel** mit gedrosselter Spur, Pool messen.
6. **Würfel.**
7. **`schrittmass.json`** an `pet-kinetics` — erst wenn 2–6 stehen, weil es die Bewegung anfasst und
   damit das Bild, an dem man alles andere beurteilt.

**Und die Regel für jeden Schritt:** `zeile()` und `tor()` jedes eingebauten Moduls gehören in v24s
Bootzeile. v24 macht das für seine eigenen Module schon vorbildlich (`[avatar] …`, `budget.tor()`
4/4) — die zugezogenen müssen dort mitreden.
