import type * as THREE from 'three';
import type RAPIER from '@dimforge/rapier3d-compat';
import type { Events } from './events';
import type { WorldModel } from './world';
import type { ChunkBuilder, ChunkManager } from './chunks';
import type { Physics } from './physics';
import type { Input } from './input';

export type Biome = 'grass' | 'forest' | 'hill' | 'mountain' | 'water';
export type VillageColor = 'blue' | 'red' | 'green' | 'yellow';

export interface CellData {
  q: number;
  r: number;
  /** Integer height step; tile top at y = level * LEVEL_H. */
  level: number;
  biome: Biome;
  /** Lake/sea cell. */
  water: boolean;
  /** 6-bit: neighbour in direction d is water (set on land cells). */
  coastMask: number;
  /** Ramp rising toward edge dir by `steps` levels (cell.level is the LOW side). */
  slope: { dir: number; steps: 1 | 2 } | null;
  roadMask: number;
  riverMask: number;
  bridge: boolean;
  village: { id: string; color: VillageColor; role: 'centre' | 'lot' | 'edge' } | null;
  building: { asset: string; rotY: number } | null;
  reserved: boolean;
  /** 0..1 forest density. */
  forest: number;
  tags: string[];
}

export interface WorldLayerCtx {
  seed: number;
  /** Cell as seen by the given earlier stage (stage < current). */
  cellAt(stage: number, q: number, r: number): Readonly<CellData>;
  /** Per-layer cache scratch space (persistent for the session). */
  cache: Map<string, unknown>;
}

export interface WorldLayer {
  id: string;
  /** Execution order; see ARCHITECTURE.md §4 (1 terrain, 2 roads, 3 villages, 4 rivers, 5 nature, 6 props). */
  stage: number;
  apply(cell: CellData, ctx: WorldLayerCtx): void;
}

export interface ChunkInfo {
  cx: number;
  cz: number;
  /** Hex cells of the chunk (axial parallelogram). */
  cells: { q: number; r: number }[];
}

export interface Services {
  [name: string]: unknown;
}

export interface CoreContext {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  world: WorldModel;
  physics: Physics;
  rapier: typeof RAPIER;
  chunks: ChunkManager;
  events: Events;
  input: Input;
  assets: AssetLibraryApi;
  services: {
    get<T = unknown>(name: string): T | undefined;
    set(name: string, api: unknown): void;
  };
  params: URLSearchParams;
  /** Seconds since start. */
  time: number;
  /** Mode: 'game' or 'showcase'. */
  mode: 'game' | 'showcase';
  /** Environment: route the final render through e.g. an EffectComposer (null restores plain render). */
  setRenderOverride(fn: ((dt: number) => void) | null): void;
  /** Current verification camera override (set via __kfb.setCamera), or null while the game camera is in charge. */
  getCameraOverride(): CameraView | null;
}

export interface GameModule {
  id: string;
  layer?: WorldLayer;
  /** Extra layers (e.g. roads owns stage 2 and stage 4). */
  layers?: WorldLayer[];
  init?(ctx: CoreContext): Promise<void> | void;
  buildChunk?(chunk: ChunkInfo, out: ChunkBuilder, ctx: CoreContext): void;
  update?(dt: number, ctx: CoreContext): void;
  /** Called after the frame is rendered-ready each frame, after all update(). */
  lateUpdate?(dt: number, ctx: CoreContext): void;
  showcase?(ctx: CoreContext, params: URLSearchParams): Promise<void> | void;
  /** Other module ids that must be active in this module's showcase (default: environment only). */
  showcaseUses?: string[];
  /** Named camera presets this module offers to the verification tool. */
  cameraPresets?: Record<string, (ctx: CoreContext) => CameraView>;
}

/** Explicit camera placement used by presets / verification. */
export interface CameraView {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

/** One mesh part of a loaded static asset, already scaled to metres (pack scale baked in). */
export interface AssetPart {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  /** Transform of the part relative to the asset root (pack scale included). */
  matrix: THREE.Matrix4;
}

export interface StaticAsset {
  id: string;
  parts: AssetPart[];
  /** Local bounding box in metres. */
  bounds: THREE.Box3;
}

export interface AssetLibraryApi {
  /** Preload a list of asset ids. Missing ones resolve to null without throwing. */
  preload(ids: string[]): Promise<void>;
  /** Static asset (must be preloaded). */
  get(id: string): StaticAsset | null;
  /** Load (and cache) the raw glTF for skinned characters / animations. */
  loadGltf(url: string): Promise<import('three/examples/jsm/loaders/GLTFLoader.js').GLTF | null>;
  /** All known ids in the manifest. */
  ids(): string[];
  has(id: string): boolean;
  /** Public URL (relative to BASE_URL) of an asset id, for skinned/animated loads. */
  url(id: string): string | null;
  /** Pack scale (asset units → metres) applied to an id. */
  scaleOf(id: string): number;
  /** All canonical materials. */
  allMaterials(): import('three').Material[];
  materialStats(): { materials: Record<string, number>; textures: string[] };
}

export type CameraPreset = { target: [number, number, number]; yaw: number; pitch: number; dist: number } | string;
