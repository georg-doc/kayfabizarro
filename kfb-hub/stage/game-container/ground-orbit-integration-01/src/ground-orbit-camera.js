import * as THREE from 'three';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const damp=(current,target,rate,dt)=>current+(target-current)*(1-Math.exp(-rate*dt));
const wrap=(a)=>{
  const PI=Math.PI, TAU=PI*2;
  a=(a+PI)%TAU;
  if(a<0)a+=TAU;
  return a-PI;
};

export class GroundOrbitCamera {
  constructor(camera, domElement, opts={}) {
    if(!camera) throw new Error('GroundOrbitCamera requires camera');
    this.camera=camera;
    this.domElement=domElement||null;
    this.enabled=true;
    this.target=null;

    this.distance=Number(opts.distance)||7.5;
    this.targetDistance=this.distance;
    this.minDistance=Number(opts.minDistance)||3.4;
    this.maxDistance=Number(opts.maxDistance)||15;
    this.pitch=Number(opts.pitch)||0.34;
    this.targetPitch=this.pitch;
    this.minPitch=Number(opts.minPitch)||0.08;
    this.maxPitch=Number(opts.maxPitch)||1.18;
    this.yaw=0;
    this.targetYaw=0;
    this.focusHeight=Number(opts.focusHeight)||1.15;
    this.sensitivity=Number(opts.sensitivity)||0.006;
    this.zoomSensitivity=Number(opts.zoomSensitivity)||0.0018;
    this.dragging=false;
    this.pointerId=null;
    this._moved=false;
    this._startX=0;
    this._startY=0;
    this._lastX=0;
    this._lastY=0;

    this._focus=new THREE.Vector3();
    this._desiredFocus=new THREE.Vector3();
    this._desiredPos=new THREE.Vector3();
    this._offset=new THREE.Vector3();

    this._onPointerDown=(e)=>{
      if(!this.enabled || !this.domElement) return;
      if(e.button!==0 && e.button!==1 && e.button!==2) return;
      this.dragging=true;
      this.pointerId=e.pointerId;
      this._moved=false;
      this._startX=this._lastX=e.clientX;
      this._startY=this._lastY=e.clientY;
      try{this.domElement.setPointerCapture?.(e.pointerId);}catch{}
      e.preventDefault();
    };
    this._onPointerMove=(e)=>{
      if(!this.enabled || !this.dragging || e.pointerId!==this.pointerId) return;
      const dx=e.clientX-this._lastX;
      const dy=e.clientY-this._lastY;
      this._lastX=e.clientX;
      this._lastY=e.clientY;
      if(Math.hypot(e.clientX-this._startX,e.clientY-this._startY)>3)this._moved=true;
      this.targetYaw=wrap(this.targetYaw-dx*this.sensitivity);
      this.targetPitch=clamp(this.targetPitch-dy*this.sensitivity,this.minPitch,this.maxPitch);
      e.preventDefault();
    };
    this._endPointer=(e)=>{
      if(!this.dragging || (this.pointerId!=null && e.pointerId!==this.pointerId)) return;
      try{this.domElement?.releasePointerCapture?.(this.pointerId);}catch{}
      this.dragging=false;
      this.pointerId=null;
    };
    this._onWheel=(e)=>{
      if(!this.enabled) return;
      const factor=Math.exp(e.deltaY*this.zoomSensitivity);
      this.targetDistance=clamp(this.targetDistance*factor,this.minDistance,this.maxDistance);
      e.preventDefault();
    };
    this._onContext=(e)=>{if(this.enabled)e.preventDefault();};
    this._onKey=(e)=>{
      if(!this.enabled || e.repeat) return;
      if(e.code==='KeyC' && this.target) this.recenter(this.target);
    };

    if(this.domElement?.addEventListener){
      this.domElement.addEventListener('pointerdown',this._onPointerDown,{passive:false});
      this.domElement.addEventListener('pointermove',this._onPointerMove,{passive:false});
      this.domElement.addEventListener('pointerup',this._endPointer,{passive:false});
      this.domElement.addEventListener('pointercancel',this._endPointer,{passive:false});
      this.domElement.addEventListener('wheel',this._onWheel,{passive:false});
      this.domElement.addEventListener('contextmenu',this._onContext);
    }
    window.addEventListener('keydown',this._onKey);
  }

  _targetPosition(target,out){
    const p=target?.position||target?.object3D?.position;
    if(p) out.copy(p); else out.set(0,0,0);
    out.y+=this.focusHeight;
    return out;
  }

  recenter(target=this.target){
    if(!target)return;
    const h=Number.isFinite(target.heading)?target.heading:(target.object3D?.rotation?.y||0);
    this.targetYaw=wrap(h+Math.PI);
  }

  snap(target){
    this.target=target||null;
    if(!target)return;
    const h=Number.isFinite(target.heading)?target.heading:(target.object3D?.rotation?.y||0);
    this.yaw=this.targetYaw=wrap(h+Math.PI);
    this.pitch=this.targetPitch=0.34;
    this.distance=this.targetDistance=7.5;
    this._targetPosition(target,this._focus);
    this._applyPose(true);
  }

  _applyPose(force=false){
    const cp=Math.cos(this.pitch), sp=Math.sin(this.pitch);
    this._offset.set(
      Math.sin(this.yaw)*cp*this.distance,
      sp*this.distance,
      Math.cos(this.yaw)*cp*this.distance
    );
    this._desiredPos.copy(this._focus).add(this._offset);
    if(force)this.camera.position.copy(this._desiredPos);
    else this.camera.position.lerp(this._desiredPos,0.35);
    this.camera.up.set(0,1,0);
    this.camera.lookAt(this._focus);
    if(Math.abs(this.camera.fov-62)>0.01){
      this.camera.fov=62;
      this.camera.updateProjectionMatrix();
    }
  }

  update(dt,target=this.target){
    if(!this.enabled || !target)return;
    this.target=target;
    dt=clamp(Number(dt)||1/60,0.001,0.1);
    this._targetPosition(target,this._desiredFocus);
    this._focus.lerp(this._desiredFocus,1-Math.exp(-12*dt));
    const dy=wrap(this.targetYaw-this.yaw);
    this.yaw=wrap(this.yaw+dy*(1-Math.exp(-16*dt)));
    this.pitch=damp(this.pitch,this.targetPitch,16,dt);
    this.distance=damp(this.distance,this.targetDistance,14,dt);
    this._applyPose(false);
  }

  report(){
    return {
      enabled:this.enabled,
      dragging:this.dragging,
      yaw:this.yaw,
      targetYaw:this.targetYaw,
      pitch:this.pitch,
      targetPitch:this.targetPitch,
      distance:this.distance,
      targetDistance:this.targetDistance,
      minDistance:this.minDistance,
      maxDistance:this.maxDistance,
    };
  }

  dispose(){
    this.enabled=false;
    if(this.domElement?.removeEventListener){
      this.domElement.removeEventListener('pointerdown',this._onPointerDown);
      this.domElement.removeEventListener('pointermove',this._onPointerMove);
      this.domElement.removeEventListener('pointerup',this._endPointer);
      this.domElement.removeEventListener('pointercancel',this._endPointer);
      this.domElement.removeEventListener('wheel',this._onWheel);
      this.domElement.removeEventListener('contextmenu',this._onContext);
    }
    window.removeEventListener('keydown',this._onKey);
    this.target=null;
    this.dragging=false;
    this.pointerId=null;
  }
}
