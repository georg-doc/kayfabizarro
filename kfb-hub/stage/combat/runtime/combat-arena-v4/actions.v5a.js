// One vocabulary for input and the visible controls. Equipment is not a second input queue.
export const ACTIONS = Object.freeze([
  {id:'move',label:'Laufen',key:'W / S',codes:['KeyW','KeyS','ArrowUp','ArrowDown'],hint:'Vor / zurück · auch ↑ / ↓'},
  {id:'turn',label:'Drehen',key:'A / D',codes:['KeyA','KeyD']},
  {id:'strafe',label:'Seitwärts',key:'Q / E',codes:['KeyQ','KeyE','ArrowLeft','ArrowRight'],hint:'Seitwärts · auch ← / →'},
  {id:'sprint',label:'Rennen',key:'Shift',codes:['ShiftLeft','ShiftRight']},
  {id:'jump',label:'Springen',key:'Space',codes:['Space'],button:true},
  {id:'slam',label:'Tinten-Slam',key:'F',codes:['KeyF'],button:true},
  {id:'fire',label:'Zielen & schießen',key:'Klick',codes:[],hint:'Gegner oder Karte anklicken · halten für weitere Schüsse'},
  {id:'camera',label:'Kamera',key:'Rechts ziehen',codes:[],hint:'Rechts ziehen zum Drehen · Mausrad zum Zoomen'},
  {id:'pause',label:'Pause',key:'Esc',codes:['Escape'],button:true}
]);
export const MAX_EQUIPMENT_SLOTS=6;
export const actionForCode=code=>ACTIONS.find(a=>a.codes.includes(code));
export function readMovement(keys){
  const axis=id=>{const codes=ACTIONS.find(a=>a.id===id).codes;return Number(codes.some((code,i)=>i%2===0&&keys.has(code)))-Number(codes.some((code,i)=>i%2===1&&keys.has(code)));};
  return {x:-axis('strafe'),z:axis('move'),turn:-axis('turn'),sprint:ACTIONS.find(a=>a.id==='sprint').codes.some(code=>keys.has(code))};
}
export function isTextEntry(target){return !!(target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName||''));}
export function canAct(c){return ['play','cleared'].includes(c.rf?.phase) && !c.state.settingsOn && !c.pc.stunRemaining && !c.pc._tot;}
export function createActionDispatcher(c,{slam,hidden=()=>document.hidden}={}){
  return id=>{
    if(id==='pause'){c.setState({settingsOn:!c.state.settingsOn});c.host.input.reset();c.gf.cancelShot();return true;}
    if(hidden() || !canAct(c))return false;
    if(id==='slam')return slam();
    if(id==='jump'){
      // Exactly the same edge read by Player.beforeStep; also interrupts a pending slam.
      c.host.input.state.jumpPressed=true;c.host.input.state.any=true;return true;
    }
    return false;
  };
}
