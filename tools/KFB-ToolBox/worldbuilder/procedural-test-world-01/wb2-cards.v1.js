/* Canonical Card Builder intake. Registry remains the sole catalog owner. */
import * as THREE from 'three';
import {createCardBuilder} from '../../../../skills/kfb-card-builder.js';
const PIN='9c2fee62b815f19cf967867f54985bd22e3f222b';
const raw=path=>'https://raw.githubusercontent.com/georg-doc/kayfabizarro/'+PIN+'/'+path.split('/').map(encodeURIComponent).join('/');
export const CARD_REFS=Object.freeze(['ignore_dystopia:1','forget_utopia:1','embrace_protopia:1','anti_rules_toolkit:1']);
export const CROP_EVIDENCE=Object.freeze({
  futureDecks:'registry/assets/v1/decks/{ignore_dystopia,forget_utopia,embrace_protopia}.json @ 378b209355b13304e3cff656ec0806ca5b89df28',
  antiRules:{pdf:'media/kfb/Anti-Rules_Toolkit - ADD web ID.pdf',commit:PIN,blob:'b903037242ef1b10623ff43e43bcc1bb8889a7df',page:2,onlyCard:1,normalizedCrop:{x:.0971428571,y:.1651728553,w:.3978571429,h:.3841229193},semanticConflict:'PDF: Cry harder, Esq. / JSON: Dry leader. Busy. — PDF owns visual artwork'}
});
export function createMvpCards(){
  const builder=createCardBuilder({THREE,params:{indexUrl:raw('media/kfb/index.json'),baseUrl:raw('media/kfb'),deckOverrides:{
    // These are measured Card 1 cells at native PDF image size 1553×866, never whole-deck certification.
    ignore_dystopia:{cardCrops:{1:{"x":0.06696716,"y":0.15588915,"w":0.39021249,"h":0.37528868}},pdf:'Deck_B_DYSTOPIA_-_ANATOMY_OF_A_TRAP web H.pdf',data:'Deck_B_DYSTOPIA_-_ANATOMY_OF_A_TRAP_web_H.pdf.json',cardGrid:{x:.06,y:.117,w:.879,h:.823,gapX:.09,gapY:.01}},
    forget_utopia:{cardCrops:{1:{"x":0.04893754,"y":0.03464203,"w":0.38892466,"h":0.45034642}},pdf:'Deck_A_UTOPIA_-_Forget_Utopia web H.pdf',data:'Deck_A_UTOPIA_-_Forget_Utopia_web_H.pdf.json',cardGrid:{x:.05,y:.037,w:.899,h:.947,gapX:.135,gapY:.01}},
    embrace_protopia:{cardCrops:{1:{"x":0.04636188,"y":0.08198614,"w":0.43464263,"h":0.38568129}},pdf:'Deck_C_PROTOPIA_-_Protopia_Sketchbook_(1) web H.pdf',data:'Deck_C_PROTOPIA_-_Protopia_Sketchbook_(1)_web_H.pdf.json',cardGrid:{x:.048,y:.093,w:.903,h:.822,gapX:.022,gapY:.02}},
    // Only the actually measured TL card is admitted; remaining Anti-Rules crops are unproven.
    anti_rules_toolkit:{allowedCardNumbers:[1],cardGrid:{x:.0971428571,y:.1651728553,w:.7957142858,h:.7682458386,gapX:0,gapY:0}}
  }}});
  const cards=new Map();
  return{builder,cards,async load(ref){if(!CARD_REFS.includes(ref))throw Error('Unadmitted MVP Card '+ref);if(cards.has(ref))return cards.get(ref);
    const [deck,n]=ref.split(':');let resolve,reject;const ready=new Promise((ok,no)=>{resolve=ok;reject=no});
    const card=await builder.makeById(deck,+n,{width:3,onArt:()=>resolve(),onFail:e=>reject(Error('Required canonical card artwork: '+ref+' · '+e))});
    if(!card)throw Error('Canonical Card missing '+ref);card.group.name=ref;card.group.userData.cardRef=ref;
    card.group.userData.sourceRecord={assetId:ref,packId:deck,source:{commit:PIN,path:'media/kfb/index.json',blobSha:null}};
    cards.set(ref,card);await ready;if(card.artState!=='artwork')throw Error('Canonical art not rendered '+ref);return card;
  },evidence(){return [...cards].map(([ref,c])=>({ref,artState:c.artState,sourcePin:PIN,cropEvidence:CROP_EVIDENCE}))}};
}
