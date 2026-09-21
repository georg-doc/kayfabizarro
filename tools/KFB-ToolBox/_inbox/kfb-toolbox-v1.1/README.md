# KFB ToolBox v1.1 — Wasser, Beam, Kartenstapel, Voxel-Welt, Seeds

Export vom 2026-09-21 · Absender Claude Design · **kein Push**, Integration macht der Web Lead.

Fünf Module, herausgelöst aus **KFB Card Zone Lab v2**, plus eine Bank, die vier davon wirklich
mountet und ihre gemessenen Zahlen ausweist.

> **v1.0.0 war ein Nachbau des Fluid-Shaders.** Schaum eingeschaltet, der in der Quelle tot ist;
> Repo-Texturen nicht geladen; Wanne mit falschem Material. Behoben in v1.1.0 — GLSL wortgleich,
> Texturen werden geladen, Wanne baut mit `kfb-box-material`.
> Aufarbeitung: `tools/KFB-ToolBox/POSTMORTEM_2026-09-21_SHADER.md`.

## Zuerst lesen

| Datei | Wofür |
|---|---|
| `tools/KFB-ToolBox/POSTMORTEM_2026-09-21_SHADER.md` | Was schiefging, Changelog, Naht, Beweis |
| `tools/KFB-ToolBox/HANDOVER.md` | Übergabe im Ehrlichkeitsformat, Messwerte, offene Punkte |
| `tools/KFB-ToolBox/CONTRACTS.md` | Was jedes Modul zusichert und verlangt |
| `tools/KFB-ToolBox/MODULE_MAP.md` | Welche Lab-Methode wurde zu welcher Moduldatei |
| `tools/KFB-ToolBox/INTEGRATION.md` | Ablage im Repo, Laden über jsDelivr, Reihenfolge |

## Sofort ansehen

`KFB ToolBox Bench.dc.html` im Browser öffnen, ein paar Sekunden warten. Unten links steht die
Messtafel. Vier Zeilen sind der Gesundheitstest:

| Zeile | muss zeigen |
|---|---|
| `wasser-texturen` | `dudv+map geladen` — sonst rendert ein anderer Shader-Pfad |
| `wannen-material` | `kfb-box-material` — sonst nicht der Lab-Pfad |
| `davon nass` / `wasser-quads` | gleiche Zahl |
| `ebene y (Δ)` | `-0.125` (= SUB · 0.25) |

Weicht etwas ab, ist der Einbau kaputt — nicht am Pixel korrigieren, die Grundlage prüfen.

Belegbilder: `screenshots/01-beweis.png` (Säure), `02` (Wasser), `03` (Aufsicht).

## Inhalt

```
KFB ToolBox Bench.dc.html      Beweis-Seite, mountet die Module per Import
kfb-box-material.js            Wannen-Material (kanonische Fassung liegt im Repo!)
support.js                     DC-Laufzeit (nur für die Bench)
screenshots/                   Belegbilder
tools/KFB-ToolBox/
  kfb-fluid-v1/    1.1.0       Wassergraben: Feld, Shader, Wanne, Fluss, Blasen
  kfb-beam-v1/     1.0.0       Holo-Schleier
  kfb-cardstack-v1/1.0.0       Deck, Aufdecken, Sky-Card       ← NOT_TESTED
  kfb-seeds-v1/    1.0.0       Karte → Welt
  kfb-voxel-world-v1/          Terrain v10 + Weltkontext (gespiegelt)
```

Keine Modelle, keine Animationsbibliotheken, keine Fonts, kein Audio. Die zwei Wassertexturen
(`waterdudv.jpg`, `water.jpg`) werden zur Laufzeit als SourceRef aus dem Repo geladen, nicht
mitgeliefert.
