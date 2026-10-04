import os,glob,json,subprocess
from PIL import Image,ImageDraw
F='/tmp/f2/fr'; O='/tmp/f2/out'; os.makedirs(O,exist_ok=True)
clips=['kfb_fluff_roll_push_a','kfb_fluff_roll_push_heavy_a','kfb_fluff_steer_left_a','kfb_fluff_steer_right_a','kfb_fluff_knead_press_a','kfb_fluff_collect_debris_a','kfb_fluff_place_small_a','kfb_fluff_pack_flatten_a','kfb_fluff_patch_press_a']
W=280
def fr(act,c,v,k): return f'{F}/{act}/{c}__{v}__{k:03d}.png'
def nfr(act,c): return len(glob.glob(f'{F}/{act}/{c}__side__*.png'))
def tile(c,k,km):
    S=Image.new('RGB',(4*W,W+22),(248,246,240)); d=ImageDraw.Draw(S)
    for i,(act,v) in enumerate([('RobotOne','side'),('RobotOne','q34'),('OrcBrute','side'),('OrcBrute','q34')]):
        kk=k if act=='RobotOne' else km
        p=fr(act,c,v,kk)
        if os.path.exists(p): S.paste(Image.open(p).resize((W,W)),(i*W,22))
    d.text((4,5),f'{c}   Rig_Medium (Robot One)',fill=(0,0,0)); d.text((2*W+4,5),'Rig_Large (Orc Brute)',fill=(0,0,0)); return S
def sheet(name,cl):
    rows=[]
    for c in cl:
        n=min(nfr('RobotOne',c),nfr('OrcBrute',c)); rows.append(tile(c,n//3,n//3))
    S=Image.new('RGB',(4*W,len(rows)*(W+22)),'white')
    for i,r in enumerate(rows): S.paste(r,(0,i*(W+22)))
    S.save(f'{O}/{name}')
sheet('PART2_PUSH_STEER_MEDIUM_LARGE.png',clips[:4]); sheet('PART2_WORK_G4_G5_MEDIUM_LARGE.png',clips[4:])
# video: each clip twice, 15 fps
os.makedirs('/tmp/f2/vid',exist_ok=True); n=0
for c in clips:
    m=min(nfr('RobotOne',c),nfr('OrcBrute',c))
    for rep in range(2):
        for k in range(m):
            tile(c,k,k).save(f'/tmp/f2/vid/v{n:05d}.png'); n+=1
subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','15','-i','/tmp/f2/vid/v%05d.png','-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2','-c:v','libx264','-pix_fmt','yuv420p','-crf','26',f'{O}/PART2_FLUFF_CLIPS_MEDIUM_LARGE.mp4'],check=True)
print('frames',n)
