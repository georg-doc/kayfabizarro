# BBBW t4 (Georg 23.10.): Stand-up-Opener, die den Karteninhalt einbetten (ein Satz, keine Nebenhandlung).
# Verbindung über Uptake (aufgegriffenes Wort), Haltungen wechseln, kein Opener doppelt. Best-of.
# pre/post = Erzählschicht; trip = nur Kartenwörter (triplet_set_check). Nummern nach Druck @52adc8f1.
L = [
 (1,"Ever notice how","The Babyface uses high-flying moves because audiences cheer for that? A slave to approval.",""),
 (2,"Approval? Not for","The Heel: bear hugs and eye pokes. If they aren't booing, you aren't doing your job.",""),
 (3,"And","The Tweener? You don't ask for it, which makes them want you more.",""),
 (4,"Rumor has it","The Jobber exists to make the other guy look good. Only control: who defeats you.",""),
 (5,"Who defeats you? Usually","The Immovable Object: slow, but strong enough to hurl you like a ragdoll.",""),
 (6,"Unless you're","The Aerial Ace: agile and fast. If you stand still, you die.",""),
 (7,"Never tell a gorilla that, or you get","The Powerhouse Botch, leaping off the top rope: a tragedy waiting to happen.",""),
 (8,"Don't laugh at","The Little Giant: smaller wrestlers, surprising strength.",""),
 (9,"I once met","The Master Seller: reel back, limp to the ring, make them believe.","I believed."),
 (10,"Believing is optional for","The No-Sell Monster: sit right back up just to prove how dangerous you are.",""),
 (11,"The opposite is","The Oversell Clown, reacting to an attack far beyond reality. See: Michaels and Hogan.",""),
 (13,"Somewhere in between lives","The Thigh Slap: the move didn't hurt, but it sounds like it did. An audio lie.",""),
 (14,"Its cousin,","The Stomp Punch: stomping on the mat when punching. Kinetic misdirection.",""),
 (16,"Honest pain? That's","The Chop Fest: nothing but chop, until one quits. A test of endurance.",""),
 (17,"Did you know","The Sacred Mask is the single biggest identifier? Never remove it.",""),
 (18,"Which is exactly why","The Rudo Ripper attempts to maim the mask: instant disqualification, but you win the feud.",""),
 (21,"My favourite philosopher is","The Juice Lover: you can't hurt me if I hurt me first.",""),
 (22,"Never open","The Snake Bag: the bag has a live snake. Terrify them before the match starts.",""),
 (23,"Or do what","The Lazy Genius does: hands in pockets, it looks like a chore. The apathy makes them furious.",""),
 (24,"Furious people are easy prey for","The Exotic, harming the opponent's dignity rather than their body.",""),
 (25,"Lost your dignity? Wait for","The Hot Tag: fresh partner for payback, the explosive release of tension.",""),
 (26,"Until then you play","The Victim, the Ricky Morton role: isolated and picked apart. You are the bait.",""),
 (27,"Bait for whom?","The Wolfpack: brawler, flyer, powerhouse. Triple attack on an isolated target.",""),
 (28,"Whispering at ringside,","The Savant Manager: you know the moves better than they do.",""),
 (29,"My uncle is","The Pop Hunter: if they want a heel, give them a heel. If they want a clown, honk your nose.",""),
 (30,"Problem is, nobody came.","The Empty Arena, pausing for a pop that never comes: silence amplifies the sound of impacts.",""),
 (31,"Which is why somebody invented","The Green Screen Crowd: pipe in noise, audio sweetening on a lie.",""),
 (32,"And the guy in the front row?","The Plant: I'm just a fan! Gambling on the outcome while part of the show.",""),
 (33,"There's always one who won't play along:","The Shooter forces opponent to sell. If they refuse, real damage.",""),
 (34,"His opposite?","The Sandbag, refusing to cooperate. Dead weight. Extremely unprofessional.",""),
 (35,"Guess what the crowd loves most?","The Real Injury, unplanned. The crowd goes nuts because it's real.",""),
 (39,"Somebody please calm down","The Trash Talker, shouting at Michael Cole: hilarious and entertaining abuse.",""),
 (40,"What if","The Finger Poke was a test of strength? No, a test of gullibility.",""),
 (41,"Fall for it, and here comes","The Finisher, the Leg Drop: the most important moment. If this hits, go home.",""),
 (42,"Unless it doesn't:","The False Finish, the art of the near-fall. Crowd excitement doubles.",""),
 (44,"An hour later,","The Time Limit Draw: no winner, both players keep their dignity.",""),
 (45,"I wonder whether","The Booker decides the winner before the game starts: the ending is pre-planned. You are just a puppet.",""),
 (46,"Not quite, says","The Spot Caller: a basic outline, filled in with sweat.",""),
 (47,"Too much planning gives you","The Rehearsal: perfect, but lacks soul. Hogan and Warrior.",""),
 (49,"And remember","The Hard Cam: if the camera didn't see it, it didn't happen.",""),
 (52,"Which explains","The Announcer's Table: shouting at Michael Cole while destroying his desk.",""),
 (53,"Meanwhile, in the comments,","The Internet Smark, talking about psychology without ever taking a bump.",""),
 (54,"His favourite target:","The Botched Spot, an incoherent collection of moves. It just looks messy.",""),
 (55,"That's when you call","The Kayfabe Police: keep the secrets secret, or get fired.",""),
 (56,"And when it all gets too much, there's","The Retirement Match: rising, and falling. See you next season.",""),
]
INTRO="Big Bad Brain Wrestling: the physics of fake pain and the economy of real ego."
OUTRO="It's still real to me, dammit!"
import csv,json
w=csv.writer(open('big_bad_brain_wrestling.t4.triplets.csv','w',newline='')); w.writerow(['line_no','kind','card_number','opener','triplet'])
for i,(n,a,t,b) in enumerate(L,1): w.writerow([i,'card',n,'',t])
json.dump({'schema':'kfb.triplet-set.opener/1','revision':'t4','bestOf':[x[0] for x in L],'intro':INTRO,'outro':OUTRO,
  'lines':[{'cardNumber':n,'pre':a,'triplet':t,'post':b} for n,a,t,b in L]},open('big_bad_brain_wrestling.t4.lines.json','w'),indent=1,ensure_ascii=False)
beats=['[Spoken Word]',INTRO]+[' '.join(x for x in (a,t,b) if x) for n,a,t,b in L]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'; open('big_bad_brain_wrestling.t4.suno.txt','w').write(txt)
ow=sum(len((a+' '+b).split()) for _,a,_,b in L)+len(INTRO.split())+len(OUTRO.split())+3; cw=sum(len(t.split()) for _,_,t,_ in L)
ops=[a for _,a,_,_ in L]; print('cards',len(L),'chars',len(txt),'card%',round(100*cw/(cw+ow)),'dup openers',[o for o in set(ops) if ops.count(o)>1])
