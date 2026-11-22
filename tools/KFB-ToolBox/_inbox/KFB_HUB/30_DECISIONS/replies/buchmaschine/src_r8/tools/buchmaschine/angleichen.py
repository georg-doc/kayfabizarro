# Gleicht die rohen ElevenLabs-Klänge (WS0, buchmaschine_r1) an: Effektklänge auf RMS −20 dBFS, Schleifen auf −26 dBFS, Spitze höchstens −1 dBFS; Ausgabe WAV 48 kHz.
# python3 angleichen.py <quellordner> <zielordner> <ffmpeg>
import sys, os, glob, subprocess, numpy as np
q, z, ff = sys.argv[1:4]; SR = 48000; os.makedirs(z, exist_ok=True)
for f in sorted(glob.glob(os.path.join(q, 'BM*.mp3'))):
    roh = subprocess.run([ff, '-loglevel', 'error', '-i', f, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    a = np.frombuffer(roh, np.float32).reshape(-1, 2).copy()
    ziel = -26 if 'loop' in f else -20
    rms = float(np.sqrt(np.mean(a ** 2))) or 1e-6; g = 10 ** (ziel / 20) / rms
    g = min(g, 0.89 / (float(np.abs(a).max()) or 1e-6)); a *= g
    aus = os.path.join(z, os.path.basename(f)[:-4] + '.wav')
    subprocess.run([ff, '-loglevel', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', '-c:a', 'pcm_s16le', aus], input=a.astype(np.float32).tobytes())
    print(os.path.basename(aus), round(len(a) / SR, 2), 's, Verstärkung', round(20 * np.log10(g), 1), 'dB')
