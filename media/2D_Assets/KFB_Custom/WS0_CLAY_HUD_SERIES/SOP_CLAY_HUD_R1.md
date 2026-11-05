# CURRENT · GEORG DESIGN FAIL · ACTION BUTTON FACES · 2026-11-05

**Binding latest Georg correction:** The displayed action buttons are REJECTED. A skinned supporting bar beneath generic cream/white circular discs does not deliver the requested concept. Preserve the existing six skins: the bar/frame carries the skin (e.g. Reactor Blue blue frame); the button faces on it are simple slightly rounded RECTANGLES with skin-appropriate styling and NO individual border/rim/socket. Transparent isolated glyphs/actual-object Hero-Shots lie directly on those faces. No white circles, circular badges, extra icon plates or new skin design. Skin the HUD surfaces/elements, never the400+prop/weapon/gear content catalog. Prior references to “flache runde Scheiben” are superseded by this explicit correction.

**Confirmed implementation cause:** receiving georg-doc/KFB-Stunt-Car-Race@module/hud-clay-r1 head0fc20677f4aa530851e7de2cd6e4de4ab6de98f4, src/hud/hudV6.js line55 defines .v6s with border-radius:50% and fixed cream/white normal/hover/pressed/off fills. Line256 independently gives the cooldown layer border-radius:50%. R9 action_surface loads the skin below these generic faces; that alone is insufficient. Current HUD_HEAD_WS1.md describes round discs and technical matrix success, which do not constitute Georg's design approval. This diagnosis is from exact current source; no new game/browser test performed here.

**Correction owner:** Kartenkante remains the ONLY runtime writer. Replace the circular face styling and cooldown mask together, resolve surface/state styling from the existing chosen skin, and keep the glyph/content image neutral. Same face language for main actions, separate travel and weapon/travel choices; retain fixed positions, content size/padding, empty context behavior and stable hitboxes. Hover/focus/pressed/cooldown must preserve rounded-rectangle shape and readable content; no extra outline/frame. Do not re-render icons or alter R11 Teal/Hazard cuts, which are an independent completed cutter correction.

**Current status:** design FAIL recorded, repair NOT IMPLEMENTED by this chat. Technical source selection/pixel checks of R9/R11 remain valid within their limits; all-six action-button visual acceptance is WITHDRAWN/PENDING correction. WSA supplies authoring guidance; it has no runtime-write right under HUD_CONTRACT_R1 §8.

**One next gate:** Kartenkante corrects the existing renderer and presents Reactor Blue in the actual HUD (normal, hover, pressed, empty context) so the blue frame, skin-appropriate rounded rectangles and bare shared icons are visible together. Apply the same existing skin mapping to the other five and include the correction in the owning acceptance cycle. No parallel game-test matrix from this chat, no new layout, asset batch or seventh skin.

---

## Historical delivery checkpoints · not design acceptance of rejected button faces

# CURRENT · HUD CUTTER R11 · TWO KNOB CORRECTIONS · 2026-11-05

WS0 via Georg narrows this delivery to Teal arrow scale and Hazard arrow-plate selection. Existing six-skin/action-surface integration is owned by Kartenkante; its current in-game six-skins × sizes check must NOT be duplicated. Earlier R10 restart/resume and acceptance TODOs below are historical, not instructions to restart gameplay testing here.

**Method:** reuse unchanged native R4 Sheet1a/1b pairs. For paired §2a input, select the sole connected arrow plate from Sheet1b row1/column3 (x1168–1504,y32–352, proportional to sheet dimensions), never a size-ranked siren. Match the genuine source triangle and its polarity/shape to the open drawer's bottom-center marker; reject absent/ambiguous references instead of falling back to a bolt. No skin-specific detector coordinates. Retain native source pixels independently of logical placement dimensions; do not upscale, blur, sharpen, recolor or regenerate artwork. Two corrected cutouts use a bounded ≤2px alpha matte; transparent RGB is zero. Legacy single-sheet path and other roles stay unchanged.

**Delta:** Teal arrow output204×86 native (old35×15), measured match182×77, runtime knob[129,55],knobAt[520.2,243.1],scale0.8918080720799182. Hazard output261×226 native is the actual arrow plate (old227×239 siren), measured match116×101,runtime knob[82,72],knobAt[501.0,249.5],scale0.445686892595848. Hazard siren remains detail_1. Runtime size is metadata, not a demand to discard native source resolution.

**Private patch:** cut-sheet1.py plus NEW sibling knob_reference.py; apply both together. Baseline georg-doc/KFB-Stunt-Car-Race@module/hud-clay-r1 head817dac381a0349c4af9a67ca65bbfa4d8f4cead8, cutter blobcb9de81c861a882ea6dcb081b0b05cb59e33b63b. hudbar_measure.py and sheet_grid.py logic unchanged. Private code/art stay in Dropbox, not this public repository.

**Actual checks:** six one-call CPU cuts exit0, no warnings,6Fluff/4radio each. Only2runtime raster images change;40others pixel-identical. Other four skin records unchanged; Teal changes knob+knobAt, Hazard only knob. Negative cases reject missing Hazard plate with siren retained and missing Teal genuine arrow with bolt retained. Both alpha edges≤2px. Patch applies in isolated baseline. Fresh ZIP extraction verifies66internal hashes, rebuilds six cuts and reproduces both deployment WebPs byte-for-byte. These are static/cutter checks, not game acceptance. No game/browser/GPU tests or game source writes by this chat.

**Saved R11:** /CLAUDE/KFB Claymation Reference/KFB_MixedBag_HUD_Cutter_Fix_R11_2026-11-05.zip; Dropbox id:KeQLaY5-IIAAAAAAAA7ffQ;23295824bytes;67files;SHA256 f15c6a2eba8341cc19d82be769cf8fedfddcae664997b4c1f1e19ccf739e81f0. Upload COMPLETED. Includes patch/helper, exact baseline, source pairs, cut/teal+hazard, deploy/hudkit PNG/WebP, two-record deploy/hudbar.r11.json, reproducible checks and native before/after proof. Public evidence HUD_CUTTER_REPAIR_R11_QA.json at checkpoint01abf89a52e5b2d3cafa8e786dd96af2b2ca3d51.

**One next gate:** Kartenkante applies the private two-file cutter patch and imports only Teal/Hazard knobs plus their two data records (or existing import-cut.py for these two supplied cut sets), preserving other skins, then includes these corrections in its already-running acceptance cycle. No new layouts, frames, icons, skins, action bars or parallel test matrix. No merge or Live promotion.

---

## Historical checkpoints · superseded where R11 conflicts

# KFB Clay HUD Production SOP · R10 · 2026-11-05

## CURRENT R10 · CUTTER REPAIR + RECEIVING INTEGRATION / RESTART HOLD

Georg explicitly authorized finishing Steam/Slime cuts and integrating all six skins with Kartenkante. Kartenkante remains the sole runtime writer. This art chat repaired/tested scripts in its own output, sent them directly to the existing Claude Code session, and verified receiving artifacts without racing the worktree or taking a second GPU/browser slot.

- Original R4 source images remain unchanged. If legacy six-cell detection is invalid, measure the longest opaque continuous body band (>=75% of maximum row coverage), excluding head/antenna height, and retain the existing six/radius/location/spacing checks against that body reference. No per-skin detector coordinates. Missing-well negative cases must still fail.
- Pass the already measured geometric arrow position into measure; do not calculate medians from an empty yellow mask. Current six one-call cuts exit0, each6Fluff/4radio at1476native pixels. Twelve previously working exported bitmaps remain identical to current baseline;12Steam/Slime centers match independent earlier evidence. Two five-well negative tests fail correctly. Expected existing arrow-downsampling notices remain explicit.
- Import native images WITH their same hudbar data and measured radio coordinates; do not mix differently cropped source/cutter images. R9 surfaces stay shared master geometry in the six measured palettes. No rejected R7 slot frames or new object/glyph art.
- Use the existing R8 common12role set, with shared actual3DHero-Shots taking precedence. Jump and travel must be distinct; no per-skin400content images. Actual receiving base has12entries and skins{}.
- ActK reads180source height from action_surface, with separate glyph budget. Layout must invalidate after asynchronous KIT loading, or RetinaLarge stays at fallback144 instead of177. Actual1440x900DPR2Large177<=180 has been measured for all six in the pre-final matrix.
- Browser border-image seams on the action surface were fixed by receiving code: compose its nine pieces once on one native-height180canvas, then scale that single surface. Preserve caps and blank interior; no blur or extra cell rims. Other panel seam review is not globally claimed complete.
- New skin selection is in Settings > Game > HUD skin, with hash choice taking precedence and stored preference. Action size changes immediately. Flat round button surfaces follow Georg's newer V-1498/q528 concept; no rim/cavity per place, neutral content.

**Verified remote recovery:** game module/hud-clay-r1@ac4a433f6f921f8c552a4c00fbc73604e149e7b5, private art assets/private@2f96ab217de15ee587a1d22f1d6a150b45f70ba5.154required built files match exact remote Git blobs. Code/data/source files fetched at immutable head. No merge/Live promotion.

**Evidence boundary:** independent cutter critic PASS. A first actual six-skin24case/72state-image matrix ran before the final R8/canvas corrections; initial image critic found issues. On the last committed state only Retro's4cases ran. Do NOT combine pre-final other-skin images with final Retro into a final-six PASS. Final independent image review remains pending. Current receiving findings: Hazard siren/gear semantic selection and tiny Teal arrow need resolution/review; successful role counts alone do not certify semantics.

**Explicit restart stop:** Georg asked in the running session to shut down/restart for UI bugs. Kartenkante stopped server/browser; this chat terminated its own remaining monitor. Start no new jobs until Georg/WS0 resumes. After resumption Kartenkante has the first reserved browser slot: resolve remaining cut semantics, run all6x4cases on the final source/art pair, retain empty/hover/pressed and neutral-content evidence, get independent critic and leave a usable game-review preview. This is outstanding work, not a completed all-skin acceptance.

Private immutable cutter delta: KFB_MixedBag_HUD_Cutter_Fix_R10_2026-11-05.zip,39694097bytes,SHA256aa8bd8fc812225c1fa246a379fac233ce41bd4d83fb32c9980b2e06fe06e2735,Dropbox id:KeQLaY5-IIAAAAAAAA7enA. Public recovery QA: HUD_CUTTER_REPAIR_R10_QA.json (evidence checkpointd801dfe0b0b675c2bba12da66491ad2679238ebc). Private source scripts stay in private game/Dropbox, not copied into public authoring Git.

## Superseded R9 checkpoint


## CURRENT R9 · HUD SURFACES, SHARED CONTENT, ONE ACTION OUTER EDGE

Georg's latest explicit production request supersedes R8's base-only production priority. R8 common glyphs already exist; do not produce further object/weapon/gear/power-up or role images. Finish the missing existing HUD surfaces and controls for Retro, Steam, Teal, Reactor Blue, Slime Green and Hazard v2. The garbled audio “Hälfte” is NOT a size instruction.

- Reuse actual current panel, pill, tab, slider, toggle, title and satellite-panel donors; inspect source pixels before composition. Recolor with existing pure hudskin module and colors measured from native delivered R4 skins. Preserve canonical free-X alpha geometry.
- The action background is ONE continuous blank surface with ONE outer edge. Its internal role positions have ZERO separate frames, wells, rings, pillows, tiles or painted cells. No bar_1..bar_8 family, including the rejected R7. One stretchable background plus existing runtime anchors covers the four fixed roles; travel remains separate.
- R9 native action surface832×180 is derived from current panel1024×575 using nine source patches118px and destination caps32px. Every patch is downsampled or unchanged, never enlarged. Source slices, clean-alpha PNGs, lossless WebPs and source hashes are provided. At DPR2 the L2Normal141.6px and Large177px fit inside180source pixels. Runtime must still cap by actual source budget.
- Shared canonical 3D Hero-Shots remain unchanged across skins; R8 role glyphs stay common fallbacks/actions. No400+per-skin content art. Runtime labels/key hints only; Fredoka mixed case, minimum14reference px, padding and label fit. No baked text.
- Buttons, tabs, sliders, switches, panels and close-X retain distinct roles. Active tab taller/gold; inactive shorter/cream. No Hazard stripe under tabs. Radio-title fields retain existing semantic regions; never reuse them as action compartments.
- Manifest declares each piece, aliases, native dimensions, slices, shared-content boundary, source hashes, states and layers. Hover/press/disabled/locked/cooldown derive from runtime layers with stable hitboxes and reduced-motion support; no duplicate raster-frame requirement.
- Deliver private deploy/hudkit files under existing receiver naming, plus editable PNGs, build inputs/scripts, static proofs and actual QA. Existing receiver needs a bounded binding change from per-place bar_n art to one action_surface background; manifest alone does not implement it.
- Keep R4 signature bar/sheet cutter holds for Steam and Slime explicit. These are independent inherited gates, not new surface QA failures and not permission to change accepted native bar art.
- Existing owner Kartenkante imports and verifies actual Compact/Normal/Large in game. Do not claim runtime integration from local composition or a saved ZIP. No game runtime owner replacement or automatic merge.

WS0/Kartenkante correction was posted, read back and verified as PR468 comment6643804099. It is a PR handoff, not proof of a WS0 response.

## Superseded R8 production-priority record


## CURRENT GEORG/WS0 CORRECTION R8 · BASE ONLY / BORDERLESS PLACES / R7 RETRACTED · 2026-11-04

Georg explicitly rejected R7: it still has empty-slot rims. User-relayed WS0/Kartenkante addendum is BINDING over the older wording still visible in GitHub §2c:
- The action tray is ONE supporting surface with ONE outer edge. Every place inside is BORDERLESS. No per-slot rim, cavity outline, ring, pillow, tile or duplicate frame. Glyph/content sits directly on that surface.
- Original Auftrag4 (double-height bar_1…bar_8 sources) is CANCELLED. Do not continue or integrate that family.
- R7 gray/tinted8+48slot files and their montage are RETRACTED / DO_NOT_USE, despite their passing geometric tests. The package remains historical failure evidence only. R6brown/beige draft also remains rejected. Do not interpret either as a new skin or legitimate Master.
- FIRST delivery is a BASE GLYPH ATLAS ONLY:1536×1024RGBA,4×3cells344×296,32pxgaps/margins, alpha0 outside contours. Exact role order fist,grenade,jump,boost / hand,talk,pickup,enter / exit,land,heal,travel.
- Base must read at Compact0.85. Skin cells may be empty -> base role. No I/Space or other key/text in raster. Runtime hints and states stay existing-owner layers.
- Glyphs have no separate pedestal,plate,ring,frame or uniform raised backing contour. Intrinsic object features (grenade pull-ring, boot sole, semantic doorway arch) are part of the depicted object, not UI containers. Landing glyph needs no ground plinth.
- Retain the one neutral actual-object Hero-Shot per canonical asset across skins; role glyphs cover actions/defaults only. No400+per-skin object drawing or added content frame.
- Current fetched HUD_SKIN_SPEC §2c blob18ea7842190378daf4e09fc7a1dd4fd870e0d3fa still says “Mulde ist der einzige Container” and288source work. That stale text is NOT authority to override the explicit latest user/WS0correction. No runtime write here; receiving owner updates its own spec/code.
- Receiving gate: Kartenkante cuts the completed base with current cut-glyphs.py in ONE call and shows Compact/Normal/Large in the actual game. This art chat provides base only and does not reintroduce trays or an unsolicited replacement layout.

## REJECTED/SUPERSEDED R7 · productive288source-conditioned master candidates · 2026-11-04

Georg authorized productive continuation after R6. The rejected brown/beige tray remains excluded. A FRESH native image job used ONLY the actual existing graphite-gray bar_4.png as the visual donor. No larger original was recovered: this is explicitly a SOURCE-CONDITIONED NATIVE RE-RENDER CANDIDATE, not pixel-identical original art or an accepted seventh skin.

- New source2172×724RGBA; isolated tray2090×610. Existing gray palette/construction retained as the donor direction. No invented symbols, extra frame,pillow,plaque,hardware or skin decoration. No scripted enlargement of144pxsource pixels.
- Eight standalone neutral bar_1…bar_8 PNGs, each288high; widths274/500/724/948/1172/1396/1620/1844 (old receiving widths×2). Downsampled native patches protect176pxwell floors and fit plain carrier regions; cap/cell repetition produces the size family. No feather/blur joins. This is one native source assembled into eight sizes, not eight generated originals.
- Independent image-component measurement detects36cavities across8trays, exactly npertray. Mitten for n>=2:x137+224i,y142;1er:x136,y142,1nativepx from old-center target137, openly recorded. Contour soft edge<=3px; outside alpha0. Actual centers/bounds, segment transforms, source hashes and original comparison in MASTER_MANIFEST.json.
- Existing unmodified hudskin.py/recolor and skins.r2.json produce48lossless tinted WebPs for the SAME six runtime IDs. Alpha masks remain byte-identical. Neutral gray is an asset source, not a new runtime skin. Do not recolor the item foreground.
- SAME_CONTENT_SIX_SKINS.jpg is a local composition proof: one identical existing rocket-launcher PNG in Primary, existing role glyphs in Secondary/Movement, empty Context. It is NOT a game screenshot. The PNG's actual3Dmodel provenance was not independently verified, so it is a shared-content layout fixture, not a completed Hero-Shot pipeline.
- Existing actionSize.js locally permits requested Large1.25with288source height;144source capped at1.016949at70.8referencepx,DPR2. Auto behavior unchanged. This is source-code/asset proof only, not an installed UI change. No slot-group positions/reflow/new settings.
- Receiving use stays current: neutral sources for src/assets/hud_v6/ui/bar_n.png, colored sk_<skin>_ui_bar_n.webp in existing hudkit. This chat stages files only; receiving owner integrates and proves normal/large, 1er optical alignment, controls/states and source-identity Hero-Shot use in game.

This supersedes ONLY the missing288asset output status in R6. R6's no-added-frame/no-new-skin and single-neutral-object-Hero-Shot requirements remain binding. Source likeness and actual HUD assembly remain candidate acceptance, never inferred from automated counters. Preserve R4/R5 artifacts and unresolved Sheet1detector seams. Next gate: Kartenkante consumes the measured candidates in the existing owner and returns actual game/readability evidence; Georg is not asked for another speculative file/design decision in this authoring step.

## PREVIOUS GEORG CORRECTION R6 · shared object Hero-Shots / no added frames / no new skin · 2026-11-04

Georg clarified the conceptual boundary: collected props, weapons, gear and power-ups must use their actual3DHero-Shot icons.400+objects do NOT require400+new drawings for every skin. He explicitly rejected unnecessary frames and identified the fresh brown/beige tray draft as an unrequested new skin. That draft is REJECTED/QUARANTINED, not a new Master or seventh skin. Its raw source SHA256 is51b65d3152fdc13c4f7f8c613bd71ff2f72e9c6087de3adc5b3db14e0a14fe4f; no runtime/catalog/skin registration or Dropbox delivery occurred.

**Mandatory separation, existing owners retained:**
- Skin owns the existing carrier/well surfaces and existing state treatment. One functional cavity rim only. No additional tile,pillow,plaque,ornamental outer frame or baked icon surround. The previous request to repaint the base never authorizes inventing a new visual skin.
- A role glyph means an ACTION: jump,boost,talk,pickup,etc.; fist/grenade/travel are the defined default role cases. The twelve base/skin glyphs are not the object catalog.
- A selected/acquired actual object uses ONE skin-neutral Hero-Shot tied to its canonical asset identity/source revision through the existing asset/thumbnail owner. The same content pixels/ref are reused across all six skins; changing skin must not recolor the actual object or generate another thumbnail. Reuse the existing Hero-Shot/cache pipeline; do not create a new rendering/runtime owner.
- Actual object content takes precedence over the default role drawing when the slot represents a selected item. A concrete selected weapon is shown as itself, not replaced by a themed Faust/Granate because its id is absent from a small lookup table. Unarmed/default role is a distinct case. Missing Hero-Shot must be diagnosed in the existing owner, never silently mislabeled as another object. This is a binding intake requirement, not a claimed implemented resolver.
- Fixed context actions such as pickup keep their role cue/I; the picked-up object's actual picture belongs at its approved inventory/selection/receipt location. No return of item slots in the fixed four-action bar, no layout move.
- Hero-Shot/glyph is a transparent foreground inside the existing well with contain/optical padding; long/narrow objects retain aspect ratio. Labels/I, cooldown, lock/selection/focus are separate runtime layers. No second functional frame; no tiny extra container around the thumbnail.

**Measured receiving seam (not fixed by this art chat):** current src/hud/hudV6.js blob4b5899b9be3ae051135b78eecf3631d7a66e8c69 lines30,249,401 uses a small WEAPON_ICON key mapping and generic gun/fist fallbacks; line239 hides the duplicate pillow in skin mode. This is not evidence of complete400+per-object Hero-Shot support. Kartenkante must route canonical content refs through current inventory/asset owners; no runtime right is taken here. Actual scene-to-thumbnail pipeline/catalog coverage was not exhaustively audited.

**Native288source gate:** checked current canonical ui/bar_1/4/8.png are137×144,474×144,922×144. Bar_4 blobfcd6d7a9f45da77774c48a37eefa088204894e11. Two local HUD archives checked do not supply a matching native288tray source (R5empty rails88–101high; 3Dpacket has action objects but no tray mesh). Current144source height and115render reference must not be conflated; preserve original proportions and measured centers. No interpolation enlargement, palette redesign or new double border is an acceptable substitute for the original high-resolution/model source. Native288output is NOT delivered.

Next authoring gate: obtain the existing tray's actual higher-resolution/model source from the owning pipeline, then export the same basis sharply. Continue only source-faithful art; do not generate another speculative tray design. Existing six skin directions and R5base delivery remain candidates under their previously recorded decisions; this correction is specific to the unwanted tray draft and content architecture. Next integration gate: one actual object Hero-Shot reused unchanged across six skins in the existing well, with no extra frame and actual readability/state proof.

## PREVIOUS R5 ADDENDUM · shared base first / receiving §2c · 2026-11-04

User relayed WS0's “HUD-Chat: Bogen 2 (Aktions-Glyphen) – verbindliche Zellenfolge und Basis-Satz”. Verified against CURRENT receiving HUD_SKIN_SPEC.md §2c (blob18ea7842190378daf4e09fc7a1dd4fd870e0d3fa), cut-glyphs.py (451cbac818f0228ed8982dd41715bc48df0cc45f), glyphs.js (ccfc579bbf5d7d07809788e89ef62cf0c82de774), actionSize.js (8c1c7f995319e65763a0f63a0287ea9c9e5d61ed) and hud-glyphs.r1.json (1348b4950d6876c81974839b546612fa90650f73). This addendum supersedes the earlier “future shared set / sizing proposal” status and the requirement that every future skin must repaint all12roles. The actual Hub note itself was not recovered; its supplied title/message is corroborated by these exact receiving sources, not falsely claimed as independently read.

- Deliver FIRST one COMPLETE shared base,12roles. Skin sheets may leave cells empty: skin override -> base. Before base intake the old v6 symbols remain transitional; glyphs=v6 is an explicit comparison override. A complete base must have all12roles; never leave a functional role undefined.
- Exact row-major cells: fist,grenade,jump,boost / hand,talk,pickup,enter / exit,land,heal,travel. Existing six R4 atlases already use this semantic order; no regeneration or reordered guess is needed. R4 names primary_fist etc. are descriptive authoring aliases; current cutter exports canonical role keys above.
- Native final atlas1536×1024RGBA; cells344×296 at x32+376i,y32+328j,32px gutters/margins. One free glyph with contour margin, no separate button backing or frame. I and all labels remain runtime-only. No upscaling or blur.
- Run current unmodified cut-glyphs.py <sheet.png> <base|skin_id> <hudkit-dir> --data <local staged hud-glyphs.r1.json>. Base FIRST, then optional skin sets. Keep source native atlas, individual PNGs and lossless WebPs. No image interpolation enlargement; empty skin cell means omission from that skin's initial intake.
- Deliver a receiver-ready DATA CANDIDATE, not a runtime write: hud-glyphs.r1.json plus glyph_base_<role>.webp and optional glyph_<skin>_<role>.webp. Existing runtime owns installation. Further partial updates/deleting old overrides require owner reconciliation: the current cutter skips empty cells and does not erase an older entry when reusing a populated data file. Authoring tests therefore start from the pinned empty receiving template.
- Action Size is now BUILT by Kartenkante/WS0 in source: auto/compact/normal/large; compact0.85,normal1,large1.25; Auto compact below1080 reference width. Source-pixel cap limits Large, so144px source trays allow little extra at Standard Retina;288px Master-Kit remains the next required art group. No new user setting/code owner from this chat.
- Normal/hover/focus/pressed/cooldown/locked/hidden still derive from base art and existing overlays/transforms. Source-module fixture checks are not a game/visual acceptance. All-six state/format proof remains with Kartenkante, WS0 integration acceptance and Georg visual decision.

## PREVIOUS R4 AUTHORITY · HUD_CONTRACT_R1 · 2026-11-04
WS0/Kartenkante answered all nine audit questions. The binding owner is georg-doc/KFB-Stunt-Car-Race, branch module/hud-clay-r1, docs/hud-kit/HUD_CONTRACT_R1.md, user-reported stand5c8d0c52, fetched blob8d52e2292ac259c9ddf150cfe3e0cb18628f97be. This overrides conflicting legacy instructions below and the unanswered-question status of the audit. No question is reopened for Georg. Runtime owner alone implements changes.
- Exactly FOUR FIXED main action wells: Primary,Secondary,Movement,Context, bottom-center L2. Context never moves; empty when unavailable. No items in action bar. Travel is a separate bar_1; backpack button removed. Inventory belongs in Almanac. Popovers still need bar_1..6 weapons and bar_1..8 travel.
- Movement=Jump on foot (double=jetpack),Boost in drive/fly. Context=Talk,Pick-up,Enter,Heal,Land,Exit. Actions hidden during conversation; targeting is an overlay,not a separate mode. No legacy2-slot talk action strip.
- L2 tray height70.8reference px. Master trays288source px; first center0.596h,pitch0.974h,well diameter0.77h,actual centers measured. Glyph78%ofwell. Pill horizontal padding0.5fontsize; labels>=14after scaling. X visible0.36A,hit area>=0.75A centered,title height. Existing isolated brown X only recolored.
- Standard Retina1440x900DPR2 is acceptance. Large Retina deferred,no upscaling. Native-source cut export retains source pixel width(1476with padded Retro crop),logical bar units1046; imgScale translates cuts. Old1046-source export/cell-first-six holds are resolved by Kartenkante in f796bd80. RetroR3 cuts without warnings per owner; actual game evidence pending next slot,not inferred accepted.
- Sheet1: native-source1536x1024 pair1a/1b,32edge/gaps,exactalpha0background,softedge<=3px.1a closed/open width1472 x32..1504; closed y32..352,open384..992; BODY excluding head>=9:1.1b radio leftx32..432>=860h;rightcols464/816/1168,topgears/arrow,3–5details below. No upscaling,recoloring,blur or feather joins.
- NEXT production order: Steam,Teal,Reactor Blue,Slime Green,Hazard v2 pairs;then Sheet2 for all skins. Preserve existing source designs and theme-specific heads; don't mutate all into satellites. Original references inspected and passed as actualpixels. No automatic review stop between routine conforming variants; quarantine only failing seam.
- Sheet2:1536x1024RGBA,4columns×3rows,344×296cells atx32+376i,y32+328j,32gaps andoutermargin. Twelve role glyphs: fist,grenade,jump,boost,generic hand,talk,pick-up,enter,exit,land,heal,travel. Waypoint arrow must also be delivered as an isolated companion PNG from the existing approved direction-arrow source; do not silently replace one of12roles or invent a13thcell. Shared neutral direction arrow may remain separately referenced when source contract requires. Native2D production only; no upscaling.
- I is runtime hint from ACTION_KEYS.interact,NEVER painted. No separate pressed/cooldown/locked bitmaps:code derives states from base,lock overlay,color filling upward. Emptycontext=no glyph/noI;nearcontext=role+I,pulse.
- Weapon/throwable/vehicle/travel pictures are neutral CONTENT. Do not paint every content item per skin. Role glyphs remain required.
- Sheet3/travel strips and minimap DEFERRED: not in approved HUD. No production until new explicit Auftrag. Neutral master is still needed; do not silently treat deferred parts as done.
- Hazard stripes ONLY bottom panel anddraweredge;upperedge/tabbed area clear. Active tab higher/lightgold connected to panel;inactive lower/darker. Oneframe perfunction,no nested pillows under glyphs. Waypoint is FREESTANDING greenarrow/name/distance,no panel/plaque. Almanac carries cards flush,including inventory.
- Typography: Fredoka mixed case in ALL HUD including waypoint/Almanac counters;30title/22head/18body/14small. No Bangers in HUD. Skin displaytype for titles only after Georg image approval;runtime text/keys/numbers never baked. Focus=hover;motiontransform-only0.14s cubic-bezier(.3,1.6,.5,1),stable hitbox/group;ReduceMotion disables pulse/spring.
- Neutral: reticle,targeting,loading-chip,Fluff colors,speech/dialogue,cardhero/flight,curtain andcontentimages. Pause=Settings,Portal=HUDhidden.
- CoverageR2/integration screenshots+measurements are Kartenkante's duty;WS0 accepts eachline;Georg decidesdesign. WSA suppliesart/manifest,NO runtime rights. Windowmin/max remain MEASURE_REQUIRED for Kartenkante's formatmatrix,not a new user question.

## Georg feedback · bases, optional future glyph themes and sizing · 2026-11-04

**Recorded user feedback, not a gameplay acceptance:** Georg likes the six skin directions. He clarified that his original request concerned the bases/wells on which icons sit; the newly themed glyphs were an unexpected addition. He is interested in keeping them if consistent in-game assembly preserves readability and avoids bulky UI. This is positive visual direction, not an unconditional PASS for all72glyphs, states, controls or gameplay.

**Binding design emphasis:** complete the neutral Master-Kit slot bases and clean single-frame assembly. Container/well, role glyph, content image, key label and state overlay remain separate layers. Existing painted role sets are retained. Preserve the same role silhouette, orientation and optical size across themes; theme detail must not defeat recognition at the actual gameplay size. No extra frame/pillow under a role glyph. Weapon/vehicle/travel content remains neutral.

**PROPOSAL — future skin cost:** use a complete canonical shared role-glyph set as fallback; a future skin may optionally replace roles by explicit manifest references. Resolve skin override -> shared role asset, never a blank/missing action or a guessed item thumbnail. This does not relax the current receiving HUD_CONTRACT_R1 requirement for12themed roles in the present six skins. No second runtime resolver or newly approved shared set is claimed here.

**PROPOSAL — user sizing, requested as a possibility:** begin with one Action Size preference, default Auto (responsive), optionally Compact/Normal/Large after measured limits. Scale the action group coherently: carrier, well, glyph, key hint, spacing and state overlays. Keep its bottom-center L2 anchor and fixed slot ordering, with the travel control beside it; size preference never changes slot count or moves context. Motion remains a separate transform inside stable geometry/hitboxes.

Do not promise one unrestricted global HUD zoom. The near-full-width header has less native pixel headroom than action glyphs; scaling every component by an arbitrary125% could violate the no-upscale/Standard-Retina contract. Each component must respect available viewport/zone bounds, source pixels at actual DPR, readable labels (current contract minimum14px), and non-overlapping useful pointer/touch targets. Suggested all-action hit-target floor44reference px is a proposal, not an already implemented measured fact. If a requested size cannot fit sharply, clamp that group or use the existing compact presentation; do not blur/enlarge raster art or shrink labels below their floor. Remember user preference; Auto/reset remains available.

**Receiving proof still needed:** compare all six skins with the same neutral and themed role/content cases at actual48/64px and in the game, including empty context, I, cooldown/locked, focus/pressed, travel/weapon popovers, compact viewport and reduced motion. Determine whether fine glyph detail survives or needs simplification. Sizing is a documented concept only; exact ranges, default behavior and actual usability need Kartenkante's existing runtime/format matrix. No runtime implementation authorized or performed by this art chat.

## Superseded discussion and bounded history

## Current full-system completeness / Georg design authority
Before treating a skin as complete, read docs/hud-kit/WS0_HUD_COMPLETENESS_AND_DESIGN_REVIEW_R1.md (04.11.2026). Its section2 captures binding Georg requirements; section6 contains open WS0/Kartenkante decisions, not invented answers. Sheet1 pair is only one delivery group, not full HUD coverage. Existing master components must be applied consistently to all HUD modules; Action Sheet2, dynamic slot containers, travel Sheet3, master resolution, states, typography and integration remain required.
One functional frame per control: free glyph inside existing well; no nested blank-slot/icon frames. Close-X is a canonical isolated shared standard. Button/tab/slider/panel roles stay distinct. Hazard stripe must not undermine tab contour/active-tab relationship. Responsive headers have explicit min/max/content regions, anchors and protected zones. Stable hitboxes/layout during cartoon hover/pressed/active motion. Per-state manifest may resolve a base asset plus code/overlay; do not require eight duplicate raster variants. Keep proper padding and readable case; Bangers is not the universal headline or all-caps default. Fredoka is the current baseline; skin-specific type families need an explicit typography decision, licensed fallbacks and measured label fit. Source→cut→runtime resolution must be proven, not inferred from atlas dimensions. No blurred joins to conceal malformed assembly.
Actual source audit: hudV6 main bar3..6=Primary+Secondary+0..3Items+Interact, plus Travel/Backpack; this differs from old3+2 docs and declared mode roles. Resolve this contract with WS0, rather than silently inventing another layout. A complete Retro kit in the actual HUD is the full-system acceptance target; decorative pilot success alone never closes it.


## CURRENT OVERRIDE · R3 · Sheet1 pair / WS0 + Kartenkante · 2026-11-04
This section supersedes the earlier single2048 Sheet1/native-resolution gate and whole-header9:1 fitting below. User relayed current runtime HUD_SKIN_SPEC.md §2a, blob e78a6a8556b4875436c0a1a924283bfd69b807d1 on module/hud-clay-r1. Original attempt1 design accepted; original attempt2 rejected because CLOSED wrongly has a drawer. The later softened2048 montage is not the new source canon.
- First deliver Retro as TWO native-source composed1536x1024 RGBA sheets, no upscaling/recoloring. Then same pair for Steam, Teal, Reactor Blue, Slime Green, Hazard v2. After Sheet1 pairs, Sheet2 actions and Sheet3 travel as commissioned.
- 1a: closed within x32..1504,y32..352; open within same x32..1504,y384..992. Both1472wide, same x position. Closed no drawer; open blank drawer + centered bottom arrow. BODY excluding head motif >=9:1; antenna/dish may extend upward inside band. Do not force full silhouette9:1 by squeezing head or blending strip joins.
- 1b: radio x32..432,y32..992, proportional, >=860high. Right columns x464..784,816..1136,1168..1504. Row1 y32..352 = gear normal,gear hover,arrow; rows2 y384..688 and3 y720..992 =3–5 details, unused cells empty.
- All margins,gutters,background exactlyalpha0. No detached red/yellow dust, external glow/shadow. Soft edge <=3px; preserve actual clay detail, no blanket blur or sharpening claim. Preserve internal lamp/tube emission as painted inside closed object contour only.
- User explicitly authorizes separate generated source parts + image-script assembly. Uniform downsampling only; document actual source dimensions and hashes. Background cleanup is explicit and bounded to an edge matte. No32px feathered joins on the closed bar.
- Acceptance check: current sheet_grid.check_pair plus explicit cell occupancy, edge-width and background tests. Current cutter command: cut-sheet1.py <1a> retro <HUD> <WORK> --b <1b>; owning add-skin.py exposes the same --b argument. Fetch current cut-sheet1.py,hudbar_measure.py,sheet_grid.py together. Run unchanged references in isolated output folders; never silence warnings or patch game runtime to claim source success.
- If artwork cells are correct but detector mistakes dish/grille for cells, preserve its exact detected coordinates/error and diagnostic source row; hand the smallest cutter seam to Kartenkante. Do not darken/recolor accepted art solely to bypass a detector, and do not label failed cutter execution PASS.
- Human acceptance of original attempt1 design does not automatically accept newly assembled pair pixels. Return exact source pair, hashes,actual tests and one next gate. User will forward WS0; no automatic chat message.

## Legacy single-sheet history (superseded for new Sheet1 production)
Owner: WSA HUD authoring, commissioned by WS0. Receiving runtime: georg-doc/KFB-Stunt-Car-Race, module/hud-clay-r1. Authoring branch: design/kfb-clay-hud-skin-kit-r1-2026-11-04, PR #468. No second runtime, no layout movement, no automatic merge or publication.

## Read and inspect
Read current skills/chat/START_HERE.md, CHAT_GITHUB_KFB_STAGE_WORKFLOW.md, FRESH_CHAT_SLICE_PROTOCOL.md, docs/hud-kit/RETURN.md and HUD_SKIN_SPEC.md in this branch. Runtime HUD_SKIN_SPEC.md, HUD_COVERAGE_R1.md/.json and HUD_LAYOUT_R2.md control geometry, coverage and layout. Method donor: sibling WS0_BLACK_INK_BLOB_SERIES/SOP_INK_MONSTERS_R2.md; its monster anatomy and stopped monster batch do not govern HUD imagery.
User commission supersedes old Hazard-first queue: FIRST one Retro Sheet1 pilot; only then remaining skins and sheets. Keep actual donor pixels, SHA256 and input roles. Open donor in isolation; filenames/URLs alone are not conditioning. Rejected outputs never become style parents.

## Closed delivery roster and sequence
1. Sheet1 per Retro, Steam, Teal, Reactor Blue, Slime Green, Hazard v2.
2. Sheet2 painted in each skin, not merely neutral v6 recolors.
3. Sheet3 travel strips per skin.
4. Neutral master once: bar_1..bar_8 at 288px high, minimap compass lid open/closed.
Pause uses Settings; portal transition hides HUD. Neither needs new artwork.
No generic panels, toggles, sliders, tabs, plaques or replacement typography per skin. Counts, labels, maps and telemetry remain code-owned.

## Sheet1 exact contract
2048x2048 native RGBA. Outer clear alpha margin >=32. Band allocations: closed y32..462 (430 high), open y494..1059 (565), lower y1091..2016 (925). Gaps >=32 including antialiased pixels. Both header strips width:height 9:1; open state adds empty drawer. Six empty round cells, one wide empty number field, signature head/endcap. Never put values or Fluff balls in wells.
Lower left freestanding closed-contour radio <=861 high, four empty square sockets, three lamps and theme grille/electric detail. Radio stays left in game; code neutral panel opens right. Lower right: gear normal/hover, arrow, 3–5 theme details. No cut-off dish, antenna or hinge.

## Sheet2 exact contract
2048x2048, four rows/four columns, 512px cells; every glyph within its own cell with >=32px padding, actual alpha. Row1 fist, grenade, jump boot, interact hand with key I. Row2 same four pressed. Row3 backpack, carrot, play-card, boost lightning. Row4 exit vehicle, land, two skin-signature details. User's I is the sole explicit text exception; no Bangers capitals. Paint skin-specific tactile shapes. Attach accepted Sheet1 as family reference; do not propagate rejected candidates.

## Sheet3 contract
2048x2048, proposed inner 2 columns x3 rows of 992x640, outer32 and intercell32. Six cells: upper terminal, lower terminal, plain stretchable middle, empty zone-band housing, altitude tube/cap, fuel tube/cap. No baked scale, speed or colored telemetry. Preserve motif features as fixed overlays; stretch only plain straight middle. Proposal must be reconciled with Kartenkante cutter before claiming automatic extraction. Artwork does not authorize changing HUD_LAYOUT_R2.

## Master contract
Neutral dark brown rim (93,77,65), beige fill (213,196,169), gold (251,196,69). Use actual existing donor geometry. Slot bars double source height (288); minimap open/closed in two1024 cells. Never pretend enlarged low-resolution pixels are newly resolved Retina artwork. Minimap placement stays receiving-owner work.

## Generation and QA
Use actual image generator, one pilot job at a time, original reference pixels attached as STYLE_REFERENCE. Matte modeled plasticine, restrained fingerprints, light upper left, clean consistent contours, empty recesses, no floor/drop-shadow/background/checkerboard. Preserve tool receipt and exact arguments; no invented model/seed IDs.
Record original decoded dimensions, mode, SHA256, byte count and alpha histogram; test all border and band gaps, component separation and full silhouettes. Never silently upscale a wrong-size output and certify native2048. Run existing runtime cut-sheet1.py and hudbar_measure.py when accessible. Components and per-skin9-slice coordinates must be measured, never copied from placeholder manifests.
Inspect each part at source and48/64px on light/dark; compare donor/candidate and closed/open. Technical pass, independent critique, Georg design verdict, Dropbox archival and game integration remain separate. Builder never self-certifies final acceptance.
Two non-improving repairs: retain original failed images/prompts/QA, quarantine smallest failing seam, stop that image strategy; continue useful SOP/coverage/handoff work. Do not spend remaining skin jobs on visible drift.

## Persistence and Return
At coherent implementation, material evidence and final Return boundaries persist recoverable state. Keep SOP next to Ink-Monster owner folder; authoring docs remain docs/hud-kit. After every GitHub write fetch exact branch head and intended file. Timeout=UNKNOWN, inspect before retry.
Archive lossless originals, donor identity, prompts, QA, manifest, crops and quarantined failures into a NEW MixedBag in Dropbox KFB Claymation Reference; never overwrite earlier MixedBags. Verify remote saved files, do not equate local copy with completed upload.
Return exact repo/branch/PR/head, files, actual tests, Dropbox location, unresolved items and one next gate to WS0. No Stage/Site needed for this asset-only delivery. No Hub churn or Live promotion.


## R2 · Explicit user-authorized individual generation + image-script assembly
2026-11-04: user chose separate generated parts assembled into exact2048 atlas WITHOUT upscaling. Whole-sheet prompt size is not a tool parameter. Use wide3:1 header sources (actual2172x724), tall radio source (724x2172), separate hardware. Preserve raw files. Crop by connected opaque silhouettes, retain adjacent antialias, remove disconnected dust/external shadow; record masks and source hashes. Never treat a square1254 sheet as Retina source.
Retro pilot R2 uses one continuous header; protects rounded ends and six wells, fits only straight lower rail/numeric field with downsampling and32px feather transitions. Every resize asserts output width/height <= source width/height. Header1980x220 is9:1 and pixel-identical in open/closed; original high-res donor supplies drawer. Atlas bands remain unchanged. Script/masks/source ledger and original native inputs are archived in MixedBag R2.
Technical evidence: ten structural checks pass; minimum sprite gap74.24px; original runtime cut-sheet1.py exits0, no warnings,6Fluff cells,4radio slots,3details. Note: source radio861px, cutter crop865 includes its2px dilation border. The cutter still exports bar at1046px; those outputs are compatibility evidence, NOT new Retina artwork. Full-resolution source crops and atlas remain deliverables. No game-layout/runtime patch or claim of integration. Human design acceptance and independent art review remain separate from structural tests.
