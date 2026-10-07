// "KayKit" tone mapping = Khronos PBR Neutral *without its toe*.
// Why: the references are Blender renders with a near-identity view transform — lit tops come out at roughly
// their atlas colour (grass ≈ rgb(215,222,72)). Measured on our diorama at the same lighting:
//   none    → (197,199,58) sat .71   (closest hue/saturation, but clips highlights hard)
//   neutral → (192,194,28) sat .85   (its toe subtracts up to 0.04 from every channel → yellows go acid)
//   aces    → (204,203,90) sat .56   (hue shift toward ochre, greys out greens)
//   agx     → (180,176,106) sat .41  (washed out)
// So: identity below 0.82, then Neutral's soft shoulder + slight highlight desaturation. No toe.
import * as THREE from 'three';

let patched = false;

export function installKayKitToneMapping(): void {
  if (patched) return;
  patched = true;
  const C = THREE.ShaderChunk as unknown as Record<string, string>;
  C.tonemapping_pars_fragment = C.tonemapping_pars_fragment.replace(
    /vec3 CustomToneMapping\( vec3 color \) \{ return color; \}/,
    /* glsl */ `vec3 CustomToneMapping( vec3 color ) {
	const float StartCompression = 0.82;
	const float Desaturation = 0.12;
	color *= toneMappingExposure;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}`,
  );
}

/**
 * Smooth PCF: three r186 filters directional shadows with 5 Vogel-disk taps rotated by interleaved gradient
 * noise, which shows as stipple at a wide penumbra. We replace it with Castaño's optimised 7×7 tent filter
 * (16 hardware-bilinear compares with analytically weighted sub-texel offsets): band-free, noise-free, and the
 * cost of 16 taps. Penumbra half-width ≈ 3.5 shadow texels (≈ 0.12–0.25 m with our 4096 map / 72–150 m frustum).
 * Only the 2-D (directional/spot) path is touched; `shadowRadius` is ignored by this filter.
 */
let pcfPatched = false;
export function installSmoothPCF(): boolean {
  if (pcfPatched) return true;
  const C = THREE.ShaderChunk as unknown as Record<string, string>;
  const src = C.shadowmap_pars_fragment;
  const re = /shadow = \(\s*texture\( shadowMap, vec3\( shadowCoord\.xy \+ vogelDiskSample\( 0, 5, phi \)[\s\S]*?\) \* 0\.2;/;
  if (!re.test(src)) {
    console.warn('[environment] PCF chunk layout changed; keeping three default 5-tap PCF');
    return false;
  }
  C.shadowmap_pars_fragment = src.replace(
    re,
    `{
					vec2 tuv = shadowCoord.xy * shadowMapSize;
					vec2 buv = floor( tuv + 0.5 );
					float s = tuv.x + 0.5 - buv.x;
					float t = tuv.y + 0.5 - buv.y;
					buv = ( buv - 0.5 ) * texelSize;
					float uw0 = ( 5.0 * s - 6.0 ), uw1 = ( 11.0 * s - 28.0 ), uw2 = - ( 11.0 * s + 17.0 ), uw3 = - ( 5.0 * s + 1.0 );
					float u0 = ( 4.0 * s - 5.0 ) / uw0 - 3.0, u1 = ( 4.0 * s - 16.0 ) / uw1 - 1.0, u2 = - ( 7.0 * s + 5.0 ) / uw2 + 1.0, u3 = - s / uw3 + 3.0;
					float vw0 = ( 5.0 * t - 6.0 ), vw1 = ( 11.0 * t - 28.0 ), vw2 = - ( 11.0 * t + 17.0 ), vw3 = - ( 5.0 * t + 1.0 );
					float v0 = ( 4.0 * t - 5.0 ) / vw0 - 3.0, v1 = ( 4.0 * t - 16.0 ) / vw1 - 1.0, v2 = - ( 7.0 * t + 5.0 ) / vw2 + 1.0, v3 = - t / vw3 + 3.0;
					vec4 uw = vec4( uw0, uw1, uw2, uw3 ), vw = vec4( vw0, vw1, vw2, vw3 );
					vec4 uo = vec4( u0, u1, u2, u3 ), vo = vec4( v0, v1, v2, v3 );
					shadow = 0.0;
					for ( int j = 0; j < 4; j ++ ) {
						for ( int i = 0; i < 4; i ++ ) {
							shadow += uw[ i ] * vw[ j ] * texture( shadowMap, vec3( buv + vec2( uo[ i ], vo[ j ] ) * texelSize, shadowCoord.z ) );
						}
					}
					shadow /= 2704.0;
				}`,
  );
  pcfPatched = true;
  return true;
}
