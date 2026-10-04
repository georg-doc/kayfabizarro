/* KFB WB-DESIGN-PARALLEL-01 · PRESENTATION SEAM
   Der Shell liest EINE Form. Woher sie kommt, entscheidet nur `loadZone(src)`.
   Heute: eingefrorene Fixture (Crop aus dom-zentrum-v0, gepinnt). Später: das Ergebnis von
   WORLD-ZONE-BAKE-01 über einen eigenen Adapter — derselbe Rückgabewert, kein zweiter Presenter.

   Das hier ist KEIN World-Zone-Schema. Es ist die kleinste Liste an Feldern, die die Darstellung
   braucht; alles Weitere (Höhen, Topologie, Kollision, Streaming) gehört dem Compiler.

   Welt-Koordinaten wie WB-W0 (w0-region.js · src2w): X = Ost, Y = oben, Z = −Nord. */

export const SEAM = {
  version: 'kfb.wb-design.presentation-seam/0 (provisional · presentation only)',
  fields: {
    id: 'string', status: 'string', provenance: 'object',
    rectW: '{minX,maxX,minZ,maxZ} world metres',
    heightAt: '(x,z) → metres · fixture has no elevation → 0; ground owner stays WB-W0 region terrain',
    buildings: '[{id,h,kind,name,fp:[{x,z}]}]', roads: '[{id,cls,w,drive,name,bridge,tunnel,layer,line:[{x,z}]}]', railways: '[{id,cls,service,tunnel,bridge,layer,line:[{x,z}]}] — centerlines, later drivable like roads',
    landuse: '[{id,cls,poly}]', water: '[{id,cls,poly,src}]',
    landmark: '{id,name,heightTag,centroid,axisDeg,extentM,footprint}', conflicts: 'Set of building ids inside the track socket corridor'
  },
  consumers: ['wd1-city.js buildCityLayer', 'wd1-landmark.js makeLandmark (centroid/axis)', 'wd1-boot.js track socket']
};

const w = (p) => ({ x: p[0], z: -p[1] });

function fromFrozenFixture(fx, url) {
  const c = fx.crop;
  const L = fx.landmark;
  return {
    id: 'cologne-dom-crop-v0', kind: 'frozen-fixture', url, status: fx.status, provenance: fx.source, crop: c,
    rectW: { minX: c.minX, maxX: c.maxX, minZ: -c.maxZ, maxZ: -c.minZ },
    heightAt: () => 0,
    buildings: fx.buildings.map((b) => ({ id: b.id, h: b.h, minH: b.minH || 0, kind: b.kind, name: b.name, roof: b.roof || null, mc: b.mc || null, fp: b.fp.map(w) })),
    roads: fx.roads.map((r) => ({ ...r, line: r.line.map(w) })),
    landuse: fx.landuse.map((l) => ({ id: l.id, cls: l.cls, poly: l.poly.map(w) })),
    water: fx.water.map((l) => ({ id: l.id, cls: l.cls, poly: l.poly.map(w), src: l.poly.map((p) => ({ x: p[0], z: p[1] })) })),
    landmark: {
      id: L.id, name: L.name, heightTag: L.heightTag, axisDeg: L.axisDeg, extentM: L.extentM,
      centroid: { x: L.centroid.x, z: -L.centroid.z }, footprint: L.footprint.map(w)
    },
    railways: (fx.railways || []).map((r) => ({ ...r, line: r.line.map(w) })),
    heroes: fx.heroes,
    hbf: fx.hbf,
    conflicts: new Set(fx.trackCorridorConflicts.map((b) => b.id)),
    counts: fx.counts
  };
}

export async function loadZone(src) {
  if (src.kind === 'frozen-fixture') {
    const r = await fetch(src.url);
    if (!r.ok) throw new Error('fixture HTTP ' + r.status);
    return fromFrozenFixture(await r.json(), src.url);
  }
  if (src.kind === 'world-zone-bake') {
    /* Einzige Stelle, an der WORLD-ZONE-BAKE-01 andockt: ein Adapter bundle → dieselbe Form wie oben. */
    throw new Error('WORLD-ZONE-BAKE-01 output not delivered yet — adapter intentionally not written');
  }
  throw new Error('unknown zone source ' + src.kind);
}
