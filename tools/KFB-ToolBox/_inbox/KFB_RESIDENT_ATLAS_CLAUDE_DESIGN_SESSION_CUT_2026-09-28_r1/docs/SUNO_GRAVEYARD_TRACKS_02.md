# Suno · Dancing Skeletons Graveyard · v02 (konsolidiert)

Entsteht aus zwei Vorlagen:

- `SUNO_DISCO_INSTRUMENTALS_01.md` (fünf Disco-Instrumentals)
- `SUNO_GRAVEYARD_TRACKS_01.md` (drei gesungene Friedhofstitel)

## Was von welcher Vorlage übernommen wird

**Von den Disco-Instrumentals kommt die Mechanik: Instrumental an, Lyrics-Box nur mit Struktur-Tags.**
- Der Friedhof braucht in Takt 9–10 echte Stille.
- Gesang füllt Pausen gern mit Ad-libs oder Atmern. Bei den v01-Titeln ist das Risiko hoch, dass die Lücke nicht still ist.
- Ein Instrumental mit `[Stop]` hält die Lücke zuverlässiger.

**Vom Friedhof kommen Form und Figuren.**
- Jede Phrase hat 8 Takte Groove und 2 Takte Stop. Der Einsatz kommt voll auf der Eins, denn dann stehen die Skelette wieder.
- Die drei Titel bleiben, weil die Szene sie schon im Dropdown führt.

**Die Tempi richten sich nach den Clips in `data/graveyard-01.json`:**
- Die Tänze sind House (A/B), Hip-Hop (Wave/Slide/Standard), Samba, Chicken Dance und Happy Idle. Alle laufen in ihrem eigenen Tempo.
- Die Tempi dieser Clips sind NICHT gemessen. Deshalb bleiben alle drei Titel im Bereich 112–126 BPM. Dort wirken House und Hip-Hop weder gehetzt noch zäh.
- Ossuary Oompah ging in v01 mit 138 BPM zu weit. v02 setzt 126 BPM: Tuba auf Halbe, Kick auf Viertel, gleiche Taktlänge wie bei den anderen.

**Gegen die Szenerie geprüft:**
- Sichtbar sind Kürbis-Laternen, Laternenpfähle, Gruft, Knochen und ein Bogentor mit Flügeln, die sich öffnen.
- Die Klangfarben lehnen sich daran an: Xylophon und Holzblock als Knochen, Orgel für die Gruft, Tor-Knarren als Intro.

In Suno: Custom Mode, **Instrumental an**. Die Style-Box bleibt unter 1000 Zeichen. Die Lyrics-Box enthält nur Tags.

---

## 1 · Bone Rattle Boogie · Swing-Disco · 120 BPM

Passt zu: Chicken Dance, House A, Samba, Hip-Hop (Roster Titel 1).

**Style**
```
swing boogie disco instrumental, 120 BPM, straight four-on-the-floor kick under swung hi-hats, walking upright bass slapped on the backbeat, barrelhouse boogie piano riff, brushed snare, xylophone runs as rattling bones, woodblock clacks, short muted trumpet stabs, every eight bars a hard stop of two bars of complete silence, then the whole band slams back exactly on the downbeat, cartoon spooky and cheeky, dry vintage room, tight punchy mix
```
**Lyrics**
```
[Intro: creaking gate, piano pickup]
[Groove: full band, 8 bars]
[Stop: 2 bars silence]
[Groove: piano riff, 8 bars]
[Stop: 2 bars silence]
[Groove: xylophone lead, 8 bars]
[Stop: 2 bars silence]
[Piano Solo: 8 bars]
[Stop: 2 bars silence]
[Groove: full band, 8 bars]
[Outro: rooster crow, final hit]
[end]
```

## 2 · Crypt Kicker Thriller · Horror-Disco-Funk · 112 BPM

Passt zu: Hip-Hop Wave, Hip-Hop Slide, Hip-Hop, House B (Roster Titel 2).
Führt Skeleton Shuffle Deluxe (112 BPM) und Crypt Kicker Thriller aus v01 zusammen.

**Style**
```
horror disco-funk instrumental, 112 BPM, four-on-the-floor kick with open hi-hat on every offbeat, rubbery slap bass, wah-wah rhythm guitar, spooky church organ chords, clavinet stabs, gated 80s snare, brass hits, wolf howl accents, every eight bars a dead stop of two bars with only a thin wind sound, then the groove drops back exactly on the downbeat, campy and theatrical, warm late-70s tape, wide stereo
```
**Lyrics**
```
[Intro: wind, organ chord]
[Groove: slap bass and kick, 8 bars]
[Stop: 2 bars, wind only]
[Groove: wah guitar enters, 8 bars]
[Stop: 2 bars, wind only]
[Groove: organ and brass, 8 bars]
[Stop: 2 bars, wind only]
[Wah Guitar Solo: 8 bars]
[Stop: 2 bars, wind only]
[Groove: full band, 8 bars]
[Outro: crypt door slam]
[end]
```

## 3 · Ossuary Oompah · Balkan-Brass-Polka · 126 BPM

Passt zu: Chicken Dance, Samba, House B, Happy Idle (Roster Titel 3).
Führt Toy Soldier Brass Riot (126 BPM) und Ossuary Oompah aus v01 zusammen.

**Style**
```
balkan brass polka instrumental, 126 BPM, oompah tuba on half notes over a four-on-the-floor kick, snappy marching snare, offbeat accordion stabs, frantic clarinet runs, muted trumpet, woodblock and bone clacks, toy piano accents, every eight bars a sudden freeze of two bars of complete silence, then the tuba restarts exactly on the downbeat, comedic Halloween beer hall, bright live band, big room energy
```
**Lyrics**
```
[Intro: accordion wheeze]
[Groove: tuba and snare, 8 bars]
[Stop: 2 bars silence]
[Groove: clarinet lead, 8 bars]
[Stop: 2 bars silence]
[Groove: full brass, 8 bars]
[Stop: 2 bars silence]
[Accordion Solo: 8 bars]
[Stop: 2 bars silence]
[Groove: full brass, 8 bars]
[Outro: tuba final note]
[end]
```

---

**Exclude Styles (für alle drei)**
```
vocals, singing, choir, rap, spoken word, lyrics, ambient pads, reverb wash
```

## Nach dem Rendern

1. Den ersten Schlag von Takt 1 und das Tempo messen, so wie bei Rubbish Groove. Die Werte aus dem Prompt nicht übernehmen.
2. Die Werte im Friedhof-Panel eintragen: BPM und 1. Schlag in Sekunden.
3. Mit „Takt 8 → Zerfall“ prüfen, ob die Stille auf Takt 9 fällt. Suno zählt die Takte nicht selbst; eine Lücke, die daneben liegt, am besten in Studio schneiden statt die Szene zu verbiegen.
4. Wer einen Hook mit Stimme will, nimmt die Lyrics aus v01. Das kostet Sicherheit in der Lücke.
