# BBBW t3 (Georg 23.10.): jede Karte mit Kontext-Einstieg (Mikro-Story), Kartenzeile als Pointe. Best-of (R3.7), Faden "ich gegen mein Gehirn".
# Opener = Erzählschicht (eigene Wörter, Präsens). Triplet = nur Kartenwörter (triplet_set_check). Nummern nach Druck @52adc8f1.
L = [
 (1,"Every morning my brain climbs out of bed as","The Babyface, high-flying moves, because audiences cheer: a slave to approval."),
 (2,"Nobody cheers for me, so I become","The Heel: bear hugs, eye pokes. If they aren't booing, you aren't doing your job."),
 (3,"Now my brain doesn't even ask for applause.","The Tweener: you don't ask for it, which makes them want you more."),
 (4,"Guess who's lying on the kitchen floor?","The Jobber, isolated and picked apart. You exist to make the other guy look good."),
 (5,"I try to get up; my brain sits on me.","The Immovable Object, slow gorilla, strong enough to hurl you like a ragdoll."),
 (6,"So I climb the bookshelf.","The Aerial Ace, agile and fast: if you stand still, you die."),
 (7,"My brain jumps after me.","The Powerhouse Botch off the top rope: a tragedy waiting to happen."),
 (8,"Out of nowhere I lift my own brain over my head.","The Little Giant: smaller, surprising strength."),
 (9,"For days I limp through the flat.","The Master Seller: reel back, limp to the ring, make them believe."),
 (10,"My brain doesn't buy it.","The No-Sell Monster sits right back up: remove all tension for ego."),
 (13,"So I kick the wardrobe and slap my leg.","The Thigh Slap didn't hurt, but it sounds like it did. An audio lie."),
 (15,"My neighbour bangs on the wall; it's only my chest.","The Echo Chest: loud noise, but it requires many strikes to actually bruise."),
 (16,"So we go on all night, chop for chop.","The Chop Fest: nothing but chop, until one quits. A test of endurance."),
 (17,"At breakfast my brain turns up in a mask.","The Sacred Mask, sacred to identity: never remove it."),
 (18,"I rip it off anyway.","The Rudo Ripper: instant disqualification, but you win the feud."),
 (20,"Next morning my brain won't shake my hand.","The Limp Arm: rejection of the traditional start, a telltale sign of a shooter."),
 (21,"To feel anything at all, I cut myself shaving. On purpose.","The Juice Lover: you can't hurt me if I hurt me first."),
 (22,"My brain answers with a sports bag on the table.","The Snake Bag has a live snake: terrify them before the match starts."),
 (23,"So I stay in bed all day:","The Lazy Genius, hands in pockets. It looks like a chore, and the apathy makes them furious."),
 (24,"Furious, my brain puts on a feather boa and goes for my dignity.","The Exotic: dignity rather than body. Psychological dominance."),
 (25,"I tag in my liver.","The Hot Tag: fresh partner for payback, the explosive release of tension."),
 (26,"My liver lasts a minute.","The Victim, isolated and picked apart: you are the bait."),
 (27,"My brain calls in my nerves.","The Wolfpack: triple attack on an isolated target. The numbers game."),
 (28,"Now a little voice in my head tells everyone what to do.","The Savant Manager: you know the moves better than they do."),
 (29,"I ask the cat what she wants to see.","The Pop Hunter: if they want a heel, give them a heel. If they want a clown, honk your nose."),
 (30,"The cat walks out.","The Empty Arena, pausing for a pop that never comes: silence amplifies the sound of impacts."),
 (31,"So I play cat videos at full volume.","The Green Screen Crowd: a failed attempt to hide the emptiness."),
 (32,"The cat comes back in a fake moustache and bets on my brain.","The Plant: I'm just a fan! Gambling on the outcome while part of the show."),
 (33,"That's when my brain stops playing along.","The Shooter: if you refuse to sell, real damage."),
 (35,"Something in my head goes crack.","The Real Injury, unplanned. The crowd goes nuts because it's real."),
 (37,"That night it comes back from the cellar in a long black coat.","The Undead Wizard: get under their skin with smoke and mirrors."),
 (40,"My brain pokes me once, with one finger.","The Finger Poke: a test of strength? No, a test of gullibility."),
 (41,"I've saved one move for this.","The Finisher, the Leg Drop: if this hits, go home."),
 (42,"It hits. My brain kicks out.","The False Finish: the art of the near-fall."),
 (43,"Round two is over before I can sit up.","The Squash: total dominance."),
 (44,"By midnight we both lie there, staring at the ceiling.","The Time Limit Draw: no winner, both keep their dignity."),
 (45,"So who decides who wins in my head?","The Booker: the ending is pre-planned. You are just a puppet."),
 (51,"I charge, my brain steps aside, and I meet the radiator.","The Ring Post, unforgiving steel: the hardest object in the building."),
 (49,"My neighbour filmed the whole thing through the window.","The Hard Cam: if the camera didn't see it, it didn't happen."),
 (53,"Then he posted a review.","The Internet Smark, talking about psychology without ever taking a bump."),
 (55,"When the doctor asks what happened, I say nothing.","The Kayfabe Police: keep the secrets secret, or get fired."),
 (56,"So I lose on purpose.","The Retirement Match: rising, and falling. See you next season."),
]
INTRO="Big Bad Brain Wrestling: the physics of fake pain and the economy of real ego."
OUTRO="My brain is back next week anyway. It's still real to me, dammit."
import csv,json
w=csv.writer(open('big_bad_brain_wrestling.t3.triplets.csv','w',newline='')); w.writerow(['line_no','kind','card_number','opener','triplet'])
for i,(n,o,t) in enumerate(L,1): w.writerow([i,'card',n,'',t])
json.dump({'schema':'kfb.triplet-set.opener/1','revision':'t3','bestOf':[n for n,_,_ in L],'intro':INTRO,'outro':OUTRO,
  'lines':[{'cardNumber':n,'opener':o,'triplet':t} for n,o,t in L]},open('big_bad_brain_wrestling.t3.lines.json','w'),indent=1,ensure_ascii=False)
beats=['[Spoken Word]',INTRO]+[(o+' '+t).strip() for n,o,t in L]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'; open('big_bad_brain_wrestling.t3.suno.txt','w').write(txt)
ow=sum(len(o.split()) for _,o,_ in L); cw=sum(len(t.split()) for _,_,t in L)
print('cards',len(L),'chars',len(txt),'card%',round(100*cw/(cw+ow+len(INTRO.split())+len(OUTRO.split())+3)))
