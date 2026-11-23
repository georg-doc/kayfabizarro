# Tzolk’in / Chol Q’ij: sources, calendar mathematics and design-transfer map

Date: 2026-11-08 · Status: **RESEARCH / NO NEW CANON / NO RUNTIME** · Owner: existing Fractal Almanac / Infinite Canvas design lane. Companion: `VIDEO_TRANSCRIPT_ANALYSIS_2026-11-08.md` and `BOARDGAME_GEAR_DONOR_2026-11-08.md`.

## 1. Source tiers and boundaries

**H = documented Maya calendar / contemporary living Maya practice**, **M = modern interpretive system**, **D = KFB design proposal**, **V = wording/claims attributed to the supplied transcript**, **G = contemporary board-game mechanics**. The mathematical identity 13×20 does not by itself validate cosmological interpretations.

### Sources consulted (read 2026-11-08)

- H1 **Smithsonian National Museum of the American Indian, Living Maya Time**: https://maya.nmai.si.edu/calendar/calendar-system — Tzolk’in/Chol Q’ij; Haab; Calendar Round; Long Count; continuing K’iche’ and Yucatec Maya use.
- H2 **SLUB Dresden, Dresden Maya Codex calendar**: https://www.slub-dresden.de/en/explore/manuscripts/the-dresden-maya-codex/calendar — 13 numbers and 20 signs, 260-day cycle, 52-year interlocking calendar and 2012 interpretation.
- H3 **Mathematical Association of America, Maya Calendrics**: https://old.maa.org/press/periodicals/convergence/maya-calendar-conversions-the-maya-and-their-calendars — traditional name order and modular calendar arithmetic.
- H4 **Smithsonian, The Meaning of 2012**: https://maya.nmai.si.edu/2012-resetting-count/meaning-of-2012 — Long Count completion, no ancient end-of-world prediction.
- H5 **Smithsonian Maya Calendar Converter**: https://maya.nmai.si.edu/calendar/maya-calendar-converter — model of conversion through a dated Long Count correlation.
- M1 **José and Lloydine Argüelles / modern 13 Moon–Dreamspell presentation**: https://lawoftime.org/thirteenmoon/tutorial.html and https://www.lawoftime.org/lawoftime/intro-to-the-synchronic-order.html — 13×28+1, 20 solar seals, 13 tones, wavespells. This is a modern presentation, *not equivalent to historical Tzolk’in*.
- M2 **Carl Johan Calleman, Nine Underworlds of the Cosmos**: https://www.calleman.com/content/9underworlds_13heavens.htm and https://www.calleman.com/content/articles/An_explanatory_note.htm — modern interpretation and its author's own acknowledgment of alternative ninth-wave dates.
- G1 **Czech Games Edition (CGE), official Tzolk’in board game**: https://www.czechgames.com/games/tzolkin-the-mayan-calendar — game metadata, connected gears, dynamic worker placement.
- G2 **CGE official English rules**: https://www.czechgames.com/files/rules/tzolkin-rules-en.pdf — source of 26-tooth main gear, five location wheels, place/retrieve turns, advance mechanic.
- G3 **Board Game Arena digital edition**: https://de.boardgamearena.com/gamepanel?game=tzolkin — browser game listing and rule summary.
- V1 **User-provided transcript of** https://www.youtube.com/watch?v=lXjNlJoGySQ — 542 indexed content lines in conversation attachment; local UTF-8 text measured 67,947 bytes (541 newline characters); SHA-256 `1ca0629452b0a0720ef8d3a85cf803854f08da81302747904638feef7248df10`. Automatic transcription has many phonetic substitutions (e.g. Tzolkin/Tolkien/Zeugin). The *text* is the analyzed source; direct video playback/title/speaker attribution were not independently verified. Do not cite this transcription as independent historical evidence.

## 2. Historic Tzolk’in: exact transferable logic

1. Sacred 260-day calendar Tzolk’in (Yucatec) / Chol Q’ij (K’iche’): **13 consecutive numerical coefficients × 20 day-name glyphs**, both advance once per day. No 13 months in Tzolk’in.
2. Demonstration: day 1 = **1 Imix**; day 2 = **2 Ik’**; day 13 = **13 Ben**; day 14 = **1 Ix**; day 260 = **13 Ajaw/Ahau**; day 261 repeats 1 Imix. Spelling variants exist; do not treat the English Dreamspell labels as ancient glyph transcriptions.
3. On day offset `k` from an arbitrary **undated conceptual** reference at 1 Imix: `tone=(k mod 13)+1`; `sign=dayNames[k mod 20]`; `kin=(k mod 260)+1`. This is what `chronoloom-core.mjs` implements. It is **not a modern-date conversion**.
4. Two diagnostic shifts: `+13` changes name but keeps numerical coefficient; `+20` changes coefficient but keeps name; `+260` repeats both while a separate absolute cycle counter increases. `gcd(13,20)=1` ensures 260 unique pairs.
5. Haab: **18×20 + 5 Wayeb = 365 days**, distinct from modern 13×28+1. A joint Tzolk’in–Haab pair repeats after `LCM(260,365)=18,980` days, i.e. **73×260 = 52×365** (52 *Haab years*, not 52 astronomical tropical years exactly).
6. Long Count: continuous dated tally with k’in=1, winal=20, tun=360, k’atun=7,200 and bak’tun=144,000 days. Historical date conversions require a correlation/epoch; a free arbitrary `kin` is not a real-world birthday signature.
7. 2012-12-21 is a commonly used Gregorian date for the **13-bak’tun Long Count completion**, a period transition and not a textual Maya apocalypse forecast. This is *not* a once-for-all end of the Tzolk’in 260-day cycle.
8. Lived traditions: the sacred count continues in Maya communities, including Ajq’ijab’ daykeepers described by the Smithsonian. Maya tradition should not be replaced by a single twentieth-century esoteric reinterpretation.

## 3. Distinct modern systems — useful but never silently merged

| Element | Attribution | Content | KFB status |
|---|---|---|---|
| 20 **solar seals** (Red Dragon, White Wind, … Yellow Sun) and four-color order | Dreamspell/13 Moon modern layer; used by V1 | interpretative overlay of the day-name sequence | OPTIONAL editorial sign meanings, not historic logogram semantics |
| 13 **galactic tones / manifestation stages** | modern Dreamspell/V1 | 1 intention → 13 integration/transcendence; full user-transcript mapping in video-analysis and `TZOLKIN_CONCEPT_MAP.json` | OPTIONAL gameplay rhythm |
| 13×28 + 1 annual program | 13 Moon movement | 364+1=365, typically July 26 start / July 25 Day Out of Time | OPTIONAL alternate game calendar, never relabel as Haab |
| 20 13-step wavespells = 260, five 52-day castles | Dreamspell vocabulary; arithmetic 20×13, 5×52 | second grouping of 260 states | proposal for beat/act grouping, not required in R0 |
| Nine evolutionary “underworld” waves / 13 heavens / accelerating waves | Calleman-related modern esoteric model echoed by V1 | metaphor for nested historical scales | optional **fictional world-scale dial**, not calendar-derived natural law |
| Solar/plasma/magnetic transmission of coded evolution programs | V1 metaphysical narrative | visual metaphor for signal/ripple/field flows | VFX story art only, not a physics engine or validated medical/astro claim |
| 52-year “personal spiral” / Sirius-New Year / 2012 inversion | modern synthesis in V1 | symbolic biography or epoch story | scenario concept only; no deterministic player/person prediction |

**Four-color Dreamspell rotation is not the six KFB D6 color-mode canon**. A later palette mapping needs the actual current D6 SSOT and WS0 confirmation.

## 4. Twenty-day names (historic order) and modern storyboard correspondence

The historic names are the calendar row; the English “solar seal” labels and verbs are a *modern editorial overlay* used in the video. `chronoloom-core.mjs` currently uses its own original KFB verbs, not automatically the video ones.

| # | Historic name (standardized variants) | Modern Dreamspell/V1 label | KFB optional semantic hook |
|---|---|---|---|
| 1 | Imix’ | Red Dragon | Ursprung, Nähren, Entstehung |
| 2 | Ik’ | White Wind | Atem, Stimme, Botschaft |
| 3 | Ak’b’al | Blue Night | Traum, verborgenes Potenzial |
| 4 | K’an | Yellow Seed | Keimen, gezielte Möglichkeit |
| 5 | Chikchan | Red Serpent | Körper, Trieb, Lebenskraft |
| 6 | Kimi | White Worldbridger | Ende, Übergang, Tausch |
| 7 | Manik’ | Blue Hand | Handeln, Verstehen, Heilen |
| 8 | Lamat | Yellow Star | Schönheit, Harmonie, Form |
| 9 | Muluk | Red Moon | Wasser, Erinnerung, Fluss |
| 10 | Ok | White Dog | Bindung, Mitgefühl, Loyalität |
| 11 | Chuwen | Blue Monkey | Spiel, Regelbruch, Remix |
| 12 | Eb’ | Yellow Human | Auswahl, Wille, Polarität |
| 13 | Ben | Red Skywalker | Erkundung, Brücke, Horizont |
| 14 | Ix | White Wizard | Intuition, Verwandlung |
| 15 | Men | Blue Eagle | Überblick, Verantwortung |
| 16 | K’ib’ | Yellow Warrior | Mut, Frage, Entscheidung |
| 17 | Kab’an | Red Earth | Vernetzung, Ortsbezug |
| 18 | Etz’nab’ | White Mirror | Reflexion, Ursache |
| 19 | Kawak | Blue Storm | Turbulenz, Transformation |
| 20 | Ajaw | Yellow Sun | Licht, Synthese, Auflösung |

## 5. KFB translation plan and preservation of ownership

- **ChronoLoom arithmetic** remains a tiny pure calculator, not a replacement for world time, calendar history or game Save.
- **Fractal address** `world / diorama / card / memory` operates at repeated narrative scales. The “nine waves” could be selectable coarse *lenses* but not nine nested runtime worlds; the four-level schema remains unchanged for now.
- **13 tone states** can become a minimal scene lifecycle (seed → manifestation → reduction → communal connection → re-seed). Tone semantics are modern-story adaptation, not calendar facts.
- **20 sign states** can select one meaningful authoring modifier (what changes) per real prop/scene, never a generic 20-way indiscriminate particle randomizer.
- **Almanac memory** gives an existing provenance reference; no snapshot is fabricated. **Portal/world** owns entry/return; **VFX/lighting** own their layers.
- Donor-art rule: isolate a real historical/reference glyph image or an existing approved KFB clay asset before requesting stylization. Reused donor must be visible in isolation; a URL loading is insufficient.
- Existing P30 Magnetic Arc research in `georg-doc/KFB-Stunt-Car-Race` Draft PR #92 may later supply themed *energy connections*; not a dependency, no runtime fan-out.
- Proposed sequence: one two-prop/diorama toy decision demonstrator, one time-marker, one early/late resolution and a real Almanac readout; only then test visual scale and performance in receiving product.

## 6. What research does **not** establish

No proof was found that 13 stages control cellular biology, that galactic signals encode Tzolk’in instructions, that the nine Calleman waves are ancient Maya calendar mathematics, or that HAARP/WLAN/sunspot activity conveys a deterministic civilization timeline. These remain attributed concepts from V1, available for fictional/mystical satire and experiential composition, not facts to hard-code as world physics or medical claims.

**Next gate remains unchanged:** WS0 isolated source-backed ChronoGlyph appearance comparison (3 distinct motifs) before any adopted KFB style, runtime integration or public review.
