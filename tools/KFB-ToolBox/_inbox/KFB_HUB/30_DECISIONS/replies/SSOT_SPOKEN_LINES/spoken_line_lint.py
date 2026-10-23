#!/usr/bin/env python3
"""SSOT Spoken Lines · Lint R1 (Georg 21.–24.10.2026). Prüft gesprochene Kartenzeilen (Triplets, Tratsch, Song-Kartenteile).
Hygiene, KEIN Qualitätsbeweis: Flow, Witz und Sinn prüft nur Georgs Ohr.

Aufruf:
  python3 spoken_line_lint.py <cards.json> <lines.csv> [--mode tratsch|song|set]
  cards.json: {"cards":[{"cardNumber","cardName","power","lore"}]}  (Druckfassung; PDF führt immer)
  lines.csv : Spalten card_number, triplet [, opener]   (opener optional)
Exit 1 bei FAIL. Regeln: SSOT_SPOKEN_LINES/README.md §3.
"""
import csv, json, re, sys, os
from collections import Counter
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from triplet_set_check import vocab, stems, GRAMMAR, WORD, FLUFF  # gemeinsame Kartenwort-Logik

GRAMMAR_EXTRA = set("why how because until than just only also too very".split()) | set(
    "one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million half".split())  # ausgeschriebene Zahlen (S7)
MECH = re.compile(r"\b(damage|dice|die roll|roll|turn|turns|token|tokens|hp|stat|stats|discard|draw|deck|actor|scene|opponent's hand|xp|reroll)\b", re.I)
SYMBOL = re.compile(r"[0-9&%$#@*/+=<>\[\]{}()]")
LEN_MAX = {"tratsch": 110, "song": 120, "set": 110}

def norm_title(name):
    t = re.sub(r"\s*\([^)]*\)", "", name)                       # Klammerzusätze
    t = re.sub(r"^(Lvl|Mode)\s*\d+:\s*", "", t, flags=re.I)     # Level-/Mode-Präfixe
    t = re.split(r"\s+[–-]\s+", t)[0]                           # Untertitel nach Gedankenstrich
    t = t.replace("&", "and")
    return t.strip()

def title_words(name):
    # Ziffern-Titel (z. B. "8½ Octo-Auteur", "20 Bear Asses"): nur der sprechbare Kern zählt (S7)
    return [w.lower() for w in WORD.findall(norm_title(name)) if w.lower() not in ("the", "a", "an", "of", "and") and not w.isdigit() and len(w) > 1]  # Initialen (G.F.) nicht verlangen

def main(cards_path, lines_path, mode="tratsch"):
    cards = {int(c["cardNumber"]): c for c in json.load(open(cards_path))["cards"]}
    rows = list(csv.DictReader(open(lines_path, newline="")))
    fails = warns = 0; starts = Counter(); after = Counter(); out = []
    seen = {}
    for r in rows:
        n = int(r["card_number"]); line = (r.get("triplet") or "").strip(); op = (r.get("opener") or "").strip()
        c = cards.get(n); msgs = []
        if not c: msgs.append(("FAIL", "Karte nicht in cards.json")); out.append((n, line, msgs)); fails += 1; continue
        spoken = (op + " " + line).strip()
        # 1 Doppelpunkt / Label (Georg 24.10.: nie "Titel: …", Doppelpunkte klingen in Suno nicht)
        if ":" in spoken: msgs.append(("FAIL", "Doppelpunkt im Sprechtext (Etikett/Label-Struktur)"))
        if ";" in spoken: msgs.append(("WARN", "Semikolon – lieber zwei kurze Sätze"))
        if re.search(r"\band then\b", spoken, re.I): msgs.append(("FAIL", "„and then“ (KayfabeTip 1: therefore/but, nie and-then)"))
        # 2 Klammern / Symbole / Ziffern
        if re.search(r"[()\[\]{}]", spoken): msgs.append(("FAIL", "Klammer im Sprechtext"))
        if SYMBOL.search(re.sub(r"[()\[\]{}]", "", spoken)): msgs.append(("WARN", "Ziffer/Symbol – ausschreiben oder weglassen"))
        # 3 Titel im Satz
        tw = title_words(c["cardName"]); low = line.lower()
        if tw and not all(w in low for w in tw[:3]): msgs.append(("FAIL", f"Titel fehlt/verstümmelt ({norm_title(c['cardName'])})"))
        # 4 nur Kartenwörter (+ Grammatik)
        allowed = vocab(c["cardName"]) | vocab(c.get("power", "")) | vocab(c.get("lore", ""))
        foreign = [t for t in WORD.findall(line) if t.lower() not in GRAMMAR and t.lower() not in GRAMMAR_EXTRA
                   and not (stems(t) & allowed) and not t.lower().startswith("fluff")]
        if foreign: msgs.append(("FAIL", "fremde Wörter: " + ", ".join(foreign)))
        # 5 Telegramm-Kette (>=3 Kommasegmente mit <=3 Wörtern)
        segs = [s.strip() for s in re.split(r"[,.!?]", line) if s.strip()]
        if sum(1 for s in segs if len(s.split()) <= 3) >= 3: msgs.append(("WARN", "Telegramm-/Fragmentkette"))
        # 6 Regelmechanik
        m = MECH.findall(line)
        if m: msgs.append(("WARN", "Mechanik-Wort: " + ", ".join(sorted(set(x.lower() for x in m)))))
        # 7 Länge
        if len(line) > LEN_MAX.get(mode, 110): msgs.append(("WARN", f"lang ({len(line)} Zeichen)"))
        # 8 Triplet = Lore (Tratsch: BOGGLE-Nachlegen bringt dann nichts Neues)
        lw = set(w.lower() for w in WORD.findall(c.get("lore", ""))); xw = set(w.lower() for w in WORD.findall(line))
        if lw and len(lw & xw) / max(1, len(lw)) > 0.92: msgs.append(("WARN", "fast identisch mit Lore"))
        # 9 Dubletten
        if line in seen: msgs.append(("FAIL", f"doppelt mit Karte {seen[line]}"))
        seen[line] = n
        # Schablonen-Statistik
        starts["title_first" if low.startswith(norm_title(c["cardName"]).lower()[:12]) else "other"] += 1
        i = low.find(norm_title(c["cardName"]).lower())
        if i >= 0:
            rest = low[i + len(norm_title(c["cardName"])):].strip().split()
            if rest: after[" ".join(rest[:2])] += 1
        out.append((n, line, msgs))
        fails += sum(1 for k, _ in msgs if k == "FAIL"); warns += sum(1 for k, _ in msgs if k == "WARN")
    for n, line, msgs in out:
        tag = "FAIL" if any(k == "FAIL" for k, _ in msgs) else ("WARN" if msgs else "ok  ")
        print(f"{tag} #{n:<3} {line}" + ("".join(f"\n       - {k}: {t}" for k, t in msgs)))
    N = max(1, len(out))
    print("\n--- Deck-Ebene (Schablone) ---")
    if starts["title_first"] / N > 0.7: print(f"WARN Schablone: {starts['title_first']}/{N} Zeilen beginnen mit dem Titel"); warns += 1
    top = after.most_common(1)
    if top and top[0][1] / N > 0.25: print(f"WARN Schablone: '{top[0][0]}' folgt auf den Titel in {top[0][1]}/{N} Zeilen"); warns += 1
    print(f"\n{fails} FAIL · {warns} WARN · {N} Zeilen (Hygiene, kein Qualitätsbeweis)")
    sys.exit(1 if fails else 0)

if __name__ == "__main__":
    a = sys.argv[1:]; mode = "tratsch"
    if "--mode" in a: i = a.index("--mode"); mode = a[i + 1]; del a[i:i + 2]
    main(a[0], a[1], mode)
