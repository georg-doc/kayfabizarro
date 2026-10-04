const id=document.body.dataset.city;
const status=document.querySelector('#status');
try{
  const r=await fetch('/kfb-hub/free-roam/cities.json',{cache:'no-store'});
  if(!r.ok)throw new Error('city catalog '+r.status);
  const catalog=await r.json();
  const city=(catalog.cities||[]).find(x=>x.id===id);
  if(!city)throw new Error('city not in catalog');
  document.title='KFB Free Roam · '+city.title;
  document.querySelector('#title').textContent=city.title;
  document.querySelector('#subtitle').textContent=city.subtitle;
  document.querySelector('#state').textContent=city.status;
  const e=city.evidence||{};
  document.querySelector('#facts').innerHTML=
    '<dt>Bounds</dt><dd>'+e.bounds+'</dd>'+
    '<dt>Roads</dt><dd>'+e.roads+(e.driveableRoads!=null?' · '+e.driveableRoads+' driveable':'')+'</dd>'+
    '<dt>Buildings</dt><dd>'+e.buildings+'</dd>'+
    '<dt>Landuse</dt><dd>'+e.landuse+'</dd>'+
    (e.longestCorridor?'<dt>Drive corridor</dt><dd>'+e.longestCorridor+'</dd>':'')+
    '<dt>Source</dt><dd>'+e.sourceElements+' cached OSM elements</dd>'+
    '<dt>S0 gates</dt><dd>'+e.gates+'</dd>';
  const viewer=document.createElement('a');viewer.className='button';viewer.href=city.viewer.path;viewer.textContent='View current S1 city';
  document.querySelector('#viewer').replaceChildren(viewer);
  document.querySelector('#viewer-meta').textContent=city.viewer.status;
  if(city.drive?.published&&city.drive.path){
    const drive=document.createElement('a');drive.className='button';drive.href=city.drive.path;drive.textContent='Drive current city';
    document.querySelector('#drive').replaceChildren(drive);
  } else {
    const d=document.createElement('span');d.className='disabled';d.textContent='Drive integration not published yet';document.querySelector('#drive').replaceChildren(d);
  }
  document.querySelector('#drive-meta').textContent=city.drive.status;
  document.querySelector('#recovery').href=city.recovery;
  document.querySelector('#source').href=city.source;
  document.querySelector('#acceptance').textContent=city.humanAcceptance;
  status.textContent='Catalog loaded · '+catalog.updated;
}catch(err){status.textContent='Status unavailable · '+err.message;}

