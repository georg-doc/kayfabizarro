#!/usr/bin/env python3
"""KFB Production Desk · registry builder (PD1).

Reads the explicit lane list in tools/production_desk/config.json, resolves the
current same-repo GitHub state for each lane (PR head/state, briefing file
existence + blob) and writes a deterministic registry to
registry/production/v1/.

Pattern donor: tools/asset_registry (Asset Librarian) and tools/resource_registry.
No fuzzy repository crawling: only the lanes named in config.json are resolved.

Cross-repo lanes (external: true) are NEVER fetched with the workflow token and
are always emitted as freshness LAST_KNOWN.

Usage:
  build.py --online  [--out DIR]          # GitHub Actions (GITHUB_TOKEN, GITHUB_REPOSITORY)
  build.py --fixture FILE [--out DIR]     # offline/test/coworker snapshot
  build.py --validate DIR
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
CONFIG = HERE / "config.json"
DEFAULT_OUT = ROOT / "registry" / "production" / "v1"

SCHEMA = "kfb.production-registry/1"
BUCKETS = ("LOOK_AT", "RUNNING", "CAN_START", "WAITING")
FRESHNESS = ("CURRENT", "MOVED", "LAST_KNOWN", "UNVERIFIED", "CLOSED")
OUTPUT_FILES = ("manifest.json", "lanes.json", "briefings.json", "reviews.json",
                "standards.json", "wsa.json", "tools.json", "problems.json")


# --------------------------------------------------------------------------- fetchers
class FetchError(Exception):
    pass


class OnlineFetcher:
    """Same-repo GitHub REST reads with the workflow token. Never used for external lanes."""

    def __init__(self, token: str | None, api: str = "https://api.github.com"):
        self.token = token
        self.api = api.rstrip("/")

    def _get(self, url: str):
        req = urllib.request.Request(url, headers={
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "kfb-production-desk",
            **({"Authorization": f"Bearer {self.token}"} if self.token else {}),
        })
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            if exc.code == 404:
                return None
            raise FetchError(f"HTTP {exc.code} for {url}") from exc
        except urllib.error.URLError as exc:
            raise FetchError(f"{exc.reason} for {url}") from exc

    def pr(self, repo: str, number: int):
        data = self._get(f"{self.api}/repos/{repo}/pulls/{number}")
        if data is None:
            return None
        return {
            "number": data["number"],
            "title": data.get("title", ""),
            "state": data.get("state"),
            "draft": bool(data.get("draft")),
            "merged": bool(data.get("merged")),
            "headRef": data["head"]["ref"],
            "headSha": data["head"]["sha"],
            "updatedAt": data.get("updated_at"),
            "url": data.get("html_url"),
        }

    def branch_head(self, repo: str, branch: str):
        data = self._get(f"{self.api}/repos/{repo}/branches/{urllib.parse.quote(branch, safe='')}")
        if data is None:
            return None
        return {"sha": data["commit"]["sha"],
                "date": data["commit"]["commit"]["committer"]["date"]}

    def content(self, repo: str, path: str, ref: str):
        url = (f"{self.api}/repos/{repo}/contents/{urllib.parse.quote(path)}"
               f"?ref={urllib.parse.quote(ref, safe='')}")
        data = self._get(url)
        if data is None or isinstance(data, list):
            return None
        return {"sha": data["sha"], "size": data.get("size", 0)}

    def status_file(self, repo: str, path: str, ref: str):
        url = (f"{self.api}/repos/{repo}/contents/{urllib.parse.quote(path)}"
               f"?ref={urllib.parse.quote(ref, safe='')}")
        req = urllib.request.Request(url, headers={
            "Accept": "application/vnd.github.raw+json",
            "User-Agent": "kfb-production-desk",
            **({"Authorization": f"Bearer {self.token}"} if self.token else {}),
        })
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            if exc.code == 404:
                return None
            raise FetchError(f"HTTP {exc.code} for status file {path}") from exc


class FixtureFetcher:
    """Offline fetcher: answers from a JSON fixture. Unknown keys raise so tests catch
    accidental external reads."""

    def __init__(self, data: dict):
        self.data = data
        self.calls: list[str] = []

    def _lookup(self, key: str):
        self.calls.append(key)
        if key not in self.data:
            raise FetchError(f"fixture has no entry for {key}")
        return self.data[key]

    def pr(self, repo, number):
        return self._lookup(f"pr:{repo}#{number}")

    def branch_head(self, repo, branch):
        return self._lookup(f"branch:{repo}@{branch}")

    def content(self, repo, path, ref):
        return self._lookup(f"content:{repo}@{ref}:{path}")

    def status_file(self, repo, path, ref):
        return self._lookup(f"status:{repo}@{ref}:{path}")


# --------------------------------------------------------------------------- helpers
def gh_blob_url(repo: str, ref: str, path: str) -> str:
    return f"https://github.com/{repo}/blob/{ref}/{urllib.parse.quote(path)}"


def gh_raw_url(repo: str, ref: str, path: str) -> str:
    return f"https://raw.githubusercontent.com/{repo}/{ref}/{urllib.parse.quote(path)}"


def canonical_json(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


# --------------------------------------------------------------------------- resolve
def resolve_lane(lane: dict, cfg: dict, fetch, problems: list) -> dict:
    repo = lane.get("repo") or cfg["repo"]
    out = {
        "id": lane["id"],
        "bucket": lane["bucket"],
        "title": lane["title"],
        "what": lane.get("what", ""),
        "provider": lane.get("provider", ""),
        "yourAction": lane.get("yourAction", ""),
        "waitingFor": lane.get("waitingFor", ""),
        "questions": list(lane.get("questions", [])),
        "repo": repo,
        "pr": lane.get("pr"),
        "branch": lane.get("branch"),
        "external": bool(lane.get("external")),
        "freshness": "UNVERIFIED",
        "freshnessNote": "",
        "head": None,
        "headDate": None,
        "expectedHead": lane.get("expectedHead"),
        "prUrl": None,
        "prState": None,
        "brief": None,
    }

    # ---- external repos: never fetched by the same-repo builder
    if out["external"]:
        lk = lane.get("lastKnown") or {}
        out["freshness"] = "LAST_KNOWN"
        out["head"] = lk.get("head")
        out["headDate"] = lk.get("recordedAt")
        out["freshnessNote"] = ("Separates Repo. Der Stand wird hier nicht automatisch geprüft "
                                "(zuletzt bekannt, bitte bei Bedarf nachprüfen).")
        if out["pr"]:
            out["prUrl"] = f"https://github.com/{repo}/pull/{out['pr']}"
        return out

    # ---- optional status file written by the owning chat (auto-sync hook)
    status_path = lane.get("statusFile")
    if status_path and lane.get("branch"):
        try:
            st = fetch.status_file(repo, status_path, lane["branch"])
        except FetchError as exc:
            st = None
            problems.append({"lane": lane["id"], "kind": "status-file-unreadable", "detail": str(exc)})
        if isinstance(st, dict):
            for key in ("bucket", "what", "yourAction", "waitingFor", "questions"):
                if key in st:
                    out[key] = st[key]
            if st.get("recordedHead"):
                out["expectedHead"] = st["recordedHead"]
            out["statusFile"] = status_path

    # ---- live PR / branch facts
    try:
        pr = fetch.pr(repo, lane["pr"]) if lane.get("pr") else None
        if lane.get("pr") and pr is None:
            problems.append({"lane": lane["id"], "kind": "pr-missing",
                             "detail": f"PR #{lane['pr']} nicht gefunden"})
        if pr:
            out["prUrl"] = pr.get("url") or f"https://github.com/{repo}/pull/{pr['number']}"
            out["prState"] = "merged" if pr.get("merged") else pr.get("state")
            out["head"] = pr.get("headSha")
            out["headDate"] = pr.get("updatedAt")
            if not out["branch"]:
                out["branch"] = pr.get("headRef")
        elif lane.get("branch"):
            bh = fetch.branch_head(repo, lane["branch"])
            if bh:
                out["head"], out["headDate"] = bh["sha"], bh.get("date")
            else:
                problems.append({"lane": lane["id"], "kind": "branch-missing",
                                 "detail": f"Branch {lane['branch']} nicht gefunden"})
    except FetchError as exc:
        problems.append({"lane": lane["id"], "kind": "fetch-failed", "detail": str(exc)})

    if out["prState"] in ("closed", "merged"):
        out["freshness"] = "CLOSED"
        out["freshnessNote"] = ("Abgeschlossen (übernommen)." if out["prState"] == "merged"
                                else "Geschlossen.")
    elif out["head"]:
        if out["expectedHead"] and out["head"] != out["expectedHead"]:
            out["freshness"] = "MOVED"
            out["freshnessNote"] = ("Seit dem letzten Statuseintrag gibt es neue Arbeit. "
                                    "Die Beschreibung kann veraltet sein.")
        else:
            out["freshness"] = "CURRENT"

    # ---- briefing
    b = lane.get("brief")
    if b:
        ref = b.get("ref") or lane.get("branch") or "main"
        info = None
        try:
            info = fetch.content(repo, b["path"], ref)
        except FetchError as exc:
            problems.append({"lane": lane["id"], "kind": "brief-unreadable", "detail": str(exc)})
        brief = {
            "label": b.get("label", "Briefing"),
            "path": b["path"],
            "ref": ref,
            "exists": bool(info),
            "blob": info["sha"] if info else None,
            "pasteReady": bool(b.get("pasteReady")),
            "url": gh_blob_url(repo, ref, b["path"]),
            "rawUrl": gh_raw_url(repo, ref, b["path"]),
        }
        if not info:
            problems.append({"lane": lane["id"], "kind": "brief-missing",
                             "detail": f"{b['path']} @ {ref} nicht gefunden"})
        out["brief"] = brief
    return out


def resolve_tools(cfg: dict, fetch, problems: list) -> dict:
    """Werkzeuge: only routes that really exist on the publication branch count as openable."""
    pub = cfg.get("publication") or {}
    repo, ref, base = pub.get("repo", cfg["repo"]), pub.get("ref", "cloudflare-live"), pub.get("base", "")

    def route(path):
        url = base + (path[: -len("index.html")] if path.endswith("index.html") else path)
        try:
            info = fetch.content(repo, path, ref)
        except FetchError as exc:
            problems.append({"lane": None, "kind": "route-unreadable", "detail": f"{path}: {exc}"})
            return url, None
        return url, info

    tools = []
    for t in cfg.get("tools", []):
        url, info = route(t["path"])
        if not info:
            problems.append({"lane": None, "kind": "tool-route-missing",
                             "detail": f"{t['title']}: {t['path']} fehlt auf {ref}"})
        tools.append({**t, "url": url, "available": bool(info), "blob": info["sha"] if info else None})
    archive = []
    for a in cfg.get("archive", []):
        if a.get("path"):
            url, info = route(a["path"])
            if not info:
                problems.append({"lane": None, "kind": "archive-route-missing",
                                 "detail": f"{a['label']}: {a['path']} fehlt auf {ref}"})
            archive.append({**a, "url": url, "available": bool(info)})
        else:
            archive.append({**a, "available": True})
    return {"publication": {"repo": repo, "ref": ref, "base": base}, "tools": tools, "archive": archive}


def build(cfg: dict, fetch, source: dict) -> dict:
    problems: list = []
    lanes = [resolve_lane(l, cfg, fetch, problems) for l in cfg["lanes"]]
    tools = resolve_tools(cfg, fetch, problems)
    active = [l for l in lanes if l["freshness"] != "CLOSED"]

    briefings = [{
        "lane": l["id"], "title": l["title"], "provider": l["provider"],
        "status": "CURRENT" if l["bucket"] in ("RUNNING", "CAN_START", "LOOK_AT") else "HOLD",
        **l["brief"],
    } for l in active if l.get("brief")]

    reviews = [{
        "lane": l["id"], "title": l["title"], "questions": l["questions"],
        "prUrl": l["prUrl"], "head": l["head"], "result": "PENDING",
    } for l in active if l["bucket"] == "LOOK_AT"]

    counts = {b: sum(1 for l in active if l["bucket"] == b) for b in BUCKETS}
    counts.update({
        "lanes": len(lanes),
        "closed": sum(1 for l in lanes if l["freshness"] == "CLOSED"),
        "external": sum(1 for l in lanes if l["external"]),
        "moved": sum(1 for l in lanes if l["freshness"] == "MOVED"),
        "problems": len(problems),
        "tools": sum(1 for t in tools["tools"] if t["available"]),
    })

    body = {
        "lanes.json": {"schema": SCHEMA, "lanes": lanes},
        "briefings.json": {"schema": SCHEMA, "briefings": briefings},
        "reviews.json": {"schema": SCHEMA, "reviews": reviews},
        "standards.json": {"schema": SCHEMA, "standards": [
            {**s, "url": gh_blob_url(cfg["repo"], s["ref"], s["path"])} for s in cfg.get("standards", [])]},
        "wsa.json": {"schema": SCHEMA, **cfg.get("wsa", {"state": "UNKNOWN", "text": ""})},
        "tools.json": {"schema": SCHEMA, **tools},
        "problems.json": {"schema": SCHEMA, "problems": problems},
    }
    content_hash = hashlib.sha256(canonical_json(body).encode("utf-8")).hexdigest()
    ts = now_iso()
    manifest = {
        "schema": SCHEMA,
        "sourceRepo": cfg["repo"],
        "sourceCommit": source.get("commit"),
        "sourceRef": source.get("ref"),
        "mode": source.get("mode"),
        "generatedAt": ts,
        "checkedAt": ts,
        "contentHash": content_hash,
        "staleAfterHours": cfg.get("staleAfterHours", 8),
        "counts": counts,
        "files": [f for f in OUTPUT_FILES if f != "manifest.json"],
    }
    return {"manifest.json": manifest, **body}


def write(out_dir: Path, files: dict) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    for name, obj in files.items():
        (out_dir / name).write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


# --------------------------------------------------------------------------- validate
def validate(out_dir: Path) -> list[str]:
    errs: list[str] = []
    for f in OUTPUT_FILES:
        if not (out_dir / f).exists():
            errs.append(f"missing {f}")
    if errs:
        return errs
    m = json.loads((out_dir / "manifest.json").read_text(encoding="utf-8"))
    if m.get("schema") != SCHEMA:
        errs.append("manifest schema mismatch")
    for key in ("sourceCommit", "generatedAt", "contentHash", "counts"):
        if not m.get(key):
            errs.append(f"manifest missing {key}")
    lanes = json.loads((out_dir / "lanes.json").read_text(encoding="utf-8"))["lanes"]
    ids = set()
    for l in lanes:
        if l["id"] in ids:
            errs.append(f"duplicate lane {l['id']}")
        ids.add(l["id"])
        if l["bucket"] not in BUCKETS:
            errs.append(f"{l['id']}: bad bucket {l['bucket']}")
        if l["freshness"] not in FRESHNESS:
            errs.append(f"{l['id']}: bad freshness {l['freshness']}")
        if l["external"] and l["freshness"] != "LAST_KNOWN":
            errs.append(f"{l['id']}: external lane must be LAST_KNOWN")
        if l["bucket"] == "LOOK_AT" and not l["yourAction"]:
            errs.append(f"{l['id']}: LOOK_AT lane needs yourAction")
        if l["bucket"] == "WAITING" and not l["waitingFor"]:
            errs.append(f"{l['id']}: WAITING lane needs waitingFor")
    body = {f: json.loads((out_dir / f).read_text(encoding="utf-8"))
            for f in OUTPUT_FILES if f != "manifest.json"}
    if hashlib.sha256(canonical_json(body).encode("utf-8")).hexdigest() != m.get("contentHash"):
        errs.append("contentHash does not match files")
    return errs


def validate_config(cfg: dict) -> list[str]:
    errs = []
    for l in cfg.get("lanes", []):
        if l.get("bucket") not in BUCKETS:
            errs.append(f"{l.get('id')}: bad bucket {l.get('bucket')}")
        if l.get("external") and not l.get("lastKnown"):
            errs.append(f"{l.get('id')}: external lane needs lastKnown")
    return errs


# --------------------------------------------------------------------------- cli
def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--online", action="store_true")
    g.add_argument("--fixture")
    g.add_argument("--validate")
    ap.add_argument("--out", default=str(DEFAULT_OUT))
    ap.add_argument("--config", default=str(CONFIG))
    ap.add_argument("--source-commit")
    ap.add_argument("--source-ref")
    a = ap.parse_args(argv)

    if a.validate:
        errs = validate(Path(a.validate))
        for e in errs:
            print("INVALID:", e)
        print("VALID" if not errs else f"{len(errs)} error(s)")
        return 1 if errs else 0

    cfg = json.loads(Path(a.config).read_text(encoding="utf-8"))
    cerrs = validate_config(cfg)
    if cerrs:
        for e in cerrs:
            print("CONFIG:", e)
        return 1

    if a.online:
        fetch = OnlineFetcher(os.environ.get("GITHUB_TOKEN"))
        source = {"commit": a.source_commit or os.environ.get("GITHUB_SHA"),
                  "ref": a.source_ref or os.environ.get("GITHUB_REF_NAME"), "mode": "github-actions"}
    else:
        fx = json.loads(Path(a.fixture).read_text(encoding="utf-8"))
        fetch = FixtureFetcher(fx.get("responses", {}))
        source = {"commit": a.source_commit or fx.get("sourceCommit"),
                  "ref": a.source_ref or fx.get("sourceRef"), "mode": fx.get("mode", "fixture")}

    files = build(cfg, fetch, source)
    write(Path(a.out), files)
    c = files["manifest.json"]["counts"]
    print(f"built {c['lanes']} lanes · look_at={c['LOOK_AT']} running={c['RUNNING']} "
          f"can_start={c['CAN_START']} waiting={c['WAITING']} problems={c['problems']} "
          f"hash={files['manifest.json']['contentHash'][:12]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
