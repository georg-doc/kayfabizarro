import { readFile, writeFile } from 'node:fs/promises';
import { rewriteBundledUrls } from './public-delivery.mjs';
const files = ['media/kfb/index.html', 'KFB Comic Card Deck Viewer v4 (WS0)/exports/KFB Deck Viewer v4 standalone.html'];
for (const file of files) {
  const before = await readFile(file, 'utf8');
  const after = rewriteBundledUrls(before, 'https://kayfabizarro.pages.dev');
  if (after !== before) await writeFile(file, after);
  console.log(file + ': ' + (before === after ? 'unchanged' : 'embedded module URLs rebuilt'));
}
