# Siebenmeilenstiefel R1c · Sneaker an FB und am Barbaren · RETURN (WSB, 17.11.2026)

**Auftrag:** WS0, 17.11. (Georg q746 TUNE): Kein Bein soll mehr zwischen Schuh und Körper zu sehen sein, in keiner Pose und keiner Laufstufe, und der Schuh soll sich als getragen lesen. Danach den Barbaren mitziehen.

**Verlauf:**
- Die Tiny-Treats-Stiefel habe ich erst als geskinntes Kleidungsteil gebaut, mit Schaft bis an den Rumpf.
- Georg hat sie verworfen („passt leider gar nicht“). Die Fußspitzen schauten heraus, die Stiefel waren zu groß, und es waren Deko-Props, keine Kleidung.
- **Plan B nach Georg:** die Sneaker der KayKit-Protagonisten, Vorlage Protagonist A (sein Bild). Weiß mit roten Akzenten, Socke mit farbigem Abschluss, Farbzonen einzeln umfärbbar.
- Ein Zwischenstand aus Protagonist B war zu hoch und las sich wie ein Plateauschuh; die Höhe ist jetzt beim Original.
- **Georg zum Stand b:** „Passt so“.

## 1 · Dateien
- **`glb_r1c/KFB_Sneaker_FB.r1c.glb`:** Knoten `KFB_Sneaker_FB` (SkinnedMesh, beide Füße), Knochen `toes/foot/lowerleg/upperleg` l/r.
- **`glb_r1c/KFB_Sneaker_Barbarian.r1c.glb`:** dasselbe, eingepasst auf den KayKit-Barbaren.
- **Fünf Zonen**, je ein Primitiv mit eigenem Material `KFB_Sneaker_<Zone>`:

| Zone | Teil | Farbe jetzt |
|---|---|---|
| Sohle | Sohle bis 4 cm | `#e6e2da` |
| Obermaterial | Kappe, weißer Schuhteil | `#f6f3ec` |
| Akzent | Seitenteil, Lasche (im Kit pink) | KFB-Rot `#d62a2a` (Entwurf, wie R1) |
| Socke | Socke über dem Schuhrand | `#f6f3ec` |
| Sockenrand | Streifen der Kit-Socke | Blau `#3f6fd1` (FBs Shirt, Kontrast zum Rot) |

- **Skript:** `scripts/sneaker_r1c.mjs`. Daten: `data/r1c/sneaker_fb.r1c.json`, `data/r1c/sneaker_barbarian.r1c.json`.
- **Umfärben:** Farben als JSON übergeben (`{ "Akzent": "#…", … }`) oder im Spiel je Material setzen.

## 2 · Bauweise
- **Schuh und Socke aus dem Kit-Bein:** Der Schuh ist im Kit Teil des Beins und mit den Kit-Gewichten gerickt. Bind-Raum und Knochen-Inverse sind bei Protagonist, FB und Barbar gleich (geprüft, |Δ| ≤ 1e-6). Der Schuh geht deshalb mit Fuß, Zehen und Knöchel mit wie das Bein selbst.
- **Auf den Fuß der Figur gesetzt** (Bind-Raum, Punkte mit Gewicht ≥ 0,5 auf foot/toes):
  - FB: Breite × 1,30, Länge × 1,25, Mitte 3 % nach hinten (die Ferse kippt beim Abrollen nach hinten), Höhe × 1,05 (flache Sohle), Sohle 4 mm unter der Fußkante.
  - Ergibt × 1,40 quer und × 1,39 längs gegenüber dem Kit-Schuh. FBs Füße sind größer als der Kit-Standardfuß.
  - Barbar: × 1,40 / × 1,35, Höhe × 1,10, Mitte 4 % nach hinten, wegen seiner eigenen Kit-Stiefel.
- **Socke:** radial auf das Schienbein der Figur gesetzt (Radius je Höhe + 8 mm, Barbar + 20 mm), sonst verschwindet sie in FBs dickerem Bein.
  - Beim Barbaren ist sie bis Höhe 0,31 gestreckt, damit sie seine grauen Stiefel bedeckt.
- **Einbau** (Code, WS0/WS1):
  - Wie das T-Shirt und die Rückenplatte über `bindeSkinTeil(THREE, fig, url, 'KFB_Sneaker_FB')` in `src/actors/fbAddons.js`, nach garment-system.r1 „skinned“: Knochen nach Namen, Geschwister des Rumpf-Netzes mit dessen bindMatrix.
  - Für Kit-Figuren heißt das Rumpf-Netz `<Name>_Body`, nicht `CharacterTemplate_Body`; `bindeSkinTeil` sucht heute nur `CharacterTemplate_Body`.
  - FBs Füße bleiben an; nichts wird ausgeblendet.

## 3 · Prüfung im Spiel (Kampfbühne `buehne=r1`)
- **Kameras:** `fb_seite`, `fb_dreiviertel` und neu `fb_hinten`.
- **Clips an FB** (über `prepareSourceAction`, je 8 Phasen gehalten): KayKit Walking_B, Running_A, Running_B, Jump_Full_Short und die Laufstufen R1b (Turbo, Roadrunner, Start, Bremse).
- **Barbar:** über die Spiel-Eingabe (Ruhe, Gehen, Joggen, Rennen, Sprung), denn eigene Clips nimmt das Spiel nur für FB an.
- **Gate:** Ein Fußpunkt der Figur (Bindhöhe bis 0,15) gilt als verdeckt, wenn Strahlen nach ±x, ±z und unten einen Schuh, den Rumpf oder das Shirt treffen. Die Strahlen laufen im Fußrahmen, damit ein geneigter Fuß nicht über den Fersenrand „frei“ zählt.
- **Messfehler in R1c behoben:** Gehäutete Netze brauchen je Pose eine neue Hülle, sonst verwirft der Strahltest Treffer. Die ersten R1c-Zahlen waren dadurch zu schlecht.

| Figur | Clip / Stufe | unverdeckte Fußpunkte (schlechteste Phase) |
|---|---|---|
| FB (256 Punkte) | Walking_B / Running_A / Running_B / Sprung | 16 / 11 / 19 / 28 |
| FB | Turbo / Roadrunner / Start / Bremse | 18 / 16 / 23 / 22 |
| Barbar (768 Punkte inkl. Kit-Stiefel) | Ruhe / Gehen / Joggen / Rennen / Sprung | 2 / 14 / 5 / 7 / 11 |

- Der Rest sind Punkte an Ferse und Sohlenrand, die nur in Extremphasen knapp am Schuhrand liegen. In den Nahaufnahmen (auch schräg vorn auf die Fußspitzen) sehe ich kein Gelb.
- **Bilder:**
  - `belege_r1c/SNEAKER_R1C_vorschau_b.jpg` (FB, von Georg abgenommen);
  - `belege_r1c/SNEAKER_R1C_barbar.jpg`;
  - Einzelbilder in `belege_r1c/kampfbuehne_fb/`, `belege_r1c/kampfbuehne_barbar/`;
  - Messung in `data/r1c/messung_kampfbuehne_*.json`.
- **Test:** `scripts/_wsb-stiefel-r1c.mjs`, Bindedaten mit `scripts/_wsb-stiefel-r1c-bind.mjs`. Beide laufen im Spiel-Arbeitsbaum unter `test/` und sind nicht committet.

## 4 · Proof-Stage v1.2.7
`KFB_Sneaker_FB.r1c` ist **ABNAHMEFÄHIG**: G2, G3, G5, G6 PASS. G4 WARN, weil die Kit-Teile offene Ränder haben (Socke und Schuh sind offen). Kontaktbogen: `belege_r1c/KFB_Sneaker_FB.r1c_proof_contact_sheet.png`.

## 5 · Blinder Kritiker (ein Lauf, nur Bilder)
Urteil **PASS mit Hinweisen**:
- **Erkennbarkeit:** Die Schuhe lesen sich bei beiden Figuren als getragene Sneaker, die mit den Füßen mitgehen. Kein Gelb an Zehen oder Ferse, nichts schwebt oder sinkt ein. Die Socken lesen sich als Socken mit blauem Rand.
- **Barbar:** Von seinem Original-Schuhwerk schaut nichts durch.
- **Hinweise (nicht nachgezogen, im Spiel auf Kameraabstand nicht sichtbar):**
  - Die Sockenkanten sind auf der Proof-Stage etwas zerknittert, mit dünnen Läppchen an der Socke.
  - Der Sockenrand ist bei FB von schräg vorn schmal.
  - Bei Joggen und Rennen läuft der Barbar am Bildrand aus der hinteren Kamera.
  - Auf Zuruf mache ich eine Runde R1d: Socke glätten und etwas höher.

## Kamera-Eintrag für `test/lib/buehne.mjs` (bitte übernehmen)
```js
// WSB-Wunsch 17.11. (Siebenmeilenstiefel R1c, Georg q746): hinten-schräg auf FBs Beine und Schuhe, wie Georgs Bild
fb_hinten: { blick: 'a', ab: 2.6, hoch: 1.2, zielHoch: 0.5, winkel: 50, fov: 40 },
```
In meinem Test steht er in der Kopie `scripts/buehne.stamm-1bfb5d6b.fbhinten.mjs`.

## Löschliste
Die verworfenen Zwischenstände (Tiny-Treats-Weg, Plateau-Vorschau), die Probeläufe und die Test-Zwischenkopien stehen in `BLINDE_KRITIK_R1/LOESCHLISTE.md` und warten auf Georgs Ja.
