// Rapier collision groups. A collider's groups = (membership << 16) | filter.
// WORLD: terrain, buildings, trunks, rocks — blocks player and camera.
// PLAYER: the character capsule.
// CAMERA_ONLY: sensors that only stop the camera (tree canopies, bush volumes). Mark them `.setSensor(true)`.
export const G_WORLD = 1 << 0;
export const G_PLAYER = 1 << 1;
export const G_CAMERA_ONLY = 1 << 2;
/** Invisible blockers that stop only the player (lake edges); the camera ignores them. */
export const G_PLAYER_ONLY = 1 << 3;

export const groups = (membership: number, filter: number) => ((membership & 0xffff) << 16) | (filter & 0xffff);

/** Default for static world solids. */
export const WORLD_GROUPS = groups(G_WORLD, G_PLAYER | G_WORLD);
/** Player capsule: collides with world only. */
export const PLAYER_GROUPS = groups(G_PLAYER, G_WORLD | G_PLAYER_ONLY);
/** Player-only blockers (e.g. lake edges). */
export const PLAYER_ONLY_GROUPS = groups(G_PLAYER_ONLY, G_PLAYER);
/** Camera-only blockers (sensors). */
// filter must accept the query membership (Rapier tests both directions); player filter excludes CAMERA_ONLY, so the player never touches them.
export const CAMERA_ONLY_GROUPS = groups(G_CAMERA_ONLY, 0xffff);
/** Filter for camera ray/shape casts: hit world + camera-only blockers, include sensors. */
export const CAMERA_QUERY_GROUPS = groups(0xffff, G_WORLD | G_CAMERA_ONLY);
