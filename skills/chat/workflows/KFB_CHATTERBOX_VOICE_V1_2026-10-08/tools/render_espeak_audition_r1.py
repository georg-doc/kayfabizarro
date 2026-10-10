#!/usr/bin/env python3
"""Render only existing non-canon KFB eSpeak audition fixtures. Build-time, no game/UI.
Usage: python render_espeak_audition_r1.py path/to/RECEIPT.json OUTPUT_DIR [--check-hashes]
"""
import hashlib
import json
import pathlib
import subprocess
import sys
import tempfile


def main():
    if len(sys.argv) not in (3, 4):
        raise SystemExit('Usage: render_espeak_audition_r1.py RECEIPT.json OUTPUT_DIR [--check-hashes]')
    strict = len(sys.argv) == 4 and sys.argv[3] == '--check-hashes'
    if len(sys.argv) == 4 and not strict:
        raise SystemExit('Unknown option')
    receipt = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
    if receipt.get('status') != 'LOCAL_AUDIO_RENDER_PROVEN_NONCANON_NO_HUMAN_AUDIO_QA_NO_SITE_DEPLOY':
        raise SystemExit('This tool accepts only the pinned noncanonical R1 receipt')
    output = pathlib.Path(sys.argv[2]); output.mkdir(parents=True, exist_ok=True)
    results = []
    for item in receipt['clips']:
        if item['sourceStatus'] != 'CASTING_ONLY_NON_CANON' or item['publicRightsCleared']:
            raise SystemExit('Unexpected clip classification: refusing render')
        with tempfile.TemporaryDirectory() as t:
            wav = pathlib.Path(t) / 'voice.wav'
            target = output / item['fileName']
            subprocess.run(['espeak', '-v', item['espeakVoice'], '-s', str(item['speed']),
                            '-p', str(item['pitch']), '-w', str(wav), item['exactText']], check=True)
            subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-loglevel', 'error', '-y',
                            '-i', str(wav), '-ar', '44100', '-ac', '1', '-b:a', '112k', str(target)], check=True)
        probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries',
                  'stream=codec_name:format=duration', '-of', 'json', str(target)], text=True))
        if probe['streams'][0]['codec_name'] != 'mp3' or float(probe['format']['duration']) <= 0:
            raise RuntimeError('Audio decode/probe failed: ' + target.name)
        digest = hashlib.sha256(target.read_bytes()).hexdigest()
        if strict and digest != item['sha256']:
            raise RuntimeError('SHA differs; verify eSpeak/FFmpeg versions: ' + target.name)
        results.append({'file': target.name, 'durationSeconds': round(float(probe['format']['duration']), 3),
                        'sha256': digest, 'sameAsOriginal': digest == item['sha256']})
    print(json.dumps({'count': len(results), 'status': 'PRIVATE_NON_CANON_AUDITION', 'results': results}, indent=2))


if __name__ == '__main__':
    main()
