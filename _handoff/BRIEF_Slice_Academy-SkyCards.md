# Slice-Briefing: (Elisa) Academy-Lektionen als Sky-Cards — mit LIVE-Demo auf der Karte

**Ziel:** Die 30 Würfelakademie-Lektionen (5 Kapitel × 6) als **Sky-Cards** im Reise-Modus — als
farbcodierte Zonen-Landschaften. Man fliegt eine Lernpfad-Route **oder** klickt frei durch. Instant
Mehrwert: echtes Lern-Content statt mehr Juice. Curriculum liegt fertig
(`BRIEFING_Wuerfelakademie_fuer_ClaudeDesign_2026-07-22.md`, `KFB Academy/SPRINT01_…`).

## 0. KISS-Rahmen (bewusst weggelassen)
- **Kein Card-Flip.** Sky-Cards sind einseitige Flächen (`cardTexture`), die Rückseiten der Lektionen
  sind Stubs → bleiben draußen.
- **Kein echter Tutor in dieser Scheibe.** Pet bleibt stiller Begleiter. Höchstens **ein** „erklär mir
  das"-Button als **Platzhalter-Hook** (zeigt noch auf nichts). **Keine** Academy-Autogrow-iPhone,
  **keine** DocCheck-Flexa (med-private, späteres eigenes Chat-Würfel-Modul).
- **Auto-Pilot / Doppelklick-Sprung:** Doppelklick auf eine Karte = Fly-to; Auto-Pilot fliegt die
  Kapitel-Route der 30 ab. Hook: `sky-cards.update(dt,camera,player)`.

## 1. Der Kern-Anspruch: die Demo LIVE auf der Karte, KEIN Overlay/iframe
Georg-Vorgabe: man soll das Gefühl haben, die Demo **in/auf** der Sky-Card zu benutzen — bestenfalls
wirklich —, **ohne** sichtbares Overlay-Fenster/iframe (bricht Immersion). Das ist **machbar**, sauber:

**Weg = Render-to-Texture (RTT) im selben WebGL-Kontext.**
- Eine three.js-Demo ist nur `{ scene, camera, update(dt) }`. Statt auf den Bildschirm rendert der
  **vorhandene** `WebGLRenderer` sie in ein `WebGLRenderTarget`; dessen `.texture` wird die `map` der
  Karten-Oberfläche. Kein zweiter Renderer, kein zweiter Kontext, kein iframe.
- **Das Repo macht diese Familie schon:** Terrain-Szene + Dice-Overlay laufen in einem Renderer
  (`autoClear=false`, `clearDepth()`). Eine Live-Demo-Karte ist derselbe Mechanismus, nur in ein RT
  statt in den Overlay-Framebuffer.

**Interaktion („man benutzt sie wirklich"):** Pointer-Raycast auf das Karten-Quad → **UV-Trefferpunkt**
→ auf die normierten Koordinaten der Demo abbilden → als synthetischer Pointer an deren Controls
(z. B. OrbitControls) weiterreichen. Klick/Drag auf der Karte steuert die Demo.

## 2. Das eigentliche Stück Arbeit: der Lektions-Adapter-Vertrag
Die 30 Lektionen sind three.js-*Beispiele* — jedes baut sich heute eigenen Renderer + Canvas + Loop.
Für RTT muss jede Lektion auf **eine gemeinsame Modul-Form** gebracht werden (kein eigener Renderer):

```
export function initLesson(THREE, ctx) {
  // ctx = { width, height }  — KEIN eigener Renderer/Canvas/RAF
  return {
    scene, camera,
    update(dt),               // eine Animations-Schrittfunktion
    onPointer(u, v, type),    // u,v ∈ [0,1] vom Karten-Raycast; type = down/move/up
    resize(w, h),
    dispose(),
  };
}
```
Der Host besitzt den Renderer, das RT und die Schleife. Das ist der Refactor-Aufwand pro Demo — der
Teil, den die Exploration bemessen muss (siehe §4).

## 3. Perf-Budget (ehrlich)
- **Nur die fokussierte/nächste Karte läuft live** (1 RTT-Pass pro Frame). Die anderen 29 sind statisch
  (Thumbnail) oder ein kurzer Video-/Sprite-Loop → „fühlt sich lebendig an", kostet fast nichts.
- Beim Anfliegen wechselt die Zielkarte von statisch → live (RTT an), beim Wegfliegen zurück.
- Zu messen: wie viele Live-RTT-Karten gleichzeitig gehen, bevor die FPS fallen; RT-Auflösung
  (z. B. 512²) vs. Schärfe.

## 4. Forschungs- & Explorations-Auftrag (POC zuerst, keine Blanko-Wette)
**Nicht 30 auf einmal.** Erst ein Proof-of-Concept, Abnahme am Gefühl:
1. **EINE** Lektion auf den Adapter-Vertrag (§2) bringen.
2. Sie per RTT (§1) auf **eine** Sky-Card im Reise-Modus rendern — live, **kein** Overlay.
3. UV-Raycast-Interaktion: auf der Karte klicken/drehen steuert die Demo.
4. **Abnahme:** Fühlt es sich an, als benutzt man die Demo *in der Welt*? Georgs Auge entscheidet.
5. Dann messen: Perf pro Live-Karte, Refactor-Aufwand für die konkreten 30 Beispiele (manche evtl. zu
   schwer → die bleiben Video-Loop). Erst danach ausrollen.

**Explizit offen halten, nicht vorab als unmöglich flaggen** — der POC beantwortet: geht's flüssig, wie
teuer ist der Adapter je Demo, welche Demos sind RTT-tauglich.

## 5. Fallback-Leiter (falls RTT je Demo zu teuer)
1. **Ziel:** fokussierte Karte live via RTT (interaktiv).
2. **Fallback A:** kurzer **Video-/Sprite-Loop** der Demo als Textur — live-*Gefühl*, kein Overlay, sehr
   billig, für den nicht-fokussierten Rest ohnehin der Standard.
3. **Notnagel:** `CSS3DRenderer` (echtes DOM perspektivisch auf der Karte). **Vorbehalt:** kompositiert
   über dem WebGL-Canvas → keine saubere Verdeckung durch 3D-Geometrie, kein Fog/Blur-Blend an den
   Kanten. Nur wenn 1+2 scheitern.

## 6. Akademie-Manifest (der Karten-Pool)
Ein kleines JSON aus dem vorhandenen Curriculum, in die Sky-Cards gefüttert:
```json
{
  "chapters": [
    { "id": "ch1", "title": "…", "storyMode": "tragic",
      "lessons": [
        { "id": "l1", "title": "Flow Field", "thumb": "<raw-url>.png",
          "adapter": "<raw-url>/lesson-flowfield.js", "source": "<three.js-example-url>" }
        /* … 6 pro Kapitel … */
      ] }
    /* … 5 Kapitel … */
  ]
}
```
- `thumb` = **statischer** Screenshot (v1.1; die *allerkleinste* v1 = nur Titel + Zonenfarbe, ohne Thumb).
- `adapter` = die auf §2 gebrachte Lektions-Datei (für Live-RTT).

## 7. Zonen ↔ Story-Modi (Colorcoding & Landschaft geschenkt)
5 Kapitel → 5 der 6 Story-Modi; der **6. Modus (Meta)** wird der **Hub/Übersicht**. Pro Zone bekommt das
Terrain den Kapitel-Story-Modus (`world-context` / `setWorldContext` bzw. Palette pro Zone) → Farbe und
Biom je Kapitel kommen aus dem vorhandenen System. Route abfliegen oder frei klicken.

## 8. Nicht anfassen / Stack / IP
- WebGL, three 0.160, **ein Renderer/ein Kontext** (RTT nutzt genau diesen, kein zweiter Build).
- `flight-controller`, `walk-controller`, `card-carrier`, `pet-kinetics`, Pet-Stack unverändert.
- **IP:** Elisa-Akademie ist **KFB-public**. Keine Flexa, keine med-privaten Inhalte in dieser Scheibe.

## 9. Verifikation
POC-Karte bootet, Demo läuft live in-world ohne Overlay, Klick/Drag steuert sie; FPS gemessen; in Chrome
UND Firefox am Pixel geprüft. Anmutung entscheidet Georg.
