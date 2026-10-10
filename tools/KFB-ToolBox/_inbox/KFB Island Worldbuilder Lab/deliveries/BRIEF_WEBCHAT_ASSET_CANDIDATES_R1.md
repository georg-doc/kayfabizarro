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
- **Look:** Cartoon bzw. stilisiert, gerundete Kanten, wenige große Formen, gern handgemacht bzw. Diorama-Charakter (Knete, Holz, Pappe); kein Realismus, kein Pixel- bzw. Voxel-Look;
- **Format:** glb bzw. gltf bevorzugt, sonst fbx bzw. obj; Polygonzahl im Spielbereich (≤ 20 k je Teil).

## 3 · Was ein guter Kandidat erfüllt (für alle Gruppen)

- **§00 Weltlogik:** Man versteht, wer es gebaut hat bzw. warum es so aussieht. Die Inseln sind aus der zersprengten Erde gebrochene Schollen (Erdschichten, Bruchkanten mit Alter).
- **Dioramen-Look mit Materialmix** (Georg 10.10.): Die Welt ist ein **gebasteltes Diorama**, wie von den Bewohnern selbst bzw. von einem Dioramenbauer und Stop-Motion-Künstler gemacht. Knete ist das Grundmaterial, aber **Materialmix ist erlaubt und erwünscht**, wo er hilft, etwas zu kaschieren oder besser zu bauen: Balsaholz, Pappe, Kork, Filz, Draht, Stoff, bemalte Steinchen, Moos. Verboten bleibt nur: **konstruiert bzw. CAD-artig aussehen** und **repetitiv** wirken (gleiche Teile in gleichem Abstand, Raster, Kopien).
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
3. **Referenzansichten generieren** (ChatGPT-Bildgenerierung), wenn ein Element eine Lücke ist **oder** der beste Kandidat nur als Vorlage taugt (Rang C). Regeln siehe §7.
4. **Kandidatenblatt** erstellen (siehe §6) und auf GitHub persistieren.
5. **Georg zur Abnahme** vorlegen: pro Element eine Wahl (`picked`) oder „weiter suchen“ mit Grund. Georgs Wahl in Blatt und JSON nachtragen und erneut persistieren.
6. Bei „weiter suchen“: nächste Runde mit Georgs Grund als zusätzlichem Filter, höchstens zwei Runden je Element; danach als Lücke markieren.

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

## 7 · Referenzansichten per Bildgenerierung (ChatGPT)

Zweck: ein **verbindliches Zielbild** je Element, das zeigt, wie ein Dioramenbauer es bauen würde. Es dient als Vorgabe für die Bau-Sitzung, als Eingabe für img2threejs bzw. Bild-zu-3D und als Maßstab für den Kritiker.

**Harte Regeln für jedes Bild:**
- **Nur das Element**, freigestellt auf neutralem, hellem Grund bzw. auf einem kleinen Stück Insel-Boden, wenn der Anschluss gezeigt werden soll.
- **Keine Figuren, keine Tiere, keine Fahrzeuge, kein Text, keine Logos**, keine zusätzlichen Requisiten und keine Szenen-Komposition, die nicht verlangt ist. Nichts dazuerfinden.
- **Ansichten:** frontal, 3/4 von oben, seitlich; bei Brücken bzw. Inselkörpern zusätzlich von unten. Gleiche Beleuchtung, gleicher Stil in allen Ansichten.
- **Stil:** handgebautes Stop-Motion-Diorama, Knete plus erlaubter Materialmix (Balsaholz, Pappe, Kork, Filz, Moos), sichtbare Handarbeit (Fingerabdrücke, leicht unregelmäßig), **nicht konstruiert, nicht repetitiv**, warme Farben passend zu den KFB-Rollen (Knetstein-Töne #e6d4b5 / #d1ba99 / #b29c7d / #9e856b, Asphalt #545e7a, Gras-Grün, Fels-Grau).
- **Proportionen in Worten** angeben (z. B. „Brüstung halb so hoch wie eine kleine Spielfigur, Fahrbahn fünf Figuren breit“), nicht durch eine Figur im Bild.
- **Prompt mitliefern** (für Wiederholbarkeit) und je Element höchstens 3 Varianten.

**Ablage:** `…/G_asset_candidates/refs/<element>/<element>_<ansicht>_v<n>.png` plus `PROMPT.md`. Im JSON beim Element: `"referenceViews": [{ "file": "...", "view": "front|34|side|below", "prompt": "..." }]`.

**Abnahme:** Georg wählt die Variante bzw. sagt „nochmal“; die gewählte wird `"goldenRef": true`.

## 7b · Recovery: Chats in Reihe, ohne Datenverlust

Jeder Chat führt **eine Recovery-Datei je Gruppe** und aktualisiert sie **nach jedem abgeschlossenen Schritt** (nicht erst am Ende):
`tools/KFB-ToolBox/_inbox/MVP1_RETURNS/G_asset_candidates/RECOVERY_G<n>.md` mit:
- Stand (Datum, Chat-Nummer), erledigte Elemente mit Links zu Blatt, JSON und Bildern;
- **genau ein nächster Schritt** (Element, Quelle, was zu tun ist);
- offene Fragen an Georg und dessen letzte Entscheidungen (wörtlich);
- Liste der verwendeten Prompts bzw. Suchbegriffe.

**Ein neuer Chat startet immer mit:** „Lies `BRIEF_WEBCHAT_ASSET_CANDIDATES_R1.md` und `RECOVERY_G<n>.md`, mach beim nächsten Schritt weiter.“ Bricht ein Chat ab (Timeout, Limit), geht nichts verloren; Georg öffnet einfach den nächsten Chat mit diesem Satz. Mehrere Chats können so nacheinander dieselbe Gruppe abarbeiten.

## 7c · Was danach passiert (nicht Teil der Webchats)

1. Die gewählten Kandidaten und Golden-Referenzen setzt die Bau-Sitzung im Lab ein (Maßstab K2, Material, KFB-Farbrollen, Q1–Q9, Spielkameras).
2. **Wenn der Ablauf über die Webchats trägt:** ein **WSA-Work-One-Shot**, der alle abgenommenen Referenzansichten sauber und einheitlich durchrendert (gleiche Kameras, gleiche Beleuchtung, alle Ansichten) und als Golden-Set auf GitHub ablegt; ein großer Lauf statt vieler kleiner.
3. Was dann noch fehlt, geht an img2threejs bzw. Bild-zu-3D (§8).

## 8 · Lücken: drei Wege, in dieser Reihenfolge (aktualisiert 10.10.)

Gibt es für ein Element nach zwei Suchrunden keinen brauchbaren Kandidaten, markiere es als **Lücke** und schlage einen dieser Wege vor (nicht selbst ausführen, außer c):

**a) Gebaute Formen** (Treppe, Brücke, Tunnelportal, Marktstand, Landmarke): **img2threejs-Skill** (offizielles Repo `img2threejs/img2threejs` v2.0.0, Apache-2.0). Er baut aus **einem Referenzbild** ein three.js-Modell aus Code, mit festen Stufen (Eignung, Qualitätsvertrag, Spezifikation, Bau in Durchgängen, Render-gegen-Referenz-Vergleich, Gates). Läuft in Claude Code; die Steuer-Sitzung testet ihn gerade an einem Steinbogen. Liefere dafür **das beste Referenzbild** (frontal bzw. 3/4, freigestellt, Cartoon-Stil, Lizenz bzw. Herkunft) und eine Liste der identitätsprägenden Merkmale.

**b) Organische Formen** (Inselkörper, Felsen, Brocken, Gelände): **Bild-zu-3D-Generatoren**, die ein echtes Netz (GLB) erzeugen:
- **TRELLIS.2** (Microsoft, MIT) gilt als stärkstes Open-Source-Modell, braucht aber eine große GPU, also nur gehostet (z. B. Hugging-Face-Space);
- **Meshy** bzw. **Tripo** (Gratis-Stufen, Low-Poly- bzw. Quad-Modus);
- **Hunyuan3D 2.1** ist wegen der Lizenz in der EU **nicht** nutzbar.

Liefere dafür 2–3 **Konzeptbilder bzw. Referenzbilder** je Form (eine klare Insel-Scholle, freigestellt, Cartoon) und, falls du Zugang hast, das erzeugte GLB mit Werkzeug, Einstellungen und Lizenz.

**c) Szenenmontage aus einem Bild** (Town-Lageplan): Ein gewähltes Referenzbild (z. B. eine StreakByte-Demo-Insel oder ein Konzeptbild) in eine Platzierungsliste vorhandener Assets übersetzen (Asset-ID, Lage, Drehung, Maßstab in MC). Das darfst du selbst ausführen; es ist ein Rezept-Vorschlag, kein Bau.

Alle Ergebnisse aus a) bis c) gehen danach im Lab durch Q1–Q9 und den blinden Kritiker. Gestaltet wird nur, wo es weder Modell noch Bild gibt.

## 9 · Reihenfolge der Chats (Vorschlag)

1. **Zuerst G1** (Inselkörper und Fels), **G4** (Brücke und Treppe) und **G2** (Stadtstraße): Die blockieren gerade.
2. Dann G3, G5, G6.
3. Jeder Chat beginnt mit der eigenen Bibliothek (Asset Librarian) und legt sein Blatt nach der ersten Runde schon ab, auch wenn es noch Lücken hat.
