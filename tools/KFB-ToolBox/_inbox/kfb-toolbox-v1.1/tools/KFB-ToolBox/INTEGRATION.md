# ToolBox · Einbau ins Repo

Ziel: `georg-doc/kayfabizarro`, Branch `main`.

## Ablage

```
tools/KFB-ToolBox/
  kfb-fluid-v1/
  kfb-beam-v1/
  kfb-cardstack-v1/
  kfb-seeds-v1/
  kfb-voxel-world-v1/
  HANDOVER.md  MODULE_MAP.md  CONTRACTS.md  INTEGRATION.md
```

Das liegt neben `tools/KFB-ToolBox/kfb-rigs-embed-v3/` und folgt derselben Konvention:
ein Ordner je Modul, Version im Ordnernamen, README daneben.

Die Bank (`KFB ToolBox Bench.dc.html`) gehört **nicht** in `tools/` — sie ist ein Beweis, kein
Werkzeug. Vorschlag: `skills/chat/workflows/KFB_TOOLBOX_v1_20260921/` zusammen
mit dieser Übergabe, oder als Anhang am Ticket.

## Laden

**Module über jsDelivr, Daten über raw** (KFB-Regel 2). raw liefert JS als `text/plain`; als
Modul geladen ergibt das einen schwarzen Bildschirm.

```js
const TB = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@<COMMIT>/tools/KFB-ToolBox/';
const { mountFluidSystem } = await import(TB + 'kfb-fluid-v1/index.js');
```

`<COMMIT>` ist ein Pin, kein Branch. `@main` ist für Tests in Ordnung, für Lieferungen nicht.

## Texturen bleiben SourceRefs

```
media/3D_Assets/KFB/waterdudv.jpg
media/3D_Assets/KFB/water.jpg
```

Über raw laden (Daten, nicht Modul), mit Commit-Pin. Nicht ins Modulverzeichnis kopieren.

## Reihenfolge beim Einbau

1. `kfb-voxel-world-v1` ist ein Spiegel von `terrain-v10/`. Liegt im Repo schon eine
   kanonische Fassung, **die** benutzen und den Spiegel löschen — nicht zwei Terrains führen.
2. `kfb-fluid-v1` zuerst einbauen, weil es die einzige Abhängigkeit zum Terrain hat.
3. `kfb-beam-v1` und `kfb-seeds-v1` sind unabhängig, jederzeit.
4. `kfb-cardstack-v1` zuletzt, nach dem Gegentest im Lab.

## Was nicht mitgeliefert wird

Keine Modelle, keine Animationsbibliotheken, keine Fonts, kein Audio. Die Module fordern keine
an; die Bank lädt nur three.js von unpkg und zwei Google-Fonts für ihre eigene Oberfläche.
