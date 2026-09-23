#!/bin/bash
cd "$(dirname "$0")"
if [ -f .preview.pid ]; then
  PID="$(cat .preview.pid)"
  kill "$PID" 2>/dev/null || true
  rm -f .preview.pid
fi
