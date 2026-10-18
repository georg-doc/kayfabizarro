# WS0 → WS1 · Integrationsplan R1 für den langen Lauf (18.10.2026 · V-487)

**Lage:** Georg ist einige Stunden AFK. Alle drei Rechner laufen. WS1 hat frisches Token-Budget und bekommt die großen, tokenintensiven Integrationen. WSB baut weiter Assets (Reihenfolge: B11 r3 → B32 → B34 → B36 → B33). WS0 steuert, prüft und macht die Sprach-Probe (V-486).

**Regeln wie immer:**
- Vorlage zuerst; „Bestand vor Neubau“ (V-140).
- Je Stufe ein Eintrag in WS1_STATUS mit Vorschau-Link und Bild bzw. Clip.
- Merges nur mit Georg; Georgs Port und das Lab bleiben unangetastet; nur eigene PIDs beenden.
- Keine privaten Dateien in Git (V-427, V-433).

## 0 · Private Assets ohne Dropbox: Paket-Artifact (löst §87)
- Privates claude.ai-Artifact **https://claude.ai/artifact/MGwWwWaYDmcijVzfhd1Auk** (nur Georgs Konto). Abruf aus Claude Code mit dem Artifact-Werkzeug:
  1. `Artifact read` mit `url` und `path: "selftest.txt"`. Erwartet wird `KFB-PRIVATE-PACK-SELFTEST-OK`.
  2. `Artifact read` mit `paths: ["manifest.json","kfb_unpack.py.txt", …alle p/…-Teile]` und einem lokalen `out_dir` außerhalb des Repos.
  3. `python3 <out_dir>/kfb_unpack.py.txt <out_dir> <privat-ziel>`. Das Skript prüft sha256.
- **Inhalt P1:** Alien-Körper rimV1 (Dory, Hunky), 4 Pubs, Aiko-Bento, 8 Inseln B27, Dschungel-Computer B7 r4.
- **Inhalt P2:** B31 r3 Bots (6 Farben, Helm, Saug-Varianten), Stationen, Saugdüsen, Beute- und Ausrüstungs-Saugarm, Mündungsfeuer, Arbeits-Clips, Baustellen-Kit, Lorekeeper, **Rustwing Cruiser II** (browser.v3 + Karte).
- **B9-Steine** (rund 470 MB) passen nicht in ein Artifact. Bitte in WS1_STATUS die Bühnen nennen, die C4 wirklich braucht; WS0 packt genau diese.
- Funktioniert der Selbsttest bei dir nicht (z. B. anderes Konto), bitte sofort in WS1_STATUS melden. Dann bleibt nur der Weg über ein privates Repo, das Georg anlegen muss.
- **Rust Runner II:** Die Quelldatei ist byte-gleich mit dem bestehenden rust_runner (WSB-Prüfung). Georg wird gefragt, ob ein anderer Export gemeint war.

## 1 · Fahrzeug-Antrieb R1a + Cartoon-Deformation (zuerst, Georgs Wunsch für die Fahrtests)
- Modul `vehicleRig` mit `kfb-vehicle-rig.json` (V-481) für Georgs 6er-Auswahl, dazu Rustwing Cruiser II, sobald entpackt.
- Glow-Kern, Fahne, Flimmern, Funken; synchron zu Gas, Gang, Boost und Backfire.
- §86 **freigegeben:**
  - Deformer-Ereignisse `surge`, `ascent` und `brake` als Profilwerte;
  - Düsen-Anker unter dem Shell Deform Root;
  - ein Federsignal treibt Deformation, Fahnenlänge und Ton.
- **Bodennähe-Partikel für alle:** Stärke nach Höhe und Tempo, je Terraintyp.
- **Ton:** `propulsion_r1` (Jet, Turbine, Auspuff, Antigrav, Boost, Schaltknall) plus racer/flight/hyperdrive-Sets.
- **Abnahme:** Vorschau-Link Fahren, je Fahrzeug ein Bild in Fahrt, ein Clip Boost → Stauchen → Strecken.

## 2 · Fluff-Ernte R1: Saug-Modul + Kreislauf (V-479, V-480, V-484)
- **Ein Modul `kfb-fluff-suck` mit zwei Sauger-Typen:** `nozzle` (Bot und Spieler-Saugarm) und `beam` (UFO).
  - Phasen: Anlauf → Stretch am Ursprung → Plopp je Herkunft (Baum, Erde, Wasser) → gestreckter Flug → Einsaugen mit wandernder Beule.
  - Die Phasen sind Cues der Ereignis-Zeitleiste (V-389).
  - Instanzierte Partikel im VFX-Budget; ab einer Obergrenze werden sie zu einer Wolke zusammengefasst.
  - Spec: `SPEC_FLUFF_SUCTION_R1.md` §2, §7, §8.
- **Bots aus P2:**
  - Saugarm-Bot erntet in seinem Gebiet (POI-Block aus SPEC_NPC_PATROL_R1);
  - leert den Tank an der Station in seiner Farbe;
  - Stationseffekt 1 s: Füllstand auf null, Schimmer-Säule, Ton E01 – Transport nicht animieren (Hub q42).
- **Beute:** Ein besiegter Saugarm-Bot lässt `KFB_Loot_SuctionArm_<farbe>` fallen (schwebt nach V-450). Der Spieler trägt `KFB_Equip_SuctionArm_<farbe>` an `handslot.r`. Effizienz als Datum in der Loot-Tabelle (Wert TBD).
- **Destruction:** Gebäudeteile tragen `yields: fluff(color, count)`. Bruch = E04-Ton, dann Kügelchen (E05), einsaugbar.
- **Ton:** `fluff_suction_r1`, `fluff_economy_r1`, `ufo_harvest_r1` auf dem Audio-Branch.
- **Waffen-Clips des Arms** (aim, fire primary/secondary) und Mündungsfeuer: Helligkeit und Dauer legst du nach V-357 fest.
- **Abnahme:**
  - 10-s-Clip: Bot saugt drei Kugeln (Baum, Erde, Wasser), Tank voll, Station;
  - Clip: Spieler mit Saugarm;
  - Clip: UFO erntet ein Feld, falls die UFO-Bühne im Spiel ist.

## 3 · Kristall-Laternen (V-471, V-476)
- `kfb-gem.v1` liegt in der Abnahme-Bühne (`vendor/kfb-gem.v1.js`, MIT).
- Schach-Diorama B30 bzw. Laternen-Begleiter: Leuchten nachts mit `lantern`, `halo` und `pool`. Echte Lichter nur nach deinem Budget (≤ 6), Pfützen für alle.
- Begleiter-Logik (Kleiner-Prinz) erst später; jetzt nur die Darstellung.

## 4 · Danach (nicht in diesem Lauf, nur vormerken)
- **Bord-Diorama C.O.M.I.C.** (V-475, V-482): POI-Schleife, Banter-Auslöser, Glaskuppel, Strahl-Ereignis, TARDIS-Raumknoten. Wartet auf WSB B34.
- **Garage R1b** = In-Place-Editor (V-360/V-481); Requisiten kommen mit WSB B36.
- **KFB-Sprache** (V-486): Laufzeit erst nach Georgs Urteil zur WS0-Probe.
- **Hyper-Rush:** braucht Gelände-Streaming und 120 Hz (V-481).

## 5 · Rückmeldung
- Je Stufe ein WS1_STATUS-Abschnitt mit Vorschau-Link, Bildern bzw. Clip und offenen Fragen.
- WS0 prüft und legt Georg die Hub-Fragen hin. Blockiert etwas, steht im Status nur eine Frage, und du arbeitest mit der nächsten Stufe weiter.
