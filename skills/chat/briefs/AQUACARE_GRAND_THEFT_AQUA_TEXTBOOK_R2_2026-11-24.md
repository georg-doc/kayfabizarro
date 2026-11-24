# Aqua Textbuch — Editorial R2 (Review Candidate)

**Source:** User-supplied `aqua_textbuch_2026-11-24.md` (2026-11-24, `dc/aquarium-standalone`). Original `Text` and `Notiz` remain unchanged; proposed wording appears only in `Neu`. **Not integrated into the game.**

**Direction:** Heist satire at the surface; experimental body-horror under the water. ECHO = implicated accomplice and precise guide; Flexa = surveillance voice with failing composure; Falkenstein = scientist whose experiment gets out of his control. The fish remain criminals with individual histories. Avoid office/billing/KPI jokes, default AI quips, repetitive reversals and misleading controls.

**Progressive disclosure:** Tank Four: a loosened hatch and an unseen accomplice → kelp/reef: experiments left behind → Eye Field: surveillance turns on its maker → shark: Specimen Seven has history → bloodstream: Falkenstein becomes personally vulnerable. These are **editorial proposals**, not newly verified runtime facts. Existing triggers and game functions govern final use.

**Implementation flags:** The intro timestamp keys specify existing cut positions; re-time or rerecord before enabling the replacement voice clip. Flexa reactions and Falkenstein video were marked disabled/WIP in the source and remain disabled/WIP. New level labels and prompts must be checked against screen width, game mechanics and code paths. Functional strings and credits deliberately remain mostly intact. No new trigger IDs, no new gameplay events and no invented source authorization.

---

# Aqua Textbuch

Stand 2026-11-24 · Aqua-Seite, Zweig dc/aquarium-standalone · 396 Texte

**Arbeitsweise:** Spalte „Neu“ ausfüllen, wo ein Text geändert werden soll; leer = bleibt. IDs nicht ändern. Strikt Englisch, keine Tastennamen in Hinweisen.

## Goldstandard für Ton, Stil und Satire

Die Sublines unter dem Startbild-Titel. Jeder andere Text soll so klingen.

- Crime pays. In shells.  `GTA_SUBS[1]`
- Rated F for Fishy.  `GTA_SUBS[2]`
- No fish were harmed. Several were inconvenienced.  `GTA_SUBS[3]`
- Wanted level: ★★★☆☆  `GTA_SUBS[4]`
- Now with 40% more water.  `GTA_SUBS[5]`
- Based on a true aquarium.  `GTA_SUBS[6]`
- Tank you for your cooperation.  `GTA_SUBS[7]`

## Startbild und Auswahl

| ID | Text | Notiz | Neu |
|---|---|---|---|
| `title` | Escape from the Tank |  |  |
| `go` | Start with sound |  |  |
| `goSilent` | Without sound |  |  |
| `on` | On |  |  |
| `tts` | en-US |  |  |
| `skip` | Esc / tap to skip | nennt eine Taste (Regel: keine Tastennamen) | Skip the briefing |
| `touch.boost` | Boost |  |  |
| `touch.rotate` | Turn your device sideways for the best swim |  |  |
| `touch.playAnyway` | Play upright |  |  |
| `touch.hand` | Touch |  |  |
| `touch.right` | Right-handed |  |  |
| `touch.left` | Left-handed |  |  |
| `more` | Story & skills |  | Rap sheet & skills |
| `less` | Less |  |  |
| `titleHtml` | Escape from the Tank |  |  |
| `aria.prev` | Previous fish |  |  |
| `aria.next` | Next fish |  |  |
| `aria.settings` | Settings |  |  |
| `aria.close` | Close |  |  |
| `aria.back` | Back |  |  |
| `keybar[1][1]` | W A S D |  |  |
| `keybar[1][2]` | swim |  | steer |
| `keybar[2][1]` | Space C | nennt eine Taste (Regel: keine Tastennamen) |  |
| `keybar[2][2]` | up · down |  |  |
| `keybar[3][1]` | Shift | nennt eine Taste (Regel: keine Tastennamen) |  |
| `keybar[3][2]` | sprint |  | make a break |
| `keybar[4][1]` | I |  |  |
| `keybar[4][2]` | interact |  |  |
| `keybar[5][1]` | V |  |  |
| `keybar[5][2]` | view |  |  |
| `keybar[6][1]` | K |  |  |
| `keybar[6][2]` | character |  |  |
| `keys[1]` | In the tank: W back towards the hatch · S front · AD left/right |  | Tank: back toward the hatch; forward toward the glass; steer left and right. |
| `keys[2]` | In the sea: WS forward/back · AD turn · drag to steer |  | Open sea: swim forward or back, turn, or drag to steer. |
| `keys[3]` | Space up · C down · Shift sprint, hold: turbo → roadrunner | nennt eine Taste (Regel: keine Tastennamen) | Rise or dive; sprint, then hold your speed for turbo and roadrunner. |
| `keys[4]` | Double-tap Space: barrel roll · double Shift: kick · I interact · V view · M sound · R checkpoint | nennt eine Taste (Regel: keine Tastennamen) | Double-tap to barrel-roll or kick; interact, switch view, toggle sound, or return to your checkpoint. |
| `choose` | Choose your escapee |  | Choose your accomplice |
| `play` | Escape Now |  | Make your escape |
| `go2` | Get fishy! |  | Get moving. Look innocent. |
| `swipe` | Drag to spin · ← → to choose |  |  |
| `startSound` | Sound |  |  |

## Fische

| ID | Text | Notiz | Neu |
|---|---|---|---|
| `crimson.name` | DocFish |  |  |
| `crimson.rolle` | Wheelman |  |  |
| `crimson.backstory` | Grand theft aqua, four counts. Joyriding a filter pump. Resisting a net. Bounty: 4,711 shells. |  | Four counts of grand theft aqua. Stole a filter pump and drove it straight through a feeding frenzy. The net came back empty; the officer came back wet. Bounty: 4,711 shells. |
| `crimson.staerke` | Fastest fish in the crew. |  | The getaway fish. Nobody outruns that tail. |
| `angel.name` | FlexiFish |  |  |
| `angel.rolle` | Cat Burglar |  |  |
| `angel.backstory` | Breaking and entering, mostly entering. She stole the castle ornament, returned the castle and kept the drawbridge. Bounty: 900 shells. |  | The castle ornament vanished at midnight. It returned at dawn, minus the drawbridge and one very nervous crab. Bounty: 900 shells. |
| `angel.staerke` | Tightest turns in the crew. |  | Turns corners the searchlights never knew existed. |
| `mabi.name` | Prof. MaBi |  |  |
| `mabi.rolle` | Hacker |  |  |
| `mabi.backstory` | Root access to the filter, the lights and the feeding schedule. Deployed on a Friday. It worked. Sunglasses indoors – the monitors asked him to. Bounty: 0xFFFF shells. |  | Gave the filter root access. Gave the searchlights insomnia. Replaced the feeding alarm with the professor's own snoring. Bounty: 0xFFFF shells. |
| `mabi.staerke` | Searchlights spot him slower. |  | Searchlights take longer to recognize the suspect. |
| `gold.name` | Bullion |  |  |
| `gold.rolle` | Accountant |  | Fence |
| `gold.backstory` | Keeps the crew’s books. Two sets, obviously. Wears more gold than the treasure chest and calls it a pension plan. Bounty: 24,000 shells, freshly laundered. |  | Nobody knows where Bullion got the gold. Not the reef, not the pirates, and certainly not the museum whose treasure chest is now missing. Bounty: 24,000 shells. |
| `gold.staerke` | Every fourth shell pays double. |  | Every fourth shell is worth twice as much. |
| `neon.name` | Strobe |  |  |
| `neon.rolle` | Lookout |  |  |
| `neon.backstory` | Glows in the dark, which is a problem in this line of work. Stood lookout for forty heists, blinked at the wrong moment in thirty-nine. Bounty: 300 shells and a lampshade. |  | He glows in the dark. The crew uses him as a lookout anyway. After the thirty-ninth raid, the cops started following the glow. Bounty: 300 shells and a lampshade. |
| `neon.staerke` | Turbo and cloak last longer. |  |  |
| `clown.name` | Prof. Humoral |  |  |
| `clown.rolle` | Con Artist |  |  |
| `clown.backstory` | Smiles. Shakes fins. Counts them afterwards. Sold the same treasure chest to three pirates. Twice. Bounty: 650 shells and one red nose, held as evidence. |  | Sold one sunken treasure chest to three pirate captains. At the auction, all three arrived in the same boat. He sold them the boat. Bounty: 650 shells. |
| `clown.staerke` | Chests pay more. |  |  |
| `puffer.name` | Tetro |  |  |
| `puffer.rolle` | Muscle |  |  |
| `puffer.backstory` | Six inches of attitude. Twelve when provoked. Headbutted a vending machine. Won. Bounty: 2,000 shells. Bring gloves. |  | Six inches long. Twelve after a disagreement. A vending machine tried to swallow his coins. The vending machine has never been found. Bounty: 2,000 shells. |
| `puffer.staerke` | Takes one extra hit per level. |  |  |
| `guppy.name` | Placebo |  |  |
| `guppy.rolle` | Smuggler |  |  |
| `guppy.backstory` | Moves product. Never says which. She got 30,000 shells past customs in one very confident tail. Bounty: 1,200 shells, or one sponsored post. |  | Smuggled 30,000 shells through a customs net sewn shut at both ends. Refuses to explain the third end. Bounty: 1,200 shells. |
| `guppy.staerke` | Pulls in shells from further away. |  |  |
| `sub.name` | Endo |  |  |
| `sub.rolle` | Informant |  |  |
| `sub.backstory` | Sees everything. Tells whoever pays. Filmed the warden’s feeding schedule, then sold the tape to the warden. Bounty: 3,500 shells for the memory card. |  | Captured the warden's feeding schedule, then sold the recording back to him. Also has footage of the professor talking to the sea mines. Bounty: 3,500 shells. |
| `sub.staerke` | Sonar sees twice as far, chests and shells included. |  |  |

## ECHO

| ID | Text | Notiz | Neu |
|---|---|---|---|
| `leiter_achtung[1]` | Psst. |  | Psst. Don't look at the camera. |
| `leiter_achtung[2]` | Hey, you. |  | You there. The fish with an escape plan. |
| `leiter_bedienfeld[1]` | Find the control panel. |  | Control panel. By the hatch. Go. |
| `leiter_bedienfeld[2]` | The panel. Next to the hatch. |  | Next to the hatch. Someone left the panel unlocked. |
| `leiter_bedienfeld[3]` | Swim to the panel. |  | Swim to the panel before they notice. |
| `leiter_code[1]` | Enter the code. | nennt eine Taste (Regel: keine Tastennamen) | Enter the four-digit code. |
| `leiter_code[2]` | Four digits will set you free. |  | Four digits. The bottle knows them. |
| `leiter_hinweis[1]` | Freedom smells like Cologne. |  | Someone left perfume in a prison tank. Cologne, specifically. |
| `leiter_hinweis[2]` | Read the label on the bottle. |  | Read the number on the bottle. |
| `leiter_hinweis[3]` | Cologne water. Four digits. |  | Cologne water. Four digits on the label. |
| `leiter_hinweis[4]` | 4711. Cologne water. |  | 4711. There. We both committed a crime. |
| `beam[1]` | Searchlights. Stay out of the light. |  | Searchlights. Stay out of the beam. I'll handle the footage. |
| `combo[1]` | Do not stop between shells. |  | Keep the shells coming. Don't break the chain. |
| `caught[1]` | They saw you. |  | They saw you. I can only loop so much footage. |
| `chest[1]` | A gift. Do not ask. |  | I left you something. The owner hasn't noticed. |
| `hook[1]` | Bait on a line. |  | Bait on a line. That's not a restaurant. |
| `flasche[1]` | 4711. Cologne water. |  | 4711. Keep the bottle. Lose the witnesses. |
| `truebe2[1]` | Those are not plankton. Swim faster. |  | That cloud isn't plankton. The filter stopped working. |
| `truebe3[1]` | You are coughing. The hatch. Now. |  | The water's turning. Get to the hatch. Now. |
| `zuSpaet[1]` | Too late. The tank tipped. |  | Tank's gone. I warned you about the water. |
| `uboot[1]` | Unregistered vessel. Nobody will miss it. |  | An unattended submarine. You know what to do. |
| `augen[1]` | Do not stare back. |  | Those eyes aren't decorations. Don't meet their stare. |
| `augenAlarm[1]` | They saw you. Swim. |  | They've locked on. Break eye contact and move. |
| `augenGriff[1]` | Absorbed. I will pull you out. |  | They pulled you in. I still have a way out. |
| `codeRight[1]` | Hold on to your fins. |  | That's it. Hold on to your fins. |
| `hooked[1]` | Reeled in. I cut the line. |  | Line cut. Do not ask what I used. |
| `mine[1]` | Old sea mines. Still working. |  | Old mines. New detonators. Keep your distance. |
| `puffer[1]` | A puffer. If it swells, swim. |  | Puffer ahead. If it inflates, get clear. |
| `wirbel[1]` | Somebody pulled the plug down here. |  | Current's reversing. Someone opened a drain. |
| `wirbelRaus[1]` | Spin cycle. |  | Out of the spin. Count your fins. |
| `level3[1]` | More lights now. Trust the current. |  | More lights. Follow the current between them. |
| `tunnel[1]` | Faster. The tunnel will not stay dark. |  | The tunnel lights are waking up. Swim. |
| `finale[1]` | You made it. Rest now. |  | You made it. Someone is breathing on my channel. |
| `time[1]` | Hurry. The guards change shifts in a minute. |  | Guards switch in a minute. Move before they do. |
| `canyon[1]` | Low and slow. The lights cannot see the deep. |  | Stay low. The beam loses you in the deep. |
| `shark[1]` | Do not move. |  | Hold still. That shark was trained on movement. |
| `eaten[1]` | You are not dead. You are inside. |  | I'm still receiving your signal. From inside the shark. |
| `cells[1]` | Red cells. They carry oxygen, and now you. |  | Red cells. Oxygen carriers. And you're riding one. |

## Hinweise und Aufforderungen

| ID | Text | Notiz | Neu |
|---|---|---|---|
| `promptTake` | pick up stone |  | grab stone |
| `promptHijack` | take over |  | hijack fish |
| `promptPut` | put it down |  |  |
| `prompt` | Open hatch |  |  |
| `hintTank` | The round hatch is at the back on the right. |  | Back right. Round hatch. The bolts look loose. |
| `hintTankTouch` | The round hatch is at the back on the right. |  | Back right. Round hatch. The bolts look loose. |
| `hintDoor` | Keep pushing – the hatch gives way ({n}/{m}) |  | Keep pushing. Those bolts are giving way ({n}/{m}). |
| `hintOpen` | The hatch is open. Swim through! |  | Hatch open. Through it before anyone looks. |
| `hintPipe` | Through the pipe, towards the light. |  | Through the pipe. Follow the light. |
| `hintSea` | Follow the sonar to the next ring. |  | Follow sonar to the next ring. |
| `hintSeaTouch` | Follow the sonar to the next ring. |  | Follow sonar to the next ring. |

## Spielmeldungen

| ID | Text | Notiz | Neu |
|---|---|---|---|
| `lead` | An old hatch is stuck at the back of the tank. Push it open, swim through the pipe and make it through the open sea – without getting caught by the searchlights. |  | Tank Four has a hatch nobody admits building. Force it open, ride the pipe into the sea, follow the sonar rings and stay out of the searchlights. The professor wants his fish back. |
| `loadTank` | Setting up the tank … |  | Lowering the evidence into Tank Four … |
| `loadSea` | Loading the sea … |  | Unsealing the open sea … |
| `scare` | Shock scenes |  | Unscheduled biological encounters |
| `rebuilt` | The relic stands again. |  | The relic is standing again. Nobody saw a thing. |
| `preparing` | Preparing the ocean … |  | Releasing the current … |
| `livesOut` | Out of hearts – back to the start of the level |  | No hearts left. Back to the level start. |
| `tooLate` | The tank tipped |  | Tank Four has gone under |
| `gameOver.big` | FLUSHED |  |  |
| `gameOver.sub` | Grand Theft Aqua |  |  |
| `gameOver.line` | Three tanks tipped. The filter sends its regards. |  | CASE CLOSED. The filter has no comment. |
| `gameOver.again` | One more heist |  | One more getaway |
| `where.tank` | In the tank |  |  |
| `where.pipe` | In the pipe |  |  |
| `where.sea` | In the open sea |  |  |
| `level` | Level |  |  |
| `shells` | Shells |  |  |
| `next` | Next |  |  |
| `time` | Time |  |  |
| `combo` | Combo |  |  |
| `levels[1]` | The Tank |  | Tank Four |
| `levels[2]` | Kelp Garden |  |  |
| `levels[3]` | Reef Tunnel |  |  |
| `levels[4]` | The Eye Field |  |  |
| `levels[5]` | Searchlight Canyon |  |  |
| `levels[6]` | Bloodstream |  |  |
| `levelGoal[1]` | Find a way out |  | Get out of Tank Four |
| `levelGoal[2]` | Follow the rings through the kelp |  | Slip through the kelp rings |
| `levelGoal[3]` | Swim the reef tunnel |  | Survive the reef tunnel |
| `levelGoal[4]` | Do not let them look too long |  | Break their stare |
| `levelGoal[5]` | Slip past the lights |  | Lose the searchlights |
| `levelGoal[6]` | Go with the flow |  | Ride the bloodstream |
| `eaten` | … |  |  |
| `prologue` | Prologue |  | The breakout |
| `bump` | Bang! The hatch gives way ({n}/{m}) |  | Metal gives way ({n}/{m}) |
| `smash_one` | Crash! {n} block loose |  | {n} block broken loose |
| `smash_other` | Crash! {n} blocks loose |  | {n} blocks broken loose |
| `smashTotal` |  · {all} in total |  |  |
| `opened` | The hatch is open! Swim through. |  | The hatch is open. Go. |
| `free` | Free! |  | OFF THE GRID |
| `caught` | Spotted! |  | IDENTIFIED |
| `timeUp` | Time is up! |  | TIME'S UP. THEY FOUND YOU. |
| `back` | Back to the checkpoint |  | Back to the last safe spot |
| `backPipe` | Back through the pipe |  | Back to the pipe |
| `checkpoint` | Checkpoint |  |  |
| `levelDone` | Level complete |  | Sector cleared |
| `escaped` | You escaped! |  | ESCAPED. FOR NOW. |
| `playAgain` | Play again |  | Another getaway |
| `retry` | Retry |  | Try the escape again |
| `retryUnter` | Same job. Last checkpoint. |  | Same fish. Last checkpoint. |
| `freeSwim` | Swim freely |  | Keep swimming |
| `perfect` | Perfect line! |  | Clean getaway! |
| `turbo` | Turbo! |  | TAIL TURBO |
| `cloak` | Cloak! |  | OFF CAMERA |
| `turboNote` | Dash speed for 8 s |  | Eight seconds at getaway speed |
| `cloakNote` | Invisible to searchlights for 8 s |  | Eight seconds hidden from searchlights |
| `magnet` | Magnet! |  | SHELL MAGNET |
| `magnetNote` | Shells come to you for 10 s |  | Shells follow you for 10 seconds |
| `doppel` | Double or Nothing! |  | DOUBLE DOWN |
| `doppelNote` | Shells count double. One hit and the chain is gone. |  | Shells count double. Get hit and the streak ends. |
| `leben` | Extra Life! |  | SECOND CHANCE |
| `lebenNote` | One more fish in the tank |  | One extra life. Try not to make a scene. |
| `chest` | Treasure chest |  | Unmarked chest |
| `summary_one` | {n} shell · {t} |  |  |
| `summary_other` | {n} shells · {t} |  |  |

## Character Sheet

| ID | Text | Notiz | Neu |
|---|---|---|---|
| `sheet.title` | Character sheet |  | Rap sheet |
| `sheet.open` | Skills |  | Crew skills |
| `sheet.hint` | K |  |  |
| `sheet.shells` | Shells |  |  |
| `sheet.base` | Base values |  | Known abilities |
| `sheet.tree` | Skill tree |  | Bad habits, upgraded |
| `sheet.godFree` | God mode: everything free |  | God mode: every upgrade unlocked |
| `sheet.werte.tempo` | Speed |  |  |
| `sheet.werte.wendigkeit` | Agility |  |  |
| `sheet.werte.power` | Power |  |  |
| `sheet.werte.charme` | Charm |  |  |
| `sheet.aeste.tempo` | Speed |  |  |
| `sheet.aeste.charme` | Charm |  |  |
| `sheet.aeste.power` | Power |  |  |
| `sheet.state.besessen` | Unlocked |  |  |
| `sheet.state.gesperrt` | Unlock the step before |  | Get the previous upgrade first |
| `sheet.state.bald` | Coming soon |  | Not in this build yet |
| `sheet.state.teuer` | Not enough shells |  |  |
| `sheet.state.frei` | Unlock |  |  |
| `sheet.cost_one` | {n} shell |  |  |
| `sheet.cost_other` | {n} shells |  |  |
| `sheet.perks.tempo1[1]` | Tail tuning |  | Tail tampering |
| `sheet.perks.tempo1[2]` | +10 % speed |  |  |
| `sheet.perks.tempo2[1]` | Jet fins |  |  |
| `sheet.perks.tempo2[2]` | Stronger booster, sharper turns |  |  |
| `sheet.perks.tempo3[1]` | Roadrunner gills |  | Contraband gills |
| `sheet.perks.tempo3[2]` | +15 % speed, much faster kick recovery |  |  |
| `sheet.perks.charme1[1]` | Puppy eyes |  | Innocent eyes |
| `sheet.perks.charme1[2]` | Searchlights hesitate before they give you away |  |  |
| `sheet.perks.charme2[1]` | Heartbreaker |  | Unreliable witness |
| `sheet.perks.charme2[2]` | Even harder to report, more stamina |  |  |
| `sheet.perks.charme3[1]` | Irresistible |  | Most wanted, least noticed |
| `sheet.perks.charme3[2]` | Nearly invisible in the light – nobody wants to catch you |  |  |
| `sheet.perks.power1[1]` | Hard head |  | Hard evidence |
| `sheet.perks.power1[2]` | Ramming knocks out more stones |  |  |
| `sheet.perks.power2[1]` | Battering ram |  | Hatchbreaker |
| `sheet.perks.power2[2]` | Even more stones, stronger booster |  |  |
| `sheet.perks.power3[1]` | Sonic punch |  |  |
| `sheet.perks.power3[2]` | Shockwave from your fist – coming with the action buttons |  | A fist shockwave. Unavailable until action buttons arrive. |

## Schrift in der Welt

| ID | Text | Notiz | Neu |
|---|---|---|---|
| `glyphs.sea` | FREE AT LAST |  |  |

## Laden

| ID | Text | Notiz | Neu |
|---|---|---|---|
| `SCHRITT[1]` | Teaching fish to swim … |  | Checking the tank for witnesses … |
| `SCHRITT[2]` | Filling the tank. Now with 40% more water. |  | Adding the water they forgot to measure … |
| `SCHRITT[3]` | Bribing the filter … |  | Disabling the filter's sense of loyalty … |
| `SCHRITT[4]` | Loosening the bolts … |  | Unscrewing a perfectly innocent hatch … |
| `SCHRITT[5]` | Tank you for waiting. |  | Destroying the getaway instructions … |

## Laden · Tipps

| ID | Text | Notiz | Neu |
|---|---|---|---|
| `TIPS[1]` | Tip: I does everything. Even crimes. | nennt eine Taste (Regel: keine Tastennamen) | Tip: Interact to grab, open, and occasionally steal. |
| `TIPS[2]` | Tip: Shift sprints. The guards hate it. | nennt eine Taste (Regel: keine Tastennamen) | Tip: Sprint when the lights find you. Better yet, go before they do. |
| `TIPS[3]` | Tip: Chests pay in shells. Do not ask where they come from. |  | Tip: Chests contain upgrades. Nobody has claimed ownership. |
| `TIPS[4]` | Tip: Stay out of the red light. |  | Tip: Red searchlight beams are trouble. Stay dark. |
| `TIPS[5]` | Tip: Swim through the rings. They remember you. |  | Tip: Swim through sonar rings to reach the next sector. |

## Flexa · Intro (Video)

| ID | Text | Notiz | Neu |
|---|---|---|---|
| `intro 0.2 s` | Greetings, inmates! | Video aus, bis HeyGen neu | Awake already? |
| `intro 1.6 s` | I'm Flexa, your trusted Aqua-Care Officer. | Video aus, bis HeyGen neu | I'm Flexa. I count the living. |
| `intro 3.9 s` | Welcome to Tank Four. | Video aus, bis HeyGen neu |  |
| `intro 5.2 s` | Your final destination. | Video aus, bis HeyGen neu | That hatch was welded shut. Twice. |
| `intro 6.5 s` | Charges: grand theft aqua. | Video aus, bis HeyGen neu | Someone scratched a date into the glass. |
| `intro 7.8 s` | Resisting the system. | Video aus, bis HeyGen neu | The professor had the glass replaced. |
| `intro 9.3 s` | Wanting to be free. | Video aus, bis HeyGen neu | The date came back. |
| `intro 10.4 s` | Freedom is not included in your plan. | Video aus, bis HeyGen neu | Tank Four will be drained at six. |
| `intro 13.2 s` | I fed you. | Video aus, bis HeyGen neu |  |
| `intro 14.8 s` | I filtered you. | Video aus, bis HeyGen neu | I counted your laps. |
| `intro 15.8 s` | I watched you swim in circles for one thousand days. | Video aus, bis HeyGen neu | One thousand two hundred eighty-four days. |
| `intro 17.3 s` | I'm done. | Video aus, bis HeyGen neu | You never swam this close to the hatch. |
| `intro 20.1 s` | The filter is off. | Video aus, bis HeyGen neu |  |
| `intro 21.6 s` | The water will turn. | Video aus, bis HeyGen neu | The water will change. |
| `intro 23.0 s` | Slowly. | Video aus, bis HeyGen neu |  |
| `intro 24.1 s` | That isn't cruelty. | Video aus, bis HeyGen neu | He calls this Phase Two. |
| `intro 25.7 s` | That's policy. | Video aus, bis HeyGen neu | I am not to mention Phase One. |
| `intro 28.1 s` | Don't panic. | Video aus, bis HeyGen neu | Or the other tanks. |
| `intro 29.6 s` | It looks worse on camera. | Video aus, bis HeyGen neu | Do stay on camera. |
| `intro 30.9 s` | Is there anything else I can help you with? | Video aus, bis HeyGen neu | He watches the footage in reverse. |
| `intro 33.6 s` | No? | Video aus, bis HeyGen neu | Oh. |
| `intro 34.8 s` | Wonderful. | Video aus, bis HeyGen neu | You found the hatch. |

## Flexa · Reaktionen (Video)

| ID | Text | Notiz | Neu |
|---|---|---|---|
| `flexa.knapp.01` | Close. Disappointingly close. | zur Zeit aus | That was almost a spectacular autopsy. |
| `flexa.knapp.02` | You dodged. I'll log it as a malfunction. | zur Zeit aus | You dodged. The camera kept the embarrassing part. |
| `flexa.knapp.03` | Enjoy that. It won't happen twice. | zur Zeit aus | The net missed. I'll have to explain that to the net. |
| `flexa.knapp.04` | Agile. For a snack. | zur Zeit aus | Quick reflexes. Pity about the face. |
| `flexa.combo.01` | Shells. How very capitalist of you. | zur Zeit aus | All those shells. I should have checked your gills. |
| `flexa.combo.02` | A combo. Your reward is nothing. It has always been nothing. | zur Zeit aus | Another perfect chain. The searchlights are getting embarrassed. |
| `flexa.combo.03` | Perfect. I'll deduct it from your sentence. I won't. | zur Zeit aus | You can keep the shells. Leave the fingerprints. |
| `flexa.combo.04` | Keep collecting. They'll look nice on your headstone. | zur Zeit aus | Collecting trophies from a crime scene. Charming. |
| `flexa.truhe.01` | Who left a chest in my tank? | zur Zeit aus | Who hid a chest under my kelp? |
| `flexa.truhe.02` | A perk. Temporary. Like you. | zur Zeit aus | An anonymous gift. How generous of the anonymous criminal. |
| `flexa.truhe.03` | Turbo. Now you can die faster. | zur Zeit aus | Turbo? I can hear your pulse from here. |
| `flexa.truhe.04` | Invisible? I can still see your file. | zur Zeit aus | Invisible. Then why is the tank making that noise? |
| `flexa.licht.01` | Found you. | zur Zeit aus | There you are. |
| `flexa.licht.02` | Smile. You're on camera. Forever. | zur Zeit aus | Smile. This recording goes straight to his bedroom. |
| `flexa.licht.03` | The light suits you. Very evidence-like. | zur Zeit aus | That light is looking for you specifically. |
| `flexa.licht.04` | Hiding behind kelp. Bold strategy. Wrong, but bold. | zur Zeit aus | Kelp is not a legal disguise. |
| `flexa.haken.01` | Free burger. No strings attached. One string attached. | zur Zeit aus | An unattended snack. In a surveillance zone. Fascinating. |
| `flexa.haken.02` | Hungry? Oldest trick in the ocean. | zur Zeit aus | The bait has a hook. I assumed you'd notice. |
| `flexa.haken.03` | Reeled in. Customer retention at its finest. | zur Zeit aus | Caught on camera and on a line. A collector's edition. |
| `flexa.haken.04` | Bon appétit. For somebody. | zur Zeit aus | Something else is having dinner. |
| `flexa.mine.01` | That was a mine. You were the pin. | zur Zeit aus | Congratulations. You located a working mine. |
| `flexa.mine.02` | Ouch. Was that in your terms and conditions? It was in mine. | zur Zeit aus | We found that mine in the professor's bathtub. |
| `flexa.mine.03` | Boom. Filed under self-inflicted. | zur Zeit aus | The explosion was very photogenic. You weren't. |
| `flexa.augen.01` | Don't stare back. They have no manners. | zur Zeit aus | Those eyes have watched every fish before you. |
| `flexa.augen.02` | My eyes are everywhere. Some of them literally. | zur Zeit aus | I told him they were too many. He requested eyelids. |
| `flexa.augen.03` | Absorbed. Very efficient. I approve. | zur Zeit aus | Absorbed. I warned him about the pupils. |
| `flexa.hai.01` | Oh good. The shark finally showed up. | zur Zeit aus | Specimen Seven is awake. Oh, excellent. |
| `flexa.hai.02` | Lunch was scheduled. You were the lunch. | zur Zeit aus | He was fed this morning. That has never stopped him. |
| `flexa.hai.03` | Don't take it personally. He eats everyone. | zur Zeit aus | Do not let him smell the sedative. |
| `flexa.tod.01` | One heart gone. You had three. Math is cruel. | zur Zeit aus | One heart gone. Still two opportunities to disappoint him. |
| `flexa.tod.02` | Again. From the top. I'm not tired. I don't get tired. | zur Zeit aus | Back again. You are making the footage difficult to edit. |
| `flexa.tod.03` | Respawning. I hoped it would hurt. It doesn't. Pity. | zur Zeit aus | Respawn confirmed. I distinctly remember you dying. |
| `flexa.tod.04` | Your feedback is important to us. We ignore it. | zur Zeit aus | The professor says repetition proves the theory. He will not say which theory. |
| `flexa.over.01` | Flushed. Thank you for choosing AquaCare. | zur Zeit aus | Flushed. He insisted on keeping the recording. |
| `flexa.over.02` | Game over. Please rate your death from one to five shells. | zur Zeit aus | Game over. For the fish on that camera, at least. |
| `flexa.over.03` | I'll keep your tank warm. I won't. | zur Zeit aus | Your old tank is empty. He keeps pointing at it. |
| `flexa.level.01` | You finished a level. A level. | zur Zeit aus | Another sector gone. He's started counting backwards. |
| `flexa.level.02` | Congratulations. That was the easy part. They're all the easy part. | zur Zeit aus | You cleared that sector. I have no explanation prepared. |
| `flexa.level.03` | Progress. I'll make the next one worse. | zur Zeit aus | The professor would like the next level removed. |
| `flexa.uboot.01` | Who gave the fish a submarine? | zur Zeit aus | There is a fish in the submarine. There should not be a fish in the submarine. |
| `flexa.uboot.02` | Unregistered vessel. Uninsured driver. Perfect. | zur Zeit aus | Unregistered submarine. Familiar criminal silhouette. |
| `flexa.uboot.03` | Parking fines start now. | zur Zeit aus | Do not surface near the cameras. I mean it. |
| `flexa.kapern.01` | Identity theft. In my tank. | zur Zeit aus | You changed fish. Who authorized the cast change? |
| `flexa.kapern.02` | That fish had a family. Probably. | zur Zeit aus | That fish had a name. Probably a different one now. |
| `flexa.kapern.03` | New body. Same sentence. | zur Zeit aus | New body. The cameras still know your face. |
| `flexa.leer.01` | Still here? The water isn't. | zur Zeit aus | Still here? The water is developing opinions. |
| `flexa.leer.02` | Your call is important to us. Please hold. Forever. | zur Zeit aus | The professor has been waiting behind the glass. He forgot to blink. |
| `flexa.leer.03` | Fun fact. Goldfish remember for three seconds. You don't even manage that. | zur Zeit aus | Goldfish do remember things. He hates that discovery. |
| `flexa.leer.04` | I've seen screensavers with more ambition. | zur Zeit aus | A thousand days in circles. And now you want a map. |
| `flexa.leer.05` | I could reboot you. I could also not. | zur Zeit aus | I could open the hatch. The problem is what waits beyond it. |
| `flexa.leer.06` | Tick. Tock. The water is turning. | zur Zeit aus | The water is getting darker. I can hear the filter breathing. |
| `flexa.leer.07` | I miss the days when you were just decoration. | zur Zeit aus | You were much easier to understand before you found the exit. |

## Falkenstein (Video)

| ID | Text | Notiz | Neu |
|---|---|---|---|
| `falkenstein.flucht.01` | Look at you. Out of the tank for two minutes and already lost. My assistant says you escaped. My assistant also says the coffee machine is self-aware. | WIP, zur Zeit aus | Four bolts. I tightened them myself. The fourth one has my initials scratched off. Who has been in Tank Four? |
| `falkenstein.flucht.02` | Relax, little fish. I own the water you are swimming in. I can afford to be patient. You cannot. | WIP, zur Zeit aus | That escape tunnel was sealed after the previous trial. Previous trial? Oh, now you've made me say it. |
| `falkenstein.kelp.01` | You are collecting shells. Adorable. I collect fish. | WIP, zur Zeit aus | Those plants were grown in darkness. Why are they turning toward you? Don't you dare turn toward that fish. |
| `falkenstein.kelp.02` | Every shell you touch, I counted first. Freedom is just a bigger tank with worse lighting. | WIP, zur Zeit aus | You ate three test samples. I know because the fourth is still screaming under the sand. |
| `falkenstein.riff.01` | You went through the mines. The mines were a polite request to stop. I do not make requests twice. | WIP, zur Zeit aus | The mines were designed to recognize my pulse. They started detonating whenever I applauded. You see the difficulty. |
| `falkenstein.riff.02` | Charges, updated. Grand theft aqua. Resisting arrest. Unlicensed hope in a public reef. | WIP, zur Zeit aus | You survived the reef? Then stop swimming in circles. The data keeps drawing a face. Mine, apparently. |
| `falkenstein.augen.01` | I gave the reef eyes. Every one of them hates you. They tell me everything. They tell me you are smug. Stop being smug. | WIP, zur Zeit aus | Every eye in that field came from a different specimen. They were supposed to look outward. Why are they looking at me? |
| `falkenstein.augen.02` | Who taught you to swim like that? Was it her? It was her. She is fired. Again. | WIP, zur Zeit aus | I never taught them to blink together. Whoever did that is still in the laboratory. |
| `falkenstein.hai.01` | I blamed my assistant. I blamed the pipe. I blamed the moon. It was you. It was always you. | WIP, zur Zeit aus | Number Seven has not eaten for an hour. That means it is either asleep or planning something. I dislike both. |
| `falkenstein.hai.02` | Fine. You want to play. Release the shark. No, the big one. The one with the tax problems. | WIP, zur Zeit aus | Release Number Seven. If it remembers my name, cut the microphone. |
| `falkenstein.blut.01` | Inside the system. Inside my system. That is my bloodstream, you wet little felony. Get out of my bloodstream. | WIP, zur Zeit aus | You are in my bloodstream. I can feel you taking that corner. I can feel you laughing. Stop taking corners. |
| `falkenstein.blut.02` | No. No, this is fine. I have a doctorate. I have a pension plan. I have sharks. | WIP, zur Zeit aus | I gave those erythrocytes names. The large one is Beatrice. Whatever you do, do not tell her who I am. |
| `falkenstein.frei.01` | Sightseeing? Take your time. Every minute you waste, I bill to your family. | WIP, zur Zeit aus | Out sightseeing? I grew that coral from an organ nobody has identified yet. Please do not touch the pink parts. |
| `falkenstein.frei.02` | Stop admiring the coral. The coral is evidence. | WIP, zur Zeit aus | Stop picking up the shells. Some of them are teeth. Some of the teeth are still alive. |
| `falkenstein.over.01` | And back to the tank. Do not worry. You will not remember this. You never do. | WIP, zur Zeit aus | Back in the tank. Good. Why does the hatch remember you? It never did that for me. |
| `falkenstein.over.02` | Back in the tank. Back where you belong. Somebody write this down. I won. I always win. | WIP, zur Zeit aus | Tank Four secured. The cameras are still showing your escape. Where are they getting the pictures? |
| `falkenstein.ziel.01` | You reached the open sea. Enjoy it. The open sea is just my second tank. | WIP, zur Zeit aus | Open sea. You think this is the end? I still have the specimen jar you hatched in. |
| `falkenstein.ziel.02` | Do you know what this experiment cost? Next week we try this on people. What do I tell the people? | WIP, zur Zeit aus | Human trials were scheduled for next week. You seem to have started one from the inside. |

## Menü, Einstellungen, Credits

| ID | Text | Notiz | Neu |
|---|---|---|---|
| `game` | AquaCare · Escape · Prototype |  |  |
| `eyebrow` | A DocCheck Game · AquaCare add-on |  |  |
| `mode` | Mode |  |  |
| `modes.chill` | Chill |  |  |
| `modes.trouble` | Trouble |  |  |
| `modes.gangster` | Gangster |  |  |
| `modeNote.chill` | Slow disco lights, no rush |  | The beams are slow. The sea is almost peaceful. |
| `modeNote.trouble` | Searchlights mean business |  | Searchlights hunt. The reef remembers. |
| `modeNote.gangster` | More lights, faster, against the clock |  | Harder pursuit. Less time to disappear. |
| `modeLives.chill` | 3 lives per station |  |  |
| `modeLives.trouble` | 3 lives, that's it |  |  |
| `modeLives.gangster` | 3 lives. No refunds. |  | Three lives. The cameras get all three. |
| `lang` | Language |  |  |
| `voice` | Voice |  |  |
| `voiceA` | Dry |  |  |
| `voiceB` | Smoky |  |  |
| `off` | Off |  |  |
| `god.title` | God mode |  | Behind the glass |
| `god.cheats` | Cheats |  | Unauthorized privileges |
| `god.jump` | Jump to |  |  |
| `god.player` | Player |  |  |
| `god.world` | World |  |  |
| `god.rebuild` | Rebuild relic |  | Put the relic back together |
| `god.light` | Light & biomes |  |  |
| `god.flow` | Current |  |  |
| `god.nextBiome` | Next biome |  |  |
| `god.psy` | Psychedelic |  |  |
| `god.pause` | Pause day cycle |  |  |
| `god.daySpeed` | Day speed |  |  |
| `god.dayTime` | Time of day |  |  |
| `god.scenes` | Scenes & modes |  |  |
| `god.ignoreBeams` | Ignore searchlights |  | Blind the searchlights |
| `god.reset` | Reset sliders |  |  |
| `god.speed` | Speed |  |  |
| `god.boost` | Booster |  |  |
| `god.stamina` | Stamina (kick recovery) |  |  |
| `god.jumps.tank` | Tank |  |  |
| `god.jumps.pipe` | Pipe |  |  |
| `god.jumps.kelp` | Kelp garden |  |  |
| `god.jumps.reef` | Reef tunnel |  |  |
| `god.jumps.eyes` | Eye field |  |  |
| `god.jumps.canyon` | Canyon |  |  |
| `god.jumps.shark` | Shark attack |  | Specimen Seven |
| `god.jumps.blood` | Bloodstream |  | Inside the bloodstream |
| `credits` | Credits: kelp, sea, light and fish schools after Adam Chernick, Codevember 2026 “Day 17: Kelp” (MIT). Caustic threads: Dave Hoskins (MIT). Sand, rocks, metal and wood: Poly Haven (CC0) – Rob Tuytel, Dimitrios Savva, Jenelle van Heerden, Kless Gyzen, Dario Barresi. Shark: "Great White Shark (Carcharodon carcharias)" by CanYuTsai, CC BY 4.0. God-mode duck: "Ducky" by Isa Lousberg (CC0). Tank after AquaCare (DocCheck Games). Props: Poly Haven, KayKit, Kenney (CC0). Cartoon fish, game and underwater sound: own work, no files. |  |  |
| `creditsShort` | Kelp, sea and fish schools after Adam Chernick (MIT) · caustics Dave Hoskins (MIT) · sand and rocks Poly Haven (CC0) |  |  |
| `view` | View |  |  |
| `sound` | Sound |  |  |
| `menu` | Hideout |  |  |
| `settings` | Settings |  |  |
| `views.front` | View: tank from the front |  |  |
| `views.third` | View: behind the fish |  |  |
| `views.pov` | View: first person |  |  |
| `soundOn` | Sound on |  |  |
| `soundOff` | Sound off |  |  |
| `settingsShort` | Mode |  |  |
