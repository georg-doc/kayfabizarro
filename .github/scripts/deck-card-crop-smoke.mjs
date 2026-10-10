import assert from 'node:assert/strict';
import { CARD_CROP_SEAM_OVERLAP, cardCropRect } from '../../tools/asset_registry/librarian/deck-crop.js';

assert.equal(CARD_CROP_SEAM_OVERLAP, 0.035);

const width = 1000;
const height = 600;
const topLeft = cardCropRect(width, height, 0);
const topRight = cardCropRect(width, height, 1);
const bottomLeft = cardCropRect(width, height, 2);
const bottomRight = cardCropRect(width, height, 3);

assert.deepEqual(topLeft, { sx: 0, sy: 0, sw: 535, sh: 300 });
assert.deepEqual(topRight, { sx: 465, sy: 0, sw: 535, sh: 300 });
assert.deepEqual(bottomLeft, { sx: 0, sy: 300, sw: 535, sh: 300 });
assert.deepEqual(bottomRight, { sx: 465, sy: 300, sw: 535, sh: 300 });
assert.equal(topLeft.sx + topLeft.sw - topRight.sx, 70, 'centre seam must overlap instead of clipping');

console.log('deck card crop smoke: PASS');
