# R11 · Directed Fear/Hope/Hate, sweetspot and two-sided breaks

Concept test only; existing owner games/invisible-handshake, PR475. No Site/runtime change. R09 remains obsolete teachingprototype relative to new concept.

## Exact candidate
Six factions each have one signature slot, one chip and three value-free handcards conceptually. Three shared emotiondice carry location (faction0..5) and strength1..6. One actionroll/turn:1 Fearmove;2 Fear±1;3 Hopemove;4 Hope±1;5 Hatemove;6 Hate±1. Odd moves mandatory to a different slot, preserves value; even chooses±1 including deliberate overflow. Card narration doesnotcondition legalactions. Hands/cards are not modeled in numericstress test because they carry no effects. This is a material limit: engine tests tokens,not narrativegame.

Common eligibility: ownslot contains at leastoneemotion3..5 and noemotionat1or6 (all other dice there2..5). Anyemotion qualifies, not justHope. MediumFear/Hate can be appropriated as deterrence or persecutionstory; no statement about realpublicpsychology. Multipleemotions are conjunction only, no addition/subtraction. Hope5+Hate4 qualifies; Hope6+Hate4 doesnot. Endturn eligibleactorplaceschip. Any interveningactionmakingeligibilityfalse immediatelyremoveschip; returning toeligiblelaterdoesnotrestoreit. Startnextownturn survivingchipwins exactslotcard; refillslot, emotionsremainlocation/value. Endturnmayclaimreplacementagain.

Below1 orabove6: discard currenttargetsignaturecard, no trophy; removeitschip; refill; reset onlytriggerdie3 on sameslot. Otherdice stay. This causes no cascades. Boundaryresetcanhelptarget; it destroys oldclaim but createsneweligibleposition. Do not claim everybreakhurts targetlongterm.

## Runs
1200 runs,400 seeds perpolicy,18 rounds(108actoractions), sixactors. Fixedinitialdice Fear3slot0,Hope3slot2,Hate3slot4; rolluniform1..6. Randompolicy chooseslegalactionrandomly. Buildheuristic prioritizes owneligibility(3), destroyedrivalclaims(1), ownmidrangedice(.1). Denyweightsdestroyedclaims4. These twoheuristics producedidenticalaggregates/checkedoutcomes here: NOT diverseindependentstrategic evidence. Seedsrepeatacrosspolicies, but randomactionselectionconsumesadditionalRNGdraws: subsequentrollsequencesarenotpaired acrossrandomvsheuristic. No causalstrategycomparison. No rotatedseat/setup, optimalplay, finite50cards, humanimprov orfull2–6test.

Random:1.4725 trophies/player over18turns,0/400 tablezero games. Build/deny(each):0.8116667/player,8/400 tablezero games. Mostplayersscoreverylittle; randomdoingbetterthanheuristicsdoesnotprove randomoptimal. Fixedstartcanbiasearlyseats. Some legal infinite nonwinningsequences stillpossible; randomness doesnotguarantee payoutwithinboundedtime.

Five asserted boundaries/continuity checks: low0 resets3andrefills; high7 resets3andrefills;4→3claimsurvives;3→2claimbreaks;2→3doesnotreviveclaim. Reviewer supplements separate tests. Lastturnclaims arecensored, max17 payouts. Infinite replacementcardidentities(nofinite supply) permit valuesnotinterpretableasfull56carddeck outcomes.

## Constructed18turn example
example.py/json (predeterminedrolls/actions, NOT randomobservational trace). InitialFear4Technocracy,Hope5FourthReich/TheBell,Hate4Illuminati. First6:TechnocracystealsHope5;RoundTabletakesFear4;FourthReichtakesHope5back;IlluminatiraisesHope6breakingBellclaim;HolyEmpireraisesHope7discardingBell/reset3;AlienstakeHate4. Next6:TechlowersHate3;RoundTablecashesitsFear4cardthenlowersHate2breakingAlienclaim;FourthlowersHope2;IlluminatilowersHate1;HolyEmpirelowersHate0discardingAliensignature/reset3;AliensmoveFear4tothemselvesbreakingRoundTableclaimandclaimnewcard. Third6:Hope2goesTech;Fear4→3onAliens;Hope2→3onTech(noautomaticclaim);Hope3movesIlluminati;Fear3→4onAliens;AlienscashnewsignaturethenHate3→4. Exacttrophiesturn8RoundTable,turn18Aliens; Bellneverwon,itwasdiscardedturn5.

## Conclusion
Spatial emotionassignment producesreadable reversals; low2alreadybreaksmediumclaim, low0replacesstory; high6breaksclaim, high7replacesstory. Thresholdasymmetry is explicit3..5candidate, not naturalpsychology. Multiemotion valuesdon't cancel. Three dice vs sixactorsand5interveningturnsmakesholdingpunishing. No extra mechanismapproved. Nextdecision: shortenholdingperiod OR looseneligibility (onechangeatime) beforeUIimplementation; do notdecorateunprovenloop. Existing scenario/candidateis persisted, notbalancedgame.
