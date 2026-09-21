# Re-Home · Recherchi v4 + Art-Eintrag für Pet Studio v10

**Paket:** `recherchi-v4_2026-08-29_rehome` · **Stand:** 29.08.2026 · **Fassung 2**
**Zweck:** Recherchi v4 an einem zweiten Arbeitsplatz aufsetzen — und ihn als **Bewohner von Pet
Studio** vorbereiten: Körper, **Beine**, Licht, Kamera und Regler kommen aus dem Studio. Recherchi
bringt **drei Bauteile** mit: die HTML-Flächen, die Chat-Eingabe (`face.input`) und die Nase als
Knopf (`face.button`).

---

## In dieser Reihenfolge

1. **`docs/SPEC_recherchi-modul_v1.md`** — Eigentum je Kanal, die zwei Bauteile, die drei Wege zu
   Studio-Beinen, und §7: warum Fassung 1 falsch war.
2. **`contracts/recherchi.pet.json`** — der Art-Eintrag. Entwurf zur Aufnahme in die kanonische
   `pet-LIBRARY.json` 0.4.3. **Nicht einspielen, ohne `version` zu zählen und `updated` zu setzen.**
3. **`Recherchi Modul SESSION_LIVING.standalone.html`** — ein Doppelklick, kein Server: das Living
   Document mit Eigentumstabelle, Art-Eintrag und dem Anekdote-Kasten.
4. **`Recherchi v4.standalone.html`** — die Anwendung zum Ansehen (960 KB).
5. **`Recherchi v4.dc.html`** — die Arbeitsdatei. Über einen **lokalen Server** öffnen
   (`python3 -m http.server 8000`); `recherchi-cube.js` lädt three und den HTML-in-Canvas-Polyfill
   über eine Importmap, und der Polyfill ist ein ES-Modul — unter `file://` scheitert das an CORS.

**`modules/` ist die Anekdote, nicht der Baustein.** Siehe unten.

---

## Was dieses Paket liefert

| Datei | Rolle |
|---|---|
| `contracts/recherchi.pet.json` | **Art-Eintrag.** `id: recherchi`, `glb: null`, `body: html-cube`, `skin: html-faces`, Augen-Ankerlage aus dem gemessenen Gesicht. Drei neue Werte mit Begründung, vier offene Fragen |
| `docs/SPEC_recherchi-modul_v1.md` | **Die Spezifikation.** Eigentumsvertrag, HTML-Flächen, `face.input`, drei Wege zu den Beinen, Anekdote |
| `Recherchi Modul SESSION_LIVING.*` | **Living Document.** Was gilt, in einem Bild |
| `Recherchi v4.dc.html` + Module + `support.js` | die Anwendung, **unverändert** aus dem Arbeitsplatz |
| `modules/recherchi-legs.*`, `modules/recherchi-legs-bench.html` | **ANEKDOTE.** Nicht einbauen |

---

## Die eine offene Entscheidung

Bei den 24 Cube-Pets stecken **Beingeometrie und Gang im GLB** — acht Clips je Pet
(`static, idle, walk, run, eat, dance, gesture-positive, gesture-negative`), Node-Animation, nicht
skinned. Recherchi hat kein GLB.

| Weg | Kosten | Urteil |
|---|---|---|
| **(a) Spender-GLB** — ein vorhandenes Cube-Pet liefert Beine + Clips, Rumpf wird der HTML-Würfel | kein neues Asset | **für den ersten Lauf** |
| **(b) Eigenes GLB** — Beine und Clips für Recherchi, gleiche Node-Namen wie die 24 | ein Asset ins Repo | **das Ziel** |
| **(c) Prozedurale Beine im Wirt** — `PetMotion` bekommt ein Bein-Bauteil für körperlose Arten | teuerste Variante | **zuletzt** |

Ohne diese Entscheidung ist der Art-Eintrag nicht vollständig. Sie gehört ins Studio, wo der Vertrag
wohnt, nicht in eine Recherchi-Sitzung.

---

## Die Anekdote in `modules/`

`recherchi-legs.v1.js` + `.mjs` + Werkbank sind ein **eigenes SVG-Bein-Modul** aus Fassung 1. Es
läuft (Fußschlupf 0,00 px, Werkbank mit Reglern) und ist trotzdem falsch:

1. **Falsche Frage** — die Beine kommen aus dem Studio.
2. **Vertragsbruch** — Körper und Bewegung gehören `PetMotion` (`pet-puppet.v1.js`, §Eigentum).
3. **Animationsregeln missachtet** — kein Anticipation-Frame, keine Kaskade
   (Augen → Kopf → Körper → Root), keine ballistischen Bögen, keine Feder-Dämpfer-Physik. Alles
   Dinge, die `recherchi-motion.js` (BRIEFING-03) und das Studio bereits gelöst haben.

Aufbewahrt als Beleg, wie schnell ein lauffähiges Ergebnis in die falsche Richtung zeigt, wenn es an
keinem Vertrag hängt. **Nicht weiterentwickeln, nicht in v5 einbauen, nicht in die Bibliothek
eintragen.** Der Stempel steht im Datei-Header.

---

## Ladeweg

`LADEWEG.tsv` führt jede Datei mit **Pfad · Bytes · sha256-16**. Prüfung am Zielarbeitsplatz: Zahlen
vergleichen, nicht Anwesenheit abhaken (R1 — *ein Import-Check prüft Gleichheit, nie Anwesenheit*).

```
Recherchi v4.dc.html
 ├ support.js
 ├ recherchi-data.js
 ├ recherchi-cube.js        → three@0.185.1 (unpkg), three-html-render/polyfill (jsdelivr)
 ├ recherchi-eyes.js
 ├ recherchi-motion.js
 └ assets/doccheck-doc.png  ← relativer Pfad, Fix-Kandidat
```

Keine Datei über 2 MB. Kein Video, kein Ton, keine Schrift im Paket — Recherchi zieht Roboto aus
Google Fonts und sonst nichts.

---

## Fix-Kandidaten (benannt, nicht ausgeführt)

1. **`assets/doccheck-doc.png` hängt an einem relativen Pfad** (`Recherchi v4.dc.html`, Zeile 52).
   Im Paket liegt die Datei daneben, also lädt sie hier; sauber ist die RAW-URL aus dem Repo.
2. **Drei Laufzeitquellen aus dem Netz** (unpkg three + addons, jsdelivr Polyfill). Ohne Netz fällt
   Recherchi auf die flache Darstellung zurück — gewollt und geprüft, aber nicht im Paket.
3. **`recherchi-cube.js`, `-eyes.js`, `-motion.js` haben keinen Vertrags-Docblock.** Die Umstellung
   sieht Modulvertrag §6 als zweiten Schritt vor — nicht in dieser Runde.

---

## Clean-Run (fünf Minuten)

1. `contracts/recherchi.pet.json` öffnen, `_offen`-Block lesen. Erwartet: vier Fragen, die erste ist
   die Beine-Entscheidung.
2. `Recherchi Modul SESSION_LIVING.standalone.html` doppelklicken. Erwartet: Eigentumstabelle mit
   drei grün markierten Zeilen (`html-faces`, `face.input`, `face.button`), drei Wege, Art-Eintrag, Anekdote-Kasten.
3. `Recherchi v4.dc.html` über den lokalen Server öffnen. Erwartet: Startbildschirm, Knopf
   »Apportieren!«, danach Scan und Themenkacheln. Konsole ohne Fehler.
4. Würfel drehen, Chat-Fläche antippen und tippen. Erwartet: Eingabe funktioniert auch auf der
   gedrehten Fläche — das ist die Naht, um die es in v10 geht.
5. `modules/recherchi-legs-bench.html` nur öffnen, wenn du die Anekdote sehen willst.

---

## Zwei Dinge nicht anfassen

- **`support.js` ist eine bewusst gepinnte ältere Runtime.** Die Komponenten sind dagegen
  geschrieben.
- **Der Entwurfsrahmen von 470 px in `recherchi-cube.js`** (`.rc-des`, `_desFit`). Jede Zahl im
  Flächen-HTML rechnet dagegen. Wer ihn auflöst, bekommt ein verzerrtes Gesicht und Augen auf der
  Fase — zweimal bezahlt.
