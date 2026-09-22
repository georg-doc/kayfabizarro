// The Player's fixed simulation step owns the entire slam, including cooldown.
export class SlamAction {
  constructor(player,{allowed=()=>true,impact=()=>{}}={}){
    this.pc=player;this.allowed=allowed;this.impact=impact;this.cooldown=0;this.pending=0;this.stage='idle';
  }
  request(){
    const p=this.pc;
    if(!this.allowed() || !p.amBoden || p.stunRemaining>0 || this.cooldown>0 || this.stage!=='idle')return false;
    this.cooldown=3;this.pending=.22;this.stage='rise';
    p.interruptHit?.();p.vel.y=3;p.amBoden=false;
    return true;
  }
  cancel(resetCooldown=false){this.pending=0;this.stage='idle';if(resetCooldown)this.cooldown=0;}
  beforeStep(dt,jumpPressed,jumpSpeed){
    this.cooldown=Math.max(0,this.cooldown-dt);
    if(!this.allowed() || this.pc.stunRemaining>0){this.cancel();return;}
    if(this.stage==='idle')return;
    // A new jump wins over a pending slam. It never gets overwritten by a timer.
    if(jumpPressed){this.cancel();this.pc.vel.y=Math.max(this.pc.vel.y,jumpSpeed);return;}
    if(this.stage==='rise'){
      this.pending=Math.max(0,this.pending-dt);
      if(this.pending===0){this.stage='fall';this.pc.vel.y=Math.min(this.pc.vel.y,-10);}
    }
  }
  afterStep(){
    if(this.stage==='fall' && this.pc.amBoden){this.cancel();this.impact();}
  }
}
