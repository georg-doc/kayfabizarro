import{newGame,legal,apply,invariant}from'./engine.js';
export function lessonState(cards){const s=newGame(cards,{count:2,seed:475});const wanted=['The Compute Chokepoint','The Peer Review Gate','The Front Foundation','The Behavioral Operations Unit'].map(t=>cards.find(c=>c.title===t).id);s.market=wanted;s.supply=cards.map(c=>c.id).filter(id=>!wanted.includes(id));if(s.players[0].plot.type!==3){let i=s.plots.findIndex(p=>p.type===3);[s.players[0].plot,s.plots[i]]=[s.plots[i],s.players[0].plot]}s.players[0].name='You';s.players[1].name='The Committee';invariant(s);return s;}
export function lessonRecruit(s){return apply(s,legal(s).find(a=>a.type==='recruit'&&a.index===0));}
export function prepareFrame(s){let t=s;while(t.active!==0)t=apply(t,{type:'pass'});return t;}
export function lessonFrame(s){return legal(s).find(a=>a.type==='frame'&&a.move.kind==='rotate'&&a.move.index===1&&a.move.delta===1&&a.index===1);}
