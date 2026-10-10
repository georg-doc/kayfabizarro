// Visual Recovery Lab: adapted 1:1 from donors/lab-track/road-markings.m1.js (KFB_BLEND_GLSL, "Knetfleck-Regel"),
// the patch rule World Core R2D v3 uses for its terrain transitions (blobs + drops, no gradients).
// F = knead-ball field A − field B (one Gaussian ball per cell, radius varies); threshold k(w) so coverage ≈ w.
export const KFB_BLEND_GLSL = /* glsl */ `
vec2 kfbBH2(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
float kfbBG(vec2 x, float o){ vec2 b = floor(x); float s = 0.0;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 cc = b + vec2(float(i), float(j)); vec2 p = cc + 0.15 + 0.7 * kfbBH2(cc + o);
    float r = 0.28 + 0.3 * kfbBH2(cc + o + 3.0).x; vec2 d = x - p; s += exp(-dot(d, d) / (r * r)); }
  return s; }
float kfbBlend(vec2 su, float cell, float w, out float rim){ rim = 0.0; if (w <= 0.001) return 0.0; if (w >= 0.999) return 1.0;
  vec2 x = su / cell; float F = kfbBG(x, 17.0) - kfbBG(x + vec2(0.5, 0.37), 0.0); float t = 2.0 * w - 1.0, t3 = t * t * t;
  float k = 0.66 * t + 0.43 * t3 * t3 * t; rim = 1.0 - smoothstep(0.0, 0.07, abs(F - k)); return F < k ? 1.0 : 0.0; }
`;
