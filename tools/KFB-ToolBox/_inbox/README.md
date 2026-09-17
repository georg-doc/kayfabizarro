# ToolBox · Eingang

Ein aktiver Job = ein vollständiger Ordner: `_inbox/<job-id>/`. Originale, Briefing, Source-Manifest, Screenshots/QA soweit nötig und Return-Verweise zusammenhalten. Vorlage: [JOB_START](../templates/JOB_START.md).

Status mindestens: RECEIVED → REVIEWED → ACCEPTED/DEFERRED → ARCHIVED. Annahme eines Inputs ist keine Tool-Abnahme. Namen und Source-Pins nicht aus Dateinamensnummern erraten.

Dieses Repo ist öffentlich. Private Koordination gehört in die private Production-Inbox, sobald sie verfügbar/autorisiert ist; hier nur freigegebene Inputs oder sichere Verweise. Keine Tokens/privaten Vollberichte/Font-Binaries. Fehlender zentraler Inbox-Zugriff blockiert erlaubte lokale ToolBox-Arbeit nicht.

Bearbeitete Jobs erst nach angenommenem Ergebnis und aktualisierten Ziel-/Return-Pointern vollständig nach `archiv/<job-id>/` verschieben. Nicht den bestehenden Source-Export einsammeln oder ungefragt umräumen. ToolBox-Eingang ist niemals automatisch der Implementation-Owner des Consumers.

## Aktueller Arbeitscursor · 2026-09-17

### FrankenStein Studio v18 · Birthday Actor Handoff

**CURRENT UPLOAD:** `KFB FrankenStein Studio (7).zip`

- Git blob: `4ea1ead8919b02b7a9a09f7683d3252f548b31d9`
- Größe: `4,994,864` B
- Upload-Commit: `79c5799afd185693f245755f19de2abb44d42452`
- Status: `CURRENT STUDIO WIP / BIRTHDAY CONSUMER HANDOFF SOURCE`
- Session-reported Inhalt: `V18_BIRTHDAY_CONSUMER_RETURN.md` plus exportierte `profiles/kfb-pet-gothgirl.json` und `profiles/kfb-pet-hihi.json`.
- Binär-ZIP-Inhalt ist über den GitHub-Connector nicht direkt lesbar; Blob/Größe/Commit sind repo-verifiziert.

**SUPERSEDED WIP UPLOADS · absichtlich nicht verschoben (große Binärdateien):**

- `KFB FrankenStein Studio (6).zip` · blob `1a9bfbd52150926c373f062c6388261959f7ad2a`
- `KFB FrankenStein Studio v18.zip` · blob `bf26e92f90804b87b01f6c6d6106f5430f9c4cec`

Diese Dateien bleiben zur Provenienz unverändert liegen. **Nicht** aus `(6)`, `(7)` oder `v18` eine Revisionsreihenfolge ableiten; der CURRENT-Pin oben entscheidet.

### Atlas Intake · REVIEWED

- `KayKit Resident Atlas/` — vollständiger `KFB_Resident_Atlas_S6`-Export; 21 Residents + Ensemble, datengetriebene Vignetten/Signature-Props, GitHub-first Assetpfade. Originalexport bleibt Intake/Provenienz.
- `KayKit Environment Atlas/KFB_World_Atlas_v1_EXPORT_2026-09-17/` — vollständiger `KayKit Atlas Preflight Access` / `KFB Kit Lab`-Export; 15 Seiten mit Road, Forest, Hex S11/S12, Dungeon Model S13 und `Dungeon_Generator_S13_2`.
- Intake-Review: `../_handover/ATLAS_INTAKE_2026-09-17/START_HERE.md`.
- Site-Promotion: Branch `atlas/site-promotion-recovery-2026-09-17`; candidate routes `/resident-atlas-s6/` und `/world-atlas/`.
- Asset-Regel: existiert ein benötigtes Asset in GitHub, bleibt GitHub die Quelle. Keine zweite Modellablage in Atlas/ToolBox anlegen.
- Offene Promotion-Lücke: einige Runtime-Assetpfade der Exporte verwenden noch `main`; feste Revisionspins gehören in eine spätere promoted revision, nicht in den unveränderten Intake.
- REVIEWED bedeutet Source/Struktur geprüft; keine Travel-, Animation- oder Consumer-L5-Abnahme.

### Weitere aktive Eingänge

- `KFB World Design · Setup Pass.dc.html` — aktueller reconciled World-/Fable-Setup-Stand.
- `KFB Asset Librarian · Visual Scene Atlas Preflight.md` — Herkunft/Preflight; der konkrete Resident-/Environment-Atlas-Source ist inzwischen zusätzlich eingetroffen.
- `KFB Elisa B-Day Reference+Mockups/` — aktive Birthday-Kompositions-/Referenzquellen.
- `ACCEPTANCE_COMPLETENESS_ADDENDUM_2026-09-15.md` — weiterhin Proposal/Acceptance-Referenz; nicht archiviert.

## Benennung ab jetzt

Für neue manuell hochgeladene Arbeitsstände möglichst keine Browser-Suffixe wie `(7)` als semantische Version verwenden. Bevorzugt z. B.:

`KFB FrankenStein Studio v18 Birthday Consumer 2026-09-16.zip`

Bereits gepinnte große Uploads werden **nicht nachträglich umbenannt**, wenn dadurch Handoff-Pfade und Provenienz auseinanderlaufen würden.
