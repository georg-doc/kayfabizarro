# Kartentext = GEDRUCKTE Karte, siehe .t1.print_cards.json (Registry-JSON weicht ab, Karten 37-56 im Druck andere Karten).
T = {
1:"Cartography Sidequest: prove to the machine you have surveyed every inch of your own cage.",
2:"Level Goal: reach the end of the level. Your reward is a slightly harder level.",
3:"The Maze, a cognitive loop: find an exit to the level. Spoilers, there is no outside.",
4:"It's All Upstairs From Here: ascend a tower to fight a guy who could have met you in the lobby.",
5:"Run or Die: go that way and don't stop. The illusion of choice, accelerated.",
6:"Escape Sequence: run away from danger until you reach safety. Safety is a cutscene.",
7:"Rise to the Challenge: climb up until you reach safety. Gravity is now a microtransaction.",
8:"Broken Bridge: you cannot pass until the developers finish coding the next zone.",
9:"Boss Battle, a challenging monster who exists solely to gatekeep your dopamine.",
10:"Kill Enemies to Open: kill all the monsters in an area. You are the janitor of death.",
11:"Mass Monster-Slaughter, the grindset: repetitive labor is fun when it's violent!",
12:"20 Bear Asses: retrieve random drops for an NPC, the pinnacle of heroic fetch quests.",
13:"Gotta Kill Them All, a hitlist: kill everyone on it. A psychopath's grocery run.",
14:"Kill Streak: kill as many as you can without getting hit. Perfect for your anxiety!",
15:"Player Versus Environment, the computer controlling the game: the house always wins.",
16:"Player Versus Player, divide and conquer: keep the plebs fighting each other.",
17:"Escort Mission, a weaker ally in a dangerous area: the ultimate test of your patience.",
18:"Gotta Rescue Them All, a hoarding pathology disguised as altruism.",
19:"Hold the Line: stand in this circle until we say you can leave.",
20:"Save the Princess: rescue someone who's been kidnapped. Again. Try better locks next time.",
21:"Fetch Quest: retrieve plot coupons for an NPC. You are an intern with a sword.",
22:"Chain of Deals, red tape: trade items for items. Bureaucracy as gameplay.",
23:"Product Delivery Ordeal: deliver plot coupons to an NPC. Postmates, but with dragons.",
24:"Plot Coupons open the door: the narrative equivalent of a punch card.",
25:"Gotta Catch Them All, compulsive capture: turning wildlife preservation into a hostage situation.",
26:"Herding Mission: herd animals into an area, because AI pathfinding is a joke we play on you.",
27:"NPC Round-Up Mission, cat herding: gather NPCs together. Wrangling digital toddlers.",
28:"Live Items: stuffing living creatures into your infinite pocket. Don't think about the ethics.",
29:"Companion-Specific Sidequest: earn your ally's favor. Friendship is transactional.",
30:"Loyalty Mission: complete your ally's goal so they don't betray you at the finale.",
31:"Romance Sidequest, simulated love: select dialogue option C to receive affection.",
32:"Cosmetic Award, a shiny hat to validate your hundred hours of meaningless grinding.",
33:"Stock Video Game Puzzle, because the ancient architect loved pushing ice blocks around.",
34:"Mini-Game: play a smaller game with its own rules. Pacing is a myth.",
35:"Variable Player Goals: why save the world when you could be taking photos of frogs?",
36:"Instant-Win Condition, deus ex machina: press X to end the simulation.",
37:"100% Completion, sunk cost fallacy: your digital grave requires all the shiny trinkets.",
38:"Gameplay Grading: play the game as well as possible. The machine judges your worth.",
39:"Secret Ending: collect all hidden rocks to learn the true, disappointing lore.",
40:"Bragging Rights Reward: an achievement that literally nobody else cares about.",
41:"Challenge Run, self-sabotage with optional restrictions, because normal misery wasn't enough.",
42:"Self-Imposed Challenge, blindfolded: Stockholm Syndrome, expert edition.",
43:"No Item Use for You: hoard the mega-elixirs until the credits roll.",
44:"No-Gear Level: a sudden, arbitrary strip search by the developers.",
45:"Speedrun, sequence break: skip the story, break the physics.",
46:"Stealth-Based Mission: an instant fail state for stepping on a twig.",
47:"Timed Mission, a ticking clock: artificial stress for artificial stakes.",
48:"No-Damage Run: one microscopic pixel of a hitbox ruins five hours of work.",
49:"The Cake is a Lie: your real goal is to destroy the facility. The reward was bait.",
50:"Princess in Another Castle, moved goalpost: your reward is a fungal hallucination.",
51:"Collect 12 Logs: goals players become too dependent on, forgetting how to actually play.",
52:"100 Babies: set your own goals. You are the architect of your own hell.",
53:"Scoring Points: watch a digital integer increase. They do nothing, but you feel great.",
54:"Experience Grind: repeat the same action until the bar is full. Welcome to middle management.",
55:"Gold Sink, a mechanic designed purely to delete the wealth you spent hours accumulating.",
56:"Hero Must Survive: game over, flip the table. Good thing you're not the hero.",
}
INTRO="Uncle FrizzleBob's Mission Control Deck: Kayfabe-Kwests, Krazy Kampaigns and Sub-Mission-Wrestling. Down with the system!"
OUTRO="Make games fun again! Free the pixels!"
import csv,os
DECK='frizzlebob_s_mission_control'
os.chdir(os.path.dirname(os.path.abspath(__file__)))
N=len(T)
w=csv.writer(open(DECK+'.t1.triplets.csv','w',newline=''))
w.writerow(['line_no','kind','card_number','opener','triplet'])
for n in range(1,N+1): w.writerow([n,'card',n,'',T[n]])
beats=['[Spoken Word]',INTRO]+[T[n] for n in range(1,N+1)]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'
open(DECK+'.t1.suno.txt','w').write(txt)
L=[len(T[n]) for n in T]
print('chars',len(txt),'avg',round(sum(L)/len(L),1),'max',max(L),[(n,len(T[n])) for n in T if len(T[n])>95])
