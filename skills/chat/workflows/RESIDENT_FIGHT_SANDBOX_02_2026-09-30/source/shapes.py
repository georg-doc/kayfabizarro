# head sphere + body capsule per rig, measured on the meshes in the boxing stance; offsets in head / hips bone space
exec(open('/tmp/fs1/common.py').read())
CORR=open_ws(); out={}
for rig in RIGS:
    W=frames(rig,'kfb_action_boxing_a')[0]; pose(rig,W,CORR); V=verts(rig)
    H=V['Head']; lo,hi=H.min(0),H.max(0)
    r=float(((hi[0]-lo[0])+(hi[1]-lo[1]))/4)                 # half the mean head width (hair crest ignored)
    c=np.array([(lo[0]+hi[0])/2,(lo[1]+hi[1])/2,lo[2]+r])      # sphere sits on the chin
    Hm=W['head']; off=Hm.inverted()@Vector(c.tolist())
    B=V['Body']; bl,bh=B.min(0),B.max(0); rb=float(((bh[0]-bl[0])+(bh[1]-bl[1]))/4)
    out[rig]={'headSphere':{'bone':'head','offsetInBoneSpace':[round(x,3) for x in off],'radiusM':round(r,3),
                            'centerHeightInStanceM':round(float(c[2]),3)},
              'bodyCapsule':{'from':'hips','to':'head (neck joint)','radiusM':round(rb,3)},
              'note':'measured on the Orc mesh in kfb_action_boxing_a frame 1: head sphere = half the mean head width, resting on the chin (hair crest ignored); body capsule radius = half the mean torso width (arms excluded)'}
    print(rig,out[rig])
json.dump(out,open('/tmp/fs2/shapes.json','w'),indent=1)
