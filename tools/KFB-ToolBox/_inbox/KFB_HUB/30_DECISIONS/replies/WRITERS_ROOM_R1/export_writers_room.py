#!/usr/bin/env python3
"""WS-Song · Writers' Room Export R1: macht aus einem ArtifactData-Dump (out_dir) ein versioniertes, prüfbares Paket.
  python3 export_writers_room.py <dump-ordner> <ziel-ordner> --artifact <url> --html <artifact.html>
Schreibt:
  raw/<collection>/<id>.json            exakte Dokumente aus dem Artefakt-Speicher (alle Collections, 1:1)
  kfb_writers_room_export_r1.json       normalisiert: schema kfb.song.writers-room-export/1 (Songs/Regeln/Lessons/Meta + Karten-Referenzen)
  MANIFEST.json                         sha256 je Datei, Zählungen, Prüfergebnisse
  artifact/kfb-writers-room.v1.html     Quelltext der Seite
Prüft: Karten-Dokumente == aus Registry + pdf.json neu abgeleitet (sonst MISMATCH, nichts wird überschrieben).
Nichts wird freigegeben: Statusfelder bleiben, was sie im Artefakt sind; Klassen beschreiben die Herkunft."""
import argparse, glob, hashlib, json, os, re, shutil, datetime
H = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(H, "../../../../../../.."))
sha = lambda b: hashlib.sha256(b).hexdigest()
fsha = lambda p: sha(open(p, "rb").read())

ap = argparse.ArgumentParser()
ap.add_argument("dump"); ap.add_argument("out"); ap.add_argument("--artifact", required=True); ap.add_argument("--html", required=True)
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)
raw = {}
for p in sorted(glob.glob(os.path.join(a.dump, "**", "*.json"), recursive=True)):
    rel = os.path.relpath(p, a.dump); col = os.path.dirname(rel); did = os.path.basename(rel)[:-5]
    doc = json.load(open(p, encoding="utf-8"))
    body = doc.get("data", doc) if isinstance(doc, dict) and "data" in doc and isinstance(doc["data"], dict) else doc
    ver = doc.get("version") if isinstance(doc, dict) else None
    raw.setdefault(col, {})[did] = {"version": ver, "data": body}
    dst = os.path.join(a.out, "raw", rel); os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copyfile(p, dst)

def derive_cards(did):
    p = os.path.join(ROOT, "registry/assets/v1/decks", did + ".json")
    if not os.path.isfile(p): return None, None, None
    d = json.load(open(p, encoding="utf-8")); rep = (d.get("representations") or {}).get("cardTextJson") or []
    mp = os.path.join(ROOT, rep[0]["path"]) if rep else None; art = {}
    if mp and os.path.isfile(mp):
        for c in json.load(open(mp, encoding="utf-8")).get("cards", []):
            art[c.get("cardNumber")] = re.sub(r"\s*Mood:.*$", "", re.sub(r"^.*?Subject:\s*", "", c.get("artworkPrompt") or "")).strip().rstrip(".")
    cards = [{"n": c["cardNumber"], "name": c.get("cardName"), "lore": c.get("lore") or "", "power": c.get("power") or "", "art": art.get(c["cardNumber"], "")} for c in sorted(d["cards"], key=lambda c: c["cardNumber"])]
    return {"deckId": did, "title": d.get("title"), "cards": cards}, {"path": os.path.relpath(p, ROOT), "sha256": fsha(p), "sourceCommit": d.get("sourceCommit")}, ({"path": rep[0]["path"], "sha256": fsha(mp), "rawPinned": rep[0].get("rawPinned")} if mp and os.path.isfile(mp) else None)

card_refs, mismatches = {}, []
for did, doc in sorted(raw.get("cards", {}).items()):
    derived, reg, med = derive_cards(did)
    ok = derived is not None and json.dumps(derived, sort_keys=True, ensure_ascii=False) == json.dumps(doc["data"], sort_keys=True, ensure_ascii=False)
    if not ok: mismatches.append(did)
    card_refs[did] = {"class": "CANON_DERIVED", "check": "MATCH" if ok else "MISMATCH", "registry": reg, "media": med, "cardCount": len(doc["data"].get("cards", [])), "artifactDocVersion": doc["version"]}

PARALLEL = {  # vorhandenes Parallelmaterial anderer Owner – Konflikt bewahren, nicht auflösen
    "embrace_protopia": "PR #379: KFB_PROTOPIA_56_STANDALONE (Master + Suno-Speech Teil 1-4, 14.10.)",
    "help_i_am_a_human": "PR #379: KFB_HELP_I_AM_HUMAN_56 standalone + 10 compact candidates (14.10.)",
    "kayfabizarro_monomyth_mayhem": "PR #379: KFB_MONOMYTH_MAYHEM_56 standalone Suno Teil 1-3 + Style (14.10.)",
    "1001_kayfabe_nights": "PR #379: Triplets 5/6/7 + Postmortem 'source bridge semantic fail' (13.10.)",
    "ideology_wrestling": "PR #379: Suno freestyle ideology roast first take + pure-pool beat script (12.10.)"}
TIMING = {"epistemic_sabotage", "cosmic_grift_dark_journalism", "pharaoh_piledriver", "trust_and_betrayal"}

def song_class(s):
    if s.get("origin") == "pilot": return "EDITORIAL_CANDIDATE_GATED"      # Gate R4.1 PASS + Kritik v2; keine WS0-/Georg-Freigabe
    if s.get("origin") == "bestand_r3": return "LEGACY_TEXT_R3"             # alter R3-Text, nicht unter R4 geprüft (außer Regression)
    return "PLANNING_SLOT" if not (s.get("lyrics") or "").strip() else "EDITORIAL_DRAFT_UNGATED"
songs = []
for did, doc in sorted(raw.get("songs", {}).items(), key=lambda kv: kv[1]["data"].get("order", 999)):
    s = dict(doc["data"]); s["id"] = did
    lyr = s.get("lyrics") or ""; ftxt = lyr.rstrip("\n") + "\n" if lyr.strip() else ""
    s["_export"] = {"class": song_class(s), "artifactDocVersion": doc["version"], "lyricsSha256": sha(ftxt.encode()) if ftxt else None,
                    "lyricsChars": len(ftxt) if ftxt else 0,
                    "gateMatchesText": bool(s.get("gate") and ftxt and s["gate"].get("lyricsSha") == sha(ftxt.encode())),
                    "approval": "NONE (kein WS0-, kein Georg-, kein Suno-Status – Import gibt nichts frei)",
                    "audio": "UNKNOWN_NOT_IN_REPO" if did not in TIMING else "TIMING_TABLE_ONLY (OPENER_ARC_R2 *.takes.csv UNTIMED_AWAIT_REAL_AUDIO)",
                    "parallelMaterial": PARALLEL.get(did), "cardsRef": f"cards/{did}"}
    songs.append(s)
rules = [dict(d["data"], id=k, _class=("SPEC_MIRROR_R4" if d["data"].get("kind") in ("hart", "richtwert") else "EDITORIAL")) for k, d in sorted(raw.get("rules", {}).items())]
lessons = [dict(d["data"], id=k, _class="EDITORIAL") for k, d in sorted(raw.get("lessons", {}).items())]
meta = {k: d["data"] for k, d in raw.get("meta", {}).items()}
versions = {col: len(v) for col, v in raw.items() if "/versions" in col}
now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
export = {"schema": "kfb.song.writers-room-export/1", "exportedAt": now, "source": {"kind": "claude-artifact-db", "artifact": a.artifact, "role": "TEMPORARY_WORKING_STATE", "ssot": "GitHub georg-doc/kayfabizarro"},
          "counts": {col: len(v) for col, v in raw.items()}, "versionSubcollections": versions or "NONE (alle Songs auf Version 1 – noch nie im Editor gespeichert)",
          "songs": songs, "rules": rules, "lessons": lessons, "meta": meta, "cards": card_refs,
          "boundaries": ["Import setzt keinen Status hoch und erfindet keine Freigabe.", "Karten sind Kopien des Registry-Kanons (MATCH-geprüft); Kanon bleibt registry/assets/v1/decks.",
                         "Parallelmaterial anderer Owner (#379) wird markiert, nicht ersetzt.", "Kein Audio im Export; Takes sind Georgs Notizen, keine Audiobelege."]}
ep = os.path.join(a.out, "kfb_writers_room_export_r1.json")
json.dump(export, open(ep, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
os.makedirs(os.path.join(a.out, "artifact"), exist_ok=True)
shutil.copyfile(a.html, os.path.join(a.out, "artifact", "kfb-writers-room.v1.html"))
files = {os.path.relpath(p, a.out): fsha(p) for p in sorted(glob.glob(os.path.join(a.out, "**", "*"), recursive=True)) if os.path.isfile(p) and not p.endswith("MANIFEST.json")}
total = sum(len(v) for v in raw.values())
man = {"schema": "kfb.song.writers-room-export-manifest/1", "exportedAt": now, "artifact": a.artifact, "documents": total, "counts": export["counts"],
       "cardsCheck": {"MATCH": len(card_refs) - len(mismatches), "MISMATCH": mismatches}, "songClasses": {}, "unexported": [], "files": files}
for s in songs: man["songClasses"][s["_export"]["class"]] = man["songClasses"].get(s["_export"]["class"], 0) + 1
man["unexported"] = ["Browser-lokale Ansichtseinstellungen (Filter, letzter Tab) – absichtlich nicht Teil des Speichers",
                     "Antworten von 'Ideen mit Claude' – werden nicht gespeichert, nur angezeigt"]
json.dump(man, open(os.path.join(a.out, "MANIFEST.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{total} Dokumente exportiert · Karten MATCH {len(card_refs) - len(mismatches)}/{len(card_refs)} · Klassen {man['songClasses']}")
