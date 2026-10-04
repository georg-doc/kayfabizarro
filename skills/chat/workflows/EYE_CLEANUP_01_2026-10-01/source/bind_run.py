import asyncio, json
from playwright.async_api import async_playwright
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    pg=await b.new_page(); logs=[]; pg.on('pageerror',lambda e: logs.append(str(e)))
    await pg.goto('http://localhost:8771/bind.html'); await pg.wait_for_function('window.__ready===true')
    res={}
    for f,r in (('Mummy_A','Rig_Medium'),('Mummy_B','Rig_Medium'),('OrcBrute','Rig_Large'),('Witch','Rig_Medium')):
      res[f]=await pg.evaluate('([f,r])=>check(f,r)',[f,r]); print(f,json.dumps(res[f]))
    json.dump(res,open('/tmp/eye/work/bind_check.json','w'),indent=1); print(logs); await b.close()
asyncio.run(main())
