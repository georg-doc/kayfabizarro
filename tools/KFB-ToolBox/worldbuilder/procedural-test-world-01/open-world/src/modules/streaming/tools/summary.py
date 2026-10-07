import sys, json
d = json.load(open(sys.argv[1]))
for k in ['reloadedMidRun','fatal','url','otherRunsAtStart','otherRunsAtEnd','fpsAvg','p50','p95','p99','max','over33','over33Split','over50','hist','drawCalls','triangles','chunksBuilt','distanceM','steers','newPrograms','attrPerFrameAvg','consoleErrors','pageErrors','inPageErrors']:
    if k in d: print(k, json.dumps(d.get(k)))
n = int(sys.argv[2]) if len(sys.argv) > 2 else 12
for w in d.get('worst', [])[:n]: print(json.dumps(w))
if d.get('extra'): print('extra', json.dumps(d['extra'])[:1500])
