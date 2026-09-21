# SESSION-CUT v5 — KFB Pet Studio, 25.08.2026 (WS1)

**Der Einstieg für den nächsten Chat.** Wer hier anfängt, braucht nichts anderes vorher zu lesen.

---

## Lies in dieser Reihenfolge

| # | Datei | Wozu |
|---|---|---|
| 1 | **dieses Blatt** | Was gilt, was offen ist, in welcher Reihenfolge |
| 2 | `docs/studio-v5/POST_MORTEM_v5.md` | **Die fünf Muster, die diese Nacht Runden gekostet haben.** Vor der ersten Änderung lesen. |
| 3 | `docs/studio-v5/SOP_kfb_ink_v1.md` | Tusche und Blasen: **48 Fallen, 10 Regeln, 4 Abnahmeblätter** |
| 4 | `docs/CHANGELOG_studio.md` | V5-S1…S7 mit allen Messzahlen (additiv, neuester oben) |
| 5 | `docs/studio-v5/HANDOVER_v6.md` | Die Vertragsfelder als Codeblock, Fallen ohne Vorwissen |

---

## Woran gebaut wird

`KFB Pet Studio v5.dc.html` — **v4 ist eingefroren** (Georgs Entscheidung), bleibt Vergleichsmaßstab.

```
studio-v5/pet-session.v1.js    ses-v1.0  Entwürfe · Vereinigung · Export/Import · 5 Prüffragen
studio-v5/pet-metrics.v1.js    met-v1.0  cubeH/radius/facePitch · Würfel+GLB · Kachel · behavior · Spec
studio-v5/bubble-shaper.v2.js  shp-v2.0  DER Blasen-Zeichner (paintBubble) + Shaper-Oberfläche
studio-v5/ground-plane.v1.js   gnd-v1.0  Platte · Schatten als Stempel · Boden-FX · Fußanker
studio-v3/kfb-pets.json        v1.2.7    der wiederhergestellte Vertrag, 24 Pets
```

**Messgriff:** `window.__STUDIO5` — `._selfTest()` · `._gazeProbe()` · `._gnd.report()` ·
`._shaper.info()` · `._bubInk.bb` · `._bubFont` · `._bubTight` · `._measures`

---

## Die zwölf Hausregeln (sieben davon in dieser Nacht bezahlt)

1. **Eine Zahl hat einen Eigentümer, alle anderen addieren.** Erklärt vier Fehler dieser Nacht.
2. **Ein Maß, eine Formel, an einer Stelle.** Dreimal derselbe Fehler (SOP F15/F25/F30).
3. **Zahlen aus dem Zeichner, Bilder für das Auge** — Prüfbilder immer mit Marken.
4. **Nach jedem Umbau die Konsole lesen**, nicht nur den Parser fragen.
5. **Der Standardzustand ist ein Prüffall.** Frisch laden, nichts anklicken, messen.
6. **Anteile am Bild abzählen**, nicht schätzen.
7. **Wenn etwas leer ist, ist die Ursache oben** — bei `renderVals()`, nicht im Layout.
8. Eine höhere Versionsnummer ist kein Beweis für mehr Inhalt (`leafCounts` ist die Gegenprobe).
9. Ein Export mit Filter ist ein Datenverlust mit Extraschritten.
10. Eine Formregel gehört in den normierten Raum, nicht in Bildschirmpixel.
11. Bewegung aus einer Bahn, Verformung aus ihrer Ableitung.
12. Über den echten Bedienweg testen, nicht über die API.

---

## Was entschieden ist

- **Der reichere Stand gewinnt, Feld für Feld** — nie stiller Verlust, ein Ausdünnen wird gemeldet.
- **Der Boden gehört der Zone, das Podest dem Pet.** Sechs Bodenplatten wären sechs Meinungen darüber,
  wo unten ist.
- **Die Kachel ist die Maßeinheit:** `scale = tile.edge × fill / cubeH` (2,0 · 60 %).
- **Der Schatten ist ein Stempel der echten Form**, Tusche als Standardfarbe, Versatz vorne/rechts.
- **Es gibt einen Blasen-Zeichner** (`paintBubble`), und er zeichnet auch den Satz.
- **Die Blase mißt sich am Pet** (Lettering ≈ 8,5 % der projizierten Figurenhöhe).
- **Perform ist tot**, `bubbles.v3.js` wird nicht geladen. Verbindlich ist `bubble-shapes.json`.
- **Oberfläche strikt EN**, Kommentare und Dokumente deutsch.
- **v4 eingefroren.**

---

## Offen, in Reihenfolge

**1 · `studio-v3/kfb-pets.json` v1.2.7 ins Repo**
(`media/3D_Assets/kfb-pets.json`). Solange dort 1.2.6 liegt, holt der nächste Fork die ausgedünnten
Pets zurück. Gegenprobe: im Raw-Link muss `"version": "1.2.7"` stehen.

**2 · Der Skalierungs-Fix in `studio-v3/pet-library.v6.js`**
(Wurzel vor dem Messen auf 1, gecachtes GLB). Geteiltes Modul, seit dem 24.8. offen.

**3 · SOP §4 ins Repo nachziehen**
`skills/SSOT_Card_Ink_Outline_v2.md` braucht ein **§11 für Kleinformate** (unter ~40 px deckt das Band
die Form zu — dort die Bandbreite direkt rechnen), `skills/kfb-embed-bundle v3/` die fünf Regeln plus
die Vertragsblöcke `voice.bubble` / `voice.typing` / `voice.focus`.

**4 · Eine Fassung von `pet-mouth.v1.js`**
Es gibt drei; nur die in `studio-v3/` kennt `MOUTH_SETS.red`. Genau die Naht, gegen die
`voice.bubble.pts` gebaut ist: ein Name ist eine Bitte, Punkte sind eine Ansage.

**5 · Flüstern feinjustieren** (SOP F21)
Der Schnitt läuft stur am Bogenmaß — eine Lücke kann die **Zipfelspitze** treffen, dann zeigt die
Blase auf nichts. Schutzzone um Zipfel und Ecken, Schnitt **verschieben** statt weglassen (sonst
Doppelstrich). Der Zeichner kennt beide Stellen schon (`tips[]`, Ecken-Flag).

**6 · Denkblase auf `paintBubble` heben**
Der letzte SVG-Zeichner. Braucht zuerst Anker für die Wolkenlappen.

**7 · Würfel-GLB abnehmen** und als Asset ins Repo, damit Kollision und Aussehen aus einer Quelle
kommen. Danach ist der **Frankensteining Builder** (Würfel + Augen-Rig + Mund, kein Tier darunter)
laut Georg »ein kleiner Schritt«.

**8 · »Full enchilada«-Pets für Podcast v4:** 2–6 Archetypen mit gefülltem `behavior`-Block.

**9 · Der leere `SCRIPT`-Fehler in der Konsole.** Kommt aus dem Dateikopf (Importmap plus
Inline-Modul, beide ohne `src`), unverändert aus v4 geerbt. Nichts lädt fehl.

---

## Was WS0 bekommt

`export/ws0-groundplane-bubbles_2026-08-25/` — Boden, Schatten und Blasen als eigenständiges Paket
mit den drei Modulen, den Verträgen und der Doku. Einstieg dort: `README.md` → `INTEGRATION.md`.
