# POST MORTEM · Billboard B0, Karten-Platzierung

Datum: 2026-09-24 · 1 Ablehnung durch Georg (unpräzise erste Korrektur), 1 zweite Korrektur mit
präziser Absage ("DO NOT MOUNT — FILL THE EXACT 3D PLANE"), dann abgenommen.

Dieses Dokument sammelt die Fehlerklassen der Sitzung. Die Chronologie mit Bildbelegen liegt im
Chat und in `screenshots/` im Projekt (nicht in dieses Paket kopiert).

## Fehler 1 · Panel-Position aus einer falschen Pivot-Annahme

Der ursprüngliche `loadHero()`-Code positionierte das Kartenpanel relativ zum **lokalen Ursprung**
des geladenen Modells (`x = 0`, `z = bs.z * 0.5`) — eine implizite Annahme, dass dieser Ursprung
in einer Bounding-Box-Ecke liegt. Er tut es nicht: `billboard.glb`s Pivot sitzt versetzt. Ergebnis
war ein Kartenpanel, das schräg und seitlich versetzt neben dem eigentlichen Werbeflächen-Mesh
schwebte — in Georgs Screenshot sichtbar als frei stehende, gekippt wirkende Karte links vom
tatsächlichen "TANKCO"-Feld. Die Kippung war optische Täuschung durch Perspektive, nicht eine
echte Rotation — das eigentliche Problem war die Position.

**Konsequenz:** Panel-Position aus `Box3.getCenter()` / `.max` **der Weltkoordinaten**, nie aus
dem unbeprüften lokalen Ursprung des Donors.

## Fehler 2 · Automatische Flächenerkennung gegen die falsche Modellstruktur geprüft

Erster Korrekturversuch: pro Mesh-Node ein `Box3` bilden und die "flachste, größte" als Ad-Face
werten, um Panelgröße/-position exakt vom Donor abzuleiten statt zu schätzen. Fiel ins Leere,
weil der Donor **ein** gemergtes Mesh mit vier Materialslots ist (`bark`/`road`/`tankco`/`grey`),
kein Baum separater Teile. `Box3.setFromObject()` pro "Mesh-Node" maß deshalb jedes Mal denselben
Gesamtpuffer, alle vier Slots identisch groß — keine Unterscheidung zwischen Werbefläche und
Rest des Gestells möglich. Die Erkennung lieferte für alle Fälle "nicht gefunden" und fiel auf
dieselbe kaputte Heuristik von Fehler 1 zurück, ohne das sichtbar zu machen. Georgs zweiter,
schärferer Hinweis ("DO NOT MOUNT!") traf exakt diesen unveränderten Zustand.

**Konsequenz:** Bei einem gemergten Multi-Material-Mesh ist "größte flache Sub-Box" kein
brauchbares Signal — der Draw-Range/Index-Buffer je Materialslot muss geprüft werden, nicht die
Node-Bounding-Box.

## Fehler 3 · Erst geraten, dann erst gemessen — statt umgekehrt

Auch nach Fehler 2 wurde die Panelgröße zunächst wieder aus Modell-Bounding-Box-**Anteilen**
geschätzt (`bs.x * 0.92`, `panelW * 0.635`) statt aus der echten Geometrie gelesen. Das erzeugte
einen sichtbaren dunklen Rand auf allen vier Seiten der Karte — genau das, was Georg mit
"NO BLACK BORDERS ETC." zurückwies. Erst die direkte Vermessung des `tankco`-Materialslots
(Index-Buffer + `drawRange`, live im Browser über eine Diagnose-Injektion gemessen, siehe
`RETURN.md` §2) lieferte die tatsächliche Rechteckgröße `4,20 × 2,10`, exakt volle Modellbreite
und exakt die obere Hälfte der Modellhöhe — beides nicht die geschätzten Faktoren.

**Konsequenz, für künftige Passes:** bei einem echten Donor-Mesh **zuerst** messen (Vertex-/
Drawrange-Introspektion, notfalls per Live-Injektion), **dann** platzieren. Ein Bounding-Box-
Anteil ist eine Vermutung, keine Messung, auch wenn er wie eine Zahl aussieht.

## Was sich bewährt hat

- **Ehrliches Scheitern statt Ersatzkunst** bei `page.render()` (12 s Timeout, echte
  Fehlermeldung) — dieser Pfad blieb von der Panel-Korrektur komplett unberührt und war nie
  Gegenstand von Georgs Beanstandung.
- **Live-Introspektion im laufenden Preview** (Mesh-Namen, Materialslots, Vertex-Bounding-Box
  je Drawrange über injizierten Code, Ergebnis ins Diag-Panel geschrieben und gescreenshotet)
  war der einzige Weg, der die reale Geometrie ohne Quelldatei-Zugriff auf die GLB-Binärdaten
  offenlegte. Schneller und zuverlässiger als weiteres Raten an Skalierungsfaktoren.

## Offen

- Keine Prüfung, ob dieselbe Merged-Mesh-Struktur (und dieselbe Materialslot-Reihenfolge) auch
  für `billboardDouble_exclusive.glb` / `billboardLow.glb` / `billboardLower.glb` gilt — nicht
  in B0-Scope, wird bei Bedarf pro Donor einzeln vermessen, nicht angenommen.
