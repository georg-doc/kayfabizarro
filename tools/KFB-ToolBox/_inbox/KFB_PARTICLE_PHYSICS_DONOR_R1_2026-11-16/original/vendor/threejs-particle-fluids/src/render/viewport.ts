import { screenUV, viewportDepthTexture, viewportSharedTexture } from 'three/tsl';

// Patch: three keeps a full-screen copy of the screen per viewport node and per render target, and
// never frees it. Every call to viewportSharedTexture() or viewportDepthTexture() makes a new node,
// so shaders that call them directly cost a copy per call, in memory and in every frame, and leak
// them all each time a scene is rebuilt on the same renderer. Samples of one node share its copy.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;
let color: Any;
let depth: Any;

/** The scene drawn so far at `uv`, from one copy shared by everything that reads it. */
export const sceneColorAt = (uv: Any): Any => (color ??= viewportSharedTexture()).sample(uv);

/** The scene's depth at `uv`, from one copy shared by everything that reads it. */
export const sceneDepthAt = (uv: Any = screenUV): Any => (depth ??= viewportDepthTexture()).sample(uv);
