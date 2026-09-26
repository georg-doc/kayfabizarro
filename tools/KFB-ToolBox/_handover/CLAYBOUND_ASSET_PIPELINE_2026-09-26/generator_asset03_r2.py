#!/usr/bin/env python3
"""Reproduce KFB Clay Asset 03 r2 from deterministic source parameters.

This is a HOST-PYTHON source generator, not a Blender node script.
Pinned authoring environment used for the reviewed artifact:
- Python 3.x
- numpy 2.3.5
- scipy 1.17.0
- Pillow 12.3.0

Output intent:
- 2048x2048
- 16-bit grayscale PNG
- Non-Color relative-height source
- NOT physically calibrated displacement

Expected reviewed artifact SHA-256:
f1d3cf4e5bd0b65e9a7d3d61c38b119efa25270e5905ddd36a50796e02f28e69
"""

from pathlib import Path
import hashlib
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

N = 2048
SEED = 0x4B464203
EXPECTED_SHA256 = "f1d3cf4e5bd0b65e9a7d3d61c38b119efa25270e5905ddd36a50796e02f28e69"
DEFAULT_NAME = "KFB_CLAY_ASSET_03_rough_handmade_meso_height_r2_2048_16bit.png"


def periodic_spectral(n, beta, lo, hi, rng):
    ky = np.fft.fftfreq(n)[:, None]
    kx = np.fft.rfftfreq(n)[None, :]
    k = np.sqrt(kx * kx + ky * ky) * n
    amp = np.zeros_like(k, dtype=np.float64)
    mask = (k >= lo) & (k <= hi)
    amp[mask] = np.maximum(k[mask], 1.0) ** (-beta / 2.0)
    phase = rng.uniform(0, 2 * np.pi, size=k.shape)
    spec = amp * (np.cos(phase) + 1j * np.sin(phase))
    spec[0, 0] = 0.0
    field = np.fft.irfft2(spec, s=(n, n))
    field -= field.mean()
    field /= field.std() + 1e-12
    return field


def wrapped_signed(v, center, period):
    return ((v - center + period / 2) % period) - period / 2


def build_height():
    rng = np.random.default_rng(SEED)

    macro = periodic_spectral(N, 3.5, 2, 12, rng)
    meso = periodic_spectral(N, 3.0, 7, 42, rng)
    grain = periodic_spectral(N, 2.0, 70, 220, rng)

    yy, xx = np.mgrid[0:N, 0:N].astype(np.float32)
    gesture = np.zeros((N, N), dtype=np.float32)

    for _ in range(34):
        cx, cy = rng.uniform(0, N, 2)
        theta = rng.uniform(0, np.pi)
        length = rng.uniform(N * 0.075, N * 0.19)
        width = rng.uniform(N * 0.016, N * 0.042)
        amp = rng.uniform(-0.26, 0.26)

        sx = wrapped_signed(xx, cx, N)
        sy = wrapped_signed(yy, cy, N)
        u = sx * np.cos(theta) + sy * np.sin(theta)
        v = -sx * np.sin(theta) + sy * np.cos(theta)

        base = np.exp(-0.5 * ((u / length) ** 2 + (v / width) ** 2))
        pair = np.exp(
            -0.5
            * (
                ((u + width * 0.9) / length) ** 2
                + ((v + width * 0.55) / width) ** 2
            )
        )
        gesture += amp * (base - 0.55 * pair)

    for _ in range(16):
        cx, cy = rng.uniform(0, N, 2)
        sx = wrapped_signed(xx, cx, N)
        sy = wrapped_signed(yy, cy, N)
        radius = rng.uniform(N * 0.035, N * 0.085)
        amp = rng.uniform(-0.22, 0.22)
        dist = np.sqrt(sx * sx + sy * sy)
        gesture += amp * np.exp(-0.5 * (dist / radius) ** 2)

    pores = np.zeros((N, N), dtype=np.float32)
    for _ in range(58):
        cx, cy = rng.uniform(0, N, 2)
        sx = wrapped_signed(xx, cx, N)
        sy = wrapped_signed(yy, cy, N)
        radius = rng.uniform(N * 0.0018, N * 0.0048)
        dist2 = sx * sx + sy * sy
        pores += rng.uniform(-0.10, -0.035) * np.exp(
            -0.5 * dist2 / (radius * radius)
        )

    gesture -= gesture.mean()
    gesture /= gesture.std() + 1e-6

    height = (
        0.18 * macro
        + 0.34 * meso
        + 0.55 * gesture
        + 0.035 * grain
        + pores
    )
    height = gaussian_filter(height, sigma=1.1, mode="wrap")
    height = np.tanh(height * 0.92)
    height -= height.mean()

    p1, p99 = np.percentile(height, [1.0, 99.0])
    height = np.clip((height - p1) / (p99 - p1), 0, 1)
    height = 0.24 + 0.52 * height
    return np.round(height * 65535).astype(np.uint16)


def seam_metrics(u16):
    arr = u16.astype(np.int32)
    seam_x = np.mean(np.abs(arr[:, 0] - arr[:, -1]))
    seam_y = np.mean(np.abs(arr[0, :] - arr[-1, :]))
    local_x = np.mean(np.abs(arr[:, 1:] - arr[:, :-1]))
    local_y = np.mean(np.abs(arr[1:, :] - arr[:-1, :]))
    half = np.roll(np.roll(arr, N // 2, axis=0), N // 2, axis=1)
    return {
        "x_edge_mean_delta": float(seam_x),
        "y_edge_mean_delta": float(seam_y),
        "local_x_mean_delta": float(local_x),
        "local_y_mean_delta": float(local_y),
        "x_ratio": float(seam_x / max(local_x, 1e-9)),
        "y_ratio": float(seam_y / max(local_y, 1e-9)),
        "half_x_ratio": float(
            np.mean(np.abs(half[:, 0] - half[:, -1])) / max(local_x, 1e-9)
        ),
        "half_y_ratio": float(
            np.mean(np.abs(half[0, :] - half[-1, :])) / max(local_y, 1e-9)
        ),
    }


def main():
    out = Path(DEFAULT_NAME)
    u16 = build_height()
    Image.fromarray(u16).save(out, optimize=True)
    sha = hashlib.sha256(out.read_bytes()).hexdigest()
    metrics = seam_metrics(u16)
    print(out.resolve())
    print("sha256", sha)
    print("expected", EXPECTED_SHA256)
    print("exact_match", sha == EXPECTED_SHA256)
    print(metrics)
    print("tile_gate", max(
        metrics["x_ratio"],
        metrics["y_ratio"],
        metrics["half_x_ratio"],
        metrics["half_y_ratio"],
    ) < 1.35)


if __name__ == "__main__":
    main()
