# WSV · Hero-Run-Teaser schneiden (Reddit-WIP) · R1 · WS0 · 25.10.2026

**Tier 0**
1. Material ist nur, was im Spiel aufgenommen wurde: `KFB_HUB/60_VIDEO/hero_run_r1/raw/*.webm` (Bild VP9 1280×800, Spiel-Ton Opus). Nichts nachbauen, nichts generieren, keine Fremdbilder.
2. Ergebnis: ein Teaser von 30–40 s, 16:9 (1280×720, mittig aus 1280×800 geschnitten), H.264/AAC als MP4, dazu eine Hochkant-Fassung 1080×1350 für Reddit-Mobil, falls der Bildausschnitt trägt. Ablage `60_VIDEO/hero_run_r1/out/`.
3. Schnitt mit dem KFB-Video-Skill (Remotion). Georg sieht das Ergebnis als Video im Hub; vorher ein Standbild-Blatt mit 6 Momenten zur Kontrolle, darauf der Spielstand (game/proc-world-ws0 @7271288) und ein Satz, was abzunehmen ist (V-734).

**Shot-Liste und Absicht:** `replies/HERO_RUN_SHOTLIST_R1.md`. Die Reihenfolge ist ein Vorschlag; Schnitte im Takt der Musik.
- Kaltstart S01 (Luftbild), dann Tiefflug S02.
- Manöver-Montage: S03, S04, S05 mit Bullet-Time, S06.
- Parade S07: alle Racer, die in den Rohclips zu sehen sind (`S07_parade_*.webm`, ein Clip je Racer), je etwa 1,2–1,8 s, schnell geschnitten.
- Karten-Gelände S08, Schluss S09 (hohe Kamera).

**Musik** (Georg 25.10.: „einen coolen, passenden, treibenden Audio-Track aus unserem Pool“; für diesen öffentlichen WIP-Clip ausdrücklich gewünscht, Ausnahme zu V-598):
- Treibender Track aus dem Pool, instrumental aus den Stems gemischt, ohne Gesang:
  - Vorschlag „KFB Surf und Rockabilly“ (150 BPM), Ordner `KFB MusicalChatterbox/KFB Surf und Rockabilly (Twang-Gitarre, Slap-Bass, Orgel) Stems (150BPM)/`, alle Stems außer „Lead Vocals“ und „Backing Vocals“.
  - Alternativen zum Vorhören für Georg: „Big Bad Brain Wrestling 01 Stems (165BPM)“, „KFB E-Funk mit Talkbox … Stems (142BPM)“ sowie ein Track aus der RoadTrip JukeBox v2 (V-129, die Fahrmusik im Spiel; `KFB Island Worldbuilder Lab/public/private-audio/suno-roadtrip-jukebox-v2/`).
- Der Spiel-Ton aus den Clips (Motor, Boost, Landung, Whoosh) liegt etwa −10 dB unter der Musik. Boost, Landung und die Fassrolle dürfen kurz durchkommen.

**Abspann (4–5 s):**
- KFB-Wortmarke statisch: Kayfa in Tinte `#1f1a14`, Bizarro creme `#f6efd9` auf Rot `#b8361f`. Schrift Irish Grover (Google Fonts). Die animierte Wortmarke kommt später.
- Unterzeile „Work in progress · procedural cartoon world“.
- Credits, nur was im Bild ist:
  - „Environment: KayKit by Kay Lousberg“;
  - „Nature: Tiny Treats, Quaternius, Kenney“, nur falls im Bild;
  - „Dieselpunk vehicles: Meshy · creator TBA“ (Platzhalter, Georg sucht den Urheber);
  - „Music: KFB“.
- Keine Lizenz- oder Disclaimer-Zeilen.

**Speedlines** sind geparkt (Georg 25.10.) und in den Clips nicht drin.

**Look-Regeln:** keine Glitch- oder Neon-Effekte. Keine Kamera-Wackler und keine künstliche Bewegungsunschärfe; Hit-Stop gibt es nicht. Übergänge als harte Schnitte; höchstens ein Weißblitz auf dem Boost-Höhepunkt.

**Rückgabe:**
- MP4 plus Hochkant-Fassung;
- das Standbild-Blatt;
- `out/RETURN.md` mit Tracklänge, Schnittliste (Clip, Ein, Aus) und Render-Befehl.
