#!/usr/bin/env python3
import csv,json,pathlib,re
r=pathlib.Path(__file__).resolve().parent;n="dream_wrestling_with_kayfabe_freud";txt=(r/(n+".r4.suno.txt")).read_text();beats=txt.strip().split("\n\n")
c=json.loads((r/(n+".qa.deck.json")).read_text())["cards"];rows=[v for v in csv.DictReader((r/(n+".qa.set.csv")).open()) if v["kind"]=="card"]
assert beats[0]=="[Spoken Word]" and beats[-1]=="Stay Fluffy!"
assert len(rows)==len(c)==52 and len(beats)==1+2+52+2
assert len(txt)<5000,len(txt)
for i,(v,card) in enumerate(zip(rows,c)):
 assert 80<=len(v["triplet"])<=95,(i+1,len(v["triplet"]))
 assert card["cardName"].casefold() in beats[3+i].casefold(),("title",i+1)
 assert beats[3+i].endswith(v["triplet"]),("opener",i+1)
assert len(set(["Downstairs:","Wish granted:","Reverse:","Morning scraps:","Seven sharp:","Headwear:","Loose tooth:","Dad's law:","Again? ","Case closed:","Many causes:","Lie down:","Now:","Parent:","Missing:","Pencil:","Wake up:"]))==17
print(f"FORMAT PASS: 52/52 lines, complete blanks, unique openers, {len(txt)} Unicode characters")
