#!/usr/bin/env python3
"""SSOT Spoken Lines · Rückfall-Bereinigung R1.2 (Georg 24.10.2026).
Karte ohne abgenommenes Triplet: gesprochen wird Titel (A, im Opener-Satz) + bereinigte gedruckte Lore (B). Power nie.
clean_lore(title, lore) entfernt: Klammerzusätze, führende Etiketten mit Doppelpunkt (Titel oder Versalien-Label),
Stat-/Power-Angaben („Power: 100“, „[R:1]“), restliche Doppelpunkte (→ Punkt), doppelte Leerzeichen.
Ziffern bleiben in der Textblase wörtlich; Audio/TTS schreibt sie aus (S7)."""
import re

STAT = re.compile(r"\b(power|rage|attack|focus|hp|xp|score|level|lvl)\s*:?\s*[-+]?\d+(\.\d+)?\s*\.?", re.I)
BRACKET = re.compile(r"\s*[\(\[\{][^)\]\}]*[\)\]\}]")

def clean_lore(title: str, lore: str) -> str:
    s = (lore or "").strip()
    s = BRACKET.sub("", s)                                    # (Klammer), [R:1]
    s = STAT.sub("", s)                                       # Power: 100
    t = re.escape(title.strip())
    s = re.sub(rf"^\s*{t}\s*[:\-–—]\s*", "", s, flags=re.I)   # „THE HEEL PROMOTER: …“
    s = re.sub(r"^\s*[A-Z0-9][A-Z0-9 '&!?.\-]{2,}:\s*", "", s) # „PAPER BULLETS: …“ (Versalien-Label)
    s = re.sub(r"\s*:\s*", ". ", s)                           # restliche Doppelpunkte → Punkt
    s = re.sub(r"\.\s*\.", ".", s)
    s = re.sub(r"\s{2,}", " ", s).strip(" -–—")
    if s and s[0].islower(): s = s[0].upper() + s[1:]
    return s

if __name__ == "__main__":
    cases = [("The Heel Promoter", "THE HEEL PROMOTER: He thinks the roster is disposable. He's wrong. Power: 100."),
             ("The Bachelor", "PAPER BULLETS: Deal damage based on the number of words in your insult."),
             ("The Hour (Polanyi)", "In selling the hour (the commodity), you sell the self that fills it.")]
    for t, l in cases: print(f"{t!r}\n  in : {l}\n  out: {clean_lore(t, l)}")
