# SESSION-CUT 2026-07-19 — Motion-Editor v2 · Pet-Editor v9 · Talk-Münder

Mode: live. Ein Strang mit drei Lieferungen: der Motion-Editor komplett neu als v2 (Clips,
Mienenspiel, Trigger, FX, DAW-UI), die Talk-Münder als geteiltes Modul, der Pet-Editor als v9
(Mund-Platzierung im Aussehen-Contract). Zum Schluss der Rig-v5-Hub als Merge-Vorbereitung.

## 1. Was steht (eingecheckt)
- **Motion-Editor v2** (`KFB Pet Motion Editor v2.dc.html`): 4-Layer-Architektur — GLB-Clips
  (alle 8, roh, Tempo) · Körper (PetMotion v2) · Gesicht (Mienenspiel) · Sekundär-Federn
  (ear/tail/antler-Knoten) — plus FX und Talk-Mund. DAW-UI (Pad-Bar unten: Clips · Motions ·
  Gesicht · Events · Combos), Pet-Dropdown (alle 24), Abstands-Regler Begleiter↔Vehikel,
  Cursor-Blick, kompakter Modus <920px. Doku `docs/MOTION_EDITOR_v2.md`.
- **Neue geteilte Module:** `pet-motion.v2.js` (Clips + Trigger-Bus drop/brake/curve/card +
  Combos doubleTake/shiver/tada/random + Sekundär-Federn), `pet-face.v1.js` (Mienenspiel nach
  `uploads/SPRINT_mienenspiel.md`: Emote-Raum wandert+zittert, reaktiv, Augen-Pop/Oval),
  `pet-fx.v1.js` (dust/ring/star/speedlines, Cel-Look), `pet-mouth.v1.js` (Talk-Münder:
  12 Character-Animator-PNGs via GitHub raw, Visem-Shuffle ohne Lip-Sync, bend/rot/express).
- **Pet-Editor v9** (`KFB Pet Editor v9.dc.html`): Fork v8 + Mund-Tab (Platzierung pro Pet:
  Größe/Höhe/Breite×/Kippung°/Bogen↑↓ → `pet.mouth`), Anim-Leiste + Talk/Grin/Pout.
  Doku `docs/PET_EDITOR_v9.md`. v8 eingefroren.
- **Rig-v5-Hub:** Motion-Editor v2 läuft jetzt auf `pet-eye-rig.v5.js` (wie Pet-Editor) —
  Rig-Life AUS (PetFace trägt den Drift, sonst doppeltes Zappeln), Kinetik ungenutzt/0.
  v4 nur noch von den eingefrorenen v1-Benches referenziert. Merge-Blocker beseitigt.
- **Contract-Look-Fix (Nachtrag):** Motion-Editor liest `material.live` und rendert den vollen
  object-space **Triplanar-Clay-Shader** (aus Pet-Editor v8/v9 portiert = das geteilte `makeMat`,
  das Pet Studio erbt) → FrizzleBob zeigt Papier-Oberfläche + Relief + Gold-Tönung 1:1 wie im
  Aussehen-Editor. Am Pixel verifiziert (FrizzleBob + Penguin mit Papier-Triplanar).
- **EMBED_CUBE_PETS-Update für Cowork:** `docs/EMBED_CUBE_PETS_v2_PROPOSAL.md` (Redline v1→v2:
  Module/Rig-Version, Talk-Münder, motion-LIBRARY v2, + Warnung: kanonische pet-LIBRARY.json ist
  stale v0.2.0, muss auf v0.4.4 publiziert werden).
- **Contracts (Version-Check-in):**
  - `motion-LIBRARY.v2.json` **v2.0.0** (`kfb.motion-library/2`, 2026-07-19, im Projekt-Root):
    motions (aus v1.2.0, +secondary) + clips + face (emotes/drift/react/mouth) + triggers.
    `motion-LIBRARY.json` v1.2.0 bleibt für v1-Konsumenten stehen.
  - `pet-LIBRARY.json` **v0.4.3 unverändert** — `pet.mouth` kommt erst mit Georgs Mund-Tuning
    + Export aus v9 (Editor bumpt auf 0.4.4). Kanonische URL erst nach seinem Commit aktuell.
- **Skill übernommen:** `skills/session-export_v1.md` (aus dem Repo) — für den Export dieser
  und künftiger Sessions gilt: Manifest → Veto → schlankes Zip, nie das ganze Projekt.

## 2. Was schiefging
- Mund war nach dem Einbau unsichtbar — Fehldiagnose-Gefahr: er war da, nur bei Default-Lage
  hinter der Pig-Schnauze bzw. das PNG noch am Laden. Per In-Page-Probe (Overlay-Div) statt
  Raten geklärt; Prime Directive (am Pixel prüfen) hat sich wieder bezahlt gemacht.
- Agent-Iframe lud nach `show_html` denselben Zustand weiter (kein Reload) — Probe-Reste
  blieben im Bild. Bei three.js-Benches: harter Reload, dann prüfen.
- Sekundär-Federn sind ungeprüft am Knoten: ob Kenneys GLBs benannte ear/tail-Nodes tragen,
  war in der Session nicht in der Konsole ablesbar. Kein Blocker (stiller Skip), aber offen.

## 3. Verifikation
Am Pixel: v2-Bench (Bunny rund+gelb, Pads, Tuning), Pet-Swap (Pig nativ rosa inkl. Rig),
Talk-Tuning-Panel, Drop-Event (Stern sichtbar), v9-Mund-Tab (Neutral unter der Schnauze,
„ah" mit Zähnen). Verifier-Läufe auf beiden Benches ohne Befund.

## 4. Offen, zur Klärung (blockiert nichts)
- **Zitter-Bildfrage** (Sprint-Abnahme 3): eine Minute zusehen — lustig oder unruhig? Regler
  Gesicht→Zittern. Entscheidet Georg am Bild.
- **Sekundär-Knoten:** Konsole checken (`[pet-motion.v2] Sekundär-Teile: …`). Ohne Knoten wäre
  Ohren-Wackeln nur per Mesh-Chirurgie (stripEyes-Stil) zu haben — eigener Auftrag.
- **Kurven-/Lean-Vorzeichen** Bench-getunt, im Spiel gegen echte Fahrwerte prüfen.
- **Bunny-Knubbelnase** (Schnauze raus, ovale Nase rein) — Backlog, Pet-Editor-Scope.
- **Mund-Werte pro Pet**: Georg tunt FrizzleBob (tiefer/breiter) und exportiert v0.4.4.

## 5. Für den nächsten Chat (Pet Studio v1)
Einstieg: `docs/ONBOARDING_pet_studio.md` (Pflicht), dann `docs/HANDOVER_editors_2026-07-19.md`.
Erste Handlung: beide Benches öffnen, Pixel-Screenshot, IST verifizieren — dann erst bauen.
