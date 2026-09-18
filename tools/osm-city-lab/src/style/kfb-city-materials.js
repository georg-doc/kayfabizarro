export function materialPalette(style) {
  const p=style.palette;
  return {
    road:p.road, roadEdge:p.roadEdge, sidewalk:p.sidewalk, path:p.path||p.sidewalk,
    green:p.green, greenDark:p.greenDark, water:p.water,
    roof:p.roof, accent:p.accent, window:p.window || ['#31414a'],
    streetSign:p.streetSign||{board:'#255a72',text:'#f7efe0',pole:'#504a48'},
    'building-warm':p.buildingWarm,
    'building-pale':p.buildingPale,
    'building-industrial':p.buildingIndustrial
  };
}
export function pickStable(list, id) {
  if (!Array.isArray(list)) return list;
  let h=0; for(const c of String(id)) h=(Math.imul(h,31)+c.charCodeAt(0))>>>0;
  return list[h%list.length];
}
