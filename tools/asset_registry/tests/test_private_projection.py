import importlib.util
import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "private_projection.py"
spec = importlib.util.spec_from_file_location("kfb_private_projection", MODULE_PATH)
projection = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(projection)

BUILD_PATH = Path(__file__).resolve().parents[1] / "build.py"
build_spec = importlib.util.spec_from_file_location("kfb_build_with_projection", BUILD_PATH)
build = importlib.util.module_from_spec(build_spec)
assert build_spec.loader is not None
build_spec.loader.exec_module(build)

QUERY_PATH = Path(__file__).resolve().parents[1] / "query.py"
query_spec = importlib.util.spec_from_file_location("kfb_query_with_projection", QUERY_PATH)
query = importlib.util.module_from_spec(query_spec)
assert query_spec.loader is not None
query_spec.loader.exec_module(query)


def intake_fixture() -> dict:
    return {
        "schema": "kfb.asset-intake.v1",
        "intakeId": "intake-2026-10-09-qa",
        "assetClass": "MUSIC",
        "sourceVisibility": "PRIVATE",
        "title": "Whispering Woods",
        "artist": "Pizza Doggy",
        "collection": "Cozy Tunes - The Classics",
        "creditText": "Music by Pizza Doggy",
        "roleTags": ["forest", "cozy", "forest"],
        "files": [
            {
                "name": "whispering-woods.ogg",
                "mime": "audio/ogg",
                "sizeBytes": 12345,
                "sha256": "a" * 64,
                "inboxFileId": "private-file-do-not-project",
            }
        ],
        "audio": {
            "audioClass": "MUSIC",
            "durationSec": 93.2,
            "loopClass": "UNKNOWN",
            "runtimeStatus": "INTAKE_ONLY",
        },
    }


class PrivateProjectionTests(unittest.TestCase):
    def test_private_intake_projects_public_safe_audio_metadata(self):
        record = projection.project_intake(intake_fixture(), asset_key="whispering-woods")
        self.assertEqual(record["assetId"], "private:whispering-woods")
        self.assertEqual(record["path"], "private://whispering-woods")
        self.assertEqual(record["kind"], "audio")
        self.assertEqual(record["artist"], "Pizza Doggy")
        self.assertEqual(record["audio"]["audioClass"], "MUSIC")
        self.assertEqual(record["delivery"]["previewStatus"], "PENDING")
        self.assertNotIn("private-file-do-not-project", json.dumps(record))
        self.assertNotIn("inboxFileId", json.dumps(record))

    def test_projection_rejects_private_storage_identifiers(self):
        record = projection.project_intake(intake_fixture())
        record["inboxFileId"] = "secret"
        with self.assertRaisesRegex(projection.ProjectionError, "forbidden private field"):
            projection.validate_projection_record(record)

        record = projection.project_intake(intake_fixture())
        record["provenance"]["objectKey"] = "private/object"
        with self.assertRaisesRegex(projection.ProjectionError, "forbidden private field"):
            projection.validate_projection_record(record)

    def test_projection_rejects_private_storage_urls(self):
        intake = intake_fixture()
        intake["delivery"] = {"previewUrl": "https://private.example.test/song.ogg"}
        with self.assertRaisesRegex(projection.ProjectionError, "private storage host"):
            projection.project_intake(intake)

        intake["delivery"] = {"previewUrl": "https://assets.example.test/api/intake/files/private-id"}
        with self.assertRaisesRegex(projection.ProjectionError, "private storage path"):
            projection.project_intake(intake)

    def test_live_document_is_sorted_and_duplicate_safe(self):
        first = projection.project_intake(intake_fixture(), asset_key="b-track")
        second = projection.project_intake(
            {**intake_fixture(), "intakeId": "second", "title": "A Track"},
            asset_key="a-track",
        )
        with tempfile.TemporaryDirectory() as td:
            path = Path(td) / "live.json"
            path.write_text(
                json.dumps(
                    {
                        "schema": "kfb.asset-private-live.v1",
                        "revision": "qa",
                        "assets": [first, second],
                    }
                ),
                encoding="utf-8",
            )
            _, rows = projection.load_live_document(path)
            self.assertEqual([row["assetId"] for row in rows], ["private:a-track", "private:b-track"])

    def test_registry_build_and_normal_query_merge_private_projection(self):
        with tempfile.TemporaryDirectory() as td:
            repo = Path(td)
            subprocess.run(["git", "init", "-q"], cwd=repo, check=True)
            subprocess.run(["git", "config", "user.email", "test@example.invalid"], cwd=repo, check=True)
            subprocess.run(["git", "config", "user.name", "KFB Test"], cwd=repo, check=True)
            public = repo / "media/2D_Assets/Test/icon.png"
            public.parent.mkdir(parents=True)
            public.write_bytes(b"png")
            live = repo / "tools/asset_registry/librarian/live/private-asset-live.json"
            live.parent.mkdir(parents=True)
            private = projection.project_intake(intake_fixture(), asset_key="whispering-woods")
            live.write_text(json.dumps({"schema": projection.LIVE_SCHEMA, "revision": "qa", "assets": [private]}), encoding="utf-8")
            subprocess.run(["git", "add", "."], cwd=repo, check=True)
            env = os.environ.copy()
            env.update({"GIT_AUTHOR_DATE": "2026-10-09T12:00:00+02:00", "GIT_COMMITTER_DATE": "2026-10-09T12:00:00+02:00"})
            subprocess.run(["git", "commit", "-qm", "fixture"], cwd=repo, check=True, env=env)
            out = repo / "registry/assets/v1"
            manifest = build.build_registry(repo, {"sourceRepo": "georg-doc/kayfabizarro", "roots": ["media/2D_Assets"], "excludePrefixes": [], "privateProjection": "tools/asset_registry/librarian/live/private-asset-live.json", "output": "registry/assets/v1"}, out)
            self.assertEqual(manifest["privateProjection"]["count"], 1)
            _, rows = query.load_records(out)
            match = next(row for row in rows if row["assetId"] == "private:whispering-woods")
            self.assertEqual(match["artist"], "Pizza Doggy")
            self.assertNotIn("inboxFileId", json.dumps(match))


if __name__ == "__main__":
    unittest.main()
