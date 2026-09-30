# HANDOVER · WSA + Billboard Engine · CD-ISLAND-BILLBOARD-CLAY-01

Von Claude Design an WSA. Claude Design pusht nicht. Paket = ZIP + Preview.
Quelle Design: `georg-doc/kayfabizarro@6df3410473ae32b8f75d992e0d534e49a9dc3ca0` (H13-Sessionordner). Inhalte-Pin: `f3acaaeb98530dd9ffb7d200d61956891e738336`.

## 1 · Was die Billboard-Engine ist
Ein Modul `briefd/billboard-clay.js`, keine eigene Engine-Schleife.

| Export | Vertrag |
|---|---|
| `new Billboard(spec, rt)` | baut eine Instanz. `rt = { parent, island, pool, bodyMat, aniso }`. `island` braucht `H(x,z)`, `roadR(a)`, `ROAD_W`, `R_ISLAND`, `biome`. |
| `BillboardScheduler.tick(nowMs, camera)` | einmal pro Bild vom bestehenden Frame-Owner aufrufen. Frustum + Distanz → LOD → malt nur fällige, sichtbare Tafeln. `rate()` = Updates/s. |
| `resolveAnchor(spec, island)` | Spec → Pose. Modi `road` (t, side, offsetFromKerb, autoNudge), `polar`, `xz`. Liefert Bodenwerte. |
| `makeClayFamily(tag, U)` | Clay-Shader (wortgleich bench.js) mit eigenem Distanzfenster. |
| `loadContent(contentAsset)` | lädt nur gebackene Bilder über jsDelivr am Pin, Ungeladenes → `skipped`. |
| `bodyGeometry(W,H,pal)` | gecacht pro Größe + Palette, von allen Instanzen geteilt. |

Kosten je Tafel: 3 Draw Calls (Schatten Körper, Körper, Bildfläche), ~13,6k △ inkl. Schatten, 2,7 MB Textur. Ein zusätzliches Shader-Programm für alle Tafeln.

## 2 · Inhalte-Schnittstelle (für den H13-Anschluss)
Heute malt `paintFace(bb, now)` einen Schnitt (cover, zoom, mirror, quad, strips, text) auf ein 1024×512-Canvas und setzt `tex.needsUpdate`. Für die Engine mit mehreren Ausgaben (HANDOVER H13 §Grenzen): `paintFace` durch einen Provider ersetzen, Vertrag `provider.paint(ctx2d, W, H, now, bb) → void`. Der Provider kennt keinen Takt, der Scheduler entscheidet, wann gemalt wird. H13 darf dafür nur gebackene Frames/Bilder liefern, keine PDF-Seiten zur Laufzeit.

## 3 · Aufgaben für WSA
| # | Aufgabe | Fertig, wenn |
|---|---|---|
| WB1 | Messlauf im sichtbaren Tab auf M1 Max (Button „Messlauf“), JSON committen | Tabelle Basis/1/4/8/16 × Überblick/Fahrt mit gültigen Zeiten, Gerät + Bildfläche genannt |
| WB2 | Scheduler in den bestehenden Frame-Owner der Insel/Joyride hängen (ein Aufruf pro Bild) | kein zweites rAF/setInterval, fps vorher/nachher |
| WB3 | B1/B2a-Front/Rear-Semantik gegen `LAYOUT` (Front +Z) abgleichen | Abweichungsliste oder „passt“ |
| WB4 | Material gegen K2-/H0-Golden-Sample tauschen, falls Pfad existiert | Screenshot nah/fern vorher/nachher |
| WB5 | Provider-Schnittstelle (§2) mit H13-Ausgabe verbinden | eine Tafel zeigt H13-Frames, Updates/s gemessen |

## 4 · Grenzen
- Keine Figuren nachbauen. Keine neue Asset-Registry. Kein zweiter Scheduler.
- Bildfläche bleibt ungelit und unverformt.
- Ungeklärte Motive auslassen, nicht blockieren.

## Next Gate
WB1: Messlauf im sichtbaren Tab auf dem Zielgerät, Zeitspalten belegt.
