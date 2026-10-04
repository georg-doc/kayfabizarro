# Testbericht · 2026-09-18

Gemessen im Claude-Design-Preview (Chromium-Webview, Fenster ~920 × 540, WebGL2).
Nicht gelaufen heißt **NOT_TESTED** und steht auch so da. Alle Zahlen stammen aus der
Laufzeit (`window.KFB_POC`), nicht aus der Absicht.

## Boot

| Prüfung | Ergebnis |
|---|---|
| Kaltstart | PASS — Insel steht nach ~6–9 s |
| WebGL sichtbar | PASS |
| Unbehandelte Fehler in der Konsole | PASS — keine (ein früher Import-Fehler wurde behoben) |
| Quellen geladen | **35 / 35 ok, 0 Fehler** (Pack 31, Resident 1, Clip-Sets 3) |
| Textur-Faltung | 0 → 0 — der Pack liefert **eingebettete** Texturen, es gibt nichts zu falten |
| FPS | 53 im Preview-Fenster |

## Gemessene Weltmaße

| Größe | Wert |
|---|---|
| Zellkante (`Cube_Grass_Center`) | **2,000** |
| Plattformen | 17, davon 9 mit Portal, 8 Checkpoints |
| Pickups | 18 |
| Pack-Figur Rest-Höhe | 2,057 → Spielerhöhe 2,100 (1,05 Zellen) |

## Default Platformer Actor

| Zustand | Clip | Ergebnis |
|---|---|---|
| Idle / Walk / Run / Duck | Idle · Walk · Run · Duck | PASS, je 100 % Bindung |
| Jump / Airborne / Land | Jump · Jump_Idle · Jump_Land | PASS |
| Hit / Emote | HitReact · Wave | PASS |
| Manuelles Clip-Dropdown | 18 Clips wählbar | PASS |

## Platforming · Chill (assistiert)

Automatisierter Durchlauf, 12 aufeinanderfolgende assistierte Sprünge mit Drehung zwischen
den Sprüngen:

**12 / 12 auf dem angekündigten Ziel gelandet · 0 Fälle · 0 Rettungen.**

Abgedeckte Fälle darin: tief→hoch (`hub → step_s`, +1,2), hoch→tief (`stone_se → hub`, −2,8),
kurze Lücke (6,0), lange Lücke (11,9).

Zwei Befunde aus dem Weg dorthin, beide behoben und im Code kommentiert:
* Luftdämpfung während des Assists ließ die Figur 2 Einheiten vor dem Ziel fallen.
* Seitliche Kollision vor der Bodenprüfung schob landende Figuren aus der Plattform
  (3 von 9 Sprüngen endeten im Fall).

## Platforming · KFB Game (manuell)

Automatisierter Durchlauf mit Anlauf bis an die Kante, Absprung an der Kante:

| Sprung | Ergebnis |
|---|---|
| hub → step_s | PASS |
| hub → step_e | PASS |
| hub → step_w | PASS |
| stone_ne → travel | FAIL — zu kurz |
| step_e → stone_ne | FAIL — 2×2-Plattform, kein Anlauf möglich |
| step_w → atlas | FAIL — dito |
| freeroam → toolbox | FAIL — 6,0 Lücke bei +2,6 Höhe, über dem manuellen Vermögen |

**3 / 7.** Das ist kein Physikfehler, sondern Leveldesign: von einer 2×2-Plattform (4
Einheiten) aus dem Stand ist der Anlauf zu kurz, und `freeroam → toolbox` verlangt mehr
Steighöhe, als ein manueller Sprung hergibt (Apex 3,0). Ein Mensch kettet Sprünge mit
Restgeschwindigkeit — der Test tut das nicht. Als offener Punkt notiert.

## Bouncer

PASS — 2 Auslösungen, erreichte Höhe **12,9** bei Arena-Oberkante 13,0. Die Combat Arena ist
damit über den Bouncer erreichbar und über keinen Assist.

## Fall und Rettung

PASS — Fall unter `killY` (−28) setzt zurück: Chill auf die letzte sichere Plattform, Game
auf den letzten Checkpoint. Gezählt in `player.stats` (Rettungen/Fälle), im Kopfband sichtbar.

## Aktoren

| Aktor | Ergebnis |
|---|---|
| Platformer Character | PASS — 18 Clips, 9/9 Zustände |
| Skeleton Warrior (Resident) | PASS — 23 Bones, 39 Clips, 100 % Bindung, Faktor 0,777 |
| FrizzleBob · Graft | PASS — `mountGraft()`, `animation:'host'`, 39 Clips, 100 % |
| CapsuleCarl | PASS — `mountCarl()`, 0 Bones, prozedural, Faktor 1,006 |
| Wiederholter Wechsel | PASS — vier Wechsel ohne doppelten Mixer; ein `requestAnimationFrame`-Besitzer |
| Rig_Large (Black Knight, Demon Lord) | NOT_TESTED |
| Rig_Legacy (Knight · Dungeon 1.0) | NOT_TESTED |
| Weitere Residents (Goth Girl, Clown, Witch, …) | NOT_TESTED — Pfade aus `cast.js` übernommen |

## Modi

PASS — Chill → Game → Chill ohne Neuladen, gleicher Plattform-Graph, Assist-Ziel wird beim
Wechsel gelöscht (kein veraltetes Ziel). Gefahren nur im Game Mode scharf.

## Kamera

| Prüfung | Ergebnis |
|---|---|
| Orbit im Stand | PASS |
| Orbit während der Bewegung | PASS — Orbit bleibt erhalten |
| Zoom | PASS (3–26 Zellen) |
| Recenter (F) | PASS — 0,35 s, der einzige Selbstlauf |
| Kein 180°-Kippen bei Landung/Richtungswechsel | PASS — die Kamera dreht nie von selbst |
| Schmales Fenster | TEILWEISE — CSS bricht bei < 760 px um; auf einem echten Telefon NOT_TESTED |

## Lebenszyklus

| Prüfung | Ergebnis |
|---|---|
| Blur / Focus | PASS — Tastenzustand wird geleert, kein Weiterlaufen |
| Reload stellt Aktor/Modus/Pickups wieder her | PASS |
| Entsorgung des ersetzten Aktors | PASS (sichtgeprüft; kein Speicherprofil gemessen) |
| Tab im Hintergrund | NOT_TESTED |
| Pause-Funktion | nicht gebaut |

## Nicht getestet

Mobile/Touch-Bedienung · Gamepad · lange Spielzeit / Speicherprofil · Firefox / Safari ·
Kollision der Kamera mit Geometrie · alle Residents außer dem Skeleton Warrior ·
Legacy-Zusammenbau · Rig_Large.
