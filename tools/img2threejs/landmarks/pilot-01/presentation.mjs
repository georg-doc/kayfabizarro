/** Thin adapter onto City Lab's existing palette. No second city-style owner. */
import {materialPalette, pickStable} from '../../../osm-city-lab/src/style/kfb-city-materials.js';
export const CITY_STYLE_URL = '../../../osm-city-lab/styles/kfb-city-v0.json';
export const NATURAL = {
 eiffel:{structure:'#7f6857',secondary:'#a58b70',upper:'#564e4c',accent:'#bc9a65',glazing:'#526975',base:'#b4a997'},
 giza:{structure:'#ccac75',secondary:'#b89766',upper:'#ede0bd',accent:'#9e7159',glazing:'#495660',base:'#bdad8b'},
 stonehenge:{structure:'#98978a',secondary:'#747e73',upper:'#b8b7a4',accent:'#aaa895',glazing:'#526975',base:'#ada588'}
};
export function zoneColours(asset,style,mode='city'){
 const p=materialPalette(style),id=asset.id;
 const zone={structure:pickStable(p['building-pale'],id),secondary:pickStable(p['building-warm'],id),upper:pickStable(p.roof,id),accent:pickStable(p.accent,id),glazing:pickStable(p.window,id),base:p.sidewalk};
 if(id==='eiffel'){zone.structure=pickStable(p['building-industrial'],id);zone.secondary=pickStable(p['building-warm'],id);}
 if(mode==='natural')return {...NATURAL[id]};
 if(mode==='colour')return {...zone,structure:'#48b5a8',secondary:'#de715e',upper:'#76569d',accent:'#eed067',glazing:'#345764'};
 if(mode==='zones')return {structure:'#d6745b',secondary:'#58a393',upper:'#7964bc',accent:'#e1bb40',glazing:'#3988b7',base:'#77766e'};
 if(mode!=='city')throw Error('Unknown colour mode: '+mode);
 return zone;
}
