// Source-qualified authoring metadata. No geometry, palette, lighting or placement writer.
import type { WorldSpec } from './island/spec';
export interface SceneStudy {
  schema: 'kfb.scene-study/1';
  places: { id: string; island: string; name: string; action: string; focus: string; members: string[] }[];
  connections: { from: string; to: string; reason: string }[];
}
export function study(world: WorldSpec): SceneStudy {
  return world.sceneStudy ??= { schema: 'kfb.scene-study/1', places: [], connections: [] };
}
export function checkStudy(world: WorldSpec): string[] {
  const s = world.sceneStudy; if (!s) return ['Noch kein Handlungsort angelegt.'];
  const notes: string[] = [];
  for (const p of s.places) {
    const island = world.islands.find(i => i.id === p.island);
    const objects = new Set(island?.buildings.map(b => b.id) ?? []);
    if (!island) notes.push(`${p.name}: Insel fehlt.`);
    if (!p.action.trim()) notes.push(`${p.name}: Tätigkeit fehlt.`);
    if (!objects.has(p.focus)) notes.push(`${p.name}: Fokusobjekt fehlt.`);
    for (const id of p.members) if (!objects.has(id)) notes.push(`${p.name}: Zugehöriges Objekt ${id} fehlt.`);
    if (s.places.length > 1 && !s.connections.some(c => c.from === p.id || c.to === p.id)) notes.push(`${p.name}: Beziehung zu anderen Orten fehlt.`);
  }
  for (const c of s.connections) {
    if (!s.places.some(p => p.id === c.from) || !s.places.some(p => p.id === c.to)) notes.push('Verbindung: Ort fehlt.');
    if (!c.reason.trim()) notes.push('Verbindung: Zweck fehlt.');
  }
  if (!s.places.length) notes.push('Noch kein Handlungsort angelegt.');
  return notes;
}
export function linkPlaces(world: WorldSpec, from: string, to: string, reason: string): boolean {
  const s = study(world);
  if (from === to || !reason.trim() || ![from,to].every(id => s.places.some(p=>p.id===id))) return false;
  const c = s.connections.find(c=>c.from===from&&c.to===to);
  if (c) c.reason = reason.trim(); else s.connections.push({from,to,reason:reason.trim()});
  return true;
}
export const escapeText = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
