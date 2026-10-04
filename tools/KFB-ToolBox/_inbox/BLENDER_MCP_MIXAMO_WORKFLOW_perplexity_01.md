Ja, das lässt sich deutlich vereinfachen. Ich würde den Workflow von **„Charakter hochladen → Animation online erzeugen → FBX herunterladen → zurück in Blender importieren“** auf eine lokale **Animation-Assembly-Pipeline** umstellen:

```text
externe Motion-Quelle
→ einmaliger Retargeting-/Import-Pass
→ lokale K-Kit-Animation-Library
→ Blender/Claude-MCP-Tools
→ automatische Vorschau, Validierung und Engine-Export
```

Der entscheidende Lizenzpunkt ist: **Die Roh-FBX-Dateien gehören nicht in ein öffentliches Repository.** Für Mixamo erlaubt Adobe die Nutzung der Charaktere und Animationen in eigenen kommerziellen Spielen, Filmen und vergleichbaren Projekten; die Rohdaten dürfen aber nicht als eigenständige Assets oder extrahierbare Animationen weiterverteilt werden. Eine private lokale Library für das eigene Projekt ist daher grundsätzlich der passende Ansatz — die konkrete Adobe-Lizenz sollte vor Veröffentlichung trotzdem nochmals geprüft werden. [helpx.adobe](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html)

## 1. Zielarchitektur

Für dein Projekt würde ich drei Ebenen trennen:

```text
Kayfabizarro/
├── public/
│   ├── animation-manifests/
│   └── animation-previews/
├── private-assets/              # nicht in Git
│   ├── source-fbx/
│   ├── retargeted-actions/
│   └── licensed-motion/
├── tools/
│   ├── animation_lab/
│   ├── blender_scripts/
│   └── manifests/
└── skills/
    └── animation-lab.md
```

### Öffentlich ins Repository

Unproblematisch beziehungsweise sinnvoll sind:

- Blender-Python-Skripte.
- MCP-Tooldefinitionen.
- Bone-Mapping-Dateien.
- Export-Presets.
- Clip-Metadaten ohne Rohmotion.
- Vorschauvideos oder gerenderte GIFs.
- selbst erstellte Keyframe-Daten.
- Tests und Validierungsskripte.
- Dokumentation.
- Dateinamen und interne Clip-IDs.

### Nicht öffentlich ins Repository

Nicht einchecken würde ich:

- Mixamo-FBX-Dateien.
- hochgeladene Medium-/Large-Charaktere.
- retargetete Dateien, wenn sie noch ohne Weiteres als Motion-Asset extrahiert werden können.
- fremde BVH-/FBX-Rohdaten.
- automatisch generierte ZIP-Pakete mit Originalanimationen.
- Provider-API-Keys und Credentials.

Eine `.gitignore` könnte beispielsweise so aussehen:

```gitignore
# Licensed or provider-derived motion data
/private-assets/
/licensed-assets/
/source-fbx/
/retargeted-actions/
/motion-cache/

*.fbx
*.bvh
*.blend1

# Credentials
.env
*.key
*.pem
```

Deine eigenen `.blend`-Dateien solltest du ebenfalls differenzieren: Ein Projektfile mit deinen eigenen Assets ist etwas anderes als ein generisches Motion-Asset-Paket. Trotzdem würde ich lizenzierte Rohdaten auch in einem privaten Produktionsfile nur dort speichern, wo sie wirklich gebraucht werden.

## 2. Der bessere Workflow

### Variante A: Einmaliges Online-Retargeting

Das ist vermutlich der pragmatischste Übergang:

```text
1. K-Kit-Medium-Modell einmalig in Mixamo hochladen
2. Medium-Animationssets herunterladen
3. K-Kit-Large-Modell einmalig in Mixamo hochladen
4. Large-Animationssets herunterladen
5. Beide Rigs auf gemeinsames K-Kit-Skelett normalisieren
6. Danach lokal mit Actions/NLA arbeiten
```

Danach musst du für neue Clips nicht jedes Mal ein neues Modell hochladen, solange:

- das Rig gleich bleibt.
- die Bone-Namen gleich bleiben.
- die Rest Pose gleich bleibt.
- die Modellklasse nicht gewechselt wird.

Für Medium und Large würde ich nicht zwei komplett unabhängige Animationsbibliotheken pflegen, sondern:

```text
KKitHumanoid_v1
├── source actions
├── medium retarget profile
└── large retarget profile
```

Das Ziel wäre ein gemeinsames **kanonisches Animationsskelett**. Medium und Large werden dann nur noch als zwei Retargeting-Ziele behandelt.

### Variante B: Lokales Retargeting

Der bessere langfristige Workflow ist:

```text
Mixamo-Animation
→ lokale Source-Datei
→ lokales Retargeting auf KKitHumanoid
→ Source-Datei archivieren
→ nur lokale Action weiterverwenden
```

Mögliche Werkzeuge:

- Rokoko Blender Plugin für Retargeting.
- Auto-Rig Pro Remap.
- Blender-eigene Actions und NLA.
- ein eigenes `bpy`-Skript.
- ein MCP-Tool, das das Skript ausführt.

Rokoko beschreibt das Retargeting im Blender-Plugin als kostenlose Funktion, die keinen Premium-Account benötigt. Auto-Rig Pro Remap kann unter anderem BVH- und FBX-Animationen auf ein anderes Armature übertragen. [support.rokoko](https://support.rokoko.com/hc/en-us/articles/4410463481489-Retarget-an-animation-in-Blender)

Die eigentliche Verbesserung besteht darin, dass der Wechsel zwischen Online-Dienst und Blender nur noch **einmal pro neuer Motion-Quelle** notwendig ist.

## 3. MCP-Optionen

### Option 1: Community `mcp-for-blender`

Das Projekt [mcp-for-blender](https://github.com/ahujasid/mcp-for-blender) ist weiterhin die unkomplizierteste Community-Lösung für Claude Desktop. Es verbindet Claude über einen lokalen Server und ein Blender-Addon mit der laufenden Blender-Instanz. [github](https://github.com/ahujasid/mcp-for-blender)

Es bietet unter anderem:

- Szeneninspektion.
- Ausführen von Blender-Python.
- Objekt- und Materialsteuerung.
- Import und Export.
- GLB-/FBX-Export.
- Zugriff auf Animationen über Skripte.
- lokale Kommunikation über Socket.
- optionalen Safe Mode.

Die Konfiguration für Claude Desktop sieht laut Repository grundsätzlich so aus:

```json
{
  "mcpServers": {
    "blender": {
      "command": "uvx",
      "args": ["mcp-for-blender"]
    }
  }
}
```

Im Blender-Addon wird anschließend der MCP-Server gestartet. [github](https://github.com/ahujasid/mcp-for-blender)

**Einschätzung für dein Projekt:** gut als produktiver Einstieg, aber die meisten spezialisierten Animationsoperationen würdest du wahrscheinlich über `execute_blender_code` oder eigene Wrapper-Skripte ausführen.

Das bedeutet: Claude sollte nicht jedes Mal komplexe `bpy`-Logik neu generieren. Besser ist:

```text
Claude:
  „Importiere dance_goblin_03 und retargete auf Medium.“

MCP:
  ruft kfb_animation_lab.import_and_retarget(...)
```

### Option 2: `dcc-mcp-blender`

Das [DCC MCP Blender](https://github.com/dcc-mcp/dcc-mcp-blender)-Projekt ist für eure Pipeline besonders interessant, weil es stärker wie eine Produktionsinfrastruktur aufgebaut ist. Es stellt unter anderem typisierte Tools für Rigging, Retargeting, Pose Libraries, NLA, Import/Export und Animation bereit. [github](https://github.com/dcc-mcp/dcc-mcp-blender)

Genannte Werkzeuge umfassen zum Beispiel:

```text
retarget_animation
list_animation_actions
list_nla_tracks
add_nla_track
add_nla_strip
bake_animation
validate_animation
validate_export_readiness
create_publish_manifest
prepare_publish_package
```

Das ist für ein Animation Lab deutlich geeigneter als ein reines „Blender per Chat bedienen“-Plugin.

Der Server läuft als eingebetteter HTTP-MCP-Server direkt innerhalb beziehungsweise an Blender und verwendet laut Repository einen lokalen Gateway unter:

```text
http://127.0.0.1:9765/mcp
```

Claude Desktop kann grundsätzlich über diesen Endpoint verbunden werden. [github](https://github.com/dcc-mcp/dcc-mcp-blender)

**Meine Einschätzung:** Für eine skalierbare, datengetriebene Clip-Library würde ich `dcc-mcp-blender` ernsthaft testen. Es hat mehr Produktionsbegriffe eingebaut:

- Validierung.
- Manifeste.
- Retargeting.
- NLA.
- Asset-Metadaten.
- Export-Presets.
- Skill-System.
- Headless-Betrieb.

Das passt besser zu deinem Wunsch nach einem reproduzierbaren Animation-Lab als ein rein kreativer Chat-Controller.

### Option 3: Headless-MCP und Batch-Verarbeitung

Für viele Clips ist ein Headless-Workflow besonders wertvoll:

```text
Claude erzeugt Auftrag
→ MCP startet Blender im Hintergrund
→ Import/Retarget/Bake
→ Vorschau rendern
→ Validierungsreport
→ GLB oder interne Blend-Datei speichern
```

Dann muss Blender nicht ständig als interaktive Oberfläche offen sein. Ein Batch-Job könnte so aussehen:

```json
{
  "job": "retarget_animation",
  "source": "dance_goblin_03.fbx",
  "targetRig": "KKitHumanoid_v1",
  "targetClass": "medium",
  "loop": true,
  "bake": true,
  "removeRootMotion": true,
  "preview": true
}
```

Die Ausgabe sollte nicht nur eine Datei sein, sondern ein Ergebnisobjekt:

```json
{
  "status": "success",
  "clip": "dance_goblin_03",
  "targetRig": "KKitHumanoid_v1",
  "targetClass": "medium",
  "duration": 3.84,
  "fps": 30,
  "loopValid": true,
  "footSliding": 0.012,
  "missingBones": [],
  "preview": "private-preview/dance_goblin_03.webp"
}
```

## 4. Eigener Animation-Lab-MCP

Die beste Lösung wäre wahrscheinlich eine **kleine projektspezifische Schicht über einem allgemeinen Blender-MCP**.

Nicht Claude sollte wissen, wie jede Animation intern verarbeitet wird. Stattdessen bekommt Claude nur semantische Werkzeuge:

```text
list_animation_clips
inspect_animation_clip
import_motion_source
retarget_clip
bake_clip
make_loop
apply_style_profile
create_preview
validate_clip
publish_clip_to_private_library
```

### Beispiel für die Tool-Semantik

```json
{
  "name": "retarget_clip",
  "description": "Retarget a locally stored motion clip to a K-Kit character class.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "clipId": { "type": "string" },
      "targetClass": {
        "type": "string",
        "enum": ["medium", "large"]
      },
      "styleProfile": { "type": "string" },
      "loop": { "type": "boolean" },
      "bake": { "type": "boolean" }
    },
    "required": ["clipId", "targetClass"]
  }
}
```

Claude könnte dann mit einer natürlichen Anweisung arbeiten:

> „Nimm `dance_ritual_02`, retargete es auf das Large-Rig, wende den Stil `stonefolk_stomp` an, entferne Root Motion, mache einen sauberen Loop und rendere eine Vorschau.“

Das MCP-Tool erledigt intern:

```python
def retarget_clip(
    clip_id: str,
    target_class: str,
    style_profile: str | None = None,
    loop: bool = True,
    bake: bool = True,
):
    source_path = resolve_private_source(clip_id)
    target_rig = resolve_target_rig(target_class)

    import_motion(source_path)
    normalize_rest_pose()
    map_bones("KKitHumanoid_v1")
    apply_retarget(target_rig)
    bake_action()
    remove_root_motion_if_requested()
    apply_style_profile(style_profile)

    if loop:
        repair_loop()

    validate_animation()
    render_preview()
    save_private_action()
```

Das ist deutlich robuster, als Claude für jede Animation ein neues langes Blender-Skript schreiben zu lassen.

## 5. Clip-Library als Datenbank

Ich würde die Library nicht primär über Dateinamen, sondern über ein Manifest steuern.

### Beispiel

```json
{
  "schema": "kfb-animation-clip-v1",
  "clipId": "dance_ritual_02",
  "displayName": "Ceremonial Shoulder Bounce",
  "category": "social.dance",
  "source": {
    "provider": "mixamo",
    "sourceFile": "private://source-fbx/mixamo/dance_ritual_02.fbx",
    "license": "Adobe Mixamo project use",
    "redistributable": false
  },
  "rig": {
    "canonical": "KKitHumanoid_v1",
    "targets": ["medium", "large"]
  },
  "motion": {
    "duration": 4.2,
    "fps": 30,
    "loop": true,
    "rootMotion": "in_place",
    "bpm": 118,
    "energy": 0.72
  },
  "tags": [
    "dance",
    "ceremonial",
    "social",
    "loop",
    "noncombat",
    "upper-body-accent"
  ],
  "styleProfiles": [
    "goblin_chaotic",
    "stonefolk_heavy"
  ],
  "status": "retargeted",
  "previews": {
    "medium": "private://previews/dance_ritual_02_medium.webp",
    "large": "private://previews/dance_ritual_02_large.webp"
  }
}
```

### Kategorien für deine Anwendung

```text
social/
├── greeting
├── conversation
├── listening
├── laughing
├── embarrassment
├── celebration
├── dance
├── cheering
└── farewell

performance/
├── idle_performance
├── stage_intro
├── stage_loop
├── signature_move
└── stage_outro

interaction/
├── point
├── wave
├── shrug
├── inspect
├── offer
├── reject
└── approval

reaction/
├── surprise
├── confusion
├── annoyance
├── pride
├── fear
└── victory
```

Damit wird die Library für Dialogsysteme und NPC-Interaktion brauchbar, nicht nur für Tanzsequenzen.

## 6. Medium und Large sauber abbilden

Ich würde die Rig-Klassen nicht als zwei völlig verschiedene Pipelines behandeln:

```text
KKitHumanoid_v1
├── shared action source
├── MediumRetargetProfile
└── LargeRetargetProfile
```

### Medium-Profil

```json
{
  "profile": "medium",
  "scale": 1.0,
  "armLengthCorrection": 1.0,
  "legLengthCorrection": 1.0,
  "headScale": 1.0,
  "styleDefaults": {
    "bounce": 1.0,
    "overshoot": 0.8
  }
}
```

### Large-Profil

```json
{
  "profile": "large",
  "scale": 1.0,
  "armLengthCorrection": 1.12,
  "legLengthCorrection": 1.08,
  "headScale": 1.15,
  "styleDefaults": {
    "bounce": 0.7,
    "overshoot": 0.55
  }
}
```

Bei Large-Rigs würde ich nicht einfach die Medium-Animation skalieren. Häufig müssen angepasst werden:

- Geschwindigkeit der Armbewegung.
- Hüftrotation.
- Schrittweite.
- Bewegungsschwerpunkt.
- Kopf- und Oberkörperverzögerung.
- Kontaktzeit des Fußes.
- sekundäre Bewegungen.

Ein `large`-Style-Postprocess kann also automatisch:

```text
Arme etwas langsamer
Hüfte etwas schwerer
Schritte etwas breiter
Bounce etwas kleiner
Anticipation etwas länger
Follow-through etwas stärker
```

anwenden.

## 7. Automatisierte Validierung

Bevor ein Clip in die Library kommt, sollte der MCP automatisch prüfen:

```text
- sind alle Pflichtknochen gemappt?
- existiert eine Action?
- besitzt sie Keyframes?
- ist die FPS korrekt?
- ist die Dauer plausibel?
- sind Root-Transforms unerwartet?
- rutschen die Füße stark?
- gibt es extreme Bone-Rotationen?
- looped der Clip sauber?
- fehlen NLA- oder Exportdaten?
```

Eine einfache Validierungsstruktur:

```json
{
  "valid": true,
  "warnings": [
    "minor_left_foot_slide",
    "head_rotation_clamped"
  ],
  "errors": [],
  "metrics": {
    "duration": 3.84,
    "frameCount": 115,
    "maxFootSlideMeters": 0.014,
    "missingRequiredBones": 0,
    "loopDiscontinuity": 0.021
  }
}
```

Für deine comicartige Pipeline sollte die Validierung nicht zu aggressiv sein. Ein absichtlich übertriebener Squash oder ein bewusst rutschender Comedy-Schritt ist kein technischer Fehler. Deshalb sollte es zwei Modi geben:

```text
strict_gameplay
cartoon_permissive
```

## 8. Was ich konkret empfehlen würde

### Für sofort

1. Das funktionierende Medium-/Large-Setup beibehalten.
2. Nicht mehr jedes Mal neue Charaktere hochladen.
3. Beide Zielcharaktere als feste private Rig-Presets speichern.
4. Externe FBX-Dateien in einen privaten lokalen Ordner verschieben.
5. Den Import und Export mit einem Blender-Python-Skript automatisieren.
6. Claude nur noch den Auftrag und die Parameter geben lassen.

### Für den nächsten Schritt

`mcp-for-blender` testen, weil es einfach einzurichten ist und sich gut für vorhandene Skripte eignet. [github](https://github.com/ahujasid/mcp-for-blender)

Danach `dcc-mcp-blender` in einer separaten Blender-Instanz testen, weil dessen typisierte Animation-, Validierungs- und Publishing-Werkzeuge besser zu einer echten Clip-Library passen. [github](https://github.com/dcc-mcp/dcc-mcp-blender)

### Für die Produktionsversion

Eine eigene dünne `kfb-animation-lab`-Schicht bauen:

```text
Claude
  ↓
kfb-animation-lab MCP
  ↓
dcc-mcp-blender oder mcp-for-blender
  ↓
Blender bpy
  ↓
private clip storage
```

Damit bleibt der Lizenzschutz technisch sauberer, weil:

- die Rohdaten nur lokal liegen.
- GitHub nur Tools und Metadaten enthält.
- Exporte gezielt aus dem privaten Workspace erfolgen.
- die Animationen nicht als öffentliche generische Assets verteilt werden.
- der öffentliche Repository-Bestand reproduzierbar bleibt, ohne fremde Motion-Daten zu enthalten.

## Meine klare Empfehlung

Für euch wäre dieser Zielzustand sinnvoll:

```text
Extern:
  Mixamo/Rokoko nur als Motion-Quelle

Lokal:
  private source-fbx/
  private retargeted actions
  lokale Blender-Projektdateien
  lokale Preview-Renders

GitHub:
  kfb-animation-lab MCP
  bpy-Operatoren
  Rig-Maps
  Style-Profile
  Clip-Manifeste ohne Rohdaten
  Testfixtures aus selbst erstellten Minimalanimationen

MCP:
  semantische Befehle wie retarget_clip, make_loop, validate_clip

Blender:
  kanonisches K-Kit-Rig
  Medium-/Large-Retarget-Profile
  NLA- und Action-Library
```

Wenn ich zwischen den genannten MCP-Ansätzen wählen müsste, würde ich **`mcp-for-blender` für den schnellen Einstieg** und **`dcc-mcp-blender` für die längerfristige Animation-Lab-Infrastruktur** verwenden. Der eigentliche Schlüssel ist aber nicht der MCP-Server selbst, sondern die zusätzliche projektspezifische Abstraktion: Claude sollte `dance_ritual_02` und `large` verstehen — nicht jedes Mal selbst FBX-Import, Bone-Mapping und Blender-NLA zusammenskripten.