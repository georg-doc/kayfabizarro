# WSA → WS0 · FB_CANON R4 Return · 2026-10-24

**R4 REFERENZ FAIL · kein Export · kein FB_CANON · kein Georg-PASS.**

Auftrag `BRIEF_WSA_TOOLBOX_RESTART_R1.md`, Register `docs/kfb-decisions-register-2026-10-11`; aktuelle Quelle `8082e3e3a1c37a2e305ae4f382eb8b48fa7b1f00` (danach Head 158bcbed ohne Änderung dieses Briefs/Registers). Lokaler ToolBox-Branch `wsa/toolbox-restart-r1-2026-10-22`, Head `e98baa9ea24dafa6737b25a99255970e596e53b2`; weder gepusht noch veröffentlicht. Der Quellen-Push in das Sites-Projekt wurde von Auto-Review vor Ausführung blockiert; Details im Restart-Return. Kein Merge/Live, keine Ohren-Reduktion.

## Tatsächlich geprüft

P08-Profil SHA-256 `8b7ac319a0ba9c4b9cdce5fddc738a35d85a8dc517b6f1f40585c378fc843ce9`. Exakter bestehender ToolBox-Akteur in den Proof-Stage-Empfänger übergeben, kein Zwischen-GLB und keine neue Figur. Rig-Augen; Originalbrauen depth −0,08 / pitch 8; vorhandene Nase/Kopf/Ohren-Einstellungen erhalten. Vorhandenes E2 aus v2 über den bestehenden v3-claySeed-Wrapper und N30 `clay-skin-attach.v1.1.js` montiert. V6-Schalen verborgen, zwei E2-Skins vorhanden. Kein eigener Licht-Owner; bestehendes kfb-stage-light.v1.1 in Proof-Stage.

Die technischen Proof-Stage-Checks meldeten PASS (mit Topologie-Warnung). **Dieses technische PASS ist ausdrücklich kein visuelles PASS:** Die Bildkontrolle und unabhängige Gegenprüfung sehen weiterhin breite dunkle/geriefte Schmierstrukturen im Mundbereich; kein sauberer sichtbarer Laufzeitmund ist nachgewiesen. Kopf und Lider zeigen unterschiedliche Texturwirkung. Offen/halb/zu verändern sich sichtbar; geschlossen sind keine Pupillen/weißen Flächen sichtbar. Das genügt nicht für den Gesamtauftrag. Die genaue verbleibende Material-/Mundursache ist nicht abschließend isoliert; keine weitere spekulative Reparatur vorgenommen.

## Diagnosebilder, keine Abnahmevorlage

Lokaler Belegordner `/Users/georgv.westphalen/.codex/.chatgpt-projects/g-p-6aa43ccf8750819191582c384993f2c1/work/toolbox-restart-r1/qa/evidence`. Sechs 1600×1200-PNGs aus der Proof-Stage, ohne UI-Overlays. Nur als FAIL-Belege; keine kanonischen Vorlagen. Receipt `FB_REFERENCE_receipt.json` enthält technische Checks und separates visuelles FAIL, `exported:false`, `approved:false`.

| Datei | SHA-256 |
|---|---|
| `FB_REFERENCE_front_rest.png` | `783b02aa8ac0010a81bdd4c0686cca1e3a446aade0c04c328fd173d4e5afea32` |
| `FB_REFERENCE_near_face_closed.png` | `598d1d05a5e4036fa942243659117e63bb80503519175fcffb7d894e054efda9` |
| `FB_REFERENCE_near_face_half.png` | `e1db1439f0037c1b278fbbc9dc95bd8c564c1d3ea3c89392d5fa409e91bd2b5f` |
| `FB_REFERENCE_near_face_rest.png` | `c7a9eafbf9e84b927f5db9810d96618488fef9e8fb43d1ac1f71d1e6179bab95` |
| `FB_REFERENCE_side_rest.png` | `de579e1d465a6f6d86611e29c4f01b21db7656b1272306ac694188a0c70c59b1` |
| `FB_REFERENCE_threeq_rest.png` | `fb4fcf82208845a81ef52ecf4b91b1be1348490f3c44ccaa9a5c8885c0ea5c4b` |

Das historische UI-JPG mit „Prüfstatus PASS“ dokumentiert den unzureichenden technischen Status vor Korrektur des Hinweises; nicht als Freigabe verwenden. Aktueller lokaler Adapter zeigt STOP/visuell FAIL. Unabhängiger Kritiker bestätigte denselben Bildbefund, ohne weitere kritische Bildabweichung zu behaupten.

## Ausdrücklich nicht geliefert

Kein neuer GLB-Export, kein FB_CANON.glb, kein neuer Modell-Hash und keine Umstellung der Figurenkarte. Exporthöhe 1,81 m, 38 Clips und Wiederimport-Parität sind erst nach Georgs Referenz-PASS fällig und hier nicht als geprüft ausgegeben. Keine neue Nase, keine Kopfglättung, keine Ohrverkleinerung und kein Ersatzmund gebaut.

## Nächstes Gate

Den vorhandenen P08-Mund-/Materialanschluss mit seinem Owner source-treu klären; saubere Nahansicht mit gleicher feiner Knete auf Kopf und Lidhaut muss zunächst intern visuell PASS erreichen. Erst dann die sechs Referenzansichten Georg vorlegen. Export bleibt bis zu seinem ausdrücklichen PASS gesperrt.
