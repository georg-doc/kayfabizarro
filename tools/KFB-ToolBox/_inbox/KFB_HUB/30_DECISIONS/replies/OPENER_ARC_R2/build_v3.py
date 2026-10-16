"""Suno-Format v3 (Georg 16.10.): eigenes Intro je Deck, gesungener Refrain, Strophen, Break, tanzbare Styles, wechselnde Stimmen.
Liest *.arc2.takes.csv (Kartenzeilen bytegleich), setzt Opener-Änderungen, kürzt Opener nach Prioritätsliste bis < LIMIT Zeichen."""
import csv,io,json,sys
sys.path.insert(0,'.')
from opener_pool_r2 import POOL
LIMIT=4950
D=json.load(io.open('v3_decks.json',encoding='utf-8'))
for key,cfg in D.items():
    rows=list(csv.DictReader(io.open(key+'.arc2.takes.csv',newline='',encoding='utf-8')))
    cards=[r for r in rows if r['kind']=='card']
    op={r['card_number']:r['opener'] for r in cards}
    for n,o in cfg.get('set',{}).items(): op[n]=o
    def render():
        sec={r['card_number']:r.get('arc_section','') for r in cards}
        out=["[Intro]",cfg['intro'],""]
        verse=1; out+=["[Verse 1]"]
        chorus_done=0
        for i,r in enumerate(cards):
            n=r['card_number']
            if n in cfg['chorus_after']:
                pass
            o=op.get(n,'')
            out.append((o+POOL[o][2]+r['triplet']) if o else r['triplet'])
            out.append("")
            if n in cfg['chorus_after']:
                if chorus_done==0: out+=["[Chorus]"]+cfg['chorus']+[""]
                else: out+=["[Chorus]",cfg['chorus'][0],""]
                chorus_done+=1
                if n==cfg.get('break_after'): out+=["[Break]",""]
                verse+=1; out+=[f"[Verse {verse}]"]
        out+=["[Chorus]",cfg['chorus'][0],"","[Outro]","Stay Fluffy!"]
        return "\n".join(out).replace("\n\n\n","\n\n")+"\n"
    txt=render(); cut=[]
    for n in cfg['cut_order']:
        if len(txt)<cfg.get('limit',LIMIT): break
        if op.get(n): cut.append((n,op[n])); op[n]=''; txt=render()
    io.open(key+'.v3.suno.txt','w',encoding='utf-8').write(txt)
    used=[o for o in op.values() if o]
    assert len(used)==len(set(used)), key+' opener doppelt'
    print(key,len(txt),'openers',len(used),'cut',cut)
