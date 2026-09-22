# Eingang und Quellenabgleich · 13.09.2026

**DECISION:** Georg: „Für Combat Arena adaptieren“. Der Eingang bleibt unverändert erhalten. Die Adaption gilt für das Arena-Repo; Race bleibt Studio-/Lab-Referenz.

**TESTED RESULT · Paketintegrität:** Alle 18 im Originalmanifest aufgeführten Dateien stimmen in Bytezahl und SHA256 überein. Das Manifest selbst wird zusätzlich in `PROVENANCE.json` gehasht. Das ist eine Transportprüfung, keine funktionale Abnahme.

Originaleingang: gemeinsamer Arena-Ordner, `_inbox/KFB_ASTRA_WEAPON_PLAYTEST_HANDOVER_2026-09-13/` und gleichnamiges ZIP. Unveränderte, ausgewählte Repo-Kopie: `_inbox/Georg/KFB_ASTRA_WEAPON_PLAYTEST_HANDOVER_2026-09-13/`. Die Original-Inbox wird nicht auf die öffentliche Website kopiert.

## Abgleich

| Eingang | Belastbarer Arena-Stand / Konsequenz |
|---|---|
| Stunt Race ist Implementation-SSOT | Für diese Adaption ausdrücklich `georg-doc/KFB-Combat-Arena`. Keine Race-Dateien verändern. |
| Driver-FB als Ausgangspunkt | Driver in Arena noch nicht integriert. C1 liefert den Graft; aktuelle Runtime ist vollständig vorhanden. |
| Waffenvertrag „vorhanden“ | Studio-v16-Auftrag nennt `weapon` ein neues Feld. Numerischer Export und Umsetzung sind nicht belegt. |
| Beispielprofil | Enthält Platzhalter; nicht in die Runtime laden oder mit erfundenen Zahlen vervollständigen. |
| Neues sauberes Game Mode | Vorhandene Arena erweitern; keine zweite Bewegung, Combat- oder Reward-Engine. |
| Lab-/Rig-Nachweise | Quellenberichte bleiben Lab-Nachweise; kein Arena-PASS für 139 Clips, Graft, Boden oder Waffenpose. |
| Parallele Sprints / IMPLEMENT NOW | Vorbereitete Aufträge, keine automatisch gestartete Implementierung. |

## Tatsächlich gelesene Quellen

Arena-Basis: https://github.com/georg-doc/KFB-Combat-Arena/tree/af41a214f9c3f8fc0ae70c503448c2e690372f1d

Studio-Referenz: https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/9a24a2f99b8972c0b9d09508d5db5aad6367c7e3/_inbox/KFB%20FrankenStein%20Studio%2016/KFB-v16/docs

Dort gelesen: `WSA_UEBERGABE_STUDIO_V16_2026-09-13.md`, `BRIEFING_SONNET_AnimationLab_v5_Waffen.md`, `OFFEN_nach_v16.md`, `MANIFEST.md`. Zusätzlich alle 18 Paketdateien.

Die Studio-Dokumente berichten gemeinsame Texturatlas-/Materialzonen, getrennte Haut-/Gesichtsbehandlung, IK-/Bind-Korrekturen und noch offene Kartenfragen. Für die Arena folgen daraus: keine pauschale Materialtönung, kein zweites Gesicht, keine konkurrierende Boden-/Tilt-Korrektur. Diese Implementierungen wurden hier nicht im Studio ausgeführt oder visuell abgenommen. Karten-Texturrotation und Studio-CardRider sind keine versteckten Zusatzaufträge für diesen Waffen-Slice.

Gepinnter Waffen-Donor (hier referenziert, noch nicht geometrisch vermessen):
https://raw.githubusercontent.com/georg-doc/kayfabizarro/11d7df978c63b9e375707bd8d9431b4c8358cda8/media/3D_Assets/Platformer%20Game%20Kit%20-%20Dec%202021/Character/glTF/Character_Gun.gltf

## Statussprache

SOURCE VERIFIED = Datei gelesen und Quellenstand identifiziert. TESTED RESULT = tatsächlich ausgeführte Prüfung mit benanntem Umfang. PROPOSAL = Designvorschlag. UNTESTED = keine passende Ausführung. BLOCKED nur für den konkret abhängigen Schritt verwenden: fehlende Messwerte verhindern den Waffenimport, nicht weitere Quellenanalyse oder A2-Vorbereitung.

In dieser Adaption wurden keine Gameplay-Dateien verändert und keine neue Browser-/Hörabnahme durchgeführt. Historische 60 Tests sind in C0 dokumentiert und ersetzen die neue Waffen-Abnahme nicht.
