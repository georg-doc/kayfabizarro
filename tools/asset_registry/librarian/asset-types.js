const browseStyle=document.createElement('link');
browseStyle.rel='stylesheet';
browseStyle.href='./browse-filters.css';
document.head.append(browseStyle);

export const ASSET_TYPES = [
  ['character','Character'],
  ['weapon','Weapon'],
  ['character-prop','Character prop'],
  ['environment-prop','Environment prop'],
  ['building','Building / structure'],
  ['nature','Nature / plant'],
  ['vehicle','Vehicle'],
  ['banner-signage','Banner / signage'],
  ['animation-source','Animation source'],
  ['texture-image','Texture / image'],
  ['audio','Audio'],
  ['other-3d','Other 3D'],
];

const RENDERABLE_FORMATS = new Set(['glb','gltf','obj','fbx','blend','dae','3ds']);
const WEAPON_WORDS = ['weapon','sword','axe','bow','crossbow','dagger','knife','mace','hammer','spear','staff','wand','gun','rifle','pistol','blaster','cannon','shield'];
const CHARACTER_PROP_WORDS = ['microphone','micstand','tool','pickaxe','shovel','hoe','fishing','lantern','torch','book','scroll','bag','backpack','jetpack','instrument','guitar','drum','radio'];
const BUILDING_WORDS = ['building','house','home','shop','market','store','tower','castle','wall','roof','door','window','garage','station','barn','factory','industrial','commercial','suburban','bridge','gate','fence'];
const NATURE_WORDS = ['tree','bush','plant','flower','grass','rock','mushroom','stump','log','cactus','palm','foliage','shrub','fern','forest','nature'];
const VEHICLE_WORDS = ['vehicle','car','truck','bus','van','bike','bicycle','motorcycle','boat','ship','spaceship','spacecraft','rover','tank','tractor','cart','wagon'];
const SIGN_WORDS = ['banner','flag','sign','poster','billboard','placard','emblem','badge'];

function text(record) {
  return [record?.name, record?.path, record?.packId, record?.collectionPath].map((value) => String(value || '').toLowerCase()).join(' ');
}
function hasAny(hay, words) { return words.some((word) => hay.includes(word)); }
export function isAnimationSource(record) {
  const path=String(record?.path||'');
  return /\/Animations\//i.test(path) || record?.packId === 'kaykit-character-animations-1-1' || /^Rig_(Small|Medium|Large)_/i.test(String(record?.name||''));
}
export function classifyAsset(record) {
  if (!record) return 'other-3d';
  if (record.kind === 'image-2d') return 'texture-image';
  if (record.kind === 'audio') return 'audio';
  if (record.kind !== 'model-3d') return 'other-3d';
  if (isAnimationSource(record)) return 'animation-source';
  const hay=text(record);
  const path=String(record.path||'').toLowerCase();
  const pack=String(record.packId||'').toLowerCase();
  const rigged=record.rigFacts?.hasSkin === true;
  if (rigged || /\/(characters?|player|enemy)\//i.test(path)) return 'character';
  if (pack.includes('fantasyweapons') || pack.includes('blaster') || hasAny(hay,WEAPON_WORDS)) return 'weapon';
  if (hasAny(hay,SIGN_WORDS)) return 'banner-signage';
  if (hasAny(hay,VEHICLE_WORDS)) return 'vehicle';
  if (pack.includes('forest-nature') || pack.includes('nature-kit') || hasAny(hay,NATURE_WORDS)) return 'nature';
  if (pack.includes('city-kit') || pack.includes('building') || hasAny(hay,BUILDING_WORDS)) return 'building';
  if (pack.includes('rpgtoolsbits') || (/\/assets\//i.test(path) && (pack.includes('mystery') || hasAny(hay,CHARACTER_PROP_WORDS))) || hasAny(hay,CHARACTER_PROP_WORDS)) return 'character-prop';
  return 'environment-prop';
}
export function assetTypeLabel(type) { return ASSET_TYPES.find(([id]) => id === type)?.[1] || type; }

const FORMAT_PRIORITY = new Map([['glb',0],['gltf',1],['obj',2],['fbx',3],['dae',4],['3ds',5],['blend',6]]);
export function logicalAssetKey(record) {
  if (record?.kind !== 'model-3d') return record?.assetId || '';
  const normalized=String(record.path||record.assetId||'').toLowerCase()
    .replace(/\.(glb|gltf|obj|fbx|blend|dae|3ds)$/i,'')
    .replace(/\/(glb|gltf|obj|fbx|blend|dae|3ds)\//ig,'/@format/');
  return `${record.packId||''}|${normalized}`;
}
export function representationPriority(record) {
  return FORMAT_PRIORITY.has(record?.format) ? FORMAT_PRIORITY.get(record.format) : 20;
}
export function primaryRepresentations(records, { includeAnimationSources=false } = {}) {
  const bestModel=new Map();
  for (const record of records) {
    if (!includeAnimationSources && isAnimationSource(record)) continue;
    if (record.kind !== 'model-3d' || !RENDERABLE_FORMATS.has(record.format)) continue;
    const key=logicalAssetKey(record), previous=bestModel.get(key);
    if (!previous || representationPriority(record) < representationPriority(previous)) bestModel.set(key,record);
  }
  const emitted=new Set(), output=[];
  for (const record of records) {
    if (!includeAnimationSources && isAnimationSource(record)) continue;
    if (record.kind !== 'model-3d' || !RENDERABLE_FORMATS.has(record.format)) { output.push(record); continue; }
    const key=logicalAssetKey(record), chosen=bestModel.get(key);
    if (record !== chosen || emitted.has(key)) continue;
    emitted.add(key); output.push(record);
  }
  return output;
}
