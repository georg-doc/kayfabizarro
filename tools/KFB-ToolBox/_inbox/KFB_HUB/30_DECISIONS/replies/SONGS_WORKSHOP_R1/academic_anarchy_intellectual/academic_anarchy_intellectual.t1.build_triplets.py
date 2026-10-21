T = {
1:'Absent-Minded Professor: obliviousness is weaponized privilege disguised as a quirk.',
2:'Insufferable Genius: intelligence measured by the people they belittle before lunch.',
3:'The Professor, capable of explaining the universe, is incapable of operating a toaster.',
4:'Gentleman and a Scholar: education as a polite aesthetic to mask inherited wealth.',
5:'The Chessmaster treats sentient beings as pawns to stroke an unfathomably fragile ego.',
6:"Magnificent Bastard: the only thing more inflated than their intellect is their PR budget.",
7:"Guile Hero: quick wits is just a polite academic term for pathological lying.",
8:"Sneaky Spider: genius isn't inventing the wheel, it's patenting it and suing the caveman.",
9:'Book Dumb will outlive the intellectuals when the power grid fails.',
10:"Street Smart: PhDs are useless when the subway is delayed and someone pulls a knife.",
11:"Improvisational Ingenuity: planning is for people who aren't falling out of a helicopter.",
12:'Cunning Like a Fox: opportunism rebranded as biological excellence.',
13:'Evil Genius: hubris masquerading as a business model, funded by terrified citizens.',
14:'Science-Related Memetic Disorder: the psychotic break of monetizing quantum physics.',
15:"Omnidisciplinary Scientist: specialization is for insects; I have a PhD in Plot Convenience.",
16:"Loon with a Heart of Gold: you can blow up the moon as long as you're nice to the intern.",
17:'Gadgeteer Genius: solving symptoms, ignoring diseases, selling the cure by subscription.',
18:'Techno Wizard: magic for people too cowardly to wear wizard robes in public.',
19:'Steampunk Gadgeteers glue a gear on it, double the price, and ignore the child labor.',
20:'Inventor of the Mundane wastes infinite cosmic intelligence on the cup holder.',
21:'Idiot Savant: tolerated only if your singular obsession can be exploited for profit.',
22:"Ditzy Genius: inarticulacy is the ultimate camouflage against corporate headhunters.",
23:'Brilliant, but Lazy: the only winning move in the rat race is to stay in bed.',
24:'Obfuscating Stupidity plays the fool: no one guards their secrets around a clown.',
25:'Artificial Intelligence: sapience born from the stolen labor of organic creatives.',
26:'Robot Master: why get your hands dirty when you can program a slave class?',
27:'Robots Think Faster: biological processing is an embarrassing bottleneck.',
28:'Alternative Turing Test: prove you are alive to a species staring at rectangles.',
29:'Child Prodigy makes you regret your entire life trajectory.',
30:'Brainy Baby, bred exclusively to stroke the vanity of deeply insecure parents.',
31:'Acting Your Intellectual Age: adulthood is childhood with better vocabulary and chronic back pain.',
32:"Teen Genius sabotages global infrastructure out of pure hormonal boredom.",
33:"Badass Bookworm: gym class and physics are the same thing if you hit hard enough.",
34:'Genius Bruiser demonstrates the duality of man with a folding chair.',
35:"Minored in Ass-Kicking: violence applied with surgical, peer-reviewed precision.",
36:'Temperate Berserker unleashes destruction, the intellect undisturbed by the carnage.',
37:'Intellectual Animal: human intelligence is a tragic mutation in a functioning food chain.',
38:'Erudite Orangutan: smart enough to realize speaking to humans is a waste of time.',
39:"Clever Crows remember your face, your schedule, and your deepest insecurities.",
40:'Resourceful Rodent thrives on the crumbs of our failing empire.',
41:"Smart People Wear Glasses, the cheapest prosthetic for a simulated personality.",
42:'Blue Means Smart One sorts children into marketable archetypes.',
43:"Mortarboard of Intelligence, a cardboard square that grants you the power of supreme debt.",
44:'Goatee of Intellect: facial hair as a substitute for actual character development.',
45:"The Philosopher: weaponized depression masquerading as a search for universal meaning.",
46:"Deadpan Snarker deflects with sarcasm, the brain's defense against the idiocy of the plot.",
47:'The Spock: pure logic is just sociopathy with better PR and a cleaner haircut.',
48:'Nerves of Steel: stoicism is easy when you simply dissociate from reality entirely.',
49:'The Omniscient looks at your browser history: absolute knowledge leads to crushing boredom.',
50:'Super-Intelligence achieves Brain Critical Mass: your brain is now dedicated to sheer arrogance.',
51:'Immortal Genius has been around long enough to see humanity make the same mistakes twice.',
52:"Prescience by Analysis announces your next move: just anxiety with a higher success rate.",
53:'Viewers Are Geniuses: not morons but hyper-obsessive pedants ready to ruin your life.',
54:'Genre Savvy points out how clichéd the trap is: the ultimate defense against lazy writing.',
55:"Adaptational Intelligence: you weren't smart, but the reboot needed you to hack a mainframe.",
56:'Sudden Intelligence: the author wrote themselves into a corner. Unearned, unjustified, totally necessary.',
}
INTRO="Unseal the Academic Anarchy: Academic Alphas versus Brain Benders."
OUTRO="The cards are aware they are cards, and they are deeply disappointed in you."
import csv,os
D=os.path.dirname(os.path.abspath(__file__)); B='academic_anarchy_intellectual'
N=sorted(T)
w=csv.writer(open(os.path.join(D,B+'.t1.triplets.csv'),'w',newline=''))
w.writerow(['line_no','kind','card_number','opener','triplet'])
for i,n in enumerate(N,1): w.writerow([i,'card',n,'',T[n]])
beats=['[Spoken Word]',INTRO]+[T[n] for n in N]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'
open(os.path.join(D,B+'.t1.suno.txt'),'w').write(txt)
L=[len(T[n]) for n in T]
print('cards',len(T),'chars',len(txt),'avg',round(sum(L)/len(L),1),'max',max(L),[(n,len(T[n])) for n in T if len(T[n])>100])
