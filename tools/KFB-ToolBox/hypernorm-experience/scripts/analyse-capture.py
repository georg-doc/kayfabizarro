"""Independent PCM capture checks: 4x windowed-sinc peak estimate and silence.
Not a certified dBTP meter; retain that qualification in the Return.
"""
import sys, wave, json
import numpy as np
with wave.open(sys.argv[1], 'rb') as w:
    rate, channels = w.getframerate(), w.getnchannels()
    assert w.getsampwidth() == 2
    pcm = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').astype(np.float64).reshape(-1,channels)/32768
peak = np.max(np.abs(pcm))
for phase in [.25,.5,.75]:
    taps = np.arange(-24,25,dtype=float)
    kernel = np.sinc(taps-phase)*np.kaiser(len(taps),8.6)
    kernel /= np.sum(kernel)
    for ch in range(channels):
        peak = max(peak, np.max(np.abs(np.convolve(pcm[:,ch],kernel,'valid'))))
block = int(rate*.1)
longest = current = 0
for start in range(0,len(pcm)-block+1,block):
    rms = np.sqrt(np.mean(pcm[start:start+block]**2))
    current = current+.1 if rms<.001 else 0
    longest = max(longest,current)
print(json.dumps({'seconds':len(pcm)/rate,'samplePeakDbFS':float(20*np.log10(np.max(np.abs(pcm)))),'estimatedTruePeakDbTP4x':float(20*np.log10(peak)),'longestBelowMinus60DbFSSeconds':longest,'clippedSamples':int(np.count_nonzero(np.abs(pcm)>=1)),'qualification':'4x 49-tap windowed-sinc estimate, not certified ITU true-peak meter'},indent=2))
