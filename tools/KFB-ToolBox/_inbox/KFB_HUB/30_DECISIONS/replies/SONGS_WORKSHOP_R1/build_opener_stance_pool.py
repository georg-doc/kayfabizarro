#!/usr/bin/env python3
"""Opener-Pool nach Haltung und Satzbau (Georg 23.10.2026). Nur vorhandenes Material, nichts neu recherchiert.
Quellen: OPENER_ARC_R2/opener_pool_r2.py (POOL, FAMILIES), OPENER_ARC_R1/OPENER_ARC_MODEL_R1.md §8,
OPENER_RESEARCH_INVENTORY_R1.md §2.1 (Perplexity P43: OP/UP/FW), Georg 23.10. (Chat).
Ausgabe: SONGS_WORKSHOP_R1/OPENER_POOL_BY_STANCE_R1.json + .md
Satzbau: into_title = läuft direkt in den Kartentitel ("Did you hear about The Booker …");
         own_clause = eigener kleiner Satz, dann die Karte ("My diary says: The Booker …");
         interjection = Einwurf mit Komma ("Anyway, The Booker …")."""
import json, os, sys
H = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(H, "..", "OPENER_ARC_R2"))
from opener_pool_r2 import POOL, FAMILIES

SLOT = {" ": "into_title", ": ": "own_clause", ", ": "interjection"}
RUMOR = ("told me", "heard", "Overheard", "rumor", "radio", "Whispered")
FIND = ("note", "diary", "friendship book", "napkin", "letter", "sketchbook", "under my bed", "fortune cookie", "painting", "film", "book about")
MEET = ("I once met", "neighbour", "aunt", "grandmother", "stranger")
THEORY = ("What if", "You would think", "The official explanation", "The stars mention", "My goldfish")
def stance(op, cls):
    if cls == "F":
        if any(k in op for k in MEET): return "Begegnung"
        if any(k in op for k in RUMOR): return "Gerücht"
        if any(k in op for k in FIND): return "Fundstück"
        return "Anekdote"
    if cls == "P": return "Theorie" if any(k in op for k in THEORY) else "Behauptung"
    return {"A": "Ansprache", "Q": "Frage", "R": "Rückruf", "D": "Zweifel/Wende", "E": "Steigerung",
            "M": "Meta", "X": "Szenenwechsel"}[cls]
fam = {o: f for f, ms in FAMILIES.items() for o in ms}
status_pool = set(list(POOL)[:27])  # die ersten 27 Einträge = freigegebener Pool R2
rows = []
for op, (cls, modes, conn) in POOL.items():
    rows.append({"opener": op, "stance": stance(op, cls), "slot": SLOT[conn], "class": cls,
                 "modes": list(modes), "family": fam.get(op), "status": "POOL" if op in status_pool else "GEORG/R2-Kandidat",
                 "source": "opener_pool_r2.py"})
EXTRA = [  # (opener, stance, slot, class, status, source, hinweis)
 ("I wonder why", "Theorie", "into_title", "P", "GEORG 23.10.", "Chat Georg", "Frage-Form; Kartenzeile wird zur Frage"),
 ("My neighbour is", "Begegnung", "into_title", "F", "GEORG 23.10.", "Chat Georg", "nur vor Personen/Figuren"),
 ("I found a", "Fundstück", "into_title", "F", "GEORG 23.10.", "Chat Georg", "nur vor Objekt-/Textkarten"),
 ("Did you hear about", "Gerücht", "into_title", "Q", "GEORG 23.10.", "Chat Georg", "Familie heard"),
 ("I heard a rumor about", "Gerücht", "into_title", "Q", "SL OPR3_023", "OPENER_ARC_MODEL_R1 §8.2", ""),
 ("I saw a film about", "Fundstück", "into_title", "F", "SL OPR3_007", "OPENER_ARC_MODEL_R1 §8.2", ""),
 ("A note under my door", "Fundstück", "own_clause", "F", "SL OPR3_034", "OPENER_ARC_MODEL_R1 §8.2", ""),
 ("I think I remember", "Rückruf", "into_title", "R", "SL OPR3_045", "OPENER_ARC_MODEL_R1 §8.2", "Fehlerinnerung erlaubt (V-327)"),
 ("I dreamed about", "Anekdote", "into_title", "F", "SL OPR3_046", "OPENER_ARC_MODEL_R1 §8.2", ""),
 ("Backstage someone muttered", "Meta", "own_clause", "M", "SL OPR3_050", "OPENER_ARC_MODEL_R1 §8.2", ""),
 ("A scratched sign read", "Fundstück", "own_clause", "F", "SL OPR3_057", "OPENER_ARC_MODEL_R1 §8.2", ""),
 ("From the back row", "Ansprache", "own_clause", "A", "SL NEW_028", "OPENER_ARC_MODEL_R1 §8.2", ""),
 ("Someone scratched into the wall", "Fundstück", "own_clause", "F", "SL NEW_049", "OPENER_ARC_MODEL_R1 §8.2", "lang (33 Zeichen)"),
 ("But the margin reads", "Zweifel/Wende", "own_clause", "D", "R2 OPR3_074", "OPENER_ARC_MODEL_R1 §8.2", ""),
 ("Hold that thought", "Szenenwechsel", "own_clause", "X", "R2 NEW_040", "OPENER_ARC_MODEL_R1 §8.2", ""),
 ("Ever heard of", "Frage", "into_title", "Q", "P43 OP-02 KEEP", "OPENER_RESEARCH_INVENTORY_R1 §2.1", ""),
 ("Have you ever", "Frage", "into_title", "Q", "P43 OP-03 TUNE", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "Slot = Erfahrung, nicht Titel"),
 ("You look like someone who", "Ansprache", "own_clause", "A", "P43 OP-04 TUNE", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "Risiko"),
 ("The other day,", "Anekdote", "own_clause", "F", "P43 OP-12 TUNE", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "Slot = Ereignis"),
 ("I went to", "Anekdote", "into_title", "F", "P43 OP-13 TUNE", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "einzige Orts-Form; nur vor Orts-Karten"),
 ("There are two kinds of people", "Behauptung", "own_clause", "P", "P43 OP-18 TUNE", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "Slot A/B"),
 ("This is not a metaphor. Unfortunately", "Meta", "own_clause", "M", "P43 OP-19 KEEP", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "Familie mit Not a metaphor"),
 ("No, wait", "Zweifel/Wende", "interjection", "D", "P43 OP-24 KEEP", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "= No wait (POOL)"),
 ("You call that", "Erwiderung", "into_title", "D", "P43 UP-02 KEEP", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "Dialog: greift das Wort des Vorredners auf"),
 ("You said", "Erwiderung", "own_clause", "R", "P43 UP-01 KEEP", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "Dialog: 'You said safe.'"),
 ("Exactly. And if", "Erwiderung", "into_title", "E", "P43 UP-03 KEEP", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "Dialog"),
 ("That is not X. That is", "Erwiderung", "into_title", "D", "P43 UP-04 KEEP", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "Dialog; X = Wort des Vorredners"),
 ("Fair. But", "Erwiderung", "own_clause", "D", "P43 UP-05 KEEP", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "Dialog"),
 ("So what you mean is", "Erwiderung", "into_title", "D", "P43 UP-07 TUNE", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "Dialog"),
 ("And then it gets worse", "Steigerung", "own_clause", "E", "P43 UP-10 KEEP", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "Achtung KayfabeTip 1 ('and then'): nur Song-extern/Tratsch"),
 ("You wanted", "Ansprache", "into_title", "A", "P43 FW-02 KEEP", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "Slot = Erwartung"),
 ("This card is doing it whether you like it or not", "Meta", "own_clause", "M", "P43 FW-03 KEEP", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "lang"),
 ("I am performing a card. The card does not care", "Meta", "own_clause", "M", "P43 FW-05 KEEP", "OPENER_RESEARCH_INVENTORY_R1 §2.1", "lang"),
 ("You know something I do not", "Ansprache", "own_clause", "A", "P43 FW-06 TUNE", "OPENER_RESEARCH_INVENTORY_R1 §2.1", ""),
 ("The deck says", "Meta", "own_clause", "M", "P43 FW-08 KEEP", "OPENER_RESEARCH_INVENTORY_R1 §2.1", ""),
]
UPTAKE = {"You call that", "You said", "Exactly. And if", "That is not"}
for r in rows:
    if r["opener"] in UPTAKE: r["stance"] = "Erwiderung"; r["note"] = "Dialog: greift das Wort des Vorredners auf (P43 UP)"
have = {r["opener"] for r in rows}
for op, st, sl, cl, stt, src, note in EXTRA:
    if op in have: continue
    rows.append({"opener": op, "stance": st, "slot": sl, "class": cl, "modes": ["any"], "family": fam.get(op),
                 "status": stt, "source": src, **({"note": note} if note else {})})

# --- Satz-Opener (into_clause): laufen in einen GANZEN Satz (tr1-Zeilen), Befund WS-NPC 24.10.; Kandidaten bis Georg/WS0 freigibt ---
CLAUSE_POOL = {"What if", "You know", "Do you know", "I used to believe", "Remember"}   # schon POOL, passen vor ganze Sätze
CLAUSE_NEW = [  # (opener, stance)
 ("Rumor has it", "Gerücht"), ("I heard", "Gerücht"), ("They say", "Gerücht"), ("Word is", "Gerücht"), ("Legend has it", "Gerücht"),
 ("Between you and me,", "Gerücht"), ("A friend swears", "Begegnung"), ("My neighbour swears", "Begegnung"), ("My grandmother always said", "Begegnung"),
 ("Apparently", "Behauptung"), ("Turns out", "Behauptung"), ("Believe it or not,", "Behauptung"), ("I'm telling you,", "Behauptung"),
 ("Funny thing is,", "Beobachtung"), ("Ever notice how", "Beobachtung"), ("I wonder if", "Theorie"), ("Maybe", "Theorie"),
 ("Here's the thing,", "Behauptung"), ("Fun fact,", "Fundstück"), ("Don't tell anyone, but", "Gerücht"),
]
for r in rows:
    if r["opener"] in CLAUSE_POOL: r["clause_ok"] = True
for op, st in CLAUSE_NEW:
    if op not in {r["opener"] for r in rows}:
        rows.append({"opener": op, "stance": st, "slot": "into_clause", "class": "", "modes": ["any"], "family": None,
                     "status": "KANDIDAT 24.10. (Satz-Opener, Freigabe Georg/WS0)", "source": "Deck-Songs nach WS-NPC-Befund 24.10.", "clause_ok": True})

# --- Opener-Audit 24.10. (Georg: „You with the card in your hand“ streichen – überspezifisch, lenkt von der Karte ab;
#     übrige auf Situationsbehauptungen prüfen, die von der Karte ablenken). Pool-Änderung über WS0. ---
AUDIT = {
 "You with the card in your hand": ("GESTRICHEN", "Georg 24.10.: überspezifisch, lenkt von der Karte ab"),
 "You played": ("STREICHEN-Vorschlag", "behauptet eine Spielsituation; im Tratsch/Song meist falsch"),
 "Welcome to": ("STREICHEN-Vorschlag", "Bühnen-/Ansageformel (R4 C9), behauptet Ort und Publikum"),
 "Ever tasted": ("STREICHEN-Vorschlag", "überspezifisch (nur Essbares), behauptet Sinneserfahrung"),
 "This one has a rule": ("STREICHEN-Vorschlag", "lenkt auf Regel/Mechanik (S6)"),
 "The deck insists on": ("STREICHEN-Vorschlag", "Meta-Situation Deck, lenkt von der Karte ab"),
 "Here is something nobody asked for": ("STREICHEN-Vorschlag", "Selbstkommentar, lang, lenkt ab"),
 "Before we continue": ("STREICHEN-Vorschlag", "Moderationssituation"),
 "Did you ever try": ("PRÜFEN", "unterstellt Handlung; nur vor Handlungskarten"),
 "Which brings us to": ("PRÜFEN", "Moderationsbrücke; nur Song-Uptake, nicht Tratsch"),
 "Meanwhile elsewhere": ("PRÜFEN", "behauptet Ortswechsel; nur Song"),
 "I found this under my bed": ("STREICHEN-Vorschlag", "erfundene Situation, lenkt ab"),
 "My goldfish insists on": ("STREICHEN-Vorschlag", "erfundene Situation, lenkt ab"),
 "In a dream last Tuesday": ("STREICHEN-Vorschlag", "erfundene Situation, überspezifisch"),
 "A stranger on the bus told me about": ("STREICHEN-Vorschlag", "erfundene Situation, lang"),
 "Overheard at the bakery": ("PRÜFEN", "Ortsbehauptung"),
 "On the back of a napkin": ("PRÜFEN", "Ortsbehauptung"),
 "The radio kept talking about": ("PRÜFEN", "Situationsbehauptung"),
 "Whispered in the attic": ("STREICHEN-Vorschlag", "erfundener Ort"),
 "Behind the locked door": ("STREICHEN-Vorschlag", "erfundener Ort"),
 "Behind the mirror": ("STREICHEN-Vorschlag", "erfundener Ort"),
 "You look like someone who": ("STREICHEN-Vorschlag", "Unterstellung ans Gegenüber, lenkt ab"),
 "I am performing a card. The card does not care": ("STREICHEN-Vorschlag", "Meta, lang"),
 "This card is doing it whether you like it or not": ("STREICHEN-Vorschlag", "Meta, lang, Regelbezug"),
}
for r in rows:
    if r["opener"] in AUDIT:
        v, why = AUDIT[r["opener"]]; r["audit_2026_10_24"] = v; r["audit_reason"] = why
        if v == "GESTRICHEN": r["status"] = "GESTRICHEN (Georg 24.10.)"

# --- Satzende (WS1-Lead 24.10.: „What if …“ braucht „?“): Frage-Opener machen die ganze Zeile zur Frage ---
QUESTION_END = {"What if", "Do you know", "Have you heard of", "Did you hear of", "Did you hear about", "Ever heard of",
                "Ever notice how", "Did you ever try", "You call that", "Have you ever", "Ever tasted", "Did you see the film about"}
for r in rows:
    r["ending"] = "?" if r["opener"] in QUESTION_END else "."
ORDER = ["Gerücht", "Begegnung", "Fundstück", "Anekdote", "Frage", "Theorie", "Behauptung", "Erwiderung",
         "Beobachtung", "Ansprache", "Rückruf", "Zweifel/Wende", "Steigerung", "Meta", "Szenenwechsel"]
rows.sort(key=lambda r: (ORDER.index(r["stance"]), r["slot"], r["opener"]))
out = {"schema": "kfb.opener-pool.stance/1", "date": "2026-10-23",
       "rules": ["Je Karte ein festes Triplet; Abwechslung nur über den Opener.",
                 "into_title: Opener + Kartentitel bilden einen Satz. own_clause: eigener Satz mit Punkt oder Komma (nie Doppelpunkt, SSOT S1), dann die Karte. Nie zwei lose Wörter ohne Satz.",
                 "Kein Opener zweimal in einem Song/Dialog; Familienabstand >= 10 (V-280). Frage und Behauptung abwechseln.",
                 "Satzende: Feld ending. Bei ending=\"?\" endet die ganze Zeile mit Fragezeichen (letztes Satzzeichen der Kartenzeile wird ersetzt), z. B. What if The Finished City is already built …?",
                 "Kartenpassung: 'I once met'/'My neighbour is' nur vor Personen/Figuren, 'Ever tasted' nur vor Essbarem, 'I found a' nur vor Objekt-/Textkarten, 'You played' nur vor spielbaren Karten.",
                 "Status: POOL = im Prüfskript freigegeben; alles andere sind Kandidaten bis zur Freigabe durch Georg/WS0."],
       "openers": rows}
json.dump(out, open(os.path.join(H, "OPENER_POOL_BY_STANCE_R1.json"), "w"), indent=1, ensure_ascii=False)
md = ["# Opener-Pool nach Haltung und Satzbau · R1 · 23.10.2026", "",
      "Georg 23.10.: Chatterbox und Tratsch wie Stand-up: Gerüchte, Klatsch, wilde Theorien, Spekulation, Frage im Wechsel mit Behauptung; Mini-Opener nicht wiederholen. **Nur vorhandenes Material sortiert**, nichts neu erfunden; die große Sammlung (NotebookLM, Docs) stellt WS0 zusammen (siehe SONG_WORKSHOP_STATUS §26).", "",
      "**Satzbau:** `into_clause` läuft in einen ganzen Satz (tr1-Zeilen: „Rumor has it the Maze has no outside.“) · `into_title` läuft direkt in den Kartentitel · `own_clause` eigener Satz, dann die Karte · `interjection` Einwurf mit Komma.", "",
      "**Regeln:**"] + [f"- {r}" for r in out["rules"]] + [""]
for st in ORDER:
    rs = [r for r in rows if r["stance"] == st]
    if not rs: continue
    md += [f"## {st} ({len(rs)})", "", "| Opener | Satzbau | Status | Familie | Hinweis |", "|---|---|---|---|---|"]
    md += [f"| {r['opener']} | {r['slot']} | {r['status']} | {r.get('family') or ''} | {(r.get('audit_2026_10_24','') + ': ' + r.get('audit_reason','')) if r.get('audit_2026_10_24') else r.get('note','')} |" for r in rs] + [""]
md += ["## Beispiele (BBBW-Triplets, nur Hörprobe)", "",
       "- Gerücht · into_title: *Did you hear about The Finger Poke of Doom? Instant pin if you consent. Strength? No, gullibility.*",
       "- Theorie · into_title: *I wonder why The Booker decides the winner before it starts: the ending is pre-planned. You are just a puppet.*",
       "- Begegnung · into_title: *I once met The Juice Lover: you can't hurt me if I hurt me first.*",
       "- Fundstück · own_clause: *My diary says: The Retirement Match, rising and falling. See you next season.*",
       "- Erwiderung (Dialog) · into_title: *You call that The Squash? No-selling, total dominance.*", ""]
open(os.path.join(H, "OPENER_POOL_BY_STANCE_R1.md"), "w").write("\n".join(md))
from collections import Counter
print(len(rows), Counter(r["stance"] for r in rows), Counter(r["slot"] for r in rows))
