#!/usr/bin/env python3
"""Build the KFB character registry (V-394: one SSOT per character).

Reads local source files only (no network, no git) and writes
KFB_HUB/30_DECISIONS/CHARACTERS_R1/:
  characters/<id>/character.json   schema kfb.character/1.1
  index.json, aliases.json, GAPS.md, DRAMATIS_PERSONAE_LINK.md, LORE_ONLY_FIGURES.md

Rules
- Every value is copied from a source file; provenance maps field path -> source + tag.
  Tags: GEORG (value carried a Georg status in the source), SOURCE (copied as-is),
  PREFILL (copied, but placed into a field by a mechanical rule, needs review), todo (empty).
- Existing kfb.character/1 files (FIGURES_R1/characters) are seeds: their filled leaves are
  kept byte-for-byte; extra values for an already filled leaf go to `additions`.
- Alias resolution uses only evidence rules R1..R9 (see resolve_card()). Anything with
  conflicting or missing evidence goes to aliases.json "unresolved" instead of being guessed.
- Never writes outside CHARACTERS_R1. Deterministic output (no timestamps), rerunnable.

Python 3.9 standard library only.
"""
import csv
import glob
import hashlib
import json
import os
import re
import shutil
import sys
import unicodedata

HOME = os.path.expanduser("~")
C = os.path.join(HOME, "Dropbox", "CLAUDE")
H = os.path.join(C, "KFB_HUB")
R = os.path.join(H, "30_DECISIONS", "replies")
OUT = os.path.join(H, "30_DECISIONS", "CHARACTERS_R1")
ATLAS = os.path.join(R, "RESIDENT_ATLAS_S17_1to1")
PETS_V5 = os.path.join(C, "Pet Studio + 3D TableDiorama KFB (WS0 FULL EXPORT)", "kfb-pets.v5.json")
SKILL_ROOT = os.path.join(HOME, "Library", "Application Support", "Claude",
                          "local-agent-mode-sessions", "skills-plugin")
FORBIDDEN = os.path.join(C, "KFB Open World")

SCHEMA = "kfb.character/1.1"

# Wanted fields (Georg V-394 list) -> how "filled" is decided (path in the output record).
WANTED = [
    ("identity.name", "identity/name"),
    ("story.background", "backstory"),
    ("personality.quirks", "quirks"),
    ("dialogue.speechPatterns", "speech patterns"),
    ("voice.spec", "voice"),
    ("chatter.instrument", "chatter instrument"),
    ("preferences.weapons", "preferred weapons"),
    ("preferences.biome", "preferred biome"),
    ("dioramas", "diorama assignments"),
    ("memory.relationships", "relationships/memory"),
    ("appearance.figureRefs", "appearance (figure cards)"),
    ("variants", "variants"),
    ("performance.animations", "animations"),
    ("songs", "songs"),
]


# ----------------------------------------------------------------------------- helpers
def rel(path):
    """Path as written into provenance: relative to ~/Dropbox/CLAUDE, else ~-relative."""
    ap = os.path.abspath(path)
    if ap.startswith(C + os.sep):
        return os.path.relpath(ap, C)
    if ap.startswith(HOME + os.sep):
        return "~/" + os.path.relpath(ap, HOME)
    return ap


def guard(path):
    if os.path.abspath(path).startswith(FORBIDDEN):
        raise SystemExit("refusing to read " + path)


def load_json(path):
    guard(path)
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def read_text(path):
    guard(path)
    with open(path, encoding="utf-8", errors="replace") as fh:
        return fh.read()


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()


def fold(s):
    s = s.replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("Ä", "Ae")
    s = s.replace("Ö", "Oe").replace("Ü", "Ue").replace("ß", "ss")
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")


def snake(s):
    s = fold(s)
    s = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", s)
    s = re.sub(r"[^A-Za-z0-9]+", "_", s).strip("_").lower()
    return s


def kebab_to_snake(s):
    return s.replace("-", "_").lower()


def main_label(s):
    """'Orc Brute · Ringer' -> 'Orc Brute'; 'Hexe A (Duo, Textur A)' -> 'Hexe A'."""
    if not s:
        return ""
    s = s.split(" · ")[0]
    s = s.split(" (")[0]
    return s.strip()


def base_of_path(p):
    """kit asset basename key: 'media/.../Skeleton_Warrior.glb' -> 'skeleton_warrior'."""
    if not p or not isinstance(p, str):
        return None
    b = os.path.basename(p.split(" (")[0].strip())
    b = re.sub(r"\.(glb|gltf)$", "", b, flags=re.I)
    b = re.sub(r"_NoEyes$", "", b, flags=re.I)
    if not b:
        return None
    return b.lower().replace("-", "_")


def leaf(v, src, status, note=None):
    d = {"v": v, "src": src, "status": status}
    if note:
        d["note"] = note
    return d


def todo_leaf(note=None):
    d = {"v": None, "status": "todo"}
    if note:
        d["note"] = note
    return d


def is_filled_leaf(x):
    if isinstance(x, dict) and "v" in x:
        v = x["v"]
        return v not in (None, "", [], {})
    return False


def uniq(seq):
    out, seen = [], set()
    for x in seq:
        k = json.dumps(x, sort_keys=True, ensure_ascii=False)
        if k not in seen:
            seen.add(k)
            out.append(x)
    return out


def strip_dropbox(p):
    if isinstance(p, str) and p.startswith("dropbox:"):
        return p[len("dropbox:"):]
    return p


# ----------------------------------------------------------------------------- registry state
class Registry:
    def __init__(self):
        self.chars = {}          # cid -> record (working dict)
        self.alias = {}          # string -> (cid, evidence)
        self.alias_conflicts = []
        self.scoped = {}         # scope -> {local: cid}
        self.unresolved = {}     # string -> {"candidates": [...], "reason": str, "seenIn": [...]}
        self.excluded = {}       # string -> {"reason": str, "source": str}
        self.label_index = {}    # lower main label -> set(cid)
        self.kit_index = {}      # asset basename key -> (cid, evidence)
        self.duplicates = []
        self.qualified = {}      # alias with a qualifier in the source, e.g. 'monster (EYE-CLEANUP-02 id)'
        self.notes = []

    # -- characters
    def ensure(self, cid, src, kind_hint=None):
        if cid not in self.chars:
            self.chars[cid] = {
                "id": cid, "seed": None, "names": [], "labels": [], "sources": [],
                "kindEvidence": [], "figureFiles": [], "profileRefs": [], "variants": [],
                "dioramas": [], "weapons": [], "biome": [], "relationships": [],
                "animations": [], "songs": [], "lore": [], "quirks": [], "speech": [],
                "chatter": {}, "voice": None, "conflicts": [], "story": [],
                "baseModel": [], "aliases": [], "displayName": None, "dp": None,
                "fieldsFrom": {},
            }
        r = self.chars[cid]
        if src and src not in r["sources"]:
            r["sources"].append(src)
        if kind_hint:
            r["kindEvidence"].append(kind_hint)
        return r

    def add_label(self, cid, label, src):
        if not label:
            return
        r = self.chars[cid]
        if label not in r["labels"]:
            r["labels"].append(label)
        k = main_label(label).lower()
        if k:
            self.label_index.setdefault(k, set()).add(cid)

    # -- aliases
    def add_alias(self, s, cid, evidence):
        if not s or not isinstance(s, str):
            return
        s = s.strip()
        if not s:
            return
        if s in self.alias:
            old, oldev = self.alias[s]
            if old != cid:
                # identity wins: a string that is itself a canonical id keeps pointing at itself
                if s == old:
                    self.alias_conflicts.append({"id": s, "kept": old, "keptEvidence": oldev,
                                                 "rejected": cid, "rejectedEvidence": evidence})
                    return
                if s == cid:
                    self.alias_conflicts.append({"id": s, "kept": cid, "keptEvidence": evidence,
                                                 "rejected": old, "rejectedEvidence": oldev})
                    self.alias[s] = (cid, evidence)
                    return
                self.mark_unresolved(s, [old, cid], "conflicting evidence: %s | %s" % (oldev, evidence), evidence)
            return
        if s in self.unresolved:
            self.unresolved[s]["candidates"] = sorted(set(self.unresolved[s]["candidates"]) | {cid})
            return
        self.alias[s] = (cid, evidence)
        if s not in self.chars.get(cid, {}).get("aliases", []) and cid in self.chars and s != cid:
            self.chars[cid]["aliases"].append(s)

    def mark_unresolved(self, s, candidates, reason, seen):
        if s in self.alias and s not in candidates:
            candidates = list(candidates) + [self.alias[s][0]]
        self.alias.pop(s, None)
        u = self.unresolved.setdefault(s, {"candidates": [], "reason": reason, "seenIn": []})
        u["candidates"] = sorted(set(u["candidates"]) | set(c for c in candidates if c))
        if seen and seen not in u["seenIn"]:
            u["seenIn"].append(seen)
        for c in candidates:
            if c in self.chars and s in self.chars[c]["aliases"]:
                self.chars[c]["aliases"].remove(s)

    def resolve(self, s):
        if not s:
            return None
        for cand in (s, s.lower(), kebab_to_snake(s)):
            if cand in self.chars:
                return cand
            if cand in self.alias:
                return self.alias[cand][0]
        return None

    def resolve_loose(self, s):
        c = self.resolve(s)
        if c or not s:
            return c
        q = self.qualified.get(s) or self.qualified.get(s.lower() if s else s)
        return q[0] if q else None

    def scope(self, name, local, cid):
        self.scoped.setdefault(name, {})[local] = cid

    def add_kit(self, key, cid, evidence):
        if not key:
            return
        if key in self.kit_index and self.kit_index[key][0] != cid:
            self.notes.append("kit basename %s claimed by %s (%s) and %s (%s); first kept" % (
                key, self.kit_index[key][0], self.kit_index[key][1], cid, evidence))
            return
        self.kit_index.setdefault(key, (cid, evidence))


REG = Registry()


def note_field(cid, path, value, src, tag):
    """Collect a value for an output field (non-seed path)."""
    r = REG.chars[cid]
    r["fieldsFrom"].setdefault(path, []).append({"v": value, "src": src, "status": tag})


# ----------------------------------------------------------------------------- S1 / S2 seeds
S1_DIR = os.path.join(R, "FIGURES_R1", "characters")
S2_DIR = os.path.join(R, "FIGURES_R1", "figures")


def strip_paren(a):
    return a.split(" (")[0].strip() if isinstance(a, str) else a


def add_seed_alias(a, cid, evidence):
    """Unqualified aliases go to the global map; qualified ones ('x (y)') stay scoped."""
    if not isinstance(a, str):
        return
    base = strip_paren(a)
    if " (" in a:
        REG.qualified.setdefault(base, (cid, evidence + " · qualifier: " + a))
        if base not in REG.chars[cid]["aliases"]:
            REG.chars[cid]["aliases"].append(base)
        return
    REG.add_alias(base, cid, evidence)


def load_seeds():
    for f in sorted(glob.glob(os.path.join(S1_DIR, "*.character.json"))):
        d = load_json(f)
        cid = d["id"]
        r = REG.ensure(cid, rel(f), "S1:" + str(d["identity"].get("tier", {}).get("v")))
        r["seed"] = d
        r["seedPath"] = rel(f)
        REG.add_alias(cid, cid, "S1 id " + rel(f))
        name = d["identity"].get("name", {}).get("v")
        REG.add_label(cid, name, rel(f))
        dn = d["identity"].get("displayName", {}).get("v")
        REG.add_label(cid, dn, rel(f))
        for a in d["identity"].get("aliases", {}).get("v") or []:
            add_seed_alias(a, cid, "S1 identity.aliases " + rel(f))
        for a in d["identity"].get("voiceInputMishearings", {}).get("v") or []:
            add_seed_alias(a, cid, "S1 voiceInputMishearings " + rel(f))
    for f in sorted(glob.glob(os.path.join(S2_DIR, "*.figure.json"))):
        d = load_json(f)
        cid = d["id"]
        r = REG.ensure(cid, rel(f), "S2:role=" + str(d.get("role")))
        REG.add_alias(cid, cid, "S2 figure id " + rel(f))
        REG.add_label(cid, d.get("displayName"), rel(f))
        r["displayName"] = r["displayName"] or d.get("displayName")
        for a in d.get("aliases") or []:
            add_seed_alias(a, cid, "S2 figure aliases " + rel(f))
        r["figureFiles"].append({"path": f, "id": cid, "src": "S2"})
        glb = ((d.get("body") or {}).get("glb") or {}).get("path")
        REG.add_kit(base_of_path(glb), cid, "S2 body.glb " + rel(f))
        rs = (d.get("body") or {}).get("rawSource")
        if isinstance(rs, dict):
            REG.add_kit(base_of_path(rs.get("path")), cid, "S2 body.rawSource " + rel(f))
        if d.get("voice"):
            r.setdefault("figureVoice", (d["voice"], rel(f)))
        if d.get("performance"):
            r.setdefault("figurePerformance", (d["performance"], rel(f)))
    # S1 aliases like 'Mummy_A_NoEyes' double as kit basenames
    for cid, r in REG.chars.items():
        if r["seed"]:
            for a in r["seed"]["identity"].get("aliases", {}).get("v") or []:
                if re.match(r"^[A-Za-z0-9_]+$", strip_paren(a) or ""):
                    k = base_of_path(strip_paren(a))
                    if k and k.replace("_", "") != cid.replace("_", "") and k not in REG.kit_index:
                        pass


# ----------------------------------------------------------------------------- S4 cast
CAST = os.path.join(H, "60_CAST", "cast.r1.json")
CAST_CARD = {}   # normalized card path -> (cid, variantKey or None)


def load_cast():
    d = load_json(CAST)
    src = rel(CAST)
    for cid, a in d["actors"].items():
        r = REG.ensure(cid, src, "S4:rig=" + str(a.get("rig")))
        REG.add_alias(cid, cid, "S4 cast actor id " + src)
        REG.add_label(cid, a.get("label"), src)
        r["castEntry"] = a
        if a.get("card"):
            CAST_CARD[strip_dropbox(a["card"])] = (cid, None)
        for k, va in (a.get("variant_assets") or {}).items():
            if isinstance(va, dict) and va.get("card"):
                CAST_CARD[strip_dropbox(va["card"])] = (cid, k)
            r["variants"].append({"id": k, "type": "scene_variant", "label": k,
                                  "asset": strip_dropbox(va.get("asset")) if isinstance(va, dict) else None,
                                  "card": strip_dropbox(va.get("card")) if isinstance(va, dict) else None,
                                  "note": va.get("note") if isinstance(va, dict) else None,
                                  "src": src + "#actors." + cid + ".variant_assets." + k})
        for v in a.get("variants") or []:
            r["variants"].append({"id": snake(v), "type": "texture", "label": v,
                                  "src": src + "#actors." + cid + ".variants"})
        for p in a.get("ra_paths") or []:
            REG.add_kit(base_of_path(p), cid, "S4 ra_paths " + src)
        clips = a.get("clips")
        if clips:
            r["animations"].append({"v": clips, "src": src + "#actors." + cid + ".clips"})
        if a.get("npcClips"):
            r["animations"].append({"v": a["npcClips"], "src": src + "#actors." + cid + ".npcClips"})
        if a.get("weapon"):
            r["weapons"].append({"v": a["weapon"], "src": src + "#actors." + cid + ".weapon", "status": "SOURCE"})
        if a.get("weaponRule"):
            r["weapons"].append({"v": a["weaponRule"], "src": src + "#actors." + cid + ".weaponRule", "status": "SOURCE"})
        if a.get("prop"):
            r["weapons"].append({"v": a["prop"], "src": src + "#actors." + cid + ".prop", "status": "PREFILL",
                                 "note": "hand prop, not necessarily a weapon"})
    for cid, roles in d.get("roles_by_scene", {}).items():
        target = REG.resolve(cid)
        if not target:
            target = cid
            REG.ensure(cid, src, "S4:roles_by_scene")
            REG.add_alias(cid, cid, "S4 roles_by_scene key " + src)
        for ro in roles:
            REG.chars[target]["dioramas"].append({"id": ro.get("scene"), "role": ro.get("role"),
                                                  "note": ro.get("note") or ro.get("faction"),
                                                  "src": src + "#roles_by_scene." + cid})
    fac = d.get("factions") or {}
    REG.cast_factions = (fac, src)


# ----------------------------------------------------------------------------- S8 kit coverage
COVERAGE = os.path.join(ATLAS, "data", "eye-rig", "mystery-monthly-character-coverage.v1.json")
RIG_MED = os.path.join(ATLAS, "data", "eye-rig", "rig-medium-actors.v0.json")
RIG_LARGE = os.path.join(ATLAS, "data", "eye-rig", "rig-large-actors.v0.json")


def load_kit():
    actors = []
    for f in (COVERAGE, RIG_MED, RIG_LARGE):
        d = load_json(f)
        for a in d.get("actors", []):
            actors.append((a, rel(f)))
    by_label = {}
    for a, src in actors:
        by_label.setdefault(a["label"], a["id"])
    seen = set()
    # pass 1: base actors (label without ' · ' suffix variant of another label)
    order = sorted(actors, key=lambda x: (" · " in x[0]["label"], x[0]["id"]))
    for a, src in order:
        kid = a["id"]
        key = base_of_path(a.get("path"))
        lab = a["label"]
        base_lab = lab.split(" · ")[0]
        variant_of = None
        if " · " in lab and base_lab in by_label and by_label[base_lab] != kid:
            variant_of = by_label[base_lab]
        cid = None
        ev = None
        if variant_of:
            cid = REG.resolve(variant_of) or REG.resolve(kebab_to_snake(variant_of))
            ev = "S8 label '%s' is a variant of '%s' (%s)" % (lab, base_lab, src)
        if not cid and key and key in REG.kit_index:
            cid, kev = REG.kit_index[key]
            ev = "S8 path basename %s = %s" % (key, kev)
        if not cid and key:
            cid = key if key in REG.chars else None
            ev = "S8 path basename %s = registry id/alias (%s)" % (key, src) if cid else None
        if not cid:
            cid = REG.resolve(kid)
            ev = "S8 id %s (%s)" % (kid, src) if cid else None
        if not cid:
            # S1 alias like '4GTN' matches the kit label
            cid = REG.resolve(lab)
            ev = "S8 label %s matches alias (%s)" % (lab, src) if cid else None
        if not cid:
            cid = kebab_to_snake(kid)
            REG.ensure(cid, src, "S8:" + a.get("rigClass", ""))
            ev = "S8 kit actor %s (%s)" % (kid, src)
            REG.add_alias(cid, cid, ev)
        r = REG.ensure(cid, src, "S8:" + str(a.get("rigClass")))
        r["kit"] = True
        REG.add_alias(kid, cid, ev)
        REG.add_alias(kebab_to_snake(kid), cid, ev)
        REG.add_label(cid, lab if not variant_of else base_lab, src)
        if variant_of and (kid, cid) not in seen:
            r["variants"].append({"id": kebab_to_snake(kid), "type": "look", "label": lab,
                                  "asset": a.get("path"), "src": src + "#actors." + kid})
        if not variant_of:
            REG.add_kit(key, cid, "S8 path " + src)
        for av in a.get("appearanceVariants") or []:
            r["variants"].append({"id": "texture_" + str(av.get("id")).lower(), "type": "texture",
                                  "label": "palette " + str(av.get("id")), "asset": av.get("path"),
                                  "note": av.get("role"), "src": src + "#actors." + kid + ".appearanceVariants"})
        r.setdefault("kitPath", (a.get("path"), src, a.get("rigClass")))
        if not variant_of:
            r.setdefault("kitLabel", (lab, src + "#actors." + kid + ".label"))
        seen.add((kid, cid))


# ----------------------------------------------------------------------------- S3 figure cards
CARD_GLOBS = [os.path.join(H, "50_BLENDER", "**", "*.figure*.json"),
              os.path.join(R, "BUEHNE_R2", "**", "*.figure*.json")]
SUFFIX_RULES = [
    (r"_k13_(angriff|death|idle)$", "pose"),
    (r"_pose$", "pose"),
    (r"_k12$", "scene_variant"),
    (r"_healed$", "state"),
    (r"_kfbeyes$", "state"),
    (r"_glasses$", "look"),
    (r"_n15$", "revision"),
    (r"_r2b$", "revision"),
    (r"_r2$", "revision"),
    (r"_b$", "texture"),
]
EXCLUDE_ROLES = {"fx", "prop"}
CARDS = {}     # card id -> list of (path, data)


def card_files():
    files = []
    for g in CARD_GLOBS:
        files.extend(glob.glob(g, recursive=True))
    files = sorted(set(f for f in files if not os.path.abspath(f).startswith(os.path.join(R, "FIGURES_R1"))))
    for f in files:
        try:
            d = load_json(f)
        except Exception as e:  # noqa
            REG.notes.append("unreadable card %s: %s" % (rel(f), e))
            continue
        if not isinstance(d, dict) or not d.get("id"):
            continue
        CARDS.setdefault(d["id"], []).append((f, d))


def card_label(d):
    return d.get("displayName") or ""


def resolve_card(cid_card, stack=()):
    """Return (canonical, evidence, variantType) for a figure card id."""
    if cid_card in stack:
        return None, "cycle", None
    files = CARDS.get(cid_card, [])
    d = files[0][1] if files else {}
    # R1 identity / existing alias
    c = REG.resolve(cid_card)
    if c:
        return c, "R1 id is canonical or known alias", None
    # R2 cast card linkage
    for f, _ in files:
        rp = os.path.relpath(f, H)
        if rp in CAST_CARD:
            cc, vk = CAST_CARD[rp]
            return cc, "R2 cast.r1.json card/variant_assets -> %s" % rp, ("scene_variant" if vk else None)
    # R3 body.from_card
    fc = (d.get("body") or {}).get("from_card")
    if fc:
        fp = os.path.join(H, fc)
        if os.path.exists(fp):
            fid = load_json(fp).get("id")
            c2, ev2, _ = resolve_card(fid, stack + (cid_card,))
            if c2:
                return c2, "R3 body.from_card %s (%s)" % (fc, ev2), "scene_variant"
    # R4 suffix -> base card
    for pat, vt in SUFFIX_RULES:
        if re.search(pat, cid_card):
            base = re.sub(pat, "", cid_card)
            if base in CARDS or REG.resolve(base):
                c2, ev2, _ = resolve_card(base, stack + (cid_card,))
                if c2:
                    return c2, "R4 suffix %s of card %s (%s)" % (pat, base, ev2), vt
    # R5 displayName main label equals a known character label
    ml = main_label(card_label(d)).lower()
    if ml and ml in REG.label_index:
        cands = sorted(REG.label_index[ml])
        if len(cands) == 1:
            return cands[0], "R5 displayName '%s' = label of %s" % (card_label(d), cands[0]), "scene_variant"
        return None, "R5 ambiguous label '%s' -> %s" % (card_label(d), cands), None
    # R6 rawSource kit basename + label containment
    rs = (d.get("body") or {}).get("rawSource")
    rsp = rs.get("path") if isinstance(rs, dict) else rs
    key = base_of_path(rsp) if isinstance(rsp, str) else None
    if key and key in REG.kit_index:
        tgt, kev = REG.kit_index[key]
        labels = [main_label(x).lower() for x in REG.chars[tgt]["labels"]]
        main = card_label(d).split(" (")[0].split(" · ")[0].lower()
        if any(l and l in main for l in labels):
            return tgt, "R6 rawSource %s -> %s and displayName contains its label" % (key, tgt), "scene_variant"
        REG.chars.setdefault  # keep linter quiet
        return None, "R6-base:%s:%s" % (tgt, key), None
    # R6c camp cards: license names the pack, glb token names the kit actor
    lic = json.dumps(d.get("licenses") or d.get("license") or {}, ensure_ascii=False)
    m = re.match(r"kfb_camp_([a-z_]+?)(?:_[ab])?$", cid_card)
    if m:
        tok = m.group(1)
        cand = None
        if "Adventurers" in lic:
            cand = REG.resolve("adventurer_" + tok)
        elif "Mystery" in lic:
            cand = REG.resolve(tok)
        if cand:
            return cand, "R6c camp card token '%s' + licence pack (%s)" % (tok, lic[:80]), "scene_variant"
    return None, None, None


def load_cards():
    card_files()
    pending = {}
    # exclusions first (non-characters by card role)
    for cid_card, files in sorted(CARDS.items()):
        role = files[0][1].get("role")
        if role in EXCLUDE_ROLES:
            REG.excluded[cid_card] = {"reason": "figure card role '%s' (not a character)" % role,
                                      "source": rel(files[0][0]),
                                      "displayName": files[0][1].get("displayName")}
    # iterate until stable so cards can resolve through each other
    remaining = [c for c in sorted(CARDS) if c not in REG.excluded]
    resolved = {}
    for _ in range(4):
        nxt = []
        for c in remaining:
            tgt, ev, vt = resolve_card(c)
            if tgt:
                resolved[c] = (tgt, ev, vt)
                REG.add_alias(c, tgt, ev)
            else:
                nxt.append(c)
                pending[c] = ev
        if len(nxt) == len(remaining):
            break
        remaining = nxt
    # defer suffix cards whose base card is also unresolved: they follow their base later
    def is_suffix_card(c):
        for pat, _vt in SUFFIX_RULES:
            if re.search(pat, c) and re.sub(pat, "", c) in CARDS:
                return True
        return False
    deferred = [c for c in remaining if is_suffix_card(c)]
    remaining = [c for c in remaining if c not in deferred]
    # R7 group unresolved cards by displayName main label (same name -> one character)
    groups = {}
    for c in remaining:
        ml = main_label(card_label(CARDS[c][0][1]))
        groups.setdefault(ml, []).append(c)
    for ml, members in sorted(groups.items()):
        if len(members) > 1 and ml:
            cid = snake(ml)
            if cid in REG.chars:
                cid = cid + "_figure"
            REG.ensure(cid, rel(CARDS[members[0]][0][0]), "S3")
            REG.chars[cid]["displayName"] = REG.chars[cid]["displayName"] or ml
            REG.add_label(cid, ml, rel(CARDS[members[0]][0][0]))
            REG.add_alias(cid, cid, "R7 shared displayName '%s' of %s" % (ml, members))
            for c in members:
                resolved[c] = (cid, "R7 shared displayName '%s'" % ml, "look")
                REG.add_alias(c, cid, "R7 shared displayName '%s'" % ml)
            remaining = [x for x in remaining if x not in members]
    # R8 own identity: strip kfb_ prefix and _bNN build tag
    for c in remaining:
        cid = re.sub(r"^kfb_", "", c)
        cid = re.sub(r"_b\d\d(?=_|$)", "", cid)
        if cid in REG.chars and cid != c:
            cid = c
        ev = pending.get(c) or ""
        REG.ensure(cid, rel(CARDS[c][0][0]), "S3")
        REG.add_alias(c, cid, "R8 own identity (no evidence for another character)")
        REG.add_alias(cid, cid, "R8 own identity")
        resolved[c] = (cid, "R8 own identity", None)
        if ev.startswith("R6-base:"):
            _, tgt, key = ev.split(":", 2)
            REG.chars[cid]["baseModel"].append({"v": "same kit body as %s (%s)" % (tgt, key),
                                                "src": rel(CARDS[c][0][0]) + "#body.rawSource"})
    # second pass for deferred suffix cards (their base now has an identity)
    for _ in range(3):
        left = []
        for c in deferred:
            tgt, ev, vt = resolve_card(c)
            if tgt:
                resolved[c] = (tgt, ev, vt)
                REG.add_alias(c, tgt, ev)
            else:
                left.append(c)
        deferred = left
    for c in deferred:
        cid = re.sub(r"^kfb_", "", c)
        REG.ensure(cid, rel(CARDS[c][0][0]), "S3")
        REG.add_alias(c, cid, "R8 own identity (suffix card, base unresolved)")
        REG.add_alias(cid, cid, "R8 own identity")
        resolved[c] = (cid, "R8 own identity", None)
    # attach card data to characters
    for c, (tgt, ev, vt) in sorted(resolved.items()):
        r = REG.chars[tgt]
        for f, d in CARDS[c]:
            r["figureFiles"].append({"path": f, "id": c, "src": "S3", "variantType": vt, "evidence": ev})
        d = CARDS[c][0][1]
        f0 = rel(CARDS[c][0][0])
        REG.add_label(tgt, d.get("displayName"), f0) if vt is None else None
        if not r["displayName"] and vt is None:
            r["displayName"] = d.get("displayName")
        if vt:
            r["variants"].append({"id": c, "type": vt, "label": d.get("displayName"), "card": f0,
                                  "src": f0 + "#id"})
        for fname in ("story",):
            if d.get(fname):
                r["story"].append({"v": d[fname], "src": f0 + "#story", "card": c})
        if d.get("weapon"):
            r["weapons"].append({"v": d["weapon"], "src": f0 + "#weapon", "status": "SOURCE"})
        if d.get("weaponRule"):
            r["weapons"].append({"v": d["weaponRule"], "src": f0 + "#weaponRule", "status": "SOURCE"})
        props = d.get("props")
        if isinstance(props, dict):
            for pk in props:
                if WEAPON_RX.search(pk):
                    r["weapons"].append({"v": pk, "src": f0 + "#props", "status": "PREFILL",
                                         "note": "prop key matched weapon keyword"})
        clips = d.get("clips")
        if clips:
            names = clips if isinstance(clips, list) else list(clips.keys()) if isinstance(clips, dict) else clips
            r["animations"].append({"v": names, "src": f0 + "#clips"})
        if d.get("voice"):
            r.setdefault("figureVoice", (d["voice"], f0))
        if d.get("behaviour"):
            r["lore"].append({"text": json.dumps(d["behaviour"], ensure_ascii=False)[:600],
                              "file": f0, "line": None, "heading": "behaviour"})
        rs = (d.get("body") or {}).get("rawSource")
        if rs and vt is None and c not in ("kfb_disco_mc",):
            r["baseModel"].append({"v": rs, "src": f0 + "#body.rawSource"})
        lic = d.get("licenses") or d.get("license")
        if lic and vt is None:
            r.setdefault("licences", []).append({"v": lic, "src": f0})
        kh = "card-role:%s" % d.get("role")
        r["kindEvidence"].append(kh)
        if "Kenney Cube Pets" in json.dumps(lic or {}, ensure_ascii=False):
            r["kindEvidence"].append("lic:kenney-cube-pets")
        if "MonsterCuteCubes" in json.dumps(lic or {}, ensure_ascii=False):
            r["kindEvidence"].append("lic:quaternius-monstercutecubes")
    REG.card_resolved = resolved


WEAPON_RX = re.compile(r"sword|axe|rifle|blaster|minigun|staff|hammer|mace|shield|bow\b|dagger|club|spear|"
                       r"katana|shuriken|carbine|gun|pistol|wand|scythe|zweihaender|keule|schwert|axt|"
                       r"gewehr|karabiner|klinge|stab|schild|forke|pitchfork|knuckle", re.I)


# ----------------------------------------------------------------------------- S7 atlas residents
CASTJS = os.path.join(ATLAS, "data", "cast.js")


def js_str(block, key):
    m = re.search(r"\n    " + key + r":\s*'((?:[^'\\]|\\.)*)'", block)
    return m.group(1).replace("\\'", "'") if m else None


def js_list(block, key):
    m = re.search(r"\n    " + key + r":\s*\[(.*?)\]\s*,?\n", block, re.S)
    if not m:
        return []
    return [x.replace("\\'", "'") for x in re.findall(r"'((?:[^'\\]|\\.)*)'", m.group(1))]


def load_atlas_residents():
    s = read_text(CASTJS)
    src = rel(CASTJS)
    consts = dict(re.findall(r"const ([A-Z_0-9]+) = [^;\n]*?'([^']*)';", s))
    body = s[s.index("export const RESIDENTS"):]
    blocks = re.split(r"\n  \{\n    residentId:", body)[1:]
    REG.atlas_residents = []
    for b in blocks:
        rid = re.match(r"\s*'([^']+)'", b).group(1)
        info = {"residentId": rid, "name": js_str(b, "name"), "display": js_str(b, "display"),
                "townRole": js_str(b, "townRole"), "habitatIntent": js_str(b, "habitatIntent"),
                "activity": js_str(b, "activity"), "relationships": js_list(b, "relationships"),
                "actors": []}
        # primary actor + secondary actors (character GLBs in signatureProps with role 'Sozial / ...')
        for m in re.finditer(r"\{\s*(?:/\*.*?\*/\s*)*id:\s*'([^']+)',\s*(?:slot:\s*\d+,\s*)?role:\s*'([^']*)',\s*a:\s*([^,\n]+)", b, re.S):
            aid, role, aexpr = m.group(1), m.group(2), m.group(3).strip()
            if not (role.startswith("resident") or role.startswith("Sozial")):
                continue
            path = aexpr
            mm = re.match(r"([A-Z_0-9]+)\s*\+\s*'([^']*)'", aexpr)
            if mm:
                path = consts.get(mm.group(1), "") + mm.group(2)
            elif aexpr in consts:
                path = consts[aexpr]
            path = path.strip("'")
            if not re.search(r"\.(glb|gltf)$", path, re.I):
                continue
            if role.startswith("Sozial") and "character" not in path.lower() and base_of_path(path) not in REG.kit_index:
                continue
            info["actors"].append({"id": aid, "role": role, "path": path})
        hands = re.findall(r"\{ id: '([^']+)'[^\n]*?role: '([^']+)'[^\n]*?a: ([^,]+),[^\n]*hand:\s*\{\s*of:\s*'([^']+)'", b)
        info["handProps"] = [{"id": h[0], "role": h[1], "asset": h[2].strip(), "of": h[3]} for h in hands]
        REG.atlas_residents.append(info)
        # resolve actors
        resolved = []
        for a in info["actors"]:
            key = base_of_path(a["path"])
            cid = None
            ev = None
            if key and key in REG.kit_index:
                cid, kev = REG.kit_index[key]
                ev = "S7 actor asset basename %s (%s)" % (key, kev)
            if not cid:
                cid = REG.resolve(a["id"])
                ev = "S7 actor id" if cid else None
            if not cid and len(info["actors"]) == 1:
                cid = snake(rid)
                REG.ensure(cid, src, "S7:atlas-only")
                REG.add_alias(cid, cid, "S7 residentId %s (no kit/card match)" % rid)
                REG.add_label(cid, info["name"], src)
                ev = "S7 residentId"
            if not cid:
                REG.mark_unresolved("atlas:" + a["id"], [], "S7 actor without kit match", src)
                continue
            REG.scope("S7.actor", a["id"], cid)
            a["cid"] = cid
            resolved.append(cid)
            r = REG.ensure(cid, src, "S7")
            r["kindEvidence"].append("atlas:kit" if key and key in REG.kit_index else "atlas")
            r["dioramas"].append({"id": "atlas:" + rid, "role": a["role"],
                                  "note": info["townRole"], "src": src + "#RESIDENTS." + rid})
        uniq_res = sorted(set(resolved))
        if len(uniq_res) == 1:
            REG.scope("S7.residentId", rid, uniq_res[0])
            cid = uniq_res[0]
            r = REG.chars[cid]
            if info["townRole"]:
                note_field(cid, "story.inWorldRole", info["townRole"], src + "#RESIDENTS." + rid + ".townRole", "SOURCE")
            if info["habitatIntent"] and not info["habitatIntent"].lower().startswith("noch offen"):
                r["biome"].append({"v": info["habitatIntent"], "src": src + "#RESIDENTS." + rid + ".habitatIntent",
                                   "status": "PREFILL"})
            if info["activity"]:
                note_field(cid, "performance.activity", info["activity"], src + "#RESIDENTS." + rid + ".activity", "SOURCE")
            for rel_ in info["relationships"]:
                r["relationships"].append({"v": rel_, "src": src + "#RESIDENTS." + rid + ".relationships"})
            if info["display"]:
                REG.add_label(cid, info["display"], src)
        elif len(uniq_res) > 1:
            REG.mark_unresolved("atlas-resident:" + rid, uniq_res,
                                "S7 residentId groups several characters (multi-actor vignette)", src)
            REG.scope("S7.residentId", rid, uniq_res)
            for cid in uniq_res:
                for rel_ in info["relationships"]:
                    REG.chars[cid]["relationships"].append({"v": rel_, "src": src + "#RESIDENTS." + rid + ".relationships",
                                                            "note": "vignette-level statement (" + rid + ")"})
                if info["habitatIntent"] and not info["habitatIntent"].lower().startswith("noch offen"):
                    REG.chars[cid]["biome"].append({"v": info["habitatIntent"], "src": src + "#RESIDENTS." + rid + ".habitatIntent",
                                                    "status": "PREFILL", "note": "vignette-level (" + rid + ")"})
        for hp in info["handProps"]:
            owner = REG.scoped.get("S7.actor", {}).get(hp["of"])
            if owner and WEAPON_RX.search(hp["role"] + " " + hp["asset"]):
                REG.chars[owner]["weapons"].append({"v": hp["role"] + " · " + hp["asset"].split("/")[-1].strip("' "),
                                                    "src": src + "#RESIDENTS." + rid + ".signatureProps." + hp["id"],
                                                    "status": "PREFILL", "note": "hand prop matched weapon keyword"})
        # texture/state variants described as second actor of the same character
        for a in info["actors"]:
            if a.get("cid") and a["role"] != "resident" and len(info["actors"]) > 1:
                same = [x for x in info["actors"] if x.get("cid") == a["cid"]]
                if len(same) > 1:
                    REG.chars[a["cid"]]["variants"].append({"id": a["id"], "type": "look", "label": a["role"],
                                                           "asset": a["path"], "src": src + "#RESIDENTS." + rid})
        if rid == "animatronic":
            for cid in uniq_res:
                REG.chars[cid]["conflicts"].append(
                    "Atlas S7 animatronic: '%s' vs separate kit actors/voices in S6/S8" % (info["relationships"][0] if info["relationships"] else ""))


# ----------------------------------------------------------------------------- S9 atlas scene modules
SCENE_MODULES = ["graveyard-01", "resident-disco-01", "scifi-pack-01", "resident-band-module-01",
                 "gunfight-duel-01", "fight-sandbox-02"]


def load_scene_modules():
    for name in SCENE_MODULES:
        f = os.path.join(ATLAS, "data", name + ".json")
        d = load_json(f)
        src = rel(f)
        sid = d.get("id")
        entries = []
        if isinstance(d.get("cast"), list):
            for x in d["cast"]:
                p = (x.get("asset") or {}).get("path") if isinstance(x.get("asset"), dict) else x.get("path") or x.get("astronaut")
                entries.append((x.get("id"), x.get("label"), x.get("role") or x.get("label"), p, "cast"))
        for key in ("actors", "fighters"):
            if isinstance(d.get(key), dict):
                for k, x in d[key].items():
                    p = (x.get("asset") or {}).get("path")
                    entries.append((k, x.get("label"), x.get("label") if key == "actors" else "fighter", p, key))
        for lid, label, role, p, key in entries:
            k = base_of_path(p)
            cid = None
            if k and k in REG.kit_index:
                cid = REG.kit_index[k][0]
            if not cid and k:
                # Quaternius astronauts: 'Characters/GLTF/Astronaut_X.gltf'
                cid = REG.resolve(k)
            if not cid and label:
                ml = main_label(label).lower()
                if ml in REG.label_index and len(REG.label_index[ml]) == 1:
                    cid = next(iter(REG.label_index[ml]))
            if not cid and lid:
                cid = REG.resolve(lid)
            if not cid:
                REG.mark_unresolved("%s:%s" % (sid, lid), [], "S9 scene-local id without kit/label match", src)
                continue
            REG.scope("S9." + sid, lid, cid)
            r = REG.chars[cid]
            r["dioramas"].append({"id": sid, "role": role, "localId": lid, "src": src + "#" + key + "." + str(lid)})
            if label and " · " in label:
                r["variants"].append({"id": "%s_%s" % (sid, lid), "type": "scene_variant", "label": label,
                                      "src": src + "#" + key + "." + str(lid)})
        if name == "gunfight-duel-01":
            for wk, wv in (d.get("weapons") or {}).items():
                pass


# ----------------------------------------------------------------------------- S10 scenelets
def load_scenelets():
    for f in sorted(glob.glob(os.path.join(H, "65_SCENELETS", "*", "concept.json"))):
        d = load_json(f)
        src = rel(f)
        scene = d.get("scene") or os.path.basename(os.path.dirname(f))
        for tok in d.get("cast") or []:
            head = tok.split(" (")[0].strip()
            for part in head.split("|"):
                lid = part.split(" ")[0].strip()
                if not re.match(r"^[a-z0-9_]+$", lid):
                    continue
                cid = REG.scoped.get("S9." + scene, {}).get(lid) or REG.resolve(lid)
                if not cid:
                    REG.mark_unresolved("concept:%s:%s" % (scene, lid), [], "S10 concept cast token not resolvable", src)
                    continue
                REG.chars[cid]["dioramas"].append({"id": scene, "role": tok, "src": src + "#cast"})
    idx = os.path.join(R, "BUEHNE_R2", "scenelets", "index.json")
    items = load_json(idx).get("items", [])
    for it in items:
        f = os.path.join(R, "BUEHNE_R2", it["file"])
        if not os.path.exists(f):
            continue
        d = load_json(f)
        src = rel(f)
        pal = (d.get("palette") or {}).get("entry")
        for a in d.get("actors") or []:
            cid = None
            cp = os.path.join(R, "BUEHNE_R2", a.get("card") or "")
            if a.get("card") and os.path.exists(cp):
                cid = REG.resolve(load_json(cp).get("id"))
            cid = cid or REG.resolve(a.get("asset"))
            if cid:
                REG.scope("S10." + it["id"], a.get("id"), cid)
            if not cid:
                REG.mark_unresolved("scenelet:%s:%s" % (it["id"], a.get("id")), [], "S10 scenelet actor not resolvable", src)
                continue
            r = REG.chars[cid]
            r["dioramas"].append({"id": it["id"], "role": a.get("role") or a.get("clip"), "localId": a.get("id"),
                                  "note": a.get("note"), "src": src + "#actors." + str(a.get("id"))})
            if pal:
                r["biome"].append({"v": pal, "src": src + "#palette.entry", "status": "PREFILL",
                                   "note": "scenelet palette (marked Vorschlag in source)"})
            if a.get("clip"):
                r["animations"].append({"v": [a["clip"]], "src": src + "#actors." + str(a.get("id")) + ".clip"})


# ----------------------------------------------------------------------------- S6 voice casting
VOICE = os.path.join(R, "voice_casting.r1.json")


def load_voice():
    d = load_json(VOICE)
    src = rel(VOICE)
    eng = (d.get("engine") or {}).get("name")
    for v in d.get("figures", []):
        fid = v["figureId"]
        cid = REG.resolve(fid)
        if not cid:
            if "keine Figur" in (v.get("rigClass") or ""):
                REG.excluded[fid] = {"reason": "voice casting rigClass '%s' (narrator, not a figure)" % v.get("rigClass"),
                                     "source": src}
                continue
            cid = kebab_to_snake(fid)
            REG.ensure(cid, src, "S6")
            REG.add_alias(cid, cid, "S6 figureId " + src)
        REG.add_alias(fid, cid, "S6 figureId " + src)
        r = REG.chars[cid]
        r["voice"] = (v, src, eng)
        REG.add_label(cid, v.get("name"), src)
        r["kindEvidence"].append("voice-tier:" + str(v.get("tier")))
        gl = (v.get("goldenLine") or {}).get("source")
        if gl:
            m = re.match(r"TRIPLET_SETS_R2/([a-z0-9_]+)\s*#(\d+)", gl)
            if m:
                r["songs"].append({"id": m.group(1), "role": "golden line source (card #%s)" % m.group(2),
                                   "file": rel(os.path.join(R, "TRIPLET_SETS_R2", m.group(1) + ".suno.txt")),
                                   "src": src + "#figures[%s].goldenLine" % fid})


# ----------------------------------------------------------------------------- S15 / B46 / pets
def load_pets():
    d = load_json(PETS_V5)
    src = rel(PETS_V5)
    for p in d.get("pets", []):
        pid = p["id"]
        cid = REG.resolve_loose(p.get("name"))
        if cid:
            REG.scope("S17.pet", pid, cid)
            REG.chars[cid]["profileRefs"].append({"path": src, "pointer": "pets[id=%s]" % pid,
                                                  "kind": "pet-studio profile", "sha256": sha256(PETS_V5)})
            if p.get("archetype"):
                note_field(cid, "personality.petArchetype", p["archetype"], src + "#pets." + pid + ".archetype", "SOURCE")
            continue
        cid = snake(base_of_path(p.get("glb")) or pid)
        r = REG.ensure(cid, src, "pet")
        REG.add_alias(cid, cid, "S17 pet glb %s" % p.get("glb"))
        REG.scope("S17.pet", pid, cid)
        REG.add_label(cid, p.get("name"), src)
        r["displayName"] = r["displayName"] or p.get("name")
        r["profileRefs"].append({"path": src, "pointer": "pets[id=%s]" % pid, "kind": "pet-studio profile",
                                 "sha256": sha256(PETS_V5)})
        if p.get("archetype"):
            note_field(cid, "personality.archetype.petArchetype", p["archetype"], src + "#pets." + pid + ".archetype", "SOURCE")
        if p.get("narratorPromptRef"):
            note_field(cid, "dialogue.narratorPromptRef", p["narratorPromptRef"], src + "#pets." + pid + ".narratorPromptRef", "SOURCE")
    profiles = [os.path.join(R, "actors", "frizzlebob.georg-2026-10-14.kfb-pets.json")]
    profiles += sorted(glob.glob(os.path.join(R, "E2_ATTACH_R1", "assets", "*kfb-pets*.json")))
    profiles += sorted(glob.glob(os.path.join(R, "TOOLBOX_SOURCE_CUT_2026-10-14_r1", "data", "kfb-pet-frizzlebob-earrig-v5*.json")))
    for f in profiles:
        if not os.path.exists(f):
            continue
        d = load_json(f)
        meta = d.get("meta") or {}
        actor = meta.get("actor") or (meta.get("roster") or {}).get("id")
        b = os.path.basename(f)
        cid = None
        if actor:
            cid = REG.resolve(actor)
        if not cid:
            for cand in ("frizzlebob", "ladydory", "lordhunky"):
                if b.startswith(cand) or ("-" + cand + "-") in b:
                    cid = REG.resolve(cand)
                    break
        if not cid:
            REG.mark_unresolved("profile:" + b, [], "S16 kfb-pets profile owner unclear", rel(f))
            continue
        REG.chars[cid]["profileRefs"].append({"path": rel(f), "kind": "kfb.pets/1 face profile", "sha256": sha256(f)})


# ----------------------------------------------------------------------------- chatter (S13)
CHATTER = os.path.join(R, "CHATTERBOX_SPEC_R2.md")
FAMILY_RX = {"Bots": re.compile(r"\bbot\b|robot|bot_", re.I), "Aliens": re.compile(r"alien", re.I),
             "Geister": re.compile(r"ghost|geist", re.I), "Skelette": re.compile(r"skeleton|skelett", re.I),
             "Magic Girls": re.compile(r"magical.girl", re.I)}


def load_chatter():
    lines = read_text(CHATTER).splitlines()
    src = rel(CHATTER)
    sect = None
    header_cols = []
    for i, ln in enumerate(lines, 1):
        if ln.startswith("## "):
            sect = ln
        if not ln.startswith("|") or set(ln.replace("|", "").strip()) <= set("-: "):
            continue
        cells = [c.strip() for c in ln.strip().strip("|").split("|")]
        if sect and sect.startswith("## 2"):
            if cells[0].startswith("Kern"):
                header_cols = cells
                continue
            row = cells[0]
            for ci, cell in enumerate(cells[1:], 1):
                for part in cell.split(","):
                    m = re.match(r"\s*(.+?)\s*\(([^)]+)\)\s*$", part)
                    if not m:
                        continue
                    instr, who = m.group(1), m.group(2)
                    col = header_cols[ci] if ci < len(header_cols) else ""
                    family = "%s · %s" % (row, col)
                    assign_chatter(who, instr, family, None, "%s:%d" % (src, i))
        if sect and sect.startswith("## 3") and len(cells) == 2 and cells[0] != "Figur":
            assign_chatter(cells[0], None, None, cells[1], "%s:%d" % (src, i))


def assign_chatter(who, instrument, family, style, src):
    cid = REG.resolve_loose(who)
    if not cid and who.lower() in REG.label_index and len(REG.label_index[who.lower()]) == 1:
        cid = next(iter(REG.label_index[who.lower()]))
    targets = []
    tag = "SOURCE"
    if cid:
        targets = [cid]
    elif who in FAMILY_RX:
        rx = FAMILY_RX[who]
        tag = "PREFILL"
        for c, r in REG.chars.items():
            hay = " ".join([c] + r["labels"])
            if rx.search(hay):
                targets.append(c)
    else:
        REG.notes.append("chatter target '%s' (%s) not resolved" % (who, src))
        return
    for c in targets:
        ch = REG.chars[c]["chatter"]
        if instrument:
            ch.setdefault("instrument", []).append({"v": instrument, "src": src, "status": tag})
            ch.setdefault("family", []).append({"v": family if cid else who, "src": src, "status": tag})
        if style:
            ch.setdefault("style", []).append({"v": style, "src": src, "status": tag,
                                               "note": None if cid else "family row '%s'" % who})


# ----------------------------------------------------------------------------- lore / songs scan
LORE_FILES = ["VOICE_CASTING_R1.md", "SONG_SPEC_R3.md", "SUNO_NEXT_DECKS_R1.md", "TRIPLET_METHOD_FROM_WRINKLE_R1.md",
              "BRIEF_WSA_WRITERS_ROOM_PLUGIN_R1.md", "WSA_WRITERS_ROOM_JSON_FIRST_REALIGNMENT_FOR_WS0_2026-10-16.md",
              "CHATTERBOX_VOICE_KONZEPT_R1.md", "CHATTERBOX_SPEC_R2.md", "RESEARCH_FLUFF_LINGUISTICS_R1.md",
              "WS0_GLOBAL_INTENT_ROLE_CONSCIOUS_RESIDENTS_R1_2026-10-15.md", "WORLD_CONCEPT_R1.md", "GAME_LOOP_R1.md"]
HINTS = [
    ("speech", re.compile(r"\b(stimme|stimmen|voice|spricht|sprech\w*|speech|register|tonfall|dialekt|lexikon|"
                          r"catchphrase\w*|interjection\w*|fluff-o-lect|vokal\w*|sagt|says|ton|tone)\b", re.I)),
    ("quirks", re.compile(r"\b(quirk\w*|marotte\w*|tick|eigenart\w*|gewohnheit\w*|habit\w*|liebt|hasst|always|never|"
                          r"immer|niemals)\b", re.I)),
    ("story", re.compile(r"\b(story|lore|hintergrund|backstory|herkunft|geschichte|biografie|kanon|canon|"
                         r"welt|world|genesis|ehemalige\w*|former)\b", re.I)),
]
FILE_HINT = {"VOICE_CASTING_R1.md": "speech", "CHATTERBOX_SPEC_R2.md": "speech",
             "CHATTERBOX_VOICE_KONZEPT_R1.md": "speech"}
GENERIC_PATTERNS = {"orc", "monster", "brute", "the mummy", "kaykit mummy", "the cat", "the fox", "the dog",
                    "the pig", "the cow", "the bee", "the fish", "the lion", "the deer", "the crab", "the chick",
                    "driver", "figure", "the hero", "hero", "knight", "mage", "rogue", "ranger", "warrior",
                    "minion", "soldier", "teen", "mc", "demon", "avian", "agent", "guide", "the twin",
                    "the ceo", "the forgotten", "janitor", "mech", "helper a", "helper b", "action figure"}


def char_patterns():
    pats = {}
    for cid, r in REG.chars.items():
        if any(k.startswith("pet") for k in r["kindEvidence"]) and not r["seed"]:
            continue
        cand = set(r["labels"]) | set(r["aliases"])
        if r["seed"]:
            cand.add(r["seed"]["identity"]["name"]["v"])
        out = set()
        for s in cand:
            if not isinstance(s, str):
                continue
            s = main_label(s)
            if not s or s.lower() in GENERIC_PATTERNS:
                continue
            if re.match(r"^[a-z0-9_\-]+$", s) and len(s) < 6:
                continue
            if len(s) < 4 and not (s.isupper() and len(s) >= 2):
                continue
            out.add(s)
        for s in out:
            pats.setdefault(s, set()).add(cid)
    # drop patterns that point to more than one character
    good = {}
    for s, cs in pats.items():
        if len(cs) == 1:
            good[s] = next(iter(cs))
    compiled = []
    for s, cid in sorted(good.items(), key=lambda x: -len(x[0])):
        flags = 0 if (s.isupper() or len(s) < 5) else re.I
        compiled.append((re.compile(r"(?<![A-Za-z0-9_])" + re.escape(s) + r"(?![A-Za-z0-9_])", flags), cid, s))
    return compiled


def scan_text_file(path, compiled, max_per_char=25, song=None):
    if not os.path.exists(path):
        return
    lines = read_text(path).splitlines()
    heading = ""
    counts = {}
    src = rel(path)
    for i, ln in enumerate(lines, 1):
        if ln.startswith("#"):
            heading = ln.lstrip("# ").strip()
        text = ln.strip()
        if not text or len(text) < 8:
            continue
        hit = set()
        for rx, cid, s in compiled:
            if cid in hit:
                continue
            if rx.search(text):
                hit.add(cid)
        for cid in hit:
            counts[cid] = counts.get(cid, 0) + 1
            if song:
                REG.chars[cid]["songs"].append({"id": song, "role": "mentioned", "file": src, "line": i,
                                                "text": text[:300], "src": "%s:%d" % (src, i)})
                continue
            if counts[cid] > max_per_char:
                continue
            item = {"text": text[:500], "file": src, "line": i, "heading": heading}
            hint = FILE_HINT.get(os.path.basename(path))
            for name, rx in ([] if hint else HINTS):
                if rx.search(text) or rx.search(heading):
                    hint = name
                    break
            r = REG.chars[cid]
            if hint == "speech":
                r["speech"].append(item)
            elif hint == "quirks":
                r["quirks"].append(item)
            elif hint == "story":
                r["lore"].append(dict(item, hint="story"))
            else:
                r["lore"].append(item)


def load_lore_and_songs():
    compiled = char_patterns()
    for f in LORE_FILES:
        scan_text_file(os.path.join(R, f), compiled)
    for f in sorted(glob.glob(os.path.join(R, "TRIPLET_SETS_R2", "*.md"))) + \
            sorted(glob.glob(os.path.join(R, "TRIPLET_SETS_R2", "batch8_ws0_intake", "*.md"))):
        scan_text_file(f, compiled)
    # deck songs: DECK.txt + RETURN.md per suno run
    for d in sorted(glob.glob(os.path.join(H, "40_AUDIO", "*__suno_*"))):
        deck = os.path.basename(d).split("__suno_")[0]
        for fn in ("DECK.txt", "RETURN.md"):
            scan_text_file(os.path.join(d, fn), compiled, song=deck)
        for pf in sorted(glob.glob(os.path.join(d, "performance", "*.performance.json"))):
            pd = load_json(pf)
            for ch in pd.get("characters") or []:
                cid = REG.resolve_loose(ch.get("id"))
                if not cid:
                    REG.mark_unresolved(ch.get("id"), [], "performance character not resolvable", rel(pf))
                    continue
                REG.chars[cid]["songs"].append({"id": pd.get("deckId") or deck, "song": pd.get("songId"),
                                                "role": ch.get("role"), "file": rel(pf),
                                                "src": rel(pf) + "#characters." + ch["id"]})
    # deck card names that are a character name/alias -> songs (card)
    REG.deck_cards = {}
    for f in sorted(glob.glob(os.path.join(R, "TRIPLET_SETS_R2", "*.hub.json"))):
        if re.search(r"\.v\d\.", os.path.basename(f)):
            continue
        deck = os.path.basename(f).split(".")[0]
        try:
            cards = load_json(f)
        except Exception:
            continue
        names = []
        for c in cards if isinstance(cards, list) else []:
            if isinstance(c, dict) and isinstance(c.get("card"), dict):
                names.append((c.get("cardNumber"), c["card"].get("name"), c["card"].get("lore")))
        REG.deck_cards[deck] = (rel(f), names)
        for num, nm, lore in names:
            if not nm:
                continue
            base = re.split(r"'s |\s\(", nm)[0].strip()
            cid = REG.resolve(nm) or REG.resolve(base)
            if not cid:
                ml = base.lower()
                if ml in REG.label_index and len(REG.label_index[ml]) == 1 and ml not in GENERIC_PATTERNS:
                    cid = next(iter(REG.label_index[ml]))
                    if "pet" in REG.chars[cid]["kindEvidence"] and not REG.chars[cid]["seed"]:
                        cid = None  # generic pet names ('The Elephant') are not evidence
            if cid:
                REG.chars[cid]["songs"].append({"id": deck, "role": "card #%s '%s'" % (num, nm), "file": rel(f),
                                                "src": rel(f) + "#cardNumber=%s" % num})
                if lore:
                    REG.chars[cid]["lore"].append({"text": lore, "file": rel(f), "line": None,
                                                   "heading": "deck %s card #%s %s" % (deck, num, nm), "hint": "story"})
    # FrizzleBob voice skill (read-only)
    skill = None
    if os.path.isdir(SKILL_ROOT):
        for p in sorted(glob.glob(os.path.join(SKILL_ROOT, "**", "frizzlebob-kayfabizarro", "SKILL.md"), recursive=True)):
            skill = p
            break
    REG.skill_path = skill
    if skill and "frizzlebob" in REG.chars:
        lines = read_text(skill).splitlines()
        for i, ln in enumerate(lines, 1):
            if ln.startswith("### Mode"):
                nxt = ""
                for j in range(i, min(i + 6, len(lines))):
                    if lines[j].strip() and not lines[j].startswith("#"):
                        nxt = lines[j].strip()
                        break
                REG.chars["frizzlebob"]["speech"].append({"text": ln.lstrip("# ").strip() + (" :: " + nxt if nxt else ""),
                                                          "file": rel(skill), "line": i, "heading": "The Modes",
                                                          "tag": "SOURCE"})
            if ln.startswith("- **") and i < 60:
                REG.chars["frizzlebob"]["speech"].append({"text": ln.strip(), "file": rel(skill), "line": i,
                                                          "heading": "Layer Zero · Hard constraints", "tag": "SOURCE"})


# ----------------------------------------------------------------------------- Dramatis Personae
DP_DIR = os.path.join(R, "WSA_DRAMATIS_PERSONAE_R1_SOURCE")
DP_CACHE = os.path.join(DP_DIR, "data", "dramatis-personae-cache.json")


def load_dp():
    d = load_json(DP_CACHE)
    REG.dp_meta = {"commit": d.get("commit"), "branch": d.get("branch"), "basePath": d.get("basePath"),
                   "src": rel(DP_CACHE)}
    chars = {c.get("id") for c in d.get("characters", [])}
    figs = {f.get("id") for f in d.get("figures", [])}
    voices = {v.get("figureId", "").replace("-", "_") for v in (d.get("voice") or {}).get("figures", [])}
    REG.dp_ids = sorted(chars | figs)
    for i in sorted(chars | figs):
        cid = REG.resolve_loose(i)
        if not cid:
            REG.mark_unresolved("dp:" + i, [], "Dramatis Personae id not in registry", rel(DP_CACHE))
            continue
        REG.chars[cid]["dp"] = {"present": True, "cacheId": i, "characterSheet": i in chars,
                                "figureCard": i in figs, "voiceMatch": i in voices,
                                "cacheCommit": d.get("commit"), "src": rel(DP_CACHE)}


# ----------------------------------------------------------------------------- kind
def decide_kind(cid, r):
    ev = r["kindEvidence"]
    s1tier = r["seed"]["identity"]["tier"]["v"] if r["seed"] else ""
    roles = [e.split(":", 1)[1] for e in ev if e.startswith("card-role:")]
    labels = " ".join(r["labels"])
    plant_rx = re.compile(r"cactus|kaktus|tree|baum|mushroom|pilz", re.I)
    if "main" in (s1tier or "") or "voice-tier:main" in ev:
        return "hero", "S1 tier '%s' / S6 tier main" % s1tier
    if "prop_character" in roles or "prop-actor" in (s1tier or ""):
        return "prop_character", "card role prop_character / S1 tier prop-actor"
    if "lic:quaternius-monstercutecubes" in ev:
        if plant_rx.search(cid + " " + labels):
            return "plant", "Quaternius MonsterCuteCubes plant species (cactus/tree/mushroom)"
        return "cube_pet", "Quaternius MonsterCuteCubes cube species"
    if "lic:kenney-cube-pets" in ev:
        return "cube_pet", "Kenney Cube Pets licence"
    if "pet" in ev:
        return "pet", "S17 kfb-pets.v5 pet"
    if re.search(r"Trupp|Squad", labels):
        return "faction_unit", "label names a squad/troop"
    if r.get("kit") or any(e in ("atlas:kit",) for e in ev) or r.get("castEntry", {}).get("ra_paths"):
        return "kit_character", "KayKit/Quaternius kit actor (S8/S4 ra_paths/S7)"
    if any(x.startswith("S3") or x.startswith("card-role") for x in ev):
        return "custom_rig", "own figure card without kit identity"
    return "npc", "no figure card and no kit identity"


# ----------------------------------------------------------------------------- figure refs
def figure_refs(cid, r):
    refs = []
    files = r["figureFiles"]
    if not files:
        return refs
    cast_card = None
    ce = r.get("castEntry")
    if ce and ce.get("card"):
        cast_card = os.path.join(H, strip_dropbox(ce["card"]))
    s2 = [f for f in files if f["src"] == "S2"]
    canonical_path = None
    if s2:
        canonical_path = s2[0]["path"]
    elif cast_card and os.path.exists(cast_card):
        canonical_path = cast_card
    by_id = {}
    for f in files:
        by_id.setdefault(f["id"], []).append(f)

    def primary(group):
        def score(f):
            p = f["path"]
            b = os.path.basename(p)
            return (("/_work/" in p) or ("_privat" in p), "vor_" in b, "pose" in b, "/scenelet" in p or "BUEHNE" in p,
                    "/data/kfb/" in p, len(p), p)
        return sorted(group, key=score)[0]

    main_ids = [i for i, g in by_id.items() if not any(x.get("variantType") for x in g)]
    if not canonical_path:
        cand = [primary(by_id[i]) for i in sorted(main_ids)] or [primary(g) for g in by_id.values()]
        canonical_path = sorted(cand, key=lambda f: f["path"])[0]["path"]
    for cid_card, group in sorted(by_id.items()):
        p0 = primary(group)
        for f in sorted(group, key=lambda x: x["path"]):
            p = f["path"]
            b = os.path.basename(p)
            if p == canonical_path:
                kind = "canonical"
            elif f is not p0:
                kind = "pose" if ("pose" in b or "proof" in b) else "duplicate"
            else:
                vt = f.get("variantType")
                if vt in ("pose",):
                    kind = "pose"
                elif vt in ("state", "look", "texture"):
                    kind = "state"
                elif vt in ("revision",):
                    kind = "duplicate"
                elif "pose" in b or "proof" in b:
                    kind = "pose"
                else:
                    kind = "scene_variant"
            refs.append({"path": rel(p), "sha256": sha256(p), "kind": kind, "cardId": cid_card})
    return refs


# ----------------------------------------------------------------------------- record assembly
def collapse(items):
    """list of {v,src,status} -> leaf (single) or merged list leaf."""
    items = uniq(items)
    if not items:
        return None
    if len(items) == 1:
        return items[0]
    vals = []
    srcs = []
    status = "SOURCE"
    for it in items:
        v = it["v"]
        if isinstance(v, list):
            vals.extend(v)
        else:
            vals.append(v)
        srcs.append(it["src"])
        if it.get("status") == "PREFILL":
            status = "PREFILL"
    return {"v": uniq(vals), "src": "; ".join(uniq(srcs)), "status": status}


def set_leaf(rec, path, lf, prov, seed_filled):
    """Write leaf unless the seed already has it filled (then -> additions)."""
    if lf is None:
        return
    if path in seed_filled:
        rec.setdefault("additions", {}).setdefault(path, []).append(lf)
        prov["additions." + path] = {"source": lf["src"], "tag": lf["status"]}
        return
    parts = path.split(".")
    cur = rec
    for p in parts[:-1]:
        cur = cur.setdefault(p, {})
    cur[parts[-1]] = lf
    prov[path] = {"source": lf["src"], "tag": lf["status"]}


def seed_filled_paths(seed):
    out = set()

    def walk(o, pre):
        if isinstance(o, dict) and "v" in o and ("status" in o or "src" in o):
            if is_filled_leaf(o):
                out.add(pre)
            return
        if isinstance(o, dict):
            for k, v in o.items():
                walk(v, pre + "." + k if pre else k)
    for sec in ("identity", "story", "personality", "dialogue", "cards", "memory", "appearance", "performance", "voice"):
        walk(seed.get(sec), sec)
    return out


def seed_provenance(seed, prov):
    def walk(o, pre):
        if isinstance(o, dict) and "v" in o and ("status" in o or "src" in o):
            if is_filled_leaf(o):
                prov[pre] = {"source": "%s (seed; src %s)" % (REG.chars[seed["id"]]["seedPath"], o.get("src")),
                             "tag": "GEORG" if o.get("status") == "GEORG" else
                             ("PREFILL" if o.get("status") in ("PREFILL", "DESIGN") else "SOURCE"),
                             "seedStatus": o.get("status")}
            return
        if isinstance(o, dict):
            for k, v in o.items():
                walk(v, pre + "." + k if pre else k)
    for sec in ("identity", "story", "personality", "dialogue", "cards", "memory", "appearance", "performance", "voice"):
        walk(seed.get(sec), sec)


def statements_leaf(items, default_tag="PREFILL"):
    items = uniq(items)
    if not items:
        return None
    tag = default_tag
    if all(it.get("tag") == "SOURCE" for it in items):
        tag = "SOURCE"
    clean = [{k: v for k, v in it.items() if k not in ("tag", "hint")} for it in items]
    srcs = uniq(["%s:%s" % (it["file"], it["line"]) if it.get("line") else it["file"] for it in items])
    return {"v": clean, "src": "; ".join(srcs[:12]) + (" (+%d)" % (len(srcs) - 12) if len(srcs) > 12 else ""),
            "status": tag}


def build_record(cid, r):
    seed = r["seed"]
    rec = json.loads(json.dumps(seed)) if seed else {}
    prov = {}
    filled = set()
    if seed:
        filled = seed_filled_paths(seed)
        seed_provenance(seed, prov)
        prov["_seedProvenanceCS"] = seed.get("provenance")
        rec.pop("provenance", None)
    rec["schema"] = SCHEMA
    if seed:
        rec["seedSchema"] = seed.get("schema")
    rec["id"] = cid
    rec.setdefault("status", "draft-r1")
    kind, kind_ev = decide_kind(cid, r)
    rec["kind"] = kind
    prov["kind"] = {"source": kind_ev, "tag": "PREFILL"}
    # identity
    rec.setdefault("identity", {})
    labels = r["labels"]
    if not seed:
        nm = None
        nsrc = None
        ce = r.get("castEntry")
        if r.get("kitLabel"):
            nm, nsrc = r["kitLabel"]
        if not nm and r.get("voice"):
            nm, nsrc = r["voice"][0].get("name"), r["voice"][1] + "#figures[%s].name" % r["voice"][0]["figureId"]
        if not nm and ce and ce.get("label"):
            nm, nsrc = main_label(ce["label"]), rel(CAST) + "#actors.%s.label" % cid
        if not nm and r["displayName"]:
            nm, nsrc = main_label(r["displayName"]), "figure card displayName (" + (rel(r["figureFiles"][0]["path"]) if r["figureFiles"] else "?") + ")"
        if not nm and labels:
            nm, nsrc = main_label(labels[0]), r["sources"][0]
        set_leaf(rec, "identity.name", leaf(nm, nsrc, "SOURCE") if nm else None, prov, filled)
        if r["displayName"]:
            src_dn = rel(r["figureFiles"][0]["path"]) + "#displayName" if r["figureFiles"] else r["sources"][0]
            set_leaf(rec, "identity.displayName", leaf(r["displayName"], src_dn, "SOURCE"), prov, filled)
        for p in ("identity.name", "identity.displayName"):
            pass
    al = sorted(set(a for a in r["aliases"] if a != cid))
    rec["aliases"] = al
    prov["aliases"] = {"source": "aliases.json (evidence per alias)", "tag": "SOURCE"}
    if not seed:
        rec["identity"].setdefault("aliases", leaf(al, "aliases.json", "SOURCE") if al else todo_leaf())
    # story
    rec.setdefault("story", {})
    if r["story"]:
        set_leaf(rec, "story.sceneNotes", collapse([{"v": s["v"], "src": s["src"], "status": "SOURCE"} for s in r["story"]]),
                 prov, filled)
    for path, items in sorted(r["fieldsFrom"].items()):
        set_leaf(rec, path, collapse(items), prov, filled)
    story_stmts = [x for x in r["lore"] if x.get("hint") == "story"]
    other = [x for x in r["lore"] if x.get("hint") != "story"]
    set_leaf(rec, "story.loreStatements", statements_leaf(story_stmts), prov, filled)
    rec.setdefault("lore", {})
    set_leaf(rec, "lore.mentions", statements_leaf(other), prov, filled)
    if r["baseModel"]:
        set_leaf(rec, "appearance.baseModel", collapse([dict(b, status="SOURCE") for b in r["baseModel"]]), prov, filled)
    # personality / dialogue
    rec.setdefault("personality", {})
    set_leaf(rec, "personality.quirks", statements_leaf(r["quirks"]), prov, filled)
    rec.setdefault("dialogue", {})
    set_leaf(rec, "dialogue.speechPatterns", statements_leaf(r["speech"]), prov, filled)
    # voice
    if r.get("voice"):
        v, vsrc, eng = r["voice"]
        tag = "GEORG" if "Georg PASS" in (v.get("reason") or "") else "SOURCE"
        base = vsrc + "#figures[%s]" % v["figureId"]
        set_leaf(rec, "voice.engine", leaf(eng, vsrc + "#engine.name", "SOURCE"), prov, filled)
        set_leaf(rec, "voice.spec", leaf(v.get("voiceSpec"), base + ".voiceSpec", tag), prov, filled)
        set_leaf(rec, "voice.speed", leaf(v.get("speed"), base + ".speed", tag), prov, filled)
        set_leaf(rec, "voice.lang", leaf(v.get("lang"), base + ".lang", tag), prov, filled)
        if v.get("goldenLine"):
            set_leaf(rec, "voice.goldenLine", leaf(v["goldenLine"].get("text"), base + ".goldenLine", "SOURCE"), prov, filled)
        if v.get("reason"):
            set_leaf(rec, "voice.castingReason", leaf(v["reason"], base + ".reason", "SOURCE"), prov, filled)
        if v.get("file"):
            set_leaf(rec, "voice.sampleFile", leaf(v["file"], base + ".file", "SOURCE"), prov, filled)
    elif r.get("figureVoice"):
        fv, fsrc = r["figureVoice"]
        if isinstance(fv, dict) and fv.get("spec"):
            set_leaf(rec, "voice.spec", leaf(fv.get("spec"), fsrc + "#voice.spec", "SOURCE"), prov, filled)
            set_leaf(rec, "voice.engine", leaf(fv.get("engine"), fsrc + "#voice.engine", "SOURCE"), prov, filled)
    rec.setdefault("voice", {})
    # chatter
    ch = r["chatter"]
    chat = {}
    for k in ("family", "instrument", "style"):
        lf = collapse(ch.get(k, []))
        chat[k] = lf if lf else todo_leaf()
        if lf:
            prov["chatter." + k] = {"source": lf["src"], "tag": lf["status"]}
    rec["chatter"] = chat
    # preferences
    rec["preferences"] = {
        "weapons": collapse([{"v": w["v"], "src": w["src"], "status": w.get("status", "SOURCE")} for w in r["weapons"]]) or todo_leaf(),
        "biome": collapse([{"v": b["v"], "src": b["src"], "status": b.get("status", "PREFILL")} for b in r["biome"]]) or todo_leaf(),
    }
    for k in ("weapons", "biome"):
        if is_filled_leaf(rec["preferences"][k]):
            prov["preferences." + k] = {"source": rec["preferences"][k]["src"], "tag": rec["preferences"][k]["status"]}
    # dioramas / songs / variants
    rec["dioramas"] = uniq(r["dioramas"])
    if rec["dioramas"]:
        prov["dioramas"] = {"source": "; ".join(uniq([d["src"].split("#")[0] for d in rec["dioramas"]])), "tag": "SOURCE"}
    rec["songs"] = uniq(r["songs"])
    if rec["songs"]:
        prov["songs"] = {"source": "; ".join(uniq([s["file"] for s in rec["songs"]])),
                         "tag": "PREFILL" if any(s["role"] == "mentioned" for s in rec["songs"]) else "SOURCE"}
    rec["variants"] = uniq(r["variants"])
    if rec["variants"]:
        prov["variants"] = {"source": "; ".join(uniq([v["src"].split("#")[0] for v in rec["variants"]])), "tag": "SOURCE"}
    # memory
    rec.setdefault("memory", {})
    if r["relationships"]:
        set_leaf(rec, "memory.relationships",
                 collapse([{"v": x["v"], "src": x["src"], "status": "SOURCE"} for x in r["relationships"]]), prov, filled)
    if r["conflicts"]:
        rec.setdefault("conflicts", [])
        for c in r["conflicts"]:
            if c not in rec["conflicts"]:
                rec["conflicts"].append(c)
    # appearance
    rec.setdefault("appearance", {})
    refs = figure_refs(cid, r)
    rec["appearance"]["figureRefs"] = refs
    if refs:
        prov["appearance.figureRefs"] = {"source": "figure card files (sha256 at build time)", "tag": "SOURCE"}
    rec["appearance"]["profileRefs"] = uniq(r["profileRefs"])
    if r.get("kitPath"):
        kp, ksrc, rig = r["kitPath"]
        set_leaf(rec, "appearance.kitModel", leaf({"path": kp, "rigClass": rig}, ksrc, "SOURCE"), prov, filled)
    if r.get("licences"):
        set_leaf(rec, "appearance.licences", collapse([dict(x, status="SOURCE") for x in r["licences"]]), prov, filled)
    # performance
    rec.setdefault("performance", {})
    anim = collapse([{"v": a["v"], "src": a["src"], "status": "SOURCE"} for a in r["animations"]])
    if anim:
        set_leaf(rec, "performance.animations", anim, prov, filled)
    # views
    rec["views"] = {"dramatis_personae": r["dp"] or {"present": False, "cacheId": None,
                                                    "src": REG.dp_meta["src"]}}
    # sources
    rec["sourcesRead"] = sorted(set(r["sources"]))
    # todo / counts
    status = {}
    for path, label in WANTED:
        status[path] = "filled" if field_filled(rec, path) else "todo"
    rec["fieldStatus"] = status
    rec["todoFields"] = [p for p, s in status.items() if s == "todo"]
    for p in rec["todoFields"]:
        prov.setdefault(p, {"source": None, "tag": "todo"})
    rec["provenance"] = dict(sorted(prov.items()))
    return rec


def get_path(rec, path):
    cur = rec
    for p in path.split("."):
        if not isinstance(cur, dict) or p not in cur:
            return None
        cur = cur[p]
    return cur


def field_filled(rec, path):
    v = get_path(rec, path)
    if path == "story.background":
        return is_filled_leaf(v) or is_filled_leaf(get_path(rec, "story.loreStatements"))
    if path == "voice.spec":
        return is_filled_leaf(v)
    if path == "memory.relationships":
        return is_filled_leaf(v) or bool((rec.get("additions") or {}).get(path))
    if isinstance(v, list):
        return len(v) > 0
    if isinstance(v, dict) and "v" in v:
        return is_filled_leaf(v)
    return bool(v)


# ----------------------------------------------------------------------------- writers
def write_json(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(obj, fh, ensure_ascii=False, indent=2, sort_keys=False)
        fh.write("\n")


def write_text(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(text)


def duplicates_report(records):
    out = []
    # same card id in several files
    for cid_card, files in sorted(CARDS.items()):
        if len(files) > 1:
            shas = {sha256(f) for f, _ in files}
            out.append("- `%s`: %d files, %d distinct contents: %s" % (
                cid_card, len(files), len(shas), ", ".join("`%s`" % rel(f) for f, _ in files[:6]) + (" …" if len(files) > 6 else "")))
    return out


def base_body_groups():
    groups = {}
    for cid, r in REG.chars.items():
        for b in r["baseModel"]:
            v = b["v"]
            key = None
            if isinstance(v, dict):
                key = base_of_path(v.get("path"))
            elif isinstance(v, str) and v.startswith("same kit body as"):
                key = v.split("(")[-1].rstrip(")")
            elif isinstance(v, str):
                key = base_of_path(v)
            if key:
                groups.setdefault(key, set()).add(cid)
    for key, (cid, ev) in REG.kit_index.items():
        if key in groups:
            groups[key].add(cid)
    return {k: sorted(v) for k, v in groups.items() if len(v) > 1}


def lore_only_figures():
    lines = ["# Lore-only figures (deck cards, not game characters)", "",
             "Generated by `30_DECISIONS/tools/build_character_registry.py`. Do not edit by hand.", "",
             "Deck card figures from `30_DECISIONS/replies/TRIPLET_SETS_R2/*.hub.json` (v1 hub files). "
             "No registry entries are created for them. Cards whose name matches a registry character "
             "are linked in that character's `songs[]` instead and are listed in the last section.", "",
             "**Selection rule (mechanical):** A = persona cards named `Name (The X)` or `Name, The X`; "
             "B = card names of 2–4 capitalised words without article, possessive or digits (person-like, "
             "unclassified candidates; real-person cards are not separated from concepts by this rule). Nothing here is a judgement about canon.", ""]
    linked = []
    for deck, (src, names) in sorted(REG.deck_cards.items()):
        a, b = [], []
        for num, nm, lore in names:
            if not nm:
                continue
            base = re.split(r"'s |\s\(", nm)[0].strip()
            cid = REG.resolve(nm) or REG.resolve(base)
            if not cid:
                ml = base.lower()
                if ml in REG.label_index and len(REG.label_index[ml]) == 1 and ml not in GENERIC_PATTERNS:
                    cid = next(iter(REG.label_index[ml]))
                    if "pet" in REG.chars[cid]["kindEvidence"] and not REG.chars[cid]["seed"]:
                        cid = None
            if cid:
                linked.append((deck, num, nm, cid))
                continue
            if re.match(r"^(?!The\b)[A-Z][^,(]*?(?:,\s*The\b|\s\(The\b)", nm):
                a.append((num, nm))
            elif re.match(r"^(?:[A-Z][a-zA-Z\-]+|[A-Z]\.|von|de|van)(?:\s+(?:[A-Z][a-zA-Z\-]+|[A-Z]\.|von|de|van)){1,3}$", nm) \
                    and not nm.startswith(("The ", "A ")) and not re.search(r"\b(of|the|in|a)\b", nm):
                b.append((num, nm))
        if not a and not b:
            continue
        lines.append("## %s" % deck)
        lines.append("Source: `%s`" % src)
        if a:
            lines.append("")
            lines.append("A · persona cards: " + "; ".join("#%s %s" % x for x in a))
        if b:
            lines.append("")
            lines.append("B · person-like names (unclassified): " + "; ".join("#%s %s" % x for x in b))
        lines.append("")
    lines.append("## Cards linked to registry characters (`songs[]`)")
    for deck, num, nm, cid in linked:
        lines.append("- %s #%s %s → `%s`" % (deck, num, nm, cid))
    lines.append("")
    return "\n".join(lines)


def dp_link_doc():
    m = REG.dp_meta
    return """# Dramatis Personae ↔ character registry (link spec)

Generated by `30_DECISIONS/tools/build_character_registry.py`. Describes what the Dramatis Personae
view would read from the registry instead of its cache. The Dramatis Personae source was only read.

## How it loads today (read from source)
- `WSA_DRAMATIS_PERSONAE_R1_SOURCE/dramatis-personae.js`: first loads `./data/dramatis-personae-cache.json`
  (schema `kfb.dramatis-personae-read-cache/1`, branch `%s`, commit `%s`, basePath `%s`), then tries GitHub:
  lists `BASE/characters` and `BASE/figures` (`BASE = tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/FIGURES_R1/`),
  accepts only file names matching `^[a-z0-9_]+\\.(character|figure)\\.json$`, fetches each, plus
  `replies/voice_casting.r1.json`.
- Guard: rejects everything if any character is not `schema == "kfb.character/1"` or any figure is not `kfb.figure/1`.
- Ids = union of character ids and figure ids. Voice match: `voice.figures[].figureId.replaceAll('-','_') === id`.
- Fields used: `identity.name.v` (title), `identity.aliases`, `personality.archetype.journeyFunction | personalityType | castRole`
  (gallery card), sections `story, personality, dialogue, cards, memory, performance` rendered generically from `{v,src,status}`
  leaves, `conflicts[]`, `todo[]`, `provenance` (printed as JSON), figure card `approval.status`, `approval.missing`,
  `displayName`, `aliases`, `eyeRig`, `body.glb.sha256`, `material.sheenMax` (preview readiness).
- `app.js` only mounts the controller (`createDramatisPersonaeController`); it does not read character data itself.
- Cache today: %d character sheets, %d figure cards (ids: %s).

## What it would need to read from the registry
| Today (cache / GitHub) | Registry (`30_DECISIONS/CHARACTERS_R1/`) |
|---|---|
| directory listing `FIGURES_R1/characters/*.character.json` | `index.json` → `characters[].id` (all registry ids), file `characters/<id>/character.json` |
| `FIGURES_R1/figures/<id>.figure.json` | `character.json` → `appearance.figureRefs[]` where `kind == "canonical"` → `path` (+ `sha256` for pinning); other kinds are scene variants, states, poses, duplicates |
| `voice_casting.r1.json` lookup by kebab→snake id | `character.json` → `voice.{engine,spec,speed,lang,goldenLine,sampleFile}` (copied from voice_casting.r1.json, with `src`) |
| schema guard `kfb.character/1` | accept `kfb.character/1.1` (superset: all kfb.character/1 sections kept; seed files carry `seedSchema: kfb.character/1`) |
| `provenance` = list of CS ids | `provenance` = map field path → `{source, tag}`; the original CS list sits at `provenance._seedProvenanceCS` |
| `todo[]` (free text) | `todo[]` kept for seed characters; new: `todoFields[]` and `fieldStatus{}` (wanted fields filled/todo) |
| alias search | `aliases[]` (top level) + `aliases.json` (`aliases`, `scoped`, `unresolved`) |
| — | new sections it can show as extra tabs: `songs[]`, `dioramas[]`, `chatter{}`, `preferences{}`, `variants[]`, `lore.mentions`, `story.loreStatements`, `personality.quirks`, `dialogue.speechPatterns`, `additions{}` (values for seed leaves that were already filled), `views.dramatis_personae` |

## Minimal change list for a future DP R2 (not done here)
1. Replace the two directory listings by one read of `CHARACTERS_R1/index.json`.
2. Read `characters/<id>/character.json`; resolve the figure card through `appearance.figureRefs[kind=canonical].path`.
3. Relax the schema guard to `kfb.character/1` or `kfb.character/1.1`.
4. Render `provenance` as a map; keep the generic `{v,src,status}` renderer (all new leaves use the same shape).
5. Voice: read `voice.*` from the character file; the casting file stays the upstream source.
6. Status vocabulary is unchanged (`GEORG, SOURCE, DESIGN, PREFILL, todo`).
""" % (m["branch"], m["commit"], m["basePath"], len([1 for c in REG.chars.values() if c["dp"] and c["dp"]["characterSheet"]]),
       len([1 for c in REG.chars.values() if c["dp"] and c["dp"]["figureCard"]]), ", ".join(REG.dp_ids))


def gaps_doc(records):
    L = ["# GAPS · character registry R1", "",
         "Generated by `30_DECISIONS/tools/build_character_registry.py`. Do not edit by hand.", "",
         "Wanted fields (V-394): " + ", ".join("`%s`" % p for p, _ in WANTED) + ".", ""]
    # summary table
    L.append("## Summary")
    L.append("| id | kind | filled | todo | figure refs | todo fields |")
    L.append("|---|---|---|---|---|---|")
    for cid in sorted(records):
        rec = records[cid]
        fs = rec["fieldStatus"]
        nf = sum(1 for v in fs.values() if v == "filled")
        L.append("| `%s` | %s | %d | %d | %d | %s |" % (cid, rec["kind"], nf, len(fs) - nf, len(rec["appearance"]["figureRefs"]),
                                                     ", ".join(p.split(".")[-1] for p in rec["todoFields"])))
    L.append("")
    # per field
    L.append("## Todo count per wanted field")
    for p, label in WANTED:
        n = sum(1 for r in records.values() if r["fieldStatus"][p] == "todo")
        L.append("- `%s` (%s): %d of %d todo" % (p, label, n, len(records)))
    L.append("")
    L.append("## Unresolved aliases (not guessed)")
    for s, u in sorted(REG.unresolved.items()):
        L.append("- `%s` → candidates %s · %s · seen in %s" % (s, u["candidates"] or "none", u["reason"], "; ".join(u["seenIn"][:3])))
    L.append("")
    L.append("## Alias conflicts decided by identity rule")
    for c in REG.alias_conflicts:
        L.append("- `%s` kept → `%s` (%s); rejected → `%s` (%s)" % (c["id"], c["kept"], c["keptEvidence"], c["rejected"], c["rejectedEvidence"]))
    L.append("")
    L.append("## Excluded ids (not characters)")
    for s, e in sorted(REG.excluded.items()):
        L.append("- `%s`: %s (%s)" % (s, e["reason"], e["source"]))
    L.append("")
    L.append("## Duplicates")
    L.append("### Same card id in several files")
    L.extend(duplicates_report(records))
    L.append("")
    L.append("### Separate characters on the same kit base body (possible duplicates, decide)")
    for key, cids in sorted(base_body_groups().items()):
        L.append("- base `%s`: %s" % (key, ", ".join("`%s`" % c for c in cids)))
    L.append("")
    if REG.notes:
        L.append("### Build notes")
        for n in REG.notes:
            L.append("- " + n)
        L.append("")
    # Lose Enden
    L.append("## Lose Enden")
    L.append("### Characters in lore, songs or Dramatis Personae without a figure card")
    for cid in sorted(records):
        rec = records[cid]
        has_lore = bool(rec["songs"]) or is_filled_leaf(get_path(rec, "lore.mentions")) or \
            is_filled_leaf(get_path(rec, "story.loreStatements")) or rec["views"]["dramatis_personae"].get("present")
        if has_lore and not rec["appearance"]["figureRefs"]:
            why = []
            if rec["songs"]:
                why.append("songs %d" % len(rec["songs"]))
            if is_filled_leaf(get_path(rec, "lore.mentions")) or is_filled_leaf(get_path(rec, "story.loreStatements")):
                why.append("lore")
            if rec["views"]["dramatis_personae"].get("present"):
                why.append("Dramatis Personae")
            L.append("- `%s` (%s): %s" % (cid, rec["kind"], ", ".join(why)))
    L.append("")
    L.append("### Characters with figure cards but without any lore (no seed story, no lore statements, no songs)")
    for cid in sorted(records):
        rec = records[cid]
        has_lore = bool(rec["songs"]) or is_filled_leaf(get_path(rec, "lore.mentions")) or \
            is_filled_leaf(get_path(rec, "story.loreStatements")) or bool(REG.chars[cid]["seed"]) or \
            is_filled_leaf(get_path(rec, "personality.quirks")) or is_filled_leaf(get_path(rec, "dialogue.speechPatterns"))
        if rec["appearance"]["figureRefs"] and not has_lore:
            L.append("- `%s` (%s)" % (cid, rec["kind"]))
    L.append("")
    L.append("## Per character")
    for cid in sorted(records):
        rec = records[cid]
        L.append("### `%s` · %s" % (cid, rec["kind"]))
        L.append("todo: " + (", ".join("`%s`" % p for p in rec["todoFields"]) or "none"))
        L.append("")
    return "\n".join(L) + "\n"


# ----------------------------------------------------------------------------- main
def main():
    load_seeds()
    load_cast()
    load_kit()
    load_cards()
    load_voice()
    load_atlas_residents()
    load_scene_modules()
    load_scenelets()
    load_pets()
    load_chatter()
    load_dp()
    load_lore_and_songs()
    # factions (cast) -> relationship hint for members named in the table
    fac, fsrc = REG.cast_factions
    for side in ("allianz", "horde", "open"):
        for member in fac.get(side) or []:
            tok = member.split(" (")[0]
            cid = REG.resolve(tok)
            if cid:
                REG.chars[cid]["relationships"].append({"v": "faction %s (%s)" % (side, member), "src": fsrc + "#factions." + side})
    for q, (qc, qev) in sorted(REG.qualified.items()):
        g = REG.resolve(q)
        if g and g != qc:
            REG.alias_conflicts.append({"id": q, "kept": g, "keptEvidence": (REG.alias.get(q) or (g, "canonical id"))[1],
                                        "rejected": qc, "rejectedEvidence": qev + " (qualified alias, scoped)"})
    records = {cid: build_record(cid, r) for cid, r in sorted(REG.chars.items())}
    # output (only under OUT)
    if os.path.isdir(os.path.join(OUT, "characters")):
        shutil.rmtree(os.path.join(OUT, "characters"))
    for cid, rec in records.items():
        write_json(os.path.join(OUT, "characters", cid, "character.json"), rec)
    index = {"schema": "kfb.character-index/1", "characterSchema": SCHEMA, "count": len(records),
             "byKind": {}, "characters": []}
    for cid, rec in records.items():
        nf = sum(1 for v in rec["fieldStatus"].values() if v == "filled")
        index["byKind"][rec["kind"]] = index["byKind"].get(rec["kind"], 0) + 1
        nm = get_path(rec, "identity.name")
        index["characters"].append({"id": cid, "name": nm.get("v") if isinstance(nm, dict) else None,
                                    "kind": rec["kind"], "status": rec.get("status"),
                                    "filled": nf, "todo": len(rec["fieldStatus"]) - nf,
                                    "figureRefs": len(rec["appearance"]["figureRefs"]),
                                    "dramatisPersonae": rec["views"]["dramatis_personae"].get("present", False),
                                    "file": "characters/%s/character.json" % cid})
    index["byKind"] = dict(sorted(index["byKind"].items()))
    write_json(os.path.join(OUT, "index.json"), index)
    aliases = {"schema": "kfb.character-aliases/1",
               "rules": {"R1": "id is canonical or known alias", "R2": "cast.r1.json card / variant_assets card",
                         "R3": "figure card body.from_card", "R4": "pose/state/revision suffix of a resolved card id",
                         "R5": "displayName main label equals exactly one character label",
                         "R6": "rawSource kit basename and displayName contains the kit label",
                         "R6c": "B48 camp card token + licence pack", "R7": "several cards share one displayName main label",
                         "R8": "own identity (kfb_ prefix and _bNN build tag stripped)",
                         "S8": "kit coverage id / basename / label variant"},
               "aliases": {k: v[0] for k, v in sorted(REG.alias.items())},
               "evidence": {k: v[1] for k, v in sorted(REG.alias.items())},
               "scoped": {k: dict(sorted(v.items())) for k, v in sorted(REG.scoped.items())},
               "qualified": {k: {"id": v[0], "evidence": v[1]} for k, v in sorted(REG.qualified.items())},
               "unresolved": dict(sorted(REG.unresolved.items())),
               "conflicts": REG.alias_conflicts,
               "excluded": dict(sorted(REG.excluded.items()))}
    write_json(os.path.join(OUT, "aliases.json"), aliases)
    write_text(os.path.join(OUT, "GAPS.md"), gaps_doc(records))
    write_text(os.path.join(OUT, "DRAMATIS_PERSONAE_LINK.md"), dp_link_doc())
    write_text(os.path.join(OUT, "LORE_ONLY_FIGURES.md"), lore_only_figures())
    print("characters: %d" % len(records))
    for k, n in index["byKind"].items():
        print("  %-15s %d" % (k, n))
    print("unresolved aliases: %d · excluded: %d · alias conflicts: %d" % (len(REG.unresolved), len(REG.excluded), len(REG.alias_conflicts)))
    print("skill read: %s" % (rel(REG.skill_path) if REG.skill_path else "not found"))


if __name__ == "__main__":
    main()
