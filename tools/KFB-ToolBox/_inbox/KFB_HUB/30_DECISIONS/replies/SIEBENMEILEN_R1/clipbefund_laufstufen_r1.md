# Clip-Befund Laufstufen · Siebenmeilenstiefel R1 · WSB 17.11.2026

**Grundlage** ist der Stamm-Stand von `waffen/kammer-r1` @364a4951:
- `src/modules/m1-gait.js`: Gang-Mischer nach V-248, Abspielrate = Tempo / Eigentempo, Grenzen 0,8–1,25;
- `src/m1/M1Player.jsx`: M1MOVE;
- die KayKit-Pakete in `src/assets/actors/Rig_Medium_*.glb`.

**Einheit:** m/s in der Welt (V-020, Klassenhöhe 2,2 m) bzw. Rig-Einheiten/s.

## 1 · Heute im Spiel

| Stufe | Taste | Tempo (M1MOVE) | Clip (KayKit) | Eigentempo (Rig/s) | sauberer Bereich (×0,8 … ×1,25) |
|---|---|---|---|---|---|
| Gehen | Strg+W | 1,12 | Walking_B (1,07 s) | 1,182 | 0,95–1,48 |
| Laufen (Joggen) | W | 3,08 | Running_A (0,80 s) | 3,42 | 2,74–4,28 |
| Sprint | Shift+W | 4,88 | Running_B (0,80 s) | 5,364 | 4,29–6,71 |

- Alle drei Stufen liegen innerhalb ihres Clips: Abspielrate 0,95 / 0,90 / 0,91.
- Lücke Gehen ↔ Laufen (1,48–2,74): Der näher liegende Clip spielt an seiner Grenze, dort rutschen die Füße. Das ist in `m1-gait.js` offengelegt.
- Über Sprint gibt es keinen KayKit-Clip mehr. Running_B ist der schnellste Lauf in allen Medium-Paketen (MovementBasic, MovementAdvanced, General, Special).

## 2 · Bis zu welcher Abspielrate (KayKit)
- **Sauber, Füße stehen:** bis ×1,25 (Grenze aus V-248). Für Running_B sind das 6,7 Rig/s.
- **Cartoon-Bereich (meine Einschätzung, auf der Kampfbühne noch zu messen):** etwa ×1,5–1,6.
  - Darüber rutschen die Füße sichtbar, weil die Schrittlänge des Clips fest ist.
  - Bis dahin wirkt das schnellere Trippeln noch als „schneller rennen“.
  - Für Running_B wären das etwa 8–8,6 Rig/s.
- Für **Turbo** (etwa ×2 Sprint) und **Roadrunner** (Cartoon, weit darüber) reicht Abspielrate allein nicht.

## 3 · Vorschlag je Stufe (KayKit zuerst)

| Stufe | KayKit-Weg | fehlt |
|---|---|---|
| Gehen | Walking_B (wie heute); Walking_A/C als Variante | – |
| Laufen | Running_A (wie heute) | – |
| Sprint | Running_B (wie heute) | – |
| Turbo | Running_B bis ×1,6, dazu Vorlage im Code (Rumpf vor wie FLY_KIN), Ohren-Wind | Clip „Sprint gestreckt“: längere Schritte, Arme zurück (WSB-Clip wie die Jetpack-Clips r2c), damit die Füße ab ×1,6 nicht rutschen |
| Roadrunner | keiner | Clip „Wirbelbeine“: Beine als schneller Kreis, Oberkörper ruhig und weit vor, Ohren flach. Sinnvoll mit Bewegungsunschärfe bzw. Wirbel-VFX an den Füßen; Staub aus dem Bodenkontakt-Konzept (V-1885) |

## 4 · Start, Kurvenlage, Bremse

| Teil | KayKit-Ersatz | Bewertung | fehlt |
|---|---|---|---|
| Start (Anlauf) | Jump_Start (0,60 s, Hocke) als Ausholen, dann Dodge_Forward (0,40 s) als Antritt | Notlösung: Jump_Start liest sich als Sprung, Dodge als Ausweichen | eigener Start: Ausholen nach hinten, Kopf vor, dann Antritt (Extrempose, 0,3–0,4 s) |
| Kurvenlage | keiner (Running_Strafe_L/R sind Seitschritte ohne Neigung) | im Code lösbar: Neigung um die Hüfte wie FLY_KIN-Schräglage, Kopf blickt in die Kurve | optional ein Überlagerungs-Clip „Kurve“ (Arme außen, inneres Bein tiefer) wie jet_bank_left/right |
| Bremse | Dodge_Backward (0,40 s) als Rutschbremse, Jump_Land (0,67 s) als Stauchung beim Stand | Dodge_Backward springt nach hinten, liest sich nicht als Bremsen | eigener Bremsclip: Fersen vor, Körper zurück, Arme rudern, Staubspur (Extreme wie jet_brake) |

## 5 · Empfehlung
Turbo- und Roadrunner-Stufe, Start und Bremse brauchen eigene Clips. Das wäre ein Clip-Paket nach dem Muster `KFB_JetFlight.r2c` (Jetpack-Bestand R1): Sprint gestreckt, Wirbelbeine, Start, Bremse und optional Kurve, mit Cartoon-Dehnung, gemessen auf der Kampfbühne.

Gehen, Laufen und Sprint bleiben bei KayKit wie heute. Auf Zuruf baue ich das Paket.
