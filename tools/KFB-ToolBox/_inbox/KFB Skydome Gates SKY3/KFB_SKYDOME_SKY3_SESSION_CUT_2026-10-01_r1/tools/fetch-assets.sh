#!/usr/bin/env sh
# KFB Skydome SKY3 · Assets von GitHub an die erwarteten relativen Pfade holen. Aus dem Wurzelordner des Cuts starten.
set -e
RAW="https://raw.githubusercontent.com/georg-doc/kayfabizarro/main"
get() { mkdir -p "$(dirname "$2")"; curl -fsSL "$RAW/$(printf '%s' "$1" | sed 's/ /%20/g')" -o "$2"; echo "ok  $2"; }

get "media/3D_Assets/KFB/Clouds by Jarlan Perez - b3Kia9N2fS2.glb" "media/3D_Assets/KFB/Clouds by Jarlan Perez - b3Kia9N2fS2.glb"
for n in 1 2 3 4 5 6 7 8 9 10 11; do
  get "media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Environment/GLTF/Planet_$n.gltf" "media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Environment/GLTF/Planet_$n.gltf"
done
get "tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/external/Fingerprints01_3K.png" "ref/clay-joebinns/Fingerprints01_3K.png"

# Pin prüfen (Git-Blob-SHA des Donors)
if command -v git >/dev/null 2>&1; then
  s=$(git hash-object "media/3D_Assets/KFB/Clouds by Jarlan Perez - b3Kia9N2fS2.glb")
  [ "$s" = "acd9d653f31f249d0bcf11a8b6311594a9d6e153" ] && echo "Donor = Pin" || echo "WARNUNG Donor ≠ Pin ($s)"
fi
