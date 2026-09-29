(function(){var M=window.__KFB_MODS,U={},done={};
function url(k){if(U[k])return U[k];var t=M[k].replace(/import\.meta\.url/g,'"https://kfb.invalid/x/"');t=t.replace(/fetch\(here\('brain-world\.v1\.bin'\)\)/,'fetch(window.__KFB_BIN)');
t=t.replace(/from\s+'(\.[^']+)'/g,function(_,p){return "from '"+url(p.split('/').pop())+"'"});U[k]=URL.createObjectURL(new Blob([t],{type:'text/javascript'}));return U[k];}
import(url('brain-world.v8.js')).then(function(m){window.__KFB_BRAIN={boot:m.boot};window.dispatchEvent(new Event('kfbBrainReady'));}).catch(function(e){console.error('standalone',e);});})();