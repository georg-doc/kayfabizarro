#!/usr/bin/env python3
"""Curated discovery for the existing KFB public-domain fetch pipeline.

This script discovers candidates only. It does not persist rights decisions and it does
not replace fetch_pool.py. Every emitted candidate is rechecked by fetch_pool.py before
anything is stored.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

UA = "KFB-PublicDomainPool/C1 (+https://github.com/georg-doc/kayfabizarro)"
AIC_BROWSER_UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36"
AIC_UA = "KFB-PublicDomainPool/C1 (+https://github.com/georg-doc/kayfabizarro)"
AIC_REFERER = "https://www.artic.edu/"
IA_LICENSE_TERMS = [
    "http://creativecommons.org/publicdomain/mark/1.0/",
    "https://creativecommons.org/publicdomain/mark/1.0/",
    "http://creativecommons.org/publicdomain/zero/1.0/",
    "https://creativecommons.org/publicdomain/zero/1.0/",
    "http://creativecommons.org/licenses/by/4.0/",
    "https://creativecommons.org/licenses/by/4.0/",
    "http://creativecommons.org/licenses/by/3.0/",
    "https://creativecommons.org/licenses/by/3.0/",
    "http://creativecommons.org/licenses/by/2.0/",
    "https://creativecommons.org/licenses/by/2.0/",
]


def get_json(url: str, *, aic: bool = False, timeout: int = 60) -> dict:
    headers = {"User-Agent": UA, "Accept": "application/json,*/*;q=0.8"}
    if aic:
        headers.update({
            "User-Agent": AIC_BROWSER_UA,
            "AIC-User-Agent": AIC_UA,
            "Referer": AIC_REFERER,
            "Accept-Language": "en-US,en;q=0.9",
        })
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def strip_html(value: str | None) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", str(value or ""))).strip()


def tier_from_commons(value: str) -> str | None:
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
    return None


def tier_from_url(value: str) -> str | None:
    low = (value or "").lower()
    if "publicdomain" in low or "/zero/" in low:
        return "free"
    if re.search(r"/licenses/by/\d", low):
        return "fallback-attribution"
    return None


def existing_keys(path: Path) -> set[tuple[str, str]]:
    keys: set[tuple[str, str]] = set()
    if not path.is_file():
        return keys
    for line in path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError:
            continue
        if row.get("provider") is not None and row.get("sourceId") is not None:
            keys.add((str(row["provider"]), str(row["sourceId"])))
    return keys


def safe_piece(value: str) -> str:
    out = re.sub(r"[^a-zA-Z0-9._-]+", "-", value).strip("-._").lower()
    return (out or "asset")[:72]


def search_met(query: str, limit: int):
    url = (
        "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q="
        + urllib.parse.quote(query)
    )
    ids = (get_json(url).get("objectIDs") or [])[: max(limit * 6, 24)]
    for object_id in ids:
        try:
            obj = get_json(
                f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{object_id}"
            )
        except Exception:
            continue
        if obj.get("isPublicDomain") and (obj.get("primaryImage") or obj.get("primaryImageSmall")):
            yield {
                "sourceId": obj.get("objectID") or object_id,
                "sourcePage": obj.get("objectURL") or f"https://www.metmuseum.org/art/collection/search/{object_id}",
                "candidateTitle": obj.get("title"),
                "candidateTier": "free",
            }
        time.sleep(0.03)


def search_aic(query: str, limit: int):
    params = {
        "q": query,
        "query[term][is_public_domain]": "true",
        "fields": "id,title,artist_title,date_display,image_id,is_public_domain",
        "limit": str(max(limit * 4, 24)),
    }
    url = "https://api.artic.edu/api/v1/artworks/search?" + urllib.parse.urlencode(params)
    payload = get_json(url, aic=True)
    for art in payload.get("data") or []:
        if art.get("is_public_domain") is True and art.get("image_id") and art.get("id"):
            aid = art["id"]
            yield {
                "sourceId": aid,
                "sourcePage": f"https://www.artic.edu/artworks/{aid}",
                "candidateTitle": art.get("title"),
                "candidateTier": "free",
            }


def search_commons(query: str, limit: int):
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrnamespace": "6",
        "gsrlimit": str(min(max(limit * 8, 32), 50)),
        "gsrsearch": query,
        "prop": "imageinfo",
        "iiprop": "url|extmetadata",
    }
    url = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params)
    payload = get_json(url)
    pages = (payload.get("query") or {}).get("pages") or {}
    for page in pages.values():
        info = (page.get("imageinfo") or [{}])[0]
        meta = info.get("extmetadata") or {}
        license_name = (
            (meta.get("LicenseShortName") or {}).get("value")
            or (meta.get("License") or {}).get("value")
            or ""
        )
        tier = tier_from_commons(license_name)
        title = page.get("title")
        if not tier or not title or not info.get("url"):
            continue
        yield {
            "sourceId": title,
            "pageId": page.get("pageid"),
            "sourcePage": info.get("descriptionurl") or (
                "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(title.replace(" ", "_"))
            ),
            "candidateTitle": strip_html((meta.get("ObjectName") or {}).get("value")) or title,
            "candidateTier": tier,
        }


def search_ia(query: str, limit: int):
    license_clause = " OR ".join(f'licenseurl:"{value}"' for value in IA_LICENSE_TERMS)
    q = (
        f"({query}) AND mediatype:(movies OR image OR audio OR texts) "
        f"AND ({license_clause}) AND NOT collection:youtube*"
    )
    params = [
        ("q", q),
        ("fl[]", "identifier"),
        ("fl[]", "title"),
        ("fl[]", "creator"),
        ("fl[]", "date"),
        ("fl[]", "licenseurl"),
        ("fl[]", "mediatype"),
        ("sort[]", "downloads desc"),
        ("rows", str(max(limit * 6, 36))),
        ("output", "json"),
    ]
    url = "https://archive.org/advancedsearch.php?" + urllib.parse.urlencode(params)
    payload = get_json(url)
    for row in ((payload.get("response") or {}).get("docs") or []):
        identifier = row.get("identifier")
        tier = tier_from_url(str(row.get("licenseurl") or ""))
        if not identifier or not tier:
            continue
        title = row.get("title")
        if isinstance(title, list):
            title = title[0] if title else None
        yield {
            "sourceId": identifier,
            "sourcePage": f"https://archive.org/details/{identifier}",
            "candidateTitle": title or identifier,
            "candidateTier": tier,
        }


SEARCHERS = {
    "met": search_met,
    "aic": search_aic,
    "commons": search_commons,
    "ia": search_ia,
}


def query_plan(seeds: dict, provider: str) -> list[tuple[str, str]]:
    """Interleave categories so one early query cannot monopolize a provider cap."""
    buckets: list[tuple[str, list[str]]] = []
    for category in seeds.get("categories") or []:
        if provider not in (category.get("sources") or []):
            continue
        queries = [str(q) for q in (category.get("queries") or []) if str(q).strip()]
        if queries:
            buckets.append((str(category.get("id") or "misc"), queries))

    rows: list[tuple[str, str]] = []
    depth = 0
    while True:
        added = False
        for category, queries in buckets:
            if depth < len(queries):
                rows.append((category, queries[depth]))
                added = True
        if not added:
            break
        depth += 1
    return rows


def make_manifest_item(provider: str, found: dict, category: str, query: str) -> dict:
    source_id = found["sourceId"]
    if provider == "commons":
        token = str(found.get("pageId") or safe_piece(str(source_id)))
    else:
        token = safe_piece(str(source_id))
    item = {
        "id": f"{provider}-c1-{token}",
        "provider": provider,
        "sourceId": source_id,
        "sourcePage": found["sourcePage"],
        "targetBase": f"{provider}/c1-{token}",
        "maxBytes": 8_000_000,
        "tags": ["curated-c1", category, query, f"precheck-{found['candidateTier']}"],
    }
    if provider == "met":
        item["preferPreview"] = True
    elif provider == "aic":
        item["previewWidth"] = 1200
    elif provider == "commons":
        item["preferPreview"] = True
        item["previewWidth"] = 1600
    elif provider == "ia":
        item["preferredFormats"] = ["Item Tile"]
        item["maxBytes"] = 2_000_000
    return item


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("seeds", type=Path)
    ap.add_argument("--existing", type=Path, default=Path("media/public_domain/manifest.jsonl"))
    ap.add_argument("--report", type=Path)
    args = ap.parse_args()

    seeds = json.loads(args.seeds.read_text(encoding="utf-8"))
    per_provider_cap = int(seeds.get("perProviderCap", 6))
    total_cap = int(seeds.get("totalCap", per_provider_cap * 4))
    existing = existing_keys(args.existing)
    seen = set(existing)
    output: list[dict] = []
    counts = {provider: 0 for provider in SEARCHERS}
    errors: list[dict] = []

    for provider, searcher in SEARCHERS.items():
        for category, query in query_plan(seeds, provider):
            if counts[provider] >= per_provider_cap or len(output) >= total_cap:
                break
            needed = per_provider_cap - counts[provider]
            try:
                # At most one accepted discovery per search phrase. This preserves thematic
                # diversity and prevents the first broad query from filling the whole cap.
                candidates = searcher(query, max(3, needed))
                for found in candidates:
                    key = (provider, str(found["sourceId"]))
                    if key in seen:
                        continue
                    seen.add(key)
                    output.append(make_manifest_item(provider, found, category, query))
                    counts[provider] += 1
                    break
            except Exception as exc:
                errors.append({"provider": provider, "query": query, "error": f"{type(exc).__name__}: {exc}"})
                print(f"DISCOVERY ERROR {provider} {query!r}: {type(exc).__name__}: {exc}", file=sys.stderr)

    for item in output:
        print(json.dumps(item, ensure_ascii=False, sort_keys=True))

    report = {
        "schema": "kfb.pd-pool-c1-discovery/0.1",
        "counts": counts,
        "total": len(output),
        "existingSkippedBase": len(existing),
        "errors": errors,
    }
    if args.report:
        args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    print(
        "harvest-c1: " + " · ".join(f"{p} {counts[p]}" for p in SEARCHERS) + f" · total {len(output)} · errors {len(errors)}",
        file=sys.stderr,
    )
    return 0 if len(output) >= 12 and all(counts[p] >= 2 for p in SEARCHERS) else 2


if __name__ == "__main__":
    raise SystemExit(main())
