import{rm,cp}from'node:fs/promises';await rm('dist',{recursive:true,force:true});await cp('probes/patch-transfer-r1/dist','dist',{recursive:true});
