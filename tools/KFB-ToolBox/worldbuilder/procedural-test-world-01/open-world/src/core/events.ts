import type * as THREE from 'three';

export interface EventMap {
  ready: void;
  'surface:changed': {revision:number};
  'chunk:loaded': { cx: number; cz: number };
  'chunk:unloaded': { cx: number; cz: number };
  'player:moved': { pos: THREE.Vector3; vel: THREE.Vector3; grounded: boolean };
  'player:gait': { gait: string };
  'player:switched': { name: string };
  'time:changed': { hours: number };
  'module:error': { id: string; error: unknown };
}

type Handler<T> = (payload: T) => void;

export class Events {
  private map = new Map<string, Set<Handler<any>>>();

  on<K extends keyof EventMap>(type: K, fn: Handler<EventMap[K]>): () => void {
    let set = this.map.get(type);
    if (!set) this.map.set(type, (set = new Set()));
    set.add(fn);
    return () => set!.delete(fn);
  }

  emit<K extends keyof EventMap>(type: K, ...payload: EventMap[K] extends void ? [] : [EventMap[K]]): void {
    const set = this.map.get(type);
    if (!set) return;
    for (const fn of set) {
      try {
        fn(payload[0] as EventMap[K]);
      } catch (e) {
        console.warn(`[events] handler for ${type} threw`, e);
      }
    }
  }
}
