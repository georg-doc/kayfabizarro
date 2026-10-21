T = {
1:"The Needle views your hand. Everything awful that follows begins with their report.",
2:"The Whisper out-vibes the radar. Its young pilot has only been alive a few centuries.",
3:"The Fang: survey the system, establish the Hegemony's claim by shooting the scenery.",
4:"The Arrow: fatalists hauling diplomatic secrets worth more than their lives.",
5:"The Hauler: if they stop arriving, the sector is already dead.",
6:"The Lance farms mid-level management stress before they inevitably get court-martialed.",
7:"The Reaver cannot retreat. Ever. Pure aggression shoved into an undersized hull.",
8:"Commerce Protector: why fire a torpedo when you can delete the enemy's bank account from orbit?",
9:"The Throne, a floating geopolitical argument: too expensive to lose, too massive to hide.",
10:"Warlord-Class: a kill-count so high it constitutes a distinct gravitational anomaly.",
11:"The World, a sovereign community in transit: the ultimate headache for every border guard.",
12:"The Shadow officially doesn't exist. Unofficially, it just overthrew your government.",
13:"The Cradle World, a paradise that everyone wants: an eternal, bloody stalemate.",
14:"The Forge World: dump the working class to breathe heavy metals and build empires.",
15:"The Tomb World: what killed them is probably still down there, waiting for you.",
16:"The Bloom World: a Mycel weapon disguised as agriculture. Inevitable ecology.",
17:"The Void Station: bartenders have better geopolitical intel than four-star admirals.",
18:"The Anomaly World breaks the physics engine. Careers end here; legends begin here.",
19:"Overlapping Claim: peace through mutual bureaucratic exhaustion.",
20:"The Ironworkers' Compact, a labor strike: the only good thing the Hegemony ever did.",
21:"First Contact: civilizational choices with zero precedent. High risk of getting eaten.",
22:"The Retrieval: claim it was yours all along. Legitimate recovery, or state-sponsored piracy.",
23:"The Long Survey returns with severe social anxiety. They make terrible dinner guests.",
24:"The Intervention changes the course of history, off the record, leaving zero receipts.",
25:"The Blockade Run: access is a right that force can deny. Survive on sheer luck.",
26:"Deep Frontier Mission: the charts end here. The win condition is simply coming back alive.",
27:"The Missing Survey Team: their transmissions are the only data we have. We wish we didn't.",
28:"The Classified Briefing: all six powers must agree to reveal it. They won't.",
29:"Stable Transit Point: seven show signs of engineering. The Vael refuse to elaborate.",
30:"Breathing Gate: transit is pure gambling. Its destination is a matter of prayer.",
31:"Event Scar: a cosmic explosion, or something far worse that didn't make the history books.",
32:"The Singing Systems: it's not a song. It's navigational infrastructure. But for who?",
33:"The Drift is not empty. The things inside know you are there. It is larger on the inside.",
34:"The Resonance pulses from something impossibly huge. The Vael have been measuring it.",
35:"Grey Migration: they don't deviate for obstacles. Obstacles deviate for them.",
36:"The Memory Worlds: you remember what didn't happen. The Mycel know why. They are terrified.",
37:"The Fold Drive burns stellarite: the standard cheat code for an agonizingly vast universe.",
38:"Entanglement Network, instant communication: physics monetized to the maximum.",
39:"Biotic Integration: statistically likely to either become a god or explode.",
40:"Sorn Archivist Process: the ultimate biological cheat code, turning your mind into software.",
41:"Prior-Architecture risks total annihilation. Everyone is trying; everyone is terrified.",
42:"Consciousness Transfer, the most contested tech: did you arrive, or just a copy of you?",
43:"Stellar Engineering: use a star as a weapon or a battery. Try not to think about it.",
44:"The Memory Technology: the oldest nodes, digging up memories that predate all civilizations.",
45:"Dreshkai Communion: they own the networks, they set the rates, they own you.",
46:"Ossian Hegemony: every negotiation is a hostage situation.",
47:"The Vael don't need Capital Ships. They are the Capital Ships. They know what's coming.",
48:"The Sorn hoard the galaxy's secrets and pay premium rates for uncertainty reduction.",
49:"The Unbound: access is a right. Dispersed, decentralized, and utterly impossible to govern.",
50:"The Mycel Verdancy: irreversible terraforming, the galaxy's memory running on spores.",
51:"The Prior modified the galactic core, left stable wormholes, and vanished. Or did they?",
52:"The Fruiting Bodies engage in diplomacy while the network eats the soil beneath your feet.",
53:"The Resonance Arrays: designed not just to observe the Resonance, but to interact with it.",
54:"Galactic Core Observatory, the oldest in the galaxy: what exactly was it built to watch for?",
55:"The Vael's Deep Archive: the Sorn couldn't steal it; the Dreshkai couldn't buy it.",
56:"The Thirty-Thousand-Year Note: not updated, because the answer hasn't changed.",
}
INTRO="Kosmik Kayfabizarro Kollektive: the blood, sweat, and gears of cosmic capitalism. Sabotage the Galactic Hegemony."
OUTRO="Read this and you will legally be dead."
import csv,os
D=os.path.dirname(os.path.abspath(__file__)); ID='kosmik_kayfabizarro_sci_fi_space_opera'
N=sorted(T)
w=csv.writer(open(os.path.join(D,ID+'.t1.triplets.csv'),'w',newline=''))
w.writerow(['line_no','kind','card_number','opener','triplet'])
for i,n in enumerate(N,1): w.writerow([i,'card',n,'',T[n]])
beats=['[Spoken Word]',INTRO]+[T[n] for n in N]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'
open(os.path.join(D,ID+'.t1.suno.txt'),'w').write(txt)
L=[len(T[n]) for n in T]
print('cards',len(N),'chars',len(txt),'avg',round(sum(L)/len(L),1),'max',max(L),[(n,len(T[n])) for n in T if len(T[n])>92])
