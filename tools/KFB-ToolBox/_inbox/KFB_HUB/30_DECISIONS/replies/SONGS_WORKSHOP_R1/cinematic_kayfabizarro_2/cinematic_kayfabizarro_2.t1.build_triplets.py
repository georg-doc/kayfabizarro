T = {
1:"The Decennial Oracle dictates global taste every decade: your favorite movie is trash.",
2:"The Director's Cut steals all credit. Any criticism? It's about the process.",
3:"The Herd Consensus: the masses demand the myth they have already purchased.",
4:"The Regional Bias: every nation has a proven greatest film no one outside has ever seen.",
5:"Citizen Sled-Dog: a movie about a newspaper tycoon is the peak of human art.",
6:"Spiral Pigeon dethroned the Kane dog: a film about obsession, the new objective truth.",
7:"Potato-Peeling Poodle: three hours of kitchen chores to obliterate capitalist entertainment.",
8:"Bicycle-Thief Fox: true cinematic power comes from making the audience feel terrible.",
9:"Monolith Macaque: a slow-moving, dialogue-free void is the pinnacle of the moving image.",
10:"Tokyo Turtle Story: perfection is placing a camera two feet off the floor and not moving it.",
11:"Seven Macaques: sacrifice your own to protect a village of ungrateful peasants.",
12:"Eight and a Half Octo-Auteur: directors love nothing more than a film about how hard it is to be a director.",
13:"Wind-Blown Pig, historical amnesia: the American myth, immune to critical re-evaluation.",
14:"Mafia Pug: forfeit your hand, or wake up with your favorite card destroyed.",
15:"Galactic Penguin extracts currency every time you feel a shred of childhood nostalgia.",
16:"Sinking Hippo: weeping uncontrollably over entirely avoidable tragedies.",
17:"Possessed Chihuahua: Catholic guilt, the most effective mechanism for cinematic terror.",
18:"Hard-Dying Hound: an everyman can defeat European terrorists with no shoes on. Yippee-ki-yay.",
19:"Hot Saxophone Hyena nullifies any penalty by declaring nobody's perfect.",
20:"Wooden Woodpecker tells a lie that looks beautiful: extracting soul from graphite and ink.",
21:"Rules of the Game Rooster: high society destroyed by a misunderstanding over an affair.",
22:"Nosferatu Bat: an illegal rip-off of Dracula that survived by sheer visual trauma.",
23:"Potemkin Pelican: inventing modern editing just to legitimize a state revolution.",
24:"Camera-Eye Chameleon: a radical assault on the very concept of fictional acting.",
25:"Stagecoach Stallion: your own heroic, highly sanitized national origin myth.",
26:"Replicant Raccoon: scientists agreed, corporate dystopian depression is our most likely future.",
27:"Brokeback Bovine: all combat resolved through repressed longing.",
28:"Shawshank Seagull: patience and a rock hammer will conquer all systemic injustice.",
29:"Pather Panchali Tiger forced the West to admit cinema existed outside their bubble.",
30:"Spring Town Panda: no attack, only sigh deeply and reflect on broken marriages.",
31:"Housemaid Cat poisons you slowly from the inside while cleaning your house.",
32:"Hong Kong Action Dragon: true brotherhood requires shooting people in slow-mo.",
33:"Underdevelopment Iguana observes the game losing without ever taking responsibility.",
34:"Red Light Armadillo: trash becomes gold, a middle finger to polished cinema aesthetics.",
35:"Prisoner Llama: exploitation backlash, exposing the extraction of indigenous labor.",
36:"Pancho Villa Vulture: everyone is revealed to be a flawed, violent opportunist.",
37:"Hanging Rock Kangaroo leaves abruptly: the continent simply eats people.",
38:"Once Were Wombats: a brutal shattering of the hobbit-filled New Zealand tourism myth.",
39:"Third Man Bulldog: Orson Welles steals a movie with a monologue about the Swiss.",
40:"Holy Grail Parrot, flesh wound: refuses to be removed even when completely destroyed.",
41:"Marketa Lazarova Lynx: three hours of non-linear narrative until you forfeit out of exhaustion.",
42:"Teddy Bear Boar: fill out a form in triplicate. Failure, immediate arrest.",
43:"Round-Up Wolf, psychological enclosure: until you have absolutely nowhere to move.",
44:"Come and See Bear mutes all sound: permanent damage to whoever looks too long.",
45:"Iranian Deer: a social critique that accidentally predicted and fueled an actual revolution.",
46:"Night Counting Camel steals artifacts from the graveyard for short-term survival.",
47:"Halfon Hill Sloth ignores all combat: comedic incompetence and avoiding authority.",
48:"Dry Summer Tortoise controls the water: controlling the water means controlling the myth.",
49:"Phantom Carriage Reindeer threatens the audience with the Grim Reaper's Uber service.",
50:"Unknown Moose refuses to die, surviving purely out of stubborn, frozen spite.",
51:"Nature Puffin escapes the rules to merge with the mythological landscape.",
52:"Flickering Walrus accidentally blows up its own resources, to the audience's delight.",
53:"The Ballot Box Badger wins by skewed demographics and self-selection. See? Bias!",
54:"The Retrospective Rat: what was brilliant is boring. A mirror reflecting the electorate.",
55:"The Genre Pigeonhole: critics refuse to let aliens, ghosts, or laughter sit at the adult table.",
56:"The Wikipedia Weasel compiles subjective art into a definitive, bloodless spreadsheet.",
}
INTRO="Cinematic Legacy and Motion Picture Kayfabe: one hundred percent objective truth, as voted by elitist owls and a million confused sheep."
OUTRO="This whole slide is a lie!"
import csv
N=sorted(T)
w=csv.writer(open('cinematic_kayfabizarro_2.t1.triplets.csv','w',newline=''))
w.writerow(['line_no','kind','card_number','opener','triplet'])
w.writerow([0,'intro','','',INTRO])
for i,n in enumerate(N,1): w.writerow([i,'card',n,'',T[n]])
w.writerow([len(N)+1,'outro','','',OUTRO])
beats=['[Spoken Word]',INTRO]+[T[n] for n in N]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'
open('cinematic_kayfabizarro_2.t1.suno.txt','w').write(txt)
L=[len(T[n]) for n in T]
print('chars',len(txt),'avg',round(sum(L)/len(L),1),'max',max(L),[(n,len(T[n])) for n in T if len(T[n])>90])
