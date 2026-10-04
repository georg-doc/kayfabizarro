import * as K from './ink.mjs';
const W=800,H=447,seed=4242,S=4;
const pts=K.contour('card',seed,W,H);
const quads=[];
const g={fillStyle:'',cur:null,beginPath(){},moveTo(x,y){this.cur=[[x,y]];quads.push(this.cur)},lineTo(x,y){this.cur.push([x,y])},closePath(){},fill(){}};
K.drawInk('card',g,pts,W,H,seed);
const grow=K.maskGrow('card',pts,W,H,seed);
const m=K.measureInk(pts,W,H,'card',seed);
console.log(JSON.stringify({pts,quads,grow,color:g.fillStyle,measure:m,version:K.INK_CANON_VERSION}));
