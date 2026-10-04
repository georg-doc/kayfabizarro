/* CQ-S7 · KayKit RPG Tools Bits 1.0 FREE · complete vocabulary + contact-sheet layout
   49 gltf files read out of the repo. This pack has no grid, no ground and no workbench — the
   useful knowledge is SCALE and ORIENTATION. The pack's own overview sheet shows the rule the
   first version of this page got wrong: the tools LIE on the ground in sorted rows, big at the
   back, nothing touching. Most models are authored standing upright, so placing them unrotated
   made a forest of vertical saws that towered over the screws and intersected each other.

   Therefore no offsets are authored here any more. Rows below say only WHICH parts belong
   together and WHICH ones stand; the layout comes from the measured bounding boxes
   (lib/props-lab.js · contactSheet) and is proven by auditFootprints(). */

export const GROUPS = {
  'Schmiede': ['anvil', 'grindstone', 'tongs', 'hammer', 'mallet', 'file', 'bucket_metal'],
  'Tischlerei': ['saw', 'handplane', 'handdrill', 'chisel', 'knife', 'scissors', 'trowel',
    'screwdriver_A_long', 'screwdriver_A_short', 'screwdriver_B_long', 'screwdriver_B_short',
    'screwdriver_A_long_color', 'screwdriver_A_short_color', 'screwdriver_B_long_color', 'screwdriver_B_short_color',
    'wrench_A', 'wrench_B', 'nail', 'screw_A', 'screw_B'],
  'Grabung': ['shovel', 'pickaxe', 'axe'],
  'Expedition': ['map', 'map_empty', 'map_rolled', 'compass_base', 'drafting_compass', 'magnifying_glass',
    'journal_open', 'journal_closed', 'blueprint', 'blueprint_stacked',
    'pencil_A_long', 'pencil_A_short', 'pencil_B_long', 'pencil_B_short'],
  'Licht & Seil': ['lantern', 'torch', 'torch_burnt', 'rope_bundle_A', 'rope_bundle_B']
};

export const PALETTE = Object.values(GROUPS).flat();

/* Rows read back-to-front like the overview sheet: heavy standing pieces behind, then long
   handles, then flat paper, then the small stuff up front. Within a row the solver sorts by
   measured footprint area (largest first) — that is the fan shape the reference sheet has. */
export const ROWS = [
  { name: 'Schwer · stehend', parts: ['anvil', 'grindstone', 'bucket_metal', 'lantern'] },
  { name: 'Langstiel', parts: ['shovel', 'pickaxe', 'axe', 'saw', 'handplane', 'handdrill'] },
  { name: 'Schlag & Zug', parts: ['hammer', 'mallet', 'tongs', 'file', 'wrench_A', 'wrench_B', 'trowel'] },
  { name: 'Papier & Navigation', parts: ['map', 'map_empty', 'map_rolled', 'blueprint', 'blueprint_stacked',
    'journal_open', 'journal_closed', 'compass_base', 'drafting_compass', 'magnifying_glass'] },
  { name: 'Klinge & Schnur', parts: ['knife', 'scissors', 'chisel', 'rope_bundle_A', 'rope_bundle_B', 'torch', 'torch_burnt'] },
  { name: 'Schraubendreher', parts: ['screwdriver_A_long', 'screwdriver_A_short', 'screwdriver_B_long', 'screwdriver_B_short',
    'screwdriver_A_long_color', 'screwdriver_A_short_color', 'screwdriver_B_long_color', 'screwdriver_B_short_color'] },
  { name: 'Kleinteile', parts: ['pencil_A_long', 'pencil_A_short', 'pencil_B_long', 'pencil_B_short', 'nail', 'screw_A', 'screw_B'] }
];

/* Parts that stand in the pack's own sheet — they keep their authored orientation even though
   they are taller than wide. Everything else gets laid flat by the height/footprint test. */
export const STAND = ['anvil', 'grindstone', 'bucket_metal', 'lantern', 'journal_open', 'journal_closed',
  'compass_base', 'drafting_compass', 'magnifying_glass', 'blueprint_stacked', 'torch', 'torch_burnt', 'handdrill'];

export const SHEET = { pad: 0.3, rowGap: 0.75, layRatio: 1.1, stand: STAND };

export const ROW_LIST = ROWS.map((r) => ({ name: r.name, count: r.parts.length }));

export const scene = {
  id: 'CQ-S7_KAYKIT_RPG_TOOLS_SHEET',
  label: 'KayKit RPG Tools Bits · Kontaktbogen',
  reference: 'ref/tools_overview.png',
  layout: 'measured contact sheet · lib/props-lab.js#contactSheet',
  provenance: {
    repo: 'georg-doc/kayfabizarro',
    packRoot: 'media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf',
    format: 'gltf', license: 'CC0 · Kay Lousberg', parts: 49
  },
  note: 'Das Pack enthält keine Werkbank und keinen Boden — die Platte ist Bühne, aus dem gelösten Bogen gemessen. Für eine echte Werkbank fehlt ein Möbel-Pack (Furniture Bits, nicht im Repo).'
};
