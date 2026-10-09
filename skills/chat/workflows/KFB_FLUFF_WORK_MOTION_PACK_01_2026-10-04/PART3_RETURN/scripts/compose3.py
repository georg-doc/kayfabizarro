import os,glob,subprocess
from PIL import Image,ImageDraw
F='/tmp/f3/push'; O='/tmp/f3/out'; W=260
def n(act,c): return len(glob.glob(f'{F}/{act}/{c}__side__*.png'))
def tile(lm,ll,k,label):
    S=Image.new('RGB',(4*W,W+22),(248,246,240)); d=ImageDraw.Draw(S)
    for i,(act,c,v) in enumerate([('RobotOne',lm,'side'),('RobotOne',lm,'q34'),('OrcBrute',ll,'side'),('OrcBrute',ll,'q34')]):
        if c is None: continue
        m=n(act,c); p=f'{F}/{act}/{c}__{v}__{k%m:03d}.png'
        if os.path.exists(p): S.paste(Image.open(p).resize((W,W)),(i*W,22))
    d.text((4,5),label,fill=(0,0,0)); return S
rows=[('kfb_fluff_roll_push_a','kfb_fluff_roll_push_a','roll_push · Medium ball r 0.72 (Robot One) | Large ball r 1.40 (Orc Brute)'),
      ('kfb_fluff_roll_push_heavy_a','kfb_fluff_roll_push_heavy_a','roll_push_heavy'),
      ('kfb_fluff_steer_left_a','kfb_fluff_steer_left_a','steer_left'),('kfb_fluff_steer_right_a','kfb_fluff_steer_right_a','steer_right'),
      ('kfb_fluff_roll_push_big_a',None,'roll_push_big · Robot One on the Large ball r 1.40 (Sisyphos / team / growing ball)'),
      ('kfb_fluff_roll_push_heavy_big_a',None,'roll_push_heavy_big'),('kfb_fluff_steer_left_big_a',None,'steer_left_big (right = mirror)')]
S=Image.new('RGB',(4*W,len(rows)*(W+22)),'white')
for i,(a,b,l) in enumerate(rows): S.paste(tile(a,b,n('RobotOne',a)//3,l),(0,i*(W+22)))
S.save(f'{O}/PART3_PUSH_SISYPHOS_MEDIUM_LARGE.png')
os.makedirs('/tmp/f3/vid',exist_ok=True); [os.remove(x) for x in glob.glob('/tmp/f3/vid/*.png')]; i=0
for a,b,l in rows:
    m=max(n('RobotOne',a),n('OrcBrute',b) if b else 0)
    for k in range(2*m): tile(a,b,k,l).save(f'/tmp/f3/vid/v{i:05d}.png'); i+=1
subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','15','-i','/tmp/f3/vid/v%05d.png','-vf','pad=ceil(iw/2)*2:ceil(ih/2)*2','-c:v','libx264','-pix_fmt','yuv420p','-crf','26',f'{O}/PART3_PUSH_SISYPHOS.mp4'],check=True)
print(i)
