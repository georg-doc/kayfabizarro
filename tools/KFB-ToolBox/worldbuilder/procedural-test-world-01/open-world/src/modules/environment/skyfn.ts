// One sky-colour function shared by the sky dome AND the fog: fogged geometry fades to exactly the colour of the
// sky behind it (per view direction), so the world edge dissolves without a grey-blue rim, at any time of day.
// Uniform values are shared Float32Arrays (by reference across all programs, see fog.ts).
export const kfbSkyZ = new Float32Array([0.3, 0.6, 0.9, 1]); // zenith rgb, w = sun glow strength
export const kfbSkyH = new Float32Array([0.8, 0.9, 1, 0.45]); // horizon rgb, w = gradient exponent
export const kfbSkyF = new Float32Array([0.8, 0.9, 1, 0.07]); // fog / horizon-band rgb, w = band height (sin elev)
export const kfbSkyG = new Float32Array([0.6, 0.7, 0.4, 0]); // ground haze rgb (looking steeply down past the world)
export const kfbSkyS = new Float32Array([0, 1, 0, 1]); // sun dir xyz, w = sun-above-horizon factor
export const kfbSkyC = new Float32Array([1, 1, 1, 0]); // sun colour rgb

export const SKY_PARS_GLSL = /* glsl */ `
uniform vec4 kfbSkyZ;
uniform vec4 kfbSkyH;
uniform vec4 kfbSkyF;
uniform vec4 kfbSkyG;
uniform vec4 kfbSkyS;
uniform vec4 kfbSkyC;
vec3 kfbSkyBase( vec3 d ) {
  float h = d.y;
  vec3 col = mix( kfbSkyH.rgb, kfbSkyZ.rgb, pow( clamp( h, 0.0, 1.0 ), kfbSkyH.w ) );
  // horizon band: exactly the fog colour at/under the horizon, blending into the sky gradient above it
  col = mix( kfbSkyF.rgb, col, smoothstep( 0.0, kfbSkyF.w, h ) );
  // looking steeply down (only visible past the world edge from high cameras): soft land-coloured haze
  col = mix( col, kfbSkyG.rgb, smoothstep( -0.04, -0.45, h ) );
  return col;
}
vec3 kfbSky( vec3 d ) {
  vec3 col = kfbSkyBase( d );
  float h = d.y;
  // sun glow (broad + tight + disc), only when the sun is up
  float s = max( dot( d, normalize( kfbSkyS.xyz ) ), 0.0 );
  col += kfbSkyC.rgb * ( pow( s, 6.0 ) * 0.16 + pow( s, 90.0 ) * 0.3 + smoothstep( 0.9993, 0.9997, s ) * 1.2 * step( 0.0, h ) ) * kfbSkyZ.w * kfbSkyS.w;
  return col;
}
`;
