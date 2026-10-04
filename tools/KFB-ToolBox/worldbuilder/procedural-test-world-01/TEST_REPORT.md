## 2026-10-04 · Vier-Insel-Recovery: Kandidat gesichert, Browserprüfung blockiert

Die bestehende WB2-Welt enthält jetzt als Implementierungskandidat vier unterschiedliche, deterministische Lebensbäume, zusammenhängende Wurzel-/Erdkörper, die extrahierte Joyride-J14/T4-Präsentation und eine Gebäudeplatzierung mit vollständiger Grundrissprüfung. Noch keine Produktfreigabe und kein neuer Site-Stand.

- Repo/Branch: `georg-doc/kayfabizarro` · `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04` · Draft PR #348.
- Geprüfter Code-/Evidenzstand: `3d9aaf5f6623f9009d6e68dd3c042009a160b044` (vor diesem Metadaten-Checkpoint).
- 7 unveränderte Track-Core-Streams; Mittellinienabweichung 0 m.
- 25 native Gebäudemodelle in unverändertem Maßstab: vollständige transformierte konvexe Grundrisse gegen Track/Joyride-Rand, Brückenanschlüsse, geschützte Anker, Baumstämme und andere Gebäude geprüft; 0 Treffer.
- Produktionsadapter zusätzlich mit allen 25 Quellgeometrien ausgeführt; Platzierung/Maßstab stimmen mit der unabhängigen Geometrieprüfung überein. GPU-Materialprüfung steht aus.
- Wurzel-Dreiecke gegen Gebäude auf 4/4 Inseln: 0 Treffer.
- 4 deterministische Baumrezepte; 8/8 Prüfungen für die Spielstandmigration. Selbst bearbeitete Objekte, Spielerstand und Sculpt-Striche bleiben erhalten. Erhaltene, selbst verschobene Gebäude brauchen erneut eine Clearance-Prüfung.
- Unabhängiger no-code Critic: zuvor beanstandete Formmängel im letzten Offline-Vergleich behoben; gezieltes OFFLINE GEOMETRY PASS für Baum/Wurzel/Erde. Keine Spiel-/Material-/Gesamtfreigabe.

**Konkreter externer Blocker:** Der reguläre Browserzugriff auf die bestehende GPT Site wurde erneut vor Seitenzugriff verweigert: Die administrative Sicherheitsrichtlinie konnte nicht geprüft werden. Kein Transportwechsel und keine Umgehung. Dadurch fehlen aktueller Browserboot, K2-Shaderprüfung, sieben sichtbare Korridore, Spielkamera, vollständiger Player-/Residents-/Cards-/Drive-/Editor-/Save-Regressionstest und vollständige unabhängige Produktkritik.

**Site unverändert:** https://kfb-world-studio-mvp1.frizzlebob.chatgpt.site/  
Letzte veröffentlichte Version: `appgprj_6ac27631f74c8191b52e4819c1973668~appgver_fbd998f7923c81918f5c0096505e8495`. Die neuen Bilder sind ausdrücklich Blender-Geometriebelege, keine Screenshots des Spiels. Die helle Fahrbahn im Offline-Export zeigt nicht den K2/GLSL-Straßenlook.

Evidenz: `evidence/FOUR_ISLAND_RECOVERY_2026-10-04/` mit Messwerten, vier Bildern, Critic und exakter Runtime-Dateiliste. Reproduzierbare Prüfungen: `qa/wb2-four-island/`. Quellen/Adaptionsstellen: `JOYRIDE_SOURCE_MAP.json`.

**Ein nächstes internes Gate:** regulären Browserzugriff wiederherstellen, exakt diesen Vier-Insel-Kandidaten vollständig prüfen und verbleibende sichtbare Probleme beheben; danach dieselbe GPT Site in-place aktualisieren und die neue Revision öffnen. Erst anschließend bleibt genau ein menschliches Gate: Georg spielt alle vier Inseln frei. Kein Merge, keine Game-Live-Promotion.

Ältere PASS-Abschnitte darunter sind historische Evidenz und gelten nicht für diesen Kandidaten.

# TEST REPORT · WORLD-MULTI-ISLAND-CORRIDOR-01

Status: **PASS**

Tested implementation head:
`0841b89ae8274118687e946318458201b402c5b5`

| Gate | Evidence | Result |
|---|---|---|
| source/syntax | run 37166355940 · job 111329943298 | **9/9 PASS** |
| Chromium/WebGL | run 37166356027 · job 111329943523 | **PASS** |
| browser evidence | artifact 11289583486 · sha256:c6a3da665ad0b113ac23a50c263fd36c7a3dc1478ef37f2f37a3508e013ad472 | **PRESENT** |
| Resource Registry | run 37166355944 · job 111329943425 | **PASS** |

The browser gate explicitly rejects the candidate unless it has:
- 4 stable world nodes;
- 3 `ROAD_BRIDGE` connections owned by Track Core;
- Dystopia/Utopia/Protopia deck routing;
- Golden-Journey anchor IDs;
- four visible island groups;
- four reused building-owner reports with `kfb-facade-rule-v1`;
- one WB2 canvas;
- no legacy `wi1-play`, Travel Globe or card-start resource;
- no page/console error gate.

No Player/Drive/Resident behavior is claimed by this test.


## KFB-LOCO-WB2-PLAYER-01 · BROWSER PASS · 2026-10-04

Tested runtime/test head: `531fcc3f912d226254bab0e5e43a0a78750f001b`. Existing Draft PR #348, WB2 receiving owner.

**Result:** native Mannequin_Medium is controllable in the existing Town / Dystopia / Utopia / Protopia world. W progresses Walking_B → Running_A; Shift reaches Running_B; S moves backward; A/D turn. Jog remains the specified shared-phase neighbour blend. RMB orbit, wheel zoom and Ground follow camera work. Save/reload restores actor profile, world, position and heading with zero held input/speed.

**Evidence:** source/contract tests **13/13 PASS**, Chromium/WebGL player checks **10/10 PASS**, original four-island / three Track-Core bridge / building / single-canvas regression **PASS**, page errors **0**, console errors **0**. Browser run [37177630060](https://github.com/georg-doc/kayfabizarro/actions/runs/37177630060), job `111363480592`; source run `37177630053`; Resource Registry run `37177631103` **PASS**. Artifact `11293584372` · `sha256:943aa9daf8b71ecad996b0a508ac7b97c8678dda20aa8fb46818289786713991`. Durable readback: `player-01-evidence/state.json`. Town idle/run/sprint, native source-isolate and four-island images are preserved in the linked Actions artifact; local review copies remain available.

**Retained owners:** WB2 renderer/edit/save/world; R2D world data; Track Core roads/bridges; P1/P2 environment; existing building/facade family. One planar Ground writer extracted from WB0 intent/camera semantics and one native animation mixer. No consumer rig scaling or native clip retiming. Motion contract copied semantically unchanged from #344 @ `dfb6b8a15b3f04c52f49825252fcaf60f45df51c`. Original asset blobs are identical on the Motion and World refs; four native clips bind **251/251 available tracks**, omitting only the two absent hand slots (24 channels across four clips). Native root x/z translations are zero, so no double root travel.

**Limits:** no new WB2 centimetre foot-creep certification was made. The accepted Blender RAMP_02 remains the visual/measurement reference; original timing, phase, speeds and metre rig are preserved. Known start/stop/turn/strafe gaps remain as in that contract. No public Stage/deployment or human freeplay acceptance is claimed. Local In-App Browser visibly verified the integrated player; Chromium evidence is the repeatable runtime proof.

**Next internal action:** continue the Resident/activity seam under the existing `ONE_SHOT_INTEGRATION_LOCK_2026-10-04.md`, inside this same world/PR. This is an internal checkpoint, not a new Georg-facing approval gate. The explicitly requested Player checkpoint ends here; no Resident, Drive or Flight implementation was added in this turn.
