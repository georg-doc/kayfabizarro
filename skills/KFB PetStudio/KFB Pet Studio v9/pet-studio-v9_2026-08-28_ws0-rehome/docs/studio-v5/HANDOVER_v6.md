# Übergabe an v6 — was diese Nacht über die Pets gelernt hat

**25.08.2026, WS1.** Gebaut wurde an `KFB Pet Studio v5.dc.html` (Fork von v4; **v4 ist eingefroren**
als Vergleichsmaßstab, nicht wegwerfen).

Wer ohne Vorwissen weiterarbeitet: dieses Blatt, dann `SLICE_v5_2026-08-25.md` (§0 der Befund, §5 die
Hausregeln), dann `SOP_kfb_ink_v1.md` **bevor** irgendeine Linie angefasst wird.

---

## 1 Die eine Regel, die alles andere trägt

> **Eine Zahl hat einen Eigentümer. Alle anderen ADDIEREN.**

Sie hat in dieser Sitzung **vier** Fehler erklärt, die wie vier verschiedene Fehler aussahen:

| Symptom | Wer schrieb absolut |
|---|---|
| Kopfneigung sprang zurück | die Schlaf-Animation setzte `rotation.x` |
| Pupillen stehen im Podcast still (0,0026 rad statt 0,699) | irgendwer schreibt nach dem EyeRig |
| Pet hängt/steht je Tier verschieden | der Ruhe-Clip hebt den Körper nach dem Fußanker |
| Autogrow lief beim ersten Öffnen nicht | das Wachsen saß in der *Hülle* von `loadPreset`, nicht darin |

Der vierte ist die Verhaltens-Variante derselben Regel: **eine Wirkung gehört in die Funktion, die
den Zustand ändert.** Wenn ein verzögerter Nachruf die innere Funktion aufruft, wird jede Wirkung in
der Hülle übersprungen.

---

## 2 Fünf Fallen, die es ohne Vorwissen zu treten gibt

**1 · Eine höhere Versionsnummer ist kein Beweis für mehr Inhalt.**
`kfb-pets.json` v1.2.6 war höher **und** ärmer: `pig`/`beaver`/`bee` ohne Mund-Block (40 → 14 bzw.
37 → 14 Blattfelder). Deshalb steht `leafCounts` in jedem Export — die Gegenprobe liegt über den
**Feldern**, nicht über der Datei.

**2 · Ein Export mit Filter ist ein Datenverlust mit Extraschritten.**
v4 baute aus `this.contract` plus nur den *berührten* Pets, und der Haken feuerte nur auf zwei Tabs.
v5 hat keinen Filter und prüft vor dem Schreiben, ob ein Pet ärmer herauskäme.

**3 · `stroke()` ist keine KFB-Tusche.**
Ein Canvas- oder SVG-Rand hat ringsum dieselbe Breite. Der Kanon moduliert über die **Lage**:
Licht oben links, Linie unten und rechts satter. Georg dazu wörtlich: *»das ist deadline, nicht KFB
ink«*. Es gibt jetzt genau eine Funktion, die das kann: `paintBubble()`.

**4 · Der Standardzustand ist ein Prüffall.**
Der Bubbles-Tab startete mit Feder 4,6 px und Rahmen 563 px für einen 22-px-Satz — also mit den zwei
Fehlern, die zweimal gemeldet worden waren. Jeder Klick auf eine Stimme reparierte es sofort und
verdeckte es damit. Wer nur prüft, was er angeklickt hat, prüft nie, was der Nutzer zuerst sieht.

**5 · Der sichtbarere Zeichner ist nicht der, an dem man arbeitet.**
Die Blase im Voice-Tab ist ein **Overlay über der Bühne** — sie steht in *allen* Tabs. Zwei
Zeichner heißt zwei Federn, und man sieht es überall, nicht nur dort, wo man sie eingestellt hat.

---

## 3 Was offen ist, in Reihenfolge

**1 · v1.2.7 ins Repo** (`media/3D_Assets/kfb-pets.json`). Ohne das holt der nächste Fork die
ausgedünnten Pets zurück. Gegenprobe: im Raw-Link muss `"version": "1.2.7"` stehen.

**2 · Der Skalierungs-Fix in `studio-v3/pet-library.v6.js`** (Wurzel vor dem Messen auf 1, gecachtes
GLB). Geteiltes Modul, seit dem 24.8. offen.

**3 · Eine Fassung von `pet-mouth.v1.js`.** Es gibt drei; nur die in `studio-v3/` kennt
`MOUTH_SETS.red`. Genau die Naht, gegen die `voice.bubble.pts` gebaut ist: ein Name ist eine Bitte,
Punkte sind eine Ansage.

**4 · Die Denkblase auf `paintBubble` heben.** Sie zeichnet noch als SVG-Pfad, weil ihre Wolkenform
keine Anfasser hat. Erst Anker für die Lappen, dann fällt der letzte SVG-Zeichner weg.

**4b · Flüstern feinjustieren** (Georg 25.8.): der Schnitt läuft stur am Bogenmaß, also kann eine
Lücke die **Zipfelspitze** treffen — dann zeigt die Blase auf nichts. Schutzzone um Zipfel und Ecken,
Schnitt verschieben statt weglassen. Steht als F21 im SOP.

**5 · SOP §4 ins Repo nachziehen** — `SSOT_Card_Ink_Outline_v2.md` braucht ein §11 für Kleinformate
(die 40-px-Grenze, unter der das Band die Form zudeckt), `kfb-embed-bundle v3` die fünf Regeln und
die Vertragsblöcke `voice.bubble` / `voice.typing` / `voice.focus`.

**6 · Würfel-GLB abnehmen** und als Asset ins Repo, damit Kollision und Aussehen aus einer Quelle
kommen. Danach ist der **Frankensteining Builder** (Würfel + Augen-Rig + Mund, kein Tier darunter)
laut Georg »ein kleiner Schritt«.

**7 · »Full enchilada«-Pets für Podcast v4:** 2–6 Archetypen mit gefülltem `behavior`-Block.

**8 · Der leere `SCRIPT`-Fehler in der Konsole.** Kommt aus dem Dateikopf (Importmap plus
Inline-Modul, beide ohne `src`), unverändert aus v4 geerbt. Nichts lädt fehl, aber er feuert bei
jedem Laden.

---

## 4 Was der Vertrag jetzt trägt

```
pet.body      cubeH · radius · totalH · facePitch (gemessen) · faceTrim (entschieden)
              measured{by,at,bodyMesh,byName,span,spanWarn}
              hit{shape,r,h} · limits{squash,stretch,tiltMax,jumpMax,spinMax,bounce,hover}
pet.token     on · shape · size · fill · tint · ink · tilt      (das Podest, nicht der Boden)
pet.behavior  reactions{hit,praise,ignored} · triggers[] · actions[] · lull
pet.eye       anchor{dx,dy,ring,track} · pupilStyle · pupilSize · inset · lidFit · converge · lashes
pet.mouth     set · size · dy · dx · sx · tilt · rot · bend · lift · wrap · onTop · slope · visemeMap

voice.bubble  shape · aspect · pts[] · voice · pen · mergePx · bow/jit/step/seed · ink{…} · rule
voice.typing  shape · n · r · gap · lift · pen · pastel · amp · speed · stagger · bounce · showFor
voice.focus   mode: 'one'   — immer nur EINE Blase, wer nicht dran ist zeigt Punkte
eyeRig        gazeFollow (Standard an) · blink · gloss
meta          contract · updated · source · label · count · ids · petVersions · leafCounts
```

**Die drei Zahlen des Körpers werden bewusst nicht zusammengelegt:** `cubeH` ist der **Maßstab**
(Grundform, ohne Ohren und Flügel), `radius` die **Trefferfläche** (Silhouette), `facePitch` die
**Blickachse**. Wer sie zusammenlegt, bekommt abgeschnittene Flügel *oder* ungleich platzierte
Figuren — im Podcast gemessen: −37 px bzw. 25 gegen 6 px.

**Und: der Boden gehört der Zone, nicht dem Pet.** Sechs Pets mit eigener Bodenplatte hätten sechs
Meinungen darüber, wo unten ist; beim ersten Zentimeter Unterschied flimmert es. Das Pet bringt sein
**Podest** mit (`token`) — das ist die Kachel, keine Bodenplatte.

---

## 5 Die Kachel ist die Maßeinheit

```
scale = tile.edge × fill / cubeH        Standard: Kante 2,0 · Füllung 60 %
```

Damit sind zwei Pets auf derselben Kachel gleich groß, egal welches Modell zuerst gemessen wurde —
und die Spielfläche (Flipper-Kachel, Kartenraster, Overworld-Feld) erbt dieselbe Zahl statt sie zu
erfinden. Gefüllt wird die Kachel von der **Grundform**, nicht von der Silhouette, sonst schrumpfen
die Flügel der Biene ihren Körper.

Die Zahlen sind so gewählt, dass sich am Bild nichts ändert: Hase 1,604 gegen die alten festen 1,6.
`token.fill` je Pet ist die Ausnahme für Sonderfälle (ein Boss füllt seine Kachel weiter).

---

## 6 Flug-Pets

Ohne eigene Ruhehöhe rechnet der Boden jede Schwebehöhe als **Sprung** — die Biene hätte für immer
einen blassen, aufgeblasenen Schatten und wäre nie gelandet. `body.limits.hover.h` ist der neue
Nullpunkt: dort ist der Stempel scharf, erst ein echtes Steigen darüber macht ihn weich.

Startwerte (am Bild abzunehmen, nicht geerbt): Biene 0,85 · Papagei 0,70 · Fisch 0,55.
