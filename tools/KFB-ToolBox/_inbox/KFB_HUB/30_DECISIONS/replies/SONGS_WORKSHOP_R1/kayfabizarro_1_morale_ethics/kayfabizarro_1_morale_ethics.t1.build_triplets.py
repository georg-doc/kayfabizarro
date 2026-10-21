T = {
1:"Anti-Hero does the villain's exact job, just a Complete Monster with a better PR team.",
2:"Complete Monster shields the writers from nuance. Stop thinking, start blindly booing.",
3:"Goody Two-Shoes, weaponized purity so absolute it becomes psychological warfare.",
4:"Knight Templar points at the shiny Good Guy badge: villainy with a righteous paint job.",
5:"Cowardly Lion refuses the job until the last second, then accidentally does the right thing.",
6:"Nominal Hero hijacks the moral high ground. Not because it's right. Personal grift.",
7:"Tautological Templar, on the right side, therefore mathematically incapable of being wrong.",
8:"The Sociopath bypasses all Moral Dilemmas. Empathy is a mechanic for weaker players.",
9:"Purity Personified, no traces of evil: an incredibly boring liability to the team.",
10:"Anti-Villain, a villain who forgot to pack evil, relying entirely on aesthetic brooding.",
11:"The Conscience, weaponized guilt: an un-ignorable, highly annoying moral guideline.",
12:"Embodiment of Vice, not just immoral acts: the merchandising rights for immorality itself.",
13:"Faith-Heel Turn: losing belief in the booking committee transforms you into a top-tier villain.",
14:"Befriending the Enemy: the apex predator wouldn't be so evil if they just had a buddy.",
15:"Category Traitor refuses to stick to the demographic the marketing team assigned you.",
16:"The Atoner farms pity for crimes already enjoyed: the consequences finally caught up.",
17:"Redeeming Replacement, a dead villain's identity with a fresh coat of Good PR on it.",
18:"He Who Fights Monsters fought so hard he accidentally memorized the evil playbook.",
19:"Moral Event Horizon, permanently Unforgivable. Welcome to the Heel roster.",
20:"False Friend claims to be your tag partner, just waiting for the referee to look away.",
21:"Chronic Villainy: the universe literally bends to make your hobbies malicious.",
22:"Chronic Hero Syndrome never abandons somebody in need: the easiest mark in the arena.",
23:"Neutral No Longer finally chooses a side after realizing the audience was falling asleep.",
24:"Sheep in Sheep's Clothing, suspected mastermind, is exactly as boring as he seems.",
25:"Black-and-White Insanity: anyone slightly disagreeing with you is one-dimensionally evil.",
26:"Blue-and-Orange Morality, so bizarre the referee's brain melts trying to score it.",
27:"Balance Between Good and Evil gives the worst villains endless loopholes to return.",
28:"Good Needs Evil: no heel, no merchandising deal. Evil is just job security.",
29:"Evil Running Good: heroic groups, managed by the villains they are trying to punch.",
30:"The Omniscient actually hates you and is booking this match for laughs.",
31:"Grey-and-Gray Insanity: everyone's on the same morally dubious, boring level.",
32:"Protagonist-Centered Morality reclassifies any war crime as a quirky mistake.",
33:"Chaos Is Evil, establishment propaganda: any deviation from script is ultimate villainy.",
34:"Order Is Not Good: the rules make sure you stay in your cubicle.",
35:"Above Good and Evil simply does not care. You just want everyone to know you're smarter.",
36:"Sliding Scale of Idealism versus Cynicism: optimism and pessimism, an eternal grappling match.",
37:"Kick the Dog for instant heat, when the writer is too lazy for character development.",
38:"Shoot the Dog: something horrible for the greater good, but mostly for the drama.",
39:"Caper Rationalization: a perfectly logical, highly detailed reason for blatant theft.",
40:"Buy Them Off cancels any punishment with the ultimate superpower: liquid capital.",
41:"Cold Equation: sacrifice one life to save others, looking incredibly brooding and sad.",
42:"Disproportionate Retribution: apocalyptic vengeance for the most petty slights imaginable.",
43:"Pay Evil Unto Evil: horrific things are totally justified if the victim was a jerk first.",
44:"Dirty Coward: leave everyone to die, save your own butt, and you won't even feel bad.",
45:"Cruel Mercy: a Fate Worse Than Death for your enemy, so you keep your Hero rating.",
46:"Brainwashing for the Greater Good: no free will, perfectly acceptable for a good cause.",
47:"Get Out of Jail Free Card: the villain is too popular with the fanbase to write out.",
48:"Murder Is the Best Solution: negotiations too complicated? Just use the easy way out.",
49:"Karma Houdini gets away scot-free with everything, breaking the cosmic scales.",
50:"Karmic Death: the universe finally remembers its job, and you die of your own wickedness.",
51:"Earn Your Happy Ending: everything works out for you, assuming you survive the trauma.",
52:"No Good Deed Goes Unpunished. The kayfabe is rigged against the pure.",
53:"Screw the Rules, I Have Money! Buy a luxury box outside the morality spectrum.",
54:"Disproportionate Reward: a minor act of kindness throws the entire economy out of balance.",
55:"Karmic Jackpot: the universe pays out for the bare minimum of good deeds.",
56:"Laser-Guided Karma: the writers finally remember you exist and drop the hammer.",
}
INTRO="Beyond the Banalities of Good versus Evil: Monster Morality Wrestling, where changing sides is just changing masks."
OUTRO="The universe keeps score. Badly."
import csv,os
D=os.path.dirname(os.path.abspath(__file__)); ID='kayfabizarro_1_morale_ethics'
w=csv.writer(open(os.path.join(D,ID+'.t1.triplets.csv'),'w',newline=''))
w.writerow(['line_no','kind','card_number','opener','triplet'])
for n in range(1,57): w.writerow([n,'card',n,'',T[n]])
beats=['[Spoken Word]',INTRO]+[T[n] for n in range(1,57)]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'
open(os.path.join(D,ID+'.t1.suno.txt'),'w').write(txt)
L=[len(T[n]) for n in T]
print('chars',len(txt),'avg',round(sum(L)/len(L),1),'max',max(L),[(n,len(T[n])) for n in T if len(T[n])>92])
