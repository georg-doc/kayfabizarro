T = {
1:"The Necessary Motion keeps you alive: you bend, you gather, you repeat.",
2:"The First Division: the boy who won't sit still is sent out with the hounds.",
3:"The Shared Burden: no one tracks who did how much. The day ends when there is enough.",
4:"The First Obligation detaches production from appetite: you bend because you are the bender.",
5:"The Bell forces all to pray in synchrony: the day has owners, and the owners are calling.",
6:"The Whistle converts time into currency. The factory's breath commands the herd.",
7:"The Long Day: fourteen hours of the sun, all belonging to the mill.",
8:"The Hour Saved: the fiercest battle of the century was over the right to go to sleep.",
9:"The Stopwatch breaks any job into terrifyingly efficient micro-motions. He timed every breath.",
10:"The Optimised Body destroys the soul: the first manual for treating flesh like gears.",
11:"The Pin Factory removes the ability to craft. No one here knows how to make a pin.",
12:"The Division of Labour: no worker sees the whole object. The prerequisite for mass amnesia.",
13:"The Surplus: the factory cannot function if the worker takes home what they make.",
14:"Alienation: you build the world, but you do not live in it.",
15:"The Iron Cage: the Puritan wanted to work in a calling; we are forced to do so.",
16:"The Hour, a commodity for sale: in selling the hour, you sell the self that fills it.",
17:"The Cubicle: invented to give you room, used to fence you in.",
18:"The Knowledge Worker cannot be coerced. The worker owns the means of production: their mind.",
19:"The Memo replaces the whistle with ambient dread. The soft power of the new regime.",
20:"The Meeting stops all actual work while simulating productivity.",
21:"The Cascade: the project takes six weeks because six weeks were allotted.",
22:"The Quarterly: the business shapes itself to what the analyst can see.",
23:"The Proxy overtakes the real value: the system now serves the measurement of the system.",
24:"The Goodhart Metric: door-to-doctor time improved. The patient died.",
25:"The Org Chart tells a fiction: the real flows are sideways, informal, and invisible.",
26:"The Reorg, a periodic ritual where everyone pretends things have changed.",
27:"The Performance Review meets you once a year and pretends to know you.",
28:"The Calibration: the line was drawn before anyone looked at your work.",
29:"The Box-Ticker: a person writes the report no one will read.",
30:"The Duct-Taper exists solely for re-entering data the machine lost.",
31:"The Taskmaster manages those who do not require management: busywork for the capable.",
32:"The Flunky makes a superior feel important. Feudal retinues in cubicle clothing.",
33:"The Goon exists because the opponent has one too: an arms race of useless aggression.",
34:"The Ladder, the modern firm's imitation of the apprentice, journeyman, and master.",
35:"The Title and the Promotion: ask them who they are, and they answer what they do.",
36:"The Achievement-Subject exploits itself: no boss needed, the exploiter is the exploited.",
37:"The Burned: you have no one to blame, because the only one pushing was you.",
38:"The Mended Thing answers you in a way the spreadsheet never will.",
39:"The Skilled Hand remembers what to do when the mind has been trained out of it.",
40:"The Craftsman cannot survive the modern firm's hatred of slowness and mastery.",
41:"The Apprentice no longer apprentices. The apprentice is onboarded.",
42:"Quiet Quitting refuses to give the firm more than it pays for.",
43:"Lying Flat: do nothing, achieve nothing, want nothing the system wants you to want.",
44:"The Side Project, where work that matters happens: once a hobby, now a lifeboat.",
45:"The Fifteen-Hour Week: we got the productivity. We didn't get the time.",
46:"The Always-On: work that does not begin, because it has not ended.",
47:"The Notification pierces the toilet: someone needed to clear their queue before logging off.",
48:"The Pyjama merges the bed and the desk into a single terrifying location.",
49:"The Replacement: your job exists because no one has built a machine to do it yet.",
50:"The Obsolete Man induces shame at our own slowness, surpassed by our own products.",
51:"The Forced Holiday: leisure planned around work, ended by work.",
52:"The Real Leisure, the activity for which work freed you: we have very little left.",
53:"The Day, a quantity of human time and attention, did not have to be filled.",
54:"The System: after enough repetition, the other ways became unimaginable.",
55:"The Calling: the morning is easier when the job and the calling are the same.",
56:"The Rest of the Day: the system doesn't need us to know what it is for. But we need to know.",
}
INTRO="What Work Was For: a field report from before the timesheet. Komik Kult Kards for bullshit jobs."
OUTRO="What was work for? It was the part of the day that bought the rest of the day."
import csv
N=sorted(T)
w=csv.writer(open('bullshit_jobs_uncut.t1.triplets.csv','w',newline=''))
w.writerow(['line_no','kind','card_number','opener','triplet'])
w.writerow([0,'intro','','',INTRO])
for i,n in enumerate(N,1): w.writerow([i,'card',n,'',T[n]])
w.writerow([len(N)+1,'outro','','',OUTRO])
beats=['[Spoken Word]',INTRO]+[T[n] for n in N]+[OUTRO,'Stay Fluffy, Folks!']
txt='\n\n'.join(beats)+'\n'
open('bullshit_jobs_uncut.t1.suno.txt','w').write(txt)
L=[len(T[n]) for n in T]
print('chars',len(txt),'avg',round(sum(L)/len(L),1),'max',max(L),[(n,len(T[n])) for n in T if len(T[n])>90])
