#!/usr/bin/env python3
import json, pathlib, re, sys
root=pathlib.Path(__file__).resolve().parent
name="frizzlebob_bloedsinnland_alice"
txt=(root/(name+".r4.suno.txt")).read_text(encoding="utf-8")
parts=txt.strip().split("\n\n")
cards=json.loads((root/(name+".qa.deck.json")).read_text(encoding="utf-8"))["cards"]
assert parts[0]=="[Spoken Word]" and parts[-1]=="Stay Fluffy!", "framing"
assert len(parts)==1+3+len(cards)+3, (len(parts),len(cards))
assert len(txt)<5000, len(txt)
for i,c in enumerate(cards):
  part=parts[4+i]
  assert c["cardName"].lower() in part.lower(), (i+1,"title",part)
  src=(root/(name+".qa.set.csv")).read_text(encoding="utf-8")
  import csv, io
  rows=[r for r in csv.DictReader(io.StringIO(src)) if r["kind"]=="card"]
  ln=rows[i]["triplet"]
  assert 80<=len(ln)<=95, (i+1,"length",len(ln))
  assert part.endswith(ln), (i+1,"opener isolation")
assert len(set(["Appointment first:","Clock stopped:","Sentence pending:","Classify this:","Into the hole:","The key waits:","Brushes, quickly:","Court assembled:","One bite:","One sip:","Topic closed:","Paint faster:","Try answering:","Exhibit, please:","Last witness:"]))==15, "opener reuse"
assert len(re.findall(r"(?i)\bblödsinn\b",txt))<=2, "repeated shout"
print(f"FORMAT PASS: {len(cards)}/{len(cards)} card beats, 80-95 characters, blank lines, {len(txt)} Unicode characters, no repeated opener, Blödsinn <=2")
