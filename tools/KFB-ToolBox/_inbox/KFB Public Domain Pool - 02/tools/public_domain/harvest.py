#!/usr/bin/env python3
"""KFB Public Domain Pool: erzeugt pool-manifest.jsonl aus seeds.json, ohne Browser.

Gleiche Quellen und gleiche Lizenzregeln wie KFB Public Domain Pool.dc.html:
  met / aic -> nur isPublicDomain / is_public_domain
  commons   -> License pd* oder cc0 = free, cc-by-N = fallback-attribution, sonst verworfen
  ia        -> licenseurl publicdomain = free, licenses/by/ = fallback-attribution, sonst verworfen

Aufruf (Repo-Wurzel):  python tools/public_domain/harvest.py tools/public_domain/seeds.json > pool-manifest.jsonl
Danach:                python tools/public_domain/fetch_pool.py pool-manifest.jsonl
Nur Standardbibliothek. Status: NOT_TESTED ausserhalb von Claude Design.
"""
import json, re, sys, time, urllib.parse, urllib.request

UA = {"User-Agent": "KFB-PublicDomainPool/1.0 (github.com/georg-doc/kayfabizarro)"}
CC0 = "https://creativecommons.org/publicdomain/zero/1.0/"
IA_LIC = " OR ".join(f'"{s}://creativecommons.org/{p}"' for p in
                     ["publicdomain/mark/1.0/", "publicdomain/zero/1.0/", "licenses/by/4.0/", "licenses/by/3.0/", "licenses/by/2.0/"]
                     for s in ("http", "https"))
LABEL = {"met": "The Met Open Access", "aic": "Art Institute of Chicago", "commons": "Wikimedia Commons", "ia": "Internet Archive"}


def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return json.loads(r.read())


def strip(s):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]*>", "", str(s or ""))).strip()


def media_of(m):
    m = m or ""
    return "video" if re.match(r"^(video|movies)", m) else "audio" if m.startswith("audio") else "text" if re.match(r"^(text|texts)", m) or "pdf" in m else "image"


def met(q, n):
    ids = (get("https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=" + urllib.parse.quote(q)).get("objectIDs") or [])[:n * 4]
    for i in ids:
        try:
            o = get(f"https://collectionapi.metmuseum.org/public/collection/v1/objects/{i}")
        except Exception:
            continue
        if o.get("isPublicDomain") and o.get("primaryImage"):
            yield dict(id=f"met-{i}", tier="free", media="image", title=o.get("title") or "Ohne Titel", creator=o.get("artistDisplayName") or None,
                       date=o.get("objectDate") or None, license=dict(name="CC0 1.0 (The Met Open Access)", url=CC0, asReturned="isPublicDomain=true"),
                       sourcePage=o.get("objectURL"), fileUrl=o["primaryImage"], thumb=o.get("primaryImageSmall"), ext="jpg")
        time.sleep(0.05)


def aic(q, n):
    d = get("https://api.artic.edu/api/v1/artworks/search?q=" + urllib.parse.quote(q) +
            f"&query[term][is_public_domain]=true&fields=id,title,artist_title,date_display,image_id,is_public_domain&limit={n * 2}")
    for a in d.get("data", []):
        if a.get("is_public_domain") and a.get("image_id"):
            b = f"https://www.artic.edu/iiif/2/{a['image_id']}/full"
            yield dict(id=f"aic-{a['id']}", tier="free", media="image", title=a.get("title") or "Ohne Titel", creator=a.get("artist_title"),
                       date=a.get("date_display"), license=dict(name="CC0 1.0 (Art Institute of Chicago)", url=CC0, asReturned="is_public_domain=true"),
                       sourcePage=f"https://www.artic.edu/artworks/{a['id']}", fileUrl=f"{b}/1686,/0/default.jpg", thumb=f"{b}/400,/0/default.jpg", ext="jpg")


def commons(q, n):
    d = get("https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=" + str(n * 4) +
            "&gsrsearch=" + urllib.parse.quote(q) + "&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=400")
    for p in (d.get("query") or {}).get("pages", {}).values():
        ii = (p.get("imageinfo") or [None])[0]
        if not ii:
            continue
        em = ii.get("extmetadata", {})
        lic = str(em.get("License", {}).get("value", "")).lower()
        tier = "free" if lic.startswith("pd") or lic == "cc0" else "fallback-attribution" if re.match(r"^cc-by-\d", lic) else None
        if not tier:
            continue
        yield dict(id=f"commons-{p['pageid']}", tier=tier, media=media_of(ii.get("mime")),
                   title=strip(em.get("ObjectName", {}).get("value")) or p["title"].replace("File:", ""), creator=strip(em.get("Artist", {}).get("value")) or None,
                   date=strip(em.get("DateTimeOriginal", {}).get("value")) or None,
                   license=dict(name=strip(em.get("LicenseShortName", {}).get("value")) or lic, url=strip(em.get("LicenseUrl", {}).get("value")) or None, asReturned="License=" + lic),
                   sourcePage=ii.get("descriptionurl"), fileUrl=ii.get("url"), thumb=ii.get("thumburl"), ext=ii["url"].rsplit(".", 1)[-1].lower())


def ia(q, n):
    qq = f"({q}) AND mediatype:(movies OR image OR audio OR texts) AND licenseurl:({IA_LIC}) AND NOT collection:youtube*"
    d = get("https://archive.org/advancedsearch.php?q=" + urllib.parse.quote(qq) +
            "&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=date&fl[]=licenseurl&fl[]=mediatype&sort[]=downloads+desc&rows=" + str(n * 2) + "&output=json")
    for x in d.get("response", {}).get("docs", []):
        lu = str(x.get("licenseurl", ""))
        tier = "free" if "publicdomain" in lu else "fallback-attribution" if "/licenses/by/" in lu else None
        if not tier:
            continue
        cr = x.get("creator")
        yield dict(id=f"ia-{x['identifier']}", tier=tier, media=media_of(x.get("mediatype")),
                   title=(x.get("title")[0] if isinstance(x.get("title"), list) else x.get("title")) or x["identifier"],
                   creator=", ".join(cr) if isinstance(cr, list) else cr, date=str(x.get("date", ""))[:10] or None,
                   license=dict(name="CC0 1.0" if "zero" in lu else "Public Domain Mark 1.0" if "mark" in lu else lu, url=lu, asReturned="licenseurl=" + lu),
                   sourcePage=f"https://archive.org/details/{x['identifier']}", fileUrl=None, thumb=f"https://archive.org/services/img/{x['identifier']}", ext=None)


FN = {"met": met, "aic": aic, "commons": commons, "ia": ia}


def main(path):
    seeds = json.load(open(path, encoding="utf-8"))
    n, seen, stats = seeds.get("perQuery", 6), set(), {}
    for cat in seeds["categories"]:
        for q in cat["queries"]:
            for src in cat["sources"]:
                got = 0
                try:
                    for it in FN[src](q, n):
                        if it["id"] in seen:
                            continue
                        seen.add(it["id"])
                        safe = re.sub(r"[^a-zA-Z0-9._-]+", "_", it["id"])[:80]
                        it.update(schema="kfb.pd-item.v1", source=src, category=cat["id"], query=q,
                                  attributionRequired=it["tier"] != "free",
                                  targetPath=f"media/public_domain/{src}/{safe}.{it['ext']}" if it["ext"] else f"media/public_domain/{src}/{safe}/",
                                  credit=" · ".join(filter(None, [it["title"], it["creator"] or "Urheber unbekannt", it["date"], it["license"]["name"], LABEL[src]])),
                                  selectedAt=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()))
                        print(json.dumps(it, ensure_ascii=False))
                        got += 1
                        if got >= n:
                            break
                except Exception as e:
                    print(f"QUELLE NICHT ERREICHBAR {src} '{q}': {e}", file=sys.stderr)
                stats[src] = stats.get(src, 0) + got
    print("harvest: " + " · ".join(f"{k} {v}" for k, v in stats.items()) + f" · gesamt {len(seen)}", file=sys.stderr)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "tools/public_domain/seeds.json")
