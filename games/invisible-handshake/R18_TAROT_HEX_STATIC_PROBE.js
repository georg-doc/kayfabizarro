function runR18(){
  const check=(v,m)=>{if(!v)throw Error(m)};
  const positions=[1,2,3,4,5,6,7], outer=[1,2,3,5,6,7], center=4;
  const perimeter=[1,3,6,7,5,2];
  const names=["THE LEAK","THE BELL","THE OFFICIAL DENIAL","THE NATIONAL EMERGENCY","THE ELIGIBILITY DESK","THE SAFETY ADVISORY","THE AFTERCARE DIVIDEND"];
  check(new Set(positions).size===7 && new Set(outer).size===6 && !outer.includes(center),"seven positions");
  check(new Set(perimeter).size===6 && perimeter.every(x=>outer.includes(x)),"hex perimeter");
  check(names.length===7 && new Set(names).size===7,"seven proxy titles");
  check(6+50===56,"56 card product");
  let states=0,moves=0,swaps=0,relocations=0,centerDiceViolations=0,cardLedgers=0;
  const counts={};
  for(let humans=2;humans<=6;humans++){
    const stock=43-3*humans;
    check(stock>=0 && 6+1+3*humans+stock===50,"opening stock conservation");
    check(5+1+3*humans+stock+1===50,"outer trophy/discard conservation");
    check(5+0+3*humans+stock+2===50,"optional Focus capture conservation");
    check(5+1+3*humans+(stock-1)+2===50,"optional Focus refill conservation");
    cardLedgers+=4;
    let nStates=0,actorStates=0,rewardEligible=0;
    for(const hate of outer)for(const fear of outer)for(const hope of outer){
      if(hate===fear || fear===hope || hate===hope)continue;
      const dice=[hate,fear,hope];
      if(dice.includes(center))centerDiceViolations++;
      nStates++;states++;
      for(let i=0;i<3;i++){
        const vacancies=outer.filter(x=>!dice.includes(x));
        check(vacancies.length===3,"three legal moves");
        for(const to of vacancies){
          const changed=dice.slice();changed[i]=to;
          check(new Set(changed).size===3 && !changed.includes(center),"legal move");
          moves++;
        }
        const survivors=dice.filter((_,index)=>index!==i);
        const legalAfterRemoval=outer.filter(x=>x!==dice[i]&&!survivors.includes(x));
        check(legalAfterRemoval.length===3,"legal post-removal relocation");
        relocations++;
      }
      for(let i=0;i<3;i++)for(let j=i+1;j<3;j++){
        const changed=dice.slice();[changed[i],changed[j]]=[changed[j],changed[i]];
        check(new Set(changed).size===3,"legal swap");
        swaps++;
      }
      const hopeIndex=outer.indexOf(hope);
      for(let actor=0;actor<humans;actor++){
        actorStates++;
        if(hopeIndex<humans && hopeIndex!==actor)rewardEligible++;
      }
    }
    check(nStates===120,"120 placements per n");
    check(rewardEligible*6===actorStates*(humans-1),"R17B fraction");
    counts[humans]={humans,npc:6-humans,stock,diePlacements:nStates,actorPlacements:actorStates,optionalR17BEligible:rewardEligible,optionalR17BTotal:actorStates};
  }
  check(states===600 && moves===5400 && swaps===1800 && relocations===1800,"geometry counters");
  check(centerDiceViolations===0 && cardLedgers===20,"dice off center");
  let seatAssignments=0;
  const visit=(a)=>{
    if(a.length===6){check(new Set(a).size===6,"unique six seats");seatAssignments++;return;}
    for(let i=0;i<6;i++)if(!a.includes(i))visit([...a,i]);
  };
  visit([]);
  check(seatAssignments===720,"seat permutations");
  const fixture={hate:{slot:1,face:6},fear:{slot:2,face:4},hope:{slot:6,face:3},focus:4,actor:2};
  check(fixture.hate.face+1===7 && fixture.hope.slot!==fixture.actor,"2H collapse fixture");
  check(outer.includes(7)&&![1,2,6].includes(7),"6H move fixture");
  return {status:"PASS_STATIC_ONLY",playerCounts:5,diePlacementStates:states,legalMoves:moves,legalSwaps:swaps,legalPostCollapseRelocations:relocations,perimeterFactions:6,focusCards:1,seatPermutations:seatAssignments,cardConservationLedgers:cardLedgers,centerDiceViolations,byPlayers:counts,humanPlaytests:0,fullGames:0};
}
console.log(JSON.stringify(runR18(), null, 2));
