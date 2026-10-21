# Meta-Karten ohne Zeile: 1 (Cover-Karte, Quelle Intro), 57-59 (BLANK), 60 (QR, Quelle Outro)
T = {
2:"Uncle FrizzleBob: no board, no pawns, no manual. A design decision, not laziness. Probably.",
3:"The Intro Ritual: name it, claim it, power it. Not a character sheet, a promise.",
4:"The Golden Rule of Bizarro: permission to be strange, wrong, and surprising on purpose.",
5:"The Boring Stasis: describe a completely mundane, ordinary routine for exactly one minute.",
6:"The Sudden Tilt: a story goes nowhere until the hero gets in trouble. Break the routine.",
7:"The Spontaneous Spark breaks the social conditioning that keeps you nice, safe, and boring.",
8:"The Reincorporation: make them feel you planned this from the beginning. You didn't.",
9:"The Brick-Wall Blocker, safe in the real world, absolutely terrible at games.",
10:"The Waffling Wimp: don't make a choice, nobody can tell you you're wrong. Just play dead.",
11:"The Smug Canceler: I'm going to light a fire! Oh wait, rain. Crisis averted, story ruined.",
12:"The Negative Nancy: no, I won't go to Grandma's. She smells funny.",
13:"The Bureaucratic Bridger: you aren't building a bridge, you're building a cage.",
14:"The Hedging Hedgehog: I'll think about it. Postponing a good idea to protect your ego.",
15:"The Sidetracking Squirrel hijacks the Quest for a coffee break. The audience feels cheated.",
16:"The Looping Lemur: violets, roses, daffodils. A brilliant strategy to avoid anything happening.",
17:"The \"Original\" Ostrich: please don't be clever. Be as boring as you possibly can.",
18:"The Cheap Gagger escapes a vulnerable scene with a terrible pun: oh, what a grave situation!",
19:"The Gossip Goose talks about what already happened, not the conflict right in front of you.",
20:"The Clingy Joiner: I paint in exactly the same style! Congratulations, the story is dead.",
21:"The High-Status Hound may not move his head: I am still, therefore I am in charge.",
22:"The Low-Status Shrew fidgets, giggles, and loses the argument, but wins the audience.",
23:"The Status Swap: the lowest becomes the highest. Reversing it is where the comedy lives.",
24:"The Status Transition, from boss to humiliated: all drama is just a status seesaw.",
25:"The Quest Die, a story compass, not a countdown: push hard or let it breathe.",
26:"The Story-Mode Die: a frame, not a cage. If it creates a contradiction, that is the story.",
27:"The Trust Fall: accept the most absurd offer. They have my back, and I have theirs.",
28:"The Willing Audience: we can make ourselves laugh all day, but the chaos demands a witness.",
29:"Tragic Loss, genuine and irreversible. No jokes. No escapes. Let the tragedy breathe.",
30:"Comic Fault, the gap between intention and catastrophic execution. It's your fault.",
31:"Absurd Normal. The impossible is normal. Don't explain it, don't act surprised.",
32:"Heroic Peak. Commit to the triumph, no matter how stupid the stakes.",
33:"Mystical Surface. The diner coffee is actually the nectar of the underworld.",
34:"Forbidden Line. Make the table uncomfortable. Cross the line. Sell it.",
35:"The Character Switch: kill off your character. A good death scene is a gift to the story.",
36:"Tabula Rasa: a messy ending earned beats a neat ending imported. Then wipe it.",
37:"KayfaBingo! That landed, no explanation needed. If you're laughing, you're playing it right.",
38:"KayfaBongo! Don't say I deal damage, say your empire glitches. Perform, don't calculate.",
39:"KayfaBoggle! Not a criticism, a question. If someone is uncomfortable, boggle it.",
40:"Blödsinn! A rule was broken, the fiction breached. Call them out to protect the Kayfabe.",
41:"Questions Only? Active listening, forced through grammatical sabotage.",
42:"New Choice! The original was boring. Do it again, but weirder.",
43:"Genre Shift: suddenly, a bureaucratic office thriller! Watch framing alter the same story.",
44:"The Blind Line: the ambassador has shipped the bananas. Now make it make sense. Irgendwie.",
45:"Best or Worst of Times: the same scene three times, then ask which version was ehrlicher.",
46:"Space Jump: freeze! Physical pantomime as the ultimate narrative hijack.",
47:"Chain Story, silent gestures: the difference between intent and impact is the punchline.",
48:"The Stage Override: sometimes the bulldozer is the only valid literary device.",
49:"Objection! Not yes-and, but yes-but-actually. Conflict is the only engine.",
50:"Genre Squares: place it on the border. I dare you to mix Realism and Satire.",
51:"Ransom Notes: Deine Worte, nicht meine. To speak freely, you must pay a tax.",
52:"King Kayfabian: most tables won't need this. Yours probably will.",
53:"The Great Moose Hunt: we are hunting a myth, but first, let's complain about the weather.",
54:"The Stolen Meatballs: can I have your meatballs? Do you drink alcohol? Every day.",
55:"The Abdominal Alien: raise the stakes so high the audience can't look away.",
56:"The Wet Spaghetti Meteor: getting hit by a ton of wet pasta is technically a conclusion.",
}
INTRO="The Great Kayfabe Improv Komedy Sketchbook. Print, cut, sabotage reality: a game about playing a game."
OUTRO="Kayfabizarro trusts you. If it's broken, fix it. If it's missing, add it. Destroy this book."
import csv,os
D=os.path.dirname(os.path.abspath(__file__)); ID='kayfabizarro_improv_comedy'
N=sorted(T)
w=csv.writer(open(os.path.join(D,ID+'.t1.triplets.csv'),'w',newline=''))
w.writerow(['line_no','kind','card_number','opener','triplet'])
for i,n in enumerate(N,1): w.writerow([i,'card',n,'',T[n]])
beats=['[Spoken Word]',INTRO]+[T[n] for n in N]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'
open(os.path.join(D,ID+'.t1.suno.txt'),'w').write(txt)
L=[len(T[n]) for n in T]
print('cards',len(N),'chars',len(txt),'avg',round(sum(L)/len(L),1),'max',max(L),[(n,len(T[n])) for n in T if len(T[n])>92])
