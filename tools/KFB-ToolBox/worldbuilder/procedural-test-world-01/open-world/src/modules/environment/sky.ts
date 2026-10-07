// Gradient sky dome. Rendered first, at infinity (view-rotation only, depth = far plane), not fogged.
// Colour comes from kfbSky() (skyfn.ts), the SAME function the fog uses for fogged geometry, so the fogged world
// edge has exactly the colour of the sky behind it.
// Output path matches three's fog (applied after tone mapping on materials): no tone mapping here, linear →
// output colour space only. In the post pipeline both get the same tone mapping in the output pass.
import * as THREE from 'three';
import { SKY_PARS_GLSL, kfbSkyZ, kfbSkyH, kfbSkyF, kfbSkyG, kfbSkyS, kfbSkyC } from './skyfn';

export class Sky {
  readonly mesh: THREE.Mesh;

  constructor() {
    const geo = new THREE.SphereGeometry(1, 48, 24);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        kfbSkyZ: { value: kfbSkyZ },
        kfbSkyH: { value: kfbSkyH },
        kfbSkyF: { value: kfbSkyF },
        kfbSkyG: { value: kfbSkyG },
        kfbSkyS: { value: kfbSkyS },
        kfbSkyC: { value: kfbSkyC },
      },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = position;
          vec4 p = projectionMatrix * vec4( mat3( viewMatrix ) * position, 1.0 );
          gl_Position = p.xyww;
        }`,
      fragmentShader: /* glsl */ `
        ${SKY_PARS_GLSL}
        varying vec3 vDir;
        void main() {
          gl_FragColor = vec4( kfbSky( normalize( vDir ) ), 1.0 );
          #include <colorspace_fragment>
          // 8-bit output dither: kills banding in the wide sky gradient
          gl_FragColor.rgb += ( fract( sin( dot( gl_FragCoord.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 ) - 0.5 ) / 255.0;
        }`,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      fog: false,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.name = 'environment:sky';
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -1000;
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
  }
}
