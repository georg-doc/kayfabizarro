# MVP-1 · Vorlagen- und Modell-Karte R1 („Use what works“ als Pflicht)

Stand: 2026-10-10 · Steuer-Sitzung · Anlass: Georg: „USE WHAT WORKS!!! … welche anderen mentalen Modelle fehlen euch für MVP 1 ohne Slop und Schlamperei?“ Inventur der vorhandenen Vorlagen per Suche über Dropbox und GitHub (read-only).

## 0 · Pflicht-Schritt „Vorlage zuerst“ (gilt ab sofort für jede Sitzung)

Vor jedem neuen Bauteil schickt die bauende Sitzung der Steuerung eine Zeile je Element: **was es schon gibt** (Pfad, three-Version, läuft ja/nein), **was übernommen wird**, **was neu gebaut werden muss und warum**. Die Steuerung gibt frei. **Nachbau ohne Freigabe = nicht bestanden**, auch wenn Q und Kritiker grün wären. Abgenommen wird nur im Lab mit Spielkameras (eine Laufzeit), nie in einem Nebenwerkzeug allein.

## 1 · Karte je MVP-1-Element

| Element | Vorhandene Vorlage (Pfad) | Stand | Zielbild nötig | Messbare Regel | Besitzer |
| --- | --- | --- | --- | --- | --- |
| Insel-Gelände | Lab `src/island/r2d/*` (R2D-Port) | läuft, Gestaltung bei Claude Design | ja (F: A, B1–B2) | Q1–Q9, Fugen-Test, G1–G7 | Lab |
| Fahren | `KFB Joyride J17 · FB Cabrio/JOYRIDE_J17_2026-10-01/code/` (`lab-drive/joyride-drive.j10.js`, `travel-core.j17.js`, `travel-modes.j17.js`) | läuft, three 0.160 | nein (Joyride ist der Look) | Fahrgefühl-Zahlen (§2) | Lab übernimmt, nicht neu schreiben |
| Kamera | Seed-World-Regel in `…/KFB Seed World Mech Destruction POC 01/…/seedworld/sw-app.js` (0.170); Joyride `follow-camera.mjs` | Code eingebettet, **kein eigenes Modul** | nein | Arm schrumpft nie unter 70 %, hebt nie ab; Abstände (§2) | Lab: ein Modul daraus herauslösen |
| Laufen (Rig_Medium) | GitHub `kfb-hub/stage/game-dev-studio/kcl-m1-locomotion-sync/index.html`; Dropbox `…/kfb-lib/locomotion-profiles.v1.js` | Teil-Laufzeit | ja (Figur am Boden) | Füße ohne Gleiten, Schritt-Takt | Lab übernimmt |
| Sitzen / Cabrio | `cabrio-seat.j17.js` (Joyride) | läuft, **bekannter Dreh-Fehler** | nein | Hüfte auf Sitz ≤ 0,02 H | Lab über Figuren-Karte |
| Burg | `~/KFB-AssetCache/unity/…/BigCstle/CS_Big_Castle_Stage01–03.fbx` | vorhanden | ja (Gebäude am Boden) | × 2,2, Tür ≥ 1,15 H, Q1/Q3 | Lab-Katalog |
| Treppe zur Burg | **keine** in Familie A; nur fremde Stair-FBX | **fehlt** | ja | Stufenmaß in H, Q9 | RKIT (Familie A) |
| Markt, Stände | Lab-Katalog K2, KayKit | Teile da, **Komposition fehlt** | ja | Dichte bzw. Abstände | Lab |
| Clown | `blender-mcp/motion-forge-poc-01…/clown_juggle_j5/runtime/` | läuft (0.160), Beweis vorhanden | nein | J5-Vertrag | Lab übernimmt unverändert |
| Augen | Lab `src/residents/pet-eye-rig.v6.js` + `eye-rig-medium.batch-1.json` | im Lab | nein | Validator Figuren-Karte | Lab |
| Natur | Lab `src/environment/` (kits, place, grounding, biomes) | im Lab | ja (Erdung) | E1–E7 | Environment |
| Wasser | `donors/…/KFB_Island_Kit_R1/kit/fluid.js` | **nur Spender-Kopie, nicht verdrahtet** | ja (Teichufer) | kein oranger Ring, §01 | Lab |
| Straße, Bord, Bande | RKIT Pipeline + Track Core 0.16.1 | läuft, im Lab verdrahtet | ja (F: B3–B4) | Q1–Q9, Regel B | RKIT |
| Brücke | RKIT Widerlager + Bogenkette | gerechnet, Teil-Test | ja (F: B5–B6) | Q1–Q9 | RKIT |
| Tunnel | Dungeon Room Study S21 (`lib/dungeon-grid.js`, 0.184); Joyride J15 Tunnel-Looks | Räume ja, **kein befahrbarer Tunnel** | ja (Portal) | Tür ≥ 1,15 H, Lichtraum Auto | RKIT bzw. Lab |
| Character Select | GitHub `…/KFB_Clay_Stage_R2/curtain/clay-look.js` (0.180); Kern `kfb-curtain-core.js` **nicht gefunden** | Teil | nein (R2 abgenommen) | eigene Fläche, Fallback | Lab |
| HUD | Dropbox `KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/hud-flight/` (0.186); Knet-Material `clay-hud.v6.js`; **`clay-hud.v1.js` (K7) nirgends gefunden** | läuft | nein | ein HUD | Lab |
| Billboards | GitHub `…/KFB_Clay_Stage_R2/billboards/kit.js` (0.180) | läuft | nein | Rollenfarben | Lab |
| Sprechen | ChatterBox (`chatter-phrases.js`, `chatterbox-core.js`), Voice Layer (`real-pool-adapter.js`) | läuft | nein | Triplets, ein AudioContext | ChatterBox / Audio |
| Auftrag (Kurier-Karte) | Golden Journey MD/JSON | **nur Spec, kein Code** | nein | 3 Zustände (§3) | Lab |

**three.js-Versionen der Vorlagen:** 0.160 (Joyride, Clown), 0.170 (Seed World), 0.180 (Clay Stage, Billboards), 0.184 (Dungeon), 0.186 (Lab, HUD). Jede Übernahme bekommt einen r186-Check (wie im Bauplan Stufe 1 §4).

## 2 · Fehlende Modelle, die Georg entscheiden muss

1. **Spielgefühl in Zahlen:** Laufgeschwindigkeit (H/s), Autotempo, maximal begehbare Steigung, Kameraabstand und -höhe beim Laufen und beim Fahren, Ziel-Dauer einer Ringrunde und der Brückenfahrt. Vorschlag: aus Joyride J17 und der Seed-World-Kamera übernehmen und messen, dann Georg im Lab fahren lassen.
2. **Inselrand:** Was passiert, wenn Figur oder Auto über die Kante will? Optionen: (a) weiche Knet-Kante federt zurück, (b) Bande bzw. Geländer überall, wo man hinkommt, (c) Fallen und Wiederauftauchen am letzten sicheren Punkt (Cartoon-Logik, z. B. mit Fluff-Wolke).

## 3 · Fehlende Modelle, die wir selbst festlegen

- **Kollision:** einfache Hüllen für Burg, Mauern, Bande, Bäume, Brüstung; Figur und Auto gleiten ab statt hängenzubleiben.
- **Leistungsbudget volle Szene:** Ziel ≥ 30 fps auf dem MacBook (M1 Max) mit Burg, Bewohnern, Natur und Wasser; gemessen ab Stufe 2 bei jeder Lieferung.
- **Auftrags-Zustand minimal:** `offen → angenommen (Karte in Obhut) → abgeliefert`, im Spielzustand (nie im Insel-Rezept), übersteht Neuladen.
- **Zielbilder Runde 2 bei Claude Design** (Nachtrag zu Briefing F): Treppe, Gebäude am Boden, Marktplatz, Weg am Hang, Teichufer, Tunnelportal, Figur am Boden.
