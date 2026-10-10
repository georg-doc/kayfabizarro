# RETURN · G4 Stair Reference R1 · 2026-10-10

## R3 Handoff Checkpoint · verified documents, no R3 build yet

- **[WORK_START_R3.md](WORK_START_R3.md)**: kurzer WSA-Einstieg.
- **[BRIEF_WSA_G4_FORM_DESIGN_R3_2026-10-11.md](BRIEF_WSA_G4_FORM_DESIGN_R3_2026-10-11.md)**: vollständiger neu autorisierter Form- und Testauftrag.
- **[TEST_BRIEF_WSA_G4_FORM_R3.md](TEST_BRIEF_WSA_G4_FORM_R3.md)**: ursprüngliche 17/19 Textmatcher und explizite Korrektur zweier falscher exakter String-Matches; final **19/19 inhaltliche Quellen-/Briefprüfungen PASS**. Nicht mit ausführbaren Modelltests verwechseln.
- R1/R2 GLB und Bildvergleiche bleiben auf separatem WSA-Branch. R3 Kandidatenbranch noch nicht erzeugt. Aktuelles privates Plugin v0.1.0 ist unverändert; ein Plugin-Update hängt **ausdrücklich vom unabhängigen R3-Form-Ergebnis** ab, sonst nur Update-Handoff/kein behaupteter Erfolg.

## Additive R3 · 2026-10-11 · Formorientierter WSA-Auftrag vorbereitet

Georg erhält R1/R2 als technische Treppenalternativen. Für die Burgtreppe ist ein neuer sichtbarer Architekturentwurf erforderlich. Die jüngste WSA-Treppe R2 auf `wsa/kfb-modelling-test-stairs-2026-10-10@52099710569a98393325ee94becf616f418b35f2` hat höhere Endkörper, aber weiterhin keilförmige Wangen und keine klar lesbaren Pfeiler mit Sockel, Schaft und Deckstein. Der Source-Code und Vergleichsbilder wurden geprüft.

Der neue [WSA-R3-Brief](BRIEF_WSA_G4_FORM_DESIGN_R3_2026-10-11.md) verlangt neutrale Silhouettenbelege **vor** Materialarbeiten. Sechs Bauformfamilien sind ausdrücklich keine Sechs-Mesh-Grenze. Technische Begehbarkeit und acht Stufen bleiben Vergleichsmaßstab, die sichtbare Konstruktion darf neu modelliert werden. `PARTS.md`, `PROMPT.md` und `RECOVERY_G4.md` weisen auf die geänderte Regel hin; alte Quellobjekte bleiben erhalten.

Das bestehende private Asset Scene Composer Plugin wird erst nach einem unabhängig belegten R3-Ergebnis aktualisiert: PASS lehrt bewährte Formgrammatik, FAIL den nachgewiesenen Fehler und die Vorsperre. Ohne unabhängig überprüftes Ergebnis bleibt das Plugin unverändert. Keine 3D-R3-Implementierung, kein Golden, Merge oder Site-Deployment durch diese Vorbereitung.

**Ein nächstes Gate:** WSA zeigt die echten Donoren und eine neue neutrale Formansicht mit gebauten Wangen und zwei klaren Abschlusspfeilern.

**Outcome:** Actual WSA staircase source found and visually inspected; two illustrative KFB-style drafts produced but neither source-faithful; failure/export recorded; exact source-led followup specified.
**Owner:** Existing WSA/KFB Island Worldbuilder Lab G4 stairs, no new runtime owner.
**Repo:** `georg-doc/kayfabizarro`.
**Working branch:** `planning/kfb-g4-stairs-reference-2026-10-10` (branched from `wsa/kfb-modelling-test-stairs-2026-10-10@f954817c97e368099b5e8aa8d6fce35cc9da94d8`). PR none.
**Original GLB:** `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/WSA_modelling_test/KFB_TOWN_CASTLE_CLAY_STAIRS_R1.glb`, y-up, five meshes, 4,568 triangles, WSA SHA256 `5dc83f19beb8b8ba6b20b3b7ae1d19c6a39b8b80045cda14376ae462e4729151`. WSA numeric checks pass, external critic pending.
**Source proof:** true GitHub WSA 3/4 and hill-connection render pixels inspected, plus source lineup. No source geometry changed.
**Design studies:** two 1536×1024 KFB clay illustration boards, both `STYLE_DIRECTION_ONLY`; form fidelity 0/2 and after 2 non-improving passes stopped. No Golden / model approval. Both PNGs reside in user-visible chat ZIP `KFB_G4_STAIRS_VISUAL_REFERENCE_R1_2026-10-10.zip` (4,215,063 bytes; SHA256 `dbb07487e0a8837b043f139be9115033f4073d1e599073bc55a330f1f53e4e75`), **NOT GitHub**.
**Changed reference files:** `PARTS.md`, `PROMPT.md`, `RECOVERY_G4.md`, `RETURN_G4.md`, `CHANGELOG_G4.md`; see source branch for actual model files and WSA render receipts.
**Tests:** ZIP CRC PASS, both PNGs verified as 1536×1024 RGB and checksummed; no independent image-generation source fidelity PASS; actual WSA source was not re-built or altered. No browser/Site tests; Stage unneeded for this visual research.
**Next gate:** WSA owner renders the exact current mesh with KFB claystone/material/surface treatment and new before/after source geometry proof, preserving five-mesh anatomy and eight steps, then external visual critic and Georg human styling choice. No auto-merge or Live.
