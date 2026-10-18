# WSA · Lady Dory Webchat-Test + externe 3D-Suche R2
18.10.2026 · Owner: bestehende Asset Library / KFB Triplets 0.4.0

## Ergebnis
Lady Dorys aktuelles Blatt wurde am Register-Snapshot 4908ef44a0f0c0f606cfdba7ad402f916a9042d7 gelesen, mit META_NARRATIVE_R1 und Quellenregister abgeglichen. Das neue Scenelet **„Das Protokoll der Barmherzigkeit“** bleibt vollständig DESIGN. Dory will dem Spieler helfen, verlangt dafür zunächst ein moralisch makelloses Ausnahmeformular und muss ihren eigenen Kontrollanspruch erkennen. Fünf kausale Beats, drei Spielerreaktionen, räumliches Blocking und offene Produktionspunkte. Keine Kanonentscheidung, keine neuen Assets oder Runtime-Verweise.

GitHub-Speichern geschah über native Werkzeuge nach dem veröffentlichten Plugin-Vertrag, ohne Work-/CLI-Schritt für den Inhaltsvorschlag. Dieser Test lief im bestehenden Codex-Chat; ein frischer ChatGPT-Webchat wurde damit nicht separat simuliert. Die Site-Implementierung und Veröffentlichung der Suchkorrektur ist davon getrennte Entwicklungsarbeit.

## Dory: tatsächlich gesichert
- Repo: georg-doc/kayfabizarro.
- Base/Register: docs/kfb-decisions-register-2026-10-11 @ 4908ef44a0f0c0f606cfdba7ad402f916a9042d7.
- Vorschlagsbranch: scenes/edit-lady_dory_mercy_protocol-2026-10-18-c1da80f431ea498397a9c511.
- Head: 1f7f6fd3f1b3630cd19e347d127e1d15012db678.
- Genau zwei hinzugefügte Dateien: WEBCHAT_AUTHORING_R1/scenelets/lady_dory_mercy_protocol.scenelet.json und WEBCHAT_AUTHORING_R1/proposals/lady_dory_mercy_protocol_2026_10_18_c1da80f431ea498397a9c511.proposal.json unter replies/.
- Null bestehende Dateien geändert. Dorys Figurenblatt und Figurenkarte bleiben unverändert. Rollen- und Farbkonflikte sowie offene UFO-Verbindungs-/Ortsfragen bleiben ausdrücklich sichtbar.
- Branch create-only; Rücklesen vor Write, Commit/Parent/Tree geprüft, erwarteter Branch-Head bei Update; kein force, kein Merge. Beide Dateien vollständig gleich rückgelesen, Compare bestätigt genau zwei additions und keine deletions.
- Site-Vorschlag: https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=dramatis-personae&proposalRef=scenes%2Fedit-lady_dory_mercy_protocol-2026-10-18-c1da80f431ea498397a9c511&character=lady_dory
- Browser lokal gegen echte GitHub-Reads: Vorschlag @1f7f6fd3 als „nicht übernommen“, Scenelets/Dioramen-Tab zeigt Titel, DESIGN, alle Beats, Quellen und Konflikte. 3D bleibt gesperrt. Kein erneutes Site-Publishing für diesen normalen Inhalt nötig.

## Suchkorrektur auf bestehender Site v18 veröffentlicht
- https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=external-search
- Projekt: appgprj_6ac1afef08148191b62b95f184bf845e; gleicher privater Zugriffskreis.
- Version 18: appgprj_6ac1afef08148191b62b95f184bf845e~appgver_c84009b5e4e0819183acf2ba48968690.
- Sites Source: 7d1a363c7f2aaafea6e8e925d3b5c47b631fa345.
- Deployment: appgdep_6ad4146551748191b535157894fac4af · succeeded.
- Tar SHA256: 60a5eac58961b5f53ec4cdbd95729454bb923fdd18871e07d93297a101e2c184; native gespeicherte Dateimenge 39 Dateien / 7.055.360 Bytes. Native Version/Source rückgelesen.

Die alte Oberfläche forderte einmal limit=36 an, ohne offset. Jetzt: Quellen einzeln paginieren, eigene Cursor, maximal drei gleichzeitige Anfragen; 36 sichtbare Karten pro Anzeige-Schritt, weitere gepufferte Treffer ohne neue Abfrage. Danach „Search deeper / retry sources“ für weitere Quellen-Batches. Bewusst ein bedienbarer Nachlade-Knopf statt unbegrenzter automatischer Netzabfragen.

36 shown / N unique candidates loaded unterscheidet Anzeige und bereits geladene eindeutige Kandidaten. Keine erfundene globale Gesamtzahl: Quellzahlen sind separat beschriftete Provider-Angaben und können andere Typen/ungefilterte Einträge einschließen. Dubletten per exakter Asset-ID. Fehler bleiben sichtbar im Quellenbericht; fehlgeschlagene Quellen behalten ihren Cursor für Retry. Alte Suchen werden abgebrochen und dürfen neue Resultate nicht ersetzen. Filterwechsel starten neu; nur Modellquellen im Dropdown. Reported free only verlangt explizite Gratis-Angabe; unbekannte Preise nicht mehr als gratis behandelt. Direct download meint technischen Direktdownload, keine Lizenzfreigabe. Intake-/Registry-Grenze unverändert.

Technische Paging-Gründe: Upstream limit schneidet die zusammengeführte Liste ab, offset gilt jedoch pro Quelle. Daher keine pauschale All-source offset+=36-Lösung. Seite 24 als gemeinsame Basis; 3DTexel kürzt am nativen 50er-Rand, Textures.com am 200er-Rand. Keine Trefferverluste durch das Überspringen dieser Ränder. Wiederholte Seiten und FreeStylized-100er-Grenze werden als Suchdienst-Grenze markiert, nicht als vollständig durchsuchter Katalog.

Primärquellen: https://3d.shep.bot/openapi.json und https://github.com/arielshad/3d-asset-server/blob/53bbf8977101fb601ad77817a98f34f5ce231e2a/src/core/service.ts sowie Provider-Adapter auf demselben Commit. Upstream-Grenzen bleiben: einzelne Adapter (u.a. itch.io, FreeStylized, Textures.com) erlauben keine garantierte vollständige Katalog-Abdeckung. Quell-Suchlinks bleiben der Weiterweg. Kein gescrapter Ersatzdienst, keine neue Integration.

## Tatsächliche Prüfungen
- 7/7 gezielte Node-Tests PASS, unabhängig wiederholt: unabhängige Provider-Cursor >36, 50/200er-Ränder, Retry gleicher Offset, kurze/leere Filterseiten, strikte Gratis-/Direktdownload-Angaben, alte Abfragen, Doppelklick/Dubletten, vollständiges Controller-Rendering und Event-Bindung.
- Unabhängige Kritik/Guard: CONTINUE, keine verbleibenden Blocker. Dory-Compare und Quellenabgleich unabhängig bestätigt.
- Echte öffentliche API: Poly Haven „tree“ = 24 + 6 unterschiedliche, Quellangabe30; Sketchfab24+24 unterschiedliche; Kenney2. Keine Registry-Änderung.
- Lokaler Browser mit echten Quellen: Sketchfab24 →48 eindeutige Treffer; alle22Modellquellen geprüft, 193 eindeutige Kandidaten geladen; Anzeige36 →72 per Knopf ohne weitere Netzabfrage. Filterwechsel und Vorschlagsansicht geprüft.
- Belege: proofs/search-48-local.png, proofs/search-72-local.png, proofs/dory-scenelet-local.png. Dies sind lokale Browserbelege. Native Veröffentlichung bestätigt; die private Hostansicht ist im verfügbaren In-App-Browser weiter durch die Anmeldung begrenzt, daher keine visuelle Host-Abnahme behauptet.

## Offenes / eine nächste Übernahme
WS0 prüft Dorys DESIGN-Vorschlag und übernimmt ihn bei Freigabe. Kein automatischer Merge, keine Änderung von Dorys bestehenden Werten, keine Aufhebung der 3D-Sperre. Die veröffentlichte Suchkorrektur und dieser Return liegen zusätzlich auf einem separaten WSA-Reviewbranch; ToolBox v11 / direkter Site-GitHub-Speicherblock bleiben außerhalb dieses Jobs unverändert.
