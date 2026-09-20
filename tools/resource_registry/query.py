#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
from library import ResourceLibrary, DEFAULT_REGISTRY


def main():
    p = argparse.ArgumentParser(description="Query KFB Production Resource Registry")
    p.add_argument("text", nargs="?", default="")
    p.add_argument("--registry", type=Path, default=DEFAULT_REGISTRY)
    p.add_argument("--kind")
    p.add_argument("--actor")
    p.add_argument("--status")
    p.add_argument("--motions")
    p.add_argument("--fx")
    p.add_argument("--compose")
    p.add_argument("--limit", type=int, default=50)
    args = p.parse_args()
    lib = ResourceLibrary(args.registry)
    if args.motions:
        rows = lib.get_motions(args.motions)
    elif args.fx:
        rows = lib.get_fx(args.fx)
    elif args.compose:
        print(json.dumps(lib.export_composition_plan(args.compose), indent=2, ensure_ascii=False))
        return
    else:
        rows = lib.search_resources(args.text, kind=args.kind, actor=args.actor, status=args.status, limit=args.limit)
    for row in rows[: args.limit]:
        print(json.dumps(row, ensure_ascii=False, sort_keys=True))


if __name__ == "__main__":
    main()
