# Source this: puts Node 24 on PATH. Preferred: user install ~/.local/node (LTS, since 2026-10-10).
# Fallback: the Node bundled with the Codex runtime (older setup, may disappear on Codex updates).
R="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies"
export PATH="$PWD/tools/bin:$HOME/.local/node/bin:$R/node/bin:$R/bin/fallback:$PATH"
