#!/usr/bin/env python3
"""Read-only adapter for 3d.shep.bot external discovery candidates.

The adapter deliberately keeps provider claims separate from KFB Registry facts.
It can search and inspect remote candidates and prepare an intake packet, but it
never downloads or registers asset bytes.
"""
from __future__ import annotations

import json
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from typing import Any, Callable

API_BASE = "https://3d.shep.bot"
SEARCH_SCHEMA = "kfb.external-asset-search.v1"
INTAKE_SCHEMA = "kfb.external-asset-intake/1"
CANDIDATE_STATUS = "EXTERNAL_DISCOVERY_CANDIDATE"


class ExternalAssetError(ValueError):
    """Raised for invalid requests or unavailable external discovery data."""


def _utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


class ExternalAssetClient:
    """Small stdlib-only client with bounded in-memory caching."""

    def __init__(
        self,
        *,
        base_url: str = API_BASE,
        timeout: float = 20.0,
        cache_ttl: float = 300.0,
        fetcher: Callable[[str], dict[str, Any]] | None = None,
        clock: Callable[[], float] = time.monotonic,
        utc_now: Callable[[], str] = _utc_now,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.cache_ttl = cache_ttl
        self.fetcher = fetcher or self._http_fetch
        self.clock = clock
        self.utc_now = utc_now
        self._cache: dict[str, tuple[float, dict[str, Any]]] = {}

    def _http_fetch(self, url: str) -> dict[str, Any]:
        request = urllib.request.Request(
            url,
            headers={"Accept": "application/json", "User-Agent": "kfb-asset-librarian/external-search-r1"},
        )
        try:
            with urllib.request.urlopen(request, timeout=self.timeout) as response:
                payload = json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="replace")
            raise ExternalAssetError(f"external asset service HTTP {exc.code}: {detail[:240]}") from exc
        except (urllib.error.URLError, TimeoutError) as exc:
            reason = getattr(exc, "reason", exc)
            raise ExternalAssetError(f"external asset service unavailable: {reason}") from exc
        except json.JSONDecodeError as exc:
            raise ExternalAssetError("external asset service returned invalid JSON") from exc
        if not isinstance(payload, dict):
            raise ExternalAssetError("external asset service returned an unexpected payload")
        return payload

    def _get(self, path: str, params: dict[str, Any] | None = None) -> dict[str, Any]:
        query = urllib.parse.urlencode(
            [(key, value) for key, value in (params or {}).items() if value is not None],
            doseq=True,
        )
        url = f"{self.base_url}{path}" + (f"?{query}" if query else "")
        now = self.clock()
        cached = self._cache.get(url)
        if cached and now - cached[0] < self.cache_ttl:
            return cached[1]
        payload = self.fetcher(url)
        self._cache[url] = (now, payload)
        return payload

    @staticmethod
    def _candidate(asset: dict[str, Any], *, include_files: bool = False) -> dict[str, Any]:
        license_claim = asset.get("license") if isinstance(asset.get("license"), dict) else None
        price_claim = asset.get("price") if isinstance(asset.get("price"), dict) else None
        candidate = {
            "status": CANDIDATE_STATUS,
            "externalId": asset.get("id"),
            "provider": asset.get("provider"),
            "nativeId": asset.get("nativeId"),
            "title": asset.get("title"),
            "author": asset.get("author"),
            "description": asset.get("description"),
            "type": asset.get("type"),
            "tags": list(asset.get("tags") or []),
            "categories": list(asset.get("categories") or []),
            "sourcePage": asset.get("url"),
            "thumbnailUrl": asset.get("thumbnailUrl"),
            "providerLicenseClaim": license_claim,
            "priceClaim": price_claim,
            "formats": list(asset.get("formats") or []),
            "resolutions": list(asset.get("resolutions") or []),
            "polyCount": asset.get("polyCount"),
            "rigged": asset.get("rigged"),
            "animated": asset.get("animated"),
            "downloadable": bool(asset.get("downloadable")),
            "score": asset.get("score"),
            "claimBoundary": "Provider metadata only; KFB compatibility, scale, quality and suitability are unverified.",
        }
        if include_files:
            candidate["files"] = [
                {
                    "url": row.get("url"),
                    "filename": row.get("filename"),
                    "format": row.get("format"),
                    "group": row.get("group"),
                    "sizeBytes": row.get("sizeBytes"),
                }
                for row in (asset.get("files") or [])
                if isinstance(row, dict)
            ]
            candidate["shareUrl"] = asset.get("shareUrl")
        return candidate

    def search(
        self,
        query: str,
        *,
        asset_type: str = "model",
        providers: list[str] | None = None,
        free: bool | None = None,
        downloadable: bool | None = None,
        limit: int = 24,
        offset: int = 0,
    ) -> dict[str, Any]:
        query = query.strip()
        if not query:
            raise ExternalAssetError("query must not be empty")
        if limit < 1 or limit > 100:
            raise ExternalAssetError("limit must be between 1 and 100")
        if offset < 0:
            raise ExternalAssetError("offset must be >= 0")
        payload = self._get("/v1/search", {
            "q": query,
            "type": asset_type,
            "providers": ",".join(providers or []) or None,
            "free": str(free).lower() if free is not None else None,
            "downloadable": str(downloadable).lower() if downloadable is not None else None,
            "limit": limit,
            "offset": offset,
        })
        results = payload.get("results")
        if not isinstance(results, list):
            raise ExternalAssetError("external asset search response has no results array")
        return {
            "schema": SEARCH_SCHEMA,
            "status": CANDIDATE_STATUS,
            "query": payload.get("query", query),
            "filters": {
                "type": asset_type,
                "providers": list(providers or []),
                "free": free,
                "downloadable": downloadable,
                "limit": limit,
                "offset": offset,
            },
            "count": len(results),
            "assets": [self._candidate(row) for row in results if isinstance(row, dict)],
            "providerReports": list(payload.get("providers") or []),
            "factBoundary": "External results are discovery candidates, not KFB Registry assets.",
        }

    def providers(self) -> dict[str, Any]:
        payload = self._get("/v1/providers")
        rows = payload.get("providers") if isinstance(payload.get("providers"), list) else payload
        if not isinstance(rows, list):
            raise ExternalAssetError("external provider response has no provider list")
        return {
            "schema": "kfb.external-asset-providers.v1",
            "status": CANDIDATE_STATUS,
            "count": len(rows),
            "providers": rows,
        }

    def asset(self, external_id: str) -> dict[str, Any]:
        external_id = external_id.strip()
        if not external_id or ":" not in external_id:
            raise ExternalAssetError("external_id must be a provider-qualified id")
        encoded = urllib.parse.quote(external_id, safe="")
        payload = self._get(f"/v1/assets/{encoded}")
        if payload.get("id") != external_id:
            raise ExternalAssetError("external asset detail did not match the requested id")
        return {
            "schema": "kfb.external-asset-detail.v1",
            "status": CANDIDATE_STATUS,
            "asset": self._candidate(payload, include_files=True),
            "factBoundary": "Provider metadata only; the bytes have not been downloaded, hashed, isolated or registered.",
        }

    def prepare_intake(
        self,
        external_id: str,
        *,
        file_url: str | None = None,
        measured_height: float | None = None,
        scale_hint: str | None = None,
        notes: str | None = None,
    ) -> dict[str, Any]:
        detail = self.asset(external_id)["asset"]
        files = detail.get("files") or []
        selected = None
        if file_url:
            selected = next((row for row in files if row.get("url") == file_url), None)
            if selected is None:
                raise ExternalAssetError("file_url is not one of the provider-reported asset files")
        elif len(files) == 1:
            selected = files[0]
        if measured_height is not None and measured_height <= 0:
            raise ExternalAssetError("measured_height must be greater than 0")
        return {
            "schema": INTAKE_SCHEMA,
            "status": CANDIDATE_STATUS,
            "preparedAt": self.utc_now(),
            "source": {
                "externalId": detail.get("externalId"),
                "provider": detail.get("provider"),
                "nativeId": detail.get("nativeId"),
                "title": detail.get("title"),
                "author": detail.get("author"),
                "pageUrl": detail.get("sourcePage"),
            },
            "providerClaims": {
                "license": detail.get("providerLicenseClaim"),
                "price": detail.get("priceClaim"),
                "downloadable": detail.get("downloadable"),
                "formats": detail.get("formats"),
                "resolutions": detail.get("resolutions"),
                "polyCount": detail.get("polyCount"),
                "rigged": detail.get("rigged"),
                "animated": detail.get("animated"),
            },
            "requestedFile": selected,
            "k2Measurement": {
                "measuredHeight": measured_height,
                "scaleHint": scale_hint,
            },
            "notes": notes,
            "nextGate": "trusted-download-hash-source-isolation-3d-proof-registry-build",
            "boundaries": {
                "bytesDownloaded": False,
                "registered": False,
                "compatibilityVerified": False,
                "licenseStatus": "provider-claim-only",
            },
        }
