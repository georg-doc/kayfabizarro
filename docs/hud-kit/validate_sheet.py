#!/usr/bin/env python3
"""KFB HUD authoring PNG gate. Structural checks only; visual critic still required."""
import argparse
import json
import sys
from pathlib import Path
from PIL import Image

SIZE = (2048, 2048)
BANDS = ((32, 462), (494, 1059), (1091, 2016))

def validate(path, sheet):
    issues = []
    image = Image.open(path)
    if image.format != "PNG":
        issues.append("FILE_NOT_PNG")
    if image.mode != "RGBA":
        issues.append("IMAGE_NOT_RGBA")
        image = image.convert("RGBA")
    if image.size != SIZE:
        issues.append("WRONG_DIMENSIONS")
    alpha = image.getchannel("A")
    w, h = image.size
    zeros = sum(1 for v in alpha.getdata() if v == 0)
    total = w * h
    if zeros == 0:
        issues.append("NO_FULLY_TRANSPARENT_PIXELS")
    for px, py in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        if alpha.getpixel((px, py)) != 0:
            issues.append("BACKGROUND_CORNER_NOT_TRANSPARENT")
            break
    if w == h == 2048:
        bbox = alpha.getbbox()
        if bbox and (bbox[0] < 32 or bbox[1] < 32 or bbox[2] > 2016 or bbox[3] > 2016):
            issues.append("LESS_THAN_32PX_OUTER_MARGIN")
        if sheet == 1:
            for y0, y1 in ((462, 494), (1059, 1091)):
                if alpha.crop((0, y0, w, y1)).getbbox():
                    issues.append("SHEET1_BAND_GAP_OCCUPIED")
                    break
            for y0, y1 in BANDS:
                if alpha.crop((0, y0, w, y1)).getbbox() is None:
                    issues.append("SHEET1_EMPTY_BAND")
                    break
        elif sheet == 2:
            for row in range(4):
                for col in range(4):
                    x, y = col * 512, row * 512
                    inner = alpha.crop((x + 16, y + 16, x + 496, y + 496))
                    if inner.getbbox() is None:
                        issues.append("SHEET2_MISSING_CELL_%d_%d" % (row + 1, col + 1))
                    border_checks = ((x, y, x + 512, y + 16),
                                     (x, y + 496, x + 512, y + 512),
                                     (x, y, x + 16, y + 512),
                                     (x + 496, y, x + 512, y + 512))
                    if any(alpha.crop(region).getbbox() for region in border_checks):
                        issues.append("SHEET2_CELL_BORDER_OCCUPIED_%d_%d" % (row + 1, col + 1))
    return {"path": str(path), "size_px": [w, h], "mode": image.mode,
            "transparent_fraction": round(zeros / total, 5),
            "sheet": sheet, "structural_pass": not issues, "issues": issues,
            "manual_gates": ["reference_match", "correct_motifs", "single_item_per_cell",
                             "edge_quality", "48px_readability", "slice_seams"]}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("png", type=Path)
    parser.add_argument("--sheet", type=int, choices=(1, 2), required=True)
    args = parser.parse_args()
    try:
        result = validate(args.png, args.sheet)
    except Exception as exc:
        print(json.dumps({"structural_pass": False, "error": str(exc)}))
        return 2
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["structural_pass"] else 1

if __name__ == "__main__":
    sys.exit(main())
