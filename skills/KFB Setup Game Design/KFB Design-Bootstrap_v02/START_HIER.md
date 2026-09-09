# START HIER · KFB Design-Workspace

**Wenn du ein frischer Chat bist, ist das deine erste Datei.** Sie ist absichtlich kurz und bleibt es
(Obergrenze 250 Zeilen). Alles Umfangreiche wird **verwiesen, nicht kopiert**.

Es gibt drei Blätter, jedes mit einer Aufgabe:

| Blatt | Frage, die es beantwortet |
|---|---|
| **`START_HIER.md`** (dieses) | Wie hier gearbeitet wird. Welche Regeln gelten. |
| **`PROJEKTE.md`** | Welche Linien es gibt, welche lebt, wo ihr Code liegt. |
| **`MODULE.md`** | Was schon existiert und wiederverwendet werden kann, statt neu gebaut. |

Dazu die Chronik: **`HOUSEKEEPING.md`** — über 3000 Zeilen, jede Sitzung seit Juli. **Nicht am Anfang
lesen.** Sie ist ein Nachschlagewerk: erst wenn eine konkrete Frage da ist, wird die passende Stelle
gesucht. Ein frischer Chat, der sie von vorn liest, verbrennt sein Fenster, bevor er etwas gebaut hat.

---

## 1 · Die eine Regel, aus der alle anderen folgen

> **Wiederverwenden statt neu erfinden.** Wenn etwas funktioniert, wird es **kopiert oder importiert**
> — nicht nachgebaut, nicht nachgerechnet, nicht „sauberer" neu geschrieben.

Der Grund steht im Gründungsdokument und ist teuer bezahlt: es gab über zwölf Artefakte, jedes ein
sauberer Einzelbeweis, und **keines ließ sich mit einem anderen zusammenbauen** — weil jedes seine
eigenen Annahmen mitbrachte: eigenes three-Laden, eigene Bedienleiste, eigener Zustand, eigene
Zeitbasis, eigener Zufall, eigene Quellenkette. Sie wurden nebeneinander gebaut, nicht gegeneinander.

**Der Umfang war nie das Problem. Die Struktur war es.**

Praktisch heißt das drei Dinge:

1. **Vor dem Bauen in `MODULE.md` nachsehen.** Existiert das Teil schon, wird es eingebaut. Existiert
   es fast, wird es parametrisiert — keine zweite Fassung.
2. **Eine Zahl, die schon gemessen wurde, wird nicht neu geschätzt.** Sie steht im Changelog der Linie
   oder im living document. Nachsehen ist billiger als messen, messen ist billiger als raten.
3. **Wenn du dabei bist, etwas zum zweiten Mal zu schreiben, halte an und sage es.** Das ist immer ein
   Fund, nie eine Kleinigkeit.

---

## 2 · Der Wirt-Vertrag

Das Projekt ist nicht ein Ordner mit Dateien, sondern die **gemeinsame Grundlage, gegen die alles
gebaut wird**. Ein Modul, das sich seine Umgebung selbst besorgt, ist nicht wiederverwendbar.

**Kein Modul** lädt three selbst · setzt den Farbraum selbst · baut eine eigene Zeitbasis · zieht
eigenen Zufall ohne Seed · baut eine eigene Quellenkette für Assets · schreibt eine eigene
Bedienleiste.

**Der Wirt liefert, das Modul meldet an.** Ein Modul bekommt seine Abhängigkeiten herein
(`{ THREE, stage, audio, seed, … }`) und gibt einen Handgriff zurück (`{ update, dispose, params, … }`).
Wer diesen Vertrag bricht, baut wieder einen Einzelbeweis.

**Panel-Tor:** jedes neue Verhalten kommt mit einem Schalter im Bedienfeld und ist standardmäßig so
gesetzt, wie es abgenommen wurde. Ton ist **immer** standardmäßig aus, mit Einschaltgeste am Wirt.

---

## 3 · Wie du mir einen Wiederverwendungs-Auftrag gibst

Das ist der häufigste Auftrag hier, also hat er eine Form. Beispiel, wörtlich brauchbar:

> „Nimm das Pet-Select-Wheel vom Start-Screen aus Rollercoaster v11. Bau es 1:1 als Modul in das neue
> Projekt XY ein. Danach full-codebase session-export mit living document."

**Was ich daraus mache, in dieser Reihenfolge:**

1. **Das Original finden und lesen** — nicht meine Erinnerung daran. Bei diesem Beispiel:
   `build/rollercoaster-v10/pet-select.v7.js`, eingebunden über die Importmap in
   `Rollercoaster Ride v11.dc.html` als `rc-pet-select`.
2. **Den Vertrag ablesen:** was exportiert es, was braucht es, was gibt es zurück. Hier:
   `export class PetSelect(stage, opts)`, ruft `onSelect(petId)`, hängt an `pet-library.v6`,
   `pet-motion.v1`, `pet-eye-rig.v3` und lädt Podest und Himmel per RAW-URL.
3. **Die Lücke benennen, bevor ich baue.** Meist fehlt im Ziel eine Abhängigkeit oder eine
   Wirt-Leistung. Das sage ich dir, statt es stillschweigend nachzubauen.
4. **1:1 einbauen heißt 1:1.** Getunte Zahlen werden nicht „verbessert". Wenn im Ziel etwas anders
   sein muss, wird es ein **Parameter beim Aufruf**, keine zweite Fassung der Datei.
5. **Öffnen und hinsehen**, dann liefern.

**Was „1:1" ausdrücklich nicht heißt:** dieselbe Datei zweimal im Projekt. Wenn zwei Linien dasselbe
Modul brauchen, bekommt es **einen** Ort (`build/module/` ist dafür da) und beide importieren daraus.

---

## 4 · Was als Beweis zählt

- **Zahlen statt Adjektive.** „Wirkt zu klein" wird zu einer Messung, bevor daran geschraubt wird.
- **Eine Probe, die sich verweigert, hat ihre Arbeit getan** — sie hatte zu wenig Daten. Eine Probe,
  die im Hintergrundfenster läuft, misst nichts: `requestAnimationFrame` liefert dort null Frames.
- **Ein Bündel gilt erst als gebaut, wenn es geöffnet wurde.** Bei Bündeln versagen Dinge lautlos.
- **Sichtbares kann nur Georg abnehmen.** Bewegung, Timing, Maßstab, Trefferreaktion: dafür gibt es
  keine Messung, die das Urteil ersetzt. Solche Punkte werden **vorgelegt, nicht entschieden**.
- **Jede Änderung wird eine Naht:** Nummer, Datum, Versionsmarker im Quelltext. Sonst ist sie in zwei
  Wochen nicht auffindbar.

---

## 5 · Session-Export

Ein Export ist kein Zip vom ganzen Projekt (das Projekt hat 168 Dateien und mehrere Megabyte Medien).
Er ist ein **Manifest mit Veto-Fenster**:

1. **Manifest** — Deliverables, Contract/Daten, Docs, Abnahme-Captures. Was rein soll, was nicht.
2. **Dein Veto oder Okay.**
3. **Bauen** — Codebasis der Linie, Doku, living document, und wenn gewünscht der Standalone.

**Standalone:** eine Datei, alles Schwere per RAW-URL aus `georg-doc/kayfabizarro`. Das ist ein
Build-Schritt, kein Kopiervorgang — das Verfahren, die vier Regeln und die Fallen stehen in
`docs/travel-v25/IST_v25.md` §5b und `docs/travel-v25/POSTMORTEM_standalone.md`. **Vor dem ersten
Anlauf gelesen**, sonst kostet es eine Runde.

---

## 6 · Skills — verwiesen, nicht kopiert

Sie liegen in `georg-doc/kayfabizarro` unter `skills/` und werden **dort** gepflegt. Ins Projekt
gehört der Verweis, nie die Kopie: eine Kopie veraltet still.

| Skill | Wofür |
|---|---|
| `session-design-briefing.md` | **Die Dachvorlage.** Wie geredet und in welcher Reihenfolge gearbeitet wird, und was als Beweis zählt. Lädt die übrigen nach Bedarf. |
| `session-entry-use-what-works_v1.md` | **Anti-Regression.** Sieben Regeln, jede durch einen Fehler bezahlt. Das ist §1 dieses Blattes in Langform. |
| `living-document_v1.md` | Form der living documents: Übergabe zuerst, Entscheidungen mit Kennung, Post Mortems mit Regel, Register zuletzt. |
| `session_modulvertrag.md` | Der Modulvertrag in Langform — §2 dieses Blattes. |
| `kfb-cartoon-animation_v2.md` · `cartoon-motion_v1.md` | Bewegungsvokabular, Cartoon-Timing. |
| `design-3d_v1.md` · `design-3d_3d-reference_v1.md` | three.js im Browser: Kamera, Licht, Material, Laden. |
| `kfb-embed-bundle v3/` | Karten-Einbettung. Einstieg ist `createCardBuilder`, Geschwister vom selben Basis-URL. |
| `EMBED_CUBE_PET_FULL_v2.2.md` | Cube-Pets samt Augen-Rig und `narratorPromptRef`. |
| `kfb-ink-canon.js` | **Die Kanon-Feder. Importieren, nie nachbauen.** |
| `SOT_REGISTRY.md` | Quelle der Wahrheit für den Kanon. |
| `session-export_v1.md` · `workspace-sync_v1.md` | Export- und Sync-Verfahren. |

**Vorbedingung, von Georg gesetzt:** diese Skills und Embeds, vor allem die Pets, werden geprüft und
aktualisiert, **bevor** ein Projekt darauf aufsetzt. Ein Vertrag auf veralteten Bausteinen ist keiner.

---

## 7 · Assets

`kfb-asset-library.json` — **11 859 Einträge** (Stand 10.09.2026, aus der Fassung, die Georg an diesem
Tag angehängt hat): 6170 Bilder, 4006 Modelle, 1683 Töne, 485 als Textur markiert. Je Eintrag `path`,
`kind`, `folder`, `texture` und eine **fertige `url`**.

**Der Wert liegt im `url`-Feld:** jeder Eintrag ist ohne Zutun ladbar. Ordner abtasten ist damit
unnötig — und war vorher eine wiederkehrende Handarbeit.

| Regel | |
|---|---|
| **Schweres nie ins Projekt** | GLBs, Skydomes, Texturen, Töne, Kartenblätter, Decks laufen **per RAW-URL**. |
| **Lokal nur, was kein Repo-Gegenstück hat** | z. B. `globe-v13/rift.png` (aus tinyskies). Diese Fälle gehören benannt, sonst brechen sie still im Standalone. |
| **Was fehlt** | **Lizenz und Quelle je Paket.** Ohne die ist die Bibliothek ein Verzeichnis und kein Manifest. Vier harte Böden: keine Lizenz heißt Vollschutz · nicht kommerziell · Copyleft · Raster nicht restlos teilbar. |

Delta der Fassung vom 10.09. gegenüber der vorigen: **+1350 Einträge**, vor allem
`FlowerPower_PNG` (454), `Audio` (223), `kenney_toy-car-kit` (169), `FX_Visual` (127),
`kenney_racing-kit` (114), `kenney_splat-pack` (110), `kenney_city-kit-roads` (100), `kenney_car-kit` (52).
Die Fahrzeug-Kits sind neu und decken das Stunt-Car-Racing-Briefing ab.

---

## 8 · Gründungsdokumente

Im angehängten Ordner `KFB Setup Game Design/` und gespiegelt im Repo unter
`skills/KFB Setup Game Design/`:

| Datei | Rolle |
|---|---|
| `GRUENDUNGSDOKUMENT_KFB_Design_Projekt.md` | **Die Diagnose und der Vertrag.** Warum Struktur vor Umfang geht. Quelle für §1 und §2 hier. |
| `HANDOVER_Cowork_Projektgruendung.md` | Übergabe der Projektgründung. |
| `KFB_Prompt_Lab.md` | Prompt-Werkstatt. |
| `KFB_Frankensteining_Lab (1).html` | **Über 70 Setzungen und ein Dutzend Post Mortems.** Nicht Lektüre, sondern Vertragsbestandteil: dort stehen die Zahlen, die sonst neu gemessen würden. |
| `HANDOVER_Workspace_A_KFB_Stunt_Car_Racing_Living_v1_1.md` | Stunt-Car-Racing, living. |
| `Briefings/Stunt-Playground-Design-v1/` | Briefing-Ordner. |

---

## 9 · Sprache und Form

Keine Bindestriche als Satzzeichen, echte Umlaute, Kausalität über „also" und „aber". Kurz, direkt,
ohne Füllwerk. **Ein Befund wird benannt, auch wenn er unbequem ist** — besonders dann. Ein Weg, der
nicht trägt, wird gesagt, bevor er begonnen wird.
