# BRIEF · VIDEO-REFERENCE-SCAN-01 · KayKit creator tutorials → reference stills

Executor: WSA Work, or a web chat with video / screenshot access.
Language of the return: English.
Purpose: Georg should not have to scrub through hours of video. Find the moments where the KayKit creator (Kay Lousberg) shows the Character Animations on the Mannequin or a KayKit character. Return stills and timestamps we can lay beside our Blender review.

## Sources (start here; add others only if they are by the creator)

- "Using KayKit Characters In Godot (Detailed version)": https://www.youtube.com/watch?v=4p7QaOd8SHE
- "How to use KayKit Character Animations in Unity and Godot": https://www.youtube.com/watch?v=rwst5GnUU7s
- "KayKit – Animations – Overview Set 1": https://www.youtube.com/watch?v=T1KNCtAqJ7A (check whether it is the old 2022 set or 1.1; label it)
- Pack page: https://kaylousberg.itch.io/kaykit-character-animations (current version 1.1, 161 clips)

## What to find (per video, with timestamps)

1. **Gait:** where Idle → Walking → Running are shown or switched (blend tree / state machine). Which Walking (A/B/C) and Running (A/B) he actually uses, and at what speed setting.
2. **Transitions:** how he goes walk ↔ run, start, stop and turn without native transition clips (blend time, speed parameter, root motion or in-place).
3. **Jump chain:** Jump_Start → Jump_Idle → Jump_Land (or Jump_Full), and how air time is handled.
4. **Strafe / backwards / dodge:** if shown.
5. **Bow / ranged:** draw → aim → release, and Running_HoldingBow if shown.
6. **Mannequin specifics:** scale, import settings, root motion on or off.
7. **Engine settings** that change the look: blend times, playback speed, root-motion flags.

## Return format

A table with one row per moment:

| video | timestamp | what is shown | clip names visible | settings visible | still filename |
|---|---|---|---|---|---|

- Stills as PNG, named `<videoId>_<mm-ss>_<topic>.png`. 3–6 stills per topic, enough to read the sequence (e.g. contact, passing, contact).
- Separate what is **seen** on screen from what is **inferred**.
- If a topic is not covered in any video, write NOT SHOWN. Do not fill it from general knowledge.

## Do not

- No downloads of the asset pack; no Mixamo.
- No re-hosting of the full videos. Short stills for internal reference only.
- No conclusions about our implementation. That is the Blender gate's job.

## Hand-off

Put the stills and the table in Dropbox `BLENDER MCP/_inbox/VIDEO_REFERENCE_SCAN_01/`. Coworker / Blender MCP then renders the same clips on the Mannequin at the same moments and builds the side-by-side.
