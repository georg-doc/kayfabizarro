s=open('gelaende-probe.html').read()
pub=open('gelaende-probe.public.html').read()
head=pub[:pub.index('<style>html,body{margin:0}</style>')+len('<style>html,body{margin:0}</style>\n\n')]
first=s.split('\n',1)  # title line
lines=s.split('\n')
# rebuild like before: doctype/head + title, style reset, rest until end of first </style> block then </head><body>
a="    <p><strong>Grenzen:</strong> Spielzeug-Physik"; assert s.count(a)==1
s=s.replace(a,"    <p><strong>Grenzen:</strong> Gelände-Probe von WS1 (Entscheidungsgrundlage, nicht das Spiel). Spielzeug-Physik")
old="""        // Modell liegt als Base64 in JSON neben der Seite (Artefakte liefern kein .glb aus); hier wieder zum GLB-Puffer
        const j = await fetch('racers/' + info.id + '.json').then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json() });
        const bin = atob(j.glb), u8 = new Uint8Array(bin.length); for (let k = 0; k < bin.length; k++) u8[k] = bin.charCodeAt(k); const buf = u8.buffer;"""
new="""        // Modelle von derselben festen Adresse wie die Spielvorschau (öffentlicher Asset-Branch, Commit-Pin aus kfb-vehicle-rig.r1)
        const url = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/9bd8e0376105b29375377ea3052e33528d50fbb6/media/3D_Assets/MeshyModels/vehicles/${info.id}/${info.id}_browser.v3.glb`;
        const buf = await fetch(url).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer() });"""
assert s.count(old)==1; s=s.replace(old,new)
L=s.split('\n')
# original structure: line0 = <title>, then lines up to index 61 (</style>) belong to head
idx=next(i for i,l in enumerate(L) if l.strip()=='</style>')
out='<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'+L[0]+'\n<style>html,body{margin:0}</style>\n\n'+'\n'.join(L[1:idx+1])+'\n</head>\n<body>\n'+'\n'.join(L[idx+1:])+'\n\n</body>\n</html>\n'
open('gelaende-probe.public.html','w').write(out); print('ok', idx)
