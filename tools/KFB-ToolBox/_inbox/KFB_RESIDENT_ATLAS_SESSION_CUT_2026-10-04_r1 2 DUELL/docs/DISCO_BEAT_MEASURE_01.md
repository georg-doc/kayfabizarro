# KFB-Beatmessung 01 · Disco-Rotation (S40e · 2026-09-25)

Gemessen am echten Audio, im Browser (Web Audio `decodeAudioData`), nicht aus den Prompts.
Quelle: `media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/` @ `5f268e80`. Jede Datei per Git-Blob-SHA geprüft (steht in `data/disco-playlist-01.json`).

## Verfahren

1. **Tempo:** Spektralfluss (FFT 1024, Hop 10 ms, lokales Mittel abgezogen) → Autokorrelation 70–180 BPM mit weicher Vorliebe um 115 → Raster über BPM × Phase fein (0,005 BPM). Halbe/doppelte Tempi gegengeprüft.
2. **Schlaglage:** Kick-Hüllkurve (2 × Einpol-Tiefpass 120 Hz, 2,5 ms) über die Schlagperiode gefaltet → Spitze.
3. **Verfolgung:** vom ersten Schlag an je Schlag ±12 % Periode suchen, Phase ×0,3 und Periode ×0,04 nachführen, nur bei ausreichender Kick-Energie. Danach über ±12 Schläge linear geglättet. Anker alle 8 Schläge → `tempoMap`.
4. **Kalibrierung:** Kick-Energie liegt hinter dem Anschlag. Versatz 0,048 s so gesetzt, dass Rubbish Groove den librosa-Wert trifft: gemessen **0,462 s** gegen librosa 0,461–0,465 s, Tempo 100,00 BPM in allen 30-s-Fenstern.

## Ergebnis

| Titel | Prompt BPM | gemessen | verfolgt je 30 s | max. Abweichung von linear (ms) | Einordnung | erster Schlag (s) |
|---|---|---|---|---|---|---|
| Rubbish Groove | – | **100** | 100 / 100 / 100 / 100 | – | stabil | 0.465 |
| Skeleton Shuffle Deluxe 01 | 112 | **111.8** | 111.9 / 112.21 / 112.23 / 111.96 / 111.94 / 111.39 / 110.52 | 201 | driftet | 0.009 |
| Orc Cumbia Wobble 01 | 98 | **97.61** | 97.63 / 97.68 / 97.64 / 97.62 / 97.55 / 97.58 | 16 | stabil | 0.182 |
| Demon Lord Afro-Strut 01 | 108 | **103.18** | 103.12 / 103.22 / 102.96 / 102.97 / 103.41 / 103.61 | 68 | leicht schwankend | 0.039 |
| Witch Hat Acid Picnic 01 | 122 | **125.45** | 125.02 / 125.01 / 124.82 / 125.53 / 125.98 / 125.33 / 124.87 / 125.43 | 69 | leicht schwankend | 0.056 |
| Toy Soldier Brass Riot 01 | 126 | **130.28** | 129.71 / 129.71 / 129.87 / 129.26 / 130.55 / 129.7 / 130.76 / 131.35 | 152 | driftet | 0.363 |
| KFB Desert Preacher 01 | – | **107.01** | 106.79 / 107.03 / 106.99 / 107.05 / 106.92 / 107.15 / 107.23 | 27 | stabil | 0.476 |
| KFB BraveNewWorldNews 01 | – | **116.78** | 118.23 / 117.79 / 117.19 / 117.25 / 116.19 / 116.27 / 116.9 | 268 | driftet | 0.168 |

- **Die Prompt-BPM stimmen nicht:** Demon Lord läuft bei 103 statt 108, Toy Soldier bei 130 statt 126, Witch Hat bei 125 statt 122. Suno hält sich nicht an die Zahl im Prompt.
- **Drift:** Toy Soldier zieht von 129,7 auf 131,4 an, Skeleton Shuffle fällt am Ende auf 110,5, BraveNewWorldNews wandert zwischen 118,2 und 116,2 (Tape-Collage). Eine feste BPM-Zahl liefe dort bis zu 0,27 s aus dem Takt. Deshalb folgt die Uhr der Tempokarte.
- **Taktanfang ist gesetzt, nicht gemessen.** Takt 1 = erster verfolgter Schlag. Die Kick-Verteilung über die vier Schläge trennt den Taktanfang nicht sicher (fast überall Four-on-the-floor). Im Panel „Takt ±1 Schlag“.
- Witch Hat ist bis ~7 s leise (Intro). Die Verfolgung läuft dort mit wenig Sicherheit (0,53).

## Quelltext (beide Durchgänge, so gelaufen)

```js
const C='5f268e806a4f48b68944ce025ee8f1d2837a0590', D='media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/';
const raw=p=>'https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+C+'/'+p.split('/').map(encodeURIComponent).join('/');
function fft(re,im){const n=re.length;for(let i=1,j=0;i<n;i++){let b=n>>1;for(;j&b;b>>=1)j^=b;j^=b;if(i<j){[re[i],re[j]]=[re[j],re[i]];[im[i],im[j]]=[im[j],im[i]];}}
for(let len=2;len<=n;len<<=1){const a=-2*Math.PI/len,wr=Math.cos(a),wi=Math.sin(a);for(let i=0;i<n;i+=len){let cr=1,ci=0;for(let j=0;j<len/2;j++){const ur=re[i+j],ui=im[i+j],k=i+j+len/2,vr=re[k]*cr-im[k]*ci,vi=re[k]*ci+im[k]*cr;re[i+j]=ur+vr;im[i+j]=ui+vi;re[k]=ur-vr;im[k]=ui-vi;const t=cr*wr-ci*wi;ci=cr*wi+ci*wr;cr=t;}}}}
async function gitBlob(u8){const head=new TextEncoder().encode('blob '+u8.length+'\0');const all=new Uint8Array(head.length+u8.length);all.set(head);all.set(u8,head.length);return [...new Uint8Array(await crypto.subtle.digest('SHA-1',all))].map(v=>v.toString(16).padStart(2,'0')).join('');}
async function analyse(name){
 const u8=new Uint8Array(await (await fetch(raw(D+name))).arrayBuffer());const blob=await gitBlob(u8);
 const ab=await new OfflineAudioContext(1,44100,44100).decodeAudioData(u8.buffer.slice(0));
 const sr=ab.sampleRate,Lx=ab.length,x=new Float32Array(Lx);for(let c=0;c<ab.numberOfChannels;c++){const d=ab.getChannelData(c);for(let i=0;i<Lx;i++)x[i]+=d[i]/ab.numberOfChannels;}
 const N=1024,H=441,fps=sr/H,F=Math.floor((Lx-N)/H);const win=new Float32Array(N).map((_,i)=>0.5-0.5*Math.cos(2*Math.PI*i/N));
 const env=new Float32Array(F);let prev=new Float32Array(N/2);const re=new Float32Array(N),im=new Float32Array(N);
 for(let f=0;f<F;f++){for(let i=0;i<N;i++){re[i]=x[f*H+i]*win[i];im[i]=0;}fft(re,im);let s=0;for(let k=1;k<N/2;k++){const m=Math.log1p(100*Math.hypot(re[k],im[k]));const d=m-prev[k];if(d>0)s+=d;prev[k]=m;}env[f]=s;}
 const e=new Float32Array(F);for(let f=0;f<F;f++){let a=0,n=0;for(let j=Math.max(0,f-8);j<=Math.min(F-1,f+8);j++){a+=env[j];n++;}e[f]=Math.max(0,env[f]-a/n);}
 const at=(t)=>{const p=(t*sr-N/2)/H;const i=p|0;if(i<0||i>=F-1)return 0;const w=p-i;return e[i]*(1-w)+e[i+1]*w;};
 let best=[0,0];for(let bpm=70;bpm<=180;bpm+=0.5){const lag=fps*60/bpm;let s=0,n=0;for(let f=0;f+lag<F-1;f++){const i=(f+lag)|0,w=f+lag-i;s+=e[f]*(e[i]*(1-w)+e[i+1]*w);n++;}s/=n;const prior=Math.exp(-0.5*Math.pow(Math.log2(bpm/115)/0.9,2));if(s*prior>best[1])best=[bpm,s*prior];}
 const grid=(t0,t1,b0,b1,step,ps)=>{let B={s:-1};for(let bpm=b0;bpm<=b1+1e-9;bpm+=step){const P=60/bpm;for(let ph=0;ph<P;ph+=ps){let s=0,n=0;for(let t=t0+ph;t<t1;t+=P){s+=at(t);n++;}s/=n;if(s>B.s)B={s,bpm,ph};}}return B;};
 const g=grid(0,ab.duration,best[0]-1.5,best[0]+1.5,0.05,0.008);const g2=grid(0,ab.duration,g.bpm-0.06,g.bpm+0.06,0.005,0.004);
 const alt=[g2.bpm/2,g2.bpm*2].filter(b=>b>=60&&b<=200).map(b=>[+b.toFixed(2),+(grid(0,ab.duration,b,b,1,0.004).s/g2.s).toFixed(2)]);
 const segs=[];for(let t=0;t+20<=ab.duration;t+=30)segs.push(+grid(t,Math.min(t+30,ab.duration),g2.bpm-1,g2.bpm+1,0.1,0.01).bpm.toFixed(2));
 const bpm=+g2.bpm.toFixed(2),P=60/bpm;
 const hop=110,KF=Math.floor(Lx/hop),lo=new Float32Array(KF);const a=Math.exp(-2*Math.PI*120/sr);let s1=0,s2=0,acc=0;for(let i=0;i<Lx;i++){s1=a*s1+(1-a)*x[i];s2=a*s2+(1-a)*s1;acc+=s2*s2;if((i+1)%hop===0){lo[(i+1)/hop-1]=acc;acc=0;}}
 const B=48,prof=new Array(B).fill(0);for(let f=0;f<KF;f++){const t=(f+0.5)*hop/sr;prof[Math.floor(((t%P)/P)*B)%B]+=lo[f];}
 const mean=prof.reduce((p,c)=>p+c,0)/B;let pk=0;for(let i=1;i<B;i++)if(prof[i]>prof[pk])pk=i;
 const y0=prof[(pk-1+B)%B],y1=prof[pk],y2=prof[(pk+1)%B];const d=(y0-y2)/(2*(y0-2*y1+y2)||1);const kickPeak=((pk+0.5+d)/B)*P;
 const slot=[0,0,0,0];for(let f=0;f<KF;f++){const t=(f+0.5)*hop/sr;const bp=(t-kickPeak)/P;const r=bp-Math.round(bp);if(Math.abs(r)<1/6){slot[((Math.round(bp)%4)+4)%4]+=lo[f];}}
 let emax=0;for(let f=0;f<F;f++)emax=Math.max(emax,e[f]);let f0=0;for(;f0<F;f0++)if(e[f0]>0.25*emax)break;
 return {name,gitBlob:blob,bytes:u8.length,dur:+ab.duration.toFixed(2),bpm,segs,alt,fluxPhase:+g2.ph.toFixed(3),kickPeak:+kickPeak.toFixed(3),kickContrast:+(y1/mean).toFixed(2),slot:slot.map(v=>+(v/Math.max(...slot)).toFixed(2)),tFirst:+((f0*H+N/2)/sr).toFixed(3)};
}
```

```js
const C='5f268e806a4f48b68944ce025ee8f1d2837a0590', D='media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/';
const raw=p=>'https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+C+'/'+p.split('/').map(encodeURIComponent).join('/');
async function track(name,bpm,kickPeak){
 const u8=new Uint8Array(await (await fetch(raw(D+name))).arrayBuffer());
 const ab=await new OfflineAudioContext(1,44100,44100).decodeAudioData(u8.buffer);
 const sr=ab.sampleRate,Lx=ab.length,x=new Float32Array(Lx);for(let c=0;c<ab.numberOfChannels;c++){const d=ab.getChannelData(c);for(let i=0;i<Lx;i++)x[i]+=d[i]/ab.numberOfChannels;}
 const hop=110,KF=Math.floor(Lx/hop),lo=new Float32Array(KF);const a=Math.exp(-2*Math.PI*120/sr);let s1=0,s2=0,acc=0;for(let i=0;i<Lx;i++){s1=a*s1+(1-a)*x[i];s2=a*s2+(1-a)*s1;acc+=s2*s2;if((i+1)%hop===0){lo[(i+1)/hop-1]=acc;acc=0;}}
 const tf=f=>(f+0.5)*hop/sr, ft=t=>Math.round(t*sr/hop-0.5);
 let P=60/bpm,t=kickPeak;while(t-P>0)t-=P;
 const beats=[],conf=[];let gm=0;for(let f=0;f<KF;f++)gm+=lo[f];gm/=KF;
 while(t<ab.duration-0.05){
  const w=0.12*P;let sw=0,st=0,mx=0;for(let f=ft(t-w);f<=ft(t+w);f++){if(f<0||f>=KF)continue;const g=Math.exp(-0.5*Math.pow((tf(f)-t)/(0.06*P),2));const v=lo[f]*g;sw+=v;st+=v*tf(f);mx=Math.max(mx,lo[f]);}
  const ok=sw>0&&mx>1.2*gm;beats.push(t);conf.push(ok?1:0);
  if(ok){const err=st/sw-t;t+=0.3*err;P+=0.04*err;}
  t+=P;
 }
 // smooth: fit local linear over ±12 beats weighted by conf
 const n=beats.length,sm=new Array(n);
 for(let i=0;i<n;i++){let W=0,Sx=0,Sy=0,Sxx=0,Sxy=0;for(let j=Math.max(0,i-12);j<=Math.min(n-1,i+12);j++){const w=conf[j]?1:0.05;W+=w;Sx+=w*j;Sy+=w*beats[j];Sxx+=w*j*j;Sxy+=w*j*beats[j];}const b=(W*Sxy-Sx*Sy)/(W*Sxx-Sx*Sx),a0=(Sy-b*Sx)/W;sm[i]=a0+b*i;}
 // global linear fit
 let W=0,Sx=0,Sy=0,Sxx=0,Sxy=0;for(let i=0;i<n;i++){const w=conf[i];W+=w;Sx+=w*i;Sy+=w*sm[i];Sxx+=w*i*i;Sxy+=w*i*sm[i];}
 const b=(W*Sxy-Sx*Sy)/(W*Sxx-Sx*Sx),a0=(Sy-b*Sx)/W;let dev=0;for(let i=0;i<n;i++)if(conf[i])dev=Math.max(dev,Math.abs(sm[i]-(a0+b*i)));
 const segBpm=[];for(let i=0;i+16<n;i+=32){segBpm.push(+(60*16/(sm[i+16]-sm[i])).toFixed(2));}
 const anchors=[];for(let i=0;i<n;i+=8)anchors.push([+(sm[i]-0.048).toFixed(3),i]);if((n-1)%8)anchors.push([+(sm[n-1]-0.048).toFixed(3),n-1]);
 return {name,beats:n,conf:+(conf.reduce((p,c)=>p+c,0)/n).toFixed(2),fitBpm:+(60/b).toFixed(3),fitPhase:+(a0-0.048).toFixed(3),maxDevMs:Math.round(dev*1000),segBpm,anchors};
}
```
