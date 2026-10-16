'use client';
import {useEffect,useState} from 'react';
import {localHash,testSummary} from '../lib/links';
type Build={sha:string;commit:string;date:string;notes:string;tests:any;links:Record<string,string|null>;entry:string;bytes:number};
export default function Home(){
 const [data,setData]=useState<any>({builds:[]});const [selected,setSelected]=useState('');const [busy,setBusy]=useState(true);const [game,setGame]=useState('');const [opened,setOpened]=useState(false);
 async function refresh(backfill=false){try{const r=await fetch('/api/status'+(backfill?'?history=1':''),{cache:'no-store'});const d=await r.json();setData(d);if(!backfill&&d.builds?.length<5)void fetch('/api/status?history=1').then(r=>r.json()).then(setData).catch(()=>{});}catch{setData((d:any)=>({...d,error:'Verbindung unterbrochen. Archiv bleibt verfügbar.'}))}finally{setBusy(false)}}
 useEffect(()=>{void refresh();const timer=setInterval(()=>void refresh(),15000);return()=>clearInterval(timer)},[]);
 const builds:Build[]=data.builds||[];const b=builds.find(x=>x.sha===selected)||builds[0];
 function launch(key:string){const hash=localHash(b?.links[key]);if(!hash)return;setOpened(false);setGame('/build/'+b.sha+'/'+b.entry+hash)}
 return <main><header><a className="wordmark" href="/">KFB <span>WS1 / STAGING</span></a><span className="private">Privater Testraum</span></header>
 <section className="intro"><p className="eyebrow">WSA · R1 · GPT-ZIELPLATTFORM</p><h1>Der neueste Stand.<br/><em>Direkt ins Spiel.</em></h1><p>Geprüfte WS1-Bündel, unverändert ausgeliefert. Neue Stände werden automatisch erkannt.</p></section>
 <section className="desk"><div className="live"><span className={'dot '+(data.error?'warn':'')}/>{busy?'WS1 wird abgerufen …':data.error?'Rückfall / Verbindung prüfen':'Mit WS1 verbunden'}<button className="refresh" onClick={()=>void refresh()}>Jetzt prüfen ↻</button></div>
 {data.error&&<p className="alert" role="status">{data.error}{builds.length?' · Letzter gesicherter Stand bleibt startbar.':''}</p>}
 {b?<><div className="buildtitle"><div><p className="eyebrow">{b.sha===builds[0]?.sha?'NEUESTER GESICHERTER STAND':'ARCHIVSTAND'}</p><h2>{b.commit}</h2></div><span className="tests">{testSummary(b.tests)?.passed}/{testSummary(b.tests)?.total} Tests</span></div><p className="note">{b.notes}</p><div className="meta"><time>{new Date(b.date).toLocaleString('de-DE')}</time><code>{b.sha.slice(0,12)}</code><span>{(b.bytes/1e6).toFixed(1)} MB</span></div>
 <nav className="starts" aria-label="Spiel starten">{[['stage','Bühne','01'],['m1','M1','02'],['car','Fahrprobe','03'],['lineup','Lineup','04']].map(([key,label,n])=><button key={key} disabled={!localHash(b.links[key])} onClick={()=>launch(key)}><small>{n}</small><strong>{label} ↗</strong><span>{localHash(b.links[key])?'Stand starten':'Noch nicht verfügbar'}</span></button>)}</nav>
 <label className="archive">Gesicherte Stände <select value={b.sha} onChange={e=>setSelected(e.target.value)}>{builds.map((v,i)=><option key={v.sha} value={v.sha}>{i===0?'Aktuell · ':''}{new Date(v.date).toLocaleString('de-DE')} · {v.sha.slice(0,8)}</option>)}</select><span>{builds.length}/5 verfügbar</span></label></>:<p className="empty">{busy?'Das geprüfte Originalbündel wird im Archiv gesichert.':'Noch kein geprüfter Stand verfügbar. Erneut prüfen, sobald WS1 erreichbar ist.'}</p>}
 </section>
 {game&&<section className="play"><div className="playbar"><h2>WS1 · Originalbündel</h2><a href={game} target="_blank" rel="noreferrer">In eigenem Tab öffnen ↗</a><button onClick={()=>{setGame('');setOpened(false)}}>Schließen ×</button></div>{!opened&&<p role="status">Bündel wird geöffnet. Die Spielszenen laden ihre Original-Assets nach.</p>}<iframe key={game} src={game} title="WS1 Spielstand" allow="fullscreen; autoplay; gamepad" onLoad={()=>setOpened(true)}/></section>}
 <footer><span>Quelle: georg-doc/kayfabizarro · ws1/preview</span><span>Prüfung alle 15 Sekunden · laufendes Spiel bleibt geöffnet</span></footer></main>
}
