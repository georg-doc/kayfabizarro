# HANDOVER_WSA · Billboard H5

Stand 30.09.2026. Ergänzt `export/kfb-billboard-hypernorm-h4_2026-09-26/HANDOVER_WSA.md`; dessen Vorschlag W1 (Engine aus der DC lösen, `CanvasTexture`) gilt für H5 genauso.

## Was sich gegenüber H4 ändert

Nur der Materialzugang. Kompositor, Songform, Typo, Kamera, Auswahl nach Unähnlichkeit sind byte-gleich übernommen.

| Quelle | Weg | Geprüft |
|---|---|---|
| LoC, 33 Platten | `tile.loc.gov`, wie H4 | Preview: 33/33 |
| PD-Manifest | raw `…/f3acaaeb…/media/public_domain/manifest.jsonl`, Medien über `cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@f3acaaeb…/media/public_domain/<localPath>` | Preview: 3/4 geladen, 1 unter 640 px verworfen |
| Film (Basis FILM) | Commons-API-Suche → `upload.wikimedia.org/…/transcoded/…360p.vp9.webm` | Verifier-Lauf ausstehend: NOT_TESTED |

Code-Anker in der DC: `PD_PIN`, `PD_MANIFEST`, `PD_MEDIA`, `PD_MIN_EDGE`, `pdEntry()`, `loadManifest()`, `FILM_Q`, `commonsFilms()`, `loadFilm()`, Methode `film()`.

## Was Web wissen muss

- **Pin tauschen, sonst nichts:** Nach R3 (PD-Pool befüllt) wird nur `PD_PIN` auf den neuen Persistenz-Commit gesetzt.
- **CORS:** Grades und Luma-Key lesen Pixel. Nötig sind CORS-Header von `tile.loc.gov`, `cdn.jsdelivr.net` und `upload.wikimedia.org` auf dem Stage-Ursprung. In der Preview liefen alle drei; auf `kayfabizarro.pages.dev` NOT_TESTED. FILM liest keine Pixel (Grade über Mischmodi), braucht CORS nur für spätere Luma-Keys.
- **Filmclips sind nicht persistiert.** Sie werden je Laden gesucht und lizenzgeprüft; Auswahl und Reihenfolge sind darum nicht reproduzierbar. Reproduzierbar erst, wenn Clips im PD-Manifest liegen (R3, Video-Kontingent).
- **Leistung:** höchstens 2 Clips spielen gleichzeitig (aktueller + vorheriger Schnitt), der Rest wird nach 1,5 s angehalten. Auf Mittelklasse-Laptop und Mobil NOT_TESTED.
- **Tab verdeckt:** Die Schleife hat einen 120-ms-`setTimeout`-Rückfall; Video spielt im verdeckten Tab gedrosselt.

## Nicht integrieren

`context/collage-engine/` ist FAILED CANDIDATE (siehe `docs/FAIL_2026-09-30.md`). Der Manifest-Lader daraus ist in H5 unabhängig neu geschrieben.

## Prüffrage an Web

Wenn H5 als Modul gelöst wird: Soll der Materialzugang (LoC, PD-Manifest, Film, später Karten) ein eigenes Modul `billboard-sources.js` werden, das auch andere Flächen speist, oder bleibt er Teil der Engine?
