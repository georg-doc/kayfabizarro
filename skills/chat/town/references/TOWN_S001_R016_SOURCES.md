# S001 r016 · Quellen, Ableitungen und Prüfgrenzen

**Datum:** 15.09.2026. **Zweck:** Quellen-/Übernahmehinweis zu §12–13 des [Town-Living](../LIVING_KFB_TOWN.md). Keine weitere Ideen-SSOT und kein Runtime-Vertrag.

## Gesicherte Grundlage

Georgs Town-Ideenchat r001–r016 ist die Quelle der dort zugeordneten Autorenrichtungen. Öffentliche Projektion: räumlicher Aufbau, Ton-/Sprachkorrekturen, Bewohner/Props, Musik, Karten, Lean Memory, Social POP, Showbühne und Consumer-Anschlüsse. Private Geschenkdetails, personenbezogene Sitzungsdaten und unbestätigte Character-Master wurden nicht neu veröffentlicht. Der öffentliche Abgleich ist kein vollständiger Export der lokalen Sitzung und enthält keine erfundenen fehlenden Changelog-Einträge.

Repo-Basis vor diesem Update: `georg-doc/kayfabizarro@49e6256edf5f9bba6de0678953443f1faa7cf182`.

Gelesen: `skills/chat/town/START_HERE.md`, `skills/chat/town/LIVING_KFB_TOWN.md`, `skills/chat/SYNC_PROTOCOL.md`; aktueller Town-Verzeichnisstand und Git-Commit-Basis. Der bisherige Living-Blob `469106ba0e2c306b8dd8e6d259774774c8c6bf8a` wird als vollständiges Präfix bewahrt, einschließlich Tourbus-Ergänzung. Der bisherige Start-Blob `3f135910eda444df401dccfe5ce8d1031a88affa` bleibt als Präfix erhalten.

## Konkrete Spender, keine Integration-PASSes

- **Kayfabulation:** Nutzerpräzisierung r016 sowie mitgelieferter `KFB_TOURBUS_MEDIA_TRIPLETS_FRANKENSTEINING_v2.md`, 09.09.2026, Vorspann und §§16–18. Actor/POV, SHOW IT, SPIN IT, SELL IT und Quest/Endpanel bilden den vollständigen Bogen. Siehe vorhandenes [Tourbus-Addendum](../../masterplan/CHATTERBOX_TOURBUS_REUSE_2026-09-14.md). Drei angebotene Quests und Verfügbarkeit nach drei Scene Cards sind Georgs jetzige Anforderung, nicht hier an einem aktuellen Runner getestet.
- **NIE:** [dokumentierter Hook](../../../../overworld/docs/NIE_ADAPTER_HOOK.md), ausdrücklich nicht gebaut. Die gezielte KB-Auswahl und Indexangabe 220 Dateien stammen aus früheren S001-Quellenprüfungen. Kein neuer KB-Vollscan. Das genaue GitHub-Home aller Authoring-Module bleibt offen. r016 korrigiert die Auslegung von Therefore/But für neue Town-Inhalte, nicht rückwirkend fremde Originale.
- **Academy:** `travel/KFB Travel Combat v25/terrain-v25/academy-live.js` und `_handoff/BRIEF_Slice_Academy-SkyCards.md`, in S001 r014 gelesen. Render-to-Texture und UV-Eingabe sind dort Quellenbefund. Aktuelle Town-/Travel-Integration nicht getestet.
- **Boxel Blitz:** [README des v4-Exports](../../../../KFB%20Boxel%20Blitz/README.md) am obigen Repo-Pin in dieser Runde gelesen. Beschreibt Wurfmodell, Verformung und Oberflächen, nennt aber auch offene Kollisions-/Bumperarbeit und einen nicht funktionsfähigen damaligen Standalone. Kein Nachweis einer fertigen Dancing-Cube-Bühne. Quellname ist Boxel Blitz; „Voxel-Blitz“ bleibt ein Hinweis aus dem Gespräch, keine Repo-Umbenennung. Getrennte Voxel-World-/Dancing-Cubes-Quelle noch zu pinnen.
- **Town Workbench:** Georgs aktueller Bericht über World Scenery, Characters, Motions und Scene Tray. Gezielte Suche auf damaligem main hat den neuen Workbench-Stand nicht belegt. Kein Negativbeweis gegen einen parallel entstehenden Branch oder Build.
- **Travel:** Zielwunsch aus Georgs aktueller Nachricht; Consumer bleibt `georg-doc/KFB-Travel-Globe`. Diese Runde hat weder dessen neuesten Build noch Terrain-, Aurora- oder Wetter-Adaption getestet. Bestehender Einstieg: [Travel-Node](../../tool-nodes/travel-globe.md).
- **Characters/Animation:** bestehende ToolBox und Animation-Lab-Owner, [Animation-Node](../../tool-nodes/animation-lab.md). Frühere Tanz-/Gitarren-/Schaukampf-Deltas bleiben Anforderungen, nicht getestete Clips. `CANON_HOME_MAP.json` bleibt für ungelöste Authoring-Homes zuständig; keine Master kopiert.

## Clip-Aufzeichnung: begrenzte technische Quellenprüfung

Offizielle API-Referenzen am 15.09.2026 gelesen:

- https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream
- https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/isTypeSupported_static

Canvas-Aufnahme kann einen Videotrack liefern. Ein nicht origin-clean Canvas kann scheitern. MIME-/Codec-Unterstützung wird am Zielbrowser geprüft und ist selbst dann keine Ressourcen-/Aufnahmegarantie. Die vorgeschlagene Aufführung muss zusätzlich ihren Ton und eine tatsächlich erfassbare Blasendarstellung mitführen. Diese Quellen belegen keine Aufnahme fremder Plattform-Embeds und keinen hier gebauten Clip-Exporter.

## Schreibumfang und Abnahmegrenze

Nur `skills/chat/town/LIVING_KFB_TOWN.md`, `START_HERE.md`, `SESSION_CARD.md` und diese Quellennotiz gehören zum beauftragten öffentlichen Update. Kein globaler Router-/SOP-Umbau, kein Eingriff in fremde SSOTs, keine Assets/Schriften/Schlüssel, keine Runtime-Veröffentlichung. Eine Push-Quittung belegt den GitHub-Stand; Annahme und Integration bleiben in den Returns der Consumer zu bestätigen.
