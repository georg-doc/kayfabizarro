# Gate-Selbsttest: eine regelkonforme Szene aus nest() muss PASS sein, die Fehlerklassen vom 19.10. müssen FAIL sein.
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'lib'))
from kfb_env import gate, nest_ok, rule_report, contact

CONCEPT = {'story': 'Alte Hofstelle am Hang', 'image_idea': 'Scheune als Anker, Fluff wächst aus den Fugen', 'focal': 'barn',
           'palette_roles': {'ground': '#b89a6a', 'stone': '#c09b72'}, 'material_codes': ['Kalkstein', 'Moos', 'Holz'], 'story_beat': 'Ernte',
           'space': 'Scheune Mitte, Hang hinten, vorn frei', 'one_sentence': 'Diese Szene zeigt die Ernte, weil der Herbst kommt, und der Spieler soll zuerst die Scheune sehen.', 'color_script': 'warm, Akzent nur am Scheunentor', 'form_dna': 'runde Hügel, weiche Keile; verboten Prismen', 'life_anchor': 'Gras-Wind-Gruppen', 'biography': {'1': 'Kalksockel', '2': 'Hof', '3': 'Mauerbröckel', '4': 'Moos, Büsche'}}


def good():
    objs = [{'id': 'barn', 'kind': 'building', 'role': 'bark', 'layer': 2, 'story': 'Bauer baute sie aus Hangholz', 'group': 'g0', 'c': [0, 0], 'r': 2.0,
             'h': 4.0, 'bottom_z': -0.2, 'ground_z': 0.0, 'signature': 'hero', 'asset': 'barn', 'kit': 'kfb', 'material': 'kfb-clay.v1.1/env'}]
    for gi, (p, kind, layer, R) in enumerate([((6, 2), 'rock', 3, 0.7), ((-5, 4), 'bush', 4, 0.5), ((3, -6), 'prop', 2, 0.4)]):
        for i, it in enumerate(nest_ok(p, 5, R, seed=10 + gi, hang=0.4)):
            h = it['r'] * 1.4; lo = {'rock': 0.45, 'bush': 0.08, 'prop': 0.03}[kind]
            objs.append({'id': f'{kind}{i}', 'kind': kind, 'role': {'rock': 'stone', 'bush': 'leaf', 'prop': 'prop'}[kind], 'layer': layer,
                         'story': 'Ursache im Biom-Blatt', 'group': f'g{gi + 1}', 'c': it['c'], 'r': it['r'], 'h': h, 'bottom_z': -lo * h, 'ground_z': 0.0,
                         'signature': 'echo' if (i == 0 and gi < 2) else None, 'asset': f'{kind}_{i}', 'kit': 'kaykit', 'material': 'kfb-clay.v1.1/env', 'asset_pass': f'{kind}.asset_pass.json'})
    objs.append({'id': 'moss', 'kind': 'grass', 'role': 'grass', 'layer': 1, 'story': 'Fels-Sockel, Moos in den Fugen', 'group': 'g0', 'c': [3.4, 0.9], 'r': 0.3,
                 'h': 0.2, 'bottom_z': -0.2, 'ground_z': 0.0, 'asset': 'moss', 'kit': 'kfb', 'material': 'kfb-clay.v1.1/env'})
    objs.append({'id': 'moss2', 'kind': 'grass', 'role': 'grass', 'layer': 1, 'story': 'Moos', 'group': 'g0', 'c': [-1.5, 5.8], 'r': 0.25,
                 'h': 0.15, 'bottom_z': -0.15, 'ground_z': 0.0, 'asset': 'moss_b', 'kit': 'kfb', 'material': 'kfb-clay.v1.1/env'})
    for o in [x for x in objs if x['kind'] in ('building', 'rock', 'prop')]:
        objs += [dict(c, bottom_z=-0.3 * c['h'], ground_z=0.0) for c in contact(o, 3, seed=len(objs))]
    return {'id': 'good', 'kind': 'diorama', 'concept': CONCEPT, 'landmark': 'barn', 'ground': {'kind': 'terrain', 'samples_z': [0, 0.6, 1.3, -0.4]},
            'area': {'min': [-12, -12], 'max': [12, 12]}, 'objects': objs}


def bad():  # 19.10.: Props in Reihe auf einer Scheibe, ohne Konzept, ohne Geschichte, schwebend
    objs = [{'id': f'p{i}', 'kind': 'prop', 'role': 'prop', 'c': [i * 1.0, 0], 'r': 0.3, 'h': 0.5, 'bottom_z': 0.05, 'ground_z': 0.0, 'asset': 'crate', 'kit': 'kaykit', 'group': 'g1'} for i in range(6)]
    return {'id': 'bad', 'kind': 'diorama', 'ground': {'kind': 'disc'}, 'area': {'min': [-3, -3], 'max': [8, 3]}, 'objects': objs}


if __name__ == '__main__':
    g, b = gate(good()), gate(bad())
    print('GOOD', g['ok'], g['fail'], g['findings']); print('BAD ', b['ok'], len(b['fail']), sorted({f.split()[0] for f in b['fail']}))
    assert rule_report(nest_ok((0, 0), 3, 1.0, seed=3))['ok']
    assert g['ok'], g['fail']
    assert not b['ok'] and {'K0', 'B1', 'S1', 'E1', 'G1', 'H5', 'S5', 'M1'} <= {f.split()[0] for f in b['fail']}
    import kfb_env  # Regression: alle Arten haben ein Einsinkband (V-571-Kommentar-Bug 20.10.)
    for kk in ('rock', 'rockgroup', 'tree', 'bush', 'building', 'prop', 'prop_buried', 'stone_L', 'stone_M', 'stone_S', 'grass', 'fluff', 'contact'):
        assert kk in kfb_env.SINK, f'SINK-Schlüssel fehlt: {kk}'
    print('OK')
