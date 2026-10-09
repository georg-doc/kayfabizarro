# Claude Design · KFB HUD + Flug-VFX R1

Du entwirfst **Look und Bauteile** für das HUD und die Flug-Effekte des KFB-MVP „Drive Loop“. Gebaut wird später im KFB Island Worldbuilder Lab (three.js r186). Plan: `docs/MVP_DRIVE_LOOP_R1_PLAN.md` (§3, §3b, §4).

## Warum

Der MVP hat drei Reisemodi: Gehen, Fahren und Fliegen. Fliegen schaltet Doppel-Leertaste ein, wenn man ein Jetpack vom Combat Mech geschenkt bekommen hat.

Das Racer-HUD ist ein brauchbarer Donor, aber nicht im KFB-Claymation-Standard. Georg will **Game-Feeling, dezent**, im Knet-Look, ohne Spielmechanik-Überladung.

## Vorlagen (anhängen bzw. öffnen)

- **Racer-HUD:** Tacho, Radio mit diegetischen Knöpfen, eigene Songs einspielen. Repo `georg-doc/kayfabizarro`, Branches `hud-racer-v2-stage`, `hud-game-v3-stage`, `hud-2d-stage-v1`, `hud-rig-stage-v1/v2` (Workflows unter `.github/workflows/hud-*`).
- **Speedlines und Wind-VFX:** aus Travel Globe und Tiny Skies (Branches `travel-tmb1-*`, `img2threejs/tinyskies-*`, `stage/tinyskies-*`).
- **Combat Mech, Flug-Locomotion, Jetpack:** Seed World Mech Destruction POC (`main` · `tools/KFB-ToolBox/_inbox/KFB Seed World Mech Destruction POC 01`).
- **Knet-Look:**
  - Clay K2 bzw. Clay v10;
  - KFB-Mauerwerk-Familie A (rund, Knetstein);
  - Knetfleck-Übergang `kfbBlend`;
  - Farb-Grammatik `ENV_ROLES` (`src/palettes.ts` im Lab).
- **Weltlogik** (§00 der QA-Regelwerke): Jedes HUD-Element ist ein Gegenstand der Welt. Radio, Tacho und Höhenmesser wirken wie Knet-Objekte aus dem Fahrzeug bzw. vom Jetpack, nicht wie Flat-UI.

## A · HUD je Reisemodus

| Modus | Inhalt | Lesart |
| --- | --- | --- |
| Gehen | Fluff-Score, Kompass bzw. Inselname dezent; kein Tacho | ruhig, fast leer |
| Fahren | Tacho (Knet-Rundinstrument), Radio mit diegetischen Knöpfen (Sender, eigener Song), Fluff-Score | Armaturenbrett-Teile aus Knete |
| Fliegen | Fluggeschwindigkeit, Höhe, Schub- bzw. Energie-Anzeige, Fluff-Score; Radio bleibt | Cockpit- bzw. Pilotenanmutung, aber Knete, nicht Militär |

- **Moduswechsel als kurze Knet-Animation:** Teile rollen ein bzw. aus, statt hart zu wechseln.
- **Fluff-Score:** Fluff ist Währung und Punktestand (Fluff-Kügelchen aufsammeln). Die Zahl zählt sichtbar weich hoch, eine kleine Fluff-Kugel springt ins Zählwerk.
- **Platzierung:** Ecken bzw. unterer Rand, nie über der Figur. Mobil und Desktop lesbar.

## B · Flug-VFX

- **Speedlines und Wind:** abhängig von der Geschwindigkeit, im Knet- bzw. Cartoon-Stil (Vorlage Travel Globe, Tiny Skies).
- **Jetpack-Schub:** Flamme bzw. Antrieb als Knet-Effekt. Wülste und Tropfen, die sich lösen, mit kfbBlend-artigem Rand. Keine realistische Partikel-Flamme.
- **Start und Landung:** kleiner Staub- bzw. Rubbel-Puff am Boden (Rubbel-Grammatik).
- **Performance:** wenige Instanzen, wiederverwendbare Pools, kein zweiter Renderpfad.

## Lieferung

- Bildtafeln je Modus (Gehen, Fahren, Fliegen) und der Moduswechsel als kurze Sequenz.
- Bauteile als three.js-Module oder klar beschriebene SVG/Canvas-Bausteine:
  ```js
  createHud({ mode: 'walk'|'drive'|'fly', palette }) → { el, setSpeed(v), setAltitude(h), setThrust(t), setFluff(n), setMode(m), radio: { … } }
  createFlightVfx({ scene, camera }) → { update(dt, speed, thrust), dispose() }
  ```
- Kurz notieren, welche Teile aus den Vorlagen übernommen sind und wo neu gebaut wurde.

## Nicht machen

- Kein Flat-UI ohne Knet-Bezug, keine dichte Gamer-Leiste, keine Militär-Cockpit-Ästhetik.
- Keine eigene Audio-Engine: Das Radio steuert den bestehenden KFB-Audio-Owner.
- Keine Backpack-Slots. Die kommen später (Backlog).
