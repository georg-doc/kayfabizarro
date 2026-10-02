import sys; sys.path.insert(0,'/tmp/hex/work')
exec(open('/tmp/hex/work/s1p.py').read().split("if __name__")[0])
import json, math
MEAS=M
TOPO={t['key']:t['topology'] for t in MEAS['hexTiles']['tiles']}
PAL={'foliage':(0.13,0.42,0.22),'rock':(0.42,0.44,0.46),'mush':(0.75,0.25,0.18),'grass':(0.45,0.62,0.18),'wood':(0.50,0.30,0.16)}
# per-source-world scale hypotheses (hex native units: tile flat-to-flat 2.0)
SCALE={'P0B':0.55,'K1':0.40,'T3':0.08,'P2':0.50}
SRCWORLD={'P0B_TREE':'P0B','P0B_PEBBLE':'P0B','K1_BOULDER':'K1','T3_ACCENT_ROCK':'T3','T3_BUSH':'T3'}
def world_of(id): return SRCWORLD.get(id,'P2')
def rotKinds(k,n):
    out=[None]*6
    for i in range(6): out[(i+n)%6]=k[i]
    return ''.join(out)
def rotDeg(n): return ((6-(n%6))%6)*60
ODD=[[(1,0),(0,1),(-1,1),(-1,0),(-1,-1),(0,-1)],[(1,0),(1,1),(0,1),(-1,0),(0,-1),(1,-1)]]
def nb(c,r,d): dc,dr=ODD[r&1][d]; return (c+dc,r+dr)
def deck_z(dg,x,y,tiles):
    hit,loc,nrm,idx,obj,mat=bpy.context.scene.ray_cast(dg,Vector((x,y,10)),Vector((0,0,-1)))
    return (round(loc.z,4),obj,nrm) if hit else (None,None,None)
def build(rec, render_prefix=None, clay=None):
    reset((1000,700))
    tiles=[]; props=[]; cellmap={}
    for c in rec['cells']:
        col,row=c['cell']; n=c['rotTurns']; lvl=c.get('level',0)
        loc=cell_xy(col,row)+Vector((0,0,lvl))
        r,new=place(c['key'],loc,rotDeg(n)); tiles+=new
        cellmap[(col,row)]=c
        for o in new: o['kfb_cell']=f'{col},{row}'
    bpy.context.view_layer.update()
    for p in rec['props']:
        col,row=p['cell']; base=cell_xy(col,row)+Vector((p['offset'][0],p['offset'][1],0))
        if p['source']=='authored':
            r,new=place(p['key'],base,p.get('yawDeg',0)); objs=new
        else:
            o=mkproc(p['id'],base,SCALE[world_of(p['id'])]*p.get('scaleMul',1.0),PAL[p['palette']]); o.rotation_euler=(0,0,math.radians(p.get('yawDeg',0))); objs=[o]
        p['_objs']=objs; props+=objs
    # supports: drop props to deck (tiles only)
    for o in props: o.hide_set(True)
    bpy.context.view_layer.update(); dg=bpy.context.evaluated_depsgraph_get()
    for p in rec['props']:
        root=[o for o in p['_objs'] if o.parent is None][0]
        z,obj,nrm=deck_z(dg,root.location.x,root.location.y,tiles)
        p['support']={'deckY':z,'onCell':obj['kfb_cell'] if obj else None,'deckNormalTilt':round(math.degrees(nrm.angle(Vector((0,0,1)))),1) if nrm else None}
        if z is not None: root.location.z=z
    # walk ring
    ring=[]
    for c in rec['cells']:
        col,row=c['cell']; ctr=cell_xy(col,row)
        for i in range(24):
            a=math.radians(i*15); x=ctr.x+math.cos(a)*0.72; y=ctr.y+math.sin(a)*0.72
            z,obj,nrm=deck_z(dg,x,y,tiles); ring.append([x,y,z,obj['kfb_cell'] if obj else None])
    for o in props: o.hide_set(False)
    bpy.context.view_layer.update(); dg=bpy.context.evaluated_depsgraph_get()
    pbox=[]
    for p in rec['props']:
        root=[o for o in p['_objs'] if o.parent is None][0]; zb=root.location.z
        xs=[];ys=[]
        for o in p['_objs']:
            if o.type!='MESH': continue
            for v in o.data.vertices:
                w=o.matrix_world@v.co
                if w.z<zb+0.25: xs.append(w.x); ys.append(w.y)
        if not xs: xs=[root.location.x]; ys=[root.location.y]
        dl='LOW' if p['required'] else p.get('density')
        pbox.append((min(xs),max(xs),min(ys),max(ys),dl))
        p['groundFootprint_three']={'x':[round(min(xs),3),round(max(xs),3)],'z':[round(-max(ys),3),round(-min(ys),3)]}
    order={'LOW':0,'TARGET':1,'MAX':2}
    walk=[]
    for x,y,z,cell in ring:
        bl={}
        for prof in ('LOW','TARGET','MAX'):
            bl[prof]=any(a-0.08<=x<=b+0.08 and c-0.08<=y<=d+0.08 for a,b,c,d,dl in pbox if order[dl]<=order[prof])
        walk.append({'xyz_three':[round(x,3),round(z,3) if z is not None else None,round(-y,3)],'cell':cell,'blockedAt':bl,'void':z is None})
    # seam audit: inter-cell edges
    seams=[]; openEdges=[]
    for c in rec['cells']:
        col,row=c['cell']; kinds=rotKinds(TOPO[c['key']]['kinds'],c['rotTurns'])
        for d in range(6):
            nc=nb(col,row,d)
            if nc in cellmap:
                if any({tuple(s['a']),tuple(s['b'])}=={(col,row),nc} for s in seams): continue
                o=cellmap[nc]; ok=rotKinds(TOPO[o['key']]['kinds'],o['rotTurns'])[(d+3)%6]
                # heights along the shared edge (5 samples, 4 cm inside each side)
                a=cell_xy(col,row); b=cell_xy(*nc); mid=(a+b)/2; t=(b-a).normalized(); perp=Vector((-t.y,t.x,0))
                hs=[]
                for s in (-0.4,-0.2,0,0.2,0.4):
                    q=mid+perp*s
                    za,_,_=deck_z(dg,*(q-t*0.04).xy,tiles); zb,_,_=deck_z(dg,*(q+t*0.04).xy,tiles); hs.append((za,zb))
                # props may be hit; use tile-only pass
                seams.append({'a':[col,row],'b':list(nc),'dir':d,'classA':kinds[d],'classB':ok,'classMatch':kinds[d]==ok})
            else:
                openEdges.append({'cell':[col,row],'dir':d,'class':kinds[d]})
    # tile-only height check for seams
    for o in props: o.hide_set(True)
    bpy.context.view_layer.update(); dg=bpy.context.evaluated_depsgraph_get()
    for s in seams:
        a=cell_xy(*s['a']); b=cell_xy(*s['b']); mid=(a+b)/2; t=(b-a).normalized(); perp=Vector((-t.y,t.x,0)); dz=[]
        for k in (-0.4,-0.2,0,0.2,0.4):
            q=mid+perp*k; za,_,_=deck_z(dg,*(q-t*0.04).xy,tiles); zb,_,_=deck_z(dg,*(q+t*0.04).xy,tiles)
            dz.append(round(abs(za-zb),3) if za is not None and zb is not None else None)
        s['deckStepAlongEdge']=dz; s['maxStep']=max(x for x in dz if x is not None)
    for oe in openEdges:
        a=cell_xy(*oe['cell']); ang=math.radians(60*oe['dir']); q=a+three2bl(math.cos(ang)*0.93,0,math.sin(ang)*0.93)
        z,_,_=deck_z(dg,q.x,q.y,tiles); oe['deckY']=z
    for o in props: o.hide_set(False)
    out={'walk':walk,'seams':seams,'openEdges':openEdges,'props':[{k:v for k,v in p.items() if k!='_objs'} for p in rec['props']]}
    if clay:
        from clay import apply_clay_lite
        for m in {s.material for o in tiles+props if o.type=='MESH' for s in o.material_slots if s.material}: apply_clay_lite(m,clay)
    # anchors as empties for the .blend
    for a in rec['anchors']:
        col,row=a['cell']; q=cell_xy(col,row)+Vector((a['offset'][0],a['offset'][1],0))
        for o in props: o.hide_set(True)
        bpy.context.view_layer.update(); dg=bpy.context.evaluated_depsgraph_get(); z,_,_=deck_z(dg,q.x,q.y,tiles)
        for o in props: o.hide_set(False)
        e=bpy.data.objects.new('anchor_'+a['id'],None); e.empty_display_type='SINGLE_ARROW'; e.location=(q.x,q.y,z or 0); e.rotation_euler=(0,0,math.radians(a.get('facingDeg',0))); bpy.context.scene.collection.objects.link(e); e.hide_render=True
        a['xyz_three']=[round(q.x,3),z,round(-q.y,3)]
    if render_prefix:
        vis=tiles+props
        camera(vis,az=30,el=38,lens=45,margin=1.0); render(render_prefix+'_34.png')
        for c in rec['cells']:
            col,row=c['cell']; edge_labels(cell_xy(col,row)+Vector((0,0,c.get('level',0)+0.05)),z=0.0,r=0.86)
        cam=camera(vis,az=0,el=90,ortho=True,margin=1.0); cam.rotation_euler=(0,0,0); render(render_prefix+'_top.png')
        for o in list(bpy.data.objects):
            if o.name.startswith('lbl_'): bpy.data.objects.remove(o)
    return out,tiles,props
