# KFB ToolBox Production-03

Status: **ADOPTED CANDIDATE · STAGE REVIEW NEXT**

Dies ist die bestehende ToolBox-Arbeitsoberfläche aus dem geprüften Production-03-Export – kein neuer UI-Entwurf und kein zweiter Runtime-Owner.

- Studio, Animation Studio und Rigging bleiben in einer Oberfläche.
- `anim-map.v1.js` ist byte-identisch zum kanonischen FrizzleGraft-Donor.
- `pose-rig.v1.js` übernimmt den dokumentierten Handgelenk-/IK-Fix in den bestehenden Pose-Owner.
- `face-mount.v1.js` ist der fehlende Adapter für Nicht-Graft-Figuren; EyeRig, Mouth und Graft bleiben ihre eigenen Besitzer.

Direkter Stage-Kandidat: `/kfb-hub/stage/toolbox/production-03/`

Nächster Gate: Browser-Regressionsprüfung des adoptierten Pakets. Danach folgt ausschließlich `BODY-02` für Material, Farbe, Licht und Character-Oberflächen.
