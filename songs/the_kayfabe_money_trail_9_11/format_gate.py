#!/usr/bin/env python3
import csv,json,pathlib
r=pathlib.Path(__file__).resolve().parent;n="the_kayfabe_money_trail_9_11";s=(r/(n+".r4.suno.txt")).read_text();beats=s.strip().split("\n\n")
c=json.loads((r/(n+".qa.deck.json")).read_text())["cards"];rows=[x for x in csv.DictReader((r/(n+".qa.set.csv")).open()) if x["kind"]=="card"]
assert beats[0]=="[Spoken Word]" and beats[-1]=="Stay Fluffy!"
assert len(rows)==len(c)==60 and len(beats)==1+1+60+2
for i,(row,card) in enumerate(zip(rows,c)):
 assert 80<=len(row["triplet"])<=95,(i+1,len(row["triplet"]))
 assert card["cardName"].casefold() in beats[2+i].casefold(),("title",i+1)
 assert beats[2+i].endswith(row["triplet"]),("opener",i+1)
print("Source/line/blank frame PASS, total Unicode characters",len(s))
assert len(s)<5000,f"SONG_SPEC_R3 §C BUDGET FAIL: {len(s)} Unicode characters >= 5000"
print("FORMAT PASS")
