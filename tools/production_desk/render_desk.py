#!/usr/bin/env python3
"""Render the Production Desk HTML with an embedded registry snapshot (fallback when LIVE is unreachable)."""
import argparse
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
FILES = ("manifest", "lanes", "briefings", "reviews", "standards", "wsa", "tools", "problems")
MARK = "/*__EMBEDDED_REGISTRY__*/"


def render(registry_dir: Path, template: Path, out: Path) -> None:
    reg = {f: json.loads((registry_dir / f"{f}.json").read_text(encoding="utf-8")) for f in FILES}
    payload = json.dumps(reg, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    html = template.read_text(encoding="utf-8")
    if MARK not in html:
        raise SystemExit("template marker missing")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html.replace(MARK, payload), encoding="utf-8")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--registry", default=str(HERE.parent.parent / "registry/production/v1"))
    ap.add_argument("--template", default=str(HERE / "desk/desk.template.html"))
    ap.add_argument("--out", default=str(HERE / "desk/KFB_PRODUCTION_DESK_V0.html"))
    a = ap.parse_args()
    render(Path(a.registry), Path(a.template), Path(a.out))
    print("rendered", a.out)
