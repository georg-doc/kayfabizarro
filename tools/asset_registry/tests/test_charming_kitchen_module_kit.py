import json
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parents[3]
KIT=ROOT/"tools/asset_registry/module-kits/tiny-treats-charming-kitchen-1-1-free"
LIB=ROOT/"tools/asset_registry/librarian"
GDS=ROOT/"game-ready/module-kits/tiny-treats-charming-kitchen-1-1-free"

class CharmingKitchenModuleKitTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.profile=json.loads((KIT/"PACK_PROFILE.json").read_text())
        cls.library=json.loads((KIT/"MODULE_LIBRARY.json").read_text())
        cls.package=json.loads((GDS/"GAME_ASSET_PACKAGE.json").read_text())
    def test_all_118_models_classified(self):
        self.assertEqual(self.library["classificationCoverage"],{"classified":118,"total":118,"unclassified":0})
        self.assertEqual(len(self.library["modules"]),118)
        self.assertEqual(len({m["assetId"] for m in self.library["modules"]}),118)
        self.assertEqual({x["id"]:x["count"] for x in self.library["lanes"]},{"build":69,"furnish":26,"story":23})
    def test_every_source_and_dependency_exists(self):
        for m in self.library["modules"]:
            self.assertTrue((ROOT/m["source"]["path"]).is_file(),m["source"]["path"])
            for dep in m["dependencies"]:
                if dep["status"]=="ok": self.assertTrue((ROOT/dep["path"]).is_file(),dep["path"])
    def test_sample_recipes_reference_real_modules(self):
        ids={m["assetId"] for m in self.library["modules"]}
        for p in sorted((KIT/"SAMPLE_RECIPES").glob("*.json")):
            r=json.loads(p.read_text())
            self.assertTrue(r["items"],p.name)
            for item in r["items"]: self.assertIn(item["assetId"],ids,(p.name,item["assetId"]))
    def test_license_and_gds_boundary(self):
        self.assertEqual(self.profile["license"]["spdx"],"CC0-1.0")
        self.assertEqual(self.package["license"]["spdx"],"CC0-1.0")
        self.assertIn("GAME_DEV_CLI_UNAVAILABLE",self.package["validation"]["gameDevCli"])
        self.assertEqual(self.package["validation"]["packageVerifyReceipt"],"NOT_RUN")
    def test_no_asset_copies_in_module_or_package(self):
        forbidden={".gltf",".glb",".bin",".png",".jpg",".jpeg",".webp"}
        for root in (KIT,GDS):
            self.assertFalse([p for p in root.rglob("*") if p.suffix.lower() in forbidden])
    def test_librarian_workbench_and_stage_wiring(self):
        html=(LIB/"index.html").read_text()
        app=(LIB/"app.js").read_text()
        self.assertIn('id="moduleKitPanel"',html)
        self.assertIn("module-kit.css",html)
        self.assertIn("initModuleKitWorkbench",app)
        self.assertIn("resolveAlias",app)
        stage=(ROOT/"kfb-hub/stage/c0-a1-charming-kitchen/index.html").read_text()
        self.assertIn("tiny-treats-charming-kitchen-1-1-free",stage)
        self.assertIn("/asset-librarian/?pack=",stage)
    def test_gds_catalog_contains_package(self):
        c=json.loads((ROOT/"tools/game-dev-studio/catalog.json").read_text())
        ids={p["id"] for p in c["packages"]}
        self.assertIn("module-kit-tiny-treats-charming-kitchen-1-1-free",ids)

if __name__=="__main__":
    unittest.main()
