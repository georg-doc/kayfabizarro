#!/usr/bin/env python3
"""Read-only WSA → WS0 intake planning. No import, crop, IDs or publication."""
import argparse
import hashlib
import json
from collections import defaultdict
from pathlib import Path


def digest(path):
    result = hashlib.sha256()
    with path.open('rb') as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b''):
            result.update(chunk)
    return result.hexdigest()


def build_plan(source_root, overlay=None, metadata_only=False):
    root = Path(source_root).resolve()
    def contained(relative):
        if not isinstance(relative, str) or not relative:
            raise ValueError('missing source path')
        path = (root / relative).resolve()
        if not path.is_relative_to(root):
            raise ValueError('missing or outside source root: ' + relative)
        return path
    def existing(relative):
        path = contained(relative)
        if not path.is_file():
            raise ValueError('missing or outside source root: ' + relative)
        return path
    def read(relative):
        return json.loads(existing(relative).read_text(encoding='utf-8'))
    def ref(relative):
        return {'path': relative, 'sha256': digest(existing(relative))}
    index = read('SET_MANIFESTS_R1.json')
    plan = {'schema': 'kfb.wsa-ws0-handoff-plan/1', 'kind': 'DERIVED_PLAN_NOT_REGISTRY',
            'source_index': ref('SET_MANIFESTS_R1.json'), 'source_owner': index.get('source_owner'),
            'excluded_sources': index.get('excluded_sources', []), 'sets': [], 'metadata_only': metadata_only,
            'warnings': ['Canonical mapping and catalog-master readiness require receiving-owner verification.',
                         'Image PASS does not approve DESIGN prose, runtime use, or publication.'],
            'next_owner_action': 'WS0/Asset Librarian verifies canonical mappings and imports eligible sources using existing intake owners; game ingestion follows owner acceptance.'}
    entries = index.get('sets', []) + index.get('candidate_sets', [])
    all_figures = {}
    state_groups = defaultdict(list)
    loaded = []
    seen_sets = set()
    for entry in entries:
        item = {'set_id': entry.get('set_id'), 'image_status': entry.get('georg_status'),
                'selected': False, 'readiness': 'EXCLUDED', 'errors': [], 'warnings': [],
                'source_files': [], 'verified_images': [], 'depictions': [], 'missing_media': [], 'missing_evidence': []}
        plan['sets'].append(item)
        if item['set_id'] in seen_sets:
            item['errors'].append('duplicate set_id in index')
        seen_sets.add(item['set_id'])
        if entry.get('georg_status') != 'PASS' or entry.get('intake_eligible') is not True:
            item['exclusion'] = 'Index requires georg_status PASS and intake_eligible true.'
            continue
        try:
            manifest_path = entry['manifest']
            manifest = read(manifest_path)
            item['source_files'].append(ref(manifest_path))
            item['image_status'] = manifest.get('georg_status')
            if manifest.get('set_id') != entry.get('set_id'):
                raise ValueError('index/manifest set_id mismatch')
            if manifest.get('georg_status') != 'PASS' or manifest.get('intake', {}).get('eligible') is not True:
                raise ValueError('index/manifest acceptance mismatch; manifest requires PASS + intake.eligible true')
            # Explicit exclusion path prefixes and set IDs remain binding, even for PASS.
            for excluded in plan['excluded_sources']:
                prefix = excluded.get('path')
                if excluded.get('intake_eligible') is False and (excluded.get('set_id') == entry['set_id'] or
                    (prefix and (manifest_path == prefix or manifest_path.startswith(prefix.rstrip('/') + '/')))):
                    raise ValueError('explicit source exclusion')
            item['selected'] = True
            figures = manifest.get('figuren', [])
            if not figures:
                raise ValueError('empty depiction roster')
            cards_path = manifest['cards']
            cards = read(cards_path)
            item['source_files'].append(ref(cards_path))
            item['design_text_status'] = cards.get('status')
            item['design_text_policy'] = 'Preserve every source field status; no DESIGN → GEORG conversion.'
            ids = [f['id'] for f in figures]
            card_ids = [c['id'] for c in cards.get('cards', cards.get('figuren', []))]
            if len(set(card_ids)) != len(card_ids) or set(ids) != set(card_ids):
                item['errors'].append('card/depiction ID roster mismatch')
            prompt_paths = {manifest['production_record']} | {f['prompt_quelle'] for f in figures}
            for prompt_path in sorted(prompt_paths):
                if metadata_only and not contained(prompt_path).is_file():
                    item['missing_evidence'].append(prompt_path)
                    continue
                record = read(prompt_path)
                def contains_prompt(value):
                    if isinstance(value, dict):
                        return any((k == 'prompt' and isinstance(v, str) and bool(v.strip())) or contains_prompt(v) for k, v in value.items())
                    if isinstance(value, list):
                        return any(contains_prompt(v) for v in value)
                    return False
                if not contains_prompt(record):
                    item['errors'].append('prompt evidence lacks a nonempty prompt: ' + prompt_path)
                item['source_files'].append(ref(prompt_path))
            image = manifest['image']
            image_path = image['datei']
            if metadata_only and not contained(image_path).is_file():
                item['missing_media'].append(image_path)
                actual_hash = None
            else:
                actual_hash = digest(existing(image_path))
            if actual_hash is None:
                pass
            elif actual_hash != image.get('sha256'):
                item['errors'].append('image SHA256 mismatch: ' + image_path)
            else:
                image_ref = {'path': image_path, 'sha256': actual_hash}
                try:
                    from PIL import Image
                    with Image.open(existing(image_path)) as png:
                        image_ref['dimensions'] = list(png.size)
                        image_ref['alpha_bounds'] = list(png.getchannel('A').getbbox() or []) if 'A' in png.getbands() else None
                except ImportError:
                    item['warnings'].append('Pillow unavailable; dimensions and alpha bounds unmeasured.')
                except (OSError, ValueError) as exc:
                    item['errors'].append('image cannot be decoded: ' + str(exc))
                item['verified_images'].append(image_ref)
            grid = manifest['grid']
            cells = set()
            for figure in figures:
                fid = figure['id']
                if fid in all_figures:
                    item['errors'].append('duplicate depiction ID: ' + fid)
                    all_figures[fid][1]['errors'].append('duplicate depiction ID: ' + fid)
                else:
                    all_figures[fid] = (figure, item)
                picture = figure['bild']
                cell = picture['zelle']
                if picture['datei'] != image_path:
                    item['errors'].append('depiction references image outside closed manifest hash list: ' + fid)
                if (type(cell) is not int or type(picture.get('cell_base')) is not int or
                    picture.get('cell_base') != grid.get('index_base') or not isinstance(grid.get('columns'), int) or
                    not isinstance(grid.get('rows'), int) or grid['columns'] <= 0 or grid['rows'] <= 0):
                    item['errors'].append('invalid grid/cell metadata: ' + fid)
                else:
                    n = cell - grid['index_base']
                    if not 0 <= n < grid['columns'] * grid['rows'] or n in cells or picture.get('row') != n // grid['columns'] or picture.get('column') != n % grid['columns']:
                        item['errors'].append('invalid/duplicate cell: ' + fid)
                    cells.add(n)
                identity = figure.get('zustand_von') or fid
                state_groups[identity].append((figure, item))
                item['depictions'].append({'source_id': fid, 'identity_source_key': identity,
                    'id_scope': figure.get('id_scope'), 'cell': picture,
                    'relations': {k: figure.get(k) for k in ('paar_mit', 'zustand_von', 'trio', 'trio_mit')},
                    'image_status': figure.get('georg_status'), 'text_source': cards_path})
            loaded.append((manifest, item))
        except (ValueError, KeyError, TypeError, OSError) as exc:
            item['errors'].append(str(exc))
    for fid, (figure, item) in all_figures.items():
        pair = figure.get('paar_mit')
        if pair and (pair == fid or pair not in all_figures or all_figures[pair][0].get('paar_mit') != fid):
            item['errors'].append('broken reciprocal pair: ' + fid)
        trio, peers = figure.get('trio'), figure.get('trio_mit')
        if trio or peers:
            members = {k for k, (f, _) in all_figures.items() if f.get('trio') == trio}
            if not trio or not isinstance(peers, list) or len(peers) != 2 or len(set(peers)) != 2 or set(peers) != members - {fid} or len(members) != 3:
                item['errors'].append('broken explicit trio: ' + fid)
    for identity, members in state_groups.items():
        states = [f.get('zustand') for f, _ in members]
        is_state_group = any(f.get('zustand_von') for f, _ in members)
        if is_state_group and (len(members) < 2 or None in states or len(set(states)) != len(states) or
                               any(f.get('zustand_von') != identity for f, _ in members)):
            for _, item in members:
                item['errors'].append('incomplete/ambiguous state identity group: ' + identity)
    for manifest, item in loaded:
        item['counts'] = {'depictions': len(item['depictions']), 'identities': len({f['identity_source_key'] for f in item['depictions']})}
        for key, count in item['counts'].items():
            if key in manifest.get('counts', {}) and manifest['counts'][key] != count:
                item['errors'].append('declared ' + key + ' count mismatch')
        if any('authoring' in (f.get('id_scope') or '').lower() for f in manifest['figuren']):
            item['warnings'].append('CANONICAL_MAP_REQUIRED: authoring IDs remain source keys only.')
    if overlay:
        path = Path(overlay).resolve()
        bio = json.loads(path.read_text(encoding='utf-8'))
        if not isinstance(bio, dict):
            raise ValueError('Biography overlay must be a JSON object.')
        if bio.get('schema') == 'kfb.slop-biographies/1':
            records, key = bio.get('records'), 'identity_id'
            if bio.get('status') != 'DESIGN':
                raise ValueError('Biography overlay must retain DESIGN status.')
            if not isinstance(records, list) or any(not isinstance(r, dict) or r.get('lore_status') != 'DESIGN' for r in records):
                raise ValueError('Biography records must retain lore_status DESIGN.')
        elif 'schema' not in bio and 'cards' in bio:
            records, key = bio['cards'], 'id'
            if not isinstance(records, list) or any(not isinstance(r, dict) or r.get('status') != 'DESIGN' for r in records):
                raise ValueError('Legacy biography cards must retain status DESIGN.')
        else:
            raise ValueError('Unsupported biography overlay schema; expected kfb.slop-biographies/1 records/identity_id or explicit legacy cards/id.')
        if not records:
            raise ValueError('Biography overlay cannot silently validate an empty record roster.')
        keys = [r.get(key) for r in records]
        if any(not isinstance(k, str) or not k.strip() for k in keys) or len(set(keys)) != len(keys):
            raise ValueError('Biography overlay requires unique nonempty source keys.')
        # Source names/IDs/relations and all statuses remain untouched: no record content is merged.
        unknown = [k for k in keys if k not in all_figures and k not in state_groups]
        plan['biography_overlay'] = {'path': str(path), 'sha256': digest(path), 'schema': bio.get('schema', 'legacy-cards/id'),
            'record_count': len(records), 'matched_source_key_count': len(keys) - len(unknown), 'source_head_claim': bio.get('source_head'),
            'policy': 'SEPARATE_DESIGN_OVERLAY; never merges or changes source names, IDs, relations, field statuses, image PASS or canonical identity.', 'unknown_source_keys': unknown}
        if unknown:
            plan['warnings'].append('Biography overlay has unknown source keys; do not apply those records.')
    for item in plan['sets']:
        if item['errors']:
            item['readiness'] = 'SOURCE_REPAIR_REQUIRED'
        elif item['selected']:
            item['readiness'] = 'METADATA_READY_EVIDENCE_PENDING' if item['missing_media'] or item['missing_evidence'] else 'READY_FOR_RECEIVING_OWNER_MAPPING'
        item['errors'] = sorted(set(item['errors']))
    plan['summary'] = {key: sum(i['readiness'] == key for i in plan['sets']) for key in ('EXCLUDED', 'SOURCE_REPAIR_REQUIRED', 'METADATA_READY_EVIDENCE_PENDING', 'READY_FOR_RECEIVING_OWNER_MAPPING')}
    plan['summary']['selected_depictions'] = sum(len(i['depictions']) for i in plan['sets'] if i['selected'])
    plan['summary']['selected_identities'] = len({f['identity_source_key'] for i in plan['sets'] if i['selected'] for f in i['depictions']})
    return plan


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source_root', type=Path)
    parser.add_argument('--biography-overlay', type=Path)
    parser.add_argument('--metadata-only', action='store_true', help='Report absent media/prompt records separately; never claim image/hash verification for them.')
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    plan = build_plan(args.source_root, args.biography_overlay, args.metadata_only)
    args.output.write_text(json.dumps(plan, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(plan['summary']))
    return 2 if plan['summary']['SOURCE_REPAIR_REQUIRED'] else 0


if __name__ == '__main__':
    raise SystemExit(main())
