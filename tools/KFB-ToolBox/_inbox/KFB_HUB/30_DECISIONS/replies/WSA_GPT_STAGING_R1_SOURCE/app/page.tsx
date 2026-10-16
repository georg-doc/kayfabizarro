'use client';
import {useEffect,useState} from 'react';
import {localHash,testSummary} from '../lib/links';
type Build={sha:string;commit:string;date:string;notes:string;tests:any;links:Record<string,string|null>;entry:string;bytes:number};
type Scene={key:string;sha:string;url:string};
const modes=[['stage','Bühne'],['m1','M1'],['car','Fahrprobe'],['lineup','Lineup']];
export default function Home(){
 const [data,setData]=useState<any>({builds:[]});const [selected,setSelected]=useState('');const [busy,setBusy]=useState(true);const [scene,setScene]=useState<Scene|null>(null);const [opened,setOpened]=useState(false);const [panel,setPanel]=useState(true);const [panelTab,setPanelTab]=useState('stand');
 async function refresh(backfill=false){try{const r=await fetch('/api/status'+(backfill?'?history=1':''),{cache:'no-store'});const d=await r.json();setData(d);if(!backfill&&d.builds?.length&&d.historyChecked!==d.builds[0].sha)void fetch('/api/status?history=1').then(r=>r.json()).then(setData).catch(()=>{});}catch{setData((d:any)=>({...d,error:'Verbindung unterbrochen. Archiv bleibt verfügbar.'}))}finally{setBusy(false)}}
 useEffect(()=>{void refresh();const timer=setInterval(()=>void refresh(),15000);return()=>clearInterval(timer)},[]);
 const builds:Build[]=data.builds||[];const b=builds.find(x=>x.sha===selected)||builds[0];
 function launch(key:string,build=b){const hash=localHash(build?.links[key]);if(!hash)return;setOpened(false);setScene({key,sha:build.sha,url:'/build/'+build.sha+'/'+build.entry+hash})}
 useEffect(()=>{if(b&&!scene)launch('stage',b)},[b?.sha]);
 function choose(sha:string){setSelected(sha===builds[0]?.sha?'':sha);const next=builds.find(v=>v.sha===sha);if(next)launch(localHash(next.links[scene?.key||'stage'])?scene?.key||'stage':'stage',next)}
 const summary=b?testSummary(b.tests):null;const newer=b&&scene&&b.sha!==scene.sha;
 return <main className="workspace">
 <header className="topbar"><a className="brand" href="https://kfb-toolbox.frizzlebob.chatgpt.site/">KFB ToolBox</a><span className="product">WS1 Staging</span>
 <nav className="tabs" aria-label="Spiel starten">{modes.map(([key,label])=><button key={key} className={scene?.key===key?'active':''} aria-pressed={scene?.key===key} disabled={!b||!localHash(b.links[key])} title={b&&!localHash(b.links[key])?'Noch nicht verfügbar':label+' starten'} onClick={()=>launch(key)}>{label}</button>)}</nav>
 <span className="bar-spacer"/><span className="connection" role="status"><i className={data.error?'error':''}/><span>{busy?'Lädt …':data.error?'Rückfall':newer?'Neuer Stand verfügbar':'Verbunden'}</span></span>
 <button className={'icon-button '+(panel?'pressed':'')} aria-label={panel?'Inspektor ausblenden':'Inspektor einblenden'} aria-expanded={panel} onClick={()=>setPanel(v=>!v)}>▥</button><button className="primary check" onClick={()=>void refresh()}>Stand prüfen</button></header>
 <div className={'workarea '+(!panel?'wide':'')}>
 <section className="viewport" aria-label="WS1 Vorschau">
 <div className="view-tools"><span>{modes.find(([key])=>key===scene?.key)?.[1]||'Vorschau'}</span><span className="tool-divider"/><span className="mono">{scene?.sha.slice(0,8)||'—'}</span>{scene&&<><span className="tool-divider"/><a href={scene.url} target="_blank" rel="noreferrer">Eigener Tab ↗</a><button className="fullscreen" title="Vorschau vergrößern" onClick={()=>setPanel(v=>!v)}>⤢</button></>}</div>
 {scene?<iframe key={scene.url} src={scene.url} title="WS1 Spielstand" allow="fullscreen; autoplay; gamepad" onLoad={()=>setOpened(true)}/>:<div className="empty"><h1>WS1 Staging</h1><p>{busy?'Der neueste geprüfte Stand wird gesichert.':'Noch kein geprüfter Stand verfügbar.'}</p></div>}
 {scene&&!opened&&<div className="loading" role="status">Originalbündel wird geöffnet …</div>}
 {data.error&&<div className="source-error" role="alert">{data.error}{builds.length?' · Der letzte gesicherte Stand bleibt startbar.':''}</div>}
 </section>
 {panel&&<aside className="inspector" aria-label="Stand und Archiv"><nav className="panel-tabs" aria-label="Inspektor"><button className={panelTab==='stand'?'active':''} onClick={()=>setPanelTab('stand')}>Stand</button><button className={panelTab==='archiv'?'active':''} onClick={()=>setPanelTab('archiv')}>Archiv <span className="mono">{builds.length}/5</span></button></nav>
 <div className="panel-scroll">{b&&panelTab==='stand'?<><section className="panel-section"><div className="section-label">{b.sha===builds[0]?.sha?'Aktueller Stand':'Archivstand'}<span className="test-result mono">{summary?.passed}/{summary?.total} Tests</span></div><h1>{b.commit}</h1><dl><div><dt>Datum</dt><dd>{new Date(b.date).toLocaleString('de-DE')}</dd></div><div><dt>Revision</dt><dd className="mono">{b.sha.slice(0,12)}</dd></div><div><dt>Bündel</dt><dd className="mono">{(b.bytes/1e6).toFixed(1)} MB</dd></div></dl></section>
 <section className="panel-section"><h2>Was neu ist</h2><p>{b.notes}</p></section>
 <section className="panel-section"><h2>Vorschau</h2><div className="mode-list">{modes.map(([key,label])=><div key={key}><span>{label}</span>{localHash(b.links[key])?<button onClick={()=>launch(key)}>Öffnen ↗</button>:<span className="unavailable">Noch nicht verfügbar</span>}</div>)}</div>{newer&&<button className="primary open-latest" onClick={()=>launch(scene.key)}>Ausgewählten Stand öffnen</button>}</section>
 <section className="panel-section"><label htmlFor="build-picker">Gesicherte Stände</label><select id="build-picker" value={b.sha} onChange={e=>choose(e.target.value)}>{builds.map((v,i)=><option key={v.sha} value={v.sha}>{i===0?'Aktuell · ':''}{new Date(v.date).toLocaleString('de-DE')} · {v.sha.slice(0,8)}</option>)}</select></section></>:panelTab==='archiv'?<section className="panel-section archive"><h2>Gesicherte Stände</h2><p>Die letzten fünf geprüften Bündel. Aktuell {builds.length} verfügbar.</p>{builds.map((v,i)=><button className={'archive-item '+(b?.sha===v.sha?'selected':'')} key={v.sha} onClick={()=>choose(v.sha)}><span>{i===0?'Aktuell':'Archiv'} · {new Date(v.date).toLocaleString('de-DE')}</span><strong>{v.commit}</strong><span className="mono">{v.sha.slice(0,12)} <span>↗</span></span></button>)}</section>:<p className="panel-section muted">WS1 wird abgerufen …</p>}</div>
 <div className="panel-foot"><span className="mono">ws1/preview</span><span>Privater Testraum</span></div></aside>}
 </div>
 <footer className="statusbar"><span className="mono">WS1 · {scene?.sha.slice(0,12)||'Stand wird geladen'}</span><span>Automatische Prüfung alle 15 s</span><a href="https://kfb-toolbox.frizzlebob.chatgpt.site/">← ToolBox</a></footer>
 </main>
}
