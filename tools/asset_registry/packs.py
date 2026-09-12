"""AR2 deterministic structural pack grouping for the KFB Asset Registry."""
from __future__ import annotations

import re
from collections import Counter, defaultdict
from pathlib import PurePosixPath
from typing import Iterable


def slugify(value: str) -> str:
    value = value.strip().casefold().replace("_", "-")
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "pack"


def structural_pack_root(path: str, roots: Iterable[str]) -> str:
    for root in roots:
        root = root.rstrip("/")
        if path == root:
            return root
        prefix = root + "/"
        if path.startswith(prefix):
            remainder = path[len(prefix):]
            first = remainder.split("/", 1)[0]
            if "/" in remainder:
                return f"{root}/{first}"
            return root
    raise ValueError(f"path outside configured roots: {path}")


def collection_path(path: str, pack_root: str) -> str | None:
    prefix = pack_root.rstrip("/") + "/"
    if not path.startswith(prefix):
        return None
    remainder = path[len(prefix):]
    if "/" not in remainder:
        return None
    return remainder.split("/", 1)[0]


def _default_pack_id(pack_root: str, roots: Iterable[str]) -> str:
    for root in roots:
        root = root.rstrip("/")
        if pack_root == root:
            return f"{slugify(PurePosixPath(root).name)}-loose"
        if pack_root.startswith(root + "/"):
            return slugify(PurePosixPath(pack_root).name)
    return slugify(PurePosixPath(pack_root).name)


def assign_packs(records: list[dict], roots: list[str], overrides: dict | None = None) -> dict[str, dict]:
    """Mutate records with structural pack fields and return pack metadata keyed by packId."""
    overrides = overrides or {}
    override_map = overrides.get("packs", {})

    roots_by_record = {rec["path"]: structural_pack_root(rec["path"], roots) for rec in records}
    provisional: dict[str, str] = {}
    for pack_root in sorted(set(roots_by_record.values())):
        ov = override_map.get(pack_root, {})
        provisional[pack_root] = ov.get("packId") or _default_pack_id(pack_root, roots)

    grouped: dict[str, list[str]] = defaultdict(list)
    for pack_root, pack_id in provisional.items():
        grouped[pack_id].append(pack_root)
    for pack_id, pack_roots in grouped.items():
        if len(pack_roots) <= 1:
            continue
        for pack_root in sorted(pack_roots):
            root = next((r for r in roots if pack_root == r or pack_root.startswith(r.rstrip("/") + "/")), "root")
            provisional[pack_root] = f"{pack_id}-{slugify(PurePosixPath(root).name)}"

    packs: dict[str, dict] = {}
    for rec in records:
        pack_root = roots_by_record[rec["path"]]
        pack_id = provisional[pack_root]
        ov = override_map.get(pack_root, {})
        rec["packId"] = pack_id
        rec["packRoot"] = pack_root
        col = collection_path(rec["path"], pack_root)
        if col:
            rec["collectionPath"] = col
        rec.setdefault("provenance", {})["pack"] = "reviewed-override" if pack_root in override_map else "generated-structural"

        if pack_id not in packs:
            packs[pack_id] = {
                "packId": pack_id,
                "root": pack_root,
                "displayName": ov.get("displayName") or PurePosixPath(pack_root).name,
                "provenance": "reviewed-override" if pack_root in override_map else "generated-structural",
                "assetCount": 0,
                "kinds": Counter(),
                "formats": Counter(),
                "collections": Counter(),
            }
        meta = packs[pack_id]
        meta["assetCount"] += 1
        meta["kinds"][rec["kind"]] += 1
        meta["formats"][rec["format"]] += 1
        if col:
            meta["collections"][col] += 1

    for meta in packs.values():
        meta["kinds"] = dict(sorted(meta["kinds"].items()))
        meta["formats"] = dict(sorted(meta["formats"].items()))
        meta["collections"] = [
            {"path": name, "assetCount": count}
            for name, count in sorted(meta["collections"].items())
        ]
    return dict(sorted(packs.items()))
