/* Der Hub als Welt. Kein Panel über der Insel: die Insel IST die Übersicht, und alles, was man
   liest, ist ein eigener Bildschirm darüber — der die Welt anhält, statt sie zu verdecken. */
import * as THREE from 'three';
import { buildScene, makeViewer, measured, measure } from '../lib/kit-lab.js';
import { worldToHex, neighbor } from '../lib/hex-grid.js';
import { loadParts, islandRefs, buildIsland, key } from './island.js';
import { buildStations, roster, SIGN_REF } from './stations.js';
import * as Atlas from '../lib/atlas.js';

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
if (typeof window !== 'undefined') window.THREE = THREE;   // Diagnose aus der Konsole

export async function start(opts) {
  const { canvas, onProgress, onReady, onPick, onWalkState, onClip } = opts;
  const V = makeViewer(canvas, { background: 0x22323c, fov: 30, mood: 'day' });

  onProgress?.('Insel-Teile laden', 0, 1);
  const refs = [...islandRefs(), SIGN_REF];
  await loadParts(refs, (d, t) => onProgress?.('Insel-Teile laden', d, t));

  const I = buildIsland();
  const root = await buildScene(I.placements, (d, t) => onProgress?.('Insel bauen', d, t), {});
  V.scene.add(root);

  /* Meer: Höhe ist gemessen, nicht getippt — Oberkante der Wasserkachel, sonst Stufe am Ufer. */
  const waterTop = measured.get('hex_base/hex_water')?.max[1] ?? -0.2;
  const water = new THREE.Mesh(new THREE.PlaneGeometry(600, 600),
    new THREE.MeshLambertMaterial({ color: 0x3f8fd0 }));
  water.rotation.x = -Math.PI / 2; water.position.y = waterTop; water.receiveShadow = true;
  V.scene.add(water);

  const tiles = await fetch('../hub-tiles.json').then((r) => r.json());
  const stations = buildStations(tiles.tiles);
  const todos = tiles.nextActions || [];

  /* ---------- Stationen: das Gebäude selbst ist anklickbar ---------- */
  const stationOf = new Map();          // Object3D -> station
  const stationNode = new Map();        // station.id -> Object3D
  for (const node of root.children) {
    const rec = node.userData.recipe;
    if (rec?.layer !== 'building') continue;
    const st = stations.find((s) => s.cell[0] === rec.cell[0] && s.cell[1] === rec.cell[1]);
    if (!st) continue;
    stationNode.set(st.id, node);
    node.traverse((o) => stationOf.set(o, st));
  }

  /* ---------- Ein Maßstab für alles, was kein Gebäude ist ----------
     Steht hier oben, weil Wegweiser und Bewohner denselben Bezug brauchen. Genau das war der
     Fehler: die Bewohner wurden dreimal nachjustiert, die Schilder behielten ihre handgetippte
     2,6 aus der Fassung, in der Figuren noch 2,4 hoch waren — am Ende war ein Wegweiser fast
     zwei Menschen hoch. */
  const FIG_OF_BUILDING = 0.38;
  const bldHeights = [...I.buildingAt.values()]
    .map((b) => measured.get(b.ref.replace(':', '/'))?.size[1]).filter(Boolean).sort((a, b) => a - b);
  const medianBuilding = bldHeights[Math.floor(bldHeights.length / 2)] || 2.2;
  const FIG_HEIGHT = medianBuilding * FIG_OF_BUILDING;
  const figureScale = (path, rig) => {
    const h = Atlas.measured.get(path)?.size[1] || 2.4;
    return (FIG_HEIGHT * (rig === 'Rig_Large' ? 1.25 : 1)) / h;
  };

  /* ---------- Wegweiser: rote Hülle, pulsierend ----------
     Umgedrehte Hülle statt Nachbearbeitungs-Kontur: ein zweites Mesh, leicht größer, von innen
     gerendert. Das trägt auf jedem Material des Packs, ohne eine Render-Kette einzuziehen. */
  const pulses = [];
  function addOutline(node, colour = 0xff2b2b) {
    const shell = new THREE.Group();
    node.traverse((o) => {
      if (!o.isMesh || o.isSkinnedMesh) return;
      const m = new THREE.Mesh(o.geometry, new THREE.MeshBasicMaterial({
        color: colour, side: THREE.BackSide, transparent: true, opacity: 0.9, depthWrite: false
      }));
      o.updateWorldMatrix(true, false);
      m.matrixAutoUpdate = false;
      /* Um den GEOMETRIE-Mittelpunkt aufweiten, nicht um den lokalen Ursprung. Der Pivot eines
         Schilds sitzt am Pfostenfuß — eine Skalierung darum schiebt die Hülle nach oben und zur
         Seite, und die Kontur erscheint nur an Ober- und rechter Kante. */
      o.geometry.computeBoundingBox();
      const c = o.geometry.boundingBox.getCenter(new THREE.Vector3());
      const k = 1.09;
      const grow = new THREE.Matrix4().makeTranslation(c.x, c.y, c.z)
        .multiply(new THREE.Matrix4().makeScale(k, k, k))
        .multiply(new THREE.Matrix4().makeTranslation(-c.x, -c.y, -c.z));
      m.matrix.copy(node.matrixWorld.clone().invert().multiply(o.matrixWorld)).multiply(grow);
      shell.add(m);
    });
    node.add(shell);
    pulses.push(shell);
    return shell;
  }

  const todoOf = new Map();
  const todoNodes = [];
  const pins = [];
  /* ---------- Marker in BILDSCHIRM-Größe, nicht in Weltgröße ----------
     Die rote Hülle trägt in der Nahaufnahme, aber nicht in der Übersicht: 9 % Aufweitung an einem
     0,75 hohen, flachen Brett sind dort rund ein Pixel. Größer machen ist keine Option — die
     Größe der Schilder war zweimal der Beanstandungsgrund. Ein Sprite mit `sizeAttenuation:false`
     löst das an der Wurzel: seine Größe ist ein Anteil der Viewporthöhe und damit von der
     Kameradistanz unabhängig — in der Übersicht so groß wie im Nahbild. */
  function pinTexture() {
    const s = 128, cv = document.createElement('canvas');
    cv.width = cv.height = s;
    const g = cv.getContext('2d');
    g.translate(s / 2, s * 0.06);
    g.beginPath();
    g.moveTo(0, s * 0.88);                       // Spitze unten
    g.bezierCurveTo(-s * 0.36, s * 0.46, -s * 0.34, 0, 0, 0);
    g.bezierCurveTo(s * 0.34, 0, s * 0.36, s * 0.46, 0, s * 0.88);
    g.closePath();
    g.fillStyle = '#ff2b2b';
    g.strokeStyle = '#7d0d0d';
    g.lineWidth = s * 0.055;
    g.fill(); g.stroke();
    g.beginPath();
    g.arc(0, s * 0.30, s * 0.115, 0, Math.PI * 2);
    g.fillStyle = '#fff2f0';
    g.fill();
    const t = new THREE.CanvasTexture(cv);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }
  const PIN_TEX = pinTexture();
  {
    /* Wegweiser stehen auf freien Innenzellen, nach Nähe zum Markt sortiert — keine getippte
       Liste, die bricht, sobald ein Gebäude umzieht. */
    /* Über die Insel verteilt, nicht auf einen Haufen: nach Winkel um die Inselmitte sortiert
       und dann gleichmäßig durchgezählt. Zehn Wegweiser am Markt wären eine Liste in 3D. */
    const mid = I.world(6, 6);
    const ring = I.freeCells
      .map((c) => { const w2 = I.world(c[0], c[1]); return { c, a: Math.atan2(w2[2] - mid[2], w2[0] - mid[0]) }; })
      .sort((a, b) => a.a - b.a);
    const step = ring.length / Math.max(1, todos.length);
    const spots = todos.map((_, i) => ring[Math.floor(i * step)].c);
    const placements = spots.map((cell, i) => ({
      a: SIGN_REF, p: I.onCell(SIGN_REF, cell, (i * 47) % 360), r: (i * 47) % 360, cell, layer: 'todo'
    }));
    const signs = await buildScene(placements, null, {});
    V.scene.add(signs);
    /* Höhe abgeleitet, nicht gesetzt: ein Wegweiser steht auf Kopfhöhe eines Bewohners.
       Und danach erden — Skalieren um den Pivot zieht den Fuß unter das Gelände, je größer der
       Faktor desto tiefer (gemessen: 0,13 unter Null bei allen zehn). */
    const sm = measured.get(SIGN_REF.replace(':', '/'));
    const signScale = sm?.size[1] ? (FIG_HEIGHT * 1.15) / sm.size[1] : 1;
    signs.children.forEach((node, i) => {
      const t = todos[i];
      if (!t) return;
      node.scale.setScalar(signScale);
      node.position.y = -((sm?.min[1] ?? 0) * signScale);
      /* Kenneys Exporter schreibt `metalness: 1` ohne Textur und ohne Environment Map. Eine
         vollmetallische Fläche, die nichts zu spiegeln hat, rendert schwarz — die zehn Schilder
         waren dunkle Platten statt Holz. Die Basisfarben sind bereits authored (helles Holz),
         also reicht es, das Export-Artefakt zurückzunehmen. Die Hex-Pack-Teile daneben laufen
         ohnehin auf metalness 0. */
      node.traverse((o) => {
        if (!o.isMesh) return;
        for (const mat of (Array.isArray(o.material) ? o.material : [o.material])) {
          if (!mat || mat.metalness === undefined) continue;
          mat.metalness = 0;
          mat.roughness = Math.max(0.5, mat.roughness ?? 1);
          mat.needsUpdate = true;
        }
      });
      addOutline(node);
      node.traverse((o) => todoOf.set(o, t));
      todoNodes.push(node);

      const pin = new THREE.Sprite(new THREE.SpriteMaterial({
        map: PIN_TEX, sizeAttenuation: false, transparent: true, depthTest: false, opacity: 0.95
      }));
      pin.scale.set(0.026, 0.042, 1);            // Anteil der Viewporthöhe, nicht Welteinheiten
      pin.center.set(0.5, 0);                    // Spitze sitzt auf dem Ankerpunkt
      pin.position.set(node.position.x, (sm?.size[1] ?? 0.6) * signScale + 0.06, node.position.z);
      pin.renderOrder = 10;
      pin.userData.todo = t;
      V.scene.add(pin);
      pins.push(pin);
      todoOf.set(pin, t);
    });
  }

  onReady?.({ stations, todos, metrics: I.M });
  V.frame(root, [0.4, 0.86, 1], 0.78);

  /* ---------- Bewohner: nach der Insel, damit die Insel nicht darauf wartet ----------
     Nur Aktor plus Hand-Requisiten. Die vollen Vignetten aus dem Resident Atlas sind bis zu
     neun Einheiten breit — auf einer zwei Einheiten breiten Kachel wäre das keine Station mehr,
     sondern ein Teppich. Kulisse liefert die Insel selbst. */
  const residentOf = new Map();
  const mixers = [];

  /* Freie Nachbarzelle: der Hof steht NEBEN dem Gebäude auf einer eigenen Kachel, nicht auf der
     Gebäudekachel mit Versatz. Damit ist die Frage „ragt etwas in den Fluss" strukturell erledigt
     statt per Abstand gehofft — genau die Schubkarre, die zwei Zellen weiter im Wasser lag.
     Zweite Wahl ist eine Landzelle ohne Gebäude (Straße oder Wiese ist als Vorplatz in Ordnung),
     denn „keine freie Zelle gefunden" darf nicht heißen „dann eben ins Haus". */
  const freeKeys = new Set(I.freeCells.map(([c, r]) => key(c, r)));
  const yardCellFor = (cell) => {
    for (let d = 0; d < 6; d++) {
      const n = neighbor(cell[0], cell[1], d);
      if (freeKeys.has(key(n[0], n[1]))) { freeKeys.delete(key(n[0], n[1])); return n; }
    }
    for (let d = 0; d < 6; d++) {
      const n = neighbor(cell[0], cell[1], d);
      if (I.cellKind(n[0], n[1]) === 'g' && !I.buildingAt.has(key(n[0], n[1]))) return n;
    }
    return cell;
  };

  async function placeResidents() {
    for (const st of stations) {
      const rec = st.recipe;
      if (!rec?.actor) continue;
      try {
        const node = await Atlas.instance(rec.actor.a, rec.actor.commit);
        const rig = rec.actor.rig || rec.actor.rigFamily || 'Rig_Medium';
        const sc = figureScale(rec.actor.a, rig);

        /* Der ganze Hof wird als Gruppe gesetzt und als Gruppe skaliert. Damit bleibt die
           Komposition des Atlas-Rezepts (Pult links vom Lorekämper, Puppe vor dem Schwertkämpfer)
           erhalten — sie wird nur miniaturisiert, statt neu erfunden. */
        const yard = new THREE.Group();
        yard.scale.setScalar(sc);
        const cellY = yardCellFor(st.cell);
        const wy = I.world(cellY[0], cellY[1]);
        const w0 = I.world(st.cell[0], st.cell[1]);
        yard.position.set(wy[0], 0, wy[2]);
        yard.rotation.y = Math.atan2(w0[0] - wy[0], w0[2] - wy[2]) + Math.PI;
        st.yardCell = cellY;

        /* Rezeptkoordinaten sind relativ zum Aktor, nicht zur Zelle — und sie stammen aus einer
           Vignette OHNE Nachbarn. Die Schubkarre der Farmers liegt dort 4,0 vom Aktor entfernt;
           auf einer 2,0 breiten Hexkachel sind das zwei Zellen weiter, und genau so landete sie
           im Fluss. Die Richtung des Rezepts bleibt erhalten, die Entfernung wird auf den
           Kachel-Innenradius gedeckelt. */
        const ap = rec.actor.p || [0, 0];
        const maxLocal = (I.M.inradius * 0.62) / sc;
        const local = (p) => {
          const dx = (p?.[0] ?? 0) - ap[0], dz = (p?.[1] ?? 0) - ap[1];
          const d = Math.hypot(dx, dz);
          if (d <= maxLocal || d === 0) return [dx, dz];
          const k = maxLocal / d;
          return [dx * k, dz * k];
        };

        /* ERDUNG. KayKit-Pivots sitzen nicht durchgehend auf der Unterkante: das Clown-Podest
           steckte 0,356 im Hexfeld, der Reifen schwebte um denselben Betrag darüber. Also gegen
           die gemessene Box erden, nicht auf y = 0 setzen. Und die Oberkante eines Wirts ist
           seine SKALIERTE Höhe — das Podest läuft auf s = 0,55, der Reifen saß trotzdem auf
           voller Podesthöhe. */
        const entryOf = (id) => [...(rec.habitat || []), ...(rec.signatureProps || [])].find((h) => h.id === id);
        const groundY = (e) => -((Atlas.measured.get(e.a)?.min[1] ?? 0) * (e.s || 1));
        const topOf = (id) => {
          const host = entryOf(id);
          const m = host && Atlas.measured.get(host.a);
          return m ? m.size[1] * (host.s || 1) : 0;
        };
        const restY = (e) => (e.on ? topOf(e.on) : 0) + groundY(e);

        node.position.set(0, 0, 0);
        node.rotation.y = THREE.MathUtils.degToRad(rec.actor.r || 0);
        node.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
        yard.add(node);

        if (rec.actor.pose) {
          const clips = await Atlas.loadClips(rig);
          const hit = clips.find((c) => rec.actor.pose.test(c.name));
          if (hit) {
            const mx = new THREE.AnimationMixer(node);
            mx.clipAction(hit.clip).play();
            mixers.push(mx);
            st.poseName = hit.name;
            st.bind = Atlas.bindReport(node, hit.clip);
          }
        }

        /* Signatur-Requisiten. Handrequisiten stecken im Bone, Bodenrequisiten stehen im Hof.
           Promo-Füllung und abgeschaltete Vergleichsstücke bleiben draußen.
           Zwei Fehler der ersten Fassung sind hier abgestellt: die Liste enthielt Einträge
           DOPPELT (einmal über signatureProps, einmal über die Bodenauswahl — der Clown stand
           zweimal auf demselben Podest), und ein Budget von vier Plätzen ging bei den Farmers
           komplett für vier Beete drauf, sodass der zweite Bauer samt Forke und Schubkarre
           wegfiel. Jetzt: Kulisse höchstens zweimal, Requisiten höchstens dreimal, und ein
           Eintrag mit eigenem `rig` ist ein zweiter AKTOR und immer dabei. */
        const hands = (rec.signatureProps || []).filter((p) => p.hand?.of === rec.actor.id);
        const actors2 = (rec.signatureProps || []).filter((p) => p.rig && !p.hand);
        const usable = (p) => !p.hand && !p.rig && p.role !== 'promo-extra' && !p.optional;
        const ground = [
          ...actors2,
          ...(rec.habitat || []).slice(0, 2),
          ...(rec.signatureProps || []).filter((p) => usable(p) && p.slot).slice(0, 3)
        ];
        const placedProps = [];
        const seenProp = new Set();
        for (const p of hands) {
          try {
            const found = Atlas.findBone(node, p.hand.bone);
            if (!found) continue;
            const prop = await Atlas.instance(p.a, p.commit);
            if (p.s) prop.scale.setScalar(p.s);
            found.bone.add(prop);
            placedProps.push(p.role || p.id);
          } catch (e) { console.warn('hand prop', p.id, e.message); }
        }
        const nodesById = new Map([[rec.actor.id, node]]);
        for (const p of ground) {
          if (seenProp.has(p.id)) continue;
          seenProp.add(p.id);
          try {
            const prop = await Atlas.instance(p.a, p.commit);
            const l = local(p.p);
            prop.position.set(l[0], restY(p), l[1]);
            prop.rotation.y = THREE.MathUtils.degToRad(p.r || 0);
            if (p.s) prop.scale.setScalar(p.s);
            prop.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
            yard.add(prop);
            nodesById.set(p.id, prop);
            placedProps.push(p.role || p.id);
            if (p.rig && p.pose) {
              const clips2 = await Atlas.loadClips(p.rig);
              const hit2 = clips2.find((c) => p.pose.test(c.name));
              if (hit2) { const mx2 = new THREE.AnimationMixer(prop); mx2.clipAction(hit2.clip).play(); mixers.push(mx2); }
            }
          } catch (e) { console.warn('prop', p.id, e.message); }
        }
        /* Handrequisiten eines ZWEITEN Aktors (Farmer_B trägt die Forke). */
        for (const p of (rec.signatureProps || [])) {
          if (!p.hand || p.hand.of === rec.actor.id) continue;
          const host = nodesById.get(p.hand.of);
          if (!host) continue;
          try {
            const found = Atlas.findBone(host, p.hand.bone);
            if (!found) continue;
            const prop = await Atlas.instance(p.a, p.commit);
            if (p.s) prop.scale.setScalar(p.s);
            found.bone.add(prop);
            placedProps.push(p.role || p.id);
          } catch (e) { console.warn('hand prop 2', p.id, e.message); }
        }
        st.props = placedProps;
        st.scale = +sc.toFixed(3);

        /* Der Aktor hat sein eigenes `on:` — der Clown steht laut Rezept AUF dem Hauptpodest.
           Das geht erst, wenn das Podest gebaut und gemessen ist, also hier und nicht oben. */
        node.position.y = restY(rec.actor);

        V.scene.add(yard);
        yard.traverse((o) => residentOf.set(o, st));
        st.residentNode = yard;
      } catch (e) { console.warn('resident', st.resident, e.message); }
    }
  }
  placeResidents();

  /* ---------- Picking ---------- */
  const ray = new THREE.Raycaster();
  let down = null;
  canvas.addEventListener('pointerdown', (e) => { down = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', (e) => {
    if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
    const r = canvas.getBoundingClientRect();
    ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1,
      -((e.clientY - r.top) / r.height) * 2 + 1), V.camera);
    for (const hit of ray.intersectObjects(V.scene.children, true)) {
      const t = todoOf.get(hit.object);
      if (t) return onPick?.({ type: 'todo', todo: t });
      const s = stationOf.get(hit.object) || residentOf.get(hit.object);
      if (s) return onPick?.({ type: 'station', station: s });
    }
  });

  function focusStation(st) {
    const node = stationNode.get(st.id);
    if (!node) return;
    const box = new THREE.Box3().setFromObject(node);
    if (st.residentNode) box.expandByObject(st.residentNode);
    const c = box.getCenter(new THREE.Vector3());
    const radius = Math.max(2.5, box.getSize(new THREE.Vector3()).length() * 0.5);
    const dist = radius * 3.2;
    const dir = new THREE.Vector3(0.45, 0.72, 1).normalize().multiplyScalar(dist);
    V.camera.position.copy(c).add(dir);
    V.controls.target.copy(c);
    V.controls.update();
  }

  /* ---------- Laufmodus ---------- */
  /* Begehbar ist eine Frage der Zelle, nicht des Abstands. Die erste Fassung fragte „liegt der
     Punkt innerhalb von 0,95 um irgendeinen Zellmittelpunkt" — solche Kreise kacheln nicht: bei
     Inkreis 1 und Umkreis 1,155 blieb zwischen ihnen ein totes Band, in dem 34 % der Landfläche
     lag. Der Spawnpunkt lag mit 1,064 selbst darin, also wurde JEDER Schritt abgelehnt und die
     Figur lief auf der Stelle. Jetzt wird die Zelle exakt bestimmt und ihre Art gefragt. */
  const onLand = (x, z) => {
    const [c, r] = worldToHex(x, z, I.M);
    return I.cellKind(c, r) === 'g';
  };

  const keys = new Set();
  addEventListener('keydown', (e) => { if (player) keys.add(e.code); });
  addEventListener('keyup', (e) => keys.delete(e.code));

  let player = null, pMixer = null, pClips = [], pAction = null, pCurrent = null, pMotion = null;

  /* Fortbewegung wird AUFGELÖST, nicht geraten.
     Erste Fassung suchte fest nach "Walking"/"Running"/"Idle_A" — das sind Rig_Medium-Namen.
     Die Legacy-Bibliothek (KayKit_AnimatedCharacter_v1.2.glb, 30 Clips in einer Datei) heißt
     dieselben Bewegungen "Walk", "Run", "Idle". Kein Treffer, also kein Wechsel: Prototype Pete
     spawnte in pClips[0] — "Attack(1h)" — und glitt schlagend über die Insel. */
  const pickClip = (clips, patterns) => {
    for (const rx of patterns) { const hit = clips.find((c) => rx.test(c.name)); if (hit) return hit.name; }
    return null;
  };
  function resolveMotion(clips) {
    const idle = pickClip(clips, [/^Idle_A$/, /^Idle$/i, /^Idle/i]);
    const walk = pickClip(clips, [/^Walking_A$/, /^Walk$/i, /^Walking/i, /^Walk/i]);
    const run = pickClip(clips, [/^Running_A$/, /^Run$/i, /^Running/i, /^Run/i]);
    return { idle: idle || clips[0]?.name || null, walk: walk || idle, run: run || walk || idle };
  }
  const playClip = (name) => {
    if (!pMixer || !pClips.length) return null;
    const hit = pClips.find((c) => c.name === name) || pClips.find((c) => new RegExp(name, 'i').test(c.name));
    if (!hit || hit.name === pCurrent) return pCurrent;
    const next = pMixer.clipAction(hit.clip);
    next.reset().fadeIn(0.18).play();
    if (pAction) pAction.fadeOut(0.18);
    pAction = next; pCurrent = hit.name;
    onClip?.(hit.name);
    return hit.name;
  };

  async function spawn(entry) {
    if (player) { V.scene.remove(player); player = null; pMixer = null; pAction = null; pCurrent = null; }
    /* Eine Legacy-Figur ist kein geriggtes Modell, sondern VIER Teile (Body, Head, armLeft,
       armRight), die gegen das Legacy-Skelett montiert werden müssen. Direkt instanziert bindet
       sie 0 von 16 Tracks — eine Statue mit Mixer. legacyAssemble() macht die Montage. */
    const node = entry.rig === 'Rig_Legacy'
      ? await Atlas.legacyAssemble(entry.path, Atlas.LEGACY_RIG, entry.commit)
      : await Atlas.instance(entry.path, entry.commit);
    node.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    node.scale.setScalar(figureScale(entry.path, entry.rig));
    /* Startpunkt ist ein Zellmittelpunkt, keine freihändige Verschiebung neben den Markt. */
    const mk = I.world(6, 5);
    const home = I.freeCells
      .map((c) => ({ c, d: Math.hypot(I.world(c[0], c[1])[0] - mk[0], I.world(c[0], c[1])[2] - mk[2]) }))
      .sort((a, b) => a.d - b.d)[0]?.c || [6, 6];
    const w = I.world(home[0], home[1]);
    node.position.set(w[0], 0, w[2]);
    V.scene.add(node);
    player = node;
    pClips = await Atlas.loadClips(entry.rig || 'Rig_Medium');
    pMixer = new THREE.AnimationMixer(node);
    pMotion = resolveMotion(pClips);
    let bind = null;
    const idle = pClips.find((c) => c.name === pMotion.idle);
    if (idle) { bind = Atlas.bindReport(node, idle.clip); playClip(idle.name); }
    onWalkState?.({ entry, clips: pClips.map((c) => ({ name: c.name, set: c.set })), bind, current: pCurrent, motion: pMotion });
    focusPlayer(true);
    return { clips: pClips, bind };
  }
  function focusPlayer(snap) {
    if (!player) return;
    const p = player.position;
    if (snap) V.camera.position.set(p.x + 4.5, p.y + 5, p.z + 6.5);
    V.controls.target.set(p.x, p.y + medianBuilding * 0.3, p.z);
    V.controls.update();
  }

  let follow = true;
  V.onFrame((dt) => {
    for (const m of mixers) m.update(dt);
    pMixer?.update(dt);
    for (const s of pulses) {
      /* Nur die Deckkraft pulsiert. Eine pulsierende SKALIERUNG der Hülle würde sie wieder um
         den Gruppenursprung verschieben — dasselbe Problem, das die Kontur schon einmal schief
         gelegt hat. */
      const o = 0.45 + Math.sin(performance.now() / 260) * 0.35;
      s.children.forEach((m) => { m.material.opacity = o; });
    }
    const po = 0.62 + Math.sin(performance.now() / 300) * 0.34;
    for (const p of pins) p.material.opacity = po;
    if (!player) return;
    const run = keys.has('ShiftLeft') || keys.has('ShiftRight');
    let ix = 0, iz = 0;
    if (keys.has('KeyW') || keys.has('ArrowUp')) iz -= 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) iz += 1;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) ix -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) ix += 1;
    if (ix || iz) {
      /* Richtung relativ zur Kamera, sonst läuft die Figur beim Drehen der Ansicht rückwärts. */
      const fwd = new THREE.Vector3().subVectors(V.controls.target, V.camera.position).setY(0).normalize();
      const rightV = new THREE.Vector3().crossVectors(fwd, new THREE.Vector3(0, 1, 0)).normalize();
      const dir = new THREE.Vector3().addScaledVector(fwd, -iz).addScaledVector(rightV, ix).normalize();
      const speed = (run ? 4.6 : 2.1) * dt;   // Schritt zur Figurengröße, nicht zur Weltgröße
      const nx = player.position.x + dir.x * speed, nz = player.position.z + dir.z * speed;
      if (onLand(nx, nz)) { player.position.x = nx; player.position.z = nz; }
      player.rotation.y = Math.atan2(dir.x, dir.z);
      playClip(run ? pMotion.run : pMotion.walk);
    } else playClip(pMotion.idle);
    if (follow) focusPlayer(false);
  });

  addEventListener('resize', () => V.resize());

  const measuredModel = () => ({
    medianBuilding: +medianBuilding.toFixed(3),
    figureRatio: FIG_OF_BUILDING,
    buildings: [...I.buildingAt.values()].map((b) => ({
      kind: b.kind, cell: b.cell,
      h: +(measured.get(b.ref.replace(':', '/'))?.size[1] ?? 0).toFixed(2),
      w: +(measured.get(b.ref.replace(':', '/'))?.size[0] ?? 0).toFixed(2)
    })).sort((a, b) => b.h - a.h)
  });

  return {
    V, island: I, stations, todos, roster: roster(), measuredModel,
    focusStation, spawn,
    playClip: (n) => playClip(n),
    setFollow: (v) => { follow = v; },
    despawn: () => { if (player) { V.scene.remove(player); player = null; pMixer = null; pCurrent = null; } },
    hasPlayer: () => !!player,
    playerPos: () => (player ? player.position.toArray().map((n) => +n.toFixed(3)) : null),
    overview: () => V.frame(root, [0.4, 0.86, 1], 0.78)
  };
}
