// Focus-centred edge fog.
//
// three's built-in fog only knows camera distance. Our problem is different: chunks load in a disc around the
// chunk focus (player / camera target), so the *load edge* is a fixed horizontal distance from the focus, while
// the camera may be 10 m (game) or 230 m (aerial preset) away from it. We therefore patch the fog shader chunks
// once, globally:
//   fogFactor = max( cameraHaze * hazeMax , smoothstep(edgeStart, edgeEnd, |worldXZ - focusXZ|) )
// cameraHaze is a gentle aerial perspective (kfbFogB). scene.fog's near/far are set to a camera-distance
// approximation of the edge so materials without the extra uniforms still hide the load edge reasonably.
// The edge term dissolves the world into the fog colour before the load edge, independent of camera position.
//
// The two extra uniforms are Float32Arrays shared *by reference* across every material: UniformsUtils.clone()
// copies non-three, non-Array values by reference, so writing into these arrays updates all programs.
// Materials that don't carry the uniforms (custom ShaderMaterials built without UniformsLib.fog) read 0 and fall
// back to plain three.js linear fog (kfbFogA.w == 0 disables the patched path).
import * as THREE from 'three';
import { SKY_PARS_GLSL, kfbSkyZ, kfbSkyH, kfbSkyF, kfbSkyG, kfbSkyS, kfbSkyC } from './skyfn';

/** x, z of the focus; edge fade start; edge fade end (0 = edge fog off). */
export const kfbFogA = new Float32Array([0, 0, 0, 0]);
/** hazeMax (0..1 cap of camera-distance haze), haze start (m from camera), haze end, unused. */
export const kfbFogB = new Float32Array([1, 0, 0, 0]);

let patched = false;

export function patchFogChunks(): void {
  if (patched) return;
  patched = true;
  const C = THREE.ShaderChunk as unknown as Record<string, string>;
  C.fog_pars_vertex = /* glsl */ `
#ifdef USE_FOG
  varying float vFogDepth;
  varying vec3 vKfbFogWorld;
#endif
`;
  C.fog_vertex = /* glsl */ `
#ifdef USE_FOG
  vFogDepth = - mvPosition.z;
  // world position from view space (view matrix rotation is orthonormal)
  vKfbFogWorld = cameraPosition + transpose( mat3( viewMatrix ) ) * mvPosition.xyz;
#endif
`;
  C.fog_pars_fragment = /* glsl */ `
#ifdef USE_FOG
  uniform vec3 fogColor;
  varying float vFogDepth;
  varying vec3 vKfbFogWorld;
  uniform vec4 kfbFogA;
  uniform vec4 kfbFogB;
  ${SKY_PARS_GLSL}
  #ifdef FOG_EXP2
    uniform float fogDensity;
  #else
    uniform float fogNear;
    uniform float fogFar;
  #endif
#endif
`;
  C.fog_fragment = /* glsl */ `
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
  #else
    float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
  #endif
  if ( kfbFogA.w > 0.0 ) {
    // patched path (fogNear/fogFar/fogColor are only the fallback for materials lacking these uniforms).
    // Long, gentle aerial perspective around the chunk focus: starts at kfbFogA.z, eases in, reaches full
    // opacity at kfbFogA.w (well inside the guaranteed-loaded radius). Its colour is a light, slightly
    // desaturated LAND haze (kfbSkyG) and converges to the exact sky colour behind the fragment only as it
    // approaches full opacity — partially fogged cliffs read as distant solid land, never as sky-tinted glass,
    // and fully fogged geometry is indistinguishable from the sky behind it (no rim, no cut-off).
    // sky colour WITHOUT the sun glow: fog must not carry glare into the near field when looking sunward
    vec3 skyCol = kfbSkyBase( normalize( vKfbFogWorld - cameraPosition ) );
    // (a) aerial perspective by distance to the CAMERA (uniform across the frame → no radial vignette from high
    //     views); starts kfbFogB.y metres from the camera, full at kfbFogB.z, gently eased in
    float tc = clamp( ( length( vKfbFogWorld - cameraPosition ) - kfbFogB.y ) / ( kfbFogB.z - kfbFogB.y ), 0.0, 1.0 );
    float fc = mix( tc * tc, tc * tc * ( 3.0 - 2.0 * tc ), tc ) * kfbFogB.x;
    // (b) narrow guard band at the load edge around the chunk focus (only hides unloaded ground)
    float te = clamp( ( length( vKfbFogWorld.xz - kfbFogA.xy ) - kfbFogA.z ) / ( kfbFogA.w - kfbFogA.z ), 0.0, 1.0 );
    float f = max( fc, te * te * ( 3.0 - 2.0 * te ) );
    // colour: light desaturated LAND haze while partial, converging to the exact sky behind only near full
    vec3 tint = mix( kfbSkyG.rgb, skyCol, smoothstep( 0.55, 1.0, f ) );
    gl_FragColor.rgb = mix( gl_FragColor.rgb, tint, f );
  } else {
    gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
  }
#endif
`;
  const add = (u: Record<string, THREE.IUniform>) => {
    if (!u || !('fogColor' in u)) return;
    u.kfbFogA = { value: kfbFogA };
    u.kfbFogB = { value: kfbFogB };
    u.kfbSkyZ = { value: kfbSkyZ };
    u.kfbSkyH = { value: kfbSkyH };
    u.kfbSkyF = { value: kfbSkyF };
    u.kfbSkyG = { value: kfbSkyG };
    u.kfbSkyS = { value: kfbSkyS };
    u.kfbSkyC = { value: kfbSkyC };
  };
  add(THREE.UniformsLib.fog as unknown as Record<string, THREE.IUniform>);
  for (const k of Object.keys(THREE.ShaderLib)) add((THREE.ShaderLib as Record<string, THREE.ShaderLibShader>)[k].uniforms);
}
