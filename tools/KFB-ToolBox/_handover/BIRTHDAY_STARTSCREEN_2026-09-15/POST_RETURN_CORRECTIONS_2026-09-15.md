# ToolBox Birthday Consumer · Post-Return Corrections

**Datum:** 15.09.2026  
**Status:** CURRENT INPUT / CORRECTION. Additiv zum bestehenden Birthday-Consumer-Return. Kein Runtime-Release.

## 1 · Neu angelieferte Quellen

### ToolBox Birthday Return

`tools/KFB-ToolBox/_inbox/KFB ToolBox(1).zip`

Gemessenes Intake:

- Größe: `552531` B
- SHA-256: `361eb0c1aa8207367dcc9d3bdc16f4a89f1db92f76f4d006b5bea460823ca4ae`
- 19 Dateien / ca. 613 kB unkomprimiert
- Inhalt ist ein **Birthday-Consumer-Return** mit Casting-QA, Profil, Changelog und Return-Dokumenten; kein Ersatz des A-Quellstands.

Intake: `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_1_INTAKE_2026-09-15.md`.

### FrizzleBob Profil-Entwurf

`tools/KFB-ToolBox/_inbox/kfb-pet-graft-driver(1).json`

- Schema: `kfb.pets/1`
- Version im Dokument: `1.2.9`
- Status für diese Übergabe: **CURRENT CANDIDATE / NOT FINAL**.
- Nicht still als neue Canon-/Default-Datei promovieren.
- Consumer darf den Entwurf nur nach sichtbarem Smoke verwenden; bei Regression auf zuletzt geprüften stabilen Graft-Weg zurückfallen und den Unterschied benennen.

## 2 · Georgs aktuelle Rig-/ToolBox-Befunde

**USER-REPORTED / noch nicht hier reproduziert:**

1. Carl eyebrows sind im aktuellen Authoring-Stand dysfunktional.
2. Eyebrow tapering ist broken bzw. war nie korrekt.
3. Alle Material-Zonen sollen Texturen unterstützen; nicht nur Farbe.
4. Der aktuelle Colorpicker ist praktisch unbrauchbar:
   - `#hex` muss sichtbar und kopierbar sein;
   - Colorfields müssen zuverlässig editierbar sein;
   - Picker/Popover soll bei Klick außerhalb schließen.
5. Der angelieferte FrizzleBob-Rig-/Buildstand ist ausdrücklich **nicht final**.

Diese Punkte gehören dem ToolBox/Studio/Rigging-Owner. Travel/Astra soll sie nicht lokal nachimplementieren.

### Priorität für die nächste ToolBox-Runde

**P0 ToolBox correctness / usability**

- Brow-Pfad zuerst reproduzieren: Carl-original vs drawn/graft, enabled/state und tatsächliche sichtbare Geometrie.
- Tapering als eigener Sichttest mit extremen Werten; nicht nur JSON-Roundtrip.
- Colorpicker reparieren: Hex-Feld + Copy, editierbar, Escape/Outside-Click close, keine verlorenen Werte.

**P1 material surface**

- Zonen-Contract um bereits vorhandene Surface-/Texture-Nähte nutzen; keinen zweiten Material-Owner erfinden.
- Pro Zone sichtbar machen: color/tint + texture/surface + original/reset.
- Eine Testfigur mit mindestens drei deutlich verschiedenen Zonen als visuellen Beleg verwenden.

Birthday P0 darf davon unabhängig bleiben, sofern der ausgewählte FrizzleBob-Consumer sichtbar stabil ist.

## 3 · Player-facing Namen / Source IDs

Keine reale Person ungefragt als Character-Identität framen.

Für den Birthday-Startscreen gilt ab jetzt:

| Source/Asset | Player-facing Rolle/Label | Status |
|---|---|---|
| FrizzleBob / Graft | **Uncle FrizzleBob** | active choice |
| `GothGirl` KayKit asset | **Little Miss Messy** | active Birthday choice |
| Cube-Pet kitten | **Hihi Love-Hope** | `Coming Soon...` for Wednesday |

`GothGirl` bleibt technischer Asset-/Registry-Name. `Little Miss Messy` ist die aktuelle player-facing Rolle. Keine Datei umbenennen, wenn dadurch Registry-/Asset-Identität verloren geht.

## 4 · Little Miss Messy · Look Direction

### DECISION / DIRECTION

Goth baseline bleibt erhalten: dunkle/anthrazitfarbene Hauptmasse, gute Goth-Silhouette, kein globales Rainbow-Recoloring.

Dazu ein **dezenter rainbow / woke vibe** als kleine Akzentschicht, nicht als neue Gesamtpalette. Empfehlung für den ersten visuellen Test:

- Grundlook: anthrazit / schwarz / gedeckte Haut- und Haarwerte wie im guten vorhandenen Goth-Look;
- Akzentfarbe 1: teal/cyan;
- Akzentfarbe 2: violet/magenta;
- optional wenige kleine Spektral-/Rainbow-Akzente an Accessoires oder UI/Screen, nicht auf jeder Fläche.

Astra/Travel darf diesen Look in der Birthday-Szene **kalibrieren**, aber nicht den Asset-Contract dauerhaft umschreiben. Dauerhafte Character-Palette gehört später zurück in ToolBox/Actor-Quelle.

### P1 Signature Props

**Teal 3D cartoon phone**

- Standard in rechter Hand, sofern ein vorhandener Hand-/Attachment-Anker sauber trägt.
- KISS für P1: einfacher 3D-Körper + Screen-Plane mit eigenem kurzen Loop.
- Screen zeigt eine schnelle collageartige `hypernormalisation`-Anmutung aus **KFB-/Public-Domain-/eigenen** Bildquellen; keine fremden Filmclips voraussetzen.
- technisch bevorzugt: CanvasTexture oder kurzer VideoTexture-Loop; keine zweite App im Telefon.
- spätere Erweiterung: Klick/Tap öffnet dieselbe Feed-/Scroll-Logik groß als Mini-Scroller-Game, ohne doppelten Zustand.

**Anthracite over-ear headphones**

- große, klar lesbare Cartoon-Silhouette;
- zunächst statisches/accessory rig ausreichend;
- kein neuer Skeleton-Owner.

### P2 / später

Hellblaue Haarspitzen / weicher Verlauf hinten. Erst angehen, wenn der vorhandene Hair-Material-/Texture-Weg sauber belegt ist. Kein freihändiger Shader-/Texture-Umbau als Birthday-P0-Blocker.

## 5 · Birthday Scope-Grenze

Für Mittwoch bleibt ausreichend:

- Uncle FrizzleBob + Little Miss Messy aktiv auswählbar;
- Hihi Love-Hope sichtbar, aber inaktiv;
- stabile Idle/Focus/Select/Rest-Beats;
- aktueller guter Goth-Look;
- Phone/Headphones nur dann P0, wenn sie über vorhandene Attachment-Nähte ohne neue Rig-Arbeit sauber montierbar sind.

Phone, Headphones, Rainbow accents und Hair tips dürfen P1/P2 sein. Der Birthday-Opener darf nicht an diesen Details hängen.

## 6 · Return an Travel/Astra

ToolBox/Design soll für jeden tatsächlich verwendeten Actor/Prop nur die Consumer-Fakten liefern:

- exact source ID/path;
- exact mount/attachment seam;
- motion clip/state + binding evidence;
- current profile status: stable vs candidate;
- visible known defects;
- fallback path.

Keine lokalen Travel-Fixes für Carl-brows, tapering, ToolBox colorpicker oder Material-Authoring.
