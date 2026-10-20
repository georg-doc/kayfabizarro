# WSA → WS0 · Combat Arena Status / Migration R2 · 20.10.2026
Bezug: COMBAT_ARENA_STATUS_R1.md / V-552. Register-Snapshot gelesen bis **V-575** am Commit 38bb9b024bc58586ab0938d48a55ee39f9159ca3. Keine neue Georg-Entscheidung.

## Wichtigster Delta
**V-574 gilt für originale Kit-Waffen**: Originalform, source hand slot, native Kit-Clips unverändert; kein Erzwingen von Einhand/Unterarmachse aus V-536, keine neue per-Frame-Nachpose/Zweitinstanz. V-536 bleibt bei eigenen Zielwerkzeugen. V-562 erlaubt quer stehende Hiebklingen. Wurfkörper brauchen echte Hand-Releasepose/-marke (V-537).

## Statusbericht R1 korrigiert
- **PR #22 ist vorhanden:** https://github.com/georg-doc/KFB-Combat-Arena/pull/22, Head 88dfd291815d2d914cc84136ccc4e05dfafa6843. Nur Quellen-Audit, kein Runtimefix.
- main f6a59ad enthält vollständige 5A/A1, nicht nur Doku; spätere main-Commits sind Doku.
- PR #19 liegt frisch bestätigt **159 Commits / 93 Dateien vor main**.
- gunfight PR #5 verwendet schon donor report.barrelAxis; Muzzle-minus-Holder ist ein Fallback. main und PR5 nicht gleichsetzen.
- socket_muzzle/+Z im alten baked Donor ist nicht automatisch ein Fehler. Neue Kit-Achse am Original messen; nicht blind +Y einsetzen.

## Geliefert
**Arena Draft PR #23:** https://github.com/georg-doc/KFB-Combat-Arena/pull/23
- Branch wsa/arena-weapon-policy-r1-2026-10-20
- Head f5ccf3885756774f4572f87e8e534c0a90c3fb74
- Paket _handover/ARENA_MIGRATION_R1_2026-10-20/
- ein reines Waffenprofil-Prüfmodul, 14 Admissiontests;
- 24 Action-/Clip-Referenzzeilen über vorhandenen WSO-290er-Katalog und Legacy PR10; keine neue Messdatenkopie und keine geratenen release-Zeiten;
- Top-8-Migrationsfolge, Wurf-/Outcome-Anschluss an bestehendes kfb.scenelet/1 R2, Source/Return/Living/Housekeeping.

**Noch nicht angebunden:** der Prüfer verändert keine aktive Spielfunktion. Keine Waffe/Geometrie/Clips umgebaut, keine neuen Actor-/ready-Freigaben, keine Zusammenführung der Linien. Profil-PASS prüft deklarierte Vertragsdaten, nicht sichtbare Geometrie.

## Tatsächliche Prüfungen
74/74 Node-Tests (60 bestehend + 14 neu), Build 203 Dateien, Rehome 172 Runtime / 66 Donoren / Routes PASS. 24/24 Actionreferenzen aufgelöst; 8/8 GitHub-Dateien byte-exakt zurückgelesen. Kein neuer Browser-/Render-/Hörtest und kein Site-Deploy.

## Konkreter Anschluss an WS0 / WSB / WS1b
1. **Scenelet R2 §4/6 enthält noch die pauschale lowerarm/axis=forearm-Regel für Läufe.** Bitte die V-574-Ausnahme für Original-Kit/Source-Slot dort am bestehenden Owner ergänzen; WSA hat die Schemaquelle nicht parallel geändert.
2. Nächster Runtime-Consumer: aktueller WSB Kit-r3-Return, ein Actor/eine Originalwaffe + native Clips, echte Muzzlepose/Release → bestehender Gunfight. Vorher echte G0/G2-Quellenbelege und KFB-Augen pro Actor; kein erneuter pauschaler V-536-Umbau.
3. Clip-Measurement-/Kontext-Job #432 bleibt zuständig; WSA-Tabelle ist nur ein Consumer-Mapping. Large-Ranged/Ultimate-Monsters/Mixamo-Rohwürfe nicht aus Katalogzahlen auf ready setzen.
4. Mergeentscheidung weiter Georg. #11/#15 wurden weder geschlossen noch fortgesetzt. WS1b übernimmt später die R3F-/Spielintegration, WS0 die SFX-/Scenelet-Abstimmung.
