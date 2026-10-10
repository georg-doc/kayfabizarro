// Several KFB sheets use artwork and page headings that cross the exact 50/50
// centre line. Keep a small seam overlap so a card preview does not amputate
// the card at that production bleed. Vertical geometry remains a strict 2x2 grid.
export const CARD_CROP_SEAM_OVERLAP = 0.035;

export function cardCropRect(width, height, quadrant, overlap = CARD_CROP_SEAM_OVERLAP) {
  const col = quadrant % 2;
  const row = Math.floor(quadrant / 2);
  const midX = Math.floor(width / 2);
  const midY = Math.floor(height / 2);
  const seam = Math.max(0, Math.round(width * overlap));
  const sx = col === 0 ? 0 : Math.max(0, midX - seam);
  const right = col === 0 ? Math.min(width, midX + seam) : width;
  const sy = row === 0 ? 0 : midY;
  const bottom = row === 0 ? midY : height;
  return { sx, sy, sw: right - sx, sh: bottom - sy };
}
