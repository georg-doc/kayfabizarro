# Overworld-UI-SFX — Übersicht & Mapping (für Design)

> Kandidaten alle aus **einem** Set: `kenney_interface-sounds` (CC0). Bewusst eine eigene Klangfamilie (synthetische Klicks), damit die UI **nicht mit den In-World-Foley-Sounds konkurriert** (400 Sounds Pack, impact, rpg, casino). Ist in `sfx.json` schon als UI-Set gesetzt (ui/confirm/error) — wir erweitern konsistent. Wireable: `ui-sfx.json` (Events über `sfx('ui.event')`).

## Warum ein Set + Lulls

Zwei Prinzipien: **Kohärenz** (eine Familie = die UI klingt wie ein Gerät, nicht wie fünf) und **Restraint** — UI-Sounds nur bei **diskreten, bedeutungsvollen Commits** (Druck, Öffnen, Schließen, Bestätigen, Fehler). Alles Kontinuierliche und jeder Hover bleibt **still**. Gain sitzt bewusst **unter** den World-SFX, mit leichtem Rate-Jitter gegen „Maschinengewehr", Debounce 80 ms.

**Repo-Quelle:** `media/3D_Assets/Audio/kenney_interface-sounds/`

## Das Mapping (Klicks & Interaktionen)

| Event (`sfx('…')`) | Auslöser im Overworld-UI | Datei | Gain |
|---|---|---|---|
| `ui.click` | generischer Button-Druck | `click_001.ogg` | 0.60 |
| `ui.slot.resource` | Slot 1–3 Fluff/Kayfabe/Bizarro casten | `click_002.ogg` (+Rate-Jitter) | 0.60 |
| `ui.slot.signature` | Slot 4 Hero-Signature | `confirmation_003.ogg` | 0.72 |
| `ui.tab` | Navi-Tab wechseln | `click_003.ogg` | 0.50 |
| `ui.toggle` | Setting/Ambient an/aus | `click_004.ogg` | 0.55 |
| `ui.select` | Avatar/Actor wählen · Slot-Swap-Pick | `confirmation_002.ogg` | 0.60 |
| `ui.confirm` | Bestätigen im Fenster | `confirmation_001.ogg` | 0.70 |
| `ui.back` | Zurück / abbrechen | `back_001.ogg` | 0.55 |
| `ui.window.open` | Character / Quest-Log öffnen | `open_001.ogg` | 0.60 |
| `ui.window.close` | Fenster schließen | `close_001.ogg` | 0.55 |
| `ui.diary.open` | Almanach öffnen (Buch-Ton) | `open_002.ogg` | 0.60 |
| `ui.almanac.pagein` | Karte fliegt animiert ins Diary | `drop_002.ogg` | 0.60 |
| `ui.error` | keine Ladung / ungültig (sanft) | `error_002.ogg` | 0.55 |
| `ui.map.open` | Minimap vergrößern | `maximize_001.ogg` | 0.55 |
| `ui.map.close` | Minimap zu | `minimize_001.ogg` | 0.50 |
| `ui.gear` | Settings-Zahnrad | `click_005.ogg` | 0.50 |

## Lulls (still per Default — Absicht, nicht vergessen)

- **Jeder Hover** → still. Optional sehr leiser `rollover` @ gain 0.25, **default AUS**.
- **Chat tippen/senden** → still (kein Chirpen pro Taste).
- **Bewegung / kontinuierliche Aktionen** → still (kein Menü-Schritt-Klick).
- **Idle / Ambient** → still.
- **Wiederholtes identisches Event < 80 ms** → debounced.

## Trennung UI ↔ World (nicht vermischen)

- **Reveal-Dissolve** (Karten-/Lootbox-Enthüllung) = **Portal/Cloth-Sound aus `sky-cards`**, nicht die UI-Familie.
- **card · coin · hit · land · step · jump · gutterFall** = World-Foley, liegen schon in `sfx.json`.
- **win / levelup** = `kenney_music-jingles/` — sparsam, nie pro Klick.

## Wiring (für Design)

`ui-sfx.json` neben `sfx.json` legen (`media/3D_Assets/Audio/`), von `travel-audio.js` mergen, dann `sfx('ui.click')` etc. an die HUD-Events hängen (Slot-Press, Fenster open/close, tab, error). Rate-Jitter + Debounce sind im Manifest unter `_rules` notiert. Gain global anpassbar; die Familie soll unter der World-Ebene sitzen.

**GitHub-Ziel:** `media/3D_Assets/Audio/ui-sfx.json` (das Manifest) — diese Übersicht als Handreichung in den Design-Chat.
