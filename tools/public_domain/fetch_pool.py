#!/usr/bin/env python3
"""
KFB public-domain pool fetcher.

Derived from the Claude Design intake package uploaded 2026-09-26.
This version keeps the four-provider rights recheck but adds:
- atomic downloads;
- SHA-256 evidence;
- deterministic/idempotent second runs;
- stale .part cleanup;
- byte caps suitable for GitHub;
- Commons title lookup as well as numeric page IDs;
- machine-readable run reports.

It does not discover or decide what should be selected. It only validates and
downloads explicit manifest entries.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path("media/public_domain")
UA = "KFB-PublicDomainPool/PD01 (+https://github.com/georg-doc/kayfabizarro)"
IA_PREFER = [
    "Text PDF", "text pdf", "Item Tile", "JPEG", "jpeg", "PNG", "png",
    "H.264", "h.264", "MPEG4", "mpeg4", "512Kb MPEG4", "512kb mpeg4",
    "Ogg Video", "ogg video", "VBR MP3", "vbr mp3", "Ogg Vorbis", "ogg vorbis",
]
SAFE_EXTS = {
    ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".pdf",
    ".mp4", ".webm", ".mp3", ".ogg", ".wav", ".tif", ".tiff",
}


def now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()


def http_get(url: str, *, timeout: int = 45) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json,*/*;q=0.8"})
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return response.read()


def get_json(url: str) -> dict:
    return json.loads(http_get(url).decode("utf-8"))


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def atomic_write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_name(path.name + ".part")
    tmp.write_text(text, encoding="utf-8")
    os.replace(tmp, path)


def safe_target(base: str, ext: str) -> Path:
    rel = Path(base + ext)
    if rel.is_absolute() or ".." in rel.parts:
        raise RuntimeError(f"unsafe target path: {base!r}")
    return ROOT / rel


def url_ext(url: str, fallback: str = ".bin") -> str:
    ext = Path(urllib.parse.urlparse(url).path).suffix.lower()
    return ext if ext in SAFE_EXTS else fallback


def download_atomic(url: str, target: Path, max_bytes: int) -> int:
    target.parent.mkdir(parents=True, exist_ok=True)
    part = target.with_name(target.name + ".part")
    part.unlink(missing_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    total = 0
    try:
        with urllib.request.urlopen(req, timeout=90) as response, part.open("wb") as out:
            content_length = response.headers.get("Content-Length")
            if content_length and int(content_length) > max_bytes:
                raise RuntimeError(f"remote file exceeds maxBytes ({content_length} > {max_bytes})")
            while True:
                chunk = response.read(1024 * 1024)
                if not chunk:
                    break
                total += len(chunk)
                if total > max_bytes:
                    raise RuntimeError(f"download exceeds maxBytes ({total} > {max_bytes})")
                out.write(chunk)
        if total <= 0:
            raise RuntimeError("empty download")
        os.replace(part, target)
        return total
    except Exception:
        part.unlink(missing_ok=True)
        raise


def tier_from_commons(value: str) -> str:
    normalized = re.sub(r"\s+", " ", (value or "").strip().lower())
    compact = normalized.replace(" ", "")
    if (
        normalized.startswith("public domain")
        or normalized.startswith("pd")
        or compact.startswith("cc0")
        or "publicdomainmark" in compact
        or "cc-pd-mark" in compact
    ):
        return "free"
    if re.match(r"^cc[- ]?by[- ]?\d", normalized):
        return "fallback-attribution"
    return "reject"


def tier_from_url(value: str) -> str:
    low = (value or "").lower()
    if "publicdomain" in low or "/zero/" in low:
        return "free"
    if re.search(r"/licenses/by/\d", low):
        return "fallback-attribution"
    return "reject"


def commons_selector(source_id) -> str:
    value = str(source_id).strip()
    if value.isdigit():
        return "pageids=" + urllib.parse.quote(value)
    if not value.lower().startswith("file:"):
        value = "File:" + value
    return "titles=" + urllib.parse.quote(value)


def recheck(item: dict) -> tuple[str, str, str, dict]:
    provider = item["provider"]
    sid = item["sourceId"]

    if provider == "met":
        record_url = f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{sid}"
        d = get_json(record_url)
        if not d.get("isPublicDomain") or not d.get("primaryImage"):
            return "reject", "", "", {"reason": "Met API isPublicDomain/primaryImage gate failed", "recordUrl": record_url}
        return (
            "free",
            d["primaryImage"],
            "Public Domain · The Met Open Access (API isPublicDomain=true)",
            {
                "recordUrl": record_url,
                "title": d.get("title"),
                "creator": d.get("artistDisplayName") or d.get("artistDisplayBio"),
                "date": d.get("objectDate"),
                "objectId": d.get("objectID"),
            },
        )

    if provider == "aic":
        fields = "id,title,artist_display,date_display,is_public_domain,image_id"
        record_url = f"https://api.artic.edu/api/v1/artworks/{sid}?fields={fields}"
        d = get_json(record_url).get("data") or {}
        if d.get("is_public_domain") is not True or not d.get("image_id"):
            return "reject", "", "", {"reason": "AIC API is_public_domain/image_id gate failed", "recordUrl": record_url}
        image = f"https://www.artic.edu/iiif/2/{d['image_id']}/full/843,/0/default.jpg"
        return (
            "free",
            image,
            "Public Domain · Art Institute of Chicago (API is_public_domain=true)",
            {
                "recordUrl": record_url,
                "title": d.get("title"),
                "creator": d.get("artist_display"),
                "date": d.get("date_display"),
                "objectId": d.get("id"),
            },
        )

    if provider == "commons":
        selector = commons_selector(sid)
        record_url = (
            "https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo"
            "&iiprop=url|extmetadata&" + selector
        )
        q = get_json(record_url)
        pages = q.get("query", {}).get("pages", {})
        page = next(iter(pages.values()), {})
        ii = (page.get("imageinfo") or [{}])[0]
        em = ii.get("extmetadata") or {}
        license_name = (
            (em.get("LicenseShortName") or {}).get("value")
            or (em.get("License") or {}).get("value")
            or ""
        )
        tier = tier_from_commons(license_name)
        if tier == "reject" or not ii.get("url"):
            return "reject", "", "", {
                "reason": f"Commons license/url gate failed: {license_name!r}",
                "recordUrl": record_url,
            }
        creator = (em.get("Artist") or {}).get("value") or ""
        date = (
            (em.get("DateTimeOriginal") or {}).get("value")
            or (em.get("DateTime") or {}).get("value")
            or ""
        )
        return (
            tier,
            ii["url"],
            license_name,
            {
                "recordUrl": record_url,
                "title": page.get("title"),
                "creator": re.sub(r"<[^>]+>", "", creator).strip(),
                "date": re.sub(r"<[^>]+>", "", date).strip(),
                "pageId": page.get("pageid"),
            },
        )

    if provider == "ia":
        record_url = f"https://archive.org/metadata/{urllib.parse.quote(str(sid))}"
        d = get_json(record_url)
        meta = d.get("metadata") or {}
        license_url = str(meta.get("licenseurl") or "")
        tier = tier_from_url(license_url)
        if tier == "reject":
            return "reject", "", "", {
                "reason": f"Internet Archive licenseurl gate failed: {license_url!r}",
                "recordUrl": record_url,
            }
        preferred = item.get("preferredFormats") or IA_PREFER
        max_bytes = int(item.get("maxBytes", 25_000_000))
        candidates = []
        for f in d.get("files") or []:
            fmt = str(f.get("format") or "")
            name = str(f.get("name") or "")
            if fmt not in preferred or not name:
                continue
            try:
                size = int(f.get("size") or 0)
            except (TypeError, ValueError):
                size = 0
            if size and size > max_bytes:
                continue
            candidates.append((preferred.index(fmt), size, name, fmt))
        if not candidates:
            return "reject", "", "", {
                "reason": f"Internet Archive has no preferred file <= maxBytes ({max_bytes})",
                "recordUrl": record_url,
                "licenseUrl": license_url,
            }
        candidates.sort(key=lambda row: (row[0], -row[1], row[2].lower()))
        _, size, name, fmt = candidates[0]
        file_url = "https://archive.org/download/{}/{}".format(
            urllib.parse.quote(str(sid)),
            urllib.parse.quote(name),
        )
        return (
            tier,
            file_url,
            license_url,
            {
                "recordUrl": record_url,
                "title": meta.get("title"),
                "creator": meta.get("creator"),
                "date": meta.get("date") or meta.get("year"),
                "identifier": meta.get("identifier") or sid,
                "selectedFormat": fmt,
                "reportedBytes": size or None,
            },
        )

    return "reject", "", "", {"reason": f"unknown provider {provider!r}"}


def load_existing_license(path: Path) -> dict | None:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        return None


def rebuild_index() -> None:
    rows = []
    for p in sorted(ROOT.rglob("*.license.json")):
        try:
            d = json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            continue
        local_path = d.get("localPath")
        if local_path and (ROOT / local_path).is_file():
            rows.append(d)

    atomic_write_text(
        ROOT / "manifest.jsonl",
        "".join(json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n" for row in rows),
    )

    credits = [
        "# CREDITS · fallback-attribution assets only",
        "",
        "Generated from stored license evidence. Public-domain/CC0 assets are intentionally omitted.",
        "",
    ]
    for row in rows:
        if row.get("tier") != "fallback-attribution":
            continue
        title = row.get("title") or row.get("id") or "Untitled"
        creator = row.get("creator") or "Unknown creator"
        source_page = row.get("sourcePage") or row.get("sourceRecordUrl") or ""
        rights = row.get("rights") or "CC BY"
        credits.append(f"- {title} — {creator} — {rights} — {source_page}")
    atomic_write_text(ROOT / "CREDITS.md", "\n".join(credits).rstrip() + "\n")


def safe_target(base: str, ext: str) -> Path:
    rel = Path(base + ext)
    if rel.is_absolute() or ".." in rel.parts:
        raise RuntimeError(f"unsafe target path: {base!r}")
    return ROOT / rel


def process_item(item: dict) -> dict:
    item_id = item["id"]
    provider = item["provider"]
    tier, file_url, rights, source = recheck(item)
    if tier == "reject":
        return {"id": item_id, "provider": provider, "status": "rejected", **source}

    ext = url_ext(file_url)
    target = safe_target(item["targetBase"], ext)
    lic_path = target.with_name(target.name + ".license.json")
    part_path = target.with_name(target.name + ".part")
    part_path.unlink(missing_ok=True)
    max_bytes = int(item.get("maxBytes", 25_000_000))

    previous = load_existing_license(lic_path)
    if target.is_file() and previous:
        current_hash = sha256_file(target)
        if (
            previous.get("sha256") == current_hash
            and previous.get("sourceFileUrl") == file_url
            and previous.get("tier") == tier
        ):
            return {
                "id": item_id,
                "provider": provider,
                "status": "unchanged",
                "localPath": str(target.relative_to(ROOT)),
                "sha256": current_hash,
                "bytes": target.stat().st_size,
                "tier": tier,
            }

    size = download_atomic(file_url, target, max_bytes)
    digest = sha256_file(target)
    record = {
        "schema": "kfb.public-domain-asset/0.2",
        "id": item_id,
        "provider": provider,
        "sourceId": item["sourceId"],
        "sourcePage": item.get("sourcePage"),
        "sourceRecordUrl": source.get("recordUrl"),
        "sourceFileUrl": file_url,
        "title": source.get("title") or item.get("title"),
        "creator": source.get("creator") or item.get("creator"),
        "date": source.get("date") or item.get("date"),
        "rights": rights,
        "tier": tier,
        "retrievedAt": now_iso(),
        "sha256": digest,
        "bytes": size,
        "localPath": str(target.relative_to(ROOT)),
        "tags": item.get("tags") or [],
        "sourceFacts": {k: v for k, v in source.items() if k not in {"recordUrl", "title", "creator", "date"}},
    }
    atomic_write_text(lic_path, json.dumps(record, ensure_ascii=False, indent=2, sort_keys=True) + "\n")
    return {
        "id": item_id,
        "provider": provider,
        "status": "loaded",
        "localPath": record["localPath"],
        "sha256": digest,
        "bytes": size,
        "tier": tier,
    }


def parse_manifest(path: Path) -> list[dict]:
    items = []
    for lineno, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError as exc:
            raise SystemExit(f"{path}:{lineno}: invalid JSON: {exc}") from exc
        for key in ("id", "provider", "sourceId", "targetBase", "sourcePage"):
            if key not in item:
                raise SystemExit(f"{path}:{lineno}: missing required key {key!r}")
        items.append(item)
    return items


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("manifest", type=Path)
    ap.add_argument("--report", type=Path)
    ap.add_argument("--expect", type=int)
    args = ap.parse_args()

    ROOT.mkdir(parents=True, exist_ok=True)
    results = []
    for item in parse_manifest(args.manifest):
        try:
            result = process_item(item)
        except Exception as exc:
            result = {
                "id": item.get("id"),
                "provider": item.get("provider"),
                "status": "rejected",
                "reason": f"{type(exc).__name__}: {exc}",
            }
        results.append(result)
        print(f"{result.get('status','?'):>9} {result.get('provider','?'):>8} {result.get('id','?')} {result.get('reason','')}")

    rebuild_index()
    counts = {
        "loaded": sum(r["status"] == "loaded" for r in results),
        "unchanged": sum(r["status"] == "unchanged" for r in results),
        "rejected": sum(r["status"] == "rejected" for r in results),
    }
    report = {
        "schema": "kfb.pd-pool-run-report/0.1",
        "generatedAt": now_iso(),
        "manifest": str(args.manifest),
        "counts": counts,
        "results": results,
    }
    if args.report:
        atomic_write_text(args.report, json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n")

    ok = counts["rejected"] == 0
    if args.expect is not None:
        ok = ok and (counts["loaded"] + counts["unchanged"] == args.expect)
    return 0 if ok else 2


if __name__ == "__main__":
    raise SystemExit(main())
