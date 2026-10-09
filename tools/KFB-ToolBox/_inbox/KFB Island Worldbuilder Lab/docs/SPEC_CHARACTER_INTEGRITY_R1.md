# Problemfeld Figuren-Integrität R1 · Augen, Props, Posen, Ausdruck

Stand: 2026-10-09 · Status: **Problemfeld definiert, Vorschlag für die Slice nach dem MVP.** Im MVP gilt nur die Mindestprüfung aus §5.

## 1 · Wiederkehrende Fehler (Georg, 09.10.)

| Fehler | Wo gesehen |
| --- | --- |
| Props (Bierkrug, Waffe) sitzen nicht richtig in der Hand | Blender-Coworker, Stammtisch-Szene; früher Waffen |
| KayKit-Figuren mit Originalaugen gerendert | Blender-Szenen |
| Verwechslung, welche Augen-Variante „approved“ ist; zuletzt ganz ohne Augen | Blender-Szenen |
| Augen schielen nach außen oder stehen zu weit aus dem Kopf | Eye-Rig-Einbau in mehreren Tools |
| Approved-Konfigurationen aus dem Eye-Rig-Tool (GPT-Site) nicht übernommen bzw. nicht persistiert; FrizzleBob v5 liegt „irgendwo“ | GitHub, GPT-Site |
| Arm bricht beim Winken, Figuren schweben über Stühlen | Animationen, Sitzen |

**Ursache:** Es gibt keine eine Wahrheit pro Figur. Beispiel: `pet-eye-rig.v6.js` liegt in über zehn Kopien auf GitHub (PetStudio, ToolBox-Cuts, Resident-Atlas-Cuts, `kfb-rigs-embed-v3` …). Freigaben leben im Browser-Speicher der Site statt in einer Datei. Jedes Werkzeug baut Augen, Griffe und Sitze neu ein.

## 2 · Lösung: eine Figuren-Karte je Bewohner (SSOT)

Je Figur eine JSON-Datei, versioniert auf GitHub, gelesen von allen Werkzeugen: Lab, Blender, Resident Atlas, Eye-Rig-Tool, ChatterBox. Schema-Vorschlag `kfb.character-card/1`:

```json
{
  "id": "farmer_a",
  "displayName": "Farmer A",
  "rig": { "base": "KayKit Rig_Medium", "asset": "Farmer_A.glb", "scaleH": 1.0, "hideMeshes": ["Eyes_L", "Eyes_R"] },
  "eyes": {
    "rig": "kfb-eye-rig", "version": "v6", "approved": "2026-09-…",
    "socket": "head", "offset": [0, 0, 0], "ipd": 0.0, "scale": 1.0, "toeIn": 0.0,
    "lids": { "rest": 0.0 }, "pupil": { "size": 0.0 }
  },
  "personality": { "ref": "resident-atlas/farmer_a" },
  "voice": { "chatterbox": "farmer_a", "keep": true },
  "props": {
    "beer_mug": { "hand": "R", "bone": "handslot.r", "grip": [0, 0, 0, 0, 0, 0, 1], "fingers": "closed_handle" }
  },
  "seat": { "hipOffset": [0.41, 0.85, 0.18], "clip": "Sit_Chair_Idle" },
  "animations": { "library": "Rig_Medium", "limits": "rig_medium_joint_limits/1" },
  "expressions": { "map": "kfb.expression-map/1" }
}
```

**Regeln:**
- Ein Prop trägt seinen **Griffrahmen** (wo die Hand ihn hält) im Prop-Manifest. Die Figur legt nur fest, welche Hand und welche Fingerhaltung gilt.
- „Approved“ heißt: Die Karte wurde committet, mit Version und Datum. Browser-Speicher ist nie die Wahrheit.
- Eye-Rig, Props und Sitz werden **nur** aus der Karte gelesen. Kein Werkzeug baut eigene Kopien.

## 3 · Automatische Prüfungen (Validator)

| Prüfung | Grenze |
| --- | --- |
| Originalaugen versteckt | `hideMeshes` sichtbar = 0 |
| Cartoon-Augen vorhanden | genau 2, Version = Karte |
| Augen im Kopf | Augapfel ≤ x % außerhalb der Kopf-Hülle |
| Kein Schielen nach außen | Blickstrahlen konvergieren vor dem Gesicht; Symmetrie links/rechts ≤ Toleranz |
| Prop in der Hand | Abstand Griffrahmen ↔ Hand-Socket ≤ 0,02 H, Winkel ≤ 10°, keine Durchdringung von Hand bzw. Körper |
| Sitzen | Hüfte auf der Sitzfläche (Abstand ≤ 0,02 H), Füße am Boden bzw. auf der Fußleiste, kein Schweben |
| Gelenkgrenzen | kein Gelenk außerhalb der Grenzen der Rig-Tabelle (Arm „bricht“ nicht) |
| Ausdruck ↔ Animation | Emotion, Geste, Pose und Choreografie passen zur Karte (`expressionMap`) |

Dazu ein Kamerasatz **„Figur“** im Kritiker-Protokoll: Gesicht frontal, ¾, Hand mit Prop nah, Sitz seitlich.

## 4 · Golden Samples und Owner

- **Golden Samples:** FrizzleBob v5 (Eye- und Ear-Rig-Freigabe, Evidence `acceptance_1-7_frizzlebob-earrig-v5.json` in den ToolBox-Cuts vom 30.09.), dazu Farmer A und Mummy B aus dem Lab.
- **Owner:**
  - Figuren-Karten und Validator: Resident Atlas bzw. Blender-Coworker;
  - Eye-Rig-Code: genau eine Quelle (eine Kopie von `pet-eye-rig.v6.js` wird kanonisch, alle anderen verweisen darauf);
  - Lab, Blender und ChatterBox lesen nur.
- **Erster Schritt der Slice:** Inventur aller Eye-Rig-Kopien und Freigaben auf GitHub und in der GPT-Site; daraus die kanonische Version und die ersten 10 Karten (MVP-Bewohner zuerst).

## 5 · Mindestprüfung im MVP (Stufe 4)

Für die sprechenden bzw. sichtbaren Bewohner im MVP gelten die Prüfungen aus §3 als **harte Regeln**: Demon Lord, Robot One, Farmer A bzw. Farmer-Duo, Clown (Jonglage), Dark Knight (Wache), Farmersfrau, FrizzleBob im Cabrio. Für diese gibt es eine Figuren-Karte, auch wenn die Slice noch nicht gebaut ist.
