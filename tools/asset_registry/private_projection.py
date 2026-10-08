#!/usr/bin/env python3
"""Validate and project private KFB intake metadata without exposing private bytes.

The public projection deliberately omits Production Inbox identifiers, private
paths, credentials, and download links.  It is safe to publish next to the
generated Asset Registry and can be merged by browsers and query clients.
"""
from __future__ import annotations

import argparse
import json
import re
from copy import deepcopy
from pathlib import Path
from urllib.parse import urlparse

SCHEMA = "kfb.asset-private-projection.v1"
LIVE_SCHEMA = "kfb.asset-private-live.v1"
INTAKE_SCHEMA = "kfb.asset-intake.v1"
ASSET_CLASS_TO_KIND = {
    "MODEL_3D": "model-3d",
    "TEXTURE_IMAGE": "image-2d",
    "ANIMATION": "model-3d",
    "MUSIC": "audio",
    "SFX": "audio",
    "UI_AUDIO": "audio",
    "VOICE": "audio",
    "AMBIENCE": "audio",
    "PACKAGE": "package",
    "OTHER": "other",
}
FORBIDDEN_KEYS = {
    "inboxfileid",
    "privatepath",
    "storagekey",
    "downloadtoken",
    "authorization",
    "cookie",
    "credential",
    "secret",
}
PRIVATE_URL_HOST_MARKERS = ("dropbox", "production-inbox", "private")
HEX_64 = re.compile(r"^[0-9a-f]{64}$")


class ProjectionError(ValueError):
    pass


def _require_text(value: object, label: str) -> str:
    text = str(value or "").strip()
    if not text:
        raise ProjectionError(f"{label} is required")
    return text


def _slug(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.casefold()).strip("-")
    return slug or "asset"


def _optional_url(value: object, label: str) -> str | None:
    if value in (None, ""):
        return None
    text = str(value).strip()
    parsed = urlparse(text)
    if parsed.scheme != "https" or not parsed.netloc:
        raise ProjectionError(f"{label} must be an absolute HTTPS URL")
    if any(marker in parsed.netloc.casefold() for marker in PRIVATE_URL_HOST_MARKERS):
        raise ProjectionError(f"{label} must not expose a private storage host")
    return text


def _format_for(file_record: dict) -> str:
    name = str(file_record.get("name") or "")
    suffix = Path(name).suffix.casefold().lstrip(".")
    return suffix or str(file_record.get("format") or "bin").casefold()


def project_intake(intake: dict, *, asset_key: str | None = None) -> dict:
    if intake.get("schema") != INTAKE_SCHEMA:
        raise ProjectionError(f"intake schema must be {INTAKE_SCHEMA}")
    intake_id = _require_text(intake.get("intakeId"), "intakeId")
    asset_class = _require_text(intake.get("assetClass"), "assetClass")
    if asset_class not in ASSET_CLASS_TO_KIND:
        raise ProjectionError(f"unsupported assetClass: {asset_class}")
    visibility = _require_text(intake.get("sourceVisibility"), "sourceVisibility")
    if visibility not in {"PRIVATE", "PUBLIC"}:
        raise ProjectionError("sourceVisibility must be PRIVATE or PUBLIC")
    files = intake.get("files")
    if not isinstance(files, list) or not files:
        raise ProjectionError("files must contain at least one file")
    primary = files[0]
    if not isinstance(primary, dict):
        raise ProjectionError("files[0] must be an object")
    name = _require_text(primary.get("name"), "files[0].name")
    size_bytes = int(primary.get("sizeBytes") or 0)
    if size_bytes < 1:
        raise ProjectionError("files[0].sizeBytes must be positive")
    digest = primary.get("sha256")
    if digest not in (None, "") and not HEX_64.fullmatch(str(digest).casefold()):
        raise ProjectionError("files[0].sha256 must be 64 lowercase hexadecimal characters")

    title = str(intake.get("title") or Path(name).stem).strip()
    key = _slug(asset_key or intake.get("assetKey") or f"{intake_id}-{title}")
    kind = ASSET_CLASS_TO_KIND[asset_class]
    fmt = _format_for(primary)
    delivery = deepcopy(intake.get("delivery") or {})
    preview_url = _optional_url(delivery.get("previewUrl"), "delivery.previewUrl")
    runtime_url = _optional_url(delivery.get("runtimeUrl"), "delivery.runtimeUrl")
    preview_status = str(delivery.get("previewStatus") or ("READY" if preview_url or runtime_url else "PENDING"))
    if preview_status not in {"PENDING", "READY", "UNAVAILABLE", "HOLD"}:
        raise ProjectionError("delivery.previewStatus is invalid")

    source_owner = str(intake.get("sourceOwner") or "KFB Production Inbox").strip()
    record = {
        "schema": SCHEMA,
        "assetId": f"private:{key}",
        "assetKey": key,
        "name": title,
        "path": f"private://{key}",
        "root": "private://production-inbox",
        "folder": "private://production-inbox",
        "kind": kind,
        "format": fmt,
        "sizeBytes": size_bytes,
        "packId": "private-production-inbox",
        "collectionPath": str(intake.get("collection") or "Private intake").strip(),
        "source": {
            "private": visibility == "PRIVATE",
            "visibility": visibility,
            "assetKey": key,
            "owner": source_owner,
        },
        "delivery": {
            "previewUrl": preview_url,
            "runtimeUrl": runtime_url,
            "previewStatus": preview_status,
        },
        "provenance": {
            "identity": "private-metadata-projection",
            "kind": "curated-intake",
            "intakeId": intake_id,
        },
        "artist": str(intake.get("artist") or "").strip() or None,
        "collection": str(intake.get("collection") or "").strip() or None,
        "creditText": str(intake.get("creditText") or "").strip() or None,
        "creditUrl": _optional_url(intake.get("creditUrl"), "creditUrl"),
        "license": deepcopy(intake.get("license")),
        "tags": sorted({str(tag).strip() for tag in (intake.get("roleTags") or []) if str(tag).strip()}),
    }
    if digest:
        record["integrity"] = {"sha256": str(digest).casefold()}
    if kind == "audio":
        audio = deepcopy(intake.get("audio") or {})
        audio.setdefault("audioClass", "UI" if asset_class == "UI_AUDIO" else asset_class)
        audio.setdefault("runtimeStatus", "INTAKE_ONLY")
        record["audio"] = audio
    return validate_projection_record(record)


def _walk_forbidden(value: object, path: str = "$") -> list[str]:
    errors: list[str] = []
    if isinstance(value, dict):
        for key, child in value.items():
            if str(key).casefold() in FORBIDDEN_KEYS:
                errors.append(f"forbidden private field at {path}.{key}")
            errors.extend(_walk_forbidden(child, f"{path}.{key}"))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            errors.extend(_walk_forbidden(child, f"{path}[{index}]"))
    return errors


def validate_projection_record(record: dict) -> dict:
    if not isinstance(record, dict):
        raise ProjectionError("projection record must be an object")
    if record.get("schema") != SCHEMA:
        raise ProjectionError(f"projection schema must be {SCHEMA}")
    for field in ("assetId", "assetKey", "name", "path", "kind", "format", "source", "delivery"):
        if record.get(field) in (None, ""):
            raise ProjectionError(f"projection field is required: {field}")
    if not str(record["assetId"]).startswith("private:"):
        raise ProjectionError("projection assetId must start with private:")
    if record["path"] != f"private://{record['assetKey']}":
        raise ProjectionError("projection path must be private://<assetKey>")
    source = record.get("source") or {}
    if set(source) - {"private", "visibility", "assetKey", "owner"}:
        raise ProjectionError("projection source contains fields outside the public-safe allowlist")
    if source.get("private") is not True:
        raise ProjectionError("private projection source.private must be true")
    if source.get("assetKey") != record.get("assetKey"):
        raise ProjectionError("projection source.assetKey mismatch")
    errors = _walk_forbidden(record)
    if errors:
        raise ProjectionError(errors[0])
    delivery = record.get("delivery") or {}
    for key in ("previewUrl", "runtimeUrl"):
        _optional_url(delivery.get(key), f"delivery.{key}")
    return record


def load_live_document(path: Path) -> tuple[dict, list[dict]]:
    if not path.exists():
        return {"schema": LIVE_SCHEMA, "revision": "none", "assets": []}, []
    doc = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(doc, dict) or doc.get("schema") != LIVE_SCHEMA:
        raise ProjectionError(f"live document schema must be {LIVE_SCHEMA}")
    assets = doc.get("assets")
    if not isinstance(assets, list):
        raise ProjectionError("live document assets must be an array")
    rows = [validate_projection_record(deepcopy(row)) for row in assets]
    ids = [row["assetId"] for row in rows]
    if len(ids) != len(set(ids)):
        raise ProjectionError("live document contains duplicate assetId values")
    rows.sort(key=lambda row: row["assetId"])
    return doc, rows


def write_jsonl(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="\n") as handle:
        for record in records:
            handle.write(json.dumps(record, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Project private KFB intake metadata safely")
    sub = parser.add_subparsers(dest="command", required=True)
    project = sub.add_parser("project", help="project one kfb.asset-intake.v1 JSON file")
    project.add_argument("--intake", required=True)
    project.add_argument("--asset-key")
    project.add_argument("--out")
    validate = sub.add_parser("validate-live", help="validate a public-safe live projection document")
    validate.add_argument("path")
    export = sub.add_parser("export-jsonl", help="validate live JSON and export deterministic JSONL")
    export.add_argument("path")
    export.add_argument("--out", required=True)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    if args.command == "project":
        intake = json.loads(Path(args.intake).read_text(encoding="utf-8"))
        record = project_intake(intake, asset_key=args.asset_key)
        payload = json.dumps(record, ensure_ascii=False, indent=2, sort_keys=True) + "\n"
        if args.out:
            Path(args.out).write_text(payload, encoding="utf-8")
        else:
            print(payload, end="")
        return 0
    if args.command == "validate-live":
        doc, rows = load_live_document(Path(args.path))
        print(f"OK: {len(rows)} public-safe private projection record(s) · revision {doc.get('revision')}")
        return 0
    if args.command == "export-jsonl":
        _, rows = load_live_document(Path(args.path))
        write_jsonl(Path(args.out), rows)
        print(f"OK: wrote {len(rows)} record(s) to {args.out}")
        return 0
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
