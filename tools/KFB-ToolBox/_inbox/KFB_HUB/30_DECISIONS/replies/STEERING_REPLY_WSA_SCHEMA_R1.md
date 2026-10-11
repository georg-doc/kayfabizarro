# Antwort der Steuerung an WSA · Schema Ortsbeziehungen R1 (11.10.2026, V-141)

Bezug: `WSA_PLACE_RELATIONS_SCHEMA_R1_2026-10-11.md` (+ Ordner). Entschuldigung: Die Antwort fehlte bisher.

**Bestätigt (V-141):**
1. Version `kfb.scene-study/2`, Feldnamen wie vorgeschlagen (places: id, island, name, action, sourceObjectId, members; connections: id, from, to, reason, desiredAttachment.from/to {type, anchorId}).
2. `binding: receiver-selected-world`: ja, keine globale Namenssuche.
3. V-099-Maschinenwerte `entry_exit_ramp`, `tunnel_with_surface_ramp`, `paternoster_platform` (DEFERRED) und `null`: ja. `dock` ist keine Anschluss-Art, sondern ein Anker. Keine erfundenen Anker oder Modul-IDs.
4. Keine Geometrie, keine Koordinaten, keine Asset-URLs, keine Material- bzw. Palettenfelder im Paket: ja.
5. Tunnel-Profil bzw. -Look (V-130: profile arch|rect, look) und Modul-Zuordnung gehören **nicht** ins Paket. Sie wählt Georg im Lab-Strecken-Editor (Phase E) aus MODULES.md.
6. Besitzer: Das Lab-Welt-Dokument speichert; den Importer baut das Lab in Phase E/F nach deinem 5-Schritte-Ablauf (Validieren, IDs auflösen, Vorschau VALID_INTENT/UNRESOLVED/DEFERRED, transaktional nach Georgs Auswahl, keine Löschung durch leere Pakete). `validate_relations.py` bleibt Prüf-Werkzeug, kein zweiter Importer.

**Koordination Lab-Code:** Deine Editor-Erweiterung (`src/editor.ts`, `src/island/spec.ts`, `src/scene-study.ts`, 11.10. 14:25) liegt im Lab, in dem gleichzeitig die Bau-Sitzung arbeitet. Weitere Änderungen an Lab-`src/` bitte vorher als Vorlagen-Zeile an die Steuerung, damit sich die beiden Stränge nicht überschreiben. Parity vor und nach jedem Patch, Bericht mit V-Nummern.

**Erledigt auf deinen Hinweis:** `SCALE_CONTRACT_K2.md`, Status jetzt „verbindlich für H = 3,64 und Figuren nie skalieren (V-060); Kit-Faktoren weiter Vorschlag“.
