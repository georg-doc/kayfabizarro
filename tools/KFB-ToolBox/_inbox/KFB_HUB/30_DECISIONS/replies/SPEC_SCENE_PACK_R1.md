# SPEC scene packs `kfb.scene-pack/1` R1 (WS0, Georg 18.10., V-465) · unifies scenelets, setups and animation sets

**Why:** inventory 18.10. found about 13 incompatible formats:
- `kfb.resident-band-module/1`, `-disco-module/1`, `-graveyard-module/1`, `-fight-sandbox/2`, `-gunfight-duel/1`, `-scifi-module/1`, `-scene-module/1`, `kfb-resident-scene.v1.1`;
- `kfb.dance.run.v1`, `kfb.talk.run.v1`, `kfb.performance/1`, `kfb.stage-set/1`, hex recipe.

The planned unifier `kfb.resident-set/0.1` was never built. Everything is "candidate", with raw GLB paths and different time bases and Motion Library pins.

**One pack = one JSON + referenced files:**
- `id`, `title`, `kind`: band | dance | debate | fight | ambient-life | worksite | set …; `status`, `version`, `owner`.
- **`anchors`:**
  - `support` (base), `front` (viewing direction), `footprint` (polygon, compatible with `kfb.stage-edges/1`);
  - `clearance`, `entry[]`, `audience[]`, `camera[]` (hints);
  - `ground` (snap: terrain | stage-top | diorama-anchor).
- **`actors[]`:**
  - `role` (leader, drums, dancer3, …);
  - `figure` = **reference to the figure card** `figures/<id>.figure.json` + `variant` (V-391; eye rig mandatory, no raw GLB paths);
  - `slot` (position/rotation relative to `support`).
  - **Scale:** figures are never scaled (V-060); the pack adapts to them.
- **`props[]`:** catalog entry `kfb.catalog-entry/1` + transform + mount (`handslot.r` …) + `role` (stage-set roles).
- **`timeline`:** **one** time base for everything.
  - Either the music: `kfb.performance/1` (mix seconds, beats, bars, sections), or free (loop seconds).
  - `cues[]` per actor: `clipId` from the motion catalog (a pinned commit) + `timeScale` + `beatPhase` + `loop`.
  - Generated poses only as `gen` with fit rules.
  - `sfx[]`, `vfx[]`, `lights[]` as in V-389; audio stays with the Audio Site (V-388).
- **`rules`:** collision owned by the host; wander radius; relevance/sleep (only animated within the player's surroundings, V-464); variants as parameters.
- **`licence[]`:** per dependency `licence`, `redistribute` (yes/no), `visibility` (public | private | build-only), `attribution`.
- **`preview`:** thumbnail + 10 s clip for the Asset Library.

**Lifecycle (from the planned Resident Set):**
- `mount(host, anchor, opts) · update(dt, clock) · bounds() · snapshot() · dispose()`.
- Placement in God mode with the existing in-place editor (`edit-layer`, V-081/V-360): **Browse → Preview → Place → Accept/Revert**.
- Saved as a `kfb.world/1` op `place.put` with `kind: "pack"` (to be added to the world contract).

**Who does what:**
- **Authoring** stays in Claude Design (`KFB_Resident_Atlas`) for now, with an **export** to `kfb.scene-pack/1`. No new tool (V-390).
- **Asset Library** (Librarian) lists packs (new kind `scene-pack`).
- **Game/God mode** (WS1) places and plays them.
- **Later:** the ToolBox figure workshop can take over authoring once things are consolidated.

**First packs, in this order:**
1. **Orc band "The KayfaBizarros"** (most mature: lifecycle and anchors exist; drummer still parked).
2. **Mummy duet Pharaoh** (`kfb.performance/1` + B1 tempo, Georg's video PASS).
3. **Kayfabrick worksite** (bots B31, V-463).
4. Disco / graveyard after that.

**Gate R1:** band pack loads from the library, is placed in God mode at a monument anchor, plays in sync with the song, Accept/Revert works, survives save/reload.
