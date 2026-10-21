T = {
1:"Uncle FrizzleBob's Kayfabizarro Komik Kult Kards smash through the fourth wall: the truth is scribbled in the margins.",
2:'The Rules of Engagement: cut on the dotted lines, build your deck, trust no authority. A game is just a reality you consent to, so choose carefully.',
3:"The Wimmelbild Warning: if you're only looking at the center, you're missing the punchline.",
4:'Hilfe, ich bin ein Mensch, the ultimate cosmic joke: biologically wired for love in a society built for spreadsheets.',
5:"Charles Darwin knew cooperation wasn't evolution's enemy, but its main engine.",
6:'Lynn Margulis merges two into a single dominant entity: life conquered the globe not by combat, but by cellular fusion.',
7:'Robert Axelrod: even among pure egoists, Tit for Tat cooperation wins the long game.',
8:'Synthesis – The Evolution Matrix resets the baseline to cooperative. The Alpha Male myth is a statistical rounding error.',
9:"Joachim Bauer mirrors another's emotion: mirror neurons mean we literally feel what others feel.",
10:'Matthew Lieberman: social pain is real pain. Rejection activates the same brain regions as physical injury.',
11:'John Cacioppo: chronic loneliness destroys the immune system, a biological hunger signal for connection.',
12:'Synthesis – The Empathy Circuit: we are not thinking machines that feel; we are feeling machines that occasionally think.',
13:"Michael Tomasello: morality isn't trained into us by society. Toddlers help before they can even speak.",
14:'Ernst Fehr: we would rather burn our own resources than let an unfair actor walk away unpunished.',
15:'Frans de Waal triggers reconciliation: empathy, consolation and justice are ancient evolutionary inheritances.',
16:'Synthesis – The Scales of Fairness: true justice is a biological reflex, part nurturing hug, part spiteful rejection of the greedy.',
17:'Adam Smith: the prophet of capitalism actually believed in empathy, a fact history conveniently forgot.',
18:'Gary Becker reduced all human behavior to a cost-benefit analysis and built a perfect model of a sociopath.',
19:'Rutger Bregman challenges any selfish nature assumption. Deep down, humanity is aggressively decent.',
20:"Synthesis – The Egoism Autopsy: we built an entire global economic system for a species that doesn't actually exist.",
21:"C. Daniel Batson: true altruism exists. We don't just help to feel good; genuine empathy compels action.",
22:'Felix Warneken: we are born helpers. Toddlers drop everything to assist a stranger without any promise of a reward.',
23:'Jorge Moll: evolution hardwired generosity to the same pleasure centers as food and sex.',
24:"Synthesis – The Generosity Loop: selflessness isn't a sacrifice, it is the most sophisticated dopamine hack in evolutionary history.",
25:'Edward Deci: paying someone to do what they love kills their passion fastest.',
26:'Dan Ariely: offer a massive reward and you choke under pressure. The rational market is a joke.',
27:'Bruno Frey: putting a price tag on a civic duty destroys the moral desire to do it.',
28:'Synthesis – The Motivation Spectrum strips the reward: carrots and sticks are for donkeys, meaning and autonomy are for living beings.',
29:"Shoshana Zuboff: surveillance capitalism doesn't want your money. It wants to mine your behavior and sell it.",
30:'Jean M. Twenge: the invisible umbilical cord to our screens is silently mass-producing loneliness and anxiety.',
31:'Byung-Chul Han: we are no longer exploited by cruel masters; we are the cheerful architects of our own burnout.',
32:'Synthesis – The Surveillance Cage: the modern world is a Skinner box, and we pay a monthly subscription to stay inside.',
33:'Carol Dweck: the belief that you are unfinished is infinitely more powerful than the belief that you are gifted.',
34:'Robert Rosenthal: declare a positive expectation, and if they believe it, it literally alters their reality.',
35:'Martin Seligman: helplessness can be learned, but so can optimism. Hope is a muscle that must be violently exercised.',
36:"Synthesis – The Reality Redraw: mindfulness isn't meditation, it is the reality-bending power of simply paying attention.",
}
INTRO=T.pop(4)
OUTRO="Reality is highly negotiable if you know how to redraw the lines."
import csv,os
D=os.path.dirname(os.path.abspath(__file__)); B='the_biology_of_rebellion_hilfe_ich_bin_ein_mensc'
for k in (1,2,3): T.pop(k)  # Meta-Karten (Deck-, Regel-, Wimmelbild-Karte), Georg-Review 21.10.
N=sorted(T)
w=csv.writer(open(os.path.join(D,B+'.t1.triplets.csv'),'w',newline=''))
w.writerow(['line_no','kind','card_number','opener','triplet'])
for i,n in enumerate(N,1): w.writerow([i,'card',n,'',T[n]])
beats=['[Spoken Word]',INTRO]+[T[n] for n in N]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'
open(os.path.join(D,B+'.t1.suno.txt'),'w').write(txt)
L=[len(T[n]) for n in T]
print('cards',len(T),'chars',len(txt),'avg',round(sum(L)/len(L),1),'max',max(L),[(n,len(T[n])) for n in T if len(T[n])>140])
