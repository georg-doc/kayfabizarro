# kfb-edge.v1.js in gelaende-probe.html einbetten (Block zwischen KFB_EDGE_BEGIN/END ersetzen oder vor dem Haupt-Skript einfügen)
import re
p='/Users/georgvonwestphalen/kfb-ws1/probe/gelaende-probe.html'; s=open(p).read()
js=open('/Users/georgvonwestphalen/kfb-ws1/probe/port/kfb-edge.v1.js').read(); assert '</script' not in js
blk='<script>/* KFB_EDGE_BEGIN · kfb-edge.v1 (Dioramen-Plan Schritt 5), eingebettet von port/inline_edge.py aus port/kfb-edge.v1.js (dort ändern) */\n'+js+'\n/* KFB_EDGE_END */</script>'
if 'KFB_EDGE_BEGIN' in s: s=re.sub(r'<script>/\* KFB_EDGE_BEGIN.*?/\* KFB_EDGE_END \*/</script>', lambda m: blk, s, flags=re.S)
else:
    a='<script>/* KFB_CLAYTEX_BEGIN'; i=s.index(a); j=s.index('</script>', i)+len('</script>'); s=s[:j]+'\n'+blk+s[j:]
open(p,'w').write(s); print('ok', len(js))
