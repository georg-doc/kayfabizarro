import { createSupportSurfaceResolver } from './support-surface.js';

function waitForRuntime(timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const tick = () => {
      if (window.__wb0?.ground && window.__globe?.scene) return resolve({ wb0: window.__wb0, g: window.__globe });
      if (performance.now() - t0 > timeoutMs) return reject(new Error('Support Surface gate timed out waiting for WB0'));
      setTimeout(tick, 40);
    };
    tick();
  });
}

function supportKindForAnchor(anchor) {
  if (anchor.userData?.wb0SupportSurface === false) return null;
  if (anchor.userData?.wb0SupportSurface === true) return anchor.userData.wb0SupportKind || 'prop';
  const name = String(anchor.name || '');
  if (/Stunt Ramp/i.test(name)) return 'ramp';
  if (/BlockBits Grass/i.test(name)) return 'voxel';
  if (/Caveman Mine/i.test(name)) return 'structure';
  return null;
}

async function main() {
  const { wb0, g } = await waitForRuntime();
  const bodyHeight = Number(wb0.report?.().bodyHeight) || 0.022;
  const resolver = createSupportSurfaceResolver({
    terrainRadiusAt: (direction) => wb0.ground.radiusAt(direction),
    bodyHeight,
  });

  // One Ground owner: this resolver only answers "what is directly under the feet?".
  wb0.ground.setSupportResolver((direction, terrainRadius) => resolver.resolve(direction, terrainRadius));

  // Terrain cards already have a dense ground-conforming mesh. Register that exact mesh group as
  // walkable support instead of inventing another card plane. In WB0 only, reduce the old 0.004-u
  // geometric lift to a hairline; karten-teppich already owns polygonOffset for z-fighting.
  let cardLift = null;
  if (g.teppiche?.group) {
    const desiredLift = bodyHeight * 0.01;
    cardLift = {
      before: Number(g.teppiche.params?.lift),
      after: desiredLift,
    };
    if (g.teppiche.params && Number.isFinite(g.teppiche.params.lift) && g.teppiche.params.lift > desiredLift) {
      g.teppiche.params.lift = desiredLift;
      if (typeof g.teppiche.neubau === 'function') g.teppiche.neubau();
    }
    resolver.registerObject('travel-terrain-cards', g.teppiche.group, {
      kind: 'card',
      minUpDot: 0.12,
      maxRise: bodyHeight * 2,
    });
  }

  // Authored props can opt in with userData.wb0SupportSurface=true. The current WB0 proof also
  // recognizes its named Ramp / BlockBits / Mine anchors so existing saved recipes work unchanged.
  const authored = new Map();
  function syncAuthoredSupports() {
    const seen = new Set();
    g.scene.traverse((object) => {
      const id = object.userData?.wb0Id;
      if (!id) return;
      const kind = supportKindForAnchor(object);
      if (!kind) return;
      const key = `wb0-authored:${id}`;
      seen.add(key);
      if (!authored.has(key)) {
        const off = resolver.registerObject(key, object, {
          kind,
          minUpDot: kind === 'ramp' ? 0.18 : 0.28,
          maxRise: bodyHeight * 12,
        });
        authored.set(key, off);
      }
    });
    for (const [key, off] of [...authored.entries()]) {
      if (seen.has(key)) continue;
      off();
      authored.delete(key);
    }
  }
  syncAuthoredSupports();
  const timer = setInterval(syncAuthoredSupports, 500);

  wb0.supportSurfaces = {
    resolver,
    cardLift,
    sync: syncAuthoredSupports,
    register(id, object, options = {}) {
      return resolver.registerObject(id, object, options);
    },
    report() {
      return {
        cardLift,
        groundSupport: wb0.ground.state.support,
        authored: authored.size,
        resolver: resolver.report(),
      };
    },
    dispose() {
      clearInterval(timer);
      for (const off of authored.values()) off();
      authored.clear();
      resolver.clear();
      wb0.ground.setSupportResolver(null);
    },
  };

  console.info('[wb0 support-surface]', wb0.supportSurfaces.report());
}

main().catch((error) => console.warn('[wb0 support-surface]', error));
