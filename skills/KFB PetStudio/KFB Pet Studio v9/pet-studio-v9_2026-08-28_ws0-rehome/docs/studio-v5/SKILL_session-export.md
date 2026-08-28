# Skill — Session-Export (KFB)

Wie ein Sitzungsschnitt entsteht, der ohne den Rest des Projekts läuft und den ein fremder Workspace
ohne Rückfragen lesen kann. Rezept, keine Theorie — dieser Ordner ist nach ihm gebaut.

---

## Wann

Am Ende einer Sitzung, in der ein vorzeigbarer Stand entstanden ist. **Nicht** am Ende jeder Runde:
ein Export, der nur den halben Slice trägt, kostet mehr Vertrauen als er spart.

---

## Die sechs Schritte

### 1 · Abhängigkeiten messen, nicht raten

```js
const s = await readFile('<Laufstand>.dc.html');
for (const m of s.matchAll(/['"`](\.\/[^'"`\s]+\.(?:js|json))['"`]/g)) refs.add(m[1]);
for (const m of s.matchAll(/from\s+'([^']+\.js)'/g)) refs.add(m[1]);
```

Dann **jedes gefundene Modul** noch einmal so lesen — Module haben Familien. Der Blasen-Zeichner
zieht `bubbles.v4.js`, `bubbles.v5.js` und `kfb-ink-canon.js` nach; wer nur die erste Ebene kopiert,
exportiert einen Stand, der beim Öffnen scheitert.

### 2 · Kopieren, dann NACHZIEHEN

Der Export wird meist mitten in der Arbeit angelegt und danach noch dreimal geändert. Vor dem
Abschluss die geänderten Dateien **erneut** hineinschreiben. Wer das vergisst, verschickt einen Stand,
den es nie gab.

### 3 · README = die Reihenfolge, nicht der Inhalt

Kein Feature-Katalog. Vier Zeilen: **wie öffnen · was zuerst lesen · was hier liegt · was zuerst ins
Repo muss.** Der Inhalt steht in den Dokumenten, auf die es zeigt.

### 4 · HANDOVER = die Fallen, nicht die Erfolge

Der wertvollste Teil eines Schnitts ist die Liste der Fehler, die man ohne Vorwissen wieder macht.
Aufbau, der sich bewährt hat:

1. **Die eine Regel**, die mehrere Fehler dieser Sitzung erklärt.
2. **Fünf Fallen** mit Symptom und Ursache, jede in drei Sätzen.
3. **Was offen ist, in Reihenfolge** — nummeriert, nicht als Wunschliste.
4. **Was der Vertrag trägt** als Codeblock: Feldnamen sind die Schnittstelle.
5–6. Die Rechnungen, die man sonst neu erfindet (Maßstab, Ruhehöhen, Kennzahlen).

### 5 · Jede Behauptung mit einer Zahl

»Läuft flüssiger« ist kein Befund. `rect 11 → 7 Punkte`, `Feder 4,6 → 2,3 px`, `Sohle 0,00400,
Spanne 0,000 über acht Messungen` sind Befunde. Wo nichts gemessen wurde, steht **»— (nicht
gemessen)«** und keine Zahl.

### 6 · Messgriff mitgeben

Ein globaler Griff auf den laufenden Stand (`window.__STUDIO5`) und die Liste der Sonden im README.
Ohne ihn prüft der nächste Workspace über Screenshots — und Screenshots lügen über Standardzustände
(siehe HANDOVER §2, Falle 4).

---

## Was NICHT in den Export gehört

- **Beschädigte Daten als Datei ohne Kennzeichnung.** Die kaputte Fassung darf mit, aber mit
  `-verlust` im Namen und einem Satz im README, dass sie Beweisstück ist und nie Quelle.
- **Screenshots als Beleg.** Sie zeigen, was der Autor angeklickt hat, nicht was der Nutzer sieht.
  Zahlen statt Bilder; Bilder nur für Look-Entscheidungen.
- **Ein Changelog, der etwas behauptet, was der Code nicht tut.** Der teuerste Fehler der
  v5.1-Nacht. Additiv führen: ein falscher Befund wird durch einen **neuen** Eintrag korrigiert,
  nicht überschrieben.
- **Große Binärdateien**, die zur Laufzeit aus dem Repo kommen. GLB, Texturen und Deck-PDFs bleiben
  draußen — der Export bleibt lesbar.

---

## Abnahmeblatt für den Export selbst

- [ ] Ordner geöffnet, Studio startet, **keine** fehlende Datei in der Konsole.
- [ ] Jede Datei aus dem Abhängigkeits-Scan liegt drin (zwei Ebenen tief geprüft).
- [ ] Die im Export liegenden Dateien sind die **aktuellen** (nach dem letzten Umbau nachgezogen).
- [ ] README zeigt auf HANDOVER, HANDOVER auf die Reihenfolge des Offenen.
- [ ] Jede Zahl im HANDOVER ist gemessen; keine Zahl ohne Herkunft.
- [ ] Beschädigte Daten sind als solche benannt.
- [ ] Der Messgriff steht im README und funktioniert.

---

## Danach: HOUSEKEEPING und CLAUDE.md

Ein Export, von dem nur der Export weiß, ist kein Schnitt. Zwei Stellen im Projekt nachziehen:

- **`HOUSEKEEPING.md`** — Tabelle der Deliverables mit Status (`AKTIV` · `FROZEN` · `DEAD` ·
  `BEWEISSTÜCK`) und den drei Dingen, die nicht warten können, ganz oben.
- **`CLAUDE.md`** — der neue Stand als *erster* Abschnitt, der vorige rutscht auf »Vorgänger«.
  Vier Absätze: woran gebaut wird, der Kern der Sitzung, die Regel dahinter, was als Nächstes kommt.

**Der Einstieg steht in genau einer Datei.** Wenn zwei Dokumente behaupten, der Einstieg zu sein,
liest der nächste Workspace beide halb.
