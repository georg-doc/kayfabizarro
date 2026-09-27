# media/public_domain · freier Asset-Pool

Alles hier ist für die interne Produktion ohne weitere Prüfung nutzbar. Geprüft wurde die
Quelle, nicht das einzelne Objekt; die Lizenz jedes Objekts wurde beim Laden bei der Quelle
abgefragt und steht in der `.license.json` daneben.

## Stufen

- **free** · CC0, Public Domain Mark, gemeinfrei. Keine Nennung nötig.
- **fallback-attribution** · CC BY (ohne SA/NC/ND). Nur verwenden, wenn es kein freies
  Asset für den Zweck gibt. Nennung erfolgt automatisch über `CREDITS.md` (Abspann, In-Game-Kudos).
- Alles andere kommt nicht hier hinein.

## Aufbau

```
media/public_domain/
  met/        The Met Open Access
  aic/        Art Institute of Chicago
  commons/    Wikimedia Commons (nur PD/CC0, CC BY als Fallback)
  ia/         Internet Archive (nur PD/CC0, CC BY als Fallback)
  <datei>.license.json   Beleg je Objekt (kfb.pd-item.v1)
  manifest.jsonl         alle Belege, erzeugt
  CREDITS.md             Nennungen, erzeugt
```

## Neu befüllen

Automatisch aus Suchbegriffen:

1. `python tools/public_domain/harvest.py tools/public_domain/seeds.json > pool-manifest.jsonl`
2. `python tools/public_domain/fetch_pool.py pool-manifest.jsonl`

Oder von Hand ausgewählt: in `KFB Public Domain Pool.dc.html` auswählen, `pool-manifest.jsonl`
exportieren, dann Schritt 2.

`manifest.jsonl` und `CREDITS.md` nie von Hand bearbeiten. Dateien über der Größengrenze
(Film 80 MB, Bild 15 MB, Audio 25 MB) werden nicht abgelegt, nur belegt: `<id>.ref.license.json`
mit Quell-URL und `"stored": false`.

## Grenzen

CC0 und Public Domain decken keine Marken, Logos und Persönlichkeitsrechte abgebildeter
Personen ab. Bei Internet Archive und Wikimedia Commons ist die Lizenzangabe die Erklärung
des Hochladenden; Objekte aus der IA-Sammlung `youtube` oder mit neuerem Datum als 1930 vor
öffentlicher Nutzung einmal ansehen.
