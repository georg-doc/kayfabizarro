import json,sys,re
O=sys.argv[1]; M=json.load(open(O+'/teile3/_map.json')); F=json.load(open(sys.argv[2]))['fredoka']
t=open('cb_tpl.html').read().replace('{{fredoka}}',F)
for k,v in M.items(): t=t.replace('{{'+k+'}}',v)
m=re.search(r'\{\{\w+\}\}',t); assert not m, m.group(0)
open(O+'/hud_claybound_r1.html','w').write(t)
print(len(t)//1024,'KB'); print(json.dumps([{'path':v} for v in M.values()]))
