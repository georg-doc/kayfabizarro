# Suno-Testsongs mit Solo-Passagen · R1 · 2026-10-22 · WS0
**Zweck:** Konzept §15. Aus diesen Songs ernten wir einstimmige Phrasen je Instrument (`harvest_phrases.py`) und vergleichen mit der Pilot-Ernte (5–15 %).
**Format:** je Song **STYLE** (rein musikalisch) und **LYRICS** (nur Struktur-Tags, instrumental). In Suno „Instrumental“ an, danach die Stems exportieren (alle Spuren).
**Ziel je Song:** lange Stellen, in denen **ein Instrument allein** spielt, dazu Ruf und Antwort zwischen zwei Instrumenten, sparsam begleitet.

---
## 1 · Spielzeugsoldaten-Marsch (Piccolo, Blech, Snare)
**STYLE**
```
toy soldier march, 120 bpm, 2/4, major key, piccolo lead, muted trumpet, trombone, tuba, snare drum, sparse arrangement, long unaccompanied solo passages, call and response between piccolo and trombone, clear melodic phrases, staccato and glissando, cartoon orchestral, dry studio sound, no vocals
```
**LYRICS**
```
[Intro: snare drum alone]
[Piccolo Solo, unaccompanied]
[Trombone Solo, unaccompanied, glissando phrases]
[Call and Response: piccolo asks, trombone answers]
[Muted Trumpet Solo, wah-wah phrases]
[Tuba Solo, slow and heavy]
[Break: all stop, piccolo alone]
[March Tutti, short]
[Outro: snare and piccolo]
```

## 2 · Surf und Rockabilly (Twang-Gitarre, Kontrabass, Orgel)
**STYLE**
```
surf rockabilly instrumental, 150 bpm, minor pentatonic, twangy reverb electric guitar lead, slap upright bass, farfisa organ, light brushed drums, sparse, long solo passages for each instrument, call and response between guitar and organ, single note melodies, bends and slides, dry and close, no vocals
```
**LYRICS**
```
[Intro: twang guitar alone]
[Guitar Solo, single notes, bends and slides]
[Upright Bass Solo, slap, unaccompanied]
[Organ Solo, single line melody]
[Call and Response: guitar and organ trade short phrases]
[Break: guitar alone, tremolo picking]
[Short Tutti]
[Outro: guitar fade]
```

## 3 · E-Funk mit Talkbox (Talkbox, Clavinet, Moog-Bass)
**STYLE**
```
electro funk instrumental, 105 bpm, dorian, talkbox lead melody, clavinet, moog synth bass with portamento, tight drum machine, sparse groove, long solo passages for talkbox and clavinet, call and response between talkbox and moog, wordless vowel shapes, expressive pitch bends, dry close mix, no lyrics
```
**LYRICS**
```
[Intro: drum machine alone]
[Talkbox Solo, wordless, expressive slides]
[Clavinet Solo, single note funk lines]
[Moog Bass Solo, portamento glides]
[Call and Response: talkbox asks, moog answers]
[Break: talkbox alone, sustained vowel shapes]
[Short Groove]
[Outro: talkbox and drum machine]
```

---
**Nach dem Erzeugen:** Stems je Song in `40_AUDIO/chatterbox_r1/suno_tests/<song>/` ablegen (Dateiname des Stems = Instrument). WS0 lässt die Ernte laufen und meldet den einstimmigen Anteil je Instrument.
