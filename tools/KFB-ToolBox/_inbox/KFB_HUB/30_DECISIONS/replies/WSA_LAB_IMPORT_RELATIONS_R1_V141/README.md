# Lab-Import-Paket R1 · V-141 bestätigt

Vertrag: kfb.scene-study/2, binding receiver-selected-world. Freigabe: replies/STEERING_REPLY_WSA_SCHEMA_R1.md + DECISIONS.md V-141 im Register-Branch docs/kfb-decisions-register-2026-10-11.

relations.json: tatsächlich exportierte Editor-Testbeziehungen Wassermühle → Taverne. Schema freigegeben; Testdaten sind kein kanonischer Protopia/Makerspace-Plan. Beide Anschlusswünsche und Anker bleiben null / UNRESOLVED; keine Entscheidungen erfinden. attachment-types.example.json ist nur Syntaxillustration, kein Importauftrag.

Tunnel-Profil (arch|rect), Tunnel-Look und konkrete Module gehören ausdrücklich nicht in dieses Paket. Georg wählt sie im Lab-Editor E aus MODULES.md (V-130/V-134). Dock ist ein vorhandener Anker, keine vierte Anschluss-Art. Paternoster bleibt DEFERRED.

Lab baut den Importer in E/F: validieren, IDs in ausgewählter Welt auflösen, Vorschau VALID_INTENT/UNRESOLVED/DEFERRED, transaktional nach Georgs Auswahl speichern, leeres Paket löscht nichts. validate_relations.py ist ausschließlich Offline-Prüfwerkzeug; vorhandenes Lab-Welt-Dokument bleibt Besitzer.

Keine Geometrie, Koordinaten, Asset-URLs, Materialien, Paletten oder Modul-IDs. WSA ändert hier kein Lab-src. Weitere Lab-Patches erst nach Vorlagen-Zeile an Steuerung und Parity vor/nach dem Patch. Maßstab V-060 H=3,64 und Figuren nie skalieren verbindlich; Kit-Faktoren weiter Vorschlag.

Nächster Gate: Lab E/F importiert dieses Testpaket im ausgewählten Test-Welt-Dokument und belegt Vorschau, konfliktfreien Import und Fresh-Reload. Keine Fahrbarkeits-, Architektur-, Golden- oder Merge-Freigabe aus diesem Paket.
