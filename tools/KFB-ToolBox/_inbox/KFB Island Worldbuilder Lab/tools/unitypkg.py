#!/usr/bin/env python3
"""Unpack a .unitypackage (gzip tar of GUID folders) into a readable tree and write guid→path index.
Usage: unitypkg.py <package.unitypackage> <out_dir>"""
import sys, tarfile, os, json
pkg, out = sys.argv[1], sys.argv[2]
tree = os.path.join(out, 'tree'); os.makedirs(tree, exist_ok=True)
entries = {}
with tarfile.open(pkg, 'r:gz') as t:
    for m in t.getmembers():
        parts = m.name.strip('./').split('/')
        if len(parts) != 2 or not m.isfile(): continue
        guid, kind = parts
        entries.setdefault(guid, {})[kind] = m
    index = {}
    for guid, e in entries.items():
        if 'pathname' not in e: continue
        path = t.extractfile(e['pathname']).read().decode('utf-8', 'ignore').splitlines()[0].strip()
        index[guid] = path
        if 'asset' in e:
            dst = os.path.join(tree, path)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            with open(dst, 'wb') as f: f.write(t.extractfile(e['asset']).read())
json.dump(index, open(os.path.join(out, 'guids.json'), 'w'), indent=1)
print(len(index), 'entries')
