import json
from PIL import Image, ImageDraw
from shapely.geometry import Polygon
d=json.load(open('ink_card_4242.json'))
W,H,S=800,447,4
src=Image.open('/tmp/fl/backside.png').convert('RGBA')
print('alpha min',src.getchannel('A').getextrema())
src=src.resize((W*S,H*S),Image.LANCZOS)
base=Image.new('RGBA',(W*S,H*S),(0xef,0xe6,0xd0,255))
# fill clip = canon contour grown by maskGrow (SOP: fill retreats inside ink, grow <= maskGrow)
poly=Polygon(d['pts']).buffer(d['grow'],join_style=2)
mask=Image.new('L',(W*S,H*S),0)
ImageDraw.Draw(mask).polygon([(x*S,y*S) for x,y in poly.exterior.coords],fill=255)
base.paste(Image.alpha_composite(base,src),(0,0),mask)
ink=Image.new('L',(W*S,H*S),0); di=ImageDraw.Draw(ink)
for q in d['quads']: di.polygon([(x*S,y*S) for x,y in q],fill=255)
c=tuple(int(d['color'][i:i+2],16) for i in (1,3,5))
base.paste(Image.new('RGBA',base.size,c+(255,)),(0,0),ink)
out=base.resize((W,H),Image.LANCZOS).convert('RGB')
out.save('KFB_CARD_BACKSIDE_INK_BAND_4242.png')
base.resize((W*2,H*2),Image.LANCZOS).convert('RGB').save('KFB_CARD_BACKSIDE_INK_BAND_4242_2x.png')
print(out.getextrema())
