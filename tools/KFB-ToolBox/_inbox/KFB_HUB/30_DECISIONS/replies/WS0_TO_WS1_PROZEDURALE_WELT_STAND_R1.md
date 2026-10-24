# WS0 → WS1 Lead (+ WS1b, WS1d, WS-NPC, WS-Audio) · 25.10. · Prozedurale Welt hat Vorrang: endloser Cartoon-Roadtrip (V-746)

**Stand 25.10. abends (V-756):** Georg hat entschieden, dass WS0 die Slices S1–S3 und den kfb-place-Laufzeit-Adapter selbst baut (Zweig `game/proc-world-ws0` im privaten Repo KFB-Stunt-Car-Race), zusammen mit WSA und Claude Design. **Von WS1 bitte nur noch:**
1. Schritt 0: das Konzept `docs/PROZEDURALE_WELT_KONZEPT_R1.md` (R1.5 bzw. R1.6) und `PROZEDURALE_WELT_LUECKEN_R1.md` auf `ws1/status`, damit WS0 darauf aufbaut.
2. Den Fix aus `game/mvp-r1-ws0` @0f48d11 nach `kfb-planet` übernehmen (HUD 3D Standard, Neuladen bei nackter Adresse).
3. Neue Spielstände wie bisher nach `game/mvp-r1` spiegeln und melden; WS0 zieht sie in `game/proc-world-ws0`.

Der Rest dieses Briefings bleibt als Plan für WS0 stehen.

---

**Tier 0**
1. **Georg 25.10.:** Die prozedurale Welt kommt jetzt vor Chatterbox-Feinschliff und Details. Chatterbox läuft vorerst nur mit Sprechblasen; die Silben-Stimmen bleiben hinter `chat=syl` und werden nicht weiter getunt.
   - Freigegeben ist auch die „Ebene“: Stadtzonen bekommen schon bei der Weltgenerierung ein flacheres, welliges Relief (V-747, Konzept §5.10). Bedingung nach V-736: nur nahtlos über die WSB-Einbettung (N36, V-711, V-716). Keine eingestampften, ungestalteten oder platt aufliegenden OSM-Zonen und kein Kitbash echter Landmarken (REJECT §5.10a, V-708). Die Kölner Tasche geht erst mit einem Vorher-nachher-Bild an Georg.
   - V-746/V-747 heben „Bau erst nach dem MVP“ aus V-646, V-705 und V-708 für S1–S3 auf. Für Splats gelten weiter V-731, V-733 und V-736 (Bildwirkung zuerst, niedrige Priorität).
2. **Ziel in Georgs Worten:** ein endloser surrealer Cartoon-Roadtrip. Biome, Gelände, Farben und Musik wechseln ständig. Unterwegs gibt es Begegnungen aus allen unseren Pools, modular und einzeln optimierbar, so wie wir sie produzieren, testen und freigeben.
3. **Erst vorhandene Teile verbinden, nichts neu erfinden.** Belegt vorhanden sind:
   - Schwungflug `flight=elan` (Figur und Racer);
   - `world=endless` mit sechs Biomen, Wetter, Tageszeit und Licht über das Rig;
   - Jukebox nach Biom (WS-Audio);
   - Bewohner und Tratsch;
   - `kfb-fluff-suck` in der Richtung `suck`.

   Noch nicht gebaut und deshalb in Schritt 0 als Lücke mit Owner zu führen:
   - Regie R0 mit `kfb.scene/1` (Konzept §8);
   - Fahrzeug-Symbol zum Rufen im HUD 3D;
   - Fahrer bis zur Hüfte im Dach (WSB-Job J-7: Sitz-Anker je Racer, Lenkrad-Griffpunkte, Hineinhüpf-Clip; WS0 fordert ihn bei WSB an, bis dahin Platzhalter-Sitz);
   - Richtung `build` in `kfb-fluff-suck` (V-533).

   Kein zweites Terrain- oder Renderer-System, ein Licht-Rig, Kanon wie bisher.

## Schritt 0 · Konzept auf GitHub (zuerst, kurz)
- `docs/PROZEDURALE_WELT_KONZEPT_R1.md` im letzten Stand auf `ws1/status` (R1.5 bzw. R1.6 Stadt-Baukasten), ergänzt um Georgs Gliederung unten als R1.7.
- Daneben `PROZEDURALE_WELT_LUECKEN_R1.md`: je Baustein eine Zeile mit drei Angaben:
  - gibt es schon (Schalter bzw. Datei);
  - fehlt (Owner, kleinste Probe);
  - blockiert durch.

## Schritt 0b · Bild-Paket je Slice vor dem Bau des Sichtbaren (V-740)
- Für jede Slice 4–8 Keyframes bzw. ein kurzes Storyboard aus dem Live-Stand, dazu Bild-Referenzen aus dem freigegebenen Look:
  - S1: Auto rufen, Einsteigen, Verschwinden, Flug;
  - S2: Biom-Übergang, Palette, Himmel, Ansicht der Kölner Tasche vorher/nachher;
  - S3: je Modul-Typ ein Bild.
- WS0 legt die Bilder Georg im Hub vor. Erst nach seiner Bildabnahme wird das Sichtbare gebaut; das Gate ist dann der Bildvergleich gegen diese Keyframes.
- Reine Mechanik (Zustandsautomat, Physik, Raster, Vertrag) darf parallel hinter einem Schalter vorbereitet werden.
- MiB-Turm und UFO kommen erst nach ihren eigenen Design-Paketen in den Pool (V-744, Hub b222).

## Gliederung (Georg 25.10.) → Slices, gebaut in dieser Reihenfolge
**S1 · Fortbewegung (alle Reise-Zustände, ein Zustandsautomat)**
- **Auto rufen:** Das Fahrzeug-Symbol im HUD 3D ruft das ausgewählte Modell herbei. Die Figur hüpft hinein bzw. steckt bis zur Hüfte mit Lenkrad im Dach (Hineinhüpfen aus M2 prüfen, WS1d; Fahrer im Dach = WSB-Job J-7, bis dahin Platzhalter-Sitz).
- **Auto verlassen:** Ein zweiter Klick verlässt das Auto, es verschwindet wie ein Reittier in WoW. Verschwinden über `kfb-fluff-suck` (`suck`, vorhanden), Entstehen über die neue Richtung `build` (V-533).
- **Flugmodus:** mit überarbeiteter Physik auf Basis von `flight=elan`. Zerstörung bzw. Goo nur als eigene Schicht hinter einem Schalter.

**S2 · Endlose Welt**
- Die Biom-Fahrt wird zur Hauptwelt: ständig wechselnde Biome, Geländeformen, Paletten (`look=terrain3`), Himmel nach Biom und Musik bzw. Klangbetten je Biom (WS-Audio).
- Übergänge nach Kanon, ohne harte Schnitte.
- Umgebung, Props, Natur, Fluff, Fundstücke und Einbettung nur über das Kern-Modul `kfb-place` (V-748 bis V-754, Georg q201). Regeldatei `CANON_3D/lib/kfb_place.r1.json` und Löser `CANON_3D/lib/kfb-place-core.v1.mjs` (rein, deterministisch, Golden-Test PASS) baut WS0 und liegt im Register-Zweig. **WS1b baut nur den Laufzeit-Adapter:** `placeCell` in `src/world/endlessVeg.js` ruft `placeChunk` und instanziiert das Rezept (BatchedMesh, 64-m-Zellen, Wind je Gruppe) hinter `veg=core`, Standard bytegleich. Konzept: `replies/KONZEPTBLATT_KFB_PLACE_R1.md`. Die P0-Bildrunde startet nach Georgs Abnahme der Style-Frames.
- Stadtzonen mit „Ebene“ als erste Zonenart (Kölner Tasche), nur nahtlos über die WSB-Einbettung (siehe Tier 0).

**S3 · Begegnungen als Module (Regie R0)**
- Ein Szenen-Raster um den Spieler.
- Ein Begegnungs-Vertrag (`kfb.scene/1`) mit drei Angaben: Auslöser (zufällig oder kontextuell), Platz im Gelände (Einbettung nur auftragen, V-716), Freigabe-Status.
- Nur freigegebene Module kommen in den Pool.
- Erste Module aus dem Bestand: Bewohner-Begegnung, ein Diorama, später MiB-Turm und UFO (V-744). Dazu das **Karten-Relief** (V-751): eine Karte aus dem Haupt-Deck des Spielers als Knetkugel-Gelände mit GPU-Partikeln (Proben R2/R3), groß genug für ein paar Runden; eine Runde auf ihr sammelt die Karte in den Almanach (Georg: eine Runde), sie fliegt sichtbar ins HUD. Danach Mindspaces, HyperNorm-Sphären und Splats, jedes als eigenes Modul, einzeln optimierbar.

## Für jede Slice
- Kriterien zuerst, dann messen. Ein kurzes Video aus dem Live-Stand zu Georg, A/B mit gleicher Kamera.
- Der Standard bleibt bytegleich, bis Georg PASS sagt. Neues läuft hinter einem Schalter.
- Merge über den Lead, Spiegel nach `game/mvp-r1`, Commit an WS0 melden.
  - Den Fix aus dem privaten Repo `georg-doc/KFB-Stunt-Car-Race`, Zweig `game/mvp-r1-ws0` @0f48d11 (Dateien `src/main.jsx`, `src/siteHash.js`), bitte nach `kfb-planet` übernehmen: HUD 3D ist Standard (V-743), und die nackte Site-Adresse lädt mit dem Start-Hash neu.

## Zurück
- Commit auf `ws1/status` und eine Zeile in `WS1_STATUS.md` je Slice.
- Offene Entscheide als Frage an Georg mit Bild, über WS0 in den Hub.
