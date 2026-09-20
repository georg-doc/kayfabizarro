# WSA-REVIEW · Fahrzeug- und Fluglinie · Stand 18.09.2026

Vollständiger Code-Stand dieser Linie zum Review durch den WSA-Lead-Chat.
Alles in diesem Ordner ist eine **Kopie**; die Arbeitsfassung liegt im Projekt
`KFB Animation Lab`.

## In einem Satz

Eine Werkbank, die **61 Fahrzeuge** lädt, ihre Räder MISST, einen gruppenbasierten
Cartoon-Deformer plus vier Motion-Familien darauf legt und **23 deterministische Sequenzen**
abspielt — dazu ein **Flug-Tab mit 10 deklarierten, aber unbewegten Fixtures**.

## Was seit der letzten Übergabe passiert ist

| | vorher (17:15) | jetzt |
|---|---|---|
| Boden-Fixtures | 46 | **61** |
| Flug-Fixtures | – | **10**, deklariert, kein Deformer |
| Oberfläche | DocCheck-Rahmen, 40 Knöpfe unter der Bühne | **Atlas-Schnitt**: zwei Auswahlfelder, Zeitleiste im Dock |
| Sequenzen | 23 | 23, jetzt **spulbar** |

Der Auslöser: Georgs neuer Asset-Handoff (`kfb.asset-handoff.v1`, consumer `animation-lab`,
sourceCommit `29aac1061bdd`, 141 Assets). Gegen die alte Liste **gerechnet**, nicht durchgesehen:
**112 Assets waren nicht referenziert.**

## Womit ein Review anfängt

1. `SPRINTS.md` — **S2 blockiert alles Weitere.** Es ist eine Sichtabnahme, kein Bau.
2. `docs/LIVING_VEHICLES.md` — Entscheidungen V1–V22, jede mit ihrem Grund.
3. `TODO.md` und `BACKLOG.md` — was offen ist und was auf ein fehlendes Asset wartet.
4. `docs/PLAN_flight_deformer.md` — die nächste Ausbaustufe, noch nicht gebaut.
5. `docs/CHANGELOG.md` — additive Zeitachse, neuester Eintrag oben.

## Was der Lead wissen muss

**Nichts ist abgenommen.** Kein Profilwert ist abgestimmt, keine Fixture als Bildreihe belegt.
Die 23 Sequenzen laufen und enden im Ruhezustand; das ist eine Selbstprüfung, keine Abnahme.

**Die Nullen im Radbericht sind Befunde, keine Fehler.** Die Rad-Paar-Regel verlangt ein
Gegenstück auf derselben Höhe mit gleichem Radius und gleicher Größe. Traktor (kleine Vorder-,
große Hinterräder), Schubkarre (ein Rad) und Rollstuhl (zwei große, zwei kleine) fallen darum
teilweise durch. Erfunden wird nichts. **Ein Verdacht bleibt offen:** `rover-round` meldet 1 Rad,
und eine Eins verletzt die Regel — Lücke im Insel-Weg, nicht Messwert.

**Der Flug-Tab hängt bewusst KEINE Bodenfamilie an.** Alle zehn Flug-Fixtures melden 0 Räder;
Schlingern, Zwei-Rad und Manöver ankern ausnahmslos an Radmaßen. Eine Familie, die trotzdem liefe,
wäre Bewegung ohne Ursache.

**Eine Zeile stammt nicht aus dem Handoff.** `Paper Plane` (Georgs Nachtrag) ist byteweise am
Pfad geprüft — 3216 B @ 29aac106 — und mit `via: repo` geführt statt stillschweigend eingereiht.

## Dateien

```
KFB Cartoon Vehicle Deformer Lab v2.dc.html   die aktuelle Werkbank (Atlas-Schnitt, zwei Tabs)
KFB Cartoon Vehicle Deformer Lab.dc.html      v1, unverändert, als Vergleich
support.js                                    Laufzeit der Design Components
lab-v7/                                       der gesamte Code dieser Linie (14 Dateien)
  fixture-adapters.v3.js                        61 Boden- + 10 Flug-Fixtures (importiert v2)
  fixture-adapters.v2.js                        46 Fixtures, drei Runden gemessener Zahlen
  carrig.v2.js                                  Messen, Radsuche, Backen, WheelRig
  vehicle-cartoon-deformer.v2.js                Pose: Gruppen und Springs, keine Shader
  vehicle-{fishtail,manoeuvre,twowheel,tumble}  die vier Motion-Familien
  deformer-profiles.json                        sechs Profile — hier landen die Abnahmezahlen
  TEST_SEQUENCES.json                           23 Sequenzen als Signalverläufe
data/handoff-animation-lab-29aac106.json      Georgs Handoff, die Quelle der neuen Zeilen
docs/                                         Stand, Zeitachse, Pläne, frühere Übergaben
SPRINTS.md · TODO.md · BACKLOG.md             Planung
ONBOARDING_frischer_chat_v2.md                für den Chat, der die Linie fortsetzt
```

## Laufen lassen

Die `.dc.html` öffnet direkt im Browser; `support.js` muss daneben liegen. Die Modelle werden
über gepinnte RAW-Adressen aus `georg-doc/kayfabizarro` geladen — es braucht eine Netzverbindung,
aber kein Konto. Griffe für Beweisbilder liegen auf `window.__cvd`
(`paint()`, `stepMs(ms)`, `scrubTo(ms)`, `seqState()`, `camState()`, `measured()`).
