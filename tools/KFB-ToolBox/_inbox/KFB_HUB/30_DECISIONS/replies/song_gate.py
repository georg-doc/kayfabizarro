#!/usr/bin/env python3
"""KFB Song-Tor R4.2 (SONG_SPEC_R4, V-576; R4.1: Zitat-Satzzeichen, "swap" bei transferable; R4.2: Bewohner im Diorama, offene Ansprache, Kritiker v3): EIN Prüfskript für alle Deck-Songs. Keine Kopien je Deck, kein Schatten-Parser.
R4 ersetzt R3.7 (V-528). R2 (gesprochene Triplets) und triplet_set_check.py bleiben unverändert.

  python3 song_gate.py lyrics <track.suno.txt> --deck <deck.json> [--songlines <x.songlines.json>] [--media <deck.pdf.json>]
                       [--registry <decks-ordner>] [--cards 5-60] [--tone <deckId>] [--corpus <datei_oder_ordner> ...]
  python3 song_gate.py style  <x.style.txt> [--songlines <x.songlines.json>] [--deck <deck.json>] [--batch <style.txt> ...] [--corpus ...]
  python3 song_gate.py critic <critic.json> --lyrics <track.suno.txt> [--style <x.style.txt>] [--synopsis <x.synopsis.txt>] [--source ...]
  python3 song_gate.py album  <x.songlines.json> ...      (Album-Diversität, nicht blind; 3-5 Tracks)

Stufen je Ausgabezeile:
  FAIL   = harter Quell- oder Formfehler (Exit 1): falsche Karte/falsches Deck, fehlende Zuordnung, >= 5000 Zeichen,
           gesungene Klammern, Ziffern, Spielwörter, Ton, Slop, nicht verifizierter Performer, Rahmenformat.
  WARN   = stilistisches Zahlenmuster außerhalb des Richtwerts (80-95 Zeichen, BPM, Opener-Quote, Wortwiederholung).
  REVIEW = redaktionelles Signal für Kritiker/WS0 (Reihenfolge geändert, Titel nie genannt, Intro-Typ, Callbacks).
  INFO   = Beleg ohne Wertung.
Exit 0 = PASS (nur WARN/REVIEW/INFO), Exit 1 = FAIL.

Zwei Wege, ein Parser:
  - songlines mit "schema": "kfb.songlines.r4"  -> ausdrückliche Zuordnung cardNumber -> Beat-Spanne + cardText (R4).
  - ältere songlines oder keine                 -> Zuordnung über Kartentitel wie in R3.7 (Altbestand bleibt prüfbar).
"""
import argparse, hashlib, json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from triplet_set_check import GRAMMAR, FLUFF, vocab, stems  # gleiche Wortlogik wie das Triplet-Tor

GATE_VERSION = "R4.2"
SONGLINES_R4 = "kfb.songlines.r4"
WORD = re.compile(r"[A-Za-z]+(?:[-'][A-Za-z]+)*")
GAME_WORDS = {"actor", "actors", "token", "tokens", "scene", "scenes", "zerg", "equipped", "discard", "discards", "dice",
              "mana", "cooldown", "buff", "debuff", "hitpoints", "hp", "playable", "keyword", "keywords"}
GAME_PHRASES = ["card effect", "draw a card", "draw two", "play this card", "when played", "hit points", "your turn",
                "end of turn", "roll a", "zerg rush", "equipped items"]
INTRO_FORBIDDEN = ["welcome to", "meta-message", "meta message", "ladies and gentlemen"]
EXTRA = {"oh", "yes", "yeah", "now", "just", "still", "all", "one", "every", "here", "there", "again", "more", "very"}
# E16b: Ton. Begriffe, die NICHT aus dem Kartentext des Decks stammen, dürfen nicht im Song stehen.
TONE_COMMON = ["jew", "jews", "jewish", "zionist", "zionists", "cabal", "globalist", "globalists", "bloodline", "bloodlines",
               "reptilian", "reptilians", "subhuman", "vermin", "parasite", "parasites"]
TONE = {
    "the_kayfabe_money_trail_9_11": ["flight tech", "remote flight", "who flew", "inside job", "hologram", "no plane"],
    "1001_kayfabe_nights": ["cannibal", "black giant"],
    "the_carnival_of_unsolved_problems_therapy": ["crazy", "psycho", "nutjob", "lunatic", "snowflake", "loony", "insane"],
    "federal_kayfabe": [],
    "geopolitical_thrillers_conspiracy_theories": ["plandemic", "hoax", "fake virus", "they want you dead", "depopulation",
                                                   "vaccine kills", "wake up sheeple", "sheeple"],
    "kayfabizarro_monopolies_manipulation_murder_vol": ["deserved it", "had it coming"],
    "grimms_kayfabe_legends_expansion_set_02": [],
    "romantic_kayfabe": ["she asked for it", "asked for it", "no means yes"],
}
STOP = GRAMMAR | EXTRA | FLUFF
END_LINE = "Stay Fluffy, Folks!"
OWN_TEXT_WARN = 0.30
FUNC_EXTRA = {"don't", "doesn't", "didn't", "aren't", "isn't", "wasn't", "weren't", "can't", "won't", "till", "until", "before", "after", "both", "each", "too", "also"}
# C13 (R3.4, V-435): object-acting + slop – bleibt hart (nicht Teil der Matrix V-576)
THINGS = r"(ledger|ledgers|audit|audits|receipt|receipts|record|records|file|files|paper|papers|money|number|numbers|desk|door|office|stage|night|day|clock|watch|pocket watch|time|truth|silence|story|stories|deck|card|cards|question|answer|mind|dream|verdict|bell|seat|ticket|fee|whistle|crown|city|book|books|history|archive|evidence|page|pages|entry|entries|tablet|tablets|world|memory|account|accounting|figures|keys|blueprints|map|ink|coin|vault)"
ACTS = r"(begins?|began|knows?|remembers?|waits?|whispers?|stands?|stood|wanders?|reach(es)?|summons?|commissions?|asks?|tells?|refuses?|keeps?|kept|holds?|buys?|offers?|appeals?|convicts?|disputes?|demands?|bills?|forgets?|lies|sleeps?|dreams?|wants?|hides?|watches|listens?|counts?|confess(es)?|never|cannot|can't|still|is late|precedes?|expose[sd]?|remain[s]?)"
OBJECT_ACTING = re.compile(rf"(?:^|[.!?]\s+)(?:the|a|an|every|no|this|that|its|his|her)\s+(?:\w+\s+){{0,2}}?{THINGS}\s+(?:\w+\s+){{0,1}}?{ACTS}\b", re.I)
SLOP = ["tapestry", "testament", "whisper", "echo", "symphony", "delve", "unravel", "journey", "in the end", "little did", "a reminder that", "stands as", "stood trial"]
INTRO_TYPES = {"question", "scene", "found_object", "bold_claim", "confession", "misdirection"}
OPENER_WINDOW = 15
INTRO_COOLDOWN = 3
# R4 (V-576 A6-TUNE): nicht gesungene Cues nur als eigener Beat aus dieser Liste ODER als Sidecar in songlines.cues.
CUE_TAGS = {"spoken word", "intro", "outro", "verse", "pre-chorus", "chorus", "hook", "bridge", "break", "breakdown", "drop",
            "build", "build-up", "instrumental", "instrumental break", "interlude", "solo", "beat switch", "silence", "pause",
            "stop", "end", "applause", "crowd cheering", "cheering crowd", "crowd", "crowd chant", "crowd boos", "boos",
            "bell", "ring bell", "laughter", "audience laughter", "gasp", "record scratch"}
TAG_LINE = re.compile(r"^\[([^\[\]]{1,40})\]$")
# R4.2 (Georg 20.10.): Bewohner performt im Diorama-Zuhause, für wen auch immer da ist
STAGE_FORMULAS = ["good morning", "good evening", "good night, everybody", "tonight", "ladies and gentlemen", "front row", "round of applause",
                  "give it up for", "thank you, thank you", "make some noise", "is this thing on"]
CROWD_TAGS = {"applause", "crowd cheering", "cheering crowd", "crowd", "crowd chant", "crowd boos", "boos", "laughter", "audience laughter"}
KFB_HOUSE_FIGURES = {"frizzlebob": "KFB FrizzleBob v5 (V-244) – Hausfigur, nicht im Asset-Katalog"}
NAMED_FIGURE = re.compile(r"frizzlebob|\b(uncle|onkel)\b(?!\s+sam)|\brabbit\b(?!\s+holes?)", re.I)


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        h.update(f.read())
    return h.hexdigest()


def beats_of(text):
    return [b for b in text.strip().split("\n\n")]


def is_tag(b):
    m = TAG_LINE.match(b.strip())
    return bool(m) and m.group(1).strip().casefold() in CUE_TAGS


def strip_paren(s):
    return re.sub(r"\s*\([^)]*\)", "", s).strip()


def norm_name(s):
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", strip_paren(str(s or "")).casefold())).strip()


def name_variants(card, songlines):
    n = card.get("cardName") or card.get("name") or ""
    out = [strip_paren(n)]
    if "/" in out[0]:
        out += [p.strip() for p in out[0].split("/")]
    sl = songlines.get(card.get("cardNumber"))
    if sl:
        out += [sl.get("songName") or "", strip_paren(sl.get("songLine") or "")]
    return [v for v in out if v]


def find_card(beat, cards, start, songlines):
    low = beat.casefold()
    for i in range(start, len(cards)):
        for v in name_variants(cards[i], songlines):
            k = low.find(v.casefold())
            if k < 0 and v.casefold().startswith("the "):
                k = low.find(v.casefold()[4:])
            if k >= 0:
                return i, k
    return None, None


def parse_range(r, cards):
    if not r:
        return cards
    a, b = (int(x) for x in r.split("-"))
    return [c for c in cards if a <= int(c.get("cardNumber", 0)) <= b]


def corpus_files(paths, suffix):
    files = []
    for p in paths or []:
        if os.path.isdir(p):
            for root, _, fs in os.walk(p):
                files += [os.path.join(root, f) for f in fs if f.endswith(suffix)]
        elif os.path.isfile(p) and p.endswith(suffix):
            files.append(p)
    return sorted(set(files), key=os.path.getmtime, reverse=True)  # neueste zuerst


def corpus_openers(paths, self_path):
    out = {}
    files = [f for f in corpus_files(paths, ".suno.txt") if os.path.abspath(f) != os.path.abspath(self_path)][:OPENER_WINDOW]
    for f in files:
        for b in beats_of(open(f, encoding="utf-8").read()):
            m = re.match(r"^([^.:!?;,]{1,40}[.:!?])\s", b)
            if m:
                out.setdefault(m.group(1).strip().casefold(), os.path.basename(f))
    return out


def card_vocab(c, art, songlines):
    t = " ".join(str(c.get(k) or "") for k in ("cardName", "lore", "power"))
    t += " " + (art.get(str(c.get("cardNumber"))) or art.get("N:" + str(c.get("cardName") or "").strip().casefold(), ""))
    e = songlines.get(c.get("cardNumber")) or songlines.get(str(c.get("cardNumber"))) or {}
    return vocab(t + " " + str(e.get("songLine") or ""))


def foreign_words(text, ov):
    return [t for t in WORD.findall(text) if t.lower() not in STOP and t.lower() not in FUNC_EXTRA and not (stems(t) & ov)]


def registry_dir(a):
    return a.registry or os.path.dirname(os.path.abspath(a.deck))


def check_performer(p, a, out):
    """V-576: benannter Performer nur als verifizierte KFB-Figur = echte Karte im Registry (deckId + cardNumber + Name)."""
    if not p:
        return None
    if not isinstance(p, dict) or not all(p.get(k) not in (None, "") for k in ("name", "deckId", "cardNumber")):
        out("FAIL", "C9P", f"performer braucht name, deckId, cardNumber (verifizierte KFB-Figur): {p!r}")
        return None
    path = os.path.join(registry_dir(a), f"{p['deckId']}.json")
    if not os.path.isfile(path):
        out("FAIL", "C9P", f"Performer-Deck {p['deckId']!r} nicht im Registry ({path})")
        return None
    pdeck = json.load(open(path, encoding="utf-8"))
    card = next((c for c in pdeck.get("cards", []) if int(c.get("cardNumber", -1)) == int(p["cardNumber"])), None)
    if not card:
        out("FAIL", "C9P", f"Performer-Karte {p['deckId']}#{p['cardNumber']} existiert nicht")
        return None
    if norm_name(card.get("cardName")) != norm_name(p["name"]) and norm_name(p["name"]) not in norm_name(card.get("cardName")):
        out("FAIL", "C9P", f"Performer-Name {p['name']!r} passt nicht zur Karte {p['deckId']}#{p['cardNumber']} ({card.get('cardName')!r})")
        return None
    out("INFO", "C9P", f"Performer verifiziert: {card.get('cardName')} ({p['deckId']}#{p['cardNumber']})")
    return card


def check_performers(ps, a, out):
    """R4.2: Bewohner = Figur(en) aus registry/assets/v1/catalog.jsonl (model-3d, Name exakt) oder KFB-Hausfigur."""
    if not ps:
        return []
    cat = a.catalog or os.path.join(os.path.dirname(registry_dir(a)), "catalog.jsonl")
    names = set()
    if os.path.isfile(cat):
        for line in open(cat, encoding="utf-8"):
            try:
                r = json.loads(line)
            except Exception:
                continue
            if r.get("kind") == "model-3d":
                names.add(str(r.get("name", "")).casefold())
    else:
        out("WARN", "C9B", f"Asset-Katalog nicht gefunden ({cat}); Bewohner ungeprüft")
    ok = []
    for p in ps:
        m = str((p or {}).get("model") or "").strip()
        if not m:
            out("FAIL", "C9B", f"Bewohner ohne model: {p!r}")
        elif m.casefold() in KFB_HOUSE_FIGURES:
            out("INFO", "C9B", f"Bewohner {m}: {KFB_HOUSE_FIGURES[m.casefold()]}"); ok.append(m)
        elif names and m.casefold() not in names:
            out("FAIL", "C9B", f"Bewohner-Modell {m!r} nicht im Asset-Katalog (model-3d)")
        else:
            out("INFO", "C9B", f"Bewohner verifiziert: {m} ({p.get('asset') or 'Variante offen'})"); ok.append(m)
    return ok


def gate_lyrics(a):
    text = open(a.lyrics, encoding="utf-8").read()
    deck = json.load(open(a.deck, encoding="utf-8"))
    all_cards = sorted(deck.get("cards", []), key=lambda c: int(c.get("cardNumber", 0)))
    by_num = {int(c.get("cardNumber", 0)): c for c in all_cards}
    lines = []
    out = lambda lvl, rule, msg: lines.append((lvl, rule, msg))

    sj = json.load(open(a.songlines, encoding="utf-8")) if a.songlines else {}
    r4 = isinstance(sj, dict) and sj.get("schema") == SONGLINES_R4
    songlines, skip, refrain, intro_type, best_of = {}, set(), "", None, None
    if isinstance(sj, dict):
        refrain, intro_type = (sj.get("refrain") or "").strip(), sj.get("introType")
        skip = {int(x) for x in (sj.get("metaSkipped") or sj.get("metaSkip") or [])}
        if sj.get("bestOf"):
            best_of = [int(x) for x in sj["bestOf"]]
        entries = sj.get("songLineChanges") or []
    else:
        entries = sj
    for e in entries:
        songlines[e.get("cardNumber")] = e

    art = {}
    if a.media:  # A2/V-377: Bildwörter aus artworkPrompt – nur die der EIGENEN Karte
        mj = json.load(open(a.media, encoding="utf-8"))
        for c in (mj.get("cards") or []) if isinstance(mj, dict) else mj:
            t = str(c.get("artworkPrompt") or c.get("imageMotif") or "")
            if c.get("cardNumber") is not None:
                art[str(c.get("cardNumber"))] = t
            if c.get("name") or c.get("cardName"):
                art["N:" + str(c.get("name") or c.get("cardName")).strip().casefold()] = t

    # ---- Quelle: Deck-ID, Titel, Pins (hart) ----
    deck_id, deck_title = deck.get("deckId", ""), str(deck.get("title") or deck.get("deckTitle") or "")
    if r4:
        if sj.get("deckId") != deck_id:
            out("FAIL", "S1", f"songlines.deckId {sj.get('deckId')!r} != Deck {deck_id!r} (falsches Deck)")
        if (sj.get("deckTitle") or "").strip() != deck_title.strip():
            out("FAIL", "S1", f"songlines.deckTitle {sj.get('deckTitle')!r} != Deck-Titel {deck_title!r}")
        pins = sj.get("sourcePins") or {}
        for key, path in (("deck", a.deck), ("media", a.media)):
            pin = pins.get(key) or {}
            if not path:
                if key == "media" and pin:
                    out("WARN", "S2", "media-Pin vorhanden, aber --media nicht übergeben (Bildwörter ungeprüft)")
                continue
            if not pin.get("sha256"):
                out("FAIL", "S2", f"sourcePins.{key}.sha256 fehlt (Quelle muss gepinnt sein)")
            elif pin["sha256"] != sha256(path):
                out("FAIL", "S2", f"sourcePins.{key}.sha256 passt nicht zu {os.path.basename(path)} (Quelle geändert?)")
            else:
                out("INFO", "S2", f"{key} gepinnt {pin['sha256'][:12]}")
        for m in sj.get("visualMotifs") or []:
            if m.get("visualVerified") is not False and not m.get("visualEvidence"):
                out("FAIL", "S3", f"visualMotif Karte {m.get('cardNumber')}: visualVerified ohne visualEvidence (nur JSON gelesen -> false)")
    performer = check_performer(sj.get("performer") if isinstance(sj, dict) else None, a, out)
    residents = check_performers((sj.get("performers") or []) if isinstance(sj, dict) else [], a, out)
    if r4 and not residents and not performer:
        out("REVIEW", "C9B", "kein Bewohner (performers) angegeben – R4.2: Bewohner des Decks performt")

    # ---- Form ----
    if len(text) >= 5000:
        out("FAIL", "C12", f"{len(text)} Zeichen (>= 5000, Unicode len)")
    bs = beats_of(text)
    if not bs or not is_tag(bs[0]):
        out("FAIL", "C8", "erster Beat ist kein Cue-Tag (Standard: [Spoken Word])")
    elif bs[0].strip() != "[Spoken Word]":
        out("INFO", "C8", f"erster Beat {bs[0].strip()!r} statt [Spoken Word]")
    if bs[-1].strip() != END_LINE:   # R3.6 (Georg 18.10.)
        out("FAIL", "C12", f"letzter Beat ist nicht {END_LINE!r} allein")
    for i, b in enumerate(bs):
        if "\n" in b:
            out("FAIL", "C8", f"Beat {i}: mehrere Zeilen ohne Leerzeile: {b.splitlines()[0][:60]!r}")
        if b != b.strip() or not b:
            out("FAIL", "C8", f"Beat {i}: leer oder Leerraum am Rand (doppelte Leerzeile?)")
    tag_beats = {i for i, b in enumerate(bs) if is_tag(b)}
    sung = [i for i in range(1, len(bs) - 1) if i not in tag_beats]   # Index im Gesamttext (0 = erstes Tag)
    for c in ((sj.get("cues") or []) if isinstance(sj, dict) else []):
        if not (isinstance(c.get("afterBeat"), int) and 0 <= c["afterBeat"] < len(bs)) or not c.get("cue"):
            out("FAIL", "A6", f"Sidecar-Cue ungültig: {c!r}")

    # ---- Karten zuordnen ----
    card_beats = {}            # beat index -> [(card, cardText or None, k)]
    selected = []
    if r4:
        if not best_of:
            out("FAIL", "S4", "bestOf fehlt (Liste der gesungenen Kartennummern, auch bei vollem Deck)")
            best_of = []
        unknown = [n for n in best_of if n not in by_num]
        if unknown:
            out("FAIL", "S4", f"bestOf enthält Kartennummern, die es im Deck nicht gibt: {unknown}")
        if len(set(best_of)) != len(best_of):
            out("FAIL", "S4", "bestOf enthält Dubletten")
        selected = [by_num[n] for n in best_of if n in by_num and n not in skip]
        full = {n for n in by_num if n not in skip}
        if set(best_of) != full and not sj.get("bestOfReason"):
            out("FAIL", "S4", "Best-of ohne bestOfReason (Auswahl muss begründet sein)")
        for n in best_of:
            if n in by_num and by_num[n].get("mappingVerified") is False:
                out("WARN", "S4", f"Karte {n}: mappingVerified=false im Registry")
        maps = sj.get("cards") or []
        mapped = {}
        for m in maps:
            n = m.get("cardNumber")
            if not isinstance(n, int) or n not in by_num:
                out("FAIL", "S5", f"Zuordnung nennt Karte {n!r}, die es im Deck {deck_id!r} nicht gibt")
                continue
            if n not in best_of:
                out("FAIL", "S5", f"Karte {n} ist zugeordnet, steht aber nicht in bestOf")
                continue
            if n in mapped:
                out("FAIL", "S5", f"Karte {n} doppelt zugeordnet")
                continue
            beats = m.get("beats") or []
            texts = m.get("cardText")
            texts = [texts] if isinstance(texts, str) else (texts or [])
            if not beats or not all(isinstance(j, int) for j in beats):
                out("FAIL", "S5", f"Karte {n}: beats fehlt oder ungültig")
                continue
            bad = [j for j in beats if j not in sung]
            if bad:
                out("FAIL", "S5", f"Karte {n}: Beat(s) {bad} sind kein gesungener Beat (0 = Tag, letzter = Abschluss)")
                continue
            if not texts:
                out("FAIL", "S5", f"Karte {n}: cardText fehlt (wörtlicher Kartenanteil im Beat)")
                continue
            c = by_num[n]
            ov = card_vocab(c, art, songlines)
            for t in texts:
                hit = next((j for j in beats if t and t in bs[j]), None)
                if hit is None:
                    out("FAIL", "S5", f"Karte {n}: cardText steht nicht wörtlich in Beat {beats}: {t[:50]!r}")
                    continue
                card_beats.setdefault(hit, []).append((c, t, bs[hit].find(t)))
                fw = foreign_words(t, ov)
                fl = [w for w in WORD.findall(t) if w.lower() in FLUFF]
                if len(fl) > 1:
                    out("FAIL", "A2", f"Karte {n}: mehr als ein Fluff-Wort")
                if len(fw) > 1:   # R3.5: ab zwei fremden Wörtern FAIL (falsche Karte / erfundener Inhalt)
                    out("FAIL", "A2", f"Karte {n}: Kartentext nicht aus dieser Karte: {fw}")
                elif fw:
                    out("WARN", "A2", f"Karte {n}: ein Wort nicht aus der eigenen Karte: {fw}")
                if not 80 <= len(t) <= 95:   # V-576 A4-TUNE: Richtwert
                    out("WARN", "A4", f"Karte {n}: Kartenteil {len(t)} Zeichen (Richtwert 80-95): {t[:50]!r}")
            mapped[n] = beats
        missing = [n for n in best_of if n in by_num and n not in skip and n not in mapped]
        if missing:
            out("FAIL", "S5", f"Karten aus bestOf ohne Beat-Zuordnung: {missing}")
        order = [n for n, _ in sorted(mapped.items(), key=lambda kv: min(kv[1]))]
        if order != sorted(order):
            out("REVIEW", "C10", f"Reihenfolge redaktionell geändert (orderMode={sj.get('orderMode')!r}): {order}")
            if sj.get("orderMode") != "edited":
                out("WARN", "C10", "Reihenfolge weicht vom Deck ab, orderMode ist nicht 'edited'")
    else:
        cards = parse_range(a.cards, all_cards)
        cards = [c for c in cards if int(c.get("cardNumber", 0)) not in skip]
        if best_of:
            cards = [c for c in cards if int(c.get("cardNumber", 0)) in set(best_of)]
        selected = cards
        out("INFO", "S5", "Altbestand: Zuordnung über Kartentitel (R3.7-Weg)")
        idx = 0
        for j in sung:
            ci, k = find_card(bs[j], cards, idx, songlines)
            if ci is None:
                continue
            if ci != idx:
                out("FAIL", "C10", f"Karten {[c.get('cardNumber') for c in cards[idx:ci]]} fehlen oder Reihenfolge falsch (bei Beat {j})")
            card_beats.setdefault(j, []).append((cards[ci], bs[j][k:].strip(), k))
            idx = ci + 1
        if idx < len(cards):
            out("FAIL", "C10", f"Karten fehlen am Ende: {[c.get('cardNumber') for c in cards[idx:]]}")
        for j, lst in card_beats.items():
            for c, part, k in lst:
                fw = foreign_words(part, card_vocab(c, art, songlines))
                if len(fw) > 1:
                    out("FAIL", "A2", f"Karte {c.get('cardNumber')}: Wörter nicht aus der eigenen Karte: {fw}")
                elif fw:
                    out("WARN", "A2", f"Karte {c.get('cardNumber')}: ein Wort nicht aus der eigenen Karte: {fw}")
                if not 80 <= len(part) <= 95:
                    out("WARN", "A4", f"Karte {c.get('cardNumber')}: Kartenteil {len(part)} Zeichen (Richtwert 80-95)")

    rewrites = [e for e in songlines.values() if str(e.get("rule", "")).upper() != "A7"]
    if len(rewrites) > max(1, len(selected) // 10):
        out("WARN", "A5", f"{len(rewrites)} Wort-songLines bei {len(selected)} Karten (Richtwert 10 %)")

    # ---- Rahmen: Intro / Brücken / Outro = gesungene Beats ohne Karte; Performer-Text in Kartenbeats ----
    cb = sorted(card_beats)
    first_card, last_card = (cb[0], cb[-1]) if cb else (len(bs), -1)
    frame = [(j, bs[j]) for j in sung if j not in card_beats]
    intro = [b for j, b in frame if j < first_card]
    outro = [b for j, b in frame if j > last_card]
    bridges = [b for j, b in frame if first_card < j < last_card]
    perf_bits = []    # Performer-Text innerhalb von Kartenbeats (alles außer cardText)
    for j, lst in card_beats.items():
        rest = bs[j]
        for c, t, k in lst:
            rest = rest.replace(t, " ") if r4 else rest[:k]
        rest = rest.strip(" .,;:!?-–—")
        if rest:
            perf_bits.append((j, rest))
    if not cb:
        out("FAIL", "S5", "keine einzige Karte im Song zugeordnet")
    if not outro:
        out("FAIL", "C12", f"kein Outro-Beat vor {END_LINE!r}")
    if not intro:
        out("FAIL", "C9", "kein Intro-Beat vor der ersten Karte")
    elif len(intro) < 2:
        out("WARN", "C9", f"Intro hat {len(intro)} eigenen Beat (Richtwert >= 2)")
    if not r4:
        for b in bridges:
            out("INFO", "C10", f"Brücke ohne Karte zwischen Karten (R4 erlaubt): {b[:50]!r}")

    def is_refrain(b):
        if not refrain:
            return False
        rw, bw = set(WORD.findall(refrain.lower())), set(WORD.findall(b.lower()))
        return bool(rw) and len(rw & bw) / len(rw) >= 0.6 and len(bw) <= len(rw) + 3
    ref_beats = [b for _, b in frame if is_refrain(b)]
    if refrain:
        if len(refrain.split()) > 8:
            out("WARN", "C11", f"Refrain länger als 8 Wörter: {refrain!r}")
        if len(ref_beats) > 3:
            out("WARN", "C11", f"Refrain {len(ref_beats)}x (Richtwert max 3)")
    own_frame = [b for _, b in frame if not is_refrain(b)]
    own_text = own_frame + [r for _, r in perf_bits]

    # Deck-Identität (V-576 C9-ACK): Titel optional; hart sind deckId/Titel in Metadaten (oben S1)
    tw = {w.lower() for w in WORD.findall(deck_title) if w.lower() not in STOP and len(w) > 3}
    hits = {j: tw & {w.lower() for w in WORD.findall(bs[j])} for j in sung}
    where = [j for j, h in hits.items() if tw and len(h) >= max(1, min(2, len(tw)))]
    part = [(j, sorted(h)) for j, h in hits.items() if h and j not in where]
    if where:
        out("INFO", "C9", f"Decktitel-Wörter in Beat {where[:4]}")
    elif part:
        out("REVIEW", "C9", f"Decktitel {deck_title!r} nur teilweise genannt: {part[:3]} (erlaubt)")
    else:
        out("REVIEW", "C9", f"Decktitel {deck_title!r} wird im Song nicht genannt (erlaubt; Identität über Performer/Outro?)")
    if r4 and intro_type is not None and intro_type not in INTRO_TYPES:
        out("REVIEW", "C9", f"introType {intro_type!r} außerhalb der alten Liste (frei, nur Signal)")
    if a.corpus and intro_type:
        recent = []
        for f in corpus_files(a.corpus, ".songlines.json"):
            if a.songlines and os.path.abspath(f) == os.path.abspath(a.songlines):
                continue
            try:
                it = json.load(open(f, encoding="utf-8")).get("introType")
            except Exception:
                it = None
            if it:
                recent.append((it, os.path.basename(f)))
            if len(recent) >= INTRO_COOLDOWN - 1:
                break
        for it, fn in recent:
            if it == intro_type:
                out("REVIEW", "C9", f"introType {intro_type!r} schon in {fn}")

    frame_text = " ".join(own_text)
    for p in INTRO_FORBIDDEN:
        if p in frame_text.casefold():
            out("FAIL", "C9", f"Formel im Rahmen: {p!r}")
    # R4.2: offene Ansprache – Bühnenformeln und Publikums-Cues als Signal
    for p in STAGE_FORMULAS:
        if re.search(rf"\b{re.escape(p)}\b", frame_text.casefold()):
            out("REVIEW", "C9R", f"Bühnenformel {p!r}: setzt ein Publikum voraus – Bewohner spricht für wen auch immer da ist")
    for j in tag_beats:
        t = bs[j].strip()[1:-1].strip().casefold()
        if t in CROWD_TAGS and not (isinstance(sj, dict) and sj.get("diegeticCrowd")):
            out("REVIEW", "C9R", f"Publikums-Cue [{bs[j].strip()[1:-1]}] in Beat {j}: gehört er zur Welt des Decks? (sonst weglassen; begründet: songlines.diegeticCrowd)")
    # Benannte Figur im Rahmen nur, wenn sie der verifizierte Performer ist (V-576)
    for j, b in frame + perf_bits:
        m = NAMED_FIGURE.search(b)
        if m and not ((performer and norm_name(m.group(0)) in norm_name(performer.get("cardName"))) or any(norm_name(m.group(0)) in norm_name(x) for x in residents)):
            out("FAIL", "C9P", f"Rahmen nennt Figur {m.group(0)!r} ohne passenden verifizierten Performer (Beat {j})")
    # Kartennamen im Rahmen
    sel_nums = {int(c.get("cardNumber", 0)) for c in selected}
    for j, b in frame:
        bl = b.casefold()
        for c in all_cards:
            core = re.sub(r"^(the|a|an)\s+", "", norm_name(c.get("cardName")))
            if len(core) >= 6 and core in norm_name(bl):
                num = int(c.get("cardNumber", 0))
                if not r4:
                    out("FAIL", "C10", f"Rahmen nennt Kartennamen {c.get('cardName')!r} (stört die Titel-Zuordnung): {b[:50]!r}")
                elif num in sel_nums:
                    out("INFO", "B7b", f"Rahmen-Beat {j} ruft Karte {num} auf (Callback)")
                else:
                    out("WARN", "S5", f"Rahmen-Beat {j} nennt Karte {num} {c.get('cardName')!r}, die nicht gesungen wird")

    # C13: Objekt-Acting + Slop im eigenen Text (hart)
    for j, b in frame + perf_bits:
        m = OBJECT_ACTING.search(b)
        if m:
            out("FAIL", "C13", f"Objekt-Acting (Beat {j}): {m.group(0).strip()[:60]!r}")
        for w in SLOP:
            if re.search(rf"\b{re.escape(w)}", b, re.I):
                out("FAIL", "C13", f"Slop-Wort {w!r} (Beat {j}): {b[:50]!r}")

    _allw = sum(len(WORD.findall(bs[j])) for j in sung)
    _own = sum(len(WORD.findall(b)) for b in own_text)
    if _allw:
        sh = _own / _allw
        out("WARN" if sh > OWN_TEXT_WARN else "INFO", "A2", f"eigener Text (Rahmen + Performer) {sh:.0%} aller Wörter (Richtwert <= {OWN_TEXT_WARN:.0%})")
    if re.search(r"\band then\b", " ".join(bs[j] for j in sung).casefold()):
        out("FAIL", "B7", "„and then“ im Song (KayfabeTip 1)")
    if len(re.findall(r"\btherefore\b", frame_text.casefold())) > 1:
        out("WARN", "B7", "wörtliches „therefore“ mehr als einmal")

    def cw(t):
        return {w.lower() for w in WORD.findall(t) if w.lower() not in STOP and len(w) > 3}
    if intro and outro and not (cw(" ".join(outro)) & cw(" ".join(intro))):
        out("REVIEW", "B7b", "Outro greift kein Wort/Bild aus dem Intro auf")
    share = len(perf_bits) / max(1, len(cb))
    if cb and not (0.25 <= share <= 0.6):
        out("REVIEW", "B6", f"Performer-Text in {share:.0%} der Kartenbeats (alter Richtwert ein Drittel bis die Hälfte)")
    seen = {}
    for j, rest in perf_bits:
        key = rest.casefold()
        if key in seen:
            out("WARN", "B6", f"gleicher Performer-Einschub doppelt: {rest[:40]!r} (Beats {seen[key]} und {j})")
        seen[key] = j
    if a.corpus:
        old = corpus_openers(a.corpus, a.lyrics)
        for j, rest in perf_bits:
            key = rest.strip().casefold()
            key = key if key[-1:] in ".:!?" else key + "."
            hit = old.get(key) or old.get(key[:-1] + ":") or old.get(key[:-1] + "!")
            if hit and len(rest.split()) > 1:
                out("WARN", "B6", f"Einschub {rest!r} schon in {hit}")

    # Klammern, Ziffern, Symbole, Spielwörter im gesungenen Text (Tags ausgenommen)
    whole = "\n".join(bs[j] for j in sung)
    for m in re.finditer(r"[()\[\]{}]", whole):
        out("FAIL", "A6", f"Klammer im gesungenen Text: …{whole[max(0, m.start() - 25):m.start() + 25]!r}…")
    for j, b in enumerate(bs):
        if j not in tag_beats and TAG_LINE.match(b.strip()) and j > 0:
            out("FAIL", "A6", f"Beat {j}: Cue-Tag {b.strip()!r} nicht auf der Liste (Sidecar nutzen)")
    for m in re.finditer(r"[0-9$%#&/@*+=<>~^_|\\€£]", whole):
        out("FAIL", "A7", f"Ziffer/Symbol {m.group()!r}: …{whole[max(0, m.start() - 20):m.start() + 20]!r}…")
    low = whole.casefold()
    names = " ".join((c.get("cardName") or "").casefold() for c in all_cards)
    lores = " ".join(str(c.get("lore") or "").casefold() for c in all_cards)
    for w in sorted(GAME_WORDS):
        if re.search(rf"\b{w}\b", names):
            continue
        bad = [m for m in re.finditer(rf"(\w+)\s+{w}\b", low) if f"{m.group(1)} {w}" not in lores]
        if bad or re.search(rf"(^|[^\w\s])\s*{w}\b", low):
            out("FAIL", "A8", f"Spielwort {w!r}")
    for p in GAME_PHRASES:
        if p in low and p not in names:
            out("FAIL", "A8", f"Spielwort {p!r}")

    # C11: Rufe und Wiederholung – Richtwerte
    shouts = {}
    for seg in re.findall(r"([^.!?;:]*!)", "\n".join(b for b in own_text)):
        s = seg.strip().casefold()
        if s:
            shouts[s] = shouts.get(s, 0) + 1
    for s, n in shouts.items():
        if n > 2:
            out("WARN", "C11", f"Ruf {n}x: {s!r}")
    cnt = {}
    for t in WORD.findall(frame_text):
        t = t.lower()
        if t not in STOP and len(t) > 2:
            cnt[t] = cnt.get(t, 0) + 1
    for t, n in cnt.items():
        if n > 2:
            out("WARN", "C11", f"Wort {t!r} {n}x im eigenen Text")
    sl = [bs[j].casefold() for j in sung if not is_refrain(bs[j])]
    for b in set(sl):
        if sl.count(b) > 1:
            out("WARN", "C11", f"Zeile wiederholt: {b[:50]!r}")

    # Ton (E16b)
    deck_text = " ".join(" ".join(str(c.get(k) or "") for k in ("cardName", "lore", "power")) for c in all_cards).casefold()
    terms = TONE_COMMON + TONE.get(a.tone or deck_id, [])
    for t in terms:
        if re.search(rf"\b{re.escape(t)}\b", low) and not re.search(rf"\b{re.escape(t)}\b", deck_text):
            out("FAIL", "E16b", f"Ton: {t!r} steht nicht im Kartentext und darf nicht in den Song")
    if (a.tone or deck_id) not in TONE:
        out("INFO", "E16b", "kein Ton-Eintrag für dieses Deck; Deck-Hinweise in SONG_SPEC E16b prüfen")

    nfail = sum(1 for l in lines if l[0] == "FAIL")
    print(f"song_gate {GATE_VERSION} lyrics · {os.path.basename(a.lyrics)} · {len(text)} Zeichen · "
          f"{len({id(c) for v in card_beats.values() for c, _, _ in v})}/{len(selected)} Karten · Intro {len(intro)} · "
          f"Brücken {len(bridges)} · Outro {len(outro)} · Performer-Einschübe {len(perf_bits)} · {'R4-Zuordnung' if r4 else 'Titel-Zuordnung'}")
    print(f"lyrics sha256 {sha256(a.lyrics)}")
    for lvl in ("FAIL", "WARN", "REVIEW", "INFO"):
        for l in lines:
            if l[0] == lvl:
                print(f"{l[0]} {l[1]}: {l[2]}")
    print("PASS" if not nfail else f"FAIL ({nfail})")
    return 0 if not nfail else 1


# ---------------- Kritiker ----------------
CRITIC_KEYS = {"schema", "song", "critic", "blind", "scores", "flags", "verdict"}
SCORE_KEYS = {"cardTruth", "performance", "arc", "sayability", "tone", "styleFit"}
FLAG_KEYS = {"beat", "rule", "observation"}
RULE = re.compile(r"^(A[1-9]|B(6|7|7b)|C(8|9|9b|10|11|12|12b|13|13a|13b)|D13|E16b|E17|F)$")
SUGGEST = re.compile(r"(replace|instead|rewrite|could say|should say|try |suggest|better:|e\.g\.|->|→|=>|change to|swap)", re.I)
V2_KEYS = {"schema", "song", "lyricsSha256", "styleSha256", "critic", "blind", "inputs", "questions", "flags", "recommendation"}
V2_INPUTS = {"lyrics", "style", "synopsis"}
V2_QUESTIONS = {   # V-576 Leitfragen; Antwort "yes|partly|no"
    "standalone": "Funktioniert die Nummer ohne Vorwissen?",
    "performer": "Hat der Performer Persönlichkeit?",
    "storyBetweenCards": "Entsteht eine Geschichte zwischen den Karten?",
    "individuality": "Sind Satire, Konflikt und Arrangement individuell?",
    "outro": "Landet das Outro?",
    "transferable": "Wäre der Text mit wenigen Änderungen auf ein anderes Deck übertragbar? (yes = Warnzeichen)",
}
ANSWERS = {"yes", "partly", "no"}
V3_QUESTIONS = dict(V2_QUESTIONS, **{   # R4.2: Bewohner-Performance
    "resident": "Spricht hier eine Figur aus ihrer eigenen Welt – egal, ob andere zuhören oder nur eine Person?",
    "fractalCards": "Treten die Karten als Figuren dieser Welt auf, die etwas über sich behaupten?"})


def quotes_of(ob):
    q = [x for x in ob.split('"')[1::2] if len(x) >= 3]
    q += re.findall(r"“([^”]{3,})”", ob)
    q += re.findall(r"(?<![A-Za-z])['‘]([^'’]{3,}?)['’](?![A-Za-z])", ob)
    return q


def gate_critic(a):
    crit = json.load(open(a.critic, encoding="utf-8"))
    song = open(a.lyrics, encoding="utf-8").read()
    nb = len(beats_of(song))
    fails = []
    F = lambda m: fails.append("FAIL F: " + m)
    if crit.get("schema") in ("kfb.song-critic.v2", "kfb.song-critic.v3"):
        QS = V3_QUESTIONS if crit.get("schema") == "kfb.song-critic.v3" else V2_QUESTIONS
        source = song
        for p in (a.style, a.synopsis):
            if p:
                source += "\n" + open(p, encoding="utf-8").read()
        if set(crit) != V2_KEYS:
            F(f"Felder müssen genau {sorted(V2_KEYS)} sein (zu viel: {sorted(set(crit) - V2_KEYS)}, fehlt: {sorted(V2_KEYS - set(crit))})")
        if crit.get("blind") is not True:
            F("blind muss true sein")
        if not crit.get("critic"):
            F("critic (Modell/Instanz/Sitzung) fehlt")
        if crit.get("lyricsSha256") != sha256(a.lyrics):
            F("lyricsSha256 passt nicht zur eingereichten Fassung (Kritik gilt einer anderen Revision)")
        if a.style and crit.get("styleSha256") != sha256(a.style):
            F("styleSha256 passt nicht zur STYLE-Datei")
        inp = set(crit.get("inputs") or [])
        if not inp or inp - V2_INPUTS or "lyrics" not in inp:
            F(f"inputs nur aus {sorted(V2_INPUTS)} (lyrics Pflicht); Quelle/Dossier/Entwürfe sind nicht blind: {sorted(inp)}")
        qs = crit.get("questions") or {}
        if set(qs) != set(QS):
            F(f"questions braucht genau {sorted(QS)}")
        obs_all = []
        for k, q in qs.items():
            if not isinstance(q, dict) or set(q) != {"answer", "observation"}:
                F(f"question {k}: genau answer + observation")
                continue
            if q.get("answer") not in ANSWERS:
                F(f"question {k}: answer muss yes|partly|no sein")
            obs_all.append((k, str(q.get("observation", "")), 60))
        for i, f in enumerate(crit.get("flags") or []):
            if set(f) != {"beat", "observation"}:
                F(f"flag {i}: genau beat + observation")
            if not (isinstance(f.get("beat"), int) and 0 <= f["beat"] < nb):
                F(f"flag {i}: beat {f.get('beat')!r} außerhalb 0-{nb - 1}")
            obs_all.append((f"flag {i}", str(f.get("observation", "")), 30))
        for k, ob, lim in obs_all:
            if len(ob.split()) > lim:
                F(f"{k}: observation länger als {lim} Wörter")
            # R4.1: die Frage "transferable" fragt selbst nach dem Austausch – "swap" beschreibt dort, es schlägt nichts vor
            sg = SUGGEST.search(re.sub(r"\bswap\w*", "", ob, flags=re.I) if k == "transferable" else ob)
            if sg:
                F(f"{k}: klingt nach Textvorschlag ({sg.group()!r}); Kritiker urteilt nur")
            for q in quotes_of(ob):
                q = q.strip().rstrip(",.;:!?")   # R4.1: Satzzeichen-Konvention innerhalb von Anführungszeichen
                if q.casefold() not in source.casefold():
                    F(f"{k}: Zitat {q!r} steht nicht im Kandidaten (Ersatztext?)")
        rec = crit.get("recommendation")
        if rec not in ("REVISE", "READY_FOR_WS0"):
            F("recommendation muss REVISE oder READY_FOR_WS0 sein")
        neg = [k for k in QS if k != "transferable" and (qs.get(k) or {}).get("answer") == "no"]
        if rec == "READY_FOR_WS0" and (neg or (qs.get("transferable") or {}).get("answer") == "yes"):
            F(f"READY_FOR_WS0 trotz 'no' bei {neg} oder transferable=yes")
        print(f"song_gate {GATE_VERSION} critic {crit.get('schema')[-2:]} · {os.path.basename(a.critic)} · {len(crit.get('flags') or [])} Flags · {rec}")
    else:
        source = song
        for src in (a.source or []):
            source += "\n" + open(src, encoding="utf-8").read()
        if set(crit) - CRITIC_KEYS:
            F(f"unerlaubte Felder {sorted(set(crit) - CRITIC_KEYS)}")
        if crit.get("schema") != "kfb.song-critic.v1":
            F("schema muss kfb.song-critic.v1 oder kfb.song-critic.v2 sein")
        if crit.get("blind") is not True:
            F("blind muss true sein (Kritiker kennt Writer's Room und Vorversionen nicht)")
        if not crit.get("critic"):
            F("critic (Modell/Instanz) fehlt")
        sc = crit.get("scores") or {}
        if set(sc) != SCORE_KEYS:
            F(f"scores braucht genau {sorted(SCORE_KEYS)}")
        for k, v in sc.items():
            if not (isinstance(v, int) and 1 <= v <= 5):
                F(f"score {k}={v!r} (ganze Zahl 1-5)")
        if crit.get("verdict") not in ("pass", "revise"):
            F("verdict muss pass oder revise sein")
        for i, f in enumerate(crit.get("flags") or []):
            if set(f) - FLAG_KEYS:
                F(f"flag {i}: unerlaubte Felder {sorted(set(f) - FLAG_KEYS)}")
            if not (isinstance(f.get("beat"), int) and 0 <= f["beat"] < nb):
                F(f"flag {i}: beat {f.get('beat')!r} ausserhalb 0-{nb - 1}")
            if not RULE.match(str(f.get("rule", ""))):
                F(f"flag {i}: rule {f.get('rule')!r} ist keine Regel aus SONG_SPEC")
            ob = str(f.get("observation", ""))
            if len(ob.split()) > 25:
                F(f"flag {i}: observation länger als 25 Wörter")
            if SUGGEST.search(ob):
                F(f"flag {i}: klingt nach Textvorschlag ({SUGGEST.search(ob).group()!r}); Kritiker urteilt nur")
            for q in quotes_of(ob):
                if q.casefold() not in source.casefold():
                    F(f"flag {i}: Zitat {q!r} steht weder im Song noch in der Kartenquelle (Ersatztext?)")
        if crit.get("verdict") == "pass" and any(v <= 2 for v in sc.values() if isinstance(v, int)):
            F("verdict pass bei einem Score <= 2")
        print(f"song_gate {GATE_VERSION} critic v1 · {os.path.basename(a.critic)} · {len(crit.get('flags') or [])} Flags · verdict {crit.get('verdict')}")
    for x in fails:
        print(x)
    print("PASS" if not fails else f"FAIL ({len(fails)})")
    return 0 if not fails else 1


# ---------------- STYLE ----------------
STYLE_BANNED = ["jazz noir", "noir", "downtempo", "ballad", "ambient", "lo-fi", "lofi", "chill", "slow"]
GENRE_FAMILIES = {"jazz": ["jazz", "bebop", "swing jazz"], "electro-swing": ["electro-swing", "electro swing"], "balkan": ["balkan"],
                  "afro": ["afrobeat", "afro-funk", "highlife"], "funk": ["funk"], "disco": ["disco", "nu-disco"], "latin": ["cumbia", "samba", "salsa", "bossa"],
                  "ska": ["ska", "rocksteady"], "bigbeat": ["big beat", "big-beat", "breakbeat"], "bollywood": ["bollywood", "bhangra"], "surf": ["surf"],
                  "hiphop": ["hip-hop", "hip hop", "boom-bap", "boom bap"], "desert": ["desert", "tuareg"], "soul": ["soul"], "cabaret": ["cabaret"],
                  "rock": ["glam rock", "hard rock", "arena rock", "rockabilly", "punk"], "reggae": ["reggae", "dancehall", "dub"],
                  "gospel": ["gospel"], "country": ["country", "bluegrass", "honky-tonk"], "electronic": ["synthwave", "electro", "techno", "house"]}
STYLE_ROLE_WORDS = ["narrator", "announcer", "host", "referee", "wrestler", "doctor", "mayor", "teacher", "preacher", "character", "story", "scene"]
STYLE_MAX = 1000


def style_family(text):
    t = text.casefold()
    for fam, keys in GENRE_FAMILIES.items():
        if any(re.search(rf"(?<![a-z]){re.escape(k)}(?![a-z])", t) for k in keys):
            return fam
    return None


def style_variants(txt):
    return [v.strip() for v in re.split(r"(?im)^\s*(?:style\s*)?[ab]\s*[:\-·]", txt) if v.strip()] or [txt.strip()]


def gate_style(a):
    txt = open(a.style, encoding="utf-8").read()
    lines = []
    out = lambda lvl, msg: lines.append((lvl, msg))
    sj = json.load(open(a.songlines, encoding="utf-8")) if a.songlines else {}
    exc = (sj.get("bpmException") or "") if isinstance(sj, dict) else ""
    variants = style_variants(txt)
    if len(variants) < 2:
        out("WARN", "D13: nur eine STYLE-Variante (Richtwert: A und B, musikalisch verschieden)")
    if len(variants) >= 2 and style_family(variants[0]) == style_family(variants[1]):
        out("REVIEW", f"D13: A und B in derselben Genre-Familie {style_family(variants[0])!r}")
    banned_names = []
    if isinstance(sj, dict) and sj.get("performer"):
        banned_names.append(str(sj["performer"].get("name") or ""))
    if isinstance(sj, dict):
        banned_names += [str(p.get("model") or "") for p in (sj.get("performers") or [])]
    if a.deck:
        deck = json.load(open(a.deck, encoding="utf-8"))
        banned_names.append(str(deck.get("title") or ""))
        sel = set(int(x) for x in (sj.get("bestOf") or [])) if isinstance(sj, dict) else set()
        banned_names += [str(c.get("cardName") or "") for c in deck.get("cards", []) if not sel or int(c.get("cardNumber", 0)) in sel]
    for k, v in enumerate(variants):
        low = v.casefold()
        if len(v) > STYLE_MAX:
            out("WARN", f"D13: Variante {k + 1}: {len(v)} Zeichen (Suno-Stilfeld, Richtwert <= {STYLE_MAX})")
        bpms = [int(x) for x in re.findall(r"(\d{2,3})\s*bpm", low)]
        if not bpms:
            out("WARN", f"D13b: Variante {k + 1}: keine BPM-Angabe")
        elif not all(100 <= b <= 130 for b in bpms):
            out("INFO" if exc else "WARN", f"D13b: Variante {k + 1}: BPM {bpms} außerhalb 100-130" + (f" (Ausnahme: {exc})" if exc else " ohne dokumentierte Ausnahme"))
        for w in STYLE_BANNED:
            if re.search(rf"\b{re.escape(w)}\b", low):
                out("INFO" if exc else "WARN", f"D13b: Variante {k + 1}: Stilwort {w!r}" + ("" if exc else " ohne dokumentierten Zweck"))
        for n in banned_names:   # V-362: STYLE rein musikalisch – keine Figuren, Karten, Decktitel
            core = re.sub(r"^(the|a|an)\s+", "", norm_name(n))
            if len(core) >= 5 and re.search(rf"(?<![a-z]){re.escape(core)}(?![a-z])", norm_name(low)):
                out("FAIL", f"V-362: Variante {k + 1} nennt {n!r} (STYLE nur Musik)")
        for w in STYLE_ROLE_WORDS:
            if re.search(rf"\b{w}\b", low):
                out("WARN", f"V-362: Variante {k + 1}: Rollen-/Geschichtswort {w!r} (Stimme musikalisch beschreiben)")
    fam = style_family(variants[0])
    if a.batch:   # V-576: Hauptgenres im Batch wiederholen sich nicht (hart)
        for f in a.batch:
            if os.path.abspath(f) == os.path.abspath(a.style):
                continue
            if fam and style_family(style_variants(open(f, encoding="utf-8").read())[0]) == fam:
                out("FAIL", f"D13b: Hauptgenre-Familie {fam!r} schon im Batch: {os.path.basename(f)}")
    if a.corpus and fam:
        recent = [f for f in corpus_files(a.corpus, ".style.txt") if os.path.abspath(f) != os.path.abspath(a.style)][:4]
        for f in recent:
            if style_family(style_variants(open(f, encoding="utf-8").read())[0]) == fam:
                out("WARN", f"D13b: Genre-Familie {fam!r} auch in {os.path.basename(f)} (Albumpräferenz: Rotation)")
    nfail = sum(1 for l in lines if l[0] == "FAIL")
    print(f"song_gate {GATE_VERSION} style · {os.path.basename(a.style)} · Familie A {fam} · {len(variants)} Variante(n) · "
          f"{', '.join(str(len(v)) for v in variants)} Zeichen")
    for lvl in ("FAIL", "WARN", "REVIEW", "INFO"):
        for l in lines:
            if l[0] == lvl:
                print(f"{l[0]} {l[1]}")
    print("PASS" if not nfail else f"FAIL ({nfail})")
    return 0 if not nfail else 1


# ---------------- Album (nicht blind) ----------------
def gate_album(a):
    rows, fails = [], []
    for p in a.songlines:
        sj = json.load(open(p, encoding="utf-8"))
        base = p[: -len(".songlines.json")]
        lyr = open(base + ".suno.txt", encoding="utf-8").read() if os.path.isfile(base + ".suno.txt") else ""
        sty = open(base + ".style.txt", encoding="utf-8").read() if os.path.isfile(base + ".style.txt") else ""
        vs = style_variants(sty) if sty else [""]
        bs = [b for b in beats_of(lyr) if not is_tag(b)] if lyr else []
        bpm = re.findall(r"(\d{2,3})\s*bpm", vs[0].casefold())
        perf = " + ".join(p.get("model", "") for p in (sj.get("performers") or [])) or (sj.get("performer") or {}).get("name", "–")
        rows.append({"deck": sj.get("deckId"), "performer": perf,
                     "famA": style_family(vs[0]), "famB": style_family(vs[1]) if len(vs) > 1 else None, "bpmA": bpm[0] if bpm else "–",
                     "structure": sj.get("structure", "–"), "open": bs[0] if bs else "", "close": bs[-2] if len(bs) > 1 else "",
                     "cards": len(sj.get("bestOf") or []), "chars": len(lyr)})
    print(f"song_gate {GATE_VERSION} album · {len(rows)} Tracks (nicht blind, redaktioneller Vergleich)")
    print("| Deck | Performer | Genre A | Genre B | BPM A | Struktur | Karten | Zeichen |")
    print("|---|---|---|---|---|---|---|---|")
    for r in rows:
        print(f"| {r['deck']} | {r['performer']} | {r['famA']} | {r['famB']} | {r['bpmA']} | {r['structure']} | {r['cards']} | {r['chars']} |")
    for i, r in enumerate(rows):
        for s in rows[i + 1:]:
            if r["famA"] and r["famA"] == s["famA"]:
                fails.append(f"FAIL D13b: Hauptgenre {r['famA']!r} doppelt ({r['deck']}, {s['deck']})")
            if r["performer"] != "–" and r["performer"] == s["performer"]:
                print(f"REVIEW C9P: gleicher Performer {r['performer']!r} ({r['deck']}, {s['deck']})")
            for key in ("open", "close"):
                ga = {tuple(r[key].casefold().split()[i:i + 3]) for i in range(max(0, len(r[key].split()) - 2))}
                gb = {tuple(s[key].casefold().split()[i:i + 3]) for i in range(max(0, len(s[key].split()) - 2))}
                common = [" ".join(g) for g in ga & gb if not set(g) <= STOP]
                if common:
                    print(f"REVIEW C9: {key} ähnlich ({r['deck']}, {s['deck']}): {common[:3]}")
    for x in fails:
        print(x)
    print("PASS" if not fails else f"FAIL ({len(fails)})")
    return 0 if not fails else 1


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    l = sub.add_parser("lyrics")
    l.add_argument("lyrics"); l.add_argument("--deck", required=True); l.add_argument("--songlines"); l.add_argument("--media")
    l.add_argument("--registry"); l.add_argument("--catalog"); l.add_argument("--cards"); l.add_argument("--tone"); l.add_argument("--corpus", nargs="*")
    c = sub.add_parser("critic")
    c.add_argument("critic"); c.add_argument("--lyrics", required=True); c.add_argument("--style"); c.add_argument("--synopsis")
    c.add_argument("--source", nargs="*")
    st = sub.add_parser("style")
    st.add_argument("style"); st.add_argument("--songlines"); st.add_argument("--deck"); st.add_argument("--batch", nargs="*")
    st.add_argument("--corpus", nargs="*")
    al = sub.add_parser("album")
    al.add_argument("songlines", nargs="+")
    a = ap.parse_args()
    sys.exit({"lyrics": gate_lyrics, "critic": gate_critic, "style": gate_style, "album": gate_album}[a.cmd](a))
