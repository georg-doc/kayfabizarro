#!/usr/bin/env python3
import json,csv,pathlib,re
r=pathlib.Path(__file__).resolve().parent;n="dream_wrestling_with_kayfabe_freud";s=(r/(n+".r4.1.suno.txt")).read_text();b=s.strip().split("\n\n");cards=json.loads((r/(n+".r31.qa.deck.json")).read_text())["cards"];rows=[a for a in csv.DictReader((r/(n+".r31.qa.set.csv")).open()) if a["kind"]=="card"]
assert len(b)==57 and len(rows)==len(cards)==52 and len(s)<5000,(len(b),len(s))
assert b[0]=="[Spoken Word]" and b[-1]=="Stay Fluffy!"
assert not re.search(r"\d|\([^)]*\)|(?i:quest|token|player|equipped items)",s)
for i,(row,c) in enumerate(zip(rows,cards)):
 assert 80<=len(row["triplet"])<=95,(i+1,len(row["triplet"]))
 assert c["cardName"].casefold() in row["triplet"].casefold(),(i+1,"title")
 assert b[i+3].endswith(row["triplet"]),(i+1,"beat")
print("R3.1 52/52 PASS; Unicode chars",len(s))
