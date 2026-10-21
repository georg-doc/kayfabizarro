T = {
1:"The Spoon Bender failed to draw a bunny. Millions spent on parlor tricks.",
2:"The Stargate Viewer: deemed successful by bureaucrats terrified of Soviet mind-wizards.",
3:"The Scientologist Artist claimed to see Jupiter, mostly saw his own ego.",
4:"Project Grill Flame, intelligence so unbelievable agents required eight martinis.",
5:"Dr. Vulture's Cabinet, to destroy the human ego. The result was lawsuits and bad trips.",
6:"Operation Midnight Climax: a CIA brothel to watch people on acid. Fun, fun, fun.",
7:"The Tennis Player went in for depression. Fatal MDA. The government covered it up.",
8:"The Long Fall: spiked by his boss. Suicide, they said. We have the receipt.",
9:"The Gateway Process: reality is a hologram, and you can escape it with this tape.",
10:"The Psychic Driver erased the mind to rebuild it, only succeeded in the erasing part.",
11:"The Barney Torture: I Love You at ear-splitting volume. Interrogation via nursery rhyme.",
12:"The Truth Serum: no truth serum. Just drugs that make you ramble about your mother.",
13:"Acoustic Kitty: a microphone in a cat, hit by a taxi. Peak efficiency.",
14:"The Pigeon Cam, the only spy that works for breadcrumbs. More reliable than the CIA.",
15:"The Aniseed Dog: MI6 thought aniseed irresistible. The dogs preferred the actual spy.",
16:"The Glow Fox, painted to look like spirits. The foxes just licked the paint off.",
17:"The Heart Attack Gun, untraceable. The perfect crime, brought to you by tax dollars.",
18:"The Lipstick Pistol: touch up your lips and blow someone's brains out simultaneously.",
19:"The Poison Toothpaste: the agent threw it in the Congo River. Even spies have limits.",
20:"The Exploding Seashell, painted to attract Castro while diving. Never planted.",
21:"The Jack-in-the-Box, a CIA sex doll to fool KGB tails. Don't ask what else it does.",
22:"The Semen Ink made great invisible ink. The smell, however, was a dead giveaway.",
23:"The Cupcake Bomb replaced bomb recipes with Ellen DeGeneres' cupcake instructions.",
24:"The Weather Machine: weaponized rain on the Ho Chi Minh trail. Now a war crime!",
25:"The Beard Duster: not to kill him, but to make his hair fall out and destroy his machismo.",
26:"The Poison Milkshake, the closest they ever got. The pill froze to the freezer.",
27:"The Femme Fatale: the pills dissolved. Castro handed her his gun. She couldn't shoot.",
28:"The LSD Radio: spray the booth with LSD so he rambles like a maniac on live air.",
29:"The Vampire Psy-Op drained the blood of rebels to simulate vampire attacks. It worked.",
30:"The Pizza Code: Hezbollah figured it out. They never ordered takeout again.",
31:"The Viagra Diplomat bribed warlords with Viagra. Information flowed immediately.",
32:"The Demonic Toy, to scare kids away from Al-Qaeda, became a collector's item.",
33:"Operation Northwoods: bomb Miami and blame Cuba. Kennedy said no.",
34:"The Iran Coup, Operation Ajax, overthrew a redacted because of oil. The bill came due.",
35:"The Australian Dismissal: the Queen's rep fired the PM. God Save the Queen, indeed.",
36:"The Suicide Memo: the FBI urged MLK to kill himself. Signed, A Friend.",
37:"Хилл 611, a silent red ball crashed. Someone came back to clean it up.",
38:"Воронежские гиганты landed in a park. Kids drew them. Adults were too scared.",
39:"Медуза, a giant jellyfish, rained light on the city. The Kremlin shrugged.",
40:"Ядерный переопределитель: a UFO over a silo, and the nukes activated themselves.",
41:"Roswell 1947: a saucer, then a weather balloon. The rancher said sticks and tape.",
42:"The Tic-Tac: no wings, no exhaust. We don't know what it is.",
43:"Skinwalker Ranch: invincible wolves, and the DIA spent millions to study a haunted ranch.",
44:"The Goblins fought a family all night. Police found bullet holes, but no bodies.",
45:"The Hot Dog Stand, a secret bunker, they thought. It was a lunch counter.",
46:"Thug Shaker Central: Pentagon war plans leaked on Discord to impress his teen friends.",
47:"The Schumer Amendment, to reveal the aliens. Contractors said no. Democracy in action.",
48:"The Oxcart, planes so fast they melted their own paint. Most UFOs were just us.",
49:"The Walrus: Nixon wanted him deported; the FBI even noted his parrot, Linda.",
50:"The Blonde, sleeping with communists and Kennedys. The file is still redacted.",
51:"The Tramp: MI5 blocked his return. Premature Anti-Fascist, too woke.",
52:"The Chairman offered to be a CIA courier. They declined.",
53:"Cointelpro: neutralize, disrupt, discredit. The FBI declared war on civil rights.",
54:"The Lavender Scare: security risks, said Hoover, who wore tulle, allegedly.",
55:"The Black Messiah, martyrdom. Drugged by an informant. Shot in his bed. He was 21.",
56:"Operation Hoodwink, a war between the Mob and the Communists. Neither side took the bait.",
57:"The Spy in the Bag. Accident, said the coroner. Impossible, said the locksmith.",
58:"The Billion Dollar Mole sold Russia the tunnel we dug under their embassy.",
59:"The Drunk Spies, MI6 for the KGB, never caught because they were gentlemen.",
60:"The Cross-Dresser is instantly detected. But you look fabulous.",
}
INTRO="Project Gateway Kayfabe. Playful anarchy and fun!"
OUTRO="What the fluff?!"
D='project_gateway_kayfabe'
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
