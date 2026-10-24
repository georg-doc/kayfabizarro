# WS0 → WSA work · Bauauftrag HyperNorm-Welt R2 · 360°-Sphären mit Rabbit-Hole und Autopilot, mit Ton von Anfang an · 25.10.2026 (V-738, Georg Hub q199: „ja, so“; ersetzt b218)

## Tier 0
1. **Ziel:** eine begehbare HyperNorm-Welt aus 360°-Sphären als neuer Bereich „Experience“ in der bestehenden HyperNorm-Curator-Site (https://kfb-hypernormalisation-curator.frizzlebob.chatgpt.site). Keine neue Site, der Curator selbst bleibt unverändert.
2. **Verbindlich:** `30_DECISIONS/replies/KONZEPTBLATT_HYPERNORM_SCENELET_R2.md`. Es legt fest: Sphären, die zwei Modi Rabbit-Hole und Autopilot, die ersten drei Sphären, Ton, Leistung und Gates. R1 und b218 sind ungültig.
3. **Ton ist Teil des ersten Baus, nicht später** (Georg 25.10.). Gebaut wird als Modul nach `SPEC_MODULAR_SITE_STAGE_R1`, auf einem `wsa/*`-Zweig, als Draft-PR, kein Merge.

## Bild
- **Jede Sphäre:**
  - Kugel-Innenseite mit laufender Collage aus der H13-Engine (V-617; Quelle `tools/KFB-ToolBox/_inbox/KFB Billboard Kaleidoscope H13/…/KFB Billboard Kaleidoscope H13.dc.html` auf kayfabizarro `main`, kein Nachbau);
  - davor zwei bis drei durchscheinende Schalen für Tiefe;
  - wenige schwebende Dinge (Röhrenfernseher, gemalte Tür, KFB-Auge);
  - Look-Presets aus der Schnitt-Recherche (`replies/RESEARCH_HYPERNORM_EDIT_GRAMMAR_R1.md`).
- **Boden der Sphäre (Georg 25.10.):** Der Boden jeder Sphäre ist eine Karte als Kugel-Relief (Punktwolke aus Probe R2/R3), kreisrund eng auf die Sphäre zugeschnitten, als begehbares Terrain. Partikel-VFX: Die Kugeln stieben beim Gehen und bei Übergängen auf und finden zurück (GPU-Physik aus Probe R3). SFX: weiche Knet- bzw. Murmel-Klänge bei Schritten und Aufstieben über den Atmo-Bus. Je Sphäre eine passende Karte.
- **Erste drei Sphären:** Sendezentrale, Aktenrauschen, Dada-Garten, Inhalt wie im Konzeptblatt.
- **Rezept je Sphäre** als kleine JSON-Datei: Thema, Look, Quellen, Text, Klangschichten, Musik, Übergänge.
- **Varianten:** Beim Wiederbetreten zeigt eine Sphäre eine andere Variante (Seed).
- **Betreten:** Start im Curator vor einer schwebenden, leuchtenden Kugel. Hineingehen stülpt sie um, und man steht innen.

## Modi
- **Rabbit-Hole:**
  - Ich-Perspektive, Maus bzw. Wischen und WASD bzw. Pfeile, keine Karte und kein Menü.
  - Je Sphäre zwei bis drei versteckte Übergänge: kleine Kugel in der Sphäre, Wort in einer Caption, Pupille eines KFB-Auges, Fernsehbild, gemalte Tür.
  - Der Übergang ist ein Bildsprung (Match-Cut, Glitch).
  - Esc bzw. ein kleines Zeichen führt zur ersten Sphäre zurück.
- **Autopilot:**
  - Die Kamera gleitet selbst, im Takt der Musik.
  - Die Schnitt-Grammatik wechselt zwischen Hacken und Halten (Curtis-Shot ≥ 4 s, mindestens einer pro 16 Takte).
  - An Gabelungen biegt ein leichter Lenkimpuls ab, ohne Eingabe entscheidet der Zufall.
- **Wechsel:** Taste M bzw. Knopf. Nach 20 s ohne Eingabe läuft von selbst der Autopilot, eine Bewegung holt den Rabbit-Hole-Modus zurück.

## Ton (von Anfang an)
| Sphäre | Musik (Bus Musik) | Raumschichten (Bus Atmo) | Stimme (Bus Stimme) |
|---|---|---|---|
| Sendezentrale | `music/M2_endlose_steigung.m4a`, 0 dB | `audio/KS4_kristall.m4a` −6 dB, `audio/NA4_nacht.m4a` −10 dB | BNWN-Clips aus `bnwn01/`, räumlich aus dem jeweiligen Fernseher, 0 dB |
| Aktenrauschen | `music/M1_brainwave_flaeche.m4a`, 0 dB | `audio/KS5_tief.m4a` −6 dB, `audio/NA1_blaetterwind.m4a` −12 dB | einzelne BNWN-Phrasen als Stotter, −3 dB |
| Dada-Garten | Stems aus `music/s2_atembett/`: `0 Bass.mp3` 0 dB, `1 Keyboard.mp3` −4 dB, `2 Strings.mp3` +4 dB, `3 Synth.mp3` 0 dB (so tragen die Streicher statt des Keyboards) | `audio/KS1_angerieben.m4a` −8 dB, `audio/KS3_duett.m4a` −8 dB, `audio/NA2_bach.m4a` −10 dB, `audio/NA3_voegel.m4a` −14 dB | keine |

- **Ducking:** Spricht eine Stimme, sinkt die Musik um 8 dB (Anstieg 80 ms, Rückkehr 400 ms).
- **Übergänge:** Beim Sphärenwechsel blendet das neue Bett 4–12 Frames früher ein (J-Cut) und das alte über 1 Beat aus. Bei einem Smash-Cut gibt es 2–6 Frames Stille.
- **Kopfhörer-Modus (optional, ein Schalter):** eine binaurale Schicht unter den Klangschalen, −18 dB.
- **Start und Bedienung:** Ton startet nach dem ersten Klick bzw. Tippen (Browser-Regel). Lautstärke-Regler und Stumm-Knopf sind immer sichtbar.
- **Mixer:** Der Mixer gehört dem Ton-Studio (WS-Audio), WSA schreibt ihn nicht fort.
  - Geht das WS-Audio-Modul in der Curator-Site, wird es genutzt.
  - Sonst baut WSA WebAudio mit denselben Bus-Namen (`music`, `atmo`, `voice`) und derselben Ducking-Logik. WS-Audio übernimmt das später.
  - Im Return steht, welcher Weg es wurde.

## Material
**Ladeweg:** Die Dateien aus dem privaten Zweig werden in die Auslieferung der Curator-Site kopiert und liegen dort hinter dem bestehenden Zugang. Kein jsDelivr, kein raw-Link, kein Token. Das Laufzeit-Muster aus der Spec (jsDelivr bzw. raw von kayfabizarro) gilt nur für Öffentliches, also H13-Code und öffentliche Texte. Im Material gilt dieser Brief vor dem Konzeptblatt.
- **Privater Zweig:** `georg-doc/KFB-Stunt-Car-Race` `assets/hypernorm-r1` @029344a, 90 Dateien, 68 MB. Laden Datei für Datei mit Prüfsumme aus `MANIFEST.json`, kein Archiv.
  - `bnwn01/`: 69 Nora-Clips mit Manifest.
  - `audio/`: Klangschalen und Natur.
  - `music/`: M1, M2 und die Stems von S2.
  - `fundstuecke/`: Karte „The Moving Launch Date“ für das Kugel-Relief im Dada-Garten, Fnord-Gassenbild.
  - das Konzeptblatt R2.
- **Kugel-Relief:** Boden aller Sphären nach Probe R2/R3 (https://claude.ai/artifact/SYzKKT6g33hcHYCm8JWmxx, vollständiger Code in einer Datei), mit der Karte aus `fundstuecke/`.
- **Text:**
  - Propaganda und Slogans aus `replies/MEME_POOL_R1.json`.
  - Gemeinfreie Poesie und Dada (Stein „Tender Buttons“, Gutenberg #15396; Blake, Gutenberg #1934) und Akten aus dem UAP-Archiv der US National Archives. Diese holst du selbst und vermerkst Quelle und Rechte im Rezept.

## Abnahme
- **Gates als Prüfskript:**
  - Autopilot läuft 3 Minuten ohne Eingabe durch alle drei Sphären, mit Halte-Shots ≥ 4 s.
  - Ton gemessen per Mitschnitt des Master-Busses (MediaRecorder bzw. OfflineAudioContext, Auswertung mit einem LUFS-Messer wie `ffmpeg ebur128` oder `pyloudnorm`): Gesamtpegel −16 LUFS ± 2, True Peak ≤ −1 dBTP, kein Clipping, Kurzzeit-Lautheit springt beim Sphärenwechsel um weniger als 3 dB, keine Stille über 1 s außer gewollten Smash-Cuts.
  - Jeder Übergang führt in eine vorhandene Sphäre.
  - Keine gekauften bzw. privaten Dateien öffentlich (V-071, V-470): Nur die Einstiegsseite prüft den Zugang, und jede direkte Datei-URL der privaten Medien liefert ohne Zugang 401 bzw. die Login-Seite.
  - Gemeinfreies hat Quelle und Rechte im Rezept.
  - fps gemessen: Ziel 60 auf dem Mac Studio, mindestens 30 auf einem MacBook Air, höchstens drei Videotexturen gleichzeitig.
- **Für den Kritiker bei WS0:** je Sphäre 3 Bilder, ein 60-s-Video Autopilot und ein 60-s-Video Rabbit-Hole, beide mit Ton.
- **Return:** Adresse des Experience-Bereichs (hinter dem bestehenden Zugang), Commit, Prüfliste, fps, LUFS, Videos. Blockiert etwas: BLOCKED mit Ursache und kleinstem fehlenden Teil, dann am Rest weiterarbeiten.

## Grenzen
- Keine neue Site, kein Merge, nichts löschen, keine Tokens von Georg.
- Gekauftes und Privates bleibt privat.
- Das MVP-Paket (b214) und das Audit (b215) gehen vor, falls sie noch laufen.

## Nachtrag 25.10. abends · neues Material und Design-Vorrang (V-740)
- **Material-Zweig neu @2893a06** (597 Dateien, 171 MB). Zusätzlich:
  - `pd_pool/`: 506 gemeinfreie bzw. CC0-Medien aus 36 Kulturen, Motive, Filme, Regierungsakten, mit Manifest und Übersichtsbögen. Das ist das Collage-Material der Sphären, frei nutzbar.
  - `pd_audio/`: 18 gemeinfreie Schellack-Aufnahmen vor 1925 aus aller Welt plus Musopen, mit Manifest. Als Klang-Collage bzw. Cut-up in den Sphären nutzen, zum Beispiel Marsch und Rezitation in der Sendezentrale, Lachplatte und Kunstpfeifen im Aktenrauschen, Wiegenlied und Xylofon im Dada-Garten. Über den Bus `music` bzw. `voice`, im Takt geschnitten.
- **Design hat Vorrang:** Claude Design erstellt gerade Moodboard, Style-Frames und Storyboard (Hub b220). Baue bis dahin am technischen Gerüst (Sphäre, Modi, Ton, Rezepte), aber lege keinen eigenen Look fest. Der Look wird nach den abgenommenen Frames gebaut, und das Gate ist dann der Bildvergleich.
