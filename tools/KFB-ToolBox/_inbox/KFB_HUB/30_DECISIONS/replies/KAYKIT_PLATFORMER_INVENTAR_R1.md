# KayKit Platformer Pack (EXTRA) · Inventar für den Spielfeld-Generator · R1 · 28.10.2026

Dateien: privates Repo georg-doc/KFB-Stunt-Car-Race, Branch `assets/kaykit-platformer-r1` @5c6096a, Ordner `kaykit_platformer_r1/` (525 gltf + bin, Texturen, `contents.png` als Übersicht, `README.md` mit sha256 je Datei). FREE ist eine byte-gleiche Teilmenge von EXTRA. Katalog-Zeilen für den Asset Librarian: kayfabizarro Branch `registry/kaykit-platformer-r1` (Muster `kfb.asset-private-projection.v1`).

**Raster:** 1 Einheit = 1 m, Grundzelle 2 × 2 m, Ursprung mittig am Boden. Dateinamen nennen Breite × Tiefe × Höhe. Railings sitzen genau auf der Kante einer 2 × 2-Zelle (Labyrinthwände). Die Kugel `ball` (2 m) passt durch die 2-m-Rohre. Rohrkurven (3 m) und Förderband-Lippen (2,2 m) liegen nur auf dem 1-m-Raster.

| Familie | Teile | Dateien | Rolle im Generator |
|---|---|---|---|
| Böden/Plattformen (platform 1×1 bis 6×6, Höhe 1/2/4; floor_wood; platform_hole_6x6x1 als Ziel-Loch) | 26 | 89 | Zelle |
| Rampen (platform_slope, Höhen 2 und 4) | 9 | 36 | Zelle |
| Verbindungen (pipes 2 m, conveyor 2,2 breit, floor_net, safetynet, pillar, strut) | 31 | 88 | Verbindung |
| Wände (barrier, railing, arch, hoop) | 23 | 104 | Hindernis |
| Fallen (spikeblock, hammer, swiper, saw, spikeball, spikeroller, cannon, bomb, chain) | 42 | 120 | Hindernis |
| Mechanik (button, lever, spring) | 6 | 21 | Hindernis bzw. Schalter |
| Sammelobjekte (star, diamond, heart, power, chest) | 7 | 29 | Sammelobjekt |
| Deko (flag, signage, cone) | 11 | 38 | Deko |
| Figuren/Animationen | 0 | 0 | – |

## Einzelteile (gemessen aus den Bounding-Boxen)
```
## ramp: 9 Teile / 36 Dateien
  platform_slope_2x2x2 2x2x2 min=[-1, 0, -1] grid=True colors=4
  platform_slope_2x4x4 2.0x4.0x4.0 min=[-1.0, 0.0, -2.0] grid=True colors=4
  platform_slope_2x6x4 2.0x4.0x6.0 min=[-1.0, 0.0, -3.0] grid=True colors=4
  platform_slope_4x2x2 4.0x2.0x2.0 min=[-2.0, 0.0, -1.0] grid=True colors=4
  platform_slope_4x4x4 4x4x4 min=[-2, 0, -2] grid=True colors=4
  platform_slope_4x6x4 4.0x4.0x6.0 min=[-2.0, 0.0, -3.0] grid=True colors=4
  platform_slope_6x2x2 6.0x2.0x2.0 min=[-3.0, 0.0, -1.0] grid=True colors=4
  platform_slope_6x4x4 6.0x4.0x4.0 min=[-3.0, 0.0, -2.0] grid=True colors=4
  platform_slope_6x6x4 6.0x4.0x6.0 min=[-3.0, 0.0, -3.0] grid=True colors=4
## cell: 26 Teile / 89 Dateien
  floor_wood_1x1 1.0x0.5x1.0 min=[-0.5, 0.0, -0.5] grid=False colors=neutral
  floor_wood_2x2 2.0x0.5x2.0 min=[-1.0, 0.0, -1.0] grid=False colors=neutral
  floor_wood_2x6 6x0.5x2 min=[-3, 0, -1] grid=False colors=neutral
  floor_wood_4x4 4.0x0.5x4 min=[-2, 0, -2] grid=False colors=neutral
  platform_1x1x1 1.0x1.0x1.0 min=[-0.5, 0.0, -0.5] grid=True colors=4
  platform_2x2x1 2x1x2 min=[-1, 0, -1] grid=True colors=4
  platform_2x2x2 2x2x2 min=[-1, 0, -1] grid=True colors=4
  platform_2x2x4 2x4x2 min=[-1, 0, -1] grid=True colors=4
  platform_4x2x1 4.0x1.0x2.0 min=[-2.0, 0.0, -1.0] grid=True colors=4
  platform_4x2x2 4.0x2.0x2.0 min=[-2.0, 0.0, -1.0] grid=True colors=4
  platform_4x2x4 4.0x4.0x2.0 min=[-2.0, 0.0, -1.0] grid=True colors=4
  platform_4x4x1 4x1x4 min=[-2, 0, -2] grid=True colors=4
  platform_4x4x2 4x2x4 min=[-2, 0, -2] grid=True colors=4
  platform_4x4x4 4x4x4 min=[-2, 0, -2] grid=True colors=4
  platform_6x2x1 6.0x1.0x2.0 min=[-3.0, 0.0, -1.0] grid=True colors=4
  platform_6x2x2 6.0x2.0x2.0 min=[-3.0, 0.0, -1.0] grid=True colors=4
  platform_6x2x4 6.0x4.0x2.0 min=[-3.0, 0.0, -1.0] grid=True colors=4
  platform_6x6x1 6x1x6 min=[-3, 0, -3] grid=True colors=4
  platform_6x6x2 6x2x6 min=[-3, 0, -3] grid=True colors=4
  platform_6x6x4 6x4x6 min=[-3, 0, -3] grid=True colors=4
  platform_arrow_2x2x1 2x1x2 min=[-1, 0, -1] grid=True colors=4
  platform_arrow_4x4x1 4x1x4 min=[-2, 0, -2] grid=True colors=4
  platform_decorative_1x1x1 1.0x1.0x1.0 min=[-0.5, 0.0, -0.5] grid=True colors=4
  platform_decorative_2x2x2 2x2x2 min=[-1, 0, -1] grid=True colors=4
  platform_hole_6x6x1 6x1x6 min=[-3, 0, -3] grid=True colors=4
  platform_wood_1x1x1 1.0x1.0x1.0 min=[-0.5, 0.0, -0.5] grid=True colors=neutral
## connection: 31 Teile / 88 Dateien
  bracing_large 1.0x1.0x0.2 min=[-0.5, -0.5, -0.1] grid=False colors=4
  bracing_medium 0.6x0.6x0.2 min=[-0.3, -0.3, -0.1] grid=False colors=4
  bracing_small 0.2x0.6x0.2 min=[-0.1, -0.3, -0.1] grid=False colors=4
  conveyor_2x4x1 2.2x1.0x4.0 min=[-1.1, -0.0, -2.0] grid=False colors=4
  conveyor_2x8x1 2.2x1.0x8.0 min=[-1.1, -0.0, -4.0] grid=False colors=4
  conveyor_4x4x1 4.2x1.0x4.0 min=[-2.1, -0.0, -2.0] grid=False colors=4
  conveyor_4x8x1 4.2x1.0x8.0 min=[-2.1, -0.0, -4.0] grid=False colors=4
  floor_net_2x2x1 2.0x0.319x2.0 min=[-1.0, 0.681, -1.0] grid=False colors=4
  floor_net_4x4x1 4.0x0.314x4.0 min=[-2.0, 0.686, -2.0] grid=False colors=4
  pillar_1x1x1 0.8x1.0x0.8 min=[-0.4, -0.0, -0.4] grid=False colors=neutral
  pillar_1x1x2 0.8x2.0x0.8 min=[-0.4, -0.0, -0.4] grid=False colors=neutral
  pillar_1x1x4 0.8x4.0x0.8 min=[-0.4, -0.0, -0.4] grid=False colors=neutral
  pillar_1x1x8 0.8x8.0x0.8 min=[-0.4, -0.0, -0.4] grid=False colors=neutral
  pillar_2x2x2 1.6x2.0x1.6 min=[-0.8, -0.0, -0.8] grid=False colors=neutral
  pillar_2x2x4 1.6x4.0x1.6 min=[-0.8, -0.0, -0.8] grid=False colors=neutral
  pillar_2x2x8 1.6x8.0x1.6 min=[-0.8, -0.0, -0.8] grid=False colors=neutral
  pipe_180_A 2.0x3.0x6.0 min=[-1.0, -0.0, -1.0] grid=True colors=4
  pipe_180_B 2.0x2.99x6.0 min=[-1.0, -0.0, -1.0] grid=True colors=4
  pipe_90_A 2.0x3.0x3.0 min=[-1.0, 0.0, -1.0] grid=True colors=4
  pipe_90_B 2.0x3.0x3.0 min=[-1.0, 0.0, -1.0] grid=True colors=4
  pipe_end 2.4x1.0x2.4 min=[-1.2, 0.0, -1.2] grid=False colors=4
  pipe_straight_A 2x2x2 min=[-1, 0, -1] grid=True colors=4
  pipe_straight_B 2x2x2 min=[-1, 0, -1] grid=True colors=4
  safetynet_2x2x1 2.0x1x2 min=[-1, 0, -1] grid=True colors=4
  safetynet_4x2x1 4.0x1x2 min=[-2, 0, -1] grid=True colors=4
  safetynet_6x2x1 6x1x2 min=[-3, 0, -1] grid=True colors=4
  structure_A 2.0x0.2x2.0 min=[-1.0, -0.1, -1.0] grid=False colors=neutral
  structure_B 2.0x1.1x2.0 min=[-1.0, 0.0, -1.0] grid=False colors=neutral
  structure_C 1.8x2.0x1.8 min=[-0.9, 0.0, -0.9] grid=False colors=neutral
  strut_horizontal 2.0x0.5x0.5 min=[-1.0, -0.25, -0.25] grid=False colors=neutral
  strut_vertical 0.5x2.0x0.5 min=[-0.25, 0.0, -0.25] grid=False colors=neutral
## wall: 23 Teile / 104 Dateien
  arch 3.75x3.7x0.75 min=[-1.875, 0.0, -0.375] grid=False colors=4
  arch_tall 3.75x4.7x0.75 min=[-1.875, 0.0, -0.375] grid=False colors=4
  arch_wide 5.75x3.8x0.75 min=[-2.875, 0.0, -0.375] grid=False colors=4
  barrier_1x1x1 1.0x1.0x1.0 min=[-0.5, 0.0, -0.5] grid=True colors=5
  barrier_1x1x2 1.0x2.0x1.0 min=[-0.5, 0.0, -0.5] grid=True colors=5
  barrier_1x1x4 1.0x4.0x1.0 min=[-0.5, 0.0, -0.5] grid=True colors=5
  barrier_2x1x1 2.0x1.0x1.0 min=[-1.0, 0.0, -0.5] grid=True colors=5
  barrier_2x1x2 2.0x2.0x1.0 min=[-1.0, 0.0, -0.5] grid=True colors=5
  barrier_2x1x4 2.0x4.0x1.0 min=[-1.0, 0.0, -0.5] grid=True colors=5
  barrier_3x1x1 3.0x1.0x1.0 min=[-1.5, 0.0, -0.5] grid=True colors=5
  barrier_3x1x2 3.0x2.0x1.0 min=[-1.5, 0.0, -0.5] grid=True colors=5
  barrier_3x1x4 3.0x4.0x1.0 min=[-1.5, 0.0, -0.5] grid=True colors=5
  barrier_4x1x1 4.0x1.0x1.0 min=[-2.0, 0.0, -0.5] grid=True colors=5
  barrier_4x1x2 4.0x2.0x1.0 min=[-2.0, 0.0, -0.5] grid=True colors=5
  barrier_4x1x4 4.0x4.0x1.0 min=[-2.0, 0.0, -0.5] grid=True colors=5
  hoop 3.4x4.7x0.75 min=[-1.7, 0.0, -0.375] grid=False colors=4
  hoop_angled 3.75x4.254x2.508 min=[-1.875, 0.0, -1.254] grid=False colors=4
  railing_corner_double 2.0x1.2x2.0 min=[-1.0, 0.0, -1.0] grid=False colors=4
  railing_corner_padded 2.101x1.2x2.101 min=[-1.101, 0.0, -1.101] grid=False colors=4
  railing_corner_single 2.0x1.2x2.0 min=[-1.0, 0.0, -1.0] grid=False colors=4
  railing_straight_double 2.0x1.2x0.4 min=[-1.0, 0.0, -1.0] grid=False colors=4
  railing_straight_padded 2.0x1.2x0.603 min=[-1.0, 0.0, -1.101] grid=False colors=4
  railing_straight_single 2.0x1.2x0.4 min=[-1.0, 0.0, -1.0] grid=False colors=4
## trap: 42 Teile / 120 Dateien
  bomb 0.8x1.009x0.8 min=[-0.4, -0.4, -0.4] grid=False colors=neutral
  bomb_A 0.8x1.009x0.8 min=[-0.4, -0.4, -0.4] grid=False colors=4
  bomb_B 0.8x1.009x0.8 min=[-0.4, -0.4, -0.4] grid=False colors=4
  cannon_base 3.0x3.5x2.615 min=[-1.5, 0.0, -1.0] grid=False colors=4
  cannon_bullet 0.985x0.985x1.533 min=[-0.492, -0.492, -0.567] grid=False colors=neutral
  chain_full 0.617x8.6x0.617 min=[-0.308, -8.6, -0.308] grid=False colors=neutral
  chain_link 0.617x0.792x0.19 min=[-0.308, -0.396, -0.095] grid=False colors=neutral
  chain_link_end_bottom 0.617x0.696x0.19 min=[-0.308, 0.0, -0.095] grid=False colors=neutral
  chain_link_end_top 0.617x0.696x0.19 min=[-0.308, -0.696, -0.095] grid=False colors=neutral
  floor_spikes_2x2x1 2x1x2 min=[-1, 0, -1] grid=True colors=neutral
  floor_spikes_4x4x1 4x1x4 min=[-2, 0, -2] grid=True colors=neutral
  floor_spikes_curved_4x2x2 4.0x2.0x2.0 min=[-2.0, 0.0, -2.0] grid=True colors=neutral
  floor_spikes_trap_2x2x1 2.0x1.5x2.0 min=[-1.0, 0, -1.0] grid=False colors=4
  floor_spikes_trap_4x4x1 4.0x1.5x4.0 min=[-2.0, 0, -2.0] grid=False colors=4
  hammer 4.0x7.5x3.0 min=[-2.0, -0.5, -1.5] grid=False colors=4
  hammer_large 6.0x10.0x4.0 min=[-3.0, -0.5, -2.0] grid=True colors=4
  hammer_large_spikes 8.0x10.0x4.0 min=[-4.0, -0.5, -2.0] grid=True colors=4
  hammer_spikes 6.0x7.5x3.0 min=[-3.0, -0.5, -1.5] grid=False colors=4
  hammerblock 4x3x4 min=[-2, 0, -2] grid=True colors=neutral
  hammerblock_spikes 4.0x4.0x4.0 min=[-2.0, -0.0, -2.0] grid=True colors=neutral
  saw_trap 6.796x2.0x6.796 min=[-3.398, -1.0, -3.398] grid=False colors=4
  saw_trap_double 14.796x2.0x6.796 min=[-7.398, -1.0, -3.398] grid=False colors=4
  saw_trap_long 6.796x2.0x9.816 min=[-3.398, -1.0, -1.418] grid=False colors=4
  sawblade 6.796x0.9x6.796 min=[-3.398, -0.45, -3.398] grid=False colors=neutral
  spikeball 2.586x2.747x2.719 min=[-1.293, -1.373, -1.359] grid=False colors=neutral
  spikeball_hanger 2.586x2.969x2.719 min=[-1.293, -1.373, -1.359] grid=False colors=neutral
  spikeblock_double_horizontal 4.0x2.0x2.0 min=[-2.0, -1.0, -1.0] grid=True colors=4
  spikeblock_double_vertical 2.0x4.0x2.0 min=[-1.0, -2.0, -1.0] grid=True colors=4
  spikeblock_down 2.0x3.0x2.0 min=[-1.0, -2.0, -1.0] grid=True colors=4
  spikeblock_left 3.0x2.0x2.0 min=[-2.0, -1.0, -1.0] grid=True colors=4
  spikeblock_omni 4.0x4.0x4.0 min=[-2.0, -2.0, -2.0] grid=True colors=4
  spikeblock_quad 4.0x4.0x2.0 min=[-2.0, -2.0, -1.0] grid=True colors=4
  spikeblock_right 3.0x2x2 min=[-1, -1, -1] grid=True colors=4
  spikeblock_up 2x3x2 min=[-1, -1, -1] grid=True colors=4
  spikeroller_horizontal 4.0x4.0x4.0 min=[-2.0, -2.0, -2.0] grid=True colors=neutral
  spikeroller_vertical 2.0x2.4x2.0 min=[-1.0, 0.0, -1.0] grid=False colors=neutral
  swiper 1.0x1.5x3.125 min=[-0.5, 0.0, -0.375] grid=False colors=4
  swiper_double 5.5x1.5x1.0 min=[-2.75, 0.0, -0.5] grid=False colors=4
  swiper_double_long 9.0x1.5x1.0 min=[-4.5, 0.0, -0.5] grid=False colors=4
  swiper_long 1.0x1.5x4.875 min=[-0.5, 0.0, -0.375] grid=False colors=4
  swiper_quad 5.5x1.5x5.5 min=[-2.75, 0.0, -2.75] grid=False colors=4
  swiper_quad_long 9.0x1.5x9.0 min=[-4.5, 0.0, -4.5] grid=False colors=4
## mechanic: 6 Teile / 21 Dateien
  button_base 1.75x0.32x1.75 min=[-0.875, 0.0, -0.875] grid=False colors=4
  lever_floor_base 0.8x1.728x1.2 min=[-0.4, -0.0, -0.6] grid=False colors=4
  lever_wall_base_A 0.8x1.2x1.093 min=[-0.4, -0.6, 0.0] grid=False colors=4
  lever_wall_base_B 1.0x1.2x1.0 min=[-0.5, -0.6, -0.0] grid=False colors=4
  spring 1.0x2.2x1.0 min=[-0.497, -0.005, -0.501] grid=False colors=neutral
  spring_pad 1.5x1.0x1.5 min=[-0.75, 0.0, -0.75] grid=False colors=4
## collectible: 7 Teile / 29 Dateien
  ball 2.0x2.0x2.0 min=[-1.0, -1.0, -1.0] grid=True colors=5
  chest 1.2x1.096x1.192 min=[-0.6, 0.0, -0.592] grid=False colors=4
  chest_large 1.854x1.096x1.493 min=[-0.927, 0.0, -0.736] grid=False colors=4
  diamond 1.077x0.852x1.029 min=[-0.538, -0.492, -0.47] grid=False colors=4
  heart 1.08x0.847x0.53 min=[-0.54, -0.371, -0.265] grid=False colors=4
  power 0.891x1.204x0.4 min=[-0.421, -0.587, -0.2] grid=False colors=4
  star 1.166x1.109x0.449 min=[-0.583, -0.496, -0.224] grid=False colors=4
## deco: 11 Teile / 38 Dateien
  cone 0.5x0.65x0.5 min=[-0.25, 0.0, -0.25] grid=False colors=5
  flag_A 0.6x2.064x1.623 min=[-0.3, -0.0, -1.323] grid=False colors=4
  flag_B 0.6x3.064x1.623 min=[-0.3, -0.0, -1.323] grid=False colors=4
  flag_C 0.6x4.064x1.623 min=[-0.3, -0.0, -1.323] grid=False colors=4
  sign 0.766x1.256x0.755 min=[-0.383, -0.007, -0.378] grid=False colors=neutral
  signage_arrow_stand 1.0x2.0x0.4 min=[-0.5, 0.0, -0.125] grid=False colors=4
  signage_arrow_wall 1.0x1.0x0.2 min=[-0.5, -0.5, -0.1] grid=False colors=4
  signage_arrows_left 5.4x1.5x0.677 min=[-2.7, -0.0, -0.271] grid=False colors=5
  signage_arrows_right 5.4x1.5x0.677 min=[-2.7, -0.0, -0.271] grid=False colors=5
  signage_finish 5.4x4.5x0.5 min=[-2.7, -0.0, -0.2] grid=False colors=neutral
  signage_finish_wide 9.4x4.5x0.5 min=[-4.7, -0.0, -0.2] grid=False colors=neutral
## other: 0 Teile / 0 Dateien
526
```
