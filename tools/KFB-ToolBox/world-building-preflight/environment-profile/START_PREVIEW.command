#!/bin/bash
set -e
cd "$(dirname "$0")"
PORT=4176
python3 -m http.server "$PORT" > .preview.log 2>&1 &
PID=$!
echo "$PID" > .preview.pid
open "http://127.0.0.1:$PORT/"
wait "$PID"
