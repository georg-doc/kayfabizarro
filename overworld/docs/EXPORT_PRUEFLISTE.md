# Export-Prüfliste (v10-S5, ergänzt 9.8.)

**Der Fehler, der diese Liste ausgelöst hat:** `overworld/hud-slots.json` fehlte im Export.
Nicht schlimm wegen der Datei — schlimm wegen der Art: `hud-v7.js` holt sie mit `fetch` und fängt
den Fehlschlag in einem **leeren catch**. Keine Konsolenzeile, das HUD läuft auf eingebauten
Vorgaben weiter und **sieht dabei richtig aus**. Gefunden hat es WS0 über einen einzelnen 404 unter
104 Ressourcen.

**Regel:** *Ein leeres `catch` um einen `fetch` macht eine fehlende Datei unsichtbar. Wer eine
Konfiguration lädt, muss ihren Fehlschlag melden.*

**Und die Regel für den Export:** nicht nur zählen, was das DC referenziert (38 Skripte), sondern
auch, **was die Module selbst nachladen**. Automatisch ermittelt:

| Modul | lädt nach |
|---|---|
| `card-art-2d.js` | `overworld/card-grids.json` |
| `hud-v7.js` | `overworld/hud-slots.json` |

Dazu die Binärdateien, die kein Skript-Tag hat: `overworld/card-backside.png` ·
`overworld/fonts/pottymouthbb_reg.otf`.

Vor jedem Export: DC-Referenzen **und** diese Tabelle gegen den Ordner prüfen.
