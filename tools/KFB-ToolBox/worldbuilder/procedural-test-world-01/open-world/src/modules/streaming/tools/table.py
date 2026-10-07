import sys, json
rows = []
for p in sys.argv[1:]:
    d = json.load(open(p))
    n = p.split('/')[-1][:-5]
    if 'fatal' in d: rows.append((n, 'FATAL ' + d['fatal'][:80])); continue
    if d.get('reloadedMidRun'): rows.append((n, 'INVALID: page reloaded mid-run')); continue
    worst = d['worst'][0] if d.get('worst') else {}
    a = worst.get('attr', {})
    top = ', '.join(f"{k} {v}" for k, v in list(a.items())[:2])
    rows.append((n, f"fps {d['fpsAvg']:5} p50 {d['p50']:5} p95 {d['p95']:5} p99 {d['p99']:5} max {d['max']:6} >33 {d['over33']:3} (ext {d.get('over33Split',{}).get('externalOrGpu','?')}) >50 {d['over50']:2} gpu {(d.get('gpu') or {}).get('p95','-')}/{(d.get('gpu') or {}).get('max','-')} dc {d['drawCalls']['p50']}/{d['drawCalls']['max']} tris {d['triangles']['p50']/1e6:.2f}M dist {d['distanceM']}m others {d.get('otherRunsAtStart')}/{d.get('otherRunsAtEnd')} err {len(d['consoleErrors'])+len(d['pageErrors'])} | worst: {top}"))
for n, r in sorted(rows): print(f"{n:22} {r}")
