# ToolBox · Schriften und Lesbarkeit

Status: Nutzerentscheidung + Umsetzungsspezifikation · 2026-09-14

## Feste Regel

**UI ist Bedienung, nicht Branding.** Kein Special Elite, Fonteys, Bangers, Pottymouth oder anderer dekorativer Brandfont in Tabs, Buttons, Formularen, Messwerten, Menüs, Tooltips, Fehlermeldungen oder Onboarding-Fließtext. Ausnahme sind ausdrücklich getrennte Gestaltungselemente wie Logos, Poster und Artwork.

## Referenzprofil für die Umsetzung

Normale Webfont: **Roboto**, Gewichte 400/500/700 nach tatsächlichem Bedarf. Fallback muss sofort funktionieren:

```css
:root {
  --font-ui: "Roboto", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.toolbox-ui { font-family: var(--font-ui); font-size: 16px; line-height: 1.45; }
.toolbox-ui :is(button, input, select, textarea) { font: inherit; }
.toolbox-ui .numeric { font-variant-numeric: tabular-nums; }
```

Dies ist eine Integrationsvorlage, kein behaupteter Patch der aktuellen Shadow-DOM-/DC-Styles. Selektoren an echte UI-Grenzen anpassen. Keine globale `* { font-family: ... !important; }`-Regel, die Wortmarken oder 3D-/SVG-Art verändert.

Für einen externen Webfont-Pfad kann die offizielle Google-Fonts-CSS-API mit `display=swap` genutzt werden. Wenn der Zielhost externe Fonts nicht lädt/zulässt, bleibt System-Sans voll nutzbar. Ein zugelassener eigener Webfont-Host kann später dieselbe Rolle erfüllen. Keine Fontdateien in dieses Handoff-Paket aufnehmen.

Technische Referenz: https://developers.google.com/fonts/docs/getting_started

## Was im gelieferten Export tatsächlich dokumentiert ist

`HOUSEKEEPING.md` meldet **17 fehlende lokale Schriftdateien**. Das ist eine Autorenangabe, keine hier unabhängig extrahierte Liste von 17 Namen. Die Datei nennt folgende Gruppen:

| Referenz aus Housekeeping | Für T1-UI | Möglicher Bedarf außerhalb UI |
|---|---|---|
| `fonts/FonteysPRO-*` | durch UI-Font ersetzen | Fonteys PRO nur auf bewusst gewünschten Text-/Artflächen |
| `GeorgComic-*` | ersetzen | persönliche Comic-/Illustrationsflächen |
| `Bangers-Regular.ttf` | ersetzen | optionaler Display-Text, nur mit verifiziertem Webfontpfad |
| `pottymouthbb_reg.otf` | ersetzen | bestehende Wortmarke/Poster, falls tatsächlich verwendet |
| `GeorgStorybook-*` | ersetzen | gestaltete Buch-/Posterflächen |
| `GeorgGelPen-Regular.otf` | ersetzen | gestaltete Handschriftflächen |

Die Gruppen sind keine vollständige Einzelfile-/Weight-Liste. Nur `fonts/FonteysPRO-*` ist im Quelltext dieses Befunds ausdrücklich mit diesem Verzeichnisprefix genannt. Keine erfundenen Dateinamen oder Schriftschnitte ergänzen.

## Was Georg gegebenenfalls ergänzen muss

**Für die ToolBox-UI: nichts.** Sie muss mit normaler Webfont bzw. System-Fallback funktionieren.

**Optional Fonteys PRO** (so heißt die Familie im Export, nicht „Fontey“): nur falls ein bestimmtes gestaltetes Element sie behalten soll. Erst im nächsten Source-Audit exakte verwendete Schnitte/Dateinamen und vorhandene Webnutzungsfreigabe bestimmen. Nicht vorsorglich alle 17 Dateien anfordern.

Weitere Georg-/Brand-Schriften ebenso nur bei konkret belegter Art-Nutzung. Vorhandene gebackene Logos, Bilder und Modelltexturen brauchen nicht automatisch die ursprüngliche Schriftdatei. Keine privaten/kommerziellen Fontdateien einfach ins öffentliche Repo kopieren. Der Implementierer meldet Bedarf/Referenzen, nicht Font-Binaries im Abgabe-ZIP.

## Geforderter Font-Audit und Browser-Test

`FONT_INVENTORY.json` beginnt als Quellenbefund. Der Produzent ergänzt pro tatsächlicher Referenz: Datei/Zeile oder Bundle-Resource-Key, Family, Weight/Style, Verwendung UI/Artwork, URL, geprüft geladen oder fehlend, Behandlung und Fallback.

Drei Tools prüfen: Kaltstart, längste Labels, Dropdowns, Inputs, 200 % Zoom, langsame/blockierte Fontquelle. UI darf keine gestalterische Schrift erben und muss ohne Fontnetzwerk lesbar/bedienbar bleiben. Art-Fallback oder fehlende optionale Schrift sichtbar dokumentieren; nicht als vollständig identisches Artwork ausgeben.
