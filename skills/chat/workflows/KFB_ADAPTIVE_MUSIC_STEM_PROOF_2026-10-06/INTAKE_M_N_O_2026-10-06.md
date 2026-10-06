# INTAKE · KFB Island Music M/N/O · 2026-10-06

Status: SOURCE_PRESENT · RUNTIME_UNVERIFIED
Owner: KFB Audio / Jukebox / Mixer
Canonical asset source: `georg-doc/kayfabizarro@276728f3f82f729cd1656b61e81d278856d736bb`
Folder: `media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/`

## Source result

### M · KFB_M_ISLAND_LIFE_ORCHESTRAL_COZY_01
- actual exported BPM: **112** (prompt target was 86; runtime truth uses 112)
- master: present / non-empty
- stem folder: `KFB_M_ISLAND_LIFE_ORCHESTRAL_COZY_01 Stems (112BPM)`
- stems: **10**
- labels: Lead Vocals, Drums, Bass, Guitar, Keyboard, Percussion, Synth, Other, Brass, Woodwinds
- safety: Lead Vocals + Other default muted pending listening classification
- intended role after QA: GENERAL_ISLAND_LIFE / STAYING / LIGHT_MOVEMENT

### N · KFB_N_DUSK_NIGHT_ORCHESTRAL_COZY_01
- actual exported BPM: **70** (prompt target was 74; runtime truth uses 70)
- master: present / non-empty
- stem folder: `KFB_N_DUSK_NIGHT_ORCHESTRAL_COZY_01 Stems (70BPM)`
- stems: **11**
- labels: Lead Vocals, Backing Vocals, Drums, Bass, Guitar, Keyboard, Percussion, Strings, Synth, Brass, Woodwinds
- safety: Lead Vocals + Backing Vocals default muted pending listening classification
- intended role after QA: DUSK/NIGHT variant of low-activity island state; Audio owns selection from time/day profile

### O · KFB_O_DISCOVERY_POI_ORCHESTRAL_01
- actual exported BPM: **82**
- master: present / non-empty
- stem folder: `KFB_O_DISCOVERY_POI_ORCHESTRAL_01 Stems (82BPM)`
- stems: **9**
- labels: Drums, Bass, Guitar, Keyboard, Percussion, Strings, Synth, Brass, Woodwinds
- no vocal-labelled stems in the exported split
- intended role after QA: POI_DISCOVERY / SIGNATURE_LANDMARK / VISTA

## Exact presence check

- masters: **3 / 3**
- stems: **30 / 30**
- total audio files checked: **33 / 33**
- all checked files are non-empty MP3 files.

## Promotion gate

Do NOT set M/N/O to `SITE_RUNTIME_VERIFIED` or add them to automatic World profile mappings until a Sites/Work runtime pass has:
1. decoded every stem;
2. measured per-family duration delta;
3. checked loop drift;
4. listened to ambiguous source-labelled layers;
5. tested musical enter/exit boundaries;
6. recorded suitable fallback behavior.

Masters may be used as safe temporary playback fallback if stem compatibility is not green.
