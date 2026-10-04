#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from build import DEFAULT_OUT, ROOT, build as build_r0, git, read_json, read_jsonl, source_for, validate as validate_r0, write_json, write_jsonl

KFB_PETS_PATH = "media/3D_Assets/kfb-pets.json"
KFB_PETS = ROOT / KFB_PETS_PATH


def _append_unique(rows: list[dict], row: dict) -> None:
    if any(existing.get("resourceId") == row.get("resourceId") for existing in rows):
        return
    rows.append(row)


def augment(out_dir: Path) -> dict:
    manifest = build_r0(out_dir)
    commit = git("rev-parse", "HEAD")
    source = source_for(KFB_PETS_PATH, commit)
    pets = read_json(KFB_PETS)

    resources = read_jsonl(out_dir / "resources.jsonl")
    motions = read_jsonl(out_dir / "motions.jsonl")
    fx_rows = read_jsonl(out_dir / "fx.jsonl")

    motion_doc = pets.get("motion") if isinstance(pets.get("motion"), dict) else {}

    # Keep the contract's three vocabularies distinct:
    # motion.motions = authored procedural definitions
    # motion.clips   = embedded GLB clip tuning (not re-indexed here)
    # motion.anims   = semantic authored triggers/compositions
    for motion_id, params in (motion_doc.get("motions") or {}).items():
        if not isinstance(params, dict):
            continue
        row = {
            "resourceId": f"motion:kfb-pets/procedural/{motion_id}",
            "kind": "motion",
            "motionType": "authored-procedural",
            "displayName": motion_id,
            "status": "CONFIGURED",
            "provider": "KFB",
            "scopeRef": "kfb-pets",
            "actorRefs": [],
            "parameters": params,
            "executionStatus": "OWNER_RUNTIME_REQUIRED",
            "source": source,
            "provenance": "kfb-pets-config-explicit",
        }
        _append_unique(motions, row)
        _append_unique(resources, row)

    for entry in motion_doc.get("anims") or []:
        if not isinstance(entry, dict) or not entry.get("id"):
            continue
        # GLB-backed semantic aliases are already represented by their source clips elsewhere.
        # Keep them visible as semantic resources, but do not claim independent playback code.
        anim_id = str(entry["id"])
        row = {
            "resourceId": f"motion:kfb-pets/semantic/{anim_id}",
            "kind": "motion",
            "motionType": "semantic-animation",
            "displayName": anim_id,
            "status": "CONFIGURED",
            "provider": "KFB",
            "scopeRef": "kfb-pets",
            "actorRefs": [],
            "trigger": entry.get("trigger"),
            "description": entry.get("desc"),
            "sourceMode": entry.get("source"),
            "loop": entry.get("loop"),
            "executionStatus": "OWNER_RUNTIME_REQUIRED",
            "source": source,
            "provenance": "kfb-pets-config-explicit",
        }
        _append_unique(motions, row)
        _append_unique(resources, row)

    face = pets.get("face") if isinstance(pets.get("face"), dict) else {}
    eye = face.get("eye") if isinstance(face.get("eye"), dict) else {}
    for fx_name in eye.get("fx") or []:
        if not fx_name or fx_name == "none":
            continue
        row = {
            "resourceId": f"fx:kfb-pets/eye/{fx_name}",
            "kind": "fx",
            "fxType": "eye-config",
            "displayName": fx_name,
            "status": "CONFIGURED",
            "scopeRef": "kfb-pets",
            "actorRefs": [],
            "executionStatus": "OWNER_RUNTIME_REQUIRED",
            "source": source,
            "provenance": "kfb-pets-config-explicit",
        }
        _append_unique(fx_rows, row)
        _append_unique(resources, row)

    # Trigger FX are explicit names in motion.triggers[*].fx. Keep only those arrays;
    # eye/body fields are different contracts and must not be silently reclassified as FX.
    trigger_refs: dict[str, list[str]] = {}
    for trigger_id, trigger in (motion_doc.get("triggers") or {}).items():
        if not isinstance(trigger, dict):
            continue
        for fx_name in trigger.get("fx") or []:
            trigger_refs.setdefault(str(fx_name), []).append(str(trigger_id))
    for fx_name, triggers in sorted(trigger_refs.items()):
        row = {
            "resourceId": f"fx:kfb-pets/trigger/{fx_name}",
            "kind": "fx",
            "fxType": "trigger-fx",
            "displayName": fx_name,
            "status": "CONFIGURED",
            "scopeRef": "kfb-pets",
            "actorRefs": [],
            "triggerRefs": sorted(set(triggers)),
            "executionStatus": "OWNER_RUNTIME_REQUIRED",
            "source": source,
            "provenance": "kfb-pets-config-explicit",
        }
        _append_unique(fx_rows, row)
        _append_unique(resources, row)

    resources.sort(key=lambda row: row["resourceId"])
    motions.sort(key=lambda row: row["resourceId"])
    fx_rows.sort(key=lambda row: row["resourceId"])

    write_jsonl(out_dir / "resources.jsonl", resources)
    write_jsonl(out_dir / "motions.jsonl", motions)
    write_jsonl(out_dir / "fx.jsonl", fx_rows)

    counts = manifest["counts"]
    counts["resources"] = len(resources)
    counts["motions"] = len(motions)
    counts["fx"] = len(fx_rows)
    from collections import Counter
    counts["byKind"] = dict(sorted(Counter(row["kind"] for row in resources).items()))
    counts["byStatus"] = dict(sorted(Counter(row.get("status", "UNKNOWN") for row in resources).items()))
    manifest["customMotionSource"] = KFB_PETS_PATH
    manifest["resourceRegistryRevision"] = "R0.1"
    manifest["customMotionRule"] = "Preserve motion.motions, motion.clips and motion.anims as distinct vocabularies; no compatibility or runtime-execution claim."
    write_json(out_dir / "manifest.json", manifest)

    digest = hashlib.sha256((out_dir / "resources.jsonl").read_bytes()).hexdigest()
    write_json(out_dir / "checksums.json", {"resources.jsonl": digest})
    return manifest


def validate(out_dir: Path) -> None:
    validate_r0(out_dir)
    resources = read_jsonl(out_dir / "resources.jsonl")
    motions = read_jsonl(out_dir / "motions.jsonl")
    fx_rows = read_jsonl(out_dir / "fx.jsonl")

    ids = [row["resourceId"] for row in resources]
    if len(ids) != len(set(ids)):
        raise SystemExit("duplicate resourceId after R0.1 augmentation")

    by_id = {row["resourceId"]: row for row in motions}
    for required in ("motion:kfb-pets/semantic/roll", "motion:kfb-pets/semantic/kayfabulate", "motion:kfb-pets/procedural/hop"):
        if required not in by_id:
            raise SystemExit(f"missing configured custom motion {required}")
        if by_id[required].get("executionStatus") != "OWNER_RUNTIME_REQUIRED":
            raise SystemExit(f"custom motion overclaims execution status: {required}")

    fx_by_id = {row["resourceId"]: row for row in fx_rows}
    for required in ("fx:kfb-pets/eye/spiral", "fx:kfb-pets/eye/heart", "fx:kfb-pets/trigger/star", "fx:kfb-pets/trigger/dust"):
        if required not in fx_by_id:
            raise SystemExit(f"missing configured FX {required}")
        if fx_by_id[required].get("executionStatus") != "OWNER_RUNTIME_REQUIRED":
            raise SystemExit(f"configured FX overclaims execution status: {required}")

    manifest = read_json(out_dir / "manifest.json")
    if manifest.get("resourceRegistryRevision") != "R0.1":
        raise SystemExit("wrong resource registry revision")
    if manifest["counts"]["motions"] != len(motions) or manifest["counts"]["fx"] != len(fx_rows):
        raise SystemExit("R0.1 manifest count mismatch")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build KFB Production Resource Registry R0.1")
    parser.add_argument("command", choices=["build", "validate"], nargs="?", default="build")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    args = parser.parse_args()
    if args.command == "build":
        manifest = augment(args.out)
        print(json.dumps(manifest["counts"], sort_keys=True))
    else:
        validate(args.out)
        print("resource registry R0.1 OK")


if __name__ == "__main__":
    main()
