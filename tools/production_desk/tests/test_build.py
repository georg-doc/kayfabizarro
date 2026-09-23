import copy
import json
import sys
import tempfile
import unittest
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import build  # noqa: E402

REPO = "georg-doc/kayfabizarro"


def base_cfg():
    return {
        "schema": "kfb.production-desk-config/1",
        "repo": REPO,
        "staleAfterHours": 8,
        "lanes": [
            {"id": "a", "bucket": "RUNNING", "title": "A", "what": "a", "provider": "Coworker",
             "yourAction": "", "waitingFor": "", "questions": [], "pr": 1, "branch": "br-a",
             "expectedHead": "h1",
             "brief": {"label": "Start", "path": "docs/a.md", "ref": "br-a", "pasteReady": True}},
            {"id": "b", "bucket": "LOOK_AT", "title": "B", "what": "b", "provider": "Web",
             "yourAction": "Anschauen", "waitingFor": "", "questions": ["Passt es?"], "pr": 2,
             "branch": "br-b", "expectedHead": "h2"},
            {"id": "ext", "bucket": "WAITING", "title": "Ext", "what": "x", "provider": "Web",
             "yourAction": "", "waitingFor": "später", "questions": [], "repo": "georg-doc/Other",
             "pr": 9, "external": True,
             "lastKnown": {"head": "e9", "recordedAt": "2026-09-23T20:00:00Z", "note": ""}},
        ],
        "wsa": {"state": "NOT_NEEDED", "text": "nicht nötig"},
        "standards": [{"label": "S", "path": "s.md", "ref": "main"}],
    }


def pr(n, head, state="open", merged=False, ref=None):
    return {"number": n, "title": f"PR {n}", "state": state, "draft": True, "merged": merged,
            "headRef": ref or f"br-{n}", "headSha": head, "updatedAt": "2026-09-23T20:00:00Z",
            "url": f"https://github.com/{REPO}/pull/{n}"}


def base_fixture():
    return {
        f"pr:{REPO}#1": pr(1, "h1", ref="br-a"),
        f"pr:{REPO}#2": pr(2, "h2", ref="br-b"),
        f"content:{REPO}@br-a:docs/a.md": {"sha": "blob-a"},
    }


def run(cfg=None, fx=None):
    f = build.FixtureFetcher(fx if fx is not None else base_fixture())
    files = build.build(cfg or base_cfg(), f, {"commit": "c0", "ref": "main", "mode": "fixture"})
    return files, f


def lane(files, lid):
    return next(l for l in files["lanes.json"]["lanes"] if l["id"] == lid)


class BuildTests(unittest.TestCase):
    def test_buckets_and_counts(self):
        files, _ = run()
        c = files["manifest.json"]["counts"]
        self.assertEqual((c["RUNNING"], c["LOOK_AT"], c["WAITING"], c["CAN_START"]), (1, 1, 1, 0))
        self.assertEqual(c["problems"], 0)
        self.assertEqual(lane(files, "a")["freshness"], "CURRENT")

    def test_external_lane_is_never_fetched_and_last_known(self):
        files, f = run()
        ext = lane(files, "ext")
        self.assertEqual(ext["freshness"], "LAST_KNOWN")
        self.assertEqual(ext["head"], "e9")
        self.assertFalse(any("georg-doc/Other" in k for k in f.calls),
                         "external repo must not be read by the same-repo builder")

    def test_head_moved_is_flagged(self):
        fx = base_fixture()
        fx[f"pr:{REPO}#2"] = pr(2, "h2-new", ref="br-b")
        files, _ = run(fx=fx)
        self.assertEqual(lane(files, "b")["freshness"], "MOVED")
        self.assertEqual(files["manifest.json"]["counts"]["moved"], 1)

    def test_merged_pr_leaves_active_buckets(self):
        fx = base_fixture()
        fx[f"pr:{REPO}#2"] = pr(2, "h2", state="closed", merged=True, ref="br-b")
        files, _ = run(fx=fx)
        self.assertEqual(lane(files, "b")["freshness"], "CLOSED")
        self.assertEqual(files["manifest.json"]["counts"]["LOOK_AT"], 0)
        self.assertEqual(files["reviews.json"]["reviews"], [])

    def test_missing_brief_is_a_problem_not_a_copy_action(self):
        fx = base_fixture()
        fx[f"content:{REPO}@br-a:docs/a.md"] = None
        files, _ = run(fx=fx)
        a = lane(files, "a")
        self.assertFalse(a["brief"]["exists"])
        kinds = [p["kind"] for p in files["problems.json"]["problems"]]
        self.assertIn("brief-missing", kinds)

    def test_brief_urls_point_at_exact_ref(self):
        files, _ = run()
        b = lane(files, "a")["brief"]
        self.assertEqual(b["blob"], "blob-a")
        self.assertTrue(b["rawUrl"].startswith("https://raw.githubusercontent.com/georg-doc/kayfabizarro/br-a/"))

    def test_content_hash_ignores_timestamps(self):
        f1, _ = run()
        f2, _ = run()
        self.assertEqual(f1["manifest.json"]["contentHash"], f2["manifest.json"]["contentHash"])
        fx = base_fixture()
        fx[f"pr:{REPO}#2"] = pr(2, "h2-new", ref="br-b")
        f3, _ = run(fx=fx)
        self.assertNotEqual(f1["manifest.json"]["contentHash"], f3["manifest.json"]["contentHash"])

    def test_status_file_overrides_config(self):
        cfg = base_cfg()
        cfg["lanes"][0]["statusFile"] = "KFB_STATUS.json"
        fx = base_fixture()
        fx[f"status:{REPO}@br-a:KFB_STATUS.json"] = {
            "bucket": "LOOK_AT", "yourAction": "Bitte anschauen", "recordedHead": "h1"}
        files, _ = run(cfg=cfg, fx=fx)
        a = lane(files, "a")
        self.assertEqual(a["bucket"], "LOOK_AT")
        self.assertEqual(a["yourAction"], "Bitte anschauen")

    def test_fetch_failure_becomes_visible_problem(self):
        fx = base_fixture()
        del fx[f"pr:{REPO}#2"]
        files, _ = run(fx=fx)
        self.assertEqual(lane(files, "b")["freshness"], "UNVERIFIED")
        self.assertIn("fetch-failed", [p["kind"] for p in files["problems.json"]["problems"]])

    def test_written_registry_validates_and_tamper_is_detected(self):
        files, _ = run()
        with tempfile.TemporaryDirectory() as d:
            out = Path(d)
            build.write(out, files)
            self.assertEqual(build.validate(out), [])
            lanes = json.loads((out / "lanes.json").read_text())
            lanes["lanes"][0]["title"] = "tampered"
            (out / "lanes.json").write_text(json.dumps(lanes))
            self.assertIn("contentHash does not match files", build.validate(out))

    def test_config_rejects_bad_bucket_and_external_without_last_known(self):
        cfg = base_cfg()
        cfg["lanes"][0]["bucket"] = "SOMEDAY"
        del cfg["lanes"][2]["lastKnown"]
        errs = build.validate_config(cfg)
        self.assertEqual(len(errs), 2)

    def test_tools_only_openable_when_route_exists(self):
        cfg = base_cfg()
        cfg["publication"] = {"repo": REPO, "ref": "live", "base": "https://x.dev/"}
        cfg["tools"] = [
            {"group": "G", "id": "t1", "title": "T1", "what": "", "status": "Fertig", "path": "a/index.html"},
            {"group": "G", "id": "t2", "title": "T2", "what": "", "status": "Fertig", "path": "b/index.html"}]
        cfg["archive"] = [{"label": "Alt", "path": "old/index.html"}, {"label": "GH", "url": "https://github.com"}]
        fx = base_fixture()
        fx[f"content:{REPO}@live:a/index.html"] = {"sha": "s1"}
        fx[f"content:{REPO}@live:b/index.html"] = None
        fx[f"content:{REPO}@live:old/index.html"] = {"sha": "s2"}
        files, _ = run(cfg=cfg, fx=fx)
        tools = {t["id"]: t for t in files["tools.json"]["tools"]}
        self.assertTrue(tools["t1"]["available"])
        self.assertEqual(tools["t1"]["url"], "https://x.dev/a/")
        self.assertFalse(tools["t2"]["available"])
        self.assertIn("tool-route-missing", [p["kind"] for p in files["problems.json"]["problems"]])
        self.assertEqual(files["manifest.json"]["counts"]["tools"], 1)
        self.assertTrue(all(a["available"] for a in files["tools.json"]["archive"]))

    def test_repo_config_is_valid(self):
        cfg = json.loads((HERE.parent / "config.json").read_text(encoding="utf-8"))
        self.assertEqual(build.validate_config(cfg), [])
        ext = [l for l in cfg["lanes"] if l.get("external")]
        self.assertTrue(ext, "Travel/Racer must stay external")


if __name__ == "__main__":
    unittest.main()
