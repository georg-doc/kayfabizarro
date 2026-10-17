#!/usr/bin/env python3
import json,csv,re,pathlib
r=pathlib.Path(__file__).resolve().parent;n="the_carnival_of_unsolved_problems_therapy";s=(r/(n+".r4.1.suno.txt")).read_text(encoding="utf-8");bs=s.strip().split("\n\n");c=json.loads((r/(n+".r31.qa.deck.json")).read_text())["cards"]
rows=[a for a in csv.DictReader((r/(n+".r31.qa.set.csv")).open()) if a["kind"]=="card"]
assert len(rows)==len(c)==47 and len(bs)==54,(len(rows),len(bs))
assert bs[0]=="[Spoken Word]" and bs[-1]=="Stay Fluffy!" and len(s)<5000
assert not re.search(r"\d|\([^)]*\)|(?i:actor|scene|token|tools|equipped)",s)
assert len(re.findall(r"(?i)frizzlebob",s))==1
for i,(a,x) in enumerate(zip(rows,c)):
 assert 80<=len(a["triplet"])<=95,(i+1,len(a["triplet"]))
 assert x["cardName"].casefold() in a["triplet"].casefold(),(i+1,"title")
 assert bs[i+4].endswith(a["triplet"]),(i+1,"beat")
print("R3.1 PASS 47/47, chars",len(s))
