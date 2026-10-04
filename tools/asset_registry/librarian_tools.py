#!/usr/bin/env python3
"""Read-only tool facade for KFB Asset Librarian v1.1.

This module exposes the deterministic Asset Registry through a small, provider-
agnostic tool surface that can later be bound to MCP, OpenAI tool calling, a
private web app, or another LLM host.

Hard boundary: tool results are repo/registry facts and candidate selections.
They never declare gameplay, donor, artistic, or retarget compatibility.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from types import SimpleNamespace
from typing import Any

from query import (
    DEFAULT_PROFILES,
    DEFAULT_REGISTRY,
    compact_record,
    filter_records,
    find_repo_root,
    handoff,
    load_profiles,
    load_records,
)

TOOL_RESULT_SCHEMA = "kfb.asset-librarian-tool-result.v1"
TOOL_CATALOG_SCHEMA = "kfb.asset-librarian-tool-catalog.v1"


class LibrarianToolError(ValueError):
    """Raised for invalid read-only tool requests."""


class LibrarianTools:
    """In-memory read-only view over one generated Registry snapshot."""

    def __init__(
        self,
        *,
        repo_root: Path | None = None,
        registry_dir: Path | None = None,
        profiles_path: Path | None = None,
        manifest: dict | None = None,
        records: list[dict] | None = None,
        profiles: dict | None = None,
    ) -> None:
        if manifest is None or records is None or profiles is None:
            root = (repo_root or find_repo_root()).resolve()
            reg = registry_dir or (root / DEFAULT_REGISTRY)
            profile_file = profiles_path or (root / DEFAULT_PROFILES)
            loaded_manifest, loaded_records = load_records(reg)
            loaded_profiles = load_profiles(profile_file)
            manifest = loaded_manifest if manifest is None else manifest
            records = loaded_records if records is None else records
            profiles = loaded_profiles if profiles is None else profiles

        self.manifest = dict(manifest)
        self.records = [dict(record) for record in records]
        self.profiles = dict(profiles)
        self.by_id = {record["assetId"]: record for record in self.records}

    @classmethod
    def from_data(cls, manifest: dict, records: list[dict], profiles: dict) -> "LibrarianTools":
        return cls(manifest=manifest, records=records, profiles=profiles)

    def _base(self, tool: str) -> dict:
        return {
            "schema": TOOL_RESULT_SCHEMA,
            "tool": tool,
            "sourceRepo": self.manifest.get("sourceRepo"),
            "sourceCommit": self.manifest.get("sourceCommit"),
            "selectionStatus": "candidate-only",
            "factBoundary": "Registry facts are not consumer suitability decisions.",
        }

    def _record(self, asset_id: str) -> dict:
        record = self.by_id.get(asset_id)
        if record is None:
            raise LibrarianToolError(f"unknown assetId: {asset_id}")
        return record

    def _profile(self, consumer_id: str | None) -> dict | None:
        if consumer_id is None:
            return None
        profile = self.profiles.get(consumer_id)
        if profile is None:
            raise LibrarianToolError(
                f"unknown consumer: {consumer_id}; choose from {', '.join(sorted(self.profiles))}"
            )
        return profile

    @staticmethod
    def _filter_args(query: str | None, filters: dict[str, Any], limit: int) -> SimpleNamespace:
        dependency_status = filters.get("dependencyStatus", filters.get("dependency_status"))
        return SimpleNamespace(
            query=query,
            kind=filters.get("kind"),
            pack=filters.get("pack"),
            format=filters.get("format"),
            dependency_status=dependency_status,
            rigged=filters.get("rigged"),
            animated=filters.get("animated"),
            clip=filters.get("clip"),
            joint=filters.get("joint"),
            signature=filters.get("signature"),
            limit=limit,
        )

    def search_assets(
        self,
        query: str | None = None,
        *,
        filters: dict[str, Any] | None = None,
        consumer_id: str | None = None,
        limit: int = 12,
    ) -> dict:
        """Search/filter Registry facts and return compact candidate records."""
        if limit < 1 or limit > 50:
            raise LibrarianToolError("limit must be between 1 and 50")
        filters = dict(filters or {})
        profile = self._profile(consumer_id)
        args = self._filter_args(query, filters, limit)
        matches = filter_records(self.records, args, profile)
        result = self._base("search_assets")
        result.update({
            "query": query,
            "filters": filters,
            "consumerId": consumer_id,
            "count": len(matches),
            "assets": [compact_record(record) for record in matches],
        })
        return result

    def get_asset(self, asset_id: str) -> dict:
        """Return one asset with core Registry metadata and structural relations."""
        record = self._record(asset_id)
        asset = compact_record(record)
        for key in ("sizeBytes", "root", "folder", "provenance", "relations"):
            if key in record:
                asset[key] = record[key]
        result = self._base("get_asset")
        result["asset"] = asset
        return result

    def get_dependencies(self, asset_id: str) -> dict:
        """Return only explicit dependency rows/status for one asset."""
        record = self._record(asset_id)
        result = self._base("get_dependencies")
        result.update({
            "assetId": asset_id,
            "path": record.get("path"),
            "dependencyStatus": record.get("dependencyStatus"),
            "dependencies": list((record.get("relations") or {}).get("dependencies") or []),
        })
        return result

    def get_rig_facts(self, asset_id: str) -> dict:
        """Return file-explicit/generated structural rig facts for one asset."""
        record = self._record(asset_id)
        result = self._base("get_rig_facts")
        result.update({
            "assetId": asset_id,
            "path": record.get("path"),
            "rigFacts": record.get("rigFacts"),
        })
        return result

    def find_same_skeleton(self, asset_id: str, *, limit: int = 20) -> dict:
        """Find exact structural skeleton-signature overlaps.

        Equality is structural evidence only. It is deliberately not labelled as
        retarget or gameplay compatibility.
        """
        if limit < 1 or limit > 50:
            raise LibrarianToolError("limit must be between 1 and 50")
        source = self._record(asset_id)
        source_rig = source.get("rigFacts") or {}
        signatures = set(source_rig.get("skeletonSignatures") or [])
        result = self._base("find_same_skeleton")
        result.update({
            "assetId": asset_id,
            "path": source.get("path"),
            "evidenceType": "exact-structural-skeleton-signature-overlap",
            "compatibilityDecision": "not-made",
            "sourceSignatures": sorted(signatures),
        })
        if not signatures:
            result.update({"count": 0, "candidates": [], "reason": "source asset has no skeleton signature"})
            return result

        matches: list[dict] = []
        for record in self.records:
            if record.get("assetId") == asset_id:
                continue
            rig = record.get("rigFacts") or {}
            candidate_signatures = set(rig.get("skeletonSignatures") or [])
            overlap = sorted(signatures & candidate_signatures)
            if not overlap:
                continue
            matches.append({
                "asset": compact_record(record),
                "matchingSignatures": overlap,
            })
        matches.sort(key=lambda row: (
            str(row["asset"].get("packId") or "").casefold(),
            str(row["asset"].get("name") or "").casefold(),
            row["asset"]["path"],
        ))
        result.update({"count": min(len(matches), limit), "candidates": matches[:limit]})
        return result

    def export_handoff(self, consumer_id: str, asset_ids: list[str]) -> dict:
        """Export selected assets using the existing kfb.asset-handoff.v1 contract."""
        profile = self._profile(consumer_id)
        seen: set[str] = set()
        selected: list[dict] = []
        for asset_id in asset_ids:
            if asset_id in seen:
                continue
            seen.add(asset_id)
            selected.append(self._record(asset_id))
        payload = handoff(self.manifest, consumer_id, profile, selected)
        allowed = set(profile.get("allowedKinds", []))
        for asset in payload["assets"]:
            asset["consumerKindAllowed"] = not allowed or asset.get("kind") in allowed
        return payload

    def tool_catalog(self) -> dict:
        """Return provider-neutral tool metadata for later MCP/OpenAI binding."""
        tools = [
            {
                "name": "search_assets",
                "description": "Search Registry candidates by text, structural metadata, rig/animation facts, and optional consumer profile.",
                "input": {
                    "query": "string|null",
                    "filters": {
                        "kind": "model-3d|image-2d|audio",
                        "pack": "string",
                        "format": "string",
                        "dependencyStatus": "complete|embedded|missing|unresolved",
                        "rigged": "yes|no|unknown",
                        "animated": "yes|no|unknown",
                        "clip": "string",
                        "joint": "string",
                        "signature": "string",
                    },
                    "consumer_id": "string|null",
                    "limit": "1..50",
                },
            },
            {"name": "get_asset", "description": "Get one asset's Registry facts.", "input": {"asset_id": "string"}},
            {"name": "get_dependencies", "description": "Get explicit model/material dependency facts.", "input": {"asset_id": "string"}},
            {"name": "get_rig_facts", "description": "Get structural rig and animation facts.", "input": {"asset_id": "string"}},
            {
                "name": "find_same_skeleton",
                "description": "Find exact skeleton-signature overlaps; this is structural evidence, not a compatibility decision.",
                "input": {"asset_id": "string", "limit": "1..50"},
            },
            {
                "name": "export_handoff",
                "description": "Export selected candidates to an existing consumer using kfb.asset-handoff.v1.",
                "input": {"consumer_id": "string", "asset_ids": "string[]"},
            },
        ]
        return {
            "schema": TOOL_CATALOG_SCHEMA,
            "mode": "read-only",
            "sourceRepo": self.manifest.get("sourceRepo"),
            "sourceCommit": self.manifest.get("sourceCommit"),
            "tools": tools,
            "rule": "Compatibility/suitability remain inference until receiving-consumer validation.",
        }

    def call(self, tool: str, arguments: dict[str, Any] | None = None) -> dict:
        """Provider-neutral dispatcher for one tool call."""
        arguments = dict(arguments or {})
        methods = {
            "search_assets": self.search_assets,
            "get_asset": self.get_asset,
            "get_dependencies": self.get_dependencies,
            "get_rig_facts": self.get_rig_facts,
            "find_same_skeleton": self.find_same_skeleton,
            "export_handoff": self.export_handoff,
        }
        method = methods.get(tool)
        if method is None:
            raise LibrarianToolError(f"unknown tool: {tool}; choose from {', '.join(sorted(methods))}")
        return method(**arguments)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Read-only KFB Asset Librarian v1.1 tool facade")
    parser.add_argument("--repo-root")
    parser.add_argument("--registry", default=DEFAULT_REGISTRY)
    parser.add_argument("--profiles", default=DEFAULT_PROFILES)
    parser.add_argument("--list-tools", action="store_true")
    parser.add_argument("--tool")
    parser.add_argument("--args", default="{}", help="JSON object with tool arguments")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    root = Path(args.repo_root).resolve() if args.repo_root else find_repo_root()
    registry = Path(args.registry)
    if not registry.is_absolute():
        registry = root / registry
    profiles = Path(args.profiles)
    if not profiles.is_absolute():
        profiles = root / profiles
    tools = LibrarianTools(repo_root=root, registry_dir=registry, profiles_path=profiles)

    try:
        if args.list_tools:
            result = tools.tool_catalog()
        elif args.tool:
            arguments = json.loads(args.args)
            if not isinstance(arguments, dict):
                raise LibrarianToolError("--args must decode to a JSON object")
            result = tools.call(args.tool, arguments)
        else:
            raise LibrarianToolError("use --list-tools or --tool")
    except (LibrarianToolError, json.JSONDecodeError) as exc:
        print(json.dumps({"error": str(exc)}, ensure_ascii=False, indent=2), file=sys.stderr)
        return 2

    print(json.dumps(result, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    import sys
    raise SystemExit(main())
