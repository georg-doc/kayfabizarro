/* KFB Bone2D v1 — explicit SVG pivot transforms.
   Keeps source geometry immutable; bind transforms and motion transforms live on wrapper <g> nodes. */
(function(global){
  const n=v=>Number.isFinite(v)?v:0;
  class Bone2D{
    constructor(node,pivot={x:0,y:0}){this.node=node;this.pivot={x:n(pivot.x),y:n(pivot.y)};this.pose={};}
    setPivot(p){this.pivot={x:n(p.x),y:n(p.y)};return this;}
    setPose(p={}){this.pose=Object.assign({},p);this.render();return this;}
    render(){
      const p=this.pose,x=n(p.x),y=n(p.y),r=n(p.r),sx=p.sx==null?1:p.sx,sy=p.sy==null?1:p.sy,kx=n(p.kx),q=this.pivot;
      this.node.setAttribute('transform',`translate(${x} ${y}) translate(${q.x} ${q.y}) rotate(${r}) skewX(${kx}) scale(${sx} ${sy}) translate(${-q.x} ${-q.y})`);
    }
    reset(){this.setPose({});}
  }
  function bindMatrix(src,tgt,deg){
    const a=deg*Math.PI/180,c=Math.cos(a),s=Math.sin(a);
    return [c,s,-s,c,tgt.x-c*src.x+s*src.y,tgt.y-s*src.x-c*src.y];
  }
  function matrixString(m){return `matrix(${m.join(' ')})`;}
  global.KFBBone2D={Bone2D,bindMatrix,matrixString};
})(window);
