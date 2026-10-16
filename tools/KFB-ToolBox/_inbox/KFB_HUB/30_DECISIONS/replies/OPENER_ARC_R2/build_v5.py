"""Suno v5 nach Georgs Beispiel (16.10.): mehrzeiliges Intro (Hook… / Decktitel: Slogan / Karaoke-Begrüßung + Fluff-Tagline),
fast jede Kartenzeile mit kurzem Verb-Opener (Meet, Watch, Play, Enter …), ein paar erfundene Mini-Anekdoten, Kartenzeilen bytegleich."""
import csv,io,json,re
VERBS=["Meet","Watch","Play","Enter","Behold","Spot","Greet","Hail","Mind","Fear","Feed","Wake","Hug","Ask","Call","Try","Follow","Summon",
"Unleash","Cheer","Pet","Salute","Release","Free","Fight","Doubt","Blame","Thank","Tickle","Poke","Chase","Hire","Crown","Bribe","Dodge",
"Tame","Pity","Admire","Ignore","Interview","Applaud","Defy","Rescue","Wrestle","Pin","Tag","Body-slam","Here's","Next up:","Say hi to",
"Make way for","Introducing","Look out for","Bow to","Wave at","Beware of","Toast","Frame","Sketch","Dance with","Sing for","High-five",
"Shush","Adopt","Wink at","Boo","Pamper","Recruit","Train","Unmask"]
KEEP_THE={"Meet","Enter","Here's","Introducing","Make way for","Look out for","Beware of","Say hi to"}
D=json.load(io.open('v5_decks.json',encoding='utf-8'))
def join(op,line):
    if op.endswith(':'): return op+' '+line
    m=re.match(r'^(The|A|An) (.*)$',line)
    if m:
        if op in KEEP_THE or ' ' in op.rstrip(':'): return f"{op} {m.group(1).lower()} {m.group(2)}"
        return f"{op} {m.group(2)}"
    return f"{op} {line}"
for key,cfg in D.items():
    rows=list(csv.DictReader(io.open(key+'.arc2.takes.csv',newline='',encoding='utf-8')))
    cards=[r for r in rows if r['kind']=='card']
    skip=set(cfg.get('drop_cards',[])); special=cfg.get('special',{}); bare=set(cfg.get('bare',[]))
    vi=cfg.get('verb_offset',0); out=[]; used=set()
    for r in cards:
        n=r['card_number']
        if n in skip: continue
        if n in special: op=special[n]
        elif n in bare: op=''
        else:
            while VERBS[vi%len(VERBS)] in used: vi+=1
            op=VERBS[vi%len(VERBS)]; vi+=1
        if op: used.add(op)
        out.append(join(op,r['triplet']) if op else r['triplet'])
    txt="[Spoken Word]\n\n"+cfg['intro'].strip()+"\n\n"+"\n\n".join(out)+"\n\nStay Fluffy!\n"
    io.open(key+'.v5.suno.txt','w',encoding='utf-8').write(txt)
    print(key,len(txt),'opener lines',sum(1 for r in cards if r['card_number'] not in skip and r['card_number'] not in bare),'/',len(cards)-len(skip))
