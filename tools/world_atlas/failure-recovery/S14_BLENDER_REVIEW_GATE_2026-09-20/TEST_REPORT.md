# TEST REPORT · frozen Blender gate

## PASS

- static source contract: 22/22
- real Chromium/editor: 15/15
- 24/24 unique R02 source models found in registry
- Blender source import: 37 manifest instances / 39 imported objects
- Blender save: `KFB_R02.blend` created
- Blender file signature: Blender 4.00
- Blender file size: 4,115,904 bytes
- Blender SHA-256: `93e439b122d5c6bb35727c8df79c5611a32fb48f7416d164e0471c2421f3ebef`

## BLOCKED

- automated review PNG: Ubuntu headless Blender missing `libEGL.so.1`
- automated GLB: not reached after render abort

## NOT RUN

- local macOS Blender visual review
- gameplay collision/navigation
- human Form acceptance
