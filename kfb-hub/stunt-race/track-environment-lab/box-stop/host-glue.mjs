// Race-owned presentation/session seam for the frozen v0.8 experimental host.
// No changes to its geometry, controls, forces, drift constants, or contact calculations.
export const boxHostFooter=`
let boxPaused=false,boxMode='original',boxDraw=null,boxFrame=null,boxReset=null;
const acceptedStep=step,acceptedReset=reset,acceptedRender=renderer.render.bind(renderer);
const clearDrivingInput=()=>{Object.keys(keys).forEach(k=>keys[k]=false)};
step=function(dt){
  const r=boxPaused?core.sample(state.s):acceptedStep(dt);
  if(boxMode==='deformer'){visualRoot.rotation.set(0,0,0);visualRoot.position.set(0,FEEL.hoverBase,0)}
  if(boxFrame)boxFrame(dt,Object.freeze({...window.__KFB_RACE_TELEMETRY__,impactSide:state.impactSide,paused:boxPaused}));
  return r;
};
reset=function(){acceptedReset();clearDrivingInput();if(boxReset)boxReset()};
UI.reset.onclick=reset;
renderer.render=function(sc,cam){if(boxDraw)boxDraw(renderer,acceptedRender,sc,cam);else acceptedRender(sc,cam)};
export const boxPort=Object.freeze({
  pause(on){boxPaused=!!on;clearDrivingInput()},
  get paused(){return boxPaused},
  setMode(mode){boxMode=mode==='deformer'?'deformer':'original';visualRoot.rotation.set(0,0,0);visualRoot.position.set(0,FEEL.hoverBase,0)},
  mount(group){visualRoot.clear();visualRoot.add(group);currentVisual=group;baseYaw=0;userFlip=0},
  restart(){reset();auto=false;UI.auto.textContent='AUTO: OFF';mapView=false;UI.map.textContent='MAP';acceptedStep(0)},
  onFrame(fn){boxFrame=fn},onReset(fn){boxReset=fn},drawWith(fn){boxDraw=fn},
  clearInput:clearDrivingInput,
  state(){return {...state}},
  diagnostics(){return {paused:boxPaused,visualMode:boxMode,routeHash:core.hash,contactWidth:FLOW.flow.proxyHalfWidth,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures}},
  // For an independent overlay camera only. The Race chase camera remains private.
  dimensions(){return {width:innerWidth,height:innerHeight,pixelRatio:renderer.getPixelRatio()}}
});
`;
