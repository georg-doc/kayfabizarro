T = {
1:"The Glossy Horizon, a future so polished you see your own face in it. Sell the reflection.",
2:"The Finished City, already built: no scaffolding, no mud, no maintenance, no Tuesday.",
3:"The Vanishing Present makes today a waiting room with bad chairs, so the future feels like rescue.",
4:"The Signature Line offers the dream; stop looking at the floor and sign. Awe is faster.",
5:"The Cure-All Keynote: one product retires an entire category of human suffering. Ignore the politics.",
6:"The Roadmap to Eden, a straight line from now to paradise. Hide the cliffs behind the font.",
7:"The Moving Launch Date slips one quarter, then another. Belief sustained by never arriving.",
8:"The Pre-Order collects belief up front, delivers the future later, or not at all. Vaporware.",
9:"The Stage Light, everything bright and warm: let the glare do the editing.",
10:"The Hero Demo shows the one path that works flawlessly. Call it the way it works.",
11:"The Standing Ovation makes doubt feel rude, until the clapping becomes the evidence.",
12:"The Afterglow sends them home shining. Wonder is an excellent place to hide a clause.",
13:"The Founder Myth, one author of tomorrow: origin story optional, confidence mandatory.",
14:"The Genius Pass lets brilliance excuse the parts that do not add up yet.",
15:"The Unfalsifiable Mission, advancing humanity: a goal so large no failure can touch it.",
16:"The Disciple Seat: believe loudly, and you belong. Doubt is close to betrayal.",
17:"The Velvet Rope makes scarcity feel like status. The line is the product.",
18:"The Number You Are: defend your place in a queue to nowhere.",
19:"The Referral turns each believer into a recruiter, growth disguised as generosity.",
20:"The Early Access rewards the faithful with a slightly nicer waiting room.",
21:"The Eternal Soon keeps the payoff one horizon away, always visible, never closer.",
22:"The Deferred Self: the better you arrives bundled with the better thing. The present, a defect.",
23:"The Spent Now trades a real Tuesday for an imagined someday, on repeat.",
24:"The Renewed Vow: when someday slips, sell the vow again at full price.",
25:"The Wet Blanket frames every question as a failure of imagination.",
26:"The Luddite Label sorts skeptics into the past tense. They do not get it yet.",
27:"The Lonely Question: asking feels like leaving the room. Most people stay.",
28:"The Convert Bonus welcomes the doubter back warmly. Belief tastes sweeter after surrender.",
29:"The Warm Bath lowers the pulse: optimism as a sedative, dosed in keynotes.",
30:"The California Ideology, rebel optimism and market faith: question either, you question freedom.",
31:"The Numbed Hand, comfort so complete that nobody reaches for the wheel.",
32:"The Sweet Stall keeps them hopeful, seated, and exactly where you left them.",
33:"The Beautiful Mockup presents the picture of the thing as the thing.",
34:"The Prototype Loop shows the same working corner from forty angles. Imply the whole.",
35:"The Missing Receipt skips the part where it survived contact with a real week.",
36:"The Vibes Audit lets the feeling of progress stand in for the measurement of it.",
37:"The Smooth Surface promises a life with no edges, no effort, no callus.",
38:"The Outsourced Limb lets the device do the reaching. Keep the hand on the glass.",
39:"The Forgotten Muscle: what you never lift, you slowly cannot.",
40:"The Comfort Trap sells ease so total it quietly removes the option of effort.",
41:"The Next Version frames every problem as a thing the next release will fix.",
42:"The Trade-In makes replacement feel like growth. Discard the old, including the lesson.",
43:"The Treadmill, movement without arrival, billed monthly.",
44:"The Loyalty Tier rewards staying on the treadmill with a faster treadmill.",
45:"The Mortgaged Now borrows against today to furnish a tomorrow that ships late.",
46:"The Patience Tax charges attention as rent on a building with no keys.",
47:"The Unlived Week: add up the Tuesdays spent in the waiting room.",
48:"The Polite Bill presents the total gently, after the lights are warm and the doubt is gone.",
49:"The Seamless Surface removes every visible seam, so the labor and the trade-offs disappear.",
50:"The Closed Loop leaves no room for a question. If you cannot ask, you are inside the pitch.",
51:"The Single Story offers one path forward and calls it the future.",
52:"The Shine Test: the shinier it is, the harder you should look for the floor.",
53:"The Assumption Stack names every quiet if the promise stands on.",
54:"The Load-Bearing Lie, the one assumption that, if false, drops the whole roof.",
55:"The Beneficiary: who is already paid whether or not tomorrow arrives?",
56:"The Core Question: count the things that have to be true. Notice how many are not.",
}
INTRO="Forget Utopia: step inside the future that is already finished."
OUTRO="Read the small print last. They're counting on that."
import csv,os
DECK='forget_utopia'
os.chdir(os.path.dirname(os.path.abspath(__file__)))
w=csv.writer(open(DECK+'.t1.triplets.csv','w',newline=''))
w.writerow(['line_no','kind','card_number','opener','triplet'])
for n in range(1,57): w.writerow([n,'card',n,'',T[n]])
beats=['[Spoken Word]',INTRO]+[T[n] for n in range(1,57)]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'
open(DECK+'.t1.suno.txt','w').write(txt)
L=[len(T[n]) for n in T]
print('chars',len(txt),'avg',round(sum(L)/len(L),1),'max',max(L),[(n,len(T[n])) for n in T if len(T[n])>95])
