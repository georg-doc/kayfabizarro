# KFB HUD + Flug-VFX · Session-Cut 2026-10-09 r1 · Handover für Coworker / MVP-Einbau

Stand 2026-10-09. Für WSA / Coworker. Gebaut gegen three.js r170 (Tafel); Ziel ist das KFB Island Worldbuilder Lab (r186). Die Module nutzen nur APIs, die zwischen r170 und r186 stabil sind (InstancedMesh, ShaderMaterial, GLTFLoader).

## Inhalt

| Datei | Rolle | Ins Lab? |
| --- | --- | --- |
| `hud-flight/kfb-hud.js` | `createHud()` · Knet-Plaketten Gehen/Fahren/Fliegen, Moduswechsel, Fluff-Zähler, Radio, Rucksack-Slot | ja |
| `hud-flight/kfb-flight-vfx.js` | `createFlightVfx()`, `createSpeedTrails()`, `hoverPose()`, `FLIGHT_IDLE` | ja |
| `hud-flight/kfb-backpack.js` | `createPropLibrary()`, `createPropRenderer()`, `mountBackpackMini()`, `createBagOverlay()` | ja |
| `hud-flight/kfb-jukebox-data.js` | Biome (Paletten, HUD-Farben), Titel, Biom-Sender, Kassetten, Items, Modell-URLs | ja, als Daten |
| `hud-flight/hud-board-scene.js` | Platzhalter-Insel, -Figur, -Jetpack, -Kart | nein, nur Tafel |
| `KFB HUD Flight Board.dc.html` + `support.js` | Bildtafeln A–F + Live-Szene | nein, Referenz |
| `docs/LIVING_HUD_FLIGHT.md` | Stand, Entscheidungen, Offen | lesen |
| `docs/CHANGELOG.md` | R1–R3 | lesen |
| `docs/SPRINT_R4_PLAN.md` | nächster Sprint, Arbeitspakete R4-0 bis R4-9 | lesen |
| `docs/ONBOARDING_frischer_chat_hud_flight.md` | Einstieg für einen frischen Chat | lesen |

Öffnen: Ordner über einen lokalen Webserver ausliefern (`npx serve .`) und `KFB HUD Flight Board.dc.html` aufrufen. Modelle und Titel kommen live von raw.githubusercontent.com (Commit-gepinnt), also Internet nötig.

## API

```js
import { createHud } from './kfb-hud.js';
import { createFlightVfx, hoverPose, FLIGHT_IDLE } from './kfb-flight-vfx.js';
import { createPropLibrary, createPropRenderer, mountBackpackMini, createBagOverlay } from './kfb-backpack.js';
import { BIOMES, BIOME_STATIONS, TRACKS, TAPES, ITEMS, DEFAULT_BAG } from './kfb-jukebox-data.js';

const hud = createHud({ mode: 'walk', palette: BIOMES.burg.hud, host });
hud.setSpeed(kmh); hud.setAltitude(m); hud.setThrust(0..1); hud.setEnergy(0..1);
hud.setFluff(n); hud.addFluff(k, { from: { x, y } }); hud.setMode('walk'|'drive'|'fly');

// Radio steuert den KFB-Audio-Owner, spielt selbst nichts
hud.radio.on('music' | 'play' | 'prev' | 'next' | 'playlist', fn);
hud.radio.setPlaylists([{ id, label, sub }], activeId);
hud.radio.setTrack({ title, artist, index, count }); hud.radio.setSource(label);
hud.radio.setMusic(bool); hud.radio.setPlaying(bool);

// Rucksack
const lib = createPropLibrary({ THREE }), view = createPropRenderer({ THREE });
const mini = mountBackpackMini({ hud, lib, view });          // mini.tick(dt) im Frame
const bag = createBagOverlay({ host, palette: hud.palette, lib, view, items: DEFAULT_BAG });
hud.backpack.onOpen(() => bag.toggle());                      // bag.tick(dt) im Frame
bag.on('insertTape' | 'eject' | 'ownSong' | 'use' | 'change' | 'open' | 'close', fn);

// Flug-VFX
const vfx = createFlightVfx({ scene, camera, body: figure,
  nozzles: [{ object: jetpack, offset, dir }], trails: [{ object: jetpack, offset }],
  surfaceAt: (x, z) => ({ y, water }) });
vfx.update(dt, speedKmh, thrust);  vfx.maneuver(1, 0.9);  vfx.setGrounded(bool, pos);
vfx.setTrailAnchors(kartCorners);  vfx.setSkim(false);    vfx.setViewHeight(px, fov);
const p = hoverPose(t);            // { y, pitch, roll, leg } für den Figur-Owner
```

## Einbau ins MVP · Reihenfolge

1. `kfb-hud.js` + `kfb-jukebox-data.js` einbinden, `createHud({ host, palette })` im HUD-Layer des Lab. Vorher K7 Knet-HUD abgleichen (SPRINT R4-1), damit es nicht zwei HUD-Owner gibt.
2. Radio-Events an den Audio-Owner (`song-transport.js`) hängen. Der `<audio>`-Platzhalter der Tafel wird nicht übernommen.
3. `createFlightVfx()` in die Spielszene; Düsen- und Trail-Anker am echten Jetpack setzen, `surfaceAt` aus Surface Truth.
4. `kfb-backpack.js` mit dem Inventar-Owner verbinden (`items`, `add`, `remove`, Events).
5. Clay-Präsentation nur über das SSOT (PR #301). Der jetzige Knet-Look der Items ist eine Annäherung.
6. Smoke im Lab auf r186; Performance nur nach Messregel, sonst UNKNOWN.

## Stand gegen das Briefing (BRIEF_CLAUDE_DESIGN_HUD_FLIGHT_R1.md)

Erledigt
- A · HUD je Reisemodus, Moduswechsel als Knet-Animation (Tafel B, Einzelbilder), Fluff-Kugel ins Zählwerk, Platzierung Ecken/unten, Mobil.
- B · Speedlines als Bänder an den Außenkanten (Tiny Skies Contrails über Travel Globe v13), Manöver-Linien (radial, hell, nur auf Auslöser), Jetpack-Schub als Knet-Wülste und Tropfen, Start-/Lande-Puff, Überflug Staub/Gischt (optional), Schweben.
- Performance: feste Pools, ein Renderpfad, 5–6 Draw-Calls.
- Bauteile als Module mit der im Briefing skizzierten API; Herkunft je Teil auf Tafel E.

Über das Briefing hinaus (auf Zuruf)
- Rucksack-Slot + 20-Fächer-Overlay + Kassettendeck. Im Briefing stand „Keine Backpack-Slots, kommen später“; jetzt vorgezogen.
- Biom-Paletten treiben Welt und HUD; Biom-Radio + Kassetten als Playlists.

Offen
- Knet-Textur: Plaketten und Items sind noch rund/glatt. Nachziehen mit der Claymation-Textur der aktuellen Joyride-Slices.
- Gelesen 2026-10-09: Clay SSOT (PR #301), Clay-Surface-Kanon, K2 LIVING_CLAY, Fassaden-Router, `clay-profiles.v2`. Noch nicht angewendet (R4-2/R4-3).
- Nicht gefunden, mit Hinweis weggelassen: `docs/MVP_DRIVE_LOOP_R1_PLAN.md`, `ENV_ROLES` (`src/palettes.ts`), `kfbBlend`, Mauerwerk-Familie A. Status SOURCE_REQUIRED (R4-0).
- K7 Knet-HUD (`clay-hud.v1.js`) existiert schon mit Rucksack + 20 Plätzen. Owner-Frage vor dem Einbau klären.
- Echtes Combat-Mech-Jetpack und echte Figur: Tafel nutzt Platzhalter. Düsen- und Trail-Anker müssen am echten Modell neu gesetzt werden.
- Audio-Owner-Anbindung: Events sind definiert, die Tafel spielt per `<audio>` als Platzhalter.
- Kassetten-Modell: in KayKit/Tiny Treats keins gefunden, Kassette ist DOM-Platzhalter. Ggf. Kenney/Quaternius prüfen.
- Senderzuordnung je Biom ist Vorschlag (fest nur Dystopia → Demon Lord Afro-Strut). Künstler: alles „KFB“, Shepards Coaster „FrizzleTune“ (aus dem Titel abgeleitet).
- Biom-Hex-Werte vom Referenzblatt `01-farbpaletten.jpg` abgelesen, nicht aus `hex-archipel.r2c.js`.
- Comic-Contrails aus Travel Globe v13 nicht portiert.
- Lab-Version three.js r186 nicht live getestet.
