// WS0 18.11. · Wer hält den Speicher mit strassennetz=r1? Sampling-Heap-Profil (nur lebende Objekte) nach Start + 40 s Stehen, summiert je Modul-URL. STRASSE=1|0
import { chromium } from 'playwright'
import { startServer } from './_audioServer.mjs'
import { TESTFAHRT_HASH } from '../src/siteHash.js'
import fs from 'node:fs'
const an = process.env.STRASSE === '1', srv = await startServer()
try {
  const browser = await chromium.launch({ channel: 'chromium', args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio', '--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } }), cdp = await page.context().newCDPSession(page)
  await cdp.send('HeapProfiler.enable'); await cdp.send('HeapProfiler.startSampling', { samplingInterval: 32768, ...(process.env.CHURN ? { includeObjectsCollectedByMajorGC: true, includeObjectsCollectedByMinorGC: true } : {}) })
  await page.goto(srv.url + TESTFAHRT_HASH + ',mute' + (an ? ',strassennetz=r1' : ''), { timeout: 60000 })
  await page.waitForFunction(() => window.__kfbReady === true, null, { timeout: 300000 }); await page.waitForTimeout(40000)
  await cdp.send('HeapProfiler.collectGarbage')
  const { profile } = await cdp.send('HeapProfiler.stopSampling'), proUrl = {}, fn = {}
  const walk = (n) => { const u = (n.callFrame.url || '(intern)').replace(/^https?:\/\/[^/]+/, '').replace(/\?.*$/, ''); proUrl[u] = (proUrl[u] || 0) + n.selfSize; if (/track-core|roadNetwork/.test(u)) { const k = u.split('/').pop() + ' › ' + (n.callFrame.functionName || '(anon)') + ':' + n.callFrame.lineNumber; fn[k] = (fn[k] || 0) + n.selfSize }; (n.children || []).forEach(walk) }
  walk(profile.head)
  const heap = await page.evaluate(() => performance.memory?.usedJSHeapSize / 1048576)
  const top = Object.entries(proUrl).sort((a, b) => b[1] - a[1]).slice(0, 40).map(([u, b]) => [u, +(b / 1048576).toFixed(1)])
  fs.writeFileSync(`test/out/strassen-heap-${an ? 'an' : 'aus'}${process.env.CHURN ? '-churn' : ''}.json`, JSON.stringify({ heapMB: heap, top, alle: proUrl }, null, 1))
  console.log(JSON.stringify(Object.entries(fn).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([k, b]) => [k, Math.round(b / 1048576)]))); console.log(JSON.stringify({ an, heapMB: Math.round(heap), top: top.slice(0, 15) }))
  await browser.close()
} finally { srv.stop() }
process.exit(0)
