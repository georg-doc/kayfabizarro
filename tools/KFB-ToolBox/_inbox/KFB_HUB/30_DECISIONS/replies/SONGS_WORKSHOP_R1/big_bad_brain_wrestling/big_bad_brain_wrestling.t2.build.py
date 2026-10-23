# BBBW t2 (Georg 23.10.): Faden "ich gegen mein eigenes Gehirn" (Cover: FrizzleBob ringt mit einem Gehirn).
# Kartenzeile = Triplet (nur Kartenwörter, Titel + Power-Begriff, Telegramm, Pointe); Opener = Erzählschicht, läuft in den Titel.
# Nummern nach Druck-Kartendaten media/kfb @52adc8f1 (50 Steel Steps, 51 Ring Post).
L = [
 (1,"Every morning my brain comes out as","The Babyface, cheering crowd: high-flying moves; cheat, you lose. A slave to approval."),
 (2,"So I became","The Heel, cheating: bear hugs, eye pokes. If they aren't booing, you aren't doing your job."),
 (3,"It stopped asking.","The Tweener, Face or Heel on a coin flip: you don't ask for it, so they want you more."),
 (4,"Guess who lay down.","The Jobber, isolated, picked apart; only control: who defeats you."),
 (5,"It sat on me.","The Immovable Object, immune to throws: slow gorilla. You Can't Win."),
 (6,"I climbed the bookshelf.","The Aerial Ace dodges any attack; fail, double damage. Stand still, you die."),
 (7,"It jumped after me.","The Powerhouse Botch off the top rope: crush yourself, or crush everyone."),
 (8,"Outta nowhere, I lifted it.","The Little Giant, surprising strength, lifts the Huge; surprise doubles damage."),
 (9,"","The Master Seller, sympathy: reel back, limp to the ring, make them believe."),
 (10,"My brain didn't buy it.","The No-Sell Monster sits right back up: removes all tension for ego."),
 (11,"","The Oversell Clown, reacting far beyond reality: a mockery of the sport. See: Michaels and Hogan."),
 (12,"","The Limb Target, called shot: legs, no speed; arms, no lifting. Cruel, logical, effective."),
 (13,"","The Thigh Slap didn't hurt, but sounds like it did: an audio lie."),
 (14,"","The Stomp Punch, stun with noise: stomping on the mat. Kinetic misdirection."),
 (15,"My neighbour knocked.","The Echo Chest: loud noise, but many strikes to actually bruise."),
 (16,"","The Chop Fest: nothing but chop, until one quits. A test of endurance."),
 (17,"My brain wore a mask.","The Sacred Mask, kayfabe sacred to identity: never remove it."),
 (18,"I pulled.","The Rudo Ripper: instant disqualification, but you win the feud."),
 (19,"","The Strong Style Spirit: the more damage you take, the harder you hit back."),
 (20,"","The Limp Arm refuses the lockup: sign of a shooter."),
 (21,"I cut myself shaving. On purpose.","The Juice Lover: you can't hurt me if I hurt me first."),
 (22,"","The Snake Bag has a live snake: terrify them before the match starts."),
 (23,"","The Lazy Genius, hands in pockets: the apathy makes them furious."),
 (24,"","The Exotic attacks dignity, not the body: psychological dominance."),
 (25,"I tagged in my liver.","The Hot Tag: fresh partner for payback, the explosive release of tension."),
 (26,"","The Victim, the Ricky Morton role: isolated and picked apart. You are the bait."),
 (27,"It called my nerves.","The Wolfpack, brawler, flyer, powerhouse: triple attack on the isolated."),
 (28,"","The Savant Manager knows the moves better than they do."),
 (29,"I asked the cat.","The Pop Hunter: if they want a heel, give them a heel. Want a clown? Honk your nose."),
 (30,"The cat left.","The Empty Arena, pausing for a pop that never comes: silence amplifies impacts."),
 (31,"So I played cat videos.","The Green Screen Crowd pipes in noise: audio sweetening on a lie."),
 (32,"","The Plant: I'm just a fan! Gambling on the outcome while part of the show."),
 (33,"My brain stopped playing along.","The Shooter forces you to sell; refuse, real damage. Stiff the no-seller."),
 (34,"","The Sandbag refuses to cooperate: dead weight. Extremely unprofessional."),
 (35,"Something cracked.","The Real Injury, unplanned: the crowd goes nuts because it's real."),
 (36,"","The Cue Card Holder reveals the next move: short cuts for out-of-depth wrestlers."),
 (37,"","The Undead Wizard gets under your skin with smoke and mirrors."),
 (38,"","The Uninterested Genius: loaf around, wake up only at critical health."),
 (39,"","The Trash Talker, shouting at Michael Cole: hilarious and entertaining abuse."),
 (40,"","The Finger Poke of Doom: instant pin if you consent. Strength? No, gullibility."),
 (41,"I saved one move.","The Finisher, the Leg Drop, once per match: if this hits, go home."),
 (42,"It kicked out.","The False Finish survives the pinfall: the art of the near-fall."),
 (43,"","The Squash against any jobber: no-selling, total dominance."),
 (44,"","The Time Limit Draw: no winner, both keep dignity. No one loses."),
 (45,"Who decides this?","The Booker, before it starts: the ending is pre-planned. You are just a puppet."),
 (46,"","The Spot Caller changes the plan mid-match: a basic outline, filled in with sweat."),
 (47,"","The Rehearsal, Hogan and Warrior: perfect, but lacks soul."),
 (48,"","The Rest Hold: slow down, give the audience a chance to catch up."),
 (49,"My neighbour filmed it.","The Hard Cam: if the camera didn't see it, it didn't happen."),
 (50,"","The Steel Steps, weaponized furniture: environment, not weapon. Usually."),
 (51,"","The Ring Post, unforgiving steel: miss a charge, max damage."),
 (52,"","The Announcer's Table: shouting at Michael Cole while destroying his desk."),
 (53,"He posted a review.","The Internet Smark critiques bad psychology without ever taking a bump."),
 (54,"","The Botched Spot, incoherent collection of moves: it just looks messy."),
 (55,"The doctor asked.","The Kayfabe Police enforce the lie: keep the secrets secret, or get fired."),
 (56,"So I lost on purpose.","The Retirement Match: rising, and falling. See you next season."),
]
INTRO="Big Bad Brain Wrestling: the physics of fake pain and the economy of real ego."
OUTRO="My brain is back next week anyway. It's still real to me, dammit."
import csv
w=csv.writer(open('big_bad_brain_wrestling.t2.triplets.csv','w',newline='')); w.writerow(['line_no','kind','card_number','opener','triplet'])
for i,(n,o,t) in enumerate(L,1): w.writerow([i,'card',n,'',t])
json_ops=[{'cardNumber':n,'opener':o,'triplet':t} for n,o,t in L]
import json; json.dump({'schema':'kfb.triplet-set.opener/1','revision':'t2','intro':INTRO,'outro':OUTRO,'lines':json_ops},open('big_bad_brain_wrestling.t2.lines.json','w'),indent=1,ensure_ascii=False)
beats=['[Spoken Word]',INTRO]+[(o+' '+t).strip() for n,o,t in L]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'; open('big_bad_brain_wrestling.t2.suno.txt','w').write(txt)
ow=sum(len(o.split()) for _,o,_ in L)+len(INTRO.split())+len(OUTRO.split())+3; cw=sum(len(t.split()) for _,_,t in L)
print('chars',len(txt),'openers',sum(1 for _,o,_ in L if o),'card%',round(100*cw/(cw+ow)))
