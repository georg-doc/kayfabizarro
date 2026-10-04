# Übergabepaket · Hex-Kanten-Atlas S1 · Fail und Analyse

**Stand** 20.09.2026 · **Status** Slice von Georg abgebrochen · **Empfänger** WSA / Web Lead

Dieses Paket enthält den vollständigen Stand eines abgebrochenen Slices, die Fehleranalyse
und die Maßnahmen. Es ist kein Fortschrittsbericht. Von vier Kompositionsaufgaben ist keine
abgenommen; die Messwerkzeuge tragen, die Szenen nicht.

---

## Lesereihenfolge

1. **`META_ANALYSIS_FAIL_PATTERNS.md`** — warum seit einer Woche kein produktiver Slice
   herauskommt. Chronologie, das Muster, vier strukturelle Ursachen, sechs Maßnahmen.
   *Das ist das Dokument, das zählt.*
2. **`POSTMORTEM_04_SCENE_FAIL.md`** — der Abbruch-Fail im Detail: acht Befunde in drei
   Klassen, und warum ein Bericht mit lauter grünen Zahlen danebenstand.
3. **`CHANGELOG_ADDITIVE.md`** — alle 24 Fehler des Sprints, chronologisch, additiv, jeder mit
   Maßnahme. Am Ende die Zählung: wer hat was gefunden.
4. **`MEASURES.md`** — die Maßnahmen in ausführbarer Form, inklusive Code für das
   Geometrie-Gate.
5. **`context/POSTMORTEM_GOLDEN_SAMPLES_2026-09-20.md`** — das vorangegangene Post Mortem
   (Vokabelsuche · Serviervorschlag-Irrtum, Guardrails G1–G7).

---

## Der Befund in vier Sätzen

Vier Anläufe, aus Teilen eine Szene zu bauen, vier Fails — immer dasselbe Muster: **ein
Verfahren gebaut, wo ein Entwurf gefordert war, und mit Zahlen geprüft, wo ein Blick gefordert
war.**

Meine Prüfungen meldeten in derselben Woche 20/20 erreichbare Saaten, 0 von 774 offenen
Rändern, 99,5 % Kantenquote und 54 Fugen ohne Fehlstelle. Alle diese Zahlen sind richtig.
Keine betraf das, woran die Arbeit scheiterte.

Elf Fehler fand Georg im Bild, sechs der Prüfer, vier eigene Messungen — alle vier in der
Sprungmechanik, **keiner im Bereich Gestalt.**

Vier falsche Aussagen über den Bestand sind in die Dokumentation gelangt und mussten von außen
korrigiert werden.

---

## Was trägt und was zu verwerfen ist

**Trägt** (geprüft, gegen eine bekannte Wahrheit geeicht):

| Artefakt | Beleg |
|---|---|
| Kantenmessung BT1 · `code/KFB_Hex_Edge_Atlas_S1/src/measure.js` | 32 Kacheln gegen `TILE_EDGES`: 99,5 % Kanten, 96,9 % Kacheln, eine offengelegte Abweichung. Drei Fassungen, jede gegen die Eichung geprüft |
| Kantentabelle `edge-atlas.json` (Schema /3) | 144 vorher ungedeckte Kacheln, pack-qualifiziert, Abdeckung ausgewiesen: 126 vollständig / 17 teilweise / 1 gar nicht |
| Teile-Bilderbogen · Bildschirm »Teile« | 447 Teile beider Packs als Bild, 16 Familien, mit Maßen. Das Werkzeug, das die Vokabelsuche beendet |
| Hex-Baukasten S0 · `code/KFB_Hex_Baukasten_S0/` | Bestand, Loader, Messung, Rollenzuordnung, Felsklassen aus dem Bestand abgeleitet |
| Nutzung von `hex-grid.js` ohne Nachbau | `buildNetwork`, `solveHexTile`, `auditTileFit`, `rotDeg` |

**Zu verwerfen, nicht zu reparieren** (Regel 4 aus `use-what-works`):

- `code/KFB_Hex_Edge_Atlas_S1/src/cases.js` — der Bildschirm »Bauvorgaben«. Vier
  parametrisierte Funktionen, wo vier Stücklisten hingehört hätten. Der Fehler sitzt in der
  Form, nicht in den Werten.
- `code/KFB_Babel_Hex_Generator_v1/src/tower.js` · `growBand()` — Random Walk als Bandform.
  Die Sprungprüfung daneben ist brauchbar und kann bleiben.

---

## Inhalt

```
META_ANALYSIS_FAIL_PATTERNS.md     die Ursachenanalyse
POSTMORTEM_04_SCENE_FAIL.md        der Abbruch-Fail
CHANGELOG_ADDITIVE.md              24 Fehler, additiv, mit Maßnahme
MEASURES.md                        M1–M6 ausführbar, mit Code für das Geometrie-Gate
README.md                          dieses Dokument

code/
  KFB_Hex_Edge_Atlas_S1/           index.html · src/{measure,app,cases}.js · README.md
  KFB_Hex_Baukasten_S0/            index.html · src/{sources,inventory,kit,generator,app}.js
  KFB_Babel_Hex_Generator_v1/      index.html · src/{tower,build,player,app}.js
  hexrealm/lib/hex-grid.js         Kanten-Donor (fremde Quelle, unverändert)

context/
  POSTMORTEM_GOLDEN_SAMPLES_2026-09-20.md   Post Mortem 03 mit G1–G7
  WORKFLOW.md                                Live/Stage/Work, Ehrlichkeitsformat
  github.md                                  Sync-Historie, Screen map

evidence/
  vorlage-nature-usage-guide.png   KayKit Nature Usage Guide — die Bauanleitung
  vorlage-inseln.png               KayKit Packbild 1 — die beiden Inselkompositionen
```

Nicht enthalten: **Modelle, Texturen, Fonts, Audio** (Projektregel 1). Alle Assets bleiben
GitHub-SourceRefs; die Pfade stehen in den Registry-Shards, die Ladelogik in
`code/KFB_Hex_Baukasten_S0/src/sources.js`.

Ausführen: die HTML-Dateien brauchen die Repo-Assets über `raw.githubusercontent.com` und
laufen deshalb nur online. `code/hexrealm/lib/hex-grid.js` liegt als Kopie zum Mitlesen bei —
kanonisch bleibt die Datei im Repo.

---

## Die vier Maßnahmen, die den Abbruch-Fail verhindert hätten

| | Maßnahme | Fängt |
|---|---|---|
| **M1** | Geometrie-Gate: Durchdringung und Bodenkontakt mechanisch, Zahlen im Bericht, ein Treffer verhindert die Abgabe | Haus im Felsen · Bäume in der Luft |
| **M2** | Stückliste statt Generator — ein 1:1-Nachbau ist Daten, kein Code | Windmühle ohne Anlass · Brücke ohne Ziel |
| **M3** | Begründungspflicht je Objekt, im Bericht ausgegeben | fehlendes Micro-Storytelling |
| **M4** | Sample-Zerlegung mit **Relationen**, nicht nur mit Maßen | die fehlende Vorgartensituation mit der Steintreppe |

`MEASURES.md` enthält M1 als fertigen Code und M2/M3 als Datenformat.

---

## Offene Entscheidung für Georg

Der nächste Slice sollte **eine einzige Kachel** sein: die »Decorate Tiles«-Kachel aus dem
Nature Usage Guide, vollständig — mit Zwischenstufe, Steintreppe, Vorgarten, Haus und
Baumgruppe. Als Stückliste nach M2/M3, vor dem Bau zur Durchsicht, mit Geometrie-Gate nach M1
und Drei-Winkel-Beleg.

Ein Bild, kein System. Und erst wenn das steht, das nächste.
