#!/usr/bin/env bash
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../../../.." && pwd)"
PORT="${KFB_WC1_PORT:-8772}"
PAGE="/tools/KFB-ToolBox/worldbuilder/world-corridor-01/baseline-source/KFB%20World%20Core%20R2C%20%C2%B7%20WC1%20Baseline.dc.html"
URL="http://127.0.0.1:${PORT}${PAGE}"
LOG="${TMPDIR:-/tmp}/kfb-wc1-baseline-server.log"

cd "$ROOT"

if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server "$PORT" --bind 127.0.0.1 >"$LOG" 2>&1 &
  SERVER_PID=$!
elif command -v node >/dev/null 2>&1; then
  node "$HERE/local-static-server.mjs" "$PORT" >"$LOG" 2>&1 &
  SERVER_PID=$!
else
  echo "WC1 needs either python3 or node for a local HTTP server."
  exit 1
fi

cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

for _ in $(seq 1 30); do
  if curl -fsS "http://127.0.0.1:${PORT}/" >/dev/null 2>&1; then break; fi
  sleep 0.2
done

echo
echo "KFB WC1 GPU baseline"
echo "Opening: $URL"
echo "Keep Chrome visible, click \"Measure 10s\", then Copy JSON or Download JSON."
echo

if [[ "$(uname -s)" == "Darwin" ]]; then
  open -a "Google Chrome" "$URL" 2>/dev/null || open "$URL"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$URL" >/dev/null 2>&1 || true
else
  echo "Open this URL in Chrome:"
  echo "$URL"
fi

echo "Local server is running. Press Enter here when you are finished."
read -r _
