> **R0.5 addendum · Simulation, Overton & HyperNormalisation (2026-11-17):** [OVERTON_HYPERNORMALISATION_R05_2026-11-17.md](OVERTON_HYPERNORMALISATION_R05_2026-11-17.md) proposes a two-slot movable window over the existing four-card MARKET; outside RECRUIT tentatively costs 1 FAVOR, and a new optional PLOT can shift the window and RECRUIT. This is **not** an automatic change to the printed R0.4 Quickstart. [Simulation report](SIMULATION_R05_REPORT_2026-11-17.md) summarizes 3,500 proxy bot-games with known limitations, [WSA Atlas intake](ATLAS_RESEARCH_HANDOFF_R05_2026-11-17.md) is prepared but not run. New Overton state probe checks 48 cost states, **no full-game Overton balance test yet**. Next gate: 2-player without/with-window microtest plus optional solo.

# THE INVISIBLE HANDSHAKE · R0.4 · Cross-Sphere 12-Card Proxy & Solo Sidecar
**Date:** 2026-11-17 · **status:** CANDIDATE / printable text proxy, **no human games** · **owner:** `games/invisible-handshake` · **branch:** `design/invisible-handshake-paper-r0-2026-11-17` · **Draft PR #475**.
**Authority:** Georg's confirmation of the six-sphere concept and priority: **2–6 players first; solo optional but planned from the beginning**. This updates design priorities, not the unchanged existing KFB Freestyle game.
**Dependencies:** [R0 mechanical rules](PROTOTYPE_R0.md), [R0.3 six spheres](POWER_SPHERES_KAYFABE_BIZARRO_R03_2026-11-17.md), Atlas v29 mechanics brief PR #394. Old R0 paper card PDF is a historical fixture with obsolete MONEY/VOICE labels; this R0.4 is the new proxy candidate.

## Product priorities and constraints
1. **Main game: 2–6 players.** Same single common 56-card starter for all player counts (6 ROLES + 30 INSTITUTIONS + 12 PLOTS + 8 EVENTS; 14 four-card pages + separate cover). Normal turn still 20–40 seconds *target only*, no measured times. 5–6 player waiting and reactions are the hardest validation gates.
2. **Solo: one optional sidecar** using exactly those same 56 cards and the same SUPPLIES/NEEDS scoring. No second solo deck, no software opponent, no six artificial hands. Existing [R0 solo market-denial rule](PROTOTYPE_R0.md) remains historical baseline A; a **network-owning automated rival B** is proposed below, NOT approved to replace A until playtesting.
3. **Test scope:** 12 proxy cards show six spheres once each, two roles, three existing Plot effect families and one Event. This is a **short scenario test**, not a full balanced 2–6-person game. Neither 8 events nor 30 Institution cards exist in this proxy set. No 56 finished texts or art.

## Twelve original English sample proxy cards
Each institution retains **one supply/need pair, PUBLIC CLAIM, PRIVATE INCENTIVE and BIZARRO visual cue**. Claim and incentive are *fictional game copy*, never historical allegations about actual people or companies. Texts are tuned for card readability, no required narration.

| ID | Type | Title | SUPPLIES → NEEDS | PUBLIC CLAIM | PRIVATE INCENTIVE | Print effect |
|---|---|---|---|---|---|---|
| R01 | ROLE | **THE LICENSED DISSENTER** | — | The conscience of the board. | Dissent is more valuable when it requires a license. | AGENDA +2 if one of your active Institutions has an unmet NEED. |
| R02 | ROLE | **THE ELITE RECRUITER** | — | Talent deserves access. | Especially the talent that already has access. | AGENDA +2 if your active network supplies all three channels. |
| N01 | INSTITUTION | **THE SOVEREIGN FUND** | RESOURCES → INFLUENCE | We invest for the public. | A favorable story keeps the rescue looking voluntary. | — |
| N07 | INSTITUTION | **THE EMERGENCY LICENSE OFFICE** | RULES → RESOURCES | Only essential services qualify. | The owner of the lifeboat writes the eligibility list. | — |
| N15 | INSTITUTION | **THE COMPROMISING ARCHIVE** | INFLUENCE → RULES | The public deserves the record. | Release depends on who is legally entitled to look. | — |
| N19 | INSTITUTION | **THE MAINSTREAM SYNDICATE** | INFLUENCE → RESOURCES | The whole story, every evening. | The same advertiser owns the opening and closing lines. | — |
| N24 | INSTITUTION | **THE CRITICAL THEORY OFFICE** | RULES → INFLUENCE | Question every authority. | Only licensed dissent receives academic credit. | — |
| N26 | INSTITUTION | **THE COMPUTE CHOKEPOINT** | RESOURCES → RULES | Intelligence should be accessible. | Access requires the export permit held by our office. | — |
| P01 | PLOT | **EMERGENCY INJUNCTION** | — | Due process for everyone. | Except the target named in the sealed appendix. | SUSPEND one Institution until the next round. It supplies nothing and scores 0. |
| P02 | PLOT | **THE COMPROMISING FILE** | — | The record speaks for itself. | Only after the owner agrees to change sides. | POACH one EXPOSED rival Institution for 0 FAVOR. It may VETO for 1 FAVOR; if so, RECRUIT instead. |
| P03 | PLOT | **THE BAILOUT PACKAGE** | — | One-time emergency assistance. | The emergency is renewed every quarter. | RECRUIT one market Institution; then gain 1 FAVOR, max 3. Replace one of yours if full. |
| E01 | EVENT | **PUBLIC HEARING** | — | Everyone is accountable. | The hearing begins with the verdict already typed. | Each player with 3 Institutions SUSPENDS one of their own until next round. |

## Main multiplayer microtest · 2 participants
Use a **prearranged scenario** to exercise core decisions, not the complete 8-round game:
- Player A: R02 / `THE ELITE RECRUITER`; owns N01 Sovereign Fund + N07 Emergency License Office, FAVOR 1, holds P01 Emergency Injunction.
- Player B: R01 / `THE LICENSED DISSENTER`; owns N24 Critical Theory Office + N19 Mainstream Syndicate, FAVOR 1, holds P02 Compromising File.
- MARKET contains N15 Compromising Archive and N26 Compute Chokepoint. Unused P03 Bailout Package is an optional swap; E01 Public Hearing is the single test Event, **not** a full Event pile.
- First action: A gains 1 FAVOR (1→2), then RECRUITS N15 for free. A's R→I, I→RULES, RULES→R form a **three-sphere cycle**: base 9 + R02 agenda 2 = 11 provisional points. All A nodes now EXPOSED because its network is full.
- Second action: B gains FAVOR (1→2) and plays P02: POACH A's N15 **for 0 FAVOR**; A may VETO for 1 FAVOR. If not vetoed, B acquires N15; A becomes a two-node network with one unmet need, B has a three-node but imperfect network. Exact physical transfer matters, narration does not.
- Third action alternative: Reset scenario. B may instead RECRUIT N26 to build a second three-sphere cycle; alternatively P01 SUSPENDS one Institution, breaking two-player dependency calculations. Count one reaction only, never restart open negotiations.
- **Check:** Do players recognize the six spheres behind the six Institution cards without learning six additional types? Can someone explain which power is removed by a POACH? Does dual Kayfabe/Bizarro reveal satire without oral performance?

## Solo sidecar B · deterministic rival network (optional trial)
**Intent:** Preserve actual network competition and usable POACH/VETO in solo, avoiding the prior 'System removes only a market card' limitation. Use **the full 56-card set or numbered blank copies of the missing 44** for an eight-round solo test; a twelve-card microtest can check only a few turns.

**Solo setup:**
- Player: one Role, 1 FAVOR, zero Institutions and one Plot (standard player rules).
- Place one Institution from supply face-up as **THE SYSTEM**'s starting network. System begins with **0 FAVOR**, no Role, no Plot, no private hand. It can control at most 3 Institutions.
- Four public MARKET Institutions and ordinary eight Event cards. The System has no discretionary choices.

**Each round:** clear SUSPENDED → resolve one Event (apply to both networks; if System must suspend one, choose its **leftmost active Institution**) → **human player goes first** with normal FAVOR gain and one RECRUIT/POACH/PLOT → **System gains 1 FAVOR (max 3) and takes one action**:
1. If an active Institution in the player's network is **EXPOSED**, supplies a channel currently missing from an unmet System NEED and System has at least 1 FAVOR: System **POACHES the leftmost such card**, paying 1 FAVOR. Player can VETO for 1 FAVOR, as in multiplayer. If vetoed, System **RECRUITS** instead, with no further response.
2. Otherwise the System **RECRUITS** the leftmost MARKET Institution that supplies one of its unmet NEEDS. If none qualifies, it takes the absolute leftmost MARKET card.
3. If System already holds three Institutions, replace its **leftmost** network Institution before the transfer or RECRUIT. Refill MARKET in the ordinary way. If it has no legal card to recruit, the action does nothing; never invent new cards.
4. On human POACH of System: if it holds at least **1 FAVOR**, System pays 1 and automatically **VETOS**; otherwise the POACH succeeds. The human then has the existing RECRUIT fallback. System never initiates additional reaction chains. No Plot/Role generated for it.

**Score and outcome (candidate):** After Event 8, both sides score active Institutions with the existing R0 `1 + 2 if need met` rule. Human can also earn +2 Role AGENDA; System has no Role bonus. **Human wins only if strictly ahead; tie or loss = System wins.** This is an explicit alternative to legacy R0 solo's 8-point absolute threshold, not an automatic rules replacement.

**Known asymmetric problems to test:** System starts with a free Institution; algorithm may repeatedly steal the same exposed card, while its automatic 1-FAVOR VETO may over-defend. It may favor leftmost column order, and the human has Plot/Role advantages. Do not claim balanced difficulty. If 'network-owning solo' fails, preserve legacy market-denial A without growing a new combat AI.

### Constructed one-round solo example
Player has N01 Sovereign Fund (R→I) and N07 Emergency License Office (RULES→R); System has N24 Critical Theory Office (RULES→I), 0 FAVOR. Market left→right [N15 Compromising Archive (I→RULES), N19 Mainstream Syndicate (I→R), N26 Compute Chokepoint (R→RULES), blank licensed proxy for full deck].
- E01 Public Hearing: neither side holds three, so no suspension.
- Player begins with 1 FAVOR, gains +1 → **2**, RECRUITS N15 from market (0 cost), now N01/N07/N15 are a 3-node connected cycle, 9 base; R02 Elite Recruiter would add +2 if held.
- System gains +1 FAVOR: **0 → 1**. It needs INFLUENCE for N24 and sees the player's exposed N15 (because player has three); it spends 1 → **0** and POACHES N15. Human may pay 1 FAVOR to VETO (2→1). If vetoed, System RECRUITS leftmost qualifying Market N19 (INFLUENCE→RESOURCES), reaching N24/N19; its original NEED is met. If not vetoed, N15 transfers to System and player drops back to a two-node partial network. Exact choice visible and one response only.
- This is a **constructed turn fixture** using one blank Market stand-in, not a played session, not a verified full solo victory condition.

## 2–6 scaling policy (no new game)
- **2:** contest over dual three-card coalitions and the single VETO decision. No required third party to negotiate.
- **3–4:** six spheres appear through shared market/network churn, with optional one-sentence narrative, not obligatory consensus.
- **5–6:** a maximum of one reaction to an attack; no interrupts on another player's turn; eight rounds × 6 people = **48 human turns** plus eight Event resolutions. This is a capacity count, **not a measured playtime**.
- One planned deck: at 6 participants, six Role cards used, six Plot cards held (six initially remain), four Institutions in market, up to 18 institutions in networks; **at least eight other Institutions** available at maximum fill before replacement/recycling. No extra 56-card decks.
- **Watch:** long leader pile-ons, poach veto lock, role score/point swing, meaningful card recovery and a 5–6-person round's length.

## Evidence and single gate
This file is an implementation-ready *text candidate* for printing only. **No human player tests, no accepted cards, no fully populated 56-card deck and no Stage site.** The visual cues specify future optional art; no donor image/logo is declared used.
**Next gate:** Georg's 12-proxy cross-sphere microtest with 2 people, optionally one Solo sidecar turn. KEEP/TUNE/FAIL on network legibility, Kayfabe/Bizarro reversal, POACH/VETO balance; then formal 2–6 timing tests with the eventual 56-slot proxy deck.
