#!/bin/zsh
# Georgs Studio „KFB Batch EyeRig Atlas“ aus dem Quellcode ausliefern und Georgs Export eye-rig-medium.batch-1.json bereitlegen.
# Fest gepinnt (WS0-Abgleich 14.10., P0): Studio = Commit db823766 (cloudflare-live am 03.10., die Fassung mit Rogue_Hooded, in der Georg
# das Profil abgenommen hat), nie der bewegliche Branch. Batch-Export = main @ac9dbaed. Die öffentliche Route liefert nur die Startseite.
# Aufruf: KFB_REPO=<lokaler Klon georg-doc/kayfabizarro> zsh scripts/f1/serve-studio.sh   (Server: 127.0.0.1:8744)
set -e
REPO=${KFB_REPO:-$HOME/kfb-ws1/kayfabizarro}
OUT=test/out/studio
STUDIO_COMMIT=${STUDIO_COMMIT:-db823766370df932cc8134f21691036924a7d12c}
BATCH_COMMIT=${BATCH_COMMIT:-ac9dbaed2e5966a537a4bb719e8cd847dcc5e099}
BATCH=tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/data/eye-rig/eye-rig-medium.batch-1.json
rm -rf $OUT && mkdir -p $OUT
git -C $REPO cat-file -e "${STUDIO_COMMIT}^{commit}" 2>/dev/null || git -C $REPO fetch -q origin "$STUDIO_COMMIT"
git -C $REPO cat-file -e "${BATCH_COMMIT}^{commit}" 2>/dev/null || git -C $REPO fetch -q origin "$BATCH_COMMIT"
git -C $REPO archive "$STUDIO_COMMIT" kfb-hub/stage/toolbox/eye-rig-batch | tar -x -C $OUT
git -C $REPO show "${BATCH_COMMIT}:${BATCH}" > test/out/eye-rig-medium.batch-1.json
D=$OUT/kfb-hub/stage/toolbox/eye-rig-batch
{ echo "studioCommit $STUDIO_COMMIT"; echo "batchCommit $BATCH_COMMIT"; echo "batchBlob $(git hash-object test/out/eye-rig-medium.batch-1.json)"
  for f in index.html app.js lib/kaykit-eye-adapter.v1.js lib/medium-source-eye-cleanup.v1.js; do echo "blob $(git hash-object $D/$f) $f"; done } > test/out/studio-source.txt
cat test/out/studio-source.txt
cd $OUT && exec python3 -m http.server 8744 --bind 127.0.0.1
