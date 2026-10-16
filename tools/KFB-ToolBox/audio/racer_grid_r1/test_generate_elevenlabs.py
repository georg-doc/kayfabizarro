#!/usr/bin/env python3
"""Offline, no-credential contract tests for KFB ElevenLabs Motor Grid R1."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

HERE = Path(__file__).resolve().parent
MODULE_FILE = HERE / "generate_elevenlabs.py"
spec = importlib.util.spec_from_file_location("kfb_racer_generator", MODULE_FILE)
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)


class FakeReply:
    headers = {"character-cost": "400", "Content-Type": "audio/mpeg"}

    def read(self):
        return b"ID3" + b"\x00" * 4096

    def __enter__(self):
        return self

    def __exit__(self, *_):
        return False


class MotorGridTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.src = gen.load_source()

    def test_01_source_schema_and_full_roster(self):
        self.assertEqual(self.src["schema"], "kfb.racer.motor_grid.source.r1")
        self.assertEqual(self.src["decision"], "V-378")
        self.assertEqual(len(self.src["sound_effects"]), 12)
        self.assertEqual(self.src["variant_count"], 4)

    def test_02_count_all_48_unique_paths(self):
        plan = list(gen.plan(self.src))
        self.assertEqual(len(plan), 48)
        self.assertEqual(len({f for _, _, f in plan}), 48)
        self.assertEqual(plan[0][2], "01_idle_v01.mp3")
        self.assertEqual(plan[-1][2], "12_hover_v04.mp3")

    def test_03_loop_counts_and_duration(self):
        rows = list(gen.plan(self.src))
        self.assertEqual(sum(e["loop"] for e, _, _ in rows), 24)
        self.assertEqual(sum(not e["loop"] for e, _, _ in rows), 24)
        self.assertTrue(all(e["duration_seconds"] == 10 for e, _, _ in rows if e["loop"]))
        self.assertTrue(all(1 <= e["duration_seconds"] <= 2 for e, _, _ in rows if not e["loop"]))

    def test_04_model_prompt_influence_and_prompt_limits(self):
        self.assertEqual(self.src["model_id"], "eleven_text_to_sound_v2")
        self.assertEqual(self.src["output_format"], "mp3_44100_128")
        self.assertEqual(self.src["prompt_influence"], 0.85)
        self.assertTrue(all(0 < len(e["text"]) <= 450 for e in self.src["sound_effects"]))

    def test_05_payload_has_exact_supported_fields(self):
        p = gen.payload_for(self.src, self.src["sound_effects"][0])
        self.assertEqual(set(p), {"text", "loop", "duration_seconds", "prompt_influence", "model_id"})
        self.assertEqual(p["duration_seconds"], 10)
        self.assertTrue(p["loop"])
        self.assertFalse(gen.payload_for(self.src, self.src["sound_effects"][5])["loop"])

    def test_06_api_request_is_post_and_returns_bytes(self):
        def opener(req, timeout):
            self.assertEqual(req.get_method(), "POST")
            self.assertTrue(req.full_url.startswith("https://api.elevenlabs.io/v1/sound-generation?"))
            self.assertEqual(timeout, 120)
            obj = json.loads(req.data.decode("utf-8"))
            self.assertTrue(obj["loop"])
            self.assertEqual(obj["model_id"], "eleven_text_to_sound_v2")
            self.assertEqual(req.get_header("Xi-api-key"), "fake-test-token")
            return FakeReply()
        sound, billed, mime = gen.make_request("fake-test-token", self.src, self.src["sound_effects"][0], opener=opener)
        self.assertEqual(sound[:3], b"ID3")
        self.assertEqual(billed, "400")
        self.assertEqual(mime, "audio/mpeg")

    def test_07_atomic_write_and_hash(self):
        with tempfile.TemporaryDirectory() as d:
            f = Path(d) / "nested" / "test.mp3"
            gen.write_atomic(f, b"ID3" + b"\x01" * 2048)
            self.assertEqual(gen.sha256_bytes(f.read_bytes()), gen.sha256_bytes(b"ID3" + b"\x01" * 2048))

    def test_08_dry_run_is_network_free_and_full_count(self):
        cmd = [sys.executable, str(MODULE_FILE)]
        env = dict(os.environ)
        env.pop("ELEVENLABS_API_KEY", None)
        p = subprocess.run(cmd, capture_output=True, text=True, env=env, timeout=15)
        self.assertEqual(p.returncode, 0, p.stderr)
        report = json.loads(p.stdout)
        self.assertEqual(report["mode"], "DRY_RUN__NO_API_CALLS")
        self.assertEqual(report["calls_planned"], 48)
        self.assertEqual(len(report["planned_files"]), 48)

    def test_09_execute_without_key_must_fail_before_network(self):
        env = dict(os.environ)
        env.pop("ELEVENLABS_API_KEY", None)
        p = subprocess.run([sys.executable, str(MODULE_FILE), "--execute", "--max-calls", "1"],
                           capture_output=True, text=True, env=env, timeout=15)
        self.assertEqual(p.returncode, 2)
        self.assertIn("ELEVENLABS_API_KEY", p.stderr)

    def test_10_existing_canonical_assets_are_not_output_targets(self):
        self.assertEqual(self.src["relative_output_dir"],
                         "media/3D_Assets/Audio/KFB Racer/grid_r1/")
        filenames = [name for _, _, name in gen.plan(self.src)]
        self.assertNotIn("Seamless_10–12_secon_#1-1789884544910.mp3", filenames)
        self.assertTrue(all("/" not in name and "\\" not in name for name in filenames))


if __name__ == "__main__":
    unittest.main()
