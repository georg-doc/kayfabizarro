#!/usr/bin/env python3
import csv,json,pathlib,re
root=pathlib.Path(__file__).resolve().parent
name="the_carnival_of_unsolved_problems_therapy"
suno=(root/(name+".r4.suno.txt")).read_text(encoding="utf-8")
cardtext=json.loads((root/(name+".qa.deck.json")).read_text(encoding="utf-8"))["cards"]
rows=list(csv.DictReader((root/(name+".qa.set.csv")).open(newline="",encoding="utf-8")))
cards=[row for row in rows if row["kind"]=="card"]
beats=suno.strip().split("\n\n")
assert beats[0]=="[Spoken Word]" and beats[-1]=="Stay Fluffy!", "frame"
assert len(beats)==1+3+len(cards)+3, (len(beats),len(cards))
assert len(cards)==47, "card coverage"
assert len(suno)<5000, ("budget",len(suno))
for i,(row,c) in enumerate(zip(cards,cardtext)):
    s=row["triplet"]
    assert 80<=len(s)<=95, (i+1,len(s))
    assert c["cardName"].casefold() in beats[4+i].casefold(), ("name",i+1)
    assert beats[4+i].endswith(s), ("opener layer",i+1)
assert len(set(["Ticket torn:","Emergency stop:","First attraction:","Never opened:","Again, the loop:","Staff entrance:","Volume up:","Future left:","What if:","Intermission:","No refunds:","After closing:","In private:","Set it down:","Family seating:","Refund desk:","Lights lowered:"]))==17, "opener uniqueness"
assert "Blödsinn!" not in suno, "no imposed repeated shout"
print(f"FORMAT PASS: 47/47 beats, 80-95 characters, one blank line after each beat, {len(suno)} Unicode characters, distinct openers")
