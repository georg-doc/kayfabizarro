# DECISIONS · additiv, ältere Entscheidungen bleiben stehen

Kurzfassung der tragenden Entscheidungen. Vollständige Begründungen im `CHANGELOG.md` (32 Einträge) und in `ATLAS_RETURN.md`.

| # | Entscheidung | Sprint | Stand |
|---|---|---|---|
| 1 | Ein geteilter Viewer (`lib/atlas.js`) plus datengetriebene Rezepte (`data/cast.js`), keine handgeschriebene Three.js-App pro Resident | S5 | gilt |
| 2 | Welle 1 startet mit Goth Girl und Clown, weil nur für diese belegte Asset-Pfade vorlagen | S5 | erledigt |
| 3 | Fehlpositionierung wird zweistufig behoben: messbare Regel im Rezept, sonst Anfasser im Studio. Kein Studio-Griff schreibt automatisch in `data/cast.js` | S6 | gilt |
| 4 | Traktor gestrichen; Fremdpacks bleiben erlaubt, wenn ausgewiesen | S8 (Georg) | gilt |
| 5 | Hand-Requisiten brauchen keine Ausrichtung — Identität zuerst | S18 | gilt, mit drei belegten Ausnahmen |
| 6 | Schilde brauchen immer einen Schub entlang ihrer Normale in Höhe der Handdicke, nie ein Neudrehen | S20 | gilt |
| 7 | Keine Atlas-Skalierung, außer der Pack macht sie selbst (dann als `scaleNote`) | S19 ff. | gilt, eine Ausnahme (Orc-Raider-Requisiten `s: 2`) |
| 8 | Große Rigs (Black Knight, Demon Lord, Orc Brute, Monstrosity) bleiben Large-Tier, werden nicht auf Wellengröße herunterskaliert | S10 (Georg) | gilt |
| 9 | Attachment-Befunde nur an **gefrorener** Pose messen | S25 | gilt |
| 10 | Legacy-Figuren werden zusammengesetzt, nicht bespielt; Requisiten hängen am **Arm**-Bone, nicht am handSlot | S25/S28 | gilt |
| 11 | Ausrichtung ist eine Achsen-Zuordnung (`slotAxis`), keine Weltrichtung. `aim` bleibt für Fälle, in denen die Weltlage wirklich gemeint ist | S31 | gilt |
| 12 | Der Pivot sagt die Rolle: Boden = Standobjekt, Griff = Handrequisit, mittig = schwebendes Artefakt | S8/S31 | gilt |
| 13 | Prosa im Panel wird **generiert**, nicht getippt — jede Notiz nennt ihre Messung | durchgehend | gilt |
| 14 | **Alle Assets via GitHub**, gepinnt. Zentrale Quelle `georg-doc/kayfabizarro/media/3D_Assets/`; Exporte referenzieren, kopieren nicht. Ein Paket mit Assets wäre ~300 MB und ab dem nächsten Pack-Update veraltet | S32 (Georg) | gilt |

## Abgelehnt / widerrufen (bleibt dokumentiert)

| Was | Warum abgelehnt bzw. widerrufen | Sprint |
|---|---|---|
| Requisiten an eine T-Pose-erfasste lokale Drehung binden | Korrekt für diese Pose, bricht unter der Anzeigepose | S14 |
| „Lorekeeper_Tome ist ein Handrequisit" | Es ist ein Lesepult: 1,65 hoch, Pivot am Boden | S8 |
| „Der Cleric-Foliant ist eine dritte Ausnahme von der Identitätsregel" | Er war an der falschen Hand. Identität an `handslot.r` ist richtig | S29 |
| „Hero Mans Pack bringt eigene Clips, die die geteilte Bibliothek nicht hat" | Namensgleiche Duplikate, 15/15 und 11/11 | S29 |
| „Zwei rechtshändige Requisiten an einer Figur sind nicht belegbar" | Gemessen geht es mit reiner Identität auf beiden Händen | S30 |
| „Das Dämonenherz brauchte push=0,55 wegen Handvolumen" | Falscher Anker, nicht Handvolumen. Zentraler Pivot = schwebendes Artefakt | S31 |
| Die Blaster-Achsen-Zuordnung auf den Folianten übertragen | A/B gemessen: 0,53 gegen 0,85 senkrechter Anteil. Analogie war der Fehler | S31 |
| `pull` (zweiter Arm per CCD) für die Buch-Pose | Restfehler 0,334, Arm sichtbar verdreht. Eine Nachführung, die ihr Ziel nicht erreicht, ist keine Haltung | S29 |
| Assets ins Exportpaket kopieren | Widerspricht Entscheidung 14. Die erste Fassung der Exportdokumente führte die externe Asset-Quelle als „Hauptblocker“ — also eine bewusste Entscheidung als Fehlteil. Von Georg korrigiert | S32 |