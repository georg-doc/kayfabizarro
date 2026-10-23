# Suno-Ernte R2 · Orchester, Northern Soul, R&B · 2026-10-23 · WS0 (V-688)
**Lehre aus R1:** Brauchbar sind nur Stellen, an denen **ein Instrument allein** eine Melodie spielt. Gitarre und Synth waren ergiebig (18–30 %), Akkord-Instrumente wie Clavinet und Orgel sowie Bass kaum. Suno trennt Stems nur nach Gruppen (Strings, Brass, Woodwinds), nicht nach Einzelinstrumenten. Deshalb muss der Prompt die Instrumente **nacheinander solo** spielen lassen.
**Format:** In Suno „Instrumental“ an, STYLE rein musikalisch, LYRICS nur Struktur-Tags. Danach alle Stems exportieren und in `40_AUDIO/chatterbox_r1/suno_tests/<song>/` ablegen.

---
## 1 · Orchester-Charaktere (wie „Peter und der Wolf“), Priorität
**STYLE**
```
orchestral character showcase, 96 bpm, classical symphony orchestra, each instrument introduced alone with its own short theme, long unaccompanied solo passages, flute, oboe, clarinet, bassoon, french horn, trumpet, trombone, tuba, solo violin, solo cello, harp, sparse pizzicato strings between solos, expressive dynamics, dry concert hall, no choir, no vocals
```
**LYRICS**
```
[Intro: soft pizzicato strings]
[Flute Solo, playful and light]
[Oboe Solo, tender and sad]
[Clarinet Solo, curious, rising questions]
[Bassoon Solo, grumpy and comic]
[French Horn Solo, heroic call]
[Trumpet Solo, proud fanfare]
[Trombone Solo, sliding, mocking]
[Tuba Solo, slow and heavy]
[Solo Violin, longing, wide vibrato]
[Solo Cello, introspective, low]
[Harp Solo, mysterious arpeggio]
[Short Tutti]
[Outro: flute and cello alone]
```

## 2 · Northern Soul
**STYLE**
```
northern soul instrumental, 118 bpm, stomping four-on-the-floor beat, tenor saxophone lead, trumpet, trombone, hammond organ, tambourine, bright bass, long solo passages for saxophone, trumpet and organ, call and response between sax and trumpet, single line melodies, no vocals
```
**LYRICS**
```
[Intro: drums and tambourine]
[Tenor Saxophone Solo, joyful]
[Trumpet Solo, bright]
[Organ Solo, single note melody]
[Call and Response: saxophone asks, trumpet answers]
[Trombone Solo, warm and sly]
[Break: saxophone alone]
[Short Tutti]
[Outro: tambourine and saxophone]
```

## 3 · R&B (ruhig)
**STYLE**
```
smooth rnb instrumental, 84 bpm, laid back groove, alto saxophone lead, electric piano rhodes, clean electric guitar licks, muted trumpet, warm bass, long solo passages for saxophone, guitar and muted trumpet, expressive bends, intimate dry mix, no vocals
```
**LYRICS**
```
[Intro: rhodes alone]
[Alto Saxophone Solo, tender]
[Guitar Solo, single notes, sighing bends]
[Muted Trumpet Solo, melancholic]
[Call and Response: saxophone and guitar]
[Break: saxophone alone, breathy]
[Outro: rhodes and saxophone]
```

---
**Nach dem Erzeugen:** Ernte wie R1 mit `harvest_phrases.py --bpm <BPM> --offset <s>`; Ergebnis in `40_AUDIO/music_catalog_r1.json`.
**Tonlage:** Verschieben um bis zu etwa ±5 Halbtöne klingt noch natürlich; ganze Oktaven verzerren die Klangfarbe. Tiefe und hohe Stimmen besser über Instrumentenpaare holen (Fagott ↔ Oboe, Tuba ↔ Trompete, Cello ↔ Geige).

---
## R3 · Orchester 2: Streicher und Blech getrennt (nach der Orchester-Ernte vom 23.10.)
**Warum:** Holzbläser trugen (47 % einstimmig), Streicher kaum (7 %), weil Geige und Cello im selben Stem mit Pizzicato-Begleitung liefen. Neu: je Abschnitt ein Standard-Tag plus eine Zeile mit dem Soloinstrument, dazwischen eine kurze Pause und zwei Leerzeilen. Leerzeilen wirken in Suno als Atempause bzw. Übergang, und Tags sind nur Hinweise, keine Befehle (Quellen in der Chat-Antwort vom 23.10.). Custom Mode und „Instrumental“ an.
**STYLE**
```
orchestral solo showcase, 100 bpm, classical symphony orchestra, one instrument at a time, each solo completely unaccompanied, short silence between solos, solo violin, solo viola, solo cello, double bass, french horn, trumpet, trombone, tuba, harp, expressive phrasing, dry concert hall, no choir, no vocals
```
**LYRICS**
```
[Intro]
[solo violin, unaccompanied, longing]


[Break]
[silence]


[Verse 1]
[solo viola, unaccompanied, warm and sad]


[Break]
[silence]


[Verse 2]
[solo cello, unaccompanied, introspective]


[Break]
[silence]


[Verse 3]
[double bass, unaccompanied, slow, grumbling]


[Interlude]
[harp alone, mysterious]


[Verse 4]
[french horn, unaccompanied, heroic call]


[Break]
[silence]


[Verse 5]
[trumpet, unaccompanied, proud]


[Break]
[silence]


[Verse 6]
[trombone, unaccompanied, sliding, mocking]


[Break]
[silence]


[Verse 7]
[tuba, unaccompanied, heavy, comic]


[Outro]
[solo violin and solo cello, call and response]

[Fade Out]
[End]
```
