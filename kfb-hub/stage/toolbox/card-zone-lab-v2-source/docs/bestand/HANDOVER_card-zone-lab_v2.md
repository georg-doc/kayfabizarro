# HANDOVER — Card Zone Lab v2

**Von:** v1 (2026-07-26, FROZEN) · **An:** `KFB Card Zone Lab v2.dc.html`
**Vorgehen:** v1 **kopieren**, nicht neu bauen. Die Ursachen-Fixes aus `SESSION_card-zone-lab-v1_2026-07-26.md`
sind nicht offensichtlich und würden bei einem Neuaufbau still verloren gehen.

## Zuerst, sonst baut v2 auf einer Abzweigung

`terrain-v10/voxel-terrain.js` in diesem Projekt ist ein **Fork** mit zwei Zusätzen (`heightStep`,
`setCarve`). Details und Patch: `docs/PATCH_v10_terrain.md`. Entweder zurückportieren oder bewusst
als KFB-Variante führen — aber nicht vergessen.

## Was als nächstes dran ist (Georgs Reihenfolge)

1. **Aufdeck-Animation.** Die Rückseite (`KayfaBizarro_Card_Backside_01_lowrez.png`) ist geladen und
   liegt als `this.backTex` bereit. Offene Entscheidung, die die Mechanik bestimmt: liegt die
   verdeckte Karte **flach auf dem Zonenboden** und klappt sich auf (dann lohnt ein Cloth-/Biege-Effekt),
   oder steht sie aufrecht und dreht sich nur um (dann reicht eine Rotation mit Materialwechsel bei 90°)?
2. **Zugbrücken** über den Graben — Übergang Terrain → Zone, Kandidat für `GLB_pirate`-Teile.
3. **Face-Focus / PDF-Zoom.** Die Art-Fläche soll auf Cursorposition zoombar sein. Das braucht den
   Modus aus Cube Academy: Fläche füllt den Bildschirm, **HTML statt Canvas-Textur**, dann Zoom.
   Als Canvas-Textur ist echtes UI (Chat, Tag-Klicks) nicht machbar.
4. **Seed-Kopplung.** Die Zone leitet ihren Look aus Reglern ab, nicht aus der Karte. Sobald die
   Feldnamen aus dem JSON-Seed vorliegen (`biome`, `topic`, `cluster`, `quality`, fluid/gas/solid),
   hängen Füllung, Abnutzung und Collage-Textur **deterministisch** an der Karte — erst dann ist es
   eine Signature-Zone statt einer Vorschau.
5. **Sound / Drone** bei Annäherung. Braucht eine Nutzer-Interaktion (Autoplay-Policy) und
   Distanzlogik, keinen Toggle.
6. **Narrative Flow** (Meta-Konzept, in `HOUSEKEEPING.md` festgehalten): Graben öffnet sich zum Fluss,
   verbindet Zonen semantisch. Fehlt: `setCarve()` als **Pfad-Variante** (Polyline mit Breite statt
   Rechteck) und Strömungsrichtung als Shader-Parameter.

## Fallen, die schon einmal Zeit gekostet haben

- **Rohes `ShaderMaterial` + InstancedMesh:** `instanceMatrix` muss im Vertex-Shader von Hand
  angewandt werden. Sonst liegen alle Instanzen im Ursprung — und das sieht wie ein Geometriefehler aus.
- **Bevel-Maske (edge3) auf Zellen:** liegt sie einmal pro Zelle, zeichnet sie ein Raster. Für Flächen
  invertieren **und** die Mitte auf Weiß zurückziehen, sonst wird die ganze Fläche dunkel.
- **`OrbitControls` teilen sich das Element:** eigene Pointer-Handler in der Capture-Phase, Ereignis
  stoppen, `setPointerCapture` — sonst bleibt die Kamera gesperrt, wenn der Zug über dem Dock endet.
- **Screenshots ohne `preserveDrawingBuffer`** zeigen alte Frames. Vor jeder visuellen Beurteilung prüfen.
- **Zwei verkettete `setFromUnitVectors`** kippen bei antiparallelen Vektoren. Für Flächen-Ausrichtung
  explizite Basen bauen.
- **Gemittelte fbm-Oktaven liegen um 0.5.** Vor `Math.round` auf ±1 strecken, sonst ist ein Regler
  über den halben Weg wirkungslos.

## Clean-Run v2

1. Datei öffnen → bootet ohne Konsolenfehler, Terrain + Zone + Graben + Würfel + Karte da.
2. Graben-Breite 2 → 7 durchziehen: keine Löcher zwischen Zone und Terrain, Wasser auf allen vier Seiten.
3. Hub 1 → Terrain bewegt sich, Plateau und Ecken stehen still.
4. Würfel ziehen → Würfel dreht, Kamera steht; Zug über dem Dock beenden → Kamera wieder frei.
5. Fläche klicken → bleibt vorn, bis die Kamera bewegt wird.
6. Nächste Karte → Art-Fläche zeigt zum Spieler, PDF-Artwork erscheint nach wenigen Sekunden.
