# Kartennummern = Position im DRUCK (48 Karten, S. 2-13), siehe .t1.print_cards.json; Registry-Nummern 37-56 gibt es im Druck nicht.
T = {
1:"The Pond-Gazing Peacock, mirror lock: I'd help you, but I'm busy existing as a visual masterpiece.",
2:"The Flexing Rooster, intimidating decor: no one spits like me. I am nature's special effect.",
3:"The Portrait Poodle, Dorian's pact: the painting ages so I don't have to. Don't look in the attic.",
4:"The Selfie-Stick Swan ignores reality: if I didn't post it, did the forest really burn down? Doubtful.",
5:"The Fog-Weaving Cuttlefish rewrites history: I never said that. And if I did, you made me say it.",
6:"The Mockingbird, tone policing: you're crazy. You're imagining things. You're just like your mother.",
7:"The Lure-Light Anglerfish offers a gift, then swallows you whole. Mother knows best. Stay in the dark.",
8:"The Revisionist Owl: we have always been at war with Eastasia, and I have always been the victim.",
9:"The Caped Eagle: if adoration drops, laser eye the board. You guys are the real heroes. I'm just a god.",
10:"The Plagiarist Magpie claims invention. Fame is fickle, Harry, but stolen shiny objects are forever.",
11:"The Smile-Bot Dolphin: cry one tear on camera. I just want to be loved. Is that a crime? Yes, it is murder.",
12:"The Medal-Heavy General, stolen valor: I won battles I wasn't even present for. That is leadership.",
13:"The Legacy Lion discards a child: a lion does not concern himself with the opinions of the sheep he sired.",
14:"The Smothering Kangaroo, infantilize: you'll never leave me. You're too weak. I made sure of it.",
15:"The Wire-Hanger Persian: no wire hangers! I gave you life, and this is how you repay me? With dirt?",
16:"The Golden Child Ant, triangulation: why can't you be more like your brother? He sparkles.",
17:"The Business Wolf stuns with superior card stock. Look at that subtle off-white coloring. It's beautiful.",
18:"The Tech-Bro Ferret, disrupt: move fast and break things. Mostly people. People are things.",
19:"The Micromanager Queen freezes productivity: maximize synergy by asking me before you breathe.",
20:"The Brand-Ambassador Cheetah hollows out the soul: not a pyramid scheme, a trapezoid of opportunity!",
21:"The Tantrum Hippo smashes the table. I ordered the tea iced! Iced! The jungle is ruined!",
22:"The Thin-Skinned Balloon Fish: are you saying I'm puffy? You're dead. You're all dead.",
23:"The Spiteful Wasp, petty vengeance: I don't want the honey. I just want the flower to suffer.",
24:"The Scream-Pillar silences all logic: AAAAAAHHHHHHHHH! Pay attention to me!",
25:"The Gauntlet Gorilla, perfectly balanced: the only one with the will to act. Also, I want a banana.",
26:"The Note-Writing Rat writes a name: deleted. I will become the God of the new sewer.",
27:"The Sun-King Scarab: bow or be blinded. Without me, the day does not start. Worship the sphere!",
28:"The Clockwork Kraken turns organic into rigid metal. Nature is messy. I have fixed it. You're welcome.",
29:"The Flying Monkey, proxy war: the boss is actually really nice once you get to know him!",
30:"The Doormat Turtle absorbs abuse: if I just stay quiet, maybe he won't yell today.",
31:"The Yes-Parrot, echo chamber: brilliant, sir! Genius, sir! You're so right, sir!",
32:"The Energy Vampire Bat drains every player: I don't drink blood. I drink your will to live.",
33:"The Magic Mirror, a validation loop: you are the fairest. Everyone else is trash.",
34:"The Pedestal: instant death if you fall. It's lonely at the top, but the view of you ants is great.",
35:"The Black Hole Smartphone paralyzes with envy. Feed me attention. I am starving in 4K resolution.",
36:"The Crown of Thorns, immunity by claiming persecution: look how much I suffer for you! Look at it!",
37:"The Cross-Bearing Donkey, guilt trip: no, go have fun. I'll just stay here and rot. Alone.",
38:"The Bandaged Leech, medical mystery: I would apologize, but my condition is flaring up.",
39:"The Grudging Camel, the last straw: I forgive. But I never, ever, ever forget.",
40:"The Emo-Goth Raven, main character: the music swells. My darkness is too deep for you to understand.",
41:"The Naked Mole Rat King, delusion: is it a draft, or just the chill of pure excellence?",
42:"The Shattered Visage, King of Kings: look on my works, ye Mighty. Name implies heavy depreciation.",
43:"The Bottomless Pit, insatiable: discard your hand, it is not enough. More. More. Fill the hole.",
44:"The Ghost of Future Past, immune to the present: I used to be somebody. I used to be big.",
45:"Uncle FrizzleBob cuts your card in half: rules are for people who don't have scissors.",
46:"The Grey Rock bores to death: the narcissist loses interest and wanders off. I am boring. Go away.",
47:"The Truth Bomb cancels gaslighting: No. A complete sentence.",
48:"The Exit Door, no contact: leave the game. You win by not playing, the only winning move.",
}
INTRO="It's All About Me! And also FrizzleBob. Warning: may cause gaslighting, triangulation, and paper cuts."
OUTRO="If you see yourself in these cards, seek help. If you see your ex, seek a lawyer."
import csv,os
DECK='frizzlebob_s_ego_mania_narcissist'
os.chdir(os.path.dirname(os.path.abspath(__file__)))
N=len(T)
w=csv.writer(open(DECK+'.t1.triplets.csv','w',newline=''))
w.writerow(['line_no','kind','card_number','opener','triplet'])
for n in range(1,N+1): w.writerow([n,'card',n,'',T[n]])
beats=['[Spoken Word]',INTRO]+[T[n] for n in range(1,N+1)]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'
open(DECK+'.t1.suno.txt','w').write(txt)
L=[len(T[n]) for n in T]
print('chars',len(txt),'avg',round(sum(L)/len(L),1),'max',max(L),[(n,len(T[n])) for n in T if len(T[n])>100])
