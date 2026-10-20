# Kritiker 3D · R1 · 2026-10-20 · WS0 (V-563)

**Wer:** ein frischer, blinder Kritiker (neuer Kontext, Subagent). Er sieht **nur**:
- die Bilder aus den festen Kameras;
- das Konzeptblatt der Szene;
- diese Datei und den Kanon `CANON_3D_R1.md`.

Erklärungen, Code und Absichten der Bauenden sieht er nicht. Er schlägt keinen Code vor.

**Wann:**
- **Phase 1 (bis es läuft, Georg 20.10.):** jede 3D-Lieferung, also Abnahmen, Proofs, Scenelets, Demos, Residents und Dioramen.
- **Phase 2 (später, Tokens sparen):** nur produktive Spielszenen, also Residents und Dioramen im Spiel. Abnahmen laufen dann nur über das Gate.
- **Den Wechsel** zu Phase 2 entscheidet Georg.

**Vorher:** Das mechanische Gate ist grün:
- `lib/kfb_env.py` bzw. `kfb_env_bpy.run()` für die Umgebung;
- `PROOF_STAGE_R1` G1–G7 für Figuren, Material, Licht und Boden.

Ein roter Gate-Lauf geht nie an den Kritiker, sondern zurück an den Bau.

## Feste Kameras (je Szene)
1. Übersicht schräg von oben, 45°.
2. Augenhöhe Figur (1 H über Boden) vom Hauptweg auf den Fokus.
3. Nahaufnahme Fuß einer Ankergruppe (Erdung).
4. Seitenansicht Rand (Silhouette).
5. Nur bei Figuren: Gesicht nah (Augen, Lider), Proof-Stage-Preset `near_face`.
6. **Drei Pflicht-Pässe (V-565/V-566)** aus Spielkamera und in echter Bildschirmgröße:
   - a) **Silhouette:** alles schwarz vor Grau, liest sich die Geometrie?
   - b) **Graustufen:** ohne Farbe; gibt es klare Hell-, Mittel- und Dunkelmassen, und liegt der stärkste Kontrast auf dem Fokus?
   - c) **Thumbnail:** stark verkleinert und leicht unscharf; bleiben Fokus, Weg, Spielfläche und Tiefe lesbar?
8. **Terrain-Lieferungen (V-568):** zusätzlich die 4 Diagnose-Ansichten aus derselben Spielkamera (Albedo unbeleuchtet, Grau-Material, Material-ID, final) und der Vergleich A/B/C/D. Befunde: Tarnfleck bzw. Konfetti, Halo am Ufer, Flecken, die wie eigene Biome wirken, Variation innerhalb eines Materials stärker als zwischen Materialien, Flimmern bzw. wanderndes Muster bei Kamerafahrt.
9. **Spielgeschwindigkeit (V-568):** mindestens ein Pass bei bewegter Spielkamera in Spieltempo, nicht nur im Standbild.
7. **Kontakt-Schatten:** Der Schatten berührt die Basis, folgt der Silhouette, ist kein Blob und wird vom Terrain empfangen.

Alter Silhouetten-Pass (V-565): Kamera 2, alle Objekte schwarz vor Grau. Lies ab, was dort steht: Fokus, Gruppen, Figuren. Verschmilzt etwas mit dem Terrain oder mit dem Nachbarn, ist das ein Befund für K3/K7.

## Bewertung 0–10 je Kriterium
Herkunft: QA_RULEBOOK_ENVIRONMENT_R1 §3, ergänzt um den Kanon.

| Nr. | Kriterium | 10 = | 0 = |
|---|---|---|---|
| K1 | **Geschichte lesbar** | Ohne Text erkennbar, was hier los ist; der Ein-Satz des Konzeptblatts ist sichtbar eingelöst; die Szene liest sich als ein handgemachtes Objekt | zufällige Deko |
| K2 | **Farbkonzept** | Farb-Skript der Szene eingelöst; Palettenrollen V-402 und 60/30/10; Akzentfarbe nur mit Bedeutung; Terrain nie die lauteste Fläche | bunt ohne Rolle, grelles Grün, Mittelgrau |
| K3 | **Komposition und Bildanatomie** | Der Fokus gewinnt über ≥ 2 Mittel; drei Tiefenebenen lesbar; Gruppen 1 : 3 : Rest; Negativraum atmet; keine Reihe, kein Teppich, keine Scheibe; Graustufen- und Thumbnail-Pass bestanden | hingewürfelt, Props auf einem Teller |
| K4 | **Erdung (Etherington)** | Eingraben, Kontakt und Überlappen mit Ursache an jedem Objekt; Kontakt-Geometrie bricht jede Fuge; Speckle-Übergang statt Verlauf | aufgeklebt, schwebend, harte Fußkante, Blob-Schatten |
| K5 | **Modell-Verständnis** | Jedes Element steht, wo es nach Ortsbiografie hingehört (Entstehen, Nutzen, Vergehen, Bewachsen) | Arten und Props ohne Standortlogik |
| K6 | **Eine Welt** | ein Licht-Rig, ein Knet-Material, eine Palette; Kits lesen sich zusammen | Stilbruch, fremdes Licht, fremdes Material |
| K7 | **Vielfalt ohne Rauschen** | 70/20/10: Ruhe, Struktur, Bedeutung; Form-DNA einheitlich; Lebensanker sichtbar; Abwechslung in Größe, Drehung und Art; Signatur 1 Hero + ≤ 2 Echos; Silhouette lesbar | monoton oder wirr |
| K8 | **Referenz-Nähe** | Hält den Vergleich mit Georgs Referenz bzw. dem RA-Original 1:1 aus | kein Bezug, Quelle „verbessert“ |
| K9 | **Innerweltliche Logik** | Jedes Element hat erkennbar Herkunft und Grund; die Szene trägt aus jedem Winkel | nur für einen Winkel arrangiert |
| K10 | **Figuren** (nur wenn vorhanden) | KFB-Augen und E2-Lider an jeder Variante, Blick lesbar, Pose und Kontakt glaubwürdig, Knete sichtbar | Augen fehlen, Schielen, Gleiten, Puppenpose |

**Bestanden:**
- Gate grün;
- Mittelwert ≥ 8;
- kein Kriterium unter 6;
- K9 ≥ 7;
- K10 ≥ 7, wenn Figuren vorhanden sind.

## Figurenabnahme (einzelne Figur im Proof Stage, keine Szene)
Kalibriert nach dem ersten Lauf am 20.10. (Spielzeugsoldat).

**Es zählen nur:**
- K4: Füße bzw. Kontakt, Schatten folgt der Silhouette, kein Blob;
- K6: Knete sichtbar, ein Licht;
- K10.

K1–K3, K5 und K7–K9 sind n/a.

**Keine Befunde in der Figurenabnahme:**
- Kontakt-Geometrie bzw. Terrain am Fuß. Der Proof Stage ist der Standardboden; Gebiet 4/15 gilt erst in der Szene.
- Kit-Facetten an KayKit-Figuren: Kit-Modelle werden nicht geknetet (QA_RULEBOOK §0b), die Knete kommt aus dem Material.
- Schattenrichtung zwischen verschiedenen Kameras. Der Proof Stage hat ein festes Licht, die Kameras stehen in verschiedenen Azimuten; vergleiche nur innerhalb eines Bildes.
- Einwärts konvergierende Pupillen beim Zielen bzw. Fokussieren auf Nahes. V-518 verbietet nur das Auswärts-Schielen.
- Ein gewollter Ausdruck (z. B. zusammengekniffene Augen beim Zielen), solange beide Augen symmetrisch arbeiten.

**Immer ein Befund:**
- fehlende Augen bzw. Lider an irgendeiner Variante;
- Waffe oder Requisit im Gesicht bzw. Körper (Durchdringung);
- Waffe nicht auf der Unterarmachse (V-536, Ausnahme Hiebwaffen q136);
- schwebende Füße;
- fremdes Material ohne Knete.

## Ausgabe des Kritikers
1. Punkte K1–K10.
2. Mängelliste: was, wo (Kamera und Bildbereich), welche Regel (Kanon-Abschnitt bzw. V-Nummer).
3. Gesamturteil PASS oder REWORK.

Keine Adjektive, kein Lob, keine Code-Vorschläge.

## Stopp-Regel
Herkunft: QA_RULEBOOK_ENVIRONMENT_R1 §5.
- **Zwei Reparaturen ohne Punktgewinn** am selben Kriterium: Stopp. Bericht an WS0 mit Bildern, Punkten und vermuteter Ursache.
- **Ein Kriterium unter 4** nach der ersten Runde: Das Konzept ist falsch, zurück zum Konzeptblatt.

Georg sieht nur Szenen, die bestanden haben, oder einen Stopp-Bericht.

## Auftrag an den Kritiker (zum Kopieren in den Subagent-Prompt)
> Du bist der blinde 3D-Kritiker für KFB. Lies `CANON_3D/CRITIC_3D_R1.md` und `CANON_3D/CANON_3D_R1.md` und das Konzeptblatt `<pfad>`. Sieh dir die Bilder `<pfade>` an. Bewerte K1–K10 nach der Tabelle, liste Mängel mit Kamera, Bildbereich und Regel. Urteil PASS oder REWORK nach der Bestanden-Regel. Keine Code-Vorschläge, keine Adjektive.
