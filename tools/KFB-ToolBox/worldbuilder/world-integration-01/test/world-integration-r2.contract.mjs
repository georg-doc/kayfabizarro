import fs from 'node:fs';
import { auditLocomotionRows, SOURCE_BACKED_STATES, VARIANT_ROWS } from '../wi1-locomotion-contract.mjs';

let pass = 0;
const ok = (name, cond) => { if (!cond) throw new Error('FAIL ' + name); pass++; console.log('ok ' + pass + ' - ' + name); };
const sourceClip = (state) => state.replaceAll('.', '_') + '_source';
const rows = SOURCE_BACKED_STATES.map((state) => ({ state, sourceClip: sourceClip(state), variant: null }));
for (const [state, spec] of Object.entries(VARIANT_ROWS)) rows.push({ state, sourceClip: sourceClip(spec.sourceState), variant: 'label text deliberately ignored by the contract' });

const good = auditLocomotionRows(rows);
ok('valid current vocabulary passes', good.ok);
ok('all thirteen source roles are explicit', good.counts.sourceBacked === 13);
ok('ToolBox owns exactly one playback variant', good.counts.toolboxPlaybackVariants === 1);
ok('World consumer tuning is three concrete rows', good.counts.worldConsumerRows === 3);
ok('contract does not parse variant prose', !good.errors.some((x) => x.includes('label text')));

const withoutWalk = rows.filter((row) => row.state !== 'walk');
ok('missing source role fails', !auditLocomotionRows(withoutWalk).ok);
const wrongSource = rows.map((row) => row.state === 'walk.fast' ? { ...row, sourceClip: 'invented_clip' } : row);
ok('variant must reuse its named source clip', auditLocomotionRows(wrongSource).errors.includes('variant source mismatch: walk.fast → walk'));
const unlabeled = rows.map((row) => row.state === 'backward.fast' ? { ...row, variant: null } : row);
ok('consumer tuning must remain explicitly labelled', auditLocomotionRows(unlabeled).errors.includes('variant not explicitly labelled: backward.fast'));
const invented = rows.concat({ state: 'fly.fast', sourceClip: 'fly', variant: 'invented' });
ok('unexpected local variant fails closed', auditLocomotionRows(invented).errors.includes('unexpected variant state: fly.fast'));

const surface = JSON.parse(fs.readFileSync(new URL('../contracts/world-surface-adapter.v1.json', import.meta.url), 'utf8'));
ok('one Surface Adapter contract is named', surface.schema === 'kfb.world-surface-adapter/1');
ok('WorldBuilder remains editable base-height owner', surface.owners.baseHeight === 'WorldBuilder');
ok('Race remains contact and vehicle-physics owner', surface.owners.contactPhysics === 'Race');
ok('consumers may not recompose final height', surface.rules.consumerHeightRecomposition === 'forbidden');

console.log('WORLD R2 CONTRACT PASS ' + pass + '/' + pass);
