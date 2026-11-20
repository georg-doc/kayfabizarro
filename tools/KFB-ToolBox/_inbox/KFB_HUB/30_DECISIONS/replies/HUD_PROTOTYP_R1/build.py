#!/usr/bin/env python3
# HUD-Prototyp R1 (Georg 20.11.): Layout nach Georgs Vorgabe, echte Teile (Papiere, Knete, Hero-Icons), Flyouts klickbar. Eine Datei mit eingebetteten Bildern.
import base64, os, sys
P = os.path.dirname(os.path.abspath(__file__)); A = P + '/a'; H = '/Users/georgv.westphalen/kfb-ws0/stamm-wt/src/assets/hud_min_r14'
BG = sys.argv[1]; OUT = sys.argv[2]
def uri(path, mime=None):
    ext = path.rsplit('.', 1)[-1].lower(); mime = mime or {'webp': 'image/webp', 'png': 'image/png', 'jpg': 'image/jpeg', 'ttf': 'font/ttf'}[ext]
    return 'data:%s;base64,%s' % (mime, base64.b64encode(open(path, 'rb').read()).decode())
a = lambda n: uri(A + '/' + n + '.webp'); h = lambda n: uri(H + '/' + n)
CLAY = h('kneaded-clay-tile.webp')
FARBEN = [('Tragic', 12), ('Comic', 31), ('Absurd', 7), ('Heroic', 22), ('Mystical', 4), ('Forbidden', 1)]
DEF = [(-6, 1.04, .97), (5, .97, 1.03), (-3, 1.02, 1.0), (8, .98, 1.02), (-9, 1.03, .96), (4, .96, 1.04)]   # Drehung, Breite, Höhe je Kugel

def bed(icon, key='', size=74, chev=None, cls='', label=''):
    k = f'<b class="key">{key}</b>' if key else ''
    c = f'<i class="chev" data-fly="{chev}"></i>' if chev else ''
    l = f'<em class="lbl">{label}</em>' if label else ''
    return f'<div class="bed {cls}" style="--s:{size}px"><img src="{icon}" alt="">{k}{c}{l}</div>'

balls = ''.join(f'<div class="ball" style="--r:{r}deg;--sx:{sx};--sy:{sy}"><img src="{a("ball%d" % i)}" alt=""><span>{n}</span></div>' for i, ((name, n), (r, sx, sy)) in enumerate(zip(FARBEN, DEF)))
fly_fluff = ''.join(f'<div class="frow"><img src="{a("ball%d" % i)}"><span>{name}</span><b>{n}</b></div>' for i, (name, n) in enumerate(FARBEN))
waffen = [('hero_fist.webp', 'Faust'), ('hero_blaster.webp', 'Blaster'), ('sword.png', 'Katana'), ('gatling.png', 'Gatling'), ('rocket_launcher.png', 'Raketenwerfer'), ('hero_bomb.webp', 'Clownbombe')]
fly_waffen = ''.join(f'<div class="cell">{bed(h(f), size=64)}<span>{n}</span></div>' for f, n in waffen)
reise = [('jetpack.png', 'Jetpack'), ('crimson_flame_dragster.png', 'Dragster'), ('jetbound_roadster.png', 'Roadster'), ('wasteland_beetle.png', 'Käfer'), ('iron_phantom_hovercar.png', 'Hovercar')]
fly_reise = f'<div class="cell">{bed(h("backpack.png").replace("backpack","backpack"), size=64)}<span>Zu Fuß</span></div>'.replace(h("backpack.png"), uri(H + '/hand-four-finger-r2.webp')) if False else ''
fly_reise = ''.join(f'<div class="cell">{bed(h(f), size=64)}<span>{n}</span></div>' for f, n in [('glyph_base_jump.webp', 'Zu Fuß')] + reise)
ziele = [('Nächste Karte', '200 m', '#f2c230'), ('Kampfbühne', '340 m', '#c9508f'), ('Fold-Ort', '610 m', '#4fa3d1'), ('Theater', '1,2 km', '#8bc34a')]
fly_ziele = ''.join(f'<div class="zrow"><i style="background:{c}"></i><span>{n}</span><b>{d}</b></div>' for n, d, c in ziele)
songs = ['Swamp Boogaloo Brawl', 'Graveyard Surf Funk', 'Pharaoh Piledriver', 'Tin Soldier Panic March']
fly_radio = ''.join(f'<div class="zrow"><i style="background:{"#3b2c20" if i == 0 else "#b9a07c"}"></i><span>{s}</span></div>' for i, s in enumerate(songs))
fly_inv = ''.join(f'<div class="cell">{bed(h(f), size=58)}<span>{n}</span></div>' for f, n in [('hero_grenade.webp', 'Granate ×3'), ('craft.png', 'Alchemie'), ('backpack.png', 'Truhe')])

html = f'''<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KFB HUD Prototyp R1</title>
<style>
@font-face{{font-family:Fredoka;src:url({h("Fredoka-600.ttf")})}}
html,body{{margin:0;height:100%;background:#1d1a17;overflow:hidden;font-family:Fredoka,system-ui,sans-serif}}
#stage{{position:absolute;left:0;top:0;width:1600px;height:900px;transform-origin:0 0;background:url({uri(BG)}) center/cover}}
.p{{position:absolute;filter:drop-shadow(0 4px 4px rgba(52,32,16,.3))}}
.paper{{position:absolute;inset:0;background-size:100% 100%;background-repeat:no-repeat}}
.ink{{color:#3b2c20}}
/* Knet-Bett: unregelmäßig gerundet, Knet-Textur, Schatten statt Glanz */
.bed{{position:relative;width:var(--s);height:var(--s);border-radius:38% 42% 40% 36% / 40% 36% 42% 38%;background:url({CLAY}) center/180% auto,#ead8b6;background-blend-mode:soft-light;box-shadow:inset 0 -5px 0 rgba(70,46,28,.28),inset 0 3px 3px rgba(255,248,236,.28),0 4px 5px rgba(52,32,16,.35);display:grid;place-items:center;cursor:pointer;transition:transform .14s cubic-bezier(.3,1.6,.5,1)}}
.bed:hover{{transform:translateY(-2px)}} .bed:active{{transform:scale(.93,.88)}}
.bed img{{width:78%;height:78%;object-fit:contain;filter:drop-shadow(0 3px 2px rgba(52,32,16,.45))}}
.bed .key{{position:absolute;bottom:-21px;left:50%;transform:translateX(-50%);font:600 14px Fredoka;color:#3b2c20;white-space:nowrap}}
.bed .lbl{{position:absolute;bottom:-21px;left:50%;transform:translateX(-50%);font:600 13px Fredoka;font-style:normal;color:#3b2c20;white-space:nowrap}}
.bed.round{{border-radius:50%}}
.bed.tinte img{{filter:brightness(0) invert(17%) sepia(25%) saturate(700%) hue-rotate(345deg);width:56%;height:56%}}
/* dezenter 3D-Pfeil fürs Flyout */
.chev{{position:absolute;right:-9px;bottom:-9px;width:24px;height:24px;border-radius:50%;background:url({CLAY}) center/220% auto,#e2cda6;background-blend-mode:soft-light;box-shadow:inset 0 -3px 0 rgba(70,46,28,.3),0 2px 3px rgba(52,32,16,.35);cursor:pointer}}
.chev::after{{content:"";position:absolute;left:50%;top:46%;width:7px;height:7px;border-right:2.5px solid #3b2c20;border-bottom:2.5px solid #3b2c20;transform:translate(-50%,-50%) rotate(45deg)}}
.chev.up::after{{top:58%;transform:translate(-50%,-50%) rotate(225deg)}}
.chev.inline{{position:relative;right:auto;bottom:auto;flex:none}}
/* Fluffkugeln: satt, knubbelig, je leicht verformt */
.ball{{position:relative;width:66px;height:66px;transform:rotate(var(--r)) scale(var(--sx),var(--sy));cursor:pointer;transition:transform .16s cubic-bezier(.3,1.6,.5,1)}}
.ball img{{width:100%;height:100%;filter:drop-shadow(0 4px 2px rgba(52,32,16,.45)) drop-shadow(0 8px 8px rgba(52,32,16,.18))}}
.ball:hover{{transform:rotate(var(--r)) scale(calc(var(--sx)*1.08),calc(var(--sy)*1.08)) translateY(-2px)}}
.ball:active{{transform:rotate(var(--r)) scale(calc(var(--sx)*1.12),calc(var(--sy)*.86))}}
.ball span{{position:absolute;inset:0;display:grid;place-items:center;font:600 19px Fredoka;color:#fff8ec;text-shadow:0 1px 0 rgba(30,18,10,.9),0 0 4px rgba(30,18,10,.6);transform:rotate(calc(var(--r)*-1))}}
/* senkrechte Leisten */
.tube{{position:absolute;left:50%;top:44px;bottom:70px;width:22px;transform:translateX(-50%);border-radius:14px;background:url({CLAY}) center/300% auto,#e4d2b0;background-blend-mode:soft-light;box-shadow:inset 0 3px 4px rgba(52,32,16,.45),0 1px 0 rgba(255,248,236,.5)}}
.tube i{{position:absolute;left:3px;right:3px;bottom:3px;border-radius:11px;box-shadow:inset 0 -3px 0 rgba(0,0,0,.18),inset 0 2px 0 rgba(255,255,255,.18)}}
.vlabel{{position:absolute;left:0;right:0;text-align:center;font:600 13px Fredoka;color:#3b2c20;letter-spacing:.04em}}
.vval{{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);width:50px;height:44px;border-radius:46% 50% 44% 50%;background:url({CLAY}) center/200% auto,#ecdcbc;background-blend-mode:soft-light;box-shadow:inset 0 -3px 0 rgba(70,46,28,.28),0 3px 4px rgba(52,32,16,.3);display:grid;place-items:center;font:600 18px/1 Fredoka;color:#3b2c20;text-align:center}}
.vval small{{display:block;font-size:10px}}
/* Flyouts */
.fly{{position:absolute;display:none;padding:26px 30px 30px;z-index:5}}
.fly.open{{display:block}}
.fly h4{{margin:0 0 12px;font:600 15px Fredoka;color:#3b2c20;letter-spacing:.05em;text-transform:uppercase;position:relative}}
.grid{{display:grid;gap:30px 18px;position:relative}}
.cell{{display:grid;justify-items:center;gap:6px;font:600 13px Fredoka;color:#3b2c20}}
.frow,.zrow{{display:flex;align-items:center;gap:12px;font:600 16px Fredoka;color:#3b2c20;padding:5px 2px;position:relative}}
.frow img{{width:34px;height:34px}} .frow b,.zrow b{{margin-left:auto;font-weight:600}}
.zrow i{{width:14px;height:14px;border-radius:50%;box-shadow:0 0 0 2px #3b2c20;flex:none}}
.note{{position:absolute;left:50%;transform:translateX(-50%);top:880px;font:12px system-ui;color:#fff;background:rgba(0,0,0,.45);padding:4px 8px;border-radius:6px}}
</style></head><body><div id="stage">

<!-- oben links: fraktaler Almanach -->
<div class="p" style="left:22px;top:18px;width:236px;height:156px"><div class="paper" style="background-image:url({a('stapel_almanach')})"></div>
 <img src="{uri(P + '/almcard.png')}" style="position:absolute;left:24px;top:18px;width:178px;transform:rotate(-1.5deg);box-shadow:0 2px 3px rgba(52,32,16,.35)">
 <i class="chev" data-fly="f-alm" style="right:16px;bottom:10px"></i></div>

<!-- oben: Radio zwischen Almanach und Fluffleiste -->
<div class="p" style="left:278px;top:30px;width:336px;height:76px"><div class="paper" style="background-image:url({a('streifen_radio')})"></div>
 <div style="position:absolute;inset:12px 20px;display:flex;align-items:center;gap:10px">
  {bed(h('pause20.png'), size=42, cls='round tinte')}{bed(h('caret-right0.png'), size=42, cls='round tinte')}{bed(h('volume-medium0.png'), size=42, cls='round tinte')}
  <div class="ink" style="font:600 14px/1.15 Fredoka;flex:1;min-width:0">Radio KFB<br><span style="font-size:12px;opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block">Swamp Boogaloo Brawl</span></div>
  <i class="chev inline" data-fly="f-radio"></i></div></div>

<!-- Mitte oben: Fluffleiste -->
<div class="p" style="left:626px;top:14px;width:560px;height:112px"><div class="paper" style="background-image:url({a('streifen_fluff')})"></div>
 <div style="position:absolute;inset:18px 30px 18px 34px;display:flex;align-items:center;gap:8px">{balls}
  <div class="ink" style="margin-left:10px;font:600 22px Fredoka">77</div><i class="chev inline" data-fly="f-fluff" style="margin-left:8px"></i></div></div>

<!-- oben rechts: runde Minimap mit Ziel, daneben Einstellungen -->
<div class="p" style="right:22px;top:12px;width:206px;height:206px"><div class="paper" style="background-image:url({a('karte_rund')})"></div>
 <div style="position:absolute;inset:26px;border-radius:50%;background:url({uri(P + '/map.png')}) center/cover;box-shadow:inset 0 0 0 2px rgba(59,44,32,.6),inset 0 3px 6px rgba(52,32,16,.4)"></div>
 <i class="chev" data-fly="f-ziele" style="right:18px;bottom:18px"></i></div>
<div class="p" style="right:44px;top:222px;width:164px;height:34px"><div class="paper" style="background-image:url({a('tag')})"></div>
 <div class="ink" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:6px;font:600 13px Fredoka"><i style="width:10px;height:10px;border-radius:50%;background:#f2c230;box-shadow:0 0 0 2px #3b2c20"></i>Nächste Karte · 200 m</div></div>
<div class="p" style="right:226px;top:20px;width:70px;height:70px"><div class="paper" style="background-image:url({a('rund_klein')})"></div>
 <div style="position:absolute;inset:11px">{bed(h('settings0.png'), size=48, cls='round tinte')}</div></div>

<!-- Seitenleisten: links Leben, rechts Tempo -->
<div class="p" style="left:20px;top:300px;width:74px;height:330px"><div class="paper" style="background-image:url({a('leiste_v')})"></div>
 <div class="vlabel" style="top:20px">LEBEN</div><div class="tube"><i style="height:76%;background:linear-gradient(#8bc34a,#6aa83a)"></i></div><div class="vval">76</div></div>
<div class="p" style="right:20px;top:300px;width:74px;height:330px"><div class="paper" style="background-image:url({a('leiste_v')});transform:scaleX(-1)"></div>
 <div class="vlabel" style="top:20px">TEMPO</div><div class="tube"><i style="height:42%;background:linear-gradient(#5fb3d9,#3f8fb5)"></i></div><div class="vval">42<small>km/h</small></div></div>

<!-- unten links: Inventar -->
<div class="p" style="left:24px;bottom:22px;width:176px;height:124px"><div class="paper" style="background-image:url({a('flicken_links')})"></div>
 <div style="position:absolute;left:46px;top:20px">{bed(h('backpack.png'), size=78, chev='f-inv', label='Inventar')}</div></div>

<!-- unten Mitte: Porträt + Aktionen -->
<div class="p" style="left:482px;bottom:14px;width:636px;height:150px"><div class="paper" style="background-image:url({a('streifen_aktion')})"></div>
 <div style="position:absolute;left:-22px;top:-4px;width:146px;height:146px"><div class="paper" style="background-image:url({a('portrait_rund')})"></div>
  <div style="position:absolute;inset:18px;border-radius:50%;background:url({a('fb')}) center/cover;box-shadow:inset 0 0 0 3px rgba(59,44,32,.7),0 3px 4px rgba(52,32,16,.35)"></div></div>
 <div style="position:absolute;left:150px;right:30px;top:30px;display:flex;justify-content:space-between">
  {bed(h('hero_fist.webp'), 'B', 80, 'f-waffen')}{bed(h('hero_grenade.webp'), 'C', 80, 'f-wurf')}{bed(h('glyph_base_jump.webp'), 'Space', 80)}{bed(h('hand-four-finger-r2.webp'), 'I', 80)}</div></div>

<!-- unten rechts: Reise-Modi -->
<div class="p" style="right:24px;bottom:22px;width:176px;height:124px"><div class="paper" style="background-image:url({a('flicken_rechts')})"></div>
 <div style="position:absolute;left:48px;top:20px">{bed(h('glyph_base_jump.webp'), size=78, chev='f-reise', label='Zu Fuß')}</div></div>

<!-- Flyouts -->
<div class="fly" id="f-waffen" style="left:540px;bottom:178px;width:440px"><div class="paper" style="background-image:url({a('flyout')})"></div><h4>Waffen</h4><div class="grid" style="grid-template-columns:repeat(3,1fr)">{fly_waffen}</div></div>
<div class="fly" id="f-wurf" style="left:600px;bottom:178px;width:300px"><div class="paper" style="background-image:url({a('flyout2')})"></div><h4>Wurf</h4><div class="grid" style="grid-template-columns:repeat(2,1fr)">{''.join(f'<div class="cell">{bed(h(f), size=64)}<span>{n}</span></div>' for f, n in [('hero_grenade.webp', 'Granate'), ('hero_bomb.webp', 'Clownbombe')])}</div></div>
<div class="fly" id="f-reise" style="right:30px;bottom:170px;width:400px"><div class="paper" style="background-image:url({a('flyout')})"></div><h4>Reise</h4><div class="grid" style="grid-template-columns:repeat(3,1fr)">{fly_reise}</div></div>
<div class="fly" id="f-inv" style="left:30px;bottom:170px;width:330px"><div class="paper" style="background-image:url({a('flyout2')})"></div><h4>Inventar</h4><div class="grid" style="grid-template-columns:repeat(3,1fr)">{fly_inv}</div></div>
<div class="fly" id="f-fluff" style="left:760px;top:132px;width:290px"><div class="paper" style="background-image:url({a('flyout2')})"></div><h4>Fluff</h4>{fly_fluff}</div>
<div class="fly" id="f-ziele" style="right:30px;top:262px;width:300px"><div class="paper" style="background-image:url({a('flyout')})"></div><h4>Ziele</h4>{fly_ziele}</div>
<div class="fly" id="f-radio" style="left:290px;top:112px;width:320px"><div class="paper" style="background-image:url({a('flyout2')})"></div><h4>Playlist</h4>{fly_radio}</div>
<div class="fly" id="f-alm" style="left:24px;top:180px;width:300px"><div class="paper" style="background-image:url({a('flyout')})"></div><h4>Almanach</h4><div class="zrow"><span>Die fertige Stadt</span></div><div class="zrow"><span>Der glänzende Horizont</span></div><div class="zrow"><span>Das Pudel-Paradox</span></div></div>
<div class="note">Prototyp R1 · Pfeile öffnen die Flyouts · nur Ansicht, nicht im Spiel</div>
</div>
<script>
const st=document.getElementById('stage');function fit(){{const k=Math.min(innerWidth/1600,innerHeight/900);st.style.transform='scale('+k+')';st.style.left=(innerWidth-1600*k)/2+'px';st.style.top=(innerHeight-900*k)/2+'px'}}addEventListener('resize',fit);fit();
document.addEventListener('click',e=>{{const c=e.target.closest('[data-fly]');document.querySelectorAll('.chev').forEach(x=>x.classList.remove('up'));if(!c){{if(!e.target.closest('.fly'))document.querySelectorAll('.fly.open').forEach(f=>f.classList.remove('open'));return}}const f=document.getElementById(c.dataset.fly),was=f.classList.contains('open');document.querySelectorAll('.fly.open').forEach(x=>x.classList.remove('open'));if(!was){{f.classList.add('open');c.classList.add('up')}}e.stopPropagation()}});
const q=new URLSearchParams(location.hash.slice(1));if(q.get('open'))q.get('open').split(',').forEach(id=>document.getElementById(id)?.classList.add('open'));
</script></body></html>'''
open(OUT, 'w').write(html); print(OUT, round(len(html) / 1e6, 2), 'MB')
