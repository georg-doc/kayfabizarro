# Maßnahmen · was konkret gebaut wird, bevor wieder eine Szene entsteht

Ergänzt `META_ANALYSIS_FAIL_PATTERNS.md` um die ausführbare Form. Die Maßnahmen sind hier so
notiert, dass sie ohne weiteren Entwurf umsetzbar sind.

---

## M1 · Geometrie-Gate

Zwei Prüfungen, die jede gebaute Szene durchläuft. Ihre **Zahlen stehen im Bericht**, und ein
einziger Treffer verhindert die Abgabe.

```js
/* Durchdringung: paarweiser Box3-Schnitt über alle gesetzten Objekte.
   Erlaubt sind nur ausdrücklich benannte Paare (Auflieger auf Kachel, Deko auf Boden) —
   alles andere ist ein Treffer. Die Toleranz ist KEIN Stellrad: sie fängt die gemeinsame
   Kante zweier Nachbarkacheln, nicht ein Haus im Felsen. */
export function auditClearance(nodes, allow = () => false, tol = 0.02) {
  const boxes = nodes.map((n) => ({ n, b: new THREE.Box3().setFromObject(n) }));
  const hits = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (!a.b.intersectsBox(b.b)) continue;
      const o = a.b.clone().intersect(b.b).getSize(new THREE.Vector3());
      const vol = o.x * o.y * o.z;
      if (vol <= tol) continue;
      if (allow(a.n, b.n)) continue;
      hits.push({ a: a.n.userData.part?.base, b: b.n.userData.part?.base,
                  overlap: +vol.toFixed(3) });
    }
  }
  return { checked: boxes.length, hits, clean: hits.length === 0 };
}

/* Bodenkontakt: Strahl vom Objektfuß nach unten. Trifft er innerhalb der Toleranz nichts,
   schwebt das Objekt. Geprüft wird gegen die Bodenteile, nicht gegen alles — sonst steht
   ein Baum "auf" dem Haus daneben. */
export function auditGrounding(nodes, ground, tol = 0.05) {
  const ray = new THREE.Raycaster();
  const down = new THREE.Vector3(0, -1, 0);
  const floating = [];
  for (const n of nodes) {
    const b = new THREE.Box3().setFromObject(n);
    const foot = new THREE.Vector3((b.min.x + b.max.x) / 2, b.min.y + 0.01, (b.min.z + b.max.z) / 2);
    ray.set(foot, down);
    const hit = ray.intersectObjects(ground, true)[0];
    if (!hit || hit.distance > tol) {
      floating.push({ part: n.userData.part?.base, y: +b.min.y.toFixed(3),
                      gap: hit ? +hit.distance.toFixed(3) : null });
    }
  }
  return { checked: nodes.length, floating, clean: floating.length === 0 };
}
```

**Berichtszeile, verbindlich:**
`Durchdringung 0/47 · Schwebend 0/47` — und bei Treffern die Teilenamen, nicht nur die Zahl.

*Fängt F16 und F17. Hätte sie gefangen, bevor Georg das Bild sah.*

---

## M2 + M3 · Stückliste statt Generator, mit Begründungspflicht

Ein 1:1-Nachbau ist **Daten**, kein Code. Format:

```js
const SZENE = [
  { teil: 'hex_grass',          zelle: [1,1], y: 0,   winkel: 0,
    grund: 'Bodenkachel' },
  { teil: 'hex_grass_sloped_low', zelle: [1,2], y: 0, winkel: 300,
    grund: 'Zwischenstufe — trägt den Vorgarten, verbindet Wegkachel und Hauskachel' },
  { teil: 'stairs_stone',       zelle: [1,2], y: 0,   winkel: 300, versatz: [0, 0, 0.4],
    grund: 'Steintreppe von der Zwischenstufe zur Haustür — der zentrale Punkt der Vorlage' },
  { teil: 'building_home_A_blue', zelle: [1,1], y: 1, winkel: 180,
    grund: 'Tür zeigt zur Treppe' },
  { teil: 'detail_forestA',     zelle: [1,1], y: 1,   winkel: 150, versatz: [0.5, 0, 0.3],
    grund: 'Baumgruppe hinter dem Haus, Windseite — Rule of Three steckt im Teil' },
];
```

Regeln:

- **Eine Zeile je Objekt.** Schleifen nur für Wiederholung ohne Aussage (Kachelboden einer
  Fläche), nie für Objekte, die die Szene tragen.
- **`grund` ist Pflichtfeld** und wird im Bericht mit ausgegeben. Kein Grund → kein Objekt.
- »weil im Vorlagenbild dort eine Mühle steht« ist zulässig — es steht dann als Abpausen da
  und ist als solches erkennbar. Das ist besser als eine Schleife, die die Frage nie stellt.
- Ein **Generator** kommt erst, wenn ein Entwurf Abnahme hat und sich zeigt, dass mehrere
  davon gebraucht werden.

*Fängt F02, F09, F21 — dreimal derselbe Fehler in drei Slices.*

---

## M4 · Sample-Zerlegung mit Relationen

Erweitert G4 aus Post Mortem 03 um die Spalte, die fehlte. Vor dem ersten Bauteil, schriftlich:

| Objekt | Teil (Datei · Familie · Maß) | Rolle | **Relation** |
|---|---|---|---|
| Haus | `building_home_A_blue` · buildings/blue · 0,79 × 0,85 × 0,93 | steht darauf | Tür zeigt zur Treppe |
| Zwischenstufe | `hex_grass_sloped_low` · tiles/base · 2 × 2,31 × 1,5 | trägt | verbindet Wegniveau mit Hausniveau |
| Steintreppe | ? · ? · ? | liegt auf | führt von der Zwischenstufe zur Tür |
| Baumgruppe | `detail_forestA` · objects | steht darauf | hinter dem Haus, rahmt es |

Die Spalte **Relation** ist der Unterschied zwischen einer Teileliste und einer Szene. Sie war
in Post Mortem 03 nicht gefordert, und genau die Punkte, die sie beschreibt (F20, F21), sind
danach schiefgegangen.

Aus den drei Kamerawinkeln (G4/G5) wird jede Zeile einzeln belegt: die **Seitenansicht** zeigt,
was worauf steht; die **Draufsicht** zeigt, was woran grenzt.

---

## M5 · Slice-Zuschnitt

- Ein Slice hat **ein** Ergebnis, das fertig werden kann. Lieber eine Kachel mit Haus, Treppe
  und Vorgarten, die steht, als vier Kompositionen mit Befundliste.
- Lieferung ohne »offen: X, Y, Z« als Normalfall. Offene Punkte bleiben möglich, aber als
  benannte Ausnahme.
- **Kein neuer Slice ohne Abnahme des vorigen.** Fünf unfertige Artefakte nebeneinander sind
  schlechter als eines, das steht.

---

## M6 · Stop bei Wiederholung

Vor jedem neuen Versuch wird die **Fehlerklasse des letzten benannt**. Ist sie dieselbe, wird
nicht gebaut — es wird das Werkzeug gebaut, das sie mechanisch ausschließt.

Die Klassen dieses Sprints, als Prüfliste:

| Klasse | Erkennungszeichen | Werkzeug |
|---|---|---|
| **Vokabelsuche** | ein Regex auf `base`, den ich mir ausgedacht habe | Bilderbogen (G1), Suche nach Maß/Familie (G3) |
| **Formel statt Entwurf** | eine Schleife über Zelllisten setzt szenetragende Objekte | Stückliste (M2/M3) |
| **Blinde Messung** | der Bericht ist grün, das Bild ist kaputt | Geometrie-Gate (M1) |
| **Ungemessene Ursache** | »weil X« ohne Messung, dann in der Doku | G2, auch für Ursachen |
| **Lokaler Fix** | dritte Reparatur derselben Stelle | R4 — Wegwurf statt Reparatur |

---

## Reihenfolge der Umsetzung

1. **M1** zuerst — es ist der kleinste Eingriff mit der größten Wirkung und hätte die beiden
   Befunde gefangen, die zum Abbruch führten.
2. **M4** vor dem nächsten Nachbau — die Relationen-Zerlegung ist Textarbeit und braucht keine
   Zeile Code.
3. **M2/M3** beim nächsten Nachbau als Format.
4. **M5/M6** sind Arbeitsweise, nicht Code — sie gelten ab sofort.
