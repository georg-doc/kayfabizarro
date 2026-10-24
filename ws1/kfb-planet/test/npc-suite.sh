#!/bin/bash
# WS-NPC · volle Reihe (Liste test/npc-suite.txt): je Test eine Zeile „Exit Dauer Datei Ergebnis“, Logs nach test/out/npc/suite_<name>.log.
# Vorher bauen (npx vite build), Slot nehmen (~/kfb-ws1/bin/kfb-slot wait <name> 50 "volle Reihe"), danach drop. Browser-Tests mit echter GPU.
# Bekannte Altfehler: test/c2.mjs (pupilZeroWhenClosed), test/c3g.mjs (glowsAtNight/noGlowByDay).
cd "$(dirname "$0")/.." || exit 1
mkdir -p test/out/npc
while read -r f; do [ -z "$f" ] && continue; s=$(date +%s); PW_GPU=1 node "$f" > "test/out/npc/suite_$(basename "$f" .mjs).log" 2>&1; rc=$?
  echo "$rc $(( $(date +%s)-s ))s $f $(tail -1 "test/out/npc/suite_$(basename "$f" .mjs).log" | cut -c1-160)"; done < test/npc-suite.txt
