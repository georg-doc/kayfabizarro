#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[2]
DEFAULT_OUT = ROOT / "registry/resources/v1"
TOOLBOX_MANIFEST = ROOT / "tools/KFB-ToolBox/TOOLBOX_MANIFEST.json"
MODULE_INDEX = ROOT / "tools/KFB-ToolBox/docs/MODULES.json"
ASSET_CATALOG = ROOT / "registry/assets/v1/catalog.jsonl"
RIGFACTS = ROOT / "registry/assets/v1/rigfacts.jsonl"
OVERRIDES = ROOT / "tools/resource_registry/overrides.json"
REPO = "georg-doc/kayfabizarro"


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def read_jsonl(path: Path):
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def write_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False, sort_keys=True) + "\n", encoding="utf-8")


def write_jsonl(path: Path, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    text = "".join(json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n" for row in rows)
    path.write_text(text, encoding="utf-8")


def git(*args: str) -> str:
    return subprocess.check_output(["git", *args], cwd=ROOT, text=True).strip()


def source_for(path: str, commit: str) -> dict:
    blob = ""
    try:
        line = git("ls-files", "-s", "--", path)
        if line:
            blob = line.split()[1]
    except Exception:
        pass
    encoded = quote(path, safe="/")
    return {
        "repo": REPO,
        "commit": commit,
        "path": path,
        "blobSha": blob or None,
        "rawPinned": f"https://raw.githubusercontent.com/{REPO}/{commit}/{encoded}",
        "rawLatest": f"https://raw.githubusercontent.com/{REPO}/main/{encoded}",
    }


def schema_for(data: dict) -> str | None:
    if isinstance(data.get("$schema"), str):
        return data["$schema"]
    if isinstance(data.get("schema"), str):
        return data["schema"]
    if isinstance(data.get("kind"), str) and data.get("version") is not None:
        return f"{data['kind']}/{data['version']}"
    return None


def config_kind(schema: str | None, data: dict) -> str:
    if schema and schema.startswith("kfb.carl.rig/"):
        return "rig-config"
    if schema == "kfb.pets/1":
        return "actor-config"
    if data.get("kind") == "kfb-mech-vehicle-rig":
        return "vehicle-rig"
    return "config"


def module_kind(role: str) -> str:
    low = role.casefold()
    if "composition" in low or "graftbiped" in low:
        return "composition-module"
    if "animation contract" in low:
        return "motion-contract"
    if "wobble" in low or "color helper" in low:
        return "fx"
    if "rig" in low or "face" in low or "mount" in low:
        return "rig-module"
    return "module-reference"


def short_summary(data: dict) -> dict:
    summary = {}
    for src, dst in (("figure", "figure"), ("fig", "figure"), ("version", "version"), ("saved", "saved"), ("updated", "updated")):
        if src in data and dst not in summary:
            summary[dst] = data[src]
    pets = data.get("pets")
    if isinstance(pets, list):
        summary["petCount"] = len(pets)
        ids = []
        for pet in pets:
            if isinstance(pet, dict):
                for key in ("id", "petId", "key", "name"):
                    if pet.get(key):
                        ids.append(str(pet[key]))
                        break
        if ids:
            summary["petIds"] = ids
    fx = (((data.get("face") or {}).get("eye") or {}).get("fx")) if isinstance(data.get("face"), dict) else None
    if isinstance(fx, list):
        summary["eyeFx"] = fx
    return summary


def build(out_dir: Path) -> dict:
    commit = git("rev-parse", "HEAD")
    toolbox = read_json(TOOLBOX_MANIFEST)
    modules_doc = read_json(MODULE_INDEX)
    overrides = read_json(OVERRIDES)
    catalog = read_jsonl(ASSET_CATALOG)
    rig_rows = read_jsonl(RIGFACTS)
    catalog_by_id = {row["assetId"]: row for row in catalog}
    rig_by_id = {row["assetId"]: row.get("rigFacts", {}) for row in rig_rows}

    actor_overrides = overrides.get("actors", [])
    config_to_actors = defaultdict(list)
    module_to_actors = defaultdict(list)
    for actor in actor_overrides:
        for path in actor.get("configPaths", []):
            config_to_actors[path].append(actor["actorId"])
        for path in actor.get("modulePaths", []):
            module_to_actors[path].append(actor["actorId"])
    fx_override = {row["authoringPath"]: row for row in overrides.get("fxModules", [])}

    source_base = Path(toolbox["source"]["path"])
    resources = []
    configs = []
    for file_info in toolbox["source"].get("files", []):
        if file_info.get("kind") != "wip-config" or not file_info["name"].endswith(".json"):
            continue
        rel = (source_base / file_info["name"]).as_posix()
        data = read_json(ROOT / rel)
        schema = schema_for(data)
        record = {
            "resourceId": rel,
            "kind": config_kind(schema, data),
            "displayName": file_info["name"],
            "status": "WIP_CONFIG",
            "schema": schema,
            "actorRefs": sorted(config_to_actors.get(rel, [])),
            "summary": short_summary(data),
            "source": source_for(rel, commit),
            "provenance": "file-explicit",
        }
        configs.append(record)
        resources.append(record)

    module_records = []
    for module in modules_doc.get("modules", []):
        path = module["authoringPath"]
        fx_extra = fx_override.get(path, {})
        kind = "fx" if fx_extra else module_kind(module.get("role", ""))
        record = {
            "resourceId": f"module:{path}",
            "kind": kind,
            "displayName": Path(path).name,
            "status": "DOCUMENTED_REFERENCE",
            "actorRefs": sorted(set(module_to_actors.get(path, []) + fx_extra.get("actorRefs", []))),
            "authoringPath": path,
            "role": module.get("role"),
            "fxType": fx_extra.get("fxType"),
            "implementationAudit": module.get("implementationAudit", "NOT_TESTED"),
            "deliveredAsLooseSource": bool(module.get("deliveredAsLooseSource", False)),
            "evidenceDocument": module.get("evidenceDocument"),
            "provenance": "source-document-reference",
        }
        module_records.append(record)
        resources.append(record)

    motion_map = {}
    actor_motion_counts = Counter()
    for actor in actor_overrides:
        prefix = actor.get("motionPathPrefix")
        if not prefix:
            continue
        for asset in catalog:
            if asset.get("kind") != "model-3d" or not asset["assetId"].startswith(prefix):
                continue
            facts = rig_by_id.get(asset["assetId"], {})
            for index, clip in enumerate(facts.get("animationClips", [])):
                name = clip.get("name") or f"Clip {index + 1}"
                resource_id = f"motion:{asset['assetId']}#{index:03d}"
                motion = motion_map.get(resource_id)
                if motion is None:
                    motion = {
                        "resourceId": resource_id,
                        "kind": "motion",
                        "motionType": "embedded-clip",
                        "displayName": name,
                        "clipName": name,
                        "status": "AVAILABLE",
                        "provider": "KayKit",
                        "rig": "Medium",
                        "actorRefs": [],
                        "sourceAssetId": asset["assetId"],
                        "packId": asset.get("packId"),
                        "animationSet": asset.get("name"),
                        "source": asset.get("source"),
                        "provenance": "asset-rigfacts-explicit",
                    }
                    motion_map[resource_id] = motion
                if actor["actorId"] not in motion["actorRefs"]:
                    motion["actorRefs"].append(actor["actorId"])
                    actor_motion_counts[actor["actorId"]] += 1

    motions = list(motion_map.values())
    for motion in motions:
        motion["actorRefs"].sort()
        resources.append(motion)

    fx_records = [row for row in module_records if row["kind"] == "fx"]
    for config in configs:
        for name in config.get("summary", {}).get("eyeFx", []):
            if name == "none":
                continue
            row = {
                "resourceId": f"configfx:{config['resourceId']}#eye:{name}",
                "kind": "fx",
                "fxType": "eye",
                "displayName": name,
                "status": "WIP_CONFIG",
                "actorRefs": config.get("actorRefs", []),
                "sourceConfigId": config["resourceId"],
                "provenance": "file-explicit",
            }
            fx_records.append(row)
            resources.append(row)

    actors = []
    compositions = []
    for actor in actor_overrides:
        assets = []
        for asset_id in actor.get("assetIds", []):
            asset = catalog_by_id.get(asset_id)
            assets.append({
                "assetId": asset_id,
                "exists": asset is not None,
                "kind": asset.get("kind") if asset else None,
                "format": asset.get("format") if asset else None,
                "packId": asset.get("packId") if asset else None,
                "source": asset.get("source") if asset else None,
                "rigFacts": rig_by_id.get(asset_id),
            })
        actor_record = {
            "resourceId": f"actor:{actor['actorId']}",
            "actorId": actor["actorId"],
            "kind": "actor",
            "actorKind": actor.get("kind", "asset-backed"),
            "displayName": actor["displayName"],
            "aliases": actor.get("aliases", []),
            "status": actor.get("status", "WIP"),
            "assets": assets,
            "configResourceIds": actor.get("configPaths", []),
            "moduleResourceIds": [f"module:{p}" for p in actor.get("modulePaths", [])],
            "motionCount": actor_motion_counts[actor["actorId"]],
            "motionPathPrefix": actor.get("motionPathPrefix"),
            "evidence": actor.get("evidence", []),
            "notes": actor.get("notes", []),
            "provenance": "explicit-override-with-evidence",
        }
        actors.append(actor_record)
        resources.append(actor_record)
        if actor.get("kind") == "composition":
            composition = {
                "resourceId": f"composition:{actor['actorId']}",
                "compositionId": actor["actorId"],
                "kind": "composition",
                "displayName": actor["displayName"],
                "status": actor.get("status", "WIP"),
                "hostAssetId": actor.get("hostAssetId"),
                "configResourceIds": actor.get("configPaths", []),
                "moduleResourceIds": [f"module:{p}" for p in actor.get("modulePaths", [])],
                "motionCount": actor_motion_counts[actor["actorId"]],
                "evidence": actor.get("evidence", []),
                "selectionStatus": "candidate-only",
                "suitabilityDecision": "owned-by-receiving-consumer",
                "provenance": "explicit-override-with-evidence",
            }
            compositions.append(composition)
            resources.append(composition)

    def ordered(rows):
        return sorted(rows, key=lambda r: r["resourceId"])

    resources = ordered(resources)
    actors = ordered(actors)
    motions = ordered(motions)
    fx_records = ordered(fx_records)
    compositions = ordered(compositions)
    configs = ordered(configs)

    counts = {
        "resources": len(resources),
        "actors": len(actors),
        "configs": len(configs),
        "motions": len(motions),
        "fx": len(fx_records),
        "compositions": len(compositions),
        "byKind": dict(sorted(Counter(row["kind"] for row in resources).items())),
        "byStatus": dict(sorted(Counter(row.get("status", "UNKNOWN") for row in resources).items())),
    }
    manifest = {
        "schema": "kfb.resource-registry.v1",
        "sourceRepo": REPO,
        "sourceCommit": commit,
        "assetRegistrySourceCommit": read_json(ROOT / "registry/assets/v1/manifest.json").get("sourceCommit"),
        "toolboxManifest": "tools/KFB-ToolBox/TOOLBOX_MANIFEST.json",
        "moduleIndex": "tools/KFB-ToolBox/docs/MODULES.json",
        "counts": counts,
        "ownerRule": "Discovery/index only. Existing tool, actor, rig, animation, FX and consumer owners remain authoritative.",
    }

    out_dir.mkdir(parents=True, exist_ok=True)
    write_json(out_dir / "manifest.json", manifest)
    write_jsonl(out_dir / "resources.jsonl", resources)
    write_jsonl(out_dir / "actors.jsonl", actors)
    write_jsonl(out_dir / "configs.jsonl", configs)
    write_jsonl(out_dir / "motions.jsonl", motions)
    write_jsonl(out_dir / "fx.jsonl", fx_records)
    write_jsonl(out_dir / "compositions.jsonl", compositions)
    digest = hashlib.sha256((out_dir / "resources.jsonl").read_bytes()).hexdigest()
    write_json(out_dir / "checksums.json", {"resources.jsonl": digest})
    return manifest


def validate(out_dir: Path) -> None:
    manifest = read_json(out_dir / "manifest.json")
    resources = read_jsonl(out_dir / "resources.jsonl")
    actors = read_jsonl(out_dir / "actors.jsonl")
    motions = read_jsonl(out_dir / "motions.jsonl")
    ids = [row["resourceId"] for row in resources]
    if len(ids) != len(set(ids)):
        raise SystemExit("duplicate resourceId")
    if manifest["counts"]["resources"] != len(resources):
        raise SystemExit("resource count mismatch")
    actor_ids = {row["actorId"] for row in actors}
    for motion in motions:
        if not set(motion.get("actorRefs", [])).issubset(actor_ids):
            raise SystemExit(f"unknown actorRef in {motion['resourceId']}")
    for actor in actors:
        for asset in actor.get("assets", []):
            if not asset.get("exists"):
                raise SystemExit(f"missing actor asset {asset['assetId']}")
    expected_configs = sum(1 for row in read_json(TOOLBOX_MANIFEST)["source"]["files"] if row.get("kind") == "wip-config" and row["name"].endswith(".json"))
    if manifest["counts"]["configs"] != expected_configs:
        raise SystemExit("ToolBox config coverage mismatch")
    if not any(row.get("compositionId") == "frizzlebob-driver-graft" for row in read_jsonl(out_dir / "compositions.jsonl")):
        raise SystemExit("missing FrizzleBob Driver Graft composition")
    if not any(row.get("actorId") == "capsule-carl" for row in actors):
        raise SystemExit("missing CapsuleCarl actor")


def main():
    parser = argparse.ArgumentParser(description="Build KFB Production Resource Registry R0")
    parser.add_argument("command", choices=["build", "validate"], nargs="?", default="build")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    args = parser.parse_args()
    if args.command == "build":
        manifest = build(args.out)
        print(json.dumps(manifest["counts"], sort_keys=True))
    else:
        validate(args.out)
        print("resource registry OK")


if __name__ == "__main__":
    main()
