# RETURN · Billboard / Media Residency — B0 Source Proof

Status: **ABGENOMMEN (Georg, 2026-09-24)** · Karten-Rendering im Preview-Sandbox weiterhin
`SOURCE_REQUIRED` (siehe §4) — ehrlich als Timeout gemeldet, keine Ersatzkunst.

## 0. Auftrag

Recovery-Pass auf einen zuvor überbauten Stand (Inspector-Panels, Debug-Karten, ungeprüfte
Card-Render-Pipeline). Auftrag B0: **Beweis, nicht Komposition.** Drei exakte Quellen:
`renderCardQuarter(pick)`, `buildBillboard(THREE, GLTFLoader, route, frac)` (beide route-los
aus `cologne-props.v1.js` übernommen, siehe Provenienz-Kommentar in `bb0-boot.js`), und der
Kenney-Billboard-Donor `media/3D_Assets/kenney_racing-kit/Models/GLTF format/billboard.glb`.
Minimal-UI (Orbit, Reset, Diag), kein Terrain, kein Triplet/Collage/Reveal/ChatterBox.

## 1. Ergebnis

`KFB Billboard Media Szene · B0 Source Proof.dc.html` + `bb0-boot.js` (eigener Boot-Layer) +
`bb-scene.js` (geteilter Owner mit dem vollen GATE-1-Build, `loadHero()`/`renderCardQuarter()`
liegen dort). Echter Kenney-Donor lädt und orbitiert; echte KFB-Karte (`forget_utopia` #7)
sitzt **bündig auf der gemessenen Ad-Face-Fläche** des Modells:

- Fläche direkt am Mesh vermessen (nicht geschätzt) — siehe `POST_MORTEM.md` §2 für den Weg
  dorthin: `4,20 × 2,10` Welteinheiten, obere Hälfte der Modellhöhe, volle Modellbreite.
- Kartentextur füllt diese Fläche randlos per Cover-Crop (skaliert + beschnitten, kein
  Letterboxing, kein Rand).
- Der Donor-eigene Platzhalter-Werbetext („TANKCO", Material `tankco`, Textur 256×128) ist
  vollständig verdeckt — nicht per Sichtbarkeits-Flag ausgeblendet, sondern weil unser Panel
  exakt deckungsgleich und einen Hauch davor sitzt (0,012 Welteinheiten Epsilon).
- Keine Metadaten-Einblendung mehr auf der Karte (Titel/Kartennummer/Seite/Quadrant) — nur das
  Kartenmotiv selbst.

## 2. Wie die Fläche gefunden wurde (kurz — Details in POST_MORTEM.md)

Der Donor ist **ein** gemergter Mesh mit vier Materialslots (`bark`, `road`, `tankco`, `grey`),
keine separaten Sub-Meshes. Automatische "größte flache Teilfläche"-Erkennung lief deshalb ins
Leere (Box3 pro Mesh-Node misst den gesamten Mergegeometrie-Puffer, nicht den Draw-Range).
Tragfähig war erst die direkte Vermessung über Index-Buffer + `drawRange` des `tankco`-Slots,
live im Preview per `save_screenshot`-Inject-Code gemessen und ins Diag-Panel geschrieben
(Screenshot-Belege liegen in `screenshots/inspect4.png` / `inspect5.png` im Projekt, nicht in
diesem Handover-Ordner kopiert). Ergebnis: Fläche exakt `size(4.20, 2.10, 0.00)`,
`ctr(0.00, 3.15, 0.993)` in Weltmaß nach Zielhöhen-Skalierung.

## 3. Kamera / UI

Free-Orbit (Drag), Zoom (Wheel), `RESET VIEW`, `DIAG` (Donor-Pfad + Card-Status, standardmäßig
zu). `window.__b0.setView('FRONT'|'LEFT34'|'RIGHT34'|'WIDE')` für programmatische ¾-Ansichten.
Kein Terrain, kein Deko — bewusst, per B0-Scope.

## 4. Bekannte Lücke, ehrlich gemeldet, nicht verdeckt

`renderCardQuarter()` erreicht `page.render()` (getDocument/getPage erfolgreich, dieselbe
Registry/PDF-Version wie der volle GATE-1-Build), aber der Aufruf selbst hängt in diesem
Preview-Sandbox — reproduziert gegen die KFB-Registry-PDF UND eine bekannt funktionierende
jsDelivr-Test-PDF. Das ist eine Umgebungsgrenze (pdf.js-Worker-Constraint), kein Pfadfehler.
12-Sekunden-Timeout zeigt `SOURCE CARD FAILED` mit der echten Fehlermeldung — keine
Platzhalterkunst. In dieser Session lief das Rendering aber durch; die Karte, die Georg
abgenommen hat, ist die echte Quelle.

## 5. Offen (nicht in diesem Pass bearbeitet)

- **Cartoon-Anatomie → 3D-Modell**: Georgs Ansage vom 2026-09-24 — die Proportionen zwischen
  Karten-Cartoon-Anatomie und dem 3D-Modell sollen einander angenähert werden ("beide etwas
  runter"). Als nächster Schritt benannt, hier bewusst nicht weiter ausgeführt (Georgs Vorgabe:
  nicht dokumentieren, erst umsetzen).
- Terrain, Requisiten, Triplet/Collage/Reveal, ChatterBox-Anbindung: außerhalb von B0.
- Die drei anderen Donor-Varianten (`billboardDouble_exclusive`, `billboardLow`, `billboardLower`)
  sind nicht gegen dieselbe Face-Vermessung geprüft — die Merged-Mesh-Struktur kann je Variante
  abweichen.
- Kein Branch/PR aus dieser Umgebung möglich (siehe `SOURCE.json`).

## 6. Nächstes Tor

Georgs Sichtprüfung ist erfolgt und **positiv** (2026-09-24, dieser Chat). Nächster Schritt laut
Georg: Cartoon-Anatomie-Angleichung (§5), danach erst Terrain/Deko/Content-Modi.
