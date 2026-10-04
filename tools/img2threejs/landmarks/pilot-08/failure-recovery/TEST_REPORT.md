# TEST REPORT

## PASS · source/runtime

Exact runtime: `aa28a743628699271c94c1911af23d0564c6f3cc`

- source/static: **27/27 PASS**
- Chromium/WebGL: **19/19 PASS**
- browser errors: **0**
- visible subset: **90** real Hürth OSM buildings / **9,459** OSM triangles
- full Hürth source scene: **700** buildings / **65,648** Grotesque triangles
- Cathedral: **1,050** triangles
- donor references: Lighthouse + Observatory isolated before integrated screenshots
- OSM default / Evening / Rain screenshots produced

Workflow: `35471351012`  
Artifact: `10591829944`  
Artifact digest: `sha256:14aed09ddd226a584a7c7979f70e75502a84d7a97a7833275d972ec49856a821`

## FAIL · public deployment gate

Workflow: `35471646709`

Attempt 1:
- FAIL before candidate publication branch was current.

Attempt 2:
- FAIL on malformed public `SOURCE.json`.

## NOT CLAIMED

- no PUBLIC_VERIFIED status;
- no human visual acceptance for the Cloudflare Stage;
- no real Cologne Cathedral OSM override;
- no mobile QA;
- no Live promotion.
