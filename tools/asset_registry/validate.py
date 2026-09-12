#!/usr/bin/env python3
"""AR4 integrity validator for generated KFB Asset Registry output.

Validation checks registry self-consistency. Asset-quality problems in problems.json
are data, not validator failures: missing source dependencies should be reviewable
without making the generated registry itself unreadable.
"""
from __future__ import annotations

import argparse
import json
import subprocess
from collections import Counter
from pathlib import Path


def find_repo_root(start: Path | None = None) -> Path:
    start = (start or Path.cwd()).resolve()
    proc = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        cwd=start,
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    return Path(proc.stdout.strip())


def load_json(path: Path) -> object:
    return json.loads(path.read_text(encoding="utf-8"))


def load_catalog(path: Path) -> list[dict]:
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def validate_registry(out_dir: Path) -> list[str]:
    errors: list[str] = []
    required = [
        "manifest.json",
        "catalog.jsonl",
        "summary.md",
        "problems.json",
        "delta.json",
        "packs/index.json",
        "decks/index.json",
    ]
    for rel in required:
        if not (out_dir / rel).is_file():
            errors.append(f"missing required output: {rel}")
    if errors:
        return errors

    try:
        manifest = load_json(out_dir / "manifest.json")
        catalog = load_catalog(out_dir / "catalog.jsonl")
        problems_doc = load_json(out_dir / "problems.json")
        delta = load_json(out_dir / "delta.json")
        pack_index = load_json(out_dir / "packs" / "index.json")
        deck_index = load_json(out_dir / "decks" / "index.json")
    except Exception as exc:
        return [f"generated output is not parseable: {exc}"]

    if not isinstance(manifest, dict):
        return ["manifest.json must contain an object"]
    source_commit = manifest.get("sourceCommit")
    counts = manifest.get("counts") or {}

    if counts.get("total") != len(catalog):
        errors.append(f"manifest total {counts.get('total')} != catalog rows {len(catalog)}")

    paths = [record.get("path") for record in catalog]
    if any(not isinstance(path, str) or not path for path in paths):
        errors.append("catalog contains record without valid path")
    elif len(paths) != len(set(paths)):
        errors.append("catalog paths are not unique")

    asset_ids = [record.get("assetId") for record in catalog]
    if len(asset_ids) != len(set(asset_ids)):
        errors.append("catalog assetIds are not unique")
    for record in catalog:
        if record.get("assetId") != record.get("path"):
            errors.append(f"assetId/path mismatch: {record.get('path')}")
            break
        if (record.get("source") or {}).get("commit") != source_commit:
            errors.append(f"source commit mismatch: {record.get('path')}")
            break

    by_kind = Counter(record.get("kind") for record in catalog)
    manifest_by_kind = counts.get("byKind") or {}
    for kind, expected in sorted(manifest_by_kind.items()):
        if by_kind.get(kind, 0) != expected:
            errors.append(f"manifest kind count mismatch for {kind}: {expected} != {by_kind.get(kind, 0)}")
        shard_rel = (manifest.get("shards") or {}).get(kind)
        if not shard_rel:
            errors.append(f"manifest missing shard path for kind {kind}")
            continue
        shard_path = out_dir / shard_rel
        if not shard_path.is_file():
            errors.append(f"missing kind shard: {shard_rel}")
            continue
        shard = load_json(shard_path)
        if not isinstance(shard, list) or len(shard) != expected:
            errors.append(f"kind shard count mismatch for {kind}")

    if not isinstance(pack_index, list):
        errors.append("packs/index.json must contain an array")
    else:
        pack_ids = set()
        shard_paths_seen: set[str] = set()
        shard_asset_paths: list[str] = []
        for pack in pack_index:
            pack_id = pack.get("packId")
            shard_rel = pack.get("shard")
            if not pack_id or pack_id in pack_ids:
                errors.append(f"invalid or duplicate packId: {pack_id}")
                continue
            pack_ids.add(pack_id)
            if not shard_rel or shard_rel in shard_paths_seen:
                errors.append(f"invalid or duplicate pack shard: {shard_rel}")
                continue
            shard_paths_seen.add(shard_rel)
            shard_path = out_dir / shard_rel
            if not shard_path.is_file():
                errors.append(f"missing pack shard: {shard_rel}")
                continue
            shard = load_json(shard_path)
            if not isinstance(shard, dict) or shard.get("packId") != pack_id:
                errors.append(f"pack shard identity mismatch: {shard_rel}")
                continue
            shard_asset_paths.extend(asset.get("path") for asset in shard.get("assets", []))
        if counts.get("packs") != len(pack_ids):
            errors.append(f"manifest pack count {counts.get('packs')} != pack index {len(pack_ids)}")
        if sorted(shard_asset_paths) != sorted(paths):
            errors.append("pack shards do not partition the catalog exactly")

    if not isinstance(deck_index, dict):
        errors.append("decks/index.json must contain an object")
    else:
        decks = deck_index.get("decks", [])
        deck_ids: set[str] = set()
        for deck in decks:
            deck_id = deck.get("deckId")
            shard_rel = deck.get("shard")
            if not deck_id or deck_id in deck_ids:
                errors.append(f"invalid or duplicate deckId: {deck_id}")
                continue
            deck_ids.add(deck_id)
            if not shard_rel or not (out_dir / shard_rel).is_file():
                errors.append(f"missing deck shard: {shard_rel}")
                continue
            shard = load_json(out_dir / shard_rel)
            if not isinstance(shard, dict) or shard.get("deckId") != deck_id:
                errors.append(f"deck shard identity mismatch: {shard_rel}")
        if deck_index.get("count") != len(deck_ids):
            errors.append(f"deck index count {deck_index.get('count')} != entries {len(deck_ids)}")
        if counts.get("decks") != len(deck_ids):
            errors.append(f"manifest deck count {counts.get('decks')} != deck index {len(deck_ids)}")
        if deck_index.get("sourceCommit") != source_commit:
            errors.append("deck index sourceCommit differs from manifest")

    if not isinstance(problems_doc, dict):
        errors.append("problems.json must contain an object")
    else:
        problems = problems_doc.get("problems", [])
        actual_problem_counts = Counter(problem.get("type") for problem in problems)
        if problems_doc.get("counts") != dict(sorted(actual_problem_counts.items())):
            errors.append("problems.json counts do not match problem list")
        if problems_doc.get("sourceCommit") != source_commit:
            errors.append("problems.json sourceCommit differs from manifest")

    if not isinstance(delta, dict):
        errors.append("delta.json must contain an object")
    else:
        if delta.get("toCommit") != source_commit:
            errors.append("delta toCommit differs from manifest sourceCommit")
        for key in ("added", "removed", "moved", "changedDependencies", "newProblems", "resolvedProblems"):
            if not isinstance(delta.get(key), list):
                errors.append(f"delta field is not an array: {key}")

    return errors


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Validate generated KFB Asset Registry")
    parser.add_argument("--repo-root", help="Git checkout root")
    parser.add_argument("--config", default="tools/asset_registry/config.json")
    parser.add_argument("--out", help="Override output directory relative to repo root")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repo_root = Path(args.repo_root).resolve() if args.repo_root else find_repo_root()
    config_path = Path(args.config)
    if not config_path.is_absolute():
        config_path = repo_root / config_path
    config = json.loads(config_path.read_text(encoding="utf-8"))
    out_dir = Path(args.out) if args.out else Path(config["output"])
    if not out_dir.is_absolute():
        out_dir = repo_root / out_dir
    errors = validate_registry(out_dir)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    print(f"OK: {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
