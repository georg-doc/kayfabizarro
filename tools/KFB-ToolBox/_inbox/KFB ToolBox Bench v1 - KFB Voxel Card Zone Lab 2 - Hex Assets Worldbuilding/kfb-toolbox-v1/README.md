# KFB ToolBox v1 — Wasser, Beam, Kartenstapel, Voxel-Welt, Seeds

Export vom 2026-09-21 · Absender Claude Design · **kein Push**, Integration macht der Web Lead.

Fünf Module, herausgelöst aus **KFB Card Zone Lab v2**, plus eine Bank, die vier davon wirklich
mountet und ihre gemessenen Zahlen ausweist.

## Zuerst lesen

| Datei | Wofür |
|---|---|
| `tools/KFB-ToolBox/HANDOVER.md` | Übergabe im Ehrlichkeitsformat, Messwerte, offene Punkte |
| `tools/KFB-ToolBox/CONTRACTS.md` | Was jedes Modul zusichert und verlangt |
| `tools/KFB-ToolBox/MODULE_MAP.md` | Welche Lab-Methode wurde zu welcher Moduldatei |
| `tools/KFB-ToolBox/INTEGRATION.md` | Ablage im Repo, Laden über jsDelivr, Reihenfolge |

## Sofort ansehen

`KFB ToolBox Bench.dc.html` im Browser öffnen. Unten links steht die Messtafel. Zwei Zahlen
sind der Gesundheitstest:

- **davon nass** und **wasser-quads** müssen gleich sein.
- **ebene y (Δ)** muss −0.125 zeigen (= SUB · 0.25).

Weichen sie ab, ist der Einbau kaputt — nicht am Pixel korrigieren, die Grundlage prüfen.

## Inhalt

```
KFB ToolBox Bench.dc.html      Beweis-Seite, mountet die Module per Import
support.js                     DC-Laufzeit (nur für die Bench)
tools/KFB-ToolBox/
  kfb-fluid-v1/                Wassergraben: Feld, Shader, Wanne, Fluss, Blasen
  kfb-beam-v1/                 Holo-Schleier
  kfb-cardstack-v1/            Deck, Aufdecken, Sky-Card       ← NOT_TESTED
  kfb-seeds-v1/                Karte → Welt
  kfb-voxel-world-v1/          Terrain v10 + Weltkontext (gespiegelt)
```

Keine Modelle, keine Animationsbibliotheken, keine Fonts, kein Audio. Die zwei Wassertexturen
sind SourceRefs ins Repo, keine Kopien.
