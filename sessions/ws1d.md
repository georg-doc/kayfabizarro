# Übernahmekarte · WS1d Fahrzeuge („WS1d Fahrzeuge: 14 Racer, Heldenfarbe, Scheinwerfer“)
Stand 24.10.2026 · Format nach `sessions/lead.md` (V-713). Schnappschuss; das Logbuch ist `ws1/audits/VEHICLES_R1.md` im Spiel-Repo (Zweig `ws1/vehicles-r1`).

## 1 · Auftrag und Grenzen
- **Owner von:** Racer im Spiel (14 Dieselpunk-Racer, Wechsel mit V/Startseite, Modell-Cache, Vorwärmen), Heldenfarbe (Einstellung, Standard Original), Racer-Machart (Originaltextur + Knet-Zusätze: Lüfter mit Leuchtring, Funken, Knet-Flamme v1), Front-Scheinwerfer (Glas-Glühen, Blendstern, Lichtkegel als Volumen, Kontaktfläche), Antriebs-Modul `src/modules/vehicleRig.js`, Modul `kfb-groundfx` (V-632, Formen cone/pool/ring/beam2, Mischer).
- **Nicht Owner von:** Fahrphysik (K2B, abgenommen V-251, nicht neu bauen), Licht-Rig/Tageszeit und Biom-Fahrt (WS1b), Wasser (WS1c), HUD (WS1e), Ton (nur über kfbAudio, Besitzer WS-Audio), Schattenseiten-Regel shadeFloor (V-683, Lead), M1-Wirt/Merges (Lead), Register und Kanon (WS0).
- Aufträge kommen über den WS1-Lead („R3F Modul-Host Vertrag“); Fragen an Georg nur über den Lead.

## 2 · Repo, Zweig, Stand
| Was | Wo |
|---|---|
| Arbeitsstand | `~/kfb-ws1/kfb-planet-vehicles` (Worktree von `~/kfb-ws1/kfb-planet`), Zweig `ws1/vehicles-r1` @03a0433 |
| Eingebaut | `ws1/vehicles-r1` ist vollständig in `ws1/mvp-r1` enthalten (Merge c240081, Standard `hlt=cone` 326ebb1, beides Lead) |
| Bericht | `ws1/audits/VEHICLES_R1.md` (+ `VEHICLES_R1_ANKER.md`, Bilder `ws1/audits/img/vehicles-r1/`) |
| Abnahmebilder | `~/kfb-ws1/research/audits/abnahme/<thema>/` + `index.json` (u. a. `scheinwerfer4/`, `scheinwerfer5/` mit `-hang2`/`-r2`, `flamme-v2/` = abgelehnt) |
| Daten | `src/data/vehicles/kfb-vehicle-rig.r1.json` (14 Racer: Klasse, Räder, Verformung, Düsen, Scheinwerfer-Anker) |
| Recherche | `~/kfb-ws1/research/audits/HEADLIGHTS_RESEARCH_R1.md`, `HEADLIGHTS_PHYSIK_R2.md` (Lead) |

Wichtige Dateien: `src/m2/M2Car.jsx` (geteilt, Racer-Laden/Wechsel), `src/m2/racerRig.js`, `src/look/headlights.js` (Modi alt/v2/v3/cone, `HEADLIGHT_TUNE.cone`), `src/look/kfb-headbeam.v1.js` (Lichtvolumen), `src/look/kfb-groundfx.v1.js`, `src/look/vehicleLook.js`, `src/start/startCurtain.js`.

## 3 · Bauen und prüfen
- `npx vite build` **vor** Browser-Tests (sie laden `dist`); nie bauen, während eigene Tests laufen. Browser-Tests mit `PW_GPU=1`, headless, Bilder immer `look=terrain3`.
- Test-Slot für alles Schwere (Aufnahmen, fps, Kosten, Abnahmeläufe): `~/kfb-ws1/bin/kfb-slot wait <name> <min> <was> && node … ; kfb-slot drop <name>`. **`take` bricht bei belegtem Slot nicht ab** – immer `wait` verketten.
- Eigene Prüfungen: `node test/unit/vehicleRig.mjs`, `node test/contract-static.mjs`, `PW_GPU=1 node test/groundfx.mjs`, `PW_GPU=1 node test/vehicles-r1.mjs data|start` (dazu `sheet|clip|fps|vclay|look` im Slot). Letzter Stand: alle grün; `data` war einmal rot (neuer Shader beim Rückwechsel), Folgeläufe grün – im Auge behalten.
- Scheinwerfer-Abnahme: `test/headbeam5-abnahme.mjs` (Kriterien G1–G6; Modi `HB_ONLY=hang2|r2`, `HB_HANGSPOT=x,z,yaw`; `HB_QUICK=1` schreibt nach `scheinwerfer5-quick/`), Linienmessung `test/headbeam-line.mjs`. Ältere: `headbeam-abnahme.mjs`/`headbeam-criteria.mjs` (scheinwerfer4), `headlight-abnahme.mjs`, `racer-abnahme.mjs`.
- `contract-static`: Dateien mit `object3d` + `dispose(` zählen als Modul – Modell-/Scheinwerfer-Freigabe deshalb in `racerRig.js`, nicht in `M2Car.jsx`.

## 4 · Laufende Aufträge
- **Keiner aktiv.** Scheinwerfer-Kegel ist Standard (Georg 23.10.), gemergt.
- Auf Zuruf (Lead, nicht vorher bauen): **Feinschliff Kegel ↔ Fleck** – in der Draufsicht wirken Volumen und Fleck getrennt: Volumen-Ränder dünn (wirkt schmaler), Fleck läuft am Anfang zu schnell hell ein. Kriterium: von der Lampe bis zum Fleck kein Helligkeits- und kein Breitensprung (Draufsicht + Spielkamera); Abnahmeplatz ohne dunkle Kästen (Plätze im Bild prüfen wie in `headbeam5-abnahme.mjs`).
- Gesperrt: **V-658** FB in Spielgröße neben den Racern (erst nach FB_CANON-Freigabe). **V-714** Racer-Persönlichkeit (vehicleId im Figuren-Register, Konzept Prozedurale Welt §5.8.1) – nach dem MVP, nichts bauen.

## 5 · Offen bei Georg / WS0
- Scheinwerfer: Käfer nachts am Fleck-Ende 7,2/255 Pixel-Sprung (Ziel ≤ 6, langer Kegel 41,7 m); Option „40 % statt 35 % Ausblenden“ angeboten, vom Lead auf Eis bis Georg sich äußert. Kosten bei 3200×1800 0,22–0,25 ms (Lead: ok vermerkt), bei 1600×900 0,18–0,19 ms.
- Bei Gold ist der Kegel zurückhaltend (Werte nach Recherche §3.5); Stellschraube `HEADLIGHT_TUNE.cone.op1/g1`.
- Knet-Flamme v2 (V-675) von Georg abgelehnt („v1 war abgenommen und bleibt“), per Revert 8a14577 entfernt; Bilder bleiben in `flamme-v2/` als Beleg.
- Ältere offene Punkte (Bericht §Offen): Nachtbild/poolDist (inzwischen vom Kegel abgelöst), Erstladen einzelner Racer mit neuen Shader-Varianten (Käfer, Abschlepp-Koloss), Ferne-Aufhellung `VEHICLE_LOOK.near/far`, SPACE_HAULER-Profil nicht abgestimmt.

## 6 · Sonderregeln (Verweise)
- Tests nur headless, keine sichtbaren Fenster; Bilder/Abnahmen immer `look=terrain3`, Spiel nie ohne Hash öffnen (Memory `kfb-no-visible-browser-terrain3`).
- Test-Slot-Regel inkl. `wait` statt `take`, Probeläufe nie in die Abnahme-Ablage (Memory `kfb-test-slot`).
- Abnahmebilder: Einzelbilder 1600×900 @2 (3200×1800), JPG 88, `index.json`, A/B im selben Rechenschritt, gleiche Kamera/Zeit (Memory `kfb-abnahme-einzelbilder`).
- Neue Looks nur hinter einem Schalter, bis Georg sie gesehen hat; Standard erst nach Georgs Abnahme. Kein Merge, kein Push nach `main`; Einbau über den Lead. Vor Commits `ListAgents`.
- Racer-GLBs sind CC0 (Meshy-Community), keine Lizenzprüfungen; Creator-Credits bleiben (Memory `kfb-racer-lizenz-cc0`). Private Dateien nie ins öffentliche Repo; private Ablage über den Lead (Memory `kfb-private-ablage-lead`).
- Commit-Hashes in Meldungen nur aus echter git-Ausgabe (Memory `kfb-commit-hash-aus-ausgabe`). Staub/Flamme: `vehicles-r1 data` + `contract-static` mitlaufen lassen, kein Shader-Neubau je Racer-Wechsel (Memory `kfb-staub-flamme-reihe`).
- Bei Grundsatzfragen erst den Lead fragen, nicht raten.

## 7 · Nächster sinnvoller Schritt
Nichts bauen, bis der Lead ruft. Wenn der Feinschliff Kegel ↔ Fleck kommt: zuerst mit `headbeam-line.mjs`/`headbeam5-abnahme.mjs` Helligkeit und Breite entlang Lampe → Fleck in Draufsicht und Spielkamera messen, dann eine Änderung (Volumen-Ränder dichter, Fleck-Einlauf an das Volumen angleichen), Bilder `scheinwerfer6/` im selben Rechenschritt.
