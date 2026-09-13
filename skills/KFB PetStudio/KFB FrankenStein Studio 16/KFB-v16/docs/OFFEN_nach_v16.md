# Offen nach v16 · aufgenommen 13.09.2026, 07:00
*Nur festgehalten, nichts davon ist gebaut. Reihenfolge = Georgs Reihenfolge.*

Beleg: Georgs Bildschirmfoto vom 13.09., 06:56 (Graft-driver auf der Karte, Prüfzustand »E · Descent«).

---

## 1 · Kartenmotiv um 90° drehen
**Befund (Georg, am Bild).** Die Wortmarke auf dem Kartenrücken läuft quer zur Karte: »Kayfa« und
der »Bizarro«-Kasten liegen entlang der LANGEN Kante, gelesen wird aber über die kurze.

**Wo es sitzt.** `frizzlegraft-v1/cardrider.v1.js`, in `buildCard()`:
```js
tx.center.set(0.5, 0.5); tx.rotation = Math.PI / 2;
```
**⚠ Meine Begründung dafür war eine Annahme, keine Messung:** ich habe aus »447 × 800 im Briefing«
geschlossen, das Blatt sei hochkant, und um +90° gedreht. Die kopierte Datei ist aber **800 × 447**,
also schon quer — die Drehung war der Fehler, nicht die Rettung.

**Wenn es drankommt:** erst die Blattlage MESSEN (Breite/Höhe der geladenen Datei), dann die Drehung
daraus ableiten statt sie zu setzen. Kandidaten sind `0` und `-Math.PI/2`; welcher stimmt, sagt ein
gerendertes Bild, keine Rechnung. Die Rückseite (−y) braucht zusätzlich eine Spiegelung, sonst steht
die Marke von unten seitenverkehrt.

---

## 2 · Kippung greift nicht
**Befund (Georg).** »Kippung geht nicht.« Im Bild steht »E · Descent« an, die Karte liegt aber
sichtbar in einer anderen Lage als der Zustand verlangt, und die Figur folgt ihr nicht erkennbar.

**⚠ Was ich dazu WEISS und was nicht.** Gemessen habe ich nur den Zahlenwert:
Karte `rotation.z` 0,384 = Figur `rotation.z` 0,384, Pitch 0,2793 = 0,2793. Das beweist, daß die
beiden Zahlen gleich sind — **es beweist NICHT, daß im Bild etwas kippt**. Genau die Hausregel, die
hier schon zweimal bezahlt wurde: »getroffen« ist nicht »gesehen«.

**Zwei Verdachte, beide ungeprüft:**
- `_cardPlace()` setzt `fig.quaternion` und `fig.position` — die **Bildschleife des Studios schreibt
  dieselben Felder jedes Bild neu** (Clip, Pose-Rig, Bodenausrichtung). Dann steht die Kippung genau
  ein Bild lang. Das würde erklären, warum die Zahl stimmt und das Bild nicht.
- Der Prüfzustand wird über `_cardSet({state})` gesetzt, der Neuaufbau der Karte (`_cardBuild`)
  stellt aber auf `c.state` zurück — ein Rückbau nach dem Umschalten könnte den Zustand fressen.

**Wenn es drankommt:** zuerst zwei selbst gerenderte Standbilder (Cruise gegen Bank links) und die
Pixel zählen, dann erst in den Code. Nicht umgekehrt.

---

## 3 · Vollständiger Export v16
- **Code-Abgabe** der Fassung v16 mit allen Ladewegen (`frizzlegraft-v1/` · `petstudio-v9/studio-v12`
  · `studio-v13` · `studio-v3` · Spender-GLTF · Kartenmotiv).
- **Ein einzelnes Standalone-HTML**, das ohne Netz läuft.
- **WSA-Übergabe** im Format der beiden vorhandenen Berichte
  (`WSA_BERICHT_2026-09-12.md`, `WSA_UEBERGABE_ROVER_MATERIAL_ANTRIEB_2026-09-12.md`).

⚠ Vor dem Standalone gehören Punkt 1 und 2 erledigt — ein eingefrorenes Blatt mit schiefem Motiv und
toter Kippung ist eine eingefrorene Baustelle.

---

## 4 · Briefing für den Sonnet-Chat · Animation Lab v5 + Waffen-Regler
**Zweck.** Das Studio ist der Ort, an dem ENTSCHIEDEN wird; das Lab spielt ab. Ein zweiter Chat soll
das Lab v1 → v5 heben, ohne diesen Chat mitzulesen.

**Der Kern, aus Georgs eigenem Postmortem** (`lab-v4/POSTMORTEM_WEAPON_HOLD.md`): die Referenz
`Character_Gun.gltf` lag vor und wurde **sechsmal abgeleitet statt wörtlich übernommen**; Versuch 5
war richtig und scheiterte nur an der Eigenlage von `FistR` gegen `handslotr`.

**Also für das Studio:** Regler für die Waffenlage am Handknochen (Lage, Drehung, Griffpunkt), von
Georg EINMAL kalibriert für den Main-Blaster, das Ergebnis in den Vertrag exportiert — das Lab liest
die Lage, statt sie zu rechnen. Das ist die Naht, die das Briefing beschreiben muß: Waffenlage plus
Look- und Card-Vertrag. Das ganze Lab zu beschreiben ist NICHT nötig und würde den Schnitt verwischen.
