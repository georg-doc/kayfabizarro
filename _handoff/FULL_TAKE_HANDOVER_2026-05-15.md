# Full-Take Handover, 2026-05-15

*Forward-looking handover für Vault, Archive, Rulebook, kayfabizarro.pages.dev-Integration. Companion zum Session-Cut vom selben Datum.*

## Übersicht

Vier parallele tracks, eine kritische Pfadlinie. Track-Reihenfolge nach Dependency:

1. **Rulebook** → erste Production-Welle, blockiert Track 4
2. **kayfabizarro.pages.dev Integration** → blockiert Persona-Sim
3. **Vault** → laufende Quelle, parallel zu allem
4. **Archive** → Reference-Korpus für Sessions 3 und 5, kein eigenständiger Sprint

---

## Track 1, Rulebook, State + Next Moves

### State 2026-05-15

Canonical SSOTs (alle als MD-Directive-Syntax unter `RULES & HUB/content/`):

| File | Lines | State |
|---|---|---|
| `med-en.md` | 291 | Final v1.4-draft. Modes neu (Morning Report / Heel Turn / Hand-Off / Plain Speak / The Real Question / Attending AWOL), Feynman-bar in What-it-is, 6 add-ons, FAQ + Hints + Disclaimer. 0 em-dashes, object-agency-clean. |
| `med-de.md` | 291 | Final v1.0-draft, eigenständig DE-geschrieben. Modes: Morgenvisite / Querschläger / Übergabe / Klartext / Die echte Frage / Oberarzt-Pause. *"Stinknormale Würfel"*, *"alles erlaubt, aber bitte keine Zähne"* verbatim. 0 em-dashes. |
| `kfb-en.md` | nicht existent | Queued nach Persona-Sim. Wird mit Persona-Daten informiert geschrieben statt blind. |
| `kfb-de.md` | nicht existent | Queued mit kfb-en, eigenständig DE. |

Existing in-HTML (zu ersetzen):
- `index.html` v1.3 in `RULES & HUB/index.html` (126 KB monolith). MED EN sections inline geschrieben, MED DE sections nur Skeleton (3 von ~15 sections existieren). KFB EN/DE komplett inline.

### Directive-Syntax (12 block types)

`:::note`, `:::pdf-viewer`, `:::rules`, `:::steps`, `:::step-card`, `:::ritual`, `:::modes`, `:::quote`, `:::quest-strip`, `:::ref-table`, `:::dosay`, `:::socials`, `:::sub-section`. Vollständige Mapping-Tabelle zu HTML-classes im Sonnet-Sprint-Handoff #2.

### Next Moves (sequence)

1. **Sonnet-Sprint #2 (Rules-Hub-Integration)**, dispatch jetzt. Inputs: med-en.md + med-de.md (direct upload, NICHT via GitHub-URL, claude.ai-web-chat liest MDs als attachments), aktueller index.html. Output: index.html v1.4 mit MED EN/DE wholesale-replaced + version-bump + final-object-agency-scan. **File**: `RULES & HUB/_handoff/SONNET_RULES_HUB_INTEGRATION_2026-05-15.md`.
2. **Sonnet-Sprint #1 (LP-Slop-Fixes)**, dispatch NACH Sprint #2 (Sprint #2 ersetzt MED-sections wholesale, viele Sprint-#1-fixes sind in den MDs schon eliminiert). Sprint #1 fokussiert auf KFB sections + LP-residuals. **File**: `KAYFABIZARRO WORKSPACE/_handoff/SONNET_SPRINT_LP_RULES_FIXES_2026-05-15.md`.
3. **KFB EN didactic-pass + KFB DE eigenständig**, queued nach Persona-Sim-Synthese, damit KFB-arbeit informed ist. Folgt selbem Mode-Naming-System (oder neuer abgeleitet aus Persona-Sim-findings).
4. **MD-zu-HTML-Renderer**, Parking-Lot. Wenn Production-Volume groß genug: ein 100-zeilen-Python-script ersetzt manuelle Translation. Aktuell macht Sonnet die Translation per Hand pro Sprint.

### Open Decisions

- **Demo-deck direct-download URLs** (Protopia + Cardiology web-compressed), von Georg zu liefern.
- **Bernd-Klausel-Verifikation** für Bernd-imagery in product-material, Visual-Einsatz Grauzone, textuelle Lineage-Referenz safe.

---

## Track 2, kayfabizarro.pages.dev Integration

### State

- Live-deployment via Cloudflare Pages, Source in `RULES & HUB/` (git-versioned, wrangler.jsonc deploy-config).
- Mirror: `https://georg-doc.github.io/kayfabizarro/` (GitHub Pages).
- Rule-book PDFs liegen unter `raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/`.
- Custom-domain TBD (kayfabizarro.pages.dev bleibt vorerst Primärziel).

### Critical Path

1. **Track-1-Sprint-#2 ausgeführt** → index.html v1.4 deployed.
2. **Demo-decks direct-download** → Protopia + Cardiology web-compressed PDFs in `RULES & HUB/media/` einchecken, Pfade in v1.4 ersetzen die Gumroad-Buttons.
3. **Persona-Simulation-Phase-3** → neuer Sonnet-Chat crawlt die deployed v1.4-site, fetcht 2 YouTube-Videos + 2 Rule-Book-PDFs + 2 Demo-Deck-PDFs, läuft 14 Persona-Simulationen.
4. **Persona-Synthese-Phase-4** → hier (Opus), pattern-recognition über alle 14, Polish-Sprint-Definition.
5. **Sonnet-Polish-Sprint** → Polish-Sprint-Changes in v1.4 → v1.5.

### Dependencies + Blockers

- Track-1-Sprint-#2 blockiert alles unter Persona-Sim (live-site muss aktuell sein bevor crawler reingeht).
- Demo-deck-URLs blockieren Sprint-#2-Acceptance (Gumroad-Fallback temporär OK, aber Persona-Sim braucht direct-download für authentic funnel).
- Persona-Briefcards (Phase-2-Output, hier zu produzieren) blockieren Phase-3-Start.

### File-Pointers

- Sonnet-Sprint-#2-Handoff: `RULES & HUB/_handoff/SONNET_RULES_HUB_INTEGRATION_2026-05-15.md`
- Persona-Briefcards (TBD): `RULES & HUB/_persona-sim/persona_briefcards.md`
- Simulation-Prompt (TBD): `RULES & HUB/_persona-sim/SIMULATION_PROMPT.md`

---

## Track 3, Vault, State

`/CLAUDE/gvw/VaultGvW/` ist Master-Archiv. Bekannte Subfolder:

| Folder | Inhalt | Marketing-Chat-Relevanz |
|---|---|---|
| `_archive`, `_inbox`, `_private`, `_shared` | Generic-Archive | Indirekt |
| `audio` | Audio-Quellen | Suno-Pipeline-Future (Wave-3-Skill) |
| `brushes` | Procreate-Brushes | Cross-Sell-Asset, Persona-Sim-Relevant (Procreate-Customer-Persona) |
| `cancel_this_planet` | Vermutlich CancelThisComic-related | Substack-Reference-Material |
| `doccheck` | DocCheck-Material | Out-of-scope hier |
| `kayfabizarro` | Kayfabizarro-Working-Material | Kern-Reference für Marketing-Sessions |
| `meta`, `reflexion` | Author-Meta-Material | Graf-Georg-Voice-Reference (Session 5) |
| `projects`, `publications` | Projekt-Drafts | Track für Erlangen-Material |
| `skizzen` | Zeichnungen | P1-Asset-Bridge (Process-Evidence) |
| `sources` | Source-Material | Render-bait-Skill-Future |
| `substack` | Substack-Source-Drafts | Reference für Sessions 2-4 (Substack-Reference-Posts) |

`frizzlebob_inbox_briefing.md` und `inventory_prompt.md` liegen im Root, vermutlich Process-Anchors.

### Vault-Usage-Pattern (festgehalten)

- **Nicht bulk-explore**. Gezielt navigieren wenn Session konkretes Material braucht.
- **Substack-Reference-Posts (Session 2-4)**: `VaultGvW/substack/` als erste Anlaufstelle für draft-material und voice-pattern-evidence.
- **Sessions 6-7 (Erlangen-Workshop)**: `VaultGvW/projects/` und `VaultGvW/publications/` checken auf vorhandene Workshop-Drafts.
- **Session 5 (Graf-Georg-Skill)**: `VaultGvW/meta/` und `VaultGvW/reflexion/` für Graf-Georg-Voice-Evidence neben dem 705-zeiler LORIOT-source.

### Open Question

- **Vault-Folder-Ownership-Model**: schreibt der Coworker direkt in Vault-Folder, oder bleibt Vault read-only und alle Coworker-Outputs gehen in dedicated working-folders? Per aktuellem Memory-Vertrag: Vault = SSOT-Archive, Marketing-Working-Outputs gehen in `MARKETING & FRIZZLEBOB/` oder `RULES & HUB/content/`. Bestätigen wenn anders.

---

## Track 4, Archive (FrizzleBob Substack 217 Posts + 200+ Suno Catalog)

### State

`/CLAUDE/gvw/FrizzleBob/`:
- `README.md` deklariert Folder als FrizzleBob-voice-coded
- `cancel/` enthält 217 HTML-Files (Substack-Export, git-synced)
- README erwähnt 200+ Suno-Songs via DistroKid distribuiert, YouTube-Playlist "FrizzleBob the Fixer" (Claymation), HeyGen-Avatar-Prompts, Suno-Optimized GPT Instructions v1.0

### Usage als Reference-Corpus (NICHT als Content-Pool)

- **Session 3 (Cancellation-Arc-Postmortem)**: das Archiv IST die Origin-Story. 2-3 representative posts zitieren, live-Substack-URLs als Anker. Beispiele: `148595... the-blobs-carnival-awakening`, `148629998.uncle-frizzlebobs-letter-from-protopia`, `149640781.hilfe-ich-bin-ein-mensch`, `150271494.wtf-is-cancel-this-comic-intro-podcast`.
- **Session 5 (v1.2-Bibel)**: 5-10 posts pattern-mining-pass, was funktionierte vs was war GPT-overwhelmed. Empirische Evidenz > theoretische Regeln. Slop-Patterns aus dem Archive werden negativ-trainings-set für v1.2.
- **Wave-3 FrizzleTunes-Skill (post-Erlangen)**: 200+ Suno-Catalog als Empirie-Basis. Mining-Pipeline: Suno-Style-Prompts + Carrier-Waves + Voice-Tags pattern-extrahieren, Skill aus observed patterns bauen statt greenfield.

### Historische Masken im Archive (nicht im 7-Mode-FrizzleBob-Skill)

- Lord QuantumFluff
- Fidibus
- Silicone Klown Kings
- Über-Rabbit
- the Blob
- Klown Kabal

Triage-Status für v1.2-Bibel: abandoned mask-experimente / sub-personas zu inventarisieren / one-offs. Entscheidung in Session 5.

### Open Question

- **Suno-Catalog-Inventur**: liegen Source-Lyrics der 200+ Songs lokal (Drobox / Vault / anderswo) oder nur als deployed Audio bei DistroKid+Spotify? Bestimmt ob FrizzleTunes-Skill Mining direkt machbar ist oder Audio-Transcription nötig.

---

## Critical Path Zusammenfassung

```
[Sprint #2 Rules-Hub-Integration]  
        ↓
[Demo-deck-URLs liefern]  →  [v1.4 deployed]
        ↓
[Persona-Briefcards hier]  →  [Sonnet sim-chat crawl]
        ↓
[Persona-Synthese hier]  →  [Polish-Sprint definition]
        ↓
[Sonnet Polish-Sprint]  →  [v1.5 deployed]
        ↓
[KFB EN didactic + KFB DE schreiben]  ←  informed durch Persona-Sim-Findings
        ↓
[Sprint #1 LP-Slop-Fixes residual]
        ↓
[Track-1 vollständig: kfb-en.md + kfb-de.md als MD-SSOTs]
```

Parallel-tracks ohne harten Blocker:
- Substack-Reference-Posts (Sessions 2-4 vom Roadmap), können parallel zu allem laufen
- Vault-Mining für Sessions 6-7 (Erlangen-Material), kann parallel laufen
- Bernd-Klausel-Verifikation, kann parallel, blockiert nur Bernd-imagery-in-product

## Open Gating Questions (über alle Tracks)

1. **Session-Cadence** (1x/Woche vs 2x/Woche), affects Erlangen-Timing
2. **Erlangen KI-Workshop content focus** (Kayfabizarro-als-Methode vs AI-Comic-Creation broader)
3. **Bernd-Lineage launch-Substack-deployment**: textuelle Referenz Go oder Klausel-Lesen abwarten
4. **Erlangen-Sub-Stream-Priorities** (KI-Workshop time-critical vs Cut & Play on-site vs Ausstellung Festival)
5. **Anything missing from Track-1-bis-4**: Substack about-page rewrite, brush-product-page voice-test, deck-rollout-sequencing, MedKayfab-Substack-Frequency, etc.

## File-Index dieser Session

Produced 2026-05-15:
- `MARKETING & FRIZZLEBOB/SESSION_ROADMAP_v0.1.md` (10-session arc)
- `KAYFABIZARRO WORKSPACE/_handoff/loriot_voice_full_take_claude_skill_report_v1.md` (705-line LORIOT source)
- `KAYFABIZARRO WORKSPACE/_handoff/SONNET_SPRINT_LP_RULES_FIXES_2026-05-15.md` (Sprint #1 brief)
- `RULES & HUB/_handoff/SONNET_RULES_HUB_INTEGRATION_2026-05-15.md` (Sprint #2 brief)
- `RULES & HUB/content/med-en.md` (291 lines, final v1.4-draft)
- `RULES & HUB/content/med-de.md` (291 lines, final v1.0-draft)
- `gvw/Georg/Session-Cuts/2026-05-15_marketing-chat-session-1-kickoff.md` (cut #1)
- `gvw/Georg/COWORKER_MANUAL_v2C_writeback_proposals_2026-05-15.md` (write-back delta-list)
- `outputs/SONNET_SPRINT_LP_RULES_FIXES_2026-05-15.md` (mirror)
- `outputs/SONNET_RULES_HUB_INTEGRATION_2026-05-15.md` (mirror)
- `outputs/2026-05-15_memory_snapshot_marketing-chat.md` (Cut #2 Section 5)
- `outputs/FULL_TAKE_HANDOVER_2026-05-15.md` (this file)

Memory updates this session: 4 new files + 1 edit to existing (`feedback_v1_1_brand_and_working_rules.md` extended with hard anti-pattern list).
