# Briefing Webchat · Asset-Kandidaten für MVP-1 R1 („Use what works“: finden statt bauen)

Stand: 2026-10-10 · von der Steuer-Sitzung · Auftraggeber Georg. Ein Briefing für **mehrere parallele Webchats**: Jeder Chat übernimmt **eine Gruppe** aus §4. Alle Chats arbeiten nach demselben Ablauf und schreiben in dieselbe Ablage.

## 1 · Warum

Die Bau-Sitzungen haben drei Tage lang Inselkanten, Brücken, Bordsteine und Treppen aus Text-Regeln **errechnet**. Die Messungen bestanden, der blinde Kritiker blieb bei 5 von 10. Was dagegen gut aussieht, sind fertige, **von Menschen gemachte** Modelle (KayKit, Kenney, Quaternius, gekaufte Packs). Ab jetzt gilt: **Für jedes Element zuerst ein vorhandenes Modell finden.** Es wird entweder direkt verbaut oder dient als Vorlage dafür, wie ein Cartoon-3D-Designer dieses Element modelliert.

## 2 · Quellen (in dieser Reihenfolge)

1. **Eigene Bibliothek zuerst:** KFB Asset Librarian (https://kfb-asset-librarian.frizzlebob.chatgpt.site/), über 7.800 3D-Modelle. Daten im Repo `georg-doc/kayfabizarro`, `registry/assets/v1/` bzw. `media/3D_Assets/`. Bekannte gute Packs: KayKit (Dungeon, Medieval Builder, Medieval Hexagon, Bits Bundle 1.1, Mystery Series), Kenney (castle-kit, city-kit-roads, building-kit, nature), Quaternius (Ultimate Nature u. a.), Platformer Game Kit, Tiny Treats.
2. **Gekaufte Packs, nur lokal bei Georg** (nicht im öffentlichen Repo; hier nur benennen, nicht hochladen): StreakByte Low Poly Floating Islands (8 Inseln), Cartoon Race Track Oval (Banden, Reifen, Mauern, Brücken), Hyper Casual Cartoon Castles (Big Castle u. a.), Medieval Castle Modular, Toon City Pack, Low Poly Arabian City, Raft on the Desert. Inhaltslisten sind in den Paket-Vorschauen bzw. Unity-Asset-Store-Seiten sichtbar.
3. **Externe 3D-Suche** (Asset Librarian External 3D Search bzw. die Quellen Poly Haven, Kenney, Quaternius, BlenderKit, Polyfork, itch.io, OpenGameArt, Fab gratis): nur für Lücken.

**Filter für externe Treffer:**
- **von Menschen gemacht**; Treffer mit dem Tag „ai-generated“ sind ausgeschlossen (die Stichprobe zeigte graue Klötze);
- **Lizenz** CC0 bzw. frei mit kommerzieller Nutzung;
- **Look:** Cartoon bzw. stilisiert, gerundete Kanten, wenige große Formen; kein Realismus, kein Pixel- bzw. Voxel-Look;
- **Format:** glb bzw. gltf bevorzugt, sonst fbx bzw. obj; Polygonzahl im Spielbereich (≤ 20 k je Teil).

## 3 · Was ein guter Kandidat erfüllt (für alle Gruppen)

- **§00 Weltlogik:** Man versteht, wer es gebaut hat bzw. warum es so aussieht. Die Inseln sind aus der zersprengten Erde gebrochene Schollen (Erdschichten, Bruchkanten mit Alter).
- **§01 keine harten Schnitte:** gerundete, knetige Kanten; keine scharfen Schnittflächen, keine dünnen Platten bzw. Krempen, keine Linien zwischen Teilen.
- **Maßstab K2:** Figur = 1 H (KayKit-Medium), Tür ≥ 1,15 H, Stockwerk = 1 MC (= 1,76 H). Gib je Kandidat an, wie hoch bzw. breit er im Verhältnis zu einer KayKit-Figur ist bzw. welcher Skalierungsfaktor nötig wäre.
- **Umfärbbar:** einfache Materialien bzw. Farbflächen (Gradient-Atlas oder wenige Farben), damit das Lab sie auf die KFB-Farbrollen umfärben kann (Knetstein, Gras, Fels, Asphalt).
- **Passt zusammen:** gleiche Formsprache wie KayKit-Figuren und Big Castle (dicke, weiche, cartoonige Formen).

## 4 · Gruppen (je Webchat eine)

| Nr. | Gruppe | Gesucht | Worauf achten |
| --- | --- | --- | --- |
| G1 | **Inselkörper und Fels** | schwebende Inseln bzw. Erdschollen (zwei klar verschiedene Silhouetten: breites ruhiges Plateau für KFB Town, schmale hohe Berg-Insel für Protopia), kleine Brocken als Brückenpfeiler, Felswände bzw. Abbrüche, große Felsen, Felsgrate | dicke gerundete Kante statt Krempe; Unterseite als Erdkörper mit Schichten (kein Teller, keine hängenden „Würste“); StreakByte-Inseln als erste Wahl prüfen |
| G2 | **Stadtstraße** | Fahrbahn, Bordstein (hoch und abgesenkt), Plattengehweg, Rinne mit Ablauf, Kreuzung bzw. Einmündung, Straßenende | wie Cartoon-Designer Bord und Gehweg trennen; Übergang Gehweg ↔ Gras ohne Stufe; Kenney city-kit-roads und Toon City zuerst |
| G3 | **Ringstraße außen** | Rennstrecken-Bande (rot-weiß bzw. rot), Bandenkopf bzw. Endstück, Reifenstapel, Bankett, Rennstrecken-Props (Startlicht, Banner) | Joyride-Look (dick, rund); Cartoon Race Track Oval zuerst; Übergang Asphalt ↔ Gras |
| G4 | **Brücke und Treppe** | Steinbogen-Brücke (mehrere Felder möglich), Brückenkopf bzw. Widerlager, Brüstung, Brückenpfeiler; Steintreppe mit Wangenmauern für einen Burghügel, Rampe | Bogen wächst aus Fels bzw. Insel; Kenney castle-kit, KayKit Medieval Builder, StreakByte-Brücken, Medieval Castle Modular |
| G5 | **Burgumfeld und Markt** | Burgsockel bzw. Burghügel, Marktstände, Clown-Podest bzw. Bühne, Brunnen, Sitzbänke, Laternen, Billboard-Standorte | Gebäude sitzen auf dem Boden (Sockel, Fundament); Dichte eines kleinen Cartoon-Marktplatzes; KayKit, Tiny Treats, Kenney |
| G6 | **Protopia-Gelände** | Bergweg bzw. Serpentinen und Stufen am Hang, Teich mit Ufer bzw. Bach, Tunnelportal, Eremiten-Hügel mit Schreibpult bzw. Hütte, Farmer-Felder | Ufer ohne harten Ring; Weg am Hang begehbar; Portal mit Lichtraum für ein Auto |

## 5 · Ablauf je Webchat

1. Die Gruppe aus §4 lesen; je Element **3–5 Kandidaten** suchen, eigene Bibliothek zuerst.
2. Pro Kandidat festhalten: Name, Quelle bzw. Pfad bzw. URL, Vorschaubild-URL, Lizenz, von Menschen gemacht (ja/nein), Format, Polygonzahl, Maßstab gegenüber KayKit-Figur, **Kurzurteil** zu §3 (Weltlogik, Kanten, Maßstab, Umfärbbar, Passt zusammen), **Empfehlung** (A erste Wahl, B möglich, C nur als Vorlage), Risiken.
3. **Kandidatenblatt** erstellen (siehe §6) und auf GitHub persistieren.
4. **Georg zur Abnahme** vorlegen: pro Element eine Wahl (`picked`) oder „weiter suchen“ mit Grund. Georgs Wahl in Blatt und JSON nachtragen und erneut persistieren.
5. Bei „weiter suchen“: nächste Runde mit Georgs Grund als zusätzlichem Filter, höchstens zwei Runden je Element; danach als Lücke markieren.

## 6 · Ablage (für alle Chats gleich)

- **Branch:** `planning/kfb-mvp1-asset-candidates-2026-10-10` (anlegen, falls nicht vorhanden; jeder Chat schreibt nur seine eigenen Dateien).
- **Dateien je Gruppe:** `tools/KFB-ToolBox/_inbox/MVP1_RETURNS/G_asset_candidates/G<n>_<gruppe>.md` (Blatt mit Vorschaubildern als Links bzw. eingebettet) und `G<n>_<gruppe>.json`.
- **JSON-Schema `kfb.asset-candidates/1`:**
```json
{ "schema": "kfb.asset-candidates/1", "group": "G4", "updatedAt": "2026-10-10", "elements": [
  { "element": "stone_arch_bridge", "candidates": [
    { "id": "kenney_castle-kit/bridge-straight-pillar", "source": "registry|purchased-local|external",
      "path": "media/3D_Assets/kenney_castle-kit/bridge-straight-pillar.glb", "url": "", "thumb": "",
      "license": "CC0", "humanMade": true, "format": "glb", "polys": 1200,
      "scaleNote": "Brüstung ≈ 0,4 H, Faktor × 3 für K2", "verdict": "§00 ok, §01 Kanten rund, …",
      "rank": "A|B|C", "risks": "" } ],
    "picked": null, "georgNote": "" } ] }
```
- **Keine Modell-Dateien** hochladen, nur Verweise. Gekaufte Packs nur benennen.
- Nach jeder Persistierung den Link zur Datei im Chat ausgeben.

## 7 · Was danach passiert (nicht Teil des Webchats)

Die gewählten Kandidaten setzt die Bau-Sitzung im Lab ein: Maßstab K2, Knet-Material, KFB-Farbrollen, Prüfung Q1–Q9, aus Spielkameras. Fehlt für ein Element jeder brauchbare Kandidat, bleibt es eine Lücke für Claude Design bzw. Blender. Erst dann wird neu gebaut.

## 8 · Lücken: img2threejs statt Text-Regeln (Georg 10.10.)

Gibt es für ein **gebautes** Element (Treppe, Brücke mit Widerlager, Tunnelportal, Marktstand, Landmarke) kein brauchbares Modell, aber ein gutes **Bild** (aus der Kandidatensuche, ein Foto bzw. Georgs Midjourney-Bild): dann nach der img2threejs-Methode (`tools/img2threejs/`, Vorbild Kölner Dom v0.2 und Landmark-Pack, Grotesque-Stil) als three.js-Modul nachbauen:

1. Referenzbild festlegen und Georg kurz bestätigen lassen.
2. Bauteile aus dem Bild beschreiben (Teile, Proportionen in H bzw. MC, Kantenrundung).
3. Geometrie stufenweise im Code aufbauen (three.js r160+, gerundete Kanten, wenige große Formen, Farben über Rollen).
4. **Render gegen Referenz aus derselben Kamera vergleichen**, nebeneinander auf einem Blatt; höchstens drei Korrekturrunden.
5. Ergebnis als Modul bzw. GLB im Maßstab K2 auf demselben Branch ablegen (`…/G_asset_candidates/img2threejs/<element>/`), mit Vergleichsblatt.

**Nicht** für organische Formen (Inselkörper, Felsen, Gelände): Dafür nur vorhandene Modelle (G1). Auch img2threejs-Ergebnisse gehen danach im Lab durch Q1–Q9 und den blinden Kritiker.

**Szenenmontage aus einem Bild:** Für den Town-Lageplan darf ein Chat ein gewähltes Referenzbild (z. B. eine StreakByte-Demo-Insel oder ein Konzeptbild) analysieren und daraus eine Platzierungsliste vorhandener Assets erstellen (Asset-ID, Lage, Drehung, Maßstab in MC). Das ist ein Rezept-Vorschlag, kein Bau.
