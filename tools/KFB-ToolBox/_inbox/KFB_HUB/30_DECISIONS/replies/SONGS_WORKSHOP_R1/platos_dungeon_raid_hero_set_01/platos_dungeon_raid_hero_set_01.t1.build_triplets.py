T = {
1:"The Foreclosed. The crown takes the field, and the field remembers.",
2:"The Pitchfork-Sworn. Every revolt starts with a tool that was always a weapon.",
3:"Of the Borrowed Torch. They paved a holiness over and called it progress.",
4:"The Rebel Rouser. A man with a field becomes a man with a mob, and neither was the goal.",
5:"The Cheap Blade, honest in a way a blade for principle is not.",
6:"The Reputation raises the rates, pays better than a sword and shows up faster.",
7:"Of the Four Contracts. Nobody knows. Loyalty is for the man who can afford it.",
8:"The Last Talker wins every job and loses every name that called him something else.",
9:"The First Bellows works, a promise the workshop has not yet broken.",
10:"The Second Bellows explodes. Scale is the workshop's enemy and its only honest tutor.",
11:"Of the Self-Explaining Engine. Exploding, it explained more than most teachers.",
12:"The Explosion Herself. The party loves you and fears you; no use for warnings anymore.",
13:"The Tracker. A path is a story, and the hunter is its first reader.",
14:"The Patient Aim waits. Patience is a kind of speed nobody has yet measured.",
15:"The Tracker of People tracks the one who asked not to be tracked.",
16:"The One Who Shot the Deer finds what she hunted, and what she hunted for.",
17:"The Tavern Champion. Strength remembered loud is strength remembered last.",
18:"The Tournament Winner, rumored fixed. A win is a win until someone counts the coins.",
19:"Of the Useful Rumor. A name that does its own work has stopped belonging to you.",
20:"The Second Weapon. A reputation outlives its body. Sometimes too long.",
21:"The Young Rage charges first, hits hardest. The dwarf's first prayer and last excuse.",
22:"The Decorated Veteran. The medal is heavier than the comrade it replaced.",
23:"Of the Unstopping Hammer. The peace between the wars is the harder war.",
24:"The Wrong Joke. A joke about a beard is the cheapest way to die in this country.",
25:"The Herbalist's salve works, a small good that does not need a bigger story.",
26:"The Salve-Mistress. A healer's hands learn before her heart catches up.",
27:"Of the Mercy That Spreads. You heal the wounded monster; the party will not understand.",
28:"The Resurrectionist. To save everyone is to save no one in the order they hoped.",
29:"The Apprentice of Frames. The first trick is recognising that everything is a trick.",
30:"The Stagecrafter bends what the room agrees to see. Most contracts are stages.",
31:"Of the Recognised Match. The match has been fixed since before the start.",
32:"The Card-Replacer. The trick was never the trick; the deck was the trick.",
33:"The Corpse-Looter takes what others called body and calls it parts.",
34:"The First Homunculus. Every parent says hello before realising what they have done.",
35:"Of the Walking Letter. A creation that writes is a creation that has noticed you.",
36:"The Father of the Friendly Army. The army was the only company that stayed.",
37:"The Keynote Barbie gets the room laughing before the trouble walks in.",
38:"The Festival Circuit. A song that catches has caught more than the singer.",
39:"Of the Quiet Suspicion. A lyric that flatters power was written by someone power flattered first.",
40:"The Lore-Keeper. A continent is what its songs let it remember about itself.",
41:"The Sworn takes the oath, believes every word, a hand the institution has not yet bent.",
42:"The Decorated. A righteous victory teaches the institution it cannot lose.",
43:"Of the Quiet Doubt. You receive the new edict and do not yet ask who wrote it.",
44:"The Captain of the Guard is loyal to the throne. The throne changes occupants.",
45:"The Bitter Reformer preaches against the dragon. The dragon does not yet hear you.",
46:"The Pamphleeteer. A heresy in print is a heresy that has hired its own messengers.",
47:"Of the Krooked Krypt. A new currency is an old faith that found new believers to charge.",
48:"The Dragon's Fear. The dragon's mirror is the reformer.",
49:"King Kayfabian VI, the New-Crowned, takes the throne and believes the throne takes him.",
50:"King Kayfabian VII, the First Edict. The throne is a chair others sat in first.",
51:"King Kayfabian VIII, the Replaced, within the hour.",
52:"King Kayfabian IX, the Position. The throne sits whoever.",
53:"The Sunday Drafter drafts the module and believes the module is the campaign.",
54:"The Player-Reader thinks he can prepare for what the players will do.",
55:"Of the Broken Module, at midnight. A campaign is the breaking; the module was the misunderstanding.",
56:"The Alchemist-DM, at dawn, sets the table. The players arrive. You do not pretend.",
}
INTRO="Plato's Dungeon Raid: Bring Your Own Legend. Levels are stages, not stats."
OUTRO="The campaign was never separate from the world."
D='platos_dungeon_raid_hero_set_01'
import csv
N=sorted(T)
w=csv.writer(open(f'{D}.t1.triplets.csv','w',newline=''))
w.writerow(['line_no','kind','card_number','opener','triplet'])
for i,n in enumerate(N,1): w.writerow([i,'card',n,'',T[n]])
beats=['[Spoken Word]',INTRO]+[T[n] for n in N]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'
open(f'{D}.t1.suno.txt','w').write(txt)
L=[len(T[n]) for n in N]
print('chars',len(txt),'cards',len(N),'avg',round(sum(L)/len(L),1),'max',max(L),[(n,len(T[n])) for n in N if len(T[n])>95])
print('colons>1',[n for n in N if T[n].count(':')>1])
