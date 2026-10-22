import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const blockedHost = /(?:raw\.githubusercontent\.com|(?:rawcdn|raw)\.githack\.com|cdn\.jsdelivr\.net|georg-doc\.github\.io|api\.github\.com\/repos\/georg-doc)/i;
async function* files(root, prefix = '') {
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const rel = prefix ? prefix + '/' + entry.name : entry.name;
    if (entry.isDirectory()) yield* files(path.join(root, entry.name), rel);
    else if (entry.isFile()) yield rel;
  }
}
export async function auditPublicDelivery(root) {
  const findings = [], pages = [];
  for await (const rel of files(root)) {
    if (!/\.(?:html|js|mjs|css|json|jsonl)$/i.test(rel) || rel.startsWith('public-assets/')) continue;
    const text = (await readFile(path.join(root, rel), 'utf8')).replaceAll('\\u002F', '/');
    const matches = [...new Set((text.match(/https?:\/\/[^\s"'<>`\\)]+/g) || []).filter(url => blockedHost.test(url)))].sort();
    if (matches.length) findings.push({ path: rel, urls: matches });
    if (rel.endsWith('.html')) pages.push({ path: rel, sourceScan: matches.length ? 'BLOCKED_HOST_PRESENT' : 'NO_BLOCKED_HOST_IN_ENTRY', browserProof: 'NOT_RUN', status: 'NOT_ACCEPTED' });
  }
  return { schema: 'kfb.private-readiness-audit/1', readyForPrivateSwitch: false, note: 'Source scan is not browser proof. Static imports, dynamic asset requests, runtime semantics and cross-site consumers still require blocked-host tests.', blockedFileCount: findings.length, findings, pages: pages.sort((a, b) => a.path.localeCompare(b.path)) };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = path.resolve(process.argv[2] || '.cloudflare-pages');
  const report = await auditPublicDelivery(root);
  await writeFile(path.join(root, 'public-assets/readiness.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ pages: report.pages.length, blockedFiles: report.blockedFileCount, readyForPrivateSwitch: false }));
  if (process.argv.includes('--strict') && report.blockedFileCount) process.exitCode = 1;
}
