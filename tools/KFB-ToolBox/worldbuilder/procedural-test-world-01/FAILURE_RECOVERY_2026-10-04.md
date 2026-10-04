# Eingefrorener KFB-Welt-/Studio-Kandidat — 4. Oktober 2026

**Kein fertiges MVP. Kein neuer Spieltest-Link.** Die Reparaturgrenze des vereinbarten One-Shot-Vertrags ist erreicht. Kandidat und Belege bleiben vollständig erhalten.

Nachgewiesen sind die Welt mit39Originalobjekten, Player/Motion, gemeinsames Audio und die echte Clown-Karte. In zwei früheren Läufen gelang Schlüssel→Taxi→6,08mFahrt→Laufen. Der native Studio-Roundtrip besteht5/5: Original ansehen, Brunnen setzen/skalieren, Gelände anheben, exportieren, frischer Ursprung, importieren und erneut exportieren. Quelle, Transformation,40Objekte und Sculpt bleiben exakt erhalten.

Der letzte Lauf besteht3Gates und scheitert vor dem Taxi-Einstieg. Der Test akzeptiert einen nahen Rasterpunkt, obwohl der Driver weiterhin der nächste Interaktionspartner ist. Die Schutzprüfung verhindert einen falschenPASS. Das ist ein reproduzierbarer Fehler der automatischen Zielankunft; die frühere erfolgreiche Fahrt wird weder gelöscht noch als Beweis für den letzten Lauf ausgegeben.

Ein tatsächlicher Straßenanschlussfehler wurde zuvor im bestehenden Bodenmodell korrigiert: native Straßen reichen6m über den Inselrand hinaus. Quelltests und reine Topologieprüfung stützen die Korrektur. Der letzte Lauf erreicht Dystopia nicht und widerlegt diese Reparatur deshalb nicht.

Die volle vierteilige Reise, Konzert/Tanz, spätere Begegnungen, frischer Journey-Import,61Quellenansichten und Gesamtqualität sind **nicht bewiesen**. Alle neun Gesamtwertungen bleiben unbewertet. Die reservierte Spiel-Stage wurde nicht veröffentlicht; Live und PR bleiben unverändert offen.

## Wiederaufnahme

Einziger nächster Gate: `RECOVERY_NATIVE_INPUT_ENDPOINT_REPRO_01` im selben WB2-Owner. Tatsächliche Tastenbewegung, Loslassen, Ausrollen, Abstand und nativeNearest-ID gemeinsam reproduzieren. Erst nach einem erneuten belastbaren Ankunftsnachweis kann die vollständige Reise wieder geprüft werden. Diese Übergabe autorisiert keinen automatischen dritten Reparaturversuch. Kein Neubau der Welt/NPCs, kein neuer Controller, keine Teleports, erzwungenen Gesprächspartner oder geschenkten Rewards.

## Technischer Anhang

- Repo `georg-doc/kayfabizarro`; Draft PR#348; Branch `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`.
- Eingefrorene Runtime `4334151bfbf230d33ad459f61cc0da595c1191a2`; tatsächlich getesteter PR-Merge `2ffd7041e931f308c1408e5a5b67c97102564e24`.
- Letzter Lauf [37199802833](https://github.com/georg-doc/kayfabizarro/actions/runs/37199802833):3PASS/1FAIL/8nichtausgeführt;0Browserfehler. Artifact11302144306, SHA256 `3dbee626e50d1a72708a0fd7b83cf363709c155625b275df9c9ebef64b48c62d`.
- Lokale Quelltests19/19; CI-Source15/15. Registry und Librarian-Smoke am Runtime-HeadPASS; letzter R2D-Lauf separat ablesen, kein erfundenerPASS.
- Native Endposition `[-2.2778793318,.5970569570,-21.1657564277]`; nächsterDriver2.096835m. Letzter Zielrasterpunkt `[-2,-22]`.
- Vollständige Recovery-Provenienz/Owner/Quellen/Artefakte: `FAILURE_RECOVERY_2026-10-04.json`; actualRuntime/17nativeTraversal-Einträge/80exakteRuntime-Blobs in `evidence/FROZEN_*.json`.
- Vorheriger Fahrt-PASS: Lauf37196264077 an1876ba…;6.077702m. Prioren und letzteRegression ausdrücklich getrennt.

Vertrag: [Independent External Critic Loop](https://github.com/georg-doc/kayfabizarro/blob/main/skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/ONE_SHOT_EXTERNAL_CRITIC_LOOP_2026-10-04.md): „After two non-improving passes: CORE blocker → freeze + failure-recovery export“.
