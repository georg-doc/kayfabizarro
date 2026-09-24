import json
import tempfile
import unittest
from pathlib import Path

import sys

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
import render_desk  # noqa: E402


class RenderDeskTests(unittest.TestCase):
    def test_rendered_embedded_registry_round_trips(self):
        source = HERE.parents[2] / "registry" / "production" / "v1"
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp) / "desk.html"
            render_desk.render(source, HERE.parent / "desk" / "desk.template.html", out)
            parsed = render_desk.embedded_payload(out.read_text(encoding="utf-8"))
            self.assertEqual(parsed["manifest"], json.loads((source / "manifest.json").read_text()))
            self.assertGreater(len(parsed["lanes"]["lanes"]), 0)

    def test_invalid_embedded_payload_is_rejected(self):
        with self.assertRaises(json.JSONDecodeError):
            render_desk.embedded_payload(
                '<script id="embedded-registry" type="application/json">{"bad":</script>'
            )


if __name__ == "__main__":
    unittest.main()
