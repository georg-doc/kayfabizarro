#!/usr/bin/env python3
import csv,json,re,pathlib
r=pathlib.Path(__file__).resolve().parent;n="1001_kayfabe_nights";s=(r/(n+".r4.1.suno.txt")).read_text();b=s.strip().split("\n\n");c=json.loads((r/(n+".r31.qa.deck.json")).read_text())["cards"];rows=[v for v in csv.DictReader((r/(n+".r31.qa.set.csv")).open()) if v["kind"]=="card"]
assert len(rows)==len(c)==56 and len(b)==60
assert b[0]=="[Spoken Word]" and b[-1]=="Stay Fluffy!" and len(s)<5000
assert not re.search(r"\d|\([^)]*\)|(?i:cannibal|jobbers.*cannibal|zerg|token|equipped items)",s)
for i,(v,card) in enumerate(zip(rows,c)):
 assert 80<=len(v["triplet"])<=95,(card["cardNumber"],len(v["triplet"]))
 assert card["cardName"].casefold() in v["triplet"].casefold(),(i+1,"title")
 assert b[i+2].endswith(v["triplet"]),(i+1,"beat")
print("R3.1 PASS 56/56, chars",len(s))
