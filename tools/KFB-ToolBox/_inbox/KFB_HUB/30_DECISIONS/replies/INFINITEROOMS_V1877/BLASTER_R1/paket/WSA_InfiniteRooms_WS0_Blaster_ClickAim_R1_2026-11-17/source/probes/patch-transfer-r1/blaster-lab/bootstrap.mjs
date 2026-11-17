import{showGraphicsRecovery}from'../graphics-start.mjs';
const u=new URL(location.href);for(const[k,v]of[['fx','r2'],['blasterref','r1']])if(!u.searchParams.has(k))u.searchParams.set(k,v);if(!u.hash)u.hash='haltung=r1';history.replaceState(null,'',u);
import('./main.mjs').catch(e=>{document.querySelector('#message').textContent='Start fehlgeschlagen';showGraphicsRecovery(e);});
