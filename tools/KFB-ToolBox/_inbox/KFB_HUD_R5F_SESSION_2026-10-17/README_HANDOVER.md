# Handover · KFB HUD R5f · Session 17.10.2026 · Claude Design → WS0 / Claude Code

Stand: 17.10.2026. Design only (V-228). Für WS0 und Claude Code: Einbau des HUD-Looks R5f ins KFB-MVP.

## Was die Dateien sind
Die Tafeln und Module in diesem Paket sind **Design-Referenzen in HTML/JS**: Prototypen für Look und Verhalten, kein Produktionscode. Aufgabe ist, sie im Ziel-Codebase (KFB Island Worldbuilder Lab, three.js r186, bestehender HUD-Owner) mit dessen Mustern nachzubauen. Die Module sind framework-frei (DOM + Web Animations + inline SVG) und können als Vorlage oder direkt als Bauteil-Bibliothek dienen, wenn das Lab DOM-HUD nutzt.

**Fidelity: High.** Farben, Maße, Radien, Zeiten und Kurven sind final für diese Runde. Spielmechanik (Preise, Auslöser, Balancing) ist Platzhalter.

## Inhalt

| Datei | Rolle |
|---|---|
| `KFB HUD R5f Board.dc.html` | Tafel R5f: Kopf mit Kritik → Lösung, Live-HUD (Fluff einsammeln, Waffe wechseln), 6 Bilder 16:9 + 9:16, Bauteile (Icon-Set, Leiste in vier Zuständen, Kayfabrication, Fluff-Korb), Offen |
| `KFB HUD R5e Board.dc.html` | Vorstand, zum Vergleich |
| `hud-r5/r5f-hud.js` | **Aktuelles Modul.** Icon-Set, Tasten, Leiste, Fortbewegung, Rucksack, Fluff, Kayfabrication, `buildFrame()` |
| `hud-r5/r5e-hud.js` | Vorstand (unverändert) |
| `hud-r5/r5d-hud.js` | Basis: Material, `key()`, `ybtn()`, Federung `deform()` + `FEEL`, Almanach, Tafel, Radio, Fenster-Hülle, Einstellungen, Info |
| `hud-r5/r5-hud.js` | Holzplatte `plate()`, Holzfarben, Schrift |
| `hud-r4/*` | Theme/Bühnen (`r4-theme.js`), Cartoon-Palette, 3D-Zielpfeil, Hintergrundbilder |
| `hud-flight/*` | 3D-Prop-Bibliothek und Renderer für Rucksack-Bilder, Item-Daten (Modelle commit-gepinnt von raw.githubusercontent.com) |
| `support.js` | Laufzeit der Tafeln |
| `docs/CHANGELOG.md` | R5d → R5e → R5f |
| `docs/KONZEPT_UND_FEATURES.md` | Gestaltungsregeln, Features, Wording, offene Punkte (**zuerst lesen**) |
| `docs/SPEC_HUD_R5f.md` | Maße und Farben R5f (Delta zu R5e) |
| `docs/SPEC_HUD_R5e.md`, `docs/SPEC_HUD_R5d.md` | Maße der Vorstände; gelten, soweit R5f nichts ändert |
| `docs/KONZEPT_KAYFABRICATION_R5e.md` | Konzept-Stand R5e (Wording-Herkunft) |

Öffnen: Ordner über lokalen Webserver ausliefern (`npx serve .`), `KFB HUD R5f Board.dc.html` aufrufen. Internet nötig (Google Fonts, three.js vom CDN, Modelle von GitHub).

## Deliverables dieser Session
1. R5e: Aktionsleiste mit Familien-Paaren, Fortbewegungs-Fenster, Kontext-Platz, Interagieren, Rucksack + Fenster, Fluff-Flug und Komplett-Signal, Kayfabrication in vier Schritten.
2. R5f: ein Tastenstil, neues Icon-Set (zwei Durchgänge), Mulden-Zustand, Klapp-Dreieck, Beutel-Taste mit Zahl, Knete-Fluff mit Glasfächern, dezente Ecke rechts unten, ruhigere Hover-Federung.
3. Doku: Spezifikationen R5e/R5f, Konzept & Features, Changelog, dieses Handover.

## API (`hud-r5/r5f-hud.js`)

```js
import * as H from './hud-r5/r5f-hud.js';
import * as TH from './hud-r4/r4-theme.js';
const T = TH.hudTheme(TH.stagePalette('otown'), 'A');
const Z = H.SIZES.desk;               // oder H.SIZES.phone (390 × 693)

// Ganzes HUD-Bild (Tafel-Komposition, Referenz für Positionen)
const f = H.buildFrame({ T, form: 'desk', scene: 'walk', weapon: 'fist', mode: 'walk', ctx: null, target: false,
  nav: { state: 'travel', dist: 350, name: 'KFB-Town' }, counts: [34, 22, 0, 41, 19, 12], shots: {} ,
  arrowFor: (nav) => imgSrc, pinFor: (dist) => hex });
host.append(f.el);  f.api.collect(i);  f.api.setWeapon('sword');  f.api.counts();

// Einzelteile
H.key(size, iconName, { color, title, onClick, still });   // die eine Icon-Taste
H.quietKey(size, iconName, { title, onClick });              // Ecke rechts unten
H.bagButton(Z, itemCount, onClick);                          // Rucksack-Taste
H.slotEl(Z, iconName?);                                      // Mulde
H.ic(iconName, px, color);                                   // nur Glyphe
const bar = H.actionBar(T, Z, { weapon, mode, ctx, target, onMode, onCtx, onInteract });
bar.setWeapon(w); bar.setMode(m); bar.setCtx(c | null); bar.setTarget(bool);
H.locoFlyout(T, Z, { mode, onPick });
H.bagOverlay(T, Z, { items: H.BAG, shots, weapon, onEquip, onCtx, onClose });
const fl = H.fluffBar(T, Z, { counts, onClick });  fl.land(i, n); fl.spend(cost); fl.celebrate(); fl.ready();
H.fluffKorb(T, Z, { counts, onFab });
H.kayfabOverlay(T, Z, { step, counts, onSpend, onClose });

// Daten
H.FAM, H.WEAPONS, H.MODES, H.CTX, H.BAG, H.DECKS, H.fabCost(card), H.FLUFF
// Laufzeit-Schalter
H.MOTION.on = false;                  // Federung aus
Object.assign(H.FEEL, { hover, hoverMs, wiggle, iconMs, leaveMs, upMs });
```

Icon-Namen: fist, wrestle, sword, swordX, blaster, rocket, wand, magicX, sprint, turbo, walk, car, fly, teleport, home, potion, bomb, costume, mushroom, candy, interact, bag, sound, soundHalf, mute, help, gear, close, chev, left, right, play, pause, prev, next, map, pin, note, spark, check, cards.

## Design-Tokens

**Glyphen**: #52301A (Standard), #8A6644 (dezent), Tinte Text #2B1A0B.

**Familien** (Primär / Spezial): Faust #F7A066 / #EE6B3B · Schwert #93BCEC / #5A93D6 · Blaster #6FD6C8 / #22B3A3 · Magie #D2A6EC / #B06AD9 · Fortbewegung #A6DA84 / #6FBF4A.

**Weitere Tasten**: Interagieren #FFD21F · Rucksack wie Zielwahl #E8BC37 · Ecke rechts unten #F4E7CC · Neutral #E8C894.

**Kontext**: Heiltrank #F58A9C · Bombe #AEB6CF · Kostüm #8CCBEA · Pilz #F2876E · Bonbon #FFC864.

**Fluff** (Farbe / Schatten): Tragic #3F93CF / #24597D · Comic #93BE3C / #5A7A1E · Absurd #FFD21F / #B8901C · Heroic #F5893A / #B35E22 · Mystical #9A62C4 / #5B4470 · Forbidden #E2508F / #8F3A60.

**Maße** (1080p / Telefon): Rand 32 / 12 · Abstand 12 / 6 · Taste 64 / 34 · Ecke rechts unten 56 / 32 · Leiste 84 / 44 hoch · Paar-Abstand 6 / 3 · Gruppen-Abstand 18 / 8 · Tastenradius 30 % · Fluff-Kugel 30 / 15, Fach +8 / +4, Glasrand 2 / 1,3.

**Taste (Lack-Aufbau)**: Verlauf 180°: Farbe +32 % Weiß → Farbe (55 %) → +16 % Schwarz (oklch-Mischung), Holzkorn soft-light; Innenkante oben 1,5 px rgba(255,255,255,.55); Unterkante innen −lift px rgba(0,0,0,.14); Anhebung 0 lift px Farbe +45 % Schwarz; Schatten 0 (lift+3) px (lift+5) px rgba(24,16,8,.3); lift = max(2, Kante/16).

**Schrift**: Fredoka 500/600/700.

## Bewegung
- Hover (R5f): Squash 1,06 / 0,95 → 0,98 / 1,03 → Ruhe 1,05, 640 ms, cubic-bezier(.3,.7,.4,1). Icon dreht −4° / +3° / −1,4° über 820 ms ease-in-out.
- Drücken 90 ms ease-out auf 1,16 / 0,8 (+3 px). Loslassen 560 ms über 0,88 / 1,16 → 1,07 / 0,95.
- Leiste: Waffenwechsel 140 ms weg + 340 ms auf; Item in Kontext-Platz springt auf (scale .3 → 1); „i“ mit Ziel springt auf (scale .4 → 1).
- Fluff: Flug 820 ms, Einrasten 440 ms, Zähler 380 ms; Komplett-Welle 560 ms, 70 ms Versatz.
- `prefers-reduced-motion: reduce` → keine Federung, keine Flüge.

## Zustände (für den HUD-Owner)
`weapon` (fist | sword | blaster | magic), `mode` (walk | drive | fly), `ctx` (Item-ID | null), `target` (bool), `fluff[6]`, `bag[20]`, `kayfab.step` (1–4). Auslöser für `ctx`, `target` und Waffenwechsel kommen aus dem Spiel; das HUD zeigt nur.

## Hinweise für den Einbau
1. Abgleich mit dem bestehenden HUD-Owner im Lab (K7 Knet-HUD, `hud-flight/kfb-hud.js`), damit es nicht zwei HUDs gibt.
2. Icon-Set als Datei übernehmen (`IC` in r5f-hud.js, 24er-Raster, Maske je Icon). Masken-IDs sind zur Laufzeit eindeutig.
3. Knete-Korn ist ein einmal erzeugtes 64-px-PNG in `--kfb-clay`; kein SVG-Filter im Hintergrund (Performance).
4. Telefon: Item-Zahl im Beutel bei 34 px Taste klein, prüfen.
5. Offene Punkte: `docs/KONZEPT_UND_FEATURES.md`, Abschnitt 7.
