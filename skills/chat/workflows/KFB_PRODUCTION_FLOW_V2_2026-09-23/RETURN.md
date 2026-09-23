# RETURN · KFB Production Flow v2 · 2026-09-23

Status: **CONTROL-PLANE CONSOLIDATION READY · NO PRODUCT RUNTIME CHANGE**

## Für Georg

Der neue Flow ist jetzt als eigener, sauberer Produktionsstrang vorbereitet.

Praktisch heißt das:
- Web hält nur noch Quellen, Zuständigkeiten und Pakete zusammen;
- Coworker darf echte Integrationen bauen;
- Claude Design bekommt zusammenhängende Produktionspakete statt loser Micro-Briefings;
- du bekommst ein brauchbares Artefakt als klickbaren Link und nicht jede technische Zwischenstufe;
- WSA bleibt Reserve für Dinge, die Coworker/Web wirklich nicht können.

## Repository

Repo:
`georg-doc/kayfabizarro`

Branch:
`chatgpt-web/production-flow-v2-consolidation-2026-09-23`

Draft PR:
`#191`

Verified PR/branch head before this Return update:
`a82b6f14e8a51436b5e057d7b6aecaa745bb53ef`

Base at branch creation:
`10f661a542e2553b4d3433bfc5b45dfc1401e660`

## Core files

- `START_HERE.md`
- `PRODUCTION_PACKET_TEMPLATE.md`
- `CLAUDE_COWORKER_ALIGNMENT.md`
- `COWORKER_ALIGNMENT_PROMPT.md`
- `CURRENT_LANES.md`
- `WSA_HANDOFF.md`
- `RECOVERY.md`
- `CHANGELOG.md`
- this Return

Global support:
- `skills/chat/HUMAN_READABLE_STATUS.md`
- `skills/chat/workflows/KFB_DESIGN_DONOR_LOCK_V1_2026-09-23/START_HERE.md`
- `MEASUREMENT_EVIDENCE_TEMPLATE.md`

## Donor Lock provenance

Copied byte-identically from PR #189:
- Design Donor Lock blob `5edf1ddb5b5754fc9c765cdaedcb9f0e64ded19c`
- Measurement Template blob `3f7f8bef6e654952b605e1846604bbc8c14b3985`

Curtain-specific rejected candidate remains on PR #189 as recovery/history.

## Current lane truth captured

### WorldBuilder
PR #186
Head:
`7267185cdbdc60e576b946ee589f0b2e932c8c8b`

R2 shared editor:
**HUMAN PASS**

Current next:
**WB2 terrain sculpting**

R3 uniform-size convenience:
optional/non-blocking.

### ToolBox
PR #185
Head:
`2833674b36be707fa4d14c8b532faee78ef3ba28`

Current:
source/Resident-set consolidation before broad Claude Design.

### Travel
PR #38
Head:
`1976c6c813161013b7c97bf5de55f71575a175ef`

Technical:
**119 PASS**

Current human choice:
240 / 320 / 400 ms double-Space window.

### Racer
PR #33
Head:
`f8f29f7b742e0b18fd9887398cd6bb4b7c320a32`

Runtime/test:
`b48ba46bb23e656cad968cb347bde7aa4bd445c4`

Technical:
**17/17 PASS**

Current:
R3c closed track body + rounded frames review.

### Curtain
PR #189
Head:
`dfd39255811e6f5b7cdde4092beb753d2b40713b`

Current:
D0 exact Theatre Curtain v1 donor restore only.

## Central routing updated

Updated on this branch:
- `skills/chat/START_HERE.md`
- `KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/START_HERE.md`
- `skills/chat/RECOVERY_PATH.md`
- `skills/chat/LIVING_MASTERPLAN.md`
- `kfb-hub/index.html`

Hub behavior:
- default Today uses explicit current KFB allowlist;
- default Briefings uses explicit current allowlist;
- older entries remain searchable;
- older briefing start text is marked reference-only;
- Production Flow v2 is the current briefing entry.

## Evidence

Product runtime tests from this process slice:
**0**

Hub JavaScript syntax compile:
**PASS**

Donor Lock copied byte-identically:
**PASS**

Cloudflare:
**0**

WSA/Work:
**0**

Merge:
**NO**

## Unresolved

- Coworker has not yet reviewed Production Flow v2.
- No first Production Packet has yet been selected/filled.
- Travel and Racer still have their current independent human gates.
- ToolBox current source truth still needs consolidation before broad Claude Design.
- Curtain still needs D0 donor restore.
- Current main may continue moving before merge; refresh/reconcile before merge.

## Exactly one next gate

**Claude Coworker reviews Production Flow v2 using `COWORKER_ALIGNMENT_PROMPT.md`.**

No product implementation in that review.

After alignment:
choose one first coherent Production Packet and route it to Coworker or Claude Design.


## Coworker alignment result

### Für Georg
Coworker bestätigt den neuen Ablauf grundsätzlich.

Sein wichtigster Einwand war richtig:
„geschlossenes Produktionspaket“ musste eindeutig definiert werden.

Das ist jetzt erledigt:
Ein Paket gilt nur als geschlossen, wenn Claude/Coworker nichts suchen, schätzen oder erraten müssen.

### Added
- `CLOSED_PACKET_CRITERIA.md`
- `EDITOR_SCALE_CONTRACT_NOTE.md`

### Important correction
Scale ist keine offene Speicher-/Datenfrage:
`kfb.scene-patch.v1` speichert Scale bereits.

Historisch fehlte Scale nur als sichtbare Bediengeste im S21-Menü.

### Production recommendation
Preferred first coherent packet:
**ToolBox**, after its real sources/Resident sets are consolidated.

No product implementation was started by this alignment.


## First productive packet prepared

### Für Georg
Das erste echte geschlossene Paket ist jetzt vorbereitet.

Es ist die ToolBox:
nicht als neuer Design-Versuch, sondern als source-sichere funktionale Konsolidierung.

Coworker bekommt:
- die echte Stage-First-Vorlage;
- den echten Studio-Figurenbestand;
- den aktuellen FrizzleBob;
- deine gespeicherten Cube-Pets;
- drei komplette Resident-Sets;
- den bereits akzeptierten gemeinsamen Editor;
- Save/Reload-Vertrag.

Er soll daraus **eine** zusammenhängende ToolBox-HTML bauen.

### Packet
`packets/TOOLBOX_SOURCE_SAFE_INTEGRATION_01.md`

Status:
`CLOSED_WITH_HUMAN_GATE`

### Coworker start
`packets/TOOLBOX_SOURCE_SAFE_INTEGRATION_01_COWORKER_START.md`

### WSA
No capability gap identified.
Coworker first.
