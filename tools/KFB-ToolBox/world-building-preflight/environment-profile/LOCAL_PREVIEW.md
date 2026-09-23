# WB1-P1 Environment Profile · Local Preview

Status: **LOCAL REVIEW · NOT PUBLIC**

## Start

From this folder:

```bash
python3 -m http.server 4176
```

Open:

`http://127.0.0.1:4176/`

Or on macOS double-click `START_PREVIEW.command`.

## Required review order

1. The page starts on **SOURCE TORCH** and shows the real `torch_mounted.gltf` donor alone with SOURCE material.
2. Only after that source object has rendered, **ENVIRONMENT** unlocks.
3. Switch to ENVIRONMENT and inspect DUSK/DAY, Torch profile, Local Visibility and SOURCE/MATTE material.
4. The bottom diagnostic line must report `consoleErrors=0` and `activePool` must never exceed `/6`.

## Stop

Press `Ctrl+C` in the server terminal, or use `STOP_PREVIEW.command` when started through the launcher.
