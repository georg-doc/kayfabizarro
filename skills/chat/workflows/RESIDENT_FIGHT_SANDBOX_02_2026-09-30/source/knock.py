exec(open('/tmp/fs1/common.py').read())
R=json.load(open('/tmp/fs2/react.json'))
KB={ # knockback direction relative to the character's own facing at the clip's first frame (0 forward, 180 back, +90 its left)
 'kfb_reaction_taking_punch_a':(-130,'head recoil (in place)'),
 'kfb_reaction_receiving_an_uppercut_a':(-134,'hips travel 0.77 m'),
 'kfb_reaction_surprise_uppercut_a':(3,'hips travel 1.48 m; the clip starts turned away from the hit'),
 'kfb_reaction_reaction_a':(-90,'judged by eye: turns to its right; in place'),
 'kfb_reaction_standing_react_small_from_right_a':(90,'from the clip name (hit from the right, sways left); very small motion'),
 'kfb_reaction_shoved_reaction_with_spin_a':(16,'hips travel 1.54 m (shoved from behind)'),
 'kfb_reaction_death_from_the_front_a':(73,'hips travel 0.40 m, folds forward-left'),
 'kfb_reaction_standing_death_left_01_a':(164,'hips travel 0.48 m, falls backward'),
 'kfb_reaction_fall_flat_a':(2,'hips travel 1.95 m, falls forward on the face')}
out={}
for rid,(kb,src) in KB.items():
    x=R[rid]; per={}
    for rig in RIGS:
        W=frames(rig,rid)[0]; lr=W['upperleg.l'].translation-W['upperleg.r'].translation
        per[rig]={'startFacingYawDeg':round(math.degrees(math.atan2(-lr.x,lr.y)),1)}
    out[rid]={'knockbackRelDeg':kb,'knockbackSource':src,'facesAttacker':abs(kb)>=110,'hitFrom':'front' if abs(kb)>=110 else ('behind' if abs(kb)<=70 else ('left' if kb<0 else 'right')),
              'impactFrame':x['impactFrame'],'frames':x['frames'],'endsLying':x['endsLying'],'endFace':x['endFace'],'byRig':per}
    print(rid[13:],out[rid]['hitFrom'],per)
json.dump(out,open('/tmp/fs2/knock.json','w'),indent=1)
