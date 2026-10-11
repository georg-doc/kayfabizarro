# WSA · Vorlage zuerst · Editor-Regeln R1

Georg autorisiert am 11.10.2026: belegte Regeln in bestehenden Archipel-/Insel-Editor-Ablauf übertragen; echte Donoren, keine Asset-Sammlung, kein Golden/Merge.

Vorlage: bestehender Lab-Editor src/editor.ts + world version1 / src/island/spec.ts, three r186. Bestehende Auswahl, TransformControls, Save/Import/Reload, Terrain- und Licht-Owner bleiben. Neu: optionale Handlungsort-/Beziehungsdaten im bestehenden Welt-Dokument und deren Authoring/Fehlerprüfung. Grund: bisher speichert der Editor Objekte ohne gemeinsamen Zweck. Kein automatischer Szene-/Straßenbau, keine Figuren-Skalierung, keine kopierte Palette oder Lichtverwaltung.

Quellen: scene-study A/B/C/D, Stand bee3b9cdcfe4a30f9ac557d7168faaca87c7195b. Prüfung mit echten KayKit-Wassermühlen-/Tavernen-Instanzen; Testwelt ist kein neuer Architekturentwurf. Phase D bleibt ganze Demo-Szenen, nicht Einzelform-/Asset-Ersatz. Diese Erweiterung wird vor Installation als isolierter Patch geprüft.
