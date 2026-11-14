Für Claude Design (Website-Chat) · Nachtrag 5: Gesichtsteile werfen keinen Schatten · 14.11. (Georg, V-1772)

In der ToolBox warf die transparente Mundfläche einen rechteckigen Schatten aufs Gesicht (dort jetzt behoben). In unseren Web-Dateien liegen Mund, Nase und Brauen ebenfalls als eigene Flächen. Bitte beim Laden für diese Knoten castShadow = false setzen (wie im Spiel, face-mount shadowOff), Augen und Körper werfen weiter Schatten:
- FrizzleBob: alle Knoten FB_Mund_* und die Nasen- und Brauen-Teile (Knotenliste in 50_BLENDER/FB_WEB_KANON_R1/RETURN.md),
- Lord Hunky und Lady Dory: alle Knoten Hunky_Mund_* bzw. Dory_Mund_*.
Wenn du ein Pauschal-„alle Meshes werfen Schatten“ nutzt, danach diese Knoten wieder ausnehmen.
