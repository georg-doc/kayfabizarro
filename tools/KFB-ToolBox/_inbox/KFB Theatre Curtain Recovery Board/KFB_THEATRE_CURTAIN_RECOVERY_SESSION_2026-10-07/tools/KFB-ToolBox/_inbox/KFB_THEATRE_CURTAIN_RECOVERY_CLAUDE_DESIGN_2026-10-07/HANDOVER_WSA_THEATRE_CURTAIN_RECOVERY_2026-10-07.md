# HANDOVER · WSA · KFB Theatre Curtain Recovery · Issue #372 · 2026-10-07

Von: Claude Design (BOUNDED_SLICE) · An: WSA (Check-in) · Status: **Georg PASS auf r3** · nichts gepusht.

## 1 · Was du tun sollst (genau das)
1. ZIP-Inhalt unter `tools/KFB-ToolBox/_inbox/KFB_THEATRE_CURTAIN_RECOVERY_CLAUDE_DESIGN_2026-10-07/` auf Branch `design/theatre-curtain-recovery-2026-10-07` (von `main`) committen. Pfade im ZIP entsprechen Repo-Pfaden.
2. Commit-SHA + Branch in Issue #372 zurückmelden, `RETURN.md` unverändert verlinken.
3. **Nicht:** mergen, live promoten, Open-World- oder PR-#348-Runtime anfassen, Donor-Ordner `KFB Theatre Curtain v2/` verändern.

## 2 · Was im Paket ist
| Pfad | Rolle |
|---|---|
| `candidate/kfb-curtain-core.js` | **das Modul** (three r0.186 WebGPU + TSL) |
| `candidate/kfb-curtain-host-demo.js` | Referenz-Host (Renderer, Licht, Actors, Loader-Fakten, Input) |
| `candidate/standalone.html` | lauffähige Seite ohne Claude-Design-Runtime |
| `claude-design/*.dc.html` + `support.js` | Viewer + Evidence-Board aus Claude Design (Quelle; erwartet Projekt-Root als Basis) |
| `donor/`, `donor-probe.html` | unveränderter Donor + Isolations-Probe |
| `reference/old-theatre-reference.webp` | Benchmark (blob 06888782), kein Template, Wasserzeichen-Stockfoto |
| `screenshots/` | 39 Evidence-Frames |
| `SOURCE_AUDIT.md` · `FAIL_ANALYSIS.md` · `KEEP_TUNE_REJECT.md` · `MATERIAL_LOOK_STUDY.md` · `CURTAIN_MODULE_CONTRACT.md` · `IMPLEMENTATION_HANDOFF.md` · `RETURN.md` · `CHANGELOG.md` | Doku |

## 3 · Lokal prüfen (optional, 2 Min)
`candidate/standalone.html` über einen lokalen Static-Server öffnen (Chrome/Edge mit WebGPU). Erwartung: geschlossener Vorhang, nach dem Laden "Enter"; Enter → Vorhang rafft zur Seite, federt kurz, FrizzleBob steht auf der Bühne. Buttons: loading / select / reveal / cover / impact / ‹ ›.
Bisher nur in der Claude-Design-Vorschau geprüft, **nicht** in einem normalen sichtbaren Browser-Tab → bitte einmal bestätigen.

## 4 · Harte Regeln für spätere Runtime-Arbeit
- Curtain Core besitzt nur Vorhang-Präsentation. Renderer, Kamera, Welt, Loading, Audio, Save bleiben beim Host.
- Öffnet nur, wenn der Host `revealAllowed` setzt. Kein Fake-Prozent irgendwo.
- `update(renderer, dt)` vom Host-Takt treiben; nicht `THREE.Timer` mit Page-Visibility.
- Compute-Stage nutzt genau 8 Storage-Buffer (WebGPU-Default). Neue Per-Vertex-Daten in bestehende Buffer packen.
- Keine Textur auf bewegtem Stoff (Ursache des alten Streifen-Artefakts). Patina nur in `clothUV`.
- Kein Plaque/Schild/Wordmark als Identitätsträger.

## 5 · Offen (nicht für diesen Check-in)
Tieback (quarantäniert) · Ring-Rail-Lesbarkeit · Impact-Kante · Idle-Clip-Binding (FrizzleBob v5b, Rig_Large) · WebGL-Fallback-Entscheidung · FrizzleBob SOURCE_PIN_RECONCILE (23615cff vs 93abbf22) · Performance auf Low-End/Mobile.

## 6 · Nächste Iteration (separater Slice, neues Briefing von Georg)
Claymation-/Cartoon-Look mit Holz-Puppentheater-Bühne. Laut Georg Material und Architektur; Cloth-Kernel, `MOTION` und Zustandsmaschine bleiben. Briefing braucht Referenzbilder für Holzart, Schnitzstil, Clay-Look.
