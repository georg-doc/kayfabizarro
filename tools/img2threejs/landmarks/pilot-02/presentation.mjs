import {zoneColours as priorColours} from '../pilot-01/presentation.mjs';
import {materialPalette,pickStable} from '../../../osm-city-lab/src/style/kfb-city-materials.js';
export const NATURAL_02={
 pentagon:{structure:'#d8cfb6',secondary:'#c6bda7',upper:'#777c7b',accent:'#b3a07c',glazing:'#455860',base:'#c0b49e'},
 spasskaya:{structure:'#bd5540',secondary:'#eee0bd',upper:'#37796a',accent:'#d5af53',glazing:'#273a42',base:'#bcb39e'}
};
export function zoneColours(asset,style,mode='city'){
 const isNew=['pentagon','spasskaya','kremlin-wall'].includes(asset.id);
 if(!isNew)return priorColours(asset,style,mode);
 const id=asset.id==='kremlin-wall'?'spasskaya':asset.id;
 if(mode==='natural')return {...NATURAL_02[id]};
 const colours=priorColours(asset,style,mode);
 if(mode==='city'&&id==='spasskaya'){
  const p=materialPalette(style);colours.structure=pickStable(p['building-warm'],'spasskaya');colours.secondary=pickStable(p['building-pale'],'spasskaya');
 }
 return colours;
}
