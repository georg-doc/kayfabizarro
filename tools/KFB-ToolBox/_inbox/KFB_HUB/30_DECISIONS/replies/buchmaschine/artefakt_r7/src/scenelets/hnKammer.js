// HyperNorm-Kammer R1 (Georg 22.11.: Infinite Room als Bühne für die Buchmaschine, auch Showcase außerhalb des Spiels; später KFB und Aqua).
// Ein großer, dunkler Raum: Die Wände zeigen die HyperNorm-Engine live als durchgehendes Band rundum (eine Fläche, nahtlos über alle vier Wände),
// gedimmt, damit die Maschine die hellste Stelle bleibt; auf Schläge atmen die Wände kurz auf. Dunkler, leicht glänzender Boden, schwarze Decke.
// Lädt ohne Vite und ohne Spiel-Kern (three wird übergeben, engine/hypernorm per relativem Import): taugt für statische Seiten und Artefakte.
// createHnKammer({ THREE, renderer, quellen, groesse, seed, bpm, helligkeit, lichter }) → { group, anker, licht, flaeche, bereit, update(dt, { musik }), dispose() }
//   quellen: HyperNorm-Bildquellen, z. B. [{ url: '<…>/site-extra/h15/hypernorm_r3/pd_pool/manifest.json', src: 'pd' }, { url: '<…>/engine/hypernorm/test/daten/help-deck.hn-media.json' }]
//   anker: { mitte, buehne, kameras: { totale, halbnah, unten } } (Weltpunkte; Boden bei y = 0, Mitte der Kammer bei x = z = 0)
//   licht: Lichtangebot der Kammer (zwei Kantenlichter kalt/warm, ein Oberlicht, schwache Grundhelle); lichter: false = keine Lichter anlegen (Host bringt eigene)
//   musik: { kick, bass } 0…1 (Audio-Puls des Hosts). Die Wände zeigen das HyperNorm-Bild im Negativ (helle Platten dunkel, Typo leuchtet), Fotos und Karten in Farbe.
import { createFlaeche } from '../../engine/hypernorm/adapter/fassade.mjs'

export const KAMMER = Object.freeze({ breite: 26, tiefe: 26, hoehe: 13 })

export function createHnKammer({ THREE, renderer, quellen, groesse = KAMMER, seed = 1966, bpm = 112, helligkeit = 0.55, lichter = true, worker = 'auto' }) {
  const { breite: B, tiefe: T, hoehe: H } = groesse, group = new THREE.Group(); group.name = 'hn-kammer'
  const flaeche = createFlaeche({ art: 'fassade', three: THREE, gl: renderer, quellen, worker, seed, clock: { bpm }, maxFps: 24,
    palette: [[[14, 12, 30], [120, 60, 200], [240, 190, 120]], [[10, 20, 30], [40, 160, 200], [230, 230, 240]]] })
  flaeche.texture.wrapS = THREE.RepeatWrapping
  const U = { uBild: { value: flaeche.texture }, uHell: { value: helligkeit }, uPuls: { value: 0 }, uH: { value: H } }
  const wandMat = new THREE.ShaderMaterial({ uniforms: U, side: THREE.DoubleSide,
    vertexShader: `attribute float aU; varying vec2 vUv; varying vec3 vW; void main(){ vUv = vec2(aU, uv.y); vec4 w = modelMatrix*vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `uniform sampler2D uBild; uniform float uHell, uPuls, uH; varying vec2 vUv; varying vec3 vW;
      void main(){ vec3 c = texture2D(uBild, vUv).rgb; float boden = smoothstep(0.0, 0.35, vW.y/uH), decke = smoothstep(1.0, 0.8, vW.y/uH);
        float d = length(cameraPosition - vW); float sat = max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b)); float um = 0.0; for (int i = -1; i <= 1; i++) for (int j = -1; j <= 1; j++) um += dot(texture2D(uBild, vUv + vec2(float(i)*0.05, float(j)*0.12)).rgb, vec3(0.333));
        float inv = smoothstep(0.35, 0.55, um/9.0);   /* örtlich: helle Umgebung wird umgekehrt, dunkle bleibt */
        vec3 n = mix(mix(c, vec3(1.0) - c, inv), c*0.6, smoothstep(0.12, 0.35, sat));   /* dunkler Raum: helle Platten werden dunkel, Typo leuchtet; Bilder behalten ihre Farbe */
        vec3 rgb = n*n*uHell*(0.3 + 0.7*boden)*decke*(1.0 + uPuls*2.0)*exp(-d*0.015);
        gl_FragColor = vec4(rgb, 1.0);
        #include <colorspace_fragment>
      }` })
  // vier Wände als ein Band: u läuft einmal rundum (zweimal das 2:1-Bild), keine Naht zwischen den Wänden
  const umfang = 2 * (B + T), wand = (x0, z0, x1, z1, u0) => { const g = new THREE.PlaneGeometry(1, 1, 1, 1), len = Math.hypot(x1 - x0, z1 - z0)
    g.scale(len, H, 1); g.translate(0, H / 2, 0); const m = new THREE.Mesh(g, wandMat); m.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2); m.rotation.y = Math.atan2(x1 - x0, z1 - z0) - Math.PI / 2
    const uv = g.attributes.uv, au = new Float32Array(uv.count); for (let i = 0; i < uv.count; i++) au[i] = ((u0 + uv.getX(i) * len) / umfang) * 2
    g.setAttribute('aU', new THREE.BufferAttribute(au, 1)); return m }
  const hx = B / 2, hz = T / 2
  group.add(wand(-hx, -hz, hx, -hz, 0), wand(hx, -hz, hx, hz, B), wand(hx, hz, -hx, hz, B + T), wand(-hx, hz, -hx, -hz, 2 * B + T))
  const boden = new THREE.Mesh(new THREE.PlaneGeometry(B, T), new THREE.MeshStandardMaterial({ color: 0x0c0b12, roughness: 0.28, metalness: 0.35 }))
  boden.rotation.x = -Math.PI / 2; boden.receiveShadow = true
  const decke = new THREE.Mesh(new THREE.PlaneGeometry(B, T), new THREE.MeshBasicMaterial({ color: 0x020205 })); decke.rotation.x = Math.PI / 2; decke.position.y = H
  group.add(boden, decke)
  const V = (x, y, z) => new THREE.Vector3(x, y, z)
  const anker = { mitte: V(0, 0, 0), buehne: V(0, 0, -T * 0.12), kameras: { totale: { pos: V(0, 3.2, T * 0.38), blick: V(0, 1.6, -T * 0.12) }, halbnah: { pos: V(3.2, 1.9, T * 0.05), blick: V(0, 1.4, -T * 0.12) }, unten: { pos: V(-1.6, 0.35, T * 0.02), blick: V(0, 2.0, -T * 0.12) } } }
  const licht = []
  if (lichter) {
    const spot = (farbe, i, pos) => { const s = new THREE.SpotLight(farbe, i, 30, Math.PI / 7, 0.6, 1.4); s.position.copy(pos); s.target.position.copy(anker.buehne).setY(1.2); group.add(s, s.target); licht.push(s); return s }
    spot(0x7fb2ff, 60, V(-6, 6, anker.buehne.z - 5)); spot(0xffa860, 60, V(6, 5, anker.buehne.z - 4)); spot(0xffffff, 35, V(0, H - 1, anker.buehne.z + 1))
    const grund = new THREE.HemisphereLight(0x3a3060, 0x050408, 0.25); group.add(grund); licht.push(grund)
  }
  let puls = 0
  return {
    group, anker, licht, flaeche, bereit: flaeche.bereit,
    update(dt, { musik } = {}) { flaeche.update(dt); puls = Math.max(puls * Math.exp(-dt * 5), musik?.kick ?? 0); U.uPuls.value = puls },
    dispose() { flaeche.dispose(); wandMat.dispose(); for (const m of group.children) { m.geometry?.dispose(); if (m.material && m.material !== wandMat) m.material.dispose() } },
  }
}
