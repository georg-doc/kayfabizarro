#!/usr/bin/env python3
"""KFB Public Domain Pool: laedt die Auswahl aus pool-manifest.jsonl nach media/public_domain/.

Ablauf je Eintrag:
  1. Lizenz bei der Quelle erneut abfragen (nicht dem Manifest glauben).
  2. Nur 'free' (CC0 / PD) oder 'fallback-attribution' (CC BY ohne SA/NC/ND) wird geladen.
  3. Datei nach targetPath, daneben <datei>.license.json.
  4. media/public_domain/manifest.jsonl und CREDITS.md werden aus allen .license.json neu erzeugt.

Aufruf (Repo-Wurzel):  python tools/public_domain/fetch_pool.py pool-manifest.jsonl
Nur Standardbibliothek. Status: NOT_TESTED ausserhalb von Claude Design.
"""
import json, os, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path("media/public_domain")
UA = {"User-Agent": "KFB-PublicDomainPool/1.0 (github.com/georg-doc/kayfabizarro)"}
IA_PREFER = ["512kb mpeg4", "mpeg4", "h.264", "ogg video", "jpeg", "png", "vbr mp3", "ogg vorbis", "text pdf"]
# GitHub lehnt Dateien ueber 100 MB ab. Groesseres wird nur referenziert (stored=false), nicht abgelegt.
CAP = {"image": 15_000_000, "video": 80_000_000, "audio": 25_000_000, "text": 30_000_000}


def get(url, as_json=True):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        data = r.read()
    return json.loads(data) if as_json else data


def tier_from_commons(lic):
    lic = (lic or "").lower()
    if lic.startswith("pd") or lic == "cc0":
        return "free"
    if re.match(r"^cc-by-\d", lic):
        return "fallback-attribution"
    return None


def tier_from_url(lu):
    lu = lu or ""
    if "publicdomain" in lu:
        return "free"
    if "/licenses/by/" in lu:
        return "fallback-attribution"
    return None


def recheck(item, cap):
    """Gibt (tier, asReturned, fileUrl, ext) zurueck oder (None, grund, None, None)."""
    src, sid = item["source"], item["id"].split("-", 1)[1]
    if src == "met":
        o = get(f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{sid}")
        if not o.get("isPublicDomain"):
            return None, "isPublicDomain=false", None, None
        return "free", "isPublicDomain=true", o.get("primaryImage"), "jpg"
    if src == "aic":
        a = get(f"https://api.artic.edu/api/v1/artworks/{sid}?fields=is_public_domain,image_id")["data"]
        if not a.get("is_public_domain"):
            return None, "is_public_domain=false", None, None
        return "free", "is_public_domain=true", f"https://www.artic.edu/iiif/2/{a['image_id']}/full/1686,/0/default.jpg", "jpg"
    if src == "commons":
        q = get("https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&pageids=" + sid)
        ii = next(iter(q["query"]["pages"].values()))["imageinfo"][0]
        lic = ii.get("extmetadata", {}).get("License", {}).get("value", "")
        t = tier_from_commons(lic)
        return (t, "License=" + lic, ii["url"], ii["url"].rsplit(".", 1)[-1].lower()) if t else (None, "License=" + lic, None, None)
    if src == "ia":
        m = get(f"https://archive.org/metadata/{sid}")
        lu = m.get("metadata", {}).get("licenseurl", "")
        t = tier_from_url(lu)
        if not t:
            return None, "licenseurl=" + lu, None, None
        files = [f for f in m.get("files", []) if f.get("source") in ("original", "derivative")]
        too_big = False
        for fmt in IA_PREFER:
            hit = [f for f in files if f.get("format", "").lower() == fmt]
            fit = [f for f in hit if 0 < int(f.get("size", 0) or 0) <= cap]
            too_big = too_big or (bool(hit) and not fit)
            if fit:
                name = max(fit, key=lambda x: int(x["size"]))["name"]
                return t, "licenseurl=" + lu, f"https://archive.org/download/{sid}/{urllib.parse.quote(name)}", name.rsplit(".", 1)[-1].lower()
        if too_big:
            return t, "licenseurl=" + lu, None, "ref"
        return None, "keine passende Datei", None, None
    return None, "Quelle nicht auf der Whitelist: " + src, None, None


def rebuild_index():
    items = []
    for p in sorted(ROOT.rglob("*.license.json")):
        items.append(json.loads(p.read_text(encoding="utf-8")))
    (ROOT / "manifest.jsonl").write_text("".join(json.dumps(i, ensure_ascii=False) + "\n" for i in items), encoding="utf-8")
    fb = [i for i in items if i["attributionRequired"]]
    fr = [i for i in items if not i["attributionRequired"]]
    line = lambda i: f"- {i['credit']} · {i['sourcePage']}"
    md = ["# Credits · media/public_domain", "", "Automatisch erzeugt von tools/public_domain/fetch_pool.py. Nicht von Hand bearbeiten.", "",
          "## Namensnennung erforderlich (Fallback-Assets)", "", *(map(line, fb) if fb else ["- keine"]), "",
          "## Gemeinfrei / CC0 (Nennung freiwillig, als Dank)", "", *(map(line, fr) if fr else ["- keine"]), ""]
    (ROOT / "CREDITS.md").write_text("\n".join(md), encoding="utf-8")
    return len(items), len(fb)


def main(path):
    ok, rejected = 0, []
    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        if not raw.strip():
            continue
        item = json.loads(raw)
        cap = CAP.get(item.get("media"), CAP["image"])
        try:
            tier, returned, url, ext = recheck(item, cap)
        except Exception as e:  # Quelle nicht erreichbar: nichts schreiben
            rejected.append((item["id"], f"NICHT ERREICHBAR: {e}"))
            continue
        if not tier:
            rejected.append((item["id"], returned))
            continue
        try:
            data = get(url, as_json=False) if url else None
        except Exception as e:
            rejected.append((item["id"], f"DOWNLOAD FEHLGESCHLAGEN: {e}"))
            continue
        stored = bool(data) and len(data) <= cap
        base = str(item["targetPath"]).rstrip("/")
        base = re.sub(r"\.[a-z0-9]{2,5}$", "", base, flags=re.I)
        # Abgelegt: <basis>.<ext> · zu gross oder ohne Datei: nur Beleg <basis>.ref.license.json
        target = Path(f"{base}.{ext}") if stored and ext and ext != "ref" else Path(f"{base}.ref")
        target.parent.mkdir(parents=True, exist_ok=True)
        if stored:
            target.write_bytes(data)
        rec = {**item, "tier": tier, "attributionRequired": tier != "free", "fileUrl": url or item.get("sourcePage"),
               "stored": stored, "sizeBytes": len(data) if data else None,
               "path": str(target).replace(os.sep, "/"), "license": {**item["license"], "asReturned": returned},
               "rechecked": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
        rec.pop("targetPath", None)
        Path(str(target) + ".license.json").write_text(json.dumps(rec, ensure_ascii=False, indent=2), encoding="utf-8")
        ok += 1
        time.sleep(0.3)
    total, fb = rebuild_index()
    print(f"geladen: {ok} · verworfen: {len(rejected)} · Pool gesamt: {total} (davon {fb} mit Nennungspflicht)")
    for rid, why in rejected:
        print(f"  VERWORFEN {rid}: {why}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "pool-manifest.jsonl")
