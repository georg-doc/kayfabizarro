import { registryBase } from './state.js';
import { copyText } from './selection.js';

const $ = (id) => document.getElementById(id);
const style = document.createElement('link');
style.rel = 'stylesheet'; style.href = './deck-library.css'; document.head.append(style);
const VIEWER_PATH = '../../../KFB Comic Card Deck Viewer v4 (WS0)/KFB Deck Viewer v5.dc.html';
let index = null;
let cards = null;
let rows = [];
let pdfjsPromise = null;
let previewToken = 0;
let loadedBase = '';

async function json(url) { const response=await fetch(url,{cache:'no-store'}); if(!response.ok)throw new Error(`${response.status} ${response.statusText}: ${url}`); return response.json(); }
async function jsonl(url) { const response=await fetch(url,{cache:'no-store'}); if(!response.ok)throw new Error(`${response.status} ${response.statusText}: ${url}`); return (await response.text()).split(/\r?\n/).filter(Boolean).map((line)=>JSON.parse(line)); }
function option(value,label){const node=document.createElement('option');node.value=value;node.textContent=label;return node;}
function badge(text,cls=''){const node=document.createElement('span');node.className=`badge ${cls}`.trim();node.textContent=text;return node;}
function unique(values){return [...new Set(values.filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b)));}
function viewerUrl(row){const url=new URL(VIEWER_PATH,location.href);url.searchParams.set('deck',row.deckId);if(row.assetType==='Card')url.searchParams.set('card',row.cardNumber);else url.searchParams.set('page','1');return url.href;}
function deckFor(row){return index.decks.find((deck)=>deck.deckId===row.deckId);}
function cardRef(row){return {schema:'kfb.card-ref/1',deckId:row.deckId,cardNumber:row.cardNumber,cardName:row.cardName,page:row.mappingVerified?row.page:null,quadrant:row.mappingVerified?row.quadrant:null,pdf:row.pdf,data:row.data};}
function deckAssignment(row){return {deckId:row.deckId,role:$('deckRole').value||row.role||'primary'};}
async function ensureData(){
  let base=registryBase();
  if(index&&cards&&loadedBase===base)return;
  loadedBase=base;
  try{[index,cards]=await Promise.all([json(`${base}/decks/index.json`),jsonl(`${base}/decks/cards.jsonl`)]);}
  catch(error){
    if(!/^https:/.test(base))throw error;
    base='../../../registry/assets/v1';loadedBase=base;
    [index,cards]=await Promise.all([json(`${base}/decks/index.json`),jsonl(`${base}/decks/cards.jsonl`)]);
  }
  rows=[...index.decks.map((deck)=>({...deck,assetType:'Deck'})),...cards.map((card)=>({...card,assetType:'Card',gameMode:deckFor(card)?.gameMode,deckType:deckFor(card)?.deckType,sets:deckFor(card)?.sets||[],gameUse:deckFor(card)?.gameUse,tags:deckFor(card)?.tags||[]}))];
  $('deckModeFilter').replaceChildren(option('','KFB + MED'),...unique(index.decks.map((deck)=>deck.gameMode)).map((value)=>option(value,value)));
  $('deckTypeFilter').replaceChildren(option('','All deck types'),...unique(index.decks.map((deck)=>deck.deckType)).map((value)=>option(value,value)));
  $('deckSetFilter').replaceChildren(option('','All sets'),...unique(index.decks.flatMap((deck)=>deck.sets||[])).map((value)=>option(value,value)));
}
function filtered(){
  const q=$('deckSearch').value.trim().toLowerCase(), type=$('deckAssetType').value, mode=$('deckModeFilter').value, deckType=$('deckTypeFilter').value, set=$('deckSetFilter').value, gameUse=$('deckGameUseFilter').value;
  return rows.filter((row)=>{
    const deck=deckFor(row)||row;
    if(type&&row.assetType!==type||mode&&deck.gameMode!==mode||deckType&&deck.deckType!==deckType||set&&!(deck.sets||[]).includes(set)||gameUse&&deck.gameUse!==gameUse)return false;
    if(!q)return true;
    return [row.title,row.deckTitle,row.cardName,row.lore,deck.deckType,deck.bundleSuggestion,...(deck.tags||[])].some((value)=>String(value||'').toLowerCase().includes(q));
  });
}
function render(){
  const result=filtered(),list=$('deckList');list.replaceChildren();
  const shown=Math.min(result.length,400);
  $('deckMeta').textContent=`${shown.toLocaleString()} shown · ${result.length.toLocaleString()} matches · ${index.count} decks · ${index.cardCount.toLocaleString()} cards`;
  for(const row of result.slice(0,400)){
    const article=document.createElement('article');article.className='deck-card';
    const open=document.createElement('button');open.type='button';open.onclick=()=>showDetail(row);
    const title=document.createElement('div');title.className='deck-card-title';title.textContent=row.assetType==='Deck'?row.title:row.cardName;
    const sub=document.createElement('div');sub.className='deck-card-sub';sub.textContent=row.assetType==='Deck'?`${row.deckId} · ${row.cardCount} cards · ${row.pdfPages} PDF pages`:`${row.deckTitle} · card ${row.cardNumber}${row.page?` · page ${row.page}`:''}`;
    const badges=document.createElement('div');badges.className='badges';badges.append(badge(row.assetType),badge((deckFor(row)||row).gameMode),badge((deckFor(row)||row).gameUse,(deckFor(row)||row).gameUse==='allowed'?'ok':'warn'));
    open.append(title,sub,badges);
    if(row.assetType==='Card'&&row.lore){const lore=document.createElement('div');lore.className='deck-card-lore';lore.textContent=row.lore;open.append(lore);}
    article.append(open);list.append(article);
  }
}
async function pdfjs(){
  if(window.pdfjsLib)return window.pdfjsLib;
  if(!pdfjsPromise)pdfjsPromise=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';script.onload=()=>{window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';resolve(window.pdfjsLib);};script.onerror=()=>reject(new Error('pdf.js unavailable'));document.head.append(script);});
  return pdfjsPromise;
}
async function renderPdf(row){
  const token=++previewToken,deck=deckFor(row)||row,representation=(deck.representations?.pdf||[])[0];
  const wrap=$('deckPreviewWrap'),canvas=$('deckPreviewCanvas'),status=$('deckPreviewStatus');wrap.hidden=false;status.textContent='Loading PDF…';
  try{
    const lib=await pdfjs();const doc=await lib.getDocument({url:representation.rawLatest,disableAutoFetch:true,rangeChunkSize:262144}).promise;if(token!==previewToken)return;
    const pageNo=row.assetType==='Card'&&row.mappingVerified&&row.page?row.page:1;const page=await doc.getPage(pageNo);const view=page.getViewport({scale:1.25});
    const source=document.createElement('canvas');source.width=Math.round(view.width);source.height=Math.round(view.height);await page.render({canvasContext:source.getContext('2d'),viewport:view}).promise;
    if(row.assetType==='Card'&&row.mappingVerified){const col=row.quadrant%2,rowIndex=Math.floor(row.quadrant/2),w=Math.floor(source.width/2),h=Math.floor(source.height/2);canvas.width=w;canvas.height=h;canvas.getContext('2d').drawImage(source,col*w,rowIndex*h,w,h,0,0,w,h);status.textContent=`Card ${row.cardNumber} · page ${pageNo} · quadrant ${['TL','TR','BL','BR'][row.quadrant]}`;}
    else{canvas.width=source.width;canvas.height=source.height;canvas.getContext('2d').drawImage(source,0,0);status.textContent=`PDF page ${pageNo} of ${doc.numPages}`;}
  }catch(error){if(token===previewToken)status.textContent=`Preview unavailable: ${error.message}`;}
}
async function showDetail(row){
  const deck=deckFor(row)||row;$('deckDetailPanel').classList.add('open');$('deckDetailPanel').setAttribute('aria-hidden','false');$('drawerBackdrop').hidden=false;
  $('deckDetailKind').textContent=row.assetType;$('deckDetailName').textContent=row.assetType==='Deck'?row.title:row.cardName;
  $('deckDetailBadges').replaceChildren(badge(deck.gameMode),badge(deck.deckType),badge(deck.gameUse,deck.gameUse==='allowed'?'ok':'warn'),badge(deck.mappingStatus,deck.mappingStatus==='verified'?'ok':'warn'));
  $('deckRole').value=row.role==='unassigned'?'primary':(row.role||'primary');$('deckViewerLink').href=viewerUrl(row);
  const payload=row.assetType==='Card'?cardRef(row):deckAssignment(row);$('deckHandoffJson').textContent=JSON.stringify(payload,null,2);
  $('deckPrimaryAction').textContent=row.assetType==='Card'?'Karte wählen':'Deck zuordnen';$('deckPrimaryAction').onclick=()=>{const value=row.assetType==='Card'?cardRef(row):deckAssignment(row);$('deckHandoffJson').textContent=JSON.stringify(value,null,2);copyText(JSON.stringify(value,null,2)+'\n');};
  $('deckRoleWrap').hidden=row.assetType==='Card';$('deckRole').onchange=()=>{$('deckHandoffJson').textContent=JSON.stringify(deckAssignment(row),null,2);};
  $('deckMappingWarning').hidden=!(row.assetType==='Card'&&!row.mappingVerified);$('deckMappingWarning').textContent=row.assetType==='Card'&&!row.mappingVerified?'Card crop is disabled because the cover/page mapping is unverified. The full PDF remains available in Deck Viewer v5.':'';
  await renderPdf(row);
}
export function closeDeckDetail(){previewToken+=1;$('deckDetailPanel').classList.remove('open');$('deckDetailPanel').setAttribute('aria-hidden','true');if(!$('detailPanel').classList.contains('open')&&!$('resourceDetailPanel').classList.contains('open')&&!$('selectionTray').classList.contains('open'))$('drawerBackdrop').hidden=true;}
export async function activateDeckLibrary(){
  $('assetWorkspace').hidden=true;$('resourceWorkspace').hidden=true;$('deckWorkspace').hidden=false;
  try{await ensureData();render();}catch(error){$('deckMeta').textContent=`Deck Registry unavailable: ${error.message}`;$('deckMeta').classList.add('error');}
}
export function deactivateDeckLibrary(){$('deckWorkspace').hidden=true;closeDeckDetail();}
export function initDeckLibrary(){for(const id of ['deckSearch','deckAssetType','deckModeFilter','deckTypeFilter','deckSetFilter','deckGameUseFilter'])$(id).addEventListener(id==='deckSearch'?'input':'change',render);$('deckDetailClose').onclick=closeDeckDetail;return{activateDeckLibrary,deactivateDeckLibrary,closeDeckDetail};}
