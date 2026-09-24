#!/usr/bin/env python3
"""Render the Production Desk HTML with an embedded registry snapshot (fallback when LIVE is unreachable)."""
import argparse
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
FILES = ("manifest", "lanes", "briefings", "reviews", "standards", "wsa", "tools", "problems",
         "self_service")
MARK = "/*__EMBEDDED_REGISTRY__*/"


def embedded_payload(html: str) -> dict:
    """Re-parse exactly what the browser receives; catches broken manual assembly."""
    start = '<script id="embedded-registry" type="application/json">'
    end = "</script>"
    if start not in html:
        raise ValueError("embedded registry script missing")
    raw = html.split(start, 1)[1].split(end, 1)[0]
    return json.loads(raw)


def render(registry_dir: Path, template: Path, out: Path) -> None:
    reg = {f: json.loads((registry_dir / f"{f}.json").read_text(encoding="utf-8")) for f in FILES}
    payload = json.dumps(reg, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    html = template.read_text(encoding="utf-8")
    if MARK not in html:
        raise SystemExit("template marker missing")
    out.parent.mkdir(parents=True, exist_ok=True)
    rendered = html.replace(MARK, payload)
    parsed = embedded_payload(rendered)
    if parsed != reg:
        raise ValueError("embedded registry changed during rendering")
    out.write_text(rendered, encoding="utf-8")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--registry", default=str(HERE.parent.parent / "registry/production/v1"))
    ap.add_argument("--template", default=str(HERE / "desk/desk.template.html"))
    ap.add_argument("--out", default=str(HERE / "desk/KFB_PRODUCTION_DESK_V0.html"))
    a = ap.parse_args()
    render(Path(a.registry), Path(a.template), Path(a.out))
    print("rendered", a.out)
