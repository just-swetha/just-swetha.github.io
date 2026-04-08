AR Placeholder / Integration Notes

Goal: Run the sorting game as an AR experience later (items appear in the user's environment).

Options:
- WebXR (open standard) + WebXR Device API: native browsers with AR support.
- AR frameworks: 8th Wall (paid), Zappar, or model-viewer AR for markerless placement.

Minimal changes to make this AR-ready:
1. Keep core game logic separate from DOM rendering. Move the game engine (physics + rules) into a modular script (e.g., `game-core.js`).
2. Replace 2D floating item images with 3D models or CSS/HTML overlays positioned from AR world coordinates.
3. Add an AR bootstrap that obtains world anchors/planes and maps world positions to screen coordinates for UI fallback.
4. Add tactile UI for entrance/exit of AR scene and a non-AR fallback (current web game).

Files to add later:
- `game-core.js` — physics + rules (shared between 2D and AR).
- `ar-entry.js` — initializes WebXR or 3rd-party SDK and provides screen/world mapping.
- 3D assets (`.glb`) for items and bins.

Testing:
- Test non-AR fallback in desktop/mobile emulators.
- For WebXR, test on supported devices (Chrome Android, compatible ARCore/ARKit browsers).

If you want, I can split the current inline script into `game-core.js` and add an `ar-entry.js` placeholder next.