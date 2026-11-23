import copy
import hashlib
import json
import tempfile
import unittest
from pathlib import Path

from wsa_intake_plan import build_plan


class IntakeTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        # Real tiny transparent PNG; no generated assets or production edits.
        import struct
        import zlib
        def chunk(kind, data):
            return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data))
        self.png = (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', 1, 1, 8, 6, 0, 0, 0))
                    + chunk(b'IDAT', zlib.compress(b'\0\0\0\0\0')) + chunk(b'IEND', b''))
        (self.root / 'image.png').write_bytes(self.png)
        self.index = {'sets': [{'set_id': 'S', 'manifest': 'MANIFEST.json', 'georg_status': 'PASS', 'intake_eligible': True}]}
        self.manifest = {'set_id': 'S', 'georg_status': 'PASS', 'intake': {'eligible': True},
            'image': {'datei': 'image.png', 'sha256': hashlib.sha256(self.png).hexdigest()},
            'cards': 'SLOP_CARDS_DESIGN.json', 'production_record': 'PRODUCTION_RECORD.json',
            'grid': {'columns': 2, 'rows': 1, 'index_base': 0},
            'figuren': [self.figure('A', 0), self.figure('B', 1)]}
        self.write('PRODUCTION_RECORD.json', {'args': {'prompt': 'Preserved prompt'}})

    def tearDown(self):
        self.temp.cleanup()

    def figure(self, key, cell):
        return {'id': key, 'id_scope': 'WSA_AUTHORING_ONLY', 'prompt_quelle': 'PRODUCTION_RECORD.json',
                'bild': {'datei': 'image.png', 'zelle': cell, 'cell_base': 0, 'row': 0, 'column': cell},
                'zustand': 'neutral', 'zustand_von': None, 'paar_mit': None}

    def write(self, name, value):
        (self.root / name).write_text(json.dumps(value))

    def plan(self):
        self.write('SET_MANIFESTS_R1.json', self.index)
        self.write('MANIFEST.json', self.manifest)
        self.write('SLOP_CARDS_DESIGN.json', {'status': 'DESIGN', 'cards': [{'id': f['id'], 'status': 'DESIGN'} for f in self.manifest['figuren']]})
        return build_plan(self.root)

    def test_pass_stays_pass_while_mapping_pending(self):
        item = self.plan()['sets'][0]
        self.assertEqual(item['readiness'], 'READY_FOR_RECEIVING_OWNER_MAPPING')
        self.assertEqual(item['image_status'], 'PASS')
        self.assertEqual(item['design_text_status'], 'DESIGN')

    def test_excluded_pass_is_not_selected(self):
        self.index['sets'][0]['intake_eligible'] = False
        item = self.plan()['sets'][0]
        self.assertFalse(item['selected'])
        self.assertEqual(item['readiness'], 'EXCLUDED')
        self.assertEqual(item['image_status'], 'PASS')

    def test_state_identity_is_not_two_actors(self):
        for i, f in enumerate(self.manifest['figuren']):
            f['zustand_von'] = 'SOURCE_IDENTITY'
            f['zustand'] = ['afraid', 'angry'][i]
        item = self.plan()['sets'][0]
        self.assertEqual(item['counts'], {'depictions': 2, 'identities': 1})
        self.assertEqual(item['errors'], [])

    def test_dangling_state_group_is_blocked(self):
        self.manifest['figuren'][0]['zustand_von'] = 'lost_identity'
        self.assertIn('state identity group', ' '.join(self.plan()['sets'][0]['errors']))

    def test_nonreciprocal_pair_is_blocked(self):
        self.manifest['figuren'][0]['paar_mit'] = 'B'
        self.assertIn('broken reciprocal pair', ' '.join(self.plan()['sets'][0]['errors']))

    def test_invalid_trio_is_blocked(self):
        for f in self.manifest['figuren']:
            f['trio'] = 'T'
            f['trio_mit'] = ['A', 'MISSING']
        self.assertIn('broken explicit trio', ' '.join(self.plan()['sets'][0]['errors']))

    def test_hash_mismatch_has_no_verified_image(self):
        self.manifest['image']['sha256'] = '0' * 64
        item = self.plan()['sets'][0]
        self.assertEqual(item['image_status'], 'PASS')
        self.assertEqual(item['verified_images'], [])
        self.assertEqual(item['readiness'], 'SOURCE_REPAIR_REQUIRED')

    def test_unlisted_image_is_blocked(self):
        self.manifest['figuren'][0]['bild']['datei'] = 'not-in-hash-list.png'
        self.assertIn('closed manifest hash list', ' '.join(self.plan()['sets'][0]['errors']))

    def test_path_escape_is_blocked(self):
        self.manifest['production_record'] = '../outside.json'
        self.assertIn('outside source root', ' '.join(self.plan()['sets'][0]['errors']))

    def test_boolean_eligibility_is_strict(self):
        self.manifest['intake']['eligible'] = 'true'
        self.assertFalse(self.plan()['sets'][0]['selected'])

    def test_missing_prompt_is_blocked(self):
        self.write('PRODUCTION_RECORD.json', {'prompt': ''})
        self.assertIn('lacks a nonempty prompt', ' '.join(self.plan()['sets'][0]['errors']))

    def test_duplicate_cells_are_blocked(self):
        self.manifest['figuren'][1]['bild'] = copy.deepcopy(self.manifest['figuren'][0]['bild'])
        self.assertIn('duplicate cell', ' '.join(self.plan()['sets'][0]['errors']))

    def test_biography_overlay_preserves_design(self):
        self.plan()
        self.write('bio.json', {'cards': [{'id': 'A', 'status': 'DESIGN', 'backstory': 'Proposal'}]})
        result = build_plan(self.root, self.root / 'bio.json')
        self.assertEqual(result['sets'][0]['design_text_status'], 'DESIGN')
        self.assertEqual(result['biography_overlay']['unknown_source_keys'], [])

    def test_metadata_only_separates_missing_media_from_acceptance(self):
        self.plan()
        (self.root / 'image.png').unlink()
        (self.root / 'PRODUCTION_RECORD.json').unlink()
        item = build_plan(self.root, metadata_only=True)['sets'][0]
        self.assertTrue(item['selected'])
        self.assertEqual(item['image_status'], 'PASS')
        self.assertEqual(item['readiness'], 'METADATA_READY_EVIDENCE_PENDING')
        self.assertEqual(item['verified_images'], [])
        self.assertEqual(item['missing_media'], ['image.png'])
        self.assertEqual(item['missing_evidence'], ['PRODUCTION_RECORD.json'])

    def test_metadata_only_still_rejects_path_escape(self):
        self.manifest['image']['datei'] = '../not-present.png'
        self.plan()
        item = build_plan(self.root, metadata_only=True)['sets'][0]
        self.assertIn('outside source root', ' '.join(item['errors']))

    def test_valid_pair_passes(self):
        self.manifest['figuren'][0]['paar_mit'] = 'B'
        self.manifest['figuren'][1]['paar_mit'] = 'A'
        self.assertEqual(self.plan()['sets'][0]['errors'], [])

    def test_valid_trio_passes(self):
        self.manifest['grid']['columns'] = 3
        self.manifest['figuren'].append(self.figure('C', 2))
        for f in self.manifest['figuren']:
            f['trio'] = 'SOURCE_TRIO'
            f['trio_mit'] = [k for k in ['A', 'B', 'C'] if k != f['id']]
        self.assertEqual(self.plan()['sets'][0]['errors'], [])

    def test_legacy_figuren_cards_supported(self):
        self.plan()
        self.write('SLOP_CARDS_DESIGN.json', {'status': 'DESIGN', 'figuren': [{'id': 'A'}, {'id': 'B'}]})
        self.assertEqual(build_plan(self.root)['sets'][0]['errors'], [])

    def test_author_records_overlay_is_explicitly_counted(self):
        self.plan()
        self.write('bio.json', {'schema': 'kfb.slop-biographies/1', 'status': 'DESIGN',
                   'records': [{'identity_id': 'A', 'lore_status': 'DESIGN', 'name': 'Untrusted new name'},
                               {'identity_id': 'UNKNOWN', 'lore_status': 'DESIGN'}]})
        result = build_plan(self.root, self.root / 'bio.json')
        self.assertEqual(result['biography_overlay']['record_count'], 2)
        self.assertEqual(result['biography_overlay']['matched_source_key_count'], 1)
        self.assertEqual(result['biography_overlay']['unknown_source_keys'], ['UNKNOWN'])
        self.assertEqual(result['sets'][0]['depictions'][0]['source_id'], 'A')
        self.assertEqual(result['sets'][0]['design_text_status'], 'DESIGN')

    def test_unknown_overlay_schema_rejected(self):
        self.plan()
        self.write('bio.json', {'schema': 'unknown/1', 'records': [{'identity_id': 'A'}]})
        with self.assertRaisesRegex(ValueError, 'Unsupported biography overlay schema'):
            build_plan(self.root, self.root / 'bio.json')

    def test_empty_overlay_rejected(self):
        self.plan()
        self.write('bio.json', {'cards': []})
        with self.assertRaisesRegex(ValueError, 'empty record roster'):
            build_plan(self.root, self.root / 'bio.json')

    def test_overlay_duplicate_identity_rejected(self):
        self.plan()
        self.write('bio.json', {'schema': 'kfb.slop-biographies/1', 'status': 'DESIGN',
                   'records': [{'identity_id': 'A', 'lore_status': 'DESIGN'}] * 2})
        with self.assertRaisesRegex(ValueError, 'unique nonempty source keys'):
            build_plan(self.root, self.root / 'bio.json')

    def test_overlay_georg_promotion_rejected(self):
        self.plan()
        self.write('bio.json', {'schema': 'kfb.slop-biographies/1', 'status': 'DESIGN',
                   'records': [{'identity_id': 'A', 'lore_status': 'GEORG'}]})
        with self.assertRaisesRegex(ValueError, 'lore_status DESIGN'):
            build_plan(self.root, self.root / 'bio.json')


if __name__ == '__main__':
    unittest.main()
