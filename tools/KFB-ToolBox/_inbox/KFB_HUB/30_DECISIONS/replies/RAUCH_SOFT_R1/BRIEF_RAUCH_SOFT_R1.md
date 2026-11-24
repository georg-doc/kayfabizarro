# Brief · Rauch weich ausblenden (Soft Particles) R1 (WS0, 24.11.2026)

**ABSICHT:** Rauch und Dampf wirken wie Wolken im Raum, nicht wie Scheiben: Wo eine Rauchwolke einen Körper oder den Boden berührt, blendet sie weich aus, statt hart abzuschneiden oder davor zu stehen. Das gilt für Lok-Dampf (Weihnachts-Scenelet), Jetpack-Düsenrauch und alle Staub-/Puff-Wolken aus demselben Modul.

**GENRE:** Cartoon-Action-Abenteuer, Claymation-Vordergrund (V-1171).

**OWNER:** ein Agent im Auftrag von WS0, Arbeitskopie `~/kfb-ws0/mount-wt`, neuer Zweig `ws0/rauch-soft-r1` ab Stamm `game/integration-r2` (aktueller Kopf). Merge macht WS0.

**ZIEL:**
1. Im Puff-Material von `src/modules/dustTrail.js` (`createDustPuffView`, `depthTest: true`, `depthWrite: false`) weiches Ausblenden an der Szenentiefe (Soft Particles): Alpha fällt mit dem Abstand zwischen Puff-Fragment und dahinterliegender Szenentiefe auf null (Übergangslänge als Parameter, Standard aus dem Puff-Radius abgeleitet).
2. Tiefe aus dem vorhandenen Renderweg holen (vorhandene Tiefentextur, wo es eine gibt; sonst eine leichte Tiefen-Vorstufe nur, wenn Rauch sichtbar ist). Kein zweiter Renderer, kein Umbau der Feuer-/HDR-Naht.
3. Ohne Tiefe (z. B. im Aqua-Artefakt oder wenn die Vorstufe aus ist) verhält sich das Material exakt wie heute.
4. Schalter `rauchweich=r1` in `src/flags.js` (owner WS0, status pruefen); ohne Schalter bytegleiches Verhalten.

**FERTIG:**
1. Vorher/Nachher-Stills mit festem `belegVideo`-Preset (seite, dreiviertel) für: Weihnachts-Bahn abends (Dampf vor Schneemann/Sessel), Jetpack-Start, ein Fahrzeug-Staub; im Spiel-Look, `KFB_SPLIT=1 --base=./`, Ablage `replies/RAUCH_SOFT_R1/_privat/belege_r<n>/`.
2. Messung: kein harter Schnitt an Körperkanten (Kantenprüfung im Still), Bildzeit höchstens +1 ms mit Schalter.
3. Stille Blind-Kritik auf den Vorher/Nachher-Paaren (Absicht oben), ≤ 3 Runden.
4. CI wie Stamm, Rauchtest, `npx vite build` grün; Zweig pushen, nicht mergen. Rückgabe als neue Datei RETURN_R1 (Markdown) im Ordner dieses Briefs.

**GRENZEN:** Nur das Puff-Material und die Tiefenbereitstellung; keine neuen Rauch-Systeme, keine Farb-/Mengenänderung bestehender Sätze. `src/private/` nie committen; kein `npm ci`; GPU-Lock; eigene Server mit `srv.stop()`; `df -h ~` vor Builds. Keine Rückfragen-Schleifen.

**DETAIL:** `src/modules/dustTrail.js` (createDustPuffView, createThrustSmoke Z. ~315), Nutzer: Jetpack, Weihnachts-Bahn (`src/world/weihnacht/`, `rauch`-Hook in M1World), Fahrzeug-Staub. Bericht Weihnachten R6 (`replies/WEIHNACHT_R1/RETURN_R1.md`): Ursache „kameragerichtete Puff-Scheiben schneiden Körper hart“. Register V-2143.
