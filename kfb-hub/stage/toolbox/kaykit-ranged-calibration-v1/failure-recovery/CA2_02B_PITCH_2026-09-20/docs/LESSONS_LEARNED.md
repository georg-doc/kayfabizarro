# Lessons Learned

1. Screen-space intuition is not enough for coupled animated Euler transforms; measure world muzzle pitch.
2. Calibration should use a frozen deterministic animation frame/phase, not a live loop after wall-clock delay.
3. Preserve the already-good fist position and solve the remaining orientation with direct manipulation, not repeated numeric guesses.
4. Muzzle extraction and release timing are separate proven layers and must stay locked.
