#!/usr/bin/env python3
"""KFB Triplet-Set-Prüfung (TRIPLET_SET_SPEC_R2): nur Kartenwörter + Grammatik + Opener + sparsam Fluff.

Aufruf: python3 triplet_set_check.py <deck.json> <set.csv>
set.csv Spalten: line_no,kind,card_number,opener,triplet[,set]   (kind = intro | card | outro; set = Set-Nummer, Opener gelten je Set)
Ausgabe: je Zeile PASS/FAIL mit fremden Wörtern; Exit 1, wenn eine Kartenzeile FAIL ist.
"""
import csv, json, re, sys

GRAMMAR = set("""a an the and or but so yet nor then than as of to in on at for with by from into onto over under out up off
is are was were be been being am has have had do does did can could will would shall should may might must
not no n't you your yours yourself we our us it its they their them he his him she her i me my mine this that these those
who whom whose which what when where while if""".split())
FLUFF = {"fluff", "fluffy", "un-fluff", "fluffed", "fluffs", "fluffier", "fluffiest", "unfluff"}
OPENERS = ["Welcome to", "Remember", "You know", "Do you know", "Ever tasted", "I once met", "Let me tell you about",
           "You know the thing with", "Did you ever try", "What if", "Have you heard of", "Did you hear of", "Anyway",
           "Which brings us to", "Meanwhile elsewhere", "No wait", "Before we continue", "Here is something nobody asked for",
           "This one has a rule", "Nobody warned us about", "The thing about", "Everyone agrees", "Not a metaphor",
           "I used to believe", "You with the card in your hand", "You played", "The deck insists on",
           # V-325 (Georg 16.10.): anekdotische Opener
           "A friend told me about", "I read a book about", "Someone wrote in my diary", "I found a note saying", "My diary says"]
# Opener-Familien (V-280): Varianten derselben Familie in einem Track nur mit mindestens FAMILY_GAP Zeilen Abstand.
FAMILIES = {"heard": ["Did you hear of", "Have you heard of"], "know": ["You know", "Do you know", "You know the thing with"],
            "try": ["Did you ever try", "Ever tasted"], "nobody": ["Nobody warned us about", "Here is something nobody asked for"],
            "thing": ["The thing about", "You know the thing with"],
            "anecdote": ["A friend told me about", "I read a book about", "Someone wrote in my diary", "I found a note saying", "My diary says"]}
FAMILY_GAP = 10

# Pool R2 (Georg 16.10.): Anekdoten-Formen + Story-Mode-Pools, siehe OPENER_ARC_R2/opener_pool_r2.py
try:
    import os as _os, sys as _sys
    _sys.path.insert(0, _os.path.join(_os.path.dirname(_os.path.abspath(__file__)), "OPENER_ARC_R2"))
    from opener_pool_r2 import POOL as _P2, FAMILIES as _F2
    OPENERS += [o for o in _P2 if o not in OPENERS]
    for _k, _v in _F2.items(): FAMILIES[_k] = sorted(set(FAMILIES.get(_k, [])) | set(_v))
except ImportError:
    pass
SUFFIXES = ("'s", "s'", "ies", "es", "s", "ed", "d", "ing", "ly", "er", "est", "n't")
WORD = re.compile(r"[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*")

def stems(w):
    w = w.lower().strip("'")
    out = {w}
    for s in SUFFIXES:
        if w.endswith(s) and len(w) - len(s) >= 3:
            b = w[: -len(s)]
            out |= {b, b + "e", b + "y"}
    if "-" in w:
        for part in w.split("-"):
            out |= stems(part)
    return out

def vocab(text):
    v = set()
    for t in WORD.findall(text or ""):
        v |= stems(t)
    return v

def card_fields(c):
    return c.get("cardName") or c.get("name") or "", c.get("power") or "", c.get("lore") or ""

def main(deck_path, set_path):
    deck = json.load(open(deck_path))
    cards = {int(c.get("cardNumber") or c.get("num")): c for c in deck["cards"]}
    title_v = vocab(deck.get("deckTitle", ""))
    fail = 0
    seen_openers = {}
    cur_set = None
    for row in csv.DictReader(open(set_path, newline="")):
        kind, line = row["kind"], row["triplet"].strip()
        if (row.get("set") or "") != cur_set:
            cur_set = row.get("set") or ""
            seen_openers = {}
        if "(" in line or ")" in line:
            print(f"{row['line_no']:>3} FAIL Klammer im Sprechtext: {line}"); fail += 1
        op = (row.get("opener") or "").strip()
        if op:
            if op not in OPENERS:
                print(f"{row['line_no']:>3} FAIL opener nicht im Pool: {op}"); fail += 1
            if op in seen_openers:
                print(f"{row['line_no']:>3} FAIL opener doppelt (schon Zeile {seen_openers[op]}): {op}"); fail += 1
            ln = int(row["line_no"])
            for fam, members in FAMILIES.items():
                if op in members:
                    for other, oln in seen_openers.items():
                        if other != op and other in members and ln - int(oln) < FAMILY_GAP:
                            print(f"{row['line_no']:>3} FAIL Opener-Familie „{fam}“ zu nah an Zeile {oln} ({other})"); fail += 1
            seen_openers[op] = row["line_no"]
        if kind != "card":
            print(f"{row['line_no']:>3} {kind.upper():5} {line}")
            continue
        n = int(row["card_number"])
        name, power, lore = card_fields(cards[n])
        allowed = vocab(name) | vocab(power) | vocab(lore)
        foreign, fluff = [], 0
        for t in WORD.findall(line):
            tl = t.lower()
            if tl in FLUFF or tl.startswith("fluff") or tl.startswith("un-fluff"):
                fluff += 1; continue
            if tl in GRAMMAR or (stems(t) & allowed):
                continue
            foreign.append(t)
        core = re.sub(r"\s*\([^)]*\)", "", name.strip().lower())
        core = re.sub(r"^the\s+", "", core)
        title_ok = core[:12] in line.lower()
        ok = not foreign and fluff <= 1 and title_ok
        fail += 0 if ok else 1
        why = []
        if foreign: why.append("fremd: " + ", ".join(foreign))
        if fluff > 1: why.append(f"fluff x{fluff}")
        if not title_ok: why.append("Titel fehlt")
        print(f"{row['line_no']:>3} {'PASS' if ok else 'FAIL'} #{n} {line}" + ("  <-- " + "; ".join(why) if why else ""))
    print(f"\n{fail} FAIL")
    sys.exit(1 if fail else 0)

if __name__ == "__main__":
    main(*sys.argv[1:3])
