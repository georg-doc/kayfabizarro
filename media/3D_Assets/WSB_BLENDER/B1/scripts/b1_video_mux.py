# WSB B1 · headless Blender VSE: JPEG frame sequence + song mix -> H.264/AAC mp4. No glTF export, no scene assets.
# Usage: blender -b --factory-startup --python b1_video_mux.py -- <frames_dir> <mix.mp3> <song_from_s> <out.mp4>
import bpy, sys, os

frames_dir, mp3, song_from, out = sys.argv[sys.argv.index('--') + 1:]
song_from = float(song_from)
files = sorted(f for f in os.listdir(frames_dir) if f.endswith('.jpg'))
sc = bpy.context.scene
sc.render.fps, sc.render.fps_base = 30, 1.0
sc.render.resolution_x, sc.render.resolution_y, sc.render.resolution_percentage = 1920, 1080, 100
sc.frame_start, sc.frame_end = 1, len(files)
se = sc.sequence_editor_create()
strips = se.strips if hasattr(se, 'strips') else se.sequences
img = strips.new_image('frames', os.path.join(frames_dir, files[0]), channel=1, frame_start=1)
for f in files[1:]:
    img.elements.append(f)
snd = strips.new_sound('song', mp3, channel=2, frame_start=1)
snd.frame_start = 1 - int(round(song_from * 30))      # shift the song left so frame 1 = song_from
snd.frame_final_start, snd.frame_final_end = 1, len(files) + 1
r = sc.render
if hasattr(r.image_settings, 'media_type'):   # Blender 5.x: video output is a media type
    r.image_settings.media_type = 'VIDEO'
r.image_settings.file_format = 'FFMPEG'
r.ffmpeg.format, r.ffmpeg.codec = 'MPEG4', 'H264'
r.ffmpeg.constant_rate_factor, r.ffmpeg.ffmpeg_preset = 'HIGH', 'GOOD'
r.ffmpeg.audio_codec, r.ffmpeg.audio_bitrate, r.ffmpeg.audio_mixrate = 'AAC', 192, 48000
r.filepath = out
bpy.ops.render.render(animation=True)
print('MUX_OK', out, len(files), 'frames')
