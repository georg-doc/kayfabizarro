import {mountLegacyWebPet} from '../../kfb-hub/shared/legacy-web-pet/host.js';
const KEY='kfbLegacyWebPetSettings';
const storage={
  async get(){const x=await chrome.storage.local.get(KEY);return x[KEY]||{};},
  async set(v){await chrome.storage.local.set({[KEY]:v});}
};
mountLegacyWebPet({frameSrc:chrome.runtime.getURL('frame.html'),storage,mode:'extension'});
