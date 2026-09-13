from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_REGISTRY = ROOT / "registry/resources/v1"


def _jsonl(path: Path):
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


class ResourceLibrary:
    def __init__(self, registry_dir: Path = DEFAULT_REGISTRY):
        self.registry_dir = registry_dir
        self.resources = _jsonl(registry_dir / "resources.jsonl")
        self.actors = {row["actorId"]: row for row in _jsonl(registry_dir / "actors.jsonl")}
        self.motions = _jsonl(registry_dir / "motions.jsonl")
        self.fx = _jsonl(registry_dir / "fx.jsonl")
        self.compositions = {row["compositionId"]: row for row in _jsonl(registry_dir / "compositions.jsonl")}

    def search_resources(self, text="", *, kind=None, actor=None, status=None, limit=50):
        q = text.casefold().strip()
        rows = []
        for row in self.resources:
            if kind and row.get("kind") != kind:
                continue
            if status and row.get("status") != status:
                continue
            if actor and actor not in row.get("actorRefs", []) and row.get("actorId") != actor and row.get("compositionId") != actor:
                continue
            haystack = " ".join(str(row.get(key, "")) for key in ("displayName", "resourceId", "role", "schema", "authoringPath"))
            if q and q not in haystack.casefold():
                continue
            rows.append(row)
        return rows[:limit]

    def get_actor(self, actor_id):
        return self.actors.get(actor_id)

    def get_motions(self, actor_id):
        return [row for row in self.motions if actor_id in row.get("actorRefs", [])]

    def get_fx(self, actor_id):
        return [row for row in self.fx if actor_id in row.get("actorRefs", [])]

    def get_composition(self, actor_id):
        return self.compositions.get(actor_id)

    def export_composition_plan(self, actor_id):
        actor = self.get_actor(actor_id)
        if not actor:
            raise KeyError(actor_id)
        return {
            "schema": "kfb.composition-plan.v1",
            "actorId": actor_id,
            "selectionStatus": "candidate-only",
            "suitabilityDecision": "owned-by-receiving-consumer",
            "actor": actor,
            "composition": self.get_composition(actor_id),
            "motions": self.get_motions(actor_id),
            "fx": self.get_fx(actor_id),
        }
