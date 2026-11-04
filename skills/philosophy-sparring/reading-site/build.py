import json,html,re,pathlib,urllib.parse
owner=pathlib.Path(__file__).resolve().parent.parent
b={'titles':['Theologische Skizzen','Reflexionen 2025','KI und Transhumanismus','Selbstbestimmung des Patienten','Selbstwirksamkeit','Unsicherheit und Wagnis','Erlösung in säkularer Perspektive','Anmerkung zu Hawking','Glaubensbekenntnis','Wissen und Glaubensgewissheit'],'texts':{f'S{i}':(owner/'corpus'/f'S{i}.txt').read_bytes().decode() for i in range(1,11)},'start':(owner/'START.md').read_text(),'analysis':(owner/'INTEGRATION_S3_S8_S9.md').read_text(),'head':__import__('subprocess').check_output(['git','rev-parse','HEAD'],cwd=owner,text=True).strip()}
root=pathlib.Path(__file__).resolve().parent/'dist';root.mkdir(exist_ok=True)
origin='https://philosophie-leseraum.frizzlebob.chatgpt.site'
css='''*{box-sizing:border-box}body{margin:0;background:#f5f4f0;color:#293634;font:21px/1.7 system-ui,sans-serif}main{max-width:800px;margin:10vh auto;padding:0 26px}h1{font-size:clamp(34px,6vw,52px);line-height:1.18;font-weight:550;letter-spacing:-.035em}h2{font-size:26px;margin-top:2em}p{margin:1em 0}a{color:#315e56;text-underline-offset:4px}.buttons{display:flex;gap:12px;flex-wrap:wrap;margin:32px 0}.button{background:#315e56;color:white;border-radius:18px;text-decoration:none;padding:15px 22px}.button.alt{background:#e2e8e3;color:#293634}details{margin:26px 0;border-top:1px solid #ccd3cd;padding-top:20px}summary{cursor:pointer}small,.muted{font-size:16px;color:#566660}article{white-space:pre-wrap;overflow-wrap:anywhere;font-family:Georgia,serif;font-size:22px}li{margin:.6em 0}footer{margin:50px 0;font-size:15px;color:#566660}:focus-visible{outline:3px solid #a97428;outline-offset:5px}@media(max-width:500px){main{margin:6vh auto}.button{width:100%;text-align:center}}'''
(root/'style.css').write_text(css)
def page(title,body):return '<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>'+html.escape(title)+'</title><link rel="stylesheet" href="/style.css"><main>'+body+'<footer>Gesprächsraum · R9-URL-4 · <a href="/">Start</a></footer></main></html>'
def md(s):
 s=html.escape(s)
 s=re.sub(r'\[([^\]]+)\]\((https?://[^\s)]+)\)',r'<a href="\2">\1</a>',s)
 return ''.join(('<h2>'+x.split('\n',1)[0].lstrip('# ')+'</h2>'+('<p>'+x.split('\n',1)[1]+'</p>' if '\n' in x else '')) if x.startswith('#') else '<p>'+x+'</p>' for x in s.split('\n\n') if x.strip())
prompt='Lies '+origin+'/konfiguration.html und nutze diese Gesprächskonfiguration für unser Gespräch. Lade bei Bedarf die dort verlinkten Originaltexte. Wenn der Zugriff nicht gelingt, sage das offen. Beginne mit einer kurzen Einladung zum Gespräch.'
links={k:u+urllib.parse.quote(prompt,safe='') for k,u in [('cg','https://chatgpt.com/?q='),('px','https://www.perplexity.ai/search?q=')]}
index='<p class="muted">Texte · Gedanken · Gespräch</p><h1>Ein Gedanke.<br>Ein gutes Gespräch.</h1><p>Weiterdenken, nachfragen, neue Verbindungen entdecken.</p><div class="buttons"><a class="button" href="'+links['cg']+'">Mit ChatGPT sprechen</a><a class="button alt" href="'+links['px']+'">Mit Perplexity sprechen</a></div><p class="muted">Öffnet deinen gewohnten KI-Dienst. Dort kannst du dich wie üblich anmelden.</p><details><summary>Texte und Hintergrund</summary><p><a href="/texte.html">Die zehn Originaltexte lesen</a></p><p><a href="/konfiguration.html">Gesprächsgrundlage ansehen</a></p><p><a href="/einordnung.html">Einordnungen und externe Quellen</a></p><p class="muted">Der Link übergibt einen vorbereiteten Auftrag. Ob der KI-Dienst die Texte abrufen kann, hängt vom Dienst ab. Ein neuer Aufruf bittet den KI-Dienst, den aktuellen Stand zu lesen; laufende Gespräche aktualisieren sich nicht selbst.</p></details>'
(root/'index.html').write_text(page('Gesprächsraum',index))
cat='<h1>Texte zum Weiterdenken</h1><p>Zehn Originaltexte als unkorrigierte Lesefassungen.</p><ul>'
for i,title in enumerate(b['titles'],1):
 id='S'+str(i);text=b['texts'][id];cat+='<li><a href="/texte/'+id+'.html">'+id+' · '+html.escape(title)+'</a></li>'
 (root/'texte').mkdir(exist_ok=True)
 (root/'texte'/f'{id}.txt').write_text(text)
 (root/'texte'/f'{id}.html').write_text(page(title,'<p><a href="/texte.html">Alle Texte</a></p><h1>'+html.escape(title)+'</h1><p class="muted">'+id+' · Originaltext als Lesefassung. Layout und Notenverknüpfungen können abweichen.</p><article>'+html.escape(text)+'</article>'))
cat+='</ul><p class="muted">Keine KI-Zusammenfassungen. Die Textauszüge bewahren nicht zuverlässig das Seitenlayout oder die Verknüpfung von Fußnoten. Datierte Aussagen sind keine aktuelle Fachauskunft.</p>'
(root/'texte.html').write_text(page('Originaltexte',cat))
start=b['start'];start=start.replace('## Für dich\n'+start.split('## Für dich\n')[1].split('\n\n')[0],'## Einstieg\nDie Startseite öffnet einen vorbereiteten Gesprächsauftrag in deinem gewohnten KI-Dienst.')
start+='\n\n## Volltexte auf dieser Website\n'+ '\n\n'.join(f'[{i+1} · {t}]({origin}/texte/S{i+1}.html)' for i,t in enumerate(b['titles']))
(root/'konfiguration.html').write_text(page('Gesprächsgrundlage',md(start)))
(root/'einordnung.html').write_text(page('Lesehinweise',md(b['analysis'])))
(root/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n')
paths=['/','/konfiguration.html','/texte.html','/einordnung.html']+[f'/texte/S{i}.html' for i in range(1,11)]
(root/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+origin+p+'</loc></url>' for p in paths)+'</urlset>')
(root/'version.json').write_text(json.dumps({'version':'R9-URL-4','source_commit':b['head'],'source_count':10}))
print('Built',len(list(root.rglob('*'))),'entries. All ten text files exactly equal source bundle.')
assert all((root/'texte'/f'S{i}.txt').read_bytes()==b['texts'][f'S{i}'].encode() for i in range(1,11))
assert all(x not in '\n'.join(p.read_text() for p in root.rglob('*') if p.is_file()) for x in ['Lieber Georg','Kuss\\','netcologne.de','1FGA8gIz','1xAbLBd'])
