(async()=>{ const tb=window.__kfbTB; const t0=Date.now();
 await tb.selfTest(); const st=(tb.state.tests||[]).map(t=>({n:t.name,ok:t.ok,d:String(t.detail).slice(0,160)}));
 const t1=Date.now(); let ea=null, eaErr=null; try{ ea=await tb.editAcc(); }catch(e){eaErr=String(e).slice(0,300)}
 return {selftest:{pass:st.filter(t=>t.ok).length,total:st.length,fails:st.filter(t=>!t.ok),secs:(t1-t0)/1000}, editAcc: ea?{status:ea.status,rows:(ea.rows||[]).map(r=>({n:r.name,ok:r.ok,d:String(r.detail).slice(0,140)}))}:null, eaErr, t24: st.filter(t=>/^2[2-4]/.test(t.n)||/splay|dx/i.test(t.n))}; })()
