export const SOURCE_FAMILIES = Object.freeze([
  ['kaykit','KayKit'],
  ['tiny-treats','Tiny Treats'],
  ['kenney','Kenney'],
  ['quaternius','Quaternius'],
  ['kfb','KFB'],
  ['public-domain','Public domain'],
  ['other','Other'],
]);

function hay(pack) {
  return [pack?.packId, pack?.displayName, pack?.root].map((v)=>String(v||'').toLowerCase()).join(' ');
}

export function sourceFamilyForPack(pack) {
  const text=hay(pack);
  if (/kay[ _-]?kit/.test(text)) return 'kaykit';
  if (/tiny[ _-]?treats/.test(text)) return 'tiny-treats';
  if (/kenney/.test(text)) return 'kenney';
  if (/quaternius/.test(text)) return 'quaternius';
  if (/public[_ /-]?domain/.test(text)) return 'public-domain';
  if (/(^|[ /_-])kfb([ /_-]|$)|kayfabizarro/.test(text)) return 'kfb';
  return 'other';
}

export function sourceFamilyLabel(id) {
  return SOURCE_FAMILIES.find(([value])=>value===id)?.[1] || id || 'All source families';
}

export function visibleSourceFamilies(packs=[]) {
  const counts=new Map();
  for(const pack of packs){
    const id=sourceFamilyForPack(pack);
    counts.set(id,(counts.get(id)||0)+1);
  }
  return SOURCE_FAMILIES
    .filter(([id])=>counts.has(id))
    .map(([id,label])=>({id,label,packCount:counts.get(id)}));
}

export function packLabel(pack) {
  const label=String(pack?.displayName || pack?.packId || 'pack');
  const count=Number(pack?.assetCount||0);
  return count ? `${label} · ${count.toLocaleString()} assets` : label;
}

export function collectionLabel(collection) {
  const label=String(collection?.path || 'collection');
  const count=Number(collection?.assetCount||0);
  return count ? `${label} · ${count.toLocaleString()}` : label;
}
