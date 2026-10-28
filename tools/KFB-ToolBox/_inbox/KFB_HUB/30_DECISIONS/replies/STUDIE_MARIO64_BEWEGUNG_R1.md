# Studie · Mario 64: Bewegung, Sprung, Übergänge – Zahlen und Abgleich mit FrizzleBob · R1 · 28.10.2026

**Anlass:** Georg 28.10.: „Das Einzige, was du steuerst, sind die Übergänge – wie Erholen und Ausholen im Timing laufen, damit alles cartoonig wird; Sprünge etwas höher; die ganze Bewegung in der Physik cartooniger. Der Rest kommt aus IK und den Animationen, die wir haben.“ Und: „Hast du dir alle Animationen, Bewegungen, Physik, Sprunghöhe, Sprungverhalten und Animationszustände von Mario 64 angesehen?“ Ehrliche Antwort bisher: nein, nur allgemeine Grundsätze (RECHERCHE_ANIMATION_KLASSIKER_R1, ANIMATIONSBIBEL_R1 §1.7). Diese Studie holt das mit Zahlen nach.

**Rahmen:** Nur Physik, Timing und Übergänge mit den vorhandenen Clips. Keine neuen Animationen, kein Code in diesem Schritt.

## 0 · Quellen und Umrechnung

**Gelesen (Quelltext, Stand master):** SM64-Dekompilierung `n64decomp/sm64`: `src/game/mario.c` (Absprung-Tempi `set_mario_action_airborne`, Sprungkette `set_jump_from_landing`, Tasten, Animationswechsel `set_mario_animation`), `mario_step.c` (Schwerkraft `apply_gravity`, Sprunghöhen-Schnitt, Bodenfang), `mario_actions_airborne.c` (alle Sprünge, Luftsteuerung, Stampfer, Wandsprung), `mario_actions_moving.c` (Gehen/Laufen, Bremsen, Rutschwende, Landungen mit Bildzahlen), `mario_actions_stationary.c` (Stand, Ducken, Lande-Halt), `camera.c` (Kamerahöhe beim Sprung), `include/sm64.h` (Zustands-Merkmale). Dazu Georgs Mario-Sprite-Tafel (`75_REFS/animation_classics_r1/mario_sprite_sheet.png`), unsere Notizen und der Spielcode (§3).
**Nicht gelesen in diesem Schritt:** TAS-/pannenkoek-/Bismuth-Videos und GDC-Vorträge. Der Quelltext ist die Primärquelle; die Zahlen unten stammen alle aus dem Code, nicht aus Sekundärquellen.

**Umrechnung Mario:** Spiel-Logik 30 Bilder/s, 1 Bild = 1/30 s. Marios Trefferzylinder ist 160 Einheiten hoch (`hitboxHeight = 160`) → **1 Körperhöhe (KH) = 160 E**; Annahme 100 E = 1 m, also Mario ≈ 1,6 m. Tempo 1 E/Bild = 0,30 m/s = 0,19 KH/s. Beschleunigung 1 E/Bild² = 9 m/s² = 5,6 KH/s².
**Umrechnung FrizzleBob:** Im Spiel steht FB laut `src/worldScale.js` mit **1,81 m** (FB_HEIGHT_M, mit Ohren; J17-Meter, Welt-Schwerkraft 9,81). Die Kapsel reicht bis ≈ 1,30 m über den Füßen (Körper ohne Ohren). **Achtung:** Der Auftrag nennt „≈ 0,75 m“ – das passt zu keinem Wert im Code. Alle Vorschläge stehen deshalb auch in Körperhöhen (KH, FB = 1,81 m); wer ohne Ohren rechnet (1,30 m), multipliziert die KH-Werte mit 1,39.

## 1 · Marios Zustände und Übergänge

```
                 Stick                    Stick weg (Tempo ≥ 16)
   STAND ───────────────► GEHEN/LAUFEN ─────────────────────► BREMSEN ──► (Halt) ──► STAND
     │  ▲   Start sofort mit 8 E/Bild │  ▲ Stick > 100° zurück (Tempo ≥ 16)
     │  │                             │  └───────────────► RUTSCHWENDE ──► WENDE-ENDE (180°-Sprung, 8 E/Bild)
     │  │                             │                       │ A
     │  │ A                           │ A                     ▼
     │  │                             ▼                    SEITSALTO (62)
     │  └── LANDE-HALT ◄── LANDUNG (4 Bilder) ◄── EINFACHSPRUNG (42 + ¼·Tempo)
     │        (Anim läuft     │ A binnen Fenster           │ Z in der Luft → STAMPFER
     │        nur ohne        ▼                            │ Wand bei Tempo > 16 → WANDKONTAKT
     │        Eingabe)    DOPPELSPRUNG (52 + ¼·Tempo)      │      └ A binnen 1–2 Bildern (bzw. 5 Bildern
     │                        │ Landung, A binnen Fenster, │        aus dem Abprallen) → WANDSPRUNG (62)
     │                        ▼ Tempo > 20                 ▼
     │                    DREIFACHSPRUNG (69, Salto)    FREIER FALL (Kante: sofort, kein Nachlauf)
     │ Z
     ▼
   DUCKEN ── A ──► RÜCKWÄRTSSALTO (62, Tempo −16)
   LAUFEN ── Z ──► RUTSCH-DUCKEN ── A in der 1. Sekunde, Tempo > 10 ──► WEITSPRUNG (30, halbe Schwerkraft, Tempo × 1,5)
```

**Grundregeln aus dem Code:**
- **Absprung ohne Ausholen.** Taste gedrückt → im selben Bild neuer Zustand, Steigtempo gesetzt, erster Luftschritt (42 E = 0,26 KH) schon gemacht. Die Sprung-Animation startet neu (`animID = −1`). Null Bilder Anlauf. Georgs Sprite-Tafel zeigt dasselbe: Bild 1 Stand, Bild 2 schon die gestreckte Flugpose (Reihen 11–14).
- **Kein Überblenden.** `set_mario_animation` schaltet die Animation hart um. Die Posen sind so gebaut, dass sie aneinander passen.
- **Landung ist kurz und sofort unterbrechbar.** 4 Bilder (0,13 s) Landezustand, Tempo dabei × 0,98 je Bild (Schwung bleibt). Danach: Stick gehalten → sofort Laufen; ohne Eingabe → Lande-Animation bis zum Ende, aber jede Eingabe bricht sie ab. Nur nach Dreifachsprung und Rückwärtssalto ist A in den 4 Bildern gesperrt; nach dem Weitsprung dauert die Landung 6 Bilder.
- **Sprungkette:** Bei jeder Landung wird ein Fenster von 5 Bildern gesetzt. A in den 4 Landebildern oder bis 5 Bilder danach (solange er noch landet) → nächste Stufe. Im Lauf praktisch **0,13–0,17 s**, im Stand bis **0,3 s**. Dreifachsprung nur aus der Doppelsprung-Landung und mit Tempo > 20 E/Bild (62 % des Höchsttempos).
- **Kein Sprung-Puffer, keine Nachlaufzeit an Kanten.** A zählt nur im Bild des Drückens; wer von der Kante läuft, fällt im selben Bild. Dafür fängt der Boden Stufen bis 100 E (0,63 KH) nach unten ab.
- **Animation folgt der Physik.** Beim Doppelsprung wechselt die Pose am Scheitel (Steigtempo ≥ 0 → „steigen“, sonst „fallen“), nicht nach Zeit.

## 2 · Marios Physik in Zahlen

### 2.1 Sprünge (Höhe = Summe der Bild-Tempi, Zeiten bei 30 Bildern/s)

| Sprung | Steigtempo (E/Bild) | Scheitel | Steigzeit | Flugzeit | Vorwärts | Höhe per Tastendauer |
|---|---|---|---|---|---|---|
| Einfach, Stand | 42 (12,6 m/s = 7,9 KH/s) | 242 E = **1,5 KH** | 0,37 s | **0,73 s** | – | ja |
| Einfach, voller Lauf | 42 + ¼·32 = 50 | 338 E = **2,1 KH** | 0,43 s | **0,87 s** | Tempo × 0,8 beim Absprung | ja |
| Doppel, Stand / Lauf | 52 / 60 | 364 / 480 E = **2,3 / 3,0 KH** | 0,43 / 0,50 s | ≈ 0,9 / 1,0 s | × 0,8 | ja |
| Dreifach (Salto) | 69 (ohne Tempo-Anteil) | 630 E = **3,9 KH** | 0,60 s | **≈ 1,2 s** | × 0,8 | nein |
| Rückwärtssalto / Seitsalto / Wandsprung | 62 | 512 E = **3,2 KH** | 0,53 s | ≈ 1,07 s | −16 / 8 / ≥ 24 | nur Wandsprung |
| Weitsprung | 30, **Schwerkraft halb (2)** | 240 E = **1,5 KH** | 0,50 s | ≈ 1,0 s | × 1,5, Deckel 48 (14,4 m/s) → ≈ **9 KH weit** | ja |
| Stampfer | in der Drehung 10 Bilder Hochruck um 110 E (0,7 KH), Pause = Animation + 4 Bilder, dann −50 → −75 E/Bild | | | | 0 | – |

- **Schwerkraft:** 4 E/Bild² = 36 m/s² = **22,5 KH/s²**, **beim Steigen und Fallen gleich** (kein verstärkter Fall). Ausnahmen: Weitsprung 2, Lava 3,2.
- **Fall-Höchsttempo:** 75 E/Bild = 22,5 m/s = **14 KH/s**, erreicht nach ≈ 19 Bildern Fall (0,63 s, ≈ 4,4 KH Fallhöhe). Bei normalen Sprüngen nie erreicht.
- **Sprunghöhe per Tastendauer:** Wird A losgelassen, solange das Steigtempo > 20 E/Bild ist (≈ 48 % des Stand-Absprungs), wird das Steigtempo in diesem Bild **durch 4 geteilt**. Kürzester Hüpfer aus dem Stand ≈ 60–100 E (0,4–0,6 KH) statt 1,5 KH. Gilt für Einfach-, Doppel-, Weit- und Wandsprung, nicht für Salti und Dreifachsprung.
- **Warum der Sprung ohne Ausholen trotzdem „liest“:** (1) Riesiger erster Schritt (0,26 KH im ersten Bild) wirkt wie ein Streck-Schmierbild. (2) Starke Schwerkraft relativ zur Körpergröße → kurze, knackige Bögen (0,7–0,9 s), am Scheitel 3 Bilder fast Stillstand (|Tempo| ≤ 6). (3) Eigene Pose je Sprungstufe, Posenwechsel am Scheitel, Ruf („Wa!“, „Hoo-hoo!“, „Yahoo!“). (4) Die Kamera geht nicht mit nach oben (§2.4) – Mario steigt sichtbar im Bild. (5) Landung mit Staub ab Tempo 16 und kurzer Stauchpose.

### 2.2 Boden

| Größe | Mario | in Sekunden / KH |
|---|---|---|
| Anlaufen | erstes Bild sofort 8 E/Bild, dann + (1,1 − Tempo/43) je Bild | 25 % sofort, 75 % nach 0,75 s, voll nach 1,35 s |
| Höchsttempo | 32 E/Bild | 9,6 m/s = **6 KH/s** |
| Drehen beim Laufen | 0x800 je Bild | **337°/s** |
| Rutschwende (Stick > 100° zurück, Tempo ≥ 16) | −4 E/Bild² | aus vollem Lauf **0,27 s** Rutschen, dann 180°-Wechsel, weiter mit 8 E/Bild; A während des Rutschens = Seitsalto |
| Bremsen (Stick los, Tempo ≥ 16) | −4 E/Bild² | ≤ 0,27 s, dann Halte-Animation (unterbrechbar) |
| Auslaufen (Stick los, Tempo < 16) | −1 E/Bild² | ≤ 0,5 s |

### 2.3 Luftsteuerung
- Vorwärts/rückwärts: ± 1,5 E/Bild² aus dem Stick, dazu Luftbremse 0,35 → netto + 1,15 vorwärts (≈ wie am Boden).
- Seitwärts: sofort bis 10 E/Bild (31 % des Höchsttempos), ohne dass Mario sich dreht. **Bei normalen Sprüngen dreht der Körper in der Luft nicht.**
- Über 32 E/Bild baut die Luft 1 E/Bild² ab (Weitsprung erst über 48).

### 2.4 Kamera beim Sprung (`camera.c`, `calc_y_to_curr_floor`)
- Die **Kamerahöhe richtet sich nach dem Boden unter Mario**, nicht nach Marios Höhe – bis 200 E (1,25 KH) über dem Boden. Erst darüber zieht sie mit.
- Der **Blickpunkt steigt nur um 10 % der Sprunghöhe** (Faktor 0,9 zum Boden hin), vertikal zusätzlich weich nachgeführt (0,3 je Bild).
- Folge: Bei normalen Sprüngen steht die Welt still und Mario fliegt im Bild nach oben. Der Sprung wirkt hoch.

## 3 · Heute bei uns (Code gelesen 28.10.)

**Wo:** `src/m1/M1Player.jsx` (ecctrl 2.0.2, Werte M1MOVE/M1WOW), `src/m1/m1Scale.js` (K = 0,651, G = 9,81, JUMP_K = 0,675), `node_modules/ecctrl` (Sprungmechanik), `src/modules/m1-locoActor.js` (Clip-Wahl `airState`), `src/modules/m1-gait.js` (Gang-Mischer, Überblenden), Clip-Längen aus `src/assets/actors/Rig_Medium_MovementBasic.glb`.

**Physik heute (gerechnet aus den Parametern, nicht gemessen):**
- Absprung `jumpVel` = 6,5 × JUMP_K = **4,39 m/s**. ecctrl setzt das Steigtempo, solange es noch „Boden“ meldet (Toleranz 0,18 m), dort ohne Schwerkraft → ≈ 0,16 m extra.
- Steigen mit Welt-Schwerkraft **9,81 m/s²**, Fallen mit `fallingGravityScale` 1,6 → **15,7 m/s²**.
- Scheitel ≈ **1,1 m** (0,62 KH), Steigzeit ≈ 0,50 s, Fall ≈ 0,35 s, **Flugzeit ≈ 0,85 s**.
- „Weitsprung“ (Shift+Leertaste aus dem Sprint) = nur 1,15 × Steigtempo (5,05 m/s) → Scheitel ≈ 1,45 m, Flug ≈ 0,95 s, **nicht weiter** als ein normaler Sprung (gleiches Bodentempo).
- Kein Tempo-Anteil am Absprung (Jog und Stand springen gleich hoch). **Keine Sprunghöhe per Tastendauer.** Fall-Höchsttempo 13 m/s.
- Luftsteuerung: ecctrl `airDragFactor` 0,1 → in der Luft nur 10 % des Bodenschubs (Zeitkonstante ≈ 0,8 s statt ≈ 0,17 s am Boden). A/D drehen die Figur auch in der Luft (115°/s).
- Nebenbei ein Puffer: ecctrl hält „Sprung aktiv“ 0,1 s; landet die Kapsel in dieser Zeit, springt sie. Die Clip-Wahl (jumpKind) bekommt das nicht mit (Kante nur am Boden). Keine Nachlaufzeit an Kanten außer der 0,18-m-Toleranz.

**Clips heute (Zeiten im Clip; Hüfthöhe aus der GLB gelesen):**

| Clip | Länge | Inhalt (Hüfte) |
|---|---|---|
| Jump_Start | 0,60 s | **Ausholen 0–0,27 s** (Hüfte 7 cm tiefer), Abdruck bis 0,37 s, gestreckt gehalten bis 0,60 |
| Jump_Idle | 1,07 s | Flugschleife, leichtes Wiegen |
| Jump_Land | 0,67 s | Stauchen bis 0,20 s (Hüfte 16 cm tiefer), gehalten bis 0,43 s, hoch bis 0,53 s |
| Jump_Full_Short (Sprung aus dem Joggen) | 1,17 s | Ausholen 0–0,27, Absprung 0,33, **Luft nur 0,37–0,57**, Landestauchen 0,60–0,93, Ende 1,03 |
| Jump_Full_Long (aus dem Sprint) | 2,33 s | Ausholen 0–0,27, Absprung 0,33, **lange Flugpose 0,40–1,67**, Landestauchen 1,73–2,13 |

**Was dadurch im Bild passiert:**
1. **Ausholen in der Luft.** Die Physik hebt im selben Schritt ab wie der Tastendruck (wie bei Mario), aber alle Sprung-Clips beginnen mit 0,27 s Ausholen. FB hockt sich also hin, während er schon steigt – fast bis zum Scheitel (Absprungpose erst 0,36 s nach dem Druck, Scheitel bei 0,50 s).
2. **Landung im Flug, oder gar nicht.** Die ganzen Clips werden auf eine geschätzte Flugzeit von 0,09 + 2·v/g + 0,28 s gestreckt, mit g = 9,81 (der verstärkte Fall fehlt in der Formel, ebenso stammen 0,09/0,28 aus dem Lab). Kurzer Sprung: geschätzt 1,27 s, echt ≈ 0,85 s → das Landestauchen läuft ab 0,65 s **noch in der Luft**, beim echten Aufsetzen wird der Clip ausgeblendet. Langer Sprung: geschätzt 1,40 s, echt ≈ 0,95 s → der Clip wird **vor** seinem Landeteil abgebrochen, das Landestauchen fehlt ganz.
3. **Lange Landung bremst die Beine.** Jump_Land läuft als Einmal-Clip über 0,67 s mit vollem Gewicht; solange ist der Gang-Mischer stumm, auch wenn FB schon wieder läuft. Mario: 0,13 s.
4. **Wechsel steigen → fallen nach Zeit** (Fortschritt > 95 % oder 0,6 s), nicht am Scheitel.
5. **Weiche Überblendungen** 0,08–0,2 s, wo Mario hart schaltet.
6. **Kamera folgt der vollen Sprunghöhe** (Ziel = Kapsel + 0,26 m, Glättung 0,12 s) – die Welt rutscht nach unten, der Sprung wirkt kleiner.

## 4 · Mario 64 → heute KFB → Vorschlag KFB

Vorschlagswerte für FB (1 KH = 1,81 m). Prinzip: **Marios Zeiten übernehmen, Höhen in Körperhöhen gedämpft** („etwas höher“, nicht Mario-hoch: 1,5 KH wären für FB 2,7 m aus dem Stand). Schwerkraft nur am Spielerkörper (ecctrl `gravityScale`/`fallingGravityScale`), die Welt-Schwerkraft 9,81 bleibt (Fahrzeuge, Objekte).

| Größe | Mario 64 | Heute KFB | Vorschlag KFB |
|---|---|---|---|
| Ausholen vor dem Abheben | 0 Bilder (Pose sofort gestreckt) | Physik 0, Clip 0,27 s Hocke **in der Luft** | Physik 0; Clip ab Ende der Hocke starten (Jump_Start ab 0,24 s, Full-Clips ab 0,30 s) |
| Absprung-Tempo (Stand) | 7,9 KH/s | 2,4 KH/s (4,39 m/s) | **7,6 m/s** (4,2 KH/s) |
| Tempo-Anteil | + ¼ Bodentempo (+19 % bei Höchsttempo) | keiner | + 19 % × (Tempo / Sprinttempo) |
| Schwerkraft steigen | 22,5 KH/s² | 9,81 m/s² (5,4 KH/s²) | **22,6 m/s²** (`gravityScale` 2,3) |
| Schwerkraft fallen | gleich wie steigen | 15,7 m/s² (× 1,6) | **28,4 m/s²** (`fallingGravityScale` 2,9 – Wert ist absolut zur Welt, nicht relativ) = × 1,26 vom Steigen: ein Hauch Cartoon-Fall, näher an Mario als heute |
| Scheitel Stand | 1,5 KH | 0,62 KH (≈ 1,1 m) | **≈ 0,8 KH (1,45 m)** |
| Scheitel aus dem Sprint | 2,1 KH | 0,8 KH (≈ 1,45 m, „long“) | **≈ 1,1 KH (2,0 m)** |
| Steigzeit / Flugzeit Stand | 0,37 / 0,73 s | 0,50 / 0,85 s | **0,36 / 0,66 s** |
| Sprunghöhe per Tastendauer | Loslassen bei Steigtempo > 48 % → Tempo ÷ 4 | keine | gleich: Loslassen bei > 50 % des Absprungs → Steigtempo × 0,25 (frühestens nach 0,05 s); kleinster Hüpfer ≈ 0,5 m |
| Doppelsprung | × 1,24 Tempo, ≈ 1,45 × Höhe | keiner | Fenster 0,15 s nach Aufsetzen; Tempo × 1,22 → ≈ 2,1 m (Stand) / 2,8 m (Sprint) |
| Dreifachsprung | 69 fest, 3,9 KH, 1,2 s, nur mit Tempo > 62 % | keiner | aus Doppel-Landung, Tempo ≥ Jog; Tempo 11,4 m/s fest → ≈ 3,1 m (1,7 KH), Flug ≈ 0,95 s; kein Höhenschnitt |
| Weitsprung | Steigen 0,71 × Einfach, halbe Schwerkraft, vorwärts × 1,5 → 1,5 KH hoch, 9 KH weit, 1,0 s | 1,15 × höher, nicht weiter | Steigen 5,4 m/s, Schwerkraft halb (11,3 m/s² hoch und runter), vorwärts 1,5 × Sprinttempo (≈ 4,8 m/s) gehalten → ≈ 1,45 m hoch, ≈ 1,0 s, ≈ 4,8 m weit (2,6 KH) |
| Fall-Höchsttempo | 14 KH/s | 13 m/s (7,2 KH/s) | 20 m/s (11 KH/s) |
| Luftsteuerung | vor/zurück ± 1,5 E/Bild² (≈ Boden), seitlich sofort 31 %, keine Drehung | 10 % des Bodenschubs, A/D dreht weiter | Luftschub auf ≈ 40 % (`airDragFactor` 0,4); Drehen in der Luft auf ein Drittel (≈ 40°/s) |
| Landung (Zustand) | 4 Bilder = 0,13 s, Schwung × 0,98/Bild, sofort unterbrechbar | Jump_Land 0,67 s volles Gewicht (Gang stumm) | Stauchen 0,13–0,15 s, dann mit Eingabe sofort zurück in den Gang; ohne Eingabe Rest der Landung, jede Eingabe bricht ab |
| Landung bei kleinen Höhen | immer Lande-Animation | erst ab 0,35 m Fall | ab 0,2 m nur das kurze Stauchen (0,1 s) |
| Wechsel steigen → fallen | am Scheitel (Steigtempo-Vorzeichen) | nach Clip-Fortschritt / 0,6 s | am Scheitel (Steigtempo ≤ 0) |
| Überblenden | keins (harte Schnitte) | 0,08–0,2 s | Absprung 0,04 s, Scheitel 0,1 s, Aufsetzen 0,04 s, zurück in den Gang 0,1 s |
| Sprung-Puffer vor der Landung | keiner | 0,1 s nur in der Physik | 0,1 s, auch für Clip-Wahl und Kette (Tastatur hat keinen Analog-Stick; moderne Hilfe, nicht Mario) |
| Kante herunterlaufen | sofort Fall; Bodenfang für Stufen ≤ 0,63 KH | Toleranz 0,18 m | 0,08 s Nachlauf zum Springen (Cartoon-Kojote; nicht Mario) |
| Kamera-Höhe im Sprung | bleibt auf Bodenhöhe bis 1,25 KH; Blickpunkt + 10 % | folgt voll (0,12 s Glättung) | Ziel-Höhe = Boden + 10 % der Sprunghöhe bis 1,25 KH (2,3 m), darüber nachziehen; bei Landung auf neuer Höhe ≈ 0,3 s anpassen |
| Bodentempo / Anlauf / Bremsen | 6 KH/s; 25 % sofort, voll nach 1,35 s; Bremsen 0,27 s | Sprint 1,76 KH/s; 90 % nach ≈ 0,4 s; Auslaufen ≈ 0,3 s | **bleibt** (Tempi von Georg abgenommen, V-020; Anlauf/Bremsen schon nah an Mario) |
| Drehen am Boden | 337°/s | WoW: A/D 115°/s | bleibt (Steuerschema V-342/V-783) |

## 5 · Die 8 Änderungen, die FB am meisten nach Mario 64 fühlen lassen

Alle nur Physik, Timing, Übergänge, mit den vorhandenen Clips. Reihenfolge nach Wirkung.

1. **Kein Ausholen in der Luft.** Physik bleibt sofort (0 Bilder, wie Mario). Die Clips starten am Ende ihrer Hocke: Jump_Start ab 0,24 s, Jump_Full_Short/Long ab 0,30 s. Die ersten ≈ 0,1 s zeigen dann den Abdruck, während FB schon steigt – das liest sich wie Marios Streckbild im ersten Bild. Überblendung 0,04 s statt 0,08.
2. **Clip-Zeit an die echte Flugzeit koppeln.** Flugzeit aus Absprung-Tempo und beiden Schwerkräften vorhersagen (Steigzeit v/g_steigen + Fallzeit aus Scheitelhöhe und g_fallen). Den **Luftteil** der Full-Clips (kurz 0,33–0,57 s, lang 0,33–1,67 s) auf diese Zeit strecken; beim echten Aufsetzen auf den **Landeteil** springen (kurz ab 0,60 s, lang ab 1,73 s), statt den Clip abzubrechen. Beim Standsprung am Scheitel von der gestreckten Jump_Start-Pose zu Jump_Idle wechseln (Steigtempo ≤ 0), nicht nach Zeit.
3. **Höher und knackiger springen.** Spielerkörper: Steig-Schwerkraft 22,6 m/s², Fall 28,4 m/s², Absprung 7,6 m/s, + 19 % × Tempo/Sprinttempo. Ergebnis: Stand 1,45 m in 0,66 s, Sprint 2,0 m (heute 1,1 m in 0,85 s). Die Zeiten liegen bei Mario; die Höhe ist „etwas höher“, nicht Mario-hoch. Alle Stellen, die heute die Schwerkraft auf 1 zurücksetzen (Freigabe, Flug-Landung in `post()`), müssen den neuen Wert nehmen.
4. **Kurz drücken = kleiner Hüpfer.** Leertaste losgelassen, solange das Steigtempo über der Hälfte des Absprungs liegt → Steigtempo × 0,25 (einmal). Kleinster Hüpfer ≈ 0,5 m, voller Sprung 1,45 m. Das ist Marios wichtigstes Steuerungsgefühl und kostet keinen Clip.
5. **Landung: kurz stauchen, sofort weiter.** Aufsetzen → Jump_Land von 0 mit 1,5-facher Rate (tiefster Punkt nach ≈ 0,13 s). Mit Laufeingabe nach 0,15 s zurück in den Gang (Überblendung 0,1 s), Bodentempo bleibt (höchstens − 8 %). Ohne Eingabe läuft die Landung aus, jede Eingabe (Laufen, Springen) bricht ab. Springen während der Landung ist immer erlaubt.
6. **Doppel- und Dreifachsprung als Kette.** Leertaste binnen 0,15 s nach dem Aufsetzen (oder gepuffert 0,1 s davor): zweite Stufe, Tempo × 1,22, Clip Jump_Full_Short ab 0,30 s (andere Pose als der Einfachsprung → die Stufe ist sichtbar). Aus der Doppel-Landung mit mindestens Jog-Tempo: dritte Stufe, 11,4 m/s fest, vorwärts × 0,8, Clip Jump_Full_Long ab 0,30 s (lange Flugpose), kein Höhenschnitt, Landung 0,13 s ohne Sprung (wie Mario).
   **Konflikt prüfen:** Doppel-Leertaste < 400 ms startet heute den Flug. Ein kurzer Hüpfer (≈ 0,35 s Flug) plus Kettendruck fällt in dieses Fenster. Vorschlag: Der zweite Druck zählt nur dann als Flug-Start, wenn FB beim zweiten Druck in der Luft ist und nicht im Lande-Fenster. WS0 entscheidet.
7. **Echter Weitsprung aus dem Sprint.** Statt „1,15 × höher“: flacher, langer Bogen wie Mario (Steigen 5,4 m/s, halbe Schwerkraft, vorwärts 1,5 × Sprinttempo gehalten) → ≈ 1,45 m hoch, ≈ 4,8 m weit, ≈ 1,0 s. Clip Jump_Full_Long ab 0,30 s; seine lange Flugpose (0,40–1,67 s) passt genau dazu. Landung 0,2 s (Mario: 6 Bilder).
8. **Kamera bleibt unten.** Im Sprung bis 2,3 m (1,25 KH) über dem Boden zielt die Kamera auf Bodenhöhe + 10 % der Sprunghöhe; darüber zieht sie nach. Bei Landung auf anderer Höhe gleitet sie in ≈ 0,3 s nach. FB steigt im Bild, die Welt steht – so wirkt jeder Sprung höher, ohne die Physik weiter zu treiben.

**Bewusst nicht in dieser Liste** (brauchen Taste oder Clip, die es nicht gibt): Rückwärtssalto, Seitsalto aus der Rutschwende, Wandsprung, Stampfer. Rutschwende/Bremsen: ecctrl bremst schon in ≈ 0,3 s (Mario 0,27 s), ein eigener Rutsch-Clip fehlt.

## 6 · Für WS0 offen
- **FB-Größe klären:** Code sagt 1,81 m mit Ohren (Kapsel 1,30 m). Der Auftrag nennt 0,75 m. Die Vorschläge oben sind in Metern für 1,81 m gerechnet; in KH gelten sie für jede Größe.
- **Vorher messen:** Die heutigen Werte in §3 sind aus den Parametern gerechnet (Scheitel 1,1 m, Flug 0,85 s). Ein kurzer Mess-Lauf (Kapselhöhe je Schritt beim Stand- und Sprintsprung) bestätigt sie, bevor getunt wird.
- **Abnahme für Georg:** keine Zahlen, sondern ein Bildpaar bzw. kurzes Video „heute / Mario-Timing“ (Standsprung, Hüpfer, Kette, Weitsprung, Landung im Lauf) aus derselben Kamera.
