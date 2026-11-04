# Rezept: neue Knet-Pop-ups ins Spiel und in die Asset-Bibliothek · R1 · 04.11.2026

Ein neuer Ordner mit Georgs Claymation-Bildern (ZIPs, Einzelbilder, Bögen auf Grau/Weiß, Dubletten mit „(1)“) läuft mit einem Aufruf durch. Danach folgt ein zweiter Aufruf für die privaten Bilder. Code: Branch `assets/popups-ingest-r1` (Spiel-Repo), Skripte in `scripts/assets/`. Vorlage ist der erste Lauf über „KFB Claymation HUD+Fluffer+Doors+Scenelets“: 392 neue Stücke, Katalog 577 Einträge, `assets/private` @bbe998de.

**Regeln:**
- Der Look kommt nur über kfbInsert („Einfügen“, in popupClayCore). Nichts neu belichten.
- Radios und HUD-Bögen gehören an die Kartenkante. Die Regel `aus` hält sie heraus.
- Private Bilder nie öffentlich, `src/private` nie committen.
- Nie in den gemeinsamen Spiegel `kfb-mvp/src/private` schreiben.

1. **Platz und Arbeitsordner.**
   - `df -h ~`: mindestens 9 GB frei.
   - Arbeitsordner `<A>` im Scratch anlegen.
   - Die Unterordner `popup_clay_r1` und `slop_r1` aus `src/private` hineinkopieren. Beim ersten Mal statt `slop_r1` den Ordner `inkblobs_r1` kopieren und `--uebernehmen` setzen.
2. **Trockenlauf.**
   ```
   python3 scripts/assets/ingest_popups.py "<Ordner>" --trocken --privat <A> --scratch <Z> --uebersicht <Z>/offen.png
   ```
   Das Skript entpackt die ZIPs nach `<Z>` und meldet vier Dinge:
   - `offen`: Bilder ohne Regel, als Übersicht in `offen.png`.
   - `fehler`: Bögen, die sich nicht sauber in die erwartete Stückzahl trennen lassen.
   - `dubletten`: doppelte Stücke.
   - `je_klasse`: was dazukommt.
3. **Regeln ergänzen** in `scripts/assets/popup_regeln.r1.json`. Eine Zeile je Bogen-Thema:
   - `muster`: Dateiname als Regex.
   - `klasse`: slop | truhe | tuer | portal | tresor | szene | wasser | pflanze | hoehle.
   - `familie` (slop) bzw. `thema`.
   - `stufe`: trash | normal | episch (nur Truhen).
   - `n`: Stückzahl des Bogens.
   - `raster`: Spalten und Zeilen, falls Motive sich berühren oder auf Tafeln stehen.
   - `praefix` und `tags` (region, stimmung, element aus kfb-themen-tags).

   Ein Bogen braucht immer `n`, sonst rutschen zwei verschmolzene Motive als eines durch. Unbenannte ChatGPT-Bilder kann nur ein Blick auf `offen.png` zuordnen. Danach den Trockenlauf wiederholen, bis `offen` und `fehler` leer sind.
4. **Lauf.**
   ```
   python3 scripts/assets/ingest_popups.py "<Ordner>" --privat <A> --scratch <Z> --kontakt <A>/popup_katalog_r1/kontakt
   ```
   Der Lauf:
   - schreibt die Bilder nach `<A>`;
   - schreibt den Katalog `src/data/popups/popup_katalog.r1.json`;
   - trägt neue Motive und Familien in `kfb-themen-tags.r1.json` ein;
   - baut den Slop-Atlas `slop_r1/slop_atlas.r1.webp` neu, wenn Slop-Units dazukommen;
   - schreibt das Feld `spiel` je Eintrag, also ob und wo der Verteiler das Stück stellt (`scripts/assets/popup_spiel.mjs`);
   - baut den Pop-up-Atlas `popup_atlas_r1/` neu, wenn Pop-ups dazukommen (`scripts/assets/popup_atlas.py`: Nah-Seiten 512 px, Fern-Seiten 256 px, Seiten höchstens 2048 px; von Hand mit `--popup-atlas`);
   - schreibt je Familie bzw. Thema einen Kontaktbogen.

   Bekanntes bleibt, wie es ist: Ein zweiter Lauf über denselben Ordner meldet `neu: 0`.

   Der Schnitt nimmt Reste des Nachbarstücks am Rand weg (Regel `randrest`: dünn, gerade und hart abgeschnitten, oder ein Krümel). Gemalte lose Teile wie Heiligenscheine, Noten und Funken bleiben. Für schon aufgenommene Stücke gibt es `--nachschnitt` (ohne Ordner): Es schneidet die gespeicherten Bilder nach und baut die Atlanten und Kontaktbögen neu.

   Kommen Slop-Units dazu, baut der Lauf auch das Gegner-Roster `src/data/mobs2d/slop-roster.r1.json` neu (`scripts/assets/slop_roster.mjs`). Name und evilAbility bleiben dabei erhalten.
5. **Prüfen.**
   - Die neuen Kontaktbögen ansehen: Schnitt sauber, kein Grund mehr sichtbar, keine Doppelten. Neu-Renderings desselben Motivs bleiben als Varianten.
   - `node test/unit/popupKatalog.mjs` muss PASS zeigen. Eine neue Slop-Familie gehört zusätzlich in `groupSets` von `src/data/mobs2d/inkblobs.r1.json`; der Test sagt, wenn sie fehlt.
   - `node scripts/assets/popup_luecken.mjs` zeigt die Lückenliste je Biom und Deck.
6. **Bilder privat pushen.**
   ```
   python3 scripts/assets/push_private.py <A> popup_clay_r1 slop_r1 popup_katalog_r1 popup_atlas_r1 -m "Pop-up-Katalog: <Ordner>"
   ```
   Das Skript prüft zuerst, dass das Repo privat ist und mindestens 9 GB frei sind. Es arbeitet in einem schlanken Klon und lädt nichts nach. Den Commit-Hash notieren.
7. **Code.**
   - Katalog, Themen-Tags, Regeln und gegebenenfalls `inkblobs.r1.json` auf einen Spiel-Branch, nie direkt auf den Integrationszweig. Pushen; WS1 merged.
   - Die Asset-Bibliothek (WSA) übernimmt die Kontaktbögen aus `assets/private/popup_katalog_r1/kontakt/`.
8. **Spielbild.**
   - Nach `vite build`: `PW_GPU=1 node scripts/place/verteiler-slop-truhe.mjs --out <Z>/beleg`.
   - Das Bild zeigt eine echte gemischte Slop-Gruppe und eine echte neue Truhe des Verteilers, von der Seite.
   - Danach `dist` und die Testausgaben löschen.
9. **Aufräumen.** Den entpackten Scratch `<Z>` und den Arbeitsordner `<A>` in den Papierkorb legen, nicht endgültig löschen.

**Im Spiel:**
- **Verteiler:**
  - wählt je Ink-Blob-Platz eine Slop-Familie nach Biom und Zone;
  - wählt die Truhe zuerst nach Stufe (Anteile in `einzelPlaetze.r1.json`), dann das Motiv;
  - stellt Scenelets mit mehr Knet-Kieseln an den Fuß (`dressing.je_klasse`).
- **mobs2d:** mischt die Gruppe aus der gewählten Familie und nimmt nur selten einen Fremden dazu (`fremdBeiFamilie`).
- **popupClayCore:** liest den Katalog.
- **Nahbereich:** Die Sichtgarantie (1–2 Pop-ups im Nahbereich ohne Hauptziel) bleibt, wie sie ist.
- **Später, nicht hier:** Verhalten der Slop-Units (Angriff, Reputation) und die Loot-Tabelle.
