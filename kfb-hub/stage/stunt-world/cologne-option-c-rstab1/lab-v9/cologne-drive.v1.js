// KFB Cologne Race · Option C · Antrieb, Spuren, Würfel
//
// Der Antrieb ist die QUELLE. Spur und Speedlines haengen an ihm, nicht an einem
// abstrakten Punkt hinter dem Fahrzeug. Zwei Skins:
//
//   donut  KFB Power Donut Drive — media/3D_Assets/Tiny_Treats_Baked_Goods_1.0_FREE/
//          Assets/gltf/donut_pink.gltf, 3 542 B, ein Knoten `donut_pink`,
//          Huelle 0,418 × 0,205 × 0,418 u, externe donut_pink.bin und
//          tiny_treats_texture_1.png. Byteweise geprueft.
//   orb    die bisherige Kugel, bleibt als Option erhalten.
//
// Speedlines nach TinySkies-Lesart: DUENN, an den Heckkanten bzw. ueber den
// Hinterraedern, und sie folgen der gefahrenen Bahn statt der Blickrichtung.

import { C } from './option-c-style.v1.js';
import { RAW } from './cologne-world.v1.js';
import { FLOW, vehicleLift } from './cologne-play.v1.js';

const DONUT = 'media/3D_Assets/Tiny_Treats_Baked_Goods_1.0_FREE/Assets/gltf/donut_pink.gltf';
const DICE = 'media/3D_Assets/dice_ugur_lowpoly.glb';

// Gemessen am Fahrzeug (KayKit car_hatchback, Massstab 5,1551):
//   Breite 2,16 m, halbe Breite 1,08 · Radstand 2,586 · Hinterachse bei z = −1,32 m
//   Heckkante rund −2,10 m hinter dem Ursprung
const REAR_Z = -2.10;
const REAR_HALF = 0.86;     // Ansatz der Speedlines: innerhalb der Heckkante
const DRIVE_Z = -2.35;
// Hoehe der Antriebs-Aufhaengung ueber der Fahrbahn. Georgs Ansage: der Donut
// soll ungefaehr zwischen den Ruecklichtern haengen, eine Spur tiefer. Die
// Ruecklichter des KayKit-Hatchback sitzen bei 0,85–1,05 m; 0,86 m setzt die
// Ringmitte knapp darunter, statt wie bisher auf 0,56 m Radhoehe.
const DRIVE_Y = 0.86;

export async function createDrive(THREE, GLTFLoader, parent, opts = {}) {
  // Rechenhilfen, einmal angelegt statt je Bild: der Fahrzeugrahmen wird
  // sechzigmal in der Sekunde gebraucht.
  const _e = new THREE.Euler(), _m = new THREE.Matrix4();
  const _v = new THREE.Vector3(), _r = new THREE.Vector3();
  const group = new THREE.Group();
  group.name = 'kfb-drive';
  parent.add(group);

  // --- Skin 1: Power Donut ------------------------------------------------
  const donutHolder = new THREE.Group();
  donutHolder.name = 'drive-donut';
  let donutMeasured = null;
  try {
    const g = await new GLTFLoader().loadAsync(RAW(DONUT));
    const s = g.scene;
    const box = new THREE.Box3().setFromObject(s);
    const size = box.getSize(new THREE.Vector3());
    // Aussendurchmesser auf 1,6 m — knapp unter der halben Fahrzeugbreite mal zwei,
    // damit der Ring das Heck rahmt und nicht ueberragt.
    const scale = 1.28 / Math.max(0.001, size.x);
    s.scale.setScalar(scale);
    s.position.y = -size.y * scale * 0.5;
    s.traverse(o => {
      if (!o.isMesh) return;
      o.castShadow = false;
      o.material = o.material.clone();
      o.material.emissive = new THREE.Color(C.hot);
      o.material.emissiveIntensity = 0.55;
      o.material.toneMapped = false;
    });
    // Der Ring liegt flach, die Streusel sitzen oben (Huelle y 0..0,205).
    // −90 Grad um X bildet +Y auf −Z ab: die bunte Seite zeigt damit nach HINTEN,
    // also zur Verfolgerkamera. Mit +90 Grad zeigte sie nach vorn und man sah nur
    // den nackten Teig.
    const tilt = new THREE.Group();
    tilt.rotation.x = -Math.PI / 2;
    // Eigener Traeger fuer die Drehung: seine lokale Y-Achse liegt nach dem Kippen
    // auf der Fahrtachse, der Ring dreht sich also um sich selbst.
    const spinner = new THREE.Group();
    spinner.add(s);
    tilt.add(spinner);
    donutHolder.add(tilt);
    donutMeasured = {
      modelU: [+size.x.toFixed(3), +size.y.toFixed(3), +size.z.toFixed(3)],
      scale: +scale.toFixed(3), outerDiameterM: 1.28
    };
    donutHolder.userData.spinner = spinner;
  } catch (e) {
    console.warn('[drive] donut donor:', e.message);
  }

  // Energiekern im Donutloch: halbtransparente Kugel, die den Ring fuellt
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 18, 12),
    new THREE.MeshBasicMaterial({ color: C.hot, transparent: true, opacity: 0.85, toneMapped: false })
  );
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.86, 16, 12),
    new THREE.MeshBasicMaterial({
      color: C.hotSoft, transparent: true, opacity: 0.26,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    })
  );
  const light = new THREE.PointLight(C.hot, 5, 20, 2);

  // --- Skin 2: Ugur-Wuerfel -----------------------------------------------
  // Missverstaendnis der Vorrunde korrigiert: der Wuerfel war nie als
  // mitfliegender Begleiter gemeint, sondern als ALTERNATIVER ANTRIEB mit
  // demselben Verhalten wie der Donut — drehend, pulsend, am Heck.
  // Er traegt die Fahrzeug-/Hauptfarbe, die Augen bleiben weiss.
  const diceHolder = new THREE.Group();
  diceHolder.name = 'drive-dice';
  let diceMeasured = null, diceBody = null, dicePips = null;
  try {
    const dg = await new GLTFLoader().loadAsync(RAW(DICE));
    const ds = dg.scene;
    const dbox = new THREE.Box3().setFromObject(ds);
    const dsz = dbox.getSize(new THREE.Vector3());
    const dscale = 1.15 / Math.max(0.001, Math.max(dsz.x, dsz.y, dsz.z));
    ds.scale.setScalar(dscale);
    ds.position.y = -dbox.getCenter(new THREE.Vector3()).y * dscale;
    // Hellstes Material sind die Augen, dunkelstes der Koerper
    let hi = -1, lo = 1e9;
    ds.traverse(o => {
      if (!o.isMesh) return;
      o.castShadow = false;
      o.material = o.material.clone();
      o.material.toneMapped = false;
      const c2 = o.material.color, lum = c2 ? (c2.r + c2.g + c2.b) : 0;
      if (lum > hi) { hi = lum; dicePips = o.material; }
      if (lum < lo) { lo = lum; diceBody = o.material; }
    });
    if (dicePips) { dicePips.color.set(0xffffff); dicePips.emissive = new THREE.Color(0xffffff); dicePips.emissiveIntensity = 0.5; }
    const dspin = new THREE.Group();
    dspin.add(ds);
    diceHolder.add(dspin);
    diceHolder.userData.spinner = dspin;
    diceMeasured = { modelU: [+dsz.x.toFixed(3), +dsz.y.toFixed(3), +dsz.z.toFixed(3)], scale: +dscale.toFixed(3), edgeM: 1.15 };
  } catch (e) { console.warn('[drive] dice skin:', e.message); }

  // --- Skin 3: reine Kugel ------------------------------------------------
  const orbHolder = new THREE.Group();
  orbHolder.name = 'drive-orb';
  const orbCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.30, 18, 12),
    new THREE.MeshBasicMaterial({ color: C.hot, toneMapped: false })
  );
  const orbHalo = new THREE.Mesh(
    new THREE.SphereGeometry(0.58, 16, 12),
    new THREE.MeshBasicMaterial({
      color: C.hotSoft, transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false
    })
  );
  orbHolder.add(orbCore, orbHalo);

  donutHolder.add(core, halo);
  group.add(donutHolder, diceHolder, orbHolder, light);

  let skin = opts.skin || 'donut';
  let enabled = true;
  const applySkin = () => {
    donutHolder.visible = enabled && skin === 'donut';
    diceHolder.visible = enabled && skin === 'dice';
    orbHolder.visible = enabled && skin === 'orb';
    light.visible = enabled;
  };
  applySkin();

  const tint = new THREE.Color(C.hot);

  return {
    group, measured: donutMeasured, diceMeasured,
    get skin() { return skin; },
    setSkin(v) { skin = v; applySkin(); },
    setEnabled(v) { enabled = v; group.visible = v; applySkin(); },
    get enabled() { return enabled; },
    setColor(hex) {
      tint.set(hex);
      core.material.color.set(hex); halo.material.color.set(hex);
      orbCore.material.color.set(hex); orbHalo.material.color.set(hex);
      light.color.set(hex);
      donutHolder.traverse(o => {
        if (o.isMesh && o.material.emissive) o.material.emissive.set(hex);
      });
      // Der Wuerfel traegt die Hauptfarbe, die Augen bleiben weiss
      if (diceBody) { diceBody.color.set(hex); if (diceBody.emissive) { diceBody.emissive.set(hex); diceBody.emissiveIntensity = 0.3; } }
    },
    get color() { return tint; },

    update(d, t) {
      if (!enabled) return;
      const sp = Math.min(1, Math.abs(d.speed) / FLOW.maxForward);
      const beat = 0.5 + 0.5 * Math.sin(t * (4.5 + sp * 15));
      // Im Stand halb so gross wie bei Hoechstgeschwindigkeit: 0,5 -> 1,05.
      // Der Antrieb waechst mit dem, was er leistet.
      const pulse = 0.50 + sp * 0.55 + beat * (0.04 + sp * 0.16) + (d.boosting ? 0.28 : 0);

      const fx = Math.sin(d.yaw), fz = Math.cos(d.yaw);
      // Der Antrieb haengt im Fahrzeugrahmen, nicht daneben: gleiche Drehung,
      // gleiche Aufbauhoehe, Versatz LOKAL nach hinten und oben.
      _e.set(d.pitch, d.yaw, d.roll, 'YXZ');
      _m.makeRotationFromEuler(_e);
      _m.setPosition(d.x, d.y + vehicleLift(d), d.z);
      _v.set(0, DRIVE_Y, DRIVE_Z).applyMatrix4(_m);
      group.position.copy(_v);
      group.rotation.set(d.pitch, d.yaw, d.roll, 'YXZ');

      donutHolder.scale.setScalar(pulse);
      // GEMESSENER BEFUND aus Georgs Bild: der Ring steckte zur Haelfte in der
      // Fahrbahn. Der Aussendurchmesser ist 1,28 m, bei Pulse 1,33 also 0,85 m
      // Radius \u2014 der Traeger haengt aber fest auf 0,56 m ueber dem Band. Die
      // Aufhaengung waechst jetzt mit dem Ring mit, seine Unterkante bleibt
      // 0,07 m ueber der Fahrbahn.
      const lift = Math.max(0, 0.64 * pulse - 0.49);
      donutHolder.position.y = lift;
      diceHolder.position.y = Math.max(0, 0.58 * pulse - 0.49);
      diceHolder.scale.setScalar(pulse);
      orbHolder.scale.setScalar(pulse);
      if (diceHolder.userData.spinner) {
        const dd = d.speed < -0.2 ? -1 : 1;
        const rate = dd * (0.12 + sp * sp * 26 + (d.boosting ? 9 : 0)) * 0.016;
        diceHolder.userData.spinner.rotation.x += rate;
        diceHolder.userData.spinner.rotation.y += rate * 0.42;
      }
      if (donutHolder.userData.spinner) {
        // Drehzahl folgt dem Tempo — der Ring ist die Anzeige des Antriebs
        // Im Leerlauf dreht der Ring fast nicht — 0,12 statt 0,6 rad/s.
        // Beim Rueckwaertsfahren kehrt sich die Drehrichtung um: der Antrieb zeigt,
        // wohin er schiebt.
        const dir = d.speed < -0.2 ? -1 : 1;
        donutHolder.userData.spinner.rotation.y += dir * (0.12 + sp * sp * 26 + (d.boosting ? 9 : 0)) * 0.016;
      }
      core.material.opacity = 0.55 + sp * 0.4;
      halo.material.opacity = 0.14 + sp * 0.26 + (d.boosting ? 0.2 : 0);
      orbHalo.material.opacity = 0.14 + sp * 0.28 + (d.boosting ? 0.2 : 0);
      light.intensity = 3 + sp * 10 + (d.boosting ? 8 : 0);
    },

    // Die Ansatzpunkte, aus denen Spur und Speedlines wachsen. Weltkoordinaten.
    // Der VOLLE Fahrzeugrahmen, nicht nur die Gierung.
    //
    // GEMELDETER BEFUND (Georg): der Donut sitzt nicht mittig hinter dem Wagen.
    // GEMESSEN: die Karosserie wird mit (pitch, yaw, roll) gedreht UND um
    // vehicleLift() angehoben; Antrieb und Spuransaetze standen dagegen in einem
    // Rahmen, der nur die Gierung kennt. Bei 14 Grad Wank — der Ueberhoehung an
    // der Startlinie — sind das 0,86 m x sin(14°) = 0,21 m seitlicher Versatz
    // plus 0,26 m Hoehe. Deshalb dieselbe Matrix wie die Karosserie.
    frame(d) {
      _e.set(d.pitch, d.yaw, d.roll, 'YXZ');
      _m.makeRotationFromEuler(_e);
      _m.setPosition(d.x, d.y + vehicleLift(d), d.z);
      return _m;
    },

    emitters(d) {
      const m = this.frame(d);
      // Der Rechtsvektor kommt aus der GIERUNG, nicht aus dem gekippten Rahmen.
      // GEMESSEN: aus dem Rahmen genommen und nur in x/z gelesen, ist er nicht
      // mehr Einheitslaenge, sondern cos(roll) lang — das Band wurde bei 24 Grad
      // Ueberhoehung 8,6 % schmaler (0,503 auf 0,460 m). Genau die Breitenschwankung,
      // die diese Naht beseitigen sollte, nur mit dem Wank als Ursache statt dem
      // Tempo. Das Band wird waagerecht gebaut, also gehoert ihm ein waagerechter
      // Einheitsvektor; der volle Rahmen bleibt fuer die LAGE zustaendig.
      const nx = Math.cos(d.yaw), nz = -Math.sin(d.yaw);
      const at = (lat, back, up) => {
        const p = _v.set(lat, up, back).applyMatrix4(m);
        return { x: p.x, y: p.y, z: p.z, nx, nz };
      };
      return [
        { id: 'drive', width: 0.30, p: at(0, DRIVE_Z, DRIVE_Y) },
        { id: 'rear-left', width: 0.085, p: at(-REAR_HALF, REAR_Z, 0.34) },
        { id: 'rear-right', width: 0.085, p: at(REAR_HALF, REAR_Z, 0.34) }
      ];
    }
  };
}

// --------------------------------------------------------------- Spuren
// Eine Spur je Ansatzpunkt. Die Breite kommt vom Ansatzpunkt, nicht vom Tempo —
// Tempo verlaengert. Abtastung nach WEG, Seitenvektor aus der oertlichen Tangente
// der Spur selbst: damit folgt sie jeder Kurve, ohne eckig abzureissen.
export function createTrails(THREE, parent, drive, opts = {}) {
  // Laenger und lueckenlos. Vorher wurde das Sichtfenster mit dem Tempo
  // zusammengezogen — dabei brach die Spur sichtbar ab. Jetzt wird die GANZE
  // Vorgeschichte gezeichnet und nur die Deckkraft laeuft aus; das Tempo
  // entscheidet, OB eine Spur da ist, nicht wo sie aufhoert.
  const N = opts.samples || 132;
  const STEP = 0.42;                 // 132 x 0,42 = rund 55 m Spur
  const MIN_SPEED = 6.5;             // darunter keine Spur — im Stand zieht nichts nach
  const FADE = 3.0;                  // m/s, ueber die sie ein- und ausblendet
  const rigs = [];

  const mk = (id, halfW) => {
    const pos = new Float32Array(N * 2 * 3);
    const col = new Float32Array(N * 2 * 3);
    const alp = new Float32Array(N * 2);
    const idx = [];
    for (let i = 0; i < N - 1; i++) {
      const a = i * 2, b = a + 1, c = a + 2, dd = a + 3;
      idx.push(a, c, b, b, c, dd);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aAlpha', new THREE.BufferAttribute(alp, 1));
    g.setIndex(idx);
    const m = new THREE.Mesh(g, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
      // Additiv, wie im Original und wie im Spender: die Spur ist LICHT, sie
      // hellt auf. Zwischenzeitlich stand hier NormalBlending gegen die
      // Flecken \u2014 falsche Stelle: die Flecken kamen von der rueckwirkend
      // atmenden Bandbreite, und normal gemischt wird aus Licht eine dunkle
      // Lasur. Die Ursache ist im Aufbau behoben, also mischt sie wieder additiv.
      blending: THREE.AdditiveBlending, vertexColors: true,
      vertexShader: 'attribute float aAlpha; varying float vA; varying vec3 vC;' +
        'void main(){ vA=aAlpha; vC=color; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: 'varying float vA; varying vec3 vC;' +
        'void main(){ if(vA<=0.002) discard; gl_FragColor=vec4(vC,vA); }'
    }));
    m.frustumCulled = false;
    m.name = 'trail-' + id;
    parent.add(m);
    rigs.push({ id, halfW, mesh: m, pos, col, alp, hist: [] });
  };
  mk('drive', 0.30); mk('rear-left', 0.085); mk('rear-right', 0.085);

  const gold = new THREE.Color(C.gold);
  const tmp = new THREE.Color();

  return {
    rigs,
    update(d) {
      const sp = Math.min(1, Math.abs(d.speed) / FLOW.maxForward);
      // Tor: unterhalb der Mindestgeschwindigkeit blendet die Spur aus und die
      // Vorgeschichte wird verworfen, damit beim Anfahren nichts Altes aufblitzt.
      const gate = Math.max(0, Math.min(1, (Math.abs(d.speed) - MIN_SPEED) / FADE));
      if (gate <= 0) {
        for (const rig of rigs) {
          if (rig.hist.length) rig.hist.length = 0;
          if (rig.alp[0] !== 0) { rig.alp.fill(0); rig.mesh.geometry.attributes.aAlpha.needsUpdate = true; }
        }
        return;
      }
      const em = drive.emitters(d);
      const driveCol = drive.color;
      for (let k = 0; k < rigs.length; k++) {
        const rig = rigs[k], src = em[k];
        const head = src.p;

        // VERFAHREN AUS FILAMENT #02 GELESEN (KilledByAPixel/SP13KTRA,
        // code/vehicle.js recordTrail + code/track.js drawTrails, All rights
        // reserved — kein Code, keine Zahl uebernommen, nur das Vorgehen):
        //
        //   EIN Eintrag pro BILD am Ansatzpunkt, jeder mit SEINEM eigenen
        //   Rechtsvektor; die Liste wird auf eine feste Anzahl gedeckelt; das
        //   Band ist die Kette der Vierecke zwischen aufeinanderfolgenden
        //   Eintraegen; die Verjuengung laeuft ueber die TATSAECHLICHE Laenge
        //   der Liste.
        //
        // Unsere drei Fehler waren genau die drei Abweichungen davon:
        //   1 Einfuegen nach WEG statt nach Bild, mit bis zu sechs
        //     Zwischenpunkten, die ALLE den Rechtsvektor des Kopfes erbten —
        //     in der Kurve knickt das Band damit auf.
        //   2 Verjuengung ueber die Kapazitaet N statt ueber die vorhandene
        //     Laenge — bei kurzer Vorgeschichte endete das Band auf fast voller
        //     Breite mit harter Kante, die "eckigen Ausbuchtungen".
        //   3 ein nachtraeglich gesetzter Kopf — die Laenge des ersten
        //     Abschnitts schwankte je Bild, das Band zerfiel am Fahrzeug in
        //     Einzelteile.
        rig.hist.unshift({
          x: head.x, y: head.y, z: head.z, nx: head.nx, nz: head.nz,
          w: rig.halfW * (0.4 + 0.6 * sp) * (1 + d.drift * 0.35)
        });
        if (rig.hist.length > N) rig.hist.length = N;

        const h = rig.hist;
        const used = h.length;

        for (let i = 0; i < N; i++) {
          const o = i * 6, oa = i * 2;
          if (i >= used) {
            // Ueberzaehlige Vierecke auf den letzten echten Punkt legen und
            // unsichtbar schalten — sonst stehen sie als Flecken im Bild.
            const q = h[used - 1];
            for (const s of [0, 3]) { rig.pos[o + s] = q.x; rig.pos[o + s + 1] = q.y; rig.pos[o + s + 2] = q.z; }
            rig.alp[oa] = 0; rig.alp[oa + 1] = 0;
            continue;
          }
          const q = h[i];
          const nx = q.nx, nz = q.nz;
          const f = used > 1 ? i / (used - 1) : 1;
          const w = q.w * Math.pow(1 - f, 0.5);
          rig.pos[o] = q.x - nx * w; rig.pos[o + 1] = q.y; rig.pos[o + 2] = q.z - nz * w;
          rig.pos[o + 3] = q.x + nx * w; rig.pos[o + 4] = q.y; rig.pos[o + 5] = q.z + nz * w;
          tmp.copy(d.drift > 0.2 && rig.id !== 'drive' ? gold : driveCol);
          for (const s of [0, 3]) { rig.col[o + s] = tmp.r; rig.col[o + s + 1] = tmp.g; rig.col[o + s + 2] = tmp.b; }
          const base = rig.id === 'drive' ? (0.24 + 0.56 * sp) : (0.12 + 0.46 * sp);
          const alpha = base * gate * Math.pow(1 - f, 1.9);
          rig.alp[oa] = alpha; rig.alp[oa + 1] = alpha;
        }
        rig.mesh.geometry.attributes.position.needsUpdate = true;
        rig.mesh.geometry.attributes.color.needsUpdate = true;
        rig.mesh.geometry.attributes.aAlpha.needsUpdate = true;
      }
    },
    setVisible(v) { rigs.forEach(r => (r.mesh.visible = v)); }
  };
}

// ------------------------------------------------------------- Ugur-Würfel
// Begleiter ueber dem Fahrzeug. Die gezeigte Augenzahl ist die Tempostufe (1–6),
// die Farbe pulsiert mit dem Antrieb. Die Augen leuchten, damit die Zahl auch
// gegen den Sonnenuntergang lesbar bleibt.
const FACE_ROT = [
  [0, 0, 0],                       // 1
  [0, 0, -Math.PI / 2],            // 2
  [Math.PI / 2, 0, 0],             // 3
  [-Math.PI / 2, 0, 0],            // 4
  [0, 0, Math.PI / 2],             // 5
  [Math.PI, 0, 0]                  // 6
];

export async function createDice(THREE, GLTFLoader, parent) {
  let model;
  try { model = (await new GLTFLoader().loadAsync(RAW(DICE))).scene; }
  catch (e) { return null; }

  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  // 1,25 m war im Bild groesser als die halbe Fahrzeugbreite und nahm dem
  // Antrieb die Aufmerksamkeit. 0,78 m liest als Begleiter, nicht als Hauptsache.
  const scale = 0.78 / Math.max(0.001, Math.max(size.x, size.y, size.z));
  model.scale.setScalar(scale);

  // Helle Augen: das hellste Material des Modells bekommt Eigenleuchten.
  let pip = null, best = -1;
  model.traverse(o => {
    if (!o.isMesh) return;
    o.castShadow = false;
    o.material = o.material.clone();
    o.material.toneMapped = false;
    const c = o.material.color;
    const lum = c ? (c.r + c.g + c.b) : 0;
    if (lum > best) { best = lum; pip = o.material; }
  });
  if (pip) { pip.emissive = new THREE.Color(0xffffff); pip.emissiveIntensity = 0.85; }

  const holder = new THREE.Group();
  holder.name = 'kfb-dice-companion';
  holder.add(model);
  parent.add(holder);

  let face = 1, targetE = new THREE.Euler(0, 0, 0);
  const cur = new THREE.Euler(0, 0, 0);

  return {
    group: holder, model,
    measured: { modelU: [+size.x.toFixed(3), +size.y.toFixed(3), +size.z.toFixed(3)], scale: +scale.toFixed(3), pipMaterial: !!pip },
    get face() { return face; },
    setVisible(v) { holder.visible = v; },
    update(d, t, driveColor) {
      const sp = Math.min(1, Math.abs(d.speed) / FLOW.maxForward);
      const tier = Math.max(1, Math.min(6, 1 + Math.floor(sp * 5.999)));
      if (tier !== face) {
        face = tier;
        const r = FACE_ROT[tier - 1];
        targetE.set(r[0], r[1], r[2]);
      }
      // Die Drehung zur Zielseite ist gedaempft: der Wuerfel kippt, er springt nicht
      const k = Math.min(1, 0.055);
      cur.x += (targetE.x - cur.x) * k;
      cur.y += (targetE.y - cur.y) * k;
      cur.z += (targetE.z - cur.z) * k;
      model.rotation.set(cur.x, cur.y + t * 0.32, cur.z);

      const fx = Math.sin(d.yaw), fz = Math.cos(d.yaw);
      holder.position.set(d.x - fx * 5.6 + fz * 1.5, d.y + 3.2 + Math.sin(t * 1.3) * 0.2, d.z - fz * 5.6 - fx * 1.5);

      if (pip) {
        const beat = 0.5 + 0.5 * Math.sin(t * (3 + sp * 10));
        pip.emissiveIntensity = 0.5 + beat * (0.3 + sp * 0.6);
        if (driveColor) pip.emissive.copy(driveColor).lerp(new THREE.Color(0xffffff), 0.45);
      }
    }
  };
}
