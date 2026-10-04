# ONBOARDING · frischer Chat · Knetwelt-Linie (Claymation)

Für einen neuen Chat in diesem Projekt, der die Claymation-Linie weiterführt. Lesezeit fünf Minuten.

## Lesefolge

1. Dieses Blatt.
2. `LIVING_CLAY.md` — Stand je Scheibe, Entscheidungen, Offen, Next Gate.
3. `CLAUDE.md` — Arbeitsregeln des Projekts (gemessen statt geraten, `.vN.js`, nur Pixelaufnahmen).
4. `HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md` — nur den Abschnitt, den die Aufgabe braucht.
5. `CHANGELOG.md` — **nur die obersten zwei Einträge.** Nie ganz lesen (über 700 Zeilen).

Nicht lesen, außer auf Nachfrage: `HOUSEKEEPING.md`, ältere `HANDOVER_*`, `ONBOARDING_frischer_chat*.md`
anderer Linien, `LIVING_RIGGING.md`, `LIVING_VEHICLES.md`.

## Einstiege

| Datei | zeigt |
|---|---|
| `KFB Hirnwelt H0.dc.html` | Knet-Hirn als Welt, Straßen, Figuren, Autos |
| `KFB Knet-Probe D1.dc.html` | die drei Schichten des Looks einzeln schaltbar |
| `KFB Knet-Medizin M0.dc.html` | Molekül, Herz, Erythrozyt im Knet-Material |
| `KFB Knetwelt Look-Konzept.dc.html` | Recherche und Entscheidungen zum Look |

## Arbeitsweise, die sich bewährt hat

- **Microservices:** jedes Verfahren ist ein eigenes Modul mit klarer Schnittstelle (Material, Relief,
  Vorstufe, Bühne). Neue Welten bauen eine neue Bühne und importieren die drei Module unverändert.
- **Neue Fassung = neue Datei** (`brain-world.v5.js`), alte löschen, wenn sie keinen Importer mehr hat.
- **Assets:** Asset Librarian zuerst (Link in `CLAUDE.md`), Pfade per Byte-Abfrage an `@2ff8b350` prüfen.
  Figuren und Rigs aus dem Resident Atlas (`tools/resident_atlas_s6/data/cast.js`).
- **Prüfen:** echte Pixelaufnahme aus drei Kameras (Totale, Nah, Mitfahren). Ein DOM-Nachzeichner zeigt WebGL nicht.
- **Georgs Sprache:** er spricht ein. Wörter wie »Playmation«, »Kay Kit«, »güri« heißen Claymation, KayKit, Gyri.

## Housekeeping, damit nichts abbricht

- `LIVING_CLAY.md` bleibt unter 120 Zeilen (Pflege-Regel steht im Kopf des Dokuments).
- Pro Sitzung **ein** Changelog-Eintrag oben, höchstens 15 Zeilen.
- Keine neuen `HANDOVER_*`/`ONBOARDING_*` im Wurzelordner. Übergaben liegen im Export-Paket; im Projekt
  wird dieses Blatt und `HANDOVER_WSA_claymation.md` überschrieben, nicht vermehrt.
- Screenshots zum Bauen nach dem Urteil löschen. Belege nur im Export (`evidence/`).
- Exporte unter `export/KFB_CLAYMATION_<SCHEIBE>_<DATUM>/`, mit `zipcheck.py`, Dateien je ≤ 2 MB.

## Nächster Schritt

Georg nach dem Gate fragen (Kandidaten in `LIVING_CLAY.md`). Nicht selbst wählen.
