#!/usr/bin/env python3
"""Safely unpack a repository asset ZIP into a same-level folder.

The command is intentionally strict: it refuses ambiguous paths, encrypted
members, links, duplicates, oversized archives, and any existing target.  It
extracts into a staging directory first, writes a checksummed inventory, then
atomically moves the completed pack into place.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import shutil
import stat
import sys
import tempfile
from typing import Iterable
import zipfile


SCHEMA = "kfb.asset-pack-unpack/1"
MAX_ENTRIES = 20_000
MAX_TOTAL_BYTES = 2 * 1024 * 1024 * 1024
MAX_FILE_BYTES = 95 * 1024 * 1024


class UnpackError(RuntimeError):
    pass


def _inside_repo(path: Path, repo: Path) -> Path:
    resolved = path.resolve()
    try:
        resolved.relative_to(repo)
    except ValueError as exc:
        raise UnpackError(f"Path escapes repository: {path}") from exc
    return resolved


def _member_path(name: str) -> PurePosixPath | None:
    if not name or "\\" in name or name.startswith("/"):
        raise UnpackError(f"Unsafe member path: {name!r}")
    path = PurePosixPath(name)
    if any(part in {"", ".", ".."} for part in path.parts):
        raise UnpackError(f"Unsafe member path: {name!r}")
    if path.parts and path.parts[0].endswith(":"):
        raise UnpackError(f"Unsafe member path: {name!r}")
    if "__MACOSX" in path.parts or path.name == ".DS_Store" or path.name.startswith("._"):
        return None
    return path


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _validate_members(infos: Iterable[zipfile.ZipInfo]) -> list[tuple[zipfile.ZipInfo, PurePosixPath]]:
    selected: list[tuple[zipfile.ZipInfo, PurePosixPath]] = []
    seen: set[str] = set()
    total = 0
    for info in infos:
        path = _member_path(info.filename)
        if path is None or info.is_dir():
            continue
        if info.flag_bits & 0x1:
            raise UnpackError(f"Encrypted member is not supported: {info.filename}")
        mode = (info.external_attr >> 16) & 0xFFFF
        if mode and stat.S_ISLNK(mode):
            raise UnpackError(f"Symbolic link is not supported: {info.filename}")
        key = path.as_posix().casefold()
        if key in seen:
            raise UnpackError(f"Duplicate or case-colliding member: {info.filename}")
        seen.add(key)
        if info.file_size > MAX_FILE_BYTES:
            raise UnpackError(f"Member exceeds {MAX_FILE_BYTES} bytes: {info.filename}")
        total += info.file_size
        if total > MAX_TOTAL_BYTES:
            raise UnpackError(f"Archive exceeds {MAX_TOTAL_BYTES} uncompressed bytes")
        selected.append((info, path))
        if len(selected) > MAX_ENTRIES:
            raise UnpackError(f"Archive exceeds {MAX_ENTRIES} files")
    if not selected:
        raise UnpackError("Archive has no usable files")
    return selected


def unpack_archive(zip_path: Path, target: Path, remove_zip: bool = False) -> dict:
    repo = Path.cwd().resolve()
    archive = _inside_repo(zip_path, repo)
    destination = _inside_repo(target, repo)
    if archive.suffix.lower() != ".zip" or "media" not in archive.relative_to(repo).parts:
        raise UnpackError("Archive must be a .zip below media/")
    if destination.parent.resolve() != archive.parent.resolve():
        raise UnpackError("Target must be next to the source ZIP")
    if destination.name != archive.stem:
        raise UnpackError("Target folder must use the ZIP filename without .zip")
    if destination.exists():
        raise UnpackError(f"Target already exists: {destination.relative_to(repo)}")

    archive_hash = _sha256(archive)
    with zipfile.ZipFile(archive) as source:
        members = _validate_members(source.infolist())
        staging = Path(tempfile.mkdtemp(prefix=f".{destination.name}.unpack-", dir=destination.parent))
        inventory = []
        try:
            for info, relative in members:
                output = staging.joinpath(*relative.parts)
                _inside_repo(output, repo)
                output.parent.mkdir(parents=True, exist_ok=True)
                digest = hashlib.sha256()
                with source.open(info, "r") as src, output.open("xb") as dst:
                    while chunk := src.read(1024 * 1024):
                        dst.write(chunk)
                        digest.update(chunk)
                inventory.append({
                    "path": relative.as_posix(),
                    "bytes": info.file_size,
                    "sha256": digest.hexdigest(),
                })

            counts: dict[str, int] = {}
            for item in inventory:
                suffix = Path(item["path"]).suffix.lower().lstrip(".") or "none"
                counts[suffix] = counts.get(suffix, 0) + 1
            license_files = [item["path"] for item in inventory if "license" in Path(item["path"]).name.lower()]
            manifest = {
                "schema": SCHEMA,
                "sourceArchive": archive.relative_to(repo).as_posix(),
                "sourceArchiveSha256": archive_hash,
                "targetDirectory": destination.relative_to(repo).as_posix(),
                "removedSourceArchive": bool(remove_zip),
                "fileCount": len(inventory),
                "totalBytes": sum(item["bytes"] for item in inventory),
                "formats": dict(sorted(counts.items())),
                "licenseFiles": license_files,
                "files": inventory,
            }
            manifest_path = staging / "_kfb-unpack-manifest.json"
            manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
            os.replace(staging, destination)
        except Exception:
            shutil.rmtree(staging, ignore_errors=True)
            raise

    if remove_zip:
        archive.unlink()
    return manifest


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("zip_path", type=Path)
    parser.add_argument("--target", type=Path)
    parser.add_argument("--remove-zip", action="store_true")
    args = parser.parse_args()
    target = args.target or args.zip_path.with_suffix("")
    try:
        manifest = unpack_archive(args.zip_path, target, args.remove_zip)
    except (UnpackError, zipfile.BadZipFile, OSError) as exc:
        print(f"asset unpack failed: {exc}", file=sys.stderr)
        return 1
    print(json.dumps({key: manifest[key] for key in ("targetDirectory", "fileCount", "totalBytes", "formats", "licenseFiles")}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
