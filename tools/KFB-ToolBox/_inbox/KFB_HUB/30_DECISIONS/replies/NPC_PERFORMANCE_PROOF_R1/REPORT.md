# NPC Performance Proof R1 · [V-187] · 12.10.2026

Kein Beschluss, Georg entscheidet. Zahlen gemessen, Kritik = Urteil des Motion-Agenten. Abgelegt von der Steuerung aus dem Agentenbericht.

## Figur und Rig
- **Clown** aus dem Lab: `figures-b2/clown/Clown_NoEyes.glb`, Rig_Medium (23 Knochen).
  - Augen: Eye-Rig v6 an `eye_anchor.l/r` (EYE-CLEANUP-02, Kandidat, nicht PASS).
  - Geladen über `buildPlayable` (`src/residents/figure-b2.ts`), nur lesend: Lehm, FIG_SCALE 1,6, Augen.
- Gegenfigur: Farmer_A mit Idle_B; seine Augen sind eingefroren.

## Clips (KayKit 1.1 Rig_Medium, alle im Lab)
- `Idle_A` als Basis: 7 Zyklen auf genau 8 s, deshalb gleicht t=8 dem Bild bei t=0. Geteilt in Ober- und Unterkörper.
- `Hit_B` für den Zweifel: fest bei 0,3 s Clipzeit, Gewicht 0,35, nur Oberkörper.
- `Waving` für die Reaktion: 0,12–1,42 s, nur Oberkörper.
- Prozedural über Federn in geschlossener Form: Kopf folgt verzögert, Rumpf dreht nach, Lehnen nach hinten, Kopf neigt sich, der Hut schwingt nach.
- Beat-Sheets `beats.json` (v1) und `beats_v2.json`. Events nach dem Event Contract: EncounterBeat, PlayerApproached, ReactionPulse{kind}, Blink.

## Beweise (headless über seek(t))
1. **Kontaktbögen:** `contact_v1.jpg`, `contact_v2.jpg`, je 16 Bilder mit Beschriftung t / Frame / Beat.
2. **Reproduzierbarkeit: identisch.**
   - t = 0,5 / 2,1 / 3,9 / 5,5 s, zwei frische Seitenladungen, SHA-256 über die rohen Pixel: alle gleich, auch rückwärts gesucht.
   - Nötiger Fix: Der Mixer schreibt nur geänderte Werte. Deshalb wird jetzt nur das Additive zurückgenommen.
3. **Fußkontakt** (Fuß und Zehen, 241 Proben bei 30 fps, Toleranz 0,02 lab):
   - Rutschen 0,0000 und Schweben 0,0000 in allen Fenstern, v1 und v2.
   - Das hält, weil die Gesten auf den Oberkörper maskiert sind. Ohne Maske rutschte der Fuß bei Hit_B um 0,13–0,21 und hob sich beim Winken um 0,09.
4. **Tuning nur im JSON (v2):** Zweifel länger (bis 5,25 s), Winken knapper (0,65 s).
   - Füße weiter 0,0000.
   - Start/Ende: größte Knochenabweichung 0,00001.
   - Reihenfolge Augen / Kopf / Rumpf: Frame 1 / 4 / 10.

## Kritik
- **Timing:** Das Bemerken liest sich, die Augen gehen zuerst. Der Zweifel ist zu still: Das Lehnen (max. 11°) geht zur Kamera hin, nur die Arme tragen. v2 hält länger, wird aber nicht deutlicher.
- **Silhouette:** Klar ist nur das Winken. Der Zweifel sieht fast aus wie das Idle. Der Farmer ist zu groß und angeschnitten.
- **Überlappung:** In v2 laufen Ausblenden und Einblenden ineinander. Bei 5,33 s steht der Arm waagrecht, ein Mischbild.
- **Gesicht:** Skepsis-Lider kaum sichtbar; Mund und Brauen fehlen.

## Was fehlt
- Mund (PetMouth) und Brauen im Lab. Die Brauen sind beschlossen (V-179) und als Slice S9 geplant.
- Emanata als Knet-Plättchen (V-179), z. B. „?“.
- Squash: erlaubt bis 8 %, bei Stürzen mehr (V-179, V-180). Hier noch nicht genutzt.
- Eye-Rig braucht `snapshot()/restore()`, statt dass private Felder gesetzt werden.
- Die Augen des Farmers laufen nicht mit. Es gibt keine Seitenkamera für das Lehnen.
- seek() rechnet die Augen jedes Mal ab 0 nach (bis 1200 Schritte). Für den Proof reicht das, für das Spiel nicht.

## Starten
    cd ~/Developer/kfb-npc-proof
    PATH=$HOME/.local/node/bin:$PATH npm run dev            # Port 5195, Scrubber ?beats=beats_v1.json
    PATH=$HOME/.local/node/bin:$PATH node tools/proof.mjs   # zweites Terminal → out/
