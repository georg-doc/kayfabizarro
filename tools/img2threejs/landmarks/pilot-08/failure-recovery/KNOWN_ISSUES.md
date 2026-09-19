# KNOWN ISSUES

## BLOCKER

`kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/SOURCE.json`

Current Git blob:
`08550009f6d32c3e33cfae6796a9f79ba095049f`

Current tail is invalid JSON:

```text
}
}\\n
```

The trailing `\\n` is two literal characters (backslash + n), not whitespace.

## NON-BLOCKING / LATER

- Cathedral is placed in Hürth only for style integration.
- real Cologne OSM identity/footprint/yaw/height/fallback remain open;
- wetness/specular weather material pass remains deferred;
- mobile review remains open;
- Race/Travel contact integration remains open.
