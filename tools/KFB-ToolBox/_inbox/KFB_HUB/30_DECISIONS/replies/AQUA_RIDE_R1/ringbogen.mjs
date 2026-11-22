import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'
const [, , dir, out] = process.argv
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.png')).sort()
const cells = files.map((f, i) => `<figure><img src="data:image/png;base64,${fs.readFileSync(path.join(dir, f)).toString('base64')}"><figcaption>${i + 1}</figcaption></figure>`).join('')
const html = `<style>body{margin:0;background:#222;font:bold 22px Helvetica;color:#fff}main{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;padding:6px}figure{margin:0;position:relative}img{width:100%;display:block}figcaption{position:absolute;left:8px;top:6px;text-shadow:0 0 4px #000}</style><main>${cells}</main>`
const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1800, height: 700 } })
await p.setContent(html); await p.waitForTimeout(500)
await p.screenshot({ path: out, type: 'jpeg', quality: 85, fullPage: true }); await b.close()
console.log(files.join('\n'))
