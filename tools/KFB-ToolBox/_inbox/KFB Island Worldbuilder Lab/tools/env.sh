# Source this: puts the bundled Node 24 + pnpm on PATH (no system Node on this machine).
R="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies"
export PATH="$PWD/tools/bin:$R/node/bin:$R/bin/fallback:$PATH"
