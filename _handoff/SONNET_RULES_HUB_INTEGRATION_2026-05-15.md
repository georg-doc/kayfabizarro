# Sonnet Sprint, Rules-Hub Integration (handoff: 2026-05-15)

*Authored from the Marketing-Chat coworker session. For the existing Sonnet rules&hub-chat (claude.ai web). Operates on `index.html` v1.3 → produces v1.4.*

## Context

The marketing-chat coworker session produced two new SSOT files:
- `RULES & HUB/content/med-en.md` (291 lines, MED EN rules, fully revised)
- `RULES & HUB/content/med-de.md` (291 lines, MED DE rules, written native, not translated)

These now define the canonical MED rules content. The `index.html` v1.3 currently in `RULES & HUB/index.html` has MED EN sections written inline (v1.3 work) but the MED DE side is still skeleton (only `med_de-what`, `med_de-setup`, `med_de-ref` exist with placeholder text).

The MDs use a directive syntax (`:::modes`, `:::ritual`, etc.) that needs to be translated to the existing index.html div-class structure (which already exists for the KFB sections and the EN MED sections). This sprint does that translation, plus three other tasks Georg flagged.

**Out of scope for this sprint:** KFB EN/DE (separate sprint), persona-simulation work (separate Sonnet chat), MD→HTML renderer engineering (parking-lot).

## Inputs Georg uploads to your chat

1. `med-en.md` and `med-de.md` (directly as file attachments)
2. The current `index.html` (file or paste)
3. URLs (text):
   - Deployed target: `https://kayfabizarro.pages.dev/` (and the GitHub Pages mirror `https://georg-doc.github.io/kayfabizarro/`)
   - GitHub repo for raw PDFs: `https://github.com/georg-doc/kayfabizarro`
   - Demo deck PDFs after Georg adds them direct-download (web-compressed): URLs supplied separately by Georg

## Priority 1, Replace MED sections wholesale

### 1a. MED EN sections

Replace the existing `#med-*` rules-sections (`#med-what` through `#med-ref`) wholesale with HTML rendered from `med-en.md`. Keep the existing `#med-booklet` and `#med-decks` PDF-viewer blocks structurally (they hold PDF viewers that Sonnet should not touch), but update the title/intro/download-link to match what the MD specifies.

**Section anchor IDs to honor:** `med-booklet`, `med-what`, `med-setup`, `med-ritual`, `med-turn`, `med-modes`, `med-stage`, `med-quest`, `med-finale`, `med-socials`, `med-hints` (new), `med-faq` (new), `med-powers`, `med-addons`, `med-decks`, `med-ref`, `med-disclaimer` (new).

Three new sections added vs. v1.3 EN: `med-hints` (Kayfab-Friendly Hints), `med-faq` (Common Questions), `med-disclaimer` (end-of-rulebook Doc-FrizzleBob note). Update the sidebar nav `#toc-med` accordingly.

### 1b. MED DE sections

Replace the placeholder `#med_de-*` sections (currently only `what`, `setup`, `ref`) and add all missing sections, rendered from `med-de.md`. Final section anchor IDs: `med_de-booklet`, `med_de-what`, `med_de-setup`, `med_de-ritual`, `med_de-turn`, `med_de-modes`, `med_de-stage`, `med_de-quest`, `med_de-finale`, `med_de-socials`, `med_de-hints`, `med_de-faq`, `med_de-powers`, `med_de-addons`, `med_de-decks`, `med_de-ref`, `med_de-disclaimer`.

Update the sidebar nav `#toc-med_de` to list all sections in order.

## Priority 2, Directive-to-HTML mapping

The MD files use these directives. Render each as the matching existing index.html structure:

| MD directive | HTML structure (existing in index.html) |
|---|---|
| `:::note` ... `:::` | `<div class="note">...</div>`. The existing v1.3 MED note-labels contain a U+2014 em-dash character after the word `Note` inside `<span class="note-label">`. That violates Layer Zero. Render the new HTML with an ASCII hyphen instead, as the KFB sections do: `<span class="note-label">Note -</span>`. If the MD block opens with a bold label like `**X.**`, render that as the note-label. |
| `:::pdf-viewer` block | existing `<div class="pdf-block">` markup with the same id-prefix pattern (`med_book-`, `med-`) |
| `:::rules` (key \| value lines) | series of `<div class="rule-line"><span class="rule-key">key</span> value</div>` |
| `:::steps` (numbered list with `N. Label \| Body`) | `<div class="steps">` containing `<div class="step-row-plain">` rows with `step-num`, `step-label`, `step-body` |
| `:::step-card` block with `title: / meta: / steps:` then `NN \| Label \| Body` lines | existing `<div class="step-card">` with header + numbered `step-row` |
| `:::ritual` (3 lines: Name It / Claim It / Power It) | existing `<div class="ritual">` with `ritual-row`, `ritual-key`, `ritual-desc`. Apply classes `name-it`, `claim-it`, `power-it` to the three keys |
| `:::modes` (6 lines, `N \| Name \| Desc`) | existing `<div class="modes-grid">` with `mode-cell mc1..mc6` (colour-coded per existing palette) |
| `:::quote` ... `:::` | existing `<div class="blockquote">`. If the block has a citation line opening with U+2014 em-dash plus name, render as `<cite>- Doc FrizzleBob</cite>` using an ASCII hyphen, never em-dash |
| `:::quest-strip` (4 lines, `range \| name \| sub`) | existing `<div class="quest-strip">` with `<div class="qd-cell">` (last cell gets `qd-finale` class) |
| `:::ref-table` (key \| value lines) | `<table class="ref-table">` with `<tr><td>key</td><td>value</td></tr>` |
| `:::dosay` (two lines, `DONT \| ...` and `DO \| ...`) | existing `<div class="dosay">` with `dosay-block dont` / `dosay-block do`, label `Don't say` / `Say instead` |
| `:::socials` (4 lines, `Call \| Effect`) | existing `<div class="socials-table">` with `soc-row`, `soc-term` (apply class `bingo` / `boggle` / `bongo` / `blodsinn`), `soc-def` |
| `:::sub-section` ... `:::` | inline within the current section: bold opening label, then prose |

Section headers in MD:
- `# Heading` (H1, used as Act-grouping like "Akt I · Setup") → render as `<div class="sec-eyebrow">` on each child section
- `## Heading {#id}` (H2, section title) → render as `<div class="rules-section" id="id">` with `<div class="sec-title">Heading</div>` inside
- `### Heading` (H3, sub-section) → render as `<div class="sec-sub">Heading</div>`

The MD opening section (before `# Illustrated Rulebook`) contains a top-level `:::note` with the Doc-FrizzleBob disclaimer pointer. Render this as a banner directly under the hero block.

## Priority 3, Direct demo-deck download

Georg is adding web-compressed direct downloads for Protopia and Cardiology decks (no Gumroad-redirect). When the URLs land:

- **KFB sample-deck section** (`#kfb-decks`): replace the Gumroad button with a direct-download button to the Protopia web-compressed PDF. Keep the inline PDF viewer.
- **MED sample-deck section** (`#med-decks`): replace the Gumroad button with a direct-download button to the Cardiology web-compressed PDF. Keep the inline PDF viewer.

Button style: same `btn-outline` class as the rule-book downloads. Label: `↓ Download deck PDF`.

Keep the Gumroad URL as a secondary link below if you want, the conversion philosophy is now "PWYW available, direct first."

## Priority 4, Version check-in + scan

- Bump version comment in `<head>` from v1.3 → v1.4 (or whatever the existing convention is).
- Update the `<!-- v1.4 changelog -->` block: MED EN/DE wholesale rewrite from MD SSOT, three new sections per language (hints / faq / disclaimer), demo decks direct-download, Mode 6 rename and v19 mechanic, six add-ons, anti-pattern object-agency final sweep.
- **Final object-agency scan** on the entire MED EN/DE sections. The MD source is clean, but the v19 docx had at least one canon-bug worth catching: the existing Powers `dosay-block do` (`#med-powers`) historically contained the phrase *"The surgical team will notice this tomorrow"*, collective-noun-as-agent. The MD source has already removed this (now reads "The patient's wife is on warfarin. Nobody checked."). Confirm it stays removed.

## Acceptance criteria

The patched `index.html` v1.4 passes:

1. **Zero em-dashes (U+2014) and zero en-dashes (U+2013)** in all `#med-*` and `#med_de-*` rules-sections. Use commas, periods, or restructure. Standard ASCII hyphen `-` is fine.
2. **Social Agency on every sentence.** No collective-noun-as-agent (table notices, cards teach themselves, case closes, ward moved on, mechanism stays, mode tells you, scene reframes, story remembers, deck adapts, system enforces).
3. **Layer Zero on every sentence.** No setup phrases ("In a world where…", "Imagine…", "Every card…"), no banned words (*comprehensive, cutting-edge, game-changer, unleash*), no sycophantic openers, no fake bureaucracy.
4. **Mode names match across all surfaces.** EN: Morning Report / Heel Turn / Hand-Off / Plain Speak / The Real Question / Attending AWOL. DE: Morgenvisite / Querschläger / Übergabe / Klartext / Die echte Frage / Oberarzt-Pause. The Quick Reference table mirrors these.
5. **All six add-ons present** in both languages (Anki, Feynman Round, Spaced Repetition, Peer Teaching Round, Complication Deck / Komplikations-Stapel, Solo Mode).
6. **Disclaimer banner-note at top + full disclaimer section at end** in both languages.
7. **Demo-deck direct-download links** present and working.
8. **Sidebar nav** updated for both languages with all new section anchors.

If a fix you make introduces an object-agency pattern not in the source MD, **flag it back to Georg before committing**. Do not silently rewrite content that's already passing.

## Out of scope (do NOT touch)

- KFB sections (`#kfb-*` and `#kfb_de-*`). These get a separate didactic-pass plus DE rewrite in a later sprint (queued after persona-simulation results).
- LP hero, video, teaser cards. Unchanged from v1.3.
- Origin-story sections (EN+DE).
- The CSS itself. The directive-to-HTML mapping uses existing classes only.

## Open decisions to surface back

If you encounter any of the following, **flag back, do not decide silently**:

- **Demo-deck URLs not yet provided.** Use a placeholder comment `<!-- TBD: Cardiology direct-download URL from Georg -->` and surface in your summary.
- **MD directive you don't recognise.** If a `:::name` block in the MD isn't in the mapping table above, flag it with the source line and ask.
- **HTML class you'd need to introduce.** The rule is: use existing classes only. If a directive would need a new class, flag and propose.

## How to start your session

> "Hi, ich übernehme die Rules-Hub-Integration vom 2026-05-15. Inputs: `med-en.md`, `med-de.md`, der aktuelle `index.html` v1.3, plus die zwei demo-deck-URLs falls Georg sie schon angehängt hat. Ich starte mit P1 (MED EN+DE wholesale replace via directive-to-HTML mapping), dann P2 (Mapping-Konsistenz-Check über andere Sektionen falls sichtbar), P3 (demo-deck direct-download), P4 (version check-in + final scan). P5 ist out of scope. Bei jeder Object-Agency-Frage flag ich zurück."

## Exit deliverables

1. **Patched `index.html` v1.4** as a downloadable file in your chat.
2. **One-page diff summary** listing: sections replaced, sections added, demo-deck-URL status (resolved or pending), any flags raised.
3. **Commit message text** Georg can paste into the git commit on the RULES & HUB repo.

---

*Sprint scope is bounded: MD-to-HTML integration plus four scoped fixes. Do not redesign the LP, do not refactor CSS, do not touch KFB sections.*
