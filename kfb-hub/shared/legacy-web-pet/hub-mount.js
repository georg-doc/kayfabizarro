import {mountLegacyWebPet} from './host.js';
if(new URLSearchParams(location.search).get('pet')!=='0'){
  const KEY='kfb.legacy-web-pet.settings.v0';
  const storage={
    async get(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}},
    async set(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch{}}
  };
  mountLegacyWebPet({frameSrc:'/kfb-hub/shared/legacy-web-pet/frame.html',storage,mode:'hub',debug:new URLSearchParams(location.search).get('petdebug')==='1'});
}
