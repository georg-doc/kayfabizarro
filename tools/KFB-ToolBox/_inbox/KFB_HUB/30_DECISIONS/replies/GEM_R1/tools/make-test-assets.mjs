#!/usr/bin/env node
// KFB GEM_R1 · builds the test assemblies from WSB's gem-tagged set M (B30/pieces_morph_gem/*.r2.glb, read only) into <outDir>:
//   gem_lineup.glb      6 types x 2 sides (white row in front, black row behind, staggered) + one clay pawn from set A at the end
//   gem_pair.glb        4 queens: white idle, white active, black idle, black active (states are set by the harness)
//   gem_capture.glb     one white queen + one black knight (capture strip)
//   gem_start.glb       board r3 + 32 pieces in the starting position (b30_start_position.r1.json)
//   node make-test-assets.mjs <outDir>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const HUB = path.resolve(HERE, '../../../..'), B30 = path.join(HUB, '50_BLENDER/B30'), OUT = path.resolve(process.argv[2] || '.');
fs.mkdirSync(OUT, { recursive: true });
const gem = (type, side) => path.join(B30, `pieces_morph_gem/KFB_ChessM_${type}_${side}.r2.glb`);
const TYPES = ['pawn', 'rook', 'knight', 'bishop', 'queen', 'king'], DX = 3.7;
const layouts = {
  gem_lineup: [
    ...TYPES.map((t, i) => ({ glb: gem(t, 'white'), name: `W_${t}`, t: [i * DX, 0, 2.1], yaw: t === 'knight' ? 55 : 0 })),
    ...TYPES.map((t, i) => ({ glb: gem(t, 'black'), name: `B_${t}`, t: [i * DX + DX / 2, 0, -2.1], yaw: t === 'knight' ? 55 : 0 })),
    { glb: path.join(B30, 'pieces/KFB_Chess_pawn_light.r1.glb'), name: 'CLAY_pawn_setA', t: [6 * DX + 0.4, 0, 2.1] },
  ],
  gem_pair: [
    { glb: gem('queen', 'white'), name: 'W_queen_idle', t: [0, 0, 0] }, { glb: gem('queen', 'white'), name: 'W_queen_active', t: [4.2, 0, 0] },
    { glb: gem('queen', 'black'), name: 'B_queen_idle', t: [9.2, 0, 0] }, { glb: gem('queen', 'black'), name: 'B_queen_active', t: [13.4, 0, 0] },
  ],
  gem_capture: [{ glb: gem('queen', 'white'), name: 'W_queen', t: [0, 0, 0] }, { glb: gem('knight', 'black'), name: 'B_knight', t: [6.5, 0, 0], yaw: 55 }],
};
const start = JSON.parse(fs.readFileSync(path.join(B30, 'data/b30_start_position.r1.json'), 'utf8'));
layouts.gem_start = [{ glb: path.join(B30, 'board/KFB_ChessBoard.r3.glb'), name: 'board', t: [0, 0, 0] }];
for (const [sq, s] of Object.entries(start.squares)) if (s.piece) layouts.gem_start.push({ glb: path.join(HUB, '50_BLENDER', s.piece.glb), name: `${sq}_${s.piece.side}_${s.piece.type}`, t: s.center_u, yaw: s.piece.rot_y_deg || 0 });
for (const [name, items] of Object.entries(layouts)) {
  const lp = path.join(OUT, name + '.layout.json'); fs.writeFileSync(lp, JSON.stringify({ items }, null, 1));
  execFileSync(process.execPath, [path.join(HERE, 'compose-glb.mjs'), lp, path.join(OUT, name + '.glb')], { stdio: 'inherit' });
}
