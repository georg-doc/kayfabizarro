# Onboarding · FB-Driver-Graft als Default-Charakter in KFB Animation Lab v2
*Geschrieben im FrankenStein-Studio-Projekt, 13.09.2026 spät — für einen frischen Chat GENAU HIER
im Projekt. Georgs Auftrag, wörtlich: »NICHT der driver (org), sondern FB driver graft aus studio
v17 auch als default in lab v2!«*

## Was das ist, in einem Satz
`KFB Animation Lab v2.dc.html` zeigt heute die ROHE `Driver.glb` (KayKit-Körper, Kenney-Kopf) als
Default-Charakter. Georg will die GEGRAFTETE Figur sehen — KayKit-Körper mit FrizzleBobs Kopf,
Ohren und Gesicht, wie sie in `KFB FrankenStein Studio v17.dc.html` als Pet `graft-driver` steht.

## Warum das kein Default-Wert-Tausch ist
Animation Labs Roster (`lab/assets.js`, `CHARACTERS`) lädt ROHE Spender-GLBs per URL — `ms4_driver`
ist `Driver.glb`, unverändert. Der Graft entsteht NICHT aus einer Datei, sondern aus Code:
`frizzlegraft-v1/graft-biped.v1.js` (Klasse `GraftBiped extends FrizzleBob`) lädt den Wirtskörper,
misst den Kopf-Host (`facehost.v1.js`), graftet FrizzleBobs Kopf darauf (`headgraft.v1.js`), baut
Ohren (`ears.v2.js`) und das Gesicht (EyeRig/BrowRig/NoseRig/Moustache/PetMouth — dieselben Module,
die Studio und die Rigging-Werkbank benutzen). Animation Lab v2 müsste also **dieselbe Komposition
bauen**, nicht nur eine andere `path`-Angabe im Roster eintragen.

## Was schon da ist, und wo (nichts davon neu bauen)
- **`frizzlegraft-v1/graft-biped.v1.js`** — `GraftBiped`, `static describe()` meldet
  `capabilities: ['three@0.160', 'assets', 'clock', 'rng']` — gebaut für GENAU dieses Muster
  (ein Host reicht Fähigkeiten rein, das Modul liefert die Figur). `HOSTS.driver.path` zeigt auf
  dieselbe `Driver.glb`, die Animation Lab schon lädt.
- **`frizzlegraft-v1/facehost.v1.js`** — mißt den Kopfknochen, hängt den Face-Host als KIND des
  Knochens ein (`head.add(inner)`). Das ist der Beleg für Auftrag 2 (bereits erledigt, siehe
  `LIVING_frizzlegraft.md`): der Host folgt jeder Animation automatisch, weil er strukturell am
  Knochen hängt — keine Sonderbehandlung pro Clip nötig.
- **`frizzlegraft-v1/headgraft.v1.js`**, **`frizzlegraft-v1/ears.v2.js`** — Kopf- und Ohren-Geometrie,
  aus `petstudio-v9/assets/models/FrizzleBob_Yellow.gltf` geschnitten.
- **`petstudio-v9/studio-v12/frizzlebob.v4a.js`** — `FrizzleBob`, die Basisklasse; `GraftBiped` erbt
  von ihr und tauscht den Körper.
- **Studios eigener Bauweg**: `KFB FrankenStein Studio v17.dc.html`, Methode `_loadBiped(p)` (suche
  danach) — zeigt die GENAUE Aufrufreihenfolge (Renderer/Scene reinreichen, `GraftBiped` bauen,
  Gesicht montieren, Waffe/Zonen/Pose nachziehen). Das ist die Vorlage, 1:1 zitierbar.
- **Der Vertrag**: `pets[0]` in `petstudio-v9/kfb-pet-graft-driver-default.json` (kfb.pets/1,
  petVersion 7 nach Georgs letztem Anhang) trägt `variant:'driver'`, `graft.zones`, `graft.weapon`,
  `brow.mod:'carl-original'`, `pose.preset:'stand'`, **und schon `anim:{rig:'Medium',mode:'chain',
  clipMap:{},params:{}}`** — der `anim`-Block aus Auftrag 2 dieser Sitzung ist bereits drin.

## Der Bauplan (Reihenfolge, nicht optional)
1. **Messen, nicht raten.** `_loadBiped(p)` in Studio v17 lesen, Zeile für Zeile — welche Module in
   welcher Reihenfolge, welche Renderer-/Scene-Referenzen `GraftBiped` erwartet.
2. **Animation Lab v2 bekommt einen neuen Charakter-Typ**, nicht nur einen neuen Eintrag in
   `CHARACTERS`. Ein `kind:'graft'`-Zweig neben dem bestehenden `loadChar(id)` (roher GLB-Lader) —
   analog zu Studios `kind==='biped'`-Verzweigung in `loadPet()`.
3. **Derselbe Vertrag, keine zweite Kalibrierung.** Der Graft-Charakter in Animation Lab v2 liest
   `petstudio-v9/kfb-pet-graft-driver-default.json` (oder, sauberer: dieselbe Sitzung
   `kfb-pet-studio-v5` über `pet-session.v1.js`, das v2 schon lädt — der `anim`-Sync-Reiter
   funktioniert dann für DIESEN Charakter ohne Umweg über eine Datei).
4. **Die Animations-Packs bleiben, wie sie sind** (`Rig_Medium_*.glb` — der Graft benutzt Rig
   Medium, gemessen). Was neu ist: der Mixer spielt jetzt auf einem KOMPONIERTEN `figure`
   (Körper + Kopf + Ohren als EIN Objekt3D), nicht auf der rohen `Driver.glb`-Szene direkt.
5. **Kontrollprobe, Georgs eigener Prüfstein**: mit `xrig`/`Batch` ein paar Clips aus verschiedenen
   Familien (Idle, Walk, Run, Jump, mindestens eine Combat- und eine Simulation-Clip) durchlaufen
   und optisch bestätigen, daß Kopf/Ohren an jedem Bild sauber am Hals sitzen — das ist die
   VISUELLE Bestätigung zu Auftrag 2 (strukturell schon begründet, hier zeigt sie sich am Bild).

## Bezahlte Fallen aus dieser Sitzung, die hier wieder zuschlagen können
- **`_abs()`/Modul-Anker-Pfade**: in Studio ist `_abs()` schon auf `petstudio-v9/` verankert
  (`window.__KFB_MODBASE`) — ein Pfad wie `./petstudio-v9/…` von DORT aus verdoppelt sich und läuft
  STILL ins Leere (kein Fehler, `grab()`/`fetch` gibt einfach `null`/404 zurück). Animation Lab v2
  hat KEINEN `__KFB_MODBASE` — dort ist `loadModule(name, rel)` relativ zur eigenen Datei (Projekt-
  wurzel). Jeden neuen Importpfad EINMAL isoliert testen (`await import(...)` in der Konsole),
  bevor er in Code landet, der den Fehler schluckt.
- **Zwei `const ses = this._ses()`/localStorage-Schlüssel** können sich überschreiben, wenn sie in
  zwei Code-Pfaden denselben Namen tragen (passiert in dieser Sitzung zwischen der allgemeinen
  UI-Ablage und der Contract-Petid-Ablage in v2 — siehe `LIVING_frizzlegraft.md`).
- **Ein Default-Seed, der nur `this.lib.pets`/`this.roster` beschreibt, überlebt keinen Neustart** —
  er muß auch `_SES.putDraft(ses, pet)` in die Sitzung schreiben, sonst baut `boot()` beim nächsten
  Laden wieder aus Repo+Sitzung, ohne die im Arbeitsspeicher gesetzten Werte.

## Wo was liegt
`frizzlegraft-v1/graft-biped.v1.js` · `facehost.v1.js` · `headgraft.v1.js` · `ears.v2.js` (die
Graft-Bausteine) · `KFB FrankenStein Studio v17.dc.html` Methode `_loadBiped` (die Vorlage) ·
`KFB Animation Lab v2.dc.html` (der Umbau-Ort) · `petstudio-v9/kfb-pet-graft-driver-default.json`
(der Vertrag) · `LIVING_frizzlegraft.md` (der volle Verlauf dieser Sitzung, additiv, neueste Zeile
oben).
