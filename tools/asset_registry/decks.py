"""AR3 adapter for the existing KFB deck registry.

The existing media/kfb/kfb-index.json remains the explicit deck owner. AR3 only
projects that contract into small registry shards and validates referenced files.
"""
from __future__ import annotations

import json
import posixpath
from pathlib import Path
from urllib.parse import quote


def _raw_url(repo: str, ref: str, path: str) -> str:
    return f"https://raw.githubusercontent.com/{repo}/{ref}/{quote(path, safe='/')}"


def _join(root: str, name: str) -> str:
    return posixpath.normpath(posixpath.join(root.rstrip('/'), name))


def _problem(kind: str, *, deck_id: str | None, path: str | None, detail: str) -> dict:
    token = deck_id or path or detail
    return {
        "problemId": f"{kind}:{token}",
        "type": kind,
        "deckId": deck_id,
        "assetPath": path,
        "detail": detail,
        "provenance": "manifest-explicit",
    }


def build_decks(
    repo_root: Path,
    *,
    registry_path: str,
    deck_root: str,
    tracked_paths: set[str],
    repo: str,
    commit: str,
) -> tuple[list[dict], dict, list[dict]]:
    source_path = repo_root / registry_path
    source = json.loads(source_path.read_text(encoding="utf-8"))
    source_schema = source.get("schema")
    records: list[dict] = []
    problems: list[dict] = []
    seen: set[str] = set()

    for raw in source.get("decks", []):
        deck_id = raw.get("packId")
        if not deck_id:
            problems.append(
                _problem(
                    "DECK_ID_MISSING",
                    deck_id=None,
                    path=registry_path,
                    detail="deck entry has no packId",
                )
            )
            continue
        if deck_id in seen:
            problems.append(
                _problem(
                    "DUPLICATE_DECK_ID",
                    deck_id=deck_id,
                    path=registry_path,
                    detail="duplicate packId in source deck registry",
                )
            )
            continue
        seen.add(deck_id)

        representations = {"pdf": [], "cardTextJson": [], "web": [], "images": []}
        for field, bucket, problem_type in (
            ("pdf", "pdf", "MISSING_DECK_PDF"),
            ("data", "cardTextJson", "MISSING_DECK_DATA"),
        ):
            name = raw.get(field)
            if not name:
                continue
            path = _join(deck_root, name)
            exists = path in tracked_paths
            representations[bucket].append(
                {
                    "path": path,
                    "exists": exists,
                    "sourceField": field,
                    "provenance": "manifest-explicit",
                    "rawLatest": _raw_url(repo, "main", path),
                    "rawPinned": _raw_url(repo, commit, path),
                }
            )
            if not exists:
                problems.append(
                    _problem(
                        problem_type,
                        deck_id=deck_id,
                        path=path,
                        detail=f"{field} referenced by {registry_path} is not tracked",
                    )
                )

        metadata = {
            key: raw[key]
            for key in sorted(raw)
            if key not in {"packId", "title", "pdf", "data"}
        }
        records.append(
            {
                "schema": "kfb.asset-deck.v1",
                "deckId": deck_id,
                "title": raw.get("title"),
                "root": deck_root,
                "groupingStatus": "explicit",
                "representations": representations,
                "metadata": metadata,
                "sourceRegistry": {
                    "path": registry_path,
                    "schema": source_schema,
                    "provenance": "manifest-explicit",
                },
                "sourceCommit": commit,
            }
        )

    records.sort(key=lambda deck: deck["deckId"])
    problems.sort(
        key=lambda problem: (
            problem["type"],
            problem.get("deckId") or "",
            problem.get("assetPath") or "",
        )
    )

    index = {
        "schema": "kfb.asset-deck-index.v1",
        "sourceRegistry": {
            "path": registry_path,
            "schema": source_schema,
            "provenance": "manifest-explicit",
        },
        "sourceCommit": commit,
        "count": len(records),
        "decks": [
            {
                "deckId": record["deckId"],
                "title": record["title"],
                "groupingStatus": record["groupingStatus"],
                "shard": f"decks/{record['deckId']}.json",
            }
            for record in records
        ],
        "sets": source.get("sets", []),
        "rules": source.get("rules", []),
    }
    return records, index, problems
