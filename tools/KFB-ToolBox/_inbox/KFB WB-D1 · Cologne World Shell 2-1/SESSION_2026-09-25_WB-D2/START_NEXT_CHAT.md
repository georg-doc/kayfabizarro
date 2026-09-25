# START NEXT CHAT · KFB World · WB-D shell · onboarding

**When:** once the **new WorldBuilder/editor is integrated**. Not before.
**Paste into the new chat:** this file, plus `HANDOVER_WSA.md`, `BACKLOG_SPRINTS.md` and `CHANGELOG.md` from this zip. Upload the `code/` folder into the project.

## You are continuing
A KFB world shell: real OSM zones in the KFB clay look (Elastic Grotesque Clay V2, palette KFB_WONKY_90S_CLAY_V1). One presenter, one seam, several frozen zone fixtures.
Entry: `KFB WB-D1 · Cologne World Shell.dc.html` (loads `wd1-boot.js`).

## Map of the code
| File | Role |
|---|---|
| `wd1-boot.js` | host: renderer, TinySkies light, `shadowFollow`, zones, cameras, UI bar + drawer, props |
| `wd1-seam.js` | `loadZone({kind})` → one form. Today `frozen-fixture`; later `world-zone-bake` |
| `wd1-city.js` | presenter: ground map (canvas), rails as geometry, Elastic Clay buildings, `FACADE_RULE` v1, wall sink |
| `wd1-names.js` | street names: `road` (text on the carriageway) · `signs` (sprites) · homebase ring + sign |
| `wd1-landmark.js` · `wd1-water.js` | Dom/Hbf (Köln only) · water presets |
| `w0-region.js` · `w0-ink.js` | **shared** with WB-W0, do not touch |
| `fixtures/*.json` | FROZEN: `cologne-dom-crop-v0` · `huerth-crop-v0` · `huerth-alstaedten-v0` |

## Settings
- **Zone:** localStorage `wd1.zone` = `cologne-dom` | `huerth` | `alstaedten` (chip in the bar, reloads).
- **Facade:** `wd1.facade` = `rule-v1` | `owner`.
- **DC props:** `view`, `bend`, `torsion`, `chrome`, `ghosts`, `names` (`off|road|signs|both`).
- **Cameras:** region / street / top / home (Alstädten).
- **Debug:** `window.__wd1` exposes `X`, `S`, `scene`, `camTo`, `report()`.

## Rules (from the CHANGE LOCK in HANDOVER_WSA.md)
- Additive only: new zones, modules and props are fine. Frozen fixtures, seam field names, facade rule v1 and the donor pins are **never** rewritten.
- The CHANGELOG is append-only.
- No new OSM fetch without the WSA lead's OK. If one happens anyway: raw sha256 in the fixture, name the rule deviation, and ask the OSM City Lab to re-cache.
- Working style with Georg: German, short, no filler. Name findings, don't smooth them over.

## First steps in the new chat
1. **Read the contract of the new WorldBuilder/editor.** Does it replace edit-layer @8922d4b1? Does it bring its own zone or world contract?
2. **Dock the shell:** `wd1-seam.js` gets an adapter for the new format if needed, and the editor attaches via `G.edit` (today only Dom/Hbf, Köln). The presenter stays unchanged.
3. Then Sprint 2 from `BACKLOG_SPRINTS.md`: **B1** (road edges as geometry), **B2** (signs at the road edge, no pin), **Ehrenfeld** zone (Grimmstr. 8).

## Check at start (clean run)
- [ ] Each of the three zones loads, and the log has no ✗
- [ ] Alstädten starts at the home camera; gold ring and sign on Stotzheimer Str. 26
- [ ] House feet without a bright band (shadow touches the wall)
- [ ] details → Street names: off / on road / signs / both switch live
- [ ] details → Facade: "0 buildings without any detail"
