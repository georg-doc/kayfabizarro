# ONBOARDING — KFB Pet Studio v1 (frischer Chat startet HIER)

Auftrag: die zwei Authoring-Benches (Pet-Editor v9 = Aussehen, Motion-Editor v2 = Bewegung) zu
EINEM Canvas verschmelzen. Beschlossen mit Georg am 2026-07-19.

## Pflicht-Kontext (in dieser Reihenfolge lesen)
1. `CLAUDE.md` (Prime Directive: Social Agency; wonky bleibt; Screenshot-Verifikation Pflicht)
2. `docs/SESSIONCUT_2026-07-19.md` (was steht, was offen ist)
3. `docs/HANDOVER_editors_2026-07-19.md` (Contracts, Module, API)
4. `docs/PET_EDITOR_v9.md` + `docs/MOTION_EDITOR_v2.md` (Ist-Stand beider Benches)
5. `docs/HOUSEKEEPING.md` (Status aller Artefakte) + `skills/session-export_v1.md`
   (Export-Regeln: Manifest → Veto → schlankes Zip, NIE Voll-Projekt)

## Was schon steht (NICHT neu bauen)
- EIN Character-Pfad (`pet-library.v6.js`), EIN Rig (`pet-eye-rig.v5.js`, beide Benches,
  Rig-v5-Hub erledigt), geteilte Layer `pet-motion.v2.js` / `pet-face.v1.js` / `pet-fx.v1.js` /
  `pet-mouth.v1.js`. Der Studio-Merge ist eine UI-/Host-Aufgabe, KEINE Runtime-Neuentwicklung.
- Beide Contracts inkl. IO-Flows (Import/Export/Session) funktionieren in den Einzel-Benches.

## Bauplan Studio v1
1. **EIN Canvas, ein Character, eine Szene.** Tabs schalten nur Panels um: **Aussehen** (Look/
   Licht/Farbe/Gesicht/Mund + Augen-Rig) · **Motion** (Pads: Clips/Motions/Gesicht/Events/Combos
   + Tuning) · ggf. **Bühne** (Abstand, Matte, Stimmung). Kein iframe-Nebeneinander.
2. **Paletten von Grund auf neu anordnen** (Georg explizit): heute liegen Gesicht & Mund links,
   Augen rechts, Motion-Pads unten — im Studio gehört zusammen, was zusammen bearbeitet wird
   (z. B. EIN Gesicht-Bereich: Augen + Emotes + Mund). Erst Panel-Inventar machen, Gruppierung
   Georg als Skizze/Frage vorlegen, DANN bauen.
3. **Konflikt-Regel Rig-Life:** im Motion-Kontext trägt `pet-face.v1.js` das Mienenspiel →
   `rig.setLife({on:false})`. Im Aussehen-Kontext (Actor-Schnitte, Life/Kinetik-Slider aus v8/v9)
   darf das Rig-Life an sein. Beim Tab-Wechsel sauber umschalten — genau EIN Besitzer pro Kanal.
4. **IO gebündelt:** beide Contracts (pet-LIBRARY, motion-LIBRARY v2) mit getrennten Buttons,
   getrennten Versionen, getrennten Session-Keys. Wer schreibt, zählt hoch.
5. Einzel-Benches v9/v2 bleiben eingefroren als Referenz, bis das Studio abgenommen ist.

## Disziplin (aus zwei Post-Mortems gelernt)
- Fundament vor Feature; jede Stufe einzeln am **Pixel** verifiziert (Screenshot, nicht Zahlen).
- Bei Briefing-Widersprüchen: EIN Modell entscheiden lassen, nicht dazwischen patchen
  (Card-Viewer-Lektion).
- Dev-Falle: viele Hot-Reloads → Zombie-Renderer (Pet weg trotz gesundem Graph) → harter Reload.
- Cursor-Blick: x negieren (InfiniteJourney-Falle).
- Assets nur per GitHub-RAW-URL, nichts Schweres ins Projekt.

## Backlog (nach Studio v1, nicht vergessen)
- Bunny-Schnauze raus + quer-ovale Knubbelnase (Mesh-Chirurgie im stripEyes-Stil) — dann Mund frei.
- Expression-Sets / FX-Kombos als Presets im Contract (mouth.express + face + FX gebündelt).
- Sekundär-Knoten-Check (haben Kenney-GLBs benannte ear/tail-Nodes? Konsole:
  `[pet-motion.v2] Sekundär-Teile`) — sonst Mesh-Split.
- Mund-Platzierung pro Pet vervollständigen (Georg tunt, Editor exportiert 0.4.4+).
- Kurven-/Lean-Vorzeichen gegen echte Fahrwerte.
- `mouth.perPet`-restMap (per-Pet-Ruhemünder), falls Storytelling es braucht.

Erste Handlung im neuen Chat: beide Benches öffnen, je ein Pixel-Screenshot, IST bestätigen.
Dann Panel-Inventar + Gruppierungs-Vorschlag an Georg. Kein Code vor seinem Go zur Anordnung.
