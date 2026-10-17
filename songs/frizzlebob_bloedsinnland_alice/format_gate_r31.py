#!/usr/bin/env python3
import pathlib,json,csv,re
r=pathlib.Path(__file__).resolve().parent;n="frizzlebob_bloedsinnland_alice"
s=(r/(n+".r4.1.suno.txt")).read_text(encoding="utf-8");bs=s.strip().split("\n\n")
c=json.loads((r/(n+".r31.qa.deck.json")).read_text())["cards"]
rows=[x for x in csv.DictReader((r/(n+".r31.qa.set.csv")).open()) if x["kind"]=="card"]
assert bs[0]=="[Spoken Word]" and bs[-1]=="Stay Fluffy!"
assert len(bs)==37 and len(rows)==len(c)==30
assert len(s)<5000 and not re.search(r"\d|\([^)]*\)",s)
assert not re.search(r"(?i)\b(?:actor|scene|token|tools|quest|player|equipped)\b",s)
assert s.casefold().count("blödsinn")==1
for i,(row,card) in enumerate(zip(rows,c)):
 assert 80<=len(row["triplet"])<=95,(i+1,len(row["triplet"]))
 assert bs[i+4].endswith(row["triplet"]),(i+1,"beat")
 assert card["cardName"].casefold() in row["triplet"].casefold(),(i+1,"title")
print("R3.1 FORMAT PASS: 30/30 cards; blank beats; no bracket/digit/game vocabulary; 1 Blödsinn; chars",len(s))
