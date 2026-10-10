# KayKit Multichannel Research → Blender MCP · Additive Workflow

Date: 2026-10-10
Owner: existing Asset Librarian / KayKit Reference Atlas.
Branch: research/kaykit-creator-tutorial-atlas-2026-10-10
Mode: RESEARCH/PROPOSAL ONLY. No second runtime, no automatic integration, no publishing.

## Verified outlets and bounds

- Creator Twitch: https://www.twitch.tv/kaylousberg — dynamic page was reachable but current individual VOD list/IDs were not exposed to the web reader. Status: CHANNEL CONFIRMED / VOD INVENTORY UNVERIFIED.
- Official creator Patreon: https://www.patreon.com/kaylousberg/posts/updates-recap-169539427 — Kay confirms five KayKit Live Show episodes 0–4 produced the 24-item Mixed Bag 1 and that episodes are educational live Blender asset-modeling sessions; creator says VODs were uploaded to YouTube.
- Creator YouTube: retain independently verified direct tutorial IDs from the existing Atlas.
- X.com: secondary discovery/original post chronology / pointers to primary material, NOT itself a claim of Blender geometry or a transcript.

Twitch official: https://help.twitch.tv/s/article/video-on-demand — ordinary past broadcasts are retained 7/14/60 days depending on account status; availability is not guaranteed. https://help.twitch.tv/s/article/guide-to-closed-captions — captions are available only where provided/broadcast; no universal automatic VOD transcript can be assumed. Twitch auto-caption announcement for *clips* does not imply full-VOD transcripts.

## Source triage / deduplication

Key canonical record by creator + date + subject + original media ID. Store distinct platform versions as mirrors of a single creative session rather than double-counting an X teaser, Patreon post, Twitch VOD and YouTube export.

Statuses:
- DIRECT_VIDEO_VERIFIED
- CREATOR_POST_VERIFIED
- VOD_LINK_UNVERIFIED
- TRANSCRIPT_AVAILABLE / TRANSCRIPT_GENERATED / TRANSCRIPT_UNAVAILABLE
- VISUAL_REVIEW_REQUIRED
- SOURCE_OBJECT_ISOLATED
- KFB_TESTED (only after consuming owner proof).

Ranking:
1. first-Island Environment F-R24/F-R39, Character setup and rig;
2. current production props/sets/dungeon/building scene composition;
3. reusable Blender source-author methods, modularity/pivots/proportions, texture atlases;
4. future Academy/modelling study.

## Stage A: low-token Webchat / Grok evidence

For each hit:
1. precise platform, original URL, date, title, approximate length, availability/expiry, original vs repost, version;
2. primary link and source quote/creator statement where available;
3. transcript route (native captions, audio ASR, none); if no transcript, do not fabricate it;
4. ranked KFB use, named owner, exact related project module/donor;
5. time ranges and visual questions worth a later Blender MCP pass;
6. uncertain/unsupported points marked UNKNOWN.

Prioritize expiring Twitch originals for preservation of metadata/timecodes, but use creator-uploaded YouTube exports if available. Do not rehost creator content publicly.

## Stage B: Blender MCP targeted visual and reproduction pass

Executor: existing Claude Coworker / Blender MCP asset-specialist, only when a specific time range and KFB target are named. No second world/material/motion owner.

Inputs:
- selected original video/segment link or locally available lawful segment + timestamp table;
- existing KayKit Reference Atlas record and extracted claims;
- exact source character/mesh/asset path and version;
- current relevant KFB donor/owner paths and source provenance.

Actions:
- Inspect 3–8 decisive frames for tool configuration, mesh/pivot, origin, scale/proportions, topology, modifiers, material atlas, normal shading, armature, animation, light placement and intended construction sequence as applicable.
- First show original KayKit source object alone in Blender. A loaded file URL is not design proof.
- Reconstruct only the named technique on the actual source or a minimally isolated existing scene; preserve provenance.
- Return original-frame vs own-source-isolation vs candidate A/B side-by-side at matched camera/scale when visually meaningful.
- Record exact UI/tool values only if visible or measurably verified; separate spoken claims from observed actions and extrapolation.
- Do not replace existing assets, K1/H0/K2 Clay look, motion priority, world Environment owner, runtime or publication.
- For engine-specific tutorials (Godot), transfer concepts only; prove in current Three.js owner separately.

Evidence format:
| url/timecode | source asset/version | creator statement | visible action/setting | source isolation image | KFB A/B image | owner | verdict KEEP/ADAPT/REJECT/UNKNOWN | next proof |

Return: 6–12 useful frames maximum for ordinary tutorial; source isolation contact sheet, brief reproduction result, exact files, actual tests, unresolved. If a single seam fails twice, preserve it and route according to Production Guard rather than broad rewrites.

## X / Grok discovery prompt contract

Ask Grok to scan Kay Lousberg's own X posts and quote/reply context strictly for KayKit-related tutorials, Twitch live shows/VODs, YouTube uploads, Patreon posts, release demos, Blender making-of, scale/pivot/rig/material/construction tips. Collect original direct URLs and publication dates. Deduplicate one session across platforms. Separate verified post text from Grok inference, and avoid fake timestamps, fabricated video titles or unverified transcripts. Output high-value queue with MVP vs later, availability/transcript, and a compact JSON/Markdown handoff. Never infer rig compatibility from promotional clips.

## Single next gate

KAYKIT-CREATOR-LIGHTING-VISUAL-SCAN-01 remains the next owner gate; this multichannel process is parallel research preparation only.
