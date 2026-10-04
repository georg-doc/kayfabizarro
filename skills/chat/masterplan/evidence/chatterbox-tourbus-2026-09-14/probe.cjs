// Read-only characterization of supplied legacy modules, not browser QA.
// Usage: node probe.cjs <chatter.js> <phrases.js> <identity.js>
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const args = process.argv.slice(2);
if (args.length !== 3) throw new Error('Expected chatter, phrases and identity source paths.');
const sandbox = { console, document: {}, localStorage: {
  data: {}, getItem(k) { return this.data[k] ?? null; },
  setItem(k, v) { this.data[k] = String(v); }
}};
sandbox.window = sandbox;
vm.createContext(sandbox);
const input = args.map(p => {
  const bytes = fs.readFileSync(p);
  vm.runInContext(bytes.toString('utf8'), sandbox, { filename: p });
  return {name: p.split('/').pop(), gitBlob: crypto.createHash('sha1')
    .update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex')};
});
const game = {reputation:{}};
const mob = {unit:{id:'goblin'}, zone:{biome:'camp',card:{t:'KANT_CARD_MARKER',l:'KANT_LORE_MARKER.'}}};
const first = sandbox.OW_CHATTER.line(game, mob, 'spin', () => 0.1);
const firstCounts = {...sandbox.OW_CHATTER.report()};
assert.equal(firstCounts.card, 0);
assert.equal(firstCounts.faction, 1);
sandbox.OW_CHATTER.reset();
const control = sandbox.OW_CHATTER.line(game, mob, 'spin', () => 0.6);
assert.equal(sandbox.OW_CHATTER.report().card, 1);
assert.equal(control, 'KANT_LORE_MARKER.');
const identity = sandbox.OW_IDENT;
identity.pruefe({hunt:3,collected:0,rep:{}});
const before = [...identity.besitz()];
identity.pruefe({hunt:0,collected:3,rep:{}});
assert.ok(identity.besitz().includes('pigsbane'));
assert.equal(identity.pruefe({hunt:0,collected:3,rep:{}}).length,0);
console.log(JSON.stringify({scope:'Node vm, uploaded v10 snapshots only; no browser/game acceptance',
  inputs:input,
  findings:[{id:'card-priority-inversion',status:'REPRODUCED',rng:0.1,actual:first,
    counts:firstCounts,reason:'w=0.99 skips the card branch w<0.68, despite the card-priority comment'},
    {id:'card-positive-control',status:'PASS',rng:0.6,actual:control},
    {id:'identity-additive-trophy-retention',status:'PASS',before,after:[...identity.besitz()]}]
},null,2));
