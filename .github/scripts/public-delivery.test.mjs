import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { publicPack, rewriteMainUrls, projectRecord, restrictedCopies } from './public-delivery.mjs';
const policy = JSON.parse(await readFile(new URL('../public-delivery/policy.json', import.meta.url)));
const root = policy.allowedPacks[0].root;

test('only explicit free packs are admitted, with a directory boundary', () => {
  assert.ok(publicPack(policy, root + '/a.glb'));
  for (const p of [root + '-EXTRA/a.glb', root + '/../Mystery/a.glb', root + '/./a.glb', 'media/3D_Assets/New_FREE/a.glb']) assert.equal(publicPack(policy, p), null);
});
test('Georg purchased and derived media remain denied regardless of local license label', () => {
  for (const p of ['media/3D_Assets/KayKit_Mystery_Series6/Driver/a.glb', 'media/3D_Assets/MeshyModels/B7/a.glb', 'media/3D_Assets/Sounds/Cozy Tunes - The Classics/a.mp3', 'media/3D_Assets/KayKit Legacy/a.glb', 'media/2D_Assets/free-top-down-goblin-character-sprite/a.png']) assert.equal(publicPack(policy, p), null);
});
test('main transport migrates only this repository and preserves third-party libraries', () => {
  const own = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/kfb/index.json';
  assert.equal(rewriteMainUrls(own, policy.baseUrl), policy.baseUrl + '/media/kfb/index.json');
  const third = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
  assert.equal(rewriteMainUrls(third, policy.baseUrl), third);
});
test('immutable refs are preserved; unconfigured refs are never remapped to main', () => {
  const url = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/abc/media/3D_Assets/a.glb';
  assert.equal(rewriteMainUrls(url, policy.baseUrl), url);
  assert.equal(rewriteMainUrls(url, policy.baseUrl, ['abc']), policy.baseUrl + '/public-assets/refs/abc/media/3D_Assets/a.glb');
});
test('registry projection refuses unknown bytes and preserves source identities', () => {
  const record = { path: root + '/a.glb', source: { repo: policy.sourceRepo, commit: 'old', blobSha: 'blob', rawLatest: 'raw', rawPinned: 'raw-old' } };
  const map = new Map([[record.path, { blob: 'blob', verifiedRefs: new Set(['old']), pinnedUrl: 'https://example.test/immutable/a.glb' }]]);
  const result = projectRecord(record, map, policy.baseUrl);
  assert.equal(result.source.rawPinned, 'https://example.test/immutable/a.glb');
  assert.equal(result.source.commit, 'old'); assert.equal(result.source.blobSha, 'blob');
  assert.equal(record.source.rawLatest, 'raw');
  const denied = projectRecord(record, new Map(), policy.baseUrl);
  assert.equal(denied.source.rawLatest, null); assert.equal(denied.source.rawPinned, null); assert.equal(denied.publicUrl, null);
});
test('matching path with different blob or unverified pack snapshot cannot certify a pinned URL', () => {
  const record = { path: root + '/a.gltf', source: { repo: policy.sourceRepo, commit: 'old', blobSha: 'old-blob', rawLatest: 'raw', rawPinned: 'raw-old' } };
  for (const file of [{ blob: 'new-blob', verifiedRefs: new Set(['old']), pinnedUrl: 'x' }, { blob: 'old-blob', verifiedRefs: new Set(['new']), pinnedUrl: 'x' }]) {
    const result = projectRecord(record, new Map([[record.path, file]]), policy.baseUrl);
    assert.equal(result.source.rawPinned, null); assert.equal(result.publicUrl, null);
  }
});
test('nested pack/catalog copies receive the same generated transport projection', () => {
  const r = { path: 'private/a.png', source: { repo: policy.sourceRepo, rawLatest: 'raw', rawPinned: 'raw' } };
  const output = projectRecord({ assets: [r] }, new Map(), policy.baseUrl);
  assert.equal(output.assets[0].delivery, 'private-or-unverified');
  assert.equal(output.assets[0].source.rawLatest, null);
});
test('renaming or copying a purchased model outside the asset root cannot publish it', () => {
  const entries = [{ filename: 'media/3D_Assets/KayKit_Mystery_Series6/a.glb', blob: 'paid' }, { filename: 'travel/assets/innocent-name.glb', blob: 'paid' }, { filename: 'tools/actor/FB_TEMPLATE_LOOK_v5.glb', blob: 'derived' }, { filename: root + '/free.glb', blob: 'free' }];
  const denied = restrictedCopies(entries, policy);
  assert.ok(denied.includes('travel/assets/innocent-name.glb'));
  assert.ok(denied.includes('tools/actor/FB_TEMPLATE_LOOK_v5.glb'));
  assert.ok(!denied.includes(root + '/free.glb'));
});
