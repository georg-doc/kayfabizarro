# Siebenmeilenstiefel R1 · RETURN (WSB, 17.11.2026)

**Auftrag:** WS0-Nachricht vom 17.11. (Georgs Idee V-1885).
1. Tiny-Treats-Stiefel in KFB-Rot mit dunkelroter Sohle, Knete, fest an den Fußknochen von FB und einer KayKit-Medium-Figur, möglichst ohne die Füße auszublenden.
2. Clip-Befund für die Laufstufen.

**Prüfwege nach V-1887:** Look auf der Proof-Stage v1.2.7, Bewegung auf der Kampfbühne im Spiel (`buehne=r1`, Kameras `fb_seite` und `fb_dreiviertel` aus `test/lib/buehne.mjs` des Stamms @1bfb5d6b).

## 1 · Stiefel
- **`glb/KFB_Siebenmeilenstiefel.r1.glb`** mit Knoten `KFB_Stiefel_L` und `KFB_Stiefel_R`. Gebaut mit `scripts/stiefel_r1.py` (Blender, headless).
  - Quelle: Tiny Treats Homely House 1.0 FREE, `boots.gltf`, lokale Kopie (WS0 nennt kayfabizarro @bf1a7ca1). Ein Netz mit beiden Stiefeln, Palettentextur.
  - Das Paar ist nach losen Teilen getrennt (je 15 Teile), die Form ist unverändert.
  - **Farbe:**
    - Schaft KFB-Rot `#d62a2a`, Sohle dunkelrot `#6e1416`.
    - Die Sohle ist die helle Palettenfläche im unteren Band, damit folgt die Farbgrenze der Sohlenkante des Modells.
    - Einen festen Hex-Wert für KFB-Rot habe ich im Hub nicht gefunden; beide Werte sind Entwurf.
  - **Stiefelraum:** Ursprung Sohlenmitte, +Y oben, +Z Spitze.
- **Proof-Stage v1.2.7** (`--type prop`): **ABNAHMEFÄHIG**. G2, G3, G5, G6 PASS; G4 WARN, weil der Stiefel aus losen Teilen besteht. Kontaktbogen: `belege_r1b/KFB_Siebenmeilenstiefel.r1_contact_sheet.png`.

## 2 · Sitz an FB und am KayKit-Barbaren (`data/stiefel.contract.r1b.json`)
- **Gemessen an der Spielfigur auf der Kampfbühne:** FB als Standard-Spielfigur, der Barbar mit `char=adventurer-barbarian` (Rig_Medium).
  - Fuß-Hüllquader in der Ruhepose (Punkte mit Gewicht ≥ 0,5 auf foot/toes), Stiefel ohne Drehung.
  - Breite × 1,25 und Länge × 1,15 passen in die Außenmaße; die Sohle sitzt 1,5 % der Stiefelhöhe unter der Fußkante.
  - Ergebnis als `matrix_gltf_local` am Knochen `foot.l` bzw. `foot.r` (Gruppe mit `matrixAutoUpdate=false`, wie der Jetpack-Anker).
  - Beide Seiten bekommen die größere der zwei Skalen.
  - Beim Barbaren zählen zusätzlich seine Schienbein-Punkte bis Höhe 0,30 (`HUELLE_Y`), damit seine grauen KayKit-Original-Stiefel ganz im roten Stiefel verschwinden.
  - Skala FB 0,730, Barbar 0,820.
- **Füße bleiben an**, nichts wird ausgeblendet; die Stiefel umschließen Fuß und Zehen.
- **Abdeckungs-Gate:** Fußpunkte gelten als verdeckt, wenn Strahlen nach ±x, ±z und unten einen Stiefel treffen (`data/messung_*.json`).

| Stufe (Spiel-Eingabe) | FB unverdeckt | Barbar unverdeckt (inkl. Original-Stiefel-Punkte) |
|---|---|---|
| Ruhe | 1 / 120 | 12 / 620 |
| Gehen (walk) | 1 / 120 | 13 / 620 |
| Joggen (W) | 1 / 120 | 11 / 620 |
| Rennen (run) | 2 / 120 | 17 / 620 |
| Sprung | 2 / 120 | 19 / 620 |

- **Rest:**
  - In der Ruhe sind es Punkte genau am Sohlenrand auf Bodenhöhe, im Bild nicht sichtbar.
  - In Bewegung sind es beim Barbaren Hautpunkte hinten am Knöchel, kurz unter dem Schaftrand; sie hängen teils am Schienbein und treten beim Abrollen aus. Mögliche Abhilfe ist ein etwas höherer oder weiterer Schaft.
- **Bilder:**
  - `belege_r1b/SIEBENMEILEN_R1B_kampfbuehne.jpg`, Einzelbilder in `belege_r1b/kampfbuehne/`.
  - Die Spielsteuerung läuft relativ zur Spielkamera; beim Rennen läuft die Figur deshalb von den festen Bühnenkameras weg und wird klein.
- **Hinweis:** Die Sitzrechnung aus der Web-Kanon-Datei FB r1j passte nicht, weil FBs Füße im Spiel größer sind. Gültig ist nur der im Spiel gemessene Sitz; der Zwischenstand steht auf der Löschliste.

## Blinder Kritiker (ein Lauf auf dem ersten Stand)
Urteil **REWORK**:
- **Stiefel:** liest sich als Stiefel, Schaft klar rot, Sohle klar dunkelrot. Die „Flecken“ sind die Knet-Struktur des Clay-Moduls der Proof-Stage.
- **FB:** Stiefel sitzen an beiden Füßen in Ruhe, Gehen und Sprung; das Rennen war zu klein bzw. aus dem Bild.
- **Barbar:** Die grauen KayKit-Original-Stiefel schauten seitlich heraus. Behoben mit `HUELLE_Y` und gleicher Skala für beide Seiten.
- **Bildausschnitt:** kürzere Laufzeiten vor der Aufnahme, damit die Figur bei den festen Bühnenkameras bleibt.

Nachgeprüft von mir auf der Kampfbühne (Bilder r1b); ein zweiter Kritiker-Lauf ist nicht vorgesehen.

## 3 · Clip-Befund Laufstufen
`data/clipbefund_laufstufen_r1.md`. Kurz:
- **Heute:** Gehen Walking_B (1,12 m/s), Laufen Running_A (3,08), Sprint Running_B (4,88). Alle drei innerhalb von ×0,8–1,25.
- **Sauber bis ×1,25**, Cartoon-Bereich etwa bis ×1,6 (Schätzung, auf der Bühne noch zu messen). Running_B ist der schnellste KayKit-Lauf.
- **Turbo:** Running_B bis ×1,6 plus Vorlage im Code; darüber fehlt ein Clip „Sprint gestreckt“.
- **Roadrunner:** fehlt ganz (Wirbelbeine).
- **Start, Bremse:** KayKit nur als Notlösung (Jump_Start/Dodge_Forward, Dodge_Backward/Jump_Land). Eigene Clips nötig.
- **Kurvenlage:** im Code lösbar (Neigung um die Hüfte wie FLY_KIN); optional ein Überlagerungs-Clip.
- **Vorschlag:** Clip-Paket nach dem Muster der Jetpack-Clips r2c. Auf Zuruf baue ich es.

## Für WS0/WS1 (Einbau ist Code)
- **Garderobe:** Stiefel an `foot.l`/`foot.r` mit den Matrizen aus dem Vertrag (je Figur). Die Füße bleiben sichtbar und werden umschlossen.
- **Weitere Figuren:** Je Figur muss der Sitz an der Spielfigur gemessen werden; das Skript macht das automatisch (`scripts/_wsb-stiefel-r1.mjs`, Kampfbühne). Bei Figuren mit eigenem Schuhwerk setzt man `HUELLE_Y` auf dessen Oberkante.
