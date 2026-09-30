# Briefing Web-Chat · PD-POOL-R4 · Nachtrag: fünf neue Themen

Stand 30.09.2026 · Auftraggeber Georg · **Nachtrag zu `BRIEFING_PD_POOL_R2_R3.md`**. R3 bleibt unverändert und wird zuerst fertig. R4 startet erst nach dem Merge von R3, auf dessen Stand.

## Ziel

Fünf neue Themenfelder für die Billboard-Collage (H8 und folgende): **Medizin** (passend zu den MedKayfab-Decks), **Tiere**, **Buchseiten**, **Architektur**, **Artefakte**. Gleiches Verfahren wie R3: Discovery-Liste aus `seeds.json` → `fetch_pool.py` → `manifest.jsonl`. Keine Auswahl von Hand.

## Quellen

Nur die Anbieter, die `fetch_pool.py` auf main schon kann: `met`, `aic`, `commons`, `ia`. Vieles aus Wellcome Collection, NLM, Biodiversity Heritage Library und LoC HABS/HAER liegt als Spiegel auf Commons und kommt so herein. Eigene Provider für diese Häuser wären ein eigener Schritt (R5), nicht Teil von R4.

## Neue Kategorien in `seeds.json`

Tags wie in R3: genau ein `cat:<id>`. Neu ist ein optionaler Gattungs-Tag (`engraving`, `print`, `drawing`, `photo`, `poster`, `page`), wenn die Quelle ihn hergibt. Die Engine nutzt ihn für die Wahl der Farbbehandlung.

| id | Quellen | Suchbegriffe (Vorschlag) | Bilder |
|---|---|---|---|
| `medicine` | commons, met | siehe Tabelle unten | 40–60 |
| `animals` | commons, met, aic | "natural history engraving", "Haeckel Kunstformen", "Audubon plate", "Buffon Histoire naturelle", "zoological illustration 19th century" | 24–40 |
| `bookpages` | commons, met, ia | "illuminated manuscript leaf", "incunabula page", "Voynich manuscript", "book of hours page", "herbarium manuscript" | 24–40 |
| `architecture` | commons, met, aic | "HABS measured drawing", "architectural elevation engraving", "Piranesi", "photochrom", "world's fair building 1893" | 24–40 |
| `artifacts` | met, aic, commons | "Egyptian amulet", "Roman bronze", "astrolabe", "automaton", "reliquary", "netsuke" | 24–40 |

### Medizin: an die MED-Decks gekoppelt

Jede Zeile trägt zusätzlich einen Tag `deck:<packId>` aus `media/kfb/index.json`. Damit kann die Engine später medizinisches Archivmaterial mit Karten desselben MedKayfab-Decks paaren (Beleg + Karte).

| Suchbegriff | `deck:` |
|---|---|
| "heart anatomy engraving", "Harvey De Motu Cordis" | `medkayfab_cardiology` |
| "skin diseases atlas", "dermatology plate 19th century" | `medkayfab_dermatology_01` |
| "dental instruments engraving", "teeth anatomy plate" | `medkayfab_dentistry` |
| "eye anatomy engraving", "ophthalmology plate" | `medkayfab_ophthalmology` |
| "skeleton engraving Vesalius", "bone anatomy plate" | `medkayfab_orthopedics_trauma` |
| "microscope drawing Hooke Micrographia", "bacteria illustration 19th century" | `medkayfab_microbiology_infectiology` |
| "apothecary jar", "pharmacopoeia title page" | `medkayfab_pharmacology_01` |
| "brain anatomy engraving", "Gray's Anatomy brain" | `medkayfab_neuroanatomy` |
| "surgical instruments engraving", "amputation 18th century" | `medkayfab_surgery` |
| "plague doctor", "cholera poster 19th century" | `medkayfab_tropical_medicine` |

## Grenzen (zusätzlich zu R3)

- **Keine Patientenfotos mit erkennbaren Personen.** Beim Thema Medizin nur Stiche, Tafeln, Zeichnungen, Instrumente, Gefäße. Fotografische Krankheitsbilder bleiben draußen, auch wenn sie gemeinfrei sind (Persönlichkeitsrecht, siehe `media/public_domain/README.md`, „Known rights boundary“).
- Menschliche Überreste (Mumien, Schädel als Objekt) nur als Zeichnung oder Stich, nicht als Museumsfoto.
- Mengen, Bildgröße (≤ 2048 px), Ordnergrenze, Idempotenz, Bericht: wie R3. Die Obergrenze für den Ordner steigt nach R4 auf ≤ 1,3 GB.

## Zurückgestellt (nicht in R4)

- **Retro-TV-Clips und bekannte Webcam-Aufnahmen.** Fernsehsendungen und bekannte Webcam-Bilder sind fast immer geschützt. Erst nach Einzelprüfung der Rechte je Clip, als eigener Schritt.

## Fertig, wenn

Wie R3, dazu: jede `medicine`-Zeile trägt genau einen `deck:`-Tag, und jede Themen-ID hat mindestens 24 Einträge `free`.

## Rückgabe an Claude Design

Voller Commit-SHA des Persistenz-Commits. Claude Design tauscht `PD_PIN` und prüft die fünf neuen Themen im Leitstand. Die Zuordnung Thema → Kontext ist in H8 bereits eingetragen (`PD_CAT_TAGS`).
