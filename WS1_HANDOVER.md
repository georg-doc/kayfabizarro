# WS1_HANDOVER · WS1 (Georgs Arbeits-Mac) → WS1b (Georgs MacBook) · 18.10.2026 (V-539)

Kurzfassung:
- Der Arbeitsstand ist **`combo/r2` @d762916**, veröffentlicht als Vorschau, Spiegel und Pakete (§94).
- Alle 19 lokalen Branches samt Geschichte liegen in einem **Git-Bündel**. Das Hochladen der Geschichte ins öffentliche Repo hat die Werkzeug-Sicherheit auf dem alten Mac blockiert. Georg bringt das Bündel per AirDrop oder USB auf das MacBook.
- Ohne Bündel geht es mit dem Schnappschuss `ws1/combo-r2` weiter, dann ohne Geschichte.

Keine Zugangsdaten in dieser Datei.

---

## 1 · Wo der Code liegt

| Ort | Inhalt |
|---|---|
| **Bündel** `~/kfb-ws1/handover/kfb-planet-alle-branches.bundle` (20 MB, alter Mac) | Repo `kfb-planet`, alle 19 Branches mit voller Geschichte. Auf dem MacBook: `git clone kfb-planet-alle-branches.bundle kfb-planet && cd kfb-planet && git checkout combo/r2` |
| `ws1/combo-r2` (öffentlich, @15d6727) | Schnappschuss von `combo/r2` @d762916 im Ordner `ws1/kfb-planet/` (ohne `kfb-planet-spike.html`), ohne Geschichte |
| `ws1/preview` (@f089ccf) | `index.html` (Singlefile-Build) + `build.json` → Cloudflare Pages **https://ws1-preview.kayfabizarro.pages.dev/** (etwa 15 min nach dem Push) |
| `ws1/vendor` (@70e66d5) | Pakete: `kfb-stage-light.v1.js`, `kfb-figure-loader.v1.js`, `kfb-vehicle-rig.v1.js`, `kfb-fluff-suck.v1.js`, `e2/*`, README = `docs/VENDOR_PACKAGES.md` |
| `ws1/r3f-frame` | `WS1_STATUS.md` (neueste § oben, zuletzt §95) und diese Datei |

Im Ordner `~/kfb-ws1/handover/` liegen außerdem:
- `push-combo.sh` (Veröffentlichen);
- `build.json` (Vorlage);
- `DRAGONRIDING_RESEARCH_R1.md` (Skyriding-Recherche);
- `c1-kamera-clip.webm` (C1-Abnahmeclip, nicht in git).

## 2 · Branch-Karte (`kfb-planet`)

| Branch | Commit | Wofür | Stand |
|---|---|---|---|
| **combo/r2** | d762916 | **Arbeitsstand**: c3/ernte + c1/kamera + elan/s2 + R1a Antrieb + Fluff-Saugarm + Laternen | veröffentlicht, 61/62 |
| main | 4c7c70e | look/mesa + m3/fahrhilfe (Georg V-430) | live seit 18.10. früh |
| c2/ein-rig | d3b870d | V-429: ein Licht-Rig, clay v1.1 über claySSOT, keine Eigenbau-Lampen | in combo/r2 |
| c3/ernte | d878835 | C3 Fluff-Ernte + HUD R5f + C3b Fundsachen | in combo/r2 |
| c3/fluff-ernte | 2f7ec5a | älterer C3-Versuch (17.10.) | ersetzt durch c3/ernte |
| c1/kamera | cb13e73 | V-408 Folgekamera (Bewegungs-Sitzung) | in combo/r2 |
| elan/s1 | b78e5cc | Schwungflug (Skyriding) als 2. Flugmodus | in combo/r2 |
| elan/s2 | eb24575 | Racer-Flug (`fly`) | in combo/r2 |
| fig/karten | 1e4a89b | Figurenkarten (V-391) | in combo/r2 |
| l3/licht | 3e3b9d2 | Licht L3 | in main/combo |
| look/mesa | d193606 | Mesa-Look | in main |
| m3/fahrhilfe | 66bec2c | V-379 Fahrhilfe A–G | in main |
| m2/fahren | 20caedc | M2 Fahren (K2B, ecctrl eingefroren) | in main |
| m1/bewegung · m1/tune · m1/wow | cc1ded7 · 69400cf · d16dfed | M1 Bewegung und Feintuning (Bewegungs-Sitzung) | in main |
| fix/m2-schatten | bc15970 | Schatten-Fix, durch L3 ersetzt | nur Geschichte |
| s1/weltboden | d0a66eb | Weltboden S1 | in main |
| speckle/modul | 717a922 | Sprenkel-Übergänge (TRANSITION_INTENT) | offen, nicht in combo |

**Merge nach main nur mit Georg** (V-400): `combo/r2` ist nicht auf main.

## 3 · Stand §94 (veröffentlicht / nicht veröffentlicht)

**Veröffentlicht** (Vorschau @f089ccf, `build.json` mit Links und Tasten):
- R1a Antrieb: 6 Racer, Düsen-Puls, Ton `propulsion_r1`, Schalten/Knall, Boost Stauchen→Strecken, Bremse (Nase taucht), Bodenstaub je Gelände (verkleinert).
- Fluff-Saugarm (Taste T) mit Ton `fluff_suction_r1`.
- Kristall-Laternen nachts (Platzhalter).
- Dazu C1–C3b, Elan S1/S2, Licht v1.1, B22-Lampen.

Volltest: **61/62**.
- Rot ist nur `c3g`: Der Laternen-Platzhalter glüht nachts zu schwach (1,06 × Umfeld, Ziel 1,15; echter Kern erst mit den B30-Figuren).
- `m1-rueckwand` ist nur ein INFO-Bericht.

**Nicht veröffentlicht:** nichts. Alle Commits sind im Bündel und im Schnappschuss.

## 4 · Befehle

```bash
npm ci                                   # Node ≥ 20; three 0.186.1, R3F 9, Vite 8 (rolldown), singlefile
npx playwright install chromium          # Tests nutzen Playwright-Chromium mit SwiftShader (headless); PW_CHROMIUM optional
npm run dev                              # Vite-Dev-Server, Standard-Port 5173 → http://localhost:5173/#m1,harvest
npx vite build                           # → dist/index.html (~19 MB, alles inline); Tests laden dist per file:// → VOR Tests bauen
python3 -m http.server 8743 -d dist      # lokales Spielen des Builds (alter Mac: Preview-Eintrag "kfb-ws1-test" auf 8743)
for f in test/unit/*.mjs; do node $f; done   # Unit-Tests (Node, schnell)
node test/c3s.mjs                        # einzelner Browser-Test (Saugarm); analog c3, c3b, c3g, r1a, c2 …
npm test                                 # Kette: 7 Unit + ~30 Browser-Tests
zsh scripts/m1/run-all.sh                # VOLLTEST, zsh (nicht bash!): 62 Prüfungen, auf dem alten Mac ≈ 3,5 h; Log test/out/m1/all.log
M1_ONLY=1 zsh scripts/m1/run-all.sh      # nur M-Reihe
zsh push-combo.sh                        # veröffentlichen (Spiegel + Pakete + Vorschau) – erst Pfade oben anpassen, s. Fallen
```

Die Vorschau-Hashes stehen in `build.json` → `links`. Die wichtigsten:
- `#m1,harvest` (`tod=night|gold`);
- `#m1,car,racer=<id>` (`,fly`);
- `#m1,flight=elan`;
- `#stage,actors=aliens,light=l1`.

Debug-Zugriff im Browser mit `,debug`: `window.__kfbM1` (`mods`, `renderer()`, `scene()`, `three()`, `harvest()`), `window.__kfbM2`.

## 5 · Offene Aufgaben (Reihenfolge)

1. **Bildrate auf Georgs GPU**: Das Browserfenster muss sichtbar sein, sonst pausiert rAF. Szenen: Harvest Tag/Nacht, Racer Vollgas+Boost, Saugarm.
2. **V-538 privates Repo** `georg-doc/kayfabizarro-private-assets`: HTTPS-Lesezugriff war auf dem alten Mac bestätigt. Clone + sha256 gegen `manifest.lock.json` stehen aus; auf dem MacBook direkt möglich.
3. **Racer-Bildtafel neu** (`node scripts/r1a/racer-shots.mjs` → `test/out/r1a/racers.png` + Boost-WebP) und Georg zeigen. Die alte Tafel zeigt noch den zu großen Staub. Nur lokal, private Modelle.
4. **V-514 Flug + Zerstörung R1** (Briefing `replies/BRIEF_WS1_FLIGHT_DESTRUCTION_R1.md`, gelesen):
   - Doppel-Leertaste-Flug für Racer/Jetpack/Mech auf Elan + R1a + Deformer.
   - Seed-World `createWorld/createDestruct/createWeaponFX` (MODULE_INVENTORY_R1 §5, @97c891c0, ohne sw-mech), Auslöser Arm-Muzzle bzw. `weapon`-Anker.
   - `yields: fluff` → `kfb-fluff-suck`.
   - Effekt-Kette Shot→Hit→Bild/Ton/Spur, Budget 3 Rauchkörper + 11 Sprites.
   - Ton WSA V-521/V-522 über einen kleinen Audio-Adapter.
5. **Laternen:** B30-Figuren (Satz M) einsetzen. In `src/modules/gemLanterns.js` wird nur der Bau des Kristalls getauscht. Dann gilt `c3g` mit Ziel 1,3.
6. **Fluff-Ernte Rest (P2):**
   - Bots, Stationen (E01 1-s-Effekt), Spieler-Arm als Roboter-Unterarm (V-510/V-520);
   - UFO-Strahl als Figur, `yields` im Destruction-Modus;
   - S07 „Tank voll“, sobald es eine Tank-Grenze gibt.
7. **Rustwing Cruiser II / Rust Runner II** (B35) in die Lineup.
8. **C4** wartet auf B9-Bühnen (Amphitheater, dann Goblin-Bank, Atlantis).
9. **V-497** Melodie-Stimme mit Mund-Rig + Sprechblase, nach WSA `kfb-bubbles.v1` (V-501/V-519).
10. **Aus der Bewegungs-Sitzung:**
    - Racer-Flug Vorzeichen Nick/Roll im Fahrzeugkörper prüfen; Georg empfand die Drehung als träge (kAlign × 0,5).
    - Elan S1: Kamera-Rollen fehlt.
    - M1: Umstieg auf `figureFor` (V-391); Lauf-POV fehlt.
    - m3-f, m3-g, elan-racer-browser und m1-move-120 (ALARM=3000) sind im Volltest @1940eba PASS.

## 6 · Bekannte Fallen

- **Nie `dist` bauen, während in derselben Arbeitskopie Tests laufen.** Für Volltests gibt es einen eigenen Worktree (alter Mac: `kfb-planet-test`, detached auf combo/r2).
- **zsh teilt Wörter nicht**: `$(…)` und `${X:+-p $X}` werden ein einziges Argument. In `push-combo.sh` sind die Argumente deshalb einzeln geschrieben.
- **`push-combo.sh` anpassen:** feste Pfade P/K/T (`~/kfb-ws1/…`) und `build.json` unter `/tmp/claude-503/` → eigene Pfade. Der Spiegel braucht die Eltern `ws1/r3f-frame` + `ws1/combo-r2` (sonst Push abgelehnt).
- **Teil-Clone des öffentlichen Repos** (`--filter=blob:none`): `git grep`, `git ls-tree -l` und `git log -p` laden massenhaft Blobs nach. Nutze `--name-only`.
- `git rev-parse --short` nimmt nur eine Revision.
- **Absolute Pfade** des alten Macs in `scripts/fps-probe.mjs`, `scripts/fb/idle-probe.mjs`, `scripts/m1/g0-foot-creep.mjs` → anpassen.
- **Host-Vertrag R1.2 / contract-static:** Jede Datei mit „object3d“ und „dispose(“ gilt als Modul, kein React, kein Store, keine Fenster-Listener. Tasten nur über `src/hostKeys.js`. Rig-Montage deshalb in `src/m2/racerRig.js`, nicht in `M2Car.jsx`.
- **HudR5f** muss im R3F-Baum `null` zurückgeben, nie DOM.
- **GLTFLoader entfernt Punkte aus Namen** (`KFB_Mount_board.001` → `…board001`). Anker per Präfix suchen.
- JSON-Import in Node mit `with { type: 'json' }`.
- `m1-move-120` braucht `ALARM=3000` (steht in run-all). `drift` braucht `test/out/drift` im frischen Worktree (vorher kopieren).
- **SwiftShader** ist langsam: Browser-Tests mit festen Wartezeiten scheitern. Auf Zustände warten (s. `c3s`). Die Laternen pulsieren (0,12 Hz), deshalb misst `c3g` über einen Puls.
- Ton startet erst nach einer Taste (Browser-Regel); `mute` schaltet stumm.
- Bildrate ist nur bei sichtbarem Browserfenster messbar.

## 7 · Nur lokal auf dem alten Mac (fehlt auf einer neuen Maschine)

- `node_modules/` → `npm ci`; Playwright-Chromium → `npx playwright install chromium`.
- `test/out/` (git-ignoriert): Renders, Logs, Clips, darunter private Racer-Bilder. **Nie committen.**
- `~/kfb-ws1/thrust-survey/` (107 MB): Düsen-Erkennung der Meshy-Fahrzeuge (`thrust-candidates.r1.json`, `engine-colors.r1.json`, `auswahl-6.html`, Debug-Bilder). Privat, **nie in git**. Die Ergebnisse stecken schon in `src/data/vehicles/kfb-vehicle-rig.r1.json`. Bei Bedarf privat kopieren.
- `~/kfb-ws1/kayfabizarro`: Teil-Clone des öffentlichen Repos für Status und Veröffentlichung.
- `~/kfb-ws1/private-assets-probe`: Clone des privaten Repos ohne Inhalte (nur Test).
- Preview-Konfiguration der Desktop-App (`.claude/launch.json`, Einträge `kfb-ws1` / `kfb-ws1-test`).

## 8 · Assets: woher, wie eingebunden

- **Alles, was das Spiel lädt, kommt über feste Commit-Pins aus dem öffentlichen Repo** (raw.githubusercontent, keine raw/main-Links):
  - Racer: Asset-Branch `assets/meshy-arcade3-marble-vehicles3-2026-10-16`, v3-Browserfassungen;
  - Wald: `FOREST_PIN` 54b9bb66;
  - Fundsachen und B22-Lampen: Pin 0d9a632e;
  - Ton: ElevenLabs `propulsion_r1` + `fluff_suction_r1` @ac72e087.
- Die Pins stehen in den jeweiligen Modulen (`orchard3d.js`, `loot.js`, `billboard.js`, `engineAudio.js`, Rig-Daten).
- **Private Pakete P1/P2** (Artifact unter Georgs Konto) waren auf dem alten Mac nie erreichbar. Dort liegen u. a. Bots B31, Rustwing II, B9, B30.
  - Auf dem MacBook über Dropbox bzw. das private Repo `kayfabizarro-private-assets` einbinden.
  - Private Dateien **nie** in öffentliche Branches (V-427/V-433). Lokal laden, z. B. aus einem git-ignorierten Ordner, und nur Pins/Manifeste committen.

## 9 · Regeln, die weiter gelten

- Wireface-SDK nie im Repo, auch nicht in Builds.
- Keine Firmen-Interna und keine Mail-Adressen im öffentlichen Repo.
- Downloads nur mit Georgs Erlaubnis.
- Volltest vor jedem Push; nichts Halbfertiges auf `ws1/preview`.
- Kein Auto-Merge, kein main-Merge ohne Georg.
- Keine stille Post: Georgs Entscheide schreibt WS1 selbst in den Status.
- Karten nur vierteln.
- Commits alle 30–45 min, Status-Pushes regelmäßig (WS0 sieht sonst keine Aktivität).
