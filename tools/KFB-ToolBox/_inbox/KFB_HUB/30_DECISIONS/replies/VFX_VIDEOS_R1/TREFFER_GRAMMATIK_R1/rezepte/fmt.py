import json,sys,os
def k(v):
    if isinstance(v,dict) and 'kurve' in v: return '%s×%s'%(v['x'], '→'.join('%g@%g'%(b,a) for a,b in v['kurve']))
    if isinstance(v,dict) and 'kurveMax' in v: return '%s×[%s | %s]'%(v['x'],'→'.join('%g@%g'%(b,a) for a,b in v['kurveMin']),'→'.join('%g@%g'%(b,a) for a,b in v['kurveMax']))
    if isinstance(v,list): return '%g–%g'%tuple(v) if len(v)==2 and all(isinstance(x,(int,float)) for x in v) else str(v)
    return str(v)
def g(v):
    if isinstance(v,dict) and 'farbe' in v: return 'F:'+'→'.join('%s@%g'%(c,t) for t,c in v['farbe'])+' A:'+'→'.join('%g@%g'%(a,t) for t,a in v['alpha'])
    if isinstance(v,dict): return 'min{%s} max{%s}'%(g(v.get('min')),g(v.get('max')))
    return str(v)
for f in sys.argv[1:]:
    d=json.load(open(f))
    for p,ls in d.items():
        print('\n### '+os.path.basename(p))
        for e in ls:
            m=e['material'][0] if e['material'] else {}
            tex=os.path.basename(m.get('tex') or '?'); fb=e['flipbook']
            em=('Burst '+', '.join('%s@%gs%s'%(k(b['n']),b['t'],('×%d/%gs'%(b['zyklen'],b['abstand']) if (b['zyklen'] or 1)>1 else '')) for b in e['bursts'])) if e['bursts'] else ''
            if e['rate'] not in (0,None): em+=(' ' if em else '')+'Rate '+k(e['rate'])+'/s'
            L=['- %s%s%s'%(e['name'],'' if e['aktiv'] else ' [AUS]','' if e.get('renderAn',1) else ' [Render aus]'),
               'ab %s s'%k(e['verzoegerung']),'Leben %s'%k(e['leben']),'Größe %s'%k(e['groesse'])+(' (Y %s)'%k(e['groesseY']) if e.get('groesseY') is not None else ''),em or 'KEINE Emission',
               '%s%s %s'%(tex,' %dx%d'%tuple(fb['raster']) if fb else '',m.get('misch','?')),'Farbe %s'%g(e['farbe'])]
            if fb: L.append('Flipbook Bild %s Zyklen %s'%(k(fb['bild']),fb['zyklen'])+(' Start %s'%k(fb['start']) if fb['start'] not in (0,None) else ''))
            if e['groesseZeit'] is not None: L.append('Größe/Zeit %s'%k(e['groesseZeit']))
            if e['farbeZeit'] is not None: L.append('Farbe/Zeit %s'%g(e['farbeZeit']))
            if e['tempo'] not in (0,None): L.append('Tempo %s'%k(e['tempo'])+(' Form %s %s° r%s'%(e['form']['art'],e['form']['winkel'],e['form']['radius']) if e['form'] else ''))
            elif e['form']: L.append('Form %s r%s'%(e['form']['art'],e['form']['radius']))
            if e['schwere'] not in (0,None): L.append('Schwere %s'%k(e['schwere']))
            if e['drehung'] not in (0,None): L.append('Drehung %s'%k(e['drehung']))
            for nm,key in [('Dreh/Zeit','drehZeit'),('Geschw/Zeit','geschwZeit'),('Bremse','bremse'),('Kraft','kraft'),('Rauschen','rauschen')]:
                if e[key] not in (None,0): L.append('%s %s'%(nm, k(e[key]) if not isinstance(e[key],dict) or 'kurve' in e[key] else json.dumps(e[key],ensure_ascii=False)))
            L.append(e['render']+('/'+e['ausrichtung'] if e['ausrichtung']!='Sicht' else '')+(' Streck %s'%e['streck'] if e['streck'] else ''))
            if e['schleife']: L.append('SCHLEIFE Dauer %s'%e['dauer'])
            if e['spur']: L.append('Spur')
            if e['licht']: L.append('Licht')
            pos=e.get('pos') or {}; rot=e.get('rot') or {}; sk=e.get('skala') or {}
            if any(abs(pos.get(a,0))>1e-3 for a in 'xyz'): L.append('Pos %s'%[round(pos.get(a,0),2) for a in 'xyz'])
            if any(abs(rot.get(a,0))>1e-3 for a in 'xyz'): L.append('Rot %s'%[round(rot.get(a,0)) for a in 'xyz'])
            if any(abs(sk.get(a,1)-1)>1e-3 for a in 'xyz'): L.append('Skala %s'%[round(sk.get(a,1),2) for a in 'xyz'])
            if e.get('ordnung') or e.get('sortierung'): L.append('Ordnung %s/%s'%(e.get('ordnung'),e.get('sortierung')))
            print(' · '.join(L))
