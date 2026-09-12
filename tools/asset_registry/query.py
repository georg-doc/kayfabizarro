#!/usr/bin/env python3
"""AR5 query/handoff CLI for KFB Asset Registry v1.

The CLI returns repo/registry facts plus an explicit consumer boundary. It never
turns a candidate into a gameplay/rig/donor compatibility decision.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

DEFAULT_REGISTRY = "registry/assets/v1"
DEFAULT_PROFILES = "tools/asset_registry/consumer_profiles.json"


def find_repo_root(start: Path | None = None) -> Path:
    start = (start or Path.cwd()).resolve()
    out = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"], cwd=start, check=True,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
    ).stdout.strip()
    return Path(out)


def _read_jsonl(path: Path) -> list[dict]:
    if not path.exists():
        return []
    rows: list[dict] = []
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def load_records(registry_dir: Path) -> tuple[dict, list[dict]]:
    manifest = json.loads((registry_dir / "manifest.json").read_text(encoding="utf-8"))
    records = _read_jsonl(registry_dir / "catalog.jsonl")
    rig_by_id = {row["assetId"]: row["rigFacts"] for row in _read_jsonl(registry_dir / "rigfacts.jsonl")}
    joined: list[dict] = []
    for record in records:
        rec = dict(record)
        if rec["assetId"] in rig_by_id:
            rec["rigFacts"] = rig_by_id[rec["assetId"]]
        joined.append(rec)
    return manifest, joined


def load_profiles(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))["profiles"]


def _match_text(record: dict, term: str | None) -> int | None:
    if not term:
        return 9
    q = term.casefold()
    name = str(record.get("name", "")).casefold()
    path = str(record.get("path", "")).casefold()
    pack = str(record.get("packId", "")).casefold()
    collection = str(record.get("collectionPath", "")).casefold()
    if name == q:
        return 0
    if name.startswith(q):
        return 1
    if q in name:
        return 2
    if q in pack:
        return 3
    if q in collection:
        return 4
    if q in path:
        return 5
    return None


def _yes_no_filter(value: object, wanted: str | None) -> bool:
    if wanted is None:
        return True
    if wanted == "yes":
        return value is True
    if wanted == "no":
        return value is False
    if wanted == "unknown":
        return value not in (True, False)
    return True


def filter_records(records: list[dict], args: argparse.Namespace, profile: dict | None) -> list[dict]:
    allowed_kinds = set(profile.get("allowedKinds", [])) if profile else set()
    out: list[tuple[int, dict]] = []
    for record in records:
        if allowed_kinds and record.get("kind") not in allowed_kinds:
            continue
        if args.kind and record.get("kind") != args.kind:
            continue
        if args.pack and record.get("packId") != args.pack:
            continue
        if args.format and record.get("format") != args.format:
            continue
        if args.dependency_status and record.get("dependencyStatus") != args.dependency_status:
            continue

        rig = record.get("rigFacts") or {}
        has_skin = rig.get("hasSkin") if rig.get("parseStatus") in {"ok", "not-applicable"} else None
        has_animation = (rig.get("animationCount") or 0) > 0 if rig.get("parseStatus") == "ok" else None
        if not _yes_no_filter(has_skin, args.rigged):
            continue
        if not _yes_no_filter(has_animation, args.animated):
            continue

        if args.clip:
            q = args.clip.casefold()
            names = [clip.get("name") for clip in rig.get("animationClips", []) if clip.get("name")]
            if not any(q in name.casefold() for name in names):
                continue
        if args.joint:
            q = args.joint.casefold()
            if not any(q in name.casefold() for name in rig.get("jointNames", [])):
                continue
        if args.signature:
            if args.signature not in rig.get("skeletonSignatures", []):
                continue

        score = _match_text(record, args.query)
        if score is None:
            continue
        out.append((score, record))

    out.sort(key=lambda pair: (pair[0], pair[1].get("name", "").casefold(), pair[1]["path"]))
    return [record for _, record in out[: args.limit]]


def compact_record(record: dict) -> dict:
    rig = record.get("rigFacts") or {}
    return {
        "assetId": record["assetId"],
        "name": record.get("name"),
        "path": record["path"],
        "kind": record.get("kind"),
        "format": record.get("format"),
        "packId": record.get("packId"),
        "collectionPath": record.get("collectionPath"),
        "dependencyStatus": record.get("dependencyStatus"),
        "source": record.get("source"),
        "rigFacts": rig or None,
    }


def handoff(manifest: dict, consumer_id: str, profile: dict, records: list[dict]) -> dict:
    return {
        "schema": "kfb.asset-handoff.v1",
        "sourceRepo": manifest.get("sourceRepo"),
        "sourceCommit": manifest.get("sourceCommit"),
        "consumer": {
            "consumerId": consumer_id,
            **profile,
        },
        "selectionStatus": "candidate-only",
        "suitabilityDecision": "owned-by-receiving-consumer",
        "assets": [compact_record(record) for record in records],
    }


def _text_line(record: dict) -> str:
    rig = record.get("rigFacts") or {}
    if rig.get("parseStatus") == "ok":
        rig_text = f"skin={str(bool(rig.get('hasSkin'))).lower()} joints={rig.get('jointCount', 0)} clips={rig.get('animationCount', 0)}"
    else:
        rig_text = f"rig={rig.get('parseStatus', 'unknown')}"
    return f"{record['path']}  [{record.get('packId') or '-'} · {record.get('format')} · {record.get('dependencyStatus') or '-'} · {rig_text}]"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Query KFB Asset Registry and emit consumer-safe handoffs")
    parser.add_argument("query", nargs="?", help="Name/path/pack/collection search text")
    parser.add_argument("--repo-root")
    parser.add_argument("--registry", default=DEFAULT_REGISTRY)
    parser.add_argument("--profiles", default=DEFAULT_PROFILES)
    parser.add_argument("--kind", choices=("model-3d", "image-2d", "audio"))
    parser.add_argument("--pack")
    parser.add_argument("--format")
    parser.add_argument("--dependency-status", choices=("complete", "embedded", "missing", "unresolved"))
    parser.add_argument("--rigged", choices=("yes", "no", "unknown"))
    parser.add_argument("--animated", choices=("yes", "no", "unknown"))
    parser.add_argument("--clip")
    parser.add_argument("--joint")
    parser.add_argument("--signature")
    parser.add_argument("--consumer")
    parser.add_argument("--limit", type=int, default=20)
    parser.add_argument("--json", action="store_true", help="Print full joined result records as JSON")
    parser.add_argument("--handoff", action="store_true", help="Emit kfb.asset-handoff.v1; requires --consumer")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.limit < 1:
        raise SystemExit("--limit must be >= 1")
    repo_root = Path(args.repo_root).resolve() if args.repo_root else find_repo_root()
    registry_dir = Path(args.registry)
    if not registry_dir.is_absolute():
        registry_dir = repo_root / registry_dir
    profiles_path = Path(args.profiles)
    if not profiles_path.is_absolute():
        profiles_path = repo_root / profiles_path

    manifest, records = load_records(registry_dir)
    profiles = load_profiles(profiles_path)
    profile = None
    if args.consumer:
        profile = profiles.get(args.consumer)
        if profile is None:
            raise SystemExit(f"unknown consumer: {args.consumer}; choose from {', '.join(sorted(profiles))}")
    if args.handoff and not args.consumer:
        raise SystemExit("--handoff requires --consumer")

    matches = filter_records(records, args, profile)
    if args.handoff:
        print(json.dumps(handoff(manifest, args.consumer, profile, matches), ensure_ascii=False, indent=2, sort_keys=True))
    elif args.json:
        print(json.dumps(matches, ensure_ascii=False, indent=2, sort_keys=True))
    else:
        for record in matches:
            print(_text_line(record))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
