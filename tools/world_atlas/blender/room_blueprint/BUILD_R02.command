#!/bin/bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
MANIFEST="${1:-}"
if [ -z "$MANIFEST" ]; then
  if [ -f "$HOME/Downloads/KFB_R02_blender_manifest.json" ]; then
    MANIFEST="$HOME/Downloads/KFB_R02_blender_manifest.json"
  else
    MANIFEST="$(ls -t "$HOME"/Downloads/KFB_*_blender_manifest.json 2>/dev/null | head -1 || true)"
  fi
fi
if [ -z "$MANIFEST" ] || [ ! -f "$MANIFEST" ]; then
  echo "Kein KFB Blender-Manifest gefunden. Im S14 Room Blueprint zuerst 'Blender JSON' klicken."
  exit 2
fi
BLENDER=""
for CAND in   "/Applications/Blender.app/Contents/MacOS/Blender"   "/Applications/Blender 4.5.app/Contents/MacOS/Blender"   "/Applications/Blender 4.4.app/Contents/MacOS/Blender"
do
  if [ -x "$CAND" ]; then BLENDER="$CAND"; break; fi
done
if [ -z "$BLENDER" ]; then BLENDER="$(command -v blender || true)"; fi
if [ -z "$BLENDER" ]; then
  echo "Blender nicht gefunden. Erwartet unter /Applications/Blender.app oder im PATH."
  exit 3
fi
OUTDIR="${KFB_BLENDER_OUT:-$HOME/Downloads/KFB_R02_Blender}"
mkdir -p "$OUTDIR"
"$BLENDER" --background   --python "$HERE/build_room_from_manifest.py" --   "$MANIFEST"   --output "$OUTDIR/KFB_R02.blend"   --render "$OUTDIR/KFB_R02_review.png"   --export-glb "$OUTDIR/KFB_R02.glb"
echo
echo "Fertig: $OUTDIR"
open "$OUTDIR" 2>/dev/null || true
