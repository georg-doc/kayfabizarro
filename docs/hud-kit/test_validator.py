from pathlib import Path
from tempfile import TemporaryDirectory
from PIL import Image, ImageDraw
from validate_sheet import validate

def run():
    n=0
    with TemporaryDirectory() as t:
        root=Path(t)
        source=Image.new("RGBA",(2048,2048),(0,0,0,0))
        draw=ImageDraw.Draw(source)
        for y in [50,510,1160]:
            draw.rounded_rectangle((50,y,1000,y+140),radius=22,fill=(220,150,70,255))
        a=root/"valid1.png";source.save(a)
        assert validate(a,1)["structural_pass"];n+=1
        opaque=Image.new("RGB",(2048,2048),(200,180,160))
        o=root/"opaque.png";opaque.save(o)
        assert not validate(o,1)["structural_pass"];n+=1
        small=Image.new("RGBA",(1500,800),(0,0,0,0))
        s=root/"small.png";small.save(s)
        assert not validate(s,1)["structural_pass"];n+=1
        gap=source.copy();ImageDraw.Draw(gap).rectangle((50,472,200,480),fill=(255,0,0,255))
        g=root/"gap.png";gap.save(g)
        assert not validate(g,1)["structural_pass"];n+=1
        grid=Image.new("RGBA",(2048,2048),(0,0,0,0));d=ImageDraw.Draw(grid)
        for row in range(4):
            for col in range(4):
                x,y=col*512+72,row*512+72
                d.rounded_rectangle((x,y,x+260,y+260),radius=24,fill=(220,150,70,255))
        v=root/"valid2.png";grid.save(v)
        assert validate(v,2)["structural_pass"];n+=1
        missing=grid.copy()
        ImageDraw.Draw(missing).rectangle((1536,1536,2047,2047),fill=(0,0,0,0))
        m=root/"missing.png";missing.save(m)
        assert not validate(m,2)["structural_pass"];n+=1
        border=grid.copy();ImageDraw.Draw(border).rectangle((511,511,515,515),fill=(255,255,255,255))
        b=root/"border.png";border.save(b)
        assert not validate(b,2)["structural_pass"];n+=1
    print(f"{n}/{n} structural validator fixture checks PASS")

if __name__=="__main__":
    run()
