# Architektur-Review R1 · Integration und Site-Build · 04.11.2026

**Kurzfassung (3 Zeilen)**
1. Textuell passt alles zusammen: slop ⊕ hud-clay ⊕ tueren-r3 merged im Probe-Merge (in-memory, `git merge-tree`) konfliktfrei. Die echten Risiken sind nicht Konflikte, sondern **zwei Build-Wege, über 240 verstreute Schalter und kein Spielzustand/keine Ereignis-Uhr**.
2. Der Site-Build (`scripts/site/build-site.mjs`) baut heute **nicht das, was Georg testet** (`scripts/ir2/testfahrt-build.sh`): ohne Kartenpakete, ohne Ton-Vorbereitung, ohne Pfadprüfung, und ohne private Dateien still als „Platzhalter-Build“.
3. Für „eine spielbare Site-Version in Stunden“: WS1-Stand pushen, einen Build-Weg mit Release-Prüfung, eine Schalter-Tabelle mit Release-Satz, Truhen/Portale über den schon vorhandenen (ungenutzten) `interactable`-Vertrag an einen kleinen zentralen Zustand hängen.

Grundlage (alle gelesen über den Teil-Klon `~/kfb-ws0/kfb-mvp`, nichts geändert):

| Zweig | Head | Stand zum Stamm |
|---|---|---|
| `game/integration-r2` | 5ce6a402 | Stamm auf GitHub |
| `fx/slop-r1` | 638bfd8c | +35, Fast-Forward, enthält popups-ingest bis 790624c1 |
| `assets/popups-ingest-r1` | 8e494016 | +20 (Katalog jetzt **937** Einträge: 589 Pop-ups, 348 Slops) |
| `module/hud-clay-r1` | c9e23d29 | +32 / −62 |
| `design/tueren-r3` | 66691d1d | +14 / **−109** |
| `review/blinde-kritik-r2-animation` | 1035b76c | Befunde, Recherche |
| `comms/ws0-ws1` | 95a0ed00 | N-120, Q-066 |

Wichtig vorab: Laut Q-065/Q-066 liegt der eigentliche Integrationsstand **lokal bei WS1 (@ef52f362, ungepusht)**: HUD R2 gemergt, Augen R2, FB-Idles, fbhase, meshopt/KTX2-Entpacker, `virtual:kfb-popup-clay`, Deck-Viewer ohne PDF. Alles unten, was „Stamm“ sagt, meint 5ce6a402 bzw. fx/slop-r1. Einige Punkte kann WS1 lokal schon gelöst haben.

---

## 1 · Modulgrenzen

### 1.1 Wo was lebt (Stand fx/slop-r1 @638bfd8c)

| Bereich | Dateien | Besitzer heute | Bemerkung |
|---|---|---|---|
| **Wirt / Szene** | `src/m1/M1World.jsx` (1175 Zeilen, 154 KB, **162 Importe**, 22 `useFrame`, 33 `useEffect`) | WS1, aber alle schreiben hinein | Zentrale Verdrahtung aller Module, globale Zustandsobjekte (`CAR_LIVE`, `ROOF`, `TRAVEL`, `HUD_GOAL`, `DRIVE`, `PLAYER_CTRL`, `VWARM` …) |
| **Takt** | `src/m1/m1Clock.js`, `src/m1/M1Loop.jsx` | WS1 | Eine feste 1/60-s-Uhr (`M1CLOCK`), Akkumulator, Interpolation. Gut gebaut. |
| **Weltplatzierung** | Verteiler `src/world/placeVeg.js` (64 KB) + `placeWorker.js` + `src/vendor/place/kfb-place-{core,field,cascade}.v1.mjs`; Plätze-Tabelle `src/world/einzelPlaetze.r1.json`; Portal-Ziel `src/world/portalZiel.js`; Viertel `src/world/viertelLoader.js` + `cascade/r4/*` | Verteiler | Liefert über **globale Haken** `EINZEL` (`einzelHook.js`: `export const EINZEL = {}`), `GUMMI` (`gummiHook.js`), neu `KONTAKT` (`kontaktHook.js`, popups-ingest @8e494016, **noch ohne Erzeuger**) |
| Weitere Platzierer neben dem Verteiler | `endlessTerrain.js` (`createOccupancy`, `boardsAround`, `site.zone.spots`), `RoadsideBoards.jsx`, `PopupKulisse.jsx` (Genius Loci), `domeSites.js`, `cardZones.js`, `looseCards.js`, `kartenBau.js` | WS1 / WS-Design | Zwei Belegungs-Mechanismen: `world/occupancy.js` (nur im Gelände) und `world/keepout.js` (globale Liste, 9 Leser). Kein gemeinsames „ein Platz gehört einem Element“ über alle Schichten. |
| **2D in 3D** | Pop-ups `src/world/popupClayCore.js` + Hülle `PopupClay.jsx`; Einfügen `src/look/kfbInsert.js`; Slops `src/npc/mobs2d.js` (eine InstancedMesh) + `slopGoo.js`, `slopKurven.js`, `slopPhasen.js`, `slopZerfall.js`, `slopAlbum.js`, `inkHop.js`, `inkFx.js`; Truhen `src/world/truheOeffnen.js`; Türen `src/world/tuerPortal.js`; ältere Tafeln `world/popupBoards.js`, `RoadsideBoards.jsx`, `PopupKulisse.jsx`, `modules/billboard.js`, `vendor/billboard/billboard-clay.js` | Flug (Slops), WS-Design (Pop-ups, Türen, Truhen), WS1 (Tafeln) | `kfbInsert` ist schon „das eine Einfügen-Modul“ für Pop-ups, Slops, Tür-Shader. Gut. Die älteren Tafeln nutzen es nicht. |
| **Partikel** | `src/look/kfbTropfen.js` („EIN GPU-Partikelkern“), `modules/dustTrail.js`, `modules/fluffSuck.js`, `vendor/vfx/kfb-flight-vfx.js`, `modules/explosion{Sheets,Shards,Paper}.js`, `modules/shotBurst.js` | gemischt | `createTropfen` wird je Nutzer neu angelegt (Truhe, Tür, Tinte): gleiche Shader, getrennte Pools. Unkritisch, aber nicht „ein Pool“. |
| **HUD** | `src/hud/hudV6.js` + `src/HudClay.jsx` (77 KB) + R2: `layoutR2.js`, `statesR2.js`, `fluffBarR2.js`, `targetHud.js`, `clayKit.js`, `clayRadio.js` (hud-clay @c9e23d29); Altlasten `Hud.jsx`, `HudR5f.jsx`, `hud/hud3d.js`, `hudL3.js`, `hudShell.js`, `vendor/hud/hud-r4`, `hud-r5` | Kartenkante | HUD ist imperativ (DOM), kaum React-State. Gut. Aber **sieben HUD-Generationen** liegen im Baum, wählbar per `hud=clay|wood|3d|v6`. |
| **Übergänge** | Ladevorhang `src/hud/clayCurtain.js` → `velvetCurtain.js` (hud-clay, **WebGPU-Compute, `three/webgpu`**); alter Startvorhang `src/start/startCurtain.js` + `vendor/curtain/kfb-curtain-core.js` (Schalter `start`); Kamerafahrt `src/start/camIntro.js`; Tür `tuerPortal.js` (Sprenkel + Wirbel, `camera/followCam.js`); Fahrzeug `src/m1/travelState.js` + `fluffSuck` (build/suck) + `m2/roofDriver.js`; Sprenkel `vendor/speckle/kfb-speckle-transition.v1.js`; Kuppeln `HyperSphere.jsx`, `MindSphere.jsx` | Kartenkante, WS-Design, WS1 | Jeder Übergang besitzt seine eigene Zeit und Eingabesperre. |
| **Zustand / Interaktion** | `src/m1/travelState.js` (rein, getestet), `src/m1/flightSignal.js` (`FLIGHT`), `src/m1/locoStates.js`, `M2STATE` (M2Car), Store `src/store.js` (Dialog, Sprechen), `statesR2.stateOf()` (HUD leitet selbst ab), `src/world/interactable.js` (**von keinem Modul benutzt**), `src/npc/encounterBus.js` (NPC), `src/modules/combatTargets.js` (Ziele) | verteilt | Siehe §2. |
| **Ton** | `src/audio/kfbAudio.js` (96 KB), `cueMap.js`, `slopAudio.js`, `slopVoice.js` | WS-Audio, Flug | SFX-Bus gemeinsam. |
| **Build/Site** | `vite.config.js`, `scripts/site/build-site.mjs`, `viteSelfHost.mjs`, `mirror-raw.mjs`, `functions/_middleware.js`, `scripts/ir2/testfahrt-build.sh` | WS1 | Zwei Wege, siehe §4. |

### 1.2 Doppelte Systeme

1. **Zwei Build-Wege** (§4.1): `testfahrt-build.sh` (`KFB_SPLIT=1 KFB_CARDPACK=1`) vs. `build-site.mjs` (`KFB_SITE=1`).
2. **Zwei Fahrzeug-Zustände nebeneinander:** `travelState` (`TRAVEL_SM`, M1World.jsx:606, nur über `travelClick`) und die Flaggen `CAR_LIVE`/`ROOF.phase`/`M2STATE` mit `toggleCar()` (M1World.jsx:603), das am Automaten vorbeiläuft. HUD v6 ruft `CLAY_HOST.toggleCar` und `travelTo` (M1World.jsx:610 ff.), also den Weg ohne Automat.
3. **Drei Vorhänge:** `clayCurtain`/`velvetCurtain` (WebGPU), `startCurtain` (WebGPU-Tuch aus `vendor/curtain`), plus Überblend-Ersatz. Nur einer gehört in die Site.
4. **Zwei Slop-Tode** (Review 3_integration Befund 06, 2_vfx Befund 01): ohne `slopgoo=1` Explosion mit Feuer, Kartons, Rauch (`combatPlayer.r2` small/medium), mit `slopgoo=1` Goo. Dazu `slopZerfall.js` als dritter, angehaltener Weg.
5. **Zwei Belegungsregeln** (`occupancy.js`, `keepout.js`) und mehrere Platzierer neben dem Verteiler (Tafeln, Kulisse, Kuppeln).
6. **Sieben HUD-Generationen** und viele „alt“-Rückfallschalter (§3.3).

### 1.3 Merge-Hot-Spots

Dateien, die mehrere Zweige oder Sessions gleichzeitig ändern:

| Datei | Wer ändert | Risiko |
|---|---|---|
| `src/m1/M1World.jsx` | Stamm, hud-clay, tueren-r3, slop; 20 Commits seit 28.10. allein auf der slop-Linie | **hoch**: jede Funktion braucht einen Import und eine Verdrahtung hier |
| `src/world/popupClayCore.js` | slop/popups (Verteiler), tueren-r3 (WS-Design), WS1-Konfliktlösung (Q-065), bald Truhen-Interaktion | **hoch** |
| `src/camera/followCam.js` | tueren-r3 (kein Kamerapumpen) **und** `kamera=r2` (N-119, WS1) | **hoch, neu**: beide ändern die Folgekamera in derselben Stunde |
| `src/npc/mobs2d.js` | Flug, Verteiler (Roster), 20 Commits seit 28.10. | mittel (ein Besitzer, aber zwei Lieferwege) |
| `src/hud/hudV6.js`, `src/m1/M1Player.jsx`, `src/look/kfbTropfen.js` | hud-clay und Stamm seit dessen Basis | mittel (hudV6 war schon Konflikt in Q-066) |
| `src/world/placeVeg.js` | Verteiler, 12 Commits seit 28.10. | mittel |
| `src/siteHash.js` | alle, die ihren Schalter in die Vorgabe wollen | mittel |
| `src/data/popups/popup_katalog.r1.json`, `slop-roster.r1.json` | Verteiler und Flug | niedrig (Daten, ein Erzeuger-Skript) |

Probe-Merge (in-memory, keine Refs): `fx/slop-r1` + `module/hud-clay-r1` → sauber; Ergebnis + `design/tueren-r3` → sauber. tueren-r3 ist aber 109 Commits hinter dem Stamm: textuell sauber heißt nicht, dass die Tür mit dem neuen Pop-up-Kern (Katalog-Türen nach Kultur, `portalZiel.js`) zusammen richtig läuft.

---

## 2 · Spielzustand und Uhr

### 2.1 Befund

- **Eine Physik-Uhr gibt es** (`M1CLOCK`, m1Clock.js): feste 1/60-s-Schritte, versteckter Tab pausiert, `timeScale` vorhanden. Die meisten Module bekommen `dt` daraus über `useFrame` und das ist gut.
- **Daneben laufen Wanduhren für Spielablauf:**
  - `setTimeout` in 42 Dateien (92×), `performance.now()` in 66 Dateien (213×), `setInterval` 9×, eigene `requestAnimationFrame` 24×.
  - Spielrelevant: Aussteigen mit Teleport per `setTimeout(…, 0)` (M1World.jsx:598), Moduswechsel Fahren→Flug per `setTimeout(…, 700)` (M1World.jsx:613), Fluff-Saugen gestaffelt per `setTimeout` (M1World.jsx:694), Tumble-Whoosh per `setTimeout` (M2Car.jsx:286), Vorhang „bereit“ als Platzhalter nach 120 M1-Schritten (clayCurtain.js:38).
  - Folge: Pause, versteckter Tab, `timeScale`, Replay-Tests gelten dafür nicht. Übergänge können sich überholen (z. B. Tür während Aussteigen).
- **Kein zentraler Spielzustand:** Teilzustände in `travelState`, `FLIGHT`, `locoStates`, `M2STATE`, `CAR_LIVE`/`ROOF`, Store (Dialog), `CAM_INTRO`. Das HUD R2 leitet seinen Zustand selbst aus `st.talk/inventory/aiming/mode` ab (`statesR2.stateOf`). Niemand sperrt zentral Eingaben während eines Übergangs.
- **Kein Ereignis-Bus fürs Spiel:** 3 eigene `CustomEvent('kfb:…')`, sonst direkte Rückrufe und globale Objekte. `encounterBus.js` ist ein guter Bus, aber nur für NPC-Begegnungen.
- **Interaktion:** `src/world/interactable.js` (Vertrag „genau ein Hinweis, eine Taste“, getestet in `test/unit/interactable.mjs`) wird **von keinem Modul benutzt**. Truhen öffnen heute **automatisch per Nähe** (popupClayCore.js:85: `Math.hypot(...) < TRUHE.AUF + it.w * 0.5` → `truhen.oeffne(it)`), nicht per Taste und nicht per Schuss. Türen lösen per Annäherung/Ebene in `tuerPortal.update` aus. Das Ziel aus N-120 (Truhe per Aktionsknopf oder Schuss, Portal in allen Fortbewegungsarten, Ein-/Aussteigen über dieselbe Uhr) ist so nicht erreichbar.

### 2.2 Was es braucht (klein anfangen, nicht die ganze Recherche bauen)

Die Recherche (review/blinde-kritik-r2-animation @1035b76c, `4_recherche/RECHERCHE.md` §3) ist die richtige Zielarchitektur (Uhr, Marken-Scanner, Cue-Bus, Choreo). Für die nächsten Stunden reicht ein Kern von etwa 150 Zeilen:

1. **`src/game/gameState.js` (rein, Node-testbar, wie `travelState`):**
   - Oberzustand `foot | drive | fly | talk | inventory | transition | confirm`.
   - `send(ereignis, daten)` legt in eine Warteschlange; `step(dt)` (einmal je M1-Schritt, aus `M1CLOCK`) arbeitet sie ab und liefert Aufträge (`effects`) an den Wirt, genau wie `travelState` heute.
   - `travelState` wird Unterzustand von `drive`/`fly` statt eigener Automat daneben. `toggleCar`/`travelTo` senden nur noch Ereignisse.
   - `transition` sperrt Eingaben und andere Übergänge, bis der Besitzer `transition.done` sendet (mit Zeitlimit auf der M1-Uhr, nie hängen bleiben).
   - `confirm` = Haken für „Portal betreten?“ (N-120), ohne UI.
2. **Ereignisse als Intervall:** zeitgesteuerte Dinge (Aussteigen nach 1,0 s, Tür-Blende 0,35 s) laufen als Zeitspanne im Zustand auf der M1-Uhr (`t += dt; if (t >= dauer)`), nie als `setTimeout`. Das ist RECHERCHE §1 Punkt 3 im Kleinen.
3. **Interaktion über `interactable.js`:**
   - Truhe meldet `{ id, pos, radius: TRUHE.AUF, label: 'Open', action: () => send('chest.open', id) }`; Aktionstaste (`ACTION_KEYS.talk`, `src/hostKeys.js`) und HUD-R2-Rolle `context` (statesR2 `walk.roles`) rufen `trigger()`.
   - Schuss: `combatTargets` meldet den Treffer an die Truhe → dasselbe `chest.open`.
   - Auto-Öffnen in popupClayCore.js:85 entfernen.
   - Portal: zu Fuß als `interactable` (Hand berühren = Aktion), im Wagen/Jetpack als Volumen-Durchgang in `tuerPortal.update` → beide senden `portal.enter`. Der Zustand geht nach `transition` (später `confirm`), `tuerPortal.go()` spielt nur noch ab.
4. **HUD liest den Zustand:** `statesR2.stateOf()` bekommt `gameState.state` statt eigener Ableitung.
5. **Eine Vorwärm-Liste** (siehe §4.4) hängt am Übergang `loading → foot`.

---

## 3 · Schalter

### 3.1 Befund

- **244 verschiedene Schalter-Muster in 100 Dateien**, 201 Lesestellen von `location.hash` in 110 Dateien, jede mit eigener RegExp, meist beim Import (Modul-Konstante).
- Deshalb der Neulade-Trick in `src/main.jsx:9` (nackte Adresse → Hash setzen → `location.reload()`).
- Es gibt keine Tabelle mit Default, Besitzer und Status. Ein Tippfehler im Hash schaltet still nichts.
- Zwei Vorgaben in `src/siteHash.js`: `SITE_HASH` (`world=probe,hud=3d`, für Prüfskripte, veraltet) und `TESTFAHRT_HASH` (nackte Adresse).

### 3.2 Schalter für die neuen Inhalte

Default = ohne Hash. „Testfahrt“ = in `TESTFAHRT_HASH` auf dem Stamm. Vorschlag „Release“ = was die Site ohne Hash zeigen soll.

| Schalter | Wirkung | Default | Testfahrt | Vorschlag Release | Grund |
|---|---|---|---|---|---|
| `popups=clay` | Knet-Pop-ups über den Verteiler | aus | an | **an** | abgenommen |
| `place=r3`, `veg=cartoon` | Verteiler R3 | aus | an | **an** | Basis für WFC/Katalog |
| `gummi=1` | Hartgummi-Props | aus | an | **an** | abgenommen (N-115) |
| `viertel=1` | Kartenviertel | aus | an | **an** | |
| `inkblobs=1` (schaltet `mobs2d` mit) | Slops an Verteiler-Plätzen | aus | (WS1 lokal an) | **an** | N-112 |
| `slopbewegung=1` | Bewegungs-Bibliothek | aus | aus | **an, wenn Georg im Spiel PASS** | |
| `slopgoo=1` | Goo-Tod | aus | aus | **an** (eine Hub-Frage) | ohne ihn gilt der Explosions-Tod, den alle drei Kritiker oben anführen |
| `slopton=1` | Stimme, Treffer-Ton | aus | aus | an, wenn Georg PASS | |
| `slopzerfall=1` | Zerfall R6 | aus | aus | **aus, entfernen** | angehalten, veraltet |
| `kamera=r2` | Neigungsgrenze zu Fuß/Wagen | – (N-119, in Arbeit) | – | **an zusammen mit Slops** | die bildparallelen Slop-Tafeln brauchen die Grenze (N-117) |
| `tueren=1` | Türen/Portale als Eingänge | aus | aus | **aus**, bis R5b PASS und Portal am Zustand hängt | Übergang 2 s unscharf (Review 3_integration Befund 11) |
| `hudkit=clay` | HUD R2 + Vorhang + Kamerafahrt | aus | an | **an** | „Pass für jetzt“ |
| `hudskin=retro\|steam\|teal` | Skin | retro | – | retro | |
| `fluffpng=1` | Fluff nur über Sauger, Sprites | aus | aus | an, wenn Teil der R2-Abnahme (N-118 nennt es) | prüfen |
| `topfpflanzen=1`, `fluglage=1`, `knetespur=1` | | aus | (WS1 lokal an) | **an** | N-112 |
| `augen=r2` | Augen R2 | aus | (WS1 lokal an) | **an** | N-113 |
| `fbhase=1` | Schwanz + Bauch | aus | aus | **aus** | Bauch pending-georg |
| `fbidle=0` | alte Idles | (neu = an) | – | neue Idles | |
| `cardart=pack` | gebackene Karten | aus | an | **an, aber nur mit Paketen im Build** | §4.1 |
| `ladeplan=1` | Laden in Stufen | aus | an | **an** | |
| `travel=1` | Reise-Automat | aus | an | **an** | |
| `fx=r2` | Explosionsbögen, Waffenklänge | aus | an | an | |
| `kontakt=r1` | Kontakt-AO-Haken | aus | – | aus | Haken ohne Erzeuger (`kontaktHook.js`) |
| `vorladen=0` | Messschalter Verteiler | an (Vorladen) | – | nicht setzen | nur Messung |

### 3.3 Veraltete Schalter (Kandidaten zum Aufräumen nach dem Release)

- `SITE_HASH` (`world=probe,hud=3d`) in `src/siteHash.js`: nur noch für alte Prüfskripte.
- `start` (alter Startvorhang `startCurtain.js` + `vendor/curtain`), `hud=clay|wood|3d` (alte HUDs), `mobs2d=1` (ersetzt durch `inkblobs=1`), `slopzerfall=1`.
- Rückfall-Schalter `*=old|alt|classic|v8xx` (`drive=old`, `jump=old`, `summon=classic`, `swap=classic`, `carcolors=old`, `steine=alt`, `lines=alt`, `bubblepad=old`, `cas=old`, `bands=v825|coarse`, `music=v811`, `stones=v904`, `crater=v850`): nach der Site-Abnahme einzeln löschen; sie halten tote Pfade im Bundle.
- `functions/raw/[[path]].js`: läuft seit `_routes.json` (build-site.mjs:72) nie mehr, kann weg.

### 3.4 Empfehlung

Eine Datei `src/flags.js`: Tabelle `{ name, werte, default, besitzer, status: 'release'|'test'|'mess'|'alt' }`, ein Parser, `flag('slopgoo')`. `RELEASE_HASH` aus der Tabelle gebaut (status `release`), `TESTFAHRT_HASH` = alle `release` + `test`. Unbekannte Schalter mit `#debug` als Warnung. Die Module dürfen ihre Konstanten behalten, lesen sie aber aus `flags.js`. Das ist mechanisch und in einer Stunde machbar; den Neulade-Trick kann es später ersetzen.

---

## 4 · Site-Integration

### 4.1 Zwei Build-Wege, nur einer ist geprüft

| Schritt | `testfahrt-build.sh` (was Georg sieht) | `build-site.mjs` (was auf die Site geht) |
|---|---|---|
| Kartenpakete `fetch-packs.mjs` + `KFB_CARDPACK=1` | ja | **nein** |
| Ton `prepare.mjs`, `check-roots.mjs`, `fetch-engine-r2.mjs` | ja | **nein** (nur `site-copy.mjs`) |
| Selbst-Auslieferung (`selfHostPlugin`, `mirror-raw.mjs`) | nein | ja |
| `site-extra/h15` | `cp -R` | ja |
| ohne private Dateien | bricht ab | **baut weiter, nur Warnung** (build-site.mjs:30) |

Folgen auf der Site:
- `cardart=pack` steht in der Vorgabe, aber ohne Pakete im Build zeigt jede Karte „COMING SOON“. Setzt jemand `KFB_CARDPACK=1` ohne `fetch-packs`, bricht `viteCardPacks.mjs` ab.
- Ohne `ASSETS_TOKEN` entsteht still eine Site mit schwarzen PLATZHALTER-Slops und kaputten HUD-Bildern. Das ist genau der Fehler aus Runde 1 der Blind-Kritik (sparse Privat-Checkout).
- `mirror-raw.mjs` klont `georg-doc/kayfabizarro` ohne Token. Wird das Repo privat (V-599), bricht der Site-Build.

### 4.2 Größe und Laden

- 961 MB Site, davon ~350 MB Ton; 25-MiB-Grenze je Datei wird geprüft. Nicht geprüft: Anzahl Dateien (Cloudflare Pages: 20 000 je Deployment). Heute wohl einige Tausend (589 Pop-up-Bilder, 348 Slop-Typen im Atlas, 339 Ton-Dateien, 227 Raw-Dateien, 502 h15-Dateien).
- **Pop-up-Bilder sind Einzel-PNGs** (`popupClayCore.js:18`, `import.meta.glob('../private/popup_clay_r1/*.png')`), je etwa 850×1028 px. 589 Bilder ≈ 166 Megapixel ≈ **840 MB GPU, wenn alle gleichzeitig geladen wären** (RGBA + Mips). Der Kern zählt Referenzen und gibt frei, aber es gibt keine Obergrenze. Bei dichtem Verteiler und 40–60 verschiedenen Bildern im Umkreis sind 150–250 MB GPU realistisch. Dazu `anisotropy = 8` je Bild (popupClayCore.js:54).
- **Slop-Atlas** 3072×4032 ≈ 50 MB GPU (66 MB mit Mips), dazu Goo-Atlas. Auf iGPU/Handy knapp.
- `TextureLoader` lädt über `<img>`: Dekodieren auf dem Hauptfaden, und der Ladeplan (`src/start/ladeplan.js`, hängt nur an `fetch`) hält Bilder nicht zurück.
- GLB gesamt 119 MB; meshopt/KTX2-Entpacker sind laut Q-065 lokal bei WS1 bereit, die verkleinerten Dateien kommen von WSB.
- Große Daten als JS im Bundle: `src/data/worlds/kfb-crater-r1.js` (1 MB), `kfb-crater-a2-top.js` (0,7 MB), `card_r3.hm.js` (0,3 MB). Nur ein Problem, wenn statisch importiert. Prüfen.

### 4.3 Private Dateien und Zugang

- Die Site ist per Basic-Auth geschützt (`functions/_middleware.js`, `SITE_USER`/`SITE_PASS`). Private Kauf-Modelle landen bewusst im Build: über `import.meta.glob('../private/…')` in `dist/assets/` (z. B. `actors/botCast.js`, `privateCast.js`, `npc/mibCast.js`, `m1/jetpack.js`, `hud/hud3d.js`), dazu `hudkit/`, `kfb-cast/`, `kfb-audio/`, `kfb-songs/`, `kfb-combat/`, `kfb-asmr/`.
- **Lücke:** `_routes.json` schließt `/raw/*`, `/cdn/*`, `/fonts/*` von den Pages-Funktionen aus (build-site.mjs:72). Dort läuft auch `_middleware.js` nicht. Diese Pfade (227 kayfabizarro-Dateien, u. a. Deck-JSONs und MeshyModels) sind **ohne Passwort** abrufbar.
- **Kosten:** Für alles andere (`include: ['/*']`) läuft die Funktion bei **jeder** Datei. Ein Spielstart lädt Hunderte Dateien. Bei Funktions-Kontingent (Free: 100 000 Aufrufe/Tag) reichen einige hundert Besucher, dann antwortet die Site mit Fehlern.
- **Eine Entscheidung für Georg (eine Zeile):** Wird die Site öffentlich, ist alles in `dist/` öffentlich, auch die privaten Modelle. Bleibt sie privat, gehört `/raw/*` unter das Passwort und die statischen Pfade sollten ein günstigeres Schutzverfahren bekommen (z. B. Cloudflare Access statt Funktion).

### 4.4 Shader-Vorwärmen

- Vorhanden: `M1World.jsx` (vor `kfb:ready`, max. 4 s), `M2Car.jsx` (Wagen), `ufoEvent.js`, `viertelLoader.js`, `clayBake.js`. Q-064: Lichtzahl stabil, längstes Bild nach dem Vorhang 183 ms.
- Offen: Was mit den Verteiler-Zellen einströmt, übersetzt beim ersten Zeichnen: Pop-up-Einfügen (`kfbInsert`, mit `gummi=1` zusätzlich Falt-/Tiefenmaterial), Slop-InstancedMesh, Goo, Tropfen, Tür-Wirbel und Vollbild-Sprenkel (`tuerPortal.js`), Explosionsbögen. Q-064 misst 26 neue Programme in den ersten 3 s und 400 ms beim ersten Einsteigen.
- Der neue Ladevorhang ist **ein zweiter Renderer mit eigenem WebGPU-Gerät** (`velvetCurtain.js`, `import * as THREE from 'three/webgpu'`, Compute mit 360 Schritten/s). Er läuft genau dann, wenn WebGL Shader übersetzt und Modelle dekodiert. Dazu kommt ein zweiter three-Build im Bundle. Ohne WebGPU gibt es eine Überblendung (gut). Die Blind-Kritik sah in kopflosem Chrome mit WebGPU-Schalter nach dem Öffnen nur einen Streifen (LIES_MICH, Punkt 4): Das muss vor der Site auf Safari/Chrome/Firefox geprüft werden.

### 4.5 Fehlende Assets: wie es scheitert

| Fall | Verhalten heute | Gewünscht für Release |
|---|---|---|
| private Datei fehlt (Glob `… || null`) | stiller Rückfall: Platzhalter-Atlas, alte HUD-Tafel, kein Pop-up | Build-Liste „Pflicht-Privat“ (popup_clay_r1, slop_r1, slop_goo_r1, inkblobs_r1, 70_HUD/clay_kit_r2, Cast), Abbruch im Release-Modus |
| Raw-Datei aus der Testfahrt fehlt | `mirror-raw.mjs` Ausgang 1 → Build bricht ab | gut so |
| Kartenpaket fehlt | „COMING SOON“ | ok, aber Paket-Prüfung im Build |
| Ton fehlt | Synthese-Rückfall bzw. still | ok |
| Datei > 25 MiB | Abbruch | gut so |
| Dateianzahl > 20 000 | nicht geprüft | Prüfung ergänzen |

---

## 5 · Leistung: Hot Spots aus dem Code

1. **Texturen der Pop-ups** (§4.2): größter GPU-Posten, ohne Obergrenze. Je Pop-up 1 Mesh mit `castShadow` (zusätzlich im Schattenpass) + 1 Kontaktfleck mit eigenem Material (`contactBlob`). Bei 60 Pop-ups im Umkreis ≈ 120–180 Zeichenaufrufe nur dafür.
2. **Slops gut gelöst:** eine InstancedMesh, ein Zeichenaufruf. `update()` (mobs2d.js:245 ff.) ist weitgehend frei von Allokationen. `filter`/`map` nur beim Gruppenbau je Zelle. Goo, Krone, Tropfen kommen als eigene Aufrufe dazu.
3. **Tropfen-Pools** je Nutzer (Truhe, Tür, Tinte): je ein Aufruf, gleiche Programme. Unkritisch.
4. **React im Takt:** kaum. HUD ist DOM-imperativ (HudClay.jsx: 1 `useState`, `hudV6.js`: keiner). `M1World.jsx` setzt React-State im `useFrame` nur einmalig (z. B. Zeile 525). Kein Befund.
5. **Fetch-Wrapper zweimal** (`siteRaw.js` und `ladeplan.js` ersetzen beide `window.fetch`): funktioniert, ist aber reihenfolgeabhängig. Bilder laufen an beiden vorbei (§4.2).
6. **Wanduhren** (§2.1): kein Leistungs-, aber ein Ruckel-/Reihenfolge-Risiko bei Übergängen.
7. **Zwei GPU-Kontexte beim Laden** (§4.4).
8. **Shader-Übersetzung beim ersten Gebrauch** (Tür, erster Slop-Tod, erstes Einsteigen).

---

## 6 · Top 10 Empfehlungen

Sortiert nach Wirkung auf „eine integrierte, spielbare Site-Version in den nächsten Stunden“.

**1 · Integrationsstand pushen, Stamm einfrieren** · *WS1*
- Den lokalen Stand (@ef52f362 + HUD R2 + Stufe B) jetzt nach `game/integration-r2` pushen, auch wenn Stufe B noch Bekanntes rot zeigt.
- Danach merged nur WS1 in den Stamm. Module liefern Zweige auf genau diesen Head (Probe-Merge = Pflicht).
- `design/tueren-r3` vorher auf den neuen Head rebasen lassen (WS-Design), 109 Commits zurück.
- `followCam.js` nur von einer Hand: `kamera=r2` (WS1) zuerst, Tür-Kamera danach darauf.

**2 · Ein Build-Weg mit Release-Prüfung** · *WS1*
- `build-site.mjs` übernimmt die Schritte aus `testfahrt-build.sh` (fetch-packs + `KFB_CARDPACK=1`, `prepare`, `check-roots`, `fetch-engine-r2`). `testfahrt-build.sh` ruft dann nur noch `build-site.mjs` + `vite preview`.
- `KFB_RELEASE=1`: Abbruch ohne private Dateien, Pflicht-Liste der privaten Ordner, Prüfung „Dateien < 20 000“, Bericht in `site-build.json`.
- Georg prüft künftig den Site-Build selbst lokal (gleiche Bytes).

**3 · Schalter-Tabelle und Release-Satz** · *WS1*
- `src/flags.js` wie §3.4, `RELEASE_HASH` aus dem Status. Die nackte Site-Adresse geht auf `RELEASE_HASH`, die Testfahrt auf „release + test“.
- Release-Satz wie §3.2 als Q-066 an WS0. Eine Hub-Frage an Georg: `slopgoo=1` (und `slopbewegung`, `slopton`) im Release an?

**4 · Kleiner zentraler Spielzustand auf der M1-Uhr** · *WS1*
- `src/game/gameState.js` wie §2.2 (rein, Node-Test). `travelState` wird Unterzustand; `toggleCar`/`travelTo` senden nur Ereignisse.
- Die `setTimeout` in M1World.jsx:598/613/694 und M2Car.jsx:286 werden Zeitspannen im Zustand.
- `transition` sperrt Eingaben. `confirm` als leerer Haken für „Portal betreten?“.
- Nicht jetzt: Marken-Scanner, Choreo, Sync-Marken (RECHERCHE §3), erst nach der Site.

**5 · Truhen und Portale über `interactable.js`** · *WS1 (Verdrahtung), WS-Design (Truhe, Tür)*
- Truhe: Aktionstaste/HUD-Rolle `context` oder Treffer über `combatTargets` → `chest.open`. Auto-Öffnen in popupClayCore.js:85 raus.
- Truhe braucht einen sichtbaren Zustand „zu“ (Review 3_integration Befund 08), sonst merkt man das Öffnen nicht. Bis dahin reicht der Hüpfer + Loot.
- Portal: zu Fuß `interactable` (Berühren), Wagen/Jetpack Volumen-Durchgang → `portal.enter` → `transition`; `tuerPortal.go()` nur Abspielen.
- WS-Design liefert `oeffne()`/`go()` ohne eigene Auslöser. WS1 besitzt die Auslöser.

**6 · Zugang zur Site entscheiden und abdichten** · *WS1, Entscheidung WS0/Georg*
- Privat: `/raw/*` unter das Passwort (aus `exclude` nehmen); für die statischen Pfade Cloudflare Access statt Funktion pro Datei, sonst frisst das Funktions-Kontingent die Site.
- Öffentlich: Middleware weg. Dann ist alles in `dist/` öffentlich, auch private Kauf-Modelle (eine Zeile an Georg, keine weitere Debatte).
- `functions/raw/[[path]].js` löschen. `mirror-raw.mjs` mit Token klonen, falls kayfabizarro privat wird.

**7 · Textur-Budget für Pop-ups und Slops** · *Verteiler + WS-Design (Pop-ups), Flug (Slop-Atlas)*
- Sofort (Stunden): in `popupClayCore.js` eine Obergrenze verschiedener residenter Bilder (z. B. 32, älteste ohne Nutzer zuerst frei); `anisotropy` 4; `ImageBitmapLoader` statt `<img>`.
- Danach: Pop-ups als WebP/KTX2-Atlanten je Biom oder Klasse statt 589 Einzel-PNGs; Slop- und Goo-Atlas als KTX2 (Entpacker liegt bei WS1 bereit).

**8 · Eine Vorwärm-Liste vor `kfb:ready`** · *WS1 (Liste), Flug, WS-Design, Kartenkante (Einträge)*
- `prewarm.register(objekt)`: je ein Probe-Objekt für Pop-up-Einfügen (mit und ohne Falte), Slop-Instanz, Goo, Tropfen, Tür-Wirbel und Vollbild-Sprenkel, Explosionsbögen, Wagen. Alles in die vorhandene `compileAsync`-Stelle in M1World.jsx (PRECOMPILE_MS).
- Vorhang: Den WebGPU-Vorhang auf Safari, Chrome und Firefox prüfen (Streifen-Befund). Bei Zweifel für die Site die Überblendung als Default, Samt hinter Schalter (*Kartenkante*).

**9 · Kamera-Grenze mit den Slops ausliefern** · *WS1 (kamera=r2), Flug (Abnahme mit Slops)*
- `kamera=r2` wie N-119 in den Release-Satz, sobald Georg es sah. Ohne Grenze kippen die bildparallelen Slop-Tafeln beim steilen Blick (N-117).
- Große Pop-ups fest ausrichten, ±20–25° nachdrehen, Rückseite statt Spiegelbild (Review 3_integration Befund 01): *WS-Design*, nach dem Release.

**10 · M1World entlasten, damit Merges nicht kollidieren** · *WS1*
- Jede Funktion bekommt eine Wirtsdatei `src/m1/hosts/<funktion>.js` (create/update/dispose + Schalter), M1World.jsx listet sie nur noch.
- Für die nächsten Stunden reicht die Regel: Nur WS1 ändert M1World.jsx und `siteHash.js`/`flags.js`. Module liefern `createX(host)` und melden in ihrer N, welche Zeile WS1 einfügen soll.
- Globale Haken (`EINZEL`, `GUMMI`, `KONTAKT`) dokumentieren: ein Erzeuger, Leser-Liste, im Debug prüfen, ob sie gesetzt sind.

### Nach dem Release (nicht in den nächsten Stunden)

- Pop-up-Licht nachts/abends und Gegenlicht über `kfbInsert` (Review 3_integration Befunde 02, 03, 05: Saum mit vormultipliziertem Alpha) · *WS-Design* mit *WS-Himmel*.
- Kontaktschatten sichtbar machen (Befund 04; `contactBlob` existiert, wirkt zu schwach) · *WS-Himmel*.
- Türübergang auf 0,8–1,0 s, Torblende statt Weiß-Blitz (Befund 11) · *WS-Design*.
- GLB meshopt/KTX2 (119 MB) · *WSB*. Waffenhaltungen und Schuss-Clips · *WSB*.
- `fbhase=1` nach Bauch-PASS · *Figuren*.
- Veraltete Schalter und alte HUDs löschen (§3.3) · *WS1*, *Kartenkante*.
- Eine gemeinsame Belegungsregel für alle Platzierer (Verteiler, Tafeln, Kulisse, Kuppeln) · *Verteiler*.
- Ganze Recherche-Architektur (Marken, Cue-Bus, Choreo, Zeit-Gruppen für Hitstop) · *WS1* mit *Flug*.

---

## Anhang · Belege (Pfade mit Ref)

- Uhr: `fx/slop-r1@638bfd8c:src/m1/m1Clock.js`, `src/m1/M1Loop.jsx`
- Wanduhren im Spielablauf: `fx/slop-r1@638bfd8c:src/m1/M1World.jsx:598,613,694`, `src/m2/M2Car.jsx:286`
- Fahrzeug doppelt: `fx/slop-r1@638bfd8c:src/m1/M1World.jsx:603` (`toggleCar`), `:606` (`TRAVEL_SM`), `:610` (`CLAY_HOST`)
- Interaktionsvertrag ungenutzt: `fx/slop-r1@638bfd8c:src/world/interactable.js` (nur `test/unit/interactable.mjs` importiert ihn)
- Truhe per Nähe: `fx/slop-r1@638bfd8c:src/world/popupClayCore.js:85`
- Haken: `src/world/einzelHook.js`, `src/world/gummiHook.js`, `assets/popups-ingest-r1@8e494016:src/world/kontaktHook.js`
- HUD-Zustand: `module/hud-clay-r1@c9e23d29:src/hud/statesR2.js`
- Vorhang WebGPU: `module/hud-clay-r1@c9e23d29:src/hud/velvetCurtain.js:8`, `src/hud/clayCurtain.js:50`
- Build: `fx/slop-r1@638bfd8c:scripts/site/build-site.mjs:30,42,70,72`, `scripts/ir2/testfahrt-build.sh:25,27`, `scripts/card-pack/viteCardPacks.mjs:16-17`, `vite.config.js`
- Zugang: `functions/_middleware.js`, `functions/raw/[[path]].js`
- Schalter: `src/siteHash.js`, `src/main.jsx:9`, `src/start/ladeplan.js`, `src/siteRaw.js`
- Texturen: `fx/slop-r1@638bfd8c:src/world/popupClayCore.js:18,54`, `src/npc/mobs2d.js:36`, Katalog `assets/popups-ingest-r1@8e494016:src/data/popups/popup_katalog.r1.json`
- Vorherige Befunde: `review/blinde-kritik-r2-animation@1035b76c:review/blinde-kritik-r2-animation/{LIES_MICH.md,3_integration/PROTOKOLL.md,4_recherche/RECHERCHE.md}`
- Kanal: `comms/ws0-ws1@95a0ed00:WS0_AN_WS1.md` (N-107, N-108, N-112, N-117–N-120), `WS1_AN_WS0.md` (Q-064–Q-066)
