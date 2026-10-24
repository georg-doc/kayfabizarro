# Übernahmekarte · WS1b („Endlose Biom-Fahrt mit Wetter und Licht“)
Stand 24.10.2026, Format wie `sessions/lead.md` (V-713). Diese Karte ist ein Schnappschuss; das Logbuch ist `WS1_STATUS.md`, Aufträge kommen vom WS1-Lead.

## 1 · Auftrag und Grenzen
- **Owner von:**
  - endlose Biom-Fahrt `world=endless`: `src/world/EndlessDrive.jsx`, `endlessTerrain.js`, `biomeField.js`, `endlessVeg.js`, `driveAtmos.js`, `driveWeather.js`;
  - Staubfahne `src/modules/dustTrail.js` und `src/look/dustColor.js` (dust3 Standard, `dust3=0` = alter Staub);
  - Höhenfunktion und Einbettung in der Biom-Fahrt (Höhen-Owner nach V-400; Format `kfb.terrain-footprint/1`, nur Auftrag nach V-716);
  - Konzept Prozedurale Welt `docs/PROZEDURALE_WELT_KONZEPT_R1.md` (R1.5), inkl. Planung der Gutter-Fahrt (V-714).
- **Nur additiv in fremden Dateien:**
  - `src/modules/vehicleRig.js` (WS1d);
  - `src/m2/M2Car.jsx`, `src/m2/racerRig.js` (M2-Wirt bzw. WS1d);
  - `src/m1/M1World.jsx` und das Licht-Modul (Lead).
- **Nicht Owner von:**
  - Fahrzeuge, Flammen, Scheinwerfer (WS1d); `glow=v2` liegt hinter dem Schalter, nicht weiterbauen;
  - Wasser (WS1c), NPCs, Tratsch und Ruf-Grammatik (WS-NPC), HUD (WS1e), Ton (WS-Audio, nur über kfbAudio);
  - Register und Kanon (WS0), Kartentexte (Deck-Songs, V-698), Blender und Einbettungs-Werkzeug (WSB), Site (WSA).
- Fragen an Georg nur über den Lead.

## 2 · Repo, Zweig, Stand
| Was | Wo |
|---|---|
| Arbeitsstand | `~/kfb-ws1/kfb-planet/.claude/worktrees/determined-archimedes-729610` (Worktree von `~/kfb-ws1/kfb-planet`), Zweig `ws1/prozedurale-welt` @335b215, Basis mvp 995a1e3 |
| Gemergt in mvp | Staub `ws1/staub-probe` @283ac7c → ddb8226; Flamme `ws1/flamme-glow` @86b00ab → 571c386, vom Lead zurückgestellt in 8952830 (Standard wie zuvor, neu nur hinter `glow=v2`) |
| Abnahme-Ablagen | `~/kfb-ws1/research/audits/abnahme/staubfahne/` (index.json mit Abschnitten), `~/kfb-ws1/research/audits/prozedurale-welt/` (koeln-tasche/, hoehenfeld/) |
| Privat | Höhenfeld-Export in KFB-Stunt-Car-Race `assets/private` @4e3a497, `70_TERRAIN/hoehenfeld_r1/` (abgelegt vom Lead) |

## 3 · Bauen und prüfen
- **Bauen:** `npx vite build` → `dist/index.html`, geöffnet per `file://`.
  - **Nie bauen, während eigene Tests oder Slot-Aufnahmen laufen.**
- **Tests:** nur headless mit `PW_GPU=1`; immer `look=terrain3`, nie ohne Hash.
  - Schwere GPU-Arbeit (Reihen, fps, Clips, Abnahme-Bilder) nur im Slot: `~/kfb-ws1/bin/kfb-slot wait WS1b <min> "<was>"` … `drop WS1b`.
- **Staub:**
  - `test/dustTrail.mjs` (K1–K6 auf der flachen Wüstenlinie);
  - `test/dustTrailShots.mjs` (Videos und Standbilder, `SUF=`);
  - `test/dustFlameShots.mjs std|std-glow|flamme|glow` (A/B im selben Moment, Flammenanteil, Weißanteil).
  - Alte Staub-Proben (`dustProbe`, `dustContrast`, `dustCost`, `dustShots`) laufen mit `dust3=0`.
- **Bei jeder Staub- oder Flammen-Änderung** zusätzlich `unit-vehicleRig`, `vehicles-r1 data` (keine Shader-Neuübersetzung beim Racer-Wechsel) und `contract-static` (kein `object3d` + `dispose(` in M2Car; Ein- und Aushängen über `mountDustTrail`).
- **Konzept-Proben in Node, ohne GPU:**
  - `node scripts/world/heightExport.mjs <ordner>` (Höhenfeld world=probe und world=endless);
  - `node scripts/world/koelnTasche.mjs <normalized.json> <ordner>` mit `KT_RC`, `KT_METRIC=sd|slope`, `KT_RELIEF`.
- **Abnahme-Bilder:** Einzelbilder 1600×900 @2, JPG 88, mit index.json (Datei, Objekt, Fall, Hash). A/B mit gleicher Kamera, Zeit und Objekten. Ohne sichtbaren Unterschied nicht zu Georg, sonst mit 1:1-Ausschnitten.

## 4 · Laufende Aufträge
- **Konzept Prozedurale Welt R1.5** (335b215): Übergabe an WS0 durch den Lead bis Do 29.10. (Quelle: Lead 24.10., WS0 V-705, V-708, V-711, V-712, V-714, V-715, V-716).
- Sonst nichts in Arbeit; gebaut wird erst nach dem MVP-Start (V-646).

## 5 · Offen bei Georg / WS0
- **Georg bzw. WS0:** Darf eine Stadtzone schon bei der Weltgenerierung ein flacheres, weiterhin welliges Relief bekommen („Ebene“, Konzept §5.10)? Ohne das ist nach V-716 keine Stadt einbettbar.
- **Georg:** eigener Nacht-Ton für den Staub (nur gemessen, offen seit puffs2).
- **Georg:** Düsen-Anglühen im Staub und Leuchtring des Knet-Lüfters – beides nicht bauen bis zum Entscheid.
- **WS0:** Quell-Gate Mindspace (Lovable-Atem-App, H13, erster Raum), dann die Empfänger-Inventur von WS1b (§5.12).
- **WS0 bzw. Lead:** Welche V-705-Probe kommt zuerst nach dem MVP?
- **Deck-Songs:** tr1-Zeilen für `ai_kayfabe` und `pharaoh_piledriver` (Orakel), erst nach Georgs Okay.

## 6 · Sonderregeln (Verweise)
- Licht nur über das eine Rig (nur Sonne bzw. Himmel lesen, keine Zusatzlichter, kein Bloom).
- Geteilte Dateien nur additiv; der Standard bleibt bytegleich, neue Looks nur hinter einem Schalter.
- Einbetten nur auftragen, nie abtragen oder plätten (V-716).
- Private Dateien legt der Lead ab; in `~/kfb-ws1/stunt-race` nichts schreiben.
- Racer-GLBs sind CC0, nie als Lizenzrisiko melden; keine Lizenz- bzw. Herkunftsprüfungen.
- Commit-Hashes in Meldungen nur aus echter git-Ausgabe.
- Vor Commits `ListAgents`; kein Merge, kein Push nach main.
- Arbeitsweise: zuerst Kriterien, dann gemessen; ehrlich berichten; keine Quick-Fix-Ketten.

## 7 · Nächster sinnvoller Schritt
Auf den Ebene-Entscheid und die WS0-Übergabe warten. Nach dem MVP-Start S1 „Regie R0“ aus dem Konzept (§8): Szenen-Raster mit Auftrags-Hügeln, Regie mit 3–4 vorhandenen Typen, Auftraggeber „Figur treffen“.
