import os
from pathlib import Path
import tempfile
import unittest
import zipfile

from tools.asset_registry.unpack_asset_pack import UnpackError, unpack_archive


class UnpackAssetPackTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.previous = Path.cwd()
        self.repo = Path(self.temp.name)
        (self.repo / "media" / "3D_Assets").mkdir(parents=True)
        os.chdir(self.repo)

    def tearDown(self):
        os.chdir(self.previous)
        self.temp.cleanup()

    def make_zip(self, name="Pack.zip", members=None):
        archive = self.repo / "media" / "3D_Assets" / name
        with zipfile.ZipFile(archive, "w") as output:
            for path, content in (members or {"Models/tree.obj": b"mesh", "License.txt": b"CC0"}).items():
                output.writestr(path, content)
        return archive

    def test_extracts_inventory_and_removes_source(self):
        archive = self.make_zip()
        manifest = unpack_archive(archive, archive.with_suffix(""), remove_zip=True)
        self.assertFalse(archive.exists())
        self.assertEqual(manifest["fileCount"], 2)
        self.assertEqual(manifest["licenseFiles"], ["License.txt"])
        self.assertTrue((archive.with_suffix("") / "Models" / "tree.obj").is_file())
        self.assertTrue((archive.with_suffix("") / "_kfb-unpack-manifest.json").is_file())

    def test_rejects_parent_traversal(self):
        archive = self.make_zip(members={"../escape.obj": b"no"})
        with self.assertRaises(UnpackError):
            unpack_archive(archive, archive.with_suffix(""))

    def test_refuses_existing_target(self):
        archive = self.make_zip()
        archive.with_suffix("").mkdir()
        with self.assertRaises(UnpackError):
            unpack_archive(archive, archive.with_suffix(""))


if __name__ == "__main__":
    unittest.main()
