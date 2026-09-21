/* KFB Overworld — Asset Browser 2D (ab-v2.0, V5-S3)
   Erst sehen, dann verbauen. Der Browser liest den echten Repo-Baum (`overworld/repo-tree.js`),
   den Katalog als Index (`2d-catalog.json`) und legt zu jedem Blatt die GEMESSENEN Zahlen daneben
   (`overworld/sheet-probe.js` + `OW_LOADER` — dieselbe Messung, die das Spiel benutzt).

   Was sich mit v2 ändert (Georgs Befund am laufenden v1): ein Sicht-Werkzeug darf nicht selbst laut
   sein. Die Tiny-Swords-Deko stand vor den Assets, das Schachbrett machte Schatten unlesbar, und die
   Navigation zwang zum Lesen der Krümelspur.
     1. **Zwei Themes, Studio ist Standard.** Studio = neutral, viel Weißraum, ein Akzent, Assets
        sind das einzige Bunte. Papier (`theme="paper"`) bleibt als Interface-Experiment.
     2. **Drei Stufen statt Raten:** Pack-Leiste links · Unterordner als Chips oben · Assets in der
        Mitte. Ordnerketten mit nur einem Kind werden gefaltet.
     3. **Ordner zeigen, was drin ist:** gestapelte Vorschau aus bis zu drei Assets.
     4. **Bühnengrund umschaltbar** (hell · mittel · dunkel · Schachbrett) — Schatten sind gegen
        Pseudo-Transparenz nicht beurteilbar. Standard: mittelgrau.
   UI-Sprache ist Englisch (wie das Spiel), Kommentare bleiben deutsch. */
(function(){
'use strict';
const S=window.OW_SRC;
if(!S)console.error('[browser] asset-source.js fehlt — es gibt keine Quelle');
const CATALOG_URL=S?S.a3d('CATALOG/2d-catalog.json'):'';
const BASE_FALLBACK=S?S.a2d(''):'';   // Quelle: overworld/asset-source.js
const MAX_CARDS=400;

/* Dateiname → Animationsschlüssel des Katalogs. Nur was belegt ist; der Rest bleibt roh stehen. */
const SUFFIX=[[/idle/i,'idle'],[/run|walk|bouncing/i,'run'],[/attack\s*strong|attack2/i,'attack2'],
  [/attack|throw|shoot|slash/i,'attack'],[/guard_in/i,'guardIn'],[/guard_out/i,'guardOut'],
  [/guard/i,'guard'],[/hit/i,'hit'],[/dead|death/i,'dead'],[/windup/i,'windup'],
  [/recovery/i,'recovery'],[/spell|cast/i,'cast'],[/row/i,'row'],[/swim/i,'swim']];
const PROJ=/projectile|arrow|bone|harpoon|bomb|ball/i;
const animKey=file=>{const n=file.replace(/\.[a-z]+$/i,'');
  for(const[re,k]of SUFFIX)if(re.test(n))return k;return null;};

const STAGE={light:['#f2f1ee','#e8e6e2'],mid:['#8f8f8c','#868683'],dark:['#1b1c1e','#212327'],
  checker:['#cfcdc8','#e6e4df']};

const LAYOUT=`
:host{position:fixed;inset:0;overflow:hidden;font-family:var(--font);color:var(--text);
  background:var(--bg);font-size:13px;-webkit-font-smoothing:antialiased;
  --font:system-ui,"Helvetica Neue",Helvetica,Arial,sans-serif;--mono:ui-monospace,SFMono-Regular,Menlo,monospace}
*{box-sizing:border-box}
button{font-family:inherit;font-size:12px;color:var(--text);background:transparent;
  border:1px solid var(--line);border-radius:6px;height:26px;padding:0 9px;cursor:pointer;
  white-space:nowrap;line-height:1}
button:hover{border-color:var(--line2);background:var(--hover)}
button.on{background:var(--accent);border-color:var(--accent);color:var(--onAccent)}
button[disabled]{opacity:.4;cursor:default}
button.ghost{border-color:transparent}
button.ghost:hover{border-color:var(--line)}
.app{display:grid;grid-template-columns:var(--rail,196px) minmax(0,1fr) var(--pw,0px);
  grid-template-rows:auto auto minmax(0,1fr);height:100%;transition:grid-template-columns .14s ease}
.app.p-open{--pw:min(44vw,420px)}
@media (max-width:1180px){.app{--rail:150px}}
@media (max-width:900px){.app{--rail:0px}.rail{display:none}.packsel{display:block}}
.packsel{display:none;height:28px;max-width:190px;flex:none}
.top{grid-area:1/1/2/4;display:flex;align-items:center;gap:12px;padding:10px 16px;
  border-bottom:1px solid var(--line);min-width:0}
.mark{font-size:12px;letter-spacing:.14em;color:var(--dim);flex:none;font-weight:500;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
@media (max-width:1080px){.mark{display:none}}
.q{flex:1;min-width:150px;max-width:340px;height:28px;padding:0 10px;border:1px solid var(--line);
  border-radius:6px;background:var(--field);color:var(--text);font:inherit;font-size:12.5px;outline:none}
.q::placeholder{color:var(--faint)}
.q:focus{border-color:var(--accent)}
.tools{display:flex;gap:6px;align-items:center;flex:none}
.count{font:12px/1.35 var(--mono);color:var(--dim);flex:0 1 auto;min-width:0;overflow:hidden;
  text-overflow:ellipsis;white-space:nowrap;font-variant-numeric:tabular-nums;text-align:right}
.rail{grid-area:2/1/4/2;border-right:1px solid var(--line);overflow-y:auto;padding:10px 8px 30px}
.rail .lbl{font-size:10px;letter-spacing:.12em;color:var(--faint);padding:6px 8px 4px;
  text-transform:uppercase}
.rail a{display:flex;justify-content:space-between;gap:8px;align-items:baseline;padding:5px 8px;
  border-radius:5px;cursor:pointer;color:var(--text);text-decoration:none;font-size:12.5px}
.rail a:hover{background:var(--hover)}
.rail a.on{background:var(--sel);color:var(--text);font-weight:500}
.rail a i{font:11px/1 var(--mono);color:var(--faint);font-style:normal;flex:none}
.rail a b{font-weight:inherit;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
select{font-family:inherit;font-size:11.5px;color:var(--text);background:var(--field);
  border:1px solid var(--line);border-radius:6px;height:26px;padding:0 4px;cursor:pointer}
.chips .lbl{font-size:10.5px;color:var(--faint);letter-spacing:.04em}
.chips{grid-area:2/2/3/3;display:flex;align-items:center;gap:6px;flex-wrap:wrap;
  padding:9px 16px;border-bottom:1px solid var(--line);min-height:44px}
.chips .sep{color:var(--faint);font-size:11px}
.chips .grow{flex:1}
main{grid-area:3/2/4/3;overflow-y:auto;padding:16px 16px 60px;min-width:0}
.grid{display:grid;gap:18px 14px;grid-template-columns:repeat(auto-fill,minmax(var(--tw,124px),1fr))}
.card{cursor:pointer;display:flex;flex-direction:column;gap:6px;background:none;border:0;padding:0}
.card .th{width:100%;aspect-ratio:1/1;border:1px solid var(--line);border-radius:7px;display:block;
  image-rendering:pixelated}
.card:hover .th{border-color:var(--line2)}
.card.on .th{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}
.card .cap{display:flex;justify-content:space-between;gap:6px;align-items:baseline;min-width:0}
.card .cap b{font-weight:400;font-size:11.5px;overflow:hidden;text-overflow:ellipsis;
  white-space:nowrap;color:var(--text)}
.card .cap i{font:10.5px/1 var(--mono);color:var(--faint);font-style:normal;flex:none}
.card .cap i.warn{color:var(--warn)}
.note{color:var(--dim);padding:34px 4px;font-size:12.5px;line-height:1.7;max-width:62ch}
.panel{grid-area:2/3/4/4;overflow:hidden;min-width:0}
.panel.on{border-left:1px solid var(--line)}
.pin{width:min(44vw,420px);height:100%;overflow-y:auto;padding:14px 16px 60px}
.pin .hd{display:flex;align-items:flex-start;gap:8px;margin-bottom:10px}
.pin h3{margin:0;font-size:13.5px;font-weight:500;line-height:1.35;word-break:break-word;flex:1}
.pin .path{font:10.5px/1.5 var(--mono);color:var(--faint);word-break:break-all;margin:2px 0 0}
.stage{position:relative;width:100%;aspect-ratio:4/3;border:1px solid var(--line);border-radius:8px;
  overflow:hidden;margin-bottom:8px}
.stage canvas{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated}
.bar{display:flex;align-items:center;gap:6px;margin-bottom:12px;flex-wrap:wrap}
.bar .fc{font:11px/1 var(--mono);color:var(--dim);font-variant-numeric:tabular-nums}
.bar .spacer{flex:1}
.sw{width:20px;height:20px;padding:0;border-radius:4px;border:1px solid var(--line)}
.sw.on{box-shadow:0 0 0 2px var(--accent)}
.rows{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:12px}
.rows button{height:24px;padding:0 8px;font:11px/1 var(--mono)}
.verdict{font-size:12.5px;line-height:1.5;margin:0 0 4px}
.verdict b{font-weight:500}
.why{font-size:11.5px;line-height:1.6;color:var(--dim);margin:0 0 14px}
table{width:100%;border-collapse:collapse;margin:0 0 14px}
td{padding:5px 0;border-bottom:1px solid var(--line);vertical-align:baseline;font-size:11.5px}
td.k{color:var(--dim);width:42%;padding-right:10px}
td.v{font-family:var(--mono);font-size:11px;line-height:1.5}
td.v.warn{color:var(--warn)}
.snip{font:10.5px/1.6 var(--mono);background:var(--field);border:1px solid var(--line);
  border-radius:7px;padding:9px 10px;white-space:pre-wrap;word-break:break-all;max-height:200px;
  overflow:auto;margin:0 0 10px;user-select:all;overscroll-behavior:contain}
.hint{font-size:11px;line-height:1.65;color:var(--faint);margin:0}
.hint code{font-family:var(--mono);font-size:10.5px}
.report{max-width:900px;padding:6px 0 40px}
.report h2{margin:0 0 8px;font-size:16px;font-weight:500}
.report p{font-size:12.5px;line-height:1.75;margin:0 0 16px;max-width:74ch;color:var(--text)}
.report p b.warn{color:var(--warn)}
.report table{font-size:11.5px}
.report table{font-size:11.5px;table-layout:auto}
.report th{text-align:left;font-weight:500;color:var(--dim);border-bottom:1px solid var(--line2);
  padding:5px 12px 5px 0;font-size:11px}
.report td{padding:5px 12px 5px 0}
.report td.n{text-align:right;font-family:var(--mono);font-variant-numeric:tabular-nums}
.report ul{margin:8px 0 0;padding-left:16px;font:10.5px/1.8 var(--mono);color:var(--dim)}
.kbd{font:10px/1 var(--mono);color:var(--faint);border:1px solid var(--line);border-radius:4px;
  padding:3px 5px}
`;
const STUDIO=`
:host{--bg:#fbfaf9;--field:#fff;--line:#e4e1dc;--line2:#c6c1b8;--hover:#f4f2ef;--sel:#eceae5;
  --text:#26241f;--dim:#6f6a61;--faint:#a29b90;
  --accent:oklch(0.55 0.12 250);--onAccent:#fff;--warn:oklch(0.55 0.16 32)}
`;
const PAPER=`
:host{--bg:#c9ad84;--field:#efe2c6;--line:#a68c62;--line2:#7d5c3b;--hover:#e2d1ad;--sel:#dcc39c;
  --text:#2a1f16;--dim:#5c4630;--faint:#8a7052;
  --accent:oklch(0.45 0.15 32);--onAccent:#fbf1da;--warn:oklch(0.42 0.17 30);
  --font:"Special Elite",ui-monospace,monospace;--mono:"Special Elite",ui-monospace,monospace}
.mark{font-family:"Irish Grover",cursive;letter-spacing:.02em;font-size:15px;color:var(--text)}
.card .th,.stage,.q,.snip{image-rendering:pixelated}
`;

const $=(r,s)=>r.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const slug=s=>s.replace(/\.[a-z]+$/i,'').replace(/[^A-Za-z0-9]+/g,'_').replace(/^_|_$/g,'').toLowerCase();
const tail=p=>p.split('/').pop();

class AssetBrowser2D extends HTMLElement{
  static get observedAttributes(){return['fps','thumb','alpha','theme','stage-bg'];}
  constructor(){
    super();
    this.sh=this.attachShadow({mode:'open'});
    this.items=[];this.folders=[];this.path=[];this.q='';this.view='files';this.diff=null;
    this.deep=true;this.sel=null;this.row=0;this.frame=0;this.playing=true;this.sort='name';
    this.show={grid:false,foot:true,box:false,shade:true};
    this.cacheM=new Map();this.queue=[];this.busy=0;
  }
  get fps(){return +this.getAttribute('fps')||10;}
  get thumb(){return +this.getAttribute('thumb')||124;}
  get alpha(){const a=+this.getAttribute('alpha');return a>0?a:8;}
  get theme(){return this.getAttribute('theme')==='paper'?'paper':'studio';}
  get stageBg(){return STAGE[this.getAttribute('stage-bg')]?this.getAttribute('stage-bg'):'mid';}

  connectedCallback(){
    if(this._on)return;this._on=true;
    this.st=document.createElement('style');this.sh.appendChild(this.st);
    const wrap=document.createElement('div');
    wrap.className='app';
    wrap.innerHTML=`
      <div class="top">
        <span class="mark">KFB · 2D ASSETS</span>
        <input class="q" type="search" placeholder="Search files" autocomplete="off">
        <select class="packsel" title="Pack"></select>
        <div class="tools">
          <button class="t-deep on" title="Include everything below the current folder">Recursive</button>
          <button class="t-report" title="Catalog vs repo">Catalog report</button>
          <button class="t-theme" title="Interface experiment: paper skin">Paper</button>
        </div>
        <span class="count">loading…</span>
      </div>
      <div class="rail"></div>
      <div class="chips"></div>
      <main><div class="note">Reading the repo tree…</div></main>
      <div class="panel"><div class="pin"></div></div>`;
    this.sh.appendChild(wrap);
    this.elRail=$(this.sh,'.rail');this.elChips=$(this.sh,'.chips');this.elMain=$(this.sh,'main');
    this.elCnt=$(this.sh,'.count');this.elPanel=$(this.sh,'.panel');this.elPin=$(this.sh,'.pin');
    this.elApp=wrap;
    this.applyTheme();
    this.elMain.style.setProperty('--tw',this.thumb+'px');
    $(this.sh,'.q').addEventListener('input',e=>{this.q=e.target.value.trim();this.view='files';this.render();});
    $(this.sh,'.t-deep').onclick=e=>{this.deep=!this.deep;e.target.classList.toggle('on',this.deep);
      this.view='files';this.render();};
    $(this.sh,'.t-report').onclick=e=>{this.view=this.view==='report'?'files':'report';
      e.target.classList.toggle('on',this.view==='report');
      if(this.view==='report')this.close();   // der Bericht braucht die ganze Breite (Tabelle)
      this.render();};
    $(this.sh,'.t-theme').onclick=()=>{
      this.setAttribute('theme',this.theme==='paper'?'studio':'paper');};
    this.elMain.addEventListener('scroll',()=>this.scanSoon());
    this.onKey=e=>{
      const q=$(this.sh,'.q');
      if(e.key==='/'&&e.target!==q){e.preventDefault();q.focus();return;}
      if(e.key==='Escape'){this.close();return;}
      if(!this.sel||e.target===q)return;
      if(e.key===' '){e.preventDefault();this.playing=!this.playing;this.syncBar();}
      if(e.key==='ArrowRight'){this.playing=false;this.step(1);this.syncBar();}
      if(e.key==='ArrowLeft'){this.playing=false;this.step(-1);this.syncBar();}
    };
    window.addEventListener('keydown',this.onKey);
    this.onResize=()=>this.scanSoon();
    window.addEventListener('resize',this.onResize);
    this.tick=this.tick.bind(this);requestAnimationFrame(this.tick);
    this.loadSources();
  }
  disconnectedCallback(){window.removeEventListener('keydown',this.onKey);
    window.removeEventListener('resize',this.onResize);this._raf&&cancelAnimationFrame(this._raf);}
  attributeChangedCallback(n){
    if(!this._on)return;
    if(n==='thumb'){this.elMain.style.setProperty('--tw',this.thumb+'px');this.render();}
    if(n==='alpha'){this.cacheM.clear();this.render();if(this.sel)this.open(this.sel,true);}
    if(n==='theme')this.applyTheme();
    if(n==='stage-bg')this.drawStage();
  }

  /* Theme = Variablen, kein zweites Layout. Papier zieht zusätzlich die Tiny-Swords-Teile an
     (`overworld/paper-atlas.js`); beim Zurückschalten werden sie wieder ausgezogen. */
  applyTheme(){
    const p=this.theme==='paper';
    this.st.textContent=LAYOUT+(p?PAPER:STUDIO);
    const btn=$(this.sh,'.t-theme');
    if(btn){btn.textContent=p?'Studio':'Paper';btn.classList.toggle('on',p);}
    if(p&&window.OW_PAPER){
      window.OW_PAPER.fonts();
      window.OW_PAPER.load().then(parts=>{this.parts=parts;this.dress();});
    }else this.undress();
    this.drawStage();
  }
  dress(){
    if(this.theme!=='paper'||!this.parts||this._dp)return;
    this._dp=true;
    requestAnimationFrame(()=>{this._dp=false;
      window.OW_PAPER.dress(this.sh,[{sel:'.top',sheet:'table'},{sel:'.rail',sheet:'paper'},
        {sel:'.pin',sheet:'paper'},{sel:'.chips',sheet:'paper'},
        {sel:'.tools button',sheet:'btnBlue'}],this.parts);});
  }
  undress(){
    for(const el of this.sh.querySelectorAll('[data-ow-skin]')){
      el.style.backgroundImage='';el.style.backgroundColor='';el.style.backgroundSize='';
      delete el.dataset.owSkin;
    }
  }

  /* Zwei Quellen, eine Wahrheit: der Repo-Baum sagt, was es gibt; der Katalog ist der Index. */
  async loadSources(){
    const cat=fetch(CATALOG_URL,{cache:'no-store'}).then(r=>{
      if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}).catch(e=>({__err:e.message}));
    const rep=window.OW_REPO?window.OW_REPO.tree('2D_Assets').catch(e=>({__err:e.message}))
      :Promise.resolve({__err:'repo-tree.js not loaded'});
    const[c,t]=await Promise.all([cat,rep]);
    // Der Katalog nennt eine eigene Basis (Rohadresse). Sie wird NICHT übernommen: Bytes laufen
    // über das CDN (asset-source.js), sonst hätten wir zwei Kanäle für dieselbe Datei.
    this.base=BASE_FALLBACK;
    const catPaths=[];
    if(c&&!c.__err){
      this.cat=c;
      for(const[,pv]of Object.entries(c.packs||{}))
        for(const[fp,files]of Object.entries(pv.folders||{}))
          for(const f of files)catPaths.push(fp+'/'+f);
    }
    const catSet=new Set(catPaths);
    const repoPaths=(t&&!t.__err&&t.files)?t.files.map(f=>f.path):[];
    const sizes={};
    if(t&&t.files)for(const f of t.files)sizes[f.path]=f.size|0;
    const src=repoPaths.length?repoPaths:catPaths;
    const seen={};
    for(const p of src){
      const cut=p.lastIndexOf('/');
      const fp=cut<0?'':p.slice(0,cut),file=p.slice(cut+1);
      if(!seen[fp]){seen[fp]=1;this.folders.push(fp);}
      this.items.push({fp,file,path:p,url:this.base+encodeURI(p),key:p.toLowerCase(),
        size:sizes[p]|0,inCat:catSet.has(p)});
    }
    const repoSet=new Set(repoPaths);
    this.diff={catalog:catPaths.length,repo:repoPaths.length,
      ghosts:repoPaths.length?catPaths.filter(p=>!repoSet.has(p)):[],
      fresh:repoPaths.length?repoPaths.filter(p=>!catSet.has(p)):[],
      catErr:(c&&c.__err)||null,repoErr:(t&&t.__err)||null,
      cached:!!(t&&t.cached),truncated:!!(t&&t.truncated),
      source:repoPaths.length?'repo tree':'catalog'};
    console.log('[browser] repo',this.diff.repo,'· catalog',this.diff.catalog,
      '· ghosts',this.diff.ghosts.length,'· uncatalogued',this.diff.fresh.length,
      '· showing',this.diff.source);
    if(!this.items.length){
      this.elMain.innerHTML='<div class="note">No source reachable.<br>Catalog: '+
        esc(this.diff.catErr||'ok')+'<br>Repo tree: '+esc(this.diff.repoErr||'ok')+'</div>';
      this.elCnt.textContent='—';return;
    }
    this.renderRail();this.render();
  }

  /* Sortierung. Kein Datum im Baum, also: Name, Dateigröße (die Tree-API liefert sie), Ordner. */
  sorted(list){
    const l=list.slice();
    if(this.sort==='size')l.sort((a,b)=>b.size-a.size);
    else if(this.sort==='folder')l.sort((a,b)=>a.fp.localeCompare(b.fp)||a.file.localeCompare(b.file));
    else l.sort((a,b)=>a.file.localeCompare(b.file,undefined,{numeric:true}));
    return l;
  }

  // ── Navigation ──────────────────────────────────────────────────────────────
  childNames(cur){
    const L=cur.length,pre=cur.join('/'),out={};
    for(const fp of this.folders){
      const s=fp.split('/');
      if(s.length>L&&(L===0||s.slice(0,L).join('/')===pre)&&s[L])out[s[L]]=1;
    }
    return Object.keys(out).sort();
  }
  /* Ordnerketten mit nur einem Kind und ohne eigene Bilder werden gefaltet — sonst klickt man
     sich durch Hüllen (`Enemy Pack › Enemies`). */
  kids(){
    return this.childNames(this.path).map(name=>{
      let chain=[name];
      for(let g=0;g<8;g++){
        const cur=this.path.concat(chain);
        if(this.items.some(i=>i.fp===cur.join('/')))break;
        const sub=this.childNames(cur);
        if(sub.length!==1)break;
        chain=chain.concat(sub[0]);
      }
      return chain.join('/');
    });
  }
  under(pre){return pre?this.items.filter(i=>i.fp===pre||i.fp.startsWith(pre+'/')):this.items;}
  at(){const j=this.path.join('/');return this.items.filter(i=>i.fp===j);}
  go(p){this.path=p;this.view='files';this.q='';$(this.sh,'.q').value='';
    this.renderRail();this.render();}

  renderRail(){
    const packs=this.childNames([]);
    const loose=this.items.filter(i=>!i.fp).length;
    const top=this.path[0]||'';
    let h='<div class="lbl">Packs</div>'+
      '<a class="'+(this.path.length?'':'on')+'" data-p=""><b>All</b><i>'+this.items.length+'</i></a>';
    for(const p of packs)
      h+='<a class="'+(top===p?'on':'')+'" data-p="'+esc(p)+'"><b>'+esc(p)+'</b><i>'+
        this.under(p).length+'</i></a>';
    if(loose)h+='<div class="lbl">Loose files</div><a data-p=""><b>repo root</b><i>'+loose+'</i></a>';
    this.elRail.innerHTML=h;
    for(const a of this.elRail.querySelectorAll('a'))
      a.onclick=()=>this.go(a.dataset.p?[a.dataset.p]:[]);
    // Im schmalen Fenster tritt die Leiste ab und wird ein Auswahlfeld — dieselbe Liste, ein Ort
    const sel=$(this.sh,'.packsel');
    sel.innerHTML='<option value="">All packs ('+this.items.length+')</option>'+
      packs.map(p=>'<option value="'+esc(p)+'"'+(top===p?' selected':'')+'>'+esc(p)+' ('+
        this.under(p).length+')</option>').join('');
    sel.onchange=()=>this.go(sel.value?[sel.value]:[]);
    this.dress();
  }

  render(){
    if(this.view==='report')return this.renderReport();
    /* Die Chip-Reihe zeigt NUR, was die Pack-Leiste nicht schon zeigt. Auf der Wurzelebene wären die
       Chips dieselbe Pack-Liste ein zweites Mal (und die Ordnerkarten ein drittes) — genau die
       Doppelung, die das Fenster im Splitscreen unbrauchbar machte. Also: Chips erst ab Ebene 1,
       Ordnerkarten nur, wenn NICHT rekursiv gezeigt wird. */
    let ch='';
    if(this.path.length){
      ch+='<button class="ghost" data-up>↑ '+esc(this.path.length>1?tail(this.path[this.path.length-2]):'All')+'</button>';
      ch+='<span class="sep">'+esc(this.path.map(tail).join(' / '))+'</span>';
      for(const k of (this.q?[]:this.kids()))
        ch+='<button data-k="'+esc(k)+'">'+esc(k.split('/').map(tail).join(' › '))+
          ' <i style="font-style:normal;color:var(--faint)">'+
          this.under(this.path.concat(k.split('/')).join('/')).length+'</i></button>';
    }else ch+='<span class="lbl">'+(this.q?'Search results':'Pick a pack — left, or the dropdown')+'</span>';
    ch+='<span class="grow"></span><span class="lbl">Sort</span><select class="sortsel">'+
      [['name','Name'],['size','File size'],['folder','Folder']].map(o=>
        '<option value="'+o[0]+'"'+(this.sort===o[0]?' selected':'')+'>'+o[1]+'</option>').join('')+
      '</select>';
    this.elChips.innerHTML=ch;
    const up=$(this.sh,'[data-up]');
    if(up)up.onclick=()=>this.go(this.path.slice(0,-1));
    for(const b of this.elChips.querySelectorAll('[data-k]'))
      b.onclick=()=>this.go(this.path.concat(b.dataset.k.split('/')));
    const ss=$(this.sh,'.sortsel');
    ss.onchange=()=>{this.sort=ss.value;this.render();};
    const kids=(this.q||this.deep)?[]:this.kids();

    let files;
    if(this.q){
      const s=this.q.toLowerCase();
      files=this.items.filter(i=>i.key.includes(s));
      this.elCnt.textContent=files.length+' matches';
    }else{
      files=this.deep?this.under(this.path.join('/')):this.at();
      // Kurz halten: die Zeile darf nicht schieben. Der Gesamtbestand steht in der Pack-Leiste.
      this.elCnt.textContent=[kids.length?kids.length+' folders':'',
        files.length+' images'+(this.deep?' (recursive)':'')].filter(Boolean).join('  ·  ');
    }
    const shown=this.sorted(files).slice(0,MAX_CARDS);
    const cards=(this.q?[]:kids.map(k=>this.cardFolder(k))).concat(shown.map(i=>this.cardImg(i)));
    this.elMain.innerHTML=cards.length
      ?'<div class="grid">'+cards.join('')+'</div>'+
        (files.length>MAX_CARDS?'<div class="note">'+(files.length-MAX_CARDS)+
          ' more not shown — narrow the search or open a subfolder.</div>':'')
      :'<div class="note">Nothing here. '+(this.deep?'':'Try <b>Recursive</b> — this level holds no images, only subfolders.')+'</div>';
    for(const el of this.elMain.querySelectorAll('.card.folder'))
      el.onclick=()=>this.go(this.path.concat(el.dataset.name.split('/')));
    for(const el of this.elMain.querySelectorAll('.card.img'))
      el.onclick=()=>this.open(this.items.find(i=>i.url===el.dataset.url));
    this.scanSoon();this.dress();
  }
  cardFolder(name){
    const n=this.under(this.path.concat(name.split('/')).join('/')).length;
    return '<div class="card folder" data-name="'+esc(name)+'">'+
      '<canvas class="th"></canvas><div class="cap"><b>'+esc(name.split('/').map(tail).join(' › '))+
      '</b><i>'+n+'</i></div></div>';
  }
  cardImg(i){
    return '<div class="card img" data-url="'+esc(i.url)+'">'+
      '<canvas class="th"></canvas><div class="cap"><b title="'+esc(i.path)+'">'+
      esc(i.file.replace(/\.[a-z]+$/i,''))+'</b><i>·</i></div></div>';
  }

  // ── Messen, sobald etwas im Fenster steht ───────────────────────────────────
  scanSoon(){if(this._scan)return;this._scan=true;
    requestAnimationFrame(()=>{this._scan=false;this.scan();});}
  scan(){
    const r=this.elMain.getBoundingClientRect();
    if(!r.height)return;
    for(const card of this.elMain.querySelectorAll('.card:not([data-seen])')){
      const b=card.getBoundingClientRect();
      if(b.bottom>r.top-280&&b.top<r.bottom+280){card.dataset.seen='1';this.queue.push(card);}
    }
    this.pump();
  }
  pump(){
    while(this.busy<3&&this.queue.length){
      const card=this.queue.shift();
      this.busy++;
      const done=()=>{this.busy--;this.pump();};
      if(card.classList.contains('folder')){
        const pre=this.path.concat(card.dataset.name.split('/')).join('/');
        const three=this.under(pre).slice(0,3);
        Promise.all(three.map(i=>this.probe(i.url).catch(()=>null)))
          .then(list=>this.paintStack(card,list.filter(Boolean))).catch(()=>{}).then(done);
      }else{
        this.probe(card.dataset.url).then(({img,m})=>{
          card._anim={img,m,i:0};
          this.paintFrame(card,img,m,0);
          const i=card.querySelector('.cap i');
          i.textContent=m.grid?m.grid.cell+'²':(m.strip?m.strip.frames+'f':'1');
          if(m.strip&&!m.naiveOk)i.classList.add('warn');
          card.addEventListener('mouseenter',()=>{card._hot=true;});
          card.addEventListener('mouseleave',()=>{card._hot=false;this.paintFrame(card,img,m,0);});
        }).catch(()=>{}).then(done);
      }
    }
  }
  probe(url){
    if(this.cacheM.has(url))return this.cacheM.get(url);
    const p=(async()=>{
      const img=await this.loadImg(url);
      return{img,m:window.OW_PROBE.measure(img,{alpha:this.alpha})};
    })();
    this.cacheM.set(url,p);
    return p;
  }
  loadImg(u){
    if(window.OW_PAPER)return window.OW_PAPER.loadImg(u);
    return new Promise((ok,no)=>{const i=new Image();i.crossOrigin='anonymous';
      i.onload=()=>ok(i);i.onerror=()=>no(new Error('load failed'));i.src=u;});
  }
  cvOf(card){
    const cv=card.querySelector('.th');
    if(!cv)return null;
    const d=Math.min(2,window.devicePixelRatio||1);
    const r=cv.getBoundingClientRect();
    const S=Math.max(48,Math.round((r.width||this.thumb)*d));
    if(cv.width!==S){cv.width=S;cv.height=S;}
    return cv;
  }
  /* Ein Ordner zeigt, was drin ist: bis zu drei Assets gestapelt — 1, 2 oder 3+ ist sofort
     ablesbar, ohne die Krümelspur zu lesen. */
  paintStack(card,list){
    const cv=this.cvOf(card);if(!cv||!list.length)return;
    const S=cv.width,c=cv.getContext('2d');
    c.imageSmoothingEnabled=false;c.clearRect(0,0,S,S);
    const n=Math.min(3,list.length);
    for(let k=n-1;k>=0;k--){
      const{img,m}=list[k];
      const f=window.OW_PROBE.framesOf(m,0)[0];
      const pad=S*0.13,box=S-2*pad;
      const sc=Math.min(box/f.sw,box/f.sh)*(k===0?1:0.86);
      const w=f.sw*sc,h=f.sh*sc;
      const off=(n-1-k)*S*0.085;
      c.globalAlpha=k===0?1:(k===1?0.55:0.3);
      c.drawImage(img,f.sx,f.sy,f.sw,f.sh,(S-w)/2+off,(S-h)/2-off*0.6,w,h);
    }
    c.globalAlpha=1;
  }
  paintFrame(card,img,m,ix){
    const cv=this.cvOf(card);if(!cv)return;
    const S=cv.width,c=cv.getContext('2d');
    c.imageSmoothingEnabled=false;c.clearRect(0,0,S,S);
    const fr=window.OW_PROBE.framesOf(m,0),f=fr[ix%fr.length];
    const pad=S*0.1,box=S-2*pad,sc=Math.min(box/f.sw,box/f.sh);
    const w=f.sw*sc,h=f.sh*sc;
    c.drawImage(img,f.sx,f.sy,f.sw,f.sh,(S-w)/2,(S-h)/2,w,h);
  }

  // ── Detail ──────────────────────────────────────────────────────────────────
  close(){this.sel=null;this.elPanel.classList.remove('on');this.elApp.classList.remove('p-open');
    for(const el of this.elMain.querySelectorAll('.card.on'))el.classList.remove('on');}
  open(item,keep){
    if(!item)return;
    this.sel=item;this.row=keep?this.row:0;this.frame=0;this.playing=true;
    this.elPanel.classList.add('on');this.elApp.classList.add('p-open');
    for(const el of this.elMain.querySelectorAll('.card.on'))el.classList.remove('on');
    const card=[...this.elMain.querySelectorAll('.card.img')].find(c=>c.dataset.url===item.url);
    if(card)card.classList.add('on');
    this.elPin.innerHTML='<div class="note">Measuring…</div>';
    this.probe(item.url).then(({img,m})=>{
      if(this.sel!==item)return;
      this.img=img;this.m=m;this.paintDetail(item,m);
    }).catch(e=>{this.elPin.innerHTML='<div class="note">Image not readable: '+esc(e.message)+'</div>';});
  }
  paintDetail(item,m){
    const rows=[];
    const R=(k,v,warn)=>rows.push('<tr><td class="k">'+k+'</td><td class="v'+(warn?' warn':'')+'">'+v+'</td></tr>');
    R('Image',m.w+' × '+m.h+' px');
    R('In catalog',item.inCat?'yes':'no — catalog does not know this file',!item.inCat);
    R('Frame',m.frame.w+' × '+m.frame.h+' px'+(m.strip?'  ·  '+m.strip.frames+' frames':''));
    if(m.grid)R('Grid',m.grid.cell+' px  ·  '+m.grid.cols+' × '+m.grid.rows+' cells');
    if(m.grid&&m.grid.framesPerRow)R('Frames per row','['+m.grid.framesPerRow.join(', ')+']');
    if(m.foot)R('Foot line',m.foot.fromBottom+' px from bottom');
    if(m.foot)R('Body',m.foot.bodyH+' × '+m.foot.bodyW+' px');
    if(m.shadow)R('Shadow',m.shadow.baked
      ? 'baked into the sheet ('+(m.shadow.semiShare*100).toFixed(0)+' % semi-transparent, alpha '+
        m.shadow.alphaMean+')'
      : 'none — drawn at runtime ('+(m.shadow.semiShare*100).toFixed(0)+' % semi, alpha '+
        m.shadow.alphaMean+')',!m.shadow.baked);
    if(m.drift)R('Foot drift','± '+m.drift.span+' px over '+m.drift.frames+' frames',m.drift.span>6);
    R('Naive guess (w÷h)',m.naive+'  vs  measured '+m.measured+(m.naiveOk?'  ✓':'  ✗'),!m.naiveOk);
    R('Coverage',(m.fill*100).toFixed(1)+' % opaque  ·  alpha > '+m.alpha);
    if(m.gapsX.length)R('Gaps (x)',m.gapsX.slice(0,6).map(g=>g.at+'+'+g.len).join('  '));
    const other=m.cutsX.filter(c=>c.fw!==m.frame.w).map(c=>c.fw+'px/'+c.frames).slice(0,6);
    if(other.length)R('Other valid cuts',other.join('  '));

    const nR=m.grid?m.grid.rows:1;
    const rowsel=m.grid?'<div class="rows">'+Array.from({length:nR},(_,r)=>
      '<button data-row="'+r+'"'+(r===this.row?' class="on"':'')+'>row '+r+
      (m.grid.framesPerRow?' · '+(m.grid.framesPerRow[r]|0):'')+'</button>').join('')+'</div>':'';
    const playable=window.OW_PROBE.framesOf(m,this.row).length>1;
    const sw=Object.keys(STAGE).map(k=>'<button class="sw'+(this.stageBg===k?' on':'')+
      '" data-bg="'+k+'" title="'+k+'" style="background:'+STAGE[k][0]+'"></button>').join('');

    this.elPin.innerHTML=
      '<div class="hd"><div><h3>'+esc(item.file)+'</h3>'+
        '<p class="path">'+esc(item.fp)+'</p></div>'+
        '<button class="ghost x" title="Close (Esc)">✕</button></div>'+
      '<div class="stage"><canvas></canvas></div>'+
      '<div class="bar"><button class="play"'+(playable?'':' disabled')+'>'+
        (playable?'Pause':'Single frame')+'</button>'+
        '<button class="pv"'+(playable?'':' disabled')+'>◀</button>'+
        '<button class="nx"'+(playable?'':' disabled')+'>▶</button>'+
        '<span class="fc"></span><span class="spacer"></span>'+sw+'</div>'+
      rowsel+
      '<div class="bar"><button class="t-g'+(this.show.grid?' on':'')+'">Frame edge</button>'+
        '<button class="t-f'+(this.show.foot?' on':'')+'">Foot line</button>'+
        '<button class="t-b'+(this.show.box?' on':'')+'">Body box</button>'+
        '<button class="t-s'+(this.show.shade&&m.shadow&&!m.shadow.baked?' on':'')+'"'+
          (m.shadow&&m.shadow.baked?' disabled title="Shadow is baked into this sheet — nothing to draw"'
            :' title="Draw the runtime shadow (§21)"')+'>Shadow</button></div>'+
      '<p class="verdict"><b>'+esc(m.verdict)+'</b> · '+m.frame.w+'×'+m.frame.h+' px · '+
        m.measured+(m.grid?' columns':' frames')+'</p>'+
      '<p class="why">'+esc(m.reason)+'</p>'+
      '<table>'+rows.join('')+'</table>'+
      '<div class="bar"><button class="cp-url">Copy RAW URL</button>'+
        '<button class="cp-one">Entry: file</button>'+
        '<button class="cp-dir">Entry: folder</button></div>'+
      '<pre class="snip"></pre>'+
      '<p class="hint">The entry goes into <code>overworld/units-catalog.js</code>. '+
      '<code>sizeRel</code> is body height relative to the hero — a decision, not a pixel count. '+
      'Foreign row sheets need <code>framesPerRow</code>; sheets drawn facing left need '+
      '<code>faceLeft:true</code>. <span class="kbd">space</span> play · '+
      '<span class="kbd">← →</span> step · <span class="kbd">/</span> search</p>';

    $(this.sh,'.x').onclick=()=>this.close();
    $(this.sh,'.play').onclick=()=>{this.playing=!this.playing;this.syncBar();};
    $(this.sh,'.pv').onclick=()=>{this.playing=false;this.step(-1);this.syncBar();};
    $(this.sh,'.nx').onclick=()=>{this.playing=false;this.step(1);this.syncBar();};
    for(const b of this.elPin.querySelectorAll('[data-row]'))
      b.onclick=()=>{this.row=+b.dataset.row;this.frame=0;this.open(this.sel,true);};
    for(const b of this.elPin.querySelectorAll('[data-bg]'))
      b.onclick=()=>{this.setAttribute('stage-bg',b.dataset.bg);
        for(const o of this.elPin.querySelectorAll('[data-bg]'))o.classList.toggle('on',o===b);};
    const tg=(sel,k)=>{const el=$(this.sh,sel);el.onclick=()=>{this.show[k]=!this.show[k];
      el.classList.toggle('on',this.show[k]);this.drawStage();};};
    tg('.t-g','grid');tg('.t-f','foot');tg('.t-b','box');tg('.t-s','shade');
    const cp=(sel,fn)=>{const b=$(this.sh,sel);b.onclick=e=>{e.preventDefault();this.copy(fn(),b);};};
    cp('.cp-url',()=>item.url);
    cp('.cp-one',()=>this.snippetOne(item,m));
    cp('.cp-dir',()=>this.snippetDir(item));
    $(this.sh,'.snip').textContent=this.snippetOne(item,m);
    this.stageCv=$(this.sh,'.stage canvas');
    this.drawStage();this.syncBar();this.dress();
  }
  step(d){const n=window.OW_PROBE.framesOf(this.m,this.row).length;
    this.frame=(this.frame+d+n)%n;this.drawStage();}
  syncBar(){
    const b=$(this.sh,'.play');
    if(b&&!b.disabled)b.textContent=this.playing?'Pause':'Play';
    const fc=$(this.sh,'.fc');
    if(fc&&this.m){const n=window.OW_PROBE.framesOf(this.m,this.row).length;
      fc.textContent=(this.frame+1)+' / '+n+'  ·  '+this.fps+' fps';}
  }
  drawStage(){
    if(!this.stageCv||!this.m)return;
    const cv=this.stageCv,r=cv.getBoundingClientRect();
    const d=Math.min(2,window.devicePixelRatio||1);
    const W=Math.max(64,Math.round(r.width*d)),H=Math.max(64,Math.round(r.height*d));
    if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
    const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
    const[bg,bg2]=STAGE[this.stageBg];
    c.fillStyle=bg;c.fillRect(0,0,W,H);
    if(this.stageBg==='checker'){
      const S=11*d;c.fillStyle=bg2;
      for(let y=0;y<H;y+=S)for(let x=0;x<W;x+=S)if(((x/S|0)+(y/S|0))%2)c.fillRect(x,y,S,S);
    }
    const fr=window.OW_PROBE.framesOf(this.m,this.row),f=fr[this.frame%fr.length];
    const pad=16*d,k=Math.min((W-2*pad)/f.sw,(H-2*pad)/f.sh);
    const w=f.sw*k,h=f.sh*k,ox=(W-w)/2,oy=(H-h)/2;
    /* Die Auflage aus §21 — vor dem Sprite, mit der gemessenen Körperbreite. Nur wenn das Blatt
       keinen gebackenen Schatten hat: zwei Schatten wären einer zu viel. */
    const SH=window.OW_SHADOW;
    if(this.show.shade&&SH&&this.m.foot&&this.m.shadow&&!this.m.shadow.baked){
      const fy=oy+h-this.m.foot.fromBottom*k;
      SH.draw(c,ox+this.m.foot.cx*k,fy,this.m.foot.bodyW*k,{});
    }
    c.drawImage(this.img,f.sx,f.sy,f.sw,f.sh,ox,oy,w,h);
    const dark=this.stageBg==='dark';
    if(this.show.grid){
      c.strokeStyle=dark?'rgba(255,255,255,.28)':'rgba(0,0,0,.22)';c.lineWidth=1*d;
      c.strokeRect(ox+.5,oy+.5,w-1,h-1);
    }
    if(this.show.foot&&this.m.foot){
      const y=oy+h-this.m.foot.fromBottom*k;
      c.strokeStyle='#d4553a';c.lineWidth=1.5*d;
      c.beginPath();c.moveTo(ox,y);c.lineTo(ox+w,y);c.stroke();
    }
    if(this.show.box&&this.m.foot){
      const bh=this.m.foot.bodyH*k,bw=this.m.foot.bodyW*k;
      const y=oy+h-this.m.foot.fromBottom*k-bh,x=ox+this.m.foot.cx*k-bw/2;
      c.strokeStyle='#3d86c6';c.lineWidth=1.5*d;c.strokeRect(x,y,bw,bh);
    }
  }
  tick(t){
    this._raf=requestAnimationFrame(this.tick);
    const ms=1000/this.fps;
    if(!this._t)this._t=t;
    if(t-this._t<ms)return;
    this._t=t;
    if(this.playing&&this.m&&this.stageCv){
      const n=window.OW_PROBE.framesOf(this.m,this.row).length;
      if(n>1){this.frame=(this.frame+1)%n;this.drawStage();this.syncBar();}
    }
    for(const card of this.elMain.querySelectorAll('.card.img')){
      if(card._hot&&card._anim){const a=card._anim;a.i++;this.paintFrame(card,a.img,a.m,a.i);}
    }
  }

  // ── Katalog-Bericht ─────────────────────────────────────────────────────────
  renderReport(){
    const d=this.diff||{};
    this.elChips.innerHTML='<span class="sep">Catalog report</span>';
    const packOf=p=>p.split('/')[0];
    const tally={};
    const bump=(p,k)=>{const g=packOf(p);(tally[g]=tally[g]||{repo:0,cat:0,ghost:0,fresh:0})[k]++;};
    for(const i of this.items){bump(i.path,'repo');if(i.inCat)bump(i.path,'cat');}
    for(const p of d.ghosts||[])bump(p,'ghost');
    for(const p of d.fresh||[])bump(p,'fresh');
    const rows=Object.keys(tally).sort().map(k=>{const t=tally[k];
      return '<tr><td>'+esc(k)+'</td><td class="n">'+t.repo+'</td><td class="n">'+t.cat+
        '</td><td class="n'+(t.ghost?' warn':'')+'">'+t.ghost+'</td><td class="n">'+t.fresh+
        '</td></tr>';}).join('');
    const sample=(l,n)=>'<ul>'+(l||[]).slice(0,n).map(p=>'<li>'+esc(p)+'</li>').join('')+'</ul>';
    this.elMain.innerHTML='<div class="report">'+
      '<h2>Catalog vs repo</h2>'+
      '<p>Showing from <b>'+esc(d.source||'—')+'</b>'+(d.cached?' (tree from cache)':'')+
      (d.truncated?' · <b class="warn">tree truncated</b>':'')+'. The catalog lists <b>'+(d.catalog|0)+
      '</b> images, the repo holds <b>'+(d.repo|0)+'</b>. <b class="warn">'+((d.ghosts||[]).length)+
      '</b> catalog entries point at paths that do not exist in the repo (404), and <b>'+
      ((d.fresh||[]).length)+'</b> files in the repo are unknown to the catalog.'+
      (d.catErr?' Catalog error: '+esc(d.catErr)+'.':'')+
      (d.repoErr?' <b class="warn">Repo tree: '+esc(d.repoErr)+'</b>':'')+'</p>'+
      '<table><tr><th>Pack</th><th>in repo</th><th>in catalog</th><th>ghosts</th>'+
      '<th>uncatalogued</th></tr>'+rows+'</table>'+
      '<p style="margin-top:18px"><b>Ghost entries — sample</b>'+sample(d.ghosts,10)+'</p>'+
      '<p><b>In repo, not in catalog — sample</b>'+sample(d.fresh,10)+'</p>'+
      '<p><code>build_catalog.py</code> runs against a local folder tree that is not identical to '+
      'the repo. Until the catalog is regenerated the tree wins — same precedence rule as '+
      '<code>cardGrid</code> (masterplan §18.1).</p></div>';
    this.elCnt.textContent=(d.ghosts||[]).length+' ghosts  ·  '+(d.fresh||[]).length+' uncatalogued';
    this.dress();
  }

  // ── Katalog-Eintrag ─────────────────────────────────────────────────────────
  snippetOne(item,m){
    const id=slug(item.file),k=animKey(item.file)||'idle';
    const nm=item.file.replace(/\.[a-z]+$/i,'');
    if(m.grid){
      return id+":{name:'"+nm+"',kind:'rowsheet',cell:"+m.grid.cell+
        ",\n  framesPerRow:"+JSON.stringify(m.grid.framesPerRow||[])+",  // gemessen\n"+
        "  // Zeile 0 vorher ANSEHEN: eine Drehung ist keine Ruhe (FrizzleBob-Falle)\n"+
        (m.shadow&&!m.shadow.baked?"  shadow:'ellipse',   // kein gebackener Schatten im Blatt (§21)\n":'')+
        "  sizeRel:1, sheet:'"+item.url+"'},";
    }
    if(m.verdict==='Atlas with gaps'){
      return '// '+item.file+' ist kein Filmstreifen, sondern ein Atlas mit Lücken.\n'+
        '// Teile quer: '+m.piecesX.map(p=>p.at+'+'+p.len).slice(0,9).join(' · ')+'\n'+
        '// Lücken quer: '+m.gapsX.map(g=>g.at+'+'+g.len).slice(0,9).join(' · ')+'\n'+
        '// Verwendung: 9-Teil-Composer (overworld/paper-atlas.js), nicht der unit-loader.';
    }
    return id+":{name:'"+nm+"',role:'melee',sizeRel:0.95,\n  anims:{"+k+":'"+item.url+
      "'}},   // "+(m.strip?m.strip.frames+' Felder à '+m.frame.w+' px':'Einzelbild')+', gemessen';
  }
  /* Ordner-Eintrag: alle Dateien derselben Figur zu einem `anims`-Block. Drei Fallen, alle gemessen
     aufgetreten — und alle drei kamen aus **einer** Annahme: »der Unterstrich trennt den Namen«.
     1. Der Stamm wurde ohne Endung gebildet, verglichen wurde mit — ein Vergleich, dessen Seiten
        unterschiedlich normalisiert sind, funktioniert nur zufällig.
     2. `run_attack1…8` ist eine Bildfolge, kein Name mit Unterstrich: die Einzelframe-Erkennung
        verlangte »kein Unterstrich«, also fiel sie durch, und `split('_')[0]` machte daraus den
        Schlüssel »run« — achtmal derselbe Schlüssel in einem Objekt, sieben Zeilen still weg.
        **Nummerierung erkennt man am Ziffernschwanz, nicht am Unterstrich.**
     3. Deshalb ist die Basis jetzt »Name ohne Endung ohne Ziffernschwanz« (`run_attack`, `high_jump`),
        und doppelte Schlüssel werden abgewiesen, statt sich gegenseitig zu überschreiben. */
  snippetDir(item){
    const strip=f=>f.replace(/\.[a-z]+$/i,'');
    const seqBase=f=>strip(f).replace(/[\s_-]*\d+$/,'');   // run_attack1 → run_attack
    /* Figurenname: alles vor dem ersten Unterstrich — aber nur, wenn der Rest eine **bekannte**
       Animation benennt (`Bear_Attack` → Bear, `Turtle_Guard_In` → Turtle, `Pirate Tower_Ground`
       bleibt ganz). Blind am Unterstrich zu schneiden war Falle 1; blind NICHT zu schneiden machte
       aus jeder Datei eine eigene Einheit (`bear_attack:{name:'Bear_Attack'}`). Geprüft wird, nicht
       geraten. */
    const figOf=f=>{const s=strip(f),i=s.indexOf('_');
      return (i>0&&animKey(s.slice(i+1)))?s.slice(0,i):s;};
    const files=this.items.filter(i=>i.fp===item.fp);
    const base=seqBase(item.file);
    const seq=files.filter(f=>seqBase(f.file)===base&&/\d+$/.test(strip(f.file)));
    if(seq.length>=3){
      // 0 ist eine gültige Framenummer (attack_extra0…6). Sie wegzufiltern verschiebt den Bereich
      // um einen Frame und macht die Lückenrechnung negativ — beim Sheet-Legen kostet das genau
      // diesen einen Frame. Also: alles nehmen, was eine Zahl ist.
      const nums=seq.map(f=>+(strip(f.file).match(/(\d+)$/)||[])[1])
        .filter(n=>Number.isFinite(n)).sort((a,b)=>a-b);
      const lo=nums[0],hi=nums[nums.length-1],gaps=Math.max(0,hi-lo+1-nums.length);
      return '// '+item.fp+': '+seq.length+' Einzelframes, Nummern '+lo+'…'+hi+
        (gaps>0?' ('+gaps+' fehlen)':'')+'.\n'+
        '// Das ist noch keine Einheit, sondern Rohstoff — erst ein Sheet legen (Masterplan §18.3),\n'+
        '// dann Contract schreiben (frameW/H · fps · anchor · rows · faceLeft). Einzeln geladen\n'+
        '// wären das '+seq.length+' Anfragen für EINE Animation, und im Katalog-Eintrag stünden\n'+
        '// '+seq.length+' Dateien unter einem Schlüssel — also ein einziger stehender Frame.';
    }
    const key=figOf(item.file);
    const mine=files.filter(f=>figOf(f.file)===key);
    const anims=[],extra=[],seen={};
    for(const f of mine){
      const k=animKey(f.file);
      if(PROJ.test(f.file)&&!k)extra.push("  projectile:'"+f.url+"',");
      else if(k&&!seen[k]){seen[k]=1;anims.push('    '+k+":'"+f.url+"',");}
      else if(k)extra.push('  // doppelter Schlüssel '+k+' — nicht übernommen: '+f.file);
      else extra.push('  // ungeklärt: '+f.file);
    }
    if(!anims.length)
      return '// '+item.fp+': aus '+mine.length+' Datei(en) zu »'+key+'« ließ sich keine\n'+
        '// Animation ableiten (Dateinamen ohne bekannte Endung wie _Idle/_Run/_Attack).\n'+
        '// Namen erst klären, dann Eintrag — nicht raten.';
    return slug(key)+":{name:'"+key+"',role:'melee',sizeRel:0.95,\n  anims:{\n"+
      anims.join('\n')+'\n  },\n'+extra.join('\n')+'},\n// '+mine.length+' Dateien aus '+item.fp;
  }
  /* Kopieren. Zwei Wege, weil der erste im iframe still scheitern kann: die Clipboard-API, und
     darunter ein Textfeld mit execCommand. Der Knopf kommt als Argument — `activeElement` im
     ShadowRoot ist beim Klick nicht verlässlich (gemessen: null, deshalb blieb die Rückmeldung aus).
     Der Text steht danach im Feld unten, ohne dass etwas scrollt. */
  copy(text,btn){
    const pre=$(this.sh,'.snip');
    if(pre){pre.textContent=text;pre.scrollTop=0;}
    const flash=ok=>{
      if(!btn)return;
      const t=btn.dataset.label||btn.textContent;
      btn.dataset.label=t;
      btn.textContent=ok?'Copied':'Copy failed — select below';
      clearTimeout(btn._t);
      btn._t=setTimeout(()=>{btn.textContent=btn.dataset.label;},1200);
    };
    const legacy=()=>{
      try{
        const ta=document.createElement('textarea');
        ta.value=text;
        ta.setAttribute('style','position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;padding:0;border:0');
        // Ins Dokument, NICHT in den ShadowRoot: execCommand arbeitet auf der Dokument-Auswahl
        // (im ShadowRoot gemessen: liefert false, es wird nichts kopiert).
        document.body.appendChild(ta);
        ta.select();ta.setSelectionRange(0,text.length);
        const ok=document.execCommand('copy');
        ta.remove();
        return ok;
      }catch(e){return false;}
    };
    /* Dritter Weg, im eingebetteten Fenster oft der einzige: den Text **markieren**, damit ⌘C
       sofort greift. Gemessen: im iframe sind Clipboard-API UND execCommand gesperrt — dann ist
       eine fertige Auswahl ehrlicher als eine Erfolgsmeldung, die nicht stimmt. */
    const select=()=>{
      try{
        const sel=document.getSelection();
        if(!sel||!pre||!pre.firstChild)return false;
        const r=document.createRange();
        r.selectNodeContents(pre);
        sel.removeAllRanges();sel.addRange(r);
        return true;
      }catch(e){return false;}
    };
    const fail=()=>{
      const marked=select();
      if(!btn)return;
      const t=btn.dataset.label||btn.textContent;
      btn.dataset.label=t;
      btn.textContent=marked?'Selected — press ⌘C':'Copy blocked — select below';
      clearTimeout(btn._t);
      btn._t=setTimeout(()=>{btn.textContent=btn.dataset.label;},1800);
    };
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(()=>flash(true),()=>{legacy()?flash(true):fail();});
    }else if(legacy())flash(true);
    else fail();
  }
}
customElements.define('asset-browser-2d',AssetBrowser2D);
})();
