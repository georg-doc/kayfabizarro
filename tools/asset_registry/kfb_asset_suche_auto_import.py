#!/usr/bin/env python3
"""KFB Asset Suche -> original, licence-verified candidate -> canonical GitHub asset path.
No replacement geometry, no look pass, no automatic Georg selection.
GitHub Actions stages only source-owned bytes on its existing review branch.
"""
from __future__ import annotations

import hashlib
import io
import json
from pathlib import Path, PurePosixPath
import re
import shutil
import sys
import tempfile
from urllib.parse import urlparse
from urllib.request import Request, urlopen
import zipfile

# Reuse the established KFB asset-unpack path/symlink/duplicate and ZIP bomb guards.
from tools.asset_registry.unpack_asset_pack import _validate_members, UnpackError

SCHEMA = "kfb.asset-suche-github-intake/1"
BASE = Path("media/3D_Assets/KFB_Landmark_Candidates")
MAX_DOWNLOAD = 60 * 1024 * 1024
MAX_EXTRACTED = 100 * 1024 * 1024
ALLOWED_SPDX = {"CC0-1.0", "CC-BY-4.0"}
ALLOWED_HOSTS = {"opengameart.org", "www.opengameart.org", "3d.shep.bot"}
ASSET_FORMATS = {".glb", ".gltf", ".obj", ".fbx", ".blend", ".blend1", ".stl", ".dae"}
SUPPORT_FORMATS = ASSET_FORMATS | {".png", ".jpg", ".jpeg", ".webp", ".exr", ".mtl", ".bin", ".txt"}


class IntakeError(RuntimeError):
    pass


def digest(payload: bytes) -> str:
    return hashlib.sha256(payload).hexdigest()


def safe_token(value: str) -> str:
    if not isinstance(value, str) or not re.fullmatch(r"[a-z0-9][a-z0-9_-]{1,79}", value):
        raise IntakeError(f"Unsafe item identifier: {value!r}")
    return value


def safe_relative(raw: str) -> PurePosixPath:
    if not isinstance(raw, str) or not raw or "\\" in raw or raw.startswith("/"):
        raise IntakeError("Unsafe relative file")
    p = PurePosixPath(raw)
    if any(x in ("", ".", "..") for x in p.parts) or ":" in p.parts[0]:
        raise IntakeError("Unsafe path traversal")
    if p.suffix.lower() not in SUPPORT_FORMATS:
        raise IntakeError(f"Unapproved file extension: {p.suffix}")
    return p


def check_source(source: dict) -> None:
    for k in ("id", "landmarkId"):
        safe_token(source[k])
    if source.get("sourceRole") not in {
        "exact-landmark-model-not-final-diorama",
        "partial-site-exact-pyramid-not-ball-court",
        "exact-landmark-model",
    }:
        raise IntakeError("Non-landmark donor cannot enter this intake")
    if not source.get("identityChecked") or not source.get("rightsVerifiedForPublicRepo"):
        raise IntakeError("Exact identity / public rights not verified")
    if source.get("sourceApproval") != "CANDIDATE_ONLY_KNETE_FOLGT_NOT_GEORG_SELECTED":
        raise IntakeError("Candidate approval boundary not preserved")
    spdx = source.get("license")
    if spdx not in ALLOWED_SPDX:
        raise IntakeError("License blocked (paid/private, NC, unknown, etc.)")
    if not source.get("author") or not source.get("sourcePage") or not source.get("licenceEvidence"):
        raise IntakeError("Creator, original source page and license evidence required")
    if spdx == "CC-BY-4.0" and not source.get("attribution"):
        raise IntakeError("CC-BY attribution missing")
    for key in ("archiveUrl", "sourcePage", "licenceEvidence"):
        u = urlparse(source[key])
        if u.scheme != "https" or not u.hostname:
            raise IntakeError("HTTPS source URL required")
    url = urlparse(source["archiveUrl"])
    if url.hostname not in ALLOWED_HOSTS or url.port not in (None, 443):
        raise IntakeError("Download host requires owner allowlist review")
    for key in ("archiveSha256", "selectedSourceSha256"):
        if not re.fullmatch(r"[0-9a-f]{64}", str(source.get(key, ""))):
            raise IntakeError(f"Exact {key} is required")
    files = source.get("files")
    if not isinstance(files, list) or not files or len(files) > 50:
        raise IntakeError("Bounded explicit file allowlist required")
    seen = set()
    if source.get("selectedSourceFile") not in [x["archiveMember"] for x in files]:
        raise IntakeError("Selected landmark model missing from extraction roster")
    for f in files:
        src = safe_relative(f["archiveMember"])
        dst = safe_relative(f["destination"])
        if not str(dst).startswith("source/") or len(dst.parts) < 2:
            raise IntakeError("All original model files must stay below source/")
        if dst.as_posix().casefold() in seen:
            raise IntakeError("Case colliding output path")
        seen.add(dst.as_posix().casefold())
    if not any(safe_relative(x["destination"]).suffix.lower() in ASSET_FORMATS for x in files):
        raise IntakeError("No actual model file")


def download_bytes(url: str) -> bytes:
    req = Request(url, headers={"User-Agent": "KFB-Asset-Suche-GitHub-Intake/1.0", "Accept": "application/zip,application/octet-stream,*/*"})
    # urllib follows redirects; revalidate resolved URL to avoid non-reviewed remote origins.
    with urlopen(req, timeout=80) as response:
        actual = urlparse(response.geturl())
        if actual.scheme != "https" or actual.hostname not in ALLOWED_HOSTS:
            raise IntakeError("Redirected download host not pre-approved")
        declared = response.headers.get("Content-Length")
        if declared and int(declared) > MAX_DOWNLOAD:
            raise IntakeError("Overlarge download")
        output = bytearray()
        while block := response.read(1024 * 1024):
            output.extend(block)
            if len(output) > MAX_DOWNLOAD:
                raise IntakeError("Download cap exceeded")
        return bytes(output)


def extract_whitelist(source: dict, payload: bytes) -> list[dict]:
    """Archive stays in RAM for one bounded candidate; only source-owned allowlist bytes emerge."""
    requested = {x["archiveMember"]: x["destination"] for x in source["files"]}
    contents = {}
    if source["archiveUrl"].lower().split("?")[0].endswith(".zip"):
        with zipfile.ZipFile(io.BytesIO(payload)) as archive:
            members = {p.as_posix(): z for z, p in _validate_members(archive.infolist())}
            if len(members) > 1000:
                raise IntakeError("Source archive too many entries")
            for name in requested:
                if name not in members:
                    raise IntakeError(f"Missing original archive file: {name}")
                info = members[name]
                if info.file_size > MAX_EXTRACTED:
                    raise IntakeError("Overlarge model/dependency")
                contents[name] = archive.read(info)
    else:
        if len(requested) != 1:
            raise IntakeError("Direct asset URL can contain only one allowlisted file")
        contents[next(iter(requested))] = payload

    if sum(map(len, contents.values())) > MAX_EXTRACTED:
        raise IntakeError("Candidate extraction cap exceeded")
    selected = source["selectedSourceFile"]
    if digest(contents[selected]) != source["selectedSourceSha256"]:
        raise IntakeError("Selected model original SHA256 mismatch")
    return [
        {"archiveMember":name, "destination":requested[name], "bytes":len(data), "sha256":digest(data), "data":data}
        for name, data in sorted(contents.items())
    ]


def prepare_one(source: dict, tmp_root: Path, relative_root: Path, downloader=download_bytes) -> dict:
    check_source(source)
    dest = relative_root / safe_token(source["landmarkId"]) / safe_token(source["id"])
    target = tmp_root / dest
    if target.exists():
        raise IntakeError("Candidate already imported within staging")
    payload = downloader(source["archiveUrl"])
    if digest(payload) != source["archiveSha256"]:
        raise IntakeError(f"Original archive hash changed: {source['id']}")
    contents = extract_whitelist(source, payload)
    target.mkdir(parents=True)
    manifest = {
        "schema": "kfb.asset-intake-candidate/1",
        "selectionStatus": "candidate-only",
        "productionStatus": "NOT_SELECTED_NOT_INTEGRATED",
        "originalSource": source["sourcePage"],
        "downloadSource": source["archiveUrl"],
        "downloadSHA256": digest(payload),
        "licenseSPDX": source["license"],
        "licenseEvidence": source["licenceEvidence"],
        "creator": source["author"],
        "attribution": source.get("attribution", ""),
        "sourceId": source["id"],
        "landmarkId": source["landmarkId"],
        "sourceRole": source["sourceRole"],
        "geometryStatus": "original-source-only",
        "lookStatus": "Knete folgt (WSB after Georg selection)",
        "modelVerifiedSHA256": source["selectedSourceSha256"],
        "sourcePreview": source.get("sourcePreviewPath"),
        "files": [{k: x[k] for k in ("archiveMember", "destination", "bytes", "sha256")} for x in contents],
    }
    for item in contents:
        outfile = target / item["destination"]
        outfile.parent.mkdir(parents=True, exist_ok=True)
        outfile.write_bytes(item["data"])
    (target / "SOURCE.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    credit = (
        f"# Original asset and license\n\n"
        f"**{source['title']}** · {source['author']}\n\n"
        f"- Source: {source['sourcePage']}\n"
        f"- Licence: {source['license']} ({source['licenceEvidence']})\n"
        f"- Attribution: {source.get('attribution', source['author'])}\n"
        f"- Original binary source SHA256: {digest(payload)}\n"
        f"- Contents: see SOURCE.json for per-file hashes and unchanged originals.\n"
        f"- Research candidate only. Georg has not selected or accepted it; WSB Clay follows only after his selection.\n"
        f"- Do not infer download rights for another model from this licence.\n"
    )
    (target / "CREDITS.md").write_text(credit, encoding="utf-8")
    return {"sourceId":source["id"], "directory":dest.as_posix(), "files":len(contents), "bytes":sum(x["bytes"] for x in contents)}


def validate_existing(source: dict, repo: Path) -> dict:
    """Idempotent only for byte-identical, already verified source imports; never overwrite."""
    directory = BASE / source["landmarkId"] / source["id"]
    target = repo / directory
    manifest_file = target / "SOURCE.json"
    if not manifest_file.is_file() or not (target / "CREDITS.md").is_file():
        raise IntakeError(f"Existing source folder is incomplete: {source['id']}")
    meta = json.loads(manifest_file.read_text(encoding="utf-8"))
    expected = {
        "downloadSHA256": source["archiveSha256"],
        "licenseSPDX": source["license"],
        "modelVerifiedSHA256": source["selectedSourceSha256"],
        "sourceId": source["id"],
        "landmarkId": source["landmarkId"],
        "sourceRole": source["sourceRole"],
        "originalSource": source["sourcePage"],
        "selectionStatus": "candidate-only",
        "productionStatus": "NOT_SELECTED_NOT_INTEGRATED",
    }
    for key, value in expected.items():
        if meta.get(key) != value:
            raise IntakeError(f"Existing candidate provenance mismatch: {source['id']} field {key}")
    saved = {item["archiveMember"]: item for item in meta["files"]}
    requested = {item["archiveMember"]: item["destination"] for item in source["files"]}
    if set(saved) != set(requested):
        raise IntakeError("Existing candidate file roster differs")
    total = 0
    for name, desired in requested.items():
        row = saved[name]
        if row["destination"] != desired:
            raise IntakeError("Existing candidate destination changed")
        candidate_path = target / desired
        if not candidate_path.is_file():
            raise IntakeError("Existing candidate original file missing")
        content = candidate_path.read_bytes()
        if digest(content) != row["sha256"] or len(content) != row["bytes"]:
            raise IntakeError(f"Previously imported source was modified: {name}")
        total += len(content)
    return {
        "sourceId": source["id"],
        "directory": directory.as_posix(),
        "files": len(saved),
        "bytes": total,
        "state": "ALREADY_VERIFIED",
    }


def run(manifest_path: Path, repo: Path = Path("."), downloader=download_bytes) -> dict:
    repo = repo.resolve()
    m = json.loads(manifest_path.read_text(encoding="utf-8"))
    if m.get("schema") != SCHEMA or m.get("destinationRoot") != BASE.as_posix():
        raise IntakeError("Not a KFB Asset Suche intake request")
    candidates = m.get("candidates")
    if not isinstance(candidates, list) or not 1 <= len(candidates) <= 5:
        raise IntakeError("No bounded candidate roster")
    seen = set()
    already, new = [], []
    for source in candidates:
        check_source(source)
        if source["id"] in seen:
            raise IntakeError("Repeated source ID")
        seen.add(source["id"])
        dest = repo / BASE / source["landmarkId"] / source["id"]
        if dest.exists():
            already.append(validate_existing(source, repo))
        else:
            new.append(source)
    outputs = []
    with tempfile.TemporaryDirectory(prefix="kfb-asset-suche-") as d:
        tmp = Path(d)
        for source in new:
            outputs.append(prepare_one(source, tmp, BASE, downloader))
        # Every new download must pass exact SHA and rights gates before any writes.
        committed = []
        try:
            for record in outputs:
                src = tmp / record["directory"]
                dst = repo / record["directory"]
                if dst.exists():
                    raise IntakeError("Import target appeared concurrently")
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.move(str(src), str(dst))
                committed.append(dst)
                record["state"] = "NEWLY_STAGED_FOR_REVIEW"
        except Exception:
            for path in committed:
                shutil.rmtree(path, ignore_errors=True)
            raise
    return {
        "schema": "kfb.asset-suche-import-result/1",
        "status": "STAGED_FOR_REVIEW" if outputs else "ALL_PREVIOUSLY_VERIFIED",
        "candidates": already + outputs,
        "newlyImported": len(outputs),
        "alreadyVerified": len(already),
        "autoMerged": False,
        "georgSelected": False,
    }


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: kfb_asset_suche_auto_import.py <verified-intake-request.json>")
    try:
        print(json.dumps(run(Path(sys.argv[1])), indent=2, ensure_ascii=False))
    except (IntakeError, UnpackError, zipfile.BadZipFile, OSError, KeyError, ValueError) as e:
        print(f"BLOCKED: {e}", file=sys.stderr)
        raise SystemExit(1)
