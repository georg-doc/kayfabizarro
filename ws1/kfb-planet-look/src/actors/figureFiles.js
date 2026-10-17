// V-391 · Welche lokale Datei ist der Körper einer Figurenkarte (Pfad unter src/assets/actors/). Nur Figuren mit Karte stehen hier.
// Die Datei muss byte-gleich mit card.body.glb sein (sha256, scripts/figures/hash-assets.mjs, test/unit/figures.mjs).
export const FIGURE_FILES = Object.freeze({
  frizzlebob: 'FB_TEMPLATE_LOOK_v5b.glb', // georg-doc-patch-3 tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5b.glb
  gothgirl: 'cast/GothGirl_NoEyes.glb', // georg-doc-patch-3 skills/chat/workflows/EYE_CLEANUP_01_2026-10-01/glb/GothGirl_NoEyes.glb (Augen in Blender entfernt, V-336)
})
