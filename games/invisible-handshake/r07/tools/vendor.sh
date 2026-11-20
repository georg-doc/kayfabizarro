#!/bin/sh
set -eu
mkdir -p site/dist/vendor
curl -fsSL https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js -o site/dist/vendor/three.module.js
curl -fsSL https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js -o site/dist/vendor/GLTFLoader.js
curl -fsSL https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/utils/BufferGeometryUtils.js -o site/dist/vendor/BufferGeometryUtils.js
python3 -c "from pathlib import Path;p=Path('site/dist/vendor/GLTFLoader.js');p.write_text(p.read_text().replace('../utils/BufferGeometryUtils.js','./BufferGeometryUtils.js'))"
