import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFile, writeFile, readdir, mkdir, copyFile, lstat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync, gunzipSync } from 'node:zlib';

const mediaExtensions = new Set(['.glb', '.gltf', '.bin', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.wav', '.ogg', '.mp3']);
const textExtensions = new Set(['.html', '.js', '.mjs', '.json', '.jsonl', '.css']);
const hash = (data, algorithm = 'sha256') => createHash(algorithm).update(data).digest('hex');
const encode = value => value.split('/').map(encodeURIComponent).join('/');
const git = (root, ...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim();
const within = (value, root) => value === root || value.startsWith(root + '/');

export function restrictedCopies(entries, policy) {
  const restricted = new Set(entries.filter(e => (e.filename.startsWith('media/3D_Assets/') || e.filename.startsWith('media/2D_Assets/')) && mediaExtensions.has(path.extname(e.filename).toLowerCase()) && !publicPack(policy, e.filename)).map(e => e.blob));
  return entries.filter(e => mediaExtensions.has(path.extname(e.filename).toLowerCase()) && !publicPack(policy, e.filename) && (restricted.has(e.blob) || (/\.glb$/i.test(e.filename) && /frizzlebob|fb_template/i.test(e.filename)))).map(e => e.filename);
}

export async function restrictedPublicCopies(repoRoot) {
  const policy = JSON.parse(await readFile(path.join(repoRoot, '.github/public-delivery/policy.json'), 'utf8'));
  const entries = git(repoRoot, 'ls-tree', '-r', '-z', 'HEAD').split('\0').filter(Boolean).map(line => {
    const [meta, filename] = line.split('\t'); return { filename, blob: meta.split(' ')[2] };
  });
  return restrictedCopies(entries, policy);
}

export function publicPack(policy, relative) {
  // Default deny, even when an unlisted pack contains a CC0 licence file.
  if (relative.split('/').some(p => !p || p === '..' || p === '.')) return null;
  if (policy.neverPublicRoots.some(root => within(relative, root))) return null;
  return policy.allowedPacks.find(pack => within(relative, pack.root)) || null;
}

export function rewriteMainUrls(text, baseUrl, pinnedRefs = []) {
  const prefixes = [
    'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/',
    'https://raw.githubusercontent.com/georg-doc/kayfabizarro/refs/heads/main/',
    'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/',
    'https://georg-doc.github.io/kayfabizarro/',
  ];
  for (const prefix of prefixes) {
    text = text.replaceAll(prefix, baseUrl + '/');
    text = text.replaceAll(prefix.replaceAll('/', '\\u002F'), (baseUrl + '/').replaceAll('/', '\\u002F'));
  }
  for (const ref of pinnedRefs) {
    for (const prefix of ['https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + ref + '/media/3D_Assets/', 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@' + ref + '/media/3D_Assets/']) {
      text = text.replaceAll(prefix, baseUrl + '/public-assets/refs/' + ref + '/media/3D_Assets/');
    }
  }
  return text;
}

export function rewriteBundledUrls(html, baseUrl, pinnedRefs = []) {
  // Reader exports carry executable modules inside gzip+base64, beyond grep.
  return html.replace(/(<script type="__bundler\/manifest">\s*)([\s\S]*?)(\s*<\/script>)/g, (all, open, json, close) => {
    const manifest = JSON.parse(json); let changed = false;
    for (const entry of Object.values(manifest)) {
      if (!/^(text\/|application\/(?:javascript|json))/.test(entry.mime)) continue;
      const binary = Buffer.from(entry.data, 'base64');
      const before = (entry.compressed ? gunzipSync(binary) : binary).toString('utf8');
      const after = rewriteMainUrls(before, baseUrl, pinnedRefs);
      if (after !== before) {
        const bytes = Buffer.from(after);
        entry.data = (entry.compressed ? gzipSync(bytes) : bytes).toString('base64');
        changed = true;
      }
    }
    return changed ? open + JSON.stringify(manifest) + close : all;
  });
}

export function projectRecord(value, admitted, baseUrl) {
  if (Array.isArray(value)) return value.map(item => projectRecord(item, admitted, baseUrl));
  if (!value || typeof value !== 'object') return value;
  const result = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, projectRecord(item, admitted, baseUrl)]));
  if (value.source?.repo === 'georg-doc/kayfabizarro' && typeof value.path === 'string' && ('rawLatest' in value.source || 'rawPinned' in value.source)) {
    const file = admitted.get(value.path);
    const exact = file && file.blob === value.source.blobSha;
    // A transport URL may change; a pinned object may never silently become main.
    const pinned = exact && file.verifiedRefs.has(value.source.commit) ? file.pinnedUrl : null;
    result.source.rawLatest = file ? baseUrl + '/' + encode(value.path) : null;
    result.source.rawPinned = pinned;
    result.publicUrl = pinned;
    result.delivery = file ? (pinned ? 'public-verified' : 'public-latest-only') : 'private-or-unverified';
  }
  return result;
}

async function* walk(root, prefix = '') {
  for (const entry of (await readdir(root, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const rel = prefix ? prefix + '/' + entry.name : entry.name;
    if (entry.isSymbolicLink()) throw new Error('Public projection refuses symlink: ' + rel);
    if (entry.isDirectory()) yield* walk(path.join(root, entry.name), rel);
    else if (entry.isFile()) yield rel;
  }
}

function treeFor(root, ref, packRoot) {
  const text = git(root, 'ls-tree', '-r', '-z', ref, '--', packRoot);
  return text.split('\0').filter(Boolean).map(line => {
    const [meta, filename] = line.split('\t');
    const [mode, type, blob] = meta.split(' ');
    return { mode, type, blob, filename };
  }).filter(e => e.type === 'blob' && (mediaExtensions.has(path.extname(e.filename).toLowerCase()) || /licen[cs]e\.txt$/i.test(e.filename)));
}

export async function projectPublicDelivery(repoRoot, outputRoot, { maxAssetBytes = 25 * 1024 * 1024, excludedRestrictedCopies = [] } = {}) {
  const policy = JSON.parse(await readFile(path.join(repoRoot, '.github/public-delivery/policy.json'), 'utf8'));
  const head = git(repoRoot, 'rev-parse', 'HEAD');
  const admitted = new Map(), packs = [], unavailableRefs = new Set();
  for (const ref of policy.pinnedRefs) {
    try { git(repoRoot, 'rev-parse', '--verify', ref + '^{commit}'); }
    catch { unavailableRefs.add(ref); }
  }
  for (const pack of policy.allowedPacks) {
    if (!publicPack(policy, pack.root)) throw new Error('Allow/deny conflict: ' + pack.root);
    const license = await readFile(path.join(repoRoot, pack.licensePath));
    if (hash(license) !== pack.licenseSha256 || !license.toString().includes('CC0')) throw new Error('Licence changed: ' + pack.licensePath);
    const sourceTree = treeFor(repoRoot, head, pack.root);
    if (!sourceTree.length || sourceTree.some(e => e.mode !== '100644' && e.mode !== '100755')) throw new Error('Invalid pack tree: ' + pack.root);
    const identity = hash(JSON.stringify(sourceTree.map(e => [e.filename, e.blob]).sort()));
    if (identity !== pack.inventorySha256) throw new Error('Public pack inventory changed; review required: ' + pack.root);
    const verifiedRefs = new Set([head]);
    for (const ref of policy.pinnedRefs) {
      if (unavailableRefs.has(ref)) continue;
      if (JSON.stringify(treeFor(repoRoot, ref, pack.root).map(e => [e.filename, e.blob]).sort()) === JSON.stringify(sourceTree.map(e => [e.filename, e.blob]).sort())) verifiedRefs.add(ref);
    }
    const published = [];
    for (const entry of sourceTree) {
      if (!publicPack(policy, entry.filename)) throw new Error('Pack scope escaped');
      const source = path.join(repoRoot, entry.filename);
      const facts = await lstat(source);
      if (!facts.isFile() || facts.isSymbolicLink() || facts.size > maxAssetBytes) throw new Error('Public asset unavailable or too large: ' + entry.filename);
      const data = await readFile(source);
      if (hash(Buffer.concat([Buffer.from('blob ' + data.length + '\0'), data]), 'sha1') !== entry.blob) throw new Error('Uncommitted asset bytes: ' + entry.filename);
      const suffix = entry.filename.slice(pack.root.length + 1);
      const pinnedPath = 'public-assets/packs/' + identity + '/' + suffix;
      for (const destination of [entry.filename, pinnedPath]) {
        await mkdir(path.dirname(path.join(outputRoot, destination)), { recursive: true });
        await copyFile(source, path.join(outputRoot, destination));
      }
      const record = { path: entry.filename, bytes: data.length, sha256: hash(data), blob: entry.blob, license: pack.license, licensePath: pack.licensePath, pinnedPath };
      published.push(record);
      admitted.set(entry.filename, { ...record, pinnedUrl: policy.baseUrl + '/' + encode(pinnedPath), verifiedRefs });
    }
    packs.push({ root: pack.root, identity, license: pack.license, licensePath: pack.licensePath, licenseSha256: pack.licenseSha256, verifiedRefs: [...verifiedRefs].sort(), files: published });
  }

  // Registry transport projection is generated; source registry files stay untouched.
  for await (const rel of walk(outputRoot)) {
    const ext = path.extname(rel).toLowerCase();
    if (!textExtensions.has(ext) || rel.startsWith('public-assets/') || rel.startsWith('media/3D_Assets/')) continue;
    const file = path.join(outputRoot, rel);
    const before = await readFile(file, 'utf8');
    let after;
    if (rel.startsWith('registry/') && (ext === '.json' || ext === '.jsonl')) {
      const transform = data => projectRecord(data, admitted, policy.baseUrl);
      after = ext === '.jsonl' ? before.split(/\r?\n/).filter(Boolean).map(line => JSON.stringify(transform(JSON.parse(line)))).join('\n') + '\n' : JSON.stringify(transform(JSON.parse(before)), null, 2) + '\n';
    } else {
      const refs = policy.pinnedRefs.filter(ref => !unavailableRefs.has(ref));
      after = rewriteBundledUrls(rewriteMainUrls(before, policy.baseUrl, refs), policy.baseUrl, refs);
    }
    if (after !== before) await writeFile(file, after);
  }
  const report = { schema: 'kfb.public-delivery-report/1', sourceCommit: head, readyForPrivateSwitch: false, publicFiles: admitted.size, publicBytes: [...admitted.values()].reduce((n, f) => n + f.bytes, 0), unavailablePinnedRefs: [...unavailableRefs].sort(), excludedRestrictedCopies, packs };
  await mkdir(path.join(outputRoot, 'public-assets'), { recursive: true });
  // Alias only a complete pack whose Git tree was verified byte-identical.
  // Never redirect arbitrary refs or purchased paths to current main.
  const redirects = packs.flatMap(pack => pack.verifiedRefs.map(ref => '/public-assets/refs/' + ref + '/' + encode(pack.root) + '/* /public-assets/packs/' + pack.identity + '/:splat 200'));
  const redirectFile = path.join(outputRoot, '_redirects');
  const existingRedirects = await readFile(redirectFile, 'utf8').catch(error => error.code === 'ENOENT' ? '' : Promise.reject(error));
  await writeFile(redirectFile, redirects.join('\n') + '\n' + existingRedirects);
  await writeFile(path.join(outputRoot, 'public-assets/manifest.json'), JSON.stringify(report, null, 2) + '\n');
  return report;
}
