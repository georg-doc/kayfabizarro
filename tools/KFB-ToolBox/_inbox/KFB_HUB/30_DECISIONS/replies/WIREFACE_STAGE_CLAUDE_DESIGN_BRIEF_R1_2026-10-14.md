# KFB Wireface Stage · Claude Design Brief R1
**Stand:** 14.10.2026 · **Status:** DESIGN BRIEF / Vorschlag für den nächsten Claude-Design-Cut, keine Design-Abnahme oder Implementierung.  
**Owner / SSOT:** `georg-doc/kayfabizarro`, Branch `docs/kfb-decisions-register-2026-10-11`, `30_DECISIONS/DECISIONS.md`. **Outcome:** eine wiederverwendbare *Karten-Dialog-Bühne* für Spielbegegnungen, Promo-Clip-Authoring, automatische Demo-Szenen und späteren WS1/R3F-Host. **Executor jetzt:** Claude Design (visuelle Konzeption); **später:** Claude Code/WSA im bestehenden Owner.

## A · Kopierfertiges Briefing an Claude Design (einseitiger Auftrag)

> **Design a modular KFB Wireface Card-Dialogue Stage, not a new game world.** Its core action: 1–3 existing KFB performers present a genuine KFB card using a source-backed ChatterBox opener/Triplet/bridge. The card is a real, uncropped quarter-page image; performers have KayKit/KFB bodies plus the existing FrankenStein/Wireface face system. One coherent claymation art direction, variable scenery and framing.
>
> **Source isolation comes before any composite.** Show the actual existing KFB card, existing figure/face, existing plain bubble, clay surface and billboard/frame source **individually**, each with path, ref and verification status; distinguish genuinely rendered source from a loaded URL or a conceptual reference. Next show 1 source-accurate assembly using the same components. Do not replace donors with lookalikes.
>
> **Build three related layout directions as presets of one stage, not three new stages:**
> 1. **Neutral Studio (first design/QA baseline):** clean clay stage, actor anchor slots for 1/2/3 speakers, front-facing complete card on a readable frame, unobtrusive background; optimize for social clips and visual comparison.
> 2. **Card Zone / Table Diorama:** actor(s) perform next to the card or table; base visual reference is existing `kfb-table.v6` (flat cards only). A standing card or card holder is explicitly a *design proposal*, not a claimed existing component.
> 3. **Island / Encounter:** same performers, card, bubble and shots embedded in a calm part of an island. Existing PondLand/Forest assets are candidates; Atomium Design Cut (PASS · TUNE LATER) or nature assets may be considered only after source-isolated proof. Do not build travel routes/world geometry.
>
> **Compose both 9:16 vertical (mobile/social first) and 16:9 horizontal (game/desktop) for each preset**; suggest 1:1 only as a responsive crop-safe derivative. Show three casting densities (solo / duo / trio). For portrait clips prefer alternating clear actor/face shots and **a separate legible full-card insert** over shrinking the original card or stacking text over it. Preserve artwork, marginalia, power/lore and edges; fit, never cover-crop.
>
> **Visual grammar:** J17 is a *look* reference, not road/physics template. Soft sculpted K2 clay, readable silhouettes, grounded contact shadows, restrained tool marks, KFB colors and material families from `STYLE_GUIDE_3D_R1.md` v0.2. Billboard is an existing canvas/card-content family with interchangeable **skins**, not a second card renderer. Explore Knet-Orange (race), Balsa arch (country/dirt), Masonry A (stone/antique), restrained cosmic glow; town frame remains unresolved. The speaker bubble is **plain V-204**: one silhouette and one pointer, no ink/outline, soft shadow; no duplicate tail.
>
> **Stage direction, not written dialogue:** Storyboard a source-valid three-beat Triplet—**subject → connector → reframe**, at 0 / 520 / 1040 ms, with the existing 300-ms block flip/reveal. One Triplet = one bubble with three expanding blocks (not three invented sentences or three unrelated bubbles). Use only verbatim KEEP-pool/card wording; if no approved matching line is available, mark the beat `CONTENT REQUIRED` in the *design annotation*, not inside any user-facing mock card. Eye gaze leads head then body; speaker and listener exchange looks, react after beats; on choice they look at camera. Emanata are flat clay tokens. Reference the deterministic 8-s NPC seek(t) proof as a *technical donor*, not evidence that the new stage already works.
>
> **Provide a shot vocabulary with storyboards:** S1 establishing group+card; S2 readable two-shot; S3 speaker close-up/face; S4 listener reaction; S5 full-card insert; S6 return-to-group/choice or outro. Illustrate purposeful beat-linked edits, hold times and eyelines in both aspect ratios; avoid automatic cuts exactly every 520 ms when speech/readability needs a longer hold. No camera collision with bubble or card.
>
> **Design the Creator/Authoring surface** as a responsive production tool **using the actual KFB visual language**: source selectors for deck/card, existing cast, opener/Triplet/bridge, preset/scenery, skin, mood, framing, aspect ratio and export; central stage preview, shot strip + deterministic timeline/scrubber, preview/replay/export actions, source and eligibility status. Draw a desktop screen and a mobile condensed view. Keep text/voice from existing KFB ChatterBox + Audio Site contracts; never invent copy, second AudioContext or new TTS/voice infrastructure.
>
> **Deliver:** (a) source-isolation contact sheet with exact source IDs and statuses; (b) 3 annotated preset composition sheets, each 9:16 + 16:9; (c) frame/skin family on the same real card surface; (d) 6-shot storyboard + Triplet beat strip; (e) desktop/mobile Authoring screen designs; (f) lightweight stage/preset/shot/mood token table and asset manifest for Claude Code. Clearly stamp proposals versus proven/accepted donors. **No 3D geometry, Blender mesh, React app, new runtime or deploy** (V-084). Stop at a reviewed visual/design cut; source-isolated parity comes before an integration assignment.

## B · Architektur-/Modulkarte für Claude Code (handoff only, kein Auftrag zum Bauen)

Alle rendernden Empfänger hängen ausschließlich am bestehenden **WS1 R3F ModuleHost** mit `create(options) → {object3d, update(dt, ctx), dispose()}`, three **0.186.1**. Daten-Pools bleiben reine Module. Host besitzt Licht, Nebel, Himmel, Kamera/Controller, Physik und das Audio-Mixing; kein zweites Canvas/three, keine eigene World-State-Instanz. **Die folgenden Modulnamen sind Design-/Schnittstellenbezeichnungen, keine Behauptung bereits existierender Dateien.**

| Rolle / vorgeschlagener Adapter | Bestand / Herkunft | Status & Grenzen |
| --- | --- | --- |
| `stageAssembly` (Root, Actor- und Card-Anker, Preset-Rezept) | V-211 ModuleHost; J17 Look; KFB working rules | **NEUER dünner Kompositionsadapter**, keine Welt/Geometrie-Engine |
| `performerAdapter` (Body/Head/Face/Acting) | FrankenStein Composer PR #355; KayKit-/Figure-Katalog, Clips, Motion Guide; `NPC_PERFORMANCE_PROOF_R1` | **ADAPTIEREN**; reale Figuren 1:1, Face- und Eye-Rig-Parität zuerst prüfen; V-201 Lab-Eyes FAIL nicht still übernehmen |
| `cardImageAdapter` | `MODULE_INVENTORY_R1.md` §1a/b: `kfb-viewer.js` / `card-art-2d.js`; `media/kfb/index.json` / cardMapping | **HÜLLE**, source-backed ¼-Seite, `fit`; Datenweg geprüft, Renderer-Integration teils ungeprüft |
| `cardBillboard` (visual skin) | Style Guide §6c; Billboard-Quote-Strang mit CanvasTexture und genau einem Scheduler; optional 3D card-builder §1c | **HÜLLE / DONOR-AUDIT**; keine zweite Kartenfläche oder doppelte Scheduling-Instanz, kein Quote-Text als Triplet-Ersatz |
| `bubbleSlotAdapter` | V-204 plain in Lab `src/world/organ/islands-npc.ts`; `src/chatter/vendor/chatterbox-core.js` | **HÜLLE**: Blase/Reveal denselben Code-Pfad nutzen; V-211 **R1.2-Nachtrag** Host-DOM-Slot `#ui-bubbles` mit projizierten Ankern noch gegen R1.1 §4 (3D-Bubble) auflösen; kein zweiter Blasen-Renderer |
| `tripletPlayback` / `shotDirector` | PR #379 KEEP-Pool, ChatterBox Studio `stage3d.js`, `NPC_PERFORMANCE_PROOF_R1/beats_v2.json` / seek(t) | **DATEN-/TIMELINE-ADAPTER NEU**, keine erfundenen Lines, 3 × Beat-Hooks; deterministic seek/replay, shot grammar Design-Vorschlag |
| `surfaceMood` | Clay K2 v10; `contact-blob.ts`, SKY3 Skydome/Environment Host; `clay-vfx.v1.js` | **HÜLLEN / SOURCE-ISOLATE**; Host bleibt einziger Licht-/Fog-/Sky-Besitzer. Keine neuen World-Owner |
| `authoringPanel` / `clipRecorder` | Audio Site v11 PR #365 als Consumer-Vertrag; 8-s seek(t) als Donor | **UI ENTWURF + SPÄTER NEU**; Recorder und exportierbare Clips **nicht als implementiert behaupten**; Audio-Site/Voice-Owner bleiben erhalten |

**Kompositions-Daten (Vorschlag, nicht finaler Runtime-Vertrag):** `stagePreset`, `castIds[1..3]`, `deckId`, `cardNumber`, `keepTripletId`, `openerId`, `bridgeId`, `frameSkin`, `moodPreset`, `shotRecipe[]`, `aspectPreset`, `duration`, `exportProfile`; `sourceStatus` an jedem Donor für Audit.

**Aufgabentrennung:** Claude Design = Kompositionszeichnungen, UI, Licht-/Skin-Referenz, Kamera-/Shot-Karten; Claude Code/WSA = bestehende Module adaptieren und source-isolated parity + Renderer/Playback/Export prüfen; Blender = nur benötigte echte Kulissenmeshes / Anker, keine Design-Interpretations-Parallelruntime. Natur-Import PR #393 ist nicht konvertiert; Atomium PR #397 Design PASS · TUNE LATER ist noch kein Stage-Laufbeweis.

## C · Akzeptanz und Quellenbindung

- **Visueller Minimalbeweis (Design, nicht Runtime):** 3 Presets × 2 Seitenverhältnisse = **6 annotierte Kompositionsblätter**; 6 Shots mit klarer Hierarchie von Gesicht, echter Karte und Plain-Blase; 1 Desktop- und 1 Mobile-Authoring-Entwurf; source-isolation vor Compositing. Dies sind **geforderte Deliverables, noch nicht bestandene Tests**.
- **Spätere technische Tests (Claude Code, nicht Claude Design):** ModuleHost create=1/dispose=1; wiederholbares `seek(t)` und Scrub vor/zurück mit gleichem Bild; Keine abgeschnittene Card/Marginalia; V-204 Blase einmalig; KEEP-Text/Bridge nicht generiert; 1× three/pdf.js/Audio-Owner; visueller Vergleich gleicher Kamera/gleicher Figur gegen echten Donor. Video-Export benötigt einen **echten** Browser/Datei-Beleg, nicht nur einen Button im Mock.
- **Quellen zuerst:** `DECISIONS.md` V-084, V-204, V-206, V-209, V-211; `KFB_WORKING_RULES_R1.md`; `STYLE_GUIDE_3D_R1.md` v0.2 (§3, §4, §6c, §8); `MOTION_GUIDE_R1.md` v0.2 (§3c); `replies/MODULE_INVENTORY_R1.md`; `replies/NPC_PERFORMANCE_PROOF_R1/REPORT.md`; onboarding R1; PR #355/#365/#379, Atomium #397, Natur #393. GitHub Register-Branch gewinnt vor älteren Chat-Zusammenfassungen.

## D · Georgs maximal vier kurze Designentscheidungen (nicht blockierend; Default zur Illustration)

1. **Erste Key Visual:** A **Studio** *(Default, unverstellter Donor-Vergleich)* / B Card Zone / C Inselbegegnung.
2. **Bildschwerpunkt bei 9:16:** A **Gesicht → Full-Card-Insert** *(Default)* / B Card permanent groß + Figur kleiner.
3. **Erster Cast:** A Solo / B **Duo** *(Default, echtes Gegenüber)* / C Trio.
4. **Look des ersten Rahmens:** A **Knet-Orange J17** *(Default)* / B Balsa / C Masonry A. Für Studio lediglich Skin-Demo; keine neue Branding-Welt.

**Next gate:** Claude Design liefert *Quelle einzeln → erste Studio-Komposition 9:16/16:9 → markierter Gesamt-Cut*. Steuerung prüft Quelle und Bildpaare; erst dann Entscheidung, ob diese Richtung für die übrigen Presets übernommen wird. Ohne gestalterisches PASS keine Claude-Code-Umsetzung dieses Designs.

---
**GitHub-Handoff-Status:** Design-Plan בלבד; no runtime edit, no browser/Stage evidence. No public route required for this planning slice.
