import os,subprocess,json
from PIL import Image,ImageDraw
P='/tmp/f2/pair'; O='/tmp/f2/out'; os.makedirs('/tmp/f2/pv',exist_ok=True)
def tile(k):
    S=Image.new('RGB',(1200,742),(248,246,240)); d=ImageDraw.Draw(S)
    for i,r in enumerate(['Medium','Large']):
        for j,v in enumerate(['side','q34']):
            S.paste(Image.open(f'{P}/{r}/pair__{v}__{k:03d}.png'),(i*600,22+j*360))
    d.text((4,5),f'gift_give_a -> gift_receive_a (receiver +10 f)   frame {k+1}   Rig_Medium: Robot One -> Robot Two  (roots 1.149 m)',fill=(0,0,0)); d.text((604,5),'Rig_Large: Orc Brute -> Orc Brute  (roots 2.774 m)   handover = give.release 50 / receive.grab 40',fill=(0,0,0))
    return S
for k in range(90): tile(k).save(f'/tmp/f2/pv/p{k:03d}.png')
subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i','/tmp/f2/pv/p%03d.png','-c:v','libx264','-pix_fmt','yuv420p','-crf','26',f'{O}/PART2_PAIR_GIVE_RECEIVE.mp4'],check=True)
# sheet: frames 1, 30, 50, 75 q34+side? use tiles downscaled
ks=[0,29,49,74]; S=Image.new('RGB',(1200,742*2),'white')
for n,k in enumerate(ks):
    t=tile(k).resize((600,371)); S.paste(t,((n%2)*600,(n//2)*371))
S=S.crop((0,0,1200,742)); S.save(f'{O}/PART2_PAIR_GIVE_RECEIVE.png')
print(json.load(open(f'{P}/Medium/gaps.json'))[47:52],json.load(open(f'{P}/Large/gaps.json'))[47:52])
