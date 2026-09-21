# Bootstrap-Paket · KFB Design-Workspace

Stand 10.09.2026. Das ist das **Fundament**, nicht eine Linie: die Regeln, die Übersicht, der
Wiederverwendungs-Index und die Gründungsdokumente. Gedacht zum lokalen Pflegen und Zurückspielen.

```
START_HIER.md         Regeln. Erste Datei für jeden frischen Chat.
PROJEKTE.md           Alle Linien mit Status und Ort.
MODULE.md             Was schon existiert. Jede Signatur aus dem Quelltext gelesen.
HOUSEKEEPING.md       Die Chronik, über 3000 Zeilen. Nachschlagewerk, kein Einstieg.
CLAUDE.md             Schreibweisen-Kanon (KayfaBINGO · KayfaBONGO · KayfaBOGGLE).
github.md             Repo-Bindung und Sync-Stand.
kfb-asset-library.json  11 859 Einträge mit fertiger url. 4,5 MB.
docs/gruendung/       Gründungsdokument, Handovers, Prompt Lab, Stunt-Car-Living.
```

---

## Wie das gepflegt wird

**Die drei oberen Blätter sind das Fundament und bleiben dünn.** Wenn eins wächst, ist das ein
Zeichen, dass Inhalt woandershin gehört:

| Blatt | Obergrenze | Was hineingehört | Was nicht |
|---|---|---|---|
| `START_HIER.md` | 250 Zeilen | Regeln, die für **alle** Linien gelten | Alles Linienspezifische |
| `PROJEKTE.md` | ein Absatz je Linie | Status, Ort, woraus man schöpft | Verlauf, Zahlen, Details |
| `MODULE.md` | so lang wie nötig | Nur gelesene Signaturen | Vermutungen |

**Der Verlauf gehört in `HOUSEKEEPING.md`, die Zahlen in das living document der Linie.** Das ist die
ganze Arbeitsteilung.

### Wann welches Blatt angefasst wird

- **Neue Linie angefangen** → Absatz in `PROJEKTE.md`, sonst nichts.
- **Modul gebaut, das eine zweite Linie brauchen könnte** → Zeile in `MODULE.md`, mit **gelesener**
  Signatur.
- **Regel durch einen Fehler gelernt** → `START_HIER.md`. Nur dorthin, und nur wenn sie wirklich für
  alles gilt.
- **Sitzung abgeschlossen** → `HOUSEKEEPING.md`, oben, additiv.

### Die eine Regel für `MODULE.md`

**Nur eintragen, was gelesen wurde.** Eine erfundene Signatur kostet mehr als ein fehlender Eintrag —
der nächste Chat baut darauf und findet den Fehler erst, wenn nichts läuft.

---

## Zurückspielen

Die Dateien einfach im Projekt ersetzen. Sie hängen nur über Verweise zusammen, nicht über Code.

**Der Ort, an dem das Fundament wirklich liegen sollte, ist das Repo** —
`georg-doc/kayfabizarro`, neben `skills/`. Dann liest jeder frische Chat es von dort, statt eine
Kopie im Projekt zu finden, die vielleicht älter ist. Genau diese Regel steht in `START_HIER.md` §6
über die Skills: **verwiesen, nicht kopiert, denn eine Kopie veraltet still.** Das gilt für dieses
Paket selbst.

---

## Was offen ist

**Lizenz und Quelle fehlen je Asset-Paket.** Ohne die ist `kfb-asset-library.json` ein Verzeichnis
und kein Manifest. Vier harte Böden gehören dazu: keine Lizenz heißt Vollschutz · nicht kommerziell
nutzbar · Copyleft · Raster nicht restlos teilbar. Das ist der einzige echte Mangel im Fundament.
