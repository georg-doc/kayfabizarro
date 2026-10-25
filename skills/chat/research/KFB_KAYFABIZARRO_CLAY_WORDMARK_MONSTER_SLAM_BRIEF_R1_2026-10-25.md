# KayfaBizarro — Typographic Monster Slam · Clay Wordmark R1
Date: 2026-10-25
Status: PROPOSAL / DESIGN-ONLY · NOT IMPLEMENTED · NOT ACCEPTED
Mode: RESEARCH / BOUNDED BRAND-MODULE PLANNING
Owner / receiving product: existing KayfaBizarro homepage `index.html` at `georg-doc/kayfabizarro`.
Working branch: `planning/kayfabizarro-typographic-monster-slam-2026-10-25`
Base source observed: `main@7e1c4ab0f143b2f1c0f33017eb473574f20190c9`
No new runtime, product owner, stage route or brand.

## 1. Georg's intent, preserved
- Turn the existing **KayfaBizarro** wordmark into a colorful, original **3D claymation lettering / playful brand module** for homepage hero, a compact header rendering and later reusable contexts.
- Reveal `Kayfabe` with a short **English dictionary-style definition**.
- `Bizarro` jumps in **from the right** with an exaggerated bent back and wrestling wind-up; it monster-slams the suffix **`be`** into colored clay particles/splatters in the letters' own pigment.
- Result: `Kayfa` + `Bizarro`, settling with elastic squash/stretch, deformation/recovery wave and subtle floating, tilting 3D idle.
- Existing `Irish Grover` is starting baseline, explicitly **not permanently locked**. More chromatic range, subtle gradients, tactile clay detail and real depth/shadows are requested.
- Desired result is the comic physical typographic performance. Keep the implementation technique solution-open until a small genuine visual proof wins.

## 2. Verified current website source / non-destructive constraints
Current authoritative page: root `index.html` (read from GitHub on 2026-10-25, blob SHA `7347135927c2ca7d67693a5cb1ed6ccfc04c4a84`).
- Google Fonts: Irish Grover (brand/display), Special Elite (labels); Literata also present for long-form reading.
- Existing two-tone DOM markup `<span class="kb-mark"><span class="a">Kayfa</span><span class="b">Bizarro</span></span>` is used in header and home hero.
- `.kb-mark .a` uses ink; `.kb-mark .b` is ivory on marker-red `#b8361f`, with hard offset shadow; it is NOT a free-floating font-only red treatment.
- Home `h1.hero-title` contains `kb-mark` plus `Social Story-Wrestling` tag. The FrizzleBob avatar remains a separate existing header mark.
- Existing homepage is a single-file/multi-page navigation surface. Leave page routing, existing links, navigation, DE route/text, content, avatar, scissor rail, halftone and other design intact.
- Existing `KAYFABIZARRO Design System.zip` is present in repository root as design source. Its binary contents and font rights were **not inspected here**; inspect before selecting a final material/font donor.
- Screenshot supplied by Georg is evidence of current intended page look, NOT proof of a 3D animation or imported mesh. No accepted 3D wordmark donor has yet been identified or shown in isolation.

## 3. The central visual gag (English on-screen copy)
Default dictionary-style copy, subject to editorial polish:
**Kayfabe** *(noun)* — “The art of presenting a staged performance as reality.”
Keep this short and legible long enough to read without becoming an explanatory interstitial. No new introductory screen or generic game UI.

### Motion/acting beat sheet (provisional 4.5–6 s hero first play)
| Beat | Approx. | Image and animation | Sound (optional; KFB Audio owner if consumed) |
|---|---:|---|---|
| 1. Definition | 0–1.4 s | `Kayfabe` appears as a confident physical word, neutral pose; unobtrusive English lexicon line | dry page/chalk contact |
| 2. Anticipation | 1.4–2.25 s | `be` shows an almost imperceptible recoil; `Bizarro` enters from off-right, whole lettering arched like a wrestler, held anticipation | short friction/stretch |
| 3. Monster slam | 2.25–2.8 s | `Bizarro` throws its mass onto `be`; contact/compression in one unmistakable silhouette; broken `be` disperses into clay-colour chunks/splats with motion continuity | one satisfying elastic thump |
| 4. Settle | 2.8–4.2 s | `Kayfa` receives a travelling deformation/recovery wave; `Bizarro` rebounds, wobbles, locks into the final wordmark; a few pigment particles fall | small delayed tremble |
| 5. Idle | 4.2 s onward | Correctly spelled `KayfaBizarro`; low-amplitude hover and restrained yaw/roll; visual remains readable | silence |

Time is a concept, not a fixed animation performance requirement. The payoff is physical causality (wind-up → impact → aftermath), NOT noisy particles or endless wobble. The `be` must appear displaced/destroyed, not simply switched off by string replacement. Do not create eyes, arms or wrestler characters unless separately authorized: the LETTERS themselves do the acting.

## 4. Look direction — donor-first and identity-correct
- Keep the canonical Kayfa / Bizarro split, distinctive irregular contours and recognition at every size. Compare authentic Irish Grover outline extrusion with **at most one** carefully chosen alternative silhouette; no global typography replacement.
- Form: thick but nuanced extruded letters, uneven organic bevels, minute hand-pressed indentations, occasional fingerprint-like roughness, soft clay specular, credible cast + self-shadow; avoid inflated identical rounded blob glyphs, plastic chrome, default shiny game text and synthetic neon.
- Start palette from ink `#1f1a14`, existing rust `#b8361f`, ivory `#f6efd9`; explore restrained support pigments such as ochre/apricot, faded teal and cornflower, with very subtle within-letter color transitions rather than rainbow lettering.
- Preserve recognizable red/highlighter-block idea in the FINAL `Bizarro` treatment (e.g., compressed clay-red/backdrop, cream lettering or a carefully tested inversion). A palette exploration is NOT a redesign approval.
- Clay splatters are small pooled physically coherent fragments derived from the actual `be` contact and source color; not a generic confetti burst or broad screen-covering effect.
- Lighting: consistent direction and contact; soft but visible real volume. Site parchment/halftone and FrizzleBob source avatar remain recognizable. Background is not replaced with a generic wrestling arena or interface chrome.
- Source isolation: show the actual Irish Grover mesh and/or source lettering in a neutral isolated view, THEN introduce effects and site context. A successful font URL load does not equal a verified final wordmark.

## 5. One module, three presentation profiles
| Profile | Use | Behavior |
|---|---|---|
| `hero` | homepage H1 region | One-shot setup → slam → recover → idle. English definition visible during opening; copy/heading stays semantically accessible |
| `header` | small topbar lockup | Recognizable final settled wordmark; static or ultra-subtle slow idle; NO destructive slam while navigating; preserve click-to-home |
| `poster` | low-end devices, reduced-motion, SEO, sharing, fail-safe | Static image/SVG/DOM of exact accepted final design; no animation or WebGL requirement |

Potential later `replay` only by interacting with the existing hero wordmark, if that feels intentional; no new big button or control panel. Replaying does not reset the site or interfere with navigation.

## 6. Technical candidates, not implementation mandates
A. One lightweight Three.js scene/layer with source-faithful extruded glyph geometry and a custom bend/squash/recovery deformation; reuse existing KFB materials/donor patterns where valid. No true rigid-body engine required for the logo.
B. Prebaked authored animation (GLB/video + alpha where feasible) with source-backed static image fallback if the real-time version is too heavy or materially less expressive.
C. CSS/SVG / mixed 2.5D only if an apples-to-apples moving visual demonstration can actually meet the impact/depth/letter shape goal. Do not silently replace requested real volumetric clay with flat effects.
Geometry conversion needs explicit font-outline pipeline: CSS Google Font text cannot simply be passed to Three.js `TextGeometry` without suitable outline data/conversion. Respect font licenses and redistribution constraints.
No speculative new shader/runtime/audio owner. KFB shared Audio retains sound ownership if SFX are added; test silently first. Reuse current KFB clay/surface animation donors only after source-isolation proof.

## 7. Non-negotiable product-quality gates
1. First frame shows `Kayfabe`; explicit English definition, readable.
2. Slam is visibly `Bizarro` onto `be`, with `be` obliterated in same-color clay debris, no spelling jump.
3. Result visibly and correctly reads `KayfaBizarro`; no lingering `be` and no glyph overlap.
4. Recovery wave is evident then resolves; idle is subtle, low-motion and does not impair reading.
5. Source-faithful KFB identity; final still works as an actual header logo at narrow widths and on mobile.
6. Reserve stable hero height/aspect so rendering never shifts the remainder of homepage content; existing links/DE/EN routing unchanged.
7. DOM textual brand is preserved for accessibility/SEO; poster fallback appears quickly, `prefers-reduced-motion` disables slam/idle, no autoplay sound.
8. Performance measured on target hardware, including resize, reload, lost context and static fallback; never assert FPS/CPU/GPU numbers without tests.
9. Existing web product remains unchanged until a deliberately accepted visual module is integrated; no second KFB homepage runtime or nav rewrite.

## 8. Next bounded gate: source-true visual samples before code integration
Produce **two actual art-direction treatments** of the same original mark (A = Irish Grover source-faithful; B = one thoughtful alternate), each as four genuine source-derived 3D key frames: `Kayfabe+definition`, `Bizarro anticipation`, `be impact`, `KayfaBizarro settled`. Then ONE short isolated motion/interaction animatic from the stronger treatment and show the accepted source object alone before any homepage embedding.

Decision from the resulting real visuals: which contour/palette/physicality actually delivers the intended monster slam. Only afterward authorize an additive receiving implementation of the selected module inside the existing site `index.html`.

## 9. Scope and evidence status
This branch is only a persisted brief and future design contract. Code changed: 0. 3D meshes generated: 0. Genuine source-isolation proofs: 0. Unit/browser/visual/runtime/GPU tests: 0. No public Stage/Site build, no Cloudflare verification, no merge and no Live claim.
