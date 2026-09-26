# Test Report · Asset 03 Recovery

Status: **MIXED · r2 TILE PASS · r3 TILE FAIL · BLENDER NOT RUN**

## File inspection

### Asset 01 accepted source
- 1024×1024 RGB PNG
- SHA-256 `fb952516a6c77448b7107486256798ca201629a3c2fac4397121906dd3c04ea5`
- exact opposite-edge MAE: X 0.00 / Y 0.00
- human state: ACCEPTED

### Asset 03 r2
- 2048×2048 16-bit grayscale PNG
- SHA-256 `f1d3cf4e5bd0b65e9a7d3d61c38b119efa25270e5905ddd36a50796e02f28e69`
- 3×3 preview SHA-256 `5104bb35e1dfc271c48ab778f06a9077c215106d4b243b5c95f1c50e063e831f`
- tile metric: **PASS**
- human visual acceptance: **OPEN**

### Asset 03 r3
- 2048×2048 16-bit grayscale PNG
- SHA-256 `1b1a595ac8c6c88e52a42bea97a43f804fa6bf3dcfdb1e2176f8e7acc612fe8f`
- 3×3 preview SHA-256 `34d40d79e2b411a66e24167ce333e1ba3d438efd1d9e5fa99b2e7c97b65006f1`
- tile metric: **NEEDS FIX**
- state: failure-recovery evidence only

## Authoring environment recorded

- NumPy 2.3.5
- SciPy 1.17.0
- Pillow 12.3.0

The exact r2 generator is checked in at:
`../../generator_asset03_r2.py`

## Not tested / not claimed

- Blender 5.2 material load
- Bump strength or distance
- real-world texel density
- displacement calibration
- tangent-space normal bake
- Cycles / EEVEE / runtime parity
- animation no-swim on a KFB rig
- GLB export
- Stage / Live

Therefore Asset 03 is **not production-promoted** despite r2 passing the tile metric.
