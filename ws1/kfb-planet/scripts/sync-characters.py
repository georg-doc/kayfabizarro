#!/usr/bin/env python3
"""Snapshot des Figuren-Registers (CHARACTERS_R1) fürs Spiel.

Liest aus dem kayfabizarro-Klon den Register-Zweig (git, nicht die Arbeitskopie), gepinnt auf einen Commit,
und schreibt src/data/characters/registry.r1.json: nur die Felder, die das Spiel zur Laufzeit braucht.
Werte mit Status todo, PREFILL oder DESIGN gelten als nicht gesetzt (v = null); PREFILL-Chatter steht
getrennt unter chatterPrefill, damit ein Rückfall sichtbar bleibt und nie still passiert.

  python3 scripts/sync-characters.py [--repo ~/kfb-ws1/kayfabizarro] [--ref <commit|branch>]
"""
import argparse
import json
import os
import subprocess
import sys

BRANCH = "origin/docs/kfb-decisions-register-2026-10-11"
PATH = "tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/CHARACTERS_R1"
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "data", "characters", "registry.r1.json")
UNSET = {"todo", "PREFILL", "DESIGN", None}


def git(repo, *a):
    return subprocess.run(["git", "-C", repo, *a], check=True, capture_output=True, text=True).stdout


def leaf(o):
    """{v, src, status} → v, wenn gesetzt; sonst None"""
    if not isinstance(o, dict) or o.get("status") in UNSET:
        return None
    return o.get("v")


def addition(rec, key):
    for a in (rec.get("additions") or {}).get(key) or []:
        if a.get("status") not in UNSET and a.get("v") is not None:
            return a["v"]
    return None


def slim(rec):
    idn, ch, vo, app = rec.get("identity") or {}, rec.get("chatter") or {}, rec.get("voice") or {}, rec.get("appearance") or {}
    chatter = {k: leaf(ch.get(k)) for k in ("family", "instrument", "style")}
    prefill = {k: (ch.get(k) or {}).get("v") for k in ("family", "instrument", "style") if (ch.get(k) or {}).get("status") == "PREFILL"}
    voice = {k: leaf(vo.get(k)) if leaf(vo.get(k)) is not None else addition(rec, "voice." + k) for k in ("engine", "spec", "speed", "lang", "sampleFile")}
    out = {
        "id": rec["id"],
        "kind": rec.get("kind"),
        "name": leaf(idn.get("name")),
        "displayName": leaf(idn.get("displayName")),
        "aliases": rec.get("aliases") or [],
        "chatter": chatter if any(v is not None for v in chatter.values()) else None,
        "voice": voice if any(v is not None for v in voice.values()) else None,
        "figureRefs": [{"path": r.get("path"), "sha256": r.get("sha256")} for r in app.get("figureRefs") or []],
        "todoFields": rec.get("todoFields") or [],
    }
    if prefill:
        out["chatterPrefill"] = prefill
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", default=os.path.expanduser("~/kfb-ws1/kayfabizarro"))
    ap.add_argument("--ref", default=BRANCH)
    a = ap.parse_args()
    commit = git(a.repo, "log", "-1", "--format=%H", a.ref, "--", PATH).strip()
    if not commit:
        sys.exit("Register nicht gefunden: %s:%s" % (a.ref, PATH))
    show = lambda p: json.loads(git(a.repo, "show", "%s:%s/%s" % (commit, PATH, p)))
    index, aliases = show("index.json"), show("aliases.json")
    chars = {c["id"]: slim(show(c["file"])) for c in index["characters"]}
    snap = {
        "schema": "kfb.character-registry-snapshot/1",
        "source": {"repo": "kayfabizarro", "branch": BRANCH.replace("origin/", ""), "commit": commit, "path": PATH,
                   "indexSchema": index.get("schema"), "count": index.get("count")},
        "unsetStatus": sorted(s for s in UNSET if s),
        "aliases": aliases["aliases"],
        "qualified": {k: v["id"] for k, v in (aliases.get("qualified") or {}).items()},
        "scoped": aliases.get("scoped") or {},
        "unresolved": {k: v.get("candidates") for k, v in (aliases.get("unresolved") or {}).items()},
        "excluded": sorted(aliases.get("excluded") or {}),
        "characters": chars,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(snap, fh, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
        fh.write("\n")
    n = lambda f: sum(1 for c in chars.values() if f(c))
    print("registry.r1.json @%s · %d Figuren · chatter %d · voice %d · Bytes %d" % (
        commit[:7], len(chars), n(lambda c: c["chatter"]), n(lambda c: c["voice"]), os.path.getsize(OUT)))


if __name__ == "__main__":
    main()
