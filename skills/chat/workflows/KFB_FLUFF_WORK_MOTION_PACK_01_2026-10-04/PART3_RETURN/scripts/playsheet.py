from PIL import Image,ImageDraw; import json,sys
W=230
def sheet(clips,out,title):
    rows=[]
    for c in clips:
        R=Image.new('RGB',(12*W,W+20),(248,246,240)); d=ImageDraw.Draw(R); d.text((4,4),c,fill=(0,0,0)); d.text((6*W+4,4),'Rig_Large (Orc Brute)',fill=(0,0,0))
        for a,act in enumerate(['RobotOne','OrcBrute']):
            for k in range(3):
                for v,vw in enumerate(['side','q34']):
                    try: R.paste(Image.open(f'/tmp/f3/play2/{act}/{c}__{vw}__{k:03d}.png').resize((W,W)),((a*6+k*2+v)*W,20))
                    except Exception as e: pass
        rows.append(R)
    S=Image.new('RGB',(12*W,len(rows)*(W+20)),'white')
    for i,r in enumerate(rows): S.paste(r,(0,i*(W+20)))
    S.save(out)
sheet(['kfb_action_header_soccerball_a','kfb_action_headbutt_a','kfb_action_headbutt_b','kfb_action_kicking_a','kfb_action_inside_crescent_kick_a','kfb_throw_frisbee_a','kfb_throw_goalkeeper_overhand_a'],'/tmp/f3/out/PART3_PLAY_CONTACTS.png','')
sheet(['kfb_fluff_ball_surf_a','kfb_fluff_ball_balance_a','kfb_fluff_ball_dance_a','kfb_fluff_foot_roll_a'],'/tmp/f3/out/PART3_BALL_RIDE.png','')
