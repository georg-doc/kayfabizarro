# KFB Overworld — Export V10-S25 · 10. August 2026

**Das ist der Fork-Punkt für WS0. Er ersetzt `overworld-v10-S22_2026-08-10/`.**

Läuft ohne den Rest des Projekts. Alle Bytes zur Laufzeit über pages.dev.

## Warum nicht S22

S22 war zugesagt, aber nie geliefert (Befund WS0, `docs/UPDATE_WS0_2026-08-10.md` §0) — und ist
inzwischen selbst überholt. Wer S22 forkt, forkt gegen `STAT_INFO` **ohne** `short`-Feld und mit den
alten Etiketten `Bingo/Bongo/Boggle`. Das Rail würde gegen Namen bauen, die es hier nicht mehr gibt.

**Dazwischen liegen vier Slices und die A1-Terminologie:**

| | |
|---|---|
| **S23** | Dritter Sprecher — These · Antithese · Synthese über drei Mobs, `chatId`, eine Kette = ein Budget-Eintrag |
| **S24** | `loadZoneCard()` aus dem Zeichenpfad in `step()` — höchstens eine Ladung je Sekunde |
| **S25** | **A1 geschlossen:** drei Ebenen je Begriff, `short` als eigenes Feld, beide kompakten Flächen lesen es |

## Was ihr zuerst lest

1. **`docs/GLOSSAR_KFB.md`** — die eine Begriffstabelle. Neu und ab jetzt Kanon (Masterplan K8).
   Jeder Begriff hat **ID · Label · Short · Quelle**. Wer einen Begriff ändert, ändert ihn dort.
2. **`docs/UPDATE_WS0_2026-08-10.md`** — die Reihenfolge (W6 → W3 → W4 → W5 → W1 → W2) mit
   Lieferstatus, und die Schnittstellen in §4.
3. **`docs/MASTERPLAN_overworld.md`** — Kanon K1–K8, §2.1 A1-Auflösung, Entscheidungs-Log.
4. `docs/CHANGELOG_overworld.md` — S25 oben, additiv.

## Der Vertrag, der sich seit S22 geändert hat

```text
ID (Code)     Label (Kanon)     Short (HUD)
bizarro       Bizarro           Biz
kayfabe       Kayfabe           Kay
bingo         KayfaBingo        Bin
bongo         KayfaBongo        Bon
boggle        KayfaBoggle       Bog
bloedsinn     BLÖDSINN!         Blö
```

**Für das Rail heißt das genau eine Sache:** `card-rail-v9b.js` lag in zwei Fassungen vor, eine mit
`id:'bongo'`, eine mit `id:'kayfabongo'`. Gültig ist `bongo`. Greift das Rail mit `kayfabongo` in
`popSpend('stat',key)`, findet der Runner den Wert nicht und der Kauf fällt **still** aus.

Das Etikett im Bild darf `KayfaBongo` heißen. Die Kennung nicht.

## Drei Fallen, die diese Woche bezahlt wurden

1. **Ein Etikett zu ändern, das jemand anders zerschneidet, ist keine Textkorrektur.** Das HUD-Kürzel
   war `name.slice(0,3)`. Mit den kanonischen Etiketten hätte das `Kay · Kay · Kay` geliefert — vier
   identische Kürzel in einem Panel mit sechs Zahlen, ohne eine einzige Fehlermeldung.
2. **Wer ein Etikett ändert, muß jede Fläche prüfen, die es setzt.** Der Runner hat neben dem
   v7-HUD ein zweites, kompaktes Panel. Es setzte die vollen Namen und schnitt sie ab.
3. **Ein Kommentar in einem Template-Literal ist kein Kommentar, sondern Inhalt.** `hud-v7.js` baut
   sein Stylesheet als `` ` ``-String. Ein Backtick im Kommentar beendet ihn, und das gesamte
   Papier-HUD fällt aus. Codenamen stehen in dieser Datei deshalb in »…«.

## Inhalt

`overworld/` 60 Dateien (Runner, HUD, Module, Fonts, Kartenrückseiten) · `docs/` 28 · `cardbuilder/` 2
· `skills/` 1 · vier `.dc.html` · `support.js` · Standalone-HTML.

`KFB Pet Studio v4.dc.html` liegt **hier drin**, nicht in `export/fuer-WS0/` — das war der zweite
Blocker aus §0. Es ist das Augen-Rig für W2.

## Abnahme — gemessen am 10.8., nicht behauptet

Standalone im Leerlauf geöffnet, Konsole gezählt (`docs/EXPORT_PRUEFLISTE.md`):

**39/39 Module · 0 Fehler · 3 Warnungen.**

Der eine Fehler, den S22 hatte, ist weg — und er war größer, als er aussah. Drei Module lösten
Nachbardateien mit `new URL(pfad, location.href)` auf. Im Standalone ist `location.href` eine
`blob:`-Adresse, und `blob:` ist ein opakes Schema ohne Pfad: der Aufruf **wirft**. Folge: die
Tusche des HUD kam im Auslieferungszustand gar nicht (`loadInk`, unbehandelte Zurückweisung) —
im Projekt lief alles, weil dort eine echte Seite geladen ist. **Der Fehler war nur in genau der
Datei sichtbar, die ihr in die Hand bekommt.** Jetzt löst `OW_SRC.rel(pfad, nähe, repoPfad)` auf
und fällt auf das Repo zurück, statt zu werfen. Beleg in der Konsole: `[hud-v7] Kanon:
kfb-ink-canon.js · opt ja` — diese Zeile stand in S22 nicht.

**Die drei Warnungen bleiben, alle drei älter als dieser Export:**

| Warnung | Was fehlt | Folge |
|---|---|---|
| `prop-sheet sheet-02` | `media/2D_Assets/KFB_Props/sheet-02.png` nicht im Repo | ein Requisitenblatt weniger |
| `card-grids.json` | liegt im Projekt, **nicht** auf pages.dev | Kartenraster für `forget_utopia` ist der geratene Rückfallwert |
| `drop_002.ogg` | Datei lässt sich nicht dekodieren | ein Klang fehlt |

Keine davon ist eine Auflösung mehr — es sind fehlende Bytes. Sie zu schließen heißt, drei Dateien
ins Repo zu legen, nicht Code zu ändern.
