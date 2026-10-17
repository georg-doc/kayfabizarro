"""Read-only byte provenance against the author's linked free preview archive."""
import hashlib, json, pathlib, sys, zipfile
archive=pathlib.Path(sys.argv[1])
sources=json.loads(pathlib.Path(sys.argv[2]).read_text())
with zipfile.ZipFile(archive) as z:
    rows=[]
    for row in sources['rows']:
        if not row['file'].startswith(('concrete-','gravel-')): continue
        name=pathlib.PurePosixPath(row['path']).name
        matches=[p for p in z.namelist() if p.endswith('/'+name) or p==name]
        assert len(matches)==1, (name,matches)
        b=z.read(matches[0]);actual=hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
        assert actual==row['gitBlob'],name
        rows.append({'file':row['file'],'originalArchivePath':matches[0],'gitBlob':actual,'exactMatch':True})
print(json.dumps({'status':'PASS','checks':len(rows),'publisher':'https://ci.itch.io/400-sounds-pack','licence':'Author-specific licence, NOT CC0; incorporated-project use permitted','rows':rows},indent=2))
