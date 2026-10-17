#!/usr/bin/env python3
import csv,json,pathlib,re
r=pathlib.Path(__file__).resolve().parent;n="the_kayfabe_money_trail_9_11"
for part,(start,end) in enumerate(((1,28),(29,60)),1):
 p=str(part);s=(r/(n+".part"+p+".r4.1.suno.txt")).read_text();beats=s.strip().split("\n\n")
 c=json.loads((r/(n+".part"+p+".r31.qa.deck.json")).read_text())["cards"]
 rows=[a for a in csv.DictReader((r/(n+".part"+p+".r31.qa.set.csv")).open()) if a["kind"]=="card"]
 assert len(c)==len(rows)==end-start+1
 assert len(beats)==1+1+len(rows)+2,(p,len(beats),len(rows))
 assert beats[0]=="[Spoken Word]" and beats[-1]=="Stay Fluffy!"
 assert len(s)<5000 and not re.search(r"\d|\([^)]*\)|(?i:remote flight tech|zerg rush|actor|scene|equipped items|token)",s)
 for i,(row,card) in enumerate(zip(rows,c)):
  assert 80<=len(row["triplet"])<=95,(p,card["cardNumber"],len(row["triplet"]))
  assert card["cardName"].casefold() in row["triplet"].casefold(),(p,i,"title")
  assert beats[i+2].endswith(row["triplet"]),(p,i,"opener")
 print("PART",p,"A6 A7 A8 C12b format PASS",len(rows),"cards",len(s),"Unicode chars")
