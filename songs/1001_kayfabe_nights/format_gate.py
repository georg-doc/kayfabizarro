#!/usr/bin/env python3
import csv,json,pathlib
r=pathlib.Path(__file__).resolve().parent;n="1001_kayfabe_nights"
s=(r/(n+".r4.suno.txt")).read_text();bits=s.strip().split("\n\n");c=json.loads((r/(n+".qa.deck.json")).read_text())["cards"]
rows=[x for x in csv.DictReader((r/(n+".qa.set.csv")).open()) if x["kind"]=="card"]
assert bits[0]=="[Spoken Word]" and bits[-1]=="Stay Fluffy!"
assert len(rows)==len(c)==56 and len(bits)==1+1+56+2,(len(bits),len(rows))
assert len(s)<5000,len(s)
for i,(row,card) in enumerate(zip(rows,c)):
 t=row["triplet"];assert 80<=len(t)<=95,(card["cardNumber"],len(t))
 assert card["cardName"].casefold() in bits[2+i].casefold(),("title",i)
 assert bits[2+i].endswith(t),("opener",i)
print("FORMAT PASS 56/56 card lines, blank lines, 80-95 chars, Unicode",len(s))
