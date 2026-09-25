# CURRENT STATE · 2026-09-25

- Sichtbare Ansicht beim Start: `#heute` (oder Hash aus der URL).
- Quelle zur Laufzeit: Live-Registry `bot/production-desk-update`, sonst `main`, sonst eingebauter Stand (Kopie 25.09. 18:06 UTC, sourceCommit 74c6fa5c). Beim letzten Test: Live, Stand 25.09. 20:22 MESZ, manuell eingespielt.
- Resident-Overlay im Test eingeschaltet, Actor frizzlebob.

## Browser-Schlüssel (nur lokal, nicht exportiert)
| Schlüssel | Speicher | Inhalt |
|---|---|---|
| `kfb.hub.theme.v1` | localStorage | paper / dark (Donor-Key) |
| `kfb.hub.decisions.v1` | localStorage | Array `kfb.hub-decision/1` + sync.state |
| `kfb.hub.seen.v1` | localStorage | {at, sigs} für „geändert seit“ |
| `kfb.hub.resident.v1` | localStorage | {on, actor} |
| `kfb.hub.resident.pos.v1` | localStorage | {x, y} Overlay-Position |
| `kfb-hub-pocket-inbox-v1` / `items` | IndexedDB | Pocket-Einträge (Donor-Schema) |

`RUNTIME_STATE_NOT_SERIALIZED`: offene Aufklapper, Entwurfs-Entscheidungen (draft), Suchtext, aktueller Clip. Georgs lokale Entscheidungen/Inbox-Einträge liegen nur in seinem Browser und sind nicht Teil dieses Exports.
