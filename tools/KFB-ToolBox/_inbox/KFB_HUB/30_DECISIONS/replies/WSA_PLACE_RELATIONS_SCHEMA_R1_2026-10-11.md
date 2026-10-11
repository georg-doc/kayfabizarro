# WSA · Schema-Vorschlag Ortsbeziehungen R1 · 11.10.2026

**PROPOSAL / Steuerungsprüfung offen.** Georg fordert Beziehungen als importierbare Daten für Phase E/F. Keine Weg-, Rampen-, Dock- oder Strecken-Geometrie durch WSA. V-122, V-118, V-134 gelten; gewünschte Anschluss-Arten folgen V-099.

## Vertrag
[scene-study-v2.schema.json](WSA_PLACE_RELATIONS_SCHEMA_R1_2026-10-11/scene-study-v2.schema.json): JSON Schema Draft 2020-12. Version `kfb.scene-study/2` ist ein Vorschlag zur Weiterentwicklung des vorhandenen `sceneStudy`-Metadatenfeldes; kein zweiter Runtime-/Beziehungs-Owner. Der installierte v1-Editor wird durch diese Lieferung nicht umgestellt.

| Feld | Bedeutung |
|---|---|
| binding | `receiver-selected-world`: Empfänger wählt die konkrete vorhandene Welt, keine globale Suche nach gleichnamigen Orten |
| places[].id / island | Stabile Ort-ID und tatsächliche Insel-ID in dieser Welt |
| name / action | Ort und Tätigkeit, keine neue Lore-Abnahme |
| sourceObjectId / members | Vorhandenes Fokusobjekt und optionale zugehörige IDs, jeweils innerhalb derselben Insel auflösen |
| connections[].id / from / to | Stabile gerichtete Beziehung zwischen Ort-IDs; Rückverbindung ist eine eigene Beziehung |
| reason | Zweck der Verbindung |
| desiredAttachment.from / .to | Gewünschter Anschluss je Ende; `type` und vorhandene, insellokale `anchorId` |

## V-099 → vorgeschlagene Maschinenwerte
- `entry_exit_ramp`: Typ 1 Auf-/Abfahrt; Geometrie beim Track Core, EXIT/ENTRY nach V-118, J17-Look im Lab.
- `tunnel_with_surface_ramp`: Typ 2 Tunnel durch Insel plus Rampe zum Inselboden; V-113/Portal-/Nahtprüfungen bleiben Pflicht beim Lab/Core.
- `paternoster_platform`: Typ 3, **später**; Intent darf gespeichert werden, Ausführung bleibt DEFERRED. Keine Ersatz-Rampe erzeugen.
- `null`: Noch keine Entscheidung; kein Standardanschluss und kein automatisches Andocken. Fehlende `anchorId` ebenfalls `null`, niemals einen fiktiven Anker erfinden.

`dock` ist keine zusätzliche V-099-Anschluss-Art. Ein vorhandener Dock kann über seine echte Anker-ID adressiert werden; Eignung und Modul-Zuordnung prüft der Empfänger anhand des aktuellen MODULES.md. Anker-kind und Anschluss-type sind verschiedene Dinge. Keine erfundenen Modul-IDs oder Abmessungen im Paket.

## Importablauf für Lab E/F (Vorschlag, hier nicht implementiert)
1. JSON-Schema prüfen; unbekannte Felder einschließlich Geometrie, Asset-URL, Koordinaten und Material-/Paletten-Feldern ablehnen.
2. IDs in der ausgewählten Welt auflösen: Insel, Source-Objekt, Gruppenobjekte, End-Orte und Anker. Fremde/fehlende konkrete IDs sind Fehler; keine stille Zuordnung zur nächstgelegenen Insel.
3. Vorschau zeigt VALID_INTENT / UNRESOLVED / DEFERRED. `null`-Wünsche dürfen als offene Daten gespeichert werden. Vor einer Modul-Ausführung müssen beide Enden aufgelöst sein und der Lab/Core-Katalog sie unterstützen. Paternoster bleibt bis zur benannten Freigabe aufgeschoben.
4. Nach Georgs Importauswahl transaktional nach stabilen IDs aktualisieren; Konflikte mit anderem Fokus/anderer Insel sichtbar machen. Bestehende Geometrie, Transformationen, Figuren, Licht, Layout, Anchors und unrelated Weltfelder unverändert. Leeres Paket = keine Löschung. Löschen ist ein separater Editor-Vorgang.
5. Der Empfänger speichert im vorhandenen Welt-Owner. Modul-Katalog/Lückenliste nach V-134 und E/F führen Konstruktion, Naht-/Boden-/Freiraum-/Fahrtests aus. VALID_INTENT ist kein Build- oder Fahrbarkeits-PASS.

## Export und Belege
[existing-editor-relations.example.json](WSA_PLACE_RELATIONS_SCHEMA_R1_2026-10-11/existing-editor-relations.example.json) exportiert die tatsächlich getesteten v1-Beziehungen Wassermühle → Taverne; keine Behauptung eines kanonischen Protopia/Maker-Plans. Source-ID-Paare bleiben unverändert. Anschlusswünsche und Anker sind unbekannt, nicht geraten.
[attachment-types.example.json](WSA_PLACE_RELATIONS_SCHEMA_R1_2026-10-11/attachment-types.example.json) zeigt ausschließlich Schema-Syntax für Typ 1/2; **keine räumliche Empfehlung oder Georg-Entscheidung für diese Objekte**.
`export_v1.py` exportiert nur Metadaten aus dem bestehenden Welt-Dokument; Verbindungs-IDs sind ein stabiler Hash des gerichteten Endpunktpaars, unabhängig von Reihenfolge/Zweck. Nach dem ersten Import persistiert der Empfänger die IDs. Kein Welt-Dokument, Mesh oder private Medien im Export.
`validate_relations.py` ist ein offline Datenvalidator für den Vorschlag, kein Lab-Importer oder zweiter Runtime. `source-id-test-context.json` enthält nur tatsächliche Test-IDs. JSON-Schema-Metaprüfung und 15 Fälle PASS, dokumentiert in TEST_REPORT.json; v1-Export ebenfalls VALID_INTENT mit zwei offenen Enden. Cycles zulässig, Selbstverbindung und doppelte gerichtete Kanten abgelehnt.

## Entscheidung an Steuerung
Bitte Schema-Feldnamen/Version, Bindung an die ausgewählte Welt und die drei V-099-Maschinenwerte bestätigen oder an den bestehenden E/F-Vertrag anpassen. Danach liegt die Import-/Modul-Zuordnung beim Lab. Keine neue V-Nummer von WSA vergeben. Kein Golden, Merge oder neue Geometrie.
