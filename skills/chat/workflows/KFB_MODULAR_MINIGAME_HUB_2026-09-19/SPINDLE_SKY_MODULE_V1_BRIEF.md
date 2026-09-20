# SKY-01 · Modularer Spindle Sky

**Goal:** entkoppelter Environment-Candidate mit isolierter Stage.  
**Stage:** `/kfb-hub/stage/modules/spindle-sky-v1/`.

Donoren:
- Combat A2 `himmel.v4.js`, `spindel.v4.js`, `skydome-shader.v4.js`
- Travel `travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js` + `world-context.js`

Der heutige `spindel.v4.js` greift auf private Himmel-Felder zu und ist nur Donor. Definiere `kfb.environment.spindle-sky/0.1-candidate` mit getrennten Shell-/Surface-/Presetdaten und `mount(parent,ctx)`, `setPreset`, `setPalette`, `update(dt,signals)`, `probe`, `dispose`.

Modul besitzt ausschließlich eigene Meshes/Materialien. Host besitzt Scene, Kamera, Renderer, Clock, Fog, World und Gameplay. Lake/Glow optional. Liefere Vertrag, deterministische Presets, Probe-/Dispose-Test, Source-Receipt und isolierte Stage. Keine Arena-/Travel-/A2-Integration; PR ohne Auto-Merge.
