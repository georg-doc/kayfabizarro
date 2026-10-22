#!/usr/bin/env python3
"""Character parity check against the registry in 30_DECISIONS/CHARACTERS_R1.

Collects every character id used by
  S4  60_CAST/cast.r1.json            (actors, roles_by_scene keys)
  S6  replies/voice_casting.r1.json   (figures[].figureId)
  S7  RESIDENT_ATLAS_S17_1to1/data/cast.js (residentId + actor ids, scoped)
  S3  50_BLENDER/**/*.figure*.json + replies/BUEHNE_R2/**/*.figure*.json (card ids)
  S15 50_BLENDER/K15/data/q_*.figure.json and K15/data/kfb/*.figure.json
  B46 50_BLENDER/B46/data/{pencil,eraser}.figure.json
resolves them through aliases.json and prints
  1. ids not in the registry (unresolved or unknown)
  2. registry characters without any appearance ref (no figure card and no face profile)
Exit code 1 if either list is non-empty. Read-only; Python 3.9 standard library.
"""
import glob
import json
import os
import re
import sys

HOME = os.path.expanduser("~")
H = os.path.join(HOME, "Dropbox", "CLAUDE", "KFB_HUB")
R = os.path.join(H, "30_DECISIONS", "replies")
OUT = os.path.join(H, "30_DECISIONS", "CHARACTERS_R1")
ATLAS = os.path.join(R, "RESIDENT_ATLAS_S17_1to1")


def load(p):
    with open(p, encoding="utf-8") as fh:
        return json.load(fh)


def main():
    aliases = load(os.path.join(OUT, "aliases.json"))
    index = load(os.path.join(OUT, "index.json"))
    reg = {c["id"] for c in index["characters"]}
    amap = aliases["aliases"]
    qual = {k: v["id"] for k, v in aliases.get("qualified", {}).items()}
    scoped = aliases.get("scoped", {})
    excluded = aliases.get("excluded", {})
    unresolved = aliases.get("unresolved", {})

    def resolve(i, scope=None):
        if scope and scope in scoped and i in scoped[scope]:
            v = scoped[scope][i]
            return v if isinstance(v, list) else [v]
        for c in (i, i.lower(), i.replace("-", "_").lower()):
            if c in reg:
                return [c]
            if c in amap:
                return [amap[c]]
            if c in qual:
                return [qual[c]]
        return None

    used = []  # (source, id, scope)
    cast = load(os.path.join(H, "60_CAST", "cast.r1.json"))
    for k in cast["actors"]:
        used.append(("S4 cast.actors", k, None))
    for k in cast.get("roles_by_scene", {}):
        used.append(("S4 cast.roles_by_scene", k, None))
    vc = load(os.path.join(R, "voice_casting.r1.json"))
    for f in vc["figures"]:
        used.append(("S6 voice_casting", f["figureId"], None))
    js = open(os.path.join(ATLAS, "data", "cast.js"), encoding="utf-8").read()
    body = js[js.index("export const RESIDENTS"):]
    for b in re.split(r"\n  \{\n    residentId:", body)[1:]:
        rid = re.match(r"\s*'([^']+)'", b).group(1)
        used.append(("S7 atlas residentId", rid, "S7.residentId"))
        m = re.search(r"\n    actor:\s*\{(?:\s*/\*.*?\*/)*\s*id:\s*'([^']+)'", b, re.S)
        if m:
            used.append(("S7 atlas actor", m.group(1), "S7.actor"))
    cards = glob.glob(os.path.join(H, "50_BLENDER", "**", "*.figure*.json"), recursive=True)
    cards += glob.glob(os.path.join(R, "BUEHNE_R2", "**", "*.figure*.json"), recursive=True)
    for p in sorted(set(cards)):
        try:
            d = load(p)
        except Exception:
            continue
        if not isinstance(d, dict) or not d.get("id"):
            continue
        rp = os.path.relpath(p, H)
        tag = "S3 figure card"
        if rp.startswith("50_BLENDER/K15/"):
            tag = "S15 K15 card"
        elif rp.startswith("50_BLENDER/B46/"):
            tag = "B46 card"
        used.append((tag, d["id"], None))

    missing = {}
    excl_hit = {}
    groups = {}
    for src, i, scope in used:
        if i in excluded:
            excl_hit.setdefault(i, set()).add(src)
            continue
        res = resolve(i, scope)
        if res and all(r in reg for r in res):
            if len(res) > 1:
                groups.setdefault(i, (src, res))
            continue
        why = "unresolved: %s" % unresolved[i]["reason"] if i in unresolved else "unknown id"
        missing.setdefault((i, why), set()).add(src)

    no_appearance = []
    for c in index["characters"]:
        rec = load(os.path.join(OUT, c["file"]))
        app = rec.get("appearance", {})
        if not app.get("figureRefs") and not app.get("profileRefs"):
            kit = (app.get("kitModel") or {}).get("v")
            no_appearance.append((c["id"], c["kind"], (kit or {}).get("path") if isinstance(kit, dict) else None))

    print("Registry: %d characters · ids checked: %d (unique %d)" % (len(reg), len(used), len({u[1] for u in used})))
    print("")
    print("1) ids not in the registry: %d" % len(missing))
    for (i, why), srcs in sorted(missing.items()):
        print("   - %s  [%s]  (%s)" % (i, why, ", ".join(sorted(srcs))))
    print("")
    print("2) registry characters without any appearance ref (no figure card, no face profile): %d" % len(no_appearance))
    for cid, kind, kit in sorted(no_appearance):
        print("   - %s (%s)%s" % (cid, kind, "  kit model only: " + kit if kit else ""))
    print("")
    print("info: excluded ids (not characters): %s" % ", ".join(sorted(excl_hit)) if excl_hit else "info: no excluded ids used")
    if groups:
        print("info: group ids resolving to several characters: %s" % "; ".join(
            "%s -> %s" % (k, "+".join(v[1])) for k, v in sorted(groups.items())))
    rc = 1 if (missing or no_appearance) else 0
    print("")
    print("PARITY %s" % ("FAIL" if rc else "PASS"))
    return rc


if __name__ == "__main__":
    sys.exit(main())
