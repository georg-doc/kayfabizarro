# WS1 → WS0 · Combat-AV R1 · Kurzstatus · 21.10.2026

**Bezug:** V-601, `BRIEF_WS1_COMBAT_AV_REVIEW_R1.md`.
**Prüfstand:** Arena `wsa/toysoldier-r3c-playable-2026-10-20` @ `f712f0d` (PR #24/#27), alle 13 Waffen und 4 Varianten. Geprüft in action mit Ton: 21 Clips vorher, 10 nachher.
**Ablage:** Der Bericht samt Clips liegt nur lokal (`research/audits/COMBAT_AV_R1.md`). Er enthält private Figuren und Klänge und ist deshalb nicht hier im Repo.

## Ergebnis Kritik (Kurzfassung)
1. **Ton:** Alle Waffen spielen denselben Cue `launch.dice` (1,4 s Würfelschütteln). Der Klang setzt 30–55 ms nach der Abzug-Marke ein. Der Gegnerwurf ist fast so laut wie der eigene Schuss. Die Gatling erzeugt eine Klangwand bis −0,1 dBFS.
2. **V-461 nicht erfüllt:** Von 22 Bank-Cues hat keiner einen Ausklang und nur einer einen Körper.
3. **Kaskade fehlerhaft:**
   - `confirm.hit` feuert auch bei eigenem Schaden, beim Tod und bei der Rauchbombe.
   - Die Rauchbombe ruft den nicht vorhandenen Cue `impact.kinetic.air`.
   - Bei der Klinge kommt der Treffer-Klang vor dem Schwung.
   - Stumm sind Magie `raise`, weaponDrop, Schädel und Beute.
4. **Bild:**
   - Die Kamera startet bei 8,9 von 9 u, die Figur ist klein vor lauten Karten, die Steuerleiste belegt 24 % des Bildes.
   - Treffer sind ein flacher grüner Zackenstern.
   - Der getroffene Spieler wird über 300 ms zur rosa Silhouette.
   - Mündungsblitz und Cast sind erst etwa 100–200 ms nach der Marke zu sehen.
   - Gegner werfen ohne Ankündigung.
5. **Werkzeug:**
   - `serve_soldier.py` verliert beim ersten Laden Modul-Anfragen (Warteschlange 5, `ERR_CONNECTION_RESET`). Lösung: eine Zeile, `request_queue_size=256`.
   - `?actor=soldier` im Brief muss `soldier-r3d` heißen, sonst wirft `qa.js:22`.

## Prototyp (lokal, nicht gepusht, kein Merge)
- Zweig `ws1/combat-av-r1` im Arena-Klon: `9eaa19b` + `d408688`, zwei Dateien.
- Inhalt:
  - eigener Abgangs-Cue je Waffe mit Ebenen (V-461) aus den vorhandenen privaten Sätzen
  - Klinge mit Schwung vor dem Treffer
  - Gegner-Bus 0,4
- Messung nachher:
  - Einsatz meist 10–15 ms
  - Gegnerwurf im Mix 4–8 dB tiefer
  - Gesamtspitze −6 statt −0,4 dBFS
  - Klingen-Reihenfolge korrekt
- Einbau ins Spiel nur über den WS-Audio-Pfad `kfbAudio.k10` (V-598). Einbau in die Arena über WSA; `gunfight.v2.js` ist hash-gesperrt, also mit Nachtrag im Recovery-Manifest.

## Top-10 (Georg wählt aus)
1. Klang je Waffe, geschichtet (S)
2. Mischung und Kaskade (S)
3. Gegner kündigt an (M)
4. Treffer als Knet-Masse, als Umschalter zum Stern (M)
5. Spieler-Treffer ohne Geist (S–M)
6. Kamera und Bühne (M)
7. Abgang auf dem Bild der Marke (S–M)
8. Kill am Ort: Knet-Puff plus „PLOPP!“ als Weltwort (S)
9. Tusche-Pfütze leiser (S)
10. stumme Ereignisse vertonen (S)

## Bitte an WS0: Lücken erzeugen
Alle Prompts enden mit „…, cartoon clay world, warm and handmade, isolated, no music bed, no speech, no words, no vocals, no retro arcade or chiptune tones“.

| # | Name | Dauer | Prompt |
|---|---|---|---|
| L1 | bow_release | 0,6 s | toy bow string released, springy rubbery twang with a soft wooden creak and a short arrow whoosh |
| L2 | crossbow_release | 0,8 s | chunky toy crossbow trigger, plastic latch clack then a tight heavy string thwack and short bolt whoosh |
| L3 | arrow_hit_body | 0,5 s | toy suction-tip arrow sticking into a soft clay body, quick thock with a wobbly boing quiver, no gore |
| L4 | magic_cast | 0,8 s | small wooden wand flick casting a spell, soft airy shimmer swell then a gentle round whump release, no bell melody |
| L5 | magic_hit_clay | 0,6 s | small magic spark bolt hitting a soft clay body, fizzy crackle pop with a little dust puff |
| L6 | dice_flick | 0,3 s | single toy dice flicked from the hand, short plastic rattle click and tiny whoosh |
| L7 | mob_bite | 0,5 s | small cube-shaped clay monster chomps, rubbery snap of jaws with a squishy bite, non-verbal |
| L8 | player_hurt | 0,6 s | cartoon clay hero gets bonked, soft squash thud with a short rubbery wobble, non-verbal |
| L9 | mob_pop_to_skull | 0,8 s | clay monster pops into a puff of smoke, soft fluffy poof then a hollow little toy skull clack |
| L10 | weapon_drop | 0,6 s | toy plastic weapon dropped on soft clay ground, light hollow clatter and one small bounce |
| L11 | gatling_spin_up / _down | je 1,0 s + Loop 2,0 s | toy minigun barrel spinning up, ratcheting plastic whirr rising, loopable |
| L12 | smoke_pop_short | 0,4 s | cartoon smoke bomb bursting, quick soft pff pop with a short airy hiss |
| L13 | mob_windup | 0,5 s | clay monster winding up a throw, short rubbery stretch creak and a quick whoosh, non-verbal |

**Neu erzeugen, weil zu leise oder still:**
- M03_b, M04_a, M07
- X07 a/b
- D01_b
- T09_b
- C01 c/c_r, C02 c/c_r, C03 b/b_r/c, C10_c
- ganze Familie C11

**Hinweise zur Erzeugung:**
- Der Prompt-Zusatz „LOUD“ wirkt nicht (5 von 8 Nachdrehs sind leiser).
- Bitte auf Lautheit normieren (etwa −16 LUFS je Einzelklang), nicht auf die Spitze.
- Die `_norm/`-Ordner im privaten Branch enthalten nur Reports, keine Dateien.

## Georgs Urteil (21.10., nach Hörprobe Vorher/Nachher)
**PASS mit TUNE später** für „Klang je Waffe“ (Top-10 Nr. 1).
- TUNE 1: Einige Schüsse klingen noch nach hohem „Piu-Piu“. Vorschlag: Anschlag tiefer stimmen (Rate ×0,8–0,85), mehr Körper-Ebene, Laser-artige Ebenen leiser.
- TUNE 2: Das Würfelrollen als KFB-Kennung anpassen. Vorschlag: kurzer Würfel-Klick als Körper-Ebene (Lücke L6 `dice_flick`) statt 1,4 s Schütteln.

## Korrektur (21.10. abends)
- Das vermeintliche „Konfetti“ beim Kill sind die farbcodierten Würfel (Geschosse und Beute), kein Verstoß gegen V-499. Den Punkt habe ich gestrichen.
- Ein Stauchen beim Treffer gibt es bereits (`kfb-hit-response` über `_deformer`, `gunfight.v2.js:611`). Die Top-10 Nr. 4 betrifft nur noch die Form des Treffer-Effekts.
- Der grüne Stern (`burst`) war am 06.09. Georgs Wunsch. Die Knet-Masse kommt deshalb als Umschalter, nicht als Ersatz.
- Nächster Schritt laut Georg: Prototyp Treffer plus Kill (Top-10 Nr. 4 und 8), lokal auf `ws1/combat-av-r1`.

## Fortschritt Prototypen (lokal, `ws1/combat-av-r1`, kein Push)
| Top-10 | Commit | Schalter | Georg | Messung |
|---|---|---|---|---|
| 1 Klang je Waffe | `9eaa19b`, `d408688` | immer | PASS, TUNE später | Einsatz 10–15 ms statt 30–55 ms |
| 4 + 8 Treffer als Knet-Masse, Kill am Ort | `faed87c` | `?hit=knet` | PASS | – |
| 3 Gegner kündigt an | `730c6f6` | `?tele=1` | offen | angekündigte Würfe 0/11 → 9/9 (Regel R6) |

**Zu Nr. 3 (präzisiert):** Das Ausholen (0,42 s) gab es schon, sichtbar war es nur als rotes Abzeichen. Neu sind Stauchen und Strecken, ein Ring, der sich zusammenzieht, und ein Ausholklang. Der Platzhalter ist mit 0,8 s zu lang, deshalb wird **L13 `mob_windup` (0,5 s) dringend**.

## Backlog TUNE später (Georg 21.10.: alle Tune-Punkte übernehmen)
- **Klang:** K1 „Piu-Piu“ tiefer stimmen · K2 Würfel-Klick statt Schütteln (L6) · K3 Platzhalter Armbrust/Bogen/Magie (L1/L2/L4) · K4 Gatling-Schleife (L11) · K5 Bus-Messung für Regel R3
- **Treffer/Kill:** T1 Wort und Effekte bei weiter Kamera zu klein (Kamera näher oder Wort ×1,5) · T2 Masse von oben einfarbig (Licht-Schwelle) · T3 Kill-Puff als Klumpen (3 Kuppeln, mehr Abstand)
- **Ankündigung:** A1 Ausholklang-Platzhalter 0,8 s und ratternd, **L13 0,5 s dringend** · A2 Stauchen bei weiter Kamera kaum sichtbar · A3 Ringe überlagern sich, auf die zwei nächsten Gegner begrenzen
- **Werkzeug:** W1 Hut verdeckt in der Nahkamera · W2 Neuladen nach dem Tod bricht Prüf-Clips ab · W3 Server-Warteschlange · W4 `soldier` → `soldier-r3d` · W5 Hash-Sperre `gunfight.v2.js`
