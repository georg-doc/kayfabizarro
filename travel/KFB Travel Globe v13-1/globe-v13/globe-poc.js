// ============================================================================
// globe-poc.js — v13 (Zweig aus v12, 3.9.2026 abends). `globe-v13/` ist eine vollständige Kopie von
// `globe-v12/` (88 Dateien, Stand nach Vulkan-Sperrzonen + Jagen-Reparatur + Prüfhaken); v12 ist
// EINGEFROREN (HOUSEKEEPING §00-v12, Changelog docs/CHANGELOG_v12.md). Geändert nur die vier
// relativen Pfade (rift.png, flora-auswahl.json ×2, auswahl-georg.json). Plan für v13 steht in
// docs/TS-DELTA-v12.md §2: Stufe A zuerst (Contrails · FireflyCluster · FloatingLanterns · BirdFlock;
// GodRays ist seit v7 in sky-atmosphere.js — der Delta-Plan führte es fälschlich als fehlend), dann B (MeteorShower · SkyJellyfish · FlagSystem · Braziers). Offen bleibt §3.
// globe-poc.js — v10 (Zweig aus v9, 2.9.): Kit-Maßstab · Rule of Three · Panel-Suche · Fill-Licht lokal
// v9 bleibt unangetastet als Referenz; bekannter offener Punkt dort und hier: kleine Kursschwenks im Autopilot (Course log liest sie).
// globe-poc.js — KFB Travel Globe v9 · Runner (Zweig aus v8, 1.9.2026)
// ----------------------------------------------------------------------------
// **v9 (1.9.2026) — Zweig aus v8.** Erster Schritt: der MECH-MASSSTAB (Georg: „scheinen etwas zu
// groß" — belegt, 4,27 Kartenbreiten; Regler jetzt in „mal Karte", siehe mech-station.js Kopf).
// Danach geplant: Signaturwaffe im Mech-Modus, Raycast-Fußlesung, Weltbau-Logik (Seed/Deck-JSON).
// Alte v8-Kopfnotiz weiter gültig:
// **v8 (1.9.2026) — Zweig für den MECH-EINBAU.** `globe-v8/` ist eine vollständige Kopie von
// `globe-v7/` (Stand nach Slice Gestaltung + Block-3-Anfang); v7 wird eingecheckt und EINGEFROREN
// (HOUSEKEEPING §00, offene Punkte dort). Zielbild: `modules/kfb-mech-combat.js` nach
// `docs/BRIEFING_mech-einbau_v8.md` — Mech = Fahrzeug im Sinne des fahrzeug-vertrag.js,
// EIN Modul, Gegner später. Alte v7-Kopfnotiz sinngemäß weiter gültig:
// v7 (31.8.) begann bei E-43 (Walk-Modus als Skin am unsichtbaren Fahrzeug: `carpet.js` bleibt der
// einzige Bewegungsrechner, Schritt-Timing über `mixer.timeScale = tempo / schrittLänge`) —
// und davor stehen die zwei Messungen aus LIVING §05v: Bodenhöhe AUS DEM MESH (Facette
// 0,123 u ≈ Figurgröße) und die Maßstabsfrage (Horizont 1,2 u, Weltumrundung zu Fuß ~105 s,
// also genauso schnell wie fliegend). Historische v3…v6-Notizen unten bleiben unverändert:
// sie sind Erzähler ihrer Regeln, nicht Etiketten dieser Datei.
// ----------------------------------------------------------------------------
// **v5 (30.8.2026) — Slice C „Alle Kaskaden" und die Prüfstand-Lücken.** Neu gegenüber v4:
// `intro.handover` und `world.respawn` als Kaskaden (die zwei Ereignisse, die noch stumm waren),
// Respawn nur noch an EINER Stelle (`neustart()` statt zwei gleicher Kopien in Taste und Knopf),
// der **Prüfstand ist angeschlossen** (er lag in v4 als Modul da und war von nirgends importiert)
// mit den vier Schleifen als Panel-Knöpfe, Nahkamera als Standard, Kontrollprobe-Kachel im
// Bildstreifen, ein Zahlenkanal für `frameFehler` (der alte war ein Satz und damit als Messwert
// unbrauchbar) und das Vorwärmen des Post-Shaders beim Laden (tinyskies `Game.ts:1527`).
// ----------------------------------------------------------------------------
// **v3 (29.8.2026) — S1 „Ankunft in der Welt" und S1b „Maus und Touchpad".** Neu gegenüber v2:
// Startansicht mit Übergabe (`intro-flight.js`, NEUE Arbeit — es gibt in v17 kein Intro-Modul),
// Flugstart aus dem Stand (beweglicher Tempo-Boden in `carpet.js`), Umsehen und Lenken mit
// EINER Gebärde (`pointer-look.js`), laufende Tageszeit (`day-night.js`), Blob-Schatten unter
// der Karte (`ground-shadow.js`, Port aus v17), Kenney-Props als Landmarken
// (`globe-landmarks.js`), Sky-Dice im Tangentialrahmen (`sky-dice.js`, Port), Radial-Blur
// (`post-radial.js`, 1:1 aus v17), Laub am Boden (`ground-leaves.js`) und die Reparatur der
// stummen Tempostreifen (Schwelle 0,8 gegen unser Maximum 0,78 — siehe Frame-Kommentar).
// ----------------------------------------------------------------------------
// **Was hier 1:1 aus tinyskies kommt** (dannylimanseta/tinyskies, Branch
// cursor/globefly-multiplayer-globe-flight-game, gelesen 27.8.2026) — und was NICHT.
//
//   1:1 portiert, Konstanten unverändert:
//     · `simplex-noise.js`   ← SimplexNoise.ts + TerrainPresets.ts
//     · `terrain-surface.js` ← TerrainSurface.ts   (die „single source of truth" der Höhe)
//     · `spherical-math.js`  ← SphericalMath.ts    (Position als Quaternion, Großkreisbogen)
//     · `carpet.js`          ← Carpet.ts           (Flugphysik, Drift, Klippen-Gleitbonus)
//     · `carpet-mesh.js`     ← CarpetMesh.ts       (Teppich, Goldborte, Stoffwelle)
//     · `rim-light.js`       ← RimLight.ts         (Fresnel-Saum)
//     · `flight-controls.js` ← FlightControls.ts   (A/D lenken, W/S Tempo, ↑ steigen, Leer/F)
//     · `camera-rig.js`      ← CameraRig.ts        (Verfolgerkamera samt Dämpfung und FOV-Atmung)
//     · `carpet-trail.js`    ← CarpetTrail.ts      (zwei goldene Bänder)
//     · `speed-lines.js`     ← SpeedLines.ts       (Tempostreifen als Overlay)
//
//   KFB statt tinyskies, weil es hier keinen Sinn hätte:
//     · Der Passagier ist das **KFB-Pet**, nicht das Capybara (dessen GLB liegt in deren Repo).
//     · Der Teppichkörper trägt eine **Kartentextur** aus dem KFB-Deck — „Pet auf Karte" ist der
//       Avatar dieses Projekts, und der Teppich ist genau die Form dafür.
//     · Die Farbbänder der Kugel sind KFB-Palette statt tinyskies-Biome.
//
// **Der erste Anlauf war zu Recht kritisiert:** ich hatte Physik und Feld portiert, aber Kamera,
// Tastenbelegung, Avatar und FX selbst erfunden. Genau die drei Dinge, die das Fahrgefühl machen.
// Jetzt kommen sie aus der Quelle — inklusive der Details, die man sich nicht ausdenkt: `A` gibt
// PLUS turnRate, Steigen liegt auf **Pfeil-hoch** (nicht Leertaste), die Kamera nimmt als „oben"
// die normierte KAMERAPOSITION (nicht die Fahrzeugnormale), und der Blick wird um Faktor 0,78
// zusätzlich gebremst, „so look-at does not outrun position".
// ============================================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { createGlobe } from './globe.js';
import { createCarpet } from './carpet.js';
import { createCardCarrier } from '../terrain-planets-v1/card-carrier.js';   // v17-Aufbau: Pet auf Karte
import { createFlightControls } from './flight-controls.js';
import { createCameraRig } from './camera-rig.js';
import { createCarpetTrail } from './carpet-trail.js';
import { createContrails } from './contrails.js';               // v13 · Kondensstreifen 1:1 aus Contrails.ts (TS-Delta Stufe A)
import { createPetTraegheit } from './pet-traegheit.js';        // v13 · Cartoon-Verformung, träge an der Flugphysik
import { createSpeedLines } from './speed-lines.js';
import { TERRAIN_TYPES, setKontinentHook } from './simplex-noise.js';
import { createStarfield } from './starfield.js';
import { createAurora, createGodRays } from './sky-atmosphere.js';
import { getSkyPreset, paintRadialSky, buildLightRig, TIMES_OF_DAY, OZEAN_QUELLE } from './sky-presets.js';
import { STIMMUNGEN, stimmungNach } from './weltstimmungen.js';
import { initSphericalMath, cartesianFromSpherical, tangentFrame, lerpAngle } from './spherical-math.js';
import { initRimLight, addRimLight } from './rim-light.js';
import { createAudioSwitch } from './audio-switch.js';     // v2 · Klang: v17-Motor ⇄ tinyskies-Motor
import { createNarrator } from './narrator.js';             // v2 · Erzähler (Reflexe, Ebene 0)
// v2b · Der Flug-Avatar bekommt die v17-Schichten: erst die Kinetik (Deformer, Federn,
// Squash — die cartoonige Trägheit), dann das Facing (im Stand zu dir, mit Tempo in die
// Fahrtrichtung). Beide sind unverändert aus `terrain-v17` kopiert, weil sie dort geeicht
// sind; die REIHENFOLGE ist ihr Vertrag (pet.update → petKin → petFace).
import { createPetKinetics } from './pet-kinetics.js';
import { createPetFacing } from './pet-facing.js';
import { createGearIcon } from './gear-icon.js';
import { createSettingsPanel } from './settings-panel.js';
// ── v3 · S1 „Ankunft in der Welt" und S1b „Maus und Touchpad" ─────────────
// Alles NEU oder mit Umrechnung portiert; wer welche Herkunft hat, steht im Kopf des Moduls.
import { createIntroFlight } from './intro-flight.js';        // NEU (Befund 1)
import { createPointerLook } from './pointer-look.js';        // NEU (S1b)
import { createDayNight } from './day-night.js';              // Absicht aus DayNightCycle.ts
import { createCardShadow } from './card-shadow.js';        // v3b · Schatten, der den Boden abliest
import { createSunShadow } from './sun-shadow.js';          // v9 · der ECHTE Schatten der Quelle
import { createLensFlare } from './lens-flare.js';          // v9 · 1:1 aus LensFlare.ts
import { createAvatarLamp } from './avatar-lamp.js';        // v9 · Nahfeld-Lampe (Game.ts playerLight)
import { streuungTor, streuen, familienAbstandTor, createBelegung } from './verteilung.js';     // v9 · Streuung messen, nicht behaupten
import { isLand } from './globe-field.js';                  // v10 · Land/Wasser — EIN Prädikat für Streuungen
import { BODEN as KIT_BODEN, KIT as KIT_TABELLE } from './kit-massstab.js';   // v10 · EIN Maßstab pro Kit
import { weltAusId, weltHaken } from './welt-id.js';        // v10 · EINE Sprache für „welche Welt"
import { erdeZuschlag } from './erde-maske.js';             // v10 · die Erde als Schablone
import { createVulkane, createLeuchttuerme } from './natur-marken.js';   // v9 · auf der Streuungsschicht
import { createKomposition } from './komposition.js';               // v10 · Rule of Three als Reiter
import { createFlora } from './flora.js';                           // v11 · KayKit-Flora (+ Kenney-Kleinzeug) als Reiter
import { FELS, setFelsFaktor } from './kit-massstab.js';   // v12 · die deklarierte Fels-Ausnahme
import { createTsFlora } from './ts-flora.js';                      // v12 · Vegetation nach TS-Art: gebaut statt geladen
import { createMuenzen } from './muenzen.js';                       // v12 · goldene Münzen als Durchflug-Sammelgut
import { createRainOverlay, rainWeight, regenTor } from './rain-overlay.js';   // v11 · 1:1 aus RainOverlay.ts + DayNightCycle.getRainWeight
import { createMotivKasse, kasseSelbsttest } from './motiv-kasse.js';                // v11 · EIN Auftrag je Motiv, alle Leser teilen ihn
import { createBodenLesung } from './boden-lesung.js';      // v9 · EIN Eigentümer für die Bodenhöhe
import { createCarpetLeaves } from './carpet-leaves.js';    // 1:1 aus CarpetLeaves.ts
import { createCarpetWake } from './carpet-wake.js';        // v5 · Slice F · 1:1 aus CarpetWake.ts
import { createDriftSmoke } from './drift-smoke.js';        // v5 · Slice F · 1:1 aus CarpetDriftSmoke.ts
import { createSkyDice } from './sky-dice.js';                // Port v17, Tangentialrahmen
import { createLandmarkCollide } from './landmark-collide.js';  // v3 · S7b · durchfliegen / umfliegen / reagieren
import { createPortals, PORTAL_COLORS } from './portal.js';       // v6 · Slice E · Portal (E-31…E-33)
import { createSkyEnemies } from './sky-enemies.js';              // v6 · Slice E2 · Gegner als ZIELE
import { KARTE as FAHRZEUG_KARTE, ENTWURF_LAEUFER, vertragTor } from './fahrzeug-vertrag.js';  // v7 · Fahrzeug-Vertrag
import { bodenMessung, massstabMessung } from './walk-messung.js';   // v7 · die zwei Messungen vor E-43

// v7 · Die zwei Messbefunde. Modulweit, weil das Panel sie ANZEIGT und der Knopf sie
// SCHREIBT — zwei Leser, ein Wert. `null` heißt „noch nicht gemessen“ und wird als solches
// angezeigt; eine Messung, die beim Öffnen des Panels von selbst läuft, wäre ein Feature.
let bodenBefund = null, massBefund = null;
import { createImpactDust } from './impact-dust.js';            // v3 · S7f · Steinchen am Aufprallort
import { createPaperCard } from './paper-card.js';              // S3d · echtes Papier statt Quader
import { createTrauma } from './trauma.js';                     // v4 · Slice B · EIN Eigentümer der Kamerawucht
import { createFxBus } from './fx-bus.js';                      // v4 · Slice B · EIN Eingang für Ereignisse
import { KASKADEN } from './fx-script.js';                      // v4 · Slice B · die Kaskaden als DATEN
import { createMechImpact } from './mech-impact.js';            // v10 · Slice 1 · 24 Impact-Zellen als Kaskaden
import { createPruefstand } from './pruefstand.js';             // v5 · Slice C · die vier QA-Schleifen
import { createHudFlight } from './hud-flight.js';              // v5 · Slice G · EIN Signalgeber, vier Leser
import { createLightBudget } from './light-budget.js';          // v3 · S9a · EIN Ort für „wie hell ist die Welt"
import { createToPhong } from './to-phong.js';                  // v3 · S9c · EIN Beleuchtungsmodell
import { createSkyCards, cardTexture, artTexture } from './sky-cards.js';   // Port v17 + Naht 2 (Kugel)
import { createCardTowers } from './card-towers.js';            // S3d · Landmarken aus Karten
import { createKartenTeppich } from './karten-teppich.js';      // v10 · die Karte LIEGT auf dem Gelände
import { createLandmarkNames } from './landmark-names.js';      // Mechanik aus Landmarks.ts
import { createCollectHud } from './collect-hud.js';            // KISS-HUD: Fächer, Zähler, Ort
import { createCardFlight } from './card-flight.js';            // Karte fliegt in den Stapel
import { createCardRegistry } from '../terrain-planets-v1/card-registry.js';
import { createGlobeLandmarks, MARKEN, assignMarken } from './globe-landmarks.js';  // Kenney-Props (Befund 3)
import { planSites, planZones } from './globe-zones.js';      // v3 · S3a · Standorte + Bauplätze
import { setBiome, biomeAt, biomeReport, biomeZeile, biomeAbweichungen,
         biomeBasisSetzen, biomeLetzteProbe } from './globe-biome.js'; // v3 · S3c · v5 · Slice D
import { createRadialPost } from './post-radial.js';          // 1:1 aus v17
import { surfaceAltitudeAt } from './terrain-surface.js';
import { createMechStation } from './mech-station.js';   // v8 · Meckertronic Schritt 1
import { CARPET_CRUISE_SPEED } from './carpet.js';
// v2c · Pet-Look. Zwei Dinge, die v17 als Lehre notiert hat und die hier fehlten:
import { createPetLighting } from './pet-lighting.js';   // Environment + Gegenlicht + Tint
// **Der Oberflächen-Look ist ein EIGENES Modul und muss BESTELLT werden.** Bauanleitung §10,
// wörtlich: „ohne ihn ist das Pet flach.“ `pet-surface.v1.js` malt Clay/Papier triplanar im
// Objektraum (kein Modell-UV, also keine Terrassen) und setzt `flatShading: false`. Es gibt
// hier KEINEN lokalen Spiegel: fällt der Import aus, bleibt der zurückhaltende Default — das
// ist der Rückweg und derselbe Zustand wie vorher.
const SURF_CANON = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/pet-surface.v1.js';

// **GLOBE_RADIUS 5 — und das ist kein Geschmackswert.** tinyskies benutzt durchgehend 5
// (`Globe.ts` Konstruktor-Default und `worldConfig?.globeRadius ?? 5` an neun Stellen in Game.ts).
// Ich hatte 10 genommen; damit halbiert sich die Polygondichte pro Weltmeter, und die Facetten
// werden doppelt so groß — genau der Eindruck, den Georg am 27.8. gemeldet hat. Zugleich sind die
// Berge (MOUNTAIN_HEIGHT 0,52) auf Radius 5 zehn Prozent des Radius statt fünf: das Relief wirkt
// erst hier so kräftig wie im Vorbild. Alle anderen Maße (Teppich s = 0,025, Schwebehöhe 0,03,
// Kameradistanz 1,2) sind auf diesen Radius abgestimmt und stimmen ab jetzt ohne Umrechnung.
const GLOBE_RADIUS = 5;

// ⚠ **EIN Eigentümer für die Frage „welches Element ist die Bühne JETZT".**
// Die DC-Vorlage ERSETZT `#tv-stage`. Eine EINMAL gemerkte Referenz zeigt danach auf eine Leiche:
// `appendChild` gelingt, wirft nichts, und das Element ist nie zu sehen. Genau daran ist der
// Diagnose-Knopf gescheitert (Georg, 29.8.: „copy button funktioniert nicht!") — gemessen
// `document.contains(stage) === false`, das Blatt hing am abgetrennten Knoten.
// Deshalb wird der Knoten IMMER zum Zeitpunkt des Gebrauchs aufgelöst, nie gemerkt.
// Das ist Fehlerklasse 1 in ihrer leisesten Form: nicht zwei Verwalter, sondern ein Verwalter,
// der eine veraltete Kopie der Wahrheit hält.
function buehne() { return document.getElementById('tv-stage'); }

let startZaehler = 0;
// v3 · S3c · Das Biom unter dem Pet, jedes Bild neu gelesen (Anzeige in Marke und Panel).
let biomHier = null;
// v3 · S7d · Die Bauten, die der schwebende Boden mitzählt. Früh deklariert, weil
// `bodenMitBauten` von `sky.setAltFn` gerufen wird, bevor die Landmarken geplant sind.
let bautenListe = [];

async function start() {
  // ⚠ **Doppelstart-Sperre.** Die Vorlage dieser Seite rendert neu, und ein Modul kann dabei ein
  // zweites Mal ausgeführt werden. Zwei rAF-Schleifen wären von außen kaum zu sehen — aber sie
  // verdoppeln die Last und erzeugen genau das Bild „läuft schnell, hält ruckelig inne, nimmt hart
  // auf". Deshalb: einmal ist einmal. `__globe.startZaehler` sagt, ob es versucht wurde.
  startZaehler++;
  if (window.__globe) { console.warn('[globe] Zweitstart verhindert (Versuch ' + startZaehler + ')'); return; }
  // ⚠ **Auf die Bühne warten.** Das Modul läuft, sobald der Browser es geladen hat — die
  // DC-Vorlage streamt aber noch, und `#tv-stage` existiert dann oft nicht. Ergebnis war der
  // hellblaue Schirm, der erst nach ein- bis zweimal Neuladen verschwand (Georg, 27.8., 03:53):
  // beim schnellen Start fehlte das Element, beim langsamen war es da. Ein Zufallsfehler, und
  // deshalb schwer zu sehen. Jetzt wird gewartet, statt zu hoffen.
  const stage = await new Promise((res, rej) => {
    // ⚠ **Kein requestAnimationFrame im Startpfad.** Genau das war Georgs „1–2 mal neu laden, bis
    // der hellblaue Screen verschwindet": rAF tickt in einer VERDECKTEN Seite gar nicht, also lief
    // weder das Auflösen noch der Timeout (der stand selbst in der rAF-Kette) — start() hing für
    // immer, ohne eine Zeile Fehler. Dieselbe Fehlerklasse hatte ich schon zweimal notiert und die
    // Lehre nur auf das erste Bild angewandt, nicht auf das Warten selbst.
    //
    // Jetzt: erst synchron prüfen (im Normalfall ist die Bühne längst da), sonst MutationObserver
    // plus setTimeout-Deadline. setTimeout läuft auch verdeckt, nur gedrosselt.
    const find = () => buehne();
    const sofort = find();
    if (sofort) return res(sofort);
    let obs = null;
    const fertig = (el, err) => {
      if (obs) { obs.disconnect(); obs = null; }
      clearTimeout(deadline);
      if (el) res(el); else rej(err);
    };
    const deadline = setTimeout(
      () => fertig(find(), new Error('#tv-stage nie erschienen')), 8000);
    obs = new MutationObserver(() => { const el = find(); if (el) fertig(el); });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  });
  initSphericalMath(THREE);
  initRimLight(THREE);

  const q = new URLSearchParams(location.search);
  // ── v10 · DIE WELT KOMMT AUS EINER KENNUNG ───────────────────────────────────
  // Georg, 2.9., nach der Weltbau-Werkbank: *„daher würde ich die zweite Welt erstmal fürs
  // Testing nehmen: W1-anti_rules_toolkit-default-E0-D0-M-18“.* Also ist das ab jetzt die
  // Vorgabe — keine gewürfelte Welt mehr beim Laden.
  // **Warum das mehr ist als ein Vorgabewert:** eine Welt, die bei jedem Laden anders ist,
  // kann man nicht abnehmen. Jeder Befund wäre „bei mir sah es anders aus“, und dieses Projekt
  // hat genau daran schon Stunden verloren. Eine Kennung macht die Welt zitierbar.
  // Das Format und die Auflösung stehen in `welt-id.js` — EINE Datei für beide Seiten, damit
  // Werkbank und Spiel nie zwei verschiedene Welten aus demselben Text bauen.
  const WELT_VORGABE = 'W1-anti_rules_toolkit-default-E0-D0-M-18';
  const weltText = q.get('welt') || WELT_VORGABE;
  const welt = weltAusId(weltText);
  if (!welt) console.warn('[welt] unlesbare Kennung: ' + weltText + ' — fällt auf Zufall zurück');
  // `?seed=` und `?typ=` gewinnen weiter über die Kennung: sie sind das Werkzeug für
  // „dieselbe Welt, aber anders geschnitten“ und dürfen nicht von einer Vorgabe verdeckt werden.
  const seed = q.has('seed') ? (parseInt(q.get('seed'), 10) | 0)
    : (welt ? welt.seed : (Math.random() * 1e9) | 0);
  const terrainType = TERRAIN_TYPES.includes(q.get('typ')) ? q.get('typ')
    : (welt && TERRAIN_TYPES.includes(welt.typ) ? welt.typ
       : TERRAIN_TYPES[(seed >>> 3) % TERRAIN_TYPES.length]);
  // ⚠ **Der Haken wird HIER gesetzt, vor der ersten Feldprobe.** Unter dieser Zeile fragen
  // Bauplatzsuche, Mesh, Zonen, Props und Karten dasselbe Feld; ein später gesetzter Zuschlag
  // würde eine Welt bauen, deren erste Hälfte eine andere ist als ihre zweite.
  const weltZuschlag = welt ? weltHaken(welt, erdeZuschlag) : null;
  setKontinentHook(weltZuschlag);

  // ── v3 · S3c · Biom-Domänen, und zwar VOR allem, was das Höhenfeld liest ──────────────
  // Reihenfolge ist der ganze Trick — dieselbe Lehre wie bei den Zonen in S3a: `planSites`
  // tastet das Feld ab und der Globus wird EINMAL gebacken. Wer die Domänen später einschaltet,
  // hat ein Mesh in einer Welt und eine Physik in einer anderen.
  // `?biom=0` ist der Rückweg (ein Typ für die ganze Kugel, wie bis v3c).
  const biomStaerke = q.has('biom') ? Math.max(0, Math.min(1, parseFloat(q.get('biom')) || 0)) : 1;
  const biomSchaerfe = q.has('biomk') ? (parseFloat(q.get('biomk')) || 4.5) : 4.5;
  setBiome({ on: biomStaerke > 0, seed, baseType: terrainType,
             strength: biomStaerke, sharp: biomSchaerfe });
  const biomZahlen = biomReport();
  function biomReport() { return biomeReport({ radius: GLOBE_RADIUS, speed: 0.28, seconds: 60 }); }

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  // v11 · Wetter: Regen-Overlay (Bildschirm) — Quelle RainOverlay.ts. Nebel kommt weiter aus dem
  // Himmels-Preset (SkyPresets: fogColor/fogNear/fogFar), wie in Game.ts 1155; kein zweiter Nebel.
  const regen = createRainOverlay({ THREE });
  const wetter = { aus: q.get('regen') === '0', override: q.has('regen') && q.get('regen') !== '0' ? Math.max(0, Math.min(1, parseFloat(q.get('regen')) || 0)) : -1, fogScale: 1 };
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  (buehne() || stage).appendChild(renderer.domElement);

  // Tageszeit: `?zeit=day|evening|night`, sonst aus dem Seed. Das Preset liefert Himmelsverlauf,
  // Nebel, sieben Lichter, Ozeanfarben, Rim, Wolkendeckkraft und Atmosphärenglut — alles aus
  // `SkyPresets.ts`, nichts davon geraten.
  const timeOfDay = TIMES_OF_DAY.includes(q.get('zeit'))
    ? q.get('zeit') : TIMES_OF_DAY[(seed >>> 11) % TIMES_OF_DAY.length];
  const preset = getSkyPreset(timeOfDay);

  const scene = new THREE.Scene();
  scene.background = paintRadialSky(THREE, preset);
  scene.fog = new THREE.Fog(preset.fogColor, preset.fogNear, preset.fogFar);

  const rig = createCameraRig(THREE, 16 / 9);
  const camera = rig.camera;

  const lights = buildLightRig(THREE, scene, preset);

  // ── v2c · Pet-Beleuchtung (S14 aus v17) ──────────────────────────────────
  // Sieben Lampen leuchten die KUGEL aus; das Pet stand darin ohne Environment und ohne
  // Gegenlicht, also flach. Drei Bausteine, alle regelbar: PMREM-Environment (Farbe des
  // Himmels in jedem PBR-Material), kaltes Fill gegen die Sonne, dezenter Tint.
  //
  // ⚠ **Wir haben keinen Himmels-MESH.** v17 backt aus seinem Skydome; hier ist der Himmel eine
  // Canvas-Textur als `scene.background` (radialer Bildschirm-Backdrop — als Kugel gelesen wäre
  // sie falsch herum). Also wird für den Bake eine Kugel aus DENSELBEN Preset-Zahlen gemalt:
  // `hemiSkyColor` oben, `ambientColor` am Horizont, `hemiGroundColor` unten. Keine zweite
  // Wahrheit — dieselben Werte, die auch die Lampen füttern.
  const lighting = createPetLighting({ THREE, renderer, scene });
  // S9c · Die Lampe gehört dem Rig, nicht dem Modul — es führt sie nur nach.
  if (lights && lights.petFill && lighting.useFill) lighting.useFill(lights.petFill);
  lighting.setTint(preset.rimColor != null ? preset.rimColor : 0xffffff, 0.10);
  (function bakeSky() {
    const cv = document.createElement('canvas');
    cv.width = 8; cv.height = 128;
    const g = cv.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 0, 128);
    const hex = (c) => '#' + new THREE.Color(c).getHexString();
    grad.addColorStop(0, hex(preset.hemiSkyColor));
    grad.addColorStop(0.5, hex(preset.ambientColor));
    grad.addColorStop(1, hex(preset.hemiGroundColor));
    g.fillStyle = grad; g.fillRect(0, 0, 8, 128);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(60, 16, 12),
      new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, depthWrite: false }));
    dome.name = 'env-proxy';
    lighting.bakeEnvironment(dome);   // rendert die Kugel EINMAL in eine PMREM-Map
    dome.geometry.dispose(); dome.material.dispose();
  })();

  // Sternenhimmel 1:1 (`Starfield.ts`): 6240 Sterne, 8000 Bandsterne, 1200 Nebelflecken.
  // Die Deckkraft folgt dem Preset — tags aus, nachts voll, so wie `DayNightCycle` es fahrt.
  const stars = createStarfield(THREE);
  stars.setOpacity(preset.stars ? 1 : 0);
  scene.add(stars.group);

  // ── Block 2 · Atmosphäre (Georg, 1.9.: „das wäre eigentlich der Hauptfokus für diesen Sprint") ──
  // Aurora und Gottesstrahlen, beide zeichengleich aus der Quelle portiert (`sky-atmosphere.js`).
  // Sie teilen sich den Tag — Aurora am Nachtgewicht, Strahlen an dessen Gegenstück — und sind
  // deshalb **nie gleichzeitig sichtbar.** Das ist die Antwort auf die Sorge aus dem Sprintplan:
  // die additive Summe ist pro TAGESZEIT zu prüfen, nicht über alle sechs Effekte.
  const aurora = createAurora(THREE);
  scene.add(aurora.group);
  aurora.setGewicht(preset.aurora ? 1 : 0);
  const strahlen = createGodRays(THREE);
  scene.add(strahlen.group);
  strahlen.setGewicht(preset.aurora ? 0 : 1);

  const t0 = performance.now();
  // ── v3 · S3a · Bauplätze planen, BEVOR der Globus gebacken wird ─────────────
  // Die Zonen stehen IM Höhenfeld (`terrain-surface.setTerrainZones`). Der Globus ist EINE
  // gebackene Geometrie — wer die Zone später einträgt, hat ein Mesh, das die Physik nicht
  // mehr trifft. Deshalb: Standorte wählen → Modell zuweisen (die Zonengröße hängt an der
  // Modellhöhe) → Zonen eintragen → dann bauen. `?zonen=0` schaltet sie ab (Rückweg).
  const zonenAn = q.get('zonen') !== '0';
  const markenSites = assignMarken(planSites({
    THREE, radius: GLOBE_RADIUS, seed, terrainType, count: 26, salt: 991,
    maxSlope: 0.45, overdraw: 40,
  }), MARKEN);
  let zonenZahl = 0;
  if (zonenAn) {
    zonenZahl = planZones({
      THREE, radius: GLOBE_RADIUS, seed, terrainType, sites: markenSites,
      // Zonenradius aus der Modellhöhe: die Hexagon-Kit-Bauten sind etwa so breit wie hoch,
      // 1,5× gibt dem Sockel Rand. (Die echte Grundfläche steht als `fp` im Asset-Index — der
      // ist aber erst asynchron da, und Zonen müssen VOR dem Bake stehen.)
      radiusOf: (s) => (s.def ? s.def.h : 0.18) * 1.5,
    }).count;
  }
  const globe = createGlobe({ THREE, radius: GLOBE_RADIUS, segments: 256, seed, terrainType,
                             biomeTint: biomStaerke > 0 ? 0.34 : 0,
                             atmosphereGlow: preset.atmosphereGlow, rimColor: preset.rimColor,
                             cloudOpacity: preset.cloudOpacity, oceanShallow: preset.oceanShallow,
                             oceanDeep: preset.oceanDeep, oceanFoam: preset.oceanFoam });
  scene.add(globe.group);
  const buildMs = Math.round(performance.now() - t0);
  // ── v5 · Slice D · Die Referenz wird HIER festgehalten, und die Stelle ist der ganze Punkt ──
  // Zweiter Anlauf. Der erste stand direkt hinter setBiome(...) — und meldete sechs
  // Abweichungen, die keine waren. Ursache: setBiome schreibt die Mischwerte NICHT, es merkt
  // sich nur den Basistyp; die Zahlen kommen aus dem Preset, wenn die erste Probe läuft — und
  // die erste Probe ist der Aufbau der Kugel, also die Zeile darüber.
  // *Eine Basislinie ist keine Zahl, sondern ein ZEITPUNKT. Ich habe zwei Anläufe gebraucht, um
  // den richtigen zu treffen — und beide Male hätte der Prüfer „⚠“ gemeldet und nichts gemeint.*
  biomeBasisSetzen();

  const carpet = createCarpet({ THREE, globeRadius: GLOBE_RADIUS, seed, terrainType });
  // **Der Avatar ist der v17-Aufbau, nicht der tinyskies-Teppich** (Georg, 27.8.: „pet sollte exakt
  // so auf karte gebaut sein wie in KFB Travel v17"). `card-carrier.js` ist genau dieses Rig: eine
  // gewellte Kartenplatte mit echter Dicke, dunklem Rand, Kartenrückseite unten, ein Sitz, der die
  // Fläche jeden Frame ABLIEST (S93f — deshalb schwebt das Pet nicht), und eine Clip-Ebene, die
  // alles wegschneidet, was unter die Kartenfläche taucht.
  //
  // ⚠ **Der Maßstab gehört der GRUPPE, nicht der Kartenbreite.** Erster Versuch war
  // `createCardCarrier({ width: 0.075 })` — und das Pet war weg. Grund: das Rig hat ABSOLUTE
  // Konstanten für eine 3,0 breite Karte (Dicke `TH` 0,055, Sitzhöhe 0,055, Wellenamplitude 0,06,
  // Bob 0,03). Bei Breite 0,075 ist die Kartendicke fast so groß wie die Karte selbst, der Sitz
  // schwebt 73 % der Kartenbreite darüber, und die Wellen überfahren alles. Nur `width` zu
  // skalieren ist deshalb kein Maßstabswechsel, sondern eine Zerstörung der Proportionen.
  //
  // Richtig: das Rig in seiner Originalgröße bauen (alle Konstanten stimmen zueinander) und die
  // ganze Gruppe uniform verkleinern. `carrier.sync` schreibt nur Position und Lage, nie die
  // Skalierung — sie überlebt also jeden Frame.
  const carrier = createCardCarrier({ THREE });
  const CARD_WELT = 0.075;                       // Zielbreite in Weltmaß (wie der tinyskies-Teppich)
  const avatar = carrier.group;
  avatar.scale.setScalar(CARD_WELT / 3.0);       // 3,0 ist die native Kartenbreite des Rigs
  scene.add(avatar);
  lighting.register(avatar);                     // Tint + envMapIntensity auf Karte und Sitz
  const timeUniform = null;   // die Welle steckt im Carrier, nicht in einem Uniform
  // Für die POV-Blende: alle Materialien des Avatars einmal einsammeln. `transparent` wird sofort
  // gesetzt, nicht erst beim Ausblenden — ein Materialwechsel zur Laufzeit kostet eine Neukompilierung
  // und das wäre ein Ruckler genau in der Bewegung, in der man hineinzoomt.
  const avatarMats = [];
  avatar.traverse((o) => { if (o.material) { o.material.transparent = true; avatarMats.push(o.material); } });

  let avatarMatsGezaehlt = avatarMats.length;

  // Zustandsobjekt für `carrier.sync`: Position und Lage kommen aus der Kugelmathematik, Tempo aus
  // der Flugphysik. Einmal angelegt, nicht je Bild — das Rig liest nur.
  // ⚠ **Der Zustand muss VOLLSTÄNDIG sein.** `carrier.sync` liest `bank`, `pitchTilt`, `boosting`,
  // `climbIn` und `speed` (card-carrier.js Zeile 305–345). Ich hatte nur Position, Lage und Tempo
  // geliefert — `undefined * 1.15` ist NaN, NaN läuft durch die Federung in `lean.rotation` und in
  // das Wellen-Array der Kartenfläche, und damit verschwinden Karte UND Pet lautlos. Kein Fehler in
  // der Konsole, nichts animiert: genau Georgs Befund vom 27.8. („pet fehlt", „nix animiert").
  // **Ein unvollständiges Zustandsobjekt ist kein halber Aufruf, sondern ein stiller NaN-Generator.**
  const carrierState = {
    position: new THREE.Vector3(), quaternion: new THREE.Quaternion(),
    speed: 0,        // Fahrt — treibt Wellentempo und Amplitude
    bank: 0,         // Querlage — Karte kippt in die Kurve, Heck schwingt aus
    pitchTilt: 0,    // Nickwinkel — Karte stellt sich beim Steigen auf
    boosting: false, // Schub — Stauchimpuls und Heckaufstellen
    climbIn: 0,      // Steig-EINGABE (−1…1), nicht die gemessene Rate
  };
  const _cm = new THREE.Matrix4(), _cs = new THREE.Vector3();
  const _cfwd = new THREE.Vector3();   // v10 · Fahrtrichtung für das Gegenlicht (aus dem Quaternion)

  const trail = createCarpetTrail(THREE);
  scene.add(trail.group);
  // ── v13 · Kondensstreifen (TS-Delta Stufe A, erstes Stück) ────────────────────────
  // Zwei kalte Bänder in der LUFT an den Hinterecken des Teppichs; Trail (Stoff) und Wake (Boden)
  // bleiben, wie sie sind. Ansatzpunkte sind die eine deklarierte Abweichung (contrails.js Kopf).
  const kondens = createContrails(THREE);
  scene.add(kondens.group);
  // **Die Anker gehören IN die gezeichnete Karte** (Georg, 3.9.: „das sind doch quasi comic
  // speedlines → also müssen sie von dem object/card ausgehen!"). Zwei Fassungen haben die
  // Ansatzpunkte aus `carpet-mesh.js` gerechnet — dem Fahrzeugmesh, das hier NICHT gezeichnet wird.
  // Gezeichnet wird der CardCarrier (0,075 breit, 0,042 tief), und der sagt seine Maße selbst:
  // `halfW`/`halfD` in nativen Einheiten, dazu `surfaceAt(x, z)` — die VERFORMTE Fläche. Elternknoten
  // ist `lean`, damit die Striche Federn, Bob und Wellenschlag der Karte mitmachen, und die Höhe wird
  // pro Bild abgelesen statt angenommen. Danach kann keine Lücke mehr entstehen — nicht weil die Zahl
  // stimmt, sondern weil keine Zahl mehr abgeschrieben wird.
  kondens.anchorTo(carrier.lean || carrier.group, carrier.halfW, carrier.halfD, carrier.surfaceAt);
  if (new URLSearchParams(location.search).get('contrails') === '0') kondens.setEnabled(false);
  const lines = createSpeedLines(THREE);
  const controls = createFlightControls(renderer.domElement);

  // ── v3 · Die neuen Besitzer, alle vor dem ersten Bild ────────────────────
  // Reihenfolge im Bild (unverhandelbar, wie in v20 notiert):
  //   Szene → post-radial → Speedlines → HUD.
  const post = createRadialPost({ THREE, renderer });
  const intro = createIntroFlight({ THREE, globeRadius: GLOBE_RADIUS, params: { dur: 5.2 } });
  const look = createPointerLook({ THREE, el: renderer.domElement });
  const zyklus = createDayNight({ THREE, scene, lights, stars, globe, lighting, start: timeOfDay,
                                 // ── Slice A (30.8.) · Der Zyklus LÄUFT ───────────────────────────
                                 // Er stand auf `on: false` — mit der Begründung „ein Lauf, den man
                                 // nicht bestellt hat, ist Unruhe". Die Begründung gilt für einen
                                 // Standard IM MODUL; in DIESER Welt ist der Zyklus die einzige
                                 // langsame Transition, die es gibt (D-08 §3.2), und sie war damit
                                 // nie im Bild beurteilt.
                                 // `skyHz` 4 → 14: vier Neuanstriche je Sekunde sind eine
                                 // Quantisierung einer STETIGEN Größe. Bei 90 s Segmentblende fällt
                                 // das nicht auf, bei einem manuellen Sprung oder einem Würfel, der
                                 // die Zeit anhält, ist es eine Treppe. 14 Hz sind eine 512²-Leinwand
                                 // alle 71 ms — die Bildzeit-Basislinie (12,3 ms) ist der Prüfstein.
                                 params: { on: true, skyHz: 14 } });
  const schatten = createCardShadow({ THREE, radius: GLOBE_RADIUS, seed, terrainType,
                                     // ── 30.8., Nachmittag · Der Schatten ist AUS ───────────────
                                     // ⚠ **ZWEI EIGENTÜMER, und der hier gewinnt.** Ich hatte den
                                     // Standard in `card-shadow.js` auf `on: false` gesetzt und
                                     // Georg gemeldet, der Schatten sei weg. Er war es nicht:
                                     // `Object.assign(defaults, opts.params)` gibt der
                                     // AUFRUFSTELLE das letzte Wort, und hier stand `on: true`.
                                     // Gemessen: `schatten.enabled = true`, Mesh sichtbar.
                                     // **Damit war meine Meldung falsch und zwei Dokumente
                                     // beschrieben einen Zustand, den der Build nicht hatte** —
                                     // genau die Fehlerklasse, die §05o aufschreibt. Ein Standard
                                     // in einer Modul-Datei ist keine Einstellung, solange ihn ein
                                     // Aufruf überschreibt.
                                     //
                                     // Der Grund für AUS ist ein Befund an der Quelle, kein
                                     // Geschmack: Georg, „schatten sehe ich in TS nicht…?" — richtig.
                                     // `Game.ts` 1167–1174 spannt die Schattenkamera über **±22
                                     // Weltunits** bei Globusradius **5**; ein Baum von 0,06
                                     // Einheiten wirft damit einen **3-Pixel-Schatten**. Technisch
                                     // aktiv, im Bild nicht vorhanden. Mein früheres „die Quelle hat
                                     // echte Schatten" kam aus einer ZÄHLUNG von 96 Fundstellen —
                                     // und eine Zählung ist keine Aussage über das Bild.
                                     //
                                     // Was damit von der alten Begründung übrig bleibt: die Höhe
                                     // eines Flugspiels braucht eine Anzeige (D-08 §3.3), und der
                                     // Schatten war unsere. Sie stirbt hier nach §05q („im Zweifel
                                     // stirbt ein Feature"), und der Ersatz ist noch nicht erfunden
                                     // — das ist eine offene Aufgabe, kein gelöstes Problem. Der
                                     // Regler bleibt vollständig (Panel: „Shadow under the card"),
                                     // wer ihn aufdreht, bekommt auch die harten Polygonkanten auf
                                     // steilem Gelände zurück (Georgs dunkler Keil im Land).
                                     //
                                     // ⚠⚠ **1.9. (v9), und diesmal war ICH die falsche Quelle.**
                                     // Georg am Bild: „unser Schatten ist anders als in tinyskies —
                                     // dort gibt es doch einen (Screenshot), der scheint
                                     // lichtabhängig und leicht versetzt." Er hat recht, und der
                                     // Grund steht drei Zeilen über dieser: ich habe die
                                     // Schattenkamera im KONSTRUKTOR gelesen (±22) und nicht ihre
                                     // Schreiber gezählt. `Game.ts` 3164–3170 setzt je Bild
                                     // `sunLight.target` auf den Spieler und die Box auf **±5** —
                                     // 0,0049 u je Texel bei 2048 px, der Teppich also ~15 Texel.
                                     // Die Quelle HAT einen echten Schatten; er ist nur klein,
                                     // weich und wandert mit. Nachgebaut in `sun-shadow.js`.
                                     // Dieses Modul hier bleibt der Ersatz-Regler und bleibt AUS.
                                     surfaceAltitudeAt, params: { opacity: 0, on: false } });
  scene.add(schatten.mesh);
  // ── v9 · Der echte Sonnenschatten (Quelle: Game.ts 1141–1177 + 3164–3170) ───────────────────
  // Empfänger sind die zwei Flächen, auf die er im Bild fällt: die Kugel und (bei Bodenfahrt)
  // nichts weiter — Props werfen, empfangen aber nicht (dieselbe Entscheidung wie in der Quelle,
  // wo nur `surfaceMesh.receiveShadow = true` steht).
  const sonnenSchatten = createSunShadow({ THREE, renderer, sun: lights.sun,
                                          empfaenger: [globe.mesh] });
  // Georg, 1.9.: „ich würde die tinyskies-Settings bei uns als default = on setzen → also auch die
  // Wolken- & Prop-Schatten." Also AN. Angewandt wird EINMAL, nachdem Landmarken und Türme
  // gebaut sind (`werferSetzen()` weiter unten) — hier steht nur der Zustand.
  let werferAn = true;
  const werferSetzen = () => {
    const setzen = (root) => { if (root) root.traverse((o) => { if (o.isMesh || o.isInstancedMesh) o.castShadow = werferAn; }); };
    setzen(globe.clouds); setzen(marken && marken.group); setzen(tuerme && tuerme.group);
  };
  scene.add(sonnenSchatten.ziel);
  // ── v9 · Lens Flare (1:1 aus LensFlare.ts) ──────────────────────────────────────────────────
  // Hängt an DERSELBEN Lampe wie der Schatten — eine Sonne, zwei Leser. Die Farbskala kommt aus
  // dem Preset (`flareColorScale`, das Feld tragen unsere Presets seit v3), das Tagesgewicht
  // rechnet der Wirt ein (Quelle: Game.ts 6290).
  const flare = createLensFlare({ THREE, sonne: lights.sun });
  // v9 · Georgs „Kerzenlicht am Avatar": eine PUNKTlampe, kein Kegel (Quelle: Game.ts 1517/3146/6288).
  const lampe = createAvatarLamp({ THREE, scene });
  flare.setColorScale(preset.flareColorScale || [1, 1, 1]);
  const leaves = createCarpetLeaves({ THREE });
  scene.add(leaves.group);
  // ── v5 · Slice F · Kielwasser und Driftstaub ────────────────────────────────────────────────
  // Beide sitzen bewusst NEBEN den Blättern: es sind dieselbe Bauform (gepoolte Points, ein
  // Draw-Call, flache Felder) und dieselbe Familie von Auslösern (Tempo · Untergrund · Drift).
  // `wake` ist zusätzlich der Wirker, auf den `water.enter` seit Slice B wartet.
  const wake = createCarpetWake({ THREE, globeRadius: GLOBE_RADIUS, seed, terrainType });
  wake.setCamera(camera);
  scene.add(wake.group);
  const rauch = createDriftSmoke({ THREE, globeRadius: GLOBE_RADIUS });
  rauch.setCamera(camera);
  scene.add(rauch.group);
  // Maße für den Durchflug (nicht für die Himmelsdekoration): näher und größer. Bei Radius 1,15
  // liegt ein Sitz nach Abzug der Krümmung (1,15²/2R = 0,13) rund 0,07 über dem Boden — also in
  // Flughöhe. Regelbar im Panel.
  const dice = createSkyDice({ THREE, sfx: (n, s) => audioSfxSpaeter(n, s),
                              params: { visible: true, radius: 1.9, size: 0.05 } });
  // ⚠ **Ringradius 1,15 → 1,9** (Georg: „die Würfel werden am Rand extrem verzerrt").
  // Das war keine Deformer-Fehlfunktion, sondern **echte Perspektive**: bei 1,15 Weltmaß vor dem
  // Spieler und einer Kamera 1,2 dahinter zieht ein Würfel in etwa einem halben Weltmaß Abstand
  // am Bildrand vorbei — und am Rand eines weiten Bildwinkels streckt jede Perspektive einen
  // KÖRPER stark (eine Karte fällt nicht auf, sie ist flach). Kein Shader-Trick behebt das; nur
  // Abstand. Weiter draußen setzen heißt: man sieht sie früher, frontaler und trifft sie im
  // vorderen Bilddrittel statt im Vorbeirauschen.
  // Georg, 29.8.: „ich sehe gerade keine würfel · zwischendurch sahen sie richtig cool aus!"
  // Sie standen auf `visible: false` und mussten mit K geholt werden — ein Pickup, das man
  // einschalten muss, ist kein Pickup. Jetzt sind sie Teil der Welt; `?dice=0` schaltet sie aus.
  if (q.get('dice') === '0') dice.setVisible(false);
  dice.setSphere(GLOBE_RADIUS);
  // v3 · S7h · **Die Würfel lesen das REINE Gelände, die Karten den Bauten-Boden.** Das ist eine
  // Entscheidung, kein geerbter Standard: eine Karte darf über einem Dach hängen (man sieht sie),
  // ein Würfel muss TREFFBAR sein — auf `bodenMitBauten` säße er über einem Schloss (0,22 hoch)
  // bei 0,30 über Grund und damit weit über der Flughöhe von 0,12. Zwei Ansprüche, zwei Antworten,
  // aber je Anspruch genau EINE Höhenfunktion.
  dice.setAltFn((x, y, z) => surfaceAltitudeAt(seed, terrainType, x, y, z));
  scene.add(dice.group);

  // ── v3 · S9a/S9c · Der Lichthaushalt bekommt einen Eigentümer ──────────────────────────────
  // Reihenfolge ist Absicht: das MESSGERÄT zuerst, der Umbau danach. Sieben Runden Whack-a-Mole
  // sind entstanden, weil ich an einer Summe gedreht habe, die ich nicht ablesen konnte (§6j).
  const budget = createLightBudget({ THREE, scene, renderer });
  // Der Konverter macht die Welt einheitlich Phong (wie die Quelle). Das Pet ist der einzige
  // begründete Sonderfall und bleibt PBR — `pet-lighting.register` markiert es, `to-phong` lässt
  // markierte Materialien in Ruhe.
  const phong = createToPhong({ THREE });
  let phongGeprueft = false;   // erst nach dem späten Durchlauf ist „no stray pbr" eine Aussage

  // ── v3 · S7f · Steinchen: EIN System, zwei Kinetiken ─────────────────────────────
  // Georg: „… die der jeweiligen impact-physik/kinetik dezent, aber wirkungsvoll animiert folgen".
  // Beide Anlässe geben ihre eigene Geschwindigkeit mit — der Würfel seine senkrechte
  // Aufprallgeschwindigkeit, der Teppich seine Fahrtgeschwindigkeit. Daraus macht `impact-dust`
  // ohne zweiten Codepfad einmal ein Spritzen und einmal eine Schleppe.
  const staub = createImpactDust({ THREE, params: { camera } });
  scene.add(staub.object);
  dice.onBounce = (p, n, v, nr) => {
    // Erster Bounce ist der harte — danach weniger Steinchen, sonst wird aus „dezent" eine Wolke.
    staub.burst(p, n, v, nr === 1 ? 9 : nr === 2 ? 5 : 3);
  };
  // Und die Kehrseite derselben Entscheidung: statt ÜBER den Bauten zu schweben, meiden die Würfel
  // sie seitlich. `bautenListe` ist beim ersten Aufruf leer — das ist die ehrliche Antwort für
  // „es steht noch nichts auf der Welt" (und `anchor` erzwingt nach sechs Versuchen einen Platz,
  // damit ein Würfel nie ausfällt).
  dice.setKeepOut((x, y, z) => {
    for (const s of bautenListe) {
      const d = x * s.n.x + y * s.n.y + z * s.n.z;
      if (d <= 0) continue;
      const hoehe = (s.def ? s.def.h : 0.18);
      if (Math.acos(Math.min(1, d)) * GLOBE_RADIUS < hoehe * 0.9 + 0.12) return true;
    }
    return false;
  });
  // ── v3/S3d · Karten im Durchflug (sky-cards, Kugelfassung) ─────────────────
  // Maßstäbe umgerechnet aus v17 (Karte 11 → 0,08; Ring 150 → 1,1): Faktor ~140, weil unser
  // Globus Radius 5 hat und die Flugkarte 0,075 breit ist. Alles andere ist Quellwert.
  const registry = createCardRegistry();
  // v11 · **Die Motiv-Kasse liegt VOR der Registry** (`motiv-kasse.js`): seit die Sky-Card über
  // ihrer liegenden Karte hängt, fragen zwei Leser dasselbe Kartenobjekt — und `requestArt`
  // verwarf den zweiten still (dauerhafte Rückseite, Georgs Befund vom Abend). Ab hier bekommt
  // die Registry nie zwei Anfragen für ein Motiv, und beide Leser bekommen ihre Antwort.
  const kasse = createMotivKasse({ registry });
  const sky = createSkyCards({ THREE, registry: kasse, params: {
    count: 6, width: 0.08, ring: 1.15, ringJit: 0.5,
    // Höhenband ÜBER der Flughöhe des Spielers. Gemessen: das Pet fliegt 0,03 über Grund, mit
    // Schub bis 0,52. 0,015…0,11 liegt damit im normalen Flug UND im Schub — mein erster Wert
    // (0,05…0,24, direkt aus v17 umgerechnet) hing die Karten bis zu drei Kartenbreiten über den
    // Kurs, also nur mit Steigen erreichbar.
    // **Trefferfenster 1,8 statt 1,0 (Naht, bewusst).** In v17 ist eine Karte 11 Einheiten breit,
    // da IST die Kartenfläche ein faires Tor. Bei 0,08 Breite ist sie eine Nadel — das halbe
    // Fenster wäre 0,04 × 0,023. 1,8 macht daraus 0,072 × 0,041: noch Zielen, aber treffbar.
    // Regelbar im Panel, 1,0 ist der Quellwert.
    passRadius: 1.8,
    // Schmales Band über GRUND: gleichmäßig treffbar. Der Rest ist ein anderer Spielmodus.
    yMin: 0.005, yMax: 0.045, driftAmp: 0.012, tiltAmp: 0.22, visible: true,
  } });
  sky.setSphere(true, GLOBE_RADIUS);
  sky.setAltFn((x, y, z) => bodenMitBauten(x, y, z));
  scene.add(sky.group);
  // ⚠ **Einmal neu platzieren, nachdem der Rahmen steht.** `createSkyCards` ruft `place()` schon
  // im Konstruktor — dort ist die Kugelfassung noch aus, also landeten die sechs Karten auf dem
  // EBENEN Ring (gemessen: Radius 1,1 statt 5,2, also INNERHALB des Globus). Der Rahmen kommt aus
  // derselben Quelle wie alles andere: `tangentFrame` des Fahrzeugs.
  {
    const f0 = tangentFrame(carpet.state.qPosition);
    const fwd0 = new THREE.Vector3()
      .addScaledVector(f0.north, Math.cos(carpet.state.heading))
      .addScaledVector(f0.east, Math.sin(carpet.state.heading)).normalize();
    sky.setFrame(f0.up, f0.north, f0.east, carpet.worldPos(), carpet.state.altitude, fwd0);
    sky.reset();
  }
  // **Der Durchflug IST der Sammelvorgang** (Georgs Entscheidung, 29.8.: „die Landmarke ist das
  // Sammelziel"). `onPass` kommt aus der Quelle — hier hängen nur Zähler, Klang und der
  // Tempo-Schub dran, wie bei den Diamanten in tinyskies. Der Schub ist EIN Stoß: `carpet` klemmt
  // bei ABSOLUTE_MAX_SPEED und rollt von selbst zurück — kein zweiter Antrieb.
  // **Der Einschlag.** Georg, 29.8.: die Reaktion war „extrem dezent oder falsch gebaut".
  // Sie bestand aus einem Klangnamen, den es nicht gibt (`pickup` steht in KEINER MAP von
  // `audio-switch` — der Aufruf fiel auf einen leeren Kanal), einem Tempo-Stoß und einem
  // HUD-Zähler. Jetzt fünf Dinge, alle aus vorhandenen Bausteinen:
  //   1. `sfx('card')` — der Name, den die MAP kennt (kfb 'card' / tiny 'chime_1'), plus
  //      `sfx('boost')` leiser darunter als Anschub.
  //   2. `rig.shake` — die Kamera hat den Stoß seit v1, er wurde nie benutzt.
  //   3. Tempostreifen-Burst und Radial-Blur-Burst über `einschlagT` (0,45 s, abfallend).
  //   4. Die Karte FLIEGT in den Stapel (`card-flight`), 3D mit Bogen, Taumeln und Squash.
  //   5. Das Blatt erscheint erst BEI ANKUNFT — der Zähler springt, wenn die Karte da ist.
  //
  // ⚠ **NACHTRAG v4 · Slice B (30.8.): diese fünf Dinge feuerten ALLE im selben Bild.**
  // Gemessen (D-08 §1.1): sechs Ereignisse bei `t = 0`, danach 0,6 s Stille, und die ANKUNFT bei
  // `t = 1,05 s` — der Höhepunkt — war ohne Ton und ohne HUD-Reaktion. Das ist kein Nachhall,
  // das ist ein Akkord. Die Liste oben war also richtig in der MENGE und falsch in der ZEIT.
  // Jetzt steht die Zeitachse in `fx-script.js` (E-28: eine Kaskade ist eine Datentabelle), und
  // dieser Handler tut genau zwei Dinge: den Zähler setzen und `fx.fire` rufen.
  sky.onPass = (card, n, bild, uebergabe, seite) => {
    gesammelt = n;
    // v11 · Die liegende Karte darunter bleibt LIEGEN, gedämpft und mit Tuschehaken (Georg, abends:
    // „noch lesbar, aber im Vorbeiflug als ›hab ich schon‹ erkennbar“). Sie bleibt damit ein Ort in
    // der Belegung — was sie ja auch ist.
    if (teppiche.gesammelt(card)) kollisionZahl = kollisionSetzen();
    // Der Kontext, den die Kaskade braucht: WO es passiert (für Trauma-Richtung und Staub) und
    // WIE hart. `dir` ist die Flugrichtung — ein Treffer kommt von vorn, also stößt er nach
    // hinten. Eine erfundene Richtung wäre wieder Rauschen, nur mit mehr Code.
    if (fx) fx.fire('card.collect', { pos: carpet.worldPos(), dir: kaskadeRichtung(),
                                      strength: 1 });
    einschlagT = 0.45;
    const naechste = sky.nearest ? null : null;
    const tex = sky.lastPassTexture || null;
    // NAHT 6: der Flug bekommt die ÜBERGABE, nicht eine Textur und eine Position. Es gibt genau
    // ein Kartenmesh; hier wechselt nur, wer es bewegt.
    // ⚠ **Das Blatt liest sein Motiv bei der ANKUNFT, nicht beim Durchflug.**
    // Georg: „obwohl die (erste) ausgesammelte Karte schon sauber gerendert wurde, wird sie im
    // Stapel mit Pre-Loading-Backside angezeigt."
    // Ursache: `bild` war eine Referenz, die im Moment des DURCHFLUGS genommen wurde — und
    // zwischen Durchflug und Ankunft liegen rund 2,5 Sekunden. Lädt das Artwork in dieser Zeit
    // nach, zeigt die 3D-Karte es (sie liest `mat.map` je Bild), das Blatt aber nicht: es hält
    // die Leinwand von vorher fest.
    // Das ist eine gemerkte Kopie einer Sache, die sich ändert — dieselbe Klasse wie die gemerkte
    // DOM-Referenz (Fehlerklasse 11) und der eingefrorene Landeplatz. Der Unterschied ist die
    // Frage, WANN der Wert gilt: der Landeplatz muss einfrieren (sonst wandert das Ziel), das
    // Motiv darf nicht (sonst veraltet es). **Einfrieren ist richtig für ein ZIEL und falsch für
    // einen INHALT.**
    // Gemessen in Georgs Bild: alle Himmelskarten tragen 900×517 (Artwork); die Rückseite ist
    // 720 breit. Das Motiv war also da — nur der Griff danach war zu früh.
    const motiv = () => {
      const t = uebergabe && uebergabe.mat && uebergabe.mat.map;
      return (t && t.image) || bild || null;
    };
    if (!flug.launch(uebergabe, () => { hud.add(card, motiv()); if (fx) fx.fire('card.land', { pos: carpet.worldPos() }); }, seite))
      { hud.add(card, motiv()); if (fx) fx.fire('card.land', { pos: carpet.worldPos() }); }
    sagen('Card ' + n + ': ' + (card.title || card.n || '?'));
  };
  // Ein Deck je WELT: die Kennung nennt es, sonst wählt die Saat.
  // ⚠ **Die Kennung nannte ein Deck und niemand las es** (Abnahme 2.9.): auf einer Welt namens
  // *Anti-Rules Manifesto* lagen die Karten von *Bard's Barnyard Beatdown*. Die halbe Einlösung
  // ist hier schlimmer als keine — Georgs Begründung für die Terrain-Karten war *„theoretisch
  // liegen alle 56 Cards auf der Welt verstreut herum, sie bilden narrativ die Welt"*, und eine
  // Welt, die ihr Deck nicht trägt, erzählt die Geschichte einer anderen.
  // Kein Blocker im Startpfad — bis das Deck da ist, tragen die Karten ihre Textfassung.
  (async () => {
    try {
      const pool = await registry.pool();
      const packs = Array.from(new Set(pool.map((c) => c.packId))).filter(Boolean).sort();
      if (!packs.length) { deckName = 'no deck in index'; return; }
      // Der Rückfall wird GEMELDET, nicht verschwiegen: ein Deck, das die Registry nicht kennt,
      // ist ein Tippfehler in der Kennung oder ein Push, der noch fehlt — beides will man wissen.
      let pack, herkunft;
      if (welt && welt.deck && packs.includes(welt.deck)) { pack = welt.deck; herkunft = 'from world id'; }
      else {
        pack = packs[(seed >>> 5) % packs.length];
        herkunft = (welt && welt.deck) ? '⚠ "' + welt.deck + '" not in registry — seed picked' : 'seed picked';
      }
      const liste = pool.filter((c) => c.packId === pack);
      if (!liste.length) { deckName = 'deck empty: ' + pack; return; }
      // ── BUG-01 · EIN Motiv gehört EINEM Ort in der Welt ────────────────────────────────
      // Hier stand `sky.setDeck(liste)` UND `tuerme.setDeck(liste)` mit derselben Liste —
      // „EINE Welt, EIN Deck" (Georgs Entscheidung, gilt weiter). Gemessen war die Folge aber:
      // die sechs Flugkarten zogen die Deck-Plätze 0…5, die Wegweiser ebenfalls, also stand
      // JEDE Flugkarte gleichzeitig als Schild in der Landschaft. In der Szene waren 8 von
      // 703 Texturpaaren identisch (Abstand 0,00 im 16×9-Fingerabdruck).
      // **Ein Deck, zwei Fächer**: ein Wegweiser ist eine feste Landmarke, eine Flugkarte ist
      // Beute. Dasselbe Motiv an beiden Stellen liest als Wiederholung — und genau das war der
      // Befund. Die Aufteilung bleibt innerhalb des Packs, die Entscheidung ist unberührt.
      // Der Schnitt lässt den Flugkarten mindestens 8 Motive, auch bei kleinen Decks.
      // v11 · EIN Deck, EINE Lage: alle 56 Karten liegen in der Welt (Land UND Wasser, Georg 2.9.),
      // und über jeder liegenden Karte hängt IHRE Sky-Card zum Einsammeln (Anker-Modus). Der Ring
      // aus sechs Flugkarten und der Schnitt „60 % Türme / Rest Flug“ gelten damit nur noch für
      // die Wegweiser; Flug- und Wegweiser-Motive ÜBERLAPPEN jetzt bewusst (Slice 4 „EIN Regelwerk“
      // entscheidet, was ein Wegweiser zeigt). Das Panel nennt die Überlappung, statt sie zu verstecken.
      const schnitt = Math.max(1, Math.min(liste.length - 8, Math.round(liste.length * 0.6)));
      const fuerTuerme = liste.slice(0, schnitt);
      tuerme.setDeck(fuerTuerme);
      tuerme.rebuild(turmSites);
      teppiche.setDeck(liste);
      teppiche.params.anzahl = Math.max(teppiche.params.anzahl, liste.length);
      teppiche.neubau();
      sky.setAnker(teppiche.anker());
      kollisionZahl = kollisionSetzen();   // die Stände sind neu — die Liste muss mit
      deckName = pack + '  ·  ' + liste.length + ' cards  ·  ' + herkunft;
      console.info('[globe] Welt-Deck: ' + deckName + ' (aus ' + packs.length + ' Decks, Seed ' + seed + ')');
    } catch (e) {
      // ⚠ **Dieser Fangkorb hat gerade über seine eigene Ursache gelogen** (Abnahme 2.9.): ein
      // fehlender Import warf `isLand is not defined`, und im Panel stand „registry unreachable"
      // — obwohl die Registry erreichbar war. Ein Fangkorb um zwei Aufgaben (holen UND bauen)
      // schreibt jedem Fehler die Ursache der ersten zu; das ist keine Diagnose, das ist Raten
      // mit Brief und Siegel. Jetzt sagt er, WAS scheiterte, und behält die Meldung.
      const netz = /fetch|network|load|abort|HTTP|JSON/i.test((e && e.message) || '');
      deckName = (netz ? 'registry unreachable' : 'deck build failed') + ': ' + ((e && e.message) || e);
      console.warn('[globe] Welt-Deck nicht geladen', e);
    }
  })();
  // ⚠ **Die Standortliste wird EXPLIZIT geteilt — eine Zone, ein Bauwerk.** Erste Fassung gab
  // dieselbe Liste an beide: gemessen standen alle zehn Kartentürme IN einem Kenney-Gebäude
  // (Abstand 0,020…0,039 u bei 0,115 u Blattbreite — die Körper durchdringen sich vollständig).
  // `card-towers` setzt zwar `site.turm = true`, aber darauf zu hören wäre eine Timing-Falle: die
  // Landmarken laden asynchron, die Türme werden synchron und beim Deck-Eintreffen erneut gebaut.
  // Also teilt der Runner die Liste, nicht ein Flag.
  const TURM_ANZ = 10;
  const turmSites = markenSites.slice(0, TURM_ANZ);
  const kenneySites = markenSites.slice(TURM_ANZ);
  // ⚠ **v12 · EIN Schalter, ZWEI Pflanzenschichten.** Bei der Abnahme gefunden: `flora.js`
  // herunterzudrehen genügt nicht — `globe-landmarks.js` streut seit v3 unabhängig davon 1 197
  // Kit-Pflanzen (Lambert, teal, ohne AO/Saum/Wind). Neben einem prozeduralen Baum liest das
  // schlechter als in v11, weil jetzt eine richtige Referenz danebensteht. Der Schalter steht
  // deshalb HIER, vor seinem ersten Leser, und nicht bei der Flora 130 Zeilen weiter unten.
  // v12 · `?fels=1` = kit-treu (Faktor 1), also der Zustand vor Georgs „viel zu klein" vom 3.9.
  if (q.get('fels') === '1') setFelsFaktor(1);
  const kitsFlaechig = q.get('kits') === '1';
  const marken = createGlobeLandmarks({ THREE, radius: GLOBE_RADIUS, seed, terrainType,
                                        markenSites: kenneySites,
                                        params: { pflanzen: kitsFlaechig } });
  // S3d · Karten-Türme auf den ersten zehn Bauplätzen. Die Textur kommt aus `sky-cards`, damit
  // es EINEN Kartenmaler gibt; die Höhe kommt aus der Zone, damit es EINEN Boden gibt.
  const tuerme = createCardTowers({
    THREE, radius: GLOBE_RADIUS, sites: turmSites,
    textureFor: (karte, seed2) => cardTexture(THREE, karte, seed2),
  });
  scene.add(tuerme.group);
  // ── S3d · Echtes Papier für die Wegweiser (Georgs GLB) ─────────────────────────────────────
  // Der Runner besitzt den Loader, also lädt er — `card-towers` bekommt den Lieferanten übergeben.
  // Zwei Ladewege für dasselbe Modell wären Fehlerklasse 1, und dieses Projekt hat sie schon
  // viermal bezahlt.
  const papier = createPaperCard({
    THREE,
    loadGltf: (url) => new Promise((res, rej) => new GLTFLoader().load(url, res, undefined, rej)),
  });
  tuerme.setPaper(papier);
  papier.laden().then((ok) => {
    if (!ok) return;                        // Rückweg: die Quader bleiben stehen
    // EIN Neubau, nachdem das Blatt da ist. Nicht heimlich tauschen — sonst stünden in der Welt
    // zwei Blattsorten gleichzeitig, und niemand könnte sagen, welche gemeint war.
    tuerme.rebuild(turmSites);
    kollisionZahl = kollisionSetzen();
    phong.convert(tuerme.group);            // das GLB kann PBR mitbringen — die Welt ist Phong
    console.info('[paper-card] ' + JSON.stringify(papier.report()));
  });
  // ── v3 · S7b · Georgs Kollisionsklassen ──────────────────────────────────────
  // „Bäume werden durchflogen · Gebäude und große Landmarken werden umflogen · Würfel und Karten
  // sind Pickup-Ziele · die Wegweiser reagieren bei Kontakt". Die Streuung (Bäume, Bücher, Fässer)
  // steht ABSICHTLICH nicht in der Liste — nichts tun ist die Umsetzung von „durchfliegen".
  const kollision = createLandmarkCollide({
    THREE, radius: GLOBE_RADIUS,
    onReact: (site, pen, seite) => {
      // v4 · Slice B: der Handler nennt die Kaskade, nicht ihre Bestandteile (E-28).
      if (tuerme.hit(site, 0.6 + pen, seite) && fx) {
        // `site` geht MIT in den Kontext: der `glow`-Wirker (E-35) braucht das getroffene Schild,
        // sonst leuchtet die ganze Welt bei einem einzelnen Anschlag.
        fx.fire('signpost.hit', { pos: carpet.worldPos(), dir: kaskadeRichtung(), site,
                                  strength: 0.6 + pen });
      }
    },
  });
  function kollisionSetzen() {
    const liste = [];
    for (const t of tuerme.sites()) liste.push({ n: t.site.n, alt: t.site.alt, r: t.r, kind: 'react', ref: t.site });
    for (const s of kenneySites) liste.push({ n: s.n, alt: s.alt,
      // Wirkradius aus der Modellhöhe: eine Grundfläche verhält sich zu ihrer Höhe, und der
      // Vorausschau-Test braucht EINEN Radius, keine Box. `0.9` war zu knapp gegen die
      // gemessenen Silhouetten — ein Turm ist oben schmaler als unten, aber nicht halb so breit.
      r: (s.def ? s.def.h : 0.18) * 1.15, kind: 'around', ref: s });
    return kollision.setSites(liste);
  }
  // ── v9 · Vulkane + Leuchttürme, beide über ihr PRÄDIKAT auf der Streuungsschicht ───────────
  // Hochland für den Vulkan (Quelle: elevation > 0,4), Küste für den Leuchtturm (Wasser im Ring).
  // `?natur=0` schaltet beide ab.
  const naturAn = q.get('natur') !== '0';
  // ⚠ **Der EINE Leser für „wie hoch ist der gezeichnete Boden"** (`boden-lesung.js`). Er entstand,
  // weil dieselbe Frage heute an drei Stellen verschieden beantwortet wurde — zweimal falsch
  // (Mech watet · Bodenschein unter dem Gelände). Alles, was auf dem Boden STEHT, fragt ihn.
  const bodenLeser = createBodenLesung({ THREE, mesh: globe.mesh, radius: GLOBE_RADIUS,
                                         surfaceAltitudeAt, seed, terrainType });
  const bodenRadius = (up) => bodenLeser.radiusAt(up);

  // ── v10 · Karten-Teppiche ───────────────────────────────────────────────
  // Sie stehen HIER und nicht bei den Türmen, weil sie den Bodenleser brauchen — und der ist
  // eine Zeile alt. Eine Requisite, die den Boden liest, wird nach dem Leser gebaut; das ist
  // dieselbe Reihenfolge-Regel, an der dieses Projekt schon zweimal gestorben ist.
  // Die Plätze sind die Kenney-Marken-Standorte, nicht neue: die Streuung kommt aus
  // `verteilung.js` (über `planSites`), sie wird nicht ein zweites Mal erfunden.
  // ⚠ **Die Teppiche bekommen ihre EIGENE Streuung, nicht die Marken-Bauplätze.**
  // Georg, 2.9.: *„die Terrain-Karten könnten etwas dichter liegen; theoretisch liegen alle 56
  // Cards auf der Welt verstreut herum (bilden narrativ die Welt)“.* Es gibt aber nur 16
  // Kenney-Plätze — auf denen hätten 56 Karten keinen Platz, und sie würden auf Bauten liegen.
  // Also eine eigene Lage mit eigenem Salz, aber über `streuen` aus `verteilung.js`: dieselbe
  // Mechanik, die Vulkane und Leuchttürme benutzen. Ein eigener Zufall wäre hier der vierte.
  // `minSep` hält die Blätter auseinander — das ist die halbe Antwort auf Georgs nächsten Punkt
  // („Vermeidung von Überlappungen, zu dichte Cluster wie leere Zonen“); die andere Hälfte ist
  // eine Messung, und die steht als `streuungTor` schon im Panel.
  // v11 · Land UND Wasser: die Karte im Wasser ist ein Floß (karten-teppich liest `istLand`).
  // Mindestabstand: Voreinstellung der Schicht (55 % des flächenrichtigen Ideals) — bei 56 Karten
  // auf der ganzen Kugel sind das ≈ 0,15 rad; die alte Handzahl 0,34 galt für 24 Karten auf Land.
  // v11 · Vulkane und Leuchttürme VOR den Karten: sie tragen sich in die Belegung ein, die Karten lesen sie.
  const vulkane = createVulkane({ THREE, radius: GLOBE_RADIUS, seed, terrainType,
                                  anzahl: 2, bodenRadius, params: { on: naturAn } });
  const leuchttuerme = createLeuchttuerme({ THREE, radius: GLOBE_RADIUS, seed, terrainType,
                                            anzahl: 3, bodenRadius, params: { on: naturAn } });
  scene.add(vulkane.group); scene.add(leuchttuerme.group);
  const istLandN = (n) => isLand(seed, terrainType, n.x, n.y, n.z);
  // ── v11 · DIE BELEGUNG: eine Liste, was schon steht (verteilung.js) ────────────────────────
  // Gemessen vor dem Eintrag (Family distance gate, 2.9.): 20 Überlappungen — Karten unter
  // Landmarken (−295 mm), unter Portalen, unter Bäumen; Büsche in Wegweisern. Jede Familie hatte
  // ihre eigene Streuung und wusste nichts von den anderen. Jetzt trägt jede sync gebaute Familie
  // ihre Plätze ein, und die nächste sucht ihre Orte mit `frei()` im Prädikat — Nachrücken, nicht
  // Verwerfen. Radien: Grundfläche in Weltmaß, dieselben Zahlen, die das Tor misst.
  const belegung = createBelegung({ R: GLOBE_RADIUS });
  belegung.merkeAlle(kenneySites.map((s2) => ({ n: s2.n, r: (s2.def ? s2.def.h : 0.18) * 0.6 })), 0.1, 'landmarks');
  belegung.merkeAlle(tuerme.sites().map((t) => ({ n: t.site.n, r: t.r })), 0.06, 'signposts');
  belegung.merkeAlle((vulkane.orte || []).map((n) => ({ n, r: 0.35 * 0.42 })), 0.15, 'volcanoes');
  belegung.merkeAlle((leuchttuerme.orte || []).map((n) => ({ n, r: 0.03 })), 0.03, 'lighthouses');
  const KARTE_BREITE = 0.44, KARTEN_ANZ = 56;
  const kartenOrte = streuen({
    THREE, count: KARTEN_ANZ, seed, salt: 5610,
    gueltig: (n) => belegung.frei(n, KARTE_BREITE / 2), minSep: null, maxRad: 0.16, ringe: 6,
  });
  belegung.merkeAlle(kartenOrte.map((n) => ({ n, r: KARTE_BREITE / 2 })), KARTE_BREITE / 2, 'cards');
  const teppichOrte = (anz) => kartenOrte.slice(0, anz);
  const teppiche = createKartenTeppich({
    THREE, radius: GLOBE_RADIUS, bodenRadius, orteFn: teppichOrte, istLand: istLandN,
    textureFor: (karte, seed2) => cardTexture(THREE, karte, seed2),
  });
  scene.add(teppiche.group);
  // ── v10 · Rule of Three: Felskompositionen als Reiter (Georg, 2.9.) ────────────────
  // Steht HIER, weil sie den Bodenleser braucht — wie Vulkan und Leuchtturm. Kein h:, keine
  // eigene Streuung: Größen aus dem Kit-Maßstab, Orte aus `streuen`, Stücke aus Georgs Auswahl.
  const komposition = createKomposition({ THREE, radius: GLOBE_RADIUS, seed, terrainType, bodenRadius,
                                          anzahl: 14, params: { on: naturAn }, frei: (n) => belegung.frei(n, 0.06) });
  scene.add(komposition.group);
  // ── v11 · Flora: Bäume · kahle Bäume · Büsche · Gras · Stümpfe · Pilze · Blumen (Georg, Formular 2.9.) ──
  // Sieben Familien, jede ein Reiter auf `streuen()` mit eigenem Prädikat und Bauart (flora.js).
  // Größen: Kit-Faktor × Rohmaß; Kleinfamilien bekommen EINEN Familien-Boden (Median auf 0,024,
  // Verhältnisse erhalten, Deckel 0,6 Bäume) — Screenshot-Beweise: docs/evidence/v11-flora-*.png,
  // Prüfstand: KFB Flora-Prüfstand v11.dc.html (lädt dieselben Funktionen). `?flora=0` schaltet ab.
  // ⚠ **v12 · Die Kits sind ab hier KOMBI-Module, keine Flächendeckung.** Der Grund steht in
  // ts-flora.js: vier von fünf Eigenschaften, die die Vegetation des Vorbilds tragen (AO in der
  // Vertexfarbe, Fresnel-Saum, Wind je Höhe, Dichtefeld), sind BAU-Eigenschaften — ein gekauftes
  // GLB kann sie nicht mitbringen. Über die Kugel gestreut lasen sie deshalb als Fremdkörper.
  // Was ein Kit gut kann, ist der einzelne Blickfang mit Geschichte: der Stumpf mit seinen Pilzen.
  // Der bleibt (14 Orte), der Rest der Fläche ist ab v12 gebaut. `?kits=1` stellt v11 wieder her.
  // (`kitsFlaechig` steht oben bei den Landmarken — die zweite Pflanzenschicht liest denselben Schalter.)
  const flora = createFlora({ THREE, radius: GLOBE_RADIUS, seed, terrainType, bodenRadius,
                              params: { on: naturAn && q.get('flora') !== '0',
                                        anzahl: kitsFlaechig
                                          ? { baum: 48, baum_kahl: 10, busch: 36, gras: 60, stumpf: 14, pilz: 18, blume: 30 }
                                          : { baum: 0, baum_kahl: 6, busch: 0, gras: 0, stumpf: 14, pilz: 0, blume: 0 } },
                              frei: (n, r) => belegung.frei(n, r) });
  scene.add(flora.group);
  // ── v12 · Vegetation nach TS-Art: prozedural, AO in der Vertexfarbe, Saum, Wind, Dichtefeld ──
  // Fünf Arten × 3–4 Varianten = ein Draw-Call je Variante. Steht NACH der Kit-Flora, damit die
  // Belegung (Karten, Wegweiser, Portale, Stümpfe) schon eingetragen ist — die Bäume weichen aus.
  const tsFlora = createTsFlora({ THREE, radius: GLOBE_RADIUS, seed, terrainType, bodenRadius,
                                  params: { on: naturAn && q.get('tsflora') !== '0' },
                                  frei: (n, r) => belegung.frei(n, r) });
  scene.add(tsFlora.group);
  // ── v12 · Die goldenen Münzen (Georg, 3.9.) ────────────────────────────────────────
  // Aus dem Wahrzeichen wird das Sammelgut. Timing 1:1 aus Rings.ts, Ausbruch aus
  // RingCollectVFX.ts, Sammelradius großzügig auf Ansage (muenzen.js nennt die Umrechnung).
  // ⚠ `popAnker` und `onCollect` sind FUNKTIONEN, keine Werte: das HUD entsteht erst 170 Zeilen
  // weiter unten. Ein Wert, der hier gelesen würde, wäre undefiniert — dieselbe Reihenfolge-Falle,
  // die die Würfel schon einmal auf NaN geschickt hat, nur diesmal vorher gesehen.
  const muenzen = createMuenzen({
    THREE, radius: GLOBE_RADIUS, seed, terrainType, bodenRadius, camera,
    params: { on: q.get('muenzen') !== '0' },
    frei: (n, r) => belegung.frei(n, r),
    mount: buehne() || stage,
    popAnker: () => (hud && hud.popAnker ? hud.popAnker() : null),
    onCollect: (punkte) => {
      popPunkte = hud.addPop(punkte);
      if (fx) fx.fire('dice.collect', { pos: carpet.worldPos(), dir: kaskadeRichtung(), strength: 0.5 });
    },
  });
  scene.add(muenzen.group);
  leuchttuerme.setCamera(camera);   // v10 · der Laternenschein schaut zur Kamera, sonst hat er eine Kante
  werferSetzen();   // v9 · Wolken + Props werfen ab jetzt (Quelle: Globe.ts 5273 + ~20 castShadow)
  let kollisionZahl = kollisionSetzen();
  // Ab hier kennt der Boden die Bauten — die Karten müssen also neu gesetzt werden, weil sie
  // vorher mit dem reinen Gelände gerechnet haben.
  // ⚠ **Würfel NICHT hier neu verankern.** `dice.anchor()` rechnet im Tangentialrahmen, und den
  // setzt erst der Frame-Loop (`setFrame`) — ein `reanchor()` an dieser Stelle normalisiert einen
  // Nullvektor und schreibt **NaN** in die Weltposition. Die Würfel verankern sich beim ersten
  // `update()` von selbst (`if (!d.anchored) anchor(d)`), und dann steht der Rahmen.
  // Dieselbe Klasse wie Fehlerklasse 3, nur mit Vektoren statt Bezeichnern: **wer eine Rechnung
  // vorzieht, muss ihre Eingaben mit vorziehen.**
  bautenListe = kenneySites;
  sky.replaceAll();
  // Die Würfel kannten die Sperrzonen beim ersten Verankern noch nicht — jetzt schon.
  // (`reanchor` ist hier sicher: es läuft nur, wenn der Rahmen steht, sonst gibt `anchor` false.)
  dice.reanchor();

  // ── v6 · Slice E · DIE PORTALE ─────────────────────────────────────────────────
  // **Hier und nicht oben bei den Würfeln.** `portal.js` liest `surfaceAltitudeAt`, und die kennt
  // die BAUPLÄTZE erst, nachdem der Globus sie gebacken hat (Zeile `bautenListe = kenneySites`
  // darüber). Ein Portal, das vorher platziert wird, steht danach mit dem halben Ring im Hügel —
  // dieselbe Reihenfolge-Falle, die die Würfel schon einmal auf NaN geschickt hat: *wer eine
  // Rechnung vorzieht, muss ihre Eingaben mitziehen.*
  // Anzahl ist ein PARAMETER (E-31), also auch eine Adresszeile: `?portale=0` schaltet sie aus,
  // `?portale=4` stellt vier auf. **Standard 4 (Georg, 30.8.)** — die Quelle hält 2
  // (`COSMIC_VOID_PORTAL_COUNT`); das ist eine bewusste Abweichung und steht als Zahl neben dem
  // Regler im Panel.
  const portalZahl = q.get('portale') != null
    ? Math.max(0, Math.min(8, parseInt(q.get('portale'), 10) || 0)) : 4;
  const portale = createPortals({ THREE, radius: GLOBE_RADIUS, seed, terrainType,
                                 params: { anzahl: portalZahl }, frei: (n) => belegung.frei(n, 0.12) });
  scene.add(portale.group);
  belegung.merkeAlle((portale.orte || []).map((p) => ({ n: p.pos.clone().normalize(), r: 0.12 })), 0.12, 'portals');
  console.info('[portal] ' + portale.tor().text);

  // ── v6 · Slice E2 · FLIEGENDE GEGNER — Georgs Antwort war „nur Ziele jetzt" ───────────────
  // Dieselbe Reihenfolge-Regel wie beim Portal: das Modul liest `surfaceAltitudeAt`, also erst
  // NACH dem Backen der Bauplätze. `?gegner=0` schaltet sie aus, `?gegner=5` stellt fünf auf.
  const gegnerZahl = q.get('gegner') != null
    ? Math.max(0, Math.min(8, parseInt(q.get('gegner'), 10) || 0)) : 3;
  const gegner = createSkyEnemies({ THREE, radius: GLOBE_RADIUS, seed, terrainType,
                                   params: { anzahl: gegnerZahl } });
  scene.add(gegner.group);

  // ── v8 · Slice „Meckertronic" · Schritt 1: EIN Mech steht neben dem Start ────────────────
  // Dieselbe Reihenfolge-Regel (liest `surfaceAltitudeAt`, also nach dem Backen). Beweist den
  // Ladepfad im Wirt (Recon-Fallen gekapselt in `modules/kfb-mech-combat.js`); Bewegung kommt
  // NICHT hier her (E-43) — Fahrzeug-Entwürfe stehen in `fahrzeug-vertrag.js` MECH_ENTWUERFE.
  // `?mech=0` schaltet die Station aus.
  const mechAn = q.get('mech') !== '0';
  const _mUp = carpet.worldPos().normalize();
  const _mOst = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), _mUp).normalize();
  const mechStation = createMechStation({ THREE, seed, terrainType, surfaceAltitudeAt,
    radius: GLOBE_RADIUS, gltfLoader: new GLTFLoader(),
    richtung: _mUp.clone().addScaledVector(_mOst, 0.09).normalize(),
    // v9 · Bezugsmaß = die GEZEICHNETE Kartenbreite, nicht die Messgröße „Figur 0,15 u".
    // v9 · Und das gebackene Netz für die Raycast-Fußlesung: der Mech liest den Boden, den man SIEHT.
    bodenMesh: globe.mesh,
    params: { on: mechAn, bezug: CARD_WELT } });
  if (mechAn) scene.add(mechStation.group);

  // ── v8 · Meckertronic Schritt 2: MECH-MODUS als Fahrzeug-Skin (E-43) ──────────────────────
  // Der Mech ERSETZT das Sichtbare (Karte+Pet), nie den Rechner: `carpet.js` bleibt der eine
  // Bewegungsrechner, umgeschaltet werden nur die drei Werte aus ENTWURF_LAEUFER.params-
  // Ueberschreibung (hoverHeight 0, boostHeight klein, maxBank flach) — und beim Absitzen
  // kommen exakt die GESICHERTEN Werte zurück, nicht die Konstanten (jemand kann sie im Panel
  // verstellt haben). Taste V. ⚠ Bekannte Schuld, benannt: surfaceAltitudeAt senkt bis 17,5 %
  // der Figurhöhe ein (Messung 1) — der Mech watet auf manchem Gelände. Raycast ist der
  // nächste Schritt, nicht dieser.
  let mechFahrt = false, carpetGesichert = null;
  function mechModus(an) {
    if (!mechAn || an === mechFahrt) return;
    mechFahrt = an;
    if (an) {
      carpetGesichert = { hoverHeight: carpet.params.hoverHeight,
                          boostHeight: carpet.params.boostHeight, maxBank: carpet.params.maxBank };
      carpet.params.hoverHeight = 0.0; carpet.params.boostHeight = 0.02; carpet.params.maxBank = 0.12;
      avatar.visible = false;
      mechStation.aufsitzen();
    } else {
      if (carpetGesichert) Object.assign(carpet.params, carpetGesichert);
      avatar.visible = true;
      mechStation.absitzen();
    }
  }

  // ── v6 · Slice E · Teil 2 · DIE WEGWEISER WEISEN (E-34, E-35) ─────────────────────────
  // Der Zielgeber ist die EINZIGE Stelle, an der „Wegweiser" und „Portal" sich kennen. `card-towers`
  // kennt keine Portale und keine Karten — es kennt Ziele; `portal.js` kennt keine Schilder. Ohne
  // diese Trennung hätte in zwei Modulen eine Meinung darüber gestanden, was wichtig ist.
  //
  // E-31 wortwörtlich: „der Wegweiser darf nicht ‚das Portal' kennen, sondern muss ‚das nächste'
  // rechnen — Entfernung je Bild, nicht einmal beim Bau". Also wird hier je Bild gefragt, und die
  // Entfernung rechnet der jeweilige Eigentümer (`portale.naechstes`, `sky.nearest`).
  //
  // ⚠ **Gemessene Eigenheit, die man wissen muss, bevor man den Karten-Weiser beurteilt:** die
  // Karten leben in einem RING UM DEN SPIELER (`sky-cards` setzt sie vor ihm neu, wenn er sie
  // hinter sich lässt). Ein Karten-Weiser zeigt darum auf ein Ziel, das mit dem Spieler wandert —
  // beim Vorbeiflug lesbar („dort liegt was"), aber keine Wegbeschreibung wie beim Portal, das
  // wirklich still steht. Der Servo (1,6/s) macht daraus eine Drehung statt eines Zitterns; die
  // Zeile `Signpost gate` nennt den Restfehler in Grad, damit die Eigenheit eine Zahl hat.
  // ⚠ **Und die Portalfarben werden WEITERGEGEBEN, nicht nachgeschrieben** (Befund der Abnahme):
  // der Regenbogen der Karten-Weiser lief durch die Portal-Farbtöne — gemessen bis auf 0,3° heran.
  // In diesem Moment sind zwei Sorten, die sich NUR durch Farbe unterscheiden, dasselbe.
  // `setTabuFarben` sperrt ein Band um jeden Portal-Farbton; damit ist der Mindestabstand
  // strukturell garantiert und nicht gemessen-und-gehofft.
  tuerme.setTabuFarben(PORTAL_COLORS);
  tuerme.setAim((t) => {
    if (t.sorte === 'portal') {
      const n = portale.naechstes(t.grp.position);
      if (!n) return null;
      return { pos: n.portal.pos, farbe: PORTAL_COLORS[n.portal.i % PORTAL_COLORS.length] };
    }
    const c = sky.nearest(t.grp.position);
    // `farbe: null` = Regenbogen. Das ist E-35: die Sorte steckt in der FARBE, nicht in der Form.
    return c && c.mesh ? { pos: c.mesh.position, farbe: null } : null;
  });

  // ── v3 · S7d · **Der Boden, der die Bauten mitzählt** ────────────────────────────
  // Georg, 29.8.: „karten stecken in gebäuden". Die Karten lasen den Boden schon richtig — nur
  // kennt `surfaceAltitudeAt` **das Gelände**, nicht was darauf steht. Ein Schloss ist 0,22 hoch,
  // das Kartenband liegt bei 0,03–0,075 über Grund: die Karte steckt zwangsläufig im Turm.
  //
  // Der falsche Weg wäre eine zweite Mechanik („Karten weichen Gebäuden aus") — dann gibt es zwei
  // Platzierungswahrheiten, und die nächste Schicht (Würfel, Sprungzonen, Wegweiser) braucht eine
  // dritte. Richtig ist: die HÖHENFRAGE bleibt EINE Frage, sie wird nur ehrlicher beantwortet.
  // Diese Funktion ist ab jetzt der Boden für alles, was ÜBER der Welt schwebt — Karten und
  // Würfel lesen dieselbe. Die Flugphysik liest weiter das reine Gelände: ein Teppich soll über
  // ein Dach fliegen können, nicht auf ihm.
  // Kosten: ein Durchlauf über ~26 Landmarken je Abfrage, und Abfragen gibt es nur beim Setzen.
  function bodenMitBauten(x, y, z) {
    let h = Math.max(0, surfaceAltitudeAt(seed, terrainType, x, y, z));
    // ⚠ Gelesen wird `bautenListe`, nicht `kenneySites` direkt: diese Funktion wird von
    // `sky.setAltFn` gerufen, und `createSkyCards` platziert schon in seinem Konstruktor — also
    // BEVOR die Landmarken-Standorte existieren. Ein direkter Zugriff wäre eine temporal dead
    // zone (Fehlerklasse 3, in dieser Baureihe schon dreimal bezahlt). Eine leere Liste ist die
    // ehrliche Antwort für „es steht noch nichts auf der Welt".
    for (const s of bautenListe) {
      const d = x * s.n.x + y * s.n.y + z * s.n.z;
      if (d <= 0) continue;                       // andere Kugelhälfte
      const bogen = Math.acos(Math.min(1, d));
      const hoehe = (s.def ? s.def.h : 0.18);
      // Wirkradius als BOGEN: die Grundfläche eines Modells verhält sich zu seiner Höhe, und ein
      // Zuschlag von einer halben Kartenbreite hält die Karte vom Dach frei statt auf ihm.
      if (bogen * GLOBE_RADIUS > hoehe * 0.9 + 0.05) continue;
      const oben = Math.max(0, s.alt) + hoehe;
      if (oben > h) h = oben;
    }
    return h;
  }
  // Überflug-Namen: die Mechanik aus `Landmarks.ts` (enterDot/exitDot als Hysterese), die Namen
  // sind KFB und neu. Registriert werden Türme UND Kenney-Marken — beide sind Orte.
  const orte = createLandmarkNames({ seed });
  orte.register(turmSites, 'turm');
  orte.register(kenneySites, 'marke');
  const hud = createCollectHud({});
  (buehne() || stage).appendChild(hud.el);
  (buehne() || stage).appendChild(hud.lookEl);   // eigene Schicht, siehe Kopf von collect-hud.js
  // Der Flug braucht den Anker des Fächers auf dem Schirm — IN CSS-Pixeln, damit er bei jeder
  // Fenstergröße dort landet, wo der Stapel wirklich liegt.
  const flug = createCardFlight({ THREE, scene, camera,
    // ⚠ Das Canvas MUSS mit — der Flug rechnet Bildschirmziele, und der Bildraum ist das Canvas,
    // nicht das Fenster. In einem Editor ist das Canvas eingerückt und kleiner; ohne diesen Wert
    // landen alle Ziele versetzt und die Karte wird vom Canvas-Rand geschnitten (Georgs „Maske").
    params: { canvas: renderer.domElement },
    // ⚠ Diese Parameter waren aus der v17-Fassung stehengeblieben (`dur`, `arc`) — Namen, die es
    // im Modul nicht mehr gibt, seit die Bewegung in Schläge zerlegt ist. Sie taten nichts, und
    // ein Parameter, der nichts tut, sieht wie eine Einstellung aus: man dreht daran und wundert
    // sich. Die Voreinstellungen stehen jetzt im Modul, wo sie begründet sind.
    anchor: () => {
      // **Das Ziel ist das OBERSTE BLATT, nicht die Fächer-Box** — und seine Höhe gehört dazu.
      // Georg: „die Karte muss visuell nachvollziehbar OBEN auf den Stapel GLEITEN". „Oben auf"
      // heißt: der Zielort ist das Blatt, auf das sie zu liegen kommt; und „nachvollziehbar"
      // heißt, dass die 3D-Karte im Moment der Übergabe **genau so groß wie dieses Blatt** ist.
      // Deshalb kommt `h` mit — ohne die Pixelhöhe kann der Flug nur raten, und ein Größensprung
      // beim Wechsel ist der Grund, warum die Karte „einfach weg" war.
      const blatt = hud.el.querySelector('.fan .sheet:last-child');
      const el = blatt || hud.el.querySelector('.fan');
      if (!el) return { x: innerWidth - 38, y: innerHeight - 50, h: 33 };
      const r = el.getBoundingClientRect();
      // Ein neues Blatt kommt OBEN auf den Stapel: der Zielpunkt liegt an der oberen Kante des
      // obersten Blatts, nicht in seiner Mitte.
      return { x: r.left + r.width / 2,
               y: r.top + (blatt ? r.height * 0.22 : r.height / 2),
               h: blatt ? r.height : 33 };
    },
  });
  // Block 3 (Georg, 1.9.): „Großansicht verschwindet von allein, Klick beschleunigt (kein
  // OK-Knopf)." Rein additiv — `preventDefault`/`stopPropagation` bleiben aus, damit Kamera-Look
  // und Steuerung weiterlaufen; wirkt nur, wenn tatsächlich eine Karte im Vorzeigehalt steht.
  renderer.domElement.addEventListener('pointerdown', () => { if (flug.presenting()) flug.skipPresent(); });
  orte.onEnter = (lm) => hud.showPlace(lm.name);
  orte.onExit = () => hud.hidePlace();
  scene.add(marken.group);
  // ── S9c · **Korrektur einer Behauptung, die ich nicht gemessen hatte** ─────────────────────
  // Hier stand: „die Kenney-GLB kommen als MeshStandard und werden nach Phong konvertiert" —
  // plus eine Verdrahtung an `marken.onReady`, das es nicht gibt, mit einem `setTimeout(1500)`
  // als Rückfall, der vor dem Ladeende feuert. Die Abnahme hat nachgezählt: **alle 35 Materialien
  // der Props sind bereits `MeshLambertMaterial`** (`prop-tree_thin`, `prop-rock_tallA`, …), und
  // Lambert ist quellentreu (`CampsiteScene.ts` 353). Der Wandler hat also 0 umgebaut und
  // `0 converted` ins Panel geschrieben, während das Dokument das Gegenteil behauptete.
  //
  // **Das Ziel von S9c war schon erreicht, bevor ich anfing** — nur wusste ich es nicht, weil ich
  // aus „GLB" auf „MeshStandard" geschlossen habe statt nachzusehen. Lambert und Phong sind beide
  // nicht-PBR und antworten nahe genug gleich; die einzigen PBR-Materialien der Szene sind die 11
  // des Pets, und die tragen ihre `envMap` als bewussten Sonderfall.
  //
  // Der Wandler bleibt als **WÄCHTER**, nicht als Umbau: er läuft einmal spät und meldet, wenn
  // später doch ein PBR-Material in die Welt kommt. Genau dann bricht der Lichthaushalt wieder
  // auseinander (§6j), und dann soll es AUFFALLEN statt sieben Runden zu kosten.
  setTimeout(() => { phongGeprueft = true; phong.convert(marken.group); }, 4000);
  // Der Würfel-Klang läuft über denselben Ausgang wie alles andere — aber `audio` entsteht erst
  // unten. Ein Verweis, der zur Laufzeit auflöst, statt einer zweiten Klangquelle.
  let audioRef = null;
  function audioSfxSpaeter(n, s) { if (audioRef) audioRef.sfx(n, s); }

  // **Flugstart aus dem Stand** (Georg, 29.8.). Der Boden unter dem Tempo beginnt bei 0 und
  // rollt nach der Übergabe auf das Reisetempo hoch — siehe Kommentar in `carpet.js`.
  const LAUNCH_DUR = 2.6;
  carpet.setSpeedFloor(0);
  carpet.setSpeed(0);

  // ── v2 · KLANG ────────────────────────────────────────────────────────────
  // EIN Ausgang, zwei Motoren (`audio-switch.js`). Standard ist der v17-Motor,
  // weil der ohne fremde Dateien klingt; `U` schaltet auf die tinyskies-Fassung.
  // ⚠ Kein AudioContext vor einer Nutzergeste — `arm()` läuft aus pointerdown/keydown.
  const audio = createAudioSwitch({ timeOfDay, engine: q.get('audio') === 'tiny' ? 'tiny' : 'kfb',
                                    tinyBase: q.get('tinybase') || '' });
  audioRef = audio;
  // Der Erzähler dreht die Musik NICHT selbst; er sagt „ich rede", und wer den Klang besitzt,
  // macht Platz. Standard aus: eine Stimme, die man nicht bestellt hat, ist ein Radio.
  const narrator = createNarrator({ onVoice: (on) => audio.duck(on) });
  const armAudio = () => audio.arm();
  addEventListener('pointerdown', armAudio, { passive: true });
  addEventListener('keydown', armAudio, { passive: true });
  let tonHinweis = '';
  // … und der Hinweis muss ABLAUFEN. Ein gesetzter, nie zurückgesetzter Text klebt sonst
  // dauerhaft in der Marke (in v17 heißt derselbe Zähler `apNoteT`).
  let tonHinweisT = 0;
  const sagen = (t) => { tonHinweis = t; tonHinweisT = 4; };

  // Rad und Pinch ändern den Abstand multiplikativ — so fühlt sich jeder Schritt gleich groß an,
  // egal ob man bei 0,2 oder bei 3 unterwegs ist. Additiv wäre nah zu grob und fern zu zäh.
  function zoomBy(faktor) {
    camDist = Math.max(CAM_MIN, Math.min(CAM_MAX, camDist * faktor));
    if (camDist < 0.06) camDist = 0;      // sauber auf POV einschnappen
  }
  renderer.domElement.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomBy(Math.exp(e.deltaY * 0.0016));
  }, { passive: false });
  let pinch0 = 0, dist0 = 0;
  renderer.domElement.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 2) return;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    pinch0 = Math.hypot(dx, dy); dist0 = camDist;
  }, { passive: true });
  renderer.domElement.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 2 || !pinch0) return;
    e.preventDefault();
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const d = Math.hypot(dx, dy);
    camDist = Math.max(CAM_MIN, Math.min(CAM_MAX, dist0 * (pinch0 / Math.max(1, d))));
    if (camDist < 0.06) camDist = 0;
  }, { passive: false });
  renderer.domElement.addEventListener('touchend', () => { pinch0 = 0; });
  // ── v10 · Tastatur im eingebetteten Fenster ────────────────────────────────────
  // Georg, 2.9.: „ich kann hier im Chat/Preview keine Steuerungstasten nutzen, landet alles im
  // Chat-Eingabefeld". Das ist kein Fehler der Steuerung: die Tastenhörer hängen am `window`
  // DIESER Seite, und die Seite läuft in einem Rahmen. Tasten gehen dorthin, wo der Fokus
  // steht — und der steht beim Öffnen im Chat, nicht in der Welt.
  // Ein Klick in die Szene ist die Geste, mit der ein Mensch „ich meine DAS hier" sagt. Also
  // nimmt die Leinwand den Fokus genau dann. `tabIndex` ist die Vorbedingung dafür (ein
  // `<canvas>` ist von Haus aus nicht fokussierbar), `outline:none` verhindert den blauen
  // Systemrahmen, den das mit sich brächte.
  // ⚠ Dass dieser Klick die Startansicht NICHT abbricht, entscheidet `hatteFokus` weiter oben —
  // hier steht nur die Fokusnahme, nicht die Regel darüber.
  renderer.domElement.tabIndex = 0;
  renderer.domElement.style.outline = 'none';
  const fokusHolen = () => {
    try { window.focus(); renderer.domElement.focus({ preventScroll: true }); } catch (e) {}
  };
  renderer.domElement.addEventListener('pointerdown', fokusHolen);
  addEventListener('pointerdown', fokusHolen, { passive: true });

  // Tastatur als Rückfallweg fürs Testen ohne Maus.
  addEventListener('keydown', (e) => {
    if (e.code === 'BracketRight') zoomBy(1.18);
    if (e.code === 'BracketLeft') zoomBy(1 / 1.18);
    if (e.code === 'Digit0') camDist = 0;
    if (e.code === 'Digit1') camDist = 0.71;   // Startabstand
    // Klang-Tasten. `T` ist das Tor (Nutzergeste + Pegel), alles andere setzt voraus,
    // dass es offen ist — Umschalten im stummen Zustand wäre eine Behauptung ohne Beleg.
    if (e.code === 'KeyT') { audio.setEnabled(!audio.enabled); sagen(audio.enabled ? 'Sound on' : 'Sound off'); }
    if (e.code === 'KeyU') { sagen('Engine: ' + audio.toggleEngine()); }
    if (e.code === 'KeyJ') { const t = audio.nextTrack(); sagen(t ? 'Track: ' + t : 'no track'); }
    if (e.code === 'KeyN') {
      narrator.setEnabled(!narrator.enabled);
      const r = narrator.report();
      sagen('Narrator ' + (r.an ? (r.stimme ? 'on · ' + r.stimme : 'on · NO system voice') : 'off'));
    }
    // v2b · Das Panel hat eine Taste, weil ein Zahnrad allein keine Tastatur hat.
    if (e.code === 'KeyG' && panel) { panel.toggle(); if (gear) gear.setOpen(panel.open); }
    if (e.code === 'Escape' && panel && panel.open) { panel.setOpen(false); if (gear) gear.setOpen(false); }
    // v3 · R = Startansicht wiederholen (aus dem Stand), K = Würfel werfen, M = Maus-Modus.
    if (e.code === 'KeyR') neustart('R');
    if (e.code === 'KeyK') { dice.setVisible(true); dice.roll(1); sagen('Dice rolled'); }
    // v8 · V = Mech-Modus (Fahrzeug-Skin nach E-43; M war schon der Maus-Modus).
    if (e.code === 'KeyV') { mechModus(!mechFahrt); sagen(mechFahrt ? 'Mech mode — ground skin (V)' : 'Card mode (V)'); }
    if (e.code === 'KeyM') {
      look.setMode(look.mode === 'look' ? 'steer' : 'look');
      sagen('Mouse: ' + (look.mode === 'look' ? 'look around' : 'steer'));
    }
  });


  const hudWurzel = document.getElementById('tv-hud') || stage;
  const badge = document.createElement('div');
  badge.id = 'kfb-badge';
  badge.style.cssText = 'position:absolute;left:14px;bottom:12px;font:10px/1.5 var(--kfb-font-ui,monospace);'
    + 'letter-spacing:.06em;color:var(--kfb-cream,#efe6d0);'
    + 'background:rgba(10,16,32,.6);border:1px solid rgba(239,230,208,.28);border-radius:3px;padding:5px 9px;';
  hudWurzel.appendChild(badge);

  // **Zustand ZUERST, dann alles, was ihn liest.** `updateBadge()` wird schon beim synchronen
  // Erstbild gerufen — läge `frameMs` weiter unten, wäre das ein Zugriff in der temporal dead zone
  // und würde `start()` komplett abbrechen (genau das ist am 27.8. passiert: kein Canvas, keine
  // Marke, Bühne hellblau). Deklaration also oberhalb jeder Verwendung, nicht neben der Schleife.
  // ⚠ **EIN Block für allen Zustand, den die Marke liest — und zwar hier oben.** Zweimal in Folge
  // hat eine `let`-Deklaration UNTER `updateBadge()` den ganzen Start gekillt (temporal dead zone,
  // 27.8.: erst `frameMs`, dann `kartenQuelle`). Wer der Marke ein neues Feld gibt, deklariert es
  // in DIESER Zeile — nicht dort, wo es gesetzt wird.
  let last = performance.now(), frameMs = 16, lastTurn = 0, kartenQuelle = 'none';
  // v4 · Slice B · **Hier deklariert, unten zugewiesen** — genau nach der Regel zwei Zeilen höher.
  // `onPass` und `onReact` sind weiter oben definiert und rufen `fx`; sie LAUFEN aber erst, wenn
  // die Welt steht. Würde `fx` erst dort mit `const` deklariert, wäre jeder Aufruf davor eine
  // temporal-dead-zone-Falle — dieses Projekt hat sie zweimal bezahlt.
  let fx = null, wucht = null;
  // v5 · Slice C · Der Prüfstand wird ERST nach `window.__globe` gebaut (er liest die Welt über
  // genau dieses Objekt). Die Panel-Knöpfe lesen `ps` beim Klick, nicht beim Aufbau — deshalb
  // genügt hier die Deklaration.
  let ps = null;
  let hudFlug = null, gearTempo = null;
  // Vorwärmen (tinyskies `Game.ts:1527`): gemessen, nicht behauptet.
  let warmMs = null, warmWas = 'not yet';
  /** Woher der Stoß kommt: GEGEN die Flugrichtung. Ein Treffer von vorn drückt nach hinten —
   *  das ist die eine Zeile, die aus weißem Rauschen einen Einschlag macht (D-08 §2.2a). */
  function kaskadeRichtung() {
    try { return carpet.shotRay().direction.clone().negate(); }
    catch (e) { return null; }   // vor dem ersten Bild: keine Richtung ist besser als eine falsche
  }
  // ── v5 · Slice C · Respawn: EINE Stelle, EINE Kaskade ─────────────────────────────────────
  // Vorher stand dieser Vorgang **zweimal** im Runner — im Tastenhandler (R) und im Panel-Knopf,
  // Zeile für Zeile gleich. Zwei Kopien derselben Sache sind Fehlerklasse 1, und diese beiden
  // waren zusätzlich beide stumm: der Spieler wird an den Anfang gesetzt, und nichts sagt es.
  // Jetzt: eine Funktion, und sie feuert `world.respawn` (fx-script) statt selbst Effekte zu
  // kennen.
  function neustart(anlass) {
    controls.enabled = false;
    carpet.setSpeedFloor(0); carpet.setSpeed(0); launchT = -1;
    look.center();
    intro.begin(tangentFrame(carpet.state.qPosition), carpet.worldPos(), camera);
    // v6 · Slice E · Dem Portalfeld sagen, dass der Spieler neu gesetzt wurde. Hier passiert
    // (noch) kein Ortswechsel — die Zeile steht trotzdem, weil sie die INVARIANTE ausspricht:
    // wer den Spieler versetzt, meldet es dem Trefferest (`sync`, 1:1 `syncToCarpet`). Ohne sie
    // wäre der erste Respawn, der die Position anfasst, ein Portal-Sprung ohne Portal — der
    // Fehler ist mir im ersten Testflug genau so passiert.
    portale.sync(carpet);
    kondens.reset();   // v13 · sonst zieht ein Band vom alten zum neuen Ort
    if (fx) fx.fire('world.respawn', { pos: carpet.worldPos(), dir: kaskadeRichtung(), strength: 1 });
    sagen('Opening shot' + (anlass ? ' · ' + anlass : ''));
  }
  // v2b · Zahnrad, Panel und ihr Wurzelknoten — hier deklariert, weil der Wiedereinhänger
  // (setInterval unten) sie liest, und der läuft auch in einer verdeckt geladenen Seite.
  let uiRoot = null, gear = null, panel = null;
  // ⚠ Fehlerklasse 3: der Wiedereinhänger (setInterval, weiter unten) LIEST `berichtBlatt`, also
  // muss die Deklaration ÜBER ihm stehen. Ein `let` unter seinem Leser ist eine temporal dead
  // zone und bricht den Start ab — in dieser Baureihe schon einmal bezahlt.
  let berichtBlatt = null;
  // v3 · S7c · Zähler des Wiedereinhängers. Die Abnahme hat gemessen, dass er NICHT tickt — und
  // ich konnte es nicht widerlegen, weil es nichts zu lesen gab. Ein Mechanismus, dessen Leben man
  // nicht ablesen kann, ist eine Behauptung. Ab jetzt steht er im Panel.
  let wiederTakte = 0, wiederFehler = 0, wiederLetzterFehler = '';
  // v3 · Fehler im Frame-Loop — gezählt und im Panel sichtbar. Ein Loop, der still stirbt, ist
  // von außen nicht von „Seite lädt nicht" zu unterscheiden; genau das war der Befund.
  let frameFehler = 0, frameLetzterFehler = '';

  // ── ⚠ **Das Weiß-Tor für additive Effekte** (Block 2, 1.9.) ─────────────────────────────────
  // `light-budget.js` misst Lichter und Albedo — Dinge, die three MULTIPLIZIERT. Aurora und
  // Gottesstrahlen ADDIEREN auf das fertige Bild, nach allem Licht; für sie ist dieses Modul blind.
  // Ihre Obergrenze ist auch keine Formel, sondern eine Tatsache: was nach der Addition über 1,0
  // liegt, ist Weiß und hat seinen Buntton verloren.
  // **Also wird das BILD gemessen, nicht ein Modell davon** — die Lehre aus vier Messfehlern an
  // diesem Tag (Eingang gemessen, Ausgang gefragt). `readPixels` auf den fertigen Frame, Anteil der
  // Pixel, die in allen drei Kanälen ≥ 250 liegen.
  // ⚠ Und zwei Ehrlichkeiten, die dazugehören:
  //   · `readPixels` ist eine Synchronisationsbremse (die GPU muss fertig werden). Deshalb läuft es
  //     NUR auf Anfrage, nie je Bild — ein Messgerät, das das Gemessene ausbremst, misst sich selbst.
  //   · Weiß im Bild ist nicht automatisch ein Fehler: Sonne, Schaum und Firn sind absichtlich weiß.
  //     Die Zahl ist deshalb ein VERGLEICH gegen den Stand ohne die Effekte — und den kann nur eine
  //     zweite Messung mit abgeschalteten Effekten liefern. Genau das macht der Knopf.
  let weissStand = null;
  const _wFrustum = new THREE.Frustum(), _wMat = new THREE.Matrix4(), _wBox = new THREE.Box3();
  /** ⚠ **Wie viele additive Flächen sind ÜBERHAUPT im Bild.** Ohne diese Zahl ist das Weiß-Tor
   *  wertlos, und das wurde beim ersten Lauf am 1.9. sofort bewiesen: es meldete „✓ 0,00 % Zuwachs",
   *  während **acht von zehn Aurora-Vorhängen außerhalb des Sichtfelds lagen** (Kamera bei y = −3,4,
   *  der Ring liegt fest auf y = +9). Es hat also korrekt gemessen, dass nichts überstrahlt — weil
   *  nichts da war. *Ein Tor, das nichts sieht, meldet immer ✓;* dieselbe Fehlerklasse wie ein
   *  Selbsttest ohne Kontrollprobe und wie die Lücke, die am 1.9. als Zusage gelesen wurde.
   *  Deshalb ist „nichts im Bild" hier ausdrücklich KEIN Bestehen. */
  function additivImBild() {
    camera.updateMatrixWorld();
    _wFrustum.setFromProjectionMatrix(
      _wMat.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
    let n = 0, gesamt = 0;
    for (const grp of [aurora.group, strahlen.group]) {
      if (!grp.visible) continue;
      for (const m of grp.children) {
        if (!m.isMesh) continue;
        gesamt++;
        m.updateMatrixWorld();
        if (_wFrustum.intersectsBox(_wBox.setFromObject(m))) n++;
      }
    }
    return { imBild: n, gesamt };
  }
  function weissMessung() {
    const gl = renderer.getContext();
    if (gl.isContextLost()) return null;
    const b = renderer.getDrawingBufferSize(new THREE.Vector2());
    // ⚠ **Erste Fassung las ein 256er Fenster in der Bildmitte** — und meldete daraufhin „+0 mean
    // luma, der Effekt malt fast NICHTS", während der Gottesstrahlen-Kegel schlicht neben dem
    // Fenster lag. Für die Frage „überstrahlt es" ist ein Ausschnitt vertretbar; für „ist es
    // überhaupt da" ist er falsch, denn ein additiver Effekt ist per Bauart lokal.
    // *Ein Ausschnitt beantwortet nur Fragen, die im Ausschnitt entschieden werden.*
    // Also das GANZE Bild. Das kostet bei 1848 × 1080 rund 8 MB — vertretbar, weil dieses Tor
    // ausschließlich auf Anfrage läuft und nie je Bild.
    const w = b.x | 0, h = b.y | 0;
    const px = new Uint8Array(w * h * 4);
    gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
    let weiss = 0, hell = 0, summe = 0;
    for (let i = 0; i < px.length; i += 4) {
      const r = px[i], g = px[i + 1], bl = px[i + 2];
      if (r >= 250 && g >= 250 && bl >= 250) weiss++;
      else if (r >= 235 && g >= 235 && bl >= 235) hell++;
      summe += 0.2126 * r + 0.7152 * g + 0.0722 * bl;
    }
    const n = w * h;
    return { weissProzent: +(weiss / n * 100).toFixed(2), fastProzent: +(hell / n * 100).toFixed(2),
             mittel: +(summe / n).toFixed(2), pixel: n, breite: w, hoehe: h,
             // ⚠ Der Rohpuffer bleibt dran, weil die zweite Frage nur ein DIREKTER Bildvergleich
             // beantworten kann (Begründung in `weissTor`). Er wird nicht aufbewahrt.
             px,
             nacht: +zyklus.nachtGewicht.toFixed(2) };
  }
  function weissTor(neu) {
    if (neu || !weissStand) {
      // ⚠ **Zuerst die Frage, ob überhaupt gerechnet wird** (1.9., teuer gelernt). In einem
      // verborgenen Dokument feuert `requestAnimationFrame` nicht — der Frame-Loop steht, und alle
      // Effekt-Uniformen stehen auf ihren Bauwerten. Ein halbe Stunde Fehlersuche ging darauf,
      // dass `strahlen.update` „nie aufgerufen" wurde: es wurde nie aufgerufen, weil NICHTS
      // aufgerufen wurde. Der Zyklus lief auch nicht, die Weltzeit stand.
      // *Eine Messung in einem pausierten Bild misst die Pause, nicht den Code.* Und sie sieht
      // dabei genau wie ein Befund aus — Nullen überall, kein Fehler, keine Warnung.
      if (typeof document !== 'undefined' && document.hidden) {
        return { idle: true, ok: null,
          text: '— paused · this document is hidden, so requestAnimationFrame does not fire:'
            + ' the frame loop is standing still and every effect uniform is at its build value.'
            + ' Any number read here would describe the pause, not the picture.' };
      }
      const sicht = additivImBild();
      // ⚠ **BEIDE Bilder müssen aus DERSELBEN Hand kommen.** Erste Fassung las als „mit Effekt" das
      // letzte Bild der Spielschleife und rechnete die Gegenprobe selbst — und der Bildvergleich
      // meldete daraufhin „100 % der Fläche geändert, max Δ 765/765", also das ganze Bild. Richtig
      // gemessen, falsche Frage: zwischen dem Schleifenbild und meinem lag ein Renderdurchlauf mit
      // anderer Weltlage (der Teppich fliegt, die Kamera zieht nach, das Bild ist ein anderes).
      // *Ein Vergleich zweier Bilder ist nur dann eine Messung des Unterschieds, wenn alles außer
      // dem Unterschied gleich ist* — sonst misst man die Zeit, die dazwischen liegt.
      // Also: erst selbst rendern, dann lesen; dann abschalten, rendern, lesen.
      renderer.render(scene, camera);
      const mitEffekt = weissMessung();
      if (!mitEffekt) return { idle: true, text: 'idle · context lost' };
      const aG = aurora.gewicht, sG = strahlen.gewicht;
      aurora.setGewicht(0); strahlen.setGewicht(0);
      // ⚠ **Das Tor prüft ZUERST, ob seine eigene Gegenprobe gewirkt hat.** Genau hier lag der
      // Fehler vom 1.9.: `strahlen.setGewicht(0)` hat nichts geschrieben, die Kontrollaufnahme
      // enthielt die Strahlen in voller Stärke, und das Tor meldete daraufhin ehrlich „0 % geändert"
      // — und hat diese Null als Bestehen gedruckt. *Ein Messgenträt muss beweisen, dass es das
      // Gemessene ausschalten kann, bevor eine Null etwas bedeutet.* Ohne diesen Nachweis ist jede
      // Aussage des Tors wertlos, und das muss es dann auch sagen.
      const aus = { aurora: !aurora.group.visible, strahlen: !strahlen.group.visible };
      if (!aus.aurora || !aus.strahlen) {
        aurora.setGewicht(aG); strahlen.setGewicht(sG);
        return { idle: true, ok: null, aus,
          text: '✗ BROKEN INSTRUMENT · the control shot did not switch the effects off ('
            + (aus.aurora ? '' : 'aurora still visible; ')
            + (aus.strahlen ? '' : 'god rays still visible')
            + ') — every number this gate could print would be meaningless, so it prints none' };
      }
      renderer.render(scene, camera);
      const ohne = weissMessung();
      aurora.setGewicht(aG); strahlen.setGewicht(sG);
      renderer.render(scene, camera);
      // ⚠ **Die zweite Frage braucht einen BILDVERGLEICH, keinen Mittelwert.** Erste Fassung nahm
      // die mittlere Helligkeit des ganzen Bildes — und meldete für beide Effekte „+0, malt fast
      // NICHTS", obwohl der Gottesstrahl sichtbar auf dem Schirm stand. Nachgerechnet: der Kegel
      // fügt über ein paar Prozent der Fläche rund 14/255 hinzu, im Bildmittel also **unter 0,5** —
      // unter der Rundung. *Ein Mittelwert über das ganze Bild kann einen lokalen Effekt nicht
      // sehen; er verdünnt ihn mit allem, was der Effekt nicht anfasst.*
      // Also Pixel gegen Pixel: wie viele haben sich überhaupt geändert, und wie stark am stärksten.
      let geaendert = 0, maxDelta = 0, summeDelta = 0;
      if (mitEffekt.px.length === ohne.px.length) {
        for (let i = 0; i < mitEffekt.px.length; i += 4) {
          const d = Math.abs(mitEffekt.px[i] - ohne.px[i])
                  + Math.abs(mitEffekt.px[i + 1] - ohne.px[i + 1])
                  + Math.abs(mitEffekt.px[i + 2] - ohne.px[i + 2]);
          if (d > 3) { geaendert++; summeDelta += d; if (d > maxDelta) maxDelta = d; }
        }
      }
      const anteil = +(geaendert / mitEffekt.pixel * 100).toFixed(2);
      weissStand = { mitEffekt, ohne, sicht,
                     diff: { anteil, maxDelta, mittelDelta: geaendert ? +(summeDelta / geaendert).toFixed(1) : 0 } };
      // Die Rohpuffer nicht behalten — zweimal 8 MB je Messung wäre ein Messgerät, das Speicher frisst.
      mitEffekt.px = null; ohne.px = null;
    }
    const { mitEffekt, ohne, sicht, diff } = weissStand;
    const zuwachs = +(mitEffekt.weissProzent - ohne.weissProzent).toFixed(2);
    // Die Grenze ist gestalterisch und wird als solche benannt: bis 1 % Zuwachs an geklipptem Weiß
    // ist ein additiver Effekt ein Glanzlicht, darüber frisst er das Bild. Sie ist NICHT aus der
    // Quelle — tinyskies hat kein solches Maß, und das ist der Grund, warum wir eins brauchen.
    // ⚠ Und sie gilt nur, wenn überhaupt etwas im Bild war (Begründung bei `additivImBild`).
    if (sicht.imBild === 0) {
      return {
        idle: true, ok: null, zuwachs, mitEffekt, ohne, sicht, diff,
        text: '— blind · no additive surface in frame (' + sicht.gesamt + ' active, 0 on screen)'
          + ' · night weight ' + mitEffekt.nacht
          + ' · the 0 % below would be a PASS the gate did not earn',
        zeilen: ['1.9., zweite Runde: aurora follows the player now (Georg: „mitfliegend, jede'
          + ' Nacht da") — it sits above wherever you are, so it is in view on every night, not'
          + ' just from 57.8 % of the globe as the fixed polar ring was.'],
      };
    }
    const ok = zuwachs <= 1.0;
    // Sichtbarkeit: Anteil geänderter Pixel. Unter 0,2 % der Fläche ist der Effekt gebaut, korrekt
    // und praktisch nicht da — dieselbe Sorte Befund wie der Kegel auf Abstand 60.
    //
    // ⚠ **Hier stand eine „Verdeckungs"-Ausnahme, und sie war der schlimmste Fehler dieses Tages:**
    // sie erklärte eine gemessene Null damit, dass die Sonne hinter der Kugel stehe (`sonneVorn <
    // 0,1`), und druckte dafür ein **✓**. Die Null kam aber von einem kaputten Setter — mein Tor
    // hat also eine Erklärung für sein eigenes Versagen geliefert und sich damit selbst
    // freigesprochen. **Eine Ausnahme, die eine Null zu einem Bestehen macht, ist eine gesenkte
    // Grenze mit einer Ausrede davor.** Sie ist ersatzlos weg: der Nachweis oben („kann ich die
    // Effekte überhaupt abschalten") beantwortet die Frage richtig, und eine echte Verdeckung ist
    // dann einfach eine ehrliche Null — die man am Bild klärt, nicht per Heuristik.
    const sichtbar = diff.anteil >= 0.2;
    return {
      idle: false, ok: ok && sichtbar, zuwachs, mitEffekt, ohne, sicht, diff,
      text: (ok && sichtbar ? '✓' : '✗') + ' additive effects touch ' + diff.anteil
        + ' % of the frame (max Δ ' + diff.maxDelta + '/765, mean Δ ' + diff.mittelDelta + ')'
        + (sichtbar ? '' : ' — ⚠ nothing measurable on screen: either occluded, out of frame,'
                         + ' or switched off — look before you believe a zero')
        + ' · clipped white ' + ohne.weissProzent + ' % → ' + mitEffekt.weissProzent
        + ' % (+' + zuwachs.toFixed(2) + ')' + (ok ? '' : ' — ⚠ EATING THE PICTURE')
        + ' · ' + sicht.imBild + '/' + sicht.gesamt + ' surfaces in frustum'
        + ' · night weight ' + mitEffekt.nacht,
      zeilen: [
        'with effects:  ' + JSON.stringify(mitEffekt),
        'without:       ' + JSON.stringify(ohne),
        'aurora peak per curtain ' + aurora.spitzeEinzeln() + ' · god-ray ceiling ' + strahlen.spitze(),
        'threshold 1.0 % is OURS, not the source — tinyskies has no such measure, which is why we need one',
      ],
    };
  }
  // ── ⚠ **Kontextverlust: das Bild stirbt, der Rest läuft weiter** (Georg, 1.9., mit Screenshot) ──
  // Sein Befund: *„das Game stürzt ab, während das HUD weiterläuft (und auch Karten gesammelt
  // werden)"* — weißes Canvas, Wortmarke, Zähler, Pop-Punkte und Kartenstapel unverändert da.
  // **Gemessen, nicht vermutet:** `renderer.getContext().isContextLost()` stand auf **true**, und in
  // den Konsolenlogs lagen `THREE.WebGLRenderer: Context Lost.` / `Context Restored.` — ich hatte
  // sie eine Sitzung vorher gesehen und nicht verfolgt.
  //
  // Warum das Bild ohne Fehler verschwindet: ein verlorener Kontext wirft NICHT. Alle GL-Aufrufe
  // werden stille Nullaufrufe. Der Frame-Loop läuft also fehlerfrei weiter, `frameFehler` bleibt 0,
  // die Physik rechnet, Karten werden eingesammelt — nur malt niemand mehr. **Ein Fangkorb fängt
  // Ausnahmen; hier gab es keine.** Genau deshalb sah es wie ein Absturz des Spiels aus, während das
  // HUD (reines DOM, kein GL) unbeeindruckt weiterlief.
  //
  // ⚠ **Und die Ursache ist NICHT ein Leck bei uns.** Gemessen im Moment des Verlusts: 78 Texturen,
  // 147 Geometrien, 49 Programme — das ist der normale Stand. Ein Kontext geht in dieser Umgebung
  // verloren, weil der Browser ihn wegnimmt (zu viele gleichzeitige Kontexte im Tab beim
  // Neuladen im Editor, Speicherdruck, Hintergrund-Tab). Wir können ihn nicht verhindern, aber
  // *nicht zu bemerken, dass er weg ist, ist unsere Sache.*
  //
  // Was hier steht, ist deshalb Absichtliches Anhalten statt Weiterrechnen:
  //   1. `preventDefault()` auf `webglcontextlost` — ohne das gibt der Browser den Kontext nie zurück.
  //   2. Loop anhalten, damit nicht Minuten lang ins Leere gerechnet wird (und die Uhr weiterläuft:
  //      sonst steht man nach der Wiederherstellung in einer Welt, die vier Minuten weitergesprungen ist).
  //   3. Eine LESBARE Tafel im KFB-Papier statt eines weißen Canvas.
  //   4. Bei Wiederherstellung **neu laden** — und das ist eine Entscheidung, keine Faulheit: three
  //      muss nach einem Kontextverlust JEDE GPU-Ressource neu anlegen (147 Geometrien, 78 Texturen,
  //      49 Programme, dazu die gebackenen Vertexfarben und den Atlas). Ein halb wiederhergestelltes
  //      Bild wäre genau der stille Zustand, den wir hier gerade abschaffen.
  let kontextWeg = false, kontextVerluste = 0;
  const glKarte = renderer.domElement;
  function kontextTafel(text, knopf) {
    let t = document.getElementById('kfb-glweg');
    if (!t) {
      t = document.createElement('div');
      t.id = 'kfb-glweg';
      t.style.cssText = 'position:fixed;inset:0;z-index:10000;display:flex;align-items:center;'
        + 'justify-content:center;background:rgba(20,18,15,.82);font-family:"Baloo 2",system-ui,sans-serif;';
      (buehne() || document.body).appendChild(t);
    }
    t.innerHTML = '<div class="kfb-sheet" style="max-width:430px;padding:20px 22px;text-align:left">'
      + '<div style="font-size:15px;font-weight:700;margin-bottom:8px">Die Grafik wurde angehalten</div>'
      + '<div style="font-size:13.5px;line-height:1.5;opacity:.85">' + text + '</div>'
      + (knopf ? '<button id="kfb-glneu" type="button" style="margin-top:14px;font:inherit;'
          + 'font-size:13px;padding:7px 14px;border:1px solid rgba(31,26,20,.3);border-radius:3px;'
          + 'background:rgba(31,26,20,.06);cursor:pointer">Neu laden</button>' : '')
      + '</div>';
    const b = t.querySelector('#kfb-glneu');
    if (b) b.addEventListener('click', () => location.reload());
  }
  glKarte.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();          // ohne das kommt der Kontext nie zurück
    kontextWeg = true; kontextVerluste++;
    try { if (audio && audio.stop) audio.stop(); } catch (_) {}
    console.warn('[globe] WebGL-Kontext verloren — Loop angehalten. Verluste: ' + kontextVerluste);
    kontextTafel('Der Browser hat den Grafikkontext dieser Seite entzogen — das passiert bei zu '
      + 'vielen offenen 3D-Ansichten oder unter Speicherdruck. Das Spiel rechnet nicht weiter; '
      + 'vorher lief es unsichtbar im Leerlauf, während das HUD noch Karten zählte.', true);
  }, false);
  glKarte.addEventListener('webglcontextrestored', () => {
    console.warn('[globe] WebGL-Kontext zurück — Neuladen, weil alle GPU-Ressourcen neu müssen.');
    kontextTafel('Der Kontext ist zurück. Die Seite lädt neu, weil nach einem Kontextverlust jede '
      + 'Geometrie, Textur und jedes Shaderprogramm neu angelegt werden muss.', true);
    setTimeout(() => location.reload(), 700);
  }, false);
  let petOberflaeche = 'loading …';
  // v3 · Zustand der Ankunft und der Maus — in DIESEM Block, weil Marke und Panel ihn lesen
  // (Fehlerklasse 3: eine `let`-Deklaration unter ihrem Leser hat den Start zweimal getötet).
  let launchT = -1;            // ≥ 0 = das Anrollen läuft
  let sperrenGesetzt = false;  // v12 · Vulkan-Sperrzonen für die Gegner (einmalig)
  // v4 · Slice B · Zustand, den die WIRKER schreiben und der Frame-Loop abbaut. In DIESEM Block,
  // aus demselben Grund wie alles andere hier: ein Leser über seiner Deklaration killt den Start.
  let duckT = 0;               // Restzeit des Sidechain-Dips (s)
  // v10 · Slice 1 · Der Impact-Router. Steht HIER oben aus demselben Grund wie alles in diesem
  // Block: das Panel-Schema liest ihn (Zeile „Mech impact"), und ein Leser über seiner
  // Deklaration hat den Start in diesem Projekt schon zweimal getötet.
  const mechImpact = createMechImpact({ getFx: () => fx });
  let impactProbe = 0;         // Zähler des Testknopfs — er geht die 24 Zellen der Reihe nach durch
  let artZeiger = 0;           // v10 · wechselt den Artwork-Abnehmer (Türme / Teppiche)
  let schubZiel = 0;           // noch nicht eingelöster Tempo-Stoß (Weltmaß/s)
  let schubRampe = 0.15;       // über wie viele Sekunden er eingelöst wird
  let introAn = true;          // Panel: Startansicht beim Laden
  let lineGain = 1.0;          // Tempostreifen (siehe Befund unten)
  let postGain = 1.0;          // Radial-Blur
  let schattenBasis = 0;       // (v3b nur noch Platzhalter: die Deckkraft liegt in card-shadow.js)
  let toneMode = 'off';        // Belichtung: quellentreu (aus) oder ACES
  let uhrS = 0;                // Weltuhr in Sekunden (Prop-Atem)
  let gesammelt = 0;           // Karten im Durchflug (sky-cards.onPass)
  let kartenTakt = 0;          // Drossel für `pumpArt` — EIN Artwork, wenn Luft ist
  let einschlagT = 0;          // Nachhall des Karten-Einschlags in Sekunden (Streifen + Blur)
  let popPunkte = 0;           // Pop Score (Würfel-Durchflug)
  let traumaT = 0;             // Abklingzeit des Kamera-Traumas (rote Würfel)
  // ── v3 · S7b · Ausweichen als SERVO, nicht als Kursänderung ─────────────────────────────
  // Georg: „statt das Objekt mit sauberer Flug-Animation (banking etc) elegant daran
  // vorbeizuführen — OHNE den Kurs zu ändern!" Also wird der Reisekurs gemerkt; das Ausweichen
  // ist ein Winkelversatz DAGEGEN, und derselbe Servo führt zurück, sobald der Versatz 0 ist.
  let kursMerk = 0;            // der gemerkte Reisekurs (rad)
  const kursLog = [];          // v9 · die letzten zwölf Servo-Ereignisse mit Ursache (siehe Frame-Loop)
  let kursUnbekannt = 0;       // Ereignisse, für die KEINE der drei Ursachen zutraf
  let kursServo = false;       // Servo aktiv (Ausweichen oder Rückkehr)
  let dieSwing = 0, dieSwingT = 0;   // Würfel-FX: ein Schlenker, der von selbst zurückkommt
  const DIE_SWING_DUR = 1.25;        // Sekunden, über die der Schlenker ausläuft
  const wrapPi2 = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  let deckName = 'loading …';
  // v2 · Flankenerkennung für Einsätze. Ein Einsatz ist ein WECHSEL, kein Zustand — ohne diese
  // zwei Merker würde der Whoosh in jedem Bild neu anfangen (in v11 zwei Runden gejagt).
  let boostWar = false, wasserWar = false;
  // v4 · Slice C · dritte Flanke: die Bodenberührung. Mit Hysterese, siehe Aufrufstelle.
  let bodenWar = false, aglVor = 0, aglRate = 0;
  // **Messsonde statt Vermutung.** Georg: „Tempo 0.28 wird auch bei den Verzögerungen als konstant
  // angezeigt" — die Flugphysik ist also gleichmäßig, die Schwankung sitzt in der BILDTAKTUNG.
  // `dt` wird auf 0,05 geklemmt (wie in der Quelle, Game.ts 3042): bei einem Hänger bewegt sich die
  // Welt daher langsamer als die Uhr, danach wieder normal — genau „zu schnell, dann verzögert".
  // Diese Zähler sagen, WIE oft und WIE lang. `__globe.probe()` liest sie aus.
  const takt = { bilder: 0, geklemmt: 0, maxMs: 0, summeMs: 0, ueber33: 0, ueber100: 0 };
  // **Stufenloser Kamera-Abstand.** `CameraRig.update` nimmt `followDist` und `followHeight` als
  // Argumente — das ist die API der Quelle, kein Anbau. Start ist FOLLOW_DISTANCE 1,2 / HEIGHT 0,7.
  // 0 heißt POV aus dem Pet-Kopf; der Rig klemmt selbst bei MIN_CHASE_DISTANCE 0,42, deshalb
  // übernimmt darunter eine eigene Blende (siehe `povAnteil`).
  // **Startabstand 0,71 — aus Georgs Vergleichsbild gerechnet, mit einer Korrektur.**
  // Original-Screenshot 2624×1662 (Seitenverhältnis 1,579): der Teppich spannt ~162 px = 6,2 % der
  // Bildbreite. Unsere Fassung mit dem Quellwert 1,2 kommt auf 3,41 % — live gemessen, und die
  // analytische Formel sagte 3,65 %, also ist sie belastbar (7 % Abweichung).
  //
  // Rechenweg, diesmal vollständig:
  //   Zielanteil bei UNSEREM Seitenverhältnis 1,711: 6,2 % · (1,480 / 1,558) = 5,89 %
  //     (das horizontale Blickfeld ist hier weiter, derselbe Teppich füllt also weniger Prozent)
  //   nötige Winkelgröße = 0,0589 · 1,558 rad = 0,0918 rad
  //   nötiger ABSTAND    = 0,075 / 0,0918 = 0,817
  //   und der Abstand ist nicht camDist, sondern √(camDist² + Höhe²) mit Höhe = 0,7·camDist/1,2:
  //     camDist · √(1 + 0,34) = 0,817  →  camDist = 0,71
  //
  // ⚠ Mein erster Wert war 0,82 — da hatte ich die Kamerahöhe unterschlagen. Notiert, weil es genau
  // die Sorte Fehler ist, die eine Messung wieder zur Schätzung macht.
  // ⚠ Bewusste Abweichung vom Quellwert 1,2 (CameraRig.ts): Georgs Aufnahme des laufenden Originals
  // zeigt diesen Default nicht. Rückweg: 1.2.
  // v2b · **0,52 statt 0,71.** Georg: „momentan erkennt man das pet kaum in default-ansicht".
  // 0,71 war aus seinem Vergleichsbild des tinyskies-Originals gerechnet — dort ist der Teppich
  // aber die Hauptsache, bei uns ist es das PET auf der Karte. 0,52 vergrößert den Avatar im Bild
  // um Faktor 0,71/0,52 = 1,37; zusammen mit dem Sitz-Maßstab unten wird das Pet ~2,6× größer.
  // Rechenweg und Rückweg auf den gemessenen Originalwert stehen oben.
  let camDist = 0.52;
  const CAM_MIN = 0.0, CAM_MAX = 3.2, RIG_MIN = 0.42;

  // ── Kamera-Voreinstellungen · Georg, 3.9. ────────────────────────────────────────────────────
  // *„können wir die default-flug-avatar-ansicht, winkel, position und beleuchtung aus tiny skies
  // mal ausprobieren? sie scheint mir etwas besser als unsere aktuelle ansicht"* — und das Gefühl
  // ist in der Formel der Quelle nachweisbar, nicht Geschmack. `camera-rig.js` IST `CameraRig.ts`,
  // Parameter für Parameter. Abgewichen sind nur die ARGUMENTE, mit denen wir es rufen:
  //
  //                        Abstand    Höhe    closeDamp   Positionsglättung   Blickglättung
  //   Quelle (1,2 / 0,7)     1,20     0,70      1,00          10,0/s            7,8/s
  //   unsere 0,52            0,52     0,30      0,55           5,5/s            4,3/s
  //
  // `closeDamp = clamp(dist/0,95; 0,36; 1)` dämpft Position UND Blick mit dem Abstand — die Quelle
  // hat das gegen Schwindel bei enger Verfolgung eingebaut. Bei 0,52 läuft unsere Kamera deshalb
  // dauerhaft im halb gedämpften Bereich: **wir fahren dasselbe Rig in seinem trägsten Regime**,
  // und die Höhe ist bei 0,30 statt 0,70 — flacher, mehr Horizont, weniger Aufsicht auf die Karte.
  //
  // Warum wir überhaupt weg sind: die Karte ist 0,075 breit; bei 1,2 u ist das Pet winzig (die
  // Rechnung steht oben bei `camDist`). Das ist ein Bildgrößen-, kein Geometrieproblem — und
  // **scheinbare Größe hängt an Abstand UND Blickwinkel**: Größe ∝ 1/(Abstand · tan(FOV/2)).
  // Also gibt es die Quellengeometrie auch bei unserer Pet-Größe, wenn das FOV mitgeht:
  //   tan(FOV/2) = tan(30°) · 0,52/1,20 = 0,250  →  FOV = 28°.
  // Das ist der dritte Eintrag: Verfolgerverhalten und Aufsicht der Quelle, Pet so groß wie jetzt,
  // dafür flachere Perspektive (Teleobjektiv-Anmutung — im Cartoon oft ein Gewinn, aber eine
  // Änderung, die man sehen muss, statt sie sich auszurechnen).
  // Der Standard bleibt `kfb`; **es ändert sich nichts, bis Georg umschaltet.**
  const CAM_PRESETS = Object.freeze({
    kfb:  { dist: 0.52, hoehe: null, fov: 60, fovBoost: 20 },
    tiny: { dist: 1.20, hoehe: 0.70, fov: 60, fovBoost: 20 },
    // FOV-Atmen mitskaliert (20° auf 60° sind anteilig 9° auf 28°) — sonst atmet das enge Bild
    // doppelt so stark wie das Original.
    nah:  { dist: 1.20, hoehe: 0.70, fov: 28, fovBoost: 9 },
  });
  let camPreset = 'kfb', camHoeheUeber = null, letzteHoehe = 0;
  function setCamPreset(name) {
    const p = CAM_PRESETS[name]; if (!p) return;
    camPreset = name;
    camDist = p.dist; camHoeheUeber = p.hoehe;
    rig.params.baseFov = p.fov; rig.params.fovBoost = p.fovBoost;
    sagen('Camera: ' + (name === 'kfb' ? 'ours (0.52 u, 60°)'
      : name === 'tiny' ? 'tinyskies 1:1 (1.2 u, 0.7 up, 60°)'
      : 'tinyskies geometry, our pet size (1.2 u, 28°)'));
  }
  // **Sitz-Maßstab des Pets.** v17-Stock ist 1,15 — gemessen war das Pet damit 31 % der
  // Kartenbreite, in Georgs Referenzbild (Capybara auf dem tinyskies-Teppich) sind es ~69 %.
  // 2,2 liegt bei ~59 %: deutlich sichtbar, ohne über die Kanten zu wachsen. Regelbar im Panel.
  let petScale = 2.2;
  // **Bildhöhe.** Georg: „es sollte etwas höher im screen platziert sein". Die Kamera blickt
  // dazu ein Stück nach UNTEN (negative Drehung um die lokale X-Achse) — dadurch wandert alles,
  // was sie verfolgt, im Bild nach OBEN, und man sieht mehr Himmel statt mehr Boden. 0,11 rad
  // = 6,3° ≈ 11 % der Bildhöhe bei fov 60. Im POV wird der Anteil ausgeblendet (dort IST man
  // das Pet, ein Versatz wäre ein schiefer Horizont).
  let frameLift = 0.11;
  let petTurnToPlayer = true;   // im Stand zum Spieler drehen (pet-facing 'auto') oder immer Kurs
  let petKinOn = true;          // Cartoon-Trägheit: Federn, Squash, Kurvengewicht
  // Die zwei v17-Schichten. Erzeugt werden sie SOFORT (sie brauchen kein Pet), gefüttert erst,
  // wenn das GLB da ist — sonst hätte der Startpfad wieder einen Blocker.
  const petKin = createPetKinetics({ THREE });
  // Die Fassrolle beim Schub ist v17-Stock, hier aber AUS: ↑ ist in dieser Fassung die
  // Dauer-Schubtaste, jede Berührung würde die Welt einmal um die Flugachse drehen. Im Panel
  // zuschaltbar — die Karte führt sie aus (`carrier.setBarrelRoll`), damit Pet und Blatt
  // gemeinsam um die Kartenmitte rollen statt jedes für sich.
  petKin.setBarrelRoll(false);
  const petFace = createPetFacing({ THREE, params: { base: Math.PI } });
  const _povFwd = new THREE.Vector3(), _povKopf = new THREE.Vector3(), _povUp = new THREE.Vector3();
  const _povZielA = new THREE.Vector3(), _povZielB = new THREE.Vector3();
  // v3 · Arbeitsvektoren für Schatten und Laub — einmal angelegt, nie je Bild.
  const _fwd3 = new THREE.Vector3(), _right3 = new THREE.Vector3();
  // v3 · S7b · Standortnormale des VORIGEN Bildes: die Ausweich-Abfrage läuft VOR `carpet.update`
  // (dort gehört der Kurs schon der Physik), braucht also den Rahmen von eben. Ein Bild Versatz
  // bei 60 fps ist 4,7 Tausendstel Weltmaß — unsichtbar.
  const _up3 = new THREE.Vector3(0, 1, 0);
  // v3 · S7f · Steinchen am Flug-Boden-Kontakt: Drossel und Arbeitsvektoren.
  // ⚠ **Die Schwelle war geraten und deshalb falsch** (Georg: „die Partikel feuern dauerhaft").
  // Ich hatte 0,045 gesetzt, weil im Panel „Height above ground 0,121" stand — in einem
  // Dateikommentar stand aber „das Pet fliegt 0,03 über Grund". Zwei Zahlen für dieselbe Größe im
  // eigenen Projekt, und ich habe die falsche geglaubt. Ein Streifschlag-Effekt, der im Reiseflug
  // dauerhaft feuert, ist kein Effekt, sondern Nebel.
  // Jetzt wird nicht geraten, sondern **selbst kalibriert**: die Reisehöhe wird als langsamer
  // Mittelwert mitgeführt, und Steinchen gibt es, wenn der Abstand deutlich DARUNTER fällt.
  // Damit kann die Schwelle nicht um einen Faktor vier daneben liegen, egal welche Zahl stimmt.
  let aglBasis = 0.12, staubT = 0, staubAn = true;
  const STAUB_ANTEIL = 0.55;   // ab 55 % der Reisehöhe gilt es als Streifschlag
  const _staubP = new THREE.Vector3(), _staubV = new THREE.Vector3();
  // ── v3 · S7g · Landsuche ─────────────────────────────────────────────────
  // Georg, 29.8.: „man fliegt extrem lange über ‘leere’ Wasserflächen im default Pfad".
  // Das ist keine Terrain-Frage, sondern Geometrie: bei 46 % Landanteil verbringt ein Großkreis
  // über die halbe Zeit auf Wasser, und Ozeane sind zusammenhängend — also gibt es lange Strecken
  // ohne ein einziges Merkmal. Mehr Land würde die Welt ändern; das will niemand.
  //
  // Also lernt der Autopilot **die Küste zu suchen**: sieben Richtungen voraus abtasten, die mit
  // dem meisten Land nehmen, und den Unterschied als Winkelversatz in DENSELBEN Servo geben, der
  // schon das Ausweichen und den Würfel-Schlenker führt. Damit gibt es weiter genau einen
  // Kursbesitzer — und weil der Versatz auf 0 fällt, sobald Land unter uns ist, führt der Servo
  // von selbst auf den Reisekurs zurück. Kein Zwang, keine Schiene: eine Vorliebe.
  // ⚠ Sie greift NUR ohne Lenkeingabe (der Mensch besitzt den Kurs) und wird gedrosselt: sieben
  // Feldabfragen sind zu teuer für jedes Bild, aber gratis alle 0,4 s.
  const LAND_SUCHE_HZ = 0.4;
  const LAND_SPANNE = 0.55;      // maximaler Ausweichwinkel zur Küste (rad ≈ 32°)
  let landSucheT = 0, landOffset = 0, landZiel = 0, ueberWasserS = 0, landAn = false;
  // ⚠ **Standardmäßig AUS — eine Entscheidung gegen meine eigene Idee.**
  // Georg hat den Kurswechsel zweimal gerügt: „man wird hin-und-her gewackelt, beschleunigen
  // unklar" und „man ändert über freiem Wasser unmotiviert den Kurs im Autopilot, schwenkt hin und
  // her, dann irgendwie weiter". Filter und Hysterese haben das Schwingen gemildert und das
  // eigentliche Problem nicht behoben: **eine Kursänderung ohne sichtbaren Anlass liest als
  // Defekt.** Der Anlass — Land in vier Weltmaß Entfernung — ist bei Nacht über Wasser gar nicht
  // zu sehen; der Spieler erfährt also nur die Wirkung, nie den Grund. Eine Vorliebe, die man
  // nicht nachvollziehen kann, ist Willkür. Langweiliges Wasser ist das kleinere Übel als eine
  // Steuerung, die sich kaputt anfühlt.
  // Die Mechanik bleibt unter dem Schalter „Coast seeking". Richtig gelöst wird die leere See
  // anderswo: Inseln, schwimmende Karten, ein sichtbares Ziel am Horizont, dem man FOLGEN WILL.
  // Das steht als offener Punkt im Dokument — nicht als stiller Automatismus im Kurs.
  const _lsN = new THREE.Vector3();
  /** Landanteil auf einem Bogen voraus, gemessen über DREI Stützpunkte.
   *  ⚠ Waren fünf, mal sieben Richtungen = 35 Rauschabfragen auf EINEN Schlag — und weil jede
   *  Abfrage vier Oktaven plus die Biom-Mischung ist, war das ein HÄNGER alle 0,4 s. Genau Georgs
   *  „ruckelig auf einmal". Jetzt fünf Richtungen × drei Stützpunkte = 15, und die Suche läuft nur
   *  über Wasser. Eine Drossel macht eine teure Rechnung nicht billig, sie macht sie nur seltener
   *  — sichtbar bleibt sie trotzdem. */
  function landVoraus(pos, up, fwd, winkel) {
    let treffer = 0;
    const c = Math.cos(winkel), s = Math.sin(winkel);
    // Richtung im Tangentialrahmen drehen — nicht um eine Weltachse.
    const rx = fwd.x * c + (up.y * fwd.z - up.z * fwd.y) * s;
    const ry = fwd.y * c + (up.z * fwd.x - up.x * fwd.z) * s;
    const rz = fwd.z * c + (up.x * fwd.y - up.y * fwd.x) * s;
    for (let k = 1; k <= 3; k++) {
      const bogen = k * 0.26;    // bis 0,78 rad ≈ 4 Weltmaß-Einheiten voraus
      const cb = Math.cos(bogen), sb = Math.sin(bogen);
      _lsN.set(up.x * cb + rx * sb, up.y * cb + ry * sb, up.z * cb + rz * sb).normalize();
      if (surfaceAltitudeAt(seed, terrainType, _lsN.x, _lsN.y, _lsN.z) > 0.001) treffer++;
    }
    return treffer / 3;
  }

  // **Die Marke wird von einer Funktion gesetzt, nicht nur in der Schleife.** Der Verifier hat es
  // gemessen: bei verdeckt geladener Seite tickt rAF nicht, und die Marke blieb leer — obwohl das
  // erste Bild schon stand. Ein Zustand, den man sehen kann, muss auch ohne Schleife stimmen.
  function updateBadge() {
    const r = carpet.report();
    badge.textContent = 'Seed ' + seed + '  ·  ' + terrainType
      + (biomHier ? '  ·  ' + biomHier.name : '') + '  ·  ' + timeOfDay
      + '  ·  speed ' + r.tempo + '  ·  drift ' + r.drift + (r.ueberWasser ? '  ·  water' : '')
      + '  ·  ' + Math.round(1000 / Math.max(1, frameMs)) + ' fps'
      + '  ·  distance ' + (camDist < 0.06 ? 'POV' : camDist.toFixed(2))
      + '  ·  ' + audio.label + (tonHinweis ? '  ·  ' + tonHinweis : '')
      + (intro.active ? (intro.haelt ? '  ·  holding — waiting for the world to arrive'
                                     : '  ·  opening shot ' + intro.rest.toFixed(1) + ' s · any key skips')
         : launchT >= 0 ? '  ·  rolling out' : '');
  }

  rig.snapTo(carpet.state.qPosition, carpet.state.heading, carpet.state.altitude, GLOBE_RADIUS);

  // ── v3 · S1 · Startansicht: EIN Kamerabesitzer, solange sie läuft ─────────
  // Der Rig wird während des Intros jedes Bild mit `snapTo` nachgeführt (er ist damit am
  // Übergabepunkt exakt richtig); das Intro LIEST diese Pose und blendet die eigene dagegen.
  // Die Flugsteuerung schweigt, bis übergeben ist — sonst würde eine gedrückte Taste in eine
  // Kamera hineinlenken, die noch niemandem gehört.
  if (introAn) {
    controls.enabled = false;
    // ⚠ Die Kamera geht MIT: das Intro liest daraus seine Zielpose (die Verfolgerpose, die
    // `rig.snapTo` gerade geschrieben hat) und friert sie ein. Ohne sie hätte die Bahn kein Ziel
    // und müsste eines erfinden — genau der Kreuzblend, den die neue Fassung abgeschafft hat.
    intro.begin(tangentFrame(carpet.state.qPosition), carpet.worldPos(), camera);
    intro.update(0, camera, carpet.worldPos());
  } else {
    launchT = 0;
  }
  // ⚠ **v10 · Der Klick, der die Tastatur holt, darf nicht die Startansicht abbrechen.**
  // Georg, 2.9.: „die gesamte Intro-Sequenz ist auch weg — man sieht Setting, dann direkt Flug".
  // Das war kein Zufall und kein zweiter Fehler, sondern **meine eigene Reparatur von vorhin**:
  // Ich habe ihm gesagt, er soll einmal in die Szene klicken, damit W/S/A/D ankommen (die Seite
  // läuft in einem Rahmen, der Fokus steht beim Öffnen im Chat). Genau dieser eine Klick läuft
  // aber auch in `introAbbrechen` — und bricht die 6 Sekunden ab, die er gerade erst gesehen hat.
  // Zwei Absichten auf derselben Geste, und die zweite gewinnt immer.
  // **Die Unterscheidung, die es dazu braucht, ist nicht „wie schnell", sondern „wem gehörte der
  // Fokus":** ein Klick in ein Fenster, das den Fokus noch nicht hatte, holt ihn — er ist eine
  // Zuwendung, kein Befehl. Erst der nächste Klick meint das Bild.
  // Der Horcher steht in der EINFANG-Phase, weil er vor allen anderen antworten muss: die
  // Fokusnahme selbst passiert weiter unten in derselben Ereignisrunde.
  let hatteFokus = false;
  addEventListener('pointerdown', () => {
    hatteFokus = document.hasFocus() &&
      (document.activeElement === renderer.domElement || document.activeElement === document.body);
  }, { capture: true, passive: true });

  const introAbbrechen = (e) => {
    if (!intro.active) return;
    if (e && e.type === 'pointerdown' && !hatteFokus) return;
    // Der Tastendruck, der die Startansicht STARTET, ist kein Abbruch (R, und der Panel-Knopf
    // feuert pointerdown vor click). Dazu ein Mindestalter: das erste Bild einer gerade
    // begonnenen Ansicht kann sich nicht selbst beenden.
    if (e && e.code === 'KeyR') return;
    if (intro.t < 0.15 && !intro.haelt) return;
    intro.skip();
  };
  addEventListener('pointerdown', introAbbrechen, { passive: true });
  addEventListener('keydown', introAbbrechen, { passive: true });

  // **Die Tastenlegende gehört in denselben Wiedereinhänger wie Canvas und Marke.** Nachprüfung
  // 27.8.: `#tv-meta` existierte, war aber leer — der Text wurde EINMAL beim Modulstart gesetzt und
  // danach nie wieder, während die Vorlage die Bühne neu rendert. Ergebnis: die vier Klang-Tasten,
  // also das Lieferergebnis dieser Runde, standen nirgends auf dem Bildschirm. Idempotent und aus
  // `setInterval` gerufen, nicht aus rAF (dieselbe Lehre wie beim Canvas).
  function metaSetzen() {
    const m = document.getElementById('tv-meta');
    if (!m) return;
    // ⚠ Der Schutz war `m.children.length` — also „irgendwas steht drin". Steht dort etwas
    // FREMDES (die Abnahme hat einen Textknoten hineingeschrieben), schreibt diese Funktion nie
    // mehr, und die Tastenlegende bleibt für immer weg. Jetzt wird das EIGENE Kind erkannt.
    if (m.querySelector(':scope > .t[data-kfb="meta"]')) return;
    m.textContent = '';
    const a = document.createElement('div'); a.className = 't'; a.dataset.kfb = 'meta';
    a.textContent = 'Travel Globe v13 · Zweig aus v12 · TS-Delta Stufe A';
    const b = document.createElement('div'); b.className = 's';
    b.textContent = 'W throttle · S brake · A/D heading · ↑ climb · Space shoot · left-drag look (Alt: steer) · wheel/pinch distance · 0 = POV'
      + '  ·  R opening shot · K dice · M mouse · T sound · U engine · J track · N narrator · G panel';
    m.appendChild(a); m.appendChild(b);
  }
  metaSetzen();

  // ⚠ **Das erste Bild wird SOFORT gezeichnet, nicht erst im ersten rAF.** Der Verifier hat es
  // gemessen: nach dem Laden stand `renderer.info.render.frame = 0`, obwohl Globus, Pet und Karte
  // fertig waren. Lädt die Seite verdeckt oder gedrosselt, tickt rAF gar nicht — und die Bühne
  // bleibt in ihrem CSS-Hellblau stehen. Genau das war Georgs „1–2 mal neu laden", und mein
  // erster Fix (auf `#tv-stage` warten) traf daneben, weil die Bühne längst da war.
  globe.setAtmosphereByCamera(camera.position.length());   // synchron, siehe Fehlerklasse 4
  zyklus.setSpaceByCamera(camera.position.length(), GLOBE_RADIUS);
  renderer.render(scene, camera);
  updateBadge();

  // ⚠ **Der Canvas muss sich selbst wieder einhängen.** Gemessen 27.8.: Runner läuft, Pet geladen,
  // 20 Materialien — aber `document.querySelectorAll('canvas').length` = 0 und die Marke leer. Die
  // Vorlage dieser Seite rendert `#tv-stage` neu, und dabei verschwindet alles, was ein Modul dort
  // hineingehängt hat. Das ist kein Fehler der Vorlage, sondern eine Annahme von mir: ich hatte
  // erwartet, dass ein Elternknoten stehen bleibt. Also prüfen und wieder einhängen — mit
  // `setInterval`, weil rAF in verdeckten Seiten nicht tickt (dieselbe Lehre wie beim Start).
  // ⚠ **Jede Pflicht in ihrem eigenen `try`.** Die Abnahme hat gemessen, dass Canvas und `#kfb-ui`
  // nach dem Entfernen NICHT zurückkamen — und in der alten Fassung hätte EINE werfende Pflicht
  // alle folgenden mitgenommen, still, ohne Konsolenmeldung, weil ein Fehler in einem
  // `setInterval`-Rückruf nur den Tick beendet. Ein Wiedereinhänger, der an seiner ersten Pflicht
  // stirbt, ist schlimmer als keiner: er sieht vorhanden aus.
  // `wiederTakte` und `wiederLetzterFehler` stehen im Panel — damit ist sein Leben ablesbar.
  function pflicht(name, fn) {
    try { fn(); } catch (e) {
      wiederFehler++; wiederLetzterFehler = name + ': ' + (e && e.message || e);
    }
  }
  function anhaengen(el) {
    if (!el || el.isConnected) return;
    const s = buehne();
    if (s) s.appendChild(el);
  }
  function wiederEinhaengen() {
    wiederTakte++;
    pflicht('canvas', () => {
      if (renderer.domElement.isConnected) return;
      const s = buehne();
      if (!s) return;
      s.appendChild(renderer.domElement);
      resize();
      globe.setAtmosphereByCamera(camera.position.length());
      zyklus.setSpaceByCamera(camera.position.length(), GLOBE_RADIUS);
      renderer.render(scene, camera);
    });
    // Auch ohne rAF-Ticks aktuell halten: in einer verdeckt geladenen Seite zeigte die Marke sonst
    // dauerhaft den Startwert und verschwieg genau dort den Kartenausfall.
    pflicht('badge', () => {
      updateBadge();
      if (badge.isConnected) return;
      const h = document.getElementById('tv-hud') || buehne();
      if (h) { h.appendChild(badge); updateBadge(); }
    });
    pflicht('meta', metaSetzen);
    pflicht('ui', () => anhaengen(uiRoot));
    pflicht('hud', () => anhaengen(hud && hud.el));
    pflicht('look', () => anhaengen(hud && hud.lookEl));
    // Das Diagnose-Blatt gehört in DIESELBE Liste — es war die einzige Schicht, die nicht
    // drinstand, und genau sie ist ausgefallen.
    pflicht('bericht', () => anhaengen(berichtBlatt));
  }
  wiederEinhaengen();          // einmal sofort, nicht erst nach 500 ms
  setInterval(wiederEinhaengen, 500);
  // Und nach dem Wiedererscheinen noch eins, weil ein gedrosseltes Bild veraltet sein kann.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    globe.setAtmosphereByCamera(camera.position.length());
    zyklus.setSpaceByCamera(camera.position.length(), GLOBE_RADIUS);
    renderer.render(scene, camera);
    try { updateBadge(); } catch (e) {}
  });

  // ── Pet auf die Karte (KFB statt Capybara) ────────────────────────────────
  // Asynchron, und die Welt läuft ohne: bis das GLB da ist, fliegt der Teppich leer. Das ist die
  // Regel dieses Projekts für alles Schwere — RAW-first, kein Blocker im Startpfad.
  const passenger = carrier.seat;   // v17: der Sitz IST der Ort des Pets
  let petLoaded = false, petParts = null, petFehler = false;
  // v13 · Der Antrieb für die Cartoon-Verformung. Er hängt sich an das Pet, sobald es da ist —
  // und er hängt es NICHT um (Begründung im Kopf von `pet-traegheit.js`: `applyCartoonDeform`
  // bäckt die Hierarchie ein, und genau die braucht das Augen-Rig).
  const traegheit = createPetTraegheit(THREE);
  (async () => {
    try {
      const pets = await import('../terrain-planets-v1/kfb-pets.js');
      const lib = await pets.loadPets();
      // **Erst die Oberfläche, dann das Pet.** Der Look steckt im Vertrag (`koerper.material.live`)
      // und wird als `makeMat` ÜBERGEBEN — die kanonische `kfb-pets.js` liest ausschließlich
      // `opts.makeMat`, `surface` allein wäre stumm (in v17 gemessen und dort notiert). Beides
      // mitgeben: `makeMat` wirkt jetzt, `surface` sobald das Repo nachzieht.
      let surface = null;
      try {
        const sm = await import(/* @vite-ignore */ SURF_CANON);
        surface = await sm.createPetSurface({ THREE, renderer,
                                             material: lib.koerper && lib.koerper.material });
        petOberflaeche = 'Clay/Papier (pet-surface.v1) · ' + (surface.state.texture || 'proc');
      } catch (e) {
        petOberflaeche = 'flat default — pet-surface unavailable';
        console.warn('[globe] Pet-Oberflaeche nicht ladbar → flacher Default', e);
      }
      const loader = new GLTFLoader();
      const pet = await pets.makePet(lib, null, {
        THREE,
        loadGltf: (url) => new Promise((res, rej) => loader.load(url, res, undefined, rej)),
        eyes: true, motion: 'idle',
        surface: surface || undefined,
        makeMat: surface ? surface.makeMat : undefined,
      });
      const obj = pet.object3D;      // Vertrag ist `object3D`, nicht `group`
      // **v2b · Erst die Teile, dann die Materialien.** `initParts()` baut Ohren und Schwanz
      // NACH (Bauanleitung: Follow-Through hängt daran) — wer vorher umfärbt, lässt sie im
      // Originalmaterial stehen. Genau diese Fehlerklasse steht in v17 als Notiz an der
      // Ausblendliste („die Ohren blieben stehen und poppten dann weg").
      try { if (pet.motion && pet.motion.initParts) pet.motion.initParts(); } catch (e2) {}
      // Der „wache“ Zustand (v17, §7e): wandernder Ausdruck + unregelmäßiges Blinzeln. Das ist
      // Ruhe, kein Zappeln — und es ist der Unterschied zwischen einem Mitflieger und einer Requisite.
      try { if (pet.face && pet.face.setDrift) pet.face.setDrift(true); } catch (e2) {}
      try { if (pet.rig && pet.rig.setBlink) pet.rig.setBlink({ minGap: 2.2, maxGap: 6.5, dur: 0.13 }); } catch (e2) {}
      // ⚠ **Die eckigen Kanten waren MEINE.** Hier stand ein `traverse`, das jedes Pet-Material
      // durch `MeshPhongMaterial({ flatShading: true })` + Rim-Light ersetzt hat. `flatShading`
      // erzeugt harte Normalen pro Dreieck — genau die Facetten, die Georg gesehen hat — und die
      // Zuweisung wirft die Colormap aus dem GLB weg. Die Cube-Pets bringen von Kenney RUNDE
      // Normalen mit; im Pet Studio heißt der Schalter dafür `face.facet` („Facetten: AN (hart)"
      // gegen „Kenney-Rundung (weich, aus)"), und `pet-library.v6.js` facettiert nur auf
      // ausdrücklichen Contract-Wunsch. Wir wollten die Rundung — wir hatten sie übermalt.
      // Jetzt malt `surface.reskin` die Materialien: native Colormap behalten, Clay/Papier
      // triplanar darüber, `flatShading: false`.
      if (surface && pet.character) {
        const c = pet.cfg && pet.cfg.color;
        const hex = typeof c === 'string' ? new THREE.Color(c).getHex() : c;
        try {
          surface.reskin(pet.character, hex);
          if (pet.rig) {
            if (surface.usesLidSampler && surface.usesLidSampler(hex)) pet.rig.lidSampler = surface.lidSampler;
            if (pet.rig.reskinLids) pet.rig.reskinLids();
          }
        } catch (e2) { console.warn('[globe] reskin fehlgeschlagen', e2); }
      }
      obj.scale.setScalar(petScale);
      obj.position.set(0, 0, 0);
      obj.rotation.y = Math.PI;      // face travel direction (−Z), wie in v17
      obj.traverse((c) => { if (c.isMesh) c.castShadow = true; });
      passenger.add(obj);
      lighting.register(obj);         // Environment, Fill und Tint gelten auch für das Pet
      // **PFLICHT nach dem `add`** (Bauanleitung §10): sonst baut three die Programme erst beim
      // ersten Zeichnen — mit ungebundenen Uniforms, und das ist genau das „flach/gold", das in
      // zwei Pet-Editoren schon gejagt wurde.
      try { renderer.compile(scene, camera); } catch (e2) {}
      obj.traverse((c) => { if (c.material) { c.material.transparent = true; avatarMats.push(c.material); } });
      avatarMatsGezaehlt = avatarMats.length;
      // `applyClip` erwartet das OBJEKT, nicht den Renderer — mein erster Aufruf mit `renderer`
      // fiel stumm in den catch. Die Clip-Ebene schneidet die Füße an der Kartenfläche ab.
      try { carrier.applyClip(obj); renderer.localClippingEnabled = true; } catch (e) {
        console.warn('[globe] Clip-Ebene nicht angewandt', e);
      }
      petParts = pet;
      petLoaded = true;
      // **Zuletzt der Verbieger**, denn er liest die Bounding-Box der fertigen Figur — nach
      // `initParts` (Ohren, Schwanz) und nach `reskin`, sonst misst er eine halbe Figur und
      // klebt an Materialien, die gleich ersetzt werden.
      try {
        if (!traegheit.attach(obj)) console.warn('[globe] Pet-Trägheit nicht angehängt — keine Meshes');
      } catch (e2) { console.warn('[globe] Pet-Trägheit fehlgeschlagen', e2); }
      console.info('[globe] Pet auf der Karte: ' + (pet.id || pet.name || 'default'));

    } catch (e) {
      petFehler = true;
      console.warn('[globe] Pet nicht geladen — der Teppich fliegt leer',
                   (e && (e.message || e.name)) || e, e && e.stack);
    }
  })();

  // ── v13 · Der Anflug wartet, bis die Welt angekommen ist ──────────────────────────
  // Georg, 3.9.: „intro ruckelt noch" — nach dem 1:1-Port der Kurve. Die Nähte sind weg; was bleibt,
  // ist kein Mathe-, sondern ein REIHENFOLGEN-Problem. Der Block oben ist der schwerste der ganzen
  // Sitzung: Modul-Import, Pet-Oberfläche rechnen, GLB parsen, Texturen hochladen, `renderer.compile`.
  // Alles davon blockiert den Hauptfaden für Dutzende Millisekunden — und alles davon landet 1–3 s
  // nach dem Start, also mitten in den 5,2 s, in denen die Kamera als einziges Mal schnell fährt.
  // Im Stand sieht man so einen Block nicht. Während eines Schwenks ist er ein Ruck.
  // Deshalb hält das Intro auf seinem ersten Bild (Standbild auf der Lobby-Bahn), bis das Pet sitzt
  // — höchstens 2,4 s, danach fährt es los und nimmt den Ruck in Kauf (lieber ein Ruck als ein
  // Startbildschirm, der auf eine lahme Leitung wartet). **Kein zweiter Effekt, keine zweite Uhr:**
  // während des Halts ist `dt` null.
  intro.warteAuf(() => petLoaded || petFehler, 2.4);

  // ── Die Kartenfläche gehört dem Carrier ──────────────────────────────────
  // **v2b · Die gebastelte Ersatzkarte ist WEG.** Georg, 28.8.: „die pet-karte ist gebastelt,
  // nicht die KFB card backside lowrez version von github" und „eine weitere outline, nur die
  // KFB outline, sonst entsteht ein gutter". Beides war EINE Ursache: hier lag ein zweiter
  // Kartenmaler. `card-carrier.js` holt die kanonische Rückseite
  // (`media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png`, RAW-URL) und malt sie mit GENAU EINER
  // Ink-Outline nach KFB Ink Outline Style v1 in ihr eigenes Canvas — deckendes Papier bis zum
  // Rand, kein transparenter Ring. Dieser Runner hat die Textur danach mit einem gezeichneten
  // Ersatz plus `strokeRect` überschrieben: daraus wurden die zweite Kante und das Gutter
  // dazwischen, und die echte Deckseite war nie zu sehen.
  //
  // Die kanonische Quelle ist damit die EINZIGE. Ein zweiter Kartenmaler (card-registry als
  // Deckseite auf dem Teppich) bleibt bewusst draußen — die Flugkarte ist die Rückseite, nicht
  // eine gezogene Karte. Rückweg: dieser Absatz sagt, was gelöscht wurde.
  kartenQuelle = 'KFB card back (carrier, one ink outline)';

  // ── v2b · EIN Zahnrad statt zwei Messwert-Leisten ────────────────────────
  // Georg: die Leisten unten links und oben rechts sind „clutter“ und für Flug-Testing nicht
  // relevant. Sie bleiben — unsichtbar, bei Hover lesbar (CSS im Panel-Modul) — und ihr Inhalt
  // steht vollständig im Panel unter „Technik“. Sortiert ist nach NUTZUNGSHÄUFIGKEIT: was man
  // beim Fliegen dauernd anfasst, steht offen oben; Messwerte liest man selten, also zuletzt.
  const zeitTexte = { day: 'day', evening: 'evening', night: 'night' };

  // ── v7 · Der IST-Stand für den Fahrzeug-Vertrag ────────────────────────────────────────
  // **Gelesen, nicht geschrieben.** Jede Zahl kommt aus dem Modul, das sie besitzt: die
  // Kartenmaße aus dem Rig (`halfW`/`halfD` in Rig-Maß, mal Weltmaßstab der Gruppe), die
  // Schräglagen aus `carpet.params`, der Sitzversatz aus dem Sitz selbst. Damit ist das Tor
  // eine Kontrollprobe und keine Meinung (PM-41): der Vertrag kann durchfallen.
  //
  // `wakeOrt` ist der einzige Wert, der hier als Wort steht statt als Messung — weil der
  // Wake seinen Ursprung heute NICHT aus einem Fahrzeug liest, sondern aus `qPosition`
  // (`carpet-wake.fahnen`). Das Wort ist damit der Befund, nicht die Zusage.
  const WAKE_ORT_HEUTE = 'mitte';
  function fahrzeugIst() {
    const s = avatar.scale.x;                    // Weltmaßstab der Rig-Gruppe (0,025)
    const tiefe = carrier.halfD ? carrier.halfD * 2 : 0;
    return {
      maxBank: carpet.params.maxBank,
      driftBankMax: carpet.params.driftBankMax,
      halbBreite: carrier.halfW != null ? carrier.halfW * s : null,
      halbTiefe: carrier.halfD != null ? carrier.halfD * s : null,
      sitzVor: tiefe ? carrier.seat.position.z / tiefe : null,
      wakeOrt: WAKE_ORT_HEUTE,
    };
  }

  const schema = [
    { id: 'flug', title: 'Flight & Camera', open: true, rows: [
      { kind: 'seg', label: 'Camera preset',
        options: [{ v: 'kfb', l: 'Ours' }, { v: 'tiny', l: 'tinyskies 1:1' }, { v: 'nah', l: 'tinyskies + our size' }],
        get: () => camPreset, set: (v) => setCamPreset(v) },      { kind: 'note', text: 'Georg, 3.9.: „können wir die default-flug-avatar-ansicht … aus tiny skies mal ausprobieren? sie scheint mir etwas besser“ — the rig IS CameraRig.ts, parameter for parameter; only the arguments differ. The source chases at 1.2 u distance and 0.7 u height, we chase at 0.52 / 0.30. That matters more than it looks: closeDamp = clamp(dist/0.95, 0.36, 1) damps position AND look-at smoothing with distance (the source built it against dizzy spins on tight chases), so at 0.52 our camera runs permanently at 55 % — 5.5/s instead of 10/s. We are driving the same rig in its most sluggish regime, and sitting lower. We left 1.2 because the card is 0.075 wide and the pet gets tiny — but apparent size ∝ 1/(distance · tan(fov/2)), so the source’s geometry is available at our pet size if the lens comes along: tan(fov/2) = tan(30°)·0.52/1.2 → fov 28°. That is the third entry — source chase behaviour and top-down angle, pet as large as now, flatter (long-lens) perspective. Default stays Ours; nothing changes until you switch.' },
      { kind: 'info', label: 'Chase reading', get: () => {
        const d = Math.max(RIG_MIN, camDist);
        const damp = Math.max(0.36, Math.min(1, d / rig.params.dampRef));
        return d.toFixed(2) + ' u · height ' + (camHoeheUeber != null ? camHoeheUeber.toFixed(2)
          : (0.7 * Math.min(1, d / 1.2)).toFixed(2)) + ' u · fov ' + camera.fov.toFixed(0)
          + '° · closeDamp ' + damp.toFixed(2) + ' → position smoothing '
          + (rig.params.posSmooth * damp).toFixed(1) + '/s (source 10.0 at 1.2 u)'; } },
      { kind: 'slider', label: 'Camera distance', min: 0, max: CAM_MAX, step: 0.02,
        // Der Regler verlässt die Voreinstellung, statt sie zu behaupten: sonst zeigt das
        // Segment weiter „tinyskies", während die feste Höhe 0,70 einen Abstand von 0,3 begleitet.
        get: () => camDist, set: (v) => { camDist = v < 0.06 ? 0 : v; camHoeheUeber = null; camPreset = 'frei'; },
        fmt: (v) => (v < 0.06 ? 'POV · the pet’s view' : v.toFixed(2) + ' u') },
      { kind: 'slider', label: 'Pet higher in frame', min: 0, max: 0.26, step: 0.005,
        get: () => frameLift, set: (v) => { frameLift = v; },
        fmt: (v) => (v < 0.003 ? 'centred' : (v * 180 / Math.PI).toFixed(1) + '° upward') },
      { kind: 'slider', label: 'Pet size on the card', min: 1, max: 3.2, step: 0.05,
        get: () => petScale,
        set: (v) => { petScale = v; if (petParts) petParts.object3D.scale.setScalar(v); },
        fmt: (v) => v.toFixed(2) + '×' + (Math.abs(v - 1.15) < 0.03 ? '  ·  v17 stock' : '') },
      { kind: 'toggle', label: 'Face you when idle',
        get: () => petTurnToPlayer,
        set: (on) => { petTurnToPlayer = on; petFace.setMode(on ? 'auto' : 'track'); } },
      { kind: 'toggle', label: 'Cartoon inertia (deformer)',
        get: () => petKinOn,
        set: (on) => {
          petKinOn = on;
          // Aus heißt aus: sonst friert die letzte Federstellung ein und sieht wie ein Fehler aus.
          if (!on && petParts) { petParts.object3D.rotation.set(0, Math.PI, 0); petParts.object3D.position.set(0, 0, 0); }
        } },
      { kind: 'toggle', label: 'Barrel roll on boost', get: () => petKin.barrelRoll.on,
        set: (on) => { petKin.setBarrelRoll(on); if (!on) carrier.setBarrelRoll(0); } },
    ] },
    { id: 'ankunft', title: 'Arrival & Time', open: true, rows: [
      { kind: 'toggle', label: 'Opening shot on load', get: () => introAn,
        set: (on) => { introAn = on; } },
      { kind: 'slider', label: 'Opening shot length', min: 3, max: 12, step: 0.5,
        get: () => intro.params.dur, set: (v) => { intro.params.dur = v; },
        fmt: (v) => v.toFixed(1) + ' s' },
      { kind: 'button', label: 'Play opening shot (R)',
        onClick: () => neustart('panel') },
      { kind: 'toggle', label: 'Day/night runs', get: () => zyklus.enabled,
        set: (on) => zyklus.setEnabled(on) },
      { kind: 'slider', label: 'Minutes per day', min: 1, max: 20, step: 0.5,
        get: () => zyklus.params.minutes, set: (v) => zyklus.setMinutes(v),
        fmt: (v) => v.toFixed(1) + ' min' },
      { kind: 'info', label: 'Time', get: () => zyklus.label },
      // ⚠ Die Abnahme für „der Ozean folgt dem Preset". Sie vergleicht, womit das Wasser ZULETZT
      // GEFÄRBT wurde, mit dem, was das Preset JETZT sagt — und meldet ✗, wenn die beiden
      // auseinanderlaufen. Ohne diese Zeile war die alte Fassung nicht falsch, sondern unsichtbar:
      // ein schwarzer Ozean sieht aus wie ein tiefer Ozean. Genau die Fehlerklasse, die Slice G
      // gekostet hat — ein Bild sagt nicht nein.
      // ⚠ **Die Abnahme vergleicht gegen den SOLL-Wert, nicht gegen das rohe Preset.**
      // Erste Fassung nahm `zyklus.preset.oceanShallow` als Soll. Sobald eine Stimmung den
      // Wasserton dreht, ist das der falsche Bezugspunkt: sie meldete ✓ mit UND ohne Stimmung und
      // war damit in beide Richtungen blind — sie hat weder die Drehung als Abweichung gemeldet
      // (richtig) noch ihr Verschwinden (falsch). `globe.ozeanSoll()` ist Preset PLUS
      // Stimmungsdrehung, also genau das, was gemalt sein muss.
      // Zusätzlich wird die Drehung selbst ausgewiesen: steht eine Stimmung an, muss der Farbton
      // messbar vom Preset abweichen. Eine Stimmung, die nichts tut, ist sonst nicht von einer
      // wirksamen zu unterscheiden.
      { kind: 'info', label: 'Ocean follows preset', get: () => {
          const soll = globe.ozeanSoll(), ist = globe.ozeanStand;
          const c1 = new THREE.Color(), c2 = new THREE.Color();
          const dc = (a, b) => { c1.set(a); c2.set(b);
            return Math.abs(c1.r - c2.r) + Math.abs(c1.g - c2.g) + Math.abs(c1.b - c2.b); };
          const u = globe.mesh.material.userData.shader
            && globe.mesh.material.userData.shader.uniforms.foamColor;
          const schaumIst = u ? u.value.getHex(THREE.SRGBColorSpace) : ist[2];
          const dTiefe = dc(soll[0], ist[0]), dSchaum = dc(soll[2], schaumIst);
          const hx = (v) => '#' + v.toString(16).padStart(6, '0');
          // ⚠ **Wirkt die Stimmung? Gemessen am GEMALTEN Farbton gegen den Ton der STIMMUNG.**
          // Erste Fassung fragte, ob das Wasser vom ROHEN Preset abweicht — und das ist das falsche
          // Paar. Bei `verdant` liegt der Stimmungston (191°) 1° neben dem Tag-Preset (190,2°), die
          // Drehung ist also korrekt und praktisch unsichtbar. Der Wächter meldete daraufhin
          // ⚠ und die ganze Zeile ✗ — **im Startzustand, für eine funktionierende Stimmung.**
          // Das ist genau die Falle, die §05t eine Runde vorher aufgeschrieben hat: ein Wächter, der
          // dauerhaft rot meldet, erzieht dazu, ihn zu überlesen.
          // Und schlimmer als der Fehlalarm: die alte Frage konnte „von einem zweiten Schreiber
          // überschrieben" nicht von „Stimmungston fällt mit dem Preset zusammen" unterscheiden —
          // sie hätte den Fehler, für den sie gebaut wurde, in genau dem Fall verpasst, in dem er
          // aussieht wie ein Zufall. **Ein Instrument muss das Paar messen, um das es geht:**
          // gemalter Ton gegen Soll-Ton der Stimmung. Wird die Drehung überschrieben, springt der
          // gemalte Ton auf den Preset-Ton — bei molten/frost/bone sind das 14–66° und damit laut.
          const hueVon = (v) => { const o = {}; c1.set(v).getHSL(o, THREE.SRGBColorSpace); return o.h * 360; };
          const ton = globe.wasserTon;
          const rohTon = hueVon(zyklus.preset.oceanShallow.getHex(THREE.SRGBColorSpace));
          let wirkt, tonOk = true;
          if (ton == null) {
            wirkt = 'no mood tint';
          } else {
            const gemalt = hueVon(ist[0]);
            const abw = (a, b) => { let d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
            const dSoll = abw(gemalt, ton), dRoh = abw(gemalt, rohTon);
            tonOk = dSoll <= 1.5;
            wirkt = (tonOk ? 'mood hue applied: painted ' : '⚠ MOOD HUE LOST: painted ')
              + gemalt.toFixed(1) + '° vs mood ' + ton + '° (Δ' + dSoll.toFixed(1) + '°)'
              // Die ehrliche Einschränkung steht dabei, statt als Warnung getarnt zu sein.
              + (dRoh <= 1.5
                  ? '  ·  note: preset hue coincides here (' + rohTon.toFixed(1)
                    + '°), so applied and overwritten are indistinguishable — and visually identical'
                  : '  ·  ' + dRoh.toFixed(0) + '° off preset hue ' + rohTon.toFixed(1) + '°');
          }
          const ok = dTiefe <= 0.02 && dSchaum <= 0.02 && tonOk;
          return (ok ? '✓ ' : '✗ ') + 'painted ' + hx(ist[0]) + ' / target ' + hx(soll[0])
            + ' Δ' + dTiefe.toFixed(3) + '  ·  foam ' + hx(schaumIst) + ' Δ' + dSchaum.toFixed(3)
            + '  ·  ' + wirkt;
        } },

      { kind: 'note', text: 'Terrain albedo, 30 Aug: the land palette was calibrated against a luminance band (0.04–0.33) that was itself disproved on 29 Aug and replaced by saturation-keep — the instrument changed, the values did not. Land sat at 0.077 linear against tinyskies 0.215, so the visible colour came from the eight lights instead of the material (the grey-blue wash), and everything standing on that ground read 3–10× too bright. One factor of 2.85 on all five bands, hue and saturation untouched. The ocean was a second, separate miss: all three presets carry ocean colours, the cycle never read them, so a world born at night kept a near-black ocean (0.005) all day. It now interpolates like fog, and the row above fails if it stops.' },
      // ⚠ Der Regler bleibt vollständig — nur der STANDARD folgt jetzt dem Vorbild (aus).
      // Georg, 30.8.: „aber unseren schatten können wir als setting lassen." Genau so: die Quelle
      // hat im Flug keinen sichtbaren Schatten (Schattenkamera ±22 bei Radius 5 → drei Pixel je
      // Baum), unser gemalter Fleck ist also eine KFB-Zutat, keine Nachbildung. Eine Zutat, die
      // man abschalten kann, ist eine Einstellung; eine, die man nicht abschalten kann, ist eine
      // Behauptung. Wer ihn aufdreht, bekommt auch seine harten Polygonkanten auf steilem Gelände
      // zurück — das war der dunkle Keil im Land. Deshalb steht es am Regler und nicht nur im Code.
      { kind: 'slider', label: 'Shadow under the card', min: 0, max: 0.8, step: 0.02,
        get: () => schatten.params.opacity,
        set: (v) => { schatten.setOpacity(v); schatten.setEnabled(v > 0.005); },
        fmt: (v) => (v < 0.005 ? 'off (like tinyskies)' : Math.round(v * 100) + ' %') },
      { kind: 'slider', label: 'Shadow: size', min: 0.6, max: 2, step: 0.05,
        get: () => schatten.params.size, set: (v) => { schatten.params.size = v; },
        fmt: (v) => v.toFixed(2) + '× card width' },
      { kind: 'note', text: 'Off by default. The mesh reads the ground and bends with the facets — but the edges show corner artefacts and water still clips it (finding 10). tinyskies has no shadow at all; until this is solved, that is the honest version.' },
      { kind: 'note', text: 'The ground keeps the palette of its start time — land and ocean are vertex colours in the mesh. Light, fog and sky carry the cycle.' },
    ] },
    { id: 'maus', title: 'Mouse & Trackpad', open: true, rows: [
      { kind: 'seg', label: 'Left-drag',
        options: [{ v: 'look', l: 'look around' }, { v: 'steer', l: 'steer' }],
        get: () => look.mode, set: (v) => look.setMode(v) },
      { kind: 'note', text: 'Alt/Option + drag does the other one. Two-finger drag on the trackpad stays zoom — those are wheel events, not a right click.' },
      { kind: 'slider', label: 'Look: sensitivity', min: 0.002, max: 0.012, step: 0.0005,
        get: () => look.params.lookSpeed, set: (v) => { look.params.lookSpeed = v; },
        fmt: (v) => (v * 1000).toFixed(1) + ' mrad/px' },
      { kind: 'slider', label: 'Look: recentre', min: 0, max: 4, step: 0.1,
        get: () => look.params.returnTime, set: (v) => { look.params.returnTime = v; },
        fmt: (v) => (v < 0.05 ? 'instant' : v.toFixed(1) + ' s') },
      { kind: 'slider', label: 'Steer: sensitivity', min: 0.002, max: 0.02, step: 0.001,
        get: () => look.params.steerSpeed, set: (v) => { look.params.steerSpeed = v; },
        fmt: (v) => (v * 1000).toFixed(0) + ' ‰/px' },
      { kind: 'info', label: 'Offset', get: () => {
        const o = look.offsetGrad;
        return (look.steerActive ? 'steering ' + look.steer.toFixed(2)
                : (o.yaw || o.pitch) ? o.yaw + '° / ' + o.pitch + '°' : 'centred'); } },
    ] },
    { id: 'fx', title: 'Effects', rows: [
      { kind: 'slider', label: 'Radial blur with speed', min: 0, max: 2, step: 0.05,
        get: () => postGain, set: (v) => { postGain = v; },
        fmt: (v) => (v < 0.03 ? 'aus' : v.toFixed(2) + '×') },
      { kind: 'slider', label: 'Speed lines', min: 0, max: 2, step: 0.05,
        get: () => lineGain, set: (v) => { lineGain = v; },
        fmt: (v) => (v < 0.03 ? 'aus' : v.toFixed(2) + '×') },
      { kind: 'toggle', label: 'Leaves near the ground', get: () => leaves.enabled,
        set: (on) => leaves.setEnabled(on) },
      { kind: 'info', label: 'Leaves', get: () => {
        const r = leaves.report();
        return r.landAlpha < 0.01 ? 'off · from speed 0.50 over land'
          : Math.round(r.landAlpha * 100) + ' % · ' + r.lebend + ' in the air'; } },
      { kind: 'note', text: 'Leaves are the source version since v3c (CarpetLeaves.ts): over LAND only, from speed 0.50, spawned BELOW the vehicle, 0.25 per frame. My own version hung on ground proximity and poured while crawling — that was the confetti.' },
      { kind: 'note', text: 'The source speed lines only start at speed 0.8 — our maximum is 0.78. They were built in and silent through v1 and v2; now cruise stays below the boost threshold and only ↑ pushes past it.' },
      { kind: 'seg', label: 'Exposure',
        options: [{ v: 'off', l: 'off (source-true)' }, { v: 'aces', l: 'ACES' }],
        get: () => toneMode,
        set: (v) => {
          toneMode = v;
          renderer.toneMapping = v === 'aces' ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
          // Ein Wechsel des Tonemappings ist ein Programmwechsel: jedes Material muss neu
          // kompiliert werden, sonst rechnet die Hälfte der Szene noch im alten Raum.
          scene.traverse((o) => {
            if (!o.material) return;
            (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.needsUpdate = true; });
          });
          sagen('Exposure: ' + (v === 'aces' ? 'ACES' : 'off'));
        } },
      { kind: 'slider', label: 'Exposure amount', min: 0.4, max: 1.6, step: 0.05,
        get: () => renderer.toneMappingExposure,
        set: (v) => { renderer.toneMappingExposure = v; },
        fmt: (v) => v.toFixed(2) + '×' + (toneMode === 'off' ? '  ·  only with ACES' : '') },
      { kind: 'note', text: 'tinyskies deliberately runs WITHOUT tone mapping — its colours already sit in the right space. ACES is the lever if the whole scene reads too bright; it changes everything, hence off by default.' },
    ] },
    { id: 'einfassung', title: 'HUD frame (Slice G)', rows: [
      { kind: 'toggle', label: 'Frame reacts to flight', get: () => (hudFlug ? hudFlug.enabled : false),
        set: (on) => { if (hudFlug) hudFlug.setEnabled(on); } },
      { kind: 'slider', label: 'Reaction: rotation limit', min: 0, max: 5, step: 0.25,
        get: () => (hudFlug ? hudFlug.params.maxGrad : 1.5),
        set: (v) => { if (hudFlug) hudFlug.params.maxGrad = v; },
        fmt: (v) => v.toFixed(2) + '°' + (v > 3 ? '  ·  ⚠ above the agreed ceiling' : (Math.abs(v - 1.5) < 1e-9 ? '  ·  agreed limit' : '')) },
      { kind: 'slider', label: 'Reaction: offset limit', min: 0, max: 12, step: 0.5,
        get: () => (hudFlug ? hudFlug.params.maxPx : 4),
        set: (v) => { if (hudFlug) hudFlug.params.maxPx = v; },
        fmt: (v) => v.toFixed(1) + ' px' + (v > 6 ? '  ·  ⚠ above the agreed ceiling' : (Math.abs(v - 4) < 1e-9 ? '  ·  agreed limit' : '')) },
      { kind: 'info', label: 'Spring self-test (must be all ✓)', get: () => (hudFlug ? hudFlug.selbsttest().join('   ') : '—') },
      { kind: 'button', label: 'Impact test (fires the HUD recoil)',
        onClick: () => { if (hudFlug) hudFlug.kick(1, 'panel'); } },
      { kind: 'note', text: 'One signal source, four readers. The frame loop writes four numbers on the HUD root — bank, g, speed, hit — and each corner reads what it needs; the alternative was four readers on carpet.state, which is a quantity without an owner (the error class this project keeps paying for). The corners deliberately do NOT move alike: if all four wobble together the screen shakes and that reads as a bug. The wordmark hangs loose, so it counter-rotates and flutters with speed; the gear is a machine, so it barely moves and its number stays upright; the pop die is a body lying in a corner, so it tips with the bank and squashes on impact (volume-preserving — the sky dice showed how fast 0.42 squash turns a cube into a bar); the card deck is a stack of paper, so it FANS outward in a turn. That is the answer to more immersion: not more movement, but movement that says something about the object. Limits are ±1.5° and ±4 px at full bank, agreed before building — above 3° / 6 px the HUD gets tiring and the sliders say so.' },
                  { kind: 'note', text: 'There are no plates behind the corners — that is the brief, not a rollback. Slice G built boxes twice (rusted metal, then paper) from a material note that was never meant for the HUD; the box was the mistake, not its surface. What survives is everything that was not surface: one measurement family for all four corners, the speed number in the gear hub, the flight-reaction carrier. Ink contour and drop shadow keep the corners readable.' },
    ] },
    { id: 'spuren', title: 'Wake & drift dust (Slice F)', rows: [
      { kind: 'toggle', label: 'Ocean spray', get: () => wake.enabled,
        set: (on) => wake.setEnabled(on) },
      { kind: 'slider', label: 'Spray: speed gate', min: 0, max: 0.78, step: 0.02,
        get: () => wake.params.tempoTor, set: (v) => { wake.params.tempoTor = v; },
        fmt: (v) => (v < 0.02 ? 'always on' : v.toFixed(2)
          + '  ·  alpha ceiling at max speed: ' + wake.deckel(0.78)
          + (Math.abs(v - wake.quelle.tempoTor) < 1e-9 ? '  ·  source' : '  ·  ⚠ off source')) },
      { kind: 'note', text: 'Measured while porting, not guessed: the source gates the spray at speed > 0.5 and fades it in over 0.4, so full opacity needs 0.9 — but our maxSpeed is 0.78 (1:1 from Carpet.ts). At full throttle without boost the wake therefore reaches 70 % opacity and never 100 %. That is the source’s own calibration (there you pass 0.78 only with upgrades), not a bug — and it is the same class as the leaves’ 0.5 speed gate that Slice A measured as "0 live particles". The number sits in the line above so nobody hunts it as a shader problem later. Lower the gate to see it at cruise.' },
      { kind: 'toggle', label: 'Drift dust', get: () => rauch.enabled,
        set: (on) => rauch.setEnabled(on) },
      { kind: 'slider', label: 'Drift dust: rate', min: 0, max: 80, step: 2,
        get: () => rauch.params.rate, set: (v) => { rauch.params.rate = v; },
        fmt: (v) => v + '/s' + (Math.abs(v - rauch.quelle.rate) < 1e-9 ? '  ·  source' : '  ·  ⚠ off source') },
      { kind: 'slider', label: 'Drift dust: gate', min: 0, max: 0.6, step: 0.02,
        get: () => rauch.params.driftTor, set: (v) => { rauch.params.driftTor = v; },
        fmt: (v) => (v < 0.02 ? 'any drift' : 'drift ≥ ' + v.toFixed(2)) },
      { kind: 'note', text: 'The dust hangs on the DRIFT ANGLE, not on speed — and that angle is already computed in carpet.js every frame (heading vs. velocity heading, normalised to 45°). One more reader on an existing measurement, not a second calculation. Turn hard at speed with A or D to see it. One more thing came out of reading the source side by side: this module accumulates 28 particles per SECOND, while its two neighbours from the same codebase (leaves, wake) count per FRAME. So this one looks identical at 30 and 60 fps and the other two do not — worth knowing before anyone tunes a rate.' },
    ] },
    { id: 'welt', title: 'World', rows: [
      { kind: 'toggle', label: 'Fly-through cards', get: () => sky.params.visible,
        set: (on) => sky.setVisible(on) },
      { kind: 'info', label: 'Collected', get: () => gesammelt + '  ·  ' + sky.count + ' in the sky' },
      { kind: 'info', label: 'Place', get: () => {
        const r = orte.report();
        return (r.aktiv || '—') + '  ·  ' + r.marken + ' named places'; } },
      { kind: 'info', label: 'World deck', get: () => deckName },
      { kind: 'toggle', label: 'Card towers (landmarks)', get: () => tuerme.enabled,
        set: (on) => tuerme.setEnabled(on) },
      { kind: 'info', label: 'Towers', get: () => {
        const r = tuerme.report();
        return r.tuerme + ' towers · ' + r.blaetter + ' sheets · ' + r.mitArtwork +  ' with artwork'; } },
      // ── v10 · Die Karte, die auf dem Boden LIEGT ────────────────────────────────────
      // ⚠ **"ist carpet nicht die flug-karte des pet?" (Georg, 2.9.) — ja, und genau das war der
      // Fehler.** Diese Regler hießen "Carpet: how many", und zwölf Zeilen weiter unten steht
      // "carpet · cruise speed". Zwei verschiedene Dinge, ein Wort: der TEPPICH, auf dem das Pet
      // fliegt (`carpet.js`, Flugphysik), und die KARTEN, die flach auf dem Gelände liegen
      // (`karten-teppich.js`, aus dem deutschen Bild "liegt wie ein Teppich").
      // Ich habe eine Suche gebaut, weil er den Regler nicht fand — das war die Antwort auf das
      // Symptom. Die Ursache ist, daß der Name nicht der Name der Sache ist; eine Suche über
      // falsche Namen findet zuverlässig das Falsche. Also: was auf dem Boden liegt, heißt
      // "Terrain card", was fliegt, heißt weiter "carpet". Ein Wort, ein Ding.
      { kind: 'info', label: 'Motif desk (v11 · one crop per motif)', tags: 'card karte motiv artwork rueckseite backside laden loading kasse',
        get: () => kasse.tor().text },
      { kind: 'info', label: 'Motif desk self-test (v11)', tags: 'card motiv artwork selbsttest test kasse',
        get: () => kasseSelbsttest().text },
      { kind: 'note', text: 'Why the desk exists, measured: the registry refuses a second request for a card that is already queued (`queue.some(j => j.card === card)`) and returns WITHOUT calling back. Since every lying card now has its sky card overhead asking for the SAME motif, the loser of that race set art = pending and waited forever — a permanent card back with no error anywhere. The desk answers every asker from one crop. It also compares by packId#n instead of object identity, so two lists holding equal-but-separate card objects still share one job. Note for anyone reading this in a hidden tab: pdf.js renders via requestAnimationFrame, so with document.hidden the crop count stays 0 — that is the guard, not a fault. The self-test above runs on a stub and works anywhere.' },
      { kind: 'info', label: 'Artwork pump (v11)', tags: 'card artwork pump laden loading takt drossel',
        get: () => 'gated by frame time (' + frameMs.toFixed(1) + ' ms → ' + (frameMs > 22 ? '0.90' : '0.12')
          + ' s between asks) and by ONE job in flight · nearest sheet first, for towers and lying cards alike'
          + ' · ' + registry.pending + ' in the registry queue, ' + kasse.offeneMotive + ' motifs open' },
      { kind: 'toggle', label: 'Terrain cards (lying on the ground)', tags: 'carpet teppich boden',
        get: () => teppiche.params.on,
        set: (v) => { teppiche.params.on = v; teppiche.neubau(); if (sky.ankerModus) sky.setAnker(teppiche.anker()); } },
      { kind: 'slider', label: 'Terrain card: size', min: 0.2, max: 2.0, step: 0.02,
        tags: 'carpet width breite teppich',
        get: () => teppiche.params.breite,
        set: (v) => { teppiche.params.breite = v; teppiche.neubau(); if (sky.ankerModus) sky.setAnker(teppiche.anker()); },
        fmt: (v) => v.toFixed(2) + ' u' },
      { kind: 'slider', label: 'Terrain cards: how many', min: 1, max: 56, step: 1,
        // ⚠ **Der Regler log über seinen eigenen Wert** (Abnahme 2.9.): die Welt baut 24 Teppiche,
        // der Bereich endete bei 16. Angezeigt stand „24.00", der Schieber klebte am Anschlag —
        // und wer ihn anfaßte, warf 8 Karten weg, ohne es zu wollen. Ein Bedienelement, dessen
        // Bereich den Ist-Wert nicht enthält, ist kein Regler, sondern eine Falle. Und `.toFixed(2)`
        // für eine Anzahl ist Rauschen: es gibt keine 24,5 Karten.
        tags: 'carpet count anzahl teppich density dichte',
        get: () => teppiche.params.anzahl,
        set: (v) => { teppiche.params.anzahl = v; teppiche.neubau(); if (sky.ankerModus) sky.setAnker(teppiche.anker()); },
        fmt: (v) => String(v) },
      { kind: 'slider', label: 'Terrain card: mesh fineness', min: 6, max: 48, step: 2,
        tags: 'carpet segments teppich relief',
        get: () => teppiche.params.segmente,
        set: (v) => { teppiche.params.segmente = v; teppiche.neubau(); if (sky.ankerModus) sky.setAnker(teppiche.anker()); },
        fmt: (v) => v + ' × ' + v },
      { kind: 'note', text: 'A terrain card reads the ground at every vertex through the ONE ground reader — the same one the mech stands on. The relief figure in Diagnostics says how much height it actually spans: that is the number that proves it follows the hills instead of lying flat on top of them.' },
      { kind: 'slider', label: 'Towers: sheet width', min: 0.06, max: 0.3, step: 0.005,
        get: () => tuerme.params.width,
        set: (v) => { tuerme.params.width = v; tuerme.rebuild(turmSites); },
        fmt: (v) => v.toFixed(3) + ' u' },
      { kind: 'slider', label: 'Cards: distance', min: 0.5, max: 3, step: 0.05,
        get: () => sky.params.ring, set: (v) => sky.setParams({ ring: v }),
        fmt: (v) => v.toFixed(2) + ' u' },
      { kind: 'slider', label: 'Cards: forward sector', min: 1.0, max: 4.2, step: 0.1,
        get: () => sky.params.spanAz, set: (v) => sky.setParams({ spanAz: v }),
        fmt: (v) => '±' + Math.round(v * 90 / Math.PI) + '°  ·  ' + (v / Math.max(1, sky.count) * 180 / Math.PI).toFixed(0) + '° per slot' },
      { kind: 'slider', label: 'Cards: jitter in slot', min: 0, max: 1, step: 0.05,
        get: () => sky.params.slotJit, set: (v) => sky.setParams({ slotJit: v }),
        fmt: (v) => (v < 0.03 ? 'none · perfectly even' : Math.round(v * 100) + ' % of the slot') },
      { kind: 'note', text: 'Card spread is STRATIFIED, not rejection-sampled: the forward sector is cut into one slot per card and each card keeps its own slot for good, so two cards can never share one. Rejection sampling cannot work here — cards respawn ONE AT A TIME, so the first has no neighbours to be rejected against. Ring distance alternates in and out per slot, so neighbours sit at different depths and read as two cards rather than a pile.' },
      { kind: 'slider', label: 'Cards: hit window · scale', min: 1, max: 3, step: 0.1,
        get: () => sky.params.passRadius, set: (v) => sky.setParams({ passRadius: v }),
        fmt: (v) => {
          const p = sky.params;
          return ((0.04 * v + p.passPad) * 2).toFixed(3) + ' × ' + ((0.023 * v + p.passPad) * 2).toFixed(3)
            + ' u' + (Math.abs(v - 1) < 0.05 ? '  ·  source value' : ''); } },
      // Der Zuschlag ist die eigentliche Reparatur an „zu oft keine Treffer" (Naht 7) — er muss
      // also einen Regler haben, nicht nur eine Konstante. 0 = reine v17-Rechnung.
      { kind: 'slider', label: 'Cards: hit window · body pad', min: 0, max: 0.09, step: 0.002,
        get: () => sky.params.passPad, set: (v) => sky.setParams({ passPad: v }),
        fmt: (v) => (v < 0.001 ? 'off · v17 exact' : v.toFixed(3) + ' u  ·  avatar half-width 0.038') },
      { kind: 'note', text: 'Fly-through = collecting: the card dissolves as a portal and grants a speed boost. Detection is the sign change of the distance to the card plane — no solver (v17, S22).' },
      { kind: 'info', label: 'Card respawn gate (B6)', get: () => sky.respawnTor().text },
      { kind: 'slider', label: 'Card respawn distance', min: 0, max: 1.2, step: 0.02,
        get: () => sky.params.respawnDistanz, set: (v) => { sky.params.respawnDistanz = v; },
        fmt: (v) => (v < 0.02 ? 'off · clock only, the old behaviour' : v.toFixed(2) + ' u · portal armDistance is 0.38') },
      { kind: 'note', text: 'B6 from the critique: respawn on DISTANCE rather than on the clock. The clock alone has a fault you only see when flying slowly — stop or crawl after collecting, and 3.2 s later the replacement card is placed at a spot you are still looking at, appearing out of nothing in front of your nose. The principle was already built twice in this project: portal.js arms at 0.38 u (armDistance), and recycle right below only moves cards that lie BEHIND the player (Naht 5). Both rules now apply here too, and the clock stays as a FLOOR rather than the condition: the dissolve needs its 0.9 s, and without a floor a fly-through while standing still would refill instantly. The gate line reports how often the rule actually held a respawn back — a rule that changes nothing in the normal case has to be able to say when it did something.' },
      { kind: 'toggle', label: 'Kenney landmarks', get: () => marken.enabled,
        set: (on) => marken.setEnabled(on) },
      // v3 · S7b · Georgs Klassen. Die Streuung (trees, books, barrels) ist bewusst NICHT dabei:
      // „Bäume werden durchflogen" — und nichts tun ist die billigste, sicherste Umsetzung davon.
      { kind: 'toggle', label: 'Fly around buildings', get: () => kollision.params.on,
        set: (on) => kollision.setEnabled(on) },
      { kind: 'slider', label: 'Avoid swing', min: 0, max: 1.2, step: 0.05,
        get: () => kollision.params.swing, set: (v) => kollision.setParams({ swing: v }),
        fmt: (v) => (v < 0.03 ? 'off · fly through' : Math.round(v * 180 / Math.PI) + '° off course') },
      { kind: 'slider', label: 'Avoid lookahead', min: 0.3, max: 2.5, step: 0.1,
        get: () => kollision.params.lookahead, set: (v) => kollision.setParams({ lookahead: v }),
        fmt: (v) => v.toFixed(1) + ' u  ·  ' + (v / 0.28).toFixed(1) + ' s at cruise' },
      { kind: 'slider', label: 'Avoid margin', min: 1, max: 4, step: 0.1,
        get: () => kollision.params.margin, set: (v) => kollision.setParams({ margin: v }),
        fmt: (v) => v.toFixed(2) + '× model size' },
      { kind: 'button', label: 'Flip avoid direction',
        onClick: () => { kollision.setParams({ sign: -kollision.params.sign });
                         tonHinweis = 'Avoid direction ' + (kollision.params.sign > 0 ? '+' : '−');
                         tonHinweisT = 2.2; } },
      { kind: 'note', text: 'The avoidance is an ANGLE OFF the remembered course, not a course change: the runner servos to course + offset, and because the offset returns to 0 when clear, the same servo flies back onto the old course — net heading change after the manoeuvre is zero. Banking comes for free from carpet.js. If it swerves INTO buildings, flip the direction.' },
      { kind: 'slider', label: 'Signpost reaction: spin', min: 0, max: 14, step: 0.5,
        get: () => tuerme.params.reaktSpin, set: (v) => { tuerme.params.reaktSpin = v; },
        fmt: (v) => (v < 0.3 ? 'still' : v.toFixed(1) + ' rad/s') },
      { kind: 'slider', label: 'Props: base brightness', min: 0.1, max: 1.2, step: 0.02,
        get: () => marken.albedo, set: (v) => marken.setAlbedo(v),
        fmt: (v) => Math.round(v * 100) + ' %' + (v > 0.9 ? '  ·  GLB original' : '') },
      { kind: 'slider', label: 'Props: bend', min: 0, max: 1, step: 0.05,
        get: () => marken.deform, set: (v) => marken.setDeform(v),
        fmt: (v) => (v < 0.03 ? 'original shape' : Math.round(v * 100) + ' %') },
      { kind: 'slider', label: 'Props: breathing', min: 0, max: 0.09, step: 0.005,
        get: () => marken.breath, set: (v) => marken.setBreath(v),
        fmt: (v) => (v < 0.003 ? 'still' : Math.round(v * 1000) / 10 + ' %') },
      { kind: 'note', text: 'Clouds are the source version since v3c: additive blending, shading rim²·(0.3 + 0.7·upFactor). My NormalBlending was the reason they read grey instead of brightening.' },
      { kind: 'info', label: 'Props', get: () => marken.status },
      // ── v10 · EIN Maßstab pro Kit (Georg, 2.9.: „Felsen relativ zu Bäumen zu klein") ────────
      // Die Zeile sagt, wie viele Modelle kit-treu stehen, wie viele der Sichtbarkeitsboden
      // angehoben hat, wie viele Ausnahme mit Grund sind — und was sich gegen die alte Handtabelle
      // bewegt hat. Steht dort „WITHOUT kit factor", fehlt ein Pack in kit-massstab.js.
      { kind: 'info', label: 'Kit scale gate (v10)', tags: 'massstab scale felsen groesse kit proportion',
        get: () => (marken.kitTor ? marken.kitTor().text : '—') },
      // ── v10 · Rule of Three ────────────────────────────────────────────────────────────────
      { kind: 'toggle', label: 'Rock compositions (Rule of Three)', tags: 'felsen triade formation dreier',
        get: () => komposition.enabled, set: (on) => komposition.setEnabled(on) },
      { kind: 'info', label: 'Composition gate (v10)', tags: 'felsen triade formation dreier winkel',
        get: () => komposition.tor().text },
      // ── v11 · Flora ───────────────────────────────────────────────────────────────────
      { kind: 'toggle', label: 'Flora (KayKit trees, bushes, grass · Kenney stumps, mushrooms, flowers)', tags: 'flora baum busch gras stumpf pilz blume kaykit vegetation',
        get: () => flora.enabled, set: (on) => flora.setEnabled(on) },
      { kind: 'info', label: 'Flora gate (v11)', tags: 'flora baum busch gras stumpf pilz blume kaykit familie boden faktor',
        get: () => flora.tor().text },
      // ── v12 · Vegetation nach TS-Art ────────────────────────────────────────
      { kind: 'toggle', label: 'TS vegetation (procedural: conifers, broadleaf, bushes, grass, flowers)',
        tags: 'ts flora vegetation prozedural baum gras busch blume wind ao rim dichte',
        get: () => tsFlora.enabled, set: (on) => tsFlora.setEnabled(on) },
      { kind: 'slider', label: 'Wind', tags: 'ts flora wind sway bewegung', min: 0, max: 2.5, step: 0.05,
        get: () => tsFlora.wind, set: (v) => tsFlora.setWind(v) },
      { kind: 'info', label: 'TS vegetation gate (v12)', tags: 'ts flora vegetation tor dichte lichtung draw calls',
        get: () => tsFlora.tor().text },
      { kind: 'info', label: 'Wind per species (read from the uniforms)', tags: 'ts flora wind amp exp frequenz shader uniform',
        get: () => tsFlora.windZeile() },
      // ── v12 · Münzen ────────────────────────────────────────────────────────
      { kind: 'toggle', label: 'Golden coins (fly-through pickups, +1 Pop)', tags: 'muenze coin sammeln pop pickup gold',
        get: () => muenzen.enabled, set: (on) => muenzen.setEnabled(on) },
      { kind: 'info', label: 'Coin gate (v12)', tags: 'muenze coin sammeln pop radius respawn',
        get: () => muenzen.tor().text },
      { kind: 'note', text: 'Georg, 3.9.: the grey-brown castle and the grey-brown giant coin are out, and the coin comes back as what it is good at — a fly-through pickup worth +1 Pop. Timing is lifted from the source (Rings.ts): spawn ease 0.5 s with a 15 % overshoot, spin 1.8 rad/s about the surface normal, bob, respawn 1.5–2.5 s at a fresh site; the burst is RingCollectVFX.ts (12 additive shards, 0.55 s, damp 1/(1+t·0.85)). The pickup radius is NOT copied: the source holds 0.19 at its scale, which is ~0.05 at ours — 0.10 is the generous setting that was asked for. The chip that flies to the Pop counter is DOM, not 3D, on purpose: its target is a screen element, and a path computed in world space but ending at a screen point has two frames of reference and therefore one error per camera move.' },
      // ── v13 · Kondensstreifen ─────────────────────────────────────────────────
      { kind: 'toggle', label: 'Contrails (v13)', tags: 'contrail kondensstreifen streifen luft tempo',
        get: () => kondens.enabled, set: (on) => kondens.setEnabled(on) },
      { kind: 'info', label: 'Speedline gate (v13)', tags: 'contrail kondensstreifen speedline band punkte',
        get: () => kondens.tor().text },
      { kind: 'note', text: 'Georg, 3.9.: „beim bremsen sollten sie nicht als kleine kreise enden … und dann heller werden“ — and no, tinyskies does not have this problem: not because it is solved there, but because it cannot happen there. Its biplane has no brake and no hover, so pushing one point per frame never piles 72 additive quads on one spot. Ours does. The fix is keyed to ABSOLUTE speed (u/s), not speedRatio: cruise sits exactly on the speed floor 0.28 and is measured against max 0.78, so the ratio there is 0.00 — the same reading as standing still. A fade on the ratio would have deleted the speedlines from all normal flight and shown them only while holding W. The ramp 0.08–0.22 therefore sits BELOW the cruise floor: full stripes at cruise, retraction only on hover (H) and true stop.' },
      { kind: 'note', text: 'v13, first piece of TS-Delta stage A: Contrails.ts ported character-identical — 72 points per ribbon, icy tint, additive. Georg named what it actually is: comic speedlines, so they have to LEAVE the card. Four declared deviations. (1) The anchors are two Object3D inside the drawn card (it reports its own halfW/halfD), not numbers computed beside it — two earlier versions took their measurements from carpet-mesh.js, the vehicle mesh that is not drawn here, and left a visible gap. Reading the wrong source is not a wrong number. (2) A minimum step: a new point only appears once the anchor has actually travelled, otherwise the head is dragged along. Without it, braking piles 72 additive quads on one spot — a little dot that gets brighter every frame. The source never sees this because its biplane has no brake and no hover. (3) A speed fade plus retraction below the threshold: no movement, no speedlines. (4) No depth test (renderOrder 6): treetops and slopes were chopping the ribbons at flight altitude. Width 0.0034 and alpha gain 0.33 instead of the source\'s 0.005 / 0.55 — additive white over dark terrain reads louder than over bright sky. ?contrails=0 switches them off.' },
      // ── v12 · Schweben ──────────────────────────────────────────────────────
      { kind: 'info', label: 'Hover (H)', tags: 'schweben hover halten höhe pfeil arrow tempo lesen karten',
        get: () => (carpet.schwebt ? 'ON · offset ' + carpet.schwebeVersatz.toFixed(2) + ' u · ↑↓ to rise/sink'
                                   : 'off · H holds the carpet at its current altitude') },
      { kind: 'note', text: 'Our extension, not the source: tinyskies has no reason to hover, we do — 56 cards that are meant to be READ. H suspends the speed floor (0.28, the line that makes a carpet a carpet) instead of overwriting it, so the floor is still there when you leave; ↑/↓ then drive a manual altitude offset up to 1.2 u, which decays back to 0 when you fly on. W leaves hover, because throttle and hold exclude each other and a mode you can only leave with the key that started it is a trap.' },
      { kind: 'note', text: 'v12 builds the vegetation instead of loading it. Measured against the source, four of the five things that make its plants read as plants are BUILD properties, not model properties: ambient occlusion baked into the vertex colour (bottom dark, canopy interior dark), the shared Fresnel rim (rim-light.js, same file as the carpet), wind displaced by vertex height in the shader with a per-instance phase, and a simplex density field that decides where a forest is and where a clearing is. A bought GLB knows nothing about our sun, our rim colour or our wind — which is exactly why the KayKit pieces read as foreign bodies when scattered across the whole globe. TWO layers carried kit plants and only one of them was obvious: flora.js (v11, 7 families) and globe-landmarks.js (since v3, 1197 pieces — 206 tree_default, 163 tree_pineTallA, 97 tree_thin, 129 plant_bushDetailed, plus palms, flowers, cactus, all MeshLambert with a teal #499c91 foliage against the new #38623a). The first version of this note claimed the kits were gone while the second layer was still scattering; the picture disproved it at once. Whoever replaces a class has to look for ALL its sources, not the one in hand. Both are gated now: what stays is the stump with its mushrooms, the coastal palms, and the two surreal jokes whose point is SCALE not the model (mushroom at palm height, bamboo at tree height). Rocks, barrels, coins, crosses and buildings were never the problem — but they were touched anyway, by the SECOND half of the same lesson: taking entries out of a WEIGHTED set does not remove their slots, it redistributes them. STREU dropped to a single surviving entry and waehlen() handed rock_tallA all 720 scatter slots — 720 identical rocks where 90 stood before, one silhouette, exactly what line 41 of that file warns against. The slot budget now follows the set (scatter 720 → 90, surreal 40 → 27) and set and count are decided in one place. ?kits=1 restores the v11 area coverage on both layers for a side-by-side, ?tsflora=0 turns the new layer off. Cost measured, not guessed (render + readPixels sync, 20 passes at 924×540, camera at cruise): 0.76 ms for 18466 plants — down from 2.9 ms at 14954, because the layer now costs less while carrying more. Three things did it: no shadow pass (the second pass paid for the same 1.36M triangles again, and at 6 cm on a facetted ground there was no shadow anyone would miss), 408 spatial tiles with honest bounding spheres instead of one unculllable globe-wide mesh per variant, and a view distance that switches whole tiles off beyond the horizon and the whole layer above 1.30× radius. Wind 0 freezes the plants for screenshot proofs.' },
      { kind: 'note', text: 'v11: seven families, each a rider on the ONE scatter layer (streuen) with its own predicate — trees as triads (large tree · medium tree · bush, 0–2 mushroom/grass details) or single, bare trees on highland, bushes in heaps, grass/flowers/mushrooms in tufts, stumps with mushrooms at the foot. Sizes are kit-true; small families get ONE family floor (median lifted to 0.024, ratios kept, capped at 0.6 trees) instead of the per-model floor that flattened the size ladder (measured on the Flora test bench, 2 Sep). Rejected with reason: Bush_2_* (cubes), stump_oldTall (outlier). KayKit Forest FREE has no stumps/mushrooms/flowers — those are Kenney, scaled by their kit.' },
      // ── v11 · BUG-08 Palmenkrone: das Tor liest die gebackene Szene ─────────────────────
      { kind: 'info', label: 'Palm check (BUG-08)', tags: 'palme krone palm bug08 backface side',
        get: () => {
          const z = [];
          marken.group.traverse((o) => {
            if (!o.isInstancedMesh || !/^prop-palm/.test(o.name)) return;
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            const side = mats.map((m) => ['Front', 'Back', 'Double'][m.side]).join('/');
            const tri = (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3;
            z.push(o.name.replace(/^prop-/, '') + ': ' + o.count + '× · ' + tri + ' tri · side ' + side + (mats.some((m) => m.transparent) ? ' · transparent' : '') + (o.frustumCulled ? '' : ' · no culling'));
          });
          return z.length ? z.join(' ·· ') + ' — bench 2 Sep: all four palm glTFs are ONE part, DoubleSide at source, crown visible from below (docs/evidence/v11-bug08-palmen*.png). Backface hypothesis refuted; if a crown still vanishes in flight, note seed + place — the cause is in the scene, not in the model.' : '— no palms baked yet';
        } },
      { kind: 'note', text: 'Georg, 2.9.: the Rule of Three — one large piece for the silhouette, one medium to lead the eye, one small to anchor the group; never in a line, two close and one set apart; the medium pushed slightly into the large; density falling off exponentially from the parent. Where it sits in our architecture: between SITE and PROP. A site used to hold one model; now it holds a composition, and the composition is a rider like volcano and lighthouse — predicate (land, not steep) plus pieces in the local tangent frame, no own random. Two kinds per site, told apart by a MEASUREMENT (islands in the audit): a TRIAD of single stones from Georg’s size ladder (Quaternius and KayKit large, KayKit medium, KayKit small, Kenney pebbles as detail), or a FORMATION where the designer already built the group (KayKit Rock_1_K…Q, Rock_2_E…G) — that one stands alone. Numbers: medium at (rL+rM)·0.85, small at (rL+rS)·1.7 and 100–150° off, detail at rL·(1+Exp(λ1.2)) capped at 3·rL, every piece reads the ground at ITS spot and sinks 8 %. No h: anywhere — kit factor × raw, so a 3.6 m boulder next to a 0.5 m stone is large next to small by itself. The gate reads the smallest inner angle of each triangle: under 25° is “almost a line”, which the rule forbids.' },
      { kind: 'slider', label: 'Visibility floor (smallest prop)', min: 0.008, max: 0.05, step: 0.001,
        tags: 'boden mindesthoehe blume klein sichtbar',
        get: () => KIT_BODEN.mindestHoehe, set: (v) => { KIT_BODEN.mindestHoehe = v; },
        fmt: (v) => v.toFixed(3) + ' u  ·  applies on next reload' },
      { kind: 'note', text: 'One scale per kit, not one height per model. Measured on 2.9. against the proportions the kit designers built: the barrel was −44 % off the pirate kit, the castle +41 % off the hexagon kit, and inside kenney_nature-kit our factors spanned 9× — every hand-set height silently moved its neighbours. Now: meter kits (Kenney nature, KayKit, Quaternius, pirate, KFB) share ONE factor calibrated on tree_default, so a 4.6 m KayKit boulder next to a 24 cm Kenney flower is exactly that. Two kits are not in metres (hexagon = tile, graveyard = stylised) and keep their own factor. An explicit height is now an EXCEPTION with a written reason (the palm-high mushroom, the standing coin). Small things are not inflated one by one any more — a single visibility floor lifts them, and the gate counts how many. Rocks: every kit draws them at 30–40 % of tree height; rock_tallA is already Kenney’s biggest. Real boulders come from KayKit (to 4.6 m) and Quaternius (to 8.2 m) — that is what free combination buys, and what the Rule of Three needs for its primary piece.' },
      { kind: 'info', label: 'Rejected', get: () => {
        const r = marken.report();
        return r.imWasserVerworfen + ' in water · ' + r.zuSteil + ' too steep'; } },
      { kind: 'info', label: 'Plant set gate (Georg 1.9.)', get: () => marken.pflanzenTor().text },
      { kind: 'button', label: 'Print the plant readings',
        onClick: () => { const t = marken.pflanzenTor();
          console.info('[plants] ' + t.text + '\n  ' + t.zeilen.join('\n  ')); } },
      { kind: 'note', text: 'Georg, 1.9.: „dann würde ich beide bücher rausnehmen“. Both are gone, and the numbers say why the impression was right: the two books carried weight 14 and 8 of 59, so 37 % of every surreal prop in the world was a book — it was never one book that grated, it was its frequency. Their 22 points, plus 4 given up by palm-detailed-straight (12 → 8, or every third prop would be a palm), went to nine plants: three more palms, a cactus, three flowers, and two whose surrealism is the SCALE rather than the model (a mushroom as tall as a palm, a single bamboo stalk beside a standing coin). The set weight stays 59, so coin, barrel and cross keep the exact share they had — a swap that changes the total silently moves everything else with it. ⚠ These nine are NOT measured at the model, unlike the 29.8. selection: they come from asset-repo.json with a ghUrl and a pack that carries colour, and that is all that is verified. The gate line above reads triangles, coloured parts and height out of the BUILT scene rather than asserting them here.' },
      { kind: 'note', text: 'Scatter density follows the world LAND SHARE, not chance: on a water world (10 % land) about 210 props stand instead of 746 — on the land itself the density is the same. The land share is under Diagnostics.' },
      { kind: 'info', label: 'Build sites', get: () => (zonenAn
        ? zonenZahl + ' zones in the height field' : 'off (?zonen=0)') },
      { kind: 'info', label: 'Biome here', get: () => (biomHier
        ? biomHier.name + '  ·  ' + Math.round(biomHier.weight * 100) + ' %'
        : (biomStaerke > 0 ? 'measuring…' : 'off (?biom=0)')) },
      { kind: 'info', label: 'Biome change', get: () => (biomStaerke > 0
        ? biomZahlen.wechselJe60s + ' per 60 s cruise  ·  ' + biomZahlen.biomeAufDerKugel + ' of 4 on this world'
        : 'off (?biom=0)') },
      { kind: 'note', text: 'Biomes are MIXED, not switched: four anchor directions per seed, weights as a spherical softmax. Scale, persistence, ocean backbone, relief and roughness are blended per sample — the land/water THRESHOLD stays global, because terrainIsLand() has no position and a second height truth is the one bug this project keeps paying for. Rear exit: ?biom=0 · sharpness ?biomk=4.5.' },
      { kind: 'note', text: 'A build site is not a disc laid on top but a flattened patch INSIDE the height field — so flight physics, mesh, shadow and props all know it. Target height is the mean height of the patch; a tilt up to 10° stays.' },
      { kind: 'toggle', label: 'Sky dice', get: () => dice.params.visible,
        set: (on) => dice.setVisible(on) },
      { kind: 'slider', label: 'Dice size', min: 0.08, max: 0.5, step: 0.01,
        get: () => dice.params.size, set: (v) => dice.setParams({ size: v }),
        fmt: (v) => v.toFixed(2) + ' u' },
      { kind: 'info', label: 'Pop score', get: () => popPunkte + '  ·  ' + (dice.params.visible ? 'dice on' : 'dice off') },
      { kind: 'slider', label: 'Dice: hit window · scale', min: 1, max: 4, step: 0.1,
        get: () => dice.params.pickupRadius, set: (v) => dice.setParams({ pickupRadius: v }),
        fmt: (v) => (dice.params.size * v + dice.params.pickupPad).toFixed(3) + ' u radius' },
      { kind: 'slider', label: 'Dice: hit window · body pad', min: 0, max: 0.14, step: 0.005,
        get: () => dice.params.pickupPad, set: (v) => dice.setParams({ pickupPad: v }),
        fmt: (v) => (v < 0.001 ? 'off · relative only' : v.toFixed(3) + ' u  ·  avatar width 0.075') },
      { kind: 'button', label: 'Roll dice (K)',
        onClick: () => { dice.setVisible(true); dice.roll(1); } },
      { kind: 'info', label: 'Judge', get: () => {
        const r = dice.report();
        return dice.params.visible ? (r.wuerfel || '—') + ' · ' + (r.richter || '—') + '  ·  in frame ' + (r.sichtbar != null ? r.sichtbar : '?') + '/3' : 'aus'; } },
      { kind: 'note', text: 'Colour is the modifier, pips are the amount: red brakes, yellow runs the FX, blue boosts. Judgement belongs to the die facing the camera most directly — and because they spin, the office moves on its own.' },
    ] },
    { id: 'portal', title: 'Portal (Slice E)', rows: [
      { kind: 'toggle', label: 'Portals', get: () => portale.enabled,
        set: (on) => { portale.setEnabled(on); sagen(on ? 'Portals on' : 'Portals off'); } },
      { kind: 'slider', label: 'Portal count', min: 0, max: 5, step: 1,
        get: () => portale.params.anzahl, set: (v) => portale.setAnzahl(v),
        fmt: (v) => (v < 0.5 ? 'none' : (portale.anzahl < v
          ? v + ' asked · ' + portale.anzahl + ' placed (no room on this world)'
          : v + (v === 2 ? ' (source: 2)' : ''))) },
      { kind: 'slider', label: 'Jump distance (min)', min: 0.8, max: 2.9, step: 0.1,
        get: () => portale.params.sprungBogen, set: (v) => portale.setSprungBogen(v),
        fmt: (v) => Math.round(v * 180 / Math.PI) + '° across  ·  ' + (v >= 2 ? 'E-32' : '⚠ below E-32 (115°)') },
      { kind: 'slider', label: 'Hit window · factor', min: 0.5, max: 2.5, step: 0.05,
        get: () => portale.params.trefferFaktor, set: (v) => portale.setTrefferFaktor(v),
        fmt: (v) => (1.4667 * v).toFixed(2) + '× the visible oval  ·  '
          + portale.report().trefferSeitlich.toFixed(3) + ' u sideways, '
          + portale.report().trefferHoch.toFixed(3) + ' u vertically' },
      { kind: 'info', label: 'Nearest portal', get: () => {
        const n = portale.naechstes(carpet.worldPos());
        if (!n) return 'none on this world';
        return Math.round(n.bogen * 180 / Math.PI) + '° away  ·  '
          + (n.portal.i === 0 ? 'cyan' : 'orange') + '  ·  '
          + (n.portal.pos.distanceTo(carpet.worldPos())).toFixed(2) + ' u straight line'; } },
      { kind: 'info', label: 'Jumps', get: () => {
        const r = portale.report();
        return r.spruenge + ' · last ' + (r.letzterSprungGrad != null ? r.letzterSprungGrad + '°' : '—')
          + ' · arrival AGL ' + r.letzteAnkunftAgl.toFixed(3) + ' u'
          + (r.abkuehlung > 0 ? ' · cooling ' + r.abkuehlung + ' s' : ''); } },
      { kind: 'seg', label: 'Portal image', options: [{ v: 'ring', l: 'Ring · portal' }, { v: 'riss', l: 'Rift · world transition' }],
        get: () => portale.params.bild, set: (v) => { portale.setBild(v);
          sagen(v === 'riss' ? 'Rift image · that is the transition to other worlds' : 'Ring image · portal within this world'); } },
      { kind: 'slider', label: 'Portal size', min: 0.8, max: 6, step: 0.1,
        get: () => portale.params.skala, set: (v) => portale.setSkala(v),
        // ⚠ **Diese Beschriftung hat zweimal gelogen, und beide Male in dieselbe Richtung: zu
        // klein.** (a) Sie rechnete `radius × 2 × ovalX` und ließ die **Röhre** weg — gezeichnet ist
        // aber `(radius + tube)`, bei skala 2,6 also 0,58 u statt der angezeigten 0,51 u (+15 %).
        // (b) Sie rechnete IMMER den Ring, auch wenn das Bild der **Riss** ist — und der ist
        // `×1,25 × 1,25 × 1,5` = **2,34×** größer. Wer auf Riss schaltet, liest also ein Etikett,
        // das um mehr als das Doppelte danebenliegt.
        // Eine Bezugsgröße, die die eigene Rolle nicht kennt, ist keine Bezugsgröße. Jetzt fragt
        // sie das Modul nach dem GEZEICHNETEN Maß der AKTIVEN Rolle.
        fmt: (v) => { const s = portale.sichtbar(v);
          return s.breite.toFixed(2) + ' u wide · ' + s.hoehe.toFixed(2) + ' u tall · '
            + (s.breite / 0.35).toFixed(1) + '× the carpet · ' + s.rolle
            + (Math.abs(v - 1.3) < 0.06 ? '  ·  pinned source' : ''); } },
      { kind: 'slider', label: 'Portal breath', min: 0, max: 0.06, step: 0.002,
        get: () => portale.params.zappel, set: (v) => portale.setZappel(v),
        fmt: (v) => (v < 0.001 ? 'rigid oval (way back)' : 'zappel ' + v.toFixed(3) + ' · warps like tinyskies (Georg 1.9.: source rebuild)') },
      // v8 · Meckertronic Schritt 1 — Station, kein Fahrzeug. Größe ist Georgs Entscheidung.
      { kind: 'info', label: 'Mech station gate (v8)', get: () => mechStation.tor().text },
      { kind: 'slider', label: 'Mech size (× the drawn card)', min: 0.4, max: 4, step: 0.05,
        get: () => mechStation.params.faktor, set: (v) => mechStation.setFaktor(v),
        fmt: (v) => v.toFixed(2) + '× card  ·  ' + (v * CARD_WELT).toFixed(3) + ' u'
                    + (Math.abs(v - 4.27) < 0.06 ? '  ·  the v8 size Georg called too big' : '') },
      { kind: 'note', text: 'v9, measured after Georg’s screenshot: the mech was scaled against the figure height 0.15 u — but that number comes from walk-messung (ground error, horizon), it is not what is drawn. What is drawn is the card at 0.075 u wide with the pet standing on it, so the v8 mech stood 4.27 card-widths tall. The slider is now in the unit you see: multiples of the card. Default 1.3×.' },
      { kind: 'button', label: 'Size step: 1.0× → 1.3× → 1.8× → 2.5× (decide by eye)',
        onClick: () => { const f = mechStation.groesseWeiter(); sagen('Mech size ' + f.toFixed(1) + '× the card'); } },
      { kind: 'button', label: 'Next mech (roster of 5)', onClick: () => mechStation.naechster() },
      // v9 · Die v8-Schuld, bezahlt: Füße auf dem gebackenen Netz statt auf der Höhenfunktion.
      { kind: 'info', label: 'Foot reading gate (v9 · mesh)', get: () => mechStation.bodenTor().text },
      { kind: 'toggle', label: 'Read feet off the baked mesh', get: () => mechStation.params.boden,
        set: (on) => mechStation.setBoden(on) },
      { kind: 'toggle', label: 'Mech mode — ride the skin (V)', get: () => mechFahrt,
        set: (on) => mechModus(on) },
      { kind: 'slider', label: 'Mech stride (m per walk cycle)', min: 0.05, max: 0.5, step: 0.01,
        get: () => mechStation.params.schrittLaenge,
        set: (v) => { mechStation.params.schrittLaenge = v; },
        fmt: (v) => v.toFixed(2) + ' u · timeScale = speed/stride' },
      { kind: 'note', text: 'v9 · The mech stands on the mesh you can see, not on surfaceAltitudeAt (Measurement 1: that function is off by up to 17.5 % of figure height). Built as a raycast first and MEASURED at 8–21 ms per ray — 130 560 triangles, no BVH — so it was rebuilt: SphereGeometry is a regular (W+1)×(H+1) grid, so the cell under the mech is computed rather than searched, then bilinear between four vertex radii. The instrument prints 0.1 ms per frame for it, and that IS the resolution floor of performance.now() in this browser — so 0.1 ms is the upper bound, not the value. Two orders of magnitude under the ray either way. The ray stayed as the control inside the gate: the cheap reader is checked by the expensive one, not by my comment. The carrier still owns WHERE the mech is (carpet.js is the one mover) — the reading only owns HOW HIGH.' },
      { kind: 'note', text: 'E-43: the mech is a SKIN on the invisible vehicle — carpet.js stays the one mover; V swaps visuals and three carpet params (hover 0, boost 0.02, bank 0.12), restored on exit. Known debt: surfaceAltitudeAt sinks feet up to 17.5 % (measurement 1) — raycast is the NEXT step.' },
      { kind: 'info', label: 'Portal shape gate (Georg 1.9.)', get: () => portale.formTor().text },
      { kind: 'note', text: 'Georg, 1.9.: „die portale skalieren nicht korrekt.“ Read off the running frame rather than guessed: the oval group stood at (0.669 · 1.264) against its nominal (0.65 · 1.25), and the deviation was not fixed — it travelled. Cause: two ABSOLUTE offsets of 0.02 on two axes at two different frequencies (12.0 and 15.0 rad/s). The same 0.02 is ±3.1 % on x but only ±1.6 % on y, and the beat of the two frequencies has a period of 2.1 s — so the oval held neither its size nor its aspect ratio, permanently, because both offsets sat OUTSIDE the spawn-wobble decay. Worse than the wobble: the hit ellipse computes from the CONSTANTS 0.65/1.25, so image and catch area drifted apart by up to 3 % with a wandering difference — you did not quite hit what you saw, and never by the same amount twice. Fixed as ONE relative factor on BOTH axes: same amplitude x had before, shape preserved. A named deviation from the source per §05q, and the gate line above measures the shape instead of asserting it.' },
      { kind: 'slider', label: 'Portal core glow', min: 0, max: 1.2, step: 0.05,
        get: () => portale.params.kernGlut, set: (v) => portale.setKernGlut(v),
        fmt: (v) => (v < 0.03 ? 'dark core · pinned source tree' : Math.round(v * 100) + ' % · luminous, as in the live game') },
      { kind: 'toggle', label: 'Portals only on land', get: () => portale.params.nurLand,
        set: (on) => { portale.setNurLand(on);
          sagen(on ? 'Portals avoid water — the source rule' : 'Portals prefer land, water allowed (Georg, 1.9.)'); } },
      { kind: 'note', text: 'Georg, 1.9.: „im wasser kann auch ein portal sein.“ That is PERMISSION, and the first attempt turned it into a second absolute: the land test was deleted outright. Measured in the loaded world, land is 15.9 % of the surface (10 502 of 66 049 vertices), so the expected number of portals on land is 0.64 of 4 and the chance that NONE stands on land is 0.841⁴ = 50 % — live, all four stood in open ocean. „Can also be in the water“ had become „is always in the water“. A permission is not the inversion of a rule, it is giving up its unconditionality. So it is a PREFERENCE now, built the way this module already works for the 1.2 rad separation: the first 350 of 500 attempts insist on land, the rest accept water. On a land-rich world the portals stand as before; on an ocean world they come into being at all instead of going missing. ⚠ And one asymmetry that has to be said out loud: the jump DESTINATION is still strictly land-only. You can fly into a portal standing in the sea, but you always come out on land — a portal is a structure and may stand in water, an arrival is a place where you find yourself. If arrival in water is wanted too, that is one line.' },
      { kind: 'toggle', label: 'Portal halo', get: () => portale.params.halo,
        set: (on) => { portale.setHalo(on); } },
      { kind: 'note', text: 'Georg, 30.8., after seeing the live game: „wir können portal erstmal innerhalb einer Welt denken · risse dann zu anderen welten/decks“ — so the two images are two ROLES, not two styles. Ring = the portal you fly through to reach the far side of THIS globe (E-32). Rift = the way to another world or deck; the image is built and measured, the mechanic behind it is its own slice (in the source it is the void entry, Game.ts → enterVoidPlaneFlight). A rift shown as a portal would promise the wrong thing.' },
      { kind: 'note', text: 'The soft outer shine is a camera-facing sprite, not a post-processing pass — measured: there is no bloom pass anywhere in the source (no EffectComposer), and two of its files say so in their own comments („simulates bloom without a post-processing pass“). The core glow slider is the one line that is NOT in the pinned tree: at 0 you get 2659a5cc987d (dark core), at 75 % the luminous interior of the deployed game, which is newer than our pin.' },
      { kind: 'info', label: 'Portal gate (source geometry)', get: () => portale.tor().text },
      { kind: 'info', label: 'Portal glare (additive sum)', get: () => portale.strahlung().text },
      { kind: 'info', label: 'Portal hit self-test', get: () => portale.selbsttest(camera).join('  ·  ') },
      { kind: 'note', text: 'Two source files, and since the images became two ROLES the placement follows the image: a RING stands clear of the ground (placePortal: max(hover, half oval height + 0.02) — „ensure the portal’s bottom edge clears the ground“), a RIFT grows out of it (pickWorldPose: hover + 0.22). Sector, land-only and the 1.2 rad minimum separation come from CosmicWorldPortal either way, the cooldown and the 1.47× hit promise from CarpetPortalSystem. That promise is an ELLIPSE on the visible half-axes, not a disc: 1.47× sideways and 1.47× vertically, so it holds against what you SEE at any size. The source calls it „forgiving teleports“ — the reason a portal reads as an invitation instead of a needle.' },
      { kind: 'note', text: 'E-32: flying through jumps to the FAR side of the SAME globe (≥ 115°), no world change, no loading screen. Two seams are ours and both are measured above: the destination is a PLACE, not a second portal (so the arrival height is ground + hover + the AGL you came in with, capped), and your course number is kept — the world changes, not your intent.' },
      { kind: 'toggle', label: 'Signposts point (Slice E · part 2)', get: () => tuerme.params.zeigen,
        set: (on) => { tuerme.params.zeigen = !!on; sagen(on ? 'Signposts are pointing' : 'Signposts free again'); } },
      { kind: 'slider', label: 'Signpost servo', min: 0.2, max: 6, step: 0.1,
        get: () => tuerme.params.aimSmooth, set: (v) => { tuerme.params.aimSmooth = v; },
        fmt: (v) => v.toFixed(1) + '/s  ·  ' + (v > 3.5 ? 'snappy, may jitter' : 'readable') },
      { kind: 'slider', label: 'Signpost glow', min: 0, max: 1, step: 0.02,
        get: () => tuerme.params.glow, set: (v) => { tuerme.params.glow = v; },
        fmt: (v) => (v < 0.02 ? 'off' : Math.round(v * 100) + ' % emissive, ' + tuerme.params.glowHz.toFixed(2) + ' Hz') },
      { kind: 'slider', label: 'Signpost glow rim', min: 0.02, max: 1, step: 0.02,
        get: () => tuerme.params.randBreite, set: (v) => tuerme.setRandBreite(v),
        fmt: (v) => (v > 0.98 ? 'whole card — the 1.9. finding' : (v * 100).toFixed(0) + ' % rim · ' + ((1 - v) * (1 - v) * 100).toFixed(0) + ' % stays artwork') },
      { kind: 'info', label: 'Signpost artwork gate (Georg 1.9.)', get: () => tuerme.motivTor().text },
      { kind: 'note', text: 'Georg, 1.9.: „die wegweiser sind relativ stumpf einfach in der farbe eingefärbt, so dass man die karten selber gar nicht erkennen kann — das ganze konstrukt ist dann einfarbig, was fast wie ein fehler aussieht.“ It was one, and not in the artwork: the E-35 pulse wrote its target colour as emissive across the WHOLE sheet (glow 0.42 at saturation 0.85). A flat emissive ADDS on top of the texture, so at 0.42 in a saturated hue it paints over the motif — the darker the card, the more completely. The motif was never missing; it lay underneath the colour. Georg’s call: glow as a rim only. Done as a shader mask on the existing material (emissive × distance to the sheet edge) rather than a second rim mesh — zero extra draw calls instead of 32. The mask reads position.xy, not the UVs: the hand-built sheet carries two layers with MIRRORED u, and `uv` is only declared in the vertex shader when the material has a texture, so a card still waiting for artwork would have broken the shader.' },
      { kind: 'info', label: 'Signpost gate (E-34/E-35)', get: () => tuerme.weiserTor().text },
      { kind: 'info', label: 'Signpost recoil gate (A5)', get: () => tuerme.reaktTor().text },
      { kind: 'button', label: 'Knock a signpost (measure the recoil)',
        onClick: () => { const a = tuerme.sites(); if (!a.length) return;
          tuerme.reaktTor(true); tuerme.hit(a[0].site, 1);
          sagen('Signpost knocked — watch the recoil gate'); } },
      { kind: 'note', text: 'A5 from the critique read „clamp reaktSpin to ≤ 25° · the way back is built, only the total angle is missing.“ The way back was NOT built. Measured on 1.9. by firing one hit and stepping 7 s in 60 Hz slices: the sign swung 150.9° and then stayed there. The arithmetic is one line — a damped spin with no spring runs ∫v₀·e^(−λt)dt = v₀/λ = 7.0/2.6 = 154.3°, and the measurement lands 2 % under it, so the model holds. `yaw` was integrated and never taken back, and since the aiming servo writes q0 while yaw multiplies ON TOP, a signpost that had been brushed once pointed 151° off its target forever. Worse than the bug: right after that hit the old gate line still said „servo lag Ø 0.0°, max 0.0°“ — it measures the servo’s own deviation from aimYaw, and the recoil sits behind the servo. An instrument that only checks the path it computes itself confirms itself instead of testing. Now two numbers own two jobs: the clamp owns the ANGLE (25°), the spring owns the RETURN (0.45 s), and the gate above measures the residual after the envelope has run out.' },
      { kind: 'button', label: 'Flash all signposts (glow wirker)',
        onClick: () => { tuerme.glowBurst(null, 1.2); } },
      { kind: 'note', text: 'E-35: two kinds of signpost, told apart by COLOUR while the shape stays the same — portal signposts pulse in their target portal’s colour (cyan/orange, owned by PORTAL_COLORS), card signposts run a slow rainbow. The pulse belongs to the sign; the FLASH belongs to the score (glow wirker, fired by signpost.hit). Measured caveat in the gate line: cards live in a ring around the player, so a card signpost points at something that travels with you — only the portal signposts are a real direction across the world.' },
    ] },
    { id: 'gegner', title: 'Enemies (Slice E2)', rows: [
      { kind: 'toggle', label: 'Enemies', get: () => gegner.enabled,
        set: (on) => { gegner.setEnabled(on); sagen(on ? 'Enemies on' : 'Enemies off'); } },
      { kind: 'seg', label: 'Enemy altitude band', options: [{ v: 'reiselinie', l: 'Over ground' }, { v: 'quelle', l: 'Source · absolute' }],
        get: () => gegner.params.bandModus, set: (v) => { gegner.params.bandModus = v;
          sagen(v === 'quelle' ? 'Source band 0.52…0.65 · 17× the cruise height' : 'Band over ground · on your line'); } },
      { kind: 'slider', label: 'Aim assist · cone', min: 0, max: 25, step: 1,
        get: () => gegner.params.zielhilfeGrad, set: (v) => { gegner.params.zielhilfeGrad = v; },
        fmt: (v) => (v < 0.5 ? 'off · raw nose ray' : v + '° half-angle within '
          + gegner.params.zielhilfeWeite.toFixed(1) + ' u') },
      { kind: 'slider', label: 'Hit sphere · factor', min: 0.5, max: 3, step: 0.05,
        get: () => gegner.params.trefferFaktor, set: (v) => { gegner.params.trefferFaktor = v; },
        fmt: (v) => (0.16 * v).toFixed(3) + ' u  ·  ' + (Math.abs(v - 1) < 0.03 ? 'source' : (v).toFixed(2) + '× source') },
      { kind: 'info', label: 'Enemies', get: () => gegner.status },
      { kind: 'info', label: 'Score', get: () => {
        const r = gegner.report();
        return r.treffer + ' hits · ' + r.abschuesse + ' down · ' + r.respawns + ' respawned · '
          + r.jagend + '/' + r.lebend + ' chasing · ' + r.zielhilfe + ' shots bent by aim assist'; } },
      { kind: 'info', label: 'Nearest enemy', get: () => {
        const n = gegner.naechster(carpet.worldPos());
        return n ? n.gegner.def.name + ' · ' + n.abstand.toFixed(2) + ' u · '
          + n.gegner.leben + '/3 hp' + (n.gegner.jagt ? ' · chasing you' : ' · patrolling') : '—'; } },
      { kind: 'info', label: 'Enemy gate (SkyGremlins.ts)', get: () => gegner.tor(camera).text },
      { kind: 'note', text: 'Georg, 30.8.: „nur Ziele jetzt, gefährlich als späterer Aufsatz auf denselben Treffer-Vertrag“. So this is a CONTRACT, not a feature: hp, state, world position and the two callbacks (onTreffer / onAbschuss) are all in place, and the only thing „dangerous“ adds is a second reader — the enemy shooting back. The numbers are SkyGremlins.ts verbatim (band 0.52–0.65, ground clearance 0.20, cruise 0.34, chase 0.50, standoff 0.92/1.15/1.45, orbit weight 0.92, 3 hits, fall 0.8 s, respawn 13–19 s, spawn at least 2.5 u away). Its firing constants are quoted in the file head so the later slice copies them instead of inventing them.' },
      { kind: 'note', text: 'Georg, 31.8.: „die gegner fliegen zu hoch, sie sind oft nur oben kurz im schnitt zu sehen“ — and the fix shows that only the CLAMP was wrong, not the maths. The source places an enemy at ground + 0.20 + rnd·0.18 (relative, correct) and then clamps the result into an ABSOLUTE band 0.52…0.65 — which happens to be exactly our carpet’s boostHeight, the altitude you only reach holding ↑. While chasing, the source even computes playerAlt ± 0.18, i.e. eye level, and the clamp lifts it back to 0.52. The intent lives in the maths, not in the clamp: the band is now the source’s own spread, measured over ground. Switch above to see the absolute version.' },
      { kind: 'note', text: 'Two seams of ours: the enemies are animated GLB models (Quaternius monsters, one AnimationMixer per copy via SkeletonUtils.clone — a plain clone would share the skeleton and they would all dance in lockstep), and the aim assist is new (the source spreads its shots instead of helping). It bends the direction ONCE at the shot, never the projectile in flight and never the hit test — a helper that steers mid-flight takes the shot away from you.' },
    ] },
    { id: 'look', title: 'Pet look', rows: [
      { kind: 'info', label: 'Surface', get: () => petOberflaeche },
      // ── v10 · Georg, 2.9.: "die untere Hälfte versuppt im Schatten" ────────────────
      // Die Zeile beantwortet die Frage, die ich sonst geraten hätte: unter welchem Winkel
      // steht das Gegenlicht über dem LOKALEN Horizont. Vorher war diese Zahl an jedem Ort
      // der Welt eine andere — der Versatz stand im Weltraum, "oben" ist auf einer Kugel aber
      // ortsabhängig. Bleibt die Zahl beim Fliegen konstant, hält der lokale Rahmen.
      { kind: 'info', label: 'Fill light angle (2.9. bug)', tags: 'shadow unterseite dunkel licht',
        get: () => (lighting.fillTor ? lighting.fillTor(carrierState.position).text : '—') },
      { kind: 'note', text: 'Georg, 3.9.: „nicht nur bei nacht liegt die untere pet-region (mit dem wichtigen mund später) etwas zu stark im schatten“ — the bounce light for exactly this already exists since 2.9. and sits at `hoch: −0.32`, i.e. below the local horizon; the gate above reads the angle. So this is not a missing light, it is two knobs: the slider below steepens the bounce, „Back light (cold)“ raises its intensity (0.55 today). Worth knowing before turning them up: in the SOURCE nothing lifts the muzzle either — its `playerLight` sits 0.15 ABOVE the player, so it lights the top of the head, and its fill/back lights are placed in WORLD space at 60 u, which on a globe means their direction relative to the pet changes with where you fly. A preset value cannot fix that, only a light that lives in the vehicle’s local frame can — which is what this one does.' },
      { kind: 'slider', label: 'Fill light: from below', min: -1, max: 0.6, step: 0.02,
        tags: 'unterseite shadow bounce licht',
        get: () => (lighting.fillLokal ? lighting.fillLokal.hoch : 0),
        set: (v) => { if (lighting.fillLokal) lighting.fillLokal.hoch = v; },
        fmt: (v) => (v < 0 ? v.toFixed(2) + '  ·  below' : v.toFixed(2) + '  ·  ⚠ above (doubles the sun)') },
      { kind: 'slider', label: 'Fill light: to the side', min: 0, max: 1.2, step: 0.02,
        tags: 'seite licht',
        get: () => (lighting.fillLokal ? lighting.fillLokal.seite : 0),
        set: (v) => { if (lighting.fillLokal) lighting.fillLokal.seite = v; },
        fmt: (v) => v.toFixed(2) },
      { kind: 'note', text: 'Nothing changed on 2.9. — the fill light was always like this, just '
        + 'differently per place. Its offset was written in WORLD space (−26, 22, −18), but on a '
        + 'sphere "up" is position.normalize(): the same offset stands high above the horizon at one '
        + 'spot and grazes it at another. A cartoon two-light whose second angle depends on where '
        + 'you are is not a two-light, it is a coincidence. It is now built in the LOCAL frame, and '
        + 'deliberately from BELOW — like a ground bounce, lifting the chin and the underside '
        + 'instead of the top of the head, which already has sun.' },
      { kind: 'slider', label: 'Sky light (environment)', min: 0, max: 2, step: 0.05,
        get: () => lighting.params.env, set: (v) => lighting.setEnv(v),
        fmt: (v) => (v < 0.03 ? 'aus' : v.toFixed(2) + '×') },
      { kind: 'slider', label: 'Back light (cold)', min: 0, max: 1.6, step: 0.05,
        get: () => lighting.params.fill, set: (v) => lighting.setFill(v),
        fmt: (v) => (v < 0.03 ? 'aus' : v.toFixed(2)) },
      { kind: 'toggle', label: 'Cartoon inertia (body lags the flight)', tags: 'deform squash cartoon traegheit',
        get: () => traegheit.on, set: (v) => traegheit.setOn(v) },
      { kind: 'slider', label: 'Inertia: how slowly the body catches up', min: 1.5, max: 14, step: 0.5,
        tags: 'deform traegheit',
        get: () => traegheit.limits.rate, set: (v) => traegheit.setLimits({ rate: v }),
        fmt: (v) => v.toFixed(1) + '/s' + (v > 11 ? '  ·  almost rigid' : (v < 3.5 ? '  ·  very loose' : '')) },
      { kind: 'slider', label: 'Inertia: amount', min: 0, max: 1, step: 0.05,
        tags: 'deform traegheit mix',
        get: () => traegheit.mixWert, set: (v) => traegheit.setMix(v),
        fmt: (v) => (v < 0.03 ? 'off · original shape' : (v * 100).toFixed(0) + ' %') },
      { kind: 'info', label: 'Cartoon inertia gate', tags: 'deform squash segmente',
        get: () => traegheit.tor().text },
      { kind: 'note', text: 'Georg, 3.9.: „das pet kippt nur bei banking, beschleunigung etc → es gibt scheinbar noch kein cartoon-deforming, das träge der flug-physik folgt“ — the deformer existed (`kfb-cartoon-deform.js`: bend, lean, taper, twist, volume-preserving squash, numerically corrected normals); what was missing was the DRIVE. It is not an added wobble: the deformation IS the gap between what the vehicle is doing and what the body has caught up with, so at constant speed the gap is zero and the pet is undeformed — no idle jitter. Two things had to be built rather than reused. First, the prop deformer bakes every sub-geometry into the root and re-parents it, which a tree survives and a PET does not: ears, tail and eyes are nodes that the rig moves every frame, and after re-parenting the rig would drive baked, reset nodes — the pet would stand still and nobody would get an error. So the same maths runs in ROOT SPACE via per-mesh matrices instead, hierarchy untouched, matrices refreshed per frame (a wagging ear bends in the same frame as the body). Second, its own §5 caveat is honest: only a mesh with vertical subdivision bends, below four height rings it shears — the gate above counts the rings and says whether you are getting a bend or the source’s lean-plus-taper fallback. And Georg’s architecture instinct is right: limits belong to the BODY (a mech must not wobble like a rubber pet), the drive belongs to the flight sim and is shared — one drive, four limit sets, which is how the four mech models should bring theirs.' },
      { kind: 'slider', label: 'World tint in the pet', min: 0, max: 0.4, step: 0.01,        get: () => lighting.tintAmount, set: (v) => lighting.setTint(null, v),
        fmt: (v) => (v < 0.005 ? 'aus' : Math.round(v * 100) + ' %') },
      { kind: 'note', text: 'Cube-pet edges stay round as long as nobody facets them — Kenney’s normals remain.' },
    ] },
    { id: 'klang', title: 'Sound', open: true, rows: [
      { kind: 'toggle', label: 'Sound', get: () => audio.enabled,
        set: (on) => { audio.setEnabled(on); sagen(on ? 'Sound on' : 'Sound off'); } },
      { kind: 'seg', label: 'Engine', options: [{ v: 'kfb', l: 'KFB (v17)' }, { v: 'tiny', l: 'tinyskies' }],
        get: () => audio.engine, set: (v) => { audio.setEngine(v); sagen('Motor: ' + v); } },
      { kind: 'button', label: 'Next track',
        onClick: () => { const t = audio.nextTrack(); sagen(t ? 'Track: ' + t : 'no track'); } },
      { kind: 'toggle', label: 'Narrator (reflexes)', get: () => narrator.enabled,
        set: (on) => narrator.setEnabled(on) },
      { kind: 'info', label: 'Status', get: () => audio.label },
    ] },
    // ── v7 · Fahrzeug-Vertrag + Walk-Vorbereitung ────────────────────────────────────────────
    // **Kein Sichteffekt, und das ist der Punkt.** Der Vertrag ist heute kostenlos (ein
    // Fahrzeug) und ab dem zweiten eine Umbaustelle in acht Modulen. Was hier steht, ist
    // deshalb kein Feature, sondern ein WÄCHTER: er liest die Maße aus dem Rig und die
    // Schräglage aus der Physik und vergleicht sie mit den Zusagen. Dreht jemand `maxBank`
    // oder den Kartenmaßstab, fällt diese Zeile durch — genau dafür ist sie da.
    //
    // Die zwei Messungen daneben sind die Vorbedingung aus LIVING §05v. Sie laufen auf
    // KNOPFDRUCK: 48 Strahlen auf 131 072 Dreiecke gehören nicht in einen Frame-Loop.
    { id: 'fahrzeug', title: 'Vehicle contract & walk prep (E-43)', rows: [
      { kind: 'info', label: 'Vehicle', get: () => FAHRZEUG_KARTE.name + '  ·  ' + FAHRZEUG_KARTE.mesh
          + '  ·  ' + Object.keys(FAHRZEUG_KARTE.features).filter((k) => FAHRZEUG_KARTE.features[k] === true).join(', ') },
      { kind: 'info', label: 'Vehicle contract gate', get: () => vertragTor(fahrzeugIst()).text },
      { kind: 'info', label: 'Contract detail', get: () => vertragTor(fahrzeugIst()).zeilen.join('   ') },
      { kind: 'note', text: 'Georg, 30.8.: „nur Skins (erstmal, später ggf. Ausbau nach tinyskies für Boot etc.)“ — so a vehicle is a MESH plus an FX flavour plus limits, never a second flight model. Five fields (sitz · rumpf · wakeUrsprung · neigungsgrenzen · fx) plus a features table, which is the shape tinyskies calls vehicleFeatures in Game.ts; our backlog described it independently, so it is corroborated, not copied. The gate also counts FORBIDDEN names (tempo, turnMult, hoverHeight, traction …): a contract that only says what is allowed gets hollowed out by extensions, one that counts prohibitions reports the extension.' },
      { kind: 'note', text: 'One field is a named seam, not a finished reader: wakeUrsprung says „mitte“ because that is where spray and drift dust are born today (carpet-wake.fahnen reads qPosition). For the card that is right; for a boat with an outboard it is wrong. The field exists so the second vehicle finds a place to write instead of eight modules to patch — and it changes no behaviour today.' },
      { kind: 'info', label: 'Walk draft (E-43, not built)', get: () => {
          const o = ENTWURF_LAEUFER;
          return 'mesh ' + (o.mesh || 'not indexed') + '  ·  ' + o.schrittTiming
            + '  ·  open: ' + o.offeneMessungen.join(', '); } },
      { kind: 'button', label: 'Measure 1: ground height — mesh vs function (48 rays)',
        onClick: () => {
          bodenBefund = bodenMessung({ THREE, mesh: globe.mesh, seed, terrainType,
                                       radius: GLOBE_RADIUS, segmente: globe.segments,
                                       figur: 0.15 });
          console.info('[walk-messung] ' + bodenBefund.text);
          for (const z of bodenBefund.zeilen) console.info('[walk-messung]   ' + z);
        } },
      { kind: 'info', label: 'Measurement 1 · ground', get: () => (bodenBefund ? bodenBefund.text : '— press the button (never runs per frame)') },
      { kind: 'info', label: 'Measurement 1 · detail', get: () => (bodenBefund ? bodenBefund.zeilen.join('   ') : '—') },
      { kind: 'note', text: 'Why this is measured and not reasoned: surfaceAltitudeAt is continuous, the mesh is FLAT between vertices (flatShading — the facets ARE the look). At hover height 0.03 the difference is invisible; with feet on the ground the reference is the figure, and anything above ~5 % of its height reads as wading or floating. The instrument shoots at the real triangles and puts both numbers side by side, including the SIGN — function above mesh means the feet sink, mesh above function means they float.' },
      { kind: 'button', label: 'Measure 2: scale — horizon and lap time',
        onClick: () => {
          massBefund = massstabMessung({ radius: GLOBE_RADIUS, figur: 0.15,
                                        reise: CARPET_CRUISE_SPEED, spitze: carpet.maxSpeed });
          console.info('[walk-messung] ' + massBefund.text);
          for (const z of massBefund.zeilen) console.info('[walk-messung]   ' + z);
        } },
      { kind: 'info', label: 'Measurement 2 · scale', get: () => (massBefund ? massBefund.text : '— press the button') },
      { kind: 'info', label: 'Measurement 2 · levers', get: () => (massBefund ? massBefund.zeilen.join('   ') : '—') },
      { kind: 'note', text: 'Measurement 2 deliberately has no ✓/✗. Horizon √(2·r·h) and lap time 2πr/v are formulas, but which lever to pull — bigger world, smaller figure, tighter camera — is a design decision, and it belongs to Georg (Onboarding §5.7). An instrument that prints a design question as „failed“ decides it quietly. The walk speed is derived from BODY SIZE rather than guessed: a human at 1.7 m walks 1.4 m/s = 0.82 body heights per second, applied to our 0.15 u figure.' },
    ] },
    { id: 'karte', title: 'Card', rows: [
      { kind: 'slider', label: 'Ink outline', min: 0, max: 18, step: 0.5,
        get: () => carrier.ink.width, set: (v) => carrier.setInk({ width: v }),
        fmt: (v) => (v === 0 ? 'aus' : v.toFixed(1) + ' px') },
      { kind: 'slider', label: 'Stroke wobble', min: 0, max: 1, step: 0.05,
        get: () => carrier.ink.wobble, set: (v) => carrier.setInk({ wobble: v }),
        fmt: (v) => Math.round(v * 100) + ' %' },
      { kind: 'info', label: 'Source', get: () => kartenQuelle },
      { kind: 'note', text: 'One edge, not two: the ink of the card back IS the border.' },
    ] },
    { id: 'tasten', title: 'Controls', rows: [
      { kind: 'keys', pairs: [['W / S', 'throttle · brake'], ['A / D', 'heading'], ['↑', 'climb (boost)'],
                              ['Space', 'shoot'], ['Left-drag', 'look around (Alt: steer)'],
                              ['Wheel / pinch', 'camera distance'], ['0 / 1', 'POV · start distance'],
                              ['R · K · M', 'opening shot · roll dice · mouse mode'],
                              ['T · U · J · N', 'sound · engine · track · narrator'], ['G', 'this panel']] },
    ] },
    // ══ v5 · Slice D · „Parameter freilegen" ══════════════════════════════════════════════════
    // Acht Module hatten ihre Zahlen als `const`-Block oder als nackte Literale im Rechenweg.
    // Jetzt hat jedes `params` + `quelle` + `abweichungen()` + `zeile()`, und die Abnahme dieses
    // Slice ist EINE Zahl: **wie viele Werte weichen von der Quelle ab.** 0 heißt, dass Slice D
    // nichts verändert hat — und das ist prüfbar statt behauptet.
    { id: 'params', title: 'Parameters (Slice D)', rows: [
      { kind: 'info', label: 'Source check (must be 0 off source)', get: () => {
        const q = [carpet, rig, trail, lines, petKin, leaves, hud, wake, rauch, hudFlug].filter(Boolean);
        let n = 0, p = 0, fehlt = [];
        for (const m of q) {
          if (!m || !m.abweichungen) { fehlt.push(m && m.name || '?'); continue; }
          n += m.abweichungen().length;
          p += Object.keys(m.quelle || {}).length;
        }
        const b = biomeAbweichungen();   // gegen die beim Aufbau festgehaltene Basis
        n += b.length; p += 4;
        return p + ' parameters across ' + q.length + ' modules · '
          + (n ? '⚠ ' + n + ' off source' : '0 off source — Slice D changed nothing')
          + (fehlt.length ? '  ·  ⚠ no report: ' + fehlt.join(', ') : ''); } },
      { kind: 'info', label: 'carpet · flight physics', tags: 'teppich vehicle pet flug',
        get: () => carpet.zeile() },
      { kind: 'info', label: 'rig · chase camera', get: () => rig.zeile() },
      { kind: 'info', label: 'trail · golden ribbons', get: () => trail.zeile() },
      { kind: 'info', label: 'lines · speed streaks', get: () => lines.zeile() },
      { kind: 'info', label: 'petKin · impulse language', get: () => petKin.zeile() },
      { kind: 'info', label: 'leaves · ground foliage', get: () => leaves.zeile() },
      { kind: 'info', label: 'hud · card stack', get: () => hud.zeile() },
      { kind: 'info', label: 'wake · ocean spray', get: () => wake.zeile() },
      { kind: 'info', label: 'smoke · drift dust', get: () => rauch.zeile() },
      { kind: 'info', label: 'hudFlight · frame reaction', get: () => (hudFlug ? hudFlug.zeile() : 'wiring…') },
      { kind: 'info', label: 'biom · domains', get: () => biomeZeile() },
      { kind: 'info', label: 'biom · last mix sample (observation)', get: () => {
        const s = biomeLetzteProbe();
        return 'scale ' + s.scale + ' · oct ' + s.octaves + ' · lac ' + s.lacunarity
          + ' · pers ' + s.persistence + ' · thr ' + s.threshold + '  —  ' + s.hinweis; } },
      // Die vier Regler, nach denen bisher tatsächlich gefragt wurde. Alles andere ist über
      // `__globe.<modul>.params` erreichbar — ein Panel mit 100 Schiebern ist kein Zugang,
      // sondern ein Versteck.
      { kind: 'slider', label: 'carpet · cruise speed', min: 0.1, max: 0.78, step: 0.01,
        tags: 'teppich vehicle speed tempo flug',
        get: () => carpet.params.minSpeed,
        set: (v) => { carpet.params.minSpeed = v; if (carpet.speedFloor > 0) carpet.setSpeedFloor(v); },
        fmt: (v) => v.toFixed(2) + (Math.abs(v - carpet.quelle.minSpeed) < 1e-9 ? '  ·  source' : '  ·  ⚠ off source') },
      { kind: 'slider', label: 'carpet · turn response', min: 2, max: 16, step: 0.5,
        tags: 'teppich vehicle lenken flug',
        get: () => carpet.params.turnSmooth, set: (v) => { carpet.params.turnSmooth = v; },
        fmt: (v) => v.toFixed(1) + (Math.abs(v - carpet.quelle.turnSmooth) < 1e-9 ? '  ·  source' : '  ·  ⚠ off source') },
      { kind: 'slider', label: 'rig · look brake (anti-dizzy)', min: 0.4, max: 1, step: 0.02,
        get: () => rig.params.lookBrake, set: (v) => { rig.params.lookBrake = v; },
        fmt: (v) => v.toFixed(2) + (Math.abs(v - rig.quelle.lookBrake) < 1e-9 ? '  ·  source' : '  ·  ⚠ off source') },
      { kind: 'slider', label: 'leaves · speed gate', min: 0, max: 1, step: 0.02,
        get: () => leaves.params.tempoSchwelle, set: (v) => { leaves.params.tempoSchwelle = v; },
        fmt: (v) => v.toFixed(2) + (v < 0.02 ? '  ·  always on' : '') },
      { kind: 'note', text: 'Slice D exposes, it does not tune: every default is the measured source value, and the check above is the proof. Three findings came out of the exposing itself. (1) carpet: SIX tuning numbers lived as bare literals inside update() while a tidy-looking const block sat at the top — a const block that is missing six values is worse than none, because it keeps being right as long as nobody looks. (2) camera-rig: seven more, including the 0.78 look brake that the module header spends three lines calling the cure for motion sickness — the one number you could not find without reading the maths. (3) carpet-leaves: the land/water blender is the only time-writer in the codebase that ignores dt (8 % per FRAME, so it blends half as fast at 30 fps). That is the source 1:1, so the value stays — but it is now named after what it does, and the finding is written down instead of living in nobody’s head. Deliberately NOT exposed: the pet’s lean-spring constants and walk-mode numbers (dozens of values in two long paths, no demand yet) — a slice that claims 8/8 and quietly skips half is worse than one that names its boundary.' },
    ] },
    { id: 'technik', title: 'Diagnostics', rows: [
      { kind: 'info', label: 'Seed', get: () => seed },
      { kind: 'info', label: 'World', get: () => terrainType + ' · ' + (zeitTexte[timeOfDay] || timeOfDay)
        + '  ·  Land ' + Math.round((globe.report().landAnteil || 0) * 100) + ' %' },
      { kind: 'info', label: 'Speed', get: () => carpet.report().tempo.toFixed(2) + '  ·  Drift ' + carpet.report().drift.toFixed(2) },
      { kind: 'info', label: 'Height above ground', get: () => carpet.agl.toFixed(3) + (carpet.state.isOverWater ? '  ·  water' : '') },
      // `frameMs` startet auf 16 — ohne diese Bedingung stünden „63 fps" da, bevor ein einziges
      // Bild gezeichnet wurde (in einer verdeckt geladenen Seite tickt rAF nicht). Eine Zahl, die
      // es noch nicht gibt, ist ein Strich.
      { kind: 'info', label: 'Frames', get: () => (takt.bilder === 0 ? '—  ·  no frame yet'
        : Math.round(1000 / Math.max(1, frameMs)) + ' fps  ·  ' + frameMs.toFixed(1) + ' ms') },
      { kind: 'info', label: 'Pet', get: () => (petLoaded ? (petParts.id || 'loaded') + '  ·  ' + petScale.toFixed(2) + '×' : 'loading …') },
      // ⚠ Regel 6 aus `use-what-works`: der Beleg, dass die Kopie eine Kopie ist. Vier dieser acht
      // Prüfungen haben zwei Runden lang ✗ gemeldet, ohne dass es jemand sehen konnte — über dem
      // Shader-Block stand stattdessen ein Kommentar, der „wörtlich" behauptete. Ein Kommentar
      // kann lügen, ein Uniform nicht.
      // Georgs Frage vom 30.8. als Schalter statt als Behauptung: einmal klicken, und es ist
      // entschieden, ob die weißen Kreise das Glitzern sind. 1,00× ist der Wert der Quelle.
      { kind: 'slider', label: 'Water glitter', min: 0, max: 1, step: 0.05,
        get: () => globe.sparkleGain, set: (v) => globe.setSparkleGain(v),
        fmt: (v) => (v === 0 ? 'off' : v.toFixed(2) + '×') + (Math.abs(v - 1) < 1e-6 ? '  ·  source' : '  ·  off source') },
      { kind: 'note', text: 'The white patches on the water are the source sparkle, not particles — nothing white is emitted as a particle here (foam is cyan #b3ffff, the sparkle is pure white). They are new since the verbatim port: the earlier hand-rewritten formula multiplied five sines and therefore almost never fired. The source multiplies four, adds a second term, and masks with a LOW-frequency pattern, so it glitters in patches. At close camera range those carrier frequencies fall below one pixel, which is what makes the patches crawl. Set the slider to 0 to confirm; 1.00× is the source value.' },
      // ⚠ Georgs Vorgabe vom 30.8.: „zukünftig bitte Warnung, falls unsere Arbeiten hier solche
      // Konflikte auslösen — im Zweifel stirbt ein Feature und wir denken uns etwas passendes aus.
      // TS ist führend für uns, weil es gut ist und funktioniert."
      // Eine Vorgabe ohne Instrument ist eine Absicht. Das hier ist das Instrument: es nennt die
      // EINE Abweichung, die entschieden wurde (der Farbton), und meldet ✗, sobald jemand an
      // Sättigung oder Helligkeit dreht — denn genau die beiden sind der Grund, warum es
      // funktioniert. Wer künftig „nur ein bisschen abdunkelt", sieht es hier sofort.
      { kind: 'info', label: 'Land palette vs source', get: () => {
          const r = globe.palettenProbe();
          return (r.ok ? '✓ ' : '✗ ') + r.slots + ' slots  ·  hue OURS by decision (max Δ '
            + r.hueGrad + '°)  ·  saturation & lightness = source (Δ ' + r.dS + ' / ' + r.dL + ')'
            + (r.ok ? '' : '  ⚠ ' + r.schlimmste + ' drifted — that is how the grey came back');
        } },
      // ⚠ Derselbe Wächter wie fürs Land, für die drei Ozean-Tripel. Georgs Frage vom 30.8. war
      // „kommen die orangen Wellen von uns?" — nein, sie standen zeichengleich in der Quelle. Jetzt
      // ist der FARBTON unsere Entscheidung und muss als solche ablesbar sein; Sättigung und
      // Helligkeit bleiben die der Quelle, sonst verliert die Gischt genau das, was sie sichtbar
      // macht. Geprüft werden alle neun Werte, nicht nur der Schaum: wer morgen das Wasser
      // abdunkelt, soll es hier sehen und nicht am Bild rätseln.
      { kind: 'info', label: 'Ocean palette vs source', get: () => {
          const hsl = (hex) => { const c = new THREE.Color(hex), o = {}; c.getHSL(o); return o; };
          let dH = 0, dS = 0, dL = 0, wo = null;
          // ⚠ **Die Namen kommen aus `TIMES_OF_DAY`, nicht aus meinem Kopf.** Erste Fassung listete
          // `['day','sunset','night']` — `sunset` ist der Name der QUELLE, unsere Tageszeit heißt
          // `evening`. `getSkyPreset('sunset')` gab `undefined`, und der Vergleich lief gegen das
          // Tag-Preset: der Wächter meldete `✗ Δ 0.234 / 0.196`, während die Palette stimmte.
          // Eine fest getippte Namensliste neben einer vorhandenen Namensliste ist eine zweite
          // Quelle der Wahrheit — genau die Fehlerklasse, die dieses Projekt „zwei Eigentümer" nennt.
          const zeiten = (TIMES_OF_DAY && TIMES_OF_DAY.length ? TIMES_OF_DAY : ['day', 'evening', 'night']);
          const fehlend = [];
          for (const zeit of zeiten) {
            const q = OZEAN_QUELLE[zeit], k = getSkyPreset(zeit);
            // Ein fehlender Schlüssel wird als FEHLENDER SCHLÜSSEL gemeldet, nicht als Farbdrift.
            // Ein Instrument, das seine eigene Blindstelle in die Maßeinheit des Messwerts
            // übersetzt, lügt in der Sprache, der man am meisten glaubt: in Zahlen.
            if (!q || !k) { fehlend.push(zeit + (q ? ' (no preset)' : ' (no source row)')); continue; }
            for (const feld of ['oceanShallow', 'oceanDeep', 'oceanFoam']) {
              const a = hsl(q[feld]), b = hsl(k[feld]);
              let h = Math.abs(a.h - b.h); if (h > 0.5) h = 1 - h;
              if (Math.abs(a.s - b.s) > dS || Math.abs(a.l - b.l) > dL) wo = zeit + '.' + feld;
              dH = Math.max(dH, h); dS = Math.max(dS, Math.abs(a.s - b.s)); dL = Math.max(dL, Math.abs(a.l - b.l));
            }
          }
          if (fehlend.length) return '✗ MISSING KEY: ' + fehlend.join(', ')
            + '  —  not a colour drift, a name mismatch (check TIMES_OF_DAY vs OZEAN_QUELLE)';
          const zahl = zeiten.length * 3;
          const ok = dS <= 0.01 && dL <= 0.01;
          return (ok ? '✓ ' : '✗ ') + zahl + ' values  ·  hue OURS by decision (max Δ '
            + (dH * 360).toFixed(0) + '°)  ·  saturation & lightness = source (Δ '
            + dS.toFixed(3) + ' / ' + dL.toFixed(3) + ')'
            + (ok ? '' : '  ⚠ ' + wo + ' drifted');
        } },
      { kind: 'note', text: 'The orange waves at sunset were NOT ours — SkyPresets.ts:132 carries oceanFoam 0xff9944, and all three of our ocean triples were character-identical with the source. Harmonised on 30 Aug by the same rule as the land: hue is KFB, saturation and lightness stay exactly the source. Foam is now cream instead of cyan by day (firn 53°, the paper of the cards), gold instead of orange at sunset (strand 45°, the tone of the wordmark), and 11° off the source at night (spires 233°). The water body itself is untouched and still character-identical — say the word if it should follow.' },
      // ── Slice H · Weltstimmungen ──────────────────────────────────────────────────────────────
      // ⚠ `seg`, nicht `select` — die Art gibt es hier nicht, und bis heute hätte das Panel die
      // Zeile schweigend weggelassen. Die Optionsform ist `{ v, l }`, nicht `{ value, label }`.
      { kind: 'seg', label: 'World mood',
        options: STIMMUNGEN.map((s) => ({ v: s.id, l: s.name })),
        get: () => (stimmung ? stimmung.id : 'verdant'),
        set: (v) => stimmungSetzen(v) },
      // ⚠ Das durchfallbare Ergebnis dieses Slice. Nicht „sieht gut aus", sondern: keine der vier
      // Stimmungen verliert mehr als 10 % Landsättigung gegen den geprüften Stand. Genau das war
      // am 30.8. der Fehler, den kein Bild gemeldet hat — und Frost und Bone sind die zwei
      // Stimmungen, die dazu verführen, weil ihre NAMEN nach blass klingen.
      { kind: 'info', label: 'Mood gate (must be 4/4)', get: () => {
          const r = stimmungsTor();
          return (r.bestanden === r.von ? '✓ ' : '✗ ') + r.bestanden + '/' + r.von
            + '  ·  ' + r.zeilen.join('   ');
        } },
      { kind: 'note', text: 'A mood supplies HUES only — saturation and lightness always come from the source values. That is not thrift, it is the lesson of 30 Aug in one line: the washed-out look was never a colour, it was saturation (land 0.21 against the source 0.63). A mood allowed to touch saturation could rebuild that fault four times over, and frost and bone are exactly the two that tempt you to, because their NAMES sound pale. They are not pale here, they are cold and dry — that is a hue, not an absence. Four inputs, none newly invented: land palette, the twelve zone patch colours, the ocean body, and the two trail tints. The sky stays untouched (it belongs to the day/night cycle) and so does the foam — foam is LIGHT on water, not material.' },
      // ── Block 2 · Atmosphäre (Georgs Hauptfokus, 1.9.) ──────────────────────────────────
      { kind: 'slider', label: 'Aurora strength', min: 0, max: 2, step: 0.05,
        get: () => aurora.params.stark, set: (v) => aurora.setStark(v),
        fmt: (v) => (v < 0.03 ? 'off' : (Math.abs(v - 1) < 0.03 ? 'source' : Math.round(v * 100) + ' % of source')
          + ' · peak per curtain ' + aurora.spitzeEinzeln()
          + ' · night weight ' + aurora.gewicht.toFixed(2)) },
      { kind: 'slider', label: 'God-ray strength', min: 0, max: 0.24, step: 0.005,
        get: () => strahlen.params.faktor, set: (v) => strahlen.setFaktor(v),
        fmt: (v) => (v < 0.003 ? 'off' : (Math.abs(v - 0.06) < 0.003 ? 'source 0.06' : v.toFixed(3))
          + ' × sun · ceiling ' + strahlen.spitze()
          + ' · day weight ' + strahlen.gewicht.toFixed(2)) },
      { kind: 'info', label: 'Additive white gate (Block 2)', get: () => weissTor().text },
      { kind: 'button', label: 'Measure the picture for clipped white',
        onClick: () => { const w = weissTor(true);
          console.info('[white] ' + w.text + '\n  ' + (w.zeilen || []).join('\n  ')); } },
      { kind: 'note', text: 'Two effects from tinyskies, ported character-identical (sky-atmosphere.js): Aurora — ten additive curtains on a ring, and God rays — one additive cone. The ring needed NO rescaling, and that is read rather than hoped: Game.ts calls its globe radius „~5“ in a comment and our GLOBE_RADIUS is 5 too. The cone did: their sun sits at distance 13.15, ours at 60. For a DirectionalLight the distance is meaningless — only the direction counts, so 60 was never wrong — but the cone is real geometry 18 long, so at 60 it would hang 42 units above the globe: present, correct, invisible. A number that is meaningless in one context turns dangerous the moment a second reader arrives. ⚠ And the important part for the remaining four effects: an ADDITIVE effect is not covered by light-budget.js at all. That module measures lights and albedo — things three MULTIPLIES. These add onto the finished frame, after all lighting, so their ceiling is not sun/π · albedo but simply: whatever exceeds 1.0 after the addition is white. Aurora rides the night weight and the rays ride its complement, so they are never on screen together — the budget is per TIME OF DAY, not a sum over all six. ⚠ This gate got its own verdict wrong FIVE times before it was worth reading, and the worst one is worth keeping in view: godrays.setGewicht wrote neither the uniform nor group.visible — it only remembered a local variable that takes effect on the next update(). Inside the frame loop that never shows (update follows immediately); every caller OUTSIDE was silently ignored — and that was this gate’s own control shot. It photographed the rays at full strength as „without effect“, honestly measured „0 % changed“, and then explained that zero away with an occlusion heuristic and printed a ✓. Measured with the uniform actually zeroed: 40.9 % of the frame, max Δ 499/765. A setter that delegates its effect to another call is not a setter, it is a reservation. An instrument must prove it can switch off the thing it measures before a zero means anything — so the gate now checks exactly that first and otherwise prints no number at all. And an exception that turns a zero into a pass is a lowered bar with an excuse in front of it: the heuristic is gone for good.' },
      // ⚠ Die Abnahme für den Himmel-Ton, nach der Lehre von §05u gebaut: sie vergleicht den
      // gemalten Nebel gegen `zyklus.nebelSoll()` (Preset PLUS Stimmungsdrehung) — nicht gegen das
      // rohe Preset, sonst ist sie bei aktiver Stimmung blind. Und sie prüft, ob die Drehung
      // WIRKLICH angekommen ist: gemalter Farbton gegen den Ton der Stimmung.
      // ⚠ **Zweiter Anlauf. Die erste Fassung prüfte nur die NEBELFARBE** — und meldete ✓, während
      // der sichtbare Himmel einfarbig war: der Stimmungston wurde als absoluter Wert auf jede
      // Verlaufsstufe geschrieben, also fielen alle neun auf einen Ton. Gemessen: Abend ohne
      // Stimmung 154° Farbtonspanne, mit Stimmung 0,2°.
      // **Die Abnahme war blind für genau das, wofür sie gebaut wurde** — dieselbe Klasse wie beim
      // Wasser (§05u), zwei Runden später. Sie prüft jetzt DREI Dinge: die Nebelfarbe gegen ihren
      // Soll-Wert, den Zenit-Ton gegen den Stimmungston (der benannte Anker), und — das
      // Entscheidende — **ob die gestaltete Farbtonspanne des Presets erhalten bleibt.**
      { kind: 'info', label: 'Sky follows mood', get: () => {
          const sp = zyklus.verlaufSpanne();
          const soll = zyklus.nebelSoll();
          const ist = scene.fog ? scene.fog.color.getHex(THREE.SRGBColorSpace) : null;
          if (ist == null) return '— no fog in scene';
          const c2 = new THREE.Color(soll), c3 = new THREE.Color(ist);
          const dFarbe = Math.abs(c2.r - c3.r) + Math.abs(c2.g - c3.g) + Math.abs(c2.b - c3.b);
          const hx = (v) => '#' + v.toString(16).padStart(6, '0');
          // Die Spanne darf durch die Drehung nicht wesentlich schrumpfen. 60 % ist die Grenze:
          // etwas Verlust ist rechnerisch unvermeidlich (8-Bit-Rundung, Sättigungsgrenzen), ein
          // Einbruch auf null ist der Fehler von oben.
          // ⚠ **0 von 0 ist kein „100 %".** Außerhalb der Atmosphäre zieht die Raum-Blende jede
          // Verlaufsstufe auf die Zenitfarbe (Eröffnungsflug) — die gestaltete Spanne ist dann
          // tatsächlich 0, und ein Verhältnis darauf ist keine Messung. Die Zeile meldete dafür
          // „100 %", also einen Erfolg, wo sie nichts geprüft hat. Dieselbe Klasse wie die
          // SNOW-BAND-Zeile, die es inzwischen richtig macht: sie sagt `idle`.
          const spanneMessbar = sp.roh > 1;
          const anteil = spanneMessbar ? sp.neu / sp.roh : 1;
          const spanneOk = !spanneMessbar || anteil >= 0.6;
          const ton = zyklus.himmelTon;
          const ok = dFarbe <= 0.02 && spanneOk
            && (ton == null || Math.abs(sp.versatz - ton) <= 0.5);
          return (ok ? '✓ ' : '✗ ') + 'fog ' + hx(ist) + '/' + hx(soll) + ' Δ' + dFarbe.toFixed(3)
            + '  ·  gradient hue span '
            + (spanneMessbar
                ? sp.neu + '° of ' + sp.roh + '° authored (' + Math.round(anteil * 100) + ' %'
                  + (spanneOk ? '' : ' ⚠ FLATTENED') + ')'
                : 'idle — outside the atmosphere the space fade pulls every stop to the zenith, nothing to compare')
            + '  ·  ' + (ton == null ? 'no mood sky tint'
                : (Math.abs(sp.versatz - ton) <= 0.5 ? 'mood offset applied: ' : '⚠ OFFSET LOST: ')
                  + sp.versatz + '° (mood asks ' + ton + '°)');
        } },

      { kind: 'info', label: 'Biome zones in patches', get: () => {
          const z = globe.zonenFarben;
          const namen = ['plateau', 'spires', 'shatter', 'flatwater'];
          return z.zonen + ' zones · hue only ('
            + z.hues.map((h, i) => (namen[i] || 'zone' + i) + ' ' + h + '°').join(' · ')
            + ') · saturation & lightness = source in all ' + (z.zonen * 3) + ' patch colours';
        } },
      { kind: 'note', text: 'The zones are back, but as PATCH colour instead of overtinting. The old biome tint mixed one ground tone across the whole landmass — an average, and it took the source saturation back out again, which is why it was switched off. The source has a better tool for the same job: the noise-driven patchwork, which only sits on the lowlands and leaves the base colour standing between patches. So each zone now inherits its own triple of patch colours. Mechanism is entirely the source (noise seed+555, scale 4, threshold 0.2, mix up to 0.6); only the hue changes per region. Full zone hues, no half measure: spires is blue and jumps 125° off the green, and an RGB blend between two distant hues passes through GREY — a dial for "a bit of zone" would have rebuilt the exact fault we paid for three times today. If a zone reads too loud in the picture, the ZONE COLOUR changes, not the mix.' },
      { kind: 'note', text: 'Third way, 30 Aug: tinyskies leads. Its look is three rules, not a colour list — colours must be vivid rather than pale, a noise-driven patchwork of three warm tones breaks up the lowlands, and the land gets BRIGHTER with height. All three are taken over. Only the hue is ours: the nine land colours keep the source saturation and lightness exactly and carry KFB hues instead (ebene, strand, hang, firn from LAND_HEX). Our own biome tinting is off — two systems owning the ground tone is one too many, and ours desaturated the other. The row above is the guard: hue may differ, saturation and lightness may not.' },
      // ⚠ Die Zahl, die Georgs Befund vom 30.8. („wasser & wellen auf bergen/hügeln") erklärt und
      // die Abweichung vom Quell-Tor begründet — als Messung, nicht als Behauptung.
      // ⚠ Regel 6 für das AO: ein Vertexfarben-Puffer ohne `vertexColors: true` und ein
      // `onBeforeCompile`, das nie kompiliert wird, melden beide nichts. Diese Zeile zählt die
      // Leser, nicht die Werte — die Lehre aus Slice D (§05o).
      { kind: 'info', label: 'Prop AO + rim (Globe.ts)', get: () => {
          const r = marken && marken.aoProbe ? marken.aoProbe() : null;
          if (!r) return '— landmarks not ready';
          return (r.ok ? '✓ ' : '✗ ') + r.materialienMitVertexfarben + ' materials read vertex colours'
            + (r.ohne ? ' (' + r.ohne + ' do not)' : '')
            + '  ·  ' + r.instanzenMitFarbAttribut + ' meshes carry baked AO'
            + (r.ohneAttribut ? ' (' + r.ohneAttribut + ' without)' : '')
            + '  ·  AO range ' + r.aoSpanne[0] + '–' + r.aoSpanne[1]
            + (r.aoSpanne[0] >= 0.5 ? ' ⚠ nothing darkened' : ' (source floors: tree 0.10 · rock 0.15 · build 0.15)');
        } },
      { kind: 'note', text: 'Fake AO and the object rim are the two cheapest things in the source we did not have, and together they carry most of what makes its trees and houses read as solid. The source bakes a darkening into the vertex colour by local height — tree floor 0.10 reaching full at 50 % height, rock 0.15 at 70 %, house 0.15 at 50 % — and puts a shared Fresnel rim on nearly every material. This matters more here than there: our props cast no shadow (the card shadow is off, and the source has none visible in flight either), and an object without a shadow AND without a dark foot does not sit on the ground, it lies on top of it. The AO does not replace the shadow, it makes it unnecessary — the darkening sits on the OBJECT, so it can never produce the polygon edges our painted patch had. Plasticity is a ratio of foot to edge, not an amount of light.' },
      // v9 · Georgs Befund „Wasser & Küsten gröber als im Original" — als Zahl und als Regler.
      // v9 · Georg, 1.9.: „unser Schatten ist anders als in tinyskies."
      { kind: 'info', label: 'Sun shadow gate (v9 · source rebuild)', get: () => sonnenSchatten.tor().text },
      { kind: 'info', label: 'Lens flare gate (v9 · LensFlare.ts)', get: () => flare.tor().text },
      { kind: 'info', label: 'Day/night weight gate (v9)', get: () => zyklus.gewichtTor(timeOfDay).text },
      // ── v11 · Wetter ───────────────────────────────────────────────────────────────────────
      { kind: 'toggle', label: 'Rain (RainOverlay.ts, source-driven episodes)', tags: 'regen wetter rain weather nebel fog',
        get: () => !wetter.aus, set: (on) => { wetter.aus = !on; } },
      { kind: 'slider', label: 'Rain override (−0.01 = follow the source clock)', min: -0.01, max: 1, step: 0.01, tags: 'regen wetter rain weight',
        get: () => wetter.override, set: (v) => { wetter.override = v < 0 ? -1 : v; },
        fmt: (v) => (v < 0 ? 'source clock' : v.toFixed(2)) },
      { kind: 'info', label: 'Rain gate (v11 · DayNightCycle.getRainWeight)', tags: 'regen wetter rain weather episode',
        get: () => regenTor(seed).text + ' · now drawing ' + regen.streaks + ' streaks at weight ' + regen.weight.toFixed(2) },
      { kind: 'slider', label: 'Fog scale (Game.ts fogScale: 1 desktop, 0.7 mobile)', min: 0.3, max: 1.5, step: 0.05, tags: 'nebel fog sicht fog-of-war wetter',
        get: () => wetter.fogScale, set: (v) => { wetter.fogScale = v; zyklus.setFogScale && zyklus.setFogScale(v); },
        fmt: (v) => v.toFixed(2) + '×' },
      { kind: 'note', text: 'v11 weather, ported not rebuilt: 200 additive rain streaks + the Shadertoy glass-droplet pass over the framebuffer (RainOverlay.ts, constants unchanged), driven by the source\'s two seeded sine waves on the wall clock — the same world rains at the same minute on every screen. Lightning is in the code but needs moonProgress ≥ 0.75, which this world has no clock for. tinyskies has NO snow (Georg: leave it out) and no separate fog-of-war — fog is the sky preset\'s Fog(near, far) times fogScale, which is exactly what the slider scales. Open: the rain sound loop (rain_1.mp3) — our sound engine has no rain sample yet.' },
      // v9 · Streuung: die vier Zahlen, mit denen Georgs Befund gestellt wurde.
      { kind: 'info', label: 'Volcano gate (v9 · Volcano.ts)', get: () => vulkane.tor().text },
      { kind: 'info', label: 'Lighthouse gate (v9 · Globe.ts 5368)', get: () => leuchttuerme.tor().text },
      { kind: 'note', text: 'Volcano and lighthouse are the first two riders on the spread layer, and they are riders by construction: each one hands in a PREDICATE instead of bringing its own random. Volcano — highland (source: elevation > 0.4, best of up to 3000 throws in Volcano.ts getVolcanoPlacementNormal), body from the source lathe profile (S 0.35 · H 1.25, crater in six control points, 24 outer steps r = 0.24·S + t^1.6·1.15·S), the noise warp, the four colour bands, 30 additive lava blobs and 15 smoke billboards with both source shaders unchanged, sunk S·0.42 into the ground. Lighthouse — coast (land underfoot, water in the ring, the idea of Globe.waterRatioAround used as a condition rather than a filter), 3 of them like the source, tower 0.18 u (source towerH), beam a lying cone rotating at 0.8 rad/s (source lighthouseBeamTime × 0.8). Named as OURS: the colours, the stripes and the five-part silhouette instead of the source’s fourteen — mechanics from the source, ink from KFB.' },
      // ── v11 · Slice „Streuung zusammenführen" ──────────────────────────────────────────────
      { kind: 'info', label: 'Terrain card spread gate (v11)', tags: 'karte teppich streuung spread wasser land',
        get: () => streuungTor({ THREE, punkte: teppiche.orte().map((o) => o.n), name: '56 terrain cards (land + water)', proben: 1200 }).text },
      { kind: 'info', label: 'Family distance gate (v11)', tags: 'familie abstand overlap ueberlappung karte leuchtturm vulkan portal streuung',
        get: () => {
          const fam = [];
          fam.push({ name: 'cards', orte: teppiche.orte() });
          fam.push({ name: 'signposts', orte: tuerme.sites().map((t) => ({ n: t.site.n, r: t.r })) });
          fam.push({ name: 'landmarks', orte: kenneySites.map((s) => ({ n: s.n, r: (s.def ? s.def.h : 0.18) * 0.6 })) });
          fam.push({ name: 'volcanoes', orte: (vulkane.orte || []).map((n) => ({ n, r: 0.35 * 0.42 })) });
          fam.push({ name: 'lighthouses', orte: (leuchttuerme.orte || []).map((n) => ({ n, r: 0.03 })) });
          fam.push({ name: 'rocks', orte: komposition.orte ? komposition.orte() : [] });
          fam.push({ name: 'portals', orte: (portale.orte || []).map((p) => ({ n: p.pos.clone().normalize(), r: 0.12 })) });
          const fl = flora.orte();
          for (const f of ['baum', 'baum_kahl', 'busch', 'stumpf']) fam.push({ name: f, orte: fl.filter((o) => o.familie === f) });
          const b = belegung.zaehle();
          return familienAbstandTor({ familien: fam, R: GLOBE_RADIUS, name: 'families' }).text + ' · occupancy list: ' + Object.entries(b).map(([k, v]) => k + ' ' + v).join(', ');
        } },
      { kind: 'note', text: 'v11: portals and enemies (first round) now take their sites from the ONE scatter layer (streuen) instead of their own random; terrain cards are the whole deck on land AND water (afloat as rafts), each with its sky card anchored above it — collected means gone. The family gate measures the smallest surface gap BETWEEN families (arc·R minus both radii); a card under a lighthouse shows up here as an overlap. Within a family nothing is measured: triads and tufts are meant to be tight.' },
      { kind: 'info', label: 'Site spread gate (v9)', get: () => streuungTor({
          THREE, punkte: markenSites.map((s) => s.n), name: 'landmark + tower sites',
          gueltig: (n) => isLand(seed, terrainType, n.x, n.y, n.z), proben: 1200 }).text },
      { kind: 'info', label: 'Site spread · placement', get: () => {
          const s = markenSites.stats || {};
          return (s.nachAn ? 'relocating' : 'v8 behaviour: rejecting') + ' · '
            + (s.gesetzt || 0) + ' of ' + (s.kandidaten || 0) + ' candidates placed, '
            + (s.nachgerueckt || 0) + ' moved to a neighbour instead of dropped, '
            + (s.imWasser || 0) + ' still water / ' + (s.zuSteil || 0) + ' still too steep'
            + ' · minimum separation ' + (s.minSepGrad != null ? s.minSepGrad + '°' : '—'); } },
      { kind: 'note', text: 'Georg, 1.9.: „die Verteilungs-/Streuungs-Logik der Props, Wegweiser und Karten muss die aktuellen Ballungen und Leerflächen ausgleichen.“ Measured first (776 prop instances: ideal neighbour spacing 4.11°, actual median 1.54°, tightest 0.08°, largest gap 17.93°, 151 under a quarter of ideal) — and then HALF of that turned out to be intent: the coconut and rock groups are clusters by design, 4–9 and 3–5 pieces. A metric over all instances measures the intent and calls it a fault. What counts is the spread of the SITES and the size of the empty areas. The real find sits one level down, in planSites: the sites ride a Fibonacci spiral (well spread by construction), but a candidate in water or on a steep slope was THROWN AWAY — leaving a hole exactly there, while the overdraw refilled the target count at the tail of the spiral, where sites sit tighter. Holes and clumps from one line. The fix is one word: relocate. A rejected candidate is now re-searched in its own neighbourhood (spiral search in the tangent frame, small radius), and the minimum separation is part of the same predicate rather than a second rule. The gate above measures both numbers; the slider „v8 behaviour“ is the honest comparison.' },
      { kind: 'info', label: 'Avatar lamp gate (v9 · playerLight)', get: () => lampe.tor().text },
      { kind: 'toggle', label: 'Avatar lamp at night', get: () => lampe.params.on, set: (on) => lampe.setOn(on) },
      { kind: 'slider', label: 'Avatar lamp strength', min: 0, max: 1.2, step: 0.02,
        get: () => lampe.params.nachtStaerke, set: (v) => lampe.setStaerke(v),
        fmt: (v) => v.toFixed(2) + (Math.abs(v - 0.38) < 0.015 ? '  ·  source value' : '') },
      { kind: 'slider', label: 'Avatar lamp range', min: 1, max: 12, step: 0.5,
        get: () => lampe.params.weite, set: (v) => lampe.setWeite(v),
        fmt: (v) => v.toFixed(1) + ' u' + (Math.abs(v - 6.5) < 0.26 ? '  ·  source value (globe radius is 5!)' : '') },
      { kind: 'note', text: 'Georg, 1.9.: „bei tinyskies gibt es auch eine Art Lichtkegel mit Kerzenlicht-Anmutung…“ — it exists, and it is NOT a cone: Game.ts:1517 builds a PointLight(0xeec4a8, 0, 6.5, 1.25), positions it at the player plus 0.15 along the up vector (3146), and drives it with intensity = nightWeight × 0.38 (6288). The cone impression comes from the decay over curved ground, not from a spot. Note the range: 6.5 units at globe radius 5 — the lamp reaches over the near horizon. Fog of war (his second idea) is deliberately NOT built here: the lamp radius is the natural carrier for „what is known“, but a visibility mask over land, props and cards is a second mechanism and belongs in the world-building layer, not in a lamp.' },
      { kind: 'toggle', label: 'Lens flare', get: () => flare.params.on, set: (on) => flare.setOn(on) },
      { kind: 'slider', label: 'Lens flare strength', min: 0, max: 2, step: 0.05,
        get: () => flare.params.gain, set: (v) => flare.setGain(v),
        fmt: (v) => v.toFixed(2) + '×' + (Math.abs(v - 1) < 0.03 ? '  ·  source cap 0.25 opacity' : '') },
      { kind: 'note', text: 'Lens flare is the source file, ported line for line: eight additive quads in an ortho scene (five soft circles, three hexes), offsets stretched along the sun’s screen vector (ex = sunX · (1 − 2·offset)), overall opacity capped at 0.25, edge fade from 0.8 over 0.6, drawn after the scene with autoClear off — no post-processing pass anywhere. Two named deviations: the sun position is OUR lamp (direction × 60) instead of their constant (10, 12, 5), so the reflex sits where our light actually is; and the day weight is multiplied in by the host (Game.ts 6290), so there is one writer for it.' },
      { kind: 'toggle', label: 'Real sun shadow (follows the vehicle)',
        get: () => sonnenSchatten.params.on, set: (on) => sonnenSchatten.setOn(on) },
      { kind: 'slider', label: 'Shadow box half-width', min: 2, max: 24, step: 1,
        get: () => sonnenSchatten.params.spanne, set: (v) => sonnenSchatten.setSpanne(v),
        fmt: (v) => '±' + v.toFixed(0) + ' u' + (v === 5 ? '  ·  source runtime value' : (v === 22 ? '  ·  source CONSTRUCTOR value — this is the one I mis-read' : '')) },
      // v9 · Werfer: in der Quelle werfen Wolken (Globe.ts 5273) und alle Props (castShadow = true
      // an ~20 Stellen); bei uns stand castShadow = false auf den Landmarken-Instanzen, weil es ohne
      // Schattenkarte ohnehin wirkungslos war. Jetzt ist es eine Entscheidung, also ein Schalter.
      { kind: 'toggle', label: 'Clouds & props cast shadows (source does)', get: () => werferAn,
        set: (on) => { werferAn = !!on; werferSetzen(); } },
      { kind: 'note', text: 'Georg, 1.9.: „unser Schatten ist anders als in tinyskies — dort gibt es doch einen, der scheint lichtabhängig und leicht versetzt.“ Correct, and the earlier note in card-shadow.js was wrong: it read the shadow camera in the CONSTRUCTOR (±22 u at radius 5 → 4 texels for the card, hence „technically on, invisible in the image“) and never counted the writers. Game.ts 3164–3170 moves the sun’s TARGET onto the player every frame and shrinks the box to ±5 — 0.0049 u per texel at 2048 px, so the card spans ~15 texels: small, soft (VSM, radius 2.5, 12 blur samples), light-direction dependent, slightly offset. That is what you circled. One named deviation: our lamp sits at distance 60, theirs at 13.2, so near/far are derived from the actual distance instead of their 1/40 — otherwise the map would never reach the globe.' },
      { kind: 'info', label: 'Shallow-water gain gate (v9)', get: () => globe.glanzTor().text },
      { kind: 'slider', label: 'Shallow-water structure', min: 0, max: 2, step: 0.05,
        get: () => globe.glanzGain, set: (v) => globe.setGlanzGain(v),
        fmt: (v) => v.toFixed(2) + '×' + (Math.abs(v - 1) < 0.03 ? '  ·  source curve' : '')
                    + (v < 0.05 ? '  ·  off = the v8 look (shallowness was 0)' : '') },
      { kind: 'info', label: 'Water gate (land bit, not colour)', get: () => {
          const r = globe.wasserTorProbe();
          return (r.invarianteOk ? '✓ ' : '✗ ') + 'landFlag matches mask ('
            + (r.flagBruch === 0 ? '0 mismatches' : r.flagBruch + ' MISMATCHES')
            + '), oceanDepth land=0 ('
            + (r.bruch === 0 ? 'ok' : r.bruch + ' BREAK IT — shader will paint water on land') + ')'
            + ', water below sea level ('
            + (r.hochWasser === 0 ? 'ok'
                : r.hochWasser + ' ABOVE IT, max +' + r.hoechstesWasser
                  + ' — build-site flattening is lifting the sea') + ')'
            + '  ·  land passing the source colour heuristic: ' + r.landTrifftFarbtor
            + ' (' + r.anteil + ' %)'
            + (r.landTrifftFarbtor > 0
                // ⚠ Auch hier stand „depth-based", nachdem das Tor auf dem Land-Bit lief. Zwei
                // Zeilen, ein alter Name — weil ich die Umbenennung an einer Stelle gemacht und an
                // der anderen vergessen habe. *Wer einen Mechanismus umbenennt, muss seine
                // Erwähnungen zählen, nicht seine Definition ändern.*
                ? ' — this is why the gate is the land bit, not the colour; with the source gate those would render as ocean'
                : ' — none in this mood, but frost turns land blue-green and trips it');
        } },
      { kind: 'info', label: 'WebGL context (Georg 1.9.)', get: () => {
          const verloren = renderer.getContext().isContextLost();
          const m = renderer.info.memory, pr = renderer.info.programs;
          return (verloren ? '✗ CONTEXT LOST — the loop is halted on purpose'
                           : kontextVerluste ? '✓ alive again after ' + kontextVerluste + ' loss(es)'
                                             : '✓ alive, never lost this session')
            + '  ·  ' + m.textures + ' textures, ' + m.geometries + ' geometries, '
            + (pr ? pr.length : '?') + ' programs'
            + '  ·  frame errors ' + frameFehler; } },
      { kind: 'info', label: 'Coast gate (Georg 1.9.)', get: () => globe.kuestenTor().text },
      { kind: 'note', text: 'Georg, 1.9.: „das game stürzt ab, während das HUD weiterläuft (und auch karten gesammelt werden).“ Measured, not guessed: `renderer.getContext().isContextLost()` read TRUE, and „THREE.WebGLRenderer: Context Lost.“ was already sitting in the console logs a session earlier, unfollowed. A lost context does NOT throw — every GL call becomes a silent no-op. So the frame loop kept running without a single error, the physics kept integrating, cards kept being collected, and nothing painted. The catch basket catches exceptions; here there were none, which is exactly why it looked like the game had crashed while the HUD (pure DOM, no GL) sailed on. The cause is not a leak of ours: at the moment of loss there were 78 textures, 147 geometries and 49 programs — the normal load. The browser takes the context away when a tab holds too many 3D views (reloading inside an editor does that) or is under memory pressure. We cannot prevent it; not noticing it was ours. Now: preventDefault on the loss (without it the browser never gives the context back), the loop stops instead of computing into the void for minutes with the world clock running, a readable sheet replaces the white canvas, and a restore triggers a reload — deliberately, because three has to recreate every GPU resource after a context loss, and a half-restored image would be the same silent state we just abolished.' },
      { kind: 'note', text: 'Georg, 1.9.: „bei uns scheinen z.B. einige polygone der küste auf das terrain über die wasseroberfläche gesetzt zu werden.“ Counted rather than interpreted: of 130 560 surface triangles, 12 190 carry land AND water corners — 9.34 % of the entire globe sits in the coastal band. `vLand` is an interpolated 0/1 attribute, so a BINARY gate on it draws its edge THROUGH the triangle at barycentric 0.5, and that edge lies halfway up the land ramp, above the water surface. Everything the water branch paints (blue lift, open-ocean foam, sparkle) ran at FULL strength up to that midline and then stopped dead. A binary gate on an interpolated quantity puts a hard edge where the data has none. The gate stays — it is the cheap early-out — but the colour now carries a weight that reaches zero exactly at the gate (smoothstep(0.5, 0.0, vLand)), so there is no step and no water on land. The shore contour deliberately does NOT carry the weight: it is the one term that belongs to the BOUNDARY rather than the surface, and its depthFade peaks at the waterline, precisely where the weight goes to zero — multiplying both would have erased the seam exactly where it is the point.' },
      { kind: 'info', label: 'Source constants (Globe.ts)', get: () => {
          const r = globe.quellenProbe();
          return (r.fehler === 0 ? '✓ ' + r.zeilen.length + '/' + r.zeilen.length + ' match source'
                                 : '✗ ' + r.fehler + ' DIVERGE') + '  ·  ' + r.zeilen.join('   ');
        } },
      { kind: 'info', label: 'Gear icon', get: () => (gear ? gear.source : '—') },
      { kind: 'info', label: 'Opening', get: () => (intro.active ? intro.phase + ' · ' + intro.rest.toFixed(1) + ' s'
          + (intro.haltSekunden > 0.05 ? ' · held ' + intro.haltSekunden.toFixed(1) + ' s for the load' : '')
        : launchT >= 0 ? 'rolling out · ' + Math.round(launchT / LAUNCH_DUR * 100) + ' %' : 'handed over') },
      // ── v3 · S7 · Georg: „ich kann da nix messen, wenn es da um Konsolen-Dinge geht" ──────
      // Also stehen die Zahlen, mit denen ich argumentiere, HIER. Keine Konsole, kein Trick:
      // aufklappen, ablesen. Und ein Knopf, der alles auf einmal in die Zwischenablage legt —
      // damit ein Befund im Chat eine Messung sein kann und keine Beschreibung.
      // v9 · BUG-03. Das Instrument statt des vierten Fixes — siehe Kopf von card-flight.js.
      { kind: 'info', label: 'Card clip gate (BUG-03)', get: () => flug.anschnittTor().text },
      { kind: 'button', label: 'Reset the clip measurement', onClick: () => { flug.anschnittReset(); sagen('Clip measurement reset'); } },
      { kind: 'note', text: 'BUG-03 („die Maske schneidet die Karte“) has been guessed at three times, and three times the preview was blind: canvas, stage and window are congruent both here and in Georg’s own view (measured 1.9.: 862×669 for all three), so the offset the 29 Aug fix removed is exactly zero in both. Instead of a fourth fix this gate MEASURES: it tracks the drawn card face in canvas pixels through the whole flight and remembers, per edge, how far it stuck out. A hard straight edge in the picture is almost always a picture boundary — now a number says which one, by how many pixels, and in which phase. Collect a card, then read this line.' },
      { kind: 'info', label: 'Cards: one mesh?', get: () => {
        const f = flug.report();
        return sky.count + ' in world · ' + f.unterwegs + ' in flight · '
          + f.gestartet + ' taken / ' + f.angekommen + ' arrived'; } },
      { kind: 'info', label: 'Cards: hit window (measured)', get: () => {
        const p = sky.params, w = (0.04 * p.passRadius + p.passPad) * 2, h = (0.023 * p.passRadius + p.passPad) * 2;
        return w.toFixed(3) + ' × ' + h.toFixed(3) + ' u  ·  avatar 0.075'; } },
      { kind: 'info', label: 'Dice: hit window (measured)', get: () => {
        const d = dice.params;
        return (d.size * d.pickupRadius + d.pickupPad).toFixed(3) + ' u radius  ·  die '
          + d.size.toFixed(2) + ' u'; } },
      // v9 · Georgs Autopilot-Befund als Protokoll: WER hat den Kurs bewegt?
      { kind: 'info', label: 'Course log (v9 · who moved the heading)', get: () => {
          if (!kursLog.length) return '— no servo event yet · fly a while without steering, then read this';
          const z = kursLog.slice(-6).map((e) => e.t + ' s ' + e.ursache + ' ' + (e.grad >= 0 ? '+' : '') + e.grad + '°'
            + (e.ursache === 'avoid'
                ? (e.nah != null ? ' (obstacle ' + e.nah + ' u away, its radius ' + e.r
                                   + (e.drang != null ? ', urgency ' + e.drang : '') + ')'
                                 : ' (⚠ NO obstacle in the result — fifth writer?)')
                : ''));
          return z.join('  ·  ') + (kursUnbekannt ? '  ·  ⚠ ' + kursUnbekannt + ' with NO known cause' : '')
            + '  ·  writers: avoid / coast seeking / die swing / you'; } },
      { kind: 'note', text: 'Georg, 1.9.: „im Auto-Pilot-Flug korrigiert man zwischendurch leicht den Kurs rechts/links, ohne Steuerung oder Kollision…?“ — documented as BUG-07, not guessed at. Four writers feed the ONE course servo (S7b): obstacle avoidance from kollision.query, coast seeking (default OFF, so it should be silent unless you switched it on), the red-die swing, and you. The log above names the cause of every servo event with its angle and, for avoidance, the distance to the obstacle, the obstacle’s own radius and the urgency 0…1 — read straight off landmark-collide’s result object (offset / speedCap / near / kind / pen), so the next occurrence identifies itself instead of being reasoned about. If entries read „avoid“ with an obstacle whose distance is well outside its radius, the avoidance reaches farther than the prop looks; if they read „avoid“ with no obstacle in the result, or „unknown“, a fifth writer exists and that is the real bug.' },
      { kind: 'toggle', label: 'Coast seeking', get: () => landAn,
        set: (on) => { landAn = !!on; if (!on) { landZiel = 0; } } },
      { kind: 'info', label: 'Coast seeking', get: () => (ueberWasserS > 0
        ? Math.round(ueberWasserS) + ' s over water  ·  ' + Math.round(landOffset * 180 / Math.PI) + '° toward land'
        : 'over land · idle') },
      { kind: 'toggle', label: 'Impact pebbles', get: () => staubAn,
        set: (on) => { staubAn = !!on; if (!on) staub.setEnabled(false); else staub.setEnabled(true); } },
      { kind: 'info', label: 'Impact pebbles', get: () => {
        const r = staub.report();
        return r.an ? r.lebend + ' in air · max ' + r.maxPx + ' px · threshold '
          + (aglBasis * STAUB_ANTEIL).toFixed(3) + ' u (cruise ' + aglBasis.toFixed(3) + ')' : 'off'; } },
      { kind: 'slider', label: 'Pebble size cap', min: 6, max: 60, step: 2,
        get: () => staub.maxPx, set: (v) => staub.setMaxPx(v),
        fmt: (v) => v + ' px on screen' },
      { kind: 'info', label: 'Collect beat', get: () => {
        const r = flug.report();
        return r.modell + ' · hold ' + r.halt + ' s · stiffness ' + r.steifigkeit.join('/')
          + (r.unterwegs ? '  ·  ' + r.phasen.join('/') + ' @ ' + r.alterS + ' s' : '')
          + (r.verloren ? '  ·  ⚠ ' + r.verloren + ' TIMED OUT' : ''); } },
      { kind: 'slider', label: 'Collect: calm', min: 10, max: 60, step: 2,
        get: () => flug.params.posStiff,
        set: (v) => { flug.params.posStiff = v; flug.params.sclStiff = v + 4; },
        fmt: (v) => (v <= 18 ? 'chilled' : v <= 32 ? 'measured' : 'brisk') + '  ·  ' + v },
      { kind: 'slider', label: 'Collect: look time', min: 0.2, max: 2.5, step: 0.05,
        get: () => flug.params.hold, set: (v) => { flug.params.hold = v; },
        fmt: (v) => v.toFixed(2) + ' s after the card settles' },
      { kind: 'note', text: 'One motion model for the whole collect: second-order springs, quoted from card-carrier.spring() — the same function that drives the carpet roll, pitch and edge curl. Ease in/out is free (a spring starts and ends at zero velocity), phase changes only swap the TARGET so nothing can jump at a seam, and "chilled" is one number: stiffness. The look time starts when the spring has SETTLED, not after a guessed wait.' },
      { kind: 'info', label: 'Fly-around', get: () => {
        const r = kollision.report();
        return r.umfliegen + ' obstacles · ' + r.reagieren + ' signposts · '
          + (r.drin ? 'INSIDE, ' + r.ausweichwinkel + '° off course' : 'clear')
          + ' · ' + r.reaktionen + ' reactions' + (kursServo ? ' · servo on' : ''); } },
      { kind: 'info', label: 'Dice', get: () => {
        const d = dice.params;
        return d.size.toFixed(2) + ' u · ' + (d.world ? 'world-anchored, floating' : 'seats on player')
          + ' · body L ' + d.bodyLift.toFixed(2) + ' · pop ' + popPunkte; } },
      // ── S9a · Der Lichthaushalt, ablesbar ────────────────────────────────────────────────
      { kind: 'info', label: 'Light budget', get: () => budget.zeile(globe.mesh) },
      // ── v10 · Slice 1 · Die Impact-Tabelle, ablesbar ─────────────────────────────────────
      // Eine Zeile für 24 Zellen: wie viele je gefeuert haben, ob eine unbekannte Zelle
      // angefragt wurde, und ob E-29 hält (höchstens drei Beats auf t=0). Der Knopf feuert die
      // Zellen der Reihe nach durch — damit „die Impacts laufen“ eine Zahl ist, keine Meinung.
      { kind: 'info', label: 'Mech impact (v10 · 24 cells)', get: () => mechImpact.tor() },
      { kind: 'info', label: 'Card carpets (v10)', get: () => teppiche.tor() },
      { kind: 'button', label: 'Fire the next impact cell (test)', onClick: () => {
        const E = ['kinetisch', 'heiss', 'nass', 'elektrisch'], F = ['erde', 'metall', 'knochen', 'luft', 'wasser', 'schild'];
        const i = (impactProbe++) % (E.length * F.length);
        const e = E[Math.floor(i / F.length)], f = F[i % F.length];
        mechImpact.treffer(e, f, { pos: carpet.worldPos(), dir: kaskadeRichtung(), strength: 1 });
        sagen('impact ' + e + ' → ' + f);
      } },
      // ── v4 · Slice B · Die Kaskadenschicht, ablesbar ─────────────────────────────────────
      // Ohne diese Zeile ist „die Effekte feuern alle gleichzeitig" eine Meinung. Mit ihr ist es
      // eine Zahl: `max t=0 beats` gegen die Grenze 3 (E-29).
      { kind: 'info', label: 'FX cascades', get: () => (fx ? fx.zeile() : '—') },
      { kind: 'info', label: 'Camera trauma', get: () => {
        if (!wucht) return '—';
        const r = wucht.report();
        return r.jetzt.toFixed(3) + ' now · peak ' + r.spitze + ' · ' + r.anlaesse + ' hits · last '
          + (r.letzter || '—') + '  ·  ' + r.kanaele + '  ·  ' + r.abkling
          + (r.unbekannteNamen ? '  ·  ⚠ ' + r.unbekannteNamen + ' unknown weight names' : ''); } },
      { kind: 'info', label: 'FX self-test (must be all ✓)', get: () => (fx ? fx.selbsttest().join('   ') : '—') },
      { kind: 'info', label: 'Trauma self-test (must be all ✓)', get: () => (wucht ? wucht.selbsttest().join('   ') : '—') },
      { kind: 'info', label: 'Sound variance', get: () => {
        const r = audio.report();
        return 'pitch applied ' + (r.rateAngewandt || 0) + '× · without effect '
          + (r.rateOhneWirkung || 0) + '× (synth branch has no file, so no playback rate)'; } },
      { kind: 'button', label: 'Fire card.collect (test)',
        onClick: () => { if (fx) fx.fire('card.collect', { pos: carpet.worldPos(), dir: kaskadeRichtung(), strength: 1 }); } },
      { kind: 'button', label: 'Fire ground.touch (test)',
        onClick: () => { if (fx) fx.fire('ground.touch', { pos: carpet.worldPos(), dir: kaskadeRichtung(), strength: 1 }); } },
      // ── v5 · Slice C · Der PRÜFSTAND im Panel ────────────────────────────────────────────
      // Er lag als Modul im Projekt und war von nirgends importiert — gebaut und nicht
      // angeschlossen, also genau der Kernbefund des Critique, angewandt auf das eigene
      // Werkzeug. Ein Prüfstand, den nur ein Chatverlauf aufrufen kann, existiert nicht.
      // Jetzt sind die vier Schleifen aus D-08 §15 vier Knöpfe, und ihre Ergebnisse landen im
      // Blatt (Text) oder als Bild mit Download — Georg liest keine Konsole.
      { kind: 'info', label: 'Test bench', get: () => (ps ? ps.zeile() : 'wiring…') },
      { kind: 'button', label: 'Loop A · frame strip · card.collect',
        onClick: () => { if (ps) zeigeBild(ps.loopA('card.collect'), 'Loop A · card.collect'); } },
      { kind: 'button', label: 'Loop A · frame strip · ground.touch',
        onClick: () => { if (ps) zeigeBild(ps.loopA('ground.touch'), 'Loop A · ground.touch'); } },
      { kind: 'button', label: 'Loop A · frame strip · intro.handover',
        onClick: () => { if (ps) zeigeBild(ps.loopA('intro.handover'), 'Loop A · intro.handover'); } },
      { kind: 'button', label: 'Loop B · beat audit · all cascades',
        onClick: () => { if (ps) zeigeBericht(loopText('Loop B · beat audit', ps.loopB())); } },
      { kind: 'button', label: 'Loop C · 30 s gameplay simulation',
        onClick: () => { if (ps) zeigeBericht(loopText('Loop C · gameplay', ps.loopC())); } },
      { kind: 'button', label: 'Loop D · scene invariants per cascade',
        onClick: () => { if (ps) zeigeBericht(loopText('Loop D · invariants', ps.loopD())); } },
      { kind: 'info', label: 'Shader pre-warm', get: () => (warmMs == null ? 'not yet'
        : warmMs + ' ms · ' + warmWas) },
      { kind: 'note', text: 'The test bench drives the world with step(dt) — never requestAnimationFrame. Measured three times this build: in a hidden tab rAF is throttled to almost nothing, so a bench whose clock the browser sets measures the viewer\'s attention along with the effect. Tile 0 of every frame strip is the CONTROL: the same shot before the cascade was fired. Without it a strip is twelve similar pictures and proves nothing — the proof is the difference between tile 0 and tile 1.' },
      { kind: 'info', label: 'Card variety', get: () => {
        const r = sky.deckReport();
        // ⚠ **Der Geltungsbereich war der Fehler, nicht die Zahl.** Diese Zeile meldete
        // „0 duplicate titles" und stimmte dabei: sie verglich die sechs Flugkarten
        // untereinander. Ein Duplikat gegen die 32 Wegweiser-Blätter war für sie nicht
        // sichtbar — und das war Georgs Befund. Also wird jetzt GEGEN die Welt geprüft.
        const inWelt = new Set(tuerme.titel());
        const doppelt = r.jetzt.filter((c) => inWelt.has(c.titel)).length;
        if (sky.ankerModus) return r.jetzt.length + ' sky cards anchored over terrain cards (' + sky.offen + ' still to collect)'
          + '  ·  ' + doppelt + ' motifs also standing as a signpost — by design in v11 (one deck, one layer; slice 4 decides what a signpost shows)'
          + '  ·  ' + r.jetzt.filter((c) => c.art === true).length + ' with artwork';
        return r.deckGroesse + ' in deck · idx ' + r.nextIdx
          + (r.doppelteTitel ? '  ·  ⚠ ' + r.doppelteTitel + ' duplicate titles on screen'
                             : '  ·  all ' + r.jetzt.length + ' distinct')
          + (doppelt ? '  ·  ⚠ ' + doppelt + ' also standing as a signpost'
                     : '  ·  0 shared with signposts (' + inWelt.size + ' motifs)')
          + '  ·  ' + r.jetzt.filter((c) => c.art === true).length + ' with artwork'; } },
      { kind: 'info', label: 'Stack sheets', get: () => {
        const r = hud.report();
        return r.cards + ' collected · ' + r.mitArtwork + ' with artwork'
          + (r.mitRueckseite ? '  ·  ⚠ ' + r.mitRueckseite + ' still backside' : '  ·  none on backside'); } },
      { kind: 'note', text: 'A card in flight is the biggest, longest-looked-at card on screen — so it now has PRIORITY in the artwork pump, not exclusion. It was excluded (state !== idle), which meant the one card being presented was the only one that could never get its motif; after arrival its slot is recycled with new data, so the sheet kept the backside forever. Measured seconds after load: texture widths [720, 720, 900, 900, 720, 900] — 720 is the backside, 900 the artwork. That is why only the FIRST collect showed it.' },
      { kind: 'info', label: 'Signpost sheets', get: () => {
        const r = papier.report(), t = tuerme.report();
        if (!r.bereit) return r.laeuft ? 'loading…' : '⚠ box fallback' + (r.fehler ? ' · ' + r.fehler : '');
        return (r.quelle === 'eigen' ? 'built sheet' : 'GLB pillow')
          + ' · ' + r.seiten + '-sided · AR ' + r.format
          + ' · curl ' + r.tiefe + ' u = ' + r.anteil + ' % of width'
          + ' · ' + t.blaetter + ' sheets from ' + t.deck + ' cards'
          + (t.verbraucht > t.deck ? '  ·  ⚠ ' + (t.verbraucht - t.deck) + ' duplicates' : '  ·  0 duplicates'); } },
      { kind: 'note', text: 'BUG-01 measured, not guessed: 38 card textures in the scene, 8 pairs byte-identical at 16×9 (distance 0.00) while every other pair averaged 73.7/255 apart — so the artwork pipeline was never the problem. Two causes, both in the ALLOCATION: the towers stepped the deck by 3 with up to 4 tiers (tower 0 took slots 0–3, tower 1 started at 3), and signposts shared slots 0…5 with the cards in flight. The old metric said "0 duplicate titles" because it compared the six flying cards only against each other — a duplicate spread across two systems is invisible to both.' },
      { kind: 'slider', label: 'Signpost curl', min: 0, max: 0.25, step: 0.01,
        get: () => papier.params.bend,
        set: (v) => { papier.params.bend = v; tuerme.rebuild(turmSites); kollisionZahl = kollisionSetzen(); },
        // `bend` heißt jetzt „Wölbungstiefe als Anteil der Blattbreite" — eine Zahl, deren
        // Einheit man lesen kann. Über etwa 0,12 wird aus der Wölbung eine Rinne.
        fmt: (v) => (v < 0.015 ? 'flat sheet'
          : (v * 100).toFixed(0) + ' % of width  ·  ' + (v > 0.12 ? '⚠ trough' : 'card')) },
      { kind: 'slider', label: 'Signpost edge', min: 0, max: 0.03, step: 0.002,
        get: () => papier.params.rand,
        set: (v) => { papier.params.rand = v; tuerme.rebuild(turmSites); kollisionZahl = kollisionSetzen(); },
        // Georgs ERSTE Rüge war „rechteckige Box". Die Randunruhe ist die Antwort darauf, und
        // sie ist ein Regler, weil „handgeschnitten" und „zerfetzt" nur wenige Promille
        // Weltmaß auseinanderliegen.
        fmt: (v) => (v < 0.001 ? 'ruler-straight'
          : (v * 100).toFixed(1) + ' % of width  ·  ' + (v > 0.02 ? '⚠ torn' : 'hand-cut')) },
      { kind: 'info', label: 'Lighting model', get: () => {
        const r = phong.report();
        const m = budget.materials();
        // Ehrlich formuliert: die Zahl, die zählt, ist wie viele PBR-Materialien in der WELT
        // stehen — nicht wie viele der Wandler umgebaut hat. 0 umgebaut bei 0 PBR ist Erfolg,
        // 0 umgebaut bei 5 PBR wäre ein stiller Ausfall. Das muss man unterscheiden können.
        const weltPbr = m.standard - m.mitEnvMap;   // mit envMap = ausdrücklich registriert (Pet)
        return (m.phong + m.lambert) + ' non-pbr (' + m.phong + ' phong / ' + m.lambert + ' lambert)'
          + ' · ' + m.mitEnvMap + ' pbr by design (pet)'
          + (weltPbr > 0 ? '  ·  ⚠ ' + weltPbr + ' UNCLAIMED PBR' : '  ·  no stray pbr')
          + (phongGeprueft ? '' : '  ·  checking…')
          + (r.umgebaut ? '  ·  ' + r.umgebaut + ' converted' : ''); } },
      { kind: 'note', text: 'Measured, not assumed: the props already load as MeshLambert (source-faithful, CampsiteScene.ts:353), so S9c needed no conversion — to-phong stays as a WATCHDOG that flags stray PBR entering the world later, because that is exactly what splits the light budget again. Units: everything here is LINEAR luminance, because that is where three multiplies light. The earlier sRGB figures in the palette table were a second unit for the same quantity and could not be compared. || The scene had FIVE brightness contributors and no owner: seven preset lights (source-faithful), an eighth light I added anonymously, a scene-wide PMREM environment I added, per-object emissive, and an albedo calibrated for none of them. Every global fix repaired one material class and broke the other — that is the whack-a-mole engine, by construction. Now: buildLightRig is the only light creator (petFill is a named preset entry that dims at night), the environment lives on the pet materials only, the world is one lighting model, and the palette sits in the band the rig is calibrated for.' },
      { kind: 'info', label: 'Re-attach watchdog', get: () => wiederTakte + ' ticks'
        + (wiederFehler ? '  ·  ' + wiederFehler + ' errors · ' + wiederLetzterFehler : '  ·  clean') },
      { kind: 'info', label: 'Frame loop', get: () => takt.bilder + ' frames · '
        + (frameFehler ? frameFehler + ' ERRORS · ' + frameLetzterFehler : 'clean') },
      { kind: 'button', label: 'Copy diagnostics (opens a sheet you can copy from)',
        onClick: () => zeigeBericht(berichtText()) },
    ] },
  ];

  // v10 · Die Vorauswahl ist der Rettungsweg für ⌘C — aber sie darf nicht STEHEN bleiben.
  // Georg, 2.9.: nach dem Kopieren waren HUD-Elemente hellblau markiert. Eine liegengebliebene
  // Auswahl macht den nächsten Zieh-Klick zur Textmarkierung quer über die Oberfläche — das ist
  // keine Panne des Zettels, sondern seine Nachwirkung.
  // Also: beim Schließen räumt er seine eigene Auswahl weg. Die zweite Hälfte der Reparatur
  // steht im Panel-CSS (`user-select:none` auf dem HUD selbst) — ein HUD liest man, man
  // markiert es nicht.
  const entwaehlen = () => {
    try { const s = window.getSelection(); if (s) s.removeAllRanges(); } catch (e) {}
  };
  // ── v3 · S7c · Der Kopier-Knopf, zweiter Anlauf ───────────────────────────────
  // Georg: „copy button funktioniert nicht!" — richtig, und die Ursache ist strukturell, nicht
  // ein Tippfehler: `navigator.clipboard.writeText` braucht einen sicheren Kontext UND eine
  // Berechtigung (`allow="clipboard-write"`), die eine eingebettete Seite oft nicht hat. Mein
  // Fehlerpfad schrieb dann in die KONSOLE — also genau dorthin, wo Georg nicht hinkommt.
  // Das ist dieselbe Fehlerklasse wie „eine Abwesenheit, die ein Werkzeug nicht sehen kann":
  // ein Ausweg, der die Beschränkung ignoriert, die ihn nötig gemacht hat.
  //
  // Jetzt: der Text erscheint als BLATT auf dem Schirm, vorausgewählt. Damit ist ⌘C/Strg+C immer
  // der Rettungsweg, ganz ohne Berechtigung; `execCommand('copy')` (funktioniert in iframes) und
  // die moderne API laufen als Zugabe. Ein sichtbarer Text kann nicht „nicht funktionieren".
  //
  // ⚠ Das Blatt hängt an der LEBENDEN Bühne (`buehne()`), NICHT in `#kfb-ui`: `#kfb-ui` hat position + z-index und
  // öffnet damit einen Stacking-Context — ein Kind darin kann das Panel nie überdecken, egal wie
  // groß seine Zahl ist. Genau der Befund aus S3h.3, hier zum zweiten Mal bezahlt und vermieden.
  function berichtText() {
    const z = [];
    z.push('KFB Travel Globe v13 · ' + new Date().toISOString());
    z.push('seed ' + seed + ' · ' + terrainType + ' · ' + timeOfDay
           + ' · land ' + Math.round((globe.report().landAnteil || 0) * 100) + ' %');
    z.push('biome ' + JSON.stringify(biomReport()));
    z.push('frames ' + (takt.bilder === 0 ? 'none yet'
           : Math.round(1000 / Math.max(1, frameMs)) + ' fps / ' + frameMs.toFixed(1) + ' ms')
           + ' · draw calls ' + renderer.info.render.calls);
    z.push('cards ' + JSON.stringify(sky.formatReport())
           + ' · in world ' + sky.count + ' · flight ' + JSON.stringify(flug.report()));
    z.push('card window ' + ((0.04 * sky.params.passRadius + sky.params.passPad) * 2).toFixed(3)
           + ' x ' + ((0.023 * sky.params.passRadius + sky.params.passPad) * 2).toFixed(3) + ' u');
    z.push('collide ' + JSON.stringify(kollision.report()));
    z.push('dice ' + JSON.stringify(dice.report()) + ' · pop ' + popPunkte);
    z.push('towers ' + JSON.stringify(tuerme.report()));
    z.push('props ' + JSON.stringify(marken.report()));
    z.push('card variety ' + JSON.stringify(sky.deckReport()));
    z.push('--- light budget (S9) ---');
    z.push(budget.bericht(globe.mesh));
    z.push('lighting model ' + JSON.stringify(phong.report()));
    z.push('--- v5 · Slice D · parameters ---');
    for (const m of [carpet, rig, trail, lines, petKin, leaves, hud, wake, rauch, hudFlug].filter(Boolean))
      z.push('  ' + (m.name || '?') + ': ' + (m.zeile ? m.zeile() : 'no report'));
    z.push('  biome: ' + biomeZeile());
    z.push('--- v5 · Slice C · test bench ---');
    z.push('pre-warm ' + (warmMs == null ? 'not yet' : warmMs + ' ms · ' + warmWas));
    z.push('bench ' + (ps ? ps.zeile() : 'not wired'));
    z.push('fx ' + (fx ? fx.zeile() : '—'));
    z.push('pebbles ' + JSON.stringify(staub.report()));
    z.push('coast seeking ' + Math.round(ueberWasserS) + ' s over water · '
           + Math.round(landOffset * 180 / Math.PI) + ' deg toward land');
    z.push('watchdog ' + wiederTakte + ' ticks · ' + wiederFehler + ' errors'
           + (wiederLetzterFehler ? ' · ' + wiederLetzterFehler : ''));
    z.push('frame loop ' + takt.bilder + ' frames · ' + frameFehler + ' errors'
           + (frameLetzterFehler ? ' · ' + frameLetzterFehler : ''));
    return z.join('\n');
  }

  function zeigeBericht(txt) {
    if (berichtBlatt) berichtBlatt.remove();
    const wrap = document.createElement('div');
    wrap.id = 'kfb-bericht';
    wrap.style.cssText = 'position:absolute;inset:0;z-index:10000;display:flex;'
      + 'align-items:center;justify-content:center;background:rgba(20,16,12,.42);'
      + 'font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace';
    const card = document.createElement('div');
    card.style.cssText = 'width:min(760px,100% - 32px);max-height:78%;display:flex;flex-direction:column;'
      + 'gap:10px;padding:16px 18px;border-radius:10px;background:#efe6d0;color:#1f1a14;'
      + 'box-shadow:0 18px 46px rgba(0,0,0,.42)';
    const kopf = document.createElement('div');
    kopf.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;'
      + "font:600 14px/1.2 'Special Elite',ui-monospace,monospace";
    const titel = document.createElement('span');
    titel.textContent = 'Diagnostics · selected, press ⌘C / Ctrl+C';
    const zu = document.createElement('button');
    zu.textContent = '×';
    zu.style.cssText = 'border:0;background:none;color:#1f1a14;font-size:22px;line-height:1;'
      + 'cursor:pointer;opacity:.55;padding:0 2px';
    zu.onmouseenter = () => { zu.style.opacity = '1'; };
    zu.onmouseleave = () => { zu.style.opacity = '.55'; };
    zu.onclick = () => { entwaehlen(); wrap.remove(); berichtBlatt = null; };
    kopf.appendChild(titel); kopf.appendChild(zu);
    const feld = document.createElement('textarea');
    feld.className = 'kfb-bericht';
    feld.readOnly = true;
    feld.value = txt;
    feld.style.cssText = 'flex:1;min-height:220px;resize:none;border:1px solid rgba(31,26,20,.22);'
      + 'border-radius:6px;padding:10px 12px;background:#f7f1e2;color:#1f1a14;'
      + 'font:12px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace';
    const fuss = document.createElement('div');
    fuss.style.cssText = 'font:11px/1.4 ui-monospace,monospace;opacity:.62';
    card.appendChild(kopf); card.appendChild(feld); card.appendChild(fuss);
    wrap.appendChild(card);
    wrap.addEventListener('mousedown', (e) => { if (e.target === wrap) { wrap.remove(); berichtBlatt = null; } });
    (buehne() || stage).appendChild(wrap);
    berichtBlatt = wrap;
    feld.focus(); feld.select();
    // Zugabe, in dieser Reihenfolge: `execCommand` läuft ohne Berechtigung, die moderne API nicht.
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(
        () => { fuss.textContent = 'Copied to clipboard automatically.'; },
        () => { fuss.textContent = ok ? 'Copied to clipboard automatically.'
                                      : 'Clipboard blocked here — the text is selected, just press ⌘C / Ctrl+C.'; });
    } else {
      fuss.textContent = ok ? 'Copied to clipboard automatically.'
                            : 'The text is selected — press ⌘C / Ctrl+C.';
    }
  }

  // ── v5 · Slice C · Ein Beweisbild auf dem SCHIRM, nicht in der Konsole ────────────────────
  // Dasselbe Blatt wie `zeigeBericht`, nur mit Bild und Download. Der Grund ist derselbe wie
  // beim Kopier-Knopf: ein Weg, der eine Berechtigung oder eine Konsole braucht, ist für Georg
  // kein Weg. Ein sichtbares Bild kann nicht „nicht funktionieren".
  function zeigeBild(res, titelText) {
    if (!res || !res.dataUrl) return;
    if (berichtBlatt) berichtBlatt.remove();
    const wrap = document.createElement('div');
    wrap.id = 'kfb-bericht';
    wrap.style.cssText = 'position:absolute;inset:0;z-index:10000;display:flex;'
      + 'align-items:center;justify-content:center;background:rgba(20,16,12,.52);'
      + 'font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace';
    const card = document.createElement('div');
    card.style.cssText = 'width:min(1180px,100% - 32px);max-height:88%;display:flex;flex-direction:column;'
      + 'gap:10px;padding:14px 16px;border-radius:10px;background:#efe6d0;color:#1f1a14;'
      + 'box-shadow:0 18px 46px rgba(0,0,0,.42)';
    const kopf = document.createElement('div');
    kopf.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:12px;'
      + "font:600 14px/1.2 'Special Elite',ui-monospace,monospace";
    const titel = document.createElement('span');
    titel.textContent = titelText || 'Frame strip';
    const rechts = document.createElement('span');
    rechts.style.cssText = 'display:flex;align-items:center;gap:12px';
    const dl = document.createElement('a');
    dl.textContent = 'download .png';
    dl.href = res.dataUrl;
    dl.download = (titelText || 'loopA').replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.png';
    dl.style.cssText = 'font:11px/1 ui-monospace,monospace;color:#1f1a14;opacity:.7';
    const zu = document.createElement('button');
    zu.textContent = '×';
    zu.style.cssText = 'border:0;background:none;color:#1f1a14;font-size:22px;line-height:1;'
      + 'cursor:pointer;opacity:.55;padding:0 2px';
    zu.onclick = () => { wrap.remove(); berichtBlatt = null; };
    rechts.appendChild(dl); rechts.appendChild(zu);
    kopf.appendChild(titel); kopf.appendChild(rechts);
    const bild = document.createElement('img');
    bild.src = res.dataUrl;
    bild.style.cssText = 'max-width:100%;flex:1;min-height:0;object-fit:contain;'
      + 'border:1px solid rgba(31,26,20,.22);border-radius:6px;background:#0d0d10';
    const fuss = document.createElement('div');
    fuss.style.cssText = 'font:11px/1.5 ui-monospace,monospace;opacity:.72;white-space:pre-wrap';
    const r = res.report || {};
    fuss.textContent = 'dt ' + r.dt + ' s · Nyquist ' + r.nyquistHz + ' Hz · ' + r.bilder + ' tiles · '
      + (r.nah ? 'near cam' : 'game cam') + ' · '
      + (r.kontrollprobe ? 'tile 0 = control (not fired)' : '⚠ no control tile')
      + ' · hidden:' + r.hidden
      // ⚠ Diese vier Zahlen beschreiben den Streifen, sie sind KEIN Lecktest: sie stammen aus je
      // einem einzelnen `info`-Abruf, und `renderer.info` wird bei jedem `render` genullt. Der
      // Lecktest ist Loop D (zweiter Schuss, Band aus einer Kontrollprobe).
      + (r.vor && r.nach ? '\nlast render before → after (descriptive, not a leak test — that is Loop D)'
         + '\ndraw calls ' + r.vor.calls + ' → ' + r.nach.calls
         + ' · geometries ' + r.vor.geo + ' → ' + r.nach.geo
         + ' · textures ' + r.vor.tex + ' → ' + r.nach.tex
         + ' · frame errors ' + r.vor.fehler + ' → ' + r.nach.fehler : '');
    card.appendChild(kopf); card.appendChild(bild); card.appendChild(fuss);
    wrap.appendChild(card);
    wrap.addEventListener('mousedown', (e) => { if (e.target === wrap) { wrap.remove(); berichtBlatt = null; } });
    (buehne() || stage).appendChild(wrap);
    berichtBlatt = wrap;
  }

  /** Die Ergebnisse der Schleifen B/C/D als lesbarer Text — eine Zeile je Sache. */
  function loopText(titel, o) {
    const z = [titel + ' · ' + new Date().toISOString(),
               'hidden:' + o.hidden + ' · dt ' + o.dt + ' s'];
    if (o.toleranz != null) z.push('tolerance ' + o.toleranz + ' s (one frame)');
    if (o.hinweis) z.push(o.hinweis);
    z.push('');
    if (o.zeilen) {
      for (const r of o.zeilen) {
        if (r.pruefung && r.erstmalig) {
          z.push(r.kaskade + '  ·  control drift ' + (r.drift >= 0 ? '+' : '') + r.drift + ' draw calls');
          z.push('   1st fire   ' + r.erstmalig.join('  ·  '));
          z.push('   2nd fire   ' + r.pruefung.join('  ·  ') + '   ← the leak test');
        } else if (r.pruefung) z.push(r.kaskade.padEnd(18) + r.pruefung.join('  ·  '));
        else z.push(r.kaskade.padEnd(18) + r.gespielt + '/' + r.spielbar + ' playable beats'
                    + (r.beats !== r.spielbar ? ' (of ' + r.beats + ' scored)' : '')
                    + ' · ' + (r.zeiten || []).map((v) => v.toFixed(3)).join(' / ')
                    + ' · t=0 beats ' + r.nullBeats + ' · ' + r.urteil);
      }
    }
    if (o.kontrolle) { z.push(''); z.push('control probe (must be all ✓):');
                       for (const k of o.kontrolle) z.push('  ' + k); }
    if (o.gleichzeitigMax != null) {
      z.push('');
      z.push('steps ' + o.schritte + ' over ' + o.sekunden + ' s · max simultaneous cascades '
             + o.gleichzeitigMax + ' · slowest step ' + o.schrittMsMax + ' ms');
      z.push('beats ' + o.beats + ' · dropped ' + o.verworfen + ' · errors ' + o.fehler);
      for (const k of o.invarianten || []) z.push('  ' + k);
    }
    return z.join('\n');
  }

  // ══ v4 · Slice B · Die Verdrahtungsebene ═══════════════════════════════════════════════════
  // D-08 §11.4, der Kernbefund des Critique: **dieses Projekt hat kein Bau-Problem, sondern ein
  // Verdrahtungs-Problem.** Fünf gebaute Systeme wurden von keinem Ereignis erreicht oder standen
  // auf aus — `petKin.kick` (nie gerufen), `rig.shake` (drei Aufrufer), `playSFX(…, rate)` (nie
  // übergeben), `zyklus` (aus, Slice A), `schatten` (aus, Slice A).
  // Also: EIN Eingang (`fx`), EIN Eigentümer der Wucht (`wucht`), die Zeitachsen in DATEN
  // (`fx-script.js`). Die Wirker sind die einzige Stelle, an der dieser Runner noch weiß, WIE
  // etwas passiert — WANN steht in der Partitur.
  wucht = createTrauma({ THREE });
  rig.setTraumaSource(wucht);
  fx = createFxBus({
    wirker: {
      // Klang mit Tonhöhen-Varianz. `opt.rate` zieht `audio-switch` je Einsatz neu.
      sfx: (name, vol, opt) => audio.sfx(name, vol, opt),
      // Wucht: Name aus der Gewichtstabelle, Richtung aus dem Kontext der Kaskade.
      trauma: (name, ctx) => wucht.add(name, ctx && ctx.dir),
      // Sidechain-Dip. `travel-audio.duck` ist derselbe Eingang, den der Erzähler benutzt (0,62);
      // hier flacher und viel kürzer. Die Freigabe zählt `duckT` im Frame-Loop herunter — ein
      // `setTimeout` wäre eine zweite Uhr, und die läuft im verdeckten Tab anders (PM-50).
      duck: (menge, dauer) => { audio.duck(true, menge); duckT = Math.max(duckT, dauer || 0.25); },
      // Tempostreifen + Radial-Blur. `einschlagT` ist der vorhandene Nachhall-Zähler.
      post: (strength) => { einschlagT = Math.max(einschlagT, strength || 0.45); },
      // Der Staub-Emitter, jetzt auch für PICKUPS. Vorher hatte er nur den Bodenaufprall
      // (D-08 §4: „keine Partikel bei Pickup — und das ist die billigste Lücke").
      dust: (n, kraft, ctx) => {
        if (!staub || !staub.burst) return;
        // `burst(p, normal, impuls, anzahl)` — die Signatur will die KINETIK des Verursachers,
        // nicht nur eine Menge („die Partikel folgen der jeweiligen Impact-Kinetik"). Bei einem
        // Pickup ist der Verursacher der Flug: Normale = Standortnormale, Impuls = Flugrichtung.
        const p = (ctx && ctx.pos) || carpet.worldPos();
        const nrm = p.clone().normalize();
        const imp = (ctx && ctx.dir) ? ctx.dir.clone().multiplyScalar(-(kraft || 0.5))
                                     : nrm.clone().multiplyScalar(kraft || 0.5);
        staub.burst(p, nrm, imp, Math.min(20, n || 12));
      },
      // Das Pet. Das ist die Zeile, um die es in D-08 §11.1 geht.
      pet: (was, betrag) => {
        if (!petKin) return;
        if (was === 'kick') petKin.kick(betrag);
        else if (was === 'roll') petKin.rollOnce();
        else if (was === 'jump') petKin.jump();
      },
      // Tempo als RAMPE, nicht als Sprung (PM-19: ein Sollwert, der springt, ist kein Ziel).
      speed: (betrag, rampe) => { schubZiel += betrag || 0; schubRampe = Math.max(0.05, rampe || 0.15); },
      // FOV-Stoß über den Trauma-Kanal — dort ist der EINE Schreiber (camera-rig addiert).
      fov: (grad, dauer) => { wucht.add(Math.min(1, (grad || 3) / (wucht.params.ampFov || 5)) * 0.5); },
      // v5 · Slice F · **Der Wirker, auf den `water.enter` seit Slice B wartet.** Die Kaskade
      // trug den Beat `{ t: 0, wake: ['burst'] }` und meldete den fehlenden Wirker beim Laden;
      // Loop B wies ihn als „1 vorgemerkt" aus. Jetzt ist der Platz besetzt, und dieselbe Messung
      // sagt es ohne ein Wort Erklärung: `water.enter` springt von 2/2 auf 3/3.
      wake: (art, ctx) => wake.burst(art, Object.assign({ state: carpet.state }, ctx || {})),
      // v6 · Slice E · Teil 2 · E-35 wortwörtlich: „das ist die erste Stelle, an der eine FARBE
      // Bedeutung trägt, ohne dass die Form es tut — also gehört sie in die Kaskadenschicht als
      // eigener Wirker (`glow`), nicht als Materialschalter am Modell". Die DAUERPULSATION gehört
      // dem Schild (es soll auch ohne Ereignis atmen), der STOSS gehört der Partitur.
      glow: (staerke, ctx) => tuerme.glowBurst((ctx && ctx.site) || null, staerke),
      // v5 · Slice G · **Hier, nicht per `setWirker` weiter unten.** Erste Fassung stand nach
      // `fx.defineAll(KASKADEN)` — und `define()` prüft die Wirker BEIM DEFINIEREN. Ergebnis:
      // drei Warnungen je Ladevorgang („Wirker „hud" ist nicht registriert") für etwas, das zur
      // Laufzeit tadellos lief, plus ein `unbekannteWirker`-Zähler, der die ganze Sitzung auf 3
      // klebte. **Eine Warnung, die immer steht, wird nicht gelesen** — dieselbe Klasse wie
      // BUG-07 und PM-55, diesmal von mir selbst erzeugt.
      // `hudFlug` ist ein `let` in diesem Bereich und wird erst beim AUFRUF gelesen, also gilt
      // hier dasselbe Muster wie bei `wake`: spät gebautes Ziel, früh registrierter Eingang.
      hud: (betrag, ctx) => { if (hudFlug) hudFlug.kick(betrag, (ctx && ctx.anlass) || null); },
      // v10 · Slice 1 · `mark` ist REGISTRIERT und zählt nur. Das ist Absicht: die Marken
      // gehören dem Decal-Weg von `ink-tail.js` (Slice 2), und ein zweiter Stempel wäre genau
      // der Fehler, den der Mech-Slice schon einmal gemacht hat. Ein registrierter Zähler ist
      // dabei besser als ein fehlender Wirker — sonst stünden 11 Warnungen bei jedem Laden,
      // und eine Warnung, die immer steht, wird nicht gelesen (siehe den `hud`-Absatz oben).
      mark: () => mechImpact.markeWirker(),
      // HUD. Wird unten nachgereicht, sobald `hud` gebaut ist — `setWirker` statt einer zweiten
      // Reihenfolge-Abhängigkeit.
    },
  });
  fx.defineAll(KASKADEN);
  // v10 · Slice 1 · Die 24 Impact-Kaskaden kommen aus einem GENERATOR, nicht aus 24 Absätzen
  // in `fx-script.js`: sie unterscheiden sich in Ton, Staub, Wucht und Marke — also in DATEN,
  // nicht in Struktur. `mech-impact.js` hält die Tabelle, `define()` prüft sie hier wie jede
  // andere Partitur, und `fx.zeile()` unten zählt sie mit.
  fx.defineAll(mechImpact.kaskaden);
  // ⚠ **Kein `hud`-Wirker.** Die Ankunft im Stapel ist ein EREIGNIS (`card-flight` ruft zur
  // Ankunft zurück), keine Zeit — also feuert sie ihre eigene Kaskade `card.land`, und der HUD
  // bleibt bei `hud.add()`. Ein zweiter Auslöser für denselben Recoil wäre Fehlerklasse 1, und
  // eine geratene Zeit neben einem vorhandenen Rückruf wäre eine zweite Wahrheit.
  // ══ v5 · Slice G · DIE EINFASSUNG ══════════════════════════════════════════════════════════
  // Zielbild §S14: „Würfel, Card-Stapel und Gear-Icon stellen zusammen mit der Wortmarke eine
  // gemeinsame Einfassung, die Elemente sind harmonisiert bzgl. Größe & Flucht."
  // Die Maße stehen in `globe-v5/hud-frame.css` als drei Variablen; hier werden nur die vier
  // Ecken als Ecken MARKIERT — Klassen, keine Positionen. Wer eine Ecke verschiebt, ändert die
  // Variable und trifft alle vier.
  //
  // ⚠ **Kein Wrapper für diese drei.** `.fan`, `.pop` und der Zahnradknopf sind absolut
  // positioniert; ein umgebender `position: relative`-Knoten würde zum Bezugsrahmen ihrer
  // Kinder und die Ecken verschieben. Die Platte ist ein Pseudo-Element, sie braucht keinen
  // eigenen Knoten. Nur die Wortmarke hat einen Träger, und der steht im Template — weil sie
  // eine CSS-Schleife auf `transform` hat und ein zweiter Schreiber Fehlerklasse 1 wäre.
  function markiere(el, name) {
    if (!el) { console.warn('[hud] Ecke „' + name + '" nicht gefunden — die Flug-Reaktion bleibt dort stumm.'); return; }
    el.classList.add('kfb-plate', 'kfb-slot');
    el.dataset.slot = name;
  }
  // ⚠ Das Zahnrad wird ERST WEITER UNTEN gebaut (`gear = createGearIcon` nach dem Panel-Schema).
  // Es hier zu markieren hieße, `null` zu markieren — und `markiere` hätte das brav gemeldet,
  // aber die Ecke wäre stumm geblieben. Also steht sein Aufruf dort, wo es existiert.
  markiere(hud.el && hud.el.querySelector('.pop'), 'pop');
  markiere(hud.el && hud.el.querySelector('.fan'), 'stack');

  // Die Tempo-Zahl in der Nabe. **DOM-Label, nicht CanvasTexture** — die Entscheidung steht mit
  // Begründung in `hud-frame.css`: eine Textur auf der Nabe würde MITDREHEN, und das Zielbild
  // verlangt ausdrücklich „der Rahmen bewegt sich, die Information nicht".
  gearTempo = document.createElement('div');
  gearTempo.id = 'kfb-gear-speed';
  gearTempo.textContent = '0';
  (hud.el || uiRoot).appendChild(gearTempo);

  hudFlug = createHudFlight({ root: hud.el || document.getElementById('tv-hud'),
                              maxBank: carpet.params.maxBank });
  // ⚠ Der Selbsttest wird NICHT hier geloggt: das Zahnrad existiert erst 30 Zeilen weiter unten,
  // und ein Test, der zu früh läuft, meldet „3/4 Träger" als Dauerzustand. Er läuft nach der
  // letzten Markierung — siehe unten. (Genau diese Reihenfolge hat den Zwischenspeicher in
  // `hud-flight.js` vergiftet, bevor er nachprüfte.)
  // Der Einschlag hängt am EREIGNIS, nicht an einer Uhr (E-15): `hud` ist ein Wirker, den die
  // Partituren nennen — kein Abgriff auf `einschlagT`, der eine zweite Wahrheit über denselben
  // Moment wäre. Registriert ist er OBEN, in der Wirker-Tabelle (siehe Kommentar dort).

  console.info('[fx] ' + fx.zeile());
  for (const z of fx.selbsttest()) console.info('[fx-selbsttest] ' + z);
  for (const z of wucht.selbsttest()) console.info('[trauma-selbsttest] ' + z);

  // ── v5 · Slice C · VORWÄRMEN ─────────────────────────────────────────────────────────
  // tinyskies (`Game.ts:1527`) wärmt seinen Collect-Burst beim Laden vor, und der Grund ist
  // unangenehm konkret: **der erste Pickup einer Sitzung ruckelt**, weil dann der Shader
  // kompiliert und die Textur hochgeladen wird. Bei uns betrifft das genau einen Pfad, und man
  // sieht ihm die Falle an: `post-radial` rendert nur, wenn `strength > eps` — sein Shader
  // entsteht also im ersten Kartendurchflug, mitten in dem Moment, den er schmücken soll.
  // Der Rest der Welt ist billiger als seine eigene Buchhaltung: `impact-dust` hängt mit
  // `frustumCulled = false` von Anfang an in der Szene und ist nach dem ersten Bild kompiliert.
  // Deshalb: EIN Aufruf, gemessen, mit Zahl im Panel — keine Vorwärmschleife über alles.
  (function vorwaermen() {
    const t = performance.now();
    const teile = [];
    const p = post.praeludium();
    teile.push(p < 0 ? '⚠ post-radial failed' : 'post-radial');
    try { renderer.compile(scene, camera); teile.push('scene'); }
    catch (e) { teile.push('⚠ scene: ' + ((e && e.message) || e)); }
    warmMs = +(performance.now() - t).toFixed(1);
    warmWas = teile.join(' + ');
    console.info('[warm] ' + warmMs + ' ms · ' + warmWas);
  })();

  gear = createGearIcon({ THREE, onClick: () => { panel.toggle(); gear.setOpen(panel.open); } });  panel = createSettingsPanel({ schema, title: 'Travel Globe v13 · Settings',
                                subtitle: 'G or Esc closes · R opening shot · M mouse mode',
                                onOpen: (on) => { if (gear) gear.setOpen(on); } });
  uiRoot = document.createElement('div');
  uiRoot.id = 'kfb-ui';
  uiRoot.appendChild(gear.el);
  uiRoot.appendChild(panel.el);
  (buehne() || stage).appendChild(uiRoot);
  // v5 · Slice G · Jetzt existiert das Zahnrad — jetzt bekommt es seine Platte.
  markiere(gear && gear.el, 'gear');
  // Jetzt sind alle vier Ecken markiert — jetzt hat der Selbsttest eine Aussage.
  for (const z of hudFlug.selbsttest()) console.info('[hud-flug] ' + z);

  // v7 · Der Fahrzeug-Vertrag meldet sich beim Start — und nur er. Die zwei Messungen
  // schweigen, bis jemand drückt: 48 Strahlen auf 131 072 Dreiecke im Startpfad wären
  // eine halbe Sekunde Ladezeit für eine Zahl, die niemand angefordert hat.
  {
    const vt = vertragTor(fahrzeugIst());
    console.info('[fahrzeug-vertrag] ' + vt.text);
    for (const z of vt.zeilen) console.info('[fahrzeug-vertrag]   ' + z);
  }

  // ── Schüsse: Nasenstrahl wie im Original, Leertaste ──────────────────────
  const shots = [];
  const shotGeo = new THREE.SphereGeometry(0.02, 8, 6);
  const shotMat = new THREE.MeshBasicMaterial({ color: 0xff5a3c, toneMapped: false });
  function fire() {
    if (shots.length > 32) return;
    // v4 · Slice B: ein Schuss ohne Rückstoss liest als Bug (D-08 §1.3). Trauma und Pet-Zucken
    // stehen jetzt in `shot.fire`.
    if (fx) fx.fire('shot.fire', { pos: carpet.worldPos(), dir: kaskadeRichtung(), strength: 1 });
    else audio.sfx('shoot');
    const ray = carpet.shotRay();
    // v6 · Slice E2 · **Zielhilfe im Chill-Mode** (Georgs Vorgabe). Sie biegt die Richtung EINMAL
    // beim Abschuss — nicht das Projektil im Flug, und nicht die Trefferprüfung. Der Unterschied
    // ist der ganze Punkt: eine Zielhilfe, die während des Flugs nachlenkt, nimmt dem Spieler den
    // Schuss weg; eine, die die Nase gerade richtet, gibt ihm den Treffer.
    let dir = ray.direction.clone();
    const hilfe = gegner.imKegel(ray.origin, dir);
    if (hilfe) dir.copy(hilfe.dir);
    const m = new THREE.Mesh(shotGeo, shotMat);
    m.position.copy(ray.origin);
    scene.add(m);
    shots.push({ mesh: m, dir, life: 2.4, vorher: ray.origin.clone() });
  }

  function resize() {
    // Verdeckte Seiten melden mitunter 0 — dann nimm die Fenstermaße, statt auf 1×1 zu rendern.
    const b = buehne() || stage;
    const w = b.clientWidth || innerWidth || 1, h = b.clientHeight || innerHeight || 1;
    renderer.setSize(w, h);
    // v6 · Slice E2 · Die Gegner-Torzeile rechnet Bildschirmpixel und braucht dazu die
    // CANVASHÖHE — `innerHeight` wäre im Editor falsch (das Canvas ist dort eingerückt und
    // kleiner, genau der Fehler, den `card-flight` schon einmal bezahlt hat).
    camera.__canvasH = h;
    post.setSize(w, h, renderer.getPixelRatio());
    rig.resize(w / h);
  }
  addEventListener('resize', resize);
  resize();


  // ══ v4 · Slice B · DER ANTRIEB ═════════════════════════════════════════════════════════════
  // Slice A hat gemessen, warum das der erste Bauteil ist und nicht der Bus: in einem verdeckten
  // Tab drosselt der Browser `requestAnimationFrame` fast auf null — `intro.active` war 10 s nach
  // dem Laden noch `true`. Damit ist **jede zeitbasierte Messung und jedes Bild eines
  // Zustandswechsels aus einem verdeckten Tab wertlos** (PM-50, drittes Mal in zwei Sitzungen).
  //
  // **Ein Prüfstand, dessen Uhr der Browser stellt, misst die Aufmerksamkeit des Zuschauers mit.**
  // Also: `step(dt)` dreht die Welt um genau `dt` weiter, ohne rAF, ohne `performance.now()`.
  // `frameBody(now)` rechnet sein `dt` aus `now - last` — wir geben ihm also `last + dt·1000` und
  // bekommen exakt das gewünschte `dt`. Keine Umstrukturierung, keine zweite Schleife.
  //
  // `freeze()` hält den rAF-Loop an, damit er nicht zwischen zwei `step()` dazwischenfunkt. Ohne
  // ihn hätte der Prüfstand zwei Antriebe — Fehlerklasse 1, in Reinform.
  let eingefroren = false;
  function step(dtSek) {
    const d = Math.max(1e-4, Math.min(0.05, dtSek || 1 / 60));
    try { frameBody(last + d * 1000); return true; }
    catch (e) {
      frameFehler++;
      frameLetzterFehler = (e && e.message) || String(e);
      console.error('[globe] step', e);
      return false;
    }
  }

  function frame(now) {
    // ⚠ **Der Frame-Loop braucht einen Fangkorb — sonst tötet EIN Fehler die ganze Welt, still.**
    // Genau das ist gerade passiert (Georg, 29.8.: „welt/game lädt nicht (hellblauer screen)"):
    // mein Servo-Code las `S.heading` 37 Zeilen VOR `const S = carpet.state` — temporal dead zone,
    // ReferenceError im ersten Bild. Ohne Fangkorb wird dann kein neues `requestAnimationFrame`
    // angefordert: die Schleife ist tot, das Canvas bleibt beim einen Startbild stehen, und das
    // ist der hellblaue Schirm. Der Watchdog tickte munter weiter (291 Ticks, 0 Fehler) und hat
    // genau NICHTS davon gemerkt, weil er die Schleife nicht prüft.
    // Das ist Fehlerklasse 12 auf rAF angewandt: **die Schleife wird angefordert, egal was
    // passiert** (`finally`), der Fehler wird EINMAL in die Konsole geschrieben und dauerhaft im
    // Panel gezählt — sichtbar für den, der nicht in die Konsole schauen kann.
    try {
      // Slice B: eingefroren heißt „der Prüfstand fährt" — dann kommt das `dt` aus `step()`, und
      // dieser Loop hält nur die Schleife am Leben (damit `thaw()` wieder anlaufen kann).
      if (!eingefroren) frameBody(now); else last = now;
    } catch (e) {
      frameFehler++;
      const m = (e && e.message) || String(e);
      if (m !== frameLetzterFehler) { frameLetzterFehler = m; console.error('[globe] frame', e); }
    } finally {
      if (!kontextWeg) requestAnimationFrame(frame);
    }
  }

  function frameBody(now) {
    const dt = Math.min(0.05, (now - last) / 1000) || 0.016;
    last = now;
    uhrS += dt;
    takt.bilder++;
    takt.summeMs += dt * 1000;
    if (dt * 1000 > takt.maxMs) takt.maxMs = dt * 1000;
    if (dt >= 0.05) takt.geklemmt++;
    if (dt * 1000 > 33) takt.ueber33++;
    if (dt * 1000 > 100) takt.ueber100++;
    frameMs += (dt * 1000 - frameMs) * 0.08;

    const c = controls.getState();
    // **Eigentümerwechsel, keine Addition** (S1b): solange die Maus lenkt, gehört `heading` ihr
    // und A/D schweigen. Zwei Schreiber auf denselben Winkel sind Fehlerklasse 1 in anderer Farbe.
    const eingabe = look.steerActive ? look.steer : c.turnRate;
    // ⚠ `carpet.state` DIREKT, nicht über das `S` weiter unten: das ist dieselbe Bindung, aber
    // `const S` steht 37 Zeilen tiefer im selben Block — ein Zugriff darauf von hier ist eine
    // temporal dead zone und hat den Loop im ersten Bild getötet. Ein Bezeichner, den man vor
    // seiner Deklaration liest, ist kein Flüchtigkeitsfehler, sondern eine Reihenfolgen-Wahrheit.
    const kurs = carpet.state.heading;
    const aus = kollision.query(carrierState.position, _up3, _fwd3);
    // v3 · S7g · Landsuche. **Zwei Reparaturen nach Georgs „man wird hin-und-her gewackelt":**
    //  1. Das ZIEL springt in Stufen (−32° → 0 → +32°), also darf der WERT nicht springen: er wird
    //     dahin gefiltert (Zeitkonstante ≈ 1,2 s). Ein Servo, dessen Sollwert hüpft, schwingt —
    //     das ist keine Regelungsfeinheit, das war das Wackeln.
    //  2. Hysterese bei der Richtungswahl: eine neue Richtung muss **deutlich** besser sein
    //     (+1/3 Landanteil), sonst bleibt die alte. Ohne das flippt die Wahl zwischen zwei fast
    //     gleich guten Seiten und der Filter bekommt nie Ruhe.
    landSucheT -= dt;
    if (landSucheT <= 0) {
      landSucheT = LAND_SUCHE_HZ;
      const ueberLand = surfaceAltitudeAt(seed, terrainType, _up3.x, _up3.y, _up3.z) > 0.001;
      ueberWasserS = ueberLand ? 0 : ueberWasserS + LAND_SUCHE_HZ;
      // Erst nach ein paar Sekunden Wasser — eine kurze Bucht ist Abwechslung, kein Problem.
      // Über Land wird gar nicht abgetastet: die 15 Rauschabfragen fallen weg, wo sie nichts nützen.
      if (!landAn || ueberWasserS < 3) landZiel = 0;
      else {
        const gerade = landVoraus(carrierState.position, _up3, _fwd3, 0);
        let bestW = 0, bestL = gerade;
        for (const w of [-0.55, -0.28, 0.28, 0.55]) {
          const l = landVoraus(carrierState.position, _up3, _fwd3, w);
          if (l > bestL + 0.33) { bestL = l; bestW = w; }
        }
        // Je länger die Wasserstrecke, desto entschlossener — nach 12 s zieht es voll zur Küste.
        const dringend = Math.min(1, (ueberWasserS - 3) / 9);
        landZiel = bestW * dringend * (LAND_SPANNE / 0.55);
      }
    }
    landOffset += (landZiel - landOffset) * Math.min(1, dt / 1.2);
    // Würfel-FX (Georg: „obwohl dieser Effekt nett wäre als dice-FX"): der rote Würfel wirft
    // einen SCHLENKER in denselben Servo. Er läuft aus, und der Servo bringt den Kurs zurück —
    // ein Effekt, der den Reiseweg nicht umschreibt.
    if (dieSwingT > 0) dieSwingT = Math.max(0, dieSwingT - dt);
    const schlenker = dieSwing * (dieSwingT > 0 ? dieSwingT / DIE_SWING_DUR : 0);
    const versatz = aus.offset + landOffset + schlenker;
    // ── v9 · KURS-LOG (Georg, 1.9.: „im Auto-Pilot-Flug korrigiert man zwischendurch leicht den
    // Kurs rechts/links, ohne Steuerung oder Kollision…?") ──────────────────────────────────────
    // Vier Schreiber geben in DENSELBEN Servo: das Ausweichen (`kollision.query`), die Landsuche
    // (`landOffset`, Standard AUS), der Würfel-Schlenker und der Mensch. Genau EIN Kursbesitzer ist
    // Absicht (S7b) — aber solange nicht dasteht, WER gerade schiebt, ist jede Bewegung ohne
    // sichtbaren Anlass für den Spieler ein Defekt. Also schreibt der Servo mit: Ursache, Winkel,
    // Zeit. Kein Fix — das ist die Messung, aus der der Fix folgt.
    if (Math.abs(versatz) > 0.004 && Math.abs(eingabe) <= 0.02) {
      const ursache = Math.abs(aus.offset) > 0.004 ? 'avoid'
                    : Math.abs(landOffset) > 0.004 ? 'coast seeking'
                    : Math.abs(schlenker) > 0.004 ? 'die swing' : 'unknown';
      const letzter = kursLog[kursLog.length - 1];
      const grad = Math.round(versatz * 180 / Math.PI);
      // ⚠ **Der erste Anlauf las ein Feld, das es nicht gibt** (`aus.nearest`) — also stand im Log
      // ewig `null`, genau an der Stelle, an der die Triage entscheidet. `landmark-collide.js` gibt
      // `{offset, speedCap, near, kind, pen}` zurück, und `near` ist das SITE-OBJEKT `{p, r, kind,
      // ref, drin}`, keine Zahl. *Ein Feldname, den man nicht nachgelesen hat, ist eine Vermutung
      // mit Punkt-Syntax.* Jetzt: Abstand aus `near.p`, Radius aus `near.r`, Drang aus `pen` — und
      // ein Ausweichen OHNE `near` ist damit ein eigenes, sichtbares Signal (fünfter Schreiber).
      const nahObj = aus.near || null;
      const abstand = nahObj && nahObj.p ? +carrierState.position.distanceTo(nahObj.p).toFixed(2) : null;
      if (!letzter || letzter.ursache !== ursache || Math.abs(letzter.grad - grad) >= 2) {
        kursLog.push({ t: +uhrS.toFixed(1), ursache, grad, nah: abstand,
                       r: nahObj && nahObj.r != null ? +nahObj.r.toFixed(2) : null,
                       drang: aus.pen != null ? +aus.pen.toFixed(2) : null });
        if (kursLog.length > 12) kursLog.shift();
        if (ursache === 'unknown') kursUnbekannt++;
      }
    }
    let turn = eingabe;
    if (Math.abs(eingabe) > 0.02) {
      // Der Mensch besitzt den Kurs. Solange gelenkt wird, folgt die Erinnerung mit, damit der
      // Servo hinterher nichts „zurückzuholen" hat.
      kursMerk = kurs; kursServo = false;
    } else if (versatz !== 0 || kursServo) {
      kursServo = true;
      const fehler = wrapPi2(kursMerk + versatz - kurs);
      turn = Math.max(-1.7, Math.min(1.7, fehler * 2.8));
      if (versatz === 0 && Math.abs(fehler) < 0.02) { kursServo = false; turn = 0; }
    } else {
      kursMerk = kurs;
    }
    lastTurn = turn;
    // v12 · Schweben (Georg, 3.9.: „abbremsen der fluggeschwindigkeit bis auf 0 in der aktuellen
    // Höhe"). H schaltet um; W schaltet WIEDER AUS, weil Gasgeben und Halten einander ausschließen
    // — ein Modus, den man nur mit derselben Taste verlassen kann, wird zur Falle.
    if (c.schwebeToggle) {
      const an = carpet.setSchwebe(!carpet.schwebt);
      sagen(an ? 'Hover · ↑↓ altitude · W or H to fly on' : 'Hover off');
    } else if (c.forward && carpet.schwebt) {
      carpet.setSchwebe(false);
    }
    carpet.update(dt, turn, c.forward, c.brake, c.elevate, c.descend);
    // Bremse nur, wenn sie eingestellt ist (Standard 0): ein harter Stopp auf einem fliegenden
    // Teppich liest als Fehler, und gefragt war Eleganz.
    if (aus.speedCap > 0) {
      const deckel = carpet.maxSpeed * aus.speedCap;
      if (carpet.state.speed > deckel) carpet.setSpeed(carpet.state.speed
        + (deckel - carpet.state.speed) * Math.min(1, dt * 3.5));
    }
    // Flugstart: der Boden unter dem Tempo steigt von 0 auf das Reisetempo. Ein steigender
    // Boden ist kein zweiter Antrieb — `carpet.update` bleibt der einzige Schreiber auf `speed`.
    if (launchT >= 0) {
      launchT += dt;
      const u = Math.min(1, launchT / LAUNCH_DUR);
      carpet.setSpeedFloor(CARPET_CRUISE_SPEED * (u * u * (3 - 2 * u)));
      // ⚠ **Hier stand einmal eine falsche Diagnose zu „abbremsen geht nicht" — sie ist raus.**
      // `CARPET_CRUISE_SPEED` IST `CARPET_QUELLE.minSpeed` (0,28); meine „Korrektur" auf
      // `params.minSpeed` war ein Nulltausch, und die Rampe war nie die Ursache. Die steht in
      // carpet.js (Tempo-Block): die Bremse klemmte gegen denselben Sockel, der das Reisetempo
      // definiert. In einer Datei, deren Methode „der Kommentar nennt die GEMESSENE Ursache" ist,
      // schickt eine falsche Diagnose den nächsten Leser an die falsche Stelle.
      //
      // ⚠ **Der Sockel bleibt am Rampenende auf Reisetempo — und der Teppich gibt ihn beim ERSTEN
      // Bremsen selbst frei** (carpet.js). Zwei Ansägen von Georg, 3.9., die sich zu einer Regel
      // fügen: „zu Beginn startet man wie bei TS mit Reiseflug-Geschwindigkeit" UND „specd sollte
      // nicht automatisch wieder schneller werden". Mein erster Versuch (Sockel sofort auf 0) hat
      // die zweite Ansage erfüllt und die erste gebrochen: die Welt startete und rollte in einer
      // Sekunde aus. **Die beiden widersprechen sich nicht — sie beschreiben ein VORHER und ein
      // NACHHER**, und die Grenze dazwischen ist der erste Bremsbefehl.
      if (u >= 1) { launchT = -1; carpet.setSpeedFloor(CARPET_CRUISE_SPEED); }
    }
    // ── v6 · Slice E · Portal-Durchflug ───────────────────────────────────────────
    // NACH `carpet.update` und VOR dem Carrier: der Sprung schreibt Ort, Kurs und Höhe, und die
    // Matrix für DIESES Bild wird zehn Zeilen weiter unten aus genau diesen Werten gebaut. Eine
    // Zeile später im Loop — nach `carrier.sync` — zeigte ein Bild den alten Ort mit der neuen
    // Höhe, und das ist der Ruckler, den man dann für einen Physikfehler hält.
    // Der Handler nennt die Kaskade, nicht ihre Bestandteile (E-28).
    const sprung = portale.update(dt, carpet, camera);
    if (sprung) {
      if (fx) fx.fire('portal.pass', { pos: carpet.worldPos(), dir: kaskadeRichtung(), strength: 1 });
      else { audio.sfx('boost'); einschlagT = Math.max(einschlagT, 0.9); }
      sagen('Portal · ' + Math.round(sprung.bogen * 180 / Math.PI) + '° across the globe');
    }
    if (c.paintball) fire();
    globe.update(dt);       // Wolkenring driftet
    // Atmosphäre nur von INNEN: außerhalb von 1,55·R malt die additive Hülle das Bild zu
    // (sichtbar in der Startansicht bei 2,75·R). Siehe globe.js · setAtmosphereByCamera.
    globe.setAtmosphereByCamera(camera.position.length());
    zyklus.setSpaceByCamera(camera.position.length(), GLOBE_RADIUS);
    zyklus.update(dt);      // v3 · Tageszeit läuft (Standard aus)

    // Block 2 · EIN Nachtgewicht, drei Leser (Sterne im Zyklus selbst, hier Aurora und Strahlen).
    // Die Aurora dreht ihre Vorhänge zur Kamera, also braucht sie sie — die Strahlen brauchen die
    // Sonnenrichtung und die laufende Zeit für ihr Rauschen.
    {
      const nacht = zyklus.nachtGewicht;
      aurora.setGewicht(nacht);
      { const _petzt = carpet.worldPos(); aurora.update(dt, camera, _petzt, _petzt); }
      strahlen.setGewicht(1 - nacht);
      strahlen.update(uhrS, lights.sun.position, scene.position,
                      zyklus.preset.sunColor.getHex(), zyklus.preset.sunIntensity);
    }

    // **Der Carrier fährt über `sync(st, dt)`**, nicht über eine gesetzte Matrix: er braucht
    // Position UND Lage getrennt, weil er darauf seine Neigung, Wellen und Kantenrollen aufbaut.
    // `buildPlaneMatrix` liefert beides in einem — also einmal zerlegen.
    const S = carpet.state;
    const m = carpet.matrix();
    m.decompose(carrierState.position, carrierState.quaternion, _cs);
    carrierState.speed = S.speed;
    carrierState.bank = S.bankAngle;
    carrierState.pitchTilt = S.pitch;
    carrierState.boosting = c.elevate;      // `elevate` ist in dieser Fassung der Schub
    carrierState.climbIn = c.elevate ? 1 : 0;
    carrier.sync(carrierState, dt, petParts);
    // v9 · Die kleine Schattenbox reist mit dem Fahrzeug (Quelle: `_shadowPlayerPos`).
    sonnenSchatten.folgen(carrierState.position);
    // v9 · Nahfeld-Lampe: Ort vom Carrier, Helligkeit vom EINEN Nachtgewicht.
    lampe.folgen(carrierState.position);
    lampe.setNacht(zyklus.nachtGewicht);
    // v10 · Dieselbe Nachtzahl treibt die drei Laternen — EIN Nachtgewicht, jetzt vier Leser.
    leuchttuerme.setNacht(zyklus.nachtGewicht);
    // v8 · Mech-Skin liest DENSELBEN Zustand wie der Carrier — eine Quelle für „wo bin ich".
    if (mechFahrt) mechStation.sync(carrierState, dt);
    // Gegenlicht reist mit dem Fahrzeug — seit 2.9. im LOKALEN Rahmen (Begründung in pet-lighting).
    // Die Fahrtrichtung geht mit, damit die Lichtseite beim Kurvenfliegen nicht umspringt.
    // ⚠ `carrierState.forward` existiert NICHT — fast hätte ich es hier hingeschrieben und mir
    // still ein `null` eingefangen. Die Richtung steckt im Quaternion des Carriers; sie wird von
    // dort gelesen. (Das Zustandsobjekt oben führt seine Felder vollständig auf, genau deswegen.)
    _cfwd.set(0, 0, -1).applyQuaternion(carrierState.quaternion);
    lighting.follow(carrierState.position, _cfwd);

    // v13 · Cartoon-Verformung: EINE Messung, die schon da ist (Kursrate, Fahrt, Höhenrate), und
    // der Körper holt sie träge ein. Die Höhenrate wird hier gebildet, weil `carpet` sie nicht
    // führt — und aus der Flughöhe, nicht aus der Kamerahöhe: die Kamera federt selbst.
    const steigRate = dt > 0 ? (S.altitude - letzteHoehe) / dt : 0;
    letzteHoehe = S.altitude;
    traegheit.update(dt, turn, carpet.speedRatio, steigRate);

    // **Abstand stufenlos.** Höhe wächst mit dem Abstand, damit man von nah nicht in den Boden
    // schaut: bei 1,2 ist sie die 0,7 der Quelle, bei 0 sitzt sie im Kopf.
    const rigDist = Math.max(RIG_MIN, camDist);
    // Höhe: automatisch mit dem Abstand (unser Standard) oder fest aus der Voreinstellung.
    const rigHeight = camHoeheUeber != null ? camHoeheUeber : 0.7 * Math.min(1, rigDist / 1.2);
    const fr3 = tangentFrame(S.qPosition);      // v3 · ein Rahmen, viele Leser (Schatten, Laub, Würfel, Maus)
    _up3.copy(fr3.up);                          // für die Ausweich-Abfrage im nächsten Bild
    _fwd3.set(0, 0, 0).addScaledVector(fr3.north, Math.cos(S.heading))
         .addScaledVector(fr3.east, Math.sin(S.heading)).normalize();
    look.update(dt);                            // Rückstellung läuft auch im Intro
    if (intro.active) {
      // Der Rig wird nachgeführt, schreibt aber nicht ins Bild: das Intro blendet dagegen.
      rig.snapTo(S.qPosition, S.heading, S.altitude, GLOBE_RADIUS, rigDist, rigHeight);
      if (intro.update(dt, camera, carrierState.position)) {
        controls.enabled = true;
        launchT = 0;                            // erst jetzt rollt es an
        // v5 · Slice C · Die Übergabe ist ein EREIGNIS — und war der stummste Moment des
        // Spiels: die Kamera hört auf, dem Intro zu gehören, die Steuerung fängt an zu
        // wirken, und dafür gab es eine Zeile Erzählertext. Die Zeitachse steht in
        // `fx-script.js` (`intro.handover`), nicht hier.
        if (fx) fx.fire('intro.handover', { pos: carpet.worldPos(), dir: kaskadeRichtung(), strength: 1 });
        sagen('Handover · W to throttle');
      }
    } else {
      rig.update(dt, S.qPosition, S.heading, S.altitude, GLOBE_RADIUS, turn, carpet.speedRatio,
                 1, rigDist, rigHeight);
    }

    // Unter MIN_CHASE_DISTANCE klemmt der Rig selbst — darunter übernimmt diese Blende und zieht die
    // Kamera in den Pet-Kopf. Der Avatar bleibt dabei bis 85 % sichtbar und blendet erst in den
    // letzten 15 % aus (Georgs Vorgabe: kein harter Schnitt).
    // ⚠ **Position, Blickziel UND Oben-Achse müssen alle drei blenden.** Erst blendete nur die
    // Position, und `lookAt` sprang bei `povAnteil > 0` auf ein völlig anderes Ziel — sichtbar als
    // Ruck etwa auf halber Strecke zwischen Verfolgersicht und POV (Georg, 27.8.). Ein Übergang, bei
    // dem eine von drei Größen springt, ist kein Übergang.
    //
    // Das Rig blickt intern auf `plane + forward * 0.5` und nimmt als Oben die normierte
    // Kameraposition (CameraRig.ts). Beides wird hier nachgebildet, damit dagegen geblendet werden
    // kann — nicht ersetzt: bei `povAnteil = 0` kommt genau das Ergebnis des Rigs heraus.
    const povAnteil = intro.active ? 0 : Math.max(0, Math.min(1, (RIG_MIN - camDist) / RIG_MIN));
    if (povAnteil > 0) {
      const fr = tangentFrame(S.qPosition);
      const fwd = _povFwd
        .set(0, 0, 0)
        .addScaledVector(fr.north, Math.cos(S.heading))
        .addScaledVector(fr.east, Math.sin(S.heading)).normalize();
      const basis = cartesianFromSpherical(S.qPosition, S.altitude, GLOBE_RADIUS);

      // Augenhöhe des Pets auf der Karte, ein Stück hinter der Nase.
      const kopf = _povKopf.copy(basis).addScaledVector(fr.up, 0.052).addScaledVector(fwd, -0.012);
      const zielRig = _povZielA.copy(basis).addScaledVector(fwd, 0.5);
      const zielPov = _povZielB.copy(kopf).addScaledVector(fwd, 2.0)
        .addScaledVector(fr.up, -0.35 * carpet.speedRatio);

      camera.position.lerp(kopf, povAnteil);
      _povUp.copy(camera.position).normalize().lerp(fr.up, povAnteil).normalize();
      camera.up.copy(_povUp);
      camera.lookAt(zielRig.lerp(zielPov, povAnteil));
    }
    // **Bildhöhe: die Kamera blickt etwas nach unten, damit das Pet höher im Bild sitzt.**
    // Nach dem Rig UND nach der POV-Blende — beide schreiben `lookAt`, eine Drehung davor wäre
    // im nächsten Aufruf weg. Im POV läuft der Anteil auf 0: dort IST man das Pet, und ein
    // Versatz wäre nur ein schiefer Horizont.
    if (frameLift > 0.0005 && !intro.active) camera.rotateX(-frameLift * (1 - povAnteil));
    // **Umsehen ist ein VERSATZ auf die fertige Kamera, kein zweiter Besitzer** (S1b): eine
    // starre Drehung um den Avatar, die von selbst zurückläuft. Bei Versatz 0 bleibt die
    // Rig-Pose bitgenau stehen — deshalb steht diese Zeile ganz am Ende der Kamerakette.
    if (!intro.active) look.apply(camera, carrierState.position, fr3.up);

    // **Der Avatar in drei Schichten, in DIESER Reihenfolge (v17-Vertrag).**
    //   1. `pet.update` — der Motor: Ruheatem, Blinzeln, Mienenspiel, Clips. Fehlte in v2 ganz;
    //      deshalb saß dort eine Requisite und kein Mitflieger.
    //   2. `petKin.update` — die Kinetik: volumenerhaltendes Squash, Federn ZWEITER Ordnung mit
    //      Überschwinger (genau daraus entsteht die cartoonige Trägheit), Kurvengewicht aus
    //      Schräglage UND deren Rate. Sie liest denselben `carrierState` wie die Karte — eine
    //      Messung, zwei Leser, keine zweite Uhr.
    //   3. `petFace.update` — schreibt NUR die Gier (plus Kopfheben und Aufsetzen): im Stand zu
    //      dir, mit Tempo in die Fahrtrichtung. Der Lean aus Schritt 2 bleibt damit stehen; genau
    //      deshalb ist es eine eigene Schicht und keine Zeile in der Kinetik.
    if (petLoaded && petParts) {
      petParts.update(dt);
      if (petKinOn) petKin.update(petParts, carrierState, dt);
      carrier.setBarrelRoll(petKin.barrelRoll.angle);
      petFace.update(dt, { pet: petParts, camera, speed01: carpet.speedRatio, cursorIdle: 99 });
    }
    const sicht = 1 - Math.max(0, Math.min(1, (povAnteil - 0.85) / 0.15));
    if (avatarMats.length) for (const m of avatarMats) m.opacity = sicht;
    trail.group.visible = sicht > 0.05;
    if (trail.group.visible) trail.update(m, camera, carpet.speedRatio);
    // v13 · Die Speedlines folgen derselben Sichtblende wie der Trail — aber ihre Anker sitzen IN
    // der gezeichneten Karte, nicht in dieser Matrix (`anchorTo`, siehe oben). Die ABSOLUTE Fahrt
    // blendet sie im Schweben aus — nicht `speedRatio`: der ist auf dem Reiseboden 0,28 gleich null
    // und hätte die Striche aus der ganzen normalen Fahrt gelöscht (siehe Kopf von `contrails.js`).
    // ⚠ **Die Sichtbarkeit braucht eine EIGENE Zeile, nicht nur eine Wache am `update`.** Erste
    // Fassung hatte nur `if (… trail.group.visible) kondens.update(…)`. In der Ich-Sicht wurde damit
    // die Geometrie nicht mehr fortgeschrieben, das Mesh aber weiter gezeichnet: zwei additive
    // Striche standen auf der ANDEREN SEITE des Planeten (Kopf 6 u von der Karte weg) und waren
    // wegen `depthTest: false` von überall zu sehen. *Ein Effekt, der nicht mehr rechnet, hört
    // damit nicht auf zu erscheinen.* Und `reset()` beim Zurückkommen, sonst zieht das erste Bild
    // ein Band quer durch die Welt — genau der Fall, den `contrails.js` an `reset` notiert.
    const kondensSicht = sicht > 0.05;
    kondens.setVisible(kondensSicht);
    if (kondens.enabled) {
      if (kondensSicht) kondens.update(m, camera, carpet.state.speed);
      else kondens.reset();
    }
    // **Tempostreifen: hier lag ein stummer Effekt.** `speed-lines.js` ist 1:1 aus tinyskies und
    // rechnet `(speed − 0,8) / (1,5 − 0,8)` — unser MAX_SPEED ist aber **0,78**. Der Effekt konnte
    // in v1 und v2 also NIE anspringen; er war eingebaut und unsichtbar (dieselbe Fehlerklasse wie
    // die Sitze in S60: jede Zahl sagt „ok", im Bild ist nichts). tinyskies erreicht die 1,5 mit
    // Upgrades, die es hier nicht gibt. Also wird das Verhältnis 0…1 auf das Fenster der Quelle
    // abgebildet, statt die Konstanten der Quelle zu verbiegen: Vollgas = 1,5 = volle Stärke,
    // Boost-Schwelle 1,2 liegt bei 57 % Tempo. `lineGain` ist der Regler.
    // Georg, 29.8.: „die gesamte Szene ist arg überstrahlt" — die weißen Strahlen im Bild waren
    // DIESE Streifen. Meine erste Abbildung (0,8…1,5) schob Vollgas in das BOOST-Fenster der
    // Quelle (Schwelle 1,2, Breite ×5), das dort einem seltenen Diamant-Boost gehört. Jetzt
    // bleibt normales Gas UNTER der Boost-Schwelle (0,8…1,15) und nur die Schubtaste hebt
    // darüber — „stärker bei Vollgas" liegt damit am Schub, nicht am Reisetempo.
    // Einschlag hebt kurz über die Boost-Schwelle — das ist der sichtbare Teil der Belohnung.
    const burst = einschlagT > 0 ? (einschlagT / 0.45) * 0.45 : 0;
    lines.update(dt, 0.8 + (carpet.speedRatio * 0.35 + (c.elevate ? 0.3 : 0) + burst) * lineGain);
    // v5 · Slice G · EIN Signalgeber, vier Leser. Drei Größen, die hier ohnehin liegen.
    if (hudFlug) hudFlug.update(dt, { bankAngle: S.bankAngle, turnRate: lastTurn,
                                      speedRatio: carpet.speedRatio });
    if (gearTempo) {
      // Dimensionslos, wie bestellt: 0…100 als Anteil des Reisetempo-Fensters.
      // ⚠ `tempoAnzeige`, nicht `speedRatio` — die Begründung steht am Getter in carpet.js:
      // speedRatio misst den Abstand zum Tempo-SOCKEL und ist im ganzen Reiseflug 0. Genau das
      // war Georgs „ist aktuell immer 0": nicht die Anzeige war kaputt, sie las die falsche Größe.
      const v = Math.round(carpet.tempoAnzeige * 100);
      if (gearTempo.__v !== v) { gearTempo.__v = v; gearTempo.textContent = String(v); }
      // Das Schweben ist ein ZUSTAND und muss sichtbar sein, sonst drückt man H und hält das
      // Ausrollen für einen Bug. Kein zweites Element: derselbe Zähler bekommt eine Marke.
      const sw = carpet.schwebt;
      if (gearTempo.__sw !== sw) { gearTempo.__sw = sw; gearTempo.classList.toggle('schwebt', sw); }
    }

    // ── v3 · Boden-FX: Schatten und Laub lesen DENSELBEN Rahmen wie die Kamera ─────
    const surfAlt = surfaceAltitudeAt(seed, terrainType, fr3.up.x, fr3.up.y, fr3.up.z);
    // v3 · S3c · Welches Biom liegt unter dem Pet? Vier Skalarprodukte, also gratis je Bild —
    // und es ist die Orientierungsauskunft, die die Domänen überhaupt lesbar macht.
    biomHier = biomeAt(fr3.up.x, fr3.up.y, fr3.up.z);
    const aglJetzt = carpet.agl;
    // ── v3 · S7f · Flug-Boden-Kontakt: Steinchen mit SCHLEPPE ─────────────────────
    // Georg wollte die Steinchen „ebenso wie bei flug-boden-kontakt". Der Unterschied zum Würfel
    // liegt nicht im Effekt, sondern in der übergebenen Geschwindigkeit: der Teppich bringt
    // Fahrt mit und kaum Senkrechte, also werden die Steinchen nach hinten gezogen statt
    // aufgeworfen. Gedrosselt über die Zeit, nicht je Bild — sonst hängt die Dichte an der
    // Bildrate (Fehlerklasse aus S1: alles, was je Bild zählt, ist auf schnellen Geräten anders).
    if (staubAn && staub.enabled && aglJetzt < aglBasis * STAUB_ANTEIL && S.speed > 0.12) {
      staubT -= dt;
      if (staubT <= 0) {
        staubT = 0.075;
        _staubP.copy(carrierState.position).addScaledVector(fr3.up, -aglJetzt);
        _staubV.copy(_fwd3).multiplyScalar(S.speed);
        // Näher am Boden = mehr Kontakt. Zwei bis vier Steinchen: das ist die Grenze zwischen
        // „er streift" und „er pflügt".
        const naeh = 1 - aglJetzt / Math.max(0.001, aglBasis * STAUB_ANTEIL);
        staub.burst(_staubP, fr3.up, _staubV, 2 + Math.round(naeh * 2));
      }
    }
    // ── v4 · Slice C · Die BERÜHRUNG ist ein Ereignis, die Schleppe ein Zustand ────────────
    // Der Block oben ist ein Dauereffekt (Steinchen, alle 75 ms, solange man tief fliegt) — und
    // genau deshalb hatte der Bodenkontakt **kein Ereignis**: keinen Ton, keine Wucht, keine
    // Federung im Avatar (D-08 §1.3). Hier ist die FLANKE: das Eintreten in das Kontaktband.
    // Mit Hysterese (Verlassen erst bei 1,4× Bandbreite), sonst feuert es an jeder Bodenwelle
    // — dieselbe Regel, die `landmark-collide` für die Wegweiser schon benutzt.
    // Die Stärke kommt aus der ANNÄHERUNGSRATE, nicht aus der Höhe: wer sanft einschwebt, soll
    // kein Erdbeben bekommen. `aglRate` ist negativ beim Sinken.
    const bandJetzt = aglBasis * STAUB_ANTEIL;
    aglRate = (aglJetzt - aglVor) / Math.max(dt, 1e-4);
    aglVor = aglJetzt;
    if (!bodenWar && aglJetzt < bandJetzt && S.speed > 0.12) {
      bodenWar = true;
      const hart = Math.min(1, Math.max(0.25, -aglRate * 3.0));
      if (fx) fx.fire('ground.touch', { pos: _staubP.copy(carrierState.position)
                                          .addScaledVector(fr3.up, -aglJetzt).clone(),
                                        dir: _fwd3.clone().negate(), strength: hart });
    } else if (bodenWar && aglJetzt > bandJetzt * 1.4) {
      bodenWar = false;
    }
    // Die Reisehöhe lernt sich selbst — langsam (≈ 3 s), damit ein einzelner Tiefflug sie nicht
    // mitzieht und der Effekt dadurch verstummt.
    aglBasis += (aglJetzt - aglBasis) * Math.min(1, dt / 3);
    staub.update(dt);
    // Der Schatten liest den Boden selbst ab (8×8 Knoten) — deshalb bekommt er nur den Rahmen,
    // keine Position: ein Quad mit vier Ecken kann einer facettierten Kugel nicht folgen.
    schatten.update({ up: fr3.up, north: fr3.north, east: fr3.east, heading: S.heading,
                      cardWidth: CARD_WELT, agl: aglJetzt, sicht });

    // Blätter: die Quelle bekommt Zustand, keine fertigen Vektoren — sie rechnet ihren
    // Tangentialrahmen selbst (CarpetLeaves.update, Signatur wörtlich).
    leaves.update(dt, S.qPosition, S.heading, GLOBE_RADIUS, S.speed, S.altitude, seed, terrainType);
    // v5 · Slice F: beide lesen NUR vorhandene Größen. `driftIntensity` rechnet `carpet.js`
    // ohnehin jedes Bild (Winkel zwischen Blick- und Fahrtrichtung) — eine zweite Rechnung wäre
    // eine zweite Wahrheit über dieselbe Kurve.
    wake.update(dt, { qPosition: S.qPosition, heading: S.heading, speed: S.speed,
                      elevating: !!c.elevate });
    rauch.update(dt, { qPosition: S.qPosition, heading: S.heading, altitude: S.altitude,
                       drifting: S.drifting, driftIntensity: carpet.driftIntensity });
    // Würfel-Sitze hängen am Standort, nicht an einer Welt-Achse: Rahmen jedes Bild neu.
    if (sky.params.visible) {
      sky.setFrame(fr3.up, fr3.north, fr3.east, carrierState.position, S.altitude, _fwd3);
      sky.update(dt, camera, carrierState.position);
      sky.recycle(carrierState.position, 2.8, _fwd3);   // nur hinter dem Spieler umsetzen (Naht 5)
      // Artwork gedrosselt: EIN Auftrag, und nur für die nächste Karte (Regel der Quelle — alle
      // sieben gleichzeitig hatten in v17 gemessen 0 fps).
      kartenTakt += dt;
      // ⚠ **Die Warteschlange war DOPPELT gebremst — und die zweite Bremse war reine Leerzeit.**
      // `registry.pending` lässt ohnehin nur EINEN Auftrag zu; die Pumpe fragt also nur, wenn die
      // Registry frei ist. Der Zeittakt (0,45 s früh / 1,2 s später) legte NACH jeder Fertigstellung
      // noch eine Pause obendrauf. Gerechnet: 88 Motive × 1,2 s ≈ 106 s, größtenteils Nichtstun —
      // drei von vier Ausschnitten sind Treffer im Seiten-Cache (`renderPage` cacht je PDF-Seite,
      // und eine Seite trägt vier Karten), also billig.
      // Jetzt bremst die BILDZEIT, nicht die Uhr: läuft es rund, wird gepumpt; wird es eng, tritt die
      // Pumpe zurück. Dasselbe Ziel wie die Drossel der Quelle (v17: sieben Aufträge gleichzeitig =
      // 0 fps) — nur an der Größe gemessen, um die es dabei geht.
      const takt = frameMs > 22 ? 0.9 : 0.12;
      if (kartenTakt > takt) {
        kartenTakt = 0;
        // Abwechselnd Himmel und Türme — EIN Auftrag je Runde bleibt die Regel.
        if (!sky.pumpArt(carrierState.position, 3)) {
          // ⚠ **v10 · REIHUM statt Vorrang** (Abnahme 2.9.). Hier stand eine Schachtelung: erst
          // Himmel, dann alle 32 Turmblätter, dann die 24 Teppiche. Gemessen hieß das: 24
          // Rückseiten liegen auf dem Boden, bis 32 Schilder fertig sind. Strikter Vorrang ist
          // richtig, solange die Nachrangigen Beiwerk sind — die Teppiche sind aber das, *was die
          // Welt narrativ erzählt* (Georgs Begründung für sie), also verhungern sie hier.
          // Ein Zeiger wechselt jetzt die Reihe: EIN Auftrag je Runde bleibt die Regel, aber der
          // Abnehmer wechselt. Wer nichts zu tun hat, gibt seinen Zug weiter.
          const tuermeAuftrag = () => tuerme.pumpArt(kasse, (crop, s2) => artTexture(THREE, crop, s2), carrierState.position);
          const teppichAuftrag = () => teppiche.pumpArt(kasse, (crop, s2) => artTexture(THREE, crop, s2), carrierState.position);
          const reihe = (artZeiger++ % 2 === 0) ? [tuermeAuftrag, teppichAuftrag] : [teppichAuftrag, tuermeAuftrag];
          if (!reihe[0]()) reihe[1]();
        }
      }
    }
    if (dice.params.visible) {
      // ⚠ **Hier standen zwei Anker-Systeme für dieselbe Sache** — dieselbe Fehlerklasse, die
      // Georg gerade an den Karten gerügt hat: der Runner hielt einen `wuerfelAnker` für das
      // ganze Trio, und `sky-dice` verteilte darin. Deshalb sprangen alle drei Würfel gemeinsam
      // an eine neue Stelle und keiner schwebte. Jetzt besitzt `sky-dice` die Platzierung je
      // Würfel (Weltort + Schweben + Neusetzen), der Runner gibt nur den LEBENDEN Rahmen.
      dice.setCenter(carrierState.position);
      dice.setFrame(fr3.up, fr3.north, fr3.east, _fwd3);
      dice.update(dt, camera);
      // ── S6d/S6e · Durchflug: Augenzahl der IMPACT-Seite zählt, Farbe ist der Modifier ──
      // ⚠ Dieser Block fehlte zwei Runden lang: das `replaceText`, das ihn einfügen sollte, fand
      // seinen Anker nicht und meldete das nicht. Die Abnahme sah grün aus, weil sie
      // `dice.impactAt(...)` DIREKT gerufen hat statt den Runner-Pfad. Lehre: nach jedem
      // Textersatz gehört eine Existenzprüfung des NEUEN Textes in dieselbe Messung.
      const treffer = dice.impactAt(carrierState.position, _fwd3);
      if (treffer) {
        popPunkte = hud.addPop(treffer.pips);
        // v4 · Slice B: Klang, Trauma, Staub und Pet-Zucken stehen in `dice.collect`.
        if (fx) fx.fire('dice.collect', { pos: carpet.worldPos(), dir: kaskadeRichtung(),
                                         strength: 1, pips: treffer.pips });
        einschlagT = 0.45;
        // Die FARBE ist der Modifier (Georgs Regel), die Augenzahl der Betrag. Jede Farbe schaltet
        // EINEN vorhandenen Regler kurz um — kein neues Effektsystem.
        const st = treffer.pips / 6;
        if (treffer.die === 'rot') {
          carpet.setSpeed(Math.max(0.1, carpet.state.speed - 0.22 * st));
          traumaT = 0.9;                       // der Rig zählt Trauma nicht selbst herunter
          // S7b · der Schlenker als Würfel-FX: Richtung aus der Augenzahl, Betrag mit ihr.
          dieSwing = (treffer.pips % 2 ? 1 : -1) * 0.34 * (0.5 + st);
          dieSwingT = DIE_SWING_DUR;
          sagen('Pop +' + treffer.pips + ' · red: brake + swerve');
        } else if (treffer.die === 'gelb') {
          einschlagT = 0.45 + 1.1 * st;
          sagen('Pop +' + treffer.pips + ' · yellow: fx');
        } else {
          carpet.setSpeed(carpet.state.speed + 0.2 + 0.3 * st);
          audio.sfx('boost', 0.6);
          sagen('Pop +' + treffer.pips + ' · blue: boost');
        }
      }
    }
    if (einschlagT > 0) einschlagT = Math.max(0, einschlagT - dt);
    // ── v4 · Slice B · Die drei Größen, die die Wirker setzen und der Loop abbaut ─────────────
    // Alle drei nehmen das `dt`, das sie bekommen — keine eigene Uhr, kein `setTimeout`. Slice A
    // hat gemessen, warum: in einem verdeckten Tab läuft eine zweite Uhr anders als die Welt
    // (PM-50). Ein Effekt, der seine eigene Zeit mitbringt, ist im Prüfstand nicht messbar.
    wucht.update(dt);
    fx.update(dt);
    if (duckT > 0) { duckT = Math.max(0, duckT - dt); if (duckT === 0) audio.duck(false); }
    if (schubZiel > 0) {
      // Rampe statt Sprung: der Anteil dieses Bildes am Gesamtstoß. `carpet` klemmt selbst bei
      // ABSOLUTE_MAX_SPEED, also braucht es hier keinen zweiten Deckel.
      const anteil = Math.min(schubZiel, schubZiel * Math.min(1, dt / schubRampe) + 1e-6);
      carpet.setSpeed(carpet.state.speed + anteil);
      schubZiel = Math.max(0, schubZiel - anteil);
    }
    // Trauma zählt der Rig nicht selbst herunter — sonst zittert die Kamera für immer.
    if (traumaT > 0) { traumaT = Math.max(0, traumaT - dt); rig.setTrauma(traumaT / 0.9); }
    flug.update(dt);
    // v3/S3b · EINE Uhr für den Atem aller Props — die Phase steckt je Exemplar im Attribut.
    if (marken.breath > 0) marken.update(uhrS);
    tuerme.update(dt);
    // v6 · Slice E2 · EIN Eingang für „wo ist der Spieler", dann ein Schritt. Reihenfolge nach
    // `carrier.sync`, weil die Gegner die FLUGHÖHE lesen (Jagdband um den Spieler herum).
    gegner.setPlayer(carrierState.position, carpet.state.altitude);
    // v12 · EINMAL anmelden, nicht je Bild neu bauen: die Vulkane stehen fest, die Liste auch.
    if (!sperrenGesetzt && gegner.setSperrzonen) {
      sperrenGesetzt = true;
      // 0,45 ist der Radius der LAVAFAHNE, nicht des Kegels — die Fahne ist das, was man sieht,
      // und durch die flog der Gegner. Der Puffer des Moduls kommt oben drauf.
      gegner.setSperrzonen((vulkane.orte || []).map((n) => ({ n, r: 0.45 })));
    }
    gegner.update(dt);
    tsFlora.update(dt, camera); // v12 · EINE Uhr für den Wind aller Pflanzen + Sichtweite je Raumkachel
    muenzen.update(dt, carrierState.position);   // v12 · Drehen, Wippen, Durchflug-Sammeln
    vulkane.update(dt);         // v9 · Lava + Rauch
    leuchttuerme.update(dt);    // v9 · Strahl dreht mit 0,8 rad/s (Quelle)
    mechStation.update(dt);     // v8 · Meckertronic: Idle-Mixer der Station
    orte.update(fr3.up);        // Überflug: Skalarprodukt, Hysterese, EIN aktiver Ort
    hud.update(dt);

    // ── v2 · Klang und Erzähler lesen DIESELBEN Größen wie das Bild ──────────
    // Tempo, Bodenabstand, Drehrate — keine eigene Uhr, keine zweite Messung.
    const aglNow = carpet.agl;
    // v4 · Slice C · zwei Flänken, die vorher nur einen Ton hatten. Jetzt Kaskaden:
    // `boost.start` bringt FOV-Stoß und Barrel-Roll dazu (beide vorhanden, beide ungenutzt),
    // `water.enter` bringt seinen Spritzer, sobald `carpet-wake` in Slice F steht — bis dahin
    // meldet `fx.report()` den fehlenden Wirker, statt dass es niemand merkt.
    if (c.elevate && !boostWar) {
      if (fx) fx.fire('boost.start', { pos: carpet.worldPos(), dir: kaskadeRichtung(), strength: 1 });
      else audio.sfx('boost');
    }
    boostWar = !!c.elevate;
    if (S.isOverWater && !wasserWar) {
      if (fx) fx.fire('water.enter', { pos: carpet.worldPos(), dir: kaskadeRichtung(), strength: 1 });
      else audio.sfx('water', 0.6);
    }
    wasserWar = !!S.isOverWater;
    audio.update(dt, { heat: carpet.speedRatio, rate: 0, mode: 'fly', agl: aglNow,
                       ueberWasser: S.isOverWater, camera });
    narrator.update(dt, { v: carpet.speedRatio, agl: 2 + Math.max(0, aglNow - 0.03) * 26.2,
                          turn: c.turnRate * 2 });
    if (tonHinweisT > 0) { tonHinweisT -= dt; if (tonHinweisT <= 0) tonHinweis = ''; }

    for (let i = shots.length - 1; i >= 0; i--) {
      const s = shots[i];
      s.vorher.copy(s.mesh.position);
      s.mesh.position.addScaledVector(s.dir, 9 * dt);
      s.life -= dt;
      // v6 · Slice E2 · Der Treffer-Vertrag: ein Schuss ist das SEGMENT dieses Bildes, kein Punkt.
      // Bei 9 u/s und 60 Bildern legt er 0,15 u je Bild zurück — fast der ganze Trefferradius
      // (0,16). Ein Punkttest würde also regelmäßig durch den Gegner hindurchspringen; genau
      // deshalb prüft die Quelle Segmente (`segmentHitsSphere`), und wir auch.
      const treffer = gegner.treffer(s.vorher, s.mesh.position);
      if (treffer) {
        if (fx) fx.fire(treffer.kill ? 'enemy.kill' : 'enemy.hit',
                        { pos: treffer.pos, dir: s.dir.clone(), strength: treffer.kill ? 1 : 0.5 });
        if (treffer.kill) {
          popPunkte = hud.addPop(3);
          sagen(treffer.gegner.def.name + ' down · +3');
        }
        scene.remove(s.mesh); shots.splice(i, 1);
        continue;
      }
      if (s.life <= 0 || s.mesh.position.length() < GLOBE_RADIUS) { scene.remove(s.mesh); shots.splice(i, 1); }
    }

    updateBadge();

    // Reihenfolge: Szene → Radial-Blur → Speedlines. `post.render` zeichnet die Szene selbst
    // direkt auf den Schirm (kein Rendertarget) und legt nur bei Stärke > 0 ein Overlay darüber —
    // deshalb kann der Effekt Pet, Karte und Panel konstruktiv nicht verändern (v17, dritte Fassung).
    const boost = c.elevate ? 1.4 : 1;
    post.setStrength(intro.active ? 0
      : (0.105 * Math.pow(carpet.speedRatio, 1.4) * boost + burst * 0.22) * postGain, dt);
    post.render(scene, camera);
    // v11 · Regen NACH der Szene, VOR Flare und Tempostreifen — dieselbe Reihenfolge wie Game.ts
    // (`rainOverlay.update(dt, getRainWeight(moonProg), moonProg)` im Loop, `render` nach der Szene).
    // Gewicht: Quelle (Wanduhr + Seed) · Panel-Regler `Rain override` (−0 = Quelle) · `?regen=0` aus.
    {
      const w = wetter.aus ? 0 : (wetter.override >= 0 ? wetter.override : rainWeight(seed));
      regen.update(dt, w, 0);
      regen.render(renderer);
      // Offen (benannt, nicht gebaut): der Regen-LOOP der Quelle (`rain_1.mp3`, RAIN_LOOP_MAX_VOL 0,58 × w)
      // — unser Klangmotor hat keinen Regen-Sample; das ist ein Audio-Slice, kein Wetter-Slice.
    }
    // v9 · Lens Flare NACH der Szene, vor den Tempostreifen: dieselbe Ortho-Overlay-Bauform.
    // Tagesgewicht wie in der Quelle (Game.ts 6290: `flareColorScale × dayW`) — nachts kein Reflex.
    {
      // `tagGewicht` ist der Name der Quelle (`getDayWeight`), nicht `1 − nachtGewicht` an dieser
      // Stelle nachgerechnet — sonst gibt es zwei Definitionen von „Nacht" (v9-Befund der Abnahme).
      const tagW = zyklus.tagGewicht;
      const s = zyklus.preset.flareColorScale || [1, 1, 1];
      flare.setColorScale([s[0] * tagW, s[1] * tagW, s[2] * tagW]);
      flare.update(camera);
      flare.render(renderer);
    }
    lines.render(renderer);
  }
  requestAnimationFrame(frame);

  // ── v5 · Slice H · Weltstimmungen ───────────────────────────────────────────────────────────
  // ⚠ **EIN Anleger, vier Eingänge.** Dieselbe Bauform wie `hud-flight` (ein Signalgeber, vier
  // Leser): die Stimmung wird an EINER Stelle gesetzt, und von dort fließt sie in Land, Zonen,
  // Wasser und Spuren. Vier Stellen, an denen jemand einzeln „nachjustiert", wären vier Orte, an
  // denen die Stimmung auseinanderläuft.
  // Und was hier ausdrücklich NICHT passiert: der Himmel wird nicht angefasst. Er gehört dem
  // Tag/Nacht-Zyklus, und eine Stimmung, die ihm hineinschreibt, wäre der zweite Schreiber auf
  // derselben Eigenschaft — die Klasse, die dieses Projekt am 30.8. dreimal bezahlt hat.
  let stimmung = null;
  function stimmungSetzen(id) {
    stimmung = id ? stimmungNach(id) : null;
    globe.setStimmung(stimmung);
    // Wasser: die Stimmung SCHREIBT NICHT, sie sagt nur den Farbton. Der Tag/Nacht-Zyklus bleibt
    // der einzige Aufrufer von `setOceanColors`; `globe` dreht innen.
    // ⚠ Hier stand ein eigener `setOceanColors`-Aufruf — der Zyklus hat ihn nach EINEM Tick
    // überschrieben, und die Wasserfarbe der Stimmung war bei laufender Uhr nie zu sehen. Der
    // Kommentar drei Zeilen höher hatte genau davor gewarnt.
    globe.setWasserTon(stimmung ? stimmung.wasser : null);
    // Atmosphäre: derselbe Weg, derselbe Grund. Der Zyklus schreibt Himmel, Nebel und Hüllenglut;
    // die Stimmung gibt ihm nur den Farbton. Die Lichter bleiben quellentreu — Begründung in
    // `weltstimmungen.js`: die Stimmung besitzt die Atmosphäre, die Quelle das Licht.
    zyklus.setHimmelTon(stimmung ? stimmung.himmel : null);
    // Spuren: dieselbe Regel, Farbton drehen und Rest behalten. `setTint` nimmt Linearwerte,
    // deshalb über THREE.Color statt über Hex.
    const spur = new THREE.Color();
    const dreh3 = (basis, grad) => {
      spur.setRGB(basis[0], basis[1], basis[2]);
      const h = {}; spur.getHSL(h, THREE.SRGBColorSpace);
      spur.setHSL(((grad % 360) + 360) % 360 / 360, h.s, h.l, THREE.SRGBColorSpace);
      return [spur.r, spur.g, spur.b];
    };
    if (stimmung) {
      const t = dreh3([0.95, 0.82, 0.3], stimmung.spur);
      trail.setTint(t[0], t[1], t[2]);
      const s = dreh3([0.88, 0.80, 0.64], stimmung.spur);
      rauch.setTint(s[0], s[1], s[2]);
    }
  }
  // ⚠ **Das Tor, und es kann durchfallen.** Für jede der vier Stimmungen wird angelegt, die
  // Landsättigung gemessen und mit dem geprüften Stand (`verdant`) verglichen. Eine Stimmung, die
  // mehr als 10 % Sättigung verliert, ist ein Rückfall in den 30.8. — egal wie gut sie aussieht.
  // Danach wird der Ausgangszustand wiederhergestellt: **ein Prüfstand, der die Welt verändert
  // zurücklässt, ist ein Eingriff, kein Messgerät.**
  function stimmungsTor() {
    const vorher = stimmung ? stimmung.id : null;
    stimmungSetzen('verdant');
    const basis = globe.landSaettigung();
    const zeilen = [];
    let bestanden = 0;
    for (const s of STIMMUNGEN) {
      stimmungSetzen(s.id);
      const sat = globe.landSaettigung();
      const anteil = basis ? sat / basis : 0;
      const ok = anteil >= 0.9;
      if (ok) bestanden++;
      zeilen.push((ok ? '✓ ' : '✗ ') + s.id + ' sat ' + sat
        + ' (' + Math.round(anteil * 100) + ' % of verdant ' + basis + ')');
    }
    stimmungSetzen(vorher);
    return { bestanden, von: STIMMUNGEN.length, basis, zeilen };
  }
  stimmungSetzen('verdant');
  // ⚠ Hier stand `window.__globe && (…)` — und `window.__globe` entsteht erst 300 Zeilen weiter
  // unten. Der Wächter kurzschloss, der Haken wurde nie gesetzt, und es gab keinen Hinweis darauf:
  // `a && (a.b = c)` ist die kürzeste Schreibweise für „tu nichts und sag es nicht".
  // Der Haken wird jetzt DORT eingehängt, wo das Objekt entsteht.

  const meta = document.getElementById('tv-meta');
  metaSetzen();   // (der Text selbst steht oben in `metaSetzen`, damit ihn der Wiedereinhänger teilt)

  console.info('[globe] ' + JSON.stringify(globe.report()) + ' · Aufbau ' + buildMs + ' ms');
  console.info('[biome] ' + JSON.stringify(biomZahlen));
  window.__globe = { stimmungSetzen, stimmungsTor, aurora, strahlen, weissTor,
                     THREE, renderer, scene, camera, rig, globe, carpet, avatar, trail, lines,
                     controls, stars, lights, preset, timeOfDay, fire, seed, terrainType,
                     audio, narrator, carrier, petKin, petFace, panel, gear, lighting,
                     intro, look, zyklus, schatten, leaves, wake, rauch, dice, marken, post, sky, registry, tuerme,
                     portale, gegner,
                     budget, phong, papier,
                     // v4 · Slice B · Verdrahtungsebene und Antrieb
                     fx, wucht,
                     get hudFlug() { return hudFlug; },
                     /** Ein Weltschritt mit GEGEBENEM dt — die Uhr des Prüfstands. */
                     step,
                     /** Den rAF-Loop anhalten / freigeben. Zwei Antriebe wären Fehlerklasse 1. */
                     freeze() { eingefroren = true; },
                     thaw() { eingefroren = false; last = performance.now(); },
                     get eingefroren() { return eingefroren; },
                     flug, staub,
                     get landSuche() { return { ueberWasserS, offsetGrad: +(landOffset * 180 / Math.PI).toFixed(1) }; },
                     biom: { hier: () => biomHier, report: biomReport, at: biomeAt,
                             zeile: biomeZeile, abweichungen: biomeAbweichungen,
                             letzteProbe: biomeLetzteProbe,
                             basisSetzen: biomeBasisSetzen }, kollision,
                     get wiederTakte() { return wiederTakte; },
                     get wiederFehler() { return wiederFehler + (wiederLetzterFehler ? ' · ' + wiederLetzterFehler : ''); },
                     get frameFehler() { return frameFehler + (frameLetzterFehler ? ' · ' + frameLetzterFehler : ''); },
                     /** v5 · Slice C · **Derselbe Zähler als ZAHL.** `frameFehler` liefert bei
                      *  einem Fehler einen Satz („3 · message"), und `+"3 · message"` ist `NaN`.
                      *  Der Prüfstand hat genau das gelesen: `NaN || 0` → 0, also blieb die
                      *  Invariante „frame errors 0 → 0" grün, egal wie oft der Loop starb — eine
                      *  Kontrollprobe, die nicht durchfallen kann. Ein Kanal je Zweck. */
                     get frameFehlerZahl() { return frameFehler; },
                     get pruefstand() { return ps; },
                     get ps() { return ps; },
                     get vorwaermung() { return { ms: warmMs, was: warmWas }; },
                     orte, hud, flug,
                     get gesammelt() { return gesammelt; },
                     get deckName() { return deckName; },
                     get petOberflaeche() { return petOberflaeche; },
                     aufbauMs: buildMs,
                     get petScale() { return petScale; },
                     mechStation,   // v9 · für Abnahme und Konsole: Tore lesbar machen
                     markenSites, flug, lampe, sonnenSchatten, flare, vulkane, leuchttuerme,   // v9
                     komposition,   // v10 · Rule of Three — Tor lesbar für Abnahme
                     setPetScale(v) { petScale = v; if (petParts) petParts.object3D.scale.setScalar(v); },
                     get frameLift() { return frameLift; }, setFrameLift(v) { frameLift = v; },
                     get kartenQuelle() { return kartenQuelle; },
                     // v11 · Karten-Instrumente von außen: der Prüfstand und die Abnahme müssen
                     // „gesammelt" auslösen können, ohne 56 Durchflüge zu fliegen.
                     teppiche, kasse,
                     sammleProbe(n) {
                       const liste = teppiche.anker().slice(0, Math.max(1, n || 1));
                       let z = 0; for (const a of liste) if (teppiche.gesammelt(a.karte)) z++;
                       if (z) sky.setAnker(teppiche.anker());
                       return z;
                     },
                     get petGeladen() { return petLoaded; },
                     get bildMs() { return +frameMs.toFixed(1); },
                     get turnRate() { return lastTurn; },
                     get camDist() { return camDist; }, setCamDist(v) { camDist = v; },
                     get avatarMats() { return avatarMatsGezaehlt; },
                     get startZaehler() { return startZaehler; },
                     get canvasAnzahl() { return document.querySelectorAll('canvas').length; },
                     probe() {
                       const b = Math.max(1, takt.bilder);
                       return { bilder: takt.bilder, mittelMs: +(takt.summeMs / b).toFixed(1),
                                maxMs: +takt.maxMs.toFixed(1),
                                geklemmtAnteil: +(takt.geklemmt / b * 100).toFixed(1) + ' %',
                                ueber33: +(takt.ueber33 / b * 100).toFixed(1) + ' %',
                                ueber100: takt.ueber100,
                                dpr: renderer.getPixelRatio(),
                                calls: renderer.info.render.calls,
                                dreiecke: renderer.info.render.triangles };
                     },
                     berichte() {
                       return { start: intro.phase, launch: launchT >= 0 ? +(launchT / LAUNCH_DUR).toFixed(2) : null,
                                maus: look.report(), zeit: zyklus.report(), wuerfel: dice.report(),
                                props: marken.report(), laub: leaves.report(),
                                blur: +post.strength.toFixed(3), schatten: +schatten.opacity.toFixed(3) };
                     },
                     setDpr(v) { renderer.setPixelRatio(v); resize(); } };

  // ── v5 · Slice C · Der Prüfstand wird ANGESCHLOSSEN ─────────────────────────────────────
  // ⚠ **Er lag seit Slice B als Modul im Projekt und war von NIRGENDS importiert.** Das ist der
  // Kernbefund des Critique — gebaut und nicht verdrahtet — angewandt auf mein eigenes
  // Werkzeug, und es ist die peinlichere Variante: ein Prüfstand, den nichts aufruft, lässt sich
  // nicht daran erkennen, dass etwas fehlt. Er fällt nicht auf, er fällt AUS.
  // Erst hier, weil er die Welt über `__globe` liest — die Panel-Knöpfe lesen `ps` beim Klick.
  ps = createPruefstand({ welt: window.__globe });
  console.info('[pruefstand] ' + ps.zeile());
}

start().catch((e) => {
  console.error('[globe] start failed', e);
  const s = buehne();
  if (s) s.textContent = 'Start failed: ' + (e && e.message || e);
});
