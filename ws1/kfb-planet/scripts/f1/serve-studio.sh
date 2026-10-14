#!/bin/zsh
# Georgs Studio „KFB Batch EyeRig Atlas“ aus dem Quellcode ausliefern (Branch cloudflare-live: die Fassung mit Rogue_Hooded, in der Georg das Profil abgenommen hat; unverändert) und Georgs
# Export eye-rig-medium.batch-1.json bereitlegen. Die öffentliche Route liefert derzeit nur die Startseite (14.10.).
# Aufruf: KFB_REPO=<lokaler Klon georg-doc/kayfabizarro> zsh scripts/f1/serve-studio.sh   (Server: 127.0.0.1:8744)
set -e
REPO=${KFB_REPO:-$HOME/kfb-ws1/kayfabizarro}
OUT=test/out/studio
rm -rf $OUT && mkdir -p $OUT
SRC=${STUDIO_REF:-cloudflare-live}
git -C $REPO fetch -q origin "${SRC}:refs/remotes/origin/studio-src" main
git -C $REPO archive origin/studio-src kfb-hub/stage/toolbox/eye-rig-batch | tar -x -C $OUT
git -C $REPO show "origin/main:tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/data/eye-rig/eye-rig-medium.batch-1.json" > test/out/eye-rig-medium.batch-1.json
cd $OUT && exec python3 -m http.server 8744 --bind 127.0.0.1
