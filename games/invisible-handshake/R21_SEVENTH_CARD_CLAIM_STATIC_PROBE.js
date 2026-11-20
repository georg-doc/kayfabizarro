// R21 one-die triplet / unique-match static check. Structural-only, not a game simulation.
function probeR21() {
  const assert=(p,message)=>{if(!p)throw Error(message)};
  const canonModes=["Tragic","Comic","Absurd","Heroic","Mystical","Forbidden"];
  assert(canonModes.length===6 && new Set(canonModes).size===6,"canonical mode count");
  const roles=["PROBLEM","REACTION","SOLUTION"];
  const marks=["circle","triangle","diamond"];
  let all=0,claims=0;const winners=[0,0,0];const freq={0:0,1:0,2:0,3:0};
  for(const a of marks)for(const b of marks)for(const c of marks){
    const arr=[a,b,c];const matched=arr.map((m,i)=>m==="circle"?i:-1).filter(i=>i>=0);
    all++;freq[matched.length]++;
    if(matched.length===1){claims++;winners[matched[0]]++}
  }
  assert(all===27,"27 triplets");
  assert(claims===12,"12 uniquely matched");
  assert(winners.every(n=>n===4),"one unique win per position 4/27");
  assert(freq[0]===8 && freq[1]===12 && freq[2]===6 && freq[3]===1,"match histogram 8/12/6/1");
  let supplies=[];
  for(let n=2;n<=6;n++){const stock=49-5*n;assert(stock>=0 && n*5+1+stock===50,"card conservation n="+n);supplies.push({humans:n,hand:5*n,focus:1,stock});}
  const seatLock={};
  for(const n of [2,3,4,5,6]){
    const thirdSeats=new Array(n).fill(0);
    for(let turn=0;turn<n*3;turn++){if(turn%3===2)thirdSeats[turn%n]++;}
    seatLock[n]=thirdSeats;
  }
  assert(seatLock[3].join(",")==="0,0,3","3-player auto-solver win seat lock");
  assert(seatLock[6].join(",")==="0,0,3,0,0,3","6-player auto-solver win seat lock");
  const example=["diamond","circle","triangle"];
  const winRole=example.findIndex(m=>m==="circle");
  assert(winRole===1 && roles[winRole]==="REACTION","worked example resolves Reaction");
  assert(roles.length===3 && marks.length===3,"beat/mark size");
  // Card invariant after one solved episode: initial stock->stock-1,
  // hand->hand-3, outer three, focus unchanged, trophy 1.
  for(const row of supplies){
    const after=row.hand-3+3+1+1+(row.stock-1);
    assert(after===50,"conservation after claim n="+row.humans);
  }
  return {status:"PASS_STATIC",scenarioSpace:27,uniqueClaims:claims,perPositionWins:winners,matchCountHistogram:freq,setupLedgers:supplies.length,claimLedgers:supplies.length,seatLock,storyModes:canonModes,playedGames:0,humanTests:0};
}
console.log(JSON.stringify(probeR21(),null,2));
