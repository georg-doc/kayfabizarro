# Bauanleitung: Ein KFB Cube-Pet komplett einbauen — Plug & Play

**Version:** 2.2 · **Stand:** 2026-08-04 · **Für:** externe LLMs / fremde Apps, die einen fertigen
KayfaBizarro-Cube-Pet in eine three.js-Szene setzen wollen — **mit allen Features** (Augen, Mienenspiel,
Bewegung, Mund/Viseme, Sprechblase, Indikator, Schlaf).

Dieses **eine Dokument reicht**. Es referenziert nur Dateien, die schon auf GitHub liegen (per URL).
Du brauchst keine weitere Datei aus dem Projekt, keinen Build-Schritt, keine npm-Installation.

> **Neu in v2:** §7e „Lebendig & appealing platzieren" (der Wach-Zustand aus dem Rollercoaster —
> schaut den Spieler an, folgt dem Cursor, schaut sich bei Inaktivität um) und §7f „State-Bundles"
> (kuratierte Ereignis-Kombis in EINEM Aufruf, mit copy-paste `PetBundles` und Regie-Rezepten für
> die häufigsten Momente).

> **Neu in v2.1:** §16 „Puppeting / External Drive" — der Treiber-Vertrag aus Pet Studio v4 §2b:
> fünf benannte Viseme am Mund und sechs Methoden, mit denen eine **externe Zeitleiste** den Pet
> treibt, ohne seine Interna zu kennen. Rein additiv: an §2–§15 ändert sich nichts, bestehende
> Einbauten laufen unverändert weiter.

> **Neu in v2.2:** §6 auf den echten Stand gebracht. Drei Punkte, an denen die v2.1-Fassung
> **falsch** war und Einbauer in die Irre geführt hat: (1) der Mund ist **keine flache Ebene mit
> View-Facing-Fade** mehr, sondern per Raycast an die Körperfläche **angeschmiegt** (52 Punkte,
> tiefengetestet) — der Fade ist nur noch Restsicherung; (2) es gibt **drei** Mund-Sets, nicht zwei,
> und ein Set darf **Formen fehlen** (Fallback-Auflöser); (3) die `setParams`-Liste war unvollständig
> (`lift`/`wrap`/`onTop`/`slope`/`set`/`visemeMap` fehlten). Additiv, keine Signatur geändert.

> **Ziel-Ablage:** dieses File gehört nach `media/3D_Assets/GLB_cube-pets/EMBED_CUBE_PET_FULL_v2.md`
> (löst `EMBED_CUBE_PET_FULL_v1.md` ab). Georg lädt es hoch.

---

## 0. TL;DR — der kürzeste richtige Weg

```html
<script type="importmap">
{ "imports": {
  "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
  "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
}}
</script>
<script type="module">
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { loadPets, makePet } from
  'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/kfb-pets.js';

// … deine renderer/scene/camera …
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;

const lib = await loadPets();                       // holt den Vertrag (kfb-pets.json)
const pet = await makePet(lib, 'bunny', { emote:'happy', motion:'idle' });
pet.object3D.scale.setScalar(1.6);                  // Studio-Maß
scene.add(pet.object3D);
pet.motion.loop('idle', true);                      // Idle-Atmung starten (makePet startet KEINE Bewegung)

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  pet.update(clock.getDelta());                     // EIN Aufruf pro Frame, Reihenfolge intern korrekt
  renderer.render(scene, camera);
});
```

Das gibt dir einen fertigen FrizzleBob mit Kugelaugen, Lidern, Blinzeln, Blickwandern, Mienenspiel,
Ruhemund und Idle-Atmung. Alles Weitere (Sprechen, Blase, Indikator, Schlaf) sind Methoden bzw.
App-Rezepte unten.

---

## 1. Der Stack — 8 Dateien, eine Quelle

Alles liegt im Repo `github.com/georg-doc/kayfabizarro` unter `media/3D_Assets/`.

| Datei | Rolle | Import |
|---|---|---|
| `kfb-pets.js` | **Dein einziger Einstieg.** Kompositionsschicht: lädt Vertrag, verrechnet Geltungsebenen, baut den Pet. | direkt importieren |
| `build/pet-library.v6.js` | `Character` — Geometrie, GLB-Laden, Material, Squash-Feder | zieht `kfb-pets.js` selbst |
| `build/pet-eye-rig.v5.js` | `EyeRig` — Kugelaugen, Lider, Blick, Blinzeln, Kinetik, Wimpern | zieht `kfb-pets.js` selbst |
| `build/pet-face.v1.js` | `PetFace` — Mienenspiel (kontinuierlicher Emote-Raum, Drift, Reaktion) | zieht `kfb-pets.js` selbst |
| `build/pet-motion.v2.js` | `PetMotion` — Bewegungen, GLB-Clips, Trigger, Combos, Sekundär-Federn | zieht `kfb-pets.js` selbst |
| `build/pet-mouth.v1.js` | `PetMouth` — Talk-Münder (Viseme-Bilder als Ebene) | zieht `kfb-pets.js` selbst |
| `pet-surface.v1.js` | `createPetSurface` — geteilter Clay/Papier-Oberflächen-Look (v9-Stack). Optional, aber ohne ihn ist das Pet flach. | direkt importieren (§10) |
| `kfb-pets.json` | **Der Vertrag** — Aussehen, Bewegung, Stimme, 24 Pets. Wird per `fetch` geholt. | `loadPets()` holt ihn |

Du importierst **`kfb-pets.js`** (zieht alle Motor-Module selbst) und — für den vollen Look —
`pet-surface.v1.js` daneben (§10). Beide liegen auf einer Ebene unter `media/3D_Assets/`.

### ⚠ Die zwei Regeln, an denen jeder scheitert

1. **Module über jsdelivr, Daten über raw.** `raw.githubusercontent.com` liefert JS als `text/plain`
   → der Browser weigert sich, es als ES-Modul zu laden → schwarzer Bildschirm. Deshalb kommen die
   `.js`-**Module** über `cdn.jsdelivr.net/gh/…` (liefert `application/javascript`). Die **Daten**
   (`.json`, `.glb`, PNG-Texturen) holt der Code per `fetch` — da ist die Rohadresse in Ordnung.
   `kfb-pets.js` macht das intern schon richtig; halte dich daran, wenn du selbst importierst.
2. **three genau 0.160, ein einziger Build.** Kein zweiter three-Build in derselben Seite.

---

## 2. Das `pet`-Objekt — vollständige API

`makePet(lib, id, opts)` liefert ein `api`-Objekt:

| Feld / Methode | Was |
|---|---|
| `pet.object3D` | `THREE.Group` — das fügst du der Szene hinzu |
| `pet.id`, `pet.name` | z. B. `'bunny'`, `'Uncle FrizzleBob'` |
| `pet.update(dt)` | **einmal pro Frame.** Ruft intern ch → motion → face → rig → mouth in genau der Reihenfolge |
| `pet.setEmote(name, {hold, hard})` | Emote setzen (`neutral · happy · angry · sad · surprised · thinking`); Ruhemund wandert mit |
| `pet.talk(on)` | Sprech-Mundshuffle an/aus (kein echter Lip-Sync — siehe §7 für Stimme-getaktetes Sprechen) |
| `pet.setMotion(name, o)` | Bewegung/Clip starten. **Achtung:** startet die *prozedurale* Idle-Atmung NICHT — dafür `pet.motion.loop('idle', true)` (oder ein Bundle). `setMotion` ist ein dünner Durchreicher und aktuell wirkungslos für `idle`; nutz direkt `pet.motion.*` |
| `pet.dispose()` | alles abräumen |
| `pet.rig` | die `EyeRig`-Instanz (§3) |
| `pet.face` | die `PetFace`-Instanz (§4) |
| `pet.motion` | die `PetMotion`-Instanz (§5) |
| `pet.mouth` | die `PetMouth`-Instanz (§6) |
| `pet.character` | die `Character`-Instanz (Roh-Geometrie/Mixer) |
| `pet.cfg` | die aufgelöste Konfiguration dieses Pets (Farbe, face, motion …) |

### `makePet`-Optionen

```js
makePet(lib, id, {
  emote: 'happy',        // Start-Emote (Default: pet.defaultEmote)
  motion: 'idle',        // Start-Bewegung
  eyes: true,            // false = ohne EyeRig (selten)
  mouth: true,           // false = ohne Mund
  session: {},           // Laufzeit-Overrides (face/actor/motion/koerper), gewinnt gegen Pet & global
  surface,               // Oberflächen-Objekt aus createPetSurface() — voller Clay/Papier-Look (§10)
  THREE, loadGltf, makeMat  // optional eigene three-Instanz/Loader/Material
})
```

---

## 3. `pet.rig` — EyeRig v5 (Augen)

Der Rig baut **echte Kugelaugen mit oberen/unteren Lidern** — nie flache Scheiben. Wichtige Methoden:

| Methode | Wirkung |
|---|---|
| `rig.applyEmote({lidUpper, lidLower, slant, pupil, gaze})` | roher Augen-Ausdruck (normal geht das über `pet.setEmote`) |
| `rig.setGazeFollow(on)` | Pupillen folgen einem Punkt (PetFace übernimmt das) |
| `rig.pointTo(nx, ny)` | Blickziel −1..1 (Cursor-Follow: **x negieren**) |
| `rig.blinkNow()` | sofort blinzeln |
| `rig.setBlink({minGap, maxGap, dur})` | Blinzel-Rhythmus |
| `rig.setKinetics({a, c, j})` | Beschleunigung/Kurve/Ruck → Blick + Lider (Fahrzeug-Events) |
| `rig.setLife({on, wander, tremor})` | „Leben" (Mikro-Wandern) — **nur ohne PetFace wirksam** (läuft PetFace, besitzt es die Augen) |
| `rig.setLashes({length, density, width})` | Wimpern (dunkle Kegel an der Oberlid-Kante, folgen Blink) |
| `rig.setPupilStyle('matte-cute'\|'glossy-googly')` | matt oder glänzend-googly |
| `rig.setBaseColor(hex)` | Lid-/Grundfarbe |

**Regel:** Wenn `PetFace` aktiv ist (Standard), gehören die Pupillen ihm — treib den Blick über
`pet.face`, nicht direkt über den Rig.

---

## 4. `pet.face` — PetFace v1 (Mienenspiel)

Kontinuierlicher Emote-Raum: wandert und zittert statt sechs harter Presets. Treibt den Rig, hängt
den Ruhemund ans Emote.

| Methode | Wirkung |
|---|---|
| `face.set(name, {hold, hard})` | Emote setzen; `hard:true` = Augen zucken sofort; hält `hold` s, dann Drift |
| `face.nudgeGaze(gx, gy, hold)` | Blick-Impuls ohne Lidwechsel (Kurve, Karte ansehen) |
| `face.setCursor(nx, ny)` | zum Cursor schauen, löst sich nach 2.4 s in Ruhe auf |
| `face.setDrift(on)` | Idle-Wandern des Ausdrucks an/aus |
| `face.eyePop(k)` | Augen ploppen größer auf, federn zurück (Schreck) |
| `face.eyeOval(k, hold)` | Augen oval stauchen (Anstrengung/Zukneifen) |
| `face.still()` | aktuellen Ausdruck festhalten, Impulse löschen |

`face.onSet` ist der Hook, über den `PetMouth.setRest` den Ruhemund nachzieht (in `makePet` schon
verdrahtet).

---

## 5. `pet.motion` — PetMotion v2 (Bewegung)

Drei Ebenen, nie zusammenlegen: **motions** (prozedurale Squash-Schicht), **clips** (die 8
GLB-Clips), **triggers/combos** (Game-Events).

| Methode | Wirkung |
|---|---|
| `motion.hop({toX, toZ})` / `motion.powerJump()` | Sprünge |
| `motion.jumpTo(x, z, {hops})` / `motion.locomotion()` | hüpfend zum Ziel |
| `motion.turnTo(rad)` / `motion.turn180()` | drehen |
| `motion.celebrate()` / `motion.react('positive'\|'negative')` | Reaktionen |
| `motion.loop(name, on)` | Loop (z. B. `'loading'`) |
| `motion.playClip(name, {speed, loop})` | roher GLB-Clip: `static·idle·walk·run·eat·dance·gesture-positive·gesture-negative` |
| `motion.trigger('drop'\|'brake'\|'curveL'\|'curveR'\|'card'\|'still')` | Game-Event: Augen → Gesicht → Körper → FX in dieser Reihenfolge |
| `motion.combo('doubleTake'\|'shiver'\|'tada'\|'random')` | vorgebaute Anticipation-Aktion-Recover |
| `motion.initParts()` | Sekundär-Federn für benannte Teile (Ohren/Schweif/Geweih) aktivieren |
| `motion.setMaster(x)` / `motion.setSmooth(t)` | Squash-Stärke / Ausgangs-Glättung |

**Prime Directive:** jede Bewegung ist Interpunktion einer Rede und **settlet in Ruhe** — kein
Dauer-Idle-Fidget. Keine Casino-Politur; das Wonky/Handgemachte ist die Marke.

---

## 6. `pet.mouth` — PetMouth v1 (Talk-Münder)

Transparente Character-Animator-PNGs als **angeschmiegte** Fläche auf dem Körper.
**Kein Lip-Sync** — Visem-Shuffle im Silbentakt liest sich als Sprechen.

### 6.1 Die drei Mund-Sets

| Set | Ordner | Formen | Anmerkung |
|---|---|---|---|
| `male` | `FrizzelBob-Mouth_01/` | 13 | Default. Beige — auf gelbem Körper **schwach sichtbar** |
| `female` | `FrizzleBob-FemaleMouth_01/` | 13 | eigener Prefix, engere Lage (`size 0.40 · dy −0.73`) |
| `red` | `FrizzleBob-RedMouth_01/` | **12** | rote Lippen, **kein `smile`** → Fallback `neutral`. Gleiche Leinwand wie `male` (274×169), also identische Platzierung |

Alle drei liegen unter `media/3D_Assets/Textures/`. Die Sets haben **unterschiedliche
Dateinamen-Schemata** (Prefix, Mittelsegment, und `red` schreibt `Aa` statt `Ah` und `W-Oo` mit
großem O) — deshalb mappt das Modul pro Set Datei für Datei. Nie ein Schema aus einem anderen Set
ableiten, das 404t still.

> **Ein Set darf Formen FEHLEN.** `_key()` löst jeden angefragten Namen auf einen Schlüssel auf, der
> im aktuellen Set wirklich existiert → sonst auf `fallback` → sonst `null`. Damit kann **kein**
> Ladeversuch auf `base + "undefined"` entstehen. `mouth.has(name)` gibt ehrlich Auskunft,
> `mouth.setId` nennt das aktive Set.

### 6.2 Methoden

| Methode | Wirkung |
|---|---|
| `mouth.talk(on)` | Shuffle an/aus (offene Formen häufig, M/F/W-oo als Closer, Mikro-Pausen) |
| `mouth.talkBurst(dur)` | für `dur` s reden, dann Ruhemund |
| `mouth.setTex(key, pop=true)` | genaue Mundform (`smile·neutral·m·d·s·ee·uh·ah·oh·r·f·woo·l`) |
| `mouth.setViseme(id, {pop})` | eine der **fünf** Sprech-Formen (§16.1) |
| `mouth.setRest(emoteId)` | Ruhemund ans Emote koppeln (via `face.onSet` automatisch). Ein `restMap`-Eintrag darf eine **Form** sein: `{tex, bend, rot}` |
| `mouth.setSet('male'\|'female'\|'red')` | Set umschalten (Cache leeren, neu warm laden, laufende Form neu setzen) |
| `mouth.has(key)` / `mouth.setId` | hat das aktive Set diese Form? / welches Set ist aktiv? |
| `mouth.setParams({…})` | siehe 6.3 |
| `mouth.express({bend, rot}, hold)` | temporärer Ausdrucks-Override (Combos/FX) |

### 6.3 `setParams` — vollständige Liste

| Parameter | Default | Wirkung |
|---|---|---|
| `size` | 0.44 | Höhe relativ zu U (halbe Körperhöhe) |
| `dy` / `dx` | −0.52 / 0 | Anker unter der Körpermitte / seitlich (U) |
| `sx` | 1 | Breite-Faktor |
| `rot` / `tilt` | 0 / 0 | Drehung in der Fläche ° / Kippung um die obere Kante ° |
| `bend` | 0 | Mundwinkel: **+ hebt** (Lächeln), **− senkt** (Frown). Trägt Emotion, wenn eine Form fehlt |
| `rate` | 1 | Sprech-Tempo des Shuffles |
| `set` | `'male'` | Mund-Set (6.1) |
| `visemeMap` | §16.1 | Zuordnung Visem→Form, Teil-Maps ergänzen |
| `lift` | 0.03 | Abstand **vor** der Körperfläche (U) |
| `wrap` | 1 | Anschmiegen 0…1. **0 = flache Ebene = Rückweg auf das Verhalten vor v4** |
| `slope` | 0.05 | max. Tiefen-Wanderung je Spalte (U). Bremst den Knick an der Wangenkante. `<=0` = aus |
| `onTop` | false | true = `depthTest` aus, Mund liegt vor allem (alter Zustand) |

### 6.4 Anschmiegen statt Schweben — was v4 geändert hat

**Bis v2.1 stand hier, der Mund sei eine flache Ebene mit View-Facing-Fade. Das ist überholt.**
Beim `refit()` wird **jeder der 52 Eckpunkte einzeln** per Raycast auf die Körperfläche abgetastet
und um `lift` davorgesetzt (Wölbungstiefe gemessen 0,000 → **0,284 U**). Der Mund ist
**tiefengetestet** (`depthTest` an + `polygonOffset −2/−2`), liegt also **in** der Silhouette und wird
von Geometrie davor (Schnauze, Ohr, Arm) korrekt verdeckt. Der View-Facing-Fade ist nur noch
Restsicherung für extreme Winkel.

Zwei Dinge, die daraus folgen:

- **Eckpunkte, die den Körper verfehlen** (Mund breiter als das Pet), erben die Tiefe ihres inneren
  Nachbarn — die Fläche flacht nach hinten ab statt vorzustehen. Viele Fehlschüsse meldet die Konsole;
  `sx` ist dann zu groß. **Anschmiegen kann keinen Körper erfinden, der nicht da ist.**
- **`slope` ist die Knick-Bremse.** Ohne sie sprang ein Punkt, der um die Wangenkante eine
  zurückweichende Fläche traf, in einem Spaltenschritt nach hinten = harte Stufe in der Lippe.
  Gemessen bei `size 0.71 · sx 1.54`: größter Nachbar-Sprung 0,1352 → 0,0500 U (**−63 %**) bei nur
  −1 % Wölbungstiefe. `0.03` drückt das Anschmiegen flach (−29 %) — darum nicht Default.

Rückweg in einem Schritt: `setParams({ wrap: 0, onTop: true })` = Verhalten wie vor v4.

---

## 7. Feature-Rezepte (App-Schicht, nicht im Motor)

Sprechblase, Stimme-getaktetes Sprechen, Indikator und Schlaf sind **Kompositionen im App-Layer**
(Studio v3), nicht Teil der geteilten Module. Die Motor-Hooks dafür sind oben; hier die Rezepte.

### 7a. Sprechblase (DOM/SVG-Overlay)

- **Overlay über der Bühne, kein 3D** — so bleibt die Schrift scharf. Anker am **Screen-Punkt** des
  Pets (projiziere `pet.object3D`-Position mit `camera` auf die Leinwand).
- **Drei Register:** Sprechblase = Rechteck · Denkblase = runde Wolke, Schweif aus kleinen Blasen ·
  Flüstern = unterbrochene Umrandung.
- **Umrandung handgezogen** (Feder-Jitter wie die Ink-Outline), **nie gezackt**. **Linie + Schrift
  bleiben schwarz**, nur das Papier wird pastellig getönt (Lesbarkeit kann nie kippen).
- **Immer nur EINE Blase**, im Feld gegenüber dem Pet, Zipfel zum Pet.
- **Ballon-Trägheit:** läuft das Pet, wird die Blase mit derselben Feder nachgezogen (fällt als
  Anticipation heraus).
- **Versalien = Schreien** (rein Textkonvention).

### 7b. „Die Stimme ist die Uhr" — Sprechen mit Visemen

Der Browser-`speechSynthesis` taktet **Text UND Mund**, nie ein eigener Timer (sonst Drift):

```js
const u = new SpeechSynthesisUtterance(text);
u.lang = 'de-DE';
u.voice = pickBestGermanVoice();          // nächstbeste lokale de-DE-Stimme, NIE eine feste voiceURI speichern
u.onboundary = (e) => {
  // 1. Text bis e.charIndex enthüllen  2. Buchstaben des laufenden Wortes -> Viseme-Queue
  const word = text.slice(e.charIndex).split(/\s+/)[0];
  enqueueVisemes(wordToVisemes(word), estWordDuration);   // betonte Vokale spielen, Rest verwischen
};
u.onend = () => pet.mouth.talk(false);
pet.mouth.enabled = true;
speechSynthesis.speak(u);
// im Frame-Loop den Viseme-Queue abspielen -> pet.mouth.setTex(nextVisem)
```

- **DE-Buchstabentabelle** (kein Sprachmodell): `a/ä→ah, e→ee, i/y→ee, o/ö→oh, u→uh, ü→woo, m/b→m,
  f/w/v→f, s/z→s, l→l, r→r`, Rest verwischt auf `neutral`. Vokale bekommen mehr Zeit (Gewicht 1.5).
- **Fallback** ohne `boundary`-Events (manche Mobil-Browser): nach ~380 ms auf geschätzten Takt
  umschalten.
- **Stimmen sind nicht portabel** — im Contract nur den *Wunsch* (`voice.speech.pitch/rate/category`)
  speichern, nie eine konkrete Stimme.

### 7c. Indikator (drei Zeichen über dem Kopf)

- Blase wegklickbar, **Stimme läuft weiter**; dieselben Zeichen holen die Blase zurück. Solange die
  Blase offen ist, kein Indikator.
- **Form kündigt an:** Quadrate → Sprechblase, Punkte → Denkblase.
- **Drei Zustände über BEWEGUNG, nicht Farbe** (24 Pets, zu verschiedene Farben): neu = hüpft,
  gelesen = still/zurückgenommen, denkt = langsamerer, ungleichmäßiger Rhythmus.
- **Anker über dem KÖRPER**, nicht dem ganzen Modell. Ohren/Hörner/Geweih/Schnäbel sind getrennte
  Schalen — **alle** Ausreißer abziehen (der Hirsch hat zwei Paare übereinander). Nutze
  `Character.getFaceShells()` / die Body-BBox. **Konstanter Abstand über dem Kopf, nicht gleiche Höhe
  über dem Boden** (Köpfe sind verschieden hoch: Hase 1.33 · Katze 1.25 · Elefant 1.16 · Krebs 0.91).

### 7d. Schlaf-Zustand

**EIN Auslöser** setzt Ausdruck UND Bewegung zusammen (ein Wertesatz aus vorhandenen Teilen):
Lider zu (`rig`), langsamerer Atem + breiteres Wiegen (`motion` idle-Parameter), leichte Vorneigung.
**Klick weckt** mit dem Freuden-Hüpfer (`motion.celebrate()` / `hop`). Auslöser aus Untätigkeit
**pro Pet gemessen**, nie global (sonst schläft der Gesprächspartner mitten im Satz ein).

---

### 7e. Lebendig & appealing platzieren — nicht nur „in den Raum stellen"

Ein Pet, das nur `scene.add()` bekommt, wirkt tot. Vier Dinge trennen „ein Objekt steht da" von „da
wohnt jemand":

**1. Winkel & Blickachse.** Das Pet schaut nach **+z** (`motion.front = {x:0, z:1.1}`). Stell die Kamera
in eine **3/4-Front** und dreh das Pet leicht zu ihr — Appeal heißt, wir sehen beide Augen und die
Gesichtsebene. Reine Seiten-/Rückenansicht killt jede Miene.

**2. Bodenkontakt.** Kontaktschatten + Sockel (§8) erden das Pet; schwebt es, wird es unheimlich.
`object3D.position.y ≈ 0.004`, Skala `1.6`.

**3. Headroom.** Über dem Kopf Platz lassen — Sprechblase und Indikator (§7a/§7c) brauchen ihn.

**4. Der Aliveness-Dreiklang** — exakt der Zustand aus dem Rollercoaster. **Er steckt schon komplett im
Motor**, du schaltest ihn nur ein:

- `face.setDrift(true)` (Default an) — der Ausdruck **wandert** zwischen neutral↔thinking und kommt
  durch ein feines Zittern nie ganz zur Ruhe. Das IST das „schaut sich um bei Inaktivität".
- `rig.setBlink({minGap, maxGap, dur})` — unregelmäßiges Blinzeln (wirkt auch bei aktivem PetFace).
- *(`rig.setLife(…)` wäre das Augen-Wandern — greift aber NUR, wenn KEIN PetFace läuft; im Normalfall
  besitzt PetFace die Augen und `face.setDrift` erledigt das Umschauen.)*
- **Cursor-Follow:** auf `pointermove` `face.setCursor(-nx, ny)` (**x negieren!**). Der Blick folgt dem
  Cursor und **löst sich nach 2.4 s von selbst zurück in den Drift** — kein Aufräumen nötig.

Copy-paste — ein Aufruf macht ein Pet „wach":

```js
function attend(pet, canvasEl) {
  pet.face.setDrift(true);
  pet.rig.setBlink({ minGap: 2.2, maxGap: 6.5, dur: 0.13 });
  const onMove = (e) => {
    const r = canvasEl.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
    pet.face.setCursor(-nx, ny);        // x NEGIEREN; klingt nach 2.4 s in den Drift aus
  };
  canvasEl.addEventListener('pointermove', onMove);
  return () => canvasEl.removeEventListener('pointermove', onMove);   // Cleanup
}
```

**Prime Directive:** Das ist der einzige *Dauer*-Zustand. Alles unten ist **Interpunktion** — feuert
einmal und settlet zurück in diesen wachen Ruhezustand. Kein Endlos-Zappeln.

---

### 7f. State-Bundles — Standard-Events in EINEM Aufruf

Statt für jedes Ereignis Gesicht, Bewegung und Augen einzeln zu verdrahten, ruf ein **Bundle**. Jedes
ist ein dünner, kuratierter Wrapper über die echte API (§4–§6) — die Kombis, die wir selbst benutzen,
mit der richtigen Reihenfolge (Augen vor Körper) schon drin.

#### Die kuratierte Bundle-Matrix

| Bundle | Anlass im Game/App | Motor darunter | Register |
|---|---|---|---|
| `attend(pet, canvas)` | **Grundzustand**, immer an | Drift + Life + Blink + Cursor (§7e) | wach, lebendig |
| `greet(pet)` | Pet erscheint / User kommt | happy(hard) + eyePop + hop | freundlich |
| `notice(pet)` | etwas Neues taucht auf | `combo('doubleTake')` | neugierig, „hö?" |
| `agree(pet)` | Ja / richtig / bestätigt | `react('positive')` | Nicken, positiv |
| `disagree(pet)` | Nein / falsch / Fehler | `react('negative')` | Absacken, negativ |
| `celebrate(pet)` | Erfolg / Win / Level up | `combo('tada')` | großer Jubel |
| `think(pet)` / `thinkStop(pet)` | verarbeitet / lädt | thinking + `loop('loading')` | denkt, wartet |
| `startle(pet)` | Schreck / Drop / Impact | `trigger('drop')` | erschrickt |
| `shiver(pet)` | Kälte / Angst / nervös | `combo('shiver')` | zittert |
| `sleep(pet)` / `wake(pet)` | Inaktivität / Aufwecken | Lider zu + langsamer Atem / Jubel-Hüpfer (§7d) | schläft |
| `speak(pet, text)` | spricht | Stimme-Pipeline (§7b) + `mouth` | redet |

**Regeln der Matrix (damit es kuratiert bleibt):**
- **Höchstens ein „lautes" Bundle gleichzeitig.** `celebrate` und `startle` überschreiben einander —
  nicht stapeln.
- **Alles kehrt in `attend` zurück.** Bundles sind Ausrufezeichen, kein Dauerlauf (Prime Directive).
- **`sleep` gewinnt gegen alles**, `wake` bricht es (Klick/Input).
- **Sentiment mappt direkt:** positiv→`agree`/`celebrate`, negativ→`disagree`/`shiver`,
  neutral-neu→`notice`.

#### Copy-paste: `PetBundles`

Liegt fertig im Repo unter `media/3D_Assets/pet-bundles.v1.js` — direkt importierbar
(`import { PetBundles } from './pet-bundles.v1.js'` oder per jsdelivr-URL), braucht nichts außer dem
fertigen `pet` aus `makePet`:

```js
export const PetBundles = {
  // Dauerzustand — einmal aufrufen, gibt eine Cleanup-Funktion zurück
  attend(pet, canvasEl) {
    pet.face.setDrift(true);
    pet.rig.setBlink({ minGap: 2.2, maxGap: 6.5, dur: 0.13 });
    const onMove = (e) => {
      const r = canvasEl.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      pet.face.setCursor(-nx, ny);
    };
    canvasEl.addEventListener('pointermove', onMove);
    return () => canvasEl.removeEventListener('pointermove', onMove);
  },

  // Interpunktion — feuern einmal, settlen zurück in attend
  greet(pet)      { pet.face.set('happy', { hard: true, hold: 1.6 }); pet.face.eyePop(0.5); return pet.motion.hop(); },
  notice(pet)     { return pet.motion.combo('doubleTake'); },
  agree(pet)      { return pet.motion.react('positive'); },
  disagree(pet)   { return pet.motion.react('negative'); },
  celebrate(pet)  { return pet.motion.combo('tada'); },
  startle(pet)    { return pet.motion.trigger('drop'); },
  shiver(pet)     { return pet.motion.combo('shiver'); },

  // Zustände mit Ein/Aus
  think(pet)      { pet.face.set('thinking', { hold: 999 }); pet.motion.loop('loading', true); },
  thinkStop(pet)  { pet.motion.loop('loading', false); pet.face.set('neutral', { hold: 0.4 }); },

  sleep(pet) {
    pet.face.enabled = false;                                    // Face gibt die Lider frei
    pet.rig.applyEmote({ lidUpper: 1, lidLower: 0.55, slant: 0, pupil: 'normal', gaze: 'front' });
    pet.motion.setParams({ idle: { breathe: 0.015, period: 4.2, sway: 0.022 } });
    pet.motion.loop('idle', true);
    pet.object3D.rotation.x = 0.06;                              // leichte Vorneigung
  },
  wake(pet) {
    pet.object3D.rotation.x = 0;
    pet.motion.setParams({ idle: { breathe: 0.03, period: 2.8, sway: 0.01 } });
    pet.face.enabled = true;
    pet.face.set('happy', { hard: true, hold: 1.4 });
    return pet.motion.celebrate();
  },
};
```

> **Sentiment-Kürzel:** `PetBundles[{positive:'celebrate', negative:'disagree', neutral:'notice'}[mood]](pet)`
> feuert das passende Bundle aus einem Stimmungs-String in einer Zeile.

#### Regie-Rezepte — Bundle-Folgen für die häufigsten Momente

| App-Moment | Bundle-Folge |
|---|---|
| **Onboarding / erster Auftritt** | `attend()` (einmal) → `greet()` → `speak("Hi, ich bin FrizzleBob!")` |
| **Chat-/Assistent-Antwort** | User sendet → `think()`; Antwort da → `thinkStop()` → `speak(antwort)` → Sentiment: `agree`/`celebrate`/`disagree` |
| **Quiz / Game-Feedback** | richtig → `celebrate()` · falsch → `disagree()` (hart: `startle()`) |
| **Leerlauf-Zyklus** | Timer **pro Pet**: 20 s inaktiv → `sleep()`; Klick/Input → `wake()` |
| **Benachrichtigung / Nudge** | `notice()` + Indikator (§7c) über dem Kopf; Blase bei Klick |
| **Ladephase** | `think()` … `thinkStop()` |

**Inaktivitäts-Timer (pro Pet, nie global — sonst schläft der Gesprächspartner mitten im Satz ein):**

```js
let idleAt = performance.now(), sleeping = false;
const poke = () => { idleAt = performance.now(); if (sleeping) { sleeping = false; PetBundles.wake(pet); } };
['pointerdown', 'pointermove', 'keydown'].forEach((ev) => addEventListener(ev, poke));
// im Frame-Loop:
if (!sleeping && performance.now() - idleAt > 20000) { sleeping = true; PetBundles.sleep(pet); }
```

---

## 8. Beleuchtung — genau so, sonst kippt der Look

Der Claymation-Look hängt an der Beleuchtung. Harte Directionals schnitzen die Low-Poly-Facetten als
Terrassen heraus — deshalb trägt eine **HDRI das Grundlicht**, der Key ist nur ein weicher Zusatz.

```js
// HDRI trägt das weiche Grundlicht (PFLICHT für den Look)
scene.environment = new THREE.PMREMGenerator(renderer)
  .fromScene(new RoomEnvironment(), 0.04).texture;

scene.add(new THREE.AmbientLight(0xffffff, 0.5));
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.5));

const key = new THREE.DirectionalLight(0xffffff, 2.6);   // weicher Key
key.castShadow = true; key.shadow.mapSize.set(2048, 2048);
key.shadow.bias = -0.0005; key.shadow.radius = 12;
scene.add(key);

scene.add(new THREE.DirectionalLight(0xdfeaff, 0.9));                     // Fill, kühl, gegenüber
const rim = new THREE.DirectionalLight(0xf6efd9, 0.8);                    // Rim, warm, hinten
rim.position.set(-2.4, 1.9, -2.6); scene.add(rim);
```

Renderer: `outputColorSpace = SRGBColorSpace`, `toneMapping = ACESFilmicToneMapping` (oder neutral),
`shadowMap.enabled = true` (`PCFSoftShadowMap`).

**Bühne (optional, Studio-Maß):** ein abgeschrägter Sockel (`CylinderGeometry(1.28, 1.4, 0.12, 40)`)
im Pet-Material + Kontakt-Schatten. Pet-Skala `1.6`, `object3D.position.y ≈ 0.004`.

---

## 9. Die 24 Pets

`bunny` (Default, „Uncle FrizzleBob") ist der Erzähler. Alle liegen als `animal-<id>.glb` unter
`assets.glbBase`, per raw-URL ladbar (CORS *). Farbe = `pet.color` als **selektiver Recolor** der
eingebetteten Colormap (siehe §10).

| id | Name | Archetyp | Farbe |
|---|---|---|---|
| bunny | Uncle FrizzleBob | carny-host | `#d3a244` |
| fox | The Fox | trickster | nativ |
| cat | The Cat | skeptic | nativ |
| penguin | The Penguin | deadpan | nativ |
| panda | The Panda | sage | nativ |
| koala | The Koala | dreamer | nativ |
| tiger | The Tiger | brawler | nativ |
| lion · deer · monkey · pig · hog · cow · polar · beaver · giraffe · chick · fish · parrot · bee · crab · caterpillar · elephant · dog | — | — | nativ |

„nativ" = kein `color` gesetzt → das GLB behält seine eingebettete Colormap (z. B. Pinguin-Schnabel
bleibt orange). Nur `bunny` trägt eine gedämpfte Recolor-Farbe.

**Liste im Code:** `petList(lib)` → `[{id, name, color, isDefault}]`, `petIds(lib)`, `glbUrl(lib, id)`.

---

## 10. Der Vertrag `kfb-pets.json` — Aufbau & Werte

`$schema: "kfb.pets/1"`, aktuell **v1.2.x**. Geltungsebenen: `global → pet → session` (Pet gewinnt
gegen global, Session gegen beide). Kommentar-Felder beginnen mit `_` und werden nie gemergt.

### Emote-Vokabular (`face.emotes`) — das stabile Vokabular, das Apps triggern

| Emote | lidUpper | lidLower | slant | gaze |
|---|---|---|---|---|
| neutral | −0.4 | 0 | 0 | [0, 0] |
| happy | 0 | 0.3 | 0 | [0, 0] |
| angry | 0.25 | 0.1 | −0.4 | [0, 0] |
| sad | 0.15 | 0.05 | 0.35 | [0, −0.85] |
| surprised | −0.2 | −0.1 | 0 | [0, 0] (pupil: wide) |
| thinking | 0.4 | 0 | 0.05 | [0.9, 0.2] |

Werte 0..1 (Lid = geschlossen-Anteil, negativ = weiter offen). slant negativ = down-in (angry),
positiv = up-out (sad). **Keine Münder tragen die Emotion — Augen/Lider tun das.**

### Bewegung (`motion`)
- `motions` (prozedural): `idle · hop · powerJump · locomotion · loading · transition · turn ·
  celebrate · reactPos · reactNeg` + `secondary` (Follow-Through-Federn).
- `clips` (GLB, mit `speed`): `static · idle · walk · run · eat · dance · gesture-positive ·
  gesture-negative`.
- `triggers`: `drop · brake · curveL · curveR · card · still` (deklaratives face/body/fx/eye-Mapping).

### Stimme (`voice`)
- `bubble {gap:46, pad:9, line:2, paperTint:0.5, fontSize:15}` — Blasen-Darstellung.
- `speech {pitch:0, rate:1, category:null}` — `category:null` heißt „aus Archetyp ableiten"
  (carny-host→carny, deadpan→deadpan, sage→sage). Pro Pet überschreibbar.
- `narratorPromptBase` global; `pets[].narratorPromptRef` pro Pet.

### Material/Körper (`koerper.material.live`)
Default `clay` (Aardman-Fingerabdruck-Bump), object-space **Triplanar-Shader** (nicht `map.repeat`),
Tönung = Luminanz × Pet-Farbe. `felt`/`cel`/`kenney` als Presets. Der Standard-`makeMat` in
`kfb-pets.js` hält sich zurück (die Colormap ist eingebettet) — flach, ohne Clay.

**Den vollen Look bringst du NICHT mehr selbst mit.** Es gibt jetzt ein geteiltes Modul
`media/3D_Assets/pet-surface.v1.js` mit `createPetSurface`, das den v9-Stack (Triplanar-`makeMat` +
`_surfShader` + `reskin` + `lidSampler`) genau einmal trägt — Studio, Reference und jeder Embed
bekommen so denselben Look aus demselben Vertrag (`koerper.material.live`):

```js
import { createPetSurface } from './pet-surface.v1.js';
const surface = await createPetSurface({ THREE, renderer, material: lib.koerper.material });
const pet = await makePet(lib, 'bunny', { surface });   // kfb-pets.js verdrahtet reskin + lidSampler selbst
scene.add(pet.object3D);
renderer.compile(scene, camera);   // PFLICHT nach add — sonst lazy Programm-Cache → flach/gold
```

Drei Farb-Pfade wie v9: `uLook 0` = Recolor · `1` = Kenney-Basis · `2` = Colormap + Papier + Gelb
(`paperGold`, **nicht** multiplikativ). Lider laufen bewusst über Pfad 0 (dunkle Base bleibt), tragen
aber dieselbe Clay-Oberfläche. `koerper.material.live` liefert alle Regler (`texture`/`surf`/`paperGold`/
`tintMode`/`kenneyBase`); ohne Modul bleibt es beim zurückhaltenden Default-`makeMat`.

---

## 11. Feature-Kombinations-Matrix & Reihenfolge

**Frame-Reihenfolge ist Pflicht** (macht `pet.update(dt)` intern; wenn du es selbst zerlegst, halte
sie ein):

```
character.update → motion.update → face.update → rig.update → mouth.update
```

Vertauschen = das Gesicht hinkt einen Frame nach.

| Kombination | Geht? | Achtung |
|---|---|---|
| Emote + Bewegung | ✅ | Bewegung setzt eigene Kurzausdrücke (trigger/combo) — sie überschreiben deinen Emote für `hold` s |
| Sprechen + Emote | ✅ | Ruhemund folgt dem Emote; beim Sprechen shuffelt der Mund, Augen bleiben beim Emote |
| Sprechen + Bewegung | ✅ | ok; bei Sprüngen blinzelt der Rig automatisch |
| Blase + Indikator | gegenseitig ausschließend | offene Blase → kein Indikator; die Zeichen holen die Blase zurück |
| Schlaf + alles | Schlaf gewinnt | ein Auslöser übersteuert Ausdruck+Bewegung; Klick/Input weckt |
| Cursor-Follow + feste Gaze | Follow gewinnt | löst sich nach 2.4 s in Ruhe auf |
| Kinetik (Fahrzeug) + Idle-Wander | Kinetik gewinnt | nur bei aktiver Fahrt |

---

## 12. Fallstricke (die den Bildschirm schwarz/gelb/leer machen)

1. **Farbe als Zahl, nie als String.** Die Library rechnet mit `0xRRGGBB`. Ein `'#d3a244'` wird bei
   der Bit-Verschiebung zu 0 → sie färbt jeden farbigen Bildpunkt schwarz → schwarzes Pet.
   `makePet` wandelt intern um; wenn du `Character` direkt nutzt: `new THREE.Color(hex).getHex()`.
2. **Nie `mods:['googly']` an ein Cube-Pet.** Das hängt flache Scheiben-Augen an (2D-Figuren). Cube-
   Pets bekommen ausschließlich den `EyeRig`. `makePet` nutzt `mods:['emotes']`.
3. **`recolor`, nicht `tint`.** recolor färbt selektiv die farbigen Colormap-Pixel (Zeichnung bleibt).
   tint multipliziert das ganze Material platt → einfarbiges Pet ohne Textur.
4. **`rig.build()` und `mouth.build()` sind Pflicht** — ohne sie gibt es keine Augen/keinen Mund
   (der Rig läuft leer mit). `makePet` ruft sie; bei Direktnutzung nicht vergessen.
5. **Eingebettete Colormap.** Cube-Pet-GLBs haben ihre Colormap **im GLB**. Kein Extra-`colormap.png`.
   (Ausnahme: das Graveyard-Kit hat sie NICHT, dort muss `Textures/colormap.png` mit.)
6. **Ein Augenpaar.** Bei Pet-Wechsel altes `pet.dispose()` aufrufen, sonst stapeln sich Rigs.
7. **Dev-Falle:** viele Hot-Reloads → Zombie-Renderer (Pet verschwindet trotz gesundem Graph). Harter
   Reload hilft.

---

## 13. Was (noch) NICHT im Modul ist — Backlog

- **Krone / Kopf-Zubehör** (Accessory-Slot, Kopfbreiten-Skala): eigener Sprint, Motor-Risiko. Kommt.
- **Mund als `DecalGeometry`** aufs Body-Mesh: seit v4 **teilweise erledigt** — der 52-Punkt-Shrinkwrap
  (§6.4) löst das Schweben ohne echtes Decal. Offen bleibt nur der View-Facing-Fade, der nach dem
  Shrinkwrap überdimensioniert ist (blendet bei ~72° ab, obwohl kaum noch etwas übersteht).
- **Mund-Neigung (`tilt`)** folgt der Körperwölbung noch nicht sauber.
- ~~**Sprechblasen-Zipfel** bricht bei starkem Zoom/Rotation~~ — **erledigt** (Anker ist das geglättete
  Pet-Zentrum statt der Bbox-Oberkante, Zipfel ist ein getaperter Pfeil, EINE Totzone; Idle-Drift
  0,00 px). Rezept §7a.
- **13. PNG `smile` für `red`** — oder die Entscheidung, dass `bend` das Lächeln überall trägt. Dann
  bräuchte **kein** Set mehr ein `smile`-PNG (Look-Frage, offen).
- **Lippenstift-Register** (rote Lippen + Wimpern = clownesk/Drag): braucht Mund **und** EyeRig, also
  ein Slice mit zwei Eigentümern. Zusammen mit dem Accessory-Slot.

---

## 14. Round-Trip-Garantie

Laden → ohne Änderung exportieren → Diff muss leer sein. `version` zählt bei jedem Export hoch.
Lokale Kopien sind **Spiegel, nie Quellen** — im Zweifel die kanonische URL fetchen.

*Quelle dieses Stands: Studio v3, `kfb-pets.js` VERSION 1, `kfb-pets.json` v1.2.x, Module wie in §1.*

---

## 15. Bloom, Überstrahlung & Story-Farbe je Licht-Situation

**Das ist der Abschnitt, der bisher fehlte.** Genau hier verglühen die weißen Augen im Space/Skydome,
und genau darum wurde es „schon fünfmal gefixt": der Fix lebte in den Apps, nicht in dieser Anleitung.

### 15.1 Warum die weißen Augen überstrahlen (Mechanismus, aus dem Code)

Die weiße Sklera ist ein `MeshPhysicalMaterial` mit `clearcoat: 1` und `envMapIntensity: 1.0`
(EyeRig). Sie **spiegelt die Umgebung**. Im weichen Studio-HDRI ist das schön; in einem hellen
Space-/Sternen-Skydome wird das Weiß sehr hell. Zusätzlich sind manche Flächen `toneMapped: false`
(bleiben auf voller Helligkeit). Läuft dann ein Bloom-Pass mit niedriger Threshold, hebt er diese
hellen Weißen ins Glühen. Studio = kaum sichtbar, Space/Skydome = Überstrahlung. Deshalb ist es
**licht-situations-abhängig**.

### 15.2 Die goldene Bloom-Regel (aus der KFB Particle Academy)

> Bloom soll **nur von echten HDR-Kernen** gespeist werden: dunkler Grund, **hohe Threshold**, nie
> globale Helligkeit. Sonst überstrahlt die ganze Szene (auch Karten und Augen).

### 15.3 Die Stellschrauben (Startwerte, am Bild justieren)

1. **Bloom-Threshold hoch genug**, dass die Pet-Weißen NICHT bloomen, nur echte HDR-Kerne (Laternen,
   Partikel). Das ist der erste und billigste Hebel.
2. **Im hellen Skydome:** `envMapIntensity` der Augen runter (Start ~0.3–0.5) oder den Clearcoat
   reduzieren, damit das Weiß nicht die Skydome-Helligkeit spiegelt.
3. **Kein `toneMapped: false` auf hellen Flächen.** Weiße unter der Bloom-Schwelle halten.
4. **Sauberste Trennung, selektives Bloom:** der Pet liegt bereits isolierbar auf **Layer 2**
   (`pet.group.traverse(o => o.layers.set(2))`, Rollercoaster-Muster). Den Bloom-Pass nur auf einen
   Bloom-Layer laufen lassen und den Pet ausnehmen. Dann glühen die Augen nie, egal wie hell der Skydome.

### 15.4 Story-Farbe ins Pet-Licht (Tönung, nicht Emissive)

Die Story-Mode-Farbe tönt den Pet über die **Lichtfarbe**, nicht über Emissive (v9-Weg, sonst bloomt
es). Praktisch: eine warme Lampe am Pet, deren Farbe pro Frame Richtung Story-Ink gelerpt wird; im
hellen Skydome die Intensität höher ansetzen. Die Tönung wird **vor** dem Bloom gesetzt (Lichtfarbe),
nie als HDR-Emissive.

### 15.5 Setup je Situation (kurz)

- **Studio-HDRI:** §8 wie beschrieben, Bloom aus oder sehr hohe Threshold. Augen wie kanonisch.
- **Rollercoaster-Space / Skydome:** hohe Bloom-Threshold + `envMapIntensity` der Augen runter, ODER
  selektives Bloom über Layer 2. Story-Farbe über eine kamera-relative Pet-Lampe.
- **Academy (Würfel schwebt):** wenige Materialien, volle Freiheit; Bloom nur auf echte Glüh-Kerne,
  Pet-Weiße drunter halten.

### 15.6 Die sechs kanonischen Story-Mode-Farben

Quelle: `MODES` im laufenden Rollercoaster (`kfb-table.v6.js`). `ink` = Linie/Akzent, `panel` =
pastellige Fläche. Für Abstufungen hell→dunkel zwischen `panel` (hell) und `ink` (dunkel) interpolieren.

| n | Mode | ink (Akzent) | panel (Pastell) | Farbeindruck |
|---|---|---|---|---|
| 1 | TRAGIC | `#3e6a83` | `#dbe4e9` | blau |
| 2 | COMIC | `#5e6f33` | `#e3e9d3` | olivgrün ⚠ (siehe unten) |
| 3 | ABSURD | `#8a6d12` | `#f1e8c5` | gold/amber |
| 4 | HEROIC | `#b75f23` | `#f4e1cd` | orangerot |
| 5 | MYSTICAL | `#6b4e7d` | `#e5dde9` | violett |
| 6 | FORBIDDEN | `#8f3a5f` | `#efdbe2` | magenta/wein |

Bestätigt durch die SSOT `kayfabizarro.pages.dev/#kfb`: **COMIC ist grün** (`#5e6f33`), **ABSURD ist
das Gold/Gelb** (`#8a6d12`). Die frühere „Comic ist gelb"-Erwartung meinte Absurd. Werte stehen. Die
`n`-Spalte ist zugleich die Würfelaugenzahl (Tragic=1 … Forbidden=6), die sechs Modi SIND der KFB-D6.

---

## 16. Puppeting / External Drive — den Pet von außen treiben

**Neu in v2.1** (Pet Studio v4 §2b). Modul: `media/3D_Assets/build/pet-puppet.v1.js` —
Arbeitsstand liegt in `studio-v3/pet-puppet.v1.js`, WS0 hebt ihn ins Repo.

**Wozu.** Marketing-Clips, ein In-Game-Karten-Pitch am 3D-Card-Cube („show it, spin it, sell it") und
später ein Audio-Studio brauchen alle **dasselbe**: eine Zeitleiste, die den Pet fährt. Ohne Vertrag
greift jeder Treiber in die Motor-Interna (EyeRig-`(gx,gy)`, Decal-Keys) — genau die Falle, in die der
Travel-Cut getappt ist. Ein Charakter, zwei Bühnen, ein Vertrag.

**Was der Puppet NICHT ist:** kein Audio, kein Phonem→Viseme-Alignment, kein Video-Export, kein
Timeline-Generator. Das ist das separate „Cube Puppet Studio", das diesen Vertrag *konsumiert*.

### 16.1 Die fünf Viseme (PetMouth, seit v4 §2a)

Fünf benannte Sprech-Formen, keine fünfzig — Ohren, Squash und Blick tragen den Rest der Rede.
Es sind **umschaltbare Zustände der bestehenden 13 Decals**, kein zweiter Mund:

| Visem | Standard-Decal | Rolle |
|---|---|---|
| `closed` | `m` | Lippen zu (M/B/P) — der Closer |
| `open` | `ah` | Kiefer auf (A/I) — der Träger |
| `wide` | `ee` | quer gezogen (E) — Betonung |
| `round` | `oh` | gerundet (O/U) — Frage/Staunen. `woo` = engeres, gespitztes Rund (Rufe, Gesang) |
| `smile` | `smile` | Ruhe-Freude, kein Sprechlaut |

```js
pet.mouth.setViseme('open', { pop: true });   // -> benutzter Decal-Key
pet.mouth.setVisemeMap({ round: 'woo' });     // Teil-Map; laufendes Visem zieht mit
pet.mouth.viseme                              // aktuelles Visem oder null
```

Die Zuordnung ist eine **Look-Entscheidung** und lebt im Vertrag unter `pets[].mouth.visemeMap` —
nie im Treiber-Code hart verdrahtet.

**Wenn das aktive Set eine Form nicht hat**, springt der Fallback ein (§6.1) und `setViseme` meldet
das als `console.info`, nicht als Fehler. Beispiel `red`: `smile → neutral`, und das Lächeln trägt
der Mundwinkel (`bend +0.35`). Die **vier Sprech**-Viseme sitzen in allen drei Sets auf echten
Dateien — Sprechen ist immer vollständig, nur die Ruhe-Freude kann ersetzt werden.

### 16.2 Die sechs Methoden

```js
import { createPuppet } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/build/pet-puppet.v1.js';

const puppet = createPuppet({
  THREE, mouth: pet.mouth, rig: pet.rig, face: pet.face,
  cam, controls, scene, renderer,
  focus:  () => faceWorldPoint,      // Kamera-Ziel (Gesichtshöhe)
  radius: () => petRadius,           // halbe größte Bau-Kante
  facing: () => faceNormal,          // Blickrichtung, GEMESSEN (Normale der Mundfläche)
  emote:  (hostName) => pet.face.set(hostName),   // nur nötig, wenn kein pet.face vorhanden
  clip:   (name) => pet.play(name),
  background: (mode) => myBackground(mode),        // optional; sonst macht der Puppet es selbst
});
```

| Methode | Wirkung | Eigentümer darunter |
|---|---|---|
| `setViseme(id, {pop, rest})` | eines der fünf Viseme | `PetMouth` |
| `setExpression(name)` | `idle · smile · sad · happy · thinking · confused` → Library-Emote | `PetFace`/EyeRig |
| `playState(name)` | `idle · blink · lookL · lookR · talking` | Rig (Blink/Blick), Mouth (talking), Host (Clip) |
| `speak(timeline, opts)` | fährt die Viseme-Sequenz + meldet Betonungen | Puppet (die **Uhr**) |
| `setCamera(preset)` | `static · close · wide · orbit · zoom · presentation` | Puppet |
| `setBackground(mode)` | `transparent · studio · world` | Host, wenn er `background` mitgibt |

Dazu drei Nicht-Vertrags-Teile: `puppet.update(dt)` (pro Frame, **nach** `pet.update(dt)`),
`puppet.onEmphasis(cb)` (die Naht zu „der ganze Körper spricht") und `puppet.stop()`.

**Namens-Zuordnung gehört dem Puppet.** Der Vertrag nennt sechs Ausdrücke, die Library kennt sechs
Emotes mit anderen Namen (`EXPRESSION_MAP`: idle→neutral, smile→happy, confused→surprised …).
Ein Treiber soll die Library-Namen nicht kennen müssen.

### 16.3 Das `timeline`-Format

```js
const timeline = [
  { t: 0.00, viseme: 'open',   emphasis: 1 },   // t = Sekunden ab Start
  { t: 0.16, viseme: 'closed' },
  { t: 0.84, viseme: 'open',   emphasis: 1 },
  { t: 1.28, viseme: 'round',  emphasis: 0.6 },
  { t: 1.46, viseme: 'smile' },
];
const run = puppet.speak(timeline, { rate: 1, tail: 0.18, onDone: (m) => console.log(m) });
run.progress   // 0..1     run.duration   // s     run.stop()
```

- `t` wird **sortiert**, doppelte Zeiten sind erlaubt, Einträge ohne `viseme` und ohne `emphasis`
  fallen weg.
- `emphasis`: `true` oder `0..1`. Feuert alle `onEmphasis`-Zuhörer mit `(stärke, t)`.
- **Die Uhr läuft über `update(dt)`, nicht über `setTimeout`** — ein Timer-Takt driftet bei
  Frame-Einbruch aus dem Bild.
- `speak()` endet **immer** im Ruhe-Mund (Prime Directive: löst sich in Ruhe auf) und liefert die
  Messwerte in `puppet.lastRun`: `{events, fired, emphasis, maxErrMs, duration}`.

Gemessen am Studio v4 (11 Ereignisse, 3 Betonungen, dt = 1/60): **11/11 gefeuert, größter Zeitfehler
17 ms** (= ein Frame, der Boden), Betonungen exakt auf den markierten Zeiten, Sequenz identisch zur
Timeline, danach Ruhe-Mund.

### 16.4 Kamera-Presets

`dist` ist ein **Vielfaches des Pet-Radius** (kein Weltmaß — ein Krebs ist 0,91 hoch, ein Hase 1,33),
`az` zählt **relativ zur Blickrichtung des Pets**, nicht zur Welt-Z-Achse.

| Preset | dist × Radius | Höhe ° | Seite ° | Verhalten |
|---|---|---|---|---|
| `static` | — | — | — | fasst die Kamera nicht an (der Nutzer hat die Maus) |
| `close` | 1,75 | 2 | +14 | fährt hin, **steht dann still** |
| `zoom` | 1,30 | 0 | +8 | dieselbe Nähe, langsam gefahren |
| `presentation` | 3,10 | 10 | +34 | Dreiviertel-Ansicht |
| `wide` | 5,20 | 8 | +22 | ganzer Pet + Umgebung |
| `orbit` | 3,40 | 8 | läuft | **das einzige Preset, das dauerhaft läuft** (9 °/s) |

Höhenwinkel bewusst flach (0–10°): ein Cube-Pet ist knapp über kniehoch, jeder größere Winkel schaut
ihm auf den Kopf statt ins Gesicht. Alle Fahrten sind kritisch gedämpft (kein Overshoot) und geben die
Kamera danach frei — gemessen: Zieldistanz auf ±0,002 × Radius erreicht, `close` in 114 Frames,
`presentation` in 144, danach kein Nachregeln mehr.

### 16.5 „Der ganze Körper spricht" — die Naht (noch offen)

```js
puppet.onEmphasis((k, t) => pet.motion.punctuate(k));   // <- kommt mit §2c
```

Betonungs-Marker werden **gemeldet**, nicht ausgeführt: der Körper gehört `PetMotion`. Body-Bounce,
Ohren, Karten-Wackeln und Kontaktschatten-Puls auf die Marker zu legen, ist der nächste Slice
(Pet Studio v4 §2c). Bis dahin ist `onEmphasis` ein funktionierender Kanal ohne Körper-Konsument.
