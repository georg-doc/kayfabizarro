T = {
1:"The Ninja Ping-Pong plays in your head. The lights are on, but the ninja is home.",
2:"The Presidential Pasta upgrades trash to luxury, then it gets cold.",
3:"The Golden Casing turns debt into heavier, shinier debt. You can no longer fit through doors.",
4:"The Red Ryder hits any target. You'll shoot your eye out, kid, but look cool doing it.",
5:"The Key to the City: crowd cheers, confetti falls, the teacher asks for your homework.",
6:"The Rock Star Shuttle solo: in space, no one can hear you play the wrong chord.",
7:"The Lion King forces all to dance backup: I just can't wait to impose my monarchy on you.",
8:"The Super-Sidekick summons a legendary hero for your chores. They will ignore you.",
9:"The Jazz Dancer, caught cheating, does a jazz hand. You are now innocent.",
10:"The Mighty Bull, steroid dream: double strength, zero IQ. Festively plump with muscle.",
11:"The French Maid swaps social status: they must clean your cards. What am I, your maid?",
12:"The Unstoppable Runner's synth montage: breaking the sound barrier, or just breaking wind?",
13:"The Soap Blindness blinds you to the truth: a tragedy of hygienic proportions.",
14:"The Tiny Infestation shrinks your enemies. Squashing them is now free.",
15:"The Falling Boy fails the rescue. Physics is a cruel mistress, gravity her bouncer.",
16:"The Jailbird, overreaction: you turned off the lights? Life sentence!",
17:"The Disowned Dog takes instructions literally: he said get out, so I am exiled forever.",
18:"The Broken Leg, flashback: woolgathering? No, just remembering the future pain.",
19:"The Sperm Machine, biological horror: you must pay child support for all of them.",
20:"The Uselessness: if rejected, destroy the world. Pride or death. Usually death.",
21:"The Devil Doctor: it's just a check-up. A check-up for your soul.",
22:"The Ghost Town pandemic: if we fail, the rats inherit the earth. The rats look pleased.",
23:"The Crash Landing on the moon: I can see my house from here. Oh wait, freezing to death.",
24:"The Failed Rescue: try to help, make it infinitely worse. Thanks, soldier.",
25:"The Slow-Mo Beach love filter: all enemies look like potential mates. Cannot attack.",
26:"The Cheerleader Snape, revealed: enough to make him smile, enough to scar us.",
27:"The Pretty Boy, instant wedding: a life together in the time it takes to order a latte.",
28:"The Inappropriate Climb prevents a biological reaction. Must. Think. About. Calculus.",
29:"The Naked Neighbor: may I borrow a cup of sugar? And perhaps your dignity?",
30:"The Love Bug, format break: the world is now a romance novel. Run.",
31:"The Secret Admirer: as much as he might wish... nah. She's a robot.",
32:"The Harem summons duplicates of your spouse: they immediately argue.",
33:"The Equestrian Lawyer: remove the part of your brain that imagined this.",
34:"The Dragon Laundry, a domesticated beast: disgruntled does not begin to cover it.",
35:"The Pregnant Army, alternate methods of reproduction: the blood drained from his face.",
36:"The Yuri Goggles in denial: she drove the image out of her mind. It honked as it left.",
37:"The Cake Smash, sweet revenge: I thought you said you were gluten free?",
38:"The Pie Face: the customer is always right. The pie is always sticky.",
39:"The Jungle Mauling, feral mode: this would be solved by biting. Let's try that.",
40:"The Crowbar smiles cheerfully, thinking about what your insides look like.",
41:"The Human Leash treats your owner like a pet. Who's a good boy? You are!",
42:"The Ex-Boss Punching Bag: respect your elders, by punching them in effigy.",
43:"The Deadpan Snarker summons a dead enemy to mock you. He won't shut up.",
44:"The Brick Throw imagines an action hero through a window. Every. Single. Time.",
45:"The Exploding House, total annihilation in your mind: walk away coolly. Beautiful.",
46:"The Jet Fuel Truck, physics fail: fly a vehicle that cannot fly. Crash immediately.",
47:"The Laser Tantrum: if you lose money, attack the bank. Pew pew pew.",
48:"The Sink Dunk: flushed with physics.",
49:"The Hamster Ball, immune to damage: the ultimate barrier. The ultimate smell.",
50:"The Frogger Boss: your job like an arcade game. Get across the street. You are fired.",
51:"The Financial Panther: mishear and summon a monster based on the pun.",
52:"The Bear Ballet, high culture: Swan Lake, but with traffic collisions.",
53:"The Giant Spiders spend city funds on giant monsters. Spiders are cooler.",
54:"The Cheese Dream turns enemies into vermin: they scuttle, they squeak. Feed them cheddar.",
55:"The Cleaning Judo, chore-fu: clean the house with martial arts.",
56:"The Diet Soda Mutant: drink the potion, mutate into a beast. Think it's cool.",
57:"The Writer's Draft, retcon: you are now muscular and winning. Reality is optional.",
58:"The Framing Device, coping mechanism: pretend this all leads somewhere.",
59:"The Voice Over lies about the outcome. She loved it.",
60:"The Fourth Wall, gaslight: insist your version of events is true. That's not what happened.",
}
INTRO="The Brain-Flipper Pack: one hundred percent recycled delusions, now with more anxiety."
OUTRO="I reject your reality and substitute my own."
import csv
N=sorted(T)
w=csv.writer(open('brain_flipper_image_spots.t1.triplets.csv','w',newline=''))
w.writerow(['line_no','kind','card_number','opener','triplet'])
w.writerow([0,'intro','','',INTRO])
for i,n in enumerate(N,1): w.writerow([i,'card',n,'',T[n]])
w.writerow([len(N)+1,'outro','','',OUTRO])
beats=['[Spoken Word]',INTRO]+[T[n] for n in N]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'
open('brain_flipper_image_spots.t1.suno.txt','w').write(txt)
L=[len(T[n]) for n in T]
print('chars',len(txt),'avg',round(sum(L)/len(L),1),'max',max(L),[(n,len(T[n])) for n in T if len(T[n])>90])
