# BRIEF WSB · B44 · KayKit Fluff-Farm (Scenery + Scenelet) · R1 · 2026-10-19 · WS0
**Register:** V-549. **Reihenfolge:** nächster Bau. Erstes Diorama, das als **Scenelet** (`kfb.scenelet/1`, Entwurf + deine Anmerkungen) für die Bühne (V-548) geliefert wird.

**Tier 0**
1. Cozy, bunte Farm-Szenerie aus KayKit:
   - die 4 Farmer aus KayKit Mystery Series 6 / Character 12 (Juni 2026);
   - Schubkarren, Möhren, Salat;
   - helles Kornfeld, Zäune, KayKit Nature;
   - roter KayKit-Traktor.
2. Dazu 3 aktive Cube Pets als Hof- und Nutztiere (Pet-Studio-Rigging, KFB-Augen, vorerst ohne Mund) und bunter Fluff aller Sorten an Bäumen und auf dem Feld.
3. Abnahme über den Prüfstand (QA V-520) **plus** Lieferung als Scenelet mit Terrain, Skydome-Hinweis, Licht, Texturen (Georg: Bühne immer im Welt-Kontext).

## Block
**Quellen**
- **Farmer:**
  - KayKit Mystery Series 6 / 12 (Kauf-Asset, privat). Georgs Promo-Referenz: `B44/georg_refs/GEORG_kaykit_farmers_promo.png`.
  - Das Pack liegt lokal noch nicht. Georg lädt es von Patreon nach `3D ASSETS/` (bzw. sagt den Pfad). Bis dahin mit Szenerie, Pets und Fluff anfangen.
- **Traktor:** roter KayKit-Traktor, bitte in den KayKit-Packs suchen (z. B. Bits Bundle). Später wird er ein KFB-Fahrzeug (`kfb-vehicle-rig`, Joyride-Einstieg V-534); dafür jetzt schon Sitz-Anker + Rad-/Achs-Knoten sauber benennen.
- **Szenerie:** KayKit Nature bzw. Forest, Zäune, Feld-Props (Möhren, Salat, Kürbis o. Ä.), Schubkarren aus der Promo, Heuballen. Lieber KayKit als Kenney, wegen des Looks; Lizenz je Asset im RETURN.
- **Cube Pets:**
  - `media/3D_Assets/GLB_cube-pets` (Registry `glb-cube-pets.json`), Rigging wie im KFB Pet Studio (`cube-pet.js` in den TableDiorama- bzw. Pet-Studio-Ordnern).
  - KFB-Augen (E2-Lider, Lid = Haut gemessen), kein Mund.
  - Immer 3 aktiv in der Szene.
- **Fluff:**
  - Fluff-Kugeln in allen Akzentfarben (V-426/V-484): an Bäumen hängend (Anker `KFB_Fluff_Spawn` je Ast), auf dem Feld liegend in Nestern (Dreier-Regel).

**Szene**
- **Kornfeld:** hell, goldgelb, als Knet-Ähren-Feld; dazu Feldwege, Zaunlinien, eine Hof-Ecke mit Traktor und Schubkarren, Gemüsebeete.
- **Farmer-Posen** wie in der Promo:
  - Hut schwenken;
  - Daumen hoch an der Schubkarre;
  - auf die Harke gestützt;
  - Schubkarre mit Möhren.
- **„Fallobst“:** Fluff fällt vom Baum, hüpft und kullert.
  - Du lieferst die Spawn-Anker und eine Beispiel-Spur `path:arc` + Hüpfer im Scenelet.
  - Die Laufzeit-Animation macht die Bühne bzw. WS1b.
- Alles cozy, bunt, lebendig; nichts steckt ineinander, nichts schwebt (außer Fluff am Ast).

**Lieferung (neu: Scenelet)**
- Diorama-GLB + Figuren/Pets als eigene GLBs.
- Für die Bühne jeweils als **Base64-`.txt`**: Artifacts liefern kein `.glb` aus. sha256 über die Original-GLB.
- **`fluff_farm_01.scenelet.json`** nach `SPEC_SCENELET_R1_DRAFT` mit deinen Erweiterungen:
  - `units`/`space`;
  - Darsteller mit Clips bzw. Posen;
  - Pets mit `procedural`-Idle;
  - `world.entrances`;
  - Palette;
  - Audio-Verweise: Atmos `atmos_dioramas_r1` bzw. Kreaturen-Sounds `creatures_r1`, soweit passend.
- Ablage `50_BLENDER/B44/scenelet/`. WS0 bindet es in die Bühne ein.
- **Prüfstand-Bögen wie gewohnt:** Figuren mit Augen Ruhe / halb / zu, Diorama-Bogen, Spielkamera.
