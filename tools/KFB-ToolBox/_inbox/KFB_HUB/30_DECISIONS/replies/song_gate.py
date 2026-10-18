#!/usr/bin/env python3
"""KFB Song-Tor (SONG_SPEC_R3 ab R3.2, V-419; R3.3 V-424: introType, Refrain, Callbacks, KayfabeTip 1, Opener-Fenster 15 Songs): EIN Prüfskript für alle Deck-Songs. Keine Kopien je Deck.

  python3 song_gate.py lyrics <track.suno.txt> --deck <deck.json> [--songlines <x.songlines.json>] [--media <deck.pdf.json>]
                       [--cards 5-60] [--tone <deckId>] [--corpus <datei_oder_ordner> ...]
  python3 song_gate.py critic <critic.json> --lyrics <track.suno.txt>

lyrics: Rahmen (C8/C12), Klammern (A6), Ziffern/Symbole (A7), Spielwörter (A8), Kartenreihenfolge und -abdeckung (C10),
        Kartenteil 80-95 Zeichen (A4), Opener einmalig im Song und nicht in früheren Songs (B6), Hooks/Rufe und
        Wortwiederholung im Nicht-Kartentext (C11), Intro >= 2 Beats ohne Formel (C9), Ton (E16b), Kartenwortanteil (A2).
critic: prüft das Urteil des externen Kritikers (F): festes Schema, nur Urteile, kein Ersatztext.
Exit 0 = PASS, Exit 1 = FAIL. Jede Zeile der Ausgabe nennt die Regel.
"""
import argparse, json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from triplet_set_check import GRAMMAR, FLUFF, vocab, stems  # gleiche Wortlogik wie das Triplet-Tor

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
OWN_TEXT_WARN, OWN_TEXT_FAIL = 0.30, 1.01   # R3.5 (Georg 18.10.: Richtwert, nicht sklavisch) – nur Hinweis, kein FAIL
FUNC_EXTRA = {"don't", "doesn't", "didn't", "aren't", "isn't", "wasn't", "weren't", "can't", "won't", "till", "until", "before", "after", "both", "each", "too", "also"}  # R3.5: Funktionswörter
# C13 (R3.4, V-435): object-acting + slop
THINGS = r"(ledger|ledgers|audit|audits|receipt|receipts|record|records|file|files|paper|papers|money|number|numbers|desk|door|office|stage|night|day|clock|watch|pocket watch|time|truth|silence|story|stories|deck|card|cards|question|answer|mind|dream|verdict|bell|seat|ticket|fee|whistle|crown|city|book|books|history|archive|evidence|page|pages|entry|entries|tablet|tablets|world|memory|account|accounting|figures|keys|blueprints|map|ink|coin|vault)"
ACTS = r"(begins?|began|knows?|remembers?|waits?|whispers?|stands?|stood|wanders?|reach(es)?|summons?|commissions?|asks?|tells?|refuses?|keeps?|kept|holds?|buys?|offers?|appeals?|convicts?|disputes?|demands?|bills?|forgets?|lies|sleeps?|dreams?|wants?|hides?|watches|listens?|counts?|confess(es)?|never|cannot|can't|still|is late|precedes?|expose[sd]?|remain[s]?)"
OBJECT_ACTING = re.compile(rf"(?:^|[.!?]\s+)(?:the|a|an|every|no|this|that|its|his|her)\s+(?:\w+\s+){{0,2}}?{THINGS}\s+(?:\w+\s+){{0,1}}?{ACTS}\b", re.I)
SLOP = ["tapestry", "testament", "whisper", "echo", "symphony", "delve", "unravel", "journey", "in the end", "little did", "a reminder that", "stands as", "stood trial"]
INTRO_TYPES = {"question", "scene", "found_object", "bold_claim", "confession", "misdirection"}  # C9 (R3.3)
OPENER_WINDOW = 15   # B6 (R3.3): gleicher Opener frühestens nach 15 Songs
INTRO_COOLDOWN = 3   # C9 (R3.3): gleicher Intro-Typ nicht zweimal in 3 aufeinanderfolgenden Songs


def beats_of(text):
    return [b for b in text.strip().split("\n\n")]


def strip_paren(s):
    return re.sub(r"\s*\([^)]*\)", "", s).strip()


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
            k = low.find(v.casefold()) if not v.casefold().startswith(("the ", "a ")) else low.find(v.casefold())
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
        if os.path.abspath(f) == os.path.abspath(self_path):
            continue
        for b in beats_of(open(f, encoding="utf-8").read()):
            m = re.match(r"^([^.:!?;,]{1,40}[.:!?])\s", b)
            if m:
                out.setdefault(m.group(1).strip().casefold(), os.path.basename(f))
    return out


def gate_lyrics(a):
    text = open(a.lyrics, encoding="utf-8").read()
    deck = json.load(open(a.deck, encoding="utf-8"))
    cards = parse_range(a.cards, sorted(deck.get("cards", []), key=lambda c: int(c.get("cardNumber", 0))))
    fails, warns = [], []
    songlines, skip, refrain, intro_type = {}, set(), "", None
    if a.songlines:
        sj = json.load(open(a.songlines, encoding="utf-8"))
        if isinstance(sj, dict):
            refrain, intro_type = (sj.get("refrain") or "").strip(), sj.get("introType")
            skip = {int(x) for x in (sj.get("metaSkipped") or sj.get("metaSkip") or [])}
            sj = sj.get("songLineChanges") or []
        for e in sj:
            songlines[e.get("cardNumber")] = e
    cards = [c for c in cards if int(c.get("cardNumber", 0)) not in skip]
    rewrites = [e for e in songlines.values() if str(e.get("rule", "")).upper() != "A7"]
    if len(rewrites) > max(1, len(cards) // 10):  # A5: Zahlen-Ausschreibungen (A7) zählen nicht mit
        fails.append(f"FAIL A5: {len(rewrites)} Wort-songLines bei {len(cards)} Karten (max 10 %, A7-Ausschreibungen ausgenommen)")
    deck_vocab = set()
    deck_text = ""
    for c in deck.get("cards", []):
        t = " ".join(str(c.get(k) or "") for k in ("cardName", "lore", "power"))
        deck_text += " " + t.casefold()
        deck_vocab |= vocab(t)
    for e in songlines.values():
        deck_vocab |= vocab(e.get("songLine") or "")
    art = {}
    if a.media:  # A2/V-377: Bildwörter aus artworkPrompt sind erlaubt – R3.5: nur die der EIGENEN Karte
        mj = json.load(open(a.media, encoding="utf-8"))
        for c in (mj.get("cards") or []) if isinstance(mj, dict) else mj:
            t = str(c.get("artworkPrompt") or c.get("imageMotif") or "")
            deck_vocab |= vocab(t)
            if c.get("cardNumber") is not None:
                art[str(c.get("cardNumber"))] = t
            if c.get("name") or c.get("cardName"):
                art["N:" + str(c.get("name") or c.get("cardName")).strip().casefold()] = t

    def own_vocab(c):  # R3.5 (Georg 18.10.): Kartenteil nur aus Wörtern der eigenen Karte
        t = " ".join(str(c.get(k) or "") for k in ("cardName", "lore", "power"))
        t += " " + (art.get(str(c.get("cardNumber"))) or art.get("N:" + str(c.get("cardName") or "").strip().casefold(), ""))
        e = songlines.get(c.get("cardNumber")) or songlines.get(str(c.get("cardNumber"))) or {}
        return vocab(t + " " + str(e.get("songLine") or ""))
    F = lambda rule, msg: fails.append(f"FAIL {rule}: {msg}")
    W = lambda rule, msg: warns.append(f"WARN {rule}: {msg}")

    if len(text) >= 5000:
        F("C12", f"{len(text)} Zeichen (>= 5000) -> zwei Tracks an einer Seitengrenze (C12b)")
    bs = beats_of(text)
    if not bs or bs[0].strip() != "[Spoken Word]":
        F("C8", "erster Beat ist nicht [Spoken Word]")
    if bs[-1].strip() != END_LINE:   # R3.6 (Georg 18.10.): „Stay Fluffy, Folks!“
        F("C12", f"letzter Beat ist nicht {END_LINE!r} allein")
    for i, b in enumerate(bs):
        if "\n" in b:
            F("C8", f"Beat {i}: mehrere Zeilen ohne Leerzeile: {b.splitlines()[0][:60]!r}")
        if b != b.strip() or not b:
            F("C8", f"Beat {i}: leer oder Leerraum am Rand (doppelte Leerzeile?)")
    body = bs[1:-1]

    # Karten zuordnen
    idx, card_beats, frame = 0, [], []
    for j, b in enumerate(body):
        ci, k = find_card(b, cards, idx, songlines)
        if ci is None:
            frame.append((j, b))
            continue
        if ci != idx:
            F("C10", f"Karten {[c.get('cardNumber') for c in cards[idx:ci]]} fehlen oder Reihenfolge falsch (bei Beat {j + 1})")
            if idx == 0:   # R3.4b: an intro beat that names a later card makes the matcher jump (1001 R4.5 'Montreal Screwjob')
                F("C10", f"Beat {j + 1} wurde als Karte {cards[ci].get('cardNumber')} erkannt, bevor Karte {cards[0].get('cardNumber')} kam – nennt das Intro einen Kartennamen?")
        card_beats.append((j, b, cards[ci], k))
        idx = ci + 1
    if idx < len(cards):
        F("C10", f"Karten fehlen am Ende: {[c.get('cardNumber') for c in cards[idx:]]}")
    first_card = card_beats[0][0] if card_beats else len(body)
    last_card = card_beats[-1][0] if card_beats else -1
    intro = [b for j, b in frame if j < first_card]
    outro = [b for j, b in frame if j > last_card]
    middle = [b for j, b in frame if first_card < j < last_card]
    if not outro:
        F("C12", f"kein Outro-Beat vor {END_LINE!r}")
    def is_refrain(b):
        if not refrain:
            return False
        rw, bw = set(WORD.findall(refrain.lower())), set(WORD.findall(b.lower()))
        return bool(rw) and len(rw & bw) / len(rw) >= 0.6 and len(bw) <= len(rw) + 3
    ref_beats = [b for b in intro + outro + middle if is_refrain(b)]
    intro = [b for b in intro if not is_refrain(b)]
    outro = [b for b in outro if not is_refrain(b)]
    middle = [b for b in middle if not is_refrain(b)]
    if refrain:
        if len(refrain.split()) > 8:
            F("C11", f"Refrain länger als 8 Wörter: {refrain!r}")
        if len(ref_beats) > 3:
            F("C11", f"Refrain {len(ref_beats)}x (max 3)")
    for b in middle:
        F("C10", f"Beat ohne Karte zwischen Karten: {b[:60]!r}")
    # R3.4b: frame beats must not contain card names of the range (breaks card recognition and spoils the reveal)
    _names = [(c.get("cardNumber"), str(c.get("cardName") or "").strip()) for c in cards]
    for b in intro + outro:
        bl = b.casefold()
        for num, nm in _names:
            core = re.sub(r"^(the|a|an)\s+", "", nm.casefold())
            if len(core) >= 6 and core in bl:
                F("C10", f"Rahmen nennt Kartennamen {nm!r} (Karte {num}): {b[:60]!r}")
    if len(intro) < 2:
        F("C9", f"Intro ohne Refrain hat {len(intro)} Beat(s); mindestens 2 eigene Beats")
    if a.songlines and intro_type not in INTRO_TYPES:
        F("C9", f"introType fehlt oder ungültig ({intro_type!r}); erlaubt: {sorted(INTRO_TYPES)}")
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
                F("C9", f"introType {intro_type!r} schon in {fn} (Cooldown {INTRO_COOLDOWN} Songs)")

    frame_text = " ".join(intro + outro + middle)
    # C9 (R3.4): Kaltstart – erster Intro-Beat nennt das Deck (Titelwörter)
    title = str(deck.get("title") or deck.get("deckTitle") or "")
    tw = {w.lower() for w in WORD.findall(title) if w.lower() not in STOP and len(w) > 3}
    if intro and tw and not (tw & {w.lower() for w in WORD.findall(intro[0])}):
        F("C9", f"Kaltstart fehlt: erster Intro-Beat nennt das Deck nicht (Titelwörter {sorted(tw)[:6]})")
    for p in INTRO_FORBIDDEN:
        if p in frame_text.casefold():
            F("C9", f"Formel im Rahmen: {p!r}")
    if "frizzlebob" in frame_text.casefold() or re.search(r"\b(uncle|onkel)\b(?!\s+sam)|\brabbit\b(?!\s+holes?)", frame_text, re.I):   # R3.6: neutraler Erzähler, andere Figuren performen
        F("C9", "Rahmen nennt FrizzleBob bzw. eine feste Erzählerfigur (uncle/rabbit) – Erzähler bleibt namenlos")

    # C13 (R3.4): Objekt-Acting + Slop im Rahmen (Intro/Outro); Opener werden unten geprüft
    for b in intro + outro:
        m = OBJECT_ACTING.search(b)
        if m:
            F("C13", f"Objekt-Acting: {m.group(0).strip()[:60]!r}")
        for w in SLOP:
            if re.search(rf"\b{re.escape(w)}", b, re.I):
                F("C13", f"Slop-Wort {w!r}: {b[:50]!r}")
    # Opener + Kartenteil
    openers, seen = [], {}
    for j, b, c, k in card_beats:
        op = b[:k].strip()
        part = b[k:].strip()
        if op:
            openers.append((j, op))
            m = OBJECT_ACTING.search(op)
            if m:
                F("C13", f"Objekt-Acting im Opener (Beat {j + 1}): {op[:50]!r}")
            key = op.casefold().rstrip(".:!?,; ")
            if key in seen:
                F("B6", f"Opener doppelt: {op!r} (Beats {seen[key] + 1} und {j + 1})")
            seen[key] = j
        if not 80 <= len(part) <= 95:
            F("A4", f"Karte {c.get('cardNumber')}: Kartenteil {len(part)} Zeichen (80-95): {part[:50]!r}")
        toks = WORD.findall(part)
        ov = own_vocab(c)
        foreign = [t for t in toks if t.lower() not in STOP and t.lower() not in FUNC_EXTRA and not (stems(t) & ov)]
        fl = [t for t in toks if t.lower() in FLUFF]
        if len(fl) > 1:
            F("A2", f"Karte {c.get('cardNumber')}: mehr als ein Fluff-Wort")
        if foreign:  # R3.5: ein einzelnes fremdes Wort = Hinweis, ab zwei = FAIL (Georg 18.10.: Flow vor Buchstabe)
            (F if len(foreign) > 1 else W)("A2", f"Karte {c.get('cardNumber')}: Wörter nicht aus der eigenen Karte: {foreign}")
    # R3.5: Anteil eigener Text (Rahmen + Opener) an allen Wörtern – Georg 18.10.: Karte im Fokus
    _allw = sum(len(WORD.findall(b)) for b in body)
    _own = sum(len(WORD.findall(b)) for b in intro + outro + middle) + sum(len(WORD.findall(op)) for _, op in openers)
    if _allw:
        _sh = _own / _allw
        (F if _sh > OWN_TEXT_FAIL else W if _sh > OWN_TEXT_WARN else (lambda *x: None))("A2", f"eigener Text (Rahmen + Opener) {_sh:.0%} aller Wörter (Warnung > {OWN_TEXT_WARN:.0%}, FAIL > {OWN_TEXT_FAIL:.0%})")
    # B7 (KayfabeTip 1): "and then" verboten, wörtliches "therefore" höchstens einmal im Opener-/Rahmentext
    bridge_text = " ".join([op for _, op in openers] + intro + outro).casefold()
    if re.search(r"\band then\b", " ".join(body).casefold()):
        F("B7", "„and then“ im Song (KayfabeTip 1: therefore/but, nie and-then)")
    if len(re.findall(r"\btherefore\b", bridge_text)) > 1:
        F("B7", "wörtliches „therefore“ mehr als einmal (nicht-wörtlich verknüpfen)")
    # B7b: Callbacks – Opener greift Name/Bild einer früheren Karte auf
    def cw(t):
        return {w.lower() for w in WORD.findall(t) if w.lower() not in STOP and len(w) > 3}
    callbacks, seen_vocab = 0, set()
    by_beat = {j: (c, k) for j, b, c, k in card_beats}
    for j, b, c, k in card_beats:
        op = b[:k]
        own = cw(" ".join(str(c.get(x) or "") for x in ("cardName", "lore")))
        if op and (cw(op) - own) & seen_vocab:
            callbacks += 1
        seen_vocab |= cw(" ".join(str(c.get(x) or "") for x in ("cardName", "lore")))
    if card_beats and callbacks < 2:
        F("B7b", f"nur {callbacks} Callback(s) im Opener (mindestens 2: Name oder Bild einer früheren Karte)")
    if intro and outro and not (cw(" ".join(outro)) & cw(" ".join(intro))):
        W("B7b", "Outro greift kein Bild aus dem Intro auf")
    share = len(openers) / max(1, len(card_beats))
    if card_beats and not (0.25 <= share <= 0.6):
        W("B6", f"Opener auf {share:.0%} der Kartenzeilen (Ziel etwa ein Drittel bis die Hälfte)")
    if a.corpus:
        old = corpus_openers(a.corpus, a.lyrics)
        for j, op in openers:
            key = op.strip().casefold()
            key = key if key[-1:] in ".:!?" else key + "."
            hit = old.get(key) or old.get(key[:-1] + ":") or old.get(key[:-1] + "!")
            if hit:
                (F if len(op.split()) > 1 else W)("B6", f"Opener {op!r} schon in {hit}")

    # Klammern, Ziffern, Symbole, Spielwörter (ganzer Song ausser [Spoken Word])
    whole = "\n".join(body)
    for m in re.finditer(r"[(\[{]", whole):
        F("A6", f"Klammer im Text: …{whole[max(0, m.start() - 25):m.start() + 25]!r}…")
    for m in re.finditer(r"[0-9$%#&/@*+=<>~^_|\\€£]", whole):
        F("A7", f"Ziffer/Symbol {m.group()!r}: …{whole[max(0, m.start() - 20):m.start() + 20]!r}…")
    low = whole.casefold()
    names = " ".join((c.get("cardName") or "").casefold() for c in deck.get("cards", []))
    lores = " ".join(str(c.get("lore") or "").casefold() for c in deck.get("cards", []))
    for w in sorted(GAME_WORDS):
        if re.search(rf"\b{w}\b", names):
            continue
        # R3.4c: allowed when the lyric keeps the card's own lore phrase (e.g. "crime scene")
        bad = [m for m in re.finditer(rf"(\w+)\s+{w}\b", low) if f"{m.group(1)} {w}" not in lores]
        if bad or re.search(rf"(^|[^\w\s])\s*{w}\b", low):
            F("A8", f"Spielwort {w!r}")
    for p in GAME_PHRASES:
        if p in low and p not in names:
            F("A8", f"Spielwort {p!r}")

    # Hooks/Rufe + Wortwiederholung im Nicht-Kartentext
    shouts = {}
    whole_nr = "\n".join(b for b in body if not is_refrain(b))
    for seg in re.findall(r"([^.!?;:]*!)", whole_nr):
        s = seg.strip().casefold()
        if s:
            shouts[s] = shouts.get(s, 0) + 1
    for s, n in shouts.items():
        if n > 2:
            F("C11", f"Ruf {n}x: {s!r}")
    nc = " ".join(intro + outro + middle + [op for _, op in openers])
    cnt = {}
    for t in WORD.findall(nc):
        t = t.lower()
        if t not in STOP and len(t) > 2:
            cnt[t] = cnt.get(t, 0) + 1
    for t, n in cnt.items():
        if n > 2:
            F("C11", f"Wort {t!r} {n}x im Rahmen/Opener-Text")
    lines = [b.casefold() for b in body if not is_refrain(b)]
    for b in set(lines):
        if lines.count(b) > 1:
            F("C11", f"Zeile wiederholt: {b[:50]!r}")

    # Ton (E16b): nur Begriffe, die der Kartentext selbst nicht enthält
    terms = TONE_COMMON + TONE.get(a.tone or deck.get("deckId", ""), [])
    for t in terms:
        if re.search(rf"\b{re.escape(t)}\b", low) and not re.search(rf"\b{re.escape(t)}\b", deck_text):
            F("E16b", f"Ton: {t!r} steht nicht im Kartentext und darf nicht in den Song")
    if (a.tone or deck.get("deckId")) not in TONE:
        W("E16b", "kein Ton-Eintrag für dieses Deck in song_gate.py; Deck-Hinweise in SONG_SPEC E16b prüfen")

    print(f"song_gate lyrics · {os.path.basename(a.lyrics)} · {len(text)} Zeichen · {len(card_beats)}/{len(cards)} Karten · "
          f"Intro {len(intro)} · Outro {len(outro)} · Opener {len(openers)}")
    for x in fails + warns:
        print(x)
    print("PASS" if not fails else f"FAIL ({len(fails)})")
    return 0 if not fails else 1


CRITIC_KEYS = {"schema", "song", "critic", "blind", "scores", "flags", "verdict"}
SCORE_KEYS = {"cardTruth", "performance", "arc", "sayability", "tone", "styleFit"}
FLAG_KEYS = {"beat", "rule", "observation"}
RULE = re.compile(r"^(A[1-9]|B(6|7|7b)|C(8|9|9b|10|11|12|12b|13|13a|13b)|D13|E16b|E17|F)$")
SUGGEST = re.compile(r"(replace|instead|rewrite|could say|should say|try |suggest|better:|e\.g\.|->|→|=>|change to|swap)", re.I)


def gate_critic(a):
    crit = json.load(open(a.critic, encoding="utf-8"))
    song = open(a.lyrics, encoding="utf-8").read()
    source = song
    for src in (a.source or []):  # F20 (R3.3): Zitate aus der Kartenquelle sind erlaubt (Kartentreue-Hinweise)
        source += "\n" + open(src, encoding="utf-8").read()
    nb = len(beats_of(song))
    fails = []
    F = lambda m: fails.append("FAIL F: " + m)
    if set(crit) - CRITIC_KEYS:
        F(f"unerlaubte Felder {sorted(set(crit) - CRITIC_KEYS)}")
    if crit.get("schema") != "kfb.song-critic.v1":
        F("schema muss kfb.song-critic.v1 sein")
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
        quotes = [q for q in ob.split('"')[1::2] if len(q) >= 3]  # gerade Anführungszeichen paarweise
        quotes += re.findall(r"“([^”]{3,})”", ob)
        quotes += re.findall(r"(?<![A-Za-z])['‘]([^'’]{3,}?)['’](?![A-Za-z])", ob)  # Apostrophe in Wörtern sind keine Zitate
        for q in quotes:
            if q.casefold() not in source.casefold():
                F(f"flag {i}: Zitat {q!r} steht weder im Song noch in der Kartenquelle (Ersatztext?)")
    if crit.get("verdict") == "pass" and any(v <= 2 for v in sc.values() if isinstance(v, int)):
        F("verdict pass bei einem Score <= 2")
    print(f"song_gate critic · {os.path.basename(a.critic)} · {len(crit.get('flags') or [])} Flags · verdict {crit.get('verdict')}")
    for x in fails:
        print(x)
    print("PASS" if not fails else f"FAIL ({len(fails)})")
    return 0 if not fails else 1


STYLE_BANNED = ["jazz noir", "noir", "downtempo", "ballad", "ambient", "lo-fi", "lofi", "chill", "slow"]
GENRE_FAMILIES = {"jazz": ["jazz", "bebop", "swing jazz"], "electro-swing": ["electro-swing", "electro swing"], "balkan": ["balkan"],
                  "afro": ["afrobeat", "afro-funk", "highlife"], "funk": ["funk"], "disco": ["disco", "nu-disco"], "latin": ["cumbia", "samba", "salsa", "bossa"],
                  "ska": ["ska", "rocksteady"], "bigbeat": ["big beat", "big-beat", "breakbeat"], "bollywood": ["bollywood", "bhangra"], "surf": ["surf"],
                  "hiphop": ["hip-hop", "hip hop", "boom-bap", "boom bap"], "desert": ["desert", "tuareg"], "soul": ["soul"], "cabaret": ["cabaret"]}


def style_family(text):
    t = text.casefold()
    for fam, keys in GENRE_FAMILIES.items():
        if any(k in t for k in keys):
            return fam
    return None


def gate_style(a):
    txt = open(a.style, encoding="utf-8").read()
    fails = []
    variants = [v for v in re.split(r"(?im)^\s*(?:style\s*)?[ab]\s*[:\-·]", txt) if v.strip()] or [txt]
    for k, v in enumerate(variants):
        low = v.casefold()
        bpms = [int(x) for x in re.findall(r"(\d{2,3})\s*bpm", low)]
        if not bpms:
            fails.append(f"FAIL D13b: Variante {k + 1}: keine BPM-Angabe")
        elif not all(100 <= b <= 130 for b in bpms):
            fails.append(f"FAIL D13b: Variante {k + 1}: BPM {bpms} außerhalb 100–130")
        for w in STYLE_BANNED:
            if re.search(rf"\b{re.escape(w)}\b", low):
                fails.append(f"FAIL D13b: Variante {k + 1}: verbotenes Stilwort {w!r}")
    fam = style_family(variants[0])
    if a.corpus and fam:
        recent = [f for f in corpus_files(a.corpus, ".style.txt") if os.path.abspath(f) != os.path.abspath(a.style)][:4]
        for f in recent:
            if style_family(open(f, encoding="utf-8").read().split("\n\n")[0]) == fam:
                fails.append(f"FAIL D13b: Genre-Familie {fam!r} schon in {os.path.basename(f)} (Rotation über 5 Songs)")
    print(f"song_gate style · {os.path.basename(a.style)} · Familie {fam}")
    for x in fails:
        print(x)
    print("PASS" if not fails else f"FAIL ({len(fails)})")
    return 0 if not fails else 1


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    l = sub.add_parser("lyrics")
    l.add_argument("lyrics"); l.add_argument("--deck", required=True); l.add_argument("--songlines"); l.add_argument("--media")
    l.add_argument("--cards"); l.add_argument("--tone"); l.add_argument("--corpus", nargs="*")
    c = sub.add_parser("critic")
    c.add_argument("critic"); c.add_argument("--lyrics", required=True); c.add_argument("--source", nargs="*")
    st = sub.add_parser("style")
    st.add_argument("style"); st.add_argument("--corpus", nargs="*")
    a = ap.parse_args()
    sys.exit(gate_lyrics(a) if a.cmd == "lyrics" else gate_critic(a) if a.cmd == "critic" else gate_style(a))
