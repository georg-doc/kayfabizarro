# helper: source me. mark <step> <evidence|--reason "..."> ; nxt
PY=~/.local/share/uv/python/cpython-3.12.9-macos-aarch64-none/bin/python3.12; SK=~/Developer/img2threejs
B="/Users/georgv.westphalen/Dropbox/CLAUDE/KFB Island Worldbuilder Lab/tools/img2threejs-tests/bridge02"
mark(){ s=$1; shift; "$PY" "$SK/forge/state.py" mark "$s" --state "$B/.img2threejs/state.json" "$@"; }
skip(){ s=$1; shift; "$PY" "$SK/forge/state.py" mark "$s" --state "$B/.img2threejs/state.json" --status skipped --reason "$*"; }
nxt(){ "$PY" "$SK/forge/next.py" --state "$B/.img2threejs/state.json" "$@"; }
