---
name: session-export
description: >
  Schlanker Session-Export plus Housekeeping fuer Design-Chats (DC / Canvas). Trigger auf
  /session-export, "exportier mir die Session", "mach mir den Export", "session export",
  "checkin export", "housekeeping export". Immer triggern, BEVOR ein Chat ein Projekt-Zip
  oder einen Download baut. Ersetzt den Voll-Projekt-Export durch ein Manifest, ein Veto-Fenster,
  ein living HOUSEKEEPING.md und einen Export nur der in dieser Session gebauten Dateien.
  Georg will nie wieder ein 330-MB-Zip.
---

# Session-Export plus Housekeeping

Bevor du irgendetwas exportierst: **kein Gesamt-Projekt-Zip.** Georg will nur das, was in genau
dieser Session am Canvas gebaut, geaendert und eingecheckt wurde. Der Rest des Projekts bleibt drin,
wo er ist.

Arbeite die Schritte der Reihe nach ab. Halte nach Schritt 1 an und warte auf Georgs Okay, bevor du
zippst. Fuehre nie einen Loeschvorgang ohne seine ausdrueckliche Freigabe aus, jeden Schritt einzeln.

## 1 Manifest zuerst

Liste, was diese Session neu entstanden oder geaendert wurde, getrennt nach:

- **(a) Deliverables:** die `.dc.html` plus zugehoerige `.js` und Module.
- **(b) Contract- und Daten-Dateien:** JSON, Registries, Index-Dateien.
- **(c) Docs:** Ist-Stand, Handover, Onboarding, Changelog.
- **(d) Abnahme-Captures:** die Screenshots, mit denen der Stand belegt wurde.

Alles andere im Projekt bleibt draussen. Zeig Georg das Manifest und **warte auf sein Okay**, bevor
du zu Schritt 4 gehst. Dieses Veto-Fenster ist Pflicht, nicht Hoeflichkeit.

## 2 Housekeeping nachziehen

Fuehre ein living `HOUSEKEEPING.md` mit einem Status je Artefakt:

`AKTIV` · `FROZEN` · `SUPERSEDED` · `DEAD` · `ASSET`

Die neue Version wird `AKTIV`, ihr Vorgaenger `SUPERSEDED`. Geteilte Module (von mehreren
Deliverables importiert) werden als geteilt geflaggt, damit sie niemand versehentlich als tot
einstuft. Aktualisiere die Clean-Run-Checkliste. Loesche nichts ohne Georgs Sign-off.

## 3 Cleanup nur benennen, nicht ausfuehren

Zeig die Aufraeum-Kandidaten als Liste mit Empfehlung, aber fuehre nichts aus:

- superseded Versionen,
- verarbeitete Feedback-Bilder,
- schwere lokale Binaries, die per URL gehoeren.

Loeschen oder Verschieben erst nach ausdruecklicher Freigabe, jeder Schritt einzeln bestaetigt.

## 4 Export nur der Manifest-Dateien

Exportiere ausschliesslich die Dateien aus Schritt 1: der Ordner mit den Deliverables plus `docs/`
plus die Contract-Dateien. **Ein Download, nicht das ganze Projekt.**

**Groessen-Budget, hart:** keine Datei ueber 2 MB im Export. Alles Schwere (PDFs, GLBs, Skydomes,
Texturen, Screenshots) wird zur Laufzeit per RAW-URL geladen, nie eingebettet. Ist eine schwere Datei
noch nicht im Repo, nenn sie in Schritt 3 als Upload-Kandidat, statt sie ins Zip zu packen.

## 5 Contract-Hygiene

Wenn eine geteilte Daten- oder Contract-Datei geschrieben wurde:

- `version` Patch hoch,
- `updated` = heute,
- `canonical` nie verlieren,
- alle lokalen Kopien synchron zur kanonischen Fassung.

## 6 Pfad-Hygiene (der stille Killer)

Pruefe jeden Asset-Pfad im Code. **Jeder Asset laeuft ueber die kanonische RAW-URL, nie ueber
`./assets/...`.** Ein relativer Pfad funktioniert im Chat-Vorschau-Kontext, aber der Standalone-Export
hat kein `./assets/` neben sich, also laedt dort nichts und der Screen bleibt leer oder schwarz. Nenn
jeden relativen Asset-Pfad, den du findest, als Fix-Kandidat.

---

*Prinzip: ein schlanker Export, ein ehrliches Manifest, kein Loeschen ohne Freigabe. Der Ballast
bleibt auf Georgs Platte nur, wenn er es entscheidet, nicht weil ein Chat faul war.*
