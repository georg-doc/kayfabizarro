T = {
1:"Caesar's Commentarii, third-person gaslighting: a neutral observer of his own continental slaughter.",
2:"Divided into Three Parts, geographic pretext. Just a fancy way of saying conquer all three.",
3:"The One Million Dead, institutional math. Corpses as logistics. Call it pacification.",
4:"Druidic Oral Tradition, unwritten memory. When the Romans burned the groves, they deleted the hard drive.",
5:"The Aedui, Rome's client tribe, learned the hard way that a Roman alliance has limits.",
6:"The Helvetii, a genuine migration Caesar intercepted. The perfect pretext for a war of total conquest.",
7:"The Arverni, the kingmakers, losing top-dog status. Resentment made the pan-Gallic revolt.",
8:"The Aeduan Popular Faction knew the Roman patronage was just an elaborate leash.",
9:"The Belgae, furthest from Mediterranean luxury, the bravest. They fought the Germans for fun.",
10:"The Nervii, camp ambush, nearly ending Caesar's career in an afternoon.",
11:"Ambiorix of the Eburones, fatal trust: avoid a trap, which is the actual trap.",
12:"The Galatians, the Gauls who went East. They fight for whoever pays the most attention.",
13:"Vercingetorix of the Arverni, tragic sacrifice. Marginally better is enough for Rome.",
14:"Brennus, heavy sword on the scales: all asymmetric negotiation in five syllables. Vae Victis.",
15:"Cassivellaunus never locks into combat, refused the Romans the heavy infantry fight they wanted.",
16:"Dumnorix of the Aedui, refusal to cross, killed trying to escape the hostage tour.",
17:"Druid Military Function, divine exemption: the command layer that makes the violence legitimate.",
18:"Diviciacus of the Aedui, theological legitimation: the gods, or the Senate, said so.",
19:"The Head Cult, cedar-oil trophy: the head contains the soul; taking it transfers the enemy's power.",
20:"The Sacred Spring: Rome burned it and built a cathedral on top. But the spring remembers.",
21:"Naked Warrior, zero defense: normal survival mathematics did not apply to them.",
22:"The Carnyx, acoustic terror: the harsh, discordant shriek that activated the Roman fear response.",
23:"The Torque, armor for the soul, a library of honor, and the ultimate trophy for a Roman looter.",
24:"The Chariot: not an archery platform, but the prestige of a drive-by arrival.",
25:"Celtic Longsword, open melee: Romans claimed they bent; archaeologists claim Romans lied.",
26:"The Gaesum gave the naked Gaesatae their name. Big, iron, leaf-shaped, and terrifying.",
27:"The Lancea, farmer's reach: everyone's weapon, carried from his fields to the battlefield and back.",
28:"Celtic Shield, individual block: an honor-based system, not a collective-discipline machine.",
29:"Chainmail: Gauls invented it, Romans wore it, knights get the credit. Historiography is organized theft.",
30:"Celtic Iron Helmet draws all enemy attacks, because it looks absolutely fabulous.",
31:"Scorched Earth: destroy your own grain. The hardest part was convincing the tribes to do it.",
32:"The Helvetian Wagon Laager, a mobile fortress, proving that migrating badgers do not go down easily.",
33:"Battle of the Allia, exposed flank: a whole empire's psychology born in this panic.",
34:"Sack of Rome: not barbarians stumbling into an empty city. They extracted maximum leverage.",
35:"Vae Victis: change the win conditions while you are winning. Woe to the conquered.",
36:"Battle of Telamon, pincer movement: the last expression of the naked warrior charge in Italy.",
37:"Battle of Bibracte: even if you lose the battle, you write the score sheet. Caesar's PR masterpiece.",
38:"The Tenth Legion, flank rescue, just as Caesar was grabbing a shield in the front lines.",
39:"Caesar's Hostage Diplomacy, standard Roman operating procedure: hold their kids, take their land.",
40:"Avaricum, fatal sentimentality: the one town the council refused to burn. Caesar used its grain.",
41:"The Circumvallation, double walls. You can't move, but neither can they.",
42:"The Relief Army, every warrior from across Gaul. If it fails, you lose instantly.",
43:"The Desperate Flank Attack, absolute commitment. Caesar personally rode along the collapsing perimeter.",
44:"The Six-Year Wait: Vercingetorix in a cell, just to parade him. The ultimate political communication.",
45:"The Barrel moved the Roman army; the culture that produced it was reclassified as barbarians.",
46:"Seamless Iron Wheel Rim: Rome rode on Gallic rims.",
47:"Rotary Flour Mill: Caesar destroyed the druids, but he kept the bread-makers.",
48:"Eburones Annihilation, the erasure, written down with bureaucratic indifference.",
49:"Uncle FrizzleBob's Red Pen: the conquest is written in the language of the conqueror. Time to edit.",
50:"The Margin Infestation: if it looks designed or corporate, damage it. The truth lives in the messy margins.",
51:"Analog-First DIY Logic, a pair of scissors and zero respect for institutional boundaries.",
52:"The Spring Remembers: the cathedral was built, but the water still flows beneath it.",
}
INTRO="Wine, Woad and Warrior Chiefs. History is written by the victors. This deck is drawn by a deranged rabbit."
OUTRO="Disrupt the narrative!"
D='woad_and_warriors'
import csv
N=sorted(T)
w=csv.writer(open(f'{D}.t1.triplets.csv','w',newline=''))
w.writerow(['line_no','kind','card_number','opener','triplet'])
for i,n in enumerate(N,1): w.writerow([i,'card',n,'',T[n]])
beats=['[Spoken Word]',INTRO]+[T[n] for n in N]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'
open(f'{D}.t1.suno.txt','w').write(txt)
L=[len(T[n]) for n in N]
print('chars',len(txt),'cards',len(N),'avg',round(sum(L)/len(L),1),'max',max(L),[(n,len(T[n])) for n in N if len(T[n])>100])
print('colons>1',[n for n in N if T[n].count(':')>1])
